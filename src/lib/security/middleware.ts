import React from "react";

/**
 * Security middleware for production hardening
 * Provides CSRF protection, rate limiting, input validation, and audit logging
 */

import type { Context, Next } from "hono";

interface SecurityConfig {
	enableCSRF?: boolean;
	enableRateLimit?: boolean;
	enableInputValidation?: boolean;
	enableAuditLogging?: boolean;
	rateLimitWindow?: number; // milliseconds
	rateLimitMaxRequests?: number;
	csrfHeaderName?: string;
	auditEndpoint?: string;
}

interface SecurityMetrics {
	totalRequests: number;
	blockedRequests: number;
	rateLimitHits: number;
	csrfFailures: number;
	inputValidationFailures: number;
	suspiciousActivity: number;
}

interface RateLimitStore {
	[key: string]: {
		requests: number;
		windowStart: number;
	};
}

class SecurityMiddleware {
	private config: SecurityConfig;
	private rateLimitStore: RateLimitStore = {};
	private csrfTokens = new Map<string, { token: string; expires: number }>();
	private metrics: SecurityMetrics = {
		totalRequests: 0,
		blockedRequests: 0,
		rateLimitHits: 0,
		csrfFailures: 0,
		inputValidationFailures: 0,
		suspiciousActivity: 0,
	};

	constructor(config: SecurityConfig = {}) {
		this.config = {
			enableCSRF: true,
			enableRateLimit: true,
			enableInputValidation: true,
			enableAuditLogging: true,
			rateLimitWindow: 15 * 60 * 1000, // 15 minutes
			rateLimitMaxRequests: 100,
			csrfHeaderName: "X-CSRF-Token",
			auditEndpoint: "/api/security/audit",
			...config,
		};

		// Clean up expired rate limit entries periodically
		setInterval(() => {
			this.cleanupRateLimit();
		}, 60000); // Every minute

		// Clean up expired CSRF tokens periodically
		setInterval(() => {
			this.cleanupCSRFTokens();
		}, 300000); // Every 5 minutes
	}

	public middleware() {
		return async (c: Context, next: Next) => {
			this.metrics.totalRequests++;

			// Collect request metadata for security logging
			const requestMetadata = {
				ip:
					c.req.header("x-forwarded-for") ||
					c.req.header("x-real-ip") ||
					c.env?.remoteAddr ||
					"unknown",
				userAgent: c.req.header("user-agent") || "unknown",
				method: c.req.method,
				url: c.req.url,
				timestamp: new Date().toISOString(),
			};

			try {
				// 1. Rate limiting
				if (this.config.enableRateLimit) {
					const rateLimitResult = await this.checkRateLimit(requestMetadata.ip);
					if (!rateLimitResult.allowed) {
						this.metrics.rateLimitHits++;
						this.logSecurityEvent("rate_limit_exceeded", requestMetadata);
						return c.json({ error: "Rate limit exceeded. Please try again later." }, 429);
					}
				}

				// 2. Input validation and sanitization
				if (this.config.enableInputValidation && ["POST", "PUT", "PATCH"].includes(c.req.method)) {
					const validationResult = await this.validateAndSanitizeInput(c);
					if (!validationResult.valid) {
						this.metrics.inputValidationFailures++;
						this.logSecurityEvent("invalid_input_detection", requestMetadata);
						return c.json(
							{ error: "Invalid input detected", details: validationResult.errors },
							400
						);
					}
				}

				// 3. CSRF protection for state-changing requests
				if (this.config.enableCSRF && ["POST", "PUT", "DELETE"].includes(c.req.method)) {
					const csrfResult = await this.checkCSRFToken(c);
					if (!csrfResult.valid) {
						this.metrics.csrfFailures++;
						this.logSecurityEvent("csrf_failure", requestMetadata);
						return c.json({ error: "Invalid or missing CSRF token" }, 403);
					}
				}

				// 4. Security headers
				this.addSecurityHeaders(c);

				// 5. Continue to the next middleware
				await next();

				// 6. Log successful request (if audit logging is enabled)
				if (this.config.enableAuditLogging) {
					this.logSecurityEvent("request_completed", requestMetadata, 200);
				}
			} catch (error) {
				this.metrics.blockedRequests++;
				this.logSecurityEvent("security_violation", requestMetadata, 500);
				throw error;
			}
		};
	}

	private async checkRateLimit(clientId: string): Promise<{ allowed: boolean }> {
		const now = Date.now();
		const windowStart = now - this.config.rateLimitWindow!;

		// Initialize or get client data
		let clientData = this.rateLimitStore[clientId];
		if (!clientData || clientData.windowStart < windowStart) {
			clientData = {
				requests: 0,
				windowStart: now,
			};
			this.rateLimitStore[clientId] = clientData;
		}

		clientData.requests++;

		return {
			allowed: clientData.requests <= this.config.rateLimitMaxRequests!,
		};
	}

