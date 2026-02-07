# Backend Route Inventory by Domain

Complete inventory of all backend routes. Grouped by domain. Reports only what the code currently does.

File: `server/routes.ts` unless noted otherwise. Line numbers reference that file.
NDA routes in `server/routes/affiliateNda.ts` noted with `[nda]`.

---

## Legend

| Column | Values |
|---|---|
| **R** | reads data |
| **W** | writes data |
| **S** | triggers side effects (email, legal record, payment, external API, logging) |
| **Caller** | `FE` = frontend UI, `internal` = internal service/action, `webhook` = external webhook, `admin-tool` = admin-only tooling, `unknown` = no identified caller |

---

## Auth Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/auth/login` | 1794 | R | W (session) | session creation, localStorage consent | FE |
| POST | `/api/auth/logout` | 1934 | - | W (session destroy) | session destruction | FE |
| GET | `/api/auth/me` | 1944 | R | - | - | FE |
| POST | `/api/auth/init-admin` | 1960 | R | W | - | FE |
| POST | `/api/auth/register` | 1988 | R | W | - | FE |
| POST | `/api/auth/forgot-password` | 2045 | R | W (reset token) | **email** (Resend — password reset link) | FE |
| POST | `/api/auth/reset-password` | 2139 | R | W (password + token) | - | FE |
| GET | `/api/auth/validate-reset-token` | 2176 | R | - | - | FE |
| GET | `/api/me` | 862 | R | - | - | FE |
| POST | `/api/session/heartbeat` | 3775 | - | W (session touch) | - | FE |

### MFA Sub-Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/mfa/status` | 8085 | R | - | - | FE |
| POST | `/api/mfa/setup` | 8099 | R | W (MFA secret) | - | FE |
| POST | `/api/mfa/verify-setup` | 8149 | R | W (MFA enabled) | - | FE |
| POST | `/api/mfa/verify` | 8199 | R | W (session) | - | FE |
| POST | `/api/mfa/disable` | 8353 | R | W (MFA disabled) | - | FE |
| POST | `/api/mfa/regenerate-backup-codes` | 8404 | R | W (backup codes) | - | FE |

### VLT Affiliate Auth (separate session system)

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/vlt-affiliate/login` | 1679 | R | W (session) | - | FE |
| POST | `/api/vlt-affiliate/logout` | 1730 | - | W (session) | - | FE |
| GET | `/api/vlt-affiliate/me` | 1736 | R | - | - | FE |
| GET | `/api/vlt-affiliate/leads` | 1779 | R | - | - | FE |

### Vendor Auth (magic-link / token-based)

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/vendor/auth/request-magic-link` | 10797 | R | W (token) | **email** (magic link) | FE |
| POST | `/api/vendor/auth/verify` | 10874 | R | W (session) | - | FE |
| GET | `/api/vendor/auth/session` | 10914 | R | - | - | FE |
| POST | `/api/vendor/auth/logout` | 10944 | - | W (session) | - | FE |

---

## Legal Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/legal/sign/:type` | ~2743 | R | W | **legal record** (signLegalDocumentAtomic) | unknown — no FE caller found |
| POST | `/api/legal/esign-callback` | ~2799 | R | W | **legal record** (processExternalEsignCallback) | webhook (external e-sign provider) |
| GET | `/api/admin/legal/health` | varies | R | - | - | unknown — no FE caller |
| GET | `/api/admin/legal/coverage` | varies | R | - | - | unknown — no FE caller |
| GET | `/api/admin/legal/metrics` | varies | R | - | - | unknown — no FE caller |
| GET | `/api/admin/legal/compliance-check` | varies | R | - | - | unknown — no FE caller |
| GET | `/api/admin/legal/compliance-history` | varies | R | - | - | unknown — no FE caller |
| POST | `/api/admin/legal/validate` | varies | R | - | - | unknown — no FE caller |
| POST | `/api/admin/legal/test-bot` | varies | R | W | **legal record** (test) | unknown — no FE caller |
| POST | `/api/admin/legal/migrate` | varies | R | W | **legal record** (migration) | unknown — no FE caller |
| GET | `/api/admin/legal/evidence/:userId` | varies | R | - | - | unknown — no FE caller |
| GET | `/api/admin/legal/evidence-bundle/:userId` | varies | R | - | - | unknown — no FE caller |
| POST | `/api/admin/legal-override` | varies | R | W | **legal record** (admin override) | unknown — no FE caller |
| GET | `/api/admin/legal/report` | varies | R | - | - | unknown — no FE caller |

