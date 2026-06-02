// ===== DOM Elements =====
const eraButtons = document.querySelectorAll('.era-btn');
const timelineSlider = document.getElementById('timeline-slider');
const regions = document.querySelectorAll('.region');
const tradeRoutes = document.querySelectorAll('.route');
const mythMarkers = document.querySelectorAll('.myth-marker');
const caravans = document.querySelectorAll('.caravan');
const lorePopup = document.getElementById('lore-popup');
const popupTitle = document.querySelector('.popup-title');
const popupText = document.querySelector('.popup-text');
const popupEra = document.querySelector('.popup-era');
const closePopup = document.querySelector('.close-popup');
const legendTabs = document.querySelectorAll('.legend-tab');
const legendTabContents = document.querySelectorAll('.legend-tab-content');

// ===== Era Data =====
const eras = {
    'age-of-giants': {
        name: 'Age of Giants',
        description: 'An era of colossal beings and primordial magic.',
        regions: ['valthera', 'elyria'],
        routes: ['route-2'],
        myths: ['The Fall of the Titan-Kings']
    },
    'rising-kingdoms': {
        name: 'Rising Kingdoms',
        description: 'The dawn of human civilizations and great migrations.',
        regions: ['valthera', 'elyria', 'zhar-khan'],
        routes: ['route-1', 'route-2'],
        myths: ['The Fall of the Titan-Kings', 'The Cursed Caravan of Zhar\'Khan']
    },
    'twilight-empires': {
        name: 'Twilight Empires',
        description: 'The peak of trade and the rise of vast empires.',
        regions: ['zhar-khan', 'dravengard', 'elyria'],
        routes: ['route-1', 'route-3'],
        myths: ['The Cursed Caravan of Zhar\'Khan', 'The Dragon’s Hoard of Dravengard']
    },
    'shattered-world': {
        name: 'Shattered World',
        description: 'An age of war, plague, and the fall of great nations.',
        regions: ['dravengard', 'ashen-wastes'],
        routes: [],
        myths: ['The Dragon’s Hoard of Dravengard']
    }
};

// ===== Lore Data =====
const lore = {
    // Regions
    valthera: {
        title: 'Valthera – The First Kingdom',
        text: 'The oldest civilization, built upon the bones of the Titan-Kings. Its towering ziggurats once pierced the heavens, but now lie in ruins, whispering secrets of a forgotten age.',
        era: 'Age of Giants, Rising Kingdoms'
    },
    'zhar-khan': {
        title: 'Zhar\'Khan – Empire of Spice',
        text: 'A land of golden deserts and bustling bazaars, Zhar\'Khan was the heart of trade for centuries. Its rulers, the Silk Sovereigns, amassed wealth beyond imagination—until the sands turned to blood.',
        era: 'Rising Kingdoms, Twilight Empires'
    },
    elyria: {
        title: 'Elyria – The Scholar’s Haven',
        text: 'A sanctuary of knowledge, Elyria’s libraries held the collected wisdom of the world. It was said that the ink of its scrolls glowed with the light of forgotten stars.',
        era: 'Age of Giants, Rising Kingdoms, Twilight Empires'
    },
    dravengard: {
        title: 'Dravengard – The Iron Citadel',
        text: 'A fortress of black steel and unbreakable will, Dravengard stood against the tide of chaos. Its warriors were feared, its walls unbreachable—until the dragons came.',
        era: 'Twilight Empires, Shattered World'
    },
    'ashen-wastes': {
        title: 'Ashen Wastes – The Scorched Land',
        text: 'Once a fertile plain, the Ashen Wastes were reduced to cinders by the War of the Shattered Moon. Now, only the desperate or the doomed dare to cross its cursed expanse.',
        era: 'Shattered World'
    },
    // Myths
    'The Fall of the Titan-Kings': {
        title: 'The Fall of the Titan-Kings',
        text: 'In the dawn of time, the Titans ruled the world with iron fists. But their hubris angered the gods, who struck them down with lightning and fire. Their bones became the mountains, and their blood the rivers.',
        era: 'Age of Giants'
    },
    'The Cursed Caravan of Zhar\'Khan': {
        title: 'The Cursed Caravan of Zhar\'Khan',
        text: 'A merchant’s caravan, laden with gold and spices, vanished into the desert sands. Some say it still wanders, its drivers now skeletal specters, forever seeking a home they will never find.',
        era: 'Rising Kingdoms, Twilight Empires'
    },
    'The Dragon’s Hoard of Dravengard': {
        title: 'The Dragon’s Hoard of Dravengard',
        text: 'Beneath the Iron Citadel lies a treasure beyond measure, guarded by the last of the great wyrm, Valthorax. Many have sought it. None have returned.',
        era: 'Twilight Empires, Shattered World'
    }
};

