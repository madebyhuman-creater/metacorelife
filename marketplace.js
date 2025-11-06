// Sample Products Database
const products = [
    {
        id: 1,
        name: "MetaCore Fitness Journal",
        category: "health",
        price: 29.99,
        originalPrice: 39.99,
        description: "Track your fitness journey with our premium 90-day journal. Features daily workout logs, meal planning, habit trackers, and motivational quotes.",
        images: [
            "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500",
            "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500"
        ],
        badge: "Best Seller",
        rating: 4.8,
        reviews: 245
    },
    {
        id: 2,
        name: "Wealth Mastery Course",
        category: "wealth",
        price: 149.99,
        description: "Complete online course covering investing, financial planning, and wealth building strategies. Lifetime access included.",
        images: [
            "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500",
            "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500"
        ],
        badge: "Digital",
        rating: 4.9,
        reviews: 892
    },
    {
        id: 3,
        name: "MetaCore Premium T-Shirt",
        category: "apparel",
        price: 34.99,
        description: "Ultra-soft premium cotton blend. Features the iconic MetaCore logo. Available in multiple sizes and colors.",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500"
        ],
        badge: "New",
        rating: 4.7,
        reviews: 128
    },
    {
        id: 4,
        name: "Relationship Communication Cards",
        category: "relationships",
        price: 24.99,
        description: "75 conversation starter cards designed to deepen connections. Perfect for couples, families, or friend groups.",
        images: [
            "https://images.unsplash.com/photo-1516841273335-e39b37888115?w=500",
            "https://images.unsplash.com/photo-1514894780887-121968d00567?w=500"
        ],
        badge: "",
        rating: 4.9,
        reviews: 312
    },
    {
        id: 5,
        name: "Morning Routine Planner",
        category: "health",
        price: 19.99,
        originalPrice: 29.99,
        description: "Start your day right with structured morning routines. Includes habit tracking, gratitude journaling, and goal setting.",
        images: [
            "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500"
        ],
        badge: "Sale",
        rating: 4.6,
        reviews: 189
    },
    {
        id: 6,
        name: "Investment Portfolio Tracker",
        category: "wealth",
        price: 39.99,
        description: "Excel template with automated calculations for tracking stocks, crypto, real estate, and more. Lifetime updates included.",
        images: [
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500"
        ],
        badge: "Digital",
        rating: 4.8,
        reviews: 456
    },
    {
        id: 7,
        name: "MetaCore Water Bottle",
        category: "health",
        price: 27.99,
        description: "Insulated stainless steel water bottle. Keeps drinks cold for 24 hours. 32oz capacity with motivational time markers.",
        images: [
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
            "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500"
        ],
        badge: "Best Seller",
        rating: 4.9,
        reviews: 678
    },
    {
        id: 8,
        name: "Mindfulness Meditation Guide",
        category: "health",
        price: 16.99,
        description: "Comprehensive guide with 30 guided meditations, breathing exercises, and mindfulness practices for beginners.",
        images: [
            "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=500",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500"
        ],
        badge: "",
        rating: 4.7,
        reviews: 234
    },
    {
        id: 9,
        name: "MetaCore Hoodie",
        category: "apparel",
        price: 54.99,
        description: "Premium heavyweight hoodie with embroidered logo. Ultra-soft fleece interior. Perfect for your morning workouts or casual wear.",
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
            "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500"
        ],
        badge: "New",
        rating: 4.8,
        reviews: 92
    },
    {
        id: 10,
        name: "Dating Confidence Masterclass",
        category: "relationships",
        price: 97.99,
        description: "6-week online program teaching authentic attraction, conversation skills, and building genuine connections. Includes workbooks and group coaching.",
        images: [
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500",
            "https://images.unsplash.com/photo-1522543558187-768b6df7c25c?w=500"
        ],
        badge: "Digital",
        rating: 4.9,
        reviews: 523
    },
    {
        id: 11,
        name: "Wealth Mindset Book Bundle",
        category: "wealth",
        price: 44.99,
        description: "Collection of 5 bestselling books on wealth building, mindset, and financial freedom. Curated by MetaCore experts.",
        images: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500"
        ],
        badge: "",
        rating: 4.7,
        reviews: 345
    },
    {
        id: 12,
        name: "MetaCore Resistance Bands Set",
        category: "health",
        price: 32.99,
        description: "Professional-grade resistance bands set with 5 resistance levels. Includes door anchor, handles, and carrying bag. Perfect for home workouts.",
        images: [
            "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500"
        ],
        badge: "Best Seller",
        rating: 4.8,
        reviews: 567
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('metacore_cart')) || [];
let currentProduct = null;
let currentImageIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartBadge();
});

