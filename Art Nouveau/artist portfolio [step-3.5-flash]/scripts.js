/* ============================================
   ART NOUVEAU GALLERY - LUMIÈRE ÉTERNELLE
   JavaScript Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCustomCursor();
    initScrollProgress();
    initBackToTop();
    initMobileNav();
    initSmoothScroll();
    initImageLoading();
    initScrollAnimations();
    initParallaxDecorations();
    initContactForm();
    initNoiseOverlay();
    initWhiplashAnimation();
});

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate cursor with smooth following
    function animateCursor() {
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        // Follower follows with more delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .artist-card, input, textarea, select');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = 'var(--gold-light)';
            follower.style.width = '60px';
            follower.style.height = '60px';
            follower.style.borderColor = 'rgba(201, 169, 98, 0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'var(--gold-primary)';
            follower.style.width = '40px';
            follower.style.height = '40px';
            follower.style.borderColor = 'rgba(201, 169, 98, 0.3)';
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
}

/* ============================================
   SCROLL PROGRESS INDICATOR
   ============================================ */
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    
    const toggleVisibility = () => {
        const scrollThreshold = 500;
        const isVisible = window.pageYOffset > scrollThreshold;
        
        if (isVisible) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    toggleVisibility(); // Initial check
}

/* ============================================
   MOBILE NAVIGATION
   ============================================ */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.transition = 'all 0.3s ease';
            
            if (navLinks.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });
    
    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });
}

/* ============================================
   SMOOTH SCROLLING
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   IMAGE LOADING ANIMATIONS
   ============================================ */
function initImageLoading() {
    const images = document.querySelectorAll('.artwork-image, .portrait-img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loaded class when image loads
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.gallery-item, .artist-card, .about-content, .contact-content, .section-header'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

/* ============================================
   PARALLAX DECORATIONS
   ============================================ */
function initParallaxDecorations() {
    const parallaxElements = document.querySelectorAll(
        '.floral-decoration, .iris-decoration, .lily-pattern, .ornamental-divider'
    );
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/* ============================================
   CONTACT FORM HANDLING
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.querySelector('.button-text').textContent;
        
        submitButton.disabled = true;
        submitButton.querySelector('.button-text').textContent = 'Envoi en cours...';
        
        setTimeout(() => {
            showNotification('Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.', 'success');
            form.reset();
            submitButton.disabled = false;
            submitButton.querySelector('.button-text').textContent = originalText;
        }, 2000);
    });
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--gold-primary)' : 'var(--burgundy)'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 1rem;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.5s ease forwards';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   NOISE OVERLAY ANIMATION
   ============================================ */
function initNoiseOverlay() {
    const noiseOverlay = document.querySelector('.noise-overlay');
    if (!noiseOverlay) return;
    
    let time = 0;
    
    function animateNoise() {
        time += 0.01;
        const offset = Math.sin(time) * 10;
        noiseOverlay.style.transform = `translate(${offset}px, ${offset}px)`;
        requestAnimationFrame(animateNoise);
    }
    
    animateNoise();
}

/* ============================================
   WHIPLASH CURVE ANIMATION
   ============================================ */
function initWhiplashAnimation() {
    const navWhiplash = document.querySelector('.nav-whiplash');
    if (!navWhiplash) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const delta = currentScroll - lastScroll;
        
        // Only animate when scrolling
        if (Math.abs(delta) > 5) {
            const opacity = 0.3 + Math.min(Math.abs(delta) / 100, 0.4);
            navWhiplash.style.opacity = opacity;
            
            // Add subtle wave effect
            const wave = Math.sin(currentScroll * 0.01) * 2;
            navWhiplash.style.transform = `translateY(${wave}px)`;
        }
        
        lastScroll = currentScroll;
    });
}

/* ============================================
   GOLD LEAF ACCENT ENHANCEMENT
   ============================================ */
// Add shimmer effect to gold leaf accents on gallery hover
document.querySelectorAll('.gallery-item').forEach(item => {
    const goldAccent = item.querySelector('.gold-leaf-accent');
    if (goldAccent) {
        item.addEventListener('mouseenter', () => {
            goldAccent.style.animation = 'shimmer 2s infinite';
        });
        
        item.addEventListener('mouseleave', () => {
            goldAccent.style.animation = '';
        });
    }
});

// Add shimmer animation
const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = `
    @keyframes shimmer {
        0%, 100% { 
            background: linear-gradient(180deg, 
                transparent 0%, 
                var(--gold-primary) 20%, 
                var(--gold-primary) 80%, 
                transparent 100%);
            filter: blur(2px);
        }
        50% { 
            background: linear-gradient(180deg, 
                transparent 0%, 
                var(--gold-light) 20%, 
                var(--gold-light) 80%, 
                transparent 100%);
            filter: blur(1px);
        }
    }
`;
document.head.appendChild(shimmerStyle);

/* ============================================
   FLORAL DECORATION INTERACTION
   ============================================ */
// Add subtle rotation to floral decorations on hover
document.querySelectorAll('.floral-decoration, .lily-pattern').forEach(decoration => {
    decoration.addEventListener('mouseenter', () => {
        decoration.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        decoration.style.transform = 'scale(1.1) rotate(10deg)';
    });
    
    decoration.addEventListener('mouseleave', () => {
        decoration.style.transform = 'scale(1) rotate(0deg)';
    });
});

/* ============================================
   FRAME BORDER GLEAM EFFECT
   ============================================ */
// Add periodic gleam to frame borders
setInterval(() => {
    const frames = document.querySelectorAll('.artwork-frame');
    const randomFrame = frames[Math.floor(Math.random() * frames.length)];
    
    if (randomFrame) {
        randomFrame.style.boxShadow = '0 0 20px rgba(201, 169, 98, 0.4)';
        setTimeout(() => {
            randomFrame.style.boxShadow = '';
        }, 2000);
    }
}, 3000);

/* ============================================
   LAZY LOADING FOR IMAGES
   ============================================ */
// Enhance image loading with fade effect
document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }
    
    img.addEventListener('error', () => {
        // Fallback for broken images
        img.style.background = 'var(--bg-muted)';
        img.alt = 'Image not available';
    });
});

