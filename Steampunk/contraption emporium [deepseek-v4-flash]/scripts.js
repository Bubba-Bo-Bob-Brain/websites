// Steampunk Emporium - Main JavaScript

class SteampunkShop {
    constructor() {
        this.cart = [];
        this.total = 0;
        this.initializeElements();
        this.bindEvents();
        this.startTickerAnimation();
        this.initializeCart();
    }

    initializeElements() {
        this.cartIcon = document.querySelector('.cart-icon');
        this.cartCount = document.querySelector('.cart-count');
        this.cartTotal = document.querySelector('.cart-total');
        this.cartModal = document.getElementById('cartModal');
        this.cartItems = document.getElementById('cartItems');
        this.totalAmount = document.getElementById('totalAmount');
        this.checkoutBtn = document.querySelector('.checkout-btn');
        this.cartBtn = document.getElementById('cartBtn');
        this.closeCart = document.getElementById('closeCart');
        this.addToCartBtns = document.querySelectorAll('.add-to-cart');
    }

    init() {
        this.setupEventListeners();
        this.loadCartFromStorage();
    }

    setupEventListeners() {
        this.addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const product = this.getProductData(e.target.closest('.product-card'));
                this.addToCart(product);
            });
        });

        this.cartBtn?.addEventListener('click', () => this.toggleCart());
        this.closeCart?.addEventListener('click', () => this.toggleCart());
        this.checkoutBtn?.addEventListener('click', () => this.checkout());

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (this.cartPanel && this.cartPanel.classList.contains('open')) {
                if (!this.cartPanel.contains(e.target) && !this.cartBtn.contains(e.target)) {
                    this.closeCart();
                }
            }
        });
    }

    getProductData(productId) {
        const products = {
            1: { name: 'Brass Resonance Amplifier', price: 89.99, sku: 'AMP-1887-BR' },
            2: { name: 'Chronometric Gyroscope', price: 149.50, sku: 'GYR-1892-CH' },
            3: { name: 'Steam-Powered Automaton Arm', price: 299.99, sku: 'ARM-1890-ST' },
            4: { name: 'Etheric Telegraph Device', price: 199.50, sku: 'TEL-1895-ET' }
        };
        return products[productId] || null;
    }

    addToCart(productId) {
        const product = this.getProductDetails(productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.updateCartUI();
        this.showTubeNotification(`${product.name} added to your collection`);
        this.animateCartIcon();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartUI();
    }

    updateQuantity(productId, delta) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, item.quantity + delta);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        this.cartCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
        this.cartTotal.textContent = `£${totalPrice.toFixed(2)}`;
        this.totalAmount.textContent = `£${totalPrice.toFixed(2)}`;

        this.renderCartItems();
        this.saveCartToStorage();
        this.updateCartBadge(totalItems);
    }

    renderCartItems() {
        if (!this.cartItems) return;

        if (this.cart.length === 0) {
            this.cartItems.innerHTML = '<div class="empty-cart-msg">Your pneumatic tube is empty. Add some wonders!</div>';
            return;
        }

        this.cartItems.innerHTML = this.cart.map(item => `
            <div class="checkout-item" data-id="${item.id}">
                <div class="checkout-item-info">
                    <span class="checkout-item-name">${item.name}</span>
                    <span class="checkout-item-sku">${item.sku}</span>
                </div>
                <div class="checkout-item-controls">
                    <button class="quantity-btn" onclick="shop.updateQuantity(${item.id}, -1)">−</button>
                    <span class="checkout-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="shop.updateQuantity(${item.id}, 1)">+</button>
                </div>
                <span class="checkout-item-price">£${(item.price * item.quantity).toFixed(2)}</span>
                <button class="checkout-item-remove" onclick="shop.removeFromCart(${item.id})">✕</button>
            </div>
        `).join('');
    }

    toggleCart() {
        if (!this.cartModal) return;
        const isOpen = this.cartModal.classList.contains('active');
        
        if (isOpen) {
            this.cartModal.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            this.cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.renderCartItems();
        }
    }

    closeCart() {
        if (this.cartModal) {
            this.cartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showTubeNotification('Your pneumatic tube is empty!');
            return;
        }

        this.showTubeNotification('Processing your order through the pneumatic tube system...');
        
        setTimeout(() => {
            this.showTubeNotification('Order complete! Your mechanical wonders will arrive shortly.');
            this.cart = [];
            this.updateCartUI();
            this.closeCart();
        }, 2000);
    }

    showTubeNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'tube-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">⚙</span>
                <span class="notification-text">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Trigger tube animation
        const tubeAnimation = document.querySelector('.tube-animation');
        if (tubeAnimation) {
            tubeAnimation.classList.add('active');
            setTimeout(() => tubeAnimation.classList.remove('active'), 1500);
        }

        // Remove notification after animation
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('cart-bump');
            setTimeout(() => cartIcon.classList.remove('cart-bump'), 300);
        }
    }

    updateCartBadge(count) {
        const badge = document.querySelector('.cart-count-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('steampunkCart', JSON.stringify(this.cart));
        } catch (e) {
            console.warn('Could not save cart to storage:', e);
        }
    }

    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('steampunkCart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                this.updateCartUI();
            }
        } catch (e) {
            console.warn('Could not load cart from storage:', e);
        }
    }

    getProductDetails(productId) {
        const products = {
            1: { id: 1, name: 'Brass Resonance Amplifier', price: 89.99, sku: 'AMP-1887-BR' },
            2: { id: 2, name: 'Chronometric Gyroscope', price: 145.00, sku: 'GYR-1890-CR' },
            3: { id: 3, name: 'Steam-Powered Automaton Arm', price: 299.99, sku: 'ARM-1889-ST' },
            4: { id: 4, name: 'Etheric Telegraph Transceiver', price: 199.50, sku: 'TEL-1892-ET' }
        };
        return products[productId] || null;
    }
}

