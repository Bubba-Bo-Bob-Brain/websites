// ==========================================================================
// Victorian Steampunk E-commerce JavaScript
// The Brassworks Emporium - scripts.js
// ==========================================================================

// DOM Elements
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const viewCartBtn = document.getElementById('viewCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartBody = document.getElementById('cartBody');
const emptyCart = document.getElementById('emptyCart');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartSurcharge = document.getElementById('cartSurcharge');
const cartGrandTotal = document.getElementById('cartGrandTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const productsContainer = document.getElementById('productsContainer');
const cartGear = document.getElementById('cartGear');
const gaugeNeedle = document.getElementById('gaugeNeedle');
const tickerTape = document.getElementById('tickerTape');
const capsule = document.getElementById('capsule');
const priceRange = document.getElementById('priceRange');
const priceRangeValue = document.getElementById('priceRangeValue');

// Audio Elements
const gearSound = document.getElementById('gearSound');
const clickSound = document.getElementById('clickSound');
const pneumaticSound = document.getElementById('pneumaticSound');
const cartAddSound = document.getElementById('cartAddSound');

// Product Data
const products = [
    {
        id: 1,
        name: "Aetheric Dynamo Core",
        description: "Harnesses latent aetheric energy to power contraptions without conventional fuel.",
        price: 427.50,
        category: "contraptions",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inStock: true,
        inventory: 7
    },
    {
        id: 2,
        name: "Brass Orrery",
        description: "A precise mechanical model of the solar system with celestial bodies in brass.",
        price: 289.99,
        category: "curiosities",
        image: "https://images.unsplash.com/photo-1535378917046-61dffb1430c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inStock: true,
        inventory: 3
    },
    {
        id: 3,
        name: "Mechanical Ocular Enhancer",
        description: "Augments visual perception with telescopic and microscopic capabilities.",
        price: 599.00,
        category: "augmentations",
        image: "https://images.unsplash.com/photo-1581094795550-8a5d29dd4a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inStock: false,
        inventory: 0
    },
    {
        id: 4,
        name: "Steam-Powered Computation Engine",
        description: "Performs complex calculations using steam pressure and brass gears.",
        price: 750.25,
        category: "contraptions",
        image: "https://images.unsplash.com/photo-1581092580497-e0d4cb184827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inStock: true,
        inventory: 5
    },
    {
        id: 5,
        name: "Crystal Resonance Amplifier",
        description: "Focuses and amplifies ambient aetheric vibrations for mystical applications.",
        price: 325.75,
        category: "curiosities",
        image: "https://images.unsplash.com/photo-1581092580497-e0d4cb184827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inStock: true,
        inventory: 12
    },
    {
        id: 6,
        name: "Pneumatic Limb Actuator",
        description: "Replaces lost limbs with steam-powered brass prosthetics offering enhanced strength.",
        price: 899.99,
        category: "augmentations",
        image: "https://images.unsplash.com/photo-1581092580497-e0d4cb184827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inStock: true,
        inventory: 2
    },
    {
        id: 7,
        name: "Chronometric Stabilizer",
        description: "Maintains temporal consistency in aetherically unstable environments.",
        price: 550.00,
        category: "contraptions",
        image: "https://images.unsplash.com/photo-1581092580497-e0d4cb184827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inStock: true,
        inventory: 8
    },
    {
        id: 8,
        name: "Arcane Divination Rod",
        description: "Detects mystical energies and ley line intersections with brass-tipped accuracy.",
        price: 199.50,
        category: "curiosities",
        image: "https://images.unsplash.com/photo-1581092580497-e0d4cb184827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inStock: true,
        inventory: 15
    }
];

// Cart State
let cart = [];
let cartTotal = 0;

// Initialize the shop
function initShop() {
    renderProducts();
    setupEventListeners();
    updateCartDisplay();
    initializeTicker();
    updateGauge();
    initializeClock();
    
    // Play subtle gear sound on load
    setTimeout(() => {
        playSound(gearSound, 0.3);
    }, 500);
}

// Render product cards
function renderProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = `product-card brass-card`;
        productCard.dataset.id = product.id;
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <div class="card-rivets">
                <span class="rivet"></span><span class="rivet"></span><span class="rivet"></span><span class="rivet"></span>
            </div>
            <div class="product-image">
                <div class="patent-corner">PATENT</div>
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">£${product.price.toFixed(2)}</div>
                <div class="product-meta">
                    <span class="category-label">${product.category}</span>
                    <span class="in-stock" style="color: ${product.inStock ? '#90EE90' : '#FF6B6B'}">
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>
            <button class="brass-button add-to-cart" 
                    ${!product.inStock ? 'disabled' : ''}
                    data-id="${product.id}" 
                    data-price="${product.price}"
                    data-name="${product.name}">
                <i class="fas fa-compress-arrows-alt"></i>
                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to dynamically created add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.disabled) {
                const id = parseInt(this.dataset.id);
                const price = parseFloat(this.dataset.price);
                const name = this.dataset.name;
                addToCart(id, price, name);
                
                // Trigger pneumatic tube animation
                triggerPneumaticAnimation();
            }
        });
    });
}

