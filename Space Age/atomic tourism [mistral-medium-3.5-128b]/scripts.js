// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initCountdownTimers();
    initParallaxScrolling();
    initSmoothScrolling();
    initFormValidation();
    initStarfield();
    initCardAnimations();
});

// ===== Countdown Timers =====
function initCountdownTimers() {
    const countdownElements = document.querySelectorAll('.countdown');

    countdownElements.forEach(element => {
        const launchDate = new Date(element.dataset.launch).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            if (distance < 0) {
                element.textContent = 'LAUNCHED!';
                element.style.color = '#4CAF50'; // Green for launched
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            element.textContent = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        // Update immediately and then every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

// ===== Parallax Scrolling =====
function initParallaxScrolling() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;

        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed);
            const yPos = -(scrollPosition * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== Smooth Scrolling =====
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Form Validation =====
function initFormValidation() {
    const bookingForm = document.querySelector('.booking-form');

    if (!bookingForm) return;

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate name
        const nameInput = bookingForm.querySelector('input[type="text"]');
        if (!nameInput.value.trim()) {
            isValid = false;
            animateError(nameInput);
        }

        // Validate email
        const emailInput = bookingForm.querySelector('input[type="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            isValid = false;
            animateError(emailInput);
        }

        // Validate destination
        const destinationSelect = bookingForm.querySelector('select');
        if (!destinationSelect.value) {
            isValid = false;
            animateError(destinationSelect);
        }

        // If valid, show success (for demo purposes)
        if (isValid) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Booking confirmed! Prepare for liftoff! 🚀';
            successMessage.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(30, 144, 255, 0.9);
                color: white;
                padding: 1.5rem 2rem;
                border-radius: 10px;
                font-family: 'Bauhaus 93', sans-serif;
                font-size: 1.5rem;
                z-index: 1000;
                box-shadow: 0 0 20px rgba(30, 144, 255, 0.5);
                animation: fadeInOut 3s ease-in-out forwards;
            `;
            document.body.appendChild(successMessage);

            // Remove message after animation
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }
    });

    // Helper function for error animation
    function animateError(element) {
        element.style.animation = 'none';
        void element.offsetWidth; // Trigger reflow
        element.style.animation = 'shake 0.5s ease-in-out';
        element.style.borderColor = '#FF4444'; // Red for error
    }
}

// Add shake animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(style);

// ===== Starfield Animation =====
function initStarfield() {
    const starburstOverlay = document.querySelector('.starburst-overlay');
    if (!starburstOverlay) return;

    // Create 50 stars randomly placed
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.7 + 0.3};
            animation: twinkle ${Math.random() * 3 + 2}s infinite alternate;
        `;
        starburstOverlay.appendChild(star);
    }

    // Add twinkle animation
    const twinkleStyle = document.createElement('style');
    twinkleStyle.textContent = `
        @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(twinkleStyle);
}

// ===== Card Animations =====
function initCardAnimations() {
    const destinationCards = document.querySelectorAll('.destination-card');

    destinationCards.forEach(card => {
        // Add glow effect on hover
        card.addEventListener('mouseenter', () => {
            const tag = card.querySelector('.card-luggage-tag');
            tag.style.boxShadow = '0 0 20px rgba(30, 144, 255, 0.5)';
        });

        card.addEventListener('mouseleave', () => {
            const tag = card.querySelector('.card-luggage-tag');
            tag.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
    });
}