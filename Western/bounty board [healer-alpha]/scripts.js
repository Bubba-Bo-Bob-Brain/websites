// ============================================
// THE FRONTIER BOUNTY BOARD — Est. 1885
// Interactive Frontier Experience
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all immersive features
    initializeDustParticles();
    initializeTumbleweeds();
    initializeRevolverNavigation();
    initializeSaloonDoors();
    initializeScrollAnimations();
    initializePosterInteractions();
    initializeDispatchLog();
    
    // Add frontier atmosphere
    addAmbientSounds();
    addFrontierTime();
});

// ============================================
// DUST PARTICLE SYSTEM
// ============================================
function initializeDustParticles() {
    const canvas = document.getElementById('dust-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full viewport
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Dust particle class
    class DustParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.getDustColor();
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
        }
        
        getDustColor() {
            const colors = [
                'rgba(210, 180, 140, ',
                'rgba(188, 143, 143, ',
                'rgba(205, 133, 63, ',
                'rgba(160, 82, 45, ',
                'rgba(139, 119, 101, '
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            const wind = Math.sin(Date.now() * 0.001) * 0.2;
            
            this.x += this.speedX + wind;
            this.y += this.speedY;
            
            this.life--;
            this.opacity = (this.life / this.maxLife) * 0.6;
            
            if (this.x < -10 || this.x > canvas.width + 10 || 
                this.y < -10 || this.y > canvas.height + 10 || 
                this.life <= 0) {
                this.reset();
                if (Math.random() > 0.7) {
                    this.x = -5;
                    this.y = Math.random() * canvas.height;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
            
            ctx.shadowBlur = 2;
            ctx.shadowColor = 'rgba(139, 90, 43, 0.3)';
        }
    }
    
    const particles = [];
    const particleCount = Math.min(150, window.innerWidth / 10);
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new DustParticle());
    }
    
    function animateDust() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(function(particle) {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateDust);
    }
    
    animateDust();
}

// ============================================
// TUMBLEWEED ANIMATION SYSTEM
// ============================================
function initializeTumbleweeds() {
    const container = document.getElementById('tumbleweed-container');
    let tumbleweedCount = 0;
    const maxTumbleweeds = 3;
    
    function createTumbleweed() {
        if (tumbleweedCount >= maxTumbleweeds) return;
        
        const tumbleweed = document.createElement('div');
        tumbleweed.className = 'tumbleweed';
        
        const symbols = ['\uD83C\uDF42', '\uD83C\uDF3E', '\uD83C\uDF43', '\uD83C\uDF00', '\uD83C\uDF2A'];
        tumbleweed.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        const startY = Math.random() * window.innerHeight * 0.7;
        const duration = 15 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        tumbleweed.style.top = startY + 'px';
        tumbleweed.style.animationDuration = duration + 's';
        tumbleweed.style.animationDelay = delay + 's';
        
        container.appendChild(tumbleweed);
        tumbleweedCount++;
        
        setTimeout(function() {
            if (tumbleweed.parentNode) {
                tumbleweed.remove();
                tumbleweedCount--;
            }
        }, (duration + delay) * 1000);
    }
    
    setTimeout(function() { createTumbleweed(); }, 2000);
    setTimeout(function() { createTumbleweed(); }, 8000);
    
    setInterval(function() {
        if (Math.random() > 0.7) {
            createTumbleweed();
        }
    }, 15000);
    
    var lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        
        if (Math.abs(st - lastScrollTop) > 100 && Math.random() > 0.8) {
            createTumbleweed();
        }
        
        lastScrollTop = st <= 0 ? 0 : st;
    });
}

