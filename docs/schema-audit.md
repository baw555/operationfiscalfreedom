# Relational Database Truth Audit

**File:** `shared/schema.ts` (2,523 lines) + `shared/models/auth.ts` (30 lines)  
**ORM:** Drizzle ORM (PostgreSQL)

---

## All Tables

| # | Table Name | Primary Key | Unique Constraints |
|---|---|---|---|
| 1 | `users` | `id` (serial) | `email`, `referral_code` |
| 2 | `affiliate_applications` | `id` (serial) | — |
| 3 | `help_requests` | `id` (serial) | — |
| 4 | `startup_grants` | `id` (serial) | — |
| 5 | `furniture_assistance` | `id` (serial) | — |
| 6 | `investor_submissions` | `id` (serial) | — |
| 7 | `private_doctor_requests` | `id` (serial) | — |
| 8 | `website_applications` | `id` (serial) | — |
| 9 | `general_contact` | `id` (serial) | — |
| 10 | `vlt_affiliates` | `id` (serial) | `email`, `referral_code` |
| 11 | `opportunities` | `id` (serial) | — |
| 12 | `sales` | `id` (serial) | — |
| 13 | `commissions` | `id` (serial) | — |
| 14 | `veteran_intake` | `id` (serial) | — |
| 15 | `business_intake` | `id` (serial) | — |
| 16 | `vlt_intake` | `id` (serial) | — |
| 17 | `contract_templates` | `id` (serial) | — |
| 18 | `signed_agreements` | `id` (serial) | — |
| 19 | `commission_config` | `id` (serial) | — |
| 20 | `affiliate_nda` | `id` (serial) | — |
| 21 | `legal_signatures` | `id` (serial) | — |
| 22 | `legal_override_audit` | `id` (serial) | — |
| 23 | `signature_metrics` | `id` (serial) | — |
| 24 | `compliance_runs` | `id` (serial) | — |
| 25 | `business_leads` | `id` (serial) | — |
| 26 | `ip_referral_tracking` | `id` (serial) | — |
| 27 | `affiliate_w9` | `id` (serial) | — |
| 28 | `finops_referrals` | `id` (serial) | — |
| 29 | `disability_referrals` | `id` (serial) | — |
| 30 | `job_placement_intakes` | `id` (serial) | — |
| 31 | `vet_professional_intakes` | `id` (serial) | — |
| 32 | `healthcare_intakes` | `id` (serial) | — |
| 33 | `schedule_a_signatures` | `id` (serial) | — |
| 34 | `insurance_intakes` | `id` (serial) | — |
| 35 | `medical_sales_intakes` | `id` (serial) | — |
| 36 | `business_dev_intakes` | `id` (serial) | — |
| 37 | `csu_contract_templates` | `id` (serial) | — |
| 38 | `csu_contract_template_fields` | `id` (serial) | — |
| 39 | `csu_contract_sends` | `id` (serial) | `sign_token` |
| 40 | `csu_signed_agreements` | `id` (serial) | — |
| 41 | `csu_envelopes` | `id` (serial) | — |
| 42 | `csu_envelope_recipients` | `id` (serial) | `sign_token` |
| 43 | `csu_audit_trail` | `id` (serial) | — |
| 44 | `portal_activity` | `id` (serial) | — |
| 45 | `affiliate_activities` | `id` (serial) | `hash` |
| 46 | `notification_settings` | `id` (serial) | `user_id` (unique) |
| 47 | `notification_audit` | `id` (serial) | — |
| 48 | `notification_queue` | `id` (serial) | — |
| 49 | `password_reset_tokens` | `id` (serial) | — |
| 50 | `partner_sharing_log` | `id` (serial) | — |
| 51 | `consent_records` | `id` (serial) | — |
| 52 | `affiliated_partners` | `id` (serial) | — |
| 53 | `ranger_tab_applications` | `id` (serial) | — |
| 54 | `conversations` | `id` (serial) | — |
| 55 | `messages` | `id` (serial) | — |
| 56 | `hipaa_audit_log` | `id` (serial) | — |
| 57 | `hipaa_training_records` | `id` (serial) | — |
| 58 | `business_associate_agreements` | `id` (serial) | — |
| 59 | `user_mfa_config` | `id` (serial) | `user_id` (unique) |
| 60 | `auth_rate_limits` | `id` (serial) | — |
| 61 | `ai_generations` | `id` (serial) | — |
| 62 | `ai_templates` | `id` (serial) | — |
| 63 | `operator_ai_memory` | `id` (serial) | — |
| 64 | `ai_users` | `id` (serial) | `email`, `anon_device_id` |
| 65 | `ai_sessions` | `id` (serial) | `session_token` |
| 66 | `ai_messages` | `id` (serial) | — |
| 67 | `ai_files` | `id` (serial) | — |
| 68 | `ai_memory` | `id` (serial) | — |
| 69 | `ai_jobs` | `id` (serial) | — |
| 70 | `media_pipelines` | `id` (serial) | — |
| 71 | `pipeline_steps` | `id` (serial) | — |
| 72 | `pipeline_artifacts` | `id` (serial) | — |
| 73 | `claim_sessions` | `id` (serial) | — |
| 74 | `claim_answers` | `id` (serial) | — |
| 75 | `claim_tasks` | `id` (serial) | — |
| 76 | `claim_files` | `id` (serial) | — |
| 77 | `evidence_requirements` | `id` (serial) | — |
| 78 | `claim_cases` | `id` (serial) | — |
| 79 | `case_shares` | `id` (serial) | — |
| 80 | `case_notes` | `id` (serial) | — |
| 81 | `case_deadlines` | `id` (serial) | — |
| 82 | `vendor_magic_links` | `id` (serial) | `token` |
| 83 | `vendor_sessions` | `id` (serial) | `session_token` |
| 84 | `repair_logs` | `id` (serial) | — |
| 85 | `critical_incidents` | `id` (serial) | `incident_id` |
| 86 | `incident_audit_log` | `id` (serial) | — |
| 87 | `sailor_conversations` | `id` (serial) | — |
| 88 | `sailor_messages` | `id` (serial) | — |
| 89 | `sailor_faq` | `id` (serial) | — |
| 90 | `events` | `id` (serial) | — |
| 91 | `idempotency_keys` | `key` (text) | — (PK is the key itself) |
| 92 | `sessions` | `sid` (varchar) | — (PK is the sid itself) |
| 93 | `veteran_auth_users` | `id` (varchar, UUID) | `email` |

