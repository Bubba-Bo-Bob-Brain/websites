// BIO-ARCHIVE: SECTOR 7 - LOGIC
// Handles data generation, rendering, filtering, and modal interactions

document.addEventListener('DOMContentLoaded', () => {
    // --- DATA GENERATION ---
    const factions = ['SYNTH', 'MUTANT', 'HUMAN', 'CYBERNETIC'];
    const names = [
        'K-9 "RUST"', 'VEX', 'GLITCH', 'SILICA', 'NEXUS', 'OXYGEN', 
        'CAULIFLOWER', 'BONE', 'STATIC', 'NEON', 'FLUX', 'CHROMA', 
        'VIRUS', 'PULSE', 'SIGNAL', 'VOID', 'ECHO', 'PRISM'
    ];
    
    // Generate 12 random subjects
    const subjects = Array.from({ length: 12 }, (_, i) => {
        const faction = factions[Math.floor(Math.random() * factions.length)];
        const name = names[Math.floor(Math.random() * names.length)] + (Math.random() > 0.5 ? '-' + Math.floor(Math.random() * 99) : '');
        
        return {
            id: `SUB-${1000 + i}`,
            name: name,
            faction: faction,
            mutation: Math.floor(Math.random() * 100),
            toxicity: Math.floor(Math.random() * 100),
            survival: Math.floor(Math.random() * 100),
            desc: generateBioData(faction)
        };
    });

    // Helper to generate random bio-text
    function generateBioData(faction) {
        const templates = [
            "Subject exhibits severe cellular degradation. Recommend immediate containment in Sector 4.",
            "Genetic sequence unstable. DNA strands show signs of synthetic integration.",
            "High radiation tolerance detected. Subject thrives in toxic environments.",
            "Cognitive functions impaired. Memory banks corrupted. Aggression levels critical.",
            "Organic components replaced by scrap metal. Survival instincts overridden by programming.",
            "Bio-luminescent properties detected. Glowing tissue indicates high toxicity."
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    // --- DOM ELEMENTS ---
    const grid = document.getElementById('character-grid');
    const clock = document.getElementById('clock');
    const navBtns = document.querySelectorAll('.nav-btn');
    const modal = document.getElementById('modal-overlay');
    const closeModal = document.querySelector('.close-modal');

    // --- CLOCK FUNCTIONALITY ---
    function updateClock() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- RENDER FUNCTION ---
    function renderSubjects(filter = 'all') {
        grid.innerHTML = ''; // Clear grid
        
        const filteredSubjects = filter === 'all' 
            ? subjects 
            : subjects.filter(sub => sub.faction === filter.toUpperCase());

        if (filteredSubjects.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 2rem;">NO DATA FOUND IN SECTOR</div>`;
            return;
        }

        filteredSubjects.forEach((sub, index) => {
            const card = document.createElement('div');
            card.className = 'char-card';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
            card.style.opacity = '0'; // Start hidden for animation

            // Determine color based on faction for the marker
            let markerColor = 'var(--text-dim)';
            if(sub.faction === 'SYNTH') markerColor = 'var(--primary-neon)';
            if(sub.faction === 'MUTANT') markerColor = 'var(--accent-alert)';
            if(sub.faction === 'CYBERNETIC') markerColor = 'var(--accent-bio)';

            card.innerHTML = `
                <div class="faction-marker" style="border-color: ${markerColor}; color: ${markerColor}">
                    ${sub.faction[0]}
                </div>
                <div class="char-header">
                    <span class="char-name">${sub.name}</span>
                    <span class="char-id">${sub.id}</span>
                </div>
                <div class="char-image-container">
                    <div class="char-placeholder"></div>
                </div>
                <div class="char-stats">
                    <div class="stat-item">
                        <span class="stat-label">MUTATION</span>
                        <span class="stat-value" style="color: ${getRiskColor(sub.mutation)}">${sub.mutation}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">TOXICITY</span>
                        <span class="stat-value" style="color: ${getRiskColor(sub.toxicity)}">${sub.toxicity}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">SURVIVAL</span>
                        <span class="stat-value">${sub.survival}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">STATUS</span>
                        <span class="stat-value" style="color: var(--accent-warn)">LOCKED</span>
                    </div>
                </div>
            `;

            // Add click event for modal
            card.addEventListener('click', () => openModal(sub));
            grid.appendChild(card);
        });
    }

    // Helper for color coding stats
    function getRiskColor(val) {
        if (val > 80) return 'var(--accent-alert)';
        if (val > 50) return 'var(--accent-warn)';
        return 'var(--primary-neon)';
    }

    // --- FILTER LOGIC ---
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            // Render
            renderSubjects(btn.dataset.filter);
        });
    });

    // --- MODAL LOGIC ---
    function openModal(subject) {
        // Populate Data
        document.getElementById('modal-name').textContent = subject.name;
        document.getElementById('modal-faction').textContent = subject.faction;
        document.getElementById('modal-desc').textContent = subject.desc;
        
        // Update Bars with animation
        const mutationBar = document.getElementById('modal-mutation');
        const toxicityBar = document.getElementById('modal-toxicity');
        const skillBar = document.getElementById('modal-skill');

        // Reset width to 0 to trigger animation
        mutationBar.style.width = '0%';
        toxicityBar.style.width = '0%';
        skillBar.style.width = '0%';

        // Set colors
        mutationBar.style.backgroundColor = getRiskColor(subject.mutation);
        toxicityBar.style.backgroundColor = getRiskColor(subject.toxicity);
        skillBar.style.backgroundColor = 'var(--primary-neon)';

        // Show Modal
        modal.classList.add('active');

        // Animate bars after a slight delay
        setTimeout(() => {
            mutationBar.style.width = `${subject.mutation}%`;
            toxicityBar.style.width = `${subject.toxicity}%`;
            skillBar.style.width = `${subject.survival}%`;
        }, 100);
    }

    function closeModalFunc() {
        modal.classList.remove('active');
    }

    closeModal.addEventListener('click', closeModalFunc);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalFunc();
        }
    });

    // --- INITIAL RENDER ---
    renderSubjects();

    // Add keyframes dynamically for the staggered animation
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleSheet);
});