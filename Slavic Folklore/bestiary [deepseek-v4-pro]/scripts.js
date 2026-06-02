const creatureNav = document.querySelector('.creature-nav');
const navItems = document.querySelectorAll('.nav-item');
const creaturePages = document.querySelectorAll('.creature-page');
const cursorGlow = document.querySelector('.cursor-glow');
const bookContainer = document.querySelector('.book-container');
const hearthGlows = document.querySelectorAll('.hearth-glow');

let activeCreature = 'leshy';
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let isHoveringInteractive = false;

function switchCreature(creatureId) {
    if (activeCreature === creatureId) return;

    const currentPage = document.getElementById(activeCreature);
    const newPage = document.getElementById(creatureId);

    if (currentPage) {
        currentPage.classList.remove('active');
    }

    if (newPage) {
        newPage.classList.add('active');
    }

    navItems.forEach(item => {
        if (item.dataset.creature === creatureId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    activeCreature = creatureId;

    triggerPageTurnEffect();
    updateHearthIntensity(creatureId);
}

function triggerPageTurnEffect() {
    bookContainer.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
    bookContainer.style.transform = 'rotateY(-3deg) scale(0.98)';

    setTimeout(() => {
        bookContainer.style.transform = 'rotateY(0deg) scale(1)';
    }, 150);

    setTimeout(() => {
        bookContainer.style.transition = 'box-shadow 0.3s ease';
    }, 300);
}

function updateHearthIntensity(creatureId) {
    const intensityMap = {
        'leshy': 0.7,
        'rusalka': 0.4,
        'baba-yaga': 0.95,
        'zmey': 0.85,
        'domovoy': 0.3,
        'kikimora': 0.5
    };

    const intensity = intensityMap[creatureId] || 0.6;
    const baseOpacity = intensity * 0.12;

    hearthGlows.forEach(glow => {
        glow.style.transition = 'opacity 1.5s ease';
    });

    const leftGlow = document.querySelector('.left-glow');
    const rightGlow = document.querySelector('.right-glow');

    if (leftGlow) {
        leftGlow.style.background = `radial-gradient(ellipse at right center,
            rgba(210, 120, 50, ${baseOpacity + 0.02}) 0%,
            rgba(210, 120, 50, ${baseOpacity * 0.4}) 30%,
            transparent 70%)`;
    }

    if (rightGlow) {
        rightGlow.style.background = `radial-gradient(ellipse at left center,
            rgba(210, 120, 50, ${baseOpacity + 0.02}) 0%,
            rgba(210, 120, 50, ${baseOpacity * 0.4}) 30%,
            transparent 70%)`;
    }
}

function handleNavClick(event) {
    const navItem = event.target.closest('.nav-item');
    if (!navItem) return;

    const creatureId = navItem.dataset.creature;
    if (creatureId) {
        switchCreature(creatureId);
        playNavClickFeedback(navItem);
    }
}

function playNavClickFeedback(navItem) {
    navItem.style.transform = 'scale(0.93)';
    navItem.style.transition = 'transform 0.12s ease';

    setTimeout(() => {
        navItem.style.transform = '';
        navItem.style.transition = 'all 0.35s ease';
    }, 120);

    createInkSplash(navItem);
}

function createInkSplash(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background: var(--ink-faded, #4a3720);
            border-radius: 50%;
            pointer-events: none;
            z-index: 200;
            left: ${centerX}px;
            top: ${centerY}px;
            opacity: 0.8;
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 4 + Math.random() * 0.5;
        const distance = 15 + Math.random() * 25;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        requestAnimationFrame(() => {
            particle.style.transform = `translate(${dx}px, ${dy}px)`;
            particle.style.opacity = '0';
            particle.style.width = '1px';
            particle.style.height = '1px';
        });

        setTimeout(() => {
            particle.remove();
        }, 650);
    }
}

function trackMouse(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function updateCursorGlow() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    if (cursorGlow) {
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
    }

    checkInteractiveElements();

    requestAnimationFrame(updateCursorGlow);
}

function checkInteractiveElements() {
    const element = document.elementFromPoint(mouseX, mouseY);
    const isInteractive = element && (
        element.closest('.nav-item') ||
        element.closest('.attribute') ||
        element.closest('.ward-section') ||
        element.closest('.woodcut-border') ||
        element.tagName === 'A' ||
        element.tagName === 'BUTTON'
    );

    if (isInteractive && !isHoveringInteractive) {
        isHoveringInteractive = true;
        if (cursorGlow) {
            cursorGlow.style.width = '120px';
            cursorGlow.style.height = '120px';
            cursorGlow.style.background = `radial-gradient(circle,
                rgba(220, 160, 70, 0.35) 0%,
                rgba(220, 160, 70, 0.12) 40%,
                transparent 70%)`;
        }
    } else if (!isInteractive && isHoveringInteractive) {
        isHoveringInteractive = false;
        if (cursorGlow) {
            cursorGlow.style.width = '80px';
            cursorGlow.style.height = '80px';
            cursorGlow.style.background = `radial-gradient(circle,
                rgba(220, 160, 70, 0.25) 0%,
                rgba(220, 160, 70, 0.08) 40%,
                transparent 70%)`;
        }
    }
}

function addWoodcutHoverEffect() {
    const woodcutBorders = document.querySelectorAll('.woodcut-border');

    woodcutBorders.forEach(border => {
        border.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease';
            this.style.transform = 'scale(1.03)';
            this.style.boxShadow = `
                inset 0 0 0 6px var(--parchment-light, #e8d5b0),
                inset 0 0 0 8px var(--parchment-dark, #b8955c),
                6px 6px 18px rgba(0, 0, 0, 0.5),
                0 0 25px rgba(200, 140, 50, 0.2)
            `;
        });

        border.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease';
            this.style.transform = 'scale(1)';
            this.style.boxShadow = `
                inset 0 0 0 6px var(--parchment-light, #e8d5b0),
                inset 0 0 0 8px var(--parchment-dark, #b8955c),
                4px 4px 12px rgba(0, 0, 0, 0.4)
            `;
        });
    });
}

