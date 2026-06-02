// ===== THE CARTOGRAPH OF AETHERMOOR =====
// Interactive atlas with lore, trade routes, and mythological annotations

document.addEventListener('DOMContentLoaded', function() {
    initializeAtlas();
});

function initializeAtlas() {
    createParticles();
    initializeEraSlider();
    initializeRegions();
    initializeCities();
    initializeMyths();
    initializeTooltips();
    initializeTradeRoutes();
}

// ===== PARTICLE SYSTEM =====
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ===== ERA SLIDER =====
function initializeEraSlider() {
    const slider = document.getElementById('eraSlider');
    const labels = document.querySelectorAll('.era-label');
    const description = document.getElementById('eraDescription');
    
    const eraDescriptions = [
        'The world awakens. First cities rise from mudbrick and faith. The gods still walk among mortals.',
        'Valtia unites the northern plains under bronze and banner. The First Empire stretches from sea to sea.',
        'The Concord of Jade and Gold brings peace between Zhurin and Valthor. Trade flows like water.',
        'The Great Sundering shatters the western lands. The Seleniad is born from fire and flood.',
        'The Veil descends. Magic wanes. Kingdoms turn inward, hoarding what light remains.'
    ];
    
    const eraNames = [
        'Age of Dawning',
        'First Empire',
        'Golden Concord',
        'Sundered Seas',
        'Veiled Epoch'
    ];
    
    slider.addEventListener('input', function() {
        const era = parseInt(this.value);
        updateEra(era);
    });
    
    labels.forEach((label, index) => {
        label.addEventListener('click', function() {
            slider.value = index;
            updateEra(index);
        });
    });
    
    function updateEra(era) {
        labels.forEach((l, i) => {
            l.classList.toggle('active', i === era);
        });
        description.textContent = eraDescriptions[era];
        description.style.animation = 'none';
        description.offsetHeight;
        description.style.animation = 'fadeInUp 0.5s ease';
        updateMapForEra(era);
    }
}

function updateMapForEra(era) {
    const routes = document.querySelectorAll('.trade-route');
    const opacity = era === 4 ? 0.2 : era === 3 ? 0.4 : 0.6;
    routes.forEach(route => {
        route.style.opacity = opacity;
        route.style.transition = 'opacity 0.5s ease';
    });
    
    const regions = document.querySelectorAll('.continent');
    const hueShift = era * 15;
    regions.forEach(region => {
        region.style.filter = `hue-rotate(${hueShift}deg)`;
        region.style.transition = 'filter 1s ease';
    });
}

