document.addEventListener('DOMContentLoaded', function() {
    initDayNightCycle();
    initDeathCounter();
    initBellTower();
    initTooltips();
    initStars();
    initCompass();
    initChimes();
    initScrollEffects();
    initFooterYear();
    initFloatingParticles();
    initSmoothScroll();
    initKeyboardControls();
    initParallax();
    initConsoleMessage();
});

function initDayNightCycle() {
    var cycleData = [
        { name: 'Dawn', icon: '🌅', start: 0, end: 0.2, className: 'dawn' },
        { name: 'Day', icon: '☀️', start: 0.2, end: 0.45, className: 'day' },
        { name: 'Afternoon', icon: '🌤️', start: 0.45, end: 0.65, className: 'day' },
        { name: 'Dusk', icon: '🌇', start: 0.65, end: 0.8, className: 'dusk' },
        { name: 'Night', icon: '🌙', start: 0.8, end: 1, className: 'night' }
    ];
    var timeOfDay = 0;
    var cycleDuration = 60000;
    var cycleProgress = document.getElementById('cycleProgress');
    var cycleLabel = document.getElementById('cycleLabel');
    var cycleIcon = document.querySelector('.cycle-icon');
    var heroSection = document.querySelector('.parchment-bg');
    var heroMoon = document.getElementById('heroMoon');
    
    function updateCycle() {
        timeOfDay += 1 / (cycleDuration / 50);
        if (timeOfDay >= 1) timeOfDay = 0;
        cycleProgress.style.width = (timeOfDay * 100) + '%';
        
        var currentPhase = null;
        for (var i = 0; i < cycleData.length; i++) {
            if (timeOfDay >= cycleData[i].start && timeOfDay < cycleData[i].end) {
                currentPhase = cycleData[i];
                break;
            }
        }
        
        if (currentPhase) {
            cycleLabel.textContent = currentPhase.name;
            cycleIcon.textContent = currentPhase.icon;
            heroSection.className = 'parchment-bg ' + currentPhase.className;
            heroMoon.style.opacity = (currentPhase.className === 'night' || currentPhase.className === 'dusk') ? '1' : '0';
        }
    }
    
    setInterval(updateCycle, 50);
    updateCycle();
}

function initDeathCounter() {
    var counter = document.getElementById('deathCounter');
    if (!counter) return;
    
    var targetDeaths = 75000000;
    var currentDeaths = 0;
    var isCounting = false;
    var plagueSection = document.querySelector('.plague-section');
    if (!plagueSection) return;
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !isCounting) {
                isCounting = true;
                animateCounter();
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(plagueSection);
    
    function animateCounter() {
        var increment = targetDeaths / 200;
        
        function step() {
            if (currentDeaths < targetDeaths) {
                currentDeaths += increment + Math.random() * increment * 0.5;
                if (currentDeaths > targetDeaths) currentDeaths = targetDeaths;
                counter.textContent = formatNumber(Math.floor(currentDeaths));
                requestAnimationFrame(step);
            }
        }
        step();
    }
    
    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
        return num.toString();
    }
}

function initBellTower() {
    var bellButton = document.getElementById('ringBell');
    var bell = document.getElementById('bell');
    var soundWave = document.getElementById('soundWave');
    var bellClapper = document.getElementById('bellClapper');
    var isRinging = false;
    
    if (!bellButton || !bell) return;
    
    bellButton.addEventListener('click', ringBell);
    bell.addEventListener('click', ringBell);
    
    function ringBell() {
        if (isRinging) return;
        isRinging = true;
        
        bell.classList.add('ringing');
        soundWave.classList.add('active');
        
        function swingClapper() {
            var angle = 0;
            var maxAngle = 25;
            var speed = 0.3;
            var direction = 1;
            
            var swing = setInterval(function() {
                angle += speed * direction;
                if (Math.abs(angle) >= maxAngle) direction *= -1;
                bellClapper.style.transform = 'translate(-50%, 0) rotate(' + angle + 'deg)';
            }, 16);
            
            setTimeout(function() {
                clearInterval(swing);
                bellClapper.style.transform = 'translate(-50%, 0) rotate(0deg)';
            }, 800);
        }
        
        swingClapper();
        
        setTimeout(function() {
            bell.classList.remove('ringing');
            soundWave.classList.remove('active');
            isRinging = false;
        }, 2000);
    }
}

