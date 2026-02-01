# NavigatorUSA

## Overview
NavigatorUSA is a comprehensive veteran family support platform designed to provide a wide array of resources. Its core purpose is to empower veteran families by offering financial, spiritual, medical, and holistic support. Key capabilities include free VA rating software, a gig work marketplace, manual claim assistance, business launch support with free website and startup funding grants, investor connections, furniture assistance for new home purchases, and private doctor referrals for VA delays. The platform features a complete lead management system with public application forms and role-based portals for administrators and affiliates. The business vision is to be the primary resource for veteran families, addressing their diverse needs and fostering economic independence.

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

### Frontend (client/)
The frontend is built with React and TypeScript, utilizing Wouter for routing and TanStack Query for efficient data fetching. Styling is managed with Tailwind CSS, incorporating custom brand colors. Shadcn UI components are used for a consistent and modern user interface. The UI/UX emphasizes a patriotic red, white, and blue theme, with specific color codes defined for brand consistency. The platform ensures clear visibility for form inputs and dropdowns, smooth page transitions with fade-in animations, and interactive button hover effects.

### Backend (server/)
The backend is an Express.js server connected to a PostgreSQL database via Drizzle ORM. It employs session-based authentication with bcrypt for password hashing and implements robust role-based access control (admin/affiliate). The system incorporates Zod for API endpoint validation and includes secure session management practices.

### Database Schema
The database schema is designed to support the platform's various functionalities, including:
- `users`: Stores admin and affiliate accounts with hashed passwords and role-based access.
- `affiliate_applications`: Manages submissions for affiliate partnerships.
- `help_requests`: Tracks requests for VA claim assistance and other support.
- `investor_submissions`: Records inquiries from potential investors.
- `private_doctor_requests`: Stores requests for private doctor referrals.
- `website_applications`: Manages applications for free website grants.
- `general_contact`: Handles general inquiries from users.
- `vlt_affiliates`: Implements a multi-level affiliate system with a 7-level hierarchy for tracking.
- `opportunities`: Defines B2B/B2C service offerings with associated commission structures.
- `sales`: Records sales transactions and links them to affiliates for commission calculation.
- `commissions`: Stores commission payouts per level for each sale.
- `veteran_intakes`: Manages intake forms for various veteran programs (disability, holistic, healthcare, financial).
- `business_intakes`: Handles intake forms for B2B services (insurance, tax, payroll, consulting).
- `csu_contract_templates`, `csu_contract_sends`, `csu_signed_agreements`: Support the Cost Savings University (CSU) platform for contract management, e-signatures, and agreement tracking.

### Feature Specifications
- **Comprehensive Admin Operations Hub (`/master-portal`)**: A central portal for managing all data sources, including real-time KPIs, pending action alerts, and organized tabs for applications, intakes, leads, sales, and documents.
- **Affiliate Management**: A multi-level affiliate system with a commission structure that benefits the producer through compression.
- **Contract Management (CSU Platform)**: An independent document signature platform with admin and public portals for managing, sending, and signing contracts. Features include PDF generation with embedded signatures, tokenized signing links, and email integration.
- **Lead Management System**: Comprehensive tracking and management of various lead types, including veteran support, business services, and grant applications.
- **Role-Based Portals**: Dedicated portals for admins, affiliates, and sub-masters with tailored functionalities and access levels.
- **VSO Portal Replication Pattern**: A pattern for creating branded, individualized contract management portals for Veterans Service Officers, including seed data, custom routing, and unique branding.
- **Planning Solutions (`/planning-solutions`)**: Comprehensive insurance and financial planning services page organized into 6 categories:
  - Planning Solutions: Long Term Care, Malpractice, Risk Mitigation
  - Disability Solutions: Physician Disability, Group Disability
  - Business Solutions: Custom Benefits, Key Person Insurance, Business Overhead Expense, Employee Education
  - Future Solutions: Life Insurance Review, Retirement Planning, Estate Planning, Succession Planning
  - Group Insurance Solutions: Group Disability Insurance, Employee Benefits Packages
  - Individual Insurance Solutions: Life Insurance Review, Professional Disability, Long Term Care Planning

