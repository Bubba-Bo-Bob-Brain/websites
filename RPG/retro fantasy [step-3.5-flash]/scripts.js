/* ========================================
   CHRONOQUEST - RETRO FANTASY RPG SCRIPTS
   ======================================== */

// ========================================
// DATA DEFINITIONS
// ========================================

const gameData = {
    character: {
        name: "Aeliana Moonshadow",
        class: "Arcane Archer",
        race: "Elf",
        alignment: "Chaotic Good",
        level: 27,
        bio: "Born under a blood moon, Aeliana was orphaned at a young age and raised by the Order of the Silver Star. She mastered the bow while studying ancient magics, becoming a rare blend of martial prowess and arcane power. Her current quest: to recover the shattered fragments of the Celestial Lens before the Void Legion can claim them.",
        stats: {
            strength: 85,
            dexterity: 92,
            constitution: 78,
            intelligence: 95,
            wisdom: 88,
            charisma: 70
        },
        combat: {
            attack: { min: 124, max: 187 },
            defense: 78,
            magic: 210,
            hp: { current: 1240, max: 1240 },
            mp: { current: 680, max: 680 }
        }
    },
    
    inventory: [
        { id: 1, name: "Longsword of the Dawn", icon: "⚔️", rarity: "legendary", count: 1, type: "weapon", description: "A blade forged in the first light of creation. Glows with holy power.", stats: { damage: "45-67", element: "Holy" } },
        { id: 2, name: "Elven Bow of Moonfire", icon: "🏹", rarity: "epic", count: 1, type: "weapon", description: "A bow crafted from moonwood. Arrows shot from this bow leave trails of silver light.", stats: { damage: "38-55", element: "Arcane" } },
        { id: 3, name: "Health Potion", icon: "🧪", rarity: "common", count: 12, type: "consumable", description: "Restores 250 HP when consumed.", stats: { heal: 250 } },
        { id: 4, name: "Mana Crystal", icon: "💎", rarity: "uncommon", count: 8, type: "consumable", description: "Restores 150 MP when used.", stats: { mana: 150 } },
        { id: 5, name: "Dragon Scale Armor", icon: "🛡️", rarity: "epic", count: 1, type: "armor", description: "Armor made from the scales of an ancient dragon. Provides exceptional protection.", stats: { defense: 45, resistance: "Fire +50%" } },
        { id: 6, name: "Ring of Protection", icon: "💍", rarity: "rare", count: 1, type: "accessory", description: "A enchanted ring that deflects minor blows.", stats: { defense: 8, blockChance: "5%" } },
        { id: 7, name: "Antidote Herb", icon: "🌿", rarity: "common", count: 5, type: "consumable", description: "Cures poison and other minor ailments.", stats: { cures: ["Poison", "Blindness"] } },
        { id: 8, name: "Fire Bomb", icon: "💣", rarity: "uncommon", count: 3, type: "throwable", description: "Explodes on impact, dealing fire damage to all enemies in a small radius.", stats: { damage: "85-120", element: "Fire", aoe: true } },
        { id: 9, name: "Ancient Coin", icon: "🪙", rarity: "common", count: 147, type: "currency", description: "A coin from a forgotten empire. Worth 10 gold pieces.", stats: { value: 10 } },
        { id: 10, name: "Moonstone Shard", icon: "🔮", rarity: "rare", count: 2, type: "quest", description: "A fragment of the Celestial Lens. Glows with otherworldly energy.", stats: { value: 5000, questItem: true } },
        { id: 11, name: "Traveler's Boots", icon: "👢", rarity: "uncommon", count: 1, type: "armor", description: "These boots make wearer feel lighter and faster.", stats: { speed: "+15%", stamina: "+20%" } },
        { id: 12, name: "Enchanted Quiver", icon: "📦", rarity: "rare", count: 1, type: "accessory", description: "A quiver that never runs out of arrows. Also enhances arrow damage.", stats: { damage: "+10", ammo: "Infinite" } },
        { id: 13, name: "Greater Health Potion", icon: "🧪", rarity: "rare", count: 4, type: "consumable", description: "Restores 500 HP when consumed.", stats: { heal: 500 } },
        { id: 14, name: "Scroll of Fireball", icon: "📜", rarity: "epic", count: 1, type: "scroll", description: "A scroll containing the Fireball spell. Can be used once by any character.", stats: { spell: "Fireball", level: 3 } },
        { id: 15, name: "Dwarven Ale", icon: "🍺", rarity: "common", count: 6, type: "consumable", description: "A strong ale that temporarily boosts strength but reduces accuracy.", stats: { effect: "STR +10, ACC -5%", duration: "5 min" } },
        { id: 16, name: "Silver Pendant", icon: "📿", rarity: "rare", count: 1, type: "accessory", description: "A silver pendant with protective runes. Grants resistance to undead.", stats: { resistance: "Undead +30%", magicDef: 5 } },
        { id: 17, name: "Map of the Underrealm", icon: "🗺️", rarity: "uncommon", count: 1, type: "quest", description: "A map showing passages through the dangerous Underrealm.", stats: { reveals: "Underrealm areas" } },
        { id: 18, name: "Thieves' Tools", icon: "🔧", rarity: "common", count: 1, type: "tool", description: "A set of lockpicks and tools for disarming traps.", stats: { lockpick: "+25%", trap: "+15%" } },
        { id: 19, name: "Lucky Rabbit's Foot", icon: "🦶", rarity: "uncommon", count: 1, type: "accessory", description: "A dried rabbit's foot said to bring good fortune.", stats: { critChance: "+3%", luck: 5 } },
        { id: 20, name: "Goblin Ear", icon: "👂", rarity: "common", count: 23, type: "collectible", description: "A gruesome trophy from a defeated goblin. Can be sold for 2 gold each.", stats: { value: 2 } }
    ],
    
    quests: [
        {
            id: 1,
            title: "The Shattered Lens",
            type: "main",
            description: "The Celestial Lens, an artifact of immense power, has been shattered and its fragments scattered across the realm. The Void Legion seeks to collect them all and plunge the world into eternal darkness. Find the fragments before they do.",
            rewards: { gold: 15000, xp: 25000, items: ["Lens of Restoration"] },
            location: "Various",
            levelRequired: 25,
            completed: false
        },
        {
            id: 2,
            title: "Blood Moon Ritual",
            type: "side",
            description: "A cult in the Whispering Woods is attempting to perform a ritual during the next blood moon. If they succeed, they will summon a demon prince. Stop the ritual and cleanse the corruption.",
            rewards: { gold: 5000, xp: 8000, items: ["Ritual Dagger", "Cultist's Robes"] },
            location: "Whispering Woods",
            levelRequired: 18,
            completed: false
        },
        {
            id: 3,
            title: "Dragon's Hoard",
            type: "side",
            description: "An ancient dragon's hoard has been discovered in the Cragmount Peaks. The dragon is long dead, but its treasure is guarded by dangerous creatures and deadly traps. Explore the depths and claim the treasure.",
            rewards: { gold: 12000, xp: 12000, items: ["Dragon's Bane Sword", "Hoarded Wealth"] },
            location: "Cragmount Peaks",
            levelRequired: 22,
            completed: false
        },
        {
            id: 4,
            title: "Missing Caravan",
            type: "side",
            description: "A merchant caravan has gone missing on the road to Silverhaven. The last sighting was near the Bandit's Pass. Investigate and rescue any survivors if possible.",
            rewards: { gold: 2500, xp: 4000, items: ["Caravan Map", "Trader's Token"] },
            location: "Bandit's Pass",
            levelRequired: 12,
            completed: true
        },
        {
            id: 5,
            title: "The Alchemist's Apprentice",
            type: "side",
            description: "Master Alchemist Varidian needs rare ingredients for his experiments: three Phoenix feathers, a vial of Unicorn blood, and five Mandrake roots. These ingredients are extremely rare and dangerous to obtain.",
            rewards: { gold: 8000, xp: 6000, items: ["Elixir of Vitality", "Varidian's Gratitude"] },
            location: "Various",
            levelRequired: 20,
            completed: false
        },
        {
            id: 6,
            title: "Corrupted Guardian",
            type: "main",
            description: "The guardian of the Eastern Gate has been corrupted by dark forces. You must find a way to cleanse or defeat it to restore safe passage to the Eastern territories.",
            rewards: { gold: 7500, xp: 15000, items: ["Gatekeeper's Key", "Purified Crystal"] },
            location: "Eastern Gate",
            levelRequired: 24,
            completed: false
        }
    ],
    
    spells: {
        fire: [
            { id: 1, name: "Fireball", level: 3, manaCost: 45, castTime: "2.0s", description: "Launches a ball of fire that explodes on impact, dealing fire damage to the target and nearby enemies.", effects: ["Fire Damage", "AoE", "Burn Chance"] },
            { id: 2, name: "Scorch", level: 1, manaCost: 15, castTime: "1.0s", description: "A quick flame that scorches a single target. Good for finishing off weakened enemies.", effects: ["Fire Damage", "Instant"] },
            { id: 3, name: "Inferno", level: 7, manaCost: 120, castTime: "3.5s", description: "Conjures a massive wall of fire that sweeps across the battlefield, damaging all enemies in its path.", effects: ["Massive Fire Damage", "Continuous Damage", "Field Effect"] },
            { id: 4, name: "Cinderbolt", level: 2, manaCost: 25, castTime: "1.5s", description: "A fast-moving bolt of cinders that pierces through enemies.", effects: ["Fire Damage", "Piercing"] }
        ],
        ice: [
            { id: 5, name: "Frostbolt", level: 1, manaCost: 12, castTime: "1.2s", description: "Shoots a bolt of freezing ice that chills the target, reducing their movement speed.", effects: ["Ice Damage", "Slow"] },
            { id: 6, name: "Blizzard", level: 6, manaCost: 90, castTime: "3.0s", description: "Summons a snowstorm in an area that continuously damages and freezes enemies.", effects: ["Ice Damage AoE", "Freeze Chance", "Slow Field"] },
            { id: 7, name: "Ice Shard", level: 2, manaCost: 20, castTime: "1.0s", description: "Sharp ice shards erupt from the ground, piercing multiple enemies.", effects: ["Ice Damage", "Multi-target"] },
            { id: 8, name: "Frost Armor", level: 4, manaCost: 35, castTime: "Instant", description: "Enchants the caster with a protective layer of ice that absorbs damage and reflects some back.", effects: ["Damage Absorption", "Reflect", "Physical Resistance"] }
        ],
        lightning: [
            { id: 9, name: "Lightning Bolt", level: 2, manaCost: 22, castTime: "1.3s", description: "A powerful bolt of lightning that chains to nearby enemies.", effects: ["Lightning Damage", "Chain"] },
            { id: 10, name: "Thunderclap", level: 3, manaCost: 30, castTime: "Instant", description: "Creates a deafening thunderclap that stuns nearby enemies and damages them.", effects: ["Lightning Damage AoE", "Stun", "Disorient"] },
            { id: 11, name: "Chain Lightning", level: 5, manaCost: 60, castTime: "2.0s", description: "Unleashes lightning that bounces between multiple targets with increasing power.", effects: ["Chain Lightning", "Escalating Damage"] },
            { id: 12, name: "Stormcall", level: 8, manaCost: 150, castTime: "4.0s", description: "Calls down a devastating storm that strikes all enemies on the battlefield with random lightning bolts.", effects: ["Massive AoE", "Random Strikes", "Stun Chance"] }
        ]
    }
};

