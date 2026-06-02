document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. GLYPH TOOLTIP SYSTEM
    // ==========================================================================
    const tooltip = document.getElementById('glyph-tooltip');
    const tooltipGlyph = tooltip.querySelector('.glyph-tooltip__glyph');
    const tooltipMeaning = tooltip.querySelector('.glyph-tooltip__meaning');
    const tooltipTranslation = tooltip.querySelector('.glyph-tooltip__translation');

    // Delegate events to the body for performance
    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target.closest('[data-glyph]');
        if (target) {
            const glyph = target.getAttribute('data-glyph');
            const meaning = target.getAttribute('data-meaning');
            const translation = target.getAttribute('data-translation');

            tooltipGlyph.textContent = glyph;
            tooltipMeaning.textContent = meaning;
            tooltipTranslation.textContent = translation;

            tooltip.classList.add('visible');
            tooltip.setAttribute('aria-hidden', 'false');
        }
    }, true);

    document.body.addEventListener('mousemove', (e) => {
        if (tooltip.classList.contains('visible')) {
            // Offset slightly from cursor
            const x = e.clientX + 15;
            const y = e.clientY + 15;
            
            // Boundary check to keep tooltip on screen
            const rect = tooltip.getBoundingClientRect();
            const winW = window.innerWidth;
            const winH = window.innerHeight;

            let finalX = x;
            let finalY = y;

            if (x + rect.width > winW) finalX = e.clientX - rect.width - 10;
            if (y + rect.height > winH) finalY = e.clientY - rect.height - 10;

            tooltip.style.left = `${finalX}px`;
            tooltip.style.top = `${finalY}px`;
        }
    });

    document.body.addEventListener('mouseleave', (e) => {
        const target = e.target.closest('[data-glyph]');
        if (target) {
            tooltip.classList.remove('visible');
            tooltip.setAttribute('aria-hidden', 'true');
        }
    }, true);

    // ==========================================================================
    // 2. ECLIPSE COUNTDOWN TIMER
    // ==========================================================================
    const timerElements = {
        days: document.querySelector('[data-unit="days"] .eclipse-timer__value'),
        hours: document.querySelector('[data-unit="hours"] .eclipse-timer__value'),
        minutes: document.querySelector('[data-unit="minutes"] .eclipse-timer__value'),
        seconds: document.querySelector('[data-unit="seconds"] .eclipse-timer__value'),
    };

    // Set a target date for the next eclipse (Example: Winter Solstice 2024 or arbitrary future date)
    // In a real app, this would be fetched from an API.
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 142); // ~142 days from now for demo
    targetDate.setHours(0, 0, 0, 0);

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            // Reset or show 00
            Object.values(timerElements).forEach(el => el.textContent = '00');
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        timerElements.days.textContent = d.toString().padStart(2, '0');
        timerElements.hours.textContent = h.toString().padStart(2, '0');
        timerElements.minutes.textContent = m.toString().padStart(2, '0');
        timerElements.seconds.textContent = s.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // ==========================================================================
    // 3. CALENDAR WHEEL POPULATION
    // ==========================================================================
    const svgWheel = document.querySelector('.calendar-wheel');
    const daySignsGroup = document.getElementById('day-signs');
    const dayNumbersGroup = document.getElementById('day-numbers');

    const daySigns = [
        '🐊', '🌬️', '🏠', '🦎', '🐍', '💀', '🦌', '🐇', '🌧️', '🐕',
        '🐒', '🌿', '🗡️', '🐆', '🦅', '🦉', '🌪️', '🔪', '⛈️', '🌸'
    ];

    const centerX = 300;
    const centerY = 300;
    const signsRadius = 235;
    const numbersRadius = 170;

    // Populate Day Signs (20 signs)
    daySigns.forEach((sign, index) => {
        const angle = (index * 360) / 20;
        const rad = (angle - 90) * (Math.PI / 180); // -90 to start at top

        const x = centerX + signsRadius * Math.cos(rad);
        const y = centerY + signsRadius * Math.sin(rad);

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute('class', 'wheel-sign');
        g.setAttribute('data-glyph', sign);
        
        // Data for tooltips on SVG elements
        const names = ['Cipactli', 'Ehecatl', 'Calli', 'Cuetzpalin', 'Coatl', 'Miquiztli', 'Mazatl', 'Tochtli', 'Atl', 'Itzcuintli', 
                       'Ozomatli', 'Malinalli', 'Acatl', 'Ocelotl', 'Cuauhtli', 'Cozcacuauhtli', 'Ollin', 'Tecpatl', 'Quiahuitl', 'Xochitl'];
        const meanings = ['Crocodile', 'Wind', 'House', 'Lizard', 'Serpent', 'Death', 'Deer', 'Rabbit', 'Water', 'Dog', 
                          'Monkey', 'Grass', 'Reed', 'Jaguar', 'Eagle', 'Vulture', 'Movement', 'Flint', 'Storm', 'Flower'];
        
        g.setAttribute('data-meaning', names[index]);
        g.setAttribute('data-translation', `${meanings[index]} - Day Sign`);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', '#8b7d6b');
        text.setAttribute('font-size', '20');
        text.textContent = sign;

        // Add a subtle background circle for hit area
        const bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        bg.setAttribute('cx', x);
        bg.setAttribute('cy', y);
        bg.setAttribute('r', 18);
        bg.setAttribute('fill', 'transparent');
        
        g.appendChild(bg);
        g.appendChild(text);
        daySignsGroup.appendChild(g);
    });

    // Populate Day Numbers (1-13)
    // The numbers cycle 1-13, repeating to fill the wheel visually or just placed once
    // Usually, the numbers are associated with the signs. 
    // For the wheel design, we'll place numbers 1-13 in the inner ring.
    for (let i = 1; i <= 13; i++) {
        const angle = ((i - 1) * 360) / 13;
        const rad = (angle - 90) * (Math.PI / 180);

        const x = centerX + numbersRadius * Math.cos(rad);
        const y = centerY + numbersRadius * Math.sin(rad);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', '#4a3f32');
        text.setAttribute('font-family', 'Cinzel Decorative');
        text.setAttribute('font-size', '16');
        text.setAttribute('font-weight', 'bold');
        text.textContent = i;

        dayNumbersGroup.appendChild(text);
    }

    // Wheel Spin Control
    const wheelContainer = document.querySelector('.calendar-wheel-container');
    const wheel = document.querySelector('.calendar-wheel');

    wheelContainer.addEventListener('mouseenter', () => {
        wheel.style.animationDuration = '20s'; // Speed up on hover
    });

    wheelContainer.addEventListener('mouseleave', () => {
        wheel.style.animationDuration = '60s'; // Slow down
    });

    // ==========================================================================
    // 4. NAVIGATION & PANEL SWITCHING
    // ==========================================================================
    const navLabels = document.querySelectorAll('.nav-label');
    const panels = document.querySelectorAll('.content-panel');

    navLabels.forEach(label => {
        label.addEventListener('click', () => {
            const targetPanelId = `panel-${label.getAttribute('data-panel')}`;

            // Update Nav State
            navLabels.forEach(l => l.classList.remove('nav-label--active'));
            label.classList.add('nav-label--active');

            // Switch Panels
            panels.forEach(panel => {
                if (panel.id === targetPanelId) {
                    panel.classList.add('content-panel--active');
                    // Trigger reflow for animation restart if needed, 
                    // though CSS display block/none handles the entry animation via keyframes.
                } else {
                    panel.classList.remove('content-panel--active');
                }
            });
        });
    });

    // ==========================================================================
    // 5. TONALPOHUALLI CALCULATOR (Simulated Current Day)
    // ==========================================================================
    // Calculates the current Tonalpohualli date based on a reference.
    // Reference: Jan 1, 2000 was 13-Monkey (13-Ozomatli) in some correlations.
    // Note: Calendar correlations vary. This is a functional simulation.
    
    const currentDayNumberEl = document.getElementById('current-tonal-number');
    const currentDaySignEl = document.getElementById('current-tonal-sign');
    const currentDayNameEl = document.getElementById('current-tonal-name');
    const currentDayMeaningEl = document.getElementById('current-tonal-meaning');

    // Arrays matching the SVG order
    const signNames = [
        'Cipactli (Crocodile)', 'Ehecatl (Wind)', 'Calli (House)', 'Cuetzpalin (Lizard)', 'Coatl (Serpent)', 
        'Miquiztli (Death)', 'Mazatl (Deer)', 'Tochtli (Rabbit)', 'Atl (Water)', 'Itzcuintli (Dog)', 
        'Ozomatli (Monkey)', 'Malinalli (Grass)', 'Acatl (Reed)', 'Ocelotl (Jaguar)', 'Cuauhtli (Eagle)', 
        'Cozcacuauhtli (Vulture)', 'Ollin (Movement)', 'Tecpatl (Flint)', 'Quiahuitl (Storm)', 'Xochitl (Flower)'
    ];

    const signMeanings = [
        "The origin of all things. A day of beginnings and primal energy.",
        "The breath of life. Communication, intelligence, and the spirit.",
        "Rest and family. A day for internal reflection and domestic peace.",
        "Fertility and abundance. Seeds are planted, both literal and metaphorical.",
        "Wisdom and cunning. The serpent sheds its skin, representing transformation.",
        "Transformation and ancestors. A day to honor those who came before.",
        "Swiftness and grace. The forest spirit, connected to the hunt.",
        "The moon rabbit. Fertility, dreams, and the intoxication of the spirit.",
        "Purification and flow. Water cleanses the soul and nourishes the earth.",
        "Loyalty and guidance. The dog who guides the soul through the underworld.",
        "Art and playfulness. The monkey represents dance, music, and joy.",
        "Tenacity and fate. Twisted grass that binds, representing karma and destiny.",
        "Authority and rigidity. The reed stands tall, symbolizing justice and law.",
        "Power and the night. The jaguar is the lord of the underworld and valor.",
        "Freedom and vision. The eagle soars highest, closest to the sun.",
        "Wisdom and age. The vulture cleanses and sees all from above.",
        "Earthquake and change. Movement is the essence of the Fifth Sun.",
        "Trial and sacrifice. The obsidian knife cuts away the unnecessary.",
        "Storm and renewal. The rain that brings life but also destruction.",
        "Beauty and art. The flower is the ultimate expression of the divine."
    ];

    function calculateTonalpohualli() {
        // Reference Date: January 1, 2000 = 13 Ozomatli (Index 10 for Monkey)
        // Number 13 is the max, but in modulo 13 logic, 13 % 13 = 0, so we adjust.
        const refDate = new Date(2000, 0, 1); 
        const today = new Date();
        
        // Difference in days
        const diffTime = Math.abs(today - refDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        // Calculate Number (1-13)
        // Ref was 13.
        // (13 + diffDays) % 13. If result is 0, it's 13.
        let currentNum = (13 + diffDays) % 13;
        if (currentNum === 0) currentNum = 13;

        // Calculate Sign (0-19)
        // Ref was Ozomatli (Index 10).
        let currentSignIndex = (10 + diffDays) % 20;

        // Update DOM
        currentDayNumberEl.textContent = currentNum;
        currentDaySignEl.textContent = daySigns[currentSignIndex];
        currentDayNameEl.textContent = signNames[currentSignIndex];
        currentDayMeaningEl.textContent = signMeanings[currentSignIndex];
    }

    calculateTonalpohualli();

    // ==========================================================================
    // 6. AUDIO TOGGLE (Visual Only)
    // ==========================================================================
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = audioToggle.querySelector('.audio-toggle__icon');
    let isAudioPlaying = false;

    audioToggle.addEventListener('click', () => {
        isAudioPlaying = !isAudioPlaying;
        if (isAudioPlaying) {
            audioIcon.textContent = '🔊';
            audioToggle.querySelector('.audio-toggle__label').textContent = 'Ambience Active';
            // In a real implementation, audio.play() would go here.
            audioToggle.style.borderColor = 'var(--color-jade)';
            audioToggle.style.color = 'var(--color-jade-glow)';
        } else {
            audioIcon.textContent = '🔇';
            audioToggle.querySelector('.audio-toggle__label').textContent = 'Ceremonial Ambience';
            // audio.pause()
            audioToggle.style.borderColor = '';
            audioToggle.style.color = '';
        }
    });

    // ==========================================================================
    // 7. INTERACTIVE CARD EFFECTS
    // ==========================================================================
    // Add subtle 3D tilt effect to cards on hover
    const cards = document.querySelectorAll('.current-day-card, .ritual-item, .lord-card, .astro-card, .offering-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ==========================================================================
    // 8. NIGHT LORDS HIGHLIGHT
    // ==========================================================================
    // Highlight the current night lord based on hour (simplified simulation)
    const nightLords = document.querySelectorAll('.night-lord');
    const currentHour = new Date().getHours();
    
    // 9 Lords cycle every 24 hours roughly? No, it's a day cycle.
    // Let's just pick a random one to highlight as "Current" for visual effect,
    // or calculate based on day index % 9.
    // Using the diffDays calculated earlier:
    const diffTime = Math.abs(new Date() - new Date(2000, 0, 1));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentLordIndex = diffDays % 9;

    // Remove existing current class
    nightLords.forEach(l => l.classList.remove('night-lord--current'));
    
    // Add to current (Indices 0-8)
    if(nightLords[currentLordIndex]) {
        nightLords[currentLordIndex].classList.add('night-lord--current');
    }

});