# MetaCore Life - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migration**
   - In Supabase dashboard, go to SQL Editor
   - Copy and paste the contents of `supabase/migrations/20240101000000_initial_schema.sql`
   - Run the migration

3. **Set Up Storage Bucket**
   - Go to Storage in Supabase dashboard
   - Create a new bucket named `uploads`
   - Set it to public (or configure RLS policies)

4. **Configure OAuth (Optional)**
   - Go to Authentication > Providers
   - Enable Google and/or Apple
   - Add your OAuth credentials

### 3. Configure Environment Variables

Create `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another-admin@example.com
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

**Note:** Add your admin email(s) to `NEXT_PUBLIC_ADMIN_EMAILS` and `ADMIN_EMAILS` (comma-separated) to allow challenge creation. Only these emails can create challenges.

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## Testing the Application

### 1. Create an Account
- Go to `/register`
- Sign up with email/password or OAuth

### 2. Create a Challenge
- Go to `/app/challenges/create`
- Fill in challenge details
- Add daily tasks
- Create the challenge

### 3. Join a Challenge
- Browse challenges at `/app/challenges`
- Click "Join Challenge"
- Complete daily check-ins

### 4. Explore Social Features
- View your feed at `/app/feed`
- Follow users at `/app/discover`
- Like and comment on posts

### 5. Browse Marketplace
- Visit `/shop`
- Browse products by category
- Click on products to view details

### 6. Admin Dashboard
- Visit `/admin`
- View analytics
- Manage challenges and products

## Common Issues

### Database Connection Error
- Verify your Supabase URL and anon key in `.env.local`
- Ensure the migration has been run

### OAuth Not Working
- Check OAuth credentials in Supabase dashboard
- Verify redirect URLs are configured correctly

### File Upload Not Working
- Ensure the `uploads` storage bucket exists
- Check bucket permissions

### RLS Policy Errors
- Verify Row Level Security policies are set up correctly
- Check that users are authenticated

## Next Steps

1. **Customize Branding**
   - Update colors in `tailwind.config.ts`
   - Modify logo and branding

2. **Add Email Service**
   - Set up Resend or similar
   - Update `/api/waitlist/route.ts`

3. **Configure Production**
   - Set up production Supabase project
   - Configure production environment variables
   - Deploy to Vercel or similar

4. **Add More Features**
   - Real-time notifications
   - Video upload support
   - Payment integration
   - Advanced analytics

## Support

For issues or questions, refer to the main README.md file.

