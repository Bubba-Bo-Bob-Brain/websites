/* ============================================
   THE BRASS EMPORIUM — STEAMPUNK E-COMMERCE JS
   Gears, Steam & Commerce
   ============================================ */

// ==========================================
// PRODUCT DATA
// ==========================================
const PRODUCTS = [
    {
        id: 1,
        name: "Whispering Chronometer Mk.IV",
        category: "brass-contraptions",
        description: "A precision timepiece that whispers the hour in seventeen languages, including three lost to time itself.",
        price: 147,
        pence: 50,
        stock: 3,
        patent: "PAT. No. 4782",
        illustration: "chronometer"
    },
    {
        id: 2,
        name: "Ætheric Resonance Crystal",
        category: "arcane-curiosities",
        description: "Harvested from the depths of the Carpathian mines, this crystal hums with otherworldly frequencies.",
        price: 89,
        pence: 0,
        stock: 7,
        patent: "CUR. No. 1205",
        illustration: "crystal"
    },
    {
        id: 3,
        name: "Brass Octo-Limb Attachment",
        category: "mechanical-augmentations",
        description: "Eight articulated tentacles of finest brass, perfect for the discerning inventor requiring extra appendages.",
        price: 312,
        pence: 75,
        stock: 2,
        patent: "AUG. No. 0391",
        illustration: "tentacle"
    },
    {
        id: 4,
        name: "Pneumatic Message Cylinder",
        category: "brass-contraptions",
        description: "Send correspondence through the Royal Tube Network at speeds exceeding a locomotive's pace.",
        price: 56,
        pence: 25,
        stock: 15,
        patent: "PAT. No. 2247",
        illustration: "cylinder"
    },
    {
        id: 5,
        name: "Spirit-Touched Brass Compass",
        category: "arcane-curiosities",
        description: "Points not to magnetic north, but to whatever the holder desires most in this world.",
        price: 178,
        pence: 0,
        stock: 4,
        patent: "CUR. No. 0887",
        illustration: "compass"
    },
    {
        id: 6,
        name: "Steam-Powered Gauntlet",
        category: "mechanical-augmentations",
        description: "Crush coal into diamonds with this formidable brass gauntlet. Warning: requires daily boiler maintenance.",
        price: 245,
        pence: 90,
        stock: 5,
        patent: "AUG. No. 1156",
        illustration: "gauntlet"
    },
    {
        id: 7,
        name: "Voltaic Illumination Engine",
        category: "brass-contraptions",
        description: "Harness the very lightning itself to illuminate your laboratory with an ethereal blue-white glow.",
        price: 198,
        pence: 50,
        stock: 6,
        patent: "PAT. No. 3301",
        illustration: "lamp"
    },
    {
        id: 8,
        name: "Alchemical Transmutation Vial",
        category: "arcane-curiosities",
        description: "Contains three drops of genuine Philosopher's Essence. Use sparingly—lead to gold, but at what cost?",
        price: 456,
        pence: 0,
        stock: 1,
        patent: "CUR. No. 0001",
        illustration: "vial"
    },
    {
        id: 9,
        name: "Optical Enhancement Monocle",
        category: "mechanical-augmentations",
        description: "See through walls, read minds, and magnify text to 200×. Includes leather carrying case and polishing cloth.",
        price: 267,
        pence: 30,
        stock: 8,
        patent: "AUG. No. 2744",
        illustration: "monocle"
    }
];