	private async validateAndSanitizeInput(
		c: Context
	): Promise<{ valid: boolean; errors?: string[] }> {
		const errors: string[] = [];

		try {
			// Get request body for POST/PUT/PATCH requests
			if (["POST", "PUT", "PATCH"].includes(c.req.method)) {
				const _body = await c.req.parseBody();

				// Check for common attack patterns
				if (_body) {
					for (const [key, value] of Object.entries(_body)) {
						if (typeof value === "string") {
							// SQL injection patterns
							if (this.detectSQLInjection(value)) {
								errors.push(`Potentially malicious input detected in field: ${key}`);
							}

							// XSS patterns
							if (this.detectXSS(value)) {
								errors.push(`Potentially dangerous script detected in field: ${key}`);
							}

							// Path traversal patterns
							if (this.detectPathTraversal(value)) {
								errors.push(`Suspicious file path in field: ${key}`);
							}

							// Command injection patterns
							if (this.detectCommandInjection(value)) {
								errors.push(`Potential command injection in field: ${key}`);
							}
						}
					}
				}
			}

			// Check headers for suspicious patterns
			const suspiciousHeaders = this.checkSuspiciousHeaders(c.req.header());
			if (suspiciousHeaders.length > 0) {
				errors.push(...suspiciousHeaders);
			}

			return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
		} catch (error) {
			return { valid: false, errors: ["Input validation failed"] };
		}
	}

