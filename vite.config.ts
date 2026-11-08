import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/react-form-builder",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-hook-form"],
          mui: ["@mui/material", "@mui/x-tree-view"],
          icons: ["@mui/icons-material"],
          vendor: ["immer", "nanoid"],
        },
      },
    },
  },
});
