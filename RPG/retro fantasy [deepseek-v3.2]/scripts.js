// scripts.js
// Arcane Chronicles - Retro Fantasy RPG Interactivity

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initCharacterSheet();
    initQuestBoard();
    initInventory();
    initSpellbook();
    initThemeToggle();
    initSoundSystem();
    initParticleEffects();
    initImmersionMode();
    initPageAnimations();
    
    console.log('⚔️ Arcane Chronicles loaded successfully!');
});

// Navigation System
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Play tab switch sound
            playSound('click');
            
            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === tabId) {
                    section.classList.add('active');
                    
                    // Add magical effect on tab switch
                    createParticles(this, 15, '#8B5FBF');
                    
                    // Special effects for specific tabs
                    if (tabId === 'spellbook') {
                        animateSpellbookOpen();
                    }
                }
            });
            
            // Add hover effect to other tabs
            tabs.forEach(t => {
                if (t !== this) {
                    t.style.transform = 'translateY(0)';
                    setTimeout(() => {
                        t.style.transform = '';
                    }, 300);
                }
            });
        });
        
        // Add hover sound effect
        tab.addEventListener('mouseenter', () => playSound('hover'));
    });
}

// Character Sheet Interactions
function initCharacterSheet() {
    const statCards = document.querySelectorAll('.stat-card');
    const statBars = document.querySelectorAll('.stat-bar');
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Stat card interactions
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const stat = this.dataset.stat;
            const value = this.querySelector('.stat-value').textContent;
            const modifier = this.querySelector('.stat-modifier').textContent;
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Create stat popup
            createStatPopup(stat.toUpperCase(), value, modifier);
            playSound('click');
            createParticles(this, 8, '#D4AF37');
        });
        
        card.addEventListener('mouseenter', () => {
            playSound('hover');
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '';
        });
    });
    
    // Animate stat bars on load
    setTimeout(() => {
        statBars.forEach(bar => {
            const fill = bar.querySelector('.stat-fill');
            const width = fill.style.width;
            fill.style.width = '0';
            
            setTimeout(() => {
                fill.style.transition = 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
                fill.style.width = width;
            }, 100);
        });
    }, 500);
    
    // Skill item interactions
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            const skillName = this.querySelector('.skill-name').textContent;
            const bonus = this.querySelector('.skill-bonus').textContent;
            
            // Toggle skill mastery animation
            const dots = this.querySelectorAll('.skill-dot');
            dots.forEach((dot, index) => {
                setTimeout(() => {
                    dot.classList.toggle('filled');
                    createParticles(dot, 3, '#4A6FA5');
                }, index * 100);
            });
            
            playSound('magic');
            
            // Show skill notification
            showNotification(`${skillName} skill ${dots[0].classList.contains('filled') ? 'mastered!' : 'unlearned!'}`, '#4A6FA5');
        });
    });
}

// Quest Board Functionality
function initQuestBoard() {
    const quests = document.querySelectorAll('.quest-notice');
    const acceptButtons = document.querySelectorAll('.quest-accept-btn');
    
    quests.forEach(quest => {
        quest.addEventListener('click', function(e) {
            if (!e.target.classList.contains('quest-accept-btn')) {
                // Toggle active quest
                quests.forEach(q => q.classList.remove('active'));
                this.classList.add('active');
                playSound('click');
                
                // Create parchment crinkle effect
                createParchmentEffect(this);
            }
        });
        
        // Quest floating animation
        quest.style.animationDelay = `${Math.random() * 2}s`;
    });
    
    // Accept quest functionality
    acceptButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const quest = this.closest('.quest-notice');
            const title = quest.querySelector('.quest-title').textContent;
            const difficulty = quest.querySelector('.quest-difficulty').textContent;
            
            // Visual feedback
            this.textContent = 'Quest Accepted!';
            this.disabled = true;
            this.style.background = 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)';
            
            // Quest acceptance effects
            createParticles(this, 20, '#D4AF37');
            playSound('magic');
            
            // Add to quest log (simulated)
            showNotification(`Accepted: ${title} (${difficulty})`, '#2E7D32');
            
            // Quest board pin animation
            const pins = document.querySelectorAll('.board-pin');
            pins.forEach(pin => {
                pin.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    pin.style.transform = '';
                }, 300);
            });
            
            // Remove quest after delay
            setTimeout(() => {
                quest.style.opacity = '0';
                quest.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    quest.remove();
                    // Check if no quests remain
                    if (document.querySelectorAll('.quest-notice').length === 0) {
                        showNotification('All quests completed! Return to the guild for more.', '#D4AF37');
                    }
                }, 500);
            }, 2000);
        });
    });
}

