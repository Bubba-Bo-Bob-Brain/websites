/* ============================================
   THISTLEWOOD'S HERBAL COMPENDIUM
   Interactive JavaScript
   ============================================ */

// ============================================
// DATA - Potions, Flowers, Foraging, Remedies
// ============================================

const potionsData = [
    {
        id: 1,
        name: "Moonpetal Elixir",
        category: "healing",
        icon: "🌙",
        description: "A restorative brew for weary bones and tired spirits, best taken under the full moon's gaze.",
        difficulty: 2,
        ingredients: ["Moonpetal flowers", "Chamomile", "Honey", "Spring water", "Silver thistle"],
        instructions: "Steep the moonpetal flowers in spring water under moonlight for one hour. Add chamomile and bring to a gentle simmer. Strain through muslin, stir in honey clockwise seven times, and drink before sleep.",
        notes: "The moonpetal must be gathered on the night of the full moon. Store in a dark glass bottle."
    },
    {
        id: 2,
        name: "Hearthfire Comfort",
        category: "calming",
        icon: "🔥",
        description: "A warming tonic for cold winter evenings and anxious hearts.",
        difficulty: 1,
        ingredients: ["Cinnamon bark", "Dried apple", "Cloves", "Lavender", "Raw honey"],
        instructions: "Simmer cinnamon, apple, and cloves in water for twenty minutes. Remove from heat and add lavender. Cover and steep for five minutes. Strain and sweeten with honey.",
        notes: "Grandmother's recipe. She swore it could calm even the most troubled spirit."
    },
    {
        id: 3,
        name: "Dawn Dew Vigor",
        category: "energy",
        icon: "☀️",
        description: "An invigorating morning draught to chase away sluggishness.",
        difficulty: 2,
        ingredients: ["Fresh mint", "Ginger root", "Lemon balm", "Green tea", "Dewdrops"],
        instructions: "Grate the ginger and bruise the mint leaves. Combine all herbs in a pot with freshly collected dewdrops. Bring to a rolling boil, then immediately remove from heat. Strain and drink while warm.",
        notes: "The dewdrops must be gathered before sunrise. This is non-negotiable."
    },
    {
        id: 4,
        name: "Warding Salve",
        category: "protection",
        icon: "🛡️",
        description: "A protective balm to guard against ill will and dark intentions.",
        difficulty: 3,
        ingredients: ["Rosemary", "Sage", "Black salt", "Beeswax", "Olive oil", "Iron filings"],
        instructions: "Infuse the oil with rosemary and sage over low heat for three hours. Strain and combine with melted beeswax. Add a pinch of black salt and iron filings while chanting the warding words. Pour into jars and let set.",
        notes: "Apply to doorways and windowsills. Recharge under the new moon."
    },
    {
        id: 5,
        name: "Rose & Honey Love Draught",
        category: "love",
        icon: "💕",
        description: "A gentle potion to open the heart to love and kindness.",
        difficulty: 2,
        ingredients: ["Rose petals", "Vanilla bean", "Strawberries", "Raw honey", "Rosewater"],
        instructions: "Muddle fresh rose petals with strawberries. Add to warm (not hot) rosewater with split vanilla bean. Let infuse for one hour. Strain and stir in honey counter-clockwise.",
        notes: "This is for self-love and friendship. Never use to manipulate another's free will."
    },
    {
        id: 6,
        name: "Slumbermist Tincture",
        category: "calming",
        icon: "😴",
        description: "A gentle nudge towards peaceful dreams and restful sleep.",
        difficulty: 1,
        ingredients: ["Valerian root", "Passionflower", "Chamomile", "Lavender", "Warm milk"],
        instructions: "Combine dried herbs in a sachet. Steep in warm milk for ten minutes. Remove sachet and add a drop of honey. Drink slowly while thinking peaceful thoughts.",
        notes: "Keep a dream journal nearby. The dreams that follow are often prophetic."
    },
    {
        id: 7,
        name: "Feverfew's Cooling Balm",
        category: "healing",
        icon: "❄️",
        description: "A cooling remedy for fevers and summer's too-warm embrace.",
        difficulty: 2,
        ingredients: ["Feverfew", "Peppermint", "Aloe vera", "Cucumber", "Spring water"],
        instructions: "Blend cucumber and aloe into a paste. Steep feverfew and peppermint in spring water. Combine and apply to forehead and pulse points.",
        notes: "For external use only. Keep away from eyes."
    },
    {
        id: 8,
        name: "Root & Stone Strength Brew",
        category: "energy",
        icon: "💪",
        description: "A hearty tonic for building resilience and inner fortitude.",
        difficulty: 3,
        ingredients: ["Dandelion root", "Nettle", "Burdock root", "Ginger", "Blackstrap molasses"],
        instructions: "Roast dandelion and burdock roots until fragrant. Combine all ingredients in a pot with four cups of water. Simmer until reduced by half. Strain and add molasses.",
        notes: "Take one tablespoon each morning for a fortnight. Rest for one week, then repeat."
    },
    {
        id: 9,
        name: "Belladonna's Mirror",
        category: "protection",
        icon: "🪞",
        description: "A scrying potion for glimpsing truths hidden in shadow.",
        difficulty: 3,
        ingredients: ["Eyebright", "Mugwort", "Black scrying mirror", "Moonwater", "Silver leaf"],
        instructions: "This potion requires preparation of the mind as much as the ingredients. Fast for one day. At twilight, combine mugwort and eyebright in moonwater. Gaze into the black mirror while the potion steeps. Do not drink.",
        notes: "WARNING: For scrying only. Never ingest belladonna or its relatives."
    }
];

