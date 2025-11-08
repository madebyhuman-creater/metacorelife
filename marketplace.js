// Marketplace with Supabase - Production Ready

let products = []
let currentProduct = null
let currentImageIndex = 0

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    await loadProducts();
    await updateCartBadge();
    await updateWishlistBadge(); // ADD THIS LINE
});

// Load Products from Supabase
async function loadProducts(category = 'all') {
    try {
        let query = supabase.from('products').select('*')
        
        if (category !== 'all') {
            query = query.eq('category', category)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        
        products = data
        displayProducts(products)
        
    } catch (error) {
        console.error('Error loading products:', error)
        showNotification('Error loading products', 'error')
    }
}

// Display Products
function displayProducts(productsToDisplay) {
    const grid = document.getElementById('productsGrid')
    
    grid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="action-icon" onclick="event.stopPropagation(); toggleWishlist(this, ${product.id})">
                        <span class="heart">🤍</span>
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
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); quickAddToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('')
}

// Filter Category
function filterCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active')
    })
    event.target.classList.add('active')
    
    loadProducts(category)
}

// Search Products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase()
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    )
    
    displayProducts(filtered)
}

// Open Product Modal
function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId)
    currentImageIndex = 0
    
    document.getElementById('modalProductName').textContent = currentProduct.name
    document.getElementById('modalProductPrice').textContent = `$${currentProduct.price}`
    document.getElementById('modalProductDescription').textContent = currentProduct.description
    document.getElementById('modalProductCategory').textContent = currentProduct.category
    document.getElementById('modalProductSKU').textContent = currentProduct.id.toString().padStart(4, '0')
    
    updateModalImages()
    
    document.getElementById('productModal').classList.add('active')
    document.body.style.overflow = 'hidden'
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active')
    document.body.style.overflow = 'auto'
}

function updateModalImages() {
    const mainImage = document.getElementById('modalMainImage')
    const thumbnails = document.getElementById('thumbnailImages')
    
    mainImage.src = currentProduct.images[currentImageIndex]
    
    thumbnails.innerHTML = currentProduct.images.map((img, index) => `
        <img src="${img}" class="thumbnail ${index === currentImageIndex ? 'active' : ''}" 
             onclick="selectImage(${index})">
    `).join('')
}

function selectImage(index) {
    currentImageIndex = index
    updateModalImages()
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length
    updateModalImages()
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentProduct.images.length
    updateModalImages()
}

// Quantity Controls
function increaseQuantity() {
    const input = document.getElementById('quantityInput')
    input.value = parseInt(input.value) + 1
}

function decreaseQuantity() {
    const input = document.getElementById('quantityInput')
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1
    }
}

// Add to Cart with Supabase
async function quickAddToCart(productId) {
    await addToCart(productId, 1)
}

async function addToCartFromModal() {
    const quantity = parseInt(document.getElementById('quantityInput').value)
    await addToCart(currentProduct.id, quantity)
    closeProductModal()
}

async function addToCart(productId, quantity) {
    try {
        const user = await getCurrentUser()
        
        if (!user) {
            // Guest user - save to localStorage
            let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]')
            const existingItem = guestCart.find(item => item.product_id === productId)
            
            if (existingItem) {
                existingItem.quantity += quantity
            } else {
                const product = products.find(p => p.id === productId)
                guestCart.push({
                    product_id: productId,
                    quantity: quantity,
                    product: product
                })
            }
            
            localStorage.setItem('guest_cart', JSON.stringify(guestCart))
            showNotification('Added to cart! Login to save across devices.')
            updateCartBadge()
            return
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
            })
        
        if (error) throw error
        
        showNotification('Added to cart!', 'success')
        updateCartBadge()
        
    } catch (error) {
        console.error('Error adding to cart:', error)
        showNotification('Error adding to cart', 'error')
    }
}

// Get Cart Items
async function getCartItems() {
    const user = await getCurrentUser()
    
    if (!user) {
        // Guest cart
        const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]')
        return guestCart
    }
    
    // Logged in user cart from Supabase
    const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', user.id)
    
    if (error) {
        console.error('Error fetching cart:', error)
        return []
    }
    
    return data.map(item => ({
        ...item,
        product: item.products
    }))
}

// Update Cart Badge
async function updateCartBadge() {
    const cartItems = await getCartItems()
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    document.getElementById('cartBadge').textContent = totalItems
}

// Update Cart UI
async function updateCartUI() {
    const cartItems = await getCartItems()
    const cartItemsContainer = document.getElementById('cartItems')
    const cartTotal = document.getElementById('cartTotal')
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <p class="empty-cart-subtitle">Start adding products to your cart!</p>
            </div>
        `
        cartTotal.textContent = '$0.00'
        return
    }
    
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.product.images[0]}" alt="${item.product.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">$${item.product.price}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity(${item.product_id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly>
                    <button onclick="updateCartQuantity(${item.product_id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.product_id})">🗑️</button>
        </div>
    `).join('')
    
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    cartTotal.textContent = `$${total.toFixed(2)}`
}

