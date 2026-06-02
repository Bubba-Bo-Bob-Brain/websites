// ========================================
// BRASS & STEAM EMPORIUM — SCRIPTS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initSteamCanvas();
    initCart();
    initPneumaticTube();
    initScrollEffects();
    initPriceTickerHover();
});

// ---- Steam Canvas Effect ----
function initSteamCanvas() {
    const canvas = document.getElementById('steam-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isVisible = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class SteamParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 40 + 20;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.1 + 0.02;
            this.life = 0;
            this.maxLife = Math.random() * 400 + 300;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX + Math.sin(this.life * 0.01) * 0.3;
            this.life++;
            this.size += 0.05;

            if (this.life > this.maxLife || this.y < -this.size) {
                this.reset();
            }
        }

        draw() {
            const fadeIn = Math.min(this.life / 60, 1);
            const fadeOut = Math.max(0, 1 - (this.life - this.maxLife * 0.7) / (this.maxLife * 0.3));
            const currentOpacity = this.opacity * fadeIn * fadeOut;

            ctx.beginPath();
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, `rgba(245, 230, 200, ${currentOpacity})`);
            gradient.addColorStop(1, `rgba(245, 230, 200, 0)`);
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor(window.innerWidth / 15), 50);
        for (let i = 0; i < count; i++) {
            const p = new SteamParticle();
            p.y = Math.random() * canvas.height;
            p.life = Math.random() * p.maxLife;
            particles.push(p);
        }
    }

    function animate() {
        if (!isVisible) {
            animationId = requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Visibility check
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });

    resize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
}

// ---- Cart System ----
function initCart() {
    const cart = {
        items: [],
        
        add(product) {
            const existing = this.items.find(i => i.id === product.id);
            if (existing) {
                existing.quantity++;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
            this.save();
            this.updateUI();
            this.showToast(product.name);
        },

        remove(id) {
            this.items = this.items.filter(i => i.id !== id);
            this.save();
            this.updateUI();
        },

        updateQuantity(id, delta) {
            const item = this.items.find(i => i.id === id);
            if (!item) return;

            item.quantity += delta;
            if (item.quantity <= 0) {
                this.remove(id);
                return;
            }
            this.save();
            this.updateUI();
        },

        getTotal() {
            return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        },

        getCount() {
            return this.items.reduce((sum, i) => sum + i.quantity, 0);
        },

        save() {
            localStorage.setItem('brassSteamCart', JSON.stringify(this.items));
        },

        load() {
            const saved = localStorage.getItem('brassSteamCart');
            if (saved) {
                try {
                    this.items = JSON.parse(saved);
                } catch (e) {
                    this.items = [];
                }
            }
        },

        showToast(productName) {
            const container = document.querySelector('.toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = `Added to tube: ${productName}`;
            container.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3500);
        },

        updateUI() {
            const badge = document.querySelector('.cart-badge');
            const itemsList = document.querySelector('.cart-items');
            const emptyState = document.querySelector('.cart-empty');
            const subtotalEl = document.querySelector('.subtotal-amount');
            const totalEl = document.querySelector('.total-amount');

            // Update badge
            const count = this.getCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';

            // Update items list
            if (this.items.length === 0) {
                itemsList.innerHTML = '';
                if (emptyState) emptyState.style.display = 'block';
            } else {
                if (emptyState) emptyState.style.display = 'none';
                itemsList.innerHTML = this.items.map(item => `
                    <li class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image">${getProductEmoji(item.id)}</div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">£${(item.price * item.quantity).toFixed(2)}</div>
                            <div class="cart-item-qty">
                                <button class="qty-btn qty-decrease" data-id="${item.id}">−</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn qty-increase" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">×</button>
                    </li>
                `).join('');

                // Bind cart item events
                itemsList.querySelectorAll('.qty-decrease').forEach(btn => {
                    btn.addEventListener('click', () => this.updateQuantity(btn.dataset.id, -1));
                });
                itemsList.querySelectorAll('.qty-increase').forEach(btn => {
                    btn.addEventListener('click', () => this.updateQuantity(btn.dataset.id, 1));
                });
                itemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', () => this.remove(btn.dataset.id));
                });
            }

            // Update totals
            const subtotal = this.getTotal();
            const shipping = subtotal > 0 ? 12 : 0;
            const total = subtotal + shipping;

            if (subtotalEl) subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `£${total.toFixed(2)}`;
        }
    };

    function getProductEmoji(id) {
        const emojis = {
            'aether-goggles': '👓',
            'steam-arm': '💪',
            'compass': '🧭',
            'chronometer': '⏰',
            'skull': '💀',
            'phlogiston': '⚗️',
            'monocle': '👁️',
            'memory-box': '🎶',
            'lung': '🫁',
            'ocular': '👁️',
            'heart': '❤️',
            'leg': '🦵'
        };
        return emojis[id] || '⚙️';
    }

    // Load saved cart
    cart.load();
    cart.updateUI();

    // Cart toggle
    const cartToggle = document.querySelector('.cart-toggle');
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartClose = document.querySelector('.cart-close');

    function openCart() {
        cartPanel.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartPanel.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = btn.closest('.product-card');
            const id = card.dataset.productId;
            const name = card.querySelector('.product-name').textContent;
            const priceText = card.querySelector('.price-amount').textContent;
            const price = parseFloat(priceText);

            cart.add({ id, name, price });

            // Trigger pneumatic animation
            triggerPneumaticAnimation(card);
        });
    });

    // Make cart globally accessible
    window.brassSteamCart = cart;
}

