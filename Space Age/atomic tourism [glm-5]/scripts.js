document.addEventListener('DOMContentLoaded', function() {
    
    initStarfield();
    initHeaderScroll();
    initParallaxPlanets();
    initAnimatedCounters();
    initDestinationCards();
    initFlightBoard();
    initSmoothScroll();
    initFormValidation();
    initScrollAnimations();
    
});

function initStarfield() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;
    
    const starCount = 150;
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 2;
        
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            opacity: ${Math.random() * 0.5 + 0.3};
        `;
        
        fragment.appendChild(star);
    }
    
    starfield.appendChild(fragment);
    
    const hero = document.querySelector('.hero');
    if (hero) {
        for (let i = 0; i < 30; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.cssText = `
                position: absolute;
                width: ${Math.random() * 100 + 50}px;
                height: 2px;
                background: linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                transform: rotate(-45deg);
                opacity: 0;
                animation: shootingStar ${Math.random() * 3 + 5}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            hero.appendChild(shootingStar);
        }
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shootingStar {
            0% {
                opacity: 0;
                transform: rotate(-45deg) translateX(-100px);
            }
            5% {
                opacity: 1;
            }
            15% {
                opacity: 0;
                transform: rotate(-45deg) translateX(300px);
            }
            100% {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
}

function initParallaxPlanets() {
    const parallaxSection = document.getElementById('parallaxSection');
    if (!parallaxSection) return;
    
    const layers = parallaxSection.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', function() {
        const rect = parallaxSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const maxOffset = 100;
            
            layers.forEach((layer, index) => {
                const depth = (index + 1) * 0.3;
                const yOffset = (scrollProgress - 0.5) * maxOffset * depth;
                layer.style.transform = `translateY(${yOffset}px)`;
            });
        }
    }, { passive: true });
}

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
}

function initDestinationCards() {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach(card => {
        const luggageTag = card.querySelector('.luggage-tag');
        if (!luggageTag) return;
        
        let isFlipped = false;
        let flipTimeout = null;
        
        card.addEventListener('mouseenter', function() {
            if (flipTimeout) {
                clearTimeout(flipTimeout);
                flipTimeout = null;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            flipTimeout = setTimeout(() => {
                luggageTag.style.transform = '';
            }, 300);
        });
    });
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const luggageTag = card.querySelector('.luggage-tag');
            if (luggageTag) {
                luggageTag.style.transform = luggageTag.style.transform === 'rotateY(180deg)' ? '' : 'rotateY(180deg)';
            }
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .destination-card:hover .luggage-tag {
            transform: rotateY(180deg);
        }
        @media (hover: none) {
            .destination-card:hover .luggage-tag {
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}

function initFlightBoard() {
    const flightRows = document.querySelectorAll('.flight-row');
    if (flightRows.length === 0) return;
    
    flightRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background 0.3s ease';
        row.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                flightRows.forEach(row => {
                    row.style.opacity = '1';
                    row.style.transform = 'translateY(0)';
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.2 });
    
    const boardBody = document.querySelector('.board-body');
    if (boardBody) {
        observer.observe(boardBody);
    }
    
    setInterval(function() {
        const statusCells = document.querySelectorAll('.flight-status.status-boarding');
        statusCells.forEach(cell => {
            cell.style.animation = 'none';
            cell.offsetHeight;
            cell.style.animation = 'statusPulse 2s ease-in-out infinite';
        });
    }, 5000);
    
    setInterval(function() {
        const timeValues = document.querySelectorAll('.time-value');
        timeValues.forEach(timeValue => {
            const currentTime = timeValue.textContent;
            const hours = parseInt(currentTime.split(':')[0], 10);
            const minutes = parseInt(currentValue.split(':')[1] || '00', 10);
            
            if (Math.random() > 0.95) {
                const blinkDuration = 150;
                timeValue.style.opacity = '0';
                setTimeout(() => {
                    timeValue.style.opacity = '1';
                }, blinkDuration);
            }
        });
    }, 3000);
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initFormValidation() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        let isValid = true;
        const requiredFields = ['name', 'email', 'destination'];
        
        requiredFields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (!input.value.trim()) {
                isValid = false;
                showFieldError(input, 'This field is required');
            } else {
                clearFieldError(input);
            }
        });
        
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                showFieldError(emailInput, 'Please enter a valid telex address');
            }
        }
        
        if (isValid) {
            showSuccessMessage(form, data);
        }
    });
    
    function showFieldError(input, message) {
        clearFieldError(input);
        
        input.style.borderColor = 'var(--coral)';
        
        const error = document.createElement('span');
        error.className = 'field-error';
        error.textContent = message;
        error.style.cssText = `
            display: block;
            font-size: 12px;
            color: var(--coral);
            margin-top: 4px;
            font-family: var(--font-heading);
            letter-spacing: 1px;
        `;
        
        input.parentNode.appendChild(error);
    }
    
    function clearFieldError(input) {
        input.style.borderColor = '';
        const error = input.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    }
    
    function showSuccessMessage(form, data) {
        const successOverlay = document.createElement('div');
        successOverlay.className = 'success-overlay';
        successOverlay.innerHTML = `
            <div class="success-content">
                <div class="success-icon">🚀</div>
                <h3>Request Received!</h3>
                <p>Thank you, ${data.name}! Our space travel consultants will contact you at ${data.email} within 48 hours to discuss your ${data.destination} adventure.</p>
                <div class="success-decoration">
                    <span>✦</span>
                    <span>The Future Awaits</span>
                    <span>✦</span>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.success-overlay').remove()">
                    Continue Exploring
                </button>
            </div>
        `;
        
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 14, 20, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .success-content {
                text-align: center;
                padding: 50px;
                background: linear-gradient(135deg, var(--navy) 0%, var(--space-black) 100%);
                border: 4px solid var(--turquoise);
                border-radius: 30px;
                max-width: 500px;
                animation: scaleIn 0.5s ease 0.2s both;
            }
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .success-icon {
                font-size: 64px;
                margin-bottom: 20px;
                animation: rocketBounce 1s ease infinite;
            }
            @keyframes rocketBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .success-content h3 {
                font-family: var(--font-display);
                font-size: 32px;
                color: var(--turquoise-light);
                margin-bottom: 16px;
            }
            .success-content p {
                color: var(--cream);
                opacity: 0.9;
                line-height: 1.6;
                margin-bottom: 24px;
            }
            .success-decoration {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
                color: var(--gold);
                font-family: var(--font-heading);
                font-size: 12px;
                letter-spacing: 2px;
                margin-bottom: 24px;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(successOverlay);
        form.reset();
    }
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            clearFieldError(this);
        });
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .amenity-card, .testimonial-card, .mascot-wrapper, .booking-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    const heroRocket = document.querySelector('.hero-rocket');
    if (heroRocket) {
        heroRocket.style.opacity = '0';
        heroRocket.style.transform = 'translateY(50px)';
        heroRocket.style.transition = 'opacity 1s ease 0.5s, transform 1s ease 0.5s';
        
        setTimeout(() => {
            heroRocket.style.opacity = '1';
            heroRocket.style.transform = 'translateY(0)';
        }, 100);
    }
}

