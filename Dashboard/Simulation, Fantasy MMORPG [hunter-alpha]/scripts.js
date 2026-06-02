/* ========================================
   AETHORIA NEXUS — World Command Nexus
   Fantasy MMORPG Dashboard JavaScript
   Dynamic Data & Interactive Features
   ======================================== */

// === Configuration ===
const CONFIG = {
    updateInterval: 5000,      // 5 seconds for main data
    tickInterval: 1000,        // 1 second for timers
    tickerSpeed: 60000,        // 60 seconds for full ticker scroll
    animationDuration: 300,
    serverStartTime: Date.now() - (47 * 24 * 60 * 60 * 1000) - (12 * 60 * 60 * 1000) - (34 * 60 * 1000)
};

// === State Management ===
const state = {
    onlinePlayers: 14892,
    gold: 847293,
    ping: 23,
    fps: 60,
    worldEventTimeLeft: 2 * 3600 + 14 * 60, // 2h 14m in seconds
    activeTab: 'guilds',
    bossTimers: {
        pyrathos: 5 * 3600 + 32 * 60,
        leviathan: null, // alive
        hydra: 3 * 24 * 3600, // 3 days respawn
        malachar: 5 * 24 * 3600, // 5 days respawn
        golem: null // alive
    },
    moonPhase: 0,
    seasonWeek: 3,
    notifications: []
};

// === Initialization ===
document.addEventListener('DOMContentLoaded', () => {
    initializeClock();
    initializeUptime();
    initializeTerritoryMap();
    initializeRankingTabs();
    initializeTicker();
    initializeCounters();
    initializeTooltips();
    initializeDataSimulation();
    initializeEventTimers();
    initializeWeatherEffects();
    initializeParticleEffects();
    initializeKeyboardShortcuts();
    
    console.log('%c⚔️ AETHORIA NEXUS — World Command Nexus Initialized', 
        'color: #ffd700; font-size: 16px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
    console.log('%c🌍 Server: Celestine-7 | Version 3.7.2 "Obsidian Throne"', 
        'color: #4a7aff; font-size: 12px;');
});

// === Clock & Time Functions ===
function initializeClock() {
    updateServerTime();
    setInterval(updateServerTime, 1000);
}

function updateServerTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const serverTimeEl = document.getElementById('server-time');
    const bottomTimeEl = document.getElementById('bottom-time');
    
    if (serverTimeEl) serverTimeEl.textContent = timeStr;
    if (bottomTimeEl) bottomTimeEl.textContent = `${dateStr} ${timeStr}`;
}

function initializeUptime() {
    updateUptime();
    setInterval(updateUptime, 60000); // Update every minute
}

function updateUptime() {
    const elapsed = Date.now() - CONFIG.serverStartTime;
    const days = Math.floor(elapsed / (24 * 60 * 60 * 1000));
    const hours = Math.floor((elapsed % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((elapsed % (60 * 60 * 1000)) / (60 * 1000));
    
    const uptimeEl = document.getElementById('uptime');
    if (uptimeEl) {
        uptimeEl.textContent = `${days}d ${hours}h ${minutes}m`;
    }
}

// === Territory Map (Canvas-based) ===
function initializeTerritoryMap() {
    const mapContainer = document.getElementById('territory-map');
    if (!mapContainer) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = mapContainer.offsetWidth;
    canvas.height = mapContainer.offsetHeight;
    mapContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Territory data
    const territories = [
        { name: 'Alliance of Dawn', color: '#4a9eff', regions: [] },
        { name: 'Crimson Horde', color: '#ff4a4a', regions: [] },
        { name: 'Verdant Pact', color: '#4aff4a', regions: [] },
        { name: 'Ember Throne', color: '#ffaa4a', regions: [] },
        { name: 'Void Syndicate', color: '#aa4aff', regions: [] },
        { name: 'Contested', color: '#888888', regions: [] }
    ];
    
    // Generate random territory polygons
    generateTerritories(ctx, canvas.width, canvas.height, territories);
    
    // Add landmarks
    drawLandmarks(ctx, canvas.width, canvas.height);
    
    // Add animated border conflicts
    animateConflicts(ctx, canvas.width, canvas.height);
    
    // Make map interactive
    canvas.addEventListener('mousemove', (e) => handleMapHover(e, canvas, territories));
    canvas.addEventListener('click', (e) => handleMapClick(e, canvas, territories));
}

function generateTerritories(ctx, width, height, territories) {
    // Generate Voronoi-like regions
    const numPoints = 25;
    const points = [];
    const factionAssignments = [];
    
    // Generate seed points
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height
        });
        factionAssignments.push(Math.floor(Math.random() * territories.length));
    }
    
    // Draw territories using pixel-based Voronoi
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let minDist = Infinity;
            let closestFaction = 0;
            
            for (let i = 0; i < points.length; i++) {
                const dx = x - points[i].x;
                const dy = y - points[i].y;
                const dist = dx * dx + dy * dy;
                
                if (dist < minDist) {
                    minDist = dist;
                    closestFaction = factionAssignments[i];
                }
            }
            
            const color = hexToRgb(territories[closestFaction].color);
            const idx = (y * width + x) * 4;
            
            // Add noise for organic look
            const noise = (Math.random() - 0.5) * 20;
            
            data[idx] = Math.max(0, Math.min(255, color.r + noise));
            data[idx + 1] = Math.max(0, Math.min(255, color.g + noise));
            data[idx + 2] = Math.max(0, Math.min(255, color.b + noise));
            data[idx + 3] = 180; // Semi-transparent
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Draw borders between territories
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            const idxRight = (y * width + x + 1) * 4;
            const idxDown = ((y + 1) * width + x) * 4;
            
            const current = data[idx] + data[idx + 1] + data[idx + 2];
            const right = data[idxRight] + data[idxRight + 1] + data[idxRight + 2];
            const down = data[idxDown] + data[idxDown + 1] + data[idxDown + 2];
            
            if (Math.abs(current - right) > 100 || Math.abs(current - down) > 100) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}

