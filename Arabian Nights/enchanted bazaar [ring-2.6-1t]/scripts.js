/* ============================================================
   THE ENCHANTED BAZAAR — Interactive Scripts
   A Thousand and One Nights Inspired Marketplace
   ============================================================ */

(function () {
    'use strict';

    // ===== DOM REFERENCES =====
    const lanternGlow = document.getElementById('lantern-glow');
    const lanternTrail = document.getElementById('lantern-trail');
    const smokeContainer = document.getElementById('smoke-container');
    const heroStars = document.getElementById('hero-stars');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], .tale-section, .testimonials-section');
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartItemsEl = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total');
    const magicLampOverlay = document.getElementById('magic-lamp-overlay');
    const magicLampModal = document.getElementById('magic-lamp-modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalWisdom = document.getElementById('modalWisdom');
    const modalClose = document.getElementById('modal-close');
    const modalDismiss = document.getElementById('modal-dismiss');
    const djinnReleaseOverlay = document.getElementById('djinn-release-overlay');
    const djinnReleaseScene = document.getElementById('djinn-release-scene');
    const releaseBottle = document.getElementById('releaseBottle');
    const releaseDjinn = document.getElementById('releaseDjinn');
    const djinnSpirit = document.getElementById('djinnSpirit');
    const djinnMist = document.getElementById('djinnMist');
    const releaseMessage = document.getElementById('releaseMessage');
    const releaseDismiss = document.getElementById('release-dismiss');
    const spiceOverlay = document.getElementById('spice-overlay');
    const spiceAuraModal = document.getElementById('spice-aura-modal');
    const spiceVisualDisplay = document.getElementById('spiceVisualDisplay');
    const spiceAuraTitle = document.getElementById('spiceAuraTitle');
    const spiceAuraDesc = document.getElementById('spiceAuraDesc');
    const spiceAuraParticles = document.getElementById('spiceAuraParticles');
    const spiceOverlayDismiss = document.getElementById('spice-overlay-dismiss');
    const currentYearEl = document.getElementById('currentYear');

    // ===== STATE =====
    let cart = [];
    let currentYear = new Date().getFullYear();

    // ===== PRODUCT DATABASE =====
    const products = {
        'carpet-1': { name: 'Starweaver', price: 850, icon: '🧵', category: 'carpet' },
        'carpet-2': { name: 'Sands of Samarkand', price: 620, icon: '🏜️', category: 'carpet' },
        'carpet-3': { name: 'Phoenix Silk', price: 1200, icon: '🕊️', category: 'carpet' },
        'djinn-1': { name: 'Azure Whisper', price: 1500, icon: '🫗', category: 'djinn' },
        'djinn-2': { name: 'Crimson Flame', price: 2000, icon: '🔥', category: 'djinn' },
        'djinn-3': { name: 'Emerald Dream', price: 1750, icon: '💚', category: 'djinn' },
        'djinn-4': { name: 'Obsidian Storm', price: 5000, icon: '⚫', category: 'djinn' },
        'lamp-1': { name: "The Sultan's Seal", price: 2500, icon: '🪔', category: 'lamp' },
        'lamp-2': { name: 'Moonstone Veil', price: 3200, icon: '🌙', category: 'lamp' },
        'lamp-3': { name: 'Obsidian Whisper', price: 4000, icon: '🖤', category: 'lamp' },
        'spice-1': { name: 'Phoenix Pepper', price: 450, icon: '🌶️', category: 'spice' },
        'spice-2': { name: "Dreamer's Saffron", price: 680, icon: '🌿', category: 'spice' },
        'spice-3': { name: "Time's Cinnamon", price: 950, icon: '⏳', category: 'spice' },
        'spice-4': { name: 'Star Anise of Levitation', price: 3800, icon: '⭐', category: 'spice' }
    };

    // ===== LAMP WISDOM MESSAGES =====
    const lampWisdom = {
        'sultan': [
            { message: 'I am the Sultan\'s Seal, keeper of a thousand wishes.', wisdom: 'The greatest treasure is not gold, but the courage to pursue what sets your soul ablaze.' },
            { message: 'You have polished my brass and awakened my ancient spirit.', wisdom: 'Beware what you wish for — I grant exactly what you ask, not what you desire.' },
            { message: 'The sands remember me well. I have served pharaohs and paupers alike.', wisdom: 'True power lies not in commanding others, but in mastering oneself.' }
        ],
        'moonstone': [
            { message: 'The Silver Oasis sends its regards, traveler.', wisdom: 'What you seek in the darkness is already within the light — you need only look.' },
            { message: 'I see the threads of fate woven around you like moonbeams.', wisdom: 'The future is not fixed. Even I, who show what is to come, change with every choice you make.' },
            { message: 'You shine with the reflection of a thousand moons.', wisdom: 'Trust the silence between heartbeats — that is where truth resides.' }
        ],
        'obsidian': [
            { message: '...A thousand years in darkness, and finally... a touch.', wisdom: 'The oldest wisdom comes wrapped in riddles. Seek the answer between the words.' },
            { message: 'You dare awaken that which sleeps beneath the earth?', wisdom: 'Shadow is not the absence of light, but the proof that light once shone here.' },
            { message: 'I was sealed before your great-great-grandmother drew breath.', wisdom: 'Patience, traveler. Even obsidian was once molten and formless.' }
        ]
    };

    // ===== DJINN MESSAGES =====
    const djinnMessages = {
        'azure': {
            release: 'Knowledge unfurls like an infinite scroll!',
            message: 'I am the Azure Whisper — I know every question ever asked and every answer yet to be spoken. What would you know?'
        },
        'crimson': {
            release: 'The air ignites with ancient fury!',
            message: 'I am Crimson Flame — born of the first spark! My fire forges courage in the hearts of the brave!'
        },
        'emerald': {
            release: 'Sweet dreams cascade like waterfalls of jade!',
            message: 'I am Emerald Dream — I paint your waking hours with visions of beauty and your sleep with stories untold.'
        },
        'obsidian': {
            release: 'Shadows erupt from their ancient prison!',
            message: 'I am the Obsidian Storm — I do not serve the weak. Only those with iron will may command my power.'
        }
    };

    // ===== AURA CONFIGURATIONS =====
    const spiceAuras = {
        'spice-1': {
            name: 'Phoenix Pepper',
            desc: 'A swirling inferno of crimson and gold. The particles dance like embers from a celestial forge, each one carrying the heat of a dying star and the promise of rebirth. Those who breathe its aura taste the future on their tongue — a future where they are stronger, fiercer, and reborn from their own ashes.',
            colors: ['#ff6b35', '#e65100', '#ffc107', '#ff5722'],
            particleCount: 30
        },
        'spice-2': {
            name: "Dreamer's Saffron",
            desc: 'A soft ethereal glow of violet and gold, swirling like auroras in a midnight sky. The particles drift lazily, each carrying a fragment of forgotten dreams and half-remembered lullabies. To inhale its aura is to walk through gardens that exist only in the spaces between sleep and waking.',
            colors: ['#b388ff', '#7c4dff', '#ea80fc', '#651fff'],
            particleCount: 25
        },
        'spice-3': {
            name: "Time's Cinnamon",
            desc: 'An amber swirl that pulses with the rhythm of clocks and seasons. Golden particles spiral in figure-eights, each one a tiny hourglass. The scent is of old parchment and autumn rain. Those enveloped in its aura report vivid memories from childhood and tantalizing glimpses of years yet to come.',
            colors: ['#e65100', '#ffc107', '#ff9800', '#ff6d00'],
            particleCount: 28
        },
        'spice-4': {
            name: 'Star Anise of Levitation',
            desc: 'A celestial silver-blue shimmer with particles that defy gravity, floating upward with impossible grace. Each particle is a tiny star, pulsing with the light of distant constellations. The aura hums with a frequency that makes the body feel lighter, as if the bonds of gravity are merely suggestions.',
            colors: ['#e0e0e0', '#b3e5fc', '#81d4fa', '#4fc3f7'],
            particleCount: 35
        }
    };

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        setCurrentYear();
        createHeroStars();
        createSmokeParticles();
        setupCursorGlow();
        setupNavigation();
        setupCart();
        setupProductActions();
        setupLampRubInteraction();
        setupDjinnReleaseInteraction();
        setupSpiceAuraInteraction();
        setupScrollAnimations();
        createWindLines();
        createSandParticles();
        createSpiceParticles();
        setupSmoothScroll();
    }

    // ========================================
    // CURSOR LANTERN GLOW
    // ========================================

    function setupCursorGlow() {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            trailX += (mouseX - trailX) * 0.04;
            trailY += (mouseY - trailY) * 0.04;

            lanternGlow.style.left = glowX + 'px';
            lanternGlow.style.top = glowY + 'px';
            lanternTrail.style.left = trailX + 'px';
            lanternTrail.style.top = trailY + 'px';

            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ========================================
    // INCENSE SMOKE PARTICLES
    // ========================================

    function createSmokeParticles() {
        const particleCount = 12;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('smoke-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (6 + Math.random() * 8) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (40 + Math.random() * 80) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = 0.03 + Math.random() * 0.05;
            smokeContainer.appendChild(particle);
        }
    }

    // ========================================
    // HERO STARS
    // ========================================

    function createHeroStars() {
        const count = 80;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('hero-star');
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDuration = (2 + Math.random() * 4) + 's';
            star.style.animationDelay = Math.random() * 5 + 's';
            star.style.width = star.style.height = (1 + Math.random() * 2.5) + 'px';
            heroStars.appendChild(star);
        }
    }

    // ========================================
    // NAVIGATION
    // ========================================

    function setupNavigation() {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ========================================
    // WIND LINES (Flying Carpet Effect)
    // ========================================

    function createWindLines() {
        const windContainers = document.querySelectorAll('.carpet-wind-lines');
        windContainers.forEach(container => {
            const count = 5;
            for (let i = 0; i < count; i++) {
                const line = document.createElement('div');
                line.classList.add('wind-line');
                line.style.top = (10 + Math.random() * 80) + '%';
                line.style.width = (40 + Math.random() * 100) + 'px';
                line.style.animationDuration = (2 + Math.random() * 3) + 's';
                line.style.animationDelay = (Math.random() * 4) + 's';
                line.style.opacity = 0.15 + Math.random() * 0.2;
                container.appendChild(line);
            }
        });
    }

    // ========================================
    // SAND PARTICLES (Sands of Samarkand)
    // ========================================

    function createSandParticles() {
        const carpetSands = document.getElementById('carpet-sands');
        if (!carpetSands) return;
        const sandContainer = carpetSands.querySelector('.carpet-sand-particles');
        if (!sandContainer) return;

        for (let i = 0; i < 15; i++) {
            const sand = document.createElement('div');
            sand.classList.add('sand-particle');
            sand.style.left = Math.random() * 90 + 5 + '%';
            sand.style.top = Math.random() * 80 + 10 + '%';
            sand.style.animationDuration = (3 + Math.random() * 4) + 's';
            sand.style.animationDelay = (Math.random() * 3) + 's';
            sand.style.width = sand.style.height = (1.5 + Math.random() * 2) + 'px';
            sandContainer.appendChild(sand);
        }
    }

    // ========================================
    // SPICE PARTICLES
    // ========================================

    function createSpiceParticles() {
        const spiceVisuals = document.querySelectorAll('.spice-visual');
        spiceVisuals.forEach(visual => {
            const particlesContainer = visual.querySelector('.spice-particles');
            if (!particlesContainer) return;

            const count = 8 + Math.floor(Math.random() * 5);
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.classList.add('spice-particle');
                particle.style.left = Math.random() * 80 + 10 + '%';
                particle.style.top = Math.random() * 60 + 20 + '%';
                particle.style.animationDuration = (2 + Math.random() * 3) + 's';
                particle.style.animationDelay = (Math.random() * 3) + 's';

                const visualId = visual.parentElement.parentElement.parentElement.id;
                if (visualId === 'spice-phoenix' || visualId === 'spice-time') {
                    particle.style.width = particle.style.height = (2 + Math.random() * 3) + 'px';
                    particle.style.background = Math.random() > 0.5 ? '#ffc107' : '#ff6b35';
                    particle.style.boxShadow = '0 0 6px currentColor';
                } else if (visualId === 'spice-dreamer') {
                    particle.style.width = particle.style.height = (3 + Math.random() * 4) + 'px';
                    particle.style.background = Math.random() > 0.5 ? '#b388ff' : '#ea80fc';
                    particle.style.boxShadow = '0 0 8px currentColor';
                } else {
                    particle.style.width = particle.style.height = (2 + Math.random() * 2) + 'px';
                    particle.style.background = Math.random() > 0.5 ? '#e0e0e0' : '#81d4fa';
                    particle.style.boxShadow = '0 0 6px currentColor';
                }

                particlesContainer.appendChild(particle);
            }
        });
    }

    // ========================================
    // CART FUNCTIONALITY
    // ========================================

    function setupCart() {
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.toggle('active');
            cartOverlay.classList.toggle('active');
        });

        cartClose.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    function addToCart(productId) {
        const product = products[productId];
        if (!product) return;

        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id: productId, ...product, quantity: 1 });
        }

        updateCart();

        // Visual feedback
        const addButton = document.querySelector(`[data-product="${productId}"] .btn-cart`);
        if (addButton) {
            const originalText = addButton.innerHTML;
            addButton.innerHTML = '<span>✓ Added!</span>';
            addButton.style.background = 'linear-gradient(135deg, #2e7d32, #1b5e20)';
            setTimeout(() => {
                addButton.innerHTML = originalText;
                addButton.style.background = '';
            }, 1500);
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    function updateCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        cartCountEl.textContent = totalItems;
        cartTotalEl.textContent = `Ⓜ️ ${totalPrice.toLocaleString()}`;

        cartItemsEl.innerHTML = '';

        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
            cartItemsEl.appendChild(cartEmpty);
        } else {
            cartEmpty.style.display = 'none';
            cartFooter.style.display = 'block';

            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <div class="cart-item-icon">${item.icon}</div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Ⓜ️ ${item.price} × ${item.quantity} = Ⓜ️ ${(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                    <button class="cart-item-remove" data-remove="${item.id}" title="Remove">&times;</button>
                `;
                cartItemsEl.appendChild(itemEl);
            });

            // Attach remove handlers
            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFromCart(btn.dataset.remove);
                });
            });
        }
    }

    // ========================================
    // PRODUCT ACTIONS (Add to Cart buttons)
    // ========================================

    function setupProductActions() {
        document.querySelectorAll('.btn-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.product-card');
                if (card) {
                    addToCart(card.dataset.product);

                    // Add a subtle bounce to the cart icon in header
                    const cartBtn = document.getElementById('cart-toggle');
                    cartBtn.style.transform = 'scale(1.2)';
                    setTimeout(() => { cartBtn.style.transform = 'scale(1)'; }, 300);
                }
            });
        });
    }

    // ========================================
    // MAGIC LAMP - Rub to Reveal
    // ========================================

    function setupLampRubInteraction() {
        document.querySelectorAll('.btn-rub[data-action="rub-lamp"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lampId = btn.dataset.lamp;
                openMagicLamp(lampId);
            });
        });

        modalClose.addEventListener('click', closeMagicLamp);
        modalDismiss.addEventListener('click', closeMagicLamp);

        magicLampOverlay.addEventListener('click', (e) => {
            if (e.target === magicLampOverlay) closeMagicLamp();
        });
    }

    function openMagicLamp(lampId) {
        const wisdomSet = lampWisdom[lampId] || lampWisdom['sultan'];
        const wisdom = wisdomSet[Math.floor(Math.random() * wisdomSet.length)];

        const lampNames = {
            'sultan': "The Sultan's Seal",
            'moonstone': 'Moonstone Veil',
            'obsidian': 'Obsidian Whisper'
        };

        modalTitle.textContent = lampNames[lampId] || 'Enchanted Lamp';
        modalMessage.textContent = '✨ Smoke swirls from within the lamp as a djinn materializes before you...';
        modalWisdom.textContent = '';

        magicLampOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate the lamp visual
        const lampGlowEl = document.getElementById('lampGlow' + capitalizeFirst(lampId));
        if (lampGlowEl) {
            lampGlowEl.style.animation = 'none';
            lampGlowEl.offsetHeight; // trigger reflow
            lampGlowEl.style.animation = 'lampGlowPulse 0.5s ease-in-out 3';
        }

        const swooshEl = document.getElementById('lampSwoosh' + capitalizeFirst(lampId));
        if (swooshEl) {
            swooshEl.innerHTML = `
                <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10,30 Q30,5 50,30 Q70,55 90,30 Q110,5 120,30" stroke="rgba(255,193,7,0.4)" stroke-width="2" fill="none"/>
                    <path d="M10,30 Q30,5 50,30 Q70,55 90,30 Q110,5 120,30" stroke="rgba(255,152,0,0.2)" stroke-width="4" fill="none" stroke-dasharray="4 4" animation="dash 2s linear infinite"/>
                </svg>
            `;
        }

        // Reveal wisdom after a dramatic pause
        setTimeout(() => {
            modalMessage.textContent = wisdom.message;
            modalMessage.style.opacity = '0';
            modalMessage.style.transition = 'opacity 0.8s ease';
            requestAnimationFrame(() => {
                modalMessage.style.opacity = '1';
            });
        }, 1500);

        setTimeout(() => {
            modalWisdom.textContent = '"' + wisdom.wisdom + '"';
            modalWisdom.style.opacity = '0';
            modalWisdom.style.transition = 'opacity 1s ease';
            requestAnimationFrame(() => {
                modalWisdom.style.opacity = '1';
            });
        }, 3000);
    }

    function closeMagicLamp() {
        magicLampOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ========================================
    // DJINN RELEASE
    // ========================================

    function setupDjinnReleaseInteraction() {
        document.querySelectorAll('.btn-rub[data-action="release-djinn"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const djinnId = btn.dataset.djinn;
                openDjinnRelease(djinnId);
            });
        });

        releaseDismiss.addEventListener('click', closeDjinnRelease);

        djinnReleaseOverlay.addEventListener('click', (e) => {
            if (e.target === djinnReleaseOverlay) closeDjinnRelease();
        });
    }

    function openDjinnRelease(djinnId) {
        const djinn = djinnMessages[djinnId] || djinnMessages['azure'];

        releaseMessage.textContent = djinn.release;
        releaseMessage.style.opacity = '0';

        djinnReleaseOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Set djinn color
        const djinnColors = {
            'azure': { body: 'rgba(25, 118, 210, 0.6)', eyes: '#2979ff', mist: 'rgba(25, 118, 210, 0.2)' },
            'crimson': { body: 'rgba(198, 40, 40, 0.6)', eyes: '#ff5252', mist: 'rgba(198, 40, 40, 0.2)' },
            'emerald': { body: 'rgba(46, 125, 50, 0.6)', eyes: '#69f0ae', mist: 'rgba(46, 125, 50, 0.2)' },
            'obsidian': { body: 'rgba(33, 33, 33, 0.8)', eyes: '#ffab40', mist: 'rgba(33, 33, 33, 0.3)' }
        };

        const colors = djinnColors[djinnId] || djinnColors['azure'];

        const spiritBody = djinnSpirit.querySelector('.djinn-body-shape');
        if (spiritBody) spiritBody.style.background = `radial-gradient(ellipse at center, ${colors.body} 0%, transparent 70%)`;

        const eyes = djinnSpirit.querySelectorAll('.djinn-eye');
        eyes.forEach(eye => {
            eye.style.background = colors.eyes;
            eye.style.boxShadow = `0 0 12px ${colors.eyes}`;
        });

        djinnMist.style.background = `radial-gradient(ellipse at center, ${colors.mist} 0%, transparent 70%)`;

        // Animate bottle shatter
        setTimeout(() => {
            releaseBottle.classList.add('shattered');
            releaseMessage.style.opacity = '1';
            releaseMessage.style.transition = 'opacity 1s ease';
        }, 500);

        // Show djinn spirit
        setTimeout(() => {
            djinnSpirit.style.opacity = '1';
        }, 800);

        // Show full message
        setTimeout(() => {
            const msg = document.createElement('div');
            msg.textContent = djinn.message;
            msg.style.cssText = 'font-family: var(--font-arabic); font-size: 1.1rem; color: var(--warm-cream); margin-top: 20px; direction: rtl; line-height: 1.8;';
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 1s ease';

            const existingMsg = djinnReleaseScene.querySelector('.djinn-full-message');
            if (existingMsg) existingMsg.remove();
            msg.classList.add('djinn-full-message');
            djinnReleaseScene.appendChild(msg);

            requestAnimationFrame(() => {
                msg.style.opacity = '1';
            });
        }, 2000);
    }

    function closeDjinnRelease() {
        djinnReleaseOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Reset
        releaseBottle.classList.remove('shattered');
        const fullMsg = djinnReleaseScene.querySelector('.djinn-full-message');
        if (fullMsg) fullMsg.remove();
    }

    // ========================================
    // SPICE AURA VIEWER
    // ========================================

    function setupSpiceAuraInteraction() {
        document.querySelectorAll('.btn-rub[data-action="view-spice"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = btn.closest('.product-card');
                if (!productCard) return;
                const productId = productCard.dataset.product;
                openSpiceAura(productId);
            });
        });

        spiceOverlayDismiss.addEventListener('click', closeSpiceAura);

        spiceOverlay.addEventListener('click', (e) => {
            if (e.target === spiceOverlay) closeSpiceAura();
        });
    }

    function openSpiceAura(productId) {
        const aura = spiceAuras[productId];
        if (!aura) return;

        spiceAuraTitle.textContent = aura.name;
        spiceAuraDesc.textContent = aura.desc;

        // Create the spinning visual
        spiceVisualDisplay.innerHTML = '';
        const innerGlow = document.createElement('div');
        innerGlow.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: radial-gradient(circle, ${aura.colors[0]} 0%, transparent 70%);
            box-shadow: 0 0 40px ${aura.colors[0]}44;
            animation: spiceGlowPulse 2s ease-in-out infinite;
        `;
        spiceVisualDisplay.appendChild(innerGlow);

        // Add orbiting particles
        for (let i = 0; i < 8; i++) {
            const orb = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const radius = 45;
            orb.style.cssText = `
                position: absolute;
                top: calc(50% + ${Math.sin(angle) * radius}px - 6px);
                left: calc(50% + ${Math.cos(angle) * radius}px - 6px);
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: ${aura.colors[i % aura.colors.length]};
                box-shadow: 0 0 12px ${aura.colors[i % aura.colors.length]}88;
                animation: orbit ${3 + i * 0.3}s linear infinite;
            `;
            spiceVisualDisplay.appendChild(orb);
        }

        // Create aura particles in modal
        spiceAuraParticles.innerHTML = '';
        for (let i = 0; i < aura.particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('aura-particle');
            particle.style.left = Math.random() * 90 + 5 + '%';
            particle.style.top = Math.random() * 90 + 5 + '%';
            particle.style.background = aura.colors[Math.floor(Math.random() * aura.colors.length)];
            particle.style.animationDelay = (Math.random() * 4) + 's';
            particle.style.animationDuration = (3 + Math.random() * 4) + 's';
            particle.style.boxShadow = `0 0 8px ${particle.style.background}`;
            spiceAuraParticles.appendChild(particle);
        }

        spiceOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSpiceAura() {
        spiceOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================

    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');

                    // Product cards get special treatment
                    if (entry.target.classList.contains('product-card')) {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }

                    // Testimonial cards
                    if (entry.target.classList.contains('testimonial-card')) {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }

                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe product cards
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(card);
        });

        // Observe testimonials
        document.querySelectorAll('.testimonial-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(card);
        });
    }

    // ========================================
    // HOVER EFFECTS FOR CARDS
    // ========================================

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const visual = card.querySelector('.product-visual');
            if (visual.classList.contains('carpet-visual')) {
                // Lift the carpet
                visual.style.transform = 'translateY(-8px) rotate(-2deg)';
                visual.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 1)';

                // Show wind lines
                const windLines = card.querySelector('.carpet-wind-lines');
                if (windLines) {
                    windLines.style.opacity = '1';
                    windLines.querySelectorAll('.wind-line').forEach(line => {
                        line.style.animationPlayState = 'running';
                    });
                }
            }

            if (visual.classList.contains('djinn-visual')) {
                const bottle = visual.querySelector('.bottle');
                if (bottle) {
                    bottle.style.transform = 'translateY(-5px)';
                    bottle.style.transition = 'transform 0.5s ease';

                    // Eyes become more active
                    const eyes = visual.querySelectorAll('.eye');
                    eyes.forEach(eye => {
                        eye.style.animationDuration = '0.8s';
                    });
                }
            }

            if (visual.classList.contains('lamp-visual')) {
                const lampGlow = visual.querySelector('.lamp-glow');
                if (lampGlow) {
                    lampGlow.style.animationDuration = '1s';
                    lampGlow.style.opacity = '0.8';
                }
            }

            if (visual.classList.contains('spice-visual')) {
                const particles = visual.querySelector('.spice-particles');
                if (particles) {
                    particles.querySelectorAll('.spice-particle').forEach(p => {
                        p.style.animationDuration = (parseFloat(p.style.animationDuration) * 0.5) + 's';
                    });
                }
            }
        });

        card.addEventListener('mouseleave', () => {
            const visual = card.querySelector('.product-visual');

            if (visual.classList.contains('carpet-visual')) {
                visual.style.transform = 'translateY(0) rotate(0deg)';

                const windLines = card.querySelector('.carpet-wind-lines');
                if (windLines) {
                    windLines.querySelectorAll('.wind-line').forEach(line => {
                        line.style.animationPlayState = 'paused';
                    });
                }
            }

            if (visual.classList.contains('djinn-visual')) {
                const bottle = visual.querySelector('.bottle');
                if (bottle) {
                    bottle.style.transform = 'translateY(0)';
                }

                const eyes = visual.querySelectorAll('.eye');
                eyes.forEach(eye => {
                    eye.style.animationDuration = '2s';
                });
            }

            if (visual.classList.contains('lamp-visual')) {
                const lampGlow = visual.querySelector('.lamp-glow');
                if (lampGlow) {
                    lampGlow.style.animationDuration = '3s';
                    lampGlow.style.opacity = '0.4';
                }
            }

            if (visual.classList.contains('spice-visual')) {
                const particles = visual.querySelector('.spice-particles');
                if (particles) {
                    particles.querySelectorAll('.spice-particle').forEach(p => {
                        p.style.animationDuration = (parseFloat(p.style.animationDuration) * 2) + 's';
                    });
                }
            }
        });
    });

    // ========================================
    // PARALLAX EFFECT ON HERO
    // ========================================

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const heroContent = heroSection.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            }

            const floatingElements = heroSection.querySelector('.floating-elements');
            if (floatingElements) {
                floatingElements.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
        }

        // Fade out the arch frame on scroll
        const bazaarFrame = document.getElementById('bazaar-frame');
        if (bazaarFrame) {
            const opacity = Math.max(0, 1 - scrollY / 400);
            bazaarFrame.style.opacity = opacity;
        }
    });

    // ========================================
    // CHECKOUT SIMULATION
    // ========================================

    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-checkout')) {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your satchel is empty, traveler! Browse our wares first.');
                return;
            }

            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

            if (confirm(`Seal this transaction?\n\n${itemCount} magical item(s)\nTotal: Ⓜ️ ${total.toLocaleString()}\n\nThe Keeper awaits your payment...`)) {
                cart = [];
                updateCart();
                closeCart();

                // Show celebration
                showCelebration();
            }
        }
    });

    function showCelebration() {
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 9999;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            animation: celebrationFade 4s ease-out forwards;
        `;

        // Create golden particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.textContent = ['✦', '✧', '★', '☽', '☾', 'Ⓜ️'][Math.floor(Math.random() * 6)];
            particle.style.cssText = `
                position: absolute;
                font-size: ${1 + Math.random() * 2}rem;
                color: #ffc107;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleBurst ${2 + Math.random() * 2}s ease-out ${Math.random() * 1}s both;
                text-shadow: 0 0 15px rgba(255, 193, 7, 0.8);
            `;
            celebration.appendChild(particle);
        }

        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                font-family: 'Cinzel Decorative', serif;
                font-size: 2rem;
                color: #ffc107;
                text-shadow: 0 0 30px rgba(255, 193, 7, 0.6);
                text-align: center;
                letter-spacing: 5px;
                z-index: 1;
                animation: celebrationPulse 1s ease-in-out infinite;
            ">Transaction Sealed!</div>
            <div style="
                font-family: 'Scheherazade New', serif;
                font-size: 1.2rem;
                color: #f5e6c8;
                margin-top: 15px;
                text-align: center;
                font-style: italic;
                z-index: 1;
                animation: celebrationPulse 1.5s ease-in-out infinite 0.5s both;
            ">May the magic serve you well, traveler.</div>
        `;
        celebration.appendChild(message);

        document.body.appendChild(celebration);

        setTimeout(() => celebration.remove(), 5000);
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function setCurrentYear() {
        if (currentYearEl) {
            currentYearEl.textContent = currentYear;
        }
    }

    // ========================================
    // DYNAMIC CSS INJECTIONS (Keyframes)
    // ========================================

    function injectKeyframes() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes celebrationFade {
                0% { opacity: 1; }
                80% { opacity: 1; }
                100% { opacity: 0; }
            }

            @keyframes particleBurst {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { transform: translate(${() => (Math.random() - 0.5) * 200}px, ${() => (Math.random() - 0.5) * 200}px) scale(0); opacity: 0; }
            }

            @keyframes celebrationPulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.05); opacity: 1; }
            }

            @keyframes dash {
                to { stroke-dashoffset: -20px; }
            }

            @keyframes spiceGlowPulse {
                0%, 100% { opacity: 0.6; transform: scale(1) translate(-50%, -50%); }
                50% { opacity: 1; transform: scale(1.1) translate(-50%, -50%); }
            }

            @keyframes orbit {
                from { transform: rotate(0deg) translateX(50px) rotate(0deg); }
                to { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
            }

            @keyframes djinnFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }

            @keyframes shimmerMove {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // ========================================
    // AMBIENT SOUND SIMULATION (Visual)
    // ========================================

    function createAmbientVisuals() {
        // Create a subtle ambient shimmer on the header
        const header = document.getElementById('main-header');
        if (header) {
            const shimmer = document.createElement('div');
            shimmer.style.cssText = `
                position: absolute;
                bottom: 0;
                left: -100%;
                width: 50%;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
                animation: shimmerMove 3s ease-in-out infinite;
                opacity: 0.3;
            `;
            header.style.position = 'relative';
            header.appendChild(shimmer);
        }
    }

    // ========================================
    // LAUNCH APPLICATION
    // ========================================

    // Wait for DOM and fonts to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            injectKeyframes();
            createAmbientVisuals();
        });
    } else {
        init();
        injectKeyframes();
        createAmbientVisuals();
    }

    // Log a mystical greeting to the console
    console.log(
        `%c✦ Welcome to the Bazaar of a Thousand Wonders ✦`,
        `font-family: 'Cinzel Decorative', serif; font-size: 18px; color: #d4a843; text-shadow: 0 0 10px rgba(212, 168, 67, 0.5);`
    );
    console.log(
        `%c"He who enters with wonder, leaves with magic."`,
        `font-family: 'Playfair Display', serif; font-style: italic; font-size: 14px; color: #a0844c;`
    );

})();