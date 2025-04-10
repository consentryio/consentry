import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: false, // ✅ Stop tsup from building declaration files
  sourcemap: true,
  clean: true,
  target: "es2020",
});
