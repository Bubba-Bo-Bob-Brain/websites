/* ============================================
   ATLAS OF AETHERMOOR - INTERACTIVE FUNCTIONS
   Ancient World Chronicle Scripts
   ============================================ */

// Region Data - Comprehensive lore for each civilization
const regionData = {
    zharketh: {
        name: "Zhar'Keth Dominion",
        era: "Ancient Era - 3000 BCE",
        history: "Born from the crucible of the Great Desert, the Zhar'Keth Dominion emerged when the Sandwalker tribes united under the legendary Phoenix-King Azar'Keth. For three thousand years, their empire has stood as a testament to resilience, building magnificent cities from sun-baked clay and golden sandstone. The Dominion controls the vital Silk & Spice Road, commanding trade between east and west. Their warriors, known as the Ashen Guard, are feared across Aethermoor for their mastery of fire magic inherited from the Eternal Flame.",
        culture: "Zhar'Keth society revolves around the veneration of the sun and the eternal cycle of rebirth symbolized by the phoenix. Their architecture features towering ziggurats adorned with gold leaf and precious gems. The people are renowned astronomers, mapping the stars with unparalleled precision. Water is sacred, and their underground aqueduct systems are engineering marvels. Artisans craft exquisite ceramics and textiles dyed with rare desert flowers.",
        mythology: "The Zhar'Keth believe they are descendants of the Phoenix God Ash'Karu, who sacrificed himself to create the sun. Every thousand years, a great conclave seeks the reborn Phoenix-King among newborns, identified by golden eyes and birthmarks resembling flames. The Dragon's Rest, a sacred mountain to the east, is said to be where the last great dragon fell, its blood creating the desert sands.",
        tradeGoods: ["Spices & Incense", "Silk Textiles", "Gold Dust", "Astronomical Instruments", "Fire Opals", "Ceramic Wares"],
        artifact: {
            symbol: "🔥",
            caption: "Eternal Flame Vessel - Sacred urn said to contain an undying flame from the founding of the Dominion"
        },
        color: "#8B4513"
    },
    thalassian: {
        name: "Thalassian League",
        era: "Classical Age - 1000 BCE",
        history: "The Thalassian League is a confederation of city-states united by their mastery of the seas. Founded by the navigator-queen Thalassa Brightsail, who discovered the Maritime Passage connecting distant shores, these coastal cities thrive on trade, fishing, and pearl diving. Their naval prowess is unmatched, with swift triremes patrolling the waters. The League's capital, Coralhaven, is built upon and within a massive living reef, its towers grown from cultivated coral.",
        culture: "Thalassians are a maritime people who worship the Ocean Mother, a deity of abundance and storms. Their society is meritocratic, with leaders chosen by trials of navigation and trade. Music and dance are central to their culture, with elaborate festivals held during full moons. They developed the first comprehensive maps of Aethermoor's coastlines. Their language is rich with nautical terminology and has become the common tongue of trade.",
        mythology: "Legend speaks of the Leviathan, a benevolent sea creature that guides lost sailors to safety. The Temple of Tides marks where Thalassa first received divine blessing from the Ocean Mother. Merfolk are believed to exist in the deep, and Thalassian children leave offerings of polished shells on beaches to appease them. The Sunken Palace is said to be a gateway to the underwater kingdom.",
        tradeGoods: ["Pearls & Coral", "Salted Fish", "Navigator Charts", "Exotic Woods", "Sea Serpent Oil", "Musical Instruments"],
        artifact: {
            symbol: "🐚",
            caption: "Tide Caller's Conch - Ancient instrument said to calm storms and summon favorable winds"
        },
        color: "#1E3A5F"
    },
    verdant: {
        name: "Verdant Sovereignty",
        era: "Ancient Era - 3000 BCE",
        history: "The Verdant Sovereignty is the oldest continuous civilization in Aethermoor, its roots stretching back to the mythical planting of the World Tree. Governed by the Council of Druids, the Sovereignty maintains the Great Forest, a vast woodland said to be home to ancient spirits. Their capital, Heartwood, is built within and around colossal trees that have stood for millennia. The Sovereignty remains neutral in conflicts, serving as mediators and keepers of ancient knowledge.",
        culture: "Verdant society lives in harmony with nature, believing all life is interconnected through the World Tree's root system. Their druids can communicate with plants and animals, and their healers are sought across Aethermoor. Artisans craft living furniture and buildings that grow and adapt. Their calendar follows lunar and seasonal cycles, with elaborate solstice celebrations. They practice sustainable forestry, never taking more than the forest can regenerate.",
        mythology: "The World Tree Yggdrasil's daughter, the Heartwood Tree, is the source of all forest life. Dryads, tree spirits, are real and serve as guardians. The Whispering Ruins are an ancient city where the forest reclaimed stone structures, now home to powerful nature spirits. Every century, the Treesinging occurs when all forest creatures join in a harmonious chorus that can be heard across the continent.",
        tradeGoods: ["Healing Herbs", "Living Wood Crafts", "Animal Companions", "Druidic Services", "Rare Seeds", "Forest Honey"],
        artifact: {
            symbol: "🌳",
            caption: "Heartwood Seed - A sacred seed from the original World Tree, said to grow into a tree of immense power"
        },
        color: "#2F4F2F"
    },
    crimson: {
        name: "Crimson Khanate",
        era: "Classical Age - 1000 BCE",
        history: "The Crimson Khanate rules the jagged peaks of the Bloodstone Mountains, a realm of iron, blood, and honor. Founded by the warrior Khan Crimson Blade, who united the mountain clans through both combat and marriage, the Khanate is a martial society where strength and skill determine rank. Their forges produce the finest steel in Aethermoor, folded and quenched in mountain springs. The Khanate guards the mountain passes, controlling access to the Golden Expanse.",
        culture: "Khanate society is organized into clans, each specializing in different crafts or warfare styles. Their code of honor, the Blood Oath, demands absolute loyalty and personal combat to settle disputes. Hospitality is sacred - even enemies must be fed before battle. Their architecture features imposing stone fortresses carved into mountainsides. Storytelling preserves history, with epics sung by firelight during long mountain winters.",
        mythology: "The mountains are believed to be the bones of a slain titan, their red veins literal blood that grants strength to those who drink from sacred springs. The Eternal Flame burns in the highest peak, a fire that has never extinguished since the world's creation. Mountain spirits, the Stone Guardians, test worthy warriors with trials. The Khan's blade is said to be forged from a fallen star.",
        tradeGoods: ["Weapons & Armor", "Iron Ore", "Mountain Herbs", "War Horses", "Precious Stones", "Fortress Blueprints"],
        artifact: {
            symbol: "⚔️",
            caption: "Crimson Blade - The legendary sword of the first Khan, forged from star-iron and quenched in dragon's blood"
        },
        color: "#8B0000"
    },
    mystic: {
        name: "Mystic Enclave",
        era: "Mythic Period - 500 CE",
        history: "The Mystic Enclave exists in the Twilight Marshes, a liminal space between the mortal world and the realm of spirits. Founded by the Archmage Morvaine the Veiled, who discovered how to thin the barrier between worlds, the Enclave is a sanctuary for magic users, outcasts, and those seeking forbidden knowledge. Its floating towers and impossible geometry defy natural law. Time flows differently here, and visitors may lose years or gain them.",
        culture: "The Enclave is governed by the Circle of Veils, mages who have mastered different schools of magic. Society values knowledge above all, with vast libraries containing spells from forgotten ages. Appearance is fluid here - shapeshifting is common, and many residents are not entirely human. Art and magic are indistinguishable, with paintings that move and sculptures that sing. Dreams and reality blur, making the Enclave both wondrous and dangerous.",
        mythology: "The marshes are sacred ground where the Veil between worlds is thinnest. Fae creatures cross over regularly, and pacts with otherworldly beings are common. The Whispering Ruins are actually a city that exists in multiple dimensions simultaneously. Some say the Enclave itself is alive, a collective consciousness of all who have studied there. Prophecies made here are said to be absolute truth.",
        tradeGoods: ["Spell Components", "Enchanted Items", "Prophecies", "Magical Training", "Dimensional Maps", "Cursed Objects"],
        artifact: {
            symbol: "🔮",
            caption: "Veil Shard - A crystal fragment from the barrier between worlds, showing glimpses of other realities"
        },
        color: "#4A0E4E"
    },
    golden: {
        name: "Golden Expanse",
        era: "Classical Age - 1000 BCE",
        history: "The Golden Expanse is the heart of trade in Aethermoor, a vast grassland where caravans converge and merchants from all nations meet. Founded by the Merchant-Prince Aurelius Goldhand, who established the first universal currency, the Expanse has grown wealthy through commerce rather than conquest. The capital, Crossroads, is a magnificent city of caravanserais, markets, and banks. The Gold Caravan Trail, their most famous route, connects distant civilizations.",
        culture: "The Expanse values commerce, negotiation, and diplomacy. Their society is cosmopolitan, with people from all nations living in harmony. Banking and contract law are highly developed, with written agreements considered sacred. Storytelling and news travel with merchants, making the Expanse the information hub of Aethermoor. Their cuisine is a fusion of all cultures, and their festivals celebrate trade and prosperity.",
        mythology: "The Expanse believes in Fortune, a capricious deity of luck and opportunity. The Golden Road is said to be blessed, protecting travelers who honor fair trade. Legends speak of the Hoard of Ages, a treasure buried by Aurelius that can only be found by one pure of heart. Merchant guilds have patron spirits, and caravans leave offerings at wayside shrines for safe passage.",
        tradeGoods: ["Universal Currency", "Exotic Goods", "Banking Services", "News & Information", "Diplomatic Services", "Festival Wares"],
        artifact: {
            symbol: "⚖️",
            caption: "Goldhand's Scales - The original merchant's scales that determine truth in trade disputes"
        },
        color: "#B8860B"
    }
};

