/* ============================================
   THE GATSBY GAZETTE - Art Deco Magazine
   JavaScript: Immersive Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initChampagneBubbles();
    initParallax();
    initNavigation();
    initScrollAnimations();
    initMastheadAnimation();
    initGoldLeafGlow();
    initImageReveal();
    initInteractiveAds();
});

/* ============================================
   CHAMPAGNE BUBBLE CANVAS EFFECT
   Elegant floating bubbles with fizzy physics
   ============================================ */
function initChampagneBubbles() {
    const canvas = document.getElementById('champagne-bubbles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let bubbles = [];
    const bubbleCount = 40;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Bubble class with fizzy physics
    class Bubble {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // Start at random positions
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 4 + 2;
            this.speed = Math.random() * 1.5 + 0.5;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.02;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.y -= this.speed;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.5;
            
            if (this.y < -50) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            // Create gradient for bubble depth
            const gradient = ctx.createRadialGradient(
                this.x - this.size/3, 
                this.y - this.size/3, 
                0,
                this.x, 
                this.y, 
                this.size
            );
            gradient.addColorStop(0, `rgba(244, 229, 195, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(212, 175, 55, ${this.opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(184, 134, 11, ${this.opacity * 0.3})`);
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Add subtle highlight
            ctx.beginPath();
            ctx.arc(this.x - this.size/3, this.y - this.size/3, this.size/4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.4})`;
            ctx.fill();
        }
    }
    
    // Initialize bubbles
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new Bubble());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        bubbles.forEach(bubble => {
            bubble.update();
            bubble.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ============================================
   PARALLAX SCROLLING EFFECTS
   Smooth parallax for hero and feature sections
   ============================================ */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-speed]');
    if (parallaxElements.length === 0) return;
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const rect = element.parentElement.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const offset = (scrollY - elementTop) * speed;
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                element.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
        });
    }
    
    // Throttled scroll handler for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateParallax();
}

/* ============================================
   NAVIGATION & SMOOTH SCROLLING
   Art Deco navigation with active states
   ============================================ */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Update active nav on scroll
    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

/* ============================================
   SCROLL-TRIGGERED ANIMATIONS
   Intersection Observer for reveal effects
   ============================================ */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.article-section, .society-article, .feature-article, ' +
        '.sidebar-widget, .gallery-item, .advertisement, ' +
        '.full-width-feature, .section-header'
    );
    
    // Staggered animation for child elements
    function animateWithStagger(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }
    
    // Intersection Observer setup
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay based on position in viewport
                const staggerDelay = Math.min(index * 100, 500);
                animateWithStagger(entry.target, staggerDelay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Special handling for gallery items with grid layout
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const row = Math.floor(index / 4); // 4 columns
                const col = index % 4;
                const delay = (row * 150) + (col * 100);
                animateWithStagger(entry.target, delay);
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    galleryItems.forEach(item => galleryObserver.observe(item));
}

/* ============================================
   MASTHEAD ANIMATION
   Subtle breathing glow on title
   ============================================ */
function initMastheadAnimation() {
    const title = document.querySelector('.magazine-title');
    if (!title) return;
    
    // Add random glitch effect occasionally
    setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance every interval
            title.classList.add('glitch');
            setTimeout(() => {
                title.classList.remove('glitch');
            }, 150);
        }
    }, 3000);
    
    // Add glitch CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .magazine-title.glitch {
            animation: glitch 0.3s ease;
        }
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   GOLD LEAF GLOW EFFECT
   Subtle pulsing glow on decorative corners
   ============================================ */
function initGoldLeafGlow() {
    const goldLeaves = document.querySelectorAll('.gold-leaf-decor');
    if (goldLeaves.length === 0) return;
    
    let hue = 40; // Gold hue
    let direction = 1;
    
    function animateGlow() {
        hue += direction * 0.5;
        if (hue >= 50 || hue <= 30) direction *= -1;
        
        const lightness = 50 + Math.sin(Date.now() * 0.001) * 10;
        const color = `hsla(${hue}, 80%, ${lightness}%, 0.15)`;
        
        goldLeaves.forEach(leaf => {
            leaf.style.background = `radial-gradient(ellipse at center, 
                ${color} 0%, 
                hsla(${hue}, 70%, ${lightness - 10}%, 0.1) 50%, 
                transparent 100%)`;
        });
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
}

/* ============================================
   IMAGE REVEAL EFFECT
   Art Deco frame reveal on hover/scroll
   ============================================ */
function initImageReveal() {
    const images = document.querySelectorAll('.article-image, .gallery-image');
    
    images.forEach(img => {
        // Add loading state
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
            });
        }
        
        // Add scanline effect on hover
        img.addEventListener('mouseenter', function() {
            this.style.filter = 'sepia(0%) contrast(100%) brightness(1.1)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.filter = 'sepia(20%) contrast(105%)';
        });
    });
    
    // Intersection Observer for lazy loading and reveal
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                imageObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ============================================
   INTERACTIVE ADVERTISEMENTS
   Vintage poster hover effects and interactions
   ============================================ */
function initInteractiveAds() {
    const ads = document.querySelectorAll('.advertisement.vintage-poster');
    
    ads.forEach(ad => {
        // Add tilt effect on mouse move
        ad.addEventListener('mousemove', (e) => {
            const rect = ad.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            ad.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        ad.addEventListener('mouseleave', () => {
            ad.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
        
        // Add click tracking (demo)
        ad.addEventListener('click', () => {
            console.log('Advertisement clicked');
            // In production, this would track the ad click
        });
    });
    
    // Special effect for price displays
    const prices = document.querySelectorAll('.ad-price');
    prices.forEach(price => {
        // Animate price counting up
        const text = price.textContent;
        const match = text.match(/(\d+\.?\d*)/);
        if (match) {
            const targetValue = parseFloat(match[1]);
            const prefix = text.substring(0, match.index);
            const suffix = text.substring(match.index + match[0].length);
            
            let currentValue = 0;
            const increment = targetValue / 30;
            const interval = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(interval);
                }
                price.textContent = prefix + currentValue.toFixed(1) + suffix;
            }, 30);
        }
    });
}

/* ============================================
   TEXT REVEAL ANIMATION
   Character-by-character reveal for headlines
   ============================================ */
function initTextReveal() {
    const headlines = document.querySelectorAll('.feature-headline, .hero-title');
    
    headlines.forEach(headline => {
        const text = headline.textContent;
        headline.textContent = '';
        headline.style.opacity = '1';
        
        // Wrap each character in a span
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.animation = `fadeInChar 0.1s ease forwards ${index * 0.03}s`;
            headline.appendChild(span);
        });
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInChar {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    });
}

// Initialize text reveal after a short delay
setTimeout(initTextReveal, 1000);

/* ============================================
   SCROLL PROGRESS INDICATOR
   Subtle progress bar at the top
   ============================================ */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, #d4af37, #f4e5c3);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

// Initialize scroll progress
initScrollProgress();

/* ============================================
   VINTAGE CURSOR EFFECT (Optional)
   Custom cursor that follows mouse with delay
   ============================================ */
function initVintageCursor() {
    // Only on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'vintage-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #d4af37;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transition: transform 0.1s ease, opacity 0.3s ease;
            mix-blend-mode: difference;
            opacity: 0;
        `;
        document.body.appendChild(cursor);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        // Smooth cursor following
        function animateCursor() {
            const ease = 0.15;
            cursorX += (mouseX - cursorX) * ease;
            cursorY += (mouseY - cursorY) * ease;
            
            cursor.style.left = `${cursorX - 10}px`;
            cursor.style.top = `${cursorY - 10}px`;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Scale up on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .cta-button, .nav-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.borderColor = '#f4e5c3';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '#d4af37';
            });
        });
    }
}