// Cart functionality
function addToCart(productId, price, name) {
    playSound(cartAddSound, 0.5);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Update cart total
    cartTotal += price;
    
    // Update UI
    updateCartDisplay();
    updateGauge();
    
    // Animate cart gear
    cartGear.style.animation = 'none';
    setTimeout(() => {
        cartGear.style.animation = 'rotateClockwise 5s linear infinite';
    }, 10);
    
    // Update product inventory
    const product = products.find(p => p.id === productId);
    if (product && product.inventory > 0) {
        product.inventory--;
        if (product.inventory === 0) {
            product.inStock = false;
            updateProductStock(productId);
        }
    }
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        cartTotal -= item.price * item.quantity;
        
        // Return to inventory
        const product = products.find(p => p.id === productId);
        if (product) {
            product.inventory += item.quantity;
            product.inStock = true;
            updateProductStock(productId);
        }
        
        cart.splice(itemIndex, 1);
        updateCartDisplay();
        updateGauge();
        playSound(clickSound, 0.3);
    }
}

function updateProductStock(productId) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (productCard) {
        const button = productCard.querySelector('.add-to-cart');
        const stockIndicator = productCard.querySelector('.in-stock');
        const product = products.find(p => p.id === productId);
        
        if (product) {
            button.disabled = !product.inStock;
            button.innerHTML = product.inStock ? 
                '<i class="fas fa-compress-arrows-alt"></i> Add to Cart' : 
                'Out of Stock';
            
            stockIndicator.textContent = product.inStock ? 'In Stock' : 'Out of Stock';
            stockIndicator.style.color = product.inStock ? '#90EE90' : '#FF6B6B';
        }
    }
}

function updateCartDisplay() {
    // Update cart count and total
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = itemCount;
    totalPrice.textContent = cartTotal.toFixed(2);
    
    // Update cart panel if open
    if (cartPanel.classList.contains('open')) {
        renderCartItems();
    }
    
    // Update cart gear speed based on item count
    const speed = Math.max(2, 5 - (itemCount * 0.5));
    cartGear.style.animationDuration = `${speed}s`;
    
    // Update ticker
    updateTicker();
}

function renderCartItems() {
    if (cart.length === 0) {
        emptyCart.style.display = 'flex';
        cartBody.innerHTML = '';
    } else {
        emptyCart.style.display = 'none';
        
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item brass-card" data-id="${item.id}">
                <div class="cart-item-header">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <button class="remove-item-btn" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}" ${products.find(p => p.id === item.id)?.inventory === 0 ? 'disabled' : ''}>+</button>
                    </div>
                    <div class="cart-item-price">
                        £${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to cart item buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                removeFromCart(id);
            });
        });
        
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                updateQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                updateQuantity(id, 1);
            });
        });
    }
    
    // Update totals
    const subtotal = cartTotal;
    const surcharge = subtotal * 0.05; // 5% aetheric surcharge
    const grandTotal = subtotal + surcharge;
    
    cartSubtotal.textContent = subtotal.toFixed(2);
    cartSurcharge.textContent = surcharge.toFixed(2);
    cartGrandTotal.textContent = grandTotal.toFixed(2);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        const product = products.find(p => p.id === productId);
        
        if (change > 0 && product && product.inventory > 0) {
            // Adding item
            item.quantity++;
            cartTotal += item.price;
            product.inventory--;
            
            if (product.inventory === 0) {
                product.inStock = false;
                updateProductStock(productId);
            }
        } else if (change < 0 && item.quantity > 1) {
            // Removing item (but not last one)
            item.quantity--;
            cartTotal -= item.price;
            
            if (product) {
                product.inventory++;
                product.inStock = true;
                updateProductStock(productId);
            }
        } else if (change < 0 && item.quantity === 1) {
            // Removing last item - remove from cart entirely
            removeFromCart(productId);
            return;
        }
        
        updateCartDisplay();
        updateGauge();
        playSound(clickSound, 0.2);
    }
}

