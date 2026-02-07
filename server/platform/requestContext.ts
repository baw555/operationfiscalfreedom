import { randomUUID } from "crypto";
import type { Request } from "express";

export type RequestContext = {
  ip: string;
  userAgent: string;
  requestId: string;
};

export function getRequestContext(req: Request): RequestContext {
  const ip = req.ip || "unknown";

  const userAgent = String(req.headers["user-agent"] || "unknown");

  const incoming = req.headers["x-request-id"];
  const requestId =
    typeof incoming === "string" && incoming.length > 0 && incoming.length <= 128
      ? incoming
      : randomUUID();

  return { ip, userAgent, requestId };
}