// Optional: Uncomment to enable vintage cursor
// initVintageCursor();

/* ============================================
   KEYBOARD NAVIGATION
   Accessible navigation with arrow keys
   ============================================ */
function initKeyboardNav() {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    let currentIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, sections.length - 1);
            scrollToSection(sections[currentIndex]);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
            scrollToSection(sections[currentIndex]);
        } else if (e.key === 'Home') {
            e.preventDefault();
            currentIndex = 0;
            scrollToSection(sections[0]);
        } else if (e.key === 'End') {
            e.preventDefault();
            currentIndex = sections.length - 1;
            scrollToSection(sections[sections.length - 1]);
        }
    });
    
    function scrollToSection(section) {
        const headerOffset = 100;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Update nav
        const sectionId = section.getAttribute('id');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    }
}

initKeyboardNav();

/* ============================================
   PERFORMANCE OPTIMIZATION
   Pause animations when tab is not visible
   ============================================ */
document.addEventListener('visibilitychange', () => {
    const animatedElements = document.querySelectorAll('.sunburst, .hero-sunburst, .footer-sunburst');
    
    if (document.hidden) {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

/* ============================================
   EASTER EGG: CONSOLE MESSAGE
   For fellow developers who inspect the code
   ============================================ */
console.log(`
%c THE GATSBY GAZETTE %c Art Deco Magazine 1925
    
    "So we beat on, boats against the current,
     borne back ceaselessly into the past."
     
    — F. Scott Fitzgerald, The Great Gatsby

    Built with extraordinary attention to detail.
    Tip: Try pressing arrow keys to navigate!
`, 
'color: #d4af37; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);',
'color: #f5f0e1; font-size: 14px; font-style: italic;'
);