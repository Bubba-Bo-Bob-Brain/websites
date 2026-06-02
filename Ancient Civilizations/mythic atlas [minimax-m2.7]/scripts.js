/* ============================================
   THE SHATTERED REALMS - INTERACTIVE ATLAS
   JavaScript for Interactive Features
   ============================================ */

// ==================== CONFIGURATION ====================
const CONFIG = {
    currentEra: 1,
    eras: ['dawn', 'crowns', 'ruin', 'rebirth'],
    eraDescriptions: {
        dawn: "The Age of Dawn: In the beginning, civilizations emerge from the mists of time. Fire is tamed, cities rise from earth, and the old gods walk among mortals.",
        crowns: "The Age of Crowns: Great kingdoms rise, trade flourishes, and the map of the world takes its familiar shape. This is an era of prosperity and discovery.",
        ruin: "The Age of Ruin: Darkness falls across the realms. Wars rage, borders shatter, and ancient wonders crumble to dust. Only the resilient survive.",
        rebirth: "The Age of Rebirth: From the ashes, new powers emerge. The survivors rebuild, forgotten knowledge is rediscovered, and a new world order takes form."
    },
    selectedRegion: null
};

// ==================== REGION DATA ====================
const REGION_DATA = {
    obsidian: {
        name: "The Obsidian Throne",
        subtitle: "Volcanic Empire of the Fallen Dragon",
        color: "obsidian",
        capital: "Pyrrhaven",
        founded: "Age of Dawn, Year 1",
        leader: "The Eternal Pyromancer",
        population: "2.4 million",
        exports: ["Obsidian Glass", "Volcanic Ash", "Fire Crystals", "Forged Weapons"],
        imports: ["Foodstuffs", "Silks", "Rare Woods", "Water"],
        history: [
            "In the primordial age, when the world was still cooling from its birth, a great dragon named Pyrrhus fell from the heavens. Where his body landed, volcanoes erupted, and from the volcanic glass they produced, the first people carved their civilization.",
            "The Obsidian Throne was established by the Pyromancers, mages who learned to harness the volcanic fires. For three thousand years, they have ruled from the city of Pyrrhaven, built within the caldera of the ancient dragon's heart.",
            "The Empire expanded through military might and trade alike. Their obsidian weapons are unmatched, and their fire crystals power the great forges of their rivals. Yet they remain isolationist, trusting few beyond their volcanic walls."
        ],
        trade: [
            "The Obsidian Throne controls the only known source of Fire Crystals, gems that burn with eternal flame. These are highly prized by mages across the realms.",
            "Their obsidian trade routes are dangerous, passing through volcanic regions, but the profit margins make it worthwhile for brave merchants.",
            "Food imports are essential, as the volcanic soil, though rich in minerals, cannot support sufficient agriculture for their population."
        ],
        myths: [
            "It is said that Pyrrhus did not truly die, but sleeps beneath Pyrrhaven. The tremors that sometimes shake the city are attributed to his dreaming.",
            "The Pyromancers claim to receive visions from the dragon's spirit, guiding their decisions through flames.",
            "A prophecy speaks of the dragon's return, when the Obsidian Throne will either ascend to godhood or crumble to ash."
        ]
    },
    amber: {
        name: "The Amber Courts",
        subtitle: "Merchant Republic of Golden Prosperity",
        color: "amber",
        capital: "Aurelia",
        founded: "Age of Dawn, Year 542",
        leader: "The Council of Merchants",
        population: "4.1 million",
        exports: ["Spices", "Silks", "Gold", "Information"],
        imports: ["Raw Materials", "Slaves", "Exotic Goods", "Weapons"],
        history: [
            "Born not from conquest but from commerce, the Amber Courts emerged when a coalition of merchant guilds united to protect their trade routes from bandits and pirates.",
            "The city of Aurelia grew rich on the crossroads of ancient trade, becoming the financial heart of the known world. Banks here issue loans to kings, and merchant ships fly the amber flag across every sea.",
            "Unlike the hereditary monarchies around them, the Courts are ruled by a council of the wealthiest merchants, elected annually from among their number."
        ],
        trade: [
            "The Amber Courts are the undisputed masters of long-distance trade. Their merchant fleet is the largest in existence, and their caravans travel every road.",
            "Information is their most valuable export. Spies and scholars alike pay handsomely for the intelligence gathered by their network of agents.",
            "Their banking system is revolutionary, allowing merchants from distant lands to conduct business without carrying gold."
        ],
        myths: [
            "Legend says the first merchant made a deal with the Merchant God, trading eternal wealth for the souls of those who die in debt.",
            "The Amber Lighthouse is said to glow with golden light that never fades, a gift from the sun god to the first merchant who sheltered there.",
            "It is whispered that the Council possesses a map showing every treasure that has ever existed, lost or found."
        ]
    },
    crimson: {
        name: "The Crimson Sands",
        subtitle: "Desert Kingdom of the Sun Pharaohs",
        color: "crimson",
        capital: "Kemet-Ra",
        founded: "Age of Dawn, Year 203",
        leader: "The Living Pharaoh",
        population: "1.8 million",
        exports: ["Gold", "Spices", "Glass", "Mummies"],
        imports: ["Water", "Wood", "Metal Ore", "Fine Wines"],
        history: [
            "In the endless desert, where water is life and the sun is god, the Crimson Sands rose from the ashes of a thousand small tribes into a unified kingdom under the divine rule of the Pharaohs.",
            "The great pyramids were built not as tombs but as temples, each one a beacon calling the faithful to worship. The largest, the Pyramid of Eternal Sun, has stood for four thousand years.",
            "Their culture is among the oldest in existence, and they guard their traditions jealously. Outsiders are viewed with suspicion, though trade is permitted in designated oases."
        ],
        trade: [
            "Gold flows like water in the Crimson Sands, and their gold-to-goods ratio is the most favorable in the world. The desert kingdom is rich beyond measure.",
            "Their glass artisans produce the finest glass in existence, from clear crystal to colored stained glass that never fades.",
            "Water is their most critical import, and those who control the water routes control the kingdom's fate."
        ],
        myths: [
            "The Pharaohs are considered living gods, reincarnations of Ra himself. Upon death, their souls join the sun in its eternal journey.",
            "Beneath the pyramids lie libraries of knowledge, guarded by the Mummy Priests who animate the preserved dead to protect these secrets.",
            "The Desert God Set still wanders the wastes, appearing to those lost travelers who show courage in the face of death."
        ]
    },
    jade: {
        name: "The Jade Peninsula",
        subtitle: "Island Chain of the Sea Spirits",
        color: "jade",
        capital: "Coralheim",
        founded: "Age of Crowns, Year 89",
        leader: "The Tide Council",
        population: "1.2 million",
        exports: ["Pearls", "Exotic Fish", "Coral", "Sea Herbs"],
        imports: ["Timber", "Stone", "Ceramics", "Metalwork"],
        history: [
            "The Jade Peninsula is not a single nation but a loose confederation of island kingdoms, each ruling their own atoll while uniting for defense and trade.",
            "Their civilization is younger than the mainland powers, emerging during the Age of Crowns when refugees from a great war fled to the islands.",
            "The sea is their life blood. Every citizen learns to sail before they walk, and their naval prowess is legendary."
        ],
        trade: [
            "Pearls of extraordinary quality are the Jade Peninsula's most famous export. The oysters here produce pearls of perfect roundness and luster.",
            "Their coral, harvested sustainably, is prized by architects and healers alike. It is said to have mystical properties when properly prepared.",
            "Sea herbs from their islands cure many ailments unknown to mainland medicine."
        ],
        myths: [
            "The Sea Spirits are worshipped here, and every ship carries an effigy to ensure safe passage. Offerings are made at dawn and dusk.",
            "The Drowned Library is said to contain the complete knowledge of an ancient civilization that sank beneath the waves.",
            "It is believed that if you listen to the waves at midnight, you can hear the voices of the Sea Spirits whispering secrets of the deep."
        ]
    },
    silver: {
        name: "The Silver Peaks",
        subtitle: "Mountain Kingdom of the Sky Lords",
        color: "silver",
        capital: "Everwinter",
        founded: "Age of Dawn, Year 788",
        leader: "The Mountain King",
        population: "890,000",
        exports: ["Silver Ore", "Gems", "Fine Metalwork", "Snow Rhinos"],
        imports: ["Food", "Wood", "Textiles", "Luxury Goods"],
        history: [
            "High in the mountains where the air is thin and the snow never melts, the Silver Peaks carved their civilization from the living rock. Their cities are wonders of engineering, carved into cliff faces.",
            "The Sky Lords, as they call themselves, are Isolationists by nature. The harsh mountains protect them from invasion, and their height gives them a view of approaching threats no enemy can surprise them.",
            "Their metallurgical skills are unmatched. Silver mined here is the purest in the world, and their weapons and armor command premium prices."
        ],
        trade: [
            "Silver and gems flow from the mountain mines, making the Silver Peaks wealthy despite their small population.",
            "Their fine metalwork, especially weapons and armor, is sought by every warrior in the known world.",
            "Food imports are a constant need, as the mountain soil cannot support agriculture. Trade routes through the mountain passes are vital."
        ],
        myths: [
            "The Sky Lords claim descent from the clouds themselves. It is said their first king was born from a lightning strike on the highest peak.",
            "In the highest peaks, the Frost Giants are said to still dwell, sleeping in ice caves for centuries before emerging.",
            "The Crystal Cave beneath Everwinter contains a gem that shows the future to whoever gazes into it. It is guarded day and night."
        ]
    }
};

