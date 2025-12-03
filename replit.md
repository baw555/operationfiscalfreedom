# Operation Fiscal Freedom

## Overview
A comprehensive veteran support platform providing free VA rating software, gig work marketplace, manual claim assistance, and business launch support. The platform includes a complete lead management system with public application forms and role-based portals for admins and affiliates.

## Recent Changes
- **December 2024**: Added full lead management system with PostgreSQL database
  - Public forms at `/affiliate` and `/get-help`
  - Admin dashboard at `/admin/dashboard`
  - Affiliate portal at `/affiliate/dashboard`
  - Secure authentication with bcrypt and session management

## User Preferences
- Military-tactical design aesthetic with brand colors: Tactical Green, Patriot Navy, Gold
- Typography: Bebas Neue for headings, Montserrat for body text
- Emphasis on "Navy SEAL Owned Business" branding
- Network size displayed as 150,000+ veterans

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

### Key Routes

**Public Pages:**
- `/` - Home page
- `/affiliate` - Affiliate application form
- `/get-help` - Help request form for VA claims
- `/apply-website` - Free website grant application

**Admin Portal:**
- `/admin/setup` - First-time admin account creation (uses setup key)
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Lead management CRM, affiliate management

**Affiliate Portal:**
- `/affiliate/login` - Affiliate authentication
- `/affiliate/dashboard` - View and manage assigned leads

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
- `GET /api/admin/affiliates` - List affiliates
- `POST /api/admin/affiliates` - Create affiliate
- `DELETE /api/admin/affiliates/:id` - Delete affiliate

**Affiliate (protected):**
- `GET /api/affiliate/applications` - Get assigned applications
- `PATCH /api/affiliate/applications/:id` - Update application status
- `GET /api/affiliate/help-requests` - Get assigned requests
- `PATCH /api/affiliate/help-requests/:id` - Update request status