const flowersData = [
    {
        id: 1,
        name: "Wild Violet",
        latin: "Viola odorata",
        emoji: "💜",
        pressDate: "March 15, 1847",
        notes: "Gathered from beneath the old oak. Still fragrant after pressing."
    },
    {
        id: 2,
        name: "Chamomile",
        latin: "Matricaria chamomilla",
        emoji: "🌼",
        pressDate: "June 22, 1845",
        notes: "Summer solstice harvest. Powerful for sleep sachets."
    },
    {
        id: 3,
        name: "Rose Hip",
        latin: "Rosa canina",
        emoji: "🌹",
        pressDate: "October 3, 1848",
        notes: "From the climbing rose by the garden gate. Best for vitamin C tea."
    },
    {
        id: 4,
        name: "Lavender",
        latin: "Lavandula angustifolia",
        emoji: "💐",
        pressDate: "July 14, 1846",
        notes: "The bees love these. Press carefully - petals are delicate."
    },
    {
        id: 5,
        name: "Elderflower",
        latin: "Sambucus nigra",
        emoji: "🤍",
        pressDate: "May 28, 1849",
        notes: "The elder tree by Mirror Pond was generous this year."
    },
    {
        id: 6,
        name: "Foxglove",
        latin: "Digitalis purpurea",
        emoji: "💗",
        pressDate: "June 8, 1847",
        notes: "Beautiful but deadly. Handle with utmost care."
    },
    {
        id: 7,
        name: "Forget-Me-Not",
        latin: "Myosotis sylvatica",
        emoji: "💙",
        pressDate: "April 20, 1848",
        notes: "For memory charms. Grandmother planted these."
    },
    {
        id: 8,
        name: "Meadowsweet",
        latin: "Filipendula ulmaria",
        emoji: "🌸",
        pressDate: "August 12, 1846",
        notes: "Queen of the meadow. Natural pain reliever."
    }
];

