(function () {
    'use strict';

    /* ═══════════ SERVER CLOCK ═══════════ */
    var serverTimeEl = document.getElementById('server-time');
    var dayCountEl = document.getElementById('day-count');
    var serverSeconds = 14 * 3600 + 32 * 7;
    var currentDay = 847;

    function updateClock() {
        serverSeconds++;
        var h = Math.floor(serverSeconds / 3600) % 24;
        var m = Math.floor((serverSeconds % 3600) / 60);
        var s = serverSeconds % 60;
        serverTimeEl.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        dayCountEl.textContent = currentDay + Math.floor(serverSeconds / 86400);
    }
    setInterval(updateClock, 1000);

    /* ═══════════ PING SIMULATION ═══════════ */
    var pingEl = document.getElementById('ping-val');
    function updatePing() {
        var base = 23;
        var variance = Math.floor(Math.random() * 8) - 3;
        pingEl.textContent = base + variance;
    }
    setInterval(updatePing, 3000);

    /* ═══════════ ONLINE COUNT ═══════════ */
    var onlineEl = document.getElementById('online-count');
    var onlineCount = 47832;
    function updateOnline() {
        onlineCount += Math.floor(Math.random() * 21) - 10;
        if (onlineCount > 50000) onlineCount = 50000;
        if (onlineCount < 45000) onlineCount = 45000;
        onlineEl.textContent = onlineCount.toLocaleString();
    }
    setInterval(updateOnline, 5000);

    /* ═══════════ TICKER PAUSE ═══════════ */
    var tickerPauseBtn = document.getElementById('ticker-pause');
    var tickerContent = document.getElementById('ticker-content');
    var tickerPaused = false;

    tickerPauseBtn.addEventListener('click', function () {
        tickerPaused = !tickerPaused;
        tickerContent.style.animationPlayState = tickerPaused ? 'paused' : 'running';
        tickerPauseBtn.textContent = tickerPaused ? '▶' : '⏸';
    });

    /* ═══════════ TAB SWITCHING ═══════════ */
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetTab = this.getAttribute('data-tab');
            tabBtns.forEach(function (b) { b.classList.remove('active'); });
            tabContents.forEach(function (c) { c.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById('tab-' + targetTab).classList.add('active');
        });
    });

    /* ═══════════ MAP TOOLTIP ═══════════ */
    var mapTooltip = document.getElementById('map-tooltip');
    var worldMap = document.getElementById('world-map');

    worldMap.addEventListener('mouseover', function (e) {
        var target = e.target;
        if (target.classList.contains('zone')) {
            var name = target.getAttribute('data-name');
            var controllers = target.getAttribute('data-controllers');
            var threat = target.getAttribute('data-threat');
            mapTooltip.innerHTML = '<strong>' + name + '</strong><br>Control: ' + controllers + '<br>Threat: ' + threat.toUpperCase();
            mapTooltip.style.display = 'block';
        } else if (target.classList.contains('marker')) {
            var mName = target.getAttribute('data-name');
            var diff = target.getAttribute('data-difficulty') || 'World Boss';
            mapTooltip.innerHTML = '<strong>' + mName + '</strong><br>' + diff;
            mapTooltip.style.display = 'block';
        }
    });

    worldMap.addEventListener('mousemove', function (e) {
        var rect = worldMap.getBoundingClientRect();
        mapTooltip.style.left = (e.clientX - rect.left + 12) + 'px';
        mapTooltip.style.top = (e.clientY - rect.top - 10) + 'px';
    });

    worldMap.addEventListener('mouseout', function () {
        mapTooltip.style.display = 'none';
    });

    /* ═══════════ MAP LAYER BUTTONS ═══════════ */
    var layerBtns = document.querySelectorAll('.btn-mini[data-layer]');
    layerBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            layerBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
        });
    });

    /* ═══════════ COMBAT LOG STREAMING ═══════════ */
    var combatLog = document.getElementById('combat-log');

    var combatEvents = [
        { type: 'damage', text: '🧙 Archon_Maltheus casts Frostbolt \u2192 Shadow Titan Vorath for ', val: '48,921', suffix: ' (CRIT)', cls: 'dmg-crit' },
        { type: 'heal', text: '💚 HealzPlz casts Greater Heal \u2192 Archon_Maltheus for ', val: '32,445', suffix: '', cls: 'heal-val' },
        { type: 'damage', text: '🗡️ xBladeRunnerx casts Shadowstrike \u2192 Shadow Titan Vorath for ', val: '67,234', suffix: ' (CRIT)', cls: 'dmg-crit' },
        { type: 'damage', text: '🧙 Archon_Maltheus casts Arcane Barrage \u2192 Shadow Titan Vorath for ', val: '22,134', suffix: '', cls: 'dmg-val' },
        { type: 'buff', text: '✨ Archon_Maltheus activates Arcane Power (+30% damage)', val: '', suffix: '', cls: '' },
        { type: 'heal', text: '💚 LightBringr casts Renew \u2192 ShieldOfDawn for ', val: '8,445', suffix: '/tick', cls: 'heal-val' },
        { type: 'damage', text: '🛡️ ShieldOfDawn casts Shield Slam \u2192 Shadow Titan Vorath for ', val: '12,891', suffix: '', cls: 'dmg-val' },
        { type: 'damage', text: '🧙 Archon_Maltheus casts Ice Lance \u2192 Shadow Titan Vorath for ', val: '89,445', suffix: ' (CRIT!)', cls: 'dmg-crit' },
        { type: 'death', text: '💀 Shadow Titan Vorath slays 🗡️ Vex_Shadow (Melee Slam)', val: '', suffix: '', cls: '' },
        { type: 'heal', text: '💚 HealzPlz casts Flash Heal \u2192 Vex_Shadow for ', val: '45,221', suffix: '', cls: 'heal-val' },
        { type: 'damage', text: '🗡️ xBladeRunnerx casts Eviscerate \u2192 Shadow Titan Vorath for ', val: '34,567', suffix: '', cls: 'dmg-val' },
        { type: 'buff', text: '✨ xBladeRunnerx activates Shadow Dance (+50% attack speed)', val: '', suffix: '', cls: '' },
        { type: 'damage', text: '🧙 Archon_Maltheus casts Blizzard \u2192 Shadow Titan Vorath for ', val: '15,223', suffix: ' (AOE)', cls: 'dmg-val' },
        { type: 'heal', text: '💚 CrystalMage casts Power Word: Shield \u2192 Ironclad_Thor for ', val: '28,990', suffix: '', cls: 'heal-val' },
        { type: 'damage', text: '🛡️ Ironclad_Thor casts Thunder Clap \u2192 Shadow Titan Vorath for ', val: '9,845', suffix: '', cls: 'dmg-val' },
        { type: 'death', text: '💀 Shadow Titan Vorath slays \u2694\uFE0F Ironclad_Thor (Crushing Blow)', val: '', suffix: '', cls: '' },
        { type: 'damage', text: '🧙 Archon_Maltheus casts Pyroblast \u2192 Shadow Titan Vorath for ', val: '112,847', suffix: ' (CRIT!!!)', cls: 'dmg-crit' },
        { type: 'buff', text: '✨ HealzPlz activates Divine Hymn (raid-wide heal)', val: '', suffix: '', cls: '' },
        { type: 'damage', text: '🧙 Archon_Maltheus casts Frostbolt \u2192 Shadow Titan Vorath for ', val: '41,328', suffix: '', cls: 'dmg-val' },
        { type: 'heal', text: '💚 HealzPlz casts Prayer of Healing \u2192 Raid for ', val: '18,445', suffix: '', cls: 'heal-val' },
        { type: 'damage', text: '🗡️ Vex_Shadow casts Backstab \u2192 Shadow Titan Vorath for ', val: '52,119', suffix: ' (CRIT)', cls: 'dmg-crit' },
        { type: 'death', text: '💀 Shadow Titan Vorath slays 🧙 CrystalMage (Shadow Nova)', val: '', suffix: '', cls: '' },
        { type: 'buff', text: '✨ ShieldOfDawn activates Last Stand (+30% HP)', val: '', suffix: '', cls: '' },
        { type: 'damage', text: '🗡️ xBladeRunnerx casts Fan of Knives \u2192 Shadow Titan Vorath for ', val: '8,234', suffix: ' (AOE)', cls: 'dmg-val' },
        { type: 'heal', text: '💚 LightBringr casts Holy Light \u2192 CrystalMage for ', val: '56,778', suffix: ' (CRIT)', cls: 'heal-val' },
    ];

    function addCombatLine() {
        var evt = combatEvents[Math.floor(Math.random() * combatEvents.length)];
        var now = new Date();
        var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');

        var line = document.createElement('div');
        line.className = 'log-line log-' + evt.type;

        var html = '<span class="log-time">' + timeStr + '</span><span class="log-text">' + evt.text;
        if (evt.val) {
            html += '<span class="' + evt.cls + '">' + evt.val + '</span>';
        }
        html += evt.suffix + '</span>';
        line.innerHTML = html;

        combatLog.insertBefore(line, combatLog.firstChild);

        while (combatLog.children.length > 20) {
            combatLog.removeChild(combatLog.lastChild);
        }
    }

    setInterval(addCombatLine, 1500);

    /* ═══════════ ACTIVITY FEED STREAMING ═══════════ */
    var activityFeed = document.getElementById('activity-feed');

    var activityEvents = [
        '🏆 xBladeRunnerx reached Gladiator rank!',
        '💰 Shadow Covenant deposited 50,000g to guild bank',
        '🐉 DragonTamer tamed a Frost Dragon mount!',
        '📈 Arcane Crystal price exceeded 4,000g on Ironforge Exchange',
        '⚔️ Battlefield "Blood Arena" reached 2,000 players!',
        '🏰 Order of Dawn captured Stormwind Pass',
        '💎 Legendary item "Soulrender" appeared on marketplace',
        '🎉 Frostveil Convergence pre-event started!',
        '🛡️ Celestial Vanguard completed weekly guild quest!',
        '🗡️ Archon_Maltheus reached 10,000 PvP kills!',
        '📦 Market volume exceeded 5 billion gold today!',
        '🐉 World boss Charathax health dropped to 45%!',
        '⚡ Server tick rate stabilized at 12ms',
        '🏆 New dungeon record: Shadowvault Depths M+20 in 11:58!',
        '🌟 Player MoonSage_42 discovered hidden zone: The Glimmering Abyss',
        '💰 Rare item "Crown of the Elder King" sold for 2,000,000g!',
        '⚔️ Faction war escalated: 3 new territories contested',
        '🎪 Grand Tournament registration now open!',
        '🌋 Mount Pyralis eruption imminent - evacuate Ashfall Dominion!',
        '📜 New world quest chain available: "The Void Prophecy"',
        '🛡️ Guild "Void Reapers" upgraded to Level 45!',
        '💀 Hardmode boss "The Primordial Shadow" unlocked!',
        '🎣 Rare fish "Abyssal Leviathan" caught by AnglerPro99!',
        '🔮 Enchanting recipe "Voidforged Enchantment" discovered!',
        '🏆 Celestial Vanguard won the weekly territory war!',
        '📉 Dragonsteel prices fell 15% after new node discovered',
        '🐉 3 Elder Dragons spotted over Frostfang Peaks!',
        '⚔️ PvP season rewards distribution begins tomorrow!',
        '🌟 New achievement category "Voidwalker Chronicles" added!',
    ];

    function addActivityLine() {
        var text = activityEvents[Math.floor(Math.random() * activityEvents.length)];
        var now = new Date();
        var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');

        var line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = '<span class="log-time">' + timeStr + '</span><span class="log-text">' + text + '</span>';

        activityFeed.insertBefore(line, activityFeed.firstChild);

        while (activityFeed.children.length > 20) {
            activityFeed.removeChild(activityFeed.lastChild);
        }
    }

    setInterval(addActivityLine, 3000);

    /* ═══════════ SYSTEM STATS ═══════════ */
    var sysCpu = document.querySelector('.sys-cpu');
    var sysMem = document.querySelector('.sys-mem');
    var sysNet = document.querySelector('.sys-net');
    var sysDisk = document.querySelector('.sys-disk');

    function updateSysStats() {
        if (sysCpu) {
            var cpu = 30 + Math.floor(Math.random() * 15);
            sysCpu.style.width = cpu + '%';
            sysCpu.parentElement.nextElementSibling.textContent = cpu + '%';
        }
        if (sysMem) {
            var mem = 62 + Math.floor(Math.random() * 10);
            sysMem.style.width = mem + '%';
            sysMem.parentElement.nextElementSibling.textContent = mem + '%';
        }
        if (sysNet) {
            var net = 8 + Math.floor(Math.random() * 15);
            sysNet.style.width = net + '%';
            sysNet.parentElement.nextElementSibling.textContent = net + '%';
        }
        if (sysDisk) {
            var disk = 42 + Math.floor(Math.random() * 8);
            sysDisk.style.width = disk + '%';
            sysDisk.parentElement.nextElementSibling.textContent = disk + '%';
        }
    }
    setInterval(updateSysStats, 2000);

    /* ═══════════ EVENT TIMER COUNTDOWN ═══════════ */
    var eventSeconds = 2 * 3600 + 14 * 7;

    function updateEventTimer() {
        eventSeconds--;
        if (eventSeconds < 0) eventSeconds = 0;
        var eh = Math.floor(eventSeconds / 3600);
        var em = Math.floor((eventSeconds % 3600) / 60);
        var es = eventSeconds % 60;
        var timerEl = document.querySelector('.event-item.legendary .event-timer');
        if (timerEl) {
            timerEl.textContent = '⏱️ ' + eh + 'h ' + em + 'm ' + String(es).padStart(2, '0') + 's';
        }
    }
    setInterval(updateEventTimer, 1000);

    /* ═══════════ FRIEND STATUS FLICKER ═══════════ */
    var friendRows = document.querySelectorAll('.friend-row');

    function flickerFriendStatus() {
        var idx = Math.floor(Math.random() * friendRows.length);
        var row = friendRows[idx];
        if (!row) return;
        var statusEl = row.querySelector('.friend-status');
        if (!statusEl) return;
        var currentStatus = statusEl.textContent.trim();
        if (currentStatus === '🟢') {
            statusEl.textContent = '🟡';
            row.classList.remove('online');
            row.classList.add('idle');
            setTimeout(function () {
                statusEl.textContent = '🟢';
                row.classList.remove('idle');
                row.classList.add('online');
            }, 5000);
        }
    }
    setInterval(flickerFriendStatus, 8000);

    /* ═══════════ BOUNTY PROGRESS TICK ═══════════ */
    var bountyFills = document.querySelectorAll('.bounty-prog .prog-fill');

    function tickBountyProgress() {
        bountyFills.forEach(function (fill) {
            var currentWidth = parseFloat(fill.style.width);
            if (currentWidth < 100 && currentWidth > 0) {
                var increment = Math.random() * 0.3;
                var newWidth = Math.min(currentWidth + increment, 100);
                fill.style.width = newWidth + '%';
                var textEl = fill.parentElement.nextElementSibling;
                if (textEl) {
                    textEl.textContent = Math.floor(newWidth) + '%';
                }
            }
        });
    }
    setInterval(tickBountyProgress, 5000);

    /* ═══════════ CRAFTING QUEUE PROGRESS ═══════════ */
    var craftFills = document.querySelectorAll('.queue-item.crafting .prog-fill');

    function tickCraftingProgress() {
        craftFills.forEach(function (fill) {
            var currentWidth = parseFloat(fill.style.width);
            if (currentWidth < 100) {
                var increment = Math.random() * 0.5;
                var newWidth = Math.min(currentWidth + increment, 100);
                fill.style.width = newWidth + '%';
                if (newWidth >= 100) {
                    var item = fill.closest('.queue-item');
                    if (item) {
                        item.classList.remove('crafting');
                        item.classList.add('ready');
                        var timeEl = item.querySelector('.queue-time');
                        if (timeEl) {
                            timeEl.textContent = '✅ READY';
                        }
                        fill.parentElement.style.display = 'none';
                    }
                }
            }
        });
    }
    setInterval(tickCraftingProgress, 3000);

    /* ═══════════ REWARD TRACK PROGRESS ═══════════ */
    var currentRewardTier = document.querySelector('.reward-tier.current');
    var rewardFill = currentRewardTier ? currentRewardTier.querySelector('.tier-status') : null;

    function tickRewardProgress() {
        if (rewardFill) {
            var text = rewardFill.textContent;
            var match = text.match(/(\d+)%/);
            if (match) {
                var pct = parseInt(match[1]);
                if (pct < 100) {
                    pct += Math.floor(Math.random() * 3) + 1;
                    if (pct >= 100) {
                        pct = 100;
                        rewardFill.textContent = '✅';
                        rewardFill.classList.add('done');
                        currentRewardTier.classList.remove('current');
                        var nextTier = currentRewardTier.nextElementSibling;
                        if (nextTier && nextTier.classList.contains('reward-tier')) {
                            nextTier.classList.add('current');
                            var nextStatus = nextTier.querySelector('.tier-status');
                            if (nextStatus) {
                                nextStatus.textContent = '🔄 0%';
                                nextStatus.classList.remove('done');
                            }
                        }
                    } else {
                        rewardFill.textContent = '🔄 ' + pct + '%';
                    }
                }
            }
        }
    }
    setInterval(tickRewardProgress, 4000);

    /* ═══════════ ECONOMY PRICE TICKER ═══════════ */
    var priceUps = document.querySelectorAll('.price-up');
    var priceDowns = document.querySelectorAll('.price-down');
    var changeUps = document.querySelectorAll('.change-up');
    var changeDowns = document.querySelectorAll('.change-down');

    function tickEconomy() {
        changeUps.forEach(function (el) {
            var text = el.textContent;
            var match = text.match(/\+(\d+)%/);
            if (match) {
                var val = parseInt(match[1]) + Math.floor(Math.random() * 5);
                el.textContent = '+' + val + '%';
            }
        });
        changeDowns.forEach(function (el) {
            var text = el.textContent;
            var match = text.match(/-(\d+)%/);
            if (match) {
                var val = parseInt(match[1]) + Math.floor(Math.random() * 3) - 1;
                if (val < 0) val = 0;
                el.textContent = '-' + val + '%';
            }
        });
    }
    setInterval(tickEconomy, 7000);

    /* ═══════════ BATTLEGROUND PLAYER COUNT TICK ═══════════ */
    function tickBattlegrounds() {
        var bgItems = document.querySelectorAll('.bg-item');
        bgItems.forEach(function (item) {
            var playersEl = item.querySelector('.bg-players');
            if (playersEl) {
                var text = playersEl.textContent;
                var match = text.match(/([\d,]+) players/);
                if (match) {
                    var count = parseInt(match[1].replace(/,/g, ''));
                    count += Math.floor(Math.random() * 21) - 8;
                    if (count < 0) count = 0;
                    playersEl.textContent = count.toLocaleString() + ' players';
                }
            }
        });
    }
    setInterval(tickBattlegrounds, 6000);

    /* ═══════════ PvP RATING TICK ═══════════ */
    function tickPvpRatings() {
        var ratingEls = document.querySelectorAll('.rating-3v3');
        ratingEls.forEach(function (el) {
            var val = parseInt(el.textContent.replace(/,/g, ''));
            var change = Math.floor(Math.random() * 11) - 3;
            val += change;
            el.textContent = val.toLocaleString();
        });
    }
    setInterval(tickPvpRatings, 10000);

    /* ═══════════ GUILD SCORE TICK ═══════════ */
    function tickGuildScores() {
        var scoreEls = document.querySelectorAll('.guild-score');
        scoreEls.forEach(function (el) {
            var val = parseInt(el.textContent.replace(/,/g, ''));
            var change = Math.floor(Math.random() * 21);
            val += change;
            el.textContent = val.toLocaleString();
        });
    }
    setInterval(tickGuildScores, 8000);

    /* ═══════════ ZONE HOVER EFFECTS ═══════════ */
    var zones = document.querySelectorAll('.zone');
    zones.forEach(function (zone) {
        zone.addEventListener('mouseenter', function () {
            zones.forEach(function (z) {
                if (z !== zone) {
                    z.style.opacity = '0.2';
                }
            });
        });
        zone.addEventListener('mouseleave', function () {
            zones.forEach(function (z) {
                z.style.opacity = '';
            });
        });
    });

    /* ═══════════ ALERT BADGE FLICKER ═══════════ */
    var alertCount = 3;
    var alertCriticalEl = document.querySelector('.alert-critical');

    function flickerAlerts() {
        if (alertCount > 1) {
            alertCount += Math.floor(Math.random() * 3) - 1;
            if (alertCount < 1) alertCount = 1;
            if (alertCount > 9) alertCount = 9;
            alertCriticalEl.textContent = '🔴 ' + alertCount + ' CRITICAL';
        }
    }
    setInterval(flickerAlerts, 12000);

    /* ═══════════ INIT ═══════════ */
    console.log('%c⟐ AETHERMOOR COMMAND NEXUS v14.7.3 ⟐', 'color: #00e5ff; font-size: 14px; font-weight: bold;');
    console.log('%cAll systems operational. Dashboard initialized.', 'color: #00e676;');
})();