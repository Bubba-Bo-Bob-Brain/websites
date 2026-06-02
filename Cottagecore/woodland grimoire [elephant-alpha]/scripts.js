// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeThemeToggle();
    initializeCauldronAnimation();
    initializeScrollEffects();
    initializeNavigationEffects();
    initializeSeasonWheel();
});

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = themeToggle.querySelector('.moon');
    const sunIcon = themeToggle.querySelector('.sun');
    const body = document.body;
    
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('witch-theme') || 'dark';
    
    if (currentTheme === 'dark') {
        body.classList.add('night-mode');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('night-mode');
        const isNightMode = body.classList.contains('night-mode');
        
        // Update icon visibility
        if (isNightMode) {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
            localStorage.setItem('witch-theme', 'light');
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
            localStorage.setItem('witch-theme', 'dark');
        }
        
        // Trigger reflow animation
        themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// Cauldron Loading Animation
function initializeCauldronAnimation() {
    const loader = document.getElementById('cauldron-loader');
    let animationComplete = false;
    
    // Show loader initially
    loader.style.display = 'flex';
    
    // Hide loader after animation completes
    setTimeout(() => {
        if (!animationComplete) {
            hideCauldronLoader();
        }
    }, 4000);
    
    // Also hide after user interaction
    document.addEventListener('click', function hideOnInteraction() {
        if (!animationComplete) {
            animationComplete = true;
            hideCauldronLoader();
            document.removeEventListener('click', hideOnInteraction);
        }
    });
    
    function hideCauldronLoader() {
        loader.style.opacity = '0';
        loader.style.transform = 'scale(0.8)';
        loader.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// Scroll Effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe potion cards
    document.querySelectorAll('.potion-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
        
        observer.observe(card);
    });
}

// Navigation Effects
function initializeNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Seasonal Wheel Functionality
function initializeSeasonWheel() {
    const wheel = document.querySelector('.season-wheel-inner');
    let isSpinning = false;
    
    wheel.addEventListener('click', function() {
        if (isSpinning) return;
        
        isSpinning = true;
        const spinDegrees = 90 + Math.floor(Math.random() * 360);
        const duration = 2000 + Math.random() * 2000;
        
        this.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 1.01)`;
        this.style.transform = `rotate(${spinDegrees}deg)`;
        
        setTimeout(() => {
            isSpinning = false;
        }, duration);
    });
}

// Add dynamic bubble effects to potions
function initializePotionEffects() {
    const potionVisuals = document.querySelectorAll('.potion-visual');
    
    potionVisuals.forEach(visual => {
        visual.addEventListener('mouseenter', function() {
            // Add extra sparkle on hover
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #fff, transparent);
                border-radius: 50%;
                animation: sparkleTwinkle 1s ease-in-out infinite;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            
            // Add sparkle animation to existing style element or create new one
            let style = document.getElementById('potion-sparkle-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'potion-sparkle-style';
                style.textContent = `
                    @keyframes sparkleTwinkle {
                        0%, 100% { opacity: 0; transform: scale(0); }
                        50% { opacity: 1; transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 3000);
        });
    });
}

// Initialize potion effects after a short delay to ensure DOM is ready
setTimeout(initializePotionEffects, 1000);

