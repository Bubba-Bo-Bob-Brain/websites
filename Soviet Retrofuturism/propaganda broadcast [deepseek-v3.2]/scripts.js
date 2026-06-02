// scripts.js
// TASS: Terminal for Astro-Socialist Syndication
// Interactive Broadcast Logic

// ===== DOM ELEMENT REFERENCES =====
const broadcastLight = document.getElementById('broadcastLight');
const broadcastStatus = document.getElementById('broadcastStatus');
const liveDateTime = document.getElementById('liveDateTime');
const dynamicHeadline = document.getElementById('dynamicHeadline');
const propagandaPoster = document.getElementById('propagandaPoster');
const progressPercent = document.getElementById('progressPercent');
const planProgressBar = document.getElementById('planProgressBar');
const progressFill = planProgressBar.querySelector('.progress-fill');
const newsTicker = document.getElementById('newsTicker');
const celebrateBtn = document.getElementById('celebrateBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const rotatePosterBtn = document.getElementById('rotatePosterBtn');
const pulsePosterBtn = document.getElementById('pulsePosterBtn');
const tickerSpeedUp = document.getElementById('tickerSpeedUp');
const tickerPauseBtn = document.getElementById('tickerPauseBtn');
const tickerAddBtn = document.getElementById('tickerAddBtn');
const broadcastAudio = document.getElementById('broadcastAudio');

// ===== STATE VARIABLES & DATA =====
let tickerSpeed = 40; // seconds for full animation cycle
let tickerPaused = false;
let progressValue = 87;
let rotationAngle = 0;
let pulseActive = false;

// Glorious Achievements Database
const headlines = [
    "COSMONAUTS OF THE PROLETARIAT ESTABLISH PERMANENT LUNAR KOLKHOZ",
    "QUANTUM COMPUTING GRID ACHIEVES FULL SOVIET CONSCIOUSNESS",
    "ANTIMATERIA REACTORS POWER ENTIRE EASTERN EUROPEAN SECTOR",
    "WORKER CADRES ON MARS COMPLETE MEGADOME AHEAD OF SCHEDULE",
    "SOVIET SCIENCE CURES GRAVITATIONAL SICKNESS IN ZERO-G",
    "INTERPLANETARY RAILGUN DELIVERS SUPPLIES TO JUPITER OUTPOST",
    "CYBERNETIC UPRISING IN CAPITALIST SECTOR SUPPRESSED",
    "SOLAR COLLECTORS EXCEED ENERGY PRODUCTION QUOTA BY 500%",
    "NEUTRONIUM FORGING TECHNIQUE PATENTED BY SOVIET ENGINEERS",
    "FIRST CHILD BORN IN ORBITAL HABITAT NAMED 'PROGRESS'"
];

const tickerMessages = [
    "*** GLORY TO THE COSMONAUT COLLECTIVE ***",
    "PRODUCTION QUOTAS EXCEEDED IN SECTOR 7",
    "ANTHEM OF THE SUN REPLAY AT 15:00",
    "ZERO UNEMPLOYMENT ACHIEVED ACROSS ORBITAL HABITATS",
    "NEW COMMUNICATIONS PROTOCOL BOOSTS BANDWIDTH BY 500%",
    "CITIZEN SCIENTISTS SOLVE ENERGY DISTRIBUTION EQUATION",
    "ALL HAIL THE CENTRAL COMMITTEE OF THE COSMOS",
    "WORKER SATISFACTION METRICS REACH HISTORIC HIGHS",
    "SPACE-TIME BENDING ENGINE PASSES FINAL TESTS",
    "COMRADE CHAIKA BREAKS VENUSIAN ENDURANCE RECORD"
];

const dispatchItems = [
    {
        time: "14:25",
        title: "MARS ORBITAL SHIPYARDS EXCEED PRODUCTION TARGET",
        content: "The 'Gagarin' collective reports completion of the new 'Proletarian Vanguard' cruiser ahead of schedule. Cadre morale is high.",
        priority: "high"
    },
    {
        time: "13:45",
        title: "CYBERNETIC LABOUR INITIATIVE BOOSTS EFFICIENCY",
        content: "Volunteer workers at the Volgograd reactor complex have achieved 98% synchronization with the central planning network.",
        priority: "medium"
    },
    {
        time: "12:10",
        title: "VENERA WEATHER CONTROL PROJECT STABILIZES CLIMATE",
        content: "Decades of turbulent greenhouse effects have been pacified. The Venusian atmosphere now approaches comradely equilibrium.",
        priority: "low"
    }
];

// ===== INITIALIZATION FUNCTION =====
function initializeBroadcast() {
    console.log("TASS Broadcast Terminal Initializing... Glory to the State!");

    // 1. Set Live Date & Time
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // 2. Initialize Ticker with Dynamic Messages
    populateTicker();
    updateTickerAnimation();

    // 3. Set Random Dynamic Headline
    setRandomHeadline();
    setInterval(setRandomHeadline, 15000);

    // 4. Initialize Progress Bar
    updateProgressBar();

    // 5. Simulate Broadcast Status Fluctuations
    simulateBroadcastStatus();

    // 6. Attach Event Listeners
    attachEventListeners();
}

// ===== CORE FUNCTIONS =====

// Update Live Date & Time with Soviet Flair
function updateDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // January is 0
    const year = 2077; // Fixed glorious year
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthName = months[now.getMonth()];

    liveDateTime.textContent = `${day} ${monthName} ${year} | ${hours}:${minutes}:${seconds} MOSCOW STANDARD TIME`;
}

