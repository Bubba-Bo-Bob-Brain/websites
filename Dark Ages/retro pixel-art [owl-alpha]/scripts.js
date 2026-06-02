/* ============================================
   CHRONICLES OF THE DARK AGES - SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});

function initializeAll() {
    createCandleParticles();
    initializeBell();
    initializeNavigation();
    initializeMapInteractions();
    initializeScrollReveal();
    initializeJournal();
    initializeVillageScene();
    initializeTypewriter();
    initializeRuneEffects();
    initializeParallax();
}

/* ============================================
   CANDLE PARTICLES
   ============================================ */

function createCandleParticles() {
    const container = document.getElementById('candle-particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
    
    setInterval(() => {
        if (container.children.length < particleCount) {
            createParticle(container);
        }
    }, 500);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'candle-particle';
    
    const startX = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 100;
    const duration = 6 + Math.random() * 6;
    const delay = Math.random() * 8;
    
    particle.style.cssText = `
        left: ${startX}%;
        --drift: ${drift}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

/* ============================================
   BELL TOWER
   ============================================ */

function initializeBell() {
    const bell = document.getElementById('bell');
    const bellInner = bell.querySelector('.bell-inner');
    
    bell.addEventListener('click', () => {
        bell.style.animation = 'none';
        bell.offsetHeight; // Trigger reflow
        bell.style.animation = 'bell-ring 0.8s ease-in-out';
        
        createBellWave();
        
        setTimeout(() => {
            bell.style.animation = '';
        }, 800);
    });
}

function createBellWave() {
    const bell = document.getElementById('bell');
    const rect = bell.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const wave = document.createElement('div');
            wave.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(212, 175, 55, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 100;
            `;
            
            document.body.appendChild(wave);
            
            wave.animate([
                { width: '20px', height: '20px', opacity: 1 },
                { width: '100px', height: '100px', opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => wave.remove();
        }, i * 200);
    }
}

/* ============================================
   NAVIGATION
   ============================================ */

function initializeNavigation() {
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 200) {
            nav.style.background = 'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%)';
        } else {
            nav.style.background = 'linear-gradient(180deg, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.8) 100%)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    highlightActiveSection();
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================
   MAP INTERACTIONS
   ============================================ */

function initializeMapInteractions() {
    const locations = document.querySelectorAll('.kingdom-map .location');
    const windmill = document.querySelector('.kingdom-map .windmill');
    
    if (windmill) {
        windmill.classList.add('spinning');
    }
    
    locations.forEach(location => {
        location.addEventListener('mouseenter', (e) => {
            const name = location.dataset.name;
            const desc = location.dataset.desc;
            
            showMapTooltip(e, name, desc);
            location.style.filter = 'drop-shadow(0 0 20px #D4AF37)';
        });
        
        location.addEventListener('mousemove', (e) => {
            moveMapTooltip(e);
        });
        
        location.addEventListener('mouseleave', () => {
            hideMapTooltip();
            location.style.filter = '';
        });
    });
}

function showMapTooltip(e, name, description) {
    let tooltip = document.getElementById('map-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'map-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(26, 26, 26, 0.95);
            border: 2px solid #D4AF37;
            padding: 15px 20px;
            max-width: 250px;
            z-index: 1000;
            pointer-events: none;
            font-family: 'MedievalSharp', cursive;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <h4 style="color: #D4AF37; font-family: 'UnifrakturMaguntia', cursive; font-size: 1.3rem; margin-bottom: 8px;">${name}</h4>
        <p style="color: #d4c4a8; font-size: 0.9rem; line-height: 1.5;">${description}</p>
    `;
    
    tooltip.style.display = 'block';
    moveMapTooltip(e);
}

function moveMapTooltip(e) {
    const tooltip = document.getElementById('map-tooltip');
    if (tooltip) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }
}

function hideMapTooltip() {
    const tooltip = document.getElementById('map-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

/* ============================================
   SCROLL REVEAL
   ============================================ */

function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.manuscript-page, .journal-entry');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'active');
                
                const texts = entry.target.querySelectorAll('.manuscript-text[data-reveal]');
                texts.forEach((text, index) => {
                    setTimeout(() => {
                        text.classList.add('revealed');
                    }, index * 300);
                });
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   JOURNAL
   ============================================ */

function initializeJournal() {
    const entries = document.querySelectorAll('.journal-entry');
    const prevBtn = document.getElementById('prev-entry');
    const nextBtn = document.getElementById('next-entry');
    
    let currentEntry = 0;
    let isTyping = false;
    
    function showEntry(index) {
        if (isTyping) return;
        
        entries.forEach((entry, i) => {
            entry.classList.remove('active');
            if (i === index) {
                entry.classList.add('active');
            }
        });
        
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === entries.length - 1;
        
        currentEntry = index;
        typeEntryText(entries[index]);
    }
    
    function typeEntryText(entry) {
        const textElement = entry.querySelector('.typewriter-text');
        if (!textElement) return;
        
        const fullText = textElement.dataset.text;
        if (!fullText) return;
        
        textElement.textContent = '';
        isTyping = true;
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < fullText.length) {
                textElement.textContent += fullText[charIndex];
                charIndex++;
            } else {
                clearInterval(typeInterval);
                isTyping = false;
            }
        }, 30);
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentEntry > 0) {
            showEntry(currentEntry - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentEntry < entries.length - 1) {
            showEntry(currentEntry + 1);
        }
    });
    
    showEntry(0);
}

/* ============================================
   VILLAGE SCENE
   ============================================ */

function initializeVillageScene() {
    const villageScene = document.getElementById('village-scene');
    const timeBtns = document.querySelectorAll('.time-btn');
    
    timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const time = btn.dataset.time;
            
            timeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            villageScene.className = 'village-scene ' + time;
            
            const overlay = document.getElementById('day-night-overlay');
            overlay.className = time;
            
            updateVillageElements(time);
        });
    });
    
    animateWindmill();
    animateCrows();
}

function updateVillageElements(time) {
    const churchWindow = document.querySelector('.church-window');
    const houseWindows = document.querySelectorAll('.house-window');
    const smoke = document.querySelectorAll('.smoke');
    
    switch(time) {
        case 'dawn':
        case 'dusk':
            smoke.forEach(s => s.style.opacity = '0.8');
            break;
        case 'night':
            smoke.forEach(s => s.style.opacity = '0.4');
            break;
        default:
            smoke.forEach(s => s.style.opacity = '0.6');
    }
}

function animateWindmill() {
    const blades = document.getElementById('windmill-blades');
    if (blades) {
        blades.style.animationPlayState = 'running';
    }
}

function animateCrows() {
    const crows = document.querySelectorAll('.crow');
    crows.forEach(crow => {
        crow.style.animationPlayState = 'running';
    });
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */

function initializeTypewriter() {
    const heroSubtitle = document.querySelector('.subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < originalText.length) {
                    heroSubtitle.textContent += originalText[i];
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, 1500);
    }
}

/* ============================================
   RUNE EFFECTS
   ============================================ */

function initializeRuneEffects() {
    const runes = document.querySelectorAll('.rune');
    
    runes.forEach(rune => {
        rune.addEventListener('mouseenter', () => {
            rune.style.transform = 'scale(1.5) rotate(180deg)';
            rune.style.opacity = '1';
            rune.style.color = '#ff6600';
        });
        
        rune.addEventListener('mouseleave', () => {
            rune.style.transform = '';
            rune.style.opacity = '';
            rune.style.color = '';
        });
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */

function initializeParallax() {
    const fogLayers = document.querySelectorAll('.fog');
    const hero = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        fogLayers.forEach((fog, index) => {
            const speed = 0.5 + (index * 0.2);
            fog.style.transform = `translateX(${(scrollY * speed * 0.1) % 50}%)`;
        });
        
        if (hero && scrollY < window.innerHeight) {
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrollY / window.innerHeight);
            }
        }
    });
}

/* ============================================
   MANUSCRIPT ILLUMINATIONS
   ============================================ */

function animateIlluminations() {
    const illuminations = document.querySelectorAll('.illumination-svg');
    
    illuminations.forEach(illumination => {
        const vine = illumination.querySelector('.vine');
        if (vine) {
            vine.style.strokeDasharray = '200';
            vine.style.strokeDashoffset = '200';
            vine.style.transition = 'stroke-dashoffset 2s ease';
            
            setTimeout(() => {
                vine.style.strokeDashoffset = '0';
            }, 500);
        }
    });
}

/* ============================================
   INTERACTIVE ELEMENTS
   ============================================ */

function initializeInteractiveElements() {
    const mapCorners = document.querySelectorAll('.map-corner');
    mapCorners.forEach(corner => {
        corner.addEventListener('mouseenter', () => {
            corner.style.borderColor = '#ff6600';
            corner.style.boxShadow = '0 0 15px #D4AF37';
        });
        
        corner.addEventListener('mouseleave', () => {
            corner.style.borderColor = '';
            corner.style.boxShadow = '';
        });
    });
    
    const ornamentalBorders = document.querySelectorAll('.ornamental-border');
    ornamentalBorders.forEach(border => {
        border.addEventListener('mouseenter', () => {
            const ornaments = border.querySelectorAll('.ornament');
            ornaments.forEach(ornament => {
                ornament.style.transform = 'scale(1.2) rotate(10deg)';
                ornament.style.transition = 'transform 0.3s ease';
            });
        });
        
        border.addEventListener('mouseleave', () => {
            const ornaments = border.querySelectorAll('.ornament');
            ornaments.forEach(ornament => {
                ornament.style.transform = '';
            });
        });
    });
}

/* ============================================
   VILLAGER MOVEMENT
   ============================================ */

function animateVillagers() {
    const villagers = document.querySelectorAll('.villager');
    
    villagers.forEach(villager => {
        let direction = 1;
        let pos = 0;
        
        setInterval(() => {
            pos += direction * 0.5;
            
            if (pos > 100 || pos < 0) {
                direction *= -1;
                villager.style.transform = direction > 0 ? 'scaleX(1)' : 'scaleX(-1)';
            }
            
            villager.style.left = pos + '%';
        }, 100);
    });
}

/* ============================================
   SOUND EFFECTS (Visual Representation)
   ============================================ */

function createVisualSoundEffect(x, y) {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 1000;
    `;
    
    for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            border: 2px solid rgba(212, 175, 55, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
        `;
        
        container.appendChild(ring);
        
        ring.animate([
            { width: '10px', height: '10px', opacity: 1 },
            { width: '50px', height: '50px', opacity: 0 }
        ], {
            duration: 600,
            delay: i * 100,
            easing: 'ease-out'
        });
    }
    
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 1000);
}

/* ============================================
   ENTRANCE ANIMATIONS
   ============================================ */

function playEntranceAnimation() {
    const hero = document.querySelector('.hero-section');
    const title = document.querySelector('.main-title');
    const bell = document.querySelector('.bell-tower');
    
    hero.style.opacity = '0';
    hero.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        hero.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        bell.style.animation = 'bell-ring 1s ease-in-out';
        createBellWave();
    }, 2000);
}

/* ============================================
   SEASONAL EFFECTS
   ============================================ */

function createSnowEffect() {
    const container = document.getElementById('candle-particles');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '&#10052;';
            snowflake.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: -20px;
                color: rgba(255, 255, 255, 0.7);
                font-size: ${10 + Math.random() * 10}px;
                pointer-events: none;
                z-index: 10;
                animation: snowfall ${5 + Math.random() * 5}s linear forwards;
            `;
            
            document.body.appendChild(snowflake);
            
            setTimeout(() => snowflake.remove(), 10000);
        }, i * 200);
    }
}

const snowStyle = document.createElement('style');
snowStyle.textContent = `
    @keyframes snowfall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(snowStyle);

/* ============================================
   INITIALIZATION COMPLETE
   ============================================ */

setTimeout(() => {
    animateIlluminations();
    initializeInteractiveElements();
    createSnowEffect();
}, 500);

setInterval(createSnowEffect, 15000);

console.log('%c Chronicles of the Dark Ages ', 'background: #1a1a1a; color: #D4AF37; font-size: 20px; padding: 10px;');
console.log('%c "In the year of our Lord, when shadows grew long..." ', 'color: #d4c4a8; font-style: italic;');