## External Dependencies
- **PostgreSQL**: Primary database for data storage.
- **Drizzle ORM**: Used for database interaction and schema definition.
- **Resend API**: Integrated for sending transactional emails, particularly for contract signing links.
- **pdfkit**: Utilized for real-time PDF generation with embedded signatures within the CSU platform.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Shadcn UI**: Component library for UI development.

## VSO (Veterans Service Officer) Portal Replication Pattern

Use this pattern to create branded contract management portals for individual VSOs. Each VSO gets their own affiliate link and portal with their branding.

### Current VSO Implementations
- **Payzium (Maurice Verrelli)**: Route `/Payzium`, purple theme, contract signing portal

### How to Replicate for a New VSO

1. **Create Seed Data** (`server/seeds/{vsoName}Seed.ts`):
   - Admin account with email, password, phone numbers
   - Set `portal: "{vsoname}"` field to restrict login to that portal only
   - Contract templates specific to the VSO
   - Export a seed function that runs on server startup

2. **Add Route** (`client/src/App.tsx`):
   - Add route like `<Route path="/{VSOName}" component={VsoPortal} />`
   - Route is the affiliate link (e.g., `www.operationfiscalfreedom.com/{VSOName}`)

3. **Portal Page** (`client/src/pages/{vso}-portal.tsx`):
   - Copy csu-portal.tsx as template
   - Update branding: colors, company name, logo
   - Update `VSO_INFO` constant with contact details
   - Update login form to pass `portal: "{vsoname}"` parameter
   - Keep self-signing flow intact

4. **Import Seed in Server** (`server/index.ts`):
   - Import: `import { seed{VSOName}Data } from "./seeds/{vsoName}Seed";`
   - Call in startup: `await seed{VSOName}Data();`

5. **Access Control**:
   - Portal only accessible via direct affiliate link (not in global navigation)
   - Each VSO has their own login form on their portal page
   - Login uses `portal` parameter to restrict which accounts can log in
   - VSO accounts cannot log in to general admin portal

### Portal Login Isolation
The `portal` field in the users table controls login access:
- Users with `portal: "payzium"` can ONLY log in via the Payzium portal
- Users with `portal: null` can ONLY log in via general admin login
- This prevents cross-portal login attempts

### VSO Portal Features
- Send contracts via tokenized email links (7-day expiry)
- "Sign It Myself" - self-signing flow for immediate signing
- PDF generation with signature, initials, effective date
- View pending and signed contracts
- Account info panel with VSO contact details

---

## Ranger Tab: VIP Contract Signing Portal Pattern

**"Ranger Tab"** is the complete pattern for creating a branded, DocuSign-like contract signing portal for VIPs. When you receive a request like "Give me a Ranger Tab: [VIP Name]", replicate this entire system for that VIP.

### What a Ranger Tab Includes

A Ranger Tab is a complete, standalone contract management portal with:

1. **Branded Portal Page** (`/VIPName`)
   - Custom colors, logo, company name
   - Login form isolated to that portal only
   - Admin account with portal-specific access

2. **Contract Template System**
   - Pre-defined contract templates (can be multiple)
   - Auto-fill placeholders: `[NAME]`, `[EMAIL]`, `[DATE]`, `[INITIALS]`, `[COMPANY]`, `[ADDRESS]`, `[TITLE]`, etc.
   - Template stored in database with HTML content

3. **Send Contract Flow**
   - Enter recipient: Name, Email, Phone
   - Select template
   - Send via email (Resend integration)
   - Tokenized signing link (7-day expiry)

4. **Public Signing Page** (`/csu-sign?token=xxx`)
   - Auto-fills recipient info from send data
   - Form fields: Name, Email, Phone, Address, Initials, Effective Date
   - Template-specific fields (e.g., Company, Title for FICA contracts)
   - Contract preview with live auto-fill as user types
   - **"Apply Initials" button** - user enters initials, clicks to apply to all `[INITIALS]` placeholders
   - Signature canvas for hand-drawn signature
   - E-sign consent checkboxes
   - Legal notice about electronic signatures

5. **"Sign It Myself" Flow**
   - Admin can sign contracts themselves immediately
   - Same fields and validation as public signing
   - Uses admin's pre-filled info (name, email)
   - Includes "Apply Initials" button

