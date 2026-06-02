// ============================================
// Plague's End - Dark Ages Survival Chronicle
// JavaScript for Interactivity & Immersion
// ============================================

// Character Data Store
const characters = [
    {
        id: 'aldric',
        name: 'Sir Aldric of Ashford',
        class: 'Noble Knight',
        occupation: 'Knight',
        socialClass: 'Nobility',
        plagueResistance: 'Medium',
        faith: 'Devout',
        alignment: 'Lawful Good',
        health: 85,
        morale: 'Determined',
        status: 'alive',
        skills: ['Swordsmanship', 'Leadership', 'Horseback', 'Defense'],
        relationships: [
            { target: 'brother-thomas', type: 'positive', text: 'Brother Thomas (Ally)' },
            { target: 'godefroy', type: 'negative', text: 'Godefroy (Rival)' }
        ],
        quote: "Honor demands we protect the weak, even as death whispers at our heels."
    },
    {
        id: 'elena',
        name: 'Elena of the Woods',
        class: 'Herbalist',
        occupation: 'Herbalist',
        socialClass: 'Commoner',
        plagueResistance: 'High',
        faith: 'Pagan',
        alignment: 'Neutral Good',
        health: 90,
        morale: 'Hopeful',
        status: 'alive',
        skills: ['Herbalism', 'Healing', 'Foraging', 'Potions'],
        relationships: [
            { target: 'matilda', type: 'positive', text: 'Matilda (Protégé)' },
            { target: 'brother-thomas', type: 'negative', text: 'Brother Thomas (Distrust)' }
        ],
        quote: "The forest provides what the church cannot - remedies for both body and soul."
    },
    {
        id: 'brother-thomas',
        name: 'Brother Thomas',
        class: 'Priest',
        occupation: 'Priest',
        socialClass: 'Clergy',
        plagueResistance: 'Low',
        faith: 'Fanatic',
        alignment: 'Lawful Neutral',
        health: 40,
        morale: 'Zealous',
        status: 'infected',
        skills: ['Scripture', 'Oratory', 'Last Rites', 'Literacy'],
        relationships: [
            { target: 'aldric', type: 'positive', text: 'Sir Aldric (Ally)' },
            { target: 'elena', type: 'negative', text: 'Elena (Heretic)' }
        ],
        quote: "Repent! The pestilence is God's judgment upon the wicked!"
    },
    {
        id: 'godefroy',
        name: 'Godefroy the Bastard',
        class: 'Robber Knight',
        occupation: 'Bandit',
        socialClass: 'Outcast',
        plagueResistance: 'High',
        faith: 'Heretic',
        alignment: 'Chaotic Evil',
        health: 95,
        morale: 'Cruel',
        status: 'alive',
        skills: ['Ambush', 'Stealth', 'Plunder', 'Intimidation'],
        relationships: [
            { target: 'aldric', type: 'negative', text: 'Sir Aldric (Nemesis)' },
            { target: 'rodrigo', type: 'neutral', text: 'Rodrigo (Business)' }
        ],
        quote: "In this plague-ridden world, the strong take what they want."
    },
    {
        id: 'matilda',
        name: 'Matilda of the Fields',
        class: 'Peasant Girl',
        occupation: 'Peasant',
        socialClass: 'Serf',
        plagueResistance: 'Low',
        faith: 'Simple',
        alignment: 'Neutral Good',
        health: 65,
        morale: 'Scared',
        status: 'alive',
        skills: ['Farming', 'Cooking', 'Childcare', 'Sewing'],
        relationships: [
            { target: 'elena', type: 'positive', text: 'Elena (Mentor)' },
            { target: 'hans', type: 'positive', text: 'Hans (Brother)' }
        ],
        quote: "I pray for Mama and Papa... and for the strength to carry on."
    },
    {
        id: 'berengario',
        name: 'Doctor Berengario',
        class: 'Physician',
        occupation: 'Physician',
        socialClass: 'Scholar',
        plagueResistance: 'Medium',
        faith: 'Skeptic',
        alignment: 'True Neutral',
        health: 70,
        morale: 'Frustrated',
        status: 'alive',
        skills: ['Medicine', 'Anatomy', 'Alchemy', 'Diagnosis'],
        relationships: [
            { target: 'elena', type: 'positive', text: 'Elena (Colleague)' },
            { target: 'brother-thomas', type: 'negative', text: 'Brother Thomas (Ignorance)' }
        ],
        quote: "The humors must be balanced. This pestilence defies all medical understanding."
    },
    {
        id: 'hans',
        name: 'Hans the Miller',
        class: 'Miller',
        occupation: 'Miller',
        socialClass: 'Commoner',
        plagueResistance: 'Medium',
        faith: 'Moderate',
        alignment: 'Neutral Neutral',
        health: 75,
        morale: 'Worried',
        status: 'alive',
        skills: ['Milling', 'Bargaining', 'Strength', 'Endurance'],
        relationships: [
            { target: 'matilda', type: 'positive', text: 'Matilda (Sister)' },
            { target: 'rodrigo', type: 'neutral', text: 'Rodrigo (Trader)' }
        ],
        quote: "The mill must keep turning, even if there's no one left to eat the bread."
    },
    {
        id: 'rodrigo',
        name: 'Rodrigo el Mercader',
        class: 'Traveling Merchant',
        occupation: 'Merchant',
        socialClass: 'Bourgeois',
        plagueResistance: 'Low',
        faith: 'Opportunist',
        alignment: 'Neutral Evil',
        health: 60,
        morale: 'Greedy',
        status: 'alive',
        skills: ['Trade', 'Negotiation', 'Smuggling', 'Languages'],
        relationships: [
            { target: 'godefroy', type: 'neutral', text: 'Godefroy (Business)' },
            { target: 'isabella', type: 'positive', text: 'Isabella (Customer)' }
        ],
        quote: "In crisis, there is opportunity. The desperate pay double."
    },
    {
        id: 'isabella',
        name: 'Isabella of the Tower',
        class: 'Noble Heiress',
        occupation: 'Noble',
        socialClass: 'Nobility',
        plagueResistance: 'Low',
        faith: 'Devout',
        alignment: 'Lawful Neutral',
        health: 55,
        morale: 'Desperate',
        status: 'alive',
        skills: ['Diplomacy', 'Etiquette', 'Needlework', 'Management'],
        relationships: [
            { target: 'rodrigo', type: 'neutral', text: 'Rodrigo (Supplier)' },
            { target: 'aldric', type: 'positive', text: 'Sir Aldric (Protector)' }
        ],
        quote: "My title means nothing when death comes for us all equally."
    },
    {
        id: 'pierre',
        name: 'Pierre the Gravedigger',
        class: 'Gravedigger',
        occupation: 'Gravedigger',
        socialClass: 'Lower Class',
        plagueResistance: 'High',
        faith: 'Cynical',
        alignment: 'True Neutral',
        health: 80,
        morale: 'Numb',
        status: 'alive',
        skills: ['Digging', 'Endurance', 'Observation', 'Survival'],
        relationships: [
            { target: 'brother-thomas', type: 'neutral', text: 'Brother Thomas (Employer)' },
            { target: 'berengario', type: 'neutral', text: 'Doctor Berengario (Observer)' }
        ],
        quote: "I've buried more bodies than I can count. The plague just gives me job security."
    },
    {
        id: 'agnes',
        name: 'Agnes the Midwife',
        class: 'Midwife',
        occupation: 'Midwife',
        socialClass: 'Commoner',
        plagueResistance: 'Medium',
        faith: 'Practical',
        alignment: 'Neutral Good',
        health: 65,
        morale: 'Exhausted',
        status: 'alive',
        skills: ['Midwifery', 'Healing', 'Counseling', 'Crisis Management'],
        relationships: [
            { target: 'elena', type: 'positive', text: 'Elena (Ally)' },
            { target: 'matilda', type: 'positive', text: 'Matilda (Helper)' }
        ],
        quote: "I bring life into this world of death. Each birth is a small victory."
    },
    {
        id: 'wolfram',
        name: 'Wolfram the Blacksmith',
        class: 'Blacksmith',
        occupation: 'Blacksmith',
        socialClass: 'Artisan',
        plagueResistance: 'High',
        faith: 'Traditional',
        alignment: 'Lawful Neutral',
        health: 85,
        morale: 'Determined',
        status: 'alive',
        skills: ['Smithing', 'Forging', 'Repair', 'Weaponcraft'],
        relationships: [
            { target: 'aldric', type: 'positive', text: 'Sir Aldric (Customer)' },
            { target: 'godefroy', type: 'negative', text: 'Godefroy (Thief)' }
        ],
        quote: "A good blade can mean the difference between life and death. I forge that chance."
    }
];