// ==========================================
// SVG PATENT ILLUSTRATIONS
// ==========================================
const ILLUSTRATIONS = {
    chronometer: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="60" cy="45" r="35" stroke-width="2"/>
        <circle cx="60" cy="45" r="30"/>
        <circle cx="60" cy="45" r="3"/>
        <line x1="60" y1="45" x2="60" y2="22" stroke-width="2"/>
        <line x1="60" y1="45" x2="78" y2="52" stroke-width="1.5"/>
        <g stroke-width="1">
            <line x1="60" y1="12" x2="60" y2="16"/>
            <line x1="60" y1="74" x2="60" y2="78"/>
            <line x1="22" y1="45" x2="26" y2="45"/>
            <line x1="94" y1="45" x2="98" y2="45"/>
        </g>
        <path d="M85 15 Q95 10, 90 25" stroke-width="1"/>
        <circle cx="88" cy="18" r="2" fill="currentColor"/>
        <rect x="50" y="78" width="20" height="8" rx="2"/>
        <line x1="55" y1="82" x2="65" y2="82"/>
    </svg>`,

    crystal: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="60,8 85,35 78,82 42,82 35,35" stroke-width="2"/>
        <polygon points="60,8 75,30 60,50 45,30"/>
        <line x1="35" y1="35" x2="45" y2="30"/>
        <line x1="85" y1="35" x2="75" y2="30"/>
        <line x1="42" y1="82" x2="60" y2="50"/>
        <line x1="78" y1="82" x2="60" y2="50"/>
        <circle cx="60" cy="40" r="5" stroke-dasharray="2 2"/>
        <circle cx="60" cy="40" r="2" fill="currentColor"/>
        <path d="M50 25 Q60 20, 70 25" stroke-width="1"/>
        <path d="M48 55 Q60 50, 72 55" stroke-width="1"/>
        <line x1="25" y1="50" x2="35" y2="45" stroke-width="1" stroke-dasharray="3 3"/>
        <line x1="95" y1="50" x2="85" y2="45" stroke-width="1" stroke-dasharray="3 3"/>
        <circle cx="22" cy="52" r="2" stroke-width="1"/>
        <circle cx="98" cy="52" r="2" stroke-width="1"/>
    </svg>`,

    tentacle: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="45" y="5" width="30" height="20" rx="3" stroke-width="2"/>
        <circle cx="60" cy="15" r="5"/>
        <line x1="52" y1="25" x2="52" y2="35"/>
        <line x1="60" y1="25" x2="60" y2="35"/>
        <line x1="68" y1="25" x2="68" y2="35"/>
        <path d="M52 35 Q40 50, 30 70 Q28 75, 35 78" stroke-width="2"/>
        <path d="M60 35 Q60 55, 55 75 Q53 82, 60 85" stroke-width="2"/>
        <path d="M68 35 Q80 50, 90 70 Q92 75, 85 78" stroke-width="2"/>
        <circle cx="33" cy="77" r="2" fill="currentColor"/>
        <circle cx="58" cy="84" r="2" fill="currentColor"/>
        <circle cx="87" cy="77" r="2" fill="currentColor"/>
        <g stroke-width="1" stroke-dasharray="2 2">
            <path d="M48 32 Q38 42, 28 60"/>
            <path d="M64 32 Q74 42, 84 60"/>
        </g>
        <line x1="40" y1="12" x2="45" y2="12" stroke-width="1"/>
        <line x1="75" y1="12" x2="80" y2="12" stroke-width="1"/>
    </svg>`,

    cylinder: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="60" cy="20" rx="25" ry="8" stroke-width="2"/>
        <line x1="35" y1="20" x2="35" y2="70"/>
        <line x1="85" y1="20" x2="85" y2="70"/>
        <ellipse cx="60" cy="70" rx="25" ry="8" stroke-width="2"/>
        <ellipse cx="60" cy="70" rx="15" ry="5" stroke-dasharray="3 2"/>
        <line x1="60" y1="12" x2="60" y2="5"/>
        <circle cx="60" cy="3" r="3"/>
        <path d="M42 35 Q60 30, 78 35" stroke-width="1"/>
        <path d="M42 50 Q60 45, 78 50" stroke-width="1"/>
        <circle cx="60" cy="58" r="4"/>
        <circle cx="60" cy="58" r="1.5" fill="currentColor"/>
        <rect x="50" y="75" width="20" height="6" rx="1" stroke-width="1"/>
    </svg>`,

    compass: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="60" cy="45" r="35" stroke-width="2"/>
        <circle cx="60" cy="45" r="30"/>
        <circle cx="60" cy="45" r="4" fill="currentColor"/>
        <polygon points="60,15 65,45 60,50 55,45" fill="currentColor" opacity="0.7"/>
        <polygon points="60,75 65,45 60,40 55,45" opacity="0.5"/>
        <text x="58" y="25" font-size="8" fill="currentColor" font-family="serif" font-weight="bold">N</text>
        <text x="58" y="72" font-size="6" fill="currentColor" font-family="serif">S</text>
        <text x="88" y="48" font-size="6" fill="currentColor" font-family="serif">E</text>
        <text x="25" y="48" font-size="6" fill="currentColor" font-family="serif">W</text>
        <g stroke-width="1">
            <line x1="60" y1="8" x2="60" y2="12"/>
            <line x1="60" y1="78" x2="60" y2="82"/>
            <line x1="22" y1="45" x2="26" y2="45"/>
            <line x1="94" y1="45" x2="98" y2="45"/>
        </g>
        <circle cx="60" cy="45" r="20" stroke-dasharray="4 4" stroke-width="0.5"/>
    </svg>`,

    gauntlet: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 15 L40 75 Q40 85, 50 85 L70 85 Q80 85, 80 75 L80 15" stroke-width="2"/>
        <rect x="35" y="10" width="50" height="12" rx="2"/>
        <line x1="35" y1="30" x2="85" y2="30"/>
        <line x1="35" y1="50" x2="85" y2="50"/>
        <line x1="35" y1="70" x2="85" y2="70"/>
        <circle cx="48" cy="20" r="3"/>
        <circle cx="60" cy="20" r="3"/>
        <circle cx="72" cy="20" r="3"/>
        <circle cx="48" cy="40" r="2" fill="currentColor"/>
        <circle cx="60" cy="40" r="2" fill="currentColor"/>
        <circle cx="72" cy="40" r="2" fill="currentColor"/>
        <path d="M45 55 Q60 48, 75 55" stroke-width="1"/>
        <circle cx="88" cy="55" r="8"/>
        <circle cx="88" cy="55" r="4" stroke-dasharray="2 2"/>
        <circle cx="88" cy="55" r="1.5" fill="currentColor"/>
        <line x1="96" y1="55" x2="108" y2="55" stroke-width="1"/>
        <path d="M105 52 L112 55 L105 58" fill="currentColor"/>
    </svg>`,

    lamp: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="48" y="70" width="24" height="15" rx="2" stroke-width="2"/>
        <line x1="60" y1="55" x2="60" y2="70"/>
        <rect x="55" y="52" width="10" height="5" rx="1"/>
        <path d="M40 55 L40 35 Q40 15, 60 10 Q80 15, 80 35 L80 55" stroke-width="2"/>
        <ellipse cx="60" cy="55" rx="20" ry="5" stroke-width="2"/>
        <circle cx="60" cy="35" r="6" stroke-dasharray="3 2"/>
        <circle cx="60" cy="35" r="2" fill="currentColor"/>
        <g stroke-width="1" opacity="0.6">
            <line x1="60" y1="5" x2="60" y2="0"/>
            <line x1="45" y1="8" x2="40" y2="2"/>
            <line x1="75" y1="8" x2="80" y2="2"/>
            <line x1="30" y1="20" x2="24" y2="16"/>
            <line x1="90" y1="20" x2="96" y2="16"/>
        </g>
        <path d="M42 42 Q50 38, 58 42" stroke-width="0.5" stroke-dasharray="2 2"/>
        <path d="M62 42 Q70 38, 78 42" stroke-width="0.5" stroke-dasharray="2 2"/>
    </svg>`,

    vial: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="50" y="5" width="20" height="12" rx="2" stroke-width="2"/>
        <line x1="55" y1="17" x2="55" y2="25"/>
        <line x1="65" y1="17" x2="65" y2="25"/>
        <path d="M55 25 Q55 30, 45 35 L45 75 Q45 85, 60 85 Q75 85, 75 75 L75 35 Q65 30, 65 25" stroke-width="2"/>
        <path d="M45 55 Q60 50, 75 55" stroke-width="1"/>
        <ellipse cx="60" cy="65" rx="12" ry="6" fill="currentColor" opacity="0.15"/>
        <circle cx="55" cy="62" r="2" fill="currentColor" opacity="0.4"/>
        <circle cx="63" cy="68" r="1.5" fill="currentColor" opacity="0.3"/>
        <circle cx="58" cy="70" r="1" fill="currentColor" opacity="0.5"/>
        <g stroke-width="1" stroke-dasharray="2 2" opacity="0.5">
            <path d="M50 45 Q60 40, 70 45"/>
            <circle cx="60" cy="50" r="3"/>
        </g>
        <line x1="42" y1="11" x2="48" y2="11" stroke-width="1"/>
        <line x1="72" y1="11" x2="78" y2="11" stroke-width="1"/>
    </svg>`,

    monocle: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="60" cy="45" r="30" stroke-width="2.5"/>
        <circle cx="60" cy="45" r="25"/>
        <circle cx="60" cy="45" r="20" stroke-dasharray="3 2"/>
        <circle cx="60" cy="45" r="10" stroke-width="1"/>
        <circle cx="60" cy="45" r="3" fill="currentColor"/>
        <path d="M90 45 Q100 45, 105 40 L108 30" stroke-width="2"/>
        <circle cx="108" cy="28" r="3" fill="currentColor"/>
        <g stroke-width="1" opacity="0.5">
            <line x1="60" y1="12" x2="60" y2="18"/>
            <line x1="60" y1="72" x2="60" y2="78"/>
            <line x1="27" y1="45" x2="33" y2="45"/>
            <line x1="87" y1="45" x2="93" y2="45"/>
        </g>
        <path d="M40 30 Q50 25, 60 28" stroke-width="0.5" stroke-dasharray="2 2"/>
        <path d="M40 60 Q50 65, 60 62" stroke-width="0.5" stroke-dasharray="2 2"/>
    </svg>`
};

// ==========================================
// CART STATE
// ==========================================
let cart = [];

// ==========================================
// DOM REFERENCES
// ==========================================
const DOM = {
    productGrid: document.getElementById('product-grid'),
    filterBar: document.getElementById('filter-bar'),
    cartToggle: document.getElementById('cart-toggle'),
    cartOverlay: document.getElementById('cart-overlay'),
    cartBackdrop: document.getElementById('cart-backdrop'),
    cartClose: document.getElementById('cart-close'),
    cartItems: document.getElementById('cart-items'),
    cartEmpty: document.getElementById('cart-empty'),
    cartFooter: document.getElementById('cart-footer'),
    cartTotalValue: document.getElementById('cart-total-value'),
    cartCountBadge: document.getElementById('cart-count-badge'),
    checkoutBtn: document.getElementById('checkout-btn'),
    pneumaticTube: document.getElementById('pneumatic-tube'),
    addNotification: document.getElementById('add-notification'),
    steamContainer: document.getElementById('steam-container'),
    heroGear1: document.getElementById('hero-gear-1'),
    heroGear2: document.getElementById('hero-gear-2'),
    heroGear3: document.getElementById('hero-gear-3'),
    heroGear4: document.getElementById('hero-gear-4'),
    logoGear: document.getElementById('logo-gear'),
    footerGearDivider: document.getElementById('footer-gear-divider')
};

// ==========================================
// PRODUCT RENDERING
// ==========================================
function renderProducts(category = 'all') {
    const filtered = category === 'all'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === category);

    DOM.productGrid.innerHTML = '';

    filtered.forEach((product, index) => {
        const card = createProductCard(product, index);
        DOM.productGrid.appendChild(card);
    });
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.08}s`;
    card.dataset.productId = product.id;

    const categoryLabel = formatCategory(product.category);
    const illustration = ILLUSTRATIONS[product.illustration] || ILLUSTRATIONS.chronometer;

    card.innerHTML = `
        <div class="card-inner">
            <span class="card-category-badge">${categoryLabel}</span>
            <div class="card-illustration" data-patent="${product.patent}">
                ${illustration}
            </div>
            <h3 class="card-name">${product.name}</h3>
            <p class="card-description">${product.description}</p>
            <div class="card-divider">
                <div class="card-divider-gear"></div>
            </div>
            <div class="card-price-row">
                <div class="card-price-ticker">
                    <div class="price-gear"></div>
                    <span class="card-price">
                        £${product.price}<span class="card-price-pence">.${String(product.pence).padStart(2, '0')}</span>
                    </span>
                </div>
                <div class="card-stock">
                    <span class="stock-dot"></span>
                    <span>${product.stock} in stock</span>
                </div>
            </div>
            <button class="add-to-cart-btn" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">
                Add to Requisition
            </button>
        </div>
        <div class="card-bottom-rivets"></div>
    `;

    // Add to cart event
    const btn = card.querySelector('.add-to-cart-btn');
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id, btn);
    });

    return card;
}

