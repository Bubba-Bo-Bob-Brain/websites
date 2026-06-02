const characterMenuItems = document.querySelectorAll('.menu-item');
const characterDossiers = document.querySelectorAll('.character-dossier');
const filterButtons = document.querySelectorAll('.filter-btn');
const miasmaSlider = document.getElementById('miasmaSlider');
const tollBellBtn = document.getElementById('tollBellBtn');
const codexContainer = document.querySelector('.codex-container');
const candleOverlay = document.querySelector('.candle-flicker-overlay');

let audioContext = null;

function initializeAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playOminousBell() {
    initializeAudio();
    if (!audioContext) return;

    const now = audioContext.currentTime;
    
    const bellOscillator = audioContext.createOscillator();
    const bellGain = audioContext.createGain();
    
    const overtoneOscillator1 = audioContext.createOscillator();
    const overtoneGain1 = audioContext.createGain();
    
    const overtoneOscillator2 = audioContext.createOscillator();
    const overtoneGain2 = audioContext.createGain();

    bellOscillator.type = 'sine';
    bellOscillator.frequency.setValueAtTime(80, now); 
    bellOscillator.frequency.exponentialRampToValueAtTime(78, now + 4);

    overtoneOscillator1.type = 'triangle';
    overtoneOscillator1.frequency.setValueAtTime(120, now); 
    
    overtoneOscillator2.type = 'sawtooth';
    overtoneOscillator2.frequency.setValueAtTime(200, now); 

    bellGain.gain.setValueAtTime(0.5, now);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

    overtoneGain1.gain.setValueAtTime(0.2, now);
    overtoneGain1.gain.exponentialRampToValueAtTime(0.001, now + 3);

    overtoneGain2.gain.setValueAtTime(0.1, now);
    overtoneGain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);

    bellOscillator.connect(bellGain);
    overtoneOscillator1.connect(overtoneGain1);
    overtoneOscillator2.connect(overtoneGain2);

    bellGain.connect(filter);
    overtoneGain1.connect(filter);
    overtoneGain2.connect(filter);

    filter.connect(audioContext.destination);

    bellOscillator.start(now);
    overtoneOscillator1.start(now);
    overtoneOscillator2.start(now);

    bellOscillator.stop(now + 5);
    overtoneOscillator1.stop(now + 4);
    overtoneOscillator2.stop(now + 2);
}

function switchCharacter(characterId) {
    characterDossiers.forEach(dossier => {
        dossier.classList.remove('active');
    });

    characterMenuItems.forEach(item => {
        item.classList.remove('active');
    });

    const targetDossier = document.getElementById(`dossier-${characterId}`);
    if (targetDossier) {
        targetDossier.classList.add('active');
    }

    const targetMenuItem = document.querySelector(`.menu-item[data-char="${characterId}"]`);
    if (targetMenuItem) {
        targetMenuItem.classList.add('active');
    }
}

function filterSouls(category) {
    characterMenuItems.forEach(item => {
        const characterClass = item.getAttribute('data-class');
        if (category === 'all' || characterClass === category) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });

    const activeItem = document.querySelector('.menu-item.active');
    if (activeItem && activeItem.classList.contains('hidden')) {
        const firstVisible = document.querySelector('.menu-item:not(.hidden)');
        if (firstVisible) {
            const newCharId = firstVisible.getAttribute('data-char');
            switchCharacter(newCharId);
        }
    }
}

function triggerTollEffects() {
    playOminousBell();

    codexContainer.style.animation = 'none';
    void codexContainer.offsetWidth; 
    codexContainer.style.animation = 'shakeHeavy 0.8s cubic-bezier(.36,.07,.19,.97) both';

    candleOverlay.style.animation = 'none';
    void candleOverlay.offsetWidth;
    candleOverlay.style.animation = 'bloodFlash 1.5s ease-out forwards';

    setTimeout(() => {
        candleOverlay.style.animation = 'flicker 4s infinite alternate';
    }, 1500);
}

characterMenuItems.forEach(item => {
    item.addEventListener('click', () => {
        const characterId = item.getAttribute('data-char');
        switchCharacter(characterId);
    });
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');
        filterSouls(filterValue);
    });
});

miasmaSlider.addEventListener('input', (event) => {
    const value = event.target.value;
    const normalizedValue = value / 100;
    document.documentElement.style.setProperty('--miasma-opacity', normalizedValue);
});

tollBellBtn.addEventListener('click', () => {
    triggerTollEffects();
});

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shakeHeavy {
    10%, 90% { transform: translate3d(-4px, 2px, 0); }
    20%, 80% { transform: translate3d(6px, -4px, 0); }
    30%, 50%, 70% { transform: translate3d(-8px, 6px, 0); }
    40%, 60% { transform: translate3d(8px, -6px, 0); }
}
@keyframes bloodFlash {
    0% { background: rgba(143, 29, 29, 0.9); }
    100% { background: radial-gradient(circle, var(--candle-glow) 0%, rgba(0,0,0,0) 80%); }
}
`;
document.head.appendChild(styleSheet);