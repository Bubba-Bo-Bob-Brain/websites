/* ============================================
   THE BLIGHTED REALMS - GRIMOIRE SCRIPTS
   A Chronicle of Suffering, Woe & Unending Dread
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initializeMiseryMeter();
    initializeCurseTracker();
    initializeRitualCalendar();
    initializeUpcomingRituals();
    initializeFloatingEmbers();
    initializeScrollAnimations();
    initializeRitualModal();
    initializeNavigation();
});

/* ============================================
   MISERY METER SYSTEM
   ============================================ */
function initializeMiseryMeter() {
    const miseryFill = document.getElementById('miseryFill');
    const miseryNeedle = document.getElementById('miseryNeedle');
    const miseryValue = document.getElementById('miseryValue');
    
    if (!miseryFill || !miseryNeedle || !miseryValue) return;
    
    const targetMisery = 87;
    
    setTimeout(() => {
        animateMiseryMeter(targetMisery, miseryFill, miseryNeedle, miseryValue);
    }, 1000);
    
    setInterval(() => {
        const fluctuation = Math.floor(Math.random() * 3) - 1;
        const newValue = Math.max(80, Math.min(95, targetMisery + fluctuation));
        animateMiseryMeter(newValue, miseryFill, miseryNeedle, miseryValue);
    }, 5000);
}

function animateMiseryMeter(value, fill, needle, display) {
    const clampedValue = Math.max(0, Math.min(100, value));
    fill.style.width = clampedValue + '%';
    
    const needlePosition = clampedValue + (clampedValue > 50 ? (clampedValue - 50) * 0.3 : 0);
    needle.style.left = Math.min(95, needlePosition) + '%';
    
    display.textContent = clampedValue;
    
    if (clampedValue > 80) {
        display.style.color = '#8b0000';
        display.style.textShadow = '0 0 20px #8b0000';
    } else if (clampedValue > 50) {
        display.style.color = '#c45c4a';
        display.style.textShadow = '0 0 15px #c45c4a';
    } else {
        display.style.color = '#d4cdc5';
        display.style.textShadow = 'none';
    }
}

/* ============================================
   CURSE TRACKER SYSTEM
   ============================================ */
function initializeCurseTracker() {
    const trackerItems = document.querySelectorAll('.tracker-item');
    const totalCorruption = document.getElementById('totalCorruption');
    const totalValue = document.getElementById('totalValue');
    
    if (trackerItems.length === 0) return;
    
    let currentTotal = 0;
    trackerItems.forEach(item => {
        const progressBar = item.querySelector('.tracker-progress-fill');
        if (progressBar) {
            const width = parseInt(progressBar.style.width) || 0;
            currentTotal += width;
        }
    });
    
    const averageTotal = Math.round(currentTotal / trackerItems.length);
    
    setTimeout(() => {
        if (totalCorruption) {
            totalCorruption.style.width = averageTotal + '%';
        }
        if (totalValue) {
            animateValue(totalValue, 0, averageTotal, 2000);
        }
    }, 1500);
    
    trackerItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.background = 'rgba(92, 26, 31, 0.3)';
            item.style.transform = 'translateX(5px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.background = 'rgba(10, 5, 8, 0.5)';
            item.style.transform = 'translateX(0)';
        });
    });
    
    setInterval(() => {
        trackerItems.forEach(item => {
            const progressFill = item.querySelector('.tracker-progress-fill');
            const percentDisplay = item.querySelector('.tracker-item-percent');
            
            if (progressFill && percentDisplay) {
                const currentWidth = parseInt(progressFill.style.width) || 0;
                const increase = Math.floor(Math.random() * 4);
                const newWidth = Math.min(100, currentWidth + increase);
                progressFill.style.width = newWidth + '%';
                percentDisplay.textContent = newWidth + '%';
                
                if (totalCorruption && totalValue) {
                    let newTotal = 0;
                    trackerItems.forEach(i => {
                        const bar = i.querySelector('.tracker-progress-fill');
                        if (bar) {
                            newTotal += parseInt(bar.style.width) || 0;
                        }
                    });
                    const newAverage = Math.round(newTotal / trackerItems.length);
                    totalCorruption.style.width = newAverage + '%';
                    totalValue.textContent = newAverage + '%';
                }
            }
        });
    }, 8000);
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + range * easeProgress);
        element.textContent = current + '%';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ============================================
   RITUAL CALENDAR SYSTEM
   ============================================ */
