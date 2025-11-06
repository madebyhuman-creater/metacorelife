// Wishlist Page JavaScript

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    loadWishlist();
});

// Load Wishlist
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('metacore_wishlist') || '[]');
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyState = document.getElementById('emptyWishlist');
    const wishlistCount = document.getElementById('wishlistCount');
    
    wishlistCount.textContent = wishlist.length;
    
    if (wishlist.length === 0) {
        wishlistGrid.style.display = 'none';
        emptyState.style.display = 'block';
        document.querySelector('.wishlist-header').style.display = 'none';
        return;
    }
    
    wishlistGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    document.querySelector('.wishlist-header').style.display = 'flex';
    
    // Get product details
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    
    wishlistGrid.innerHTML = wishlistProducts.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                <div class="product-actions">
                    <button class="action-icon liked" onclick="removeFromWishlist(${product.id})">
                        <span>❤️</span>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <div class="product-price-row">
                    <div class="product-price">$${product.price}</div>
                    <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Remove from Wishlist
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('metacore_wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('metacore_wishlist', JSON.stringify(wishlist));
    
    // Update user data if logged in
    updateUserWishlist(wishlist);
    
    loadWishlist();
    showNotification('Removed from wishlist');
}

// Clear Wishlist
function clearWishlist() {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        localStorage.setItem('metacore_wishlist', JSON.stringify([]));
        
        // Update user data if logged in
        updateUserWishlist([]);
        
        loadWishlist();
        showNotification('Wishlist cleared');
    }
}

// Add to Cart from Wishlist
function addToCartFromWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        addToCart(product, 1);
        showNotification('Added to cart!');
    }
}

// Add All to Cart
function addAllToCart() {
    const wishlist = JSON.parse(localStorage.getItem('metacore_wishlist') || '[]');
    
    if (wishlist.length === 0) {
        showNotification('Your wishlist is empty', 'info');
        return;
    }
    
    wishlist.forEach(productId => {
        const product = products.find(p => p.id === productId);
        if (product) {
            addToCart(product, 1);
        }
    });
    
    showNotification(`Added ${wishlist.length} items to cart!`, 'success');
    updateCartBadge();
}

// Update user wishlist in database
function updateUserWishlist(wishlist) {
    const user = getCurrentUser();
    if (user) {
        const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
            users[userIndex].wishlist = wishlist;
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
    }
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
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
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
