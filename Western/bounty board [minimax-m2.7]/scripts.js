/* ============================================
DEADWOOD GULCH SHERIFF'S OFFICE - BOUNTY BOARD
JavaScript Interactions
============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initSaloonDoors();
    initCylinderNavigation();
    initDustParticles();
    initTumbleweed();
    initDateDisplay();
    initScrollAnimations();
    initPosterInteractions();
    initEntrySeals();
    initSmoothScroll();
    initBonusEffects();
});

/* ============================================
SALOON DOOR PAGE TRANSITION
============================================ */

function initSaloonDoors() {
    const saloonLeft = document.getElementById('saloonLeft');
    const saloonRight = document.getElementById('saloonRight');
    
    // Initially closed state - show doors on page load
    setTimeout(function() {
        saloonLeft.style.transform = 'translateX(0)';
        saloonRight.style.transform = 'translateX(0)';
        // Open doors after a moment
        setTimeout(function() {
            saloonLeft.style.transform = 'translateX(-100%)';
            saloonRight.style.transform = 'translateX(100%)';
        }, 800);
    }, 100);
}

/* ============================================
REVOLVER CYLINDER NAVIGATION
============================================ */

function initCylinderNavigation() {
    const chambers = document.querySelectorAll('.cylinder-chamber');
    const cylinderHammer = document.getElementById('cylinderHammer');
    let currentChamber = 0;
    let isSpinning = false;
    
    // Chamber click handler
    chambers.forEach(function(chamber, index) {
        chamber.addEventListener('click', function() {
            if (isSpinning || index === currentChamber) return;
            spinToChamber(index);
        });
        
        // Add hover effect
        chamber.addEventListener('mouseenter', function() {
            if (!chamber.classList.contains('active')) {
                chamber.style.transform = 'scale(1.05)';
            }
        });
        
        chamber.addEventListener('mouseleave', function() {
            if (!chamber.classList.contains('active')) {
                chamber.style.transform = 'scale(1)';
            }
        });
    });
    
    // Spin animation
    function spinToChamber(targetIndex) {
        isSpinning = true;
        const sectionId = chambers[targetIndex].dataset.section;
        const section = document.getElementById(sectionId);
        
        // Animate hammer
        if (cylinderHammer) {
            cylinderHammer.style.transition = 'transform 0.15s ease-out';
            cylinderHammer.style.transform = 'rotate(-30deg)';
            setTimeout(function() {
                cylinderHammer.style.transition = 'transform 0.1s ease-in';
                cylinderHammer.style.transform = 'rotate(0deg)';
            }, 150);
        }
        
        // Calculate rotation
        const rotations = 3 + Math.abs(targetIndex - currentChamber);
        const anglePerChamber = 360 / chambers.length;
        const totalRotation = rotations * 360 + (targetIndex - currentChamber) * anglePerChamber;
        
        // Apply rotation to cylinder
        const cylinderContainer = document.querySelector('.cylinder-container');
        cylinderContainer.style.transition = 'transform 0.8s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        cylinderContainer.style.transform = 'rotate(' + totalRotation + 'deg)';
        
        // Update active state after animation
        setTimeout(function() {
            chambers.forEach(function(cham, idx) {
                cham.classList.remove('active');
                if (idx === targetIndex) {
                    cham.classList.add('active');
                }
            });
            currentChamber = targetIndex;
            isSpinning = false;
            
            // Reset cylinder visual rotation
            cylinderContainer.style.transition = 'none';
            cylinderContainer.style.transform = 'rotate(0deg)';
            
            // Scroll to section
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 800);
    }
    
    // Auto-rotate cylinder on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            updateActiveChamberOnScroll();
        }, 100);
    });
    
    function updateActiveChamberOnScroll() {
        const sections = ['bounties', 'high-value', 'dispatch', 'captured', 'rewards'];
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        let activeSection = null;
        
        sections.forEach(function(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    activeSection = sectionId;
                }
            }
        });
        
        if (activeSection) {
            const targetIndex = sections.indexOf(activeSection);
            if (targetIndex !== currentChamber && !isSpinning) {
                chambers.forEach(function(cham, idx) {
                    if (idx === targetIndex) {
                        cham.classList.add('active');
                    } else {
                        cham.classList.remove('active');
                    }
                });
                currentChamber = targetIndex;
            }
        }
    }
}

/* ============================================
DUST PARTICLE SYSTEM
============================================ */

