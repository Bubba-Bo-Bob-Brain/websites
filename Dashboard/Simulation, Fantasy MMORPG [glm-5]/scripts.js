document.addEventListener('DOMContentLoaded', function() {
    initializeCountdowns();
    initializeEventFeed();
    initializeMarketSimulation();
    initializeChatSimulation();
    initializeSeasonCycle();
    initializeMapInteractions();
    initializePanelTabs();
    initializeResourceTicker();
    initializeProgressBars();
    initializeWeatherEffects();
});

let countdownIntervals = [];
let eventFeedInterval;
let marketInterval;
let chatInterval;

function initializeCountdowns() {
    const countdownElements = document.querySelectorAll('.event-countdown');
    
    countdownElements.forEach((element, index) => {
        if (element.textContent === 'NOW') return;
        
        const initialTime = parseTimeToSeconds(element.textContent);
        let remainingSeconds = initialTime;
        
        const interval = setInterval(() => {
            remainingSeconds--;
            
            if (remainingSeconds <= 0) {
                element.textContent = 'NOW';
                element.classList.add('active');
                clearInterval(interval);
            } else {
                element.textContent = formatSecondsToTime(remainingSeconds);
            }
        }, 1000);
        
        countdownIntervals.push(interval);
    });
    
    const worldBossCountdown = document.querySelector('.alert-item.critical .alert-text');
    if (worldBossCountdown) {
        let bossTime = 23 * 60 + 14;
        
        setInterval(() => {
            bossTime--;
            if (bossTime <= 0) {
                worldBossCountdown.textContent = '🔥 World Boss: Vulkanos is NOW SPAWNED!';
                bossTime = 60;
            } else {
                const minutes = Math.floor(bossTime / 60);
                const seconds = bossTime % 60;
                worldBossCountdown.textContent = `🔥 World Boss: Vulkanos spawns in ${minutes}m ${seconds}s`;
            }
        }, 1000);
    }
}

function parseTimeToSeconds(timeStr) {
    const parts = timeStr.split(/[^0-9]/).filter(p => p);
    let seconds = 0;
    
    if (parts.length === 2) {
        seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
        seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    
    return seconds;
}

function formatSecondsToTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
}

function initializeEventFeed() {
    const feedContainer = document.getElementById('event-feed');
    if (!feedContainer) return;
    
    const feedMessages = [
        { icon: '⚔️', text: '<strong>Black Legion</strong> captured checkpoint Westgate' },
        { icon: '💎', text: '<strong>MysticTrader</strong> listed: Voidblade (Legendary)' },
        { icon: '🐉', text: '<strong>Ashborn</strong> failed raid on Dragonspine' },
        { icon: '💰', text: 'Market Alert: Frostcore Ingot up 45%' },
        { icon: '🏆', text: '<strong>FrostMage_Pro</strong> reached 2600 PvP Rating' },
        { icon: '🌋', text: 'Vulkanos awakening in 15 minutes!' },
        { icon: '⚔️', text: '<strong>Knights Templar</strong> defending Ironhold' },
        { icon: '🎁', text: '<strong>xXDragonSlayerXx</strong> looted: Emberheart' },
        { icon: '📢', text: 'Server maintenance scheduled: 04:00' },
        { icon: '❄️', text: 'Weather Alert: Blizzard intensifying in Frostpeak' },
        { icon: '👑', text: '<strong>NightLord</strong> crowned Champion of Arena' },
        { icon: '🔥', text: 'World Event: Demon Portal opened in Shadowmere' },
    ];
    
    let messageIndex = 0;
    
    eventFeedInterval = setInterval(() => {
        const time = new Date();
        const timeStr = time.toTimeString().slice(0, 5);
        
        const message = feedMessages[messageIndex % feedMessages.length];
        
        const newFeedItem = document.createElement('div');
        newFeedItem.className = 'feed-item';
        newFeedItem.innerHTML = `
            <span class="feed-time">${timeStr}</span>
            <span class="feed-text">${message.icon} ${message.text}</span>
        `;
        newFeedItem.style.opacity = '0';
        newFeedItem.style.transform = 'translateX(-20px)';
        
        feedContainer.insertBefore(newFeedItem, feedContainer.firstChild);
        
        requestAnimationFrame(() => {
            newFeedItem.style.transition = 'all 0.3s ease';
            newFeedItem.style.opacity = '1';
            newFeedItem.style.transform = 'translateX(0)';
        });
        
        if (feedContainer.children.length > 15) {
            feedContainer.removeChild(feedContainer.lastChild);
        }
        
        messageIndex++;
    }, 8000);
}

