// ===== CHARACTER DATA =====
const characters = [
    {
        id: 1,
        name: "Brother Alaric",
        title: "Flagellant Monk",
        class: "clergy",
        portraitEmoji: "⛪",
        alignment: "Lawful Good",
        occupation: "Monk & Healer",
        origin: "Monastery of St. Gall",
        plagueResistance: 75,
        faith: 95,
        survivalSkill: 40,
        description: "Once a scribe, now a zealot who believes the plague is divine punishment. Wields a censer filled with 'holy' herbs that may or may not ward off sickness.",
        bonds: ["Sister Beatrice", "Lord Godfrey"],
        properties: ["🔴 High Faith", "⚪ Clergy", "📜 Literate", "🌿 Herbalist"]
    },
    {
        id: 2,
        name: "Lady Isolde",
        title: "Widowed Baroness",
        class: "noble",
        portraitEmoji: "👑",
        alignment: "Neutral Good",
        occupation: "Noble & Landowner",
        origin: "Bavarian Highlands",
        plagueResistance: 30,
        faith: 60,
        survivalSkill: 55,
        description: "Lost her husband and children to the pestilence. Now manages what remains of her estate with grim determination, sheltering survivors who swear fealty.",
        bonds: ["Sir Reynard", "Brother Alaric"],
        properties: ["👑 Noble", "💰 Wealthy", "🏹 Hunter", "📜 Literate"]
    },
    {
        id: 3,
        name: "Grimwald",
        title: "Grave Digger",
        class: "commoner",
        portraitEmoji: "⚰️",
        alignment: "True Neutral",
        occupation: "Grave Digger & Undertaker",
        origin: "Frankish Burial Grounds",
        plagueResistance: 85,
        faith: 20,
        survivalSkill: 70,
        description: "Has handled more corpses than anyone alive. Claims immunity comes from 'breathing the death' daily. Carries a worn shovel and a bag of quicklime.",
        bonds: ["Anya", "Brother Alaric"],
        properties: ["💀 Plague-Touched", "⚰️ Undertaker", "🛡️ Immune?", "🌑 Superstitious"]
    },
    {
        id: 4,
        name: "Sir Reynard",
        title: "Disgraced Knight",
        class: "noble",
        portraitEmoji: "⚔️",
        alignment: "Chaotic Good",
        occupation: "Knight & Mercenary",
        origin: "Burgundian Battlefields",
        plagueResistance: 50,
        faith: 40,
        survivalSkill: 80,
        description: "Stripped of titles after refusing orders to burn a 'infected' village. Now wanders as a sellsword, protecting those abandoned by lords and church alike.",
        bonds: ["Lady Isolde", "Anya"],
        properties: ["⚔️ Knight", "🛡️ Armored", "🏹 Expert Fighter", "🎯 Strategic"]
    },
    {
        id: 5,
        name: "Sister Beatrice",
        title: "Plague Nurse",
        class: "clergy",
        portraitEmoji: "⚕️",
        alignment: "Lawful Good",
        occupation: "Nun & Caretaker",
        origin: "Hospitaller Convent",
        plagueResistance: 65,
        faith: 90,
        survivalSkill: 60,
        description: "Tends to the sick despite knowing most will die. Her meticulous notes on symptoms are heretical to some, invaluable to others.",
        bonds: ["Brother Alaric", "Grimwald"],
        properties: ["⚕️ Healer", "📝 Scholar", "⛪ Devout", "🌿 Herbalist"]
    },
    {
        id: 6,
        name: "Anya",
        title: "Rat Catcher",
        class: "commoner",
        portraitEmoji: "🐀",
        alignment: "Neutral Good",
        occupation: "Rat Catcher & Scavenger",
        origin: "London Sewers",
        plagueResistance: 70,
        faith: 30,
        survivalSkill: 85,
        description: "Survived the worst slums by being quicker and cleverer than the rats she hunts. Knows every hidden passage and forgotten cellar in the city.",
        bonds: ["Grimwald", "Sir Reynard"],
        properties: ["🐀 Rat Catcher", "🏃‍♀️ Agile", "🕵️‍♀️ Scout", "🍄 Forager"]
    },
    {
        id: 7,
        name: "Lord Godfrey",
        title: "Crusader Lord",
        class: "noble",
        portraitEmoji: "🦅",
        alignment: "Lawful Evil",
        occupation: "Lord & Crusader",
        origin: "Holy Land",
        plagueResistance: 40,
        faith: 85,
        survivalSkill: 65,
        description: "Returned from crusades to find his lands ravaged. Now uses divine right to claim whatever remains, believing God rewards the strong.",
        bonds: ["Lady Isolde", "Brother Alaric"],
        properties: ["🦅 Crusader", "🗡️ Ruthless", "⛪ Zealot", "💰 Wealthy"]
    },
    {
        id: 8,
        name: "Merek",
        title: "Blacksmith",
        class: "commoner",
        portraitEmoji: "🔥",
        alignment: "Lawful Neutral",
        occupation: "Blacksmith & Armorer",
        origin: "Prague Forge",
        plagueResistance: 55,
        faith: 50,
        survivalSkill: 75,
        description: "His forge still burns when all others have gone cold. Crafts tools, weapons, and even plague masks for those who can pay.",
        bonds: ["Sir Reynard", "Anya"],
        properties: ["🔥 Blacksmith", "⚒️ Craftsman", "🛡️ Armorer", "💪 Strong"]
    },
    {
        id: 9,
        name: "Elara",
        title: "Heretic Alchemist",
        class: "outcast",
        portraitEmoji: "🧪",
        alignment: "Chaotic Neutral",
        occupation: "Alchemist & Scholar",
        origin: "Parisian Underground",
        plagueResistance: 60,
        faith: 10,
        survivalSkill: 55,
        description: "Expelled from university for 'unnatural investigations'. Now experiments with substances that might cure or kill—often both.",
        bonds: ["Sister Beatrice", "Merek"],
        properties: ["🧪 Alchemist", "📚 Scholar", "⚗️ Experimenter", "🔬 Curious"]
    },
    {
        id: 10,
        name: "Bjorn",
        title: "Varangian Guard",
        class: "outcast",
        portraitEmoji: "🛡️",
        alignment: "Chaotic Neutral",
        occupation: "Mercenary & Bodyguard",
        origin: "Nordic Fjords",
        plagueResistance: 80,
        faith: 35,
        survivalSkill: 90,
        description: "A Norse sellsword who served in Constantinople. Believes in neither God nor plague, only his axe and the silver it earns.",
        bonds: ["Sir Reynard", "Merek"],
        properties: ["🛡️ Varangian", "🪓 Berserker", "🌨️ Northern", "💰 Mercenary"]
    },
    {
        id: 11,
        name: "Thaddeus",
        title: "Leper King",
        class: "outcast",
        portraitEmoji: "🤴",
        alignment: "Neutral Evil",
        occupation: "Leper Colony Leader",
        origin: "Leper Colony",
        plagueResistance: 95,
        faith: 5,
        survivalSkill: 45,
        description: "A leper who rules a colony of the shunned. His disfigurement horrifies, but his cunning and knowledge of quarantine are unmatched.",
        bonds: ["Grimwald", "Elara"],
        properties: ["🤴 Leper King", "🦠 Immune", "🧠 Cunning", "🏚️ Outcast"]
    },
    {
        id: 12,
        name: "Cecily",
        title: "Bawd & Informant",
        class: "commoner",
        portraitEmoji: "🎭",
        alignment: "Chaotic Good",
        occupation: "Innkeeper & Informant",
        origin: "Venetian Brothel",
        plagueResistance: 45,
        faith: 25,
        survivalSkill: 65,
        description: "Runs the last tavern still open. Her ears hear every rumor, and her memory never forgets a face or a debt.",
        bonds: ["Anya", "Bjorn"],
        properties: ["🎭 Innkeeper", "👂 Informant", "💰 Entrepreneur", "🍷 Host"]
    }
];

