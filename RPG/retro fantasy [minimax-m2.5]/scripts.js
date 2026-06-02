/* ============================================
THE ENCHANTED GRIMOIRE - Retro Fantasy RPG JavaScript
================================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initMagicParticles();
    initSpellSystem();
    initQuestInteractions();
    initInventoryEffects();
    initModalSystem();
    initStatAnimations();
    initKeyboardShortcuts();
    initEasterEggs();
});

/* ============================================
MAGIC PARTICLE SYSTEM
================================================ */
function initMagicParticles() {
    const particlesContainer = document.getElementById('magicParticles');
    if (!particlesContainer) return;
    
    const particleCount = 25;
    const colors = ['#f4a820', '#d4a017', '#f4d03f', '#8e44ad', '#3498db'];
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, colors);
    }
    
    // Add new particles periodically
    setInterval(function() {
        if (particlesContainer.children.length < 40) {
            createParticle(particlesContainer, colors);
        }
    }, 2000);
}

function createParticle(container, colors) {
    const particle = document.createElement('div');
    particle.className = 'magic-particle';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.setProperty('--particle-color', color);
    particle.style.left = Math.random() * 100 + '%';
    particle.style.background = color;
    particle.style.boxShadow = '0 0 6px ' + color + ', 0 0 12px ' + color;
    particle.style.animationDuration = (6 + Math.random() * 6) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(function() {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 12000);
}

/* ============================================
SPELL SYSTEM
================================================ */
const spellDatabase = {
    fireball: {
        name: 'Fireball',
        icon: '🔥',
        description: 'Hurl a devastating ball of flame that explodes on impact, dealing massive fire damage to all enemies in the area.',
        school: 'Pyromancy',
        cost: 40,
        damage: '80-120 Fire',
        range: '150 ft',
        castTime: '3 seconds',
        cooldown: '8 seconds',
        color: '#e85d04'
    },
    frost: {
        name: 'Frost Nova',
        icon: '❄',
        description: 'Release a freezing blast of cold energy that slows all nearby enemies and deals frost damage.',
        school: 'Cryomancy',
        cost: 35,
        damage: '40-60 Frost',
        range: '30 ft',
        castTime: 'Instant',
        cooldown: '12 seconds',
        color: '#48cae4'
    },
    heal: {
        name: 'Greater Heal',
        icon: '✨',
        description: 'Channel divine energy to restore a large amount of health to your target.',
        school: 'Divine',
        cost: 60,
        damage: 'Heal: 150-200',
        range: '60 ft',
        castTime: '2.5 seconds',
        cooldown: '10 seconds',
        color: '#f8f9fa'
    },
    shadow: {
        name: 'Shadow Bolt',
        icon: '🌑',
        description: 'Launch a bolt of dark energy that pierces through enemies, dealing shadow damage.',
        school: 'Necromancy',
        cost: 25,
        damage: '50-75 Shadow',
        range: '120 ft',
        castTime: '1.5 seconds',
        cooldown: '3 seconds',
        color: '#7209b7'
    },
    lightning: {
        name: 'Chain Lightning',
        icon: '⚡',
        description: 'Unleash lightning that arcs between multiple enemies, striking up to 5 targets.',
        school: 'Storm',
        cost: 55,
        damage: '60-90 Lightning',
        range: '100 ft',
        castTime: '2 seconds',
        cooldown: '6 seconds',
        color: '#ffbe0b'
    },
    summon: {
        name: 'Summon Familiar',
        icon: '🌿',
        description: 'Call forth a magical companion to assist you in battle. The familiar inherits some of your abilities.',
        school: 'Nature',
        cost: 80,
        damage: 'Utility',
        range: 'Self',
        castTime: '5 seconds',
        cooldown: '60 seconds',
        color: '#2d6a4f'
    }
};

function initSpellSystem() {
    const spellCards = document.querySelectorAll('.spell-card');
    spellCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const spellId = card.dataset.spell;
            openSpellModal(spellId);
        });
    });
}

