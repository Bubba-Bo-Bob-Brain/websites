/**
 * BRASS & STEAM EMPORIUM
 * Mechanical Systems Controller
 * Victorian Steampunk E-commerce Functionality
 */

// ==========================================
// STATE MANAGEMENT - The Aetheric Registry
// ==========================================
const ApparatusState = {
    cart: [],
    isCartOpen: false,
    currentCategory: 'all',
    
    // Tax rate for aetheric goods (8%)
    TAX_RATE: 0.08,
    
    // Product catalog reference
    products: [
        { id: 1, name: 'Aetheric Resonance Goggles', price: 47.50, category: 'instrumentation' },
        { id: 2, name: 'Chronometric Pocket Watch', price: 125.00, category: 'curiosities' },
        { id: 3, name: 'Pneumatic Arm Bracer', price: 89.99, category: 'augmentations' },
        { id: 4, name: 'Aetheric Compass', price: 34.50, category: 'instrumentation' },
        { id: 5, name: 'Clockwork Songbird', price: 245.00, category: 'curiosities' },
        { id: 6, name: 'Nebulaic Brass Telescope', price: 178.00, category: 'instrumentation' }
    ]
};

// ==========================================
// DOM ELEMENT REFERENCES - The Control Panel
// ==========================================
const Elements = {
    // Cart elements
    cartTrigger: document.getElementById('cartTrigger'),
    cartPanel: document.getElementById('cartPanel'),
    closeCart: document.getElementById('closeCart'),
    cartCount: document.getElementById('cartCount'),
    cartItems: document.getElementById('cartItems'),
    cartSummary: document.getElementById('cartSummary'),
    overlay: document.getElementById('overlay'),
    
    // Price displays
    subtotalAmount: document.getElementById('subtotalAmount'),
    taxAmount: document.getElementById('taxAmount'),
    totalAmount: document.getElementById('totalAmount'),
    
    // Pneumatic system
    pneumaticSystem: document.getElementById('pneumaticSystem'),
    pneumaticCapsule: document.getElementById('pneumaticCapsule'),
    
    // Toast
    toast: document.getElementById('toast'),
    
    // Products
    productsGrid: document.getElementById('productsGrid'),
    productCards: document.querySelectorAll('.product-card'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    // Ticker
    tickerContent: document.querySelector('.ticker-content')
};

// ==========================================
// CART MECHANICS - The Brass Apparatus
// ==========================================

/**
 * Initialize the Emporium systems
 */
function initializeEmporium() {
    bindEventListeners();
    startTickerControl();
    updateCartDisplay();
}

/**
 * Bind all event listeners for mechanical interactions
 */
function bindEventListeners() {
    // Cart panel toggle
    Elements.cartTrigger.addEventListener('click', toggleCart);
    Elements.closeCart.addEventListener('click', closeCartPanel);
    Elements.overlay.addEventListener('click', closeCartPanel);
    
    // Add to cart buttons with pneumatic delivery
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });
    
    // Category navigation
    Elements.navLinks.forEach(link => {
        link.addEventListener('click', handleCategoryFilter);
    });
    
    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ApparatusState.isCartOpen) {
            closeCartPanel();
        }
    });
}

/**
 * Handle adding items with pneumatic tube animation
 */
function handleAddToCart(e) {
    const btn = e.currentTarget;
    const card = btn.closest('.product-card');
    const productId = parseInt(btn.dataset.id);
    const product = ApparatusState.products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Trigger pneumatic animation
    const btnRect = btn.getBoundingClientRect();
    const cartRect = Elements.cartTrigger.getBoundingClientRect();
    
    animatePneumaticTube(btnRect, cartRect, () => {
        // Add to cart after animation completes
        addToCart(product);
        showToast(`${product.name} dispatched to apparatus`);
    });
    
    // Mechanical button feedback
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 150);
}

/**
 * Animate the pneumatic capsule delivery system
 */
function animatePneumaticTube(startRect, endRect, callback) {
    const system = Elements.pneumaticSystem;
    const capsule = Elements.pneumaticCapsule;
    
    // Calculate path positions
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;
    
    // Position the SVG container
    const minX = Math.min(startX, endX) - 50;
    const minY = Math.min(startY, endY) - 50;
    const width = Math.abs(endX - startX) + 100;
    const height = Math.abs(endY - startY) + 100;
    
    system.style.left = `${minX}px`;
    system.style.top = `${minY}px`;
    system.style.width = `${width}px`;
    system.style.height = `${height}px`;
    
    // Update SVG path to match
    const svg = system.querySelector('svg');
    const paths = svg.querySelectorAll('path');
    
    // Calculate relative coordinates for path
    const relStartX = startX - minX;
    const relStartY = startY - minY;
    const relEndX = endX - minX;
    const relEndY = endY - minY;
    
    // Create curved path
    const midX = (relStartX + relEndX) / 2;
    const midY = (relStartY + relEndY) / 2;
    const controlX = midX + (relEndY - relStartY) * 0.3;
    const controlY = midY - (relEndX - relStartX) * 0.3;
    
    const pathD = `M ${relStartX} ${relStartY} Q ${controlX} ${controlY} ${relEndX} ${relEndY}`;
    
    paths.forEach(path => path.setAttribute('d', pathD));
    
    // Activate animation
    system.classList.add('active');
    
    // Reset animation
    capsule.style.animation = 'none';
    capsule.offsetHeight; // Trigger reflow
    capsule.style.animation = 'tubeTravel 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    
    // Play sound effect (simulated vibration)
    if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
    }
    
    // Cleanup after animation
    setTimeout(() => {
        system.classList.remove('active');
        if (callback) callback();
    }, 800);
}