// ===== DOM ELEMENTS =====
const charactersGrid = document.getElementById('charactersGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const characterModal = document.getElementById('characterModal');
const modalClose = document.getElementById('modalClose');
const statsToggle = document.getElementById('statsToggle');
const statsContent = document.getElementById('statsContent');
const pixelCursor = document.querySelector('.pixel-cursor');

// Modal Elements
const modalName = document.getElementById('modalName');
const modalTitle = document.getElementById('modalTitle');
const modalPortrait = document.getElementById('modalPortrait');
const modalAlignment = document.getElementById('modalAlignment');
const modalClass = document.getElementById('modalClass');
const modalOccupation = document.getElementById('modalOccupation');
const modalOrigin = document.getElementById('modalOrigin');
const modalDescription = document.getElementById('modalDescription');
const modalBonds = document.querySelector('.bonds-list');
const plagueResistanceBar = document.getElementById('plagueResistanceBar');
const plagueResistanceValue = document.getElementById('plagueResistanceValue');
const faithBar = document.getElementById('faithBar');
const faithValue = document.getElementById('faithValue');
const survivalBar = document.getElementById('survivalBar');
const survivalValue = document.getElementById('survivalValue');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    setupEventListeners();
    updateGlobalStats();
    startAmbientEffects();
});

