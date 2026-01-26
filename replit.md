# NavigatorUSA

## Overview
NavigatorUSA - Veterans' Family Resources. A comprehensive veteran family support platform providing free VA rating software, gig work marketplace, manual claim assistance, business launch support with free website grants, startup funding grants up to $50,000, investor connections, furniture assistance ($3,000-$10,000) for veterans purchasing new homes, and private doctor referrals for VA delays. The platform includes a complete lead management system with public application forms and role-based portals for admins and affiliates.

## Brand Identity
- **Name**: NavigatorUSA
- **Tagline**: Veterans' Family Resources
- **Hero Message**: "Somebody, Something is Coming. Will You Be Ready to Answer the Call?"
- **Sub-message**: "Gear Up For Your Family to Face 2026 and Beyond"
- **Four Pillars**: Financial, Spiritual, Medical, Holistic

## Recent Changes
- **January 2026**: Complete rebrand from Operation Fiscal Freedom to NavigatorUSA
  - New INTENSE patriotic red/white/blue color scheme
  - Updated all logos to NavigatorUSA star logo
  - New tagline: "Veterans' Family Resources"
  - Four pillars displayed: Financial, Spiritual, Medical, Holistic
  - Updated all pages with NavigatorUSA branding
- **December 2024**: Enhanced admin dashboard with expanded lead management
  - Added "Investors" tab for investor submission management
  - Added sub-navigation within Help Requests (6 categories: Get Help, Startup Grant, Furniture, Private Doctor, Website, General Contact)
  - All forms now wired to their respective API endpoints with success states
- **December 2024**: Added investor submission system
  - New `/become-investor` page with contact form
  - Added "Become an Investor" link in footer
  - Created investor_submissions database table
- **December 2024**: Wired all forms to backend APIs
  - `/private-doctor` submits to `/api/private-doctor-requests`
  - `/apply-website` submits to `/api/website-applications`
  - `/contact` submits to `/api/general-contact`
  - All forms show success screens after submission
- **December 2024**: Added private doctor referral page with VA MISSION Act information
- **December 2024**: Added full lead management system with PostgreSQL database

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

## Compensation Structure (6-Level Model)
The default comp plan for all services (except tax) uses a 6-level structure with compression:
- **Recruiter Bounty**: 2.5% of Gross (separate from House Pool)
- **Level 1 (Top Producer)**: 67% of Gross Revenue
- **Level 2 (Closest Upline)**: 3.5% (conditional)
- **Level 3**: 2.0% (conditional)
- **Level 4**: 1.2% (conditional)
- **Level 5**: 0.8% (conditional)
- **Level 6 (Company)**: 0.5% + all compression from inactive L2-L5
- **Total House Allocation**: 75% of Gross

**Compression**: If any L2-L5 participant is inactive, their allocation reverts to L6 (Company).

## Project Architecture

### Frontend (client/)
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Tailwind CSS with custom brand colors
- Shadcn UI components

### Backend (server/)
- Express.js server
- PostgreSQL database with Drizzle ORM
- Session-based authentication with bcrypt password hashing
- Role-based access control (admin/affiliate)

### Database Schema
- `users` - Admin and affiliate accounts with hashed passwords
- `affiliate_applications` - Partner application submissions
- `help_requests` - VA claim help requests
- `investor_submissions` - Investor inquiry submissions
- `private_doctor_requests` - Private doctor referral requests
- `website_applications` - Free website grant applications
- `general_contact` - General contact form submissions
- `vlt_affiliates` - Multi-level affiliate system with 7-level hierarchy tracking (level1Id-level7Id)
- `opportunities` - B2B/B2C service offerings with commission structures per level
- `sales` - Sales transactions linked to affiliates with 7-level commission tracking
- `commissions` - Commission payouts per level for each sale
- `veteran_intakes` - Veteran program intake forms (disability, holistic, healthcare, financial)
- `business_intakes` - B2B service intake forms (insurance, tax, payroll, consulting)
- `contract_templates` - Contract templates for e-signature (MAH Independent Representative Agreement)
- `signed_agreements` - Tracked signed contracts with signature data, IP address, and ACH info

