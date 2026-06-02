/**
 * The Blighted Realms - Interactive Script
 * Breathes life into the static chronicle of suffering.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inject Dynamic Styles (for elements generated via JS)
    injectDynamicStyles();

    // 2. Initialize Systems
    initRevealAnimations();
    initSufferingIndex();
    initEmbers();
    initRegionMap();
    initCalendar();
    initNavigation();
    initSpookyTitle();
});

/* =========================================
   1. DYNAMIC STYLE INJECTION
   ========================================= */
function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Reveal Animation States */
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .reveal-on-scroll.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Ember Particles */
        .ember {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--blood-crimson);
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 6px var(--blood-crimson);
            animation: emberRise linear forwards;
        }
        @keyframes emberRise {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 0.8; }
            100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }

        /* Region Detail Panel */
        .region-detail-content {
            animation: fadeInDetail 0.5s ease-out;
        }
        @keyframes fadeInDetail {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        /* Map Tooltip Polish */
        .map-region:hover .region-tooltip {
            opacity: 1;
            transform: translate(-50%, -100%) scale(1.05);
            pointer-events: auto;
        }
        .region-tooltip {
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
        }

        /* Active Nav Link */
        .nav-link.active {
            color: var(--blood-crimson);
            text-shadow: 0 0 8px var(--blood-crimson);
        }
        .nav-link.active::after {
            width: 100%;
            background: var(--blood-crimson);
        }
    `;
    document.head.appendChild(style);
}

/* =========================================
   2. REVEAL ANIMATIONS (IntersectionObserver)
   ========================================= */
function initRevealAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

/* =========================================
   3. SUFFERING INDEX ANIMATION
   ========================================= */
function initSufferingIndex() {
    const section = document.getElementById('sufferingIndex');
    if (!section) return;

    const valueEl = document.getElementById('sufferingValue');
    const barEl = document.getElementById('sufferingBar');
    const statusEl = document.getElementById('statusText');
    
    const TARGET_VALUE = 8942;
    const TARGET_PERCENT = 89;
    
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;
            animateValue(valueEl, 0, TARGET_VALUE, 2500);
            
            // Delay bar slightly for dramatic effect
            setTimeout(() => {
                barEl.style.width = `${TARGET_PERCENT}%`;
                barEl.style.boxShadow = '0 0 15px var(--blood-crimson)';
            }, 500);

            // Update status text
            setTimeout(() => {
                statusEl.textContent = "CRITICAL THRESHOLD EXCEEDED";
                statusEl.style.color = 'var(--blood-crimson)';
                statusEl.style.fontWeight = '700';
            }, 2000);
        }
    }, { threshold: 0.5 });

    observer.observe(section);

    function animateValue(el, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function: easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentVal = Math.floor(ease * (end - start) + start);
            el.textContent = currentVal.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Add glitch effect at the end
                el.style.textShadow = '0 0 10px var(--blood-crimson)';
            }
        };
        window.requestAnimationFrame(step);
    }
}

/* =========================================
   4. EMBER PARTICLE SYSTEM
   ========================================= */
function initEmbers() {
    const container = document.getElementById('emberContainer');
    if (!container) return;

    // Create embers periodically
    setInterval(() => {
        if (document.hidden) return; // Performance optimization
        
        const ember = document.createElement('div');
        ember.classList.add('ember');
        
        // Randomize properties
        const left = Math.random() * 100;
        const duration = 4 + Math.random() * 6; // 4-10s
        const size = 2 + Math.random() * 4; // 2-6px
        const delay = Math.random() * 2;
        
        ember.style.left = `${left}%`;
        ember.style.bottom = '-20px';
        ember.style.width = `${size}px`;
        ember.style.height = `${size}px`;
        ember.style.animationDuration = `${duration}s`;
        ember.style.animationDelay = `${delay}s`;
        
        // Vary color slightly
        const colors = ['var(--blood-crimson)', 'var(--corrupted-gold)', 'var(--miasma-green)'];
        ember.style.background = colors[Math.floor(Math.random() * colors.length)];
        ember.style.boxShadow = `0 0 ${size * 2}px ${ember.style.background}`;

        container.appendChild(ember);

        // Cleanup
        setTimeout(() => {
            ember.remove();
        }, (duration + delay) * 1000);
    }, 400); // New ember every 400ms
}

/* =========================================
   5. BLIGHTED REGIONS INTERACTIVITY
   ========================================= */
function initRegionMap() {
    const regionData = {
        'plaguelands': {
            title: "The Plaguelands",
            desc: "Epicenter of the Miasma. The soil here screams when disturbed. No flora survives; only grey fungal growths pulse in the dark. The air dissolves unprotected flesh within minutes.",
            status: "Uninhabitable",
            danger: "Extreme"
        },
        'ashen-waste': {
            title: "The Ashen Waste",
            desc: "A desert of grey dust where the sun is permanently obscured. Storms of razor-sharp ash scour the land clean of hope. Travelers are advised to seal their eyes and ears.",
            status: "Nomadic Tribes",
            danger: "High"
        },
        'drowned-kingdom': {
            title: "The Drowned Kingdom",
            desc: "Once the capital, now submerged in black, oily water. Spires of the old palace break the surface like skeletal fingers. Bells ring from beneath the waves at midnight.",
            status: "Submerged",
            danger: "Severe"
        },
        'whispering-wood': {
            title: "The Whispering Wood",
            desc: "Trees with bark resembling human skin. The wind carries the voices of those consumed by the forest. To hear your name called is to never leave.",
            status: "Forbidden",
            danger: "Psychological"
        },
        'iron-fortress': {
            title: "The Iron Fortress",
            desc: "The last bastion of humanity. Ruled by the Iron Council with an iron fist. Paranoia is law. Outsiders are executed on sight. Resources are rationed to starvation levels.",
            status: "Occupied",
            danger: "Martial Law"
        },
        'void-rift': {
            title: "The Void Rift",
            desc: "A tear in reality itself. Gravity fails here. Time loops. Madness is instant for those who gaze into the violet abyss. It widens by an inch every year.",
            status: "Anomaly",
            danger: "Existential"
        }
    };

    const detailsPanel = document.getElementById('regionDetails');
    const regions = document.querySelectorAll('.map-region');

    regions.forEach(region => {
        region.addEventListener('click', () => {
            const key = region.dataset.region;
            const data = regionData[key];
            
            if (data) {
                updateRegionDetails(data);
                
                // Highlight active region
                regions.forEach(r => r.style.opacity = '0.5');
                region.style.opacity = '1';
            }
        });
    });

    function updateRegionDetails(data) {
        // Determine danger color
        let dangerColor = 'var(--miasma-green)';
        if (data.danger === 'Extreme' || data.danger === 'Existential') dangerColor = 'var(--blood-crimson)';
        else if (data.danger === 'Severe' || data.danger === 'High') dangerColor = 'var(--corrupted-gold)';

        detailsPanel.innerHTML = `
            <div class="region-detail-content">
                <h3 style="font-family: var(--font-display); color: var(--bone-white); margin-bottom: 0.5rem; font-size: 1.5rem;">${data.title}</h3>
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem; font-size: 0.9rem; font-family: var(--font-display);">
                    <span style="color: var(--bone-dim);">Status: <span style="color: var(--corrupted-gold);">${data.status}</span></span>
                    <span style="color: var(--bone-dim);">Threat: <span style="color: ${dangerColor}; text-shadow: 0 0 5px ${dangerColor};">${data.danger}</span></span>
                </div>
                <p style="line-height: 1.7; font-size: 1.1rem; color: var(--bone-dim);">${data.desc}</p>
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--ash-grey); font-size: 0.8rem; color: var(--gold-dim); font-style: italic;">
                    ⚠️ Warning: All travel to this region is prohibited by the Iron Council under penalty of death.
                </div>
            </div>
        `;
    }
}

/* =========================================
   6. DYNAMIC CALENDAR
   ========================================= */
function initCalendar() {
    // Simulate a calendar cycle based on current date
    const date = new Date();
    const dayOfMonth = date.getDate();
    
    // Map real day (1-31) to cycle day (1-14)
    const cycleDay = (dayOfMonth % 14) || 14;
    
    const cycleNameEl = document.querySelector('.cycle-name');
    const currentDateEl = document.getElementById('currentDate');
    const days = document.querySelectorAll('.calendar-day');
    
    // Update header
    currentDateEl.textContent = `Cycle Day ${cycleDay} - ${getCycleName(dayOfMonth)}`;
    
    // Highlight active day
    days.forEach(day => {
        const num = parseInt(day.querySelector('.day-number').textContent);
        if (num === cycleDay) {
            day.classList.add('active');
            day.classList.remove('past', 'future');
        } else if (num < cycleDay) {
            day.classList.add('past');
            day.classList.remove('active', 'future');
        } else {
            day.classList.add('future');
            day.classList.remove('active', 'past');
        }
    });

    function getCycleName(seed) {
        const names = [
            "The Waning of Hope", "Bloodmoon Rising", "Ashen Dusk", 
            "Voidwatch", "Corpse Candle", "Gallows Eve", "Marrow Night",
            "Black Zenith", "Weeping Dawn", "Rot Feast", "Shroudfall",
            "Dreadtide", "Soulreap", "The Void"
        ];
        return names[(seed - 1) % names.length];
    }
}

/* =========================================
   7. NAVIGATION LOGIC
   ========================================= */
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    // Mobile Toggle
    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            links.classList.remove('active');
            toggle.classList.remove('active');
        });
    });

    // Scroll Spy
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Navbar background
        if (scrollY > 50) {
            nav.style.background = 'rgba(5, 5, 7, 0.95)';
            nav.style.padding = '0.5rem 2rem';
        } else {
            nav.style.background = 'rgba(5, 5, 7, 0.85)';
            nav.style.padding = '1rem 2rem';
        }

        // Active Section Highlight
        const sections = document.querySelectorAll('section[id], header[id]');
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollY >= top && scrollY < bottom) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* =========================================
   8. SPOOKY TITLE EFFECT
   ========================================= */
function initSpookyTitle() {
    const originalTitle = document.title;
    const spookyTitle = "⛧ They are watching... ⛧";
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = spookyTitle;
        } else {
            document.title = originalTitle;
        }
    });
}