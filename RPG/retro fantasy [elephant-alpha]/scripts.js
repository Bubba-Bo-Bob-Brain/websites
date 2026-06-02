// scripts.js - Interactive functionality for Arcane Realms RPG Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    createFloatingRunes();
    createQuestPins();
    createInventoryGrid();
    initializeInteractiveElements();
    startBackgroundAnimation();
});

// Create floating runes with randomized properties
function createFloatingRunes() {
    const runesContainer = document.getElementById('floatingRunes');
    const runeTexts = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛝ', 'ᛞ', 'ᛟ', 'ᛞᛟᚱ', 'ᚠᛖᚩ', 'ᛒᛖᚩᚲ', 'ᛗᛁᚳᛚᛖ', 'ᛚᛟᚱᛖ', 'ᛑᚨᚷᛁᚱ', 'ᛞᚱᚨᚷᛟᚾ', 'ᛗᛟᚾᛥ', '᛫'];
    
    runeTexts.forEach((rune, index) => {
        const runeElement = document.createElement('div');
        runeElement.className = 'rune';
        runeElement.textContent = rune;
        
        // Randomize properties for unique appearance
        const leftPosition = Math.random() * 100;
        const animationDuration = 8 + Math.random() * 15;
        const animationDelay = Math.random() * 5;
        const fontSize = 12 + Math.random() * 24;
        const opacity = 0.05 + Math.random() * 0.15;
        const rotationDuration = 20 + Math.random() * 30;
        
        runeElement.style.cssText = `
            left: ${leftPosition}%;
            animation-duration: ${animationDuration}s;
            animation-delay: ${animationDelay}s;
            font-size: ${fontSize}px;
            opacity: ${opacity};
            animation-name: floatRune;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        `;
        
        // Add slight rotation for variety
        if (Math.random() > 0.5) {
            runeElement.style.transform = 'scaleY(-1)';
        }
        
        runesContainer.appendChild(runeElement);
    });
}

// Quest data with enhanced properties
const quests = [
    { 
        x: 15, y: 30, 
        title: "Dragon's Lair", 
        desc: "Slay the ancient dragon terrorizing the northern village. Reward: Ancient Relic",
        color: "#ff4444", 
        level: "Elite",
        reward: "500 XP, Ancient Relic"
    },
    { 
        x: 45, y: 20, 
        title: "Lost Heirloom", 
        desc: "Retrieve the stolen family heirloom from the bandit camp west of town.",
        color: "#44aaff", 
        level: "Medium",
        reward: "200 XP, Silver Coins"
    },
    { 
        x: 75, y: 40, 
        title: "Cursed Forest", 
        desc: "Investigate the mysterious disappearances in the haunted forest.",
        color: "#44ff44", 
        level: "Hard",
        reward: "300 XP, Rare Materials"
    },
    { 
        x: 25, y: 65, 
        title: "Forgotten Temple", 
        desc: "Explore the ancient temple and recover the sacred artifact.",
        color: "#ffaa44", 
        level: "Medium",
        reward: "400 XP, Temple Relic"
    },
    { 
        x: 65, y: 70, 
        title: "Assassin's Guild", 
        desc: "Eliminate the rogue assassin threatening the kingdom.",
        color: "#ff44aa", 
        level: "Elite",
        reward: "600 XP, Assassin's Seal"
    },
    { 
        x: 85, y: 15, 
        title: "Merchant's Protection", 
        desc: "Escort the merchant caravan through dangerous territory.",
        color: "#44ffaa", 
        level: "Easy",
        reward: "150 XP, Trade Goods"
    },
    { 
        x: 35, y: 80, 
        title: "Necromancer's Tower", 
        desc: "Destroy the necromancer's tower before he raises an undead army.",
        color: "#aa44ff", 
        level: "Hard",
        reward: "500 XP, Necromancer's Tome"
    },
    { 
        x: 55, y: 50, 
        title: "Stolen Crown", 
        desc: "Recover the stolen royal crown from the traitorous lord.",
        color: "#44aaff", 
        level: "Medium",
        reward: "700 XP, Royal Seal"
    },
    { 
        x: 20, y: 15, 
        title: "Goblin Ambush", 
        desc: "Clear the goblin ambush from the mountain pass.",
        color: "#ff8844", 
        level: "Easy",
        reward: "100 XP, Goblin Gear"
    },
    { 
        x: 80, y: 75, 
        title: "Witch's Potion", 
        desc: "Retrieve the rare ingredients for the witch's healing potion.",
        color: "#ff44ff", 
        level: "Hard",
        reward: "350 XP, Potion Ingredients"
    }
];

