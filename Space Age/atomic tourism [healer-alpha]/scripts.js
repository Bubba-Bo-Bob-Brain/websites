/* =====================================================
   STELLAR VOYAGES - 1960s Space Age Travel Brochure
   Interactive JavaScript Features
   ===================================================== */

// DOM Elements
const elements = {
    // Navigation
    mainNav: document.querySelector('.main-nav'),
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    mobileMenu: document.querySelector('.mobile-menu'),
    navLinks: document.querySelectorAll('.nav-links a, .mobile-nav-links a'),
    
    // Hero Section
    hero: document.querySelector('.hero'),
    scrollIndicator: document.querySelector('.scroll-indicator'),
    
    // Schedule Board
    currentClock: document.querySelector('.current-time'),
    flipClocks: document.querySelectorAll('.flip-clock'),
    
    // Booking
    bookingForm: document.getElementById('booking-form'),
    destinationSelect: document.getElementById('destination'),
    dateInput: document.getElementById('date'),
    
    // Modal
    confirmationModal: document.getElementById('confirmation-modal'),
    modalClose: document.querySelector('.modal-close'),
    modalOverlay: document.querySelector('.modal-overlay'),
    modalBtn: document.querySelector('.modal-btn'),
    
    // Back to Top
    backToTopBtn: document.querySelector('.back-to-top'),
    
    // Mascot
    mascotSpeech: document.querySelector('.speech-bubble p'),
    
    // All sections for scroll animations
    sections: document.querySelectorAll('section'),
    experienceCards: document.querySelectorAll('.experience-card'),
    accommodationCards: document.querySelectorAll('.accommodation-card'),
    destinationCards: document.querySelectorAll('.destination-card'),
    testimonialCards: document.querySelectorAll('.testimonial-card')
};

// State
const state = {
    isMobileMenuOpen: false,
    hasScrolled: false,
    isModalOpen: false
};

// =====================================================
// INITIALIZATION
// =====================================================
function init() {
    // Set minimum date for booking to today
    const today = new Date().toISOString().split('T')[0];
    if (elements.dateInput) {
        elements.dateInput.setAttribute('min', today);
    }
    
    // Initialize all features
    initNavigation();
    initScrollEffects();
    initScheduleBoard();
    initBookingForm();
    initModal();
    initBackToTop();
    initMascotAnimation();
    initParallax();
    initStarfield();
    
    // Add loaded class to body
    document.body.classList.add('loaded');
}

// =====================================================
// NAVIGATION
// =====================================================
function initNavigation() {
    // Mobile menu toggle
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking nav links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (state.isMobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Smooth scrolling for anchor links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavScroll);
}

function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    elements.mobileMenu.classList.toggle('active', state.isMobileMenuOpen);
    elements.mobileMenuBtn.classList.toggle('active', state.isMobileMenuOpen);
    
    // Animate hamburger to X
    const spans = elements.mobileMenuBtn.querySelectorAll('span');
    if (state.isMobileMenuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
}

function handleNavScroll() {
    const scrollY = window.scrollY;
    
    // Add/remove scrolled class
    if (scrollY > 50) {
        elements.mainNav.classList.add('scrolled');
        state.hasScrolled = true;
    } else {
        elements.mainNav.classList.remove('scrolled');
        state.hasScrolled = false;
    }
    
    // Hide scroll indicator when scrolled
    if (elements.scrollIndicator) {
        if (scrollY > 100) {
            elements.scrollIndicator.style.opacity = '0';
        } else {
            elements.scrollIndicator.style.opacity = '1';
        }
    }
}

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const navHeight = elements.mainNav.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// =====================================================
// SCHEDULE BOARD - FLIP CLOCK
// =====================================================
function initScheduleBoard() {
    // Update current time every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Initialize flip clocks
    elements.flipClocks.forEach(clock => {
        const time = clock.getAttribute('data-time');
        if (time) {
            updateFlipClock(clock, time);
        }
    });
    
    // Randomly update flight status every 10 seconds
    setInterval(updateFlightStatus, 10000);
}