// Mythic Site Data
const mythicSites = {
    dragonsRest: {
        name: "Dragon's Rest",
        symbol: "🐉",
        description: "A massive caldera where the last great dragon, Pyrrhus the Undying, is said to have fallen during the Mythic Wars. The mountain still smolders with ancient fire, and dragon bones protrude from the rocky slopes. Pilgrims come to collect scales that have turned to gemstones over millennia.",
        prophecy: "When the Phoenix and Dragon rise together, the Age of Fire shall consume the world, and from its ashes, a new Aethermoor shall be born."
    },
    templeTides: {
        name: "Temple of Tides",
        symbol: "🌊",
        description: "An ancient temple built into a coastal cliff, half-submerged by the ocean. The tides reveal different chambers at various times of day. Priests of the Ocean Mother perform rituals here, and the temple's bells can be heard for miles during storms, guiding sailors to safety.",
        prophecy: "When the waters rise to claim the temple whole, the Leviathan shall awaken, and the age of land shall end as the sea reclaims what was once hers."
    },
    whisperingRuins: {
        name: "Whispering Ruins",
        symbol: "👻",
        description: "Crumbling stone structures overgrown with luminous moss and strangling vines. The ruins whisper with voices of the past - echoes of conversations from centuries ago. Those who listen too long may lose themselves in memories that aren't their own. Nature spirits guard this place fiercely.",
        prophecy: "When the World Tree's roots touch the ruins' heart, the ancient city shall wake, and the forest shall remember its first children."
    },
    eternalFlame: {
        name: "Eternal Flame",
        symbol: "🔥",
        description: "A volcanic peak where fire has burned since the world's creation. The flame is said to be a fragment of the sun, given to mortals as a gift. Warriors prove their worth by retrieving embers from the flame. The heat is supernatural, and only the worthy can approach without burning.",
        prophecy: "When the flame gutters and dims, the world shall know its final winter. Only the blood of the Phoenix-King can reignite the eternal fire."
    },
    worldTree: {
        name: "The World Tree",
        symbol: "🌳",
        description: "A tree of impossible size, its trunk wider than a city, its canopy touching the clouds. The World Tree is the heart of all forest life, its roots connecting every tree in Aethermoor. Druids commune with it for wisdom, and its sap is said to grant immortality.",
        prophecy: "When the last leaf falls and the roots wither, all forests shall die, and the world shall become barren. Only a sacrifice of pure love can restore the Tree's heart."
    },
    sunkenPalace: {
        name: "Sunken Palace",
        symbol: "🏛️",
        description: "A magnificent palace visible beneath the waves, preserved by ancient magic. Treasure hunters seek it, but few return. The palace is said to be home to the Drowned King, a spectral ruler who hosts eternal feasts for those brave or foolish enough to attend.",
        prophecy: "When the palace rises from the deep, the Drowned King shall claim his throne upon the waves, and a new age of water shall begin."
    }
};

