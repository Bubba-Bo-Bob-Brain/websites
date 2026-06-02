// scripts.js
// Slavic Woodland Bestiary - Interactive Scripts

// ===== CREATURE DATA =====
const creatures = [
    {
        id: 1,
        name: "Leshy",
        danger: 3,
        category: "forest",
        lore: "Lord of the Forest. Shapeshifter, protector of woodland creatures. Leads travelers astray with echoes and illusions.",
        description: "The Leshy (Леший) is a spirit guardian of the forest, often depicted as a tall man with a beard of vines, glowing green eyes, and clothes of foliage. His height changes with the trees. He is neither good nor evil, but protects his domain fiercely. To appease him, one must offer bread and salt.",
        warding: [
            "Wear your clothes inside-out.",
            "Carry a knot of birch twigs.",
            "Do not whistle in the forest."
        ],
        attributes: ["Deep Forest", "Nocturnal", "Master of Beasts"],
        symbol: "🌲",
        illustration: "tree"
    },
    {
        id: 2,
        name: "Rusalka",
        danger: 4,
        category: "water",
        lore: "Spirit of drowned women. Lures men to watery graves with enchanting songs. Most active during Rusalnaya Week.",
        description: "Rusalki (Русалки) are water nymphs or female spirits that inhabit rivers, lakes, and ponds. They appear as beautiful young women with pale skin and long green hair, but their feet are webbed or resemble a goose's. They are the souls of women who died unnatural deaths near water.",
        warding: [
            "Avoid water bodies during Rusalnaya Week (after Pentecost).",
            "Carry a cross made of birch wood.",
            "Do not bathe alone at night."
        ],
        attributes: ["Freshwater", "Enchanting Song", "Vengeful Spirit"],
        symbol: "🌊",
        illustration: "water"
    },
    {
        id: 3,
        name: "Baba Yaga",
        danger: 3,
        category: "forest",
        lore: "Ambiguous witch of the woods. Dwells in a hut on chicken legs. May help or hinder seekers of wisdom.",
        description: "Baba Yaga (Баба-Яга) is a supernatural being who appears as a deformed or ferocious-looking old woman. She flies in a mortar, using the pestle as a rudder and sweeps away her tracks with a broom. She lives in a hut that stands on chicken legs and can rotate to face visitors.",
        warding: [
            "Be polite and use the correct formal address.",
            "Bring her a gift of food or precious item.",
            "Answer her riddles truthfully."
        ],
        attributes: ["Hut on Chicken Legs", "Flies in Mortar", "Keeper of Secrets"],
        symbol: "🛖",
        illustration: "house"
    },
    {
        id: 4,
        name: "Zmey",
        danger: 4,
        category: "field",
        lore: "Three-headed dragon or serpent. Guards treasure, kidnaps maidens. Breathes fire and commands storms.",
        description: "The Zmey (Змей) is a dragon-like creature with three or more heads, each capable of regenerating if cut off. They are often depicted as guardians of great treasures or as abductors of beautiful women. Some tales speak of benevolent Zmeys who protect villages.",
        warding: [
            "Use a magic sword or arrow to strike between scales.",
            "Seek help from a bogatyr (epic hero).",
            "Appeal to its honor with a challenge."
        ],
        attributes: ["Three-Headed", "Fire Breath", "Treasure Guardian"],
        symbol: "🐉",
        illustration: "dragon"
    },
    {
        id: 5,
        name: "Domovoy",
        danger: 1,
        category: "home",
        lore: "Household spirit. Protects the home and family. Becomes mischievous if disrespected.",
        description: "The Domovoy (Домовой) is a household spirit that lives behind the stove or under the threshold. He appears as a small, bearded old man covered in hair. He protects the home and family but can become a nuisance if angered by a messy house or disrespect.",
        warding: [
            "Leave a bowl of milk or bread crusts at night.",
            "Never swear or argue loudly in the house.",
            "Give him a name and speak to him respectfully."
        ],
        attributes: ["Household Protector", "Invisible Helper", "Attached to Family"],
        symbol: "🏠",
        illustration: "home"
    },
    {
        id: 6,
        name: "Vodyanoy",
        danger: 4,
        category: "water",
        lore: "Male water spirit. Drowns swimmers and millers. Appears as an old man with frog-like features.",
        description: "The Vodyanoy (Водяной) is a male water spirit who rules over bodies of water. He appears as an old man with a long green beard, webbed hands, and a body covered in algae and muck. He is known to drown people and animals who disrespect his domain.",
        warding: [
            "Avoid swimming at noon or midnight.",
            "Throw a pinch of tobacco into the water before crossing.",
            "Never boast about your swimming ability near water."
        ],
        attributes: ["Master of Waters", "Drowns Victims", "Green Beard"],
        symbol: "🐸",
        illustration: "frog"
    },
    {
        id: 7,
        name: "Kikimora",
        danger: 2,
        category: "home",
        lore: "Female house spirit. Causes nightmares and messes. Haunts neglected households.",
        description: "Kikimora (Кикимора) is a female house spirit who inhabits houses, particularly behind the stove or in the cellar. She appears as a small, hunched woman with messy hair. She causes nightmares, tangles yarn, and creates messes to punish lazy housekeepers.",
        warding: [
            "Keep the house clean and tidy.",
            "Hang a charm of ferns above the doorway.",
            "Offer her a small doll or handmade item."
        ],
        attributes: ["Nightmare Weaver", "Mess Creator", "Punishes Laziness"],
        symbol: "🧵",
        illustration: "spider"
    },
    {
        id: 8,
        name: "Bannik",
        danger: 2,
        category: "home",
        lore: "Bathhouse spirit. Inhabits the banya. Can burn or heal depending on respect shown.",
        description: "The Bannik (Банник) is a spirit that inhabits the bathhouse (banya). He appears as a small, naked old man with a long beard. He can burn disrespectful bathers with steam or heal those who treat him properly. He demands the fourth bath for himself.",
        warding: [
            "Leave the fourth bathing session for the Bannik.",
            "Bring a loaf of bread and salt as offering.",
            "Never bathe alone after midnight."
        ],
        attributes: ["Bathhouse Spirit", "Controls Steam", "Healer or Tormentor"],
        symbol: "♨️",
        illustration: "fire"
    },
    {
        id: 9,
        name: "Poludnitsa",
        danger: 3,
        category: "field",
        lore: "Noon spirit. Appears as a beautiful woman in white. Punishes those working in fields at midday.",
        description: "Poludnitsa (Пoлyдница) is a field spirit who appears as a tall, beautiful woman dressed in white. She appears at noon to anyone working in the fields during the hottest part of the day. She asks difficult riddles and may strike those who fail with heatstroke or madness.",
        warding: [
            "Rest during the noon hour (12-1 PM).",
            "Carry a sprig of wormwood.",
            "Answer her riddles with humility."
        ],
        attributes: ["Noon Apparition", "Riddle Master", "Heatstroke Bringer"],
        symbol: "☀️",
        illustration: "sun"
    },
    {
        id: 10,
        name: "Likho",
        danger: 4,
        category: "forest",
        lore: "Embodiment of misfortune and evil fate. One-eyed giant that brings ruin.",
        description: "Likho (Лихо) is the personification of evil fate and misfortune. It appears as a tall, thin, one-eyed giant or an ugly old woman. Likho attaches itself to a person and brings endless misfortune. In some tales, it can be tricked but never fully defeated.",
        warding: [
            "Do not complain about your fate aloud.",
            "Carry a protective amulet with concentric circles.",
            "Avoid crossroads at midnight."
        ],
        attributes: ["One-Eyed", "Bringer of Misfortune", "Difficult to Shake"],
        symbol: "👁️",
        illustration: "eye"
    }
];

