// ===== DOM Elements =====
const revolverCylinder = document.querySelector('.revolver-cylinder');
const chambers = document.querySelectorAll('.chamber');
const contentSections = document.querySelectorAll('.content-section');
const saloonDoors = document.getElementById('saloonDoors');
const dustParticlesContainer = document.getElementById('dustParticles');
const tumbleweed = document.getElementById('tumbleweed');
const dispatchTextInput = document.querySelector('.dispatch-text');
const dispatchSubmitButton = document.querySelector('.dispatch-submit');
const dispatchLog = document.querySelector('.dispatch-log');
const ambienceAudio = document.getElementById('ambience');

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeDustParticles();
    initializeTumbleweed();
    setupRevolverNavigation();
    setupDispatchLog();
    setupAmbienceToggle();

    // Pre-generate dust particles
    createDustParticles(20);
});

// ===== Revolver Navigation =====
function setupRevolverNavigation() {
    let isSpinning = false;
    let currentActiveChamber = document.querySelector('.chamber.active');
    let currentTargetSection = currentActiveChamber.dataset.target;

    chambers.forEach(chamber => {
        chamber.addEventListener('click', () => {
            if (isSpinning) return;

            const targetSection = chamber.dataset.target;
            if (targetSection === currentTargetSection) return;

            isSpinning = true;
            currentActiveChamber.classList.remove('active');
            chamber.classList.add('active');
            currentActiveChamber = chamber;
            currentTargetSection = targetSection;

            // Spin the cylinder
            revolverCylinder.classList.add('spinning');
            revolverCylinder.style.transform = `rotate(${Math.random() * 360}deg)`;

            // Trigger saloon doors
            saloonDoors.classList.add('active');

            // Hide current section
            document.querySelector(`.content-section.active`).classList.remove('active');

            // After animation, show new section and reset
            setTimeout(() => {
                revolverCylinder.classList.remove('spinning');
                saloonDoors.classList.remove('active');
                document.getElementById(targetSection).classList.add('active');
                isSpinning = false;
            }, 1000);
        });
    });
}

// ===== Dust Particles =====
function initializeDustParticles() {
    window.addEventListener('resize', () => {
        dustParticlesContainer.innerHTML = '';
        createDustParticles(20);
    });
}

function createDustParticles(count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';

        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;

        // Random size
        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random animation duration
        const duration = Math.random() * 10 + 10;
        particle.style.animationDuration = `${duration}s`;

        // Random delay
        const delay = Math.random() * 15;
        particle.style.animationDelay = `${delay}s`;

        dustParticlesContainer.appendChild(particle);
    }
}

// ===== Tumbleweed =====
function initializeTumbleweed() {
    // Randomize initial position
    resetTumbleweedPosition();

    // Reset position after animation completes
    tumbleweed.addEventListener('animationend', resetTumbleweedPosition);
}

function resetTumbleweedPosition() {
    const startX = -50;
    const startY = Math.random() * 100 + 100; // Start below viewport
    const endX = window.innerWidth + 50;
    const endY = Math.random() * -50 - 50; // End above viewport

    tumbleweed.style.left = `${startX}px`;
    tumbleweed.style.top = `${startY}px`;
    tumbleweed.style.animation = `none`;
    tumbleweed.offsetHeight; // Trigger reflow
    tumbleweed.style.animation = `tumbleweedDrift 30s linear infinite`;

    // Random size
    const size = Math.random() * 20 + 30;
    tumbleweed.style.width = `${size}px`;
    tumbleweed.style.height = `${size}px`;
}

// ===== Dispatch Log =====
function setupDispatchLog() {
    dispatchSubmitButton.addEventListener('click', addDispatchEntry);
    dispatchTextInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addDispatchEntry();
    });
}

