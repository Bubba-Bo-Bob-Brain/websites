// scripts.js

// Civilization data with detailed information
const civilizationData = {
    aethelgard: {
        name: "Aethelgard",
        description: "A maritime kingdom built on ancient trade traditions, Aethelgard has long been a beacon of commerce and culture. Founded during the First Dawn, its people mastered the seas before others learned to sail.",
        population: "2.5 million",
        tradePower: "High",
        era: "Dawn of Empires",
        mythology: [
            "The Great Whale of the Deep emerged from the primordial waters, teaching early sailors the secrets of the ocean currents.",
            "The Twin Guardians of the Horizon protect all who sail under the double-moon flag.",
            "The Coral Library holds ancient scrolls written on living coral that grows with new knowledge."
        ]
    },
    zyphoria: {
        name: "Zyphoria",
        description: "A land of lush valleys and ancient forests, Zyphoria is known for its druidic circles and deep connection to nature. The people here practice sustainable trade, believing that the earth's bounty must be respected.",
        population: "1.8 million",
        tradePower: "Medium",
        era: "Expansion",
        mythology: [
            "The Green Mother, deity of growth, blessed the first seeds that became the sacred orchards.",
            "The Whispering Trees share secrets across generations through their interconnected root network.",
            "The River Spirits guide travelers safely through the treacherous mountain passes."
        ]
    },
    solara: {
        name: "Solara",
        description: "A desert civilization built around oases and ancient ruins, Solara harnesses the power of the sun. Their astronomers charted the stars long before telescopes, creating a sophisticated calendar system.",
        population: "3.2 million",
        tradePower: "Very High",
        era: "Enlightenment",
        mythology: [
            "The Sun Phoenix rises every century from the ashes of the old sun temples.",
            "The Sand Scribes record every grain's movement, predicting the future through patterns.",
            "The Star Weavers connect mortal dreams with celestial destinies through constellation magic."
        ]
    },
    valkor: {
        name: "Valkor",
        description: "A mountainous realm of forges and fortresses, Valkor is the heart of industry and craftsmanship. Their blacksmiths are said to work with metals blessed by the gods, creating weapons of unmatched quality.",
        population: "1.2 million",
        tradePower: "Medium-High",
        era: "Conflict",
        mythology: [
            "The Iron Titan forged the first mountains when his hammer struck the world's anvil.",
            "The Flame Keepers maintain eternal fires that have burned for millennia without fuel.",
            "The Mountain Spirits test every craftsman's worthiness before revealing their secrets."
        ]
    },
    mythos: {
        name: "Mythos",
        description: "A realm of scholars and mystics, Mythos is where knowledge is the ultimate treasure. Its libraries contain texts from civilizations long forgotten, and its scholars seek to understand the very fabric of reality.",
        population: "800,000",
        tradePower: "Knowledge-Based",
        era: "Decline",
        mythology: [
            "The Library of Echoes contains books that whisper their contents to worthy readers.",
            "Time Weavers manipulate the fabric of chronology to preserve important moments.",
            "The Dreamwalkers traverse between realities, bringing back knowledge from alternate dimensions."
        ]
    }
};

// Trade route destinations for animation
const tradeRoutePaths = {
    '1': { start: { x: 165, y: 215 }, end: { x: 440, y: 260 } },
    '2': { start: { x: 450, y: 260 }, end: { x: 620, y: 310 } },
    '3': { start: { x: 650, y: 310 }, end: { x: 200, y: 375 } },
    '4': { start: { x: 165, y: 215 }, end: { x: 120, y: 400 } },
    '5': { start: { x: 200, y: 425 }, end: { x: 440, y: 260 } }
};