// DOM Elements
const characterCards = document.querySelectorAll('.character-card');
const relationshipWeb = document.getElementById('relationshipWeb');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCharacterCards();
    initializeRelationshipWeb();
    initializeCandleFlames();
    initializeAtmosphericEffects();
    updateCharacterStats();
    addScrollAnimations();
});

// Character Card Interactions
function initializeCharacterCards() {
    characterCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
        
        // Add click for expanded view
        card.addEventListener('click', handleCardClick);
        
        // Add dynamic health bar coloring
        const healthFill = card.querySelector('.health-fill');
        if (healthFill) {
            const width = parseInt(healthFill.style.width);
            if (width >= 70) {
                healthFill.style.background = 'linear-gradient(90deg, #4a8f4a 0%, #7cb342 100%)';
            } else if (width >= 40) {
                healthFill.style.background = 'linear-gradient(90deg, #8b8b00 0%, #bdb76b 100%)';
            } else {
                healthFill.style.background = 'linear-gradient(90deg, #8b4513 0%, #a0522d 100%)';
            }
        }
        
        // Add portrait animation on hover
        const portrait = card.querySelector('.portrait-placeholder');
        if (portrait) {
            portrait.addEventListener('mouseenter', () => {
                portrait.style.transform = 'scale(1.05)';
                portrait.style.transition = 'transform 0.3s ease';
            });
            portrait.addEventListener('mouseleave', () => {
                portrait.style.transform = 'scale(1)';
            });
        }
    });
}

