document.addEventListener('DOMContentLoaded', function() {
    initLanternGlow();
    initIncenseParticles();
    initMagicLamps();
    initScrollAnimations();
    initParallaxEffects();
    initSmoothScroll();
    initHoverEffects();
    initLanternFlicker();
    initCarpetAnimation();
    initDjinnBottleEffect();
    initAmbientEffects();
    addDynamicStyles();
});

function initLanternGlow() {
    const glow = document.getElementById('lanternGlow');
    if (!glow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    const smoothness = 0.08;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        currentX += (mouseX - currentX) * smoothness;
        currentY += (mouseY - currentY) * smoothness;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(animateGlow);
    }

    animateGlow();
    glow.style.opacity = '1';
}

function initIncenseParticles() {
    const container = document.getElementById('incenseContainer');
    if (!container) return;

    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        createIncenseParticle(container);
    }
}

function createIncenseParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'incense-particle';

    const startX = Math.random() * window.innerWidth;
    const size = Math.random() * 4 + 2;
    const delay = Math.random() * 8;
    const duration = Math.random() * 4 + 6;

    particle.style.left = startX + 'px';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.animationDelay = delay + 's';
    particle.style.animationDuration = duration + 's';

    container.appendChild(particle);

    setInterval(function() {
        particle.style.left = Math.random() * window.innerWidth + 'px';
    }, (duration + delay) * 1000);
}

function initMagicLamps() {
    const lampCards = document.querySelectorAll('.lamp-card');

    lampCards.forEach(function(card) {
        const lamp = card.querySelector('.magic-lamp');
        const rubArea = lamp.querySelector('.rub-area');
        const magicElement = lamp.querySelector('.lamp-magic');

        let rubCount = 0;
        let lastX = 0;
        let lastY = 0;
        let rubTimeout;

        rubArea.addEventListener('mouseenter', function() {
            if (lamp.dataset.revealed === 'true') return;
            rubArea.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });

        rubArea.addEventListener('mouseleave', function() {
            if (lamp.dataset.revealed === 'true') return;
            rubArea.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        rubArea.addEventListener('mousemove', function(e) {
            if (lamp.dataset.revealed === 'true') return;

            const rect = rubArea.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;

            const distance = Math.sqrt(
                Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2)
            );

            if (distance > 5) {
                rubCount++;
                lastX = currentX;
                lastY = currentY;

                clearTimeout(rubTimeout);
                rubTimeout = setTimeout(function() {
                    rubCount = 0;
                }, 500);

                if (rubCount >= 8) {
                    revealMagic(lamp, magicElement, rubArea, card);
                }
            }
        });

        rubArea.addEventListener('touchmove', function(e) {
            if (lamp.dataset.revealed === 'true') return;
            e.preventDefault();
            rubCount++;

            clearTimeout(rubTimeout);
            rubTimeout = setTimeout(function() {
                rubCount = 0;
            }, 500);

            if (rubCount >= 15) {
                revealMagic(lamp, magicElement, rubArea, card);
            }
        });
    });
}

function revealMagic(lamp, magicElement, rubArea, card) {
    lamp.dataset.revealed = 'true';
    magicElement.classList.remove('hidden');
    rubArea.style.opacity = '0';

    const cardGlow = card.querySelector('.card-glow');
    if (cardGlow) {
        cardGlow.style.opacity = '1';
        cardGlow.style.background = 'radial-gradient(ellipse, rgba(255, 215, 0, 0.4) 0%, transparent 70%)';
    }

    createMagicBurst(lamp);

    setTimeout(function() {
        resetLamp(lamp, magicElement, rubArea);
    }, 6000);
}

function createMagicBurst(lamp) {
    const burstContainer = document.createElement('div');
    burstContainer.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -100%); pointer-events: none; z-index: 100;';
    lamp.appendChild(burstContainer);

    for (let i = 0; i < 12; i++) {
        const spark = document.createElement('div');
        const angle = (i / 12) * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        const size = Math.random() * 6 + 4;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;

        spark.style.cssText = 'position: absolute; width: ' + size + 'px; height: ' + size + 'px; background: radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 107, 53, 0.6) 100%); border-radius: 50%; animation: sparkBurst 1s ease-out forwards;';
        spark.style.setProperty('--endX', endX + 'px');
        spark.style.setProperty('--endY', endY + 'px');

        burstContainer.appendChild(spark);
    }

    setTimeout(function() {
        burstContainer.remove();
    }, 1000);
}

