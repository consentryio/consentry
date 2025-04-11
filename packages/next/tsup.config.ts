// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: false, // To build locally
  sourcemap: true,
  clean: true,
  target: "es2020",
  external: ["consent.config"],
});
