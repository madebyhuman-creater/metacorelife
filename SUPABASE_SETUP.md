# Supabase Setup for Development

## Disable Email Confirmation (For Development)

By default, Supabase requires users to verify their email before they can log in. For development, you can disable this:

### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to your project at [supabase.com](https://supabase.com)

2. **Open Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "Providers" or go to "Settings" → "Auth"

3. **Disable Email Confirmation**
   - Find the "Email" provider settings
   - Look for "Enable email confirmations" toggle
   - **Turn it OFF** for development
   - Save changes

4. **Alternative: Use Magic Link (No Password)**
   - You can also enable "Magic Link" authentication
   - This sends a login link via email (no password needed)

### For Production:

- **Keep email confirmation ENABLED** for security
- Users will receive a confirmation email after signup
- They must click the link in the email before logging in

## Testing Login Issues

If you're still having trouble logging in:

1. **Check the error message** - The login page now shows more detailed error messages
2. **Verify your credentials** - Make sure email and password are correct
3. **Check Supabase logs** - Go to Logs → Auth in Supabase dashboard to see what's happening
4. **Reset password** - If needed, use Supabase's password reset feature

## Quick Fix: Reset User Password

If you need to reset a user's password:

1. Go to Supabase Dashboard → Authentication → Users
2. Find the user
3. Click "..." menu → "Reset Password"
4. User will receive a password reset email

## Development vs Production

**Development:**
- Email confirmation: OFF
- Allows immediate login after signup
- Faster iteration

**Production:**
- Email confirmation: ON
- Better security
- Prevents fake accounts

