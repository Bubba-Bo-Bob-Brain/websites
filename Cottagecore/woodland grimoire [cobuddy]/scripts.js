// ===== Loading Screen =====
const loadingScreen = document.getElementById('loadingScreen');

window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2200);
});

// ===== Night Mode Toggle =====
const nightToggle = document.getElementById('nightToggle');
const html = document.documentElement;

let isNight = false;

nightToggle.addEventListener('click', () => {
    isNight = !isNight;
    html.setAttribute('data-night', isNight.toString());

    // Regenerate moths when toggling to night
    if (isNight) {
        generateMoths();
    }

    // Candlelight cursor glow in night mode
    if (isNight) {
        document.addEventListener('mousemove', candlelightCursor);
    } else {
        document.removeEventListener('mousemove', candlelightCursor);
    }
});

// ===== Moth Particles =====
const mothContainer = document.getElementById('mothContainer');

function generateMoths() {
    mothContainer.innerHTML = '';
    const mothCount = 12;

    for (let i = 0; i < mothCount; i++) {
        const moth = document.createElement('div');
        moth.classList.add('moth');
        moth.style.left = Math.random() * 100 + '%';
        moth.style.top = Math.random() * 100 + '%';
        moth.style.animationDelay = (Math.random() * 10) + 's';
        moth.style.animationDuration = (10 + Math.random() * 10) + 's';

        // Random moth appearance
        const mothTypes = ['🦋', '🌙', '✨', '🍃'];
        moth.textContent = mothTypes[Math.floor(Math.random() * mothTypes.length)];

        mothContainer.appendChild(moth);
    }
}

// ===== Candlelight Cursor (Night Mode) =====
function candlelightCursor(e) {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', x + '%');
    document.documentElement.style.setProperty('--mouse-y', y + '%');
}

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll(
    '.potion-card, .pressed-flower, .journal-page, .seasonal-wheel, .section-header, .alchemy-lab'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ===== Navigation Active State =====
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-80px 0px -40% 0px'
});

document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Seasonal Wheel Interaction =====
const seasonArcs = document.querySelectorAll('.season-arc');

seasonArcs.forEach(arc => {
    arc.parentElement.addEventListener('click', () => {
        // Gentle highlight pulse
        arc.style.transform = 'scale(1.03)';
        arc.style.boxShadow = '0 0 20px rgba(184, 134, 11, 0.2)';

        setTimeout(() => {
            arc.style.transform = 'scale(1)';
            arc.style.boxShadow = 'none';
        }, 600);
    });
});

// ===== Alchemy Lab =====
const trayItems = document.querySelectorAll('.tray-item');
const brewButton = document.getElementById('brewButton');
const clearButton = document.getElementById('clearButton');
const cauldronLiquid = document.getElementById('cauldronLiquid');
const cauldronBubbles = document.getElementById('cauldronBubbles');
const resultName = document.getElementById('resultName');
const resultDescription = document.getElementById('resultDescription');

let selectedIngredients = [];
let brewedColors = [];

