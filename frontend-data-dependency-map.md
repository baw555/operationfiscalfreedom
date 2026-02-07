# Frontend Data Dependency Map

For each route with data operations: backend endpoints called, hook types, blocking behavior, failure handling, and auth gating pattern. Reports only what the code currently does.

---

## Legend

| Column | Values |
|---|---|
| **Hooks** | `Q` = useQuery, `M` = useMutation, `F` = raw fetch (no hook) |
| **Blocked** | Whether the entire page render is blocked on async data completing |
| **Failure → blank** | Whether an async failure can cause the page to render nothing |
| **returns null** | Component-level `return null` found in code |
| **Conditional empty** | Conditionally renders nothing (empty div, missing content) |
| **Auth gating** | `Redirect` = explicit `<Redirect>`, `setLocation` = imperative redirect via effect, `implicit` = no auth check but backend enforces, `none` = no gating |

---

## Authentication Pages

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/login` | POST `/api/auth/login` | M | no | no | no | no | none |
| `/admin/login` | POST `/api/auth/login` | F | no | no | no | no | none |
| `/admin/setup` | POST `/api/auth/init-admin` | F | no | no | no | no | none |
| `/affiliate/login` | POST `/api/auth/login`, GET `/api/auth/me` | M | no | no | no | no | none |
| `/join` | POST `/api/auth/register` | M | no | no | no | no | none |
| `/forgot-password` | POST `/api/auth/forgot-password` | M | no | no | no | no | none |
| `/reset-password` | GET `/api/auth/validate-reset-token`, POST `/api/auth/reset-password` | Q+M | **yes** (validating spinner) | no (shows invalid token UI) | no | no | none |

---

## Affiliate Portal Pages

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/affiliate/nda` | GET `/api/auth/me`, GET `/api/affiliate/nda-status`, POST `/api/session/heartbeat`, POST `/api/actions/submit-affiliate-nda` | Q+M | **yes** (authLoading spinner) | no (uses `<Redirect>`) | no | no | **Redirect** to `/affiliate/login` if unauthenticated; Redirect to `/login` if wrong role |
| `/affiliate/dashboard` | GET `/api/auth/me`, GET `/api/vlt-affiliate/me`, GET `/api/contracts/templates`, GET `/api/contracts/my-signed`, GET `/api/affiliate/applications`, GET `/api/affiliate/help-requests`, GET `/api/affiliate/business-leads`, GET `/api/affiliate/nda-status`, GET `/api/schedule-a/status`, GET `/api/affiliate/security-tracking` | Q+M | **yes** (authLoading spinner) | no (shows login redirect UI) | no | no | **setLocation** to `/affiliate/login` if not affiliate role; **setLocation** to `/affiliate/nda` if NDA unsigned |
| `/sign-contract` | GET `/api/auth/me`, GET `/api/affiliate/nda-status`, GET `/api/contracts/templates`, GET `/api/contracts/my-signed`, GET `/api/affiliate/w9-status`, POST `/api/contracts/sign`, POST `/api/affiliate/submit-w9` | Q+M | **yes** (authLoading spinner) | no (shows login prompt UI) | no | no | **implicit** — shows login prompt if no user, but no forced redirect |
| `/schedule-a` | GET `/api/auth/me`, GET `/api/schedule-a/status`, POST `/api/schedule-a/sign`, GET `/api/schedule-a/download` | Q+M | no | no | no | no | **implicit** — conditionally shows sign form vs login link based on auth state |

---

