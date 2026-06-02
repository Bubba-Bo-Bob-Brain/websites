// ===== STEAMPUNK E-COMMERCE JAVASCRIPT =====

// Product Data
const products = [
    {
        id: 1,
        name: "Chronometric Oscillator",
        description: "Precision timekeeping apparatus with brass gears and crystal regulator. Keeps time to within 0.01 seconds per annum.",
        price: 125.00,
        category: "brass",
        specs: ["12 Gears", "72hr Reserve"],
        badge: "Bestseller",
        icon: "fas fa-clock"
    },
    {
        id: 2,
        name: "Arcane Perception Lens",
        description: "Multi-focal brass telescope with prismatic crystal array. Reveals hidden dimensions and ethereal frequencies.",
        price: 45.50,
        category: "arcane",
        specs: ["12x Zoom", "Crystal Optics"],
        badge: "New Arrival",
        icon: "fas fa-eye"
    },
    {
        id: 3,
        name: "Pneumatic Grip Apparatus",
        description: "Leather and brass glove with pneumatic actuators. Enhances grip strength by factor of ten. Self-regulating pressure.",
        price: 78.00,
        category: "augmentation",
        specs: ["Right Hand", "Pneumatic"],
        badge: null,
        icon: "fas fa-hand-paper"
    },
    {
        id: 4,
        name: "Automaton Power Core",
        description: "Concentrated arcane energy matrix in brass housing. Powers automatons and mechanical augmentations. 1000-hour lifespan.",
        price: 210.00,
        category: "arcane",
        specs: ["1000hrs", "Arcane"],
        badge: "Rare Find",
        icon: "fas fa-bolt"
    },
    {
        id: 5,
        name: "Brass Oscillator",
        description: "Mechanical vibration generator with adjustable frequency. Perfect for resonance experiments and sonic applications.",
        price: 12.99,
        category: "brass",
        specs: ["Variable Freq", "Brass Housing"],
        badge: null,
        icon: "fas fa-wave-square"
    },
    {
        id: 6,
        name: "Aetheric Compass",
        description: "Navigational device that points toward ley lines and magical nexuses. Gold-plated brass with crystal needle.",
        price: 89.50,
        category: "arcane",
        specs: ["Ley Line Detection", "Gold Plated"],
        badge: "Limited",
        icon: "fas fa-compass"
    },
    {
        id: 7,
        name: "Mechanical Arm Servo",
        description: "Precision servo motor for mechanical arm augmentations. Brass construction with 360-degree rotation.",
        price: 156.00,
        category: "augmentation",
        specs: ["360° Rotation", "High Torque"],
        badge: null,
        icon: "fas fa-cogs"
    },
    {
        id: 8,
        name: "Pneumatic Tube Capsule",
        description: "Brass capsule for pneumatic tube systems. Sealed with leather gaskets and pressure valves.",
        price: 24.99,
        category: "brass",
        specs: ["Leather Sealed", "Pressure Rated"],
        badge: null,
        icon: "fas fa-mail-bulk"
    },
    {
        id: 9,
        name: "Etheric Resonator",
        description: "Device that amplifies and focuses ethereal energies. Crystal array mounted in rotating brass framework.",
        price: 340.00,
        category: "arcane",
        specs: ["Crystal Array", "Rotating Mount"],
        badge: "Master Craft",
        icon: "fas fa-atom"
    },
    {
        id: 10,
        name: "Clockwork Eye Enhancement",
        description: "Mechanical eye replacement with zoom capabilities and low-light vision. Brass housing with glass lens.",
        price: 425.00,
        category: "augmentation",
        specs: ["Zoom 20x", "Night Vision"],
        badge: "Premium",
        icon: "fas fa-eye"
    }
];

// Cart State
let cart = [];
let currentPage = 1;
const productsPerPage = 6;

// DOM Elements
const customCursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const cartToggle = document.getElementById('cart-toggle');
const checkoutPanel = document.getElementById('checkout-panel');
const checkoutOverlay = document.getElementById('checkout-overlay');
const checkoutClose = document.getElementById('checkout-close');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.querySelector('.cart-count');
const catalogGrid = document.getElementById('catalog-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const pageButtons = document.querySelectorAll('.page-btn');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
        
        // Add a slight delay to follower
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .product-card, input, .filter-btn, .page-btn');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            customCursor.style.width = '40px';
            customCursor.style.height = '40px';
            customCursor.style.backgroundColor = 'rgba(184, 134, 11, 0.3)';
        });
        
        el.addEventListener('mouseleave', () => {
            customCursor.style.width = '20px';
            customCursor.style.height = '20px';
            customCursor.style.backgroundColor = 'transparent';
        });
    });

    // Hide default cursor
    document.body.style.cursor = 'none';
}

// ===== CART FUNCTIONS =====
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon"><i class="fas fa-shopping-cart"></i></div>
                <p class="empty-text">Your cart is empty</p>
                <p class="empty-subtext">Add some mechanical marvels to begin</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">£${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-product-id="${item.id}">−</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-product-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Update totals
    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 15.00 : 0; // £15 pneumatic shipping
    const tax = subtotal * 0.08; // 8% Royal Artificer's Tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('cart-subtotal').textContent = `£${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = `£${shipping.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `£${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `£${total.toFixed(2)}`;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            icon: product.icon
        });
    }
    
    // Trigger pneumatic tube animation
    const button = document.querySelector(`.add-to-cart-btn[data-product-id="${productId}"]`);
    if (button) {
        button.classList.add('adding');
        setTimeout(() => button.classList.remove('adding'), 800);
    }
    
    updateCartDisplay();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    
    if (product) {
        showNotification(`${product.name} removed from cart`);
    }
}

