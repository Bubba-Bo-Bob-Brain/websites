/* ============================================
   TONALAMATL — The Sacred Calendar
   Obsidian & Jade Ceremonial Interface
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // === Sacred Calendar Data ===
    const daySigns = [
        { name: 'Cipactli', glyph: '🐊', meaning: 'Alligator/Crocodile — Primordial earth monster' },
        { name: 'Ehecatl', glyph: '💨', meaning: 'Wind — Breath of life, invisible force' },
        { name: 'Calli', glyph: '🏠', meaning: 'House — Shelter, family, stability' },
        { name: 'Cuetzpalin', glyph: '🦎', meaning: 'Lizard — Fertility, renewal' },
        { name: 'Coatl', glyph: '🐍', meaning: 'Serpent — Wisdom, transformation' },
        { name: 'Miquiztli', glyph: '💀', meaning: 'Death — Ancestral realm' },
        { name: 'Mazatl', glyph: '🦌', meaning: 'Deer — Grace, agility' },
        { name: 'Tochtli', glyph: '🐰', meaning: 'Rabbit — Fertility, pulque' },
        { name: 'Atl', glyph: '💧', meaning: 'Water — Life force, purification' },
        { name: 'Itzcuintli', glyph: '🐕', meaning: 'Dog — Guide to underworld' },
        { name: 'Ozomatli', glyph: '🐒', meaning: 'Monkey — Art, pleasure' },
        { name: 'Malinalli', glyph: '🌾', meaning: 'Grass — Flexibility, survival' },
        { name: 'Acatl', glyph: '🌿', meaning: 'Reed — Upright, hollow, growth' },
        { name: 'Ocelotl', glyph: '🐆', meaning: 'Jaguar — Warrior, night' },
        { name: 'Cuauhtli', glyph: '🦅', meaning: 'Eagle — Sun, warrior' },
        { name: 'Cozcacuauhtli', glyph: '🦃', meaning: 'Vulture — Purification' },
        { name: 'Ollin', glyph: '〰️', meaning: 'Movement — Earthquake, change' },
        { name: 'Tecpatl', glyph: '🔪', meaning: 'Flint — Sacrifice, sharp' },
        { name: 'Quiahuitl', glyph: '🌧️', meaning: 'Rain — Storm, fertility' },
        { name: 'Xochitl', glyph: '🌺', meaning: 'Flower — Beauty, art, truth' }
    ];

    const deities = [
        { 
            name: 'Quetzalcoatl', 
            title: 'Feathered Serpent', 
            domain: 'Wind, Wisdom, Dawn',
            tribute: 'Jade, quetzal feathers, incense',
            glyph: '🐍'
        },
        { 
            name: 'Tezcatlipoca', 
            title: 'Smoking Mirror', 
            domain: 'Night Sky, Conflict, Sorcery',
            tribute: 'Obsidian mirror, tobacco, jaguar bones',
            glyph: '🌙'
        },
        { 
            name: 'Tlaloc', 
            title: 'He Who Makes Things Sprout', 
            domain: 'Rain, Fertility, Water',
            tribute: 'Child tears, jade beads, rain dances',
            glyph: '🌧️'
        },
        { 
            name: 'Chicomecoatl', 
            title: 'Seven Serpent', 
            domain: 'Corn, Nourishment, Abundance',
            tribute: 'Maize, flowers, honey cakes',
            glyph: '🌽'
        },
        { 
            name: 'Xipe Totec', 
            title: 'Our Lord the Flayed One', 
            domain: 'Agriculture, Renewal, Seasons',
            tribute: 'Golden corn, flayed skin offering',
            glyph: '✨'
        }
    ];

    const trecenas = [
        { ruler: 'Quetzalcoatl', startSign: 0 },
        { ruler: 'Tezcatlipoca', startSign: 13 },
        { ruler: 'Tlaloc', startSign: 6 },
        { ruler: 'Chicomecoatl', startSign: 19 },
        { ruler: 'Xipe Totec', startSign: 12 },
        { ruler: 'Quetzalcoatl', startSign: 5 },
        { ruler: 'Tezcatlipoca', startSign: 18 },
        { ruler: 'Tlaloc', startSign: 11 },
        { ruler: 'Chicomecoatl', startSign: 4 },
        { ruler: 'Xipe Totec', startSign: 17 },
        { ruler: 'Quetzalcoatl', startSign: 10 },
        { ruler: 'Tezcatlipoca', startSign: 3 },
        { ruler: 'Tlaloc', startSign: 16 },
        { ruler: 'Chicomecoatl', startSign: 9 },
        { ruler: 'Xipe Totec', startSign: 2 },
        { ruler: 'Quetzalcoatl', startSign: 15 },
        { ruler: 'Tezcatlipoca', startSign: 8 },
        { ruler: 'Tlaloc', startSign: 1 },
        { ruler: 'Chicomecoatl', startSign: 14 },
        { ruler: 'Xipe Totec', startSign: 7 }
    ];

    // === State Management ===
    let currentRotation = 0;
    let selectedDayIndex = 0;
    let soundEnabled = false;

    // === DOM Elements ===
    const numberRing = document.getElementById('numberRing');
    const signRing = document.getElementById('signRing');
    const sunStoneCenter = document.getElementById('sunStoneCenter');
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const resetWheelBtn = document.getElementById('resetWheel');
    const glyphTooltip = document.getElementById('glyphTooltip');
    const tooltipGlyph = document.getElementById('tooltipGlyph');
    const tooltipName = document.getElementById('tooltipName');
    const tooltipTranslation = document.getElementById('tooltipTranslation');
    const soundToggle = document.getElementById('soundToggle');
    const countdownDays = document.getElementById('countdownDays');
    const countdownHours = document.getElementById('countdownHours');
    const countdownMinutes = document.getElementById('countdownMinutes');
    const countdownSeconds = document.getElementById('countdownSeconds');
    const currentDayNumber = document.getElementById('currentDayNumber');
    const currentDayGlyph = document.getElementById('currentDayGlyph');
    const currentDayName = document.getElementById('currentDayName');
    const currentTrecena = document.querySelector('.trecena-ruler');
    const currentDeityIcon = document.getElementById('currentDeityIcon');
    const currentDeityName = document.getElementById('currentDeityName');
    const currentDeityTitle = document.getElementById('currentDeityTitle');
    const currentDeityDomain = document.getElementById('currentDeityDomain');
    const deityTribute = document.getElementById('deityTribute');
    const venusProgress = document.getElementById('venusProgress');
    const venusDays = document.getElementById('venusDays');
    const moonBase = document.getElementById('moonBase');
    const eclipseShadow = document.getElementById('eclipseShadow');

    // === Initialize Calendar Wheel ===
    function initializeWheel() {
        // Create number markers (1-13)
        for (let i = 1; i <= 13; i++) {
            const marker = document.createElement('div');
            marker.className = 'number-marker';
            marker.textContent = i;
            marker.dataset.number = i;
            
            const angle = ((i - 1) * (360 / 13)) - 90;
            const radius = 230;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            marker.style.left = `calc(50% + ${x}px - 18px)`;
            marker.style.top = `calc(50% + ${y}px - 18px)`;
            
            marker.addEventListener('click', () => selectDayByNumber(i));
            marker.addEventListener('mouseenter', (e) => showTooltip(e, i.toString(), `Number ${i} in the sacred count`));
            marker.addEventListener('mouseleave', hideTooltip);
            
            numberRing.appendChild(marker);
        }

        // Create day sign markers (20 signs)
        daySigns.forEach((sign, index) => {
            const marker = document.createElement('div');
            marker.className = 'sign-marker';
            marker.dataset.signIndex = index;
            
            const glyphSpan = document.createElement('span');
            glyphSpan.className = 'sign-glyph';
            glyphSpan.textContent = sign.glyph;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'sign-name';
            nameSpan.textContent = sign.name;
            
            marker.appendChild(glyphSpan);
            marker.appendChild(nameSpan);
            
            const angle = (index * (360 / 20)) - 90;
            const radius = 180;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            marker.style.left = `calc(50% + ${x}px - 25px)`;
            marker.style.top = `calc(50% + ${y}px - 25px)`;
            
            marker.addEventListener('click', () => selectDay(index));
            marker.addEventListener('mouseenter', (e) => showTooltip(e, sign.glyph, `${sign.name} — ${sign.meaning}`));
            marker.addEventListener('mouseleave', hideTooltip);
            
            signRing.appendChild(marker);
        });

        // Set initial selection
        selectDay(calculateCurrentDay());
    }

    // === Calculate Current Sacred Day ===
    function calculateCurrentDay() {
        // Using a reference date aligned with the Tonalpohualli
        // Reference: January 1, 2024 = 1-Alligator (day 0)
        const referenceDate = new Date('2024-01-01');
        const today = new Date();
        const daysDiff = Math.floor((today - referenceDate) / (1000 * 60 * 60 * 24));
        
        // Tonalpohualli is 260 days (13 numbers × 20 signs)
        return ((daysDiff % 260) + 260) % 260;
    }

    function getDayInfo(dayIndex) {
        const number = (dayIndex % 13) + 1;
        const signIndex = dayIndex % 20;
        const sign = daySigns[signIndex];
        const trecenaIndex = Math.floor(dayIndex / 13) % 20;
        const trecena = trecenas[trecenaIndex];
        
        return {
            number,
            sign,
            trecena,
            fullName: `${number} ${sign.name}`
        };
    }

    // === Select Day ===
    function selectDay(dayIndex) {
        selectedDayIndex = dayIndex;
        const info = getDayInfo(dayIndex);
        
        // Update current date display
        currentDayNumber.textContent = info.number;
        currentDayGlyph.textContent = info.sign.glyph;
        currentDayGlyph.dataset.glyph = info.sign.name.toLowerCase();
        currentDayGlyph.dataset.translation = `${info.sign.name} — ${info.sign.meaning}`;
        currentDayName.textContent = info.fullName;
        currentTrecena.textContent = info.trecena.ruler;
        
        // Update deity info
        updateDeityInfo(info.trecena.ruler);
        
        // Highlight selected markers
        document.querySelectorAll('.number-marker').forEach((marker, i) => {
            marker.classList.toggle('active', i + 1 === info.number);
        });
        
        document.querySelectorAll('.sign-marker').forEach((marker, i) => {
            marker.classList.toggle('active', i === dayIndex % 20);
        });
        
        // Rotate wheel to show selection
        rotateWheelToShow(dayIndex);
    }

    function selectDayByNumber(number) {
        // Find a day with this number that's close to current selection
        const currentSignIndex = selectedDayIndex % 20;
        const newDayIndex = ((number - 1) + (currentSignIndex * 13)) % 260;
        selectDay(newDayIndex);
    }

    function updateDeityInfo(rulerName) {
        const deity = deities.find(d => d.name === rulerName) || deities[0];
        
        currentDeityIcon.textContent = deity.glyph;
        currentDeityIcon.dataset.glyph = deity.name.toLowerCase();
        currentDeityIcon.dataset.translation = `${deity.name} — ${deity.title}`;
        currentDeityName.textContent = deity.name;
        currentDeityTitle.textContent = deity.title;
        currentDeityDomain.textContent = deity.domain;
        deityTribute.textContent = deity.tribute;
        
        // Update cycle markers
        document.querySelectorAll('.cycle-marker').forEach(marker => {
            const isActive = marker.dataset.deity.toLowerCase() === rulerName.toLowerCase().charAt(0).toLowerCase();
            marker.classList.toggle('active', isActive);
        });
    }

    // === Wheel Rotation ===
    function rotateWheelToShow(dayIndex) {
        const targetAngle = -(dayIndex * (360 / 260));
        const currentMod = currentRotation % 360;
        let diff = targetAngle - currentMod;
        
        // Find shortest rotation
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        
        currentRotation += diff;
        
        signRing.style.transform = `rotate(${currentRotation}deg)`;
        numberRing.style.transform = `rotate(${currentRotation * 20 / 13}deg)`;
        
        // Counter-rotate markers so they stay upright
        document.querySelectorAll('.sign-marker').forEach(marker => {
            marker.style.transform = `rotate(${-currentRotation}deg)`;
        });
        
        document.querySelectorAll('.number-marker').forEach(marker => {
            marker.style.transform = `rotate(${-currentRotation * 20 / 13}deg)`;
        });
    }

    function rotateWheel(degrees) {
        currentRotation += degrees;
        
        signRing.style.transform = `rotate(${currentRotation}deg)`;
        numberRing.style.transform = `rotate(${currentRotation * 20 / 13}deg)`;
        
        document.querySelectorAll('.sign-marker').forEach(marker => {
            marker.style.transform = `rotate(${-currentRotation}deg)`;
        });
        
        document.querySelectorAll('.number-marker').forEach(marker => {
            marker.style.transform = `rotate(${-currentRotation * 20 / 13}deg)`;
        });
    }

    function resetWheel() {
        currentRotation = 0;
        signRing.style.transform = 'rotate(0deg)';
        numberRing.style.transform = 'rotate(0deg)';
        
        document.querySelectorAll('.sign-marker').forEach(marker => {
            marker.style.transform = 'rotate(0deg)';
        });
        
        document.querySelectorAll('.number-marker').forEach(marker => {
            marker.style.transform = 'rotate(0deg)';
        });
        
        selectDay(calculateCurrentDay());
    }

    // === Glyph Tooltip System ===
    function showTooltip(event, glyph, translation) {
        const parts = translation.split(' — ');
        tooltipGlyph.textContent = glyph;
        tooltipName.textContent = parts[0] || '';
        tooltipTranslation.textContent = parts[1] || translation;
        
        glyphTooltip.classList.add('visible');
        
        positionTooltip(event);
    }

    function positionTooltip(event) {
        const tooltipRect = glyphTooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let x = event.clientX + 15;
        let y = event.clientY + 15;
        
        // Keep tooltip in viewport
        if (x + tooltipRect.width > viewportWidth) {
            x = event.clientX - tooltipRect.width - 15;
        }
        
        if (y + tooltipRect.height > viewportHeight) {
            y = event.clientY - tooltipRect.height - 15;
        }
        
        glyphTooltip.style.left = `${x}px`;
        glyphTooltip.style.top = `${y}px`;
    }

    function hideTooltip() {
        glyphTooltip.classList.remove('visible');
    }

    // Setup tooltip triggers for all glyph elements
    function setupTooltips() {
        document.querySelectorAll('[data-glyph]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const glyph = element.textContent.trim();
                const translation = element.dataset.translation || element.dataset.glyph;
                showTooltip(e, glyph, translation);
            });
            
            element.addEventListener('mousemove', positionTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }

    // === Eclipse Countdown Timer ===
    function updateCountdown() {
        // Next lunar eclipse: December 30, 2024 (approximate)
        const eclipseDate = new Date('2024-12-30T08:00:00Z');
        const now = new Date();
        const diff = eclipseDate - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            countdownDays.textContent = days.toString().padStart(3, '0');
            countdownHours.textContent = hours.toString().padStart(2, '0');
            countdownMinutes.textContent = minutes.toString().padStart(2, '0');
            countdownSeconds.textContent = seconds.toString().padStart(2, '0');
            
            // Update moon phase visualization
            updateMoonPhase(days);
        } else {
            countdownDays.textContent = '000';
            countdownHours.textContent = '00';
            countdownMinutes.textContent = '00';
            countdownSeconds.textContent = '00';
        }
    }

    function updateMoonPhase(daysUntilEclipse) {
        // Simulate moon phase based on days until eclipse
        // Eclipse happens at full moon, so we calculate phase
        const lunarCycle = 29.53;
        const daysSinceNewMoon = (lunarCycle - (daysUntilEclipse % lunarCycle)) % lunarCycle;
        const phase = daysSinceNewMoon / lunarCycle;
        
        // Adjust eclipse shadow position based on phase
        const shadowOffset = 70 - (phase * 40);
        eclipseShadow.setAttribute('cx', Math.max(30, Math.min(70, shadowOffset)));
        
        // Darken moon as eclipse approaches
        if (daysUntilEclipse < 7) {
            eclipseShadow.setAttribute('opacity', 0.8 + (0.2 * (1 - daysUntilEclipse / 7)));
        }
    }

    // === Venus Cycle Tracker ===
    function updateVenusCycle() {
        // Venus synodic period is approximately 584 days
        const venusCycle = 584;
        const referenceDate = new Date('2024-01-01');
        const today = new Date();
        const daysDiff = Math.floor((today - referenceDate) / (1000 * 60 * 60 * 24));
        const currentDay = daysDiff % venusCycle;
        const progress = (currentDay / venusCycle) * 100;
        
        venusProgress.style.width = `${progress}%`;
        venusDays.textContent = `Day ${currentDay} of ${venusCycle}`;
        
        // Determine Venus phase
        const phaseElement = document.getElementById('venusPhase');
        if (currentDay < 236) {
            phaseElement.textContent = 'Morning Star Phase';
        } else if (currentDay < 263) {
            phaseElement.textContent = 'Superior Conjunction (Invisible)';
        } else if (currentDay < 500) {
            phaseElement.textContent = 'Evening Star Phase';
        } else {
            phaseElement.textContent = 'Inferior Conjunction (Invisible)';
        }
    }

    // === Astronomical Events Countdown ===
    function updateAstronomyCountdowns() {
        const today = new Date();
        const events = [
            { name: 'Winter Solstice', date: '2024-12-21' },
            { name: 'Spring Equinox', date: '2025-03-20' },
            { name: 'Sun Zenith Passage', date: '2025-05-20' }
        ];
        
        document.querySelectorAll('.astro-event').forEach((eventEl, index) => {
            if (events[index]) {
                const eventDate = new Date(events[index].date);
                const diff = eventDate - today;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                
                const countdownEl = eventEl.querySelector('.event-countdown');
                if (countdownEl) {
                    countdownEl.textContent = `${days} days`;
                }
            }
        });
    }

    // === Sound System ===
    function toggleSound() {
        soundEnabled = !soundEnabled;
        const icon = soundToggle.querySelector('.sound-icon');
        icon.textContent = soundEnabled ? '🔊' : '🔇';
        
        if (soundEnabled) {
            playAmbientSound();
        } else {
            stopAmbientSound();
        }
    }

    let ambientAudio = null;

    function playAmbientSound() {
        // Create a subtle ambient drone using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(55, audioContext.currentTime); // Low A
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(82.5, audioContext.currentTime); // E
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.start();
        oscillator2.start();
        
        ambientAudio = { context: audioContext, oscillators: [oscillator1, oscillator2], gain: gainNode };
    }

    function stopAmbientSound() {
        if (ambientAudio) {
            ambientAudio.oscillators.forEach(osc => osc.stop());
            ambientAudio.context.close();
            ambientAudio = null;
        }
    }

    // === Serpent Animation Enhancement ===
    function enhanceSerpentAnimation() {
        const serpentPaths = document.querySelectorAll('.serpent-path');
        
        serpentPaths.forEach((path, index) => {
            // Add subtle wave animation
            path.style.animationDelay = `${index * 0.5}s`;
        });
    }

    // === Keyboard Navigation ===
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    rotateWheel(-10);
                    break;
                case 'ArrowRight':
                    rotateWheel(10);
                    break;
                case 'Home':
                    resetWheel();
                    break;
                case 's':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        toggleSound();
                    }
                    break;
            }
        });
    }

    // === Touch Support ===
    let touchStartX = 0;
    let touchStartRotation = 0;

    function setupTouchSupport() {
        const wheelContainer = document.querySelector('.calendar-wheel-container');
        
        wheelContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartRotation = currentRotation;
        });
        
        wheelContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            const diff = (touchX - touchStartX) * 0.5;
            currentRotation = touchStartRotation + diff;
            
            signRing.style.transform = `rotate(${currentRotation}deg)`;
            numberRing.style.transform = `rotate(${currentRotation * 20 / 13}deg)`;
            
            document.querySelectorAll('.sign-marker').forEach(marker => {
                marker.style.transform = `rotate(${-currentRotation}deg)`;
            });
            
            document.querySelectorAll('.number-marker').forEach(marker => {
                marker.style.transform = `rotate(${-currentRotation * 20 / 13}deg)`;
            });
        });
    }

    // === Initialize Everything ===
    function init() {
        initializeWheel();
        setupTooltips();
        setupKeyboardNavigation();
        setupTouchSupport();
        enhanceSerpentAnimation();
        
        // Event listeners
        rotateLeftBtn.addEventListener('click', () => rotateWheel(-360 / 260));
        rotateRightBtn.addEventListener('click', () => rotateWheel(360 / 260));
        resetWheelBtn.addEventListener('click', resetWheel);
        soundToggle.addEventListener('click', toggleSound);
        
        // Start timers
        updateCountdown();
        updateVenusCycle();
        updateAstronomyCountdowns();
        
        setInterval(updateCountdown, 1000);
        setInterval(updateVenusCycle, 60000);
        setInterval(updateAstronomyCountdowns, 60000);
        
        // Add ceremonial entrance animation
        document.body.classList.add('loaded');
        
        console.log('🌙 TONALAMATL — The Sacred Calendar has awakened');
    }

    // Start the codex
    init();
});