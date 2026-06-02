document.addEventListener('DOMContentLoaded', function() {
    initializeDustParticles();
    initializeTumbleweed();
    initializeRevolverNav();
    initializeTypewriter();
    initializePosterEffects();
    initializeScrollEffects();
});

function initializeDustParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createDustParticle(container);
    }
    
    setInterval(() => {
        if (container.children.length < particleCount) {
            createDustParticle(container);
        }
    }, 2000);
}

function createDustParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'dust-particle';
    
    const startX = Math.random() * window.innerWidth;
    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    
    particle.style.left = startX + 'px';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    container.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

function initializeTumbleweed() {
    const tumbleweed = document.getElementById('tumbleweed');
    
    function startTumble() {
        tumbleweed.style.animation = 'none';
        tumbleweed.offsetHeight;
        tumbleweed.style.animation = 'tumbleweed-roll 20s linear forwards';
    }
    
    startTumble();
    
    setInterval(startTumble, 25000);
    
    tumbleweed.addEventListener('animationend', startTumble);
}

function initializeRevolverNav() {
    const chambers = document.querySelectorAll('.chamber');
    const cylinder = document.getElementById('cylinder');
    const sections = document.querySelectorAll('.board-section');
    let currentRotation = 0;
    let currentSection = 0;
    
    chambers.forEach((chamber, index) => {
        chamber.addEventListener('click', () => {
            rotateToSection(index);
        });
    });
    
    function rotateToSection(index) {
        const rotationPerSection = 360 / chambers.length;
        const targetRotation = -index * rotationPerSection;
        const rotationDiff = targetRotation - currentRotation;
        
        currentRotation = targetRotation;
        cylinder.style.transform = `rotate(${currentRotation}deg)`;
        
        chambers.forEach((ch, i) => {
            ch.classList.toggle('active', i === index);
        });
        
        sections.forEach((section, i) => {
            section.classList.toggle('active', i === index);
        });
        
        playCylinderClick();
        
        const targetSection = sections[index];
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function playCylinderClick() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 150;
        oscillator.type = 'square';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollDirection = scrollY > lastScrollY ? 1 : -1;
        lastScrollY = scrollY;
        
        const sectionElements = Array.from(sections);
        const viewportCenter = window.innerHeight / 2;
        
        sectionElements.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            
            if (Math.abs(sectionCenter - viewportCenter) < 200) {
                if (currentSection !== index) {
                    currentSection = index;
                    rotateToSection(index);
                }
            }
        });
    });
    
    rotateToSection(0);
}

function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriterText');
    const messages = [
        "All citizens are advised to remain vigilant...",
        "Report suspicious activity to the Sheriff's office immediately...",
        "Bounty hunters must register before conducting operations...",
        "The territory remains under heightened alert...",
        "Justice will be served. The law always prevails...",
        "Stay safe, Silver Creek. We're watching over you..."
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseCounter = 0;
    
    function type() {
        const currentMessage = messages[messageIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
                pauseCounter = 0;
            }
        } else {
            typewriterElement.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentMessage.length) {
                pauseCounter++;
                if (pauseCounter > 30) {
                    isDeleting = true;
                }
            }
        }
        
        const speed = isDeleting ? 30 : (charIndex % 3 === 0 ? 80 : 50);
        setTimeout(type, speed);
    }
    
    setTimeout(type, 1000);
}

function initializePosterEffects() {
    const posters = document.querySelectorAll('.wanted-poster');
    
    posters.forEach(poster => {
        poster.addEventListener('mouseenter', () => {
            addWindEffect(poster);
        });
        
        poster.addEventListener('mouseleave', () => {
            removeWindEffect(poster);
        });
        
        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            const paper = poster.querySelector('.poster-paper');
            paper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        poster.addEventListener('mouseleave', () => {
            const paper = poster.querySelector('.poster-paper');
            paper.style.transform = '';
        });
    });
}