function drawLandmarks(ctx, width, height) {
    const landmarks = [
        { x: 0.2, y: 0.3, icon: '🏰', name: 'Castle' },
        { x: 0.7, y: 0.2, icon: '🏰', name: 'Fort' },
        { x: 0.5, y: 0.5, icon: '⚔️', name: 'Battle' },
        { x: 0.3, y: 0.7, icon: '⛏️', name: 'Mine' },
        { x: 0.8, y: 0.6, icon: '🏰', name: 'Keep' },
        { x: 0.15, y: 0.5, icon: '🌳', name: 'Forest' },
        { x: 0.85, y: 0.8, icon: '🌋', name: 'Volcano' },
        { x: 0.4, y: 0.15, icon: '🏔️', name: 'Mountain' }
    ];
    
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    landmarks.forEach(lm => {
        const x = lm.x * width;
        const y = lm.y * height;
        
        // Glow effect
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
        ctx.fillText(lm.icon, x, y);
        ctx.shadowBlur = 0;
    });
}

function animateConflicts(ctx, width, height) {
    let frame = 0;
    
    function drawConflictZones() {
        // Animated conflict indicators
        const conflicts = [
            { x: 0.45, y: 0.35 },
            { x: 0.65, y: 0.55 },
            { x: 0.25, y: 0.65 }
        ];
        
        conflicts.forEach(conflict => {
            const x = conflict.x * width;
            const y = conflict.y * height;
            const pulse = Math.sin(frame * 0.05) * 5 + 10;
            
            ctx.beginPath();
            ctx.arc(x, y, pulse, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 100, 100, ${0.5 + Math.sin(frame * 0.1) * 0.3})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Crossed swords icon
            ctx.font = '10px Arial';
            ctx.fillStyle = '#ff4444';
            ctx.fillText('⚔️', x, y);
        });
        
        frame++;
        requestAnimationFrame(drawConflictZones);
    }
    
    drawConflictZones();
}

function handleMapHover(e, canvas, territories) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Could implement territory highlighting here
}