function addDispatchEntry() {
    const text = dispatchTextInput.value.trim();
    if (!text) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-time">${timeString}</span>
        <span class="log-text">${text}</span>
    `;

    dispatchLog.prepend(entry);
    dispatchTextInput.value = '';

    // Scroll to top
    dispatchLog.scrollTop = 0;

    // Limit entries to 10
    if (dispatchLog.children.length > 10) {
        dispatchLog.removeChild(dispatchLog.lastChild);
    }
}

// ===== Ambience Toggle =====
function setupAmbienceToggle() {
    // Create a toggle button for ambience
    const ambienceToggle = document.createElement('button');
    ambienceToggle.className = 'ambience-toggle';
    ambienceToggle.innerHTML = '🔇';
    ambienceToggle.title = 'Toggle Old West Ambience';

    // Style the button
    ambienceToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--wood-dark);
        color: var(--parchment);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: var(--shadow-soft);
        z-index: 1000;
        transition: transform 0.3s ease;
    `;

    ambienceToggle.addEventListener('mouseenter', () => {
        ambienceToggle.style.transform = 'scale(1.1)';
    });

    ambienceToggle.addEventListener('mouseleave', () => {
        ambienceToggle.style.transform = 'scale(1)';
    });

    // Toggle ambience
    let isPlaying = false;
    ambienceToggle.addEventListener('click', () => {
        if (isPlaying) {
            ambienceAudio.pause();
            ambienceToggle.innerHTML = '🔇';
        } else {
            // In a real implementation, you'd set the src to an actual audio file
            // For this demo, we'll just toggle the icon
            ambienceToggle.innerHTML = '🔊';
        }
        isPlaying = !isPlaying;
    });

    document.body.appendChild(ambienceToggle);
}

// ===== Poster Curl Enhancement =====
document.querySelectorAll('.wanted-poster').forEach(poster => {
    // Add subtle 3D curl on hover
    poster.addEventListener('mouseenter', () => {
        poster.style.transform = 'rotate(-2deg) scale(1.02) perspective(1000px) rotateX(5deg)';
    });

    poster.addEventListener('mouseleave', () => {
        poster.style.transform = 'rotate(-2deg)';
    });
});

// ===== Parallax Effect for Posters =====
document.addEventListener('mousemove', (e) => {
    const posters = document.querySelectorAll('.wanted-poster');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    posters.forEach((poster, index) => {
        const offsetX = (x - 0.5) * 10 * (index % 2 === 0 ? 1 : -1);
        const offsetY = (y - 0.5) * 10 * (index % 3 === 0 ? 1 : -1);
        poster.style.transform = `rotate(-2deg) translate(${offsetX}px, ${offsetY}px)`;
    });
});

// ===== Random Dispatch Messages =====
const randomMessages = [
    "Black Jack McCoy spotted buying whiskey at the saloon.",
    "Maria Vasquez seen riding east with a group of armed men.",
    "Stagecoach robbed near Deadwood. Suspect: Jeremiah Dawson.",
    "New bounty posted: $1,000 for 'Quick Draw' McGraw.",
    "Tumbleweed sighting near the livery stable. (Again.)",
    "Sheriff's posse heading out at dawn. Bring your own bullets.",
    "Wanted poster for 'One-Eyed' Pete torn down. Suspicious.",
    "Rumor: The Snake River Boys are planning a bank heist.",
    "Local blacksmith reports stolen horses. Check the canyon.",
    "The Vasquez Cartel has been quiet. Too quiet."
];

// Add a random message every 30 seconds
setInterval(() => {
    if (dispatchLog.children.length >= 10) return;
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-time">${timeString}</span>
        <span class="log-text">${randomMessages[randomIndex]}</span>
    `;

    dispatchLog.prepend(entry);
    dispatchLog.scrollTop = 0;
}, 30000);

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Press 'R' to spin the revolver randomly
    if (e.key === 'r' || e.key === 'R') {
        const randomChamber = Math.floor(Math.random() * chambers.length);
        chambers[randomChamber].click();
    }
});