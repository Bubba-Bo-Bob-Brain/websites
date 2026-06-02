// ===== DOM Elements =====
const floatingElementsContainer = document.getElementById('floatingElements');
const sparkleTrailContainer = document.getElementById('sparkleTrail');
const mascot = document.getElementById('mascot');
const gachaButton = document.getElementById('gachaButton');
const gachaScreen = document.getElementById('gachaScreen');

// ===== Kawaii Character Data for Gacha =====
const characters = [
    { name: "Luffy", emoji: "🏴‍☠️", color: "#ff9aa2" },
    { name: "Naruto", emoji: "🍥", color: "#ffb7b2" },
    { name: "Goku", emoji: "🐉", color: "#f8b500" },
    { name: "Saitama", emoji: "💥", color: "#a8caba" },
    { name: "Tanjiro", emoji: "⚔️", color: "#e43f6f" },
    { name: "Deku", emoji: "🦸", color: "#4b6cb7" },
    { name: "Anyu", emoji: "👽", color: "#ff758c" },
    { name: "Rem", emoji: "💙", color: "#b8255f" },
    { name: "Zero Two", emoji: "🦄", color: "#ff7eb3" },
    { name: "Miku", emoji: "🎤", color: "#5d4e75" }
];

// ===== Floating Elements Generator =====
function createFloatingElement() {
    const elementTypes = ['heart', 'bubble', 'star'];
    const elementType = elementTypes[Math.floor(Math.random() * elementTypes.length)];

    const element = document.createElement('div');
    element.className = `floating-element ${elementType}`;

    // Random position
    element.style.left = `${Math.random() * 100}%`;
    element.style.top = `${Math.random() * 100}%`;

    // Random size
    const size = Math.random() * 1.5 + 0.5;
    element.style.fontSize = `${size}rem`;
    element.style.width = `${size * 1.5}rem`;
    element.style.height = `${size * 1.5}rem`;

    // Random animation duration
    element.style.animationDuration = `${Math.random() * 3 + 2}s`;
    element.style.animationDelay = `${Math.random() * 2}s`;

    // Add heart/bubble/star symbol
    if (elementType === 'heart') {
        element.textContent = '❤';
    } else if (elementType === 'star') {
        element.textContent = '✧';
    }

    floatingElementsContainer.appendChild(element);

    // Remove element after animation
    setTimeout(() => {
        element.remove();
    }, 5000);
}

// Generate floating elements periodically
setInterval(createFloatingElement, 1000);

// Initial batch of floating elements
for (let i = 0; i < 10; i++) {
    setTimeout(createFloatingElement, i * 500);
}

// ===== Sparkle Trail (Follows Cursor) =====
document.addEventListener('mousemove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    // Position sparkle at cursor
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;

    // Random color
    const colors = ['#ff69b4', '#b19cd9', '#66cdaa', '#ffd1dc'];
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];

    sparkleTrailContainer.appendChild(sparkle);

    // Remove sparkle after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
});

// ===== Bouncing Mascot (Follows Cursor) =====
let mascotX = 0;
let mascotY = 0;
let targetX = 0;
let targetY = 0;
const mascotSpeed = 0.1;

function updateMascotPosition() {
    // Smoothly move mascot towards cursor
    mascotX += (targetX - mascotX) * mascotSpeed;
    mascotY += (targetY - mascotY) * mascotSpeed;

    mascot.style.transform = `translate(${mascotX}px, ${mascotY}px)`;
    requestAnimationFrame(updateMascotPosition);
}

// Start mascot movement
updateMascotPosition();

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX - mascot.offsetWidth / 2;
    targetY = e.clientY - mascot.offsetHeight / 2;
});

// Randomly change mascot expression
setInterval(() => {
    const expressions = ['(◕‿◕✿)', '(◠‿◠✿)', '(◕ω◕)', '(｡♥‿♥｡)', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧'];
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    mascot.querySelector('.chibi-character').textContent = randomExpression;
}, 3000);

// ===== Gacha Machine Logic =====
gachaButton.addEventListener('click', () => {
    // Disable button during animation
    gachaButton.disabled = true;
    gachaButton.textContent = 'Pulling...';

    // Shake animation
    gachaScreen.style.animation = 'shake 0.5s ease-in-out';

    // Clear previous character
    gachaScreen.innerHTML = '<div class="gacha-placeholder">???</div>';

    // Simulate "pulling" delay
    setTimeout(() => {
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

        // Create character reveal
        const characterElement = document.createElement('div');
        characterElement.className = 'gacha-character';
        characterElement.innerHTML = `
            <div class="gacha-emoji" style="font-size: 4rem;">${randomCharacter.emoji}</div>
            <div class="gacha-name" style="color: ${randomCharacter.color};">${randomCharacter.name}</div>
        `;

        gachaScreen.innerHTML = '';
        gachaScreen.appendChild(characterElement);
        gachaScreen.style.animation = 'none';
        gachaScreen.style.background = `linear-gradient(135deg, ${randomCharacter.color}, #ffffff)`;

        // Re-enable button
        gachaButton.disabled = false;
        gachaButton.textContent = 'Pull Gacha!';
    }, 1000);
});

// Add shake animation for gacha
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
    }
    .gacha-character {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        animation: fadeIn 0.5s ease-out;
    }
    .gacha-emoji {
        animation: bounce 0.5s ease-out;
    }
    .gacha-name {
        font-family: 'Yusei Magic', sans-serif;
        font-size: 1.5rem;
        margin-top: 0.5rem;
    }
`;
document.head.appendChild(style);

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.card, .chibi-guide, .hero-content p, .cta-button, .gacha-machine, .about p, .social-link').forEach(el => {
    observer.observe(el);
});

// ===== Random Pastel Background Shift =====
function shiftBackgroundColor() {
    const pastelColors = [
        'linear-gradient(135deg, #ffd1dc, #e6e6fa)',
        'linear-gradient(135deg, #e6e6fa, #d4f1f4)',
        'linear-gradient(135deg, #d4f1f4, #ffd1dc)',
        'linear-gradient(135deg, #ffdab9, #e6e6fa)',
        'linear-gradient(135deg, #cce0ff, #d4f1f4)'
    ];

    const randomGradient = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    document.body.style.background = randomGradient;
}

// Change background color every 10 seconds
setInterval(shiftBackgroundColor, 10000);

// Initial background shift
shiftBackgroundColor();

// ===== Easter Egg: Konami Code =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10); // Keep only last 10 inputs

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Trigger special effect: rain of hearts!
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createFloatingElement();
            }, i * 50);
        }

        // Change mascot to excited expression
        mascot.querySelector('.chibi-character').textContent = '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧';
    }
});