# pitwall-f1-fantasy-web
F1 DecisionIQ - Fantasy Decision Engine

## Waitlist Setup

The landing page waitlist form saves submissions to Supabase through
`/api/waitlist`.

Create the table in Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'Landing Page',
  created_at timestamptz default now()
);
```

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your-secret-key
```

Keep `SUPABASE_SECRET_KEY` server-side only. Do not expose it to client
components or commit it to git.

Local testing:

1. Create `.env.local` with the required variables.
2. Start the app:

```bash
npm run dev
```

3. Submit an email through the landing page waitlist form.
4. Confirm a row appears in the Supabase `waitlist` table with source `Landing Page`.

Deploying to Vercel:

1. Add the same environment variables in the Vercel project settings.
2. Redeploy the project.
3. Submit a test email on the deployed site.
4. Confirm the row appears in the Supabase `waitlist` table.