function initializeMarketSimulation() {
    const priceElements = document.querySelectorAll('.item-price');
    const changeElements = document.querySelectorAll('.item-change');
    
    marketInterval = setInterval(() => {
        priceElements.forEach((priceEl, index) => {
            const currentPrice = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''));
            const variance = Math.floor(currentPrice * (Math.random() * 0.04 - 0.02));
            const newPrice = currentPrice + variance;
            
            priceEl.textContent = newPrice.toLocaleString() + 'g';
            
            const changeEl = changeElements[index];
            if (changeEl) {
                const change = variance > 0 ? `+${Math.abs(Math.floor(Math.random() * 15 + 1))}%` : `-${Math.abs(Math.floor(Math.random() * 10 + 1))}%`;
                changeEl.textContent = change;
                changeEl.className = 'item-change ' + (variance >= 0 ? 'positive' : 'negative');
            }
        });
        
        updateMarketStats();
    }, 10000);
}

function updateMarketStats() {
    const statValues = document.querySelectorAll('.market-stat .stat-value');
    
    if (statValues.length >= 4) {
        const goldVolume = 847200000 + Math.floor(Math.random() * 1000000 - 500000);
        statValues[0].textContent = (goldVolume / 1000000).toFixed(1) + 'M';
        
        const itemsSold = 2400000 + Math.floor(Math.random() * 10000 - 5000);
        statValues[1].textContent = (itemsSold / 1000000).toFixed(1) + 'M';
        
        const legendaryTrades = Math.floor(Math.random() * 50 + 1200);
        statValues[2].textContent = legendaryTrades.toLocaleString();
    }
}

function initializeChatSimulation() {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;
    
    const chatMessages = [
        { type: 'normal', author: 'RaiderKing', text: 'LF3M Mythic Dungeon, need heals!' },
        { type: 'system', author: '[SYSTEM]', text: 'Territory War starting in 1 hour!' },
        { type: 'normal', author: 'GoldFarmer_', text: 'WTS Rare Materials cheap, PM me' },
        { type: 'guild', author: '[GUILD] ShadowPriest', text: 'Good raid everyone! Next one at 03:00' },
        { type: 'normal', author: 'PvP_Destroyer', text: 'Anyone want to duel? Arena 7' },
        { type: 'system', author: '[SYSTEM]', text: 'Blood Moon grants +50% Undead power!' },
        { type: 'normal', author: 'NewPlayer123', text: 'How do I get to Frostpeak?' },
        { type: 'normal', author: 'CraftMaster', text: 'Crafting Legendary daggers, PM offers' },
        { type: 'guild', author: '[GUILD] HealerQueen', text: 'Need potions for raid, check guild bank' },
        { type: 'system', author: '[SYSTEM]', text: 'Vulkanos spawns in 15 minutes!' },
        { type: 'normal', author: 'LootGoblin', text: 'Just got a Legendary drop! 🎉' },
        { type: 'normal', author: 'TankBro', text: 'LFG any dungeon, iLvl 485' },
    ];
    
    let messageIndex = 0;
    
    chatInterval = setInterval(() => {
        const time = new Date();
        const timeStr = time.toTimeString().slice(0, 5);
        
        const message = chatMessages[messageIndex % chatMessages.length];
        
        const chatMsg = document.createElement('div');
        chatMsg.className = `chat-msg ${message.type}`;
        chatMsg.innerHTML = `
            <span class="msg-time">${timeStr}</span>
            <span class="msg-author">${message.author}:</span>
            <span class="msg-text">${message.text}</span>
        `;
        
        chatContainer.appendChild(chatMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        if (chatContainer.children.length > 12) {
            chatContainer.removeChild(chatContainer.firstChild);
        }
        
        messageIndex++;
    }, 5000);
}

function initializeSeasonCycle() {
    const seasonProgress = document.querySelector('.season-day');
    if (!seasonProgress) return;
    
    let currentDay = 14;
    
    setInterval(() => {
        currentDay = (currentDay % 28) + 1;
        
        const progressText = `Day ${currentDay}/28`;
        seasonProgress.textContent = progressText;
        
        if (currentDay === 1) {
            showSeasonTransition();
        }
    }, 60000);
}

function showSeasonTransition() {
    const seasonName = document.querySelector('.season-name');
    const currentSeason = document.querySelector('.current-season');
    
    if (seasonName && currentSeason) {
        seasonName.style.color = '#ffd700';
        seasonName.textContent = 'New Season Beginning!';
        
        setTimeout(() => {
            seasonName.style.color = '';
            seasonName.textContent = 'Deep Winter';
        }, 3000);
    }
}

function initializeMapInteractions() {
    const regions = document.querySelectorAll('.map-region');
    
    regions.forEach(region => {
        region.addEventListener('click', function() {
            const regionName = this.querySelector('.region-name').textContent;
            const controller = this.querySelector('.region-controller').textContent;
            const stability = this.querySelector('.region-stability').textContent;
            
            showRegionPopup(regionName, controller, stability);
        });
        
        region.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
        });
        
        region.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
        });
    });
}

