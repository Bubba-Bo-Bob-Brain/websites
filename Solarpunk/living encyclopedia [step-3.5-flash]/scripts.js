// Verdant Archive - Solarpunk Wiki JavaScript
// Production-ready interactive functionality

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initLoadingScreen();
    initSidebar();
    initSunlightMeter();
    initThemeToggle();
    initSearch();
    initSeedBank();
    initUserMenu();
    initNotifications();
    initScrollAnimations();
    initNavigation();
    initActionButtons();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const appContainer = document.getElementById('app-container');
    
    // Simulate loading progress
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
        
        // Trigger entry animations
        document.body.classList.add('loaded');
    }, 2800);
}

// Sidebar Navigation
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle sidebar
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', sidebar.classList.contains('open'));
    });
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked
            link.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
            
            // Here you would typically load different content sections
            const section = link.getAttribute('data-section');
            if (section) {
                loadSection(section);
            }
        });
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// Sunlight Meter
function initSunlightMeter() {
    const slider = document.getElementById('sunlight-slider');
    const valueDisplay = document.getElementById('sun-intensity-value');
    const sunlightPreview = document.getElementById('sunlight-preview');
    
    // Get saved sunlight level or default to 60
    let sunlightLevel = localStorage.getItem('sunlightLevel') || 60;
    slider.value = sunlightLevel;
    updateSunlight(sunlightLevel);
    
    slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        sunlightLevel = value;
        valueDisplay.textContent = `${value}%`;
        updateSunlight(value);
        localStorage.setItem('sunlightLevel', value);
    });
    
    function updateSunlight(level) {
        // Map 0-100 to data-sunlight attribute values
        let sunlightAttr;
        if (level < 20) sunlightAttr = '20';
        else if (level < 40) sunlightAttr = '40';
        else if (level < 60) sunlightAttr = '60';
        else if (level < 80) sunlightAttr = '80';
        else sunlightAttr = '100';
        
        document.documentElement.setAttribute('data-sunlight', sunlightAttr);
        
        // Update preview gradient
        const hue = 45 - (level * 0.1);
        const saturation = 15 + (level * 0.05);
        sunlightPreview.style.background = `linear-gradient(90deg, 
            hsl(${hue}, ${saturation}%, 30%) 0%,
            hsl(${hue}, ${saturation}%, 50%) 25%,
            hsl(${hue - 5}, ${saturation + 5}%, 70%) 50%,
            hsl(${hue - 10}, ${saturation + 10}%, 60%) 75%,
            hsl(${hue - 15}, ${saturation + 15}%, 40%) 100%)`;
    }
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = themeToggle.querySelector('.sun-icon-svg');
    const moonIcon = themeToggle.querySelector('.moon-icon-svg');
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('global-search');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    // Mock search data
    const searchData = [
        { title: 'Perovskite Solar Cells', category: 'Technologies', url: '#' },
        { title: 'Ecovillage Barcelona', category: 'Communities', url: '#' },
        { title: 'Mongolian Steppe Rewilding', category: 'Ecosystems', url: '#' },
        { title: 'Agrivoltaics', category: 'Technologies', url: '#' },
        { title: 'Solar Textiles', category: 'Technologies', url: '#' },
        { title: 'Forest Garden Network', category: 'Communities', url: '#' },
        { title: 'Mycorrhizal Networks', category: 'Ecosystems', url: '#' },
        { title: 'Building-Integrated PV', category: 'Technologies', url: '#' },
        { title: 'Circular Manufacturing', category: 'Economics', url: '#' },
        { title: 'Heirloom Seeds', category: 'Seed Bank', url: '#' },
        { title: 'Nitrogen-Fixing Plants', category: 'Agriculture', url: '#' },
        { title: 'Permaculture Design', category: 'Technologies', url: '#' }
    ];
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            hideSuggestions();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            const matches = searchData.filter(item => 
                item.title.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
            
            showSuggestions(matches);
        }, 200);
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            // Re-trigger search on focus
            const event = new Event('input');
            searchInput.dispatchEvent(event);
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            hideSuggestions();
        }
    });
    
    function showSuggestions(matches) {
        if (matches.length === 0) {
            suggestionsContainer.innerHTML = `
                <div class="suggestion-item">
                    <div class="suggestion-category">No results</div>
                    <div>Try different keywords</div>
                </div>
            `;
        } else {
            suggestionsContainer.innerHTML = matches.map(item => `
                <div class="suggestion-item" data-url="${item.url}">
                    <div class="suggestion-category">${item.category}</div>
                    <div>${highlightMatch(item.title, searchInput.value)}</div>
                </div>
            `).join('');
            
            // Add click handlers
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const url = item.getAttribute('data-url');
                    if (url && url !== '#') {
                        window.location.href = url;
                    } else {
                        // For demo, just show notification
                        showNotification('info', 'Navigation', `Would navigate to: ${item.querySelector('div:last-child').textContent}`);
                    }
                    hideSuggestions();
                    searchInput.value = '';
                });
            });
        }
        
        suggestionsContainer.classList.add('active');
    }
    
    function hideSuggestions() {
        suggestionsContainer.classList.remove('active');
    }
    
    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }
}

