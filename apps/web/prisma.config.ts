import { defineConfig } from "@prisma/config";
import { config } from "dotenv";

// Load .env from the current directory
config();

export default defineConfig({
	datasource: {
		url: process.env.DATABASE_URL ?? "",
	},
});