function handleMapClick(e, canvas, territories) {
    // Could implement territory selection/zoom here
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// === Ranking Tabs ===
function initializeRankingTabs() {
    const tabs = document.querySelectorAll('.rank-tab');
    const rankingList = document.getElementById('ranking-list');
    
    if (!tabs.length || !rankingList) return;
    
    const rankings = {
        guilds: [
            { rank: 1, icon: '👑', name: 'Crimson Vanguard', score: '48,291 pts', self: false },
            { rank: 2, icon: '🥈', name: 'Shadow Council', score: '45,847 pts', self: false },
            { rank: 3, icon: '🥉', name: 'Silver Dawn ✦', score: '44,102 pts', self: true },
            { rank: 4, icon: '', name: 'Iron Wolves', score: '41,567 pts', self: false },
            { rank: 5, icon: '', name: 'Emerald Covenant', score: '39,203 pts', self: false },
            { rank: 6, icon: '', name: 'Dusk Reapers', score: '37,891 pts', self: false },
            { rank: 7, icon: '', name: 'Azure Templars', score: '35,442 pts', self: false },
            { rank: 8, icon: '', name: 'Void Seekers', score: '34,100 pts', self: false }
        ],
        pvp: [
            { rank: 1, icon: '👑', name: 'Nightblade', score: '2,847 Rating', self: false },
            { rank: 2, icon: '🥈', name: 'Valdris ✦', score: '2,147 Rating', self: true },
            { rank: 3, icon: '🥉', name: 'Doomhammer', score: '2,089 Rating', self: false },
            { rank: 4, icon: '', name: 'Shadowstrike', score: '2,034 Rating', self: false },
            { rank: 5, icon: '', name: 'Frostweaver', score: '1,987 Rating', self: false },
            { rank: 6, icon: '', name: 'Blazefury', score: '1,923 Rating', self: false },
            { rank: 7, icon: '', name: 'Thornmantle', score: '1,891 Rating', self: false },
            { rank: 8, icon: '', name: 'Voidwalker', score: '1,856 Rating', self: false }
        ],
        mplus: [
            { rank: 1, icon: '👑', name: 'Shadow Council', score: '3,247 Score', self: false },
            { rank: 2, icon: '🥈', name: 'Crimson Vanguard', score: '3,102 Score', self: false },
            { rank: 3, icon: '🥉', name: 'Iron Wolves', score: '2,891 Score', self: false },
            { rank: 4, icon: '', name: 'Silver Dawn ✦', score: '1,847 Score', self: true },
            { rank: 5, icon: '', name: 'Dusk Reapers', score: '1,723 Score', self: false },
            { rank: 6, icon: '', name: 'Azure Templars', score: '1,689 Score', self: false },
            { rank: 7, icon: '', name: 'Emerald Covenant', score: '1,612 Score', self: false },
            { rank: 8, icon: '', name: 'Void Seekers', score: '1,534 Score', self: false }
        ],
        crafting: [
            { rank: 1, icon: '👑', name: 'Artisan Guild', score: '12,847 Skill', self: false },
            { rank: 2, icon: '🥈', name: 'Silver Dawn ✦', score: '11,203 Skill', self: true },
            { rank: 3, icon: '🥉', name: 'Ironforge Masters', score: '10,891 Skill', self: false },
            { rank: 4, icon: '', name: 'Crafters United', score: '10,456 Skill', self: false },
            { rank: 5, icon: '', name: 'Shadow Council', score: '9,847 Skill', self: false },
            { rank: 6, icon: '', name: 'Emerald Covenant', score: '9,234 Skill', self: false },
            { rank: 7, icon: '', name: 'Dusk Reapers', score: '8,912 Skill', self: false },
            { rank: 8, icon: '', name: 'Crimson Vanguard', score: '8,456 Skill', self: false }
        ]
    };
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabName = tab.dataset.tab;
            const data = rankings[tabName];
            
            if (data) {
                renderRankings(rankingList, data);
            }
        });
    });
}

function renderRankings(container, data) {
    container.innerHTML = '';
    
    data.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = `rank-row guild-rank${item.self ? ' self' : ''}`;
        row.innerHTML = `
            <span class="rank-num">${item.rank}</span>
            <span class="rank-icon">${item.icon}</span>
            <span class="rank-name">${item.name}</span>
            <span class="rank-score">${item.score}</span>
        `;
        
        // Staggered animation
        row.style.opacity = '0';
        row.style.transform = 'translateX(-10px)';
        row.style.transition = 'all 0.2s ease';
        
        container.appendChild(row);
        
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

// === News Ticker ===
function initializeTicker() {
    const ticker = document.getElementById('news-ticker');
    if (!ticker) return;
    
    // Clone ticker content for seamless loop
    const content = ticker.innerHTML;
    ticker.innerHTML = content + content;
}

// === Animated Counters ===
function initializeCounters() {
    // Animate gold counter
    animateCounter('gold-amount', 0, state.gold, 2000, formatNumber);
    
    // Animate online players with fluctuation
    setInterval(() => {
        const fluctuation = Math.floor(Math.random() * 200) - 100;
        state.onlinePlayers = Math.max(14000, Math.min(15500, state.onlinePlayers + fluctuation));
        
        const el = document.getElementById('online-players');
        if (el) {
            el.textContent = formatNumber(state.onlinePlayers);
        }
    }, 3000);
}

function animateCounter(elementId, start, end, duration, formatter) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * eased);
        
        el.textContent = formatter ? formatter(current) : current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function formatNumber(num) {
    return num.toLocaleString('en-US');
}

