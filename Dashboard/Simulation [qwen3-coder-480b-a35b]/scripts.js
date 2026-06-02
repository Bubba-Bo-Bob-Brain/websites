// ===== PLANET SIMULATION DASHBOARD SCRIPTS =====

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dashboard components
    initClock();
    initPopulationCounter();
    initSeismicActivity();
    initTradeRoutes();
    initWeatherSystems();
    initResourceDistribution();
    
    // Set up periodic updates
    setInterval(updateDashboard, 5000); // Update every 5 seconds
});

// ===== CLOCK AND TIME MANAGEMENT =====
function initClock() {
    const timeElement = document.getElementById('sim-time');
    
    function updateClock() {
        const now = new Date();
        const year = now.getFullYear() + 159; // Future date
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ===== POPULATION COUNTER ANIMATION =====
function initPopulationCounter() {
    const counterDigits = document.querySelectorAll('.count-digit');
    let currentValue = 8473129564;
    
    function animateCounter() {
        // Simulate population growth
        currentValue += Math.floor(Math.random() * 10) + 1;
        
        // Format number with commas
        const formattedValue = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        // Update digits
        const digits = formattedValue.split('');
        counterDigits.forEach((digitEl, index) => {
            if (digits[index]) {
                digitEl.textContent = digits[index];
            }
        });
    }
    
    // Initial animation
    animateCounter();
    
    // Animate every 2 seconds
    setInterval(animateCounter, 2000);
}

// ===== SEISMIC ACTIVITY SIMULATION =====
function initSeismicActivity() {
    const gridCells = document.querySelectorAll('.grid-cell');
    const activityFeed = document.querySelector('.activity-feed');
    
    // Seismic event types
    const eventTypes = [
        { emoji: '🌋', name: 'VOLCANIC ERUPTION', magnitude: () => (Math.random() * 3 + 5).toFixed(1) },
        { emoji: ' earthquаke', name: 'TECTONIC SHIFT', magnitude: () => (Math.random() * 4 + 3).toFixed(1) },
        { emoji: '💥', name: 'SEISMIC ACTIVITY', magnitude: () => (Math.random() * 3 + 2).toFixed(1) }
    ];
    
    // Locations
    const locations = [
        'RING OF FIRE', 'PACIFIC RIDGE', 'ATLANTIC MID-OCEAN', 
        'HIMALAYAS', 'ANDES MOUNTAINS', 'EAST AFRICAN RIFT'
    ];
    
    function triggerSeismicEvent() {
        // Randomly activate a grid cell
        const randomCellIndex = Math.floor(Math.random() * gridCells.length);
        const cell = gridCells[randomCellIndex];
        
        // Add active class
        cell.classList.add('active');
        cell.textContent = eventTypes[Math.floor(Math.random() * eventTypes.length)].emoji;
        
        // Remove active class after delay
        setTimeout(() => {
            cell.classList.remove('active');
            cell.textContent = '.';
        }, 3000);
        
        // Add to activity feed
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const magnitude = eventType.magnitude();
        const timestamp = new Date().toLocaleTimeString();
        
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        if (magnitude > 7) feedItem.classList.add('critical');
        else if (magnitude > 5) feedItem.classList.add('warning');
        else feedItem.classList.add('normal');
        
        feedItem.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="location">${location}</span>
            <span class="event">${eventType.name}</span>
            <span class="magnitude">${magnitude} MAG</span>
        `;
        
        activityFeed.prepend(feedItem);
        
        // Limit feed to 10 items
        if (activityFeed.children.length > 10) {
            activityFeed.removeChild(activityFeed.lastChild);
        }
    }
    
    // Trigger events randomly every 3-8 seconds
    setInterval(triggerSeismicEvent, Math.random() * 5000 + 3000);
}

// ===== TRADE ROUTE ANIMATIONS =====
function initTradeRoutes() {
    const routes = document.querySelectorAll('.route');
    
    function animateRoutes() {
        routes.forEach(route => {
            // Randomly change route visibility
            if (Math.random() > 0.3) {
                route.style.opacity = '1';
                route.style.boxShadow = `0 0 10px ${getComputedStyle(route).backgroundColor}`;
            } else {
                route.style.opacity = '0.3';
                route.style.boxShadow = 'none';
            }
            
            // Randomly adjust route position slightly
            const topAdjust = (Math.random() * 10 - 5);
            const rotationAdjust = (Math.random() * 10 - 5);
            route.style.transform = `rotate(${rotationAdjust}deg)`;
            route.style.top = `calc(${route.style.top} + ${topAdjust}px)`;
        });
    }
    
    // Animate routes every 4 seconds
    setInterval(animateRoutes, 4000);
    
    // Initial animation
    animateRoutes();
}

// ===== WEATHER SYSTEM SIMULATION =====
function initWeatherSystems() {
    const clouds = document.querySelectorAll('.cloud');
    const storms = document.querySelectorAll('.storm');
    
    // Weather conditions
    const weatherConditions = [
        { icon: '☀️', temp: () => Math.floor(Math.random() * 15 + 25) },
        { icon: '⛅', temp: () => Math.floor(Math.random() * 10 + 15) },
        { icon: '🌧️', temp: () => Math.floor(Math.random() * 10 + 5) },
        { icon: '⛈️', temp: () => Math.floor(Math.random() * 8 + 12) },
        { icon: '❄️', temp: () => Math.floor(Math.random() * 15 - 10) },
        { icon: '🌪️', temp: () => Math.floor(Math.random() * 10 + 10) }
    ];
    
    function updateWeather() {
        // Update weather cards
        const weatherCards = document.querySelectorAll('.weather-card');
        weatherCards.forEach(card => {
            const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
            const temp = condition.temp();
            
            card.querySelector('.weather-icon').textContent = condition.icon;
            card.querySelector('.weather-temp').textContent = `${temp}°C`;
        });
        
        // Update storm tracker
        const stormItems = document.querySelectorAll('.storm-item');
        stormItems.forEach(item => {
            const winds = Math.floor(Math.random() * 100 + 100);
            item.querySelector('.winds').textContent = `${winds} km/h`;
        });
    }
    
    // Update weather every 7 seconds
    setInterval(updateWeather, 7000);
    
    // Initial update
    updateWeather();
}

// ===== RESOURCE DISTRIBUTION SIMULATION =====
function initResourceDistribution() {
    const resourceCards = document.querySelectorAll('.resource-card');
    const sites = document.querySelectorAll('.site-item');
    
    // Resource trends
    const trends = ['status-high', 'status-medium', 'status-low'];
    const trendIcons = ['↑', '↔', '↓'];
    
    function updateResources() {
        // Update resource cards
        resourceCards.forEach(card => {
            // Randomly change status
            const trendIndex = Math.floor(Math.random() * trends.length);
            const statusElement = card.querySelector('.resource-status');
            
            // Remove existing classes
            statusElement.classList.remove(...trends);
            
            // Add new class
            statusElement.classList.add(trends[trendIndex]);
            
            // Update text
            const trendText = statusElement.textContent.split(' ')[0]; // Keep first word
            statusElement.textContent = `${trendText} ${trendIcons[trendIndex]}`;
        });
        
        // Update extraction sites
        sites.forEach(site => {
            const output = site.querySelector('.site-output');
            const current = parseInt(output.textContent);
            const change = Math.floor(Math.random() * 20000 - 10000); // -10k to +10k
            const newValue = Math.max(0, current + change);
            output.textContent = `${newValue.toLocaleString()} tons/day`;
        });
    }
    
    // Update resources every 10 seconds
    setInterval(updateResources, 10000);
}

// ===== GENERAL DASHBOARD UPDATES =====
function updateDashboard() {
    // Update stability indicator
    const stabilityValue = document.querySelector('.stability-high');
    if (stabilityValue) {
        const current = parseFloat(stabilityValue.textContent);
        const change = (Math.random() * 0.2 - 0.1); // -0.1 to +0.1
        const newValue = Math.max(95, Math.min(99.9, current + change)).toFixed(1);
        stabilityValue.textContent = `${newValue}%`;
    }
    
    // Update CO2 level
    const co2Value = document.querySelector('.co2-high');
    if (co2Value) {
        const current = parseInt(co2Value.textContent);
        const change = Math.floor(Math.random() * 3 - 1); // -1 to +2
        const newValue = Math.max(400, current + change);
        co2Value.textContent = `${newValue} ppm`;
    }
    
    // Update biodiversity score
    const bioScore = document.querySelector('.score');
    if (bioScore) {
        const current = parseFloat(bioScore.textContent);
        const change = (Math.random() * 0.1 - 0.05); // -0.05 to +0.05
        const newValue = Math.max(6, Math.min(8, current + change)).toFixed(1);
        bioScore.textContent = `${newValue}/10`;
        
        // Update progress bar
        const progressBar = document.querySelector('.index-progress');
        if (progressBar) {
            progressBar.style.width = `${newValue * 10}%`;
        }
    }
}

// ===== INTERACTIVE ELEMENTS =====
document.addEventListener('click', function(e) {
    // Handle panel controls
    if (e.target.classList.contains('mini-btn')) {
        const panel = e.target.closest('.panel');
        if (panel) {
            panel.classList.toggle('collapsed');
            const content = panel.querySelector('.panel-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    // Handle continent interaction
    if (e.target.classList.contains('continent')) {
        const continentName = e.target.textContent.trim();
        alert(`Selected continent: ${continentName}\nDetailed regional data would be displayed here.`);
    }
});

// ===== HOVER EFFECTS =====
document.addEventListener('mouseover', function(e) {
    // Highlight resource cards on hover
    if (e.target.classList.contains('resource-card')) {
        e.target.style.transform = 'scale(1.03)';
        e.target.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
    }
    
    // Highlight weather cards on hover
    if (e.target.classList.contains('weather-card')) {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 0 15px rgba(0, 255, 157, 0.3)';
    }
});

document.addEventListener('mouseout', function(e) {
    // Remove highlight from resource cards
    if (e.target.classList.contains('resource-card')) {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
    }
    
    // Remove highlight from weather cards
    if (e.target.classList.contains('weather-card')) {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
    }
});

// ===== WINDOW RESIZE HANDLING =====
window.addEventListener('resize', function() {
    // Adjust layout based on screen size
    const grid = document.querySelector('.dashboard-grid');
    if (window.innerWidth < 1200) {
        grid.style.gridTemplateColumns = '1fr';
    } else if (window.innerWidth < 1920) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
});