### NDA Sub-Domain `[server/routes/affiliateNda.ts]`

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/affiliate/nda-status` | [nda]:7 | R | - | - | FE |
| POST | `/api/actions/submit-affiliate-nda` | [nda]:53 | R | W | **legal record** (NDA + signLegalDocumentCore), **event** (NDA_SUBMITTED), **email** (notification) | FE |
| POST | `/api/affiliate/sign-nda` | [nda]:54 | R | W | (same handler as above) | FE |

### Schedule-A Sub-Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/schedule-a/status` | 5520 | R | - | - | FE |
| POST | `/api/schedule-a/sign` | 5534 | R | W | **legal record** (signLegalDocumentAtomic) | FE |
| GET | `/api/admin/schedule-a-signatures` | 5574 | R | - | - | FE |
| GET | `/api/schedule-a/download` | 5585 | R | - | PDF generation | FE |

### W9 Sub-Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/affiliate/w9-status` | 3786 | R | - | - | FE |
| POST | `/api/affiliate/submit-w9` | 3797 | R | W | - | FE |

---

## Contracts Domain (Ranger / CSU)

### Contract Templates & Signing (General)

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/contracts/templates` | 4386 | R | - | - | FE |
| GET | `/api/contracts/templates/active` | 4396 | R | - | - | FE |
| GET | `/api/contracts/templates/:id` | 4406 | R | - | - | FE |
| POST | `/api/contracts/templates` | 4420 | - | W | - | admin-tool |
| PATCH | `/api/contracts/templates/:id` | 4434 | - | W | - | admin-tool |
| GET | `/api/contracts/signed` | 4445 | R | - | - | FE |
| GET | `/api/contracts/signed/affiliate/:affiliateId` | 4455 | R | - | - | FE |
| GET | `/api/contracts/check/:affiliateId/:templateId` | 4466 | R | - | - | unknown — no FE caller |
| POST | `/api/contracts/sign` | 4478 | R | W | **legal record** (signLegalDocumentAtomic) | FE |
| GET | `/api/contracts/pending/:affiliateId` | 4514 | R | - | - | FE |
| GET | `/api/contracts/my-signed` | 4528 | R | - | - | FE |
| GET | `/api/contracts/signed/:id/download` | 4541 | R | - | PDF generation | FE |
| POST | `/api/contracts/seed-mah` | 4122 | - | W | - | unknown — no FE caller (seed script) |
| POST | `/api/contracts/seed-all-services` | 4230 | - | W | - | unknown — no FE caller (seed script) |
| POST | `/api/contracts/seed-icc` | 4310 | - | W | - | unknown — no FE caller (seed script) |

### CSU (Cost Savings University / Payzium) Platform

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/csu/templates` | ~6533 | R | - | - | FE |
| GET | `/api/csu/templates/:id` | ~6577 | R | - | - | FE |
| GET | `/api/csu/templates/:id/fields` | ~6401 | R | - | - | FE |
| POST | `/api/csu/templates` | ~6416 | - | W | - | FE (admin) |
| PUT | `/api/csu/templates/:id` | ~6483 | - | W | - | FE (admin) |
| DELETE | `/api/csu/templates/:id` | ~6556 | - | W | - | FE (admin) |
| POST | `/api/csu/send-contract` | ~6544 | R | W | **email** (contract to signer via Resend) | FE |
| POST | `/api/csu/send-contract-batch` | ~6678 | R | W | **email** (batch contracts via Resend) | FE |
| GET | `/api/csu/contract-sends` | ~6813 | R | - | - | FE |
| POST | `/api/csu/contract-sends/:id/resend` | ~7256 | R | W | **email** (resend contract) | FE |
| POST | `/api/csu/contract-sends/:id/void` | ~7350 | R | W | - | FE |
| POST | `/api/csu/envelopes` | ~6828 | R | W | - | FE |
| POST | `/api/csu/envelopes/:id/send` | ~6919 | R | W | **email** (envelope to signers) | FE |
| GET | `/api/csu/envelopes` | ~7069 | R | - | - | FE |
| GET | `/api/csu/envelopes/:id` | ~7080 | R | - | - | FE |
| PUT | `/api/csu/envelopes/:id/recipients` | ~7100 | R | W | - | FE |
| GET | `/api/csu/envelopes/:id/signing-order` | ~7132 | R | - | - | FE |
| GET | `/api/csu/envelopes/:id/audit-trail` | ~7179 | R | - | - | FE |
| POST | `/api/csu/envelopes/:id/void` | ~7197 | R | W | - | FE |
| GET | `/api/csu/signed-agreements` | ~7390 | R | - | - | FE |
| GET | `/api/csu/signed-agreements/:id/pdf` | ~7825 | R | - | PDF generation | FE (admin) |
| GET | `/api/csu/signed-agreements/:id/pdf/public` | ~7760 | R | - | PDF generation | FE (public) |
| GET | `/api/csu/contract/:token` | ~7599 | R | - | - | FE (public signer) |
| POST | `/api/csu/sign/:token` | ~7655 | R | W | **legal record** (signLegalDocumentAtomic), **email** (signed copy) | FE (public signer) |
| POST | `/api/csu/scan-document` | ~6093 | R | - | - | FE (admin) |
| POST | `/api/csu/fix-template/:id` | ~6142 | R | W | - | FE (admin) |
| PUT | `/api/csu/save-fixed-template/:id` | ~6177 | R | W | - | FE (admin) |
| POST | `/api/csu/ai-smart-extract` | ~6211 | R | - | **external API** (OpenAI) | FE |
| POST | `/api/csu/ai-autofill` | ~6352 | R | - | **external API** (OpenAI) | FE |
| POST | `/api/csu/analyze-document` | ~6408 | R | - | **external API** (OpenAI) | FE (admin) |
| POST | `/api/csu/analyze-template-content` | ~6454 | R | - | **external API** (OpenAI) | FE |
| POST | `/api/csu/upload-document` | varies | R | W | file upload | FE (admin) |
| POST | `/api/csu/create-from-upload` | varies | R | W | - | FE (admin) |

