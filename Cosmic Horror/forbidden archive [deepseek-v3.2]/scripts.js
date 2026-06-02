/**
 * NECRONOMICON DIGITALIS - Eldritch Archive JavaScript
 * This terminal is unstable. Reality not guaranteed.
 */

// Global State
const archiveState = {
    sanity: 87,
    corruptionLevel: 12,
    documentsAccessed: 3,
    timeInArchive: 462, // seconds
    currentTheme: 'dark',
    isCorrupting: false,
    searchHistory: [],
    mousePosition: { x: 0, y: 0 }
};

// DOM Elements
const sanityBar = document.getElementById('sanityBar');
const sanityFill = document.getElementById('sanityFill');
const sanityValue = document.getElementById('sanityValue');
const sanityWarning = document.getElementById('sanityWarning');
const sanityOverlay = document.getElementById('sanityOverlay');
const mainContainer = document.getElementById('mainContainer');
const archiveSearch = document.getElementById('archiveSearch');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const documentText = document.getElementById('documentText');
const corruptTextBtn = document.getElementById('corruptTextBtn');
const translateBtn = document.getElementById('translateBtn');
const saveSanityBtn = document.getElementById('saveSanityBtn');
const toggleThemeBtn = document.getElementById('toggleTheme');
const emergencyPurgeBtn = document.getElementById('emergencyPurge');
const revealTruthBtn = document.getElementById('revealTruth');
const corruptionLevelEl = document.getElementById('corruptionLevel');
const accessedTodayEl = document.getElementById('accessedToday');
const timeInArchiveEl = document.getElementById('timeInArchive');
const documentCountEl = document.getElementById('documentCount');
const clearanceLevelEl = document.getElementById('clearanceLevel');

// Search Results Database (Disturbing Archive Entries)
const archiveEntries = [
    {
        id: 'ENT-001',
        title: 'The King in Yellow (Act I, Scene iii)',
        content: 'Cassilda: "Have you seen the Yellow Sign?" Camilla: "I have seen it in my dreams, where it glows with a light that is not light..."',
        sanityCost: 8,
        tags: ['forbidden-play', 'carcosa', 'hastur'],
        corruption: 'high'
    },
    {
        id: 'ENT-007',
        title: 'Necronomicon Excerpt (Al-Hazred)',
        content: 'That is not dead which can eternal lie, And with strange aeons even death may die. The stars are not right for their return...',
        sanityCost: 15,
        tags: ['arabic', 'cthulhu', 'rlyeh'],
        corruption: 'extreme'
    },
    {
        id: 'ENT-013',
        title: 'De Vermiis Mysteriis (Fragment)',
        content: 'The worms of the earth know secrets older than mankind. They whisper of cycles beyond counting, of aeons before the first star...',
        sanityCost: 12,
        tags: ['latin', 'worms', 'cyclical-time'],
        corruption: 'medium'
    },
    {
        id: 'ENT-042',
        title: 'Pnakotic Manuscripts (Translation Attempt)',
        content: 'Coordinates do not map to three dimensions. The angles are wrong. The geometry folds in ways the mind cannot hold...',
        sanityCost: 20,
        tags: ['non-euclidean', 'yith', 'great-race'],
        corruption: 'extreme'
    },
    {
        id: 'ENT-066',
        title: 'Star Chart of Xoth',
        content: 'Constellations that never were. Stars that died before light reached Earth. Nebulae that dream of waking...',
        sanityCost: 10,
        tags: ['dead-stars', 'xoth', 'azathoth'],
        corruption: 'high'
    },
    {
        id: 'ENT-099',
        title: 'Witness Account #7 (Redacted)',
        content: 'It had too many eyes, and they were in the wrong places. It spoke without moving, and the words carved themselves into my mind...',
        sanityCost: 18,
        tags: ['redacted', 'witness', 'cognitive-hazard'],
        corruption: 'extreme'
    },
    {
        id: 'ENT-666',
        title: '███████████████',
        content: '████████████████████████████████████████████████████████████████████████████████',
        sanityCost: 99,
        tags: ['████', '██████', '████████'],
        corruption: 'maximum'
    }
];

// Disturbing Search Suggestions
const searchSuggestions = [
    "How to summon Azathoth",
    "Non-Euclidean geometry proofs",
    "Stars that should not exist",
    "The color out of space",
    "What lies beyond the angles",
    "Dreams of dead civilizations",
    "The silence in hyperspace",
    "Eyes that watch from nowhere",
    "Blood rituals of the deep ones",
    "The geometry of madness",
    "Whispers in static",
    "Cities beneath the waves",
    "The blackness between stars",
    "Things that should not be known",
    "The truth behind your eyes"
];