function clearCart() {
    if (cart.length > 0) {
        // Return all items to inventory
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                product.inventory += item.quantity;
                product.inStock = true;
                updateProductStock(item.id);
            }
        });
        
        cart = [];
        cartTotal = 0;
        updateCartDisplay();
        updateGauge();
        playSound(gearSound, 0.4);
        
        // Show confirmation message
        showNotification('Cart purged successfully. All items returned to inventory.');
    }
}

// Pneumatic tube animation
function triggerPneumaticAnimation() {
    // Show capsule
    capsule.style.opacity = '1';
    capsule.style.top = '-50px';
    
    // Play pneumatic sound
    playSound(pneumaticSound, 0.6);
    
    // Animate capsule down the tube
    setTimeout(() => {
        capsule.style.animation = 'pneumaticDispatch 1.5s forwards';
    }, 100);
    
    // Reset after animation
    setTimeout(() => {
        capsule.style.opacity = '0';
        capsule.style.animation = 'none';
    }, 1600);
}

// Price ticker functionality
function initializeTicker() {
    const tickerItems = [
        'AETHERIC FLUX STABLE',
        'BRASS PRICES STEADY',
        'NEW PATENTS FILED',
        'STEAM PRESSURE OPTIMAL',
        'CURIOSITIES IN STOCK',
        'AUGMENTATIONS AVAILABLE'
    ];
    
    tickerTape.innerHTML = '';
    
    // Create multiple copies for seamless scrolling
    for (let i = 0; i < 5; i++) {
        tickerItems.forEach(item => {
            const tickerItem = document.createElement('div');
            tickerItem.className = 'ticker-item';
            tickerItem.textContent = `• ${item} •`;
            tickerItem.style.padding = '0 20px';
            tickerItem.style.fontFamily = 'Cinzel, serif';
            tickerItem.style.fontWeight = '700';
            tickerItem.style.color = '#C19A6B';
            tickerTape.appendChild(tickerItem);
        });
    }
}

function updateTicker() {
    // Add current cart total to ticker
    const totalItem = document.createElement('div');
    totalItem.className = 'ticker-item';
    totalItem.textContent = `• CART TOTAL: £${cartTotal.toFixed(2)} •`;
    totalItem.style.padding = '0 20px';
    totalItem.style.fontFamily = 'Cinzel, serif';
    totalItem.style.fontWeight = '900';
    totalItem.style.color = '#DA8A67';
    
    tickerTape.appendChild(totalItem);
    
    // Restart animation
    tickerTape.style.animation = 'none';
    setTimeout(() => {
        tickerTape.style.animation = 'tickerScroll 30s linear infinite';
    }, 10);
}

// Pressure gauge functionality
function updateGauge() {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Calculate angle based on cart total (0-180 degrees)
    const maxAngle = 180;
    const maxCartValue = 5000; // £5000 = full gauge
    const angle = Math.min(maxAngle, (cartTotal / maxCartValue) * maxAngle);
    
    gaugeNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    
    // Change color based on pressure
    if (angle > 150) {
        gaugeNeedle.style.background = 'var(--pressure-red)';
    } else if (angle > 90) {
        gaugeNeedle.style.background = 'var(--copper-medium)';
    } else {
        gaugeNeedle.style.background = 'var(--brass-medium)';
    }
}

