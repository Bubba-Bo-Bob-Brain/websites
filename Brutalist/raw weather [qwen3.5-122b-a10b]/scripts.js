/**
 * WEATHER_DASH // JAVASCRIPT LOGIC
 * Aesthetic: Raw Data / Glitch / Industrial
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const tempDisplay = document.querySelector('.raw-number');
    const timestampEl = document.querySelector('.raw-tick');
    const humidityBar = document.querySelector('.bar-fill');
    const windArrow = document.querySelector('.arrow-head');
    const pressureMarker = document.querySelector('.gauge-marker');
    const conditionLabel = document.querySelector('.condition-label h2');
    const alertMarquee = document.querySelector('marquee');
    
    // --- Configuration ---
    const weatherConditions = ['CLOUDY', 'RAINY', 'STORM', 'WINDY', 'CLEAR', 'FOG'];
    const icons = ['☁️', '🌧️', '⛈️', '💨', '🌤️', '🌫️'];
    
    // --- State ---
    let currentTemp = 24;
    let currentHumidity = 64;
    let currentWindDir = 45; // degrees
    
    // --- Functions ---

    /**
     * Updates the timestamp in the header
     */
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        timestampEl.textContent = timeString;
    }

    /**
     * Simulates a "glitch" effect on the temperature number
     * Occasionally changes the value slightly to mimic sensor noise
     */
    function glitchTemperature() {
        // 20% chance to jitter the temp
        if (Math.random() > 0.8) {
            const jitter = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const displayTemp = currentTemp + jitter;
            
            // Visual glitch: add a random skew or opacity shift
            tempDisplay.style.transform = `skewX(${Math.random() * 10 - 5}deg)`;
            tempDisplay.style.opacity = Math.random() > 0.5 ? '0.8' : '1';
            
            setTimeout(() => {
                tempDisplay.style.transform = 'skewX(0deg)';
                tempDisplay.style.opacity = '1';
            }, 100);

            // Update text if significant change
            if (jitter !== 0) {
                tempDisplay.textContent = displayTemp;
            }
        } else {
            // Reset to base
            tempDisplay.textContent = currentTemp;
        }
    }

    /**
     * Simulates changing weather data
     */
    function simulateWeatherData() {
        // Randomly change temp slightly
        currentTemp = Math.floor(Math.random() * (28 - 20 + 1) + 20);
        
        // Randomly change humidity
        currentHumidity = Math.floor(Math.random() * (90 - 40 + 1) + 40);
        
        // Randomly change wind direction (0-360)
        currentWindDir = Math.floor(Math.random() * 360);

        // Randomly change condition
        const conditionIndex = Math.floor(Math.random() * weatherConditions.length);
        conditionLabel.textContent = weatherConditions[conditionIndex];
        
        // Update DOM
        tempDisplay.textContent = currentTemp;
        
        // Animate Humidity Bar (Step effect)
        humidityBar.style.width = '0%';
        setTimeout(() => {
            humidityBar.style.width = `${currentHumidity}%`;
        }, 50);

        // Rotate Wind Arrow
        windArrow.style.transform = `rotate(${currentWindDir}deg)`;

        // Move Pressure Marker slightly
        const pressurePercent = Math.floor(Math.random() * (80 - 40 + 1) + 40);
        pressureMarker.style.left = `${pressurePercent}%`;

        // Randomly toggle alert marquee speed for urgency
        if (Math.random() > 0.7) {
            alertMarquee.setAttribute('scrollamount', Math.floor(Math.random() * 15 + 5));
        }
    }

    /**
     * Main Loop
     */
    setInterval(() => {
        updateTime();
        glitchTemperature();
    }, 1000);

    // Simulate major data updates every 5 seconds
    setInterval(simulateWeatherData, 5000);

    // Initial Run
    updateTime();
    simulateWeatherData();

    // --- Interactive: Mouse Move Parallax on Panels ---
    const panels = document.querySelectorAll('.panel');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        panels.forEach(panel => {
            const speed = Math.random() * 10;
            const xOffset = (window.innerWidth / 2 - e.clientX) / 50;
            const yOffset = (window.innerHeight / 2 - e.clientY) / 50;
            
            // Subtle raw movement, not smooth
            panel.style.transform = `translate(${xOffset * 0.5}px, ${yOffset * 0.5}px)`;
        });
    });

    // --- Console Easter Egg ---
    console.log("%c SYSTEM BREACH DETECTED ", "background: #ff3c00; color: #000; font-size: 20px; font-weight: bold;");
    console.log("%c RAW DATA ACCESS GRANTED ", "color: #00ff41; font-family: monospace;");
});