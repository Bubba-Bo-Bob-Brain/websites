/* ========================================
   GALACTIC GETAWAYS - 1960s Space Age Tourism Website
   JavaScript - Complete Interactive Functionality
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initStars();
    initNavigation();
    initScrollEffects();
    initTestimonialCarousel();
    initCountdown();
    initBookingForm();
    initParallax();
    initCounters();
    initAnimations();
});

/* ===== STAR FIELD GENERATION ===== */
function initStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;
    
    const starCount = 150;
    const colors = ['#FFFDD0', '#2DD4BF', '#FFB347', '#FF6B6B'];
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.3;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            --duration: ${duration}s;
            --delay: ${delay}s;
            --opacity: ${opacity};
            background: ${color};
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        starsContainer.appendChild(star);
    }
    
    // Create shooting stars occasionally
    createShootingStar();
    setInterval(createShootingStar, 8000);
}

function createShootingStar() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;
    
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    const startX = Math.random() * 100;
    const startY = Math.random() * 50;
    
    shootingStar.style.cssText = `
        position: absolute;
        width: 100px;
        height: 2px;
        left: ${startX}%;
        top: ${startY}%;
        background: linear-gradient(90deg, rgba(255,253,208,1), rgba(255,253,208,0));
        border-radius: 50%;
        transform: rotate(35deg);
        animation: shooting 1.5s ease-out forwards;
        pointer-events: none;
    `;
    
    starsContainer.appendChild(shootingStar);
    setTimeout(() => shootingStar.remove(), 1500);
}

// Add shooting star animation to styles
const shootingStarStyle = document.createElement('style');
shootingStarStyle.textContent = `
    @keyframes shooting {
        0% {
            transform: translateX(0) translateY(0) rotate(35deg);
            opacity: 1;
        }
        100% {
            transform: translateX(400px) translateY(250px) rotate(35deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(shootingStarStyle);

/* ===== NAVIGATION ===== */
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll effect for nav
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
    
    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===== SCROLL EFFECTS ===== */
function initScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Stagger child animations
                const children = entry.target.querySelectorAll('.destination-card, .experience-card, .flight-row');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                });
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal-on-scroll');
        revealObserver.observe(section);
    });
    
    // Add reveal styles
    const revealStyles = document.createElement('style');
    revealStyles.textContent = `
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal-on-scroll.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(revealStyles);
}

/* ===== TESTIMONIAL CAROUSEL ===== */
function initTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = cards.length;
    
    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Add animation class to current card
        cards.forEach((card, i) => {
            card.style.opacity = i === currentIndex ? '1' : '0.3';
            card.style.transform = i === currentIndex ? 'scale(1)' : 'scale(0.95)';
            card.style.transition = 'all 0.5s ease';
        });
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-advance
    let autoPlayInterval = setInterval(nextSlide, 6000);
    
    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextSlide, 6000);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Initialize first slide
    goToSlide(0);
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

/* ===== COUNTDOWN TIMER ===== */
function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
    
    // Set launch date (7 days from now for demo)
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 7);
    launchDate.setHours(12, 0, 0, 0);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate.getTime() - now;
        
        if (distance < 0) {
            countdownEl.textContent = 'LAUNCHED!';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownEl.textContent = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Add dramatic effect on final countdown
        if (distance < 60000) {
            countdownEl.style.animation = 'countdown-urgent 0.5s ease-in-out infinite';
        }
    }
    
    // Add urgent animation
    const urgentStyle = document.createElement('style');
    urgentStyle.textContent = `
        @keyframes countdown-urgent {
            0%, 100% { 
                color: #FF6B6B; 
                transform: scale(1); 
            }
            50% { 
                color: #FFB347; 
                transform: scale(1.1); 
            }
        }
    `;
    document.head.appendChild(urgentStyle);
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Update board time
    const boardTimeEl = document.getElementById('boardTime');
    if (boardTimeEl) {
        function updateBoardTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            boardTimeEl.textContent = `${hours}:${minutes}:${seconds}`;
        }
        updateBoardTime();
        setInterval(updateBoardTime, 1000);
    }
}

/* ===== BOOKING FORM ===== */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    const bookingRefEl = document.getElementById('bookingRef');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate
        if (validateForm(data)) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">Transmitting to Mission Control...</span>';
            submitBtn.disabled = true;
            
            // Simulate API call
            await simulateSubmission();
            
            // Generate booking reference
            const bookingRef = generateBookingRef();
            if (bookingRefEl) {
                bookingRefEl.textContent = bookingRef;
            }
            
            // Show success modal
            if (modal) {
                modal.classList.add('active');
            }
            
            // Reset form
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Add confetti effect
            createConfetti();
        }
    });
    
    // Close modal
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }
}

