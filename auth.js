// Authentication with Supabase - Production Ready

// Switch between login and register forms
function showLogin() {
    document.getElementById('loginForm').classList.add('active')
    document.getElementById('registerForm').classList.remove('active')
}

function showRegister() {
    document.getElementById('registerForm').classList.add('active')
    document.getElementById('loginForm').classList.remove('active')
}

// Handle Registration
async function handleRegister(event) {
    event.preventDefault()
    
    const name = document.getElementById('registerName').value
    const email = document.getElementById('registerEmail').value
    const password = document.getElementById('registerPassword').value
    const confirmPassword = document.getElementById('registerPasswordConfirm').value
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error')
        return
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error')
        return
    }
    
    try {
        // Register with Supabase
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        })
        
        if (error) throw error
        
        // Create user profile
        if (data.user) {
            await supabase.from('user_profiles').insert({
                id: data.user.id,
                full_name: name
            })
        }
        
        showNotification('Account created! Check your email to verify.', 'success')
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'auth.html'
        }, 2000)
        
    } catch (error) {
        console.error('Registration error:', error)
        showNotification(error.message, 'error')
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault()
    
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        
        if (error) throw error
        
        showNotification('Welcome back!', 'success')
        
        // Redirect to previous page or dashboard
        const redirectUrl = localStorage.getItem('redirect_after_login') || 'dashboard.html'
        localStorage.removeItem('redirect_after_login')
        
        setTimeout(() => {
            window.location.href = redirectUrl
        }, 1000)
        
    } catch (error) {
        console.error('Login error:', error)
        showNotification('Invalid email or password', 'error')
    }
}

// Social Login (Google)
async function socialLogin(provider) {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider, // 'google' or 'facebook'
            options: {
                redirectTo: window.location.origin + '/dashboard.html'
            }
        })
        
        if (error) throw error
        
    } catch (error) {
        console.error('Social login error:', error)
        showNotification('Social login coming soon!', 'info')
    }
}

// Logout
async function logout() {
    try {
        await supabase.auth.signOut()
        showNotification('Logged out successfully', 'success')
        
        setTimeout(() => {
            window.location.href = 'index.html'
        }, 1000)
        
    } catch (error) {
        console.error('Logout error:', error)
        showNotification('Error logging out', 'error')
    }
}

// Check Auth State on Page Load
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event, session)
    
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user)
    }
    
    if (event === 'SIGNED_OUT') {
        console.log('User signed out')
    }
})

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    
    const colors = {
        success: 'linear-gradient(135deg, #10B981, #34D399)',
        error: 'linear-gradient(135deg, #EF4444, #F87171)',
        info: 'linear-gradient(135deg, #3B82F6, #60A5FA)'
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease'
        setTimeout(() => notification.remove(), 300)
    }, 3000)
}

// Add animation styles
if (!document.getElementById('auth-animations')) {
    const style = document.createElement('style')
    style.id = 'auth-animations'
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `
    document.head.appendChild(style)
}