// Initialize Archive
function initArchive() {
    console.log('%cNECRONOMICON DIGITALIS Δ-7 INITIALIZED', 'color: #d4af37; font-size: 16px; font-weight: bold;');
    console.log('%cWARNING: Cognitive hazards detected. Proceed with caution.', 'color: #8b0000;');
    
    // Update all UI elements
    updateSanityUI();
    updateStatsUI();
    startArchiveTimer();
    setupEventListeners();
    setupMouseTracking();
    setupTextCorruption();
    preloadDisturbingEffects();
    
    // Initial random corruption effect
    setTimeout(() => {
        randomCorruptionEffect();
    }, 2000);
}

// Update Sanity UI
function updateSanityUI() {
    const sanity = archiveState.sanity;
    
    // Update meter visuals
    sanityBar.style.width = `${sanity}%`;
    sanityFill.style.width = `${sanity}%`;
    sanityValue.textContent = `${sanity}%`;
    
    // Update warning text based on sanity level
    let warningText = '';
    let warningIcon = 'fas fa-brain';
    
    if (sanity >= 70) {
        warningText = 'Perception stable';
        warningIcon = 'fas fa-brain';
    } else if (sanity >= 40) {
        warningText = 'Minor cognitive strain detected';
        warningIcon = 'fas fa-exclamation-triangle';
    } else if (sanity >= 20) {
        warningText = 'Reality distortion increasing';
        warningIcon = 'fas fa-skull-crossbones';
    } else {
        warningText = 'IMMINENT COGNITIVE COLLAPSE';
        warningIcon = 'fas fa-radiation-alt';
    }
    
    sanityWarning.innerHTML = `<i class="${warningIcon}"></i><span>${warningText}</span>`;
    
    // Update CSS variables for sanity-based effects
    updateSanityEffects();
    
    // Update clearance level based on sanity
    updateClearanceLevel();
}

// Update Sanity Visual Effects
function updateSanityEffects() {
    const sanity = archiveState.sanity;
    const root = document.documentElement;
    
    // Calculate effects based on sanity
    const blurAmount = Math.max(0, (100 - sanity) / 10); // 0px to 10px blur
    const distortionAmount = Math.max(0, (100 - sanity) / 5); // 0% to 20% distortion
    const opacityAmount = Math.max(0.3, sanity / 100); // 0.3 to 1 opacity
    const hueRotate = Math.max(0, (100 - sanity) * 1.8); // 0deg to 180deg
    
    // Apply CSS variables
    root.style.setProperty('--sanity-blur', `${blurAmount}px`);
    root.style.setProperty('--sanity-distortion', `${distortionAmount}%`);
    root.style.setProperty('--sanity-opacity', `${opacityAmount}`);
    
    // Apply filter to overlay
    sanityOverlay.style.filter = `hue-rotate(${hueRotate}deg) brightness(${0.5 + sanity/200})`;
    
    // Update container distortion based on sanity
    const distortionX = (Math.random() - 0.5) * (100 - sanity) / 20;
    const distortionY = (Math.random() - 0.5) * (100 - sanity) / 20;
    const rotation = (Math.random() - 0.5) * (100 - sanity) / 50;
    
    mainContainer.style.transform = `perspective(1000px) rotateX(${0.5 + rotation}deg) rotateY(${distortionX}deg)`;
}

// Update Clearance Level
function updateClearanceLevel() {
    const sanity = archiveState.sanity;
    let clearance = '';
    
    if (sanity >= 80) clearance = 'Φ-Θ';
    else if (sanity >= 60) clearance = 'Ψ-Λ';
    else if (sanity >= 40) clearance = 'Ω-Σ';
    else if (sanity >= 20) clearance = 'Χ-Π';
    else clearance = 'Δ-Γ';
    
    clearanceLevelEl.textContent = clearance;
    
    // Add glitch effect at low sanity
    if (sanity < 30) {
        clearanceLevelEl.classList.add('glitch-text');
    } else {
        clearanceLevelEl.classList.remove('glitch-text');
    }
}

// Update Stats UI
function updateStatsUI() {
    corruptionLevelEl.textContent = `${archiveState.corruptionLevel}%`;
    accessedTodayEl.textContent = archiveState.documentsAccessed;
    documentCountEl.textContent = archiveState.documentsAccessed + 10; // Base + accessed
    
    // Update time display
    const minutes = Math.floor(archiveState.timeInArchive / 60);
    const seconds = archiveState.timeInArchive % 60;
    timeInArchiveEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update stat bars
    document.querySelector('.corruption-bar').style.width = `${archiveState.corruptionLevel}%`;
    document.querySelector('.access-bar').style.width = `${Math.min(100, archiveState.documentsAccessed * 10)}%`;
    document.querySelector('.time-bar').style.width = `${Math.min(100, archiveState.timeInArchive / 10)}%`;
}

