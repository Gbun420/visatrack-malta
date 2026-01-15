# VISATRACK MALTA - AI CONTEXT FILE

## PROJECT OVERVIEW
This is a SaaS application for Maltese employers to track Third Country National (TCN) work visas, compliance documents, and expiry dates.

## TECH STACK
- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + Shadcn UI (compatible)
- **Language:** TypeScript
- **Auth:** Supabase Auth

## DATABASE SCHEMA
Reference `supabase/migrations/20260115_init.sql` for the full schema.
Key Tables: `companies`, `employees`, `visas`, `documents`, `alerts`.

## YOUR TASK
You are the lead developer. Use the provided file structure to implement features.
Always check `types/index.ts` for data interfaces before writing components.

## IMPLEMENTATION PRIORITY
1. **Supabase Setup:** Ensure the client in `lib/supabase.ts` is correct.
2. **Components:** Build the `EmployeeTable` and `StatusBadge` first.
3. **API:** Implement `app/api/employees/route.ts` for fetching data.
4. **Pages:** Build `app/dashboard/page.tsx`.

## DESIGN SYSTEM
- **Primary Color:** Teal (#208099)
- **Status Colors:**
  - Valid: Green
  - Expiring (<90 days): Yellow/Amber
  - Expired: Red
