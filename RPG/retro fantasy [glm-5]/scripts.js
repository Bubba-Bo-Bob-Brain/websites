document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAbilityScoreAnimations();
    initializeQuestNoticeEffects();
    initializeInventoryInteractions();
    initializeSpellbookInteractions();
    initializePageLoadAnimations();
    initializeAmbientEffects();
});

function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const contentSections = document.querySelectorAll('.content-section');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            contentSections.forEach(section => {
                section.classList.remove('active');
                section.style.opacity = '0';
                section.style.transform = 'translateY(10px)';
            });
            
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.classList.add('active');
                    targetElement.style.opacity = '1';
                    targetElement.style.transform = 'translateY(0)';
                }, 150);
            }
            
            createTabTransitionEffect(this);
        });
    });
}

function createTabTransitionEffect(tab) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(244, 208, 63, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: tabRipple 0.6s ease-out forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tabRipple {
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-name="tab-ripple"]')) {
        style.setAttribute('data-name', 'tab-ripple');
        document.head.appendChild(style);
    }
    
    tab.style.position = 'relative';
    tab.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function initializeAbilityScoreAnimations() {
    const abilityScores = document.querySelectorAll('.ability-score');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAbilityScore(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    abilityScores.forEach(score => {
        const valueElement = score.querySelector('.score-value');
        const originalValue = parseInt(valueElement.textContent);
        valueElement.textContent = '0';
        score.dataset.targetValue = originalValue;
        observer.observe(score);
    });
    
    abilityScores.forEach(score => {
        score.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
            createSparkleEffect(this);
        });
        
        score.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function animateAbilityScore(element) {
    const valueElement = element.querySelector('.score-value');
    const targetValue = parseInt(element.dataset.targetValue);
    const duration = 1000;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(targetValue * easeOut);
        valueElement.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        sparkle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #f4d03f 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            animation: sparkleFloat 1s ease-out forwards;
        `;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    if (!document.querySelector('style[data-name="sparkle"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-name', 'sparkle');
        style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) translateY(-30px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeQuestNoticeEffects() {
    const questNotices = document.querySelectorAll('.quest-notice');
    
    questNotices.forEach(notice => {
        notice.addEventListener('mouseenter', function() {
            const pin = this.querySelector('.notice-pin');
            if (pin) {
                pin.style.animation = 'pinWiggle 0.3s ease-in-out';
            }
            this.style.zIndex = '20';
        });
        
        notice.addEventListener('mouseleave', function() {
            const pin = this.querySelector('.notice-pin');
            if (pin) {
                pin.style.animation = '';
            }
            this.style.zIndex = '';
        });
        
        notice.addEventListener('click', function() {
            expandQuestNotice(this);
        });
    });
    
    if (!document.querySelector('style[data-name="quest-styles"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-name', 'quest-styles');
        style.textContent = `
            @keyframes pinWiggle {
                0%, 100% { transform: translateX(-50%) rotate(0deg); }
                25% { transform: translateX(-50%) rotate(-5deg); }
                75% { transform: translateX(-50%) rotate(5deg); }
            }
            .quest-expanded {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) rotate(0deg) !important;
                width: 90% !important;
                max-width: 500px !important;
                z-index: 2000 !important;
                padding: 30px !important;
            }
            .quest-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 1999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

function expandQuestNotice(notice) {
    const existingOverlay = document.querySelector('.quest-overlay');
    if (existingOverlay) {
        closeExpandedQuest();
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'quest-overlay';
    overlay.addEventListener('click', closeExpandedQuest);
    document.body.appendChild(overlay);
    setTimeout(() => overlay.style.opacity = '1', 10);
    
    notice.classList.add('quest-expanded');
    
    const closeButton = document.createElement('button');
    closeButton.className = 'quest-close-btn';
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #8b4513;
        cursor: pointer;
        font-family: serif;
    `;
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeExpandedQuest();
    });
    notice.appendChild(closeButton);
}

function closeExpandedQuest() {
    const overlay = document.querySelector('.quest-overlay');
    const expanded = document.querySelector('.quest-expanded');
    const closeBtn = document.querySelector('.quest-close-btn');
    
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }
    if (expanded) {
        expanded.classList.remove('quest-expanded');
    }
    if (closeBtn) {
        closeBtn.remove();
    }
}

function initializeInventoryInteractions() {
    const inventorySlots = document.querySelectorAll('.inventory-slot:not(.empty)');
    
    inventorySlots.forEach(slot => {
        slot.addEventListener('mouseenter', function() {
            const rarity = this.dataset.rarity;
            createItemGlow(this, rarity);
            showItemTooltip(this);
        });
        
        slot.addEventListener('mouseleave', function() {
            removeItemGlow(this);
            hideItemTooltip();
        });
        
        slot.addEventListener('click', function() {
            createItemPickupEffect(this);
        });
    });
}

function createItemGlow(element, rarity) {
    const colors = {
        common: 'rgba(122, 122, 122, 0.3)',
        uncommon: 'rgba(30, 255, 0, 0.4)',
        rare: 'rgba(0, 112, 221, 0.5)',
        legendary: 'rgba(255, 128, 0, 0.6)'
    };
    
    const glowColor = colors[rarity] || colors.common;
    element.style.boxShadow = `0 0 20px ${glowColor}, 0 8px 25px rgba(0, 0, 0, 0.3)`;
}

function removeItemGlow(element) {
    const rarity = element.dataset.rarity;
    const baseShadows = {
        common: 'none',
        uncommon: '0 0 10px rgba(30, 255, 0, 0.2)',
        rare: '0 0 10px rgba(0, 112, 221, 0.3)',
        legendary: '0 0 15px rgba(255, 128, 0, 0.4)'
    };
    element.style.boxShadow = baseShadows[rarity] || 'none';
}

function showItemTooltip(element) {
    const itemName = element.querySelector('.item-name');
    if (!itemName) return;
    
    const existingTooltip = document.querySelector('.item-tooltip');
    if (existingTooltip) existingTooltip.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'item-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-name">${itemName.textContent}</div>
        <div class="tooltip-rarity">${element.dataset.rarity.toUpperCase()}</div>
    `;
    tooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, #1a1510 0%, #2d1f14 100%);
        border: 2px solid #8b6914;
        padding: 12px 18px;
        border-radius: 5px;
        z-index: 3000;
        pointer-events: none;
        font-family: 'Cinzel', serif;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    `;
    
    const rarityColors = {
        common: '#7a7a7a',
        uncommon: '#1eff00',
        rare: '#0070dd',
        legendary: '#ff8000'
    };
    
    tooltip.querySelector('.tooltip-name').style.cssText = `
        color: ${rarityColors[element.dataset.rarity]};
        font-size: 1rem;
        margin-bottom: 5px;
    `;
    tooltip.querySelector('.tooltip-rarity').style.cssText = `
        color: #8b4513;
        font-size: 0.7rem;
        letter-spacing: 0.1em;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
}

function hideItemTooltip() {
    const tooltip = document.querySelector('.item-tooltip');
    if (tooltip) tooltip.remove();
}

function createItemPickupEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30;
        
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #d4a84b 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 3000;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            animation: itemParticle 0.6s ease-out forwards;
            --tx: ${Math.cos(angle) * distance}px;
            --ty: ${Math.sin(angle) * distance}px;
        `;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
    
    if (!document.querySelector('style[data-name="item-particle"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-name', 'item-particle');
        style.textContent = `
            @keyframes itemParticle {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeSpellbookInteractions() {
    const spellEntries = document.querySelectorAll('.spell-entry');
    
    spellEntries.forEach(entry => {
        entry.addEventListener('click', function() {
            castSpellEffect(this);
        });
    });
    
    const spellSlots = document.querySelectorAll('.spell-slot.filled');
    spellSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            expendSpellSlot(this);
        });
    });
}