// ===== Current Era State =====
let currentEra = 'age-of-giants';

// ===== Initialize Atlas =====
function initAtlas() {
    // Set initial era from slider
    updateEraFromSlider();

    // Add event listeners
    eraButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentEra = button.dataset.era;
            updateEraSelection();
            updateMapForEra();
        });
    });

    timelineSlider.addEventListener('input', () => {
        updateEraFromSlider();
        updateMapForEra();
    });

    regions.forEach(region => {
        region.addEventListener('click', () => {
            const regionId = region.id;
            showLore(regionId);
        });
    });

    mythMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const loreKey = marker.dataset.lore;
            showLore(loreKey);
        });
    });

    closePopup.addEventListener('click', hideLorePopup);

    legendTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            switchLegendTab(tabId);
        });
    });

    // Initialize legend tabs
    switchLegendTab('civilizations');

    // Start caravan animations
    animateCaravans();
}

// ===== Era Management =====
function updateEraFromSlider() {
    const eraIndex = parseInt(timelineSlider.value);
    const eraKeys = Object.keys(eras);
    currentEra = eraKeys[eraIndex];
    updateEraSelection();
}

function updateEraSelection() {
    // Update era buttons
    eraButtons.forEach(button => {
        if (button.dataset.era === currentEra) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Update slider position
    const eraIndex = Object.keys(eras).indexOf(currentEra);
    timelineSlider.value = eraIndex;
}

function updateMapForEra() {
    const eraData = eras[currentEra];

    // Update regions
    regions.forEach(region => {
        const regionId = region.id;
        if (eraData.regions.includes(regionId)) {
            region.style.opacity = '1';
            region.style.pointerEvents = 'auto';
        } else {
            region.style.opacity = '0.3';
            region.style.pointerEvents = 'none';
        }
    });

    // Update trade routes
    tradeRoutes.forEach(route => {
        const routeId = route.id;
        if (eraData.routes.includes(routeId)) {
            route.style.opacity = '1';
        } else {
            route.style.opacity = '0';
        }
    });

    // Update myth markers
    mythMarkers.forEach(marker => {
        const loreKey = marker.dataset.lore;
        if (eraData.myths.includes(loreKey)) {
            marker.style.opacity = '1';
            marker.style.pointerEvents = 'auto';
        } else {
            marker.style.opacity = '0';
            marker.style.pointerEvents = 'none';
        }
    });
}

// ===== Lore Popup =====
function showLore(key) {
    const loreEntry = lore[key];
    if (!loreEntry) return;

    popupTitle.textContent = loreEntry.title;
    popupText.textContent = loreEntry.text;
    popupEra.textContent = `Era: ${loreEntry.era}`;

    lorePopup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideLorePopup() {
    lorePopup.classList.remove('active');
    document.body.style.overflow = '';
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    if (e.target === lorePopup) {
        hideLorePopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideLorePopup();
    }
});

// ===== Legend Tabs =====
function switchLegendTab(tabId) {
    legendTabs.forEach(tab => {
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    legendTabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// ===== Caravan Animations =====
function animateCaravans() {
    caravans.forEach(caravan => {
        const routeId = caravan.dataset.route;
        const route = document.getElementById(routeId);
        if (!route) return;

        // Get the path length for animation
        const pathLength = route.getTotalLength();
        const duration = 10; // seconds

        // Animate the caravan along the path
        caravan.style.animation = `moveAlongPath ${duration}s linear infinite`;
        caravan.style.offsetPath = `path("${route.getAttribute('d')}")`;
        caravan.style.offsetDistance = '0%';
    });
}

// ===== Responsive Adjustments =====
function handleResize() {
    // Adjust legend panel position on smaller screens
    const legendPanel = document.querySelector('.legend-panel');
    if (window.innerWidth <= 1024) {
        legendPanel.style.position = 'static';
        legendPanel.style.width = '100%';
        legendPanel.style.transform = 'none';
        legendPanel.style.marginTop = '1rem';
    } else {
        legendPanel.style.position = 'absolute';
        legendPanel.style.width = '250px';
        legendPanel.style.transform = 'translateY(-50%)';
        legendPanel.style.marginTop = '0';
    }
}

// Initialize on load and resize
window.addEventListener('load', () => {
    initAtlas();
    handleResize();
});

window.addEventListener('resize', handleResize);