// Populate and Animate News Ticker
function populateTicker() {
    newsTicker.innerHTML = '';
    tickerMessages.forEach(msg => {
        const item = document.createElement('div');
        item.className = 'ticker-item';
        item.textContent = msg;
        newsTicker.appendChild(item);
    });
}

function updateTickerAnimation() {
    const tickerItems = newsTicker.querySelectorAll('.ticker-item');
    tickerItems.forEach(item => {
        item.style.animation = tickerPaused ? 'none' : `ticker-scroll ${tickerSpeed}s linear infinite`;
    });
}

// Rotate Dynamic Headline
function setRandomHeadline() {
    const randomIndex = Math.floor(Math.random() * headlines.length);
    const newHeadline = headlines[randomIndex];

    // Fade out
    dynamicHeadline.style.opacity = '0';
    dynamicHeadline.style.transform = 'translateY(10px)';

    setTimeout(() => {
        dynamicHeadline.textContent = newHeadline;
        // Fade in with heroic effect
        dynamicHeadline.style.opacity = '1';
        dynamicHeadline.style.transform = 'translateY(0)';
        dynamicHeadline.style.transition = 'opacity 0.5s, transform 0.5s';

        // Occasionally trigger a celebratory pulse on the poster
        if (Math.random() > 0.7) {
            pulsePropagandaPoster();
        }
    }, 500);
}

// Update Five-Year Plan Progress Bar
function updateProgressBar() {
    // Simulate gradual progress increase
    const interval = setInterval(() => {
        if (progressValue >= 100) {
            progressValue = 100;
            clearInterval(interval);
            progressPercent.textContent = '100%';
            progressFill.style.width = '100%';
            celebrateAchievement();
            return;
        }

        progressValue += Math.random() > 0.7 ? 1 : 0; // Random progress
        progressPercent.textContent = `${progressValue}%`;
        progressFill.style.width = `${progressValue}%`;

        // Update ticks color
        const ticks = planProgressBar.querySelectorAll('.progress-ticks span');
        ticks.forEach((tick, index) => {
            if (progressValue > (index + 1) * 20) {
                tick.style.backgroundColor = 'var(--gold-primary)';
            }
        });
    }, 3000);
}

// Simulate Broadcast Status (Live/Static/Transmitting)
function simulateBroadcastStatus() {
    setInterval(() => {
        const statuses = ["LIVE", "TRANSMITTING", "ENCRYPTED", "ACTIVE"];
        const colors = ["var(--red-primary)", "var(--gold-primary)", "var(--red-light)", "var(--gold-light)"];
        const randomIndex = Math.floor(Math.random() * statuses.length);

        broadcastStatus.textContent = statuses[randomIndex];
        broadcastLight.style.backgroundColor = colors[randomIndex];

        // Occasionally add a static flicker effect
        if (Math.random() > 0.8) {
            broadcastLight.style.animation = 'none';
            setTimeout(() => {
                broadcastLight.style.animation = 'pulse-broadcast 2s infinite alternate';
            }, 100);
        }
    }, 5000);
}

// ===== INTERACTION FUNCTIONS =====

function celebrateAchievement() {
    // Visual feedback
    propagandaPoster.style.boxShadow = '0 0 60px var(--gold-primary)';
    document.querySelector('.poster-icon').style.color = 'var(--gold-light)';
    document.querySelector('.poster-icon').style.fontSize = '9rem';
    document.querySelector('.poster-icon').style.opacity = '0.6';

    // Audio feedback
    broadcastAudio.currentTime = 0;
    broadcastAudio.play().catch(e => console.log("Audio play failed:", e));

    // Reset after delay
    setTimeout(() => {
        propagandaPoster.style.boxShadow = '';
        document.querySelector('.poster-icon').style.fontSize = '8rem';
        document.querySelector('.poster-icon').style.opacity = '0.2';
    }, 2000);
}

function pulsePropagandaPoster() {
    if (pulseActive) return;
    pulseActive = true;

    const poster = document.querySelector('.dynamic-poster');
    const originalBorder = poster.style.borderColor;
    poster.style.borderColor = 'var(--gold-primary)';
    poster.style.boxShadow = '0 0 40px var(--gold-primary)';

    setTimeout(() => {
        poster.style.borderColor = originalBorder;
        poster.style.boxShadow = '';
        pulseActive = false;
    }, 1000);
}