**Total: 93 tables**

---

## All Declared Foreign Keys

| Source Table | Source Column | Target Table | Target Column |
|---|---|---|---|
| `affiliate_applications` | `assigned_to` | `users` | `id` |
| `help_requests` | `assigned_to` | `users` | `id` |
| `help_requests` | `referred_by` | `users` | `id` |
| `startup_grants` | `assigned_to` | `users` | `id` |
| `furniture_assistance` | `assigned_to` | `users` | `id` |
| `investor_submissions` | `assigned_to` | `users` | `id` |
| `private_doctor_requests` | `assigned_to` | `users` | `id` |
| `website_applications` | `assigned_to` | `users` | `id` |
| `general_contact` | `assigned_to` | `users` | `id` |
| `sales` | `opportunity_id` | `opportunities` | `id` |
| `sales` | `affiliate_id` | `vlt_affiliates` | `id` |
| `commissions` | `sale_id` | `sales` | `id` |
| `commissions` | `affiliate_id` | `vlt_affiliates` | `id` |
| `signed_agreements` | `contract_template_id` | `contract_templates` | `id` |
| `signed_agreements` | `user_id` | `users` | `id` |
| `affiliate_nda` | `user_id` | `users` | `id` |
| `legal_signatures` | `user_id` | `users` | `id` |
| `legal_override_audit` | `admin_id` | `users` | `id` |
| `legal_override_audit` | `user_id` | `users` | `id` |
| `business_leads` | `assigned_to` | `users` | `id` |
| `business_leads` | `referred_by` | `users` | `id` |
| `ip_referral_tracking` | `affiliate_id` | `users` | `id` |
| `affiliate_w9` | `user_id` | `users` | `id` |
| `finops_referrals` | `affiliate_id` | `users` | `id` |
| `disability_referrals` | `affiliate_id` | `users` | `id` |
| `disability_referrals` | `assigned_to` | `users` | `id` |
| `job_placement_intakes` | `affiliate_id` | `users` | `id` |
| `job_placement_intakes` | `assigned_to` | `users` | `id` |
| `vet_professional_intakes` | `affiliate_id` | `users` | `id` |
| `vet_professional_intakes` | `assigned_to` | `users` | `id` |
| `schedule_a_signatures` | `user_id` | `users` | `id` |
| `insurance_intakes` | `referred_by` | `users` | `id` |
| `medical_sales_intakes` | `referred_by` | `users` | `id` |
| `medical_sales_intakes` | `assigned_to` | `users` | `id` |
| `business_dev_intakes` | `referred_by` | `users` | `id` |
| `business_dev_intakes` | `assigned_to` | `users` | `id` |
| `csu_contract_template_fields` | `template_id` | `csu_contract_templates` | `id` |
| `csu_contract_sends` | `template_id` | `csu_contract_templates` | `id` |
| `csu_contract_sends` | `sent_by` | `users` | `id` |
| `csu_signed_agreements` | `contract_send_id` | `csu_contract_sends` | `id` |
| `csu_signed_agreements` | `template_id` | `csu_contract_templates` | `id` |
| `csu_envelopes` | `template_id` | `csu_contract_templates` | `id` |
| `csu_envelopes` | `sent_by` | `users` | `id` |
| `csu_envelope_recipients` | `envelope_id` | `csu_envelopes` | `id` |
| `csu_audit_trail` | `envelope_id` | `csu_envelopes` | `id` |
| `csu_audit_trail` | `recipient_id` | `csu_envelope_recipients` | `id` |
| `csu_audit_trail` | `contract_send_id` | `csu_contract_sends` | `id` |
| `csu_audit_trail` | `actor_user_id` | `users` | `id` |
| `portal_activity` | `user_id` | `users` | `id` |
| `affiliate_activities` | `actor_user_id` | `users` | `id` |
| `notification_settings` | `user_id` | `users` | `id` |
| `notification_queue` | `user_id` | `users` | `id` |
| `password_reset_tokens` | `user_id` | `users` | `id` |
| `hipaa_audit_log` | `user_id` | `users` | `id` |
| `hipaa_training_records` | `user_id` | `users` | `id` |
| `business_associate_agreements` | `last_reviewed_by` | `users` | `id` |
| `user_mfa_config` | `user_id` | `users` | `id` |
| `ai_generations` | `user_id` | `users` | `id` |
| `operator_ai_memory` | `user_id` | `users` | `id` |
| `ai_sessions` | `user_id` | `ai_users` | `id` |
| `ai_messages` | `session_id` | `ai_sessions` | `id` |
| `ai_files` | `owner_user_id` | `ai_users` | `id` |
| `ai_files` | `session_id` | `ai_sessions` | `id` |
| `ai_memory` | `user_id` | `ai_users` | `id` |
| `ai_memory` | `source_message_id` | `ai_messages` | `id` |
| `ai_jobs` | `user_id` | `ai_users` | `id` |
| `ai_jobs` | `session_id` | `ai_sessions` | `id` |
| `media_pipelines` | `user_id` | `ai_users` | `id` |
| `media_pipelines` | `session_id` | `ai_sessions` | `id` |
| `pipeline_steps` | `pipeline_id` | `media_pipelines` | `id` |
| `pipeline_artifacts` | `pipeline_id` | `media_pipelines` | `id` |
| `pipeline_artifacts` | `step_id` | `pipeline_steps` | `id` |
| `claim_sessions` | `veteran_user_id` | `veteran_auth_users` | `id` |
| `claim_answers` | `session_id` | `claim_sessions` | `id` |
| `claim_tasks` | `session_id` | `claim_sessions` | `id` |
| `claim_tasks` | `case_id` | `claim_cases` | `id` |
| `claim_files` | `session_id` | `claim_sessions` | `id` |
| `claim_files` | `case_id` | `claim_cases` | `id` |
| `claim_files` | `veteran_user_id` | `veteran_auth_users` | `id` |
| `case_shares` | `case_id` | `claim_cases` | `id` |
| `case_notes` | `case_id` | `claim_cases` | `id` |
| `case_deadlines` | `case_id` | `claim_cases` | `id` |
| `sailor_messages` | `conversation_id` | `sailor_conversations` | `id` |
| `messages` | `conversation_id` | `conversations` | `id` |

