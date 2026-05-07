import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

const handleRequest = createRequestHandler(build);

export default async function (req, res) {
  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const url = new URL(req.url, `${protocol}://${host}`);

  const request = new Request(url.href, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
    // @ts-ignore
    duplex: "half",
  });

  const response = await handleRequest(request);

  res.status(response.status);
  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }
  
  const body = await response.text();
  res.send(body);
}
