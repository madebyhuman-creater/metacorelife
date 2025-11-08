// Wishlist with Supabase

let products = []

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    await requireLogin()
    await loadProducts()
    await updateCartBadge()
    await loadWishlist()
})

// Load all products
async function loadProducts() {
    const { data, error } = await supabase.from('products').select('*')
    if (!error) products = data
}

// Load Wishlist
async function loadWishlist() {
    const user = await getCurrentUser()
    
    try {
        const { data, error } = await supabase
            .from('wishlist_items')
            .select('*, products(*)')
            .eq('user_id', user.id)
        
        if (error) throw error
        
        const wishlistGrid = document.getElementById('wishlistGrid')
        const emptyState = document.getElementById('emptyWishlist')
        const wishlistCount = document.getElementById('wishlistCount')
        
        wishlistCount.textContent = data.length
        
        if (data.length === 0) {
            wishlistGrid.style.display = 'none'
            emptyState.style.display = 'block'
            document.querySelector('.wishlist-header').style.display = 'none'
            return
        }
        
        wishlistGrid.style.display = 'grid'
        emptyState.style.display = 'none'
        document.querySelector('.wishlist-header').style.display = 'flex'
        
        wishlistGrid.innerHTML = data.map(item => `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${item.products.images[0]}" alt="${item.products.name}" class="product-image">
                    <div class="product-actions">
                        <button class="action-icon liked" onclick="removeFromWishlist(${item.product_id})">
                            <span>❤️</span>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${item.products.category}</div>
                    <div class="product-name">${item.products.name}</div>
                    <div class="product-rating">
                        <span class="stars">⭐⭐⭐⭐⭐</span>
                        <span class="review-count">(${item.products.reviews})</span>
                    </div>
                    <div class="product-price-row">
                        <div class="product-price">$${item.products.price}</div>
                        <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${item.product_id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('')
        
    } catch (error) {
        console.error('Error loading wishlist:', error)
        showNotification('Error loading wishlist', 'error')
    }
}

// Remove from Wishlist
async function removeFromWishlist(productId) {
    const user = await getCurrentUser()
    
    try {
        await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId)
        
        showNotification('Removed from wishlist')
        loadWishlist()
        
    } catch (error) {
        console.error('Error removing from wishlist:', error)
    }
}

// Clear Wishlist
async function clearWishlist() {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) return
    
    const user = await getCurrentUser()
    
    try {
        await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', user.id)
        
        showNotification('Wishlist cleared')
        loadWishlist()
        
    } catch (error) {
        console.error('Error clearing wishlist:', error)
    }
}

// Add to Cart from Wishlist
async function addToCartFromWishlist(productId) {
    const user = await getCurrentUser()
    
    try {
        await supabase
            .from('cart_items')
            .upsert({
                user_id: user.id,
                product_id: productId,
                quantity: 1
            })
        
        showNotification('Added to cart!', 'success')
        updateCartBadge()
        
    } catch (error) {
        console.error('Error adding to cart:', error)
    }
}

// Add All to Cart
async function addAllToCart() {
    const user = await getCurrentUser()
    
    try {
        const { data: wishlistItems } = await supabase
            .from('wishlist_items')
            .select('product_id')
            .eq('user_id', user.id)
        
        if (wishlistItems.length === 0) {
            showNotification('Your wishlist is empty', 'info')
            return
        }
        
        for (const item of wishlistItems) {
            await supabase
                .from('cart_items')
                .upsert({
                    user_id: user.id,
                    product_id: item.product_id,
                    quantity: 1
                })
        }
        
        showNotification(`Added ${wishlistItems.length} items to cart!`, 'success')
        updateCartBadge()
        
    } catch (error) {
        console.error('Error adding all to cart:', error)
    }
}

// Update Cart Badge
async function updateCartBadge() {
    const user = await getCurrentUser()
    if (!user) return
    
    const { data } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)
    
    const totalItems = data ? data.reduce((sum, item) => sum + item.quantity, 0) : 0
    document.getElementById('cartBadge').textContent = totalItems
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div')
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
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease'
        setTimeout(() => notification.remove(), 300)
    }, 3000)
}
