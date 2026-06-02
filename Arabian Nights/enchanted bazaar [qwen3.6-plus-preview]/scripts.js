/**
 * SOUK AL-JINN — Enchanted Bazaar
 * JavaScript: Interactions, Animations & Magic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // LANTERN GLOW CURSOR EFFECT
    // ==========================================
    const lanternGlow = document.getElementById('lantern-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let animationFrameId;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateLanternGlow() {
        // Smooth lerp for organic movement
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        lanternGlow.style.left = `${glowX}px`;
        lanternGlow.style.top = `${glowY}px`;
        
        animationFrameId = requestAnimationFrame(updateLanternGlow);
    }
    updateLanternGlow();

    // Hide lantern glow on mobile
    if ('ontouchstart' in window) {
        lanternGlow.style.display = 'none';
        cancelAnimationFrame(animationFrameId);
    }

    // ==========================================
    // SCROLL-TRIGGERED REVEAL ANIMATIONS
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed-animate');
                // Optionally stop observing after reveal
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe product cards with staggered delays
    const productSections = document.querySelectorAll('.product-section');
    productSections.forEach(section => {
        const cards = section.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = `opacity 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.15}s, transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.15}s`;
            revealObserver.observe(card);
        });
    });

    // Observe merchant cards
    const merchantCards = document.querySelectorAll('.merchant-card');
    merchantCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        revealObserver.observe(card);
    });

    // Add CSS class for revealed elements
    const style = document.createElement('style');
    style.textContent = `
        .revealed-animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // RUB THE LAMP INTERACTION
    // ==========================================
    const rubLamps = document.querySelectorAll('.rub-lamp');
    
    rubLamps.forEach(lamp => {
        let rubCount = 0;
        let rubInterval;
        let isRubbing = false;

        function handleRubStart(e) {
            e.preventDefault();
            isRubbing = true;
            rubCount = 0;
            
            // Add rub animation class
            lamp.closest('.card-lamp-container').classList.add('rubbing');
            
            // Count rubs rapidly
            rubInterval = setInterval(() => {
                if (isRubbing) {
                    rubCount++;
                    if (rubCount >= 8) {
                        revealPrice(lamp);
                        clearInterval(rubInterval);
                        isRubbing = false;
                    }
                }
            }, 100);
        }

        function handleRubEnd() {
            isRubbing = false;
            clearInterval(rubInterval);
            
            setTimeout(() => {
                if (rubCount < 8) {
                    lamp.closest('.card-lamp-container').classList.remove('rubbing');
                }
            }, 300);
        }

        // Mouse events
        lamp.addEventListener('mousedown', handleRubStart);
        lamp.addEventListener('mouseup', handleRubEnd);
        lamp.addEventListener('mouseleave', handleRubEnd);

        // Touch events
        lamp.addEventListener('touchstart', handleRubStart, { passive: false });
        lamp.addEventListener('touchend', handleRubEnd);
        lamp.addEventListener('touchcancel', handleRubEnd);

        function revealPrice(lampElement) {
            const card = lampElement.closest('.product-card');
            const container = lampElement.closest('.card-lamp-container');
            
            // Add glow effect
            container.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
            
            // Reveal after a brief delay for dramatic effect
            setTimeout(() => {
                card.classList.add('revealed');
                container.style.boxShadow = 'none';
                
                // Add sparkle particles
                createSparkles(container);
            }, 300);
        }

        function createSparkles(container) {
            const rect = container.getBoundingClientRect();
            for (let i = 0; i < 12; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-particle';
                sparkle.textContent = '✦';
                sparkle.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top + rect.height / 2}px;
                    color: #d4af37;
                    font-size: ${Math.random() * 15 + 10}px;
                    pointer-events: none;
                    z-index: 999;
                    transition: all 1s ease-out;
                    opacity: 1;
                `;
                document.body.appendChild(sparkle);
                
                // Animate outward
                requestAnimationFrame(() => {
                    const angle = (Math.PI * 2 * i) / 12;
                    const distance = 50 + Math.random() * 80;
                    sparkle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.5)`;
                    sparkle.style.opacity = '0';
                });
                
                // Cleanup
                setTimeout(() => sparkle.remove(), 1000);
            }
        }
    });

    // Add rubbing animation style
    const rubStyle = document.createElement('style');
    rubStyle.textContent = `
        .card-lamp-container.rubbing .lamp-icon {
            animation: rub-shake 0.1s infinite;
        }
        .card-lamp-container.rubbing .rub-instruction {
            color: #f4d03f !important;
        }
        @keyframes rub-shake {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-2px) rotate(-3deg); }
            75% { transform: translateX(2px) rotate(3deg); }
        }
        .product-card.revealed .card-lamp-container {
            display: none;
        }
        .sparkle-particle {
            text-shadow: 0 0 10px #d4af37;
        }
    `;
    document.head.appendChild(rubStyle);

    // ==========================================
    // MODAL SYSTEM
    // ==========================================
    const inquiryModal = document.getElementById('inquiry-modal');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const successClose = document.getElementById('success-close');
    const inquiryForm = document.getElementById('inquiry-form');
    const inquireButtons = document.querySelectorAll('.btn-inquire');
    const merchantNameInput = document.getElementById('merchant-name');

    function openModal(modal, merchantName = '') {
        if (merchantName && merchantNameInput) {
            merchantNameInput.value = merchantName;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open inquiry modal
    inquireButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const title = card.querySelector('.card-title')?.textContent || 'Unknown Item';
            openModal(inquiryModal, `Merchant selling: ${title}`);
        });
    });

    // Close modal buttons
    modalClose.addEventListener('click', () => closeModal(inquiryModal));
    successClose.addEventListener('click', () => closeModal(successModal));

    // Close on overlay click
    [inquiryModal, successModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(inquiryModal);
            closeModal(successModal);
        }
    });

    // Form submission
    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate sending
        const submitBtn = inquiryForm.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'Sending via carrier pigeon... 🕊️';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
            
            // Close inquiry modal, open success modal
            closeModal(inquiryModal);
            setTimeout(() => openModal(successModal), 300);
            
            // Reset form
            inquiryForm.reset();
        }, 1500);
    });

    // ==========================================
    // HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 9, 16, 0.95)';
            header.style.padding = '10px 0';
        } else {
            header.style.background = 'linear-gradient(180deg, rgba(10, 9, 16, 0.95) 0%, rgba(10, 9, 16, 0.85) 100%)';
            header.style.padding = '20px 0';
        }
        
        lastScroll = currentScroll;
    }

    // Throttle scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
        scrollTimeout = requestAnimationFrame(handleHeaderScroll);
    });

    // ==========================================
    // DYNAMIC INCENSE SMOKE PARTICLES
    // ==========================================
    function createSmokeParticles() {
        const container = document.getElementById('incense-smoke');
        
        // Only create particles if we're on desktop
        if (window.innerWidth < 768) return;
        
        const particleCount = 15;
        
        function createParticle() {
            const particle = document.createElement('div');
            const size = Math.random() * 100 + 50;
            const startX = Math.random() * window.innerWidth;
            const duration = Math.random() * 10 + 15;
            
            particle.className = 'smoke-particle';
            particle.style.cssText = `
                position: absolute;
                bottom: 0;
                left: ${startX}px;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(150, 130, 110, 0.08) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                animation: smoke-rise-particle ${duration}s linear forwards;
                filter: blur(${size / 3}px);
            `;
            
            container.appendChild(particle);
            
            // Cleanup
            setTimeout(() => particle.remove(), duration * 1000);
        }
        
        // Initial particles
        for (let i = 0; i < particleCount; i++) {
            setTimeout(createParticle, i * 800);
        }
        
        // Continuous creation
        setInterval(createParticle, 2000);
    }

    // Add smoke particle animation
    const smokeStyle = document.createElement('style');
    smokeStyle.textContent = `
        @keyframes smoke-rise-particle {
            0% {
                transform: translateY(0) translateX(0) scale(0.5);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            50% {
                transform: translateY(-50vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}px) scale(1.2);
                opacity: 0.3;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 200}px) scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(smokeStyle);
    
    createSmokeParticles();

    // ==========================================
    // ANNOUNCEMENT TICKER PAUSE ON HOVER
    // ==========================================
    const scrollContent = document.querySelector('.scroll-content');
    
    if (scrollContent) {
        scrollContent.addEventListener('mouseenter', () => {
            scrollContent.style.animationPlayState = 'paused';
        });
        scrollContent.addEventListener('mouseleave', () => {
            scrollContent.style.animationPlayState = 'running';
        });
        scrollContent.addEventListener('touchstart', () => {
            scrollContent.style.animationPlayState = 'paused';
        }, { passive: true });
        scrollContent.addEventListener('touchend', () => {
            scrollContent.style.animationPlayState = 'running';
        });
    }

    // ==========================================
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.product-section');

    function updateActiveNav() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Add active state styling
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-link.active {
            color: var(--gold-light) !important;
            border-color: var(--gold-primary) !important;
            background: rgba(212, 175, 55, 0.15) !important;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }
    `;
    document.head.appendChild(navStyle);

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveNav);
    });

    // ==========================================
    // HERO SECTION ENTRANCE ANIMATION
    // ==========================================
    const heroElements = document.querySelectorAll('.hero-greeting, .hero-headline, .hero-description, .btn-enter');
    
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.2 + 0.5}s, transform 0.8s ease ${index * 0.2 + 0.5}s`;
    });

    // Trigger after a brief delay
    setTimeout(() => {
        heroElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100);

    // ==========================================
    // PARALLAX EFFECT ON HERO
    // ==========================================
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            const heroRect = hero.getBoundingClientRect();
            
            if (heroRect.bottom > 0) {
                const heroPattern = document.querySelector('.hero-pattern');
                heroPattern.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
    });

    // ==========================================
    // BUTTON RIPPLE EFFECT
    // ==========================================
    const allButtons = document.querySelectorAll('.btn-enter, .btn-inquire, .btn-submit');
    
    allButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-effect 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ==========================================
    // ACCESSIBILITY: REDUCE MOTION
    // ==========================================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable animations for users who prefer reduced motion
        document.querySelectorAll('*').forEach(el => {
            el.style.animationDuration = '0.01ms';
            el.style.transitionDuration = '0.01ms';
        });
    }

    console.log('%c✦ Welcome to Souk al-Jinn ✦', 'color: #d4af37; font-size: 16px; font-weight: bold;');
    console.log('%cWhere dreams come true — for a price.', 'color: #a89f91; font-style: italic;');
});