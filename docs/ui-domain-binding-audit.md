# UI ↔ Domain Binding Audit

**Scope:** All files under `client/src/pages/`, `client/src/components/`, `client/src/hooks/`, `client/src/lib/`  
**Backend:** `server/routes.ts`, `server/storage.ts`, `shared/schema.ts`

---

## Binding Classification Key

- **Strong (domain-aligned):** UI consumes a well-defined API shape, uses typed interfaces that match backend schema, and delegates domain logic to server
- **Weak (shape-coupled):** UI works correctly but is tightly coupled to the exact shape of the API response — any field rename, nesting change, or type change silently breaks it
- **Fragile (implicit assumptions):** UI assumes facts about the data that are not enforced by the API contract — status string values, boolean coercion, field existence, cross-entity relationships

---

## 1. Auth State Consumption

### Finding: Inconsistent queryKey for the same endpoint

The `/api/auth/me` endpoint is consumed across 12+ pages with **two different queryKey conventions**:

| queryKey | Pages Using It |
|---|---|
| `["/api/auth/me"]` | `affiliate-nda.tsx`, `admin-dashboard.tsx`, `master-portal.tsx`, `stress-test.tsx`, `submaster-portal.tsx`, `csu-portal.tsx`, `schedule-a.tsx` |
| `["auth"]` | `affiliate-dashboard.tsx`, `sign-contract.tsx` |

**Impact:** Cache invalidation from one page does not propagate to pages using the other key. For example, `affiliate-apply.tsx` invalidates `["/api/auth/me"]` after signup, but `affiliate-dashboard.tsx` listens on `["auth"]` — the dashboard may serve stale auth data after a fresh signup until a hard refetch.

**Classification: Fragile** — Same data, two cache identities. Invalidation misses are silent.

---

### Finding: Role-check logic duplicated and inconsistent across pages

Each page re-implements role gating with slightly different patterns:

| Page | Role Check Pattern |
|---|---|
| `admin-dashboard.tsx` (line 905) | `authData.user.role !== "admin" && authData.user.role !== "master"` |
| `admin-dashboard.tsx` (line 1027) | Same check duplicated in second component |
| `affiliate-dashboard.tsx` (line 74) | `authData.user?.role !== "affiliate"` |
| `affiliate-nda.tsx` (line 142) | `authData.user?.role !== "affiliate"` |
| `master-portal.tsx` (line 194+) | `authData?.user?.role === "admin" \|\| authData?.user?.role === "master"` (repeated 21 times as `enabled` flag on queries) |
| `master-portal.tsx` (line 504) | `const isAuthorized = authData?.user?.role === "admin" \|\| authData?.user?.role === "master"` |
| `notification-console.tsx` (line 224) | `me.role === "admin" \|\| me.role === "master"` |
| `hipaa-admin.tsx` (line 69) | `currentUser.role !== "admin" && currentUser.role !== "master"` |
| `csu-portal.tsx` (line 3310) | `!user \|\| user.role !== "admin"` (omits "master" role) |
| `login.tsx` (line 49) | `data.user.role === "admin" \|\| data.user.role === "master"` |
| `admin-login.tsx` (line 43) | `data.user?.role === "admin"` (omits "master" role) |

**Inconsistencies:**
- `csu-portal.tsx` and `admin-login.tsx` check for `"admin"` only, excluding `"master"` role
- `master-portal.tsx` repeats the admin/master check 21 times as query `enabled` flags
- No shared `isAdmin()` or `isAffiliate()` utility — each page re-derives from raw role string

**Classification: Fragile** — If a new role like `"super_admin"` were added, 12+ pages would need manual updates. The `csu-portal.tsx` and `admin-login.tsx` omission of `"master"` is already a latent bug.

---

### Finding: Auth response shape assumed but never validated

Every page that fetches `/api/auth/me` assumes the response shape `{ user: { id, name, email, role, ... } }` without any runtime validation:

```typescript
// affiliate-dashboard.tsx line 64
const res = await fetch("/api/auth/me", { credentials: "include" });
if (!res.ok) return null;
return res.json(); // raw JSON, no shape validation
```

No page imports types from `shared/schema.ts`. Each page either uses `any` or defines its own local `User` interface.

**Classification: Weak** — Works as long as the backend response shape never changes.

---

## 2. Local Type Definitions vs Shared Schema

### Finding: Zero imports from shared schema

```
grep: import.*from.*@shared|import.*from.*shared/schema
Result: No matches found
```

