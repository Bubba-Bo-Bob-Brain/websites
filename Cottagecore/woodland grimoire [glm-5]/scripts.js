document.addEventListener('DOMContentLoaded', function() {
    initCauldronLoader();
    initNavigation();
    initSeasonalWheel();
    initModeToggle();
    initSparkParticles();
    initScrollAnimations();
});

function initCauldronLoader() {
    const loader = document.getElementById('cauldronLoader');
    const minDisplayTime = 2500;
    const startTime = Date.now();
    
    function hideLoader() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        setTimeout(function() {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            animateContentEntrance();
        }, remainingTime);
    }
    
    document.body.style.overflow = 'hidden';
    
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
}

function animateContentEntrance() {
    const header = document.querySelector('.book-header');
    const nav = document.querySelector('.book-navigation');
    const activeSection = document.querySelector('.content-section.active');
    
    const elements = [header, nav, activeSection];
    
    elements.forEach(function(el, index) {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(function() {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 150);
        }
    });
    
    animatePotionCards();
}

function animatePotionCards() {
    const cards = document.querySelectorAll('.potion-card, .pressed-flower-card, .remedy-note');
    
    cards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(function() {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + index * 100);
    });
}

function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');
    
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-tab');
            const targetSection = document.getElementById(targetId);
            
            tabs.forEach(function(t) {
                t.classList.remove('active');
            });
            
            this.classList.add('active');
            
            sections.forEach(function(section) {
                section.classList.remove('active');
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
            });
            
            setTimeout(function() {
                targetSection.classList.add('active');
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
                
                animateSectionCards(targetSection);
            }, 100);
        });
    });
}

function animateSectionCards(section) {
    const cards = section.querySelectorAll('.potion-card, .pressed-flower-card, .remedy-note, .forage-item');
    
    cards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(function() {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
    });
}