/**
 * Add item to the apparatus (cart)
 */
function addToCart(product) {
    const existingItem = ApparatusState.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        ApparatusState.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    
    // Update cart count with mechanical rotation
    Elements.cartCount.style.animation = 'rotateGear 0.5s ease-out';
    setTimeout(() => {
        Elements.cartCount.style.animation = '';
    }, 500);
}

/**
 * Remove item from cart
 */
function removeFromCart(productId) {
    const item = ApparatusState.cart.find(item => item.id === productId);
    const card = document.querySelector(`.cart-item[data-cart-id="${productId}"]`);
    
    if (card) {
        card.style.transform = 'translateX(100px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            ApparatusState.cart = ApparatusState.cart.filter(item => item.id !== productId);
            updateCartDisplay();
        }, 300);
    }
}

/**
 * Update item quantity
 */
function updateQuantity(productId, delta) {
    const item = ApparatusState.cart.find(item => item.id === productId);
    
    if (!item) return;
    
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
    }
}

/**
 * Calculate financial totals with aetheric tax
 */
function calculateTotals() {
    const subtotal = ApparatusState.cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    const tax = subtotal * ApparatusState.TAX_RATE;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
}

/**
 * Format currency in Victorian style
 */
function formatCurrency(amount) {
    return '£' + amount.toFixed(2);
}

/**
 * Update cart display with mechanical precision
 */
function updateCartDisplay() {
    const { subtotal, tax, total } = calculateTotals();
    const itemCount = ApparatusState.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update counter
    Elements.cartCount.textContent = itemCount;
    
    // Update price displays with counting animation
    animateValue(Elements.subtotalAmount, subtotal);
    animateValue(Elements.taxAmount, tax);
    animateValue(Elements.totalAmount, total);
    
    // Render items or empty state
    if (ApparatusState.cart.length === 0) {
        renderEmptyCart();
    } else {
        renderCartItems();
    }
}

/**
 * Animate numerical values (mechanical counter effect)
 */
function animateValue(element, target) {
    const current = parseFloat(element.textContent.replace(/[^0-9.-]+/g, '')) || 0;
    const duration = 500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for mechanical feel
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = current + (target - current) * easeOut;
        
        element.textContent = formatCurrency(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Render cart items with copper engraving styling
 */
function renderCartItems() {
    Elements.cartSummary.style.display = 'block';
    
    const html = ApparatusState.cart.map(item => `
        <div class="cart-item" data-cart-id="${item.id}">
            <div class="cart-item-image">
                <span style="font-size: 1.5rem;">⚙</span>
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">${formatCurrency(item.price)}</p>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    Elements.cartItems.innerHTML = html;
}

/**
 * Render empty cart state
 */
function renderEmptyCart() {
    Elements.cartSummary.style.display = 'none';
    Elements.cartItems.innerHTML = `
        <div class="empty-cart-message">
            <div class="empty-icon">⚙</div>
            <p class="empty-text">No contraptions selected.</p>
            <p class="empty-subtitle">Your apparatus awaits assembly.</p>
        </div>
    `;
}

/**
 * Toggle cart panel with steam-powered slide
 */
function toggleCart() {
    if (ApparatusState.isCartOpen) {
        closeCartPanel();
    } else {
        openCartPanel();
    }
}

function openCartPanel() {
    ApparatusState.isCartOpen = true;
    Elements.cartPanel.classList.add('open');
    Elements.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
}

function closeCartPanel() {
    ApparatusState.isCartOpen = false;
    Elements.cartPanel.classList.remove('open');
    Elements.overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ==========================================
// CATEGORY FILTERING - The Catalogue System
// ==========================================

function handleCategoryFilter(e) {
    e.preventDefault();
    const link = e.currentTarget;
    const category = link.dataset.category;
    
    // Update active state
    Elements.navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Filter products with steam transition
    Elements.productCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = '';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    ApparatusState.currentCategory = category;
}

// ==========================================
// NOTIFICATION SYSTEM - Steam Toast
// ==========================================

function showToast(message) {
    const toast = Elements.toast;
    const messageEl = toast.querySelector('.toast-message');
    
    messageEl.textContent = message;
    toast.classList.add('show');
    
    // Auto-hide after delay
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// TICKER CONTROL - Mechanical Scroll
// ==========================================

function startTickerControl() {
    const ticker = Elements.tickerContent;
    let speed = 30; // seconds for full cycle
    let isPaused = false;
    
    // Pause on hover for readability
    ticker.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
        isPaused = true;
    });
    
    ticker.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
        isPaused = false;
    });
    
    // Adjust speed based on content length (mechanical precision)
    const contentWidth = ticker.scrollWidth / 2;
    const viewportWidth = window.innerWidth;
    
    if (contentWidth > viewportWidth) {
        speed = (contentWidth / viewportWidth) * 15;
        ticker.style.animationDuration = `${speed}s`;
    }
}

// ==========================================
// UTILITY FUNCTIONS - Maintenance Tools
// ==========================================

// Expose necessary functions to global scope for inline handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEmporium);
} else {
    initializeEmporium();
}

// Handle resize for pneumatic tube calculations
window.addEventListener('resize', () => {
    // Close cart on resize to prevent layout issues
    if (ApparatusState.isCartOpen) {
        closeCartPanel();
    }
});

// Console easter egg for fellow artificers
console.log('%c⚙ Brass & Steam Emporium ⚙', 'color: #B5A642; font-size: 20px; font-family: monospace;');
console.log('%cMechanical systems initialized. All gears turning smoothly.', 'color: #8B7355; font-style: italic;');