// ============================================
// REVOLVER CYLINDER NAVIGATION
// ============================================
function initializeRevolverNavigation() {
    var cylinder = document.getElementById('revolver-cylinder');
    var chambers = document.querySelectorAll('.chamber');
    var trigger = document.getElementById('revolver-trigger');
    var currentChamber = 0;
    var isAnimating = false;
    
    var sections = ['header', 'wanted', 'tiers', 'profiles', 'dispatch', 'footer'];
    
    chambers.forEach(function(chamber, index) {
        chamber.addEventListener('click', function() {
            if (isAnimating) return;
            
            updateActiveChamber(index);
            
            var sectionId = this.getAttribute('data-section');
            var section = document.getElementById(sectionId);
            
            if (section) {
                triggerSaloonTransition(function() {
                    section.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            }
        });
    });
    
    trigger.addEventListener('click', function() {
        if (isAnimating) return;
        
        currentChamber = (currentChamber + 1) % chambers.length;
        
        animateCylinderRotation(currentChamber);
        
        var sectionId = sections[currentChamber];
        var section = document.getElementById(sectionId);
        
        if (section) {
            triggerSaloonTransition(function() {
                section.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });
    
    function updateActiveChamber(index) {
        chambers.forEach(function(ch) {
            ch.classList.remove('chamber-active');
        });
        chambers[index].classList.add('chamber-active');
        currentChamber = index;
    }
    
    function animateCylinderRotation(targetIndex) {
        isAnimating = true;
        cylinder.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        var rotationPerChamber = 60;
        var currentRotation = (currentChamber * rotationPerChamber) % 360;
        var targetRotation = (targetIndex * rotationPerChamber) % 360;
        
        var rotation = targetRotation - currentRotation;
        if (rotation > 180) rotation -= 360;
        if (rotation < -180) rotation += 360;
        
        cylinder.style.transform = 'rotate(' + rotation + 'deg)';
        
        setTimeout(function() {
            updateActiveChamber(targetIndex);
            isAnimating = false;
        }, 500);
    }
    
    window.addEventListener('scroll', function() {
        var scrollPosition = window.scrollY + window.innerHeight / 3;
        
        sections.forEach(function(sectionId, index) {
            var section = document.getElementById(sectionId);
            if (section) {
                var sectionTop = section.offsetTop;
                var sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    if (currentChamber !== index) {
                        updateActiveChamber(index);
                        chambers[index].style.animation = 'pulse-chamber 0.5s ease';
                        setTimeout(function() {
                            chambers[index].style.animation = '';
                        }, 500);
                    }
                }
            }
        });
    });
}

// ============================================
// SALOON DOOR TRANSITIONS
// ============================================
var saloonAnimat = false;

function initializeSaloonDoors() {
    var saloonDoors = document.getElementById('saloon-doors');
    
    window.triggerSaloonTransition = function(callback) {
        if (saloonAnimat) return;
        saloonAnimat = true;
        
        saloonDoors.className = 'saloon-doors closing';
        
        playSoundEffect('creak');
        
        setTimeout(function() {
            if (callback) callback();
            
            saloonDoors.className = 'saloon-doors closed';
            
            setTimeout(function() {
                saloonDoors.className = 'saloon-doors opening';
                
                setTimeout(function() {
                    saloonDoors.className = 'saloon-doors';
                    saloonAnimat = false;
                }, 800);
            }, 300);
        }, 600);
    };
}

// ============================================
// SCROLL ANIMATIONS & EFFECTS
// ============================================
function initializeScrollAnimations() {
    var header = document.querySelector('.bounty-header');
    var scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        var headerHeight = header.offsetHeight;
        
        if (scrolled < headerHeight) {
            var parallaxSpeed = 0.3;
            header.style.transform = 'translateY(' + (scrolled * parallaxSpeed) + 'px)';
            
            if (scrollIndicator) {
                var opacity = 1 - (scrolled / (headerHeight * 0.5));
                scrollIndicator.style.opacity = Math.max(0, opacity);
            }
        }
    });
    
    var observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('wanted-poster')) {
                    createDustPuff(entry.target);
                }
            }
        });
    }, observerOptions);
    
    var animatedElements = document.querySelectorAll('.wanted-poster, .tier-card, .profile-card, .dispatch-entry');
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    var style = document.createElement('style');
    style.textContent = '\n.visible {\n    opacity: 1 !important;\n    transform: translateY(0) !important;\n}\n\n@keyframes pulse-chamber {\n    0% { transform: scale(1); }\n    50% { transform: scale(1.1); }\n    100% { transform: scale(1); }\n}\n\n@keyframes dust-puff {\n    0% { opacity: 0.6; transform: scale(0.5) translateY(0); }\n    100% { opacity: 0; transform: scale(1.5) translateY(-20px); }\n}\n';
    document.head.appendChild(style);
}