const foragingData = {
    spring: [
        {
            name: "Nettles",
            icon: "🌿",
            location: "Forest edges, stream banks",
            description: "Young nettles are at their most tender before flowering. Wear thick gloves when harvesting! Rich in iron and perfect for spring tonics.",
            tips: ["Harvest top four leaves only", "Best before flowering", "Wear gloves!", "Makes excellent tea and soup"]
        },
        {
            name: "Violets",
            icon: "💜",
            location: "Shaded woodland floors",
            description: "Sweet violets bloom in early spring. Both flowers and leaves are edible. Perfect for candying or adding to salads.",
            tips: ["Pick in the morning", "Use within a day", "Flowers can be crystallized", "Leaves are rich in vitamin C"]
        },
        {
            name: "Wild Garlic",
            icon: "🧄",
            location: "Damp woodland floors",
            description: "The pungent smell announces its presence before you see it. Excellent in pesto, soups, and as a spring cleanser.",
            tips: ["Identify by smell", "Leaves only - don't uproot", "Makes wonderful pesto", "Good blood cleanser"]
        }
    ],
    summer: [
        {
            name: "Elderflower",
            icon: "🌸",
            location: "Hedgerows, woodland edges",
            description: "The creamy white clusters of elderflower mark high summer. Perfect for cordials, champagne, and fritters.",
            tips: ["Pick on dry mornings", "Avoid flowers with brown spots", "Leave some for the elder's spirits", "Makes divine cordial"]
        },
        {
            name: "St. John's Wort",
            icon: "💛",
            location: "Meadows, field edges",
            description: "The golden flowers bloom around St. John's Day (June 24th). A powerful mood-lifter and wound healer.",
            tips: ["Flowers should release red oil", "Harvest at midday", "Excellent for skin salves", "Avoid if on medication"]
        },
        {
            name: "Meadowsweet",
            icon: "🌼",
            location: "Damp meadows, riverbanks",
            description: "Queen of the meadow with its almond-honey scent. Natural source of aspirin-like compounds.",
            tips: ["Pick in full bloom", "Dry upside down", "Good for headaches", "Adds flavor to mead"]
        }
    ],
    autumn: [
        {
            name: "Rose Hips",
            icon: "🔴",
            location: "Hedgerows, garden edges",
            description: "After the first frost, rose hips become sweeter. Packed with vitamin C for winter immunity.",
            tips: ["Wait for first frost", "Remove seeds carefully", "Makes excellent syrup", "Dry for winter tea"]
        },
        {
            name: "Hawthorn Berries",
            icon: "🍒",
            location: "Hedgerows, woodland edges",
            description: "The 'bread and cheese' tree offers heart-healthy berries in autumn. Good for the heart in every sense.",
            tips: ["Harvest when fully red", "Don't eat the seeds", "Good for heart health", "Makes tasty jelly"]
        },
        {
            name: "Sloes",
            icon: "🫐",
            location: "Blackthorn hedgerows",
            description: "These small, tart berries are best after the first frost. Essential for sloe gin.",
            tips: ["Wait for frost", "Prick before steeping", "Makes wonderful gin", "Very astringent raw"]
        }
    ],
    winter: [
        {
            name: "Pine Needles",
            icon: "🌲",
            location: "Pine forests, gardens",
            description: "Evergreen and full of vitamin C even in winter. Makes a refreshing tea when everything else is dormant.",
            tips: ["Use fresh green needles", "Avoid yew - it's poisonous", "Rich in vitamin C", "Good for respiratory health"]
        },
        {
            name: "Ivy Berries",
            icon: "🟢",
            location: "Old walls, woodland",
            description: "While the berries are toxic to humans, the leaves have traditional uses. For external preparations only.",
            tips: ["Berries are toxic", "Leaves for external use only", "Traditional for cellulite", "Respect this powerful plant"]
        },
        {
            name: "Birch Bark",
            icon: "🪵",
            location: "Birch groves",
            description: "The papery bark can be harvested sustainably from fallen branches. Used traditionally for pain relief.",
            tips: ["Use fallen branches only", "Never ring-bark a tree", "Contains natural salicylates", "Make into tea or salve"]
        }
    ]
};

const remedyNotesData = [
    {
        id: 1,
        title: "Grandmother's Cold Cure",
        category: "cold",
        content: "Honey, lemon, ginger, and a splash of whisky. Drink hot and go straight to bed. Works every time.",
        color: "parchment",
        rotation: -2
    },
    {
        id: 2,
        title: "For Troubled Sleep",
        category: "sleep",
        content: "Sew a small sachet of lavender, chamomile, and hops. Place under your pillow. The dreams will be kinder.",
        color: "lavender",
        rotation: 3
    },
    {
        id: 3,
        title: "Wart Charm",
        category: "skin",
        content: "Rub a stolen dishcloth on the wart, then bury it under a stone. When the cloth rots, the wart vanishes. Old magic.",
        color: "parchment",
        rotation: -1
    },
    {
        id: 4,
        title: "Stomach Settler",
        category: "digestive",
        content: "Peppermint tea with a pinch of fennel seeds. Sip slowly. If particularly bad, add a drop of ginger tincture.",
        color: "sage",
        rotation: 2
    },
    {
        id: 5,
        title: "Melancholy Lift",
        category: "mood",
        content: "St. John's Wort tea three times daily. Also: get outside, even in rain. The forest knows how to heal heavy hearts.",
        color: "buttercup",
        rotation: -3
    },
    {
        id: 6,
        title: "Fever Breaker",
        category: "cold",
        content: "Willow bark tea. Cool cloths on forehead. Elderflower to promote sweating. Watch carefully for three days.",
        color: "rose",
        rotation: 1
    }
];

