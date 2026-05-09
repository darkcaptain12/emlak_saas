@AGENTS.md

# EmlakCRM – Codebase Guide for AI Assistants

## Project Overview

**EmlakCRM** is a Turkish-language SaaS CRM for real estate agents. It provides property listing management, client tracking, lead pipeline (Kanban), rental management, and package-gated analytics.

- All UI copy is in **Turkish**.
- Currency is **TRY** (Turkish Lira).
- Users access the system after a package is manually activated by an admin via WhatsApp.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.1 (App Router, `--webpack` mode) |
| React | 19.2.4 with React Compiler (`reactCompiler: true`) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + `tw-animate-css` |
| UI Components | shadcn/ui (`@base-ui/react`) + `lucide-react` icons |
| Charts | Recharts 3 |
| Forms | React Hook Form 7 + Zod 4 validation |
| Backend | Supabase (PostgreSQL + Auth + Storage) via `@supabase/ssr` |
| Drag and drop | `@hello-pangea/dnd` (Lead Kanban board) |
| Toasts | Sonner |
| Date utils | `date-fns` |

**Dev server**: `npm run dev` (runs `next dev --webpack`)

---

## Repository Structure

```
src/
  app/
    (auth)/              # Unauthenticated routes: /login, /register
    (dashboard)/         # Authenticated routes behind Sidebar layout
      dashboard/         # Main dashboard page
      properties/        # Property CRUD + [id] detail/edit
      clients/           # Client CRUD + [id] detail/edit
      leads/             # Lead CRUD + Kanban + [id] detail/edit
      packages/          # Package info page (no pricing shown, WhatsApp CTA)
      settings/          # Profile settings
    api/
      rentals/           # REST API for rental management
      cron/reset-demo/   # Demo data reset endpoint
    layout.tsx           # Root layout (Geist font, Sonner toaster)
    page.tsx             # Root redirects: authenticated → /dashboard, else → /login
  components/
    ui/                  # shadcn/ui primitives (button, card, input, etc.)
    layout/              # Sidebar, PageHeader
    dashboard/           # Chart components, PackageBanner, OnboardingCards
    properties/          # PropertyForm, PropertyFilters, PropertyStatusBadge
    clients/             # ClientForm
    leads/               # LeadForm, LeadKanban
    rentals/             # RentalForm, RentalCard, RentalsList, RentalPaymentTracker, RentalDocuments
    shared/              # ConfirmDialog, EmptyState
  lib/
    supabase/
      client.ts          # Browser Supabase client (for Client Components)
      server.ts          # Server Supabase client (for Server Components / Actions)
    actions/             # Server Actions: property.actions.ts, client.actions.ts, lead.actions.ts
    validations/         # Zod schemas: property.ts, client.ts, lead.ts, rental.ts
    config/packages.ts   # Package definitions (PACKAGE_CONFIGS)
    permissions.ts       # Package feature gates
    auth.ts              # getAuthenticatedProfile() helper
    utils.ts             # cn(), formatCurrency(), formatDate(), formatRelativeDate()
    button-variants.ts   # Shared CVA button variant config
    demo.ts              # Demo data helpers
    whatsapp.ts          # WhatsApp link helpers
  types/index.ts         # All TypeScript types and interfaces
  proxy.ts               # Dev proxy helper
supabase/migrations/     # SQL migration files (apply in order)
```

---

## Authentication & Authorization

- **Auth provider**: Supabase Auth (email + password, SSR cookie-based sessions).
- **Server client**: Always `await createClient()` from `@/lib/supabase/server` in Server Components and Server Actions.
- **Client client**: `createClient()` from `@/lib/supabase/client` in Client Components only.
- **Auth guard**: The `(dashboard)` layout redirects unauthenticated users to `/login`. Server Actions call `supabase.auth.getUser()` and `redirect('/login')` if no session.
- **Profile helper**: `getAuthenticatedProfile()` in `src/lib/auth.ts` fetches user + profile in one call, redirecting on failure. Prefer this in Server Components when full profile data is needed.
- **RLS**: Every Supabase table has Row Level Security enabled. All queries are automatically scoped to `auth.uid()`. Never bypass RLS in app code.

---

## Package System

Three tiers gating features:

| ID | Name | Property Limit |
|---|---|---|
| `pack1` | Başlangıç | 20 |
| `pack2` | Profesyonel | 100 |
| `pack3` | Kurumsal | Unlimited |

**Permission helpers** in `src/lib/permissions.ts` — always use these, never hardcode tier comparisons:

```ts
canCreateProperty(pkg, count)       // property creation gate
canAccessAdvancedDashboard(pkg)     // pack2+
canAccessPremiumAnalytics(pkg)      // pack3
canTrackPayments(pkg)               // pack2+
canManageDocuments(pkg)             // pack3
canCommunicate(pkg)                 // pack3
```

