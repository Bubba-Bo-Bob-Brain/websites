// === NEXUS PRIME DASHBOARD - MAIN SCRIPT ===
// Initialize all dashboard components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initGalacticDate();
    initStarMap();
    initMarketChart();
    initChatLog();
    initAnimations();
    initControlButtons();
    initTimeFilters();
    initResourceUpdates();
    initWarFrontUpdates();
    initTechProgressUpdates();
    initSystemMetrics();
});

// === GALACTIC DATE & TIME ===
function initGalacticDate() {
    const dateElement = document.getElementById('galactic-date');
    const uptimeElement = document.getElementById('uptime');
    
    function updateGalacticDate() {
        const now = new Date();
        // Galactic standard time: 1 galactic year = 365.25 earth days
        const galacticYear = 2478;
        const galacticMonth = Math.floor((now.getMonth() + 1) * 13 / 12);
        const galacticDay = now.getDate();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        dateElement.textContent = `${galacticYear}.${galacticMonth.toString().padStart(2, '0')}.${galacticDay.toString().padStart(2, '0')} // ${hours}:${minutes}:${seconds}`;
        
        // Update uptime (simulated)
        const uptimeDays = 127;
        const uptimeHours = 14;
        const uptimeMinutes = 22 + Math.floor(now.getMinutes() / 60);
        uptimeElement.textContent = `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`;
    }
    
    updateGalacticDate();
    setInterval(updateGalacticDate, 1000);
}

