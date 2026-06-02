const products = [
    {
        id: 1,
        name: "Chronometric Pocket Watch",
        category: "contraptions",
        description: "Precision timepiece with 17-jewel movement, brass case with steam-etched engravings.",
        price: 189.99,
        icon: "⌚",
        badge: null
    },
    {
        id: 2,
        name: "Aetheric Compass",
        category: "curiosities",
        description: "Navigational instrument calibrated for both magnetic and aetheric north.",
        price: 124.50,
        icon: "🧭",
        badge: "RARE"
    },
    {
        id: 3,
        name: "Mechanical Left Arm",
        category: "augmentations",
        description: "Clockwork prosthetic with pneumatic grip strength and telescopic fingers.",
        price: 849.00,
        icon: "🦾",
        badge: "PREMIUM"
    },
    {
        id: 4,
        name: "Steam-Powered Automaton",
        category: "contraptions",
        description: "Self-winding mechanical servant, stands 18 inches, performs 12 tasks.",
        price: 425.00,
        icon: "🤖",
        badge: null
    },
    {
        id: 5,
        name: "Phlogiston Lamp",
        category: "curiosities",
        description: "Perpetual flame encased in leaded crystal, burns without fuel.",
        price: 167.75,
        icon: "💡",
        badge: null
    },
    {
        id: 6,
        name: "Optical Enhancement Monocle",
        category: "augmentations",
        description: "Brass-rimmed lens with 4x magnification and aetheric spectrum vision.",
        price: 295.00,
        icon: "🔍",
        badge: null
    },
    {
        id: 7,
        name: "Pneumatic Messaging Tube",
        category: "contraptions",
        description: "Desktop communication device with 200ft of copper tubing included.",
        price: 78.50,
        icon: "📩",
        badge: "NEW"
    },
    {
        id: 8,
        name: "Arcane Cipher Cylinder",
        category: "curiosities",
        description: "Mechanical encryption device with 10,000 possible combinations.",
        price: 156.00,
        icon: "🔐",
        badge: null
    },
    {
        id: 9,
        name: "Clockwork Heart Module",
        category: "augmentations",
        description: "Life-sustaining mechanism with 80-year mainspring warranty.",
        price: 1250.00,
        icon: "❤️",
        badge: "EXCLUSIVE"
    }
];

let cart = [];
let currentCategory = "all";

