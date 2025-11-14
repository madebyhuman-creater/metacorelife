// ADD THESE FUNCTIONS TO YOUR marketplace.js

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', async function() {
    await initializeAuth();
    await loadProducts();
    await updateCartBadge();
    await updateWishlistBadge();
});

// Initialize authentication state
async function initializeAuth() {
    const user = await getCurrentUser();
    updateProfileUI(user);
}

// Update Profile UI based on login status
function updateProfileUI(user) {
    const guestMenu = document.getElementById('guestMenu');
    const loggedInMenu = document.getElementById('loggedInMenu');
    const profileIcon = document.getElementById('profileIcon');
    const profileButton = document.getElementById('profileButton');
    
    if (user) {
        // User is logged in
        guestMenu.style.display = 'none';
        loggedInMenu.style.display = 'block';
        
        // Update profile info
        const userName = user.user_metadata?.full_name || user.email.split('@')[0];
        const userEmail = user.email;
        
        document.getElementById('profileName').textContent = userName;
        document.getElementById('profileEmail').textContent = userEmail;
        
        // Set avatar initial
        const initial = userName.charAt(0).toUpperCase();
        document.getElementById('avatarInitial').textContent = initial;
        
        // Change icon to show logged in
        profileIcon.textContent = initial;
        profileButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        profileButton.style.color = 'white';
        
    } else {
        // User is not logged in (guest)
        guestMenu.style.display = 'block';
        loggedInMenu.style.display = 'none';
        
        // Reset to default icon
        profileIcon.textContent = '👤';
        profileButton.style.background = '';
        profileButton.style.color = '';
    }
}

// Toggle Profile Menu
function toggleProfileMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const profileMenu = document.getElementById('profileMenu');
    const profileDropdown = event.target.closest('.profile-dropdown');
    
    if (!profileDropdown && profileMenu) {
        profileMenu.classList.remove('active');
    }
});

// Guest checkout warning
function guestCheckoutWarning() {
    event.preventDefault();
    if (confirm('You need to sign in to checkout. Would you like to sign in now?')) {
        localStorage.setItem('redirect_after_login', window.location.href);
        window.location.href = 'auth.html';
    }
}

// Update Wishlist Badge
async function updateWishlistBadge() {
    const user = await getCurrentUser();
    const badge = document.getElementById('wishlistBadge');
    
    if (!user) {
        badge.textContent = '0';
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('wishlist_items')
            .select('id')
            .eq('user_id', user.id);
        
        if (error) throw error;
        
        badge.textContent = data.length;
    } catch (error) {
        console.error('Error updating wishlist badge:', error);
        badge.textContent = '0';
    }
}

// Modified Add to Cart - Check if guest is trying to checkout
async function addToCart(productId, quantity) {
    const user = await getCurrentUser();
    
    try {
        if (!user) {
            // Guest user - save to localStorage
            let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
            const existingItem = guestCart.find(item => item.product_id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                const product = products.find(p => p.id === productId);
                guestCart.push({
                    product_id: productId,
                    quantity: quantity,
                    product: product
                });
            }
            
            localStorage.setItem('guest_cart', JSON.stringify(guestCart));
            showNotification('Added to cart! Sign in to save your cart.');
            updateCartBadge();
            return;
        }
        
        // Logged in user - save to Supabase
        const { data, error } = await supabase
            .from('cart_items')
            .upsert({ 
                user_id: user.id, 
                product_id: productId,
                quantity: quantity
            }, {
                onConflict: 'user_id,product_id',
                returning: 'representation'
            });
        
        if (error) throw error;
        
        showNotification('Added to cart!', 'success');
        updateCartBadge();
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart', 'error');
    }
}

// Modified Checkout - Require login
async function checkout() {
    const cartItems = await getCartItems();
    
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const user = await getCurrentUser();
    
    if (!user) {
        // User is not logged in
        const proceed = confirm('You need to sign in to complete your purchase. Sign in now?');
        if (proceed) {
            localStorage.setItem('redirect_after_login', 'marketplace.html#cart');
            window.location.href = 'auth.html';
        }
        return;
    }
    
    // Continue with checkout for logged in user
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = 9.99;
    const total = subtotal + shipping;
    
    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
    
    const checkoutItems = document.getElementById('checkoutItems');
    checkoutItems.innerHTML = cartItems.map(item => `
        <div class="checkout-item">
            <span>${item.product.name} x${item.quantity}</span>
            <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    initializePayPal(total, cartItems);
    
    document.getElementById('checkoutModal').classList.add('active');
    toggleCart();
}

// Logout function
async function logout() {
    event.preventDefault();
    
    const confirmed = confirm('Are you sure you want to logout?');
    if (!confirmed) return;
    
    try {
        await supabase.auth.signOut();
        localStorage.removeItem('guest_cart');
        localStorage.removeItem('remember_me');
        
        showNotification('Logged out successfully');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Error logging out', 'error');
    }
}

// Modified toggleWishlist - Require login
async function toggleWishlist(button, productId) {
    const user = await getCurrentUser();
    
    if (!user) {
        const proceed = confirm('You need to sign in to save items to wishlist. Sign in now?');
        if (proceed) {
            localStorage.setItem('redirect_after_login', window.location.href);
            window.location.href = 'auth.html';
        }
        return;
    }
    
    const isLiked = button.classList.contains('liked');
    
    try {
        if (isLiked) {
            await supabase
                .from('wishlist_items')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);
            
            button.classList.remove('liked');
            button.querySelector('.heart').textContent = '🤍';
            showNotification('Removed from wishlist');
        } else {
            await supabase
                .from('wishlist_items')
                .insert({
                    user_id: user.id,
                    product_id: productId
                });
            
            button.classList.add('liked');
            button.querySelector('.heart').textContent = '❤️';
            showNotification('Added to wishlist!', 'success');
        }
        
        await updateWishlistBadge();
        
    } catch (error) {
        console.error('Wishlist error:', error);
        showNotification('Error updating wishlist', 'error');
    }
}