function initializeRitualCalendar() {
    const months = document.querySelectorAll('.month[data-ritual="true"]');
    const ritualDetails = document.getElementById('ritualDetails');
    const prevYear = document.getElementById('prevYear');
    const nextYear = document.getElementById('nextYear');
    const calendarYear = document.getElementById('calendarYear');
    
    if (months.length === 0) return;
    
    const yearNames = [
        'Year of the Endless Moan',
        'Year of the Frozen Lament',
        'Year of the Weeping Sky',
        'Year of the Broken Crown',
        'Year of Final Silence',
        'Year of the Black Tide',
        'Year of the Ashen Wind',
        'Year of Sorrows Endless'
    ];
    
    let currentYearIndex = 0;
    
    months.forEach(month => {
        month.addEventListener('click', () => {
            const ritualName = month.dataset.ritualName;
            const ritualDesc = month.dataset.ritualDesc;
            
            if (ritualName && ritualDesc && ritualDetails) {
                showRitualDetails(ritualDetails, ritualName, ritualDesc);
                months.forEach(m => m.style.borderColor = 'transparent');
                month.style.borderColor = '#a63d3d';
                month.style.background = 'rgba(92, 26, 31, 0.3)';
            }
        });
        
        month.addEventListener('mouseenter', () => {
            month.style.boxShadow = '0 0 15px rgba(166, 61, 61, 0.3)';
        });
        month.addEventListener('mouseleave', () => {
            month.style.boxShadow = 'none';
        });
    });
    
    if (prevYear) {
        prevYear.addEventListener('click', () => {
            currentYearIndex = (currentYearIndex - 1 + yearNames.length) % yearNames.length;
            if (calendarYear) {
                calendarYear.textContent = yearNames[currentYearIndex];
                calendarYear.style.opacity = '0';
                setTimeout(() => calendarYear.style.opacity = '1', 100);
            }
        });
    }
    
    if (nextYear) {
        nextYear.addEventListener('click', () => {
            currentYearIndex = (currentYearIndex + 1) % yearNames.length;
            if (calendarYear) {
                calendarYear.textContent = yearNames[currentYearIndex];
                calendarYear.style.opacity = '0';
                setTimeout(() => calendarYear.style.opacity = '1', 100);
            }
        });
    }
}