// DOM Elements
const timelineSlider = document.getElementById('timeline-slider');
const eraNameDisplay = document.getElementById('era-name-display');
const currentEraBadge = document.getElementById('current-era');
const legendToggle = document.getElementById('legend-toggle');
const legendPanel = document.getElementById('legend-panel');
const closeLegend = document.getElementById('close-legend');
const detailPanel = document.getElementById('detail-panel');
const closePanel = document.getElementById('close-panel');
const overlay = document.getElementById('overlay');
const regionDescriptions = {
    aethelgard: document.getElementById('region-description'),
    zyphoria: document.getElementById('region-description'),
    solara: document.getElementById('region-description'),
    valkor: document.getElementById('region-description'),
    mythos: document.getElementById('region-description')
};
const populationElements = {
    aethelgard: document.getElementById('population'),
    zyphoria: document.getElementById('population'),
    solara: document.getElementById('population'),
    valkor: document.getElementById('population'),
    mythos: document.getElementById('population')
};
const tradePowerElements = {
    aethelgard: document.getElementById('trade-power'),
    zyphoria: document.getElementById('trade-power'),
    solara: document.getElementById('trade-power'),
    valkor: document.getElementById('trade-power'),
    mythos: document.getElementById('trade-power')
};
const eraElements = {
    aethelgard: document.getElementById('region-era'),
    zyphoria: document.getElementById('region-era'),
    solara: document.getElementById('region-era'),
    valkor: document.getElementById('region-era'),
    mythos: document.getElementById('region-era')
};
const mythologyElements = {
    aethelgard: document.getElementById('mythology-content'),
    zyphoria: document.getElementById('mythology-content'),
    solara: document.getElementById('mythology-content'),
    valkor: document.getElementById('mythology-content'),
    mythos: document.getElementById('mythology-content')
};
const civilizationNames = {
    aethelgard: document.getElementById('civilization-name'),
    zyphoria: document.getElementById('civilization-name'),
    solara: document.getElementById('civilization-name'),
    valkor: document.getElementById('civilization-name'),
    mythos: document.getElementById('civilization-name')
};

// Era names for timeline
const eraNames = ['Age of Founding', 'Age of Expansion', 'Age of Conflict', 'Age of Enlightenment', 'Age of Decline'];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTimeline();
    initializeCaravans();
    initializeEventListeners();
    updateMapForEra(0);
});

// Initialize timeline with proper animation delays
function initializeTimeline() {
    const sliders = document.querySelectorAll('.trade-route');
    sliders.forEach((slider, index) => {
        slider.style.animationDelay = `${index * 0.3}s`;
    });
}

// Initialize caravan animations
function initializeCaravans() {
    // Create caravan elements for each route
    for (let i = 1; i <= 3; i++) {
        const caravan = document.querySelector(`.caravan-${i}`);
        if (caravan) {
            const pathId = `route-${i}`;
            const path = document.getElementById(pathId);
            if (path) {
                // Get path length for animation
                const length = path.getTotalLength();
                const duration = 8 + (i * 2); // Different speeds for each caravan
                
                // Animate along path
                animateAlongPath(caravan, path, length, duration, i);
            }
        }
    }
}

// Animate element along SVG path
function animateAlongPath(element, path, length, duration, index) {
    let start = null;
    
    function animationStep(timestamp) {
        if (!start) start = timestamp;
        const progress = ((timestamp - start) % duration) / duration;
        
        // Get point along path
        const point = path.getPointAtLength(progress * length);
        
        // Apply transformation
        element.style.transform = `translate(${point.x}px, ${point.y}px)`;
        
        requestAnimationFrame(animationStep);
    }
    
    requestAnimationFrame(animationStep);
}

// Initialize event listeners
function initializeEventListeners() {
    // Timeline slider
    timelineSlider.addEventListener('input', function() {
        const era = parseInt(this.value);
        updateTimeline(era);
    });

    // Legend toggle
    legendToggle.addEventListener('click', toggleLegend);
    closeLegend.addEventListener('click', toggleLegend);

    // Detail panel controls
    closePanel.addEventListener('click', closeDetailPanel);
    overlay.addEventListener('click', closeDetailPanel);

    // Region clicks
    Object.keys(civilizationData).forEach(civilization => {
        const region = document.getElementById(`region-${civilization}`);
        if (region) {
            region.addEventListener('click', () => showRegionDetails(civilization));
        }
    });
}

