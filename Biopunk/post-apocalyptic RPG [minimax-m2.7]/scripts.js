/* =====================================================
/* BIOMORPH: Post-Apocalyptic Biopunk RPG
/* JAVASCRIPT
/* ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    initBioParticles();
    initHeader();
    initCountingAnimation();
    initMutationCatalog();
    initTechTree();
    initContaminationMap();
    initFieldNotes();
    initCharacterStatus();
    initScrollAnimations();
    initSmoothScroll();
    initNavigation();
}

/* ----- Bio Particles Animation ----- */
function initBioParticles() {
    const particles = document.querySelectorAll('.bio-particle');
    particles.forEach((particle, index) => {
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * -30}s`;
        particle.style.animationDuration = `${20 + Math.random() * 15}s`;
        const size = 2 + Math.random() * 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
    });
}

/* ----- Header Interactions ----- */
function initHeader() {
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });
}

/* ----- Counting Animation for Hero Stats ----- */
function initCountingAnimation() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    const observerOptions = { threshold: 0.5, rootMargin: '0px' };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.dataset.count);
                animateCount(target, count);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statValues.forEach(stat => observer.observe(stat));
}

function animateCount(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

/* ----- Mutation Catalog ----- */
function initMutationCatalog() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mutationCards = document.querySelectorAll('.mutation-card');
    const searchInput = document.getElementById('mutation-search');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            mutationCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        mutationCards.forEach(card => {
            const name = card.querySelector('.mutation-name').textContent.toLowerCase();
            const desc = card.querySelector('.mutation-desc').textContent.toLowerCase();
            const id = card.querySelector('.mutation-id').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || desc.includes(searchTerm) || id.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
        
        filterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');
    });
}

/* ----- Tech Tree Interactions ----- */
function initTechTree() {
    const treeNodes = document.querySelectorAll('.tree-node');
    
    treeNodes.forEach(node => {
        node.addEventListener('click', () => {
            if (node.classList.contains('locked')) {
                node.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    node.style.animation = '';
                }, 500);
                return;
            }
            
            if (node.classList.contains('unlocked') || node.classList.contains('root')) {
                node.classList.toggle('selected');
                const icon = node.querySelector('.node-icon i');
                if (node.classList.contains('selected')) {
                    icon.style.transform = 'scale(1.2)';
                    icon.style.color = 'var(--bio-green)';
                } else {
                    icon.style.transform = 'scale(1)';
                }
            }
        });
        
        node.addEventListener('mouseenter', () => {
            if (!node.classList.contains('locked')) {
                const info = node.querySelector('.node-info');
                if (info) info.style.transform = 'translateX(5px)';
            }
        });
        
        node.addEventListener('mouseleave', () => {
            const info = node.querySelector('.node-info');
            if (info) info.style.transform = 'translateX(0)';
        });
    });
}

/* ----- Contamination Map ----- */
function initContaminationMap() {
    const zoneMarkers = document.querySelectorAll('.zone-marker');
    const zoneDetails = document.getElementById('zone-details');
    
    if (!zoneDetails) return;
    
    const zoneName = zoneDetails.querySelector('.detail-zone-name');
    const threatFill = zoneDetails.querySelector('.detail-stat:first-child .detail-fill');
    const contaminationFill = zoneDetails.querySelector('.detail-stat:nth-child(2) .detail-fill');
    const lootFill = zoneDetails.querySelector('.detail-stat:nth-child(3) .detail-fill');
    const hazardType = zoneDetails.querySelector('.hazard-type');
    const mutationType = zoneDetails.querySelector('.mutation-type');
    const activityLevel = zoneDetails.querySelector('.activity-level');
    const routeBtn = zoneDetails.querySelector('.detail-action');
    
    const zoneData = {
        'The Fungal Forest': {
            name: 'The Fungal Forest',
            threat: 25,
            contamination: 40,
            loot: 65,
            hazard: 'Airborne Spores',
            mutation: 'Mycological Enhancement',
            activity: 'Moderate'
        },
        'Acid Marshlands': {
            name: 'Acid Marshlands',
            threat: 55,
            contamination: 70,
            loot: 45,
            hazard: 'Corrosive Waters',
            mutation: 'Dermal Resistance',
            activity: 'Low'
        },
        'Reactor Graveyard': {
            name: 'Reactor Graveyard',
            threat: 85,
            contamination: 95,
            loot: 80,
            hazard: 'Radiation Bursts',
            mutation: 'Genetic Instability',
            activity: 'Minimal'
        },
        'Nanite Wastes': {
            name: 'Nanite Wastes',
            threat: 70,
            contamination: 60,
            loot: 55,
            hazard: 'Self-Replicating Nanobots',
            mutation: 'Mechanical Symbiosis',
            activity: 'Variable'
        },
        'Spore Desert': {
            name: 'Spore Desert',
            threat: 45,
            contamination: 50,
            loot: 35,
            hazard: 'Toxic Pollen',
            mutation: 'Photosynthetic Skin',
            activity: 'Moderate'
        },
        'Bio-Reserve': {
            name: 'Bio-Reserve',
            threat: 15,
            contamination: 20,
            loot: 90,
            hazard: 'Predator Organisms',
            mutation: 'Mixed Enhancements',
            activity: 'High'
        }
    };
    
    function updateZoneDetails(zoneNameText) {
        const data = zoneData[zoneNameText];
        if (!data) return;
        
        if (zoneName) zoneName.textContent = data.name;
        
        if (threatFill) {
            threatFill.style.width = '0%';
            setTimeout(() => { threatFill.style.width = `${data.threat}%`; }, 100);
        }
        if (contaminationFill) {
            contaminationFill.style.width = '0%';
            setTimeout(() => { contaminationFill.style.width = `${data.contamination}%`; }, 100);
        }
        if (lootFill) {
            lootFill.style.width = '0%';
            setTimeout(() => { lootFill.style.width = `${data.loot}%`; }, 100);
        }
        
        if (hazardType) hazardType.textContent = data.hazard;
        if (mutationType) mutationType.textContent = data.mutation;
        if (activityLevel) activityLevel.textContent = data.activity;
    }
    
    zoneMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            zoneMarkers.forEach(m => m.classList.remove('active'));
            marker.classList.add('active');
            
            const zoneText = marker.dataset.zone;
            updateZoneDetails(zoneText);
            
            const playerMarker = document.querySelector('.player-marker');
            if (playerMarker) {
                const markerStyle = marker.style;
                const left = parseFloat(markerStyle.left);
                const top = parseFloat(markerStyle.top);
                playerMarker.style.transition = 'all 1s ease-in-out';
                playerMarker.style.left = `${left + 5}%`;
                playerMarker.style.top = `${top + 5}%`;
            }
        });
        
        marker.addEventListener('mouseenter', () => {
            const zoneText = marker.dataset.zone;
            const data = zoneData[zoneText];
            if (data) {
                if (zoneName) zoneName.textContent = data.name;
                if (threatFill) threatFill.style.width = `${data.threat}%`;
                if (contaminationFill) contaminationFill.style.width = `${data.contamination}%`;
                if (lootFill) lootFill.style.width = `${data.loot}%`;
            }
        });
    });
    
    if (routeBtn) {
        routeBtn.addEventListener('click', () => {
            routeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
            
            setTimeout(() => {
                routeBtn.innerHTML = '<i class="fas fa-check"></i> Route Calculated!';
                routeBtn.style.background = 'var(--bio-green)';
                routeBtn.style.color = 'var(--void-black)';
                
                setTimeout(() => {
                    routeBtn.innerHTML = '<i class="fas fa-route"></i> Calculate Route';
                    routeBtn.style.background = '';
                    routeBtn.style.color = '';
                }, 2000);
            }, 1500);
        });
    }
}

/* ----- Field Notes Navigation ----- */
function initFieldNotes() {
    const pages = document.querySelectorAll('.notebook-page');
    const dots = document.querySelectorAll('.page-dot');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (pages.length === 0) return;
    
    let currentPage = 1;
    const totalPages = pages.length;
    
    function showPage(pageNum) {
        pages.forEach(page => page.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        const targetPage = document.querySelector(`.notebook-page[data-page="${pageNum}"]`);
        const targetDot = document.querySelector(`.page-dot[data-page="${pageNum}"]`);
        
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.animation = 'pageFlip 0.5s ease';
        }
        if (targetDot) targetDot.classList.add('active');
        
        if (prevBtn) prevBtn.disabled = pageNum === 1;
        if (nextBtn) nextBtn.disabled = pageNum === totalPages;
        
        currentPage = pageNum;
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) showPage(currentPage - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) showPage(currentPage + 1);
        });
    }
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const pageNum = parseInt(dot.dataset.page);
            showPage(pageNum);
        });
    });
    
    document.addEventListener('keydown', (e) => {
        const notebook = document.querySelector('.notebook-container');
        if (notebook && isElementInViewport(notebook)) {
            if (e.key === 'ArrowLeft' && currentPage > 1) showPage(currentPage - 1);
            if (e.key === 'ArrowRight' && currentPage < totalPages) showPage(currentPage + 1);
        }
    });
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ----- Character Status ----- */
function initCharacterStatus() {
    const vitalDisplays = document.querySelectorAll('.vital-value');
    
    function updateVitals() {
        const baseValues = [72, 98.6, 98];
        
        vitalDisplays.forEach((display, index) => {
            if (!display) return;
            const base = baseValues[index];
            const variance = index === 0 ? 10 : 0.5;
            const newValue = base + (Math.random() * variance * 2 - variance);
            
            display.textContent = index === 1 ? newValue.toFixed(1) : Math.round(newValue);
            
            if (index === 0 && (newValue > 100 || newValue < 50)) {
                display.style.color = 'var(--radiation-red)';
            } else if (index === 2 && newValue < 90) {
                display.style.color = 'var(--amber)';
            } else {
                display.style.color = 'var(--text-primary)';
            }
        });
    }
    
    if (vitalDisplays.length > 0) {
        setInterval(updateVitals, 3000);
    }
    
    const invSlots = document.querySelectorAll('.inv-slot');
    invSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            invSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            slot.style.transform = 'scale(1.05)';
            setTimeout(() => {
                slot.style.transform = '';
            }, 200);
        });
    });
    
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

/* ----- Scroll Animations ----- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.mutation-card, .tree-column, .zone-marker, .active-mutation, .creature-entry');
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    headerObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        headerObserver.observe(header);
    });
}

/* ----- Smooth Scroll ----- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                window.history.pushState(null, null, targetId);
            }
        });
    });
}

/* ----- Navigation Active State ----- */
function initNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ----- Utility Functions ----- */
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

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/* ----- Notification System ----- */
const notifications = {
    container: null,
    
    init() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    },
    
    show(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();
        
        const notification = document.createElement('div');
        const colors = {
            info: 'var(--bio-green)',
            warning: 'var(--amber)',
            error: 'var(--radiation-red)',
            success: 'var(--bio-green)'
        };
        
        notification.style.cssText = `
            padding: 15px 20px;
            background: var(--charcoal);
            border: 1px solid ${colors[type]};
            border-left: 3px solid ${colors[type]};
            border-radius: var(--border-radius);
            color: var(--text-primary);
            font-size: 0.9rem;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        notification.textContent = message;
        this.container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
};

notifications.init();

window.showNotification = (message, type, duration) => {
    notifications.show(message, type, duration);
};

/* ----- Console Easter Egg ----- */
console.log(`%c BIOMORPH %c Post-Apocalyptic Biopunk RPG %c Welcome, Survivor. The contamination awaits.`,
    'background: #00ff88; color: #0a0a0c; font-size: 20px; font-weight: bold; padding: 10px 20px;',
    'background: #1a1a1f; color: #00ff88; font-size: 14px; padding: 10px 20px;',
    'background: #050506; color: #a0a0a8; font-size: 12px; padding: 10px 20px;'
);

console.log('Mutation Database Loaded:', document.querySelectorAll('.mutation-card').length, 'entries');
console.log('Contamination Zones Mapped:', document.querySelectorAll('.zone-marker').length, 'regions');
console.log('Bio-Enhancement Pathways Available:', 4);

/* ----- Dynamic Keyframes ----- */
function addKeyframe(name, rules) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `@keyframes ${name} { ${rules} }`;
    document.head.appendChild(style);
}

