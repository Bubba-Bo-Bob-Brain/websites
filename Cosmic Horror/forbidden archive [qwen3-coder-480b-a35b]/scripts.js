// scripts.js

// DOM Elements
const sanityFill = document.getElementById('sanityFill');
const sanityValue = document.getElementById('sanityValue');
const starsBackground = document.getElementById('starsBackground');
const searchInput = document.getElementById('archiveSearch');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

// Sanity tracking
let sanityLevel = 100;
let scrollTimeout;

// Initialize the archive
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    setupEventListeners();
    initializeTextCorruption();
});

// Create starfield background
function createStars() {
    // Clear existing stars
    starsBackground.innerHTML = '';
    
    // Create stars
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // Random size
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random twinkle duration
        const duration = 2 + Math.random() * 8;
        star.style.setProperty('--duration', `${duration}s`);
        
        starsBackground.appendChild(star);
    }
    
    // Create some constellation lines
    for (let i = 0; i < 20; i++) {
        const line = document.createElement('div');
        line.classList.add('constellation-line');
        
        // Random start position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        line.style.left = `${startX}%`;
        line.style.top = `${startY}%`;
        
        // Random length and angle
        const length = 20 + Math.random() * 80;
        const angle = Math.random() * 360;
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        // Random opacity
        line.style.opacity = 0.1 + Math.random() * 0.2;
        
        starsBackground.appendChild(line);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Scroll-based sanity degradation
    window.addEventListener('scroll', handleScroll);
    
    // Search functionality
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Periodic sanity restoration
    setInterval(restoreSanity, 3000);
}

// Handle scroll events for sanity degradation
function handleScroll() {
    // Clear any existing timeout
    clearTimeout(scrollTimeout);
    
    // Decrease sanity based on scroll amount
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const sanityDecrease = Math.min(scrollPercent * 0.2, 5);
    
    decreaseSanity(sanityDecrease);
    
    // Set timeout to restore sanity after scrolling stops
    scrollTimeout = setTimeout(() => {
        // Gradually restore sanity when not scrolling
    }, 500);
}

// Decrease sanity level
function decreaseSanity(amount) {
    sanityLevel = Math.max(0, sanityLevel - amount);
    updateSanityDisplay();
    
    // Apply visual effects based on sanity level
    applySanityEffects();
}

// Restore sanity gradually
function restoreSanity() {
    if (sanityLevel < 100) {
        sanityLevel = Math.min(100, sanityLevel + 0.5);
        updateSanityDisplay();
        applySanityEffects();
    }
}

// Update sanity display
function updateSanityDisplay() {
    sanityFill.style.width = `${sanityLevel}%`;
    sanityValue.textContent = `${Math.round(sanityLevel)}%`;
    
    // Change color based on sanity level
    if (sanityLevel > 70) {
        sanityFill.style.background = 'linear-gradient(90deg, #006400, #32CD32)';
    } else if (sanityLevel > 40) {
        sanityFill.style.background = 'linear-gradient(90deg, #FFD700, #FFA500)';
    } else if (sanityLevel > 20) {
        sanityFill.style.background = 'linear-gradient(90deg, #FF8C00, #FF4500)';
    } else {
        sanityFill.style.background = 'linear-gradient(90deg, #8B0000, #FF1493)';
    }
}

// Apply visual effects based on sanity level
function applySanityEffects() {
    // Body effect
    document.body.style.filter = `hue-rotate(${(100 - sanityLevel) * 1.8}deg)`;
    
    // Text corruption increases with low sanity
    const corruptionLevel = Math.max(0, (100 - sanityLevel) / 2);
    document.documentElement.style.setProperty('--corruption-level', `${corruptionLevel}px`);
    
    // Add screen shake at very low sanity
    if (sanityLevel < 10) {
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 500);
    }
}

// Initialize text corruption effects
function initializeTextCorruption() {
    const corruptElements = document.querySelectorAll('.corrupt-hover');
    
    corruptElements.forEach(el => {
        // Store original text
        el.dataset.original = el.textContent;
        
        // Add hover effects
        el.addEventListener('mouseenter', function() {
            corruptText(this);
        });
        
        el.addEventListener('mouseleave', function() {
            this.textContent = this.dataset.original;
        });
    });
}

// Corrupt text on hover
function corruptText(element) {
    const originalText = element.dataset.original;
    let corruptedText = '';
    
    for (let i = 0; i < originalText.length; i++) {
        // Randomly replace characters
        if (Math.random() > 0.7) {
            const glyphs = '¶ŧ←↓→øþæðđŋħĸłº×«»¢£¤¥©®§¶•†‡‰‹›※‼‽⁀⁁⁂⁃⁄⁅⁆⁇⁈⁉⁊⁋⁌⁍⁎⁏⁐⁑⁒⁓⁔⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞';
            corruptedText += glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        } else {
            corruptedText += originalText[i];
        }
    }
    
    element.textContent = corruptedText;
    
    // Continue corrupting while hovered
    if (element.matches(':hover')) {
        setTimeout(() => corruptText(element), 100);
    }
}

