// Supabase Configuration
// IMPORTANT: Replace these with YOUR Supabase project credentials
// Find them in: Supabase Dashboard → Settings → API

const SUPABASE_URL = 'https://dqbfsltlylbyfgoztgdq.supabase.co' // Replace with your URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYmZzbHRseWxieWZnb3p0Z2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTc1OTYsImV4cCI6MjA3ODEzMzU5Nn0.Gk6kQj6CvJIpqO8nCYxPAKMrS2OykS-MVC1XaPploZs'  // Replace with your anon key

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// PayPal Configuration (if using PayPal)
const paypalClientId = 'YOUR_PAYPAL_CLIENT_ID'; // Optional

// Helper function to check if user is logged in
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Helper function to require login
async function requireLogin() {
    const user = await getCurrentUser()
    if (!user && !window.location.pathname.includes('auth.html')) {
        localStorage.setItem('redirect_after_login', window.location.href)
        window.location.href = 'auth.html'
    }
    return user
}

console.log('✅ Supabase initialized')