addKeyframe('fadeIn', 'from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }');
addKeyframe('pageFlip', '0% { opacity: 0; transform: rotateY(-10deg); } 100% { opacity: 1; transform: rotateY(0); }');
addKeyframe('slideIn', 'from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); }');
addKeyframe('slideOut', 'from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); }');
addKeyframe('shake', '0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); }');
addKeyframe('svgPulse', '0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); }');
addKeyframe('linkPulse', '0% { box-shadow: 0 0 0 0 var(--bio-green-glow); } 100% { box-shadow: 0 0 20px 10px transparent; }');

/* ----- Konami Code Easter Egg ----- */
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-10);
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        showNotification('BIOMORPH CONSOLE ACCESS GRANTED', 'success', 5000);
        document.body.classList.add('easter-egg');
    }
});

/* ----- Random Atmospheric Events ----- */
function triggerAtmosphericEvent() {
    const events = [
        () => {
            document.body.classList.add('glitch-effect');
            setTimeout(() => document.body.classList.remove('glitch-effect'), 500);
        },
        () => {
            const particles = document.querySelectorAll('.bio-particle');
            particles.forEach(p => {
                p.style.background = 'var(--radiation-red)';
                setTimeout(() => p.style.background = '', 1000);
            });
        },
        () => {
            const header = document.querySelector('.main-header');
            if (header) {
                header.style.borderBottomColor = 'var(--radiation-red)';
                setTimeout(() => header.style.borderBottomColor = '', 2000);
            }
        }
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent();
}

setInterval(triggerAtmosphericEvent, 30000 + Math.random() * 30000);

/* ----- Welcome Notification ----- */
setTimeout(() => {
    showNotification('Contamination levels rising in Sector 7', 'warning', 4000);
}, 5000);

/* ----- Page Visibility Handler ----- */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Survivor status: AWOL');
    } else {
        console.log('Survivor status: ONLINE');
    }
});

/* ----- Window Resize Handler ----- */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initScrollAnimations();
    }, 250);
});

/* ----- Before Unload Handler ----- */
window.addEventListener('beforeunload', () => {
    console.log('Survivor disconnecting...');
});