function showRitualDetails(container, name, description) {
    const omenLevel = 60 + Math.random() * 35;
    container.innerHTML = `
        <div class="ritual-detail-content" style="animation: fadeIn 0.3s ease-out;">
            <h4 style="font-family: 'Cinzel Decorative', serif; color: #d4cdc5; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em;">${name}</h4>
            <p style="color: #b8a99a; line-height: 1.8; font-style: italic;">"${description}"</p>
            <div style="margin-top: 1rem; display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: #8b2f35;">Omen Severity:</span>
                <div style="flex: 1; height: 8px; background: #0a0508; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${omenLevel}%; height: 100%; background: linear-gradient(90deg, #3d0f14, #5c1a1f, #8b0000); border-radius: 4px;"></div>
                </div>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(style);
}

/* ============================================
   UPCOMING RITUALS COUNTDOWN
   ============================================ */
function initializeUpcomingRituals() {
    const countdowns = [
        { element: document.getElementById('countdownDays'), start: 9 },
        { element: document.getElementById('countdownDays2'), start: 42 },
        { element: document.getElementById('countdownDays3'), start: 94 }
    ];
    
    countdowns.forEach(countdown => {
        if (!countdown.element) return;
        let days = countdown.start;
        
        setInterval(() => {
            days = days > 1 ? days - 1 : Math.floor(Math.random() * 30) + 20;
            countdown.element.textContent = days;
            countdown.element.style.transform = 'scale(1.2)';
            setTimeout(() => countdown.element.style.transform = 'scale(1)', 200);
        }, 10000);
    });
    
    const countdownRings = document.querySelectorAll('.countdown-ring');
    const dayValues = [9, 42, 94];
    
    countdownRings.forEach((ring, index) => {
        const circumference = 2 * Math.PI * 45;
        ring.style.strokeDasharray = circumference;
        const days = dayValues[index] || 30;
        const progress = 1 - (days / 100);
        ring.style.strokeDashoffset = circumference * progress;
    });
}

/* ============================================
   FLOATING EMBERS SYSTEM
   ============================================ */
function initializeFloatingEmbers() {
    const embersContainer = document.querySelector('.floating-embers');
    if (!embersContainer) return;
    
    for (let i = 0; i < 10; i++) {
        createEmber(embersContainer);
    }
    
    setInterval(() => {
        if (embersContainer.children.length < 30) {
            createEmber(embersContainer);
        }
    }, 2000);
}

function createEmber(container) {
    const ember = document.createElement('div');
    ember.className = 'ember';
    
    const left = Math.random() * 100;
    const size = 2 + Math.random() * 5;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 5;
    
    ember.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;
    
    container.appendChild(ember);
    
    setTimeout(() => {
        if (ember.parentNode) {
            ember.parentNode.removeChild(ember);
        }
    }, (delay + duration) * 1000);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initializeScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    if (sections.length === 0) return;
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.classList.contains('section-afflictions')) {
                    animateAfflictionCards(entry.target);
                }
                if (entry.target.classList.contains('section-artifacts')) {
                    animateArtifactCards(entry.target);
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                document.querySelectorAll('.bg-layer').forEach((layer, index) => {
                    const speed = 0.1 + (index * 0.05);
                    layer.style.transform = `translateY(${scrollY * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

function animateAfflictionCards(section) {
    const cards = section.querySelectorAll('.affliction-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function animateArtifactCards(section) {
    const cards = section.querySelectorAll('.artifact-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

/* ============================================
   RITUAL MODAL SYSTEM
   ============================================ */
function initializeRitualModal() {
    const modal = document.getElementById('ritualModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = modal ? modal.querySelector('.modal-backdrop') : null;
    
    if (!modal) return;
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    window.openRitualModal = function(icon, title, description) {
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        
        if (modalIcon) modalIcon.textContent = icon;
        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = description;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
}

/* ============================================
   NAVIGATION SYSTEM
   ============================================ */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const sections = document.querySelectorAll('section[id]');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                        link.style.color = '#c45c4a';
                        link.style.textShadow = '0 0 10px rgba(196, 92, 74, 0.5)';
                    } else {
                        link.style.color = '';
                        link.style.textShadow = '';
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => navObserver.observe(section));
    
    const style = document.createElement('style');
    style.textContent = `
        .nav-link {
            transition: color 0.3s ease, text-shadow 0.3s ease;
        }
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 1px;
            background: #c45c4a;
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }
        .nav-link:hover::after, .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   EFFECTS & UTILITIES
   ============================================ */
function initWhispersEffect() {
    const whispers = [
        '"The darkness hungers..."',
        '"Turn back, mortal..."',
        '"We remember, we forget not..."',
        '"The Blight sees all..."',
        '"Suffer, as we have suffered..."',
        '"Hope is a lie..."',
        '"The end approaches..."'
    ];
    const randomWhisper = whispers[Math.floor(Math.random() * whispers.length)];
    console.log('%c' + randomWhisper, 'color: #5c1a1f; font-style: italic; font-size: 14px;');
}

setTimeout(initWhispersEffect, 3000);
setInterval(() => {
    if (Math.random() > 0.7) {
        initWhispersEffect();
    }
}, 15000);

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateSecretEffect();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateSecretEffect() {
    document.body.style.transition = 'background 0.1s ease';
    document.body.style.background = '#3d0f14';
    setTimeout(() => {
        document.body.style.background = '';
    }, 100);
}

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

console.log('%c' + ' '.repeat(15) + 'THE BLIGHTED REALMS' + ' '.repeat(15), 'background: #0a0508; color: #8b2f35; padding: 10px 20px; font-family: serif; font-size: 16px; font-weight: bold;');
console.log('%cA Chronicle of Suffering, Woe & Unending Dread', 'background: #120a0f; color: #d4cdc5; padding: 10px 20px; font-family: serif; font-size: 12px;');
console.log('%cYear of the Endless Moan, 666 AE', 'background: #1a0d18; color: #8b7355; padding: 10px 20px; font-family: serif; font-size: 10px;');
console.log('%c"Turn back, mortal. What lies within these pages cannot be unread."', 'background: #2a0d12; color: #5c1a1f; padding: 10px 20px; font-family: serif; font-style: italic; font-size: 11px;');