function addWardSectionHover() {
    const wardSections = document.querySelectorAll('.ward-section');

    wardSections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transition = 'background 0.4s ease, border-color 0.4s ease, transform 0.3s ease';
            this.style.background = `
                linear-gradient(135deg,
                    rgba(180, 130, 60, 0.2) 0%,
                    rgba(200, 150, 80, 0.12) 50%,
                    rgba(180, 130, 60, 0.2) 100%)
            `;
            this.style.borderColor = 'var(--gold-accent, #b8860b)';
            this.style.transform = 'translateX(4px)';
        });

        section.addEventListener('mouseleave', function() {
            this.style.transition = 'background 0.5s ease, border-color 0.5s ease, transform 0.4s ease';
            this.style.background = `
                linear-gradient(135deg,
                    rgba(140, 100, 40, 0.12) 0%,
                    rgba(180, 140, 90, 0.08) 50%,
                    rgba(140, 100, 40, 0.12) 100%)
            `;
            this.style.borderColor = 'var(--parchment-dark, #b8955c)';
            this.style.transform = 'translateX(0)';
        });
    });
}

function addDangerSymbolGlow() {
    const dangerSymbols = document.querySelectorAll('.danger-symbol.filled');

    dangerSymbols.forEach((symbol, index) => {
        symbol.style.animationDelay = (index * 0.3) + 's';
        symbol.style.animation = 'dangerPulse 2s ease-in-out infinite';
    });

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes dangerPulse {
            0%, 100% { text-shadow: 0 0 6px rgba(200, 60, 20, 0.5); }
            50% { text-shadow: 0 0 14px rgba(220, 80, 30, 0.8), 0 0 20px rgba(200, 50, 15, 0.4); }
        }
    `;
    document.head.appendChild(styleSheet);
}

function addPageEdgeCurl() {
    const pages = document.querySelectorAll('.creature-page');

    pages.forEach(page => {
        page.addEventListener('mouseenter', function(event) {
            const rect = this.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const relativeX = x / rect.width;

            if (relativeX > 0.85) {
                this.style.transform = 'rotateY(-2deg)';
                this.style.transformOrigin = 'left center';
                this.style.transition = 'transform 0.4s ease';
            }
        });

        page.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.transition = 'transform 0.5s ease';
        });

        page.addEventListener('mousemove', function(event) {
            const rect = this.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const relativeX = x / rect.width;

            if (relativeX > 0.85) {
                const intensity = (relativeX - 0.85) / 0.15;
                this.style.transform = `rotateY(${-2 * intensity}deg)`;
                this.style.transformOrigin = 'left center';
                this.style.transition = 'transform 0.15s ease';
            } else {
                this.style.transform = '';
            }
        });
    });
}

function addKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        const creatureIds = ['leshy', 'rusalka', 'baba-yaga', 'zmey', 'domovoy', 'kikimora'];
        const currentIndex = creatureIds.indexOf(activeCreature);

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % creatureIds.length;
            switchCreature(creatureIds[nextIndex]);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = (currentIndex - 1 + creatureIds.length) % creatureIds.length;
            switchCreature(creatureIds[prevIndex]);
        } else if (event.key >= '1' && event.key <= '6') {
            event.preventDefault();
            const index = parseInt(event.key) - 1;
            switchCreature(creatureIds[index]);
        }
    });
}

function addInitialPageLoadAnimation() {
    const header = document.querySelector('.book-header');
    const nav = document.querySelector('.creature-nav');
    const mainContent = document.querySelector('.creature-display');
    const footer = document.querySelector('.book-footer');

    const elements = [header, nav, mainContent, footer];

    elements.forEach((element, index) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 + index * 150);
        }
    });
}

function addCreatureSwitchSoundFeedback() {
    const originalSwitch = switchCreature;
    switchCreature = function(creatureId) {
        const creatureSounds = {
            'leshy': { intensity: 0.7, color: [60, 80, 40] },
            'rusalka': { intensity: 0.5, color: [50, 80, 110] },
            'baba-yaga': { intensity: 0.9, color: [140, 40, 20] },
            'zmey': { intensity: 0.85, color: [180, 60, 20] },
            'domovoy': { intensity: 0.4, color: [100, 80, 50] },
            'kikimora': { intensity: 0.6, color: [80, 50, 70] }
        };

        const sound = creatureSounds[creatureId] || creatureSounds['leshy'];
        createVisualRipple(sound);

        originalSwitch(creatureId);
    };
}

function createVisualRipple(soundData) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const ripple = document.createElement('div');
    const [r, g, b] = soundData.color;

    ripple.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: transparent;
        border: 2px solid rgba(${r}, ${g}, ${b}, 0.6);
        pointer-events: none;
        z-index: 150;
        transform: translate(-50%, -50%);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 0.7;
    `;

    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
        ripple.style.width = '300px';
        ripple.style.height = '300px';
        ripple.style.opacity = '0';
        ripple.style.borderWidth = '0.5px';
    });

    setTimeout(() => {
        ripple.remove();
    }, 850);
}

