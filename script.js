// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth Scroll Functions
function scrollToEmail() {
    document.getElementById('email').scrollIntoView({ behavior: 'smooth' });
}

function scrollToPillars() {
    document.getElementById('pillars').scrollIntoView({ behavior: 'smooth' });
}

// Formspree Form Submission Handler
function handleFormspreeSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value;
    const successMessage = document.getElementById('successMessage');
    const submitButton = document.getElementById('submitBtn');

    // Disable button during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    // Submit to Formspree
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Success!
            successMessage.textContent = '✓ Success! You\'re on the waitlist. Check your email soon!';
            successMessage.style.background = 'linear-gradient(135deg, #D1FAE5, #A7F3D0)';
            successMessage.style.color = '#065F46';
            successMessage.classList.add('show');
            
            // Clear form
            emailInput.value = '';
            
            // Also store locally as backup
            storeEmailLocally(email);
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        successMessage.textContent = '❌ Something went wrong. Please try again.';
        successMessage.style.background = 'linear-gradient(135deg, #FEE2E2, #FECACA)';
        successMessage.style.color = '#991B1B';
        successMessage.classList.add('show');
    })
    .finally(() => {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = 'Get Early Access';
    });
}

// Store email locally as backup
function storeEmailLocally(email) {
    const existingEmails = JSON.parse(localStorage.getItem('metacore_emails') || '[]');
    
    if (!existingEmails.find(entry => entry.email === email)) {
        const newEntry = {
            email: email,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        existingEmails.push(newEntry);
        localStorage.setItem('metacore_emails', JSON.stringify(existingEmails));
        
        console.log('✅ Email stored locally:', email);
        console.log('📧 Total local subscribers:', existingEmails.length);
    }
}

// Function to export local emails (call from console: exportEmails())
function exportEmails() {
    const emails = JSON.parse(localStorage.getItem('metacore_emails') || '[]');
    console.log('📧 Exporting', emails.length, 'emails...');
    
    let csv = 'Email,Date,Time,Timestamp\n';
    emails.forEach(entry => {
        csv += `${entry.email},${entry.date},${entry.time},${entry.timestamp}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metacore-emails-' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    
    console.log('✅ Export complete!');
    return emails;
}

// Function to view all local emails (call from console: viewEmails())
function viewEmails() {
    const emails = JSON.parse(localStorage.getItem('metacore_emails') || '[]');
    console.table(emails);
    return emails;
}

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Add these functions to your existing script.js file

// ==================== AUTHENTICATION FUNCTIONS ====================

// Get current logged in user
async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Get current session
async function getCurrentSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

// Check if user is logged in
async function isUserLoggedIn() {
    const user = await getCurrentUser();
    return user !== null;
}

// Require login (redirect to auth page if not logged in)
async function requireLogin() {
    const user = await getCurrentUser();
    if (!user) {
        localStorage.setItem('redirect_after_login', window.location.href);
        window.location.href = 'auth.html';
        return false;
    }
    return true;
}

// Logout function
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Clear local storage
        localStorage.removeItem('guest_cart');
        localStorage.removeItem('remember_me');
        localStorage.removeItem('redirect_after_login');
        
        // Redirect to home
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    }
}

// ==================== USER PROFILE FUNCTIONS ====================

// Get user profile from database
async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

// Update user profile
async function updateUserProfile(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating profile:', error);
        return null;
    }
}

// ==================== CART FUNCTIONS ====================

// Get user cart items
async function getUserCart(userId) {
    try {
        const { data, error } = await supabase
            .from('cart_items')
            .select('*, products(*)')
            .eq('user_id', userId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
    }
}

// Add item to cart (database)
async function addToUserCart(userId, productId, quantity = 1) {
    try {
        const { data, error } = await supabase
            .from('cart_items')
            .upsert({
                user_id: userId,
                product_id: productId,
                quantity: quantity
            }, {
                onConflict: 'user_id,product_id'
            })
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return null;
    }
}

// Remove item from cart
async function removeFromUserCart(userId, productId) {
    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return false;
    }
}

// Update cart item quantity
async function updateCartItemQuantity(userId, productId, quantity) {
    try {
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity: quantity })
            .eq('user_id', userId)
            .eq('product_id', productId)
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        return null;
    }
}

// Clear entire cart
async function clearUserCart(userId) {
    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
}

// ==================== WISHLIST FUNCTIONS ====================

// Get user wishlist
async function getUserWishlist(userId) {
    try {
        const { data, error } = await supabase
            .from('wishlist_items')
            .select('*, products(*)')
            .eq('user_id', userId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
    }
}

// Add to wishlist
async function addToWishlist(userId, productId) {
    try {
        const { data, error } = await supabase
            .from('wishlist_items')
            .insert({
                user_id: userId,
                product_id: productId
            })
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return null;
    }
}

// Remove from wishlist
async function removeFromWishlist(userId, productId) {
    try {
        const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return false;
    }
}

// Check if product is in wishlist
async function isInWishlist(userId, productId) {
    try {
        const { data, error } = await supabase
            .from('wishlist_items')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();
        
        return data !== null;
    } catch (error) {
        return false;
    }
}

// ==================== ORDER FUNCTIONS ====================

// Get user orders
async function getUserOrders(userId) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Create new order
async function createOrder(userId, orderData) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                total: orderData.total,
                subtotal: orderData.subtotal,
                shipping: orderData.shipping,
                payment_id: orderData.payment_id,
                payment_method: orderData.payment_method,
                status: 'processing'
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}

// Add order items
async function addOrderItems(orderId, items) {
    try {
        const orderItems = items.map(item => ({
            order_id: orderId,
            product_id: item.product_id,
            product_name: item.product_name,
            product_price: item.product_price,
            quantity: item.quantity
        }));
        
        const { data, error } = await supabase
            .from('order_items')
            .insert(orderItems)
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding order items:', error);
        return null;
    }
}

// ==================== GUEST CART FUNCTIONS ====================

// Get guest cart from localStorage
function getGuestCart() {
    try {
        return JSON.parse(localStorage.getItem('guest_cart') || '[]');
    } catch (error) {
        console.error('Error getting guest cart:', error);
        return [];
    }
}

// Save guest cart to localStorage
function saveGuestCart(cart) {
    try {
        localStorage.setItem('guest_cart', JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error('Error saving guest cart:', error);
        return false;
    }
}

// Add to guest cart
function addToGuestCart(product, quantity = 1) {
    const cart = getGuestCart();
    const existingItem = cart.find(item => item.product_id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            product_id: product.id,
            quantity: quantity,
            product: product
        });
    }
    
    saveGuestCart(cart);
    return cart;
}

// Remove from guest cart
function removeFromGuestCart(productId) {
    let cart = getGuestCart();
    cart = cart.filter(item => item.product_id !== productId);
    saveGuestCart(cart);
    return cart;
}

// Clear guest cart
function clearGuestCart() {
    localStorage.removeItem('guest_cart');
}

// Migrate guest cart to user cart (after login)
async function migrateGuestCartToUser(userId) {
    const guestCart = getGuestCart();
    
    if (guestCart.length === 0) return;
    
    try {
        for (const item of guestCart) {
            await addToUserCart(userId, item.product_id, item.quantity);
        }
        
        clearGuestCart();
        return true;
    } catch (error) {
        console.error('Error migrating cart:', error);
        return false;
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const colors = {
        success: 'linear-gradient(135deg, #10B981, #34D399)',
        error: 'linear-gradient(135deg, #EF4444, #F87171)',
        info: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
        warning: 'linear-gradient(135deg, #F59E0B, #FBBF24)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Add animation
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ==================== INIT ON PAGE LOAD ====================

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user);
        // Migrate guest cart if exists
        if (session.user) {
            migrateGuestCartToUser(session.user.id);
        }
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
    }
});