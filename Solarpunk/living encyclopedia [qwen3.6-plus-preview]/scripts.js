/**
 * THE VERDANT CODEX — Solarpunk Wiki Interactions
 * Handles loading, theming, search, particles, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const CONFIG = {
        particleCount: 35,
        scrollThreshold: 0.1,
        counterDuration: 2000
    };

    // State
    const state = {
        sunlightValue: 40, // Start at Morning
        isDraggingSunlight: false,
        searchQuery: ''
    };

    // --- 1. Loader & Initialization ---
    const loader = document.getElementById('loader');
    const app = document.getElementById('app');

    // Wait for CSS animations to finish, then fade out loader
    setTimeout(() => {
        loader.classList.add('hidden');
        app.classList.remove('hidden');
        
        // Initialize features after loader clears
        initParticles();
        initSunlightMeter();
        initScrollAnimations();
        initCounters();
        initSearch();
        initModals();
        initSidebar();
    }, 2500);

    // --- 2. Floating Pollen Particles ---
    function initParticles() {
        const container = document.getElementById('pollen-container');
        if (!container) return;

        // Create particles
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('pollen');
            
            // Random properties
            const size = Math.random() * 4 + 3;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 15; // 15-30s
            const delay = Math.random() * 10;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: -${delay}s;
            `;

            container.appendChild(particle);
        }
    }

    // --- 3. Sunlight Intensity Meter ---
    function initSunlightMeter() {
        const track = document.querySelector('.sunlight-track');
        const fill = document.getElementById('sunlightFill');
        const thumb = document.getElementById('sunlightThumb');
        const valueText = document.getElementById('sunlightValue');
        const body = document.body;

        if (!track) return;

        const themes = [
            { limit: 20, name: 'Dawn Light', theme: 'dawn' },
            { limit: 40, name: 'Morning Light', theme: 'morning' },
            { limit: 60, name: 'Midday Sun', theme: 'midday' },
            { limit: 80, name: 'Afternoon Sun', theme: 'afternoon' },
            { limit: 100, name: 'Dusk', theme: 'dusk' }
        ];

        function updateSunlight(percentage) {
            // Clamp value
            const val = Math.max(0, Math.min(100, percentage));
            state.sunlightValue = val;

            // Update visual slider
            fill.style.width = `${val}%`;
            thumb.style.left = `${val}%`;

            // Determine theme
            const currentTheme = themes.find(t => val <= t.limit);
            if (currentTheme) {
                body.setAttribute('data-time', currentTheme.theme);
                valueText.textContent = currentTheme.name;
            }
        }

        // Interaction Handlers
        const handleMove = (e) => {
            if (!state.isDraggingSunlight) return;
            const rect = track.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const percentage = ((clientX - rect.left) / rect.width) * 100;
            updateSunlight(percentage);
        };

        const handleStart = (e) => {
            state.isDraggingSunlight = true;
            handleMove(e); // Jump to click immediately
        };

        const handleEnd = () => {
            state.isDraggingSunlight = false;
        };

        track.addEventListener('mousedown', handleStart);
        track.addEventListener('touchstart', handleStart);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);

        // Initialize position
        updateSunlight(state.sunlightValue);
    }

    // --- 4. Scroll Animations (Intersection Observer) ---
    function initScrollAnimations() {
        const observerOptions = {
            threshold: CONFIG.scrollThreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Select elements to animate
        const animatableElements = document.querySelectorAll('.article-card, .seed-category, .contribution-card, .section-title');
        animatableElements.forEach(el => {
            el.classList.add('animate-on-scroll'); // Add base class for CSS transition if not present
            observer.observe(el);
        });
    }

    // --- 5. Counter Animation ---
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'));
                    animateValue(el, 0, target, CONFIG.counterDuration);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));

        function animateValue(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                obj.innerHTML = Math.floor(easeProgress * (end - start) + start).toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }

    // --- 6. Search Functionality ---
    function initSearch() {
        const input = document.getElementById('searchInput');
        const resultsContainer = document.getElementById('searchResults');
        const searchToggle = document.getElementById('searchToggle');
        const searchContainer = document.getElementById('searchContainer');

        // Mock Data for Search
        const wikiData = [
            { title: 'Artificial Photosynthesis Systems', category: 'Technology' },
            { title: 'The Mycelial Governance Model', category: 'Community' },
            { title: 'European Wildlife Corridors', category: 'Rewilding' },
            { title: 'Biomimetic Architecture', category: 'Technology' },
            { title: 'Aquatic Cooperative Settlements', category: 'Community' },
            { title: 'De-extinction Programs', category: 'Rewilding' },
            { title: 'Vertical Agriculture Integration', category: 'Technology' },
            { title: 'Seed Bank Preservation', category: 'Knowledge' }
        ];

        function handleSearch(e) {
            const query = e.target.value.toLowerCase().trim();
            state.searchQuery = query;

            if (!query) {
                resultsContainer.classList.remove('active');
                resultsContainer.innerHTML = '';
                return;
            }

            const matches = wikiData.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query)
            );

            renderResults(matches, query);
        }

        function renderResults(matches, query) {
            resultsContainer.innerHTML = '';
            if (matches.length === 0) {
                resultsContainer.innerHTML = '<div class="search-empty">No seeds found for this query.</div>';
            } else {
                matches.forEach(match => {
                    const div = document.createElement('div');
                    div.classList.add('search-result-item');
                    
                    // Highlight logic
                    const regex = new RegExp(`(${query})`, 'gi');
                    const highlightedTitle = match.title.replace(regex, '<mark>$1</mark>');

                    div.innerHTML = `
                        <span class="result-title">${highlightedTitle}</span>
                        <span class="result-category">${match.category}</span>
                    `;
                    
                    div.addEventListener('click', () => {
                        // Mock navigation
                        input.value = '';
                        resultsContainer.classList.remove('active');
                        alert(`Navigating to: ${match.title}`);
                    });
                    
                    resultsContainer.appendChild(div);
                });
            }
            resultsContainer.classList.add('active');
        }

        if (input) {
            input.addEventListener('input', handleSearch);
            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!searchContainer.contains(e.target)) {
                    resultsContainer.classList.remove('active');
                }
            });
        }

        if (searchToggle) {
            searchToggle.addEventListener('click', () => {
                input.focus();
            });
        }
    }

    // --- 7. Modal System ---
    function initModals() {
        const overlay = document.getElementById('modalOverlay');
        const modal = document.getElementById('articleModal');
        const closeBtn = document.getElementById('modalClose');
        const content = document.getElementById('modalContent');
        const cards = document.querySelectorAll('.article-card');

        function openModal(title, category) {
            content.innerHTML = `
                <h2 class="modal-title">${title}</h2>
                <span class="modal-category">${category}</span>
                <div class="modal-body">
                    <p>This is a placeholder for the full wiki article. In a production environment, this content would be fetched from a headless CMS or generated dynamically based on the selected entry.</p>
                    <p>The Verdant Codex thrives on the contributions of its Seedkeepers. This article documents the principles and implementations of <strong>${title}</strong> within our solarpunk society.</p>
                </div>
            `;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        function closeModal() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.card-title').textContent;
                const category = card.querySelector('.card-category').textContent;
                openModal(title, category);
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // --- 8. Sidebar Toggle (Mobile) ---
    function initSidebar() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                
                // Animate hamburger to X
                const lines = menuToggle.querySelectorAll('.menu-line');
                if (sidebar.classList.contains('active')) {
                    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    lines[1].style.opacity = '0';
                    lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                        sidebar.classList.remove('active');
                        // Reset icon
                        const lines = menuToggle.querySelectorAll('.menu-line');
                        lines[0].style.transform = 'none';
                        lines[1].style.opacity = '1';
                        lines[2].style.transform = 'none';
                    }
                }
            });
        }
    }
});

// Add CSS for JS-generated classes dynamically
const style = document.createElement('style');
style.textContent = `
    /* Search Result Styles */
    .search-result-item {
        padding: 0.75rem;
        border-bottom: 1px solid var(--theme-border);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background 0.2s;
    }
    .search-result-item:last-child { border-bottom: none; }
    .search-result-item:hover { background: var(--theme-surface-hover); }
    .result-title { font-weight: 500; font-size: 0.95rem; }
    .result-category { font-size: 0.75rem; color: var(--theme-text-muted); background: var(--theme-bg); padding: 2px 6px; border-radius: 4px; }
    .search-empty { padding: 1rem; text-align: center; color: var(--theme-text-muted); font-style: italic; }
    mark { background: var(--theme-accent); color: var(--theme-text); padding: 0 2px; border-radius: 2px; }

    /* Modal Styles */
    .modal-title { font-family: var(--font-display); font-size: 2rem; margin-bottom: 0.5rem; color: var(--theme-text); }
    .modal-category { display: inline-block; background: var(--theme-primary); color: var(--theme-bg); padding: 4px 12px; border-radius: 50px; font-size: 0.8rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px; }
    .modal-body { font-size: 1.1rem; line-height: 1.8; color: var(--theme-text); }
    .modal-body p { margin-bottom: 1rem; }

    /* Scroll Animation Classes */
    .article-card, .seed-category, .contribution-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .article-card.visible, .seed-category.visible, .contribution-card.visible {
        opacity: 1;
        transform: translateY(0);
    }
    /* Staggered delays for grids */
    .articles-grid .article-card:nth-child(2), .seed-bank-grid .seed-category:nth-child(2) { transition-delay: 0.1s; }
    .articles-grid .article-card:nth-child(3), .seed-bank-grid .seed-category:nth-child(3) { transition-delay: 0.2s; }
    .articles-grid .article-card:nth-child(4), .seed-bank-grid .seed-category:nth-child(4) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);