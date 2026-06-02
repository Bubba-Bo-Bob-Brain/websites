// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Day signs for the Tzolk'in calendar (20 day cycle)
    const daySigns = [
        { name: "Imix", glyph: "🌀", meaning: "Water • Movement" },
        { name: "Ik'", glyph: "🌬", meaning: "Wind • Breath" },
        { name: "Ak'b'al", glyph: "🌑", meaning: "Night • Dark" },
        { name: "K'an", glyph: "🌽", meaning: "Yellow • Precious" },
        { name: "Chikchan", glyph: "🐍", meaning: "Serpent • Sky" },
        { name: "Kimi", glyph: "💀", meaning: "Death • End" },
        { name: "Manik'", glyph: "🦌", meaning: "Deer • Hunter" },
        { name: "Lamat", glyph: "🌟", meaning: "Star • Seed" },
        { name: "Muluk", glyph: "💧", meaning: "Water • Rain" },
        { name: "Ok", glyph: "🌿", meaning: "Green • Growth" },
        { name: "Chuwen", glyph: "🎨", meaning: "Artist • Creator" },
        { name: "Eb'", glyph: "🌾", meaning: "Earth • Substance" },
        { name: "B'en", glyph: "🌿", meaning: "Sprout • Corn" },
        { name: "Ix", glyph: "🐯", meaning: "Jaguar • Strength" },
        { name: "Men", glyph: "🦅", meaning: "Eagle • Heaven" },
        { name: "Kib'", glyph: "🏺", meaning: "Pottery • Earth" },
        { name: "Kaban", glyph: "🌀", meaning: "Earthquake • Movement" },
        { name: "Etz'nab'", glyph: "🔪", meaning: "Flint • Weapon" },
        { name: "Kawak", glyph: "⛈", meaning: "Storm • Rain" },
        { name: "Ajaw", glyph: "🌞", meaning: "Lord • Sun" }
    ];

    // Deities and their attributes
    const deities = [
        { name: "Huitzilopochtli", icon: "Ḫ", domain: "Sun God • War • Sacrifice", tribute: 65 },
        { name: "Quetzalcoatl", icon: "Ḳ", domain: "Wind • Learning • Arts", tribute: 42 },
        { name: "Tezcatlipoca", icon: "Ṯ", domain: "Night • Sorcery • Conflict", tribute: 78 },
        { name: "Tlaloc", icon: "Ṭ", domain: "Rain • Water • Fertility", tribute: 53 }
    ];

    // Astronomical events
    const astronomicalEvents = [
        { date: "13 Imix", event: "Venus Rising" },
        { date: "7 Ik'", event: "New Moon" },
        { date: "1 Ajaw", event: "Solar Eclipse" },
        { date: "9 Manik'", event: "Jupiter Opposition" }
    ];

    // Tribute schedule
    const tributeSchedule = [
        { day: "Imix", type: "Blood Offering" },
        { day: "Ik'", type: "Incense" },
        { day: "Ak'b'al", type: "Flowers" },
        { day: "K'an", type: "Jade" },
        { day: "Chikchan", type: "Feathers" }
    ];

    // Initialize the calendar wheel
    initializeCalendarWheel();
    
    // Set up the eclipse countdown
    setupEclipseCountdown();
    
    // Rotate the calendar wheel periodically
    setInterval(rotateCalendarWheel, 15000);
    
    // Set up tribute day interactions
    setupTributeDays();
    
    // Set current date (for demo purposes)
    setCurrentDate();

    function initializeCalendarWheel() {
        const calendarWheel = document.getElementById('calendarWheel');
        const radius = 180; // Radius of the circle
        const centerX = 250; // Center X of the wheel
        const centerY = 250; // Center Y of the wheel
        
        // Clear existing content
        calendarWheel.innerHTML = '';
        
        // Position each day sign around the circle
        daySigns.forEach((sign, index) => {
            const angle = (index * 18) * (Math.PI / 180); // Convert to radians
            const x = centerX + radius * Math.cos(angle) - 30; // Adjust for element size
            const y = centerY + radius * Math.sin(angle) - 30;
            
            const dayElement = document.createElement('div');
            dayElement.className = 'day-sign glyph';
            dayElement.textContent = sign.glyph;
            dayElement.style.left = `${x}px`;
            dayElement.style.top = `${y}px`;
            dayElement.dataset.name = sign.name;
            dayElement.dataset.meaning = sign.meaning;
            
            // Add tooltip functionality
            dayElement.addEventListener('mouseenter', function(e) {
                showTooltip(e, `${sign.name} - ${sign.meaning}`);
            });
            
            dayElement.addEventListener('mouseleave', hideTooltip);
            
            calendarWheel.appendChild(dayElement);
        });
    }

    function rotateCalendarWheel() {
        const calendarWheel = document.getElementById('calendarWheel');
        const currentRotation = getComputedStyle(calendarWheel).transform;
        
        // Extract rotation value if it exists
        let rotation = 0;
        if (currentRotation !== 'none') {
            const values = currentRotation.split('(')[1].split(')')[0].split(',');
            const a = values[0];
            const b = values[1];
            rotation = Math.round(Math.atan2(b, a) * (180/Math.PI));
        }
        
        // Rotate by 18 degrees (one day position)
        rotation += 18;
        calendarWheel.style.transform = `rotate(${rotation}deg)`;
    }

    function setupEclipseCountdown() {
        // In a real app, this would calculate time until next eclipse
        // For demo, we'll just animate the countdown
        const countdownElement = document.getElementById('countdown');
        let timeLeft = 127 * 86400 + 5 * 3600 + 34 * 60 + 21; // 127 days in seconds
        
        const updateCountdown = () => {
            const days = Math.floor(timeLeft / 86400);
            const hours = Math.floor((timeLeft % 86400) / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            countdownElement.textContent = 
                `${days.toString().padStart(3, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft > 0) {
                timeLeft--;
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    function setupTributeDays() {
        const tributeDays = document.querySelectorAll('.tribute-day');
        tributeDays.forEach(day => {
            day.addEventListener('click', function() {
                tributeDays.forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                
                // In a real app, this would load details for the selected day
                console.log(`Selected tribute day: ${this.querySelector('.day-name').textContent}`);
            });
        });
    }

    function setCurrentDate() {
        // For demo purposes, set a random current date
        const randomIndex = Math.floor(Math.random() * daySigns.length);
        const currentDay = document.getElementById('currentDay');
        const currentSign = document.getElementById('currentSign');
        
        currentDay.textContent = Math.floor(Math.random() * 13) + 1;
        currentSign.textContent = daySigns[randomIndex].name;
    }

    function showTooltip(event, text) {
        // Remove any existing tooltips
        hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'dynamic-tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        tooltip.style.color = '#d4af37';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '0.9rem';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.zIndex = '1000';
        tooltip.style.border = '1px solid #d4af37';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.left = `${event.pageX}px`;
        tooltip.style.top = `${event.pageY - 30}px`;
        
        document.body.appendChild(tooltip);
    }

    function hideTooltip() {
        const tooltips = document.querySelectorAll('.dynamic-tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    // Add event listeners for dynamic tooltips
    document.addEventListener('mousemove', function(e) {
        const tooltip = document.querySelector('.dynamic-tooltip');
        if (tooltip) {
            tooltip.style.left = `${e.pageX}px`;
            tooltip.style.top = `${e.pageY - 30}px`;
        }
    });
});