// ============================================
// THE BLEAK REALMS - DARK FANTASY JAVASCRIPT
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('The Bleak Realms chronicle initializing...');
    
    // Initialize all modules
    initAmbientSound();
    initRitualNavigation();
    initAfflictionTracker();
    initMiseryIndex();
    initTormentCalendar();
    initArtifactCatalog();
    initBlightMap();
    initSoulLedger();
    initModals();
    initDynamicUpdates();
    
    // Set chronicle date
    updateChronicleDate();
    
    // Start ambient animations
    startAmbientAnimations();
    
    console.log('Chronicle ready. May the darkness consume us gently.');
});

// ============================================
// AMBIENT SOUND SYSTEM
// ============================================

function initAmbientSound() {
    const soundToggle = document.getElementById('soundToggle');
    const soundLabel = soundToggle.querySelector('.sound-label');
    let soundEnabled = false;
    
    // Create audio context for ambient sounds
    let audioContext;
    let ambientSounds = [];
    
    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        
        if (soundEnabled) {
            soundLabel.textContent = 'Silence';
            soundToggle.querySelector('.sound-icon').textContent = '♫';
            startAmbientSounds();
        } else {
            soundLabel.textContent = 'Whispers';
            soundToggle.querySelector('.sound-icon').textContent = '♫';
            stopAmbientSounds();
        }
        
        // Visual feedback
        soundToggle.style.boxShadow = soundEnabled 
            ? '0 0 25px var(--color-blood)' 
            : 'var(--shadow-ritual)';
    });
    
    function startAmbientSounds() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create whispering voices
        for (let i = 0; i < 3; i++) {
            createWhisperSound(i);
        }
        
        // Create distant screams
        createScreamSound();
        
        // Create wind howl
        createWindSound();
    }
    
    function createWhisperSound(index) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 120 + (index * 40);
        
        gainNode.gain.value = 0.02;
        gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 5);
        
        ambientSounds.push({ oscillator, gainNode });
        
        // Schedule next whisper
        setTimeout(() => {
            if (soundEnabled) createWhisperSound(index);
        }, 5000 + Math.random() * 10000);
    }
    
    function createScreamSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 1);
        
        gainNode.gain.value = 0;
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);
        
        ambientSounds.push({ oscillator, gainNode });
        
        // Schedule next scream
        setTimeout(() => {
            if (soundEnabled) createScreamSound();
        }, 15000 + Math.random() * 20000);
    }
    
    function createWindSound() {
        const noiseBuffer = createNoiseBuffer();
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = noiseBuffer;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.value = 0.03;
        
        source.loop = true;
        source.start();
        
        ambientSounds.push({ source, gainNode });
    }
    
    function createNoiseBuffer() {
        const bufferSize = audioContext.sampleRate * 2;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }
    
    function stopAmbientSounds() {
        ambientSounds.forEach(sound => {
            if (sound.oscillator) sound.oscillator.stop();
            if (sound.source) sound.source.stop();
            if (sound.gainNode) sound.gainNode.disconnect();
        });
        
        ambientSounds = [];
    }
}

// ============================================
// RITUAL NAVIGATION
// ============================================

function initRitualNavigation() {
    const navPoints = document.querySelectorAll('.nav-point');
    const ritualCircle = document.querySelector('.ritual-circle');
    const centerSymbol = document.querySelector('.center-symbol');
    
    // Add hover effects to navigation points
    navPoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            const symbol = this.querySelector('.nav-symbol');
            symbol.style.transform = 'scale(1.3)';
            symbol.style.textShadow = '0 0 10px var(--color-blood)';
            
            // Rotate ritual circle slightly
            ritualCircle.style.transform = 'translateX(-50%) rotate(5deg)';
            ritualCircle.style.transition = 'transform 0.5s ease';
        });
        
        point.addEventListener('mouseleave', function() {
            const symbol = this.querySelector('.nav-symbol');
            symbol.style.transform = 'scale(1)';
            symbol.style.textShadow = 'var(--shadow-text)';
            
            // Return ritual circle to original position
            ritualCircle.style.transform = 'translateX(-50%) rotate(0deg)';
        });
        
        // Smooth scroll to sections
        point.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Pulse the center symbol
                centerSymbol.style.animation = 'none';
                setTimeout(() => {
                    centerSymbol.style.animation = 'pulse 3s ease-in-out infinite';
                }, 10);
            }
        });
    });
    
    // Animate ritual circle continuously
    let rotation = 0;
    setInterval(() => {
        rotation = (rotation + 0.1) % 360;
        ritualCircle.style.background = `linear-gradient(${rotation}deg, rgba(26, 26, 26, 0.8), rgba(40, 40, 40, 0.9))`;
    }, 50);
}