// ==================== MYTH ANNOTATION DATA ====================
const MYTH_DATA = {
    dragonspine: {
        title: "The Dragon Spine Mountains",
        content: "It is said that when the world was young, a great dragon fell here, and where its bones pierced the earth, mountains rose. The peaks glow with an inner fire, and those who climb them report whispers of ancient wisdom."
    },
    weeping: {
        title: "The Bay of Weeping",
        content: "Fishermen avoid these waters, for the currents sing mournful songs at dusk. It is believed the bay holds the tears of a goddess mourning her fallen lover, and anyone who hears the song becomes forever homesick."
    },
    garden: {
        title: "Garden of Perpetual Shadow",
        content: "Trees here grow without sun, feeding on moonlight alone. The fruits they bear grant visions of possible futures, though often at the cost of peaceful sleep."
    },
    temple: {
        title: "Temple of the First Sun",
        content: "Built where the first rays of sunlight touched the world, this temple's golden walls have never known shadow. Pilgrims travel for months to stand in its eternal dawn."
    },
    library: {
        title: "The Drowned Library",
        content: "An entire archive of ancient knowledge, submerged beneath the waves. Scholars with the gift of breathing underwater sometimes recover scrolls, though many go mad from what they read."
    }
};

// ==================== DOM ELEMENTS ====================
const DOM = {};

