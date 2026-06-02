/* =====================================================
   AL-MIRAJ BAZAAR - ENCHANTED MARKETPLACE SCRIPTS
   Interactive magic for an immersive experience
   ===================================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initLanternCursor();
    initIncenseSmoke();
    initMagicLampInteraction();
    initScrollAnimations();
    initNavigation();
    initModal();
    initCartButtons();
    initCategoryCards();
    initParallaxEffects();
});

/* =====================================================
   LANTERN CURSOR - Glowing lantern that follows mouse
   ===================================================== */
function initLanternCursor() {
    const lantern = document.getElementById('lanternCursor');
    if (!lantern) return;
    
    let mouseX = 0, mouseY = 0;
    let lanternX = 0, lanternY = 0;
    const speed = 0.15; // Smooth following
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth animation loop for lantern
    function animateLantern() {
        // Ease towards mouse position
        lanternX += (mouseX - lanternX) * speed;
        lanternY += (mouseY - lanternY) * speed;
        
        lantern.style.left = `${lanternX}px`;
        lantern.style.top = `${lanternY}px`;
        
        requestAnimationFrame(animateLantern);
    }
    animateLantern();
    
    // Add glow intensity based on movement speed
    let lastX = 0, lastY = 0;
    let speedMagnitude = 0;
    
    document.addEventListener('mousemove', (e) => {
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        speedMagnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        lastX = e.clientX;
        lastY = e.clientY;
        
        const glow = lantern.querySelector('.lantern-glow');
        const baseSize = 80;
        const extraSize = Math.min(speedMagnitude * 2, 40);
        glow.style.width = `${baseSize + extraSize}px`;
        glow.style.height = `${baseSize + extraSize}px`;
    });
    
    // Hide lantern when mouse leaves window
    document.addEventListener('mouseleave', () => {
        lantern.style.opacity = '0';
        lantern.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    
    document.addEventListener('mouseenter', () => {
        lantern.style.opacity = '1';
        lantern.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Interactive hover effects on clickable elements
    const clickables = document.querySelectorAll('a, button, .product-card, .category-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            lantern.style.transform = 'translate(-50%, -50%) scale(1.3)';
            lantern.style.filter = 'brightness(1.2)';
        });
        el.addEventListener('mouseleave', () => {
            lantern.style.transform = 'translate(-50%, -50%) scale(1)';
            lantern.style.filter = 'brightness(1)';
        });
    });
}

/* =====================================================
   INCENSE SMOKE PARTICLES - Floating smoke effect
   ===================================================== */
function initIncenseSmoke() {
    const canvas = document.getElementById('incenseCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class for smoke
    class SmokeParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Start from random positions at bottom
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 30 + 10;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = -Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.life = 1;
            this.decay = Math.random() * 0.003 + 0.001;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        }
        
        update() {
            this.x += this.speedX + Math.sin(this.wobble) * 0.3;
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;
            this.life -= this.decay;
            this.opacity = this.life * 0.3;
            
            // Reset if out of bounds or dead
            if (this.life <= 0 || this.y < -50 || this.x < -50 || this.x > canvas.width + 50) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            // Create gradient for soft smoke effect
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, `rgba(200, 180, 140, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(180, 160, 120, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(160, 140, 100, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
    
    // Create particle pool
    const particles = [];
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new SmokeParticle());
        // Random initial positions
        particles[i].y = Math.random() * canvas.height;
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}

/* =====================================================
   MAGIC LAMP INTERACTION - Rub to reveal
   ===================================================== */
function initMagicLampInteraction() {
    const lampCards = document.querySelectorAll('.magic-lamp-card');
    const modal = document.getElementById('lampModal');
    const modalClose = modal?.querySelector('.modal-close');
    const modalBackdrop = modal?.querySelector('.modal-backdrop');
    const claimWishBtn = modal?.querySelector('.claim-wish');
    
    // Magical items that can appear
    const magicalItems = [
        { icon: 'ph-gem', color: '#d4af37', name: 'Golden Scarab' },
        { icon: 'ph-coins', color: '#f4e5b2', name: 'Pouch of Dinars' },
        { icon: 'ph-flask', color: '#9b59b6', name: 'Potion of Invisibility' },
        { icon: 'ph-scroll', color: '#e6d3a7', name: 'Map to Lost Oasis' },
        { icon: 'ph-crown', color: '#f39c12', name: 'Crown of the Desert King' },
        { icon: 'ph-magic-wand', color: '#2ecc71', name: 'Wand of Wishes' },
        { icon: 'ph-star', color: '#e74c3c', name: 'Falling Star Fragment' },
        { icon: 'ph-moon', color: '#3498db', name: 'Moonstone Amulet' }
    ];
    
    let isRubbing = false;
    let rubProgress = 0;
    let rubStartTime = 0;
    const rubDuration = 2000; // 2 seconds of rubbing
    let currentLampCard = null;
    
    lampCards.forEach(card => {
        const rubArea = card.querySelector('.lamp-rub-area');
        const lampShine = card.querySelector('.lamp-shine');
        const rubHint = card.querySelector('.rub-hint');
        let rubStartX = 0, rubStartY = 0;
        
        // Mouse/Touch events for rubbing
        const startRub = (e) => {
            e.preventDefault();
            isRubbing = true;
            currentLampCard = card;
            rubStartTime = Date.now();
            card.classList.add('rubbing');
            
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            rubStartX = clientX;
            rubStartY = clientY;
            
            // Hide hint when rubbing starts
            if (rubHint) {
                rubHint.style.opacity = '0';
            }
        };
        
        const moveRub = (e) => {
            if (!isRubbing || currentLampCard !== card) return;
            e.preventDefault();
            
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            // Check if still within reasonable area
            const deltaX = Math.abs(clientX - rubStartX);
            const deltaY = Math.abs(clientY - rubStartY);
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Update shine position to follow finger/mouse
            const rect = card.getBoundingClientRect();
            const shineX = clientX - rect.left;
            const shineY = clientY - rect.top;
            
            lampShine.style.left = `${shineX}px`;
            lampShine.style.top = `${shineY}px`;
            
            // Check if rub is complete
            if (distance > 100 && Date.now() - rubStartTime > rubDuration) {
                completeRub(card);
            }
        };
        
        const endRub = (e) => {
            if (!isRubbing || currentLampCard !== card) return;
            isRubbing = false;
            currentLampCard = null;
            
            // Reset if not completed
            if (!card.classList.contains('rubbed')) {
                setTimeout(() => {
                    card.classList.remove('rubbing');
                    if (rubHint) {
                        rubHint.style.opacity = '';
                    }
                }, 500);
            }
        };
        
        // Add event listeners
        rubArea.addEventListener('mousedown', startRub);
        rubArea.addEventListener('touchstart', startRub);
        
        document.addEventListener('mousemove', moveRub);
        document.addEventListener('touchmove', moveRub);
        
        document.addEventListener('mouseup', endRub);
        document.addEventListener('touchend', endRub);
    });
    
    function completeRub(card) {
        card.classList.remove('rubbing');
        card.classList.add('rubbed');
        
        // Get random magical item
        const randomItem = magicalItems[Math.floor(Math.random() * magicalItems.length)];
        
        // Update modal content
        const wishItem = modal.querySelector('.wish-item');
        if (wishItem) {
            wishItem.innerHTML = `<i class="ph-fill ${randomItem.icon}" style="color: ${randomItem.color}; font-size: 60px; filter: drop-shadow(0 0 15px ${randomItem.color});"></i>`;
        }
        
        const genieMessage = modal.querySelector('.genie-message p');
        if (genieMessage) {
            genieMessage.innerHTML = `The djinn has granted you a gift!<br><strong>${randomItem.name}</strong> has appeared from the lamp!`;
        }
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
            
            // Play sound effect (if we had audio)
            // playSound('magic-chime');
        }, 300);
        
        // Create celebration particles
        createCelebrationParticles(card);
    }
    
    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
    };
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    
    // Claim wish button
    if (claimWishBtn) {
        claimWishBtn.addEventListener('click', () => {
            closeModal();
            
            // Add to cart animation
            const cartButtons = document.querySelectorAll('.btn-add-cart');
            cartButtons.forEach(btn => {
                btn.style.transform = 'scale(1.2)';
                btn.style.background = 'var(--color-gold)';
                btn.style.color = 'var(--color-midnight)';
                
                setTimeout(() => {
                    btn.style.transform = '';
                    btn.style.background = '';
                    btn.style.color = '';
                }, 300);
            });
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Celebration particles
    function createCelebrationParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.background = ['#d4af37', '#f39c12', '#9b59b6', '#2ecc71'][Math.floor(Math.random() * 4)];
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 100 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let opacity = 1;
            const animate = () => {
                const currentLeft = parseFloat(particle.style.left);
                const currentTop = parseFloat(particle.style.top);
                
                particle.style.left = `${currentLeft + vx * 0.016}px`;
                particle.style.top = `${currentTop + vy * 0.016}px`;
                particle.style.opacity = opacity;
                
                opacity -= 0.02;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
}

/* =====================================================
   SCROLL ANIMATIONS - Reveal elements on scroll
   ===================================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('in-view');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all animate-on-scroll elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add animation classes to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (!section.classList.contains('hero')) {
            section.classList.add('animate-on-scroll');
            observer.observe(section);
        }
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .animate-on-scroll.in-view {
            opacity: 1;
            transform: translateY(0);
        }
        .stagger-child {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .stagger-child.in-view {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
   NAVIGATION - Active state & smooth scroll
   ===================================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');
    
    // Smooth scroll on click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.arch-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active link on scroll
    const updateActiveLink = () => {
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
    
    // Add scrolled state to navigation
    const archNav = document.querySelector('.arch-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            archNav.style.background = 'rgba(10, 10, 15, 0.98)';
            archNav.style.backdropFilter = 'blur(15px)';
        } else {
            archNav.style.background = '';
            archNav.style.backdropFilter = '';
        }
    });
}

/* =====================================================
   MODAL - General modal functionality
   ===================================================== */
function initModal() {
    const modals = document.querySelectorAll('[class*="modal"]');
    
    modals.forEach(modal => {
        // Close on escape
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
            }
        };
        document.addEventListener('keydown', closeHandler);
    });
}

/* =====================================================
   CART BUTTONS - Add to cart interactions
   ===================================================== */
function initCartButtons() {
    const cartButtons = document.querySelectorAll('.btn-add-cart');
    
    cartButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Get product info
            const card = this.closest('.product-card');
            const title = card.querySelector('.product-title').textContent;
            const price = card.querySelector('.price-value').textContent;
            
            // Animation
            this.innerHTML = '<i class="ph ph-check"></i>';
            this.style.background = 'var(--color-emerald)';
            this.style.borderColor = 'var(--color-emerald)';
            this.style.color = 'white';
            
            // Show notification
            showNotification(`${title} added to cart!`);
            
            // Reset after delay
            setTimeout(() => {
                this.innerHTML = '<i class="ph ph-shopping-cart"></i>';
                this.style.background = '';
                this.style.borderColor = '';
                this.style.color = '';
            }, 2000);
            
            // Update cart count (if we had a cart counter)
            updateCartCount();
        });
    });
    
    function showNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="ph-fill ph-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, var(--color-emerald), var(--color-teal));
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
            z-index: 10000;
            font-family: var(--font-display);
            animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 2.5s forwards;
        `;
        
        document.body.appendChild(notification);
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; transform: translateY(10px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    function updateCartCount() {
        const cartCountEl = document.querySelector('.cart-count');
        if (cartCountEl) {
            const current = parseInt(cartCountEl.textContent) || 0;
            cartCountEl.textContent = current + 1;
            cartCountEl.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCountEl.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

/* =====================================================
   CATEGORY CARDS - Interactive hover effects
   ===================================================== */
function initCategoryCards() {
    const cards = document.querySelectorAll('.category-card');
    
    cards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            // Create ripple
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Add animation keyframe if not exists
            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to { transform: scale(2); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        });
        
        // 3D tilt effect on hover
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/* =====================================================
   PARALLAX EFFECTS - Subtle depth on scroll
   ===================================================== */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-carpet, .floating-lamp, .hero-ornament');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Add subtle parallax to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            
            hero.style.backgroundPosition = `${x}px ${y}px`;
        });
    }
}

/* =====================================================
   TALE CARDS - Interactive story cards
   ===================================================== */
document.querySelectorAll('.tale-card').forEach(card => {
    card.addEventListener('click', function() {
        // Simulate opening a story
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
            // In a real app, this would navigate to the story
            showNotification('Story opening... (Demo)');
        }, 200);
    });
});

