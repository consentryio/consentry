import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  target: "es2020",
  sourcemap: true,
  clean: true,
  dts: true,
  external: ["fs", "path", "./consent.config.js", "./consent.config.ts"],
});
