// Digital Decay Labyrinth - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize system
    initializeSystem();
    
    // Setup navigation
    setupNavigation();
    
    // Setup interactive elements
    setupInteractiveElements();
    
    // Setup glitch effects
    setupGlitchEffects();
    
    // Setup corruption overlay
    setupCorruptionOverlay();
});

// System initialization with fake loading
function initializeSystem() {
    const loadingContainer = document.querySelector('.loading-container');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Simulate loading completion with a delay
            setTimeout(() => {
                loadingContainer.classList.add('hidden');
                // Show the main content after a brief delay
                setTimeout(() => {
                    document.querySelector('.page.active').style.display = 'block';
                }, 500);
            }, 1000);
        }
        loadingProgress.style.width = progress + '%';
    }, 200);
}

// Navigation system
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Add transition effect
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Simulate page load delay
            setTimeout(() => {
                document.getElementById(targetPage).classList.add('active');
                
                // Scroll to top
                window.scrollTo(0, 0);
                
                // Trigger page-specific effects
                triggerPageEffects(targetPage);
            }, 300);
        });
    });
    
    // Setup return links
    const returnLinks = document.querySelectorAll('.return-link');
    returnLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            setTimeout(() => {
                document.getElementById(targetPage).classList.add('active');
                window.scrollTo(0, 0);
            }, 300);
        });
    });
}

// Trigger page-specific effects
function triggerPageEffects(pageId) {
    switch(pageId) {
        case 'error':
            startErrorAnimation();
            break;
        case 'database':
            startDatabaseAnimation();
            break;
        case 'artifact':
            startArtifactAnimation();
            break;
        case 'hidden':
            checkForHiddenAccess();
            break;
    }
}

// Error page animations
function startErrorAnimation() {
    const errorMessages = document.querySelectorAll('.text-melt');
    errorMessages.forEach((msg, index) => {
        msg.style.animationDelay = (index * 0.5) + 's';
    });
}

// Database page animations
function startDatabaseAnimation() {
    const cells = document.querySelectorAll('.corrupted-cell');
    cells.forEach((cell, index) => {
        cell.style.animationDelay = (index * 0.3) + 's';
    });
    
    // Start fake download progress
    const downloadProgress = document.querySelector('.download-progress');
    if (downloadProgress) {
        let width = 0;
        const downloadInterval = setInterval(() => {
            width += Math.random() * 5;
            if (width > 100) width = 0;
            downloadProgress.style.width = width + '%';
        }, 1000);
    }
}

// Artifact page animations
function startArtifactAnimation() {
    const marquee = document.querySelector('marquee');
    if (marquee) {
        marquee.scrollAmount = 2;
        marquee.setAttribute('loop', '');
    }
}

// Hidden chamber access check
function checkForHiddenAccess() {
    // Check if user has explored enough
    const hiddenPage = document.getElementById('hidden');
    if (hiddenPage.classList.contains('active')) {
        // Show hidden content with special effect
        setTimeout(() => {
            hiddenPage.style.opacity = '0';
            hiddenPage.style.transition = 'opacity 2s ease';
            setTimeout(() => {
                hiddenPage.style.opacity = '1';
            }, 1000);
        }, 1000);
    }
}

// Interactive elements setup
function setupInteractiveElements() {
    // Broken links that lead to error pages
    const brokenLinks = document.querySelectorAll('.broken-link');
    brokenLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // Add corruption effect
            addCorruptionEffect();
            
            setTimeout(() => {
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                document.getElementById(target).classList.add('active');
                window.scrollTo(0, 0);
                
                // Trigger error page effects
                if (target === 'error') {
                    startErrorAnimation();
                }
            }, 400);
        });
    });
    
    // Reveal button for hidden chamber
    const revealBtn = document.getElementById('revealBtn');
    if (revealBtn) {
        let clickCount = 0;
        revealBtn.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount >= 3) {
                this.textContent = 'ACCESS GRANTED';
                this.style.background = 'var(--crt-green)';
                this.style.color = 'var(--crt-black)';
                
                // Show hidden chamber
                const hiddenPage = document.getElementById('hidden');
                hiddenPage.classList.remove('hidden');
                hiddenPage.style.display = 'block';
                
                // Add special entrance effect
                setTimeout(() => {
                    hiddenPage.style.opacity = '0';
                    hiddenPage.style.transition = 'opacity 1s ease';
                    setTimeout(() => {
                        hiddenPage.style.opacity = '1';
                    }, 500);
                }, 500);
            } else {
                this.textContent = `REVEAL HIDDEN CHAMBER (${3 - clickCount} more clicks)`;
                this.style.transform = `rotate(${clickCount * 5}deg)`;
                
                // Add temporary glitch effect
                document.getElementById('glitchArea').style.opacity = '1';
                setTimeout(() => {
                    document.getElementById('glitchArea').style.opacity = '0';
                }, 500);
            }
        });
    }
    
    // Interactive zone effects
    const interactiveZone = document.querySelector('.interactive-zone');
    if (interactiveZone) {
        interactiveZone.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            // Subtle parallax effect on corruption overlay
            const overlay = document.getElementById('corruptionOverlay');
            if (overlay) {
                overlay.style.background = `
                    radial-gradient(circle at ${x}% ${y}%, rgba(255, 0, 51, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(0, 170, 255, 0.08) 0%, transparent 50%)
                `;
            }
        });
    }
}