// Inventory System
function initInventory() {
    const inventoryGrid = document.querySelector('.inventory-grid');
    const items = [
        { icon: '⚔️', name: 'Elderwood Staff', quantity: 1 },
        { icon: '🛡️', name: 'Iron Shield', quantity: 1 },
        { icon: '🧪', name: 'Healing Potion', quantity: 3 },
        { icon: '📜', name: 'Scroll of Wisdom', quantity: 2 },
        { icon: '💎', name: 'Mystic Gem', quantity: 5 },
        { icon: '🔑', name: 'Rusty Key', quantity: 1 },
        { icon: '🍖', name: 'Dried Rations', quantity: 4 },
        { icon: '🕯️', name: 'Glowing Candle', quantity: 2 },
        { icon: '🧭', name: 'Compass', quantity: 1 },
        { icon: '💍', name: 'Silver Ring', quantity: 1 },
        { icon: '📖', name: 'Spell Tome', quantity: 1 },
        { icon: '⚗️', name: 'Alchemy Kit', quantity: 1 }
    ];
    
    // Generate inventory grid
    items.forEach((item, index) => {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot filled';
        slot.dataset.itemIndex = index;
        
        slot.innerHTML = `
            <div class="slot-icon">${item.icon}</div>
            <div class="slot-quantity">${item.quantity}</div>
        `;
        
        slot.addEventListener('click', function() {
            // Update selected item display
            updateSelectedItem(item);
            
            // Visual feedback
            inventoryGrid.querySelectorAll('.inventory-slot').forEach(s => {
                s.style.borderColor = '';
                s.style.transform = '';
            });
            
            this.style.borderColor = '#D4AF37';
            this.style.transform = 'scale(1.1)';
            
            // Sound and particle effects
            playSound('click');
            createParticles(this, 12, '#4A6FA5');
            
            // Item inspection effect
            const icon = this.querySelector('.slot-icon');
            icon.style.transform = 'rotate(360deg)';
            icon.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                icon.style.transform = '';
            }, 500);
        });
        
        slot.addEventListener('mouseenter', () => {
            playSound('hover');
        });
        
        inventoryGrid.appendChild(slot);
    });
    
    // Fill empty slots
    for (let i = items.length; i < 24; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.innerHTML = '<div class="slot-icon">+</div>';
        
        slot.addEventListener('click', function() {
            // Add item to empty slot (simulated)
            const newItem = {
                icon: ['⚔️', '🛡️', '🧪', '📜', '💎'][Math.floor(Math.random() * 5)],
                name: 'Found Item',
                quantity: 1
            };
            
            this.classList.add('filled');
            this.innerHTML = `
                <div class="slot-icon">${newItem.icon}</div>
                <div class="slot-quantity">1</div>
            `;
            
            playSound('magic');
            createParticles(this, 15, '#D4AF37');
            showNotification('Found a new item!', '#D4AF37');
        });
        
        inventoryGrid.appendChild(slot);
    }
    
    // Weight meter animation
    const weightFill = document.querySelector('.weight-fill');
    let currentWeight = 42;
    
    document.querySelectorAll('.inventory-slot.filled').forEach(slot => {
        slot.addEventListener('click', function() {
            // Simulate weight change when using items
            if (Math.random() > 0.7) {
                currentWeight = Math.max(0, currentWeight - Math.floor(Math.random() * 3));
                const percentage = (currentWeight / 65) * 100;
                weightFill.style.width = `${percentage}%`;
                document.querySelector('.weight-value').textContent = `${currentWeight}/65 lbs`;
                
                // Weight change animation
                weightFill.style.transition = 'width 0.5s ease';
                setTimeout(() => {
                    weightFill.style.transition = '';
                }, 500);
            }
        });
    });
}