/* ============================================
   ACTIVE NAV LINK HIGHLIGHTING
   ============================================ */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// Initialize active nav highlighting
initActiveNavHighlight();

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */
// Debounce function for scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for frequent events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================ */
// Handle keyboard navigation for custom cursor
document.addEventListener('keydown', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;
    
    // Hide custom cursor when using keyboard navigation
    if (e.key === 'Tab') {
        cursor.style.opacity = '0';
    }
});

// Show cursor again on mouse move
document.addEventListener('mousemove', () => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.opacity = '1';
    }
});

/* ============================================
   GALLERY ITEM KEYBOARD ACCESS
   ============================================ */
document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View artwork: ${item.querySelector('.artwork-title')?.textContent || 'Artwork'}`);
    
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
});

/* ============================================
   PRELOAD CRITICAL RESOURCES
   ============================================ */
// Preload fonts
const fontPreload = document.createElement('link');
fontPreload.rel = 'preload';
fontPreload.as = 'font';
fontPreload.type = 'font/woff2';
fontPreload.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Abril+Fatface&family=Quicksand:wght@300;400;500&display=swap';
document.head.appendChild(fontPreload);

/* ============================================
   CONSOLE GREETING
   ============================================ */
console.log(`
%c✨ Lumière Éternelle - Art Nouveau Gallery ✨
%cDesigned with organic flowing curves, gold accents, and timeless elegance.

🎨 Inspired by Alphonse Mucha & Gustav Klimt
🌟 Built with passion for beautiful web experiences

`,
    'color: #c9a962; font-size: 20px; font-weight: bold;',
    'color: #8b7355; font-size: 14px;'
);