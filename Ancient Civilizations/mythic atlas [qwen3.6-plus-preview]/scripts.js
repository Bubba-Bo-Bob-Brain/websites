/**
 * AETHORIA — Atlas of the Ancient World
 * Interactive Logic & Animation
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        currentEra: 0,
        selectedRegion: null,
        selectedMyth: null,
        isPanelOpen: false,
        caravanPositions: {}
    };

    // --- DOM Elements ---
    const elements = {
        loadingScreen: document.getElementById('loadingScreen'),
        loadingBarFill: document.getElementById('loadingBarFill'),
        eraName: document.getElementById('eraName'),
        eraYear: document.getElementById('eraYear'),
        timelineSlider: document.getElementById('timelineSlider'),
        timelineProgress: document.getElementById('timelineProgress'),
        eraMarkers: document.querySelectorAll('.era-marker'),
        regions: document.querySelectorAll('.region'),
        mythMarkers: document.querySelectorAll('.myth-marker'),
        lorePanel: document.getElementById('lorePanel'),
        loreContent: document.getElementById('loreContent'),
        loreClose: document.getElementById('loreClose'),
        mythPanel: document.getElementById('mythPanel'),
        mythContent: document.getElementById('mythContent'),
        mythClose: document.getElementById('mythClose'),
        starField: document.getElementById('starField'),
        legendItems: document.querySelectorAll('.legend-item'),
        tradeRoutes: document.querySelectorAll('.trade-route')
    };

    // --- Lore Data ---
    const worldData = {
        regions: {
            valdrheim: {
                name: "Valdrheim",
                eras: [
                    {
                        eraName: "The Dawn of Empires",
                        epithet: "The United Clans of the North",
                        description: "In this golden age, the frost-hardened clans of Valdrheim stand united under the Jarl-King. The great forges of Draugrheim burn day and night, crafting weapons of star-metal that are traded across the known world. The mountain passes are safe, guarded by the stone sentinels.",
                        stats: { power: 85, population: "High", trade: "Star-Metal", capital: "Ironhold" }
                    },
                    {
                        eraName: "Age of Strife",
                        epithet: "The Fractured Peaks",
                        description: "The death of Jarl-King Hrothgar shattered the unity. Three warlords now vie for the Iron Throne. The northern passes are blocked by snow and siege. The great forges have cooled, and the star-metal trade has dried up. Only the Dragon of Draugrheim remains unchanged.",
                        stats: { power: 60, population: "Medium", trade: "Scarcity", capital: "Ruins of Ironhold" }
                    },
                    {
                        eraName: "The Sundering",
                        epithet: "The Shattered Holds",
                        description: "The Great Quake split the northern mountains. Many holds fell into the abyss. The survivors have retreated to isolated fortresses, turning inward and xenophobic. Whispers speak of something waking deep beneath the peaks.",
                        stats: { power: 30, population: "Low", trade: "None", capital: "High Crag" }
                    },
                    {
                        eraName: "Rebirth",
                        epithet: "The Federation of Frost",
                        description: "From the ashes of the old holds, a new council has formed. The Federation of Frost prioritizes rebuilding and reopening trade routes. They seek allies in the south to help restore the great forges. The Dragon sleeps once more.",
                        stats: { power: 70, population: "Growing", trade: "Furs & Iron", capital: "New Ironhold" }
                    }
                ]
            },
            khemetara: {
                name: "Khemetara",
                eras: [
                    {
                        eraName: "The Dawn of Empires",
                        epithet: "The Golden Dynasty",
                        description: "The Pharaoh-Architects rule from the Sun-Throne. The Great Canal connects the river to the sea, bringing wealth from all corners. The Sphinx guards the entrance to the Underworld, where the secrets of immortality are whispered.",
                        stats: { power: 95, population: "Very High", trade: "Grain & Gold", capital: "Ozymandias" }
                    },
                    {
                        eraName: "Age of Strife",
                        epithet: "The Withering",
                        description: "A magical blight dries the great river. Crops fail, and the people starve. The Pharaoh's priests cannot stop the decay. Rebellions spark in the delta. The Sphinx turns its gaze away in shame.",
                        stats: { power: 50, population: "Plagued", trade: "Desperate", capital: "Falling Ozymandias" }
                    },
                    {
                        eraName: "The Sundering",
                        epithet: "The Sands of Silence",
                        description: "The empire has collapsed entirely. Nomadic tribes wander the dunes, picking at the bones of the ancient cities. The Sphinx is half-buried in sand. The Underworld is sealed, and its guardians are restless.",
                        stats: { power: 10, population: "Nomadic", trade: "Relics", capital: "None" }
                    },
                    {
                        eraName: "Rebirth",
                        epithet: "The Restored Kingdom",
                        description: "The River returns, bursting its banks with renewed life. A new dynasty rises from the delta, claiming descent from the old gods. They begin excavating the ancient ruins, seeking to reclaim lost magic.",
                        stats: { power: 75, population: "Recovering", trade: "Spices & Papyrus", capital: "New Ozymandias" }
                    }
                ]
            },
            oakhaven: {
                name: "Oakhaven",
                eras: [
                    {
                        eraName: "The Dawn of Empires",
                        epithet: "The Verdant Sanctuary",
                        description: "The Druids of the Root maintain the balance between the mortal realm and the Feywild. The forest is thick and impenetrable to outsiders. The World Tree, Yggdra, pulses with ancient magic.",
                        stats: { power: 70, population: "Scattered", trade: "Herbs & Amber", capital: "Yggdra's Root" }
                    },
                    {
                        eraName: "Age of Strife",
                        epithet: "The Blightwood",
                        description: "Shadow-rot creeps from the Whispering Wastes, infecting the ancient oaks. The Druids fight a losing battle. Some trees turn malevolent, attacking travelers. The World Tree's leaves are turning black.",
                        stats: { power: 40, population: "Fleeing", trade: "Dangerous", capital: "Blighted Root" }
                    },
                    {
                        eraName: "The Sundering",
                        epithet: "The Silent Woods",
                        description: "The forest has gone silent. The magic is dormant. The trees stand like stone statues. The few remaining inhabitants are mute, having lost their voices to the silence. Yggdra sleeps.",
                        stats: { power: 20, population: "Minimal", trade: "None", capital: "Silent Root" }
                    },
                    {
                        eraName: "Rebirth",
                        epithet: "The Sprouting",
                        description: "New saplings burst from the grey earth. The World Tree sheds its bark of stone and blooms with silver flowers. The Druids return from their slumber, their eyes glowing with renewed power.",
                        stats: { power: 80, population: "Thriving", trade: "Rare Woods", capital: "Silver Root" }
                    }
                ]
            },
            zhongara: {
                name: "Zhongara",
                eras: [
                    {
                        eraName: "The Dawn of Empires",
                        epithet: "The Celestial Empire",
                        description: "The Dragon-Emperor rules with the Mandate of Heaven. Scholars and engineers build wonders: the Floating Gardens, the Bridge of Clouds. Trade flourishes along the Iron Road to Valdrheim.",
                        stats: { power: 90, population: "Dense", trade: "Silk & Jade", capital: "Heaven's Gate" }
                    },
                    {
                        eraName: "Age of Strife",
                        epithet: "The Warring Provinces",
                        description: "The Mandate is broken. Generals declare themselves emperors. The Floating Gardens wither. The Bridge of Clouds is cut. War ravages the plains, and the great libraries burn.",
                        stats: { power: 65, population: "War-torn", trade: "Arms", capital: "Contested" }
                    },
                    {
                        eraName: "The Sundering",
                        epithet: "The Dust Bowl",
                        description: "Magical storms strip the topsoil from the plains. The empire is a memory. Warlords rule from mud forts. The people eke out a meager existence. The sky is perpetually grey.",
                        stats: { power: 25, population: "Scattered", trade: "Salt", capital: "Dust Fort" }
                    },
                    {
                        eraName: "Rebirth",
                        epithet: "The Harmonious Republic",
                        description: "A coalition of farmers and scholars overthrows the warlords. They establish a republic based on the ancient principles of balance. They begin terraforming the plains back to fertility.",
                        stats: { power: 75, population: "Stable", trade: "Grain", capital: "Harmony" }
                    }
                ]
            },
            sundarava: {
                name: "Sundarava",
                eras: [
                    {
                        eraName: "The Dawn of Empires",
                        epithet: "The Pearl Archipelago",
                        description: "A maritime thalassocracy ruled by the Pearl Kings. Their ships dominate the eastern seas. They control the Jade Sea Route and trade exotic spices and pearls.",
                        stats: { power: 80, population: "Island-based", trade: "Pearls & Spices", capital: "Pearl Throne" }
                    },
                    {
                        eraName: "Age of Strife",
                        epithet: "The Pirate Wars",
                        description: "The Pearl Kings lose control. Pirate captains seize the islands. Naval battles rage daily. The trade routes are perilous. The Leviathan is summoned by desperate warlocks.",
                        stats: { power: 50, population: "Chaotic", trade: "Plunder", capital: "Pirate Haven" }
                    },
                    {
                        eraName: "The Sundering",
                        epithet: "The Drowned Isles",
                        description: "Rising sea levels swallow the lower islands. The population is decimated. The survivors cling to the highest peaks. The ocean is ruled by sea monsters.",
                        stats: { power: 15, population: "Critical", trade: "None", capital: "High Peak" }
                    },
                    {
                        eraName: "Rebirth",
                        epithet: "The Coral Federation",
                        description: "The survivors adapt. They build floating cities of coral and woven reed. They tame the sea monsters. A new maritime culture emerges, more resilient than before.",
                        stats: { power: 65, population: "Maritime", trade: "Coral & Fish", capital: "Coral City" }
                    }
                ]
            },
            shatteredIsles: {
                name: "Shattered Isles",
                eras: [
                    {
                        eraName: "The Dawn of Empires",
                        epithet: "The Fire Forges",
                        description: "Volcanic islands rich in obsidian and sulfur. The Fire-Smiths craft weapons of unparalleled sharpness. They trade with Khemetara for grain, as nothing grows here.",
                        stats: { power: 60, population: "Low", trade: "Obsidian", capital: "Forge City" }
                    },
                    {
                        eraName: "Age of Strife",
                        epithet: "The Eruption",
                        description: "All volcanoes erupt simultaneously. Ash clouds block the sun for years. The Fire-Smiths perish. The islands are reshaped. The Obsidian Route is cut.",
                        stats: { power: 10, population: "Extinct?", trade: "None", capital: "Ash Waste" }
                    },
                    {
                        eraName: "The Sundering",
                        epithet: "The Cinder Wastes",
                        description: "The islands are cooling. Strange, heat-resistant flora begins to grow. Explorers find ruins of the old forges, guarded by fire elementals.",
                        stats: { power: 20, population: "Explorers", trade: "Elemental Cores", capital: "Camp Ash" }
                    },
                    {
                        eraName: "Rebirth",
                        epithet: "The Phoenix Cradle",
                        description: "The Phoenix rises from the central caldera. The islands bloom with fire-flowers. A new cult worships the Phoenix. They forge weapons infused with living flame.",
                        stats: { power: 55, population: "Cultists", trade: "Fire Weapons", capital: "Phoenix Nest" }
                    }
                ]
            },
            "whispering-wastes": {
                name: "Whispering Wastes",
                eras: [
                    {
                        eraName: "The Dawn of Empires",
                        epithet: "The Forbidden Zone",
                        description: "Even in this age of peace, the Wastes are feared. Ancient runes warn of the Void. No one enters and returns sane. The borders are warded by all civilized nations.",
                        stats: { power: "Unknown", population: "None", trade: "Forbidden", capital: "N/A" }
                    },
                    {
                        eraName: "Age of Strife",
                        epithet: "The Expansion",
                        description: "The Wastes expand. The whispers can be heard at the borders of Zhongara and Khemetara. Madness spreads. Armies sent to investigate dissolve into mist.",
                        stats: { power: "Growing", population: "Corrupted", trade: "Madness", capital: "The Void" }
                    },
                    {
                        eraName: "The Sundering",
                        epithet: "The Dominance",
                        description: "The Wastes cover half the continent. The Void leaks into reality. Shadows move independently. The remaining civilizations huddle in magical barriers.",
                        stats: { power: "Dominant", population: "Shadows", trade: "Souls", capital: "The Abyss" }
                    },
                    {
                        eraName: "Rebirth",
                        epithet: "The Containment",
                        description: "The great barrier is erected. The Wastes are pushed back. The whispers are silenced, but the barrier requires constant maintenance. A dark vigilance begins.",
                        stats: { power: "Contained", population: "Wardens", trade: "Barrier Crystals", capital: "Barrier Keep" }
                    }
                ]
            }
        },
        myths: {
            "dragon-valdrheim": {
                name: "Draugrheim Peak",
                type: "Ancient Dragon",
                icon: "🐉",
                lore: "The great dragon Ignis Draugr sleeps beneath the highest peak of Valdrheim. Legend says that when the dragon wakes, the mountains will shake and the forges will burn with eternal flame. The Jarl-Kings are said to be descendants of the dragon's human companions."
            },
            "sphinx-khemetara": {
                name: "The Eternal Sphinx",
                type: "Guardian Spirit",
                icon: "🦁",
                lore: "The Sphinx guards the entrance to the Hall of Records, where the secrets of creation are kept. It poses riddles to those who seek entry. Those who fail are turned to stone and added to its garden of statues."
            },
            "leviathan-east": {
                name: "Leviathan's Maw",
                type: "Sea Monster",
                icon: "🐋",
                lore: "A colossal sea serpent that dwells in the deepest trench of the eastern sea. It is said to be able to swallow entire ships whole. The sailors of Sundarava leave offerings of pearls to appease it."
            },
            "world-tree": {
                name: "Yggdra's Root",
                type: "World Tree",
                icon: "🌳",
                lore: "The World Tree connects the mortal realm to the heavens and the underworld. Its roots drink from the Well of Wisdom. The Druids tend to its roots, ensuring the balance of magic remains stable."
            },
            "phoenix-isles": {
                name: "Phoenix Caldera",
                type: "Immortal Beast",
                icon: "🔥",
                lore: "The Phoenix of Aethoria lives in the caldera of the central volcano. It dies and is reborn in cycles of fire. Its feathers grant the power of regeneration, making them the most sought-after relic in the world."
            },
            "whispering-void": {
                name: "The Whispering Void",
                type: "Eldritch Horror",
                icon: "👁",
                lore: "A tear in reality where the whispers of the outer gods can be heard. It drives mortals mad with forbidden knowledge. The Void hungers for souls and seeks to expand its influence over Aethoria."
            }
        }
    };

    // --- Initialization ---
    function init() {
        simulateLoading();
        generateStars();
        setupEventListeners();
        updateEra(0);
        animateCaravans();
    }

    // --- Loading Screen ---
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    elements.loadingScreen.classList.add('hidden');
                }, 500);
            }
            elements.loadingBarFill.style.width = `${progress}%`;
        }, 200);
    }

    // --- Star Field ---
    function generateStars() {
        const starCount = 150;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.opacity = Math.random();
            star.style.animationDelay = `${Math.random() * 5}s`;
            elements.starField.appendChild(star);
        }
        
        // Add CSS for stars dynamically
        const style = document.createElement('style');
        style.textContent = `
            .star {
                position: absolute;
                background: #fff;
                border-radius: 50%;
                animation: twinkleStar 4s infinite alternate;
            }
            @keyframes twinkleStar {
                0% { opacity: 0.2; transform: scale(0.8); }
                100% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }

    // --- Era Management ---
    function updateEra(eraIndex) {
        state.currentEra = eraIndex;
        elements.timelineSlider.value = eraIndex;
        elements.timelineProgress.style.width = `${(eraIndex / 3) * 100}%`;
        
        // Update markers
        elements.eraMarkers.forEach((marker, i) => {
            marker.classList.toggle('active', i === eraIndex);
        });

        // Update Era Display
        const eraNames = [
            "The Dawn of Empires",
            "Age of Strife",
            "The Sundering",
            "Rebirth"
        ];
        const eraYears = [
            "~ 1,200 AE",
            "~ 1,450 AE",
            "~ 1,800 AE",
            "~ 2,100 AE"
        ];
        elements.eraName.textContent = eraNames[eraIndex];
        elements.eraYear.textContent = eraYears[eraIndex];

        // Update Map Visuals based on Era
        updateMapVisuals(eraIndex);
        
        // Update active panel if open
        if (state.selectedRegion) {
            updateLorePanel(state.selectedRegion);
        }
    }

    function updateMapVisuals(eraIndex) {
        elements.regions.forEach(region => {
            const id = region.dataset.region;
            const data = worldData.regions[id];
            if (data) {
                // Update label text based on era epithet
                const label = region.parentElement.querySelector(`.region-label`);
                // Find the text node or specific text element
                // Since we structured SVG with <text> after <path>, we can use nextElementSibling
                // But safer to select by class if structure is complex.
                // In HTML, we have <text class="region-label">
                // We need to find the label associated with this region.
                // The path and text are siblings.
                let labelText = "";
                
                // Map region ID to label logic
                // This is a bit fragile if SVG structure changes, but works for now.
                // Better approach: Store label reference in data or select by proximity.
                
                // Simple heuristic: find next text element
                let labelEl = region.nextElementSibling;
                if (labelEl && labelEl.classList.contains('region-label')) {
                    // Keep base name, maybe add era suffix?
                    // Let's just keep it simple: Base name is constant, color changes.
                }
            }
        });

        // Update Trade Routes visibility based on era
        elements.tradeRoutes.forEach(route => {
            const routeId = route.dataset.route;
            let isActive = false;
            
            // Logic for route visibility per era
            switch(eraIndex) {
                case 0: // Dawn - All active
                    isActive = true; 
                    break;
                case 1: // Strife - Some broken
                    isActive = !['obsidian', 'jade-sea'].includes(routeId);
                    break;
                case 2: // Sundering - Most broken
                    isActive = ['amber'].includes(routeId); // Only Amber road remains?
                    break;
                case 3: // Rebirth - All restored
                    isActive = true;
                    break;
            }
            
            route.classList.toggle('active', isActive);
            route.style.opacity = isActive ? '0.8' : '0.2';
        });
    }

    // --- Lore Panel ---
    function openLorePanel(regionId) {
        state.selectedRegion = regionId;
        state.isPanelOpen = true;
        updateLorePanel(regionId);
        elements.lorePanel.classList.add('open');
        
        // Highlight region
        elements.regions.forEach(r => r.classList.remove('selected'));
        const region = document.getElementById(`region-${regionId}`);
        if (region) region.classList.add('selected');
    }

    function updateLorePanel(regionId) {
        const regionData = worldData.regions[regionId];
        if (!regionData) return;

        const eraData = regionData.eras[state.currentEra];
        
        const html = `
            <div class="lore-header">
                <h2 class="lore-title">${eraData.epithet}</h2>
                <p class="lore-epithet">${regionData.name} — ${eraData.eraName}</p>
            </div>
            <div class="lore-section">
                <p>${eraData.description}</p>
            </div>
            <div class="lore-stats">
                <div class="stat-box">
                    <span class="stat-label">Power</span>
                    <span class="stat-value">${eraData.stats.power}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Population</span>
                    <span class="stat-value">${eraData.stats.population}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Primary Trade</span>
                    <span class="stat-value">${eraData.stats.trade}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Capital</span>
                    <span class="stat-value">${eraData.stats.capital}</span>
                </div>
            </div>
            <div class="lore-section" style="margin-top: 20px;">
                <h4>📜 Chronicle</h4>
                <p>Scrolls found in the archives speak of the ${regionData.name.toLowerCase()} in this era as a time of ${state.currentEra === 0 ? 'prosperity and unity' : state.currentEra === 1 ? 'turmoil and bloodshed' : state.currentEra === 2 ? 'desolation and ruin' : 'hope and renewal'}. The ancient maps shift, borders redrawn by the hand of fate.</p>
            </div>
        `;
        
        elements.loreContent.innerHTML = html;
    }

    function closeLorePanel() {
        elements.lorePanel.classList.remove('open');
        state.isPanelOpen = false;
        state.selectedRegion = null;
        elements.regions.forEach(r => r.classList.remove('selected'));
    }

    // --- Myth Panel ---
    function openMythPanel(mythId) {
        state.selectedMyth = mythId;
        const mythData = worldData.myths[mythId];
        if (!mythData) return;

        const html = `
            <div class="myth-header">
                <span class="myth-icon">${mythData.icon}</span>
                <h2 class="myth-title">${mythData.name}</h2>
                <p class="myth-type">${mythData.type}</p>
            </div>
            <div class="myth-lore">
                ${mythData.lore}
            </div>
        `;
        
        elements.mythContent.innerHTML = html;
        elements.mythPanel.classList.add('open');
    }

    function closeMythPanel() {
        elements.mythPanel.classList.remove('open');
        state.selectedMyth = null;
    }

    // --- Trade Route Animation ---
    function animateCaravans() {
        // Create caravan dots for active routes
        elements.tradeRoutes.forEach(route => {
            const routeId = route.dataset.route;
            if (!state.caravanPositions[routeId]) {
                state.caravanPositions[routeId] = 0;
                
                // Create SVG circle for caravan
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', '4');
                circle.setAttribute('fill', '#e8c84a');
                circle.setAttribute('filter', 'url(#glow)');
                circle.classList.add('caravan-dot');
                route.parentNode.appendChild(circle);
                
                // Animate
                const length = route.getTotalLength();
                const speed = 0.5 + Math.random() * 0.5; // Vary speed slightly
                
                function moveCaravan() {
                    const dist = state.caravanPositions[routeId];
                    const point = route.getPointAtLength(dist);
                    
                    circle.setAttribute('cx', point.x);
                    circle.setAttribute('cy', point.y);
                    
                    // Move dot
                    state.caravanPositions[routeId] = (dist + speed) % length;
                    
                    // Check if route is active
                    if (route.classList.contains('active')) {
                        circle.style.opacity = '1';
                    } else {
                        circle.style.opacity = '0';
                    }
                    
                    requestAnimationFrame(moveCaravan);
                }
                moveCaravan();
            }
        });
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Timeline
        elements.timelineSlider.addEventListener('input', (e) => {
            updateEra(parseInt(e.target.value));
        });

        // Era markers click
        elements.eraMarkers.forEach(marker => {
            marker.addEventListener('click', () => {
                updateEra(parseInt(marker.dataset.era));
            });
        });

        // Region clicks
        elements.regions.forEach(region => {
            region.addEventListener('click', () => {
                openLorePanel(region.dataset.region);
            });
        });

        // Myth marker clicks
        elements.mythMarkers.forEach(marker => {
            marker.addEventListener('click', () => {
                openMythPanel(marker.dataset.myth);
            });
        });

        // Close buttons
        elements.loreClose.addEventListener('click', closeLorePanel);
        elements.mythClose.addEventListener('click', closeMythPanel);

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (state.isPanelOpen && 
                !elements.lorePanel.contains(e.target) && 
                !e.target.closest('.region')) {
                closeLorePanel();
            }
            if (!elements.mythPanel.contains(e.target) && 
                !e.target.closest('.myth-marker')) {
                closeMythPanel();
            }
        });

        // Legend items
        elements.legendItems.forEach(item => {
            item.addEventListener('click', () => {
                const regionId = item.dataset.legend;
                openLorePanel(regionId);
                
                // Scroll to map if on mobile
                document.querySelector('.map-container').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Compass Rose interaction
        const compass = document.getElementById('compassRose');
        let rotation = 0;
        compass.addEventListener('click', () => {
            rotation += 45;
            compass.style.transform = `rotate(${rotation}deg) scale(1.1)`;
            setTimeout(() => {
                compass.style.transform = `rotate(${rotation}deg) scale(1)`;
            }, 300);
        });
    }

    // Run initialization
    init();
});