// Create quest pins with enhanced interactivity
function createQuestPins() {
    const questPinsContainer = document.getElementById('questPins');
    const tooltip = document.getElementById('questTooltip');
    
    quests.forEach((quest, index) => {
        const pin = document.createElement('div');
        pin.className = 'quest-pin';
        pin.style.cssText = `
            left: ${quest.x}%;
            top: ${quest.y}%;
            background: ${quest.color};
            box-shadow: 0 0 10px ${quest.color}80, 0 0 20px ${quest.color}40;
            animation-delay: ${index * 0.2}s;
        `;
        
        // Store quest data in dataset
        pin.dataset.quest = JSON.stringify(quest);
        
        // Add interactive events
        pin.addEventListener('mouseenter', function(e) {
            const questData = JSON.parse(this.dataset.quest);
            showTooltip(e, questData);
            this.style.transform = 'rotate(45deg) scale(1.5)';
            this.style.zIndex = '10';
            this.style.boxShadow = `0 0 20px ${questData.color}80, 0 0 40px ${questData.color}40`;
        });
        
        pin.addEventListener('mousemove', function(e) {
            updateTooltipPosition(e);
        });
        
        pin.addEventListener('mouseleave', function() {
            hideTooltip();
            this.style.transform = 'rotate(45deg) scale(1)';
            this.style.zIndex = '2';
            this.style.boxShadow = `0 0 10px ${this.dataset.color}80`;
        });
        
        pin.addEventListener('click', function() {
            const questData = JSON.parse(this.dataset.quest);
            triggerQuestAccept(questData);
        });
        
        questPinsContainer.appendChild(pin);
    });
}