---

## Payments Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/checkout` | 1504 | R | - | **payment** (Stripe checkout session creation) | FE |

---

## Admin Domain

### Lead Management (CRUD per lead type)

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/admin/affiliate-applications` | 2198 | R | - | - | FE |
| PATCH | `/api/admin/affiliate-applications/:id` | 2218 | R | W | - | FE |
| GET | `/api/admin/help-requests` | 2208 | R | - | PHI access log | FE |
| PATCH | `/api/admin/help-requests/:id` | 2235 | R | W | PHI access log | FE |
| GET | `/api/admin/startup-grants` | 2328 | R | - | - | FE |
| PATCH | `/api/admin/startup-grants/:id` | 2338 | R | W | - | FE |
| GET | `/api/admin/furniture-assistance` | 2355 | R | - | - | FE |
| PATCH | `/api/admin/furniture-assistance/:id` | 2365 | R | W | - | FE |
| GET | `/api/admin/investor-submissions` | 2382 | R | - | - | FE |
| PATCH | `/api/admin/investor-submissions/:id` | 2392 | R | W | - | FE |
| GET | `/api/admin/private-doctor-requests` | 2409 | R | - | PHI access log | FE |
| PATCH | `/api/admin/private-doctor-requests/:id` | 2419 | R | W | PHI access log | FE |
| GET | `/api/admin/website-applications` | 2436 | R | - | - | FE |
| PATCH | `/api/admin/website-applications/:id` | varies | R | W | - | FE |
| GET | `/api/admin/general-contact` | varies | R | - | - | FE |
| PATCH | `/api/admin/general-contact/:id` | varies | R | W | - | FE |
| GET | `/api/admin/finops-referrals` | 935 | R | - | PHI access log | FE |
| PATCH | `/api/admin/finops-referrals/:id` | 957 | R | W | PHI access log | FE |
| GET | `/api/admin/disability-referrals` | 1198 | R | - | PHI access log | FE |
| PATCH | `/api/admin/disability-referrals/:id` | 1231 | R | W | PHI access log | FE |
| GET | `/api/admin/disability-referrals/stats` | 1246 | R | - | - | FE |
| GET | `/api/admin/job-placement-intakes` | 1101 | R | - | PHI access log | FE |
| PATCH | `/api/admin/job-placement-intakes/:id` | 1112 | R | W | PHI access log | FE |
| GET | `/api/admin/vet-professional-intakes` | 1137 | R | - | PHI access log | FE |
| PATCH | `/api/admin/vet-professional-intakes/:id` | 1147 | R | W | PHI access log | FE |
| GET | `/api/admin/healthcare-intakes` | 1173 | R | - | PHI access log | FE |
| PATCH | `/api/admin/healthcare-intakes/:id` | 1183 | R | W | PHI access log | FE |
| GET | `/api/admin/veteran-intakes` | 4008 | R | - | PHI access log | FE |
| PATCH | `/api/admin/veteran-intakes/:id` | 4018 | R | W | PHI access log | FE |
| GET | `/api/admin/business-intakes` | 4058 | R | - | PHI access log | FE |
| PATCH | `/api/admin/business-intakes/:id` | 4068 | R | W | PHI access log | FE |
| GET | `/api/admin/business-leads` | 5058 | R | - | - | FE |
| PATCH | `/api/admin/business-leads/:id` | 5088 | R | W | - | FE |
| GET | `/api/admin/insurance-intakes` | 5706 | R | - | PHI access log | FE |
| PATCH | `/api/admin/insurance-intakes/:id` | 5717 | R | W | PHI access log | FE |
| GET | `/api/admin/medical-sales-intakes` | 5741 | R | - | PHI access log | FE |
| PATCH | `/api/admin/medical-sales-intakes/:id` | 5751 | R | W | PHI access log | FE |
| GET | `/api/admin/business-dev-intakes` | 5785 | R | - | PHI access log | FE |
| PATCH | `/api/admin/business-dev-intakes/:id` | 5795 | R | W | PHI access log | FE |
| GET | `/api/admin/vlt-intake` | 1571 | R | - | - | FE |
| PATCH | `/api/admin/vlt-intake/:id` | 1581 | R | W | - | FE |

### Affiliate Management

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/admin/affiliates` | 2252 | R | - | - | FE |
| POST | `/api/admin/affiliates` | 2268 | - | W | - | FE |
| PATCH | `/api/admin/affiliates/:id/password` | 2294 | R | W | - | FE |
| DELETE | `/api/admin/affiliates/:id` | 2317 | R | W | - | FE |
| GET | `/api/admin/affiliate-activities` | 704 | R | - | - | FE |
| GET | `/api/admin/affiliate-ndas` | ~5823 | R | - | - | FE |
| GET | `/api/admin/affiliate-w9s` | ~5834 | R | - | - | FE |
| GET | `/api/admin/vlt-affiliates` | 1597 | R | - | - | FE |
| POST | `/api/admin/vlt-affiliates` | 1607 | - | W | - | FE |
| PATCH | `/api/admin/vlt-affiliates/:id` | 1652 | R | W | - | FE |
| DELETE | `/api/admin/vlt-affiliates/:id` | 1666 | R | W | - | FE |

