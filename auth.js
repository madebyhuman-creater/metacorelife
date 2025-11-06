// Authentication System
const AUTH_STORAGE_KEY = 'metacore_user';
const USERS_STORAGE_KEY = 'metacore_users';

// Switch between login and register forms
function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
}

function showRegister() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get all users
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Create session
        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            loggedInAt: new Date().toISOString()
        };
        
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        
        // Merge cart and wishlist
        mergeUserData(user.id);
        
        showNotification('Welcome back, ' + user.name + '!', 'success');
        
        // Redirect to previous page or dashboard
        const redirectUrl = localStorage.getItem('redirect_after_login') || 'dashboard.html';
        localStorage.removeItem('redirect_after_login');
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateUserId(),
        name: name,
        email: email,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        cart: [],
        wishlist: [],
        orders: []
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    // Auto login
    const session = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        loggedInAt: new Date().toISOString()
    };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    
    showNotification('Account created successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Social Login (Demo)
function socialLogin(provider) {
    showNotification(`${provider} login coming soon!`, 'info');
    
    // Demo: Auto-create account
    const demoUser = {
        id: generateUserId(),
        name: 'Demo User',
        email: `demo@${provider}.com`,
        password: '',
        createdAt: new Date().toISOString(),
        cart: [],
        wishlist: [],
        orders: []
    };
    
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    users.push(demoUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    const session = {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        loggedInAt: new Date().toISOString()
    };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Generate User ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Merge guest cart/wishlist with user account
function mergeUserData(userId) {
    const guestCart = JSON.parse(localStorage.getItem('metacore_cart') || '[]');
    const guestWishlist = JSON.parse(localStorage.getItem('metacore_wishlist') || '[]');
    
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        // Merge cart
        if (guestCart.length > 0) {
            const existingCart = users[userIndex].cart || [];
            
            guestCart.forEach(guestItem => {
                const existingItem = existingCart.find(item => item.id === guestItem.id);
                if (existingItem) {
                    existingItem.quantity += guestItem.quantity;
                } else {
                    existingCart.push(guestItem);
                }
            });
            
            users[userIndex].cart = existingCart;
        }
        
        // Merge wishlist
        if (guestWishlist.length > 0) {
            const existingWishlist = users[userIndex].wishlist || [];
            guestWishlist.forEach(itemId => {
                if (!existingWishlist.includes(itemId)) {
                    existingWishlist.push(itemId);
                }
            });
            users[userIndex].wishlist = existingWishlist;
        }
        
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        
        // Update local storage
        localStorage.setItem('metacore_cart', JSON.stringify(users[userIndex].cart));
        localStorage.setItem('metacore_wishlist', JSON.stringify(users[userIndex].wishlist));
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem(AUTH_STORAGE_KEY) !== null;
}

// Get current user
function getCurrentUser() {
    const session = localStorage.getItem(AUTH_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
}

// Logout
function logout() {
    // Save cart and wishlist to user account
    const user = getCurrentUser();
    if (user) {
        const cart = JSON.parse(localStorage.getItem('metacore_cart') || '[]');
        const wishlist = JSON.parse(localStorage.getItem('metacore_wishlist') || '[]');
        
        const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
            users[userIndex].cart = cart;
            users[userIndex].wishlist = wishlist;
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
    }
    
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showNotification('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Require login for certain pages
function requireLogin() {
    if (!isLoggedIn()) {
        localStorage.setItem('redirect_after_login', window.location.pathname + window.location.search);
        window.location.href = 'auth.html';
    }
}

// Load user data when logged in
function loadUserData() {
    const user = getCurrentUser();
    if (user) {
        const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const userData = users.find(u => u.id === user.id);
        
        if (userData) {
            // Load cart
            if (userData.cart && userData.cart.length > 0) {
                localStorage.setItem('metacore_cart', JSON.stringify(userData.cart));
            }
            
            // Load wishlist
            if (userData.wishlist && userData.wishlist.length > 0) {
                localStorage.setItem('metacore_wishlist', JSON.stringify(userData.wishlist));
            }
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const colors = {
        success: 'linear-gradient(135deg, #10B981, #34D399)',
        error: 'linear-gradient(135deg, #EF4444, #F87171)',
        info: 'linear-gradient(135deg, #3B82F6, #60A5FA)'
    };
    
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
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
if (!document.getElementById('auth-animations')) {
    const style = document.createElement('style');
    style.id = 'auth-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadUserData);
