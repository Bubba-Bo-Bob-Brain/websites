// AETHELGARD ATLAS - Interactive Scripts
// Bringing the ancient world to life

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the atlas
    initAtlas();
    
    // Civilization Data - Lore, trade, and mythology
    const civilizations = {
        draconia: {
            name: "Draconian Isles",
            era: "Ancient",
            ruler: "Scale-Lord Zephyros",
            capital: "Pyrothrone",
            population: "42,000",
            primaryExports: ["Dragon Scales", "Obsidian", "Volcanic Glass", "Fire Essence"],
            lore: "The Draconian Isles are a volcanic archipelago ruled by descendants of ancient sky serpents. Their society revolves around draconic worship, with architecture carved directly from cooled magma flows. The Scale-Lords maintain a strict caste system based on fire affinity.",
            mythology: [
                {
                    title: "The First Wyrm",
                    description: "Legend tells of Zorvathax, the primordial wyrm who formed the islands with her fiery breath. Her scales became the first dragons, and her tears formed the obsidian deposits."
                },
                {
                    title: "The Eternal Flame",
                    description: "At the heart of Pyrothrone burns a flame said to have been lit by the gods themselves. It has never been extinguished, even during the Great Deluge."
                }
            ],
            tradeRoutes: ["Route 1", "Route 3"],
            color: "#8b4513"
        },
        khemet: {
            name: "Khemet Basin",
            era: "Golden Age",
            ruler: "Pharaoh Amenhotep IV",
            capital: "Nekhebet",
            population: "210,000",
            primaryExports: ["Papyrus", "Gold", "Incense", "Lapis Lazuli"],
            lore: "The Khemet Basin flourishes along the life-giving River Nilus. Known for monumental pyramids, complex hieroglyphics, and advanced astronomy. The Pharaoh is considered a living god, mediating between mortals and the divine.",
            mythology: [
                {
                    title: "River God's Blessing",
                    description: "Each year, the river floods precisely when predicted by star priests, believed to be the blessing of Hapi, the river deity who ensures prosperity."
                },
                {
                    title: "Sun Barge Journey",
                    description: "The Pharaoh is said to travel with Ra on his solar barge each night, fighting the serpent Apophis to ensure sunrise."
                }
            ],
            tradeRoutes: ["Route 1", "Route 2"],
            color: "#b8860b"
        },
        frostholm: {
            name: "Frostholm",
            era: "Age of Ice",
            ruler: "Jarl Bjorn Ironside",
            capital: "Glacierhold",
            population: "28,000",
            primaryExports: ["Amber", "Whale Ivory", "Furs", "Ice Crystals"],
            lore: "Frostholm's people are hardened survivors of the perpetual winter. They live in massive ice halls, hunting great beasts of the frozen wastes. Their society values strength, honor, and skilled craftsmanship in bone and ice.",
            mythology: [
                {
                    title: "The Frozen Heart",
                    description: "Deep beneath Glacierhold lies the Frozen Heart, a crystal said to contain the soul of winter itself. It's guarded by the spectral Ice Warden."
                },
                {
                    title: "Aurora Spirits",
                    description: "The northern lights are believed to be spirits of ancestors dancing across the sky, blessing those who witness them with good fortune."
                }
            ],
            tradeRoutes: ["Route 3"],
            color: "#4682b4"
        },
        veridia: {
            name: "Veridian Expanse",
            era: "Age of Growth",
            ruler: "Archdruid Elowen",
            capital: "Roothaven",
            population: "95,000",
            primaryExports: ["Healing Herbs", "Sacred Wood", "Forest Nectar", "Moonblossoms"],
            lore: "A vast, sentient forest where trees communicate through root networks. The Veridians live in harmony with nature, building homes in giant trees and following the guidance of the Green Council. Magic here is organic and tied to natural cycles.",
            mythology: [
                {
                    title: "The World Tree",
                    description: "At the center of the expanse stands Yggralith, a tree so vast its roots touch the underworld and branches scrape the heavens."
                },
                {
                    title: "Dryad's Promise",
                    description: "The first Archdruid made a pact with the forest spirits, granting her people protection in exchange for guarding the sacred groves."
                }
            ],
            tradeRoutes: ["Route 2"],
            color: "#2e8b57"
        },
        ashur: {
            name: "Ashur Dominion",
            era: "Empire Rising",
            ruler: "Emperor Valerius the Conqueror",
            capital: "Ironhold",
            population: "350,000",
            primaryExports: ["Steel", "Marble", "Spices", "Slaves"],
            lore: "A militaristic empire expanding through conquest and engineering marvels. Known for disciplined legions, aqueducts, and grand colosseums. The Ashur value order, law, and technological advancement above all else.",
            mythology: [
                {
                    title: "Divine Right",
                    description: "Emperors claim descent from Mars, the war god, granting them divine mandate to rule all known lands."
                },
                {
                    title: "The Eternal City Prophecy",
                    description: "An oracle foretold that Ashur would rule for a thousand years before crumbling from within due to decadence."
                }
            ],
            tradeRoutes: ["Route 2"],
            color: "#8b0000"
        }
    };

    const mythologySites = {
        leviathan: {
            title: "Leviathan's Rest",
            civilization: "Draconian Isles",
            description: "A vast underwater cavern where the great sea serpent Leviathan is said to slumber. Sailors claim to hear its deep breaths during storms, and offerings are made here for safe passage.",
            significance: "Naval navigation and protection from sea monsters",
            era: "Pre-Draconian"
        },
        phoenix: {
            title: "Phoenix Ashes",
            civilization: "Khemet Basin",
            description: "A sacred ash field where the mythical Phoenix completes its 500-year cycle of death and rebirth. The ashes are collected by priests for their purported healing and rejuvenating properties.",
            significance: "Renewal, immortality, and priestly rituals",
            era: "First Dynasty"
        }
    };

    // DOM Elements
    const mainMap = document.getElementById('mainMap');
    const eraSlider = document.getElementById('eraSlider');
    const sliderThumb = document.querySelector('.slider-thumb');
    const currentEraElement = document.querySelector('.current-era');
    const eraYearElement = document.querySelector('.era-year');
    const civDetails = document.getElementById('civDetails');
    const mythEntries = document.getElementById('mythEntries');
    const activeRoutesElement = document.getElementById('activeRoutes');
    const tradeGoodsElement = document.getElementById('tradeGoods');
    const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
    const closePanelBtn = document.getElementById('closePanel');
    const mythModal = document.getElementById('mythModal');
    const closeMythModalBtn = document.getElementById('closeMythModal');
    const mythModalTitle = document.getElementById('mythModalTitle');
    const mythModalBody = document.getElementById('mythModalBody');
    const regionElements = document.querySelectorAll('.region');
    const mythMarkers = document.querySelectorAll('.myth-marker');
    const tradeRoutes = document.querySelectorAll('.trade-route');
    const caravanElements = document.querySelectorAll('.caravan');
    const toolButtons = {
        zoomIn: document.getElementById('zoomIn'),
        zoomOut: document.getElementById('zoomOut'),
        resetView: document.getElementById('resetView'),
        toggleRoutes: document.getElementById('toggleRoutes')
    };
    const navLinks = document.querySelectorAll('.nav-link');

    // State Variables
    let currentCivilization = null;
    let isDarkMode = false;
    let mapScale = 1;
    let routesVisible = true;
    let activeTradeRoutes = new Set();

    // Initialize Atlas
    function initAtlas() {
        console.log('Aethelgard Atlas Initializing...');
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize trade routes
        updateTradeStats();
        
        // Set initial era from slider
        updateEraDisplay();
        
        // Start caravan animations
        animateCaravans();
        
        console.log('Atlas ready. Select a realm to begin exploration.');
    }

    // Event Listeners Setup
    function setupEventListeners() {
        // Region clicks
        regionElements.forEach(region => {
            region.addEventListener('click', function() {
                const regionId = this.dataset.region;
                selectCivilization(regionId);
            });
        });

        // Timeline slider
        eraSlider.addEventListener('input', function() {
            updateEraDisplay();
            updateBorderShifts(this.value);
        });

        // Dark mode toggle
        toggleDarkModeBtn.addEventListener('click', toggleDarkMode);

        // Close lore panel
        closePanelBtn.addEventListener('click', function() {
            resetCivilizationDisplay();
        });

        // Mythology markers
        mythMarkers.forEach(marker => {
            marker.addEventListener('click', function() {
                const mythId = this.dataset.myth;
                showMythologyDetails(mythId);
            });
        });

        // Close mythology modal
        closeMythModalBtn.addEventListener('click', closeMythModal);
        mythModal.addEventListener('click', function(e) {
            if (e.target === mythModal) {
                closeMythModal();
            }
        });

        // Tool buttons
        toolButtons.zoomIn.addEventListener('click', function() {
            zoomMap(0.1);
        });

        toolButtons.zoomOut.addEventListener('click', function() {
            zoomMap(-0.1);
        });

        toolButtons.resetView.addEventListener('click', resetMapView);

        toolButtons.toggleRoutes.addEventListener('click', toggleTradeRoutes);

        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.dataset.section;
                navigateToSection(section);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Escape closes modals
            if (e.key === 'Escape') {
                closeMythModal();
                if (currentCivilization) {
                    resetCivilizationDisplay();
                }
            }
            
            // Dark mode toggle with D
            if (e.key === 'd' || e.key === 'D') {
                toggleDarkMode();
            }
            
            // Zoom with + and -
            if (e.key === '+' || e.key === '=') {
                zoomMap(0.1);
            }
            if (e.key === '-' || e.key === '_') {
                zoomMap(-0.1);
            }
        });
    }

    // Civilization Selection
    function selectCivilization(regionId) {
        // Remove active class from all regions
        regionElements.forEach(region => {
            region.classList.remove('active-region');
        });
        
        // Add active class to selected region
        const selectedRegion = document.querySelector(`[data-region="${regionId}"]`);
        selectedRegion.classList.add('active-region');
        
        // Update current civilization
        currentCivilization = civilizations[regionId];
        
        // Update lore panel
        updateCivilizationDisplay();
        
        // Highlight connected trade routes
        highlightTradeRoutes(regionId);
        
        // Update trade statistics
        updateTradeStats();
        
        // Scroll lore panel to top
        document.querySelector('.panel-content').scrollTop = 0;
        
        console.log(`Selected: ${currentCivilization.name}`);
    }

    // Update Civilization Display in Lore Panel
    function updateCivilizationDisplay() {
        if (!currentCivilization) return;
        
        const civ = currentCivilization;
        
        // Create civilization details HTML
        const detailsHTML = `
            <div class="civ-header" style="border-left: 4px solid ${civ.color};">
                <h3 class="civ-name">${civ.name}</h3>
                <div class="civ-meta">
                    <span class="civ-era"><i class="fas fa-hourglass-half"></i> ${civ.era}</span>
                    <span class="civ-ruler"><i class="fas fa-crown"></i> ${civ.ruler}</span>
                    <span class="civ-capital"><i class="fas fa-landmark"></i> ${civ.capital}</span>
                </div>
            </div>
            
            <div class="civ-stats">
                <div class="stat-box">
                    <div class="stat-value">${civ.population}</div>
                    <div class="stat-label">Inhabitants</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${civ.tradeRoutes.length}</div>
                    <div class="stat-label">Trade Routes</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${civ.primaryExports.length}</div>
                    <div class="stat-label">Exports</div>
                </div>
            </div>
            
            <div class="civ-lore">
                <h4><i class="fas fa-scroll"></i> Lore & History</h4>
                <p>${civ.lore}</p>
            </div>
            
            <div class="civ-exports">
                <h4><i class="fas fa-box-open"></i> Primary Exports</h4>
                <div class="exports-list">
                    ${civ.primaryExports.map(exportItem => `
                        <span class="export-item">${exportItem}</span>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Update the DOM
        civDetails.innerHTML = detailsHTML;
        civDetails.style.display = 'block';
        
        // Hide placeholder
        document.querySelector('.civ-placeholder').style.display = 'none';
        
        // Update mythology entries
        updateMythologyEntries();
        
        // Add custom styles for this civilization
        addCivilizationStyles(civ.color);
    }

    // Reset Civilization Display
    function resetCivilizationDisplay() {
        // Remove active class from all regions
        regionElements.forEach(region => {
            region.classList.remove('active-region');
        });
        
        // Reset current civilization
        currentCivilization = null;
        
        // Show placeholder
        document.querySelector('.civ-placeholder').style.display = 'block';
        
        // Hide details
        civDetails.style.display = 'none';
        
        // Reset mythology entries
        mythEntries.innerHTML = '';
        
        // Reset trade route highlights
        resetTradeRouteHighlights();
        
        // Remove civilization-specific styles
        removeCivilizationStyles();
        
        console.log('Civilization selection cleared.');
    }

    // Update Mythology Entries
    function updateMythologyEntries() {
        if (!currentCivilization) return;
        
        const mythHTML = currentCivilization.mythology.map((myth, index) => `
            <div class="myth-entry">
                <div class="myth-header">
                    <h4>${myth.title}</h4>
                    <button class="btn-read-more" data-myth-index="${index}">
                        <i class="fas fa-eye"></i> Read More
                    </button>
                </div>
                <p class="myth-preview">${myth.description.substring(0, 100)}...</p>
            </div>
        `).join('');
        
        mythEntries.innerHTML = mythHTML;
        
        // Add event listeners to "Read More" buttons
        document.querySelectorAll('.btn-read-more').forEach(button => {
            button.addEventListener('click', function() {
                const mythIndex = this.dataset.mythIndex;
                showCivilizationMythology(mythIndex);
            });
        });
    }

    // Show Civilization Mythology Details
    function showCivilizationMythology(mythIndex) {
        if (!currentCivilization) return;
        
        const myth = currentCivilization.mythology[mythIndex];
        
        mythModalTitle.textContent = `${myth.title} - ${currentCivilization.name}`;
        mythModalBody.innerHTML = `
            <div class="myth-detail">
                <div class="myth-context">
                    <p><strong>Civilization:</strong> ${currentCivilization.name}</p>
                    <p><strong>Era:</strong> ${currentCivilization.era}</p>
                </div>
                <div class="myth-description">
                    <p>${myth.description}</p>
                </div>
                <div class="myth-significance">
                    <h4>Significance</h4>
                    <p>This myth shapes ${currentCivilization.name}'s cultural identity, influencing their ${mythIndex === 0 ? 'governance and spiritual practices' : 'artistic expressions and societal values'}.</p>
                </div>
            </div>
        `;
        
        mythModal.classList.add('active');
    }

    // Show Mythology Site Details
    function showMythologyDetails(mythId) {
        const mythSite = mythologySites[mythId];
        
        if (!mythSite) return;
        
        mythModalTitle.textContent = mythSite.title;
        mythModalBody.innerHTML = `
            <div class="myth-site-detail">
                <div class="site-context">
                    <p><strong>Associated Civilization:</strong> ${mythSite.civilization}</p>
                    <p><strong>Historical Era:</strong> ${mythSite.era}</p>
                    <p><strong>Significance:</strong> ${mythSite.significance}</p>
                </div>
                <div class="site-description">
                    <h4>Description</h4>
                    <p>${mythSite.description}</p>
                </div>
                <div class="site-visitation">
                    <h4>Visitor Information</h4>
                    <p>Pilgrims often visit this site during ${mythId === 'leviathan' ? 'the summer solstice' : 'the spring equinox'}. 
                    ${mythId === 'leviathan' ? 'Offerings of carved whalebone are traditional.' : 'Collecting ashes is forbidden except by appointed priests.'}</p>
                </div>
            </div>
        `;
        
        mythModal.classList.add('active');
    }

    // Close Mythology Modal
    function closeMythModal() {
        mythModal.classList.remove('active');
    }

    // Update Era Display
    function updateEraDisplay() {
        const sliderValue = parseInt(eraSlider.value);
        let eraName, eraYear;
        
        if (sliderValue < 25) {
            eraName = "Age of Dawn";
            eraYear = "~432 A.D.";
        } else if (sliderValue < 50) {
            eraName = "Empire Rising";
            eraYear = "~812 A.D.";
        } else if (sliderValue < 75) {
            eraName = "Great Schism";
            eraYear = "~1204 A.D.";
        } else {
            eraName = "Current Era";
            eraYear = "~1543 A.D.";
        }
        
        currentEraElement.textContent = eraName;
        eraYearElement.textContent = eraYear;
        
        // Update slider thumb position
        sliderThumb.style.left = `${sliderValue}%`;
        
        // Update timeline marker
        const timelineMarker = document.querySelector('.timeline-marker');
        timelineMarker.style.left = `${sliderValue}%`;
        timelineMarker.querySelector('.marker-label').textContent = eraName;
    }

    // Update Border Shifts Based on Era
    function updateBorderShifts(sliderValue) {
        // This would typically involve complex SVG manipulations
        // For this demo, we'll just adjust region opacities
        
        regionElements.forEach(region => {
            const regionId = region.dataset.region;
            const civ = civilizations[regionId];
            
            // Adjust opacity based on era relevance
            let opacity = 1;
            
            if (sliderValue < 25 && civ.era !== "Ancient") {
                opacity = 0.5;
            } else if (sliderValue < 50 && civ.era === "Age of Ice") {
                opacity = 0.7;
            } else if (sliderValue > 75 && civ.era === "Ancient") {
                opacity = 0.6;
            }
            
            region.style.opacity = opacity;
        });
    }

    // Highlight Trade Routes for Selected Civilization
    function highlightTradeRoutes(regionId) {
        // Reset all routes
        tradeRoutes.forEach(route => {
            route.classList.remove('active-route');
        });
        
        // Get civilization's trade routes
        const civRoutes = civilizations[regionId].tradeRoutes;
        
        // Highlight connected routes
        civRoutes.forEach(routeName => {
            const routeElement = document.getElementById(routeName.toLowerCase().replace(' ', ''));
            if (routeElement) {
                routeElement.classList.add('active-route');
                activeTradeRoutes.add(routeName);
            }
        });
        
        // Update active trade routes count
        updateTradeStats();
    }

    // Reset Trade Route Highlights
    function resetTradeRouteHighlights() {
        tradeRoutes.forEach(route => {
            route.classList.remove('active-route');
        });
        activeTradeRoutes.clear();
        updateTradeStats();
    }

    // Update Trade Statistics
    function updateTradeStats() {
        // Count unique trade routes
        const uniqueRoutes = new Set();
        Object.values(civilizations).forEach(civ => {
            civ.tradeRoutes.forEach(route => uniqueRoutes.add(route));
        });
        
        // Count total trade goods
        const totalGoods = Object.values(civilizations)
            .reduce((total, civ) => total + civ.primaryExports.length, 0);
        
        // Update DOM
        activeRoutesElement.textContent = activeTradeRoutes.size || uniqueRoutes.size;
        tradeGoodsElement.textContent = totalGoods;
    }

    // Toggle Dark Mode
    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        
        // Update button text
        const icon = toggleDarkModeBtn.querySelector('i');
        const text = toggleDarkModeBtn.querySelector('span');
        
        if (isDarkMode) {
            icon.className = 'fas fa-sun';
            text.textContent = 'Veil of Day';
            console.log('Dark mode activated');
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Veil of Night';
            console.log('Light mode activated');
        }
    }

    // Map Zoom Functionality
    function zoomMap(delta) {
        mapScale = Math.max(0.5, Math.min(2, mapScale + delta));
        mainMap.style.transform = `scale(${mapScale})`;
        mainMap.style.transformOrigin = 'center center';
        
        console.log(`Map zoom: ${Math.round(mapScale * 100)}%`);
    }

    // Reset Map View
    function resetMapView() {
        mapScale = 1;
        mainMap.style.transform = 'scale(1)';
        console.log('Map view reset');
    }

    // Toggle Trade Routes Visibility
    function toggleTradeRoutes() {
        routesVisible = !routesVisible;
        
        if (routesVisible) {
            tradeRoutes.forEach(route => {
                route.classList.remove('route-hidden');
            });
            caravanElements.forEach(caravan => {
                caravan.style.opacity = '1';
            });
            toolButtons.toggleRoutes.innerHTML = '<i class="fas fa-road"></i>';
            console.log('Trade routes shown');
        } else {
            tradeRoutes.forEach(route => {
                route.classList.add('route-hidden');
            });
            caravanElements.forEach(caravan => {
                caravan.style.opacity = '0.3';
            });
            toolButtons.toggleRoutes.innerHTML = '<i class="fas fa-road"></i><span style="text-decoration: line-through;">';
            console.log('Trade routes hidden');
        }
    }

    // Animate Caravans Along Routes
    function animateCaravans() {
        // This would typically involve complex SVG path following
        // For this demo, we'll use CSS animations defined in the stylesheet
        console.log('Caravan animations initialized');
    }

    // Navigate to Section
    function navigateToSection(section) {
        console.log(`Navigating to: ${section}`);
        
        // Scroll to appropriate section
        switch(section) {
            case 'regions':
                // Select first region if none selected
                if (!currentCivilization) {
                    selectCivilization('draconia');
                }
                document.querySelector('.panel-content').scrollTop = 0;
                break;
            case 'mythology':
                // Scroll to mythology section
                const mythSection = document.querySelector('.mythology-section');
                if (mythSection) {
                    mythSection.scrollIntoView({ behavior: 'smooth' });
                }
                break;
            case 'trade':
                // Scroll to trade section
                const tradeSection = document.querySelector('.trade-info');
                if (tradeSection) {
                    tradeSection.scrollIntoView({ behavior: 'smooth' });
                }
                break;
            case 'timeline':
                // Focus timeline slider
                eraSlider.focus();
                break;
        }
    }

    // Add Civilization-Specific Styles
    function addCivilizationStyles(color) {
        // Remove any existing civilization styles
        removeCivilizationStyles();
        
        // Create style element
        const style = document.createElement('style');
        style.id = 'civ-styles';
        
        // Add styles for this civilization
        style.textContent = `
            .active-region .region-shape {
                box-shadow: 0 0 40px ${color}80 !important;
            }
            
            .civ-header {
                border-left-color: ${color} !important;
            }
            
            .civ-name {
                color: ${color} !important;
            }
            
            .export-item {
                background: ${color}20;
                border: 1px solid ${color}40;
            }
            
            .myth-entry {
                border-left: 3px solid ${color};
            }
        `;
        
        document.head.appendChild(style);
    }

    // Remove Civilization-Specific Styles
    function removeCivilizationStyles() {
        const existingStyles = document.getElementById('civ-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
    }

    // Initialize with Draconian Isles as example
    setTimeout(() => {
        selectCivilization('draconia');
    }, 1000);
});