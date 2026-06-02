// ============================================
// ÀṢÀ ARCHIVE — Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // NAVIGATION & SCROLL
    // ========================================

    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    function scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const section = link.dataset.section;
            scrollToSection(section);
        });
    });

    // Track active section
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));

    // Scroll effects
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (scrollIndicator) {
            scrollIndicator.style.opacity = currentScrollY > 100 ? '0' : '1';
        }

        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // ========================================
    // HOLOGRAPHIC ARTIFACT ROTATION
    // ========================================

    const artifactCards = document.querySelectorAll('.artifact-card');

    artifactCards.forEach((card) => {
        const holoObject = card.querySelector('.holo-object');
        const buttons = card.querySelectorAll('.rotate-btn');
        let rotation = { x: 0, y: 0, z: 0 };
        let isDragging = false;
        let startX, startY;
        let autoRotate = true;

        // Auto-rotation
        function autoRotateLoop() {
            if (!isDragging && autoRotate) {
                rotation.y += 0.3;
                rotation.x += 0.1;
                updateTransform();
            }
            requestAnimationFrame(autoRotateLoop);
        }
        autoRotateLoop();

        function updateTransform() {
            holoObject.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`;
        }

        // Button controls
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const axis = btn.dataset.axis;
                if (axis === 'reset') {
                    rotation = { x: 0, y: 0, z: 0 };
                    autoRotate = true;
                    updateTransform();
                    return;
                }
                rotation[axis] += 45;
                autoRotate = false;
                updateTransform();

                // Resume auto-rotate after 4 seconds
                setTimeout(() => {
                    autoRotate = true;
                }, 4000);
            });
        });

        // Mouse drag rotation
        holoObject.addEventListener('mousedown', (e) => {
            isDragging = true;
            autoRotate = false;
            startX = e.clientX;
            startY = e.clientY;
            holoObject.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            rotation.y += dx * 0.5;
            rotation.x -= dy * 0.5;
            startX = e.clientX;
            startY = e.clientY;
            updateTransform();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                holoObject.style.cursor = 'grab';
                setTimeout(() => { autoRotate = true; }, 3000);
            }
        });

        holoObject.style.cursor = 'grab';

        // Hover glow
        holoObject.addEventListener('mouseenter', () => {
            holoObject.style.filter = 'brightness(1.2)';
        });
        holoObject.addEventListener('mouseleave', () => {
            holoObject.style.filter = 'brightness(1)';
        });
    });

    // ========================================
    // GRIOT NARRATION
    // ========================================

    const griotPlay = document.getElementById('griot-play');
    const griotText = document.getElementById('griot-text');
    const griotProgress = document.getElementById('griot-progress');
    const griotLines = griotText.querySelectorAll('.griot-line');
    let isPlaying = false;
    let currentLineIndex = 0;
    let playbackTimer = null;

    function startNarration() {
        currentLineIndex = 0;
        griotProgress.style.width = '0%';

        griotLines.forEach((line, i) => {
            line.classList.remove('visible');
            line.style.opacity = '0';
            line.style.transform = 'translateY(10px)';
        });

        function revealNext() {
            if (currentLineIndex < griotLines.length) {
                const line = griotLines[currentLineIndex];
                line.classList.add('visible');
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
                currentLineIndex++;

                const progress = (currentLineIndex / griotLines.length) * 100;
                griotProgress.style.width = progress + '%';

                const delay = parseInt(line.dataset.delay) || 2000;
                playbackTimer = setTimeout(revealNext, delay);
            } else {
                isPlaying = false;
                griotPlay.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>';
            }
        }

        revealNext();
    }

    griotPlay.addEventListener('click', () => {
        if (!isPlaying) {
            isPlaying = true;
            griotPlay.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
            startNarration();
        } else {
            isPlaying = false;
            clearTimeout(playbackTimer);
            griotPlay.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>';
        }
    });

    // ========================================
    // COSMIC DIASPORA STAR MAP
    // ========================================

    const mapPoints = document.querySelectorAll('.map-point');
    const mapStory = document.getElementById('map-story');
    const storyText = mapStory.querySelector('.story-text');

    mapPoints.forEach(point => {
        point.addEventListener('click', () => {
            mapPoints.forEach(p => p.classList.remove('active'));
            point.classList.add('active');

            const name = point.dataset.name;
            const story = point.dataset.story;

            storyText.style.opacity = '0';
            storyText.style.transform = 'translateY(10px)';

            setTimeout(() => {
                storyText.textContent = `"${name}" — ${story}`;
                storyText.style.opacity = '1';
                storyText.style.transform = 'translateY(0)';
            }, 300);
        });

        // Hover tooltip
        point.addEventListener('mouseenter', () => {
            const label = point.querySelector('.map-label');
            if (label) label.style.opacity = '1';
        });
        point.addEventListener('mouseleave', () => {
            const label = point.querySelector('.map-label');
            if (label) label.style.opacity = '0.8';
        });
    });

    // ========================================
    // TIMELINE SCROLL ANIMATIONS
    // ========================================

    const timelineEvents = document.querySelectorAll('.timeline-event');

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    timelineEvents.forEach(event => timelineObserver.observe(event));

    // ========================================
    // SCROLL REVEAL FOR SECTIONS
    // ========================================

    const revealElements = document.querySelectorAll(
        '.section-header, .artifact-card, .griot-container, .star-map-container, .timeline-container, .griot-voice'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(el);
    });

    // ========================================
    // AMBIENT TOGGLE
    // ========================================

    const ambientToggle = document.getElementById('ambient-toggle');
    let ambientOn = false;

    ambientToggle.addEventListener('click', () => {
        ambientOn = !ambientOn;
        ambientToggle.classList.toggle('active', ambientOn);
        ambientToggle.querySelector('.ambient-icon').textContent = ambientOn ? '♫' : '♪';
    });

    // ========================================
    // HERO CTA BUTTON HOVER EFFECT
    // ========================================

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            ctaButton.style.transform = 'translateY(-2px) scale(1.02)';
        });
        ctaButton.addEventListener('mouseleave', () => {
            ctaButton.style.transform = 'translateY(0) scale(1)';
        });
    }

    // ========================================
    // STAR CONNECTION LINES ANIMATION
    // ========================================

    const stars = document.querySelectorAll('.star');
    const connectionLines = document.querySelector('.connection-lines');

    if (connectionLines) {
        let lineHTML = '';
        const starArray = Array.from(stars);
        for (let i = 0; i < starArray.length - 1; i++) {
            const s1 = starArray[i];
            const s2 = starArray[i + 1];
            const x1 = parseFloat(s1.style.getPropertyValue('--x'));
            const y1 = parseFloat(s1.style.getPropertyValue('--y'));
            const x2 = parseFloat(s2.style.getPropertyValue('--x'));
            const y2 = parseFloat(s2.style.getPropertyValue('--y'));
            lineHTML += `<div class="star-line" data-x1="${x1}" data-y1="${y1}" data-x2="${x2}" data-y2="${y2}" style="position:absolute;left:${x1}%;top:${y1}%;width:0;height:1px;background:linear-gradient(90deg,rgba(212,168,67,0.2),rgba(212,168,67,0.05));transform:rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg);"></div>`;
        }
        // Add a few random connections
        for (let i = 0; i < 5; i++) {
            const a = starArray[Math.floor(Math.random() * starArray.length)];
            const b = starArray[Math.floor(Math.random() * starArray.length)];
            if (a !== b) {
                const x1 = parseFloat(a.style.getPropertyValue('--x'));
                const y1 = parseFloat(a.style.getPropertyValue('--y'));
                const x2 = parseFloat(b.style.getPropertyValue('--x'));
                const y2 = parseFloat(b.style.getPropertyValue('--y'));
                lineHTML += `<div class="star-line" data-x1="${x1}" data-y1="${y1}" data-x2="${x2}" data-y2="${y2}" style="position:absolute;left:${x1}%;top:${y1}%;width:${Math.sqrt((x2-x1)**2 + (y2-y1)**2)}%;height:1px;background:linear-gradient(90deg,rgba(212,168,67,0.15),transparent);transform:rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg);"></div>`;
            }
        }
        connectionLines.innerHTML = lineHTML;
    }

    // ========================================
    // DIASTASpora SECTION BACKGROUND
    // ========================================

    const diasporaSection = document.getElementById('diaspora');
    if (diasporaSection) {
        const diasporaBg = document.createElement('div');
        diasporaBg.className = 'diaspora-bg';
        diasporaBg.style.cssText = `
            position:absolute;inset:0;
            background: radial-gradient(ellipse at 30% 40%, rgba(10,10,46,0.8) 0%, transparent 60%),
                        radial-gradient(ellipse at 70% 60%, rgba(26,10,62,0.6) 0%, transparent 50%),
                        linear-gradient(180deg, var(--deep) 0%, var(--cosmic-blue) 50%, var(--deep) 100%);
            pointer-events:none;z-index:0;
        `;
        diasporaSection.insertBefore(diasporaBg, diasporaSection.firstChild);
    }

    // ========================================
    // GALLERY SECTION TEXTILE BACKGROUND
    // ========================================

    const gallerySection = document.getElementById('artifacts');
    if (gallerySection) {
        const galleryBg = document.createElement('div');
        galleryBg.className = 'gallery-bg-textile';
        galleryBg.style.cssText = `
            position:absolute;inset:0;
            background:
                repeating-linear-gradient(45deg, transparent, transparent 20px, var(--textile-primary) 20px, var(--textile-primary) 21px),
                repeating-linear-gradient(-45deg, transparent, transparent 20px, var(--textile-secondary) 20px, var(--textile-secondary) 21px);
            opacity:0.08;pointer-events:none;z-index:0;
        `;
        gallerySection.insertBefore(galleryBg, gallerySection.firstChild);
    }

    // ========================================
    // GRIOT SECTION TEXTILE BACKGROUND
    // ========================================

    const griotSection = document.getElementById('griot');
    if (griotSection) {
        const griotBg = document.createElement('div');
        griotBg.className = 'griot-bg';
        griotBg.style.cssText = 'position:absolute;inset:0;z-index:0;';
        const griotPattern = document.createElement('div');
        griotPattern.className = 'griot-textile-pattern';
        griotPattern.style.cssText = `
            position:absolute;inset:0;
            background:
                repeating-conic-gradient(from 0deg at 0% 0%, var(--textile-primary) 0deg, var(--textile-primary) 15deg, transparent 15deg, transparent 30deg),
                repeating-conic-gradient(from 15deg at 50% 50%, var(--textile-green) 0deg, var(--textile-green) 15deg, transparent 15deg, transparent 30deg);
            opacity:0.06;
        `;
        griotBg.appendChild(griotPattern);
        griotSection.insertBefore(griotBg, griotSection.firstChild);
    }

    // ========================================
    // PARALLAX ON HERO
    // ========================================

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero-content');
        const starsContainer = document.querySelector('.stars-container');
        const cosmicBg = document.querySelector('.cosmic-bg');

        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - scrolled / 700;
        }
        if (starsContainer) {
            starsContainer.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
        if (cosmicBg) {
            cosmicBg.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // ========================================
    // CARD TILT EFFECT
    // ========================================

    const cards = document.querySelectorAll('.artifact-card, .timeline-event');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const currentSection = Array.from(sections).find(s => {
                const rect = s.getBoundingClientRect();
                return rect.top >= -100 && rect.top <= 100;
            });
            if (currentSection) {
                const nextSection = currentSection.nextElementSibling;
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const currentSection = Array.from(sections).find(s => {
                const rect = s.getBoundingClientRect();
                return rect.top >= -100 && rect.top <= 100;
            });
            if (currentSection) {
                const prevSection = currentSection.previousElementSibling;
                if (prevSection) {
                    prevSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });

    // ========================================
    // CURSOR CUSTOMIZATION
    // ========================================

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position:fixed;
        width:20px;height:20px;
        border:1px solid rgba(212,168,67,0.5);
        border-radius:50%;
        pointer-events:none;
        z-index:10000;
        transition:transform 0.15s ease,opacity 0.15s ease;
        mix-blend-mode:difference;
    `;
    document.body.appendChild(cursor);

    let cursorVisible = true;
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        if (!cursorVisible) {
            cursor.style.opacity = '1';
            cursorVisible = true;
        }
    });

    document.querySelectorAll('button, a, .map-point, .artifact-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.borderColor = 'rgba(212,168,67,0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'rgba(212,168,67,0.5)';
        });
    });

    // Hide cursor on mobile
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
    }

    // ========================================
    // INITIAL LOAD ANIMATION
    // ========================================

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Stagger reveal for hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-divider, .hero-desc, .hero-cta');
    heroElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`;
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300 + i * 150);
    });

    // ========================================
    // MAP STORY TRANSITION
    // ========================================

    let currentStoryTimeout;
    mapPoints.forEach(point => {
        point.addEventListener('click', () => {
            clearTimeout(currentStoryTimeout);
            const name = point.dataset.name;
            const story = point.dataset.story;
            storyText.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            storyText.style.opacity = '0';
            storyText.style.transform = 'translateY(10px)';

            currentStoryTimeout = setTimeout(() => {
                storyText.textContent = `✦ ${name} ✦\n\n${story}`;
                storyText.style.opacity = '1';
                storyText.style.transform = 'translateY(0)';
            }, 300);
        });
    });

    // ========================================
    // RESIZE HANDLER
    // ========================================

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-calculate positions on resize
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                section.style.height = 'auto';
            });
        }, 250);
    });

});