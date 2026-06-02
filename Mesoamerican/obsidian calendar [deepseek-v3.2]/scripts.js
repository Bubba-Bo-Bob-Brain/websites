// scripts.js
// Ceremonial Calendar Interface - Ritual Logic & Interactions

document.addEventListener('DOMContentLoaded', function() {
    // ==================== RITUAL INITIALIZATION ====================
    console.log('𓆣 CODEX TEMPORIS - Ceremonial Calendar Initialized 𓆣');
    
    // Audio elements
    const wheelTurnSound = document.getElementById('wheelTurnSound');
    const glyphSelectSound = document.getElementById('glyphSelectSound');
    const incenseSound = document.getElementById('incenseSound');
    const eclipseSound = document.getElementById('eclipseSound');
    
    // Sound toggle state
    let soundsEnabled = true;
    
    // ==================== CALENDAR WHEEL SYSTEM ====================
    const wheelOuterGlyphs = document.querySelector('.wheel-outer-glyphs');
    const wheelInnerGlyphs = document.querySelector('.wheel-inner-glyphs');
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const selectGlyphBtn = document.getElementById('selectGlyph');
    const currentGlyphName = document.getElementById('currentGlyphName');
    const currentGlyphMeaning = document.getElementById('currentGlyphMeaning');
    const selectedGlyphInfo = document.getElementById('selectedGlyphInfo');
    
    // Aztec Tōnalpōhualli day signs (20)
    const dayGlyphs = [
        { symbol: '𓃢', name: 'Cipactli', meaning: 'Crocodile - Primordial earth, creation, strength' },
        { symbol: '𓃭', name: 'Ehecatl', meaning: 'Wind - Breath, life force, change' },
        { symbol: '𓂀', name: 'Calli', meaning: 'House - Shelter, family, stability' },
        { symbol: '𓆓', name: 'Cuetzpallin', meaning: 'Lizard - Agility, regeneration, sun' },
        { symbol: '𓇼', name: 'Coatl', meaning: 'Serpent - Wisdom, transformation, earth' },
        { symbol: '𓁹', name: 'Miquiztli', meaning: 'Death - Endings, release, transition' },
        { symbol: '𓇯', name: 'Mazatl', meaning: 'Deer - Grace, gentleness, forest' },
        { symbol: '𓆗', name: 'Tochtli', meaning: 'Rabbit - Fertility, moon, pleasure' },
        { symbol: '𓂉', name: 'Atl', meaning: 'Water - Emotion, purification, flow' },
        { symbol: '𓃰', name: 'Itzcuintli', meaning: 'Dog - Loyalty, guidance, night' },
        { symbol: '𓁢', name: 'Ozomahtli', meaning: 'Monkey - Play, creativity, trickery' },
        { symbol: '𓆣', name: 'Malinalli', meaning: 'Grass - Resilience, growth, binding' },
        { symbol: '𓃟', name: 'Acatl', meaning: 'Reed - Authority, truth, foundation' },
        { symbol: '𓆏', name: 'Ocelotl', meaning: 'Jaguar - Power, night, shamanism' },
        { symbol: '𓅓', name: 'Cuauhtli', meaning: 'Eagle - Vision, sun, nobility' },
        { symbol: '𓅭', name: 'Cozcacuauhtli', meaning: 'Vulture - Purification, death, sky' },
        { symbol: '𓃬', name: 'Ollin', meaning: 'Movement - Earthquake, change, energy' },
        { symbol: '𓆐', name: 'Tecpatl', meaning: 'Flint - Sacrifice, ritual, spark' },
        { symbol: '𓅔', name: 'Quiahuitl', meaning: 'Rain - Abundance, fertility, Tlaloc' },
        { symbol: '𓆤', name: 'Xochitl', meaning: 'Flower - Beauty, art, pleasure' }
    ];
    
    // Aztec Xiuhpōhualli month signs (18 + 5 nemontemi)
    const monthGlyphs = [
        { symbol: '𓆙', name: 'Atlcahualo', meaning: 'Ceasing of Water' },
        { symbol: '𓆘', name: 'Tlacaxipehualiztli', meaning: 'Flaying of Men' },
        { symbol: '𓆖', name: 'Tozoztontli', meaning: 'Small Vigil' },
        { symbol: '𓆕', name: 'Hueytozoztli', meaning: 'Great Vigil' },
        { symbol: '𓆔', name: 'Toxcatl', meaning: 'Dry Thing' },
        { symbol: '𓆒', name: 'Etzalcualiztli', meaning: 'Eating of Beans' },
        { symbol: '𓆑', name: 'Tecuilhuitontli', meaning: 'Small Feast of Lords' },
        { symbol: '𓆐', name: 'Hueytecuilhuitl', meaning: 'Great Feast of Lords' },
        { symbol: '𓆏', name: 'Tlaxochimaco', meaning: 'Birth of Flowers' },
        { symbol: '𓆎', name: 'Xocotlhuetzi', meaning: 'Fruit Falls' },
        { symbol: '𓆍', name: 'Ochpaniztli', meaning: 'Sweeping' },
        { symbol: '𓆌', name: 'Teotleco', meaning: 'Arrival of Gods' },
        { symbol: '𓆋', name: 'Tepeilhuitl', meaning: 'Feast of Mountains' },
        { symbol: '𓆊', name: 'Quecholli', meaning: 'Precious Feather' },
        { symbol: '𓆉', name: 'Panquetzaliztli', meaning: 'Raising of Banners' },
        { symbol: '𓆈', name: 'Atemoztli', meaning: 'Descent of Water' },
        { symbol: '𓆇', name: 'Tititl', meaning: 'Stretching' },
        { symbol: '𓆆', name: 'Izcalli', meaning: 'Resurrection' }
    ];
    
    // Current rotation state
    let wheelRotation = 0;
    let selectedDayGlyph = 0;
    let selectedMonthGlyph = 0;
    
    // Generate day glyphs around the outer wheel
    function generateDayGlyphs() {
        wheelOuterGlyphs.innerHTML = '';
        const radius = 250;
        const center = 250;
        
        dayGlyphs.forEach((glyph, index) => {
            const angle = (index * 18) * (Math.PI / 180); // 20 glyphs = 18° each
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            
            const glyphElement = document.createElement('div');
            glyphElement.className = 'wheel-glyph day-glyph';
            glyphElement.dataset.index = index;
            glyphElement.dataset.name = glyph.name;
            glyphElement.dataset.meaning = glyph.meaning;
            glyphElement.style.position = 'absolute';
            glyphElement.style.left = `${x - 30}px`;
            glyphElement.style.top = `${y - 30}px`;
            glyphElement.style.width = '60px';
            glyphElement.style.height = '60px';
            glyphElement.style.fontSize = '3rem';
            glyphElement.style.color = '#2d7d6f';
            glyphElement.style.textAlign = 'center';
            glyphElement.style.lineHeight = '60px';
            glyphElement.style.cursor = 'pointer';
            glyphElement.style.transition = 'all 0.3s ease';
            glyphElement.style.filter = 'drop-shadow(0 0 5px rgba(26, 77, 67, 0.7))';
            glyphElement.style.zIndex = '10';
            glyphElement.textContent = glyph.symbol;
            
            glyphElement.addEventListener('mouseenter', function() {
                if (soundsEnabled) glyphSelectSound.currentTime = 0;
                this.style.color = '#d4af37';
                this.style.transform = 'scale(1.3)';
                this.style.filter = 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.8))';
                this.style.zIndex = '100';
                showGlyphTooltip(glyph, x - 30, y - 30);
            });
            
            glyphElement.addEventListener('mouseleave', function() {
                this.style.color = '#2d7d6f';
                this.style.transform = 'scale(1)';
                this.style.filter = 'drop-shadow(0 0 5px rgba(26, 77, 67, 0.7))';
                this.style.zIndex = '10';
                hideGlyphTooltip();
            });
            
            glyphElement.addEventListener('click', function() {
                selectDayGlyph(index);
                if (soundsEnabled) glyphSelectSound.play();
                
                // Confetti effect
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { x: (x - 30) / window.innerWidth, y: (y - 30) / window.innerHeight },
                    colors: ['#1a4d43', '#2d7d6f', '#d4af37', '#8b0000']
                });
            });
            
            wheelOuterGlyphs.appendChild(glyphElement);
        });
    }
    
    // Generate month glyphs around the inner wheel
    function generateMonthGlyphs() {
        wheelInnerGlyphs.innerHTML = '';
        const radius = 150;
        const center = 150;
        
        monthGlyphs.forEach((glyph, index) => {
            const angle = (index * 20) * (Math.PI / 180); // 18 glyphs = 20° each
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            
            const glyphElement = document.createElement('div');
            glyphElement.className = 'wheel-glyph month-glyph';
            glyphElement.dataset.index = index;
            glyphElement.dataset.name = glyph.name;
            glyphElement.style.position = 'absolute';
            glyphElement.style.left = `${x - 25}px`;
            glyphElement.style.top = `${y - 25}px`;
            glyphElement.style.width = '50px';
            glyphElement.style.height = '50px';
            glyphElement.style.fontSize = '2rem';
            glyphElement.style.color = '#d4af37';
            glyphElement.style.textAlign = 'center';
            glyphElement.style.lineHeight = '50px';
            glyphElement.style.cursor = 'pointer';
            glyphElement.style.transition = 'all 0.3s ease';
            glyphElement.style.filter = 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))';
            glyphElement.style.zIndex = '20';
            glyphElement.textContent = glyph.symbol;
            
            glyphElement.addEventListener('mouseenter', function() {
                if (soundsEnabled) glyphSelectSound.currentTime = 0;
                this.style.color = '#ff6b35';
                this.style.transform = 'scale(1.3)';
                this.style.filter = 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.8))';
                this.style.zIndex = '100';
            });
            
            glyphElement.addEventListener('mouseleave', function() {
                this.style.color = '#d4af37';
                this.style.transform = 'scale(1)';
                this.style.filter = 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))';
                this.style.zIndex = '20';
            });
            
            wheelInnerGlyphs.appendChild(glyphElement);
        });
    }
    
    // Select a day glyph
    function selectDayGlyph(index) {
        selectedDayGlyph = index;
        const glyph = dayGlyphs[index];
        
        // Update the selected glyph info panel
        const infoGlyph = selectedGlyphInfo.querySelector('.info-glyph');
        infoGlyph.textContent = glyph.symbol;
        infoGlyph.style.animation = 'none';
        setTimeout(() => {
            infoGlyph.style.animation = 'glyph-float 5s infinite ease-in-out';
        }, 10);
        
        currentGlyphName.textContent = glyph.name;
        currentGlyphMeaning.textContent = glyph.meaning;
        
        // Highlight the selected glyph visually
        document.querySelectorAll('.day-glyph').forEach((el, i) => {
            if (i === index) {
                el.style.color = '#ff6b35';
                el.style.filter = 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.8))';
                el.style.transform = 'scale(1.2)';
            } else {
                el.style.color = '#2d7d6f';
                el.style.filter = 'drop-shadow(0 0 5px rgba(26, 77, 67, 0.7))';
                el.style.transform = 'scale(1)';
            }
        });
        
        // Update ritual list based on glyph
        updateRitualsForGlyph(glyph.name);
    }
    
    // Update rituals based on selected glyph
    function updateRitualsForGlyph(glyphName) {
        const ritualItems = document.querySelectorAll('.ritual-item');
        const ritualNames = document.querySelectorAll('.ritual-name');
        
        // Simplified ritual mapping
        const ritualMap = {
            'Cipactli': ['Earth Offering Ritual', 'Clay Sculpting Ceremony', 'Grounding Meditation'],
            'Ehecatl': ['Wind Chime Blessing', 'Breathwork Practice', 'Feather Cleansing'],
            'Calli': ['Home Sanctification', 'Family Altar Ritual', 'Hearth Fire Offering'],
            'Cuetzpallin': ['Sun Salutation', 'Lizard Glyph Carving', 'Agility Dance'],
            'Coatl': ['Serpent Wisdom Meditation', 'Transformation Ritual', 'Earth Connection']
        };
        
        if (ritualMap[glyphName]) {
            ritualNames.forEach((el, index) => {
                if (ritualMap[glyphName][index]) {
                    el.textContent = ritualMap[glyphName][index];
                }
            });
        }
    }
    
    // Rotate the calendar wheel
    function rotateWheel(direction) {
        if (soundsEnabled) {
            wheelTurnSound.currentTime = 0;
            wheelTurnSound.play();
        }
        
        const wheelOuter = document.querySelector('.wheel-outer-ring');
        const wheelInner = document.querySelector('.wheel-inner-ring');
        
        wheelRotation += direction * 18; // 18° per glyph
        
        wheelOuter.style.animation = 'none';
        wheelInner.style.animation = 'none';
        
        setTimeout(() => {
            wheelOuter.style.transform = `rotate(${wheelRotation}deg)`;
            wheelInner.style.transform = `rotate(${-wheelRotation * 1.5}deg)`;
            
            // Re-enable animations after rotation
            setTimeout(() => {
                wheelOuter.style.animation = 'wheel-rotate 40s infinite linear';
                wheelInner.style.animation = 'wheel-rotate 60s infinite linear reverse';
            }, 100);
        }, 10);
        
        // Update selected glyph based on rotation
        selectedDayGlyph = (selectedDayGlyph + direction + 20) % 20;
        selectDayGlyph(selectedDayGlyph);
    }
    
    // Initialize calendar wheel
    generateDayGlyphs();
    generateMonthGlyphs();
    selectDayGlyph(0);
    
    // Wheel control event listeners
    rotateLeftBtn.addEventListener('click', () => rotateWheel(-1));
    rotateRightBtn.addEventListener('click', () => rotateWheel(1));
    
    selectGlyphBtn.addEventListener('click', () => {
        if (soundsEnabled) glyphSelectSound.play();
        
        // Randomly select a glyph
        const randomIndex = Math.floor(Math.random() * dayGlyphs.length);
        selectDayGlyph(randomIndex);
        
        // Special confetti for random selection
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#1a4d43', '#2d7d6f', '#d4af37', '#ff6b35', '#8b0000']
        });
    });
    
    // ==================== GLYPH TRANSLATION TOOLTIP ====================
    const glyphTooltip = document.getElementById('glyphTooltip');
    let tooltipVisible = false;
    
    function showGlyphTooltip(glyph, x, y) {
        const tooltipGlyph = glyphTooltip.querySelector('.tooltip-glyph');
        const tooltipName = glyphTooltip.querySelector('.tooltip-name');
        const tooltipMeaning = glyphTooltip.querySelector('.tooltip-meaning');
        
        tooltipGlyph.textContent = glyph.symbol;
        tooltipName.textContent = glyph.name;
        tooltipMeaning.textContent = glyph.meaning;
        
        // Position tooltip near the glyph but within viewport
        const tooltipWidth = 280;
        const tooltipHeight = 200;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let posX = x + 80;
        let posY = y - 50;
        
        // Adjust if tooltip would go off screen
        if (posX + tooltipWidth > viewportWidth) {
            posX = x - tooltipWidth - 20;
        }
        if (posY + tooltipHeight > viewportHeight) {
            posY = viewportHeight - tooltipHeight - 20;
        }
        if (posY < 20) {
            posY = 20;
        }
        
        glyphTooltip.style.left = `${posX}px`;
        glyphTooltip.style.top = `${posY}px`;
        glyphTooltip.style.display = 'block';
        
        tooltipVisible = true;
        
        // Add floating animation
        glyphTooltip.style.animation = 'glyph-float 3s infinite ease-in-out';
    }
    
    function hideGlyphTooltip() {
        glyphTooltip.style.display = 'none';
        tooltipVisible = false;
    }
    
    // ==================== ECLIPSE COUNTDOWN TIMER ====================
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const bloodDrop = document.getElementById('bloodDrop');
    
    // Set next blood moon eclipse date (example: 1 month from now)
    const nextEclipse = new Date();
    nextEclipse.setMonth(nextEclipse.getMonth() + 1);
    nextEclipse.setDate(15); // Mid-month
    nextEclipse.setHours(2, 30, 0, 0); // 2:30 AM
    
    function updateCountdown() {
        const now = new Date();
        const timeRemaining = nextEclipse - now;
        
        if (timeRemaining <= 0) {
            // Eclipse happening now!
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            // Trigger eclipse effects
            triggerEclipseEffects();
            
            // Reset for next eclipse (6 months later)
            nextEclipse.setMonth(nextEclipse.getMonth() + 6);
            return;
        }
        
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Make blood drop pulse faster as eclipse approaches
        const totalHours = days * 24 + hours;
        const pulseSpeed = Math.max(1, 30 - totalHours / 10); // Faster as eclipse nears
        bloodDrop.style.animationDuration = `${pulseSpeed}s`;
        
        // Make timer pulse red when under 24 hours
        if (days === 0 && hours < 24) {
            document.querySelectorAll('.time-value').forEach(el => {
                el.style.animationDuration = '0.5s';
                el.style.color = '#ff0000';
            });
        }
    }
    
    function triggerEclipseEffects() {
        if (soundsEnabled) {
            eclipseSound.currentTime = 0;
            eclipseSound.play();
        }
        
        // Red screen flash
        document.body.style.backgroundColor = '#3a0000';
        setTimeout(() => {
            document.body.style.backgroundColor = '';
        }, 1000);
        
        // Intense blood drop animation
        bloodDrop.style.animation = 'blood-drip 0.5s infinite alternate';
        
        // Confetti in blood red
        confetti({
            particleCount: 300,
            spread: 100,
            origin: { x: 0.5, y: 0.3 },
            colors: ['#8b0000', '#b22222', '#450000'],
            scalar: 1.2
        });
        
        // Update panel headers to red
        document.querySelectorAll('.panel-header h2').forEach(el => {
            const originalColor = el.style.color;
            el.style.color = '#ff0000';
            
            setTimeout(() => {
                el.style.color = originalColor;
            }, 5000);
        });
    }
    
    // Start countdown timer
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // ==================== ANIMATED FEATHERED SERPENT ====================
    const serpentBorder = document.getElementById('serpentBorder');
    
    function updateSerpentAnimation() {
        // Randomly change serpent speed occasionally
        const randomSpeed = 40 + Math.random() * 40; // Between 40s and 80s
        document.documentElement.style.setProperty('--serpent-speed', `${randomSpeed}s`);
        
        // Randomly change serpent color tint
        const hueShift = Math.floor(Math.random() * 30) - 15; // -15 to +15
        const serpentHead = document.querySelector('.serpent-head');
        const serpentBody = document.querySelector('.serpent-body');
        const serpentTail = document.querySelector('.serpent-tail');
        
        serpentHead.style.filter = `hue-rotate(${hueShift}deg) drop-shadow(0 0 20px #1a4d43)`;
        serpentBody.style.filter = `hue-rotate(${hueShift}deg) drop-shadow(0 0 15px #1a4d43)`;
        serpentTail.style.filter = `hue-rotate(${hueShift}deg) drop-shadow(0 0 15px #1a4d43)`;
    }
    
    // Update serpent every 30 seconds
    setInterval(updateSerpentAnimation, 30000);
    
    // ==================== INCENSE SMOKE EFFECT ====================
    const incenseSmoke = document.getElementById('incenseSmoke');
    const burnIncenseBtn = document.getElementById('burnIncense');
    
    burnIncenseBtn.addEventListener('click', function() {
        if (soundsEnabled) {
            incenseSound.currentTime = 0;
            incenseSound.play();
        }
        
        // Show smoke effect
        incenseSmoke.style.display = 'block';
        
        // Create additional smoke particles
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const smokeParticle = document.createElement('div');
                smokeParticle.className = 'smoke-particle';
                smokeParticle.style.left = `${20 + Math.random() * 60}px`;
                smokeParticle.style.animation = `smoke-rise ${3 + Math.random() * 5}s infinite ease-out ${Math.random() * 2}s`;
                incenseSmoke.appendChild(smokeParticle);
                
                // Remove particle after animation
                setTimeout(() => {
                    smokeParticle.remove();
                }, 8000);
            }, i * 200);
        }
        
        // Hide smoke after 10 seconds
        setTimeout(() => {
            incenseSmoke.style.display = 'none';
            // Clear all smoke particles
            incenseSmoke.innerHTML = '<div class="smoke-particle"></div><div class="smoke-particle"></div><div class="smoke-particle"></div><div class="smoke-particle"></div><div class="smoke-particle"></div>';
        }, 10000);
        
        // Change background briefly
        document.body.style.backgroundImage = `radial-gradient(circle at 50% 50%, rgba(26, 77, 67, 0.1) 0%, transparent 50%), ${document.body.style.backgroundImage}`;
        
        setTimeout(() => {
            document.body.style.backgroundImage = document.body.style.backgroundImage.replace('radial-gradient(circle at 50% 50%, rgba(26, 77, 67, 0.1) 0%, transparent 50%), ', '');
        }, 5000);
    });
    
    // ==================== GLYPH NAVIGATION ====================
    const navGlyphs = document.querySelectorAll('.nav-glyph');
    
    navGlyphs.forEach(glyph => {
        glyph.addEventListener('click', function() {
            const glyphSymbol = this.dataset.glyph;
            const tooltipText = this.dataset.tooltip;
            
            if (soundsEnabled) glyphSelectSound.play();
            
            // Update center sun glyph temporarily
            const sunGlyph = document.querySelector('.sun-glyph');
            const originalGlyph = sunGlyph.textContent;
            sunGlyph.textContent = glyphSymbol;
            
            setTimeout(() => {
                sunGlyph.textContent = originalGlyph;
            }, 2000);
            
            // Show a notification
            showTemporaryNotification(tooltipText.split(' - ')[1]);
            
            // Animate the clicked glyph
            this.style.transform = 'scale(1.3) rotate(15deg)';
            this.style.backgroundColor = '#1a4d43';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.backgroundColor = '';
            }, 500);
        });
        
        // Add tooltip on hover
        glyph.addEventListener('mouseenter', function() {
            const tooltipText = this.dataset.tooltip;
            showGlyphTooltip({
                symbol: this.querySelector('.glyph-icon').textContent,
                name: tooltipText.split(' - ')[0],
                meaning: tooltipText.split(' - ')[1]
            }, this.getBoundingClientRect().left, this.getBoundingClientRect().top);
        });
        
        glyph.addEventListener('mouseleave', hideGlyphTooltip);
    });
    
    // ==================== CONTROL PANEL FUNCTIONS ====================
    const toggleSoundsBtn = document.getElementById('toggleSounds');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const carveGlyphBtn = document.getElementById('carveGlyph');
    
    // Toggle sounds
    toggleSoundsBtn.addEventListener('click', function() {
        soundsEnabled = !soundsEnabled;
        this.innerHTML = soundsEnabled ? 
            '<i class="fas fa-volume-up"></i> Sounds On' : 
            '<i class="fas fa-volume-mute"></i> Sounds Off';
        
        this.style.backgroundColor = soundsEnabled ? 
            'rgba(212, 175, 55, 0.2)' : 
            'rgba(139, 0, 0, 0.2)';
        this.style.borderColor = soundsEnabled ? 
            '#d4af37' : '#8b0000';
        
        showTemporaryNotification(soundsEnabled ? 
            'Ritual sounds activated' : 
            'Silence for meditation');
    });
    
    // Toggle day/night theme
    toggleThemeBtn.addEventListener('click', function() {
        const isDay = document.body.classList.toggle('day-theme');
        
        if (isDay) {
            // Day theme - brighter colors
            document.documentElement.style.setProperty('--obsidian', '#1a1a2e');
            document.documentElement.style.setProperty('--obsidian-light', '#2d2d4a');
            document.documentElement.style.setProperty('--jade', '#0f766e');
            document.documentElement.style.setProperty('--jade-light', '#14b8a6');
            document.body.style.color = '#2d2d2d';
            this.innerHTML = '<i class="fas fa-moon"></i> Switch to Night';
            showTemporaryNotification('Day theme - Solar energies');
        } else {
            // Night theme - original colors
            document.documentElement.style.setProperty('--obsidian', '#0a0a0a');
            document.documentElement.style.setProperty('--obsidian-light', '#1a1a1a');
            document.documentElement.style.setProperty('--jade', '#1a4d43');
            document.documentElement.style.setProperty('--jade-light', '#2d7d6f');
            document.body.style.color = '#e0d6c2';
            this.innerHTML = '<i class="fas fa-sun"></i> Switch to Day';
            showTemporaryNotification('Night theme - Lunar mysteries');
        }
    });
    
    // Carve new glyph
    carveGlyphBtn.addEventListener('click', function() {
        if (soundsEnabled) glyphSelectSound.play();
        
        // Create a new temporary glyph
        const newGlyph = document.createElement('div');
        newGlyph.className = 'carved-glyph';
        newGlyph.style.position = 'fixed';
        newGlyph.style.top = '50%';
        newGlyph.style.left = '50%';
        newGlyph.style.transform = 'translate(-50%, -50%) scale(0)';
        newGlyph.style.fontSize = '10rem';
        newGlyph.style.color = '#d4af37';
        newGlyph.style.zIndex = '1000';
        newGlyph.style.textAlign = 'center';
        newGlyph.style.filter = 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.8))';
        newGlyph.textContent = '𓁰'; // A unique glyph
        
        document.body.appendChild(newGlyph);
        
        // Animate glyph carving
        setTimeout(() => {
            newGlyph.style.transition = 'transform 0.5s ease-out';
            newGlyph.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        setTimeout(() => {
            newGlyph.style.transition = 'transform 0.5s ease-in, opacity 0.5s ease-in';
            newGlyph.style.transform = 'translate(-50%, -50%) scale(0)';
            newGlyph.style.opacity = '0';
            
            setTimeout(() => {
                newGlyph.remove();
            }, 500);
        }, 2000);
        
        showTemporaryNotification('New glyph carved into the codex');
    });
    
    // ==================== CALENDAR SYSTEM SELECTOR ====================
    const calendarSystems = document.querySelectorAll('.system');
    
    calendarSystems.forEach(system => {
        system.addEventListener('click', function() {
            // Remove active class from all
            calendarSystems.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            
            const systemName = this.dataset.system;
            showTemporaryNotification(`Switched to ${systemName} calendar system`);
            
            // Update wheel title based on system
            const wheelTitle = document.querySelector('.wheel-title');
            const wheelSubtitle = document.querySelector('.wheel-subtitle');
            
            switch(systemName) {
                case 'tonalpohualli':
                    wheelTitle.textContent = 'TONALPOHUALLI';
                    wheelSubtitle.textContent = 'Sacred 260-day cycle';
                    break;
                case 'xiuhpohualli':
                    wheelTitle.textContent = 'XIUHPOHUALLI';
                    wheelSubtitle.textContent = 'Solar 365-day year';
                    break;
                case 'tzolkin':
                    wheelTitle.textContent = 'TZOLK\'IN';
                    wheelSubtitle.textContent = 'Mayan sacred calendar';
                    break;
                case 'haab':
                    wheelTitle.textContent = 'HAAB\'';
                    wheelSubtitle.textContent = 'Mayan solar year';
                    break;
            }
            
            if (soundsEnabled) glyphSelectSound.play();
        });
    });
    
    // ==================== HELPER FUNCTIONS ====================
    function showTemporaryNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.temp-notification');
        if (existingNotification) existingNotification.remove();
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'temp-notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(26, 77, 67, 0.9)';
        notification.style.color = '#d4af37';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '10px';
        notification.style.border = '2px solid #d4af37';
        notification.style.zIndex = '1001';
        notification.style.fontFamily = 'Cinzel, serif';
        notification.style.fontWeight = 'bold';
        notification.style.boxShadow = '0 0 20px rgba(26, 77, 67, 0.7)';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.5s ease';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
    
    // ==================== RITUAL PROGRESS ANIMATION ====================
    const cycleProgress = document.getElementById('cycleProgress');
    const cyclePercent = document.getElementById('cyclePercent');
    
    function animateProgressBar() {
        let progress = 0;
        const targetProgress = 68; // Current cycle completion %
        
        const interval = setInterval(() => {
            if (progress < targetProgress) {
                progress++;
                cycleProgress.style.width = `${progress}%`;
                cyclePercent.textContent = `${progress}%`;
            } else {
                clearInterval(interval);
            }
        }, 30);
    }
    
    // Start progress animation after page load
    setTimeout(animateProgressBar, 1000);
    
    // ==================== KEYBOARD SHORTCUTS ====================
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                rotateWheel(-1);
                break;
            case 'ArrowRight':
                rotateWheel(1);
                break;
            case ' ':
                // Spacebar to select random glyph
                const randomIndex = Math.floor(Math.random() * dayGlyphs.length);
                selectDayGlyph(randomIndex);
                if (soundsEnabled) glyphSelectSound.play();
                break;
            case 'i':
                // 'i' key to burn incense
                burnIncenseBtn.click();
                break;
            case 's':
                // 's' key to toggle sounds
                toggleSoundsBtn.click();
                break;
            case 't':
                // 't' key to toggle theme
                toggleThemeBtn.click();
                break;
        }
    });
    
    // ==================== INITIAL RITUAL ANNOUNCEMENT ====================
    setTimeout(() => {
        showTemporaryNotification('𓆣 Welcome to the Codex Temporis 𓆣');
        
        // Initial confetti
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#1a4d43', '#2d7d6f', '#d4af37']
        });
    }, 1000);
});