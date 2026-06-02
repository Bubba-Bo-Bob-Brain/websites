/* ========================================
THE SOLARPUNK ACCORD - BOTANICAL ILLUMINATED
Interactive JavaScript
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Hide loading screen after animations complete
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
        
        // Show main app container
        const appContainer = document.getElementById('appContainer');
        appContainer.classList.add('loaded');
        
        // Initialize all interactive features after app is visible
        setTimeout(() => {
            initSunlightMeter();
            initSearch();
            initNavigation();
            initScrollAnimations();
            initSeedBankSearch();
            initTooltips();
        }, 500);
    }, 3500); // Match loading animation duration
}

/* ========================================
SUNLIGHT INTENSITY METER
Simulates time-of-day and shifts the page color palette accordingly
======================================== */

function initSunlightMeter() {
    const meterFill = document.getElementById('meterFill');
    const intensityValue = document.getElementById('intensityValue');
    const intensityLabel = document.getElementById('intensityLabel');
    const body = document.body;
    
    // Time periods and their characteristics
    const timePeriods = [
        { name: 'dawn', start: 5, end: 7, intensity: { min: 10, max: 40 }, label: 'Dawn Awakening' },
        { name: 'morning', start: 7, end: 11, intensity: { min: 40, max: 85 }, label: 'Morning Growth' },
        { name: 'noon', start: 11, end: 14, intensity: { min: 85, max: 100 }, label: 'Solar Noon' },
        { name: 'afternoon', start: 14, end: 18, intensity: { min: 70, max: 85 }, label: 'Afternoon Abundance' },
        { name: 'dusk', start: 18, end: 21, intensity: { min: 20, max: 50 }, label: 'Golden Hour' }
    ];
    
    // Get current hour
    function getCurrentHour() {
        const now = new Date();
        return now.getHours();
    }
    
    // Get appropriate time period
    function getTimePeriod(hour) {
        for (const period of timePeriods) {
            if (hour >= period.start && hour < period.end) {
                return period;
            }
        }
        // Default to afternoon if no match
        return timePeriods[3];
    }
    
    // Calculate intensity based on current hour and minute
    function calculateIntensity() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const period = getTimePeriod(hour);
        
        // Calculate progress through the current period
        const progress = (hour - period.start + minute / 60) / (period.end - period.start);
        const intensity = period.intensity.min + (period.intensity.max - period.intensity.min) * progress;
        
        return Math.round(intensity);
    }
    
    // Update the meter
    function updateMeter() {
        const intensity = calculateIntensity();
        const period = getTimePeriod(getCurrentHour());
        
        // Update meter fill
        meterFill.style.width = `${intensity}%`;
        intensityValue.textContent = `${intensity}%`;
        intensityLabel.textContent = period.label;
        
        // Update body data attribute for CSS variables
        body.setAttribute('data-intensity', period.name);
        
        // Update custom property for dynamic adjustments
        document.documentElement.style.setProperty('--sunlight-intensity', `${intensity}%`);
        
        // Update color palette based on intensity
        updateColorPalette(intensity);
    }
    
    // Update CSS custom properties for color shifts
    function updateColorPalette(intensity) {
        const root = document.documentElement;
        
        // Adjust ambient light based on intensity
        const ambientLight = 0.5 + (intensity / 100) * 0.5;
        root.style.setProperty('--ambient-light', ambientLight);
        
        // Adjust glow colors based on intensity
        const glowOpacity = 0.2 + (intensity / 100) * 0.4;
        root.style.setProperty('--current-glow', `rgba(244, 169, 64, ${glowOpacity})`);
    }
    
    // Initial update and interval
    updateMeter();
    
    // Update every minute
    setInterval(updateMeter, 60000);
    
    // Also update on visibility change (when user returns to tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateMeter();
        }
    });
}