// Tooltip functions
function showTooltip(e, questData) {
    const tooltip = document.getElementById('questTooltip');
    document.getElementById('questTitle').textContent = questData.title;
    document.getElementById('questDesc').textContent = `${questData.desc} [${questData.level}]`;
    tooltip.style.display = 'block';
    updateTooltipPosition(e);
    
    // Add glow effect to tooltip
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(10, 10, 15, 0.98);
        border: 2px solid var(--gold);
        border-radius: 8px;
        padding: 20px;
        width: 280px;
        z-index: 100;
        display: block;
        font-size: 0.95rem;
        line-height: 1.6;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        pointer-events: none;
        animation: tooltipAppear 0.3s ease-out;
    `;
}

function updateTooltipPosition(e) {
    const tooltip = document.getElementById('questTooltip');
    let x = e.pageX + 15;
    let y = e.pageY - 10;
    
    // Keep tooltip within viewport
    if (x + 300 > window.innerWidth) {
        x = e.pageX - 310;
    }
    if (y + 200 > window.innerHeight) {
        y = window.innerHeight - 210;
    }
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('questTooltip');
    tooltip.style.animation = 'tooltipDisappear 0.3s ease-in forwards';
    setTimeout(() => {
        tooltip.style.display = 'none';
    }, 300);
}

// Inventory functionality
function createInventoryGrid() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    const inventoryItems = [
        { icon: '⚔️', type: 'weapon', name: 'Ancient Sword' },
        { icon: '🔮', type: 'artifact', name: 'Crystal Ball' },
        { icon: '🏹', type: 'equipment', name: 'Elven Bow' },
        { icon: '🛡️', type: 'armor', name: 'Dragon Shield' },
        { icon: '💎', type: 'gem', name: 'Ruby Gem' },
        { icon: '📜', type: 'book', name: 'Tome of Secrets' },
        { icon: '🧙', type: 'staff', name: 'Wizard Staff' },
        { icon: '⚡', type: 'material', name: 'Thunderstone' },
        { icon: '🏆', type: 'trophy', name: 'Champion Medal' },
        { icon: '👑', type: 'crown', name: 'Royal Crown' },
        { icon: '💀', type: 'monster', name: 'Dragon Skull' },
        { icon: '🦇', type: 'material', name: 'Bat Wings' },
        { icon: '🌑', type: 'material', name: 'Shadow Essence' },
        { icon: '⭐', type: 'gem', name: 'Star Diamond' },
        { icon: '🔥', type: 'material', name: 'Fire Ruby' },
        { icon: '❄️', type: 'material', name: 'Ice Crystal' },
        { icon: '💊', type: 'potion', name: 'Healing Potion' },
        { icon: '🍃', type: 'material', name: 'Magic Leaf' },
        { icon: '🎵', type: 'instrument', name: 'Harp of Ages' },
        { icon: '📖', type: 'book', name: 'Arcane Grimoire' },
        { icon: '🎨', type: 'material', name: 'Magic Paint' },
        { icon: '🔧', type: 'tool', name: 'Enchanter Hammer' },
        { icon: '🍖', type: 'food', name: 'Dragon Steak' },
        { icon: '🍺', type: 'drink', name: 'Elven Wine' },
        { icon: '🎭', type: 'accessory', name: 'Masquerade Mask' },
        { icon: '🦄', type: 'material', name: 'Unicorn Horn' },
        { icon: '🐉', type: 'monster', name: 'Wyvern Scale' },
        { icon: '⚪', type: 'gem', name: 'Moonstone' },
        { icon: '🗝️', type: 'key', name: 'Golden Key' },
        { icon: '🪙', type: 'currency', name: 'Ancient Coin' },
        { icon: '🖼️', type: 'decoration', name: 'Mystic Painting' },
        { icon: '🎪', type: 'trinket', name: 'Jester Hat' }
    ];
    
    inventoryItems.forEach((item, index) => {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.textContent = item.icon;
        slot.dataset.item = JSON.stringify(item);
        slot.dataset.index = index + 1;
        
        // Add hover effects
        slot.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(3deg)';
            this.style.zIndex = '10';
            showItemTooltip(this, item);
        });
        
        slot.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
            hideItemTooltip();
        });
        
        // Add click effect
        slot.addEventListener('click', function() {
            this.style.borderColor = '#ffd700';
            this.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.6)';
            
            setTimeout(() => {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }, 1500);
            
            // Trigger inventory shake animation
            this.style.animation = 'inventoryShake 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
        
        inventoryGrid.appendChild(slot);
    });
}

// Tooltip for inventory items
function showItemTooltip(element, item) {
    let tooltip = document.getElementById('itemTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'itemTooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(10, 10, 15, 0.98);
            border: 2px solid var(--gold);
            border-radius: 8px;
            padding: 15px;
            width: 200px;
            z-index: 1000;
            display: none;
            font-size: 0.9rem;
            line-height: 1.5;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <div style="color: var(--gold); font-weight: bold; margin-bottom: 8px;">${item.name}</div>
        <div style="color: var(--gold-dark); font-size: 0.8rem;">Type: ${item.type}</div>
        <div style="color: var(--gold-dark); font-size: 0.8rem; margin-top: 5px;">Click to use</div>
    `;
    
    tooltip.style.display = 'block';
    updateTooltipPositionForElement(element, tooltip);
}

