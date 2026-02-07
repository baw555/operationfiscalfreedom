# Frontend Route Inventory

Complete inventory of all user-facing routes. Generated from code scan — reports only what the code currently does.

---

## Public Pages — Static / Informational (No Data Operations)

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/` | `home.tsx` | public | no | no | no |
| `/about` | `about.tsx` | public | no | no | no |
| `/about-nav-perks` | `about-nav-perks.tsx` | public | no | no | no |
| `/resources` | `resources.tsx` | public | no | no | no |
| `/success` | `success.tsx` | public | no | no | no |
| `/income` | `income.tsx` | public | no | no | no |
| `/comp-plan` | `comp-plan.tsx` | public | no | no | no |
| `/transparency` | `transparency.tsx` | public | no | no | no |
| `/mission-act-health` | `mission-act-health.tsx` | public | no | no | no |
| `/privacy-policy` | `privacy-policy.tsx` | public | no | no | no |
| `/terms-of-use` | `terms-of-use.tsx` | public | no | no | no |
| `/affiliated-partners` | `affiliated-partners.tsx` | public | no | no | no |
| `/do-not-sell` | `do-not-sell.tsx` | public | no | no | no |
| `/breach-procedures` | `breach-procedures.tsx` | public | no | no | no |
| `/emergency-access` | `emergency-access.tsx` | public | no | no | no |
| `/shipping` | `shipping.tsx` | public | no | no | no |
| `/logistics-overview` | `logistics-overview.tsx` | public | no | no | no |
| `/best-practices` | `best-practices.tsx` | public | no | no | no |
| `/planning-solutions` | `planning-solutions.tsx` | public | no | no | no |
| `/legal-eco` | `legal-eco.tsx` | public | no | no | no |
| `/irs-verification` | `irs-verification.tsx` | public | no | no | no |
| `/hipaa-compliance` | `hipaa-compliance.tsx` | public | no | no | no |
| `/fin-op` | `fin-op.tsx` | public | no | no | no |

## Public Pages — Static Downloads (No API Calls)

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/download/parcel-checklist` | `download-parcel-checklist.tsx` | public | no | no | no |
| `/download/freight-checklist` | `download-freight-checklist.tsx` | public | no | no | no |
| `/download/rate-playbook` | `download-rate-playbook.tsx` | public | no | no | no |
| `/download/fedex-rates` | `download-fedex-rates.tsx` | public | no | no | no |
| `/download/ups-rates` | `download-ups-rates.tsx` | public | no | no | no |

## Public Redirects (Legacy Routes)

| URL Path | Redirects To | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/merchant-services` | `/fin-ops/merchant-services` | public | no | no | no |
| `/my-locker` | `/fin-ops/my-locker` | public | no | no | no |
| `/vgift-cards` | `/fin-ops/vgift-cards` | public | no | no | no |
| `/vet-professionals` | `/fin-ops/vet-professionals` | public | no | no | no |

## Public Pages — Submit Data (Lead Intake Forms)

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/contact` | `contact.tsx` | public | no | POST `/api/general-contact` | consent logging |
| `/get-help` | `get-help.tsx` | public | no | POST `/api/help-requests` | consent logging |
| `/affiliate` | `affiliate-apply.tsx` | public | no | POST `/api/affiliate-signup` | consent logging; redirects to `/affiliate/nda`; invalidates auth cache |
| `/apply-website` | `apply-website.tsx` | public | no | POST `/api/website-applications` | consent logging |
| `/apply-startup-grant` | `apply-startup-grant.tsx` | public | no | POST `/api/startup-grants` | consent logging |
| `/veteran-intake` | `veteran-intake.tsx` | public | no | POST `/api/veteran-intake` | consent logging |
| `/business-intake` | `business-intake.tsx` | public | no | POST `/api/business-intake` | consent logging |
| `/new-home-furniture` | `new-home-furniture.tsx` | public | no | POST `/api/furniture-assistance` | consent logging |
| `/private-doctor` | `private-doctor.tsx` | public | no | POST `/api/private-doctor-requests` | consent logging |
| `/businesses` | `businesses.tsx` | public | no | POST `/api/business-leads` | no |
| `/ranger-tab-signup` | `ranger-tab-signup.tsx` | public | no | POST `/api/ranger-tab-signup` | no |
| `/medical-sales` | `medical-sales.tsx` | public | no | POST `/api/medical-sales-intakes` | no |
| `/business-development` | `business-development.tsx` | public | no | POST `/api/business-dev-intakes` | no |
| `/job-placement` | `job-placement.tsx` | public | no | POST `/api/job-placement-intakes` | no |
| `/insurance` | `insurance.tsx` | public | no | POST `/api/insurance-intakes` | no |