// Archive Timer
function startArchiveTimer() {
    setInterval(() => {
        archiveState.timeInArchive++;
        updateStatsUI();
        
        // Random sanity drain over time
        if (Math.random() < 0.01) { // 1% chance per second
            modifySanity(-1);
        }
        
        // Random corruption increase
        if (Math.random() < 0.005) { // 0.5% chance per second
            archiveState.corruptionLevel = Math.min(100, archiveState.corruptionLevel + 1);
            updateStatsUI();
        }
        
        // Random effects at low sanity
        if (archiveState.sanity < 30 && Math.random() < 0.02) {
            triggerRandomDisturbance();
        }
    }, 1000);
}

// Modify Sanity
function modifySanity(amount) {
    const oldSanity = archiveState.sanity;
    archiveState.sanity = Math.max(0, Math.min(100, archiveState.sanity + amount));
    
    // Update accessed documents if sanity decreased significantly
    if (amount < -5) {
        archiveState.documentsAccessed++;
    }
    
    updateSanityUI();
    updateStatsUI();
    
    // Trigger effects on significant sanity loss
    if (oldSanity >= 20 && archiveState.sanity < 20) {
        triggerCriticalSanityEvent();
    }
    
    // Visual feedback
    if (amount < 0) {
        flashElement(sanityValue, '#8b0000');
    } else if (amount > 0) {
        flashElement(sanityValue, '#20b2aa');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    archiveSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Search input suggestions
    archiveSearch.addEventListener('focus', showSearchSuggestions);
    archiveSearch.addEventListener('input', debounce(updateSearchSuggestions, 300));
    
    // Text corruption
    corruptTextBtn.addEventListener('click', corruptDocumentText);
    
    // Translation attempt (will fail spectacularly)
    translateBtn.addEventListener('click', attemptTranslation);
    
    // Sanity stabilization
    saveSanityBtn.addEventListener('click', stabilizeSanity);
    
    // Theme toggle
    toggleThemeBtn.addEventListener('click', toggleTheme);
    
    // Emergency purge
    emergencyPurgeBtn.addEventListener('click', emergencyPurge);
    
    // Reveal truth (disturbing effect)
    revealTruthBtn.addEventListener('click', revealTruth);
    
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            navigateToSection(section);
            modifySanity(-3);
        });
        
        // Hover corruption effect
        item.addEventListener('mouseenter', () => {
            if (archiveState.sanity < 50) {
                corruptElementText(item.querySelector('.nav-item-title'));
            }
        });
    });
    
    // Text fragments hover corruption
    document.querySelectorAll('.text-fragment').forEach(fragment => {
        fragment.addEventListener('mouseenter', () => {
            if (!archiveState.isCorrupting && Math.random() < 0.3) {
                corruptElementText(fragment);
            }
        });
    });
    
    // Global click effects
    document.addEventListener('click', (e) => {
        if (Math.random() < 0.05 && archiveState.sanity < 60) {
            createRippleEffect(e.clientX, e.clientY);
        }
    });
}

// Mouse Tracking for Visual Distortion
function setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        archiveState.mousePosition.x = e.clientX;
        archiveState.mousePosition.y = e.clientY;
        
        // Update distortion effect position
        const distortion = document.querySelector('.visual-distortion');
        if (distortion) {
            distortion.style.setProperty('--mouse-x', `${e.clientX}px`);
            distortion.style.setProperty('--mouse-y', `${e.clientY}px`);
        }
        
        // Tentacle movement on low sanity
        if (archiveState.sanity < 40) {
            moveTentaclesTowardsCursor(e.clientX, e.clientY);
        }
    });
}

// Text Corruption System
function setupTextCorruption() {
    // Prepare corruption dictionaries
    window.corruptionDict = {
        'a': ['ä', 'å', 'α', '∀', '@'],
        'e': ['ë', 'ε', '∃', '€', '3'],
        'i': ['ï', 'î', 'ι', '∫', '1'],
        'o': ['ö', 'ø', 'θ', '∅', '0'],
        'u': ['ü', 'µ', '∪', '∩', 'ʊ'],
        's': ['ß', '§', '∫', '$', '5'],
        't': ['†', 'τ', '⊥', '┴', '7'],
        'n': ['ñ', 'η', '∩', '∩', '∩'],
        'r': ['®', 'ρ', '√', 'ʁ', 'Я'],
        'c': ['©', 'ç', 'Ↄ', '⊂', '('],
        ' ': [' ', ' ', ' ', ' ', '⠀']
    };
}

