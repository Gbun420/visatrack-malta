# 🛠️ VisaTrack Malta - Database Migration & Seeding Instructions

This guide provides step-by-step instructions to set up your Supabase database and populate it with realistic demo data for the VisaTrack Malta platform.

## 1. Run Database Migrations

You need to execute the SQL migrations in your Supabase dashboard to set up the required tables and security policies.

### Step-by-Step:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project: **visatrack-malta**.
3. Click on the **SQL Editor** tab in the left sidebar.
4. Click **"New Query"**.
5. Open the file `supabase/migrations/20260115_init.sql` in your local project.
6. Copy the entire content of that file.
7. Paste it into the Supabase SQL Editor and click **"Run"**.
8. **Repeat** this process for the second migration file: `supabase/migrations/20260115_extended_schema.sql`.

---

## 2. Seed Demo Data

Once your tables are created, you can populate them with sample TCN employees and visa records using our built-in seeding API.

### How to Seed:
Run the following command in your terminal (locally or against your deployed URL):

```bash
# Locally
curl -X POST http://localhost:3000/api/seed

# Production (if deployed)
curl -X POST https://visatrack-malta.vercel.app/api/seed
```

**What this does:**
- Creates a "Malta Tech Solutions Ltd" demo company.
- Adds 5 sample employees from different countries (Philippines, India, Russia, Nepal, Pakistan).
- Generates realistic visa records with various statuses: **Valid**, **Expiring Soon**, and **Expired**.

---

## 3. Verify the Setup

1. Open your browser and navigate to the Dashboard:
   - Locally: `http://localhost:3000/dashboard`
   - Production: `https://visatrack-malta.vercel.app/dashboard`
2. You should see the **Employee Compliance List** populated with the 5 sample records.
3. Check the **Stats Cards**:
   - **Total TCNs** should be 5.
   - **Expiring Soon** should show 2.
   - **Expired** should show 1.
   - **Compliance Health** should calculate automatically based on these numbers.
4. Hover over the **(i)** icon next to "Compliance Health" to see the metric explanation.

---

## Troubleshooting

- **API 403 Forbidden:** Ensure you are running the `curl` command from localhost or that your environment is set to `development`.
- **Database Table Missing:** Ensure you ran *both* migration files in the correct order (`init` then `extended_schema`).
- **Missing Env Vars:** Verify that `.env.local` contains valid `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