## Disability Rating Pages

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/disability-rating` | `disability-rating/index.tsx` | public | no | no | no |
| `/disability-rating/initial` | `disability-rating/index.tsx` | public | no | no | no |
| `/disability-rating/increase` | `disability-rating/index.tsx` | public | no | no | no |
| `/disability-rating/denial` | `disability-rating/index.tsx` | public | no | no | no |
| `/disability-rating/ssdi` | `disability-rating/index.tsx` | public | no | no | no |
| `/disability-rating/widow` | `disability-rating/index.tsx` | public | no | no | no |
| `/disability-rating/refer-earn` | `disability-rating/refer-earn.tsx` | public | no | no | no |
| `/disability-rating/intake` | `disability-rating/intake.tsx` | public | no | POST `/api/disability-referrals` | consent logging |

## Healthcare Pages

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/healthcare` | `healthcare/index.tsx` | public | no | POST `/api/healthcare-intakes` | no |
| `/healthcare/ptsd` | `healthcare/index.tsx` | public | no | POST `/api/healthcare-intakes` | no |
| `/healthcare/exosomes` | `healthcare/index.tsx` | public | no | POST `/api/healthcare-intakes` | no |
| `/healthcare/less-invasive` | `healthcare/index.tsx` | public | no | POST `/api/healthcare-intakes` | no |
| `/healthcare/new-treatments` | `healthcare/index.tsx` | public | no | POST `/api/healthcare-intakes` | no |
| `/healthcare/guidance` | `healthcare/index.tsx` | public | no | POST `/api/healthcare-intakes` | no |

## Fin-Ops Hub Pages

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/fin-ops` | `fin-ops/index.tsx` | public | no | useMutation (apiRequest) | no |
| `/fin-ops/vet-professionals` | `fin-ops/index.tsx` | public | no | useMutation (apiRequest) | no |
| `/fin-ops/merchant-services` | `fin-ops/index.tsx` | public | no | useMutation (apiRequest) | no |
| `/fin-ops/my-locker` | `fin-ops/index.tsx` | public | no | useMutation (apiRequest) | no |
| `/fin-ops/vgift-cards` | `fin-ops/index.tsx` | public | no | useMutation (apiRequest) | no |

## Authentication Pages

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/login` | `login.tsx` | public | no | POST `/api/auth/login` | localStorage (remembered email) |
| `/admin/login` | `admin-login.tsx` | public | no | POST `/api/auth/login` | localStorage (admin email) |
| `/admin/setup` | `admin-setup.tsx` | public | no | POST `/api/auth/init-admin` | redirects to `/admin/login` |
| `/affiliate/login` | `affiliate-login.tsx` | public | no | POST `/api/auth/login`; GET `/api/auth/me` (session verify) | localStorage (remembered email) |
| `/join` | `join.tsx` | public | no | POST `/api/auth/register` | redirects to `/affiliate/dashboard` |
| `/forgot-password` | `forgot-password.tsx` | public | no | POST `/api/auth/forgot-password` | triggers password reset email |
| `/reset-password` | `reset-password.tsx` | public | GET `/api/auth/validate-reset-token` | POST `/api/auth/reset-password` | no |

