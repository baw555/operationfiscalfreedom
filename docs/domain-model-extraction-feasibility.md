# Domain Model Extraction Feasibility Report

**Codebase:** `shared/schema.ts` (93 tables), `server/routes.ts` (~11,171 lines), `server/actions/`, `server/storage.ts`  
**ORM:** Drizzle ORM (PostgreSQL)

---

## Entity 1: User / Affiliate Identity

### Tables Spanned
- `users` — primary identity table (serial PK, email/password, role, referral_code)
- `vlt_affiliates` — separate affiliate identity with own auth (serial PK, own email/password)
- `veteran_auth_users` — UUID-based identity for claims domain (varchar PK, gen_random_uuid)
- `ai_users` — separate AI-specific identity (serial PK, email or anon_device_id)

### Routes That Mutate
| Route | Action | Target Table |
|---|---|---|
| `POST /api/affiliate-signup` | Creates user + auto-login session | `users` |
| `POST /api/admin/affiliates` | Admin creates affiliate user | `users` |
| `POST /api/auth/register` | Public self-registration | `users` |
| `POST /api/auth/login` | Authenticates, sets session | `users` (read + session write) |
| `POST /api/auth/initial-admin` | Creates first admin | `users` |
| `PATCH /api/admin/affiliates/:id` | Admin updates user record | `users` |
| `DELETE /api/admin/affiliates/:id` | Admin deletes user | `users` |
| `POST /api/auth/forgot-password` | Creates reset token | `password_reset_tokens` (FK to `users`) |
| `POST /api/auth/reset-password` | Updates password hash | `users` |
| `POST /api/admin/vlt-affiliates` | Creates VLT affiliate + bcrypt hash | `vlt_affiliates` |
| `PATCH /api/admin/vlt-affiliates/:id` | Updates VLT affiliate | `vlt_affiliates` |
| `DELETE /api/admin/vlt-affiliates/:id` | Deletes VLT affiliate | `vlt_affiliates` |
| `POST /api/vlt-affiliate/login` | Authenticates VLT affiliate | `vlt_affiliates` (read + session write) |
| `PATCH /api/vlt-affiliate/password` | Updates VLT password | `vlt_affiliates` |

### Routes That Read
| Route | Target Table |
|---|---|
| `GET /api/auth/me` | `users` (session lookup) |
| `GET /api/admin/affiliates` | `users` (all with role=affiliate) |
| `GET /api/admin/affiliates/:id` | `users` (single) |
| `GET /api/admin/vlt-affiliates` | `vlt_affiliates` (all) |
| `GET /api/admin/vlt-affiliates/:id/downline` | `vlt_affiliates` (hierarchy traversal) |
| `GET /api/vlt-affiliate/me` | `vlt_affiliates` (session lookup) |

### Single Source of Truth?
**NO.** Four separate identity tables with zero FK relationships between them:
- `users` is referenced by 30+ tables across admin, legal, CSU, HIPAA, notifications
- `vlt_affiliates` is referenced by `sales`, `commissions` (separate auth system)
- `veteran_auth_users` is referenced by `claim_sessions`, `claim_files` (UUID-based)
- `ai_users` is referenced by `ai_sessions`, `ai_files`, `ai_memory`, `ai_jobs`, `media_pipelines`

Polymorphic conflict: `signed_agreements.affiliate_id` (NOT NULL, no FK) can reference EITHER `users.id` OR `vlt_affiliates.id`. No type discriminator column exists.

### Lifecycle Fragmented?
**YES.** User creation scattered across 4+ routes with no unified user factory. Session management duplicated in 4 separate places (affiliate signup lines 454-488, VLT login lines 1696-1722, regular login lines 1878-1926, registration lines 2013-2037) — each using nested `req.login()` callbacks with copy-pasted error handling.

### Can It Be Represented as a Stable Class Object Today?
**NO.** Cannot create a stable `User` class because:
- Identity split across 4 unlinked tables — no way to resolve which table a given `userId` references
- PK types are incompatible (`serial` integer vs `varchar` UUID)
- Polymorphic IDs (`signed_agreements.affiliate_id`) prevent type-safe FK traversal
- Session setup logic tightly coupled to Express `req` object in 4 places
- No mapping table or discriminator to unify the 4 identity systems

---

## Entity 2: Legal Documents (NDA, Contracts, Signatures)

