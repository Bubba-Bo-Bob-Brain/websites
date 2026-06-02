/**
 * The Gilded Thistle & Moss - Main Script
 * Handles loading, navigation, theme toggling, and interactive details.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Loading Sequence ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const grimoireBook = document.getElementById('grimoire-book');
    const loadingText = document.querySelector('.loading-text');

    // Simulate a "brewing" delay
    setTimeout(() => {
        // Fade out the cauldron
        loadingOverlay.style.opacity = '0';
        loadingText.innerText = "The pages are ready...";
        
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            
            // Reveal the book with a staggered animation
            grimoireBook.classList.add('book-open');
            
            // Trigger the initial page reveal
            revealCurrentSection();
        }, 800);
    }, 2500);

    // --- 2. Navigation & Seasonal Logic ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.recipe-section');
    const seasonLabel = document.querySelector('.current-season');
    const seasonColors = {
        spring: { label: 'Spring', color: '#4caf50' },
        summer: { label: 'Summer', color: '#ff9800' },
        autumn: { label: 'Autumn', color: '#795548' },
        winter: { label: 'Winter', color: '#2196f3' }
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const season = e.target.dataset.season;
            const targetId = `${season}-content`;
            
            // Update Active Button State
            navButtons.forEach(b => b.classList.remove('active'));
            e.target.closest('.nav-btn').classList.add('active');

            // Update Label
            seasonLabel.innerText = seasonColors[season].label;
            seasonLabel.style.color = seasonColors[season].color;

            // Switch Content
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                    revealCurrentSection();
                } else {
                    section.classList.remove('active');
                }
            });

            // Update Page Number dynamically (mock logic)
            const pageNums = { spring: '1', summer: '14', autumn: '28', winter: '42' };
            document.querySelector('.page-number').innerText = `Page ${pageNums[season]} of 4`;
        });
    });

    // --- 3. Theme Toggle (Moth to Candle) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('night-mode');
        
        if (body.classList.contains('night-mode')) {
            // Night Mode: Candlelight
            themeToggle.setAttribute('aria-label', 'Switch to Day Mode');
            moonIcon.style.opacity = '1';
            sunIcon.style.opacity = '0';
            document.title = "The Gilded Thistle & Moss | Night Watch";
        } else {
            // Day Mode: Sunlight
            themeToggle.setAttribute('aria-label', 'Switch to Night Mode');
            moonIcon.style.opacity = '0';
            sunIcon.style.opacity = '1';
            document.title = "The Gilded Thistle & Moss | Herbalist's Grimoire";
        }
    });

    // --- 4. Interactive "Ink" Effect on Text ---
    // Adds a subtle hover effect to the handwritten headers to mimic ink settling
    const handwrittenHeaders = document.querySelectorAll('.handwritten-header');
    
    handwrittenHeaders.forEach(header => {
        header.addEventListener('mouseenter', () => {
            header.style.transform = 'scale(1.02)';
            header.style.textShadow = '2px 2px 4px rgba(0,0,0,0.2)';
        });
        header.addEventListener('mouseleave', () => {
            header.style.transform = 'scale(1)';
            header.style.textShadow = 'none';
        });
    });

    // --- 5. Helper: Reveal Animation ---
    function revealCurrentSection() {
        const activeSection = document.querySelector('.recipe-section.active');
        if (activeSection) {
            const elements = activeSection.querySelectorAll('.illustration-box, .recipe-text');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100 * (index + 1));
            });
        }
    }
});