## Affiliate Portal Pages (require affiliate role)

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/affiliate/dashboard` | `affiliate-dashboard.tsx` | affiliate | GET `/api/auth/me`, `/api/vlt-affiliate/me`, `/api/contracts/templates`, `/api/contracts/my-signed`, `/api/affiliate/applications`, `/api/affiliate/help-requests`, `/api/affiliate/business-leads` | no | redirects to `/affiliate/login` if not affiliate; redirects to `/affiliate/nda` if NDA unsigned |
| `/affiliate/nda` | `affiliate-nda.tsx` (4-file NDA Pattern) | affiliate | GET `/api/auth/me`, `/api/affiliate/nda-status` | POST `/api/actions/submit-affiliate-nda` (via panels) | legal record (NDA), session heartbeat, consent logging, event emission |
| `/sign-contract` | `sign-contract.tsx` | authenticated | GET `/api/auth/me`, `/api/affiliate/nda-status`, `/api/contracts/templates`, `/api/contracts/my-signed`, `/api/affiliate/w9-status` | POST `/api/contracts/sign`, POST `/api/affiliate/submit-w9` | legal record (contract signature) |
| `/schedule-a` | `schedule-a.tsx` | authenticated | GET `/api/auth/me`, `/api/schedule-a/status` | POST `/api/schedule-a/sign` | legal record (schedule-a signature); PDF download via `/api/schedule-a/download` |
| `/stress-test` | `stress-test.tsx` | authenticated | GET `/api/auth/me`, `/api/affiliate/nda-status`, `/api/stress-test/results` | POST `/api/stress-test/run`, DELETE `/api/stress-test/clear` | creates test sales/commissions data; redirects to `/affiliate/nda` if NDA unsigned |

## Admin Portal Pages (require admin/master role)

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/admin/dashboard` | `admin-dashboard.tsx` | admin | GET (multiple admin queries: applications, requests, investors, affiliates) | mutations for lead management | auto-logout timer |
| `/master-portal` | `master-portal.tsx` | admin/master | GET `/api/auth/me`, `/api/master/affiliate-files`, `/api/admin/finops-referrals`, `/api/admin/disability-referrals`, `/api/admin/vet-professional-intakes`, `/api/admin/healthcare-intakes`, `/api/admin/schedule-a-signatures`, `/api/csu/signed-agreements`, `/api/admin/affiliate-applications` | no | PDF download via `/api/master/affiliate-nda-pdf/:id` |
| `/hipaa-admin` | `hipaa-admin.tsx` | admin/master | GET `/api/auth/me`, `/api/hipaa/baa`, `/api/hipaa/training`, `/api/hipaa/training/expired`, `/api/hipaa/audit-logs`, `/api/admin/users` | POST/PUT `/api/hipaa/baa`, POST `/api/hipaa/training`, DELETE `/api/hipaa/training/:id` | redirects to `/admin/login` if not admin/master |
| `/admin-repair-queue` | `admin-repair-queue.tsx` | admin (implicit) | GET `/api/repair/escalated` (poll 10s), `/api/repair/queue-stats` | POST `/api/repair/approve?id=`, POST `/api/repair/reject?id=` | no |
| `/notification-console` | `notification-console.tsx` | admin/master | GET `/api/me`, `/api/notification-settings`, `/api/admin/audit`, `/api/system/health`, `/api/admin/queue/stats` | PUT `/api/notification-settings` | `<Redirect>` if not authenticated |

## Sub-Master Portal

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/submaster-portal` | `submaster-portal.tsx` | authenticated | GET `/api/auth/me`, `/api/affiliate/nda-status`, `/api/affiliate/security-tracking` | no | redirects to NDA if unsigned |

## CSU (Cost Savings University / Payzium) Pages

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/csu-portal` | `csu-portal.tsx` | public (login within page) | GET `/api/csu/envelopes`, `/api/csu/pending`, `/api/csu/templates` (after login) | POST `/api/auth/login`, POST `/api/csu/send-contract-batch`, POST `/api/csu/ai-smart-extract` | localStorage (remembered email); page view tracking via POST `/api/portal/track`; contract sending |
| `/Payzium` | `csu-portal.tsx` | public (login within page) | (same as `/csu-portal`) | (same as `/csu-portal`) | (same as `/csu-portal`) |
| `/csu-sign` | `csu-sign.tsx` | public (token-based) | GET contract via token | POST contract signature | legal record (document signature) |

