// scripts.js

// Product data
const products = [
    {
        id: 1,
        name: "Arcane Resonance Engine",
        description: "A brass mechanism that amplifies magical frequencies through precision gears and harmonic oscillators.",
        price: 250,
        image: createSVG('engine', '#D4AF37')
    },
    {
        id: 2,
        name: "Temporal Gearlock",
        description: "Chronometric device that manipulates time flow using interlocking brass cogs and temporal crystals.",
        price: 450,
        image: createSVG('clock', '#B8860B')
    },
    {
        id: 3,
        name: "Elemental Conduit",
        description: "Enchanted metal conduit that channels elemental energies through copper wiring and arcane crystals.",
        price: 180,
        image: createSVG('bolt', '#F0D060')
    },
    {
        id: 4,
        name: "Astral Navigation Sphere",
        description: "Celestial brass sphere that maps the astral planes and guides travelers through dimensional currents.",
        price: 520,
        image: createSVG('sphere', '#C0C0C0')
    },
    {
        id: 5,
        name: "Phantom Lantern",
        description: "Illuminated by captured spirit energy, this lantern never requires fuel and glows with ethereal light.",
        price: 150,
        image: createSVG('lamp', '#DDA0DD')
    },
    {
        id: 6,
        name: "Mechanical Familiar",
        description: "Automaton companion powered by steam and arcane energy, loyal and infinitely programmable.",
        price: 380,
        image: createSVG('robot', '#808080')
    }
];

// Create SVG icons dynamically
function createSVG(type, color) {
    const icons = {
        engine: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="3"/><circle cx="50" cy="50" r="15" fill="${color}"/><circle cx="50" cy="50" r="5" fill="#fff"/><line x1="50" y1="10" x2="50" y2="20" stroke="${color}" stroke-width="2"/><line x1="50" y1="80" x2="50" y2="90" stroke="${color}" stroke-width="2"/><line x1="10" y1="50" x2="20" y2="50" stroke="${color}" stroke-width="2"/><line x1="80" y1="50" x2="90" y2="50" stroke="${color}" stroke-width="2"/><line x1="22" y1="22" x2="30" y2="30" stroke="${color}" stroke-width="2"/><line x1="78" y1="78" x2="88" y2="88" stroke="${color}" stroke-width="2"/><line x1="22" y1="78" x2="30" y2="68" stroke="${color}" stroke-width="2"/><line x1="78" y1="22" x2="88" y2="30" stroke="${color}" stroke-width="2"/></svg>`,
        clock: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="3"/><circle cx="50" cy="50" r="8" fill="${color}"/><circle cx="50" cy="50" r="3" fill="#fff"/><line x1="50" y1="50" x2="50" y2="25" stroke="${color}" stroke-width="2"/><line x1="50" y1="50" x2="65" y2="50" stroke="${color}" stroke-width="2"/><line x1="50" y1="50" x2="50" y2="65" stroke="${color}" stroke-width="2"/><circle cx="50" cy="50" r="35" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="5,5"/><circle cx="50" cy="50" r="25" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2,2"/></svg>`,
        bolt: `<svg viewBox="0 0 100 100"><polygon points="50,10 65,45 100,45 75,65 85,95 50,70 15,95 25,65 0,45 35,45" fill="${color}"/><circle cx="50" cy="50" r="15" fill="none" stroke="${color}" stroke-width="2"/></svg>`,
        sphere: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="3"/><circle cx="50" cy="50" r="8" fill="${color}"/><circle cx="35" cy="35" r="3" fill="rgba(255,255,255,0.3)"/><circle cx="65" cy="35" r="3" fill="rgba(255,255,255,0.3)"/><circle cx="35" cy="65" r="3" fill="rgba(255,255,255,0.3)"/><circle cx="65" cy="65" r="3" fill="rgba(255,255,255,0.3)"/></svg>`,
        lamp: `<svg viewBox="0 0 100 100"><path d="M40,90 Q50,70 60,90" stroke="${color}" stroke-width="3" fill="none"/><circle cx="50" cy="60" r="15" fill="${color}"/><circle cx="50" cy="60" r="8" fill="#FFF" opacity="0.8"/><circle cx="50" cy="60" r="4" fill="#FFD700"/><path d="M30,90 Q30,60 50,60 Q70,60 70,90" stroke="${color}" stroke-width="2" fill="none"/></svg>`,
        robot: `<svg viewBox="0 0 100 100"><rect x="30" y="20" width="40" height="50" rx="5" fill="${color}"/><circle cx="40" cy="35" r="8" fill="#333"/><circle cx="60" cy="35" r="8" fill="#333"/><rect x="25" y="75" width="10" height="15" rx="2" fill="${color}"/><rect x="65" y="75" width="10" height="15" rx="2" fill="${color}"/><circle cx="50" cy="20" r="12" fill="none" stroke="${color}" stroke-width="2"/><circle cx="50" cy="20" r="6" fill="none" stroke="${color}" stroke-width="1"/><circle cx="50" cy="20" r="2" fill="${color}"/></svg>`
    };
    return icons[type] || icons.engine;
}

// Shopping cart data
let cart = [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartPanel = document.getElementById('cartPanel');
const cartTrigger = document.getElementById('cartTrigger');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const pneumaticTube = document.getElementById('pneumaticTube');
const tubeBall = document.getElementById('tubeBall');

// Initialize the shop
function initShop() {
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
    updateCartCount();
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${product.image}
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price} gp</div>
            <button class="add-to-cart-btn" data-id="${product.id}">
                <span class="btn-text">Add to Arcane Cart</span>
            </button>
        </div>
    `;
}

// Add to cart functionality
productsGrid.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart-btn')) {
        const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.id);
        const product = products.find(p => p.id === productId);
        
        if (product) {
            addToCart(product);
            animateAddToCart(e.target.closest('.add-to-cart-btn'));
        }
    }
});

