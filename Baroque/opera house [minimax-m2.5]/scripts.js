/* =====================================================
TEATRO DELL'OPERA BAROCCA - SCRIPTS.JS
Season Program MDCXCV
===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    curtainReveal();
    initializeScrollAnimations();
    initializePerformers();
    initializeSeatingChart();
    initializeScrollTop();
    initializeNavigation();
    initializeEventCards();
});

/* =====================================================
VELVET CURTAIN REVEAL
===================================================== */
function curtainReveal() {
    const curtainContainer = document.querySelector('.curtain-container');
    
    // Add open class after a dramatic pause
    setTimeout(() => {
        curtainContainer.classList.add('open');
        // Remove curtain from DOM after animation completes
        setTimeout(() => {
            curtainContainer.style.opacity = '0';
            curtainContainer.style.transition = 'opacity 1s ease';
        }, 2500);
    }, 800);
    
    // Add scroll-based curtain shadow effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const curtainLeft = document.querySelector('.curtain-left');
        const curtainRight = document.querySelector('.curtain-right');
        
        if (curtainLeft && curtainRight && scrollY > 50) {
            const shadowIntensity = Math.min(scrollY / 500, 0.3);
            curtainLeft.style.boxShadow = `inset -50px 0 ${shadowIntensity * 100}px rgba(0, 0, 0, ${shadowIntensity + 0.5})`;
            curtainRight.style.boxShadow = `inset 50px 0 ${shadowIntensity * 100}px rgba(0, 0, 0, ${shadowIntensity + 0.5})`;
        }
    });
}

/* =====================================================
SCROLL ANIMATIONS
===================================================== */
function initializeScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Add stagger effect to children
                const children = entry.target.querySelectorAll('.event-card, .performer-card, .box, .seat');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.program-section, .performers-section, .seating-section, .visit-section').forEach(section => {
        section.classList.add('fade-section');
        observer.observe(section);
    });
    
    // Add CSS for scroll animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        .fade-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .event-card, .performer-card, .box, .seat {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
PERFORMER SPOTLIGHT EFFECTS
===================================================== */
function initializePerformers() {
    const performers = document.querySelectorAll('.performer-card');
    const spotlights = document.querySelectorAll('.spotlight');
    
    performers.forEach(performer => {
        performer.addEventListener('mouseenter', function() {
            // Get performer position
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const containerWidth = document.querySelector('.performers-stage').offsetWidth;
            
            // Adjust spotlight position
            const percent = (centerX / containerWidth) * 100;
            
            spotlights.forEach((spotlight, index) => {
                spotlight.style.opacity = '1';
                spotlight.style.left = `${percent}%`;
                spotlight.style.transform = `translateX(-50%) rotate(${(index - 1) * 10}deg)`;
                spotlight.style.transition = 'all 0.5s ease';
            });
        });
        
        performer.addEventListener('mouseleave', function() {
            spotlights.forEach((spotlight, index) => {
                spotlight.style.opacity = '0';
                spotlight.style.transition = 'opacity 0.3s ease';
            });
        });
    });
    
    // Add dramatic entrance for featured performer
    const featuredPerformer = document.querySelector('.performer-card.featured');
    if (featuredPerformer) {
        setTimeout(() => {
            featuredPerformer.classList.add('featured-entrance');
        }, 1500);
    }
}

/* =====================================================
SEATING CHART INTERACTIVITY
===================================================== */
function initializeSeatingChart() {
    const seats = document.querySelectorAll('.seat');
    const boxes = document.querySelectorAll('.box');
    const tooltip = createTooltip();
    
    seats.forEach(seat => {
        seat.addEventListener('mouseenter', function(e) {
            const seatId = this.dataset.seat;
            const type = 'Platea';
            const price = '12 Ducati';
            showTooltip(e, `${type} - ${seatId.toUpperCase()}`, price);
            this.classList.add('hovered');
        });
        
        seat.addEventListener('mouseleave', function() {
            hideTooltip();
            this.classList.remove('hovered');
        });
        
        seat.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateSelectedCount();
        });
    });
    
    boxes.forEach(box => {
        box.addEventListener('mouseenter', function(e) {
            const boxNum = this.dataset.box;
            showTooltip(e, `Palco Numero ${boxNum}`, '25 Ducati');
            this.classList.add('hovered');
        });
        
        box.addEventListener('mouseleave', function() {
            hideTooltip();
            this.classList.remove('hovered');
        });
        
        box.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateSelectedCount();
        });
    });
}