function updateCurrentTime() {
    if (!elements.currentClock) return;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    elements.currentClock.textContent = `${hours}:${minutes}:${seconds}`;
}

function updateFlipClock(clockElement, timeString) {
    const [hours, minutes] = timeString.split(':');
    const digits = clockElement.querySelectorAll('.flip-digit span');
    
    if (digits.length >= 4) {
        // Set initial values
        digits[0].textContent = hours[0];
        digits[1].textContent = hours[1];
        digits[2].textContent = minutes[0];
        digits[3].textContent = minutes[1];
        
        // Add flip animation every minute
        setInterval(() => {
            const now = new Date();
            const currentMinutes = String(now.getMinutes()).padStart(2, '0');
            const currentHours = String(now.getHours()).padStart(2, '0');
            
            // Only update if the time has changed
            if (digits[2].textContent !== currentMinutes[0] || 
                digits[3].textContent !== currentMinutes[1]) {
                
                // Animate the flip
                animateFlip(digits[2], currentMinutes[0]);
                animateFlip(digits[3], currentMinutes[1]);
            }
            
            if (digits[0].textContent !== currentHours[0] || 
                digits[1].textContent !== currentHours[1]) {
                
                animateFlip(digits[0], currentHours[0]);
                animateFlip(digits[1], currentHours[1]);
            }
        }, 60000); // Check every minute
    }
}

function animateFlip(element, newValue) {
    if (element.textContent === newValue) return;
    
    // Create flip animation
    element.style.transform = 'rotateX(-90deg)';
    element.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'rotateX(0deg)';
    }, 150);
}

function updateFlightStatus() {
    const statusBadges = document.querySelectorAll('.status-badge');
    const statuses = ['ON TIME', 'BOARDING', 'DELAYED', 'FINAL CALL'];
    
    statusBadges.forEach(badge => {
        // Randomly change status (20% chance)
        if (Math.random() < 0.2) {
            const currentStatus = badge.textContent;
            let newStatus;
            
            // Don't change to the same status
            do {
                newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            } while (newStatus === currentStatus);
            
            // Update badge
            badge.textContent = newStatus;
            
            // Update badge class
            badge.className = 'status-badge';
            if (newStatus === 'ON TIME') {
                badge.classList.add('status-ontime');
            } else if (newStatus === 'BOARDING' || newStatus === 'FINAL CALL') {
                badge.classList.add('status-boarding');
            } else if (newStatus === 'DELAYED') {
                badge.classList.add('status-delayed');
            }
            
            // Add pulse animation
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = 'statusPulse 1.5s ease-in-out infinite';
            }, 10);
        }
    });
}

// =====================================================
// BOOKING FORM
// =====================================================
function initBookingForm() {
    if (!elements.bookingForm) return;
    
    elements.bookingForm.addEventListener('submit', handleFormSubmit);
    
    // Destination change handler
    if (elements.destinationSelect) {
        elements.destinationSelect.addEventListener('change', handleDestinationChange);
    }
    
    // Add floating labels effect
    const formGroups = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formGroups.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(elements.bookingForm);
    const data = Object.fromEntries(formData.entries());
    
    // Generate confirmation number
    const confirmationNumber = generateConfirmationNumber(data);
    
    // Show confirmation modal
    showConfirmationModal(confirmationNumber, data);
    
    // Reset form
    elements.bookingForm.reset();
}

function validateForm() {
    let isValid = true;
    const requiredFields = elements.bookingForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--coral)';
            
            // Reset after 3 seconds
            setTimeout(() => {
                field.style.borderColor = '';
            }, 3000);
        }
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.style.borderColor = 'var(--coral)';
            
            setTimeout(() => {
                emailField.style.borderColor = '';
            }, 3000);
        }
    }
    
    return isValid;
}

