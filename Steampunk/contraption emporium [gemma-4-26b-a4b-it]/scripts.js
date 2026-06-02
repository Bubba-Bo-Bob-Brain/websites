/**
 * THE AETHERIC EMPORIUM - Logic & Mechanics
 * A masterclass in immersive e-commerce interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. State & Data ---
    let cart = [];
    const products = [
        { id: 1, name: "Brass Chronometer", price: 125.00, spec: "Precision Gear-Driven Timekeeping" },
        { id: 2, name: "Aetheric Lens", price: 340.50, spec: "Spectral Visual Augmentation" },
        { id: 3, name: "Steam Prosthetic", price: 1250.00, spec: "Mk. IV Mechanical Limb" },
        { id: 4, name: "Automaton Key", price: 45.00, spec: "Master Wind-up Device" }
    ];

    const marketMessages = [
        "BRASS PRICES RISING IN THE EAST...",
        "AETHERIC VAPOR RESERVES AT 84%",
        "NEW ARRIVAL: MK. IV STEAM PROSTHETICS",
        "COAL SHIPMENTS DELAYED BY FOG",
        "CLOCKWORK DEMAND INCREASING",
        "CURIOSTIES STOCKED: AETHERIC LENSES"
    ];

    // --- 2. DOM Elements ---
    const productGrid = document.getElementById('product-grid');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalDisplay = document.getElementById('cart-total');
    const cartCountDisplay = document.querySelector('.cart-count');
    const priceTicker = document.getElementById('price-ticker');
    const gaugeFill = document.getElementById('gauge-fill');
    const steamContainer = document.getElementById('steam-container');
    const pneumaticContainer = document.getElementById('pneumatic-tube-container');

    // --- 3. Initialization ---
    initTicker();
    initSteam();
    setupEventListeners();

    // --- 4. Core Functions ---

    /**
     * The Chrono-Ticker: Simulates a live market fluctuation
     */
    function initTicker() {
        let index = 0;
        const updateTicker = () => {
            priceTicker.style.opacity = 0;
            setTimeout(() => {
                priceTicker.textContent = marketMessages[index];
                priceTicker.style.opacity = 1;
                index = (index + 1) % marketMessages.length;
            }, 500);
        };
        updateTicker();
        setInterval(updateTicker, 5000);
    }

    /**
     * Atmospheric Steam: Generates subtle rising particles
     */
    function initSteam() {
        const createSteamParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'steam-particle';
            
            // Randomize particle appearance
            const size = Math.random() * 40 + 20;
            const left = Math.random() * 100;
            const duration = Math.random() * 5 + 5;
            const delay = Math.random() * 5;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.bottom = '-50px';
            particle.style.opacity = '0';
            particle.style.borderRadius = '50%';
            particle.style.background = 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)';
            particle.style.position = 'absolute';
            particle.style.filter = 'blur(10px)';
            
            steamContainer.appendChild(particle);

            // Animate via JS for fine control
            const animation = particle.animate([
                { transform: 'translateY(0) scale(1)', opacity: 0 },
                { transform: 'translateY(-100vh) scale(2)', opacity: 0.2 },
                { transform: 'translateY(-120vh) scale(3)', opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'linear'
            });

            animation.onfinish = () => particle.remove();
        };

        setInterval(createSteamParticle, 300);
    }

    /**
     * Cart Logic: Adding items
     */
    function addToCart(productId, event) {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            cart.push({ ...product, cartId: Date.now() });
            updateCartUI();
            triggerPneumaticAnimation(event);
        }
    }

    /**
     * Cart Logic: Removing items
     */
    function removeFromCart(cartId) {
        cart = cart.filter(item => item.cartId !== cartId);
        updateCartUI();
    }

    /**
     * UI Update: Refreshing the Ledger and Gauges
     */
    function updateCartUI() {
        // Update Count
        cartCountDisplay.textContent = cart.length;

        // Update List
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li class="empty-msg">The ledger is currently empty.</li>';
        } else {
            cartItemsList.innerHTML = cart.map(item => `
                <li class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.spec}</p>
                    </div>
                    <div style="text-align: right">
                        <div class="product-price" style="font-size: 0.9rem; margin-bottom: 5px;">£${item.price.toFixed(2)}</div>
                        <button class="remove-item-btn" data-id="${item.cartId}" style="background:none; border:none; color:var(--color-copper-light); cursor:pointer; font-size:0.7rem; text-transform:uppercase;">Discard</button>
                    </div>
                </li>
            `).join('');

            // Attach remove event listeners
            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    removeFromCart(parseInt(e.target.dataset.id));
                });
            });
        }

        // Update Total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalDisplay.textContent = `£${total.toFixed(2)}`;

        // Update Aetheric Gauge (Max pressure at £1500)
        const pressure = Math.min((total / 1500) * 100, 100);
        gaugeFill.style.width = `${pressure}%`;
    }

    /**
     * Visual FX: The Pneumatic Tube Animation
     */
    function triggerPneumaticAnimation(event) {
        const capsule = document.createElement('div');
        capsule.className = 'pneumatic-tube';
        
        // Start position (where the user clicked)
        const startX = event.clientX;
        const startY = event.clientY;
        
        // Target position (the cart icon)
        const target = cartToggle.getBoundingClientRect();
        const endX = target.left + (target.width / 2);
        const endY = target.top + (target.height / 2);

        capsule.style.left = `${startX}px`;
        capsule.style.top = `${startY}px`;
        pneumaticContainer.appendChild(capsule);

        const animation = capsule.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.5)`, opacity: 0.5 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'
        });

        animation.onfinish = () => capsule.remove();
    }

    // --- 5. Event Listeners ---

    function setupEventListeners() {
        // Add to Cart via delegation
        productGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-cart');
            if (btn) {
                const card = btn.closest('.product-card');
                addToCart(card.dataset.id, e);
            }
        });

        // Cart UI Toggles
        cartToggle.addEventListener('click', () => {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('active');
        });

        const closeDrawer = () => {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('active');
        };

        closeCart.addEventListener('click', closeDrawer);
        cartOverlay.addEventListener('click', closeDrawer);

        // Checkout simulation
        document.querySelector('.btn-checkout').addEventListener('click', () => {
            if (cart.length > 0) {
                alert("Transmission sent to the Royal Mint. Your acquisitions are being prepared for pneumatic delivery!");
                cart = [];
                updateCartUI();
                closeDrawer();
            } else {
                alert("The ledger is empty. You cannot finalize a void transaction.");
            }
        });
    }
});