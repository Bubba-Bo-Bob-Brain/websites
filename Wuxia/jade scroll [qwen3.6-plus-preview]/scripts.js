/**
 * 武經天書 — Heavenly Martial Arts Scripture
 * Main JavaScript Controller
 * Handles animations, interactions, parallax, and dynamic content.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    LoadingScreen.init();
    Parallax.init();
    ScrollAnimations.init();
    StatBars.init();
    SkillTree.init();
    MeridianDiagram.init();
    CustomCursor.init();
    ScrollToTop.init();
    Navigation.init();
    InkParticles.init();
});

/* =========================================
   Loading Screen
   ========================================= */
const LoadingScreen = {
    init() {
        const screen = document.getElementById('loading-screen');
        // Simulate loading time for effect
        setTimeout(() => {
            screen.classList.add('hidden');
            // Trigger initial animations after loading
            setTimeout(() => ScrollAnimations.checkAll(), 500);
        }, 2800);
    }
};

/* =========================================
   Parallax Background
   ========================================= */
const Parallax = {
    layers: [],
    ticking: false,
    
    init() {
        this.layers = document.querySelectorAll('.parallax-layer');
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    },
    
    onScroll() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                this.layers.forEach(layer => {
                    const speed = parseFloat(layer.dataset.speed) || 0.1;
                    const yPos = -(scrollY * speed);
                    layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
};

/* =========================================
   Scroll Animations (Intersection Observer)
   ========================================= */
const ScrollAnimations = {
    observer: null,
    
    init() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally stop observing once revealed
                    // observer.unobserve(entry.target); 
                }
            });
        }, options);
        
        // Observe sections
        document.querySelectorAll('.scroll-section').forEach(el => this.observer.observe(el));
        // Observe elements with data-reveal
        document.querySelectorAll('[data-reveal]').forEach(el => this.observer.observe(el));
    },
    
    checkAll() {
        // Force check for elements already in view
        document.querySelectorAll('.scroll-section, [data-reveal]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }
};

/* =========================================
   Stat Bars Animation
   ========================================= */
const StatBars = {
    observer: null,
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateBars(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        document.querySelectorAll('.technique-card').forEach(card => {
            this.observer.observe(card);
        });
    },
    
    animateBars(card) {
        const fills = card.querySelectorAll('.stat-fill');
        fills.forEach(fill => {
            const width = fill.dataset.width;
            // Small delay for staggered effect
            setTimeout(() => {
                fill.style.width = `${width}%`;
            }, 200);
        });
    }
};

/* =========================================
   Skill Tree Interaction
   ========================================= */
const SkillTree = {
    data: {
        'dantian': { name: '丹田', nameEn: 'Dantian', desc: 'The energy center of the body, located three fingers below the navel. Cultivating the Dantian is the foundation of all inner arts.', reqs: ['Breathing', 'Posture', 'Focus'] },
        'qi-sense': { name: '氣感', nameEn: 'Qi Sense', desc: 'The ability to perceive and gather qi from the environment. The first step towards internal cultivation.', reqs: ['Meditation', 'Sensitivity'] },
        'circulation': { name: '周天', nameEn: 'Microcosmic Orbit', desc: 'Circulating qi through the Governing and Conception vessels. Strengthens the meridians.', reqs: ['Qi Sense', 'Meridian Knowledge'] },
        'meridian': { name: '經脈', nameEn: 'Meridian Opening', desc: 'Clearing and expanding the twelve primary meridians to allow free flow of energy.', reqs: ['Physical Conditioning'] },
        'breath': { name: '吐納', nameEn: 'Breath Control', desc: 'Advanced breathing techniques to draw in heavenly and earthly qi.', reqs: ['Lung Capacity', 'Rhythm'] },
        'focus': { name: '凝神', nameEn: 'Spirit Focus', desc: 'Condensing the mind to a single point, eliminating distractions.', reqs: ['Mental Discipline'] },
        'yin-yang': { name: '陰陽', nameEn: 'Yin-Yang Balance', desc: 'Harmonizing opposing forces within the body for perfect equilibrium.', reqs: ['Circulation', 'Understanding'] },
        'five-elements': { name: '五行', nameEn: 'Five Elements', desc: 'Aligning internal organs with Wood, Fire, Earth, Metal, and Water energies.', reqs: ['Meridian Mastery'] },
        'bone': { name: '洗髓', nameEn: 'Marrow Cleansing', desc: 'Refining the marrow to produce pure blood and essence.', reqs: ['Herbal Baths', 'Pain Tolerance'] },
        'body': { name: '煉體', nameEn: 'Body Forging', desc: 'Hardening the body like iron while maintaining flexibility.', reqs: ['Physical Training'] },
        'void-breath': { name: '虛息', nameEn: 'Void Breath', desc: 'Breathing that resonates with the void itself. Extremely rare.', reqs: ['Breath Mastery', 'Emptiness'] },
        'mind-eye': { name: '心眼', nameEn: 'Mind\'s Eye', desc: 'Perceiving the world without sight. Seeing the flow of qi.', reqs: ['Focus', 'Sensitivity'] },
        'harmony': { name: '太和', nameEn: 'Great Harmony', desc: 'Merging personal qi with the qi of heaven and earth.', reqs: ['Yin-Yang', 'Nature Bond'] },
        'elemental': { name: '元素', nameEn: 'Elemental Mastery', desc: 'Commanding the five elements to enhance techniques.', reqs: ['Five Elements', 'Willpower'] },
        'golden': { name: '金身', nameEn: 'Golden Body', desc: 'The body becomes indestructible, glowing with golden light.', reqs: ['Marrow Cleansing', 'Body Forging'] },
        'immortal': { name: '仙骨', nameEn: 'Immortal Bones', desc: 'Transforming bones to jade-like quality, shedding mortality.', reqs: ['Golden Body', 'Purity'] },
        'transcendence': { name: '超凡入聖', nameEn: 'Transcendence', desc: 'Shattering the void and ascending beyond mortal limits. The ultimate goal.', reqs: ['All Skills Mastered'] }
    },
    
    init() {
        const nodes = document.querySelectorAll('.skill-node');
        const panel = document.getElementById('skill-detail-panel');
        
        nodes.forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                const skillId = node.dataset.skill;
                const info = this.data[skillId];
                
                if (info) {
                    // Reset active states
                    nodes.forEach(n => n.style.fill = '');
                    node.style.fill = '#d4af37'; // Highlight active
                    
                    // Update Panel
                    document.getElementById('detail-seal-text').textContent = info.name.charAt(0);
                    document.getElementById('skill-detail-name').textContent = info.name;
                    document.getElementById('skill-detail-name-en').textContent = info.nameEn;
                    document.getElementById('skill-detail-desc').textContent = info.desc;
                    
                    const reqList = document.getElementById('detail-req-list');
                    reqList.innerHTML = '';
                    info.reqs.forEach(req => {
                        const li = document.createElement('li');
                        li.textContent = req;
                        reqList.appendChild(li);
                    });
                    
                    // Animate panel entrance
                    panel.style.opacity = '0';
                    panel.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        panel.style.transition = 'all 0.4s ease';
                        panel.style.opacity = '1';
                        panel.style.transform = 'translateY(0)';
                    }, 50);
                }
            });
        });
    }
};

