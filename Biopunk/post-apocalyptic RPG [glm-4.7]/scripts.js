document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. ATMOSPHERIC PARTICLES (SPORES) --- */
    const particleContainer = document.getElementById('particles');
    const particleCount = 60;

    function createSpores() {
        for (let i = 0; i < particleCount; i++) {
            const spore = document.createElement('div');
            spore.classList.add('particle');
            
            // Randomize positioning and movement
            const size = Math.random() * 3 + 1 + 'px';
            spore.style.width = size;
            spore.style.height = size;
            spore.style.left = Math.random() * 100 + 'vw';
            spore.style.top = Math.random() * 100 + 'vh';
            
            // Randomize animation duration and delay for natural chaos
            const duration = Math.random() * 10 + 5 + 's';
            const delay = Math.random() * 5 + 's';
            spore.style.animationDuration = duration;
            spore.style.animationDelay = delay;
            
            // Randomize opacity
            spore.style.opacity = Math.random() * 0.5 + 0.1;
            
            particleContainer.appendChild(spore);
        }
    }
    createSpores();

    /* --- 2. INTERACTIVE MAP SYSTEM --- */
    const zoneItems = document.querySelectorAll('.zone-item');
    const mapCells = document.querySelectorAll('.map-cell');
    const zoneName = document.getElementById('zone-name');
    const zoneDesc = document.getElementById('zone-desc');
    const toxicityMeter = document.querySelector('.meter-fill');

    // Data linking list items to grid cells and lore
    const zoneData = {
        '1': { index: 2, name: "The Sludge Pits", desc: "Highly toxic liquid waste. Respirators required. Mutation probability: 99%.", toxic: "100%" },
        '2': { index: 4, name: "Neon Graveyard", desc: "Old city ruins filled with flickering holograms and rogue androids. Radiation levels fluctuate.", toxic: "65%" },
        '3': { index: 6, name: "Fungal Tower", desc: "A massive growth of mycelium that has consumed a skyscraper. Spore density critical.", toxic: "85%" }
    };

    zoneItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            zoneItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            const zoneId = item.getAttribute('data-zone');
            const data = zoneData[zoneId];

            // Update Text Content with a "decryption" effect simulation
            zoneName.style.opacity = 0;
            zoneDesc.style.opacity = 0;
            
            setTimeout(() => {
                zoneName.innerText = data.name;
                zoneDesc.innerText = data.desc;
                zoneName.style.opacity = 1;
                zoneDesc.style.opacity = 1;
            }, 200);

            // Update Toxicity Meter Width
            toxicityMeter.style.width = data.toxic;
            
            // Update Map Grid Visuals
            mapCells.forEach(cell => cell.classList.remove('active-zone'));
            if(mapCells[data.index]) {
                mapCells[data.index].classList.add('active-zone');
            }
        });
    });

    /* --- 3. TERMINAL LOG SIMULATOR --- */
    const terminalBody = document.getElementById('terminal-body');
    const logs = [
        "> Scanning sector 7 for bio-signs...",
        "> WARNING: Airborne pathogen detected.",
        "> Uploading neural map...",
        "> Encrypted packet received from 'The Doctor'.",
        "> Ration levels: 12%.",
        "> Geiger counter clicking increasing...",
        "> Solar flares expected in 0400 hours."
    ];

    function addLog(text) {
        const p = document.createElement('p');
        p.classList.add('log-entry');
        p.innerText = text;
        
        // Insert before the cursor
        const cursor = terminalBody.querySelector('.cursor');
        terminalBody.insertBefore(p, cursor);
        
        // Auto scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Add a random log every few seconds
    setInterval(() => {
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        addLog(randomLog);
    }, 4000);

    /* --- 4. TECH TREE AUGMENTATION LOGIC --- */
    const techNodes = document.querySelectorAll('.tech-node');

    techNodes.forEach(node => {
        node.addEventListener('click', () => {
            if (node.classList.contains('locked')) {
                // Simulate processing time
                const originalText = node.querySelector('.cost').innerText;
                node.querySelector('.cost').innerText = "INSTALLING...";
                
                setTimeout(() => {
                    node.classList.remove('locked');
                    node.classList.add('unlocked');
                    node.querySelector('.cost').innerText = "ACTIVE";
                    node.style.borderColor = "var(--neon-green)";
                    
                    // Visual feedback
                    addLog(`> AUGMENTATION INSTALLED: ${node.querySelector('.node-label').innerText}`);
                }, 800);
            } else if (node.classList.contains('unlocked')) {
                addLog(`> SYSTEM: ${node.querySelector('.node-label').innerText} already active.`);
            }
        });
    });

    /* --- 5. SHUTDOWN SEQUENCE --- */
    const shutdownBtn = document.getElementById('shutdown');
    const body = document.body;

    shutdownBtn.addEventListener('click', () => {
        addLog("> INITIATING SYSTEM SHUTDOWN...");
        setTimeout(() => {
            addLog("> CONNECTION TERMINATED.");
            // CRT Turn off effect
            body.style.transition = "filter 0.5s ease-in, height 0.5s ease-in";
            body.style.filter = "brightness(0)";
            body.style.height = "0";
            body.style.overflow = "hidden";
        }, 1500);
    });

    /* --- 6. CUSTOM CURSOR TRACKER (TARGETING RETICLE) --- */
    // Optional subtle effect to enhance immersion
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.border = '1px solid var(--neon-green)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.zIndex = '9999';
    cursor.style.mixBlendMode = 'difference';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hide custom cursor when leaving window
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = 0;
    });
    
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = 1;
    });
});