// === Tooltips ===
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(el => {
        const title = el.getAttribute('title');
        if (!title) return;
        
        el.removeAttribute('title');
        el.setAttribute('data-tooltip', title);
        
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    let tooltip = document.getElementById('custom-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(20, 20, 35, 0.95);
            border: 1px solid #4a3a8a;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 11px;
            color: #e8e6f0;
            pointer-events: none;
            z-index: 10000;
            max-width: 250px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            font-family: 'Crimson Text', serif;
        `;
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.bottom + 8}px`;
}

function hideTooltip() {
    const tooltip = document.getElementById('custom-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// === Data Simulation (Live Updates) ===
function initializeDataSimulation() {
    // Simulate various data changes
    setInterval(() => {
        // Update ping
        state.ping = 20 + Math.floor(Math.random() * 15);
        const pingEl = document.getElementById('ping');
        if (pingEl) pingEl.textContent = state.ping;
        
        // Update FPS
        state.fps = 58 + Math.floor(Math.random() * 4);
        const fpsEl = document.getElementById('fps');
        if (fpsEl) fpsEl.textContent = state.fps;
        
        // Random gold fluctuation
        const goldChange = Math.floor(Math.random() * 1000) - 300;
        state.gold = Math.max(800000, state.gold + goldChange);
        const goldEl = document.getElementById('gold-amount');
        if (goldEl) goldEl.textContent = formatNumber(state.gold);
        
    }, CONFIG.updateInterval);
}

// === Event Timers ===
function initializeEventTimers() {
    setInterval(() => {
        // World event countdown
        if (state.worldEventTimeLeft > 0) {
            state.worldEventTimeLeft--;
            // Timer display would be updated here if we had a specific element
        }
        
        // Boss timers
        Object.keys(state.bossTimers).forEach(boss => {
            if (state.bossTimers[boss] !== null && state.bossTimers[boss] > 0) {
                state.bossTimers[boss]--;
            }
        });
        
    }, 1000);
}

function formatTime(seconds) {
    if (seconds <= 0) return 'Now';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${secs}s`;
}

// === Weather Effects ===
function initializeWeatherEffects() {
    // Cycle through moon phases
    setInterval(() => {
        state.moonPhase = (state.moonPhase + 1) % 8;
        const moonEl = document.getElementById('moon-phase');
        if (moonEl) {
            const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
            moonEl.textContent = phases[state.moonPhase];
        }
    }, 30000); // Change every 30 seconds for demo
    
    // Weather zone temperature fluctuation
    setInterval(() => {
        const tempElements = document.querySelectorAll('.zone-temp');
        tempElements.forEach(el => {
            const currentTemp = parseInt(el.textContent);
            const fluctuation = Math.floor(Math.random() * 3) - 1;
            el.textContent = `${currentTemp + fluctuation}°C`;
        });
    }, 10000);
}

// === Particle Effects ===
function initializeParticleEffects() {
    // Create ambient floating particles in the background
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.insertBefore(particleContainer, document.body.firstChild);
    
    // Create particles
    for (let i = 0; i < 30; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 10;
    
    const colors = ['#7b5ea7', '#4a7aff', '#ffd700', '#4af0ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${startX}%;
        top: ${startY}%;
        opacity: 0;
        animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
        box-shadow: 0 0 ${size * 2}px ${color};
    `;
    
    container.appendChild(particle);
}

// Add particle animation CSS
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            opacity: 0;
            transform: translateY(0) translateX(0);
        }
        10% {
            opacity: 0.6;
        }
        50% {
            opacity: 0.3;
            transform: translateY(-100px) translateX(${Math.random() * 50 - 25}px);
        }
        90% {
            opacity: 0.6;
        }
    }
`;
document.head.appendChild(particleStyles);

// === Keyboard Shortcuts ===
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case '1':
                scrollToPanel('panel-player');
                break;
            case '2':
                scrollToPanel('panel-map');
                break;
            case '3':
                scrollToPanel('panel-dungeons');
                break;
            case '4':
                scrollToPanel('panel-marketplace');
                break;
            case '5':
                scrollToPanel('panel-pvp');
                break;
            case 'r':
                if (e.ctrlKey) {
                    e.preventDefault();
                    refreshAllData();
                }
                break;
            case 'Escape':
                closeAllModals();
                break;
        }
    });
}

function scrollToPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        panel.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
        setTimeout(() => {
            panel.style.boxShadow = '';
        }, 1000);
    }
}

function refreshAllData() {
    // Visual feedback for refresh
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
        setTimeout(() => {
            panel.style.opacity = '0.5';
            setTimeout(() => {
                panel.style.opacity = '1';
            }, 200);
        }, index * 30);
    });
    
    // Re-initialize data
    initializeDataSimulation();
    
    console.log('%c🔄 Dashboard data refreshed', 'color: #4aff6a; font-size: 12px;');
}

function closeAllModals() {
    // Close any open modals/overlays
    const tooltip = document.getElementById('custom-tooltip');
    if (tooltip) tooltip.style.display = 'none';
}

// === Utility Functions ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// === Dynamic Bar Updates ===
function updateBar(barSelector, percentage) {
    const bar = document.querySelector(barSelector);
    if (bar) {
        const fill = bar.querySelector('.bar-fill') || bar;
        fill.style.width = `${percentage}%`;
    }
}

// === Notification System ===
function addNotification(message, type = 'info', duration = 5000) {
    const container = document.querySelector('.panel-notifications .panel-body');
    if (!container) return;
    
    const icons = {
        info: '💬',
        success: '✅',
        warning: '⚠️',
        urgent: '⚔️'
    };
    
    const notification = document.createElement('div');
    notification.className = `notif-item ${type}`;
    notification.innerHTML = `
        <span class="notif-icon">${icons[type]}</span>
        <span>${message}</span>
        <span class="notif-time">Just now</span>
    `;
    
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-20px)';
    
    container.insertBefore(notification, container.firstChild);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove old notifications if too many
    const notifications = container.querySelectorAll('.notif-item');
    if (notifications.length > 15) {
        notifications[notifications.length - 1].remove();
    }
}

// === Periodic Random Events ===
function startRandomEvents() {
    const events = [
        { message: 'New player joined the guild: ShadowNovice', type: 'info' },
        { message: 'Auction sold: Health Potion x10 for 500g', type: 'success' },
        { message: 'World boss Pyrathos health dropping fast!', type: 'warning' },
        { message: 'Your friend Nightblade just logged in', type: 'info' },
        { message: 'Guild message from Thormund: "Anyone for M+?"', type: 'info' },
        { message: 'Territory under attack! Fort Blackthorn needs defenders!', type: 'urgent' }
    ];
    
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            const event = events[Math.floor(Math.random() * events.length)];
            addNotification(event.message, event.type);
        }
    }, 15000);
}

// Start random events after 10 seconds
setTimeout(startRandomEvents, 10000);

// === Performance Monitoring ===
let lastFrameTime = performance.now();
let frameCount = 0;

function measureFPS() {
    frameCount++;
    const now = performance.now();
    
    if (now - lastFrameTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (now - lastFrameTime));
        const fpsEl = document.getElementById('fps');
        if (fpsEl) fpsEl.textContent = fps;
        
        frameCount = 0;
        lastFrameTime = now;
    }
    
    requestAnimationFrame(measureFPS);
}

// Start FPS monitoring
requestAnimationFrame(measureFPS);

// === Console Easter Eggs ===
console.log('%c⚔️ AETHORIA NEXUS ⚔️', 'color: #ffd700; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%c🏰 Welcome, Commander. The realm awaits your command.', 'color: #4a7aff; font-size: 14px;');
console.log('%c📊 Dashboard Controls:', 'color: #7b5ea7; font-size: 12px;');
console.log('%c   Press 1-5 to jump to sections', 'color: #a8a6b8; font-size: 11px;');
console.log('%c   Press Ctrl+R to refresh data', 'color: #a8a6b8; font-size: 11px;');
console.log('%c   Press Escape to close modals', 'color: #a8a6b8; font-size: 11px;');