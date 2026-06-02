/* ============================================
   THE BLIGHTED CODEX - JavaScript
   Bringing the dark grimoire to life
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    AshParticles.init();
    Navigation.init();
    MiseryIndex.init();
    AfflictionTracker.init();
    Calendar.init();
    ArtifactModal.init();
    ScrollAnimations.init();
    BlightMap.init();
    Ticker.init();
});

/* ============================================
   ASH PARTICLES SYSTEM
   ============================================ */

const AshParticles = {
    container: null,
    particleCount: 50,
    
    init() {
        this.container = document.getElementById('ashParticles');
        if (!this.container) return;
        this.createParticles();
    },
    
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    },
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'ash-particle';
        
        // Random positioning and timing
        const startX = Math.random() * 100;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 20;
        const size = 2 + Math.random() * 4;
        
        particle.style.cssText = `
            left: ${startX}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${0.3 + Math.random() * 0.4};
        `;
        
        this.container.appendChild(particle);
    }
};

/* ============================================
   NAVIGATION
   ============================================ */

const Navigation = {
    nav: null,
    links: null,
    sections: null,
    
    init() {
        this.nav = document.getElementById('mainNav');
        this.links = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section, header');
        
        if (!this.nav || !this.links.length) return;
        
        this.setupScrollListener();
        this.setupClickHandlers();
        this.updateActiveLink();
    },
    
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add scrolled class for compact nav
        if (scrollY > 100) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        this.updateActiveLink();
    },
    
    setupClickHandlers() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    const navHeight = this.nav.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    updateActiveLink() {
        const scrollY = window.scrollY + 150;
        
        let currentSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        this.links.forEach(link => {
            link.classList.remove('active');
            const linkSection = link.getAttribute('data-section');
            
            // Map section IDs to nav links
            const sectionMap = {
                'chronicle': ['chronicle', 'chronicle-content'],
                'misery': ['misery'],
                'afflictions': ['afflictions'],
                'artifacts': ['artifacts'],
                'blight': ['blight'],
                'rituals': ['rituals']
            };
            
            if (sectionMap[linkSection]?.includes(currentSection)) {
                link.classList.add('active');
            }
        });
    }
};

/* ============================================
   MISERY INDEX
   ============================================ */

const MiseryIndex = {
    gaugeFill: null,
    gaugeValue: null,
    currentValue: 87.3,
    
    init() {
        this.gaugeFill = document.getElementById('miseryFill');
        this.gaugeValue = document.getElementById('miseryValue');
        
        if (!this.gaugeFill || !this.gaugeValue) return;
        
        // Animate initial fill
        setTimeout(() => {
            this.animateGauge(this.currentValue);
        }, 500);
        
        // Fluctuate misery over time
        this.startFluctuation();
    },
    
    animateGauge(targetValue) {
        const fillWidth = targetValue;
        this.gaugeFill.style.width = `${fillWidth}%`;
    },
    
    startFluctuation() {
        setInterval(() => {
            // Random fluctuation between -0.5 and +0.3
            const change = (Math.random() - 0.3) * 0.5;
            this.currentValue = Math.max(80, Math.min(99.9, this.currentValue + change));
            
            this.gaugeValue.textContent = this.currentValue.toFixed(1);
            this.gaugeFill.style.width = `${this.currentValue}%`;
        }, 5000);
    }
};

/* ============================================
   AFFLICTION TRACKER
   ============================================ */

const AfflictionTracker = {
    filterBtns: null,
    cards: null,
    
    init() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.cards = document.querySelectorAll('.affliction-card');
        
        if (!this.filterBtns.length || !this.cards.length) return;
        
        this.setupFilters();
    },
    
    setupFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter cards
                this.filterCards(filter);
            });
        });
    },
    
    filterCards(filter) {
        this.cards.forEach((card, index) => {
            const type = card.getAttribute('data-type');
            const shouldShow = filter === 'all' || type === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.animation = `fadeIn 0.4s ease-out ${index * 0.1}s forwards`;
            } else {
                card.style.display = 'none';
            }
        });
    }
};

/* ============================================
   CALENDAR
   ============================================ */

