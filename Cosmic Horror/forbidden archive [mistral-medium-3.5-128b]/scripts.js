// ===== DOM Elements =====
const sanityBar = document.querySelector('.sanity-bar');
const sanityValue = document.querySelector('.sanity-value');
const cosmicVoid = document.querySelector('.cosmic-void');
const corruptedTexts = document.querySelectorAll('.corrupted-text');
const testimonies = document.querySelectorAll('.testimony');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const searchResults = document.querySelector('.search-results');
const archiveGrid = document.querySelector('.archive-grid');
const tendrilBorders = document.querySelectorAll('.tendril-border');

// ===== Sanity Meter =====
let sanity = 100;
const SANITY_DECAY_RATE = 0.1; // Sanity lost per scroll pixel
const MIN_SANITY = 0;

// Update sanity meter UI
function updateSanity() {
    sanity = Math.max(MIN_SANITY, sanity);
    sanityBar.setAttribute('data-sanity', Math.floor(sanity / 20) * 20);
    sanityValue.textContent = `${Math.floor(sanity)}%`;

    // Visual feedback: shake the meter at low sanity
    if (sanity < 20) {
        sanityBar.style.animation = 'shake 0.5s infinite';
    } else {
        sanityBar.style.animation = 'none';
    }

    // At 0 sanity, distort the entire page
    if (sanity <= 0) {
        document.body.style.filter = 'blur(2px) hue-rotate(180deg)';
        document.body.style.transform = 'scale(1.01) rotate(0.5deg)';
    } else {
        document.body.style.filter = 'none';
        document.body.style.transform = 'none';
    }
}

// Decay sanity on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    sanity -= scrollPosition * SANITY_DECAY_RATE / 100;
    updateSanity();

    // Reset to avoid continuous decay
    window.scrollY = 0;
});

// ===== Parallax Cosmic Void =====
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    cosmicVoid.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
});

// ===== Text Corruption on Hover =====
corruptedTexts.forEach(text => {
    text.addEventListener('mouseenter', () => {
        const body = text.querySelector('.text-body');
        const originalText = body.textContent;
        const chars = originalText.split('');

        // Randomly rearrange 30% of the characters
        for (let i = 0; i < chars.length; i++) {
            if (Math.random() < 0.3) {
                const randomIndex = Math.floor(Math.random() * chars.length);
                [chars[i], chars[randomIndex]] = [chars[randomIndex], chars[i]];
            }
        }

        body.textContent = chars.join('');
        body.style.color = '#8b0000'; // Blood red
    });

    text.addEventListener('mouseleave', () => {
        const body = text.querySelector('.text-body');
        const originalText = body.getAttribute('data-original') || body.textContent;
        body.textContent = originalText;
        body.style.color = '';
    });

    // Store original text
    const body = text.querySelector('.text-body');
    body.setAttribute('data-original', body.textContent);
});

// ===== Witness Testimony Distortion =====
testimonies.forEach(testimony => {
    testimony.addEventListener('mouseenter', () => {
        const text = testimony.querySelector('.testimony-text');
        text.style.animation = 'flicker 0.1s infinite alternate';
    });

    testimony.addEventListener('mouseleave', () => {
        const text = testimony.querySelector('.testimony-text');
        text.style.animation = 'none';
    });
});

// Add flicker animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes flicker {
        0% { opacity: 0.8; transform: translateX(-1px); }
        100% { opacity: 1; transform: translateX(1px); }
    }
    @keyframes shake {
        0% { transform: translateX(-2px); }
        50% { transform: translateX(2px); }
        100% { transform: translateX(-2px); }
    }