function castSpellEffect(element) {
    const schoolColors = {
        divination: '#9b59b6',
        enchantment: '#e74c3c',
        conjuration: '#3498db',
        transmutation: '#27ae60'
    };
    
    const school = element.dataset.school;
    const color = schoolColors[school] || '#4a6fa5';
    const rect = element.getBoundingClientRect();
    
    const castOrb = document.createElement('div');
    castOrb.style.cssText = `
        position: fixed;
        left: ${rect.left}px;
        top: ${rect.top}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        background: radial-gradient(circle, ${color} 0%, transparent 70%);
        border-radius: 5px;
        pointer-events: none;
        z-index: 2000;
        animation: castExpand 0.8s ease-out forwards;
    `;
    document.body.appendChild(castOrb);
    
    const runeCircle = document.createElement('div');
    runeCircle.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        width: 100px;
        height: 100px;
        border: 2px solid ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 2001;
        transform: translate(-50%, -50%);
        animation: runeExpand 0.8s ease-out forwards;
        opacity: 0.8;
    `;
    document.body.appendChild(runeCircle);
    
    setTimeout(() => {
        castOrb.remove();
        runeCircle.remove();
    }, 800);
    
    if (!document.querySelector('style[data-name="cast-effect"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-name', 'cast-effect');
        style.textContent = `
            @keyframes castExpand {
                0% {
                    opacity: 0.8;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(2);
                }
            }
            @keyframes runeExpand {
                0% {
                    opacity: 0.8;
                    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(2) rotate(180deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function expendSpellSlot(element) {
    if (element.classList.contains('filled')) {
        element.style.animation = 'slotExpend 0.5s ease-out forwards';
        
        setTimeout(() => {
            element.classList.remove('filled');
            element.style.animation = '';
            element.style.background = 'rgba(139, 69, 19, 0.2)';
            element.style.boxShadow = 'none';
        }, 500);
        
        if (!document.querySelector('style[data-name="slot-expend"]')) {
            const style = document.createElement('style');
            style.setAttribute('data-name', 'slot-expend');
            style.textContent = `
                @keyframes slotExpend {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.3);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

function initializePageLoadAnimations() {
    const elements = document.querySelectorAll('.tome-header, .tome-content, .tome-footer');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 * index);
    });
    
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        const children = activeSection.querySelectorAll('.character-portrait, .character-info-grid, .ability-scores, .quest-notice, .inventory-slot, .spell-entry');
        children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(15px)';
            
            setTimeout(() => {
                child.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, 400 + (index * 50));
        });
    }
}

function initializeAmbientEffects() {
    createFloatingParticles();
    setInterval(createFloatingParticles, 8000);
}

function createFloatingParticles() {
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const startX = Math.random() * window.innerWidth;
        const duration = 8 + Math.random() * 4;
        const size = 2 + Math.random() * 4;
        
        particle.style.cssText = `
            position: fixed;
            left: ${startX}px;
            bottom: -10px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(212, 168, 75, 0.6) 0%, rgba(212, 168, 75, 0.1) 50%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            animation: floatUp ${duration}s ease-out forwards;
        `;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
    }
    
    if (!document.querySelector('style[data-name="float-particles"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-name', 'float-particles');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    opacity: 0;
                    transform: translateY(0) scale(1);
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100vh) scale(0.5);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const ambientOverlay = document.querySelector('.ambient-overlay');
    if (ambientOverlay) {
        ambientOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});