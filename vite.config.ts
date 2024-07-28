import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 700 },
  resolve: {
    alias: [
      { find: "./runtimeConfig", replacement: "./runtimeConfig.browser" },
      {
        find: "~/",
        replacement: path.posix.join(__dirname, "src/"),
      },
    ],
  },
});
