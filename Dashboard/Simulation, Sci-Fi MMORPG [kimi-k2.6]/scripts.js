// ===== NEXUS COMMAND SIMULATION ENGINE =====
const SIM = {
    tick: 0,
    cycleStart: Date.now(),
    factions: ['TC', 'VH', 'CM', 'SA', 'NS'],
    starCount: 200,
    fleetCount: 40,
    nebulaCount: 5
};

// ===== DOM CACHE =====
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ===== INITIALIZATION =====
function init() {
    generateStarMap();
    generateNebulae();
    generateFleets();
    startSimulation();
    setupInteractions();
    updateTime();
    setInterval(updateTime, 50);
}

// ===== TIME SYSTEM =====
function updateTime() {
    const elapsed = Math.floor((Date.now() - SIM.cycleStart) / 10);
    const cycles = String(elapsed).padStart(4, '0');
    $('sim-time').textContent = cycles;
}

// ===== STAR MAP GENERATION =====
function generateStarMap() {
    const layer = $('stars-layer');
    const map = $('star-map');
    const factionColors = {
        TC: '#00d4aa',
        VH: '#ff4757',
        CM: '#ffa502',
        SA: '#7bed9f',
        NS: '#ff6b81'
    };
    const systemNames = [
        'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
        'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
        'Regulus', 'Arcturus', 'Vega', 'Capella', 'Rigel', 'Procyon', 'Achernar', 'Altair', 'Antares', 'Spica',
        'Deneb', 'Fomalhaut', 'Pollux', 'Castor', 'Bellatrix', 'El Nath', 'Alnilam', 'Mintaka', 'Alnitak', 'Saiph'
    ];
    for (let i = 0; i < SIM.starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star-system';
        const x = 2 + Math.random() * 96;
        const y = 2 + Math.random() * 96;
        star.style.left = x + '%';
        star.style.top = y + '%';
        const faction = SIM.factions[Math.floor(Math.random() * SIM.factions.length)];
        star.style.background = factionColors[faction];
        star.style.boxShadow = '0 0 ' + (4 + Math.random() * 8) + 'px ' + factionColors[faction];
        const size = 2 + Math.random() * 4;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        const name = systemNames[Math.floor(Math.random() * systemNames.length)] + '-' + Math.floor(Math.random() * 999);
        star.dataset.name = name;
        star.dataset.faction = faction;
        star.dataset.pop = (Math.random() * 50).toFixed(1) + 'B';
        star.dataset.industry = Math.floor(Math.random() * 100);
        star.addEventListener('mouseenter', onStarHover);
        star.addEventListener('mouseleave', onStarLeave);
        layer.appendChild(star);
    }
    generateTradeRoutes();
}

function generateNebulae() {
    const layer = $('nebula-layer');
    const colors = ['#7c3aed', '#2563eb', '#059669', '#dc2626', '#d97706'];
    for (let i = 0; i < SIM.nebulaCount; i++) {
        const nebula = document.createElement('div');
        nebula.className = 'nebula';
        nebula.style.left = Math.random() * 80 + '%';
        nebula.style.top = Math.random() * 80 + '%';
        nebula.style.width = (100 + Math.random() * 200) + 'px';
        nebula.style.height = (80 + Math.random() * 150) + 'px';
        nebula.style.background = colors[i % colors.length];
        layer.appendChild(nebula);
    }
}

function generateFleets() {
    const layer = $('fleet-layer');
    const icons = ['◉', '◈', '◆', '✦', '✶'];
    for (let i = 0; i < SIM.fleetCount; i++) {
        const fleet = document.createElement('div');
        fleet.className = 'fleet-icon';
        fleet.textContent = icons[Math.floor(Math.random() * icons.length)];
        fleet.style.left = Math.random() * 95 + '%';
        fleet.style.top = Math.random() * 95 + '%';
        const fleetColors = ['#00d4aa', '#ff4757', '#ffa502', '#7bed9f', '#ff6b81'];
        fleet.style.color = fleetColors[Math.floor(Math.random() * 5)];
        fleet.style.opacity = 0.6 + Math.random() * 0.4;
        fleet.dataset.vx = String((Math.random() - 0.5) * 0.02);
        fleet.dataset.vy = String((Math.random() - 0.5) * 0.02);
        layer.appendChild(fleet);
    }
    animateFleets();
}