// Add to cart function
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
}

// Animate add to cart
function animateAddToCart(button) {
    const rect = button.getBoundingClientRect();
    const ball = tubeBall;
    
    // Reset animation
    ball.style.animation = 'none';
    ball.offsetHeight; // Trigger reflow
    ball.style.animation = null;
    
    // Position ball at button
    ball.style.left = rect.left + 'px';
    ball.style.top = rect.top + 'px';
    ball.style.width = '20px';
    ball.style.height = '20px';
    
    // Animate to cart
    const cartRect = cartTrigger.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;
    
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    const duration = 800;
    const startTime = performance.now();
    
    function animateBall(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentX = startX + (endX - startX) * easeProgress;
        const currentY = startY + (endY - startY) * easeProgress;
        
        ball.style.left = currentX + 'px';
        ball.style.top = currentY + 'px';
        ball.style.width = (20 + progress * 20) + 'px';
        ball.style.height = (20 + progress * 20) + 'px';
        
        if (progress < 1) {
            requestAnimationFrame(animateBall);
        } else {
            // Reset position for next animation
            ball.style.left = '50%';
            ball.style.top = '0';
            ball.style.width = '40px';
            ball.style.height = '40px';
        }
    }
    
    requestAnimationFrame(animateBall);
}

// Update cart display
function updateCart() {
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.image}
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} gp</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
        </div>
    `).join('');
    
    // Update cart count
    updateCartCount();
    
    // Update totals
    updateTotals();
    
    // Add event listeners to quantity buttons and remove buttons
    cartItems.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            updateQuantity(id, -1);
        });
    });
    
    cartItems.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            updateQuantity(id, 1);
        });
    });
    
    cartItems.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });
}

// Update quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        updateCart();
    }
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update totals
function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    subtotalEl.textContent = subtotal.toFixed(2) + ' gp';
    taxEl.textContent = tax.toFixed(2) + ' gp';
    totalEl.textContent = total.toFixed(2) + ' gp';
}

// Open/cart cart
cartTrigger.addEventListener('click', () => {
    cartPanel.classList.add('open');
    overlay.classList.add('active');
});

closeCart.addEventListener('click', closeCartPanel);
overlay.addEventListener('click', closeCartPanel);

function closeCartPanel() {
    cartPanel.classList.remove('open');
    overlay.classList.remove('active');
}

// Checkout button
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty! Add some arcane curiosities to proceed.');
        return;
    }
    
    // Simulate checkout process
    alert(`Transaction complete! Total: ${totalEl.textContent}\nThank you for your purchase!`);
    cart = [];
    updateCart();
    closeCartPanel();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCartPanel();
    }
});

// Initialize the shop when page loads
document.addEventListener('DOMContentLoaded', initShop);