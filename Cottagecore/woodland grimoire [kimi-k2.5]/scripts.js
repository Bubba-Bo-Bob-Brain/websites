/**
 * The Cottage Witch's Compendium - JavaScript
 * Interactive magic for the herbalist's grimoire
 */

// ═══════════════════════════════════════════════════════════════
// Data & Configuration
// ═══════════════════════════════════════════════════════════════

const potionRecipes = {
    moonlight: {
        title: "Dreamer's Draught",
        subtitle: "Moonlight Tincture",
        icon: "🌙",
        ingredients: [
            "3 tbsp dried mugwort",
            "1 tsp valerian root",
            "Honey to taste",
            "Spring water",
            "Silver vessel"
        ],
        instructions: "Gather ingredients under the new moon. Steep mugwort and valerian in heated spring water for thirteen minutes. Strain through linen into your silver vessel. Sweeten with honey while whispering your intentions. Drink before sleep for prophetic dreams.",
        warning: "Do not operate heavy enchantments while under its influence.",
        moonPhase: "New Moon"
    },
    sunshine: {
        title: "Vitality Philter",
        subtitle: "Solar Essence",
        icon: "☀️",
        ingredients: [
            "St. John's Wort flowers",
            "Lemon peel (organic)",
            "Ginger root",
            "Goldenrod",
            "Sun-charged water"
        ],
        instructions: "Harvest St. John's Wort at high noon on the summer solstice. Combine with grated ginger and lemon peel in a clear jar. Leave in direct sunlight for three days. Strain and store in amber glass. Take a spoonful when energy wanes.",
        warning: "May cause photosensitivity in fair-skinned folk.",
        moonPhase: "Solar Noon"
    },
    midnight: {
        title: "Witch's Sight",
        subtitle: "Shadow Brew",
        icon: "🔮",
        ingredients: [
            "Wormwood",
            "Rosemary (fresh)",
            "Datura seed (trace amount)",
            "Black tea",
            "Midnight dew"
        ],
        instructions: "Brew under the dark moon. Combine herbs in midnight dew collected from rosemary leaves. Simmer gently—never boil. Inhale the steam before divination. Enhances second sight and spirit communication.",
        warning: "TOXIC: For scrying only. Do not consume.",
        moonPhase: "Dark Moon"
    },
    rose: {
        title: "Cordial of Comfort",
        subtitle: "Heart's Blood",
        icon: "🌹",
        ingredients: [
            "Rose petals (wild)",
            "Vanilla bean",
            "Cinnamon stick",
            "Brandy or glycerin",
            "Pink quartz"
        ],
        instructions: "Layer rose petals with sugar in a jar, adding vanilla and cinnamon. Cover with brandy and seal with wax. Store with rose quartz for one moon cycle. Strain into heart-shaped bottles. Soothes heartache and anxiety.",
        warning: "Contains alcohol. Keep away from children and familiars.",
        moonPhase: "Waxing Moon"
    }
};

const seasonalData = {
    spring: {
        name: "Spring Awakening",
        herbs: "Nettle, Dandelion, Violets, Chickweed",
        icon: "🌱",
        description: "The earth stirs from slumber. Seek nettles in shady ditches wearing gloves—sting first, then heal. Dandelion greens cleanse the blood after winter's heaviness. Violets hide in mossy banks for soothing syrups.",
        foraging: "Best gathered in morning dew before the sun grows strong. Look for tender new growth on south-facing slopes.",
        preparations: "Spring tonics, cleansing teas, and flower essences."
    },
    summer: {
        name: "Summer's Bounty",
        herbs: "Chamomile, St. John's Wort, Roses, Lavender",
        icon: "☀️",
        description: "The meadows overflow with medicine. St. John's Wort blooms on solstice eve—harvest when petals bleed red. Lavender spikes should be cut just as flowers open. Roses are best gathered at dawn when scent peaks.",
        foraging: "Harvest flowering tops on dry days after morning dew has evaporated. Dry quickly in shade to preserve oils.",
        preparations: "Oils, hydrosols, and sun-infused elixirs."
    },
    autumn: {
        name: "Autumn Harvest",
        herbs: "Mugwort, Hawthorn, Elderberry, Rosehips",
        icon: "🍂",
        description: "The witch's busy season. Elderberries hang heavy in purple clusters—harvest before frost but after first chill. Mugwort turns silver beneath the harvest moon. Hawthorn berries offer heart protection for winter.",
        foraging: "Berries after first frost for sweetness. Roots after leaf-fall when energy descends. Seeds when pods rattle dry.",
        preparations: "Tinctures, immune syrups, and protective amulets."
    },
    winter: {
        name: "Winter's Sleep",
        herbs: "Pine, Juniper, Birch Bark, Witch Hazel",
        icon: "❄️",
        description: "The green world retreats but medicine remains. Pine needles offer vitamin C when fresh. Birch bark peels like paper from fallen trees. Juniper berries wait beneath snow for gin-makers and digestive bitters.",
        foraging: "Conifers remain accessible all winter. Collect bark from fallen branches only. Respect the dormancy of roots.",
        preparations: "Steam inhalations, chest rubs, and bark decoctions."
    }
};