/* =========================================
   Meridian Diagram & Tooltip
   ========================================= */
const MeridianDiagram = {
    data: {
        'baihui': { name: '百會 (Baihui)', desc: 'Hundred Convergences. Meeting of all yang meridians. Opens the mind to heavenly qi.', meridian: 'Governing Vessel 督脈' },
        'dazhui': { name: '大椎 (Dazhui)', desc: 'Great Vertebra. Gathering point of yang qi. Strengthens the immune system.', meridian: 'Governing Vessel 督脈' },
        'mingmen': { name: '命門 (Mingmen)', desc: 'Gate of Life. Root of original qi and fire of the kidneys.', meridian: 'Governing Vessel 督脈' },
        'shenque': { name: '神闕 (Shenque)', desc: 'Spirit Palace. The navel, connection to prenatal qi.', meridian: 'Conception Vessel 任脈' },
        'qihai': { name: '氣海 (Qihai)', desc: 'Sea of Qi. Major center for generating and storing qi.', meridian: 'Conception Vessel 任脈' },
        'guanyuan': { name: '關元 (Guanyuan)', desc: 'Gate of Origin. Stores essence and strengthens vitality.', meridian: 'Conception Vessel 任脈' },
        'chize': { name: '尺澤 (Chize)', desc: 'Cubit Marsh. Heavily used for lung issues and clearing heat.', meridian: 'Lung Meridian 手太陰肺經' },
        'chize-r': { name: '尺澤 (Chize)', desc: 'Cubit Marsh. Heavily used for lung issues and clearing heat.', meridian: 'Lung Meridian 手太陰肺經' }
    },
    
    init() {
        const points = document.querySelectorAll('.acupoint');
        const tooltip = document.getElementById('acupoint-tooltip');
        const svgContainer = document.querySelector('.meridian-container');
        
        points.forEach(point => {
            point.addEventListener('click', (e) => {
                e.stopPropagation();
                const pointId = point.dataset.point;
                const info = this.data[pointId];
                
                if (info) {
                    document.getElementById('tooltip-point-name').textContent = info.name;
                    document.getElementById('tooltip-point-desc').textContent = info.desc;
                    document.getElementById('tooltip-meridian').textContent = info.meridian;
                    
                    tooltip.classList.add('active');
                    
                    // Position tooltip
                    const svgRect = svgContainer.getBoundingClientRect();
                    const pointRect = point.getBoundingClientRect();
                    
                    let left = pointRect.left - svgRect.left + pointRect.width / 2 + 20;
                    let top = pointRect.top - svgRect.top - 20;
                    
                    // Keep within bounds
                    if (left + 250 > svgRect.width) left = left - 280;
                    if (top < 0) top = 10;
                    
                    tooltip.style.left = `${left}px`;
                    tooltip.style.top = `${top}px`;
                }
            });
        });
        
        // Close tooltip when clicking outside
        document.addEventListener('click', () => {
            tooltip.classList.remove('active');
        });
    }
};