// ==================== INITIALIZATION ====================
function init() {
    cacheDOMElements();
    setupEventListeners();
    initAnimations();
    updateEraDisplay(CONFIG.currentEra);
    updateRegionPaths();
    updateTimelineUI();
    console.log("The Shattered Realms Atlas initialized successfully.");
}

function cacheDOMElements() {
    DOM.atlasMap = document.getElementById('atlasMap');
    DOM.regions = document.querySelectorAll('.region');
    DOM.annotations = document.querySelectorAll('.annotation');
    DOM.tradeRoutes = document.getElementById('tradeRoutes');
    DOM.timelineSlider = document.getElementById('timelineSlider');
    DOM.timelineProgress = document.getElementById('timelineProgress');
    DOM.timelineLabels = document.querySelectorAll('.timeline-label');
    DOM.currentEraDisplay = document.getElementById('currentEraDisplay');
    DOM.eraDescription = document.getElementById('eraDescription');
    DOM.loreModal = document.getElementById('loreModal');
    DOM.loreModalClose = document.getElementById('loreModalClose');
    DOM.loreModalTitle = document.getElementById('loreModalTitle');
    DOM.loreModalSubtitle = document.getElementById('loreModalSubtitle');
    DOM.loreModalBody = document.getElementById('loreModalBody');
    DOM.loreTabs = document.querySelectorAll('.lore-tab');
    DOM.selectedInfo = document.getElementById('selectedInfo');
    DOM.annotationTooltip = document.getElementById('annotationTooltip');
    DOM.legendItems = document.querySelectorAll('.legend-item[data-region]');
    DOM.compassRose = document.querySelector('.compass-rose');
}