// ========================================
// STATE MANAGEMENT
// ========================================

const state = {
    currentSection: 'character',
    selectedItem: null,
    selectedSpell: null,
    currentSpellPage: 1,
    totalSpellPages: 3,
    questFilter: 'all',
    cursorTrailTimeout: null
};

// ========================================
// DOM ELEMENT CACHING
// ========================================

const elements = {
    cursor: document.getElementById('magic-cursor'),
    cursorTrail: document.getElementById('cursor-trail'),
    navButtons: document.querySelectorAll('.nav-btn'),
    sections: document.querySelectorAll('.content-section'),
    inventoryGrid: document.getElementById('inventory-grid'),
    itemDetails: document.getElementById('item-details'),
    sortInventory: document.getElementById('sort-inventory'),
    questBoard: document.getElementById('quest-board'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    spellLists: {
        fire: document.getElementById('fire-spells'),
        ice: document.getElementById('ice-spells'),
        lightning: document.getElementById('lightning-spells')
    },
    spellDetails: document.getElementById('spell-details'),
    prevPage: document.getElementById('prev-page'),
    nextPage: document.getElementById('next-page'),
    currentPageSpan: document.getElementById('current-page'),
    spellModal: document.getElementById('spell-modal'),
    closeModal: document.querySelector('.close-modal')
};

// ========================================
// CUSTOM CURSOR
// ========================================

function initCursor() {
    document.addEventListener('mousemove', (e) => {
        elements.cursor.style.left = e.clientX + 'px';
        elements.cursor.style.top = e.clientY + 'px';
        
        // Create trail effect occasionally
        if (Math.random() > 0.7) {
            createCursorTrail(e.clientX, e.clientY);
        }
    });
    
    // Cursor interactions
    document.addEventListener('mousedown', () => {
        elements.cursor.classList.add('active');
    });
    
    document.addEventListener('mouseup', () => {
        elements.cursor.classList.remove('active');
    });
    
    // Add cursor trail elements
    function createCursorTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 1000);
    }
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        elements.cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        elements.cursor.style.opacity = '1';
    });
}

