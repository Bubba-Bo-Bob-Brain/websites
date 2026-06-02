/**
 * The Gilded Age - Interactive Scripts
 * Handles particle effects, dynamic dates, and parallax interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initDateDisplay();
    initChampagneBubbles();
    initParallaxEffects();
    initScrollReveal();
});

/**
 * 1. Dynamic Date Display
 * Sets the date to a random date in the 1920s to maintain the era immersion.
 */
function initDateDisplay() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;

    const years = [1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Pick a random date in the 20s
    const randomYear = years[Math.floor(Math.random() * years.length)];
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomWeekday = days[Math.floor(Math.random() * days.length)];

    // Format: "Monday, October 24, 1925"
    const dateString = `${randomWeekday}, ${randomMonth} ${randomDay}, ${randomYear}`;
    dateElement.textContent = dateString;
}

/**
 * 2. Champagne Bubble Particle System
 * Creates rising bubbles with a golden sheen.
 */
function initChampagneBubbles() {
    const container = document.getElementById('bubble-container');
    if (!container) return;

    const bubbleCount = 40; // Number of bubbles on screen

    for (let i = 0; i < bubbleCount; i++) {
        createBubble(container);
    }
}

function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    // Randomize size, position, and animation properties
    const size = Math.random() * 8 + 4 + 'px'; // 4px to 12px
    const startX = Math.random() * 100; // 0% to 100% width
    const duration = Math.random() * 10 + 10 + 's'; // 10s to 20s rise time
    const delay = Math.random() * 20 + 's'; // Random start delay
    const opacity = Math.random() * 0.5 + 0.1;

    bubble.style.width = size;
    bubble.style.height = size;
    bubble.style.left = startX + '%';
    bubble.style.opacity = opacity;
    
    // Create the animation dynamically
    const animationName = `rise-${Math.floor(Math.random() * 1000)}`;
    const keyframes = `
        @keyframes ${animationName} {
            0% {
                transform: translateY(110vh) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: ${opacity};
            }
            80% {
                opacity: ${opacity};
            }
            100% {
                transform: translateY(-10vh) translateX(${Math.random() * 40 - 20}px);
                opacity: 0;
            }
        }
    `;

    // Inject keyframes
    const styleSheet = document.createElement('style');
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);

    bubble.style.animation = `${animationName} ${duration} linear infinite`;
    bubble.style.animationDelay = `-${delay}`; // Negative delay to start mid-animation

    container.appendChild(bubble);
}

/**
 * 3. Parallax Effects
 * Subtle movement of background elements based on scroll position.
 */
function initParallaxEffects() {
    const hero = document.querySelector('.hero-feature');
    const masthead = document.querySelector('.masthead');
    const sunburst = document.querySelector('.sunburst-bg');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Hero Parallax
        if (hero) {
            const speed = 0.2;
            hero.style.transform = `translateY(${scrollY * speed * 0.1}px)`;
        }

        // Sunburst Rotation Speed up on scroll
        if (sunburst) {
            const rotation = scrollY * 0.05;
            sunburst.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        }

        // Masthead subtle fade/scale
        if (masthead) {
            const opacity = Math.max(0, 1 - scrollY / 500);
            const scale = 1 + (scrollY * 0.0005);
            masthead.style.opacity = opacity;
            masthead.style.transform = `scale(${scale})`;
        }
    });
}

/**
 * 4. Scroll Reveal Animation
 * Fades in elements as they enter the viewport.
 */
function initScrollReveal() {
    const elements = document.querySelectorAll('.feature-card, .mini-article, .editorial-piece, .ad-box');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(el => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
}