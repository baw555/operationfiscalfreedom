import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./errors";
import { getRequestContext, type RequestContext } from "./requestContext";

declare global {
  namespace Express {
    interface Request {
      ctx: RequestContext;
    }
  }
}

export function route(
  handler: (req: Request, res: Response) => Promise<void>
) {
  return async (req: Request, res: Response, _next: NextFunction) => {
    try {
      req.ctx = getRequestContext(req);
      await handler(req, res);
    } catch (err: any) {
      if (res.headersSent) {
        console.error(
          `[route] ${req.method} ${req.path} threw after headers sent:`,
          err.message || err,
        );
        return;
      }

      if (err instanceof ApiError) {
        res.status(err.status).json({
          code: err.code,
          message: err.message,
        });
        return;
      }

      console.error(
        `[route] ${req.method} ${req.path} threw:`,
        err.message || err,
      );
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
