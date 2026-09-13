import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    root: ".",
    plugins: [react()],
    define: {
      "import.meta.env.BACKEND_API_URL": JSON.stringify(
        env.BACKEND_API_URL || "",
      ),
    },
    server: { port: 5173, proxy: { "/api": "http://localhost:3001" } },
  };
});