// Seed Bank
function initSeedBank() {
    const seedBankToggle = document.getElementById('seed-bank-toggle');
    const seedBankDetails = document.getElementById('seed-bank-details');
    const seedBankModal = document.getElementById('seed-bank-modal');
    const modalClose = document.getElementById('seed-modal-close');
    const modalOverlay = seedBankModal.querySelector('.modal-overlay');
    const seedSearchInput = seedBankModal.querySelector('.seed-search-input');
    const seedGrid = seedBankModal.querySelector('.seed-bank-grid');
    
    // Toggle sidebar details
    seedBankToggle.addEventListener('click', () => {
        const isOpen = !seedBankDetails.classList.contains('hidden');
        if (isOpen) {
            seedBankDetails.classList.add('hidden');
            seedBankToggle.classList.remove('active');
        } else {
            seedBankDetails.classList.remove('hidden');
            seedBankToggle.classList.add('active');
        }
    });
    
    // Open modal
    seedBankToggle.addEventListener('click', (e) => {
        if (e.target.closest('#seed-bank-toggle') && 
            seedBankToggle.textContent.includes('Browse')) {
            openSeedModal();
        }
    });
    
    // Also open from the cross-reference infobox
    const crossRefLinks = document.querySelectorAll('.seed-cross-ref-mini a');
    crossRefLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openSeedModal();
        });
    });
    
    function openSeedModal() {
        seedBankModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        renderSeeds(); // Populate the grid
    }
    
    function closeSeedModal() {
        seedBankModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeSeedModal);
    modalOverlay.addEventListener('click', closeSeedModal);
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !seedBankModal.classList.contains('hidden')) {
            closeSeedModal();
        }
    });
    
    // Seed search within modal
    seedSearchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim().toLowerCase();
        renderSeeds(query);
    }, 300));
    
    // Mock seed data
    const seedData = [
        {
            name: 'Golden Amaranth',
            scientific: 'Amaranthus caudatus',
            description: 'High-protein grain amaranth with striking golden plumes. drought-tolerant and thrives in poor soils.',
            tags: ['grain', 'protein', 'drought-tolerant', 'heirloom'],
            relations: [
                { name: 'Solar Bakery Guild', type: 'community' },
                { name: 'Perennial Grains', type: 'technology' }
            ]
        },
        {
            name: 'Three Sisters Blend',
            scientific: 'Zea mays + Phaseolus vulgaris + Cucurbita pepo',
            description: 'Traditional polyculture of corn, beans, and squash. The corn provides structure, beans fix nitrogen, and squash shades soil.',
            tags: ['polyculture', 'nitrogen-fixer', 'native', 'food-security'],
            relations: [
                { name: 'Forest Garden Network', type: 'community' },
                { name: 'Agrivoltaics', type: 'technology' }
            ]
        },
        {
            name: 'Mountain Mint',
            scientific: 'Pycnanthemum muticum',
            description: 'Aromatic perennial herb that attracts pollinators and has medicinal properties. Excellent for tea and natural remedies.',
            tags: ['medicinal', 'pollinator', 'perennial', 'native'],
            relations: [
                { name: 'Medicinal Collective', type: 'community' },
                { name: 'Mycorrhizal Networks', type: 'ecosystem' }
            ]
        },
        {
            name: 'Seaberry',
            scientific: 'Hippophae rhamnoides',
            description: 'Nitrogen-fixing shrub producing vitamin-C rich berries. Tolerates saline soils and coastal conditions.',
            tags: ['nitrogen-fixer', 'fruit', 'coastal', 'medicinal'],
            relations: [
                { name: 'Coastal Restoration Projects', type: 'ecosystem' },
                { name: 'Food Forests', type: 'technology' }
            ]
        },
        {
            name: ' Jerusalem Artichoke',
            scientific: 'Helianthus tuberosus',
            description: 'Hardy perennial vegetable with edible tubers. Excellent for soil improvement and wildlife food.',
            tags: ['perennial', 'vegetable', 'soil-builder', 'wildlife'],
            relations: [
                { name: 'Urban Food Forests', type: 'community' },
                { name: 'Soil Health Index', type: 'technology' }
            ]
        },
        {
            name: 'Echinacea',
            scientific: 'Echinacea purpurea',
            description: 'Medicinal herb known for immune system support. Beautiful purple flowers attract butterflies.',
            tags: ['medicinal', 'pollinator', 'native', 'heirloom'],
            relations: [
                { name: 'Medicinal Collective', type: 'community' },
                { name: 'Herb Spiral Gardens', type: 'technology' }
            ]
        },
        {
            name: 'Sunroot',
            scientific: 'Sium sisarum',
            description: 'Historic perennial vegetable with edible roots and shoots. Rare but easy to grow in moist soils.',
            tags: ['perennial', 'vegetable', 'heirloom', 'moist-soil'],
            relations: [
                { name: 'Heritage Seed Library', type: 'community' },
                { name: 'Wetland Polycultures', type: 'ecosystem' }
            ]
        },
        {
            name: 'Comfrey',
            scientific: 'Symphytum officinale',
            description: 'Dynamic accumulator for soil nutrients. Used as compost accelerator and animal fodder (careful with internal use).',
            tags: ['soil-builder', 'compost', 'dynamic-accumulator', 'medicinal'],
            relations: [
                { name: 'Permaculture Guilds', type: 'technology' },
                { name: 'Soil Health Index', type: 'technology' }
            ]
        }
    ];
    
    function renderSeeds(filter = '') {
        const filtered = filter 
            ? seedData.filter(seed => 
                seed.name.toLowerCase().includes(filter) ||
                seed.scientific.toLowerCase().includes(filter) ||
                seed.tags.some(tag => tag.includes(filter)) ||
                seed.relations.some(rel => rel.name.toLowerCase().includes(filter))
            )
            : seedData;
        
        if (filtered.length === 0) {
            seedGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); color: var(--color-text-muted);">
                    <p>No seeds found matching "${filter}"</p>
                </div>
            `;
            return;
        }
        
        seedGrid.innerHTML = filtered.map(seed => `
            <div class="seed-card" data-seed="${seed.name}">
                <div class="seed-card-header">
                    <div class="seed-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div>
                        <div class="seed-name">${seed.name}</div>
                        <div class="seed-scientific">${seed.scientific}</div>
                    </div>
                </div>
                <p class="seed-description">${seed.description}</p>
                <div class="seed-tags-mini">
                    ${seed.tags.map(tag => `<span class="seed-tag">${tag}</span>`).join('')}
                </div>
                <div class="seed-relations">
                    <h4>Connected to:</h4>
                    <ul>
                        ${seed.relations.map(rel => `
                            <li><a href="#">${rel.name}</a> <span style="color: var(--color-text-muted); font-size: 0.75rem;">(${rel.type})</span></li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
        
        // Add click handlers to seed cards
        seedGrid.querySelectorAll('.seed-card').forEach(card => {
            card.addEventListener('click', () => {
                const seedName = card.getAttribute('data-seed');
                showNotification('success', 'Seed Selected', `Viewing details for ${seedName}`);
                // In a real app, this would navigate to seed detail page
            });
        });
    }
}

// User Menu
function initUserMenu() {
    const userButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    userButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
        userButton.setAttribute('aria-expanded', userDropdown.classList.contains('active'));
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!userButton.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
            userButton.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Handle dropdown item clicks
    userDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = item.textContent.trim();
            userDropdown.classList.remove('active');
            
            if (action === 'Log Out') {
                showNotification('info', 'Logged Out', 'You have been logged out successfully.');
            } else {
                showNotification('info', 'Navigation', `Opening ${action}...`);
            }
        });
    });
}

// Notifications
function initNotifications() {
    const container = document.getElementById('notification-container');
    
    // Expose globally for other modules
    window.showNotification = (type = 'info', title, message, duration = 5000) => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${getNotificationIcon(type)}
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto remove
        const timeout = setTimeout(() => {
            removeNotification(notification);
        }, duration);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout);
            removeNotification(notification);
        });
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
    };
    
    function removeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>`,
            warning: `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/></svg>`,
            info: `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>`
        };
        return icons[type] || icons.info;
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections and cards
    const animatedElements = document.querySelectorAll(
        '.article-section, .characteristic-card, .implementation-item, .related-entry-card, .infobox, .seed-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add visible styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Navigation Active State
function initNavigation() {
    // Update active nav based on current page/section
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage.includes(link.getAttribute('data-section')))) {
            link.classList.add('active');
        }
    });
    
    // Breadcrumb could be enhanced based on actual navigation
}