**Every frontend page defines its own TypeScript interfaces** for backend entities. None import from `shared/schema.ts`. This means:
- Type changes in the schema do not produce compile errors in the frontend
- Frontend types can silently drift from backend reality
- No single source of truth for entity shapes

### Finding: Same entity, different interfaces across pages

**ContractTemplate** — 3 different definitions:

| Page | Interface | Fields |
|---|---|---|
| `csu-portal.tsx` (line 29) | `CsuContractTemplate` | `id, name, description, content, isActive` |
| `document-signature.tsx` (line 86) | `ContractTemplate` | `id, name, description, content, isActive` |
| `sign-contract.tsx` (line 7) | `ContractTemplate` | `id, name, version, content, companyName, requiredFor, serviceName?, grossCommissionPct?` |

`sign-contract.tsx` defines `ContractTemplate` with completely different fields (`version`, `companyName`, `requiredFor`, `grossCommissionPct`) than the other two pages. This is because `sign-contract.tsx` actually consumes `contract_templates` (the main contract system), while `csu-portal.tsx` and `document-signature.tsx` consume `csu_contract_templates` (the CSU system) — but both use the name "ContractTemplate."

**Classification: Fragile** — Developers cannot tell which backend table a frontend type maps to without reading the fetch URL.

---

**User** — 3 different definitions:

| Page | Interface | Fields |
|---|---|---|
| `csu-portal.tsx` (line 60) | `User` | `id, email, role, firstName?, lastName?` |
| `master-portal.tsx` (line 85) | `AffiliateFile` | `id, name, email, nda?, contracts?, w9?` |
| `admin-dashboard.tsx` | No interface — all `any` | `(app: any)`, `(aff: any)`, `(inv: any)` |

`admin-dashboard.tsx` uses `any` for 26+ data bindings, making it impossible to detect backend shape changes at compile time.

**Classification: Fragile** (admin-dashboard), **Weak** (csu-portal, master-portal)

---

**CaseNote** (Claims domain):

| Page | Field | Type |
|---|---|---|
| `claims-navigator.tsx` (line 85) | `authorEmail` | `string` |
| Backend route (line 9602) | passes `userId` (integer) | to `authorEmail` field |

The UI displays `authorEmail` as if it were an email address, but the backend stores the user's integer ID in this field. If the UI ever tries to render it as a mailto link or validate it as email, it will fail.

**Classification: Fragile** — Type mismatch between what the field name implies, what the frontend interface declares, and what the backend actually stores.

---

## 3. Domain Logic Re-implemented in UI

### Finding: Commission calculation duplicated in frontend

`comp-plan.tsx` (lines 15-55) re-implements the full commission calculation model:

```typescript
const producerBase = 0.69;
const uplineEach = 0.01;
const housePct = 0.225;
const recruiterPct = 0.025;
```

The same calculation exists in:
1. **Backend route handler** — `POST /api/commission/calculate` (server/routes.ts lines 4642-4702)
2. **Backend email template** — hardcoded HTML (server/routes.ts lines 4816-4983)
3. **Frontend comp-plan.tsx** — re-implemented with hardcoded constants (lines 22-25)

The backend and frontend use the same percentage values today, but they are independently maintained. If the backend `commission_config` table values change, the frontend comp-plan page will show stale percentages. There is no API call from comp-plan.tsx to fetch the current config — all values are hardcoded.

**Classification: Fragile** — Business rule (commission percentages) exists in 3 places with no single source of truth.

---

### Finding: Status string interpretation duplicated across pages

Task status values (`"todo"`, `"doing"`, `"done"`) are interpreted inline in JSX with color/label mapping:

```typescript
// claims-navigator.tsx lines 770, 794-798
const nextStatus = task.status === "todo" ? "doing" : task.status === "doing" ? "done" : "todo";
// ...
{task.status === "todo" ? "To Do" : task.status === "doing" ? "In Progress" : "Complete"}
```

Similar patterns exist for:
- Deadline status: `"open"`, `"at_risk"`, `"late"`, `"done"` → color mapping (lines 940-966)
- Case share role: `"view"`, `"comment"`, `"upload"` → icon + label mapping (lines 1068-1075)
- Evidence status: `"present"` vs anything else → green/red (lines 1166-1188)
- Application status: `"pending"`, `"new"`, `"contacted"`, `"in_progress"`, `"closed"` → badge colors (master-portal.tsx line 850)

Each page independently maps status strings to display properties (colors, labels, icons). No shared status-to-display utility exists.

**Classification: Weak** — Functions correctly but each status string is a magic constant that must match the backend exactly.

---

### Finding: NDA gate logic duplicated across pages

NDA status checking and redirect logic exists in 3 separate pages:

