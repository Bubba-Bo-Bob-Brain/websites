// ============================================
// SOUK AL-AHRAR — THE ENCHANTED BAZAAR
// JavaScript: Interactivity, animations, and magic
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // LANTERN GLOW CURSOR FOLLOW
    // ============================================
    const lanternGlow = document.getElementById('lanternGlow');
    let glowX = 0, glowY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', function(e) {
        glowX = e.clientX;
        glowY = e.clientY;
    });
    
    function updateGlow() {
        currentX += (glowX - currentX) * 0.08;
        currentY += (glowY - currentY) * 0.08;
        lanternGlow.style.left = currentX + 'px';
        lanternGlow.style.top = currentY + 'px';
        requestAnimationFrame(updateGlow);
    }
    updateGlow();
    
    // ============================================
    // INCENSE SMOKE PARTICLE SYSTEM
    // ============================================
    const smokeContainer = document.getElementById('smokeContainer');
    const smokeColors = [
        'rgba(200, 180, 140, 0.12)',
        'rgba(184, 115, 51, 0.08)',
        'rgba(212, 160, 23, 0.06)',
        'rgba(240, 192, 64, 0.04)'
    ];
    
    function createSmokeParticle() {
        const particle = document.createElement('div');
        particle.className = 'smoke-particle';
        
        const size = Math.random() * 60 + 20;
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 50;
        const drift = (Math.random() - 0.5) * 200;
        const duration = Math.random() * 8 + 6;
        const color = smokeColors[Math.floor(Math.random() * smokeColors.length)];
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
        particle.style.setProperty('--drift', drift + 'px');
        particle.style.animationDuration = duration + 's';
        
        smokeContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }
    
    // Spawn smoke particles periodically
    setInterval(createSmokeParticle, 800);
    
    // Initial burst of particles
    for (let i = 0; i < 5; i++) {
        setTimeout(createSmokeParticle, i * 200);
    }
    
    // ============================================
    // MAGIC LAMP "RUB TO REVEAL" INTERACTION
    // ============================================
    const revealButtons = document.querySelectorAll('.reveal-button');
    
    revealButtons.forEach(button => {
        button.addEventListener('click', function() {
            const revealId = this.getAttribute('data-reveal');
            const revealElement = document.getElementById('reveal-' + revealId);
            
            if (revealElement && !revealElement.classList.contains('revealed')) {
                // Button animation
                this.textContent = '✦ Revealed ✦';
                this.classList.add('revealed');
                
                // Create sparkles around the button
                createSparkles(this);
                
                // Reveal the hidden text with delay
                setTimeout(() => {
                    revealElement.classList.add('revealed');
                    
                    // Add glow effect to card
                    const card = this.closest('.product-card');
                    card.style.transition = 'box-shadow 0.6s ease';
                    card.style.boxShadow = '0 0 40px rgba(20, 160, 133, 0.2), 0 10px 40px rgba(0, 0, 0, 0.5)';
                }, 300);
            }
        });
        
        // Hover rub effect
        let rubCount = 0;
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('revealed')) {
                this.style.transform = 'scale(1.08)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('revealed')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
    
    function createSparkles(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.left = (rect.left + rect.width / 2) + 'px';
            sparkle.style.top = (rect.top + rect.height / 2) + 'px';
            sparkle.style.width = '6px';
            sparkle.style.height = '6px';
            sparkle.style.background = 'var(--amber-bright)';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.boxShadow = '0 0 10px var(--saffron)';
            
            const angle = (Math.PI * 2 * i) / 8;
            const distance = 50 + Math.random() * 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            sparkle.style.transition = 'all 0.6s cubic-bezier(0.68, -0.3, 0.265, 1.3)';
            document.body.appendChild(sparkle);
            
            requestAnimationFrame(() => {
                sparkle.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                sparkle.style.opacity = '0';
            });
            
            setTimeout(() => sparkle.remove(), 600);
        }
    }
    
    // ============================================
    // MERCHANT STORIES CAROUSEL
    // ============================================
    const storyItems = document.querySelectorAll('.story-item');
    const storyDots = document.querySelectorAll('.story-dot');
    const prevBtn = document.getElementById('storyPrev');
    const nextBtn = document.getElementById('storyNext');
    let currentStory = 0;
    let storyInterval;
    
    function showStory(index) {
        storyItems.forEach((item, i) => {
            item.classList.remove('active');
            storyDots[i].classList.remove('active');
        });
        
        storyItems[index].classList.add('active');
        storyDots[index].classList.add('active');
        currentStory = index;
    }
    
    function nextStory() {
        showStory((currentStory + 1) % storyItems.length);
    }
    
    function prevStory() {
        showStory((currentStory - 1 + storyItems.length) % storyItems.length);
    }
    
    nextBtn.addEventListener('click', () => {
        nextStory();
        resetAutoAdvance();
    });
    
    prevBtn.addEventListener('click', () => {
        prevStory();
        resetAutoAdvance();
    });
    
    storyDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showStory(index);
            resetAutoAdvance();
        });
    });
    
    function startAutoAdvance() {
        storyInterval = setInterval(nextStory, 6000);
    }
    
    function resetAutoAdvance() {
        clearInterval(storyInterval);
        startAutoAdvance();
    }
    
    startAutoAdvance();
    
    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add reveal class to elements that should animate in
    const sections = document.querySelectorAll('.market-section');
    sections.forEach(section => {
        const cards = section.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.classList.add('reveal-on-scroll');
            card.style.transitionDelay = (index * 0.15) + 's';
            revealObserver.observe(card);
        });
        
        const header = section.querySelector('.section-header');
        if (header) {
            header.classList.add('reveal-on-scroll');
            revealObserver.observe(header);
        }
    });
    
    // Hero elements
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
        el.style.transitionDelay = (index * 0.2) + 's';
        revealObserver.observe(el);
    });
    
    // ============================================
    // NAVIGATION SMOOTH SCROLL & ACTIVE STATE
    // ============================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionsList = document.querySelectorAll('section[id]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.getElementById('bazaarNav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sectionsList.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // ============================================
    // HERO CARPET PARALLAX ON MOUSE MOVE
    // ============================================
    const heroCarpet = document.getElementById('heroCarpet');
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection && heroCarpet) {
        heroSection.addEventListener('mousemove', function(e) {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroCarpet.style.transform = `
                translate(${x * 20}px, ${y * 15}px)
                rotate(${x * 5}deg)
            `;
        });
        
        heroSection.addEventListener('mouseleave', function() {
            heroCarpet.style.transform = '';
        });
    }
    
    // ============================================
    // PRODUCT CARD 3D TILT EFFECT
    // ============================================
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const frame = card.querySelector('.card-frame');
        
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            frame.style.transform = `
                perspective(1000px)
                rotateY(${x * 8}deg)
                rotateX(${-y * 8}deg)
                translateY(-8px)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            frame.style.transform = '';
        });
    });
    
    // ============================================
    // LANTERN FLAME RANDOM FLICKER VARIATION
    // ============================================
    const flames = document.querySelectorAll('.lantern-flame, .card-lantern-flame, .lantern-flame-small');
    
    function flickerFlames() {
        flames.forEach(flame => {
            const randomScale = 0.85 + Math.random() * 0.3;
            const randomOpacity = 0.8 + Math.random() * 0.2;
            flame.style.transform = `translate(-50%, -50%) scaleY(${randomScale}) scaleX(${2 - randomScale})`;
            flame.style.opacity = randomOpacity;
        });
        
        setTimeout(flickerFlames, 100 + Math.random() * 200);
    }
    
    flickerFlames();
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.bazaar-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            header.style.opacity = Math.max(0.3, 1 - (currentScroll - 100) / 300);
        } else {
            header.style.opacity = 1;
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // ZELLIGE PATTERN MOUSE PARALLAX
    // ============================================
    const zelligePattern = document.querySelector('.zellige-pattern');
    
    document.addEventListener('mousemove', function(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        
        zelligePattern.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
    });
    
    // ============================================
    // STORY "LISTEN LONGER" EXPANSION
    // ============================================
    const storyContinues = document.querySelectorAll('.story-continue');
    
    storyContinues.forEach(continueBtn => {
        continueBtn.addEventListener('click', function() {
            const storyText = this.previousElementSibling;
            const fullText = storyText.textContent;
            
            // Simple expansion effect - could be extended with full stories
            this.style.opacity = '0';
            this.style.pointerEvents = 'none';
            
            // Add a subtle glow to indicate more content
            const storyFrame = this.closest('.story-frame');
            storyFrame.style.boxShadow = '0 0 30px rgba(212, 160, 23, 0.15)';
            
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';
                this.textContent = 'The tale continues in the full moonlight...';
                storyFrame.style.boxShadow = '';
            }, 2000);
        });
    });
    
    // ============================================
    // PAGE LOAD ENTRANCE ANIMATION
    // ============================================
    function entranceAnimation() {
        const titleArabic = document.querySelector('.title-arabic');
        const titleEnglish = document.querySelector('.title-english');
        const subtitle = document.querySelector('.bazaar-subtitle');
        const divider = document.querySelector('.header-divider');
        
        const elements = [titleArabic, titleEnglish, subtitle, divider];
        
        elements.forEach((el, index) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }
    
    entranceAnimation();
    
    // ============================================
    // HERO CARPET ENTRANCE
    // ============================================
    function carpetEntrance() {
        if (heroCarpet) {
            heroCarpet.style.opacity = '0';
            heroCarpet.style.transform = 'translateY(100px) rotate(-10deg) scale(0.8)';
            heroCarpet.style.transition = 'all 1.2s cubic-bezier(0.68, -0.3, 0.265, 1.3) 0.6s';
            
            setTimeout(() => {
                heroCarpet.style.opacity = '1';
                heroCarpet.style.transform = '';
            }, 100);
        }
    }
    
    carpetEntrance();
    
    // ============================================
    // LANTERN SWAY ENHANCEMENT
    // ============================================
    const hangingLanterns = document.querySelectorAll('.lantern-hanging');
    
    hangingLanterns.forEach((lantern, index) => {
        const body = lantern.querySelector('.lantern-body');
        const delay = index * 0.5;
        body.style.animationDelay = delay + 's';
    });
    
});