function rotatePropagandaPoster() {
    rotationAngle += 45;
    const posterRotate = document.querySelector('.poster-rotate');
    posterRotate.style.transform = `rotate(${rotationAngle}deg)`;

    // Change geometry colors for variety
    const geom1 = document.querySelector('.geom-1');
    const geom2 = document.querySelector('.geom-2');
    const colors = ['var(--red-primary)', 'var(--gold-primary)', 'var(--white)', 'var(--red-light)'];
    geom1.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    geom2.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}

function addTickerMessage() {
    const newMessages = [
        "VOLUNTEER SIGN-UPS FOR ASTEROID MINING AT RECORD HIGH",
        "POLITBURO APPROVES NEW DIALECTICAL MATERIALISM CURRICULUM",
        "COSMIC RAY SHIELDING TECHNOLOGY DEPLOYED ACROSS FLEET",
        "KOLKHOZ LEADERS REPORT RECORD HARVEST ON GANYMEDE",
        "STATE ORCHESTRA COMPOSES SYMPHONY FOR NEUTRON STAR"
    ];
    const randomMsg = newMessages[Math.floor(Math.random() * newMessages.length)];

    const newItem = document.createElement('div');
    newItem.className = 'ticker-item';
    newItem.textContent = randomMsg;
    newsTicker.appendChild(newItem);

    // Briefly highlight new addition
    newItem.style.backgroundColor = 'var(--red-dark)';
    setTimeout(() => {
        newItem.style.backgroundColor = '';
    }, 1000);
}

// ===== EVENT LISTENER ATTACHMENT =====
function attachEventListeners() {
    // Celebrate Progress Button
    celebrateBtn.addEventListener('click', celebrateAchievement);

    // Load More Dispatches Button
    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading new dispatches
        const dispatchList = document.querySelector('.dispatch-list');
        const newDispatch = dispatchItems[Math.floor(Math.random() * dispatchItems.length)];

        const article = document.createElement('article');
        article.className = 'dispatch-item';
        article.setAttribute('data-priority', newDispatch.priority);

        article.innerHTML = `
            <div class="dispatch-time">${newDispatch.time}</div>
            <div class="dispatch-content">
                <h4>${newDispatch.title}</h4>
                <p>${newDispatch.content}</p>
            </div>
            <div class="dispatch-badge">NEW</div>
        `;

        dispatchList.prepend(article);

        // Button feedback
        loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> DISPATCHES LOADED';
        loadMoreBtn.style.backgroundColor = 'var(--gold-primary)';
        setTimeout(() => {
            loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt"></i> LOAD MORE TRIUMPHS';
            loadMoreBtn.style.backgroundColor = '';
        }, 2000);
    });

    // Rotate Propaganda Poster Button
    rotatePosterBtn.addEventListener('click', rotatePropagandaPoster);

    // Pulse Propaganda Poster Button
    pulsePosterBtn.addEventListener('click', pulsePropagandaPoster);

    // Ticker Controls
    tickerSpeedUp.addEventListener('click', () => {
        tickerSpeed = Math.max(10, tickerSpeed - 5); // Speed up, minimum 10s
        updateTickerAnimation();
        tickerSpeedUp.innerHTML = '<i class="fas fa-tachometer-alt"></i>';
        setTimeout(() => {
            tickerSpeedUp.innerHTML = '<i class="fas fa-forward"></i>';
        }, 500);
    });

    tickerPauseBtn.addEventListener('click', () => {
        tickerPaused = !tickerPaused;
        updateTickerAnimation();
        tickerPauseBtn.innerHTML = tickerPaused ?
            '<i class="fas fa-play"></i>' :
            '<i class="fas fa-pause"></i>';
        tickerPauseBtn.style.backgroundColor = tickerPaused ?
            'var(--gold-primary)' : '';
    });

    tickerAddBtn.addEventListener('click', addTickerMessage);

    // Hero Poster Click for Easter Egg
    propagandaPoster.addEventListener('click', (e) => {
        if (e.target.closest('.btn-hero')) return; // Don't trigger if button clicked
        const icon = document.querySelector('.poster-icon');
        icon.style.animation = 'none';
        icon.style.transform = 'scale(1.5)';
        icon.style.color = 'var(--red-light)';

        setTimeout(() => {
            icon.style.animation = 'float-astronaut 8s ease-in-out infinite';
            icon.style.transform = '';
            icon.style.color = '';
        }, 800);
    });

    // Keyboard Shortcuts for Operative Efficiency
    document.addEventListener('keydown', (e) => {
        // Ctrl+Alt+G for Glory
        if (e.ctrlKey && e.altKey && e.key === 'g') {
            e.preventDefault();
            celebrateAchievement();
        }
        // Space toggles ticker pause
        if (e.code === 'Space' && !e.target.closest('button')) {
            e.preventDefault();
            tickerPaused = !tickerPaused;
            updateTickerAnimation();
            tickerPauseBtn.click(); // Sync button state
        }
    });
}

// ===== START BROADCAST =====
document.addEventListener('DOMContentLoaded', initializeBroadcast);

// Final State Log
console.log("TASS Broadcast Terminal Active. All systems serve the People.");