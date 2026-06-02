/* ═══════════════════════════════════════════════════════════════════════════════════
   THE ARCANE TAVERN — Retro Fantasy RPG Hub
   Interactive Scripts
   ═══════════════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── State ─── */
    const state = {
        particles: [],
        maxParticles: 35,
        activeTab: 'offensive',
        modalOpen: false
    };

    /* ═══════════════════════════════════════════════════════════════════════════════════
       PARTICLE SYSTEM — Golden dust motes floating upward
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        function createParticle() {
            if (state.particles.length >= state.maxParticles) return;

            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random starting position
            const startX = Math.random() * 100;
            const startY = 100 + Math.random() * 10;
            const size = 2 + Math.random() * 4;
            const duration = 6 + Math.random() * 6;
            const delay = Math.random() * 2;
            const drift = -30 + Math.random() * 60;

            particle.style.cssText = `
                left: ${startX}%;
                top: ${startY}%;
                width: ${size}px;
                height: ${size}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                --drift: ${drift}px;
            `;

            // Override the CSS animation with custom drift
            particle.style.animation = `float-particle-custom ${duration}s ease-in-out ${delay}s infinite`;

            container.appendChild(particle);
            state.particles.push(particle);

            // Remove particle after several cycles
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
                const idx = state.particles.indexOf(particle);
                if (idx > -1) state.particles.splice(idx, 1);
            }, (duration + delay) * 5000);
        }

        // Create initial batch
        for (let i = 0; i < 15; i++) {
            setTimeout(createParticle, i * 300);
        }

        // Continuously spawn new particles
        setInterval(() => {
            if (Math.random() > 0.4) {
                createParticle();
            }
        }, 800);

        // Inject custom keyframes with drift
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes float-particle-custom {
                0% {
                    opacity: 0;
                    transform: translateY(0) translateX(0) scale(0);
                }
                10% {
                    opacity: 0.7;
                    transform: translateY(-10vh) translateX(calc(var(--drift) * 0.2)) scale(1);
                }
                50% {
                    opacity: 0.5;
                    transform: translateY(-50vh) translateX(var(--drift)) scale(0.9);
                }
                90% {
                    opacity: 0.3;
                    transform: translateY(-90vh) translateX(calc(var(--drift) * 0.5)) scale(0.6);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-105vh) translateX(calc(var(--drift) * 0.3)) scale(0);
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       SCROLL REVEAL — Animate elements when they enter the viewport
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        if (!revealElements.length) return;

        // Staggered reveal delays for cards within same parent
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const parent = el.parentElement;
                    const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
                    const index = siblings.indexOf(el);

                    // Add staggered delay based on sibling position
                    const delay = Math.max(0, index) * 120;

                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, delay);

                    revealObserver.unobserve(el);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       STAT BARS — Animate when character section enters view
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initStatBars() {
        const statSection = document.querySelector('.character-stats');
        if (!statSection) return;

        const statBars = statSection.querySelectorAll('.stat-bar-fill');
        let animated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    statBars.forEach((bar, index) => {
                        const targetWidth = bar.style.getPropertyValue('--stat-value');
                        bar.style.width = '0';

                        setTimeout(() => {
                            bar.style.transition = 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                            bar.style.width = targetWidth;
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statSection);
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       TOME TABS — Switch between spell category pages
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initTomeTabs() {
        const tabs = document.querySelectorAll('.tome-tab');
        const pages = document.querySelectorAll('.tome-page');

        if (!tabs.length || !pages.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');

                // Update tab states
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                // Update page visibility with fade effect
                pages.forEach(page => {
                    const pageId = page.id.replace('page-', '');
                    if (pageId === targetTab) {
                        page.style.opacity = '0';
                        page.style.display = 'grid';

                        // Trigger reflow
                        page.offsetHeight;

                        page.style.transition = 'opacity 0.4s ease';
                        page.style.opacity = '1';

                        // Re-trigger reveal animations for spells in this page
                        const spells = page.querySelectorAll('.reveal');
                        spells.forEach((spell, i) => {
                            spell.classList.remove('revealed');
                            setTimeout(() => {
                                spell.classList.add('revealed');
                            }, i * 100 + 100);
                        });
                    } else {
                        page.style.opacity = '0';
                        setTimeout(() => {
                            page.style.display = 'none';
                        }, 300);
                    }
                });

                state.activeTab = targetTab;
            });

            // Keyboard navigation
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    tab.click();
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       ITEM MODAL — Display item details on click
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initItemModal() {
        const modal = document.getElementById('item-modal');
        const modalIcon = document.getElementById('modal-icon');
        const modalTitle = document.getElementById('modal-title');
        const modalType = document.getElementById('modal-type');
        const modalDescription = document.getElementById('modal-description');
        const modalClose = modal ? modal.querySelector('.modal-close') : null;

        if (!modal) return;

        // Inventory slots
        const inventorySlots = document.querySelectorAll('.inventory-slot[data-item]');
        const equipSlots = document.querySelectorAll('.equip-slot[data-item]');

        function openModal(icon, title, type, description) {
            modalIcon.textContent = icon;
            modalTitle.textContent = title;
            modalType.textContent = type;
            modalDescription.textContent = description;

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            state.modalOpen = true;

            // Trap focus
            modalClose.focus();
        }

        function closeModal() {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            state.modalOpen = false;
        }

        // Inventory item clicks
        inventorySlots.forEach(slot => {
            slot.addEventListener('click', () => {
                const icon = slot.querySelector('.item-icon').textContent;
                const title = slot.getAttribute('data-item');
                const type = slot.getAttribute('data-item-type');
                const description = slot.getAttribute('data-item-desc');

                if (title && description) {
                    openModal(icon, title, type, description);
                }
            });

            slot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    slot.click();
                }
            });
        });

        // Equipment slot clicks
        equipSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                const icon = slot.querySelector('.equip-icon').textContent;
                const title = slot.getAttribute('data-item');
                const description = slot.getAttribute('data-item-desc');

                if (title && description) {
                    openModal(icon, title, 'Equipped Gear', description);
                }
            });

            slot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    slot.click();
                }
            });
        });

        // Close modal
        modalClose.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.modalOpen) {
                closeModal();
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       SMOOTH SCROLLING — Nav links smooth scroll to sections
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetEl = document.querySelector(targetId);

                if (targetEl) {
                    e.preventDefault();

                    const headerOffset = 30;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       QUEST CARD INTERACTIONS — Sound-like visual feedback
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initQuestCards() {
        const questCards = document.querySelectorAll('.quest-card');

        questCards.forEach(card => {
            // Add subtle paper rustle effect on hover
            card.addEventListener('mouseenter', () => {
                const pin = card.querySelector('.quest-pin');
                if (pin) {
                    pin.style.transition = 'transform 0.3s ease';
                    pin.style.transform = 'translateX(-50%) scale(1.2)';
                }
            });

            card.addEventListener('mouseleave', () => {
                const pin = card.querySelector('.quest-pin');
                if (pin) {
                    pin.style.transform = 'translateX(-50%) scale(1)';
                }
            });

            // Click feedback
            card.addEventListener('click', () => {
                card.style.transition = 'transform 0.15s ease';
                card.style.transform = 'scale(0.98)';

                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       ACTIVE NAV HIGHLIGHTING — Highlight nav link for current section
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initActiveNavHighlight() {
        const sections = document.querySelectorAll('.section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -70% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');

                    navLinks.forEach(link => {
                        link.style.borderBottom = '';
                        link.style.color = '';

                        if (link.getAttribute('href') === `#${id}`) {
                            link.style.borderBottom = '2px solid var(--burgundy)';
                            link.style.color = 'var(--burgundy)';
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       INVENTORY SLOT HOVER TOOLTIPS — Quick preview on hover
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initInventoryTooltips() {
        const slots = document.querySelectorAll('.inventory-slot[data-item]');

        slots.forEach(slot => {
            const itemName = slot.getAttribute('data-item');
            if (!itemName) return;

            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.classList.add('inventory-tooltip');
            tooltip.textContent = itemName;
            tooltip.style.cssText = `
                position: absolute;
                bottom: calc(100% + 8px);
                left: 50%;
                transform: translateX(-50%);
                background: rgba(26, 18, 7, 0.9);
                color: #f4e4c1;
                font-family: var(--font-display);
                font-size: 0.7rem;
                padding: 0.3rem 0.6rem;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 100;
                border: 1px solid rgba(184, 134, 11, 0.5);
            `;

            slot.style.position = 'relative';
            slot.appendChild(tooltip);

            slot.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });

            slot.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       TORCH FLAME RANDOM FLICKER — Add natural variation
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initTorchFlicker() {
        const flames = document.querySelectorAll('.flame-inner');
        const glows = document.querySelectorAll('.torch-glow');

        function flicker() {
            flames.forEach(flame => {
                const scale = 0.9 + Math.random() * 0.2;
                const skew = -3 + Math.random() * 6;
                const brightness = 0.85 + Math.random() * 0.3;

                flame.style.transform = `translateX(-50%) scaleX(${scale}) skewX(${skew}deg)`;
                flame.style.filter = `blur(${1 + Math.random()}px) brightness(${brightness})`;
            });

            glows.forEach(glow => {
                const glowScale = 0.95 + Math.random() * 0.1;
                const glowOpacity = 0.7 + Math.random() * 0.3;

                glow.style.transform = `translateX(-50%) scale(${glowScale})`;
                glow.style.opacity = glowOpacity;
            });

            // Random interval for natural feel
            const nextFlicker = 80 + Math.random() * 120;
            setTimeout(flicker, nextFlicker);
        }

        flicker();
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       SPELL CARD HOVER GLOW — Enhanced hover effects
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initSpellCardEffects() {
        const spellCards = document.querySelectorAll('.spell-card');

        spellCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                card.style.background = `
                    radial-gradient(circle at ${x}% ${y}%,
                        rgba(255, 255, 255, 0.15) 0%,
                        transparent 50%
                    ),
                    linear-gradient(180deg,
                        #faf5eb 0%,
                        #f0e6d0 50%,
                        #e8dbbf 100%
                    )
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       WAX SEAL EASTER EGG — Click the seal for a fun effect
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initWaxSealEasterEgg() {
        const seal = document.querySelector('.wax-seal');
        if (!seal) return;

        let clickCount = 0;
        const messages = [
            '⚜ Welcome, adventurer! ⚜',
            '⚜ The tavern keeper nods. ⚜',
            '⚜ Your courage is noted. ⚜',
            '⚜ Fortune favors the bold! ⚜',
            '⚜ ...you hear a dragon in the distance. ⚜'
        ];

        seal.addEventListener('click', () => {
            clickCount++;

            // Rotate animation
            seal.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            seal.style.transform = `rotate(${360 * clickCount}deg) scale(1.1)`;

            setTimeout(() => {
                seal.style.transform = `rotate(${360 * clickCount}deg) scale(1)`;
            }, 500);

            // Show message
            const messageIndex = Math.min(clickCount - 1, messages.length - 1);
            showSealMessage(messages[messageIndex]);
        });

        function showSealMessage(text) {
            // Remove existing message
            const existing = document.querySelector('.seal-message');
            if (existing) existing.remove();

            const message = document.createElement('div');
            message.classList.add('seal-message');
            message.textContent = text;
            message.style.cssText = `
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-top: 0.5rem;
                font-family: var(--font-display);
                font-size: 0.9rem;
                color: var(--burgundy);
                white-space: nowrap;
                opacity: 0;
                animation: seal-message-appear 0.5s ease forwards;
                pointer-events: none;
            `;

            seal.parentElement.style.position = 'relative';
            seal.parentElement.appendChild(message);

            // Add animation
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                @keyframes seal-message-appear {
                    0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    100% { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(styleSheet);

            setTimeout(() => {
                message.style.transition = 'opacity 0.5s ease';
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 500);
            }, 3000);
        }
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       PARALLAX SCROLL EFFECT — Subtle depth on scroll
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initParallaxScroll() {
        const header = document.querySelector('.site-header');
        const seal = document.querySelector('.wax-seal');

        if (!header) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const headerHeight = header.offsetHeight;

                    if (scrolled < headerHeight) {
                        const progress = scrolled / headerHeight;
                        const opacity = 1 - progress * 0.5;
                        const translateY = scrolled * 0.3;

                        header.style.opacity = opacity;

                        if (seal) {
                            seal.style.transform = `translateY(${translateY * 0.5}px)`;
                        }
                    }

                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       PARCHMENT AGING EFFECT — Random dark spots for authenticity
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initParchmentAging() {
        const sections = document.querySelectorAll('.section-inner');

        sections.forEach(section => {
            // Add subtle age spots
            for (let i = 0; i < 3; i++) {
                const spot = document.createElement('div');
                spot.setAttribute('aria-hidden', 'true');
                spot.style.cssText = `
                    position: absolute;
                    width: ${20 + Math.random() * 40}px;
                    height: ${20 + Math.random() * 40}px;
                    background: radial-gradient(circle,
                        rgba(139, 105, 20, ${0.03 + Math.random() * 0.04}) 0%,
                        transparent 70%
                    );
                    border-radius: 50%;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    pointer-events: none;
                `;
                section.appendChild(spot);
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       LOADING SEQUENCE — Staggered reveal on page load
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function initLoadingSequence() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.6s ease';

        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════════
       INITIALIZE ALL
       ═══════════════════════════════════════════════════════════════════════════════════ */
    function init() {
        initLoadingSequence();
        initParticles();
        initScrollReveal();
        initStatBars();
        initTomeTabs();
        initItemModal();
        initSmoothScroll();
        initQuestCards();
        initActiveNavHighlight();
        initInventoryTooltips();
        initTorchFlicker();
        initSpellCardEffects();
        initWaxSealEasterEgg();
        initParallaxScroll();
        initParchmentAging();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();