// ===== DANGER LEVEL CONFIGURATION =====
const dangerConfig = {
    1: { text: "Benevolent / Mischievous", icon: "ᛉ", color: "var(--color-forest-mid)" },
    2: { text: "Cautious Encounter", icon: "Ⱆ", color: "var(--color-gold)" },
    3: { text: "Dangerous", icon: "ꙮ", color: "var(--color-ember)" },
    4: { text: "Deadly / Cursed", icon: "☠", color: "var(--color-leather)" }
};

// ===== CATEGORY CONFIGURATION =====
const categoryConfig = {
    forest: { name: "Forest", icon: "fas fa-forest" },
    water: { name: "Water", icon: "fas fa-water" },
    home: { name: "Home & Hearth", icon: "fas fa-home" },
    field: { name: "Field & Sky", icon: "fas fa-sun" }
};

// ===== DOM ELEMENTS =====
const creatureCardsContainer = document.querySelector('.creature-cards-container');
const indexList = document.getElementById('indexList');
const dangerFilter = document.getElementById('dangerFilter');
const categoryFilter = document.getElementById('categoryFilter');
const resetFiltersBtn = document.getElementById('resetFilters');

// ===== UTILITY FUNCTIONS =====
function getIllustrationIcon(illustration) {
    const iconMap = {
        tree: "fas fa-tree",
        water: "fas fa-water",
        house: "fas fa-house",
        dragon: "fas fa-dragon",
        home: "fas fa-home-heart",
        frog: "fas fa-frog",
        spider: "fas fa-spider",
        fire: "fas fa-fire",
        sun: "fas fa-sun",
        eye: "fas fa-eye"
    };
    return iconMap[illustration] || "fas fa-question";
}

