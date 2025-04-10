import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,           // Generate .d.ts files
  format: ["esm", "cjs"], // Output both ESM and CommonJS
  outDir: "dist",
  target: "es2020",
});
