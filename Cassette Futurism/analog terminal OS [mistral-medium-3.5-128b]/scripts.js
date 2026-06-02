// ===== DOM Elements =====
const crtScreen = document.querySelector('.crt-screen');
const rotaryDial = document.querySelector('.rotary-dial');
const dialNeedle = document.querySelector('.dial-needle');
const dialMarkers = document.querySelectorAll('.dial-marker');
const fileItems = document.querySelectorAll('.file-item');
const actionButtons = document.querySelectorAll('.action-btn');
const logContent = document.querySelector('.log-content');
const cassetteAnimation = document.getElementById('cassette-rewind');
const powerToggle = document.getElementById('power-toggle');
const colorToggle = document.getElementById('color-toggle');
const filePath = document.querySelector('.file-path');
const logControls = document.querySelectorAll('.log-btn');

// ===== State =====
let currentDialAngle = 0;
let isDraggingDial = false;
let selectedFile = null;
let logPaused = false;
let logLines = [
    "[NEON-70] BOOT SEQUENCE INITIATED...",
    "[KERNEL] LOADING CORE MODULES...",
    "[MEMORY] 64KB OK",
    "[STORAGE] REEL-TO-REEL DRIVE READY",
    "[NETWORK] LINK ESTABLISHED (BAUD: 1200)",
    "[INPUT] ROTARY DIAL CALIBRATED",
    "[DISPLAY] PHOSPHOR GLOW ACTIVE",
    "[SYSTEM] READY."
];
let currentLogIndex = logLines.length;

// ===== Rotary Dial =====
// Initialize dial positions
const dialPositions = [
    { angle: 0, label: "ROOT" },
    { angle: 45, label: "DOCS" },
    { angle: 90, label: "MEDIA" },
    { angle: 135, label: "SYSTEM" },
    { angle: 180, label: "NET" },
    { angle: 225, label: "USER" },
    { angle: 270, label: "ARCHIVE" },
    { angle: 315, label: "TOOLS" }
];

// Set initial dial position
function updateDialPosition(angle) {
    currentDialAngle = angle;
    dialNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    // Highlight the closest marker
    dialMarkers.forEach(marker => {
        const markerAngle = parseFloat(marker.style.getPropertyValue('--angle'));
        const diff = Math.abs(angle - markerAngle);
        const closest = diff < 22.5 || diff > 337.5; // 22.5° tolerance
        marker.style.color = closest ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
        marker.style.textShadow = closest ? '0 0 5px currentColor' : 'none';
    });

    // Update file path
    const currentPosition = dialPositions.find(pos => Math.abs(pos.angle - angle) <= 22.5);
    if (currentPosition) {
        filePath.textContent = `/NEON-70/${currentPosition.label}/`;
    }
}

// Mouse/touch events for rotary dial
rotaryDial.addEventListener('mousedown', startDialDrag);
rotaryDial.addEventListener('touchstart', startDialDrag, { passive: false });
document.addEventListener('mousemove', dragDial);
document.addEventListener('touchmove', dragDial, { passive: false });
document.addEventListener('mouseup', endDialDrag);
document.addEventListener('touchend', endDialDrag);

function startDialDrag(e) {
    if (!powerToggle.checked) return;
    isDraggingDial = true;
    const rect = rotaryDial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const angle = calculateAngle(centerX, centerY, clientX, clientY);
    updateDialPosition(angle);
}

function dragDial(e) {
    if (!isDraggingDial || !powerToggle.checked) return;
    const rect = rotaryDial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const angle = calculateAngle(centerX, centerY, clientX, clientY);
    updateDialPosition(angle);
}

function endDialDrag() {
    if (!isDraggingDial || !powerToggle.checked) return;
    isDraggingDial = false;

    // Snap to nearest position
    const closestPosition = dialPositions.reduce((prev, curr) =>
        Math.abs(curr.angle - currentDialAngle) < Math.abs(prev.angle - currentDialAngle) ? curr : prev
    );
    updateDialPosition(closestPosition.angle);
}

function calculateAngle(centerX, centerY, clientX, clientY) {
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return (angle + 360) % 360; // Normalize to 0-360
}