function updateSelectedItem(item) {
    const itemName = document.querySelector('.item-name');
    const itemDescription = document.querySelector('.item-description');
    const itemStats = document.querySelector('.item-stats');
    const itemIcon = document.querySelector('.item-icon');
    
    // Update item display
    itemName.textContent = item.name;
    itemIcon.textContent = item.icon;
    
    // Generate random description and stats based on item type
    const descriptions = {
        '⚔️': 'A finely crafted weapon, humming with potential energy.',
        '🛡️': 'Sturdy protection that has seen many battles.',
        '🧪': 'A glowing potion that restores vitality.',
        '📜': 'Ancient parchment inscribed with forgotten knowledge.',
        '💎': 'A gemstone that pulses with magical energy.',
        '🔑': 'An old key that might unlock something important.',
        '🍖': 'Preserved food that will sustain you on long journeys.',
        '🕯️': 'A candle that burns without consuming wax.',
        '🧭': 'Always points toward your current objective.',
        '💍': 'Adorned with intricate magical symbols.',
        '📖': 'Contains spells and incantations from ages past.',
        '⚗️': 'Used for brewing potions and concoctions.'
    };
    
    itemDescription.textContent = descriptions[item.icon] || 'A mysterious item of unknown purpose.';
    
    // Generate random stats
    const stats = [
        `Weight: ${Math.floor(Math.random() * 5) + 1} lbs`,
        `Value: ${Math.floor(Math.random() * 100) + 10} gold`,
        `Rarity: ${['Common', 'Uncommon', 'Rare', 'Legendary'][Math.floor(Math.random() * 4)]}`
    ];
    
    itemStats.innerHTML = stats.map(stat => 
        `<span class="item-stat">${stat}</span>`
    ).join('');
    
    // Animate the item icon
    itemIcon.style.animation = 'none';
    setTimeout(() => {
        itemIcon.style.animation = 'itemFloat 3s ease-in-out infinite';
    }, 10);
}

// Spellbook Magic System
function initSpellbook() {
    const castButtons = document.querySelectorAll('.spell-cast-btn');
    const spellSlots = document.querySelectorAll('.slot-dot');
    const bookCover = document.querySelector('.book-cover');
    
    // Spell casting functionality
    castButtons.forEach(button => {
        button.addEventListener('click', function() {
            const spellName = this.dataset.spell;
            
            // Check for available spell slots
            const availableSlot = Array.from(spellSlots).find(slot => 
                !slot.classList.contains('used') && 
                slot.closest('.slot-level').querySelector('.level-label').textContent.includes(
                    spellName === 'fireball' ? 'Level 3' : 'Level 1'
                )
            );
            
            if (availableSlot) {
                // Cast spell
                availableSlot.classList.add('used');
                playSound('magic');
                
                // Spell-specific effects
                if (spellName === 'fireball') {
                    castFireballSpell(this);
                } else {
                    castIdentifySpell(this);
                }
                
                // Update UI
                this.textContent = 'Casting...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = 'Cast Spell';
                    this.disabled = false;
                    showNotification(`${spellName.charAt(0).toUpperCase() + spellName.slice(1)} spell cast successfully!`, '#8B5FBF');
                }, 2000);
                
                // Restore spell slots after cooldown
                setTimeout(() => {
                    availableSlot.classList.remove('used');
                    createParticles(availableSlot, 5, '#4A6FA5');
                }, 30000); // 30 second cooldown
            } else {
                // No spell slots available
                playSound('click');
                this.textContent = 'No Slots!';
                this.style.background = 'linear-gradient(135deg, #C53030 0%, #F56565 100%)';
                
                setTimeout(() => {
                    this.textContent = 'Cast Spell';
                    this.style.background = 'linear-gradient(135deg, #8B5FBF 0%, #4A6FA5 100%)';
                }, 1000);
                
                showNotification('Not enough spell slots! Wait for them to recharge.', '#C53030');
            }
        });
    });
    
    // Book cover interaction
    bookCover.addEventListener('click', function() {
        this.style.transform = 'rotateY(180deg)';
        setTimeout(() => {
            this.style.transform = 'rotateY(10deg)';
        }, 1000);
        playSound('click');
    });
}

