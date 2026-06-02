// ============================================
// SOLARIS COMPENDIUM — Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoader();
    initSunlightMeter();
    initVineNavigation();
    initAnimatedCounters();
    initSeedBank();
    initSearch();
    initSmoothScroll();
});

// ============================================
// LOADER - Photosynthesis Animation
// ============================================

function initLoader() {
    const loader = document.getElementById('loader');
    
    // Simulate loading completion
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Trigger entrance animations
        setTimeout(() => {
            animateHeroEntrance();
        }, 100);
    }, 2500);
}

function animateHeroEntrance() {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'all 0.8s ease';
    
    requestAnimationFrame(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    });
}

// ============================================
// SUNLIGHT METER - Dynamic Theme Shifting
// ============================================

function initSunlightMeter() {
    const sunlightFill = document.getElementById('sunlightFill');
    const sunlightLabel = document.getElementById('sunlightLabel');
    const body = document.body;
    
    const timeStates = [
        { time: 'Dawn', width: '25%', theme: 'dawn', color: '#ffcc80' },
        { time: 'Morning', width: '50%', theme: 'default', color: '#ffb300' },
        { time: 'Noon', width: '100%', theme: 'default', color: '#ff6f00' },
        { time: 'Afternoon', width: '75%', theme: 'default', color: '#ffb300' },
        { time: 'Dusk', width: '40%', theme: 'dusk', color: '#ff8a65' },
        { time: 'Night', width: '15%', theme: 'night', color: '#5c6bc0' }
    ];
    
    let currentStateIndex = 0;
    
    function updateSunlightState() {
        const state = timeStates[currentStateIndex];
        
        sunlightFill.style.width = state.width;
        sunlightLabel.textContent = state.time;
        
        // Apply theme
        body.removeAttribute('data-theme');
        if (state.theme !== 'default') {
            body.setAttribute('data-theme', state.theme);
        }
        
        // Update fill color
        sunlightFill.style.background = `linear-gradient(90deg, ${state.color}88 0%, ${state.color} 100%)`;
        
        // Cycle through states
        currentStateIndex = (currentStateIndex + 1) % timeStates.length;
    }
    
    // Auto-cycle every 8 seconds for demo
    setInterval(updateSunlightState, 8000);
    
    // Click to manually advance
    const meter = document.querySelector('.sunlight-meter');
    meter.style.cursor = 'pointer';
    meter.addEventListener('click', updateSunlightState);
    
    // Initial state
    updateSunlightState();
}

// ============================================
// VINE NAVIGATION
// ============================================

function initVineNavigation() {
    const navToggle = document.getElementById('navToggle');
    const vineNav = document.getElementById('vineNav');
    const navItems = document.querySelectorAll('.nav-item');
    const subNavItems = document.querySelectorAll('.sub-nav-item a');
    
    // Toggle mobile navigation
    navToggle.addEventListener('click', () => {
        vineNav.classList.toggle('expanded');
        navToggle.textContent = vineNav.classList.contains('expanded') ? '🌿' : '🌱';
    });
    
    // Handle nav item clicks
    navItems.forEach(item => {
        const link = item.querySelector(':scope > a');
        
        link.addEventListener('click', (e) => {
            // Check if item has sub-vine
            const subVine = item.querySelector('.sub-vine');
            
            if (subVine) {
                e.preventDefault();
                item.classList.toggle('expanded');
                
                // Close other expanded items
                navItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('expanded')) {
                        otherItem.classList.remove('expanded');
                    }
                });
            }
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // On mobile, close nav after selection
            if (window.innerWidth <= 1024 && !subVine) {
                vineNav.classList.remove('expanded');
                navToggle.textContent = '🌱';
            }
        });
    });
    
    // Handle sub-nav clicks
    subNavItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active parent
            navItems.forEach(nav => nav.classList.remove('active'));
            item.closest('.nav-item').classList.add('active');
        });
    });
    
    // Close nav when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            !vineNav.contains(e.target) && 
            !navToggle.contains(e.target)) {
            vineNav.classList.remove('expanded');
            navToggle.textContent = '🌱';
        }
    });
    
    // Handle scroll spy
    initScrollSpy();
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-section') === id) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// ============================================
// ANIMATED COUNTERS
// ============================================

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function for smooth animation
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(easeOutQuart * target);
                    
                    counter.textContent = current.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// SEED BANK
// ============================================