// ---- Pneumatic Tube Animation ----
function initPneumaticTube() {
    // System is initialized, animation triggered on add to cart
}

function triggerPneumaticAnimation(sourceElement) {
    const tubePath = document.querySelector('.tube-path');
    const container = document.querySelector('.capsule-container');

    if (!tubePath || !container) return;

    // Create capsule
    const capsule = document.createElement('div');
    capsule.className = 'pneumatic-capsule';
    capsule.textContent = '⚙️';
    container.appendChild(capsule);

    // Get source position
    const rect = sourceElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Position capsule at start
    capsule.style.position = 'absolute';
    capsule.style.left = `${startX}px`;
    capsule.style.top = `${startY}px`;
    capsule.style.transition = 'none';

    // Show tube
    tubePath.classList.add('active');

    // Animate
    requestAnimationFrame(() => {
        capsule.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        capsule.style.left = 'calc(100% + 80px)';
        capsule.style.top = '50%';
    });

    // Cleanup
    setTimeout(() => {
        capsule.remove();
        tubePath.classList.remove('active');
    }, 900);
}

// ---- Scroll Effects ----
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for staggered reveal
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.08}s`;
        observer.observe(card);
    });

    // Observe philosophy columns
    document.querySelectorAll('.philosophy-col').forEach((col, index) => {
        col.style.opacity = '0';
        col.style.transform = 'translateY(20px)';
        col.style.transition = `all 0.5s ease ${index * 0.15}s`;
        observer.observe(col);
    });

    // Parallax for hero gears
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                document.querySelectorAll('.hero-gear').forEach((gear, index) => {
                    const speed = 0.1 + (index * 0.05);
                    gear.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.1}deg)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ---- Price Ticker Hover Pause ----
function initPriceTickerHover() {
    const ticker = document.querySelector('.ticker-track');
    if (!ticker) return;

    const tickerContainer = document.querySelector('.price-ticker');
    if (!tickerContainer) return;

    tickerContainer.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
    });

    tickerContainer.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
    });
}

// ---- Smooth Scroll for Nav Links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 105; // Account for fixed nav + ticker
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ---- Checkout Button Handler ----
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-checkout')) {
        const cart = window.brassSteamCart;
        if (cart && cart.items.length > 0) {
            // Show checkout toast
            const container = document.querySelector('.toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.style.background = 'linear-gradient(135deg, #2d5a27 0%, #4a7c3f 100%)';
            toast.style.borderColor = '#6ab04c';
            toast.textContent = 'Transaction sealed! Your contraptions will arrive by steam-dirigible.';
            container.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 4000);

            // Clear cart
            cart.items = [];
            cart.save();
            cart.updateUI();
        } else {
            const container = document.querySelector('.toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.style.background = 'linear-gradient(135deg, #5a1a00 0%, #8b2500 100%)';
            toast.style.borderColor = '#c0392b';
            toast.textContent = 'The pneumatic tube is empty, dear patron.';
            container.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }
});