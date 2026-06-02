/**
 * THE ARCANE CODEX - Scripts
 * "Magic is merely the art of bending reality to one's will"
 */

// ═════════════════════════════════════════════════════════════════
// ARCANE SYSTEM INITIALIZATION
// ═════════════════════════════════════════════════════════════════

const ArcaneCodex = {
    state: {
        level: 42,
        hp: { current: 85, max: 100 },
        mp: { current: 60, max: 100 },
        gold: 1240,
        xp: 84500,
        inventory: [],
        quests: [],
        audioEnabled: false
    },
    
    init() {
        console.log('%c⚔️ The Arcane Codex awakens...', 'color: #b87333; font-size: 14px; font-weight: bold;');
        
        this.initCursor();
        this.initParticles();
        this.initDragDrop();
        this.initStats();
        this.initQuests();
        this.initSpells();
        this.initTabs();
        this.initTooltips();
        this.initAudio();
        
        // Initial animations
        this.animateEntrance();
    }
};

// ═════════════════════════════════════════════════════════════════
// CUSTOM CURSOR SYSTEM
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.initCursor = function() {
    const cursor = document.querySelector('.custom-cursor');
    const interactiveElements = document.querySelectorAll('button, .stat-box, .item, .quest-card, .spell-card, .tab-btn, .equip-slot, .inv-slot');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor follow
    const animateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    animateCursor();
    
    // Interactive states
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
};

