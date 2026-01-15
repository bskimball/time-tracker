import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/styles/index.css"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  tsconfig: "./tsconfig.json",
});
