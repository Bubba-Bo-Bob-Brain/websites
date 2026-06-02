/* ===============================================
   THE AETHERIC EMPORIUM - Victorian Steampunk Interactions
   Est. 1847 | Brass, Bronze & Aetheric Magic
=============================================== */

// === GLOBAL STATE ===
const AppState = {
    cart: [],
    cartOpen: false,
    checkoutOpen: false,
    successOpen: false,
    activeCategory: 'all',
    orderCount: 1847
};

// === DOM ELEMENTS ===
const DOM = {
    cartTrigger: document.getElementById('cartTrigger'),
    cartCount: document.getElementById('cartCount'),
    gaugeNeedle: document.getElementById('gaugeNeedle'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartClose: document.getElementById('cartClose'),
    cartItems: document.getElementById('cartItems'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartTax: document.getElementById('cartTax'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    productsGrid: document.getElementById('productsGrid'),
    categoryTabs: document.querySelectorAll('.category-tab'),
    checkoutModal: document.getElementById('checkoutModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalClose: document.getElementById('modalClose'),
    checkoutForm: document.getElementById('checkoutForm'),
    summaryDetails: document.getElementById('summaryDetails'),
    successModal: document.getElementById('successModal'),
    successClose: document.getElementById('successClose'),
    orderNumber: document.getElementById('orderNumber'),
    pneumaticSystem: document.getElementById('pneumaticSystem'),
    travelingParcel: document.getElementById('travelingParcel'),
    steamContainer: document.getElementById('steamContainer'),
    mainNav: document.getElementById('mainNav')
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    createSteamParticles();
    initScrollAnimations();
    initEventListeners();
    initProductAnimations();
    loadCart();
    updateCartUI();
    initCategoryFiltering();
    initParallaxEffects();
    initHeroAnimations();
    initRippleStyles();
}

// === STEAM PARTICLES ===
function createSteamParticles() {
    const container = DOM.steamContainer;
    if (!container) return;
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'steam-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        particle.style.width = (15 + Math.random() * 20) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// === RIPPLE STYLES ===
function initRippleStyles() {
    if (document.getElementById('ripple-style')) return;
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = [
        '@keyframes ripple {',
        '  to { transform: scale(4); opacity: 0; }',
        '}',
        '.magnetic-btn { transition: transform 0.2s ease; }'
    ].join('');
    document.head.appendChild(style);
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(function(card, index) {
            gsap.fromTo(card, 
                { opacity: 0, y: 50, rotateX: 10 },
                { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0, 
                    duration: 0.8, 
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        const headers = document.querySelectorAll('.section-header');
        headers.forEach(function(header) {
            gsap.fromTo(header,
                { opacity: 0, y: -30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }
}

// === PRODUCT CARD ANIMATIONS ===
function initProductAnimations() {
    const priceGears = document.querySelectorAll('.price-gear');
    priceGears.forEach(function(gear) {
        gear.style.transformOrigin = 'center';
    });

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const priceGear = card.querySelector('.price-gear');
            if (priceGear && typeof gsap !== 'undefined') {
                gsap.to(priceGear, {
                    rotation: '+=360',
                    duration: 2,
                    ease: 'none',
                    repeat: -1
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const priceGear = card.querySelector('.price-gear');
            if (priceGear && typeof gsap !== 'undefined') {
                gsap.killTweensOf(priceGear);
            }
        });
    });

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(function(btn) {
        btn.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, { scale: 1.05, duration: 0.2 });
            }
        });
        btn.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, { scale: 1, duration: 0.2 });
            }
        });
    });
}

// === HERO ANIMATIONS ===
function initHeroAnimations() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(function(stat) {
        const target = parseInt(stat.dataset.count, 10);
        animateCounter(stat, 0, target, 2000);
    });

    if (typeof gsap !== 'undefined') {
        gsap.to('.hero-gear.gear-1', {
            rotation: 360,
            duration: 60,
            repeat: -1,
            ease: 'none'
        });
        gsap.to('.hero-gear.gear-2', {
            rotation: -360,
            duration: 45,
            repeat: -1,
            ease: 'none'
        });
        gsap.to('.hero-gear.gear-3', {
            rotation: 360,
            duration: 30,
            repeat: -1,
            ease: 'none'
        });
        gsap.to('.hero-badge', {
            boxShadow: '0 0 40px rgba(212, 168, 75, 0.6)',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeProgress);
        element.textContent = current.toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// === EVENT LISTENERS ===
function initEventListeners() {
    if (DOM.cartTrigger) {
        DOM.cartTrigger.addEventListener('click', toggleCart);
    }
    if (DOM.cartClose) {
        DOM.cartClose.addEventListener('click', closeCart);
    }
    if (DOM.cartSidebar) {
        DOM.cartSidebar.addEventListener('click', function(e) {
            if (e.target === DOM.cartSidebar) closeCart();
        });
    }
    if (DOM.checkoutBtn) {
        DOM.checkoutBtn.addEventListener('click', openCheckout);
    }
    if (DOM.modalOverlay) {
        DOM.modalOverlay.addEventListener('click', closeCheckout);
    }
    if (DOM.modalClose) {
        DOM.modalClose.addEventListener('click', closeCheckout);
    }
    if (DOM.checkoutForm) {
        DOM.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    if (DOM.successClose) {
        DOM.successClose.addEventListener('click', closeSuccess);
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
        btn.addEventListener('click', handleAddToCart);
    });

    document.addEventListener('click', function(e) {
        handleQuantityClick(e);
        handleRemoveFromCart(e);
    });

    window.addEventListener('scroll', handleScroll);

    document.addEventListener('keydown', handleEscapeKey);

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    if (DOM.cartTrigger) {
        DOM.cartTrigger.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to('.main-gear', { rotation: '+=30', duration: 0.3 });
                gsap.to('.secondary-gear', { rotation: '-=30', duration: 0.3 });
            }
        });
    }

    initMagneticButtons();
}

// === MAGNETIC BUTTON EFFECT ===
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn, .cta-button, .checkout-btn, .submit-order-btn');
    buttons.forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, { x: x * 0.1, y: y * 0.1, duration: 0.3, ease: 'power2.out' });
            }
        });
        btn.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            }
        });
    });
}