// ===== REGION DATA =====
const regionData = {
    valtia: {
        name: 'Valtia',
        subtitle: 'The Shining Crown',
        description: 'Seat of the First Empire, where bronze meets gold and the sun never truly sets on imperial ambition.',
        lore: 'Legend speaks of Emperor Valtheon the Undying, who bound his soul to the great Sun Spire so that his light might guide his people forever. The Spire still burns, though dimmer now, and scholars debate whether the emperor sleeps or merely waits.',
        population: '2.4 million',
        capital: 'Solaris',
        ruler: 'Empress Seraphina VII',
        trade: 'Grain, wine, bronze, imperial coin',
        culture: 'Imperial, hierarchical, sun-worshipping',
        danger: 'Low (political intrigue)'
    },
    morvaine: {
        name: 'Morvaine',
        subtitle: 'The Twilight Marches',
        description: 'Borderlands where the Empire fades into wilder country, and old powers stir in hollow hills.',
        lore: 'The Morvainians bury their dead standing, facing north, that they might walk to the Cold Court when the final thaw comes. Travellers speak of hollow music on autumn evenings, and lights that dance where no fire burns.',
        population: '840,000',
        capital: 'Thornhallow',
        ruler: 'Margrave Veyrn (ostensible)',
        trade: 'Timber, furs, peat, amber',
        culture: 'Stoic, ancestor-worshipping, wary of outsiders',
        danger: 'Moderate (wild fey, bandits)'
    },
    thornwild: {
        name: 'The Thornwild',
        subtitle: 'Where the Green Sleeps',
        description: 'Ancient forest claiming the bones of forgotten kingdoms beneath root and rot.',
        lore: 'The Thornwild was old when Valtia was young. Dryads remember the First Language. The trees remember more. Every century, the forest surges outward, swallowing villages whole. Every century, brave souls burn the edge back. The balance holds, barely.',
        population: 'Unknown (scattered)',
        capital: 'None (nomadic groves)',
        ruler: 'The Greenheart (ancient dryad queen)',
        trade: 'Rare herbs, enchanted wood, prophetic dreams',
        culture: 'Primal, animistic, non-human majority',
        danger: 'High (awakened forest, ancient curses)'
    },
    zhurin: {
        name: 'Zhurin',
        subtitle: 'Celestial Bureaucracy',
        description: 'Thousand-year dynasty of jade and silk, where heaven mandates and mortals obey.',
        lore: 'The Celestial Emperor never dies, his advisors insist. He merely... transitions. The current transition has lasted three hundred years. The bureaucracy functions flawlessly. No one speaks of the sealed throne room. No one needs to.',
        population: '5.2 million',
        capital: 'Xianzhuo',
        ruler: 'The Celestial Bureau (acting)',
        trade: 'Silk, porcelain, jade, refined medicines',
        culture: 'Bureaucratic, ancestor-honoring, harmony-obsessed',
        danger: 'Low (rigid order, secret police)'
    },
    jadeling: {
        name: 'Jadeling Reach',
        subtitle: 'The Dragon\'s Shadow',
        description: 'Coastal province where dragons once nested and their descendants still scheme.',
        lore: 'The dragons are gone. The Dragonblooded remain. Half-human, half-something-older, they rule the Reach from underwater palaces of coral and pearl. Their breath fogs the harbors. Their deals are always, always binding.',
        population: '1.8 million',
        capital: 'Aozhou (the Sunken City)',
        ruler: 'The Pearl Throne (council of Dragonblooded)',
        trade: 'Pearls, dragonsteel, enchanted coral, sea silk',
        culture: 'Mercurial, deal-obsessed, status-conscious',
        danger: 'Moderate (political, supernatural)'
    },
    silkpass: {
        name: 'Silkpass',
        subtitle: 'The Burning Road',
        description: 'Desert corridor where caravans cross between east and west, life clinging to ancient oases.',
        lore: 'The Silkpass was not always desert. Old maps show rivers. Old stories speak of rain. Something drank the water, something that still sleeps beneath the Sand Temples. The nomads know. They do not dig deep. They do not need to.',
        population: '320,000 (nomadic)',
        capital: 'Oasis Zereth (seasonal)',
        ruler: 'Khan of the Nine Winds',
        trade: 'Salt, spices, passage, water rights',
        culture: 'Nomadic, pragmatic, water-reverent',
        danger: 'High (desert, sand wraiths, bandits)'
    },
    kethuun: {
        name: 'Kethuun',
        subtitle: 'The Obsidian Kingdom',
        description: 'Volcanic highlands where fire-mages forge wonders and terrors in equal measure.',
        lore: 'Kethuuni mages bind fire elementals to their wills, but the binding is never perfect. Every century, a binding breaks. Every century, a city burns. The Kethuuni call these "Liberations" and rebuild. They are patient. They are stubborn. They endure.',
        population: '1.5 million',
        capital: 'Pyrrhus',
        ruler: 'The Forge-Queen',
        trade: 'Obsidian, firegems, mage-forged steel, volcanic glass',
        culture: 'Intense, passionate, death-accepting',
        danger: 'High (magical, volcanic)'
    },
    obsidian: {
        name: 'Obsidian Shore',
        subtitle: 'Where Ash Meets Sea',
        description: 'Black sand beaches and smoking vents, home to outcasts and visionaries alike.',
        lore: 'The shore was once Kethuun\'s breadbasket. Then the volcano spoke. Now only the desperate and the visionary live here, farming obsidian worms and communing with spirits too strange for safer lands. Some say the ash shows the future. Some say it shows the past. Both may be true.',
        population: '45,000',
        capital: 'Ashfall',
        ruler: 'No central authority',
        trade: 'Obsidian, ash-powders, prophecies, penitents',
        culture: 'Apocalyptic, mystical, survivalist',
        danger: 'Extreme (environmental, prophetic madness)'
    },
    seleniad: {
        name: 'The Seleniad',
        subtitle: 'Isles of Tides and Memory',
        description: 'Misty archipelago where the moon pulls more than water, and memory itself becomes tradeable.',
        lore: 'The Seleniad remembers. Everything. Every ship that sank, every lover who wept, every bargain struck beneath the full moon. The islanders trade in memory, buying and selling experiences like grain. Be careful what you sell. Be careful what you buy. Some memories do not stay buried.',
        population: '280,000',
        capital: 'Mnemos',
        ruler: 'The Remembered (collective council)',
        trade: 'Memories, moonpearls, prophetic tides, forgetting',
        culture: 'Contemplative, memory-obsessed, moon-aligned',
        danger: 'Moderate (psychological, memory theft)'
    },
    pearls: {
        name: 'Pearl Isles',
        subtitle: 'The Drowned Gardens',
        description: 'Sinking atolls where the last gardens of a drowned civilization still bloom beneath the waves.',
        lore: 'The Pearl Isles were mountains once. Then the sea rose, or the land fell, no one remembers which. Gardeners still tend the underwater groves, breathing through enchanted pearls, speaking with fish, dreaming of dry land. They are happy, mostly. They remember enough to know they should be.',
        population: '12,000',
        capital: 'Garden Crest (above water)',
        ruler: 'The Gardener-Priests',
        trade: 'Enchanted pearls, underwater crops, drowned artifacts',
        culture: 'Aquatic-adapted, garden-obsessed, peaceful',
        danger: 'Low (environmental, deep ones)'
    }
};