Package config (prices, feature lists, colors) lives in `src/lib/config/packages.ts` as `PACKAGE_CONFIGS`.

---

## Data Patterns

### Soft Deletes
Properties, clients, and rentals are soft-deleted: `deleted_at TIMESTAMPTZ`. Always filter with `.is('deleted_at', null)` in queries. Never use hard `DELETE` from app code.

### Server Actions (mutations for properties/clients/leads)
Located in `src/lib/actions/`. Pattern:
1. `'use server'` directive at top
2. `await createClient()` → auth check → redirect if unauthed
3. Fetch profile → package check
4. Validate FormData with Zod schema
5. Insert/update via Supabase
6. `revalidatePath(...)` then `redirect(...)`

### REST API Routes (rentals)
Located in `src/app/api/rentals/`. Pattern:
1. `createClient()` → auth check → return 401 if unauthed
2. `NextResponse.json(...)` responses
3. Zod validation on request body
4. Return appropriate HTTP status codes

### Parallel Data Fetching
Dashboard uses `Promise.all([...])` for parallel Supabase queries. Follow this pattern for any page with multiple independent queries.

---

## Database Schema Summary

Core tables (all with `created_at`, `updated_at` auto-managed by triggers):

- `profiles` — extends `auth.users`; has `role`, `package_type`, `is_active`
- `properties` — real estate listings, scoped to `agent_id`
- `property_images` — linked to properties, stored in `property-images` bucket
- `clients` — buyer/seller/renter/landlord contacts
- `leads` — links clients to properties, has Kanban status pipeline
- `lead_notes` — text notes on a lead
- `rentals` — active rental contracts (pack1+)
- `rental_payments` — auto-generated monthly payment schedule (12 months on create)
- `rental_documents` — uploaded files (pack3)
- `rental_communication_logs` — tenant communication history (pack3)

Migrations in `supabase/migrations/` must be applied in numerical order.

---

## Type System

All shared types are in `src/types/index.ts`. Key union types:

```ts
Role = 'super_admin' | 'customer_user'
PackageType = 'pack1' | 'pack2' | 'pack3'
PropertyType = 'apartment' | 'house' | 'land' | 'commercial' | 'other'
ListingType = 'sale' | 'rent'
PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'passive'
ClientType = 'buyer' | 'seller' | 'renter' | 'landlord' | 'other'
LeadStatus = 'new' | 'contacted' | 'viewing' | 'offer' | 'won' | 'lost'
LeadSource = 'website' | 'referral' | 'social' | 'portal' | 'walk_in' | 'other'
RentalStatus = 'active' | 'ended' | 'paused'
RentalPaymentStatus = 'pending' | 'paid' | 'late' | 'partial'
```

---

## UI Conventions

- **Dark theme**: base background `bg-slate-950`, cards `bg-slate-900`, borders `border-slate-800`.
- **`cn()`** from `src/lib/utils.ts` for conditional Tailwind classes (wraps `clsx` + `tailwind-merge`).
- **Currency formatting**: always use `formatCurrency(amount, currency)` from `src/lib/utils.ts`.
- **Dates**: `formatDate(iso)` for long form, `formatRelativeDate(iso)` for "2 gün önce" style.
- **Icons**: `lucide-react` only; never import individual icon files.
- **Toasts**: `import { toast } from 'sonner'` — `toast.success(...)`, `toast.error(...)`.
- **Empty states**: Use `<EmptyState>` from `src/components/shared/EmptyState.tsx`.
- **Confirm dialogs**: Use `<ConfirmDialog>` from `src/components/shared/ConfirmDialog.tsx`.
- **Sidebar navigation**: Defined in `src/components/layout/Sidebar.tsx`; update `navItems` array when adding new routes.

---

## Key Conventions

- **Language**: All user-facing strings must be in Turkish.
- **No comments in code** unless the WHY is non-obvious.
- **Server vs Client Components**: Default to Server Components. Add `'use client'` only when hooks, event handlers, or browser APIs are needed.
- **Zod schemas**: Place validation schemas for each domain in `src/lib/validations/`. Import and reuse in both Server Actions and API routes.
- **Never expose `agent_id`/`user_id` in client-side code** — RLS enforces this on the DB, but don't pass it through forms. Derive it from `auth.getUser()` server-side.
- **`revalidatePath` after mutations**: Always invalidate affected pages after write operations.
- **`agent_id` vs `user_id`**: The `properties` table uses `user_id` (legacy inconsistency); all other tables use `agent_id`. Check the migration SQL when adding queries.

---

## Development Workflow

```bash
npm run dev      # Start dev server (Next.js with webpack)
npm run build    # Production build
npm run lint     # ESLint
```

Environment variables required (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Next.js Version Notice

This project uses **Next.js 16.x**, which has breaking changes from earlier versions. Before writing any Next.js-specific code, consult `node_modules/next/dist/docs/` for the current API. Do not assume behavior from training data — APIs, conventions, and file conventions may differ.
