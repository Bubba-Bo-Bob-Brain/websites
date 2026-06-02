// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const regions = document.querySelectorAll('.region');
    const infoPanel = document.querySelector('.info-panel');
    const closeBtn = document.querySelector('.close-btn');
    const regionName = document.getElementById('region-name');
    const regionType = document.getElementById('region-type');
    const regionCapital = document.getElementById('region-capital');
    const regionDescription = document.getElementById('region-description');
    const eraSlider = document.getElementById('era-slider');
    const eraLabels = document.querySelectorAll('.era-label');
    const tradeRoutes = document.querySelectorAll('.trade-route');
    const caravanMarkers = document.querySelectorAll('.caravan-marker');
    const annotations = document.querySelectorAll('.annotation');
    
    // Current state
    let currentEra = 0;
    let activeRegion = null;
    
    // Civilization data for different eras
    const civilizationData = {
        0: { // Age of Mystics
            aethermoor: { name: "Aethermoor", type: "Mystical Realm", capital: "Mysthaven", description: "Land of floating islands and arcane scholars. Known for their mastery of wind magic and celestial navigation. During this era, they built the first sky observatories." },
            solareth: { name: "Solareth", type: "Rising Empire", capital: "Heliodor", description: "The emerging golden empire that would later dominate the central continent. In this early period, they established their first sun temples." },
            umbralands: { name: "Umbralands", type: "Shadow Territory", capital: "Duskhaven", description: "Realm of perpetual twilight, home to shadow weavers and necromancers. Their obsidian cities were just beginning to emerge from the darkness." },
            verdantia: { name: "Verdantia", type: "Nature Sanctuary", capital: "Sylvanora", description: "Ancient forest realm where druids commune with nature spirits. Protected by living walls and guarded by treants since time immemorial." },
            pyrodes: { name: "Pyrodes", type: "Volcanic Territory", capital: "Emberhold", description: "Volcanic archipelago where fire mages harness the power of molten earth. Their forges create weapons of legendary quality even in this early age." },
            thalassia: { name: "Thalassia", type: "Oceanic Nation", capital: "Aquarion", description: "Island nation of sea mages who navigate by starlight. Masters of tidal magic and pearl cultivation since the dawn of civilization." }
        },
        1: { // Golden Empire
            aethermoor: { name: "Aethermoor", type: "Mystical Realm", capital: "Mysthaven", description: "Land of floating islands and arcane scholars. Known for their mastery of wind magic and celestial navigation. At their peak, they traded magical artifacts with distant lands." },
            solareth: { name: "Solareth", type: "Golden Empire", capital: "Heliodor", description: "The great golden empire that dominated the central continent. Famous for their sun temples and advanced metallurgy. Their roads connected the entire known world." },
            umbralands: { name: "Umbralands", type: "Shadow Realm", capital: "Duskhaven", description: "Realm of perpetual twilight, home to shadow weavers and necromancers. Their obsidian cities blended seamlessly with the landscape." },
            verdantia: { name: "Verdantia", type: "Nature Sanctuary", capital: "Sylvanora", description: "Ancient forest realm where druids commune with nature spirits. Protected by living walls and guarded by treants. The empire respected their neutrality." },
            pyrodes: { name: "Pyrodes", type: "Volcanic Dominion", capital: "Emberhold", description: "Volcanic archipelago under imperial protection. Fire mages supplied magical metals to the empire in exchange for protection." },
            thalassia: { name: "Thalassia", type: "Oceanic Protectorate", capital: "Aquarion", description: "Island nation of sea mages who navigated imperial fleets. Masters of tidal magic and pearl cultivation under Solareth's benevolent rule." }
        },
        2: { // Age of Conquest
            aethermoor: { name: "Aethermoor", type: "Independent Realm", capital: "Mysthaven", description: "Floating islands that maintained neutrality during the wars. Their arcane universities became refuges for scholars fleeing conflict." },
            solareth: { name: "Solareth", type: "Fragmented Empire", capital: "Heliodor", description: "Once mighty empire now fractured into warring successor states. Their former glory lives only in ruins and legends." },
            umbralands: { name: "Umbralands", type: "Shadow Confederacy", capital: "Duskhaven", description: "Realm of perpetual twilight, home to shadow weavers and necromancers. Profited from the chaos by selling mercenaries to all sides." },
            verdantia: { name: "Verdantia", type: "Nature Sanctuary", capital: "Sylvanora", description: "Ancient forest realm that became a haven for refugees. Druids used nature magic to protect their borders from invading armies." },
            pyrodes: { name: "Pyrodes", type: "Volcanic Republic", capital: "Emberhold", description: "Volcanic archipelago of independent city-states. Their fire mages supplied weapons to the highest bidder during the conquests." },
            thalassia: { name: "Thalassia", type: "Maritime League", capital: "Aquarion", description: "Island confederation of sea mages who controlled vital trade routes. Their naval power made them indispensable to all factions." }
        },
        3: { // Twilight Kingdoms
            aethermoor: { name: "Aethermoor", type: "Sky Republic", capital: "Mysthaven", description: "Floating islands governed by councils of arcane scholars. Their knowledge became sought after by all the emerging kingdoms." },
            solareth: { name: "New Solareth", type: "Kingdom", capital: "Heliodor", description: "Restored kingdom claiming descent from the old empire. Built on the ruins of their predecessors with new architectural styles." },
            umbralands: { name: "Umbralands", type: "Shadow Principality", capital: "Duskhaven", description: "Diminished realm of shadow weavers focused on internal development. Their magical arts became more refined but less influential." },
            verdantia: { name: "Verdantia", type: "Forest Kingdom", capital: "Sylvanora", description: "Ancient forest realm now ruled by druid-kings. Their alliance with nature allowed them to thrive while other kingdoms declined." },
            pyrodes: { name: "Pyrodes", type: "Volcanic Kingdom", capital: "Emberhold", description: "Volcanic archipelago unified under a single monarch. Their forges still create the finest weapons despite the general decline." },
            thalassia: { name: "Thalassia", type: "Maritime Kingdom", capital: "Aquarion", description: "Island nation that survived the chaos through maritime trade. Their sea mages developed new techniques for long-distance navigation." }
        }
    };
    
    // Initialize the map
    function initMap() {
        // Set up region click events
        regions.forEach(region => {
            region.addEventListener('click', function() {
                const regionId = this.id;
                showRegionInfo(regionId);
                highlightRegion(regionId);
            });
        });
        
        // Close button for info panel
        closeBtn.addEventListener('click', function() {
            infoPanel.classList.remove('active');
            if (activeRegion) {
                activeRegion.style.filter = '';
                activeRegion = null;
            }
        });
        
        // Era slider functionality
        eraSlider.addEventListener('input', function() {
            currentEra = parseInt(this.value);
            updateEraDisplay();
            updateMapForEra();
        });
        
        // Era label clicks
        eraLabels.forEach(label => {
            label.addEventListener('click', function() {
                const era = parseInt(this.dataset.era);
                eraSlider.value = era;
                currentEra = era;
                updateEraDisplay();
                updateMapForEra();
            });
        });
        
        // Initialize with first era
        updateEraDisplay();
        updateMapForEra();
    }
    
    // Update era display
    function updateEraDisplay() {
        // Update active label
        eraLabels.forEach((label, index) => {
            if (index === currentEra) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }
    
    // Update map based on selected era
    function updateMapForEra() {
        // Show/hide trade routes based on era
        if (currentEra >= 1) {
            tradeRoutes.forEach(route => {
                route.style.opacity = '1';
            });
            caravanMarkers.forEach(marker => {
                marker.style.opacity = '1';
            });
        } else {
            tradeRoutes.forEach(route => {
                route.style.opacity = '0';
            });
            caravanMarkers.forEach(marker => {
                marker.style.opacity = '0';
            });
        }
        
        // Update region appearances based on era
        regions.forEach(region => {
            const regionId = region.id;
            const data = civilizationData[currentEra][regionId];
            
            if (data) {
                region.setAttribute('data-type', getRegionTypeClass(data.type));
            }
        });
    }
    
    // Helper to convert region type to CSS class
    function getRegionTypeClass(type) {
        const typeMap = {
            'Mystical Realm': 'mystical',
            'Mystical Realms': 'mystical',
            'Rising Empire': 'empire',
            'Golden Empire': 'empire',
            'Shadow Territory': 'shadow',
            'Shadow Realm': 'shadow',
            'Shadow Confederacy': 'shadow',
            'Shadow Principality': 'shadow',
            'Nature Sanctuary': 'nature',
            'Nature Sanctuaries': 'nature',
            'Volcanic Territory': 'volcanic',
            'Volcanic Dominion': 'volcanic',
            'Volcanic Republic': 'volcanic',
            'Volcanic Kingdom': 'volcanic',
            'Oceanic Nation': 'oceanic',
            'Oceanic Protectorate': 'oceanic',
            'Maritime League': 'oceanic',
            'Maritime Kingdom': 'oceanic',
            'Fragmented Empire': 'empire',
            'Independent Realm': 'mystical',
            'Sky Republic': 'mystical',
            'Kingdom': 'empire',
            'Forest Kingdom': 'nature',
            'Principality': 'shadow'
        };
        return typeMap[type] || 'mystical';
    }
    
    // Show region information
    function showRegionInfo(regionId) {
        const data = civilizationData[currentEra][regionId];
        
        if (data) {
            regionName.textContent = data.name;
            regionType.textContent = data.type;
            regionCapital.textContent = data.capital;
            regionDescription.textContent = data.description;
            
            infoPanel.classList.add('active');
        }
    }
    
    // Highlight selected region
    function highlightRegion(regionId) {
        // Remove highlight from previous region
        if (activeRegion) {
            activeRegion.style.filter = '';
        }
        
        // Highlight new region
        const region = document.getElementById(regionId);
        if (region) {
            region.style.filter = 'url(#glow)';
            activeRegion = region;
        }
    }
    
    // Animate trade routes
    function animateTradeRoutes() {
        tradeRoutes.forEach((route, index) => {
            // Reset animation
            route.style.animation = 'none';
            void route.offsetWidth; // Trigger reflow
            
            // Start animation with delay
            route.style.animation = `dash 15s linear ${index * 2}s infinite`;
        });
    }
    
    // Initialize annotations
    function initAnnotations() {
        annotations.forEach(annotation => {
            annotation.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
        
        // Close annotations when clicking elsewhere
        document.addEventListener('click', function() {
            document.querySelectorAll('.annotation-popup').forEach(popup => {
                popup.style.opacity = '0';
                popup.style.visibility = 'hidden';
            });
        });
    }
    
    // Start animations
    function startAnimations() {
        setTimeout(() => {
            animateTradeRoutes();
        }, 1000);
    }
    
    // Initialize everything
    initMap();
    initAnnotations();
    startAnimations();
});