// Corrupt Document Text
function corruptDocumentText() {
    if (archiveState.isCorrupting) return;
    
    archiveState.isCorrupting = true;
    modifySanity(-8);
    archiveState.corruptionLevel = Math.min(100, archiveState.corruptionLevel + 5);
    updateStatsUI();
    
    const fragments = document.querySelectorAll('.text-fragment');
    fragments.forEach((fragment, index) => {
        setTimeout(() => {
            corruptElementText(fragment, 0.5);
            
            // Visual effect
            fragment.style.animation = 'none';
            fragment.offsetHeight; // Trigger reflow
            fragment.style.animation = 'text-glitch 0.5s';
            
            // Sound effect (simulated)
            if (index === fragments.length - 1) {
                simulateEldritchSound();
            }
        }, index * 300);
    });
    
    setTimeout(() => {
        archiveState.isCorrupting = false;
    }, fragments.length * 300);
}

// Corrupt Element Text
function corruptElementText(element, intensity = 0.3) {
    const originalText = element.textContent;
    let corruptedText = '';
    
    for (let char of originalText) {
        const lowerChar = char.toLowerCase();
        if (window.corruptionDict[lowerChar] && Math.random() < intensity) {
            const replacements = window.corruptionDict[lowerChar];
            corruptedText += replacements[Math.floor(Math.random() * replacements.length)];
        } else {
            corruptedText += char;
        }
    }
    
    // Sometimes rearrange words
    if (Math.random() < intensity * 0.5) {
        const words = corruptedText.split(' ');
        if (words.length > 3) {
            // Shuffle some words
            for (let i = 0; i < Math.floor(words.length * 0.3); i++) {
                const a = Math.floor(Math.random() * words.length);
                const b = Math.floor(Math.random() * words.length);
                [words[a], words[b]] = [words[b], words[a]];
            }
            corruptedText = words.join(' ');
        }
    }
    
    element.textContent = corruptedText;
    
    // Restore after delay if sanity is high enough
    if (archiveState.sanity > 50) {
        setTimeout(() => {
            element.textContent = originalText;
        }, 2000);
    }
}

// Perform Search
function performSearch() {
    const query = archiveSearch.value.trim().toLowerCase();
    if (!query) return;
    
    modifySanity(-5);
    archiveState.searchHistory.push(query);
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    // Show loading effect
    searchResults.innerHTML = '<div class="search-loading">Scrying for results... <span class="loading-dots"></span></div>';
    
    // Simulate search delay
    setTimeout(() => {
        displaySearchResults(query);
    }, 1500 + Math.random() * 1000);
}

// Display Search Results
function displaySearchResults(query) {
    searchResults.innerHTML = '';
    
    // Find matching entries
    const matches = archiveEntries.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.includes(query))
    );
    
    // If no matches, show disturbing "no results" message
    if (matches.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'search-result-item no-results';
        noResults.innerHTML = `
            <div class="result-title">No direct matches found</div>
            <div class="result-content">The archive suggests you may be asking the wrong questions. Try: "${searchSuggestions[Math.floor(Math.random() * searchSuggestions.length)]}"</div>
            <div class="result-warning">Search cost: 7% sanity</div>
        `;
        searchResults.appendChild(noResults);
        modifySanity(-7);
        return;
    }
    
    // Display matches (limited to 3 for sanity reasons)
    const displayMatches = matches.slice(0, 3);
    
    displayMatches.forEach((entry, index) => {
        setTimeout(() => {
            const resultItem = document.createElement('div');
            resultItem.className = `search-result-item corruption-${entry.corruption}`;
            
            // Corrupt title if corruption level is high
            let displayTitle = entry.title;
            if (entry.corruption === 'high' || entry.corruption === 'extreme' || entry.corruption === 'maximum') {
                displayTitle = corruptString(entry.title, 0.4);
            }
            
            resultItem.innerHTML = `
                <div class="result-header">
                    <span class="result-id">${entry.id}</span>
                    <span class="result-sanity-cost">-${entry.sanityCost}% sanity</span>
                </div>
                <div class="result-title">${displayTitle}</div>
                <div class="result-content">${corruptString(entry.content, entry.corruption === 'maximum' ? 0.8 : 0.2)}</div>
                <div class="result-tags">${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                <div class="result-warning">${getCorruptionWarning(entry.corruption)}</div>
            `;
            
            resultItem.addEventListener('click', () => {
                viewArchiveEntry(entry);
            });
            
            searchResults.appendChild(resultItem);
            
            // Animate entry
            resultItem.style.opacity = '0';
            resultItem.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                resultItem.style.transition = 'opacity 0.5s, transform 0.5s';
                resultItem.style.opacity = '1';
                resultItem.style.transform = 'translateY(0)';
            }, 10);
            
        }, index * 300);
    });
    
    // Additional sanity cost based on number of results
    modifySanity(-displayMatches.length * 3);
}

