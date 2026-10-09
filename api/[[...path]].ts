import type { IncomingMessage, ServerResponse } from "node:http";
import { dispatchApi } from "../server/dispatch";

function requestUrl(raw: string | undefined) {
  if (!raw) return new URL("http://localhost/");
  if (raw.startsWith("http://") || raw.startsWith("https://")) return new URL(raw);
  return new URL(raw, "http://localhost");
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: true, code: 405, message: "Method not allowed" }));
    return;
  }

  const result = await dispatchApi(requestUrl(req.url), process.env);
  res.statusCode = result.status;
  for (const [key, value] of Object.entries(result.headers)) {
    res.setHeader(key, value);
  }
  res.end(result.body);
}
