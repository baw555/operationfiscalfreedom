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

## System Architecture

### Frontend
The frontend is built with React and TypeScript, using Wouter for routing and TanStack Query for data fetching. Styling is managed with Tailwind CSS, incorporating custom brand colors and Shadcn UI components. The UI/UX emphasizes a patriotic red, white, and blue theme.

### Backend
The backend utilizes Express.js, connecting to a PostgreSQL database via Drizzle ORM. It implements session-based authentication with bcrypt for password hashing and robust role-based access control (admin/affiliate). Zod is used for API endpoint validation.

### Database Schema
The database supports user management, affiliate applications, support requests, business services, sales and commissions, veteran intakes, and comprehensive contract management.

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

### Security Features
- **AES-256-GCM Encryption**: For sensitive data at rest.
- **Immutable Audit Trail**: Hash-chained notification audit logs for verification.
- **Global Legal Signature System**: A platform-wide, fail-closed legal document signing system with `requireLegalClearance()` middleware, unified signature mirroring, atomic and idempotent signing, version and hash locked documents, and auto-healing on login. Supports admin override with full audit trails and external e-sign integrations.

## External Dependencies
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: For database interaction.
- **Resend API**: For transactional emails.
- **pdfkit**: For real-time PDF generation.
- **Tailwind CSS**: For styling.
- **Shadcn UI**: For UI components.