const moonPhases = [
    { name: "New Moon", note: "A time for new beginnings. Plant seeds of intention.", coverage: 0 },
    { name: "Waxing Crescent", note: "Gathering energy. Good for starting new remedies.", coverage: 0.25 },
    { name: "First Quarter", note: "A time of decision. Review your herb stocks.", coverage: 0.5 },
    { name: "Waxing Gibbous", note: "The herbs' power grows with the moon. Gather strength-building tonics.", coverage: 0.75 },
    { name: "Full Moon", note: "Peak potency! Harvest herbs and charge moonwater.", coverage: 1 },
    { name: "Waning Gibbous", note: "Time for gratitude. Make offerings to the garden.", coverage: 0.75 },
    { name: "Last Quarter", note: "Release what no longer serves. Cleanse and purify.", coverage: 0.5 },
    { name: "Waning Crescent", note: "Rest and reflection. Let the garden sleep.", coverage: 0.25 }
];

// ============================================
// STATE MANAGEMENT
// ============================================

let currentSection = 'home';
let currentSeason = 'spring';
let currentPotionFilter = 'all';
let remedyNotes = [...remedyNotesData];
let userNotes = JSON.parse(localStorage.getItem('herbalistNotes')) || [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initThemeToggle();
    initNavigation();
    initSearch();
    initSeasonWheel();
    initPotions();
    initFlowers();
    initForaging();
    initRemedyNotes();
    initMoonPhase();
    initAmbientParticles();
    initModals();
});

// ============================================
// LOADING SCREEN
// ============================================

function initLoader() {
    const loader = document.getElementById('cauldron-loader');
    
    // Hide loader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 2000);
    });
    
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2000);
    }
}

// ============================================
// THEME TOGGLE
// ============================================

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('herbalistTheme') || 'day';
    html.setAttribute('data-theme', savedTheme);
    
    toggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'day' ? 'night' : 'day';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('herbalistTheme', newTheme);
        
        // Add a little sparkle effect
        createSparkle(toggle);
    });
}

function createSparkle(element) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: var(--buttercup);
        border-radius: 50%;
        pointer-events: none;
        animation: sparkle 0.6s ease-out forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = rect.left + rect.width / 2 + 'px';
    sparkle.style.top = rect.top + rect.height / 2 + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 600);
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const ribbons = document.querySelectorAll('.nav-ribbon');
    
    ribbons.forEach(ribbon => {
        ribbon.addEventListener('click', () => {
            const section = ribbon.dataset.section;
            navigateToSection(section);
        });
    });
}

function navigateToSection(sectionId) {
    // Update nav ribbons
    document.querySelectorAll('.nav-ribbon').forEach(r => {
        r.classList.toggle('active', r.dataset.section === sectionId);
    });
    
    // Update sections
    document.querySelectorAll('.grimoire-section').forEach(s => {
        s.classList.remove('active-section');
    });
    
    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active-section');
        currentSection = sectionId;
        
        // Smooth scroll to content
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initSearch() {
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    
    let debounceTimer;
    
    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 2) {
                results.hidden = true;
                return;
            }
            
            const searchResults = performSearch(query);
            displaySearchResults(searchResults);
        }, 300);
    });
    
    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            results.hidden = true;
        }
    });
}

