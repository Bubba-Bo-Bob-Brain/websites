/**
 * CHIMERA ARCHIVE - Core Logic
 * Handling system initialization, character data mapping, and UI interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Character Database ---
    const CHARACTER_DATA = {
        "1": {
            name: "Kaelith Void-Lung",
            id: "BIO-772-K",
            mutation: 78,
            contamination: "CRITICAL",
            description: "A former atmospheric engineer who survived the Great Spore Fall by merging her respiratory system with a sentient fungal colony. She can filter toxins from the air but must remain in damp environments to survive.",
            skills: { "Toxin Resistance": 90, "Organic Mimicry": 30, "Neural Grafting": 50 }
        },
        "2": {
            name: "Splicer-7",
            id: "CYB-104-S",
            mutation: 42,
            contamination: "STABLE",
            description: "A product of the Chrome-Husk assembly lines. Splicer-7 replaces biological failure with synthetic precision. His obsession with 'perfecting' the human form has led to several illegal augmentations.",
            skills: { "Toxin Resistance": 40, "Organic Mimicry": 10, "Neural Grafting": 95 }
        },
        "3": {
            name: "Elder Moss",
            id: "BIO-001-M",
            mutation: 95,
            contamination: "OVERLOAD",
            description: "One of the First-Awakened. Elder Moss is more forest than man, acting as a living hub for the Mycelium network. His consciousness is distributed across several square miles of underground roots.",
            skills: { "Toxin Resistance": 100, "Organic Mimicry": 85, "Neural Grafting": 20 }
        },
        "4": {
            name: "Nyx Osmosis",
            id: "BIO-449-N",
            mutation: 61,
            contamination: "STABLE",
            description: "A stealth operative specializing in biological infiltration. Nyx can alter her skin pigment and pheromone output to blend into any organic environment, making her the ultimate assassin.",
            skills: { "Toxin Resistance": 60, "Organic Mimicry": 95, "Neural Grafting": 40 }
        }
    };

    // --- DOM Elements ---
    const bootScreen = document.getElementById('boot-screen');
    const characterCards = document.querySelectorAll('.char-card');
    const bioScanner = document.getElementById('bio-scanner');
    const closeScanner = document.querySelector('.close-scanner');
    
    const scannerName = document.getElementById('scanner-name');
    const scannerId = document.querySelector('.scanner-id');
    const scannerDesc = document.getElementById('char-description');
    const mutationGauge = document.getElementById('mutation-gauge');
    const mutationValue = document.getElementById('mutation-value');
    const skillList = document.querySelector('.skill-list');

    // --- System Initialization ---
    const initializeSystem = () => {
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.style.display = 'none';
            }, 1000);
        }, 2500); // Matches the CSS animation timing of the boot progress bar
    };

    // --- Bio-Scanner Logic ---
    const openScanner = (charId) => {
        const data = CHARACTER_DATA[charId];
        if (!data) return;

        // Trigger a brief "glitch" effect on the whole body
        document.body.classList.add('glitch-hit');
        setTimeout(() => document.body.classList.remove('glitch-hit'), 150);

        // Populate Data
        scannerName.innerText = data.name;
        scannerId.innerText = `ID: ${data.id}`;
        scannerDesc.innerText = data.description;
        
        // Animate Mutation Gauge
        mutationValue.innerText = `${data.mutation}%`;
        mutationGauge.style.width = '0%';
        setTimeout(() => {
            mutationGauge.style.width = `${data.mutation}%`;
        }, 100);

        // Populate Skills
        skillList.innerHTML = '';
        Object.entries(data.skills).forEach(([skill, value]) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${skill}</span>
                <div class="skill-bar"><div class="fill" style="width: ${value}%"></div></div>
            `;
            skillList.appendChild(li);
        });

        // Slide in panel
        bioScanner.classList.add('active');
    };

    const closeScannerPanel = () => {
        bioScanner.classList.remove('active');
    };

    // --- Event Listeners ---
    characterCards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            openScanner(id);
        });
    });

    closeScanner.addEventListener('click', closeScannerPanel);

    // Close scanner when clicking outside the panel
    window.addEventListener('click', (e) => {
        if (e.target === bioScanner) {
            closeScannerPanel();
        }
    });

    // --- Interactive Background Effects ---
    // Add a subtle parallax movement to the bio-veins based on mouse position
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const veins = document.querySelector('.bio-veins');
        
        veins.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    });

    // Initialize
    initializeSystem();
});

/**
 * Additional aesthetic helper: Randomly trigger small UI flickers 
 * to simulate a dying terminal.
 */
setInterval(() => {
    const elements = document.querySelectorAll('.status-pulse, .faction-tag');
    const target = elements[Math.floor(Math.random() * elements.length)];
    target.style.opacity = '0.3';
    setTimeout(() => target.style.opacity = '1', 50);
}, 3000);