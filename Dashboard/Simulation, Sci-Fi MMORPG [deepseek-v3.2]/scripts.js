// scripts.js
// NEXUS OVERWATCH - Omniversal Command Dashboard
// Dynamic functionality for the ultra-dense sci-fi interface

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dashboard modules
    initializeDashboard();
    
    // Start all real-time updates
    startRealTimeUpdates();
    
    // Setup interactive elements
    setupInteractions();
    
    // Initialize star map visualization
    initializeStarMap();
    
    // Setup console functionality
    setupConsole();
});

// Main initialization
function initializeDashboard() {
    console.log('NEXUS OVERWATCH :: Omniversal Command Dashboard Initializing...');
    
    // Add loading complete notification
    setTimeout(() => {
        addConsoleMessage('success', '📡 Dashboard initialization complete. All systems operational.');
    }, 500);
}

// Real-time updates for dashboard elements
function startRealTimeUpdates() {
    // Update universe clock every second
    setInterval(updateUniverseClock, 1000);
    
    // Update resource values every 5 seconds
    setInterval(updateResources, 5000);
    
    // Update fleet statuses every 10 seconds
    setInterval(updateFleetStatus, 10000);
    
    // Update research progress every 30 seconds
    setInterval(updateResearchProgress, 30000);
    
    // Update market tickers every 8 seconds
    setInterval(updateMarketTickers, 8000);
    
    // Simulate random events every 15-45 seconds
    setInterval(simulateRandomEvent, Math.random() * 30000 + 15000);
    
    // Update console with periodic updates every 20 seconds
    setInterval(addPeriodicUpdate, 20000);
}

// Update the universe clock with sci-fi time format
function updateUniverseClock() {
    const clockElement = document.getElementById('universe-clock');
    if (!clockElement) return;
    
    // Create a more dynamic time format
    const now = new Date();
    const cycle = Math.floor(Math.random() * 10000) + 4700; // Random universe cycle
    const day = Math.floor(Math.random() * 30) + 1;
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const millisecond = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    // Occasionally add a glitch effect
    if (Math.random() < 0.01) {
        clockElement.textContent = `${cycle}.${day}.${Math.floor(Math.random() * 30)} :: ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 100)}`;
        clockElement.classList.add('glitch');
        setTimeout(() => clockElement.classList.remove('glitch'), 200);
    } else {
        clockElement.textContent = `${cycle}.${day}.${Math.floor(Math.random() * 20) + 10} :: ${hour}:${minute}:${second}.${millisecond}`;
    }
    
    // Update time dilation randomly
    const dilationElements = document.querySelectorAll('.dilation');
    dilationElements.forEach(el => {
        const dilation = (Math.random() * 0.1 + 1.04).toFixed(3);
        el.textContent = `⏱️ TIME DILATION: ${dilation}x`;
    });
}

// Update resource values dynamically
function updateResources() {
    const resourceItems = document.querySelectorAll('.resource-item');
    
    resourceItems.forEach(item => {
        const valueElement = item.querySelector('.resource-value');
        const rateElement = item.querySelector('.resource-rate');
        const barFill = item.querySelector('.bar-fill');
        
        if (!valueElement || !rateElement || !barFill) return;
        
        // Parse current values
        const currentText = valueElement.textContent;
        const match = currentText.match(/([\d.]+)([MK]?)\/([\d.]+)([MK]?)/);
        
        if (!match) return;
        
        let currentValue = parseFloat(match[1]);
        const currentSuffix = match[2];
        let maxValue = parseFloat(match[3]);
        const maxSuffix = match[4];
        
        // Convert to base numbers for calculation
        if (currentSuffix === 'M') currentValue *= 1000000;
        if (currentSuffix === 'K') currentValue *= 1000;
        if (maxSuffix === 'M') maxValue *= 1000000;
        if (maxSuffix === 'K') maxValue *= 1000;
        
        // Generate small random changes
        const changePercent = (Math.random() - 0.45) * 0.05; // +/- 2.5%
        const changeAmount = currentValue * changePercent;
        const newValue = Math.max(0, Math.min(maxValue, currentValue + changeAmount));
        
        // Calculate new percentage
        const newPercent = (newValue / maxValue) * 100;
        
        // Update bar width
        barFill.style.width = `${newPercent}%`;
        
        // Format and update display value
        let displayValue, displaySuffix;
        if (newValue >= 1000000) {
            displayValue = (newValue / 1000000).toFixed(2);
            displaySuffix = 'M';
        } else if (newValue >= 1000) {
            displayValue = (newValue / 1000).toFixed(1);
            displaySuffix = 'K';
        } else {
            displayValue = Math.round(newValue);
            displaySuffix = '';
        }
        
        valueElement.textContent = `${displayValue}${displaySuffix}/${match[3]}${maxSuffix}`;
        
        // Update rate indicator
        const rateChange = changeAmount > 0 ? '📈' : '📉';
        const rateValue = Math.abs(changeAmount);
        let rateText, rateSuffix;
        
        if (rateValue >= 1000000) {
            rateText = (rateValue / 1000000).toFixed(2);
            rateSuffix = 'M/s';
        } else if (rateValue >= 1000) {
            rateText = (rateValue / 1000).toFixed(1);
            rateSuffix = 'k/s';
        } else {
            rateText = Math.round(rateValue);
            rateSuffix = '/s';
        }
        
        rateElement.textContent = `${rateChange} ${rateText}${rateSuffix}`;
        rateElement.style.color = changeAmount > 0 ? '#00ff9d' : '#ff5555';
    });
}