/* ========================================
SEARCH FUNCTIONALITY
======================================== */

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    // Sample search data - in production this would be from an API or local database
    const searchData = [
        { title: 'Solar Hives', category: 'Technologies', url: '#' },
        { title: 'Mycelium Architecture', category: 'Technologies', url: '#' },
        { title: 'Aquifer Networks', category: 'Technologies', url: '#' },
        { title: 'Vertical Forests', category: 'Ecosystems', url: '#' },
        { title: 'Biomimetic Computing', category: 'Technologies', url: '#' },
        { title: 'Global Seed Banks', category: 'Communities', url: '#' },
        { title: 'Zaragoza Collective', category: 'Communities', url: '#' },
        { title: 'Perovskite Photovoltaics', category: 'Technologies', url: '#' },
        { title: 'Cooperative Governance', category: 'Communities', url: '#' },
        { title: 'Rewilding Protocols', category: 'Ecosystems', url: '#' },
        { title: 'Graphene Supercapacitors', category: 'Technologies', url: '#' },
        { title: 'Urban Agriculture', category: 'Communities', url: '#' },
        { title: 'Carbon Sequestration', category: 'Ecosystems', url: '#' },
        { title: 'Biofabrication Labs', category: 'Technologies', url: '#' },
        { title: 'Ecological Corridors', category: 'Ecosystems', url: '#' }
    ];
    
    // Debounce function for search input
    let debounceTimer;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }
        
        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    // Close results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
    
    // Perform search
    function performSearch(query) {
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );
        displayResults(results, query);
    }
    
    // Display search results
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `<div class="search-result-item">No results found for "${query}"</div>`;
        } else {
            searchResults.innerHTML = results.slice(0, 8).map(result => `
                <div class="search-result-item" data-url="${result.url}">
                    <span class="result-title">${highlightMatch(result.title, query)}</span>
                    <span class="result-category">${result.category}</span>
                </div>
            `).join('');
            
            // Add click handlers
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', function() {
                    const url = this.getAttribute('data-url');
                    if (url && url !== '#') {
                        window.location.href = url;
                    }
                    searchResults.classList.remove('active');
                    searchInput.value = '';
                });
            });
        }
        searchResults.classList.add('active');
    }
    
    // Highlight matching text
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }
}

/* ========================================
NAVIGATION INTERACTIONS
======================================== */

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentArea = document.getElementById('contentArea');
    
    // Main category navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const article = this.getAttribute('data-article');
            const action = this.getAttribute('data-action');
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Animate leaf indicator
            if (this.querySelector('.nav-leaf')) {
                animateLeaf(this.querySelector('.nav-leaf'));
            }
            
            // Handle different click types
            if (category) {
                // Would load category page
                console.log(`Loading category: ${category}`);
                // Simulate content change with animation
                contentArea.style.opacity = '0';
                contentArea.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    contentArea.style.opacity = '1';
                    contentArea.style.transform = 'translateY(0)';
                }, 300);
            } else if (article) {
                // Would load article
                console.log(`Loading article: ${article}`);
                loadArticle(article);
            } else if (action) {
                // Would execute action
                console.log(`Executing action: ${action}`);
                executeAction(action);
            }
        });
    });
    
    // Animate leaf on hover/click
    function animateLeaf(leaf) {
        leaf.style.transform = 'translate(-50%, -50%) rotate(360deg)';
        setTimeout(() => {
            leaf.style.transform = 'translate(-50%, -50%) rotate(20deg)';
        }, 500);
    }
}

// Simulate article loading
function loadArticle(articleId) {
    console.log(`Loading article: ${articleId}`);
    // In production, this would fetch and display article content
}

// Simulate action execution
function executeAction(actionId) {
    console.log(`Executing action: ${actionId}`);
    // In production, this would open modals, navigate to pages, etc.
}

/* ========================================
SCROLL ANIMATIONS
======================================== */

function initScrollAnimations() {
    // Create intersection observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, stop observing to prevent re-animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.article-section, .stat-card, .see-also-card, .seed-category');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
    
    // Parallax effect for decorative elements
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const vineDecoration = document.querySelector('.vine-decoration');
        if (vineDecoration) {
            vineDecoration.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
    });
    
    // Header shadow on scroll
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (scrollY > 50) {
            header.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)';
        } else {
            header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
        }
    });
}

/* ========================================
SEED BANK SEARCH
======================================== */