function createWoodcutPattern() {
    // Create a dynamic woodcut pattern for illustration placeholders
    const patterns = [
        "M10,10 Q30,5 50,10 Q30,15 10,10 M30,30 Q50,25 70,30 Q50,35 30,30",
        "M5,5 L15,25 L25,5 L35,25 L45,5",
        "M10,40 Q25,10 40,40 Q25,70 10,40",
        "M20,20 L40,40 M20,40 L40,20",
        "M15,15 Q30,5 45,15 Q30,25 15,15"
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
}

// ===== RENDER CREATURE CARD =====
function renderCreatureCard(creature) {
    const danger = dangerConfig[creature.danger];
    const category = categoryConfig[creature.category];
    
    const card = document.createElement('article');
    card.className = 'creature-card';
    card.dataset.danger = creature.danger;
    card.dataset.category = creature.category;
    card.dataset.id = creature.id;
    
    // Generate woodcut pattern for this card's illustration
    const woodcutPattern = createWoodcutPattern();
    
    card.innerHTML = `
        <div class="woodcut-border">
            <div class="card-header">
                <h3 class="creature-name">${creature.name}</h3>
                <div class="creature-danger">
                    <span class="danger-icon">${danger.icon}</span>
                    <span class="danger-text">${danger.text}</span>
                </div>
            </div>
            <div class="card-illustration">
                <div class="illustration-placeholder">
                    <i class="${getIllustrationIcon(creature.illustration)}"></i>
                    <div class="woodcut-svg">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <path d="${woodcutPattern}" fill="none" stroke="var(--color-leather-light)" stroke-width="1" opacity="0.3"/>
                        </svg>
                    </div>
                    <p>Woodcut Illustration</p>
                </div>
            </div>
            <div class="card-details">
                <p class="creature-lore"><strong>${creature.lore}</strong></p>
                <div class="creature-attributes">
                    ${creature.attributes.map(attr => `
                        <span class="attribute"><i class="${category.icon}"></i> ${attr}</span>
                    `).join('')}
                </div>
            </div>
            <button class="expand-btn">Unfold Lore <i class="fas fa-chevron-down"></i></button>
            <div class="expanded-content">
                <h4>Detailed Account</h4>
                <p>${creature.description}</p>
                <h4>Warding Signs</h4>
                <ul>
                    ${creature.warding.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <div class="creature-meta">
                    <span class="meta-item"><i class="fas ${category.icon}"></i> ${category.name}</span>
                    <span class="meta-item"><i class="fas ${getIllustrationIcon(creature.illustration)}"></i> ${creature.symbol}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// ===== RENDER INDEX LIST =====
function renderIndexList() {
    indexList.innerHTML = '';
    
    creatures.forEach(creature => {
        const listItem = document.createElement('li');
        const danger = dangerConfig[creature.danger];
        
        listItem.innerHTML = `
            <a href="#creature-${creature.id}" class="index-link" data-id="${creature.id}">
                <span class="index-name">${creature.name}</span>
                <span class="index-danger">${danger.icon}</span>
            </a>
        `;
        
        indexList.appendChild(listItem);
    });
    
    // Add click handlers to index links
    document.querySelectorAll('.index-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = parseInt(this.dataset.id);
            scrollToCreature(id);
        });
    });
}

// ===== FILTER CREATURES =====
function filterCreatures() {
    const selectedDanger = dangerFilter.value;
    const selectedCategory = categoryFilter.value;
    
    const filteredCreatures = creatures.filter(creature => {
        const dangerMatch = selectedDanger === 'all' || creature.danger.toString() === selectedDanger;
        const categoryMatch = selectedCategory === 'all' || creature.category === selectedCategory;
        return dangerMatch && categoryMatch;
    });
    
    renderCreatureCards(filteredCreatures);
    updateActiveFilters();
}

function renderCreatureCards(creaturesArray) {
    creatureCardsContainer.innerHTML = '';
    
    if (creaturesArray.length === 0) {
        creatureCardsContainer.innerHTML = `
            <div class="no-results woodcut-frame">
                <h3><i class="fas fa-search"></i> No Entities Found</h3>
                <p>The forest reveals no creatures matching your search. Try different filters.</p>
                <div class="no-results-symbol">Ⱆ</div>
            </div>
        `;
        return;
    }
    
    creaturesArray.forEach(creature => {
        const card = renderCreatureCard(creature);
        creatureCardsContainer.appendChild(card);
    });
    
    // Reattach event listeners to expand buttons
    attachExpandListeners();
}

// ===== UPDATE ACTIVE FILTERS DISPLAY =====
function updateActiveFilters() {
    const activeFilters = [];
    
    if (dangerFilter.value !== 'all') {
        const dangerText = dangerFilter.options[dangerFilter.selectedIndex].text;
        activeFilters.push(`Threat: ${dangerText}`);
    }
    
    if (categoryFilter.value !== 'all') {
        const categoryText = categoryFilter.options[categoryFilter.selectedIndex].text;
        activeFilters.push(`Realm: ${categoryText}`);
    }
    
    // Could display active filters visually if desired
    // For now, we'll just update a data attribute
    document.querySelector('.filter-section').dataset.activeFilters = activeFilters.join(', ');
}

// ===== SCROLL TO CREATURE =====
function scrollToCreature(id) {
    const creatureCard = document.querySelector(`.creature-card[data-id="${id}"]`);
    if (creatureCard) {
        // Highlight the card temporarily
        creatureCard.classList.add('highlighted');
        setTimeout(() => creatureCard.classList.remove('highlighted'), 2000);
        
        // Scroll to the card
        creatureCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Expand the card automatically
        const expandBtn = creatureCard.querySelector('.expand-btn');
        const expandedContent = creatureCard.querySelector('.expanded-content');
        
        if (expandBtn && expandedContent && !expandedContent.classList.contains('active')) {
            expandBtn.click();
        }
    }
}

// ===== ATTACH EXPAND LISTENERS =====
function attachExpandListeners() {
    document.querySelectorAll('.expand-btn').forEach(button => {
        button.addEventListener('click', function() {
            const expandedContent = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            expandedContent.classList.toggle('active');
            
            if (expandedContent.classList.contains('active')) {
                this.innerHTML = 'Fold Lore <i class="fas fa-chevron-up"></i>';
                // Add a subtle animation effect
                expandedContent.style.opacity = '0';
                setTimeout(() => {
                    expandedContent.style.transition = 'opacity 0.3s ease';
                    expandedContent.style.opacity = '1';
                }, 10);
            } else {
                this.innerHTML = 'Unfold Lore <i class="fas fa-chevron-down"></i>';
            }
        });
    });
}

// ===== ADD HOVER EFFECTS TO CARDS =====
function addCardHoverEffects() {
    document.addEventListener('mouseover', function(e) {
        const card = e.target.closest('.creature-card');
        if (card) {
            const dangerLevel = card.dataset.danger;
            const glowColor = dangerConfig[dangerLevel]?.color || 'var(--color-ember)';
            
            // Add a temporary glow effect
            card.style.boxShadow = `0 0 20px ${glowColor}40`;
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        const card = e.target.closest('.creature-card');
        if (card) {
            card.style.boxShadow = '';
        }
    });
}

// ===== ADD AMBIENT SOUND EFFECTS (OPTIONAL) =====
function addAmbientEffects() {
    // Create subtle sound triggers on interaction
    document.querySelectorAll('.creature-card').forEach(card => {
        card.addEventListener('click', function() {
            // Could trigger a subtle sound effect here
            // For now, we'll just add a visual effect
            this.classList.add('card-clicked');
            setTimeout(() => this.classList.remove('card-clicked'), 300);
        });
    });
    
    // Add random forest sounds on page load
    setTimeout(() => {
        console.log('🌲 The forest whispers...');
    }, 1000);
}

// ===== INITIALIZE BESTIARY =====
function initBestiary() {
    // Render initial creature cards
    renderCreatureCards(creatures);
    
    // Render index list
    renderIndexList();
    
    // Attach event listeners
    dangerFilter.addEventListener('change', filterCreatures);
    categoryFilter.addEventListener('change', filterCreatures);
    resetFiltersBtn.addEventListener('click', () => {
        dangerFilter.value = 'all';
        categoryFilter.value = 'all';
        filterCreatures();
    });
    
    // Add expand listeners
    attachExpandListeners();
    
    // Add hover effects
    addCardHoverEffects();
    
    // Add ambient effects
    addAmbientEffects();
    
    // Add custom cursor effect for immersive experience
    document.addEventListener('mousemove', function(e) {
        const cursorGlow = document.querySelector('.cursor-glow');
        if (!cursorGlow) {
            const glow = document.createElement('div');
            glow.className = 'cursor-glow';
            document.body.appendChild(glow);
        }
        
        const glow = document.querySelector('.cursor-glow');
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
    
    // Initialize page with a subtle entrance animation
    document.body.classList.add('loaded');
    
    console.log('🦉 Slavic Woodland Bestiary initialized. ' + creatures.length + ' creatures loaded.');
}

// ===== ADD CUSTOM CSS FOR DYNAMIC EFFECTS =====
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cursor-glow {
            position: fixed;
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, rgba(196, 77, 26, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s;
        }
        
        .creature-card.highlighted .woodcut-border {
            animation: highlightPulse 2s ease;
            border-color: var(--color-ember);
        }
        
        .card-clicked .woodcut-border {
            transform: scale(0.98);
            transition: transform 0.3s;
        }
        
        @keyframes highlightPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(196, 77, 26, 0); }
            50% { box-shadow: 0 0 0 10px rgba(196, 77, 26, 0.3); }
        }
        
        .no-results {
            text-align: center;
            padding: var(--spacing-lg);
            grid-column: 1 / -1;
        }
        
        .no-results-symbol {
            font-size: 4rem;
            margin-top: var(--spacing-md);
            opacity: 0.5;
        }
        
        .creature-meta {
            display: flex;
            gap: var(--spacing-sm);
            margin-top: var(--spacing-sm);
            padding-top: var(--spacing-sm);
            border-top: 1px solid var(--color-birch-shadow);
        }
        
        .meta-item {
            background-color: rgba(184, 154, 103, 0.1);
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.85rem;
            color: var(--color-leather);
            border: 1px solid rgba(184, 154, 103, 0.3);
        }
        
        .index-link {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .index-danger {
            font-size: 1.2rem;
            opacity: 0.7;
        }
        
        body.loaded .book-container {
            animation: bookAppear 1.5s ease-out;
        }
        
        @keyframes bookAppear {
            0% { opacity: 0; transform: translateY(20px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .woodcut-svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.2;
        }
    `;
    document.head.appendChild(style);
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Add dynamic styles first
    addDynamicStyles();
    
    // Initialize the bestiary
    initBestiary();
    
    // Add a subtle page load effect
    setTimeout(() => {
        document.querySelector('.title-main').classList.add('title-animated');
        document.querySelector('.subtitle').classList.add('subtitle-animated');
        
        // Add more dynamic styles for animations
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .title-animated {
                animation: titleGlow 3s ease-in-out;
            }
            
            .subtitle-animated {
                animation: subtitleFade 2s ease-out;
            }
            
            @keyframes titleGlow {
                0% { text-shadow: 0 0 10px var(--color-ember-glow); }
                100% { text-shadow: 2px 2px 0px var(--color-birch-shadow); }
            }
            
            @keyframes subtitleFade {
                0% { opacity: 0; transform: translateY(-10px); }
                100% { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(animationStyle);
    }, 500);
});

// ===== ADD KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Space to reset filters
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        resetFiltersBtn.click();
    }
    
    // Escape to collapse all expanded cards
    if (e.code === 'Escape') {
        document.querySelectorAll('.expanded-content.active').forEach(content => {
            content.classList.remove('active');
            const btn = content.previousElementSibling;
            if (btn && btn.classList.contains('expand-btn')) {
                btn.innerHTML = 'Unfold Lore <i class="fas fa-chevron-down"></i>';
            }
        });
    }
    
    // Number keys 1-4 to filter by danger level
    if (e.code >= 'Digit1' && e.code <= 'Digit4') {
        const dangerLevel = parseInt(e.code.replace('Digit', ''));
        if (dangerLevel >= 1 && dangerLevel <= 4) {
            dangerFilter.value = dangerLevel;
            filterCreatures();
        }
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { creatures, dangerConfig, categoryConfig };
}