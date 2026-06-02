const dashboard = {
    init: function() {
        this.initStarMap();
        this.initSectorGrid();
        this.initResourceCharts();
        this.startTimers();
        this.startUpdates();
        this.startAnimations();
        this.initMarketTicker();
    },

    initStarMap: function() {
        const canvas = document.getElementById('star-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        
        function resize() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            drawStars();
        }
        
        const stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                brightness: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
        
        const nebulaData = [];
        for (let i = 0; i < 5; i++) {
            nebulaData.push({
                x: Math.random(),
                y: Math.random(),
                radius: Math.random() * 0.3 + 0.1,
                color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#a55eea'][i],
                opacity: Math.random() * 0.1 + 0.05
            });
        }
        
        function drawStars() {
            ctx.fillStyle = '#050810';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            nebulaData.forEach(nebula => {
                const gradient = ctx.createRadialGradient(
                    nebula.x * canvas.width, nebula.y * canvas.height, 0,
                    nebula.x * canvas.width, nebula.y * canvas.height, nebula.radius * canvas.width
                );
                gradient.addColorStop(0, nebula.color + '40');
                gradient.addColorStop(0.5, nebula.color + '20');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });
            
            const time = Date.now() / 1000;
            stars.forEach(star => {
                const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.twinklePhase) * 0.3 + 0.7;
                const alpha = star.brightness * twinkle;
                ctx.beginPath();
                ctx.arc(
                    star.x * canvas.width,
                    star.y * canvas.height,
                    star.size,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
                
                if (star.size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(
                        star.x * canvas.width,
                        star.y * canvas.height,
                        star.size * 2,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.2})`;
                    ctx.fill();
                }
            });
            
            drawConnections();
        }
        
        function drawConnections() {
            const connections = [
                {x1: 0.2, y1: 0.3, x2: 0.4, y2: 0.5, color: 'rgba(0, 212, 255, 0.2)'},
                {x1: 0.4, y1: 0.5, x2: 0.7, y2: 0.4, color: 'rgba(0, 212, 255, 0.2)'},
                {x1: 0.7, y1: 0.4, x2: 0.8, y2: 0.7, color: 'rgba(255, 71, 87, 0.2)'},
                {x1: 0.3, y1: 0.7, x2: 0.5, y2: 0.8, color: 'rgba(74, 158, 255, 0.2)'},
                {x1: 0.5, y1: 0.2, x2: 0.6, y2: 0.3, color: 'rgba(46, 213, 115, 0.2)'},
            ];
            
            connections.forEach(conn => {
                ctx.beginPath();
                ctx.moveTo(conn.x1 * canvas.width, conn.y1 * canvas.height);
                ctx.lineTo(conn.x2 * canvas.width, conn.y2 * canvas.height);
                ctx.strokeStyle = conn.color;
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            });
        }
        
        resize();
        window.addEventListener('resize', resize);
        
        function animate() {
            drawStars();
            requestAnimationFrame(animate);
        }
        animate();
    },

    initSectorGrid: function() {
        const grid = document.getElementById('sector-grid');
        if (!grid) return;
        
        const sectors = [
            'imperial', 'imperial', 'imperial', 'contested', 'federation', 'federation', 'neutral', 'neutral',
            'imperial', 'imperial', 'contested', 'contested', 'federation', 'federation', 'federation', 'neutral',
            'imperial', 'contested', 'contested', 'contested', 'contested', 'federation', 'federation', 'alliance',
            'syndicate', 'syndicate', 'contested', 'neutral', 'neutral', 'alliance', 'alliance', 'alliance',
            'syndicate', 'syndicate', 'syndicate', 'contested', 'neutral', 'neutral', 'alliance', 'alliance',
            'syndicate', 'syndicate', 'syndicate', 'neutral', 'neutral', 'neutral', 'alliance', 'alliance'
        ];
        
        const emojis = {
            imperial: '⚔️',
            federation: '🛡️',
            syndicate: '💰',
            alliance: '⚖️',
            contested: '⚠️',
            neutral: '◯'
        };
        
        sectors.forEach((faction, index) => {
            const cell = document.createElement('div');
            cell.className = `sector-cell ${faction}`;
            cell.innerHTML = `<span>${emojis[faction]}</span>`;
            cell.style.fontSize = '10px';
            grid.appendChild(cell);
        });
    },

    initResourceCharts: function() {
        const titaniumChart = document.getElementById('titanium-chart');
        const crystalsChart = document.getElementById('crystals-chart');
        
        if (titaniumChart) {
            for (let i = 0; i < 24; i++) {
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.height = `${Math.random() * 70 + 30}%`;
                bar.style.opacity = 0.3 + (i / 24) * 0.7;
                titaniumChart.appendChild(bar);
            }
        }
        
        if (crystalsChart) {
            for (let i = 0; i < 24; i++) {
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.height = `${Math.random() * 60 + 20}%`;
                bar.style.opacity = 0.3 + (i / 24) * 0.7;
                crystalsChart.appendChild(bar);
            }
        }
    },

    startTimers: function() {
        const self = this;
        
        setInterval(() => {
            self.updateServerTime();
        }, 1000);
        
        setInterval(() => {
            self.updateCycleTime();
        }, 100);
    },

    updateServerTime: function() {
        const serverTimeEl = document.getElementById('server-time');
        const localTimeEl = document.getElementById('local-time');
        
        if (serverTimeEl) {
            const now = new Date();
            const serverYear = 2387;
            const serverMonth = 12;
            const serverDay = 14;
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            serverTimeEl.textContent = `${serverYear}.${serverMonth}.${serverDay} | ${hours}:${minutes}:${seconds}`;
        }
        
        if (localTimeEl) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            localTimeEl.textContent = `${hours}:${minutes}:${seconds} UTC`;
        }
    },

    updateCycleTime: function() {
        const cycleEl = document.getElementById('cycle-time');
        if (cycleEl) {
            const baseCycle = 2847.33;
            const increment = (Date.now() % 100000) / 100;
            cycleEl.textContent = (baseCycle + increment).toFixed(2);
        }
    },

    startUpdates: function() {
        const self = this;
        
        setInterval(() => {
            self.updateResourceValues();
        }, 2000);
        
        setInterval(() => {
            self.updateFleetStatus();
        }, 5000);
        
        setInterval(() => {
            self.updateMarketPrices();
        }, 3000);
        
        setInterval(() => {
            self.updateResearchProgress();
        }, 1000);
        
        setInterval(() => {
            self.addRandomComm();
        }, 15000);
        
        setInterval(() => {
            self.updateSystemMetrics();
        }, 2000);
    },

    updateResourceValues: function() {
        const tickerItems = document.querySelectorAll('.ticker-item');
        tickerItems.forEach(item => {
            const valEl = item.querySelector('.ticker-val');
            const rateEl = item.querySelector('.ticker-rate');
            
            if (valEl) {
                let currentVal = parseInt(valEl.textContent.replace(/,/g, ''));
                const rate = parseInt(rateEl.textContent.match(/-?\d+/) || [0]);
                const change = Math.floor(Math.random() * Math.abs(rate) * 2) - Math.abs(rate);
                currentVal += change;
                valEl.textContent = currentVal.toLocaleString();
            }
        });
        
        const chartBars = document.querySelectorAll('.chart-bars');
        chartBars.forEach(chart => {
            const bars = chart.querySelectorAll('.chart-bar');
            bars.forEach(bar => {
                const currentHeight = parseFloat(bar.style.height);
                const change = (Math.random() - 0.5) * 10;
                const newHeight = Math.max(10, Math.min(100, currentHeight + change));
                bar.style.height = `${newHeight}%`;
            });
        });
    },

    updateFleetStatus: function() {
        const fleetItems = document.querySelectorAll('.fleet-item');
        fleetItems.forEach(item => {
            const barFills = item.querySelectorAll('.bar-fill');
            barFills.forEach(fill => {
                const currentWidth = parseFloat(fill.style.width);
                const change = (Math.random() - 0.5) * 2;
                const newWidth = Math.max(5, Math.min(100, currentWidth + change));
                fill.style.width = `${newWidth}%`;
                
                const valEl = fill.parentElement.nextElementSibling;
                if (valEl && valEl.classList.contains('stat-bar-val')) {
                    if (valEl.textContent.includes('/')) {
                        const parts = valEl.textContent.split('/');
                        const max = parseInt(parts[1]);
                        const newCurrent = Math.floor(max * newWidth / 100);
                        valEl.textContent = `${newCurrent.toLocaleString()}/${max.toLocaleString()}`;
                    } else {
                        valEl.textContent = `${Math.floor(newWidth)}%`;
                    }
                }
            });
        });
    },

    updateMarketPrices: function() {
        const marketItems = document.querySelectorAll('.market-item');
        marketItems.forEach(item => {
            const text = item.textContent;
            const priceMatch = text.match(/[\d,]+\.?\d*/);
            if (priceMatch) {
                const currentPrice = parseFloat(priceMatch[0].replace(/,/g, ''));
                const change = (Math.random() - 0.5) * currentPrice * 0.01;
                const newPrice = currentPrice + change;
                const symbol = text.split(':')[0];
                const trendMatch = text.match(/[↑↓→][+-]?\d+\.?\d*%/);
                const trend = trendMatch ? trendMatch[0] : '';
                
                let newTrend = trend;
                if (change > currentPrice * 0.005) {
                    newTrend = `↑+${Math.abs(change / currentPrice * 100).toFixed(1)}%`;
                } else if (change < -currentPrice * 0.005) {
                    newTrend = `↓${(change / currentPrice * 100).toFixed(1)}%`;
                } else {
                    newTrend = `→0.0%`;
                }
                
                item.textContent = `${symbol}: ${newPrice.toFixed(1)} ₵ ${newTrend}`;
            }
        });
    },

    updateResearchProgress: function() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const currentWidth = parseFloat(bar.style.width);
            if (currentWidth < 100) {
                const newWidth = Math.min(100, currentWidth + 0.1);
                bar.style.width = `${newWidth}%`;
                
                const textEl = bar.parentElement.nextElementSibling;
                if (textEl) {
                    const hoursMatch = textEl.textContent.match(/(\d+)H/);
                    if (hoursMatch) {
                        const currentHours = parseInt(hoursMatch[1]);
                        const newHours = Math.max(0, currentHours - 0.01);
                        textEl.textContent = `${Math.floor(newWidth)}% | ETA: ${Math.ceil(newHours)}H`;
                    }
                }
            }
        });
        
        const queueItems = document.querySelectorAll('.queue-item');
        queueItems.forEach(item => {
            const timeEl = item.querySelector('.queue-time');
            if (timeEl) {
                const hoursMatch = timeEl.textContent.match(/(\d+)H/);
                if (hoursMatch) {
                    const currentHours = parseInt(hoursMatch[1]);
                    if (currentHours > 0) {
                        const newHours = Math.max(0, currentHours - 0.01);
                        timeEl.textContent = `${Math.ceil(newHours)}H REMAINING`;
                    }
                }
            }
        });
    },

    addRandomComm: function() {
        const feed = document.getElementById('comms-feed');
        if (!feed) return;
        
        const messages = [
            {priority: 'low', source: '🛰️ SENSOR ARRAY', message: '📡 Routine scan complete. No anomalies detected in sector perimeter.'},
            {priority: 'low', source: '🔧 ENGINEERING', message: '⚙️ ISS HAMMERFALL repairs on schedule. Hull integrity restored to 100%.'},
            {priority: 'medium', source: '💰 TRADE GUILD', message: '📊 Crystal demand increasing in outer colonies. Consider stockpiling.'},
            {priority: 'low', source: '🔬 RESEARCH DIV', message: '🧬 Gene modification trials showing promising results in test subjects.'},
            {priority: 'medium', source: '🚨 FLEET COMMAND', message: '⚠️ Syndicate activity detected near border stations. Heightened alert.'},
        ];
        
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        
        const newItem = document.createElement('div');
        newItem.className = `comm-item priority-${randomMsg.priority}`;
        
        const priorityColors = {
            high: '🔴 HIGH',
            medium: '🟡 MED',
            low: '🟢 LOW'
        };
        
        newItem.innerHTML = `
            <div class="comm-header">
                <span class="comm-priority">${priorityColors[randomMsg.priority]}</span>
                <span class="comm-source">${randomMsg.source}</span>
                <span class="comm-time">NOW</span>
            </div>
            <div class="comm-message">${randomMsg.message}</div>
        `;
        
        feed.insertBefore(newItem, feed.firstChild);
        
        if (feed.children.length > 6) {
            feed.removeChild(feed.lastChild);
        }
        
        setTimeout(() => {
            newItem.querySelectorAll('.comm-time').forEach(el => {
                const minutes = Math.floor((Date.now() - parseInt(newItem.dataset.timestamp || Date.now())) / 60000);
                el.textContent = minutes > 0 ? `${minutes}M AGO` : 'NOW';
            });
        }, 60000);
    },

    updateSystemMetrics: function() {
        const perfBars = document.querySelectorAll('.perf-item .bar-fill');
        perfBars.forEach(bar => {
            const currentWidth = parseFloat(bar.style.width);
            const change = (Math.random() - 0.5) * 5;
            const newWidth = Math.max(5, Math.min(95, currentWidth + change));
            bar.style.width = `${newWidth}%`;
            
            const valEl = bar.parentElement.parentElement.querySelector('.perf-val');
            if (valEl) {
                valEl.textContent = `${Math.floor(newWidth)}%`;
            }
        });
        
        const metricRows = document.querySelectorAll('.metric-row');
        metricRows.forEach(row => {
            const valEl = row.querySelector('.metric-val');
            if (!valEl) return;
            
            const label = row.querySelector('.metric-label').textContent;
            
            if (label === 'LATENCY') {
                const latency = Math.floor(Math.random() * 10 + 20);
                valEl.textContent = `${latency}ms`;
            } else if (label === 'PACKETS/S') {
                const packets = Math.floor(Math.random() * 200 + 1100);
                valEl.textContent = packets.toLocaleString();
            } else if (label === 'TEMP') {
                const temp = Math.floor(Math.random() * 10 + 60);
                valEl.textContent = `${temp}°C`;
                valEl.className = `metric-val ${temp > 70 ? 'warning' : ''}`;
            }
        });
    },

    startAnimations: function() {
        const self = this;
        
        setInterval(() => {
            self.pulseOnlineStatus();
        }, 3000);
        
        setInterval(() => {
            self.updateStandingTrends();
        }, 10000);
        
        setInterval(() => {
            self.updateWarFrontPercentages();
        }, 8000);
    },

    pulseOnlineStatus: function() {
        const onlineValues = document.querySelectorAll('.status-value.online');
        onlineValues.forEach(el => {
            el.style.textShadow = '0 0 20px var(--status-good)';
            setTimeout(() => {
                el.style.textShadow = '0 0 5px var(--status-good)';
            }, 500);
        });
    },

    updateStandingTrends: function() {
        const standings = document.querySelectorAll('.standing-trend');
        standings.forEach(standing => {
            const trends = ['↑', '↓', '→'];
            const values = ['+1', '-1', '0'];
            const randomIndex = Math.floor(Math.random() * 3);
            
            standing.textContent = `${trends[randomIndex]} ${values[randomIndex]}`;
            
            standing.className = 'standing-trend ' + 
                (randomIndex === 0 ? 'up' : randomIndex === 1 ? 'down' : 'stable');
        });
    },

    updateWarFrontPercentages: function() {
        const combatantBars = document.querySelectorAll('.front-combatants');
        combatantBars.forEach(front => {
            const bars = front.querySelectorAll('.bar-fill');
            const pcts = front.querySelectorAll('.combatant-pct');
            
            if (bars.length >= 2) {
                const change = (Math.random() - 0.5) * 2;
                
                let width1 = parseFloat(bars[0].style.width);
                width1 = Math.max(10, Math.min(90, width1 + change));
                bars[0].style.width = `${width1}%`;
                if (pcts[0]) pcts[0].textContent = `${Math.floor(width1)}%`;
                
                const width2 = 100 - width1;
                bars[1].style.width = `${width2}%`;
                if (pcts[1]) pcts[1].textContent = `${Math.floor(width2)}%`;
            }
        });
    },

    initMarketTicker: function() {
        const ticker = document.querySelector('.ticker-scroll');
        if (!ticker) return;
        
        const items = Array.from(ticker.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            ticker.appendChild(clone);
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    dashboard.init();
});

(function addHoverEffects() {
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.fleet-item')) {
            e.target.closest('.fleet-item').style.transform = 'scale(1.02)';
            e.target.closest('.fleet-item').style.zIndex = '10';
        }
        if (e.target.closest('.node')) {
            e.target.closest('.node').style.background = 'rgba(0, 212, 255, 0.25)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.fleet-item')) {
            e.target.closest('.fleet-item').style.transform = 'scale(1)';
            e.target.closest('.fleet-item').style.zIndex = '1';
        }
        if (e.target.closest('.node')) {
            const node = e.target.closest('.node');
            if (node.classList.contains('complete')) {
                node.style.background = 'rgba(63, 185, 80, 0.2)';
            } else if (node.classList.contains('active')) {
                node.style.background = 'rgba(0, 212, 255, 0.15)';
            } else {
                node.style.background = '';
            }
        }
    });
})();

(function addClickEffects() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.sector-cell')) {
            const cell = e.target.closest('.sector-cell');
            cell.style.animation = 'none';
            cell.offsetHeight;
            cell.style.animation = 'pulse-cell 0.3s ease-out';
        }
        
        if (e.target.closest('.alert-item')) {
            const alert = e.target.closest('.alert-item');
            alert.style.opacity = '0.5';
            setTimeout(() => {
                alert.style.opacity = '1';
            }, 200);
        }
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-cell {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); background: rgba(0, 212, 255, 0.3); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
})();