`;
document.head.appendChild(style);

// ===== Non-Euclidean Grid Shifts =====
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll('.archive-section');

    sections.forEach((section, index) => {
        // Alternate between rotating left and right
        const rotation = (index % 2 === 0 ? 1 : -1) * (scrollPosition * 0.01);
        section.style.transform = `rotate(${rotation}deg)`;
    });
});

// ===== Tentacle Tendril Growth =====
let tendrilGrowth = 0;
const TENDRIL_GROWTH_RATE = 0.05; // % per second

function growTendrils() {
    tendrilGrowth += TENDRIL_GROWTH_RATE;
    tendrilBorders.forEach(border => {
        const svg = border.querySelector('svg');
        const paths = svg.querySelectorAll('.tendril');

        paths.forEach((path, i) => {
            // Gradually increase the stroke-dashoffset to "draw" the tendril
            const originalLength = 1000;
            const newOffset = Math.max(0, originalLength - (originalLength * (tendrilGrowth / 100)));
            path.style.strokeDashoffset = newOffset;

            // Also scale the tendril slightly
            path.style.transform = `scale(${1 + tendrilGrowth / 200})`;
        });
    });

    if (tendrilGrowth < 100) {
        requestAnimationFrame(growTendrils);
    }
}

// Start tendril growth after 3 seconds
setTimeout(() => {
    growTendrils();
}, 3000);

// ===== Search the Void =====
const unsettlingResults = [
    { title: "The Yellow Sign", snippet: "Do not look upon it. It is watching you." },
    { title: "The Last Prayer", snippet: "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn." },
    { title: "The Black Pharaoh", snippet: "His tomb is not of this world. Neither is he." },
    { title: "The Whisperer in Darkness", snippet: "It speaks in voices that are not voices." },
    { title: "The Dunwich Horror", snippet: "The stars were right. They are right again." },
    { title: "The Shadow Over Innsmouth", snippet: "They walk among us. They have always walked among us." },
    { title: "The Call of Cthulhu", snippet: "In his house at R'lyeh, dead Cthulhu waits dreaming." },
    { title: "The Haunter of the Dark", snippet: "It is not dead. It is not even sleeping." },
    { title: "The Colour Out of Space", snippet: "It came from the stars. It will return to the stars." },
    { title: "The Music of Erich Zann", snippet: "He played to keep them at bay. But they are listening." }
];

let searchCount = 0;

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // Clear previous results
    searchResults.innerHTML = '';

    // Degrade sanity slightly on search
    sanity -= 5;
    updateSanity();

    // Return increasingly disturbing results
    searchCount++;
    const resultsToShow = Math.min(3 + searchCount, unsettlingResults.length);

    for (let i = 0; i < resultsToShow; i++) {
        const result = unsettlingResults[i];
        const resultElement = document.createElement('div');
        resultElement.className = 'search-result-item';
        resultElement.innerHTML = `
            <h3 class="result-title">${result.title}</h3>
            <p class="result-snippet">${result.snippet}</p>
        `;
        searchResults.appendChild(resultElement);

        // Add hover effect for results
        resultElement.addEventListener('mouseenter', () => {
            resultElement.style.color = '#8b0000';
            resultElement.style.transform = 'translateX(5px)';
        });
        resultElement.addEventListener('mouseleave', () => {
            resultElement.style.color = '';
            resultElement.style.transform = '';
        });
    }

    // Add styles for search results
    const resultStyles = document.createElement('style');
    resultStyles.textContent = `
        .search-result-item {
            padding: 1rem;
            border-bottom: 1px solid rgba(74, 0, 102, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .search-result-item:last-child {
            border-bottom: none;
        }
        .result-title {
            font-family: 'Cinzel', serif;
            color: #8a2be2;
            margin-bottom: 0.5rem;
        }
        .result-snippet {
            font-size: 0.9rem;
            color: rgba(240, 238, 210, 0.8);
        }
    `;
    document.head.appendChild(resultStyles);

    // Clear input after search
    searchInput.value = '';
});

// Allow pressing Enter to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// ===== Random Disturbing Events =====
// Occasionally, a testimony will glitch without interaction
setInterval(() => {
    const randomTestimony = testimonies[Math.floor(Math.random() * testimonies.length)];
    const text = randomTestimony.querySelector('.testimony-text');
    text.style.animation = 'flicker 0.1s infinite alternate';

    setTimeout(() => {
        text.style.animation = 'none';
    }, 2000);
}, 10000);

// Occasionally, the sanity meter will drop randomly
setInterval(() => {
    if (Math.random() < 0.3) { // 30% chance
        sanity -= 2;
        updateSanity();
    }
}, 15000);

// ===== Initialize =====
updateSanity();