function initSeasonalWheel() {
    const segments = document.querySelectorAll('.season-segment');
    const wheel = document.getElementById('seasonalWheel');
    
    let currentActiveSegment = document.querySelector('.season-segment.spring');
    if (currentActiveSegment) {
        currentActiveSegment.classList.add('active');
    }
    
    segments.forEach(function(segment) {
        segment.addEventListener('click', function() {
            segments.forEach(function(s) {
                s.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const season = this.getAttribute('data-season');
            updateForagingDetails(season);
            
            animateWheelPulse(this);
        });
        
        segment.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.season-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        segment.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.season-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

function animateWheelPulse(segment) {
    const wheel = document.getElementById('seasonalWheel');
    
    wheel.style.transform = 'scale(1.02)';
    wheel.style.transition = 'transform 0.2s ease';
    
    setTimeout(function() {
        wheel.style.transform = 'scale(1)';
    }, 200);
}

function updateForagingDetails(season) {
    const detailsContainer = document.getElementById('foragingDetails');
    
    const foragingData = {
        spring: {
            title: 'Spring Foraging',
            items: [
                {
                    name: 'Nettle',
                    description: 'Gather young tops before flowering. Wear gloves! Makes nourishing tea and spring soup.',
                    illustrationClass: 'nettle'
                },
                {
                    name: 'Dandelion',
                    description: 'Every part is medicine. Roots for liver, leaves for greens, flowers for wine and wishes.',
                    illustrationClass: 'dandelion'
                }
            ]
        },
        summer: {
            title: 'Summer Foraging',
            items: [
                {
                    name: 'Lavender',
                    description: 'Harvest when buds first open. Dry in small bundles. Perfect for sleep pillows and calming teas.',
                    illustrationClass: 'lavender'
                },
                {
                    name: 'Calendula',
                    description: 'Pick flowers at full bloom. Resinous and golden. Makes healing salves and skin remedies.',
                    illustrationClass: 'calendula'
                }
            ]
        },
        autumn: {
            title: 'Autumn Foraging',
            items: [
                {
                    name: 'Elderberry',
                    description: 'Gather dark purple clusters after first frost. Make syrup for winter immune strength.',
                    illustrationClass: 'elderberry'
                },
                {
                    name: 'Rosehip',
                    description: 'Harvest after frost sweetens them. Rich in vitamin C. Perfect for syrups and teas.',
                    illustrationClass: 'rosehip'
                }
            ]
        },
        winter: {
            title: 'Winter Foraging',
            items: [
                {
                    name: 'Pine Needles',
                    description: 'Gather young green needles. High in vitamin C. Makes warming tea for cold winter days.',
                    illustrationClass: 'pine'
                },
                {
                    name: 'Cedar',
                    description: 'Collect small branches respectfully. Burn for purification, steep for respiratory aid.',
                    illustrationClass: 'cedar'
                }
            ]
        }
    };
    
    const data = foragingData[season];
    if (!data) return;
    
    detailsContainer.style.opacity = '0';
    detailsContainer.style.transform = 'translateY(10px)';
    
    setTimeout(function() {
        let itemsHTML = '';
        data.items.forEach(function(item) {
            itemsHTML += `
                <div class="forage-item">
                    <div class="item-illustration ${item.illustrationClass}"></div>
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p class="handwriting">${item.description}</p>
                    </div>
                </div>
            `;
        });
        
        detailsContainer.innerHTML = `
            <article class="foraging-card ${season}-details active">
                <h3>${data.title}</h3>
                <div class="foraging-list">
                    ${itemsHTML}
                </div>
            </article>
        `;
        
        detailsContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        detailsContainer.style.opacity = '1';
        detailsContainer.style.transform = 'translateY(0)';
    }, 200);
}

function initModeToggle() {
    const toggle = document.getElementById('modeToggle');
    const body = document.body;
    const flame = document.querySelector('.flame');
    const glow = document.querySelector('.glow');
    
    const savedMode = localStorage.getItem('hedgewoodMode');
    
    if (savedMode === 'night') {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
        enhanceNightElements();
    }
    
    toggle.addEventListener('click', function() {
        body.classList.toggle('day-mode');
        body.classList.toggle('night-mode');
        
        const isNight = body.classList.contains('night-mode');
        
        localStorage.setItem('hedgewoodMode', isNight ? 'night' : 'day');
        
        if (isNight) {
            enhanceNightElements();
            createMothsAroundCandle();
        } else {
            removeNightEnhancements();
            removeMothsFromCandle();
        }
        
        animateToggleTransition();
    });
}

function enhanceNightElements() {
    const flame = document.querySelector('.flame');
    const glow = document.querySelector('.glow');
    const candle = document.querySelector('.footer-candle');
    
    if (flame) {
        flame.style.filter = 'brightness(1.2)';
    }
    
    if (glow) {
        glow.style.width = '100px';
        glow.style.height = '100px';
        glow.style.background = 'radial-gradient(circle, rgba(255, 200, 100, 0.6) 0%, transparent 70%)';
    }
    
    if (candle) {
        candle.style.filter = 'drop-shadow(0 0 20px rgba(255, 200, 100, 0.5))';
    }
    
    addAmbientStars();
}

function removeNightEnhancements() {
    const flame = document.querySelector('.flame');
    const glow = document.querySelector('.glow');
    const candle = document.querySelector('.footer-candle');
    
    if (flame) {
        flame.style.filter = '';
    }
    
    if (glow) {
        glow.style.width = '';
        glow.style.height = '';
        glow.style.background = '';
    }
    
    if (candle) {
        candle.style.filter = '';
    }
    
    removeAmbientStars();
}

function addAmbientStars() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.className = 'ambient-star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(255, 255, 200, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 2 + 1}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            pointer-events: none;
        `;
        container.appendChild(star);
    }
    
    if (!document.getElementById('twinkleStyle')) {
        const style = document.createElement('style');
        style.id = 'twinkleStyle';
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

function removeAmbientStars() {
    const stars = document.querySelectorAll('.ambient-star');
    stars.forEach(function(star) {
        star.remove();
    });
}

function createMothsAroundCandle() {
    const candle = document.querySelector('.footer-candle');
    if (!candle) return;
    
    for (let i = 0; i < 3; i++) {
        const moth = document.createElement('div');
        moth.className = 'candle-moth';
        moth.style.cssText = `
            position: absolute;
            width: 15px;
            height: 12px;
            animation: mothOrbit ${3 + i}s ease-in-out infinite;
            animation-delay: ${i * 0.5}s;
            pointer-events: none;
            z-index: 100;
        `;
        
        moth.innerHTML = `
            <div style="position: absolute; width: 50%; height: 100%; background: rgba(200, 180, 150, 0.8); border-radius: 50% 50% 40% 40%; left: 0;"></div>
            <div style="position: absolute; width: 50%; height: 100%; background: rgba(200, 180, 150, 0.8); border-radius: 50% 50% 40% 40%; right: 0;"></div>
            <div style="position: absolute; width: 2px; height: 60%; background: #3d2914; left: 50%; top: 20%; transform: translateX(-50%); border-radius: 1px;"></div>
        `;
        
        candle.appendChild(moth);
    }
    
    if (!document.getElementById('mothOrbitStyle')) {
        const style = document.createElement('style');
        style.id = 'mothOrbitStyle';
        style.textContent = `
            @keyframes mothOrbit {
                0% { transform: translate(-40px, -20px) rotate(-10deg); opacity: 0.7; }
                25% { transform: translate(30px, -30px) rotate(5deg); opacity: 1; }
                50% { transform: translate(40px, 10px) rotate(-5deg); opacity: 0.8; }
                75% { transform: translate(-20px, 20px) rotate(10deg); opacity: 1; }
                100% { transform: translate(-40px, -20px) rotate(-10deg); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
}

function removeMothsFromCandle() {
    const moths = document.querySelectorAll('.candle-moth');
    moths.forEach(function(moth) {
        moth.remove();
    });
}

function animateToggleTransition() {
    const cards = document.querySelectorAll('.potion-card, .pressed-flower-card, .remedy-note, .foraging-card');
    
    cards.forEach(function(card, index) {
        card.style.transition = 'background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease';
    });
}

function initSparkParticles() {
    const particles = document.querySelectorAll('.spark-particle');
    const flame = document.querySelector('.flame');
    
    if (!flame) return;
    
    document.addEventListener('mousemove', function(e) {
        const flameRect = flame.getBoundingClientRect();
        const flameCenterX = flameRect.left + flameRect.width / 2;
        const flameCenterY = flameRect.top + flameRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(e.clientX - flameCenterX, 2) + 
            Math.pow(e.clientY - flameCenterY, 2)
        );
        
        if (distance < 150) {
            createSparkParticle(e.clientX, e.clientY);
        }
    });
}

function createSparkParticle(x, y) {
    if (Math.random() > 0.1) return;
    
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: radial-gradient(circle, #ffcc66 0%, #ff6600 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${x}px;
        top: ${y}px;
        animation: sparkFloat 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(function() {
        particle.remove();
    }, 1000);
    
    if (!document.getElementById('sparkFloatStyle')) {
        const style = document.createElement('style');
        style.id = 'sparkFloatStyle';
        style.textContent = `
            @keyframes sparkFloat {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { transform: translate(${Math.random() * 40 - 20}px, -50px) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
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
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const potionCards = document.querySelectorAll('.potion-card');
    const flowerCards = document.querySelectorAll('.pressed-flower-card');
    const remedyNotes = document.querySelectorAll('.remedy-note');
    
    potionCards.forEach(function(card) {
        observer.observe(card);
    });
    
    flowerCards.forEach(function(card) {
        observer.observe(card);
    });
    
    remedyNotes.forEach(function(note) {
        observer.observe(note);
    });
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.potion-card')) {
        const card = e.target.closest('.potion-card');
        const glow = card.querySelector('.card-glow');
        
        if (glow) {
            glow.style.opacity = '1';
            glow.style.background = 'radial-gradient(circle at center, rgba(212, 160, 60, 0.2) 0%, transparent 50%)';
            
            setTimeout(function() {
                glow.style.opacity = '0';
            }, 500);
        }
    }
});

document.querySelectorAll('.ingredient').forEach(function(ingredient) {
    ingredient.addEventListener('mouseenter', function() {
        this.style.color = 'var(--accent-primary)';
        this.style.transition = 'color 0.3s ease';
    });
    
    ingredient.addEventListener('mouseleave', function() {
        this.style.color = '';
    });
});

const headerMoths = document.querySelectorAll('.header-decoration .moth');
headerMoths.forEach(function(moth) {
    moth.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    moth.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

function initPotionBottleHover() {
    const bottles = document.querySelectorAll('.potion-bottle');
    
    bottles.forEach(function(bottle) {
        bottle.addEventListener('mouseenter', function() {
            const liquid = this.querySelector('.liquid');
            if (liquid) {
                liquid.style.transform = 'scale(1.05)';
                liquid.style.transition = 'transform 0.3s ease';
            }
        });
        
        bottle.addEventListener('mouseleave', function() {
            const liquid = this.querySelector('.liquid');
            if (liquid) {
                liquid.style.transform = '';
            }
        });
    });
}

initPotionBottleHover();

console.log('✨ Hedgewood Apothecary loaded successfully ✨');