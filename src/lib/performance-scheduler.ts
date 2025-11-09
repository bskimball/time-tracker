import { calculateDailyperformanceMetrics } from "./analytics";

/**
 * Background job scheduler for performance metrics
 */

export class PerformanceScheduler {
	private static instance: PerformanceScheduler;
	private isRunning = false;
	private intervalId: NodeJS.Timeout | null = null;

	private constructor() {}

	static getInstance(): PerformanceScheduler {
		if (!PerformanceScheduler.instance) {
			PerformanceScheduler.instance = new PerformanceScheduler();
		}
		return PerformanceScheduler.instance;
	}

	/**
	 * Start the performance calculation scheduler
	 */
	start(intervalMinutes: number = 30): void {
		if (this.isRunning) {
			console.log("Performance scheduler is already running");
			return;
		}

		this.isRunning = true;
		const intervalMs = intervalMinutes * 60 * 1000;

		console.log(`Starting performance calculations every ${intervalMinutes} minutes`);

		// Run immediately on start
		this.runDailyCalculations();

		// Schedule recurring runs
		this.intervalId = setInterval(() => {
			this.runDailyCalculations();
		}, intervalMs);
	}

	/**
	 * Stop the performance calculation scheduler
	 */
	stop(): void {
		if (!this.isRunning) {
			return;
		}

		this.isRunning = false;
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}

		console.log("Performance scheduler stopped");
	}

	/**
	 * Run daily performance calculations
	 */
	private async runDailyCalculations(): Promise<void> {
		try {
			console.log("Running daily performance calculations...");

			// Calculate for yesterday (yesterday's data should be complete)
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);

			await calculateDailyperformanceMetrics(yesterday);

			console.log("Daily performance calculations completed successfully");
		} catch (error) {
			console.error("Error in daily performance calculations:", error);
		}
	}

	/**
	 * Manual trigger for performance calculations (for testing/manual updates)
	 */
	async triggerCalculation(date?: Date): Promise<void> {
		try {
			const targetDate = date || new Date();
			console.log(
				`Manually triggering performance calculations for ${targetDate.toISOString().split("T")[0]}`
			);

			await calculateDailyperformanceMetrics(targetDate);

			console.log("Manual performance calculations completed");
		} catch (error) {
			console.error("Error in manual performance calculations:", error);
			throw error;
		}
	}

	/**
	 * Get scheduler status
	 */
	getStatus(): { running: boolean; nextRun?: Date } {
		return {
			running: this.isRunning,
			// Note: This is a simplified approach. In production, you'd store
			// the actual next run time in a database or in-memory store
			nextRun: this.isRunning ? new Date(Date.now() + 30 * 60 * 1000) : undefined,
		};
	}
}

// Singleton instance for global access
export const performanceScheduler = PerformanceScheduler.getInstance();

/**
 * Initialize performance calculations for production
 * This should be called when the server starts
 */
export async function initializePerformanceCalculations(): Promise<void> {
	// Start the scheduler
	performanceScheduler.start(30); // Run every 30 minutes

	// Calculate metrics for the last 7 days to populate initial data
	const today = new Date();
	for (let i = 7; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);

		try {
			await calculateDailyperformanceMetrics(date);
		} catch (error) {
			console.error(
				`Error calculating performance metrics for ${date.toISOString().split("T")[0]}:`,
				error
			);
		}
	}

	console.log("Performance calculations initialized with 7 days of historical data");
}
