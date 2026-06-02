/* ============================================
   ASTROVOYAGES - 1960s Space Age Tourism
   JavaScript functionality
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initStarfield();
    initCustomCursor();
    initParallax();
    initTestimonialCarousel();
    initBookingForm();
    initClock();
    initMascot();
    initScrollAnimations();
    initSmoothScrolling();
    initScheduleBoard();
});

/* ============================================
   STARFIELD BACKGROUND
   ============================================ */
function initStarfield() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;
    
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        // Random animation duration
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        starfield.appendChild(star);
    }
    
    // Add shooting stars occasionally
    setInterval(createShootingStar, 5000);
}

function createShootingStar() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;
    
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    shootingStar.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: linear-gradient(to right, transparent, #40E0D0, white);
        border-radius: 50%;
        top: ${Math.random() * 50}%;
        left: ${Math.random() * 100}%;
        transform: rotate(-45deg);
        animation: shooting 2s linear forwards;
    `;
    
    // Add keyframes for shooting star if not already present
    if (!document.getElementById('shooting-keyframes')) {
        const style = document.createElement('style');
        style.id = 'shooting-keyframes';
        style.textContent = `
            @keyframes shooting {
                0% {
                    width: 2px;
                    opacity: 1;
                }
                100% {
                    width: 200px;
                    opacity: 0;
                    transform: rotate(-45deg) translateX(300px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    starfield.appendChild(shootingStar);
    
    // Remove after animation
    setTimeout(() => {
        shootingStar.remove();
    }, 2000);
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;
    
    // Only enable on devices with pointer (not touch)
    if (!window.matchMedia('(pointer: fine)').matches) {
        cursor.style.display = 'none';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor movement
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .destination-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallax() {
    const hero = document.querySelector('.hero');
    const planets = document.querySelectorAll('.planet');
    const rocket = document.querySelector('.rocket-silhouette');
    const orbitTrail = document.querySelector('.orbit-trail');
    
    if (!hero || planets.length === 0) return;
    
    // Parallax on scroll
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroHeight = hero.offsetHeight;
                
                // Only apply parallax while hero is visible
                if (scrolled < heroHeight) {
                    const parallaxValue = scrolled * 0.5;
                    
                    planets.forEach((planet, index) => {
                        const speed = 0.2 + (index * 0.1);
                        const yPos = -(scrolled * speed);
                        planet.style.transform = `translateY(${yPos}px)`;
                    });
                    
                    if (rocket) {
                        rocket.style.transform = `translateY(${scrolled * 0.3}px) rotate(-5deg)`;
                    }
                    
                    if (orbitTrail) {
                        orbitTrail.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.1}deg)`;
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Mouse parallax for hero section
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const moveX = (mouseX - centerX) / 30;
        const moveY = (mouseY - centerY) / 30;
        
        planets.forEach((planet, index) => {
            const depth = 1 + (index * 0.5);
            const x = moveX * depth;
            const y = moveY * depth;
            
            // Preserve any existing transform (like float animation)
            const currentTransform = planet.style.transform;
            if (currentTransform.includes('translateY')) {
                // Extract the translateY value and add the mouse parallax
                const translateYMatch = currentTransform.match(/translateY\(([-\d.]+)px\)/);
                if (translateYMatch) {
                    const translateY = parseFloat(translateYMatch[1]);
                    planet.style.transform = `translate(${x}px, ${y + translateY}px) rotate(${scrolled * 0.1}deg)`;
                }
            } else {
                planet.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    });
}

/* ============================================
   TESTIMONIAL CAROUSEL
   ============================================ */
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-btn.prev');
    const nextBtn = document.querySelector('.testimonial-btn.next');
    
    if (testimonials.length === 0) return;
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    function showTestimonial(index) {
        // Remove active class from all
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        // Add active class to current
        testimonials[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentIndex = index;
    }
    
    function nextTestimonial() {
        const next = (currentIndex + 1) % testimonials.length;
        showTestimonial(next);
    }
    
    function prevTestimonial() {
        const prev = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prev);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextTestimonial();
            resetAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevTestimonial();
            resetAutoSlide();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetAutoSlide();
        });
    });
    
    // Auto-slide every 8 seconds
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextTestimonial, 8000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    startAutoSlide();
    
    // Pause on hover
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        carousel.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
}

/* ============================================
   BOOKING FORM
   ============================================ */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const toast = document.getElementById('toast');
    const toastClose = document.querySelector('.toast-close');
    
    if (!form) return;
    
    // Form validation and submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const destination = document.getElementById('destination').value;
        const travelers = document.getElementById('travelers').value;
        
        if (!name || !email || !destination || !travelers) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'PROCESSING...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success
            showToast('Your inquiry has been received! A space travel consultant will contact you within 24 hours.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Log form data (in real app, would send to server)
            console.log('Form submitted:', {
                name,
                email,
                destination,
                travelers,
                departure: document.getElementById('departure').value,
                accommodations: document.getElementById('accommodations').value,
                message: document.getElementById('message').value,
                newsletter: document.getElementById('newsletter').checked
            });
        }, 2000);
    });
    
    // Toast notification
    function showToast(message, type = 'success') {
        if (!toast) return;
        
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');
        
        toastMessage.textContent = message;
        toastIcon.textContent = type === 'success' ? '✓' : '⚠';
        toastIcon.style.background = type === 'success' ? 'var(--turquoise)' : 'var(--coral)';
        toastIcon.style.color = type === 'success' ? 'var(--charcoal)' : 'var(--white)';
        
        toast.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }
    
    // Close toast button
    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        input.addEventListener('input', () => {
            // Remove error state on input
            if (input.classList.contains('error')) {
                input.classList.remove('error');
            }
        });
    });
    
    function validateInput(input) {
        const value = input.value.trim();
        const isRequired = input.hasAttribute('required');
        
        if (isRequired && !value) {
            input.classList.add('error');
            input.style.borderColor = 'var(--coral)';
            return false;
        }
        
        if (input.type === 'email' && value && !isValidEmail(value)) {
            input.classList.add('error');
            input.style.borderColor = 'var(--coral)';
            return false;
        }
        
        input.style.borderColor = 'var(--turquoise)';
        return true;
    }
    
    // Add error styles
    const errorStyles = document.createElement('style');
    errorStyles.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: var(--coral) !important;
            box-shadow: 0 0 0 3px rgba(255, 127, 80, 0.1) !important;
        }
    `;
    document.head.appendChild(errorStyles);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* ============================================
   REAL-TIME CLOCK
   ============================================ */
function initClock() {
    const clockElement = document.getElementById('currentTime');
    if (!clockElement) return;
    
    function updateClock() {
        const now = new Date();
        
        // Format: DAY MON DD HH:MM:SS EST
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        const dayName = days[now.getDay()];
        const monthName = months[now.getMonth()];
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        clockElement.textContent = `${dayName} ${monthName} ${day} ${hours}:${minutes}:${seconds} EST`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

/* ============================================
   MASCOT INTERACTIONS
   ============================================ */
function initMascot() {
    const mascot = document.getElementById('mascot');
    const bubble = document.querySelector('.mascot-bubble');
    const message = document.querySelector('.mascot-message');
    
    if (!mascot || !bubble || !message) return;
    
    const messages = [
        "Welcome to the future of travel! 🚀",
        "Your cosmic adventure awaits! ✨",
        "Did you know? Mars is 6 months away! 🌍➡️🔴",
        "Lunar gravity is only 1/6th of Earth's! 🌙",
        "Book now and get 10% off your first voyage! 💫",
        "Our orbital hotel rotates for artificial gravity! 🛰️",
        "All meals are prepared by Michelin-starred chefs! 🍽️",
        "Safety is our top priority - we've never lost a bag! 🛄",
        "The view from the Moon is out of this world! 🌍",
        "Ask about our family packages! 👨‍👩‍👧‍👦"
    ];
    
    let messageIndex = 0;
    
    // Change message every 10 seconds
    setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        
        // Fade out
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            message.textContent = messages[messageIndex];
            // Fade in
            bubble.style.opacity = '1';
            bubble.style.transform = 'scale(1)';
        }, 300);
    }, 10000);
    
    // Click to change message immediately
    mascot.addEventListener('click', () => {
        messageIndex = (messageIndex + 1) % messages.length;
        message.textContent = messages[messageIndex];
        
        // Add bounce animation
        mascot.style.animation = 'none';
        setTimeout(() => {
            mascot.style.animation = 'mascot-bob 3s ease-in-out infinite';
        }, 10);
    });
    
    // Hide mascot on mobile (optional, already small)
    if (window.innerWidth < 768) {
        mascot.style.display = 'none';
    }
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.destination-card, .amenity-item, .section-header, .booking-form-container'
    );
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Add CSS for animate-in class
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Staggered animation for grid items
    function staggerAnimation(parentSelector, childSelector) {
        const parent = document.querySelector(parentSelector);
        if (!parent) return;
        
        const children = parent.querySelectorAll(childSelector);
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('animate-in');
                            }, index * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(parent);
        }
    }
    
    staggerAnimation('.destinations-grid', '.destination-card');
    staggerAnimation('.amenities-grid', '.amenity-item');
}

/* ============================================
   SMOOTH SCROLLING
   ============================================ */
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav state
                updateActiveNav(href);
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', debounce(() => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = '#' + section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                updateActiveNav(id);
            }
        });
    }, 100));
    
    function updateActiveNav(activeId) {
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }
}