// Era Data
const eraData = [
    {
        name: "The Ancient Era",
        description: "The Dawn of Civilization",
        year: "3000 BCE",
        regionChanges: {
            zharketh: { opacity: 1, scale: 1 },
            thalassian: { opacity: 0.5, scale: 0.7 },
            verdant: { opacity: 1, scale: 1 },
            crimson: { opacity: 0.3, scale: 0.5 },
            mystic: { opacity: 0.2, scale: 0.3 },
            golden: { opacity: 0.4, scale: 0.6 }
        }
    },
    {
        name: "The Classical Age",
        description: "Rise of Empires",
        year: "1000 BCE",
        regionChanges: {
            zharketh: { opacity: 1, scale: 1 },
            thalassian: { opacity: 1, scale: 1 },
            verdant: { opacity: 1, scale: 1 },
            crimson: { opacity: 1, scale: 1 },
            mystic: { opacity: 0.6, scale: 0.7 },
            golden: { opacity: 1, scale: 1 }
        }
    },
    {
        name: "The Mythic Period",
        description: "Age of Legends",
        year: "500 CE",
        regionChanges: {
            zharketh: { opacity: 0.8, scale: 0.9 },
            thalassian: { opacity: 1, scale: 1.1 },
            verdant: { opacity: 1, scale: 1.1 },
            crimson: { opacity: 0.9, scale: 1 },
            mystic: { opacity: 1, scale: 1.2 },
            golden: { opacity: 1, scale: 1 }
        }
    }
];