function setupEventListeners() {
    DOM.regions.forEach(function(region) {
        region.addEventListener('click', handleRegionClick);
        region.addEventListener('mouseenter', handleRegionHover);
        region.addEventListener('mouseleave', handleRegionLeave);
    });

    DOM.annotations.forEach(function(annotation) {
        annotation.addEventListener('click', handleAnnotationClick);
        annotation.addEventListener('mouseenter', handleAnnotationHover);
        annotation.addEventListener('mouseleave', handleAnnotationLeave);
    });

    DOM.timelineSlider.addEventListener('input', handleTimelineChange);
    DOM.timelineSlider.addEventListener('change', handleTimelineCommit);

    DOM.timelineLabels.forEach(function(label) {
        label.addEventListener('click', handleTimelineLabelClick);
    });

    DOM.loreModalClose.addEventListener('click', closeLoreModal);
    var backdrop = DOM.loreModal.querySelector('.lore-modal-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeLoreModal);
    }

    DOM.loreTabs.forEach(function(tab) {
        tab.addEventListener('click', handleTabClick);
    });

    DOM.legendItems.forEach(function(item) {
        item.addEventListener('click', handleLegendClick);
        item.addEventListener('mouseenter', handleLegendHover);
        item.addEventListener('mouseleave', handleLegendLeave);
    });

    if (DOM.compassRose) {
        DOM.compassRose.addEventListener('click', handleCompassClick);
    }

    document.addEventListener('keydown', handleKeyboard);

    setTimeout(function() {
        animateTradeRoutes();
    }, 1000);
}

// ==================== EVENT HANDLERS ====================
function handleRegionClick(e) {
    var regionId = e.currentTarget.id.replace('region-', '');
    var regionData = REGION_DATA[regionId];
    if (!regionData) return;

    DOM.regions.forEach(function(r) { r.classList.remove('active'); });
    e.currentTarget.classList.add('active');
    CONFIG.selectedRegion = regionId;

    openLoreModal(regionData);
    updateSelectedInfo(regionData);
}

function handleRegionHover(e) {
    e.currentTarget.style.filter = 'brightness(1.15)';
}

function handleRegionLeave(e) {
    e.currentTarget.style.filter = '';
}

function handleAnnotationClick(e) {
    var annotationId = e.currentTarget.id.replace('ann-', '');
    var mythData = MYTH_DATA[annotationId];
    if (!mythData) return;

    highlightMythology(annotationId);
    showAnnotationTooltip(mythData, e);
}

function handleAnnotationHover(e) {
    var annotationId = e.currentTarget.id.replace('ann-', '');
    var mythData = MYTH_DATA[annotationId];
    if (mythData) {
        showAnnotationTooltip(mythData, e);
        highlightMythology(annotationId);
    }
}

function handleAnnotationLeave() {
    hideAnnotationTooltip();
    unhighlightAllMythology();
}

function handleTimelineChange(e) {
    var eraIndex = parseInt(e.target.value, 10);
    updateEraDisplay(eraIndex);
}

function handleTimelineCommit(e) {
    var eraIndex = parseInt(e.target.value, 10);
    CONFIG.currentEra = eraIndex;
    updateRegionPaths();
    updateTimelineUI();
    animateEraTransition();
}

function handleTimelineLabelClick(e) {
    var eraIndex = parseInt(e.currentTarget.dataset.era, 10);
    DOM.timelineSlider.value = eraIndex;
    CONFIG.currentEra = eraIndex;
    updateEraDisplay(eraIndex);
    updateRegionPaths();
    updateTimelineUI();
    animateEraTransition();
}

function handleTabClick(e) {
    var tabType = e.currentTarget.dataset.tab;

    DOM.loreTabs.forEach(function(tab) { tab.classList.remove('active'); });
    e.currentTarget.classList.add('active');

    if (CONFIG.selectedRegion) {
        var regionData = REGION_DATA[CONFIG.selectedRegion];
        updateModalContent(regionData, tabType);
    }
}

function handleLegendClick(e) {
    var regionId = e.currentTarget.dataset.region;
    var region = document.getElementById('region-' + regionId);
    if (region) {
        region.dispatchEvent(new Event('click'));
    }
}