// Corrupt String Helper
function corruptString(str, intensity) {
    let result = '';
    for (let char of str) {
        if (Math.random() < intensity && window.corruptionDict[char.toLowerCase()]) {
            const replacements = window.corruptionDict[char.toLowerCase()];
            result += replacements[Math.floor(Math.random() * replacements.length)];
        } else {
            result += char;
        }
    }
    return result;
}

// Get Corruption Warning
function getCorruptionWarning(level) {
    const warnings = {
        'medium': 'Partial corruption detected. Handle with caution.',
        'high': 'High corruption level. Cognitive hazards likely.',
        'extreme': 'EXTREME CORRUPTION. Not safe for human minds.',
        'maximum': '█▓▒░ MAXIMUM CORRUPTION ░▒▓█ DO NOT VIEW'
    };
    return warnings[level] || 'Corruption level unknown.';
}

// View Archive Entry
function viewArchiveEntry(entry) {
    const sanityCost = entry.sanityCost;
    modifySanity(-sanityCost);
    
    // Update document viewer
    document.getElementById('currentDocument').textContent = entry.title;
    
    const textContainer = document.querySelector('.document-text');
    textContainer.innerHTML = '';
    
    // Split content into fragments
    const sentences = entry.content.split('. ').filter(s => s.length > 0);
    sentences.forEach(sentence => {
        const fragment = document.createElement('p');
        fragment.className = 'text-fragment';
        fragment.textContent = sentence + (sentence.endsWith('.') ? '' : '.');
        textContainer.appendChild(fragment);
        
        // Add hover event
        fragment.addEventListener('mouseenter', () => {
            if (Math.random() < 0.4) {
                corruptElementText(fragment, 0.3);
            }
        });
    });
    
    // Update metadata
    document.querySelector('.sanity-cost').textContent = `${sanityCost}%`;
    
    // Special effects for high corruption entries
    if (entry.corruption === 'extreme' || entry.corruption === 'maximum') {
        triggerEntryViewEffects();
    }
}

// Attempt Translation
function attemptTranslation() {
    modifySanity(-12);
    
    // Show translation attempt
    const translationMsg = document.createElement('div');
    translationMsg.className = 'translation-attempt';
    translationMsg.innerHTML = `
        <div class="translation-header">TRANSLATION ATTEMPT INITIATED</div>
        <div class="translation-progress"></div>
        <div class="translation-output">R̸e̴c̴o̴n̸s̴t̷r̸u̷c̵t̴i̵n̸g̴ ̵p̸r̶i̸m̵a̷l̷ ̴s̵y̷m̵b̴o̵l̷s̸.̸.̴.̸</div>
    `;
    
    document.querySelector('.document-content').appendChild(translationMsg);
    
    // Simulate translation process
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        translationMsg.querySelector('.translation-progress').style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Translation "fails" spectacularly
            setTimeout(() => {
                translationMsg.querySelector('.translation-output').textContent = 
                    'ERROR: Linguistic patterns non-human. Translation impossible. Concepts may be leaking into reality.';
                translationMsg.classList.add('translation-failed');
                
                // Corrupt all text
                setTimeout(() => {
                    document.querySelectorAll('.text-fragment').forEach(fragment => {
                        corruptElementText(fragment, 0.7);
                    });
                }, 1000);
                
                // Remove after delay
                setTimeout(() => {
                    translationMsg.remove();
                }, 5000);
            }, 500);
        }
    }, 200);
}

// Stabilize Sanity
function stabilizeSanity() {
    if (archiveState.sanity >= 90) {
        showNotification('Sanity already at optimal levels.', 'info');
        return;
    }
    
    modifySanity(15);
    archiveState.corruptionLevel = Math.max(0, archiveState.corruptionLevel - 10);
    updateStatsUI();
    
    // Visual feedback
    flashElement(saveSanityBtn, '#20b2aa');
    showNotification('Perception stabilized. Reality temporarily secured.', 'success');
    
    // Reset some effects
    document.querySelectorAll('.text-fragment').forEach(fragment => {
        fragment.style.animation = '';
    });
}

// Toggle Theme
function toggleTheme() {
    archiveState.currentTheme = archiveState.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', archiveState.currentTheme);
    
    // Slight sanity cost for reality adjustment
    modifySanity(-2);
    
    showNotification(`View shifted to ${archiveState.currentTheme} spectrum.`, 'warning');
}

// Emergency Purge
function emergencyPurge() {
    if (!confirm('EMERGENCY PURGE: This will corrupt all data and reset sanity. Are you certain?')) {
        return;
    }
    
    // Dramatic effects
    document.body.style.animation = 'purge-effect 2s';
    
    // Flash screen red
    flashScreen('#8b0000');
    
    // Corrupt everything
    document.querySelectorAll('*').forEach(element => {
        if (element.textContent && element.textContent.length < 100) {
            corruptElementText(element, 0.8);
        }
    });
    
    // Reset with penalties
    setTimeout(() => {
        archiveState.sanity = 30;
        archiveState.corruptionLevel = 50;
        archiveState.documentsAccessed += 5;
        
        updateSanityUI();
        updateStatsUI();
        
        showNotification('Purge complete. Archive integrity compromised. Sanity critically low.', 'danger');
        
        document.body.style.animation = '';
    }, 2000);
}

