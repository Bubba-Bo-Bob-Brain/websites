/* ============================================
   THE DARK AGES - Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initDayNightCycle();
    initParticles();
    initScrollProgress();
    initBell();
    initTimelineAnimations();
    initMapInteractions();
    initNavigation();
    initBestiaryCards();
    initPlagueStats();
    initStars();
    initClouds();
    initTimeToggle();
    initCursorGlow();
});

/* ============================================
   DAY / NIGHT CYCLE
   ============================================ */

var currentTimeState = 'day';
var timeStates = ['day', 'dusk', 'night'];

function initDayNightCycle() {
    startTimeCycle();
    var timeText = document.getElementById('timeText');
    if (timeText) {
        timeText.addEventListener('click', cycleTimeForward);
    }
}

function startTimeCycle() {
    setInterval(function() {
        cycleTimeForward();
    }, 30000);
}

function cycleTimeForward() {
    var currentIndex = timeStates.indexOf(currentTimeState);
    var nextIndex = (currentIndex + 1) % timeStates.length;
    setTimeState(timeStates[nextIndex]);
}

function setTimeState(state) {
    currentTimeState = state;
    var body = document.body;
    var timeText = document.getElementById('timeText');
    var timeLabels = { day: 'Day', dusk: 'Dusk', night: 'Night' };
    
    body.classList.remove('day', 'dusk', 'night');
    body.classList.add(state);
    
    if (timeText) {
        timeText.textContent = timeLabels[state];
        timeText.setAttribute('data-time', state);
    }
    
    var particles = document.querySelectorAll('.particle');
    particles.forEach(function(p) {
        if (state === 'night') {
            p.style.background = '#ffffff';
            p.style.opacity = '0.5';
        } else if (state === 'dusk') {
            p.style.background = '#ff9966';
            p.style.opacity = '0.4';
        } else {
            p.style.background = '#c9a227';
            p.style.opacity = '0.3';
        }
    });
    
    var stars = document.getElementById('stars');
    if (stars) {
        stars.style.opacity = state === 'night' ? '1' : state === 'dusk' ? '0.5' : '0';
    }
    
    var doctorEyes = document.querySelectorAll('.doctor-eye');
    doctorEyes.forEach(function(eye) {
        if (state === 'night') {
            eye.style.animation = 'eyeGlow 1s ease-in-out infinite';
        } else {
            eye.style.animation = 'eyeGlow 3s ease-in-out infinite';
        }
    });
}

function initTimeToggle() {
    var timeIndicator = document.querySelector('.time-indicator');
    if (timeIndicator) {
        timeIndicator.addEventListener('click', cycleTimeForward);
    }
}

/* ============================================
   BELL TOLLING
   ============================================ */

function initBell() {
    var bellBtn = document.getElementById('bellBtn');
    if (!bellBtn) return;
    
    bellBtn.addEventListener('click', function() {
        bellBtn.classList.add('ringing');
        setTimeout(function() {
            bellBtn.classList.remove('ringing');
        }, 500);
        
        playBellSound();
        showBellNotification();
    });
}

