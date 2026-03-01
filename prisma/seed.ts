import { spawn } from "node:child_process";

const child = spawn("npm", ["-w", "apps/web", "run", "db:seed"], {
	cwd: process.cwd(),
	stdio: "inherit",
	shell: process.platform === "win32",
});

child.on("error", (error) => {
	console.error("Failed to execute delegated seed command:", error);
	process.exit(1);
});

child.on("exit", (code, signal) => {
	if (signal) {
		console.error(`Delegated seed command terminated by signal: ${signal}`);
		process.exit(1);
	}

	process.exit(code ?? 1);
});