function formatCategory(category) {
    return category
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

// ==========================================
// CART FUNCTIONALITY
// ==========================================
function addToCart(productId, buttonElement) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification(`Only ${product.stock} units of <strong>${product.name}</strong> available.`);
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            pence: product.pence,
            illustration: product.illustration,
            quantity: 1
        });
    }

    updateCartUI();
    triggerPneumaticAnimation(buttonElement);
    bumpBadge();
    showNotification(`<strong>${product.name}</strong> added to requisition!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const product = PRODUCTS.find(p => p.id === productId);
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
        removeFromCart(productId);
        return;
    }

    if (product && newQty > product.stock) {
        showNotification(`Maximum ${product.stock} units available.`);
        return;
    }

    item.quantity = newQty;
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => {
        return sum + (item.price + item.pence / 100) * item.quantity;
    }, 0);

    // Update badge
    DOM.cartCountBadge.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        DOM.cartEmpty.style.display = 'block';
        DOM.cartFooter.style.display = 'none';
        DOM.cartItems.innerHTML = '';
        DOM.cartItems.appendChild(DOM.cartEmpty);
    } else {
        DOM.cartEmpty.style.display = 'none';
        DOM.cartFooter.style.display = 'block';
        renderCartItems();
    }

    // Update total
    DOM.cartTotalValue.textContent = `£${totalPrice.toFixed(2)}`;
}

function renderCartItems() {
    // Keep the empty element but hide it
    DOM.cartItems.innerHTML = '';

    cart.forEach(item => {
        const illustration = ILLUSTRATIONS[item.illustration] || ILLUSTRATIONS.chronometer;
        const itemPrice = (item.price + item.pence / 100) * item.quantity;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-illustration">
                ${illustration}
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">£${itemPrice.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn qty-decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="qty-btn qty-increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
                    <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">Remove</button>
                </div>
            </div>
        `;

        // Event listeners
        itemEl.querySelector('.qty-decrease').addEventListener('click', () => {
            updateQuantity(item.id, -1);
        });

        itemEl.querySelector('.qty-increase').addEventListener('click', () => {
            updateQuantity(item.id, 1);
        });

        itemEl.querySelector('.cart-item-remove').addEventListener('click', () => {
            removeFromCart(item.id);
        });

        DOM.cartItems.appendChild(itemEl);
    });
}