function playBellSound() {
    try {
        var audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        var fundamental = audioContext.createOscillator();
        var second = audioContext.createOscillator();
        var third = audioContext.createOscillator();
        
        fundamental.frequency.value = 800;
        second.frequency.value = 1600;
        third.frequency.value = 2400;
        
        var fundamentalGain = audioContext.createGain();
        var secondGain = audioContext.createGain();
        var thirdGain = audioContext.createGain();
        
        var now = audioContext.currentTime;
        
        fundamental.connect(fundamentalGain);
        fundamentalGain.connect(audioContext.destination);
        fundamentalGain.gain.setValueAtTime(0.3, now);
        fundamentalGain.gain.exponentialRampToValueAtTime(0.01, now + 2);
        
        second.connect(secondGain);
        secondGain.connect(audioContext.destination);
        secondGain.gain.setValueAtTime(0.15, now);
        secondGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        
        third.connect(thirdGain);
        thirdGain.connect(audioContext.destination);
        thirdGain.gain.setValueAtTime(0.08, now);
        thirdGain.gain.exponentialRampToValueAtTime(0.01, now + 1);
        
        fundamental.start(now);
        second.start(now);
        third.start(now);
        
        fundamental.stop(now + 2);
        second.stop(now + 1.5);
        third.stop(now + 1);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function showBellNotification() {
    var notification = document.createElement('div');
    notification.className = 'bell-notification';
    notification.innerHTML = '<span class="notification-icon">&#128276;</span><span class="notification-text">The bell tolls...</span>';
    
    notification.style.cssText = [
        'position: fixed',
        'top: 100px',
        'left: 50%',
        'transform: translateX(-50%)',
        'background: linear-gradient(145deg, #2d1f0f, #5d4e37)',
        'border: 3px solid #c9a227',
        'border-radius: 8px',
        'padding: 12px 24px',
        'display: flex',
        'align-items: center',
        'gap: 10px',
        'z-index: 10000',
        'animation: bellNotificationFade 2s ease-in-out forwards',
        'font-family: Almendra, serif',
        'color: #d4c4a8',
        'box-shadow: 0 5px 20px rgba(0,0,0,0.5)'
    ].join('; ');
    
    document.body.appendChild(notification);
    
    if (!document.getElementById('bellNotificationStyles')) {
        var style = document.createElement('style');
        style.id = 'bellNotificationStyles';
        style.textContent = '@keyframes bellNotificationFade { 0% { opacity: 0; transform: translateX(-50%) translateY(-20px); } 15% { opacity: 1; transform: translateX(-50%) translateY(0); } 85% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(-20px); } }';
        document.head.appendChild(style);
    }
    
    setTimeout(function() {
        notification.remove();
    }, 2000);
}

/* ============================================
   FLOATING PARTICLES
   ============================================ */

function initParticles() {
    var particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (var i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
    
    setInterval(function() {
        if (particlesContainer.children.length < 30) {
            createParticle(particlesContainer);
        }
    }, 2000);
}

function createParticle(container) {
    var particle = document.createElement('div');
    particle.className = 'particle';
    var size = Math.random() * 6 + 2;
    var left = Math.random() * 100;
    var duration = Math.random() * 15 + 10;
    var delay = Math.random() * 5;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    container.appendChild(particle);
    
    particle.addEventListener('animationend', function() {
        particle.remove();
    });
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */

function initScrollProgress() {
    var progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', function() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/* ============================================
   TIMELINE ANIMATIONS
   ============================================ */

function initTimelineAnimations() {
    var events = document.querySelectorAll('.timeline-event');
    if (events.length === 0) return;
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    
    events.forEach(function(event, index) {
        event.style.transitionDelay = (index * 0.1) + 's';
        observer.observe(event);
    });
}

/* ============================================
   MAP INTERACTIONS
   ============================================ */

function initMapInteractions() {
    var locations = document.querySelectorAll('.location');
    var locationInfo = document.getElementById('locationInfo');
    var closeBtn = document.getElementById('closeInfo');
    
    if (locations.length === 0 || !locationInfo) return;
    
    locations.forEach(function(location) {
        location.addEventListener('click', function(e) {
            e.stopPropagation();
            showLocationInfo(location);
        });
        
        location.addEventListener('mouseenter', function() {
            location.style.transform = 'scale(1.15)';
            var pulse = location.querySelector('.location-pulse');
            if (pulse) {
                pulse.style.animation = 'none';
                pulse.setAttribute('r', '35');
            }
        });
        
        location.addEventListener('mouseleave', function() {
            location.style.transform = 'scale(1)';
            var pulse = location.querySelector('.location-pulse');
            if (pulse) {
                pulse.style.animation = '';
            }
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideLocationInfo);
    }
    
    document.addEventListener('click', function(e) {
        if (!locationInfo.contains(e.target) && !e.target.closest('.location')) {
            hideLocationInfo();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideLocationInfo();
        }
    });
}

function showLocationInfo(location) {
    var name = location.getAttribute('data-name') || 'Unknown Location';
    var desc = location.getAttribute('data-desc') || 'No description available.';
    var population = location.getAttribute('data-population') || 'Unknown';
    
    var infoName = document.getElementById('infoName');
    var infoDesc = document.getElementById('infoDesc');
    var infoPop = document.getElementById('infoPop');
    
    if (infoName) infoName.textContent = name;
    if (infoDesc) infoDesc.textContent = desc;
    if (infoPop) infoPop.textContent = population;
    
    var locationInfo = document.getElementById('locationInfo');
    if (locationInfo) {
        locationInfo.classList.add('active');
    }
    
    locations.forEach(function(loc) {
        loc.style.filter = 'opacity(0.6)';
    });
    location.style.filter = 'none';
}

function hideLocationInfo() {
    var locationInfo = document.getElementById('locationInfo');
    if (locationInfo) {
        locationInfo.classList.remove('active');
    }
    
    document.querySelectorAll('.location').forEach(function(loc) {
        loc.style.filter = 'none';
    });
}

/* ============================================
   NAVIGATION
   ============================================ */

function initNavigation() {
    var navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = link.getAttribute('href');
            var targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                var nav = document.querySelector('.medieval-nav');
                var navHeight = nav ? nav.offsetHeight : 0;
                var targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    var sections = document.querySelectorAll('section[id]');
    var observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    var navObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var id = entry.target.getAttribute('id');
                updateActiveNavLink(id);
            }
        });
    }, observerOptions);
    
    sections.forEach(function(section) {
        navObserver.observe(section);
    });
}

function updateActiveNavLink(activeId) {
    var navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        var linkId = link.getAttribute('href').substring(1);
        
        if (linkId === activeId) {
            link.classList.add('active');
            link.style.color = '#f4d03f';
            link.style.borderColor = '#c9a227';
        } else {
            link.classList.remove('active');
            link.style.color = '';
            link.style.borderColor = 'transparent';
        }
    });
}