### Audit & Compliance

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/admin/audit` | 885 | R | - | - | FE |
| GET | `/api/admin/export/audit` | 791 | R | - | CSV generation | FE |
| GET | `/api/admin/audit/verify` | 824 | R | - | - | FE |
| GET | `/api/admin/consent-records` | ~5845 | R | - | - | FE |
| GET | `/api/admin/partner-sharing-logs` | ~5856 | R | - | - | FE |
| POST | `/api/admin/webhook/test` | 897 | - | - | **email** (test notification) | FE |
| POST | `/api/admin/send-commission-spreadsheet` | 4809 | R | - | **email** (commission spreadsheet via Resend) | FE |

### System & Queue

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/system/health` | 836 | R | - | - | FE |
| GET | `/api/admin/queue/stats` | 850 | R | - | - | FE |

### Users

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/admin/users` | varies | R | - | - | FE |

---

## Affiliates Domain

### Affiliate Data Access

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/affiliate/applications` | varies | R | - | - | FE |
| PATCH | `/api/affiliate/applications/:id` | varies | R | W | - | FE |
| GET | `/api/affiliate/help-requests` | varies | R | - | - | FE |
| PATCH | `/api/affiliate/help-requests/:id` | varies | R | W | - | FE |
| GET | `/api/affiliate/business-leads` | 5078 | R | - | - | FE |
| GET | `/api/affiliate/disability-referrals` | 1209 | R | - | PHI access log | FE |
| GET | `/api/affiliate/vet-professional-intakes` | 1220 | R | - | PHI access log | FE |
| GET | `/api/affiliate/medical-sales-intakes` | 5763 | R | - | PHI access log | FE |
| GET | `/api/affiliate/business-dev-intakes` | ~5807 | R | - | PHI access log | FE |
| GET | `/api/affiliate/security-tracking` | 5169 | R | - | - | FE |
| GET | `/api/affiliate/referral-info` | varies | R | - | - | FE |
| GET | `/api/affiliate/vso-air-support` | varies | R | - | - | FE |

