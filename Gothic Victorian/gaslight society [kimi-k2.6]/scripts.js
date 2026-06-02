// === THE OBSIDIAN VEIL ===
// Members' Directory — Interactive Behaviors

document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeCircleFiltering();
    initializeInvitationEnvelope();
    initializeDaguerreotypeEffects();
    initializeAtmosphericEffects();
    initializeParallaxScroll();
    initializeCardReveal();
});

// === GRANDFATHER CLOCK ===
function initializeClock() {
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    
    if (!hourHand || !minuteHand || !secondHand) {
        return;
    }
    
    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();
        
        const smoothSeconds = seconds + milliseconds / 1000;
        const smoothMinutes = minutes + smoothSeconds / 60;
        const smoothHours = hours + smoothMinutes / 60;
        
        const secondDegrees = smoothSeconds * 6;
        const minuteDegrees = smoothMinutes * 6;
        const hourDegrees = smoothHours * 30;
        
        secondHand.style.transform = 'translateX(-50%) rotate(' + secondDegrees + 'deg)';
        minuteHand.style.transform = 'translateX(-50%) rotate(' + minuteDegrees + 'deg)';
        hourHand.style.transform = 'translateX(-50%) rotate(' + hourDegrees + 'deg)';
    }
    
    updateClock();
    setInterval(updateClock, 50);
}

// === CIRCLE FILTERING ===
function initializeCircleFiltering() {
    const circleItems = document.querySelectorAll('.circle-item');
    const memberCards = document.querySelectorAll('.member-card');
    
    if (circleItems.length === 0 || memberCards.length === 0) {
        return;
    }
    
    circleItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const selectedCircle = this.dataset.circle;
            
            circleItems.forEach(function(ci) {
                ci.classList.remove('active');
            });
            this.classList.add('active');
            
            memberCards.forEach(function(card, index) {
                const cardCircle = card.dataset.circle;
                const shouldShow = selectedCircle === 'all' || cardCircle === selectedCircle;
                
                if (shouldShow) {
                    card.style.display = '';
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'cardReveal 0.6s cubic-bezier(0.23, 1, 0.32, 1) ' + (index * 0.08) + 's both';
                } else {
                    card.style.display = 'none';
                }
            });
            
            updateAtmosphereForCircle(selectedCircle);
        });
    });
}

function updateAtmosphereForCircle(circle) {
    const atmosphereOverlay = document.querySelector('.atmosphere-overlay');
    if (!atmosphereOverlay) {
        return;
    }
    
    const circleColors = {
        all: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(10, 5, 10, 0.4) 70%, rgba(5, 5, 8, 0.8) 100%)',
        primum: 'radial-gradient(circle at 50% 50%, rgba(212, 168, 83, 0.05) 0%, transparent 50%, rgba(10, 5, 10, 0.6) 100%)',
        secundum: 'radial-gradient(circle at 50% 50%, rgba(138, 106, 58, 0.04) 0%, transparent 50%, rgba(10, 5, 10, 0.6) 100%)',
        tertium: 'radial-gradient(circle at 50% 50%, rgba(106, 122, 138, 0.04) 0%, transparent 50%, rgba(10, 5, 10, 0.6) 100%)',
        quartum: 'radial-gradient(circle at 50% 50%, rgba(74, 10, 10, 0.05) 0%, transparent 50%, rgba(10, 5, 10, 0.6) 100%)',
        quintum: 'radial-gradient(circle at 50% 50%, rgba(20, 16, 10, 0.06) 0%, transparent 50%, rgba(10, 5, 10, 0.6) 100%)'
    };
    
    atmosphereOverlay.style.transition = 'background 1.2s cubic-bezier(0.23, 1, 0.32, 1)';
    atmosphereOverlay.style.background = circleColors[circle] || circleColors.all;
}

// === INVITATION ENVELOPE ===
function initializeInvitationEnvelope() {
    const envelope = document.getElementById('invitationEnvelope');
    const closeBtn = document.getElementById('letterClose');
    
    if (!envelope) {
        return;
    }
    
    const hasSeenEnvelope = sessionStorage.getItem('obsidianEnvelopeSeen');
    if (!hasSeenEnvelope) {
        setTimeout(function() {
            envelope.classList.add('active');
            sessionStorage.setItem('obsidianEnvelopeSeen', 'true');
        }, 8000);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            envelope.classList.remove('active');
        });
    }
    
    envelope.addEventListener('click', function(e) {
        if (e.target === envelope) {
            envelope.classList.remove('active');
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && envelope.classList.contains('active')) {
            envelope.classList.remove('active');
        }
    });
}