// ==========================================
// CART PANEL TOGGLE
// ==========================================
function openCart() {
    DOM.cartOverlay.classList.add('open');
    DOM.cartOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    DOM.cartOverlay.classList.remove('open');
    DOM.cartOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

DOM.cartToggle.addEventListener('click', openCart);
DOM.cartClose.addEventListener('click', closeCart);
DOM.cartBackdrop.addEventListener('click', closeCart);

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.cartOverlay.classList.contains('open')) {
        closeCart();
    }
});

// ==========================================
// CATEGORY FILTERING
// ==========================================
DOM.filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // Update active state
    DOM.filterBar.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Filter products
    const category = btn.dataset.category;
    renderProducts(category);
});

// ==========================================
// PNEUMATIC TUBE ANIMATION
// ==========================================
function triggerPneumaticAnimation(buttonElement) {
    const rect = buttonElement.getBoundingClientRect();
    const cartRect = DOM.cartToggle.getBoundingClientRect();

    // Create capsule
    const capsule = document.createElement('div');
    capsule.className = 'pneumatic-capsule';

    // Starting position (center of button)
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Ending position (cart icon)
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    // Set initial position
    capsule.style.left = `${startX}px`;
    capsule.style.top = `${startY}px`;

    DOM.pneumaticTube.appendChild(capsule);
    DOM.pneumaticTube.classList.add('active');

    // Animate using Web Animations API for smooth arc trajectory
    const animation = capsule.animate([
        {
            left: `${startX}px`,
            top: `${startY}px`,
            opacity: 1,
            transform: 'scale(1) rotate(0deg)'
        },
        {
            left: `${(startX + endX) / 2}px`,
            top: `${Math.min(startY, endY) - 80}px`,
            opacity: 1,
            transform: 'scale(0.8) rotate(180deg)',
            offset: 0.4
        },
        {
            left: `${endX}px`,
            top: `${endY}px`,
            opacity: 0,
            transform: 'scale(0.2) rotate(360deg)'
        }
    ], {
        duration: 700,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
    });

    animation.onfinish = () => {
        capsule.remove();
        DOM.pneumaticTube.classList.remove('active');
    };
}