function handleLegendHover(e) {
    var regionId = e.currentTarget.dataset.region;
    var region = document.getElementById('region-' + regionId);
    if (region) {
        region.style.filter = 'brightness(1.1)';
    }
    e.currentTarget.classList.add('active');
}

function handleLegendLeave(e) {
    var regionId = e.currentTarget.dataset.region;
    var region = document.getElementById('region-' + regionId);
    if (region) {
        region.style.filter = '';
    }
    e.currentTarget.classList.remove('active');
}

function handleCompassClick() {
    if (DOM.compassRose) {
        DOM.compassRose.style.transition = 'transform 0.5s ease';
        DOM.compassRose.style.transform = 'rotate(360deg)';
        setTimeout(function() {
            DOM.compassRose.style.transform = '';
        }, 500);
    }
    showCompassFact();
}

function handleKeyboard(e) {
    if (e.key === 'Escape') {
        closeLoreModal();
        hideAnnotationTooltip();
    }
    if (e.key === 'ArrowLeft' && document.activeElement === document.body) {
        var newValue = Math.max(0, CONFIG.currentEra - 1);
        DOM.timelineSlider.value = newValue;
        CONFIG.currentEra = newValue;
        updateEraDisplay(newValue);
        updateRegionPaths();
        updateTimelineUI();
    }
    if (e.key === 'ArrowRight' && document.activeElement === document.body) {
        var newValue = Math.min(3, CONFIG.currentEra + 1);
        DOM.timelineSlider.value = newValue;
        CONFIG.currentEra = newValue;
        updateEraDisplay(newValue);
        updateRegionPaths();
        updateTimelineUI();
    }
}

// ==================== UI UPDATE FUNCTIONS ====================
function updateEraDisplay(eraIndex) {
    var eraNames = {
        0: 'Age of Dawn',
        1: 'Age of Crowns',
        2: 'Age of Ruin',
        3: 'Age of Rebirth'
    };

    if (DOM.currentEraDisplay) {
        DOM.currentEraDisplay.textContent = eraNames[eraIndex];
    }
    if (DOM.eraDescription) {
        var eraText = DOM.eraDescription.querySelector('.era-text');
        if (eraText) {
            eraText.textContent = CONFIG.eraDescriptions[CONFIG.eras[eraIndex]];
        }
    }
}