/* =====================================================
   MERCHANT CARDS - Hover effects
   ===================================================== */
document.querySelectorAll('.merchant-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Slight glow effect
        this.style.boxShadow = '0 10px 40px rgba(212, 175, 55, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

/* =====================================================
   SMOOTH SCROLL POLYFILL - For older browsers
   ===================================================== */
if (!('scrollBehavior' in document.documentElement.style)) {
    // Simple smooth scroll polyfill
    const smoothScroll = (target, duration = 500) => {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    };
    
    // Override smooth scroll behavior
    window.smoothScrollTo = smoothScroll;
}

/* =====================================================
   PRELOADER (Optional) - Show loading state
   ===================================================== */
window.addEventListener('load', () => {
    // Hide any preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }
    
    // Trigger initial animations
    document.body.classList.add('loaded');
    
    // Initialize any lazy-loaded content
    initLazyLoad();
});

/* =====================================================
   LAZY LOADING - For images and content
   ===================================================== */
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/* =====================================================
   ACCESSIBILITY ENHANCEMENTS
   ===================================================== */
// Skip to content link functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Announce dynamic content changes to screen readers
function announce(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

/* =====================================================
   PERFORMANCE OPTIMIZATION
   ===================================================== */
// Debounce function for resize events
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll handlers
const throttledScroll = throttle(() => {
    // Any additional scroll logic can go here
}, 100);

window.addEventListener('scroll', throttledScroll);

/* =====================================================
   EASTER EGG - Konami code for special effect
   ===================================================== */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Create a shower of gold coins
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.innerHTML = '<i class="ph-fill ph-coin"></i>';
            coin.style.cssText = `
                position: fixed;
                top: -50px;
                left: ${Math.random() * 100}vw;
                font-size: ${20 + Math.random() * 20}px;
                color: #d4af37;
                pointer-events: none;
                z-index: 99999;
                animation: coinFall ${3 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(coin);
            
            setTimeout(() => coin.remove(), 5000);
        }, i * 50);
    }
    
    // Add coin fall animation
    if (!document.querySelector('#easter-egg-styles')) {
        const style = document.createElement('style');
        style.id = 'easter-egg-styles';
        style.textContent = `
            @keyframes coinFall {
                to {
                    top: 100vh;
                    transform: rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    announce('You discovered a hidden treasure! 🏆');
}

/* =====================================================
   INITIALIZATION COMPLETE
   ===================================================== */
console.log('🕌 Al-Miraj Bazaar initialized successfully! ✨');
console.log('🔮 Try the Konami code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA');