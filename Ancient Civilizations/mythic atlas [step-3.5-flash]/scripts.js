/* ========================================
   CHRONICLES OF THE ANCIENT WORLD
   Interactive Atlas - JavaScript
   ======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // DATA STRUCTURES
    // ========================================
    
    const eraData = [
        {
            name: "The Age of Foundations",
            year: "-3000 to -2000",
            description: "The dawn of civilization. First cities rise along rivers and in fertile valleys."
        },
        {
            name: "The Era of Expansion",
            year: "-2000 to -1000",
            description: "Empires grow through trade and conquest. Roads and sea routes connect distant lands."
        },
        {
            name: "The Golden Age",
            year: "-1000 to 0",
            description: "Peak of cultural and technological achievement. Great wonders are built."
        },
        {
            name: "The Age of Decline",
            year: "0 to +500",
            description: "Empires fracture. Trade routes become dangerous. Civilizations retreat."
        },
        {
            name: "The Legacy Era",
            year: "+500 to +1200",
            description: "Ruins of great cities remain. New kingdoms rise from the ashes."
        }
    ];

    const regionData = {
        'northern-kingdom': {
            name: 'Northern Kingdom',
            capital: 'Frosthold',
            government: 'Monarchy',
            population: '~2.5 million',
            lore: `The Northern Kingdom emerged from the harsh tundra and pine forests, where survival required cooperation and strength. Founded by warrior-chief Rurik the Unbroken in -2850, the kingdom unified scattered tribes through a combination of military prowess and strategic marriages.

The Northerners are known for their stonemasonry, building massive fortresses from glacial rock. Their runic writing system, carved into standing stones and metal tablets, tells stories of heroic deeds and bitter winters.

Religion centers around the Allfather, a sky deity who watches over battles, and the Earth Mother, who governs harvests and fertility. The famous Frosthold Citadel, carved into a mountain, has never fallen to siege.`,
            trade: [
                { route: 'Amber Road', partners: ['Mountain Clans', 'River Valley'], goods: 'Furs, amber, iron, walrus ivory' },
                { route: 'Northern Sea Lane', partners: ['Coastal Federation'], goods: 'Timber, fish, whale oil' }
            ],
            mythology: `The Northern creation myth tells of the world being formed from the body of the primordial giant Ymir. The Allfather and his brothers killed Ymir and used his flesh for earth, blood for seas, bones for mountains, and skull for sky.

The famous myth of the Twilight of the Gods prophesies a final battle where the world will be submerged and reborn, with the righteous living in a golden hall where mead flows forever.

The Northern shamans, called Seidrmen, can enter trance states to see the future in the patterns of smoke and blood.`,
            timeline: [
                { year: '-2850', event: 'Rurik the Unbroken unites the northern tribes' },
                { year: '-2500', event: 'Construction of Frosthold Citadel begins' },
                { year: '-1800', event: 'First runic inscriptions carved at the Standing Stones of Ulf' },
                { year: '-1200', event: 'Northern expansion reaches the River Valley' },
                { year: '-800', event: 'The Great Famine - three years of failed harvests' },
                { year: '-300', event: 'King Halvar the Wise establishes the Council of Jarls' },
                { year: '+200', event: 'Last recorded runic inscription before the Decline' }
            ]
        },
        'desert-empire': {
            name: 'Desert Empire',
            capital: 'Solaris',
            government: 'Pharaonic Theocracy',
            population: '~4.2 million',
            lore: `The Desert Empire rose from the sands where the great river Orsus creates a fertile ribbon through the desert. The Empire is ruled by the Living God-Pharaoh, believed to be the earthly incarnation of the sun god Ra-Atum.

The Empire is famous for its monumental architecture: pyramids that pierce the sky, temples with hypostyle halls of towering columns, and obelisks that cast precise shadows marking the solstices. Their scribes developed one of the world's first writing systems using pictographs that evolved into hieroglyphs.

The Empire's wealth comes from controlling the desert oases and the river trade. Their engineers built elaborate irrigation systems, including the Great Canal that distributes river water to desert farms.`,
            trade: [
                { route: 'River Orsus Trade Route', partners: ['River Valley Civilization', 'Southern Jungles'], goods: 'Grain, papyrus, linen, glass, precious metals' },
                { route: 'Desert Caravan Trails', partners: ['Mountain Clans', 'Coastal Federation'], goods: 'Spices, incense, gemstones, exotic animals' }
            ],
            mythology: `The Desert Empire believes in a cosmic battle between Ra-Atum (order, light, creation) and Apophis (chaos, darkness, destruction). Each night, Ra travels through the underworld in his solar barque, fighting Apophis to ensure the sun rises again.

The Pharaoh is the intermediary between gods and humans, responsible for maintaining Ma'at (cosmic order). When the Pharaoh dies, he becomes one with Osiris, god of the dead, and judges souls in the Hall of Two Truths.

The famous myth of the Deluge tells how the gods once flooded the world to destroy humanity, but Ra-Atum saved one family in a boat built from sacred acacia wood.`,
            timeline: [
                { year: '-3100', event: 'Unification of Upper and Lower Desert lands by Pharaoh Narmer' },
                { year: '-2600', event: 'Construction of the Great Pyramid of Solaris' },
                { year: '-2000', event: 'Empire reaches maximum extent, controlling all oases' },
                { year: '-1500', event: 'The Hyskos invasion - foreign rulers for 100 years' },
                { year: '-1000', event: 'Reconquest and New Kingdom period begins' },
                { year: '-500', event: 'First recorded drought in the Great Oracle\'s records' },
                { year: '+100', event: 'Last Pharaoh completes the Temple of the Setting Sun' }
            ]
        },
        'river-valley': {
            name: 'River Valley Civilization',
            capital: 'Mether',
            government: 'Priest-King Council',
            population: '~3.8 million',
            lore: `The River Valley Civilization flourished between the great rivers Serpent and Dragon, where annual floods deposited rich silt. Their society was the first to develop urban planning with grid-pattern cities, advanced drainage systems, and standardized bricks.

Their writing system, cuneiform, began as pictographs on clay tablets and evolved into abstract wedge-shaped marks. They invented the wheel, the plow, and developed sophisticated mathematics based on base-60.

Their cities featured massive stepped temples called ziggurats, where priests observed the stars and performed rituals to ensure fertile floods. The Code of Mether, one of the earliest law codes, established fines and punishments based on social class.`,
            trade: [
                { route: 'River Serpent Trade', partners: ['Desert Empire', 'Mountain Clans'], goods: 'Grain, textiles, pottery, copper tools' },
                { route: 'Dragon River Route', partners: ['Southern Jungles', 'Coastal Federation'], goods: 'Timber, precious stones, exotic spices' }
            ],
            mythology: `The River Valley people believed in countless deities associated with natural forces. Enki, god of water and wisdom, created humans from clay to serve the gods. Inanna, goddess of love and war, descended to the underworld and was resurrected through the intervention of the wise god Enki.

The famous Epic of Gilgamesh tells of the hero-king who sought immortality after his friend Enkidu died. He journeyed to the world's edge, met the flood survivor Utnapishtim, and learned that immortality is reserved for the gods.

Their afterlife belief involved a shadowy underworld where all souls, regardless of earthly deeds, ate dust. Only special rituals could improve one's condition.`,
            timeline: [
                { year: '-3500', event: 'First cities built at Mether and Ur' },
                { year: '-3100', event: 'Invention of cuneiform writing' },
                { year: '-2700', event: 'The Epic of Gilgamesh first inscribed' },
                { year: '-2200', event: 'Construction of the Great Ziggurat of Mether' },
                { year: '-1800', event: 'Code of Mether established by King Hammurabi' },
                { year: '-1200', event: 'Invasion by the Sea Peoples begins decline' },
                { year: '-500', event: 'Last cuneiform tablet written' }
            ]
        },
        'coastal-federation': {
            name: 'Coastal Federation',
            capital: 'Port Azure',
            government: 'Merchant Republic',
            population: '~2.1 million',
            lore: `The Coastal Federation is a loose alliance of port cities and island states united by maritime trade rather than conquest. Each city-state governs itself but sends representatives to the Council of Captains in Port Azure.

Their navy is unmatched, with swift galleys powered by both sails and oars. They developed the first true harbor systems with lighthouses, dry docks, and warehouses. Their alphabet, derived from earlier systems, is the simplest writing system in the world, making literacy accessible to common merchants.

The Federation's wealth comes from controlling sea trade routes. Their merchants have trading posts in every major civilization and are known for their honesty (enforced by strict mercantile laws) and their ability to calculate profits and losses with remarkable precision.`,
            trade: [
                { route: 'Azure Sea Lane', partners: ['Island Archipelago', 'Desert Empire'], goods: 'Fish, salt, purple dye, glassware' },
                { route: 'Eastern Ocean Route', partners: ['River Valley', 'Southern Jungles'], goods: 'Spices, tropical woods, precious metals' },
                { route: 'Northern Whaling Route', partners: ['Northern Kingdom'], goods: 'Whale oil, sealskins, dried fish' }
            ],
            mythology: `The Coastal people worship primarily sea deities. Their chief god is Poseidon, ruler of the oceans, who calms storms for pious sailors and wrecks ships of the impious. Their goddess of commerce and luck, Tyche, is depicted with a ship's prow crown and a cornucopia.

The famous myth of the Minotaur tells of a king who failed to sacrifice a white bull to Poseidon, causing his wife to fall in love with the bull and give birth to a half-man, half-bull monster. The hero Theseus later slew the creature in the labyrinth.

They believe that when sailors die, their souls go to the Elysian Fields, a blessed island where the weather is always perfect and fishing is abundant.`,
            timeline: [
                { year: '-2800', event: 'First seafaring vessels built using sewn planks' },
                { year: '-2200', event: 'Founding of the Council of Captains' },
                { year: '-1800', event: 'Construction of the Great Lighthouse of Port Azure' },
                { year: '-1400', event: 'Development of the first mercantile alphabet' },
                { year: '-900', event: 'Federation reaches peak trade with all known lands' },
                { year: '-200', event: 'Pirate confederacy begins attacking trade routes' },
                { year: '+300', event: 'Last recorded voyage to the Eastern Ocean' }
            ]
        },
        'mountain-clans': {
            name: 'Mountain Clans',
            capital: 'No central capital - clan based',
            government: 'Clan Chiefs Council',
            population: '~1.2 million',
            lore: `The Mountain Clans are not a unified nation but a confederation of independent clans who inhabit the rugged high peaks and deep valleys. Each clan controls its own territory, but they gather annually at the sacred Stone Circle for the Grand Council.

The Clans are masters of stonework, building entire villages into cliff faces and constructing sophisticated aqueducts that carry water for miles. Their metalworkers are renowned for forging the finest steel, which they trade for grain and other necessities.

Their society is based on honor, hospitality, and clan loyalty. Disputes are settled by the Council of Elders or by ritualized combat. Every adult male (and many women) carries a dagger at all times, as a weapon and a symbol of their freedom.`,
            trade: [
                { route: 'High Mountain Pass', partners: ['Northern Kingdom', 'River Valley'], goods: 'Iron, steel, gemstones, wool' },
                { route: 'Valley Trails', partners: ['Desert Empire'], goods: 'Copper, tin, horses, honey' }
            ],
            mythology: `The Mountain Clans worship the Earth Mother and the Mountain Father, who they believe created the world by piling stone upon stone. Their most sacred site is the Stone Circle, where standing stones align with the solstices and equinoxes.

The famous myth of the Golem tells how a rabbi shaped a man from clay and brought him to life with a sacred name. The Golem protected the clan from invaders but eventually had to be deactivated when it became too powerful.

They believe that after death, souls go to the Hall of Ancestors, a great hall beneath the mountains where warriors feast forever. Only those who died in battle or with honor gain entry.`,
            timeline: [
                { year: '-3000', event: 'First clan territories established in the high valleys' },
                { year: '-2400', event: 'Construction of the Cliffside Village of Khar' },
                { year: '-1800', event: 'Discovery of iron smelting in the Black Mountains' },
                { year: '-1200', event: 'The Great Clans War - 7 clans fight for control of the iron mines' },
                { year: '-600', event: 'The Council of Elders establishes the Code of Honor' },
                { year: '-100', event: 'Last great clan gathering at the Stone Circle' },
                { year: '+400', event: 'Most surface villages abandoned for hidden valley refuges' }
            ]
        },
        'southern-jungles': {
            name: 'Southern Jungles',
            capital: 'No central capital - city-states',
            government: 'Jaguar Priest Council',
            population: '~1.8 million',
            lore: `The Southern Jungles are a collection of city-states built among giant trees and along river tributaries. The people are expert farmers who grow maize, beans, squash, and cacao in terraced fields and floating gardens.

Their achievements include a complex calendar system more accurate than any other, a ball game with religious significance, and a vigesimal (base-20) number system that includes the concept of zero.

The Jaguar Priests, who rule each city-state, derive their power from their ability to communicate with the gods through hallucinogenic rituals. They perform human sacrifices to ensure rainfall and good harvests. Their stepped pyramids are covered in intricate carvings depicting gods and creation myths.`,
            trade: [
                { route: 'Jungle River Network', partners: ['River Valley', 'Island Archipelago'], goods: 'Cacao, rubber, jade, feathers, tropical hardwoods' },
                { route: 'Coastal Trade Canoes', partners: ['Coastal Federation'], goods: 'Salt, fish, pottery, cotton textiles' }
            ],
            mythology: `The Southern people believe the world has been created and destroyed four times. We live in the Fifth World, created when the gods raised the sky to make room for humans.

The Hero Twins, Hunahpu and Xbalanque, defeated the lords of the underworld in a ball game, then became the sun and moon. Their story explains the cycle of life, death, and rebirth.

The Jaguar God of the Underworld rules the land of the dead, where souls must pass through tests. Only those who were sacrificed or died in childbirth go directly to paradise; others must traverse the dark underworld.`,
            timeline: [
                { year: '-2000', event: 'First permanent settlements in the jungle clearings' },
                { year: '-1500', event: 'Development of the Long Count calendar' },
                { year: '-1000', event: 'Construction of the Great Ball Court at Tikal' },
                { year: '-500', event: 'Classic period - peak of city-state construction' },
                { year: '-200', event: 'First recorded drought begins 200-year decline' },
                { year: '+100', event: 'Abandonment of major cities begins' },
                { year: '+600', event: 'Last stelae carved at the last city-state' }
            ]
        },
        'island-archipelago': {
            name: 'Island Archipelago',
            capital: 'No central capital - island based',
            government: 'Island Chiefdoms',
            population: '~800,000',
            lore: `The Island Archipelago consists of hundreds of islands, each with its own chief who rules from a coastal fortress. The islands are connected by intricate networks of sea lanes known only to experienced navigators.

The Islanders are the greatest navigators in the world, using stars, wave patterns, bird flight paths, and even the color of the sea to navigate without instruments. Their double-hulled canoes can carry hundreds of people and trade goods across hundreds of miles.

Their society is stratified: chiefs and priests at the top, common farmers and fishermen in the middle, and slaves (usually prisoners or debtors) at the bottom. They are famous for their intricate tattoos, which tell the wearer's life story, and their elaborate featherwork.`,
            trade: [
                { route: 'Island Hopping Route', partners: ['Coastal Federation', 'Southern Jungles'], goods: 'Taro, yams, fish, pearls, obsidian' },
                { route: 'Long Voyage South', partners: ['Southern Jungles'], goods: 'Basalt, volcanic glass, sweet potatoes' }
            ],
            mythology: `The Islanders believe their islands were fished up from the sea depths by the hero Maui, who used a magic hook. Each island has a guardian spirit, usually an animal or natural feature, that must be respected.

The creation myth tells of the sky father and earth mother who were separated by their children. The sky father's tears became the ocean, and his sighs became the wind.

The most important ritual is the Makahiki festival, celebrating the harvest and peace. During this time, wars stop, games are played, and offerings are given to the gods. Human sacrifices are made to the war god during times of conflict.`,
            timeline: [
                { year: '-1200', event: 'First settlers arrive from the mainland' },
                { year: '-800', event: 'Development of the star navigation system' },
                { year: '-500', event: 'Construction of the first great heiau (temple) on the Sacred Isle' },
                { year: '-200', event: 'Peak of the island chiefdoms - 12 major islands united' },
                { year: '+100', event: 'First recorded contact with distant western islands' },
                { year: '+500', event: 'Beginning of the Great Division - islands stop trading' },
                { year: '+900', event: 'Last long-distance voyage recorded' }
            ]
        }
    };

    const tradeRoutesData = [
        { from: 'northern-kingdom', to: 'mountain-clans', type: 'land', eras: [0, 1, 2, 3, 4] },
        { from: 'northern-kingdom', to: 'coastal-federation', type: 'land', eras: [1, 2, 3] },
        { from: 'northern-kingdom', to: 'coastal-federation', type: 'sea', eras: [2, 3] },
        { from: 'desert-empire', to: 'river-valley', type: 'land', eras: [0, 1, 2, 3, 4] },
        { from: 'desert-empire', to: 'coastal-federation', type: 'land', eras: [1, 2, 3] },
        { from: 'desert-empire', to: 'southern-jungles', type: 'land', eras: [1, 2, 3] },
        { from: 'desert-empire', to: 'southern-jungles', type: 'river', eras: [2] },
        { from: 'river-valley', to: 'mountain-clans', type: 'land', eras: [0, 1, 2, 3] },
        { from: 'river-valley', to: 'southern-jungles', type: 'land', eras: [1, 2, 3] },
        { from: 'river-valley', to: 'coastal-federation', type: 'land', eras: [1, 2] },
        { from: 'river-valley', to: 'coastal-federation', type: 'river', eras: [2] },
        { from: 'river-valley', to: 'island-archipelago', type: 'sea', eras: [2, 3] },
        { from: 'coastal-federation', to: 'island-archipelago', type: 'sea', eras: [1, 2, 3, 4] },
        { from: 'coastal-federation', to: 'southern-jungles', type: 'sea', eras: [2, 3] },
        { from: 'mountain-clans', to: 'southern-jungles', type: 'land', eras: [2] },
        { from: 'southern-jungles', to: 'island-archipelago', type: 'sea', eras: [2, 3] }
    ];

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    
    const state = {
        currentEra: 0,
        selectedRegion: null,
        mapZoom: 1,
        mapPan: { x: 0, y: 0 },
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        tradeRouteAnimations: []
    };

    // ========================================
    // DOM ELEMENT CACHING
    // ========================================
    
    const elements = {
        eraSlider: document.getElementById('eraSlider'),
        timelineProgress: document.getElementById('timelineProgress'),
        currentEraDisplay: document.getElementById('currentEra'),
        eraYearDisplay: document.getElementById('eraYear'),
        markers: document.querySelectorAll('.marker'),
        worldMap: document.getElementById('worldMap'),
        tradeRoutes: document.getElementById('tradeRoutes'),
        regionDetails: document.getElementById('regionDetails'),
        regionInfo: document.getElementById('regionInfo'),
        regionTrade: document.getElementById('regionTrade'),
        tradeList: document.getElementById('tradeList'),
        regionMythology: document.getElementById('regionMythology'),
        mythText: document.getElementById('mythText'),
        regionEras: document.getElementById('regionEras'),
        eraList: document.getElementById('eraList'),
        closeDetails: document.getElementById('closeDetails'),
        zoomIn: document.getElementById('zoomIn'),
        zoomOut: document.getElementById('zoomOut'),
        resetView: document.getElementById('resetView'),
        mapWrapper: document.querySelector('.map-wrapper')
    };

    // ========================================
    // INITIALIZATION
    // ========================================
    
    function init() {
        // Convert data-era to data-eras for multi-era support
        document.querySelectorAll('.region').forEach(region => {
            const era = region.getAttribute('data-era');
            if (era) {
                region.setAttribute('data-eras', era);
                region.removeAttribute('data-era');
            }
        });

        // Set initial era
        updateEra(0);
        
        // Setup event listeners
        setupEventListeners();
        
        // Initial trade routes
        generateTradeRoutes();
        
        // Initial map transform
        applyMapTransform();
        
        // Add entrance animations
        setTimeout(() => {
            document.querySelectorAll('.region').forEach((region, index) => {
                setTimeout(() => {
                    region.style.opacity = '0';
                    region.style.transform = 'scale(0.8)';
                    region.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        region.style.opacity = '1';
                        region.style.transform = 'scale(1)';
                    }, 50);
                }, index * 100);
            });
        }, 300);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    function setupEventListeners() {
        // Timeline slider
        elements.eraSlider.addEventListener('input', handleEraChange);
        
        // Timeline markers
        elements.markers.forEach(marker => {
            marker.addEventListener('click', () => {
                const era = parseInt(marker.getAttribute('data-era'));
                elements.eraSlider.value = era;
                handleEraChange();
            });
        });

        // Region clicks
        document.querySelectorAll('.region').forEach(region => {
            region.addEventListener('click', handleRegionClick);
        });

        // Map controls
        elements.zoomIn.addEventListener('click', () => zoomMap(1.3));
        elements.zoomOut.addEventListener('click', () => zoomMap(0.7));
        elements.resetView.addEventListener('click', resetMapView);
        
        // Map pan and zoom
        elements.mapWrapper.addEventListener('wheel', handleWheel, { passive: false });
        elements.mapWrapper.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        // Touch support for mobile
        elements.mapWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
        elements.mapWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
        elements.mapWrapper.addEventListener('touchend', handleTouchEnd);
        
        // Close details panel
        elements.closeDetails.addEventListener('click', () => {
            elements.regionDetails.style.display = 'none';
            clearRegionSelection();
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
    }

    // ========================================
    // ERA MANAGEMENT
    // ========================================
    
    function handleEraChange() {
        const era = parseInt(elements.eraSlider.value);
        updateEra(era);
    }

    function updateEra(eraIndex) {
        state.currentEra = eraIndex;
        
        // Update displays
        elements.currentEraDisplay.textContent = eraData[eraIndex].name;
        elements.eraYearDisplay.textContent = eraData[eraIndex].year;
        
        // Update timeline progress
        const progress = (eraIndex / (eraData.length - 1)) * 100;
        elements.timelineProgress.style.width = `${progress}%`;
        
        // Update markers
        elements.markers.forEach(marker => {
            const markerEra = parseInt(marker.getAttribute('data-era'));
            marker.classList.toggle('active', markerEra === eraIndex);
        });
        
        // Update region visibility
        updateRegionVisibility();
        
        // Update trade routes
        generateTradeRoutes();
        
        // Update selected region info if one is selected
        if (state.selectedRegion) {
            showRegionInfo(state.selectedRegion);
        }
    }

    function updateRegionVisibility() {
        const regions = document.querySelectorAll('.region');
        const labels = document.querySelectorAll('.label');
        const labelMap = {};
        
        // Build label map
        labels.forEach(label => {
            labelMap[label.getAttribute('data-for')] = label;
        });
        
        // Update regions and labels
        regions.forEach(region => {
            const regionId = region.getAttribute('data-id');
            const eras = region.getAttribute('data-eras').split(',').map(e => parseInt(e.trim()));
            const isVisible = eras.includes(state.currentEra);
            
            region.style.display = isVisible ? 'block' : 'none';
            region.style.opacity = isVisible ? '1' : '0';
            
            // Update corresponding label
            const label = labelMap[regionId];
            if (label) {
                label.style.display = isVisible ? 'block' : 'none';
                label.style.opacity = isVisible ? '1' : '0';
            }
        });
    }

    // ========================================
    // REGION INTERACTIONS
    // ========================================
    
    function handleRegionClick(e) {
        e.stopPropagation();
        const regionId = e.target.getAttribute('data-id');
        selectRegion(regionId);
    }

    function selectRegion(regionId) {
        // Clear previous selection
        clearRegionSelection();
        
        // Set new selection
        state.selectedRegion = regionId;
        
        // Highlight region
        const region = document.querySelector(`.region[data-id="${regionId}"]`);
        if (region) {
            region.classList.add('active');
        }
        
        // Highlight label
        const label = document.querySelector(`.label[data-for="${regionId}"]`);
        if (label) {
            label.classList.add('highlight');
        }
        
        // Show details panel
        showRegionInfo(regionId);
        
        // Show panel with animation
        elements.regionDetails.style.display = 'block';
        elements.regionDetails.style.animation = 'none';
        setTimeout(() => {
            elements.regionDetails.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }

    function clearRegionSelection() {
        document.querySelectorAll('.region.active').forEach(region => {
            region.classList.remove('active');
        });
        document.querySelectorAll('.label.highlight').forEach(label => {
            label.classList.remove('highlight');
        });
        state.selectedRegion = null;
    }

    function showRegionInfo(regionId) {
        const data = regionData[regionId];
        if (!data) return;
        
        // Show region info
        elements.regionInfo.innerHTML = `
            <h3>${data.name}</h3>
            <p><strong>Capital:</strong> ${data.capital}</p>
            <p><strong>Government:</strong> ${data.government}</p>
            <p><strong>Population:</strong> ${data.population}</p>
            <hr style="border: 1px dashed var(--border-color); margin: 1rem 0;">
            <p>${data.lore}</p>
        `;
        
        // Show trade routes
        elements.regionTrade.style.display = 'block';
        elements.tradeList.innerHTML = '';
        
        data.trade.forEach(trade => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="trade-route-name">${trade.route}</span>
                <span class="trade-route-desc">With: ${trade.partners.join(', ')} | Goods: ${trade.goods}</span>
            `;
            elements.tradeList.appendChild(li);
        });
        
        // Show mythology
        elements.regionMythology.style.display = 'block';
        elements.mythText.innerHTML = `<p>${data.mythology}</p>`;
        
        // Show timeline
        elements.regionEras.style.display = 'block';
        elements.eraList.innerHTML = '';
        
        data.timeline.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="era-year">${item.year}:</span>
                <span class="era-event">${item.event}</span>
            `;
            elements.eraList.appendChild(li);
        });
    }

    // ========================================
    // TRADE ROUTES
    // ========================================
    
    function generateTradeRoutes() {
        // Clear existing trade routes
        const existingRoutes = elements.tradeRoutes.querySelectorAll('.trade-route-group');
        existingRoutes.forEach(route => route.remove());
        
        state.tradeRouteAnimations = [];
        
        // Generate new trade routes for current era
        tradeRoutesData.forEach(routeData => {
            if (!routeData.eras.includes(state.currentEra)) return;
            
            const fromRegion = document.querySelector(`.region[data-id="${routeData.from}"]`);
            const toRegion = document.querySelector(`.region[data-id="${routeData.to}"]`);
            
            if (!fromRegion || !toRegion) return;
            
            // Get center points of regions
            const fromCenter = getRegionCenter(fromRegion);
            const toCenter = getRegionCenter(toRegion);
            
            // Create trade route group
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('trade-route-group');
            
            // Create path
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const pathId = `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            path.setAttribute('id', pathId);
            path.setAttribute('d', getCurvedPath(fromCenter, toCenter, routeData.type));
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', routeData.type === 'sea' ? '#4682b4' : '#8b4513');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('stroke-dasharray', '8,4');
            path.setAttribute('opacity', '0.7');
            path.setAttribute('marker-end', 'url(#arrowhead)');
            
            // Add path animation
            animatePath(path);
            
            group.appendChild(path);
            
            // Create caravan/ship icon
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            const iconId = `icon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            icon.setAttribute('id', iconId);
            icon.setAttribute('href', routeData.type === 'sea' ? '#ship' : '#caravan');
            icon.setAttribute('width', '24');
            icon.setAttribute('height', '24');
            icon.setAttribute('fill', routeData.type === 'sea' ? '#4682b4' : '#8b4513');
            
            // Position icon at start of path
            icon.setAttribute('x', fromCenter.x - 12);
            icon.setAttribute('y', fromCenter.y - 12);
            
            // Animate icon along path
            animateIconAlongPath(icon, pathId, routeData.type === 'sea' ? 12 : 8);
            
            group.appendChild(icon);
            elements.tradeRoutes.appendChild(group);
            
            state.tradeRouteAnimations.push({ icon, pathId });
        });
    }

    function getRegionCenter(regionElement) {
        const bbox = regionElement.getBBox();
        return {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2
        };
    }

    function getCurvedPath(from, to, type) {
        // Create curved path between two points
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        
        // Add curvature based on type
        let offsetX = 0, offsetY = 0;
        if (type === 'sea') {
            // Sea routes curve more
            offsetX = (to.y - from.y) * 0.2;
            offsetY = (from.x - to.x) * 0.2;
        } else if (type === 'river') {
            // River routes follow gentle curves
            offsetX = (to.y - from.y) * 0.1;
            offsetY = (from.x - to.x) * 0.1;
        }
        
        // Create quadratic bezier curve
        return `M${from.x},${from.y} Q${midX + offsetX},${midY + offsetY} ${to.x},${to.y}`;
    }

    function animatePath(path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.animation = 'drawRoute 2s ease-out forwards';
    }

    function animateIconAlongPath(icon, pathId, duration) {
        const path = document.getElementById(pathId);
        if (!path) return;
        
        const length = path.getTotalLength();
        
        // Use requestAnimationFrame for smooth animation
        let startTime = null;
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            
            const point = path.getPointAtLength(progress * length);
            icon.setAttribute('x', point.x - 12);
            icon.setAttribute('y', point.y - 12);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Loop the animation
                setTimeout(() => {
                    startTime = null;
                    requestAnimationFrame(animate);
                }, 1000);
            }
        }
        
        requestAnimationFrame(animate);
    }

    // ========================================
    // MAP PAN & ZOOM
    // ========================================
    
    function handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const rect = elements.mapWrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        zoomMapAtPoint(delta, mouseX, mouseY);
    }

    function handleMouseDown(e) {
        if (e.target.closest('.region') || e.target.closest('.map-controls')) return;
        
        state.isDragging = true;
        state.dragStart = {
            x: e.clientX - state.mapPan.x,
            y: e.clientY - state.mapPan.y
        };
        elements.mapWrapper.style.cursor = 'grabbing';
    }

    function handleMouseMove(e) {
        if (!state.isDragging) return;
        
        state.mapPan.x = e.clientX - state.dragStart.x;
        state.mapPan.y = e.clientY - state.dragStart.y;
        applyMapTransform();
    }

    function handleMouseUp() {
        state.isDragging = false;
        elements.mapWrapper.style.cursor = 'grab';
    }

    // Touch support
    let touchStartDistance = 0;
    let initialZoom = 1;

    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            state.isDragging = true;
            state.dragStart = {
                x: touch.clientX - state.mapPan.x,
                y: touch.clientY - state.mapPan.y
            };
        } else if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            touchStartDistance = Math.sqrt(dx * dx + dy * dy);
            initialZoom = state.mapZoom;
        }
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1 && state.isDragging) {
            const touch = e.touches[0];
            state.mapPan.x = touch.clientX - state.dragStart.x;
            state.mapPan.y = touch.clientY - state.dragStart.y;
            applyMapTransform();
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = distance / touchStartDistance;
            state.mapZoom = Math.max(0.5, Math.min(3, initialZoom * scale));
            applyMapTransform();
        }
    }

    function handleTouchEnd() {
        state.isDragging = false;
    }

    function zoomMap(factor) {
        state.mapZoom = Math.max(0.5, Math.min(3, state.mapZoom * factor));
        applyMapTransform();
    }

    function zoomMapAtPoint(factor, pointX, pointY) {
        const oldZoom = state.mapZoom;
        const newZoom = Math.max(0.5, Math.min(3, oldZoom * factor));
        
        // Adjust pan to zoom towards point
        const zoomRatio = newZoom / oldZoom;
        state.mapPan.x = pointX - (pointX - state.mapPan.x) * zoomRatio;
        state.mapPan.y = pointY - (pointY - state.mapPan.y) * zoomRatio;
        state.mapZoom = newZoom;
        
        applyMapTransform();
    }

    function applyMapTransform() {
        elements.worldMap.style.transform = 
            `translate(${state.mapPan.x}px, ${state.mapPan.y}px) scale(${state.mapZoom})`;
        elements.tradeRoutes.style.transform = 
            `translate(${state.mapPan.x}px, ${state.mapPan.y}px) scale(${state.mapZoom})`;
    }

    function resetMapView() {
        state.mapZoom = 1;
        state.mapPan = { x: 0, y: 0 };
        applyMapTransform();
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================
    
    function handleKeyDown(e) {
        switch(e.key) {
            case 'Escape':
                elements.regionDetails.style.display = 'none';
                clearRegionSelection();
                break;
            case 'ArrowLeft':
                if (state.currentEra > 0) {
                    elements.eraSlider.value = state.currentEra - 1;
                    handleEraChange();
                }
                break;
            case 'ArrowRight':
                if (state.currentEra < eraData.length - 1) {
                    elements.eraSlider.value = state.currentEra + 1;
                    handleEraChange();
                }
                break;
            case '+':
            case '=':
                zoomMap(1.2);
                break;
            case '-':
                zoomMap(0.8);
                break;
            case '0':
                resetMapView();
                break;
        }
    }

    // ========================================
    // ANIMATION UTILITIES
    // ========================================
    
    // Add CSS for path animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes drawRoute {
            to {
                stroke-dashoffset: 0;
            }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        
        .region.active {
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // INITIALIZE APPLICATION
    // ========================================
    
    init();
});