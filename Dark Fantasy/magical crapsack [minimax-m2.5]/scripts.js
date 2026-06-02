/* =============================================
THE BLIGHTED REALM OF MURKHOLLOW - SCRIPTS
============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initializeMiseryMeter();
    initializeCalendar();
    initializeArtifactsCarousel();
    initializeCursorTrail();
    initializeMapInteractions();
    initializeRitualHighlight();
    startRandomEvents();
    initializeFlavorTextRotation();
});

/* =============================================
MISERY METER
============================================= */

function initializeMiseryMeter() {
    const meterFill = document.getElementById('miseryFill');
    const miseryValue = document.getElementById('miseryValue');
    let currentMisery = 97.3;
    
    setTimeout(() => {
        meterFill.style.width = currentMisery + '%';
        updateMiseryValue(currentMisery);
    }, 500);
    
    setInterval(() => {
        const fluctuation = (Math.random() - 0.5) * 2;
        currentMisery = Math.min(100, Math.max(0, currentMisery + fluctuation));
        meterFill.style.width = currentMisery.toFixed(1) + '%';
        updateMiseryValue(currentMisery);
        updateMiseryFlavor(currentMisery);
    }, 5000);
}

function updateMiseryValue(value) {
    const miseryValue = document.getElementById('miseryValue');
    miseryValue.textContent = value.toFixed(1) + '%';
    
    if (value >= 90) {
        miseryValue.style.color = '#5c1212';
    } else if (value >= 70) {
        miseryValue.style.color = '#8b1a1a';
    } else if (value >= 50) {
        miseryValue.style.color = '#8b7355';
    } else {
        miseryValue.style.color = '#2d4a3e';
    }
}

function updateMiseryFlavor(value) {
    const flavorText = document.getElementById('miseryFlavor');
    const messages = [
        { min: 95, text: "The realm writhes in cosmic agony. The very stones weep black tears." },
        { min: 90, text: "Darkness spreads like a plague. Hope is a distant memory." },
        { min: 85, text: "The curse deepens. Even the shadows hunger for souls." },
        { min: 80, text: "The Great Suffering Index rises. Another village falls to the Blight." },
        { min: 75, text: "The Old Gods laugh in their graves. Reality crumbles." },
        { min: 70, text: "The Blighted Lands expand. The survivors grow fewer." },
        { min: 65, text: "A new plague sweeps through. The healers have all perished." },
        { min: 60, text: "The darkness is spreading. The last light fades." },
        { min: 55, text: "The land grows sick. Crops wither in the tainted soil." },
        { min: 50, text: "Mortal suffering reaches new heights. The end approaches." },
        { min: 45, text: "The curse holds steady. The realm endures its torment." },
        { min: 40, text: "A brief respite. The suffering never truly ends though." },
        { min: 35, text: "The Blight recedes slightly. It will return with vengeance." },
        { min: 30, text: "The sun briefly shines through the eternal clouds." },
        { min: 25, text: "Hope flickers weakly. It will be crushed soon enough." },
        { min: 20, text: "The realm is calm. Too calm. Something approaches." },
        { min: 15, text: "A moment of peace. The calm before the storm." },
        { min: 10, text: "The suffering is minimal. Enjoy it while it lasts." },
        { min: 5, text: "Surprisingly peaceful. This cannot last." },
        { min: 0, text: "The realm is serene. This is suspicious." }
    ];
    
    const message = messages.find(m => value >= m.min);
    if (message && flavorText.textContent !== message.text) {
        flavorText.style.opacity = 0;
        setTimeout(() => {
            flavorText.textContent = message.text;
            flavorText.style.opacity = 1;
        }, 500);
    }
}

/* =============================================
RITUAL CALENDAR
============================================= */

function initializeCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const monthDisplay = document.getElementById('calendarMonth');
    
    const dayNames = ['Dusk', 'Moondark', 'Bloodtide', 'Wailing', 'Void', 'Sorrow', 'End'];
    const monthNames = [
        'The Month of Ashes', 'The Month of Ruin', 'The Month of Tears', 
        'The Month of Ending', 'The Month of the Void', 'The Month of Lament',
        'The Month of Decay', 'The Month of Shadows', 'The Month of the Blight',
        'The Month of Suffering', 'The Month of Darkness', 'The Month of Finality'
    ];
    
    const ritualDays = [3, 7, 12, 18, 24];
    let currentMonth = 4;
    let currentYear = 3847;
    
    function renderCalendar() {
        calendarDays.innerHTML = '';
        monthDisplay.textContent = `${monthNames[currentMonth]}, Year ${currentYear}`;
        
        const firstDay = (currentMonth * 3 + currentYear) % 7;
        const daysInMonth = 28;
        
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            if (ritualDays.includes(day)) {
                dayCell.classList.add('has-ritual');
            }
            
            dayCell.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="day-name">${dayNames[day % 7]}</span>
            `;
            
            dayCell.addEventListener('click', () => showDayDetails(day));
            calendarDays.appendChild(dayCell);
        }
        
        updateRitualHighlight();
    }
    
    function showDayDetails(day) {
        const ritualItem = document.querySelector(`.ritual-item[data-day="${day}"]`);
        if (ritualItem) {
            ritualItem.style.background = 'var(--blood-red)';
            ritualItem.style.color = 'var(--void-black)';
            setTimeout(() => {
                ritualItem.style.background = '';
                ritualItem.style.color = '';
            }, 1000);
        }
    }
    
    function updateRitualHighlight() {
        const items = document.querySelectorAll('.ritual-item');
        items.forEach(item => {
            const day = parseInt(item.dataset.day);
            const calendarDay = document.querySelector(`.calendar-day.has-ritual:nth-of-type(${day})`);
            if (calendarDay) {
                item.style.opacity = '1';
            }
        });
    }
    
    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    renderCalendar();
}

/* =============================================
ARTIFACTS CAROUSEL
============================================= */

function initializeArtifactsCarousel() {
    const track = document.getElementById('artifactsTrack');
    const prevBtn = document.getElementById('artifactsPrev');
    const nextBtn = document.getElementById('artifactsNext');
    const currentSpan = document.getElementById('artifactCurrent');
    const totalSpan = document.getElementById('artifactTotal');
    const cards = document.querySelectorAll('.artifact-card');
    const cardWidth = 304;
    let currentIndex = 0;
    
    totalSpan.textContent = cards.length;
    
    function updateCarousel() {
        const containerWidth = track.parentElement.offsetWidth;
        const offset = (containerWidth / 2) - (cardWidth / 2) - (currentIndex * cardWidth);
        const maxOffset = 0;
        const minOffset = -((cards.length - 1) * cardWidth) + containerWidth - cardWidth;
        const clampedOffset = Math.max(minOffset, Math.min(maxOffset, offset));
        track.style.transform = `translateX(${clampedOffset}px)`;
        currentSpan.textContent = currentIndex + 1;
    }
    
    function goToCard(index) {
        currentIndex = Math.max(0, Math.min(cards.length - 1, index));
        updateCarousel();
    }
    
    prevBtn.addEventListener('click', () => goToCard(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToCard(currentIndex + 1));
    
    setInterval(() => {
        if (currentIndex < cards.length - 1) {
            goToCard(currentIndex + 1);
        } else {
            goToCard(0);
        }
    }, 6000);
    
    setTimeout(updateCarousel, 100);
    window.addEventListener('resize', updateCarousel);
}

/* =============================================
CURSOR TRAIL
============================================= */

function initializeCursorTrail() {
    const omen = document.getElementById('omenFloat');
    const positions = [];
    const trailLength = 15;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.cssText = `
            position: fixed;
            width: ${10 - i * 0.5}px;
            height: ${10 - i * 0.5}px;
            background: var(--blood-red);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: ${0.8 - i * 0.05};
            transform: translate(-50%, -50%);
            transition: left 0.1s ease-out, top 0.1s ease-out;
        `;
        document.body.appendChild(dot);
        positions.push(dot);
    }
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        positions.forEach((dot, i) => {
            setTimeout(() => {
                dot.style.left = x + 'px';
                dot.style.top = y + 'px';
            }, i * 20);
        });
    });
    
    omen.addEventListener('click', () => {
        omen.style.animation = 'none';
        omen.innerHTML = '⦿⦿⦿';
        
        setTimeout(() => {
            omen.style.animation = 'omenFloat 6s ease-in-out infinite';
            omen.innerHTML = '⦿';
            showOmenMessage();
        }, 1000);
    });
    
    function showOmenMessage() {
        const messages = [
            "The Old Ones are watching...",
            "Something stirs in the void.",
            "Your fate grows darker.",
            "The Blight knows you now.",
            "Death approaches on silent feet.",
            "The void whispers your name.",
            "A curse has been noticed.",
            "The darkness remembers you."
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--void-black);
            border: 1px solid var(--blood-red);
            color: var(--bone-white);
            padding: 1rem 2rem;
            font-family: var(--font-body);
            font-style: italic;
            z-index: 10000;
            animation: fadeInUp 0.5s ease-out;
        `;
        toast.textContent = randomMessage;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }
}