function openSpellModal(spellId) {
    const modal = document.getElementById('spellModal');
    const spell = spellDatabase[spellId];
    if (!spell) return;
    
    const modalIcon = modal.querySelector('.modal-spell-icon');
    const modalName = modal.querySelector('.modal-spell-name');
    const modalDesc = modal.querySelector('.modal-spell-desc');
    
    modalIcon.textContent = spell.icon;
    modalIcon.style.textShadow = '0 0 30px ' + spell.color;
    modalName.textContent = spell.name;
    modalName.style.color = spell.color;
    modalDesc.innerHTML = '<strong>' + spell.school + '</strong><br><br>' + 
        spell.description + '<br><br><em>Cost: ' + spell.cost + ' MP | Damage: ' + spell.damage + 
        '<br>Range: ' + spell.range + ' | Cast Time: ' + spell.castTime + 
        '<br>Cooldown: ' + spell.cooldown + '</em>';
    
    modal.classList.add('active');
    
    // Add spell-specific border glow
    modal.querySelector('.modal-content').style.borderColor = spell.color;
    modal.querySelector('.modal-content').style.boxShadow = '0 0 50px ' + spell.color + '40, 0 20px 60px rgba(0,0,0,0.7)';
}

function closeSpellModal() {
    const modal = document.getElementById('spellModal');
    modal.classList.remove('active');
}

/* ============================================
QUEST INTERACTION SYSTEM
================================================ */
function initQuestInteractions() {
    const questNotices = document.querySelectorAll('.quest-notice');
    questNotices.forEach(function(notice) {
        notice.addEventListener('click', function() {
            // Remove active class from all notices
            questNotices.forEach(function(n) {
                n.classList.remove('active-notice');
            });
            // Add to clicked notice
            notice.classList.add('active-notice');
            // Visual feedback
            notice.style.transform = 'scale(1.02) rotate(0deg) !important';
        });
    });
    
    // Quest step interactions
    const questSteps = document.querySelectorAll('.quest-step');
    questSteps.forEach(function(step) {
        step.addEventListener('click', function() {
            if (!step.classList.contains('completed')) {
                // Toggle active state
                questSteps.forEach(function(s) {
                    s.classList.remove('active');
                });
                step.classList.add('active');
                // Play a subtle animation
                step.style.animation = 'step-click 0.3s ease';
                setTimeout(function() {
                    step.style.animation = '';
                }, 300);
            }
        });
    });
}

/* ============================================
INVENTORY EFFECTS
================================================ */
function initInventoryEffects() {
    const invSlots = document.querySelectorAll('.inv-slot');
    invSlots.forEach(function(slot) {
        slot.addEventListener('click', function() {
            if (slot.classList.contains('filled')) {
                // Play item selection sound effect (visual only)
                slot.style.animation = 'item-select 0.3s ease';
                setTimeout(function() {
                    slot.style.animation = '';
                }, 300);
            }
        });
        
        // Add shimmer effect on hover
        slot.addEventListener('mouseenter', function() {
            if (slot.classList.contains('filled')) {
                createShimmerEffect(slot);
            }
        });
    });
}

function createShimmerEffect(element) {
    const shimmer = document.createElement('div');
    shimmer.style.cssText = 'position: absolute; top: 0; left: -100%; width: 50%; height: 100%; ' +
        'background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); ' +
        'transform: skewX(-20deg); animation: shimmer 1s ease; pointer-events: none;';
    element.appendChild(shimmer);
    setTimeout(function() {
        if (shimmer.parentNode) shimmer.parentNode.removeChild(shimmer);
    }, 1000);
}

/* ============================================
MODAL SYSTEM
================================================ */
function initModalSystem() {
    const modal = document.getElementById('spellModal');
    const closeBtn = modal.querySelector('.modal-close');
    const castBtn = modal.querySelector('.cast-button');
    
    closeBtn.addEventListener('click', closeSpellModal);
    castBtn.addEventListener('click', castSpell);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSpellModal();
        }
    });
}

function castSpell() {
    const modal = document.getElementById('spellModal');
    const spellName = modal.querySelector('.modal-spell-name').textContent;
    const castBtn = modal.querySelector('.cast-button');
    
    // Visual feedback for casting
    castBtn.textContent = '✨ Casting...';
    castBtn.disabled = true;
    
    // Simulate casting delay
    setTimeout(function() {
        castBtn.textContent = '✓ Spell Cast!';
        castBtn.style.background = 'linear-gradient(145deg, #2d6a4f, #1b4332)';
        
        setTimeout(function() {
            closeSpellModal();
            // Reset button
            castBtn.textContent = 'Cast Spell';
            castBtn.disabled = false;
            castBtn.style.background = '';
        }, 1000);
    }, 1500);
    
    // Create casting effect on the page
    createCastingEffect();
}

