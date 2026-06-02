/* =========================================
   GAIA PRIME — PLANETARY COMMAND DASHBOARD
   SCRIPTS v4.7.2
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initPopulationCounter();
    initTickers();
    initFeeds();
    initCanvases();
    initAlertSystem();
});

// --- CLOCK & UPTIME ---
function initClock() {
    const gmtEl = document.getElementById('gmt-time');
    const uptimeEl = document.getElementById('uptime-counter');
    const syncEl = document.getElementById('last-sync');
    
    let uptimeSeconds = 847 * 86400 + 14 * 3600 + 23 * 60 + 7; // Starting uptime from HTML

    function updateClock() {
        const now = new Date();
        const gmtStr = now.toISOString().split('T')[1].split('.')[0];
        const ms = now.getMilliseconds().toString().padStart(3, '0');
        
        if (gmtEl) gmtEl.textContent = `${gmtStr}.${ms}`;
        
        if (syncEl) {
            // Randomly jitter sync time to simulate network activity
            if (Math.random() > 0.95) {
                syncEl.textContent = now.toISOString().split('T')[1].split('.')[0] + ' UTC';
            }
        }

        uptimeSeconds++;
        const d = Math.floor(uptimeSeconds / 86400);
        const h = Math.floor((uptimeSeconds % 86400) / 3600);
        const m = Math.floor((uptimeSeconds % 3600) / 60);
        const s = uptimeSeconds % 60;
        
        if (uptimeEl) {
            uptimeEl.textContent = `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
        }
    }

    setInterval(updateClock, 100); // Update every 100ms for smooth ms display
}

// --- POPULATION COUNTER ---
function initPopulationCounter() {
    const popEl = document.getElementById('pop-counter');
    if (!popEl) return;

    // Start at 8,147,293,847
    let population = 8147293847;
    const rate = 2.3; // per second

    function updatePop() {
        population += rate / 10; // 100ms interval
        popEl.textContent = Math.floor(population).toLocaleString();
    }

    setInterval(updatePop, 100);
}

// --- MARKET & DATA TICKERS ---
function initTickers() {
    const tickers = document.querySelectorAll('.ticker-val');
    const commodities = document.querySelectorAll('.commodity-row span');
    
    function jitterTickers() {
        tickers.forEach(t => {
            if (Math.random() > 0.7) {
                let val = parseFloat(t.textContent.replace(/,/g, ''));
                let change = (Math.random() - 0.5) * val * 0.002;
                val += change;
                t.textContent = val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                // Update color class based on change direction
                const parent = t.parentElement;
                if (change > 0) {
                    parent.classList.remove('down');
                    parent.classList.add('up');
                    const chgEl = parent.querySelector('.ticker-chg');
                    if (chgEl) {
                        chgEl.textContent = `+${(Math.random() * 1.5).toFixed(1)}%`;
                        chgEl.style.color = 'var(--color-green)';
                    }
                } else {
                    parent.classList.remove('up');
                    parent.classList.add('down');
                    const chgEl = parent.querySelector('.ticker-chg');
                    if (chgEl) {
                        chgEl.textContent = `-${(Math.random() * 1.5).toFixed(1)}%`;
                        chgEl.style.color = 'var(--color-red)';
                    }
                }
            }
        });

        commodities.forEach(c => {
            // Skip the first span which is the icon/name, target the value span
            if (c.parentElement.classList.contains('commodity-row')) {
                const valSpan = c.nextElementSibling; // The value
                // Actually structure is: Icon/Name <span>Value</span> <span>Chg</span>
                // Let's look for the text node or spans directly
                // The selector .commodity-row span targets all spans inside.
                // Index 0 is value, Index 1 is change.
            }
        });
        
        // Specific fix for commodity rows structure
        document.querySelectorAll('.commodity-row').forEach(row => {
            const spans = row.querySelectorAll('span');
            if (spans.length >= 2) {
                const valEl = spans[0];
                const chgEl = spans[1];
                if (Math.random() > 0.8) {
                    let currentVal = parseFloat(valEl.textContent.replace(/[$,/a-z]/gi, ''));
                    let delta = (Math.random() - 0.5) * currentVal * 0.01;
                    let newVal = currentVal + delta;
                    
                    let formatted = valEl.textContent;
                    if (formatted.includes('$')) formatted = `$${newVal.toFixed(2)}`;
                    else if (formatted.includes('/')) formatted = `${newVal.toFixed(2)}${formatted.split(/[\d.]/).pop()}`;
                    else formatted = newVal.toFixed(2);
                    
                    valEl.textContent = formatted;
                    
                    if (delta > 0) {
                        chgEl.textContent = `+${(Math.random() * 2).toFixed(1)}%`;
                        chgEl.className = 'chg up';
                    } else {
                        chgEl.textContent = `-${(Math.random() * 2).toFixed(1)}%`;
                        chgEl.className = 'chg down';
                    }
                }
            }
        });
    }

    setInterval(jitterTickers, 2000);
}

// --- FEED SCROLLING ---
function initFeeds() {
    const seismicFeed = document.getElementById('seismic-feed');
    const alertFeed = document.querySelector('.alerts-feed');

    // Seismic Feed Simulation
    if (seismicFeed) {
        setInterval(() => {
            const mags = ['M3.2', 'M4.1', 'M2.8', 'M5.0', 'M3.9', 'M4.5'];
            const locs = ['🇯🇵 Kyushu', '🇨🇱 Valparaiso', '🇮🇸 Reykjavik', '🇺🇸 Alaska', '🇮🇩 Sumatra', '🇹🇷 Istanbul'];
            
            const mag = mags[Math.floor(Math.random() * mags.length)];
            const loc = locs[Math.floor(Math.random() * locs.length)];
            const depth = Math.floor(Math.random() * 50) + 'km';
            const now = new Date().toISOString().split('T')[1].split('.')[0];
            
            const item = document.createElement('div');
            item.className = 'feed-item';
            item.innerHTML = `
                <span class="feed-time">${now}</span>
                <span class="feed-mag">${mag}</span>
                <span class="feed-location">${loc}</span>
                <span class="feed-depth">${depth}</span>
            `;
            
            // Insert at top
            seismicFeed.insertBefore(item, seismicFeed.firstChild);
            
            // Keep only last 8 items
            if (seismicFeed.children.length > 8) {
                seismicFeed.removeChild(seismicFeed.lastChild);
            }
            
            // Flash effect
            item.style.backgroundColor = 'rgba(0, 240, 255, 0.2)';
            setTimeout(() => item.style.backgroundColor = '', 500);
            
        }, 4000);
    }
}

// --- ALERT SYSTEM ---
function initAlertSystem() {
    const alertBadge = document.getElementById('alert-badge');
    let alertCount = 3;

    setInterval(() => {
        if (Math.random() > 0.8) {
            alertCount = Math.max(1, Math.min(9, alertCount + (Math.random() > 0.5 ? 1 : -1)));
            if (alertBadge) alertBadge.textContent = `⚠ ${alertCount} ACTIVE`;
        }
    }, 5000);
}

// --- CANVAS ANIMATION ENGINE ---
function initCanvases() {
    const canvases = document.querySelectorAll('canvas');
    
    // Map of drawing functions
    const drawFunctions = {
        'globe-canvas': drawGlobe,
        'age-canvas': drawAgePyramid,
        'plate-canvas': drawPlateTectonics,
        'climate-canvas': drawClimateChart,
        'energy-canvas': drawEnergyMix,
        'trade-canvas': drawTradeRoutes,
        'orbit-canvas': drawOrbit,
        'network-canvas': drawNetwork,
        'dataflow-canvas': drawDataFlow,
        'sealevel-canvas': drawSeaLevel,
        'co2-canvas': drawCO2Curve,
        'atmo-canvas': drawAtmoChart,
        'science-canvas': drawScienceChart,
        'worldmap-canvas': drawWorldMap
    };

    // State storage for animations
    const state = {
        globeRotation: 0,
        tradeDots: [],
        orbitDots: [],
        networkPulses: [],
        dataParticles: [],
        time: 0
    };

    // Initialize specific states
    for(let i=0; i<15; i++) state.tradeDots.push({ t: Math.random(), speed: 0.002 + Math.random()*0.003, path: i % 3 });
    for(let i=0; i<20; i++) state.orbitDots.push({ angle: Math.random() * Math.PI * 2, radius: 30 + Math.random()*50, speed: 0.01 + Math.random()*0.02 });
    for(let i=0; i<30; i++) state.dataParticles.push({ x: Math.random() * 300, speed: 1 + Math.random() * 3 });

    function animate() {
        state.time += 0.05;
        
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            // Handle HiDPI
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            // Only resize if needed to avoid constant thrashing, but ensure correct dimensions
            if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
            }
            
            const w = rect.width;
            const h = rect.height;
            
            // Clear
            ctx.clearRect(0, 0, w, h);
            
            // Call specific draw function
            const drawFn = drawFunctions[canvas.id];
            if (drawFn) {
                drawFn(ctx, w, h, state);
            }
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// --- DRAWING FUNCTIONS ---

function drawGlobe(ctx, w, h, state) {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 10;

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;

    // Outer circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Lat/Lon lines with rotation effect
    const rot = state.globeRotation;
    state.globeRotation += 0.005;

    // Horizontal lines
    for (let i = -2; i <= 2; i++) {
        const y = cy + (i * r / 3);
        const width = Math.sqrt(r*r - (y-cy)*(y-cy));
        ctx.beginPath();
        ctx.moveTo(cx - width, y);
        ctx.lineTo(cx + width, y);
        ctx.stroke();
    }

    // Vertical lines (simulated rotation)
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rot;
        const x1 = cx + r * Math.cos(angle);
        const x2 = cx + r * Math.cos(angle + Math.PI);
        // Ellipse projection
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(r * Math.cos(angle)), r, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1.0;
}

function drawAgePyramid(ctx, w, h) {
    const bars = [10, 15, 18, 14, 10, 8, 5, 3];
    const barH = h / bars.length - 2;
    const maxW = w / 2 - 5;
    const cx = w / 2;

    ctx.fillStyle = '#0077ff';
    
    bars.forEach((val, i) => {
        const barW = (val / 20) * maxW;
        const y = i * (barH + 2);
        
        // Left side
        ctx.fillRect(cx - barW, y, barW, barH);
        // Right side
        ctx.fillRect(cx, y, barW, barH);
        
        // Center line
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(cx - 0.5, y, 1, barH);
        ctx.fillStyle = '#0077ff';
    });
}

function drawPlateTectonics(ctx, w, h) {
    ctx.strokeStyle = '#ff7b00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Simulated fault line
    ctx.moveTo(0, h * 0.6);
    for(let x=0; x<=w; x+=10) {
        ctx.lineTo(x, h*0.6 + Math.sin(x*0.05)*10 + Math.random()*2);
    }
    ctx.stroke();

    ctx.fillStyle = '#ff3b3b';
    // Arrows indicating movement
    ctx.beginPath();
    ctx.moveTo(w*0.3, h*0.4);
    ctx.lineTo(w*0.35, h*0.6);
    ctx.lineTo(w*0.4, h*0.4);
    ctx.fill();

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(w*0.7, h*0.8);
    ctx.lineTo(w*0.65, h*0.6);
    ctx.lineTo(w*0.6, h*0.8);
    ctx.fill();
    
    ctx.font = '8px JetBrains Mono';
    ctx.fillStyle = '#fff';
    ctx.fillText('SUBDUCTION ZONE', 10, h*0.3);
}

function drawClimateChart(ctx, w, h) {
    ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    
    const points = 20;
    for(let i=0; i<=points; i++) {
        const x = (i / points) * w;
        const y = h/2 + Math.sin(i*0.5)*h*0.3 + Math.sin(i*0.2)*10;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.fill();
    
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawEnergyMix(ctx, w, h, state) {
    const cx = w/2;
    const cy = h/2;
    const r = Math.min(w,h)/2 - 10;
    
    const data = [80, 4, 7, 4, 3, 2]; // Percentages approx
    const colors = ['#4a4a4a', '#ffb700', '#0077ff', '#00ff9d', '#ff7b00', '#b866ff'];
    
    let startAngle = 0;
    data.forEach((val, i) => {
        const sliceAngle = (val / 100) * Math.PI * 2;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
        ctx.fill();
        startAngle += sliceAngle;
    });
    
    // Inner hole for donut
    ctx.fillStyle = '#03060a';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
}

function drawTradeRoutes(ctx, w, h, state) {
    // Simple map outline
    ctx.strokeStyle = '#1a3352';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, w-20, h-20);
    
    // Routes
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    
    const routes = [
        {start: {x: w*0.2, y: h*0.4}, end: {x: w*0.8, y: h*0.4}, cp: {x: w*0.5, y: h*0.2}},
        {start: {x: w*0.2, y: h*0.4}, end: {x: w*0.7, y: h*0.7}, cp: {x: w*0.6, y: h*0.8}},
        {start: {x: w*0.5, y: h*0.3}, end: {x: w*0.8, y: h*0.4}, cp: {x: w*0.6, y: h*0.3}}
    ];

    routes.forEach(route => {
        ctx.beginPath();
        ctx.moveTo(route.start.x, route.start.y);
        ctx.quadraticCurveTo(route.cp.x, route.cp.y, route.end.x, route.end.y);
        ctx.stroke();
    });

    // Moving dots
    ctx.globalAlpha = 1.0;
    state.tradeDots.forEach(dot => {
        dot.t += dot.speed;
        if (dot.t > 1) dot.t = 0;
        
        const r = routes[dot.path];
        // Bezier point calc
        const t = dot.t;
        const mt = 1-t;
        const x = mt*mt*r.start.x + 2*mt*t*r.cp.x + t*t*r.end.x;
        const y = mt*mt*r.start.y + 2*mt*t*r.cp.y + t*t*r.end.y;
        
        ctx.fillStyle = '#ffb700';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI*2);
        ctx.fill();
    });
}

function drawOrbit(ctx, w, h, state) {
    const cx = w/2;
    const cy = h/2;
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI*2);
    ctx.fill();
    
    state.orbitDots.forEach(dot => {
        dot.angle += dot.speed;
        const x = cx + Math.cos(dot.angle) * dot.radius;
        const y = cy + Math.sin(dot.angle) * dot.radius * 0.4; // Elliptical
        
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI*2);
        ctx.fill();
    });
}

function drawNetwork(ctx, w, h) {
    const nodes = [];
    const cols = 5;
    const rows = 4;
    const spacingX = w / (cols + 1);
    const spacingY = h / (rows + 1);
    
    for(let r=1; r<=rows; r++) {
        for(let c=1; c<=cols; c++) {
            nodes.push({x: c*spacingX, y: r*spacingY});
        }
    }
    
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Connect nearby
    for(let i=0; i<nodes.length; i++) {
        ctx.fillStyle = '#0077ff';
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 2, 0, Math.PI*2);
        ctx.fill();
        
        for(let j=i+1; j<nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < spacingX * 1.5) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }
}

function drawDataFlow(ctx, w, h, state) {
    ctx.fillStyle = '#00ff9d';
    state.dataParticles.forEach(p => {
        p.x += p.speed;
        if (p.x > w) p.x = 0;
        
        const y = Math.random() * h; // Jitter y for effect
        ctx.fillRect(p.x, y, 4, 2);
    });
}

function drawSeaLevel(ctx, w, h) {
    ctx.strokeStyle = '#ff3b3b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for(let x=0; x<=w; x+=2) {
        const y = h - (x/w)*h*0.5 - Math.sin(x*0.1)*5;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.lineTo(w, h);
    ctx.fillStyle = 'rgba(255, 59, 59, 0.1)';
    ctx.fill();
}

function drawCO2Curve(ctx, w, h) {
    ctx.strokeStyle = '#ffb700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for(let x=0; x<=w; x+=2) {
        const t = x/w;
        const y = h - (t*t)*h*0.8; // Exponential rise
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function drawAtmoChart(ctx, w, h) {
    // Bar chart for atmosphere
    const bars = [
        {val: 0.78, color: '#0077ff'}, // N2
        {val: 0.21, color: '#00ff9d'}, // O2
        {val: 0.01, color: '#b866ff'}, // Ar/Others
        {val: 0.005, color: '#ff3b3b'} // CO2
    ];
    
    const barW = w / bars.length - 4;
    bars.forEach((b, i) => {
        const x = i * (barW + 4) + 2;
        const barH = Math.max(2, b.val * h);
        ctx.fillStyle = b.color;
        ctx.fillRect(x, h - barH, barW, barH);
    });
}

function drawScienceChart(ctx, w, h) {
    // Radar chart
    const cx = w/2;
    const cy = h/2;
    const r = Math.min(w,h)/2 - 5;
    
    ctx.strokeStyle = 'rgba(184, 102, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.stroke();
    
    const points = 5;
    ctx.fillStyle = 'rgba(184, 102, 255, 0.5)';
    ctx.beginPath();
    for(let i=0; i<points; i++) {
        const angle = (i / points) * Math.PI * 2 - Math.PI/2;
        const rad = r * (0.4 + Math.random()*0.4);
        const x = cx + Math.cos(angle) * rad;
        const y = cy + Math.sin(angle) * rad;
        if(i===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

function drawWorldMap(ctx, w, h, state) {
    // Background Grid
    ctx.strokeStyle = 'rgba(26, 51, 82, 0.3)';
    ctx.lineWidth = 0.5;
    for(let x=0; x<w; x+=20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for(let y=0; y<h; y+=20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Random Event Dots
    // Use a seeded random based on time to make them persistent for a while but blinking
    const numDots = 40;
    for(let i=0; i<numDots; i++) {
        // Pseudo-random position based on index
        const seed = i * 1337;
        const x = ((seed * 9301 + 49297) % 233280) / 233280 * w;
        const y = (((seed * 9301 + 49297) % 233280) / 233280 * h + i*50) % h;
        
        // Blink logic
        const blink = Math.sin(state.time * 2 + i) * 0.5 + 0.5;
        if (blink > 0.8) {
            ctx.fillStyle = ['#ff3b3b', '#ffb700', '#00f0ff', '#00ff9d'][i%4];
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI*2);
            ctx.fill();
            
            // Ring
            ctx.strokeStyle = ctx.fillStyle;
            ctx.globalAlpha = (1 - blink);
            ctx.beginPath();
            ctx.arc(x, y, 4 + blink*4, 0, Math.PI*2);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }
    }
}