// ===== GALLERY FUNCTIONS =====
function initializeGallery() {
    charactersGrid.innerHTML = '';
    characters.forEach(character => {
        const card = createCharacterCard(character);
        charactersGrid.appendChild(card);
    });
}

function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = `character-card ${character.class}`;
    card.dataset.id = character.id;
    
    // Calculate bar colors based on stats
    const plagueColor = getStatColor(character.plagueResistance, 'plague');
    const faithColor = getStatColor(character.faith, 'faith');
    const survivalColor = getStatColor(character.survivalSkill, 'survival');
    
    card.innerHTML = `
        <div class="character-portrait-container">
            <div class="character-portrait" style="background-color: ${getPortraitColor(character.class)};">
                <div class="portrait-placeholder">${character.portraitEmoji}</div>
                <div class="portrait-frame"></div>
            </div>
        </div>
        <div class="character-info">
            <h3 class="character-name">${character.name}</h3>
            <div class="character-title">${character.title}</div>
            
            <div class="character-properties">
                ${character.properties.map(prop => `
                    <div class="property-tag">${prop}</div>
                `).join('')}
            </div>
            
            <div class="character-stats">
                <div class="stat-indicator">
                    <div class="stat-label-small">🦠 Resistance</div>
                    <div class="stat-bar-small">
                        <div class="stat-fill-small" style="width: ${character.plagueResistance}%; background: ${plagueColor};"></div>
                    </div>
                    <div class="stat-value-small">${character.plagueResistance}%</div>
                </div>
                <div class="stat-indicator">
                    <div class="stat-label-small">⛪ Faith</div>
                    <div class="stat-bar-small">
                        <div class="stat-fill-small" style="width: ${character.faith}%; background: ${faithColor};"></div>
                    </div>
                    <div class="stat-value-small">${character.faith}%</div>
                </div>
                <div class="stat-indicator">
                    <div class="stat-label-small">⚔️ Survival</div>
                    <div class="stat-bar-small">
                        <div class="stat-fill-small" style="width: ${character.survivalSkill}%; background: ${survivalColor};"></div>
                    </div>
                    <div class="stat-value-small">${character.survivalSkill}%</div>
                </div>
            </div>
        </div>
    `;
    
    // Add click event to open modal
    card.addEventListener('click', () => openCharacterModal(character.id));
    
    return card;
}

function getPortraitColor(characterClass) {
    const colors = {
        noble: '#4a2c2c',
        commoner: '#3a1f1f',
        clergy: '#2c4a3e',
        outcast: '#5a5a5a'
    };
    return colors[characterClass] || '#3a1f1f';
}

function getStatColor(value, type) {
    if (value >= 80) {
        if (type === 'plague') return '#c9a66b';
        if (type === 'faith') return '#d4af37';
        return '#c0c0c0';
    } else if (value >= 60) {
        if (type === 'plague') return '#8b7355';
        if (type === 'faith') return '#8b7355';
        return '#8c8c8c';
    } else if (value >= 40) {
        if (type === 'plague') return '#6d1a1a';
        if (type === 'faith') return '#6d1a1a';
        return '#5a5a5a';
    } else {
        if (type === 'plague') return '#4a2c2c';
        if (type === 'faith') return '#4a2c2c';
        return '#3a1f1f';
    }
}

// ===== FILTERING FUNCTIONALITY =====
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        filterCharacters(filter);
    });
});

function filterCharacters(filter) {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach(card => {
        if (filter === 'all' || card.classList.contains(filter)) {
            card.style.display = 'flex';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update character count
    const visibleCount = filter === 'all' ? characters.length : 
        document.querySelectorAll(`.character-card.${filter}`).length;
    document.querySelector('.character-count').textContent = visibleCount;
}

// ===== MODAL FUNCTIONALITY =====
function openCharacterModal(characterId) {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;
    
    // Populate modal with character data
    modalName.textContent = character.name;
    modalTitle.textContent = character.title;
    modalPortrait.textContent = character.portraitEmoji;
    modalPortrait.style.backgroundColor = getPortraitColor(character.class);
    modalAlignment.textContent = character.alignment;
    modalClass.textContent = character.class.charAt(0).toUpperCase() + character.class.slice(1);
    modalOccupation.textContent = character.occupation;
    modalOrigin.textContent = character.origin;
    modalDescription.textContent = character.description;
    
    // Update stats bars with animation
    setTimeout(() => {
        plagueResistanceBar.style.width = `${character.plagueResistance}%`;
        plagueResistanceValue.textContent = `${character.plagueResistance}%`;
        
        faithBar.style.width = `${character.faith}%`;
        faithValue.textContent = `${character.faith}%`;
        
        survivalBar.style.width = `${character.survivalSkill}%`;
        survivalValue.textContent = `${character.survivalSkill}%`;
        
        // Update bar colors
        plagueResistanceBar.style.background = getStatColor(character.plagueResistance, 'plague');
        faithBar.style.background = getStatColor(character.faith, 'faith');
        survivalBar.style.background = getStatColor(character.survivalSkill, 'survival');
    }, 100);
    
    // Populate bonds
    modalBonds.innerHTML = '';
    character.bonds.forEach(bondName => {
        const bond = characters.find(c => c.name === bondName);
        if (bond) {
            const bondTag = document.createElement('div');
            bondTag.className = 'bond-tag';
            bondTag.innerHTML = `
                <span class="bond-emoji">${bond.portraitEmoji}</span>
                <span class="bond-name">${bond.name}</span>
            `;
            bondTag.addEventListener('click', () => {
                closeModal();
                setTimeout(() => openCharacterModal(bond.id), 300);
            });
            modalBonds.appendChild(bondTag);
        }
    });
    
    // Show modal with animation
    characterModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add keyboard shortcut to close modal
    document.addEventListener('keydown', handleModalKeydown);
}

function closeModal() {
    characterModal.style.opacity = '0';
    setTimeout(() => {
        characterModal.style.display = 'none';
        characterModal.style.opacity = '1';
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleModalKeydown);
    }, 300);
}

function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// ===== STATS PANEL FUNCTIONALITY =====
statsToggle.addEventListener('click', () => {
    const isOpen = statsContent.style.maxHeight;
    
    if (isOpen) {
        statsContent.style.maxHeight = '0';
        statsContent.style.opacity = '0';
        statsContent.style.padding = '0';
        statsToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
    } else {
        statsContent.style.maxHeight = `${statsContent.scrollHeight}px`;
        statsContent.style.opacity = '1';
        statsContent.style.padding = 'var(--spacing-lg)';
        statsToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
    }
});

// Alignment grid interaction
document.querySelectorAll('.alignment-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        document.querySelectorAll('.alignment-cell').forEach(c => {
            c.classList.remove('active');
        });
        cell.classList.add('active');
        
        // Filter characters by alignment (simplified)
        const alignment = cell.dataset.alignment;
        // In a full implementation, this would filter characters
    });
});

