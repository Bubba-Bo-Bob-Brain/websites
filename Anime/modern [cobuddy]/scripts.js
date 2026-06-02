// ============================================
// OTAKU ZEN — Manga & Anime Magazine
// Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ----- Navigation Scroll Effect -----
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ----- Active Nav Link -----
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ----- Mobile Menu Toggle -----
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('open');
        });
    });

    // ----- Hero Speed Lines Dynamic Animation -----
    const speedlines = document.querySelectorAll('.speedline');
    speedlines.forEach((line, index) => {
        const baseDelay = index * 0.6;
        animateSpeedLine(line, baseDelay);
    });

    function animateSpeedLine(line, delay) {
        line.style.animation = `speedlineMove 3s ease-in-out ${delay}s infinite alternate`;
    }

    // ----- Scene Transition on Scroll -----
    const sceneTransition = document.getElementById('sceneTransition');
    let lastScrollY = 0;
    let transitionTimeout;

    function handleSceneTransition() {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

        if (Math.abs(currentScrollY - lastScrollY) > 100) {
            sceneTransition.classList.add('active');

            clearTimeout(transitionTimeout);
            transitionTimeout = setTimeout(() => {
                sceneTransition.classList.remove('active');
            }, 150);
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleSceneTransition, { passive: true });

    // ----- Character Carousel -----
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDotsContainer = document.getElementById('carouselDots');
    const characterCards = carouselTrack.querySelectorAll('.character-card');

    // Create dots
    characterCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollToCard(index));
        carouselDotsContainer.appendChild(dot);
    });

    const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
    let currentCardIndex = 0;
    const cardWidth = 320 + 24; // card width + gap

    function scrollToCard(index) {
        const scrollPosition = index * cardWidth;
        carouselTrack.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    function updateDots() {
        const scrollLeft = carouselTrack.scrollLeft;
        const newIndex = Math.round(scrollLeft / cardWidth);
        if (newIndex !== currentCardIndex) {
            currentCardIndex = newIndex;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentCardIndex);
            });
        }
    }

    carouselTrack.addEventListener('scroll', updateDots, { passive: true });

    carouselPrev.addEventListener('click', () => {
        const newIndex = Math.max(0, currentCardIndex - 1);
        scrollToCard(newIndex);
    });

    carouselNext.addEventListener('click', () => {
        const newIndex = Math.min(characterCards.length - 1, currentCardIndex + 1);
        scrollToCard(newIndex);
    });

    // Touch/Swipe support for carousel
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                const newIndex = Math.min(characterCards.length - 1, currentCardIndex + 1);
                scrollToCard(newIndex);
            } else {
                const newIndex = Math.max(0, currentCardIndex - 1);
                scrollToCard(newIndex);
            }
        }
    });

    // ----- Scroll Reveal Animations -----
    const revealElements = document.querySelectorAll('[data-anim="fade-up"]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Animate stat bars within revealed cards
                const statFills = entry.target.querySelectorAll('.stat-fill');
                statFills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 200);
                });

                // Animate progress bars within revealed cards
                const progressFills = entry.target.querySelectorAll('.progress-fill');
                progressFills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 300);
                });
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ----- Manga Panel Hover Effects -----
    const mangaPanels = document.querySelectorAll('.manga-panel');

    mangaPanels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            panel.style.zIndex = '10';
        });

        panel.addEventListener('mouseleave', () => {
            panel.style.zIndex = '1';
        });
    });

    // ----- Smooth Scroll for Nav Links -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offset = 80;
                const top = targetSection.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ----- Parallax on Hero -----
    const heroContent = document.querySelector('.hero-content');
    const heroHalftone = document.getElementById('heroHalftone');

    window.addEventListener('scroll', () => {
        if (!heroContent || window.scrollY > window.innerHeight) return;

        const scrollProgress = window.scrollY / window.innerHeight;
        const parallaxY = scrollProgress * 60;

        heroContent.style.transform = `translateY(${parallaxY}px)`;
        heroContent.style.opacity = 1 - scrollProgress * 0.8;

        if (heroHalftone) {
            heroHalftone.style.transform = `translateY(${parallaxY * 0.5}px)`;
        }
    }, { passive: true });

    // ----- Dynamic Card Stat Animation on Scroll -----
    const statBars = document.querySelectorAll('.stat-fill');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statBars.forEach((bar, i) => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200 + i * 150);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsContainer = document.querySelector('.card-stats');
    if (statsContainer) statsObserver.observe(statsContainer);

    // ----- Tracker Progress Animation -----
    const trackerCards = document.querySelectorAll('.tracker-card');

    const trackerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFills = entry.target.querySelectorAll('.progress-fill');
                progressFills.forEach((fill, i) => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 300 + i * 200);
                });
            }
        });
    }, { threshold: 0.3 });

    trackerCards.forEach(card => trackerObserver.observe(card));

    // ----- Hero Badge Pulse Effect -----
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        setInterval(() => {
            heroBadge.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
            setTimeout(() => {
                heroBadge.style.boxShadow = 'none';
            }, 1000);
        }, 3000);
    }

    // ----- Section Tag Reveal on Scroll -----
    const sectionTags = document.querySelectorAll('.section-tag');

    const tagObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.5 });

    sectionTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px)';
        tag.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        tagObserver.observe(tag);
    });

    // ----- Cursor Trail Effect (desktop only) -----
    if (window.matchMedia('(pointer: fine)').matches) {
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        document.body.appendChild(trail);

        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateTrail() {
            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;
            trail.style.left = trailX + 'px';
            trail.style.top = trailY + 'px';
            requestAnimationFrame(animateTrail);
        }
        animateTrail();

        // Add cursor trail styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .cursor-trail {
                position: fixed;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 45, 85, 0.3), transparent 70%);
                pointer-events: none;
                z-index: 9997;
                transform: translate(-50%, -50%);
                mix-blend-mode: screen;
            }
        `;
        document.head.appendChild(style);
    }

    // ----- Keyboard Navigation for Carousel -----
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            const newIndex = Math.max(0, currentCardIndex - 1);
            scrollToCard(newIndex);
        } else if (e.key === 'ArrowRight') {
            const newIndex = Math.min(characterCards.length - 1, currentCardIndex + 1);
            scrollToCard(newIndex);
        }
    });

    // ----- Loading Animation -----
    const body = document.body;
    body.classList.add('is-loading');

    window.addEventListener('load', () => {
        setTimeout(() => {
            body.classList.remove('is-loading');
        }, 800);
    });

});