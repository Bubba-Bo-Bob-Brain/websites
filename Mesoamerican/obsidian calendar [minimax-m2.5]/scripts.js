/* ============================================
XOCHIPILLI'S CALENDAR - Sacred Timekeeping
Interactive JavaScript
============================================ */

document.addEventListener('DOMContentLoaded', () => {

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const TOLKIN_DAYS = [
    'Imix', 'Ik', 'Akbal', 'Kan', 'Chicchan', 'Cimi', 'Manik', 'Lamat',
    'Muluc', 'Oc', 'Chuen', 'Eb', 'Ben', 'Ix', 'Men', 'Cib', 'Caban',
    'Etznab', 'Cauac', 'Ahau'
];

const TOLKIN_GLYPHS = ['𐤁', '𐤂', '𐤃', '𐤄', '𐤅', '𐤆', '𐤇', '𐤈', '𐤉', '𐤊', '𐤋', '𐤌', '𐤍', '𐤎', '𐤏', '𐤐', '𐤑', '𐤒', '𐤓', '𐤔'];

const YEAR_BEARERS = ['Ben', 'Ix', 'Men', 'Cib', 'Caban', 'Etznab', 'Cauac', 'Ahau'];

// Blood moon eclipse date (March 14, 2025)
const ECLIPSE_DATE = new Date('2025-03-14T00:00:00');

// ============================================
// STATE MANAGEMENT
// ============================================

let currentRotation = 0;
let currentDayIndex = 0;
let isAudioEnabled = false;
let tooltipTimeout = null;

// ============================================
// ECLIPSE COUNTDOWN
// ============================================

function updateEclipseCountdown() {
    const now = new Date();
    const diff = ECLIPSE_DATE - now;
    
    if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ============================================
// CALENDAR WHEEL ROTATION
// ============================================

function rotateWheel(direction) {
    const wheel = document.querySelector('.wheel-outer-ring');
    const rotationAmount = 18; // 360 / 20 days
    currentRotation += direction * rotationAmount;
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    // Update current day
    currentDayIndex = (currentDayIndex + direction + 20) % 20;
    updateCurrentDayDisplay();
}

function updateCurrentDayDisplay() {
    const dayName = TOLKIN_DAYS[currentDayIndex];
    const dayGlyph = TOLKIN_GLYPHS[currentDayIndex];
    
    document.getElementById('currentDay').textContent = currentDayIndex + 1;
    document.getElementById('dayName').textContent = dayName;
    document.getElementById('currentGlyph').textContent = dayGlyph;
    document.getElementById('dayNumber').textContent = currentDayIndex + 1;
    
    // Update year bearer
    const yearBearer = YEAR_BEARERS[Math.floor(currentDayIndex / 2.5)];
    document.getElementById('dayCycle').textContent = `Year Bearer: ${yearBearer}`;
}

// ============================================
// GLYPH TOOLTIP SYSTEM
// ============================================

const tooltip = document.getElementById('tooltip');

function showTooltip(e, glyph, translation) {
    clearTimeout(tooltipTimeout);
    const tooltipContent = `<span class="tooltip-glyph">${glyph}</span><span class="tooltip-translation">${translation}</span>`;
    tooltip.innerHTML = tooltipContent;
    tooltip.classList.add('visible');
    positionTooltip(e);
}

function hideTooltip() {
    tooltipTimeout = setTimeout(() => {
        tooltip.classList.remove('visible');
    }, 300);
}

function positionTooltip(e) {
    const tooltipRect = tooltip.getBoundingClientRect();
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    
    // Keep tooltip within viewport
    if (x + tooltipRect.width > window.innerWidth - 20) {
        x = e.clientX - tooltipRect.width - 15;
    }
    if (y + tooltipRect.height > window.innerHeight - 20) {
        y = e.clientY - tooltipRect.height - 15;
    }
    
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}

// Initialize tooltip functionality
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-glyph]');
    tooltipElements.forEach(element => {
        const glyph = element.dataset.glyph;
        element.addEventListener('mouseenter', (e) => {
            let translation = element.dataset.translation || glyph;
            showTooltip(e, glyph, translation);
        });
        element.addEventListener('mousemove', (e) => {
            positionTooltip(e);
        });
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// ============================================
// DEITY CYCLES ANIMATION
// ============================================

function animateDeityCycles() {
    const deityCards = document.querySelectorAll('.deity-card');
    deityCards.forEach((card, index) => {
        const cycleBar = card.querySelector('.cycle-bar');
        const randomCycle = Math.floor(Math.random() * 100);
        cycleBar.style.setProperty('--cycle', `${randomCycle}%`);
        cycleBar.style.width = `${randomCycle}%`;
        // Staggered animation
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// ============================================
// RITUAL DATES HIGHLIGHTING
// ============================================

function highlightTodaysRituals() {
    const today = new Date().toISOString().split('T')[0];
    const ritualItems = document.querySelectorAll('.ritual-item');
    
    ritualItems.forEach(item => {
        const ritualDate = item.dataset.date;
        if (ritualDate === today) {
            item.classList.add('today');
            item.style.borderLeftColor = 'var(--blood-light)';
            item.style.background = 'linear-gradient(90deg, rgba(139, 0, 0, 0.3), transparent)';
        }
    });
}

// ============================================
// ASTRONOMICAL EVENTS INTERACTIVITY
// ============================================

function initAstroEvents() {
    const astroEvents = document.querySelectorAll('.astro-event');
    astroEvents.forEach(event => {
        event.addEventListener('mouseenter', () => {
            const marker = event.querySelector('.event-marker');
            marker.style.transform = 'scale(1.3)';
            marker.style.textShadow = '0 0 20px var(--gold)';
        });
        event.addEventListener('mouseleave', () => {
            const marker = event.querySelector('.event-marker');
            marker.style.transform = 'scale(1)';
            marker.style.textShadow = 'none';
        });
    });
}

// ============================================
// TRIBUTE TABLE INTERACTIVITY
// ============================================

function initTributeTable() {
    const tributeRows = document.querySelectorAll('.tribute-table tbody tr');
    tributeRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const icon = row.querySelector('.tribute-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
            }
        });
        row.addEventListener('mouseleave', () => {
            const icon = row.querySelector('.tribute-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// ============================================
// AUDIO TOGGLE
// ============================================

function initAudioToggle() {
    const audioBtn = document.getElementById('audioToggle');
    const audioIcon = audioBtn.querySelector('.audio-icon');
    
    audioBtn.addEventListener('click', () => {
        isAudioEnabled = !isAudioEnabled;
        audioIcon.textContent = isAudioEnabled ? '🔊' : '🔇';
        
        // Visual feedback
        if (isAudioEnabled) {
            audioBtn.style.borderColor = 'var(--jade)';
            audioBtn.style.boxShadow = 'var(--shadow-glow)';
        } else {
            audioBtn.style.borderColor = 'var(--stone)';
            audioBtn.style.boxShadow = 'none';
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const panels = document.querySelectorAll('.panel');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    panels.forEach(panel => {
        panel.style.animationPlayState = 'paused';
        observer.observe(panel);
    });
}

// ============================================
// FEATHERED SERPENT ANIMATION
// ============================================

function initSerpentAnimation() {
    const serpentTop = document.querySelector('.serpent-top');
    const serpentBottom = document.querySelector('.serpent-bottom');
    let offset = 0;
    
    function animateSerpent() {
        offset += 0.5;
        if (serpentTop) {
            serpentTop.style.transform = `translateX(${Math.sin(offset * 0.01) * 3}px)`;
        }
        if (serpentBottom) {
            serpentBottom.style.transform = `translateX(${Math.cos(offset * 0.01) * 3}px)`;
        }
        requestAnimationFrame(animateSerpent);
    }
    
    animateSerpent();
}

// ============================================
// ZODIAC SIGN CLICK HANDLER
// ============================================

function initZodiacClickHandler() {
    const zodiacSigns = document.querySelectorAll('.zodiac-sign');
    
    zodiacSigns.forEach((sign, index) => {
        sign.addEventListener('click', () => {
            const dayName = TOLKIN_DAYS[index];
            const dayGlyph = TOLKIN_GLYPHS[index];
            
            // Update center display
            document.getElementById('currentDay').textContent = index + 1;
            document.getElementById('dayName').textContent = dayName;
            document.getElementById('currentGlyph').textContent = dayGlyph;
            document.getElementById('dayNumber').textContent = index + 1;
            
            // Rotate wheel to selected day
            const targetRotation = -(index * 18);
            const wheel = document.querySelector('.wheel-outer-ring');
            wheel.style.transform = `rotate(${targetRotation}deg)`;
            currentRotation = targetRotation;
            currentDayIndex = index;
            
            // Visual feedback
            sign.style.color = 'var(--gold-light)';
            sign.style.textShadow = '0 0 30px var(--gold)';
            setTimeout(() => {
                sign.style.color = '';
                sign.style.textShadow = '';
            }, 1000);
        });
    });
}

// ============================================
// CELESTIAL BODIES CLICK HANDLER
// ============================================

function initCelestialClickHandler() {
    const celestials = document.querySelectorAll('.celestial');
    
    const planetInfo = {
        venus: 'Venus Cycle: 584 days - The Morning/Evening Star',
        mars: 'Mars Cycle: 780 days - The Red Star',
        jupiter: 'Jupiter Cycle: 399 days - The Great Bright One',
        saturn: 'Saturn Cycle: 378 days - The Ringed One',
        mercury: 'Mercury Cycle: 116 days - The Swift Messenger'
    };
    
    celestials.forEach(celestial => {
        celestial.addEventListener('click', () => {
            const planet = celestial.dataset.glyph;
            const info = planetInfo[planet];
            if (info) {
                showNotification(info);
            }
        });
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<span class="notification-icon">✨</span><span class="notification-text">${message}</span>`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--obsidian-light);
        border: 2px solid var(--gold);
        border-radius: 10px;
        padding: 1rem 1.5rem;
        color: var(--cream);
        font-size: 0.9rem;
        z-index: 1001;
        animation: slide-in 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: var(--shadow-gold);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slide-out 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slide-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyle);

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const leftBtn = document.getElementById('rotateLeft');
        const rightBtn = document.getElementById('rotateRight');
        
        if (e.key === 'ArrowLeft') {
            leftBtn.click();
        } else if (e.key === 'ArrowRight') {
            rightBtn.click();
        } else if (e.key === 'Escape') {
            tooltip.classList.remove('visible');
        }
    });
}

// ============================================
// CURRENT DATE INITIALIZATION
// ============================================

function initCurrentDate() {
    const today = new Date();
    const startDate = new Date('2025-01-01');
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    currentDayIndex = ((diffDays % 260) + 260) % 260;
    updateCurrentDayDisplay();
    
    // Set initial rotation to current day
    const targetRotation = -(currentDayIndex * 18);
    const wheel = document.querySelector('.wheel-outer-ring');
    wheel.style.transform = `rotate(${targetRotation}deg)`;
    currentRotation = targetRotation;
}

// ============================================
// ADDITIONAL VISUAL EFFECTS
// ============================================

function initVisualEffects() {
    // Glow effect on hover for all interactive elements
    const interactiveElements = document.querySelectorAll('.zodiac-sign, .celestial, .deity-card, .ritual-item, .astro-event, .legend-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.zIndex = '10';
        });
        el.addEventListener('mouseleave', () => {
            el.style.zIndex = '';
        });
    });
    
    // Ripple effect on buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size/2}px;
                top: ${e.clientY - rect.top - size/2}px;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                animation: ripple-effect 0.6s ease-out;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-effect {
            from { transform: scale(0); opacity: 1; }
            to { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// ============================================
// TOUCH DEVICE SUPPORT
// ============================================

function initTouchSupport() {
    // Add touch-friendly interactions
    if ('ontouchstart' in window) {
        const tooltips = document.querySelectorAll('[data-glyph]');
        tooltips.forEach(el => {
            el.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const glyph = el.dataset.glyph;
                const translation = el.dataset.translation || glyph;
                showTooltip(e.touches[0], glyph, translation);
            });
            el.addEventListener('touchend', () => {
                setTimeout(hideTooltip, 1500);
            });
        });
    }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

function optimizePerformance() {
    // Use requestAnimationFrame for smooth animations
    let ticking = false;
    document.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Update any scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// WHEEL BUTTON EVENT LISTENERS
// ============================================

function initWheelControls() {
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    
    rotateLeftBtn.addEventListener('click', () => rotateWheel(-1));
    rotateRightBtn.addEventListener('click', () => rotateWheel(1));
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Format date for display
function formatDate(date) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Get days until a specific date
function getDaysUntil(date) {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Calculate Tzolkin day number
function getTzolkinDay(date) {
    const startDate = new Date('2025-01-01');
    const diffTime = new Date(date) - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return ((diffDays % 260) + 260) % 260;
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Start the eclipse countdown
    updateEclipseCountdown();
    setInterval(updateEclipseCountdown, 1000);
    
    // Initialize all components
    initTooltips();
    initWheelControls();
    initZodiacClickHandler();
    initCelestialClickHandler();
    initAstroEvents();
    initTributeTable();
    initAudioToggle();
    initKeyboardNavigation();
    initTouchSupport();
    initVisualEffects();
    initScrollAnimations();
    initSerpentAnimation();
    
    // Initialize current date based on actual date
    initCurrentDate();
    
    // Animate deity cycles with a delay
    setTimeout(animateDeityCycles, 500);
    
    // Highlight today's rituals
    highlightTodaysRituals();
    
    // Optimize performance
    optimizePerformance();
    
    // Add loaded class for any CSS animations
    document.body.classList.add('loaded');
    
    console.log('✦ Xochipilli\'s Calendar initialized ✦');
    console.log('Current Day: ' + TOLKIN_DAYS[currentDayIndex] + ' ' + TOLKIN_GLYPHS[currentDayIndex]);
}

// Start the application
init();

});