function validateForm(data) {
    const required = ['departure', 'destination', 'departureDate', 'travelers', 'name', 'email'];
    for (const field of required) {
        if (!data[field] || data[field].trim() === '') {
            const input = document.querySelector(`[name="${field}"]`);
            if (input) {
                input.style.borderColor = '#FF6B6B';
                input.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    input.style.borderColor = '';
                    input.style.animation = '';
                }, 500);
            }
            return false;
        }
    }
    return true;
}

function generateBookingRef() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `GG-${year}-${random}`;
}

function simulateSubmission() {
    return new Promise(resolve => setTimeout(resolve, 2000));
}

/* ===== CONFETTI EFFECT ===== */
function createConfetti() {
    const colors = ['#2DD4BF', '#FF6B6B', '#FFB347', '#FFFDD0'];
    const container = document.body;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            z-index: 10001;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confetti-fall ${Math.random() * 2 + 2}s ease-out forwards;
            animation-delay: ${Math.random() * 0.5}s;
            pointer-events: none;
        `;
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
    
    // Add confetti animation
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(confettiStyle);
}

/* ===== PARALLAX EFFECTS ===== */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-visual, .hero-mascot, .footer-atom');
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                parallaxElements.forEach((el, index) => {
                    const speed = (index + 1) * 0.1;
                    el.style.transform = `translateY(${scrollY * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ===== ANIMATED COUNTERS ===== */
function initCounters() {
    const seatCountElements = document.querySelectorAll('.seat-count');
    if (seatCountElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.textContent);
                if (!isNaN(target)) {
                    animateCounter(el, 0, target, 1000);
                }
                counterObserver.unobserve(el);
            }
        });
    }, observerOptions);
    
    seatCountElements.forEach(el => counterObserver.observe(el));
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ===== GENERAL ANIMATIONS ===== */
function initAnimations() {
    // Add hover effect to buttons
    document.querySelectorAll('.btn, .card-btn, .nav-cta').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = btn.style.transform || '';
            if (!btn.style.transform.includes('scale')) {
                btn.style.transform += ' scale(1.05)';
            }
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = btn.style.transform.replace(' scale(1.05)', '');
        });
    });
    
    // Card hover 3D tilt effect
    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Experience cards hover effect
    document.querySelectorAll('.experience-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const visual = card.querySelector('.exp-visual');
            if (visual) {
                visual.style.transform = 'scale(1.1)';
                visual.style.transition = 'transform 0.5s ease';
            }
        });
        card.addEventListener('mouseleave', () => {
            const visual = card.querySelector('.exp-visual');
            if (visual) {
                visual.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add cosmic dust particles
    const cosmicDustStyle = document.createElement('style');
    cosmicDustStyle.textContent = `
        .cosmic-dust {
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(255, 253, 208, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: dust-drift 15s linear infinite;
        }
        @keyframes dust-drift {
            0% {
                transform: translateX(-100vw) translateY(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateX(100vw) translateY(-100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(cosmicDustStyle);
    
    // Create cosmic dust particles periodically
    function createCosmicDust() {
        const dust = document.createElement('div');
        dust.className = 'cosmic-dust';
        dust.style.top = Math.random() * 100 + 'vh';
        dust.style.animationDelay = Math.random() * 5 + 's';
        document.body.appendChild(dust);
        setTimeout(() => dust.remove(), 20000);
    }
    
    setInterval(createCosmicDust, 3000);
}

/* ===== ACCESSIBILITY ENHANCEMENTS ===== */
function initAccessibility() {
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-base', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
    
    // Focus trap for modal
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// Initialize accessibility
initAccessibility();

/* ===== CONSOLE EASTER EGG ===== */
console.log('%c🚀 GALACTIC GETAWAYS', 'background: #1a1a2e; color: #2DD4BF; font-size: 24px; font-weight: bold; padding: 15px 30px; border-radius: 10px; border: 2px solid #2DD4BF;');
console.log('%cYour journey to the stars begins here!', 'color: #FF6B6B; font-size: 14px; font-style: italic;');
console.log('%cThe universe is calling. Will you answer?', 'color: #FFB347; font-size: 12px;');
console.log('%c🌟 Fun fact: The first human was launched to space in 1961!', 'color: #2DD4BF; font-size: 11px;');