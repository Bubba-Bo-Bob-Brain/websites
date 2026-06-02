/* ============================================
   THE BRASS & COG EMPORIUM
   Victorian Steampunk E-Commerce JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initializeEmporium();
});

function initializeEmporium() {
    createSteamParticles();
    initializeProducts();
    initializeCart();
    initializeNavigation();
    initializeCheckout();
    initializeGears();
}

/* ============================================
   PRODUCT CATALOG
   ============================================ */

const products = [
    {
        id: 1,
        name: "Aetheric Resonance Compass",
        category: "curiosities",
        price: 2499,
        description: "Detects ethereal disturbances with precision-crafted brass needles suspended in distilled moonbeam essence.",
        specs: { material: "Brass & Crystal", weight: "340g", origin: "Edinburgh" },
        svgPath: "M50 10 L55 40 L50 50 L45 40 Z M10 50 L40 45 L50 50 L45 60 Z M50 10 L60 30 L50 50 L40 30 Z M10 50 L30 40 L50 50 L30 60 Z"
    },
    {
        id: 2,
        name: "Pneumatic Message Launcher",
        category: "contraptions",
        price: 1850,
        description: "Propels sealed capsules through copper tubing at remarkable velocity. Range: 200 yards.",
        specs: { material: "Copper & Leather", weight: "890g", origin: "Manchester" },
        svgPath: "M20 30 Q50 20 80 30 L80 70 Q50 80 20 70 Z M15 50 L85 50 M30 40 L30 60 M70 40 L70 60"
    },
    {
        id: 3,
        name: "Mechanical Third Eye",
        category: "augmentations",
        price: 4200,
        description: "Brass optical augmentation granting enhanced perception. Features adjustable magnification lens array.",
        specs: { material: "Brass & Optics", weight: "180g", origin: "Geneva" },
        svgPath: "M50 15 A35 35 0 1 1 50 85 A35 35 0 1 1 50 15 M50 30 A20 20 0 1 1 50 70 A20 20 0 1 1 50 30 M50 40 A10 10 0 1 1 50 60 A10 10 0 1 1 50 40"
    },
    {
        id: 4,
        name: "Chronometric Pocket Watch",
        category: "contraptions",
        price: 3150,
        description: "Precision timekeeping with exposed gear train. Features lunar phase indicator and temperature compensation.",
        specs: { material: "Sterling Silver", weight: "95g", origin: "Birmingham" },
        svgPath: "M50 10 A40 40 0 1 1 50 90 A40 40 0 1 1 50 10 M50 50 L50 25 M50 50 L65 50 M50 50 L35 65"
    },
    {
        id: 5,
        name: "Essence of Starlight Vial",
        category: "curiosities",
        price: 875,
        description: "Captured luminescence from the constellation Orion. Glows with ethereal blue radiance for decades.",
        specs: { material: "Crystal Glass", weight: "45g", origin: "Cairo" },
        svgPath: "M40 20 L40 40 L25 60 Q25 80 50 80 Q75 80 75 60 L60 40 L60 20 Z M45 20 L55 20"
    },
    {
        id: 6,
        name: "Clockwork Exo-Gauntlet",
        category: "augmentations",
        price: 5800,
        description: "Articulated brass glove with pneumatic actuators. Enhances grip strength tenfold.",
        specs: { material: "Brass & Steel", weight: "1.2kg", origin: "Prague" },
        svgPath: "M30 15 L30 45 L20 70 L25 75 L35 50 L40 80 L45 80 L40 50 L50 80 L55 80 L50 50 L60 80 L65 80 L60 50 L70 75 L75 70 L60 45 L60 15 Z"
    },
    {
        id: 7,
        name: "Automaton Canary Cage",
        category: "contraptions",
        price: 2200,
        description: "Mechanical songbird performs 12 distinct melodies. Wind-up mechanism operates for 6 hours.",
        specs: { material: "Brass & Gold", weight: "650g", origin: "Paris" },
        svgPath: "M20 30 Q50 15 80 30 L80 60 Q50 75 20 60 Z M50 40 L50 30 M45 45 L55 45 M30 50 L70 50"
    },
    {
        id: 8,
        name: "Eldritch Monocle",
        category: "curiosities",
        price: 1650,
        description: "Ground from meteorite glass, reveals hidden inscriptions and auras invisible to natural sight.",
        specs: { material: "Meteorite Glass", weight: "28g", origin: "Salem" },
        svgPath: "M50 15 A35 20 0 1 1 50 85 A35 20 0 1 1 50 15 M50 50 A20 12 0 1 1 50 50 A20 12 0 1 1 50 50"
    },
    {
        id: 9,
        name: "Subdermal Pressure Regulator",
        category: "augmentations",
        price: 7500,
        description: "Implantatic brass valve system. Maintains optimal blood pressure across all altitudes.",
        specs: { material: "Surgical Brass", weight: "12g", origin: "Vienna" },
        svgPath: "M50 10 L60 30 L80 30 L65 45 L70 65 L50 55 L30 65 L35 45 L20 30 L40 30 Z M50 35 A8 8 0 1 1 50 51 A8 8 0 1 1 50 35"
    }
];