const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTrigger = document.querySelector(".cart-trigger");
const cartClose = document.getElementById("cartClose");
const overlay = document.getElementById("overlay");
const navLinks = document.querySelectorAll(".nav-link");
const tickerValue = document.getElementById("tickerValue");
const pneumaticCapsule = document.getElementById("pneumaticCapsule");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const grandTotalEl = document.getElementById("grandTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

function formatPrice(price) {
    return price.toFixed(2);
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.category = product.category;
    
    const badgeHTML = product.badge 
        ? `<span class="product-badge">${product.badge}</span>` 
        : "";
    
    card.innerHTML = `
        <div class="product-rivets">
            <span class="rivet"></span>
            <span class="rivet"></span>
            <span class="rivet"></span>
            <span class="rivet"></span>
        </div>
        <div class="product-image-frame">
            ${badgeHTML}
            <div class="product-illustration">
                <div class="illustration-svg">${product.icon}</div>
                <div class="illustration-lines">
                    <span class="line"></span>
                    <span class="line"></span>
                    <span class="line"></span>
                </div>
            </div>
        </div>
        <div class="product-details">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <div class="product-price">
                    <span class="price-currency">£</span>
                    <span class="price-value">${formatPrice(product.price)}</span>
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <span class="btn-text">Add</span>
                    <span class="btn-icon">⚙</span>
                </button>
            </div>
        </div>
    `;
    
    const addBtn = card.querySelector(".add-to-cart-btn");
    addBtn.addEventListener("click", () => addToCart(product));
    
    return card;
}

function renderProducts(category = "all") {
    productGrid.innerHTML = "";
    
    const filtered = category === "all" 
        ? products 
        : products.filter(p => p.category === category);
    
    filtered.forEach((product, index) => {
        const card = createProductCard(product);
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        productGrid.appendChild(card);
        
        setTimeout(() => {
            card.style.transition = "all 0.4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 100);
    });
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    animatePneumaticTube();
    updateCart();
    animateTicker();
}

function animatePneumaticTube() {
    pneumaticCapsule.classList.remove("animate");
    void pneumaticCapsule.offsetWidth;
    pneumaticCapsule.classList.add("animate");
    
    setTimeout(() => {
        pneumaticCapsule.classList.remove("animate");
    }, 800);
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="empty-gear"></div>
                <p class="empty-text">Your collection awaits...</p>
                <p class="empty-subtext">Add mechanical marvels to begin</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = "";
        cart.forEach(item => {
            const itemEl = document.createElement("div");
            itemEl.className = "cart-item";
            itemEl.innerHTML = `
                <div class="item-image">
                    <span class="item-icon">${item.icon}</span>
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <span class="item-price">£${formatPrice(item.price)}</span>
                    <div class="item-controls">
                        <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                        <button class="item-remove" data-id="${item.id}">✕</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(itemEl);
        });
        
        cartItems.querySelectorAll(".qty-btn").forEach(btn => {
            btn.addEventListener("click", handleQuantityChange);
        });
        
        cartItems.querySelectorAll(".item-remove").forEach(btn => {
            btn.addEventListener("click", handleRemoveItem);
        });
    }
    
    updateSummary();
}

function handleQuantityChange(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const action = e.currentTarget.dataset.action;
    const item = cart.find(i => i.id === id);
    
    if (action === "increase") {
        item.quantity++;
    } else if (action === "decrease") {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart = cart.filter(i => i.id !== id);
        }
    }
    
    updateCart();
    animateTicker();
}

function handleRemoveItem(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    cart = cart.filter(i => i.id !== id);
    updateCart();
    animateTicker();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 5.00 : 0.00;
    const grandTotal = subtotal + shipping;
    
    subtotalEl.textContent = `£${formatPrice(subtotal)}`;
    shippingEl.textContent = cart.length > 0 ? `£${formatPrice(shipping)}` : "£0.00";
    grandTotalEl.textContent = `£${formatPrice(grandTotal)}`;
}

let currentTickerValue = 0;
let targetTickerValue = 0;
let tickerAnimationId = null;

function animateTicker() {
    const totalItems = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 5.00 : 0.00;
    targetTickerValue = totalItems + shipping;
    
    if (tickerAnimationId) {
        cancelAnimationFrame(tickerAnimationId);
    }
    
    const startValue = currentTickerValue;
    const diff = targetTickerValue - startValue;
    const duration = Math.min(Math.abs(diff) * 20, 1500);
    const startTime = performance.now();
    
    function tick(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        currentTickerValue = startValue + (diff * easeOutQuart);
        
        tickerValue.textContent = Math.floor(currentTickerValue);
        
        if (progress < 1) {
            tickerAnimationId = requestAnimationFrame(tick);
        } else {
            currentTickerValue = targetTickerValue;
            tickerValue.textContent = targetTickerValue.toFixed(0);
        }
    }
    
    tickerAnimationId = requestAnimationFrame(tick);
}

function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

cartTrigger.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        
        currentCategory = link.dataset.category;
        renderProducts(currentCategory);
    });
});

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your collection is empty! Add some mechanical marvels before checkout.");
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.00;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(
        `Order Confirmed!\n\n` +
        `Items: ${itemCount}\n` +
        `Total: £${formatPrice(total)}\n\n` +
        `Your mechanical marvels will be dispatched via airship within 3-5 business days.\n\n` +
        `Thank you for shopping at Brass & Arcana!`
    );
    
    cart = [];
    updateCart();
    animateTicker();
    closeCart();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawer.classList.contains("open")) {
        closeCart();
    }
});

function init() {
    renderProducts();
    updateCart();
    
    const gears = document.querySelectorAll(".header-gears .gear, .ticker-gear");
    gears.forEach((gear, index) => {
        const randomDelay = Math.random() * 2;
        gear.style.animationDelay = `-${randomDelay}s`;
    });
}

document.addEventListener("DOMContentLoaded", init);