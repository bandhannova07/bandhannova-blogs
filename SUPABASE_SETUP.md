# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Name**: bandhannova-blogs
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to India (e.g., Singapore)
5. Click "Create new project"
6. Wait 2-3 minutes for setup

---

## Step 2: Get API Keys

1. In your project dashboard, click **Settings** (gear icon)
2. Click **API** in sidebar
3. Copy these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Update Environment Variables

1. Open `.env.local` file
2. Replace these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. In Supabase dashboard, click **SQL Editor**
2. Click **New query**
3. Copy content from `supabase/migrations/001_create_blogs_table.sql`
4. Paste and click **Run**
5. Repeat for `002_create_storage_bucket.sql`

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## Step 5: Verify Setup

### Check Database Table

1. Go to **Table Editor** in Supabase
2. You should see `blogs` table
3. Check columns: id, title, slug, content, etc.

### Check Storage Bucket

1. Go to **Storage** in Supabase
2. You should see `blog-thumbnails` bucket
3. It should be marked as **Public**

---

## Step 6: Test Connection

Run the development server:

```bash
npm run dev
```

Check console for any Supabase connection errors.

---

## Troubleshooting

### "Invalid API key" error
- Double-check you copied the correct keys
- Make sure no extra spaces in `.env.local`
- Restart dev server after updating env vars

### "Table does not exist" error
- Run the SQL migrations again
- Check Table Editor to verify table exists

### "Storage bucket not found" error
- Run storage migration SQL
- Check Storage section in dashboard

---

## Next Steps

Once setup is complete:
1. ✅ Database table created
2. ✅ Storage bucket created
3. ✅ API keys configured
4. ✅ Connection tested

Ready to implement authentication and blog service! 🚀