// Reveal Truth
function revealTruth() {
    modifySanity(-25);
    
    // Create truth revelation effect
    const truthOverlay = document.createElement('div');
    truthOverlay.className = 'truth-overlay';
    truthOverlay.innerHTML = `
        <div class="truth-content">
            <div class="truth-text">YOU ARE NOT ALONE</div>
            <div class="truth-text">THEY ARE WATCHING</div>
            <div class="truth-text">THE STARS ARE WRONG</div>
            <div class="truth-text">THE DOOR IS ALREADY OPEN</div>
            <div class="truth-text">YOUR SANITY IS A LIE</div>
            <div class="truth-text">IT WAS ALWAYS TOO LATE</div>
        </div>
    `;
    
    document.body.appendChild(truthOverlay);
    
    // Remove after effect
    setTimeout(() => {
        truthOverlay.remove();
        showNotification('Truth glimpsed. The cost was high.', 'danger');
    }, 3000);
}

// Random Disturbance Effects
function triggerRandomDisturbance() {
    const disturbances = [
        () => { // Glitch text
            document.querySelectorAll('.text-fragment, .nav-item-title').forEach(el => {
                if (Math.random() < 0.3) corruptElementText(el, 0.4);
            });
        },
        () => { // Screen shake
            mainContainer.style.animation = 'shake 0.5s';
            setTimeout(() => mainContainer.style.animation = '', 500);
        },
        () => { // Brief static
            sanityOverlay.style.opacity = '0.5';
            setTimeout(() => sanityOverlay.style.opacity = '', 300);
        },
        () => { // Random whisper notification
            const whispers = [
                'Can you hear it too?',
                'The angles are wrong.',
                'It knows your name.',
                'Don\'t look behind you.',
                'The stars are almost right.',
                'Your eyes deceive you.',
                'It\'s in the static.',
                'The door wasn\'t locked.'
            ];
            showNotification(whispers[Math.floor(Math.random() * whispers.length)], 'whisper');
        }
    ];
    
    disturbances[Math.floor(Math.random() * disturbances.length)]();
}

// Critical Sanity Event
function triggerCriticalSanityEvent() {
    // Major visual distortion
    document.body.style.filter = 'hue-rotate(180deg) contrast(150%)';
    
    // Invert colors temporarily
    setTimeout(() => {
        document.body.style.filter = '';
    }, 3000);
    
    // Show critical warning
    showNotification('CRITICAL SANITY LEVEL: Reality integrity failing.', 'danger');
    
    // Maximum corruption
    archiveState.corruptionLevel = 80;
    updateStatsUI();
}

// Random Corruption Effect
function randomCorruptionEffect() {
    if (Math.random() < 0.3) {
        const elements = document.querySelectorAll('.nav-item-title, .text-fragment, .meta-value');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        if (randomElement) corruptElementText(randomElement, 0.5);
    }
    
    // Schedule next random effect
    setTimeout(randomCorruptionEffect, 5000 + Math.random() * 10000);
}

// Move Tentacles Towards Cursor
function moveTentaclesTowardsCursor(x, y) {
    const tentacles = document.querySelectorAll('.tentacle-border');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    tentacles.forEach(tentacle => {
        const rect = tentacle.getBoundingClientRect();
        const tentacleX = rect.left + rect.width / 2;
        const tentacleY = rect.top + rect.height / 2;
        
        const dx = x - tentacleX;
        const dy = y - tentacleY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
            const moveX = dx * 0.01;
            const moveY = dy * 0.01;
            
            tentacle.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        }
    });
}

// Show Search Suggestions
function showSearchSuggestions() {
    const suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions';
    
    // Get random suggestions
    const randomSuggestions = [...searchSuggestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    
    suggestions.innerHTML = randomSuggestions
        .map(suggestion => `<div class="suggestion-item">${suggestion}</div>`)
        .join('');
    
    // Insert after search input
    const searchContainer = document.querySelector('.search-input-wrapper');
    searchContainer.appendChild(suggestions);
    
    // Add click events
    suggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            archiveSearch.value = item.textContent;
            suggestions.remove();
            performSearch();
        });
    });
    
    // Remove on click outside
    setTimeout(() => {
        document.addEventListener('click', function removeSuggestions(e) {
            if (!searchContainer.contains(e.target)) {
                suggestions.remove();
                document.removeEventListener('click', removeSuggestions);
            }
        });
    }, 10);
}