const potionRecipes = [
    {
        name: 'Moonpetal Elixir',
        description: 'A shimmering violet draught that hums with lunar energy. Best taken under a full moon.',
        ingredients: ['moonpetal'],
        color: 'linear-gradient(180deg, #C4B5FD, #7C3AED)'
    },
    {
        name: 'Verdant Whisper Tonic',
        description: 'A fresh green potion that lets you hear the trees speak. Drink only in the forest.',
        ingredients: ['foxglove', 'lavender'],
        color: 'linear-gradient(180deg, #6EE7B7, #059669)'
    },
    {
        name: 'Honeyed Dream Draught',
        description: 'A golden slumber potion sweetened with warmth. One sip and the world fades.',
        ingredients: ['honey', 'chamomile'],
        color: 'linear-gradient(180deg, #FCD34D, #D97706)'
    },
    {
        name: 'Roseblood Cordial',
        description: 'A passionate crimson drink that strengthens the heart. Made from thorn roses.',
        ingredients: ['rose'],
        color: 'linear-gradient(180deg, #FCA5A5, #DC2626)'
    },
    {
        name: 'Frostbloom Spirit',
        description: 'A crystalline blue spirit harvested from the first frost. Sharpens the mind.',
        ingredients: ['frost'],
        color: 'linear-gradient(180deg, #A5F3FC, #0891B2)'
    },
    {
        name: 'Nightshade Mix',
        description: 'A dangerously dark concoction. Handle with extreme caution and gloved hands.',
        ingredients: ['nightshade'],
        color: 'linear-gradient(180deg, #4C1D95, #1E1B4B)'
    },
    {
        name: 'Lavender Slumber',
        description: 'A gentle purple sleep aid. The cottage smells of calm after brewing this.',
        ingredients: ['lavender', 'chamomile'],
        color: 'linear-gradient(180deg, #DDD6FE, #8B5CF6)'
    },
    {
        name: 'Moonfire Infusion',
        description: 'A radiant golden potion that glows faintly. Perfect for cold winter nights.',
        ingredients: ['moonpetal', 'honey'],
        color: 'linear-gradient(180deg, #FDE68A, #F59E0B)'
    },
    {
        name: 'Rosemoon Elixir',
        description: 'A rare and beautiful blend. Petals float like little moons in the liquid.',
        ingredients: ['rose', 'moonpetal'],
        color: 'linear-gradient(180deg, #F9A8D4, #C44569)'
    },
    {
        name: 'Frosthoney Spirit',
        description: 'An icy golden blend that tingles on the tongue. Harvested at winter dawn.',
        ingredients: ['frost', 'honey'],
        color: 'linear-gradient(180deg, #BAE6FD, #0284C7)'
    },
    {
        name: 'Wild Garden Brew',
        description: 'A chaotic mix of garden herbs. Unpredictable but wonderfully fragrant.',
        ingredients: ['foxglove', 'lavender', 'chamomile'],
        color: 'linear-gradient(180deg, #BBF7D0, #65A30D)'
    },
    {
        name: 'Shadowmoon Tincture',
        description: 'A mysterious dark-purple brew. The shadows seem to lean in when you open the lid.',
        ingredients: ['nightshade', 'moonpetal'],
        color: 'linear-gradient(180deg, #7C3AED, #1E1B4B)'
    },
    {
        name: 'Thornrose Mead',
        description: 'A warm and spiced drink. The rose petals have settled like little crimson stars.',
        ingredients: ['rose', 'honey'],
        color: 'linear-gradient(180deg, #FCA5A5, #BE123C)'
    },
    {
        name: 'Frostveil Potion',
        description: 'A cold and crystalline draught. Looking into it, you can see winter forests.',
        ingredients: ['frost', 'lavender'],
        color: 'linear-gradient(180deg, #C4B5FD, #6366F1)'
    }
];

// Generate bubbles for cauldron
function generateCauldronBubbles() {
    cauldronBubbles.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const bubble = document.createElement('span');
        bubble.classList.add('bubble');
        bubble.style.cssText = `
            --delay: ${Math.random() * 2}s;
            --duration: ${(1.5 + Math.random() * 1.5).toFixed(1)}s;
            left: ${(10 + Math.random() * 80).toFixed(0)}%;
        `;
        cauldronBubbles.appendChild(bubble);
    }
}

generateCauldronBubbles();

// Ingredient selection
trayItems.forEach(item => {
    item.addEventListener('click', () => {
        const ingredient = item.dataset.ingredient;
        const color = item.dataset.color;
        const name = item.dataset.name;

        if (selectedIngredients.includes(ingredient)) {
            selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
            brewedColors = brewedColors.filter(c => c !== color);
            item.classList.remove('selected');
        } else {
            if (selectedIngredients.length < 4) {
                selectedIngredients.push(ingredient);
                brewedColors.push(color);
                item.classList.add('selected');
            } else {
                // Replace first ingredient
                const removed = selectedIngredients.shift();
                const removedColor = brewedColors.shift();
                document.querySelector(`[data-ingredient="${removed}"]`).classList.remove('selected');

                selectedIngredients.push(ingredient);
                brewedColors.push(color);
                item.classList.add('selected');
            }
        }

        // Update cauldron liquid color
        if (brewedColors.length > 0) {
            cauldronLiquid.style.background = brewedColors.join(', ');
        } else {
            cauldronLiquid.style.background = 'linear-gradient(180deg, #6B3A2A, #3D1F12)';
        }
    });
});

