# NavigatorUSA

### Overview
NavigatorUSA is a veteran family support platform providing financial, spiritual, medical, and holistic assistance. Key offerings include free VA rating software, a gig work marketplace, manual claim assistance, business launch support (websites, grants), investor connections, furniture aid, and private doctor referrals. The platform features a complete lead management system and role-based portals. Its vision is to become the leading resource for veteran families, fostering economic independence and addressing diverse needs.

### User Preferences
- INTENSE patriotic design aesthetic with red/white/blue color scheme
- Brand Colors:
  - Primary Red: #E21C3D (Vibrant American flag red)
  - Navy Blue: #1A365D (Deep patriotic navy)
  - Bright Blue: #2563EB (Accent blue)
  - White: #FFFFFF
  - Gold: #EAB308 (Accent gold)
- Typography: Bebas Neue for headings, Montserrat for body text
- Network size displayed as 150,000+ veteran families
- When user says "update live code", run `npm run audit:all` to regenerate all four audit reports

### System Architecture

The NavigatorUSA platform is built with a React/TypeScript frontend and an Express.js backend, utilizing PostgreSQL with Drizzle ORM. The UI/UX features a strong patriotic theme using Tailwind CSS and Shadcn UI components.

**Frontend:**
- **Technology Stack:** React, TypeScript, Wouter for routing, TanStack Query for data fetching.
- **Styling:** Tailwind CSS, custom brand colors, Shadcn UI components.

**Backend:**
- **Technology Stack:** Express.js, PostgreSQL (via Drizzle ORM).
- **Authentication:** Session-based with bcrypt for password hashing, robust role-based access control (admin/affiliate).
- **Validation:** Zod for API endpoint validation.

**Database Schema:**
- Supports user management, affiliate applications, support requests, business services, sales and commissions, veteran intakes, comprehensive contract management, and a platform-wide events table.

**Core Architectural Patterns:**
- **Action Layer (`server/actions/`):** Business logic extracted into atomic, transactional functions with input validation and structured error/success responses. Events are emitted within transactions.
- **Platform Layer (`server/platform/`):** Standardized infrastructure utilities for error handling, route wrapping, request context, and email sending.
- **Frontend Foundation (`client/src/lib/`):** Canonical query keys for TanStack Query and safe API wrappers.
- **Events Table:** An append-only, platform-wide event log for audit trails, visibility, and compliance, storing structured event data with user and entity references.
- **NDA Pattern:** A canonical decomposition pattern for complex pages, structuring them into a thin shell (auth gating), context for shared state, independent panels (each with its own data fetching/error handling), and pure presentational components. This pattern ensures modularity and independent panel rendering.
- **Degraded Feature Pattern:** A standard for handling optional feature failures gracefully. Optional features must not block submission without explicit user acknowledgment, which triggers logging and reporting. This pattern defines UI states (Available, Unavailable/Failed, Acknowledged) and a reusable `DegradedFeatureNotice` component.
- **Identity Layer (`server/identity/`):** Provides a request-aware identity resolution mechanism and policy functions for role-based access without merging disparate identity systems. Phase 8 added an `identity_map` table (Drizzle-managed) with fire-and-forget shadow writes on auth events (login, affiliate login, VLT login, internal service). Session includes optional `identityId` field. No enforcement or read paths yet — purely instrumentation.

**Key Features:**
- **Comprehensive Admin Operations Hub:** Centralized management for platform data, KPIs, applications, leads, and sales.
- **Affiliate Management:** Multi-level system with commission structures and activity tracking.
- **Contract Management (CSU Platform / Ranger Tab):** Independent platform for contract signing, PDF generation, tokenized links, and VIP portals.
- **Lead Management System:** Tracking and management of various lead types.
- **Role-Based Portals:** Tailored portals for admins, affiliates, and sub-masters.
- **VSO Portal Replication Pattern:** Branded contract management portals for Veterans Service Officers.
- **Planning Solutions:** Insurance and financial planning services.
- **Claims Navigator:** Personalized task management for VA Disability/SSDI claims, including a 4-step wizard, evidence analysis, and vendor scorecards.
- **Vendor Portal:** Secure, scoped portal with passwordless magic-link authentication.
- **Email Signature Generator:** Interactive generator with animated templates.
- **Notification Console:** Management for notification preferences, system health, and audit logs.
- **Self-Healing Platform:** Five interlocked components including a Self-Repair Bot for issue classification and auto-fixing, Tier-0 Critical Path Protection for emergency response, Platform Configuration toggles, and Compliance Logging.
- **Sailor Man AI Assistant:** AI chat assistant with OpenAI integration, voice input, contextual quick tips, FAQ knowledge base, and session-based history.
- **Guided Tour System:** Interactive website walkthroughs.
- **Form Assistance:** Contextual help for form fields.
- **Status Notifications:** Toast notification system.

**Security Features:**
- AES-256-GCM Encryption for sensitive data at rest.
- Immutable Audit Trail with hash-chained notification logs.
- Global Legal Signature System: A fail-closed system for legal documents with middleware, unified signature mirroring, atomic/idempotent signing, version/hash locked documents, and auto-healing on login.

### External Dependencies
- **PostgreSQL:** Primary relational database.
- **Drizzle ORM:** Object-Relational Mapper for database interactions.
- **Resend API:** For transactional email services.
- **pdfkit:** For real-time PDF document generation.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Shadcn UI:** Reusable UI components.