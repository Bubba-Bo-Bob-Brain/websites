(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Cache DOM elements
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        const nightToggle = document.getElementById('nightToggle');
        const navTabs = document.querySelectorAll('.nav-tab');
        const sections = document.querySelectorAll('.book-section');
        const recipeCards = document.querySelectorAll('.recipe-card');
        const wheel = document.getElementById('seasonWheel');
        const seasonContents = document.querySelectorAll('.season-content');
        const particles = document.getElementById('particles');

        // Initialize
        initLoading();
        initNavigation();
        initRecipeCards();
        initSeasonWheel();
        initNightMode();
        initParticles();

        // Loading Screen
        function initLoading() {
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                mainContent.classList.add('visible');
            }, 2500);
        }

        // Navigation
        function initNavigation() {
            navTabs.forEach(function(tab) {
                tab.addEventListener('click', function() {
                    var sectionId = this.getAttribute('data-section');
                    
                    // Update active tab
                    navTabs.forEach(function(t) { t.classList.remove('active'); });
                    this.classList.add('active');
                    
                    // Show corresponding section
                    sections.forEach(function(section) {
                        section.classList.remove('active');
                        if (section.id === 'section-' + sectionId) {
                            section.classList.add('active');
                        }
                    });
                });
            });
        }

        // Recipe Cards - Toggle details
        function initRecipeCards() {
            recipeCards.forEach(function(card) {
                card.addEventListener('click', function(e) {
                    // Don't toggle if clicking on links or interactive elements
                    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
                    
                    var details = this.querySelector('.recipe-details');
                    if (details) {
                        details.classList.toggle('open');
                        
                        // Animate liquid in potion bottle
                        var liquid = this.querySelector('.liquid');
                        if (liquid) {
                            if (details.classList.contains('open')) {
                                liquid.style.height = '85%';
                            } else {
                                liquid.style.height = '70%';
                            }
                        }
                    }
                });
            });
        }

        // Seasonal Wheel
        function initSeasonWheel() {
            var segments = wheel.querySelectorAll('.wheel-segment');
            
            segments.forEach(function(segment) {
                segment.addEventListener('click', function() {
                    var season = this.getAttribute('data-season');
                    
                    // Update active season content
                    seasonContents.forEach(function(content) {
                        content.classList.remove('active');
                        if (content.getAttribute('data-season') === season) {
                            content.classList.add('active');
                        }
                    });
                    
                    // Animate wheel
                    segments.forEach(function(s) { s.style.filter = 'brightness(0.8)'; });
                    this.style.filter = 'brightness(1.2)';
                    
                    // Reset other segments after delay
                    setTimeout(function() {
                        segments.forEach(function(s) { s.style.filter = ''; });
                    }, 1000);
                });
            });
        }

        // Night Mode Toggle
        function initNightMode() {
            // Check for saved preference
            var savedMode = localStorage.getItem('grimoire-night-mode');
            if (savedMode === 'true') {
                document.body.classList.add('night-mode');
                updateToggleIcon(true);
            }
            
            nightToggle.addEventListener('click', function() {
                var isNight = document.body.classList.toggle('night-mode');
                localStorage.setItem('grimoire-night-mode', isNight);
                updateToggleIcon(isNight);
                
                // Animate toggle
                this.style.transform = 'rotate(360deg)';
                setTimeout(function() {
                    nightToggle.style.transform = '';
                }, 500);
            });
            
            function updateToggleIcon(isNight) {
                var moon = nightToggle.querySelector('.toggle-moon');
                var candle = nightToggle.querySelector('.toggle-candle');
                if (isNight) {
                    moon.style.opacity = '0';
                    candle.style.opacity = '1';
                } else {
                    moon.style.opacity = '1';
                    candle.style.opacity = '0';
                }
            }
        }

        // Magic Particles
        function initParticles() {
            var particleCount = window.innerWidth < 768 ? 15 : 30;
            
            for (var i = 0; i < particleCount; i++) {
                createParticle();
            }
            
            function createParticle() {
                var particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random properties
                var size = Math.random() * 4 + 2;
                var startX = Math.random() * window.innerWidth;
                var duration = Math.random() * 15 + 10;
                var delay = Math.random() * 10;
                var colors = ['#c9a84c', '#e0c878', '#ffd700', '#f5e6c8', '#9b8db5'];
                var color = colors[Math.floor(Math.random() * colors.length)];
                
                particle.style.cssText = [
                    'left: ' + startX + 'px',
                    'width: ' + size + 'px',
                    'height: ' + size + 'px',
                    'background: ' + color,
                    'animation-duration: ' + duration + 's',
                    'animation-delay: ' + delay + 's',
                    'box-shadow: 0 0 ' + (size * 2) + 'px ' + color
                ].join(';');
                
                particles.appendChild(particle);
                
                // Remove and recreate particle after animation
                setTimeout(function() {
                    particle.remove();
                    createParticle();
                }, (duration + delay) * 1000);
            }
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add hover sound effect simulation via visual feedback
        recipeCards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                var glow = this.querySelector('.glow');
                if (glow) {
                    glow.style.opacity = '0.6';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                var glow = this.querySelector('.glow');
                if (glow) {
                    glow.style.opacity = '0.3';
                }
            });
        });

        // Seasonal wheel auto-rotation for demo
        var autoRotateInterval;
        var isWheelInteracted = false;
        
        wheel.addEventListener('click', function() {
            isWheelInteracted = true;
            clearInterval(autoRotateInterval);
        });
        
        // Start auto-rotation after loading
        setTimeout(function() {
            if (!isWheelInteracted) {
                var seasons = ['spring', 'summer', 'autumn', 'winter'];
                var currentSeason = 0;
                
                autoRotateInterval = setInterval(function() {
                    var season = seasons[currentSeason];
                    var segment = wheel.querySelector('[data-season="' + season + '"]');
                    if (segment) {
                        segment.click();
                    }
                    currentSeason = (currentSeason + 1) % seasons.length;
                }, 5000);
            }
        }, 3000);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'n' || e.key === 'N') {
                nightToggle.click();
            }
            
            // Number keys for navigation
            var num = parseInt(e.key);
            if (num >= 1 && num <= navTabs.length) {
                navTabs[num - 1].click();
            }
        });

        // Window resize handler for particles
        var resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                // Recreate particles for new window size
                var existingParticles = particles.querySelectorAll('.particle');
                existingParticles.forEach(function(p) { p.remove(); });
                initParticles();
            }, 500);
        });

        // Add parallax effect to flower cards on scroll
        var flowerCards = document.querySelectorAll('.flower-card');
        if (flowerCards.length > 0) {
            window.addEventListener('scroll', function() {
                var scrollY = window.scrollY;
                flowerCards.forEach(function(card, index) {
                    var rect = card.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        var speed = 0.05;
                        var yPos = (rect.top - window.innerHeight / 2) * speed;
                        card.style.transform = 'translateY(' + yPos + 'px)';
                    }
                });
            });
        }

        // Add typewriter effect to handwritten notes
        var handwrittenNotes = document.querySelectorAll('.handwritten');
        handwrittenNotes.forEach(function(note) {
            var originalText = note.textContent;
            var isTyping = false;
            
            note.addEventListener('mouseenter', function() {
                if (!isTyping) {
                    isTyping = true;
                    var text = this.textContent;
                    this.textContent = '';
                    var charIndex = 0;
                    
                    function typeChar() {
                        if (charIndex < text.length) {
                            note.textContent += text.charAt(charIndex);
                            charIndex++;
                            setTimeout(typeChar, 30);
                        } else {
                            isTyping = false;
                        }
                    }
                    
                    setTimeout(typeChar, 500);
                }
            });
        });

        // Create tooltip for potion ingredients
        var ingredientItems = document.querySelectorAll('.ingredients li');
        ingredientItems.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                this.style.color = 'var(--herb-green)';
                this.style.fontWeight = '600';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.color = '';
                this.style.fontWeight = '';
            });
        });

        // Add page turn effect to sections
        sections.forEach(function(section) {
            section.addEventListener('click', function(e) {
                // Create subtle ripple effect on section background
                if (e.target === this || e.target.classList.contains('section-header')) {
                    var ripple = document.createElement('div');
                    ripple.style.cssText = [
                        'position: absolute',
                        'top: ' + e.clientY + 'px',
                        'left: ' + e.clientX + 'px',
                        'width: 10px',
                        'height: 10px',
                        'background: radial-gradient(circle, var(--honey-gold) 0%, transparent 70%)',
                        'border-radius: 50%',
                        'transform: translate(-50%, -50%) scale(0)',
                        'animation: ripple-effect 0.6s ease-out forwards',
                        'pointer-events: none',
                        'z-index: 1'
                    ].join(';');
                    
                    this.style.position = 'relative';
                    this.appendChild(ripple);
                    
                    setTimeout(function() {
                        ripple.remove();
                    }, 600);
                }
            });
        });

        // Add dynamic year to footer
        var footerNote = document.querySelector('.colophon-note');
        if (footerNote) {
            var year = new Date().getFullYear();
            footerNote.textContent += ' · ' + year;
        }

        console.log('The Whispering Cauldron has awakened. ✦');
    });

})();