function initDustParticles() {
    const dustOverlay = document.getElementById('dustOverlay');
    if (!dustOverlay) return;
    
    // Create additional dynamic particles
    for (var i = 0; i < 20; i++) {
        var particle = document.createElement('div');
        particle.className = 'dust-particle';
        particle.style.left = (Math.random() * 100) + '%';
        particle.style.animationDelay = (Math.random() * 15) + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = (2 + Math.random() * 3) + 'px';
        particle.style.opacity = (0.2 + Math.random() * 0.3);
        dustOverlay.appendChild(particle);
    }
    
    // Mouse interaction - create dust puff on movement
    var lastMoveTime = 0;
    document.addEventListener('mousemove', function(e) {
        var now = Date.now();
        if (now - lastMoveTime > 100) {
            lastMoveTime = now;
            createDustPuff(e.clientX, e.clientY);
        }
    });
}

function createDustPuff(x, y) {
    var dustOverlay = document.getElementById('dustOverlay');
    var puff = document.createElement('div');
    puff.style.position = 'fixed';
    puff.style.left = x + 'px';
    puff.style.top = y + 'px';
    puff.style.width = '30px';
    puff.style.height = '30px';
    puff.style.background = 'radial-gradient(circle, rgba(210, 180, 140, 0.4) 0%, transparent 70%)';
    puff.style.borderRadius = '50%';
    puff.style.pointerEvents = 'none';
    puff.style.zIndex = '9998';
    puff.style.animation = 'dustPuff 0.6s ease-out forwards';
    dustOverlay.appendChild(puff);
    setTimeout(function() { puff.remove(); }, 600);
}

// Add dust puff animation dynamically
var dustStyle = document.createElement('style');
dustStyle.textContent = '@keyframes dustPuff { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }';
document.head.appendChild(dustStyle);

/* ============================================
TUMBLEWEED ANIMATION
============================================ */

function initTumbleweed() {
    var tumbleweed = document.getElementById('tumbleweed');
    if (!tumbleweed) return;
    
    // Randomize tumbleweed appearance
    setInterval(function() {
        tumbleweed.style.animation = 'none';
        tumbleweed.offsetHeight;
        tumbleweed.style.animation = '';
    }, 25000);
    
    // Occasionally speed up tumbleweed
    setInterval(function() {
        tumbleweed.style.animation = 'tumbleRoll 15s linear forwards';
        setTimeout(function() {
            tumbleweed.style.animation = 'tumbleRoll 25s linear infinite';
        }, 15000);
    }, 60000);
}

/* ============================================
DATE DISPLAY
============================================ */

function initDateDisplay() {
    var dateElement = document.getElementById('currentDate');
    if (!dateElement) return;
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var now = new Date();
    var month = months[now.getMonth()];
    var day = now.getDate();
    var year = 1887;
    var dayName = days[now.getDay()];
    
    dateElement.textContent = dayName + ', ' + month + ' ' + day + ', ' + year + ' — Territory of Dakota';
}

/* ============================================
SCROLL ANIMATIONS
============================================ */

function initScrollAnimations() {
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                if (entry.target.classList.contains('bounty-grid')) {
                    var posters = entry.target.querySelectorAll('.wanted-poster');
                    posters.forEach(function(poster, index) {
                        setTimeout(function() {
                            poster.style.opacity = '1';
                            poster.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(function(section) {
        observer.observe(section);
    });
    
    // Parallax effect for header
    var header = document.querySelector('.main-header');
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        if (header && scrolled < 500) {
            header.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            header.style.opacity = 1 - (scrolled * 0.002);
        }
    });
}

/* ============================================
POSTER INTERACTIONS
============================================ */

function initPosterInteractions() {
    var posters = document.querySelectorAll('.wanted-poster');
    
    posters.forEach(function(poster) {
        poster.addEventListener('mouseenter', function() {
            poster.style.zIndex = '10';
        });
        
        poster.addEventListener('mouseleave', function() {
            poster.style.zIndex = '1';
        });
        
        // Add random slight rotation for realism
        var randomRotation = (Math.random() - 0.5) * 4;
        var content = poster.querySelector('.poster-content');
        if (content) {
            content.style.transform = 'rotate(' + randomRotation + 'deg)';
        }
    });
    
    // Curled corner effect enhancement
    posters.forEach(function(poster) {
        var curls = poster.querySelectorAll('.curled-corner');
        curls.forEach(function(curl) {
            curl.addEventListener('mouseenter', function() {
                curl.style.transform = 'scale(1.1) rotate(5deg)';
                curl.style.boxShadow = '-5px 5px 15px rgba(0,0,0,0.4)';
            });
            
            curl.addEventListener('mouseleave', function() {
                curl.style.transform = 'scale(1) rotate(0deg)';
                curl.style.boxShadow = '-3px 3px 8px rgba(0,0,0,0.3)';
            });
        });
    });
}

/* ============================================
ENTRY SEAL ANIMATIONS
============================================ */

function initEntrySeals() {
    var seals = document.querySelectorAll('.entry-seal');
    
    var sealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('seal-visible');
            }
        });
    }, { threshold: 0.5 });
    
    seals.forEach(function(seal) {
        sealObserver.observe(seal);
    });
}

