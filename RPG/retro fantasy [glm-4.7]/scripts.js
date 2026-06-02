document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Tab System Logic ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('main > section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            navBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Hide all sections
            sections.forEach(sec => {
                sec.classList.remove('active-section');
                sec.classList.add('hidden-section');
            });

            // Show target section
            const targetId = btn.getAttribute('data-tab');
            const targetSection = document.getElementById(targetId);
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');

            // Specific Logic: Animate Stat Bars if Character Sheet is opened
            if (targetId === 'character') {
                animateStats();
            }

            // Log to game console
            logToConsole(`Switched view to: ${btn.innerText.trim()}`);
        });
    });

    // --- 2. Character Stat Animation ---
    function animateStats() {
        const statFills = document.querySelectorAll('.stat-fill');
        // Reset width first to allow replay
        statFills.forEach(fill => fill.style.width = '0%');
        
        // Small delay for visual effect
        setTimeout(() => {
            statFills.forEach(fill => {
                const width = fill.getAttribute('data-width');
                fill.style.width = width;
            });
        }, 100);
    }

    // --- 3. Inventory Tooltip System ---
    const tooltip = document.getElementById('item-tooltip');
    const itemSlots = document.querySelectorAll('.tooltip-trigger');

    // Flavor Data for Items
    const itemDb = {
        "Blade of the Fallen King": { desc: "A heavy blade radiating a cold aura. It thirsts for vengeance.", stats: "ATK +50 | Lifesteal 5%" },
        "Enchanted Tower Shield": { desc: "Forged by dwarves of the Iron Depths. Nearly impenetrable.", stats: "DEF +40 | Block Chance +15%" },
        "Health Potion x3": { desc: "A bubbling red liquid. Smells of strawberries and iron.", stats: "Restore 200 HP" },
        "Torch": { desc: "A simple wooden torch wrapped in oil-soaked cloth.", stats: "Light Radius: 20ft" },
        "Ancient Map": { desc: "Fragments of a map showing a location marked with a black sun.", stats: "Quest Item" }
    };

    itemSlots.forEach(slot => {
        slot.addEventListener('mouseenter', (e) => {
            const itemName = slot.getAttribute('data-item');
            const data = itemDb[itemName] || { desc: "A mysterious item.", stats: "Unknown" };
            
            tooltip.querySelector('.item-name').innerText = itemName;
            tooltip.querySelector('.item-desc').innerText = data.desc;
            tooltip.querySelector('.item-stats').innerText = data.stats;
            
            tooltip.classList.add('visible');
            moveTooltip(e);
        });

        slot.addEventListener('mousemove', moveTooltip);

        slot.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });

    function moveTooltip(e) {
        // Calculate position to keep tooltip within viewport
        const xOffset = 15;
        const yOffset = 15;
        
        let left = e.pageX + xOffset;
        let top = e.pageY + yOffset;

        // Boundary check (basic)
        if (left + 250 > window.innerWidth) {
            left = e.pageX - 265;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    // --- 4. Game Console Logic ---
    const consoleInput = document.getElementById('console-input');
    const consoleOutput = document.getElementById('console-output');

    consoleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = consoleInput.value.trim();
            if (command) {
                processCommand(command);
                consoleInput.value = '';
            }
        }
    });

    function processCommand(cmd) {
        logToConsole(`> ${cmd}`, 'user-text');
        
        const lowerCmd = cmd.toLowerCase();

        switch(lowerCmd) {
            case '/help':
                logToConsole("Available commands: /help, /clear, /gold, /status");
                break;
            case '/clear':
                consoleOutput.innerHTML = '';
                logToConsole("Console cleared.");
                break;
            case '/gold':
                logToConsole("Current Gold: 1,240");
                break;
            case '/status':
                logToConsole("Health: 85% | Mana: 40% | Status: Healthy");
                break;
            default:
                logToConsole(`Unknown command: ${cmd}`, 'error-text');
                playSound('error');
        }
    }

    function logToConsole(text, type = '') {
        const p = document.createElement('p');
        p.innerText = text;
        if (type) p.classList.add(type);
        
        // Add timestamp
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
        p.innerHTML = `<span style="opacity:0.5">[${time}]</span> ${p.innerHTML}`;
        
        consoleOutput.appendChild(p);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    // --- 5. Particle Atmosphere (Canvas) ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5;
            this.life = Math.random() * 100 + 100;
            this.color = Math.random() > 0.9 ? '212, 175, 55' : '102, 252, 241'; // Gold or Cyan
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;

            if (this.life <= 0 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // --- 6. Global Interactions ---

    // Sound Simulation (Visual Feedback)
    window.playSound = function(type) {
        // In a real app, this would play Audio()
        // Here we trigger a visual flash in the console
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0'; flash.style.left = '0';
        flash.style.width = '100%'; flash.style.height = '100%';
        flash.style.background = 'rgba(255,255,255,0.1)';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 0.2s';
        document.body.appendChild(flash);
        
        setTimeout(() => { flash.style.opacity = '0'; }, 50);
        setTimeout(() => { flash.remove(); }, 250);
    };

    // Modal Logic
    window.closeModal = function() {
        const modal = document.getElementById('modal-overlay');
        modal.classList.add('hidden');
    };

    // Close modal on outside click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            closeModal();
        }
    });

    // Initial welcome sequence delay
    setTimeout(() => {
        logToConsole("System initialization complete.");
    }, 1000);

    // Quest Card Click
    const acceptBtns = document.querySelectorAll('.accept-btn');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click handling if added later
            const card = btn.closest('.quest-card');
            const title = card.querySelector('h3').innerText;
            
            // Update Modal
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-body').innerHTML = `
                <p>You have accepted the quest: <strong>${title}</strong>.</p>
                <p style="margin-top:10px;">New objectives have been added to your journal.</p>
                <button style="margin-top:20px; padding: 5px 10px; cursor:pointer;" onclick="closeModal()">Close</button>
            `;
            
            // Show Modal
            document.getElementById('modal-overlay').classList.remove('hidden');
            playSound('quest');
            logToConsole(`Quest Accepted: ${title}`);
        });
    });
});