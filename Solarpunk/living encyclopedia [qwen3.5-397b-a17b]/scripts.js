// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loading Sequence (Photosynthesis) ---
    const loadingScreen = document.getElementById('loading-screen');
    const appContainer = document.getElementById('app-container');
    const growthBar = document.querySelector('.growth-bar');
    const loadingWords = document.querySelectorAll('.loading-word');
    let wordIndex = 0;

    // Animate loading words
    const wordInterval = setInterval(() => {
        wordIndex = (wordIndex + 1) % loadingWords.length;
        loadingWords.forEach((word, index) => {
            word.style.opacity = index === wordIndex ? '1' : '0.3';
            word.style.transform = index === wordIndex ? 'scale(1.1)' : 'scale(1)';
        });
    }, 600);

    // Initial word state
    loadingWords.forEach((word, index) => {
        word.style.opacity = index === 0 ? '1' : '0.3';
        word.style.transition = 'all 0.3s ease';
    });

    // Complete loading after progress bar finishes
    setTimeout(() => {
        clearInterval(wordInterval);
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        if (appContainer) {
            appContainer.classList.add('loaded');
        }
        
        // Trigger entry animation for main article
        const featuredArticle = document.querySelector('.featured-article');
        if (featuredArticle) {
            featuredArticle.style.opacity = '1';
            featuredArticle.style.transform = 'translateY(0)';
        }
    }, 2500);

    // Set initial styles for animation if needed
    const featuredArticle = document.querySelector('.featured-article');
    if (featuredArticle) {
        featuredArticle.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        featuredArticle.style.opacity = '0';
        featuredArticle.style.transform = 'translateY(20px)';
    }

    // --- 2. Sunlight Intensity Control ---
    const sunlightSlider = document.getElementById('sunlight-slider');
    const sunOrb = document.querySelector('.sun-orb');
    const timeLabel = document.querySelector('.time-label');
    const timeValue = document.querySelector('.time-value');
    const body = document.body;

    function updateSunlight(value) {
        if (!sunlightSlider || !timeLabel || !timeValue) return;

        const hours = Math.floor((value / 100) * 24);
        const minutes = Math.floor(((value / 100) * 24 - hours) * 60);
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        if (timeValue) timeValue.textContent = formattedTime;

        // Determine time of day and apply class
        body.classList.remove('sunlight-morning', 'sunlight-noon', 'sunlight-evening', 'sunlight-night');
        
        if (value < 25) {
            body.classList.add('sunlight-morning');
            if (timeLabel) timeLabel.textContent = 'Morning Dew';
        } else if (value < 50) {
            body.classList.add('sunlight-noon');
            if (timeLabel) timeLabel.textContent = 'High Noon';
        } else if (value < 75) {
            body.classList.add('sunlight-evening');
            if (timeLabel) timeLabel.textContent = 'Golden Hour';
        } else {
            body.classList.add('sunlight-night');
            if (timeLabel) timeLabel.textContent = 'Night Cycle';
        }

        // Adjust sun orb color based on time
        if (sunOrb) {
            if (value < 50) {
                sunOrb.style.background = 'radial-gradient(circle, #f1c40f, #d35400)'; // Yellow/Orange
            } else {
                sunOrb.style.background = 'radial-gradient(circle, #f39c12, #c0392b)'; // Deep Orange/Red
            }
        }
    }

    if (sunlightSlider) {
        sunlightSlider.addEventListener('input', (e) => {
            updateSunlight(e.target.value);
        });
        // Initialize sunlight
        updateSunlight(sunlightSlider.value);
    }

    // --- 3. Navigation Interactions ---
    const navToggles = document.querySelectorAll('.nav-toggle');
    
    navToggles.forEach(toggle => {
        // Setup toggle icon style
        const icon = toggle.querySelector('.toggle-icon');
        if (icon) {
            icon.style.display = 'inline-block';
            icon.style.width = '10px';
            icon.style.height = '10px';
            icon.style.borderRight = '2px solid currentColor';
            icon.style.borderBottom = '2px solid currentColor';
            icon.style.transition = 'transform 0.3s ease';
            
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            icon.style.transform = isExpanded ? 'rotate(135deg)' : 'rotate(-45deg)';
        }

        toggle.addEventListener('click', () => {
            const parent = toggle.closest('.nav-section');
            const list = parent ? parent.querySelector('.nav-list') : null;
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            toggle.setAttribute('aria-expanded', !isExpanded);
            
            if (list) {
                if (isExpanded) {
                    list.classList.add('collapsed');
                } else {
                    list.classList.remove('collapsed');
                }
            }

            if (icon) {
                icon.style.transform = isExpanded ? 'rotate(-45deg)' : 'rotate(135deg)';
            }
        });
    });

    // --- 4. Search Functionality (Simulated) ---
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.querySelector('.search-suggestions');

    if (searchInput && searchSuggestions) {
        searchInput.addEventListener('focus', () => {
            searchSuggestions.style.opacity = '1';
            searchSuggestions.style.visibility = 'visible';
            searchSuggestions.style.transform = 'translateY(0)';
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchSuggestions.style.opacity = '0';
                searchSuggestions.style.visibility = 'hidden';
                searchSuggestions.style.transform = 'translateY(-10px)';
            }, 200);
        });
    }

    // --- 5. Contribution Tracker Animation ---
    const contributionFill = document.querySelector('.contribution-fill');
    const contributionText = document.querySelector('.contribution-text');
    
    if (contributionFill) {
        // Simulate live updates to the contribution bar
        setInterval(() => {
            const currentWidth = parseFloat(contributionFill.style.width) || 73;
            const randomChange = (Math.random() - 0.4) * 5; // -2 to +1
            let newWidth = currentWidth + randomChange;
            newWidth = Math.max(0, Math.min(100, newWidth)); // Clamp between 0 and 100
            
            contributionFill.style.width = `${newWidth}%`;
            
            if (contributionText) {
                contributionText.textContent = `${Math.round(newWidth)}% complete - Help us grow this article!`;
            }
        }, 5000);
    }

    // --- 6. Scroll to Top Button ---
    const scrollBtn = document.getElementById('scroll-to-top');
    
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 7. Tab Switching (Discussion/Edit/Sources) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Hide all contents initially
    tabContents.forEach(content => {
        content.style.display = 'none';
        content.style.opacity = '0';
    });

    // Activate first tab by default if exists
    if (tabBtns.length > 0 && tabBtns[0].classList.contains('active')) {
        const firstTargetId = tabBtns[0].getAttribute('data-tab') + '-tab';
        const firstTarget = document.getElementById(firstTargetId);
        if (firstTarget) {
            firstTarget.style.display = 'block';
            setTimeout(() => { firstTarget.style.opacity = '1'; }, 50);
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
                c.style.opacity = '0';
            });

            // Add active class to clicked tab
            btn.classList.add('active');

            // Show corresponding content
            const targetId = btn.getAttribute('data-tab') + '-tab';
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
                // Simple fade in effect
                setTimeout(() => {
                    targetContent.style.transition = 'opacity 0.3s ease';
                    targetContent.style.opacity = '1';
                }, 50);
            }
        });
    });
});