// Update Search Suggestions
function updateSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) suggestions.remove();
}

// Navigate to Section
function navigateToSection(section) {
    const sections = {
        'texts': 'Incomprehensible Texts',
        'star-charts': 'Dead Galaxy Cartography',
        'testimonies': 'Witness Testimonies',
        'artifacts': 'Non-Euclidean Artifacts'
    };
    
    showNotification(`Accessing ${sections[section]}...`, 'info');
    
    // Update document viewer with section-specific content
    const sectionEntries = {
        'texts': archiveEntries.filter(e => e.tags.includes('arabic') || e.tags.includes('latin')),
        'star-charts': archiveEntries.filter(e => e.tags.includes('dead-stars') || e.tags.includes('xoth')),
        'testimonies': archiveEntries.filter(e => e.tags.includes('witness') || e.tags.includes('redacted')),
        'artifacts': archiveEntries.filter(e => e.tags.includes('non-euclidean') || e.tags.includes('yith'))
    };
    
    if (sectionEntries[section] && sectionEntries[section].length > 0) {
        const randomEntry = sectionEntries[section][Math.floor(Math.random() * sectionEntries[section].length)];
        viewArchiveEntry(randomEntry);
    }
}

// Trigger Entry View Effects
function triggerEntryViewEffects() {
    // Screen flash
    flashScreen('#8a2be2');
    
    // Tentacle movement
    const tentacles = document.querySelectorAll('.tentacle-border');
    tentacles.forEach(t => {
        t.style.animation = 'tentacle-pulse 0.5s 3';
    });
    
    // Distortion effect
    mainContainer.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.02)';
    setTimeout(() => {
        mainContainer.style.transform = 'perspective(1000px) rotateX(0.5deg)';
    }, 1000);
}

// Flash Screen
function flashScreen(color) {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = color;
    flash.style.opacity = '0.5';
    flash.style.zIndex = '99999';
    flash.style.pointerEvents = 'none';
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.style.transition = 'opacity 0.5s';
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 500);
    }, 100);
}

// Flash Element
function flashElement(element, color) {
    const originalColor = element.style.color;
    element.style.color = color;
    element.style.transition = 'color 0.3s';
    
    setTimeout(() => {
        element.style.color = originalColor;
    }, 300);
}

