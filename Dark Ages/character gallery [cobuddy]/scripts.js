/* ============================================
   THE DYING LIGHT — Character Codex Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Ember Particle System ---
    const emberContainer = document.querySelector('.bg-embers');
    const emberCount = 30;

    function createEmber() {
        const ember = document.createElement('div');
        ember.classList.add('ember');
        ember.style.left = Math.random() * 100 + '%';
        ember.style.animationDuration = (6 + Math.random() * 8) + 's';
        ember.style.animationDelay = Math.random() * 5 + 's';
        ember.style.width = (1 + Math.random() * 2) + 'px';
        ember.style.height = ember.style.width;
        ember.style.opacity = 0;
        emberContainer.appendChild(ember);

        // Remove and recreate after animation
        setTimeout(() => {
            ember.remove();
            createEmber();
        }, (6000 + Math.random() * 8000));
    }

    for (let i = 0; i < emberCount; i++) {
        createEmber();
    }

    // --- Intersection Observer for Cards ---
    const cards = document.querySelectorAll('.character-card');
    const statFills = document.querySelectorAll('.stat-fill');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Trigger stat bar animation
                const fills = entry.target.querySelectorAll('.stat-fill');
                fills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 100);
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    cards.forEach(card => {
        cardObserver.observe(card);
    });

    // --- Tooltip System for Bonds ---
    const bonds = document.querySelectorAll('.bond');

    bonds.forEach(bond => {
        bond.addEventListener('mouseenter', () => {
            bond.style.transform = 'translateY(-1px)';
        });

        bond.addEventListener('mouseleave', () => {
            bond.style.transform = 'translateY(0)';
        });
    });

    // --- Legend Bar Scroll Hint ---
    const scrollHint = document.querySelector('.legend-scroll-hint');
    let hintVisible = true;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 100 && hintVisible) {
            scrollHint.style.opacity = '0';
            scrollHint.style.transform = 'translateY(-10px)';
            hintVisible = false;
        } else if (scrollY < 100 && !hintVisible) {
            scrollHint.style.opacity = '1';
            scrollHint.style.transform = 'translateY(0)';
            hintVisible = true;
        }
    });

    // --- Card Tilt Effect ---
    cards.forEach(card => {
        const cardEl = card.querySelector('.card-border-outer');

        card.addEventListener('mousemove', (e) => {
            const rect = cardEl.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // --- Alignment Filter ---
    const legendBar = document.querySelector('.legend-bar');
    const alignmentMap = {
        '🔥': 'alignment',
        '🩸': 'survival',
        '🙏': 'faith',
        '☠': 'plague',
        '⚔': 'combat',
        '📖': 'knowledge'
    };

    let activeFilters = new Set();

    legendBar.addEventListener('click', (e) => {
        const item = e.target.closest('.legend-item');
        if (!item) return;

        const icon = item.querySelector('.legend-icon').textContent;
        const label = item.querySelector('.legend-label').textContent.toLowerCase();

        if (alignmentMap[icon]) {
            const filterType = alignmentMap[icon];

            if (activeFilters.has(filterType)) {
                activeFilters.delete(filterType);
                item.style.borderColor = '';
                item.style.color = '';
            } else {
                activeFilters.add(filterType);
                item.style.borderColor = 'var(--color-accent-gold)';
                item.style.color = 'var(--color-accent-gold)';
            }

            filterCards();
        }
    });

    function filterCards() {
        cards.forEach(card => {
            const statFills = card.querySelectorAll('.stat-fill');
            let visible = true;

            if (activeFilters.size > 0) {
                for (const filter of activeFilters) {
                    let match = false;

                    switch (filter) {
                        case 'alignment':
                            const alignmentTag = card.querySelector('.tag[title="Moral Alignment"]');
                            if (alignmentTag) {
                                const tagText = alignmentTag.textContent.toLowerCase();
                                if (tagText.includes('good') || tagText.includes('neutral') || tagText.includes('evil')) {
                                    match = true;
                                }
                            }
                            break;
                        case 'survival':
                            const survivalBar = Array.from(statFills).find(f => f.classList.contains('survival'));
                            if (survivalBar) {
                                const width = parseInt(survivalBar.style.width);
                                match = width >= 70;
                            }
                            break;
                        case 'faith':
                            const faithBar = Array.from(statFills).find(f => f.classList.contains('faith'));
                            if (faithBar) {
                                const width = parseInt(faithBar.style.width);
                                match = width >= 70;
                            }
                            break;
                        case 'plague':
                            const plagueBar = Array.from(statFills).find(f => f.classList.contains('plague'));
                            if (plagueBar) {
                                const width = parseInt(plagueBar.style.width);
                                match = width >= 70;
                            }
                            break;
                        case 'combat':
                            const combatBar = Array.from(statFills).find(f => f.classList.contains('combat'));
                            if (combatBar) {
                                const width = parseInt(combatBar.style.width);
                                match = width >= 70;
                            }
                            break;
                        case 'knowledge':
                            const knowledgeBar = Array.from(statFills).find(f => f.classList.contains('knowledge'));
                            if (knowledgeBar) {
                                const width = parseInt(knowledgeBar.style.width);
                                match = width >= 70;
                            }
                            break;
                    }

                    if (!match) {
                        visible = false;
                        break;
                    }
                }
            }

            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            if (visible) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0.15';
                card.style.transform = 'translateY(10px)';
            }
        });
    }

    // --- Stat Bar Hover Highlight ---
    statFills.forEach(fill => {
        fill.parentElement.addEventListener('mouseenter', () => {
            fill.style.filter = 'brightness(1.3)';
        });

        fill.parentElement.addEventListener('mouseleave', () => {
            fill.style.filter = 'brightness(1)';
        });
    });

    // --- Counter Animation ---
    const headerTitle = document.querySelector('.header-title');
    let titleAnimated = false;

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !titleAnimated) {
                titleAnimated = true;
                headerTitle.style.opacity = '0';
                headerTitle.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    headerTitle.style.transition = 'opacity 1s ease, transform 1s ease';
                    headerTitle.style.opacity = '1';
                    headerTitle.style.transform = 'translateY(0)';
                }, 300);
            }
        });
    });

    titleObserver.observe(headerTitle);

    // --- Footer Skull Row Animation ---
    const skullRow = document.querySelector('.footer-skull-row');
    const skulls = skullRow.querySelectorAll('span');

    skulls.forEach((skull, index) => {
        skull.style.opacity = '0';
        skull.style.transform = 'scale(0.5) rotate(-10deg)';
        skull.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;

        setTimeout(() => {
            skull.style.opacity = '0.3';
            skull.style.transform = 'scale(1) rotate(0deg)';
        }, 500 + index * 200);
    });

    // --- Ambient Parallax on Scroll ---
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const flickerOverlay = document.querySelector('.candle-flicker');
                if (flickerOverlay) {
                    flickerOverlay.style.transform = `translateY(${scrollY * 0.02}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // --- Keyboard Navigation ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            activeFilters.clear();
            document.querySelectorAll('.legend-item').forEach(item => {
                item.style.borderColor = '';
                item.style.color = '';
            });
            filterCards();
        }
    });

    // --- Console Easter Egg ---
    console.log('%c☠ The Dying Light ☠', 'font-size: 24px; color: #c9a84c; font-family: serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);');
    console.log('%cThe plague claims another...', 'font-size: 12px; color: #8b1a1a; font-style: italic;');
});