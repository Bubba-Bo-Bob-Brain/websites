/**
 * Scroll of the Jade Emperor - Wuxia Martial Arts Website
 * Interactive features for the ancient silk scroll
 */

(function() {
    'use strict';

    // ============================================
    // DOM References
    // ============================================
    const sections = document.querySelectorAll('.scroll-section');
    const navStamps = document.querySelectorAll('.nav-stamp');
    const progressFill = document.querySelector('.scroll-progress-fill');
    const pathCards = document.querySelectorAll('.path-card');
    const skillNodes = document.querySelectorAll('.skill-node');
    const techniqueCards = document.querySelectorAll('.technique-card');
    const scrollContainer = document.querySelector('.scroll-content');
    const imperialSeal = document.querySelector('.imperial-seal');

    // ============================================
    // Scroll Reveal Observer
    // ============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger special animations based on section
                const section = entry.target;
                if (section.classList.contains('scroll-section--qi')) {
                    activateQiVisualization();
                }
                if (section.classList.contains('scroll-section--tree')) {
                    activateSkillTree();
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections
    sections.forEach(section => {
        revealObserver.observe(section);
    });

    // ============================================
    // Scroll Progress Indicator
    // ============================================
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;

        if (progressFill) {
            progressFill.style.height = `${Math.min(progress, 100)}%`;
        }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    // ============================================
    // Navigation Stamp Click Handlers
    // ============================================
    navStamps.forEach(stamp => {
        stamp.addEventListener('click', function() {
            const sectionName = this.dataset.section;
            const targetSection = document.querySelector(`.scroll-section--${sectionName}`);

            if (targetSection) {
                const offset = targetSection.getBoundingClientRect().top + window.pageYOffset - 20;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });

                // Visual feedback
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });

        // Hover sound effect simulation via visual ripple
        stamp.addEventListener('mouseenter', function() {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(196, 30, 58, 0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: rippleEffect 0.6s ease-out forwards;
                pointer-events: none;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ============================================
    // Path Card Interactions
    // ============================================
    pathCards.forEach(card => {
        card.addEventListener('click', function() {
            const techniques = this.querySelectorAll('.technique-item');
            techniques.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateX(10px)';
                    item.style.opacity = '0.7';
                    setTimeout(() => {
                        item.style.transform = '';
                        item.style.opacity = '1';
                    }, 300);
                }, index * 100);
            });
        });

        // Meridian line speed boost on hover
        card.addEventListener('mouseenter', function() {
            const meridian = this.querySelector('.meridian-line');
            if (meridian) {
                meridian.style.animationDuration = '1.5s';
            }
        });

        card.addEventListener('mouseleave', function() {
            const meridian = this.querySelector('.meridian-line');
            if (meridian) {
                meridian.style.animationDuration = '3s';
            }
        });
    });

    // ============================================
    // Skill Tree Interactions
    // ============================================
    function activateSkillTree() {
        skillNodes.forEach((node, index) => {
            setTimeout(() => {
                node.style.opacity = '1';
                node.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Initialize skill nodes as hidden
    skillNodes.forEach(node => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(20px)';
        node.style.transition = 'all 0.5s ease';

        // Click to "unlock" the node
        node.addEventListener('click', function() {
            const circle = this.querySelector('.node-circle');
            const isUnlocked = this.dataset.unlocked === 'true';

            if (!isUnlocked) {
                // Unlock animation
                circle.style.boxShadow = '0 0 40px rgba(200, 160, 80, 0.6), 0 0 80px rgba(200, 160, 80, 0.3)';
                circle.style.borderColor = '#ffd700';
                this.dataset.unlocked = 'true';

                // Create energy burst effect
                createEnergyBurst(circle);

                // Update connected nodes if applicable
                const nodeType = this.dataset.node;
                if (nodeType === 'root') {
                    unlockAdjacentNodes(this, '.skill-tier--1 .skill-node');
                } else if (nodeType === 'meridian' || nodeType === 'breath') {
                    unlockAdjacentNodes(this, '.skill-tier--2 .skill-node');
                }
            } else {
                // Already unlocked, just pulse
                circle.style.animation = 'none';
                void circle.offsetHeight;
                circle.style.animation = 'pulseBorder 1s ease-in-out 3';
            }
        });
    });

    function unlockAdjacentNodes(sourceNode, targetSelector) {
        const targets = document.querySelectorAll(targetSelector);
        targets.forEach(target => {
            setTimeout(() => {
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
                const circle = target.querySelector('.node-circle');
                if (circle) {
                    circle.style.boxShadow = '0 0 20px rgba(200, 160, 80, 0.3)';
                    circle.style.borderColor = 'var(--color-ink-gold)';
                }
            }, 300);
        });
    }

    function createEnergyBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;

            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 4px;
                height: 4px;
                background: var(--color-ink-gold);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 0 6px rgba(200, 160, 80, 0.8);
                transition: all 0.6s ease-out;
            `;

            document.body.appendChild(particle);

            requestAnimationFrame(() => {
                particle.style.transform = `translate(
                    ${Math.cos(angle) * distance}px,
                    ${Math.sin(angle) * distance}px
                )`;
                particle.style.opacity = '0';
            });

            setTimeout(() => particle.remove(), 700);
        }
    }

    // ============================================
    // Technique Card Interactions
    // ============================================
    techniqueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const emoji = this.querySelector('.card-emoji');
            const stroke = this.querySelector('.brush-stroke');

            if (emoji) {
                emoji.style.transform = 'scale(1.3) rotate(5deg)';
            }
            if (stroke) {
                stroke.style.transform = 'scale(1.2)';
                stroke.style.opacity = '0.15';
            }
        });

        card.addEventListener('mouseleave', function() {
            const emoji = this.querySelector('.card-emoji');
            const stroke = this.querySelector('.brush-stroke');

            if (emoji) {
                emoji.style.transform = '';
            }
            if (stroke) {
                stroke.style.transform = '';
                stroke.style.opacity = '';
            }
        });

        // Click to show technique details
        card.addEventListener('click', function() {
            const title = this.querySelector('.card-title').textContent;
            const desc = this.querySelector('.card-desc').textContent;

            // Create floating text effect
            const floatText = document.createElement('div');
            floatText.textContent = `✦ ${title} ✦`;
            floatText.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.5);
                font-family: var(--font-title);
                font-size: 2rem;
                color: var(--color-ink-gold);
                text-shadow: 0 0 30px rgba(200, 160, 80, 0.5);
                pointer-events: none;
                z-index: 1000;
                transition: all 0.8s ease-out;
                opacity: 0;
            `;

            document.body.appendChild(floatText);

            requestAnimationFrame(() => {
                floatText.style.opacity = '1';
                floatText.style.transform = 'translate(-50%, -50%) scale(1)';
            });

            setTimeout(() => {
                floatText.style.opacity = '0';
                floatText.style.transform = 'translate(-50%, -80%) scale(0.8)';
                setTimeout(() => floatText.remove(), 800);
            }, 1500);
        });
    });

    // ============================================
    // Qi Visualization Activation
    // ============================================
    function activateQiVisualization() {
        const particles = document.querySelectorAll('.qi-particle');
        const points = document.querySelectorAll('.meridian-point');

        // Stagger the activation of particles
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animationPlayState = 'running';
            }, index * 500);
        });

        // Enhanced pulse for meridian points
        points.forEach((point, index) => {
            setTimeout(() => {
                point.style.boxShadow = '0 0 30px rgba(200, 160, 80, 0.8)';
                point.style.transform = 'scale(1.8)';
                setTimeout(() => {
                    point.style.boxShadow = '';
                    point.style.transform = '';
                }, 500);
            }, index * 200);
        });
    }

    // Initialize qi particles as paused
    document.querySelectorAll('.qi-particle').forEach(p => {
        p.style.animationPlayState = 'paused';
    });

    // ============================================
    // Imperial Seal Click Effect
    // ============================================
    if (imperialSeal) {
        imperialSeal.addEventListener('click', function() {
            // Create radial ink splatter effect
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Create expanding ring
            const ring = document.createElement('div');
            ring.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 0;
                height: 0;
                border: 2px solid var(--color-seal-red);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                transform: translate(-50%, -50%);
                animation: sealRingExpand 1s ease-out forwards;
            `;

            document.body.appendChild(ring);
            setTimeout(() => ring.remove(), 1000);

            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Parallax Effect on Mist Layers
    // ============================================
    let lastScrollY = 0;
    let ticking = false;

    function updateParallax() {
        const scrollY = window.pageYOffset;
        const mistLayers = document.querySelectorAll('.mist-layer');

        mistLayers.forEach((layer, index) => {
            const speed = 0.05 * (index + 1);
            const yOffset = scrollY * speed;
            layer.style.transform = `translateY(${yOffset}px)`;
        });

        // Bamboo subtle parallax
        const bamboos = document.querySelectorAll('.bamboo');
        bamboos.forEach((bamboo, index) => {
            const speed = 0.02 * (index + 1);
            const yOffset = scrollY * speed;
            bamboo.style.transform = `translateY(${-yOffset}px)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.pageYOffset;
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ============================================
    // Dynamic CSS Animations via Keyframes
    // ============================================
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes sealRingExpand {
            0% {
                width: 0;
                height: 0;
                opacity: 0.8;
                border-width: 3px;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
                border-width: 1px;
            }
        }

        @keyframes rippleEffect {
            0% {
                width: 0;
                height: 0;
                opacity: 0.5;
            }
            100% {
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }

        @keyframes nodeUnlock {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 rgba(200, 160, 80, 0);
            }
            50% {
                transform: scale(1.2);
                box-shadow: 0 0 40px rgba(200, 160, 80, 0.6);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 20px rgba(200, 160, 80, 0.3);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // ============================================
    // Keyboard Navigation
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const currentSection = findCurrentSection();
            const nextSection = currentSection.nextElementSibling;
            if (nextSection && nextSection.classList.contains('scroll-section')) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const currentSection = findCurrentSection();
            const prevSection = currentSection.previousElementSibling;
            if (prevSection && prevSection.classList.contains('scroll-section')) {
                prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });

    function findCurrentSection() {
        let closestSection = sections[0];
        let closestDistance = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = section;
            }
        });

        return closestSection;
    }

    // ============================================
    // Smooth Scroll with Mouse Wheel
    // ============================================
    let isScrolling = false;

    scrollContainer.addEventListener('wheel', (e) => {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        }
    }, { passive: true });

    // ============================================
    // Initialization
    // ============================================
    function init() {
        // Update progress on load
        updateScrollProgress();

        // Set initial visible sections
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                section.classList.add('visible');
            }
        });

        // Log the scroll awakening
        console.log('🌸 The Scroll of the Jade Emperor awakens...');
        console.log('📜 "The way that can be spoken is not the eternal way."');

        // Add subtle initial animation to the imperial seal
        if (imperialSeal) {
            setTimeout(() => {
                imperialSeal.style.transition = 'transform 0.3s ease';
            }, 1000);
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();