// === DAGUERREOTYPE EFFECTS ===
function initializeDaguerreotypeEffects() {
    const cards = document.querySelectorAll('.member-card');
    
    cards.forEach(function(card) {
        const portrait = card.querySelector('.portrait-container');
        const overlay = card.querySelector('.daguerreotype-overlay');
        const tarnish = card.querySelector('.tarnish-effect');
        
        if (!portrait) {
            return;
        }
        
        card.addEventListener('mouseenter', function() {
            if (overlay) {
                overlay.style.transition = 'background-position 0.8s ease';
                overlay.style.backgroundPosition = '100% 100%';
            }
            
            if (tarnish) {
                tarnish.style.opacity = '0.3';
                tarnish.style.transition = 'opacity 0.6s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (overlay) {
                overlay.style.backgroundPosition = '0% 0%';
            }
            
            if (tarnish) {
                tarnish.style.opacity = '0.6';
            }
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const portraitInner = card.querySelector('.daguerreotype');
            if (portraitInner) {
                portraitInner.style.transform = 'perspective(500px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg)';
                portraitInner.style.transition = 'transform 0.3s ease-out';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const portraitInner = card.querySelector('.daguerreotype');
            if (portraitInner) {
                portraitInner.style.transform = 'perspective(500px) rotateY(0deg) rotateX(0deg)';
                portraitInner.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            }
        });
    });
}

// === ATMOSPHERIC EFFECTS ===
function initializeAtmosphericEffects() {
    createDustMotes();
    createFloatingEmbers();
    initializeGaslightFlicker();
}

function createDustMotes() {
    const container = document.querySelector('.atmosphere-overlay');
    if (!container) {
        return;
    }
    
    const moteCount = 25;
    
    for (let i = 0; i < moteCount; i++) {
        const mote = document.createElement('div');
        mote.className = 'dust-mote';
        const size = Math.random() * 3 + 1;
        mote.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;background:rgba(212,168,83,' + (Math.random() * 0.15 + 0.05) + ');border-radius:50%;pointer-events:none;left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;animation:moteFloat ' + (Math.random() * 20 + 15) + 's ease-in-out infinite;animation-delay:' + (Math.random() * 10) + 's;';
        container.appendChild(mote);
    }
    
    const style = document.createElement('style');
    style.textContent = '@keyframes moteFloat {0%,100%{transform:translate(0,0) scale(1);opacity:0.3;}25%{transform:translate(' + (Math.random() * 30 - 15) + 'px,' + (Math.random() * -30 - 10) + 'px) scale(1.2);opacity:0.6;}50%{transform:translate(' + (Math.random() * 20 - 10) + 'px,' + (Math.random() * -20 - 20) + 'px) scale(0.8);opacity:0.2;}75%{transform:translate(' + (Math.random() * 30 - 15) + 'px,' + (Math.random() * -10 + 10) + 'px) scale(1.1);opacity:0.5;}}';
    document.head.appendChild(style);
}

function createFloatingEmbers() {
    const style = document.createElement('style');
    style.textContent = '.ember{position:fixed;width:2px;height:2px;background:rgba(212,168,83,0.6);border-radius:50%;pointer-events:none;z-index:50;box-shadow:0 0 4px rgba(212,168,83,0.4);}@keyframes emberRise{0%{transform:translateY(100vh) scale(1);opacity:0;}10%{opacity:0.6;}90%{opacity:0.6;}100%{transform:translateY(-10vh) scale(0.3);opacity:0;}}';
    document.head.appendChild(style);
    
    function spawnEmber() {
        const ember = document.createElement('div');
        ember.className = 'ember';
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 2;
        
        ember.style.left = left + '%';
        ember.style.animation = 'emberRise ' + duration + 's linear ' + delay + 's infinite';
        
        document.body.appendChild(ember);
        
        const allEmbers = document.querySelectorAll('.ember');
        if (allEmbers.length > 15) {
            allEmbers[0].remove();
        }
    }
    
    setInterval(spawnEmber, 3000);
    spawnEmber();
}

function initializeGaslightFlicker() {
    const cards = document.querySelectorAll('.member-card');
    cards.forEach(function(card, index) {
        card.style.animation = 'gaslightFlicker ' + (8 + Math.random() * 4) + 's ease-in-out infinite';
        card.style.animationDelay = (index * 0.5) + 's';
    });
}

// === PARALLAX SCROLL ===
function initializeParallaxScroll() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateParallax() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    const cards = document.querySelectorAll('.member-card');
    cards.forEach(function(card) {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distanceFromCenter = (cardCenter - viewportCenter) / viewportHeight;
        
        const portrait = card.querySelector('.daguerreotype');
        if (portrait && Math.abs(distanceFromCenter) < 0.5) {
            const parallaxY = distanceFromCenter * 8;
            const scale = 1 - Math.abs(distanceFromCenter) * 0.02;
            portrait.style.transform = 'translateY(' + parallaxY + 'px) scale(' + scale + ')';
        }
    });
    
    const header = document.querySelector('.society-header');
    if (header) {
        const headerOffset = scrollY * 0.15;
        header.style.transform = 'translateY(' + headerOffset + 'px)';
        header.style.opacity = Math.max(0.3, 1 - scrollY / 400);
    }
}

// === CARD REVEAL ANIMATION ===
function initializeCardReveal() {
    const style = document.createElement('style');
    style.textContent = '@keyframes cardReveal{from{opacity:0;transform:translateY(40px) scale(0.95);filter:blur(4px);}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0);}}@keyframes cardEntrance{from{opacity:0;transform:translateY(60px) rotateX(10deg);filter:blur(8px);}to{opacity:1;transform:translateY(0) rotateX(0);filter:blur(0);}}';
    document.head.appendChild(style);
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const card = entry.target;
                const siblings = Array.from(card.parentElement.children);
                const index = siblings.indexOf(card);
                card.style.animation = 'cardEntrance 0.8s cubic-bezier(0.23, 1, 0.32, 1) ' + (index * 0.12) + 's both';
                observer.unobserve(card);
            }
        });
    }, observerOptions);
    
    const cards = document.querySelectorAll('.member-card');
    cards.forEach(function(card) {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// === ACCESSIBILITY ===
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateMotionPreference() {
    const cards = document.querySelectorAll('.member-card');
    if (prefersReducedMotion.matches) {
        cards.forEach(function(card) {
            card.style.animation = 'none';
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }
}

prefersReducedMotion.addEventListener('change', updateMotionPreference);
updateMotionPreference();