	private detectSQLInjection(input: string): boolean {
		const sqlPatterns = [
			/('|(\\)|(\\)|(--|\/\*|\*\/|;|@@|@|char|declare|exec|cast|drop|insert|select|alter|create|delete|update|union|script|javascript))/i,
			/(%27)|(')|(--)|(%23)|(#)/i,
			/(%3D)|(=)[^\n]*(%27)|(')|(--)|(%3B)|(;)/i,
			/\w*((%27)|('))((%6F)|o|(%4F))((%72)|r|(%52))/i,
			/((%27)|('))union/i,
		];

		return sqlPatterns.some((pattern) => pattern.test(input));
	}

	private detectXSS(input: string): boolean {
		const xssPatterns = [
			/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
			/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
			/javascript:/gi,
			/on\w+\s*=\s*["'][^"']*["']/gi,
			/on\w+\s*=\s*\w+/gi,
		];

		return xssPatterns.some((pattern) => pattern.test(input));
	}

	private detectPathTraversal(input: string): boolean {
		const traversalPatterns = [
			/\.\./g,
			/\/etc\/passwd/i,
			/\/windows\/system32/i,
			/\\windows\\system32/i,
			/\.\.\\|\.\.\/|\.\.\\\.\./gi,
		];

		return traversalPatterns.some((pattern) => pattern.test(input));
	}

	private detectCommandInjection(input: string): boolean {
		const commandPatterns = [
			/[|&;<>]/gi,
			/\. *\/|\. *\\|&cmd|&echo|\$\(|\$\(\(.*\)\)/gi,
			/wget |curl |nc |rm |cat /gi,
		];

		return commandPatterns.some((pattern) => pattern.test(input));
	}

	private checkSuspiciousHeaders(headers: Record<string, string>): string[] {
		const errors: string[] = [];

		// Check for suspicious User-Agent
		const userAgent = headers["user-agent"] || "";
		const suspiciousAgents = [
			/curl|wget|python|java|perl|php|ruby|go|rust/i,
			/bot|crawler|spider|scraper/i,
		];

		if (suspiciousAgents.some((pattern) => pattern.test(userAgent))) {
			errors.push("Suspicious User-Agent detected");
		}

		// Check for missing headers that should be present
		if (!headers["accept"]) {
			errors.push("Missing Accept header");
		}

		return errors;
	}

	private async checkCSRFToken(c: Context): Promise<{ valid: boolean }> {
		const token = c.req.header(this.config.csrfHeaderName!) || c.req.header("X-CSRF-Token");

		// For safe endpoints, skip CSRF check
		if (this.isSafeEndpoint(c.req.path)) {
			return { valid: true };
		}

		if (!token) {
			return { valid: false };
		}

		// Get session info (would need to be implemented based on auth system)
		const sessionId = this.getSessionId(c);
		if (!sessionId) {
			return { valid: false };
		}

		// Check if token exists and is valid
		const storedToken = this.csrfTokens.get(sessionId);
		if (!storedToken || storedToken.token !== token || Date.now() > storedToken.expires) {
			return { valid: false };
		}

		// Use token once (single-use tokens are more secure)
		this.csrfTokens.delete(sessionId);

		return { valid: true };
	}

	private isSafeEndpoint(path: string): boolean {
		const safeEndpoints = ["/api/health", "/api/time-clock/pin", "/api/time-clock/clock-in"];
		return safeEndpoints.some((endpoint) => path.startsWith(endpoint));
	}

	private getSessionId(c: Context): string | null {
		// This would need to be implemented based on your auth system
		// For now, return a placeholder
		return c.get("sessionId") || null;
	}

	private generateCSRFToken(sessionId: string): string {
		const token = Buffer.from(`${sessionId}:${Date.now()}:${Math.random().toString(36)}`).toString(
			"base64"
		);

		// Store token with expiry (1 hour)
		this.csrfTokens.set(sessionId, {
			token,
			expires: Date.now() + 60 * 60 * 1000,
		});

		return token;
	}

	private addSecurityHeaders(c: Context): void {
		// Content Security Policy (CSP)
		c.header(
			"Content-Security-Policy",
			"default-src 'self'; " +
				"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
				"style-src 'self' 'unsafe-inline'; " +
				"img-src 'self' data:; " +
				"font-src 'self'; " +
				"connect-src 'self'; " +
				"frame-ancestors 'none'; " +
				"base-uri 'self';"
		);

		// Prevent MIME type sniffing
		c.header("X-Content-Type-Options", "nosniff");

		// Prevent clickjacking
		c.header("X-Frame-Options", "DENY");

		// Enable XSS protection
		c.header("X-XSS-Protection", "1; mode=block");

		// Force HTTPS
		c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

		// Referrer policy
		c.header("Referrer-Policy", "strict-origin-when-cross-origin");

		// Permissions policy
		c.header(
			"Permissions-Policy",
			"camera=(), " + "microphone=(), " + "geolocation=(), " + "interest-cohort=()"
		);
	}

	private async logSecurityEvent(event: string, metadata: any, statusCode?: number): Promise<void> {
		if (!this.config.enableAuditLogging) return;

		try {
			const logEntry = {
				timestamp: new Date().toISOString(),
				event,
				metadata,
				currentStatus: {
					metrics: this.metrics,
				},
				...(statusCode && { statusCode }),
			};

			// In a real application, you'd send this to a logging service
			console.log("[SECURITY AUDIT]", JSON.stringify(logEntry, null, 2));

			// Optionally send to external logging service
			if (this.config.auditEndpoint) {
				fetch(this.config.auditEndpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(logEntry),
				}).catch((err) => {
					console.error("Failed to send security audit log:", err);
				});
			}
		} catch (error) {
			console.error("Security logging failed:", error);
		}
	}

	private cleanupRateLimit(): void {
		const now = Date.now();
		const windowStart = now - this.config.rateLimitWindow!;

		for (const [clientId, data] of Object.entries(this.rateLimitStore)) {
			if (data.windowStart < windowStart) {
				delete this.rateLimitStore[clientId];
			}
		}
	}

	private cleanupCSRFTokens(): void {
		const now = Date.now();

		for (const [sessionId, tokenData] of this.csrfTokens.entries()) {
			if (tokenData.expires < now) {
				this.csrfTokens.delete(sessionId);
			}
		}
	}

	// Public methods for external access
	public getMetrics(): SecurityMetrics {
		return { ...this.metrics };
	}

	public generateTokenForSession(sessionId: string): string {
		return this.generateCSRFToken(sessionId);
	}

	public resetMetrics(): void {
		this.metrics = {
			totalRequests: 0,
			blockedRequests: 0,
			rateLimitHits: 0,
			csrfFailures: 0,
			inputValidationFailures: 0,
			suspiciousActivity: 0,
		};
	}

	public async blockIP(ip: string, duration = 24 * 60 * 60 * 1000): Promise<void> {
		// Implementation would depend on your security infrastructure
		console.log(`IP ${ip} blocked for ${duration}ms`);
	}
}

// React hook for CSRF tokens
export function useCSRFToken() {
	const [token, setToken] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		const fetchCSRFToken = async () => {
			try {
				const response = await fetch("/api/csrf-token", {
					method: "GET",
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch CSRF token");
				}

				const data = await response.json();
				setToken(data.token);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		};

		fetchCSRFToken();
	}, []);

	return { token, loading, error };
}

// Input validation utilities
export class InputValidator {
	static sanitize(input: string): string {
		return input.replace(/[<>]/g, "").trim();
	}

	static validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	static validatePIN(pin: string): boolean {
		return /^\d{4,6}$/.test(pin);
	}

	static validateEmployeeId(id: string): boolean {
		return /^[a-zA-Z0-9]{8,}-[a-zA-Z0-9]{4,}-[a-zA-Z0-9]{4,}-[a-zA-Z0-9]{4,}-[a-zA-Z0-9]{12,}$/.test(
			id
		);
	}

	static maxLength(input: string, max: number): boolean {
		return input.length <= max;
	}

	static minLength(input: string, min: number): boolean {
		return input.length >= min;
	}

	static sanitizeObjectId(input: string): string {
		// Only allow alphanumeric characters, hyphens, and underscores
		return input.replace(/[^a-zA-Z0-9-_]/g, "");
	}
}

export default SecurityMiddleware;