// ========================================
// NAVIGATION
// ========================================

function initNavigation() {
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            switchSection(target);
            
            // Update active nav button
            elements.navButtons.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
        });
    });
}

function switchSection(sectionId) {
    // Hide all sections
    elements.sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        state.currentSection = sectionId;
        
        // Trigger section-specific animations
        animateSectionEnter(targetSection);
        
        // Reset filters for quests when switching
        if (sectionId === 'quests') {
            filterQuests('all');
        }
    }
}

function animateSectionEnter(section) {
    const elementsToAnimate = section.querySelectorAll('.character-sheet, .inventory-grid, .quest-board, .spell-book-container');
    
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ========================================
// INVENTORY SYSTEM
// ========================================

function initInventory() {
    renderInventory();
    
    elements.sortInventory.addEventListener('click', sortInventory);
}

function renderInventory() {
    elements.inventoryGrid.innerHTML = '';
    
    // Create 40 inventory slots (5x8 grid)
    for (let i = 0; i < 40; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.dataset.slotIndex = i;
        
        // Check if there's an item in this slot
        const item = gameData.inventory[i];
        if (item) {
            slot.innerHTML = `
                <span class="item-icon">${item.icon}</span>
                ${item.count > 1 ? `<span class="item-count">${item.count}</span>` : ''}
                <span class="item-rarity ${item.rarity}"></span>
            `;
            slot.dataset.itemId = item.id;
            slot.style.cursor = 'pointer';
            
            slot.addEventListener('click', () => selectInventoryItem(item, slot));
        }
        
        elements.inventoryGrid.appendChild(slot);
    }
}

function selectInventoryItem(item, slotElement) {
    // Remove previous selection
    document.querySelectorAll('.inventory-slot.selected').forEach(s => {
        s.classList.remove('selected');
    });
    
    // Add selection to current slot
    slotElement.classList.add('selected');
    state.selectedItem = item;
    
    // Display item details
    displayItemDetails(item);
}

function displayItemDetails(item) {
    const rarityColor = {
        common: '#888',
        uncommon: '#4caf50',
        rare: '#2196f3',
        epic: '#9c27b0',
        legendary: '#ff9800'
    };
    
    let statsHtml = '';
    if (item.stats) {
        statsHtml = '<div class="item-stats">';
        for (const [key, value] of Object.entries(item.stats)) {
            const statName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            statsHtml += `<div class="stat-row"><span class="stat-label">${statName}:</span> <span class="stat-value">${value}</span></div>`;
        }
        statsHtml += '</div>';
    }
    
    elements.itemDetails.innerHTML = `
        <h3 class="details-title" style="color: ${rarityColor[item.rarity]}">${item.name}</h3>
        <div class="item-icon-large" style="font-size: 3rem; text-align: center; margin: 1rem 0;">${item.icon}</div>
        <p class="details-desc">${item.description}</p>
        ${statsHtml}
        <div class="item-meta">
            <span class="item-type">Type: ${item.type}</span>
            <span class="item-count-display">Quantity: ${item.count}</span>
        </div>
    `;
}

function sortInventory() {
    // Sort by rarity (legendary first) then by name
    gameData.inventory.sort((a, b) => {
        const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        const rarityCompare = rarityOrder[a.rarity] - rarityOrder[b.rarity];
        if (rarityCompare !== 0) return rarityCompare;
        return a.name.localeCompare(b.name);
    });
    
    renderInventory();
    
    // Visual feedback
    elements.sortInventory.textContent = 'Sorted!';
    setTimeout(() => {
        elements.sortInventory.textContent = 'Sort Items';
    }, 1000);
}

// ========================================
// QUEST BOARD
// ========================================

function initQuests() {
    renderQuests();
    
    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterQuests(filter);
            
            // Update active filter button
            elements.filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function renderQuests() {
    elements.questBoard.innerHTML = '';
    
    const filteredQuests = gameData.quests.filter(quest => {
        if (state.questFilter === 'all') return true;
        if (state.questFilter === 'completed') return quest.completed;
        return quest.type === state.questFilter;
    });
    
    if (filteredQuests.length === 0) {
        elements.questBoard.innerHTML = `
            <div class="no-quests" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <p>No quests match the current filter.</p>
            </div>
        `;
        return;
    }
    
    filteredQuests.forEach(quest => {
        const questNotice = document.createElement('div');
        questNotice.className = `quest-notice ${quest.completed ? 'completed' : ''}`;
        questNotice.dataset.questId = quest.id;
        
        // Set quest color based on type
        const questColor = quest.type === 'main' ? 'var(--accent-fire)' : 
                          quest.completed ? 'var(--accent-nature)' : 'var(--accent-gold)';
        questNotice.style.setProperty('--quest-color', questColor);
        
        questNotice.innerHTML = `
            <div class="quest-header">
                <div>
                    <h3 class="quest-title">${quest.title}</h3>
                    <span class="quest-type">${quest.type} • Level ${quest.levelRequired}+</span>
                </div>
                ${quest.completed ? '<span class="quest-status">✓ Completed</span>' : ''}
            </div>
            <p class="quest-desc">${quest.description}</p>
            <div class="quest-meta">
                <span class="quest-location">📍 ${quest.location}</span>
                <span class="quest-reward">
                    💰 <span>${quest.rewards.gold.toLocaleString()}</span> gold • 
                    ⭐ ${quest.rewards.xp.toLocaleString()} XP
                    ${quest.rewards.items && quest.rewards.items.length > 0 ? 
                        ` • 🎁 ${quest.rewards.items.join(', ')}` : ''}
                </span>
            </div>
        `;
        
        questNotice.addEventListener('click', () => {
            // Visual selection feedback
            document.querySelectorAll('.quest-notice').forEach(q => q.classList.remove('selected'));
            questNotice.classList.add('selected');
            
            // Could expand to show more details in a modal
            showQuestDetails(quest);
        });
        
        elements.questBoard.appendChild(questNotice);
    });
}

function filterQuests(filter) {
    state.questFilter = filter;
    renderQuests();
}

function showQuestDetails(quest) {
    // For now, just log to console. Could be expanded to a modal
    console.log('Quest details:', quest);
}

// ========================================
// SPELL BOOK
// ========================================

function initSpellBook() {
    renderSpellPage();
    updatePageNavigation();
    
    elements.prevPage.addEventListener('click', () => {
        if (state.currentSpellPage > 1) {
            changePage(state.currentSpellPage - 1);
        }
    });
    
    elements.nextPage.addEventListener('click', () => {
        if (state.currentSpellPage < state.totalSpellPages) {
            changePage(state.currentSpellPage + 1);
        }
    });
    
    // Spell modal close
    elements.closeModal.addEventListener('click', closeSpellModal);
    elements.spellModal.addEventListener('click', (e) => {
        if (e.target === elements.spellModal) {
            closeSpellModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSpellModal();
        }
    });
}

function renderSpellPage() {
    const spellTypes = ['fire', 'ice', 'lightning'];
    const currentType = spellTypes[state.currentSpellPage - 1];
    
    // Update page visibility
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page-${state.currentSpellPage}`).classList.add('active');
    
    // Render spells for current page
    if (elements.spellLists[currentType]) {
        elements.spellLists[currentType].innerHTML = '';
        
        gameData.spells[currentType].forEach(spell => {
            const spellItem = document.createElement('li');
            spellItem.className = 'spell-item';
            spellItem.dataset.spellId = spell.id;
            spellItem.style.setProperty('--spell-color', getSpellColor(currentType));
            
            spellItem.innerHTML = `
                <span class="spell-name">${spell.name}</span>
                <span class="spell-level">Lvl ${spell.level}</span>
            `;
            
            spellItem.addEventListener('click', () => selectSpell(spell, spellItem));
            
            elements.spellLists[currentType].appendChild(spellItem);
        });
    }
}

function getSpellColor(type) {
    const colors = {
        fire: 'var(--accent-fire)',
        ice: 'var(--accent-ice)',
        lightning: 'var(--accent-lightning)'
    };
    return colors[type] || 'var(--accent-arcane)';
}

function selectSpell(spell, element) {
    // Remove previous selection
    document.querySelectorAll('.spell-item.selected').forEach(item => {
        item.classList.remove('selected');
    });
    
    element.classList.add('selected');
    state.selectedSpell = spell;
    
    // Show spell details in the side panel
    showSpellDetails(spell);
}

function showSpellDetails(spell) {
    const effectsHtml = spell.effects.map(effect => 
        `<span class="effect-tag">${effect}</span>`
    ).join('');
    
    elements.spellDetails.innerHTML = `
        <h3 style="color: ${getSpellColor(state.currentSpellPage === 1 ? 'fire' : state.currentSpellPage === 2 ? 'ice' : 'lightning')}">${spell.name}</h3>
        <div class="spell-info">
            <p><strong>Level:</strong> ${spell.level}</p>
            <p><strong>Mana Cost:</strong> ${spell.manaCost}</p>
            <p><strong>Cast Time:</strong> ${spell.castTime}</p>
        </div>
        <p style="margin: 1rem 0; line-height: 1.7;">${spell.description}</p>
        <div class="spell-effects">
            <strong>Effects:</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                ${effectsHtml}
            </div>
        </div>
        <button class="control-btn" style="margin-top: 1rem;" onclick="openSpellModal(${spell.id})">
            View Full Details
        </button>
    `;
}

function openSpellModal(spellId) {
    const currentType = ['fire', 'ice', 'lightning'][state.currentSpellPage - 1];
    const spell = gameData.spells[currentType].find(s => s.id === spellId);
    
    if (!spell) return;
    
    document.getElementById('modal-title').textContent = spell.name;
    document.getElementById('modal-mana').textContent = spell.manaCost;
    document.getElementById('modal-cast').textContent = spell.castTime;
    document.getElementById('modal-element').textContent = currentType.charAt(0).toUpperCase() + currentType.slice(1);
    document.getElementById('modal-desc').textContent = spell.description;
    
    const effectsContainer = document.getElementById('modal-effects');
    effectsContainer.innerHTML = spell.effects.map(effect => 
        `<span class="effect-tag">${effect}</span>`
    ).join('');
    
    elements.spellModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSpellModal() {
    elements.spellModal.classList.remove('active');
    document.body.style.overflow = '';
}

function changePage(newPage) {
    state.currentSpellPage = newPage;
    renderSpellPage();
    updatePageNavigation();
    
    // Clear spell selection when changing pages
    document.querySelectorAll('.spell-item.selected').forEach(item => {
        item.classList.remove('selected');
    });
    state.selectedSpell = null;
    elements.spellDetails.innerHTML = '<h3>Select a spell</h3><p>Choose a spell from the tome to view its properties.</p>';
}

function updatePageNavigation() {
    elements.currentPageSpan.textContent = state.currentSpellPage;
    elements.prevPage.disabled = state.currentSpellPage === 1;
    elements.nextPage.disabled = state.currentSpellPage === state.totalSpellPages;
}

// ========================================
// CHARACTER SHEET ANIMATIONS
// ========================================

function animateStatBars() {
    const statBars = document.querySelectorAll('.stat-bar');
    statBars.forEach((bar, index) => {
        const targetWidth = bar.style.getPropertyValue('--stat-value');
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100 + (index * 150));
    });
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initCursor();
    initNavigation();
    initInventory();
    initQuests();
    initSpellBook();
    
    // Animate stat bars on load
    setTimeout(animateStatBars, 500);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Number keys for navigation
        const keyMap = { '1': 'character', '2': 'inventory', '3': 'quests', '4': 'spells' };
        if (keyMap[e.key]) {
            const btn = document.querySelector(`[data-target="${keyMap[e.key]}"]`);
            if (btn) btn.click();
        }
        
        // Arrow keys for spell pages
        if (state.currentSection === 'spells' && document.activeElement.closest('#spells')) {
            if (e.key === 'ArrowLeft' && state.currentSpellPage > 1) {
                changePage(state.currentSpellPage - 1);
            } else if (e.key === 'ArrowRight' && state.currentSpellPage < state.totalSpellPages) {
                changePage(state.currentSpellPage + 1);
            }
        }
    });
    
    // Add smooth scroll behavior for skip link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add page visibility handling
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.classList.add('page-hidden');
        } else {
            document.body.classList.remove('page-hidden');
        }
    });
    
    // Add window resize handling for responsive adjustments
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-render inventory grid if needed
            if (state.currentSection === 'inventory') {
                renderInventory();
                if (state.selectedItem) {
                    const selectedSlot = document.querySelector('.inventory-slot.selected');
                    if (selectedSlot) {
                        const item = gameData.inventory[selectedSlot.dataset.slotIndex];
                        if (item) displayItemDetails(item);
                    }
                }
            }
        }, 250);
    });
    
    // Easter egg: Konami code for special effect
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateEasterEgg() {
        // Rainbow title effect
        const title = document.querySelector('.game-title');
        title.style.animation = 'none';
        setTimeout(() => {
            title.style.animation = 'rainbow 2s linear infinite';
        }, 10);
        
        // Add rainbow CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { text-shadow: 0 0 10px #ff0000, 0 0 20px #ff7700, 0 0 30px #ffff00; color: #ff0000; }
                16% { text-shadow: 0 0 10px #ffff00, 0 0 20px #00ff00, 0 0 30px #00ffff; color: #ffff00; }
                33% { text-shadow: 0 0 10px #00ffff, 0 0 20px #0000ff, 0 0 30px #ff00ff; color: #00ffff; }
                50% { text-shadow: 0 0 10px #0000ff, 0 0 20px #ff00ff, 0 0 30px #ff0000; color: #0000ff; }
                66% { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff0000, 0 0 30px #ff7700; color: #ff00ff; }
                83% { text-shadow: 0 0 10px #ff7700, 0 0 20px #ffff00, 0 0 30px #00ff00; color: #ff7700; }
                100% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ffff, 0 0 30px #0000ff; color: #00ff00; }
            }
        `;
        document.head.appendChild(style);
        
        // Show notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff0000, #ff7700, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-family: var(--font-display);
            font-weight: bold;
            z-index: 10003;
            animation: slideIn 0.5s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        notification.innerHTML = '✨ SECRET UNLOCKED: Rainbow Mode Activated! ✨';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    console.log('%c CHRONOQUEST LOADED SUCCESSFULLY ', 'background: #ffd700; color: #000; font-size: 16px; font-weight: bold; padding: 8px;');
    console.log('%c Welcome, adventurer! The realm awaits... ', 'color: #9d4edd; font-style: italic;');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatNumber(num) {
    return num.toLocaleString();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Add ARIA live regions for dynamic content updates
const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('aria-atomic', 'true');
liveRegion.className = 'sr-only';
liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
document.body.appendChild(liveRegion);

function announce(message) {
    liveRegion.textContent = message;
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 1000);
}

// Expose some functions globally for onclick handlers
window.openSpellModal = openSpellModal;
window.sortInventory = sortInventory;