function createDustPuff(element) {
    var rect = element.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height;
    
    for (var i = 0; i < 8; i++) {
        var particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = (centerX + (Math.random() - 0.5) * 40) + 'px';
        particle.style.top = centerY + 'px';
        var size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = 'rgba(210, 180, 140, ' + (Math.random() * 0.5 + 0.2) + ')';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.animation = 'dust-puff ' + (Math.random() * 1 + 0.5) + 's ease-out forwards';
        
        document.body.appendChild(particle);
        
        setTimeout(function(p) {
            p.remove();
        }.bind(null, particle), 1500);
    }
}

// ============================================
// WANTED POSTER INTERACTIONS
// ============================================
function initializePosterInteractions() {
    var posters = document.querySelectorAll('.wanted-poster');
    
    posters.forEach(function(poster) {
        poster.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02) rotate(0.5deg)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.5)';
            playSoundEffect('paper');
        });
        
        poster.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        poster.addEventListener('click', function() {
            var outlaw = this.getAttribute('data-outlaw');
            showOutlawDetails(outlaw);
        });
    });
    
    function showOutlawDetails(outlawId) {
        var poster = document.querySelector('.wanted-poster[data-outlaw="' + outlawId + '"]');
        
        if (poster) {
            var stamp = document.createElement('div');
            stamp.textContent = 'REVIEWED';
            stamp.style.position = 'absolute';
            stamp.style.top = '50%';
            stamp.style.left = '50%';
            stamp.style.transform = 'translate(-50%, -50%) rotate(-15deg)';
            stamp.style.fontFamily = 'var(--font-display)';
            stamp.style.fontSize = '2rem';
            stamp.style.color = 'rgba(139, 0, 0, 0.7)';
            stamp.style.border = '4px double rgba(139, 0, 0, 0.7)';
            stamp.style.padding = '10px 20px';
            stamp.style.background = 'rgba(244, 228, 193, 0.9)';
            stamp.style.zIndex = '10';
            stamp.style.pointerEvents = 'none';
            stamp.style.animation = 'stamp-appear 0.5s ease';
            
            poster.querySelector('.poster-parchment').appendChild(stamp);
            
            setTimeout(function() {
                stamp.style.animation = 'stamp-fade 0.5s ease forwards';
                setTimeout(function() { stamp.remove(); }, 500);
            }, 2000);
            
            playSoundEffect('stamp');
        }
    }
    
    var stampStyle = document.createElement('style');
    stampStyle.textContent = '\n@keyframes stamp-appear {\n    0% { opacity: 0; transform: translate(-50%, -50%) rotate(-15deg) scale(2); }\n    100% { opacity: 1; transform: translate(-50%, -50%) rotate(-15deg) scale(1); }\n}\n\n@keyframes stamp-fade {\n    0% { opacity: 1; }\n    100% { opacity: 0; }\n}\n';
    document.head.appendChild(stampStyle);
}

// ============================================
// DISPATCH LOG INTERACTIONS
// ============================================
function initializeDispatchLog() {
    var entries = document.querySelectorAll('.dispatch-entry');
    
    entries.forEach(function(entry) {
        entry.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(139, 69, 19, 0.08)';
            this.style.transform = 'translateX(5px)';
        });
        
        entry.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = '';
        });
        
        entry.addEventListener('click', function() {
            if (!this.classList.contains('dispatch-read')) {
                this.classList.add('dispatch-read');
                
                var readIndicator = document.createElement('div');
                readIndicator.textContent = '\u2713 READ';
                readIndicator.style.position = 'absolute';
                readIndicator.style.top = '10px';
                readIndicator.style.right = '10px';
                readIndicator.style.fontFamily = 'var(--font-typewriter)';
                readIndicator.style.fontSize = '0.7rem';
                readIndicator.style.color = 'var(--brass)';
                readIndicator.style.opacity = '0';
                readIndicator.style.transition = 'opacity 0.5s';
                
                this.style.position = 'relative';
                this.appendChild(readIndicator);
                
                setTimeout(function() {
                    readIndicator.style.opacity = '1';
                }, 100);
                
                playSoundEffect('writing');
            }
        });
    });
}

