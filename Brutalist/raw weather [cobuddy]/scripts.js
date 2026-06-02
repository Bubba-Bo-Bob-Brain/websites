// TIMESTAMP UPDATES
function updateTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    document.getElementById('timestamp').textContent = `${dateStr} // ${hours}:${minutes}:${seconds} PST`;
}
setInterval(updateTimestamp, 1000);
updateTimestamp();

// ALERT BANNER DISMISS
document.getElementById('alert-dismiss').addEventListener('click', function () {
    const banner = document.getElementById('alert-banner');
    banner.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s';
    banner.style.transform = 'translateY(-100%)';
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 400);
});

// WIND ARROW DIRECTION
const windDirections = [
    { label: 'north', deg: 0 },
    { label: 'northeast', deg: 45 },
    { label: 'east', deg: 90 },
    { label: 'southeast', deg: 135 },
    { label: 'south', deg: 180 },
    { label: 'southwest', deg: 225 },
    { label: 'west', deg: 270 },
    { label: 'northwest', deg: 315 }
];

const arrow = document.getElementById('wind-arrow');
arrow.classList.add('west');

// Simulate wind shift
function updateWindDirection() {
    const idx = Math.floor(Math.random() * windDirections.length);
    const dir = windDirections[idx];
    arrow.className = 'wind-arrow ' + dir.label;
}

setInterval(updateWindDirection, 8000);

// PRESSURE HISTORY ANIMATION ON LOAD
function animatePressureBars() {
    const bars = document.querySelectorAll('.pressure-bar');
    bars.forEach((bar, i) => {
        const h = bar.style.height;
        bar.style.height = '0%';
        bar.style.transition = 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            bar.style.height = h;
        }, 100 + i * 100);
    });
}

// TEMPERATURE COUNTER ANIMATION ON LOAD
function animateTemperature() {
    const tempEl = document.getElementById('main-temp');
    const targetTemp = 53;
    let current = 0;
    const step = Math.ceil(targetTemp / 40);
    const interval = setInterval(() => {
        current += step;
        if (current >= targetTemp) {
            current = targetTerminal;
            clearInterval(interval);
        }
        tempEl.textContent = current;
    }, 30);
}

// HOURLY TABLE ROW HOVER EXTENSION
const hourlyRows = document.querySelectorAll('.hourly-table tbody tr');
hourlyRows.forEach(row => {
    row.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.01)';
        this.style.transition = 'transform 0.15s';
    });
    row.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// SIMULATE LIVE DATA FLICKER ON CONDITIONAL VALUES
function simulateLiveData() {
    // Slight humidity fluctuation
    const humidityEl = document.querySelector('.humidity-ring text:nth-child(1)');
    if (humidityEl) {
        setInterval(() => {
            const val = 78 + Math.floor(Math.random() * 5) - 2;
            humidityEl.textContent = val;
        }, 5000);
    }

    // Pressure slight change
    const pressureEl = document.querySelector('.pressure-value');
    if (pressureEl) {
        setInterval(() => {
            const base = 29.82;
            const delta = (Math.random() - 0.5) * 0.04;
            pressureEl.textContent = (base + delta).toFixed(2);
        }, 4000);
    }

    // Wind speed micro fluctuation
    const windSpeedEl = document.querySelector('.wind-speed');
    if (windSpeedEl) {
        setInterval(() => {
            const base = 18;
            const delta = Math.floor(Math.random() * 4) - 2;
            windSpeedEl.textContent = (base + delta) + ' MPH';
        }, 3000);
    }
}

// SCANLINE SHIMMER ON TEMPERATURE
function addTempShimmer() {
    const tempContainer = document.querySelector('.temp-container');
    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.04) 50%,
            transparent 100%
        );
        animation: shimmer-move 3s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
    `;
    tempContainer.appendChild(shimmer);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes shimmer-move {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
}

// RANDOM DATA PULSE EFFECT ON PANELS
function addPanelPulse() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, i) => {
        panel.addEventListener('mouseenter', () => {
            panel.style.borderColor = '#ff2222';
            panel.style.transition = 'border-color 0.2s';
        });
        panel.addEventListener('mouseleave', () => {
            panel.style.borderColor = '';
        });
    });
}

// AUTO-HIDE ALERT AFTER DISMISS OR TIMEOUT
function autoHideAlert() {
    const alertBanner = document.getElementById('alert-banner');
    if (!alertBanner) return;
    setTimeout(() => {
        if (alertBanner.parentNode) {
            alertBanner.style.transition = 'transform 0.4s, opacity 0.4s';
            alertBanner.style.transform = 'translateY(-100%)';
            alertBanner.style.opacity = '0';
            setTimeout(() => alertBanner.remove(), 400);
        }
    }, 30000);
}

// TEMPERATURE FEELS UPDATE
function updateFeelsLike() {
    const feelsEl = document.querySelector('.temp-feels');
    const temps = [
        'FEELS LIKE 48',
        'FEELS LIKE 45',
        'FEELS LIKE 50',
        'FEELS LIKE 46'
    ];
    let idx = 0;
    setInterval(() => {
        idx = (idx + 1) % temps.length;
        feelsEl.textContent = temps[idx];
    }, 10000);
}

// INIT SEQUENCES
window.addEventListener('DOMContentLoaded', () => {
    animatePressureBars();
    addTempShimmer();
    addPanelPulse();
    simulateLiveData();
    autoHideAlert();
    updateFeelsLike();

    // Staggered panel entrance
    const allPanels = document.querySelectorAll('.panel');
    allPanels.forEach((panel, i) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
        panel.style.transition = 'opacity 0.5s, transform 0.5s';
        setTimeout(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, 200 + i * 100);
    });
});

// KEYBOARD SHORTCUT: PRESS 'R' TO REFRESH DATA
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        animatePressureBars();
        updateWindDirection();
        const tempEl = document.getElementById('main-temp');
        tempEl.style.transition = 'color 0.3s';
        tempEl.style.color = '#ff2222';
        setTimeout(() => {
            tempEl.style.color = '';
        }, 300);
    }
});