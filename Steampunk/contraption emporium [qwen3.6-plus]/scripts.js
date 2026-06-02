/**
 * The Brass Emporium - Interactive Script
 * Handles product rendering, cart logic, filtering, and immersive animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       CONFIGURATION & STATE
       ========================================================================== */
    const CONFIG = {
        shippingCost: 12,
        taxRate: 0.05,
        animationDuration: 800,
        toastDuration: 3000
    };

    let state = {
        cart: JSON.parse(localStorage.getItem('brassEmporiumCart')) || [],
        filter: 'all'
    };

    /* ==========================================================================
       PRODUCT DATA
       ========================================================================== */
    const products = [
        {
            id: 'diff-engine',
            name: 'Brass Differential Engine',
            category: 'contraptions',
            price: 847,
            description: 'A fully operational mechanical calculator capable of computing polynomial functions. Encased in polished brass.',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="35" cy="35" r="12"/><circle cx="65" cy="35" r="12"/><circle cx="50" cy="65" r="12"/><path d="M35,23 V47 M35,35 H47 M65,23 V47 M58,35 H65 M50,53 V77 M38,65 H62 M23,35 H23 M77,35 H77 M50,53 V53" stroke-width="2"/><circle cx="35" cy="35" r="4" fill="currentColor"/><circle cx="65" cy="35" r="4" fill="currentColor"/><circle cx="50" cy="65" r="4" fill="currentColor"/></svg>`
        },
        {
            id: 'aether-resonator',
            name: 'Aetheric Resonator',
            category: 'curiosities',
            price: 1203,
            description: 'Tune into the invisible frequencies of the aether. Warning: prolonged exposure may cause temporal disorientation.',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="50" cy="65" rx="20" ry="8"/><path d="M30,65 Q30,20 50,10 Q70,20 70,65"/><circle cx="50" cy="10" r="5" fill="currentColor"/><path d="M40,30 L60,30 M35,40 L65,40 M38,50 L62,50"/><circle cx="50" cy="50" r="15" stroke-dasharray="2,4"/></svg>`
        },
        {
            id: 'pneumatic-arm',
            name: 'Pneumatic Limb Mk.IV',
            category: 'augmentations',
            price: 2450,
            description: 'Hydraulically actuated prosthetic arm with articulated brass fingers. Capable of crushing walnuts or playing the piano.',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M50,10 L50,30 M30,40 L70,40 L65,80 L35,80 Z"/><path d="M50,30 L30,40 M50,30 L70,40"/><circle cx="35" cy="80" r="5"/><circle cx="65" cy="80" r="5"/><path d="M40,50 L60,50 M42,60 L58,60"/><rect x="45" y="65" width="10" height="5" fill="currentColor"/></svg>`
        },
        {
            id: 'chrono-compass',
            name: 'Chrono-Compass',
            category: 'contraptions',
            price: 567,
            description: 'Navigates not by direction, but by time. Points toward the nearest temporal anomaly.',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="50" cy="50" r="35"/><circle cx="50" cy="50" r="25"/><path d="M50,25 L55,45 L75,50 L55,55 L50,75 L45,55 L25,50 L45,45 Z" fill="currentColor"/><circle cx="50" cy="50" r="8"/></svg>`
        },
        {
            id: 'voltaic-capacitor',
            name: 'Voltaic Capacitor',
            category: 'curiosities',
            price: 389,
            description: 'Stores raw lightning in a vacuum-sealed glass chamber. Handle with insulated gloves.',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="35" y="20" width="30" height="60" rx="4"/><line x1="42" y1="30" x2="58" y2="30"/><line x1="42" y1="40" x2="58" y2="40"/><line x1="42" y1="50" x2="58" y2="50"/><line x1="42" y1="60" x2="58" y2="60"/><path d="M50,20 V10 M50,80 V90"/><circle cx="50" cy="10" r="3" fill="currentColor"/><circle cx="50" cy="90" r="3" fill="currentColor"/></svg>`
        },
        {
            id: 'optic-lens',
            name: 'Bionic Ocular Lens',
            category: 'augmentations',
            price: 1875,
            description: 'Replaces the natural eye with a multi-spectral brass lens. Includes telescopic and night-vision settings.',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="15" fill="currentColor"/><circle cx="50" cy="50" r="5" fill="var(--bg-dark)"/><path d="M20,50 H10 M90,50 H80 M50,20 V10 M50,80 V90"/></svg>`
        },
        {
            id: 'steam-gauntlet',
            name: 'Steam-Powered Gauntlet',
            category: 'augmentations',
            price: 950,
            description: 'Wrist-mounted steam piston that triples gripping strength. Powered by distilled coal vapor.',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M30,40 Q50,20 70,40 L75,70 Q50,80 25,70 Z"/><path d="M35,50 L65,50"/><path d="M32,60 L68,60"/><circle cx="40" cy="40" r="4"/><circle cx="60" cy="40" r="4"/><path d="M25,70 L15,85 L25,90 M75,70 L85,85 L75,90"/></svg>`
        },
        {
            id: 'spectrograph',
            name: 'Aether Spectrograph',
            category: 'curiosities',
            price: 720,
            description: 'Analyzes the chemical composition of any substance via spectral refraction. Brass and crystal construction.',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M30,20 L30,50 L15,80 L85,80 L70,50 L70,20 Z"/><path d="M40,30 L60,30 L65,50 L35,50 Z" fill="currentColor" opacity="0.3"/><line x1="15" y1="80" x2="20" y2="90"/><line x1="85" y1="80" x2="80" y2="90"/><line x1="30" y1="20" x2="50" y2="10 L70,20"/></svg>`
        },
        {
            id: 'automaton-bird',
            name: 'Clockwork Songbird',
            category: 'contraptions',
            price: 450,
            description: 'Wind-up avian automaton. Sings three distinct melodies before requiring rewinding. Genuine feathered wings.',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20,50 Q50,10 80,50 Q50,90 20,50 Z"/><circle cx="35" cy="40" r="3" fill="currentColor"/><path d="M50,20 Q70,40 80,50 Q70,60 50,80"/><path d="M30,50 Q40,30 50,50 Q60,70 70,50" stroke-dasharray="2,3"/></svg>`
        }
    ];

    /* ==========================================================================
       DOM REFERENCES
       ========================================================================== */
    const DOM = {
        productGrid: document.getElementById('productGrid'),
        cartToggle: document.getElementById('cartToggle'),
        cartOverlay: document.getElementById('cartOverlay'),
        cartSidebar: document.getElementById('cartSidebar'),
        cartClose: document.getElementById('cartClose'),
        cartItems: document.getElementById('cartItems'),
        cartEmpty: document.getElementById('cartEmpty'),
        cartFooter: document.getElementById('cartFooter'),
        cartCount: document.getElementById('cartCount'),
        cartSubtotal: document.getElementById('cartSubtotal'),
        cartShipping: document.getElementById('cartShipping'),
        cartTax: document.getElementById('cartTax'),
        cartTotal: document.getElementById('cartTotal'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        pneumaticTube: document.getElementById('pneumaticTube'),
        tubeCapsule: document.getElementById('tubeCapsule'),
        toast: document.getElementById('notificationToast'),
        toastMsg: document.getElementById('toastMessage'),
        checkoutForm: document.getElementById('checkoutForm'),
        checkoutPanel: document.querySelector('.checkout-panel'),
        orderConfirmation: document.getElementById('orderConfirmation'),
        orderRef: document.getElementById('orderRef'),
        grandTotal: document.getElementById('grandTotal'),
        scrollTopBtn: document.getElementById('scrollTop'),
        header: document.getElementById('mainHeader')
    };

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */
    function init() {
        renderProducts();
        updateCartUI();
        setupEventListeners();
        observeScrollEffects();
    }

    /* ==========================================================================
       RENDERING
       ========================================================================== */
    function renderProducts() {
        const filtered = state.filter === 'all' 
            ? products 
            : products.filter(p => p.category === state.filter);

        DOM.productGrid.innerHTML = filtered.map(product => `
            <article class="product-card" data-id="${product.id}" data-category="${product.category}">
                <span class="rivet rivet-tl"></span>
                <span class="rivet rivet-tr"></span>
                <span class="rivet rivet-bl"></span>
                <span class="rivet rivet-br"></span>
                
                <div class="product-image">
                    <div class="patent-bg"></div>
                    <div class="patent-text">
                        PATENT NO. ${Math.floor(Math.random() * 8000) + 1000}<br>
                        REG. 1891
                    </div>
                    ${product.svg}
                </div>
                
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-footer">
                        <span class="product-price">£${product.price.toLocaleString()}</span>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                <path d="M10,2 L12,2 L13,6 L17,4 L18,8 L22,8 L22,12 L20,14 L22,16 L22,20 L18,20 L17,24 L13,22 L12,26 L10,26 L8,26 L7,22 L3,24 L2,20 L-2,20 L-2,16 L0,14 L-2,12 L-2,8 L2,8 L3,4 L7,6 L8,2 Z"/>
                            </svg>
                            Add to Ledger
                        </button>
                    </div>
                </div>
            </article>
        `).join('');

        // Re-bind add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.productId;
                addToCart(id);
            });
        });
    }

    /* ==========================================================================
       CART LOGIC
       ========================================================================== */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existing = state.cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            state.cart.push({ ...product, qty: 1 });
        }

        saveCart();
        updateCartUI();
        triggerPneumaticAnimation();
        showToast(`${product.name} added to your ledger!`);
    }

    function removeFromCart(productId) {
        state.cart = state.cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }

    function updateQuantity(productId, change) {
        const item = state.cart.find(i => i.id === productId);
        if (!item) return;

        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart();
        updateCartUI();
    }

    function saveCart() {
        localStorage.setItem('brassEmporiumCart', JSON.stringify(state.cart));
    }

    /* ==========================================================================
       CART UI UPDATES
       ========================================================================== */
    function updateCartUI() {
        const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const shipping = state.cart.length > 0 ? CONFIG.shippingCost : 0;
        const tax = subtotal * CONFIG.taxRate;
        const total = subtotal + shipping + tax;

        // Update Count Badge
        DOM.cartCount.textContent = totalItems;
        DOM.cartCount.classList.toggle('has-items', totalItems > 0);

        // Update Totals
        DOM.cartSubtotal.textContent = `£${subtotal.toLocaleString()}`;
        DOM.cartShipping.textContent = `£${shipping.toLocaleString()}`;
        DOM.cartTax.textContent = `£${tax.toFixed(2)}`;
        DOM.cartTotal.textContent = `£${total.toFixed(2)}`;
        DOM.grandTotal.textContent = `£${total.toFixed(2)}`;

        // Render Items
        if (state.cart.length === 0) {
            DOM.cartEmpty.style.display = 'block';
            DOM.cartFooter.style.display = 'none';
            DOM.cartItems.innerHTML = '';
            DOM.cartItems.appendChild(DOM.cartEmpty);
        } else {
            DOM.cartEmpty.style.display = 'none';
            DOM.cartFooter.style.display = 'block';
            
            DOM.cartItems.innerHTML = state.cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        ${item.svg}
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <span class="cart-item-price">£${(item.price * item.qty).toLocaleString()}</span>
                        <div class="cart-item-qty">
                            <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">Remove from ledger</button>
                    </div>
                </div>
            `).join('');

            // Bind Cart Item Events
            DOM.cartItems.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.target.dataset.action;
                    const id = e.target.dataset.id;
                    updateQuantity(id, action === 'inc' ? 1 : -1);
                });
            });

            DOM.cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    removeFromCart(e.target.dataset.id);
                });
            });
        }
    }

    /* ==========================================================================
       ANIMATIONS & EFFECTS
       ========================================================================== */
    function triggerPneumaticAnimation() {
        const tube = DOM.pneumaticTube;
        const capsule = DOM.tubeCapsule;

        // Reset position
        tube.classList.add('active');
        capsule.style.top = '0px';
        capsule.style.opacity = '1';

        // Animate using Web Animations API for precise control without extra CSS
        const dropAnim = capsule.animate([
            { transform: 'translateX(50%) translateY(0px)' },
            { transform: 'translateX(50%) translateY(400px)', offset: 0.6 },
            { transform: 'translateX(50%) translateY(350px)' },
            { transform: 'translateX(50%) translateY(380px)' }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        });

        dropAnim.onfinish = () => {
            capsule.style.opacity = '0';
            setTimeout(() => {
                tube.classList.remove('active');
                capsule.style.top = '0px';
                capsule.style.opacity = '1';
            }, 300);
        };
    }

    function showToast(message) {
        DOM.toastMsg.textContent = message;
        DOM.toast.classList.add('show');
        
        // Reset timer if already showing
        if (DOM.toast.timeout) clearTimeout(DOM.toast.timeout);
        
        DOM.toast.timeout = setTimeout(() => {
            DOM.toast.classList.remove('show');
        }, CONFIG.toastDuration);
    }

    function observeScrollEffects() {
        // Scroll to top visibility
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            
            // Header shadow
            if (scrolled > 50) {
                DOM.header.style.boxShadow = '0 15px 40px rgba(0,0,0,0.9)';
            } else {
                DOM.header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
            }

            // Scroll to top button
            if (scrolled > 500) {
                DOM.scrollTopBtn.classList.add('visible');
            } else {
                DOM.scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        DOM.scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       EVENT LISTENERS
       ========================================================================== */
    function setupEventListeners() {
        // Cart Toggles
        DOM.cartToggle.addEventListener('click', () => {
            DOM.cartSidebar.classList.add('open');
            DOM.cartOverlay.classList.add('open');
        });

        const closeCart = () => {
            DOM.cartSidebar.classList.remove('open');
            DOM.cartOverlay.classList.remove('open');
        };

        DOM.cartClose.addEventListener('click', closeCart);
        DOM.cartOverlay.addEventListener('click', closeCart);

        // Category Filters
        DOM.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                DOM.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update state and render
                state.filter = btn.dataset.filter;
                
                // Animate grid out
                DOM.productGrid.style.opacity = '0';
                DOM.productGrid.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    renderProducts();
                    DOM.productGrid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    DOM.productGrid.style.opacity = '1';
                    DOM.productGrid.style.transform = 'translateY(0)';
                }, 200);
            });
        });

        // Checkout Form
        DOM.checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (state.cart.length === 0) {
                showToast('Your ledger is empty! Add some contraptions first.');
                return;
            }

            // Simulate processing
            const submitBtn = DOM.checkoutForm.querySelector('.submit-order-btn');
            submitBtn.innerHTML = `<span class="mini-gear-spin"><svg viewBox="0 0 20 20" width="16" height="16"><path d="M10,1 L12,1 L13,5 L17,3 L18,7 L22,7 L22,11 L20,13 L22,15 L22,19 L18,19 L17,23 L13,21 L12,25 L10,25 L8,25 L7,21 L3,23 L2,19 L-2,19 L-2,15 L0,13 L-2,11 L-2,7 L2,7 L3,3 L7,5 L8,1 Z" fill="currentColor"/><circle cx="10" cy="13" r="3" fill="var(--bg-dark)"/></svg></span> Processing...`;
            submitBtn.disabled = true;

            setTimeout(() => {
                // Generate Order Ref
                const ref = 'BRZ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                DOM.orderRef.textContent = ref;

                // Show confirmation, hide form
                DOM.checkoutForm.style.display = 'none';
                DOM.orderConfirmation.style.display = 'block';

                // Clear Cart
                state.cart = [];
                saveCart();
                updateCartUI();
                
                showToast('Order sealed and dispatched via pneumatic tube!');
            }, 1500);
        });
    }

    // Run
    init();
});