// Action Buttons
function initActionButtons() {
    const watchBtn = document.getElementById('watch-article');
    const shareBtn = document.getElementById('share-article');
    const exportBtn = document.getElementById('export-article');
    const editBtn = document.getElementById('edit-article');
    const createBtn = document.getElementById('create-new');
    const discussBtn = document.getElementById('discuss');
    
    if (watchBtn) {
        watchBtn.addEventListener('click', () => {
            const isWatching = watchBtn.classList.toggle('active');
            if (isWatching) {
                watchBtn.classList.add('primary');
                showNotification('success', 'Watching', 'You are now watching this article.');
            } else {
                watchBtn.classList.remove('primary');
                showNotification('info', 'Unwatched', 'You have stopped watching this article.');
            }
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: document.title,
                text: document.querySelector('.article-subtitle')?.textContent || 'Check out this article on the Verdant Archive',
                url: window.location.href
            };
            
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                    showNotification('success', 'Shared', 'Article shared successfully!');
                } else {
                    // Fallback: copy to clipboard
                    await navigator.clipboard.writeText(shareData.url);
                    showNotification('success', 'Copied', 'Link copied to clipboard!');
                }
            } catch (err) {
                showNotification('warning', 'Share failed', 'Could not share article.');
            }
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showNotification('info', 'Export', 'Preparing export options...');
            // In a real app, this would open export modal with format options
        });
    }
    
    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('info', 'Edit Mode', 'Redirecting to article editor...');
        });
    }
    
    if (createBtn) {
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('info', 'Create Entry', 'Opening entry creation form...');
        });
    }
    
    if (discussBtn) {
        discussBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('info', 'Discussion', 'Opening discussion forum...');
        });
    }
}