function initSeedBank() {
    const seedCats = document.querySelectorAll('.seed-cat');
    const seedCards = document.querySelectorAll('.seed-card');
    
    seedCats.forEach(cat => {
        cat.addEventListener('click', () => {
            const category = cat.getAttribute('data-cat');
            
            // Update active state
            seedCats.forEach(c => c.classList.remove('active'));
            cat.classList.add('active');
            
            // Filter cards
            seedCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.animation = 'seed-appear 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Add hover effect for seed cards
    seedCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Add keyframe animation for seed cards
const seedStyle = document.createElement('style');
seedStyle.textContent = `
    @keyframes seed-appear {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(seedStyle);

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    const wikiArticles = [
        { title: 'Photosynthetic Grid', category: 'Technology', excerpt: 'Bio-organic energy systems with 94.7% efficiency...' },
        { title: 'Harmony Collective', category: 'Community', excerpt: 'Sociocratic community in Cascadia with 12,450 residents...' },
        { title: 'Monarch Restoration', category: 'Ecosystem', excerpt: 'Continental corridor supporting 2.3M monarch butterflies...' },
        { title: 'Atmospheric Water', category: 'Technology', excerpt: 'Passive aerogel systems producing 50L/day...' },
        { title: 'Vertical Forest Cities', category: 'Architecture', excerpt: 'Biophilic urban design integrating living ecosystems...' },
        { title: 'Mycelium Computing', category: 'Technology', excerpt: 'Biological processors using fungal networks...' },
        { title: 'Ocean Cleanup Drones', category: 'Technology', excerpt: 'Autonomous marine restoration systems...' },
        { title: 'Community Land Trusts', category: 'Community', excerpt: 'Collective ownership models from Amazonia...' },
        { title: 'Pollinator Highways', category: 'Ecosystem', excerpt: 'Expanded route maps for pollinator migration...' },
        { title: 'Coastal Redwood', category: 'Flora', excerpt: 'Heritage carbon sink species restoration...' }
    ];
    
    let searchResults = null;
    
    function performSearch(query) {
        if (!query.trim()) {
            hideSearchResults();
            return;
        }
        
        const results = wikiArticles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.category.toLowerCase().includes(query.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(query.toLowerCase())
        );
        
        displaySearchResults(results, query);
    }
    
    function displaySearchResults(results, query) {
        hideSearchResults();
        
        const container = document.createElement('div');
        container.className = 'search-results';
        container.innerHTML = `
            <div class="search-results-header">
                <span>${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</span>
                <button class="close-results">&times;</button>
            </div>
            ${results.map(article => `
                <div class="search-result-item">
                    <div class="result-category">${article.category}</div>
                    <div class="result-title">${highlightMatch(article.title, query)}</div>
                    <div class="result-excerpt">${highlightMatch(article.excerpt, query)}</div>
                </div>
            `).join('')}
        `;
        
        const searchContainer = document.querySelector('.hero-search');
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(container);
        
        // Add styles
        container.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--color-bg-card);
            border-radius: 0 0 var(--radius-xl) var(--radius-xl);
            box-shadow: 0 10px 40px var(--color-shadow);
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            animation: slide-down 0.3s ease;
        `;
        
        // Close button
        container.querySelector('.close-results').addEventListener('click', hideSearchResults);
        
        // Result item clicks
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const title = item.querySelector('.result-title').textContent;
                alert(`Navigating to: ${title}\n\n(In a full implementation, this would navigate to the article page)`);
                hideSearchResults();
            });
        });
        
        searchResults = container;
    }
    
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function hideSearchResults() {
        if (searchResults) {
            searchResults.remove();
            searchResults = null;
        }
    }
    
    // Event listeners
    searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    searchInput.addEventListener('focus', (e) => {
        if (e.target.value) performSearch(e.target.value);
    });
    
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hero-search')) {
            hideSearchResults();
        }
    });
}

// Add search result styles
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    @keyframes slide-down {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .search-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-md) var(--space-lg);
        border-bottom: 1px solid var(--color-border);
        font-size: 0.9rem;
        color: var(--color-text-muted);
    }
    
    .close-results {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--color-text-muted);
        padding: 0;
        line-height: 1;
    }
    
    .close-results:hover {
        color: var(--color-text);
    }
    
    .search-result-item {
        padding: var(--space-md) var(--space-lg);
        border-bottom: 1px solid var(--color-border);
        transition: background var(--transition-fast);
    }
    
    .search-result-item:hover {
        background: var(--color-bg-warm);
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .result-category {
        font-size: 0.75rem;
        color: var(--color-secondary);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: var(--space-xs);
    }
    
    .result-title {
        font-family: var(--font-display);
        font-size: 1.1rem;
        color: var(--color-primary);
        margin-bottom: var(--space-xs);
    }
    
    .result-excerpt {
        font-size: 0.9rem;
        color: var(--color-text-light);
    }
    
    .search-result-item mark {
        background: var(--color-accent);
        color: var(--color-text);
        padding: 0 2px;
        border-radius: 2px;
    }
`;
document.head.appendChild(searchStyle);

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('.vine-nav').offsetWidth > 0 ? 0 : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// INTERACTIVE EFFECTS
// ============================================

// Parallax effect for floating leaves
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const leaves = document.querySelectorAll('.leaf');
    
    leaves.forEach((leaf, index) => {
        const speed = 0.5 + (index * 0.1);
        leaf.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Infobox hover tilt effect
document.querySelectorAll('.infobox').forEach(infobox => {
    infobox.addEventListener('mousemove', (e) => {
        const rect = infobox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        infobox.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    infobox.addEventListener('mouseleave', () => {
        infobox.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Timeline item animation on scroll
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s ease';
    timelineObserver.observe(item);
});

// Seed card stagger animation
const seedCards = document.querySelectorAll('.seed-card');

const seedObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

seedCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.4s ease';
    seedObserver.observe(card);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    const scrolled = window.pageYOffset;
    const leaves = document.querySelectorAll('.leaf');
    
    leaves.forEach((leaf, index) => {
        const speed = 0.5 + (index * 0.1);
        leaf.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // Escape to close search results or mobile nav
    if (e.key === 'Escape') {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.remove();
        }
        
        const vineNav = document.getElementById('vineNav');
        const navToggle = document.getElementById('navToggle');
        if (vineNav.classList.contains('expanded')) {
            vineNav.classList.remove('expanded');
            navToggle.textContent = '🌱';
        }
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// ============================================
// THEME PERSISTENCE (Optional enhancement)
// ============================================

function saveThemePreference(theme) {
    try {
        localStorage.setItem('solaris-theme', theme);
    } catch (e) {
        // LocalStorage not available
    }
}

function loadThemePreference() {
    try {
        return localStorage.getItem('solaris-theme');
    } catch (e) {
        return null;
    }
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c🌿 Welcome to the Solaris Compendium 🌿', 
    'font-size: 20px; font-family: serif; color: #4caf50;'
);
console.log('%cGrowing knowledge for a sustainable tomorrow...', 
    'font-style: italic; color: #7cb342;'
);
console.log('%cPress Ctrl+K to search', 
    'color: #8a9a82;'
);