function resetLamp(lamp, magicElement, rubArea) {
    lamp.dataset.revealed = 'false';
    magicElement.classList.add('hidden');
    rubArea.style.opacity = '1';
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.market-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const cards = entry.target.querySelectorAll('.product-card');
                cards.forEach(function(card, index) {
                    setTimeout(function() {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        });
    }, observerOptions);

    sections.forEach(function(section) {
        const cards = section.querySelectorAll('.product-card');
        cards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        sectionObserver.observe(section);
    });

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';

        setTimeout(function() {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
}

function initParallaxEffects() {
    const lanterns = document.querySelectorAll('.hanging-lantern');

    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        lanterns.forEach(function(lantern, index) {
            const depth = (index + 1) * 0.3;
            const moveX = (mouseX - 0.5) * depth * 20;
            const moveY = (mouseY - 0.5) * depth * 10;
            lantern.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const header = document.querySelector('.bazaar-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', function() {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
}

function initLanternFlicker() {
    const flames = document.querySelectorAll('.lantern-flame');

    flames.forEach(function(flame) {
        const randomDelay = Math.random() * 0.5;
        flame.style.animationDelay = randomDelay + 's';
    });
}

function initCarpetAnimation() {
    const carpetCards = document.querySelectorAll('.carpet-card');

    carpetCards.forEach(function(card) {
        const carpet = card.querySelector('.carpet-3d');

        card.addEventListener('mouseenter', function() {
            carpet.style.animationDuration = '1.5s';
        });

        card.addEventListener('mouseleave', function() {
            carpet.style.animationDuration = '3s';
        });
    });
}

function initDjinnBottleEffect() {
    const djinnCards = document.querySelectorAll('.djinn-card');

    djinnCards.forEach(function(card) {
        const bottle = card.querySelector('.bottle-container');

        card.addEventListener('mouseenter', function() {
            bottle.style.animationDuration = '1s';
        });

        card.addEventListener('mouseleave', function() {
            bottle.style.animationDuration = '2s';
        });
    });
}

function initAmbientEffects() {
    const sections = document.querySelectorAll('.market-section');

    sections.forEach(function(section) {
        section.addEventListener('mouseenter', function() {
            const sectionId = section.id;

            if (sectionId === 'carpets') {
                createFloatingDust(section);
            } else if (sectionId === 'djinn') {
                createMysticAura(section);
            } else if (sectionId === 'lamps') {
                createWarmGlow(section);
            } else if (sectionId === 'spices') {
                createAromaWisps(section);
            }
        });
    });
}

function createFloatingDust(section) {
    for (let i = 0; i < 5; i++) {
        const dust = document.createElement('div');
        dust.style.cssText = 'position: absolute; width: 4px; height: 4px; background: rgba(218, 165, 32, 0.4); border-radius: 50%; pointer-events: none; animation: dustFloat 3s ease-out forwards; z-index: 50;';
        dust.style.left = Math.random() * 100 + '%';
        dust.style.top = Math.random() * 100 + '%';
        section.style.position = 'relative';
        section.appendChild(dust);

        setTimeout(function() {
            dust.remove();
        }, 3000);
    }
}

function createMysticAura(section) {
    const aura = document.createElement('div');
    aura.style.cssText = 'position: absolute; top: 50%; left: 50%; width: 200px; height: 200px; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(15, 82, 186, 0.1) 0%, transparent 70%); pointer-events: none; animation: auraPulse 2s ease-out forwards; z-index: 50;';
    section.style.position = 'relative';
    section.appendChild(aura);

    setTimeout(function() {
        aura.remove();
    }, 2000);
}

function createWarmGlow(section) {
    const glow = document.createElement('div');
    glow.style.cssText = 'position: absolute; top: 50%; left: 50%; width: 150px; height: 150px; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%); pointer-events: none; animation: warmPulse 2s ease-out forwards; z-index: 50;';
    section.style.position = 'relative';
    section.appendChild(glow);

    setTimeout(function() {
        glow.remove();
    }, 2000);
}

function createAromaWisps(section) {
    for (let i = 0; i < 3; i++) {
        const wisp = document.createElement('div');
        wisp.style.cssText = 'position: absolute; width: 30px; height: 30px; background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%); border-radius: 50%; pointer-events: none; animation: wispFloat 3s ease-out forwards; z-index: 50;';
        wisp.style.left = (30 + Math.random() * 40) + '%';
        wisp.style.top = (30 + Math.random() * 40) + '%';
        section.style.position = 'relative';
        section.appendChild(wisp);

        setTimeout(function() {
            wisp.remove();
        }, 3000);
    }
}

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = '@keyframes sparkBurst { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(var(--endX), var(--endY)) scale(0); opacity: 0; } } @keyframes dustFloat { 0% { transform: translateY(0) scale(1); opacity: 0.6; } 100% { transform: translateY(-50px) scale(0); opacity: 0; } } @keyframes auraPulse { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.5; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } } @keyframes warmPulse { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; } 100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; } } @keyframes wispFloat { 0% { transform: translateY(0) scale(1); opacity: 0.4; } 100% { transform: translateY(-40px) scale(1.5); opacity: 0; } }';
    document.head.appendChild(style);
}