// Utility Functions
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

function loadSection(sectionId) {
    // This would typically fetch and load different content sections
    // For demo, we'll just show a notification
    showNotification('info', 'Loading Section', `Loading ${sectionId} content...`);
    
    // Simulate content loading
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0.5';
        setTimeout(() => {
            mainContent.style.opacity = '1';
            showNotification('success', 'Loaded', `${sectionId} content loaded.`);
        }, 800);
    }
}

// Initialize parallax effect for sunlight overlay
function initParallax() {
    const overlay = document.createElement('div');
    overlay.className = 'sunlight-overlay';
    document.body.appendChild(overlay);
    
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
    });
    
    function animate() {
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        const moveX = (currentX - 0.5) * 20;
        const moveY = (currentY - 0.5) * 20;
        
        overlay.style.background = `
            radial-gradient(circle at ${50 + moveX}% ${30 + moveY}%, 
                hsla(var(--sunlight-hue), var(--sunlight-saturation), 90%, 0.1) 0%, 
                transparent 50%),
            radial-gradient(circle at ${30 - moveX}% ${70 - moveY}%, 
                hsla(var(--sunlight-hue), var(--sunlight-saturation), 85%, 0.1) 0%, 
                transparent 50%),
            linear-gradient(135deg, 
                hsla(var(--sunlight-hue), var(--sunlight-saturation), var(--sunlight-brightness), 0.05) 0%, 
                transparent 50%, 
                hsla(210, 20%, 95%, 0.03) 100%)
        `;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
});

// Console Easter egg
console.log('%c🌿 Verdant Archive', 'font-size: 20px; color: #4a7c59; font-weight: bold;');
console.log('%cA Solarpunk Collaborative Encyclopedia', 'font-size: 12px; color: #8b7355;');
console.log('%c💡 Tip: Adjust the sunlight slider in the header to change the page\'s lighting!', 'font-size: 12px; color: #f4a261;');