## Admin / Master Portal Pages

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/admin/dashboard` | GET (applications, help-requests, doctor-requests, website-apps, general-contacts, investors, affiliates — all via fetch), PUT/PATCH (lead status updates) | Q+M | **yes** (per-panel `PanelSkeleton`) | no (panels show skeletons independently) | **yes** — `LeadDetailModal` returns null if no selected lead (expected behavior) | no | **implicit** — uses `useAutoLogout` hook that redirects to `/admin/login`; no role check in render |
| `/master-portal` | GET `/api/auth/me`, GET `/api/master/affiliate-files`, GET `/api/admin/finops-referrals`, GET `/api/admin/disability-referrals`, GET `/api/admin/vet-professional-intakes`, GET `/api/admin/healthcare-intakes`, GET `/api/admin/schedule-a-signatures`, GET `/api/csu/signed-agreements`, GET `/api/admin/affiliate-applications`, GET `/api/master/affiliate-nda-pdf/:id` | Q | **yes** (authLoading spinner) | no (shows unauthorized message) | no | no | **setLocation** equivalent — renders unauthorized message with login link if not admin/master |
| `/hipaa-admin` | GET `/api/auth/me`, GET `/api/hipaa/baa`, GET `/api/hipaa/training`, GET `/api/hipaa/training/expired`, GET `/api/hipaa/audit-logs`, GET `/api/admin/users`, POST/PUT `/api/hipaa/baa`, POST `/api/hipaa/training`, DELETE `/api/hipaa/training/:id` | Q+M | **yes** (userLoading spinner) | no | no | no | **setLocation** to `/admin/login` if not admin/master role |
| `/notification-console` | GET `/api/me`, GET `/api/notification-settings`, GET `/api/admin/audit`, GET `/api/system/health`, GET `/api/admin/queue/stats`, PUT `/api/notification-settings` | Q+M | **yes** (meLoading spinner) | no | no | no | **setLocation** to `/admin/login` if not authenticated |

---

## Sub-Master / Stress Test Pages

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/submaster-portal` | GET `/api/auth/me`, GET `/api/affiliate/nda-status`, GET `/api/affiliate/security-tracking` | Q | **yes** (authLoading spinner) | no | no | no | **implicit** — shows login UI if not authenticated; redirects to NDA if unsigned |
| `/stress-test` | GET `/api/auth/me`, GET `/api/affiliate/nda-status`, GET `/api/stress-test/results`, POST `/api/stress-test/run`, DELETE `/api/stress-test/clear` | Q+M | **yes** (authLoading spinner) | no (shows login prompt) | no | no | **implicit** — shows login prompt; setLocation to `/affiliate/nda` if NDA unsigned |

---

## CSU (Payzium) Pages

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/csu-portal`, `/Payzium` | POST `/api/auth/login`, POST `/api/portal/track`, GET `/api/csu/envelopes`, GET `/api/csu/pending`, GET `/api/csu/templates`, POST `/api/csu/send-contract-batch`, POST `/api/csu/ai-smart-extract`, POST `/api/csu/void-envelope/:id`, POST `/api/csu/upload-document`, POST `/api/csu/create-from-upload` | Q+M+F | no (login form shown by default) | no | no | no | **in-page login** — authenticated features gated behind internal login state, not route-level auth |
| `/csu-sign` | GET `/api/csu/contract/:token`, POST `/api/csu/sign/:token` | Q+M | **yes** (isLoading spinner) | no (shows error/expired UI) | no | no | **token-based** — no session auth; validated by URL token |

---

## Self-Healing Platform Pages

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/self-repair` | GET `/api/repair/logs` (poll 10s), POST `/api/repair/classify`, POST `/api/repair/intake` | Q+M | no (shows "Loading logs..." inline) | no | no | no | **none** |
| `/admin-repair-queue` | GET `/api/repair/escalated` (poll 10s), GET `/api/repair/queue-stats`, POST `/api/repair/approve`, POST `/api/repair/reject` | Q+M | no (shows "Loading..." inline) | no | no | no | **none** — no auth check whatsoever |
| `/critical-flow` | GET `/api/critical-flow/incidents` (poll 10s), GET `/api/critical-flow/incidents?status=PENDING_APPROVAL` (poll 5s), POST `/api/critical-flow/process`, POST `/api/critical-flow/emergency`, POST `/api/critical-flow/approve/:id`, GET `/api/critical-flow/report/:id` | Q+M | no (shows "Loading..." inline) | no | no | no | **none** — no auth check whatsoever |

---