// ============================================
// AFFLICTION TRACKER
// ============================================

function initAfflictionTracker() {
    const addAfflictionBtn = document.querySelector('.add-affliction-btn');
    const afflictionModal = document.getElementById('afflictionModal');
    const afflictionForm = document.getElementById('afflictionForm');
    const afflictionGrid = document.querySelector('.affliction-grid');
    
    // Animate count numbers
    animateAfflictionCounts();
    
    // Add affliction button
    addAfflictionBtn.addEventListener('click', function() {
        afflictionModal.style.display = 'flex';
    });
    
    // Form submission
    afflictionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('afflictionName').value;
        const desc = document.getElementById('afflictionDesc').value;
        const severity = document.getElementById('afflictionSeverity').value;
        
        // Create new affliction card
        const newAffliction = createAfflictionCard(name, desc, severity);
        afflictionGrid.appendChild(newAffliction);
        
        // Close modal
        afflictionModal.style.display = 'none';
        
        // Reset form
        afflictionForm.reset();
        
        // Update misery index
        updateMiseryIndex();
    });
    
    // Animate progress bars
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
            fill.style.transition = 'width 2s ease-in-out';
            fill.style.width = width;
        }, 500);
    });
}

function animateAfflictionCounts() {
    const countElements = document.querySelectorAll('[data-count]');
    
    countElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-count'));
        const current = parseInt(element.textContent.replace(/,/g, ''));
        
        if (current < target) {
            let count = current;
            const increment = Math.ceil((target - current) / 100);
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    count = target;
                    clearInterval(timer);
                }
                element.textContent = count.toLocaleString();
            }, 20);
        }
    });
}

function createAfflictionCard(name, description, severity) {
    const card = document.createElement('div');
    card.className = 'affliction-card';
    card.setAttribute('data-severity', severity);
    
    const severityText = severity.charAt(0).toUpperCase() + severity.slice(1);
    const randomCount = Math.floor(Math.random() * 5000) + 1000;
    const randomProgress = Math.floor(Math.random() * 30) + 10;
    
    card.innerHTML = `
        <div class="affliction-header">
            <h3 class="affliction-name">${name}</h3>
            <div class="affliction-severity">
                <span class="severity-dot"></span>
                <span class="severity-text">${severityText}</span>
            </div>
        </div>
        <div class="affliction-stats">
            <div class="stat">
                <span class="stat-label">Affected</span>
                <span class="stat-value" data-count="${randomCount}">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">Mortality</span>
                <span class="stat-value">${Math.floor(Math.random() * 30) + 60}%</span>
            </div>
            <div class="stat">
                <span class="stat-label">Spread Rate</span>
                <span class="stat-value">${['Slow', 'Moderate', 'Rapid'][Math.floor(Math.random() * 3)]}</span>
            </div>
        </div>
        <div class="affliction-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${randomProgress}%"></div>
            </div>
            <div class="progress-label">${randomProgress}% of regions contaminated</div>
        </div>
        <div class="affliction-description">
            ${description}
        </div>
    `;
    
    // Animate the new card
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        
        // Animate the count
        const countElement = card.querySelector('[data-count]');
        animateCountElement(countElement);
        
        // Animate progress bar
        const progressFill = card.querySelector('.progress-fill');
        const width = progressFill.style.width;
        progressFill.style.width = '0%';
        
        setTimeout(() => {
            progressFill.style.transition = 'width 2s ease-in-out';
            progressFill.style.width = width;
        }, 300);
    }, 100);
    
    return card;
}

function animateCountElement(element) {
    const target = parseInt(element.getAttribute('data-count'));
    let count = 0;
    const increment = Math.ceil(target / 100);
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        element.textContent = count.toLocaleString();
    }, 20);
}

