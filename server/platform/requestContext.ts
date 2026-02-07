import type { Request } from "express";

export type RequestContext = {
  ip: string;
  userAgent: string;
  requestId: string;
};

export function getRequestContext(req: Request): RequestContext {
  const ip = req.ip || "unknown";

  const userAgent = String(req.headers["user-agent"] || "unknown");

  const requestId =
    String(req.headers["x-request-id"] || "") ||
    `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;

  return { ip, userAgent, requestId };
}