// ===== File Manager =====
// Select file on click
fileItems.forEach(item => {
    item.addEventListener('click', () => {
        if (!powerToggle.checked) return;
        selectedFile = item.dataset.file;
        fileItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        addLogLine(`[FILE] SELECTED: ${item.querySelector('.file-name').textContent}`);
    });
});

// Action buttons (Rewind, Load, Eject)
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!powerToggle.checked) return;
        const action = button.dataset.action;
        handleFileAction(action);
    });
});

function handleFileAction(action) {
    if (!selectedFile) {
        addLogLine("[ERROR] NO FILE SELECTED");
        return;
    }

    const fileName = document.querySelector(`.file-item[data-file="${selectedFile}"] .file-name`).textContent;

    switch (action) {
        case 'rewind':
            addLogLine(`[ACTION] REWINDING: ${fileName}`);
            triggerCassetteAnimation();
            break;
        case 'load':
            addLogLine(`[ACTION] LOADING: ${fileName}`);
            break;
        case 'eject':
            addLogLine(`[ACTION] EJECTING: ${fileName}`);
            selectedFile = null;
            fileItems.forEach(i => i.classList.remove('selected'));
            break;
    }
}

function triggerCassetteAnimation() {
    cassetteAnimation.classList.add('active');
    setTimeout(() => {
        cassetteAnimation.classList.remove('active');
    }, 1000);
}

// ===== Console Log =====
function addLogLine(text) {
    if (logPaused) return;

    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = text;
    logContent.appendChild(line);

    // Trigger typewriter animation
    setTimeout(() => {
        line.style.animation = 'typewriter 0.5s steps(40) forwards';
        line.style.opacity = '1';
    }, 10);

    // Auto-scroll
    logContent.scrollTop = logContent.scrollHeight;

    // Store for future reference
    logLines.push(text);
    currentLogIndex = logLines.length;
}

// Log controls (Clear, Pause)
logControls.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.log;
        if (action === 'clear') {
            logContent.innerHTML = '';
            addLogLine("[SYSTEM] LOG CLEARED");
        } else if (action === 'pause') {
            logPaused = !logPaused;
            button.textContent = logPaused ? 'RESUME' : 'PAUSE';
            addLogLine(`[SYSTEM] LOG ${logPaused ? 'PAUSED' : 'RESUMED'}`);
        }
    });
});

// ===== Toggle Switches =====
// Power toggle
powerToggle.addEventListener('change', () => {
    if (powerToggle.checked) {
        addLogLine("[SYSTEM] POWER ON");
        // Re-add initial log lines if cleared
        if (currentLogIndex === 0) {
            logLines.forEach(line => addLogLine(line));
        }
    } else {
        addLogLine("[SYSTEM] POWER OFF");
        selectedFile = null;
        fileItems.forEach(i => i.classList.remove('selected'));
    }
});

// Color mode toggle
colorToggle.addEventListener('change', () => {
    const mode = colorToggle.checked ? 'GREEN' : 'AMBER';
    addLogLine(`[DISPLAY] SWITCHED TO ${mode} MODE`);
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (!powerToggle.checked) return;

    // Arrow keys for rotary dial
    if (e.key === 'ArrowUp') {
        currentDialAngle = (currentDialAngle - 45 + 360) % 360;
        updateDialPosition(currentDialAngle);
    } else if (e.key === 'ArrowDown') {
        currentDialAngle = (currentDialAngle + 45) % 360;
        updateDialPosition(currentDialAngle);
    }

    // File actions
    if (e.key === 'r' && selectedFile) handleFileAction('rewind');
    if (e.key === 'l' && selectedFile) handleFileAction('load');
    if (e.key === 'e' && selectedFile) handleFileAction('eject');

    // Log controls
    if (e.key === 'c') {
        logContent.innerHTML = '';
        addLogLine("[SYSTEM] LOG CLEARED");
    }
    if (e.key === 'p') {
        logPaused = !logPaused;
        addLogLine(`[SYSTEM] LOG ${logPaused ? 'PAUSED' : 'RESUMED'}`);
    }
});

// ===== Initialize =====
// Set initial dial position
updateDialPosition(0);

// Add a welcome message after a delay
setTimeout(() => {
    addLogLine("[SYSTEM] WELCOME TO NEON-70");
}, 1000);