// ===== CATALOG FUNCTIONS =====
function renderCatalog(filter = 'all', page = 1) {
    // Filter products
    let filteredProducts = products;
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }
    
    // Paginate
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Render products
    catalogGrid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="card-rivets">
                <div class="rivet top-left"></div>
                <div class="rivet top-right"></div>
                <div class="rivet bottom-left"></div>
                <div class="rivet bottom-right"></div>
            </div>
            <div class="product-image">
                <div class="patent-frame">
                    <div class="patent-illustration product-ill">
                        <div class="ill-gear-system">
                            <div class="ill-gear large"></div>
                            <div class="ill-gear medium"></div>
                            <div class="ill-gear small"></div>
                        </div>
                        <div class="ill-label">Fig. ${product.id} - ${product.name}</div>
                    </div>
                </div>
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-specs">
                    ${product.specs.map(spec => `
                        <span class="spec"><i class="${product.icon}"></i> ${spec}</span>
                    `).join('')}
                </div>
                <div class="product-footer">
                    <div class="product-price">
                        <span class="price-currency">£</span>
                        <span class="price-amount">${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        <span class="btn-text">Add to Cart</span>
                        <span class="btn-pipe">
                            <div class="pipe-air"></div>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update pagination buttons
    updatePagination(filteredProducts.length, page);
    
    // Reattach event listeners
    attachCatalogEventListeners();
}

function updatePagination(totalProducts, currentPage) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    pageButtons.forEach(button => {
        const pageNum = button.getAttribute('data-page');
        
        if (pageNum === 'next') {
            button.disabled = currentPage >= totalPages;
            button.style.opacity = currentPage >= totalPages ? '0.5' : '1';
        } else {
            button.classList.toggle('active', parseInt(pageNum) === currentPage);
        }
    });
}

function attachCatalogEventListeners() {
    // Add to cart buttons in catalog
    document.querySelectorAll('.catalog-grid .add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });
}

// ===== CHECKOUT PANEL =====
function toggleCheckout(show) {
    if (show) {
        checkoutPanel.classList.add('active');
        checkoutOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        checkoutPanel.classList.remove('active');
        checkoutOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #3e2723, #5d4037);
        color: #f4e4bc;
        padding: 15px 25px;
        border-radius: 4px;
        border: 2px solid #d4af37;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        z-index: 3000;
        font-family: 'Crimson Text', serif;
        font-size: 1.1rem;
        transform: translateX(120%);
        transition: transform 0.4s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-cog" style="color: #d4af37; animation: rotateClockwise 2s linear infinite;"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== SMOOTH SCROLLING & ACTIVE NAVIGATION =====
function initSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 120; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 150;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Cart toggle
    cartToggle.addEventListener('click', () => toggleCheckout(true));
    
    // Close checkout
    checkoutClose.addEventListener('click', () => toggleCheckout(false));
    checkoutOverlay.addEventListener('click', () => toggleCheckout(false));
    
    // Add to cart buttons (hero section)
    document.querySelectorAll('.hero .add-to-cart-btn, .featured-section .add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            currentPage = 1;
            renderCatalog(filter, currentPage);
        });
    });
    
    // Page buttons
    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageNum = button.getAttribute('data-page');
            
            if (pageNum === 'next') {
                currentPage++;
            } else {
                currentPage = parseInt(pageNum);
            }
            
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            renderCatalog(activeFilter, currentPage);
            
            // Scroll to catalog section
            const catalogSection = document.getElementById('catalog');
            if (catalogSection) {
                const offsetTop = catalogSection.offsetTop - 120;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Cart item event delegation
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const productId = parseInt(target.closest('[data-product-id]')?.getAttribute('data-product-id'));
        
        if (!productId) return;
        
        if (target.closest('.minus')) {
            updateQuantity(productId, -1);
        } else if (target.closest('.plus')) {
            updateQuantity(productId, 1);
        } else if (target.closest('.cart-item-remove')) {
            removeFromCart(productId);
        }
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            showNotification('Proceeding to payment...');
            // In a real implementation, this would redirect to a payment page
        } else {
            showNotification('Your cart is empty!');
        }
    });
}

// ===== GEAR ANIMATIONS =====
function initGearAnimations() {
    // Add random rotation speeds to gears
    document.querySelectorAll('.hero-gear, .footer-gear, .logo-gear, .checkout-gear, .seal-gear').forEach(gear => {
        const randomDuration = 15 + Math.random() * 30;
        gear.style.animationDuration = `${randomDuration}s`;
    });
    
    // Add random delays to gear animations
    document.querySelectorAll('.illustration-gear, .ill-gear').forEach(gear => {
        const randomDelay = Math.random() * 5;
        gear.style.animationDelay = `${randomDelay}s`;
    });
}

// ===== INITIALIZE =====
function init() {
    initCustomCursor();
    initSmoothScrolling();
    initEventListeners();
    initGearAnimations();
    updateCartDisplay();
    renderCatalog('all', 1);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key closes checkout
        if (e.key === 'Escape' && checkoutPanel.classList.contains('active')) {
            toggleCheckout(false);
        }
        
        // Ctrl+C opens cart
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            toggleCheckout(true);
        }
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        showNotification('Welcome to Cogsworth\'s Contraptions!');
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', init);