function initTooltips() {
    var tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    var mapElements = document.querySelectorAll('.map-element[data-name]');
    mapElements.forEach(function(element) {
        element.addEventListener('mouseenter', function(e) {
            var name = element.getAttribute('data-name');
            tooltip.textContent = name;
            tooltip.classList.add('visible');
        });
        
        element.addEventListener('mousemove', function(e) {
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY + 15) + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
        });
    });
}

function initStars() {
    var starsContainer = document.getElementById('heroStars');
    if (!starsContainer) return;
    
    var starCount = 50;
    for (var i = 0; i < starCount; i++) {
        var star = document.createElement('div');
        star.className = 'star';
        star.style.left = (Math.random() * 100) + '%';
        star.style.top = (Math.random() * 100) + '%';
        star.style.animationDelay = (Math.random() * 2) + 's';
        star.style.width = (Math.random() * 2 + 1) + 'px';
        star.style.height = star.style.width;
        starsContainer.appendChild(star);
    }
}

function initCompass() {
    var compassNeedle = document.getElementById('compassNeedle');
    if (!compassNeedle) return;
    
    var angle = Math.random() * 360;
    
    setInterval(function() {
        angle += (Math.random() - 0.5) * 20;
        compassNeedle.style.transform = 'translate(-50%, 0) rotate(' + angle + 'deg)';
    }, 2000);
}

function initChimes() {
    var chimes = document.querySelectorAll('.chime');
    chimes.forEach(function(chime) {
        chime.addEventListener('click', function() {
            chimes.forEach(function(c) {
                c.classList.remove('active');
            });
            
            chime.classList.add('active');
            
            var bell = document.getElementById('bell');
            var soundWave = document.getElementById('soundWave');
            
            if (bell) bell.classList.add('ringing');
            if (soundWave) soundWave.classList.add('active');
            
            setTimeout(function() {
                if (bell) bell.classList.remove('ringing');
                if (soundWave) soundWave.classList.remove('active');
            }, 500);
            
            setTimeout(function() {
                chime.classList.remove('active');
            }, 2000);
        });
    });
}

function initScrollEffects() {
    var sections = document.querySelectorAll('.content-section');
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    document.addEventListener('scroll', function() {
        sections.forEach(function(section) {
            var rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
}

function initFooterYear() {
    var yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function initFloatingParticles() {
    var container = document.querySelector('.medieval-container');
    if (!container) return;
    
    var style = document.createElement('style');
    style.textContent = '@keyframes float { 0% { transform: translateY(100vh) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }';
    document.head.appendChild(style);
    
    var particleCount = 20;
    for (var i = 0; i < particleCount; i++) {
        var particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.position = 'fixed';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(212, 160, 23, ' + (Math.random() * 0.5 + 0.1) + ')';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9996';
        particle.style.left = (Math.random() * 100) + '%';
        particle.style.top = (Math.random() * 100) + '%';
        particle.style.animation = 'float ' + (Math.random() * 10 + 10) + 's linear infinite';
        container.appendChild(particle);
    }
}

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
}

function initKeyboardControls() {
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            var bellButton = document.getElementById('ringBell');
            if (bellButton) bellButton.click();
        }
    });
}

function initParallax() {
    window.addEventListener('scroll', function() {
        var hero = document.querySelector('.hero-section');
        var scrollY = window.pageYOffset;
        if (hero) {
            hero.style.backgroundPositionY = (scrollY * 0.5) + 'px';
        }
    });
}

function initConsoleMessage() {
    var facts = [
        "The Dark Ages spanned from 476 AD to 1492 AD",
        "The Black Death killed 30-60% of Europe's population",
        "Monks preserved ancient knowledge in monasteries",
        "Illuminated manuscripts could take years to create",
        "Church bells were used to mark time and warn of danger",
        "Castles were built to protect against invasions",
        "The feudal system governed medieval society",
        "Knights followed a strict code of chivalry"
    ];
    
    console.log('%c⚔️ THE DARK AGES ⚔️', 'font-size: 20px; color: #d4a017; font-family: serif;');
    console.log('%c' + facts[Math.floor(Math.random() * facts.length)], 'color: #d4c4a8; font-style: italic;');
}