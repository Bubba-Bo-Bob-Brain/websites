/**
 * MEMENTO MORI — JavaScript Module
 * Handles atmospheric effects, animations, modal interactions,
 * and dynamic content rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    initAtmosphere();
    initScrollObserver();
    initModalSystem();
    initCardInteractions();
});

// ==========================================
// 1. Atmospheric Particle System (Embers)
// ==========================================
function initAtmosphere() {
    const container = document.getElementById('ember-container');
    if (!container) return;

    const emberCount = 30;
    
    // Create embers
    for (let i = 0; i < emberCount; i++) {
        createEmber(container, i);
    }

    function createEmber(parent, index) {
        const ember = document.createElement('div');
        ember.classList.add('ember-particle');
        
        // Randomize properties
        const size = Math.random() * 3 + 1; // 1px to 4px
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 5 + 8; // 8s to 13s
        const hue = Math.random() > 0.5 ? '30' : '15'; // Orange/Red hues
        
        // Styling
        ember.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            bottom: -10px;
            background: radial-gradient(circle, hsl(${hue}, 100%, 60%) 0%, hsl(${hue}, 100%, 40%) 60%, transparent 100%);
            border-radius: 50%;
            opacity: 0;
            pointer-events: none;
            animation: floatUp ${duration}s linear infinite;
            animation-delay: ${delay}s;
            box-shadow: 0 0 ${size * 2}px hsl(${hue}, 100%, 50%);
        `;
        
        parent.appendChild(ember);
    }

    // Inject keyframes dynamically since we can't edit CSS file in this step
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.8; }
            50% { opacity: 0.5; transform: translateY(-40vh) translateX(${Math.random() > 0.5 ? '' : '-'}20px); }
            90% { opacity: 0.1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}40px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// 2. Scroll Observer & Stat Animations
// ==========================================
function initScrollObserver() {
    const cards = document.querySelectorAll('.character-card');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const index = Array.from(card.parentNode.children).indexOf(card);
                
                // Staggered reveal
                card.style.setProperty('--index', index);
                card.classList.add('card-visible');
                
                // Animate stat bars inside this card
                animateStats(card);
                
                // Stop observing once revealed
                observer.unobserve(card);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
}

function animateStats(card) {
    const fills = card.querySelectorAll('.stat-fill');
    fills.forEach(fill => {
        const targetValue = fill.getAttribute('data-value');
        // Reset width to 0 for animation effect
        fill.style.width = '0%';
        // Force reflow
        void fill.offsetWidth;
        // Set target width
        fill.style.width = targetValue + '%';
    });
}

// ==========================================
// 3. Modal System
// ==========================================
function initModalSystem() {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('character-modal');
    const content = document.getElementById('modal-content');
    const closeBtn = document.getElementById('modal-close');

    // Data store for rich modal content
    const loreData = {
        'marguerite': {
            lore: "Sister Marguerite has tended to the dying since the pestilence first arrived in Marseille. Her hands, stained with blood and herbs, have closed the eyes of hundreds. Yet, she has not faltered. Rumors whisper that the Black Death itself hesitates to claim her, repelled by an unseen light that surrounds her humble cot.",
            skills: ["Advanced Triage", "Sanctuary Blessing", "Palliative Care"]
        },
        'thomas': {
            lore: "Brother Thomas believes the plague is divine judgment. He spends his nights copying texts by candlelight, preserving knowledge he believes the world is forgetting. His mind is a fortress of ancient lore, though his body grows frail with each passing winter.",
            skills: ["Ancient Languages", "Theological Debate", "Archive Navigation"]
        },
        'alaric': {
            lore: "Alaric's forge is the only warm place left in the village. He hammers iron into plowshares and spearheads with equal fury. He has lost his brother to the sickness, and now fights with the desperation of a man who has nothing left to lose but his honor.",
            skills: ["Weapon Crafting", "Siege Defense", "Metalwork"]
        },
        'elara': {
            lore: "They call her witch, but she is merely a woman who remembers the old ways. Elara walks the forbidden woods gathering wolfsbane and nightshade. The church condemns her, but the sick come to her door when the prayers of the priests fail.",
            skills: ["Poison Craft", "Forest Lore", "Spirit Medium"]
        },
        'godfrey': {
            lore: "Once a knight of the realm, Godfrey was stripped of his lands after refusing an order to burn a plague village. Now a wanderer, his sword is his only companion. He seeks redemption in a world that has forgotten the meaning of chivalry.",
            skills: ["Swordsmanship", "Tactical Command", "Intimidation"]
        },
        'beatrice': {
            lore: "Widow Beatrice has buried two husbands and three children. Her grief has hardened into a fierce determination to keep the survivors fed. Her garden is a miracle of green in a brown world, protected by thorns and prayer.",
            skills: ["Agriculture", "Food Preservation", "Herbal Tea"]
        },
        'magnus': {
            lore: "Dr. Magnus traveled from Basel with a theory: the plague is not caused by bad air, but by tiny creatures too small to see. He is mocked by his peers, yet his survival rate is the highest. His beaked mask hides a face scarred by his own experiments.",
            skills: ["Surgery", "Anatomy", "Chemical Synthesis"]
        },
        'isabeau': {
            lore: "Isabeau's caravan has crossed borders that no longer exist. She trades in secrets as readily as silk. Her network of informants stretches from Paris to Prague, making her the most dangerous woman in Europe—provided you can pay her price.",
            skills: ["Appraisal", "Smuggling", "Diplomacy"]
        },
        'cedric': {
            lore: "Cedric speaks more to the forest than to people. An expert fletcher, he supplies arrows to the remnants of the royal guard. He claims the trees whisper warnings of danger, and so far, the forest has never lied to him.",
            skills: ["Archery", "Tracking", "Trap Setting"]
        },
        'seraphina': {
            lore: "Seraphina sings the names of the dead so they are not forgotten. Her voice carries across the empty squares, a haunting melody that brings both tears and courage. She carries a lute carved from the wood of a church pew.",
            skills: ["Morale Boost", "History", "Performance"]
        },
        'roderick': {
            lore: "Roderick has dug more graves than he can count. He moves through the city like a ghost, unbothered by the horrors that drive others mad. He knows the catacombs better than any priest, and sometimes, he is seen talking to the corpses.",
            skills: ["Burial Rites", "Underground Navigation", "Corpse Handling"]
        },
        'johanna': {
            lore: "Little Johanna was found hiding in a bell tower, the sole survivor of a decimated family. She speaks rarely, but her eyes miss nothing. She has an uncanny ability to find safe paths through the chaos, as if guided by angels.",
            skills: ["Stealth", "Lockpicking", "Alertness"]
        }
    };

    function openModal(card) {
        const charName = card.querySelector('.char-name').textContent;
        const charRole = card.querySelector('.char-role').textContent;
        const charKey = card.dataset.character;
        const stats = card.querySelectorAll('.stat-row');
        const details = card.querySelector('.char-details').innerHTML;
        
        // Get rich data
        const data = loreData[charKey] || { lore: "No records found for this soul.", skills: ["Unknown"] };
        
        // Build Modal HTML
        const statsHTML = Array.from(stats).map(stat => {
            const label = stat.querySelector('.stat-label').textContent.trim();
            const value = stat.querySelector('.stat-value').textContent.trim();
            return `
                <div class="modal-stat-row">
                    <span>${label}</span>
                    <span class="modal-stat-val">${value}</span>
                </div>
            `;
        }).join('');

        const skillsHTML = data.skills.map(s => `<span class="modal-skill-tag">${s}</span>`).join('');

        content.innerHTML = `
            <div class="modal-header">
                <div class="modal-icon">${card.querySelector('.placeholder-icon').textContent}</div>
                <div>
                    <h2 class="modal-title">${charName}</h2>
                    <p class="modal-subtitle">${charRole}</p>
                </div>
            </div>
            
            <div class="modal-body">
                <section class="modal-section">
                    <h3>📜 Chronicle</h3>
                    <p class="modal-lore">${data.lore}</p>
                </section>
                
                <section class="modal-section">
                    <h3>📊 Attributes</h3>
                    <div class="modal-stats-grid">
                        ${statsHTML}
                    </div>
                </section>

                <section class="modal-section">
                    <h3>✨ Proficiencies</h3>
                    <div class="modal-skills">
                        ${skillsHTML}
                    </div>
                </section>

                <section class="modal-section">
                    <h3>🤝 Bonds & Alignment</h3>
                    <div class="modal-bonds">
                        ${details}
                    </div>
                </section>
            </div>
        `;

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        // Clear content after animation
        setTimeout(() => {
            content.innerHTML = '';
        }, 300);
    }

    // Event Listeners
    document.getElementById('gallery-grid').addEventListener('click', (e) => {
        const card = e.target.closest('.character-card');
        if (card) openModal(card);
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// ==========================================
// 4. Card Interactions (3D Tilt)
// ==========================================
function initCardInteractions() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Rotation intensity
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
}

// ==========================================
// 5. CSS Injection for Modal Specifics
// ==========================================
// Since we cannot edit styles.css in this step, we inject necessary modal styles here.
(function injectModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Modal Specific Styles */
        .modal-header {
            display: flex;
            align-items: center;
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-xl);
            border-bottom: 2px solid var(--gold-faint);
            padding-bottom: var(--spacing-lg);
        }

        .modal-icon {
            font-size: 4rem;
            background: var(--parchment);
            width: 100px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--gold-dim);
            border-radius: var(--radius-sm);
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }

        .modal-title {
            font-family: var(--font-display);
            font-size: 2.5rem;
            color: var(--gold);
            margin-bottom: var(--spacing-xs);
        }

        .modal-subtitle {
            font-family: var(--font-heading);
            font-size: 1.2rem;
            color: var(--bone-faint);
            letter-spacing: 0.1em;
        }

        .modal-section {
            margin-bottom: var(--spacing-xl);
        }

        .modal-section h3 {
            font-family: var(--font-heading);
            color: var(--blood-light);
            font-size: 1.4rem;
            margin-bottom: var(--spacing-md);
            border-left: 4px solid var(--gold);
            padding-left: var(--spacing-sm);
        }

        .modal-lore {
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--bone);
            font-style: italic;
        }

        .modal-stats-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
        }

        .modal-stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-sm) var(--spacing-md);
            background: rgba(42, 34, 24, 0.5);
            border-radius: var(--radius-sm);
            border: 1px solid rgba(184, 134, 11, 0.1);
            font-family: var(--font-heading);
            font-size: 1.1rem;
        }

        .modal-stat-val {
            color: var(--gold);
            font-weight: bold;
        }

        .modal-skills {
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-sm);
        }

        .modal-skill-tag {
            background: var(--blood);
            color: var(--bone);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-family: var(--font-body);
            border: 1px solid var(--blood-light);
        }

        .modal-bonds {
            padding: var(--spacing-md);
            background: rgba(0, 0, 0, 0.2);
            border-radius: var(--radius-sm);
        }
        
        .modal-bonds .detail-row {
            margin-bottom: var(--spacing-sm);
            font-size: 1rem;
        }

        .modal-bonds .detail-label {
            color: var(--bone);
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
})();