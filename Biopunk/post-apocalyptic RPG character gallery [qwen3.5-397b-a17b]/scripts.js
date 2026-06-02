/**
 * PROJECT: BIO-ARCHIVE // TERMINAL ACCESS
 * SCRIPT: System Logic & Data Rendering
 * AESTHETIC: Retro-Biopunk / CRT Terminal
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & STATE ---
    const state = {
        filter: 'all',
        booting: true
    };

    // --- MOCK DATA: THE DATABASE ---
    const characters = [
        {
            id: '001',
            name: 'Kaelen "Rust"',
            faction: 'SCAVENGERS',
            category: 'mutant',
            desc: 'Former mechanic. 40% body replaced with scrap metal. High radiation tolerance.',
            stats: { mutation: 85, toxicity: 40, combat: 65 },
            color: '#ffcc00'
        },
        {
            id: '002',
            name: 'Unit 734',
            faction: 'CORP-SEC',
            category: 'cyborg',
            desc: 'Autonomous security drone with degraded AI. Retains police protocols.',
            stats: { mutation: 10, toxicity: 5, combat: 95 },
            color: '#33ff33'
        },
        {
            id: '003',
            name: 'Dr. Aris Thorne',
            faction: 'RESEARCH',
            category: 'human',
            desc: 'Lead geneticist. Responsible for the initial outbreak. Currently in hiding.',
            stats: { mutation: 30, toxicity: 15, combat: 20 },
            color: '#b026ff'
        },
        {
            id: '004',
            name: 'Vera "Spore"',
            faction: 'WILDLANDS',
            category: 'mutant',
            desc: 'Symbiotic relationship with fungal growth. Can manipulate spores.',
            stats: { mutation: 98, toxicity: 90, combat: 75 },
            color: '#ff3333'
        },
        {
            id: '005',
            name: 'Jax "Wire"',
            faction: 'CORP-SEC',
            category: 'cyborg',
            desc: 'Undercover operative. Neural link allows direct hacking of legacy systems.',
            stats: { mutation: 15, toxicity: 10, combat: 80 },
            color: '#33ff33'
        },
        {
            id: '006',
            name: 'Subject Zero',
            faction: 'UNKNOWN',
            category: 'mutant',
            desc: 'Origin point of the bio-plague. Highly unstable. Do not approach.',
            stats: { mutation: 100, toxicity: 100, combat: 99 },
            color: '#ff00ff'
        }
    ];

    // --- DOM ELEMENTS ---
    const grid = document.getElementById('character-grid');
    const navItems = document.querySelectorAll('.nav-item');
    const clockEl = document.getElementById('clock');
    const titleEl = document.querySelector('.section-header h1');

    // --- UTILITIES ---

    // Random integer generator
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    // Glitch text effect function
    const glitchText = (element, originalText) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let iterations = 0;
        const maxIterations = originalText.length;
        
        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= maxIterations) {
                clearInterval(interval);
                element.innerText = originalText; // Ensure final text is clean
            }
            iterations += 1 / 2; // Speed of decode
        }, 30);
    };

    // Helper for stat bar colors
    const getStatColor = (val) => {
        if (val < 30) return '#33ff33'; // Green
        if (val < 70) return '#ffcc00'; // Yellow
        return '#ff3333'; // Red
    };

    // --- CORE FUNCTIONS ---

    // 1. Render Characters
    const renderCharacters = (filterType) => {
        if (!grid) return;
        grid.innerHTML = ''; // Clear current grid

        const filtered = filterType === 'all' 
            ? characters 
            : characters.filter(char => char.category === filterType);

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="panel"><p>> NO DATA FOUND IN SECTOR.</p></div>';
            return;
        }

        filtered.forEach((char, index) => {
            // Create Card Container
            const card = document.createElement('article');
            card.className = 'char-card';
            card.dataset.id = char.id;
            
            // Stagger animation delay
            card.style.animationDelay = `${index * 100}ms`;

            // Card Content Template
            card.innerHTML = `
                <div class="card-image-frame">
                    <div class="img-placeholder">
                        <span class="placeholder-text">[IMG_MISSING]</span>
                    </div>
                    <div class="card-overlay"></div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h2 class="char-name" style="color: ${char.color}">${char.name}</h2>
                        <span class="faction-tag faction-${char.faction.toLowerCase()}">${char.faction}</span>
                    </div>
                    <p class="char-desc">${char.desc}</p>
                    <div class="stats-container">
                        <div class="stat-bar-group">
                            <label>MUTATION</label>
                            <div class="bar-bg"><div class="bar-fill" style="--width: ${char.stats.mutation}%; background-color: ${getStatColor(char.stats.mutation)}"></div></div>
                        </div>
                        <div class="stat-bar-group">
                            <label>TOXICITY</label>
                            <div class="bar-bg"><div class="bar-fill" style="--width: ${char.stats.toxicity}%; background-color: ${getStatColor(char.stats.toxicity)}"></div></div>
                        </div>
                        <div class="stat-bar-group">
                            <label>COMBAT</label>
                            <div class="bar-bg"><div class="bar-fill" style="--width: ${char.stats.combat}%; background-color: ${getStatColor(char.stats.combat)}"></div></div>
                        </div>
                    </div>
                </div>
            `;

            // Add hover glitch effect
            const nameEl = card.querySelector('.char-name');
            card.addEventListener('mouseenter', () => {
                if(nameEl) glitchText(nameEl, char.name);
            });

            grid.appendChild(card);
        });
    };

    // 2. System Clock
    const updateClock = () => {
        if (!clockEl) return;
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', { hour12: false });
        const ms = String(now.getMilliseconds()).slice(0, 2).padEnd(2, '0');
        clockEl.innerText = `${timeString}:${ms}`;
    };

    // 3. Boot Sequence Simulation
    const bootSequence = async () => {
        if (!grid || !titleEl) return;

        const lines = [
            "> INITIALIZING BIOS...",
            "> LOADING KERNEL...",
            "> CONNECTING TO NEURAL NET...",
            "> DECRYPTING USER DATA...",
            "> ACCESS GRANTED."
        ];
        
        const originalTitle = titleEl.innerText;
        titleEl.innerText = ""; // Clear title for effect
        
        let delay = 0;

        lines.forEach((line, i) => {
            setTimeout(() => {
                const p = document.createElement('div');
                p.innerText = line;
                p.style.fontFamily = "'VT323', monospace";
                p.style.color = "var(--primary-green)";
                p.style.marginBottom = "5px";
                p.style.fontSize = "1.2rem";
                // Insert before grid content
                grid.insertBefore(p, grid.firstChild);
            }, delay);
            delay += 300;
        });

        setTimeout(() => {
            // Clear boot logs
            const logs = grid.querySelectorAll('div');
            logs.forEach(div => {
                if(div.style.fontFamily.includes('VT323') && div.classList.contains('placeholder-text') === false) {
                    // Simple check to avoid removing actual content if logic overlaps
                    if(div.innerText.includes('>')) div.remove();
                }
            });
            
            // Restore title and render
            titleEl.innerText = originalTitle;
            renderCharacters(state.filter);
            state.booting = false;
        }, delay + 500);
    };

    // --- EVENT LISTENERS ---

    // Navigation Filtering
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (state.booting) return; // Prevent clicks during boot

            // Update Active State
            navItems.forEach(nav => nav.classList.remove('active'));
            e.target.classList.add('active');

            // Filter Logic
            state.filter = e.target.dataset.filter;
            renderCharacters(state.filter);

            // Audio cue visual (flash border)
            document.body.style.borderColor = 'var(--warning-yellow)';
            setTimeout(() => {
                document.body.style.borderColor = 'transparent';
            }, 100);
        });
    });

    // --- INITIALIZATION ---
    setInterval(updateClock, 50); // Start clock
    bootSequence(); // Start boot animation
});