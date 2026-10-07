import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { dispatchApi } from "./server/dispatch.ts";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function weatherDevApi(): Plugin {
  const attach = (
    middlewares: {
      use: (
        handler: (
          req: IncomingMessage,
          res: ServerResponse,
          next: (error?: unknown) => void
        ) => void
      ) => void;
    },
    mode: string
  ) => {
    middlewares.use(async (req, res, next) => {
      const rawUrl = req.url;
      if (!rawUrl?.startsWith("/api/")) {
        next();
        return;
      }

      try {
        const env = loadEnv(mode, rootDir, "");
        const result = await dispatchApi(new URL(rawUrl, "http://localhost"), env);
        res.statusCode = result.status;
        for (const [key, value] of Object.entries(result.headers)) {
          res.setHeader(key, value);
        }
        res.end(result.body);
      } catch (error) {
        console.error("Dev weather API failed", error);
        res.statusCode = 500;
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.end(
          JSON.stringify({
            error: true,
            code: 500,
            message: "Weather service request failed",
          })
        );
      }
    });
  };

  return {
    name: "weather-dev-api",
    configureServer(server) {
      attach(server.middlewares, server.config.mode);
    },
    configurePreviewServer(server) {
      attach(server.middlewares, server.config.mode);
    },
  };
}

export default defineConfig({
  plugins: [react(), weatherDevApi()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
});
