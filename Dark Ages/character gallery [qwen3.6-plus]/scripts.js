/* =========================================
   MEMENTO MORI — Character Gallery
   Interactive JavaScript Module
   ========================================= */

(function() {
    'use strict';

    // ==========================================
    // CHARACTER DATA STORE
    // ==========================================
    const characters = [
        {
            id: 0,
            name: "Dr. Aldric von Württemberg",
            title: "The Plague Doctor",
            background: "Once a scholar of Padua, now a wandering physician clad in waxed leather and herbs. He has seen too much death to fear it. His knowledge of anatomy is unmatched, though his methods are considered heretical by some.",
            stats: { health: 6, plague: 9, faith: 3, combat: 2, survival: 7, knowledge: 10 },
            abilities: ["🧪 Herbalism", "🔬 Anatomy", "💊 Remedy Craft"],
            alignment: "⚖️ Pragmatic",
            classType: "outcast",
            flavor: '"The humors must be balanced — by any means necessary."',
            icon: "🪶"
        },
        {
            id: 1,
            name: "Sir Gottfried of Hohenstein",
            title: "The Fallen Knight",
            background: "A disgraced crusader who returned to find his lands decimated. He now fights not for glory, but for those who cannot defend themselves. His sword arm remains true, even if his honor has been questioned.",
            stats: { health: 10, plague: 5, faith: 7, combat: 10, survival: 5, knowledge: 4 },
            abilities: ["🗡️ Swordsmanship", "🛡️ Shield Wall", "🐎 Horsemanship"],
            alignment: "😇 Righteous",
            classType: "noble",
            flavor: '"I swore an oath. Not to a king — to the living."',
            icon: "⚔️"
        },
        {
            id: 2,
            name: "Elswyth of the Blackwood",
            title: "The Hedge Witch",
            background: "Whispered about in villages, feared by priests. She speaks to the old spirits and brews remedies from roots no one else dares touch. The forest is her sanctuary and her weapon.",
            stats: { health: 5, plague: 8, faith: 1, combat: 3, survival: 9, knowledge: 8 },
            abilities: ["🌙 Old Magic", "🌱 Foraging", "👁️ Second Sight"],
            alignment: "🌑 Dark",
            classType: "outcast",
            flavor: '"The old gods do not judge. They only remember."',
            icon: "🌿"
        },
        {
            id: 3,
            name: "Brother Anselm of Cluny",
            title: "The Zealous Monk",
            background: "A Benedictine monk who believes the plague is divine punishment. He administers last rites with fierce devotion and unshakable conviction. Some find comfort in his words; others find only fear.",
            stats: { health: 5, plague: 4, faith: 10, combat: 2, survival: 6, knowledge: 7 },
            abilities: ["✝️ Last Rites", "📜 Scripture", "🕯️ Divine Comfort"],
            alignment: "🔥 Zealous",
            classType: "clergy",
            flavor: '"Repent, for the hour of reckoning is upon us."',
            icon: "📿"
        },
        {
            id: 4,
            name: 'Tommaso "Bones" Ferrero',
            title: "The Gravedigger",
            background: "He has buried more souls than any priest has prayed for. Death is his trade, and he knows every inch of consecrated — and unconsecrated — ground. He has developed an uncanny ability to sense when someone's time is near.",
            stats: { health: 8, plague: 7, faith: 4, combat: 5, survival: 8, knowledge: 3 },
            abilities: ["⛏️ Grave Digging", "💀 Death Sense", "🪓 Heavy Lifting"],
            alignment: "⚖️ Pragmatic",
            classType: "commoner",
            flavor: '"Everyone comes to me eventually. No rush."',
            icon: "⚰️"
        },
        {
            id: 5,
            name: 'Pip "the Rat" of Southwark',
            title: "The Beggar King",
            background: "Ruler of London's underbelly, master of a hundred beggars. He knows every alley, every secret, and exactly who can be trusted — which is no one. His network of informants is his greatest weapon.",
            stats: { health: 4, plague: 6, faith: 1, combat: 4, survival: 10, knowledge: 7 },
            abilities: ["🐀 Street Smarts", "🗡️ Stealth", "🤝 Underworld Contacts"],
            alignment: "🌑 Dark",
            classType: "outcast",
            flavor: '"I was king of nothing before. Now I\'m king of everything that\'s left."',
            icon: "👑"
        },
        {
            id: 6,
            name: "Greta Eisenhauer",
            title: "The Blacksmith",
            background: "A widow who took up her husband's hammer when the plague took him. Her forge is the only one still burning in the village, and her steel keeps the desperate at bay. She has learned to trust no one but her anvil.",
            stats: { health: 8, plague: 5, faith: 5, combat: 6, survival: 7, knowledge: 5 },
            abilities: ["🔥 Smithing", "🛡️ Armor Repair", "💪 Brute Strength"],
            alignment: "😇 Righteous",
            classType: "commoner",
            flavor: '"Fire purifies. Iron endures. So do I."',
            icon: "🔨"
        },
        {
            id: 7,
            name: "Lady Isolde de Montfort",
            title: "The Displaced Noblewoman",
            background: "Educated, ruthless, and stripped of everything by the plague. She has learned that silk means nothing when there's no bread — but her cunning remains sharp. She negotiates, schemes, and survives where others perish.",
            stats: { health: 4, plague: 3, faith: 4, combat: 1, survival: 5, knowledge: 9 },
            abilities: ["📚 Literacy", "🤝 Diplomacy", "💰 Resource Management"],
            alignment: "⚖️ Pragmatic",
            classType: "noble",
            flavor: '"I was born to rule. I will survive to rule again."',
            icon: "🏰"
        },
        {
            id: 8,
            name: "Wulfstan the Forester",
            title: "The Archer",
            background: "A yeoman who has lived in the forest all his life. The plague is just another predator to him — one he tracks, studies, and outmaneuvers with patient skill. His arrows never miss, and his traps are legendary.",
            stats: { health: 7, plague: 6, faith: 3, combat: 8, survival: 9, knowledge: 5 },
            abilities: ["🏹 Marksmanship", "🌲 Tracking", "🫀 Hunting"],
            alignment: "⚖️ Pragmatic",
            classType: "commoner",
            flavor: '"The forest provides — if you know how to ask."',
            icon: "🏹"
        },
        {
            id: 9,
            name: "Master Reynard le Barbier",
            title: "The Barber-Surgeon",
            background: "Equal parts barber, surgeon, and charlatan. His methods are questionable but his results speak for themselves — those who survive his treatment, at least. He travels between villages, trading services for coin and supplies.",
            stats: { health: 6, plague: 6, faith: 2, combat: 5, survival: 6, knowledge: 7 },
            abilities: ["🩸 Bloodletting", "🔪 Surgery", "🎭 Deception"],
            alignment: "⚖️ Pragmatic",
            classType: "commoner",
            flavor: '"A little pain now, or a lot of pain forever. Choose wisely."',
            icon: "🪒"
        },
        {
            id: 10,
            name: "Katharina the Penitent",
            title: "The Flagellant",
            background: "She walks from town to town, whipping herself and preaching repentance. Some call her mad. Others call her holy. She calls herself saved. Her endurance is supernatural, and crowds gather wherever she appears.",
            stats: { health: 5, plague: 7, faith: 10, combat: 3, survival: 5, knowledge: 4 },
            abilities: ["⛓️ Self-Denial", "🗣️ Oratory", "✨ Fanatical Devotion"],
            alignment: "🔥 Zealous",
            classType: "clergy",
            flavor: '"The flesh is weak. Only through suffering is the soul made strong."',
            icon: "🩸"
        },
        {
            id: 11,
            name: "Old Jakub of Prague",
            title: "The Rat Catcher",
            background: "He's been killing rats his entire life. Now the rats carry death itself. He's the first to notice patterns others miss — and the first to run when things turn bad. His knowledge of the plague's vectors is instinctive.",
            stats: { health: 6, plague: 8, faith: 2, combat: 3, survival: 8, knowledge: 6 },
            abilities: ["🪤 Trapping", "🐀 Pest Knowledge", "👃 Danger Sense"],
            alignment: "⚖️ Pragmatic",
            classType: "commoner",
            flavor: '"I\'ve seen rats flee burning buildings. Now they\'re fleeing something worse."',
            icon: "🐀"
        }
    ];

    // ==========================================
    // DOM REFERENCES
    // ==========================================
    const hero = document.getElementById('hero');
    const characterGrid = document.getElementById('characterGrid');
    const filterControls = document.getElementById('filterControls');
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('characterModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const particlesContainer = document.getElementById('particles');
    const relationshipWeb = document.getElementById('relationshipWeb');

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        createParticles();
        setupScrollReveal();
        setupFilters();
        setupCardInteractions();
        setupModal();
        setupScrollIndicator();
        setupParallax();
    }

    // ==========================================
    // PARTICLE SYSTEM
    // ==========================================
    function createParticles() {
        const particleCount = window.innerWidth < 768 ? 15 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random properties
                const size = Math.random() * 3 + 1;
                const left = Math.random() * 100;
                const duration = Math.random() * 15 + 10;
                const delay = Math.random() * 20;
                const opacity = Math.random() * 0.5 + 0.2;
                
                particle.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${left}%;
                    animation-duration: ${duration}s;
                    animation-delay: ${delay}s;
                    opacity: ${opacity};
                    background: ${Math.random() > 0.7 ? 'rgba(138, 35, 35, 0.6)' : 'rgba(197, 160, 89, 0.5)'};
                `;
                
                particlesContainer.appendChild(particle);
            }, i * 100);
        }
    }

    // ==========================================
    // SCROLL REVEAL (Intersection Observer)
    // ==========================================
    function setupScrollReveal() {
        const cards = document.querySelectorAll('.character-card');
        const relationshipNodes = document.querySelectorAll('.relationship-node');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.index ? 
                        parseInt(entry.target.dataset.index) * 80 : index * 100;
                    
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    
                    // Animate stat bars
                    const statFills = entry.target.querySelectorAll('.stat-fill');
                    statFills.forEach(fill => {
                        const width = fill.style.width;
                        fill.style.width = '0%';
                        setTimeout(() => {
                            fill.style.width = width;
                        }, 200);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        cards.forEach(card => observer.observe(card));
        relationshipNodes.forEach(node => observer.observe(node));
    }

    // ==========================================
    // FILTER SYSTEM
    // ==========================================
    function setupFilters() {
        const filterGroups = filterControls.querySelectorAll('.filter-buttons');
        const activeFilters = { class: 'all', alignment: 'all' };
        
        filterGroups.forEach(group => {
            const filterType = group.dataset.filter;
            const buttons = group.querySelectorAll('.filter-btn');
            
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const value = btn.dataset.value;
                    
                    // Update active state
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Store filter
                    activeFilters[filterType] = value;
                    
                    // Apply filters
                    applyFilters(activeFilters);
                });
            });
        });
    }

    function applyFilters(filters) {
        const cards = document.querySelectorAll('.character-card');
        
        cards.forEach((card, index) => {
            const cardClass = card.dataset.class;
            const cardAlignment = card.dataset.alignment;
            
            const classMatch = filters.class === 'all' || cardClass === filters.class;
            const alignMatch = filters.alignment === 'all' || cardAlignment === filters.alignment;
            
            if (classMatch && alignMatch) {
                card.classList.remove('hidden');
                // Re-trigger animation
                card.style.animationDelay = `${index * 80}ms`;
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // CARD INTERACTIONS
    // ==========================================
    function setupCardInteractions() {
        const cards = document.querySelectorAll('.character-card');
        
        cards.forEach(card => {
            // 3D tilt effect on hover
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
            
            // Click to open modal
            card.addEventListener('click', () => {
                const charIndex = parseInt(card.dataset.index);
                openModal(charIndex);
            });
        });
    }

    // ==========================================
    // MODAL SYSTEM
    // ==========================================
    function setupModal() {
        // Close on button click
        modalClose.addEventListener('click', closeModal);
        
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
            
            // Navigate with arrow keys
            if (modalOverlay.classList.contains('active')) {
                if (e.key === 'ArrowRight') {
                    navigateModal(1);
                } else if (e.key === 'ArrowLeft') {
                    navigateModal(-1);
                }
            }
        });
    }

    let currentModalIndex = 0;

    function openModal(index) {
        currentModalIndex = index;
        const char = characters[index];
        
        // Build modal content
        modalContent.innerHTML = `
            <div class="card-inner">
                <div class="card-portrait">
                    <div class="portrait-placeholder">
                        <div class="placeholder-icon">${char.icon}</div>
                        <span class="placeholder-text">Portrait</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="char-name">${char.name}</h3>
                    <p class="char-title">${char.title}</p>
                    <p class="char-background">${char.background}</p>
                    
                    <div class="char-stats">
                        <div class="stat" title="Health">
                            ❤️ 
                            <span class="stat-bar"><span class="stat-fill" style="width: ${char.stats.health * 10}%"></span></span> 
                            <span class="stat-value">${char.stats.health}</span>
                        </div>
                        <div class="stat" title="Plague Resistance">
                            🦠 
                            <span class="stat-bar"><span class="stat-fill" style="width: ${char.stats.plague * 10}%"></span></span> 
                            <span class="stat-value">${char.stats.plague}</span>
                        </div>
                        <div class="stat" title="Faith">
                            🙏 
                            <span class="stat-bar"><span class="stat-fill" style="width: ${char.stats.faith * 10}%"></span></span> 
                            <span class="stat-value">${char.stats.faith}</span>
                        </div>
                        <div class="stat" title="Combat">
                            ⚔️ 
                            <span class="stat-bar"><span class="stat-fill" style="width: ${char.stats.combat * 10}%"></span></span> 
                            <span class="stat-value">${char.stats.combat}</span>
                        </div>
                        <div class="stat" title="Survival">
                            🎯 
                            <span class="stat-bar"><span class="stat-fill" style="width: ${char.stats.survival * 10}%"></span></span> 
                            <span class="stat-value">${char.stats.survival}</span>
                        </div>
                        <div class="stat" title="Knowledge">
                            🧠 
                            <span class="stat-bar"><span class="stat-fill" style="width: ${char.stats.knowledge * 10}%"></span></span> 
                            <span class="stat-value">${char.stats.knowledge}</span>
                        </div>
                    </div>
                    
                    <div class="char-abilities">
                        ${char.abilities.map(a => `<span class="ability-tag">${a}</span>`).join('')}
                    </div>
                    
                    <div class="char-alignment">${char.alignment}</div>
                    <div class="card-flavor"><em>${char.flavor}</em></div>
                </div>
            </div>
        `;
        
        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate stat bars in modal
        setTimeout(() => {
            const fills = modalContent.querySelectorAll('.stat-fill');
            fills.forEach(fill => {
                const targetWidth = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = targetWidth;
                }, 100);
            });
        }, 300);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateModal(direction) {
        let newIndex = currentModalIndex + direction;
        if (newIndex < 0) newIndex = characters.length - 1;
        if (newIndex >= characters.length) newIndex = 0;
        openModal(newIndex);
    }

    // ==========================================
    // SCROLL INDICATOR
    // ==========================================
    function setupScrollIndicator() {
        scrollIndicator.addEventListener('click', () => {
            const gallery = document.getElementById('gallery');
            gallery.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ==========================================
    // PARALLAX EFFECT
    // ==========================================
    function setupParallax() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroHeight = hero.offsetHeight;
                    
                    if (scrollY < heroHeight) {
                        const heroContent = hero.querySelector('.hero-content');
                        if (heroContent) {
                            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                            heroContent.style.opacity = 1 - (scrollY / heroHeight) * 0.8;
                        }
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ==========================================
    // LAZY LOAD INITIALIZATION
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();