// Update fleet status dynamically
function updateFleetStatus() {
    const fleetItems = document.querySelectorAll('.fleet-item');
    
    fleetItems.forEach(item => {
        const healthBar = item.querySelector('.health-fill');
        const healthValue = item.querySelector('.health-value');
        const statusElement = item.querySelector('.fleet-status');
        
        if (!healthBar || !healthValue || !statusElement) return;
        
        // Get current health
        const currentWidth = parseFloat(healthBar.style.width);
        if (isNaN(currentWidth)) return;
        
        // Small random health changes
        const healthChange = (Math.random() - 0.5) * 5; // +/- 2.5%
        const newHealth = Math.max(0, Math.min(100, currentWidth + healthChange));
        
        // Update health display
        healthBar.style.width = `${newHealth}%`;
        healthValue.textContent = `${Math.round(newHealth)}%`;
        
        // Update health bar color based on value
        if (newHealth > 75) {
            healthBar.style.background = 'linear-gradient(90deg, #00ff9d, #00b8ff)';
        } else if (newHealth > 50) {
            healthBar.style.background = 'linear-gradient(90deg, #ffeb3b, #ff9800)';
        } else {
            healthBar.style.background = 'linear-gradient(90deg, #ff0055, #ff5500)';
        }
        
        // Occasionally change status
        if (Math.random() < 0.1) {
            const statuses = ['🟢 ACTIVE', '🟡 ENGAGED', '🔵 PATROLLING', '⚪ STANDBY', '🟣 RETURNING'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            statusElement.textContent = newStatus;
            
            // Update status color
            if (newStatus.includes('ACTIVE') || newStatus.includes('PATROLLING')) {
                statusElement.style.background = 'rgba(0, 255, 157, 0.2)';
                statusElement.style.color = '#00ff9d';
            } else if (newStatus.includes('ENGAGED')) {
                statusElement.style.background = 'rgba(255, 235, 59, 0.2)';
                statusElement.style.color = '#ffeb3b';
            } else {
                statusElement.style.background = 'rgba(255, 255, 255, 0.1)';
                statusElement.style.color = '#b0b0ff';
            }
        }
        
        // Update location randomly
        if (Math.random() < 0.15) {
            const locationElement = item.querySelector('.fleet-location');
            if (locationElement) {
                const locations = ['📍 SOLAR PRIME', '📍 NEXUS CORE', '📍 VOID\'S EDGE', '📍 CYGNUS STREAM', '📍 QUANTUM RIFT', '📍 NEBULA ZONE'];
                locationElement.textContent = locations[Math.floor(Math.random() * locations.length)];
            }
        }
    });
    
    // Update fleet summary
    updateFleetSummary();
}

// Update fleet summary statistics
function updateFleetSummary() {
    const summaryItems = document.querySelectorAll('.summary-item');
    
    summaryItems.forEach(item => {
        const label = item.querySelector('.summary-label').textContent;
        const valueElement = item.querySelector('.summary-value');
        
        if (!valueElement) return;
        
        let currentValue = parseInt(valueElement.textContent) || 0;
        let newValue = currentValue;
        
        switch(label) {
            case 'TOTAL FLEETS':
                newValue = Math.max(40, Math.min(60, currentValue + Math.floor(Math.random() * 3 - 1)));
                break;
            case 'ACTIVE':
                newValue = Math.max(25, Math.min(40, currentValue + Math.floor(Math.random() * 3 - 1)));
                break;
            case 'COMBAT READY':
                newValue = Math.max(80, Math.min(98, currentValue + (Math.random() * 4 - 2)));
                newValue = Math.round(newValue);
                break;
            case 'AVG. HEALTH':
                newValue = Math.max(75, Math.min(95, currentValue + (Math.random() * 2 - 1)));
                newValue = parseFloat(newValue.toFixed(1));
                break;
        }
        
        valueElement.textContent = newValue;
        
        // Add subtle animation
        valueElement.classList.add('updating');
        setTimeout(() => valueElement.classList.remove('updating'), 500);
    });
}

// Update research progress
function updateResearchProgress() {
    const researchItems = document.querySelectorAll('.research-item');
    
    researchItems.forEach(item => {
        // Skip completed or queued research
        if (item.classList.contains('completed') || item.classList.contains('queued')) return;
        
        const progressFill = item.querySelector('.progress-fill');
        const progressText = item.querySelector('.progress-text');
        const etaElement = item.querySelector('.research-eta');
        
        if (!progressFill || !progressText || !etaElement) return;
        
        // Get current progress
        const currentWidth = parseFloat(progressFill.style.width) || 0;
        
        // Research advances slowly
        const researchSpeed = 0.5 + Math.random() * 1.5; // 0.5% to 2% per update
        const newProgress = Math.min(100, currentWidth + researchSpeed);
        
        // Update progress
        progressFill.style.width = `${newProgress}%`;
        progressText.textContent = `${Math.round(newProgress)}%`;
        
        // Update ETA
        if (newProgress < 100) {
            const hoursRemaining = Math.round((100 - newProgress) / researchSpeed * (30 / 3600)); // Convert to hours
            etaElement.textContent = `ETA: ${hoursRemaining}h`;
        } else {
            // Research complete!
            progressText.textContent = 'COMPLETE';
            etaElement.textContent = '✅ DEPLOYED';
            item.classList.add('completed');
            item.classList.remove('active');
            
            // Add console notification
            const researchName = item.querySelector('.research-name').textContent;
            addConsoleMessage('success', `✅ Research "${researchName}" completed and deployed.`);
        }
    });
}

// Update market tickers with realistic fluctuations
function updateMarketTickers() {
    const tickerItems = document.querySelectorAll('.ticker-item');
    
    tickerItems.forEach(item => {
        const priceElement = item.querySelector('.ticker-price');
        const changeElement = item.querySelector('.ticker-change');
        
        if (!priceElement || !changeElement) return;
        
        // Parse current price
        const currentPrice = parseFloat(priceElement.textContent.replace(',', ''));
        if (isNaN(currentPrice)) return;
        
        // Generate price change
        const volatility = 0.02; // 2% max change
        const changePercent = (Math.random() - 0.5) * volatility;
        const changeAmount = currentPrice * changePercent;
        const newPrice = Math.max(1, currentPrice + changeAmount);
        
        // Update price display
        priceElement.textContent = newPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        // Update change indicator
        const isUp = changeAmount >= 0;
        const changePercentDisplay = (Math.abs(changePercent) * 100).toFixed(2);
        
        changeElement.textContent = `${isUp ? '📈' : '📉'} ${changePercentDisplay}%`;
        changeElement.className = `ticker-change ${isUp ? 'up' : 'down'}`;
        
        // Update background color briefly
        item.style.backgroundColor = isUp ? 'rgba(0, 40, 20, 0.5)' : 'rgba(40, 0, 0, 0.5)';
        setTimeout(() => {
            item.style.backgroundColor = '';
        }, 1000);
    });
}

// Initialize the interactive star map
function initializeStarMap() {
    const canvas = document.getElementById('starmap-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        drawStarMap();
    }
    
    // Draw the star map
    function drawStarMap() {
        if (!ctx) return;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(5, 10, 30, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw background stars
        drawStars();
        
        // Draw nebulae
        drawNebulae();
        
        // Draw grid lines
        drawGrid();
        
        // Draw connection lines between systems
        drawConnections();
    }
    
    function drawStars() {
        const starCount = 200;
        
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 1.5;
            const brightness = Math.random() * 100 + 155;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness / 255})`;
            ctx.fill();
            
            // Add twinkle effect to some stars
            if (Math.random() < 0.3) {
                ctx.beginPath();
                ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * Math.random()})`;
                ctx.fill();
            }
        }
    }
    
    function drawNebulae() {
        // Draw some colorful nebulae patches
        const nebulae = [
            { x: canvas.width * 0.3, y: canvas.height * 0.2, radius: canvas.width * 0.15, color: 'rgba(0, 100, 255, 0.05)' },
            { x: canvas.width * 0.7, y: canvas.height * 0.6, radius: canvas.width * 0.2, color: 'rgba(150, 0, 255, 0.04)' },
            { x: canvas.width * 0.5, y: canvas.height * 0.8, radius: canvas.width * 0.1, color: 'rgba(0, 200, 200, 0.03)' }
        ];
        
        nebulae.forEach(nebula => {
            const gradient = ctx.createRadialGradient(
                nebula.x, nebula.y, 0,
                nebula.x, nebula.y, nebula.radius
            );
            
            gradient.addColorStop(0, nebula.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function drawGrid() {
        ctx.strokeStyle = 'rgba(0, 150, 255, 0.1)';
        ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = 0; x <= canvas.width; x += canvas.width / 10) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= canvas.height; y += canvas.height / 10) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    function drawConnections() {
        const markers = document.querySelectorAll('.system-marker');
        const markerPositions = [];
        
        markers.forEach(marker => {
            const style = window.getComputedStyle(marker);
            const top = parseFloat(style.top) / 100 * canvas.height;
            const left = parseFloat(style.left) / 100 * canvas.width;
            markerPositions.push({ x: left, y: top });
        });
        
        // Draw connections between some systems
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        
        if (markerPositions.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(markerPositions[0].x, markerPositions[0].y);
            ctx.lineTo(markerPositions[1].x, markerPositions[1].y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(markerPositions[1].x, markerPositions[1].y);
            ctx.lineTo(markerPositions[3].x, markerPositions[3].y);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
    }
    
    // Initial draw
    resizeCanvas();
    
    // Redraw on resize
    window.addEventListener('resize', resizeCanvas);
    
    // Redraw periodically for animations
    setInterval(() => {
        drawStarMap();
    }, 5000);
    
    // Add click handlers to system markers
    const systemMarkers = document.querySelectorAll('.system-marker');
    systemMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const systemName = this.getAttribute('data-system');
            addConsoleMessage('info', `🛰️ System focus shifted to ${systemName}`);
            
            // Highlight this system
            systemMarkers.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update starmap stats temporarily
            const statItems = document.querySelectorAll('.stat-item');
            if (statItems.length >= 4) {
                statItems[0].querySelector('.stat-value').textContent = Math.floor(Math.random() * 2000) + 1000;
                statItems[1].querySelector('.stat-value').textContent = Math.floor(Math.random() * 1000) + 500;
                
                setTimeout(() => {
                    statItems[0].querySelector('.stat-value').textContent = '1,247';
                    statItems[1].querySelector('.stat-value').textContent = '893';
                }, 3000);
            }
        });
    });
}