function performSearch(query) {
    const results = [];
    
    // Search potions
    potionsData.forEach(potion => {
        if (potion.name.toLowerCase().includes(query) || 
            potion.description.toLowerCase().includes(query) ||
            potion.ingredients.some(i => i.toLowerCase().includes(query))) {
            results.push({
                type: 'potion',
                id: potion.id,
                title: potion.name,
                preview: potion.description.substring(0, 60) + '...',
                icon: potion.icon
            });
        }
    });
    
    // Search flowers
    flowersData.forEach(flower => {
        if (flower.name.toLowerCase().includes(query) || 
            flower.latin.toLowerCase().includes(query)) {
            results.push({
                type: 'flower',
                id: flower.id,
                title: flower.name,
                preview: flower.latin,
                icon: flower.emoji
            });
        }
    });
    
    // Search remedy notes
    const allNotes = [...remedyNotes, ...userNotes];
    allNotes.forEach(note => {
        if (note.title.toLowerCase().includes(query) || 
            note.content.toLowerCase().includes(query)) {
            results.push({
                type: 'remedy',
                id: note.id,
                title: note.title,
                preview: note.content.substring(0, 60) + '...',
                icon: '📜'
            });
        }
    });
    
    return results.slice(0, 8);
}

function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    
    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">No recipes found in the compendium...</div>';
        container.hidden = false;
        return;
    }
    
    container.innerHTML = results.map(result => `
        <div class="search-result-item" data-type="${result.type}" data-id="${result.id}">
            <span class="result-icon">${result.icon}</span>
            <div class="result-content">
                <span class="result-title">${result.title}</span>
                <span class="result-preview">${result.preview}</span>
            </div>
        </div>
    `).join('');
    
    container.hidden = false;
    
    // Add click handlers
    container.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            handleSearchResultClick(item.dataset.type, parseInt(item.dataset.id));
            container.hidden = true;
            document.getElementById('search-input').value = '';
        });
    });
}

function handleSearchResultClick(type, id) {
    switch(type) {
        case 'potion':
            navigateToSection('potions');
            setTimeout(() => openRecipeModal(id), 300);
            break;
        case 'flower':
            navigateToSection('flowers');
            break;
        case 'remedy':
            navigateToSection('remedies');
            break;
    }
}

// ============================================
// SEASONAL WHEEL
// ============================================

function initSeasonWheel() {
    updateSeasonWheel();
    renderRecentRecipes();
}

function updateSeasonWheel() {
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    const seasonEmojis = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' };
    const seasonNames = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' };
    
    // Determine current real season
    const month = new Date().getMonth();
    let realSeason;
    if (month >= 2 && month <= 4) realSeason = 'spring';
    else if (month >= 5 && month <= 7) realSeason = 'summer';
    else if (month >= 8 && month <= 10) realSeason = 'autumn';
    else realSeason = 'winter';
    
    currentSeason = realSeason;
    
    // Update wheel center
    document.getElementById('current-season-label').textContent = seasonNames[currentSeason];
    document.getElementById('current-season-icon').textContent = seasonEmojis[currentSeason];
    
    // Update season info
    updateSeasonInfo(currentSeason);
    
    // Create wheel segments
    const outerRing = document.querySelector('.wheel-outer');
    outerRing.innerHTML = '';
    
    seasons.forEach((season, index) => {
        const segment = document.createElement('div');
        segment.className = `wheel-segment segment-${season}`;
        segment.style.transform = `rotate(${index * 90}deg)`;
        segment.innerHTML = `<span class="segment-emoji">${seasonEmojis[season]}</span>`;
        segment.addEventListener('click', () => {
            currentSeason = season;
            updateSeasonWheel();
        });
        outerRing.appendChild(segment);
    });
}