### Tables Spanned
- `affiliate_nda` — affiliate-specific NDAs (FK to `users`)
- `legal_signatures` — global signature tracking (FK to `users`)
- `contract_templates` — contract definitions
- `signed_agreements` — signed contracts (FK to `contract_templates`, `users`; polymorphic `affiliate_id`)
- `legal_override_audit` — admin overrides (FK to `users` for both admin_id and user_id)
- `signature_metrics` — funnel tracking (`user_id` stored as text, no FK)

### Routes That Mutate
| Route | Action | Target Table(s) |
|---|---|---|
| `POST /api/affiliate/nda/submit` | Submits NDA via action file | `affiliate_nda`, `legal_signatures`, `events` (transactional) |
| `POST /api/legal/sign/:type` | Signs any legal document | `legal_signatures` (via `signLegalDocumentAtomic`) |
| `POST /api/legal/override` | Admin override | `legal_override_audit`, `legal_signatures` |
| `POST /api/contracts/sign` | Signs contract + mirrors to legal system | `signed_agreements`, `legal_signatures` |
| `POST /api/contracts/templates` | Admin creates template | `contract_templates` |
| `PATCH /api/contracts/templates/:id` | Admin updates template | `contract_templates` |
| `POST /api/metrics/signature-event` | Records funnel event | `signature_metrics` |

### Routes That Read
| Route | Target Table(s) |
|---|---|
| `GET /api/affiliate/nda/status` | `affiliate_nda` (checks if user has signed) |
| `GET /api/legal/status` | `legal_signatures` (all documents for user) |
| `GET /api/legal/health` | `legal_signatures` (system health check) |
| `GET /api/contracts/templates` | `contract_templates` |
| `GET /api/contracts/templates/:id` | `contract_templates` (single) |
| `GET /api/contracts/my-signed` | `signed_agreements` (by affiliate_id) |
| `GET /api/contracts/signed/:id/download` | `signed_agreements` (PDF generation) |

### Single Source of Truth?
**PARTIAL.** Three separate signature/agreement systems coexist:
1. `affiliate_nda` — NDA-specific, FK to `users`, has dedicated action file
2. `legal_signatures` — global tracker, FK to `users`, UNIQUE constraint on `(user_id, document_type, document_version)` claimed in comments but NOT enforced in Drizzle schema
3. `signed_agreements` — contracts, polymorphic `affiliate_id` with no FK, plus nullable `user_id` FK

NDA submission mirrors into `legal_signatures` (line in `submitAffiliateNda.ts`), and contract signing also mirrors (line 4491 in routes.ts). So `legal_signatures` acts as a partial aggregator, but it doesn't contain the full document data — just status.

### Lifecycle Fragmented?
**YES.** Signing logic exists in three separate flows:
1. NDA: Dedicated action file (`server/actions/nda/submitAffiliateNda.ts`) — transactional, with idempotency, event emission, degraded feature handling
2. Generic legal: `signLegalDocumentAtomic()` in `server/legal-system.ts` — receives entire `req` object (line 2755)
3. Contract: Inline route handler (lines 4478-4511) — signs + mirrors to legal system

The NDA action is the most mature (transactional, atomic). The generic legal signer takes `req` as parameter (Express coupling). The contract signer is inline with mirroring logic.

### Can It Be Represented as a Stable Class Object Today?
**PARTIAL.** Could create a `LegalDocument` class IF:
- All signatures unified into `legal_signatures` table (currently 3 systems)
- `signed_agreements.affiliate_id` polymorphic ID resolved with type discriminator
- `signLegalDocumentAtomic` decoupled from Express `req` object
- `signature_metrics.user_id` changed from text to integer FK
- Missing compound UNIQUE on `legal_signatures` actually enforced in schema

---

## Entity 3: Claim Case

### Tables Spanned
- `claim_cases` — case metadata (root aggregate)
- `claim_tasks` — checklist items (FK to `claim_cases`, `claim_sessions`)
- `claim_files` — uploaded evidence (FK to `claim_cases`, `claim_sessions`, `veteran_auth_users`)
- `claim_sessions` — wizard sessions (FK to `veteran_auth_users`)
- `claim_answers` — wizard Q&A responses (FK to `claim_sessions`)
- `case_shares` — vendor permissions (FK to `claim_cases`)
- `case_notes` — timeline comments (FK to `claim_cases`)
- `case_deadlines` — due dates (FK to `claim_cases`)
- `evidence_requirements` — rules table (no FK, standalone reference data)

