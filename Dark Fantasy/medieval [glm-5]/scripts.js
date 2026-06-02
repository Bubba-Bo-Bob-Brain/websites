document.addEventListener('DOMContentLoaded', function() {
    initEmberParticles();
    initTorchFlicker();
    initProphecyWhisper();
    initCreatureCards();
    initMapInteractions();
    initTomeBook();
    initScrollAnimations();
    initSmoothScroll();
    initTorchToggle();
    initParallaxEffect();
    initMysticalCursor();
    initAmbientSounds();
    initTypewriterEffect();
    
    console.log('%c☽ The Lost Grimoire ☽', 'color: #c5a028; font-size: 24px; font-family: serif; text-shadow: 2px 2px #3a2518;');
    console.log('%cYou have opened the forbidden tome...', 'color: #8b0000; font-style: italic;');
});

function initEmberParticles() {
    const container = document.getElementById('emberParticles');
    if (!container) return;
    
    const emberCount = 25;
    for (let i = 0; i < emberCount; i++) {
        createEmber(container);
    }
}

function createEmber(container) {
    const ember = document.createElement('div');
    ember.className = 'ember';
    ember.style.left = Math.random() * 100 + '%';
    ember.style.animationDuration = (Math.random() * 8 + 6) + 's';
    ember.style.animationDelay = (Math.random() * 10) + 's';
    ember.style.width = (Math.random() * 4 + 2) + 'px';
    ember.style.height = ember.style.width;
    ember.style.opacity = Math.random() * 0.5 + 0.3;
    container.appendChild(ember);
    
    ember.addEventListener('animationiteration', function() {
        ember.style.left = Math.random() * 100 + '%';
    });
}

function initTorchFlicker() {
    const torchGlows = document.querySelectorAll('.torch-glow');
    const flames = document.querySelectorAll('.flame');
    
    setInterval(function() {
        torchGlows.forEach(function(glow) {
            const randomOpacity = 0.25 + Math.random() * 0.2;
            const randomScale = 0.95 + Math.random() * 0.1;
            glow.style.opacity = randomOpacity;
            glow.style.transform = 'scale(' + randomScale + ')';
        });
        
        flames.forEach(function(flame) {
            const randomY = Math.random() * 3;
            const randomRotate = -3 + Math.random() * 6;
            flame.style.transform = 'translateY(' + randomY + 'px) rotate(' + randomRotate + 'deg)';
        });
    }, 100);
}

function initProphecyWhisper() {
    const whisper = document.querySelector('.prophecy-whisper');
    if (!whisper) return;
    
    let isVisible = false;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0.5 });
    
    observer.observe(whisper);
    
    setInterval(function() {
        if (isVisible) {
            const randomOpacity = 0.5 + Math.random() * 0.5;
            whisper.style.opacity = randomOpacity;
        }
    }, 2000);
}

function initCreatureCards() {
    const cards = document.querySelectorAll('.creature-card');
    
    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const creatureType = card.dataset.creature;
            playCreatureSound(creatureType);
        });
        
        card.addEventListener('touchstart', function() {
            const inner = card.querySelector('.card-inner');
            if (inner.style.transform === 'rotateY(180deg)') {
                inner.style.transform = 'rotateY(0deg)';
            } else {
                inner.style.transform = 'rotateY(180deg)';
            }
        });
    });
}

function playCreatureSound(creatureType) {
    const soundMap = {
        dragon: 'roar',
        shade: 'whisper',
        wraith: 'moan',
        basilisk: 'hiss'
    };
    console.log('Playing sound for:', soundMap[creatureType] || 'unknown');
}

function initMapInteractions() {
    const locations = document.querySelectorAll('.map-location');
    const infoPanel = document.getElementById('locationInfo');
    
    const locationData = {
        citadel: {
            name: 'Shadowkeep Citadel',
            description: 'The ancient fortress of the Dark Lords, where the Grimoire was first bound. Its walls have witnessed countless battles and unspeakable rituals.',
            danger: 'Extreme',
            treasure: 'Legendary'
        },
        forest: {
            name: 'Whisperwood Forest',
            description: 'An enchanted woodland where the trees themselves are said to whisper secrets of the dead. Many travelers have entered, but few have returned.',
            danger: 'High',
            treasure: 'Rare'
        },
        mountain: {
            name: 'Crimson Peaks',
            description: 'The volcanic mountain range where the last of the great wyrms slumber. Their fire forged the very pages of the Grimoire.',
            danger: 'Extreme',
            treasure: 'Mythical'
        },
        swamp: {
            name: 'Blackmire Swamp',
            description: 'A treacherous marshland filled with poisonous creatures and lost souls. The waters are said to show visions of possible futures.',
            danger: 'Moderate',
            treasure: 'Uncommon'
        },
        ruins: {
            name: 'Forgotten Ruins',
            description: 'The remnants of a once-great civilization that dared to challenge the darkness. Their hubris led to their complete annihilation.',
            danger: 'High',
            treasure: 'Very Rare'
        }
    };
    
    locations.forEach(function(location) {
        location.addEventListener('mouseenter', function() {
            const key = location.dataset.location;
            const data = locationData[key];
            
            if (data && infoPanel) {
                infoPanel.innerHTML = '\
                    <h4 style="font-family: \'Cinzel Decorative\', serif; color: var(--color-gold); margin-bottom: 0.5rem;">' + data.name + '</h4>\
                    <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">' + data.description + '</p>\
                    <div style="display: flex; gap: 1rem; font-size: 0.85rem;">\
                        <span><strong style="color: var(--color-blood);">Danger:</strong> ' + data.danger + '</span>\
                        <span><strong style="color: var(--color-gold-dark);">Treasure:</strong> ' + data.treasure + '</span>\
                    </div>\
                ';
                infoPanel.style.opacity = '1';
            }
        });
        
        location.addEventListener('mouseleave', function() {
            if (infoPanel) {
                infoPanel.innerHTML = '<p class="info-placeholder">Hover over a location to learn its secrets...</p>';
            }
        });
    });
}

