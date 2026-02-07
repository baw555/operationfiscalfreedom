# Authority & Responsibility Leak Detection Report

**File:** `server/routes.ts` (11,171 lines)  
**Additional:** `server/routes/affiliateNda.ts`

---

## Finding Type 1: Business Logic in Express Handlers

### Commission Calculation Domain Logic
- **Lines 4642-4702** (`/api/commission/calculate`): Complex commission math (compression, upline splits, percentages) embedded in handler
- **Lines 4811-4998** (`/api/admin/send-commission-spreadsheet`): Complete HTML email template with inline CSS (168 lines) built in handler
- **Lines 5211-5410** (`/api/stress-test/run`): Entire stress test orchestration (200 lines) with hierarchy building, bcrypt hashing, affiliate creation loops in handler

### Authentication & Crypto Domain Logic
- **Lines 1794-1931** (`/api/auth/login`): Rate limiting check, bcrypt comparison, portal validation, session regeneration nested callbacks, HIPAA logging all in handler
- **Lines 2045-2136** (`/api/auth/forgot-password`): Token generation with crypto.randomBytes, SHA-256 hashing, email template building, Resend integration in handler
- **Lines 2139-2173** (`/api/auth/reset-password`): Token hashing, bcrypt password hashing in handler
- **Lines 418-493** (`/api/affiliate-signup`): User creation, bcrypt hashing, application storage, session regeneration with nested callbacks in handler
- **Lines 1607-1649** (`/api/admin/vlt-affiliates`): Referral code generation, bcrypt hashing, upline chain building in handler

### MFA Domain Logic
- **Lines 8099-8146** (`/api/mfa/setup`): TOTP secret generation, QR code generation, backup code generation + hashing in handler
- **Lines 8199-8352** (`/api/mfa/verify`): Rate limiting, backup code verification with hash comparison, TOTP verification, session manipulation in handler

### AI & Content Generation Domain Logic
- **Lines 8690-8863** (`/api/operator-ai/chat`): Content filtering, preset context building, memory mode logic, OpenAI API call, message history management, post-processing all in handler
- **Lines 8539-8631** (`/api/ai/generate`): Rate limiter map operations, validation, AI generation orchestration in handler

### Referral Tracking Domain Logic
- **Lines 530-580** (`/api/track-referral`): IP extraction, affiliate lookup, expiration date calculation, tracking record creation in handler
- **Lines 1257-1308** (`/api/help-requests`): Referral code lookup, IP tracking logic, affiliate chain traversal in handler
- **Lines 5003-5055** (`/api/business-leads`): IP extraction, referral lookup, IP tracking creation with 30-day expiration logic in handler

### Self-Repair Domain Logic
- **Lines 3000-3019** (`/api/repair/classify`): Issue classification, auto-fix capability check, diagnostics execution in handler
- **Lines 3178-3357** (`/api/repair/email`): Email command parsing, incident registration, emergency lock logic, batch approval with safety rules in handler

### Legal System Domain Logic
- **Lines 2700-2762** (`/api/legal/sign/:type`): Document type lookup, atomic signing orchestration in handler
- **Lines 3734-3772** (`/api/master/affiliate-nda-pdf/:ndaId`): Security key validation, NDA retrieval, PDF generation in handler
- **Lines 4478-4511** (`/api/contracts/sign`): Contract signing + mirroring to legal system with document hashing in handler

---

## Finding Type 2: req/res Objects Passed into Domain Logic

### Legal System Functions
- **Line 2755**: `signLegalDocumentAtomic({ userId, doc, docHash, req })` - passes entire req object
- **Line 2778**: `createLegalOverride({ adminId, userId, documentType, reason, req })` - passes req
- **Line 2812**: `processExternalEsignCallback({ userId, documentType, envelopeId, docText, req })` - passes req
- **Line 4494**: `signLegalDocumentAtomic` in contract signing - passes req

### Critical Flow Functions
- **Lines 3595-3599**: `processCriticalFlowIssue(description, { userId, ip: req.ip, userAgent: req.headers["user-agent"], ...})` - extracts from req but function signature couples to HTTP

---

## Finding Type 3: Duplicated Responsibilities

