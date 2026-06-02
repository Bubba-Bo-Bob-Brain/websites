/**
 * THE CHLOROPHYLL CODEX - CORE ENGINE
 * Immersive Solarpunk Encyclopedia Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeLoader();
    initializeSolarCycle();
    initializeAtmosphericEffects();
    initializeSearch();
    initializeNavigation();
    simulateCommunityActivity();
});

/**
 * 1. PHOTOSYNTHESIS LOADING SEQUENCE
 * Simulates the "growth" of the page before revealing the content.
 */
function initializeLoader() {
    const loader = document.getElementById('loader-overlay');
    
    // Simulate a delay for the "synthesis" process
    setTimeout(() => {
        loader.style.opacity = '0';
        
        // Wait for fade-out transition to finish before removing from DOM
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }, 2500);
}

/**
 * 2. SOLAR CYCLE ENGINE
 * Dynamically shifts the website's lighting and color palette
 * to simulate the passage of time/sunlight intensity.
 */
function initializeSolarCycle() {
    const solarStates = ['sunlight-low', 'sunlight-mid', 'sunlight-high'];
    const solarValues = [30, 72, 100];
    let stateIndex = 1; // Start at 'mid'

    const sunLevel = document.getElementById('sun-level');
    const sunValueText = document.getElementById('sun-value');
    const sunFlare = document.getElementById('sun-flare');

    function updateSunlight() {
        // Remove all potential sunlight classes
        document.body.classList.remove(...solarStates);
        
        // Apply the new state
        const newState = solarStates[stateIndex];
        document.body.classList.add(newState);

        // Update UI Meter
        const intensity = solarValues[stateIndex];
        sunLevel.style.width = `${intensity}%`;
        sunValueText.innerText = `${intensity}%`;

        // Update Sun Flare scale based on intensity
        const scale = 0.5 + (intensity / 100);
        sunFlare.style.transform = `scale(${scale})`;
    }

    // Cycle the sunlight every 15 seconds for demonstration purposes
    setInterval(() => {
        stateIndex = (stateIndex + 1) % solarStates.length;
        updateSunlight();
    }, 15000);

    // Initial call
    updateSunlight();
}

/**
 * 3. ATMOSPHERIC EFFECTS
 * Creates a sense of depth by having the sun flare react to mouse movement.
 */
function initializeAtmosphericEffects() {
    const flare = document.getElementById('sun-flare');

    document.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for smooth, high-performance movement
        requestAnimationFrame(() => {
            const x = e.clientX;
            const y = e.clientY;

            // Move the flare slightly offset from the cursor to create a parallax effect
            // We use a multiplier to keep the movement subtle but perceptible
            const moveX = (x - window.innerWidth / 2) * 0.05;
            const moveY = (y - window.innerHeight / 2) * 0.05;

            flare.style.left = `${moveX}px`;
            flare.style.top = `${moveY}px`;
        });
    });
}

/**
 * 4. SEARCH INTERACTION
 * Mock search functionality to provide feedback.
 */
function initializeSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = searchForm.querySelector('input');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();

        if (query) {
            // Simulate a "searching" state
            searchInput.value = "Searching the seed bank...";
            searchInput.disabled = true;

            setTimeout(() => {
                alert(`The Codex is retrieving data for: "${query}"... (Mock functionality)`);
                searchInput.value = "";
                searchInput.disabled = false;
            }, 1500);
        }
    });
}

/**
 * 5. NAVIGATION MICRO-INTERACTIONS
 * Handles active states and provides organic feedback.
 */
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add to clicked
            this.classList.add('active');

            // Add a little "pulse" effect to the content when navigating
            const content = document.getElementById('entry-content');
            content.style.opacity = '0';
            content.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                content.style.transition = 'all 0.8s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 50);
        });
    });
}

/**
 * 6. LIVE FEED SIMULATION
 * Makes the "Co-op Activity" widget feel like a living, breathing community.
 */
function simulateCommunityActivity() {
    const activityList = document.querySelector('.activity-list');
    const messages = [
        "New planting protocols uploaded by Gaia-Node-7",
        "Solar harvest peaked in Sector B",
        "Mycelial bridge established in North Grove",
        "New seed variety: Bioluminescent Fern",
        "Cooperative energy surplus detected",
        "Rewilding initiative: Zone 4 active"
    ];

    setInterval(() => {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        const time = Math.floor(Math.random() * 59) + 1;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="activity-time">${time}m ago</span>
            <p>${randomMsg}</p>
        `;

        // Prepend to list
        activityList.insertBefore(li, activityList.firstChild);

        // Keep list size manageable
        if (activityList.children.length > 5) {
            activityList.removeChild(activityList.lastChild);
        }
    }, 8000);
}