/* ============================================
   SCHEDULE BOARD INTERACTIVITY
   ============================================ */
function initScheduleBoard() {
    const rows = document.querySelectorAll('.schedule-row');
    const seatsBars = document.querySelectorAll('.seat-filled');
    
    // Interactive row hover
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const route = row.dataset.route;
            
            // Highlight corresponding destination card
            const card = document.querySelector(`.destination-card[data-destination="${route}"]`);
            if (card) {
                card.style.borderColor = 'var(--coral)';
                card.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        row.addEventListener('mouseleave', () => {
            const route = row.dataset.route;
            
            // Remove highlight from card
            const card = document.querySelector(`.destination-card[data-destination="${route}"]`);
            if (card) {
                card.style.borderColor = '';
                card.style.transform = '';
            }
        });
        
        // Click row to navigate to booking with pre-selected destination
        row.addEventListener('click', () => {
            const route = row.dataset.route;
            const destinationSelect = document.getElementById('destination');
            
            if (destinationSelect && route) {
                destinationSelect.value = route;
                
                // Smooth scroll to booking
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = bookingSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus on name field
                    setTimeout(() => {
                        document.getElementById('name').focus();
                    }, 1000);
                }
            }
        });
    });
    
    // Animate seat bars on page load
    window.addEventListener('load', () => {
        seatsBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = targetWidth;
            }, 500);
        });
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function debounce(func, wait) {
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

// Add some interactive Easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const keySequence = [];
    
    keySequence.push(e.key);
    if (keySequence.length > konamiCode.length) {
        keySequence.shift();
    }
    
    if (JSON.stringify(keySequence) === JSON.stringify(konamiCode)) {
        // Activate super mode!
        document.body.style.animation = 'rainbow 2s infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        showToast('🚀 Super mode activated! You found the secret!', 'success');
    }
});

