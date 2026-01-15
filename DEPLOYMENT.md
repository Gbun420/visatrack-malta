# VisaTrack Malta - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying VisaTrack Malta using **Gemini CLI**, a powerful tool for managing full-stack applications. The deployment includes:

- Backend API (Next.js on Vercel)
- Frontend (Next.js on Vercel)
- Database (Supabase PostgreSQL)
- Environment configuration
- Database schema initialization
- Row-Level Security (RLS) policies

---

## Prerequisites

Before deploying, ensure you have:

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **npm or yarn** (v8 or higher)
   ```bash
   npm --version
   ```

3. **Gemini CLI** installed globally
   ```bash
   npm install -g @google/generative-ai-cli
   ```

4. **Git** (v2.0 or higher)
   ```bash
   git --version
   ```

5. **GitHub Account** with repository access
6. **Vercel Account** for hosting (sign up at vercel.com)
7. **Supabase Account** with an active project
8. **Google Cloud Account** with Gemini API access

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/Gbun420/visatrack-malta.git
cd visatrack-malta
```

## Step 2: Install Dependencies

```bash
npm install
```

**Or using yarn:**
```bash
yarn install
```

---

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your configuration:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://ypouhqwqajhtnbmwtanv.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Vercel Configuration
   VERCEL_TOKEN=your_vercel_token
   
   # Gemini Configuration
   GOOGLE_API_KEY=your_google_api_key
   
   # App Configuration
   APP_ENV=production
   LOG_LEVEL=info
   ```

**To get your Supabase credentials:**
- Go to Supabase Dashboard > Settings > API Keys
- Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `Service Role Key` for sensitive operations

**To get your Vercel token:**
- Go to Vercel Dashboard > Settings > Tokens
- Create a new token and copy it

---

## Step 4: Initialize Database Schema

### Option A: Using Supabase Dashboard

1. Navigate to Supabase Dashboard for your project
2. Go to "SQL Editor"
3. Create a new query and copy contents from `sql/01_create_schema.sql`
4. Execute the query
5. Create another query with contents from `sql/02_enable_rls_policies.sql`
6. Execute the query

### Option B: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref ypouhqwqajhtnbmwtanv

# Run migrations
supabase db push
```

### Schema Initialization

The database schema includes the following tables:

- **employees**: Core employee records
- **visas**: Visa and work permit information
- **documents**: Document storage metadata
- **visa_alerts**: Automated visa expiration alerts
- **audit_logs**: Compliance and audit trail
- **profiles**: User profile management

---

## Step 5: Enable Row-Level Security (RLS)

RLS policies are automatically applied when running `sql/02_enable_rls_policies.sql`. These policies ensure:

- Users can only view their own company's data
- Employees can view limited information about their own profiles
- Admins have full access to company data
- Sensitive data is protected from unauthorized access

---

## Step 6: Deploy with Gemini CLI

### Step 6a: Initialize Gemini Project

```bash
gemini init visatrack-malta
```

Respond to prompts:
- **Project name**: VisaTrack Malta
- **Framework**: Next.js
- **Database**: Supabase
- **Hosting**: Vercel

### Step 6b: Configure Deployment Settings

Create or update `gemini.config.json`:

```json
{
  "project": "visatrack-malta",
  "framework": "nextjs",
  "database": {
    "provider": "supabase",
    "url": "${NEXT_PUBLIC_SUPABASE_URL}",
    "key": "${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
  },
  "hosting": {
    "provider": "vercel",
    "token": "${VERCEL_TOKEN}"
  },
  "environment": "production",
  "regions": [
    "eu-west-1"
  ]
}
```

### Step 6c: Deploy Application

```bash
gemini deploy
```

This command will:
1. Build the Next.js application
2. Run tests and linting
3. Upload to Vercel
4. Configure environment variables
5. Set up database connections
6. Initialize RLS policies
7. Deploy to production

### Step 6d: Verify Deployment

```bash
gemini status
```

Expected output:
```
Project: VisaTrack Malta
Status: Deployed
URL: https://visatrack-malta.vercel.app
Database: Connected (Supabase)
Environment: production
Last deployment: 2 minutes ago
```

---

## Step 7: Post-Deployment Configuration

### 7a: Set Up Email Notifications

Email alerts for visa expiration require SMTP configuration:

```env
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@visatrack-malta.com
```

### 7b: Configure Webhook Endpoints

If using external services (e.g., Stripe for payments):

```bash
# Set webhook URL in provider dashboard
https://visatrack-malta.vercel.app/api/webhooks/stripe
https://visatrack-malta.vercel.app/api/webhooks/supabase
```

### 7c: Test API Endpoints

```bash
# Test employee endpoint
curl -X GET https://visatrack-malta.vercel.app/api/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Test visa endpoint
curl -X GET https://visatrack-malta.vercel.app/api/visas \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Step 8: Monitoring and Maintenance

### Monitor Deployment

```bash
# View deployment logs
gemini logs --follow

# Check application health
gemini health

# View performance metrics
gemini metrics
```

### Automated Backups

Supabase automatically backs up your database daily. To access backups:
1. Go to Supabase Dashboard > Backups
2. Restore or download backups as needed

### Update Application

To deploy updates after making code changes:

```bash
# Commit changes
git add .
git commit -m "Feature: Add visa batch import"
git push origin main

# Deploy
gemini deploy
```

---

## Troubleshooting

### Issue: "SUPABASE_SERVICE_ROLE_KEY not found"

**Solution:**
```bash
# Verify .env.local has the key
grep SUPABASE_SERVICE_ROLE_KEY .env.local

# If missing, add it from Supabase Dashboard > Settings > API Keys
```

### Issue: "Deployment failed: Build error"

**Solution:**
```bash
# Clear build cache
rm -rf .next node_modules
npm install
npm run build
```

### Issue: "RLS policies preventing data access"

**Solution:**
1. Check user's company assignment in database
2. Verify RLS policies in Supabase Dashboard > Auth > Policies
3. Test with direct SQL query in SQL Editor

### Issue: "Vercel deployment stuck"

**Solution:**
```bash
# Check Vercel logs
gemini logs --service vercel

# Retry deployment
gemini redeploy
```

---

## Rollback to Previous Version

```bash
# View deployment history
gemini history

# Rollback to specific version
gemini rollback --version v1.0.0
```

---

## Production Checklist

- [ ] Environment variables configured in production
- [ ] Database backups enabled in Supabase
- [ ] RLS policies tested and verified
- [ ] SSL certificate active (automatic with Vercel)
- [ ] CORS policies configured
- [ ] Rate limiting enabled on API endpoints
- [ ] Monitoring and alerting configured
- [ ] Error tracking set up (e.g., Sentry)
- [ ] CDN cache configured
- [ ] Domain mapped to Vercel project

---

## Support and Resources

- **Gemini CLI Documentation**: https://ai.google.dev/docs/gemini-cli
- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Documentation**: https://nextjs.org/docs

---

## Version History

- **v1.0.0** - Initial deployment guide (2024)

---

**Last Updated**: January 2024
**Maintainer**: Gbun420