### Authorization Checks (Repeated Pattern)
- **Session userId extraction**: `req.session?.userId` or `req.session.userId!` appears in 142+ handlers
- **Ownership verification**: Case ownership check duplicated across:
  - Lines 9431-9433 (`/api/claims/cases/:id`)
  - Lines 9500-9502 (`/api/claims/cases/:id/tasks`)
  - Lines 9530-9532 (`/api/claims/tasks/:id`)
  - Lines 9565-9567 (`/api/claims/cases/:id/notes`)
  - Lines 9591-9593 (`/api/claims/cases/:id/notes` POST)
  - Lines 9628-9630 (`/api/claims/cases/:id/deadlines`)
  - Lines 10729-10751 (`/api/vendor/cases/:id`)

### Validation (Multiple Layers)
- **Zod schema parsing**: `insertXSchema.parse(req.body)` in 30+ handlers
- **Manual validation**: Additional null checks, length checks after schema parsing
  - Lines 422-428 (`/api/affiliate-signup`): Manual password length check after schema
  - Lines 1798-1800 (`/api/auth/login`): Manual null check for email/password
  - Lines 2147-2149 (`/api/auth/reset-password`): Manual password length check
  - Lines 5547-5550 (`/api/schedule-a/sign`): Manual name validation after schema

### IP Address Extraction (Repeated Pattern)
- **Pattern**: `req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown'`
- **Locations**: Lines 539, 981, 1263, 5009, 5552 (duplicated 5+ times)

### Email Sending (Side Effect in Multiple Handlers)
- **Resend integration duplicated in**:
  - Line 1027 (`/api/disability-referrals`)
  - Line 1476 (`/api/process-lead`)
  - Line 1542 (`/api/notify`)
  - Line 2105 (`/api/auth/forgot-password`)
  - Line 2702 (VSO air support)
  - Line 4986 (`/api/admin/send-commission-spreadsheet`)
  - Line 6404 (CSU contract sending)

### Session Regeneration Pattern (Duplicated Orchestration)
- **Nested callbacks with regenerate + save**:
  - Lines 454-488 (`/api/affiliate-signup`)
  - Lines 1696-1722 (`/api/vlt-affiliate/login`)
  - Lines 1878-1926 (`/api/auth/login`)
  - Lines 2013-2037 (`/api/auth/register`)
- **Pattern repeats**: regenerate error handling, session.userId assignment, session.save callback

---

## Finding Type 4: Multi-Layer Responsibility Execution

### Validation + Authorization + Side Effects in Same Handler
- **Lines 976-1064** (`/api/disability-referrals`):
  1. Validation: Zod schema parsing
  2. Authorization: Referral code lookup
  3. Business logic: IP extraction, affiliate assignment
  4. Side effect 1: Database insert
  5. Side effect 2: External API call (fetch to operationfiscalfreedom.com)
  6. Side effect 3: Email sending (sendEmailWithRetry)

- **Lines 1459-1501** (`/api/process-lead`):
  1. Business logic: Data extraction
  2. Side effect 1: CRM webhook (fetch)
  3. Side effect 2: Email (Resend)
  4. Side effect 3: SMS (Twilio)

- **Lines 8199-8352** (`/api/mfa/verify`):
  1. Validation: Input check
  2. Authorization: Rate limiting check (persistent)
  3. Business logic: Backup code hash comparison
  4. Business logic: TOTP verification
  5. Side effect 1: Database update (remove used backup code)
  6. Side effect 2: HIPAA audit log creation
  7. Authorization: Session manipulation
  8. Side effect 3: Another HIPAA audit log

### Orchestration + Persistence + External APIs
- **Lines 5211-5410** (`/api/stress-test/run`):
  1. Validation: Clamp input values
  2. Business logic: Build affiliate hierarchy
  3. Business logic: Commission calculation
  4. Side effect 1: Bcrypt password hashing
  5. Side effect 2: Loop creating affiliates (database writes)
  6. Side effect 3: Loop creating sales (database writes)
  7. Side effect 4: Loop creating commissions (database writes)

---

## Summary Statistics

| Metric | Count |
|---|---|
| **Handlers with embedded business logic** | 87 |
| **Handlers with crypto operations (bcrypt/crypto module)** | 12 |
| **Handlers with external API calls** | 15 |
| **Handlers with email side effects** | 15 |
| **Handlers with session manipulation** | 23 |
| **Handlers with legal record creation** | 8 |
| **Duplicated authorization patterns** | 142+ |
| **Duplicated validation patterns** | 30+ |
| **Domain functions receiving req/res** | 4 |
| **Handlers performing 4+ responsibility types** | 11 |

---

## No Fixes Proposed
Report complete. All findings are structural observations of current implementation.