function castFireballSpell(button) {
    // Create fireball animation
    const fireball = document.createElement('div');
    fireball.style.position = 'fixed';
    fireball.style.width = '50px';
    fireball.style.height = '50px';
    fireball.style.background = 'radial-gradient(circle, #FF6B00 0%, #FF0000 50%, transparent 70%)';
    fireball.style.borderRadius = '50%';
    fireball.style.boxShadow = '0 0 40px #FF6B00';
    fireball.style.zIndex = '1000';
    fireball.style.pointerEvents = 'none';
    
    // Position at button
    const rect = button.getBoundingClientRect();
    fireball.style.left = `${rect.left + rect.width / 2}px`;
    fireball.style.top = `${rect.top + rect.height / 2}px`;
    
    document.body.appendChild(fireball);
    
    // Animate to center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    fireball.animate([
        { 
            transform: 'translate(0, 0) scale(1)',
            opacity: 1
        },
        { 
            transform: `translate(${centerX - rect.left - rect.width / 2}px, ${centerY - rect.top - rect.height / 2}px) scale(3)`,
            opacity: 0.8
        },
        { 
            transform: `translate(${centerX - rect.left - rect.width / 2}px, ${centerY - rect.top - rect.height / 2}px) scale(10)`,
            opacity: 0
        }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
    });
    
    // Explosion effect
    setTimeout(() => {
        createParticlesAt(centerX, centerY, 50, '#FF6B00');
        document.body.style.backgroundColor = '#FF6B00';
        setTimeout(() => {
            document.body.style.backgroundColor = '';
        }, 100);
        
        // Screen shake
        document.querySelector('.parchment-container').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.querySelector('.parchment-container').style.animation = '';
        }, 500);
    }, 800);
    
    // Remove fireball element
    setTimeout(() => {
        fireball.remove();
    }, 1000);
}

function castIdentifySpell(button) {
    // Create identify spell effect (reveal hidden information)
    const items = document.querySelectorAll('.inventory-slot.filled');
    const statCards = document.querySelectorAll('.stat-card');
    
    // Highlight inventory items
    items.forEach(item => {
        setTimeout(() => {
            item.style.boxShadow = '0 0 20px #4A6FA5';
            createParticles(item, 3, '#4A6FA5');
        }, Math.random() * 500);
    });
    
    // Highlight stat cards
    statCards.forEach(card => {
        setTimeout(() => {
            card.style.boxShadow = '0 0 15px #8B5FBF';
            createParticles(card, 2, '#8B5FBF');
        }, Math.random() * 500 + 500);
    });
    
    // Remove highlights after delay
    setTimeout(() => {
        items.forEach(item => {
            item.style.boxShadow = '';
        });
        statCards.forEach(card => {
            card.style.boxShadow = '';
        });
    }, 3000);
    
    // Reveal hidden stats
    showNotification('Identify spell reveals hidden properties of items and stats!', '#4A6FA5');
}

function animateSpellbookOpen() {
    const bookCover = document.querySelector('.book-cover');
    const pages = document.querySelectorAll('.page');
    
    // Animate book opening
    bookCover.style.transition = 'transform 1s ease';
    bookCover.style.transform = 'rotateY(30deg)';
    
    // Animate pages
    pages.forEach((page, index) => {
        page.style.transition = 'transform 1s ease';
        page.style.transform = `rotateY(${index === 0 ? -15 : 15}deg)`;
    });
    
    // Magical glow
    const spellbook = document.querySelector('.spellbook');
    spellbook.style.boxShadow = '0 0 40px rgba(139, 95, 191, 0.5)';
    
    setTimeout(() => {
        spellbook.style.boxShadow = '';
    }, 2000);
}

// Theme Toggle System
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            this.textContent = 'Light Theme';
            showNotification('Dark theme activated. The shadows welcome you.', '#1A1A1A');
        } else {
            this.textContent = 'Dark Theme';
            showNotification('Light theme activated. The parchment glows warmly.', '#F5E9D3');
        }
        
        playSound('click');
        createParticles(this, 15, body.classList.contains('dark-theme') ? '#1A1A1A' : '#D4AF37');
        
        // Update border colors for theme
        const borders = document.querySelectorAll('.pixel-border');
        borders.forEach(border => {
            border.style.transition = 'background 0.5s ease';
            setTimeout(() => {
                border.style.transition = '';
            }, 500);
        });
    });
}

