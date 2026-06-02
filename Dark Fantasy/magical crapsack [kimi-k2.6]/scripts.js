/* ════════════════════════════════════════
   THE CODEX OF ASH AND ECHO
   Scripts of the Dying Age
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initAshParticles();
    initTorchCursor();
    initNavigation();
    initCorruptionGauge();
    initAfflictionCards();
    initLandscapeViewer();
    initCalendar();
    initArtifactShowcase();
    initMiseryTally();
});

/* ── Ash Particle System ── */
function initAshParticles() {
    const container = document.getElementById('ashParticles');
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        createAshParticle(container);
    }
}

function createAshParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'ash-particle';
    
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 20;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
    
    particle.addEventListener('animationend', () => {
        particle.remove();
        createAshParticle(container);
    });
}

/* ── Torch Cursor ── */
function initTorchCursor() {
    const torch = document.getElementById('torchCursor');
    let mouseX = 0, mouseY = 0;
    let torchX = 0, torchY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    document.addEventListener('mouseleave', () => {
        torch.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        torch.style.opacity = '1';
    });
    
    function animateTorch() {
        const ease = 0.08;
        torchX += (mouseX - torchX) * ease;
        torchY += (mouseY - torchY) * ease;
        
        torch.style.left = torchX + 'px';
        torch.style.top = torchY + 'px';
        
        requestAnimationFrame(animateTorch);
    }
    
    animateTorch();
}

/* ── Navigation ── */
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.page-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.dataset.section;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            sections.forEach(s => {
                s.classList.remove('active');
                if (s.id === targetSection) {
                    s.classList.add('active');
                }
            });
        });
    });
}

/* ── Corruption Gauge ── */
function initCorruptionGauge() {
    const gaugeFill = document.getElementById('gaugeFill');
    const gaugePulse = document.getElementById('gaugePulse');
    const gaugePercent = document.getElementById('gaugePercent');
    const gaugeCore = document.getElementById('gaugeCore');
    
    const targetPercent = 73;
    const circumference = 2 * Math.PI * 160;
    const offset = circumference - (targetPercent / 100) * circumference;
    
    const gradientId = 'gaugeGradient';
    const svg = document.querySelector('.corruption-gauge');
    
    const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS('http://www.w3.org/2000/svg', 'defs'), svg.firstChild);
    
    const existingGradient = document.getElementById(gradientId);
    if (existingGradient) existingGradient.remove();
    
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.id = gradientId;
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stops = [
        { offset: '0%', color: '#4a5a3a' },
        { offset: '50%', color: '#7a6a2a' },
        { offset: '100%', color: '#8a2525' }
    ];
    
    stops.forEach(s => {
        const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop.setAttribute('offset', s.offset);
        stop.setAttribute('stop-color', s.color);
        gradient.appendChild(stop);
    });
    
    defs.appendChild(gradient);
    
    setTimeout(() => {
        gaugeFill.style.strokeDashoffset = offset;
        gaugePulse.style.strokeDashoffset = offset;
    }, 500);
    
    animateNumber(gaugePercent, targetPercent, 3000, '%');
    
    setTimeout(() => {
        gaugeCore.style.opacity = '0.15';
    }, 2500);
}

/* ── Affliction Cards ── */
function initAfflictionCards() {
    const cards = document.querySelectorAll('.affliction-card');
    
    cards.forEach(card => {
        const trigger = card.querySelector('.card-trigger');
        
        trigger.addEventListener('click', () => {
            const isExpanded = card.classList.contains('expanded');
            
            cards.forEach(c => c.classList.remove('expanded'));
            
            if (!isExpanded) {
                card.classList.add('expanded');
            }
        });
    });
}

/* ── Landscape Viewer ── */
function initLandscapeViewer() {
    const zones = document.querySelectorAll('.map-zone');
    const descriptions = document.querySelectorAll('.zone-description');
    
    zones.forEach(zone => {
        zone.addEventListener('click', () => {
            const targetZone = zone.dataset.zone;
            
            zones.forEach(z => z.classList.remove('active'));
            zone.classList.add('active');
            
            descriptions.forEach(d => {
                d.classList.remove('active');
                if (d.dataset.zone === targetZone) {
                    d.classList.add('active');
                }
            });
        });
    });
}