// Brew button
brewButton.addEventListener('click', () => {
    if (selectedIngredients.length === 0) {
        resultName.textContent = 'The cauldron is empty...';
        resultDescription.textContent = 'Select some ingredients first, dear.';
        return;
    }

    // Animate bubbles
    generateCauldronBubbles();

    // Find matching recipe
    let matchedPotion = null;

    for (const recipe of potionRecipes) {
        const recipeIngredients = [...recipe.ingredients].sort();
        const selectedSorted = [...selectedIngredients].sort();

        if (recipeIngredients.length === selectedSorted.length &&
            recipeIngredients.every((ing, idx) => ing === selectedSorted[idx])) {
            matchedPotion = recipe;
            break;
        }
    }

    if (matchedPotion) {
        resultName.textContent = '✧ ' + matchedPotion.name + ' ✧';
        resultDescription.textContent = matchedPotion.description;

        // Animate result
        resultName.style.animation = 'none';
        resultDescription.style.animation = 'none';
        setTimeout(() => {
            resultName.style.animation = 'fadeInUp 0.6s ease forwards';
            resultDescription.style.animation = 'fadeInUp 0.6s ease 0.2s forwards';
        }, 10);
    } else {
        // Generate a unique random result
        const adjectives = ['Mysterious', 'Whimsical', 'Twilight', 'Ancient', 'Wild', 'Gentle'];
        const nouns = ['Concoction', 'Brew', 'Tincture', 'Infusion', 'Elixir', 'Spirit'];
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        resultName.textContent = '✧ ' + randomAdj + ' ' + randomNoun + ' ✧';
        const messages = [
            'The mixture shimmers with an unknown energy. Handle with care.',
            'An unusual aroma fills the cottage. The cat has fled.',
            'The liquid changes color three times before settling. Odd.',
            'A faint hum emanates from the cauldron. The walls seem to lean in.',
            'The brew smells of rain and old books. Quite peculiar.',
            'Tiny sparks dance on the surface. Do not inhale too deeply.'
        ];
        resultDescription.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
});

// Clear button
clearButton.addEventListener('click', () => {
    selectedIngredients = [];
    brewedColors = [];
    trayItems.forEach(item => item.classList.remove('selected'));
    cauldronLiquid.style.background = 'linear-gradient(180deg, #6B3A2A, #3D1F12)';
    resultName.textContent = 'Add ingredients to begin...';
    resultDescription.textContent = '';
    generateCauldronBubbles();
});

// ===== Animated Scroll to Sections =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Candle Flicker Enhancement (Night Mode) =====
if (isNight) {
    document.addEventListener('mousemove', candlelightCursor);
}

// ===== Parallax on Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-bg-wash');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});

// ===== Add fadeInUp animation =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== Potion Card Tilt Effect =====
const potionCards = document.querySelectorAll('.potion-card');

potionCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== Flower Hover Glow =====
const pressedFlowers = document.querySelectorAll('.pressed-flower');

pressedFlowers.forEach(flower => {
    flower.addEventListener('mouseenter', () => {
        const illustration = flower.querySelector('.flower-illustration');
        if (illustration) {
            illustration.style.filter = 'brightness(1.1) drop-shadow(0 0 8px rgba(184, 134, 11, 0.2))';
            illustration.style.transition = 'filter 0.4s ease';
        }
    });

    flower.addEventListener('mouseleave', () => {
        const illustration = flower.querySelector('.flower-illustration');
        if (illustration) {
            illustration.style.filter = 'brightness(1) drop-shadow(0 0 0px rgba(184, 134, 11, 0))';
        }
    });
});

// ===== Navigation Scroll Shadow =====
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 2px 15px var(--shadow-deep)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// ===== Journal Page Flip Sound Effect (Visual Only) =====
const journalPages = document.querySelectorAll('.journal-page');

journalPages.forEach((page, index) => {
    page.style.animationDelay = (index * 0.15) + 's';
});

// ===== Initial Moth Generation Check =====
if (isNight) {
    generateMoths();
}