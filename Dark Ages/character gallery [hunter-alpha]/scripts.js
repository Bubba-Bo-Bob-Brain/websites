/* ═══════════════════════════════════════════════════════════════
   MORTIS — Survivors of the Black Death
   Interactive Character Gallery
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─────────── CHARACTER DATA ───────────
    const characterData = {
        godfrey: {
            name: 'Godfrey the Leech',
            title: 'Village Physician & Barber-Surgeon',
            quote: '"I will cut away the rot, even if it kills us both."',
            class: 'healer',
            classLabel: 'Healer',
            moral: 'neutral',
            moralLabel: 'Neutral',
            symbol: '⚕',
            backstory: 'Once a respected physician in the court of a minor duke, Godfrey fled when the plague reached the castle walls. His medical knowledge — bloodletting, herbal poultices, the occasional crude surgery — now serves desperate villagers who pay in bread and silence. He has seen the pestilence consume kings and peasants alike, and his faith in medicine has been shattered. All that remains is a grim determination to keep cutting, keep treating, keep trying — though he suspects it is all for nothing.',
            stats: {
                plagueResistance: 35,
                faith: 20,
                strength: 30,
                cunning: 55
            },
            skills: ['🌿 Herbalism', '🔪 Surgery', '🔍 Diagnosis', '⚗️ Alchemy'],
            bonds: [
                { icon: '🤝', text: 'Shares herbal knowledge with ', name: 'Morwen Blackthorn' },
                { icon: '⚔️', text: 'Distrusted by ', name: 'Brother Aldric', suffix: ' for his secular methods' },
                { icon: '💚', text: 'Grudgingly admires ', name: 'Isabel of Rouen\'s', suffix: ' dedication' }
            ]
        },
        isabel: {
            name: 'Isabel of Rouen',
            title: 'Cloistered Nun & Herbalist',
            quote: '"God has chosen me to witness, not to perish."',
            class: 'healer',
            classLabel: 'Healer',
            moral: 'righteous',
            moralLabel: 'Righteous',
            symbol: '⛪',
            backstory: 'For twenty years, Isabel tended the herb gardens of the Convent of Saint Catherine, distilling remedies for the sick and infirm. When the plague came, her sisters fell one by one — thirty women reduced to three, then to one. Isabel survived not by chance but by an almost supernatural immunity and an unwavering prayer schedule that she refuses to abandon, even now. She wanders the roads with her satchel of dried herbs, offering comfort to the dying and hope to the living.',
            stats: {
                plagueResistance: 75,
                faith: 90,
                strength: 25,
                cunning: 40
            },
            skills: ['🌿 Herbalism', '🙏 Prayer', '💪 Endurance', '📖 Scripture'],
            bonds: [
                { icon: '✝️', text: 'Prays nightly for the soul of ', name: 'Father Anselm' },
                { icon: '🌿', text: 'Teaches herb lore to ', name: 'Brigitta of Prague' },
                { icon: '😔', text: 'Pities ', name: 'Elena the Ashen', suffix: ' but fears her immunity' }
            ]
        },
        morwen: {
            name: 'Morwen Blackthorn',
            title: 'Wise Woman & Cunning Folk',
            quote: '"The Church calls me witch. The dying call me savior."',
            class: 'outcast',
            classLabel: 'Outcast',
            moral: 'neutral',
            moralLabel: 'Neutral',
            symbol: '🌿',
            backstory: 'Morwen has lived beyond the village her entire life, dwelling in a crooked cottage where the forest meets the moor. Her mother was called a witch, and her grandmother before that. The title never troubled her — it kept the fearful at bay and attracted the desperate. Now, with the plague raging, the same villagers who threw stones at her door come begging for poultices and charms. She helps them, not out of mercy, but because survival demands allies, even ungrateful ones.',
            stats: {
                plagueResistance: 60,
                faith: 10,
                strength: 35,
                cunning: 85
            },
            skills: ['🌿 Herbalism', '👁 Stealth', '🦊 Cunning', '🔮 Folk Magic'],
            bonds: [
                { icon: '🤝', text: 'Secretly trades remedies with ', name: 'Godfrey the Leech' },
                { icon: '👀', text: 'Watches ', name: 'Finn the Rat', suffix: ' with wary interest' },
                { icon: '⚔️', text: 'Despises ', name: 'Sir Cedric Blackmoor', suffix: ' for burning her herb garden' }
            ]
        },
        aldric: {
            name: 'Brother Aldric',
            title: 'Flagellant Monk',
            quote: '"Pain is the only honest prayer."',
            class: 'holy',
            classLabel: 'Holy',
            moral: 'righteous',
            moralLabel: 'Righteous',
            symbol: '✝',
            backstory: 'Brother Aldric was once a gentle scholar in the Abbey of Saint Benedict, copying manuscripts and tending the beehives. When the plague reached the abbey and claimed his brothers, something inside him broke — and something else emerged. He discovered the Flagellant movement on the roads and found his calling. Now he marches barefoot, scourging his back with leather thorns, convinced that his suffering might purchase God\'s mercy for the land. Whether this is faith or madness, even he cannot say.',
            stats: {
                plagueResistance: 45,
                faith: 95,
                strength: 70,
                cunning: 20
            },
            skills: ['💪 Endurance', '😱 Intimidation', '🩸 Pain Tolerance', '🙏 Preaching'],
            bonds: [
                { icon: '✝️', text: 'Views ', name: 'Isabel of Rouen', suffix: ' as a kindred spirit' },
                { icon: '😡', text: 'Considers ', name: 'Father Anselm', suffix: ' a false priest' },
                { icon: '👊', text: 'Respects ', name: 'Wulfric the Unbowed\'s', suffix: ' strength' }
            ]
        },
        petra: {
            name: 'Petra Ashenmaw',
            title: 'Gravedigger',
            quote: '"I\'ve buried more friends than I can count. The earth is hungry."',
            class: 'laborer',
            classLabel: 'Laborer',
            moral: 'neutral',
            moralLabel: 'Neutral',
            symbol: '⛏',
            backstory: 'Petra came to the village as an orphan, taken in by old Henrik the gravedigger. When the plague came and Henrik died, she simply picked up his shovel and continued the work. There was no one else. Now she digs from dawn until her arms give out, pausing only to wipe the sweat from her brow and stare at the ever-growing rows of mounds. She has developed an immunity born of constant exposure and a grim humor that keeps despair at bay. The dead are her companions; the living are merely temporary.',
            stats: {
                plagueResistance: 50,
                faith: 40,
                strength: 80,
                cunning: 45
            },
            skills: ['💪 Strength', '⛏ Digging', '👁 Stealth', '💀 Death Lore'],
            bonds: [
                { icon: '💚', text: 'Secretly visits ', name: 'Brigitta of Prague', suffix: ' for medicine' },
                { icon: '🍺', text: 'Shares ale with ', name: 'Wulfric the Unbowed', suffix: ' in silence' },
                { icon: '😨', text: 'Fears ', name: 'Brother Aldric\'s', suffix: ' madness' }
            ]
        },
        cedric: {
            name: 'Sir Cedric Blackmoor',
            title: 'Disgraced Knight',
            quote: '"Honor is a luxury the dead cannot afford."',
            class: 'warrior',
            classLabel: 'Warrior',
            moral: 'corrupt',
            moralLabel: 'Corrupt',
            symbol: '⚔',
            backstory: 'Sir Cedric once rode proudly beneath the banner of his liege lord, a knight of renown and modest fame. When the plague came, his lord fled and his men deserted. Alone and stripped of purpose, Cedric discovered that the rules of chivalry meant nothing in a world of corpses. He began taking what he needed by force, justifying each theft as survival. Now he roams the roads, half-bandit, half-warrior, telling himself that when the plague ends, he will be honorable again. But some stains never wash clean.',
            stats: {
                plagueResistance: 25,
                faith: 15,
                strength: 85,
                cunning: 60
            },
            skills: ['⚔ Combat', '😱 Intimidation', '🧠 Tactics', '🐴 Horsemanship'],
            bonds: [
                { icon: '⚡', text: 'Robbed ', name: 'Alaric von Strass', suffix: ' twice already' },
                { icon: '🔥', text: 'Burned ', name: 'Morwen Blackthorn\'s', suffix: ' herb garden' },
                { icon: '🤝', text: 'Grudgingly respects ', name: 'Wulfric the Unbowed' }
            ]
        },
        finn: {
            name: 'Finn the Rat',
            title: 'Plague Beggar & Street Urchin',
            quote: '"You want to survive? Become invisible."',
            class: 'laborer',
            classLabel: 'Laborer',
            moral: 'neutral',
            moralLabel: 'Neutral',
            symbol: '🐀',
            backstory: 'Finn has no surname, no family, no memory of anything before the streets. He was born in the shadow of the cathedral and has lived his short life in its gutters and alleys. When the plague came, it killed the other beggars and left Finn untouched — perhaps because he was already so filthy that the pestilence mistook him for one of its own. Now he moves through the dead city like a ghost, stealing food, picking locks, and sleeping in abandoned houses. He trusts no one and owes nothing.',
            stats: {
                plagueResistance: 80,
                faith: 5,
                strength: 25,
                cunning: 90
            },
            skills: ['👁 Stealth', '🔓 Lockpicking', '🔥 Survival', '🗣 Streetwise'],
            bonds: [
                { icon: '👀', text: 'Watched by ', name: 'Morwen Blackthorn', suffix: ' with strange interest' },
                { icon: '💀', text: 'Steals from ', name: 'Father Anselm\'s', suffix: ' church stores' },
                { icon: '🙏', text: 'Secretly brings food to ', name: 'Elena the Ashen' }
            ]
        },
        anselm: {
            name: 'Father Anselm',
            title: 'Corrupt Parish Priest',
            quote: '"God demands sacrifice. Preferably someone else\'s."',
            class: 'holy',
            classLabel: 'Holy',
            moral: 'corrupt',
            moralLabel: 'Corrupt',
            symbol: '📿',
            backstory: 'Father Anselm was never a man of genuine faith — the priesthood was simply the easiest path to respect and comfort for a clever peasant\'s son. He skimmed from the collection plate, sold indulgences at scandalous prices, and kept a mistress in the next village. When the plague came, he saw opportunity in the fear: for the right price, he would grant last rites and pray for salvation. Those who could not pay received nothing. His church is now a vault of stolen wealth, and his soul is a thing he sold long ago.',
            stats: {
                plagueResistance: 15,
                faith: 30,
                strength: 20,
                cunning: 75
            },
            skills: ['🗣 Persuasion', '📚 Lore', '🎭 Manipulation', '💰 Greed'],
            bonds: [
                { icon: '😤', text: 'Hated by ', name: 'Brother Aldric', suffix: ' as a false priest' },
                { icon: '💰', text: 'Extorts ', name: 'Alaric von Strass', suffix: ' for "blessings"' },
                { icon: '⚖️', text: 'Fears ', name: 'Isabel of Rouen\'s', suffix: ' genuine holiness' }
            ]
        },
        brigitta: {
            name: 'Brigitta of Prague',
            title: 'Widowed Midwife',
            quote: '"I\'ve brought life into a world of death. That has to count for something."',
            class: 'laborer',
            classLabel: 'Laborer',
            moral: 'righteous',
            moralLabel: 'Righteous',
            symbol: '👶',
            backstory: 'Brigitta delivered babies for fifteen years in Prague, her skilled hands bringing new life into the world with steady confidence. When the plague took her husband and two of her three children, she fled the city with her surviving daughter, seeking somewhere the pestilence had not yet reached. She found no such place. Now she continues her work wherever she stops — helping the pregnant, nursing the sick, and holding her daughter close at night, praying that the plague will pass them by.',
            stats: {
                plagueResistance: 55,
                faith: 60,
                strength: 45,
                cunning: 50
            },
            skills: ['🌿 Herbalism', '💚 Healing', '❤ Empathy', '👶 Midwifery'],
            bonds: [
                { icon: '🌿', text: 'Studies under ', name: 'Isabel of Rouen' },
                { icon: '💪', text: 'Protected by ', name: 'Wulfric the Unbowed', suffix: ' when traveling' },
                { icon: '😔', text: 'Pities ', name: 'Finn the Rat\'s', suffix: ' lonely existence' }
            ]
        },
        alaric: {
            name: 'Alaric von Strass',
            title: 'Dissolute Merchant Lord',
            quote: '"Everything has a price. Even the plague."',
            class: 'noble',
            classLabel: 'Noble',
            moral: 'corrupt',
            moralLabel: 'Corrupt',
            symbol: '♛',
            backstory: 'Alaric was once the wealthiest merchant in Strass, his caravans stretching from Venice to Flanders. When the plague came, he sealed his manor, burned his servants\' quarters to prevent infection from spreading, and watched from his tower as the city died below. He emerged months later to find his wealth intact but his world destroyed. Now he travels with a wagon of goods, trading with survivors and hoarding supplies. He sees the plague not as a tragedy but as a market correction — fewer mouths to feed means higher prices.',
            stats: {
                plagueResistance: 20,
                faith: 10,
                strength: 30,
                cunning: 80
            },
            skills: ['💰 Bartering', '🗣 Persuasion', '🧭 Navigation', '📊 Accounting'],
            bonds: [
                { icon: '⚔️', text: 'Robbed repeatedly by ', name: 'Sir Cedric Blackmoor' },
                { icon: '📿', text: 'Bribes ', name: 'Father Anselm', suffix: ' for protection' },
                { icon: '💊', text: 'Sells medicine from ', name: 'Godfrey the Leech', suffix: ' at markup' }
            ]
        },
        elena: {
            name: 'Elena the Ashen',
            title: 'Plague Survivor & Wanderer',
            quote: '"I survived the sickness. Now I carry its fire in my blood."',
            class: 'outcast',
            classLabel: 'Outcast',
            moral: 'righteous',
            moralLabel: 'Righteous',
            symbol: '🔥',
            backstory: 'Elena is a miracle and a curse. She contracted the plague — the black buboes rose on her neck, the fever consumed her for seven days — and she lived. No one knows how. The superstitious call her a saint; the fearful call her a carrier of pestilence. Her skin bears the ash-gray pallor of one who has stared into death\'s eyes and returned. She wanders from village to village, helping the sick where she is welcomed and fleeing the torches where she is not. Her immunity is a gift she cannot share and a burden she cannot escape.',
            stats: {
                plagueResistance: 90,
                faith: 5,
                strength: 40,
                cunning: 65
            },
            skills: ['💚 Healing', '🔥 Survival', '🌿 Herbalism', '🏃 Evasion'],
            bonds: [
                { icon: '🙏', text: 'Pitied by ', name: 'Isabel of Rouen', suffix: ' who sees her as chosen' },
                { icon: '🐀', text: 'Fed secretly by ', name: 'Finn the Rat' },
                { icon: '🌿', text: 'Sought out by ', name: 'Morwen Blackthorn', suffix: ' for study' }
            ]
        },
        wulfric: {
            name: 'Wulfric the Unbowed',
            title: 'Mercenary Veteran',
            quote: '"I\'ve fought men and beasts. The plague is just another enemy."',
            class: 'warrior',
            classLabel: 'Warrior',
            moral: 'neutral',
            moralLabel: 'Neutral',
            symbol: '🛡',
            backstory: 'Wulfric has fought in three wars, two border disputes, and countless skirmishes across the continent. He is old for a soldier, scarred and weathered, but his blade-arm is still strong and his instincts sharp. When the plague ended the last war he was fighting, he simply kept walking, looking for the next battle. The plague cannot be fought with steel, but there are always bandits, desperate men, and predators who see the end times as license. Wulfric offers his sword to those who can pay — or to those who remind him of the family he lost.',
            stats: {
                plagueResistance: 40,
                faith: 35,
                strength: 90,
                cunning: 55
            },
            skills: ['⚔ Combat', '🔥 Survival', '👑 Leadership', '🗺 Wayfinding'],
            bonds: [
                { icon: '🍺', text: 'Drinks in silence with ', name: 'Petra Ashenmaw' },
                { icon: '🛡', text: 'Protects ', name: 'Brigitta of Prague', suffix: ' and her daughter' },
                { icon: '😤', text: 'Sworn to defeat ', name: 'Sir Cedric Blackmoor', suffix: ' one day' }
            ]
        }
    };

    // ─────────── DOM REFERENCES ───────────
    const loadingScreen = document.getElementById('loading-screen');
    const pageWrapper = document.getElementById('page');
    const particlesContainer = document.getElementById('particles');
    const characterGrid = document.getElementById('character-grid');
    const emptyState = document.getElementById('empty-state');
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    
    // Modal content elements
    const modalSymbol = document.getElementById('modal-symbol');
    const modalName = document.getElementById('modal-name');
    const modalTitle = document.getElementById('modal-title');
    const modalClassBadge = document.getElementById('modal-class-badge');
    const modalMoralBadge = document.getElementById('modal-moral-badge');
    const modalQuote = document.getElementById('modal-quote');
    const modalBackstory = document.getElementById('modal-backstory');
    const modalStats = document.getElementById('modal-stats');
    const modalSkills = document.getElementById('modal-skills');
    const modalBonds = document.getElementById('modal-bonds');

    // ─────────── FILTER STATE ───────────
    let activeFilters = {
        class: 'all',
        moral: 'all'
    };

    // ─────────── LOADING SCREEN ───────────
    function initLoadingScreen() {
        // Simulate loading time for dramatic effect
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            pageWrapper.classList.add('visible');
            initParticles();
            initScrollAnimations();
        }, 2500);
    }

    // ─────────── PARTICLE SYSTEM ───────────
    function initParticles() {
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(i);
        }
    }

    function createParticle(index) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning and timing
        const startX = Math.random() * 100;
        const size = 1 + Math.random() * 3;
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 15;
        
        particle.style.left = `${startX}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Vary particle appearance
        if (Math.random() > 0.7) {
            particle.style.background = 'var(--red-dark)';
        } else if (Math.random() > 0.5) {
            particle.style.background = 'var(--gold)';
        }
        
        particlesContainer.appendChild(particle);
    }

    // ─────────── FILTER FUNCTIONALITY ───────────
    function initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterType = btn.dataset.type;
                const filterValue = btn.dataset.filter;
                
                // Update active state for buttons in this group
                const siblingBtns = btn.parentElement.querySelectorAll('.filter-btn');
                siblingBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update filter state
                activeFilters[filterType] = filterValue;
                
                // Apply filters
                applyFilters();
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.character-card');
        let visibleCount = 0;
        
        cards.forEach((card, index) => {
            const cardClass = card.dataset.class;
            const cardMoral = card.dataset.moral;
            
            const classMatch = activeFilters.class === 'all' || cardClass === activeFilters.class;
            const moralMatch = activeFilters.moral === 'all' || cardMoral === activeFilters.moral;
            
            if (classMatch && moralMatch) {
                card.classList.remove('hidden');
                card.style.animationDelay = `${visibleCount * 0.05}s`;
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Show/hide empty state
        if (visibleCount === 0) {
            emptyState.hidden = false;
        } else {
            emptyState.hidden = true;
        }
    }

    // ─────────── CHARACTER CARD INTERACTIONS ───────────
    function initCardInteractions() {
        const cards = document.querySelectorAll('.character-card');
        
        cards.forEach(card => {
            // Click to open modal
            card.addEventListener('click', () => {
                const characterId = card.dataset.id;
                openModal(characterId);
            });
            
            // Keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const characterId = card.dataset.id;
                    openModal(characterId);
                }
            });
            
            // Tilt effect on hover
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ─────────── MODAL FUNCTIONALITY ───────────
    function openModal(characterId) {
        const data = characterData[characterId];
        if (!data) return;
        
        // Populate modal content
        modalSymbol.textContent = data.symbol;
        modalName.textContent = data.name;
        modalTitle.textContent = data.title;
        modalClassBadge.textContent = data.classLabel;
        modalMoralBadge.textContent = `✦ ${data.moralLabel}`;
        modalMoralBadge.dataset.moral = data.moral;
        modalQuote.textContent = data.quote;
        modalBackstory.textContent = data.backstory;
        
        // Populate stats
        modalStats.innerHTML = '';
        const statLabels = {
            plagueResistance: { icon: '🦠', label: 'Plague Resistance' },
            faith: { icon: '✝️', label: 'Faith' },
            strength: { icon: '💪', label: 'Strength' },
            cunning: { icon: '🦊', label: 'Cunning' }
        };
        
        Object.entries(data.stats).forEach(([key, value]) => {
            const statInfo = statLabels[key];
            if (!statInfo) return;
            
            const statEl = document.createElement('div');
            statEl.classList.add('modal-stat');
            statEl.innerHTML = `
                <span class="modal-stat-icon">${statInfo.icon}</span>
                <span class="modal-stat-name">${statInfo.label}</span>
                <div class="modal-stat-bar">
                    <div class="modal-stat-fill" style="width: 0%;" data-target="${value}"></div>
                </div>
                <span class="modal-stat-val">${value}</span>
            `;
            modalStats.appendChild(statEl);
        });
        
        // Populate skills
        modalSkills.innerHTML = '';
        data.skills.forEach(skill => {
            const skillEl = document.createElement('span');
            skillEl.classList.add('modal-skill');
            skillEl.textContent = skill;
            modalSkills.appendChild(skillEl);
        });
        
        // Populate bonds
        modalBonds.innerHTML = '';
        data.bonds.forEach(bond => {
            const bondEl = document.createElement('div');
            bondEl.classList.add('modal-bond');
            bondEl.innerHTML = `
                <span class="modal-bond-icon">${bond.icon}</span>
                <span class="modal-bond-text">${bond.text}<span class="modal-bond-name">${bond.name}</span>${bond.suffix || ''}</span>
            `;
            modalBonds.appendChild(bondEl);
        });
        
        // Show modal
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Animate stat bars after modal opens
        setTimeout(() => {
            const statFills = modalStats.querySelectorAll('.modal-stat-fill');
            statFills.forEach(fill => {
                fill.style.width = fill.dataset.target + '%';
            });
        }, 300);
        
        // Focus management
        modalClose.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Reset stat bars for next open
        const statFills = modalStats.querySelectorAll('.modal-stat-fill');
        statFills.forEach(fill => {
            fill.style.width = '0%';
        });
    }

    function initModal() {
        // Close button
        modalClose.addEventListener('click', closeModal);
        
        // Click backdrop to close
        modalOverlay.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Trap focus within modal when open
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    // ─────────── SCROLL ANIMATIONS ───────────
    function initScrollAnimations() {
        // Intersection Observer for cards
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        const cards = document.querySelectorAll('.character-card');
        cards.forEach(card => {
            cardObserver.observe(card);
        });
    }

    // ─────────── AMBIENT EFFECTS ───────────
    function initAmbientEffects() {
        // Subtle parallax on header
        const header = document.querySelector('.site-header');
        const emblem = document.querySelector('.emblem-ring');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (header) {
                header.style.backgroundPositionY = `${scrollY * 0.3}px`;
            }
            
            if (emblem) {
                emblem.style.transform = `rotate(${scrollY * 0.05}deg)`;
            }
        });
        
        // Mouse-follow glow effect on page
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    // ─────────── CARD STAT BAR ANIMATIONS ───────────
    function initStatBarAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statFills = entry.target.querySelectorAll('.stat-fill');
                    statFills.forEach((fill, index) => {
                        setTimeout(() => {
                            fill.style.width = fill.style.getPropertyValue('--stat-val');
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        const cards = document.querySelectorAll('.character-card');
        cards.forEach(card => observer.observe(card));
    }

    // ─────────── CURSOR TRAIL EFFECT ───────────
    function initCursorTrail() {
        const trail = [];
        const trailLength = 5;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                width: ${4 - i * 0.5}px;
                height: ${4 - i * 0.5}px;
                background: var(--gold);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${0.3 - i * 0.05};
                transition: transform ${0.1 + i * 0.05}s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }
        
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateTrail() {
            let x = mouseX;
            let y = mouseY;
            
            trail.forEach((dot, index) => {
                const nextX = x;
                const nextY = y;
                
                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;
                
                // Get current position for next dot
                x += (mouseX - x) * 0.3;
                y += (mouseY - y) * 0.3;
            });
            
            requestAnimationFrame(animateTrail);
        }
        
        animateTrail();
    }

    // ─────────── INITIALIZE ───────────
    function init() {
        initLoadingScreen();
        initFilters();
        initCardInteractions();
        initModal();
        initAmbientEffects();
        initStatBarAnimations();
        initCursorTrail();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();