---

## Notifications Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/notification-settings` | 715 | R | - | - | FE |
| PUT | `/api/notification-settings` | 743 | R | W | - | FE |

---

## Public Lead Intake Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/affiliate-applications` | 404 | - | W | - | FE |
| POST | `/api/affiliate-signup` | 418 | - | W | - | FE |
| POST | `/api/ranger-tab-signup` | 496 | - | W | - | FE |
| POST | `/api/disability-referrals` | 976 | - | W | **email** (notification via sendEmailWithRetry) | FE |
| POST | `/api/job-placement-intakes` | 1067 | - | W | - | FE |
| POST | `/api/vet-professional-intakes` | 1127 | - | W | - | FE |
| POST | `/api/healthcare-intakes` | 1162 | - | W | - | FE |
| POST | `/api/help-requests` | 1257 | - | W | - | FE |
| POST | `/api/startup-grants` | 1311 | - | W | - | FE |
| POST | `/api/furniture-assistance` | 1325 | - | W | - | FE |
| POST | `/api/investor-submissions` | 1339 | - | W | - | FE |
| POST | `/api/private-doctor-requests` | 1353 | - | W | - | FE |
| POST | `/api/website-applications` | 1367 | - | W | - | FE |
| POST | `/api/general-contact` | 1381 | - | W | - | FE |
| POST | `/api/vlt-intake` | 1395 | - | W | - | FE |
| POST | `/api/business-leads` | 5003 | - | W | - | FE |
| POST | `/api/business-intake` | 4029 | - | W | - | FE |
| POST | `/api/veteran-intake` | 3979 | - | W | - | FE |
| POST | `/api/insurance-intakes` | 5694 | - | W | - | FE |
| POST | `/api/medical-sales-intakes` | 5730 | - | W | - | FE |
| POST | `/api/business-dev-intakes` | 5774 | - | W | - | FE |

---

## Consent & Privacy Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/consent-record` | ~8021 | - | W | - | FE (client-side consent logger) |
| GET | `/api/consent-records` | ~8060 | R | - | - | FE (admin) |
| POST | `/api/partner-sharing-log` | ~8070 | - | W | - | FE (admin) |
| GET | `/api/partner-sharing-logs` | ~8094 | R | - | - | FE (admin) |
| GET | `/api/affiliated-partners` | ~8104 | R | - | - | FE |

---

## HIPAA Compliance Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/hipaa/audit-logs` | 7915 | R | - | - | FE |
| GET | `/api/hipaa/audit-logs/user/:userId` | 7927 | R | - | - | FE |
| GET | `/api/hipaa/audit-logs/phi` | 7939 | R | - | - | FE |
| GET | `/api/hipaa/baa` | 7950 | R | - | - | FE |
| POST | `/api/hipaa/baa` | 7961 | - | W | - | FE |
| PATCH | `/api/hipaa/baa/:id` | 7972 | R | W | - | FE |
| GET | `/api/hipaa/training` | 7987 | R | - | - | FE |
| POST | `/api/hipaa/training` | 7998 | - | W | - | FE |
| GET | `/api/hipaa/training/user/:userId` | 8009 | R | - | - | FE |
| GET | `/api/hipaa/training/expired` | 8021 | R | - | - | FE |
| GET | `/api/hipaa/mfa/user/:userId` | 8032 | R | - | - | FE |