function handleDestinationChange() {
    const destination = elements.destinationSelect.value;
    const classSelect = document.getElementById('class');
    
    if (!classSelect) return;
    
    // Update available classes based on destination
    classSelect.innerHTML = '<option value="">Select Class</option>';
    
    const classes = {
        'moon': [
            { value: 'economy', text: 'Economy' },
            { value: 'first', text: 'First Class' },
            { value: 'luxury', text: 'Luxury Suite' }
        ],
        'mars': [
            { value: 'expedition', text: 'Expedition Class' },
            { value: 'explorer', text: 'Explorer Class' },
            { value: 'commander', text: 'Commander Suite' }
        ],
        'orbital': [
            { value: 'standard', text: 'Standard' },
            { value: 'superior', text: 'Superior' },
            { value: 'penthouse', text: 'Space Penthouse' }
        ]
    };
    
    if (classes[destination]) {
        classes[destination].forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.value;
            option.textContent = cls.text;
            classSelect.appendChild(option);
        });
    }
}

function generateConfirmationNumber(data) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const destinationCode = data.destination ? data.destination.substring(0, 3).toUpperCase() : 'XXX';
    
    return `SV-${year}-${destinationCode}-${random}`;
}

// =====================================================
// MODAL
// =====================================================
function initModal() {
    // Close modal on overlay click
    if (elements.modalOverlay) {
        elements.modalOverlay.addEventListener('click', hideModal);
    }
    
    // Close modal on close button click
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', hideModal);
    }
    
    // Close modal on button click
    if (elements.modalBtn) {
        elements.modalBtn.addEventListener('click', hideModal);
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isModalOpen) {
            hideModal();
        }
    });
}