// Glitch effects system
function setupGlitchEffects() {
    const glitchArea = document.getElementById('glitchArea');
    if (glitchArea) {
        // Random glitch appearances
        setInterval(() => {
            if (Math.random() < 0.3) {
                glitchArea.style.opacity = '1';
                glitchArea.style.transform = `rotate(${Math.random() * 10 - 5}deg) skew(${Math.random() * 10 - 5}deg)`;
                
                setTimeout(() => {
                    glitchArea.style.opacity = '0';
                    glitchArea.style.transform = 'rotate(-5deg)';
                }, 200 + Math.random() * 300);
            }
        }, 2000 + Math.random() * 3000);
    }
}

// Corruption overlay system
function setupCorruptionOverlay() {
    const overlay = document.getElementById('corruptionOverlay');
    if (overlay) {
        // Random corruption patterns
        setInterval(() => {
            const patterns = [
                'radial-gradient(circle at 20% 30%, rgba(255, 0, 51, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 70%, rgba(0, 170, 255, 0.05) 0%, transparent 50%)',
                'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 0, 51, 0.03) 2px, rgba(255, 0, 51, 0.03) 4px)',
                'radial-gradient(ellipse at center, rgba(255, 0, 51, 0.05) 0%, transparent 70%)'
            ];
            
            const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
            overlay.style.background = randomPattern;
        }, 5000 + Math.random() * 10000);
    }
}

// Add some random page corruption effects
function addCorruptionEffect() {
    const corruptionOverlay = document.getElementById('corruptionOverlay');
    if (corruptionOverlay) {
        corruptionOverlay.style.animation = 'none';
        setTimeout(() => {
            corruptionOverlay.style.animation = 'overlayShift 10s infinite';
        }, 100);
    }
    
    // Temporary screen shake
    document.body.style.animation = 'none';
    setTimeout(() => {
        document.body.style.animation = 'screenShake 0.5s';
    }, 50);
}

// Add screen shake animation
if (!document.getElementById('shakeStyle')) {
    const shakeStyle = document.createElement('style');
    shakeStyle.id = 'shakeStyle';
    shakeStyle.textContent = `
        @keyframes screenShake {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-5px, -2px); }
            20% { transform: translate(5px, 2px); }
            30% { transform: translate(-3px, 5px); }
            40% { transform: translate(3px, -3px); }
            50% { transform: translate(-2px, 2px); }
            60% { transform: translate(2px, -2px); }
            70% { transform: translate(-1px, 1px); }
            80% { transform: translate(1px, -1px); }
            90% { transform: translate(0, 0); }
        }
    `;
    document.head.appendChild(shakeStyle);
}

// Periodic corruption events
setInterval(() => {
    if (Math.random() < 0.2) {
        addCorruptionEffect();
    }
}, 3000);

// Keyboard shortcuts for hidden content
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+H to reveal hidden chamber
    if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        const hiddenPage = document.getElementById('hidden');
        if (hiddenPage) {
            hiddenPage.classList.remove('hidden');
            hiddenPage.style.display = 'block';
            hiddenPage.style.opacity = '0';
            setTimeout(() => {
                hiddenPage.style.opacity = '1';
            }, 500);
        }
    }
    
    // F5 prevention to maintain the experience
    if (e.key === 'F5') {
        e.preventDefault();
    }
    
    // Space to trigger glitch effect
    if (e.key === ' ') {
        e.preventDefault();
        const glitchArea = document.getElementById('glitchArea');
        if (glitchArea) {
            glitchArea.style.opacity = '1';
            setTimeout(() => {
                glitchArea.style.opacity = '0';
            }, 300);
        }
    }
});