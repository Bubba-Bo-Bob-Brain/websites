// ===== DOM Elements =====
const warRoom = document.querySelector('.war-room');
const mapContainer = document.querySelector('.map-container');
const map = document.querySelector('.map');
const unitMarkers = document.querySelectorAll('.unit-marker');
const radioLog = document.querySelector('.radio-log');
const analogDials = document.querySelectorAll('.analog-dial');
const switches = document.querySelectorAll('.switch input');
const propagandaPoster = document.querySelector('.poster-content');
const productionQuotas = document.querySelectorAll('.quota-bar');
const soundToggle = document.getElementById('soundToggle');
const overheadLamp = document.querySelector('.overhead-lamp');

// ===== State =====
let isDragging = false;
let draggedUnit = null;
let offsetX, offsetY;
let ambientSound = null;
let isSoundOn = false;
let radioMessages = [
    { time: "[23:45]", text: "Enemy convoy spotted near Grid 7-B. Requesting artillery support." },
    { time: "[23:42]", text: "Recon plane reports heavy resistance at the river crossing." },
    { time: "[23:38]", text: "Fuel reserves critical. Rationing recommended." },
    { time: "[23:35]", text: "Air support en route to Sector 4. ETA: 5 minutes." },
    { time: "[23:30]", text: "Enemy transmission intercepted: 'Regroup at the forest edge.' Decrypting..." },
    { time: "[23:25]", text: "Manpower at 30%. Reinforcements requested from HQ." },
    { time: "[23:20]", text: "Tank production ahead of schedule. Quota increased to 50/week." },
    { time: "[23:15]", text: "Saboteurs detected near ammunition depot. Send guards!" },
    { time: "[23:10]", text: "Propaganda broadcast scheduled for 00:00. Prepare the speakers." },
    { time: "[23:05]", text: "Weather report: Clear skies. Ideal for aerial reconnaissance." }
];
let propagandaMessages = [
    { title: "UNITED WE STAND", text: "For King and Country!", footnote: "Ministry of Morale, 1943" },
    { title: "VICTORY IS OURS", text: "The enemy will fall!", footnote: "War Office, 1944" },
    { title: "KEEP CALM", text: "And carry on.", footnote: "Home Front, 1942" },
    { title: "JOIN THE FIGHT", text: "Enlist today!", footnote: "Recruitment Bureau, 1941" },
    { title: "THE FUTURE IS BRIGHT", text: "With steel and fire.", footnote: "Industrial Command, 1945" }
];

// ===== Utility Functions =====
// Generate random integer between min and max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format time as [HH:MM]
function formatTime() {
    const hours = String(randomInt(0, 23)).padStart(2, '0');
    const minutes = String(randomInt(0, 59)).padStart(2, '0');
    return `[${hours}:${minutes}]`;
}

// ===== Draggable Units =====
unitMarkers.forEach(marker => {
    marker.addEventListener('mousedown', startDrag);
});

function startDrag(e) {
    isDragging = true;
    draggedUnit = e.target;
    const rect = draggedUnit.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    draggedUnit.style.zIndex = '100';
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    e.preventDefault();
}

function drag(e) {
    if (!isDragging || !draggedUnit) return;
    const mapRect = mapContainer.getBoundingClientRect();
    let x = e.clientX - mapRect.left - offsetX;
    let y = e.clientY - mapRect.top - offsetY;

    // Snap to grid (50px)
    const gridSize = 50;
    x = Math.round(x / gridSize) * gridSize;
    y = Math.round(y / gridSize) * gridSize;

    // Boundary checks
    x = Math.max(0, Math.min(x, mapRect.width - draggedUnit.offsetWidth));
    y = Math.max(0, Math.min(y, mapRect.height - draggedUnit.offsetHeight));

    draggedUnit.style.left = `${x}px`;
    draggedUnit.style.top = `${y}px`;
}

