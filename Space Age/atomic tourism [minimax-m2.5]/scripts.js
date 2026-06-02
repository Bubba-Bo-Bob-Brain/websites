/**
 * GALACTIC HORIZONS - Space Age Tourism
 * Interactive JavaScript for 1960s Retro-Futuristic Website
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initSmoothScroll();
    initParallax();
    initScheduleBoard();
    initAnimations();
    initBookingForm();
    initCounterAnimations();
    initRocketAnimation();
    initNavActiveState();
});

/**
 * Header Scroll Effect
 */
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });
}

/**
 * Smooth Scroll Navigation
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax Effects for Planet Panorama
 */
function initParallax() {
    const parallaxSection = document.getElementById('parallax');
    if (!parallaxSection) return;
    
    const layers = parallaxSection.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const sectionTop = parallaxSection.offsetTop;
        const sectionHeight = parallaxSection.offsetHeight;
        
        // Check if section is in viewport
        if (scrollPosition > sectionTop - window.innerHeight && scrollPosition < sectionTop + sectionHeight) {
            const relativeScroll = scrollPosition - sectionTop;
            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.5;
                const yPos = relativeScroll * speed;
                layer.style.transform = `translateY(${yPos}px)`;
            });
        }
    });
}

/**
 * Schedule Board - Update Date & Simulate Real-time
 */
function initScheduleBoard() {
    const boardDate = document.getElementById('boardDate');
    if (boardDate) {
        // Set current date
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        boardDate.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Simulate real-time updates
    setInterval(() => {
        const statusDots = document.querySelectorAll('.status-dot');
        statusDots.forEach(dot => {
            if (Math.random() > 0.7) {
                // Random status change
                const statuses = ['on-time', 'delayed'];
                const currentStatus = dot.classList.contains('on-time') ? 'on-time' : 'delayed';
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                if (currentStatus !== newStatus) {
                    dot.classList.remove('on-time', 'delayed');
                    dot.classList.add(newStatus);
                }
            }
        });
        
        // Random seat updates
        const seatElements = document.querySelectorAll('.col-seats');
        seatElements.forEach(seat => {
            const text = seat.textContent;
            const match = text.match(/(\d+)\/(\d+)/);
            if (match) {
                const current = parseInt(match[1]);
                const max = parseInt(match[2]);
                if (Math.random() > 0.8 && current < max) {
                    const newValue = Math.min(current + Math.floor(Math.random() * 3), max);
                    seat.textContent = `${newValue}/${max}`;
                }
            }
        });
    }, 3000);
}

/**
 * Scroll-triggered Animations
 */
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe destination cards
    document.querySelectorAll('.destination-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Observe experience items
    document.querySelectorAll('.experience-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.5s ease ${index * 0.15}s`;
        observer.observe(item);
    });
    
    // Add CSS for animation class if not exists
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Hero elements animation
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        heroTitle.style.transition = 'all 0.8s ease';
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transition = 'all 0.8s ease 0.3s';
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
        }, 600);
    }
    
    if (heroCta) {
        heroCta.style.opacity = '0';
        heroCta.style.transition = 'all 0.8s ease 0.5s';
        setTimeout(() => {
            heroCta.style.opacity = '1';
        }, 800);
    }
}

/**
 * Booking Form Handling
 */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const destination = document.getElementById('destination').value;
        const departure = document.getElementById('departure').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const travelers = document.getElementById('travelers').value;
        const packageType = document.getElementById('package').value;
        
        // Simple validation
        if (!destination || !name || !email) {
            showNotification('Please fill in all required fields!', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>LAUNCHING...</span>';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showNotification(
                `Reservation confirmed for ${name}! We'll contact you at ${email} regarding your ${destination} adventure.`,
                'success'
            );
            form.reset();
        }, 2000);
    });
    
    // Set minimum date to today
    const dateInput = document.getElementById('departure');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

/**
 * Show Notification/Alert
 */
function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.custom-notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            font-family: 'Quicksand', sans-serif;
        }
        .notification-success .notification-content {
            background: linear-gradient(135deg, #4caf50, #2e7d32);
            color: white;
        }
        .notification-error .notification-content {
            background: linear-gradient(135deg, #ff6f61, #e55548);
            color: white;
        }
        .notification-icon {
            font-size: 1.5rem;
        }
        .notification-message {
            max-width: 300px;
            line-height: 1.4;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.3s;
        }
        .notification-close:hover {
            opacity: 1;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Number Counter Animation for Stats
 */
function initCounterAnimations() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const experienceSection = document.querySelector('.experience-section');
    if (experienceSection) {
        statsObserver.observe(experienceSection);
    }
}

function animateCounters() {
    const experienceGrid = document.querySelector('.experience-grid');
    if (!experienceGrid) return;
    
    // Check if counters already added
    if (experienceGrid.querySelector('.stat-counter')) return;
    
    // Add some visual counters
    experienceGrid.innerHTML += `
        <div class="experience-item stat-counter" style="grid-column: 1 / -1; text-align: center;">
            <div class="stats-grid" style="display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;">
                <div class="stat-item">
                    <div class="stat-number" data-target="1562">0</div>
                    <div class="stat-label">Happy Travelers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" data-target="247">0</div>
                    <div class="stat-label">Successful Launches</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" data-target="62">0</div>
                    <div class="stat-label">Years of Experience</div>
                </div>
            </div>
        </div>
    `;
    
    // Add counter styles
    const style = document.createElement('style');
    style.textContent = `
        .stat-number {
            font-family: 'Orbitron', sans-serif;
            font-size: 3rem;
            color: #FF6F61;
            font-weight: bold;
        }
        .stat-label {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1rem;
            color: #40E0D0;
            letter-spacing: 2px;
            margin-top: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    // Animate numbers
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        setTimeout(updateCounter, 500);
    });
}

/**
 * Rocket Ship Animation Enhancement
 */
function initRocketAnimation() {
    const rocket = document.getElementById('heroRocket');
    if (!rocket) return;
    
    // Add enhanced hover effect
    rocket.addEventListener('mouseenter', () => {
        rocket.style.animationPlayState = 'paused';
    });
    
    rocket.addEventListener('mouseleave', () => {
        rocket.style.animationPlayState = 'running';
    });
}

/**
 * Navigation Active State
 */
function initNavActiveState() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
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
    
    // Add active style
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: #40E0D0 !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
}