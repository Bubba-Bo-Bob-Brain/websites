document.addEventListener('DOMContentLoaded', () => {
    
    // --- DATA STORE: The Archives of Aethelgard ---
    const atlasData = {
        peaks: {
            title: "The Iron Peaks",
            type: "Mountain Kingdom",
            desc: "A treacherous region of jagged spires and perpetual snow. The Iron Peaks are home to the Dwarven clans of Orin-Kar, who forge metals unknown to the outside world. The air here is thin, and the winds carry the whispers of ancient ancestors.",
            trade: "Exports: Star-steel, Cryo-gems, Heavy weaponry. Imports: Grain, Timber, Spices.",
            myth: "Legend says the mountains are the sleeping spine of a primordial titan, forbidden to wake lest the world shatter."
        },
        plains: {
            title: "The Obsidian Plains",
            type: "Nomadic Territory",
            desc: "A vast, glassy expanse formed by the cooling of the Great Fire. Mirages are common here, and travelers rely on the stars for navigation. It is a neutral ground where treaties are signed in blood.",
            trade: "Exports: Glass artifacts, Salt, Monster parts. Imports: Fresh water, Metal tools.",
            myth: "The glass surface is said to reflect not the present, but a possible future—if one stares long enough without blinking."
        },
        citadel: {
            title: "The Sunken Citadel",
            type: "Ruined Empire",
            desc: "Once the jewel of the coast, now half-submerged due to the Cataclysm. The upper towers serve as a marketplace for pirates and scholars alike, while the depths are guarded by Leviathans.",
            trade: "Exports: Ancient texts, Coral, Pearls. Imports: Salvage gear, preserved foods.",
            myth: "It is believed the city sank not by accident, but to hide a secret vault beneath the waves that holds the 'Heart of the Ocean'."
        },
        jungle: {
            title: "The Whispering Jungle",
            type: "Druidic Enclave",
            desc: "A bioluminescent forest where the flora possesses rudimentary consciousness. The paths shift at night. It is a place of healing for those pure of heart, and madness for those who are not.",
            trade: "Exports: Rare elixirs, Poison, Exotic woods. Imports: Books, Silver, Woven cloth.",
            myth: "The trees are actually the petrified bodies of the first dryads, holding the collective memory of the planet."
        }
    };

    const eraNames = ["Founding", "Expansion", "The Collapse", "Age of Mythos"];

    // --- DOM ELEMENTS ---
    const regions = document.querySelectorAll('.map-region');
    const infoPanel = document.getElementById('info-panel');
    const closePanelBtn = document.getElementById('close-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelType = document.getElementById('panel-type');
    const panelEra = document.getElementById('panel-era');
    const panelDesc = document.getElementById('panel-desc');
    const panelTrade = document.getElementById('panel-trade');
    const panelMyth = document.getElementById('panel-myth');
    
    const eraSlider = document.getElementById('era-slider');
    const eraDisplay = document.getElementById('era-display');
    
    const toggleRoutes = document.getElementById('toggle-routes');
    const toggleBorders = document.getElementById('toggle-borders');
    const toggleMythos = document.getElementById('toggle-mythos');
    const routesLayer = document.getElementById('trade-routes-layer');
    const regionsLayer = document.getElementById('regions-layer');
    const markersLayer = document.getElementById('markers-layer');

    const mapStage = document.querySelector('.map-stage');
    const mapContainer = document.querySelector('.map-container');

    // State variables for Panning
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let scale = 1;

    // --- INTERACTION LOGIC ---

    // 1. Region Selection
    regions.forEach(region => {
        region.addEventListener('click', (e) => {
            // Stop propagation to prevent map drag logic interference if clicking a region
            e.stopPropagation();
            
            const regionId = region.dataset.id;
            const currentEraIndex = parseInt(eraSlider.value) - 1;
            const data = atlasData[regionId];

            if (data) {
                populatePanel(data, currentEraIndex);
                infoPanel.classList.add('active');
                
                // Highlight selected region visually
                regions.forEach(r => r.style.opacity = '0.4');
                region.style.opacity = '1';
            }
        });
    });

    // Close Panel
    closePanelBtn.addEventListener('click', () => {
        infoPanel.classList.remove('active');
        // Reset region opacities
        regions.forEach(r => r.style.opacity = '1');
    });

    // 2. Timeline Slider
    eraSlider.addEventListener('input', (e) => {
        const index = parseInt(e.target.value) - 1;
        eraDisplay.textContent = eraNames[index];
        
        // Update the Era tag in the panel if it's open
        panelEra.textContent = eraNames[index];
        
        // Visual feedback: Map shifts slightly to simulate time change
        mapContainer.style.transition = "transform 0.5s ease";
        mapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${(Math.random() - 0.5)}deg)`;
        setTimeout(() => {
            mapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(0deg)`;
        }, 500);
    });

    // 3. Toggle Controls
    toggleRoutes.addEventListener('change', (e) => {
        routesLayer.style.opacity = e.target.checked ? '0.6' : '0';
        routesLayer.style.pointerEvents = e.target.checked ? 'none' : 'none'; // Keep pointer events none for routes
    });

    toggleBorders.addEventListener('change', (e) => {
        regionsLayer.style.strokeOpacity = e.target.checked ? '1' : '0';
    });

    toggleMythos.addEventListener('change', (e) => {
        if(e.target.checked) {
            document.body.classList.add('mythos-mode');
            // Add a glowing effect to the map
            mapContainer.style.filter = "drop-shadow(0 0 20px rgba(138, 43, 226, 0.4))";
            panelMyth.style.color = "#e040fb";
        } else {
            document.body.classList.remove('mythos-mode');
            mapContainer.style.filter = "none";
            panelMyth.style.color = ""; // Reset
        }
    });

    // 4. Map Panning (Drag to Move)
    mapStage.addEventListener('mousedown', (e) => {
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        mapStage.style.cursor = 'grabbing';
        mapContainer.style.transition = "none"; // Disable transition for instant drag response
    });

    window.addEventListener('mouseup', () => {
        isPanning = false;
        mapStage.style.cursor = 'grab';
        mapContainer.style.transition = "transform 0.1s ease-out"; // Re-enable slight smoothing
    });

    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        
        // Apply transform
        updateMapTransform();
    });

    // Simple Zoom with Wheel
    mapStage.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        scale += scaleAmount;
        // Clamp scale
        scale = Math.min(Math.max(0.5, scale), 3);
        updateMapTransform();
    });

    function updateMapTransform() {
        mapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // --- HELPER FUNCTIONS ---

    function populatePanel(data, eraIndex) {
        panelTitle.textContent = data.title;
        panelType.textContent = data.type;
        panelEra.textContent = eraNames[eraIndex];
        panelDesc.textContent = data.desc;
        panelTrade.textContent = data.trade;
        panelMyth.textContent = data.myth;
    }

    // Initialize state
    populatePanel(atlasData['peaks'], 0);

});