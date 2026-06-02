/* ========================================
NEXUS COMMAND - GALACTIC DASHBOARD
Scripts v4.7.2.9
======================================== */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        tickRate: 100,
        startYear: 2847,
        startDay: 156
    };

    // Global state
    let serverTickCount = 0;
    let factionData = [
        { name: 'TERRAN COALITION', short: 'terran', power: 38.4 },
        { name: 'VOID EMPIRE', short: 'void', power: 31.2 },
        { name: 'CYBER SYNTH', short: 'cyborg', power: 18.7 },
        { name: 'XENO HORDE', short: 'alien', power: 11.7 }
    ];

    let resourceData = [
        { name: 'Titanium', icon: '⛏', rate: 847.2, stock: 892400 },
        { name: 'Crystals', icon: '💠', rate: 234.8, stock: 124700 },
        { name: 'Fuel Cells', icon: '⚗', rate: 512.4, stock: 2100000 },
        { name: 'Dark Matter', icon: '🔩', rate: -12.4, stock: 847 },
        { name: 'Uranium', icon: '☢', rate: 0, stock: 45200 },
        { name: 'Exotic Matter', icon: '💎', rate: 4.2, stock: 89 }
    ];

    let marketData = [
        { name: 'Titanium Ore', bid: 284, ask: 287, change: 2.4 },
        { name: 'Plasma Canisters', bid: 1842, ask: 1891, change: -1.2 },
        { name: 'Quantum Chips', bid: 84700, ask: 89250, change: 5.7 },
        { name: 'Neural Implants', bid: 284700, ask: 294100, change: 0.8 },
        { name: 'Warp Cores', bid: 4829100, ask: 5124700, change: -3.1 },
        { name: 'Antimatter', bid: 124700, ask: 129800, change: 0.0 }
    ];

    let researchData = [
        { name: 'Quantum Drive V2', progress: 78, time: '4d 12h' },
        { name: 'Plasma Armor MkIII', progress: 45, time: '12d 6h' },
        { name: 'Neural Interface', progress: 92, time: '1d 3h' },
        { name: 'Stealth Generator', progress: 23, time: '18d 9h' },
        { name: 'Planetary Siege', progress: 67, time: '7d 14h' }
    ];

    let sectorsData = [
        { name: 'SOLARIA PRIME', icon: '◈', status: 'conflict', pop: 2400000, x: 50, y: 50 },
        { name: 'NEBULA-7', icon: '◇', status: 'stable', pop: 891000, x: 25, y: 30 },
        { name: 'VOID REACH', icon: '○', status: 'unknown', pop: 0, x: 75, y: 70 },
        { name: 'CRYSTAL HEAVEN', icon: '◈', status: 'contested', pop: 1700000, x: 60, y: 25 },
        { name: "DRAGON'S NEST", icon: '◇', status: 'raid', pop: 45000, x: 40, y: 80 }
    ];

    // Utility functions
    function formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toFixed(0);
    }

    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(randomRange(min, max));
    }

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Initialize star map
    function initStarMap() {
        const starMap = document.querySelector('.mini-star-map');
        if (!starMap) return;
        
        sectorsData.forEach(function(sector, index) {
            const star = document.createElement('div');
            star.className = 'star-system neutral';
            star.style.left = sector.x + '%';
            star.style.top = sector.y + '%';
            star.title = sector.name;
            starMap.appendChild(star);
        });
    }

    // Render sectors
    function renderSectors() {
        const sectorList = document.querySelector('.sector-list');
        if (!sectorList) return;
        
        sectorList.innerHTML = '';
        
        sectorsData.forEach(function(sector, index) {
            const item = document.createElement('div');
            item.className = 'sector-item' + (index === 0 ? ' active' : '');
            
            let statusIcon = '○';
            if (sector.status === 'conflict') statusIcon = '⚠';
            else if (sector.status === 'stable') statusIcon = '●';
            else if (sector.status === 'contested') statusIcon = '⚡';
            else if (sector.status === 'raid') statusIcon = '⚔';
            else if (sector.status === 'unknown') statusIcon = '?';
            
            item.innerHTML = 
                '<span class="sector-icon">' + sector.icon + '</span>' +
                '<span class="sector-name">' + sector.name + '</span>' +
                '<span class="sector-status ' + sector.status + '">' + statusIcon + ' ' + sector.status.toUpperCase() + '</span>' +
                '<span class="sector-pop">👥 ' + formatNumber(sector.pop) + '</span>';
            
            sectorList.appendChild(item);
        });
    }

    // Render faction bars
    function renderFactions() {
        const factionBars = document.querySelector('.faction-bars');
        if (!factionBars) return;
        
        factionBars.innerHTML = '';
        
        factionData.forEach(function(faction) {
            let icon = '●';
            if (faction.short === 'terran') icon = '▲';
            else if (faction.short === 'void') icon = '▼';
            else if (faction.short === 'cyborg') icon = '◆';
            
            const row = document.createElement('div');
            row.className = 'faction-row';
            row.innerHTML = 
                '<span class="faction-name ' + faction.short + '">' + icon + ' ' + faction.name + '</span>' +
                '<div class="progress-bar"><div class="progress-fill ' + faction.short + '" style="width: ' + faction.power + '%"></div></div>' +
                '<span class="faction-value">' + faction.power.toFixed(1) + '%</span>';
            
            factionBars.appendChild(row);
        });
    }

    // Render fleet list
    function renderFleet() {
        const fleetList = document.querySelector('.fleet-list');
        if (!fleetList) return;
        
        const fleetData = [
            { name: 'ALPHA STRIKE', icon: '⚔', status: 'patrol', loc: 'Solaria-7' },
            { name: 'OMEGA GUARD', icon: '🛡', status: 'defending', loc: 'Prime' },
            { name: 'LIGHTNING', icon: '⚡', status: 'assault', loc: 'Void-12' },
            { name: 'SPECTRE', icon: '🔮', status: 'recon', loc: 'Unknown' }
        ];
        
        fleetList.innerHTML = '';
        
        fleetData.forEach(function(fleet) {
            const item = document.createElement('div');
            item.className = 'fleet-item';
            item.innerHTML = 
                '<span class="fleet-name">' + fleet.icon + ' ' + fleet.name + '</span>' +
                '<span class="fleet-status ' + fleet.status + '">◉ ' + fleet.status.toUpperCase() + '</span>' +
                '<span class="fleet-loc">' + fleet.loc + '</span>';
            
            fleetList.appendChild(item);
        });
    }

    // Render resources
    function renderResources() {
        const resourceGrid = document.querySelector('.resource-grid');
        if (!resourceGrid) return;
        
        resourceGrid.innerHTML = '';
        
        resourceData.forEach(function(res) {
            const item = document.createElement('div');
            item.className = 'resource-item';
            
            let rateClass = 'stable';
            let rateSign = '';
            if (res.rate > 0) { rateClass = 'positive'; rateSign = '+'; }
            else if (res.rate < 0) { rateClass = 'negative'; rateSign = ''; }
            
            item.innerHTML = 
                '<span class="res-icon">' + res.icon + '</span>' +
                '<span class="res-name">' + res.name + '</span>' +
                '<span class="res-rate ' + rateClass + '">' + rateSign + res.rate.toFixed(1) + '/s</span>' +
                '<span class="res-stock">' + formatNumber(res.stock) + '</span>';
            
            resourceGrid.appendChild(item);
        });
    }

    // Update resources with fluctuation
    function updateResources() {
        resourceData.forEach(function(res) {
            res.rate += randomRange(-5, 5);
            res.rate = Math.max(-100, Math.min(1000, res.rate));
            res.stock += res.rate * 0.1;
            res.stock = Math.max(0, res.stock);
        });
        renderResources();
    }

    // Render market
    function renderMarket() {
        const marketList = document.querySelector('.market-list');
        if (!marketList) return;
        
        marketList.innerHTML = '';
        
        // Add header
        const header = document.createElement('div');
        header.className = 'market-header';
        header.innerHTML = '<span>COMMODITY</span><span>BID</span><span>ASK</span><span>Δ%</span>';
        marketList.appendChild(header);
        
        marketData.forEach(function(item) {
            const row = document.createElement('div');
            row.className = 'market-item';
            
            let changeClass = 'stable';
            let changeSign = '';
            if (item.change > 0) { changeClass = 'positive'; changeSign = '+'; }
            else if (item.change < 0) { changeClass = 'negative'; changeSign = ''; }
            
            row.innerHTML = 
                '<span class="item-name">' + item.name + '</span>' +
                '<span class="item-bid">' + (item.bid / 100).toFixed(2) + '¢</span>' +
                '<span class="item-ask">' + (item.ask / 100).toFixed(2) + '¢</span>' +
                '<span class="item-change ' + changeClass + '">' + changeSign + item.change.toFixed(1) + '%</span>';
            
            marketList.appendChild(row);
        });
    }

    // Render research
    function renderResearch() {
        const researchList = document.querySelector('.research-list');
        if (!researchList) return;
        
        researchList.innerHTML = '';
        
        researchData.forEach(function(proj) {
            const item = document.createElement('div');
            item.className = 'research-item';
            item.innerHTML = 
                '<span class="tech-name">' + proj.name + '</span>' +
                '<div class="tech-progress"><div class="tech-bar" style="width: ' + proj.progress + '%"></div></div>' +
                '<span class="tech-percent">' + proj.progress + '%</span>' +
                '<span class="tech-time">' + proj.time + '</span>';
            
            researchList.appendChild(item);
        });
    }

    // Update research progress
    function updateResearch() {
        researchData.forEach(function(proj) {
            proj.progress += randomRange(0.01, 0.05);
            proj.progress = Math.min(100, proj.progress);
        });
        renderResearch();
    }

    // Add combat log entry
    function addLogEntry() {
        const logEntries = document.querySelector('.log-entries');
        if (!logEntries) return;
        
        const types = ['kill', 'loot', 'mission', 'death', 'craft', 'trade', 'upgrade', 'achievement'];
        const type = pickRandom(types);
        
        const targets = {
            kill: ['ShadowHunter_42', 'VoidRaider_X', 'StarKiller_99'],
            loot: ['Rare Cache', 'Epic Box', 'War Trophy'],
            mission: ['Escort Complete', 'Assault Complete', 'Recon Complete'],
            death: ['Void Titan', 'Alien Queen', 'Enemy Fleet'],
            craft: ['Plasma Rifle', 'Energy Shield', 'Warp Drive'],
            trade: ['50k Titanium', '100 Plasma', '10 Warp Cores'],
            upgrade: ['Engine MkII', 'Shield Gen', 'Weapon Sys'],
            achievement: ['Slayer V', 'Trader Elite', 'Explorer']
        };
        
        const rewards = {
            kill: '+847 XP',
            loot: '₵ 2.4K',
            mission: '+12.4K XP',
            death: '-2.4K HP',
            craft: '+847 SKL',
            trade: '₵ 14.2K',
            upgrade: '→ MkIII',
            achievement: '🏆'
        };
        
        const target = pickRandom(targets[type] || ['Unknown']);
        
        const entry = document.createElement('div');
        entry.className = 'log-entry ' + type;
        
        const hours = Math.floor((serverTickCount % 64) / (64 / 24));
        const mins = Math.floor(((serverTickCount % 64) % (64 / 24)) * 60);
        const secs = Math.floor(((serverTickCount % 64) % (64 / 24) * 60 % 1) * 60);
        const timeStr = hours.toString().padStart(2, '0') + ':' + mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
        
        const actionNames = {
            kill: 'Killed', loot: 'Looted', mission: 'Mission',
            death: 'Died', craft: 'Crafted', trade: 'Sold',
            upgrade: 'Upgraded', achievement: 'ACHV'
        };
        
        entry.innerHTML = 
            '<span class="log-time">' + timeStr + '</span>' +
            '<span class="log-action">' + actionNames[type] + '</span>' +
            '<span class="log-target">' + target + '</span>' +
            '<span class="log-reward">' + rewards[type] + '</span>';
        
        logEntries.insertBefore(entry, logEntries.firstChild);
        
        while (logEntries.children.length > 50) {
            logEntries.removeChild(logEntries.lastChild);
        }
    }

    // Server time update
    function updateServerTime() {
        serverTickCount++;
        
        const serverTimeEl = document.getElementById('server-time');
        if (!serverTimeEl) return;
        
        const totalDays = Math.floor(serverTickCount / 64);
        const year = CONFIG.startYear + Math.floor(totalDays / 365);
        const dayOfYear = totalDays % 365;
        const hours = Math.floor((serverTickCount % 64) / (64 / 24));
        const mins = Math.floor(((serverTickCount % 64) % (64 / 24)) * 60);
        
        serverTimeEl.textContent = 
            year + '.' + 
            String(dayOfYear + 1).padStart(3, '0') + '.01:' + 
            String(hours).padStart(2, '0') + ':' + 
            String(mins).padStart(2, '0') + ':00';
    }

    // Update system info
    function updateSystemInfo() {
        const sysItems = document.querySelectorAll('.sys-item');
        if (sysItems[0]) sysItems[0].textContent = 'FPS: ' + randomInt(55, 145);
        if (sysItems[1]) sysItems[1].textContent = 'PING: ' + randomInt(8, 25) + 'ms';
        if (sysItems[2]) sysItems[2].textContent = 'MEM: ' + randomRange(3.5, 6.2).toFixed(1) + 'GB';
    }

    // Flash random panel
    function flashPanel() {
        const panels = document.querySelectorAll('.panel');
        if (panels.length === 0) return;
        
        const randomPanel = pickRandom([...panels]);
        randomPanel.classList.add('data-update');
        setTimeout(function() {
            randomPanel.classList.remove('data-update');
        }, 500);
    }

    // Initialize everything
    function init() {
        initStarMap();
        renderSectors();
        renderFactions();
        renderFleet();
        renderResources();
        renderMarket();
        renderResearch();
        
        // Start intervals
        setInterval(updateServerTime, CONFIG.tickRate);
        setInterval(updateResources, 2000);
        setInterval(updateResearch, 3000);
        setInterval(addLogEntry, 3000);
        setInterval(updateSystemInfo, 1000);
        setInterval(flashPanel, 5000);
        
        // Update faction power periodically
        setInterval(function() {
            factionData.forEach(function(f) {
                f.power += randomRange(-0.3, 0.3);
                f.power = Math.max(5, Math.min(50, f.power));
            });
            renderFactions();
        }, 10000);
        
        console.log('%c🚀 NEXUS COMMAND INITIALIZED', 'color: #00f7ff; font-size: 16px; font-weight: bold;');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();