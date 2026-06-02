/* =========================================
   1. INITIALIZATION & GLOBAL STATE
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    initCursorLantern();
    initSmokeParticles();
    initHeroStars();
    initTestimonials();
    initRubInteractions();
    initMainLamp();
    initCart();
    initNewsletter();
    initScrollAnimations();
});

/* =========================================
   2. CURSOR LANTERN GLOW
   ========================================= */
function initCursorLantern() {
    const glow = document.getElementById('lantern-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    // Smoothing factor (0.1 = slow/laggy, 1.0 = instant)
    const smoothing = 0.15;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Linear interpolation for smooth following
        glowX += (mouseX - glowX) * smoothing;
        glowY += (mouseY - glowY) * smoothing;

        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;

        requestAnimationFrame(animate);
    }

    // Initial position
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    animate();
}

/* =========================================
   3. SMOKE PARTICLE SYSTEM
   ========================================= */
function initSmokeParticles() {
    const canvas = document.getElementById('smoke-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const particleCount = 60;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class SmokeParticle {
        constructor() {
            this.reset();
            // Randomize initial Y so they don't all start at the bottom
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + 10;
            this.size = Math.random() * 40 + 20;
            this.speedY = Math.random() * 1 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = 0;
            this.life = 0;
            this.maxLife = Math.random() * 200 + 100;
            // Warm smoke colors
            const colors = ['rgba(194, 168, 120,', 'rgba(212, 168, 67,', 'rgba(138, 37, 54,'];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.life++;

            // Fade in and out
            if (this.life < 50) {
                this.opacity = (this.life / 50) * 0.05;
            } else if (this.life > this.maxLife - 50) {
                this.opacity = ((this.maxLife - this.life) / 50) * 0.05;
            } else {
                this.opacity = 0.05;
            }

            // Wobble
            this.speedX += (Math.random() - 0.5) * 0.05;

            if (this.life >= this.maxLife) {
                this.reset();
            }
        }

        draw(ctx) {
            ctx.beginPath();
            // Soft radial gradient for each particle
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, `${this.colorBase} ${this.opacity})`);
            gradient.addColorStop(1, `${this.colorBase} 0)`);
            
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new SmokeParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Composite operation for additive blending (glowing smoke)
        ctx.globalCompositeOperation = 'screen';

        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* =========================================
   4. HERO STARS
   ========================================= */
function initHeroStars() {
    const container = document.getElementById('hero-stars');
    if (!container) return;

    // Generate 50 stars
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.background = '#fff';
        star.style.borderRadius = '50%';
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        star.style.opacity = Math.random();
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite alternate ${Math.random() * 2}s`;
        container.appendChild(star);
    }
}

/* =========================================
   5. TESTIMONIAL SCROLL LOOP
   ========================================= */
function initTestimonials() {
    const track = document.getElementById('testimonial-track');
    if (!track) return;

    // Duplicate content for seamless infinite scroll
    // We clone the children once to ensure the loop is smooth
    const items = Array.from(track.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
}

/* =========================================
   6. RUB INTERACTIONS (PRODUCT CARDS)
   ========================================= */
function initRubInteractions() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const overlay = card.querySelector('.rub-overlay');
        const progressBar = overlay.querySelector('.rub-progress');
        const revealed = card.querySelector('.revealed-content');
        
        if (!overlay || !progressBar || !revealed) return;

        let isRubbing = false;
        let distanceRubbed = 0;
        let lastX = 0;
        let lastY = 0;
        const threshold = 600; // Distance needed to unlock

        // Create the inner bar element dynamically if not present
        if (!progressBar.querySelector('.rub-progress-bar')) {
            const bar = document.createElement('div');
            bar.className = 'rub-progress-bar';
            progressBar.appendChild(bar);
        }
        const barElement = progressBar.querySelector('.rub-progress-bar');

        overlay.addEventListener('mousedown', (e) => {
            isRubbing = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        overlay.addEventListener('mousemove', (e) => {
            if (!isRubbing) return;
            if (card.classList.contains('revealed')) return;

            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            distanceRubbed += dist;
            lastX = e.clientX;
            lastY = e.clientY;

            // Update progress
            const percent = Math.min((distanceRubbed / threshold) * 100, 100);
            barElement.style.width = `${percent}%`;

            if (distanceRubbed >= threshold) {
                revealSecret(card, overlay, revealed);
            }
        });

        window.addEventListener('mouseup', () => {
            isRubbing = false;
        });
    });

    function revealSecret(card, overlay, revealed) {
        card.classList.add('revealed');
        
        // Fade out overlay
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        
        // Show revealed content
        revealed.classList.add('show');
        
        // Play a small sound effect or visual feedback here if desired
        showToast('Secret Enchantment Revealed!', '✨');
    }
}

/* =========================================
   7. MAIN MAGIC LAMP SECTION
   ========================================= */
function initMainLamp() {
    const lamp = document.getElementById('magic-lamp');
    const prophecyText = document.querySelector('.prophecy-text');
    const sparklesContainer = document.getElementById('lamp-sparkles');

    if (!lamp || !prophecyText) return;

    const prophecies = [
        "Your next journey will take you to the edge of the world and back.",
        "A djinn awaits your command, but choose your words wisely.",
        "Gold shines bright, but wisdom is the true treasure.",
        "Beware the merchant who offers something for nothing.",
        "The stars align for a journey across the sands.",
        "You will find what you seek where you least expect it.",
        "A carpet woven of dreams awaits your footstep.",
        "The spice you need lies in the garden of the unseen.",
        "Tonight, the bazaar opens its secret doors to you."
    ];

    let isRubbing = false;
    let distanceRubbed = 0;
    let lastX = 0;
    let lastY = 0;
    const threshold = 300;
    let cooldown = false;

    lamp.addEventListener('mousedown', (e) => {
        if (cooldown) return;
        isRubbing = true;
        lastX = e.clientX;
        lastY = e.clientY;
        lamp.style.transform = 'scale(0.95)';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isRubbing || cooldown) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        distanceRubbed += dist;
        lastX = e.clientX;
        lastY = e.clientY;

        // Add sparkles based on movement
        if (Math.random() > 0.7) {
            createSparkle(e.clientX, e.clientY, sparklesContainer);
        }

        if (distanceRubbed >= threshold) {
            revealProphecy();
        }
    });

    window.addEventListener('mouseup', () => {
        isRubbing = false;
        lamp.style.transform = 'scale(1)';
    });

    function revealProphecy() {
        distanceRubbed = 0;
        cooldown = true;
        lamp.style.transform = 'scale(1.1)';
        lamp.style.filter = 'brightness(1.5)';
        
        // Change text
        prophecyText.style.opacity = '0';
        setTimeout(() => {
            prophecyText.textContent = prophecies[Math.floor(Math.random() * prophecies.length)];
            prophecyText.style.opacity = '1';
        }, 300);

        // Create burst of sparkles
        for(let i=0; i<20; i++) {
            createSparkle(
                lamp.getBoundingClientRect().left + lamp.offsetWidth/2, 
                lamp.getBoundingClientRect().top + lamp.offsetHeight/2, 
                sparklesContainer
            );
        }

        showToast('The Lamp Speaks!', '🪔');

        setTimeout(() => {
            lamp.style.transform = 'scale(1)';
            lamp.style.filter = 'brightness(1)';
            cooldown = false;
        }, 1500);
    }
}

function createSparkle(x, y, container) {
    // We need to adjust coordinates to be relative to the container
    const rect = container.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${relX}px`;
    sparkle.style.top = `${relY}px`;
    // Randomize animation delay and duration slightly
    sparkle.style.animationDuration = `${Math.random() * 1 + 1}s`;
    
    container.appendChild(sparkle);

    // Remove after animation
    setTimeout(() => sparkle.remove(), 2000);
}

/* =========================================
   8. CART FUNCTIONALITY
   ========================================= */
function initCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartBtn = document.querySelector('.cart-btn');
    const cartClose = document.getElementById('cart-close');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalDisplay = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Simple cart state
    let cart = [
        { id: 'init-1', name: 'Saffron Sample', price: 50, icon: '🌾' },
        { id: 'init-2', name: 'Lamp Oil', price: 20, icon: '🛢️' }
    ];

    // Add to Cart Buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const name = card.querySelector('.product-name').textContent;
            const priceText = card.querySelector('.price-amount').textContent;
            const price = parseInt(priceText.replace(/,/g, ''));
            const icon = card.querySelector('.product-image').textContent.trim() || '🎁';

            addItemToCart({
                id: btn.dataset.productId,
                name: name,
                price: price,
                icon: icon.substring(0, 2) // Get emoji if present
            });
        });
    });

    function addItemToCart(item) {
        cart.push(item);
        updateCartUI();
        showToast(`${item.name} added to your basket!`, '🧺');
    }

    function removeItemFromCart(id) {
        const index = cart.findIndex(i => i.id === id);
        if (index > -1) {
            cart.splice(index, 1);
            updateCartUI();
        }
    }

    function updateCartUI() {
        // Update badge count
        const count = document.querySelector('.cart-count');
        count.textContent = cart.length;

        // Update List
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price;
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ✦</div>
                </div>
                <button class="remove-item-btn" onclick="removeItemFromCart('${item.id}')" style="color:var(--ruby-red); font-size:1.2rem;">✕</button>
            `;
            cartItemsContainer.appendChild(el);
        });

        cartTotalDisplay.textContent = `${total.toLocaleString()} ✦ Gold Dinars`;
    }

    // Make removeItemFromCart globally accessible for the inline onclick
    window.removeItemFromCart = removeItemFromCart;

    // Event Listeners
    cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
    cartClose.addEventListener('click', () => cartModal.classList.remove('active'));
    cartBackdrop.addEventListener('click', () => cartModal.classList.remove('active'));

    checkoutBtn.addEventListener('click', () => {
        showToast('Order sent via Carrier Pigeon!', '🕊️');
        cart = [];
        updateCartUI();
        cartModal.classList.remove('active');
    });
}

/* =========================================
   9. NEWSLETTER FORM
   ========================================= */
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const successMsg = document.getElementById('newsletter-success');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate sending
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending Pigeon...';
        btn.disabled = true;

        setTimeout(() => {
            form.style.display = 'none';
            successMsg.classList.add('show');
            showToast('The pigeon has taken flight!', '🕊️');
        }, 1500);
    });
}

/* =========================================
   10. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================= */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll(
        '.product-card, .category-card, .section-header, .mosaic-text, .lamp-content, .scroll-container, .footer-section'
    );

    animatedElements.forEach(el => {
        // Set initial state via JS to ensure CSS handles the transition smoothly
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Add staggered delay based on index within parent
        const siblings = Array.from(el.parentElement.children).filter(c => animatedElements.includes(c));
        const index = siblings.indexOf(el);
        el.style.transitionDelay = `${index * 0.1}s`;

        observer.observe(el);
    });
}

/* =========================================
   11. TOAST NOTIFICATION SYSTEM
   ========================================= */
function showToast(message, icon = '✦') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Remove after delay
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}