// ═════════════════════════════════════════════════════════════════
// PARTICLE SYSTEM - Magical Ambience
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.initParticles = function() {
    const container = document.getElementById('particles');
    const particleCount = 30;
    const particles = [];
    
    class Particle {
        constructor() {
            this.element = document.createElement('div');
            this.element.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: ${Math.random() > 0.5 ? '#e69b5c' : '#39ff14'};
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.2};
                pointer-events: none;
                box-shadow: 0 0 ${Math.random() * 10 + 5}px currentColor;
            `;
            this.reset();
            container.appendChild(this.element);
        }
        
        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.life = Math.random() * 100 + 100;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            
            // Gentle floating motion
            this.vx += (Math.random() - 0.5) * 0.02;
            this.vy += (Math.random() - 0.5) * 0.02;
            
            // Bounds wrapping
            if (this.x < 0) this.x = window.innerWidth;
            if (this.x > window.innerWidth) this.x = 0;
            if (this.y < 0) this.y = window.innerHeight;
            if (this.y > window.innerHeight) this.y = 0;
            
            if (this.life <= 0) this.reset();
            
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.opacity = (this.life / 200) * 0.5;
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
        particles.forEach(p => p.update());
        requestAnimationFrame(animate);
    };
    animate();
};

// ═════════════════════════════════════════════════════════════════
// DRAG & DROP INVENTORY SYSTEM
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.initDragDrop = function() {
    let draggedItem = null;
    let originalSlot = null;
    
    const items = document.querySelectorAll('.item');
    const slots = document.querySelectorAll('.inv-slot, .equip-slot');
    
    items.forEach(item => {
        item.setAttribute('draggable', true);
        
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            originalSlot = item.parentElement;
            item.style.opacity = '0.5';
            
            // Create custom drag image if needed
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', item.outerHTML);
        });
        
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            draggedItem = null;
            
            // Remove all drag-over states
            slots.forEach(slot => slot.classList.remove('drag-over'));
        });
    });
    
    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            slot.classList.add('drag-over');
        });
        
        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });
        
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            if (draggedItem && slot !== originalSlot) {
                // Check if slot is empty or swap
                const existingItem = slot.querySelector('.item');
                
                if (existingItem) {
                    // Swap items
                    originalSlot.appendChild(existingItem);
                }
                
                slot.appendChild(draggedItem);
                slot.classList.remove('empty');
                if (!originalSlot.querySelector('.item')) {
                    originalSlot.classList.add('empty');
                }
                
                // Play subtle sound effect (visual feedback for now)
                this.triggerItemGlow(draggedItem);
            }
        });
    });
};

ArcaneCodex.triggerItemGlow = function(item) {
    item.style.animation = 'none';
    setTimeout(() => {
        item.style.animation = 'legendary-pulse 0.5s ease';
    }, 10);
};

// ═════════════════════════════════════════════════════════════════
// STATS & DICE ROLLING
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.initStats = function() {
    const statBoxes = document.querySelectorAll('.stat-box');
    const modal = document.getElementById('dice-roll-modal');
    const closeBtn = modal.querySelector('.close-modal');
    
    statBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const stat = box.dataset.stat;
            const value = parseInt(box.dataset.value);
            this.rollStatCheck(stat, value);
        });
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
};

ArcaneCodex.rollStatCheck = function(statName, statValue) {
    const modal = document.getElementById('dice-roll-modal');
    const dice = document.getElementById('rolling-dice');
    const result = document.getElementById('roll-result');
    const detail = document.getElementById('roll-detail');
    
    modal.classList.remove('hidden');
    
    // Animate dice
    let rolls = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
        dice.textContent = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][Math.floor(Math.random() * 6)];
        rolls++;
        
        if (rolls >= maxRolls) {
            clearInterval(rollInterval);
            
            // Calculate final roll (d20 + modifier)
            const d20 = Math.floor(Math.random() * 20) + 1;
            const modifier = Math.floor((statValue - 10) / 2);
            const total = d20 + modifier;
            
            // Display results
            dice.textContent = '🎲';
            result.textContent = total;
            
            // Determine success level
            let message = '';
            if (d20 === 20) message = '✨ CRITICAL SUCCESS! Natural 20!';
            else if (d20 === 1) message = '💀 CRITICAL FAILURE! Natural 1!';
            else if (total >= 20) message = '✓ Legendary Success!';
            else if (total >= 15) message = '✓ Solid Success!';
            else if (total >= 10) message = '↻ Marginal Success';
            else message = '✗ Failed...';
            
            detail.textContent = `${statName.toUpperCase()} Check: d20(${d20}) + ${modifier} = ${total} — ${message}`;
            
            // Update stat bar visual feedback
            const statBox = document.querySelector(`[data-stat="${statName}"]`);
            statBox.style.borderColor = d20 === 20 ? '#39ff14' : d20 === 1 ? '#8b0000' : '#b87333';
            setTimeout(() => {
                statBox.style.borderColor = '';
            }, 1000);
        }
    }, 50);
};

// ═════════════════════════════════════════════════════════════════
// QUEST SYSTEM
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.initQuests = function() {
    const pins = document.querySelectorAll('.quest-pin');
    const questCards = document.querySelectorAll('.quest-card');
    
    pins.forEach(pin => {
        pin.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = pin.closest('.quest-card');
            
            // Toggle pinned state
            if (card.style.transform.includes('rotate(0deg)')) {
                card.style.transform = 'rotate(-2deg)';
                pin.style.transform = 'scale(1)';
            } else {
                card.style.transform = 'rotate(0deg) scale(1.02)';
                pin.style.transform = 'scale(1.2)';
            }
            
            // Visual feedback
            this.createSparkle(pin);
        });
    });
    
    questCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle progress visibility or details
            const progress = card.querySelector('.quest-progress-container');
            progress.style.opacity = progress.style.opacity === '0' ? '1' : '0.7';
        });
    });
};

ArcaneCodex.createSparkle = function(element) {
    const rect = element.getBoundingClientRect();
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width/2}px;
        top: ${rect.top}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 10000;
        animation: float 0.5s ease-out forwards;
    `;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 500);
};

// ═════════════════════════════════════════════════════════════════
// SPELL GRIMOIRE
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.initSpells = function() {
    const spellCards = document.querySelectorAll('.spell-card:not(.locked)');
    
    spellCards.forEach(card => {
        card.addEventListener('click', () => {
            const cost = parseInt(card.dataset.cost);
            const spellName = card.dataset.spell;
            
            if (this.state.mp.current >= cost) {
                this.castSpell(card, cost);
            } else {
                this.showInsufficientMana(card);
            }
        });
    });
};