## Self-Healing Platform Pages

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/self-repair` | `self-repair.tsx` | public | GET `/api/repair/logs` (poll 10s) | POST `/api/repair/classify`, POST `/api/repair/intake` | logging (repair events) |
| `/critical-flow` | `critical-flow.tsx` | public | GET `/api/critical-flow/incidents` (poll 10s), `/api/critical-flow/incidents?status=PENDING_APPROVAL` (poll 5s) | POST `/api/critical-flow/process`, POST `/api/critical-flow/emergency`, POST `/api/critical-flow/approve/:id` | incident reports via `/api/critical-flow/report/:id`; emergency mode activation; legal logic freeze |

## Navigator Elite Command Center

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/elite` | `navigator-elite.tsx` | public | GET `/api/csu/envelopes`, `/api/csu/templates` | no | no |

## AI Suite Pages

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/operator-ai` | `operator-ai.tsx` | public | no | POST `/api/operator-ai/chat`, DELETE `/api/operator-ai/session/:id`, POST `/api/operator-ai/documents` (file upload) | OpenAI API calls (server-side) |
| `/naval-intelligence` | `naval-intelligence.tsx` | public | GET `/api/orchestration/models`, `/api/ai/gallery`, `/api/ai/templates` | POST `/api/orchestration/route`, POST `/api/ai/generate-image`, POST `/api/ai/text-to-speech`, POST `/api/ai/generate` | OpenAI/AI API calls (server-side) |

## Claims & Vendor Pages

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/claims-navigator` | `claims-navigator.tsx` | authenticated (implicit) | GET `/api/claims/cases`, `/api/claims/cases/:id`, `/api/claims/cases/:id/tasks`, `/api/claims/cases/:id/deadlines`, `/api/claims/cases/:id/notes`, `/api/claims/cases/:id/files`, `/api/claims/cases/:id/shares`, `/api/claims/cases/:id/completeness`, `/api/claims/cases/:id/strength` | multiple mutations for tasks, notes, files, shares, deadlines | no |
| `/vendor-portal` | `vendor-portal.tsx` | vendor (magic-link auth) | GET vendor-scoped case data | limited mutations | passwordless authentication |
| `/document-signature` | `document-signature.tsx` | public | GET document templates | POST document signatures | legal record (document signature) |