/* ============================================
   BESTIARY CARDS
   ============================================ */

function initBestiaryCards() {
    var cards = document.querySelectorAll('.creature-card');
    if (cards.length === 0) return;
    
    cards.forEach(function(card) {
        var svg = card.querySelector('.creature-svg');
        if (svg) {
            var randomDuration = Math.random() * 2 + 2;
            svg.style.animationDuration = randomDuration + 's';
        }
        
        card.addEventListener('click', function() {
            card.classList.add('clicked');
            setTimeout(function() {
                card.classList.remove('clicked');
            }, 300);
        });
    });
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease ' + (index * 0.15) + 's';
        observer.observe(card);
    });
}

/* ============================================
   PLAGUE STATS COUNTER
   ============================================ */

function initPlagueStats() {
    var statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(function(stat) {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-target'));
    var duration = 2000;
    var startTime = performance.now();
    var suffix = '';
    
    var suffixEl = element.nextElementSibling;
    if (suffixEl && suffixEl.classList && suffixEl.classList.contains('stat-suffix')) {
        suffix = suffixEl.textContent;
    }
    
    function update(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easeOutQuart = 1 - Math.pow(1 - progress, 4);
        var currentValue = Math.floor(easeOutQuart * target);
        var formatted = target >= 1000 ? currentValue.toLocaleString() : currentValue;
        element.textContent = formatted + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ============================================
   STARS
   ============================================ */

function initStars() {
    var starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    for (var i = 0; i < 50; i++) {
        var star = document.createElement('div');
        star.className = 'star';
        var size = Math.random() * 3 + 1;
        var x = Math.random() * 100;
        var y = Math.random() * 100;
        var delay = Math.random() * 3;
        var animDuration = Math.random() * 2 + 1;
        
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.animationDelay = delay + 's';
        star.style.animationDuration = animDuration + 's';
        
        starsContainer.appendChild(star);
    }
}

/* ============================================
   CLOUDS
   ============================================ */

function initClouds() {
    var cloudsContainer = document.getElementById('clouds');
    if (!cloudsContainer) return;
    
    for (var i = 0; i < 5; i++) {
        createCloud(cloudsContainer, i * 20);
    }
    
    setInterval(function() {
        if (cloudsContainer.children.length < 8) {
            createCloud(cloudsContainer, 0);
        }
    }, 8000);
}

function createCloud(container, initialDelay) {
    var cloud = document.createElement('div');
    cloud.className = 'cloud';
    
    var width = Math.random() * 100 + 60;
    var height = Math.random() * 30 + 20;
    var y = Math.random() * 40;
    var duration = Math.random() * 30 + 40;
    var opacity = Math.random() * 0.4 + 0.3;
    
    cloud.style.width = width + 'px';
    cloud.style.height = height + 'px';
    cloud.style.top = y + '%';
    cloud.style.left = '-' + width + 'px';
    cloud.style.animationDuration = duration + 's';
    cloud.style.animationDelay = initialDelay + 's';
    cloud.style.opacity = opacity;
    cloud.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(200,200,200,0.6) 100%)';
    cloud.style.borderRadius = '4px';
    cloud.style.boxShadow = '4px 4px 0 rgba(0,0,0,0.1)';
    
    container.appendChild(cloud);
    
    cloud.addEventListener('animationend', function() {
        cloud.remove();
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */

var ticking = false;

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            applyParallax();
            ticking = false;
        });
        ticking = true;
    }
});

function applyParallax() {
    var scrolled = window.pageYOffset;
    var castle = document.querySelector('.pixel-castle');
    var heroContent = document.querySelector('.hero-content');
    
    if (castle && scrolled < window.innerHeight) {
        castle.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
    }
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = 'translateY(' + (scrolled * 0.15) + 'px)';
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
}

/* ============================================
   CURSOR GLOW
   ============================================ */

function initCursorGlow() {
    var cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    var cursorStyles = document.createElement('style');
    cursorStyles.textContent = '.cursor-glow { position: fixed; width: 30px; height: 30px; background: radial-gradient(circle, rgba(201,162,39,0.3) 0%, transparent 70%); border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%, -50%); transition: opacity 0.3s ease; } body:hover .cursor-glow { opacity: 1; }';
    document.head.appendChild(cursorStyles);
}

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */

document.addEventListener('keydown', function(e) {
    if (e.key >= '1' && e.key <= '5') {
        var sections = ['chronicle', 'kingdom', 'bestiary', 'guilds', 'plague'];
        var index = parseInt(e.key) - 1;
        var section = document.getElementById(sections[index]);
        
        if (section) {
            var nav = document.querySelector('.medieval-nav');
            var navHeight = nav ? nav.offsetHeight : 0;
            window.scrollTo({
                top: section.offsetTop - navHeight,
                behavior: 'smooth'
            });
        }
    }
    
    if (e.key === 't' || e.key === 'T') {
        var bellBtn = document.getElementById('bellBtn');
        if (bellBtn) bellBtn.click();
    }
    
    if (e.key === 'n' || e.key === 'N') {
        cycleTimeForward();
    }
});

/* ============================================
   ACCESSIBILITY
   ============================================ */

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-normal', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
    
    document.querySelectorAll('*').forEach(function(el) {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

var skipLink = document.createElement('a');
skipLink.href = '#chronicle';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'sr-only';
skipLink.style.cssText = 'position:absolute;top:0;left:0;background:#c9a227;color:#2d1f0f;padding:1rem;z-index:10001;';

skipLink.addEventListener('click', function(e) {
    e.preventDefault();
    var section = document.querySelector('#chronicle');
    if (section) {
        section.focus();
        section.scrollIntoView();
    }
});

document.body.prepend(skipLink);

/* ============================================
   CONSOLE MESSAGE
   ============================================ */

console.log('%c THE DARK AGES ', 'font-size: 24px; font-weight: bold; color: #c9a227; text-shadow: 2px 2px #5d4e37;');
console.log('%c A Medieval Journey Through Time ', 'font-size: 14px; color: #d4c4a8;');
console.log('%c In the year of our Lord ' + new Date().getFullYear() + ', this chronicle was illuminated. May the knowledge preserved herein guide you through the shadows of history. - The Scriptorium ', 'font-size: 12px; font-style: italic; color: #8b7355;');