### Key Routes

**Public Pages:**
- `/` - Home page
- `/affiliate` - Affiliate application form
- `/get-help` - Help request form for VA claims
- `/apply-website` - Free website grant application
- `/apply-startup-grant` - Startup funding grant application ($5K-$50K)
- `/investors` - Investor connection for non-qualifying grant applicants
- `/become-investor` - Investor submission form
- `/new-home-furniture` - Furniture assistance for veterans buying homes ($3K-$10K)
- `/private-doctor` - Private doctor referral for VA delays (VA MISSION Act)
- `/contact` - General contact form

**Admin Portal:**
- `/admin/setup` - First-time admin account creation (uses setup key)
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Lead management CRM with tabs:
  - Affiliate Applications
  - Help Requests (with sub-navigation: Get Help, Startup Grant, Furniture, Private Doctor, Website, General Contact)
  - Investor Submissions
  - Manage Affiliates

**Affiliate Portal:**
- `/affiliate/login` - Affiliate authentication
- `/affiliate/dashboard` - View and manage assigned leads

**Ecosystem Portals:**
- `/master-portal` - Full ecosystem management (all affiliates, sales, commissions, intakes, Files/Agreements tab)
- `/submaster-portal` - Team management for sub-masters (downline tracking, team sales)
- `/veteran-intake` - Veteran services intake form (disability, holistic, healthcare, financial)
- `/business-intake` - B2B services intake form (insurance, tax, payroll, consulting)
- `/sign-contract` - E-signature portal for affiliates to sign required agreements (blocks portal access until signed)
- `/comp-plan` - Interactive 6-level commission calculator with plan language

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `ADMIN_SETUP_KEY` - (Optional) Custom admin setup key for production

## Admin Setup
1. Navigate to `/admin/setup`
2. Enter admin details
3. Use setup key: `OFF2024SETUP` (development) or set `ADMIN_SETUP_KEY` env var for production
4. Log in at `/admin/login`

## API Endpoints

**Public:**
- `POST /api/affiliate-applications` - Submit affiliate application
- `POST /api/help-requests` - Submit help request
- `POST /api/investor-submissions` - Submit investor inquiry
- `POST /api/private-doctor-requests` - Submit private doctor request
- `POST /api/website-applications` - Submit website grant application
- `POST /api/general-contact` - Submit general contact form

**Auth:**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/init-admin` - Create first admin (requires setup key)

**Admin (protected):**
- `GET /api/admin/affiliate-applications` - List all applications
- `PATCH /api/admin/affiliate-applications/:id` - Update application
- `GET /api/admin/help-requests` - List all help requests
- `PATCH /api/admin/help-requests/:id` - Update request
- `GET /api/admin/investor-submissions` - List all investor submissions
- `PATCH /api/admin/investor-submissions/:id` - Update investor submission
- `GET /api/admin/private-doctor-requests` - List all private doctor requests
- `PATCH /api/admin/private-doctor-requests/:id` - Update private doctor request
- `GET /api/admin/website-applications` - List all website applications
- `PATCH /api/admin/website-applications/:id` - Update website application
- `GET /api/admin/general-contact` - List all general contacts
- `PATCH /api/admin/general-contact/:id` - Update general contact
- `GET /api/admin/affiliates` - List affiliates
- `POST /api/admin/affiliates` - Create affiliate
- `DELETE /api/admin/affiliates/:id` - Delete affiliate

**Affiliate (protected):**
- `GET /api/affiliate/applications` - Get assigned applications
- `PATCH /api/affiliate/applications/:id` - Update application status
- `GET /api/affiliate/help-requests` - Get assigned requests
- `PATCH /api/affiliate/help-requests/:id` - Update request status

## Logo Assets
- Horizontal logo: `/attached_assets/NavStar-Horizontal_1767699671472.png`
- Stacked logo: `/attached_assets/NavStar-Stacked_1767699657516.png`
- Small logo: `/attached_assets/Navigaor_USA_Logo_396x86_1767699671480.png`
- Favicon: `/attached_assets/NAV_USA_Logo_-_Stacked_1767699671481.png`