// ============================================
// MISERY INDEX
// ============================================

function initMiseryIndex() {
    const updateBtn = document.getElementById('updateMisery');
    const miseryFill = document.getElementById('miseryFill');
    const miseryValue = document.getElementById('miseryValue');
    const lastUpdate = document.getElementById('lastUpdate');
    const factorFills = document.querySelectorAll('.factor-fill');
    
    // Initialize with random values
    let currentMisery = 87;
    updateMiseryDisplay(currentMisery);
    
    // Animate factor bars
    factorFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
            fill.style.transition = 'width 1.5s ease-in-out';
            fill.style.width = width;
        }, Math.random() * 500);
    });
    
    // Update button
    updateBtn.addEventListener('click', function() {
        updateBtn.disabled = true;
        updateBtn.innerHTML = '<span class="btn-icon">↻</span> Calculating...';
        
        // Simulate calculation
        setTimeout(() => {
            const change = Math.floor(Math.random() * 10) - 3;
            currentMisery = Math.min(100, Math.max(0, currentMisery + change));
            
            updateMiseryDisplay(currentMisery);
            
            // Update time
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            lastUpdate.textContent = `${timeString}`;
            
            updateBtn.disabled = false;
            updateBtn.innerHTML = '<span class="btn-icon">↻</span> Recalculate Suffering';
            
            // Update factor bars
            updateFactorBars(currentMisery);
        }, 1500);
    });
    
    // Auto-update every 30 seconds
    setInterval(() => {
        const change = Math.floor(Math.random() * 3) - 1;
        currentMisery = Math.min(100, Math.max(0, currentMisery + change));
        updateMiseryDisplay(currentMisery);
    }, 30000);
}

function updateMiseryDisplay(value) {
    const miseryFill = document.getElementById('miseryFill');
    const miseryValue = document.getElementById('miseryValue');
    const meterNeedle = document.querySelector('.meter-needle');
    
    miseryFill.style.width = `${value}%`;
    meterNeedle.style.left = `${value}%`;
    
    // Animate number change
    const currentValue = parseInt(miseryValue.textContent);
    const difference = value - currentValue;
    const steps = 20;
    const stepValue = difference / steps;
    
    let step = 0;
    const timer = setInterval(() => {
        if (step >= steps) {
            miseryValue.textContent = value;
            clearInterval(timer);
            return;
        }
        
        miseryValue.textContent = Math.round(currentValue + (stepValue * step));
        step++;
    }, 50);
}

function updateFactorBrows(miseryValue) {
    const factors = document.querySelectorAll('.factor');
    
    factors.forEach(factor => {
        const bar = factor.querySelector('.factor-fill');
        const valueElement = factor.querySelector('.factor-value');
        
        const currentValue = parseInt(valueElement.textContent);
        const change = Math.floor(Math.random() * 10) - 2;
        const newValue = Math.min(100, Math.max(0, currentValue + change));
        
        // Update display
        bar.style.width = `${newValue}%`;
        valueElement.textContent = `${newValue}%`;
        
        // Visual feedback
        if (newValue > currentValue) {
            factor.style.backgroundColor = 'rgba(139, 0, 0, 0.1)';
            setTimeout(() => {
                factor.style.backgroundColor = '';
            }, 1000);
        }
    });
}

// ============================================
// TORMENT CALENDAR
// ============================================

function initTormentCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const monthName = document.querySelector('.month-name');
    
    let currentMonth = 0; // 0 = Weeping, 1 = Sorrow, 2 = Despair, etc.
    const monthNames = ['Moon of Weeping', 'Moon of Sorrow', 'Moon of Despair', 'Moon of Anguish'];
    
    // Generate calendar
    generateCalendar(currentMonth);
    
    // Month navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonth = (currentMonth - 1 + monthNames.length) % monthNames.length;
        updateCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth = (currentMonth + 1) % monthNames.length;
        updateCalendar();
    });
    
    // Countdown timers for torment items
    updateTormentCountdowns();
    
    function generateCalendar(monthIndex) {
        calendarDays.innerHTML = '';
        monthName.textContent = monthNames[monthIndex];
        
        // Generate 28 days (bleak months are short)
        for (let day = 1; day <= 28; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = day;
            
            // Mark torment days (random 5 days)
            if (Math.random() < 0.18 || day === 7 || day === 13 || day === 21) {
                dayCell.classList.add('torment-day');
                
                // Add torment details on hover
                dayCell.setAttribute('data-torment', getRandomTorment());
                dayCell.addEventListener('mouseenter', showDayTooltip);
                dayCell.addEventListener('mouseleave', hideDayTooltip);
            }
            
            calendarDays.appendChild(dayCell);
        }
    }
    
    function updateCalendar() {
        calendarDays.style.opacity = '0.5';
        
        setTimeout(() => {
            generateCalendar(currentMonth);
            calendarDays.style.transition = 'opacity 0.3s ease';
            calendarDays.style.opacity = '1';
        }, 300);
    }
    
    function getRandomTorment() {
        const torments = [
            'Blood rain',
            'Shadow plague',
            'Memory theft',
            'Stone curse',
            'Silent scream',
            'Hope extraction',
            'Soul harvest'
        ];
        return torments[Math.floor(Math.random() * torments.length)];
    }
}

function showDayTooltip(e) {
    const torment = e.target.getAttribute('data-torment');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'day-tooltip';
    tooltip.textContent = torment;
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'var(--color-tombstone)';
    tooltip.style.border = '1px solid var(--color-blood)';
    tooltip.style.padding = '0.5rem';
    tooltip.style.borderRadius = '4px';
    tooltip.style.zIndex = '1000';
    tooltip.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    e.target._tooltip = tooltip;
}

function hideDayTooltip(e) {
    if (e.target._tooltip) {
        e.target._tooltip.remove();
        delete e.target._tooltip;
    }
}

function updateTormentCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown-text');
    
    countdownElements.forEach(element => {
        const text = element.textContent;
        if (text.includes('remaining')) {
            const days = parseInt(text.split(' ')[0]);
            
            // Update every hour
            setInterval(() => {
                if (days > 0) {
                    const newDays = days - 0.0417; // ~1 hour in days
                    element.textContent = `${Math.ceil(newDays)} days remaining`;
                }
            }, 3600000); // 1 hour
        }
    });
}

// ============================================
// ARTIFACT CATALOG
// ============================================

function initArtifactCatalog() {
    const artifactButtons = document.querySelectorAll('.artifact-details-btn');
    const artifactModal = document.getElementById('artifactModal');
    const modalBody = artifactModal.querySelector('.modal-body');
    
    artifactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const artifact = this.getAttribute('data-artifact');
            showArtifactDetails(artifact);
        });
    });
    
    // Artifact hover effects
    const artifactCards = document.querySelectorAll('.artifact-card');
    artifactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const placeholder = this.querySelector('.image-placeholder');
            placeholder.style.transform = 'scale(1.1)';
            placeholder.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            const placeholder = this.querySelector('.image-placeholder');
            placeholder.style.transform = 'scale(1)';
        });
    });
}