// Load Products
function loadProducts(category = 'all') {
    const grid = document.getElementById('productsGrid');
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    grid.innerHTML = filteredProducts.map(product => `
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
    `).join('');
}

// Filter Category
function filterCategory(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadProducts(category);
}

// Sort Products
function sortProducts(sortBy) {
    let sortedProducts = [...products];
    
    switch(sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sortedProducts.reverse();
            break;
    }
    
    products.length = 0;
    products.push(...sortedProducts);
    loadProducts();
}

// Search Products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const grid = document.getElementById('productsGrid');
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    
    grid.innerHTML = filtered.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price}</div>
            </div>
        </div>
    `).join('');
}

// Open Product Modal
function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    currentImageIndex = 0;
    
    document.getElementById('modalProductName').textContent = currentProduct.name;
    document.getElementById('modalProductPrice').textContent = `$${currentProduct.price}`;
    document.getElementById('modalProductDescription').textContent = currentProduct.description;
    document.getElementById('modalProductCategory').textContent = currentProduct.category;
    document.getElementById('modalProductSKU').textContent = currentProduct.id.toString().padStart(4, '0');
    
    updateModalImages();
    
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateModalImages() {
    const mainImage = document.getElementById('modalMainImage');
    const thumbnails = document.getElementById('thumbnailImages');
    
    mainImage.src = currentProduct.images[currentImageIndex];
    
    thumbnails.innerHTML = currentProduct.images.map((img, index) => `
        <img src="${img}" class="thumbnail ${index === currentImageIndex ? 'active' : ''}" 
             onclick="selectImage(${index})">
    `).join('');
}

function selectImage(index) {
    currentImageIndex = index;
    updateModalImages();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
    updateModalImages();
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentProduct.images.length;
    updateModalImages();
}

// Quantity Controls
function increaseQuantity() {
    const input = document.getElementById('quantityInput');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('quantityInput');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Add to Cart
function quickAddToCart(productId) {
    const product = products.find(p => p.id === productId);
    addToCart(product, 1);
}

function addToCartFromModal() {
    const quantity = parseInt(document.getElementById('quantityInput').value);
    addToCart(currentProduct, quantity);
    closeProductModal();
}

function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    updateCartBadge();
    
    // Show feedback
    showNotification('Added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    updateCartBadge();
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('metacore_cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <p class="empty-cart-subtitle">Start adding products to your cart!</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.images[0]}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Toggle Cart
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('active');
    updateCartUI();
}

// Toggle Search
function toggleSearch() {
    const overlay = document.getElementById('searchOverlay');
    overlay.classList.toggle('active');
    
    if (overlay.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

// Wishlist
function toggleWishlist(button, productId) {
    button.classList.toggle('liked');
    const heart = button.querySelector('.heart');
    heart.textContent = button.classList.contains('liked') ? '❤️' : '🤍';
    
    // Save to localStorage
    let wishlist = JSON.parse(localStorage.getItem('metacore_wishlist')) || [];
    if (button.classList.contains('liked')) {
        wishlist.push(productId);
    } else {
        wishlist = wishlist.filter(id => id !== productId);
    }
    localStorage.setItem('metacore_wishlist', JSON.stringify(wishlist));
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 9.99;
    const total = subtotal + shipping;
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
    
    // Initialize PayPal
    initializePayPal(total);
    
    document.getElementById('checkoutModal').classList.add('active');
    toggleCart(); // Close cart sidebar
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// PayPal Integration
function initializePayPal(amount) {
    // Clear existing buttons
    document.getElementById('paypal-button-container').innerHTML = '';
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toFixed(2)
                    },
                    description: 'MetaCore Life Products'
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                
                // Clear cart
                cart = [];
                saveCart();
                updateCartUI();
                updateCartBadge();
                
                closeCheckoutModal();
                
                // Show success message
                showNotification('Order placed successfully! Thank you for your purchase.');
            });
        },
        onError: function(err) {
            console.error('PayPal error:', err);
            alert('Payment failed. Please try again.');
        }
    }).render('#paypal-button-container');
}

// Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10B981, #34D399);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
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
