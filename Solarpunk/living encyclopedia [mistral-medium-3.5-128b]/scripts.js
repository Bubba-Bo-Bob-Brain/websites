// ===== DOM ELEMENTS =====
const sunlightMeter = document.querySelector('.sunlight-meter');
const meterFill = document.querySelector('.meter-fill');
const sidebar = document.querySelector('.sidebar');
const vineStem = document.querySelector('.vine-stem');
const navLeaves = document.querySelectorAll('.nav-leaf');
const themeToggle = document.getElementById('theme-toggle');
const seedBankButton = document.getElementById('seed-bank-button');
const seedBankIndex = document.getElementById('seed-bank-index');
const seedCloud = document.querySelector('.seed-cloud');
const floatingSeeds = document.querySelectorAll('.dandelion-seed');
const infobox = document.getElementById('example-infobox');
const infoboxClose = document.querySelector('.infobox-close');
const wikiCards = document.querySelectorAll('.wiki-card');
const searchInput = document.querySelector('.search-bar input');
const body = document.body;
const loadingIndicator = document.querySelector('.loading-indicator');

// ===== SUNLIGHT INTENSITY METER =====
// Adjust sunlight intensity based on scroll position (0-100%)
window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const sunlightIntensity = Math.min(100, Math.max(0, scrollPercentage * 1.5)); // Cap at 100%
    meterFill.style.width = `${sunlightIntensity}%`;

    // Update CSS variables for dynamic theming
    const warmth = (sunlightIntensity / 100) * 30; // 0-30deg hue shift
    const brightness = 1 + (sunlightIntensity / 200); // 1-1.5 brightness
    body.style.setProperty('--sunlight-intensity', `${sunlightIntensity}%`);
    body.style.setProperty('--sunlight-warmth', `${warmth}deg`);
    body.style.setProperty('--sunlight-brightness', brightness);

    // Adjust background brightness based on sunlight
    const bgLightness = 90 + (sunlightIntensity / 2);
    body.style.backgroundColor = `hsl(${warmth}, 50%, ${bgLightness}%)`;
});

// ===== VINE & LEAF SIDEBAR ANIMATIONS =====
// Grow vine stem on hover
sidebar.addEventListener('mouseenter', () => {
    vineStem.style.height = '110%';
    vineStem.style.width = '6px';
    vineStem.style.filter = 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))';
});

sidebar.addEventListener('mouseleave', () => {
    vineStem.style.height = '100%';
    vineStem.style.width = '4px';
    vineStem.style.filter = 'none';
});

// Animate leaves on hover
navLeaves.forEach((leaf, index) => {
    leaf.addEventListener('mouseenter', () => {
        leaf.style.transform = 'translateX(10px)';
        leaf.style.color = 'var(--sunlight-yellow-light)';
        leaf.querySelector('a').style.textShadow = '0 0 8px rgba(255, 215, 0, 0.7)';

        // Create a temporary glow effect
        const glow = document.createElement('div');
        glow.className = 'leaf-glow';
        glow.style.position = 'absolute';
        glow.style.left = '-10px';
        glow.style.top = '50%';
        glow.style.width = '20px';
        glow.style.height = '20px';
        glow.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, transparent 70%)';
        glow.style.borderRadius = '50%';
        glow.style.transform = 'translateY(-50%)';
        glow.style.pointerEvents = 'none';
        glow.style.animation = 'glowFade 1s ease-out forwards';
        leaf.appendChild(glow);

        setTimeout(() => glow.remove(), 1000);
    });

    leaf.addEventListener('mouseleave', () => {
        leaf.style.transform = 'translateX(0)';
        leaf.style.color = 'var(--text-light)';
        leaf.querySelector('a').style.textShadow = 'none';
    });
});

// Add glow animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes glowFade {
        0% { opacity: 1; transform: translateY(-50%) scale(1); }
        100% { opacity: 0; transform: translateY(-50%) scale(1.5); }
    }
