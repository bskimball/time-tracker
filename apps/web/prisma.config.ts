import { defineConfig } from "@prisma/config";
import { config } from "dotenv";
import path from "node:path";

config();

export default defineConfig({
	schema: path.resolve(process.cwd(), "..", "..", "prisma", "schema.prisma"),
	datasource: {
		url: process.env.DATABASE_URL ?? "",
	},
});