// Create Ripple Effect
function createRippleEffect(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.borderRadius = '50%';
    ripple.style.border = `2px solid ${archiveState.sanity < 30 ? '#8b0000' : '#8a2be2'}`;
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.zIndex = '9999';
    ripple.style.pointerEvents = 'none';
    
    document.body.appendChild(ripple);
    
    // Animate ripple
    setTimeout(() => {
        ripple.style.transition = 'all 0.5s';
        ripple.style.width = '200px';
        ripple.style.height = '200px';
        ripple.style.opacity = '0';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `archive-notification notification-${type}`;
    notification.textContent = message;
    
    // Position notifications
    const notifications = document.querySelectorAll('.archive-notification');
    notification.style.top = `${70 + notifications.length * 50}px`;
    
    document.body.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Simulate Eldritch Sound
function simulateEldritchSound() {
    // Create visual sound wave effect since we can't play audio
    const soundWave = document.createElement('div');
    soundWave.className = 'sound-wave';
    soundWave.style.position = 'fixed';
    soundWave.style.top = '50%';
    soundWave.style.left = '50%';
    soundWave.style.width = '0';
    soundWave.style.height = '0';
    soundWave.style.borderRadius = '50%';
    soundWave.style.border = '1px solid rgba(138, 43, 226, 0.5)';
    soundWave.style.transform = 'translate(-50%, -50%)';
    soundWave.style.zIndex = '9998';
    soundWave.style.pointerEvents = 'none';
    
    document.body.appendChild(soundWave);
    
    // Animate wave
    setTimeout(() => {
        soundWave.style.transition = 'all 1s';
        soundWave.style.width = '500px';
        soundWave.style.height = '500px';
        soundWave.style.opacity = '0';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        soundWave.remove();
    }, 1100);
}

// Preload Disturbing Effects
function preloadDisturbingEffects() {
    // Create hidden elements for effects
    const styles = document.createElement('style');
    styles.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes purge-effect {
            0% { background-color: #0a0a0f; }
            50% { background-color: #8b0000; }
            100% { background-color: #0a0a0f; }
        }
        
        .archive-notification {
            position: fixed;
            right: 20px;
            padding: 12px 20px;
            background: rgba(26, 10, 42, 0.95);
            border-left: 4px solid #8a2be2;
            color: #e6e6e6;
            border-radius: 4px;
            z-index: 10000;
            font-family: 'Special Elite', monospace;
            font-size: 0.9rem;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        .notification-info { border-left-color: #20b2aa; }
        .notification-success { border-left-color: #0a291a; }
        .notification-warning { border-left-color: #d4af37; }
        .notification-danger { border-left-color: #8b0000; }
        .notification-whisper { 
            border-left-color: #8a2be2;
            font-style: italic;
            background: rgba(10, 10, 15, 0.95);
        }
        
        .search-result-item {
            background: rgba(10, 10, 15, 0.8);
            border: 1px solid rgba(138, 43, 226, 0.3);
            border-radius: 4px;
            padding: 1rem;
            margin-bottom: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .search-result-item:hover {
            border-color: #8a2be2;
            transform: translateX(5px);
            background: rgba(26, 10, 42, 0.9);
        }
        
        .search-result-item.no-results {
            border-color: #8b0000;
            background: rgba(139, 0, 0, 0.1);
        }
        
        .result-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-family: 'Special Elite', monospace;
            font-size: 0.8rem;
        }
        
        .result-id { color: #d4af37; }
        .result-sanity-cost { color: #8b0000; }
        
        .result-title {
            font-family: 'IM Fell Double Pica SC', serif;
            font-size: 1.1rem;
            color: #e6e6e6;
            margin-bottom: 0.5rem;
        }
        
        .result-content {
            font-size: 0.9rem;
            color: #b3b3b3;
            margin-bottom: 0.5rem;
            line-height: 1.5;
        }
        
        .result-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            margin-bottom: 0.5rem;
        }
        
        .tag {
            background: rgba(138, 43, 226, 0.2);
            padding: 0.1rem 0.4rem;
            border-radius: 2px;
            font-size: 0.7rem;
            color: #b19cd9;
            font-family: 'Special Elite', monospace;
        }
        
        .result-warning {
            font-size: 0.8rem;
            color: #8b0000;
            font-style: italic;
            border-top: 1px solid rgba(139, 0, 0, 0.3);
            padding-top: 0.5rem;
        }
        
        .search-loading {
            text-align: center;
            padding: 2rem;
            color: #b3b3b3;
            font-family: 'Special Elite', monospace;
        }
        
        .loading-dots::after {
            content: '';
            animation: dots 1.5s infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }
        
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(26, 10, 42, 0.95);
            border: 1px solid rgba(138, 43, 226, 0.5);
            border-top: none;
            border-radius: 0 0 4px 4px;
            z-index: 100;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .suggestion-item {
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .suggestion-item:hover {
            background: rgba(138, 43, 226, 0.2);
        }
        
        .translation-attempt {
            background: rgba(10, 10, 15, 0.9);
            border: 1px solid #20b2aa;
            border-radius: 4px;
            padding: 1rem;
            margin-top: 1rem;
            font-family: 'Special Elite', monospace;
        }
        
        .translation-header {
            color: #20b2aa;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .translation-progress {
            height: 4px;
            background: rgba(32, 178, 170, 0.3);
            border-radius: 2px;
            margin-bottom: 0.5rem;
            width: 0%;
            transition: width 0.2s;
        }
        
        .translation-output {
            color: #b3b3b3;
            font-size: 0.9rem;
        }
        
        .translation-failed {
            border-color: #8b0000;
        }
        
        .translation-failed .translation-header {
            color: #8b0000;
        }
        
        .truth-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: truth-reveal 3s;
        }
        
        .truth-content {
            text-align: center;
        }
        
        .truth-text {
            font-family: 'UnifrakturMaguntia', serif;
            font-size: 3rem;
            color: #8b0000;
            margin: 1rem 0;
            animation: text-reveal 0.5s forwards;
            opacity: 0;
        }
        
        .truth-text:nth-child(1) { animation-delay: 0.5s; }
        .truth-text:nth-child(2) { animation-delay: 1s; }
        .truth-text:nth-child(3) { animation-delay: 1.5s; }
        .truth-text:nth-child(4) { animation-delay: 2s; }
        .truth-text:nth-child(5) { animation-delay: 2.5s; }
        .truth-text:nth-child(6) { animation-delay: 3s; }
        
        @keyframes truth-reveal {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        @keyframes text-reveal {
            to { opacity: 1; }
        }
        
        .corruption-high .result-title,
        .corruption-extreme .result-title,
        .corruption-maximum .result-title {
            animation: glitch-effect 2s infinite;
        }
        
        .corruption-maximum {
            border-color: #8b0000;
            background: rgba(139, 0, 0, 0.1);
        }
    `;
    
    document.head.appendChild(styles);
}

// Debounce Helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initArchive);

// Export state for debugging (remove in production)
window.archiveState = archiveState;
window.corruptDocumentText = corruptDocumentText;
window.modifySanity = modifySanity;

console.log('%cEldritch scripts loaded. Reality may vary.', 'color: #8a2be2; font-style: italic;');