// DOM Elements
const elements = {
    eraSlider: document.getElementById('eraSlider'),
    eraMarkers: document.querySelectorAll('.era-marker'),
    eraName: document.querySelector('.era-name'),
    eraDescription: document.querySelector('.era-description'),
    regions: document.querySelectorAll('.map-region'),
    lorePanel: document.getElementById('lorePanel'),
    loreTitle: document.getElementById('loreTitle'),
    loreEra: document.getElementById('loreEra'),
    loreHistory: document.getElementById('loreHistory'),
    loreCulture: document.getElementById('loreCulture'),
    loreMythology: document.getElementById('loreMythology'),
    loreTrade: document.getElementById('loreTrade'),
    artifactImage: document.getElementById('artifactImage'),
    artifactCaption: document.getElementById('artifactCaption'),
    closeLore: document.querySelector('.close-lore'),
    mythicModal: document.getElementById('mythicModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalSymbol: document.getElementById('modalSymbol'),
    modalDescription: document.getElementById('modalDescription'),
    modalProphecy: document.getElementById('modalProphecy'),
    closeModal: document.querySelector('.close-modal'),
    mythicSites: document.querySelectorAll('.mythic-site')
};

// Current state
let currentEra = 0;
let activeRegion = null;
let tradeRouteAnimations = [];

// Initialize the Atlas
function initAtlas() {
    setupEventListeners();
    animateTradeRoutes();
    initializeTooltips();
    console.log("Atlas of Aethermoor initialized. The ancient world awaits...");
}

// Setup Event Listeners
function setupEventListeners() {
    // Era Slider
    elements.eraSlider.addEventListener('input', handleEraChange);
    
    // Era Markers (click to jump)
    elements.eraMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const era = parseInt(marker.dataset.era);
            elements.eraSlider.value = era;
            handleEraChange({ target: { value: era } });
        });
    });
    
    // Region Clicks
    elements.regions.forEach(region => {
        region.addEventListener('click', () => openLorePanel(region.dataset.region));
        region.addEventListener('mouseenter', highlightRegion);
        region.addEventListener('mouseleave', unhighlightRegion);
    });
    
    // Close Lore Panel
    elements.closeLore.addEventListener('click', closeLorePanel);
    
    // Mythic Site Clicks
    elements.mythicSites.forEach(site => {
        site.addEventListener('click', () => openMythicModal(site.dataset.site));
    });
    
    // Close Modal
    elements.closeModal.addEventListener('click', closeMythicModal);
    elements.mythicModal.addEventListener('click', (e) => {
        if (e.target === elements.mythicModal) closeMythicModal();
    });
    
    // Keyboard Navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Close panels on outside click
    document.addEventListener('click', (e) => {
        if (!elements.lorePanel.contains(e.target) && 
            !e.target.classList.contains('map-region') &&
            elements.lorePanel.classList.contains('open')) {
            closeLorePanel();
        }
    });
}