6. **PDF Generation**
   - Server-side PDF creation with pdfkit
   - Embeds signature image, initials, all form data
   - Professional formatting with company branding
   - Downloadable after signing

7. **Contract Tracking**
   - Pending contracts list with status
   - Signed agreements list
   - Download signed PDFs anytime

### Current Ranger Tab Implementation: Payzium

**VIP**: Maurice Verrelli  
**Route**: `/Payzium`  
**Portal**: `payzium`  
**Theme**: Purple/Amber gradient  
**Login**: maurice@payzium.com / Payzium2024!

**Templates**:
- FICA Tips Tax Credit Agreement (ID 7) - 8 fields including company info
- Affiliate Agreement (ID 5) - 4 fields (Name, Email, Phone, Date)

**Key Files**:
- `client/src/pages/csu-portal.tsx` - Main portal page (copy as template)
- `client/src/pages/csu-sign.tsx` - Public signing page
- `server/seeds/payziumSeed.ts` - Seed data for admin account and templates
- `server/pdfGenerator.ts` - PDF generation logic
- `server/resendClient.ts` - Email sending

### How to Create a New Ranger Tab

When asked: "Give me a Ranger Tab: [VIP Name]"

**Step 1: Create Seed File** (`server/seeds/{vipName}Seed.ts`)
```typescript
export async function seed{VIPName}Data() {
  // 1. Create admin account
  const adminAccount = {
    email: "{vip}@{domain}.com",
    password: await bcrypt.hash("{SecurePassword}", 10),
    role: "admin",
    portal: "{vipname}", // lowercase, restricts login to this portal
    name: "{VIP Full Name}",
    phone: "{phone}",
  };
  
  // 2. Create contract templates
  const templates = [
    {
      name: "Agreement Name",
      description: "Description",
      content: `<div>...HTML with [PLACEHOLDERS]...</div>`,
      isActive: true,
    }
  ];
}
```

**Step 2: Create Portal Page** (`client/src/pages/{vip}-portal.tsx`)
- Copy `csu-portal.tsx` as base
- Update `{VIP}_INFO` constant with contact details
- Update theme colors (gradient backgrounds, accent colors)
- Update company name/branding in headers
- Update login to pass `portal: "{vipname}"` parameter

**Step 3: Add Route** (`client/src/App.tsx`)
```typescript
const {VIP}Portal = lazy(() => import("@/pages/{vip}-portal"));
// In routes:
<Route path="/{VIPName}" component={{VIP}Portal} />
```

**Step 4: Import Seed** (`server/index.ts`)
```typescript
import { seed{VIPName}Data } from "./seeds/{vipName}Seed";
// In startup:
await seed{VIPName}Data();
```

### Placeholder Reference

Standard placeholders for contract templates:
- `[NAME]`, `[SIGNER NAME]`, `[AFFILIATE]` - Signer's full name
- `[EMAIL]`, `[SIGNER EMAIL]` - Signer's email
- `[DATE]`, `[EFFECTIVE DATE]` - Agreement date
- `[INITIALS]` - Signer's initials (requires Apply Initials button)
- `[COMPANY]`, `[COMPANY NAME]` - Company name (FICA-specific)
- `[ADDRESS]`, `[COMPANY ADDRESS]` - Company address (FICA-specific)
- `[TITLE]` - Signer's title (FICA-specific)
- `[SIGNATURE]` - Replaced with signature image in PDF

### Template-Specific Field Logic

- **All templates**: Name, Email, Phone, Address, Initials, Effective Date required
- **FICA template (ID 7)**: Additional fields - Company Name, Company Address, Title, Secondary Owner (optional)
- Fields are validated before signing
- "Apply Initials" button must be clicked before signing can complete

### Portal Isolation

Each Ranger Tab portal is isolated:
- Users with `portal: "payzium"` can ONLY log in via `/Payzium`
- Users with `portal: null` can ONLY log in via general admin
- Cross-portal login attempts are blocked
- Portal routes are not in global navigation (accessed via direct link)

### Email Integration

Contracts are sent via Resend:
- From: Operation Fiscal Freedom (or custom domain)
- Subject includes contract type and recipient name
- Body includes signing link button and plain text URL
- Token expires in 7 days

---