function initialize() {
    if (creatureNav) {
        creatureNav.addEventListener('click', handleNavClick);
    }

    document.addEventListener('mousemove', trackMouse);

    requestAnimationFrame(updateCursorGlow);

    addWoodcutHoverEffect();
    addWardSectionHover();
    addDangerSymbolGlow();
    addPageEdgeCurl();
    addKeyboardNavigation();
    addCreatureSwitchSoundFeedback();

    addInitialPageLoadAnimation();

    const initialPage = document.getElementById(activeCreature);
    if (initialPage) {
        initialPage.classList.add('active');
    }

    const initialNavItem = document.querySelector(`.nav-item[data-creature="${activeCreature}"]`);
    if (initialNavItem) {
        initialNavItem.classList.add('active');
    }

    updateHearthIntensity(activeCreature);

    document.addEventListener('click', function(event) {
        const isNavItem = event.target.closest('.nav-item');
        const isWoodcut = event.target.closest('.woodcut-border');

        if (isWoodcut && !isNavItem) {
            const woodcut = event.target.closest('.woodcut-border');
            woodcut.style.transition = 'transform 0.1s ease';
            woodcut.style.transform = 'scale(0.97)';

            setTimeout(() => {
                woodcut.style.transform = 'scale(1)';
                woodcut.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            }, 100);
        }
    });

    console.log('Славянский Бестиарий · Slavic Bestiary');
    console.log('A compendium of creatures from the deep forests and dark waters.');
    console.log('Use arrow keys or number keys 1-6 to navigate through the bestiary.');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}