// Handle Era Change
function handleEraChange(e) {
    const newEra = parseInt(e.target.value);
    if (newEra === currentEra) return;
    
    currentEra = newEra;
    const era = eraData[newEra];
    
    // Update UI
    elements.eraName.textContent = era.name;
    elements.eraDescription.textContent = era.description;
    
    // Update markers
    elements.eraMarkers.forEach((marker, index) => {
        marker.classList.toggle('active', index === newEra);
    });
    
    // Animate region changes
    Object.entries(era.regionChanges).forEach(([regionId, changes]) => {
        const region = document.getElementById(`region${regionId.charAt(0).toUpperCase() + regionId.slice(1)}`);
        if (region) {
            animateRegionChange(region, changes);
        }
    });
    
    // Update lore panel if open
    if (activeRegion) {
        updateLoreForEra(activeRegion, newEra);
    }
    
    // Visual feedback
    createEraTransitionEffect();
}

// Animate Region Changes
function animateRegionChange(region, changes) {
    region.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    region.style.opacity = changes.opacity;
    
    const bbox = region.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;
    
    region.style.transformOrigin = `${centerX}px ${centerY}px`;
    region.style.transform = `scale(${changes.scale})`;
}

// Create Era Transition Effect
function createEraTransitionEffect() {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
        pointer-events: none;
        z-index: 999;
        animation: flashFade 0.5s ease-out forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flashFade {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
        style.remove();
    }, 500);
}

// Highlight Region on Hover
function highlightRegion(e) {
    const region = e.target;
    region.classList.add('active');
}

// Unhighlight Region
function unhighlightRegion(e) {
    const region = e.target;
    region.classList.remove('active');
}

// Open Lore Panel
function openLorePanel(regionId) {
    const data = regionData[regionId];
    if (!data) return;
    
    activeRegion = regionId;
    
    // Populate content
    elements.loreTitle.textContent = data.name;
    elements.loreHistory.textContent = data.history;
    elements.loreCulture.textContent = data.culture;
    elements.loreMythology.textContent = data.mythology;
    elements.artifactImage.textContent = data.artifact.symbol;
    elements.artifactCaption.textContent = data.artifact.caption;
    
    // Update trade goods
    elements.loreTrade.innerHTML = data.tradeGoods
        .map(good => `<li>${good}</li>`)
        .join('');
    
    // Update era info
    updateLoreForEra(regionId, currentEra);
    
    // Show panel
    elements.lorePanel.classList.add('open');
    
    // Highlight region
    const region = document.getElementById(`region${regionId.charAt(0).toUpperCase() + regionId.slice(1)}`);
    if (region) {
        elements.regions.forEach(r => r.classList.remove('active'));
        region.classList.add('active');
    }
}

// Update Lore for Current Era
function updateLoreForEra(regionId, era) {
    const data = regionData[regionId];
    const eraInfo = eraData[era];
    
    let eraText = '';
    switch(era) {
        case 0:
            eraText = `Ancient Era (3000 BCE) - ${data.name} is at the height of its founding power`;
            break;
        case 1:
            eraText = `Classical Age (1000 BCE) - ${data.name} has matured into a formidable civilization`;
            break;
        case 2:
            eraText = `Mythic Period (500 CE) - ${data.name} exists in an age of legends and transformation`;
            break;
    }
    
    elements.loreEra.textContent = eraText;
}

