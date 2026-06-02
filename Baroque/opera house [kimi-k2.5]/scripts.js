/* ============================================ TEATRO REALE DI VERSAILLES - BAROQUE SCRIPTS ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all theatrical effects
    initCurtainReveal();
    initChandelierEffects();
    initSpotlightEffects();
    initSeatingChart();
    initSmoothNavigation();
    initScrollAnimations();
    initFormHandling();
});

/* ============================================ GRAND CURTAIN REVEAL ============================================ */

function initCurtainReveal() {
    const curtain = document.getElementById('grand-curtain');
    const seal = document.querySelector('.royal-seal');

    // Dramatic pause before reveal
    setTimeout(() => {
        // Add opening class to trigger CSS animation
        curtain.classList.add('open');

        // Remove curtain from DOM after animation
        setTimeout(() => {
            curtain.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Trigger entrance animations for hero elements
            animateHeroEntrance();
        }, 2500);
    }, 800);

    // Seal pulse animation enhancement
    if (seal) {
        seal.addEventListener('animationend', () => {
            seal.style.animation = 'none';
            setTimeout(() => {
                seal.style.animation = 'sealPulse 2s ease-in-out infinite';
            }, 100);
        });
    }
}

function animateHeroEntrance() {
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

/* ============================================ CHANDELIER EFFECTS ============================================ */

function initChandelierEffects() {
    const chandelier = document.getElementById('chandelier');
    const lightPatterns = document.getElementById('light-patterns');

    if (!chandelier) return;

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        const sway = Math.sin(scrolled * 0.002) * 10;
        chandelier.style.transform = `translateX(calc(-50% + ${sway}px)) translateY(${parallax}px)`;

        // Update light patterns based on scroll
        if (lightPatterns) {
            const opacity = 0.15 + (Math.sin(scrolled * 0.005) * 0.05);
            lightPatterns.style.opacity = opacity;
        }
    });

    // Interactive crystal reflections
    chandelier.addEventListener('mousemove', (e) => {
        const rect = chandelier.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const crystals = chandelier.querySelectorAll('.crystal-tier');

        crystals.forEach((crystal, index) => {
            const offsetX = (x - 0.5) * (10 + index * 5);
            const offsetY = (y - 0.5) * (10 + index * 5);
            crystal.style.transform = `translateX(calc(-50% + ${offsetX}px)) translateY(${offsetY}px)`;
        });
    });

    // Reset on mouse leave
    chandelier.addEventListener('mouseleave', () => {
        const crystals = chandelier.querySelectorAll('.crystal-tier');
        crystals.forEach(crystal => {
            crystal.style.transform = '';
            crystal.style.transition = 'transform 0.5s ease-out';
        });
    });
}

/* ============================================ SPOTLIGHT HOVER EFFECTS ============================================ */

function initSpotlightEffects() {
    const performers = document.querySelectorAll('.performer-profile');

    performers.forEach(profile => {
        const container = profile.querySelector('.spotlight-container');
        const spotlight = profile.querySelector('.spotlight-effect');

        if (!container || !spotlight) return;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            spotlight.style.setProperty('--mouse-x', `${x}%`);
            spotlight.style.setProperty('--mouse-y', `${y}%`);

            // Add dramatic light flare
            const intensity = 0.15 + (Math.random() * 0.1);
            spotlight.style.opacity = intensity;
        });

        container.addEventListener('mouseleave', () => {
            spotlight.style.opacity = '0';
        });
    });
}

/* ============================================ SEATING CHART INTERACTIVITY ============================================ */

function initSeatingChart() {
    const seats = document.querySelectorAll('.seat:not(.occupied), .gallery-seat:not(.occupied), .box');

    // Randomly occupy some seats for realism
    const allSeats = document.querySelectorAll('.seat, .gallery-seat');
    allSeats.forEach((seat) => {
        if (Math.random() < 0.3) {
            seat.classList.add('occupied');
            seat.title = 'Occupato';
        } else {
            seat.title = 'Disponibile - Clicca per selezionare';
        }
    });

    seats.forEach(seat => {
        seat.addEventListener('click', handleSeatClick);
        seat.addEventListener('mouseenter', handleSeatHover);
        seat.addEventListener('mouseleave', handleSeatLeave);
    });

    // Special handling for royal box
    const royalBox = document.querySelector('.royal-box');
    if (royalBox) {
        royalBox.addEventListener('click', () => {
            showToast('Palco Reale - Contattare la biglietteria per prenotazioni');
        });
        royalBox.style.cursor = 'pointer';
        royalBox.title = 'Palco Reale - Prenotazione su richiesta';
    }
}

function handleSeatClick(e) {
    const seat = e.target;
    if (seat.classList.contains('occupied')) {
        seat.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            seat.style.animation = '';
        }, 500);
        showToast('Questo posto è già occupato');
        return;
    }

    seat.classList.toggle('selected');
    const isSelected = seat.classList.contains('selected');
    seat.title = isSelected ? 'Selezionato' : 'Disponibile - Clicca per selezionare';

    createSparkle(e.clientX, e.clientY);
    updateBookingForm(seat);
}

function handleSeatHover(e) {
    const seat = e.target;
    if (!seat.classList.contains('occupied')) {
        seat.style.transform = 'translateY(-5px) scale(1.1)';
    }
}

function handleSeatLeave(e) {
    const seat = e.target;
    seat.style.transform = '';
}