/* =============================================
MAP INTERACTIONS
============================================= */

function initializeMapInteractions() {
    const regions = document.querySelectorAll('.map-region');
    const mapCorruption = document.getElementById('mapCorruption');
    
    regions.forEach(region => {
        region.addEventListener('mouseenter', () => {
            mapCorruption.style.transform = 'scale(1.05)';
            mapCorruption.style.transition = 'transform 1s ease-out';
        });
        
        region.addEventListener('mouseleave', () => {
            mapCorruption.style.transform = 'scale(1)';
        });
    });
    
    setInterval(() => {
        const randomRegion = regions[Math.floor(Math.random() * regions.length)];
        const marker = randomRegion.querySelector('.region-marker');
        marker.style.transform = 'scale(2)';
        marker.style.boxShadow = '0 0 30px var(--glow-red), 0 0 60px var(--glow-red)';
        
        setTimeout(() => {
            marker.style.transform = '';
            marker.style.boxShadow = '';
        }, 1000);
    }, 8000);
}

/* =============================================
RITUAL HIGHLIGHT
============================================= */

function initializeRitualHighlight() {
    const ritualItems = document.querySelectorAll('.ritual-item');
    
    ritualItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const day = item.dataset.day;
            const calendarDays = document.querySelectorAll('.calendar-day');
            if (calendarDays[day - 1]) {
                calendarDays[day - 1].style.background = 'var(--blood-red)';
                calendarDays[day - 1].style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const day = item.dataset.day;
            const calendarDays = document.querySelectorAll('.calendar-day');
            if (calendarDays[day - 1]) {
                calendarDays[day - 1].style.background = '';
                calendarDays[day - 1].style.transform = '';
            }
        });
    });
}

/* =============================================
RANDOM EVENTS
============================================= */

function startRandomEvents() {
    setInterval(triggerEarthquake, 10000);
    setInterval(triggerCurseFlash, 15000);
    setInterval(triggerShadowMovement, 20000);
    setInterval(triggerWhisper, 25000);
}