### Routes That Mutate
| Route | Action | Target Table |
|---|---|---|
| `POST /api/claims/cases` | Creates case + default tasks atomically | `claim_cases`, `claim_tasks` |
| `PATCH /api/claims/cases/:id` | Updates case metadata | `claim_cases` |
| `PATCH /api/claims/tasks/:id` | Updates task status/notes | `claim_tasks` |
| `POST /api/claims/cases/:id/notes` | Adds timeline note | `case_notes` |
| `POST /api/claims/cases/:id/deadlines` | Adds deadline | `case_deadlines` |
| `PATCH /api/claims/deadlines/:id` | Updates deadline | `case_deadlines` |
| `POST /api/claims/files` | Uploads evidence file | `claim_files` |
| `PATCH /api/claims/files/:id/evidence` | Updates evidence metadata | `claim_files` |
| `POST /api/claims/shares` | Shares case with vendor | `case_shares` |
| `DELETE /api/claims/shares/:id` | Removes vendor access | `case_shares` |
| `POST /api/claims/sessions` | Creates wizard session | `claim_sessions` |

### Routes That Read
| Route | Target Table(s) |
|---|---|
| `GET /api/claims/cases` | `claim_cases` (by veteran_user_id) |
| `GET /api/claims/cases/:id` | `claim_cases` (single) |
| `GET /api/claims/cases/:id/tasks` | `claim_tasks` (by case_id) |
| `GET /api/claims/cases/:id/notes` | `case_notes` (by case_id) |
| `GET /api/claims/cases/:id/deadlines` | `case_deadlines` (by case_id) |
| `GET /api/claims/cases/:id/files` | `claim_files` (by case_id) |
| `GET /api/claims/cases/:id/shares` | `case_shares` (by case_id) |
| `GET /api/claims/evidence-requirements` | `evidence_requirements` (by track + purpose) |
| `GET /api/claims/cases/:id/analysis` | `claim_files`, `evidence_requirements` (computed) |

### Single Source of Truth?
**YES.** Claims domain owns 9 related tables with `claim_cases` as clear root aggregate. All child tables FK to `claim_cases.id`. `evidence_requirements` is reference data (no FK needed).

**However**, ownership verification is copy-pasted across 7+ route handlers. Each handler independently fetches the case and checks `claimCase.veteranUserId !== userId`. No middleware or shared ownership guard exists.

### Lifecycle Fragmented?
**MODERATE.** Case creation is atomic (creates case + default tasks in one call). But updates are scattered across 8+ independent endpoints with no aggregate-level validation. Each endpoint independently:
1. Authenticates via `getVeteranUserId(req)`
2. Fetches case by ID
3. Checks ownership
4. Performs single-table mutation

FK inconsistency: `claim_cases.veteran_user_id` is varchar with NO FK constraint, while `claim_sessions.veteran_user_id` properly FK's to `veteran_auth_users.id`. `claim_tasks.veteran_user_id` is also varchar with no FK.

### Can It Be Represented as a Stable Class Object Today?
**YES, IF REFACTORED.** This is the most feasible entity for class extraction because:
- Single ownership model (`veteran_user_id`)
- Complete FK chain from root to children (9 related tables)
- Atomic creation already exists (case + tasks)
- No polymorphic IDs
- No cross-domain identity conflicts

Required fixes:
- Centralize ownership checks (currently duplicated 7+ times)
- Add FK constraint on `claim_cases.veteran_user_id` → `veteran_auth_users.id`
- Add FK constraint on `claim_tasks.veteran_user_id` → `veteran_auth_users.id`
- Fix `case_notes.author_email` type mismatch (stores userId integer as text)

---

## Entity 4: Commission / Sale

### Tables Spanned
- `opportunities` — service/product definitions
- `sales` — sale records (FK to `opportunities`, `vlt_affiliates`)
- `commissions` — payout records (FK to `sales`, `vlt_affiliates`)
- `commission_config` — calculation rules (percentage config)
- `vlt_affiliates` — affiliate hierarchy (7-level flattened chain)

