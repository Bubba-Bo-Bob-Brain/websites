/**
 * The Grimoire of Glimmerwood - Interaction Scripts
 * Aesthetic: Tactile, Organic, Magical
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCandleToggle();
    initSeasonalWheel();
    initScrollReveal();
    initHerbariumRandomizer();
});

/**
 * 1. The Cauldron Loader
 * Simulates the "brewing" of the page before revealing the content.
 */
function initLoader() {
    const loader = document.getElementById('loader');
    
    // Simulate a brewing time for immersion
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        // Trigger a gentle fade-in for the main container
        document.querySelector('.book-container').style.animation = 'fadeInUp 1.5s forwards';
    }, 2500);
}

/**
 * 2. Candlelight Mode (Night Mode)
 * Toggles the atmospheric lighting of the grimoire.
 */
function initCandleToggle() {
    const toggle = document.getElementById('candle-toggle');
    const body = document.body;

    toggle.addEventListener('click', () => {
        body.classList.toggle('night-mode');
        
        // Play a subtle "spark" sound effect if we had one, 
        // but visually we'll add a momentary flash
        const flash = document.createElement('div');
        flash.className = 'candle-flash';
        document.body.appendChild(flash);
        
        setTimeout(() => flash.remove(), 500);
    });
}

/**
 * 3. The Seasonal Almanac Wheel
 * Handles the rotation and dynamic content update for foraging.
 */
function initSeasonalWheel() {
    const wheel = document.getElementById('forage-wheel');
    const infoName = document.getElementById('season-name');
    const infoDesc = document.getElementById('season-desc');
    const infoList = document.getElementById('season-list');

    const seasonalData = {
        'Spring': {
            desc: 'The awakening. Sap rises in the maples and the first blossoms brave the chill.',
            items: ['Dandelion Root', 'Wild Garlic', 'Primrose', 'Young Nettle']
        },
        'Summer': {
            desc: 'The peak of potency. Herbs gathered under the solstice sun hold the most fire.',
            items: ['St. John\'s Wort', 'Elderflower', 'Yarrow', 'Wild Mint']
        },
        'Autumn': {
            desc: 'The harvest of decay. Roots deepen and the forest prepares for its long sleep.',
            items: ['Dried Mushrooms', 'Rosehips', 'Hawthorn Berries', 'Elderberries']
        },
        'Winter': {
            desc: 'The silent wisdom. Only the hardiest blooms and the deepest roots remain.',
            items: ['Pine Needles', 'Wintergreen', 'Dried Lichen', 'Frozen Birch Bark']
        }
    };

    let currentRotation = 0;

    // Click to rotate to a specific season
    const segments = document.querySelectorAll('.wheel-segment');
    segments.forEach(segment => {
        segment.addEventListener('click', (e) => {
            const season = segment.getAttribute('data-season');
            const rotations = { 'Spring': 0, 'Summer': -90, 'Autumn': -180, 'Winter': -270 };
            
            currentRotation = rotations[season];
            wheel.style.transform = `rotate(${currentRotation}deg)`;
            
            updateSeasonInfo(season);
            e.stopPropagation();
        });
    });

    function updateSeasonInfo(season) {
        const data = seasonalData[season];
        
        // Fade out content before changing
        infoName.style.opacity = '0';
        infoDesc.style.opacity = '0';
        infoList.style.opacity = '0';

        setTimeout(() => {
            infoName.innerText = season;
            infoDesc.innerText = data.desc;
            
            infoList.innerHTML = '';
            data.items.forEach(item => {
                const li = document.createElement('li');
                li.innerText = item;
                infoList.appendChild(li);
            });

            infoName.style.opacity = '1';
            infoDesc.style.opacity = '1';
            infoList.style.opacity = '1';
        }, 300);
    }
}

/**
 * 4. Scroll Reveal
 * Makes elements drift into view organically.
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotate(0deg)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to recipe cards and herbarium items
    document.querySelectorAll('.recipe-card, .bloom-item, .note-paper').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) rotate(2deg)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(el);
    });
}

/**
 * 5. Herbarium Randomizer
 * Gives the pressed flowers a natural, scattered look.
 */
function initHerbariumRandomizer() {
    const blooms = document.querySelectorAll('.bloom-item');
    blooms.forEach(bloom => {
        const randomRot = (Math.random() * 10 - 5).toFixed(2); // Random between -5 and 5 degrees
        bloom.style.setProperty('--r', `${randomRot}deg`);
    });
}

// Adding a custom style for the candle flash via JS to keep CSS clean
const style = document.createElement('style');
style.innerHTML = `
    .candle-flash {
        position: fixed;
        inset: 0;
        background: white;
        z-index: 10001;
        pointer-events: none;
        animation: flash-out 0.5s ease-out forwards;
    }
    @keyframes flash-out {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    #season-name, #season-desc, #season-list {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);