// Close Lore Panel
function closeLorePanel() {
    elements.lorePanel.classList.remove('open');
    activeRegion = null;
    
    // Remove region highlights
    elements.regions.forEach(r => r.classList.remove('active'));
}

// Open Mythic Modal
function openMythicModal(siteId) {
    const site = mythicSites[siteId];
    if (!site) return;
    
    elements.modalTitle.textContent = site.name;
    elements.modalSymbol.textContent = site.symbol;
    elements.modalDescription.textContent = site.description;
    elements.modalProphecy.textContent = site.prophecy;
    
    elements.mythicModal.classList.add('open');
}

// Close Mythic Modal
function closeMythicModal() {
    elements.mythicModal.classList.remove('open');
}

// Animate Trade Routes
function animateTradeRoutes() {
    const caravans = document.querySelectorAll('.caravan, .ship');
    
    caravans.forEach(caravan => {
        const routeId = caravan.dataset.route;
        const path = document.getElementById(`route${routeId.charAt(0).toUpperCase() + routeId.slice(1)}`);
        
        if (path) {
            const pathLength = path.getTotalLength();
            const duration = routeId === 'gold' ? 18000 : routeId === 'silk' ? 20000 : 25000;
            
            caravan.style.offsetDistance = '0%';
            caravan.animate([
                { offsetDistance: '0%' },
                { offsetDistance: '100%' }
            ], {
                duration: duration,
                iterations: Infinity,
                easing: 'linear'
            });
        }
    });
}

// Initialize Tooltips
function initializeTooltips() {
    // Add tooltip functionality for mythic sites
    elements.mythicSites.forEach(site => {
        const siteId = site.dataset.site;
        const data = mythicSites[siteId];
        
        site.addEventListener('mouseenter', (e) => {
            showTooltip(e, data.name);
        });
        
        site.addEventListener('mouseleave', hideTooltip);
    });
}

// Show Tooltip
function showTooltip(e, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, #3D2914 0%, #5D4037 100%);
        color: #FFD700;
        padding: 8px 16px;
        border-radius: 8px;
        font-family: 'MedievalSharp', cursive;
        font-size: 14px;
        pointer-events: none;
        z-index: 1000;
        border: 2px solid #B8860B;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = tooltip.getBoundingClientRect();
    tooltip.style.left = `${e.clientX - rect.width / 2}px`;
    tooltip.style.top = `${e.clientY - rect.height - 15}px`;
    
    e.target._tooltip = tooltip;
}

// Hide Tooltip
function hideTooltip(e) {
    if (e.target._tooltip) {
        e.target._tooltip.remove();
        e.target._tooltip = null;
    }
}

// Keyboard Navigation
function handleKeyboard(e) {
    // Escape to close panels
    if (e.key === 'Escape') {
        closeLorePanel();
        closeMythicModal();
    }
    
    // Arrow keys for era navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        const newValue = Math.min(2, currentEra + 1);
        elements.eraSlider.value = newValue;
        handleEraChange({ target: { value: newValue } });
    }
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        const newValue = Math.max(0, currentEra - 1);
        elements.eraSlider.value = newValue;
        handleEraChange({ target: { value: newValue } });
    }
}

// Parallax Effect on Mouse Move
function initParallax() {
    const container = document.querySelector('.atlas-container');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        container.style.transform = `perspective(1000px) rotateX(${y * 0.1}deg) rotateY(${-x * 0.1}deg)`;
    });
}

// Scroll-based Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.legend-panel, .map-container, .timeline-container').forEach(el => {
        observer.observe(el);
    });
}

// Random Ambient Effects
function initAmbientEffects() {
    // Occasionally make mythic sites glow
    setInterval(() => {
        const sites = document.querySelectorAll('.mythic-site');
        const randomSite = sites[Math.floor(Math.random() * sites.length)];
        
        if (randomSite) {
            randomSite.style.filter = 'brightness(1.5) drop-shadow(0 0 10px gold)';
            setTimeout(() => {
                randomSite.style.filter = '';
            }, 1000);
        }
    }, 5000);
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { regionData, mythicSites, eraData };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initAtlas();
    initParallax();
    initScrollAnimations();
    initAmbientEffects();
});