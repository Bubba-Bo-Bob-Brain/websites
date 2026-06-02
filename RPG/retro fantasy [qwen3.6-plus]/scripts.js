/**
 * THE GRIMOIRE OF LEGENDS — SCRIPTS
 * Handles animations, interactivity, and dynamic effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollReveal();
    initStatCounters();
    initInventory();
    initSpellbook();
    initNavigation();
    initQuestBoard();
    initHeroButton();
});

// ==========================================================================
// 1. PARTICLE SYSTEM
// Creates floating magical motes in the background.
// ==========================================================================
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Randomize properties
    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 0.5 + 0.1;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `-${delay}s`;
    particle.style.opacity = opacity;
    
    container.appendChild(particle);
}

// ==========================================================================
// 2. SCROLL REVEAL & OBSERVERS
// Handles elements entering the viewport.
// ==========================================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay if data-delay exists
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => observer.observe(el));
}

// ==========================================================================
// 3. STAT COUNTERS & BARS
// Animates numbers counting up and bars filling.
// ==========================================================================
function initStatCounters() {
    const statsSection = document.querySelector('.char-stats-panel');
    const vitalsSection = document.querySelector('.char-vitals-panel');
    const xpSection = document.querySelector('.char-experience');
    
    // Observer for Stats
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    if (statsSection) statObserver.observe(statsSection);

    // Observer for Vitals & XP
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateBars();
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (vitalsSection) barObserver.observe(vitalsSection);
    if (xpSection) barObserver.observe(xpSection);
}

function animateStats() {
    const statValues = document.querySelectorAll('.stat-value[data-target]');
    const statBars = document.querySelectorAll('.stat-bar-fill[data-width]');
    
    // Animate Numbers
    statValues.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        animateNumber(stat, 0, target, 1500);
    });
    
    // Animate Bars
    statBars.forEach(bar => {
        const width = bar.dataset.width;
        setTimeout(() => {
            bar.style.width = `${width}%`;
        }, 200);
    });
}

function animateBars() {
    const fills = document.querySelectorAll('.vital-fill[data-vital], .xp-fill[data-xp]');
    fills.forEach(fill => {
        const value = fill.dataset.vital || fill.dataset.xp;
        setTimeout(() => {
            fill.style.width = `${value}%`;
        }, 300);
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quart
        const ease = 1 - Math.pow(1 - progress, 4);
        
        const current = Math.floor(start + (end - start) * ease);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ==========================================================================
// 4. INVENTORY INTERACTION
// Updates the detail panel when an item is clicked.
// ==========================================================================
function initInventory() {
    const grid = document.getElementById('inventoryGrid');
    const detailPanel = document.getElementById('itemDetail');
    
    if (!grid || !detailPanel) return;

    // Item Database for richer detail
    const itemDatabase = {
        'sword': { name: 'Dawnblade', rarity: 'Legendary', type: 'Weapon', desc: 'A legendary sword forged in celestial fire. It hums with the power of the dawn.', stats: '+45 ATK, +10 Holy Dmg' },
        'shield': { name: 'Aegis of the Dawn', rarity: 'Epic', type: 'Shield', desc: 'Blessed by the high priests of Eldoria. Grants divine protection.', stats: '+30 DEF, +10 RES' },
        'helmet': { name: 'Crown of Valor', rarity: 'Epic', type: 'Armor', desc: 'Worn by the Paladin Kings of old. Grants immunity to fear.', stats: '+15 DEF, +5 WIS' },
        'armor': { name: 'Crusader Plate', rarity: 'Rare', type: 'Armor', desc: 'Heavy plate armor blessed for the crusade against darkness.', stats: '+55 DEF' },
        'potion': { name: 'Life Elixir', rarity: 'Rare', type: 'Consumable', desc: 'A glowing red potion. Restores full HP instantly.', stats: 'Heal 100%' },
        'ring': { name: 'Ring of Wisdom', rarity: 'Rare', type: 'Accessory', desc: 'Set with a sapphire that glows when magic is near.', stats: '+8 INT, +5 WIS' },
        'gem': { name: 'Dragon Eye Ruby', rarity: 'Legendary', type: 'Material', desc: 'A ruby cut from the eye of a drake. Pulsates with heat.', stats: 'Crafting Component' },
        'key': { name: 'Crypt Key', rarity: 'Quest Item', type: 'Key', desc: 'Iron key with skull motifs. Opens the Sunken Crypts.', stats: 'Quest Objective' },
        'default': { name: 'Unknown Item', rarity: 'Common', type: 'Item', desc: 'The properties of this item are unknown to you.', stats: '-' }
    };

    grid.addEventListener('click', (e) => {
        const slot = e.target.closest('.inv-slot');
        if (!slot || slot.classList.contains('inv-slot--empty')) {
            resetDetailPanel(detailPanel);
            return;
        }

        // Highlight selected
        document.querySelectorAll('.inv-slot').forEach(s => s.style.borderColor = '');
        const rarityColor = getComputedStyle(slot).getPropertyValue('--rarity-color') || 'var(--text-gold)';
        slot.style.borderColor = rarityColor; // Visual feedback

        // Get Data
        const itemKey = slot.dataset.item || 'default';
        const item = itemDatabase[itemKey] || itemDatabase['default'];

        // Update Panel
        updateDetailPanel(detailPanel, item);
    });
}

function updateDetailPanel(panel, item) {
    const titleEl = panel.querySelector('.item-detail-title');
    const descEl = panel.querySelector('.item-detail-desc');
    
    if (titleEl && descEl) {
        titleEl.innerHTML = `${item.name} <span style="font-size:0.7em; opacity:0.7">[${item.rarity}]</span>`;
        descEl.innerHTML = `<strong>Type:</strong> ${item.type}<br><strong>Stats:</strong> ${item.stats}<br><em>${item.desc}</em>`;
    }
}

function resetDetailPanel(panel) {
    const titleEl = panel.querySelector('.item-detail-title');
    const descEl = panel.querySelector('.item-detail-desc');
    
    if (titleEl && descEl) {
        titleEl.textContent = 'Select an Item';
        descEl.textContent = 'Click on any item in your inventory to view its properties and details.';
    }
}

// ==========================================================================
// 5. SPELLBOOK INTERACTION
// Toggles spell details on click.
// ==========================================================================
function initSpellbook() {
    const spellEntries = document.querySelectorAll('.spell-entry');
    
    spellEntries.forEach(entry => {
        entry.addEventListener('click', () => {
            // Close others
            spellEntries.forEach(other => {
                if (other !== entry) other.classList.remove('active');
            });
            // Toggle current
            entry.classList.toggle('active');
        });
    });

    // Page Navigation (Visual only for this demo)
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const container = document.querySelector('.spellbook-container');
    
    // Simple visual feedback for page buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            container.style.transform = 'rotateY(-5deg)';
            setTimeout(() => container.style.transform = 'rotateY(0)', 300);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            container.style.transform = 'rotateY(5deg)';
            setTimeout(() => container.style.transform = 'rotateY(0)', 300);
        });
    }
}

// ==========================================================================
// 6. NAVIGATION & SMOOTH SCROLL
// Highlights active section and handles anchor clicks.
// ==========================================================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');

    // Smooth Scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active State Highlighting
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}

// ==========================================================================
// 7. QUEST BOARD
// "Accept Quest" button interaction.
// ==========================================================================
function initQuestBoard() {
    const acceptBtns = document.querySelectorAll('.btn--accept');
    
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const questNotice = btn.closest('.quest-notice');
            if (!questNotice) return;
            
            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = 'Accepted!';
            btn.style.background = 'var(--accent-sta)';
            btn.style.borderColor = 'var(--accent-sta)';
            btn.style.color = '#fff';
            
            // Add a "Accepted" stamp or visual change
            questNotice.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.textContent = 'Active';
                btn.style.background = '#5a4a2a';
                btn.style.borderColor = '#5a4a2a';
            }, 1000);
        });
    });
}

// ==========================================================================
// 8. HERO BUTTON
// Scroll to character section.
// ==========================================================================
function initHeroButton() {
    const btn = document.getElementById('startQuestBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            const charSection = document.getElementById('character');
            if (charSection) {
                charSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}