// ===== REGION INTERACTIONS =====
function initializeRegions() {
    const regions = document.querySelectorAll('.region');
    
    regions.forEach(region => {
        region.addEventListener('click', function() {
            const regionId = this.dataset.region;
            selectRegion(regionId, this);
        });
        
        region.addEventListener('mouseenter', function() {
            const regionId = this.dataset.region;
            const data = regionData[regionId];
            if (data) {
                showTooltip(data.name, data.subtitle);
            }
        });
        
        region.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function selectRegion(regionId, element) {
    document.querySelectorAll('.region').forEach(r => r.classList.remove('active'));
    element.classList.add('active');
    
    const data = regionData[regionId];
    if (!data) return;
    
    const panel = document.getElementById('infoPanel');
    const content = document.getElementById('panelContent');
    
    content.innerHTML = `
        <div class="region-detail fade-in-up">
            <div class="region-header">
                <div class="region-flag">${data.name.charAt(0)}</div>
                <div class="region-info">
                    <h4>${data.name}</h4>
                    <p>${data.subtitle}</p>
                </div>
            </div>
            <p>${data.description}</p>
            <div class="region-lore">
                <h5>From the Archives</h5>
                <p>${data.lore}</p>
            </div>
            <div class="region-stats">
                <div class="stat-item">
                    <div class="stat-value">${data.population.split(' ')[0]}</div>
                    <div class="stat-label">${data.population.includes('(') ? data.population.split('(')[1].replace(')', '') : 'Population'}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.capital}</div>
                    <div class="stat-label">Capital</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.ruler}</div>
                    <div class="stat-label">Ruler</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.danger.split(' ')[0]}</div>
                    <div class="stat-label">Danger</div>
                </div>
            </div>
            <div class="region-trade">
                <h5 style="color: var(--color-gold-dim); font-family: var(--font-heading); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.15em; margin: var(--space-sm) 0;">Trade Goods</h5>
                <p style="color: var(--color-text-secondary);">${data.trade}</p>
            </div>
        </div>
    `;
    
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== CITY INTERACTIONS =====
function initializeCities() {
    const cities = document.querySelectorAll('.city');
    
    cities.forEach(city => {
        city.addEventListener('click', function(e) {
            e.stopPropagation();
            const cityName = this.dataset.city;
            showCityInfo(cityName);
        });
        
        city.addEventListener('mouseenter', function() {
            const cityName = this.dataset.city;
            const name = formatCityName(cityName);
            showTooltip(name, 'Click for details');
        });
        
        city.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function formatCityName(camelCase) {
    return camelCase
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/-/g, ' ');
}

function showCityInfo(cityId) {
    const panel = document.getElementById('infoPanel');
    const content = document.getElementById('panelContent');
    
    const cityInfo = getCityInfo(cityId);
    
    content.innerHTML = `
        <div class="region-detail fade-in-up">
            <div class="region-header">
                <div class="region-flag">🏛️</div>
                <div class="region-info">
                    <h4>${cityInfo.name}</h4>
                    <p>${cityInfo.type}</p>
                </div>
            </div>
            <p>${cityInfo.description}</p>
            <div class="region-lore">
                <h5>City History</h5>
                <p>${cityInfo.history}</p>
            </div>
        </div>
    `;
    
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getCityInfo(cityId) {
    const cityDatabase = {
        'valtia-capital': {
            name: 'Solaris',
            type: 'Imperial Capital',
            description: 'The City of Eternal Dawn, where the Sun Spire casts light even in deepest night. Seven walls, seven gates, seven centuries of accumulated grandeur.',
            history: 'Founded by Emperor Valtheon himself on the site of his first victory, Solaris has been rebuilt seventeen times. Each layer preserves the previous, creating a vertical history that scholars still explore.'
        },
        'zhurin-capital': {
            name: 'Xianzhuo',
            type: 'Celestial Capital',
            description: 'A city of jade and paper, where bureaucracy is religion and every citizen knows their place in the heavenly order.',
            history: 'Built in a single year by ten thousand architects working from a single divine blueprint, Xianzhuo has never expanded beyond its original walls. It simply... deepens.'
        },
        'kethuun-capital': {
            name: 'Pyrrhus',
            type: 'Forge-City',
            description: 'Built into the caldera of a sleeping volcano, where fire-mages shape metal with elemental fury.',
            history: 'Pyrrhus has been destroyed four times by volcanic eruption. Each time, it is rebuilt bigger, grander, more fire-resistant. The current city is considered "reasonably safe" by local standards.'
        },
        'default': {
            name: formatCityName(cityId),
            type: 'Settlement',
            description: 'A notable location in the known world.',
            history: 'Records of this place are fragmentary, awaiting the diligent work of cartographers to complete.'
        }
    };
    
    return cityDatabase[cityId] || cityDatabase['default'];
}

// ===== MYTHOLOGICAL SITES =====
function initializeMyths() {
    const myths = document.querySelectorAll('.myth-symbol');
    
    myths.forEach(myth => {
        myth.addEventListener('click', function() {
            const mythId = this.dataset.myth;
            showMythInfo(mythId);
        });
        
        myth.addEventListener('mouseenter', function() {
            const mythNames = {
                'dragon-sleep': 'The Dragon\'s Sleep',
                'veil-gate': 'The Veil Gate',
                'phoenix-nest': 'Phoenix Nest'
            };
            showTooltip(mythNames[this.dataset.myth] || 'Mythic Site', 'Click to learn more');
        });
        
        myth.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showMythInfo(mythId) {
    const panel = document.getElementById('infoPanel');
    const content = document.getElementById('panelContent');
    
    const mythData = getMythData(mythId);
    
    content.innerHTML = `
        <div class="region-detail fade-in-up">
            <div class="region-header">
                <div class="region-flag">✦</div>
                <div class="region-info">
                    <h4>${mythData.name}</h4>
                    <p>${mythData.epithet}</p>
                </div>
            </div>
            <p>${mythData.description}</p>
            <div class="region-lore">
                <h5>Mythological Significance</h5>
                <p>${mythData.lore}</p>
            </div>
        </div>
    `;
    
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getMythData(mythId) {
    const myths = {
        'dragon-sleep': {
            name: 'The Dragon\'s Sleep',
            epithet: 'Where Mountains Dream',
            description: 'In the heart of the Thornwild, where no tree grows, lies a depression in the earth that breathes. Warm air, smelling of copper and old magic, rises every dawn and dusk.',
            lore: 'The dragon Maaloxarth sleeps here, or so the stories claim. Whether he will wake, or whether he wishes to be woken, occupies theologians and adventurers in equal measure. The last expedition to disturb his rest returned as ash and regret.'
        },
        'veil-gate': {
            name: 'The Veil Gate',
            epithet: 'Between Here and Elsewhere',
            description: 'A circle of standing stones in central Zhurin, where the boundary between worlds wears thin as moth-eaten silk.',
            lore: 'The Gate does not open for the living. Or so the Bureau insists. Yet pilgrims come, and some do not return. Whether they pass through or merely perish, no one can say. The Bureau collects the bodies either way.'
        },
        'phoenix-nest': {
            name: 'The Phoenix Nest',
            epithet: 'Birthplace of Fire',
            description: 'A volcanic crater in southern Kethuun that should be dead, but is not. The lava here is golden, and it sings.',
            lore: 'Every century, the phronix rises from the Nest, or so the prophecies promise. The last rising was four centuries ago. The Kethuuni Forge-Queen has prepared a welcome. She has been preparing for a very long time.'
        }
    };
    
    return myths[mythId] || {
        name: 'Unknown Site',
        epithet: 'Mysteries Remain',
        description: 'This location defies easy categorization.',
        lore: 'The archives are incomplete. Perhaps they are meant to be.'
    };
}

// ===== TOOLTIP SYSTEM =====
function initializeTooltips() {
    const tooltip = document.getElementById('tooltip');
    
    document.addEventListener('mousemove', function(e) {
        if (tooltip.classList.contains('visible')) {
            const x = e.clientX + 15;
            const y = e.clientY + 15;
            tooltip.style.left = Math.min(x, window.innerWidth - 300) + 'px';
            tooltip.style.top = Math.min(y, window.innerHeight - 100) + 'px';
        }
    });
}

function showTooltip(title, description) {
    const tooltip = document.getElementById('tooltip');
    tooltip.querySelector('.tooltip-title').textContent = title;
    tooltip.querySelector('.tooltip-desc').textContent = description;
    tooltip.classList.add('visible');
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible');
}

// ===== TRADE ROUTE ANIMATIONS =====
function initializeTradeRoutes() {
    const routes = document.querySelectorAll('.trade-route');
    
    routes.forEach((route, index) => {
        route.style.animationDelay = (index * 2) + 's';
        
        route.addEventListener('click', function() {
            showTradeInfo(index);
        });
        
        route.addEventListener('mouseenter', function() {
            this.style.stroke = 'var(--color-gold-bright)';
            this.style.strokeWidth = '3';
            this.style.cursor = 'pointer';
        });
        
        route.addEventListener('mouseleave', function() {
            this.style.stroke = '';
            this.style.strokeWidth = '';
        });
    });
}

function showTradeInfo(routeIndex) {
    const panel = document.getElementById('infoPanel');
    const content = document.getElementById('panelContent');
    
    const routeNames = [
        'The Amber Road',
        'The Jade Corridor',
        'The Spice Route',
        'The Pearl Way',
        'The Ember Trail'
    ];
    
    const routeDescriptions = [
        'Connecting Valtia to Zhurin, the Amber Road carries wine west and silk east. The journey takes six months, and the tolls are heavy, but the profits reward the bold.',
        'The heart of continental trade, where jade flows to the west and gold to the east. The Bureau maintains exacting standards. Substandard goods are burned.',
        'The longest overland route, crossing deserts, mountains, and ancient forests. Caravans that survive speak of wonders. Those that do not, do not speak at all.',
        'From the Seleniad to Valthia by sea, the Pearl Way connects memory merchants to sun worshippers. Strange cargoes move along this route, and stranger passengers.',
        'Forged in fire, the Ember Trail connects Kethuun to the world. Firegems, volcanic glass, and the occasional escaped elemental travel these paths.'
    ];
    
    content.innerHTML = `
        <div class="region-detail fade-in-up">
            <div class="region-header">
                <div class="region-flag">⚖</div>
                <div class="region-info">
                    <h4>${routeNames[routeIndex]}</h4>
                    <p>Major Trade Route</p>
                </div>
            </div>
            <p>${routeDescriptions[routeIndex]}</p>
            <div class="region-lore">
                <h5>Merchant Wisdom</h5>
                <p>"The road teaches what the city cannot: that every destination is a beginning, and every beginning an ending deferred."</p>
            </div>
        </div>
    `;
    
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== LEGEND PANEL TOGGLE =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'l' || e.key === 'L') {
        const legend = document.getElementById('legendPanel');
        legend.style.display = legend.style.display === 'none' ? 'block' : 'none';
    }
});

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});