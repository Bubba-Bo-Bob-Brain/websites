/* ==========================================================================
   L'Art Nouveau — Portfolio & Gallery Scripts
   ========================================================================== */

(function () {
    'use strict';

    /* -----------------------------------------------------------------
       Utility Helpers
       ----------------------------------------------------------------- */
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
    const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* -----------------------------------------------------------------
       1. Loading Screen
       ----------------------------------------------------------------- */
    const loadingScreen = document.getElementById('loading-screen');

    function initLoadingScreen() {
        window.addEventListener('load', () => {
            // Extra delay for visual polish
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Enable cursor glow after loading
                document.getElementById('cursor-glow').classList.add('active');
            }, 1800);
        });

        // Fallback: if everything already loaded
        if (document.readyState === 'complete') {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.getElementById('cursor-glow').classList.add('active');
            }, 1200);
        }
    }

    /* -----------------------------------------------------------------
       2. Custom Cursor Glow
       ----------------------------------------------------------------- */
    const cursorGlow = document.getElementById('cursor-glow');
    let cursorVisible = false;

    function initCursorGlow() {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });

        // Add hover class on interactive elements
        const interactiveSelectors = 'a, button, .gallery-item, .art-frame, .nav-link, .social-link, .btn';
        $$('a, button, .gallery-item, .art-frame, .nav-link, .social-link, .btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover'));
        });

        // Touch devices: hide cursor glow
        if ('ontouchstart' in window) {
            cursorGlow.style.display = 'none';
        }
    }

    /* -----------------------------------------------------------------
       3. Navigation
       ----------------------------------------------------------------- */
    const nav = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = $$('.nav-link', navLinks);

    function initNavigation() {
        // Mobile toggle
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close mobile nav on link click
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });

        // Active link on scroll
        const sections = $$('section[id]');

        function updateActiveLink() {
            const scrollY = window.scrollY + 150;
            let current = '';

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollY >= top && scrollY < top + height) {
                    current = section.getAttribute('id');
                }
            });

            navLinksItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink(); // Initial call

        // Nav style on scroll
        function updateNavScroll() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', updateNavScroll, { passive: true });
        updateNavScroll();
    }

    /* -----------------------------------------------------------------
       4. Smooth Scroll with Offset for Fixed Nav
       ----------------------------------------------------------------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 10;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* -----------------------------------------------------------------
       5. Gallery Data & Modal
       ----------------------------------------------------------------- */
    const artworkData = {
        1: {
            title: 'Le Jardin Mystique',
            medium: 'Huile sur toile',
            dimensions: '120 × 150 cm',
            year: 2024,
            available: 'Disponible',
            description: 'Un jardin secret où les fleurs murmurent des secrets oubliés. Chaque pétale est une note dans une symphonie de couleurs sourdes et dorées, où la lumière filtre à travers un feuillage imaginaire.'
        },
        2: {
            title: 'Rêve d\'Améthyste',
            medium: 'Aquarelle',
            dimensions: '60 × 60 cm',
            year: 2023,
            available: 'Vendue',
            description: 'Une rêverie en lavis d\'améthyste et d\'or, capturant l\'instant fugace où la nuit cède le pas à l\'aube dans un champ de lavande imaginaire.'
        },
        3: {
            title: 'Danse des Pivoines',
            medium: 'Encre & Or',
            dimensions: '45 × 45 cm',
            year: 2024,
            available: 'Disponible',
            description: 'Les pivoines s\'élèvent dans une danse éternelle, leurs pétales tourbillonnant en arabesques dorées sur un fond de nuit profonde.'
        },
        4: {
            title: 'L\'Étreinte',
            medium: 'Plume & Encre',
            dimensions: '30 × 40 cm',
            year: 2023,
            available: 'Vendue',
            description: 'Deux formes s\'enlacent dans un mouvement de volutes enlacées — une étude de l\'intimité à travers le langage des lignes whiplash.'
        },
        5: {
            title: 'Miroir Lunaire',
            medium: 'Mixte sur bois',
            dimensions: '25 × 35 cm',
            year: 2024,
            available: 'Disponible',
            description: 'Un miroir de lune flottant au-dessus d\'un paysage onirique, où les reflets deviennent plus réels que la réalité elle-même.'
        },
        6: {
            title: 'La Couronne Dorée',
            medium: 'Or & Acrylique',
            dimensions: '150 × 150 cm',
            year: 2024,
            available: 'Commission',
            description: 'Inspirée par les ornements byzantins et les motifs de Klimt, une exploration de la lumière et du sacré à travers une mosaïque de feuilles d\'or et de pigments précieux.'
        },
        7: {
            title: 'Sérénité Crépusculaire',
            medium: 'Pastel',
            dimensions: '50 × 50 cm',
            year: 2024,
            available: 'Disponible',
            description: 'Les derniers rayons du soleil se dissolvent dans un crépuscule violet et doré, où la nature murmure sa prière du soir.'
        },
        8: {
            title: 'Mystère',
            medium: 'Encre',
            dimensions: '20 × 20 cm',
            year: 2023,
            available: 'Vendue',
            description: 'Un fragment d\'énigme — quelques traits d\'encre suffisent à évoquer un monde caché derrière le voile du visible.'
        },
        9: {
            title: 'Chants de la Forêt',
            medium: 'Technique mixte',
            dimensions: '80 × 100 cm',
            year: 2024,
            available: 'Disponible',
            description: 'Les arbres chantent en fréquences que seuls les cœurs purs peuvent entendre. Cette œuvre capture ces mélodies dans un entrelacement de couleurs et de textures.'
        },
        10: {
            title: 'Volutes',
            medium: 'Plume & Or',
            dimensions: '20 × 50 cm',
            year: 2023,
            available: 'Disponible',
            description: 'Des lignes de plume dansent en volutes élégantes, tracées avec une encre d\'or qui semble vivante et mouvante.'
        },
        11: {
            title: 'Éclat',
            medium: 'Aquarelle',
            dimensions: '18 × 18 cm',
            year: 2023,
            available: 'Vendue',
            description: 'Un éclat fugace de lumière capturé dans la transparence de l\'aquarelle — un instant de grâce entre deux ombres.'
        },
        12: {
            title: 'Harmonie Végétale',
            medium: 'Gouache sur papier',
            dimensions: '70 × 70 cm',
            year: 2024,
            available: 'Disponible',
            description: 'Une symphonie de verts et d\'or où chaque feuille trouve sa place dans une composition d\'une harmonie parfaite.'
        },
        13: {
            title: 'Murmure',
            medium: 'Mine de plomb',
            dimensions: '18 × 24 cm',
            year: 2023,
            available: 'Disponible',
            description: 'Un murmure à peine audible, traduit en graphite et en ombres — l\'art du silence et de la suggestion.'
        },
        14: {
            title: 'Le Souffle des Roses',
            medium: 'Fusain & Pastel',
            dimensions: '180 × 140 cm',
            year: 2024,
            available: 'Commission',
            description: 'Les roses dansent dans un tourbillon de lignes whiplash, capturant le mouvement éternel de la nature dans un souffle de charbon et de pastel.'
        }
    };

    let currentArtworkId = null;

    function initModal() {
        const modal = document.getElementById('art-modal');
        const modalClose = document.getElementById('modal-close');
        const modalTitle = document.getElementById('modal-title');
        const modalMeta = document.getElementById('modal-meta');
        const modalDescription = document.getElementById('modal-description');
        const modalMedium = document.getElementById('modal-medium');
        const modalDimensions = document.getElementById('modal-dimensions');
        const modalYear = document.getElementById('modal-year');
        const modalAvailable = document.getElementById('modal-available');
        const modalImage = document.getElementById('modal-image');
        const modalEnquire = document.getElementById('modal-enquire');

        function openModal(artworkId) {
            const data = artworkData[artworkId];
            if (!data) return;

            currentArtworkId = artworkId;

            // Populate content
            modalTitle.textContent = data.title;
            modalMeta.textContent = data.year + ' — ' + data.medium;
            modalDescription.textContent = data.description;
            modalMedium.textContent = data.medium;
            modalDimensions.textContent = data.dimensions;
            modalYear.textContent = data.year;
            modalAvailable.textContent = data.available;

            // Create SVG placeholder for modal image
            const placeholderSvg = createModalImageSvg(artworkId, data.title);
            modalImage.innerHTML = '';
            modalImage.appendChild(placeholderSvg);

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Trap focus
            modalClose.focus();
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            currentArtworkId = null;
        }

        // Open on gallery item click
        $$('.gallery-item').forEach(function (item) {
            item.addEventListener('click', function (e) {
                var id = parseInt(item.getAttribute('data-id'), 10);
                if (id) openModal(id);
            });

            // Keyboard support
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var id = parseInt(item.getAttribute('data-id'), 10);
                    if (id) openModal(id);
                }
            });
        });

        // Close on X button
        modalClose.addEventListener('click', closeModal);

        // Close on backdrop click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Enquire button
        modalEnquire.addEventListener('click', function () {
            var data = artworkData[currentArtworkId];
            if (data) {
                var subject = encodeURIComponent('Demande — ' + data.title);
                window.location.href = 'mailto:adele@artnouveau.paris?subject=' + subject;
            }
        });
    }

    function createModalImageSvg(id, title) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 400 400');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        // Background
        var bgColors = {
            1: '#1a3c40', 2: '#1a2a4a', 3: '#3c1a2a', 4: '#2a1a3a',
            5: '#1a2a3a', 6: '#1a3c40', 7: '#2a1a2a', 8: '#1a1a2e',
            9: '#1a2a4a', 10: '#2a1a3a', 11: '#1a2a3a', 12: '#1a302a',
            13: '#1a1a2e', 14: '#2a1a1a'
        };

        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '400');
        rect.setAttribute('height', '400');
        rect.setAttribute('fill', bgColors[id] || '#1a2a3a');
        svg.appendChild(rect);

        // Decorative pattern based on id
        var goldColor = '#c9a84c';
        var goldLight = '#d4af37';

        // Central circle
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '200');
        circle.setAttribute('cy', '200');
        circle.setAttribute('r', '100');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', goldColor);
        circle.setAttribute('stroke-width', '1');
        circle.setAttribute('opacity', '0.2');
        svg.appendChild(circle);

        // Title text
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '200');
        text.setAttribute('y', '380');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-family', 'Playfair Display, serif');
        text.setAttribute('font-size', '14');
        text.setAttribute('fill', goldColor);
        text.setAttribute('opacity', '0.4');
        text.textContent = title;
        svg.appendChild(text);

        // Whiplash curves
        var paths = [
            'M50,200 Q120,100 200,150 Q280,200 350,80',
            'M50,250 Q120,180 200,220 Q280,260 350,180',
            'M80,300 Q150,250 220,270 Q290,290 340,240'
        ];

        paths.forEach(function (d) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', goldColor);
            path.setAttribute('stroke-width', '1');
            path.setAttribute('opacity', '0.15');
            svg.appendChild(path);
        });

        // Gold dots
        var dots = [[100, 180], [200, 100], [300, 150], [150, 300], [250, 280]];
        dots.forEach(function (coord) {
            var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', coord[0]);
            dot.setAttribute('cy', coord[1]);
            dot.setAttribute('r', '3');
            dot.setAttribute('fill', goldLight);
            dot.setAttribute('opacity', '0.15');
            svg.appendChild(dot);
        });

        return svg;
    }

    /* -----------------------------------------------------------------
       6. Gallery Item Reveal on Scroll (Intersection Observer)
       ----------------------------------------------------------------- */
    function initGalleryReveal() {
        if (isReducedMotion()) {
            $$('.gallery-item').forEach(function (item) {
                item.style.opacity = '1';
                item.style.transform = 'none';
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        $$('.gallery-item').forEach(function (item) { observer.observe(item); });
    }

    /* -----------------------------------------------------------------
       7. Floating Elements Parallax
       ----------------------------------------------------------------- */
    function initFloatingElements() {
        if (isReducedMotion() || 'ontouchstart' in window) return;

        var floatingElements = $$('.floating-element');
        var heroSection = document.querySelector('.hero-section');

        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            var heroHeight = heroSection ? heroSection.offsetHeight : 600;
            var scrollProgress = Math.min(scrollY / heroHeight, 1);

            floatingElements.forEach(function (el, index) {
                var speed = (index + 1) * 0.08;
                var yOffset = scrollProgress * (index % 2 === 0 ? -30 : 30) * speed * 10;
                var xOffset = Math.sin(scrollProgress * Math.PI) * (index % 2 === 0 ? 15 : -15);
                el.style.transform = 'translate(' + xOffset + 'px, ' + yOffset + 'px)';
            });
        }, { passive: true });
    }

    /* -----------------------------------------------------------------
       8. Ornamental Divider Inview Animation
       ----------------------------------------------------------------- */
    function initDividerAnimations() {
        if (isReducedMotion()) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });

        $$('.ornamental-divider').forEach(function (div) {
            div.style.opacity = '0';
            div.style.transform = 'translateY(20px)';
            div.style.transition = 'opacity 1s ease, transform 1s ease';
            observer.observe(div);
        });
    }

    /* -----------------------------------------------------------------
       9. Section Fade-In on Scroll
       ----------------------------------------------------------------- */
    function initSectionReveal() {
        if (isReducedMotion()) {
            $$('section').forEach(function (s) {
                s.style.opacity = '1';
                s.style.transform = 'none';
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

        $$('section').forEach(function (section) {
            // Only animate sections that have the section reveal class or are main sections
            if (['gallery-section', 'about-section', 'exhibitions-section', 'contact-section'].indexOf(section.classList[0]) !== -1) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(section);
            }
        });
    }

    /* -----------------------------------------------------------------
       10. Gold Leaf Shimmer on Art Frames (Continuous subtle animation)
       ----------------------------------------------------------------- */
    function initGoldLeafAnimation() {
        if (isReducedMotion()) return;

        var goldLeaves = $$('.gold-leaf-accent');

        // On mouse near art frames, enhance the gold leaf
        $$('.art-frame').forEach(function (frame) {
            frame.addEventListener('mouseenter', function () {
                var goldLeaf = frame.querySelector('.gold-leaf-accent');
                if (goldLeaf) {
                    goldLeaf.style.boxShadow = '0 0 20px rgba(201, 168, 76, 0.6), 0 0 40px rgba(201, 168, 76, 0.2)';
                }
            });

            frame.addEventListener('mouseleave', function () {
                var goldLeaf = frame.querySelector('.gold-leaf-accent');
                if (goldLeaf) {
                    goldLeaf.style.boxShadow = '0 0 15px var(--gold-glow), 0 0 30px rgba(201, 168, 76, 0.1)';
                }
            });
        });
    }

    /* -----------------------------------------------------------------
       11. Typing Effect for Hero Greeting (Subtle)
       ----------------------------------------------------------------- */
    function initHeroEffects() {
        if (isReducedMotion()) return;

        var greeting = document.querySelector('.hero-greeting');
        if (!greeting) return;

        // Gentle opacity pulse
        setInterval(function () {
            greeting.style.transition = 'opacity 2s ease';
            greeting.style.opacity = '0.5';
            setTimeout(function () {
                greeting.style.opacity = '0.8';
            }, 2000);
        }, 6000);
    }

    /* -----------------------------------------------------------------
       12. Counter Animation for Exhibition Items on Scroll
       ----------------------------------------------------------------- */
    function initExhibitionAnimations() {
        if (isReducedMotion()) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var content = entry.target.querySelector('.exhibition-content');
                    if (content) {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }
                }
            });
        }, { threshold: 0.2 });

        $$('.exhibition-item').forEach(function (item) {
            var content = item.querySelector('.exhibition-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
                content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                // Alternate direction
                var isRight = item.querySelector('.right') !== null;
                content.style.transform = isRight
                    ? 'translateY(20px) translateX(20px)'
                    : 'translateY(20px) translateX(-20px)';
            }
            observer.observe(item);
        });
    }

    /* -----------------------------------------------------------------
       13. Dynamic Year in Footer
       ----------------------------------------------------------------- */
    function initFooter() {
        var footerMade = document.querySelector('.footer-made');
        if (footerMade) {
            var year = new Date().getFullYear();
            footerMade.textContent = 'Fait avec \u2726 et de l\'encre d\'or — ' + year;
        }
    }

    /* -----------------------------------------------------------------
       14. Hash Change Handler (for direct navigation)
       ----------------------------------------------------------------- */
    function initHashHandler() {
        window.addEventListener('hashchange', function () {
            var hash = window.location.hash;
            if (hash) {
                var target = document.querySelector(hash);
                if (target) {
                    var navHeight = document.getElementById('main-nav').offsetHeight;
                    setTimeout(function () {
                        window.scrollTo({
                            top: target.offsetTop - navHeight - 10,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        });
    }

    /* -----------------------------------------------------------------
       15. Lazy-load Optimization — Intersection Observer for SVGs
       ----------------------------------------------------------------- */
    function initLazySVGs() {
        if (!('IntersectionObserver' in window)) return;

        var svgObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    svgObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        $$('.frame-decoration').forEach(function (svg) {
            svg.style.transition = 'opacity 1s ease';
            svg.style.opacity = '0';
            svgObserver.observe(svg);
        });
    }

    /* -----------------------------------------------------------------
       INITIALIZATION
       ----------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initLoadingScreen();
        initNavigation();
        initSmoothScroll();
        initCursorGlow();
        initModal();
        initGalleryReveal();
        initFloatingElements();
        initDividerAnimations();
        initSectionReveal();
        initGoldLeafAnimation();
        initHeroEffects();
        initExhibitionAnimations();
        initFooter();
        initHashHandler();
        initLazySVGs();
    });

    // Handle page reload with hash
    if (window.location.hash) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                var target = document.querySelector(window.location.hash);
                if (target) {
                    var navHeight = document.getElementById('main-nav').offsetHeight;
                    window.scrollTo({
                        top: target.offsetTop - navHeight - 10,
                        behavior: 'smooth'
                    });
                }
            }, 2000); // Wait for loading screen
        });
    }

})();