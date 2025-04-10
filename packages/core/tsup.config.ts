import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    resolve: true, // ensures .d.ts files are properly linked
  },
  sourcemap: true,
  clean: true,
  target: "es2020"
});
