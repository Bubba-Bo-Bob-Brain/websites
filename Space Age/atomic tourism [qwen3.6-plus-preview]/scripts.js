/**
 * COSMIC HORIZONS — 1960s Space Age Tourism
 * Interactive JavaScript Module
 */

document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initNavigation();
    initMobileMenu();
    initScrollReveal();
    initDepartureBoard();
    initSmoothScroll();
    initBookingForm();
    initRocketInteraction();
});

/* ============ PARALLAX SCROLLING ENGINE ============ */
function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const heroSection = document.querySelector('.hero');
    
    if (!parallaxLayers.length || !heroSection) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const maxScroll = heroSection.offsetHeight;

    function updateParallax() {
        const scrollY = window.scrollY;
        
        // Only calculate when hero is in view
        if (scrollY <= maxScroll) {
            parallaxLayers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.1;
                const yOffset = -(scrollY * speed);
                layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            });
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/* ============ NAVIGATION SCROLL EFFECT ============ */
function initNavigation() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    let lastScroll = 0;
    const threshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > threshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/* ============ MOBILE MENU TOGGLE ============ */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !toggle.contains(e.target) && navLinks.classList.contains('active')) {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============ SCROLL REVEAL ANIMATIONS ============ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .feature-card, .luggage-tag, .testimonial-card, .board-row, .section-header');
    
    if (!revealElements.length) return;

    // Add reveal class to elements that don't have it
    revealElements.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay for sibling elements
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let delay = 0;
                
                if (siblings.length > 1) {
                    const idx = Array.from(siblings).indexOf(entry.target);
                    delay = idx * 0.15;
                }
                
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay * 1000);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* ============ DEPARTURE BOARD ============ */
function initDepartureBoard() {
    updateClock();
    setInterval(updateClock, 1000);
    
    animateBoardRows();
    simulateStatusUpdates();
}

function updateClock() {
    const clockEl = document.getElementById('boardClock');
    if (!clockEl) return;
    
    const now = new Date();
    const utc = now.toUTCString().split(' ')[4]; // HH:MM:SS
    clockEl.textContent = `${utc} UCT`;
}

function animateBoardRows() {
    const rows = document.querySelectorAll('.board-row');
    
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100);
    });
}

function simulateStatusUpdates() {
    const statuses = ['ON TIME', 'ON TIME', 'ON TIME', 'BOARDING', 'DELAYED'];
    const statusClasses = {
        'ON TIME': 'status-ontime',
        'BOARDING': 'status-boarding',
        'DELAYED': 'status-delayed'
    };

    // Randomly update a row's status every 15 seconds
    setInterval(() => {
        const rows = document.querySelectorAll('.board-row');
        const randomIndex = Math.floor(Math.random() * rows.length);
        const randomRow = rows[randomIndex];
        
        if (!randomRow) return;
        
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const statusEl = randomRow.querySelector('.col-status');
        
        if (statusEl) {
            // Flash effect
            statusEl.style.opacity = '0';
            statusEl.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                statusEl.textContent = newStatus;
                statusEl.className = 'col-status ' + statusClasses[newStatus];
                statusEl.style.opacity = '1';
                statusEl.style.transform = 'scale(1)';
                statusEl.style.transition = 'all 0.3s ease';
            }, 300);
        }
    }, 15000);
}

/* ============ SMOOTH SCROLL FOR ANCHOR LINKS ============ */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============ BOOKING FORM HANDLING ============ */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const destination = formData.get('destination');
        
        // Simulate submission
        const submitBtn = this.querySelector('.btn-primary');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Processing...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        setTimeout(() => {
            showBookingConfirmation(name, destination);
            submitBtn.innerHTML = '<span>✓ Reservation Received</span>';
            submitBtn.style.background = '#4ECDC4';
            
            setTimeout(() => {
                this.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
            }, 4000);
        }, 1500);
    });
}

function showBookingConfirmation(name, destination) {
    const existingModal = document.querySelector('.booking-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-star">✦</span>
                <h3>Reservation Confirmed!</h3>
                <span class="modal-star">✦</span>
            </div>
            <p class="modal-text">Thank you, <strong>${name}</strong>.</p>
            <p class="modal-text">Your request for <strong>${destination.charAt(0).toUpperCase() + destination.slice(1)}</strong> has been received.</p>
            <p class="modal-text">Our travel agents will contact you shortly to finalize your cosmic itinerary.</p>
            <div class="modal-stamp">APPROVED</div>
            <button class="modal-close" onclick="this.closest('.booking-modal').remove()">Return to Brochure</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Trigger modal animation
    requestAnimationFrame(() => {
        modal.classList.add('modal-visible');
    });

    // Close on backdrop click
    modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.remove());
    
    // Close on Escape
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Inject modal styles dynamically
(function() {
    const style = document.createElement('style');
    style.textContent = `
        .booking-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-md);
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .booking-modal.modal-visible {
            opacity: 1;
        }
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(26, 26, 46, 0.85);
            backdrop-filter: blur(4px);
        }
        .modal-content {
            position: relative;
            background: var(--navy);
            border: 3px solid var(--turquoise);
            border-radius: 12px;
            padding: var(--space-lg);
            max-width: 500px;
            width: 100%;
            text-align: center;
            transform: scale(0.9) translateY(20px);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .booking-modal.modal-visible .modal-content {
            transform: scale(1) translateY(0);
        }
        .modal-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-sm);
            margin-bottom: var(--space-md);
        }
        .modal-header h3 {
            font-family: var(--font-heading);
            font-size: 1.8rem;
            color: var(--cream);
        }
        .modal-star {
            font-size: 1.5rem;
            color: var(--coral);
        }
        .modal-text {
            color: var(--cream-dark);
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: var(--space-xs);
        }
        .modal-stamp {
            display: inline-block;
            margin: var(--space-md) 0;
            padding: 0.5rem 1.5rem;
            border: 3px double var(--turquoise);
            color: var(--turquoise);
            font-family: var(--font-heading);
            font-size: 1.2rem;
            letter-spacing: 0.15em;
            transform: rotate(-12deg);
        }
        .modal-close {
            background: var(--coral);
            color: var(--cream);
            border: none;
            padding: 0.8rem 2rem;
            font-family: var(--font-heading);
            font-size: 1rem;
            border-radius: 50px;
            cursor: pointer;
            transition: background var(--transition-fast);
        }
        .modal-close:hover {
            background: var(--coral-dark);
        }
    `;
    document.head.appendChild(style);
})();

/* ============ ROCKET INTERACTION ============ */
function initRocketInteraction() {
    const rocket = document.querySelector('.hero-rocket');
    if (!rocket) return;

    // Parallax tilt on mouse move
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        
        rocket.style.transform = `translate(${x}px, ${y}px) rotate(${-5 + x * 0.5}deg)`;
    });
}