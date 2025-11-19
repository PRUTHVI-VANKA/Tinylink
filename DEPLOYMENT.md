# Deployment Guide

## Vercel + Supabase Deployment

### Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)

### Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. The database migration has already been applied automatically
4. Navigate to Settings > API to get your credentials:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 4: Configure Environment Variables

In Vercel project settings, add these environment variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `BASE_URL` | Your Vercel deployment URL (e.g., `https://your-app.vercel.app`) |

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the deployment to complete
3. Visit your deployed URL

### Step 6: Test

Test the following:

1. Health check: `https://your-app.vercel.app/healthz`
2. Create a link on the dashboard
3. Test the redirect: `https://your-app.vercel.app/[code]`
4. View stats: `https://your-app.vercel.app/code/[code]`

## Database Verification

To verify your Supabase database is set up correctly:

1. Go to Supabase dashboard
2. Navigate to Table Editor
3. You should see a `links` table with these columns:
   - id (uuid)
   - code (text)
   - target_url (text)
   - click_count (int4)
   - last_clicked_at (timestamptz)
   - created_at (timestamptz)
   - updated_at (timestamptz)
   - is_deleted (bool)

4. Check Authentication > Policies
   - You should see 4 policies on the `links` table

## Custom Domain (Optional)

To add a custom domain in Vercel:

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update your DNS records as instructed
5. Update the `BASE_URL` environment variable to your custom domain

## Monitoring

### Vercel Analytics

Enable Vercel Analytics in your project settings for:
- Page views
- Performance metrics
- Error tracking

### Supabase Monitoring

Monitor your database in Supabase dashboard:
- Database size
- API requests
- Active connections

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify Node.js version (should be 18.x or higher)
- Check build logs in Vercel dashboard

### API Errors

- Verify Supabase credentials are correct
- Check Supabase project is active
- Verify RLS policies are enabled

### Redirect Not Working

- Check that the link exists in the database
- Verify the link is not marked as deleted (`is_deleted = false`)
- Check browser console for errors

## Performance Optimization

### Vercel

- Edge Functions are automatically optimized
- Static pages are cached at the edge
- API routes run on serverless functions

### Supabase

- Connection pooling is enabled by default
- Indexes are created for optimal query performance
- RLS policies are optimized for read operations

## Scaling

### Free Tier Limits

**Vercel:**
- 100 GB bandwidth
- 100 hours serverless function execution
- Unlimited projects

**Supabase:**
- 500 MB database size
- 2 GB bandwidth
- 50,000 monthly active users

### Upgrading

If you exceed free tier limits:
- Vercel: Upgrade to Pro ($20/month)
- Supabase: Upgrade to Pro ($25/month)

## Security Best Practices

1. Never commit `.env.local` to version control
2. Rotate API keys regularly
3. Enable 2FA on Vercel and Supabase accounts
4. Monitor Supabase logs for suspicious activity
5. Set up rate limiting if needed (use Vercel Edge Config)

## Backup

Supabase automatically creates daily backups on paid plans. For free tier:

1. Use Supabase CLI to export data regularly:
```bash
supabase db dump -f backup.sql
```

2. Store backups in a secure location

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
