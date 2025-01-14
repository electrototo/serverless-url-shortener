import { vitePlugin as remix } from "@remix-run/dev";
import { transpileModule } from "typescript";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      ssr: true,
      serverModuleFormat: 'esm'
    }),
    tsconfigPaths(),
  ]
});
