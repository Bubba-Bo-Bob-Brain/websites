/**
 * AETHERIA CHRONICLES - World Dashboard
 * Real-time Dynamic Updates & Interactive Features
 */
(function() {
    'use strict';

    var CONFIG = {
        updateInterval: 1000,
        eventUpdateInterval: 5000,
        priceUpdateInterval: 10000,
        bossSpawnTimes: [
            { name: 'Zarathos the Undying', spawnTime: 2843 },
            { name: 'Lady Shadowmere', spawnTime: 8072 },
            { name: 'Queen Arachnida', spawnTime: 16337 },
            { name: 'Fenris the Howler', spawnTime: 31675 },
            { name: 'Infernox', spawnTime: 0, defeated: true }
        ],
        worldEvents: [
            { icon: '👹', text: 'World Boss {boss} is spawning soon!', urgent: true },
            { icon: '🏰', text: '{faction} has captured {location}!' },
            { icon: '🐲', text: 'Guild {guild} completed {dungeon}!' },
            { icon: '💰', text: 'Player {player} found {item} worth {value} gold!' },
            { icon: '⚔️', text: '{player} achieved {title}!' },
            { icon: '🌧️', text: 'Weather changed to {weather}!' },
            { icon: '🏆', text: '{event} has begun!' },
            { icon: '📦', text: 'Server milestone: {milestone}!' },
            { icon: '🔮', text: '{event} starting soon!' },
            { icon: '🎉', text: 'Player {player} unlocked {title}!' }
        ],
        factions: ['Silver Kingdom', 'Golden Empire', 'Emerald Clan', 'Crimson Empire', 'Violet Kingdom', 'Azure Confederacy', 'Obsidian Alliance', 'Iron Republic'],
        locations: ['Storm Pass', 'Dragon Peak', 'Shadow Valley', 'Frost Hold', 'Sunken Temple', 'Ancient Ruins', 'Crystal Cave'],
        dungeons: ['Abyssal Citadel', 'Molten Core', 'Emerald Nightmare', 'Frozen Throne', 'Shadow Realm'],
        guilds: ['Lions Rampart', 'Moonweavers', 'Stormborn', 'Iron Vanguard', 'Dragonheart'],
        players: ['Shadowblade99', 'DragonSlayer', 'PhoenixFire', 'IceQueen', 'TreasureHunter', 'MasterChef', 'WarlordX', 'MysticMage'],
        items: ['Legendary Chest', 'Ancient Artifact', 'Dragon Egg', 'Phoenix Feather', 'Void Crystal', 'Unicorn Horn'],
        titles: ['Arena Grandmaster', 'Dungeon Champion', 'Guild Leader', 'Legendary Crafter', 'Master Trader'],
        weather: ['Gentle Rain', 'Clear Skies', 'Heavy Storm', 'Snow', 'Fog', 'Sunny', 'Windy'],
        events: ['Weekly Tournament', 'Void Rift', 'Dragon Festival', 'Harvest Moon', 'Arena Finals'],
        milestones: ['100M gold traded', '1M players online', '10M quests completed', '5M dungeons cleared'],
        baseCommodityPrices: [4892, 2341, 1892, 987, 3450, 567]
    };

    var state = {
        inGameTime: { year: 847, season: 'Spring', day: 47, hour: 14, minute: 32, second: 17 },
        bossTimers: JSON.parse(JSON.stringify(CONFIG.bossSpawnTimes)),
        eventFeed: [],
        commodityPrices: CONFIG.baseCommodityPrices.slice(),
        playerStats: { hp: 12450, maxHp: 16000, mp: 8280, maxMp: 9000, exp: 4520000, maxExp: 7000000, dps: 4892, armor: 1247 },
        serverStats: { globalPlayers: 847234, activeGuilds: 2847, activeBosses: 5, latency: 23 },
        craftingQueue: [
            { name: 'Legendary Sword', progress: 67, totalTime: 7200 },
            { name: 'Health Potions x100', progress: 89, totalTime: 900 },
            { name: 'Spell Scrolls x50', progress: 34, totalTime: 10800 }
        ],
        pvpStats: { rating: 2847, wins: 247, losses: 189, streak: 7 }
    };

    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    function formatNumber(num) {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    function formatFullTime(seconds) {
        var hrs = Math.floor(seconds / 3600);
        var mins = Math.floor((seconds % 3600) / 60);
        var secs = seconds % 60;
        return hrs + ':' + padZero(mins) + ':' + padZero(secs);
    }

    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateGameTime() {
        state.inGameTime.second++;
        if (state.inGameTime.second >= 60) {
            state.inGameTime.second = 0;
            state.inGameTime.minute++;
        }
        if (state.inGameTime.minute >= 60) {
            state.inGameTime.minute = 0;
            state.inGameTime.hour++;
        }
        if (state.inGameTime.hour >= 24) {
            state.inGameTime.hour = 0;
            state.inGameTime.day++;
        }
        if (state.inGameTime.day > 30) {
            state.inGameTime.day = 1;
            var seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
            var currentSeasonIndex = seasons.indexOf(state.inGameTime.season);
            state.inGameTime.season = seasons[(currentSeasonIndex + 1) % 4];
        }
        if (state.inGameTime.day > 365) {
            state.inGameTime.day = 1;
            state.inGameTime.year++;
        }
        updateTimeDisplay();
    }

    function updateTimeDisplay() {
        var timeValue = document.querySelector('.time-value');
        var timeClock = document.querySelector('.time-clock');
        if (timeValue) {
            timeValue.textContent = 'Year ' + state.inGameTime.year + ', ' + state.inGameTime.season + ', Day ' + state.inGameTime.day;
        }
        if (timeClock) {
            timeClock.textContent = '🕐 ' + padZero(state.inGameTime.hour) + ':' + padZero(state.inGameTime.minute) + ':' + padZero(state.inGameTime.second);
        }
    }

    function updateBossTimers() {
        state.bossTimers.forEach(function(boss, index) {
            if (!boss.defeated) {
                boss.spawnTime--;
                if (boss.spawnTime <= 0) {
                    boss.spawnTime = 0;
                    addWorldEvent({ icon: '👹', text: 'World Boss ' + boss.name + ' has spawned!', urgent: true });
                    boss.spawnTime = randomInt(7200, 14400);
                }
            }
        });
        updateBossDisplay();
    }

    function updateBossDisplay() {
        var bossCards = document.querySelectorAll('.boss-card');
        bossCards.forEach(function(card, index) {
            var timerEl = card.querySelector('.boss-timer');
            if (timerEl && state.bossTimers[index]) {
                var boss = state.bossTimers[index];
                if (boss.defeated) {
                    timerEl.textContent = 'DEFEATED';
                    timerEl.classList.add('defeated-text');
                } else {
                    timerEl.textContent = formatFullTime(boss.spawnTime);
                    timerEl.classList.remove('defeated-text');
                }
            }
        });
        var nextBoss = state.bossTimers.find(function(b) { return !b.defeated; });
        var badge = document.querySelector('.world-bosses .panel-badge');
        if (badge && nextBoss) {
            var minutes = Math.ceil(nextBoss.spawnTime / 60);
            badge.textContent = 'Next: ' + minutes + 'm';
        }
    }

    function updatePlayerStats() {
        state.playerStats.hp = Math.min(state.playerStats.maxHp, state.playerStats.hp + randomInt(5, 15));
        state.playerStats.mp = Math.min(state.playerStats.maxMp, state.playerStats.mp + randomInt(8, 20));
        if (Math.random() < 0.3) {
            state.playerStats.exp = Math.min(state.playerStats.maxExp, state.playerStats.exp + randomInt(100, 500));
        }
        var hpBar = document.querySelector('.stat-fill.hp');
        var mpBar = document.querySelector('.stat-fill.mp');
        var expBar = document.querySelector('.stat-fill.exp');
        if (hpBar) {
            hpBar.style.width = ((state.playerStats.hp / state.playerStats.maxHp) * 100) + '%';
        }
        var hpValue = document.querySelector('.stat-box:first-child .stat-value');
        if (hpValue) {
            hpValue.textContent = formatNumber(state.playerStats.hp) + '/' + formatNumber(state.playerStats.maxHp);
        }
        if (mpBar) {
            mpBar.style.width = ((state.playerStats.mp / state.playerStats.maxMp) * 100) + '%';
        }
        var mpValue = document.querySelector('.stat-box:nth-child(2) .stat-value');
        if (mpValue) {
            mpValue.textContent = formatNumber(state.playerStats.mp) + '/' + formatNumber(state.playerStats.maxMp);
        }
        if (expBar) {
            expBar.style.width = ((state.playerStats.exp / state.playerStats.maxExp) * 100) + '%';
        }
        var expValue = document.querySelector('.stat-box:nth-child(3) .stat-value');
        if (expValue) {
            expValue.textContent = formatNumber(state.playerStats.exp) + '/' + formatNumber(state.playerStats.maxExp);
        }
    }

    function updateCraftingQueue() {
        state.craftingQueue.forEach(function(craft, index) {
            if (craft.progress < 100) {
                craft.progress = Math.min(100, craft.progress + Math.random() * 2);
            }
        });
        updateCraftingDisplay();
    }

    function updateCraftingDisplay() {
        var craftItems = document.querySelectorAll('.craft-item');
        craftItems.forEach(function(item, index) {
            var craft = state.craftingQueue[index];
            if (!craft) return;
            var fillBar = item.querySelector('.craft-fill');
            var timerEl = item.querySelector('.craft-timer');
            if (fillBar) {
                fillBar.style.width = craft.progress + '%';
            }
            if (timerEl) {
                var remainingSeconds = Math.floor((100 - craft.progress) / 100 * craft.totalTime);
                timerEl.textContent = formatFullTime(remainingSeconds);
            }
        });
    }

    function updateMarketPrices() {
        var prices = document.querySelectorAll('.comm-price');
        prices.forEach(function(priceEl, index) {
            if (index >= state.commodityPrices.length) return;
            var change = (Math.random() - 0.5) * 0.1;
            state.commodityPrices[index] = Math.max(100, Math.floor(state.commodityPrices[index] * (1 + change)));
            var arrow = state.commodityPrices[index] > CONFIG.baseCommodityPrices[index] ? '↗' : state.commodityPrices[index] < CONFIG.baseCommodityPrices[index] ? '↙' : '➡';
            var priceClass = state.commodityPrices[index] > CONFIG.baseCommodityPrices[index] ? 'up' : state.commodityPrices[index] < CONFIG.baseCommodityPrices[index] ? 'down' : 'stable';
            priceEl.textContent = formatNumber(state.commodityPrices[index]) + 'g ' + arrow;
            priceEl.className = 'comm-price ' + priceClass;
        });
    }

    function generateRandomEvent() {
        var eventTemplate = randomChoice(CONFIG.worldEvents);
        var text = eventTemplate.text;
        text = text.replace('{boss}', randomChoice(state.bossTimers.map(function(b) { return b.name; })));
        text = text.replace('{faction}', randomChoice(CONFIG.factions));
        text = text.replace('{location}', randomChoice(CONFIG.locations));
        text = text.replace('{dungeon}', randomChoice(CONFIG.dungeons));
        text = text.replace('{guild}', randomChoice(CONFIG.guilds));
        text = text.replace('{player}', randomChoice(CONFIG.players));
        text = text.replace('{item}', randomChoice(CONFIG.items));
        text = text.replace('{value}', formatNumber(randomInt(10000, 5000000)));
        text = text.replace('{title}', randomChoice(CONFIG.titles));
        text = text.replace('{weather}', randomChoice(CONFIG.weather));
        text = text.replace('{event}', randomChoice(CONFIG.events));
        text = text.replace('{milestone}', randomChoice(CONFIG.milestones));
        return {
            icon: eventTemplate.icon,
            text: text,
            urgent: eventTemplate.urgent || false,
            time: padZero(state.inGameTime.hour) + ':' + padZero(state.inGameTime.minute) + ':' + padZero(state.inGameTime.second)
        };
    }

    function addWorldEvent(event) {
        state.eventFeed.unshift(event);
        if (state.eventFeed.length > 20) {
            state.eventFeed.pop();
        }
        updateEventFeedDisplay();
    }

    function updateEventFeedDisplay() {
        var eventsList = document.querySelector('.events-list');
        if (!eventsList) return;
        var html = '';
        state.eventFeed.forEach(function(event) {
            var urgentClass = event.urgent ? 'urgent' : '';
            html = html + '<div class="event-item ' + urgentClass + '">';
            html = html + '<span class="event-time">' + event.time + '</span>';
            html = html + '<span class="event-icon">' + event.icon + '</span>';
            html = html + '<span class="event-text">' + event.text + '</span>';
            html = html + '</div>';
        });
        eventsList.innerHTML = html;
    }

    function updateServerStats() {
        state.serverStats.globalPlayers += randomInt(-50, 100);
        state.serverStats.globalPlayers = Math.max(800000, state.serverStats.globalPlayers);
        state.serverStats.latency = Math.max(10, state.serverStats.latency + randomInt(-5, 5));
        var globalPlayers = document.querySelector('.footer-left span:first-child strong');
        if (globalPlayers) {
            globalPlayers.textContent = formatNumber(state.serverStats.globalPlayers);
        }
        var latencyEl = document.querySelector('.server-status .panel-footer span:last-child strong');
        if (latencyEl) {
            latencyEl.textContent = state.serverStats.latency + 'ms';
        }
        var footerUpdate = document.querySelector('.footer-right span:first-child strong');
        if (footerUpdate) {
            footerUpdate.textContent = padZero(state.inGameTime.hour) + ':' + padZero(state.inGameTime.minute) + ':' + padZero(state.inGameTime.second) + '.' + Math.floor(Math.random() * 1000);
        }
    }

    function updatePvPStats() {
        if (Math.random() < 0.1) {
            if (Math.random() > 0.4) {
                state.pvpStats.wins++;
                state.pvpStats.rating += randomInt(5, 15);
                state.pvpStats.streak++;
            } else {
                state.pvpStats.losses++;
                state.pvpStats.rating = Math.max(1000, state.pvpStats.rating - randomInt(5, 15));
                state.pvpStats.streak = -Math.abs(state.pvpStats.streak);
            }
        }
        var ratingEl = document.querySelector('.pvp-value.diamond');
        if (ratingEl) {
            ratingEl.textContent = '💎 ' + state.pvpStats.rating;
        }
        var winLossEl = document.querySelector('.pvp-stat:nth-child(2) .pvp-value');
        if (winLossEl) {
            winLossEl.textContent = state.pvpStats.wins + '/' + state.pvpStats.losses;
        }
        var winPercentEl = document.querySelector('.pvp-stat:nth-child(3) .pvp-value');
        if (winPercentEl) {
            var winPercent = ((state.pvpStats.wins / (state.pvpStats.wins + state.pvpStats.losses)) * 100).toFixed(1);
            winPercentEl.textContent = winPercent + '%';
        }
        var streakEl = document.querySelector('.pvp-value.win-streak');
        if (streakEl) {
            if (state.pvpStats.streak > 0) {
                streakEl.textContent = '🔥 ' + Math.abs(state.pvpStats.streak);
                streakEl.className = 'pvp-value win-streak';
            } else {
                streakEl.textContent = '❄️ ' + Math.abs(state.pvpStats.streak);
                streakEl.className = 'pvp-value lose-streak';
            }
        }
    }

    function updateRaidProgress() {
        var raidCards = document.querySelectorAll('.raid-card');
        raidCards.forEach(function(card, index) {
            var progressBar = card.querySelector('.progress-fill');
            if (progressBar) {
                var currentWidth = parseFloat(progressBar.style.width) || 0;
                var newWidth = Math.min(100, currentWidth + Math.random() * 0.5);
                progressBar.style.width = newWidth + '%';
            }
        });
    }

    function updateResourceProduction() {
        var resourceItems = document.querySelectorAll('.resource-item');
        var baseRates = [12847, 8234, 5612, 892, 45234, 18456, 3247, 7891];
        resourceItems.forEach(function(item, index) {
            var rateEl = item.querySelector('.resource-rate');
            if (rateEl) {
                var change = (Math.random() - 0.5) * 0.1;
                var newRate = Math.floor(baseRates[index] * (1 + change));
                var arrow = newRate > baseRates[index] ? '+' : '-';
                var rateClass = newRate > baseRates[index] ? 'up' : newRate < baseRates[index] ? 'down' : 'stable';
                rateEl.textContent = arrow + formatNumber(newRate);
                rateEl.className = 'resource-rate ' + rateClass;
            }
        });
    }

    function initTerritoryMap() {
        var territories = document.querySelectorAll('.territory');
        territories.forEach(function(territory) {
            territory.addEventListener('mouseenter', function() {
                this.style.filter = 'brightness(1.5)';
                this.style.strokeWidth = '3';
            });
            territory.addEventListener('mouseleave', function() {
                this.style.filter = '';
                this.style.strokeWidth = '2';
            });
            territory.addEventListener('click', function() {
                var factionName = this.classList[1].replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
                alert('Faction: ' + factionName + '\nTerritory Info:\n- Population: ' + formatNumber(randomInt(50000, 500000)) + '\n- Resources: ' + formatNumber(randomInt(100000, 10000000)) + 'g\n- Military Power: ' + formatNumber(randomInt(10000, 1000000)));
            });
        });
    }

    function initEquipmentTooltips() {
        var equipSlots = document.querySelectorAll('.equip-slot');
        var itemData = [
            { icon: '🪄', name: 'Staff of the Archmage', stats: 'Magic +247, INT +89, +15% Spell Damage' },
            { icon: '👘', name: 'Mystic Robes', stats: 'Armor +156, MP +500, +10% Magic Resistance' },
            { icon: '💍', name: 'Ring of Power', stats: 'All Stats +45, +5% Critical Strike' },
            { icon: '📿', name: 'Amulet of Wisdom', stats: 'INT +78, XP +25%, -10% Cooldown' },
            { icon: '👢', name: 'Boots of Swiftness', stats: 'AGI +56, +20% Movement Speed' }
        ];
        equipSlots.forEach(function(slot, index) {
            slot.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            slot.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            slot.addEventListener('click', function() {
                var item = itemData[index];
                if (item) {
                    alert(item.icon + ' ' + item.name + '\n\n' + item.stats + '\n\nRarity: Legendary ⭐⭐⭐⭐⭐');
                }
            });
        });
    }

    function initPvPModeSelector() {
        var modes = document.querySelectorAll('.mode');
        modes.forEach(function(mode) {
            mode.addEventListener('click', function() {
                modes.forEach(function(m) { m.classList.remove('active'); });
                this.classList.add('active');
            });
        });
    }

    function initQuestInteractions() {
        var questItems = document.querySelectorAll('.quest-item');
        questItems.forEach(function(quest) {
            quest.addEventListener('click', function() {
                var questName = this.querySelector('.quest-name').textContent;
                var reward = this.querySelector('.quest-reward').textContent;
                var objectives = Array.from(this.querySelectorAll('.objective')).map(function(o) { return o.textContent; });
                alert('📜 ' + questName + '\n\n' + objectives.join('\n') + '\n\nReward: ' + reward);
            });
        });
    }

    function initAchievementAnimations() {
        var achievementCards = document.querySelectorAll('.achievement-card:not(.completed)');
        achievementCards.forEach(function(card) {
            var progressEl = card.querySelector('.ach-progress');
            var barEl = card.querySelector('.ach-fill');
            if (progressEl && barEl) {
                var currentProgress = 0;
                var targetProgress = parseInt(progressEl.textContent);
                var animate = function() {
                    if (currentProgress < targetProgress) {
                        currentProgress += 1;
                        progressEl.textContent = currentProgress + '%';
                        if (barEl) barEl.style.width = currentProgress + '%';
                        requestAnimationFrame(animate);
                    }
                };
                setTimeout(animate, Math.random() * 1000);
            }
        });
    }

    function initServerLoadAnimation() {
        var serverLoads = document.querySelectorAll('.server-load');
        var loads = ['87%', '62%', '91%', '34%', '98%', '28%'];
        var classes = ['high', 'medium', 'high', 'low', 'critical', 'low'];
        serverLoads.forEach(function(load, index) {
            setTimeout(function() {
                load.textContent = '🟠 ' + loads[index];
                load.className = 'server-load ' + classes[index];
            }, index * 200);
        });
    }

    var eventTickCounter = 0;
    function tickEventGenerator() {
        eventTickCounter++;
        if (eventTickCounter >= randomInt(15, 30)) {
            eventTickCounter = 0;
            addWorldEvent(generateRandomEvent());
        }
    }

    function init() {
        console.log('⚔️ Aetheria Chronicles Dashboard Initialized');
        updateTimeDisplay();
        updateBossDisplay();
        updateCraftingDisplay();
        updateEventFeedDisplay();
        initTerritoryMap();
        initEquipmentTooltips();
        initPvPModeSelector();
        initQuestInteractions();
        initAchievementAnimations();
        initServerLoadAnimation();
        setInterval(updateGameTime, 1000);
        setInterval(updateBossTimers, 1000);
        setInterval(updatePlayerStats, 2000);
        setInterval(updateCraftingQueue, 2000);
        setInterval(updateServerStats, 3000);
        setInterval(updatePvPStats, 5000);
        setInterval(updateRaidProgress, 5000);
        setInterval(updateResourceProduction, 8000);
        setInterval(tickEventGenerator, 1000);
        setInterval(updateMarketPrices, CONFIG.priceUpdateInterval);
        setTimeout(function() {
            for (var i = 0; i < 5; i++) {
                addWorldEvent(generateRandomEvent());
            }
        }, 500);
        console.log('✅ All systems operational');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();