// Working clock
function initializeClock() {
    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        const hourHand = document.querySelector('.hour-hand');
        const minuteHand = document.querySelector('.minute-hand');
        const secondHand = document.querySelector('.second-hand');
        
        if (hourHand && minuteHand && secondHand) {
            const hourDeg = (hours * 30) + (minutes * 0.5);
            const minuteDeg = (minutes * 6) + (seconds * 0.1);
            const secondDeg = seconds * 6;
            
            hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
            minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
            secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Filter functionality
function setupFilters() {
    const toggleContraptions = document.getElementById('toggleContraptions');
    const toggleCuriosities = document.getElementById('toggleCuriosities');
    const toggleAugmentations = document.getElementById('toggleAugmentations');
    
    // Price range slider
    priceRange.addEventListener('input', function() {
        const maxPrice = parseInt(this.value);
        priceRangeValue.textContent = `£0 - £${maxPrice}`;
        filterProducts();
    });
    
    // Category toggles
    [toggleContraptions, toggleCuriosities, toggleAugmentations].forEach(toggle => {
        toggle.addEventListener('change', filterProducts);
    });
}

function filterProducts() {
    const maxPrice = parseInt(priceRange.value);
    const showContraptions = document.getElementById('toggleContraptions').checked;
    const showCuriosities = document.getElementById('toggleCuriosities').checked;
    const showAugmentations = document.getElementById('toggleAugmentations').checked;
    
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.id);
        const product = products.find(p => p.id === productId);
        const category = card.dataset.category;
        
        let shouldShow = product.price <= maxPrice;
        
        // Check category filters
        if (category === 'contraptions' && !showContraptions) shouldShow = false;
        if (category === 'curiosities' && !showCuriosities) shouldShow = false;
        if (category === 'augmentations' && !showAugmentations) shouldShow = false;
        
        card.style.display = shouldShow ? 'flex' : 'none';
    });
}

// Sound effects
function playSound(audioElement, volume = 1) {
    try {
        audioElement.volume = volume;
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log("Audio play prevented:", e));
    } catch (e) {
        console.log("Sound error:", e);
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification brass-card';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.padding = '15px 25px';
    notification.style.backgroundColor = 'var(--copper-dark)';
    notification.style.border = '3px solid var(--brass-light)';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
    notification.style.transform = 'translateX(150%)';
    notification.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    // Cart panel toggle
    viewCartBtn.addEventListener('click', () => {
        cartPanel.classList.add('open');
        cartOverlay.classList.add('active');
        renderCartItems();
        playSound(clickSound, 0.3);
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartPanel.classList.remove('open');
        cartOverlay.classList.remove('active');
        playSound(clickSound, 0.3);
    });
    
    cartOverlay.addEventListener('click', () => {
        cartPanel.classList.remove('open');
        cartOverlay.classList.remove('active');
    });
    
    // Cart actions
    clearCartBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            if (confirm('Purge all items from your cart? This action cannot be undone.')) {
                clearCart();
            }
        }
    });
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            playSound(gearSound, 0.5);
            showNotification('Proceeding to secure checkout... Redirecting to payment gateway.');
            
            // Simulate checkout process
            setTimeout(() => {
                showNotification('Payment processed successfully! Your order will be dispatched via Aetheric Parcel.');
                clearCart();
                cartPanel.classList.remove('open');
                cartOverlay.classList.remove('active');
            }, 2000);
        } else {
            showNotification('Your cart is empty. Please add items before checking out.');
        }
    });
    
    // Filter setup
    setupFilters();
    
    // Add sound to brass buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.brass-button')) {
            playSound(clickSound, 0.2);
        }
    });
    
    // Add sound to toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', () => {
            playSound(clickSound, 0.2);
        });
    });
    
    // Add sound to sliders
    priceRange.addEventListener('input', () => {
        playSound(clickSound, 0.1);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape closes cart
        if (e.key === 'Escape' && cartPanel.classList.contains('open')) {
            cartPanel.classList.remove('open');
            cartOverlay.classList.remove('active');
        }
        
        // Ctrl+Shift+C opens cart
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            cartPanel.classList.add('open');
            cartOverlay.classList.add('active');
            renderCartItems();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initShop);

// Service Worker for offline functionality (simulated)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartDisplay
    };
}