---

## Self-Healing / Repair Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/repair/logs` | varies | R | - | - | FE |
| POST | `/api/repair/classify` | varies | R | - | - | FE |
| POST | `/api/repair/intake` | varies | R | W | **logging** (repair event) | FE |
| POST | `/api/repair/public-intake` | varies | R | W | **logging** | unknown — no FE caller |
| GET | `/api/repair/escalated` | 3067 | R | - | - | FE |
| GET | `/api/repair/queue-stats` | 3082 | R | - | - | FE |
| POST | `/api/repair/approve` | 3099 | R | W | - | FE |
| POST | `/api/repair/reject` | 3124 | R | W | - | FE |
| GET | `/api/repair/pipeline-gate` | 3149 | R | - | - | unknown — no FE caller |
| POST | `/api/repair/email` | 3178 | R | W | **email** (repair alert/escalation/status) | unknown — no FE caller |
| POST | `/api/repair/test-email` | 3370 | - | - | **email** (test repair email) | FE (admin) |
| GET | `/api/repair/email-queue` | 3430 | R | - | - | FE (admin) |
| GET | `/api/repair/daily-digest` | 3442 | R | - | - | unknown — no FE caller |
| POST | `/api/repair/send-digest` | 3454 | R | - | **email** (daily digest) | unknown — no FE caller |
| GET | `/api/repair/safety-policy` | 3466 | R | - | - | unknown — no FE caller |

### Incident Routes

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/incident/password-change` | 3482 | R | W | **logging** (incident creation) | unknown — no FE caller |
| POST | `/api/incident/email-change` | 3517 | R | W | **logging** | unknown — no FE caller |
| POST | `/api/incident/referral-change` | 3538 | R | W | **logging** | unknown — no FE caller |
| POST | `/api/incident/user-management` | 3557 | R | W | **logging** | unknown — no FE caller |

### Critical Flow (Tier-0)

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/critical-flow/process` | 3578 | R | W | **logging** (incident processing) | FE |
| GET | `/api/critical-flow/incidents` | 3609 | R | - | - | FE |
| POST | `/api/critical-flow/approve/:incidentId` | 3623 | R | W | - | FE |
| GET | `/api/critical-flow/report/:incidentId` | 3643 | R | - | report generation | FE |
| POST | `/api/critical-flow/emergency` | 3678 | R | W | **logging** (emergency mode activation) | FE |

---

## Master Portal Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/master/ndas` | 3715 | R | - | - | unknown — no FE caller |
| POST | `/api/master/affiliate-nda-pdf/:ndaId` | 3734 | R | - | PDF generation | FE |
| GET | `/api/master/affiliate-files` | varies | R | - | - | FE |
| GET | `/api/master/sales` | 3898 | R | - | - | FE |
| GET | `/api/master/affiliates` | 3908 | R | - | - | FE |
| GET | `/api/master/affiliates/:role` | 3918 | R | - | - | FE |
| GET | `/api/master/downline/:affiliateId` | 3928 | R | - | - | FE |
| GET | `/api/master/commissions` | 3939 | R | - | - | FE |
| PATCH | `/api/master/promote/:id` | 4079 | R | W | - | FE |
| GET | `/api/master/business-leads` | 5068 | R | - | - | FE |
| GET | `/api/master/security-tracking` | 5104 | R | - | - | FE |

---

## Sales & Commissions Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/sales` | 3954 | - | W | - | FE |
| PATCH | `/api/sales/:id` | 3968 | R | W | - | FE |
| POST | `/api/commission/calculate` | 4642 | R | - | - | unknown — no FE caller |
| GET | `/api/commission/config` | 4705 | R | - | - | unknown — no FE caller |
| POST | `/api/commission/seed` | 4732 | - | W | - | unknown — no FE caller (seed) |
| PATCH | `/api/admin/commission/config/:id` | 4754 | R | W | - | FE |
| GET | `/api/admin/commissions` | 4787 | R | - | - | FE |