// Update timeline and map
function updateTimeline(era) {
    eraNameDisplay.textContent = eraNames[era];
    currentEraBadge.textContent = `Era: ${eraNames[era]}`;
    updateMapForEra(era);
}

// Update map appearance based on era
function updateMapForEra(era) {
    const regions = document.querySelectorAll('.civilization-region');
    const labels = document.querySelectorAll('.civilization-label');
    
    regions.forEach(region => {
        const civilization = region.getAttribute('data-civilization');
        const data = civilizationData[civilization];
        
        if (data) {
            // Adjust opacity based on era
            const opacity = era <= getEraIndex(data.era) ? 0.5 : 0.15;
            region.style.opacity = opacity;
            
            // Update label opacity
            const label = labels.find(l => 
                l.getAttribute('data-civilization') === civilization
            );
            if (label) {
                label.style.opacity = opacity;
            }
        }
    });
}

// Get era index for comparison
function getEraIndex(eraName) {
    const eras = ['Dawn of Empires', 'Age of Founding', 'Age of Expansion', 
                  'Age of Conflict', 'Age of Enlightenment', 'Age of Decline'];
    return eras.indexOf(eraName);
}

// Toggle legend panel
function toggleLegend() {
    legendPanel.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Show region details
function showRegionDetails(civilization) {
    const data = civilizationData[civilization];
    if (!data) return;
    
    // Update panel content
    civilizationNames[civilization].textContent = data.name;
    regionDescriptions[civilization].textContent = data.description;
    populationElements[civilization].textContent = data.population;
    tradePowerElements[civilization].textContent = data.tradePower;
    eraElements[civilization].textContent = data.era;
    
    // Update mythology content
    const mythologyContent = mythologyElements[civilization];
    mythologyContent.innerHTML = data.mythology.map(myth => 
        `<p>🗿 ${myth}</p>`
    ).join('');
    
    // Show panel
    detailPanel.classList.add('open');
    overlay.classList.add('active');
    
    // Scroll to top
    detailPanel.scrollTop = 0;
}

// Close detail panel
function closeDetailPanel() {
    detailPanel.classList.remove('open');
    overlay.classList.remove('active');
}

// Add interactive hover effects to regions
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('civilization-region')) {
        e.target.style.cursor = 'pointer';
        e.target.style.filter = 'brightness(1.5)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('civilization-region')) {
        e.target.style.filter = '';
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDetailPanel();
        legendPanel.classList.remove('open');
        overlay.classList.remove('active');
    }
    
    // Arrow key navigation for timeline
    if (e.key === 'ArrowRight') {
        const currentValue = parseInt(timelineSlider.value);
        if (currentValue < 4) {
            timelineSlider.value = currentValue + 1;
            updateTimeline(currentValue + 1);
        }
    }
    
    if (e.key === 'ArrowLeft') {
        const currentValue = parseInt(timelineSlider.value);
        if (currentValue > 0) {
            timelineSlider.value = currentValue - 1;
            updateTimeline(currentValue - 1);
        }
    }
});

// Add dynamic background effects
function createFloatingElements() {
    const container = document.querySelector('.atlas-container');
    const symbols = ['✦', '✧', '★', '○', '△', '▽'];
    
    for (let i = 0; i < 20; i++) {
        const element = document.createElement('div');
        element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        element.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 15 + 10}px;
            opacity: ${Math.random() * 0.3 + 0.1};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            pointer-events: none;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        
        // Add float animation
        if (!document.querySelector('#float-animation')) {
            const style = document.createElement('style');
            style.id = 'float-animation';
            style.textContent = `
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: ${Math.random() * 0.3 + 0.1}; }
                    90% { opacity: ${Math.random() * 0.3 + 0.1}; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        container.appendChild(element);
    }
}

// Initialize floating elements
createFloatingElements();