function updateSeasonInfo(season) {
    const seasonInfo = {
        spring: {
            name: "Spring Foraging",
            description: "The earth awakens! Seek out tender nettles, violet blossoms, and the first elderflowers along the hedgerows.",
            ingredients: [
                { emoji: "🌿", name: "Nettles", note: "Best before flowering" },
                { emoji: "💜", name: "Violets", note: "Pick in morning dew" },
                { emoji: "🧄", name: "Wild Garlic", note: "Follow the scent" }
            ]
        },
        summer: {
            name: "Summer Foraging",
            description: "The hedgerows burst with life! Elderflower, meadowsweet, and St. John's Wort reach their peak power.",
            ingredients: [
                { emoji: "🌸", name: "Elderflower", note: "Leave some for the fairies" },
                { emoji: "🌼", name: "Meadowsweet", note: "Queen of the meadow" },
                { emoji: "💛", name: "St. John's Wort", note: "Harvest at midday" }
            ]
        },
        autumn: {
            name: "Autumn Foraging",
            description: "Time to gather the harvest! Rose hips, sloes, and hawthorn berries offer their gifts before winter.",
            ingredients: [
                { emoji: "🔴", name: "Rose Hips", note: "After first frost" },
                { emoji: "🫐", name: "Sloes", note: "Prick before steeping" },
                { emoji: "🍒", name: "Hawthorn", note: "For the heart" }
            ]
        },
        winter: {
            name: "Winter Foraging",
            description: "Even in dormancy, the forest provides. Pine needles, ivy, and birch bark offer their winter gifts.",
            ingredients: [
                { emoji: "🌲", name: "Pine Needles", note: "Vitamin C rich" },
                { emoji: "🪵", name: "Birch Bark", note: "From fallen branches" },
                { emoji: "🟢", name: "Ivy Leaves", note: "External use only" }
            ]
        }
    };
    
    const info = seasonInfo[season];
    document.querySelector('.season-name').textContent = info.name;
    document.querySelector('.season-description').textContent = info.description;
    
    const ingredientsList = document.getElementById('season-ingredients-list');
    ingredientsList.innerHTML = info.ingredients.map(ing => `
        <li class="ingredient-item">
            <span class="ingredient-emoji">${ing.emoji}</span>
            <span class="ingredient-name">${ing.name}</span>
            <span class="ingredient-note">${ing.note}</span>
        </li>
    `).join('');
}