| Page | Pattern |
|---|---|
| `affiliate-nda-panels.tsx` (line 32) | `if (!isLoading && ndaStatus?.hasSigned) { setLocation("/affiliate-portal") }` |
| `affiliate-dashboard.tsx` (line 242) | `if (!ndaLoading && authData?.user && ndaStatus && !ndaStatus.hasSigned) { setLocation("/affiliate-nda") }` |
| `sign-contract.tsx` (line 74) | Fetches NDA status to check `hasSigned` before showing contracts |

Two pages also invalidate NDA cache with different queryKeys:
```typescript
// affiliate-nda-panels.tsx line 175-176
queryClient.invalidateQueries({ queryKey: ["/api/affiliate/nda-status"] });
queryClient.invalidateQueries({ queryKey: ["affiliate-nda-status"] });
```

The second invalidation key `["affiliate-nda-status"]` does not match any actual queryKey used in the codebase — it is a dead invalidation.

**Classification: Fragile** — The NDA gate is a domain rule (affiliates must sign NDA before accessing dashboard) re-implemented in 3 places with inconsistent cache keys.

---

### Finding: Lead filtering and status counting duplicated

Both `admin-dashboard.tsx` and `master-portal.tsx` independently filter and count records by status:

```typescript
// master-portal.tsx lines 686-718
affiliateApplications.filter((a: any) => a.status === 'pending').length
helpRequests.filter((h: any) => h.status === 'pending').length
startupGrants.filter((s: any) => s.status === 'pending').length
veteranIntakes.filter((v: any) => v.status === 'pending').length
businessLeads.filter((b: any) => b.status === 'new').length
```

```typescript
// admin-dashboard.tsx line 438
const activeLeads = [...applications, ...helpRequests].filter((l) => l.status !== "closed").length;
```

Every `.filter()` call uses `any` typing and hardcoded status strings. The `admin-dashboard` considers "active" as "not closed", while `master-portal` counts "pending" specifically. Both are valid but incompatible interpretations of "how many items need attention."

**Classification: Weak** — Functional but fragile to status value changes.

---

## 4. Multiple Components Interpreting Same Data Differently

### Finding: `isActive` — boolean in UI, text in database

Database schema stores `isActive` as text (`"true"` / `"false"`) for `csu_contract_templates`, `contract_templates`, `opportunities`, and `commission_config`.

Frontend interfaces declare `isActive` as `boolean`:
```typescript
// csu-portal.tsx line 34
isActive: boolean;

// document-signature.tsx line 91
isActive: boolean;
```

The frontend treats `isActive` as a boolean (`.filter(t => t.isActive)`, `template.isActive ? "Active" : "Inactive"`). This works because JavaScript truthy evaluation treats the string `"true"` as truthy. However:
- The string `"false"` is also truthy in JavaScript
- If the backend ever returns the text `"false"` for an inactive template, the UI would incorrectly show it as active
- This only works today because inactive templates likely never reach the frontend (filtered server-side)

**Classification: Fragile** — Boolean coercion of text strings creates a latent bug. The text value `"false"` would evaluate as truthy.

---

### Finding: `admin-dashboard.tsx` and `master-portal.tsx` both display affiliate data with different shapes

`admin-dashboard.tsx` fetches affiliates as raw user records:
```typescript
// line 978
const res = await fetch("/api/admin/affiliates", { credentials: "include" });
// Used as (affiliate: any) — no typing
```

`master-portal.tsx` fetches affiliate files with NDA + contract data joined:
```typescript
// line 85
interface AffiliateFile {
  id: number; name: string; email: string;
  nda?: { id, fullName, address, facePhoto?, idPhoto?, signatureData?, signedAt };
  contracts?: Array<{ id, contractName, signedAt, signatureData? }>;
  w9?: { name, address, city, state, zip, taxClassification, certificationDate };
}
```

These are completely different API responses for the same underlying entity (affiliate user). An admin viewing affiliates in `admin-dashboard.tsx` sees raw user fields; the same admin viewing affiliates in `master-portal.tsx` sees a composite object with NDA + contracts + W9 nested. No documentation or type system connects the two views to the same domain entity.

**Classification: Weak** — Both views work independently but represent the same entity with incompatible shapes.

---

### Finding: Duplicate queries for the same endpoint in same page

`admin-dashboard.tsx` declares `useQuery` with queryKey `["admin-affiliates"]` in **three separate components** within the same file (lines 320, 425, 731, 976). Each independently fetches the same endpoint.

