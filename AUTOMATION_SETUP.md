# 🚀 VisaTrack Malta - Automation Setup Guide

## **Step 1: Link Project Locally**
Run this in your terminal to link your local project to Vercel:

```bash
vercel link
```

**When prompted:**
1. **Set up and deploy?** [Y]
2. **Which scope?** [Select your account]
3. **Link to existing project?** [N]
4. **Project name?** `visatrack-malta`
5. **In which directory?** [./]

This creates a `.vercel/project.json` file containing your `orgId` and `projectId`.

---

## **Step 2: Generate Vercel API Token**
1. Go to [Vercel Tokens](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Name: `GITHUB_ACTIONS`
4. Scope: **Full Account**
5. **Copy the token** immediately (you won't see it again)

---

## **Step 3: Add GitHub Secrets**
Go to your GitHub Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

Add these 5 secrets:

| Secret Name | Value Source | Description |
|---|---|---|
| `VERCEL_TOKEN` | From Step 2 | API Token for deployment access |
| `VERCEL_ORG_ID` | `.vercel/project.json` | The `orgId` value |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` | The `projectId` value |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings > API | Your project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings > API | Your Anon Public Key |

---

## **Step 4: Push to Trigger Deployment**
Once secrets are set, push your code to the `main` branch:

```bash
git add .
git commit -m "Setup CI/CD pipeline"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/visatrack-malta.git
git push -u origin main
```

## **Step 5: Database Setup**
Don't forget to run your migrations in the production Supabase project:
1. Go to Supabase Dashboard > SQL Editor
2. Copy content from `supabase/migrations/20260115_init.sql`
3. Run Query
4. Copy content from `supabase/migrations/20260115_extended_schema.sql`
5. Run Query