function showConfirmationModal(confirmationNumber, data) {
    if (!elements.confirmationModal) return;
    
    // Update confirmation number
    const confNumberElement = elements.confirmationModal.querySelector('.conf-number');
    if (confNumberElement) {
        confNumberElement.textContent = confirmationNumber;
    }
    
    // Update modal text with destination
    const modalText = elements.confirmationModal.querySelector('.modal-text');
    if (modalText && data.destination) {
        const destinationNames = {
            'moon': 'the Moon',
            'mars': 'Mars',
            'orbital': 'our orbital hotel'
        };
        
        const destinationName = destinationNames[data.destination] || 'space';
        modalText.textContent = `Thank you for choosing Stellar Voyages! Your cosmic adventure to ${destinationName} awaits. A confirmation telegram will be sent to your Space Mail address shortly.`;
    }
    
    // Show modal
    elements.confirmationModal.classList.add('active');
    state.isModalOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    if (!elements.confirmationModal) return;
    
    elements.confirmationModal.classList.remove('active');
    state.isModalOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// =====================================================
// BACK TO TOP BUTTON
// =====================================================
function initBackToTop() {
    if (!elements.backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            elements.backToTopBtn.classList.add('visible');
        } else {
            elements.backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    elements.backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =====================================================
// MASCOT ANIMATION
// =====================================================
function initMascotAnimation() {
    if (!elements.mascotSpeech) return;
    
    // Add typing effect to mascot speech
    const originalText = elements.mascotSpeech.innerHTML;
    elements.mascotSpeech.innerHTML = '';
    
    // Type out the text with a delay
    let i = 0;
    const typingSpeed = 20; // milliseconds per character
    
    function typeWriter() {
        if (i < originalText.length) {
            // Handle HTML tags
            if (originalText.charAt(i) === '<') {
                const tagEnd = originalText.indexOf('>', i);
                if (tagEnd !== -1) {
                    elements.mascotSpeech.innerHTML += originalText.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                } else {
                    elements.mascotSpeech.innerHTML += originalText.charAt(i);
                    i++;
                }
            } else {
                elements.mascotSpeech.innerHTML += originalText.charAt(i);
                i++;
            }
            
            setTimeout(typeWriter, typingSpeed);
        }
    }
    
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
}

// =====================================================
// PARALLAX EFFECTS
// =====================================================
function initParallax() {
    // Parallax for hero planets
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Move planets at different speeds
        const earth = document.querySelector('.planet-earth');
        const moon = document.querySelector('.planet-moon');
        const mars = document.querySelector('.planet-mars');
        
        if (earth) earth.style.transform = `translateY(${scrollY * 0.3}px)`;
        if (moon) moon.style.transform = `translateY(${scrollY * 0.2}px)`;
        if (mars) mars.style.transform = `translateY(${scrollY * 0.15}px)`;
    });
    
    // Parallax for floating atoms
    document.addEventListener('mousemove', (e) => {
        const atoms = document.querySelectorAll('.atom');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        atoms.forEach((atom, index) => {
            const speed = (index + 1) * 20;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            atom.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// =====================================================
// STARFIELD BACKGROUND
// =====================================================
function initStarfield() {
    const heroStars = document.querySelector('.hero-stars');
    if (!heroStars) return;
    
    // Add random stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random twinkle animation
        const animationDelay = Math.random() * 5;
        const animationDuration = Math.random() * 3 + 2;
        
        star.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: ${Math.random() > 0.7 ? 'var(--gold)' : 'var(--white)'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.5};
            animation: twinkleStars ${animationDuration}s ease-in-out ${animationDelay}s infinite;
        `;
        
        heroStars.appendChild(star);
    }
    
    // Add shooting stars occasionally
    setInterval(createShootingStar, 8000);
}

function createShootingStar() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // Random start position
    const startX = Math.random() * 80 + 10; // 10-90%
    const startY = Math.random() * 30 + 10; // 10-40%
    
    // Random angle
    const angle = Math.random() * 30 + 30; // 30-60 degrees
    
    shootingStar.style.cssText = `
        position: absolute;
        left: ${startX}%;
        top: ${startY}%;
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, var(--white), transparent);
        transform: rotate(${angle}deg);
        opacity: 0;
        animation: shootingStar 1s ease-out forwards;
        z-index: 5;
    `;
    
    hero.appendChild(shootingStar);
    
    // Remove after animation
    setTimeout(() => {
        shootingStar.remove();
    }, 1000);
}

// =====================================================
// SCROLL ANIMATIONS
// =====================================================
function initScrollAnimations() {
    // Use Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = [
        ...elements.experienceCards,
        ...elements.accommodationCards,
        ...elements.destinationCards,
        ...elements.testimonialCards,
        ...elements.sections
    ];
    
    animateElements.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        }
    });
    
    // Add CSS for animated elements
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .shooting-star {
            animation: shootingStar 1s ease-out forwards;
        }
        
        @keyframes shootingStar {
            0% {
                opacity: 0;
                transform: rotate(45deg) translateX(0);
            }
            10% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: rotate(45deg) translateX(1000px);
            }
        }
    `;
    document.head.appendChild(style);
}

// =====================================================
// EXPERIENCE CARD INTERACTIONS
// =====================================================
function initCardInteractions() {
    // Add hover effects to experience cards
    elements.experienceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add floating animation
            card.style.animation = 'cardFloat 3s ease-in-out infinite';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.animation = '';
        });
    });
    
    // Add click effect to destination cards
    elements.destinationCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a button
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            
            // Add tilt effect
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            
            // Reset after 300ms
            setTimeout(() => {
                card.style.transform = '';
            }, 300);
        });
    });
    
    // Add CSS for card animations
    const cardStyle = document.createElement('style');
    cardStyle.textContent = `
        @keyframes cardFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(cardStyle);
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================
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

// =====================================================
// INITIALIZE EVERYTHING WHEN DOM IS LOADED
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Initialize additional features after a short delay
    setTimeout(() => {
        initScrollAnimations();
        initCardInteractions();
    }, 500);
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Reset mobile menu on resize to desktop
    if (window.innerWidth > 768 && state.isMobileMenuOpen) {
        toggleMobileMenu();
    }
}, 250));

// Add custom cursor effect
document.addEventListener('mousemove', throttle((e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
}, 16));

// Add loading complete animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove loading screen if exists
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
});