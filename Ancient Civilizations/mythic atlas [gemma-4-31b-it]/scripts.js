/**
 * The Archivist's Codex - Logic Engine
 * Handles immersive interactions, temporal shifts, and lore delivery.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Lore Database ---
    const worldLore = {
        regions: {
            'region-solar': {
                title: "The Solar Empire",
                content: "Once the beacon of the known world, the Solar Empire is built upon the philosophy of Light and Order. Their cities are carved from white marble and gold, floating above the Gilded Plains. It is said their Emperor can speak to the sun itself, controlling the harvest and the heat of the deserts.",
                glyphs: "☀️ 🏛️ ⚖️"
            },
            'region-obsidian': {
                title: "The Obsidian Wastes",
                content: "A jagged landscape of volcanic glass and eternal twilight. The Wastes are inhabited by the Shadow-Walkers, a civilization that mastered the art of void-weaving. No trade caravans dare enter without a guide, for the geography shifts like liquid ink under a blood moon.",
                glyphs: "🌑 🌋 🗡️"
            },
            'region-azure': {
                title: "The Azure Archipelago",
                content: "A sprawling network of a thousand floating islands. The Azure people are master navigators and astronomers, believing that the stars are mirrored in the depths of the ocean. Their trade in bioluminescent pearls fuels the luxury of the entire continent.",
                glyphs: "🌊 🐚 🌌"
            }
        },
        cities: {
            'Solara': "The Eternal City, where the sun never truly sets. The center of theology and gold.",
            'Kezreth': "The Spire of Silence. A fortress of obsidian where the void-weavers dwell.",
            'Thalassa': "The Pearl Port. The most vibrant trade hub in the southern seas.",
            'Oakhaven': "The Neutral Grove. A sanctuary for scholars and diplomats from all realms."
        }
    };

    // --- DOM Elements ---
    const loreScroll = document.getElementById('loreScroll');
    const loreDetails = document.getElementById('loreDetails');
    const closeScroll = document.querySelector('.close-scroll');
    const eraSlider = document.getElementById('eraSlider');
    const mapCanvas = document.getElementById('mapCanvas');
    const regions = document.querySelectorAll('.region');
    const markers = document.querySelectorAll('.city-marker');

    // --- Interaction Logic ---

    // 1. Region Click Event
    regions.forEach(region => {
        region.addEventListener('click', (e) => {
            const id = e.target.id;
            const data = worldLore.regions[id];
            
            if (data) {
                updateLorePanel(data.title, data.content, data.glyphs);
                openScroll();
            }
        });
    });

    // 2. City Marker Event
    markers.forEach(marker => {
        marker.addEventListener('click', (e) => {
            const cityName = e.target.getAttribute('data-city');
            const content = worldLore.cities[cityName];
            
            updateLorePanel(`City: ${cityName}`, content, "📍 📜");
            openScroll();
        });
    });

    function updateLorePanel(title, text, glyphs) {
        loreDetails.innerHTML = `
            <h2 class="lore-title">${title}</h2>
            <div class="lore-body">
                <p>${text}</p>
            </div>
            <div class="lore-footer">
                <span class="glyph-decoration">${glyphs}</span>
            </div>
        `;
    }

    function openScroll() {
        loreScroll.classList.add('active');
    }

    closeScroll.addEventListener('click', () => {
        loreScroll.classList.remove('active');
    });

    // --- Temporal Shift Logic (Era Slider) ---
    eraSlider.addEventListener('input', (e) => {
        const era = e.target.value;
        
        // Visual feedback for the map based on era
        if (era == 1) { // Age of Myth
            applyEraStyle('rgba(244, 228, 188, 1)', 'rgba(197, 160, 82, 0.8)', 1);
        } else if (era == 2) { // Age of Expansion
            applyEraStyle('rgba(230, 210, 170, 1)', 'rgba(107, 45, 45, 0.6)', 0.7);
        } else { // Age of Iron
            applyEraStyle('rgba(210, 190, 150, 1)', 'rgba(26, 26, 26, 0.5)', 0.4);
        }
    });

    function applyEraStyle(bg, routeColor, opacity) {
        document.querySelector('.map-viewport').style.backgroundColor = bg;
        document.querySelectorAll('.route-line').forEach(line => {
            line.style.stroke = routeColor;
            line.style.opacity = opacity;
        });
    }

    // --- Tactile Map Movement (Simple Pan) ---
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    mapCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - mapCanvas.offsetLeft;
        startY = e.pageY - mapCanvas.offsetTop;
        scrollLeft = mapCanvas.scrollLeft;
        scrollTop = mapCanvas.scrollTop;
    });

    mapCanvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    mapCanvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    mapCanvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - mapCanvas.offsetLeft;
        const y = e.pageY - mapCanvas.offsetTop;
        const walkX = (x - startX) * 1; 
        const walkY = (y - startY) * 1;
        mapCanvas.scrollLeft = scrollLeft - walkX;
        mapCanvas.scrollTop = scrollTop - walkY;
    });

    // --- Atmospheric Polish ---
    // Randomly trigger a "dust mote" effect or flicker change
    setInterval(() => {
        const glow = document.querySelector('.candle-glow');
        const randomX = Math.floor(Math.random() * 100);
        const randomY = Math.floor(Math.random() * 100);
        glow.style.background = `radial-gradient(circle at ${randomX}% ${randomY}%, rgba(255, 200, 100, 0.07) 0%, transparent 70%)`;
    }, 3000);
});