// Setup interactive elements
function setupInteractions() {
    // Panel control buttons
    const controlButtons = document.querySelectorAll('.btn-micro');
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (!icon) return;
            
            const action = icon.className;
            
            // Visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Different actions based on icon
            if (action.includes('sync-alt')) {
                addConsoleMessage('info', '🔄 Resource matrix synchronized.');
                updateResources();
            } else if (action.includes('expand-alt')) {
                addConsoleMessage('info', '🔍 Panel expanded view activated.');
            } else if (action.includes('search-plus')) {
                addConsoleMessage('info', '🔭 Starmap zoom level increased.');
            } else if (action.includes('filter')) {
                addConsoleMessage('info', '🎛️ Starmap filters applied.');
            } else if (action.includes('crosshairs')) {
                addConsoleMessage('info', '🎯 System targeting enabled.');
            }
        });
    });
    
    // Fleet item interactions
    const fleetItems = document.querySelectorAll('.fleet-item');
    fleetItems.forEach(item => {
        item.addEventListener('click', function() {
            const fleetName = this.querySelector('.fleet-name').textContent;
            addConsoleMessage('info', `🚀 Fleet command interface opened for ${fleetName}`);
            
            // Highlight temporarily
            this.classList.add('selected');
            setTimeout(() => {
                this.classList.remove('selected');
            }, 1000);
        });
    });
    
    // Faction item interactions
    const factionItems = document.querySelectorAll('.faction-item');
    factionItems.forEach(item => {
        item.addEventListener('click', function() {
            const factionName = this.querySelector('.faction-name').textContent;
            const relation = this.querySelector('.faction-relation').textContent;
            addConsoleMessage('info', `🛡️ Diplomatic status: ${factionName} - ${relation}`);
            
            // Pulse effect
            this.style.boxShadow = '0 0 15px rgba(0, 255, 157, 0.5)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 500);
        });
    });
}

