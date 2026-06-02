// scripts.js
// NEXUS CORE Dashboard - Fantasy MMORPG World Simulation

document.addEventListener('DOMContentLoaded', function() {
    // ===== INITIALIZATION =====
    console.log('🔄 NEXUS CORE Initializing...');
    
    // DOM Elements
    const worldMapCanvas = document.getElementById('world-map');
    const gameTimeElement = document.getElementById('game-time');
    const seasonElement = document.getElementById('season');
    const moonPhaseElement = document.getElementById('moon-phase');
    const refreshTimeElement = document.getElementById('refresh-time');
    const guildRankingBody = document.querySelector('.ranking-body');
    const dungeonGrid = document.querySelector('.dungeon-grid');
    const commodityList = document.querySelector('.commodity-list');
    const buyOrders = document.querySelector('.buy-orders');
    const sellOrders = document.querySelector('.sell-orders');
    const heatmapGrid = document.querySelector('.heatmap-grid');
    const logEntries = document.querySelector('.log-entries');
    const notificationToast = document.getElementById('notification-toast');
    const toastClose = document.querySelector('.toast-close');
    const clearConsoleBtn = document.getElementById('clear-console');
    const pauseFeedBtn = document.getElementById('pause-feed');
    const exportLogBtn = document.getElementById('export-log');
    const commandInput = document.querySelector('.command-input');
    
    // State Variables
    let isPaused = false;
    let lastUpdateTime = new Date();
    let gameTimeOffset = 0;
    const ctx = worldMapCanvas.getContext('2d');
    
    // ===== INITIAL SETUP =====
    initializeCanvas();
    initializeGauges();
    generateGuildRankings();
    generateDungeonMatrix();
    generateCommodityData();
    generateOrderBook();
    generateHeatmap();
    startGameClock();
    startDynamicUpdates();
    startConsoleFeed();
    showNotification('NEXUS CORE Dashboard initialized successfully', 'success');
    
    // ===== CANVAS INITIALIZATION =====
    function initializeCanvas() {
        // Set canvas size
        worldMapCanvas.width = worldMapCanvas.parentElement.clientWidth;
        worldMapCanvas.height = worldMapCanvas.parentElement.clientHeight - 40;
        
        // Draw initial fantasy world map
        drawFantasyMap();
        
        // Redraw on resize
        window.addEventListener('resize', function() {
            worldMapCanvas.width = worldMapCanvas.parentElement.clientWidth;
            worldMapCanvas.height = worldMapCanvas.parentElement.clientHeight - 40;
            drawFantasyMap();
        });
    }
    
    function drawFantasyMap() {
        const width = worldMapCanvas.width;
        const height = worldMapCanvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw magical background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(10, 14, 23, 0.9)');
        gradient.addColorStop(1, 'rgba(26, 31, 53, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw fantasy continent shapes
        drawContinent(0.2, 0.3, 0.4, 0.6, '#4d79ff', 'Northern Wastes');
        drawContinent(0.6, 0.2, 0.3, 0.4, '#ff4d4d', 'Cinder Peaks');
        drawContinent(0.3, 0.7, 0.5, 0.3, '#00ff9d', 'Verdant Expanse');
        drawContinent(0.7, 0.6, 0.25, 0.4, '#ffcc00', 'Azure Isles');
        
        // Draw territory borders
        drawTerritoryBorders();
        
        // Draw magical energy flows
        drawEnergyFlows();
        
        // Draw cities and landmarks
        drawLandmarks();
    }
    
    function drawContinent(x, y, widthRatio, heightRatio, color, name) {
        const canvasWidth = worldMapCanvas.width;
        const canvasHeight = worldMapCanvas.height;
        
        ctx.beginPath();
        ctx.fillStyle = color + '40'; // Semi-transparent
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        // Create organic continent shape
        ctx.moveTo(x * canvasWidth, y * canvasHeight);
        ctx.bezierCurveTo(
            (x + 0.2) * canvasWidth, (y - 0.1) * canvasHeight,
            (x + 0.4) * canvasWidth, (y + 0.1) * canvasHeight,
            (x + widthRatio) * canvasWidth, y * canvasHeight
        );
        ctx.bezierCurveTo(
            (x + widthRatio + 0.1) * canvasWidth, (y + 0.2) * canvasHeight,
            (x + widthRatio - 0.1) * canvasWidth, (y + 0.4) * canvasHeight,
            x * canvasWidth, (y + heightRatio) * canvasHeight
        );
        ctx.bezierCurveTo(
            (x - 0.1) * canvasWidth, (y + heightRatio - 0.1) * canvasHeight,
            (x - 0.2) * canvasWidth, (y + heightRatio * 0.5) * canvasHeight,
            x * canvasWidth, y * canvasHeight
        );
        
        ctx.fill();
        ctx.stroke();
        
        // Add continent name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(name, (x + widthRatio/2) * canvasWidth, (y + heightRatio/2) * canvasHeight);
    }
    
    function drawTerritoryBorders() {
        const width = worldMapCanvas.width;
        const height = worldMapCanvas.height;
        
        // Draw faction control lines
        ctx.strokeStyle = '#4d79ff';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        
        // Alliance territory
        ctx.beginPath();
        ctx.moveTo(width * 0.25, height * 0.35);
        ctx.lineTo(width * 0.4, height * 0.5);
        ctx.lineTo(width * 0.3, height * 0.7);
        ctx.stroke();
        
        // Horde territory
        ctx.strokeStyle = '#ff4d4d';
        ctx.beginPath();
        ctx.moveTo(width * 0.65, height * 0.25);
        ctx.lineTo(width * 0.75, height * 0.4);
        ctx.lineTo(width * 0.6, height * 0.55);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }
    
    function drawEnergyFlows() {
        const width = worldMapCanvas.width;
        const height = worldMapCanvas.height;
        
        // Draw magical ley lines
        ctx.strokeStyle = '#00e0ff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, 0);
            ctx.bezierCurveTo(
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height,
                Math.random() * width, height
            );
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    function drawLandmarks() {
        const width = worldMapCanvas.width;
        const height = worldMapCanvas.height;
        
        // Draw cities
        const cities = [
            { x: 0.3, y: 0.4, name: 'Frosthold', type: 'city' },
            { x: 0.65, y: 0.3, name: 'Emberpeak', type: 'city' },
            { x: 0.4, y: 0.8, name: 'Greenhaven', type: 'city' },
            { x: 0.75, y: 0.7, name: 'Crystal Spire', type: 'landmark' },
            { x: 0.5, y: 0.5, name: 'The Nexus', type: 'landmark' }
        ];
        
        cities.forEach(city => {
            ctx.fillStyle = city.type === 'city' ? '#ffcc00' : '#9d4edd';
            ctx.beginPath();
            ctx.arc(city.x * width, city.y * height, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Pulsing glow effect
            ctx.beginPath();
            ctx.arc(city.x * width, city.y * height, 6, 0, Math.PI * 2);
            ctx.strokeStyle = city.type === 'city' ? '#ffcc0080' : '#9d4edd80';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // City name
            ctx.fillStyle = '#ffffff';
            ctx.font = '8px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText(city.name, city.x * width, city.y * height - 10);
        });
    }
    
    // ===== GAUGE ANIMATION =====
    function initializeGauges() {
        const gauges = document.querySelectorAll('.gauge-fill');
        gauges.forEach(gauge => {
            const value = parseInt(gauge.getAttribute('data-value'));
            // Animate gauge fill with delay
            setTimeout(() => {
                gauge.style.width = `${value}%`;
            }, Math.random() * 1000);
        });
    }
    
    // ===== GUILD RANKINGS =====
    function generateGuildRankings() {
        const guilds = [
            { rank: 1, name: 'Dawn Legion ⚔️', power: '9,842', members: '2,147', territories: '18', trend: '📈' },
            { rank: 2, name: 'Shadow Syndicate 🗡️', power: '9,215', members: '1,892', territories: '16', trend: '📉' },
            { rank: 3, name: 'Iron Covenant 🛡️', power: '8,743', members: '2,340', territories: '14', trend: '📈' },
            { rank: 4, name: 'Arcane Conclave 🔮', power: '8,112', members: '1,567', territories: '12', trend: '➡️' },
            { rank: 5, name: 'Frostborn Clan ❄️', power: '7,894', members: '1,234', territories: '10', trend: '📈' },
            { rank: 6, name: 'Ember Guard 🔥', power: '7,521', members: '1,789', territories: '9', trend: '📉' },
            { rank: 7, name: 'Sylvan Circle 🌿', power: '7,102', members: '1,456', territories: '8', trend: '➡️' },
            { rank: 8, name: 'Void Walkers 🌌', power: '6,834', members: '987', territories: '7', trend: '📈' }
        ];
        
        guildRankingBody.innerHTML = '';
        
        guilds.forEach(guild => {
            const row = document.createElement('div');
            row.className = 'ranking-row';
            row.innerHTML = `
                <div class="rank-col">#${guild.rank}</div>
                <div class="guild-col">${guild.name}</div>
                <div class="power-col">${guild.power}</div>
                <div class="members-col">${guild.members}</div>
                <div class="territory-col">${guild.territories}</div>
                <div class="trend-col">${guild.trend}</div>
            `;
            
            // Add alternating row colors
            if (guild.rank % 2 === 0) {
                row.style.background = 'rgba(255, 255, 255, 0.02)';
            }
            
            // Add hover effect
            row.addEventListener('mouseenter', () => {
                row.style.background = 'rgba(0, 224, 255, 0.1)';
            });
            
            row.addEventListener('mouseleave', () => {
                row.style.background = guild.rank % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent';
            });
            
            guildRankingBody.appendChild(row);
        });
    }
    
    // ===== DUNGEON MATRIX =====
    function generateDungeonMatrix() {
        const dungeons = [
            { name: 'FD', status: 'active', difficulty: 'mythic', progress: 85 },
            { name: 'CC', status: 'wiped', difficulty: 'heroic', progress: 34 },
            { name: 'TS', status: 'completed', difficulty: 'normal', progress: 100 },
            { name: 'VP', status: 'active', difficulty: 'mythic', progress: 62 },
            { name: 'DG', status: 'queued', difficulty: 'heroic', progress: 0 },
            { name: 'BF', status: 'active', difficulty: 'normal', progress: 41 },
            { name: 'SR', status: 'wiped', difficulty: 'mythic', progress: 23 },
            { name: 'EC', status: 'completed', difficulty: 'normal', progress: 100 },
            { name: 'FW', status: 'active', difficulty: 'heroic', progress: 78 },
            { name: 'MT', status: 'queued', difficulty: 'normal', progress: 0 }
        ];
        
        dungeonGrid.innerHTML = '';
        
        dungeons.forEach(dungeon => {
            const cell = document.createElement('div');
            cell.className = `dungeon-cell ${dungeon.status} ${dungeon.difficulty}`;
            cell.innerHTML = `
                <div class="dungeon-abbr">${dungeon.name}</div>
                <div class="dungeon-status">${getStatusIcon(dungeon.status)}</div>
                <div class="dungeon-progress" style="width: ${dungeon.progress}%"></div>
            `;
            
            // Tooltip
            cell.title = `${getDungeonName(dungeon.name)} - ${dungeon.difficulty.toUpperCase()} - ${dungeon.progress}%`;
            
            dungeonGrid.appendChild(cell);
        });
    }
    
    function getStatusIcon(status) {
        const icons = {
            'active': '⚔️',
            'wiped': '💀',
            'completed': '✅',
            'queued': '⏳'
        };
        return icons[status] || '❓';
    }
    
    function getDungeonName(abbr) {
        const names = {
            'FD': 'Frostfire Depths',
            'CC': 'Crystal Caverns',
            'TS': 'Titan Spire',
            'VP': 'Void Palace',
            'DG': 'Dragon Graveyard',
            'BF': 'Bloodforge',
            'SR': 'Shadow Ruins',
            'EC': 'Eternal Citadel',
            'FW': 'Feywild',
            'MT': 'Mythic Tower'
        };
        return names[abbr] || 'Unknown Dungeon';
    }
    
    // ===== MARKETPLACE DATA =====
    function generateCommodityData() {
        const commodities = [
            { name: 'Mythril Ore', icon: '⛏️', price: '142.5G', change: '+2.4%', volume: '12.4k' },
            { name: 'Dragon Scale', icon: '🐉', price: '89.7G', change: '-1.2%', volume: '8.7k' },
            { name: 'Arcane Dust', icon: '✨', price: '23.1G', change: '+5.7%', volume: '45.2k' },
            { name: 'Healing Potion', icon: '🧪', price: '4.8G', change: '+0.3%', volume: '124.7k' },
            { name: 'Enchanted Wood', icon: '🌲', price: '18.3G', change: '-0.8%', volume: '23.9k' },
            { name: 'Soul Shard', icon: '💎', price: '312.9G', change: '+8.1%', volume: '3.2k' }
        ];
        
        commodityList.innerHTML = '';
        
        commodities.forEach(item => {
            const commodity = document.createElement('div');
            commodity.className = 'commodity-item';
            commodity.innerHTML = `
                <span class="commodity-icon">${item.icon}</span>
                <span class="commodity-name">${item.name}</span>
                <span class="commodity-price">${item.price}</span>
                <span class="commodity-change ${item.change.startsWith('+') ? 'positive' : 'negative'}">${item.change}</span>
                <span class="commodity-volume">${item.volume}</span>
            `;
            commodityList.appendChild(commodity);
        });
    }
    
    function generateOrderBook() {
        const generateOrders = (count, isBuy) => {
            const orders = [];
            for (let i = 0; i < count; i++) {
                const price = (Math.random() * 100 + 50).toFixed(2);
                const amount = (Math.random() * 1000 + 100).toFixed(0);
                orders.push({ price, amount });
            }
            return orders.sort((a, b) => isBuy ? b.price - a.price : a.price - b.price);
        };
        
        const buyOrdersData = generateOrders(6, true);
        const sellOrdersData = generateOrders(6, false);
        
        buyOrders.innerHTML = '';
        sellOrders.innerHTML = '';
        
        // Buy orders (highest to lowest)
        buyOrdersData.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item buy';
            orderElement.innerHTML = `
                <span class="order-price">${order.price}G</span>
                <span class="order-amount">${order.amount}</span>
                <div class="order-depth" style="width: ${(order.amount / 1000) * 100}%"></div>
            `;
            buyOrders.appendChild(orderElement);
        });
        
        // Sell orders (lowest to highest)
        sellOrdersData.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item sell';
            orderElement.innerHTML = `
                <span class="order-price">${order.price}G</span>
                <span class="order-amount">${order.amount}</span>
                <div class="order-depth" style="width: ${(order.amount / 1000) * 100}%"></div>
            `;
            sellOrders.appendChild(orderElement);
        });
    }
    
    // ===== HEATMAP GENERATION =====
    function generateHeatmap() {
        heatmapGrid.innerHTML = '';
        
        for (let i = 0; i < 50; i++) { // 5x10 grid
            const intensity = Math.floor(Math.random() * 100);
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.style.backgroundColor = getHeatmapColor(intensity);
            cell.style.opacity = intensity / 100;
            cell.title = `Activity: ${intensity}%`;
            
            // Add pulsing animation for high activity cells
            if (intensity > 80) {
                cell.style.animation = `pulse ${1 + Math.random()}s infinite`;
            }
            
            heatmapGrid.appendChild(cell);
        }
    }
    
    function getHeatmapColor(intensity) {
        // Blue (low) -> Green -> Yellow -> Red (high)
        if (intensity < 25) return '#003366';
        if (intensity < 50) return '#00e0ff';
        if (intensity < 75) return '#00ff9d';
        return '#ff4d8d';
    }
    
    // ===== GAME CLOCK & DYNAMICS =====
    function startGameClock() {
        // Fantasy time runs 4x faster than real time
        gameTimeOffset = Date.now();
        
        setInterval(() => {
            if (isPaused) return;
            
            const now = new Date();
            const gameTime = new Date(gameTimeOffset + (now.getTime() - gameTimeOffset) * 4);
            
            // Format game time
            const hours = gameTime.getHours().toString().padStart(2, '0');
            const minutes = gameTime.getMinutes().toString().padStart(2, '0');
            gameTimeElement.textContent = `${hours}:${minutes}`;
            
            // Update season based on game time
            updateSeason(gameTime);
            
            // Update moon phase
            updateMoonPhase(gameTime);
            
            // Update refresh time
            refreshTimeElement.textContent = formatTime(now);
        }, 1000);
    }
    
    function updateSeason(gameTime) {
        const month = gameTime.getMonth();
        const seasons = [
            'Verdant Bloom', 'Solar Zenith', 'Harvest Tide', 
            'Frostfall', 'Starlit Deep', 'Awakening'
        ];
        
        const seasonIndex = Math.floor(month / 2);
        seasonElement.textContent = seasons[seasonIndex];
    }
    
    function updateMoonPhase(gameTime) {
        const day = gameTime.getDate();
        const phases = [
            'New Moon', 'Waxing Crescent', 'First Quarter', 
            'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 
            'Last Quarter', 'Waning Crescent'
        ];
        
        const phaseIndex = Math.floor((day % 29) / 3.625);
        moonPhaseElement.textContent = phases[phaseIndex];
    }
    
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    
    // ===== DYNAMIC UPDATES =====
    function startDynamicUpdates() {
        // Update player count randomly
        setInterval(() => {
            if (isPaused) return;
            
            const playerCount = document.querySelector('.player-count .count');
            const current = parseInt(playerCount.textContent.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 100) - 45; // -45 to +54
            const newCount = Math.max(30000, current + change);
            playerCount.textContent = newCount.toLocaleString();
            
            // Update server load
            const serverLoad = document.querySelector('.server-load');
            const load = 90 + Math.floor(Math.random() * 10);
            serverLoad.textContent = `🔄 Load: ${load}%`;
            
            // Random world events
            if (Math.random() > 0.7) {
                triggerRandomEvent();
            }
        }, 5000);
        
        // Update gauges periodically
        setInterval(() => {
            if (isPaused) return;
            
            const gauges = document.querySelectorAll('.gauge-fill');
            gauges.forEach(gauge => {
                const currentValue = parseInt(gauge.style.width) || parseInt(gauge.getAttribute('data-value'));
                const newValue = Math.max(10, Math.min(100, currentValue + Math.floor(Math.random() * 20) - 10));
                gauge.setAttribute('data-value', newValue);
                gauge.style.width = `${newValue}%`;
                
                // Update gauge value display
                const gaugeValue = gauge.parentElement.nextElementSibling;
                if (gaugeValue && gaugeValue.classList.contains('gauge-value')) {
                    gaugeValue.textContent = `${newValue}%`;
                }
            });
        }, 10000);
    }
    
    function triggerRandomEvent() {
        const events = [
            'Dragon sighting reported in Northern Wastes! 🐉',
            'Market crash detected! Gold value dropping rapidly! 📉',
            'New dungeon portal discovered! 🌀',
            'Guild war escalating between Dawn Legion and Shadow Syndicate! ⚔️',
            'Magical anomaly detected near Crystal Spire! 🔮',
            'Server maintenance scheduled in 30 minutes! ⚠️'
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        addLogEntry(randomEvent, 'event');
        showNotification(randomEvent, 'warning');
    }
    
    // ===== CONSOLE SYSTEM =====
    function startConsoleFeed() {
        // Initial log entries
        addLogEntry('System initialized... Loading world data', 'system');
        addLogEntry('Connected to 12 realm servers', 'success');
        addLogEntry('Player authentication: ONLINE', 'success');
        addLogEntry('Economy simulation: ACTIVE', 'system');
        addLogEntry('Magic ley network: STABLE', 'success');
        addLogEntry('Territory control updates: SYNCED', 'system');
        
        // Add periodic log entries
        setInterval(() => {
            if (isPaused) return;
            
            const logTypes = [
                { message: 'Player ShadowX completed raid: Frostfire Depths', type: 'player' },
                { message: 'Gold transaction: 14,892G transferred', type: 'economy' },
                { message: 'New player registered: MysticWizard42', type: 'system' },
                { message: 'Dungeon instance created: Crystal Caverns', type: 'system' },
                { message: 'Auction house: Legendary item sold for 8,742G', type: 'economy' },
                { message: 'Guild Dawn Legion captured territory: Frosthold', type: 'guild' }
            ];
            
            const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)];
            addLogEntry(randomLog.message, randomLog.type);
        }, 3000);
    }
    
    function addLogEntry(message, type) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const typeIcon = getLogTypeIcon(type);
        
        logEntry.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            <span class="log-icon">${typeIcon}</span>
            <span class="log-message">${message}</span>
        `;
        
        logEntries.appendChild(logEntry);
        
        // Limit log entries
        if (logEntries.children.length > 20) {
            logEntries.removeChild(logEntries.firstChild);
        }
        
        // Auto-scroll to bottom
        logEntries.scrollTop = logEntries.scrollHeight;
    }
    
    function getLogTypeIcon(type) {
        const icons = {
            'system': '🖥️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌',
            'event': '⚡',
            'player': '👤',
            'economy': '💰',
            'guild': '⚔️'
        };
        return icons[type] || '📝';
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        const toastMessage = notificationToast.querySelector('.toast-message');
        const toastIcon = notificationToast.querySelector('.toast-content i');
        
        // Set icon based on type
        const icons = {
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'error': 'fa-times-circle',
            'info': 'fa-info-circle'
        };
        
        toastIcon.className = `fas ${icons[type] || 'fa-info-circle'}`;
        toastMessage.textContent = message;
        
        // Show toast
        notificationToast.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notificationToast.classList.remove('show');
        }, 5000);
    }
    
    // ===== INTERACTIVE CONTROLS =====
    // Map controls
    document.querySelectorAll('.map-control').forEach((control, index) => {
        control.addEventListener('click', () => {
            const actions = ['Zooming in...', 'Zooming out...', 'Toggling layers...'];
            showNotification(actions[index], 'info');
        });
    });
    
    // Tab controls
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Time filter buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Regenerate heatmap for selected time range
            generateHeatmap();
        });
    });
    
    // Console controls
    clearConsoleBtn.addEventListener('click', () => {
        logEntries.innerHTML = '';
        addLogEntry('Console cleared manually', 'system');
    });
    
    pauseFeedBtn.addEventListener('click', function() {
        isPaused = !isPaused;
        this.innerHTML = isPaused ? '<i class="fas fa-play"></i> Resume' : '<i class="fas fa-pause"></i> Pause';
        addLogEntry(isPaused ? 'Feed paused' : 'Feed resumed', 'system');
        showNotification(isPaused ? 'Dashboard updates paused' : 'Dashboard updates resumed', 'info');
    });
    
    exportLogBtn.addEventListener('click', () => {
        showNotification('Exporting console log...', 'info');
        // In a real app, this would trigger a download
        addLogEntry('Console log export initiated', 'system');
    });
    
    // Command input
    commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            const command = this.value.trim();
            addLogEntry(`> ${command}`, 'system');
            
            // Process commands
            processCommand(command);
            
            this.value = '';
        }
    });
    
    function processCommand(command) {
        const cmd = command.toLowerCase();
        
        if (cmd === 'help' || cmd === '?') {
            addLogEntry('Available commands: status, time, players, refresh, clear, pause, resume', 'system');
        } else if (cmd === 'status') {
            addLogEntry('System Status: ALL SYSTEMS OPERATIONAL', 'success');
        } else if (cmd === 'time') {
            const now = new Date();
            addLogEntry(`Game Time: ${gameTimeElement.textContent}, Real Time: ${formatTime(now)}`, 'system');
        } else if (cmd === 'players') {
            const count = document.querySelector('.player-count .count').textContent;
            addLogEntry(`Active Players: ${count}`, 'player');
        } else if (cmd === 'refresh') {
            addLogEntry('Refreshing dashboard data...', 'system');
            generateGuildRankings();
            generateDungeonMatrix();
            generateCommodityData();
            generateOrderBook();
            generateHeatmap();
            showNotification('Dashboard data refreshed', 'success');
        } else if (cmd === 'clear') {
            logEntries.innerHTML = '';
            addLogEntry('Console cleared via command', 'system');
        } else if (cmd === 'pause') {
            isPaused = true;
            pauseFeedBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            addLogEntry('Updates paused via command', 'system');
        } else if (cmd === 'resume') {
            isPaused = false;
            pauseFeedBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            addLogEntry('Updates resumed via command', 'system');
        } else {
            addLogEntry(`Unknown command: "${command}". Type "help" for available commands.`, 'error');
        }
    }
    
    // Toast close button
    toastClose.addEventListener('click', () => {
        notificationToast.classList.remove('show');
    });
    
    // ===== PERFORMANCE OPTIMIZATION FOR 4K =====
    // Throttle expensive operations
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            worldMapCanvas.width = worldMapCanvas.parentElement.clientWidth;
            worldMapCanvas.height = worldMapCanvas.parentElement.clientHeight - 40;
            drawFantasyMap();
        }, 100);
    });
    
    // ===== FINAL INITIALIZATION MESSAGE =====
    console.log('✅ NEXUS CORE Dashboard fully operational');
    console.log('📊 Display optimized for 4K resolution');
    console.log('⚡ Real-time updates active');
    console.log('🔮 Magical systems initialized');
});