function handleCardHover(e) {
    const card = e.currentTarget;
    const characterId = card.getAttribute('data-character');
    
    // Highlight related characters
    characterCards.forEach(otherCard => {
        const otherId = otherCard.getAttribute('data-character');
        if (otherId !== characterId) {
            // Check if there's a relationship
            const character = characters.find(c => c.id === characterId);
            const hasRelationship = character.relationships.some(rel => rel.target === otherId);
            
            if (hasRelationship) {
                otherCard.style.opacity = '1';
                otherCard.style.transform = 'scale(1.02)';
            } else {
                otherCard.style.opacity = '0.7';
            }
        }
    });
    
    // Add glow effect to current card
    card.style.boxShadow = '0 0 30px rgba(201, 162, 39, 0.4), 0 8px 30px rgba(0, 0, 0, 0.3)';
}

function handleCardLeave(e) {
    const card = e.currentTarget;
    
    // Reset all cards
    characterCards.forEach(otherCard => {
        otherCard.style.opacity = '1';
        otherCard.style.transform = 'scale(1)';
        otherCard.style.boxShadow = '';
    });
}

function handleCardClick(e) {
    const card = e.currentTarget;
    const characterId = card.getAttribute('data-character');
    const character = characters.find(c => c.id === characterId);
    
    // Create modal for expanded character view
    showCharacterModal(character);
}