// Setup console functionality
function setupConsole() {
    const consoleInput = document.getElementById('console-input');
    const sendButton = document.querySelector('.btn-send');
    const consoleOutput = document.getElementById('console-output');
    
    if (!consoleInput || !sendButton || !consoleOutput) return;
    
    // Send message on button click
    sendButton.addEventListener('click', sendConsoleCommand);
    
    // Send message on Enter key
    consoleInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendConsoleCommand();
        }
    });
    
    // Console command handler
    function sendConsoleCommand() {
        const command = consoleInput.value.trim();
        
        if (!command) return;
        
        // Add user command to console
        addConsoleMessage('info', `NEXUS::OVERWATCH&gt; ${command}`);
        
        // Process commands
        processCommand(command);
        
        // Clear input
        consoleInput.value = '';
        
        // Scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    // Command processing
    function processCommand(command) {
        const cmd = command.toLowerCase();
        
        // Simple command responses
        if (cmd.includes('status') || cmd.includes('report')) {
            addConsoleMessage('info', '📊 SYSTEM STATUS: All systems operational. Threat level: NORMAL.');
        } else if (cmd.includes('scan') || cmd.includes('sensor')) {
            addConsoleMessage('info', '🛰️ SENSOR SWEEP: 14 unidentified contacts detected in Sector 7-Δ.');
        } else if (cmd.includes('deploy') || cmd.includes('fleet')) {
            addConsoleMessage('success', '🚀 FLEET DEPLOYMENT: 1st Battle Group dispatched to coordinates.');
        } else if (cmd.includes('research') || cmd.includes('tech')) {
            addConsoleMessage('info', '🔬 RESEARCH: Quantum Entanglement at 78%. Estimated completion: 4.7h.');
        } else if (cmd.includes('resource') || cmd.includes('production')) {
            addConsoleMessage('info', '⚛️ RESOURCES: Production efficiency at 87%. All extraction facilities operational.');
        } else if (cmd.includes('help') || cmd === '?') {
            addConsoleMessage('info', '❓ AVAILABLE COMMANDS: status, scan, deploy [fleet], research, resources, clear');
        } else if (cmd === 'clear') {
            clearConsole();
        } else {
            addConsoleMessage('warning', `⚠️ UNRECOGNIZED COMMAND: "${command}". Type "help" for available commands.`);
        }
    }
    
    // Add message to console
    window.addConsoleMessage = function(type, message) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-message ${type}`;
        
        const time = new Date();
        const timeString = `[${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}]`;
        
        logEntry.innerHTML = `
            <span class="log-time">${timeString}</span>
            <span class="log-content">${message}</span>
        `;
        
        consoleOutput.appendChild(logEntry);
        
        // Limit console to 50 messages
        const messages = consoleOutput.querySelectorAll('.log-message');
        if (messages.length > 50) {
            messages[0].remove();
        }
        
        // Scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        
        // Add visual effect for important messages
        if (type === 'alert' || type === 'warning') {
            consoleOutput.style.backgroundColor = 'rgba(255, 0, 85, 0.05)';
            setTimeout(() => {
                consoleOutput.style.backgroundColor = '';
            }, 500);
        }
    };
    
    // Clear console
    function clearConsole() {
        consoleOutput.innerHTML = '';
        addConsoleMessage('info', '🧹 Console cleared.');
    }
}

// Add periodic updates to console
function addPeriodicUpdate() {
    const updates = [
        '🛸 Deep space probe returning with data from unexplored sector.',
        '⚡ Energy grid stabilizing after minor fluctuation.',
        '🛠️ Maintenance drones completing routine hull inspections.',
        '📡 Long-range sensors detecting anomalous energy signatures.',
        '🤖 AI cores operating at 99.3% efficiency.',
        '🌌 Dark matter harvesters reporting increased yield.',
        '🛡️ Defense systems updated with latest threat protocols.',
        '🚀 Scout ships reporting clear navigation paths.',
        '💎 Crystal refinement process optimized by 3.2%.',
        '🧬 Bio-mass synthesizers operating at peak capacity.'
    ];
    
    const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
    addConsoleMessage('info', randomUpdate);
}

// Simulate random events in the universe
function simulateRandomEvent() {
    const events = [
        {
            type: 'warning',
            message: '⚠️ Minor energy surge detected in Quantum Reactor. Stabilizing...',
            action: () => {
                // Briefly change energy resource
                const energyItem = document.querySelector('.resource-item:nth-child(2)');
                if (energyItem) {
                    const rateElement = energyItem.querySelector('.resource-rate');
                    if (rateElement) {
                        const originalText = rateElement.textContent;
                        rateElement.textContent = '⚠️ STABILIZING';
                        rateElement.style.color = '#ffeb3b';
                        
                        setTimeout(() => {
                            rateElement.textContent = originalText;
                            rateElement.style.color = '';
                        }, 5000);
                    }
                }
            }
        },
        {
            type: 'trade',
            message: '💰 Trade route profitability increased by 8.7% due to market shift.',
            action: () => {
                // Update a trade route profit
                const routeProfit = document.querySelector('.route-profit');
                if (routeProfit) {
                    const originalText = routeProfit.textContent;
                    const originalValue = parseFloat(originalText.match(/[\d.]+/)[0]);
                    const newValue = originalValue * 1.087;
                    routeProfit.textContent = `💰 +${newValue.toFixed(1)}k/h`;
                    
                    setTimeout(() => {
                        routeProfit.textContent = originalText;
                    }, 10000);
                }
            }
        },
        {
            type: 'alert',
            message: '🚨 Unidentified vessel approaching restricted zone. Security alerted.',
            action: () => {
                // Flash alert in status bar
                const alertElement = document.querySelector('.alert.critical');
                if (alertElement) {
                    const originalText = alertElement.textContent;
                    alertElement.textContent = '🚨 INTRUDER ALERT';
                    
                    setTimeout(() => {
                        alertElement.textContent = originalText;
                    }, 8000);
                }
            }
        },
        {
            type: 'success',
            message: '✅ Anomaly analysis complete. 247.3 TB of data added to archives.',
            action: () => {
                // No specific action
            }
        }
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    addConsoleMessage(randomEvent.type, randomEvent.message);
    randomEvent.action();
}

// Add CSS classes for dynamic effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .glitch {
        animation: glitchText 0.1s infinite;
    }
    
    @keyframes glitchText {
        0% { transform: translateX(-1px); }
        50% { transform: translateX(1px); }
        100% { transform: translateX(-1px); }
    }
    
    .updating {
        animation: pulseUpdate 0.5s;
    }
    
    @keyframes pulseUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .selected {
        box-shadow: 0 0 15px rgba(0, 255, 157, 0.5) !important;
        border-color: rgba(0, 255, 157, 0.7) !important;
    }
    
    .system-marker.selected .marker-dot {
        box-shadow: 0 0 20px var(--glow-primary) !important;
        animation: pulse 0.5s infinite alternate !important;
    }
`;
document.head.appendChild(styleSheet);

// Initialize with a welcome message
setTimeout(() => {
    addConsoleMessage('success', '🌌 WELCOME TO NEXUS OVERWATCH. Omniversal command dashboard initialized.');
    addConsoleMessage('info', '📊 All systems reporting nominal. Real-time data streams active.');
    addConsoleMessage('info', '🚀 Type "help" in console for available commands.');
}, 1000);