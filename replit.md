# NavigatorUSA

## Overview
NavigatorUSA is a veteran family support platform designed to provide financial, spiritual, medical, and holistic assistance. It offers free VA rating software, a gig work marketplace, manual claim assistance, business launch support (including free websites and startup grants), investor connections, furniture assistance, and private doctor referrals. The platform includes a complete lead management system and role-based portals. The vision is to be the primary resource for veteran families, fostering economic independence and addressing diverse needs.

## User Preferences
- INTENSE patriotic design aesthetic with red/white/blue color scheme
- Brand Colors:
  - Primary Red: #E21C3D (Vibrant American flag red)
  - Navy Blue: #1A365D (Deep patriotic navy)
  - Bright Blue: #2563EB (Accent blue)
  - White: #FFFFFF
  - Gold: #EAB308 (Accent gold)
- Typography: Bebas Neue for headings, Montserrat for body text
- Network size displayed as 150,000+ veteran families
- When user says "update live code", run `npm run audit:all` to regenerate all three audit reports

## System Architecture

### Frontend
The frontend is built with React and TypeScript, using Wouter for routing and TanStack Query for data fetching. Styling is managed with Tailwind CSS, incorporating custom brand colors and Shadcn UI components. The UI/UX emphasizes a patriotic red, white, and blue theme.

### Backend
The backend utilizes Express.js, connecting to a PostgreSQL database via Drizzle ORM. It implements session-based authentication with bcrypt for password hashing and robust role-based access control (admin/affiliate). Zod is used for API endpoint validation.

### Database Schema
The database supports user management, affiliate applications, support requests, business services, sales and commissions, veteran intakes, comprehensive contract management, and a platform-wide events table.

### Action Layer (`server/actions/`)
Business logic is extracted from routes into action functions. Each action:
- Validates inputs (required vs optional)
- Owns its own `db.transaction()` — all writes + events are atomic
- Returns `{ ok: true, ndaId, status, degraded }` or `{ ok: false, code, message }` — no Express coupling
- Events emitted INSIDE the transaction (not fire-and-forget) — if the NDA write fails, no orphaned events

Current actions:
- `submit-affiliate-nda.ts` — NDA signing with transactional event emission and degraded feature handling
- `emit-event.ts` — Generic fire-and-forget event emitter (for non-critical, outside-transaction use)

### Events Table
Platform-wide append-only event log (`events` table):
- `event_type`: string identifier (e.g., `NDA_SUBMITTED`, `NDA_SUBMITTED_WITH_DEGRADATION`)
- `user_id`: integer FK to users table
- `entity_id` / `entity_type`: optional polymorphic reference (e.g., ndaId + "nda")
- `payload`: JSONB — flexible structured data per event type
- `degraded`: boolean flag for events involving degraded features
- Used for audit trails, ops visibility, compliance logging

### Feature Specifications
- **Comprehensive Admin Operations Hub**: A central portal for managing all platform data, KPIs, applications, leads, and sales.
- **Affiliate Management**: A multi-level affiliate system with a commission structure and automated activity tracking.
- **Contract Management (CSU Platform / Ranger Tab)**: An independent document signature platform with admin and public portals for managing, sending, and signing contracts. Features include PDF generation with embedded signatures, tokenized signing links, and support for VIP-branded portals.
- **Lead Management System**: Comprehensive tracking and management of various lead types.
- **Role-Based Portals**: Dedicated portals for admins, affiliates, and sub-masters with tailored functionalities.
- **VSO Portal Replication Pattern**: A pattern for creating branded, individualized contract management portals for Veterans Service Officers.
- **Planning Solutions**: Comprehensive insurance and financial planning services.
- **Claims Navigator**: A personalized task management system for VA Disability or SSDI claims, including a 4-step wizard, evidence strength analysis, a strength suggestions engine, vendor scorecards, and VA lane confidence.
- **Vendor Portal**: A secure, scoped portal for vendors with passwordless magic-link authentication and role-based permissions.
- **Email Signature Generator**: Interactive generator with 4 animated templates.
- **Notification Console**: Admin/Affiliate console for managing notification preferences, system health, and audit logs.
- **Self-Healing Platform**: A system composed of five interlocked components:
    - **Self-Repair Bot**: Classifies issues, applies versioned fix rulesets for auto-fixable problems, and escalates others. Includes a public chat widget and an admin repair queue.
    - **Tier-0 Critical Path Protection**: A specialized diagnostic and emergency response system for authentication and contract signing failures. It distinguishes between "plumbing" (auto-fixable) and "authority" (forbidden to auto-fix) issues. Features an "Emergency Mode" for critical failures and generates legal-grade incident reports.
    - **Platform Configuration**: Provides toggles for auto-fixes and admin approval requirements.
    - **Compliance Logging**: Implements SOC-2 / HIPAA hardening hooks for an immutable audit trail.
- **Sailor Man AI Assistant**: An AI-powered chat assistant with:
    - OpenAI integration (gpt-5-mini) via Replit AI Integrations
    - Voice input with speech-to-text transcription (gpt-4o-mini-transcribe)
    - Text chat with message history persistence
    - Contextual quick tips based on current page
    - FAQ knowledge base with semantic search
    - Popeye-themed character with nautical personality
    - Session-based conversation tracking
- **Guided Tour System**: Interactive website walkthrough with step-by-step guidance.
- **Form Assistance**: Contextual help for form fields with examples and validation tips.
- **Status Notifications**: Toast notification system with success/warning/info/error types.

