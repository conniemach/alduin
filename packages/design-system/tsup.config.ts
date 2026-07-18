import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.banner = { js: '"use client";' };
  },
  onSuccess: async () => {
    const { execSync } = await import("node:child_process");
    execSync(
      "npx @tailwindcss/cli -i ./src/styles/globals.css -o ./dist/styles.css",
      { stdio: "inherit" },
    );
  },
});
