document.addEventListener('DOMContentLoaded', () => {
    // --- DATA: The Inventory ---
    const products = [
        {
            id: 1,
            name: "Aetheric Chronometer",
            desc: "Timekeeping powered by captured lightning. Never loses a second.",
            price: 145.00,
            icon: "fa-clock"
        },
        {
            id: 2,
            name: "Brass Ocular Lens",
            desc: "Single-eye augmentation for enhanced telescopic vision.",
            price: 89.50,
            icon: "fa-eye"
        },
        {
            id: 3,
            name: "Pneumatic Arm Actuator",
            desc: "Replace your weak flesh with hydraulic steel. 500lb lifting capacity.",
            price: 320.00,
            icon: "fa-hand-fist"
        },
        {
            id: 4,
            name: "Arcane Tesla Coil",
            desc: "Portable lightning generator. Use with extreme caution.",
            price: 210.75,
            icon: "fa-bolt"
        },
        {
            id: 5,
            name: "Clockwork Automaton",
            desc: "A mechanical servant for tea service and minor chores.",
            price: 450.00,
            icon: "fa-robot"
        },
        {
            id: 6,
            name: "Steampunk Goggles",
            desc: "Anti-glare lenses with adjustable aperture and brass filtration.",
            price: 45.00,
            icon: "fa-glasses"
        }
    ];

    // --- STATE ---
    let cart = [];
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total');
    const cartItemsEl = document.getElementById('cart-items');
    const productGridEl = document.getElementById('product-grid');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const confirmOrderBtn = document.getElementById('confirm-order');

    // --- UTILS ---
    const formatCurrency = (amount) => {
        return '£' + amount.toFixed(2);
    };

    // --- RENDER PRODUCTS ---
    function renderProducts() {
        productGridEl.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="rivet-tl"></div><div class="rivet-tr"></div>
                <div class="rivet-bl"></div><div class="rivet-br"></div>
                
                <div class="card-image">
                    <i class="fa-solid ${product.icon}"></i>
                </div>
                
                <div class="card-content">
                    <h4 class="card-title">${product.name}</h4>
                    <p class="card-desc">${product.desc}</p>
                    
                    <div class="card-price-container" id="price-container-${product.id}">
                        <!-- Price digits will be injected here -->
                    </div>
                    
                    <button class="btn-add" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-plus"></i> Engage Pneumatic Tube
                    </button>
                </div>
            </div>
        `).join('');

        // Initialize price animations
        products.forEach(product => {
            animatePrice(product.id, product.price);
        });
    }

    // --- PRICE ANIMATION (GEAR EFFECT) ---
    function animatePrice(id, targetPrice) {
        const container = document.getElementById(`price-container-${id}`);
        const parts = targetPrice.toFixed(2).split('.');
        const whole = parts[0].split('').reverse();
        const decimal = parts[1];

        // Build HTML structure for digits
        let html = '<span>£</span>';
        
        // Whole numbers
        whole.forEach((digit, index) => {
            html += `<div class="gear-price" id="gear-${id}-${index}">
                <span class="gear-digit">${digit}</span>
            </div>`;
        });

        html += '<span>.</span>';
        
        // Decimal numbers
        decimal.split('').forEach((digit, index) => {
            html += `<div class="gear-price" id="gear-${id}-dec-${index}">
                <span class="gear-digit">${digit}</span>
            </div>`;
        });

        container.innerHTML = html;
    }

    // --- CART LOGIC ---
    window.addToCart = (id) => {
        const product = products.find(p => p.id === id);
        cart.push(product);
        updateCartUI();
        openCart();
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    function updateCartUI() {
        // Update Count
        cartCountEl.textContent = cart.length;
        
        // Animate Count Badge
        cartCountEl.style.transform = 'scale(1.5)';
        setTimeout(() => cartCountEl.style.transform = 'scale(1)', 200);

        // Calculate Total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalEl.textContent = formatCurrency(total);

        // Render Items
        if (cart.length === 0) {
            cartItemsEl.innerHTML = `
                <div class="empty-cart-msg">
                    <i class="fa-solid fa-box-open"></i>
                    <p>The pneumatic tube is currently empty.</p>
                </div>
            `;
        } else {
            cartItemsEl.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">${formatCurrency(item.price)}</span>
                    </div>
                    <i class="fa-solid fa-trash remove-item" onclick="removeFromCart(${index})"></i>
                </div>
            `).join('');
        }
    }

    // --- UI INTERACTIONS ---
    function openCart() {
        cartSidebar.classList.add('open');
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
    }

    closeCartBtn.addEventListener('click', closeCart);

    // Close cart when clicking outside (on overlay if we had one, but here just sidebar logic)
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !e.target.closest('.cart-indicator') && cartSidebar.classList.contains('open')) {
            closeCart();
        }
    });

    // Checkout Flow
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("You cannot finalize an empty order, sir!");
            return;
        }
        cartSidebar.classList.remove('open');
        checkoutOverlay.classList.add('active');
    });

    const closeModal = () => {
        checkoutOverlay.classList.remove('active');
    };

    document.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    
    confirmOrderBtn.addEventListener('click', () => {
        // Simulate processing
        confirmOrderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        setTimeout(() => {
            alert(`Order Dispatched via Pneumatic Tube!\nTotal: ${cartTotalEl.textContent}`);
            cart = [];
            updateCartUI();
            closeModal();
            confirmOrderBtn.innerHTML = '<i class="fa-solid fa-file-signature"></i> Finalize Order';
        }, 1500);
    });

    // --- INITIALIZATION ---
    renderProducts();
});