// Add floating text effect for potion names
function addFloatingTextEffect() {
    const potionNames = document.querySelectorAll('.potion-name');
    
    potionNames.forEach(name => {
        name.addEventListener('mouseenter', function() {
            const floatingText = document.createElement('span');
            floatingText.textContent = '✨';
            floatingText.style.cssText = `
                position: absolute;
                font-size: 1.2rem;
                animation: floatText 1s ease-out forwards;
                pointer-events: none;
                z-index: 10;
            `;
            
            // Add floating text animation
            let style = document.getElementById('floating-text-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'floating-text-style';
                style.textContent = `
                    @keyframes floatText {
                        0 { transform: translateY(0) scale(1); opacity: 1; }
                        100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Position the floating text
            const rect = this.getBoundingClientRect();
            floatingText.style.left = (rect.left + window.scrollX) + 'px';
            floatingText.style.top = (rect.top + window.scrollY) + 'px';
            
            document.body.appendChild(floatingText);
            
            setTimeout(() => {
                floatingText.remove();
            }, 1000);
        });
    });
}

// Initialize floating text effect
addFloatingTextEffect();

// Add interactive remedy note effects
function initializeRemedyEffects() {
    const remedyNotes = document.querySelectorAll('.remedy-note');
    
    remedyNotes.forEach(note => {
        note.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
        
        note.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize remedy effects
initializeRemedyEffects();

// Add decorative background particles
function createBackgroundParticles() {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${Math.random() > 0.5 ? 'var(--rose-gold)' : 'var(--azure-blue)'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.3 + 0.1};
            z-index: -1;
            animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        // Add particle animation keyframes
        if (!document.querySelector('#particle-style')) {
            const style = document.createElement('style');
            style.id = 'particle-style';
            style.textContent = `
                @keyframes particleFloat {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg); }
                    50% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(180deg); }
                    75% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(particle);
    }
}

// Initialize background particles
createBackgroundParticles();

// Add interactive bookmark functionality
function initializeBookmarkFunctionality() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        section.addEventListener('click', function(e) {
            if (e.target.closest('.potion-card') || e.target.closest('.remedy-note')) return;
            
            // Add bookmark animation
            const bookmark = document.createElement('div');
            bookmark.textContent = '🔖';
            bookmark.style.cssText = `
                position: fixed;
                font-size: 1.5rem;
                animation: bookmarkFloat 1s ease-out forwards;
                pointer-events: none;
                z-index: 1000;
            `;
            
            // Add bookmark animation styles
            if (!document.querySelector('#bookmark-style')) {
                const style = document.createElement('style');
                style.id = 'bookmark-style';
                style.textContent = `
                    @keyframes bookmarkFloat {
                        0 { transform: scale(0) translateY(0); opacity: 0; }
                        50% { transform: scale(1.2) translateY(-50px); opacity: 1; }
                        100% { transform: scale(1) translateY(-100px); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            bookmark.style.left = (e.clientX - 15) + 'px';
            bookmark.style.top = (e.clientY - 15) + 'px';
            
            document.body.appendChild(bookmark);
            
            setTimeout(() => {
                bookmark.remove();
            }, 1000);
        });
    });
}

// Initialize bookmark functionality
initializeBookmarkFunctionality();

// Add responsive navigation behavior
function initializeResponsiveNav() {
    const nav = document.querySelector('.nav-menu');
    const menuButton = document.createElement('div');
    menuButton.textContent = '☰';
    menuButton.style.cssText = `
        display: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--parchment);
    `;
    
    document.querySelector('.nav-container').insertBefore(menuButton, nav);
    
    function toggleNav() {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'var(--deep-forest)';
        nav.style.padding = 'var(--spacing-md)';
        nav.style.gap = 'var(--spacing-sm)';
    }
    
    menuButton.addEventListener('click', toggleNav);
    
    // Hide mobile menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'row';
            nav.style.position = 'static';
            nav.style.background = 'none';
            nav.style.padding = '0';
        } else {
            nav.style.display = 'none';
        }
    });
}

// Initialize responsive navigation
initializeResponsiveNav();

// Add mystical text cursor effect
function initializeTextCursor() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: var(--candle-flame);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px var(--candle-flame);
        transition: width 0.1s, height 0.1s;
    `;
    document.body.appendChild(cursor);
    
    let timeout;
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cursor.style.width = '4px';
            cursor.style.height = '4px';
        }, 200);
        
        cursor.style.width = '8px';
        cursor.style.height = '8px';
    });
}

// Initialize text cursor effect
initializeTextCursor();

// Add scroll-to-top functionality with mystical theme
function initializeScrollToTop() {
    const scrollTopButton = document.createElement('button');
    scrollTopButton.textContent = '↑';
    scrollTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--potion-purple), var(--rose-gold));
        border: 3px solid var(--parchment);
        color: var(--parchment);
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: var(--shadow-raised);
    `;
    
    document.body.appendChild(scrollTopButton);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.transform = 'translateY(0)';
        } else {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.transform = 'translateY(20px)';
        }
    });
    
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add mystical pulse effect
        scrollTopButton.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scrollTopButton.style.transform = 'scale(1)';
        }, 200);
    });
}

// Initialize scroll to top button
initializeScrollToTop();

// Add mystical fog effect to the entire page
function createMysticalFog() {
    const fog = document.createElement('div');
    fog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse at center, transparent 50%, rgba(139, 69, 19, 0.03) 100%);
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(fog);
}

// Initialize mystical fog
createMysticalFog();