// ===== GLOBAL STATISTICS =====
function updateGlobalStats() {
    const avgPlagueResistance = Math.round(characters.reduce((sum, c) => sum + c.plagueResistance, 0) / characters.length);
    const avgFaith = Math.round(characters.reduce((sum, c) => sum + c.faith, 0) / characters.length);
    
    // Update metric bars with animation
    setTimeout(() => {
        document.querySelector('.metric-fill').style.width = `${avgPlagueResistance}%`;
        document.querySelector('.metric-fill.faith').style.width = `${avgFaith}%`;
        
        // Update values
        document.querySelectorAll('.metric-value')[0].textContent = `${avgPlagueResistance}%`;
        document.querySelectorAll('.metric-value')[2].textContent = `${avgFaith}%`;
    }, 500);
}

// ===== VISUAL EFFECTS =====
function startAmbientEffects() {
    // Random blood drip animation
    setInterval(() => {
        const drips = document.querySelector('.blood-drips');
        drips.style.animation = 'none';
        setTimeout(() => {
            drips.style.animation = 'blood-pulse 15s infinite alternate';
        }, 10);
    }, 15000);
    
    // Random fog intensity changes
    setInterval(() => {
        const fog = document.querySelector('.plague-fog');
        const randomOpacity = 0.3 + Math.random() * 0.4;
        fog.style.opacity = randomOpacity;
    }, 8000);
}

// ===== CUSTOM CURSOR =====
document.addEventListener('mousemove', (e) => {
    pixelCursor.style.opacity = '1';
    pixelCursor.style.left = `${e.clientX - 10}px`;
    pixelCursor.style.top = `${e.clientY - 10}px`;
    
    // Change cursor color when hovering over interactive elements
    const target = e.target;
    if (target.classList.contains('character-card') || 
        target.closest('.character-card') || 
        target.classList.contains('filter-btn') ||
        target.classList.contains('alignment-cell') ||
        target.classList.contains('bond-tag') ||
        target.classList.contains('modal-close')) {
        pixelCursor.style.background = '#d4af37';
        pixelCursor.style.borderColor = '#c9a66b';
        pixelCursor.style.transform = 'scale(1.3)';
    } else {
        pixelCursor.style.background = '#6d1a1a';
        pixelCursor.style.borderColor = '#d4af37';
        pixelCursor.style.transform = 'scale(1)';
    }
});

document.addEventListener('mouseleave', () => {
    pixelCursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    pixelCursor.style.opacity = '1';
});

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Modal close button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside content
    characterModal.addEventListener('click', (e) => {
        if (e.target === characterModal) {
            closeModal();
        }
    });
    
    // Initialize stats panel as open
    statsContent.style.maxHeight = `${statsContent.scrollHeight}px`;
    statsContent.style.opacity = '1';
    
    // Add random character card glow effect
    setInterval(() => {
        const cards = document.querySelectorAll('.character-card');
        if (cards.length > 0) {
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            randomCard.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.7)';
            
            setTimeout(() => {
                randomCard.style.boxShadow = '';
            }, 2000);
        }
    }, 5000);
}

// ===== ADDITIONAL IMMERSIVE EFFECTS =====
// Random plague sounds (commented out for production, but can be enabled)
/*
const plagueSounds = [
    'cough1.mp3',
    'cough2.mp3',
    'bell.mp3',
    'crow.mp3'
];

setInterval(() => {
    if (Math.random() > 0.7) {
        const sound = new Audio(`sounds/${plagueSounds[Math.floor(Math.random() * plagueSounds.length)]}`);
        sound.volume = 0.3;
        sound.play();
    }
}, 30000);
*/

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        
        // Stagger character card appearance
        const cards = document.querySelectorAll('.character-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }, 300);
});

// ===== EXPORT FUNCTIONALITY (for future use) =====
function exportCharacterData() {
    const dataStr = JSON.stringify(characters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'pestilentia_characters.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Uncomment to add export button in future version
// document.querySelector('.footer-links').innerHTML += '<a href="#" class="footer-link" id="exportBtn">Export Data</a>';
// document.getElementById('exportBtn').addEventListener('click', exportCharacterData);