function renderRecentRecipes() {
    const container = document.getElementById('recent-recipes');
    const recentPotions = potionsData.slice(0, 6);
    
    container.innerHTML = recentPotions.map(potion => `
        <div class="recipe-card-mini" data-id="${potion.id}">
            <span class="mini-icon">${potion.icon}</span>
            <h4>${potion.name}</h4>
            <p>${potion.description.substring(0, 50)}...</p>
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.recipe-card-mini').forEach(card => {
        card.addEventListener('click', () => {
            openRecipeModal(parseInt(card.dataset.id));
        });
    });
    
    // Scroll arrows
    const scrollContainer = document.querySelector('.recipe-scroll-container');
    const scrollLeft = scrollContainer.querySelector('.scroll-left');
    const scrollRight = scrollContainer.querySelector('.scroll-right');
    
    scrollLeft.addEventListener('click', () => {
        container.scrollBy({ left: -220, behavior: 'smooth' });
    });
    
    scrollRight.addEventListener('click', () => {
        container.scrollBy({ left: 220, behavior: 'smooth' });
    });
}

// ============================================
// POTIONS
// ============================================

function initPotions() {
    renderPotions();
    initPotionFilters();
}

function renderPotions(filter = 'all') {
    const container = document.getElementById('potions-grid');
    const filteredPotions = filter === 'all' 
        ? potionsData 
        : potionsData.filter(p => p.category === filter);
    
    container.innerHTML = filteredPotions.map(potion => `
        <div class="potion-card" data-id="${potion.id}" data-category="${potion.category}">
            <span class="potion-icon">${potion.icon}</span>
            <h3>${potion.name}</h3>
            <span class="potion-category">${potion.category}</span>
            <p class="potion-description">${potion.description}</p>
            <div class="potion-difficulty">
                <span>Difficulty:</span>
                <div class="difficulty-dots">
                    ${Array(3).fill(0).map((_, i) => 
                        `<span class="difficulty-dot ${i < potion.difficulty ? 'filled' : ''}"></span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.potion-card').forEach(card => {
        card.addEventListener('click', () => {
            openRecipeModal(parseInt(card.dataset.id));
        });
    });
}

function initPotionFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.filter;
            currentPotionFilter = filter;
            renderPotions(filter);
        });
    });
}

// ============================================
// FLOWERS / HERBARIUM
// ============================================

function initFlowers() {
    renderFlowers();
}

function renderFlowers() {
    const container = document.getElementById('herbarium-grid');
    
    container.innerHTML = flowersData.map(flower => `
        <div class="flower-specimen" data-id="${flower.id}">
            <span class="flower-illustration">${flower.emoji}</span>
            <h4>${flower.name}</h4>
            <span class="latin-name">${flower.latin}</span>
            <span class="press-date">Pressed: ${flower.pressDate}</span>
        </div>
    `).join('');
}

// ============================================
// FORAGING GUIDES
// ============================================

function initForaging() {
    renderForagingCards(currentSeason);
    initSeasonTabs();
}

function renderForagingCards(season) {
    const container = document.getElementById('foraging-guides');
    const guides = foragingData[season];
    
    container.innerHTML = guides.map(guide => `
        <div class="foraging-card">
            <h3><span>${guide.icon}</span> ${guide.name}</h3>
            <span class="location">📍 ${guide.location}</span>
            <p class="description">${guide.description}</p>
            <div class="tips">
                <h4>Gathering Tips</h4>
                <ul>
                    ${guide.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function initSeasonTabs() {
    const tabs = document.querySelectorAll('.season-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const season = tab.dataset.season;
            renderForagingCards(season);
        });
    });
}

// ============================================
// REMEDY NOTES
// ============================================

function initRemedyNotes() {
    renderRemedyNotes();
    initAddNoteButton();
}

function renderRemedyNotes() {
    const container = document.getElementById('remedy-corkboard');
    const allNotes = [...remedyNotes, ...userNotes];
    
    container.innerHTML = allNotes.map(note => `
        <div class="remedy-note note-${note.color || 'parchment'}" 
             style="--rotation: ${note.rotation || 0}deg"
             data-id="${note.id}">
            <h4>${note.title}</h4>
            <span class="note-category">${note.category}</span>
            <p class="note-content">${note.content}</p>
        </div>
    `).join('');
}

function initAddNoteButton() {
    const btn = document.getElementById('add-note-btn');
    
    btn.addEventListener('click', () => {
        openNoteModal();
    });
}

// ============================================
// MOON PHASE
// ============================================

function initMoonPhase() {
    updateMoonPhase();
}

function updateMoonPhase() {
    const moonPhase = calculateMoonPhase();
    const phaseInfo = moonPhases[moonPhase.index];
    
    document.getElementById('moon-phase-name').textContent = phaseInfo.name;
    document.getElementById('moon-herbalist-note').textContent = phaseInfo.note;
    document.getElementById('footer-moon').textContent = `🌙 Current phase: ${phaseInfo.name}`;
    
    // Update moon visual
    const moonShadow = document.getElementById('moon-shadow');
    if (moonShadow) {
        const coverage = moonPhase.coverage;
        moonShadow.style.clipPath = `inset(0 ${coverage * 100}% 0 0)`;
    }
}

function calculateMoonPhase() {
    // Simplified moon phase calculation
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Calculate approximate moon age (days since last new moon)
    const c = Math.floor(365.25 * year);
    const e = Math.floor(30.6 * month);
    const jd = c + e + day - 694039.09;
    const phase = jd / 29.53058867;
    const age = (phase - Math.floor(phase)) * 29.53058867;
    
    // Determine phase index
    let index;
    if (age < 1.85) index = 0; // New Moon
    else if (age < 5.53) index = 1; // Waxing Crescent
    else if (age < 9.22) index = 2; // First Quarter
    else if (age < 12.91) index = 3; // Waxing Gibbous
    else if (age < 16.61) index = 4; // Full Moon
    else if (age < 20.30) index = 5; // Waning Gibbous
    else if (age < 23.99) index = 6; // Last Quarter
    else if (age < 27.68) index = 7; // Waning Crescent
    else index = 0; // New Moon
    
    return {
        index: index,
        age: age,
        coverage: moonPhases[index].coverage
    };
}

// ============================================
// AMBIENT PARTICLES
// ============================================

function initAmbientParticles() {
    const container = document.getElementById('ambient-particles');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        container.appendChild(particle);
    }
}

// ============================================
// MODALS
// ============================================

function initModals() {
    // Recipe modal
    const recipeModal = document.getElementById('recipe-modal');
    const recipeClose = document.getElementById('modal-close');
    
    recipeClose.addEventListener('click', () => closeRecipeModal());
    recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) closeRecipeModal();
    });
    
    // Note modal
    const noteModal = document.getElementById('note-modal');
    const noteClose = document.getElementById('note-modal-close');
    
    noteClose.addEventListener('click', () => closeNoteModal());
    noteModal.addEventListener('click', (e) => {
        if (e.target === noteModal) closeNoteModal();
    });
    
    // Note form
    const noteForm = document.getElementById('note-form');
    noteForm.addEventListener('submit', handleNoteSubmit);
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeRecipeModal();
            closeNoteModal();
        }
    });
}