While TanStack Query deduplicates concurrent requests, this pattern means:
- 4 components independently assume the response shape
- If the endpoint changes, 4 places in one file need updating
- Each component uses `(affiliate: any)` typing — no compile-time safety

**Classification: Weak** — TanStack Query prevents N+1 fetches, but the code structure invites drift.

---

## 5. Backend Changes That Would Break UI Silently

### Category: Field Renames

Any backend field rename would silently break the UI because:
- Zero shared types between frontend and backend
- Frontend uses `any` in 140+ locations across page files
- No runtime response validation (all `res.json()` results are trusted)

**High-risk fields:**
| Backend Field | UI Pages Depending On It |
|---|---|
| `user.role` | 12+ pages (role gating) |
| `ndaStatus.hasSigned` | 3 pages (NDA gate) |
| `template.isActive` | 3 pages (filtering) |
| `task.status` | `claims-navigator.tsx` (10+ inline checks) |
| `affiliate.referralCode` | `affiliate-dashboard.tsx`, `fin-ops/index.tsx`, `merchant-services.tsx` |

**Classification: Fragile** — No field rename would produce a compile error.

---

### Category: Status Value Changes

If backend status values change (e.g., `"pending"` → `"awaiting_review"`), the UI would:
- Still render without errors (no crash)
- Show incorrect counts, colors, and labels
- Filter logic would silently exclude the new status value

**Pages affected:**
| Status Domain | Pages | Values Assumed |
|---|---|---|
| Application status | `admin-dashboard.tsx`, `master-portal.tsx` | `"pending"`, `"new"`, `"contacted"`, `"in_progress"`, `"closed"` |
| Task status | `claims-navigator.tsx` | `"todo"`, `"doing"`, `"done"` |
| Deadline status | `claims-navigator.tsx` | `"open"`, `"at_risk"`, `"late"`, `"done"` |
| Share role | `claims-navigator.tsx` | `"view"`, `"comment"`, `"upload"` |
| Contract send status | `csu-portal.tsx`, `document-signature.tsx` | `"pending"`, `"signed"`, `"expired"` |

**Classification: Fragile** — Status values are magic strings with no enum contract between frontend and backend.

---

### Category: Nullable Field Changes

If a currently-non-null field becomes nullable (or vice versa), the UI may crash or show `undefined`:

| Field | Current UI Assumption | Risk |
|---|---|---|
| `affiliate.name` | Always present, rendered directly | Would show `undefined` if nulled |
| `ndaStatus.hasSigned` | Boolean, checked with `!ndaStatus.hasSigned` | Would redirect incorrectly if field missing |
| `case.veteranUserId` | Always matches session user | Ownership check would fail if null |

**Classification: Fragile** — No optional chaining on most field accesses.

---

### Category: API Response Wrapping Changes

Some endpoints return raw arrays, others wrap in `{ success: true, data: [...] }`:
- `GET /api/admin/affiliates` → returns raw array
- `POST /api/affiliate-signup` → returns `{ success: true, ... }`
- `GET /api/affiliate/nda-status` → returns `{ hasSigned: boolean }`

If any endpoint changes its wrapping convention, the UI would silently get `undefined` for expected fields.

**Classification: Weak** — Convention exists but is inconsistent and undocumented.

---

## 6. Query Configuration Anomalies

### Finding: `staleTime: Infinity` as global default

```typescript
// client/src/lib/queryClient.ts line 54
staleTime: Infinity,
```

The global query client sets `staleTime: Infinity`, meaning **no query ever automatically refetches**. Individual pages override this:
- Auth queries: `staleTime: 60_000` (60 seconds)
- Admin data: `staleTime: 5 * 60 * 1000` (5 minutes)
- NDA status: `staleTime: 30000` (30 seconds)

Pages that do NOT override staleTime inherit Infinity, meaning their data never refreshes unless manually invalidated. This includes most queries in:
- `csu-portal.tsx` (13 queries, some without staleTime override)
- `claims-navigator.tsx` (17 queries with tab-gated loading but no clear staleTime)
- `sign-contract.tsx` (7 queries)

**Classification: Weak** — Inconsistent staleness behavior across pages.

---

### Finding: `refetchOnWindowFocus: false` globally

Combined with `staleTime: Infinity`, this means a user who switches tabs and returns will never see updated data unless they manually refresh or trigger an invalidation. For a multi-user admin platform, this means:
- Admin viewing affiliate list won't see new signups until page reload
- Commission data stays stale indefinitely
- NDA signing events won't appear in master portal

**Classification: Weak** — Intentional for performance but creates stale-data UX issues.

---

## 7. Binding Classification Summary

### Strong Bindings (domain-aligned)

