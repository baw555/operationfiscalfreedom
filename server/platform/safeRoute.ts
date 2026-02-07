import type { Request, Response, NextFunction } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function safeRoute(handler: AsyncHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (err: any) {
      const status = err.status || err.statusCode || 500;
      const message =
        status < 500
          ? err.message || "Request error"
          : "Internal server error";

      if (status >= 500) {
        console.error(
          `[safeRoute] ${req.method} ${req.path} threw:`,
          err.message || err,
        );
      }

      if (!res.headersSent) {
        res.status(status).json({ message });
      }
    }
  };
}