// ═══════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingScreen();
    initializeAmbientMotes();
    initializeNightMode();
    initializeBookmarkNavigation();
    initializeRecipeModals();
    initializeSeasonalWheel();
    initializeAccessibility();
});

// ═══════════════════════════════════════════════════════════════
// Loading Screen
// ═══════════════════════════════════════════════════════════════

function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    // Allow cauldron to bubble for 2.5 seconds, then reveal grimoire
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        app.style.display = 'flex';
        
        // Trigger entrance animations
        setTimeout(() => {
            document.querySelectorAll('.recipe-card').forEach((card, index) => {
                card.style.animation = `fade-in 0.6s ease ${index * 0.1}s both`;
            });
        }, 100);
    }, 2500);
}

// ═══════════════════════════════════════════════════════════════
// Ambient Floating Motes
// ═══════════════════════════════════════════════════════════════

function initializeAmbientMotes() {
    const container = document.querySelector('.ambient-motes');
    if (!container) return;
    
    const moteCount = window.innerWidth < 768 ? 10 : 20;
    
    for (let i = 0; i < moteCount; i++) {
        createMote(container, i);
    }
}

function createMote(container, index) {
    const mote = document.createElement('div');
    mote.className = 'mote';
    
    // Random properties for organic feel
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 15;
    const delay = Math.random() * 15;
    const opacity = Math.random() * 0.4 + 0.3;
    
    mote.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${opacity};
        background: ${Math.random() > 0.5 ? 'var(--accent-gold)' : 'var(--accent-rose)'};
    `;
    
    container.appendChild(mote);
}

// ═══════════════════════════════════════════════════════════════
// Night Mode (Moth & Candle)
// ═══════════════════════════════════════════════════════════════

function initializeNightMode() {
    const toggle = document.getElementById('night-mode-toggle');
    const body = document.body;
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('cottage-witch-theme');
    if (savedTheme === 'night') {
        body.setAttribute('data-theme', 'night');
    }
    
    toggle.addEventListener('click', () => {
        const isNight = body.getAttribute('data-theme') === 'night';
        
        if (isNight) {
            body.removeAttribute('data-theme');
            localStorage.setItem('cottage-witch-theme', 'day');
            announceToScreenReader('Day mode activated');
        } else {
            body.setAttribute('data-theme', 'night');
            localStorage.setItem('cottage-witch-theme', 'night');
            announceToScreenReader('Night mode activated. Candlelight mode.');
        }
        
        // Add subtle flash effect for transition
        body.style.transition = 'background 0.6s ease, color 0.6s ease';
    });
}

// ═══════════════════════════════════════════════════════════════
// Bookmark Navigation
// ═══════════════════════════════════════════════════════════════

function initializeBookmarkNavigation() {
    const tabs = document.querySelectorAll('.bookmark-tab');
    const panels = document.querySelectorAll('.content-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.getAttribute('data-section');
            
            // Deactivate all tabs and panels
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => {
                p.classList.remove('active');
                p.hidden = true;
            });
            
            // Activate clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Activate corresponding panel with animation
            const targetPanel = document.getElementById(`${targetSection}-panel`);
            if (targetPanel) {
                targetPanel.hidden = false;
                targetPanel.classList.add('active');
                
                // Trigger section-specific animations
                animateSectionEntrance(targetSection);
            }
            
            // Announce to screen readers
            const sectionName = tab.querySelector('.bookmark-text').textContent;
            announceToScreenReader(`Now viewing ${sectionName}`);
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
            handleTabKeyboard(e, tabs);
        });
    });
}

function handleTabKeyboard(event, tabs) {
    const currentIndex = Array.from(tabs).indexOf(event.target);
    let newIndex;
    
    switch(event.key) {
        case 'ArrowRight':
            newIndex = (currentIndex + 1) % tabs.length;
            tabs[newIndex].focus();
            tabs[newIndex].click();
            event.preventDefault();
            break;
        case 'ArrowLeft':
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            tabs[newIndex].focus();
            tabs[newIndex].click();
            event.preventDefault();
            break;
        case 'Home':
            tabs[0].focus();
            tabs[0].click();
            event.preventDefault();
            break;
        case 'End':
            tabs[tabs.length - 1].focus();
            tabs[tabs.length - 1].click();
            event.preventDefault();
            break;
    }
}

function animateSectionEntrance(section) {
    switch(section) {
        case 'flora':
            animateFloraEntrance();
            break;
        case 'foraging':
            resetWheelRotation();
            break;
    }
}

function animateFloraEntrance() {
    const flowers = document.querySelectorAll('.pressed-flower');
    flowers.forEach((flower, index) => {
        flower.style.opacity = '0';
        flower.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            flower.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            flower.style.opacity = '1';
            flower.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ═══════════════════════════════════════════════════════════════
// Recipe Modals
// ═══════════════════════════════════════════════════════════════

function initializeRecipeModals() {
    const modal = document.getElementById('recipe-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const backdrop = modal.querySelector('.modal-backdrop');
    const buttons = document.querySelectorAll('.view-recipe-btn');
    
    // Open modal handlers
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.recipe-card');
            const potionType = card.getAttribute('data-potion');
            openRecipeModal(potionType);
        });
    });
    
    // Close handlers
    const closeModal = () => {
        modal.hidden = true;
        document.body.style.overflow = '';
        // Return focus to trigger
        const activeCard = document.querySelector(`[data-potion="${modal.dataset.lastPotion}"]`);
        if (activeCard) activeCard.querySelector('.view-recipe-btn').focus();
    };
    
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Keyboard close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });
    
    // Trap focus in modal
    modal.addEventListener('keydown', (e) => trapFocus(e, modal));
}

function openRecipeModal(potionType) {
    const modal = document.getElementById('recipe-modal');
    const recipe = potionRecipes[potionType];
    
    if (!recipe) return;
    
    modal.dataset.lastPotion = potionType;
    
    // Populate content
    modal.querySelector('.modal-title').textContent = recipe.title;
    modal.querySelector('.recipe-illustration').textContent = recipe.icon;
    
    const detailsContainer = modal.querySelector('.recipe-details');
    detailsContainer.innerHTML = `
        <p class="recipe-intro">${recipe.subtitle} • Best prepared during ${recipe.moonPhase}</p>
        
        <div class="ingredients-section">
            <h4>Ingredients:</h4>
            <ul class="ingredient-list">
                ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
        
        <div class="instructions-section">
            <h4>Preparation:</h4>
            <p>${recipe.instructions}</p>
        </div>
        
        ${recipe.warning ? `
            <div class="warning-box" style="color: #c0392b; border-left: 3px solid #c0392b; padding-left: 1rem; margin-top: 1.5rem; font-style: italic;">
                <strong>Note:</strong> ${recipe.warning}
            </div>
        ` : ''}
    `;
    
    // Show modal
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    
    // Focus management
    setTimeout(() => modal.querySelector('.close-modal').focus(), 100);
    
    announceToScreenReader(`Recipe opened: ${recipe.title}. ${recipe.warning ? 'Contains warnings.' : ''}`);
}

function trapFocus(event, modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// Seasonal Foraging Wheel
// ═══════════════════════════════════════════════════════════════

function initializeSeasonalWheel() {
    const segments = document.querySelectorAll('.season-segment');
    const wheel = document.querySelector('.seasonal-wheel');
    const display = document.querySelector('.current-season-display');
    const guideContent = document.getElementById('seasonal-content');
    
    let currentRotation = 0;
    
    segments.forEach(segment => {
        segment.addEventListener('click', () => {
            const season = segment.getAttribute('data-season');
            const seasonInfo = seasonalData[season];
            
            // Calculate rotation to bring this segment to top (12 o'clock)
            const rotations = {
                spring: 0,
                summer: -90,
                autumn: -180,
                winter: -90 // Or +270, but let's keep it simple
            };
            
            // Actually, let's just highlight rather than rotate the whole wheel
            // to keep text readable, but add a subtle indicator
            
            segments.forEach(s => {
                s.style.transform = 'scale(1)';
                s.setAttribute('aria-checked', 'false');
            });
            
            segment.style.transform = 'scale(1.1)';
            segment.setAttribute('aria-checked', 'true');
            
            // Update center display
            display.querySelector('.season-name').textContent = seasonInfo.name;
            display.querySelector('.season-herb').textContent = seasonInfo.herbs;
            
            // Update guide content with animation
            guideContent.style.opacity = '0';
            setTimeout(() => {
                guideContent.innerHTML = `
                    <div class="season-header" style="text-align: center; margin-bottom: 1.5rem;">
                        <span style="font-size: 3rem; display: block; margin-bottom: 0.5rem;">${seasonInfo.icon}</span>
                        <h3 style="font-family: var(--font-display); color: var(--text-primary);">${seasonInfo.name}</h3>
                    </div>
                    <p style="margin-bottom: 1rem; font-size: 1.1rem;">${seasonInfo.description}</p>
                    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 4px; margin: 1rem 0;">
                        <strong>Foraging:</strong> ${seasonInfo.foraging}
                    </div>
                    <p><em>Preparations:</em> ${seasonInfo.preparations}</p>
                `;
                guideContent.style.transition = 'opacity 0.4s ease';
                guideContent.style.opacity = '1';
            }, 200);
            
            // Rotate wheel slightly for effect
            const targetRotation = {
                spring: 0,
                summer: -90,
                autumn: -180,
                winter: 90
            }[season];
            
            wheel.style.transform = `rotate(${targetRotation}deg)`;
            
            announceToScreenReader(`Selected ${seasonInfo.name}. ${seasonInfo.description.substring(0, 100)}...`);
        });
    });
}

function resetWheelRotation() {
    const wheel = document.querySelector('.seasonal-wheel');
    if (wheel) wheel.style.transform = 'rotate(0deg)';
}

// ═══════════════════════════════════════════════════════════════
// Accessibility Utilities
// ═══════════════════════════════════════════════════════════════

function initializeAccessibility() {
    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border: 2px solid var(--text-primary);
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id
    const main = document.querySelector('.parchment-pages');
    if (main) main.id = 'main-content';
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
}

// ═══════════════════════════════════════════════════════════════
// Additional Interactions
// ═══════════════════════════════════════════════════════════════

// Hover sound effect simulation (visual feedback)
document.querySelectorAll('.recipe-card, .pressed-flower').forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
});

// Parallax effect for corner flourishes on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.corner-flourish');
    const speed = 0.5;
    
    parallax.forEach(el => {
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px) rotate(${el.classList.contains('top-left') ? '-45deg' : el.classList.contains('top-right') ? '45deg' : el.classList.contains('bottom-left') ? '-135deg' : '135deg'})`;
    });
});

// Initialize random page number (witch's favorite number)
document.addEventListener('DOMContentLoaded', () => {
    const pageNum = document.querySelector('.page-num');
    if (pageNum) {
        const witchNumbers = [13, 42, 7, 3, 9, 13];
        pageNum.textContent = witchNumbers[Math.floor(Math.random() * witchNumbers.length)];
    }
});