function showArtifactDetails(artifact) {
    const modal = document.getElementById('artifactModal');
    const modalBody = modal.querySelector('.modal-body');
    
    let details;
    
    switch(artifact) {
        case 'crown':
            details = {
                name: 'The Weeping Crown',
                age: '1,247 years',
                victims: '12,489 confirmed, countless unknown',
                description: 'Forged from the tears of a thousand saints and the despair of a fallen kingdom. The crown grants omniscience but forces the wearer to witness every moment of suffering across all realms simultaneously.',
                curse: 'Eternal awareness of all pain, present and future. Wearers typically go mad within hours, but cannot die or remove the crown.',
                effects: [
                    'Omniscient vision across all dimensions',
                    'Inability to filter or ignore suffering',
                    'Physical manifestation of witnessed pain',
                    'Immortality until crown is passed willingly'
                ],
                ritual: 'Must be passed during a blood moon while the giver is still conscious'
            };
            break;
            
        case 'mirror':
            details = {
                name: 'Mirror of Shattered Souls',
                age: '892 years',
                victims: '7,632 recorded suicides',
                description: 'Crafted from polished obsidian and bound with silver from a star that witnessed the birth of suffering. Shows not the viewer\'s reflection, but the person they love most suffering unbearable torment.',
                curse: 'Forces viewer to witness loved ones\' suffering with absolute clarity and realism.',
                effects: [
                    'Shows most painful possible scenario for loved ones',
                    'Memory of vision cannot be erased or softened',
                    'Drives 97% of viewers to immediate suicide',
                    'Survivors become permanently catatonic'
                ],
                ritual: 'Can only be destroyed by a truly selfless act witnessed by the mirror'
            };
            break;
            
        case 'chalice':
            details = {
                name: 'Chalice of Bitter Hope',
                age: '543 years',
                victims: '3,217 transferred afflictions',
                description: 'Carved from the heartwood of the Last Hope Tree and lined with silver stolen from a healing shrine. Cures any ailment of the drinker, but transfers it immediately to someone the drinker genuinely loves.',
                curse: 'Transferred suffering is always 10 times worse for the recipient.',
                effects: [
                    'Instantaneous transfer of any condition',
                    'Recipient suffers amplified version',
                    'Cure lasts only until the recipient dies',
                    'Drinker knows exactly who received their suffering'
                ],
                ritual: 'Cannot be emptied; always contains exactly one draught'
            };
            break;
    }
    
    modalBody.innerHTML = `
        <h3 class="modal-title">${details.name}</h3>
        <div class="artifact-details">
            <div class="detail-row">
                <strong>Age:</strong> ${details.age}
            </div>
            <div class="detail-row">
                <strong>Confirmed Victims:</strong> ${details.victims}
            </div>
            
            <div class="detail-section">
                <h4>Description</h4>
                <p>${details.description}</p>
            </div>
            
            <div class="detail-section">
                <h4>The Curse</h4>
                <p>${details.curse}</p>
            </div>
            
            <div class="detail-section">
                <h4>Known Effects</h4>
                <ul>
                    ${details.effects.map(effect => `<li>${effect}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h4>Ritual Knowledge</h4>
                <p>${details.ritual}</p>
            </div>
            
            <div class="artifact-warning">
                <strong>⚠️ Warning:</strong> Direct handling is not recommended. All artifacts in this catalog are currently uncontained and location unknown.
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// ============================================
// BLIGHT MAP
// ============================================

function initBlightMap() {
    const canvas = document.getElementById('blightCanvas');
    const ctx = canvas.getContext('2d');
    const playPauseBtn = document.getElementById('playPause');
    const speedUpBtn = document.getElementById('speedUp');
    const addBlightBtn = document.getElementById('addBlight');
    
    let animationRunning = true;
    let animationSpeed = 1;
    let blightSources = [];
    
    // Initialize canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create initial blight sources
    createInitialBlightSources();
    
    // Animation loop
    function animate() {
        if (!animationRunning) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawBackground();
        
        // Update and draw blight sources
        updateBlightSources();
        
        // Draw corruption overlay
        drawCorruptionOverlay();
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Controls
    playPauseBtn.addEventListener('click', function() {
        animationRunning = !animationRunning;
        
        if (animationRunning) {
            this.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Pause Spread</span>';
            animate();
        } else {
            this.innerHTML = '<span class="btn-icon">⏵</span><span class="btn-text">Resume Spread</span>';
        }
    });
    
    speedUpBtn.addEventListener('click', function() {
        animationSpeed = animationSpeed === 1 ? 2 : 1;
        this.innerHTML = animationSpeed === 2 
            ? '<span class="btn-icon">⏪</span><span class="btn-text">Normal Speed</span>'
            : '<span class="btn-icon">⏩</span><span class="btn-text">Accelerate</span>';
    });
    
    addBlightBtn.addEventListener('click', function() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        addBlightSource(x, y);
        
        // Visual feedback
        this.style.backgroundColor = 'rgba(139, 0, 0, 0.4)';
        setTimeout(() => {
            this.style.backgroundColor = '';
        }, 500);
    });
    
    // Canvas interaction
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addBlightSource(x, y);
    });
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = 500;
    }
    
    function drawBackground() {
        // Draw bleak landscape
        ctx.fillStyle = '#2d1b00';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw some terrain features
        ctx.fillStyle = '#5a3a1a';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.3, canvas.height * 0.7, 50, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(canvas.width * 0.7, canvas.height * 0.3, 70, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(canvas.width * 0.5, canvas.height * 0.5, 40, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function createInitialBlightSources() {
        // Create 3 initial blight sources
        blightSources = [
            { x: canvas.width * 0.3, y: canvas.height * 0.3, radius: 30, intensity: 1 },
            { x: canvas.width * 0.7, y: canvas.height * 0.7, radius: 40, intensity: 0.8 },
            { x: canvas.width * 0.5, y: canvas.height * 0.8, radius: 25, intensity: 0.6 }
        ];
    }
    
    function addBlightSource(x, y) {
        blightSources.push({
            x, y,
            radius: 20 + Math.random() * 20,
            intensity: 0.5 + Math.random() * 0.5
        });
        
        // Update stats
        updateBlightStats();
    }
    
    function updateBlightSources() {
        blightSources.forEach(source => {
            // Grow over time
            source.radius += 0.05 * animationSpeed;
            source.intensity = Math.min(1, source.intensity + 0.001 * animationSpeed);
            
            // Draw blight source
            const gradient = ctx.createRadialGradient(
                source.x, source.y, 0,
                source.x, source.y, source.radius
            );
            
            gradient.addColorStop(0, `rgba(139, 0, 0, ${source.intensity})`);
            gradient.addColorStop(0.5, `rgba(90, 58, 26, ${source.intensity * 0.7})`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(source.x, source.y, source.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Pulsing effect
            const pulseRadius = source.radius * (1 + 0.1 * Math.sin(Date.now() * 0.002));
            ctx.strokeStyle = `rgba(139, 0, 0, ${source.intensity * 0.3})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(source.x, source.y, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
        });
    }
    
    function drawCorruptionOverlay() {
        // Create corruption gradient overlay
        const overlay = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        overlay.addColorStop(0, 'rgba(90, 58, 26, 0.1)');
        overlay.addColorStop(0.5, 'rgba(139, 0, 0, 0.05)');
        overlay.addColorStop(1, 'rgba(45, 27, 0, 0.1)');
        
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    function updateBlightStats() {
        const landConsumed = document.querySelector('.blight-stat:nth-child(1) .stat-value');
        const pureZones = document.querySelector('.blight-stat:nth-child(3) .stat-value');
        
        // Calculate based on number of sources
        const consumption = Math.min(95, 30 + (blightSources.length * 10));
        const zones = Math.max(1, 7 - blightSources.length);
        
        landConsumed.textContent = `${consumption}%`;
        pureZones.textContent = zones;
    }
}

// ============================================
// SOUL LEDGER
// ============================================

function initSoulLedger() {
    const soulCount = document.getElementById('soulCount');
    const chartItems = document.querySelectorAll('.chart-item');
    
    // Animate soul count
    animateSoulCount();
    
    // Make chart items interactive
    chartItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(139, 0, 0, 0.5)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add new soul entries periodically
    setInterval(addRandomSoulEntry, 30000);
}

function animateSoulCount() {
    const element = document.getElementById('soulCount');
    const current = parseInt(element.textContent.replace(/,/g, ''));
    const target = current + 1247; // Add the daily increase
    
    let count = current;
    const increment = Math.ceil((target - current) / 100);
    
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        element.textContent = count.toLocaleString();
    }, 20);
}

function addRandomSoulEntry() {
    const soulList = document.querySelector('.soul-list');
    const names = [
        'Alistair the Forsaken',
        'Morgana of the Bleak Marsh',
        'Thorne, Last Knight of Hope',
        'Elara the Sightless',
        'Gideon the Broken',
        'Seraphina of the Ashen Veil',
        'Kaelen the Eternal',
        'Lysandra the Weeping'
    ];
    
    const causes = [
        'Weeping Plague',
        'Stonebone Curse',
        'Shadow Whisper',
        'Memory Rot',
        'Blood Moon Fever',
        'Soul Bleed',
        'Hope Sickness'
    ];
    
    const statuses = [
        'In Eternal Torment',
        'Petrified Spirit',
        'Shattered Consciousness',
        'Fading Echo',
        'Bound to Suffering',
        'Consumed by Despair'
    ];
    
    const name = names[Math.floor(Math.random() * names.length)];
    const cause = causes[Math.floor(Math.random() * causes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const entry = document.createElement('div');
    entry.className = 'soul-entry';
    entry.innerHTML = `
        <div class="soul-name">${name}</div>
        <div class="soul-details">
            <span class="soul-cause">${cause}</span>
            <span class="soul-time">Just now</span>
        </div>
        <div class="soul-status">${status}</div>
    `;
    
    // Add with animation
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(20px)';
    soulList.insertBefore(entry, soulList.firstChild);
    
    setTimeout(() => {
        entry.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        entry.style.opacity = '1';
        entry.style.transform = 'translateY(0)';
    }, 10);
    
    // Update soul count
    const soulCount = document.getElementById('soulCount');
    const current = parseInt(soulCount.textContent.replace(/,/g, ''));
    soulCount.textContent = (current + 1).toLocaleString();
    
    // Keep only 5 entries
    while (soulList.children.length > 5) {
        soulList.removeChild(soulList.lastChild);
    }
}

// ============================================
// MODAL SYSTEM
// ============================================

function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Close modals when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// ============================================
// DYNAMIC UPDATES
// ============================================

function initDynamicUpdates() {
    // Update last update time periodically
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const lastUpdate = document.getElementById('lastUpdate');
        lastUpdate.textContent = `${timeString}`;
    }, 60000); // Every minute
    
    // Random misery fluctuations
    setInterval(() => {
        const miseryValue = document.getElementById('miseryValue');
        const current = parseInt(miseryValue.textContent);
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newValue = Math.min(100, Math.max(0, current + change));
        
        if (newValue !== current) {
            updateMiseryDisplay(newValue);
        }
    }, 45000); // Every 45 seconds
}

function updateChronicleDate() {
    const chronicleDate = document.getElementById('chronicleDate');
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    const bleakMonths = [
        'Weeping', 'Sorrow', 'Despair', 'Anguish', 'Torment', 
        'Agony', 'Misery', 'Blight', 'Decay', 'Void', 
        'Abyss', 'Oblivion'
    ];
    
    const bleakYear = year - 1776; // Arbitrary offset for bleak timeline
    chronicleDate.textContent = `${day}th of ${bleakMonths[month]}, Year of Despair ${bleakYear}`;
}

// ============================================
// AMBIENT ANIMATIONS
// ============================================

function startAmbientAnimations() {
    // Random ink blot appearances
    setInterval(() => {
        const overlay = document.querySelector('.ink-blot-overlay');
        const blot = document.createElement('div');
        
        blot.style.position = 'fixed';
        blot.style.width = '200px';
        blot.style.height = '200px';
        blot.style.background = 'radial-gradient(circle, rgba(139, 0, 0, 0.1) 0%, transparent 70%)';
        blot.style.borderRadius = '50%';
        blot.style.left = `${Math.random() * 100}%`;
        blot.style.top = `${Math.random() * 100}%`;
        blot.style.pointerEvents = 'none';
        blot.style.zIndex = '0';
        blot.style.opacity = '0';
        
        overlay.appendChild(blot);
        
        // Animate in
        setTimeout(() => {
            blot.style.transition = 'opacity 2s ease';
            blot.style.opacity = '1';
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            blot.style.opacity = '0';
            setTimeout(() => {
                if (blot.parentNode) blot.remove();
            }, 2000);
        }, 3000);
    }, 8000);
    
    // Random text flicker in header
    const titleMain = document.querySelector('.title-main');
    setInterval(() => {
        titleMain.style.opacity = '0.8';
        setTimeout(() => {
            titleMain.style.opacity = '1';
        }, 100);
    }, 15000);
    
    // Pulsing severity dots
    const severityDots = document.querySelectorAll('.severity-dot');
    severityDots.forEach(dot => {
        setInterval(() => {
            dot.style.transform = 'scale(1.2)';
            setTimeout(() => {
                dot.style.transform = 'scale(1)';
            }, 500);
        }, 2000 + Math.random() * 2000);
    });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for debugging
window.BleakRealms = {
    version: '1.0.0',
    updateMiseryIndex,
    addRandomSoulEntry,
    updateChronicleDate
};