/* ============================================
SMOOTH SCROLL FOR NAV
============================================ */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Keyboard navigation for cylinder chambers
    document.addEventListener('keydown', function(e) {
        var chambers = document.querySelectorAll('.cylinder-chamber');
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            var currentIndex = Array.from(chambers).findIndex(function(c) { return c.classList.contains('active'); });
            var nextIndex = (currentIndex + 1) % chambers.length;
            chambers[nextIndex].click();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            var currentIndex = Array.from(chambers).findIndex(function(c) { return c.classList.contains('active'); });
            var prevIndex = (currentIndex - 1 + chambers.length) % chambers.length;
            chambers[prevIndex].click();
        }
    });
}

/* ============================================
BONUS EFFECTS
============================================ */

function initBonusEffects() {
    createSunRays();
    createShootingStar();
}

/* ============================================
SUN RAYS EFFECT
============================================ */

function createSunRays() {
    var header = document.querySelector('.main-header');
    if (!header) return;
    
    var rays = document.createElement('div');
    rays.className = 'sun-rays';
    rays.innerHTML = '<div class="ray ray-1"></div><div class="ray ray-2"></div><div class="ray ray-3"></div><div class="ray ray-4"></div><div class="ray ray-5"></div>';
    header.appendChild(rays);
    
    var rayStyles = document.createElement('style');
    rayStyles.textContent = [
        '.sun-rays { position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; pointer-events: none; z-index: 0; }',
        '.ray { position: absolute; top: 50%; left: 50%; width: 2px; height: 300px; background: linear-gradient(to bottom, rgba(255, 215, 0, 0.3) 0%, transparent 100%); transform-origin: top center; animation: rayPulse 4s ease-in-out infinite; }',
        '.ray-1 { transform: translateX(-50%) rotate(0deg); animation-delay: 0s; }',
        '.ray-2 { transform: translateX(-50%) rotate(30deg); animation-delay: 0.5s; }',
        '.ray-3 { transform: translateX(-50%) rotate(60deg); animation-delay: 1s; }',
        '.ray-4 { transform: translateX(-50%) rotate(90deg); animation-delay: 1.5s; }',
        '.ray-5 { transform: translateX(-50%) rotate(120deg); animation-delay: 2s; }',
        '@keyframes rayPulse { 0%, 100% { opacity: 0.3; height: 300px; } 50% { opacity: 0.5; height: 350px; } }'
    ].join('');
    document.head.appendChild(rayStyles);
}

/* ============================================
SHOOTING STAR EFFECT
============================================ */

function createShootingStar() {
    var shoot = function() {
        var body = document.body;
        var star = document.createElement('div');
        star.style.position = 'fixed';
        star.style.width = '100px';
        star.style.height = '2px';
        star.style.background = 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent)';
        star.style.top = (Math.random() * 30) + '%';
        star.style.left = '-100px';
        star.style.transform = 'rotate(-45deg)';
        star.style.pointerEvents = 'none';
        star.style.zIndex = '9997';
        star.style.animation = 'shootingStar 1s ease-in forwards';
        body.appendChild(star);
        setTimeout(function() { star.remove(); }, 1000);
    };
    
    setInterval(function() {
        if (Math.random() > 0.7) {
            shoot();
        }
    }, 15000);
    
    var shootStyle = document.createElement('style');
    shootStyle.textContent = '@keyframes shootingStar { 0% { left: -100px; opacity: 1; } 100% { left: 100vw; opacity: 0; } }';
    document.head.appendChild(shootStyle);
}

/* ============================================
REDUCED MOTION CHECK
============================================ */

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    document.querySelectorAll('*').forEach(function(el) {
        el.style.animationDuration = '0.01ms';
        el.style.transitionDuration = '0.01ms';
    });
}

/* ============================================
CONSOLE EASTER EGG
============================================ */

console.log('%c DEADWOOD GULCH SHERIFF\'S OFFICE ', 'font-size: 24px; color: #8B4513; font-weight: bold; text-shadow: 2px 2px #D2B48C; background: #F5E6C8; padding: 10px 20px;');
console.log('%c"Wanted: Good men with steady hands and quick draws"', 'font-style: italic; color: #5C4033; font-size: 14px;');
console.log('%cRewards paid in gold at the Sheriff\'s Office', 'color: #B8860B; font-size: 12px;');
console.log('%cTip: Use arrow keys to navigate the bounty board', 'color: #666; font-size: 10px;');
console.log('%c Bounty Board Loaded Successfully', 'color: #228B22; font-size: 12px; font-weight: bold;');