/* ============================================
   CART STATE
   ============================================ */

let cart = [];
let currentCategory = 'all';

/* ============================================
   DOM ELEMENTS
   ============================================ */

const elements = {
    productGrid: document.getElementById('productGrid'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartOverlay: document.getElementById('cartOverlay'),
    cartButton: document.getElementById('cartButton'),
    cartClose: document.getElementById('cartClose'),
    cartItems: document.getElementById('cartItems'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartCountBadge: document.getElementById('cartCountBadge'),
    gaugeNeedle: document.getElementById('gaugeNeedle'),
    priceTicker: document.getElementById('priceTicker'),
    checkoutModal: document.getElementById('checkoutModal'),
    checkoutButton: document.getElementById('checkoutButton'),
    confirmButton: document.getElementById('confirmButton'),
    cancelButton: document.getElementById('cancelButton'),
    checkoutSummary: document.getElementById('checkoutSummary'),
    toast: document.getElementById('toast'),
    steamContainer: document.getElementById('steamContainer'),
    pneumaticTube: document.getElementById('pneumaticTube'),
    tubeCapsule: document.getElementById('tubeCapsule'),
    bannerTitle: document.getElementById('bannerTitle'),
    bannerDesc: document.getElementById('bannerDesc')
};

/* ============================================
   STEAM PARTICLES
   ============================================ */

function createSteamParticle() {
    const particle = document.createElement('div');
    particle.className = 'steam-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (6 + Math.random() * 6) + 's';
    elements.steamContainer.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 12000);
}

function createSteamParticles() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createSteamParticle(), i * 1000);
    }
    setInterval(createSteamParticle, 2000);
}

/* ============================================
   PRODUCT RENDERING
   ============================================ */

function formatPrice(price) {
    return price.toFixed(2);
}

function getCategoryDisplayName(category) {
    const names = {
        'contraptions': 'Brass Contraption',
        'curiosities': 'Arcane Curiosity',
        'augmentations': 'Augmentation'
    };
    return names[category] || category;
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.category = product.category;
    card.dataset.id = product.id;

    card.innerHTML = `
        <div class="product-image-container">
            <div class="product-category-badge">${getCategoryDisplayName(product.category)}</div>
            <div class="product-image">
                <div class="patent-illustration">
                    <svg class="patent-svg" viewBox="0 0 100 100">
                        <path d="${product.svgPath}" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-specs">
                <span class="spec-item"><span class="spec-icon">⬡</span> ${product.specs.material}</span>
                <span class="spec-item"><span class="spec-icon">⚖</span> ${product.specs.weight}</span>
                <span class="spec-item"><span class="spec-icon">◈</span> ${product.specs.origin}</span>
            </div>
            <div class="product-footer">
                <div class="product-price">
                    <span class="price-currency">£</span>${formatPrice(product.price)}
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <span class="btn-icon">⚙</span>
                    <span class="btn-text">Add to Cart</span>
                </button>
            </div>
        </div>
    `;

    const addButton = card.querySelector('.add-to-cart-btn');
    addButton.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id);
    });

    return card;
}

function renderProducts(category = 'all') {
    elements.productGrid.innerHTML = '';
    const filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    filtered.forEach(product => {
        elements.productGrid.appendChild(createProductCard(product));
    });
}

/* ============================================
   NAVIGATION
   ============================================ */

const categoryInfo = {
    'all': { title: 'All Wares', desc: 'Explore our complete collection of marvels' },
    'contraptions': { title: 'Brass Contraptions', desc: 'Mechanical marvels of precision engineering' },
    'curiosities': { title: 'Arcane Curiosities', desc: 'Mysterious artifacts from distant lands' },
    'augmentations': { title: 'Mechanical Augmentations', desc: 'Enhancements for the discerning individual' }
};

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentCategory = link.dataset.category;
            renderProducts(currentCategory);

            const info = categoryInfo[currentCategory];
            elements.bannerTitle.textContent = info.title;
            elements.bannerDesc.textContent = info.desc;
        });
    });
}

/* ============================================
   CART FUNCTIONS
   ============================================ */

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    triggerPneumaticTubeAnimation();
    updateCartUI();
    updateGaugeNeedle();
    animatePriceTicker();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    updateGaugeNeedle();
    animatePriceTicker();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    updateCartUI();
    animatePriceTicker();
}

function getTotalPrice() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getTotalItems() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartUI() {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    elements.cartCountBadge.textContent = totalItems;

    if (cart.length === 0) {
        elements.cartItems.innerHTML = '';
        elements.cartItems.style.display = 'none';
        elements.cartEmpty.style.display = 'flex';
    } else {
        elements.cartEmpty.style.display = 'none';
        elements.cartItems.style.display = 'block';
        renderCartItems();
    }

    updatePriceTickerDisplay(totalPrice);
}

