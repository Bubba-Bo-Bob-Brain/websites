// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive features
    initTabs();
    initCategoryFiltering();
    initAmbientSounds();
    initHoverEffects();
    initDangerRatingTooltips();
    initSmoothScrolling();
    initForestCanopyAnimation();
    initHearthGlowEnhancement();
});

// ===== Tab Switching for Lore Sections =====
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const creatureCard = button.closest('.creature-card');
            const tabId = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents in this card
            creatureCard.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            creatureCard.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const activeContent = creatureCard.querySelector(`#${tabId}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// ===== Category Filtering =====
function initCategoryFiltering() {
    const navItems = document.querySelectorAll('.nav-item');
    const categorySections = document.querySelectorAll('.category-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = item.getAttribute('data-category');

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show/hide category sections
            categorySections.forEach(section => {
                if (section.id === category) {
                    section.classList.remove('hidden');
                    section.style.animation = 'fadeIn 0.5s ease';
                } else {
                    section.classList.add('hidden');
                }
            });

            // Scroll to the top of the content
            document.querySelector('main.creature-entries').scrollTop = 0;
        });
    });
}

// ===== Ambient Sounds Toggle =====
function initAmbientSounds() {
    const ambientToggle = document.getElementById('ambient-sounds');
    if (!ambientToggle) return;

    // Create audio elements (using placeholder URLs)
    const forestSound = new Audio('https://www.soundjay.com/nature/sounds/forest-ambience.mp3');
    const fireSound = new Audio('https://www.soundjay.com/fire/sounds/fire-crackling.mp3');
    forestSound.loop = true;
    fireSound.loop = true;
    forestSound.volume = 0.3;
    fireSound.volume = 0.2;

    ambientToggle.addEventListener('change', () => {
        if (ambientToggle.checked) {
            forestSound.play().catch(e => console.log("Audio play failed:", e));
            fireSound.play().catch(e => console.log("Audio play failed:", e));
        } else {
            forestSound.pause();
            fireSound.pause();
        }
    });
}

// ===== Hover Effects for Creature Cards =====
function initHoverEffects() {
    const creatureCards = document.querySelectorAll('.creature-card');

    creatureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add a subtle woodcut frame glow
            const woodcutFrame = card.querySelector('.woodcut-frame');
            if (woodcutFrame) {
                woodcutFrame.style.boxShadow = '0 0 15px rgba(255, 140, 66, 0.3)';
            }

            // Animate the SVG illustration (slight scale)
            const svg = card.querySelector('.woodcut-svg');
            if (svg) {
                svg.style.transform = 'scale(1.05)';
                svg.style.transition = 'transform 0.3s ease';
            }
        });

        card.addEventListener('mouseleave', () => {
            const woodcutFrame = card.querySelector('.woodcut-frame');
            if (woodcutFrame) {
                woodcutFrame.style.boxShadow = 'var(--shadow-subtle)';
            }

            const svg = card.querySelector('.woodcut-svg');
            if (svg) {
                svg.style.transform = 'scale(1)';
            }
        });
    });
}

// ===== Danger Rating Tooltips =====
function initDangerRatingTooltips() {
    const kolovratSymbols = document.querySelectorAll('.kolovrat');

    kolovratSymbols.forEach(symbol => {
        symbol.addEventListener('mouseenter', (e) => {
            const isEmpty = symbol.classList.contains('empty');
            const tooltip = document.createElement('div');
            tooltip.className = 'danger-tooltip';
            tooltip.textContent = isEmpty ? 'Low Danger' : 'High Danger';
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(58, 37, 21, 0.9)';
            tooltip.style.color = 'var(--birch-light)';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '3px';
            tooltip.style.fontSize = '0.8rem';
            tooltip.style.zIndex = '100';
            tooltip.style.left = `${e.target.getBoundingClientRect().left - 50}px`;
            tooltip.style.top = `${e.target.getBoundingClientRect().top - 30}px`;
            tooltip.style.whiteSpace = 'nowrap';

            document.body.appendChild(tooltip);

            symbol.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });
}

// ===== Smooth Scrolling for Navigation =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Forest Canopy Animation Enhancement =====
function initForestCanopyAnimation() {
    const canopy = document.querySelector('.forest-canopy');
    if (!canopy) return;

    // Add additional floating leaves
    for (let i = 0; i < 10; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'floating-leaf';
        leaf.style.position = 'absolute';
        leaf.style.width = '15px';
        leaf.style.height = '15px';
        leaf.style.background = 'var(--forest-green)';
        leaf.style.borderRadius = '50% 0 50% 50%';
        leaf.style.opacity = '0.6';
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.top = `${Math.random() * 100}%`;
        leaf.style.animation = `floatLeaf ${10 + Math.random() * 10}s linear infinite`;
        leaf.style.animationDelay = `${Math.random() * 5}s`;

        canopy.appendChild(leaf);
    }

    // Add keyframes for leaf floating
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatLeaf {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== Hearth Glow Enhancement =====
function initHearthGlowEnhancement() {
    const hearthGlows = document.querySelectorAll('.hearth-glow');

    hearthGlows.forEach(glow => {
        // Add ember particles
        for (let i = 0; i < 5; i++) {
            const ember = document.createElement('div');
            ember.className = 'ember-particle';
            ember.style.position = 'absolute';
            ember.style.width = '5px';
            ember.style.height = '5px';
            ember.style.background = 'var(--fire-ember)';
            ember.style.borderRadius = '50%';
            ember.style.boxShadow = '0 0 5px var(--fire-ember)';
            ember.style.left = `${Math.random() * 100}%`;
            ember.style.top = `${Math.random() * 100}%`;
            ember.style.animation = `emberFloat ${2 + Math.random() * 2}s ease-in-out infinite`;
            ember.style.animationDelay = `${Math.random() * 2}s`;

            glow.appendChild(ember);
        }
    });

    // Add keyframes for ember floating
    const style = document.createElement('style');
    style.textContent = `
        @keyframes emberFloat {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.8; }
            50% { transform: translateY(-10px) translateX(5px); opacity: 0.4; }
        }
    `;
    document.head.appendChild(style);
}