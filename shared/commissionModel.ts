export const COMMISSION_DEFAULTS = {
  producerBase: 0.69,
  uplineEach: 0.01,
  housePct: 0.225,
  recruiterPct: 0.025,
  maxUplines: 6,
} as const;

export type UplineBreakdownEntry = {
  level: number;
  pay: number;
  pct: number;
};

export type CommissionBreakdown = {
  grossCommission: number;
  grossCommissionCents: number;
  housePay: number;
  housePct: number;
  recruiterPay: number;
  recruiterPct: number;
  producerPay: number;
  producerPct: number;
  producerBase: number;
  compressionPct: number;
  uplineCount: number;
  uplinePayEach: number;
  totalUplinePay: number;
  uplineBreakdown: UplineBreakdownEntry[];
  totalPaid: number;
  totalPct: number;
};

export function calculateCommission(params: {
  grossCommission: number;
  uplineCount?: number;
  hasRecruiter?: boolean;
}): CommissionBreakdown {
  const pool = Math.max(0, Number(params.grossCommission) || 0);
  const uplines = Math.max(0, Math.min(COMMISSION_DEFAULTS.maxUplines, Number(params.uplineCount) || 0));
  const hasRecruiter = params.hasRecruiter ?? true;
  const emptyUplines = COMMISSION_DEFAULTS.maxUplines - uplines;

  const housePay = Math.round(pool * COMMISSION_DEFAULTS.housePct * 100);
  const recruiterPay = hasRecruiter ? Math.round(pool * COMMISSION_DEFAULTS.recruiterPct * 100) : 0;

  const compressionPct = emptyUplines * COMMISSION_DEFAULTS.uplineEach;
  const producerPct = COMMISSION_DEFAULTS.producerBase + compressionPct;
  const producerPay = Math.round(pool * producerPct * 100);

  const uplinePayEach = Math.round(pool * COMMISSION_DEFAULTS.uplineEach * 100);
  const totalUplinePay = uplinePayEach * uplines;

  const uplineBreakdown: UplineBreakdownEntry[] = Array.from({ length: uplines }, (_, i) => ({
    level: i + 1,
    pay: uplinePayEach,
    pct: COMMISSION_DEFAULTS.uplineEach * 100,
  }));

  return {
    grossCommission: pool,
    grossCommissionCents: Math.round(pool * 100),
    housePay,
    housePct: COMMISSION_DEFAULTS.housePct * 100,
    recruiterPay,
    recruiterPct: COMMISSION_DEFAULTS.recruiterPct * 100,
    producerPay,
    producerPct: producerPct * 100,
    producerBase: COMMISSION_DEFAULTS.producerBase * 100,
    compressionPct: compressionPct * 100,
    uplineCount: uplines,
    uplinePayEach,
    totalUplinePay,
    uplineBreakdown,
    totalPaid: housePay + recruiterPay + producerPay + totalUplinePay,
    totalPct: (COMMISSION_DEFAULTS.housePct + COMMISSION_DEFAULTS.recruiterPct + producerPct + (uplines * COMMISSION_DEFAULTS.uplineEach)) * 100,
  };
}
