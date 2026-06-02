// ===== DOM Elements =====
const dayNightToggle = document.getElementById('dayNightToggle');
const locationTooltip = document.getElementById('locationTooltip');
const heroText = document.querySelector('.old-english');
const mapHotspots = document.querySelectorAll('.map-hotspot');
const body = document.body;
const tollingBell = document.querySelector('.bell');

// ===== Day/Night Cycle Toggle =====
let isNight = false;

dayNightToggle.addEventListener('click', () => {
    isNight = !isNight;
    body.setAttribute('data-theme', isNight ? 'night' : 'day');
    dayNightToggle.textContent = isNight ? '☀️ Day' : '🌙 Night';

    // Play tolling bell sound on theme switch
    playBellSound();
});

// ===== Map Tooltip System =====
const locationDescriptions = {
    'Village': 'The humble village of Eldermere. A place of toil and simple pleasures.',
    'Castle': 'The fortress of Lord Blackthorn. Rumored to hold dark secrets within its walls.',
    'Forest': 'The Whispering Woods. A place of ancient magic and hidden dangers.',
    'Dark Woods': 'Beware the Dark Woods. None who enter return unchanged.'
};

mapHotspots.forEach(hotspot => {
    hotspot.addEventListener('mouseenter', (e) => {
        const location = hotspot.getAttribute('data-location');
        const description = locationDescriptions[location] || 'A mysterious location...';

        locationTooltip.textContent = `${location}: ${description}`;
        locationTooltip.style.opacity = '1';

        // Position tooltip near the cursor
        const rect = hotspot.getBoundingClientRect();
        locationTooltip.style.left = `${rect.left + rect.width / 2 - locationTooltip.offsetWidth / 2}px`;
        locationTooltip.style.top = `${rect.top - locationTooltip.offsetHeight - 10}px`;
    });

    hotspot.addEventListener('mouseleave', () => {
        locationTooltip.style.opacity = '0';
    });
});

// ===== Typewriter Effect for Hero Text =====
function typeWriter(text, element, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Apply typewriter effect to hero text
const originalHeroText = heroText.textContent;
typeWriter(originalHeroText, heroText, 30);

// ===== Tolling Bell Sound Effect =====
function playBellSound() {
    // Create an audio context for a simple bell sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.5); // Drop to A3

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Visual feedback for the bell toll
    tollingBell.style.transform = 'rotate(-15deg)';
    setTimeout(() => {
        tollingBell.style.transform = 'rotate(15deg)';
    }, 150);
    setTimeout(() => {
        tollingBell.style.transform = 'rotate(0deg)';
    }, 300);
}

// ===== Parallax Effect for Pixel Grid Overlay =====
const pixelGrid = document.querySelector('.pixel-grid-overlay');

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    pixelGrid.style.transform = `translateY(${scrollPosition * 0.1}px)`;
});

// ===== Initialize Theme on Load =====
// Check for saved theme preference or default to day
const savedTheme = localStorage.getItem('darkAgesTheme') || 'day';
body.setAttribute('data-theme', savedTheme);
dayNightToggle.textContent = savedTheme === 'night' ? '☀️ Day' : '🌙 Night';
isNight = savedTheme === 'night';

// ===== Save Theme Preference =====
dayNightToggle.addEventListener('click', () => {
    localStorage.setItem('darkAgesTheme', isNight ? 'night' : 'day');
});

// ===== Random Ambient Sounds (Optional) =====
// Uncomment to enable subtle ambient sounds (e.g., wind, distant bells)
// setInterval(() => {
//     if (Math.random() > 0.7) {
//         playBellSound();
//     }
// }, 10000);