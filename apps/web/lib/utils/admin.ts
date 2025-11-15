// Admin utility functions

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false
  // For development, you can set admin emails in env
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
  return adminEmails.includes(email.toLowerCase())
}

export async function checkIsAdmin(userId: string | undefined, email: string | undefined): Promise<boolean> {
  if (!userId) return false
  
  // Check if user email is in admin list
  if (isAdminEmail(email)) return true
  
  // In the future, you can check a database field
  // For now, we'll use email-based admin check
  return false
}