// === CART FUNCTIONS ===
function toggleCart() {
    if (AppState.cartOpen) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    AppState.cartOpen = true;
    if (DOM.cartSidebar) {
        DOM.cartSidebar.classList.add('open');
    }
    document.body.style.overflow = 'hidden';
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('.cart-panel', { x: 100 }, { x: 0, duration: 0.5, ease: 'back.out(1.7)' });
    }
}

function closeCart() {
    AppState.cartOpen = false;
    if (DOM.cartSidebar) {
        DOM.cartSidebar.classList.remove('open');
    }
    document.body.style.overflow = '';
}

function handleAddToCart(e) {
    const btn = e.currentTarget;
    const productCard = btn.closest('.product-card');
    const productId = btn.dataset.productId;
    
    const productData = {
        id: productCard.dataset.product,
        name: productCard.dataset.name,
        price: parseFloat(productCard.dataset.price),
        quantity: 1,
        image: productCard.querySelector('.product-illustration') ? productCard.querySelector('.product-illustration').innerHTML : ''
    };

    triggerPneumaticAnimation(btn);
    setTimeout(function() {
        addToCart(productData);
    }, 500);
}

function triggerPneumaticAnimation(btn) {
    btn.classList.add('animating');
    
    if (DOM.pneumaticSystem) {
        DOM.pneumaticSystem.classList.add('active');
    }
    if (DOM.travelingParcel) {
        DOM.travelingParcel.classList.add('animate');
    }
    
    if (typeof gsap !== 'undefined' && DOM.gaugeNeedle) {
        gsap.to(DOM.gaugeNeedle, { rotation: 45, duration: 0.1, yoyo: true, repeat: 5 });
    }
    
    setTimeout(function() {
        btn.classList.remove('animating');
        if (DOM.travelingParcel) {
            DOM.travelingParcel.classList.remove('animate');
        }
        if (DOM.pneumaticSystem) {
            DOM.pneumaticSystem.classList.remove('active');
        }
    }, 1000);
}