// Add loading animation for images (if any were added)
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '0';
        setTimeout(() => {
            img.style.transition = 'opacity 0.5s ease';
            img.style.opacity = '1';
        }, 100);
    });
});

// Console Easter egg
console.log(`
%c🚀 ASTROVOYAGES 🚀
%cWelcome to the future of travel!
%cSince 1964, we've been taking travelers to the stars.
%cType the Konami code for a special surprise! (↑ ↑ ↓ ↓ ← → ← → B A)

`,
    'font-size: 24px; font-weight: bold; color: #40E0D0;',
    'font-size: 14px; color: #FF7F50;',
    'font-size: 12px; color: #2C2C2C;',
    'font-size: 10px; color: #666;'
);

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const animatedElements = document.querySelectorAll('.planet, .burst-ray, .electron, .atom-logo .orbit');
    
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

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    // Disable custom cursor on touch devices
    const cursor = document.getElementById('customCursor');
    if (cursor) {
        cursor.style.display = 'none';
    }
    
    // Make mascot draggable on mobile for fun
    const mascot = document.getElementById('mascot');
    if (mascot) {
        let isDragging = false;
        let startX, startY, initialLeft, initialBottom;
        
        mascot.addEventListener('touchstart', (e) => {
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            
            const rect = mascot.getBoundingClientRect();
            initialLeft = rect.left;
            initialBottom = window.innerHeight - rect.bottom;
            
            e.preventDefault();
        });
        
        mascot.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            mascot.style.right = 'auto';
            mascot.style.bottom = 'auto';
            mascot.style.left = `${initialLeft + deltaX}px`;
            mascot.style.top = `${window.innerHeight - initialBottom - deltaY}px`;
            
            e.preventDefault();
        });
        
        mascot.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
}

// Accessibility: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
    document.documentElement.style.setProperty('--transition-fast', '0s');
    
    // Disable all animations
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}