/* =========================================
   Custom Cursor
   ========================================= */
const CustomCursor = {
    cursor: null,
    ring: null,
    dot: null,
    isMobile: false,
    
    init() {
        if (window.matchMedia('(pointer: coarse)').matches) {
            this.isMobile = true;
            return; // Disable on touch devices
        }
        
        this.cursor = document.getElementById('custom-cursor');
        this.ring = this.cursor.querySelector('.cursor-ring');
        this.dot = this.cursor.querySelector('.cursor-dot');
        
        this.cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            this.move(e.clientX, e.clientY);
        });
        
        // Hover effects
        const hoverables = document.querySelectorAll('a, button, .technique-card, .skill-node, .acupoint, .nav-seal');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
    },
    
    move(x, y) {
        this.cursor.style.transform = `translate(${x - 12}px, ${y - 12}px)`;
    }
};

/* =========================================
   Scroll to Top
   ========================================= */
const ScrollToTop = {
    button: null,
    
    init() {
        this.button = document.getElementById('scroll-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, { passive: true });
        
        this.button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

/* =========================================
   Navigation Highlighting
   ========================================= */
const Navigation = {
    init() {
        const sections = document.querySelectorAll('.scroll-section');
        const navLinks = document.querySelectorAll('.nav-seal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.dataset.section === id);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
        
        sections.forEach(section => observer.observe(section));
        
        // Smooth scroll for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
};

/* =========================================
   Dynamic Ink Particles
   ========================================= */
const InkParticles = {
    container: null,
    count: 15,
    
    init() {
        this.container = document.getElementById('ink-particles');
        for (let i = 0; i < this.count; i++) {
            this.createParticle();
        }
    },
    
    createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('ink-particle');
        
        // Randomize properties
        const size = Math.random() * 40 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 15;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        this.container.appendChild(particle);
    }
};