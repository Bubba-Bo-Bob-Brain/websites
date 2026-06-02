const emberField = document.getElementById('emberField');
const galleryGrid = document.getElementById('galleryGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const customCursor = document.getElementById('customCursor');
const characterCards = document.querySelectorAll('.character-card');

function createEmbers() {
    const emberCount = 25;
    
    for (let i = 0; i < emberCount; i++) {
        const ember = document.createElement('div');
        ember.className = 'ember';
        
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = 8 + Math.random() * 12;
        const size = 1 + Math.random() * 2;
        
        ember.style.left = `${left}%`;
        ember.style.animationDelay = `${delay}s`;
        ember.style.animationDuration = `${duration}s`;
        ember.style.width = `${size}px`;
        ember.style.height = `${size}px`;
        
        if (Math.random() > 0.7) {
            ember.style.background = '#CD853F';
        }
        
        emberField.appendChild(ember);
    }
}

function animatePropBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.prop-fill');
                fills.forEach((fill, index) => {
                    const targetWidth = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 100 + index * 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    characterCards.forEach(card => observer.observe(card));
}

function revealCardsOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const index = Array.from(characterCards).indexOf(card);
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.1 });
    
    characterCards.forEach(card => observer.observe(card));
}

function filterCards(filterType) {
    characterCards.forEach(card => {
        card.classList.remove('visible');
        card.classList.add('hidden-by-filter');
        
        const factions = card.dataset.factions;
        const shouldShow = filterType === 'all' || factions.includes(filterType);
        
        setTimeout(() => {
            if (shouldShow) {
                card.classList.remove('hidden-by-filter');
                requestAnimationFrame(() => {
                    card.classList.add('visible');
                });
            }
        }, 50);
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterCards(btn.dataset.filter);
    });
});

function initCustomCursor() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        customCursor.style.left = `${cursorX - 10}px`;
        customCursor.style.top = `${cursorY - 10}px`;
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    const interactiveElements = document.querySelectorAll('button, .character-card, a');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            customCursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            customCursor.classList.remove('hovering');
        });
    });
}

function initCardTilt() {
    characterCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -2;
            const rotateY = (x - centerX) / centerX * 2;
            
            const inner = card.querySelector('.card-inner');
            inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            inner.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.card-inner');
            inner.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
            inner.style.transition = 'transform 0.4s ease';
        });
    });
}

function initBondHighlights() {
    characterCards.forEach(card => {
        const bondTarget = card.querySelector('.bond-target');
        if (!bondTarget || card.querySelector('.bond-none')) return;
        
        const targetName = bondTarget.textContent.trim().toLowerCase();
        
        card.addEventListener('mouseenter', () => {
            characterCards.forEach(otherCard => {
                if (otherCard === card) return;
                
                const otherName = otherCard.querySelector('.character-name').textContent.trim().toLowerCase();
                if (otherName.includes(targetName) || targetName.includes(otherName)) {
                    otherCard.querySelector('.card-frame').style.borderColor = 'var(--accent-gold-dim)';
                    otherCard.querySelector('.card-frame').style.boxShadow = '0 0 30px rgba(184, 134, 11, 0.15)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            characterCards.forEach(otherCard => {
                otherCard.querySelector('.card-frame').style.borderColor = '';
                otherCard.querySelector('.card-frame').style.boxShadow = '';
            });
        });
    });
}

function initParallaxHeader() {
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        header.style.transform = `translateY(${rate}px)`;
        header.style.opacity = `${1 - scrolled / 400}`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createEmbers();
    animatePropBars();
    revealCardsOnScroll();
    initCustomCursor();
    initCardTilt();
    initBondHighlights();
    initParallaxHeader();
    
    setTimeout(() => {
        characterCards.forEach((card, index) => {
            setTimeout(() => {
                if (!card.classList.contains('hidden-by-filter')) {
                    card.classList.add('visible');
                }
            }, 200 + index * 80);
        });
    }, 300);
});