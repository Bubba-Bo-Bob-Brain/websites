// ========================================
// NEXUS-7 // Galactic Operations Dashboard
// JavaScript - Interactive Features & Data Simulation
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // Configuration
    // ========================================
    const CONFIG = {
        updateIntervals: {
            gameTime: 1000,
            resources: 3000,
            events: 2500,
            stats: 5000,
            map: 50
        },
        starCount: 400,
        resourceHistory: 20,
        eventHistory: 50
    };

    // ========================================
    // State Management
    // ========================================
    const state = {
        gameTime: { year: 2847, day: 235, hour: 17, minute: 42, second: 33 },
        resources: {
            tritanium: { rate: 12450, stock: 8200000, history: [] },
            pyerite: { rate: 8320, stock: 5700000, history: [] },
            mexallon: { rate: 5670, stock: 3400000, history: [] },
            isogen: { rate: 2340, stock: 1900000, history: [] },
            nocxium: { rate: 890, stock: 678000, history: [] },
            zydrine: { rate: 450, stock: 312000, history: [] },
            megacyte: { rate: 120, stock: 89000, history: [] },
            morphite: { rate: 45, stock: 34000, history: [] }
        },
        events: [],
        onlinePlayers: 847321,
        lastUpdate: Date.now()
    };

    // Initialize resource history
    Object.keys(state.resources).forEach(key => {
        for (let i = 0; i < CONFIG.resourceHistory; i++) {
            state.resources[key].history.push(state.resources[key].stock);
        }
    });

    // ========================================
    // Utility Functions
    // ========================================
    function formatNumber(num, decimals = 0) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toFixed(decimals);
    }

    function formatTime(date) {
        return date.toTimeString().split(' ')[0];
    }

    function generateGameTime() {
        const now = new Date();
        state.gameTime.second = now.getSeconds();
        state.gameTime.minute = now.getMinutes();
        state.gameTime.hour = now.getHours();
        
        // Increment game time faster than real time (24x speed)
        const totalSeconds = state.gameTime.day * 86400 + state.gameTime.hour * 3600 + 
                           state.gameTime.minute * 60 + state.gameTime.second;
        const acceleratedSeconds = totalSeconds * 24;
        
        state.gameTime.day = Math.floor(acceleratedSeconds / 86400) % 365;
        state.gameTime.year = 2847 + Math.floor(acceleratedSeconds / (86400 * 365));
        
        const daySeconds = acceleratedSeconds % 86400;
        state.gameTime.hour = Math.floor(daySeconds / 3600);
        state.gameTime.minute = Math.floor((daySeconds % 3600) / 60);
        state.gameTime.second = daySeconds % 60;
        
        return `Stardate ${state.gameTime.year}.${state.gameTime.day}.${String(state.gameTime.hour).padStart(2, '0')}:${String(state.gameTime.minute).padStart(2, '0')}:${String(state.gameTime.second).padStart(2, '0')}`;
    }

    // ========================================
    // Top Bar Updates
    // ========================================
    function updateTopBar() {
        // Update game time
        const gameTimeEl = document.getElementById('game-time');
        if (gameTimeEl) {
            gameTimeEl.textContent = generateGameTime();
        }
        
        // Update real time
        const realTimeEl = document.getElementById('real-time');
        if (realTimeEl) {
            realTimeEl.textContent = `🕐 ${formatTime(new Date())} UTC`;
        }
        
        // Update ping (simulated fluctuation)
        const pingEl = document.querySelector('.ping');
        if (pingEl) {
            pingEl.textContent = `${Math.floor(10 + Math.random() * 15)}ms`;
        }
        
        // Update player stats occasionally
        if (Math.random() < 0.1) {
            const scoreEl = document.querySelector('.player-stats span:nth-child(3)');
            if (scoreEl) {
                const currentScore = parseInt(scoreEl.textContent.replace(/[^0-9]/g, ''));
                scoreEl.textContent = `🏆 Score: ${formatNumber(currentScore + Math.floor(Math.random() * 100))}`;
            }
        }
    }

    // ========================================
    // Resource Panel Updates
    // ========================================
    function updateResources() {
        const resourceNames = {
            tritanium: 'Tritanium',
            pyerite: 'Pyerite',
            mexallon: 'Mexallon',
            isogen: 'Isogen',
            nocxium: 'Nocxium',
            zydrine: 'Zydrine',
            megacyte: 'Megacyte',
            morphite: 'Morphite'
        };
        
        Object.keys(state.resources).forEach(key => {
            const res = state.resources[key];
            
            // Simulate rate fluctuations
            const rateChange = 0.95 + Math.random() * 0.1;
            res.rate = Math.floor(res.rate * rateChange);
            res.rate = Math.max(10, Math.min(res.rate * 1.5, res.rate));
            
            // Update stock
            res.stock += res.rate;
            
            // Keep history
            res.history.push(res.stock);
            if (res.history.length > CONFIG.resourceHistory) {
                res.history.shift();
            }
            
            // Update table row
            const row = document.querySelector(`.resource-table tbody tr:nth-child(${Object.keys(state.resources).indexOf(key) + 1})`);
            if (row) {
                const cells = row.cells;
                cells[1].textContent = `${formatNumber(res.rate)}/s`;
                cells[2].textContent = formatNumber(res.stock);
                
                // Update trend indicator
                const trendCell = cells[3];
                const trend = (res.history[res.history.length - 1] - res.history[0]) / res.history[0] * 100;
                trendCell.className = trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'stable';
                trendCell.textContent = trend > 0 ? `▲${Math.abs(trend).toFixed(1)}%` : 
                                       trend < 0 ? `▼${Math.abs(trend).toFixed(1)}%` : '−0.0%';
            }
        });
        
        // Draw resource graph
        drawResourceGraph();
    }

    function drawResourceGraph() {
        const canvas = document.getElementById('resource-graph');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw resource lines (sample a few)
        const colors = ['#00f0ff', '#ff00ff', '#ffaa00', '#00ff88'];
        let colorIndex = 0;
        
        Object.keys(state.resources).slice(0, 4).forEach(key => {
            const data = state.resources[key].history;
            if (data.length < 2) return;
            
            const max = Math.max(...data);
            const min = Math.min(...data);
            const range = max - min || 1;
            
            ctx.strokeStyle = colors[colorIndex % colors.length];
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            data.forEach((value, i) => {
                const x = (i / (data.length - 1)) * width;
                const y = height - ((value - min) / range) * (height - 10) - 5;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            
            ctx.stroke();
            colorIndex++;
        });
    }

    // ========================================
    // Event Stream Updates
    // ========================================
    const eventTemplates = [
        { type: 'critical', text: ['🚨 Horde fleet spotted in Vega Sector!', '🚨 Alliance citadel under attack!', '🚨 Resource depletion warning: Asteroid Belt-7', '🚨 Server lag detected in Cluster-4'] },
        { type: 'warning', text: ['⚠️ Resource depletion warning: Asteroid Belt-7', '⚠️ Server lag detected in Cluster-4', '⚠️ Unauthorized access attempt blocked', '⚠️ Fleet supply running low'] },
        { type: 'info', text: ['ℹ️ New player milestone: 1M active commanders', 'ℹ️ Weekly reset in 2h 23m', 'ℹ️ Server maintenance scheduled', 'ℹ️ New expansion patch deployed'] },
        { type: 'success', text: ['✅ Trade route secured: Titan ↔ Mars', '✅ Research completed: Shield Recharge V', '✅ Fleet reinforcement arrived', '✅ Mining operation completed'] }
    ];

    function addEvent() {
        const eventTemplate = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        const event = {
            time: formatTime(new Date()),
            type: eventTemplate.type,
            text: eventTemplate.text[Math.floor(Math.random() * eventTemplate.text.length)]
        };
        
        state.events.unshift(event);
        if (state.events.length > CONFIG.eventHistory) {
            state.events.pop();
        }
        
        // Update DOM
        const eventStream = document.querySelector('.event-stream');
        if (eventStream) {
            const eventEl = document.createElement('div');
            eventEl.className = `event-item ${event.type}`;
            eventEl.innerHTML = `
                <span class="event-time">${event.time}</span>
                <span class="event-text">${event.text}</span>
            `;
            eventStream.insertBefore(eventEl, eventStream.firstChild);
            
            // Remove excess events
            while (eventStream.children.length > CONFIG.eventHistory) {
                eventStream.removeChild(eventStream.lastChild);
            }
        }
    }

    // ========================================
    // Player Stats Updates
    // ========================================
    function updatePlayerStats() {
        // Fluctuate online players
        const change = Math.floor((Math.random() - 0.5) * 500);
        state.onlinePlayers = Math.max(100000, state.onlinePlayers + change);
        
        const onlineEl = document.querySelector('.activity-stats .stat-row:nth-child(1) .stat-value');
        if (onlineEl) {
            onlineEl.textContent = formatNumber(state.onlinePlayers);
        }
        
        // Update activity breakdown
        const activities = [
            Math.floor(state.onlinePlayers * 0.01), // In combat
            Math.floor(state.onlinePlayers * 0.05), // Trading
            Math.floor(state.onlinePlayers * 0.09), // Mining
            Math.floor(state.onlinePlayers * 0.04), // Exploring
            Math.floor(state.onlinePlayers * 0.67)  // Questing
        ];
        
        const activityEls = document.querySelectorAll('.activity-stats .stat-row .stat-value');
        activities.forEach((value, i) => {
            if (activityEls[i + 1]) { // Skip first (online total)
                activityEls[i + 1].textContent = formatNumber(value);
            }
        });
    }

    // ========================================
    // Star Map (Canvas)
    // ========================================
    class StarMap {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.stars = [];
            this.sectors = [];
            this.selectedSector = null;
            this.hoveredStar = null;
            this.zoom = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            this.isDragging = false;
            this.dragStart = { x: 0, y: 0 };
            
            this.resize();
            this.generateStars();
            this.generateSectors();
            this.setupEvents();
            this.animate();
        }
        
        resize() {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        }
        
        generateStars() {
            this.stars = [];
            for (let i = 0; i < CONFIG.starCount; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: 0.5 + Math.random() * 1.5,
                    brightness: 0.3 + Math.random() * 0.7,
                    faction: ['alliance', 'horde', 'syndicate', 'independents'][Math.floor(Math.random() * 4)],
                    twinkle: Math.random() * Math.PI * 2,
                    twinkleSpeed: 0.02 + Math.random() * 0.05
                });
            }
        }
        
        generateSectors() {
            this.sectors = [
                { name: 'Vega Prime', x: 0.3, y: 0.4, faction: 'alliance', planets: 12, fleets: 3, players: 45000 },
                { name: 'Orion Nebula', x: 0.6, y: 0.35, faction: 'syndicate', planets: 8, fleets: 2, players: 32000 },
                { name: 'Kepler-186f', x: 0.7, y: 0.6, faction: 'horde', planets: 15, fleets: 4, players: 67000 },
                { name: 'Deep Space-9', x: 0.4, y: 0.7, faction: 'independents', planets: 5, fleets: 1, players: 12000 },
                { name: 'Titan Station', x: 0.2, y: 0.3, faction: 'alliance', planets: 3, fleets: 2, players: 28000 },
                { name: 'Helios Prime', x: 0.8, y: 0.25, faction: 'syndicate', planets: 10, fleets: 3, players: 41000 },
                { name: 'Battlefront-Alpha', x: 0.5, y: 0.5, faction: 'contested', planets: 7, fleets: 5, players: 89000 },
                { name: 'Mars Colony', x: 0.25, y: 0.6, faction: 'alliance', planets: 4, fleets: 1, players: 18000 }
            ];
        }
        
        setupEvents() {
            this.canvas.addEventListener('click', (e) => this.handleClick(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
            this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
            
            window.addEventListener('resize', () => {
                this.resize();
                this.generateStars();
            });
        }
        
        handleClick(e) {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.offsetX) / this.zoom;
            const y = (e.clientY - rect.top - this.offsetY) / this.zoom;
            
            // Check sector clicks
            for (const sector of this.sectors) {
                const sx = sector.x * this.canvas.width;
                const sy = sector.y * this.canvas.height;
                const distance = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
                
                if (distance < 30) {
                    this.selectSector(sector);
                    break;
                }
            }
        }
        
        handleMouseMove(e) {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.offsetX) / this.zoom;
            const y = (e.clientY - rect.top - this.offsetY) / this.zoom;
            
            // Check hover
            let hovered = null;
            for (const sector of this.sectors) {
                const sx = sector.x * this.canvas.width;
                const sy = sector.y * this.canvas.height;
                const distance = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
                
                if (distance < 25) {
                    hovered = sector;
                    break;
                }
            }
            
            this.hoveredStar = hovered;
            this.canvas.style.cursor = hovered ? 'pointer' : 'grab';
            
            // Handle dragging
            if (this.isDragging) {
                this.offsetX += e.movementX;
                this.offsetY += e.movementY;
                this.canvas.style.cursor = 'grabbing';
            }
        }
        
        handleWheel(e) {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom = Math.max(0.5, Math.min(3, this.zoom * zoomFactor));
        }
        
        handleMouseDown(e) {
            this.isDragging = true;
            this.dragStart = { x: e.clientX, y: e.clientY };
        }
        
        handleMouseUp() {
            this.isDragging = false;
        }
        
        selectSector(sector) {
            this.selectedSector = sector;
            const mapInfo = document.getElementById('map-info');
            if (mapInfo) {
                const factionEmojis = {
                    alliance: '🔵',
                    horde: '🔴',
                    syndicate: '🟡',
                    independents: '🟢',
                    contested: '⚫'
                };
                mapInfo.innerHTML = `
                    <h4>${factionEmojis[sector.faction]} ${sector.name}</h4>
                    <p>${sector.planets} planets • ${sector.fleets} fleets • ${formatNumber(sector.players)} players</p>
                    <p style="margin-top: 4px; color: var(--neon-cyan);">Faction: ${sector.faction.toUpperCase()}</p>
                `;
            }
        }
        
        animate() {
            const ctx = this.ctx;
            const width = this.canvas.width;
            const height = this.canvas.height;
            
            // Clear with trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);
            
            // Save context for transformations
            ctx.save();
            ctx.translate(this.offsetX, this.offsetY);
            ctx.scale(this.zoom, this.zoom);
            
            // Draw stars
            const time = Date.now() / 1000;
            this.stars.forEach(star => {
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkle) * 0.3 + 0.7;
                const alpha = star.brightness * twinkle;
                
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Draw sector connections
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < this.sectors.length; i++) {
                for (let j = i + 1; j < this.sectors.length; j++) {
                    const s1 = this.sectors[i];
                    const s2 = this.sectors[j];
                    const distance = Math.sqrt((s1.x - s2.x) ** 2 + (s1.y - s2.y) ** 2);
                    
                    if (distance < 0.3) {
                        ctx.beginPath();
                        ctx.moveTo(s1.x * width, s1.y * height);
                        ctx.lineTo(s2.x * width, s2.y * height);
                        ctx.stroke();
                    }
                }
            }
            
            // Draw sectors
            this.sectors.forEach(sector => {
                const x = sector.x * width;
                const y = sector.y * height;
                const isHovered = this.hoveredStar && this.hoveredStar.name === sector.name;
                const isSelected = this.selectedSector && this.selectedSector.name === sector.name;
                const radius = (isHovered || isSelected) ? 15 : 10;
                
                // Sector circle
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                
                const factionColors = {
                    alliance: '#4488ff',
                    horde: '#ff3344',
                    syndicate: '#ffaa00',
                    independents: '#00ff88',
                    contested: '#ff00ff'
                };
                
                ctx.fillStyle = factionColors[sector.faction] + '80';
                ctx.fill();
                
                if (isSelected) {
                    ctx.strokeStyle = '#00f0ff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Glow effect
                    ctx.shadowColor = '#00f0ff';
                    ctx.shadowBlur = 10;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                } else if (isHovered) {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                
                // Sector label
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px JetBrains Mono';
                ctx.textAlign = 'center';
                ctx.fillText(sector.name, x, y - radius - 5);
            });
            
            ctx.restore();
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // ========================================
    // Tab Functionality
    // ========================================
    function setupTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabGroup = this.closest('.resource-tabs, .fleet-tabs');
                if (!tabGroup) return;
                
                // Remove active from all tabs in this group
                tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Filter content based on tab
                const tabName = this.dataset.tab;
                const contentContainer = tabGroup.closest('.panel').querySelector('.panel-content');
                
                if (tabGroup.classList.contains('resource-tabs')) {
                    // Filter resource table
                    const rows = contentContainer.querySelectorAll('.resource-table tbody tr');
                    rows.forEach(row => {
                        const resource = row.cells[0].textContent.toLowerCase();
                        if (tabName === 'all') {
                            row.style.display = '';
                        } else if (tabName === 'metals' && ['tritanium', 'pyerite', 'mexallon'].some(r => resource.includes(r))) {
                            row.style.display = '';
                        } else if (tabName === 'gases' && ['isogen'].some(r => resource.includes(r))) {
                            row.style.display = '';
                        } else if (tabName === 'crystals' && ['nocxium', 'zydrine', 'megacyte', 'morphite'].some(r => resource.includes(r))) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                } else if (tabGroup.classList.contains('fleet-tabs')) {
                    // Filter fleet list
                    const fleets = contentContainer.querySelectorAll('.fleet-entry');
                    fleets.forEach(fleet => {
                        const status = fleet.querySelector('.fleet-status').classList;
                        if (tabName === 'active' && status.contains('deployed')) {
                            fleet.style.display = '';
                        } else if (tabName === 'reinforcing' && status.contains('transit')) {
                            fleet.style.display = '';
                        } else if (tabName === 'returning' && status.contains('patrol')) {
                            fleet.style.display = '';
                        } else {
                            fleet.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    // ========================================
    // Panel Collapse Functionality
    // ========================================
    function setupCollapseButtons() {
        document.querySelectorAll('.collapse').forEach(btn => {
            btn.addEventListener('click', function() {
                const panel = this.closest('.panel');
                const content = panel.querySelector('.panel-content');
                
                if (content.style.display === 'none') {
                    content.style.display = 'flex';
                    this.textContent = '−';
                    panel.style.flex = '1';
                } else {
                    content.style.display = 'none';
                    this.textContent = '+';
                    panel.style.flex = '0 0 auto';
                    panel.style.height = 'auto';
                }
            });
        });
    }

    // ========================================
    // Map Controls
    // ========================================
    function setupMapControls() {
        const buttons = document.querySelectorAll('.map-controls .btn-mini');
        buttons.forEach(btn => {
            if (btn.textContent === '🌐 All') {
                btn.addEventListener('click', () => {
                    // Reset filters
                    document.querySelectorAll('.map-controls .btn-mini').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    // Show all sectors (would filter map if implemented)
                });
            }
            // Add other control handlers as needed
        });
    }

    // ========================================
    // Bottom Bar Updates
    // ========================================
    function updateBottomBar() {
        const bars = document.querySelectorAll('.mini-bar .bar-fill');
        bars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width) || 50;
            const change = (Math.random() - 0.5) * 10;
            let newWidth = Math.max(5, Math.min(95, currentWidth + change));
            bar.style.width = `${newWidth}%`;
            
            // Change color based on load
            if (newWidth > 80) {
                bar.style.background = 'var(--neon-red)';
            } else if (newWidth > 60) {
                bar.style.background = 'var(--neon-amber)';
            } else {
                bar.style.background = 'var(--neon-cyan)';
            }
        });
        
        // Update data flow numbers
        const dataFlowEl = document.querySelector('.connection-info span:nth-child(2)');
        if (dataFlowEl) {
            const flow = (2 + Math.random() * 2).toFixed(1);
            dataFlowEl.textContent = `📊 ${flow}TB/s data flow`;
        }
    }

    // ========================================
    // Tooltip System
    // ========================================
    function setupTooltips() {
        // Tooltip functionality is handled by StarMap class
    }

    // ========================================
    // Initialize Everything
    // ========================================
    function init() {
        // Initialize star map
        const starMap = new StarMap('star-map');
        
        // Setup UI interactions
        setupTabs();
        setupCollapseButtons();
        setupMapControls();
        setupTooltips();
        
        // Start update loops
        setInterval(updateTopBar, CONFIG.updateIntervals.gameTime);
        setInterval(updateResources, CONFIG.updateIntervals.resources);
        setInterval(() => addEvent(), CONFIG.updateIntervals.events);
        setInterval(updatePlayerStats, CONFIG.updateIntervals.stats);
        setInterval(updateBottomBar, CONFIG.updateIntervals.stats);
        
        // Initial updates
        updateTopBar();
        updateResources();
        updatePlayerStats();
        updateBottomBar();
        
        // Add some initial events
        for (let i = 0; i < 8; i++) {
            addEvent();
        }
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Deselect sector
                const mapInfo = document.getElementById('map-info');
                if (mapInfo) {
                    mapInfo.innerHTML = '<h4>SELECT A SECTOR</h4><p>Click on any star system to view detailed information</p>';
                }
                starMap.selectedSector = null;
            }
        });
        
        console.log('🚀 NEXUS-7 Dashboard initialized');
    }
    
    // Start the engine
    init();
});