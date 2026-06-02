/* =====================================================
/* THE PLAGUE CHRONICLE — INTERACTIVE SCRIPTS
/* ===================================================== */

/**
 * Plague Chronicle Character Gallery
 * Interactive Features & Animations
 */
(function() {
    'use strict';

    // =====================================================
    // INITIALIZATION
    // =====================================================
    document.addEventListener('DOMContentLoaded', function() {
        initParticles();
        initFilters();
        initScrollEffects();
        initCardInteractions();
        initModal();
        initPlagueBars();
        initStaggerAnimations();
        initTooltipSystem();
    });

    // =====================================================
    // FLOATING PARTICLES SYSTEM
    // =====================================================
    function initParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 30;
        const particleTypes = [
            { char: '💀', weight: 2 },
            { char: '🦴', weight: 1 },
            { char: '⚰️', weight: 1 },
            { char: '✦', weight: 3 },
            { char: '•', weight: 4 }
        ];

        // Create weighted particle pool
        const weightedPool = [];
        particleTypes.forEach(function(type) {
            for (let i = 0; i < type.weight * 5; i++) {
                weightedPool.push(type.char);
            }
        });

        for (let i = 0; i < particleCount; i++) {
            createParticle(particlesContainer, weightedPool);
        }
    }

    function createParticle(container, pool) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = pool[Math.floor(Math.random() * pool.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.fontSize = (8 + Math.random() * 12) + 'px';
        particle.style.opacity = 0.1 + Math.random() * 0.2;
        container.appendChild(particle);
    }

    // =====================================================
    // FILTER SYSTEM
    // =====================================================
    function initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const characterCards = document.querySelectorAll('.character-card');
        const visibleCountEl = document.getElementById('visibleCount');
        const activeFilters = {
            class: 'all',
            alignment: 'all',
            priority: 'all'
        };

        filterButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const filterType = this.dataset.category;
                const filterValue = this.dataset.filter;

                // Update active state within same category
                const categoryButtons = document.querySelectorAll('.filter-btn[data-category="' + filterType + '"]');
                categoryButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                // Store active filter
                activeFilters[filterType] = filterValue;

                // Apply filters
                applyFilters(activeFilters, characterCards, visibleCountEl);
            });
        });
    }

    function applyFilters(filters, cards, countEl) {
        let visibleCount = 0;
        cards.forEach(function(card) {
            const cardClass = card.dataset.class;
            const cardAlignment = card.dataset.alignment;
            const cardPriority = card.dataset.priority;

            const matchesClass = filters.class === 'all' || cardClass === filters.class;
            const matchesAlignment = filters.alignment === 'all' || cardAlignment === filters.alignment;
            const matchesPriority = filters.priority === 'all' || cardPriority === filters.priority;

            if (matchesClass && matchesAlignment && matchesPriority) {
                card.classList.remove('hidden');
                card.style.animationDelay = (visibleCount * 0.05) + 's';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.animationDelay = '0s';
            }
        });

        // Update count with animation
        updateCount(countEl, visibleCount);
    }

    function updateCount(element, newCount) {
        element.style.transform = 'scale(1.3)';
        element.style.color = '#c9a227';
        setTimeout(function() {
            element.textContent = newCount;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 200);
    }

    // =====================================================
    // SCROLL EFFECTS
    // =====================================================
    function initScrollEffects() {
        const header = document.querySelector('.site-header');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        let lastScroll = 0;

        window.addEventListener('scroll', throttle(function() {
            const currentScroll = window.pageYOffset;

            // Header fade on scroll
            if (currentScroll > 100) {
                header.style.opacity = Math.max(0.7, 1 - (currentScroll - 100) / 500);
            } else {
                header.style.opacity = 1;
            }

            // Hide scroll indicator after scrolling
            if (currentScroll > 300) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }

            // Parallax effect for fog layers
            const fogLayers = document.querySelectorAll('.fog-layer');
            fogLayers.forEach(function(fog, index) {
                const speed = 0.1 + (index * 0.05);
                fog.style.transform = 'translateX(' + (-currentScroll * speed) + 'px)';
            });

            // Animate cards on scroll
            revealOnScroll();
            lastScroll = currentScroll;
        }, 16));
    }

    function revealOnScroll() {
        const cards = document.querySelectorAll('.character-card:not(.revealed)');
        const windowHeight = window.innerHeight;

        cards.forEach(function(card) {
            const cardTop = card.getBoundingClientRect().top;
            const revealPoint = windowHeight - 100;

            if (cardTop < revealPoint) {
                card.classList.add('revealed');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }

    // =====================================================
    // CARD INTERACTIONS
    // =====================================================
    function initCardInteractions() {
        const cards = document.querySelectorAll('.character-card');

        cards.forEach(function(card) {
            // Click to expand card
            card.addEventListener('click', function(e) {
                if (e.target.closest('.filter-btn') || e.target.closest('.modal-close')) return;
                openModal(this);
            });

            // Keyboard accessibility
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(this);
                }
            });

            // Add sound effect simulation on hover (visual feedback)
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });

            // Stat bars animation on card hover
            card.addEventListener('mouseenter', function() {
                const statFills = this.querySelectorAll('.stat-fill');
                statFills.forEach(function(fill, index) {
                    fill.style.transitionDelay = (index * 50) + 'ms';
                });
            });
        });

        // Add revealed class for scroll animations
        document.querySelectorAll('.character-card').forEach(function(card) {
            card.classList.add('revealed');
        });
    }

    // =====================================================
    // MODAL FUNCTIONALITY
    // =====================================================
    function initModal() {
        const modal = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        const closeBtn = document.getElementById('modalClose');

        if (!modal || !modalContent) return;

        // Close modal functions
        const closeModal = function() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            setTimeout(function() {
                modalContent.innerHTML = '<button class="modal-close" id="modalClose">✕</button>';
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    function openModal(card) {
        const modal = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');

        if (!modal || !modalContent) return;

        // Clone card content to modal
        const cardClone = card.cloneNode(true);
        cardClone.classList.remove('hidden', 'character-card');

        // Build modal content
        const portraitHTML = cardClone.querySelector('.portrait-container') ? cardClone.querySelector('.portrait-container').outerHTML : '';
        const headerHTML = cardClone.querySelector('.character-header') ? cardClone.querySelector('.character-header').outerHTML : '';
        const alignmentHTML = cardClone.querySelector('.alignment-indicator') ? cardClone.querySelector('.alignment-indicator').outerHTML : '';
        const socialHTML = cardClone.querySelector('.social-class') ? cardClone.querySelector('.social-class').outerHTML : '';
        const storyHTML = cardClone.querySelector('.character-story') ? cardClone.querySelector('.character-story').outerHTML : '';
        const abilitiesHTML = cardClone.querySelector('.abilities-section') ? cardClone.querySelector('.abilities-section').outerHTML : '';
        const relationshipsHTML = cardClone.querySelector('.relationships') ? cardClone.querySelector('.relationships').outerHTML : '';
        const statsHTML = cardClone.querySelector('.stats-grid') ? cardClone.querySelector('.stats-grid').outerHTML : '';
        const footerHTML = cardClone.querySelector('.card-footer') ? cardClone.querySelector('.card-footer').outerHTML : '';

        modalContent.innerHTML = '<button class="modal-close" id="modalClose">✕</button>' +
            '<div class="modal-expanded">' +
                portraitHTML +
                '<div class="modal-details">' +
                    headerHTML +
                    alignmentHTML +
                    socialHTML +
                    '<div class="modal-story">' + storyHTML + '</div>' +
                    '<div class="modal-abilities">' + abilitiesHTML + '</div>' +
                    '<div class="modal-relationships">' + relationshipsHTML + '</div>' +
                    '<div class="modal-stats">' + statsHTML + '</div>' +
                    '<div class="modal-footer">' + footerHTML + '</div>' +
                '</div>' +
            '</div>';

        // Re-attach close button event
        document.getElementById('modalClose').addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add modal-specific styles
        addModalStyles();
    }

    function addModalStyles() {
        const styleId = 'modal-expanded-styles';
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = '' +
            '.modal-expanded { display: flex; flex-direction: column; gap: 1.5rem; }' +
            '.modal-expanded .portrait-container { aspect-ratio: 16/10; }' +
            '.modal-details { display: flex; flex-direction: column; gap: 1rem; }' +
            '.modal-story, .modal-abilities, .modal-relationships, .modal-stats, .modal-footer { background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; }';
    }

    // =====================================================
    // PLAGUE BAR ANIMATIONS
    // =====================================================
    function initPlagueBars() {
        const plagueFills = document.querySelectorAll('.plague-fill');
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(function() {
                        fill.style.width = width;
                    }, 300);
                }
            });
        }, { threshold: 0.5 });

        plagueFills.forEach(function(fill) {
            observer.observe(fill);
        });
    }

    // =====================================================
    // STAGGER ANIMATIONS
    // =====================================================
    function initStaggerAnimations() {
        const cards = document.querySelectorAll('.character-card');
        cards.forEach(function(card, index) {
            card.style.setProperty('--card-index', index);
        });
    }

    // =====================================================
    // TOOLTIP SYSTEM
    // =====================================================
    function initTooltipSystem() {
        const tooltipStyle = document.createElement('style');
        tooltipStyle.textContent = '' +
            '.tooltip { ' +
                'position: absolute; ' +
                'background: var(--bg-dark, #1a1614); ' +
                'border: 1px solid var(--accent-gold-dim, #8b7355); ' +
                'padding: 0.5rem 0.75rem; ' +
                'border-radius: 4px; ' +
                'font-size: 0.8rem; ' +
                'color: var(--text-primary, #d4c4a8); ' +
                'z-index: 1000; ' +
                'pointer-events: none; ' +
                'opacity: 0; ' +
                'transition: opacity 0.2s ease; ' +
                'max-width: 200px; ' +
                'box-shadow: 0 4px 12px rgba(0,0,0,0.5); ' +
            '}' +
            '.tooltip.visible { opacity: 1; }';
        document.head.appendChild(tooltipStyle);
    }

    // =====================================================
    // UTILITY FUNCTIONS
    // =====================================================
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            const args = arguments;
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // =====================================================
    // EASTER EGG: KONAMI CODE
    // =====================================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateSecretMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateSecretMode() {
        // Add temporary golden glow to all cards
        document.querySelectorAll('.character-card').forEach(function(card) {
            card.style.boxShadow = '0 0 30px rgba(201, 162, 39, 0.5), 0 0 60px rgba(201, 162, 39, 0.3)';
            card.style.borderColor = '#c9a227';
        });

        // Show secret message
        setTimeout(function() {
            alert('🩸 You have unlocked the secrets of the Plague Chronicle! May you survive the darkness... 🩸');
        }, 500);

        // Reset after 5 seconds
        setTimeout(function() {
            document.querySelectorAll('.character-card').forEach(function(card) {
                card.style.boxShadow = '';
                card.style.borderColor = '';
            });
        }, 5000);
    }

    // =====================================================
    // PERFORMANCE: REDUCE MOTION FOR ACCESSIBILITY
    // =====================================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-medium', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
        document.querySelectorAll('.particle').forEach(function(p) {
            p.style.animation = 'none';
        });
        document.querySelectorAll('.fog-layer').forEach(function(f) {
            f.style.animation = 'none';
        });
    }

    // =====================================================
    // CONSOLE EASTER EGG
    // =====================================================
    console.log('%c🩸 The Plague Chronicle 🩸', 'font-size: 24px; color: #8b0000; font-weight: bold;');
    console.log('%cSurvive the darkness... or perish.', 'font-size: 14px; color: #c9a227; font-style: italic;');
    console.log('%cCharacter Gallery v1.0 — Anno Domini 1348', 'font-size: 10px; color: #786858;');

})();