function updateTimelineUI() {
    var progress = (CONFIG.currentEra / 3) * 100;
    if (DOM.timelineProgress) {
        DOM.timelineProgress.style.width = progress + '%';
    }
    DOM.timelineLabels.forEach(function(label) {
        var labelEra = parseInt(label.dataset.era, 10);
        if (labelEra === CONFIG.currentEra) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
}

function updateRegionPaths() {
    var eraKey = CONFIG.eras[CONFIG.currentEra];
    var eraKeyCapitalized = eraKey.charAt(0).toUpperCase() + eraKey.slice(1);

    DOM.regions.forEach(function(region) {
        var pathElement = region.querySelector('.region-path');
        var dataKey = 'era' + eraKeyCapitalized;
        if (pathElement && region.dataset[dataKey]) {
            pathElement.setAttribute('d', region.dataset[dataKey]);
        }
    });
}

function updateSelectedInfo(regionData) {
    if (!DOM.selectedInfo) return;

    DOM.selectedInfo.classList.add('has-content');
    DOM.selectedInfo.innerHTML =
        '<h4 style="font-family: Cinzel, serif; color: #8b6914; margin-bottom: 0.5rem;">' + regionData.name + '</h4>' +
        '<p style="font-size: 0.9rem; color: #4a3828; margin-bottom: 0.5rem;"><strong>Capital:</strong> ' + regionData.capital + '</p>' +
        '<p style="font-size: 0.9rem; color: #4a3828; margin-bottom: 0.5rem;"><strong>Population:</strong> ' + regionData.population + '</p>' +
        '<p style="font-size: 0.9rem; color: #4a3828;"><strong>Leader:</strong> ' + regionData.leader + '</p>' +
        '<p style="font-size: 0.85rem; color: #6b5344; font-style: italic; margin-top: 0.5rem;">Click the region for full details...</p>';
}

function highlightMythology(mythId) {
    document.querySelectorAll('.myth-entry').forEach(function(entry) {
        entry.classList.remove('highlighted');
    });
    var mythEntry = document.getElementById('myth-' + mythId);
    if (mythEntry) {
        mythEntry.classList.add('highlighted');
        mythEntry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function unhighlightAllMythology() {
    document.querySelectorAll('.myth-entry').forEach(function(entry) {
        entry.classList.remove('highlighted');
    });
}

// ==================== MODAL FUNCTIONS ====================
function openLoreModal(regionData) {
    if (!DOM.loreModal) return;

    DOM.loreModalTitle.textContent = regionData.name;
    DOM.loreModalSubtitle.textContent = regionData.subtitle;
    updateModalContent(regionData, 'history');

    DOM.loreTabs.forEach(function(tab) { tab.classList.remove('active'); });
    var historyTab = document.querySelector('.lore-tab[data-tab="history"]');
    if (historyTab) {
        historyTab.classList.add('active');
    }

    DOM.loreModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLoreModal() {
    if (!DOM.loreModal) return;
    DOM.loreModal.classList.remove('active');
    document.body.style.overflow = '';
    DOM.regions.forEach(function(r) { r.classList.remove('active'); });
    CONFIG.selectedRegion = null;
}

function updateModalContent(regionData, tabType) {
    if (!DOM.loreModalBody) return;
    var content = '';

    switch(tabType) {
        case 'history':
            content = generateHistoryContent(regionData);
            break;
        case 'trade':
            content = generateTradeContent(regionData);
            break;
        case 'myths':
            content = generateMythsContent(regionData);
            break;
    }

    DOM.loreModalBody.innerHTML = content;
}

function generateHistoryContent(regionData) {
    var historyHtml = '<h3>Historical Overview</h3>' +
        '<p><strong>Founded:</strong> ' + regionData.founded + '</p>' +
        '<p><strong>Capital:</strong> ' + regionData.capital + '</p>' +
        '<p><strong>Current Leader:</strong> ' + regionData.leader + '</p>';

    regionData.history.forEach(function(p) {
        historyHtml += '<p>' + p + '</p>';
    });

    return historyHtml;
}

function generateTradeContent(regionData) {
    var tradeHtml = '<h3>Economic Profile</h3>' +
        '<p><strong>Population:</strong> ' + regionData.population + '</p>' +
        '<h4>Major Exports</h4><ul>';

    regionData.exports.forEach(function(e) {
        tradeHtml += '<li>' + e + '</li>';
    });

    tradeHtml += '</ul><h4>Primary Imports</h4><ul>';

    regionData.imports.forEach(function(i) {
        tradeHtml += '<li>' + i + '</li>';
    });

    tradeHtml += '</ul><h3>Trade Relations</h3>' +
        '<p>The ' + regionData.name + ' maintains active trade routes with neighboring civilizations. Their merchant guilds are known for fair dealing and their goods are highly prized across the known world.</p>';

    return tradeHtml;
}

function generateMythsContent(regionData) {
    var mythsHtml = '<h3>Mythology & Legend</h3>';

    regionData.myths.forEach(function(m) {
        mythsHtml += '<p>' + m + '</p>';
    });

    mythsHtml += '<h3>Religious Practices</h3>' +
        '<p>The people of ' + regionData.name + ' follow ancient traditions passed down through generations. Their priests and priestesses maintain sacred sites and perform rituals that are said to keep the gods favorable.</p>';

    return mythsHtml;
}

// ==================== TOOLTIP FUNCTIONS ====================
function showAnnotationTooltip(mythData, event) {
    if (!DOM.annotationTooltip) return;

    var tooltip = DOM.annotationTooltip;
    tooltip.querySelector('.tooltip-title').textContent = mythData.title;
    tooltip.querySelector('.tooltip-content').textContent = mythData.content;

    var x = event.pageX + 20;
    var y = event.pageY + 20;
    var maxX = window.innerWidth - 300;
    var maxY = window.innerHeight - 150;

    tooltip.style.left = Math.min(x, maxX) + 'px';
    tooltip.style.top = Math.min(y, maxY) + 'px';
    tooltip.classList.add('active');
}

function hideAnnotationTooltip() {
    if (!DOM.annotationTooltip) return;
    DOM.annotationTooltip.classList.remove('active');
}

// ==================== ANIMATION FUNCTIONS ====================
function initAnimations() {
    DOM.regions.forEach(function(region, index) {
        region.style.opacity = '0';
        region.style.transform = 'scale(0.9)';
        setTimeout(function() {
            region.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            region.style.opacity = '1';
            region.style.transform = 'scale(1)';
        }, 100 + (index * 150));
    });
}

function animateTradeRoutes() {
    var routes = document.querySelectorAll('.route');
    routes.forEach(function(route, index) {
        var path = route.querySelector('.route-path');
        if (!path) return;

        var icon = route.querySelector('.route-icon');
        if (icon && path.getAttribute('d')) {
            var pathData = path.getAttribute('d');
            icon.style.offsetPath = 'path(\'' + pathData + '\')';
            icon.style.offsetDistance = '0%';

            var isSea = route.classList.contains('route-sea');
            var isMountain = route.classList.contains('route-mountain');
            var duration = isSea ? 8000 : (isMountain ? 12000 : 6000);

            icon.animate([
                { offsetDistance: '0%', opacity: 0 },
                { offsetDistance: '10%', opacity: 1 },
                { offsetDistance: '90%', opacity: 1 },
                { offsetDistance: '100%', opacity: 0 }
            ], {
                duration: duration,
                iterations: Infinity,
                easing: 'linear',
                delay: index * 2000
            });
        }
    });
}

function animateEraTransition() {
    DOM.regions.forEach(function(region) {
        region.style.transition = 'filter 0.3s ease';
        region.style.filter = 'brightness(1.5)';
        setTimeout(function() {
            region.style.filter = '';
        }, 300);
    });

    if (DOM.timelineProgress) {
        DOM.timelineProgress.style.transition = 'none';
        DOM.timelineProgress.style.width = '0%';
        setTimeout(function() {
            DOM.timelineProgress.style.transition = 'width 0.5s ease';
            DOM.timelineProgress.style.width = ((CONFIG.currentEra / 3) * 100) + '%';
        }, 50);
    }
}

function showCompassFact() {
    var facts = [
        "The compass was first created by the Silver Peaks, who discovered that certain crystals point always to the true north.",
        "Merchants from the Amber Courts were the first to use the compass for navigation, revolutionizing trade.",
        "The four directions are said to be guarded by ancient spirits: North by the Frost Giant, South by the Sun Phoenix, East by the Dawn Dragon, and West by the Twilight Serpent.",
        "According to legend, the first compass was made from the tooth of a great sea creature, gifted to humanity by the Sea Spirits."
    ];

    var randomFact = facts[Math.floor(Math.random() * facts.length)];
    var compass = document.querySelector('.compass-rose');

    if (compass) {
        var tooltip = document.createElement('div');
        tooltip.className = 'compass-fact-tooltip';
        tooltip.innerHTML = '<p style="font-family: Cormorant Garamond, serif; font-style: italic; font-size: 0.9rem; color: #2a1810; margin: 0;">' + randomFact + '</p>';
        tooltip.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(145deg, #e8dcc8, #d4c4a8); border: 2px solid #c9a227; border-radius: 8px; padding: 1rem; max-width: 400px; z-index: 1000; box-shadow: 0 4px 20px rgba(42, 24, 16, 0.3); opacity: 0; transition: opacity 0.3s ease;';

        document.body.appendChild(tooltip);
        setTimeout(function() {
            tooltip.style.opacity = '1';
        }, 50);
        setTimeout(function() {
            tooltip.style.opacity = '0';
            setTimeout(function() {
                tooltip.remove();
            }, 300);
        }, 4000);
    }
}

// ==================== INITIALIZE ON DOM READY ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==================== DEBUG EXPORT ====================
window.AtlasDebug = {
    CONFIG: CONFIG,
    REGION_DATA: REGION_DATA,
    updateEra: function(era) {
        DOM.timelineSlider.value = era;
        CONFIG.currentEra = era;
        updateEraDisplay(era);
        updateRegionPaths();
        updateTimelineUI();
    },
    getSelectedRegion: function() {
        return CONFIG.selectedRegion;
    },
    openRegion: function(id) {
        var region = document.getElementById('region-' + id);
        if (region) {
            region.dispatchEvent(new Event('click'));
        }
    },
    closeModal: closeLoreModal
};