// ==========================================
// BADGE BUMP ANIMATION
// ==========================================
function bumpBadge() {
    DOM.cartCountBadge.classList.remove('bump');
    // Force reflow
    void DOM.cartCountBadge.offsetWidth;
    DOM.cartCountBadge.classList.add('bump');
}

// ==========================================
// NOTIFICATION
// ==========================================
let notificationTimeout = null;

function showNotification(message) {
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    DOM.addNotification.innerHTML = message;
    DOM.addNotification.classList.add('show');

    notificationTimeout = setTimeout(() => {
        DOM.addNotification.classList.remove('show');
        notificationTimeout = null;
    }, 2500);
}

// ==========================================
// CHECKOUT
// ==========================================
DOM.checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => {
        return sum + (item.price + item.pence / 100) * item.quantity;
    }, 0);

    // Clear cart
    cart = [];
    updateCartUI();
    closeCart();

    showNotification(
        `Requisition complete! ${totalItems} items totaling <strong>£${totalPrice.toFixed(2)}</strong> dispatched via pneumatic post.`
    );
});

// ==========================================
// STEAM PARTICLE SYSTEM
// ==========================================
function createSteamParticle() {
    if (!DOM.steamContainer) return;

    const particle = document.createElement('div');
    particle.className = 'steam-particle';

    // Random properties
    const size = Math.random() * 60 + 20;
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 20;
    const duration = Math.random() * 8 + 8;
    const drift = (Math.random() - 0.5) * 200;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.setProperty('--drift', `${drift}px`);
    particle.style.animationDuration = `${duration}s`;

    DOM.steamContainer.appendChild(particle);

    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// Create steam particles periodically
function startSteamSystem() {
    // Initial burst
    for (let i = 0; i < 5; i++) {
        setTimeout(createSteamParticle, i * 300);
    }

    // Ongoing particles
    setInterval(createSteamParticle, 1500);
}

// ==========================================
// SCROLL REVEAL
// ==========================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe sections
    document.querySelectorAll('.catalogue, .site-footer').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ==========================================
// GEAR DECORATIONS IN FOOTER
// ==========================================
function initDecorativeGears() {
    // Add small spinning gears to the hero background
    const heroGears = document.querySelectorAll('.hero-bg-gear');
    heroGears.forEach((gear, i) => {
        // Already styled via CSS
    });
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrollY = window.scrollY;

    if (scrollY > 100) {
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.7), 0 2px 0 var(--brass-dark)';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5), 0 2px 0 var(--brass-dark)';
    }

    lastScrollY = scrollY;
}, { passive: true });

// ==========================================
// PRICE TICKER ANIMATION (on hover)
// ==========================================
document.addEventListener('mouseenter', (e) => {
    const priceGear = e.target.closest('.price-gear');
    if (priceGear) {
        priceGear.style.animationDuration = '1s';
    }
}, true);

document.addEventListener('mouseleave', (e) => {
    const priceGear = e.target.closest('.price-gear');
    if (priceGear) {
        priceGear.style.animationDuration = '6s';
    }
}, true);

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    startSteamSystem();
    initScrollReveal();
    initDecorativeGears();

    // Console art for the curious
    console.log(`
    ⚙️ ═══════════════════════════════════════════ ⚙️
    
        THE BRASS EMPORIUM
        Est. 1847 — Purveyor of Fine Contraptions
        
        Welcome, curious inventor.
        Browse our catalogue of mechanical marvels.
    
    ⚙️ ═══════════════════════════════════════════ ⚙️
    `);
});