// === STAR MAP GENERATION ===
function initStarMap() {
    const starMap = document.getElementById('star-map');
    const mapWidth = starMap.offsetWidth;
    const mapHeight = starMap.offsetHeight;
    
    // Generate sectors
    const sectors = [
        { id: 'A1', name: 'Sol Sector', faction: 'federation', x: 20, y: 30, size: 15 },
        { id: 'A2', name: 'Alpha Centauri', faction: 'federation', x: 45, y: 25, size: 12 },
        { id: 'B1', name: 'Sirius Cluster', faction: 'syndicate', x: 70, y: 35, size: 18 },
        { id: 'B2', name: 'Vega Nexus', faction: 'syndicate', x: 85, y: 60, size: 10 },
        { id: 'C1', name: 'Andromeda Reach', faction: 'collective', x: 30, y: 70, size: 20 },
        { id: 'C2', name: 'Cygnus Arm', faction: 'collective', x: 60, y: 80, size: 14 },
        { id: 'D1', name: 'Outer Rim', faction: 'unaligned', x: 15, y: 55, size: 16 },
        { id: 'D2', name: 'Frontier Zone', faction: 'unaligned', x: 90, y: 20, size: 11 }
    ];
    
    // Generate stars
    const stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            brightness: Math.random() * 0.8 + 0.2,
            twinkle: Math.random() * 2 + 1
        });
    }
    
    // Generate ships
    const ships = [];
    for (let i = 0; i < 25; i++) {
        ships.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            targetX: Math.random() * 100,
            targetY: Math.random() * 100,
            speed: Math.random() * 0.5 + 0.1,
            type: ['🛸', '✈️', '🚀', '⚓'][Math.floor(Math.random() * 4)],
            faction: ['federation', 'syndicate', 'collective', 'unaligned'][Math.floor(Math.random() * 4)]
        });
    }
    
    // Create star map elements
    function createStarMapElements() {
        // Clear existing
        starMap.innerHTML = '';
        
        // Add sectors
        sectors.forEach(sector => {
            const sectorEl = document.createElement('div');
            sectorEl.className = `map-sector ${sector.faction}`;
            sectorEl.style.left = `${sector.x}%`;
            sectorEl.style.top = `${sector.y}%`;
            sectorEl.style.width = `${sector.size}px`;
            sectorEl.style.height = `${sector.size}px`;
            sectorEl.title = `${sector.name} (${sector.id})`;
            starMap.appendChild(sectorEl);
            
            // Add sector label
            const labelEl = document.createElement('div');
            labelEl.className = 'sector-label';
            labelEl.style.left = `${sector.x + 5}%`;
            labelEl.style.top = `${sector.y - 3}%`;
            labelEl.textContent = sector.id;
            starMap.appendChild(labelEl);
        });
        
        // Add stars
        stars.forEach((star, index) => {
            const starEl = document.createElement('div');
            starEl.className = 'map-star';
            starEl.style.left = `${star.x}%`;
            starEl.style.top = `${star.y}%`;
            starEl.style.width = `${star.size}px`;
            starEl.style.height = `${star.size}px`;
            starEl.style.opacity = star.brightness;
            starEl.style.animation = `twinkle ${star.twinkle}s ease-in-out infinite`;
            starMap.appendChild(starEl);
        });
        
        // Add ships
        ships.forEach((ship, index) => {
            const shipEl = document.createElement('div');
            shipEl.className = `map-ship ${ship.faction}`;
            shipEl.style.left = `${ship.x}%`;
            shipEl.style.top = `${ship.y}%`;
            shipEl.textContent = ship.type;
            shipEl.id = `ship-${index}`;
            starMap.appendChild(shipEl);
        });
    }
    
    // Animate ships
    function animateShips() {
        ships.forEach((ship, index) => {
            const shipEl = document.getElementById(`ship-${index}`);
            if (!shipEl) return;
            
            // Move towards target
            const dx = ship.targetX - ship.x;
            const dy = ship.targetY - ship.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 1) {
                // Pick new target
                ship.targetX = Math.random() * 100;
                ship.targetY = Math.random() * 100;
            } else {
                ship.x += (dx / distance) * ship.speed;
                ship.y += (dy / distance) * ship.speed;
                
                // Update position
                shipEl.style.left = `${ship.x}%`;
                shipEl.style.top = `${ship.y}%`;
            }
        });
        
        requestAnimationFrame(animateShips);
    }
    
    createStarMapElements();
    animateShips();
    
    // Add CSS for map elements
    const style = document.createElement('style');
    style.textContent = `
        .map-sector {
            position: absolute;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid;
            opacity: 0.6;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .map-sector:hover {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        .map-sector.federation { border-color: var(--color-federation); box-shadow: 0 0 10px var(--color-federation); }
        .map-sector.syndicate { border-color: var(--color-syndicate); box-shadow: 0 0 10px var(--color-syndicate); }
        .map-sector.collective { border-color: var(--color-collective); box-shadow: 0 0 10px var(--color-collective); }
        .map-sector.unaligned { border-color: var(--color-unaligned); box-shadow: 0 0 10px var(--color-unaligned); }
        
        .sector-label {
            position: absolute;
            font-family: var(--font-mono);
            font-size: 7px;
            color: var(--color-text-dim);
            pointer-events: none;
        }
        
        .map-star {
            position: absolute;
            background: white;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        .map-ship {
            position: absolute;
            font-size: 10px;
            transform: translate(-50%, -50%);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .map-ship:hover {
            transform: translate(-50%, -50%) scale(1.5);
            z-index: 10;
        }
        .map-ship.federation { color: var(--color-federation); }
        .map-ship.syndicate { color: var(--color-syndicate); }
        .map-ship.collective { color: var(--color-collective); }
        .map-ship.unaligned { color: var(--color-unaligned); }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
}

// === MARKET CHART ===
function initMarketChart() {
    const chartContainer = document.getElementById('market-chart');
    const chartWidth = chartContainer.offsetWidth;
    const chartHeight = chartContainer.offsetHeight;
    
    // Generate chart data
    const chartData = [];
    let value = 84328;
    for (let i = 0; i < 50; i++) {
        value += (Math.random() - 0.45) * 1000;
        value = Math.max(80000, Math.min(90000, value));
        chartData.push(value);
    }
    
    // Draw chart
    function drawChart() {
        const canvas = document.createElement('canvas');
        canvas.width = chartWidth;
        canvas.height = chartHeight;
        chartContainer.innerHTML = '';
        chartContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const padding = 5;
        const chartAreaWidth = chartWidth - padding * 2;
        const chartAreaHeight = chartHeight - padding * 2;
        
        // Find min and max
        const min = Math.min(...chartData);
        const max = Math.max(...chartData);
        const range = max - min;
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
        gradient.addColorStop(0, 'rgba(0, 170, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 170, 255, 0)');
        
        // Draw chart line
        ctx.beginPath();
        ctx.strokeStyle = '#00aaff';
        ctx.lineWidth = 1;
        ctx.shadowColor = '#00aaff';
        ctx.shadowBlur = 3;
        
        chartData.forEach((point, index) => {
            const x = padding + (index / (chartData.length - 1)) * chartAreaWidth;
            const y = padding + ((max - point) / range) * chartAreaHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Fill area under line
        ctx.lineTo(padding + chartAreaWidth, padding + chartAreaHeight);
        ctx.lineTo(padding, padding + chartAreaHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw current value marker
        const lastPoint = chartData[chartData.length - 1];
        const lastX = padding + chartAreaWidth;
        const lastY = padding + ((max - lastPoint) / range) * chartAreaHeight;
        
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00aaff';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // Update chart periodically
    function updateChartData() {
        // Remove first data point
        chartData.shift();
        
        // Add new data point
        const lastValue = chartData[chartData.length - 1];
        let newValue = lastValue + (Math.random() - 0.45) * 500;
        newValue = Math.max(80000, Math.min(90000, newValue));
        chartData.push(newValue);
        
        // Update chart value display
        const chartValue = document.querySelector('.chart-value');
        const chartChange = document.querySelector('.chart-change');
        
        if (chartValue && chartChange) {
            chartValue.textContent = `◈ ${Math.round(newValue).toLocaleString()}`;
            
            const changePercent = ((newValue - lastValue) / lastValue * 100).toFixed(1);
            chartChange.textContent = `${changePercent >= 0 ? '▲' : '▼'} ${Math.abs(changePercent)}% (24H)`;
            chartChange.className = `chart-change ${changePercent >= 0 ? 'up' : 'down'}`;
        }
        
        drawChart();
    }
    
    drawChart();
    setInterval(updateChartData, 3000);
}

// === CHAT LOG ===
function initChatLog() {
    const chatLog = document.getElementById('chat-log');
    const chatInput = document.querySelector('.chat-input-field');
    const sendBtn = document.querySelector('.send-btn');
    
    // Chat messages data
    const chatMessages = [
        { user: 'COMMANDER_ZORG', message: 'All fleet, assemble at Sol Sector. We are launching offensive on Syndicate outposts.', faction: 'federation' },
        { user: 'DARK_NEBULA', message: 'Syndicate forces moving through Sirius Cluster. All hands on alert!', faction: 'syndicate' },
        { user: 'STARPHOENIX', message: 'Collective reports anomaly in Andromeda Reach. Investigation team dispatched.', faction: 'collective' },
        { user: 'VOID_RUNNER', message: 'Trading convoy en route to Nebula Station. Dark matter cargo secure.', faction: 'unaligned' },
        { user: 'SYSTEM', message: 'Alert: Wormhole instability detected in Sector 7-G. All ships avoid area.', faction: 'system' }
    ];
    
    // Add initial messages
    function addInitialMessages() {
        chatMessages.forEach(msg => {
            addChatMessage(msg.user, msg.message, msg.faction);
        });
    }
    
    // Add a chat message
    function addChatMessage(user, message, faction = 'federation') {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${faction === 'system' ? 'system' : ''}`;
        
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        messageEl.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="username">${user}:</span>
            <span class="content">${message}</span>
        `;
        
        chatLog.appendChild(messageEl);
        chatLog.scrollTop = chatLog.scrollHeight;
        
        // Keep only last 20 messages
        if (chatLog.children.length > 20) {
            chatLog.removeChild(chatLog.firstChild);
        }
    }
    
    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addChatMessage('YOU', message, 'federation');
            chatInput.value = '';
            
            // Simulate response after delay
            setTimeout(() => {
                const responses = [
                    { user: 'COMMANDER_ZORG', message: 'Message received. Proceed with caution.', faction: 'federation' },
                    { user: 'DARK_NEBULA', message: 'Syndicate acknowledges your transmission.', faction: 'syndicate' },
                    { user: 'STARPHOENIX', message: 'Collective notes your communication.', faction: 'collective' },
                    { user: 'SYSTEM', message: 'Message logged. Continue monitoring.', faction: 'system' }
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                addChatMessage(response.user, response.message, response.faction);
            }, 1000 + Math.random() * 2000);
        }
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Add random messages periodically
    function addRandomMessage() {
        const randomMessages = [
            { user: 'NAVIGATION', message: 'Course plotted to destination. ETA: 2.4 hours.', faction: 'system' },
            { user: 'TRADE_BOT', message: 'New trade opportunity: Dark Matter selling at premium in Nebula Station.', faction: 'system' },
            { user: 'SECURITY', message: 'Piracy alert in Outer Rim. All convoys increase security.', faction: 'system' },
            { user: 'RESEARCH', message: 'Breakthrough in quantum drive technology. Efficiency increased by 12%.', faction: 'system' }
        ];
        
        const msg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        addChatMessage(msg.user, msg.message, msg.faction);
    }
    
    addInitialMessages();
    setInterval(addRandomMessage, 15000 + Math.random() * 10000);
}

// === ANIMATIONS ===
function initAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 5px currentColor; }
            50% { box-shadow: 0 0 15px currentColor; }
        }
        
        .panel {
            animation: fadeIn 0.5s ease forwards;
        }
        
        .panel:nth-child(1) { animation-delay: 0.1s; }
        .panel:nth-child(2) { animation-delay: 0.2s; }
        .panel:nth-child(3) { animation-delay: 0.3s; }
        
        .fleet-item, .resource-item, .player-item, .order-item {
            transition: all 0.2s ease;
        }
        
        .fleet-item:hover, .resource-item:hover, .player-item:hover, .order-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            background: rgba(0, 20, 40, 0.3);
        }
        
        .control-btn, .filter-btn {
            transition: all 0.2s ease;
        }
        
        .control-btn:hover, .filter-btn:hover {
            background: rgba(0, 170, 255, 0.2);
            border-color: var(--color-federation);
        }
        
        .progress-fill {
            animation: pulseGlow 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// === CONTROL BUTTONS ===
function initControlButtons() {
    const controlBtns = document.querySelectorAll('.control-btn');
    
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from siblings
            const siblings = this.parentElement.querySelectorAll('.control-btn');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update star map view (simulated)
            const view = this.textContent;
            console.log(`Switching to ${view} view`);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// === TIME FILTERS ===
function initTimeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from siblings
            const siblings = this.parentElement.querySelectorAll('.filter-btn');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update resource data (simulated)
            const timeframe = this.textContent;
            console.log(`Showing ${timeframe} data`);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// === RESOURCE UPDATES ===
function initResourceUpdates() {
    const resourceItems = document.querySelectorAll('.resource-item');
    
    function updateResources() {
        resourceItems.forEach(item => {
            const rateEl = item.querySelector('.resource-rate');
            const priceEl = item.querySelector('.resource-price');
            const trendEl = item.querySelector('.resource-trend');
            
            if (rateEl && priceEl && trendEl) {
                // Update rate
                const currentRate = parseInt(rateEl.textContent.replace(/[^0-9]/g, ''));
                const rateChange = Math.floor(Math.random() * 100) - 50;
                const newRate = Math.max(100, currentRate + rateChange);
                rateEl.innerHTML = `+${newRate.toLocaleString()} <span class="unit">u/h</span>`;
                
                // Update price
                const currentPrice = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''));
                const priceChange = Math.floor(Math.random() * 200) - 100;
                const newPrice = Math.max(1000, currentPrice + priceChange);
                priceEl.textContent = `◈ ${newPrice.toLocaleString()}`;
                
                // Update trend
                const trendChange = ((newRate - currentRate) / currentRate * 100).toFixed(1);
                trendEl.textContent = `${trendChange >= 0 ? '▲' : '▼'} ${Math.abs(trendChange)}%`;
                trendEl.className = `resource-trend ${trendChange >= 0 ? 'up' : 'down'}`;
            }
        });
    }
    
    setInterval(updateResources, 5000);
}

// === WAR FRONT UPDATES ===
function initWarFrontUpdates() {
    const warFronts = document.querySelectorAll('.war-front');
    
    function updateWarFronts() {
        warFronts.forEach(front => {
            const progressBars = front.querySelectorAll('.faction-progress');
            const stats = front.querySelectorAll('.front-stats span');
            
            if (progressBars.length >= 2) {
                // Update progress bars
                let fedProgress = parseInt(progressBars[0].style.width);
                let otherProgress = parseInt(progressBars[1].style.width);
                
                // Random shift
                const shift = (Math.random() - 0.5) * 5;
                fedProgress = Math.max(20, Math.min(80, fedProgress + shift));
                otherProgress = 100 - fedProgress;
                
                progressBars[0].style.width = `${fedProgress}%`;
                progressBars[1].style.width = `${otherProgress}%`;
                
                // Update labels
                const fedLabel = progressBars[0].querySelector('.faction-label');
                const otherLabel = progressBars[1].querySelector('.faction-label');
                
                if (fedLabel) fedLabel.textContent = `FED ${Math.round(fedProgress)}%`;
                if (otherLabel) otherLabel.textContent = `SYN ${Math.round(otherProgress)}%`;
                
                // Update stats
                if (stats.length >= 2) {
                    const engagements = parseInt(stats[0].textContent.replace(/[^0-9]/g, ''));
                    const losses = parseInt(stats[1].textContent.replace(/[^0-9]/g, ''));
                    
                    const newEngagements = engagements + Math.floor(Math.random() * 10);
                    const newLosses = losses + Math.floor(Math.random() * 50);
                    
                    stats[0].textContent = `⚔️ ${newEngagements.toLocaleString()} ENGAGEMENTS`;
                    stats[1].textContent = `💥 ${newLosses.toLocaleString()} LOSSES`;
                }
            }
        });
    }
    
    setInterval(updateWarFronts, 8000);
}

// === TECH PROGRESS UPDATES ===
function initTechProgressUpdates() {
    const activeTechItems = document.querySelectorAll('.tech-item.active');
    
    function updateTechProgress() {
        activeTechItems.forEach(item => {
            const progressFill = item.querySelector('.progress-fill');
            const percentEl = item.querySelector('.tech-percent');
            
            if (progressFill && percentEl) {
                // Update progress
                const currentWidth = parseInt(progressFill.style.width);
                const increase = Math.random() * 3;
                const newWidth = Math.min(100, currentWidth + increase);
                
                progressFill.style.width = `${newWidth}%`;
                percentEl.textContent = `${Math.round(newWidth)}%`;
                
                // If completed, change status
                if (newWidth >= 100) {
                    item.classList.remove('active');
                    item.classList.add('completed');
                    
                    // Update icon
                    const icon = item.querySelector('.tech-icon');
                    if (icon) icon.textContent = '✅';
                    
                    // Remove progress bar
                    const progressContainer = item.querySelector('.tech-progress');
                    if (progressContainer) {
                        progressContainer.remove();
                    }
                    
                    // Remove percent element
                    percentEl.remove();
                    
                    // Add level
                    const levelEl = document.createElement('span');
                    levelEl.className = 'tech-level';
                    levelEl.textContent = 'LV.MAX';
                    item.appendChild(levelEl);
                }
            }
        });
    }
    
    setInterval(updateTechProgress, 4000);
}

// === SYSTEM METRICS ===
function initSystemMetrics() {
    const metricFills = document.querySelectorAll('.metric-fill');
    const metricValues = document.querySelectorAll('.metric-value');
    
    function updateSystemMetrics() {
        metricFills.forEach((fill, index) => {
            // Update bar width
            const currentWidth = parseInt(fill.style.width);
            const change = (Math.random() - 0.5) * 10;
            const newWidth = Math.max(10, Math.min(95, currentWidth + change));
            fill.style.width = `${newWidth}%`;
            
            // Update value
            if (metricValues[index]) {
                metricValues[index].textContent = `${Math.round(newWidth)}%`;
            }
            
            // Update color based on value
            if (newWidth > 80) {
                fill.style.background = 'linear-gradient(90deg, #aa2200, #ff3366)';
            } else if (newWidth > 60) {
                fill.style.background = 'linear-gradient(90deg, #aa6600, #ffaa00)';
            } else {
                fill.style.background = 'linear-gradient(90deg, var(--color-federation-dark), var(--color-federation))';
            }
        });
    }
    
    setInterval(updateSystemMetrics, 2000);
}

// === UTILITY FUNCTIONS ===
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', function(e) {
    // Alt + R: Refresh all data
    if (e.altKey && e.key === 'r') {
        e.preventDefault();
        location.reload();
    }
    
    // Alt + M: Toggle map view
    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const mapBtns = document.querySelectorAll('.control-btn');
        const activeIndex = Array.from(mapBtns).findIndex(btn => btn.classList.contains('active'));
        const nextIndex = (activeIndex + 1) % mapBtns.length;
        mapBtns[nextIndex].click();
    }
});

// === INITIALIZATION COMPLETE ===
console.log('NEXUS PRIME DASHBOARD v4.7.2 INITIALIZED');
console.log('System status: ONLINE');
console.log('All modules loaded successfully');