function generateTradeRoutes() {
    const map = $('star-map');
    const stars = $$('.star-system');
    const routeCount = 15;
    for (let i = 0; i < routeCount; i++) {
        const a = stars[Math.floor(Math.random() * stars.length)];
        const b = stars[Math.floor(Math.random() * stars.length)];
        if (a === b) continue;
        const route = document.createElement('div');
        route.className = 'trade-route';
        const ax = parseFloat(a.style.left);
        const ay = parseFloat(a.style.top);
        const bx = parseFloat(b.style.left);
        const by = parseFloat(b.style.top);
        const dx = bx - ax;
        const dy = by - ay;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        route.style.width = dist + '%';
        route.style.left = ax + '%';
        route.style.top = ay + '%';
        route.style.transform = 'rotate(' + angle + 'deg)';
        route.style.transformOrigin = '0 50%';
        map.insertBefore(route, map.firstChild);
    }
}

// ===== FLEET ANIMATION =====
function animateFleets() {
    const fleets = $$('.fleet-icon');
    function step() {
        fleets.forEach(function(f) {
            let x = parseFloat(f.style.left);
            let y = parseFloat(f.style.top);
            let vx = parseFloat(f.dataset.vx);
            let vy = parseFloat(f.dataset.vy);
            x += vx;
            y += vy;
            if (x < 0 || x > 95) {
                f.dataset.vx = String(-vx);
                vx = -vx;
            }
            if (y < 0 || y > 95) {
                f.dataset.vy = String(-vy);
                vy = -vy;
            }
            f.style.left = Math.max(0, Math.min(95, x)) + '%';
            f.style.top = Math.max(0, Math.min(95, y)) + '%';
        });
        requestAnimationFrame(step);
    }
    step();
}

// ===== STAR INTERACTIONS =====
function onStarHover(e) {
    const sys = e.target;
    const info = $('hovered-system');
    const factionColor = getFactionColor(sys.dataset.faction);
    info.innerHTML = '<span style="color:var(--accent-cyan)">&#9670; ' + sys.dataset.name + '</span> <span style="color:var(--text-dim)">|</span> <span style="color:' + factionColor + '">' + sys.dataset.faction + '</span> <span style="color:var(--text-dim)">|</span> <span>POP ' + sys.dataset.pop + '</span> <span style="color:var(--text-dim)">|</span> <span>IND ' + sys.dataset.industry + '%</span>';
}

function onStarLeave() {
    $('hovered-system').innerHTML = '<span class="system-placeholder">&#9670; HOVER SYSTEM FOR DETAILS</span>';
}

function getFactionColor(f) {
    const colors = {
        TC: '#00d4aa',
        VH: '#ff4757',
        CM: '#ffa502',
        SA: '#7bed9f',
        NS: '#ff6b81'
    };
    return colors[f] || '#7a7a8a';
}

// ===== LIVE SIMULATION =====
function startSimulation() {
    setInterval(simulationTick, 2000);
    setInterval(fastTick, 200);
}

function simulationTick() {
    SIM.tick += 1;
    updateResourceRates();
    updateFleetNumbers();
    updateTechProgress();
    addFeedItem();
    fluctuateMarkets();
}

function fastTick() {
    updateTelemetry();
    jitterValues();
}

function updateResourceRates() {
    const rates = $$('.resource-rate');
    const resources = [
        { base: 14.2, vol: 2, suffix: '' },
        { base: 892.7, vol: 50, suffix: ' &#128293;' },
        { base: 4201.0, vol: 200, suffix: '' },
        { base: 156.3, vol: 20, suffix: '' },
        { base: 2.1, vol: 0.3, suffix: ' &#10052;' },
        { base: 67.8, vol: 8, suffix: '' }
    ];
    rates.forEach(function(el, i) {
        if (!resources[i]) return;
        const r = resources[i];
        const newVal = (r.base + (Math.random() - 0.5) * r.vol).toFixed(r.base > 100 ? 1 : (r.base > 10 ? 1 : 2));
        el.textContent = '&#8353;' + newVal + r.suffix;
    });
}

function updateFleetNumbers() {
    const total = $('total-ships');
    const current = parseInt(total.textContent.replace(/,/g, ''));
    const change = Math.floor((Math.random() - 0.3) * 50);
    total.textContent = (current + change).toLocaleString();
}

function updateTechProgress() {
    const progresses = $$('.tech-progress');
    progresses.forEach(function(p) {
        const text = p.textContent;
        if (text === 'LOCKED') return;
        const num = parseInt(text);
        if (!isNaN(num) && num < 100) {
            p.textContent = Math.min(100, num + (Math.random() > 0.7 ? 1 : 0)) + '%';
        }
    });
}