function renderCartItems() {
    elements.cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">✕</button>
            <div class="cart-item-image">
                <svg viewBox="0 0 100 100">
                    <path d="${item.svgPath}" fill="none" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">£${formatPrice(item.price * item.quantity)}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" data-id="${item.id}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
        `;

        cartItem.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.id));
        cartItem.querySelector('.minus').addEventListener('click', () => updateQuantity(item.id, -1));
        cartItem.querySelector('.plus').addEventListener('click', () => updateQuantity(item.id, 1));

        elements.cartItems.appendChild(cartItem);
    });
}

/* ============================================
   PNEUMATIC TUBE ANIMATION
   ============================================ */

function triggerPneumaticTubeAnimation() {
    elements.pneumaticTube.classList.add('active');
    elements.tubeCapsule.style.animation = 'none';
    elements.tubeCapsule.offsetHeight;
    elements.tubeCapsule.style.animation = 'capsuleTravel 0.8s ease-in-out forwards';

    elements.cartCountBadge.classList.add('pulse');

    setTimeout(() => {
        elements.pneumaticTube.classList.remove('active');
        elements.cartCountBadge.classList.remove('pulse');
    }, 800);
}

/* ============================================
   GAUGE NEEDLE
   ============================================ */

function updateGaugeNeedle() {
    const totalItems = getTotalItems();
    const maxItems = 10;
    const percentage = Math.min(totalItems / maxItems, 1);
    const angle = -60 + (percentage * 120);
    elements.gaugeNeedle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

/* ============================================
   PRICE TICKER
   ============================================ */

function updatePriceTickerDisplay(price) {
    const pounds = Math.floor(price);
    const pence = Math.round((price - pounds) * 100);

    const poundsStr = pounds.toString().padStart(4, '0');
    const penceStr = pence.toString().padStart(2, '0');

    const digits = elements.tickerDigits.querySelectorAll('.ticker-digit');
    const allDigits = poundsStr + penceStr;

    digits.forEach((digit, index) => {
        if (allDigits[index]) {
            digit.textContent = allDigits[index];
        }
    });
}

function animatePriceTicker() {
    const digits = elements.tickerDigits.querySelectorAll('.ticker-digit');
    digits.forEach((digit, index) => {
        setTimeout(() => {
            digit.classList.add('spinning');
            setTimeout(() => digit.classList.remove('spinning'), 300);
        }, index * 50);
    });
}

/* ============================================
   CART SIDEBAR
   ============================================ */

function initializeCart() {
    elements.cartButton.addEventListener('click', openCart);
    elements.cartClose.addEventListener('click', closeCart);
    elements.cartOverlay.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });
}

function openCart() {
    elements.cartSidebar.classList.add('active');
    elements.cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    elements.cartSidebar.classList.remove('active');
    elements.cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ============================================
   CHECKOUT
   ============================================ */

function initializeCheckout() {
    elements.checkoutButton.addEventListener('click', openCheckout);
    elements.confirmButton.addEventListener('click', confirmOrder);
    elements.cancelButton.addEventListener('click', closeCheckout);

    elements.checkoutModal.addEventListener('click', (e) => {
        if (e.target === elements.checkoutModal) closeCheckout();
    });
}

function openCheckout() {
    if (cart.length === 0) return;
    renderCheckoutSummary();
    closeCart();
    elements.checkoutModal.classList.add('active');
}

function closeCheckout() {
    elements.checkoutModal.classList.remove('active');
}

function renderCheckoutSummary() {
    const total = getTotalPrice();
    const shipping = cart.length > 0 ? 15 : 0;
    const grandTotal = total + shipping;

    let html = '';
    cart.forEach(item => {
        html += `
            <div class="summary-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>£${formatPrice(item.price * item.quantity)}</span>
            </div>
        `;
    });

    html += `
        <div class="summary-item">
            <span>Pneumatic Express Shipping</span>
            <span>£${formatPrice(shipping)}</span>
        </div>
        <div class="summary-total">
            <span>Total Due</span>
            <span>£${formatPrice(grandTotal)}</span>
        </div>
    `;

    elements.checkoutSummary.innerHTML = html;
}

function confirmOrder() {
    closeCheckout();
    showToast();
    cart = [];
    updateCartUI();
    updateGaugeNeedle();
}

function showToast() {
    elements.toast.classList.add('active');
    setTimeout(() => {
        elements.toast.classList.remove('active');
    }, 4000);
}

/* ============================================
   GEAR ANIMATIONS
   ============================================ */

function initializeGears() {
    const gears = document.querySelectorAll('.corner-gear');
    gears.forEach((gear, index) => {
        gear.style.animationDuration = (15 + index * 5) + 's';
    });
}

/* ============================================
   INITIAL PRODUCTS
   ============================================ */

function initializeProducts() {
    renderProducts();
    updateCartUI();
    updateGaugeNeedle();
}