// Dashboard JavaScript

// Require login
requireLogin();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadStats();
    loadCartPreview();
    loadWishlistPreview();
    loadRecommendations();
    updateCartBadge();
});

// Load User Info
function loadUserInfo() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.name.split(' ')[0];
        document.getElementById('userEmail').textContent = user.email;
        
        // Calculate member since date
        const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const userData = users.find(u => u.id === user.id);
        
        if (userData && userData.createdAt) {
            const date = new Date(userData.createdAt);
            const options = { year: 'numeric', month: 'long' };
            document.getElementById('memberSince').textContent = date.toLocaleDateString('en-US', options);
        }
    }
}

// Load Stats
function loadStats() {
    const cart = JSON.parse(localStorage.getItem('metacore_cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('metacore_wishlist') || '[]');
    
    // Cart items count
    const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartItemsCount').textContent = cartItemsCount;
    
    // Wishlist items count
    document.getElementById('wishlistItemsCount').textContent = wishlist.length;
    
    // Orders count (from user data)
    const user = getCurrentUser();
    if (user) {
        const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const userData = users.find(u => u.id === user.id);
        
        if (userData && userData.orders) {
            document.getElementById('ordersCount').textContent = userData.orders.length;
            
            // Calculate total spent
            const totalSpent = userData.orders.reduce((sum, order) => sum + order.total, 0);
            document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
            
            // Load recent orders
            loadRecentOrders(userData.orders);
        }
    }
}

// Load Recent Orders
function loadRecentOrders(orders) {
    const recentOrdersContainer = document.getElementById('recentOrders');
    
    if (!orders || orders.length === 0) {
        recentOrdersContainer.innerHTML = `
            <div class="empty-state">
                <p>No orders yet</p>
                <a href="marketplace.html" class="btn-secondary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    // Show last 5 orders
    const recentOrders = orders.slice(-5).reverse();
    
    recentOrdersContainer.innerHTML = recentOrders.map(order => {
        const statusClass = order.status.toLowerCase().replace(' ', '-');
        return `
            <div class="order-item">
                <div class="order-info">
                    <h4>Order #${order.id}</h4>
                    <p class="order-date">${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                    <div class="order-status ${statusClass}">${order.status}</div>
                    <p style="text-align: right; margin-top: 0.5rem; font-weight: 700; color: #8B5CF6;">
                        $${order.total.toFixed(2)}
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// Load Cart Preview
function loadCartPreview() {
    const cart = JSON.parse(localStorage.getItem('metacore_cart') || '[]');
    const cartPreview = document.getElementById('cartPreview');
    
    if (cart.length === 0) {
        cartPreview.innerHTML = `
            <div class="empty-state">
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    // Show first 3 items
    const previewItems = cart.slice(0, 3);
    
    cartPreview.innerHTML = previewItems.map(item => `
        <div class="preview-item">
            <img src="${item.images[0]}" alt="${item.name}" class="preview-image">
            <div class="preview-details">
                <div class="preview-name">${item.name}</div>
                <div class="preview-price">$${item.price} x ${item.quantity}</div>
            </div>
        </div>
    `).join('');
    
    if (cart.length > 3) {
        cartPreview.innerHTML += `
            <a href="marketplace.html#cart" class="view-all" style="display: block; text-align: center; margin-top: 1rem;">
                +${cart.length - 3} more items
            </a>
        `;
    }
}

// Load Wishlist Preview
function loadWishlistPreview() {
    const wishlist = JSON.parse(localStorage.getItem('metacore_wishlist') || '[]');
    const wishlistPreview = document.getElementById('wishlistPreview');
    
    if (wishlist.length === 0) {
        wishlistPreview.innerHTML = `
            <div class="empty-state">
                <p>Your wishlist is empty</p>
            </div>
        `;
        return;
    }
    
    // Get product details for first 3 items
    const wishlistProducts = products.filter(p => wishlist.includes(p.id)).slice(0, 3);
    
    wishlistPreview.innerHTML = wishlistProducts.map(product => `
        <div class="preview-item" onclick="window.location.href='marketplace.html#product-${product.id}'">
            <img src="${product.images[0]}" alt="${product.name}" class="preview-image">
            <div class="preview-details">
                <div class="preview-name">${product.name}</div>
                <div class="preview-price">$${product.price}</div>
            </div>
        </div>
    `).join('');
    
    if (wishlist.length > 3) {
        wishlistPreview.innerHTML += `
            <a href="wishlist.html" class="view-all" style="display: block; text-align: center; margin-top: 1rem;">
                +${wishlist.length - 3} more items
            </a>
        `;
    }
}

// Load Recommendations
function loadRecommendations() {
    const recommendations = document.getElementById('recommendations');
    
    // Get random 3 products
    const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    recommendations.innerHTML = randomProducts.map(product => `
        <div class="recommendation-item" onclick="window.location.href='marketplace.html#product-${product.id}'">
            <img src="${product.images[0]}" alt="${product.name}" class="recommendation-image">
            <div class="recommendation-details">
                <h4>${product.name}</h4>
                <div class="recommendation-price">$${product.price}</div>
            </div>
        </div>
    `).join('');
}

// Edit Profile
function editProfile() {
    alert('Profile editing coming soon!\n\nFor now, you can logout and create a new account.');
}

// Toggle User Menu
function toggleUserMenu() {
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.style.cssText = `
        position: absolute;
        top: 70px;
        right: 20px;
        background: #1E293B;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 1rem;
        min-width: 200px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
    `;
    
    const user = getCurrentUser();
    
    menu.innerHTML = `
        <div style="padding: 0.75rem; border-bottom: 1px solid #334155; margin-bottom: 0.75rem;">
            <div style="font-weight: 700; margin-bottom: 0.25rem;">${user.name}</div>
            <div style="font-size: 0.85rem; color: #94A3B8;">${user.email}</div>
        </div>
        <a href="dashboard.html" style="display: block; padding: 0.75rem; color: #E2E8F0; text-decoration: none; border-radius: 6px; transition: background 0.2s;">
            Dashboard
        </a>
        <a href="wishlist.html" style="display: block; padding: 0.75rem; color: #E2E8F0; text-decoration: none; border-radius: 6px; transition: background 0.2s;">
            Wishlist
        </a>
        <a href="#" onclick="logout()" style="display: block; padding: 0.75rem; color: #EF4444; text-decoration: none; border-radius: 6px; transition: background 0.2s;">
            Logout
        </a>
    `;
    
    // Add hover effects
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.background = '#334155';
        });
        link.addEventListener('mouseleave', () => {
            link.style.background = 'transparent';
        });
    });
    
    // Close on click outside
    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 100);
    
    document.body.appendChild(menu);
}
