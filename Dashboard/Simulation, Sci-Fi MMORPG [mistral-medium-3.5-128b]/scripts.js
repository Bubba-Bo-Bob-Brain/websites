// ===== DOM ELEMENTS =====
const alertBanner = document.querySelector('.alert-banner');
const alertText = document.querySelector('.alert-text');
const alertTime = document.querySelector('.alert-time');
const starMapContainer = document.querySelector('.star-map-container');
const conflictZones = document.querySelectorAll('.conflict-zone');
const resourceValues = document.querySelectorAll('.resource-value');
const fleetHealths = document.querySelectorAll('.fleet-health');
const warBars = document.querySelectorAll('.war-bar .bar-fill');
const techBars = document.querySelectorAll('.tech-bar .bar-fill');
const techTimes = document.querySelectorAll('.tech-time');
const chatBox = document.querySelector('.chat-box');
const chatInput = document.querySelector('.chat-input input');
const chatButton = document.querySelector('.chat-input button');
const guildMembers = document.querySelectorAll('.guild-member .online, .guild-member .offline');
const panels = document.querySelectorAll('.panel');

// ===== GLOBAL VARIABLES =====
let lastAlertTime = 60;
let isChatOpen = true;
let starPositions = [];
let conflictIntensity = [1, 1, 1]; // Intensity for each conflict zone (0-1)

// ===== INITIALIZATION =====
function init() {
    generateStars();
    startAlertTimer();
    startResourceUpdates();
    startFleetUpdates();
    startWarUpdates();
    startTechUpdates();
    startChatSimulation();
    startConflictPulse();
    setupPanelHoverEffects();
    setupChatInput();
    updateGuildStatus();
    setInterval(updateClock, 1000);
    updateClock();
}