function initSeedBankSearch() {
    const seedSearchInput = document.querySelector('.seed-search-input');
    const seedResults = document.getElementById('seedResults');
    const seedCategories = document.querySelectorAll('.seed-category');
    
    // Sample seed bank data
    const seedData = {
        plants: [
            { name: 'Ancient Wheat (Triticum древний)', variety: 'Heirloom strain', location: 'Svalbard Global Seed Vault' },
            { name: 'Drought-Resistant Maize', variety: 'Zea mays × drought', location: 'Morocco Regional Bank' },
            { name: 'Perennial Rice (Oryza perennis)', variety: 'Hybrid strain 2156', location: 'Philippines Gene Bank' },
            { name: 'Salt-Tolerant Barley', variety: 'Hordeum marinum', location: 'Netherlands Coastal Bank' },
            { name: 'Wild Tomato (Solanum pimpinellifolium)', variety: 'Original strain', location: 'Peru Andine Repository' }
        ],
        fungi: [
            { name: 'Reishi (Ganoderma lucidum)', variety: 'Wild isolate', location: 'Japan Mountain Bank' },
            { name: 'Shiitake (Lentinula edodes)', variety: 'Organic strain 44', location: 'China Yunnan Bank' },
            { name: 'Turkey Tail (Trametes versicolor)', variety: 'Medicinal strain', location: 'Pacific Northwest Bank' }
        ],
        algae: [
            { name: 'Spirulina (Arthrospira platensis)', variety: 'High-protein cultivar', location: 'California Aqua Bank' },
            { name: 'Dunaliella salina', variety: 'Beta-carotene rich', location: 'Australia Salt Bank' }
        ],
        bacteria: [
            { name: 'Nitrogen-fixing Rhizobia', variety: 'Soil strain R7', location: 'Brazil Agro Bank' },
            { name: 'Mycorrhizal helper bacteria', variety: 'Pine symbiont', location: 'Canada Boreal Bank' }
        ]
    };
    
    // Debounce
    let debounceTimer;
    
    seedSearchInput.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            seedResults.classList.remove('active');
            seedResults.innerHTML = '';
            return;
        }
        
        debounceTimer = setTimeout(() => {
            performSeedSearch(query);
        }, 300);
    });
    
    // Search function
    function performSeedSearch(query) {
        let results = [];
        
        // Search all categories
        Object.keys(seedData).forEach(category => {
            seedData[category].forEach(seed => {
                if (seed.name.toLowerCase().includes(query) || seed.variety.toLowerCase().includes(query)) {
                    results.push({ ...seed, category });
                }
            });
        });
        
        displaySeedResults(results);
    }
    
    // Display results
    function displaySeedResults(results) {
        if (results.length === 0) {
            seedResults.innerHTML = '<div class="seed-result-item">No seeds found</div>';
        } else {
            seedResults.innerHTML = results.slice(0, 6).map(seed => `
                <div class="seed-result-item">
                    <span class="seed-name">${seed.name}</span>
                    <span class="seed-info">${seed.variety} • ${seed.location}</span>
                </div>
            `).join('');
        }
        seedResults.classList.add('active');
    }
    
    // Category click handlers
    seedCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryType = this.getAttribute('data-category');
            showCategorySeeds(categoryType);
        });
    });
    
    // Show seeds from a specific category
    function showCategorySeeds(categoryType) {
        const seeds = seedData[categoryType];
        if (seeds) {
            seedResults.innerHTML = seeds.map(seed => `
                <div class="seed-result-item">
                    <span class="seed-name">${seed.name}</span>
                    <span class="seed-info">${seed.variety} • ${seed.location}</span>
                </div>
            `).join('');
            seedResults.classList.add('active');
            seedSearchInput.value = '';
        }
    }
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!seedSearchInput.contains(e.target) && !seedResults.contains(e.target)) {
            seedResults.classList.remove('active');
        }
    });
}

/* ========================================
TOOLTIPS
======================================== */

function initTooltips() {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: var(--chlorophyll-dark);
        color: var(--parchment-base);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(tooltip);
    
    // Add tooltip triggers to certain elements
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const text = this.getAttribute('data-tooltip');
            tooltip.textContent = text;
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mousemove', function(e) {
            tooltip.style.left = `${e.clientX + 15}px`;
            tooltip.style.top = `${e.clientY + 15}px`;
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
    });
}

/* ========================================
KEYBOARD NAVIGATION
======================================== */

document.addEventListener('keydown', function(e) {
    // Escape key closes any open dropdowns
    if (e.key === 'Escape') {
        document.querySelectorAll('.search-results, .seed-results').forEach(results => {
            results.classList.remove('active');
        });
    }
    
    // Ctrl/Cmd + K opens search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

/* ========================================
PERFORMANCE OPTIMIZATIONS
======================================== */

// Lazy load images (if any)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Smooth scroll for anchor links
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

/* ========================================
ACCESSIBILITY ENHANCEMENTS
======================================== */

// Focus management for modals and dropdowns
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Add ARIA labels to interactive elements
document.querySelectorAll('.nav-item').forEach((item, index) => {
    if (!item.getAttribute('aria-label')) {
        const text = item.querySelector('.nav-text').textContent;
        item.setAttribute('aria-label', `Navigate to ${text}`);
        item.setAttribute('role', 'menuitem');
    }
});

/* ========================================
CONSOLE WELCOME MESSAGE
======================================== */

console.log(`%c 🌿 The Solarpunk Accord %c Encyclopedia of the Green Renaissance `, 'background: #2d5a47; color: #f4a940; padding: 10px 20px; font-family: serif; font-size: 16px; font-weight: bold;', 'background: #1a3d2e; color: #7ec8a3; padding: 10px; font-family: serif;');
console.log('%c☀ "In the garden of tomorrow, every seed is a promise." ☀', 'color: #f4a940; font-style: italic;');
console.log('%cVersion 1.0 | Built with ☀, ☘, and ✦', 'color: #7ec8a3;');