`;
document.head.appendChild(style);

// ===== THEME TOGGLE (LIGHT/DARK MODE) =====
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀' : '🌙';
    themeToggle.style.color = isDark ? 'var(--sunlight-yellow)' : 'var(--bioluminescent)';

    // Update sunlight meter for dark mode
    if (isDark) {
        sunlightMeter.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        sunlightMeter.style.backdropFilter = 'blur(4px)';
    } else {
        sunlightMeter.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
});

// ===== SEED BANK CROSS-REFERENCE =====
// Sample seed data (topic, related topics)
const seedData = [
    { topic: 'Vertical Farms', related: ['Hydroponics', 'Urban Agriculture', 'Permaculture'] },
    { topic: 'Ecovillages', related: ['Cooperative Living', 'Sustainable Communities', 'Bioregionalism'] },
    { topic: 'Pollinator Highways', related: ['Rewilding', 'Biodiversity', 'Native Plants'] },
    { topic: 'Mycoremediation', related: ['Fungi', 'Soil Health', 'Bioremediation'] },
    { topic: 'Solar Panels', related: ['Renewable Energy', 'Off-Grid Living', 'Microgrids'] },
    { topic: 'Composting', related: ['Zero Waste', 'Circular Economy', 'Soil Fertility'] },
    { topic: 'Rainwater Harvesting', related: ['Water Conservation', 'Drought Resilience', 'Greywater Systems'] },
    { topic: 'Green Roofs', related: ['Urban Heat Island', 'Insulation', 'Biodiversity'] }
];

// Populate seed bank index
function populateSeedBank() {
    seedCloud.innerHTML = '';
    seedData.forEach(seed => {
        const seedElement = document.createElement('div');
        seedElement.className = 'seed';
        seedElement.textContent = seed.topic;
        seedElement.style.position = 'absolute';
        seedElement.style.left = `${Math.random() * 80 + 10}%`;
        seedElement.style.top = `${Math.random() * 80 + 10}%`;
        seedElement.style.fontSize = `${Math.random() * 0.5 + 0.8}rem`;
        seedElement.style.color = `rgba(46, 139, 87, ${Math.random() * 0.5 + 0.5})`;
        seedElement.style.cursor = 'pointer';
        seedElement.style.transition = 'all 0.3s ease';
        seedElement.style.textShadow = '0 0 4px rgba(46, 139, 87, 0.5)';

        seedElement.addEventListener('mouseenter', () => {
            seedElement.style.transform = 'scale(1.2)';
            seedElement.style.color = 'var(--sunlight-yellow)';
            seedElement.style.textShadow = '0 0 8px rgba(255, 215, 0, 0.7)';
        });

        seedElement.addEventListener('mouseleave', () => {
            seedElement.style.transform = 'scale(1)';
            seedElement.style.color = `rgba(46, 139, 87, ${Math.random() * 0.5 + 0.5})`;
            seedElement.style.textShadow = '0 0 4px rgba(46, 139, 87, 0.5)';
        });

        seedElement.addEventListener('click', () => {
            showInfobox(seed.topic, seed.related);
        });

        seedCloud.appendChild(seedElement);
    });
}

// Toggle seed bank visibility
seedBankButton.addEventListener('click', () => {
    seedBankIndex.scrollIntoView({ behavior: 'smooth' });
    if (seedCloud.innerHTML === '') {
        loadingIndicator.classList.add('active');
        setTimeout(() => {
            populateSeedBank();
            loadingIndicator.classList.remove('active');
        }, 1000);
    }
});

// ===== INFOBOX FUNCTIONALITY =====
function showInfobox(topic, related) {
    const randomFact = getRandomFact(topic);
    infobox.querySelector('h4').textContent = topic;
    infobox.querySelector('p').innerHTML = `${randomFact} <br><br> Related: ${related.join(', ')}`;
    infobox.style.display = 'block';
    infobox.style.opacity = '0';
    infobox.style.transform = 'translateY(20px)';

    setTimeout(() => {
        infobox.style.opacity = '1';
        infobox.style.transform = 'translateY(0)';
    }, 10);
}

function hideInfobox() {
    infobox.style.opacity = '0';
    infobox.style.transform = 'translateY(20px)';
    setTimeout(() => {
        infobox.style.display = 'none';
    }, 300);
}

infoboxClose.addEventListener('click', hideInfobox);

// Random facts for infobox
function getRandomFact(topic) {
    const facts = {
        'Vertical Farms': 'Vertical farms can produce up to 390 times more food per square meter than traditional farming.',
        'Ecovillages': 'The first modern ecovillage, Findhorn in Scotland, was founded in 1962 and is now a UN Habitat Best Practice model.',
        'Pollinator Highways': 'Pollinator highways can increase bee populations by up to 60% in urban areas.',
        'Mycoremediation': 'The fungus Pestaloziopsis microspora can break down polyurethane plastic in weeks.',
        'Solar Panels': 'The efficiency of solar panels has improved from 6% in the 1950s to over 22% today.',
        'Composting': 'Composting can reduce household waste by up to 50%.',
        'Rainwater Harvesting': 'A 1,000 square foot roof can collect 600 gallons of water from just 1 inch of rainfall.',
        'Green Roofs': 'Green roofs can reduce a building\'s energy use by up to 75% in the summer.'
    };
    return facts[topic] || `Explore the interconnected world of ${topic} in Verdehaven.`;
}

// ===== SEARCH FUNCTIONALITY =====
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    wikiCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());

        if (title.includes(searchTerm) || description.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm))) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
});

// Add fade-in animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(fadeInStyle);

// ===== PHOTOSYNTHESIS LOADING INDICATOR =====
// Trigger loading indicator on page load
window.addEventListener('load', () => {
    loadingIndicator.classList.add('active');
    setTimeout(() => {
        loadingIndicator.classList.remove('active');
    }, 1500);
});

// ===== FLOATING DANDELION SEEDS =====
// Randomize seed positions and animations
floatingSeeds.forEach(seed => {
    const delay = Math.random() * 5;
    const duration = 8 + Math.random() * 10;
    const xEnd = 100 + Math.random() * 200;
    const yEnd = -50 - Math.random() * 100;

    seed.style.animation = `float ${duration}s ease-in-out infinite, drift ${duration * 2}s linear infinite`;
    seed.style.setProperty('--delay', `${delay}s`);
    seed.style.setProperty('--x-end', `${xEnd}px`);
    seed.style.setProperty('--y-end', `${yEnd}px`);

    // Add hover effect
    seed.addEventListener('mouseenter', () => {
        seed.style.transform = 'scale(1.5) rotate(10deg)';
        seed.style.opacity = '1';
    });

    seed.addEventListener('mouseleave', () => {
        seed.style.transform = 'scale(1) rotate(0deg)';
        seed.style.opacity = '0.7';
    });
});

// ===== DYNAMIC INFOBOX (RANDOM FACTS) =====
// Show random infobox on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        const randomTopic = seedData[Math.floor(Math.random() * seedData.length)].topic;
        const randomSeed = seedData.find(seed => seed.topic === randomTopic);
        showInfobox(randomTopic, randomSeed.related);
    }, 2000);
});

// Hide infobox when clicking outside
document.addEventListener('click', (e) => {
    if (!infobox.contains(e.target) && e.target !== seedBankButton) {
        hideInfobox();
    }
});

// ===== BIOLUMINESCENT EFFECTS =====
// Add glow to wiki cards on hover
wikiCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 0 20px rgba(167, 255, 235, 0.3)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    });
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== INITIALIZE =====
// Check for dark mode preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀';
    themeToggle.style.color = 'var(--sunlight-yellow)';
    sunlightMeter.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
}