// Remove from Cart
async function removeFromCart(productId) {
    const user = await getCurrentUser()
    
    if (!user) {
        // Guest cart
        let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]')
        guestCart = guestCart.filter(item => item.product_id !== productId)
        localStorage.setItem('guest_cart', JSON.stringify(guestCart))
    } else {
        // Supabase cart
        await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId)
    }
    
    updateCartUI()
    updateCartBadge()
}

// Update Cart Quantity
async function updateCartQuantity(productId, newQuantity) {
    if (newQuantity < 1) return
    
    const user = await getCurrentUser()
    
    if (!user) {
        // Guest cart
        let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]')
        const item = guestCart.find(i => i.product_id === productId)
        if (item) item.quantity = newQuantity
        localStorage.setItem('guest_cart', JSON.stringify(guestCart))
    } else {
        // Supabase cart
        await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('user_id', user.id)
            .eq('product_id', productId)
    }
    
    updateCartUI()
    updateCartBadge()
}

// Toggle Cart Sidebar
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar')
    sidebar.classList.toggle('active')
    updateCartUI()
}

// Toggle Search
function toggleSearch() {
    const overlay = document.getElementById('searchOverlay')
    overlay.classList.toggle('active')
    
    if (overlay.classList.contains('active')) {
        document.getElementById('searchInput').focus()
    }
}

// Wishlist Functions
async function toggleWishlist(button, productId) {
    const user = await getCurrentUser();
    
    if (!user) {
        showNotification('Please login to save items', 'info');
        localStorage.setItem('redirect_after_login', window.location.href);
        setTimeout(() => window.location.href = 'auth.html', 1000);
        return;
    }
    
    const isLiked = button.classList.contains('liked');
    
    try {
        if (isLiked) {
            // Remove from wishlist
            await supabase
                .from('wishlist_items')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);
            
            button.classList.remove('liked');
            button.querySelector('.heart').textContent = '🤍';
            showNotification('Removed from wishlist');
        } else {
            // Add to wishlist
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
        
        // Update badge
        await updateWishlistBadge();
        
    } catch (error) {
        console.error('Wishlist error:', error);
        showNotification('Error updating wishlist', 'error');
    }
}

// Checkout
async function checkout() {
    const cartItems = await getCartItems()
    
    if (cartItems.length === 0) {
        alert('Your cart is empty!')
        return
    }
    
    const user = await getCurrentUser()
    
    if (!user) {
        showNotification('Please login to checkout', 'info')
        localStorage.setItem('redirect_after_login', window.location.href)
        setTimeout(() => window.location.href = 'auth.html', 1000)
        return
    }
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const shipping = 9.99
    const total = subtotal + shipping
    
    // Show checkout modal
    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`
    
    const checkoutItems = document.getElementById('checkoutItems')
    checkoutItems.innerHTML = cartItems.map(item => `
        <div class="checkout-item">
            <span>${item.product.name} x${item.quantity}</span>
            <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('')
    
    // Initialize PayPal
    initializePayPal(total, cartItems)
    
    document.getElementById('checkoutModal').classList.add('active')
    toggleCart()
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active')
}

// PayPal Integration
function initializePayPal(amount, cartItems) {
    document.getElementById('paypal-button-container').innerHTML = ''
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toFixed(2)
                    },
                    description: 'MetaCore Life Products'
                }]
            })
        },
        onApprove: async function(data, actions) {
            const details = await actions.order.capture()
            
            // Create order in Supabase
            await createOrder(amount, details.id, cartItems)
            
            alert('Order completed successfully!')
            closeCheckoutModal()
            window.location.href = 'dashboard.html'
        },
        onError: function(err) {
            console.error('PayPal error:', err)
            alert('Payment failed. Please try again.')
        }
    }).render('#paypal-button-container')
}

// Create Order in Supabase
async function createOrder(total, paymentId, cartItems) {
    const user = await getCurrentUser()
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    
    // Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total: total,
            subtotal: subtotal,
            shipping: 9.99,
            status: 'processing',
            payment_id: paymentId,
            payment_method: 'paypal'
        })
        .select()
        .single()
    
    if (orderError) {
        console.error('Order creation error:', orderError)
        return
    }
    
    // Create order items
    const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity
    }))
    
    await supabase.from('order_items').insert(orderItems)
    
    // Clear cart
    await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
    
    updateCartBadge()
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
// Toggle User Menu Dropdown
function toggleUserMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('userMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('userMenu');
    const dropdown = event.target.closest('.dropdown');
    
    if (!dropdown && menu) {
        menu.style.display = 'none';
    }
});

// Update Wishlist Badge
async function updateWishlistBadge() {
    const user = await getCurrentUser();
    if (!user) {
        document.getElementById('wishlistBadge').textContent = '0';
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('wishlist_items')
            .select('id')
            .eq('user_id', user.id);
        
        if (error) throw error;
        
        document.getElementById('wishlistBadge').textContent = data.length;
    } catch (error) {
        console.error('Error updating wishlist badge:', error);
    }
}

// Logout function
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}