function stopDrag() {
    isDragging = false;
    draggedUnit = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

// ===== Flickering Lamp =====
function initLamp() {
    // Random flicker intensity
    setInterval(() => {
        const flickerIntensity = randomInt(30, 80);
        overheadLamp.style.filter = `brightness(${flickerIntensity / 100 + 0.5})`;
    }, 200);

    // Cast dynamic shadow
    setInterval(() => {
        const shadowX = randomInt(-10, 10);
        const shadowY = randomInt(-10, 10);
        const shadowBlur = randomInt(20, 40);
        mapContainer.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.5)`;
    }, 500);
}

// ===== Radio Intercept Log =====
function initRadioLog() {
    // Add initial messages
    radioMessages.slice(0, 3).forEach(msg => {
        addRadioMessage(msg.time, msg.text);
    });

    // Add new messages periodically
    setInterval(() => {
        const randomMsg = radioMessages[randomInt(0, radioMessages.length - 1)];
        addRadioMessage(randomMsg.time, randomMsg.text);
        scrollRadioLog();
    }, 5000);
}

function addRadioMessage(time, text) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="timestamp">${time}</span><span class="message">${text}</span>`;
    radioLog.appendChild(entry);

    // Limit log entries to 10
    if (radioLog.children.length > 10) {
        radioLog.removeChild(radioLog.firstChild);
    }
}

function scrollRadioLog() {
    radioLog.scrollTop = radioLog.scrollHeight;
}

// ===== Analog Dials =====
analogDials.forEach(dial => {
    const needle = dial.querySelector('.dial-needle');
    const valueDisplay = dial.querySelector('.dial-value');
    let isDraggingDial = false;
    let startAngle = 0;
    let currentAngle = parseInt(getComputedStyle(needle).getPropertyValue('--rotation')) || 0;

    // Click to start dragging
    dial.addEventListener('mousedown', (e) => {
        isDraggingDial = true;
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        startAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
        document.addEventListener('mousemove', rotateDial);
        document.addEventListener('mouseup', stopRotateDial);
        e.preventDefault();
    });

    function rotateDial(e) {
        if (!isDraggingDial) return;
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        let angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

        // Clamp angle between -90 and 90 degrees
        angle = Math.max(-90, Math.min(90, angle));
        currentAngle = angle;
        needle.style.setProperty('--rotation', `${currentAngle}deg`);

        // Update value display (0-100%)
        const percentage = Math.round(((currentAngle + 90) / 180) * 100);
        valueDisplay.textContent = `${percentage}%`;
    }

    function stopRotateDial() {
        isDraggingDial = false;
        document.removeEventListener('mousemove', rotateDial);
        document.removeEventListener('mouseup', stopRotateDial);
    }
});

// ===== Propaganda Poster Rotation =====
function initPropagandaPoster() {
    let currentIndex = 0;
    setInterval(() => {
        currentIndex = (currentIndex + 1) % propagandaMessages.length;
        const { title, text, footnote } = propagandaMessages[currentIndex];
        propagandaPoster.innerHTML = `
            <h2>${title}</h2>
            <p>${text}</p>
            <div class="poster-footnote">${footnote}</div>
        `;
    }, 8000);
}

// ===== Production Quotas =====
function initProductionQuotas() {
    productionQuotas.forEach(bar => {
        const currentWidth = parseFloat(getComputedStyle(bar).getPropertyValue('--width'));
        const targetWidth = randomInt(50, 100);
        let progress = currentWidth;

        const interval = setInterval(() => {
            progress += (targetWidth - currentWidth) / 50;
            if (Math.abs(progress - targetWidth) < 1) {
                progress = targetWidth;
                clearInterval(interval);
            }
            bar.style.setProperty('--width', `${progress}%`);
        }, 50);
    });
}

// ===== Switch Controls =====
switches.forEach(switchInput => {
    switchInput.addEventListener('change', function() {
        const label = this.nextElementSibling.nextElementSibling;
        if (this.checked) {
            label.textContent = label.textContent.toUpperCase();
            // Play a subtle "click" sound if sound is on
            if (isSoundOn) playClickSound();
        } else {
            label.textContent = label.textContent.toLowerCase();
        }
    });
});

// ===== Ambient Sound =====
function initAmbientSound() {
    // Create a simple ambient sound (radio static)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const noise = audioContext.createScriptProcessor(2048, 1, 1);
    noise.onaudioprocess = () => {
        const output = noise.outputBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
            output[i] = Math.random() * 0.1;
        }
    };

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    noise.connect(filter);
    filter.connect(audioContext.destination);

    ambientSound = {
        context: audioContext,
        noise: noise,
        filter: filter,
        isPlaying: false
    };

    soundToggle.addEventListener('click', toggleAmbientSound);
}

function toggleAmbientSound() {
    if (!ambientSound) return;

    if (isSoundOn) {
        // Stop sound
        ambientSound.noise.disconnect();
        ambientSound.context.close();
        soundToggle.textContent = "TOGGLE AMBIENCE";
    } else {
        // Start sound
        initAmbientSound();
        soundToggle.textContent = "AMBIENCE ON";
        if (ambientSound.noise) {
            ambientSound.noise.connect(ambientSound.filter);
        }
    }
    isSoundOn = !isSoundOn;
}

function playClickSound() {
    if (!ambientSound || !isSoundOn) return;
    const oscillator = ambientSound.context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    const gainNode = ambientSound.context.createGain();
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(ambientSound.context.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, ambientSound.context.currentTime + 0.1);
    oscillator.stop(ambientSound.context.currentTime + 0.1);
}

// ===== Initialize Everything =====
function init() {
    initLamp();
    initRadioLog();
    initPropagandaPoster();
    initProductionQuotas();
    initAmbientSound();

    // Set initial positions for units (random grid positions)
    unitMarkers.forEach(marker => {
        const x = randomInt(0, 10) * 50;
        const y = randomInt(0, 6) * 50;
        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
    });
}

// Start the war room!
init();