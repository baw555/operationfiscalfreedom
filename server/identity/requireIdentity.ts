import type { Request, Response, NextFunction } from "express";
import { resolveIdentity } from "./resolveIdentity";
import type { ResolvedIdentity } from "./resolveIdentity";

declare global {
  namespace Express {
    interface Request {
      identity?: ResolvedIdentity;
    }
  }
}

export function attachIdentity(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const identity = resolveIdentity(req);
  if (identity) {
    req.identity = identity;
  }
  next();
}

export function requireIdentity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const identity = resolveIdentity(req);

  if (!identity) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  req.identity = identity;
  next();
}
