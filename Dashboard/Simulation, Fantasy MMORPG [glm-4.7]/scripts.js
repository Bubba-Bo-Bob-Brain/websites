document.addEventListener('DOMContentLoaded', () => {
    
    // --- UTILITIES ---
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randArr = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const formatNum = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // --- CLOCK ---
    const clockEl = document.getElementById('clock');
    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- COMBAT LOG SIMULATOR ---
    const logContainer = document.getElementById('combatLog');
    const logMessages = {
        dmg: [
            "You hit Target Dummy for {dmg} (Crit!) 🔥",
            "Fireball hits for {dmg}.",
            "Auto-attack: {dmg} dmg.",
            "Shadow Strike deals {dmg} to Enemy.",
            "Meteor Swarm: Area DMG {dmg}",
            "Lightning Bolt crits for {dmg} ⚡"
        ],
        loot: [
            "You found {gold} Gold.",
            "Rare Gem obtained! 💎",
            "Item: Dragon Scale (+1) 🐉",
            "PlayerX looted Legendary Sword ⚔️",
            "Inventory Full! Item dropped."
        ],
        sys: [
            "[SYS] Connection stable.",
            "[AREA] Weather changed to Rain.",
            "[CHAT] User2 has joined the world.",
            "[GUILD] War declared by [Enemy].",
            "[SYS] Saving character data..."
        ],
        heal: [
            "Potion used: +{heal} HP 🧪",
            "Regeneration tick: +{heal} HP",
            "Healer casts Holy Light: +{heal} HP ✨"
        ]
    };

    function addLogEntry() {
        const types = Object.keys(logMessages);
        const type = randArr(types);
        const msgTemplate = randArr(logMessages[type]);
        
        let finalMsg = msgTemplate
            .replace('{dmg}', formatNum(rand(100, 15000)))
            .replace('{gold}', formatNum(rand(10, 5000)))
            .replace('{heal}', formatNum(rand(500, 5000)));

        const div = document.createElement('div');
        div.className = `log-entry ${type}`;
        div.textContent = finalMsg;

        logContainer.appendChild(div);
        
        // Auto Scroll
        logContainer.scrollTop = logContainer.scrollHeight;

        // Cleanup old logs
        if (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }
    // High frequency for "overload" feel
    setInterval(addLogEntry, 600);

    // --- CHAT SIMULATOR ---
    const chatFeed = document.getElementById('chatFeed');
    const users = ["xXSlayerXx", "NoobMaster", "TraderJoe", "HealerMain", "TankBot_99", "GoldFarmer", "ShadowLord"];
    const chats = [
        "LFG RAID 5k+ GS",
        "WTS Legendary Sword 50k Gold PST",
        "where is the dungeon?",
        "inv pls",
        "buying all herbs 1k stack",
        "lol nice crit",
        "Anyone seen the world boss?",
        "Guild hall upgrade complete!",
        "Need tank for hardmode",
        "brb"
    ];

    function addChatMessage() {
        const user = randArr(users);
        const msg = randArr(chats);
        const div = document.createElement('div');
        div.className = 'msg';
        div.innerHTML = `<span class="user">${user}</span>: ${msg}`;
        chatFeed.appendChild(div);
        chatFeed.scrollTop = chatFeed.scrollHeight;
        
        if (chatFeed.children.length > 30) {
            chatFeed.removeChild(chatFeed.firstChild);
        }
    }
    setInterval(addChatMessage, 2500);

    // --- DATA FLUCTUATION SIMULATOR ---
    const goldHeader = document.querySelector('.global-resources .res-item:nth-child(3) .val');
    
    function fluctuateData() {
        // Fluctuate Global Gold
        let currentGold = parseInt(goldHeader.textContent.replace(/,/g, '').replace('M', '000000'));
        let change = rand(-500000, 500000);
        let newGold = currentGold + change;
        goldHeader.textContent = formatNum(newGold) + "M"; // Simplified for display

        // Fluctuate Server Ping
        const pingEl = document.querySelector('.connection-status span');
        let ping = rand(8, 25);
        pingEl.textContent = ping + "ms";
        pingEl.className = ping > 20 ? 'warn' : 'good';

        // Fluctuate Market Prices
        const prices = document.querySelectorAll('.market-item .price');
        prices.forEach(price => {
            if (Math.random() > 0.7) { // Only update sometimes
                let val = parseInt(price.textContent.replace(/[^0-9]/g, ''));
                let volatility = Math.floor(val * 0.05); // 5% swing
                let newVal = val + rand(-volatility, volatility);
                let suffix = price.textContent.includes('g') ? 'g' : 's';
                price.textContent = formatNum(newVal) + suffix;
            }
        });

        // Update Raid Progress
        const raidBars = document.querySelectorAll('.progress-fill');
        raidBars.forEach(bar => {
            let currentW = parseFloat(bar.style.width);
            if (currentW > 0) {
                let change = rand(-0.5, 1.5);
                let newW = Math.max(0, Math.min(100, currentW + change));
                bar.style.width = newW + "%";
            }
        });
    }
    setInterval(fluctuateData, 1000);

    // --- MAP INTERACTION ---
    const mapZones = document.querySelectorAll('.map-zone');
    const mapHeaderTitle = document.querySelector('.panel-map h3');
    const originalMapTitle = mapHeaderTitle.textContent;

    mapZones.forEach(zone => {
        zone.addEventListener('mouseenter', () => {
            const zoneName = zone.getAttribute('data-name');
            const zoneGuild = zone.getAttribute('data-guild') || 'Wilderness';
            mapHeaderTitle.innerHTML = `SCANNING: <span style="color:var(--cyan)">${zoneName}</span> [${zoneGuild}]`;
        });

        zone.addEventListener('mouseleave', () => {
            mapHeaderTitle.textContent = originalMapTitle;
        });
        
        zone.addEventListener('click', () => {
            // Visual feedback for "teleporting"
            document.body.style.opacity = '0.5';
            setTimeout(() => document.body.style.opacity = '1', 100);
            addLogEntry(); // Add a system log for travel
        });
    });

    // --- INVENTORY INTERACTION ---
    const invSlots = document.querySelectorAll('.inv-slot:not(.empty)');
    invSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove active class from others
            invSlots.forEach(s => s.style.borderColor = '');
            invSlots.forEach(s => s.style.boxShadow = '');
            
            // Highlight selected
            this.style.borderColor = '#fff';
            this.style.boxShadow = '0 0 10px #fff';
            
            // Add detail to log
            const itemTitle = this.getAttribute('title');
            const rarity = this.classList.contains('legendary') ? 'LEGENDARY' : 
                           this.classList.contains('epic') ? 'EPIC' : 'COMMON';
            
            const div = document.createElement('div');
            div.className = 'log-entry sys';
            div.textContent = `[INV] Inspecting: ${itemTitle} (${rarity})`;
            logContainer.appendChild(div);
            logContainer.scrollTop = logContainer.scrollHeight;
        });
    });

    // --- CHAT TABS (VISUAL ONLY) ---
    const tabs = document.querySelectorAll('.chat-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- CHAT INPUT ---
    const chatInput = document.querySelector('.chat-input-area input');
    const sendBtn = document.querySelector('.chat-input-area button');

    function sendMessage() {
        const txt = chatInput.value.trim();
        if (txt) {
            const div = document.createElement('div');
            div.className = 'msg';
            div.innerHTML = `<span class="user" style="color:var(--gold)">Lord_Kaelthas</span>: ${txt}`;
            chatFeed.appendChild(div);
            chatFeed.scrollTop = chatFeed.scrollHeight;
            chatInput.value = '';
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

});