/* ==========================================================================
   THE WHISPERING BRAMBLE — Script Ledger
   Immersive Interactions for the Fairy Cottage Witch Grimoire
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Botanical Specimen Ledger Data ---
    const herbalSpecimens = {
        lunaria: {
            name: "Lunaria (Honesty)",
            folkName: "Moon-Penny / Silver Plate",
            desc: "These translucent seedpods capture the essence of high tides and secret midnight pathways. Often kept in small coin purses to manifest gentle windfalls, or placed beneath a sleeping feather to induce visions of ancient rivers.",
            ruler: "The Moon",
            element: "Water",
            power: "Illusion & Deep Divination"
        },
        belladonna: {
            name: "Deadly Nightshade",
            folkName: "Dwale / Sorcerer’s Berry",
            desc: "Highly potent and dark-natured. Its purple bell-shaped blossoms grow in limestone ruins. Historically used in minute quantities to widen the sight, or infused into flight-salves. Handle with extreme caution and always wear soft deer-skin gloves.",
            ruler: "Saturn",
            element: "Water",
            power: "Protection & Veil Crossing"
        },
        woodruff: {
            name: "Sweet Woodruff",
            folkName: "Master of the Woods",
            desc: "A sprawling ground-cover that releases a rich vanilla-hay aroma only when thoroughly dried. Hang bundled sprigs in your pantry to keep away mischievous pixies, or steep in summer wine to ward off heavy heartaches.",
            ruler: "Mars",
            element: "Fire",
            power: "Victory & Hearth Cheer"
        },
        chamomile: {
            name: "Golden Chamomile",
            folkName: "Earth Apple",
            desc: "Sun-loving and gentle. This tiny daisy-like herb is the absolute cornerstone of forest medicine. Excellent for washing away worries when brewed, or sprinkling along the threshold to shield the house from fierce lightning strikes.",
            ruler: "The Sun",
            element: "Water",
            power: "Peace & Restorative Sleep"
        }
    };

    // --- Seasonal Foraging Data ---
    const foragingSeasons = {
        spring: {
            title: "Vernal Equinox (Spring)",
            desc: "The wet soil wakes from its winter slumber. The roots are heavy with fresh sap and the green sprouts are tender and sweet.",
            harvest: ["Wild Garlic Ramps", "Dandelion Crowns", "Sweet Birch Sap", "Nettle Tips"]
        },
        summer: {
            title: "Estival Solstice (Summer)",
            desc: "The heat is high and the sun-energy is at its peak. Flowers are ripe with aromatic oils and ready for pressing.",
            harvest: ["St. John's Wort", "Elderflowers", "Wild Lavender", "Meadowsweet"]
        },
        autumn: {
            title: "Harvest Equinox (Autumn)",
            desc: "The leaves fall and the energy retreats down into the earth. Berries are dark and ripe, and roots are dense with magic.",
            harvest: ["Elderberries", "Rosehips", "Dandelion Roots", "Glowcap Fungi"]
        },
        winter: {
            title: "Hibernal Solstice (Winter)",
            desc: "The forest sleeps under a frost sheet. Seek the bark of evergreens and the hardy lichens that cling to old stones.",
            harvest: ["Pine Needles", "Willow Bark", "Usnea Lichen", "Juniper Berries"]
        }
    };

    // --- Potion Brewing Combinations ---
    const recipeBook = [
        {
            ingredients: ["dew", "glowcap"],
            name: "Draught of Dreamless Sleep",
            color: "#2a1b4e"
        },
        {
            ingredients: ["dew", "elderberry"],
            name: "Elderberry Winter Shield Elixir",
            color: "#6b1426"
        },
        {
            ingredients: ["glowcap", "nightshade"],
            name: "Sorcerer’s Sight Oil",
            color: "#184a2d"
        },
        {
            ingredients: ["dew", "nightshade"],
            name: "Lamentation Balm",
            color: "#403121"
        }
    ];

    // --- DOM Elements ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.grimoire-section');
    
    const specimenCards = document.querySelectorAll('.specimen-card');
    const specimenViewer = document.getElementById('specimen-detail');
    const specimenGrid = document.querySelector('.specimen-grid');
    const closeViewerBtn = document.querySelector('.close-viewer');
    
    const ingredientJars = document.querySelectorAll('.ingredient-jar');
    const cauldronList = document.getElementById('cauldron-list');
    const brewBtn = document.getElementById('brew-potion-btn');
    const clearBtn = document.getElementById('clear-cauldron-btn');
    const brewResult = document.getElementById('brew-result');
    const cauldronBrew = document.querySelector('.cauldron-brew');
    
    const foragingWheel = document.getElementById('foraging-wheel');
    const seasonTitle = document.getElementById('season-title');
    const seasonDesc = document.getElementById('season-description');
    const seasonHarvestList = document.getElementById('season-harvest-list');
    
    const modeToggle = document.getElementById('mode-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const ambientAudio = document.getElementById('ambient-audio');

    let currentBrewingIngredients = [];
    let isSoundPlaying = false;
    let wheelRotation = 0;

    // --- Navigation Tabs ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-target');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetSection).classList.add('active');

            // Sound effect on leaf turning
            playWhisperingLeafSound();
        });
    });

    // --- Herbarium Inspector ---
    specimenCards.forEach(card => {
        card.addEventListener('click', () => {
            const herbKey = card.getAttribute('data-herb');
            const data = herbalSpecimens[herbKey];

            if (data) {
                // Populate Inspector
                document.getElementById('viewer-name').textContent = data.name;
                document.getElementById('viewer-folk-name').textContent = `Folk Name: ${data.folkName}`;
                document.getElementById('viewer-desc').textContent = data.desc;
                document.getElementById('viewer-ruler').textContent = data.ruler;
                document.getElementById('viewer-element').textContent = data.element;
                document.getElementById('viewer-power').textContent = data.power;

                // Clone graphic from card
                const graphicContainer = document.getElementById('viewer-graphic');
                graphicContainer.innerHTML = '';
                const flowerPressClone = card.querySelector('.flower-press').cloneNode(true);
                graphicContainer.appendChild(flowerPressClone);

                // Transition UI
                specimenGrid.style.display = 'none';
                specimenViewer.classList.remove('hidden');
            }
        });
    });

    closeViewerBtn.addEventListener('click', () => {
        specimenViewer.classList.add('hidden');
        specimenGrid.style.display = 'grid';
    });

    // --- Cauldron Apothecary Brewing System ---
    ingredientJars.forEach(jar => {
        jar.addEventListener('click', () => {
            const ingredient = jar.getAttribute('data-ingredient');
            const label = jar.querySelector('.jar-label').textContent;

            if (currentBrewingIngredients.length >= 3) {
                alert("The cauldron is bubbling over! Clear it before adding more.");
                return;
            }

            currentBrewingIngredients.push(ingredient);
            updateCauldronLedger();
        });
    });

    function updateCauldronLedger() {
        if (currentBrewingIngredients.length === 0) {
            cauldronList.innerHTML = '<li class="empty-list-placeholder">Add ingredients from the shelf...</li>';
            return;
        }

        cauldronList.innerHTML = '';
        currentBrewingIngredients.forEach(ing => {
            const item = document.createElement('li');
            item.textContent = formatIngredientName(ing);
            cauldronList.appendChild(item);
        });
    }

    function formatIngredientName(key) {
        switch (key) {
            case 'dew': return '💧 Fresh Morning Dew';
            case 'glowcap': return '🍄 Glowcap Spores';
            case 'elderberry': return '🍇 Crushed Elderberries';
            case 'nightshade': return '🌿 Nightshade Leaves';
            default: return key;
        }
    }

    clearBtn.addEventListener('click', () => {
        currentBrewingIngredients = [];
        updateCauldronLedger();
        brewResult.classList.add('hidden');
        cauldronBrew.style.backgroundColor = '#3a1a4a';
    });

    brewBtn.addEventListener('click', () => {
        if (currentBrewingIngredients.length === 0) {
            alert("Your cauldron is empty! Toss some herbs in first.");
            return;
        }

        // Sort ingredients to match recipes regardless of entry order
        const sortedInputs = [...currentBrewingIngredients].sort();
        let matchedRecipe = null;

        for (let recipe of recipeBook) {
            const sortedRecipe = [...recipe.ingredients].sort();
            if (JSON.stringify(sortedInputs) === JSON.stringify(sortedRecipe)) {
                matchedRecipe = recipe;
                break;
            }
        }

        brewResult.classList.remove('hidden');
        const resultMsg = brewResult.querySelector('.result-msg');

        if (matchedRecipe) {
            resultMsg.textContent = `Success! You have brewed a pot of: ${matchedRecipe.name}`;
            cauldronBrew.style.backgroundColor = matchedRecipe.color;
        } else {
            resultMsg.textContent = "The mixture turns a murky grey and fizzes wildly. No legendary potion discovered this time!";
            cauldronBrew.style.backgroundColor = '#4e5452';
        }
    });

    // --- Interactive Seasonal Foraging Wheel ---
    foragingWheel.addEventListener('click', () => {
        wheelRotation += 90;
        foragingWheel.style.transform = `rotate(${wheelRotation}deg)`;

        // Calculate which season lands on top (0 deg is spring, rotates clockwise)
        const segmentCount = 4;
        const normalizedRotation = (wheelRotation % 360) / 90;
        
        // Match rotation step with season index
        const seasons = ['spring', 'winter', 'autumn', 'summer'];
        const activeSeason = seasons[normalizedRotation % segmentCount];

        updateSeasonPanel(activeSeason);
    });

    function updateSeasonPanel(seasonKey) {
        const data = foragingSeasons[seasonKey];
        if (data) {
            seasonTitle.textContent = data.title;
            seasonDesc.textContent = `"${data.desc}"`;
            
            seasonHarvestList.innerHTML = '';
            data.harvest.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `• ${item}`;
                seasonHarvestList.appendChild(li);
            });
        }
    }

    // --- Candlelight & Forest Ambience Settings ---
    modeToggle.addEventListener('click', () => {
        const body = document.body;
        const btnText = modeToggle.querySelector('.btn-text');
        
        if (body.classList.contains('day-mode')) {
            body.classList.replace('day-mode', 'night-mode');
            btnText.textContent = "Snuff the Candle";
        } else {
            body.classList.replace('night-mode', 'day-mode');
            btnText.textContent = "Light the Candle";
        }
    });

    soundToggle.addEventListener('click', () => {
        if (!isSoundPlaying) {
            ambientAudio.play().then(() => {
                isSoundPlaying = true;
                soundToggle.querySelector('.btn-text').textContent = "Silent Forest";
            }).catch(err => {
                console.log("Audio playback blocked by browser.", err);
            });
        } else {
            ambientAudio.pause();
            isSoundPlaying = false;
            soundToggle.querySelector('.btn-text').textContent = "Whispering Leaves";
        }
    });

    function playWhisperingLeafSound() {
        if (isSoundPlaying) {
            // Soft page-turn illusion effect using current active track
            ambientAudio.volume = 0.3;
            setTimeout(() => {
                ambientAudio.volume = 1.0;
            }, 500);
        }
    }

    // --- Ambient Particle Effects (Motes of Light) ---
    const particlesContainer = document.querySelector('.dust-particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = 'rgba(238, 194, 64, 0.4)';
        particle.style.borderRadius = '50%';
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.pointerEvents = 'none';
        
        // Slow float animation
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0.2 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * -150 - 50}px) scale(1.5)`, opacity: 0.8 },
            { transform: 'translate(0, 0) scale(1)', opacity: 0.2 }
        ], {
            duration: Math.random() * 15000 + 10000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        particlesContainer.appendChild(particle);
    }
});