ArcaneCodex.castSpell = function(card, cost) {
    // Deduct mana
    this.state.mp.current -= cost;
    this.updateResourceBars();
    
    // Visual effects
    card.style.animation = 'legendary-pulse 0.5s ease';
    setTimeout(() => card.style.animation = '', 500);
    
    // Create casting particles
    const rect = card.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width/2}px;
                top: ${rect.top + rect.height/2}px;
                width: 10px;
                height: 10px;
                background: #39ff14;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                box-shadow: 0 0 10px #39ff14;
            `;
            document.body.appendChild(particle);
            
            // Animate outward
            const angle = (Math.PI * 2 * i) / 5;
            const velocity = 100;
            let x = 0, y = 0;
            
            const animate = () => {
                x += Math.cos(angle) * 5;
                y += Math.sin(angle) * 5;
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = parseFloat(particle.style.opacity || 1) - 0.05;
                
                if (particle.style.opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            requestAnimationFrame(animate);
        }, i * 50);
    }
    
    console.log(`%c✦ Cast ${card.querySelector('.spell-name').textContent} — ${cost} MP`, 'color: #39ff14');
};

ArcaneCodex.showInsufficientMana = function(card) {
    card.style.animation = 'shake 0.5s ease';
    setTimeout(() => card.style.animation = '', 500);
};

ArcaneCodex.updateResourceBars = function() {
    const hpFill = document.getElementById('hp-fill');
    const mpFill = document.getElementById('mp-fill');
    const hpCurrent = document.getElementById('hp-current');
    const mpCurrent = document.getElementById('mp-current');
    
    hpFill.style.width = `${(this.state.hp.current / this.state.hp.max) * 100}%`;
    mpFill.style.width = `${(this.state.mp.current / this.state.mp.max) * 100}%`;
    
    hpCurrent.textContent = this.state.hp.current;
    mpCurrent.textContent = this.state.mp.current;
};

// ═════════════════════════════════════════════════════════════════
// TAB NAVIGATION
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.initTabs = function() {
    const tabs = document.querySelectorAll('.tab-btn');
    const pages = document.querySelectorAll('.page');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active states
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-pressed', 'true');
            
            // Scroll to section on mobile, or highlight
            if (window.innerWidth < 1024) {
                const targetPage = document.querySelector(`[data-page="${targetTab}"]`);
                if (targetPage) {
                    targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
};

// ═════════════════════════════════════════════════════════════════
// TOOLTIP SYSTEM
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.initTooltips = function() {
    const tooltip = document.getElementById('tooltip');
    
    // Simple tooltip follow for elements with title
    document.querySelectorAll('[title]').forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const text = el.getAttribute('title');
            el.setAttribute('data-original-title', text);
            el.removeAttribute('title');
            
            tooltip.textContent = text;
            tooltip.classList.remove('hidden');
        });
        
        el.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        });
        
        el.addEventListener('mouseleave', () => {
            tooltip.classList.add('hidden');
            el.setAttribute('title', el.getAttribute('data-original-title'));
        });
    });
};

// ═════════════════════════════════════════════════════════════════
// AUDIO SYSTEM
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.initAudio = function() {
    const toggle = document.querySelector('.audio-toggle');
    const icon = toggle.querySelector('.audio-icon');
    
    toggle.addEventListener('click', () => {
        this.state.audioEnabled = !this.state.audioEnabled;
        
        if (this.state.audioEnabled) {
            icon.textContent = '🔊';
            toggle.style.background = '#39ff14';
            toggle.style.borderColor = '#39ff14';
            console.log('%c🔊 Ambient sounds enabled', 'color: #39ff14');
        } else {
            icon.textContent = '🔇';
            toggle.style.background = '';
            toggle.style.borderColor = '';
        }
    });
};

// ═════════════════════════════════════════════════════════════════
// ENTRANCE ANIMATION
// ═════════════════════════════════════════════════════════════════

ArcaneCodex.animateEntrance = function() {
    const elements = document.querySelectorAll('.stat-box, .item, .quest-card, .spell-card');
    
    elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = '';
        }, i * 50 + 500);
    });
};

// ═════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═════════════════════════════════════════════════════════════════

// Random ambient effects
setInterval(() => {
    if (Math.random() > 0.95) {
        const runes = document.querySelectorAll('.runic-title, .section-title');
        const randomRune = runes[Math.floor(Math.random() * runes.length)];
        randomRune.style.textShadow = '0 0 20px #e69b5c';
        setTimeout(() => {
            randomRune.style.textShadow = '';
        }, 1000);
    }
}, 3000);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('dice-roll-modal').classList.add('hidden');
    }
    // Roll random stat on 'r'
    if (e.key === 'r' || e.key === 'R') {
        const stats = document.querySelectorAll('.stat-box');
        const randomStat = stats[Math.floor(Math.random() * stats.length)];
        randomStat.click();
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ArcaneCodex.init();
});

// Add shake animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);