function addToCart(product) {
    let existingItem = null;
    for (let i = 0; i < AppState.cart.length; i++) {
        if (AppState.cart[i].id === product.id) {
            existingItem = AppState.cart[i];
            break;
        }
    }
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        AppState.cart.push(product);
    }
    
    saveCart();
    updateCartUI();
    
    if (typeof gsap !== 'undefined' && DOM.cartCount) {
        gsap.fromTo(DOM.cartCount, 
            { scale: 1.5, color: '#ffd700' },
            { scale: 1, color: '#e8c36a', duration: 0.3 }
        );
    }
    
    if (DOM.cartTrigger) {
        DOM.cartTrigger.classList.add('flash');
        setTimeout(function() {
            DOM.cartTrigger.classList.remove('flash');
        }, 500);
    }
}

function handleQuantityClick(e) {
    const btn = e.target.closest('.quantity-btn');
    if (!btn) return;
    
    const cartItem = btn.closest('.cart-item');
    if (!cartItem) return;
    
    const productId = cartItem.dataset.productId;
    const action = btn.dataset.action;
    
    let item = null;
    for (let i = 0; i < AppState.cart.length; i++) {
        if (AppState.cart[i].id === productId) {
            item = AppState.cart[i];
            break;
        }
    }
    
    if (!item) return;

    if (action === 'increase') {
        item.quantity++;
    } else if (action === 'decrease') {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeFromCart(productId);
            return;
        }
    }
    
    saveCart();
    updateCartUI();
    
    const quantityValue = cartItem.querySelector('.quantity-value');
    if (typeof gsap !== 'undefined' && quantityValue) {
        gsap.to(quantityValue, { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 });
    }
}

function handleRemoveFromCart(e) {
    const btn = e.target.closest('.cart-item-remove');
    if (!btn) return;
    
    const cartItem = btn.closest('.cart-item');
    if (!cartItem) return;
    
    const productId = cartItem.dataset.productId;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(cartItem, {
            opacity: 0,
            x: 100,
            height: 0,
            marginBottom: 0,
            padding: 0,
            duration: 0.3,
            onComplete: function() {
                removeFromCart(productId);
            }
        });
    } else {
        removeFromCart(productId);
    }
}

function removeFromCart(productId) {
    AppState.cart = AppState.cart.filter(function(item) {
        return item.id !== productId;
    });
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    renderCartItems();
    updateCartTotals();
    updateGaugeNeedle();
    updateCartCount();
}

function renderCartItems() {
    if (!DOM.cartItems) return;
    
    if (AppState.cart.length === 0) {
        DOM.cartItems.innerHTML = [
            '<div class="empty-cart-message">',
            '  <svg viewBox="0 0 100 100" class="empty-cart-icon">',
            '    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5,5"/>',
            '    <text x="50" y="45" text-anchor="middle" font-size="12" fill="currentColor">No</text>',
            '    <text x="50" y="60" text-anchor="middle" font-size="12" fill="currentColor">Items</text>',
            '  </svg>',
            '  <p>Your cart is empty, dear customer</p>',
            '  <p class="empty-cart-hint">Add wares to begin your order</p>',
            '</div>'
        ].join('');
        return;
    }
    
    let html = '';
    for (let i = 0; i < AppState.cart.length; i++) {
        const item = AppState.cart[i];
        html += [
            '<div class="cart-item" data-product-id="' + item.id + '">',
            '  <div class="cart-item-image">' + item.image + '</div>',
            '  <div class="cart-item-details">',
            '    <h4 class="cart-item-name">' + item.name + '</h4>',
            '    <p class="cart-item-price">$' + item.price.toFixed(2) + '</p>',
            '    <div class="cart-item-quantity">',
            '      <button class="quantity-btn" data-action="decrease">-</button>',
            '      <span class="quantity-value">' + item.quantity + '</span>',
            '      <button class="quantity-btn" data-action="increase">+</button>',
            '    </div>',
            '  </div>',
            '  <button class="cart-item-remove">',
            '    <svg viewBox="0 0 24 24">',
            '      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor"/>',
            '      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor"/>',
            '    </svg>',
            '  </button>',
            '</div>'
        ].join('');
    }
    
    DOM.cartItems.innerHTML = html;
}