## AI Suite Pages

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/operator-ai` | POST `/api/operator-ai/chat`, DELETE `/api/operator-ai/session/:id`, POST `/api/operator-ai/documents` | M+F | no | no | no | no | **none** |
| `/naval-intelligence` | GET `/api/orchestration/models`, GET `/api/ai/gallery`, GET `/api/ai/templates`, POST `/api/orchestration/route`, POST `/api/ai/generate-image`, POST `/api/ai/text-to-speech`, POST `/api/ai/generate` | Q+M+F | no | no | no | no | **none** |

---

## Claims & Vendor Pages

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/claims-navigator` | GET `/api/claims/cases`, GET `/api/claims/cases/:id`, GET `/api/claims/cases/:id/tasks`, GET `/api/claims/cases/:id/deadlines`, GET `/api/claims/cases/:id/notes`, GET `/api/claims/cases/:id/files`, GET `/api/claims/cases/:id/shares`, GET `/api/claims/cases/:id/completeness`, GET `/api/claims/cases/:id/strength`, plus mutations for tasks/notes/files/shares/deadlines | Q+M | no (graceful empty arrays) | no | no | **yes** — case detail queries return null when no case selected (expected) | **none** — no auth check; backend returns empty arrays for unauthenticated |
| `/vendor-portal` | GET `/api/vendor/session`, GET `/api/vendor/cases`, GET `/api/vendor/cases/:id`, POST `/api/vendor/magic-link`, POST `/api/vendor/notes` | Q+M | **yes** (sessionLoading spinner) | no (shows login form) | no | no | **token-based** — magic-link/localStorage token auth; shows login form if no session |
| `/document-signature` | GET `/api/csu/templates`, GET `/api/csu/pending`, GET `/api/csu/signed`, POST `/api/contracts/sign`, POST `/api/csu/ai-analyze` | Q+M | no (inline loading per section) | no | no | no | **none** |

---

## Navigator Elite

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/elite` | GET `/api/csu/envelopes`, GET `/api/csu/templates` | Q | no | no | no | no | **none** |

---

## VLT Pages With Data Operations

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/veteran-led-tax/intake` | POST `/api/vlt-intake` | F | no | no | no | no | none |
| `/veteran-led-tax/intake-refer` | POST `/api/vlt-intake` | F | no | no | no | no | none |
| `/veteran-led-tax/intake-client` | POST `/api/vlt-intake` | F | no | no | no | no | none |
| `/veteran-led-tax/pay` | POST `/api/checkout` | F | no | no | no | no | none |
| `/veteran-led-tax/admin` | GET `/api/admin/vlt-intake`, GET `/api/admin/vlt-affiliates`, PUT `/api/admin/vlt-intake/:id`, POST `/api/admin/vlt-affiliates`, DELETE `/api/admin/vlt-affiliates/:id` | F | no | no | no | no | **none** — no auth check; admin endpoints exposed without frontend gating |
| `/veteran-led-tax/affiliate` | GET `/api/vlt-affiliate/me`, GET `/api/vlt-affiliate/leads`, POST `/api/vlt-affiliate/login`, POST `/api/vlt-affiliate/logout` | F | **yes** (loading spinner while checking session) | no (shows login form) | no | no | **in-page login** — separate VLT affiliate session, not route-level auth |

---

## Public Intake / Lead Forms (submit-only)

All of the following use **useMutation only** (M), are **not blocked** on async data, **cannot fail to blank**, **do not return null**, and have **no auth gating**.

