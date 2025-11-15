// Admin check utility

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  
  // Get admin emails from environment variable
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || []
  
  return adminEmails.includes(email.toLowerCase())
}

export async function checkIsAdmin(userId: string | undefined, email: string | undefined | null): Promise<boolean> {
  if (!userId || !email) return false
  
  // Check if user email is in admin list
  return isAdminEmail(email)
}