// ===== STAR MAP GENERATION =====
function generateStars() {
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
        star.style.borderRadius = '50%';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite alternate`;
        star.style.boxShadow = `0 0 ${Math.random() * 5 + 2}px rgba(255, 255, 255, ${Math.random() * 0.5})`;
        starMapContainer.appendChild(star);
        starPositions.push(star);
    }
    // Add a moving nebula effect
    const nebula = document.createElement('div');
    nebula.className = 'nebula';
    nebula.style.position = 'absolute';
    nebula.style.width = '300px';
    nebula.style.height = '300px';
    nebula.style.background = 'radial-gradient(circle, rgba(120, 0, 255, 0.1) 0%, transparent 70%)';
    nebula.style.borderRadius = '50%';
    nebula.style.left = '50%';
    nebula.style.top = '50%';
    nebula.style.transform = 'translate(-50%, -50%)';
    nebula.style.animation = 'rotateNebula 60s linear infinite';
    starMapContainer.appendChild(nebula);
}

// ===== ALERT SYSTEM =====
function startAlertTimer() {
    setInterval(() => {
        lastAlertTime--;
        alertTime.textContent = `⏱️ ${formatTime(lastAlertTime)}`;
        if (lastAlertTime <= 0) {
            triggerRandomAlert();
            lastAlertTime = Math.floor(Math.random() * 30) + 30;
        }
    }, 1000);
}

function triggerRandomAlert() {
    const alerts = [
        { text: "ZORTHAX SUPERWEAPON DETECTED IN SECTOR 9-X", time: 300 },
        { text: "ALLIANCE FLEET ARRIVING IN SECTOR 4-B", time: 180 },
        { text: "RESOURCE SHORTAGE: FUEL AT CRITICAL LEVELS", time: 120 },
        { text: "ENEMY SPY DETECTED IN YOUR TERRITORY", time: 60 },
        { text: "TECHNOLOGY BREAKTHROUGH: WARP DRIVE UNLOCKED", time: 30 },
        { text: "GUILD MEMBER UNDER ATTACK: NEEDS ASSISTANCE", time: 90 },
        { text: "NEW MISSION AVAILABLE: ESCORT VIP CONVOY", time: 240 }
    ];
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    alertText.textContent = randomAlert.text;
    lastAlertTime = randomAlert.time;
    alertBanner.style.animation = 'none';
    void alertBanner.offsetWidth; // Trigger reflow
    alertBanner.style.animation = 'pulse 1s infinite';
    setTimeout(() => {
        alertBanner.style.animation = 'pulse 2s infinite';
    }, 1000);
}

// ===== RESOURCE UPDATES =====
function startResourceUpdates() {
    setInterval(() => {
        resourceValues.forEach(value => {
            const currentValue = parseInt(value.textContent.replace(/[^0-9]/g, ''));
            const increment = Math.floor(Math.random() * 500) + 100;
            value.textContent = `+${currentValue + increment}/s`;
        });
    }, 2000);
}

// ===== FLEET UPDATES =====
function startFleetUpdates() {
    setInterval(() => {
        fleetHealths.forEach(health => {
            const hearts = health.querySelectorAll('❤️, ⚪');
            const currentHealth = hearts.length - Array.from(hearts).filter(h => h.textContent === '⚪').length;
            if (Math.random() > 0.7 && currentHealth > 1) {
                // Randomly reduce health (simulate damage)
                const newHealth = Math.max(1, currentHealth - 1);
                health.innerHTML = '❤️'.repeat(newHealth) + '⚪'.repeat(5 - newHealth);
            } else if (Math.random() > 0.9 && currentHealth < 5) {
                // Randomly heal
                const newHealth = Math.min(5, currentHealth + 1);
                health.innerHTML = '❤️'.repeat(newHealth) + '⚪'.repeat(5 - newHealth);
            }
        });
    }, 5000);
}

// ===== WARFRONT UPDATES =====
function startWarUpdates() {
    setInterval(() => {
        warBars.forEach((bar, index) => {
            const currentWidth = parseFloat(bar.style.width);
            const change = (Math.random() - 0.5) * 10; // Random change between -5% and +5%
            let newWidth = currentWidth + change;
            newWidth = Math.max(0, Math.min(100, newWidth));
            bar.style.width = `${newWidth}%`;
            // Update conflict intensity for animations
            conflictIntensity[index] = newWidth / 100;
        });
    }, 8000);
}

// ===== TECH RESEARCH UPDATES =====
function startTechUpdates() {
    setInterval(() => {
        techBars.forEach((bar, index) => {
            const currentWidth = parseFloat(bar.style.width);
            if (currentWidth < 100) {
                const increment = Math.random() * 2 + 0.5;
                const newWidth = Math.min(100, currentWidth + increment);
                bar.style.width = `${newWidth}%`;
                // Update time
                const timeElement = techTimes[index];
                const currentTime = timeElement.textContent.replace('⏳ ', '');
                const [h, m, s] = currentTime.split(':').map(Number);
                const totalSeconds = h * 3600 + m * 60 + s - 1;
                if (totalSeconds <= 0) {
                    timeElement.textContent = '⏳ 00:00:00';
                    bar.style.width = '100%';
                } else {
                    const newH = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
                    const newM = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
                    const newS = (totalSeconds % 60).toString().padStart(2, '0');
                    timeElement.textContent = `⏳ ${newH}:${newM}:${newS}`;
                }
            }
        });
    }, 1000);
}

// ===== CONFLICT ZONE PULSE =====
function startConflictPulse() {
    setInterval(() => {
        conflictZones.forEach((zone, index) => {
            const intensity = conflictIntensity[index];
            zone.style.animation = `pulse ${1 + intensity * 2}s infinite`;
            zone.style.textShadow = `0 0 ${5 + intensity * 10}px rgba(255, 110, 0, ${0.5 + intensity * 0.5})`;
        });
    }, 100);
}

// ===== CHAT SIMULATION =====
function startChatSimulation() {
    const messages = [
        "Commander_Vex: Zorthax fleet incoming in 5 mins!",
        "Stellar_Queen: Defense fleets, prepare for battle!",
        "Nebula_Shadow: I'll scout ahead.",
        "Warp_Rider: Need backup in Sector 3!",
        "Void_Reaver: Resource convoy under attack!",
        "Commander_Vex: Tech research almost complete!",
        "Stellar_Queen: Anyone have spare fuel?",
        "Nebula_Shadow: Found a hidden Zorthax base!",
        "Warp_Rider: Warp drive testing successful!",
        "Void_Reaver: Enemy spy detected near HQ!"
    ];
    setInterval(() => {
        if (Math.random() > 0.7) {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message';
            messageElement.innerHTML = randomMessage;
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }, 3000);
}

// ===== GUILD STATUS UPDATES =====
function updateGuildStatus() {
    setInterval(() => {
        guildMembers.forEach(member => {
            if (Math.random() > 0.9) {
                member.classList.toggle('online');
                member.classList.toggle('offline');
            }
        });
    }, 10000);
}

// ===== PANEL HOVER EFFECTS =====
function setupPanelHoverEffects() {
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            panel.style.transform = 'scale(1.01)';
            panel.style.zIndex = '10';
        });
        panel.addEventListener('mouseleave', () => {
            panel.style.transform = 'scale(1)';
            panel.style.zIndex = '1';
        });
    });
}

// ===== CHAT INPUT =====
function setupChatInput() {
    chatButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `<span class="chat-user">You:</span> <span>${message}</span>`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        chatInput.value = '';
    }
}

// ===== CLOCK UPDATE =====
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.querySelector('.alert-time').textContent = `⏱️ ${hours}:${minutes}:${seconds}`;
}

// ===== UTILITY FUNCTIONS =====
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// ===== START THE DASHBOARD =====
init();