## Tools Pages

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/email-signature` | `email-signature.tsx` | public | no | no | no (client-side generator only) |

## VLT (Veteran Led Tax) Pages — Static / Informational

All of the following VLT pages are **public**, perform **no data reads**, **no submissions**, and trigger **no side effects**:

| URL Path | Page / Component File |
|---|---|
| `/veteran-led-tax` | `vlt/home.tsx` |
| `/veteran-led-tax/our-legacy` | `vlt/our-legacy.tsx` |
| `/veteran-led-tax/services` | `vlt/services.tsx` |
| `/veteran-led-tax/services/tax-preparation` | `vlt/tax-preparation.tsx` |
| `/veteran-led-tax/services/tax-planning` | `vlt/tax-planning.tsx` |
| `/veteran-led-tax/services/tax-resolution` | `vlt/tax-resolution.tsx` |
| `/veteran-led-tax/services/tax-recovery` | `vlt/tax-recovery.tsx` |
| `/veteran-led-tax/services/payroll` | `vlt/payroll.tsx` |
| `/veteran-led-tax/services/sales-use-tax-defense` | `vlt/sales-use-tax-defense.tsx` |
| `/veteran-led-tax/services/tax-credits-incentives` | `vlt/tax-credits-incentives.tsx` |
| `/veteran-led-tax/services/outsourced-accounting` | `vlt/outsourced-accounting.tsx` |
| `/veteran-led-tax/services/fractional-cfo` | `vlt/fractional-cfo.tsx` |
| `/veteran-led-tax/services/entity-structuring` | `vlt/entity-structuring.tsx` |
| `/veteran-led-tax/videos` | `vlt/videos.tsx` |
| `/veteran-led-tax/tax-news` | `vlt/tax-news.tsx` |
| `/veteran-led-tax/faqs` | `vlt/faqs.tsx` |
| `/veteran-led-tax/locations` | `vlt/locations.tsx` |
| `/veteran-led-tax/partners` | `vlt/partners.tsx` |
| `/veteran-led-tax/disclosures` | `vlt/disclosures.tsx` |
| `/veteran-led-tax/privacy` | `vlt/privacy.tsx` |
| `/veteran-led-tax/terms` | `vlt/terms.tsx` |
| `/veteran-led-tax/business-owner` | `vlt/business-owner.tsx` |
| `/veteran-led-tax/finops-refer` | `vlt/finops-refer.tsx` |

## VLT Resources Pages (all static, public)

| URL Path | Page / Component File |
|---|---|
| `/veteran-led-tax/resources` | `vlt/resources/index.tsx` |
| `/veteran-led-tax/resources/irs-notices` | `vlt/resources/irs-notices.tsx` |
| `/veteran-led-tax/resources/irs-notices/cp14` | `vlt/resources/cp14.tsx` |
| `/veteran-led-tax/resources/irs-notices/lt11` | `vlt/resources/lt11.tsx` |
| `/veteran-led-tax/resources/irs-notices/cp504` | `vlt/resources/cp504.tsx` |
| `/veteran-led-tax/resources/audit-representation` | `vlt/resources/audit-representation.tsx` |
| `/veteran-led-tax/resources/wage-garnishments` | `vlt/resources/wage-garnishments.tsx` |
| `/veteran-led-tax/resources/forms-and-letters` | `vlt/resources/forms-and-letters.tsx` |
| `/veteran-led-tax/resources/business-loans` | `vlt/resources/business-loans.tsx` |
| `/veteran-led-tax/resources/guides` | `vlt/resources/guides.tsx` |

## VLT Articles Pages (all static, public)

| URL Path | Page / Component File |
|---|---|
| `/veteran-led-tax/articles` | `vlt/articles/index.tsx` |
| `/veteran-led-tax/articles/unfiled-tax-returns` | `vlt/articles/unfiled-tax-returns.tsx` |
| `/veteran-led-tax/articles/back-taxes` | `vlt/articles/back-taxes.tsx` |
| `/veteran-led-tax/articles/irs-audit` | `vlt/articles/irs-audit.tsx` |

## VLT Tax Credits Pages (all static, public)

| URL Path | Page / Component File |
|---|---|
| `/veteran-led-tax/services/tax-credits` | `vlt/tax-credits/index.tsx` |
| `/veteran-led-tax/services/tax-credits/rd-tax-credit` | `vlt/tax-credits/rd-tax-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/utility-tax-credit` | `vlt/tax-credits/utility-tax-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/wotc` | `vlt/tax-credits/wotc.tsx` |
| `/veteran-led-tax/services/tax-credits/energy-tax-credits` | `vlt/tax-credits/energy-tax-credits.tsx` |
| `/veteran-led-tax/services/tax-credits/paid-family-leave-credit` | `vlt/tax-credits/paid-family-leave-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/disabled-access-credit` | `vlt/tax-credits/disabled-access-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/employer-childcare-credit` | `vlt/tax-credits/employer-childcare-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/pension-startup-credit` | `vlt/tax-credits/pension-startup-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/fica-tip-credit` | `vlt/tax-credits/fica-tip-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/new-markets-credit` | `vlt/tax-credits/new-markets-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/rehabilitation-credit` | `vlt/tax-credits/rehabilitation-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/small-business-health-credit` | `vlt/tax-credits/small-business-health-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/lihtc` | `vlt/tax-credits/lihtc.tsx` |
| `/veteran-led-tax/services/tax-credits/indian-employment-credit` | `vlt/tax-credits/indian-employment-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/eitc` | `vlt/tax-credits/eitc.tsx` |
| `/veteran-led-tax/services/tax-credits/child-tax-credit` | `vlt/tax-credits/child-tax-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/aotc` | `vlt/tax-credits/aotc.tsx` |
| `/veteran-led-tax/services/tax-credits/lifetime-learning-credit` | `vlt/tax-credits/lifetime-learning-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/savers-credit` | `vlt/tax-credits/savers-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/adoption-credit` | `vlt/tax-credits/adoption-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/dependent-care-credit` | `vlt/tax-credits/dependent-care-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/foreign-tax-credit` | `vlt/tax-credits/foreign-tax-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/elderly-disabled-credit` | `vlt/tax-credits/elderly-disabled-credit.tsx` |
| `/veteran-led-tax/services/tax-credits/premium-tax-credit` | `vlt/tax-credits/premium-tax-credit.tsx` |

## VLT Apps Pages (all static, public)

| URL Path | Page / Component File |
|---|---|
| `/veteran-led-tax/apps` | `vlt/apps/index.tsx` |
| `/veteran-led-tax/apps/all` | `vlt/apps/index.tsx` |
| `/veteran-led-tax/apps/crm` | `vlt/apps/crm.tsx` |
| `/veteran-led-tax/apps/wotc` | `vlt/apps/wotc.tsx` |
| `/veteran-led-tax/apps/smartfile` | `vlt/apps/smartfile.tsx` |

## VLT Pages — With Data Operations

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `/veteran-led-tax/intake` | `vlt/intake.tsx` | public | no | POST `/api/vlt-intake` | no |
| `/veteran-led-tax/intake-refer` | `vlt/intake-refer.tsx` | public | no | POST `/api/vlt-intake` (with `leadType: "affiliate_referral"`) | no |
| `/veteran-led-tax/intake-client` | `vlt/intake-client.tsx` | public | no | POST `/api/vlt-intake` | no |
| `/veteran-led-tax/pay` | `vlt/pay.tsx` | public | no | POST `/api/checkout` | payment (Stripe checkout redirect) |
| `/veteran-led-tax/admin` | `vlt/admin.tsx` | admin (implicit) | GET `/api/admin/vlt-intake`, `/api/admin/vlt-affiliates` | PUT `/api/admin/vlt-intake/:id`, POST `/api/admin/vlt-affiliates`, DELETE `/api/admin/vlt-affiliates/:id` | no |
| `/veteran-led-tax/affiliate` | `vlt/affiliate-portal.tsx` | VLT affiliate (separate auth) | GET `/api/vlt-affiliate/me`, `/api/vlt-affiliate/leads` | POST `/api/vlt-affiliate/login`, POST `/api/vlt-affiliate/logout` | separate session management |

## Catch-All

| URL Path | Page / Component File | Role | Reads | Submits | Side Effects |
|---|---|---|---|---|---|
| `*` (no match) | `not-found.tsx` | public | no | no | no |

---

## Summary Counts

| Category | Count |
|---|---|
| Total unique URL paths registered | ~185 |
| Static/informational (no data ops) | ~120 |
| Public intake/lead forms (submit only) | ~20 |
| Authentication pages | 7 |
| Affiliate-gated pages | 5 |
| Admin/master-gated pages | 5 |
| Pages with legal record side effects | 5 (affiliate-nda, sign-contract, schedule-a, csu-sign, document-signature) |
| Pages triggering payment | 1 (vlt/pay) |
| Pages triggering email | 1 (forgot-password) |
| AI-powered pages | 2 (operator-ai, naval-intelligence) |
| Self-healing platform pages | 3 (self-repair, admin-repair-queue, critical-flow) |
| Legacy redirects | 4 |
