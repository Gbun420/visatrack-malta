# VisaTrack Malta - CI/CD Automation Setup Guide

## Overview

This guide walks you through enabling continuous integration and continuous deployment (CI/CD) automation for VisaTrack Malta. Once configured, every `git push` to the repository will automatically:

1. Run linting and code quality checks
2. Execute automated tests
3. Build the application
4. Deploy to Vercel (production on main, preview on PRs)
5. Post deployment status to GitHub

---

## Prerequisites

Before starting, ensure you have:

- **GitHub Repository Access** - https://github.com/Gbun420/visatrack-malta
- **Vercel Account** - https://vercel.com (free tier is sufficient)
- **Supabase Project** - Already configured with VisaTrack Malta
- **Administrator Rights** on both GitHub repo and Vercel project

---

## Step 1: Link Project with Vercel Locally

### 1a: Install Vercel CLI

```bash
npm i -g vercel
```

### 1b: Link Your Project

```bash
cd visatrack-malta
vercel link
```

**Interactive prompts will appear:**

```
? Set up and deploy "~/visatrack-malta"? [Y/n] Y
? Which scope do you want to deploy to? [Gbun420]
? Link to existing project? [y/N] y
? What's the name of your existing project? visatrack-malta
? Linked to gbun420/visatrack-malta (created .vercel)
```

### 1c: Verify the Link

Check that `.vercel/project.json` was created:

```bash
cat .vercel/project.json
```

Expected output:
```json
{
  "projectId": "prj_xxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxx"
}
```

**Save these values - you'll need them in Step 2.**

---

## Step 2: Generate GitHub Secrets

### 2a: Create Vercel Token