### Routes That Mutate
| Route | Action | Target Table |
|---|---|---|
| `POST /api/opportunities` | Admin creates opportunity | `opportunities` |
| `PATCH /api/opportunities/:id` | Admin updates opportunity | `opportunities` |
| `POST /api/sales` | Creates sale record | `sales` |
| `PATCH /api/sales/:id` | Admin updates sale status | `sales` |
| `POST /api/commission/seed` | Seeds default config | `commission_config` |
| `PATCH /api/admin/commission/config/:id` | Updates config | `commission_config` |

### Routes That Read
| Route | Target Table(s) |
|---|---|
| `GET /api/opportunities` | `opportunities` |
| `GET /api/admin/sales` | `sales` |
| `GET /api/admin/commissions` | `commissions` |
| `POST /api/commission/calculate` | `commission_config` (calculates breakdown, no write) |
| `GET /api/commission/config` | `commission_config` |
| `POST /api/admin/send-commission-spreadsheet` | `sales`, `commissions`, `vlt_affiliates` (generates + emails) |

### Single Source of Truth?
**NO.** Commission calculation logic is embedded in a route handler (lines 4642-4702, ~61 lines of business logic). The same percentages are hardcoded in the email spreadsheet template (lines 4816-4983, 168 lines of HTML). A stress test route also recomputes commissions independently (lines 5360-5389).

Referral chain stored as 7 flat nullable columns in `sales` (`referred_by_l1` through `referred_by_l7`) — all without FK constraints. This duplicates the hierarchy already stored in `vlt_affiliates` (`level1_id` through `level7_id`, also without FKs).

### Lifecycle Fragmented?
**YES.** Commission calculation is duplicated in 3 places:
1. Route handler — computes breakdown from config (lines 4642-4702)
2. Stress test route — recomputes for validation (lines 5360-5389)
3. Email template — hardcodes percentages in HTML (lines 4816-4983)

Booleans stored as text strings: `opportunities.is_active`, `commission_config.is_active`, `sales.l2_active` through `l5_active` — all store `"true"`/`"false"` as text, not boolean columns.

### Can It Be Represented as a Stable Class Object Today?
**NO.** Cannot create a stable `Sale` or `Commission` class because:
- Commission calculation logic not extracted (embedded in route + hardcoded in email)
- 7-level referral chain flattened into 14 nullable columns (7 in `sales`, 7 in `vlt_affiliates`) with no FK integrity
- `vlt_affiliates` hierarchy has 8 missing FK constraints (7 levels + recruiter)
- No safe way to traverse upline chain — each route rebuilds it inline with `(data as any).referredByL1 = affiliate.id` casting
- Booleans stored as text prevent type-safe domain modeling

---

## Entity 5: CSU Contract / Envelope

### Tables Spanned
- `csu_contract_templates` — contract definitions
- `csu_contract_template_fields` — dynamic form fields (FK to templates)
- `csu_contract_sends` — legacy single-recipient sends (FK to templates, `users`)
- `csu_signed_agreements` — legacy signed records (FK to sends, templates)
- `csu_envelopes` — multi-recipient signing (FK to templates, `users`)
- `csu_envelope_recipients` — individual signers (FK to envelopes)
- `csu_audit_trail` — event log (nullable FKs to envelopes, recipients, AND sends)

### Routes That Mutate
| Route | Action | Target Table(s) |
|---|---|---|
| `POST /api/csu/send-contract` | Sends single-recipient contract | `csu_contract_sends` |
| `POST /api/csu/sign/:token` | Signer signs document | `csu_signed_agreements`, `csu_audit_trail` |
| `POST /api/csu/envelopes` | Creates multi-recipient envelope | `csu_envelopes`, `csu_envelope_recipients` |
| `POST /api/csu/envelopes/:id/recipients/:recipientId/sign` | Envelope recipient signs | `csu_envelope_recipients`, `csu_audit_trail` |
| `POST /api/csu/contract-templates` | Admin creates template | `csu_contract_templates` |
| `PATCH /api/csu/contract-templates/:id` | Admin updates template | `csu_contract_templates` |

### Routes That Read
| Route | Target Table(s) |
|---|---|
| `GET /api/csu/contract-templates` | `csu_contract_templates` |
| `GET /api/csu/check-sign/:token` | `csu_contract_sends` (token lookup) |
| `GET /api/csu/signed-agreements` | `csu_signed_agreements` (admin: all) |
| `GET /api/csu/envelopes` | `csu_envelopes` |
| `GET /api/csu/envelopes/:id` | `csu_envelopes`, `csu_envelope_recipients` |
| `GET /api/csu/audit/:envelopeId` | `csu_audit_trail` |