function initRocketHover() {
    const rocket = document.querySelector('.hero-rocket');
    if (!rocket) return;
    
    rocket.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        this.style.transform = 'translateY(-20px)';
    });
    
    rocket.addEventListener('mouseleave', function() {
        this.style.animation = 'rocketFloat 8s ease-in-out infinite';
        this.style.transform = '';
    });
}

document.addEventListener('mousemove', function(e) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const rect = hero.getBoundingClientRect();
    if (e.clientY > rect.bottom) return;
    
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    const rocket = document.querySelector('.hero-rocket');
    if (rocket) {
        rocket.style.transform = `translate(${x}px, ${y}px)`;
    }
});

(function initTypewriterEffect() {
    const mottoText = document.querySelector('.motto-text');
    if (!mottoText) return;
    
    const originalText = mottoText.textContent;
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeText(mottoText, originalText);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(mottoText);
    
    function typeText(element, text) {
        element.textContent = '';
        let index = 0;
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50);
            }
        }
        
        type();
    }
})();

(function initParallaxStars() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const stars = starfield.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            const speed = (index % 3 + 1) * 0.1;
            const yOffset = scrollY * speed;
            star.style.transform = `translateY(${yOffset}px)`;
        });
    }, { passive: true });
})();

(function initAtomAnimation() {
    const atoms = document.querySelectorAll('.logo-atom, .footer-atom');
    
    atoms.forEach(atom => {
        atom.addEventListener('mouseenter', function() {
            const orbits = this.querySelectorAll('.atom-orbit');
            orbits.forEach(orbit => {
                orbit.style.animationDuration = '1s';
            });
        });
        
        atom.addEventListener('mouseleave', function() {
            const orbits = this.querySelectorAll('.atom-orbit');
            orbits.forEach((orbit, index) => {
                orbit.style.animationDuration = '4s';
            });
        });
    });
})();

console.log('%c🚀 Cosmic Cruises - The Future is Now! ✦', 
    'font-family: monospace; font-size: 16px; color: #20B2AA; background: #0A0E14; padding: 10px 20px; border: 2px solid #D4A017; border-radius: 10px;');