function createCastingEffect() {
    // Create a burst effect at center of screen
    const effect = document.createElement('div');
    effect.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); ' +
        'width: 10px; height: 10px; border-radius: 50%; ' +
        'background: radial-gradient(circle, rgba(244,168,32,0.8) 0%, transparent 70%); ' +
        'animation: casting-burst 1s ease-out forwards; pointer-events: none; z-index: 2000;';
    document.body.appendChild(effect);
    
    setTimeout(function() {
        if (effect.parentNode) effect.parentNode.removeChild(effect);
    }, 1000);
}

/* ============================================
STAT BAR ANIMATIONS
================================================ */
function initStatAnimations() {
    // Animate stat bars on page load
    const statFills = document.querySelectorAll('.stat-fill');
    statFills.forEach(function(fill, index) {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        setTimeout(function() {
            fill.style.width = targetWidth;
        }, 100 + (index * 150));
    });
    
    // Animate gold counter
    const goldAmount = document.querySelector('.gold-amount');
    if (goldAmount) {
        const targetGold = parseInt(goldAmount.textContent.replace(/,/g, ''));
        let currentGold = 0;
        const increment = targetGold / 30;
        var counter = setInterval(function() {
            currentGold += increment;
            if (currentGold >= targetGold) {
                currentGold = targetGold;
                clearInterval(counter);
            }
            goldAmount.textContent = Math.floor(currentGold).toLocaleString();
        }, 50);
    }
}

/* ============================================
KEYBOARD SHORTCUTS
================================================ */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC to close modal
        if (e.key === 'Escape') {
            closeSpellModal();
        }
        // Number keys to quick-cast spells
        var num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
            var spellCards = document.querySelectorAll('.spell-card');
            if (spellCards[num - 1]) {
                spellCards[num - 1].click();
            }
        }
    });
}

/* ============================================
EASTER EGGS
================================================ */
function initEasterEggs() {
    // Secret keystroke: Press 'G' rapidly for a special effect
    var gPressCount = 0;
    var gTimeout;
    
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'g') {
            gPressCount++;
            clearTimeout(gTimeout);
            gTimeout = setTimeout(function() {
                gPressCount = 0;
            }, 1000);
            
            if (gPressCount >= 5) {
                triggerGoldenRain();
                gPressCount = 0;
            }
        }
    });
}

function triggerGoldenRain() {
    var i;
    for (i = 0; i < 30; i++) {
        (function(index) {
            setTimeout(function() {
                var particle = document.createElement('div');
                var items = ['🪙', '💰', '✨', '⭐'];
                particle.style.cssText = 'position: fixed; top: -20px; left: ' + (Math.random() * 100) + '%; ' +
                    'font-size: 1.5rem; animation: gold-rain ' + (2 + Math.random() * 2) + 's linear forwards; ' +
                    'pointer-events: none; z-index: 999;';
                particle.textContent = items[Math.floor(Math.random() * items.length)];
                document.body.appendChild(particle);
                
                setTimeout(function() {
                    if (particle.parentNode) particle.parentNode.removeChild(particle);
                }, 4000);
            }, index * 100);
        })(i);
    }
}

/* ============================================
ADDITIONAL CSS ANIMATIONS (Injected)
================================================ */
var additionalStyles = document.createElement('style');
additionalStyles.textContent = '' +
    '@keyframes shimmer {' +
    '  0% { left: -100%; }' +
    '  100% { left: 200%; }' +
    '}' +
    '@keyframes item-select {' +
    '  0%, 100% { transform: scale(1); }' +
    '  50% { transform: scale(0.95); box-shadow: 0 0 20px var(--magic-amber); }' +
    '}' +
    '@keyframes step-click {' +
    '  0%, 100% { transform: translateX(0); }' +
    '  50% { transform: translateX(5px); }' +
    '}' +
    '@keyframes casting-burst {' +
    '  0% { width: 10px; height: 10px; opacity: 1; }' +
    '  100% { width: 500px; height: 500px; opacity: 0; }' +
    '}' +
    '.active-notice { border: 2px solid var(--magic-amber) !important; box-shadow: 0 0 20px var(--magic-amber-glow) !important; }' +
    '.quest-notice:active { transform: scale(0.98); }' +
    '@keyframes gold-rain {' +
    '  0% { transform: translateY(0) rotate(0deg); opacity: 1; }' +
    '  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }' +
    '}';
document.head.appendChild(additionalStyles);