---

## Opportunities Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/opportunities` | 3863 | R | - | - | FE |
| POST | `/api/opportunities` | 3873 | - | W | - | FE |
| PATCH | `/api/opportunities/:id` | 3887 | R | W | - | FE |

---

## Sub-Master Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/submaster/downline` | 4091 | R | - | - | FE |
| GET | `/api/submaster/sales` | 4106 | R | - | - | FE |

---

## Tracking Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/track-referral` | 530 | - | W | - | unknown — no FE caller |
| POST | `/api/finops/track-click` | 598 | - | W | - | FE |
| POST | `/api/affiliate-activity/:type` | 663 | - | W | - | unknown — no FE caller |

---

## Portal Analytics Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/portal/track` | ~7894 | - | W | - | FE |
| GET | `/api/portal/activity/:portal` | ~7946 | R | - | - | FE (admin) |
| GET | `/api/portal/stats/:portal` | ~7960 | R | - | - | FE (admin) |
| GET | `/api/portal/ip-lookup/:ip` | ~7972 | R | - | **external API** (IP geolocation) | FE (admin) |

---

## Webhooks & Internal Services Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/crm-webhook` | 1440 | R | W | - | webhook (external CRM) |
| POST | `/api/process-lead` | 1459 | R | W | **email** (Resend notification) | webhook / internal |
| POST | `/api/notify` | 1534 | - | - | **email** (Resend notification) | internal service |

---

## Stress Test Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/stress-test/run` | 5211 | R | W | creates test sales/commissions data | FE |
| GET | `/api/stress-test/results` | 5414 | R | - | - | FE |
| DELETE | `/api/stress-test/clear` | 5485 | R | W | - | FE |

---

## AI Suite Domain

### Naval Intelligence (AI Generation)

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/ai/gallery` | 8446 | R | - | - | FE |
| GET | `/api/ai/generation/:id` | 8479 | R | - | - | FE |
| GET | `/api/ai/templates` | 8496 | R | - | - | FE |
| GET | `/api/ai/templates/category/:category` | 8507 | R | - | - | FE |
| POST | `/api/ai/generate` | 8539 | R | W | **external API** (OpenAI), **email** (Resend notification) | FE |
| DELETE | `/api/ai/generation/:id` | 8634 | R | W | - | FE |
| POST | `/api/ai/templates` | 8657 | - | W | - | FE (admin) |
| PATCH | `/api/ai/templates/:id` | 8668 | R | W | - | FE (admin) |
| POST | `/api/ai/generate-image` | 9150 | R | W | **external API** (OpenAI DALL-E) | FE |
| POST | `/api/ai/text-to-speech` | 9209 | R | - | **external API** (OpenAI TTS) | FE |

### Operator AI (Chat Assistant)

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/operator-ai/chat` | 8690 | R | W | **external API** (OpenAI) | FE |
| DELETE | `/api/operator-ai/session/:sessionId` | 8866 | R | W | - | FE |
| DELETE | `/api/operator-ai/persistent/:userId` | 8878 | R | W | - | FE |
| GET | `/api/operator-ai/session/:sessionId` | 8890 | R | - | - | FE |
| POST | `/api/operator-ai/documents` | 8918 | R | W | file upload | FE |
| GET | `/api/operator-ai/documents/:sessionId` | 8968 | R | - | - | FE |
| DELETE | `/api/operator-ai/documents/:sessionId` | 8992 | R | W | - | FE |

### Orchestration (AI Routing)

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/orchestration/models` | 9009 | R | - | - | FE |
| POST | `/api/orchestration/route` | 9045 | R | - | **external API** (OpenAI) | FE |
| POST | `/api/orchestration/execute` | 9114 | R | - | **external API** (OpenAI) | FE |
| POST | `/api/orchestration/fusion` | 9252 | R | W | **external API** (OpenAI) | FE |

### Pipelines

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/pipelines` | 9322 | - | W | - | unknown — no FE caller |
| GET | `/api/pipelines/:id` | 9346 | R | - | - | unknown — no FE caller |
| GET | `/api/users/:userId/pipelines` | 9368 | R | - | - | unknown — no FE caller |

---

