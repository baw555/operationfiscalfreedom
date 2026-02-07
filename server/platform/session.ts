import type { Request } from "express";

type SessionBase = {
  userId?: number;
  userRole?: string;
};

type SessionExtras = {
  vltAffiliateId?: number;
  mfaPending?: boolean;
  mfaVerified?: boolean;
};

export async function establishSession(
  req: Request,
  fields: SessionBase & SessionExtras
): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);

      if (fields.userId !== undefined) req.session.userId = fields.userId;
      if (fields.userRole !== undefined) req.session.userRole = fields.userRole;
      if (fields.vltAffiliateId !== undefined) req.session.vltAffiliateId = fields.vltAffiliateId;
      if (fields.mfaPending !== undefined) req.session.mfaPending = fields.mfaPending;
      if (fields.mfaVerified !== undefined) req.session.mfaVerified = fields.mfaVerified;

      req.session.save((err2) => {
        if (err2) return reject(err2);
        resolve();
      });
    });
  });
}