function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'seating-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, #5c1010, #3d0a0a);
        border: 2px solid #f4d03f;
        padding: 10px 15px;
        border-radius: 5px;
        color: #f5e6c8;
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.9rem;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    `;
    document.body.appendChild(tooltip);
    return tooltip;
}

function showTooltip(e, title, price) {
    const tooltip = document.querySelector('.seating-tooltip');
    if (tooltip) {
        tooltip.innerHTML = `<strong>${title}</strong><br><span style="color: #f4d03f">${price}</span>`;
        tooltip.style.left = `${e.pageX + 15}px`;
        tooltip.style.top = `${e.pageY - 10}px`;
        tooltip.style.opacity = '1';
    }
}

function hideTooltip() {
    const tooltip = document.querySelector('.seating-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.seat.selected, .box.selected');
    // Could add a floating counter here if needed
}

/* =====================================================
SCROLL TO TOP BUTTON
===================================================== */
function initializeScrollTop() {
    const scrollBtn = document.getElementById('scrollTop');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Add parallax effect to button
    const header = document.querySelector('.hero-header');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        scrollBtn.style.transform = `translateY(${-scrollY * 0.1}px)`;
    });
}

/* =====================================================
NAVIGATION EFFECTS
===================================================== */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                // Add dramatic pause before scrolling
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });
    });
    
    // Add active state on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
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
            color: #f4d03f !important;
            text-shadow: 0 0 10px rgba(244, 208, 63, 0.5);
        }
        .nav-link.active::before {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
EVENT CARDS INTERACTIVITY
===================================================== */
function initializeEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        // Add 3D tilt effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
        
        // Reserve button interaction
        const reserveBtn = card.querySelector('.reserve-btn');
        if (reserveBtn) {
            reserveBtn.addEventListener('click', function() {
                // Create confirmation modal
                showReservationModal(card);
            });
        }
    });
}

/* =====================================================
RESERVATION MODAL
===================================================== */
function showReservationModal(card) {
    const eventTitle = card.querySelector('.event-title').textContent;
    const eventDate = card.querySelector('.event-date-badge .month').textContent + ' ' + card.querySelector('.event-date-badge .day').textContent;
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'reservation-modal';
    modal.style.cssText = `
        background: linear-gradient(145deg, #6b1a1a, #3d0a0a);
        border: 3px solid #f4d03f;
        padding: 40px;
        max-width: 450px;
        text-align: center;
        position: relative;
        transform: scale(0.8);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    `;
    
    // Inner border
    modal.innerHTML = `
        <div style="position:absolute;top:12px;left:12px;right:12px;bottom:12px;border:1px solid #996515;pointer-events:none;"></div>
        <h3 style="font-family:'Cinzel Decorative',serif;color:#f4d03f;font-size:1.4rem;margin-bottom:20px;text-shadow:0 0 15px rgba(212,175,55,0.3);">Prenotazione</h3>
        <p style="color:#f5e6c8;font-size:1.1rem;margin-bottom:10px;">${eventTitle}</p>
        <p style="color:#a89070;font-style:italic;margin-bottom:25px;">${eventDate}</p>
        <div style="display:flex;gap:15px;justify-content:center;">
            <button class="modal-btn confirm" style="font-family:'Cinzel Decorative',serif;padding:12px 30px;background:linear-gradient(135deg,#f4d03f,#b8860b);border:none;color:#4a0e0e;cursor:pointer;font-size:0.9rem;letter-spacing:0.1em;">Conferma</button>
            <button class="modal-btn cancel" style="font-family:'Cinzel Decorative',serif;padding:12px 30px;background:transparent;border:2px solid #996515;color:#e8dcc8;cursor:pointer;font-size:0.9rem;letter-spacing:0.1em;">Annulla</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Close handlers
    const confirmBtn = modal.querySelector('.confirm');
    const cancelBtn = modal.querySelector('.cancel');
    
    const closeModal = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => overlay.remove(), 300);
    };
    
    confirmBtn.addEventListener('click', () => {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.innerHTML = '✦ Prenotazione Effettuata ✦';
        successMsg.style.cssText = `
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            font-family:'Cinzel Decorative',serif;
            font-size:1.2rem;
            color:#f4d03f;
            text-shadow:0 0 20px rgba(212,175,55,0.5);
            opacity:0;
            animation:successFade 1.5s ease forwards;
        `;
        modal.appendChild(successMsg);
        setTimeout(closeModal, 1500);
    });
    
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    // Add success animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successFade {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
PARALLAX BACKGROUND EFFECT
===================================================== */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const pageContent = document.querySelector('.page-content');
    
    if (pageContent) {
        // Subtle parallax for background elements
        const bgElements = document.querySelectorAll('.chandelier-lights .light-beam');
        bgElements.forEach((el, index) => {
            el.style.transform = `translateY(${scrollY * (0.1 + index * 0.05)}px) rotate(${index * 5}deg)`;
        });
    }
});

/* =====================================================
RANDOM DECORATIVE PARTICLES
===================================================== */
function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.appendChild(container);
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: #d4af37;
            border-radius: 50%;
            opacity: ${Math.random() * 0.3 + 0.1};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        container.appendChild(particle);
    }
    
    // Add particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.3; }
            90% { opacity: 0.3; }
            100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
        .particle:nth-child(odd) {
            background: #f4d03f;
        }
    `;
    document.head.appendChild(style);
}

createParticles();

/* =====================================================
KEYBOARD ACCESSIBILITY
===================================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => modal.remove());
    }
    
    // Add keyboard navigation for seats
    if (e.key === 'Tab') {
        const focused = document.activeElement;
        if (focused.classList.contains('seat') || focused.classList.contains('box')) {
            focused.style.outline = '2px solid #f4d03f';
            focused.style.outlineOffset = '2px';
        }
    }
});

/* =====================================================
PERFORMANCE OPTIMIZATION
===================================================== */
// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(() => {
        // Scroll-based updates happen here
    });
});

// Lazy load images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

console.log('✦ Teatro dell\'Opera Barocca initialized ✦');