// Sound System
function initSoundSystem() {
    const soundToggle = document.getElementById('sound-toggle');
    const audioElements = {
        hover: document.getElementById('hover-sound'),
        click: document.getElementById('click-sound'),
        magic: document.getElementById('magic-sound')
    };
    
    let soundEnabled = true;
    
    // Set volume levels
    Object.values(audioElements).forEach(audio => {
        audio.volume = 0.3;
    });
    
    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        this.textContent = `Sound: ${soundEnabled ? 'ON' : 'OFF'}`;
        playSound('click');
        
        if (!soundEnabled) {
            showNotification('Sound disabled. The world falls silent.', '#4A6FA5');
        } else {
            showNotification('Sound enabled. Adventure awaits!', '#D4AF37');
        }
    });
    
    // Export playSound function
    window.playSound = function(type) {
        if (!soundEnabled || !audioElements[type]) return;
        
        // Clone and play to allow overlapping sounds
        const audio = audioElements[type].cloneNode();
        audio.volume = type === 'magic' ? 0.4 : 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    };
}

// Particle Effects System
function initParticleEffects() {
    // Initialize party.js library
    window.createParticles = function(element, count, color) {
        if (typeof party === 'undefined') return;
        
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        party.scene.current.createParticles(x, y, {
            count: count,
            velocity: () => party.Vector.randomPolar(100),
            color: color ? [color] : ['#D4AF37', '#4A6FA5', '#8B5FBF'],
            size: () => party.random(2, 6),
            lifespan: 1
        });
    };
    
    window.createParticlesAt = function(x, y, count, color) {
        if (typeof party === 'undefined') return;
        
        party.scene.current.createParticles(x, y, {
            count: count,
            velocity: () => party.Vector.randomPolar(200),
            color: color ? [color] : ['#D4AF37', '#4A6FA5', '#8B5FBF'],
            size: () => party.random(3, 8),
            lifespan: 2
        });
    };
}

function createParchmentEffect(element) {
    // Create parchment crinkle animation
    element.style.transform = 'scale(0.98)';
    
    const crinkle = document.createElement('div');
    crinkle.style.position = 'absolute';
    crinkle.style.top = '0';
    crinkle.style.left = '0';
    crinkle.style.width = '100%';
    crinkle.style.height = '100%';
    crinkle.style.background = 'radial-gradient(circle at 50% 50%, rgba(245, 233, 211, 0.3) 0%, transparent 70%)';
    crinkle.style.borderRadius = 'inherit';
    crinkle.style.pointerEvents = 'none';
    crinkle.style.opacity = '0';
    crinkle.style.zIndex = '1';
    
    element.appendChild(crinkle);
    
    crinkle.animate([
        { opacity: 0, transform: 'scale(0.5)' },
        { opacity: 0.5, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.5)' }
    ], {
        duration: 600,
        easing: 'ease-out'
    });
    
    setTimeout(() => {
        element.style.transform = '';
        crinkle.remove();
    }, 600);
}