/* ── Calendar ── */
function initCalendar() {
    const monthNames = [
        'The Month of Ashfall',
        'The Month of Thornwaking',
        'The Month of Hollowseed',
        'The Month of Bloodtide',
        'The Month of Bonerattle',
        'The Month of Veilthin',
        'The Month of Deepfrost',
        'The Month of Rotrenew',
        'The Month of Scaropen',
        'The Month of Griefharvest',
        'The Month of Final Ember',
        'The Month of Voidclose'
    ];
    
    const ritualData = {
        17: { title: 'The Feast of Hollow Eyes', type: 'major', desc: 'Commemoration of the Blind Pilgrimage. Participants surrender vision for three days. The Blinded report seeing more clearly than before.', protocol: 'Mandatory — All Settlements' },
        23: { title: 'Bloodtide Conjunction', type: 'severe', desc: 'The moon completes its weeping. All fluids run crimson from moonrise to moonset. Seal all wounds. Do not conceive.', protocol: 'Cataclysmic — Survival Protocol' },
        29: { title: 'The Rooting', type: 'moderate', desc: 'Planting ritual for crops that will not grow. Necessary symbolic defiance. Those who skip the Rooting often find themselves growing where they stand.', protocol: 'Recommended — Agricultural Communities' }
    };
    
    let currentMonth = 0;
    let currentDay = new Date().getDate();
    
    const calMonth = document.getElementById('calMonth');
    const daysGrid = document.getElementById('daysGrid');
    const calPrev = document.getElementById('calPrev');
    const calNext = document.getElementById('calNext');
    const phaseName = document.getElementById('phaseName');
    const phaseDays = document.getElementById('phaseDays');
    const moonPhase = document.getElementById('moonPhase');
    const ritualItems = document.getElementById('ritualItems');
    
    function getMoonPhase(day, month) {
        const cycle = 29.53;
        const offset = (month * 30 + day) % cycle;
        const phase = offset / cycle;
        
        if (phase < 0.03) return { name: 'New Moon', shadow: '-100%' };
        if (phase < 0.22) return { name: 'Waxing Crescent', shadow: '-60%' };
        if (phase < 0.28) return { name: 'First Quarter', shadow: '-50%' };
        if (phase < 0.47) return { name: 'Waxing Gibbous', shadow: '-20%' };
        if (phase < 0.53) return { name: 'Full Moon', shadow: '100%' };
        if (phase < 0.72) return { name: 'Waning Gibbous', shadow: '60%' };
        if (phase < 0.78) return { name: 'Last Quarter', shadow: '50%' };
        return { name: 'Waning Crescent', shadow: '20%' };
    }
    
    function getDaysToBloodtide(day) {
        const bloodtideDay = 23;
        if (day <= bloodtideDay) return bloodtideDay - day;
        return bloodtideDay + 30 - day;
    }
    
    function renderCalendar() {
        calMonth.textContent = monthNames[currentMonth];
        daysGrid.innerHTML = '';
        
        const daysInMonth = 30;
        const startDay = (currentMonth * 5) % 7;
        
        for (let i = 0; i < startDay; i++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell other-month';
            cell.textContent = 30 - startDay + i + 1;
            daysGrid.appendChild(cell);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            cell.textContent = day;
            
            if (day === currentDay && currentMonth === 0) {
                cell.classList.add('today');
            }
            
            if (ritualData[day]) {
                cell.classList.add('ritual-day');
                cell.addEventListener('click', () => highlightRitual(day));
            }
            
            cell.addEventListener('click', () => {
                document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('selected'));
                cell.classList.add('selected');
            });
            
            daysGrid.appendChild(cell);
        }
        
        const remaining = 42 - (startDay + daysInMonth);
        for (let i = 1; i <= remaining; i++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell other-month';
            cell.textContent = i;
            daysGrid.appendChild(cell);
        }
        
        updateLunarDisplay();
    }
    
    function updateLunarDisplay() {
        const phase = getMoonPhase(currentDay, currentMonth);
        phaseName.textContent = phase.name;
        
        const daysToBloodtide = getDaysToBloodtide(currentDay);
        phaseDays.textContent = `${daysToBloodtide} day${daysToBloodtide !== 1 ? 's' : ''} until Bloodtide`;
        
        moonPhase.style.setProperty('--shadow-x', phase.shadow);
    }
    
    function highlightRitual(day) {
        const ritual = ritualData[day];
        if (!ritual) return;
        
        const items = ritualItems.querySelectorAll('.ritual-item');
        items.forEach(item => {
            item.style.opacity = '0.3';
            if (parseInt(item.dataset.date) === day) {
                item.style.opacity = '1';
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        setTimeout(() => {
            items.forEach(item => item.style.opacity = '1');
        }, 3000);
    }
    
    calPrev.addEventListener('click', () => {
        currentMonth = (currentMonth - 1 + 12) % 12;
        renderCalendar();
    });
    
    calNext.addEventListener('click', () => {
        currentMonth = (currentMonth + 1) % 12;
        renderCalendar();
    });
    
    renderCalendar();
}

/* ── Artifact Showcase ── */
function initArtifactShowcase() {
    const artifacts = document.querySelectorAll('.artifact-detail');
    const sigils = ['⚱', '◐', '🔔', '👑', '🌱'];
    const auraColors = [
        'rgba(196, 117, 58, 0.2)',
        'rgba(138, 37, 37, 0.2)',
        'rgba(196, 117, 58, 0.3)',
        'rgba(232, 168, 96, 0.2)',
        'rgba(74, 90, 58, 0.2)'
    ];
    
    let currentIndex = 0;
    
    const artifactSigil = document.getElementById('artifactSigil');
    const artifactAura = document.getElementById('artifactAura');
    const artifactCounter = document.getElementById('artifactCounter');
    const prevBtn = document.getElementById('artifactPrev');
    const nextBtn = document.getElementById('artifactNext');
    
    function showArtifact(index) {
        artifacts.forEach((a, i) => {
            a.classList.toggle('active', i === index);
        });
        
        artifactSigil.textContent = sigils[index];
        artifactSigil.style.filter = `drop-shadow(0 0 20px ${auraColors[index]})`;
        
        artifactAura.style.borderColor = auraColors[index];
        artifactAura.classList.add('active');
        
        artifactCounter.textContent = `${index + 1} / ${artifacts.length}`;
    }
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + artifacts.length) % artifacts.length;
        showArtifact(currentIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % artifacts.length;
        showArtifact(currentIndex);
    });
    
    showArtifact(currentIndex);
}

/* ── Misery Tally Animation ── */
function initMiseryTally() {
    const tallyItems = document.querySelectorAll('.tally-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateNumber(entry.target, target, 2500, '');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    tallyItems.forEach(item => observer.observe(item));
}

/* ── Utility: Number Animation ── */
function animateNumber(element, target, duration, suffix) {
    const start = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startValue + (target - startValue) * easeOut);
        
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}