function updateCartTotals() {
    if (!DOM.cartSubtotal || !DOM.cartTax || !DOM.cartTotal) return;
    
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    
    DOM.cartSubtotal.textContent = '$' + subtotal.toFixed(2);
    DOM.cartTax.textContent = '$' + tax.toFixed(2);
    DOM.cartTotal.textContent = '$' + total.toFixed(2);
}

function calculateSubtotal() {
    let sum = 0;
    for (let i = 0; i < AppState.cart.length; i++) {
        sum += AppState.cart[i].price * AppState.cart[i].quantity;
    }
    return sum;
}

function updateGaugeNeedle() {
    if (!DOM.gaugeNeedle) return;
    
    const maxItems = 10;
    const fillPercentage = Math.min(AppState.cart.length / maxItems, 1);
    const angle = -60 + (fillPercentage * 120);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(DOM.gaugeNeedle, { rotation: angle, duration: 0.5, ease: 'back.out(1.7)' });
    } else {
        DOM.gaugeNeedle.style.transform = 'rotate(' + angle + 'deg)';
    }
}

function updateCartCount() {
    if (!DOM.cartCount) return;
    
    let totalItems = 0;
    for (let i = 0; i < AppState.cart.length; i++) {
        totalItems += AppState.cart[i].quantity;
    }
    DOM.cartCount.textContent = totalItems;
}

// === CHECKOUT FUNCTIONS ===
function openCheckout() {
    closeCart();
    AppState.checkoutOpen = true;
    if (DOM.checkoutModal) {
        DOM.checkoutModal.classList.add('open');
    }
    document.body.style.overflow = 'hidden';
    populateOrderSummary();
    
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('.modal-content',
            { opacity: 0, scale: 0.9, y: -50 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
        );
    }
}

function closeCheckout() {
    AppState.checkoutOpen = false;
    if (DOM.checkoutModal) {
        DOM.checkoutModal.classList.remove('open');
    }
    document.body.style.overflow = '';
}

function populateOrderSummary() {
    if (!DOM.summaryDetails) return;
    
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    
    let html = '';
    for (let i = 0; i < AppState.cart.length; i++) {
        const item = AppState.cart[i];
        html += [
            '<div class="summary-item">',
            '  <span class="summary-item-name">',
            '    ' + item.name,
            '    <span class="summary-item-qty">x' + item.quantity + '</span>',
            '  </span>',
            '  <span class="summary-item-price">$' + (item.price * item.quantity).toFixed(2) + '</span>',
            '</div>'
        ].join('');
    }
    
    html += [
        '<div class="summary-total">',
        '  <span>Total</span>',
        '  <span>$' + total.toFixed(2) + '</span>',
        '</div>'
    ].join('');
    
    DOM.summaryDetails.innerHTML = html;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    AppState.orderCount++;
    const orderNumber = 'AE-' + AppState.orderCount + '-' + Math.floor(1000 + Math.random() * 9000);
    
    const submitBtn = e.target.querySelector('.submit-order-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Processing...</span>';
    }
    
    setTimeout(function() {
        closeCheckout();
        e.target.reset();
        openSuccess(orderNumber);
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="btn-text">Confirm Order</span>';
        }
        AppState.cart = [];
        saveCart();
        updateCartUI();
    }, 2000);
}

// === SUCCESS MODAL ===
function openSuccess(orderNumber) {
    AppState.successOpen = true;
    if (DOM.successModal) {
        DOM.successModal.classList.add('open');
    }
    document.body.style.overflow = 'hidden';
    if (DOM.orderNumber) {
        DOM.orderNumber.textContent = orderNumber;
    }
    
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('.success-content',
            { opacity: 0, scale: 0.5, rotation: -10 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }
        );
        
        const gears = document.querySelectorAll('.success-gear-lg, .success-gear-sm');
        gsap.to(gears, { rotation: '+=720', duration: 1, ease: 'power2.in' });
    }
}

