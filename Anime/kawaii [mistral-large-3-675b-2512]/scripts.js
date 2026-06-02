// ===== MASCOT COMPANION =====
const mascot = document.getElementById('mascot');
const speechBubble = document.getElementById('speech-bubble');
const interactiveElements = document.querySelectorAll('.gacha-button, .read-button, .watch-button, .nav-link, .card, .floating-button');

// Mascot hover reactions
if (mascot && speechBubble) {
    mascot.addEventListener('mouseenter', () => {
        speechBubble.textContent = 'Moe moe kyun! ♡';
        speechBubble.style.opacity = '1';
        mascot.style.transform = 'scale(1.1) rotate(5deg)';
    });

    mascot.addEventListener('mouseleave', () => {
        speechBubble.style.opacity = '0';
        mascot.style.transform = 'scale(1) rotate(0deg)';
    });

    // React to user interactions
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            speechBubble.textContent = getRandomMoePhrase();
            speechBubble.style.opacity = '1';
            mascot.style.transform = 'scale(1.1) rotate(-5deg)';
        });

        element.addEventListener('mouseleave', () => {
            speechBubble.style.opacity = '0';
            mascot.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Random moe phrases
function getRandomMoePhrase() {
    const phrases = ['So kawaii! ♡', 'Spin me! ✨', 'Nyanko~!', 'Click meow!', 'Moe~!', 'Ganbatte!', 'UwU'];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

// Follow mouse (optional)
if (mascot) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        mascot.style.transform = `translate(${(x - 0.5) * 20}px, ${(y - 0.5) * 20}px) scale(1)`;
    });
}

// ===== GACHA WHEEL =====
const spinButton = document.getElementById('spin-button');
const gachaWheel = document.getElementById('gacha-wheel');
const gachaItems = document.querySelectorAll('.gacha-item');
let isSpinning = false;

if (spinButton && gachaWheel && gachaItems.length > 0) {
    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        speechBubble.textContent = 'Whee~! ✨';
        speechBubble.style.opacity = '1';

        // Random spin duration (5-10s)
        const spinDuration = Math.floor(Math.random() * 5000) + 5000;
        const randomRotation = Math.floor(Math.random() * 360) + 3600;

        // Apply spin animation
        gachaWheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        gachaWheel.style.transform = `rotate(${randomRotation}deg)`;

        // Reset after spin
        setTimeout(() => {
            gachaWheel.style.transition = 'none';
            gachaWheel.style.transform = `rotate(${randomRotation % 360}deg)`;

            // Select random item
            const selectedItem = Math.floor((randomRotation % 360) / (360 / gachaItems.length));
            gachaItems[selectedItem].style.transform = 'scale(1.2)';
            gachaItems[selectedItem].style.zIndex = '10';

            // Celebration effect
            createConfetti(gachaItems[selectedItem]);
            isSpinning = false;

            // Update Moe Meter
            updateMoeMeter(20);
        }, spinDuration);
    });
}

// Confetti effect
function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${rect.left + rect.width / 2}px`;
        confetti.style.top = `${rect.top + rect.height / 2}px`;
        confetti.style.background = `hsl(${Math.random() * 360}, 80%, 70%)`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = confetti.style.width;
        confetti.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
        confetti.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1000);
    }
}

// ===== FLOATING ELEMENTS =====
function createFloatingElements() {
    const floatingElements = document.querySelector('.floating-elements');
    if (!floatingElements) return;

    for (let i = 0; i < 30; i++) {
        const element = document.createElement('div');
        const type = Math.random() > 0.66 ? 'sparkle' : Math.random() > 0.33 ? 'bubble' : 'heart';
        element.classList.add(type);

        // Random position and animation duration
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100 + 100}%`;
        element.style.animationDuration = `${Math.random() * 10 + 5}s`;
        element.style.animationDelay = `${Math.random() * 5}s`;

        // Random size for bubbles/hearts
        if (type !== 'sparkle') {
            const size = Math.random() * 15 + 10;
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
        }

        floatingElements.appendChild(element);
    }
}

createFloatingElements();

// ===== MOE METER =====
const moeFill = document.getElementById('moe-fill');
const moeMeterText = document.getElementById('moe-meter');
let moeLevel = 20;

function updateMoeMeter(amount) {
    moeLevel = Math.min(100, moeLevel + amount);
    if (moeFill) moeFill.style.width = `${moeLevel}%`;
    if (moeMeterText) moeMeterText.textContent = `${moeLevel}%`;

    // Celebrate at 100%
    if (moeLevel === 100) {
        setTimeout(() => {
            alert('MOE EXPLOSION! ✨\nYou unlocked Super Kawaii Mode!');
            document.body.style.filter = 'hue-rotate(30deg) brightness(1.2)';
        }, 500);
    }
}

// Increment Moe Meter on interactions
interactiveElements.forEach(element => {
    element.addEventListener('click', () => updateMoeMeter(5));
});

// ===== SCROLL ANIMATIONS =====
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Trigger chibi peek on cards
            const cards = entry.target.querySelectorAll('.card');
            cards.forEach(card => {
                const chibi = card.querySelector('.chibi-peek');
                if (chibi) chibi.style.animation = 'bounce 0.5s';
            });
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(section);
});

// ===== SURPRISE BUTTON =====
const surpriseButton = document.getElementById('surprise-button');
if (surpriseButton) {
    surpriseButton.addEventListener('click', () => {
        const surprises = [
            { text: 'You got a rare chibi!', image: 'assets/chibi-rare.png' },
            { text: 'Free gacha spin!', action: () => spinButton.click() },
            { text: 'Moe Meter +50%!', action: () => updateMoeMeter(50) }
        ];

        const surprise = surprises[Math.floor(Math.random() * surprises.length)];
        if (surprise.image) {
            showModal(surprise.text, surprise.image);
        } else if (surprise.action) {
            surprise.action();
        }
    });
}

// Show modal
function showModal(text, imageSrc) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${text}</h3>
            <img src="${imageSrc}" alt="Surprise">
            <button class="modal-button">Yay! ✨</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.modal-button').addEventListener('click', () => modal.remove());
}

// ===== EASTER EGGS =====
// Konami Code (↑↑↓↓←→←→BA)
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.body.classList.add('super-kawaii-mode');
            alert('SUPER KAWAII MODE ACTIVATED! ❤️');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Click sparkles
document.addEventListener('click', (e) => {
    const sparkle = document.createElement('div');
    sparkle.classList.add('click-sparkle');
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    sparkle.style.background = `hsl(${Math.random() * 360}, 80%, 70%)`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
});

// ===== CSS FOR DYNAMIC ELEMENTS =====
const style = document.createElement('style');
style.textContent = `
    .confetti {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        animation: confetti-fall 1s linear forwards;
    }
    @keyframes confetti-fall {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
    }
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    .modal-content img {
        width: 100px;
        height: 100px;
        margin: 1rem 0;
    }
    .modal-button {
        background: var(--accent-pink);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
    }
    .click-sparkle {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: click-sparkle 1s linear forwards;
    }
    @keyframes click-sparkle {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
    .super-kawaii-mode {
        animation: hue-rotate 10s infinite linear;
    }
    @keyframes hue-rotate {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);