// Initialize the shop
document.addEventListener('DOMContentLoaded', () => {
    window.shop = new SteampunkShop();
    
    // Start gear ticker animation
    initializeGearTicker();
    
    // Add steam particle effects
    initializeSteamEffects();
    
    // Initialize product card hover effects
    initializeProductEffects();
});

// Gear Ticker Animation
function initializeGearTicker() {
    const tickerValue = document.getElementById('tickerValue');
    const tickerChange = document.getElementById('tickerChange');
    let baseValue = 2847.63;
    
    setInterval(() => {
        const change = (Math.random() - 0.5) * 10;
        baseValue += change;
        
        if (tickerValue) {
            tickerValue.textContent = `£${baseValue.toFixed(2)}`;
        }
        
        if (tickerChange) {
            const percentChange = (change / baseValue) * 100;
            const arrow = percentChange >= 0 ? '▲' : '▼';
            tickerChange.textContent = `${arrow} ${Math.abs(percentChange).toFixed(2)}%`;
            tickerChange.style.color = percentChange >= 0 ? '#2d5a27' : '#8b0000';
        }
    }, 3000);
}

// Steam Particle Effects
function initializeSteamEffects() {
    const steamContainer = document.createElement('div');
    steamContainer.className = 'steam-container';
    document.body.appendChild(steamContainer);
    
    setInterval(() => {
        createSteamParticle(steamContainer);
    }, 2000);
}

function createSteamParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'steam-particle';
    
    const startX = Math.random() * window.innerWidth;
    const size = 20 + Math.random() * 40;
    
    particle.style.cssText = `
        left: ${startX}px;
        bottom: -50px;
        width: ${size}px;
        height: ${size}px;
        opacity: 0.1 + Math.random() * 0.15;
    `;
    
    container.appendChild(particle);
    
    // Animate
    const duration = 4000 + Math.random() * 4000;
    const endX = startX + (Math.random() - 0.5) * 200;
    
    particle.animate([
        { transform: 'translateY(0) translateX(0) scale(1)', opacity: 0.1 },
        { transform: `translateY(-${window.innerHeight + 100}px) translateX(${endX - startX}px) scale(2)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'ease-out'
    }).onfinish = () => particle.remove();
}

// Product Card Effects
function initializeProductEffects() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const svg = card.querySelector('svg');
            if (svg) {
                svg.style.animation = 'gearRotate 4s linear infinite';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const svg = card.querySelector('svg');
            if (svg) {
                svg.style.animation = 'none';
            }
        });
    });
}

// Add to Cart Button Handler
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const card = this.closest('.product-card');
        const productId = parseInt(card.dataset.id);
        const productName = card.dataset.name;
        const productPrice = parseFloat(card.dataset.price);
        
        // Create mechanical click effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
        
        // Trigger pneumatic tube animation
        const tubeAnimation = document.querySelector('.tube-animation');
        if (tubeAnimation) {
            tubeAnimation.classList.add('active');
            setTimeout(() => tubeAnimation.classList.remove('active'), 1500);
        }
        
        // Add gear particles
        createGearParticles(this);
    });
});

// Gear Particle Effect
function createGearParticles(button) {
    const rect = button.getBoundingClientRect();
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'gear-particle';
        particle.textContent = '⚙';
        
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        const angle = (i / particleCount) * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        
        particle.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: ${startY}px;
            font-size: ${10 + Math.random() * 15}px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity - 50}px) rotate(${360 + Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('checkoutModal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Cart Modal Close Button
document.getElementById('modalClose')?.addEventListener('click', () => {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Cart Button
document.getElementById('cartBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Render cart items
        if (window.shop) {
            window.shop.renderCartItems();
        }
    }
});