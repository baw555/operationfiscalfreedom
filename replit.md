# NavigatorUSA

## Overview
NavigatorUSA is a comprehensive veteran family support platform designed to empower veteran families by offering financial, spiritual, medical, and holistic support. Key capabilities include free VA rating software, a gig work marketplace, manual claim assistance, business launch support with free website and startup funding grants, investor connections, furniture assistance, and private doctor referrals. The platform features a complete lead management system and role-based portals. The business vision is to be the primary resource for veteran families, addressing their diverse needs and fostering economic independence.

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

## System Architecture

### Frontend
The frontend is built with React and TypeScript, using Wouter for routing and TanStack Query for data fetching. Styling is managed with Tailwind CSS, incorporating custom brand colors and Shadcn UI components. The UI/UX emphasizes a patriotic red, white, and blue theme, ensuring clear visibility, smooth transitions, and interactive elements.

### Backend
The backend is an Express.js server connected to a PostgreSQL database via Drizzle ORM. It uses session-based authentication with bcrypt for password hashing and implements robust role-based access control (admin/affiliate). Zod is used for API endpoint validation.

### Database Schema
The database supports various functionalities including user management (`users`), affiliate partnerships (`affiliate_applications`, `vlt_affiliates`), support requests (`help_requests`, `private_doctor_requests`), business services (`website_applications`, `business_intakes`), sales and commissions (`opportunities`, `sales`, `commissions`), veteran intakes (`veteran_intakes`), and contract management (`csu_contract_templates`, `csu_contract_sends`, `csu_signed_agreements`).

### Feature Specifications
- **Comprehensive Admin Operations Hub (`/master-portal`)**: A central portal for managing all data, KPIs, alerts, applications, intakes, leads, sales, and documents.
- **Affiliate Management**: A multi-level affiliate system with a commission structure.
- **Contract Management (CSU Platform / Ranger Tab)**: An independent document signature platform with admin and public portals for managing, sending, and signing contracts. Features include PDF generation with embedded signatures, tokenized signing links, and email integration. This system also supports the "Ranger Tab" pattern for VIP-branded, standalone contract signing portals.
- **Lead Management System**: Comprehensive tracking and management of various lead types.
- **Role-Based Portals**: Dedicated portals for admins, affiliates, and sub-masters with tailored functionalities.
- **VSO Portal Replication Pattern**: A pattern for creating branded, individualized contract management portals for Veterans Service Officers, including seed data, custom routing, and unique branding.
- **Planning Solutions (`/planning-solutions`)**: Comprehensive insurance and financial planning services organized into six categories.
- **Claims Navigator (`/claims-navigator`)**: A personalized task management system for VA Disability or SSDI claims, allowing veterans to build and track their cases. Features include:
  - 4-step wizard flow with personalized task generation
  - Evidence strength heatmap and completeness analysis
  - **Stage 7**: Strength suggestions engine with priority-based improvement recommendations
  - **Stage 8**: Vendor scorecards tracking uploads, notes, response time, and performance ratings
  - **Stage 9**: VA lane confidence with transparent reasoning (Supplemental/HLR/Board)
  - **Stage 10**: VA.gov upload checklist with step-by-step submission guidance
  - Controlled sharing with vendors via role-based permissions
- **Vendor Portal (`/vendor-portal`)**: A secure, scoped portal for vendors to access shared veteran cases. Features passwordless magic-link authentication via email (15-minute expiry), 7-day sessions stored in localStorage, role-based permissions (view/comment/upload), and session-based API authorization.
- **Affiliate Activity Tracking System v2**: Automated tracking of affiliate events (SITE_VISIT, CONTRACT_VIEW, CONTRACT_SIGNED, INFO_REQUEST, AFFILIATE_CLICK, AFFILIATE_SIGNUP) with:
  - SHA256 hash-based deduplication using deterministic key ordering
  - Automatic email notifications to master and up to 6 levels of upline affiliates via Resend
  - Zod validation for API requests
  - Email normalization (lowercase/trim) for consistent deduplication
  - **Per-user notification preferences** with toggleable events and additional email recipients (max 5)
  - API: `POST /api/affiliate-activity/:type`, `GET /api/admin/affiliate-activities`, `GET/PUT /api/notification-settings`
- **Email Signature Generator (`/email-signature`)**: Interactive generator with 4 animated templates (Modern, Classic, Minimal, Bold), mobile-friendly preview, and Gmail-compatible output.

## Queued Enhancements
- **Platform Extension v3 (UI + Audit + Digest + Failover + Webhooks)**:
  - **Delivery Options**: instant, hourly digest, or daily digest
  - **Notification Audit Trail**: Tracks all email attempts with provider, success status, and error logging
  - **Digest Queue System**: Batches events for hourly/daily delivery with automatic cleanup
  - **Email Failover**: Primary SMTP with secondary webhook fallback
  - **Webhook Integration**: HMAC-signed webhook dispatch for external integrations
  - **Frontend Settings UI**: React component for managing notification preferences (toggle events, add emails, select delivery mode)

## External Dependencies
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: For database interaction.
- **Resend API**: For transactional emails, including contract signing links.
- **pdfkit**: For real-time PDF generation with embedded signatures.
- **Tailwind CSS**: For styling.
- **Shadcn UI**: For UI components.