// Character Modal
function showCharacterModal(character) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.character-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'character-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-header">
                <div class="modal-portrait">
                    <span class="portrait-initial">${character.name.charAt(0)}</span>
                </div>
                <div class="modal-title">
                    <h2>${character.name}</h2>
                    <p class="modal-class">${character.class}</p>
                    <div class="modal-alignment ${character.alignment.toLowerCase().replace(' ', '-')}">
                        ${character.alignment}
                    </div>
                </div>
            </div>
            
            <div class="modal-body">
                <div class="modal-section">
                    <h3>Background</h3>
                    <div class="modal-properties">
                        <div class="modal-property">
                            <span class="property-icon">⚔️</span>
                            <span class="property-label">Occupation</span>
                            <span class="property-value">${character.occupation}</span>
                        </div>
                        <div class="modal-property">
                            <span class="property-icon">👑</span>
                            <span class="property-label">Social Class</span>
                            <span class="property-value">${character.socialClass}</span>
                        </div>
                        <div class="modal-property">
                            <span class="property-icon">🛡️</span>
                            <span class="property-label">Plague Resistance</span>
                            <span class="property-value">${character.plagueResistance}</span>
                        </div>
                        <div class="modal-property">
                            <span class="property-icon">✝️</span>
                            <span class="property-label">Faith</span>
                            <span class="property-value">${character.faith}</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Current Status</h3>
                    <div class="modal-stats">
                        <div class="modal-stat">
                            <span class="stat-label">Health</span>
                            <div class="modal-health-bar">
                                <div class="modal-health-fill" style="width: ${character.health}%"></div>
                            </div>
                            <span class="stat-value">${character.health}%</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Morale</span>
                            <span class="stat-value morale">${character.morale}</span>
                        </div>
                        <div class="modal-stat">
                            <span class="stat-label">Status</span>
                            <span class="stat-value status-${character.status}">${character.status.charAt(0).toUpperCase() + character.status.slice(1)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Survival Skills</h3>
                    <div class="modal-skills">
                        ${character.skills.map(skill => `
                            <span class="modal-skill-tag">${getSkillEmoji(skill)} ${skill}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Relationships</h3>
                    <div class="modal-relationships">
                        ${character.relationships.map(rel => `
                            <div class="modal-relationship ${rel.type}">
                                <span class="relationship-icon">${getRelationshipEmoji(rel.type)}</span>
                                <span class="relationship-text">${rel.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Character Quote</h3>
                    <blockquote class="modal-quote">
                        "${character.quote}"
                    </blockquote>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .character-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #c9a227;
            border-radius: 10px;
            padding: 30px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 0 50px rgba(201, 162, 39, 0.3);
            animation: slideUp 0.4s ease;
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: #c9a227;
            font-size: 2rem;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .modal-close:hover {
            color: #ffd700;
        }
        
        .modal-header {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(201, 162, 39, 0.3);
        }
        
        .modal-portrait {
            width: 120px;
            height: 160px;
            background: linear-gradient(135deg, #e6d5b8 0%, #d4c4a8 100%);
            border: 3px solid #c9a227;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
        }
        
        .modal-portrait .portrait-initial {
            font-family: 'Cinzel', serif;
            font-size: 3rem;
            color: #333;
            font-weight: 900;
        }
        
        .modal-title h2 {
            font-family: 'Cinzel', serif;
            font-size: 2rem;
            color: #c9a227;
            margin-bottom: 5px;
        }
        
        .modal-class {
            font-family: 'MedievalSharp', cursive;
            font-size: 1.2rem;
            color: #e6d5b8;
            margin-bottom: 10px;
        }
        
        .modal-alignment {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-family: 'Cinzel', serif;
            font-size: 0.9rem;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(201, 162, 39, 0.5);
        }
        
        .modal-section {
            margin-bottom: 25px;
        }
        
        .modal-section h3 {
            font-family: 'Cinzel', serif;
            font-size: 1.3rem;
            color: #c9a227;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        
        .modal-properties {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .modal-property {
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 5px;
            border: 1px solid rgba(201, 162, 39, 0.2);
            text-align: center;
        }
        
        .modal-property .property-icon {
            font-size: 1.5rem;
            display: block;
            margin-bottom: 5px;
        }
        
        .modal-property .property-label {
            font-size: 0.8rem;
            color: #d4c4a8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 5px;
            display: block;
        }
        
        .modal-property .property-value {
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            color: #f4e8d3;
            font-weight: 600;
        }
        
        .modal-stats {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .modal-stat {
            flex: 1;
            min-width: 150px;
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 5px;
            border: 1px solid rgba(201, 162, 39, 0.2);
            text-align: center;
        }
        
        .modal-stat .stat-label {
            display: block;
            font-size: 0.9rem;
            color: #d4c4a8;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .modal-health-bar {
            height: 8px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 4px;
            margin: 10px 0;
            overflow: hidden;
        }
        
        .modal-health-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a8f4a 0%, #7cb342 100%);
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        
        .modal-stat .stat-value {
            font-family: 'Cinzel', serif;
            font-size: 1.2rem;
            color: #f4e8d3;
            font-weight: 600;
        }
        
        .modal-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .modal-skill-tag {
            background: linear-gradient(135deg, rgba(74, 93, 35, 0.8) 0%, rgba(58, 77, 28, 0.9) 100%);
            border: 1px solid #3a4d1c;
            border-radius: 20px;
            padding: 8px 15px;
            font-size: 0.9rem;
            color: #f4e8d3;
        }
        
        .modal-relationships {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .modal-relationship {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 5px;
        }
        
        .modal-relationship.positive {
            background: rgba(74, 143, 74, 0.2);
            border-left: 3px solid #4a8f4a;
        }
        
        .modal-relationship.negative {
            background: rgba(139, 0, 0, 0.2);
            border-left: 3px solid #8b0000;
        }
        
        .modal-relationship.neutral {
            background: rgba(120, 144, 156, 0.2);
            border-left: 3px solid #78909c;
        }
        
        .modal-quote {
            background: rgba(0, 0, 0, 0.3);
            border-left: 3px solid #c9a227;
            padding: 20px;
            font-style: italic;
            color: #e6d5b8;
            margin: 0;
            border-radius: 0 5px 5px 0;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                padding: 20px;
                width: 95%;
            }
            
            .modal-header {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .modal-properties {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Add event listeners to modal
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    
    overlay.addEventListener('click', () => modal.remove());
    closeBtn.addEventListener('click', () => modal.remove());
    
    // Close modal on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function getSkillEmoji(skill) {
    const skillEmojis = {
        'Swordsmanship': '⚔️',
        'Leadership': '🏰',
        'Horseback': '🐎',
        'Defense': '🛡️',
        'Herbalism': '🌿',
        'Healing': '🩹',
        'Foraging': '🍄',
        'Potions': '🧪',
        'Scripture': '📖',
        'Oratory': '🗣️',
        'Last Rites': '🕯️',
        'Literacy': '📜',
        'Ambush': '🗡️',
        'Stealth': '🏃',
        'Plunder': '💰',
        'Intimidation': '😈',
        'Farming': '🌾',
        'Cooking': '🍳',
        'Childcare': '👶',
        'Sewing': '🧵',
        'Medicine': '🩺',
        'Anatomy': '📚',
        'Alchemy': '⚗️',
        'Diagnosis': '📊',
        'Milling': '🌾',
        'Bargaining': '🤝',
        'Strength': '💪',
        'Endurance': '🏃',
        'Trade': '📦',
        'Negotiation': '🤝',
        'Smuggling': '🌑',
        'Languages': '🗣️',
        'Diplomacy': '🤝',
        'Etiquette': '🎩',
        'Needlework': '🧵',
        'Management': '👔',
        'Digging': '⛏️',
        'Observation': '👁️',
        'Survival': '🏕️',
        'Midwifery': '👶',
        'Counseling': '💬',
        'Crisis Management': '🆘',
        'Smithing': '⚒️',
        'Forging': '🔥',
        'Repair': '🔧',
        'Weaponcraft': '⚔️'
    };
    return skillEmojis[skill] || '⭐';
}

function getRelationshipEmoji(type) {
    const emojis = {
        'positive': '💚',
        'negative': '⚔️',
        'neutral': '🤝'
    };
    return emojis[type] || '❓';
}

// Relationship Web Visualization
function initializeRelationshipWeb() {
    if (!relationshipWeb) return;
    
    // Create SVG for relationship web
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    
    // Position characters in a circle
    const centerX = 400;
    const centerY = 200;
    const radius = 150;
    
    // Draw relationship lines first (behind nodes)
    characters.forEach((character, i) => {
        character.relationships.forEach(rel => {
            const targetIndex = characters.findIndex(c => c.id === rel.target);
            if (targetIndex !== -1) {
                const angle1 = (i / characters.length) * Math.PI * 2;
                const angle2 = (targetIndex / characters.length) * Math.PI * 2;
                
                const x1 = centerX + Math.cos(angle1) * radius;
                const y1 = centerY + Math.sin(angle1) * radius;
                const x2 = centerX + Math.cos(angle2) * radius;
                const y2 = centerY + Math.sin(angle2) * radius;
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                
                // Style based on relationship type
                if (rel.type === 'positive') {
                    line.setAttribute('stroke', '#4a8f4a');
                    line.setAttribute('stroke-width', '2');
                } else if (rel.type === 'negative') {
                    line.setAttribute('stroke', '#8b0000');
                    line.setAttribute('stroke-width', '2');
                    line.setAttribute('stroke-dasharray', '5,5');
                } else {
                    line.setAttribute('stroke', '#78909c');
                    line.setAttribute('stroke-width', '1');
                }
                
                line.setAttribute('opacity', '0.6');
                svg.appendChild(line);
            }
        });
    });
    
    // Draw character nodes
    characters.forEach((character, i) => {
        const angle = (i / characters.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Create node group
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'relationship-node');
        group.setAttribute('data-character', character.id);
        
        // Circle background
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '20');
        
        // Color based on alignment
        let color = '#78909c'; // default
        if (character.alignment.includes('Good')) color = '#4a8f4a';
        else if (character.alignment.includes('Evil')) color = '#8b0000';
        else if (character.alignment.includes('Neutral')) color = '#78909c';
        
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#c9a227');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('opacity', '0.8');
        
        // Character initial
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', '#f4e8d3');
        text.setAttribute('font-family', 'Cinzel, serif');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.textContent = character.name.charAt(0);
        
        // Character name (tooltip)
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${character.name}\n${character.class}\n${character.alignment}`;
        
        group.appendChild(circle);
        group.appendChild(text);
        group.appendChild(title);
        
        // Add hover effects
        group.addEventListener('mouseenter', function() {
            circle.setAttribute('r', '25');
            circle.setAttribute('stroke-width', '3');
            
            // Highlight connected lines
            const connections = svg.querySelectorAll('line');
            connections.forEach(line => {
                const x1 = parseFloat(line.getAttribute('x1'));
                const y1 = parseFloat(line.getAttribute('y1'));
                const x2 = parseFloat(line.getAttribute('x2'));
                const y2 = parseFloat(line.getAttribute('y2'));
                
                if ((Math.abs(x1 - x) < 1 && Math.abs(y1 - y) < 1) || 
                    (Math.abs(x2 - x) < 1 && Math.abs(y2 - y) < 1)) {
                    line.setAttribute('opacity', '1');
                    line.setAttribute('stroke-width', '3');
                }
            });
        });
        
        group.addEventListener('mouseleave', function() {
            circle.setAttribute('r', '20');
            circle.setAttribute('stroke-width', '2');
            
            // Reset lines
            const connections = svg.querySelectorAll('line');
            connections.forEach(line => {
                line.setAttribute('opacity', '0.6');
                if (line.getAttribute('stroke-dasharray')) {
                    line.setAttribute('stroke-width', '2');
                } else {
                    line.setAttribute('stroke-width', '2');
                }
            });
        });
        
        // Add click to show character modal
        group.addEventListener('click', function() {
            showCharacterModal(character);
        });
        
        svg.appendChild(group);
    });
    
    relationshipWeb.appendChild(svg);
    
    // Add legend
    const legend = document.createElement('div');
    legend.className = 'relationship-legend';
    legend.innerHTML = `
        <div class="legend-item">
            <div class="legend-color positive"></div>
            <span>Allies</span>
        </div>
        <div class="legend-item">
            <div class="legend-color negative"></div>
            <span>Enemies</span>
        </div>
        <div class="legend-item">
            <div class="legend-color neutral"></div>
            <span>Neutral</span>
        </div>
    `;
    
    const legendStyle = document.createElement('style');
    legendStyle.textContent = `
        .relationship-legend {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 5px;
            border: 1px solid rgba(201, 162, 39, 0.3);
            z-index: 10;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 0.9rem;
            color: #e6d5b8;
        }
        
        .legend-item:last-child {
            margin-bottom: 0;
        }
        
        .legend-color {
            width: 20px;
            height: 3px;
            border-radius: 2px;
        }
        
        .legend-color.positive {
            background: #4a8f4a;
        }
        
        .legend-color.negative {
            background: #8b0000;
        }
        
        .legend-color.neutral {
            background: #78909c;
        }
        
        .relationship-node {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .relationship-node:hover {
            filter: drop-shadow(0 0 10px rgba(201, 162, 39, 0.5));
        }
    `;
    
    document.head.appendChild(legendStyle);
    relationshipWeb.appendChild(legend);
}

// Candle Flame Animation Enhancement
function initializeCandleFlames() {
    const flames = document.querySelectorAll('.candle-flame');
    
    flames.forEach(flame => {
        // Randomize animation duration for each flame
        const duration = 1.5 + Math.random() * 1.5;
        const delay = Math.random() * 2;
        
        flame.style.animationDuration = `${duration}s`;
        flame.style.animationDelay = `${delay}s`;
        
        // Add random flicker effect
        setInterval(() => {
            const scale = 0.9 + Math.random() * 0.2;
            const rotate = -5 + Math.random() * 10;
            flame.style.transform = `scaleY(${scale}) rotate(${rotate}deg)`;
        }, 100 + Math.random() * 200);
    });
}

// Atmospheric Effects
function initializeAtmosphericEffects() {
    // Create floating dust particles
    const dustContainer = document.createElement('div');
    dustContainer.className = 'dust-container';
    
    for (let i = 0; i < 50; i++) {
        const dust = document.createElement('div');
        dust.className = 'dust-particle';
        
        // Random position and animation
        dust.style.left = `${Math.random() * 100}%`;
        dust.style.top = `${Math.random() * 100}%`;
        dust.style.animationDuration = `${10 + Math.random() * 20}s`;
        dust.style.animationDelay = `${Math.random() * 10}s`;
        dust.style.opacity = Math.random() * 0.3;
        dust.style.width = `${Math.random() * 3 + 1}px`;
        dust.style.height = dust.style.width;
        
        dustContainer.appendChild(dust);
    }
    
    // Add dust styles
    const dustStyle = document.createElement('style');
    dustStyle.textContent = `
        .dust-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 998;
            overflow: hidden;
        }
        
        .dust-particle {
            position: absolute;
            background: radial-gradient(circle, rgba(244, 232, 211, 0.8) 0%, rgba(230, 213, 184, 0.4) 100%);
            border-radius: 50%;
            animation: float linear infinite;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.3;
            }
            90% {
                opacity: 0.3;
            }
            100% {
                transform: translateY(-100vh) translateX(100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .character-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .character-card:nth-child(odd) {
            animation: cardFloat 8s ease-in-out infinite;
        }
        
        .character-card:nth-child(even) {
            animation: cardFloat 8s ease-in-out infinite 4s;
        }
        
        @keyframes cardFloat {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
    
    document.head.appendChild(dustStyle);
    document.body.appendChild(dustContainer);
}

// Update Character Statistics
function updateCharacterStats() {
    const totalElement = document.getElementById('totalCharacters');
    const healthyElement = document.getElementById('healthyCharacters');
    const infectedElement = document.getElementById('infectedCharacters');
    const devoutElement = document.getElementById('devoutCharacters');
    
    if (totalElement) totalElement.textContent = characters.length;
    
    const healthyCount = characters.filter(c => c.health >= 70).length;
    if (healthyElement) healthyElement.textContent = healthyCount;
    
    const infectedCount = characters.filter(c => c.status === 'infected').length;
    if (infectedElement) infectedElement.textContent = infectedCount;
    
    const devoutCount = characters.filter(c => 
        c.faith === 'Devout' || c.faith === 'Fanatic' || c.faith === 'Simple'
    ).length;
    if (devoutElement) devoutElement.textContent = devoutCount;
    
    // Add animation to stats
    animateStats();
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            currentValue = Math.round(easeOutQuart * finalValue);
            
            stat.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    });
}

// Scroll Animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation to child elements
                const children = entry.target.querySelectorAll('.character-card, .stat-card');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('animate-in');
                });
            }
        });
    }, observerOptions);
    
    // Observe main sections
    const sections = document.querySelectorAll('.introduction, .relationship-web, .character-stats');
    sections.forEach(section => observer.observe(section));
    
    // Add scroll animation styles
    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = `
        .introduction, .relationship-web, .character-stats {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .introduction.visible, .relationship-web.visible, .character-stats.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
            opacity: 0;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .character-card:hover {
            z-index: 10;
        }
    `;
    
    document.head.appendChild(scrollStyle);
}

// Utility Functions
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

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const cards = Array.from(characterCards);
        const currentIndex = cards.findIndex(card => card === document.activeElement);
        
        if (currentIndex !== -1) {
            let newIndex;
            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % cards.length;
            } else {
                newIndex = (currentIndex - 1 + cards.length) % cards.length;
            }
            
            cards[newIndex].focus();
            cards[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// Make character cards focusable for keyboard navigation
characterCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${card.querySelector('.character-name').textContent}`);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger entrance animations
    setTimeout(() => {
        const header = document.querySelector('.main-header');
        if (header) {
            header.style.animation = 'fadeInDown 1s ease';
        }
    }, 300);
});

// Add final animation styles
const finalStyle = document.createElement('style');
finalStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .character-card:focus {
        outline: 2px solid #c9a227;
        outline-offset: 4px;
    }
    
    .character-card:focus:not(:focus-visible) {
        outline: none;
    }
    
    .character-card:focus-visible {
        outline: 3px solid #c9a227;
        outline-offset: 4px;
        box-shadow: 0 0 20px rgba(201, 162, 39, 0.4);
    }
`;
document.head.appendChild(finalStyle);

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

function initializeAll() {
    initializeCharacterCards();
    initializeRelationshipWeb();
    initializeCandleFlames();
    initializeAtmosphericEffects();
    updateCharacterStats();
    addScrollAnimations();
}