// ============================================
// AUDIO & SOUND EFFECTS
// ============================================
function addAmbientSounds() {
    var sounds = {
        wind: { frequency: 150, type: 'sine', duration: 3, volume: 0.05 },
        creak: { frequency: 100, type: 'square', duration: 0.8, volume: 0.1 },
        paper: { frequency: 2000, type: 'sawtooth', duration: 0.3, volume: 0.05 },
        stamp: { frequency: 80, type: 'square', duration: 0.4, volume: 0.15 },
        writing: { frequency: 1200, type: 'triangle', duration: 0.2, volume: 0.08 }
    };
    
    window.playSoundEffect = function(soundName) {
        if (!window.audioContext && typeof AudioContext !== 'undefined') {
            try {
                window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return;
            }
        }
        
        if (!window.audioContext) return;
        
        var sound = sounds[soundName];
        if (!sound) return;
        
        var oscillator = window.audioContext.createOscillator();
        var gainNode = window.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        oscillator.frequency.value = sound.frequency;
        oscillator.type = sound.type;
        
        gainNode.gain.setValueAtTime(sound.volume, window.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, window.audioContext.currentTime + sound.duration);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + sound.duration);
    };
    
    setInterval(function() {
        if (Math.random() > 0.95 && window.audioContext) {
            playSoundEffect('wind');
        }
    }, 5000);
}

// ============================================
// FRONTIER TIME DISPLAY
// ============================================
function addFrontierTime() {
    var timeDisplay = document.createElement('div');
    timeDisplay.id = 'frontier-time';
    timeDisplay.style.position = 'fixed';
    timeDisplay.style.top = '20px';
    timeDisplay.style.left = '20px';
    timeDisplay.style.fontFamily = 'var(--font-typewriter)';
    timeDisplay.style.fontSize = '0.8rem';
    timeDisplay.style.color = 'var(--parchment-light)';
    timeDisplay.style.background = 'rgba(58, 42, 26, 0.8)';
    timeDisplay.style.padding = '5px 10px';
    timeDisplay.style.borderRadius = '4px';
    timeDisplay.style.zIndex = '1000';
    timeDisplay.style.border = '1px solid var(--brass)';
    
    document.body.appendChild(timeDisplay);
    
    function updateTime() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        
        var period = hours >= 12 ? 'PM' : 'AM';
        var displayHours = hours % 12 || 12;
        var displayMinutes = minutes.toString().padStart(2, '0');
        
        var timeOfDay = '';
        if (hours >= 5 && hours < 8) timeOfDay = 'Dawn';
        else if (hours >= 8 && hours < 12) timeOfDay = 'Morning';
        else if (hours >= 12 && hours < 17) timeOfDay = 'Afternoon';
        else if (hours >= 17 && hours < 20) timeOfDay = 'Evening';
        else timeOfDay = 'Night';
        
        timeDisplay.innerHTML = '<div style="font-size: 0.7rem; color: var(--brass);">' + timeOfDay + '</div><div>' + displayHours + ':' + displayMinutes + ' ' + period + '</div>';
    }
    
    updateTime();
    setInterval(updateTime, 60000);
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        
        var chambers = document.querySelectorAll('.chamber');
        var currentActive = document.querySelector('.chamber-active');
        var currentIndex = Array.from(chambers).indexOf(currentActive);
        
        var newIndex;
        if (e.key === 'ArrowUp') {
            newIndex = (currentIndex - 1 + chambers.length) % chambers.length;
        } else {
            newIndex = (currentIndex + 1) % chambers.length;
        }
        
        chambers[newIndex].click();
    }
    
    if (e.key === 'Enter' && document.activeElement.classList.contains('chamber')) {
        document.activeElement.click();
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
function throttle(func, limit) {
    var inThrottle;
    return function() {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() { inThrottle = false; }, limit);
        }
    };
}

window.addEventListener('scroll', throttle(function() {
    // Heavy scroll calculations handled here
}, 100));

// ============================================
// INITIALIZATION COMPLETE
// ============================================
console.log('The Frontier Bounty Board has been initialized!');
console.log('Est. 1885 - Dusty Gulch County, Arizona Territory');