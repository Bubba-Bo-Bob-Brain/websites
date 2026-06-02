/* =====================================================
THE SHATTERED REALM - Interactive Ancient Atlas
JavaScript
===================================================== */

(function() {
    'use strict';

    // -------------------- Data: Kingdom Information --------------------
    const kingdomData = {
        valdoria: {
            name: "Valdoria",
            era: "kings",
            fullName: "The Valdorian Empire",
            capital: "Crownhold",
            description: "A mighty northern empire that rose to dominance during the Age of Kings. Their iron legions conquered vast territories, and their scholars preserved ancient knowledge in the great libraries of Crownhold.",
            lore: "Legend speaks of the First King of Valdoria, who forged his crown from a fallen star. The Valdorians believe their bloodline descends from the gods themselves, granting them divine right to rule.",
            trade: "Rich in iron ore and fine steels, Valdoria's caravans travel far to exchange their metalwork for the silks of the East and spices of the South.",
            mythology: "The Valdorians worship the Eternal Flame, god of ambition and conquest. Their priests speak of a prophecy: 'When the flame dims, the shards shall fall.'",
            resources: ["Iron", "Steel", "Horses", "Ancient Manuscripts"],
            color: "#8b2942"
        },
        sunken: {
            name: "Sunken Realm",
            era: "gods",
            fullName: "The Sunken Kingdom of Naru",
            capital: "The Coral Throne",
            description: "In the Age of Gods, this coastal kingdom possessed magic so powerful they defied the sea itself. Their floating palaces were the envy of all nations—until the sea claimed its due.",
            lore: "The Court of Naru made a pact with the Ocean Leviathan, trading their immortality for wealth beyond measure. When they broke the pact, the sea swallowed their capital whole.",
            trade: "Once traded rare sea pearls and enchanted coral, now only ruins remain where divers seek the legendary Sea Glass of Naru.",
            mythology: "The Oracle's Mirror, a sacred pool in these ruins, still shows visions of possible futures to those brave enough to gaze upon it.",
            resources: ["Sea Glass", "Coral", "Pearls", "Lost Artifacts"],
            color: "#1e5f8a",
            defunct: true
        },
        ashenvale: {
            name: "Ashenvale",
            era: "all",
            fullName: "The Sultanate of Ashenvale",
            capital: "Mirage Citadel",
            description: "An ancient desert empire known for its impossible architecture and traders who navigate the endless dunes. Their silk roads connect East to West.",
            lore: "The founders of Ashenvale discovered an underground river beneath the desert, the Lifeblood of the Sands. They built their capital around this sacred spring.",
            trade: "Controls the vital cross-desert trade routes, trading spices, silks, and rare minerals from the eastern mountains.",
            mythology: "The Oracle's Pond near the capital is said to speak with the voice of the Desert Mother, revealing truths to those who bring offerings of water.",
            resources: ["Spices", "Silks", "Obsidian", "Date Wine"],
            color: "#8b4513"
        },
        myrkwood: {
            name: "Myrkwood",
            era: "all",
            fullName: "The Realm of Myrkwood",
            capital: "Elderhollow",
            description: "A mysterious forest kingdom where the trees themselves hold ancient memories. The inhabitants are guardians of forgotten lore and keepers of the old ways.",
            lore: "The Sacred Grove of Yggdrasil's Whisper is said to be a physical manifestation of the world-tree itself. Those who sleep beneath its boughs dream of past and future.",
            trade: "Exports rare herbs, enchanted wood, and the wisdom of the elders. Their paths shift, leading travelers to where they need to be.",
            mythology: "The forest spirits, the Weaver's Children, protect Myrkwood from those who would exploit its secrets. They say the trees remember everything.",
            resources: ["Healing Herbs", "Enchanted Wood", "Ancient Wisdom", "Mystic Berries"],
            color: "#2d5a3d"
        },
        pelagoris: {
            name: "Pelagoris",
            era: "kings",
            fullName: "The Pelagorian Dominion",
            capital: "Tidecaller's Spire",
            description: "A powerful southern empire that dominated the seas during the Age of Kings. Their navy was unmatched, and their merchant fleets spanned the known world.",
            lore: "The Tidecallers of Pelagoris could command the waves themselves, summoning storms or calming waters. Their power came from the Sea Crystal, now lost.",
            trade: "Masters of maritime trade, Pelagoris's ships carry goods between all nations. Their ports are neutral ground for warring factions.",
            mythology: "The Moon Weaver blessed the Tidecallers, teaching them to speak with the creatures of the deep. Some say merfolk still serve the true heirs.",
            resources: ["Shipbuilding Materials", "Sea Salt", "Coral", "Naval Charts"],
            color: "#4a3d8a",
            defunct: true
        },
        threshold: {
            name: "Threshold",
            era: "all",
            fullName: "The Threshold Isles",
            capital: "Port Nexus",
            description: "A chain of mystical islands in the eastern sea, said to lie between the mortal world and realms beyond. Traders and seekers alike are drawn here.",
            lore: "The Portal of the Threshold is an ancient gateway that appears only when the moons align. Those who pass through are said to be transformed—or lost forever.",
            trade: "A neutral trading hub where goods from all corners of the world can be found. Many come seeking passage through the Portal.",
            mythology: "The isles are home to those who seek escape from their fate. Time moves strangely here; some age while others remain unchanged.",
            resources: ["Exotic Goods", "Arcane Items", "Passage to Beyond", "Rare Sea Creatures"],
            color: "#5a8a6a"
        },
        obsidian: {
            name: "Obsidian Peaks",
            era: "shattered",
            fullName: "The Obsidian Dominion",
            capital: "Blackspire",
            description: "A harsh mountain realm that rose from the ashes of fallen empires in the Shattered Era. Their warriors are forged in fire and shaped by cold.",
            lore: "The dwarven ancestors of Blackspire discovered veins of magical obsidian that glows with inner fire. This 'Dragon Glass' is both weapon and treasure.",
            trade: "Exports weapons of Dragon Glass and precious ores. Their mountain passes are the only safe routes through the northern ranges now.",
            mythology: "They worship the dormant volcano spirit, sleeping beneath Blackspire. Legends say when it wakes, a new age will begin.",
            resources: ["Dragon Glass", "Iron", "Gems", "Ancient Relics"],
            color: "#3d3d3d"
        },
        broken: {
            name: "Broken Coast",
            era: "shattered",
            fullName: "The Broken Kingdoms",
            capital: "Ruinhaven",
            description: "What was once a prosperous coastal region now lies fragmented into warring fiefdoms, remnants of the great Pelagorian Dominion.",
            lore: "After the Fall of Pelagoris, the noble houses fought over the scraps. Now only ruins remain of their former glory, haunted by the ghosts of empire.",
            trade: "Desperate traders risk the broken waters for the treasures hidden in the drowned palaces. Pirate coves have sprung up in hidden coves.",
            mythology: "The ghosts of Tidecallers are said to wander the ruins, unable to find peace until the Sea Crystal is restored.",
            resources: ["Salvage", "Pirate Gold", "Lost Artifacts", "Smuggled Goods"],
            color: "#6b4423"
        }
    };

    // Trade route data
    const tradeRoutes = {
        north: {
            name: "The Golden Road",
            type: "land",
            description: "The most prestigious trade route, connecting the northern kingdoms to the eastern markets. Caravan trains can take months to complete the journey.",
            goods: ["Silks", "Spices", "Gems", "Iron"]
        },
        south: {
            name: "The Spice Way",
            type: "land",
            description: "A southern route through the desert, dangerous but profitable. Only the most experienced guides can navigate the shifting sands.",
            goods: ["Spices", "Date Wine", "Rare Herbs"]
        },
        east: {
            name: "The Maritime Passage",
            type: "sea",
            description: "A treacherous sea route to the Threshold Isles. Storms and sea creatures make this journey perilous, but the rewards are immense.",
            goods: ["Exotic Imports", "Arcane Items", "Foreign Treasures"]
        },
        west: {
            name: "The Forest Path",
            type: "land",
            description: "A mysterious route through Myrkwood. The forest spirits guide worthy travelers, but those who offend the elders may never return.",
            goods: ["Herbs", "Wood", "Wisdom", "Enchanted Items"]
        }
    };

    // Era information
    const eras = {
        gods: {
            name: "Age of Gods",
            description: "When divine beings walked among mortals, performing miracles and bestowing blessings upon their chosen. Kingdoms rose and fell at the whim of the gods.",
            year: "Year 0 - 1000"
        },
        kings: {
            name: "Age of Kings",
            description: "The gods withdrew to their celestial realms, leaving mortals to govern themselves. Great empires were forged through conquest and alliance.",
            year: "Year 1000 - 2500"
        },
        shattered: {
            name: "Shattered Era",
            description: "The great empires crumbled, leaving fragments to fight over the ashes. New powers rise from the destruction of the old order.",
            year: "Year 2500 - Present"
        }
    };

    // Location data
    const locationData = {
        'sacred-grove': {
            name: "The Sacred Grove of Yggdrasil's Whisper",
            description: "An ancient grove where the world-tree's roots touch the mortal realm. Those who sleep beneath its boughs report prophetic dreams of extraordinary clarity.",
            lore: "The first elves learned the art of magic here, from the whispers of the tree itself. It is said the grove remembers everything that has ever happened in the world."
        },
        'temple-ruins': {
            name: "Ruins of the Temple Eternal",
            description: "What remains of a grand temple dedicated to the gods of old. Pilgrims still visit, seeking blessings from the faded murals and crumbling altars.",
            lore: "The Temple Eternal once held the Crystal of Truth, a gem that revealed all lies. It was stolen during the Chaos of the Shattered Era and has never been recovered."
        },
        'oracle-pond': {
            name: "The Oracle's Mirror",
            description: "A still pool in the desert that shows visions to those who gaze into its waters. The visions are cryptic but often accurate, if interpreted correctly.",
            lore: "The Desert Mother speaks through the pond, but she is fickle. Some seekers emerge enlightened; others become lost in visions forever."
        },
        'ancient-portal': {
            name: "The Portal of the Threshold",
            description: "An ancient gateway between worlds, appearing only during certain celestial alignments. Those who pass through are sometimes transformed.",
            lore: "The portal was built by a civilization that mastered the spaces between realities. Some say it leads to paradise; others insist it leads to oblivion."
        }
    };

    // -------------------- State --------------------
    let currentEra = 'kings';
    let selectedKingdom = null;
    let selectedLocation = null;

    // -------------------- DOM Elements --------------------
    const elements = {
        timelineSlider: document.getElementById('timeline-slider'),
        currentEraDisplay: document.getElementById('current-era'),
        timelineButtons: document.querySelectorAll('.era-button'),
        kingdoms: document.querySelectorAll('.kingdom'),
        locationMarkers: document.querySelectorAll('.location-marker'),
        tradeRoutesGroup: document.getElementById('trade-routes'),
        caravans: document.querySelectorAll('.caravan'),
        panelTitle: document.getElementById('panel-title'),
        panelBody: document.getElementById('panel-body'),
        tooltip: document.getElementById('tooltip'),
        annotations: document.querySelectorAll('.annotation')
    };

    // -------------------- Initialization --------------------
    function init() {
        setupEventListeners();
        updateEra('kings');
        updateCaravanPositions();
        // Start animation loop
        setInterval(updateCaravanPositions, 100);
    }

    // -------------------- Event Listeners --------------------
    function setupEventListeners() {
        // Timeline slider
        elements.timelineSlider.addEventListener('input', handleTimelineChange);
        
        // Era buttons
        elements.timelineButtons.forEach(button => {
            button.addEventListener('click', () => {
                const era = button.dataset.era;
                setEra(era);
            });
        });
        
        // Kingdom clicks
        elements.kingdoms.forEach(kingdom => {
            kingdom.addEventListener('click', handleKingdomClick);
            kingdom.addEventListener('mouseenter', (e) => showTooltip(e, kingdom.dataset.kingdom));
            kingdom.addEventListener('mouseleave', hideTooltip);
        });
        
        // Location marker clicks
        elements.locationMarkers.forEach(marker => {
            marker.addEventListener('click', handleLocationClick);
            marker.addEventListener('mouseenter', (e) => showLocationTooltip(e, marker.dataset.location));
            marker.addEventListener('mouseleave', hideTooltip);
        });
        
        // Trade route hover
        elements.tradeRoutesGroup.addEventListener('mouseover', handleRouteHover);
        elements.tradeRoutesGroup.addEventListener('mouseout', handleRouteLeave);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    // -------------------- Timeline & Era Handling --------------------
    function handleTimelineChange(e) {
        const eraIndex = parseInt(e.target.value);
        const eraKeys = ['gods', 'kings', 'shattered'];
        setEra(eraKeys[eraIndex]);
    }

    function setEra(era) {
        currentEra = era;
        
        // Update slider value
        const eraIndex = ['gods', 'kings', 'shattered'].indexOf(era);
        elements.timelineSlider.value = eraIndex;
        
        // Update display
        elements.currentEraDisplay.textContent = eras[era].name;
        
        // Update button states
        elements.timelineButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.era === era);
        });
        
        // Update kingdoms visibility
        updateKingdomsForEra(era);
        
        // Update panel with era info
        updatePanelForEra(era);
    }

    function updateKingdomsForEra(era) {
        elements.kingdoms.forEach(kingdom => {
            const kingdomEra = kingdom.dataset.era;
            const isVisible = kingdomEra === 'all' || kingdomEra === era;
            kingdom.classList.toggle('hidden', !isVisible);
        });
        
        // Show/hide Obsidian and Broken Coast based on era
        toggleEraSpecificKingdoms(era);
    }

    function toggleEraSpecificKingdoms(era) {
        const obsidian = document.querySelector('[data-kingdom="obsidian"]');
        const broken = document.querySelector('[data-kingdom="broken"]');
        
        if (obsidian) {
            obsidian.classList.toggle('hidden', era !== 'shattered');
        }
        if (broken) {
            broken.classList.toggle('hidden', era !== 'shattered');
        }
    }

    function updatePanelForEra(era) {
        const eraInfo = eras[era];
        elements.panelTitle.textContent = eraInfo.name;
        
        elements.panelBody.innerHTML = `
            <p class="intro-text">${eraInfo.description}</p>
            <p style="color: var(--gold-primary); font-family: var(--font-display); font-size: 0.9rem;">${eraInfo.year}</p>
        `;
        
        // Add legend back
        addLegendToPanel();
    }

    // -------------------- Kingdom Interaction --------------------
    function handleKingdomClick(e) {
        const kingdomId = e.currentTarget.dataset.kingdom;
        selectKingdom(kingdomId);
    }

    function selectKingdom(kingdomId) {
        // Deselect previous
        if (selectedKingdom) {
            deselectKingdom(selectedKingdom);
        }
        
        selectedKingdom = kingdomId;
        
        const kingdom = document.querySelector(`[data-kingdom="${kingdomId}"]`);
        if (kingdom) {
            kingdom.classList.add('selected');
        }
        
        // Update panel
        displayKingdomInfo(kingdomId);
        
        // Show location annotations for special locations
        updateAnnotations(kingdomId);
    }

    function deselectKingdom(kingdomId) {
        if (!kingdomId) return;
        
        const kingdom = document.querySelector(`[data-kingdom="${kingdomId}"]`);
        if (kingdom) {
            kingdom.classList.remove('selected');
        }
    }

    function displayKingdomInfo(kingdomId) {
        const data = kingdomData[kingdomId];
        if (!data) return;
        
        const statusBadge = data.defunct ? '<span class="status-badge defunct">Fallen</span>' : '';
        const eraBadge = data.era !== 'all' ? `<span class="era-badge">${data.era === 'kings' ? 'Age of Kings' : 'Age of Gods'}</span>` : '';
        
        elements.panelTitle.innerHTML = `${data.name} ${statusBadge} ${eraBadge}`;
        
        elements.panelBody.innerHTML = `
            <p class="intro-text">${data.description}</p>
            <div class="detail-section">
                <h4 style="font-family: var(--font-display); color: var(--gold-primary); margin: 1rem 0 0.5rem;">Capital</h4>
                <p>${data.capital}</p>
            </div>
            <div class="detail-section">
                <h4 style="font-family: var(--font-display); color: var(--gold-primary); margin: 1rem 0 0.5rem;">Lore</h4>
                <p>${data.lore}</p>
            </div>
            <div class="detail-section">
                <h4 style="font-family: var(--font-display); color: var(--gold-primary); margin: 1rem 0 0.5rem;">Trade</h4>
                <p>${data.trade}</p>
            </div>
            <div class="detail-section">
                <h4 style="font-family: var(--font-display); color: var(--gold-primary); margin: 1rem 0 0.5rem;">Mythology</h4>
                <p>${data.mythology}</p>
            </div>
            <div class="detail-section">
                <h4 style="font-family: var(--font-display); color: var(--gold-primary); margin: 1rem 0 0.5rem;">Resources</h4>
                <div class="resource-tags">
                    ${data.resources.map(r => `<span class="resource-tag">${r}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Add legend
        addLegendToPanel();
    }

    function addLegendToPanel() {
        // Check if legend already exists
        if (elements.panelBody.querySelector('.legend-section')) return;
        
        const legendHTML = `
            <div class="legend-section" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--bronze-aged);">
                <h4 style="font-family: var(--font-display); color: var(--gold-primary); margin-bottom: 0.5rem;">Legend</h4>
                <div class="legend-items" style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; color: var(--sand-dark);">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: var(--gold-primary);"></span>
                        Capital
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="width: 20px; height: 3px; background: repeating-linear-gradient(90deg, var(--gold-primary), var(--gold-primary) 5px, transparent 5px, transparent 10px);"></span>
                        Trade Route
                    </div>
                </div>
            </div>
        `;
        
        elements.panelBody.insertAdjacentHTML('beforeend', legendHTML);
    }

    // -------------------- Location Interaction --------------------
    function handleLocationClick(e) {
        const locationId = e.currentTarget.dataset.location;
        selectLocation(locationId);
    }

    function selectLocation(locationId) {
        // Deselect previous
        if (selectedLocation) {
            const prevMarker = document.querySelector(`[data-location="${selectedLocation}"]`);
            if (prevMarker) prevMarker.classList.remove('active');
        }
        
        selectedLocation = locationId;
        
        const marker = document.querySelector(`[data-location="${locationId}"]`);
        if (marker) marker.classList.add('active');
        
        displayLocationInfo(locationId);
    }

    function displayLocationInfo(locationId) {
        const data = locationData[locationId];
        if (!data) return;
        
        elements.panelTitle.textContent = data.name;
        
        elements.panelBody.innerHTML = `
            <p class="intro-text">${data.description}</p>
            <div class="detail-section">
                <h4 style="font-family: var(--font-display); color: var(--gold-primary); margin: 1rem 0 0.5rem;">Ancient Lore</h4>
                <p>${data.lore}</p>
            </div>
        `;
        
        addLegendToPanel();
    }

    function updateAnnotations(kingdomId) {
        // Show/hide annotations based on nearby locations
        const locationMapping = {
            myrkwood: 'sacred-grove',
            sunken: 'temple-ruins',
            ashenvale: 'oracle-pond',
            threshold: 'ancient-portal'
        };
        
        const nearbyLocation = locationMapping[kingdomId];
        
        elements.annotations.forEach(annotation => {
            const isNearby = annotation.dataset.for === nearbyLocation;
            annotation.classList.toggle('hidden', !isNearby);
        });
    }

    // -------------------- Tooltip Functions --------------------
    function showTooltip(e, kingdomId) {
        const data = kingdomData[kingdomId];
        if (!data) return;
        
        elements.tooltip.innerHTML = `<strong>${data.name}</strong><br>${data.fullName || data.name}`;
        positionTooltip(e);
        elements.tooltip.classList.add('visible');
    }

    function showLocationTooltip(e, locationId) {
        const data = locationData[locationId];
        if (!data) return;
        
        elements.tooltip.innerHTML = `<strong>${data.name}</strong><br>Click to learn more`;
        positionTooltip(e);
        elements.tooltip.classList.add('visible');
    }

    function positionTooltip(e) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        
        // Keep tooltip in viewport
        const rect = elements.tooltip.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 10;
        const maxY = window.innerHeight - rect.height - 10;
        
        elements.tooltip.style.left = Math.min(x, maxX) + 'px';
        elements.tooltip.style.top = Math.min(y, maxY) + 'px';
    }

    function hideTooltip() {
        elements.tooltip.classList.remove('visible');
    }

    // -------------------- Trade Route Animation --------------------
    function updateCaravanPositions() {
        elements.caravans.forEach(caravan => {
            const routeId = caravan.dataset.route;
            const progress = parseFloat(caravan.dataset.progress) || 0;
            const route = document.getElementById(routeId);
            
            if (!route) return;
            
            const pathLength = route.getTotalLength();
            const point = route.getPointAtLength(pathLength * progress);
            
            caravan.setAttribute('transform', `translate(${point.x}, ${point.y})`);
            
            // Animate progress
            let newProgress = progress + 0.002;
            if (newProgress > 1) newProgress = 0;
            caravan.dataset.progress = newProgress;
        });
    }

    // -------------------- Trade Route Hover --------------------
    function handleRouteHover(e) {
        if (e.target.classList.contains('trade-route')) {
            const routeId = e.target.id;
            showRouteInfo(routeId);
            e.target.style.strokeWidth = '5';
            e.target.style.opacity = '1';
        }
    }

    function handleRouteLeave(e) {
        if (e.target.classList.contains('trade-route')) {
            e.target.style.strokeWidth = '';
            e.target.style.opacity = '';
        }
    }

    function showRouteInfo(routeId) {
        const data = tradeRoutes[routeId.replace('route-', '')];
        if (!data) return;
        // Route info display handled by hover effect
    }

    // -------------------- Keyboard Navigation --------------------
    function handleKeyboard(e) {
        const kingdomIds = Array.from(elements.kingdoms)
            .map(k => k.dataset.kingdom)
            .filter(id => {
                const el = document.querySelector(`[data-kingdom="${id}"]`);
                return el && !el.classList.contains('hidden');
            });
        
        if (kingdomIds.length === 0) return;
        
        let currentIndex = selectedKingdom ? kingdomIds.indexOf(selectedKingdom) : 0;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            currentIndex = (currentIndex + 1) % kingdomIds.length;
            selectKingdom(kingdomIds[currentIndex]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            currentIndex = (currentIndex - 1 + kingdomIds.length) % kingdomIds.length;
            selectKingdom(kingdomIds[currentIndex]);
        } else if (e.key === 'Escape') {
            deselectKingdom(selectedKingdom);
            selectedKingdom = null;
            elements.panelTitle.textContent = eras[currentEra].name;
            updatePanelForEra(currentEra);
            elements.annotations.forEach(a => a.classList.add('hidden'));
        }
    }

    // -------------------- Update Functions --------------------
    function updateEra(era) {
        setEra(era);
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', init);

})();