| Binding | Why Strong |
|---|---|
| Claims Navigator → `/api/claims/cases` hierarchy | Typed interfaces match backend schema. Query hierarchy follows aggregate root pattern (`cases` → `tasks`, `notes`, `deadlines`, `files`, `shares`). Tab-gated loading defers queries until needed. |
| NDA submission → `POST /api/affiliate/nda/submit` | Dedicated action file on backend (`submitAffiliateNda.ts`). Transactional with idempotency. Frontend NDA form context mirrors action input shape. |
| Sailor chat → `/api/sailor/chat` | Self-contained domain. Service layer extracted on backend (`sailor-chat.ts`). Frontend consumes simple message/conversation shape. |

### Weak Bindings (shape-coupled)

| Binding | Why Weak |
|---|---|
| Admin dashboard → 23 `/api/admin/*` endpoints | Correctly fetches and displays data, but all typed as `any`. Shape changes in any of 23 endpoints would silently break. No shared types. |
| Affiliate dashboard → 15 mixed endpoints | Mix of auth, NDA, contracts, leads — all independently fetched with inline `fetch()`. Works but tightly coupled to exact response shapes. |
| Master portal → 24 admin endpoints | 21 queries guarded by duplicated role check. Each uses `any` typing. `AffiliateFile` interface is well-defined but not shared. |
| CSU portal → 13 CSU endpoints | Local interfaces defined (`CsuContractTemplate`, `CsuContractSend`, `CsuSignedAgreement`) but not imported from schema. |
| Document signature → contract endpoints | Own `ContractTemplate` interface duplicates CSU portal's interface with identical fields. |
| Query cache keys | Mix of URL-path keys (`["/api/auth/me"]`) and semantic keys (`["auth"]`). Same endpoint cached under different keys. |

### Fragile Bindings (implicit assumptions)

| Binding | Why Fragile |
|---|---|
| Role gating across 12+ pages | Raw string comparison (`=== "admin"`, `=== "master"`, `=== "affiliate"`) duplicated everywhere. `csu-portal.tsx` and `admin-login.tsx` omit `"master"` role — latent access bug. No `isAdmin()` utility. |
| `isActive` boolean coercion | Backend stores text `"true"`/`"false"`. Frontend declares `boolean`. JavaScript truthy coercion makes `"false"` appear as `true`. Works by accident today. |
| Commission percentages in `comp-plan.tsx` | Hardcoded `0.69`, `0.225`, `0.025` — independently maintained from backend `commission_config` table and email template. Three sources of truth. |
| NDA gate redirect logic | Duplicated across 3 pages with inconsistent queryKeys. Dead cache invalidation key `["affiliate-nda-status"]` does nothing. |
| Status string magic constants | `"pending"`, `"todo"`, `"doing"`, `"done"`, `"active"`, `"new"`, `"closed"` — all hardcoded in JSX conditionals across 6+ pages. No shared enum. |
| `case_notes.authorEmail` | Frontend expects email string. Backend stores integer userId. Field name is misleading. Would break if rendered as mailto link. |
| `any` typing in admin pages | 140+ uses of `: any` across page files. Compile-time safety is zero for admin-facing data. |
| Auth queryKey split | `["/api/auth/me"]` vs `["auth"]` — same endpoint, two cache entries. Invalidation from one misses the other. |
| Duplicate queries in same file | `admin-dashboard.tsx` declares `["admin-affiliates"]` query 4 times in separate components. |

---

## Statistics

| Metric | Count |
|---|---|
| **Pages consuming `/api/auth/me`** | 12+ |
| **Distinct queryKeys for auth endpoint** | 2 (`["/api/auth/me"]`, `["auth"]`) |
| **Pages with inline role checks** | 12 |
| **Role check patterns (unique)** | 6 different patterns |
| **Pages omitting "master" from admin check** | 2 (`csu-portal.tsx`, `admin-login.tsx`) |
| **Frontend interfaces not imported from schema** | All (0 imports from shared/schema) |
| **Duplicate `ContractTemplate` interfaces** | 3 (incompatible field sets) |
| **Uses of `: any` or `as any` in pages** | 140+ |
| **Commission percentage sources of truth** | 3 (backend route, email template, frontend comp-plan) |
| **Status string constants with no shared enum** | 5 domains × 3-5 values each |
| **Dead cache invalidation keys** | 1 confirmed (`["affiliate-nda-status"]`) |
| **Duplicate query declarations (same file)** | 4 in `admin-dashboard.tsx` |

---

## No Fixes Proposed
Report complete. All findings are structural observations of current UI ↔ backend bindings.