function triggerEarthquake() {
    const container = document.querySelector('.realm-container');
    container.style.animation = 'none';
    container.offsetHeight;
    container.style.animation = 'earthquake 0.5s ease-out';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes earthquake {
            0%, 100% { transform: translateX(0); }
            10% { transform: translateX(-5px) rotate(-0.5deg); }
            20% { transform: translateX(5px) rotate(0.5deg); }
            30% { transform: translateX(-5px) rotate(-0.5deg); }
            40% { transform: translateX(5px) rotate(0.5deg); }
            50% { transform: translateX(-3px); }
            60% { transform: translateX(3px); }
            70% { transform: translateX(-2px); }
            80% { transform: translateX(2px); }
            90% { transform: translateX(-1px); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        container.style.animation = '';
        setTimeout(() => style.remove(), 1000);
    }, 500);
}

function triggerCurseFlash() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--blood-red);
        opacity: 0;
        pointer-events: none;
        z-index: 999;
        transition: opacity 0.1s;
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.style.opacity = '0.3', 100);
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 100);
    }, 300);
}

function triggerShadowMovement() {
    const fog = document.querySelector('.fog-layer');
    if (fog) {
        fog.style.animationDuration = '2s';
        setTimeout(() => {
            fog.style.animationDuration = '20s';
        }, 2000);
    }
}

function triggerWhisper() {
    const messages = [
        "They are coming...",
        "Don't look back.",
        "The void speaks.",
        "Your soul is noted.",
        "Suffer... and be silent."
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const whisper = document.createElement('div');
    whisper.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        font-family: var(--font-body);
        font-style: italic;
        color: var(--pale-bone);
        opacity: 0;
        font-size: 1.2rem;
        text-shadow: 0 0 10px var(--glow-purple);
        z-index: 100;
        pointer-events: none;
    `;
    whisper.textContent = `"${message}"`;
    document.body.appendChild(whisper);
    
    setTimeout(() => whisper.style.opacity = '0.8', 100);
    setTimeout(() => {
        whisper.style.opacity = '0';
        whisper.style.transition = 'opacity 2s';
        setTimeout(() => whisper.remove(), 2000);
    }, 3000);
}

/* =============================================
FLAVOR TEXT ROTATION
============================================= */

function initializeFlavorTextRotation() {
    const flavorText = document.getElementById('miseryFlavor');
    const extraFlavorTexts = [
        "The Blight spreads through the realm like a cancer of the soul.",
        "In the distance, a village burns. No one comes to help.",
        "The ground beneath your feet is soaked with tears of the damned.",
        "Shadows move wrongly. They have minds of their own.",
        "The air tastes of ash and despair. Always ash.",
        "Somewhere, something ancient stirs in its sleep.",
        "The stars above are hidden by perpetual clouds of sorrow.",
        "Every breath is a reminder that you still suffer.",
        "The silence is worse than the screaming.",
        "Time moves differently here. Slower. Heavier."
    ];
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const extraText = extraFlavorTexts[Math.floor(Math.random() * extraFlavorTexts.length)];
            flavorText.style.opacity = 0;
            setTimeout(() => {
                flavorText.textContent = extraText;
                flavorText.style.opacity = 1;
            }, 500);
        }
    }, 15000);
}

/* =============================================
SCROLL EFFECTS
============================================= */

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const fog = document.querySelector('.fog-layer');
    
    if (fog) {
        fog.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    const header = document.querySelector('.realm-header');
    if (header) {
        header.style.opacity = 1 - (scrolled / 500);
        header.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

/* =============================================
KEYBOARD SHORTCUTS
============================================= */

document.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
        const section = document.querySelector('.misery-section');
        section.style.opacity = section.style.opacity === '0' ? '1' : '0';
        section.style.transition = 'opacity 0.5s';
    }
    
    if (e.key === 'c' || e.key === 'C') {
        const cards = document.querySelectorAll('.curse-card');
        cards.forEach(card => {
            card.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            setTimeout(() => card.style.filter = '', 500);
        });
    }
});

/* =============================================
PERFORMANCE OPTIMIZATION
============================================= */

const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            lazyObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.curse-card, .artifact-card, .map-region').forEach(el => {
    lazyObserver.observe(el);
});

if (window.innerWidth < 768) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
}