function hideItemTooltip() {
    const tooltip = document.getElementById('itemTooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

function updateTooltipPositionForElement(element, tooltip) {
    const rect = element.getBoundingClientRect();
    let x = rect.left + window.scrollX + 20;
    let y = rect.top + window.scrollY - tooltip.offsetHeight - 10;
    
    if (x + tooltip.offsetWidth > window.innerWidth) {
        x = rect.right + window.scrollX - tooltip.offsetWidth - 10;
    }
    if (y < window.scrollY) {
        y = rect.bottom + window.scrollY + 10;
    }
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

// Initialize interactive elements
function initializeInteractiveElements() {
    // Add CSS animations for tooltip and shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tooltipAppear {
            from { opacity: 0; transform: translateY(10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes tooltipDisappear {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }
        
        @keyframes inventoryShake {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.05) rotate(-2deg); }
            75% { transform: scale(1.05) rotate(2deg); }
        }
        
        .stat-block.health-warning .health-fill {
            animation: healthPulse 0.5s ease-in-out infinite !important;
        }
    `;
    document.head.appendChild(style);
}

// Background animation controller
function startBackgroundAnimation() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    });
    
    // Smooth background parallax effect
    function animateBackground() {
        const elements = document.querySelectorAll('.character-sheet, .quest-board');
        elements.forEach((el, index) => {
            const depth = (index + 1) * 0.02;
            const x = mouseX * depth;
            const y = mouseY * depth;
            
            el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
        });
        
        requestAnimationFrame(animateBackground);
    }
    
    animateBackground();
}

// Quest acceptance system
function triggerQuestAccept(questData) {
    // Create acceptance feedback
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(10, 10, 15, 0.95);
        border: 2px solid var(--gold);
        border-radius: 12px;
        padding: 30px;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        max-width: 400px;
        animation: questAcceptAppear 0.5s ease-out;
    `;
    
    feedback.innerHTML = `
        <div style="color: var(--gold); font-size: 2rem; margin-bottom: 15px;">⚔️</div>
        <h3 style="color: var(--gold); font-size: 1.5rem; margin-bottom: 10px;">Quest Accepted!</h3>
        <p style="color: var(--parchment); margin-bottom: 15px;">${questData.title}</p>
        <p style="color: var(--gold-dark); font-size: 0.9rem; margin-bottom: 20px;">${questData.desc}</p>
        <div style="color: var(--gold-light); font-size: 1.1rem; font-weight: bold;">+ ${questData.reward}</div>
        <button id="closeFeedback" style="
            margin-top: 20px;
            padding: 10px 30px;
            background: linear-gradient(135deg, var(--gold-dark), var(--gold));
            border: none;
            border-radius: 5px;
            color: var(--darker-bg);
            font-family: inherit;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        " onmouseover="this.style.transform='scale(1.05)'" 
           onmouseout="this.style.transform='scale(1)'">
            Begin Quest
        </button>
    `;
    
    document.body.appendChild(feedback);
    
    // Add close functionality
    document.getElementById('closeFeedback').addEventListener('click', function() {
        feedback.style.animation = 'questAcceptDisappear 0.3s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.style.animation = 'questAcceptDisappear 0.3s ease-in forwards';
            setTimeout(() => {
                if (feedback.parentNode) {
                    document.body.removeChild(feedback);
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS animations for feedback
const feedbackStyle = document.createElement('style');
feedbackStyle.textContent = `
    @keyframes questAcceptAppear {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes questAcceptDisappear {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(feedbackStyle);

// Health warning system (demonstration)
function checkHealthWarnings() {
    const healthBars = document.querySelectorAll('.health-fill');
    healthBars.forEach(bar => {
        const width = parseInt(bar.style.width);
        if (width < 30) {
            bar.classList.add('warning');
            bar.parentElement.parentElement.classList.add('health-warning');
        }
    });
}

// Initialize health check
setInterval(checkHealthWarnings, 1000);

// Add some dynamic ambient effects
function createAmbientEffects() {
    // Add subtle floating particles
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background: rgba(212, 168, 67, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            animation: particleFloat ${3 + Math.random() * 4}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        document.body.appendChild(particle);
    }
    
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
    `;
    document.head.appendChild(particleStyle);
}

// Initialize ambient effects
createAmbientEffects();