function updateBookingForm(seat) {
    const seatsCount = document.querySelectorAll('.seat.selected, .gallery-seat.selected').length;
    const seatsInput = document.getElementById('seats-count');
    if (seatsInput) {
        seatsInput.value = Math.max(1, seatsCount);
    }
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-5px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

/* ============================================ SMOOTH NAVIGATION ============================================ */

function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offset = 80;
                const targetPosition = targetSection.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

/* ============================================ SCROLL ANIMATIONS ============================================ */

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                if (entry.target.classList.contains('performance-grid') || entry.target.classList.contains('performers-gallery')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0) scale(1)';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.opera-card, .performer-profile, .section-header, .booking-container, .seating-section');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
}

/* ============================================ FORM HANDLING ============================================ */

function initFormHandling() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const selectedSeats = document.querySelectorAll('.seat.selected, .gallery-seat.selected').length;
        if (selectedSeats === 0 && data.seats > 0) {
            showToast('Per favore seleziona i posti dalla mappa dei palchi', 'warning');
            document.getElementById('seating').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="button-text">Elaborazione...</span>';
        submitButton.disabled = true;

        setTimeout(() => {
            createConfetti();
            submitButton.innerHTML = '<span class="button-text">Prenotazione Confermata!</span>';
            submitButton.style.background = 'linear-gradient(to bottom, #4CAF50 0%, #2E7D32 100%)';
            showToast(`Grazie ${data.name}! La tua prenotazione per ${getOperaName(data.opera)} è stata registrata.`);

            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
                form.reset();
                document.querySelectorAll('.seat.selected, .gallery-seat.selected').forEach(seat => {
                    seat.classList.remove('selected');
                });
            }, 3000);
        }, 1500);
    });

    const operaCards = document.querySelectorAll('.opera-card');
    const operaSelect = document.getElementById('opera-select');

    operaCards.forEach(card => {
        const button = card.querySelector('.baroque-button');
        if (button) {
            button.addEventListener('click', () => {
                const performance = card.dataset.performance;
                if (operaSelect && performance) {
                    operaSelect.value = performance;
                    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
                    operaSelect.style.animation = 'pulse 0.5s ease-in-out 2';
                    setTimeout(() => {
                        operaSelect.style.animation = '';
                    }, 1000);
                }
            });
        }
    });
}

function getOperaName(value) {
    const names = {
        'aida': 'Aida',
        'tosca': 'Tosca',
        'barbiere': 'Il Barbiere di Siviglia',
        'traviata': 'La Traviata'
    };
    return names[value] || value;
}

/* ============================================ VISUAL EFFECTS ============================================ */

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #FFD700 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        border-radius: 50%;
    `;
    document.body.appendChild(sparkle);

    sparkle.animate([
        { transform: 'scale(0) rotate(0deg)', opacity: 1 },
        { transform: 'scale(2) rotate(180deg)', opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out'
    }).onfinish = () => sparkle.remove();
}

function createConfetti() {
    const colors = ['#FFD700', '#B8860B', '#F5F5DC', '#DAA520', '#8B0000'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.cssText = `
            position: fixed;
            left: ${50 + Math.random() * 50}%;
            top: 50%;
            width: ${5 + Math.random() * 10}px;
            height: ${5 + Math.random() * 10}px;
            background: ${color};
            pointer-events: none;
            z-index: 9999;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;
        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 10;

        confetti.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${vx * 20}px, ${vy * 20 + 200}px) rotate(${720 + Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

function showToast(message, type = 'success') {
    const existing = document.querySelector('.baroque-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'baroque-toast';
    const bgColor = type === 'warning' ? '#8B6914' : '#B8860B';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${bgColor};
        color: #2d0000;
        padding: 15px 40px;
        font-family: Cinzel Decorative, cursive;
        font-size: 0.9rem;
        border: 2px solid #FFD700;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        z-index: 10000;
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 90%;
        text-align: center;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

/* ============================================ CANDLE FLICKER ENHANCEMENT ============================================ */

function enhanceCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle) => {
        setInterval(() => {
            const flame = candle.querySelector('.flame');
            if (flame && Math.random() > 0.7) {
                const intensity = 0.8 + Math.random() * 0.4;
                flame.style.transform = `translateX(-50%) scale(${intensity}) rotate(${Math.random() * 4 - 2}deg)`;
            }
        }, 100 + Math.random() * 200);
    });
}

enhanceCandles();

/* ============================================ KEYBOARD NAVIGATION ============================================ */

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const toast = document.querySelector('.baroque-toast');
        if (toast) toast.remove();
    }

    if (e.key.startsWith('Arrow')) {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        if (selectedSeats.length > 0) {
            const lastSelected = selectedSeats[selectedSeats.length - 1];
            const currentRow = lastSelected.parentElement;
            let targetSeat;

            if (e.key === 'ArrowRight') {
                targetSeat = lastSelected.nextElementSibling;
            } else if (e.key === 'ArrowLeft') {
                targetSeat = lastSelected.previousElementSibling;
            } else if (e.key === 'ArrowDown') {
                const nextRow = currentRow.nextElementSibling;
                if (nextRow) targetSeat = nextRow.querySelector('.seat');
            } else if (e.key === 'ArrowUp') {
                const prevRow = currentRow.previousElementSibling;
                if (prevRow) targetSeat = prevRow.querySelector('.seat');
            }

            if (targetSeat && !targetSeat.classList.contains('occupied')) {
                targetSeat.click();
                targetSeat.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
});

/* ============================================ CONSOLE EASTER EGG ============================================ */

console.log('%c🎭 Teatro Reale di Versailles', 'color: #FFD700; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px #000;');
console.log('%cBenvenuti alla stagione operistica 2024-2025', 'color: #DAA520; font-size: 12px;');