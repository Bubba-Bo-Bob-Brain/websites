// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Section navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Misery meter animation
    const miseryFill = document.getElementById('miseryFill');
    const miseryValue = document.getElementById('miseryValue');
    
    function animateMiseryMeter() {
        let width = 0;
        const targetWidth = 87;
        const interval = setInterval(() => {
            if (width >= targetWidth) {
                clearInterval(interval);
            } else {
                width++;
                miseryFill.style.width = width + '%';
                miseryValue.textContent = width + '%';
            }
        }, 20);
    }
    
    // Initial animation
    setTimeout(animateMiseryMeter, 500);
    
    // Ember effect
    const embersContainer = document.getElementById('embersContainer');
    
    function createEmber() {
        const ember = document.createElement('div');
        ember.classList.add('ember');
        
        // Random position
        const posX = Math.random() * window.innerWidth;
        const posY = window.innerHeight;
        
        // Random size
        const size = Math.random() * 5 + 2;
        
        // Random animation duration
        const duration = Math.random() * 5 + 5;
        
        ember.style.left = `${posX}px`;
        ember.style.top = `${posY}px`;
        ember.style.width = `${size}px`;
        ember.style.height = `${size}px`;
        ember.style.animationDuration = `${duration}s`;
        ember.style.opacity = Math.random() * 0.7 + 0.3;
        
        embersContainer.appendChild(ember);
        
        // Remove ember after animation completes
        setTimeout(() => {
            ember.remove();
        }, duration * 1000);
    }
    
    // Create embers periodically
    setInterval(createEmber, 300);
    
    // Calendar functionality
    const monthYearElement = document.querySelector('.month-year');
    const calendarGrid = document.querySelector('.calendar-grid');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Ritual dates (for demonstration)
    const ritualDates = [
        { day: 3, name: "Blood Moon Ceremony" },
        { day: 7, name: "Summoning of Shadows" },
        { day: 13, name: "Feast of Forgotten Souls" },
        { day: 19, name: "Ritual of Eternal Night" },
        { day: 25, name: "Communion with the Damned" },
        { day: 31, name: "Harvest of Despair" }
    ];
    
    function renderCalendar() {
        // Clear previous calendar
        const dayElements = document.querySelectorAll('.calendar-day:not(.header)');
        dayElements.forEach(el => el.remove());
        
        // Set month/year header
        const monthNames = ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"];
        monthYearElement.textContent = `${monthNames[currentMonth]}, Year of Eternal Night`;
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Add empty cells for days before the first day
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day');
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = day;
            
            // Check if this day has a ritual
            const ritual = ritualDates.find(d => d.day === day);
            if (ritual) {
                dayCell.classList.add('ritual');
                dayCell.title = ritual.name;
            }
            
            calendarGrid.appendChild(dayCell);
        }
    }
    
    // Initialize calendar
    renderCalendar();
    
    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Affliction tracker
    const addAfflictionBtn = document.getElementById('addAfflictionBtn');
    const characterNameInput = document.getElementById('characterName');
    const afflictionList = document.getElementById('afflictionList');
    
    // Sample afflictions for demo
    const sampleAfflictions = [
        "Soul Rot",
        "Bone Fever",
        "Curse of Endless Hunger",
        "Plague of Whispers",
        "Mark of the Betrayer",
        "Eyes of the Damned"
    ];
    
    addAfflictionBtn.addEventListener('click', () => {
        const characterName = characterNameInput.value.trim();
        if (!characterName) {
            alert("Please enter a character name");
            return;
        }
        
        // Select random affliction
        const randomAffliction = sampleAfflictions[Math.floor(Math.random() * sampleAfflictions.length)];
        
        // Create progress value (30-90%)
        const progressValue = Math.floor(Math.random() * 61) + 30;
        
        // Create affliction element
        const afflictionItem = document.createElement('div');
        afflictionItem.classList.add('affliction-item');
        afflictionItem.innerHTML = `
            <div class="affliction-name">${randomAffliction}</div>
            <div class="affliction-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressValue}%"></div>
                </div>
                <div class="progress-percent">${progressValue}%</div>
            </div>
            <div class="affliction-desc">Afflicting ${characterName}. Severity increases with time.</div>
        `;
        
        afflictionList.prepend(afflictionItem);
        
        // Clear input
        characterNameInput.value = '';
        
        // Animation effect
        afflictionItem.style.opacity = '0';
        afflictionItem.style.transform = 'translateY(20px)';
        setTimeout(() => {
            afflictionItem.style.transition = 'opacity 0.5s, transform 0.5s';
            afflictionItem.style.opacity = '1';
            afflictionItem.style.transform = 'translateY(0)';
        }, 10);
    });
    
    // Initialize with some embers
    for (let i = 0; i < 20; i++) {
        setTimeout(createEmber, i * 150);
    }
});