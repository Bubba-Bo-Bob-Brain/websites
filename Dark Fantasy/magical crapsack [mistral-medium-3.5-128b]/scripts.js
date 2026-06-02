// ===== DOM Elements =====
const miseryFill = document.getElementById('misery-fill');
const miseryValue = document.getElementById('misery-value');
const increaseMiseryBtn = document.getElementById('increase-misery');

const cursesContainer = document.getElementById('curses-container');
const addCurseBtn = document.getElementById('add-curse');

const ritualCountdown = document.getElementById('ritual-countdown');

// ===== Misery Meter =====
let miseryLevel = 0;

function updateMiseryMeter() {
    miseryFill.style.width = `${miseryLevel}%`;
    miseryValue.textContent = `${miseryLevel}%`;

    // Change color based on misery level
    if (miseryLevel < 30) {
        miseryFill.style.background = 'linear-gradient(90deg, #8b0000, #4b0082)';
    } else if (miseryLevel < 70) {
        miseryFill.style.background = 'linear-gradient(90deg, #4b0082, #000000)';
    } else {
        miseryFill.style.background = 'linear-gradient(90deg, #000000, #8b0000)';
    }

    // Add screen shake effect at high misery
    if (miseryLevel >= 90) {
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 500);
    }
}

increaseMiseryBtn.addEventListener('click', () => {
    miseryLevel = Math.min(miseryLevel + 10, 100);
    updateMiseryMeter();

    // Play a subtle sound effect (placeholder for future audio)
    console.log('The realm suffers...');
});

// Initialize misery meter
updateMiseryMeter();

// ===== Curse Tracker =====
const curseNames = [
    "Plague of Whispers", "Shadow Rot", "The Weeping Blight",
    "Blood Moon Fever", "Hollow Veins", "Dread Miasma",
    "Soul Erosion", "The Blackened Harvest", "Flesh Melting",
    "Eternal Wailing", "Bone Brittle Curse", "Void Gaze"
];

const curseDescriptions = [
    "Victims hear voices that drive them to madness.",
    "A creeping darkness that rots flesh from the inside.",
    "Crops wither, and the land turns to dust.",
    "The afflicted bleed from their eyes and mouth.",
    "Bones turn to powder, leaving the body a shapeless mass.",
    "A thick fog that suffocates all who breathe it.",
    "Memories fade, leaving only emptiness.",
    "The harvest yields only thorns and poison.",
    "Skin sloughs off as if melted by unseen fire.",
    "The cursed emit a scream that never ends.",
    "Bones snap under the slightest pressure.",
    "Staring into the void invites the void to stare back."
];

const curseSeverities = ["Minor", "Moderate", "Severe", "Cataclysmic", "Apocalyptic"];

function generateRandomCurse() {
    const name = curseNames[Math.floor(Math.random() * curseNames.length)];
    const description = curseDescriptions[Math.floor(Math.random() * curseDescriptions.length)];
    const severity = curseSeverities[Math.floor(Math.random() * curseSeverities.length)];

    return { name, description, severity };
}

function addCurseToTracker() {
    const curse = generateRandomCurse();

    const curseCard = document.createElement('div');
    curseCard.className = 'curse-card';
    curseCard.innerHTML = `
        <div class="curse-name">${curse.name}</div>
        <div class="curse-description">${curse.description}</div>
        <div class="curse-severity">Severity: ${curse.severity}</div>
    `;

    cursesContainer.appendChild(curseCard);

    // Add a temporary highlight effect
    curseCard.style.animation = 'none';
    void curseCard.offsetWidth; // Trigger reflow
    curseCard.style.animation = 'glow-pulse 2s ease-in-out';
}

addCurseBtn.addEventListener('click', addCurseToTracker);

// Add a few initial curses
for (let i = 0; i < 3; i++) {
    addCurseToTracker();
}

// ===== Dark Ritual Calendar =====
const ritualEvents = [
    { name: "Eclipse of the Hollow Moon", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), description: "When the moon turns black, the dead rise to claim the living." },
    { name: "Feast of the Ravenous", date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), description: "A night where the hungry earth consumes all." },
    { name: "Day of Shattered Veils", date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), description: "The barrier between life and death crumbles." },
    { name: "The Great Unraveling", date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), description: "The fabric of reality tears apart." }
];

function updateRitualCountdown() {
    const now = new Date();
    const nextRitual = ritualEvents[0];

    const timeDiff = nextRitual.date - now;

    if (timeDiff <= 0) {
        // Move to the next ritual if the current one has passed
        ritualEvents.shift();
        if (ritualEvents.length > 0) {
            updateRitualCountdown();
        } else {
            ritualCountdown.textContent = "The end has come.";
        }
        return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    ritualCountdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Update countdown every second
setInterval(updateRitualCountdown, 1000);
updateRitualCountdown(); // Initialize

// ===== Cursed Artifacts =====
const artifactCards = document.querySelectorAll('.artifact-card');

artifactCards.forEach(card => {
    card.addEventListener('click', () => {
        const artifactName = card.querySelector('.artifact-name').textContent;
        alert(`You dare to wield ${artifactName}? Foolish mortal...`);
    });
});

// ===== Atmospheric Effects =====
// Randomly flicker the background lights
function randomFlicker() {
    const flickerElements = document.querySelectorAll('.flickering-lights');
    flickerElements.forEach(element => {
        element.style.animationDuration = `${2 + Math.random() * 2}s`;
    });
}

setInterval(randomFlicker, 5000);

// Add a subtle shake effect for high misery
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    @keyframes glow-pulse {
        0%, 100% { box-shadow: 0 0 5px rgba(139, 0, 0, 0.5); }
        50% { box-shadow: 0 0 20px rgba(139, 0, 0, 0.8); }
    }
`;
document.head.appendChild(style);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('The Blighted Realm awakes...');
});