### Single Source of Truth?
**NO.** Two parallel signing systems coexist without a migration path:
1. **Legacy single-send:** `csu_contract_sends` → `csu_signed_agreements` (one recipient per send)
2. **New envelope system:** `csu_envelopes` → `csu_envelope_recipients` (multiple recipients per envelope)

Both reference `csu_contract_templates`. The `csu_audit_trail` has nullable FKs to BOTH systems (`envelope_id`, `recipient_id`, AND `contract_send_id`), acting as a union audit log across two incompatible flows.

### Lifecycle Fragmented?
**YES.** Signing workflow is duplicated:
- Single-send flow: Token-based signing (lines 6317-6404) writes to `csu_signed_agreements` + `csu_audit_trail`
- Envelope flow: Recipient-based signing (separate routes) writes to `csu_envelope_recipients` + `csu_audit_trail`
- Both flows write audit trail entries but populate different FK columns (one uses `contract_send_id`, the other uses `envelope_id` + `recipient_id`)

### Can It Be Represented as a Stable Class Object Today?
**NO.** Cannot create a unified `CsuContract` class because:
- Two parallel signing systems with no shared abstraction
- Polymorphic audit trail (references either `csu_contract_sends` OR `csu_envelopes`)
- No clear migration path or deprecation of legacy system
- Both systems remain actively used in production routes

---

## Entity 6: AI Session / Generation

### Tables Spanned
- `ai_users` — AI-specific identity (serial PK)
- `ai_sessions` — conversation sessions (FK to `ai_users`)
- `ai_messages` — chat history (FK to `ai_sessions`)
- `ai_files` — uploaded documents (FK to `ai_users`, `ai_sessions`)
- `ai_memory` — persistent key-value memory (FK to `ai_users`, `ai_messages`)
- `ai_jobs` — async generation tasks (FK to `ai_users`, `ai_sessions`)
- `ai_generations` — video/music generation records (FK to `users`, NOT `ai_users`)
- `ai_templates` — generation templates (no FK from `ai_generations`)
- `operator_ai_memory` — separate memory table (FK to `users`, NOT `ai_users`)

### Routes That Mutate
| Route | Action | Target Table(s) |
|---|---|---|
| `POST /api/operator-ai/chat` | Sends chat message (174 lines of orchestration) | `operator_ai_memory`, OpenAI API |
| `POST /api/ai/generate` | Starts generation job | `ai_generations` |
| `POST /api/ai/sessions` | Creates AI session | `ai_sessions` |
| `DELETE /api/operator-ai/session/:sessionId` | Clears session memory | `operator_ai_memory` |
| `DELETE /api/operator-ai/persistent/:userId` | Wipes persistent memory | `operator_ai_memory` |
| `POST /api/operator-ai/documents` | Uploads files for AI context | In-memory `documentStore` |
| `POST /api/ai/templates` | Admin creates template | `ai_templates` |
| `PATCH /api/ai/templates/:id` | Admin updates template | `ai_templates` |

### Routes That Read
| Route | Target Table(s) |
|---|---|
| `GET /api/operator-ai/session/:sessionId` | `operator_ai_memory` (message history) |
| `GET /api/ai/generations` | `ai_generations` |
| `GET /api/ai/templates` | `ai_templates` (active only) |

### Single Source of Truth?
**NO.** Memory stored in TWO separate tables:
- `operator_ai_memory` (FK to `users.id`) — used by Operator AI chat
- `ai_memory` (FK to `ai_users.id`) — defined in schema but used by the separate AI app domain

`ai_generations` FK's to `users.id` (the main identity), while all other AI tables FK to `ai_users.id` (the AI-specific identity). This creates a cross-domain identity split within the AI system itself.

### Lifecycle Fragmented?
**YES.** Chat logic embedded entirely in a route handler (lines 8690-8863, ~174 lines):
- Content filtering / safety checks
- Preset context building per document type
- Memory mode logic (stateless / session / persistent)
- OpenAI API call with streaming
- Message storage and retrieval
- Document context injection

All orchestration is inline — no service layer, no testable unit.

