# Admin Setup Guide

## How to Set Up Admin Access

### 1. Add Admin Email to Environment Variables

In your `.env.local` file in `apps/web/`, add your admin email(s):

```env
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com,another-admin@example.com
ADMIN_EMAILS=your-email@example.com,another-admin@example.com
```

**Important:** 
- Use comma-separated values for multiple admins
- Both `NEXT_PUBLIC_ADMIN_EMAILS` and `ADMIN_EMAILS` should be set
- `NEXT_PUBLIC_ADMIN_EMAILS` is used in client-side components
- `ADMIN_EMAILS` is used in server-side API routes

### 2. How to Check if You're Admin

#### In Server Components (like dashboard):
```typescript
import { isAdminEmail } from "@/lib/utils/admin-check"

const isAdmin = isAdminEmail(user.email)
```

#### In Client Components:
```typescript
// Check using environment variable
const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
const isAdmin = adminEmails.includes(user.email?.toLowerCase() || '')
```

#### In API Routes:
```typescript
const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
const isAdmin = adminEmails.includes(user.email?.toLowerCase() || '')
```

### 3. Admin Features

When logged in as admin, you'll see:

- **Admin Badge** on your dashboard
- **Admin Panel** quick access card
- **Create Challenge** button in admin dashboard
- **Access to `/admin`** route
- **Access to `/app/challenges/create`** route

### 4. Testing Admin Access

1. Sign up/login with your admin email
2. Check your dashboard - you should see an "Admin" badge
3. You should see an "Admin Panel" card with a link to `/admin`
4. You can access `/admin` to see the admin dashboard
5. You can access `/app/challenges/create` to create challenges

### 5. Regular User vs Admin

**Regular User:**
- Can join challenges
- Can post updates
- Can like/comment
- Can browse marketplace
- **Cannot** create challenges
- **Cannot** access admin dashboard

**Admin:**
- All regular user features
- **Can** create challenges
- **Can** access admin dashboard
- **Can** manage products
- **Can** view analytics
- **Can** moderate content

### 6. Security Notes

- Admin check is currently email-based (simple for development)
- For production, consider adding an `is_admin` field to the `profiles` table
- Always verify admin status on the server-side in API routes
- Never trust client-side admin checks alone

### 7. Future: Database-Based Admin

To make it more secure, you can add an `is_admin` field to profiles:

```sql
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Set specific users as admin
UPDATE profiles SET is_admin = TRUE WHERE email = 'admin@example.com';
```

Then update the admin check function to query the database instead of using environment variables.