---

## Nullable vs Non-Nullable Analysis (Anomalies Only)

Fields where nullability conflicts with expected semantics:

| Table | Column | Nullable? | Observation |
|---|---|---|---|
| `vlt_affiliates` | `level1_id` through `level7_id` | Yes (nullable) | Hierarchy levels are all nullable with no FK constraints |
| `vlt_affiliates` | `recruiter_id` | Yes (nullable) | No FK constraint declared |
| `sales` | `referred_by_l1` through `referred_by_l7` | Yes (nullable) | No FK constraints on any referral level |
| `sales` | `recruiter_id` | Yes (nullable) | No FK constraint |
| `veteran_intake` | `referred_by_l1` through `referred_by_l7` | Yes (nullable) | No FK constraints |
| `veteran_intake` | `assigned_to` | Yes (nullable) | No FK constraint (unlike other intake tables) |
| `business_intake` | `referred_by_l1` through `referred_by_l7` | Yes (nullable) | No FK constraints |
| `business_intake` | `assigned_to` | Yes (nullable) | No FK constraint |
| `vlt_intake` | `referred_by_l1` through `referred_by_l6` | Yes (nullable) | No FK constraints |
| `vlt_intake` | `assigned_to` | Yes (nullable) | No FK constraint |
| `signed_agreements` | `affiliate_id` | NOT NULL | No FK constraint (comment says "can be user or VLT affiliate") |
| `signature_metrics` | `user_id` | NOT NULL | Declared as `text`, not integer. No FK constraint |
| `case_notes` | `author_email` | NOT NULL | Stores user ID integer as text type in some routes (line 9602 passes userId to authorEmail) |
| `claim_cases` | `veteran_user_id` | NOT NULL | varchar type, no FK constraint (unlike claim_sessions which FK's to veteran_auth_users) |
| `claim_tasks` | `veteran_user_id` | Yes (nullable) | varchar type, no FK constraint |
| `events` | `user_id` | NOT NULL | No FK constraint to any user table |
| `idempotency_keys` | `user_id` | NOT NULL | No FK constraint |
| `incident_audit_log` | `admin_id` | NOT NULL | No FK constraint |
| `incident_audit_log` | `incident_id` | NOT NULL | text type, no FK to critical_incidents |
| `hipaa_audit_log` | `user_id` | Yes (nullable) | FK exists but field allows null for unauthenticated access |
| `ai_generations` | `template_id` | Yes (nullable) | No FK constraint to ai_templates |
| `healthcare_intakes` | `assigned_to` | — | Column does not exist (missing, unlike all other intake tables) |

---

## Missing Foreign Keys

### `vlt_affiliates` — Self-Referential Hierarchy (7 missing FKs)
- `level1_id` → No FK (should reference `vlt_affiliates.id`)
- `level2_id` → No FK (should reference `vlt_affiliates.id`)
- `level3_id` → No FK (should reference `vlt_affiliates.id`)
- `level4_id` → No FK (should reference `vlt_affiliates.id`)
- `level5_id` → No FK (should reference `vlt_affiliates.id`)
- `level6_id` → No FK (should reference `vlt_affiliates.id`)
- `level7_id` → No FK (should reference `vlt_affiliates.id`)
- `recruiter_id` → No FK (should reference `vlt_affiliates.id`)

### `sales` — Referral Chain (8 missing FKs)
- `referred_by_l1` through `referred_by_l7` → No FKs (should reference `vlt_affiliates.id`)
- `recruiter_id` → No FK (should reference `vlt_affiliates.id`)

### `veteran_intake` — Referral Chain + Admin (8 missing FKs)
- `referred_by_l1` through `referred_by_l7` → No FKs
- `assigned_to` → No FK (other intake tables FK to `users.id`)

### `business_intake` — Referral Chain + Admin (8 missing FKs)
- `referred_by_l1` through `referred_by_l7` → No FKs
- `assigned_to` → No FK

### `vlt_intake` — Referral Chain + Admin (7 missing FKs)
- `referred_by_l1` through `referred_by_l6` → No FKs
- `assigned_to` → No FK

### Cross-Domain Missing FKs
- `signed_agreements.affiliate_id` → No FK (comment: "can be user or VLT affiliate" — polymorphic ID)
- `events.user_id` → No FK to any user table
- `idempotency_keys.user_id` → No FK
- `incident_audit_log.admin_id` → No FK to `users.id`
- `incident_audit_log.incident_id` → No FK to `critical_incidents.incident_id`
- `ai_generations.template_id` → No FK to `ai_templates.id`
- `claim_cases.veteran_user_id` → No FK to `veteran_auth_users.id`
- `claim_tasks.veteran_user_id` → No FK to `veteran_auth_users.id`
- `signature_metrics.user_id` → Text type, no FK (should be integer FK to users)

**Total missing FK constraints: 52+**

---

## Tables Acting as Implicit Joins

### `signed_agreements` — Polymorphic Bridge
- `affiliate_id` (integer, NOT NULL, no FK) acts as a join to EITHER `users.id` OR `vlt_affiliates.id`
- `user_id` (integer, nullable, FK to `users.id`) exists as a separate optional link
- These two columns create an implicit polymorphic join — the same table serves two identity domains

### `partner_sharing_log` — Polymorphic Reference
- `submission_type` (text) + `submission_id` (integer) form a polymorphic pair
- `submission_id` could reference `veteran_intake.id`, `help_requests.id`, `general_contact.id`, or others
- No FK constraint — referential integrity depends entirely on application code

### `consent_records` — Polymorphic Reference
- `submission_type` (text) + `submission_id` (integer) — same polymorphic pattern as partner_sharing_log
- No FK constraint

### `events` — Polymorphic Reference
- `entity_id` (integer) + `entity_type` (text) — polymorphic reference to any table
- `user_id` (integer, NOT NULL) — no FK constraint despite being mandatory

### `signature_metrics` — Disconnected
- `user_id` is `text` type, not integer — cannot FK to any user table even if declared
- `document_type` (text) — implicit join to legal_signatures or affiliate_nda by convention

### `case_notes` — Type Mismatch Join
- `author_email` is text type but route code (line 9602) passes `userId` (integer) to it
- Acts as implicit join to either `users` or `veteran_auth_users` by convention

### `csu_audit_trail` — Multi-Table Join Hub
- References `csu_envelopes`, `csu_envelope_recipients`, AND `csu_contract_sends`
- All three FKs are nullable — any combination can be null
- Acts as a union audit trail across two signing systems (envelope + legacy single-send)

---

## Fields Storing Denormalized or Mixed Concerns

### Booleans Stored as Text
| Table | Column | Value Pattern |
|---|---|---|
| `vlt_affiliates` | `is_comp_active` | `"true"` / `"false"` as text |
| `sales` | `l2_active`, `l3_active`, `l4_active`, `l5_active` | `"true"` / `"false"` as text |
| `opportunities` | `is_active` | `"true"` / `"false"` as text |
| `contract_templates` | `is_active` | `"true"` / `"false"` as text |
| `signed_agreements` | `agreed_to_terms` | `"true"` / `"false"` as text |
| `csu_signed_agreements` | `agreed_to_terms` | `"true"` / `"false"` as text |
| `commission_config` | `is_active` | `"true"` / `"false"` as text |
| `affiliate_nda` | `agreed_to_terms` | `"true"` / `"false"` as text |
| `veteran_intake` | `is_veteran` (implied) | text type for boolean semantics |
| `business_intake` | `is_veteran_owned` | text type for boolean semantics |

### JSON Stored in Text Columns (not JSONB)
| Table | Column | Content |
|---|---|---|
| `user_mfa_config` | `backup_codes` | JSON array of hashed backup codes |
| `notification_settings` | `events` | JSON object `{ EVENT_NAME: true/false }` |
| `notification_settings` | `emails_enc` | AES-encrypted JSON array |
| `notification_audit` | `recipients` | JSON array |
| `csu_contract_sends` | `field_values` | JSON string of field values |
| `csu_envelope_recipients` | `field_values` | JSON string |
| `csu_audit_trail` | `metadata` | JSON string |
| `portal_activity` | `metadata` | JSON string |
| `affiliate_activities` | `metadata` | JSON string |
| `affiliate_activities` | `notified_emails` | JSON array |
| `ai_generations` | `metadata` | JSON string |
| `ai_generations` | `beat_map` | JSON array |
| `ai_jobs` | `input` | JSON input parameters |
| `ai_jobs` | `output` | JSON output results |
| `ai_files` | `extracted_metadata` | JSON metadata |
| `ai_messages` | `attachments` | JSON array of file IDs |
| `media_pipelines` | `execution_plan` | JSON LLM-generated plan |
| `pipeline_steps` | `input_params` | JSON input |
| `pipeline_steps` | `output_data` | JSON output |
| `pipeline_steps` | `depends_on` | JSON array of step IDs |
| `pipeline_steps` | `artifact_urls` | JSON array |
| `pipeline_artifacts` | `metadata` | JSON |
| `hipaa_audit_log` | `metadata` | JSON string |
| `consent_records` | `partners_shared_with` | JSON array |
| `job_placement_intakes` | `industries_selected` | JSON array stored as text |
| `partner_sharing_log` | — | Polymorphic references stored as text+integer |

### Denormalized Referral Chains (Flattened Hierarchy)
The following tables duplicate the 6-7 level upline chain as flat columns instead of using a relational hierarchy:
- `vlt_affiliates`: `level1_id` through `level7_id` (7 columns)
- `sales`: `referred_by_l1` through `referred_by_l7` (7 columns)
- `veteran_intake`: `referred_by_l1` through `referred_by_l7` (7 columns)
- `business_intake`: `referred_by_l1` through `referred_by_l7` (7 columns)
- `vlt_intake`: `referred_by_l1` through `referred_by_l6` (6 columns)

**Total denormalized referral columns: 34**

### Monetary Values Mixed with Percentage Values
- `commission_config`: `producer_base_pct`, `upline_pct_each`, `house_pct`, `recruiter_bounty_pct` — all stored as integers (x100 multiplied)
- `opportunities`: `commission_l1` through `commission_l7` — store "percentage x100 or cents" in the same column type, meaning determined only by `commission_type` text field
- `sales`: `sale_amount`, `recruiter_bounty`, `compressed_to_l6` — cents
- `commissions`: `amount` — cents
- `vlt_affiliates`: `total_commissions`, `total_recruiter_bounties` — cents

### Name/Email Denormalization
- `signed_agreements`: stores `affiliate_name` and `affiliate_email` alongside `affiliate_id` / `user_id`
- `csu_signed_agreements`: stores `signer_name`, `signer_email`, `signer_phone` (denormalized from recipient)
- `schedule_a_signatures`: stores `affiliate_name` and `affiliate_email` alongside `user_id`
- `hipaa_audit_log`: stores `user_name` and `user_role` alongside `user_id` FK

---

## Tables Used by Multiple Domains Without Ownership

### `users` — Platform-Wide Identity (Referenced by 30+ tables)
Used by: Admin system, Affiliate system, Legal system, CSU contracts, Notification system, HIPAA compliance, AI generations, Portal tracking, Business leads, All intake tables, MFA, Password resets, W9 tax forms

### `veteran_auth_users` — Claims Domain Identity
Used by: Claims sessions, Claims files, Claims cases (indirectly via varchar veteran_user_id)
Separate identity system from `users` table — no FK relationship between the two

### `ai_users` — AI Domain Identity
Used by: AI sessions, AI messages, AI files, AI memory, AI jobs, Media pipelines
Separate identity system from both `users` and `veteran_auth_users` — no FK relationship

### `csu_contract_templates` — CSU + Envelope Domains
Used by: `csu_contract_template_fields`, `csu_contract_sends`, `csu_signed_agreements`, `csu_envelopes`
Serves both the legacy single-send signing system AND the newer envelope multi-recipient system

### `events` — Platform-Wide Event Bus
References entities across all domains via polymorphic `entity_type` + `entity_id`
`user_id` is NOT NULL but has no FK — could reference users from any identity system

---

## Two Identity Systems Without Cross-Reference

| Identity Table | PK Type | Used By |
|---|---|---|
| `users` | `serial` (integer) | 30+ tables across admin, affiliate, legal, CSU, HIPAA, AI gen, notifications |
| `vlt_affiliates` | `serial` (integer) | `sales`, `commissions` (separate affiliate identity with own auth) |
| `veteran_auth_users` | `varchar` (UUID) | `claim_sessions`, `claim_files`, `claim_cases` (via varchar, sometimes without FK) |
| `ai_users` | `serial` (integer) | `ai_sessions`, `ai_files`, `ai_memory`, `ai_jobs`, `media_pipelines` |

- No FK or mapping table connects `users` ↔ `vlt_affiliates`
- No FK or mapping table connects `users` ↔ `veteran_auth_users`
- No FK or mapping table connects `users` ↔ `ai_users`
- `claim_cases.veteran_user_id` is varchar with no FK, while `claim_sessions.veteran_user_id` FK's to `veteran_auth_users`
- `claim_tasks.veteran_user_id` is varchar with no FK

---

## Missing Compound Unique Constraints

| Table | Columns | Observation |
|---|---|---|
| `legal_signatures` | `(user_id, document_type, document_version)` | Comment says "UNIQUE constraint enforced at DB level" but no `.unique()` in Drizzle schema |
| `auth_rate_limits` | `(identifier, identifier_type, attempt_type)` | No unique constraint — could have duplicate rows per identity+attempt combo |
| `affiliate_w9` | `user_id` | No unique constraint — user could have multiple W9 records |
| `schedule_a_signatures` | `user_id` | No unique constraint — application code checks for duplicates but DB allows them |
| `affiliate_nda` | `user_id` | No unique constraint — same user could have multiple NDA records |
| `ip_referral_tracking` | `ip_address` | No unique constraint — same IP can have multiple active tracking records |

---

## Summary Statistics

| Metric | Count |
|---|---|
| **Total tables** | 93 |
| **Tables with declared FKs** | 45 |
| **Tables with no FKs at all** | 48 |
| **Missing FK constraints** | 52+ |
| **Polymorphic join patterns (no FK possible)** | 4 |
| **Booleans stored as text** | 10+ columns |
| **JSON stored in text (not JSONB)** | 25+ columns |
| **Denormalized referral chain columns** | 34 |
| **Separate identity systems with no cross-reference** | 4 |
| **Missing compound unique constraints** | 6 |
| **Tables with `assigned_to` lacking FK** | 3 |

---

## No Fixes Proposed
Report complete. All findings are structural observations of current schema definition.
