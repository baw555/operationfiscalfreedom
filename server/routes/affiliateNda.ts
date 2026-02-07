import type { Express } from "express";
import { requireAffiliate, resolveClientIp } from "../middleware";
import { submitAffiliateNda } from "../actions/nda/submitAffiliateNda";
import { storage } from "../storage";

export function registerAffiliateNdaRoutes(app: Express) {
  app.get("/api/affiliate/nda-status", requireAffiliate, async (req, res) => {
    try {
      const hasSigned = await storage.hasAffiliateSignedNda(req.session.userId!);
      const nda = hasSigned ? await storage.getAffiliateNdaByUserId(req.session.userId!) : null;
      res.json({ hasSigned, nda });
    } catch (error) {
      res.status(500).json({ message: "Failed to check NDA status" });
    }
  });

  const handleNdaSubmit = async (req: any, res: any) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Session not established" });
    }

    try {
      const ipAddress = resolveClientIp(req);
      const userAgent = (req.headers["user-agent"] as string) || "unknown";

      const result = await submitAffiliateNda({
        ...req.body,
        userId,
        ipAddress,
        userAgent,
      });

      if (!result.ok) {
        return res.status(result.code).json({ message: result.message });
      }

      if (result.alreadySigned) {
        return res.json({ success: true, message: "NDA already signed", ndaId: result.ndaId });
      }

      res.json({ success: true, ndaId: result.ndaId, status: result.status, degraded: result.degraded });
    } catch (error: any) {
      console.error("[NDA SIGN FAILURE]", {
        userId,
        error: error?.message,
        code: error?.code,
      });
      res.status(500).json({ message: "NDA signing failed. Please retry.", retryable: true });
    }
  };

  app.post("/api/actions/submit-affiliate-nda", requireAffiliate, handleNdaSubmit);
  app.post("/api/affiliate/sign-nda", requireAffiliate, handleNdaSubmit);
}