function openRecipeModal(id) {
    const potion = potionsData.find(p => p.id === id);
    if (!potion) return;
    
    const modal = document.getElementById('recipe-modal');
    const title = document.getElementById('modal-title');
    const meta = document.getElementById('modal-meta');
    const body = document.getElementById('modal-body');
    
    title.textContent = potion.name;
    meta.innerHTML = `
        <span class="meta-category">${potion.icon} ${potion.category}</span>
        <span class="meta-difficulty">Difficulty: ${'★'.repeat(potion.difficulty)}${'☆'.repeat(3 - potion.difficulty)}</span>
    `;
    
    body.innerHTML = `
        <p class="handwritten-note">${potion.description}</p>
        
        <h3>Ingredients</h3>
        <ul>
            ${potion.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        
        <h3>Instructions</h3>
        <p>${potion.instructions}</p>
        
        <h4>Notes from Hazel</h4>
        <p class="handwritten-note">${potion.notes}</p>
    `;
    
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    modal.hidden = true;
    document.body.style.overflow = '';
}

function openNoteModal() {
    const modal = document.getElementById('note-modal');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    
    // Reset form
    document.getElementById('note-form').reset();
}

function closeNoteModal() {
    const modal = document.getElementById('note-modal');
    modal.hidden = true;
    document.body.style.overflow = '';
}

function handleNoteSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('note-title-input').value;
    const content = document.getElementById('note-content-input').value;
    const category = document.getElementById('note-category-input').value;
    const color = document.querySelector('input[name="note-color"]:checked').value;
    
    const newNote = {
        id: Date.now(),
        title,
        content,
        category,
        color,
        rotation: (Math.random() - 0.5) * 6
    };
    
    userNotes.push(newNote);
    localStorage.setItem('herbalistNotes', JSON.stringify(userNotes));
    
    renderRemedyNotes();
    closeNoteModal();
    
    // Show confirmation
    showToast('Note pinned to corkboard!');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--sage-green);
        color: var(--cream);
        padding: 12px 24px;
        border-radius: 24px;
        font-family: var(--font-handwritten);
        font-size: 1.1rem;
        box-shadow: 0 4px 20px var(--shadow-medium);
        z-index: 3000;
        animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Add toast animations to stylesheet
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes toastIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes toastOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
    @keyframes sparkle {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
    .search-no-results {
        padding: 16px;
        text-align: center;
        font-family: var(--font-handwritten);
        color: var(--text-muted);
    }
    .search-result-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.2s ease;
        border-bottom: 1px solid var(--parchment-dark);
    }
    .search-result-item:hover {
        background: var(--parchment);
    }
    .search-result-item:last-child {
        border-bottom: none;
    }
    .result-icon {
        font-size: 1.5rem;
    }
    .result-content {
        display: flex;
        flex-direction: column;
    }
    .result-title {
        font-family: var(--font-display);
        color: var(--deep-burgundy);
    }
    .result-preview {
        font-size: 0.85rem;
        color: var(--text-muted);
    }
    .wheel-segment {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 8px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    .wheel-segment:hover {
        transform: rotate(var(--rotation)) scale(1.1);
    }
    .segment-emoji {
        font-size: 1.2rem;
        transform: rotate(calc(var(--rotation) * -1));
    }
    .mini-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 8px;
    }
    .modal-meta {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }
    .meta-category, .meta-difficulty {
        font-size: 0.9rem;
        color: var(--text-muted);
    }
`;
document.head.appendChild(toastStyles);