## Claims Navigator Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/claims/cases` | 9398 | R | - | - | FE |
| GET | `/api/claims/cases/:id` | 9414 | R | - | - | FE |
| POST | `/api/claims/cases` | 9443 | - | W | - | FE |
| GET | `/api/claims/cases/:id/tasks` | 9487 | R | - | - | FE |
| PATCH | `/api/claims/tasks/:id` | 9513 | R | W | - | FE |
| GET | `/api/claims/cases/:id/notes` | 9552 | R | - | - | FE |
| POST | `/api/claims/cases/:id/notes` | 9578 | - | W | - | FE |
| GET | `/api/claims/cases/:id/deadlines` | 9615 | R | - | - | FE |
| GET | `/api/claims/cases/:id/files` | 9641 | R | - | - | FE |
| GET | `/api/claims/cases/:id/shares` | 9667 | R | - | - | FE |
| POST | `/api/claims/cases/:id/shares` | 9693 | - | W | - | FE |
| DELETE | `/api/claims/shares/:id` | 9729 | R | W | - | FE |
| GET | `/api/claims/evidence-requirements` | 9765 | R | - | - | FE |
| GET | `/api/claims/cases/:id/completeness` | 9785 | R | - | - | FE |
| GET | `/api/claims/cases/:id/strength` | 9853 | R | - | - | FE |
| GET | `/api/claims/cases/:id/lane-recommendation` | 9910 | R | - | - | FE |
| PATCH | `/api/claims/files/:id/evidence` | 9983 | R | W | - | FE |
| GET | `/api/claims/cases/:id/vendor-metrics` | 10027 | R | - | - | FE |
| GET | `/api/claims/cases/:id/export` | 10120 | R | - | - | FE |
| GET | `/api/claims/cases/:id/heatmap` | 10268 | R | - | - | FE |
| GET | `/api/claims/cases/:id/suggestions` | 10334 | R | - | - | FE |
| GET | `/api/claims/cases/:id/vendor-scorecards` | 10389 | R | - | - | FE |
| GET | `/api/claims/cases/:id/lane-confidence` | 10461 | R | - | - | FE |
| GET | `/api/claims/cases/:id/upload-checklist` | 10538 | R | - | - | FE |
| GET | `/api/claims/cases/:id/export/download` | 10585 | R | - | PDF/document generation | FE |

---

## Vendor Portal Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| GET | `/api/vendor/cases` | 10679 | R | - | - | FE |
| GET | `/api/vendor/cases/:id` | 10720 | R | - | - | FE |
| GET | `/api/vendor/my-cases` | 10959 | R | - | - | FE |
| POST | `/api/vendor/cases/:id/notes` | 10993 | - | W | - | FE |

---

## Sailor Man AI Assistant Domain

| Method | Path | Line | R | W | S | Caller |
|---|---|---|---|---|---|---|
| POST | `/api/sailor/conversation` | 11053 | - | W | - | FE |
| GET | `/api/sailor/conversation/:id/messages` | 11068 | R | - | - | FE |
| POST | `/api/sailor/chat` | 11083 | R | W | **external API** (OpenAI) | FE |
| GET | `/api/sailor/tips` | 11110 | R | - | - | FE |
| POST | `/api/sailor/transcribe` | 11122 | R | - | **external API** (OpenAI Whisper) | FE |
| POST | `/api/sailor/voice-chat` | 11136 | R | W | **external API** (OpenAI) | FE |

---

## Summary

| Metric | Count |
|---|---|
| **Total backend routes** | 327 (324 in routes.ts + 3 in affiliateNda.ts) |
| **Auth-guarded (requireAdmin/requireAuth/requireAffiliate)** | 185 |
| **Unguarded (no middleware auth check)** | 142 |
| **Routes with email side effects** | ~15 |
| **Routes with legal record side effects** | ~8 |
| **Routes with external API calls (OpenAI)** | ~12 |
| **Routes with payment side effects** | 1 |
| **Webhook endpoints** | 3 (crm-webhook, process-lead, esign-callback) |
| **Routes with no identified frontend caller** | ~30 |
| **Domains identified** | 20 |
| **All routes in single file (routes.ts)** | 324 of 327 |