### Can It Be Represented as a Stable Class Object Today?
**PARTIAL.** Could create an `AiSession` class IF:
- `operator_ai_memory` and `ai_memory` unified into one table
- Chat orchestration extracted from route handler into service
- `ai_generations.template_id` FK added (currently no FK to `ai_templates`)
- Identity resolved: `ai_generations` uses `users.id` but other AI tables use `ai_users.id`
- Document store moved from in-memory `Map` to persistent storage

---

## Entity 7: VLT Affiliate Hierarchy

### Tables Spanned
- `vlt_affiliates` — affiliate records with 7-level hierarchy
- `sales` — referral chain tracking (duplicates hierarchy)
- `commissions` — payouts linked to affiliates
- `veteran_intake`, `business_intake`, `vlt_intake` — intake forms with referral chains

### Routes That Mutate
| Route | Action | Target Table |
|---|---|---|
| `POST /api/admin/vlt-affiliates` | Creates affiliate + builds upline chain + bcrypt hash | `vlt_affiliates` |
| `PATCH /api/admin/vlt-affiliates/:id` | Updates affiliate record | `vlt_affiliates` |
| `DELETE /api/admin/vlt-affiliates/:id` | Deletes affiliate | `vlt_affiliates` |
| `POST /api/vlt-affiliate/login` | Authenticates VLT affiliate | `vlt_affiliates` (read + session) |
| `PATCH /api/vlt-affiliate/password` | Updates password | `vlt_affiliates` |

### Routes That Read
| Route | Target Table(s) |
|---|---|
| `GET /api/admin/vlt-affiliates` | `vlt_affiliates` (all) |
| `GET /api/admin/vlt-affiliates/:id/downline` | `vlt_affiliates` (hierarchy traversal) |
| `GET /api/vlt-affiliate/me` | `vlt_affiliates` (session lookup) |

### Single Source of Truth?
**NO.** Hierarchy stored as 7 flat columns in `vlt_affiliates` (`level1_id` through `level7_id`) — all nullable integers with zero FK constraints.

The same hierarchy is DUPLICATED as 7 flat columns in every intake table:
- `sales`: `referred_by_l1` through `referred_by_l7` (no FKs)
- `veteran_intake`: `referred_by_l1` through `referred_by_l7` (no FKs)
- `business_intake`: `referred_by_l1` through `referred_by_l7` (no FKs)
- `vlt_intake`: `referred_by_l1` through `referred_by_l6` (no FKs)

Total: 34 denormalized referral columns across 5 tables, none with FK constraints.

### Lifecycle Fragmented?
**MODERATE.** Affiliate creation in route handler (lines 1607-1649) includes:
- Bcrypt password hashing
- Upline chain building from referral code
- `level1_id` through `level7_id` assignment

Hierarchy traversal logic not extracted — each route that needs the upline chain rebuilds it inline with `(data as any).referredByL1 = affiliate.id` type casting.

### Can It Be Represented as a Stable Class Object Today?
**NO.** Cannot create a `VltAffiliate` tree structure because:
- 8 missing FK constraints (7 levels + recruiter) prevent safe traversal
- Hierarchy duplicated in `sales` + 3 intake tables (34 columns, no FKs)
- `vlt_affiliates` is completely separate from `users` table — no FK or mapping
- Upline chain built with `as any` casts, not type-safe assignment
- Booleans stored as text (`is_comp_active`: `"true"` / `"false"`)

---

## Entity 8: Sailor Man AI Assistant

### Tables Spanned
- `sailor_conversations` — conversation sessions
- `sailor_messages` — chat history (FK to `sailor_conversations`)
- `sailor_faq` — knowledge base entries

### Routes That Mutate
| Route | Action | Target Table(s) |
|---|---|---|
| `POST /api/sailor/chat` | Sends message, gets AI response | `sailor_conversations`, `sailor_messages` |
| `POST /api/admin/sailor/faq` | Creates FAQ entry | `sailor_faq` |
| `PATCH /api/admin/sailor/faq/:id` | Updates FAQ entry | `sailor_faq` |
| `DELETE /api/admin/sailor/faq/:id` | Deletes FAQ entry | `sailor_faq` |
| `POST /api/admin/sailor/faq/seed` | Seeds initial FAQs | `sailor_faq` |

### Routes That Read
| Route | Target Table(s) |
|---|---|
| `GET /api/sailor/conversation/:sessionId` | `sailor_conversations`, `sailor_messages` |
| `GET /api/sailor/tips` | In-memory tips (no DB) |
| `GET /api/admin/sailor/faq` | `sailor_faq` |

