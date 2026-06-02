// ===== DOM Elements =====
const curtain = document.getElementById('curtain');
const revealButton = document.getElementById('revealButton');
const chandelierLight = document.getElementById('chandelierLight');
const seats = document.querySelectorAll('.seat');
const performerCards = document.querySelectorAll('.performer-card');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Velvet Curtain Reveal Animation =====
revealButton.addEventListener('click', () => {
    curtain.classList.add('hidden');
    revealButton.style.display = 'none';

    // Trigger chandelier light animation after curtain reveal
    setTimeout(() => {
        chandelierLight.classList.add('active');
    }, 1000);
});

// ===== Chandelier Light Flickering Effect =====
function createChandelierEffect() {
    const lightBeams = [];

    // Create 5 dynamic light beams
    for (let i = 0; i < 5; i++) {
        const beam = document.createElement('div');
        beam.className = 'light-beam';
        beam.style.position = 'absolute';
        beam.style.width = '200px';
        beam.style.height = '200px';
        beam.style.background = `radial-gradient(circle, rgba(212, 175, 55, ${0.1 + i * 0.05}) 0%, transparent 70%)`;
        beam.style.borderRadius = '50%';
        beam.style.left = `${20 + i * 20}%`;
        beam.style.top = `${10 + i * 10}%`;
        beam.style.animation = `flicker ${3 + i} 0s infinite alternate`;
        chandelierLight.appendChild(beam);
        lightBeams.push(beam);
    }

    // Animate light beams with random flickering
    setInterval(() => {
        lightBeams.forEach((beam, index) => {
            const opacity = 0.5 + Math.random() * 0.5;
            beam.style.opacity = opacity;
            beam.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
        });
    }, 200);
}

// Initialize chandelier effect
createChandelierEffect();

// ===== Seat Selection Interactivity =====
seats.forEach(seat => {
    seat.addEventListener('click', () => {
        const tier = seat.getAttribute('data-tier');
        const price = seat.getAttribute('data-price');

        // Toggle selected state
        seat.classList.toggle('selected');

        // Visual feedback
        if (seat.classList.contains('selected')) {
            seat.style.background = 'var(--gold-primary)';
            seat.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.8)';

            // Show price tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'seat-tooltip';
            tooltip.textContent = `${price} Écus`;
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'var(--gold-light)';
            tooltip.style.padding = '0.5rem';
            tooltip.style.borderRadius = '5px';
            tooltip.style.fontSize = '0.9rem';
            tooltip.style.zIndex = '1000';
            tooltip.style.left = `${seat.getBoundingClientRect().left}px`;
            tooltip.style.top = `${seat.getBoundingClientRect().top - 40}px`;
            document.body.appendChild(tooltip);

            // Remove tooltip after 2 seconds
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        } else {
            // Reset seat color based on tier
            if (tier === 'parterre') {
                seat.style.background = 'var(--gold-primary)';
            } else if (tier === 'balcony') {
                seat.style.background = 'var(--gold-light)';
            } else if (tier === 'gallery') {
                seat.style.background = 'var(--ivory)';
                seat.style.color = 'var(--velvet)';
            }
            seat.style.boxShadow = 'none';
        }
    });
});

// ===== Performer Spotlight Hover Effects =====
performerCards.forEach(card => {
    const spotlight = card.querySelector('.spotlight-overlay');

    card.addEventListener('mouseenter', () => {
        // Add subtle scale and glow
        card.style.transform = 'scale(1.02)';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.5)';

        // Animate spotlight
        spotlight.style.opacity = '1';
        spotlight.style.transition = 'opacity 0.5s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
        spotlight.style.opacity = '0';
    });
});

// ===== Smooth Scrolling for Navigation =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===== Dynamic Chandelier Light Animation (Additional Effects) =====
function animateChandelierLight() {
    const light = document.getElementById('chandelierLight');
    let angle = 0;

    setInterval(() => {
        angle += 0.01;
        const x = Math.sin(angle) * 10;
        const y = Math.cos(angle * 0.7) * 10;
        light.style.background = `
            radial-gradient(circle at ${50 + x}% ${30 + y}%, rgba(212, 175, 55, 0.15) 0%, transparent 30%),
            radial-gradient(circle at ${20 + x}% ${40 + y}%, rgba(212, 175, 55, 0.1) 0%, transparent 20%),
            radial-gradient(circle at ${80 - x}% ${20 + y}%, rgba(212, 175, 55, 0.1) 0%, transparent 20%)
        `;
    }, 100);
}

// Initialize chandelier animation
animateChandelierLight();

// ===== Add Keyframe Animations Dynamically =====
const style = document.createElement('style');
style.textContent = `
    @keyframes flicker {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    .seat.selected {
        animation: pulse 1s ease;
    }
`;
document.head.appendChild(style);

// ===== Auto-Hide Curtain After 5 Seconds (Fallback) =====
setTimeout(() => {
    if (curtain.classList.contains('hidden') === false) {
        curtain.classList.add('hidden');
        revealButton.style.display = 'none';
    }
}, 5000);