const Calendar = {
    months: [
        'Month of Weeping',
        'Month of Shadows',
        'Month of Bones',
        'Month of Silence',
        'Month of Blood',
        'Month of Ash',
        'Month of Frost',
        'Month of Madness',
        'Month of Thorns',
        'Month of Echoes',
        'Month of Whispers',
        'Month of Endings'
    ],
    
    currentMonth: 0,
    currentYear: 947,
    
    rituals: {
        0: [4, 15, 26],
        1: [7, 19, 28],
        2: [3, 13, 24],
        3: [9, 21, 30],
        4: [2, 14, 25],
        5: [6, 18, 29],
        6: [1, 11, 22],
        7: [8, 20, 31],
        8: [5, 17, 27],
        9: [3, 15, 26],
        10: [7, 19, 28],
        11: [4, 16, 27]
    },
    
    blightDays: {
        0: [11, 21],
        1: [8, 22],
        2: [15, 25],
        3: [6, 18],
        4: [12, 24],
        5: [9, 23],
        6: [4, 16],
        7: [14, 28],
        8: [7, 19],
        9: [11, 25],
        10: [3, 17],
        11: [10, 22]
    },
    
    init() {
        this.prevBtn = document.getElementById('calPrev');
        this.nextBtn = document.getElementById('calNext');
        this.monthDisplay = document.getElementById('calMonth');
        this.calendarGrid = document.getElementById('calendarGrid');
        
        if (!this.prevBtn || !this.nextBtn || !this.calendarGrid) return;
        
        this.setupNavigation();
        this.renderCalendar();
    },
    
    setupNavigation() {
        this.prevBtn.addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.renderCalendar();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.renderCalendar();
        });
    },
    
    renderCalendar() {
        // Update month display
        this.monthDisplay.textContent = `${this.months[this.currentMonth]} — Year ${this.currentYear} A.W.`;
        
        // Get ritual and blight days for current month
        const ritualDays = this.rituals[this.currentMonth] || [];
        const blightDays = this.blightDays[this.currentMonth] || [];
        
        // Clear existing days (keep headers)
        const headers = this.calendarGrid.querySelectorAll('.cal-day-header');
        this.calendarGrid.innerHTML = '';
        headers.forEach(h => this.calendarGrid.appendChild(h));
        
        // Add empty days for alignment (assuming month starts on Thursday)
        for (let i = 0; i < 4; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'cal-day empty';
            this.calendarGrid.appendChild(emptyDay);
        }
        
        // Add days (28 days in the dark calendar)
        for (let day = 1; day <= 28; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'cal-day';
            dayEl.setAttribute('data-day', day);
            
            let innerHTML = `<span class="day-number">${day}</span>`;
            
            if (ritualDays.includes(day)) {
                dayEl.classList.add('ritual');
                dayEl.setAttribute('data-ritual', this.getRitualName(day));
                innerHTML += '<span class="ritual-dot"></span>';
            } else if (blightDays.includes(day)) {
                dayEl.classList.add('blighted');
                dayEl.setAttribute('data-event', 'Blight Surge');
                innerHTML += '<span class="blight-dot"></span>';
            }
            
            dayEl.innerHTML = innerHTML;
            
            // Add hover tooltip
            dayEl.addEventListener('mouseenter', (e) => this.showTooltip(e, day));
            dayEl.addEventListener('mouseleave', () => this.hideTooltip());
            
            this.calendarGrid.appendChild(dayEl);
        }
    },
    
    getRitualName(day) {
        const ritualNames = [
            'The Night of Shattered Mirrors',
            'The Gathering of Shadows',
            'Invocation of the Weeping God',
            'Rite of the Bleeding Moon',
            'Ceremony of Lost Souls',
            'The Dark Communion'
        ];
        return ritualNames[day % ritualNames.length];
    },
    
    showTooltip(e, day) {
        const dayEl = e.currentTarget;
        const ritual = dayEl.getAttribute('data-ritual');
        const event = dayEl.getAttribute('data-event');
        
        if (ritual || event) {
            // Create tooltip
            let tooltip = document.querySelector('.calendar-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'calendar-tooltip';
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(26, 20, 16, 0.95);
                    border: 1px solid rgba(139, 115, 85, 0.5);
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 0.85rem;
                    color: #c9b896;
                    z-index: 100;
                    pointer-events: none;
                    white-space: nowrap;
                `;
                document.body.appendChild(tooltip);
            }
            
            tooltip.textContent = ritual || event;
            tooltip.style.display = 'block';
            
            const rect = dayEl.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
        }
    },
    
    hideTooltip() {
        const tooltip = document.querySelector('.calendar-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
};

/* ============================================
   ARTIFACT MODAL
   ============================================ */

const ArtifactModal = {
    modal: null,
    modalBody: null,
    closeBtn: null,
    
    artifactData: {
        1: {
            name: 'The Crown of Ten Thousand Sorrows',
            rarity: 'Legendary',
            origin: 'Forged from the melted tears of a weeping god',
            description: 'A crown of blackened silver that grants its wearer dominion over all who suffer. Each day it is worn, the wearer experiences the cumulative pain of every soul in their domain.',
            curse: 'Sympathetic Agony',
            curseDesc: 'The wearer feels every wound, every illness, every moment of despair experienced by those they rule. At peak usage, the psychic weight has driven all previous owners to madness within a year.',
            history: 'The Crown was first worn by King Malachar the Merciful, who sought to understand his subjects\' suffering. Within a year, he had gouged out his own eyes to stop seeing their pain. It passed through twelve more rulers before being sealed in the Vault of Lamentations.',
            power: 95,
            curseSeverity: 100
        },
        2: {
            name: 'Griefbringer',
            rarity: 'Epic',
            origin: 'Dipped in the River of Lost Memories',
            description: 'A dagger that inflicts wounds which never heal, instead weeping the victim\'s happiest memories as black ichor. The wounds themselves are not fatal, but the loss of cherished moments drives victims to despair.',
            curse: 'Memory Bleed',
            curseDesc: 'The wielder\'s own memories slowly leak away with each use, leaving them increasingly hollow. After approximately thirty uses, the wielder remembers nothing of their past life.',
            history: 'Created by the assassin Order of the Hollow, who believed that destroying someone\'s memories was a mercy compared to death. The Order eventually fell when none of its members could remember why they were assassins.',
            power: 75,
            curseSeverity: 80
        },
        3: {
            name: 'The Mirror of True Suffering',
            rarity: 'Epic',
            origin: 'Crafted by the Blind Oracle of Despair',
            description: 'Shows viewers not their reflection, but the full extent of suffering they have caused others throughout their lives. Every careless word, every act of cruelty, every moment of indifference plays out before their eyes.',
            curse: 'Guilt Incarnate',
            curseDesc: 'Those who look too long become trapped in an endless loop of self-flagellation, unable to see anything but their past cruelties. Their bodies remain, but their minds are lost in an eternity of remorse.',
            history: 'The Blind Oracle created only three mirrors before going mad from their own visions. Two have been destroyed; this last remains in the hands of a penitent cult who use it to initiate new members.',
            power: 70,
            curseSeverity: 90
        },
        4: {
            name: 'Chains of the Penitent',
            rarity: 'Rare',
            origin: 'Wrought in the furnaces of the Abyss',
            description: 'Chains that bind not the body but the soul. Those shackled feel the weight of every sin they have ever committed, from the smallest lie to the greatest atrocity. The chains cannot be removed by force.',
            curse: 'Eternal Burden',
            curseDesc: 'The chains grow heavier with each new transgression. Eventually, the weight becomes unbearable, and the shackled soul is dragged down into the earth to join the chains in the Abyss.',
            history: 'Used by the Inquisitors of the Pale to extract confessions. Prisoners would confess to crimes they never committed just to have the chains removed. The Inquisitors eventually chained themselves, believing their own sins were unforgivable.',
            power: 60,
            curseSeverity: 75
        },
        5: {
            name: 'The Chalice of Endless Thirst',
            rarity: 'Legendary',
            origin: 'Found in the tomb of the Water God\'s corpse',
            description: 'Grants immortality to the drinker, but instills an unquenchable thirst that no liquid can satisfy. The drinker will exist forever, burning with a drought that cannot be quenched.',
            curse: 'Eternal Dryness',
            curseDesc: 'Immortal but perpetually parched. Many have drunk entire seas and still feel the burn of thirst. Some have tried to drink the Blight itself, only to find it tastes of sand and ashes.',
            history: 'The Water God died of grief when its worshippers began to worship gold instead. The Chalice was found in its desiccated hands, still wet with divine tears that evaporated upon exposure to air.',
            power: 90,
            curseSeverity: 95
        }
    },
    
    init() {
        this.modal = document.getElementById('artifactModal');
        this.modalBody = document.getElementById('modalBody');
        this.closeBtn = document.getElementById('modalClose');
        
        if (!this.modal || !this.modalBody || !this.closeBtn) return;
        
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Click on artifact cards to open modal
        const artifactCards = document.querySelectorAll('.artifact-card[data-artifact]');
        artifactCards.forEach(card => {
            card.addEventListener('click', () => {
                const artifactId = card.getAttribute('data-artifact');
                this.openModal(artifactId);
            });
        });
        
        // Close button
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    },
    
    openModal(artifactId) {
        const data = this.artifactData[artifactId];
        if (!data) return;
        
        const rarityClass = data.rarity.toLowerCase();
        
        this.modalBody.innerHTML = `
            <div class="modal-header" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(139, 115, 85, 0.3);">
                <h3 style="font-family: 'MedievalSharp', cursive; font-size: 1.8rem; color: #e8dcc8; margin-bottom: 0.5rem;">${data.name}</h3>
                <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                    <span class="artifact-rarity ${rarityClass}" style="font-size: 0.8rem; padding: 4px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.1em;">${data.rarity}</span>
                    <span style="font-family: 'IM Fell English', serif; font-size: 0.95rem; color: #8b7355; font-style: italic;">${data.origin}</span>
                </div>
            </div>
            
            <div class="modal-section" style="margin-bottom: 1.5rem;">
                <h4 style="font-family: 'MedievalSharp', cursive; font-size: 1.1rem; color: #c9b896; margin-bottom: 0.5rem;">Description</h4>
                <p style="color: #9a8b70; line-height: 1.7;">${data.description}</p>
            </div>
            
            <div class="modal-section curse-section" style="margin-bottom: 1.5rem; background: rgba(74, 14, 14, 0.2); border: 1px solid rgba(139, 26, 26, 0.3); border-radius: 6px; padding: 1rem;">
                <h4 style="font-family: 'MedievalSharp', cursive; font-size: 1.1rem; color: #c41e1e; margin-bottom: 0.5rem;">Curse: ${data.curse}</h4>
                <p style="color: #9a8b70; line-height: 1.7; font-size: 0.95rem;">${data.curseDesc}</p>
            </div>
            
            <div class="modal-section" style="margin-bottom: 1.5rem;">
                <h4 style="font-family: 'MedievalSharp', cursive; font-size: 1.1rem; color: #c9b896; margin-bottom: 0.5rem;">History</h4>
                <p style="color: #9a8b70; line-height: 1.7;">${data.history}</p>
            </div>
            
            <div class="modal-stats" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 0.85rem; color: #6a5d4a; width: 100px;">Power</span>
                    <div style="flex: 1; height: 8px; background: rgba(26, 20, 16, 0.8); border: 1px solid rgba(139, 115, 85, 0.3); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${data.power}%; background: linear-gradient(90deg, #8b7355, #c9a959); border-radius: 3px;"></div>
                    </div>
                    <span style="font-size: 0.85rem; color: #c9b896; width: 40px; text-align: right;">${data.power}%</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 0.85rem; color: #6a5d4a; width: 100px;">Curse Severity</span>
                    <div style="flex: 1; height: 8px; background: rgba(26, 20, 16, 0.8); border: 1px solid rgba(139, 115, 85, 0.3); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${data.curseSeverity}%; background: linear-gradient(90deg, #4a0e0e, #c41e1e); border-radius: 3px;"></div>
                    </div>
                    <span style="font-size: 0.85rem; color: #c41e1e; width: 40px; text-align: right;">${data.curseSeverity}%</span>
                </div>
            </div>
        `;
        
        // Apply rarity styling
        if (data.rarity === 'Legendary') {
            this.modalBody.querySelector('.artifact-rarity').style.background = 'rgba(138, 106, 42, 0.3)';
            this.modalBody.querySelector('.artifact-rarity').style.color = '#c9a959';
            this.modalBody.querySelector('.artifact-rarity').style.border = '1px solid rgba(201, 169, 89, 0.5)';
        } else if (data.rarity === 'Epic') {
            this.modalBody.querySelector('.artifact-rarity').style.background = 'rgba(106, 58, 122, 0.3)';
            this.modalBody.querySelector('.artifact-rarity').style.color = '#a86ac2';
            this.modalBody.querySelector('.artifact-rarity').style.border = '1px solid rgba(106, 58, 122, 0.5)';
        } else if (data.rarity === 'Rare') {
            this.modalBody.querySelector('.artifact-rarity').style.background = 'rgba(74, 90, 138, 0.3)';
            this.modalBody.querySelector('.artifact-rarity').style.color = '#7a9ac2';
            this.modalBody.querySelector('.artifact-rarity').style.border = '1px solid rgba(74, 90, 138, 0.5)';
        }
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

const ScrollAnimations = {
    elements: null,
    observer: null,
    
    init() {
        this.setupObserver();
        this.observeElements();
    },
    
    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    },
    
    observeElements() {
        const elementsToAnimate = [
            '.section-header',
            '.chronicle-text',
            '.sidebar-card',
            '.misery-gauge-container',
            '.misery-breakdown',
            '.misery-ticker',
            '.affliction-card',
            '.artifact-card',
            '.blight-map-container',
            '.blight-stats',
            '.ritual-calendar',
            '.upcoming-rituals',
            '.ritual-item'
        ];
        
        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.style.opacity = '0';
                el.style.animationDelay = `${index * 0.1}s`;
                this.observer.observe(el);
            });
        });
    }
};

/* ============================================
   BLIGHT MAP
   ============================================ */

const BlightMap = {
    locations: null,
    tooltip: null,
    
    init() {
        this.locations = document.querySelectorAll('.map-location');
        
        if (!this.locations.length) return;
        
        this.createTooltip();
        this.setupLocationEvents();
        this.animateBlight();
    },
    
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'map-tooltip';
        this.tooltip.style.cssText = `
            position: absolute;
            background: rgba(26, 20, 16, 0.95);
            border: 1px solid rgba(139, 115, 85, 0.5);
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 0.85rem;
            color: #c9b896;
            z-index: 100;
            pointer-events: none;
            white-space: nowrap;
            display: none;
        `;
        document.body.appendChild(this.tooltip);
    },
    
    setupLocationEvents() {
        this.locations.forEach(location => {
            location.addEventListener('mouseenter', (e) => {
                const name = location.getAttribute('data-name');
                this.tooltip.textContent = name;
                this.tooltip.style.display = 'block';
                
                const rect = location.getBoundingClientRect();
                this.tooltip.style.left = `${rect.left + rect.width / 2 - this.tooltip.offsetWidth / 2}px`;
                this.tooltip.style.top = `${rect.top - this.tooltip.offsetHeight - 10}px`;
            });
            
            location.addEventListener('mouseleave', () => {
                this.tooltip.style.display = 'none';
            });
        });
    },
    
    animateBlight() {
        // Slowly pulse the wound center
        const wound = document.querySelector('.map-region.wound');
        if (wound) {
            let scale = 1;
            let growing = true;
            
            setInterval(() => {
                if (growing) {
                    scale += 0.002;
                    if (scale >= 1.15) growing = false;
                } else {
                    scale -= 0.002;
                    if (scale <= 1) growing = true;
                }
                wound.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }, 50);
        }
    }
};

/* ============================================
   TICKER
   ============================================ */

const Ticker = {
    init() {
        const tickerContent = document.getElementById('miseryTicker');
        if (!tickerContent) return;
        
        // Duplicate content for seamless scroll
        const originalContent = tickerContent.innerHTML;
        tickerContent.innerHTML = originalContent + originalContent;
    }
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};

/* ============================================
   CUSTOM CURSOR EFFECT (Optional)
   ============================================ */

const CursorEffect = {
    cursor: null,
    
    init() {
        // Create custom cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 1px solid rgba(201, 169, 89, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: width 0.2s, height 0.2s, border-color 0.2s;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(this.cursor);
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });
        
        // Enlarge on clickable elements
        const clickables = document.querySelectorAll('a, button, .artifact-card, .cal-day, .filter-btn');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.width = '40px';
                this.cursor.style.height = '40px';
                this.cursor.style.borderColor = 'rgba(201, 169, 89, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.width = '20px';
                this.cursor.style.height = '20px';
                this.cursor.style.borderColor = 'rgba(201, 169, 89, 0.5)';
            });
        });
    }
};

// Uncomment to enable custom cursor
// CursorEffect.init();

/* ============================================
   EASTER EGG - KONAMI CODE
   ============================================ */

const EasterEgg = {
    sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
    currentStep: 0,
    
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === this.sequence[this.currentStep]) {
                this.currentStep++;
                if (this.currentStep === this.sequence.length) {
                    this.activate();
                    this.currentStep = 0;
                }
            } else {
                this.currentStep = 0;
            }
        });
    },
    
    activate() {
        // Add a dramatic effect
        document.body.style.animation = 'none';
        document.body.offsetHeight; // Trigger reflow
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes reality-shift {
                0% { filter: hue-rotate(0deg) saturate(1); }
                25% { filter: hue-rotate(90deg) saturate(2); }
                50% { filter: hue-rotate(180deg) saturate(0.5); }
                75% { filter: hue-rotate(270deg) saturate(1.5); }
                100% { filter: hue-rotate(360deg) saturate(1); }
            }
            
            .reality-shift {
                animation: reality-shift 2s ease-in-out;
            }
        `;
        document.head.appendChild(style);
        document.body.classList.add('reality-shift');
        
        setTimeout(() => {
            document.body.classList.remove('reality-shift');
        }, 2000);
        
        console.log('%c⛧ THE VOID ACKNOWLEDGES YOU ⛧', 
            'color: #c41e1e; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px #000;');
    }
};

EasterEgg.init();