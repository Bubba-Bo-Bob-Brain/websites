/**
 * ATLAS OF THE FORGOTTEN EPOCHS - LOGIC
 * Handles interactivity, data rendering, and timeline state management.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Data ---
    const eras = [
        { id: 0, name: "Age of Myth", year: "-3000" },
        { id: 1, name: "Age of Ash", year: "-1500" },
        { id: 2, name: "Age of Iron", year: "-500" }
    ];

    const regionsData = {
        obsidian: {
            title: "The Obsidian Spire",
            epoch: "Age of Myth",
            race: "Star-Weavers",
            resources: "Void Crystal, Aether",
            desc: "A monolithic tower of black glass that pierces the clouds. Legend says it was built not by hands, but by singing the mountains into shape. It is the seat of the Star-Weavers, who charted the first trade routes through the stars.",
            quote: "The shadows here do not hide; they reveal.",
            icon: "🏛️",
            color: "var(--color-obsidian)"
        },
        gardens: {
            title: "The Sunken Gardens",
            epoch: "Age of Ash",
            race: "Hydro-Kinetics",
            resources: "Pearls, Water Lilies",
            desc: "Once a lush paradise, now submerged beneath a shallow inland sea. The Hydro-Kinetics maintain the delicate ecosystem, harvesting pearls that glow with the light of the moon. Trade routes here are navigated by silent skiffs.",
            quote: "Beneath the waves, the city still breathes.",
            icon: "🌿",
            color: "var(--color-teal)"
        },
        iron: {
            title: "The Iron Wastes",
            epoch: "Age of Iron",
            race: "Gear-Smiths",
            resources: "Iron, Coal, Steam",
            desc: "A scarred landscape of industrial ruins and active foundries. The Gear-Smiths have turned the land into a machine, extracting resources with brutal efficiency. Smoke chokes the sky, but the trade of steel here is unmatched.",
            quote: "Progress is a fire that consumes the past.",
            icon: "⚙️",
            color: "var(--color-rust)"
        }
    };

    // --- DOM Elements ---
    const slider = document.getElementById('era-slider');
    const eraMarkers = document.querySelectorAll('.marker');
    const currentEraNameDisplay = document.getElementById('current-era-name');
    const codexModal = document.getElementById('codex-modal');
    const closeCodexBtn = document.querySelector('.close-codex');
    const regionGroups = document.querySelectorAll('.region-group');
    
    // Codex Content Elements
    const codexTitle = document.getElementById('codex-title');
    const codexEpoch = document.getElementById('codex-epoch');
    const codexDesc = document.getElementById('codex-desc');
    const codexRace = document.getElementById('codex-race');
    const codexRes = document.getElementById('codex-res');
    const codexQuote = document.getElementById('codex-quote');
    const codexIcon = document.getElementById('codex-icon');

    // --- State Management ---
    let currentEraIndex = 0;

    // --- Functions ---

    /**
     * Updates the visual state of the timeline and map based on the selected era.
     */
    function updateTimelineState(index) {
        currentEraIndex = index;
        const era = eras[index];

        // Update Header
        currentEraNameNameDisplay = era.name;
        currentEraNameDisplay.textContent = era.name;

        // Update Slider Markers
        eraMarkers.forEach((marker, i) => {
            if (i === index) {
                marker.classList.add('active');
                marker.style.opacity = '1';
            } else {
                marker.classList.remove('active');
                marker.style.opacity = '0.5';
            }
        });

        // Update Map Visibility (Filter logic)
        regionGroups.forEach(group => {
            const regionId = group.getAttribute('data-id');
            const regionEra = regionsData[regionId].epoch;
            
            // Simple logic: If the region's era matches or is 'all', show it.
            // In a real app, we might check if the era is >= region start era.
            let isVisible = false;
            
            if (regionEra === 'all') {
                isVisible = true;
            } else if (regionEra === era.name) {
                isVisible = true;
            }

            if (isVisible) {
                group.style.opacity = '1';
                group.style.transform = 'scale(1)';
                group.style.filter = 'none';
            } else {
                group.style.opacity = '0.3';
                group.style.transform = 'scale(0.95)';
                group.style.filter = 'grayscale(100%)';
            }
        });
    }

    /**
     * Opens the Codex modal with specific region data.
     */
    function openCodex(regionId) {
        const data = regionsData[regionId];
        if (!data) return;

        codexTitle.textContent = data.title;
        codexEpoch.textContent = data.epoch;
        codexDesc.textContent = data.desc;
        codexRace.textContent = data.race;
        codexRes.textContent = data.resources;
        codexQuote.textContent = data.quote;
        codexIcon.textContent = data.icon;

        // Dynamic styling based on region color
        codexIcon.style.color = data.color;
        codexIcon.style.textShadow = `0 0 10px ${data.color}`;

        codexModal.classList.add('active');
    }

    /**
     * Closes the Codex modal.
     */
    function closeCodex() {
        codexModal.classList.remove('active');
    }

    // --- Event Listeners ---

    // Slider Interaction
    slider.addEventListener('input', (e) => {
        updateTimelineState(parseInt(e.target.value));
    });

    // Region Click Interaction
    regionGroups.forEach(group => {
        group.addEventListener('click', () => {
            const id = group.getAttribute('data-id');
            openCodex(id);
        });
        
        // Add a subtle tilt effect on hover
        group.addEventListener('mousemove', (e) => {
            const rect = group.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Could add complex 3D tilt logic here, keeping it simple for now
        });
    });

    // Modal Close Interaction
    closeCodexBtn.addEventListener('click', closeCodex);
    codexModal.addEventListener('click', (e) => {
        if (e.target === codexModal) closeCodex();
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCodex();
    });

    // --- Initialization ---
    updateTimelineState(0);

    // Custom Cursor Effect (Optional Polish)
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.border = '2px solid var(--color-gold)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.2s, height 0.2s, background-color 0.2s';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.width = '15px';
        cursor.style.height = '15px';
        cursor.style.backgroundColor = 'rgba(212, 175, 55, 0.5)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'transparent';
    });

    console.log("Atlas Initialized. Welcome, Cartographer.");
});