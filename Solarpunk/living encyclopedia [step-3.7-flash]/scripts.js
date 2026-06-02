// Verdant Wiki - Solarpunk Collaborative Encyclopedia
// Interactive functionality and immersive features

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // PRELOADER - Photosynthesis Animation
    // ============================================
    const preloader = document.querySelector('.preloader');
    const seedlingPaths = document.querySelectorAll('.preloader-seedling path');
    
    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Hide preloader with fade out
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Trigger initial animations
                    initScrollAnimations();
                }, 800);
            }, 500);
        }
    }, 200);

    // ============================================
    // SUNLIGHT INTENSITY METER
    // ============================================
    const sunlightSlider = document.querySelector('.sunlight-slider');
    const intensityLabel = document.querySelector('.intensity-label');
    const root = document.documentElement;
    
    const sunlightLevels = [
        { max: 20, label: 'Deep Shade', icon: '☾' },
        { max: 40, label: 'Partial Shade', icon: '⛅' },
        { max: 60, label: 'Dappled Light', icon: '🌤' },
        { max: 80, label: 'Full Sun', icon: '☀' },
        { max: 100, label: 'Intense Sun', icon: '🌞' }
    ];
    
    function updateSunlightIntensity(value) {
        const intensity = value / 100;
        root.style.setProperty('--sun-intensity', intensity);
        
        // Update label based on intensity
        const level = sunlightLevels.find(l => value <= l.max) || sunlightLevels[sunlightLevels.length - 1];
        intensityLabel.textContent = level.label;
        
        // Adjust ambient effects based on intensity
        updateAmbientEffects(intensity);
    }
    
    function updateAmbientEffects(intensity) {
        // Adjust background glow intensity
        const body = document.body;
        const glowOpacity = 0.05 + (intensity * 0.1);
        body.style.setProperty('--ambient-glow', `rgba(251, 191, 36, ${glowOpacity})`);
        
        // Adjust particle visibility (if we add particles later)
        if (window.particleSystem) {
            window.particleSystem.setIntensity(intensity);
        }
    }
    
    sunlightSlider.addEventListener('input', (e) => {
        updateSunlightIntensity(e.target.value);
    });
    
    // Initialize with default value
    updateSunlightIntensity(sunlightSlider.value);
    
    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const articleCards = document.querySelectorAll('.article-card');
    const seedCards = document.querySelectorAll('.seed-card');
    
    function performSearch(query) {
        const normalizedQuery = query.toLowerCase().trim();
        
        if (!normalizedQuery) {
            // Reset all cards
            articleCards.forEach(card => {
                card.style.display = '';
                card.style.opacity = '1';
                card.style.transform = '';
            });
            seedCards.forEach(card => {
                card.style.display = '';
                card.style.opacity = '1';
                card.style.transform = '';
            });
            return;
        }
        
        // Filter article cards
        articleCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(normalizedQuery) || 
                           excerpt.includes(normalizedQuery) || 
                           tags.some(tag => tag.includes(normalizedQuery));
            
            if (matches) {
                card.style.display = '';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Filter seed cards
        seedCards.forEach(card => {
            const name = card.querySelector('.seed-name').textContent.toLowerCase();
            const origin = card.querySelector('.seed-origin').textContent.toLowerCase();
            const conditions = card.querySelector('.seed-conditions').textContent.toLowerCase();
            
            const matches = name.includes(normalizedQuery) || 
                           origin.includes(normalizedQuery) || 
                           conditions.includes(normalizedQuery);
            
            if (matches) {
                card.style.display = '';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
            }
        });
        
        // If no results found, show message
        const visibleCards = document.querySelectorAll('.article-card[style=""], .seed-card[style=""]');
        if (visibleCards.length === 0 && normalizedQuery) {
            showNoResultsMessage();
        }
    }
    
    function showNoResultsMessage() {
        // Remove existing message if any
        const existingMsg = document.querySelector('.no-results');
        if (existingMsg) existingMsg.remove();
        
        const message = document.createElement('div');
        message.className = 'no-results';
        message.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fa-solid fa-seedling" style="font-size: 2rem; color: var(--color-leaf); margin-bottom: 1rem; display: block;"></i>
                <p style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 0.5rem;">No entries found</p>
                <p style="font-style: italic;">Try searching for "mycelium", "permaculture", or "seed bank"</p>
            </div>
        `;
        
        const recentEntries = document.querySelector('.recent-entries');
        recentEntries.appendChild(message);
    }
    
    searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    searchButton.addEventListener('click', () => performSearch(searchInput.value));
    
    // Keyboard shortcut for search (Ctrl/Cmd + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });
    
    // ============================================
    // MOBILE SIDEBAR TOGGLE
    // ============================================
    const sidebar = document.querySelector('.site-sidebar');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.style.cssText = `
        display: none;
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 1001;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
        box-shadow: 0 4px 15px var(--shadow-color);
    `;
    
    document.body.appendChild(menuToggle);
    
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        const isOpen = sidebar.classList.contains('open');
        menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-times"></i>' : '<i class="fa-solid fa-bars"></i>';
    }
    
    menuToggle.addEventListener('click', toggleSidebar);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            toggleSidebar();
        }
    });
    
    // Show/hide mobile toggle based on screen size
    function handleResize() {
        if (window.innerWidth <= 1024) {
            menuToggle.style.display = 'flex';
        } else {
            menuToggle.style.display = 'none';
            sidebar.classList.remove('open');
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
        
        // Observe cards
        document.querySelectorAll('.article-card, .seed-card, .edit-item').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-in-ready');
        });
    }
    
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .animate-in-ready {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-in-ready.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    const notificationButton = document.querySelector('.notification-button');
    const notificationBadge = document.querySelector('.notification-badge');
    
    const notifications = [
        { id: 1, text: 'New edit to "Mycelium Networks" by Maya L.', time: '2 hours ago', read: false },
        { id: 2, text: 'Your contribution to "Seed Bank" was approved.', time: '5 hours ago', read: false },
        { id: 3, text: 'Discussion reply on "Rewilding Methods"', time: '1 day ago', read: false }
    ];
    
    notificationButton.addEventListener('click', () => {
        showNotificationPanel();
    });
    
    function showNotificationPanel() {
        // Remove existing panel
        const existingPanel = document.querySelector('.notification-panel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }
        
        const panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div style="
                position: absolute;
                top: 100%;
                right: 0;
                width: 320px;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                box-shadow: 0 10px 40px var(--shadow-color);
                margin-top: var(--space-sm);
                z-index: 1000;
                overflow: hidden;
                animation: slideDown 0.3s ease;
            ">
                <div style="padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-color); background: var(--bg-tertiary);">
                    <h3 style="font-family: var(--font-display); font-size: 1rem; color: var(--color-leaf-deep);">Notifications</h3>
                </div>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${notifications.map(notif => `
                        <div style="
                            padding: var(--space-md) var(--space-lg);
                            border-bottom: 1px solid var(--border-color);
                            cursor: pointer;
                            transition: background var(--transition-fast);
                            ${!notif.read ? 'background: rgba(74, 222, 128, 0.05);' : ''}
                        " onmouseover="this.style.background='var(--bg-tertiary)'" onmouseout="this.style.background='${!notif.read ? 'rgba(74, 222, 128, 0.05)' : 'transparent'}'">
                            <p style="font-size: 0.9rem; margin-bottom: 4px; color: var(--text-primary);">${notif.text}</p>
                            <span style="font-size: 0.75rem; color: var(--text-secondary); font-style: italic;">${notif.time}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="padding: var(--space-md) var(--space-lg); text-align: center; border-top: 1px solid var(--border-color);">
                    <a href="#" style="color: var(--color-leaf-dark); text-decoration: none; font-size: 0.9rem; font-weight: 500;">View all notifications</a>
                </div>
            </div>
        `;
        
        notificationButton.style.position = 'relative';
        notificationButton.appendChild(panel);
        
        // Close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closePanel(e) {
                if (!panel.contains(e.target) && !notificationButton.contains(e.target)) {
                    panel.remove();
                    document.removeEventListener('click', closePanel);
                }
            });
        }, 100);
    }
    
    // ============================================
    // CONTRIBUTE BUTTON INTERACTION
    // ============================================
    const contributeButton = document.querySelector('.contribute-button');
    contributeButton.addEventListener('click', () => {
        // Create a ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        const rect = contributeButton.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size/2) + 'px';
        
        contributeButton.style.position = 'relative';
        contributeButton.style.overflow = 'hidden';
        contributeButton.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Simulate opening contribution modal
        showContributionModal();
    });
    
    function showContributionModal() {
        const modal = document.createElement('div');
        modal.className = 'contribution-modal';
        modal.innerHTML = `
            <div style="
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            " onclick="this.remove()">
                <div style="
                    background: var(--bg-primary);
                    border-radius: var(--radius-xl);
                    padding: var(--space-2xl);
                    max-width: 500px;
                    width: 90%;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.4s ease;
                " onclick="event.stopPropagation()">
                    <h2 style="font-family: var(--font-display); font-size: 1.8rem; color: var(--color-leaf-deep); margin-bottom: var(--space-md);">Contribute to Verdant Wiki</h2>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-xl); line-height: 1.6;">Share your knowledge about sustainable technologies, cooperative communities, or rewilded ecosystems.</p>
                    <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
                        <button onclick="this.closest('.contribution-modal').remove()" style="
                            flex: 1;
                            padding: var(--space-sm) var(--space-lg);
                            background: var(--color-leaf);
                            color: white;
                            border: none;
                            border-radius: var(--radius-md);
                            font-family: var(--font-body);
                            font-weight: 600;
                            cursor: pointer;
                            transition: all var(--transition-fast);
                        " onmouseover="this.style.background='var(--color-leaf-dark)'" onmouseout="this.style.background='var(--color-leaf)'">Create New Entry</button>
                        <button onclick="this.closest('.contribution-modal').remove()" style="
                            flex: 1;
                            padding: var(--space-sm) var(--space-lg);
                            background: transparent;
                            color: var(--color-leaf-dark);
                            border: 2px solid var(--color-leaf);
                            border-radius: var(--radius-md);
                            font-family: var(--font-body);
                            font-weight: 600;
                            cursor: pointer;
                            transition: all var(--transition-fast);
                        " onmouseover="this.style.background='var(--color-leaf)'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-leaf-dark)'">Edit Existing</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // ============================================
    // CARD HOVER EFFECTS WITH 3D TRANSFORM
    // ============================================
    document.querySelectorAll('.article-card, .seed-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // ============================================
    // SEED CARD INTERACTION
    // ============================================
    document.querySelectorAll('.seed-card').forEach(card => {
        card.addEventListener('click', function() {
            // Create a gentle pulse effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Could navigate to seed detail page
            const seedName = this.querySelector('.seed-name').textContent;
            console.log(`Opening seed entry: ${seedName}`);
        });
    });
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Escape key to close modals/panels
        if (e.key === 'Escape') {
            const modal = document.querySelector('.contribution-modal');
            const panel = document.querySelector('.notification-panel');
            if (modal) modal.remove();
            if (panel) panel.remove();
            if (sidebar.classList.contains('open')) {
                toggleSidebar();
            }
        }
        
        // Alt + S to focus search
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // ============================================
    // INTERSECTION OBSERVER FOR LAZY LOADING EFFECTS
    // ============================================
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('lazy-loaded');
                lazyLoadObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    document.querySelectorAll('.card-image, .seed-icon').forEach(el => {
        el.classList.add('lazy-load');
        lazyLoadObserver.observe(el);
    });
    
    // ============================================
    // PARALLAX EFFECT FOR BACKGROUND SHAPES
    // ============================================
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const shapes = document.querySelectorAll('.featured-article::before, .featured-article::after');
                
                // Move background shapes slightly based on scroll
                document.body.style.setProperty('--scroll-offset', `${scrolled * 0.1}px`);
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // ============================================
    // EDIT TIMESTAMP UPDATES
    // ============================================
    function updateTimestamps() {
        const timestamps = document.querySelectorAll('.edit-timestamp');
        timestamps.forEach(timestamp => {
            const text = timestamp.textContent;
            // In a real app, this would calculate actual time differences
            // For demo, we keep the static text but could add "Just now" for very recent edits
        });
    }
    
    // Update timestamps every minute
    setInterval(updateTimestamps, 60000);
    
    // ============================================
    // INITIALIZATION COMPLETE
    // ============================================
    console.log('%c🌱 Verdant Wiki Initialized %c| %cSolarpunk Collective © 2177',
        'color: #16a34a; font-size: 1.2rem; font-weight: bold;',
        '',
        'color: #92400e; font-style: italic;');
    console.log('%cFeatures: Photosynthesis Preloader | Sunlight Intensity Control | Search | 3D Cards | Notifications',
        'color: #4b5563;');
});