function addFeedItem() {
    const feed = $('feed-stream');
    const stationNames = ['AURORA', 'NOVA', 'PULSAR', 'QUASAR'];
    const shipNames = ['ENIGMA', 'ODYSSEY', 'VOYAGER', 'PIONEER'];
    const shieldStates = ['CRITICAL', 'FAILING', 'DEGRADED'];
    const events = [
        {
            type: 'critical',
            icon: '&#9874;',
            text: 'FLEET ALPHA-9 LOST — KRAKEN BETA SECTOR ' + (Math.random() * 10).toFixed(1) + '.' + Math.floor(Math.random() * 9) + ' — ' + Math.floor(Math.random() * 20000) + ' CASUALTIES'
        },
        {
            type: 'warning',
            icon: '&#9889;',
            text: 'STATION ' + stationNames[Math.floor(Math.random() * stationNames.length)] + '-' + Math.floor(Math.random() * 20) + ' SHIELDS ' + shieldStates[Math.floor(Math.random() * shieldStates.length)]
        },
        {
            type: '',
            icon: '&#8779;',
            text: 'TRADE CONVOY ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '-' + Math.floor(Math.random() * 999) + ' DEPARTED — ' + Math.floor(Math.random() * 10) + '.' + Math.floor(Math.random() * 9) + '&#8353;M CARGO'
        },
        {
            type: 'info',
            icon: '&#9672;',
            text: 'COLONY SHIP ' + shipNames[Math.floor(Math.random() * shipNames.length)] + '-' + Math.floor(Math.random() * 10) + ' LAUNCHED'
        },
        {
            type: '',
            icon: '&#9883;',
            text: 'ANOMALY AX-' + Math.floor(9900 + Math.random() * 100) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + ' CONTAINMENT UPDATE'
        },
        {
            type: 'warning',
            icon: '&#128185;',
            text: 'VORPAX HIVE MOVEMENT DETECTED — ' + Math.floor(Math.random() * 500) + ' SHIPS — SECTOR ' + Math.floor(Math.random() * 12) + '.' + Math.floor(Math.random() * 9) + '.' + Math.floor(Math.random() * 9)
        }
    ];
    const ev = events[Math.floor(Math.random() * events.length)];
    const item = document.createElement('div');
    item.className = 'feed-item ' + ev.type;
    const timeStr = String(Math.floor(Math.random() * 60)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0');
    item.innerHTML = '<span class="feed-time">' + timeStr + '</span> <span class="feed-icon">' + ev.icon + '</span> <span class="feed-text">' + ev.text + '</span>';
    feed.insertBefore(item, feed.firstChild);
    if (feed.children.length > 20) {
        feed.removeChild(feed.lastChild);
    }
}

function fluctuateMarkets() {
    const bars = $$('.bar-fill');
    bars.forEach(function(b) {
        const current = parseFloat(b.style.width) || 50;
        const change = (Math.random() - 0.5) * 10;
        b.style.width = Math.max(5, Math.min(95, current + change)) + '%';
    });
}

function updateTelemetry() {
    const cpu = $('cpu-load');
    const mem = $('mem-load');
    const net = $('net-load');
    const lat = $('latency');
    const cpuVal = Math.floor(25 + Math.random() * 20);
    cpu.textContent = cpuVal + '%';
    cpu.nextElementSibling.firstElementChild.style.width = cpuVal + '%';
    const memVal = Math.floor(55 + Math.random() * 20);
    mem.textContent = memVal + '%';
    mem.nextElementSibling.firstElementChild.style.width = memVal + '%';
    const netVal = (10 + Math.random() * 6).toFixed(1);
    net.textContent = netVal + ' TB/s';
    net.nextElementSibling.firstElementChild.style.width = Math.floor(netVal / 20 * 100) + '%';
    lat.textContent = Math.floor(2 + Math.random() * 6) + 'ms';
}

function jitterValues() {
    const trends = $$('.faction-trend');
    trends.forEach(function(t) {
        if (Math.random() > 0.9) {
            const val = (Math.random() * 5).toFixed(1);
            const dir = Math.random() > 0.4 ? '&#9650;' : '&#9660;';
            const color = dir === '&#9650;' ? 'var(--accent-green)' : 'var(--accent-red)';
            t.textContent = dir + ' ' + val + '%';
            t.style.color = color;
        }
    });
}

// ===== INTERACTIONS =====
function setupInteractions() {
    const mapBtns = $$('.map-btn');
    mapBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            mapBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
        });
    });
    const feedBtns = $$('.feed-btn');
    feedBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            feedBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            filterFeed(btn.textContent);
        });
    });
}

function filterFeed(type) {
    const items = $$('.feed-item');
    items.forEach(function(item) {
        if (type === 'ALL') {
            item.style.display = '';
        } else if (type === 'COMBAT') {
            item.style.display = item.classList.contains('critical') || item.classList.contains('warning') ? '' : 'none';
        } else if (type === 'TRADE') {
            item.style.display = item.textContent.indexOf('TRADE') > -1 || item.textContent.indexOf('CONVOY') > -1 ? '' : 'none';
        } else if (type === 'DIPLO') {
            item.style.display = item.textContent.indexOf('COLONY') > -1 || item.textContent.indexOf('ANOMALY') > -1 ? '' : 'none';
        }
    });
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);