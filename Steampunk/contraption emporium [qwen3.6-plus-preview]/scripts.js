/* ==========================================
   ARCHIMEDES & BLACKWELL — JAVASCRIPT
   Purveyors of Fine Arcane Mechanisms
   ========================================== */

// ---------- Product Data ----------
const products = [
    {
        id: 1,
        name: "Aetheric Resonance Chamber",
        category: "contraptions",
        price: 847,
        description: "Amplifies aetheric vibrations for long-distance communication across the Empire. Calibrated to the Royal Frequency Standard.",
        specs: ["Range: 400 leagues", "Brass alloy", "Patent #4,892"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="25" y="15" width="50" height="50" rx="3"/>
            <rect x="30" y="20" width="40" height="40" rx="2"/>
            <circle cx="50" cy="40" r="12"/>
            <circle cx="50" cy="40" r="6" fill="currentColor" opacity="0.3"/>
            <line x1="20" y1="30" x2="25" y2="30"/>
            <line x1="75" y1="30" x2="80" y2="30"/>
            <line x1="20" y1="50" x2="25" y2="50"/>
            <line x1="75" y1="50" x2="80" y2="50"/>
            <path d="M35 20 Q35 10 50 5 Q65 10 65 20"/>
            <line x1="50" y1="5" x2="50" y2="0"/>
            <circle cx="50" cy="0" r="2" fill="currentColor"/>
        </svg>`
    },
    {
        id: 2,
        name: "Chronometric Gear Assembly",
        category: "contraptions",
        price: 312,
        description: "Precision timekeeping mechanism with 47 interlocking gears. Keeps time to within one second per fortnight.",
        specs: ["47 gears", "Accuracy: ±1s/fortnight", "Patent #3,201"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="50" cy="40" r="25"/>
            <circle cx="50" cy="40" r="20"/>
            <circle cx="50" cy="40" r="8" fill="currentColor" opacity="0.3"/>
            <path d="M50 12 L52 18 L48 18 Z"/>
            <path d="M50 68 L52 62 L48 62 Z"/>
            <path d="M22 40 L28 38 L28 42 Z"/>
            <path d="M78 40 L72 38 L72 42 Z"/>
            <path d="M30 20 L34 25 L29 27 Z"/>
            <path d="M70 60 L66 55 L71 53 Z"/>
            <path d="M70 20 L66 25 L71 27 Z"/>
            <path d="M30 60 L34 55 L29 53 Z"/>
            <line x1="50" y1="40" x2="60" y2="25" stroke-width="2"/>
            <line x1="50" y1="40" x2="45" y2="55" stroke-width="1"/>
        </svg>`
    },
    {
        id: 3,
        name: "Atmospheric Pressure Regulator",
        category: "contraptions",
        price: 523,
        description: "Maintains optimal pressure for delicate experiments. Essential for any serious natural philosopher's laboratory.",
        specs: ["Range: 1-5 atm", "Copper fittings", "Patent #5,118"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="30" y="10" width="40" height="60" rx="5"/>
            <rect x="35" y="15" width="30" height="50" rx="3"/>
            <circle cx="50" cy="30" r="10"/>
            <circle cx="50" cy="30" r="4" fill="currentColor" opacity="0.3"/>
            <line x1="50" y1="30" x2="56" y2="24"/>
            <line x1="20" y1="35" x2="30" y2="35"/>
            <line x1="70" y1="35" x2="80" y2="35"/>
            <rect x="22" y="30" width="8" height="10" rx="1"/>
            <rect x="70" y="30" width="8" height="10" rx="1"/>
            <line x1="35" y1="55" x2="65" y2="55"/>
            <line x1="40" y1="58" x2="60" y2="58"/>
            <path d="M45 65 Q50 70 55 65"/>
        </svg>`
    },
    {
        id: 4,
        name: "Voltaic Accumulator Bank",
        category: "contraptions",
        price: 1290,
        description: "Stores electrical energy for powering larger devices. Six cells arranged in series for maximum potential difference.",
        specs: ["6 cells", "Output: 12V", "Patent #6,774"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="15" y="25" width="15" height="35" rx="2"/>
            <rect x="35" y="25" width="15" height="35" rx="2"/>
            <rect x="55" y="25" width="15" height="35" rx="2"/>
            <rect x="75" y="25" width="15" height="35" rx="2"/>
            <line x1="22" y1="20" x2="22" y2="25"/>
            <line x1="42" y1="20" x2="42" y2="25"/>
            <line x1="62" y1="20" x2="62" y2="25"/>
            <line x1="82" y1="20" x2="82" y2="25"/>
            <line x1="22" y1="15" x2="82" y2="15"/>
            <line x1="22" y1="60" x2="82" y2="60"/>
            <circle cx="22" cy="15" r="3" fill="currentColor" opacity="0.3"/>
            <circle cx="82" cy="15" r="3" fill="currentColor" opacity="0.3"/>
            <path d="M10 40 L15 40"/>
            <path d="M90 40 L85 40"/>
            <path d="M5 38 L5 42"/>
            <path d="M95 38 L95 42"/>
        </svg>`
    },
    {
        id: 5,
        name: "Tesla Coil Miniature",
        category: "curiosities",
        price: 189,
        description: "Generates harmless arcs of artificial lightning. A magnificent parlour piece that never fails to impress guests.",
        specs: ["Output: 50kV", "Glass dome", "Patent #2,445"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <ellipse cx="50" cy="65" rx="30" ry="8"/>
            <rect x="35" y="40" width="30" height="25"/>
            <circle cx="50" cy="30" r="20"/>
            <circle cx="50" cy="30" r="15" stroke-dasharray="3,2"/>
            <line x1="50" y1="40" x2="50" y2="10"/>
            <line x1="45" y1="10" x2="55" y2="10"/>
            <path d="M55 10 Q65 5 60 15"/>
            <path d="M45 10 Q35 5 40 15"/>
            <circle cx="60" cy="5" r="2" fill="currentColor" opacity="0.4"/>
            <circle cx="40" cy="5" r="2" fill="currentColor" opacity="0.4"/>
            <line x1="50" y1="55" x2="50" y2="65"/>
        </svg>`
    },
    {
        id: 6,
        name: "Aetheric Spectroscope",
        category: "curiosities",
        price: 675,
        description: "Reveals invisible aetheric spectra and ghostly presences. Essential for any serious paranormal investigator.",
        specs: ["12 spectral bands", "Crystal lens", "Patent #7,003"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="15" y="30" width="50" height="20" rx="3"/>
            <circle cx="75" cy="40" r="15"/>
            <circle cx="75" cy="40" r="8" fill="currentColor" opacity="0.2"/>
            <line x1="65" y1="40" x2="50" y2="40"/>
            <line x1="20" y1="30" x2="20" y2="25"/>
            <line x1="30" y1="30" x2="30" y2="25"/>
            <line x1="40" y1="30" x2="40" y2="25"/>
            <line x1="50" y1="30" x2="50" y2="25"/>
            <line x1="60" y1="30" x2="60" y2="25"/>
            <path d="M20 20 L60 20"/>
            <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3"/>
            <path d="M85 30 L90 25"/>
            <path d="M88 35 L95 33"/>
            <path d="M88 45 L95 47"/>
            <path d="M85 50 L90 55"/>
        </svg>`
    },
    {
        id: 7,
        name: "Phlogiston Containment Vessel",
        category: "curiosities",
        price: 445,
        description: "Safely stores volatile phlogistic substances. Triple-walled construction with lead-lined interior for maximum safety.",
        specs: ["Capacity: 2L", "Triple-walled", "Patent #4,556"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="25" y="15" width="50" height="55" rx="5"/>
            <rect x="30" y="20" width="40" height="45" rx="3"/>
            <ellipse cx="50" cy="15" rx="20" ry="5"/>
            <line x1="35" y1="30" x2="65" y2="30"/>
            <line x1="35" y1="45" x2="65" y2="45"/>
            <line x1="35" y1="55" x2="65" y2="55"/>
            <circle cx="50" cy="65" r="5"/>
            <path d="M45 65 Q50 75 55 65"/>
            <line x1="40" y1="10" x2="40" y2="15"/>
            <line x1="50" y1="8" x2="50" y2="15"/>
            <line x1="60" y1="10" x2="60" y2="15"/>
        </svg>`
    },
    {
        id: 8,
        name: "Oneirograph",
        category: "curiosities",
        price: 920,
        description: "Records and replays dreams on treated parchment. A marvel of modern somnambulist engineering.",
        specs: ["Parchment roll", "Brass stylus", "Patent #8,221"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="30" cy="40" r="15"/>
            <circle cx="30" cy="40" r="10" stroke-dasharray="2,2"/>
            <circle cx="70" cy="40" r="15"/>
            <circle cx="70" cy="40" r="10" stroke-dasharray="2,2"/>
            <path d="M30 40 Q50 20 70 40"/>
            <path d="M30 40 Q50 60 70 40"/>
            <line x1="20" y1="40" x2="80" y2="40" stroke-dasharray="3,3"/>
            <circle cx="50" cy="40" r="5" fill="currentColor" opacity="0.2"/>
            <path d="M45 25 L55 25"/>
            <path d="M48 22 L52 28"/>
            <path d="M48 28 L52 22"/>
        </svg>`
    },
    {
        id: 9,
        name: "Mechanical Ocular Augmentation",
        category: "augmentations",
        price: 1240,
        description: "Replaces eye with multi-spectral brass lens. See in darkness, perceive heat signatures, and magnify distant objects.",
        specs: ["12x magnification", "Night vision", "Patent #9,001"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="50" cy="40" r="25"/>
            <circle cx="50" cy="40" r="20"/>
            <circle cx="50" cy="40" r="12" fill="currentColor" opacity="0.2"/>
            <circle cx="50" cy="40" r="6"/>
            <circle cx="50" cy="40" r="2" fill="currentColor"/>
            <path d="M25 40 Q15 30 10 35"/>
            <path d="M25 40 Q15 50 10 45"/>
            <path d="M75 40 Q85 30 90 35"/>
            <path d="M75 40 Q85 50 90 45"/>
            <line x1="50" y1="15" x2="50" y2="20"/>
            <line x1="50" y1="60" x2="50" y2="65"/>
            <line x1="25" y1="40" x2="30" y2="40"/>
            <line x1="70" y1="40" x2="75" y2="40"/>
        </svg>`
    },
    {
        id: 10,
        name: "Pneumatic Grip Enhancer",
        category: "augmentations",
        price: 780,
        description: "Increases hand strength by a factor of ten. Brass and leather construction with adjustable pressure valves.",
        specs: ["10x strength", "Leather straps", "Patent #8,445"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 30 Q25 20 40 25 L55 20 Q65 18 70 25 L80 30 Q85 35 80 40 L70 45 Q65 50 55 48 L40 55 Q25 60 20 50 Z"/>
            <circle cx="35" cy="35" r="8"/>
            <circle cx="35" cy="35" r="4" fill="currentColor" opacity="0.3"/>
            <path d="M45 25 L50 15"/>
            <path d="M55 20 L60 10"/>
            <path d="M65 22 L70 12"/>
            <circle cx="50" cy="15" r="3"/>
            <circle cx="60" cy="10" r="3"/>
            <circle cx="70" cy="12" r="3"/>
            <line x1="25" y1="45" x2="35" y2="50"/>
            <line x1="30" y1="48" x2="40" y2="53"/>
        </svg>`
    },
    {
        id: 11,
        name: "Clockwork Cardiac Regulator",
        category: "augmentations",
        price: 2100,
        description: "Precision-engineered replacement heart mechanism. Wound weekly via the key at the sternum. Guaranteed for life.",
        specs: ["72 BPM", "Wind weekly", "Patent #9,887"],
        svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M50 20 Q65 10 75 25 Q85 40 70 55 Q55 70 50 65 Q45 70 30 55 Q15 40 25 25 Q35 10 50 20 Z"/>
            <circle cx="50" cy="40" r="12"/>
            <circle cx="50" cy="40" r="6" fill="currentColor" opacity="0.2"/>
            <line x1="50" y1="40" x2="58" y2="32"/>
            <line x1="50" y1="40" x2="50" y2="48"/>
            <path d="M42 30 L58 30"/>
            <path d="M42 50 L58 50"/>
            <circle cx="50" cy="15" r="4"/>
            <line x1="50" y1="11" x2="50" y2="6"/>
            <circle cx="50" cy="6" r="2" fill="currentColor"/>
        </svg>`
    }
];

// ---------- State ----------
let cart = [];
let currentCategory = 'all';

// ---------- DOM Elements ----------
const productsGrid = document.getElementById('productsGrid');
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutClose = document.getElementById('checkoutClose');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutSummary = document.getElementById('checkoutSummary');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const pneumaticTube = document.getElementById('pneumaticTube');
const navLinks = document.querySelectorAll('.nav-link');

// ---------- Utility Functions ----------
function formatPrice(price) {
    return `£${price.toLocaleString()}`;
}

function generateOrderNumber() {
    const year = new Date().getFullYear();
    const num = Math.floor(Math.random() * 9000) + 1000;
    return `A&B-${year}-${num}`;
}

// ---------- Product Rendering ----------
function renderProducts(category = 'all') {
    productsGrid.innerHTML = '';
    
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    filtered.forEach((product, index) => {
        const card = document.createElement('article');
        card.className = 'product-card reveal';
        card.dataset.category = product.category;
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <span class="product-card__rivet product-card__rivet--tl"></span>
            <span class="product-card__rivet product-card__rivet--tr"></span>
            <span class="product-card__rivet product-card__rivet--bl"></span>
            <span class="product-card__rivet product-card__rivet--br"></span>
            <div class="product-card__image">
                <span class="product-card__category">${getCategoryLabel(product.category)}</span>
                <span class="product-card__number">No. ${String(product.id).padStart(3, '0')}</span>
                ${product.svg}
            </div>
            <div class="product-card__info">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__desc">${product.description}</p>
                <div class="product-card__specs">
                    ${product.specs.map(spec => `<span class="product-card__spec">${spec}</span>`).join('')}
                </div>
                <div class="product-card__footer">
                    <div class="product-card__price">
                        <span class="product-card__price-label">Price</span>
                        ${formatPrice(product.price)}
                    </div>
                    <button class="btn-add-to-cart" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(card);
        
        // Trigger reveal animation
        setTimeout(() => {
            card.classList.add('is-visible');
        }, 100 + (index * 100));
    });
    
    // Attach event listeners to add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });
}

function getCategoryLabel(category) {
    const labels = {
        'contraptions': 'Brass Contraption',
        'curiosities': 'Arcane Curiosity',
        'augmentations': 'Mechanical Augmentation'
    };
    return labels[category] || category;
}

// ---------- Category Filtering ----------
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        currentCategory = link.dataset.category;
        renderProducts(currentCategory);
    });
});

// ---------- Cart Functions ----------
function handleAddToCart(e) {
    const btn = e.currentTarget;
    const productId = parseInt(btn.dataset.productId);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Pneumatic animation
    animatePneumatic(btn);
    
    // Add to cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    // Update UI
    updateCartUI();
    showNotification(`${product.name} added to your requisitions`);
    
    // Button feedback
    btn.classList.add('added');
    btn.querySelector('span').textContent = 'Added ✓';
    setTimeout(() => {
        btn.classList.remove('added');
        btn.querySelector('span').textContent = 'Add to Cart';
    }, 1500);
}

function updateCartUI() {
    // Update count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Animate badge
    cartCount.classList.add('bump');
    setTimeout(() => cartCount.classList.remove('bump'), 300);
    
    // Update cart items
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartFooter.style.display = 'none';
        // Clear existing items
        document.querySelectorAll('.cart-item').forEach(item => item.remove());
    } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        
        // Remove old items
        document.querySelectorAll('.cart-item').forEach(item => item.remove());
        
        // Add cart items
        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartItems.insertBefore(cartItem, cartEmpty);
        });
        
        // Update totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 12 : 0;
        cartSubtotal.textContent = formatPrice(subtotal);
        document.getElementById('cartShipping').textContent = formatPrice(shipping);
        cartTotal.textContent = formatPrice(subtotal + shipping);
    }
}

function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.productId = item.id;
    
    div.innerHTML = `
        <div class="cart-item__image">
            ${item.svg}
        </div>
        <div class="cart-item__details">
            <h4 class="cart-item__name">${item.name}</h4>
            <p class="cart-item__price">${formatPrice(item.price)}</p>
            <div class="cart-item__controls">
                <button class="qty-btn qty-decrease" data-product-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="cart-item__qty">${item.quantity}</span>
                <button class="qty-btn qty-increase" data-product-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
        </div>
        <button class="cart-item__remove" data-product-id="${item.id}" aria-label="Remove ${item.name} from cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `;
    
    // Event listeners
    div.querySelector('.qty-decrease').addEventListener('click', () => updateQuantity(item.id, -1));
    div.querySelector('.qty-increase').addEventListener('click', () => updateQuantity(item.id, 1));
    div.querySelector('.cart-item__remove').addEventListener('click', () => removeFromCart(item.id));
    
    return div;
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    updateCartUI();
}

function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
    if (item) {
        showNotification(`${item.name} removed from requisitions`);
    }
}

// ---------- Cart Panel ----------
function openCart() {
    cartPanel.classList.add('is-open');
    cartPanel.setAttribute('aria-hidden', 'false');
    cartToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartPanel.classList.remove('is-open');
    cartPanel.setAttribute('aria-hidden', 'true');
    cartToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ---------- Checkout Modal ----------
function openCheckout() {
    closeCart();
    setTimeout(() => {
        renderCheckoutSummary();
        checkoutModal.classList.add('is-open');
        checkoutModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }, 300);
}

function closeCheckout() {
    checkoutModal.classList.remove('is-open');
    checkoutModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

checkoutBtn.addEventListener('click', openCheckout);
checkoutClose.addEventListener('click', closeCheckout);
checkoutOverlay.addEventListener('click', closeCheckout);

function renderCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 12 : 0;
    const total = subtotal + shipping;
    
    let html = '<div class="checkout-modal__divider" aria-hidden="true"></div>';
    
    cart.forEach(item => {
        html += `
            <div class="cart-item" style="border-bottom: none; padding: 8px 0;">
                <div class="cart-item__details">
                    <h4 class="cart-item__name">${item.name} × ${item.quantity}</h4>
                    <p class="cart-item__price">${formatPrice(item.price * item.quantity)}</p>
                </div>
            </div>
        `;
    });
    
    html += `
        <div class="cart-panel__row" style="margin-top: 12px;">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
        </div>
        <div class="cart-panel__row">
            <span>Pneumatic Dispatch</span>
            <span>${formatPrice(shipping)}</span>
        </div>
        <div class="cart-panel__row cart-panel__row--total">
            <span>Total Due</span>
            <span>${formatPrice(total)}</span>
        </div>
    `;
    
    checkoutSummary.innerHTML = html;
}

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const orderNumber = generateOrderNumber();
    const name = document.getElementById('customerName').value;
    
    closeCheckout();
    showNotification(`Order ${orderNumber} confirmed! Thank you, ${name.split(' ')[0]}.`);
    
    // Clear cart
    cart = [];
    updateCartUI();
    checkoutForm.reset();
});

// ---------- Pneumatic Animation ----------
function animatePneumatic(sourceBtn) {
    const rect = sourceBtn.getBoundingClientRect();
    const cartBtnRect = cartToggle.getBoundingClientRect();
    
    pneumaticTube.style.left = `${rect.left + rect.width / 2 - 20}px`;
    pneumaticTube.style.top = `${rect.top + rect.height / 2 - 20}px`;
    pneumaticTube.classList.add('is-animating');
    
    const capsule = pneumaticTube.querySelector('.tube__capsule');
    
    // Animate from button to cart
    const deltaX = cartBtnRect.left - rect.left;
    const deltaY = cartBtnRect.top - rect.top;
    
    capsule.style.transition = 'none';
    capsule.style.transform = 'translate(0, 0) scale(1)';
    
    requestAnimationFrame(() => {
        capsule.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
        capsule.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.5)`;
    });
    
    setTimeout(() => {
        pneumaticTube.classList.remove('is-animating');
        capsule.style.transition = 'none';
        capsule.style.transform = 'translate(0, 0) scale(1)';
    }, 700);
}

// ---------- Notification ----------
function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.add('is-visible');
    
    setTimeout(() => {
        notification.classList.remove('is-visible');
    }, 2500);
}

// ---------- Scroll Reveal ----------
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.is-visible)');
    
    reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight - 50) {
            el.classList.add('is-visible');
        }
    });
}

// ---------- Price Ticker ----------
function duplicateTickerItems() {
    const track = document.querySelector('.ticker__track');
    if (!track) return;
    
    const items = track.innerHTML;
    track.innerHTML = items + items; // Duplicate for seamless scroll
}

// ---------- Header Scroll Effect ----------
function handleHeaderScroll() {
    const header = document.getElementById('header');
    
    if (window.scrollY > 50) {
        header.style.background = 'linear-gradient(180deg, rgba(13, 10, 7, 0.98) 0%, rgba(18, 14, 10, 0.98) 100%)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '';
        header.style.backdropFilter = '';
    }
}

// ---------- Keyboard Navigation ----------
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (checkoutModal.classList.contains('is-open')) {
            closeCheckout();
        } else if (cartPanel.classList.contains('is-open')) {
            closeCart();
        }
    }
});

// ---------- Initialization ----------
document.addEventListener('DOMContentLoaded', () => {
    // Render products
    renderProducts();
    
    // Setup ticker
    duplicateTickerItems();
    
    // Scroll listeners
    window.addEventListener('scroll', () => {
        handleScrollReveal();
        handleHeaderScroll();
    }, { passive: true });
    
    // Initial reveal check
    handleScrollReveal();
    
    // Cart is initially empty
    updateCartUI();
});