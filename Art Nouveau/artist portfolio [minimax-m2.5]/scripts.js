/* ======================================== 
ART NOUVEAU PORTFOLIO - SCRIPTS.JS 
Interactive features, animations, and functionality 
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initScrollAnimations();
    initLightbox();
    initNavigation();
    initParallaxEffects();
    initFormHandling();
    initStaggeredAnimations();
});

/* ======================================== 
SCROLL ANIMATIONS 
======================================== */
function initScrollAnimations() {
    // Create Intersection Observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add subtle scale animation for gallery items
                if (entry.target.classList.contains('gallery-item')) {
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            }
        });
    }, observerOptions);
    
    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        scrollObserver.observe(item);
    });
    
    // Observe sections for fade-in-up effect
    const sections = document.querySelectorAll('.hero-section, .gallery-section, .about-section, .exhibitions-section, .contact-section');
    sections.forEach(section => {
        section.classList.add('fade-in-up');
        scrollObserver.observe(section);
    });
    
    // Stagger animation for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease-out ${index * 0.2}s, transform 0.6s ease-out ${index * 0.2}s`;
        scrollObserver.observe(item);
    });
}

/* ======================================== 
LIGHTBOX FUNCTIONALITY 
======================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxMeta = document.getElementById('lightbox-meta');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Open lightbox on gallery item click
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.dataset.title;
            const year = this.dataset.year;
            const medium = this.dataset.medium;
            const imageSrc = this.querySelector('.gallery-image').src;
            
            // Update lightbox content
            lightboxImage.src = imageSrc;
            lightboxImage.alt = title;
            lightboxTitle.textContent = title;
            lightboxMeta.textContent = `${year} • ${medium}`;
            
            // Show lightbox
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add entrance animation
            lightboxImage.style.opacity = '0';
            lightboxImage.style.transform = 'scale(0.9)';
            setTimeout(() => {
                lightboxImage.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                lightboxImage.style.opacity = '1';
                lightboxImage.style.transform = 'scale(1)';
            }, 50);
        });
    });
    
    // Close lightbox function
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close button click
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* ======================================== 
NAVIGATION FUNCTIONALITY 
======================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Navbar background on scroll
    const mainNav = document.querySelector('.main-navigation');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            mainNav.style.background = 'rgba(250, 248, 245, 0.95)';
            mainNav.style.boxShadow = '0 2px 20px rgba(26, 26, 26, 0.1)';
        } else {
            mainNav.style.background = 'transparent';
            mainNav.style.boxShadow = 'none';
        }
        lastScroll = currentScroll;
    });
    
    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ======================================== 
PARALLAX EFFECTS 
======================================== */
function initParallaxEffects() {
    const vineBorders = document.querySelectorAll('.vine-border');
    const headerOrnaments = document.querySelectorAll('.header-ornament');
    const heroVine = document.querySelector('.hero-vine-decoration');
    
    // Parallax for vine borders
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        vineBorders.forEach((vine, index) => {
            const speed = 0.05 * (index + 1);
            vine.style.transform = `translateY(${scrollY * speed}px)`;
        });
        
        // Header ornaments parallax
        if (headerOrnaments.length > 0) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            if (scrollY < headerHeight) {
                headerOrnaments.forEach((ornament, index) => {
                    const direction = index === 0 ? -1 : 1;
                    ornament.style.transform = `translateY(${scrollY * 0.1 * direction}px)`;
                });
            }
        }
        
        // Hero vine decoration parallax
        if (heroVine) {
            const heroSection = document.querySelector('.hero-section');
            const heroRect = heroSection.getBoundingClientRect();
            if (heroRect.bottom > 0) {
                const heroSpeed = (heroRect.top / heroSection.offsetHeight) * 20;
                heroVine.style.transform = `translateY(${heroSpeed}px)`;
            }
        }
    });
    
    // Subtle float animation for decorative elements
    function floatElements() {
        const elements = document.querySelectorAll('.frame-flower, .iris-left, .iris-right');
        elements.forEach(el => {
            const randomDelay = Math.random() * 2;
            el.style.animationDelay = `${randomDelay}s`;
        });
    }
    
    floatElements();
}

/* ======================================== 
FORM HANDLING 
======================================== */
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission (in production, this would be an API call)
        const submitBtn = contactForm.querySelector('.submit-button');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span class="button-text">Sending...</span>';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showFormMessage('Thank you for your inquiry. We will respond within 2-3 business days.', 'success');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            contactForm.reset();
        }, 1500);
    });
    
    // Input validation feedback
    const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error state on input
            this.classList.remove('input-error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
    
    function validateInput(input) {
        const value = input.value.trim();
        
        if (input.required && !value) {
            input.classList.add('input-error');
            showInputError(input, 'This field is required');
            return false;
        }
        
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('input-error');
                showInputError(input, 'Please enter a valid email');
                return false;
            }
        }
        
        input.classList.remove('input-error');
        return true;
    }
    
    function showInputError(input, message) {
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #5a1a2e; font-size: 0.85rem; margin-top: 5px;';
        input.parentNode.appendChild(errorDiv);
    }
    
    function showFormMessage(message, type) {
        // Remove existing messages
        const existingMsg = document.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `form-message form-message-${type}`;
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            padding: 15px 20px;
            margin-bottom: 20px;
            border: 1px solid ${type === 'success' ? '#2a4a3a' : '#5a1a2e'};
            background: ${type === 'success' ? 'rgba(42, 74, 58, 0.1)' : 'rgba(90, 26, 46, 0.1)'};
            color: ${type === 'success' ? '#2a4a3a' : '#5a1a2e'};
            font-family: var(--font-display);
            text-align: center;
        `;
        
        contactForm.insertBefore(msgDiv, contactForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            msgDiv.remove();
        }, 5000);
    }
}

/* ======================================== 
STAGGERED ANIMATIONS 
======================================== */
function initStaggeredAnimations() {
    // Hero section entrance animation
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroImage = document.querySelector('.hero-image-container');
    
    // Set initial states
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 100);
    
    // Animate hero elements sequentially
    setTimeout(() => {
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateX(-20px)';
            heroTitle.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            setTimeout(() => {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateX(0)';
            }, 300);
        }
    }, 300);
    
    setTimeout(() => {
        if (heroDescription) {
            heroDescription.style.opacity = '0';
            heroDescription.style.transform = 'translateX(20px)';
            heroDescription.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            setTimeout(() => {
                heroDescription.style.opacity = '1';
                heroDescription.style.transform = 'translateX(0)';
            }, 300);
        }
    }, 500);
    
    setTimeout(() => {
        if (heroImage) {
            heroImage.style.opacity = '0';
            heroImage.style.transform = 'scale(0.95)';
            heroImage.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            setTimeout(() => {
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'scale(1)';
            }, 300);
        }
    }, 700);
    
    // Section title animations
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(title);
    });
}

/* ======================================== 
UTILITY FUNCTIONS 
======================================== */

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

// Throttle function for performance
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

/* ======================================== 
LOADING STATE 
======================================== */

// Add loading class and remove when page is fully loaded
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger any post-load animations
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.classList.add('visible');
    });
});

// Add CSS for loaded state
const loadStyles = document.createElement('style');
loadStyles.textContent = `
    body.loaded .gallery-item {
        opacity: 1;
        transform: translateY(0);
    }
    body:not(.loaded) {
        overflow: hidden;
    }
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-cream);
        z-index: 99999;
    }
`;
document.head.appendChild(loadStyles);