1. Go to **Vercel Dashboard** → **Settings** → **Tokens**
2. Click **Create Token**
3. Enter name: `github-action-token`
4. Set scope: **Full Account** (recommended for CI/CD)
5. Click **Create**
6. **Copy the token immediately** (you won't see it again)

### 2b: Get Supabase Credentials

1. Go to **Supabase Dashboard** → Your project → **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2c: Extract Vercel IDs from `.vercel/project.json`

```bash
cat .vercel/project.json
```

Note down:
- `projectId` → `VERCEL_PROJECT_ID`
- `orgId` → `VERCEL_ORG_ID`

---

## Step 3: Add GitHub Secrets

### 3a: Navigate to Repository Settings

1. Go to your GitHub repo: https://github.com/Gbun420/visatrack-malta
2. Click **Settings** (top menu)
3. In left sidebar, click **Secrets and variables** → **Actions**

### 3b: Add Each Secret

Click **"New repository secret"** for each of the following:

#### Secret 1: VERCEL_TOKEN
- **Name:** `VERCEL_TOKEN`
- **Value:** *(paste your Vercel token from Step 2a)*
- Click **Add secret**

#### Secret 2: VERCEL_ORG_ID
- **Name:** `VERCEL_ORG_ID`
- **Value:** *(paste your org ID from Step 2c, looks like `team_xxxxx`)*
- Click **Add secret**

#### Secret 3: VERCEL_PROJECT_ID
- **Name:** `VERCEL_PROJECT_ID`
- **Value:** *(paste your project ID from Step 2c, looks like `prj_xxxxx`)*
- Click **Add secret**

#### Secret 4: NEXT_PUBLIC_SUPABASE_URL
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** *(paste your Supabase URL from Step 2b)*
- Click **Add secret**

#### Secret 5: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** *(paste your Supabase anon key from Step 2b)*
- Click **Add secret**

### 3c: Verify All Secrets Are Added

Your secrets page should now show all 5 secrets:

```
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ NEXT_PUBLIC_SUPABASE_URL
✓ VERCEL_ORG_ID
✓ VERCEL_PROJECT_ID
✓ VERCEL_TOKEN
```

---

## Step 4: Commit and Push to Trigger Deployment

### 4a: Prepare Local Environment

```bash
# Ensure you're on the identity branch
git branch

# Or switch to it
git checkout identity
```

### 4b: Create a Test Commit

```bash
# Add a small change or just commit current state
echo "# Automation enabled" >> README.md

# Stage changes
git add README.md

# Commit
git commit -m "Enable CI/CD automation with GitHub Actions and Vercel"
```

### 4c: Push to GitHub

```bash
git push origin identity
```

### 4d: Watch the Deployment

1. Go to GitHub repo → **Actions** tab
2. You should see a new workflow run: "Deploy to Vercel"
3. Click on it to see detailed logs
4. Wait for all steps to complete (typically 2-5 minutes)

**Expected workflow steps:**

```
✓ Checkout code
✓ Setup Node.js
✓ Install dependencies
✓ Run linter
✓ Run tests (if configured)
✓ Build application
✓ Deploy Preview to Vercel (for identity branch)
✓ Comment PR with deployment URL
```

---

## Step 5: Test the Full CI/CD Pipeline

### Test Case 1: Push to identity (Preview Deployment)

```bash
# Make a small code change
echo "test" > test.txt
git add test.txt
git commit -m "Test CI/CD pipeline"
git push origin identity
```

**Expected result:**
- GitHub Actions workflow runs
- Preview deployment created on Vercel
- Check Actions tab for status

### Test Case 2: Create Pull Request

```bash
# Create a feature branch
git checkout -b feature/test-pr
echo "# Feature test" > feature.txt
git add feature.txt
git commit -m "Test PR deployment"
git push origin feature/test-pr
```

**On GitHub:**
1. Go to repository
2. Click **Pull requests**
3. Click **New pull request**
4. Compare: `main` ← `feature/test-pr`
5. Click **Create pull request**

**Expected result:**
- GitHub Actions runs for the PR
- Preview deployment created
- Comment posted on PR with preview URL

### Test Case 3: Merge to main (Production Deployment)

```bash
# Merge PR or push directly to main
git checkout main
git merge feature/test-pr
git push origin main
```

**Expected result:**
- Production deployment to Vercel
- Your app goes live at: `https://visatrack-malta.vercel.app`
- Check Vercel dashboard for status

---

## Workflow Details

### What Happens on Every Push

**For `main` branch (Production):**

1. Code is checked out
2. Node.js 18 environment is set up
3. Dependencies are installed
4. Linting runs (continues on error)
5. Tests run (continues on error)
6. Application is built with environment variables
7. **Production deployment to Vercel** (main branch only)

**For Pull Requests (Preview):**

1-6. Same as above
7. **Preview deployment to Vercel** (temporary URL)
8. Comment posted on PR with preview URL

---

## Viewing Deployment Status

### GitHub Actions

1. Go to repository → **Actions** tab
2. Click on workflow run to see:
   - Step-by-step execution logs
   - Build artifacts
   - Deployment status

### Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on **visatrack-malta** project
3. View:
   - Production deployments
   - Preview deployments
   - Deployment logs
   - Performance metrics

### GitHub PR

1. Open a pull request
2. Scroll to bottom to see:
   - Deployment status check
   - Preview URL in comments

---

## Troubleshooting

### Issue: "VERCEL_TOKEN not found"

**Solution:**
```bash
# Verify secret exists in GitHub
# Go to Settings > Secrets and verify VERCEL_TOKEN is listed

# Regenerate token if needed:
# 1. Go to Vercel Dashboard > Settings > Tokens
# 2. Create new token
# 3. Update GitHub secret
```

### Issue: "Build failed: Cannot find module"

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build

# Push changes
git push origin identity
```

### Issue: "Deployment stuck at 'pending'"

**Solution:**
```bash
# Check GitHub Actions logs
# Go to Actions > Click on the stuck workflow
# Scroll down to see error messages

# Common causes:
# - Incorrect environment variables
# - Supabase connection issue
# - Build timeout (increase in Vercel settings)
```

### Issue: "Preview URL not posted to PR"

**Solution:**
```bash
# This is non-critical (continues on error in workflow)
# Deployment still succeeds, just no comment
# Check Vercel dashboard for preview URL
```

---

## Disabling Automation

If you need to temporarily disable automatic deployments:

### Option 1: Disable GitHub Actions (Temporary)

1. Go to Settings → Actions → General
2. Uncheck "Enable local and third party Actions for this repository"
3. Click Save

### Option 2: Delete Secrets (Permanent)

1. Go to Settings → Secrets and variables → Actions
2. Delete each secret
3. Delete `.vercel` folder locally and `.vercelignore` if needed

### Option 3: Modify Workflow Conditions

Edit `.github/workflows/deploy.yml` and change:

```yaml
on:
  push:
    branches:
      - main  # Only deploy main
      # - identity  # Comment this out
```

---

## Next Steps

✅ **CI/CD is now automated!**

Next, consider:

1. **Configure Pre-commit Hooks** - Catch errors before they reach GitHub
2. **Set Up Error Tracking** - Integrate Sentry for error monitoring
3. **Configure Email Notifications** - Get alerted on failed deployments
4. **Set Branch Protection Rules** - Require successful CI before merging to main

### Set Branch Protection Rules

1. Go to Settings → Branches
2. Click **Add rule** under "Branch protection rules"
3. Branch name: `main`
4. Check:
   - Require a pull request before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
5. Click **Create**

---

## Support

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

## Checklist

Before you're done, verify:

- [ ] Vercel CLI linked locally (`vercel link` completed)
- [ ] `.vercel/project.json` created and contains projectId/orgId
- [ ] All 5 GitHub secrets added
- [ ] Test push to identity branch triggered workflow
- [ ] Workflow completed successfully in Actions tab
- [ ] Application deployed and accessible on Vercel
- [ ] Environment variables working correctly in deployed app
- [ ] Database connection working in production

---

**Version:** 1.0.0
**Last Updated:** January 2026
**Status:** ✅ Ready for Production