| URL Path | Endpoint | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/contact` | POST `/api/general-contact` | M | no | no | no | no | none |
| `/get-help` | POST `/api/help-requests` | M | no | no | **yes** — utility `getCookie` returns null (not page-level) | no | none |
| `/affiliate` | POST `/api/affiliate-signup` | M | no | no | no | no | none |
| `/apply-website` | POST `/api/website-applications` | M | no | no | no | no | none |
| `/apply-startup-grant` | POST `/api/startup-grants` | M | no | no | no | no | none |
| `/veteran-intake` | POST `/api/veteran-intake` | M | no | no | no | no | none |
| `/business-intake` | POST `/api/business-intake` | M | no | no | no | no | none |
| `/new-home-furniture` | POST `/api/furniture-assistance` | M | no | no | no | no | none |
| `/private-doctor` | POST `/api/private-doctor-requests` | M | no | no | no | no | none |
| `/businesses` | POST `/api/business-leads` | M | no | no | no | no | none |
| `/ranger-tab-signup` | POST `/api/ranger-tab-signup` | M | no | no | no | no | none |
| `/medical-sales` | POST `/api/medical-sales-intakes` | M | no | no | no | no | none |
| `/business-development` | POST `/api/business-dev-intakes` | M | no | no | no | no | none |
| `/job-placement` | POST `/api/job-placement-intakes` | M | no | no | no | no | none |
| `/insurance` | POST `/api/insurance-intakes` | M | no | no | no | no | none |
| `/disability-rating/intake` | POST `/api/disability-referrals` | M | no | no | no | no | none |
| `/healthcare` (all sub-paths) | POST `/api/healthcare-intakes` | M | no | no | no | no | none |

---

## Fin-Ops Hub

| URL Path | Endpoint | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/fin-ops` (all sub-paths) | POST (via apiRequest) | M | no | no | no | no | none |

---

## Tools

| URL Path | Endpoints Called | Hooks | Blocked | Failure → blank | returns null | Conditional empty | Auth Gating |
|---|---|---|---|---|---|---|---|
| `/email-signature` | none | none | no | no | **yes** — sub-component returns null if no data present (not page-level) | no | none |

---

## Static / Informational Pages (No Data Operations)

All ~120 static pages (listed in the route inventory) use **no hooks**, are **not blocked**, **cannot fail**, **do not return null**, and have **no auth gating**. These are omitted from this table for brevity.

---

## Anti-Pattern Summary

| Anti-Pattern | Affected Routes |
|---|---|
| **Page-level render blocked on auth query** (full spinner until auth resolves) | `/affiliate/nda`, `/affiliate/dashboard`, `/sign-contract`, `/master-portal`, `/hipaa-admin`, `/notification-console`, `/submaster-portal`, `/stress-test`, `/vendor-portal`, `/csu-sign`, `/reset-password` |
| **Auth gating via `setLocation` in useEffect** (imperative redirect, not declarative) | `/affiliate/dashboard`, `/hipaa-admin`, `/notification-console`, `/stress-test` |
| **Auth gating via explicit `<Redirect>`** (declarative — preferred pattern) | `/affiliate/nda` |
| **No auth gating on admin-intended pages** (frontend has zero role check) | `/admin-repair-queue`, `/critical-flow`, `/veteran-led-tax/admin`, `/elite` |
| **No auth gating on sensitive operations** (frontend has no check, relies entirely on backend) | `/self-repair`, `/operator-ai`, `/naval-intelligence`, `/document-signature`, `/claims-navigator` |
| **Panel-level `return null`** (sub-component, not page-level — acceptable pattern) | `/admin-dashboard` (LeadDetailModal), `/claims-navigator` (case detail), `/email-signature` (conditional section) |
| **`return null` in utility function** (not a page render issue) | `/get-help` (getCookie helper) |
| **In-page login** (separate auth flow embedded in page, not route-level) | `/csu-portal`, `/veteran-led-tax/affiliate` |
| **Token-based auth** (no session, URL or localStorage token) | `/csu-sign`, `/vendor-portal` |
| **Mixed auth strategy** — page has auth check but data queries return null/empty on failure instead of throwing | `/sign-contract`, `/submaster-portal`, `/claims-navigator` |
| **Auto-logout hook as implicit auth** — no explicit role check in component render | `/admin/dashboard` |
| **Multiple independent queries without Suspense boundaries** — if one fails, panel may show stale/empty data but page still renders | `/affiliate/dashboard` (10 queries), `/master-portal` (9 queries), `/hipaa-admin` (6 queries), `/claims-navigator` (9+ queries) |