function closeSuccess() {
    AppState.successOpen = false;
    if (DOM.successModal) {
        DOM.successModal.classList.remove('open');
    }
    document.body.style.overflow = '';
    if (typeof gsap !== 'undefined') {
        gsap.to('.success-gear-lg, .success-gear-sm', { rotation: 0, duration: 0 });
    }
}

// === CATEGORY FILTERING ===
function initCategoryFiltering() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const category = tab.dataset.category;
            AppState.activeCategory = category;
            
            tabs.forEach(function(t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(function(card, index) {
        const cardCategory = card.dataset.category;
        const shouldShow = category === 'all' || cardCategory === category;
        
        if (shouldShow) {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 0.4,
                    delay: index * 0.05,
                    onStart: function() {
                        card.style.display = 'block';
                    }
                });
            } else {
                card.style.display = 'block';
                card.style.opacity = 1;
            }
            card.classList.add('visible');
        } else {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    opacity: 0,
                    scale: 0.8,
                    x: 50,
                    duration: 0.4,
                    delay: index * 0.02,
                    onComplete: function() {
                        card.style.display = 'none';
                    }
                });
            } else {
                card.style.display = 'none';
            }
            card.classList.remove('visible');
        }
    });
}

// === PARALLAX EFFECTS ===
function initParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        const heroGears = document.querySelectorAll('.hero-gear');
        heroGears.forEach(function(gear, index) {
            const speed = 0.1 + (index * 0.05);
            gear.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
        });
        
        const nav = document.querySelector('.main-nav');
        if (nav) {
            if (scrolled > 100) {
                nav.style.background = 'rgba(26, 21, 18, 0.98)';
            } else {
                const opacity = 0.7 + scrolled * 0.003;
                nav.style.background = 'rgba(26, 21, 18, ' + opacity + ')';
            }
        }
    });
}

// === SCROLL HANDLER ===
function handleScroll() {
    const scrolled = window.pageYOffset;
    if (DOM.mainNav) {
        if (scrolled > 50) {
            DOM.mainNav.classList.add('scrolled');
        } else {
            DOM.mainNav.classList.remove('scrolled');
        }
    }
}

// === KEYBOARD HANDLER ===
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        if (AppState.successOpen) {
            closeSuccess();
        } else if (AppState.checkoutOpen) {
            closeCheckout();
        } else if (AppState.cartOpen) {
            closeCart();
        }
    }
}

// === NEWSLETTER HANDLER ===
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('.newsletter-input');
    if (input) {
        const email = input.value;
        if (email) {
            if (typeof gsap !== 'undefined') {
                gsap.to(input, { borderColor: '#2a5a3a', duration: 0.3 });
                setTimeout(function() {
                    input.value = '';
                    gsap.to(input, { borderColor: '', duration: 0.3 });
                }, 2000);
            } else {
                input.value = '';
                input.style.borderColor = '#2a5a3a';
                setTimeout(function() {
                    input.style.borderColor = '';
                }, 2000);
            }
        }
    }
}

// === LOCAL STORAGE ===
function saveCart() {
    try {
        localStorage.setItem('aetheric_cart', JSON.stringify(AppState.cart));
    } catch (e) {
        console.warn('Could not save cart to localStorage');
    }
}

function loadCart() {
    try {
        const saved = localStorage.getItem('aetheric_cart');
        if (saved) {
            AppState.cart = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Could not load cart from localStorage');
        AppState.cart = [];
    }
}

// === CONSOLE EASTER EGG ===
console.log('%c The Aetheric Emporium ', 'background: linear-gradient(135deg, #d4a84b, #8b6914); color: #1a1512; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
console.log('%cPurveyors of Mechanical Marvels & Arcane Curiosities Since 1847', 'color: #b8860b; font-style: italic;');