function addWindEffect(poster) {
    const paper = poster.querySelector('.poster-paper');
    paper.style.transition = 'transform 0.1s ease';
    
    let windInterval = setInterval(() => {
        const randomX = (Math.random() - 0.5) * 2;
        const randomY = (Math.random() - 0.5) * 2;
        paper.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg) translateZ(20px)`;
    }, 100);
    
    poster.dataset.windInterval = windInterval;
}

function removeWindEffect(poster) {
    const interval = poster.dataset.windInterval;
    if (interval) {
        clearInterval(parseInt(interval));
    }
    
    const paper = poster.querySelector('.poster-paper');
    paper.style.transition = 'transform 0.5s ease';
    paper.style.transform = '';
}

function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.wanted-poster, .tier-card, .profile-card, .dispatch-entry, .dangerous-item, .captured-item').forEach(el => {
        observer.observe(el);
    });
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrolled / maxScroll;
        
        const dustOverlay = document.querySelector('.dust-overlay');
        if (dustOverlay) {
            dustOverlay.style.opacity = 0.5 + (scrollPercent * 0.3);
        }
    });
}

function createGunshotEffect(x, y) {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(255,200,100,0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: flash-fade 0.3s ease-out forwards;
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 300);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes flash-fade {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
`;
document.head.appendChild(style);

document.addEventListener('click', (e) => {
    if (e.target.closest('.chamber')) {
        createGunshotEffect(e.clientX, e.clientY);
    }
});

function addPaperCreaseEffect() {
    const papers = document.querySelectorAll('.poster-paper');
    
    papers.forEach(paper => {
        const crease = document.createElement('div');
        crease.style.cssText = `
            position: absolute;
            top: 0;
            left: 50%;
            width: 1px;
            height: 100%;
            background: linear-gradient(180deg, 
                transparent 0%, 
                rgba(139, 105, 20, 0.1) 20%, 
                rgba(139, 105, 20, 0.2) 50%, 
                rgba(139, 105, 20, 0.1) 80%, 
                transparent 100%
            );
            pointer-events: none;
        `;
        paper.appendChild(crease);
    });
}

addPaperCreaseEffect();

function initializeParallaxEffect() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.5;
        
        if (header && scrolled < window.innerHeight) {
            header.style.backgroundPosition = `center ${rate}px`;
        }
    });
}

initializeParallaxEffect();

function addDynamicShadows() {
    const posters = document.querySelectorAll('.wanted-poster');
    
    posters.forEach(poster => {
        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const shadowX = (x - centerX) / 10;
            const shadowY = (y - centerY) / 10;
            
            const paper = poster.querySelector('.poster-paper');
            paper.style.boxShadow = `
                ${shadowX}px ${shadowY}px 30px rgba(29, 18, 10, 0.4),
                inset 0 0 100px rgba(139, 105, 20, 0.1)
            `;
        });
        
        poster.addEventListener('mouseleave', () => {
            const paper = poster.querySelector('.poster-paper');
            paper.style.boxShadow = `
                0 10px 30px rgba(29, 18, 10, 0.4),
                inset 0 0 100px rgba(139, 105, 20, 0.1)
            `;
        });
    });
}

addDynamicShadows();

function initializeRewardBadgeAnimation() {
    const badges = document.querySelectorAll('.reward-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'scale(1.05) rotate(-2deg)';
            badge.style.transition = 'transform 0.3s ease';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = '';
        });
    });
}

initializeRewardBadgeAnimation();

function addBulletHoles() {
    const board = document.querySelector('.content-area');
    
    for (let i = 0; i < 5; i++) {
        const bulletHole = document.createElement('div');
        const size = Math.random() * 10 + 5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        bulletHole.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle at 30% 30%, #1a0f0a, #3d2817);
            border-radius: 50%;
            box-shadow: 
                inset 2px 2px 4px rgba(0,0,0,0.8),
                0 0 0 2px rgba(61, 40, 23, 0.3);
            pointer-events: none;
            opacity: 0.6;
            z-index: 1;
        `;
        
        board.style.position = 'relative';
        board.appendChild(bulletHole);
    }
}

setTimeout(addBulletHoles, 1000);

function initializeDangerPulse() {
    const dangerItems = document.querySelectorAll('.dangerous-item.extreme');
    
    setInterval(() => {
        dangerItems.forEach(item => {
            item.style.animation = 'none';
            item.offsetHeight;
            item.style.animation = 'danger-pulse 0.5s ease';
        });
    }, 3000);
}

const dangerStyle = document.createElement('style');
dangerStyle.textContent = `
    @keyframes danger-pulse {
        0%, 100% { box-shadow: 0 10px 30px rgba(29, 18, 10, 0.4); }
        50% { box-shadow: 0 10px 40px rgba(139, 0, 0, 0.6); }
    }
`;
document.head.appendChild(dangerStyle);

initializeDangerPulse();

console.log('%c🌵 Silver Creek Territory Bounty Board 🌵', 'font-size: 20px; font-family: serif; color: #c5a03f;');
console.log('%c"Justice never sleeps..."', 'font-style: italic; color: #8b6914;');