function initTomeBook() {
    const openBtn = document.getElementById('openTome');
    const frontCover = document.querySelector('.front-cover');
    const bookPages = document.getElementById('bookPages');
    const eyePupil = document.querySelector('.eye-pupil');
    
    if (!openBtn || !frontCover) return;
    
    let isOpen = false;
    
    openBtn.addEventListener('click', function() {
        if (!isOpen) {
            frontCover.classList.add('open');
            openBtn.querySelector('.btn-label').textContent = 'Close the Grimoire';
            isOpen = true;
            
            setTimeout(function() {
                if (bookPages) {
                    bookPages.style.boxShadow = 'inset 0 0 30px rgba(0, 0, 0, 0.3)';
                }
            }, 500);
        } else {
            frontCover.classList.remove('open');
            openBtn.querySelector('.btn-label').textContent = 'Open the Grimoire';
            isOpen = false;
            
            if (bookPages) {
                bookPages.style.boxShadow = 'none';
            }
        }
    });
    
    if (eyePupil) {
        document.addEventListener('mousemove', function(e) {
            if (!isOpen) {
                const rect = eyePupil.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;
                
                const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
                const distance = 3;
                const moveX = Math.cos(angle) * distance;
                const moveY = Math.sin(angle) * distance;
                
                eyePupil.style.transform = 'translate(calc(-50% + ' + moveX + 'px), calc(-50% + ' + moveY + 'px))';
            }
        });
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.prophecy-scroll, .creature-card, .map-frame, .map-description, .tome-book');
    
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initTorchToggle() {
    const torchBtn = document.getElementById('torchToggle');
    const torchGlows = document.querySelectorAll('.torch-glow, .flame-container');
    
    if (!torchBtn) return;
    
    let torchesOn = true;
    
    torchBtn.addEventListener('click', function() {
        torchesOn = !torchesOn;
        
        torchGlows.forEach(function(torch) {
            torch.style.opacity = torchesOn ? '1' : '0';
            torch.style.transition = 'opacity 0.5s ease';
        });
        
        const icon = torchBtn.querySelector('.torch-icon');
        if (icon) {
            icon.style.filter = torchesOn ? 'drop-shadow(0 0 5px #ff6a00)' : 'none';
        }
    });
}

function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (!hero || !heroContent) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxValue = scrolled * 0.3;
            heroContent.style.transform = 'translateY(' + parallaxValue + 'px)';
            heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
        }
    });
}

function initMysticalCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'mystical-cursor';
    cursor.style.cssText = '\
        position: fixed;\
        width: 20px;\
        height: 20px;\
        border: 1px solid rgba(197, 160, 40, 0.5);\
        border-radius: 50%;\
        pointer-events: none;\
        z-index: 9999;\
        transition: transform 0.1s ease, opacity 0.3s ease;\
        opacity: 0;\
    ';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.style.cssText = '\
        position: fixed;\
        width: 4px;\
        height: 4px;\
        background: #c5a028;\
        border-radius: 50%;\
        pointer-events: none;\
        z-index: 10000;\
        transition: transform 0.05s ease;\
        opacity: 0;\
    ';
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursorDot.style.left = e.clientX - 2 + 'px';
        cursorDot.style.top = e.clientY - 2 + 'px';
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .creature-card, .map-location');
    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = 'rgba(197, 160, 40, 0.8)';
        });
        
        el.addEventListener('mouseleave', function() {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'rgba(197, 160, 40, 0.5)';
        });
    });
}

function initAmbientSounds() {
    let audioContext = null;
    
    const initAudio = function() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    };
    
    document.addEventListener('click', function() {
        initAudio();
    }, { once: true });
}

function initTypewriterEffect() {
    const prophecyTexts = document.querySelectorAll('.prophecy-text');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease forwards';
            }
        });
    }, { threshold: 0.5 });
    
    prophecyTexts.forEach(function(text) {
        text.style.opacity = '0';
        observer.observe(text);
    });
}