// Perform search with disturbing results
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        searchResults.innerHTML = '<p class="placeholder-text">Enter your query to unveil hidden knowledge...</p>';
        return;
    }
    
    // Decrease sanity with each search
    decreaseSanity(5);
    
    // Show loading state
    searchResults.innerHTML = '<p class="placeholder-text">Consulting the void...</p>';
    
    // Simulate processing delay
    setTimeout(() => {
        let resultHTML = '';
        
        // Different results based on query
        if (query.includes('necronomicon') || query.includes('book')) {
            resultHTML = `
                <div class="search-result">
                    <h3 class="result-title">The Necronomicon (Al Azif)</h3>
                    <p class="result-preview">"That is not dead which can eternal lie, And with strange aeons even death may die..." You feel a presence watching you as you read these words.</p>
                    <p class="result-warning">⚠️ WARNING: Reading this text may cause irreversible psychological damage.</p>
                </div>
            `;
        } else if (query.includes('star') || query.includes('map')) {
            resultHTML = `
                <div class="search-result">
                    <h3 class="result-title">Chart of the Black Spiral</h3>
                    <p class="result-preview">A star map depicting constellations that predate the universe. The longer you stare, the more the pattern shifts.</p>
                    <p class="result-warning">👁️ Observer reports experiencing temporal displacement.</p>
                </div>
            `;
        } else if (query.includes('testimony') || query.includes('witness')) {
            resultHTML = `
                <div class="search-result">
                    <h3 class="result-title">Subject 7's Final Recording</h3>
                    <p class="result-preview">"They came from the angles that don't exist. The geometry broke, and I saw what lives in the cracks..." [REDACTED]</p>
                    <p class="result-warning">🔊 Audio file contains cognitohazardous content.</p>
                </div>
            `;
        } else if (query.includes('forbidden') || query.includes('knowledge')) {
            resultHTML = `
                <div class="search-result">
                    <h3 class="result-title">The Knowledge That Should Not Be</h3>
                    <p class="result-preview">Accessing this information requires sacrificing a piece of your humanity. Are you certain?</p>
                    <p class="result-warning">💀 3 researchers have been lost accessing this content.</p>
                </div>
            `;
        } else {
            // Generic disturbing results
            const disturbingResults = [
                {
                    title: "Whispers from Beyond",
                    preview: "Fragments of communication from entities that exist perpendicular to reality.",
                    warning: "👂 Auditory hallucinations reported after exposure."
                },
                {
                    title: "The Geometry of Fear",
                    preview: "Mathematical proofs that demonstrate the impossibility of our existence.",
                    warning: "🌀 Subject experienced spatial disorientation for 72 hours."
                },
                {
                    title: "Chronicle of the Void",
                    preview: "Records of events that never occurred in timelines that never existed.",
                    warning: "⏰ Temporal paradox risk detected."
                },
                {
                    title: "Manuscript of Unbirth",
                    preview: "Instructions for reversing the process of consciousness.",
                    warning: "🧠 Neural pathway degradation observed in subjects."
                }
            ];
            
            const randomResult = disturbingResults[Math.floor(Math.random() * disturbingResults.length)];
            
            resultHTML = `
                <div class="search-result">
                    <h3 class="result-title">${randomResult.title}</h3>
                    <p class="result-preview">${randomResult.preview}</p>
                    <p class="result-warning">${randomResult.warning}</p>
                </div>
            `;
        }
        
        searchResults.innerHTML = resultHTML;
        
        // Apply glitch effect to new content
        applyGlitchEffect(searchResults);
    }, 1000 + Math.random() * 1000);
}

// Apply glitch effect to elements
function applyGlitchEffect(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'glitch 0.3s linear';
    }, 10);
}

// Add screen shake effect
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0% { transform: translate(0, 0); }
        10% { transform: translate(-5px, -5px); }
        20% { transform: translate(5px, 5px); }
        30% { transform: translate(-5px, 5px); }
        40% { transform: translate(5px, -5px); }
        50% { transform: translate(-5px, -5px); }
        60% { transform: translate(5px, 5px); }
        70% { transform: translate(-5px, 5px); }
        80% { transform: translate(5px, -5px); }
        90% { transform: translate(-5px, -5px); }
        100% { transform: translate(0, 0); }
    }
    
    .shake {
        animation: shake 0.5s linear;
    }
    
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-3px, 3px); }
        40% { transform: translate(-3px, -3px); }
        60% { transform: translate(3px, 3px); }
        80% { transform: translate(3px, -3px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(style);

// Periodically apply random glitches to the interface
setInterval(() => {
    if (Math.random() > 0.7) {
        const elements = document.querySelectorAll('.archive-title, .section-title, .catalog-item');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        if (randomElement) {
            randomElement.style.animation = 'glitch 0.2s linear';
            setTimeout(() => {
                randomElement.style.animation = '';
            }, 200);
        }
    }
}, 5000);