function showRegionPopup(name, controller, stability) {
    const existingPopup = document.querySelector('.region-popup');
    if (existingPopup) existingPopup.remove();
    
    const popup = document.createElement('div');
    popup.className = 'region-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1a1a24 0%, #12121a 100%);
        border: 2px solid #ffd700;
        border-radius: 8px;
        padding: 20px;
        z-index: 1000;
        min-width: 250px;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
    `;
    
    popup.innerHTML = `
        <h3 style="font-family: 'Cinzel', serif; color: #ffd700; margin-bottom: 12px;">🗺️ ${name}</h3>
        <p style="color: #a8a8b8; margin-bottom: 8px;">Controller: <strong style="color: #e8e8f0;">${controller}</strong></p>
        <p style="color: #a8a8b8; margin-bottom: 12px;">Stability: <strong style="color: #22c55e;">${stability}</strong></p>
        <button onclick="this.parentElement.remove()" style="
            background: #c41e3a;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            width: 100%;
            font-family: 'Philosopher', sans-serif;
        ">Close</button>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentElement) {
            popup.addEventListener('click', function(e) {
                if (e.target === popup) popup.remove();
            });
        }
    }, 100);
}

function initializePanelTabs() {
    const tabGroups = document.querySelectorAll('.panel-tabs, .panel-controls');
    
    tabGroups.forEach(group => {
        const buttons = group.querySelectorAll('.tab-btn, .panel-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
    
    const chatTabs = document.querySelectorAll('.chat-tab');
    chatTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            chatTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const rangeButtons = document.querySelectorAll('.range-btn');
    rangeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            rangeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function initializeResourceTicker() {
    const tickerValues = document.querySelectorAll('.ticker-value');
    
    setInterval(() => {
        tickerValues.forEach((value, index) => {
            const currentText = value.textContent;
            const numericMatch = currentText.match(/[\d,]+/);
            
            if (numericMatch) {
                const currentValue = parseInt(numericMatch[0].replace(/,/g, ''));
                
                if (index === 0) {
                    const change = Math.floor(Math.random() * 100) - 30;
                    value.textContent = (currentValue + change).toLocaleString();
                } else if (index === 1) {
                    const change = Math.floor(Math.random() * 5) - 2;
                    value.textContent = currentValue + change;
                } else if (index === 2) {
                    if (currentValue < 100) {
                        value.textContent = `${currentValue + 1}/100`;
                    }
                }
            }
        });
    }, 3000);
}

function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const currentWidth = parseFloat(bar.style.width);
        const parent = bar.closest('.dungeon-progress-bar, .queue-progress, .discovery-bar');
        
        if (parent && currentWidth < 100) {
            setInterval(() => {
                let width = parseFloat(bar.style.width);
                if (width < 100) {
                    width += Math.random() * 0.5;
                    bar.style.width = Math.min(width, 100) + '%';
                    
                    const progressText = parent.querySelector('.progress-text');
                    if (progressText) {
                        progressText.textContent = Math.floor(width) + '% Cleared';
                    }
                }
            }, 5000);
        }
    });
    
    const xpFill = document.querySelector('.xp-fill');
    if (xpFill) {
        let currentXp = 47;
        
        setInterval(() => {
            currentXp += Math.random() * 2;
            if (currentXp > 100) currentXp = 0;
            xpFill.style.width = currentXp + '%';
            
            const xpInfo = document.querySelector('.xp-info span:last-child');
            if (xpInfo) {
                const xpValue = Math.floor(currentXp * 50);
                xpInfo.textContent = `${xpValue.toLocaleString()}/5,000 XP`;
            }
        }, 8000);
    }
}

function initializeWeatherEffects() {
    const weatherIcon = document.querySelector('.weather-big-icon');
    const weatherName = document.querySelector('.weather-name');
    const weatherTemp = document.querySelector('.weather-temp');
    
    const weatherStates = [
        { icon: '⛈️', name: 'Blizzard', temp: -12 },
        { icon: '🌨️', name: 'Heavy Snow', temp: -8 },
        { icon: '☁️', name: 'Overcast', temp: -4 },
        { icon: '⛅', name: 'Partly Cloudy', temp: 0 },
        { icon: '🌤️', name: 'Clear', temp: 3 },
    ];
    
    let weatherIndex = 0;
    
    setInterval(() => {
        weatherIndex = (weatherIndex + 1) % weatherStates.length;
        const weather = weatherStates[weatherIndex];
        
        if (weatherIcon) {
            weatherIcon.style.transform = 'scale(0)';
            setTimeout(() => {
                weatherIcon.textContent = weather.icon;
                weatherIcon.style.transform = 'scale(1)';
            }, 300);
        }
        
        if (weatherName) {
            weatherName.textContent = weather.name;
        }
        
        if (weatherTemp) {
            weatherTemp.textContent = weather.temp + '°C';
        }
        
        updateForecast();
    }, 120000);
}

function updateForecast() {
    const forecastDays = document.querySelectorAll('.forecast-day:not(.today)');
    
    forecastDays.forEach(day => {
        const tempEl = day.querySelector('.day-temp');
        const iconEl = day.querySelector('.day-icon');
        
        if (tempEl && iconEl) {
            const currentTemp = parseInt(tempEl.textContent);
            const newTemp = currentTemp + Math.floor(Math.random() * 5 - 2);
            tempEl.textContent = (newTemp >= 0 ? '+' : '') + newTemp + '°';
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const popup = document.querySelector('.region-popup');
        if (popup) popup.remove();
    }
});

function updateGameTime() {
    const timeValue = document.querySelector('.time-value');
    if (!timeValue) return;
    
    let hours = 23;
    let minutes = 47;
    
    setInterval(() => {
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
            if (hours >= 24) hours = 0;
        }
        
        timeValue.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        if (hours >= 20 || hours < 5) {
            const phase = document.querySelector('.time-phase');
            if (phase) {
                if (hours >= 22 || hours < 2) {
                    phase.textContent = 'Blood Moon';
                } else {
                    phase.textContent = 'Night';
                }
            }
        }
    }, 10000);
}

updateGameTime();

function simulateGuildPowerShift() {
    const rankTrends = document.querySelectorAll('.rank-trend');
    
    setInterval(() => {
        rankTrends.forEach(trend => {
            const changes = ['▲ +1', '▲ +2', '▼ -1', '▼ -2', '— 0'];
            const weights = [0.2, 0.1, 0.2, 0.1, 0.4];
            
            const random = Math.random();
            let cumulative = 0;
            
            for (let i = 0; i < changes.length; i++) {
                cumulative += weights[i];
                if (random < cumulative) {
                    trend.textContent = changes[i];
                    trend.style.color = changes[i].startsWith('▲') ? '#22c55e' : 
                                       changes[i].startsWith('▼') ? '#c41e3a' : '#a8a8b8';
                    break;
                }
            }
        });
    }, 15000);
}

simulateGuildPowerShift();

const style = document.createElement('style');
style.textContent = `
    .region-popup {
        animation: popupFadeIn 0.3s ease;
    }
    
    @keyframes popupFadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    .chat-msg {
        animation: chatSlide 0.3s ease;
    }
    
    @keyframes chatSlide {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .weather-big-icon {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);

console.log('🎮 Aethermoor World Command Dashboard Initialized');
console.log('📊 Real-time updates active');
console.log('🗺️ Map interactions enabled');
console.log('💬 Chat simulation running');