### Single Source of Truth?
**YES.** Sailor domain is self-contained with 3 tables. `sailor_conversations` is the root, `sailor_messages` FK's to it, `sailor_faq` is standalone reference data.

### Lifecycle Fragmented?
**LOW.** Chat logic lives in `server/sailor-chat.ts` (extracted service). Conversation creation and message persistence handled in one service file. FAQ management is straightforward CRUD.

### Can It Be Represented as a Stable Class Object Today?
**YES.** This is the simplest candidate:
- 3 tables with clear FK relationships
- Service layer already extracted (`sailor-chat.ts`)
- No identity conflicts (uses session-based anonymous chat)
- No polymorphic references
- No cross-domain dependencies

---

## Summary Table

| Entity | Tables | Single Source of Truth? | Lifecycle Fragmented? | Class Object Feasible? |
|---|---|---|---|---|
| **User/Affiliate Identity** | 4 | NO (4 unlinked identity tables) | YES (4+ creation routes, 4 session setups) | NO |
| **Legal Documents** | 6 | PARTIAL (3 signature systems) | YES (3 signing flows, Express coupling) | PARTIAL |
| **Claim Case** | 9 | YES (root aggregate with FK chain) | MODERATE (ownership checks duplicated 7x) | YES IF REFACTORED |
| **Commission/Sale** | 5 | NO (calc logic in 3 places, hardcoded) | YES (duplicated in route, email, stress test) | NO |
| **CSU Contract/Envelope** | 7 | NO (2 parallel signing systems) | YES (legacy + envelope flows) | NO |
| **AI Session/Generation** | 9 | NO (2 memory tables, split identity) | YES (174 lines of orchestration in route) | PARTIAL |
| **VLT Affiliate Hierarchy** | 5+ | NO (34 denormalized columns, no FKs) | MODERATE (inline chain building) | NO |
| **Sailor Man Assistant** | 3 | YES (self-contained domain) | LOW (service already extracted) | YES |

---

## Blocking Issues for Class Object Extraction

1. **4 Disconnected Identity Systems** — `users`, `vlt_affiliates`, `veteran_auth_users`, `ai_users` have no FK relationships, no mapping table, and incompatible PK types (serial vs UUID varchar)
2. **52+ Missing FK Constraints** — Cannot safely traverse relationships between tables; referential integrity depends entirely on application code
3. **Polymorphic IDs Without Type Discriminators** — `signed_agreements.affiliate_id` could reference either `users` or `vlt_affiliates`; `events.entity_id` + `entity_type` is type-unsafe
4. **34 Denormalized Referral Chain Columns** — Hierarchy flattened across 5 tables instead of relational structure, all without FK constraints
5. **Business Logic in Route Handlers** — Commission calculation (61 lines), AI chat orchestration (174 lines), email template (168 lines of HTML) all embedded in `routes.ts`
6. **Express `req` Object Passed to Domain Functions** — `signLegalDocumentAtomic` receives entire `req` object, coupling domain logic to HTTP layer
7. **Duplicated Ownership Checks** — Claims domain copy-pastes `if (claimCase.veteranUserId !== userId)` across 7+ handlers
8. **Booleans Stored as Text** — 10+ columns store `"true"`/`"false"` as text strings, preventing type-safe domain modeling
9. **25+ JSON-in-Text Columns** — Structured data stored as text instead of JSONB, requiring manual parsing in any domain layer
10. **In-Memory State** — AI document store uses `Map` in `documentProcessor.ts`, bypassing database entirely

---

## Feasibility Conclusion

**Class objects are NOT feasible today for 5 out of 8 entities** due to missing relational integrity, polymorphic references, identity fragmentation, and business logic embedded in route handlers.

**Two entities are extraction-ready:**
- **Sailor Man Assistant** — Self-contained, service already extracted, clean FK chain
- **Claim Case** — Strongest aggregate root, complete FK chain (9 tables), needs ownership guard centralization and 2 missing FK fixes

**Two entities are partially feasible:**
- **Legal Documents** — Requires unifying 3 signature systems and decoupling from Express `req`
- **AI Session** — Requires unifying 2 memory tables and extracting 174-line orchestration from route

**No fixes proposed. No refactoring performed. Assessment only.**