function createStatPopup(stat, value, modifier) {
    const popup = document.createElement('div');
    popup.className = 'stat-popup';
    popup.innerHTML = `
        <div class="popup-header">${stat}</div>
        <div class="popup-value">${value}</div>
        <div class="popup-modifier">${modifier}</div>
    `;
    
    popup.style.position = 'fixed';
    popup.style.background = 'linear-gradient(135deg, #3A2618 0%, #543D2B 100%)';
    popup.style.color = '#F5E9D3';
    popup.style.padding = '12px 20px';
    popup.style.borderRadius = '8px';
    popup.style.border = '2px solid #D4AF37';
    popup.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000';
    popup.style.fontFamily = "'Press Start 2P', cursive";
    popup.style.fontSize = '14px';
    popup.style.textAlign = 'center';
    popup.style.transform = 'translate(-50%, -100%)';
    popup.style.pointerEvents = 'none';
    
    // Position at mouse
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    popup.style.left = `${mouseX}px`;
    popup.style.top = `${mouseY - 10}px`;
    
    document.body.appendChild(popup);
    
    // Animate
    popup.animate([
        { opacity: 0, transform: 'translate(-50%, -100%) scale(0.8)' },
        { opacity: 1, transform: 'translate(-50%, -100%) scale(1)' },
        { opacity: 0, transform: 'translate(-50%, -150%) scale(0.8)' }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    
    setTimeout(() => popup.remove(), 1000);
}

// Immersion Mode
function initImmersionMode() {
    const immersionToggle = document.getElementById('immersion-toggle');
    let immersionActive = false;
    
    immersionToggle.addEventListener('click', function() {
        immersionActive = !immersionActive;
        
        if (immersionActive) {
            activateImmersionMode();
            this.textContent = 'Exit Immersion';
            showNotification('Immersion mode activated. The adventure begins...', '#3A2618');
        } else {
            deactivateImmersionMode();
            this.textContent = 'Immersion Mode';
            showNotification('Immersion mode deactivated.', '#4A6FA5');
        }
        
        playSound('magic');
    });
}

function activateImmersionMode() {
    const body = document.body;
    const mainContainer = document.querySelector('.parchment-container');
    
    // Add immersive effects
    body.style.overflow = 'hidden';
    mainContainer.style.transform = 'scale(0.95)';
    mainContainer.style.transition = 'transform 0.5s ease';
    
    // Add ambient lighting
    const ambientLight = document.createElement('div');
    ambientLight.id = 'ambient-light';
    ambientLight.style.position = 'fixed';
    ambientLight.style.top = '0';
    ambientLight.style.left = '0';
    ambientLight.style.width = '100%';
    ambientLight.style.height = '100%';
    ambientLight.style.background = 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)';
    ambientLight.style.pointerEvents = 'none';
    ambientLight.style.zIndex = '1';
    body.appendChild(ambientLight);
    
    // Add flickering candle effect
    const flickerInterval = setInterval(() => {
        ambientLight.style.opacity = Math.random() * 0.5 + 0.5;
    }, 300);
    
    // Store interval ID for cleanup
    window.immersionInterval = flickerInterval;
    
    // Add keyboard shortcut to exit (Escape key)
    const exitImmersion = (e) => {
        if (e.key === 'Escape') {
            document.getElementById('immersion-toggle').click();
        }
    };
    
    document.addEventListener('keydown', exitImmersion);
    window.immersionKeyHandler = exitImmersion;
}

function deactivateImmersionMode() {
    const body = document.body;
    const mainContainer = document.querySelector('.parchment-container');
    
    // Remove immersive effects
    body.style.overflow = '';
    mainContainer.style.transform = '';
    
    // Remove ambient light
    const ambientLight = document.getElementById('ambient-light');
    if (ambientLight) ambientLight.remove();
    
    // Clear flicker interval
    if (window.immersionInterval) {
        clearInterval(window.immersionInterval);
    }
    
    // Remove keyboard listener
    if (window.immersionKeyHandler) {
        document.removeEventListener('keydown', window.immersionKeyHandler);
    }
}

// Notification System
function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = color;
    notification.style.color = '#F5E9D3';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '8px';
    notification.style.border = '2px solid #D4AF37';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    notification.style.zIndex = '1000';
    notification.style.fontFamily = "'VT323', monospace";
    notification.style.fontSize = '18px';
    notification.style.transform = 'translateX(120%)';
    notification.style.transition = 'transform 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Page Load Animations
function initPageAnimations() {
    // Staggered fade-in for elements
    const elements = document.querySelectorAll('.content-section.active *');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            
            // Remove transition after animation
            setTimeout(() => {
                el.style.transition = '';
            }, 500);
        }, index * 30);
    });
    
    // Welcome notification
    setTimeout(() => {
        showNotification('Welcome to Arcane Chronicles! Your adventure begins...', '#4A6FA5');
        playSound('magic');
        
        // Initial particle effect
        if (typeof party !== 'undefined') {
            party.scene.current.createParticles(window.innerWidth / 2, window.innerHeight / 2, {
                count: 100,
                velocity: () => party.Vector.randomPolar(150),
                color: ['#D4AF37', '#4A6FA5', '#8B5FBF'],
                size: () => party.random(3, 8),
                lifespan: 2
            });
        }
    }, 1000);
}

// Add CSS animations for dynamic effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .notification {
        pointer-events: none;
    }
    
    .stat-popup {
        pointer-events: none;
    }
`;
document.head.appendChild(styleSheet);

// Export utility functions
window.utils = {
    playSound: window.playSound,
    createParticles: window.createParticles,
    showNotification: showNotification
};