### Security Features
- **AES-256-GCM Encryption**: For sensitive data at rest.
- **Immutable Audit Trail**: Hash-chained notification audit logs for verification.
- **Global Legal Signature System**: A platform-wide, fail-closed legal document signing system with `requireLegalClearance()` middleware, unified signature mirroring, atomic and idempotent signing, version and hash locked documents, and auto-healing on login. Supports admin override with full audit trails and external e-sign integrations.

## Hard Guardrails (do not violate)
- Never return null from a page component for auth or permissions
- No auth or data hooks in App.tsx / root shell
- 401 responses must resolve to state, not throw (see queryClient.ts)
- Auth gating must use `<Redirect>` or explicit UI — never silent `return null`
- Blank screens are considered bugs
- If a request conflicts with these rules, stop and ask
- ESLint enforces `no-restricted-syntax` on `client/src/pages/**/*.tsx` to catch `return null` at page level

## The NDA Pattern (canonical decomposition pattern)
Use this pattern for any page that mixes auth gating, data fetching, browser APIs, and form submission.

### Structure (4 files per page):
1. **page.tsx** — Thin shell. Auth gating ONLY (`<Redirect>` for unauthorized). Renders the Shell.
2. **page-context.tsx** — Lightweight React Context for shared form state. No async data. Panels write independently; submit reads a snapshot via `getSnapshot()`.
3. **page-panels.tsx** — Independent panels, each wrapped in `<ErrorBoundary><Suspense><Panel /></Suspense></ErrorBoundary>`. Each panel owns its own queries/hooks. No cross-panel dependencies.
4. **page-components.tsx** — Pure presentational UI components. No data fetching, no hooks beyond basic UI state.

### Rules:
- Auth gating: page shell only. Gate on `authLoading` — never on data loading.
- No page-level `isLoading` that blocks everything.
- No serialized `if (!a || !b || !c) return <Spinner />`.
- Every panel owns its own fate. If camera fails, only camera panel errors.
- ErrorBoundary wraps OUTSIDE Suspense: `<ErrorBoundary><Suspense><Component /></Suspense></ErrorBoundary>`
- For forms: Context holds artifacts (photos, signatures). Submit handler reads snapshot.
- Session heartbeat lives in the shell, not gated by any data query.

### Applied to:
- `affiliate-nda.tsx` (Feb 2026) — 1094-line monolith decomposed into 4 files
- `admin-dashboard.tsx` — 4 panels (Applications, Requests, Investors, Affiliates) with PanelError/PanelSkeleton
- Next candidate: main dashboard or admin console (one page at a time)

## The Degraded Feature Pattern ("Proceed Anyway + File Report")
Platform-wide standard for how optional features handle failure gracefully.

### Rule: No optional feature may block submission without an explicit user choice and a logged reason.

### Three UI States per optional feature:
1. **Available** → Normal UI (camera works, upload works)
2. **Unavailable / Failed** → `DegradedFeatureNotice` component shows with two explicit buttons: "Proceed Anyway" and "Proceed & File Report"
3. **Acknowledged** → Green confirmation ("Step skipped. You may continue.") with optional retry

### Component: `client/src/components/degraded-feature-notice.tsx`
Reusable drop-in component. Props: `featureName`, `description`, `onProceed`, `onReport`, optional `retryAction` + `retryLabel`.

### Context: `CapabilityStatus` type = `"available" | "unavailable" | "degraded" | "acknowledged"`
- `degradedReports` array in context: `{ feature, reason, timestamp }[]`
- `addDegradedReport()` method for "Proceed & File Report" path
- `getSnapshot()` includes `degradedReports` for submission

### Submit Enforcement:
- If any capability is `"unavailable"` or `"degraded"`, submit is blocked with a toast asking user to acknowledge
- Only `"available"` or `"acknowledged"` capabilities allow submission
- `degradedReports` array attached to payload when present

### Backend:
- `degradedFeatures` array validated server-side (type checks + length truncation)
- Structured `console.warn` with `DEGRADED_SUBMISSION` tag for ops visibility
- Future: persist to audit storage or ops queue

### Applied to:
- Camera capture (affiliate-nda, Feb 2026)
- ID document upload (affiliate-nda, Feb 2026)
- Next: any optional feature — previews, integrations, AI helpers

## Phase 0 Changes (Feb 2026)
- Removed dead Replit Auth OIDC (server + client gate components)
- Changed queryClient default from `on401: "throw"` to `on401: "returnNull"`
- Replaced blank-screen `return null` with `<Redirect>` in notification-console.tsx and affiliate-nda.tsx
- Simplified PlatformDisclaimerModal JSX for UX clarity (logic unchanged)
- **Data-Fetching Optimization**: Added `staleTime` to ~80 useQuery hooks across 9 heavy pages to reduce unnecessary API refetches. Auth queries use 60s staleTime; admin data uses 5min; operational data uses 30s. Claims Navigator additionally gates tab-specific queries (analysis, documents, timeline, deadlines, sharing) behind `activeTab` state to defer loading until needed.
- **NDA Page Decomposition**: Decomposed affiliate-nda.tsx (1094 lines) into 4 files using The NDA Pattern. Auth gating in shell, 5 independent Suspense/ErrorBoundary panels (NdaStatus, LegalText, FormFields, Signature, Upload), shared NdaFormContext for atomic submit.

## External Dependencies
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: For database interaction.
- **Resend API**: For transactional emails.
- **pdfkit**: For real-time PDF generation.
- **Tailwind CSS**: For styling.
- **Shadcn UI**: For UI components.