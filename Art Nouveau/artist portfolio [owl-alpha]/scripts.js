/* =============================================
   ELOISE BEAUMONT - Art Nouveau Portfolio
   Interactive Behaviors & Animations
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {

    /* --- Artwork Data for Modal --- */
    var artworksData = {
        1: {
            title: 'Le Jardin Secret',
            meta: 'Huile sur toile, feuille d\'or - 1923',
            description: 'Une composition onirique ou une figure feminine se fond dans un jardin luxuriant de roses et de lys. Les feuilles d\'or captent la lumiere, creant un effet de transfiguration mystique. Cette oeuvre majeure represente l\'apogee du style d\'Eloise Beaumont, fusionnant la tradition Mucha avec une sensibilite personnelle unique.'
        },
        2: {
            title: 'La Dame aux Iris',
            meta: 'Aquarelle et encre - 1921',
            description: 'Portrait d\'une elegante entouree d\'iris violets et bleus, peints avec une delicatesse remarquable. Les lignes sinueuses de la robe se melent aux tiges florales, creant une harmonie visuelle typique de l\'Art Nouveau. La palette de couleurs evoque un jardin au crepuscule.'
        },
        3: {
            title: 'Panneau Floral No.7',
            meta: 'Technique mixte sur bois - 1925',
            description: 'Septieme panneau d\'une serie decorative commandee pour un hotel particulier parisien. L\'entrelacs de pivoines, de glycines et de feuillages dores cree un rythme visuel hypnotique. Le bois est travaille en bas-relief avant l\'application des pigments et de la feuille d\'or.'
        },
        4: {
            title: 'Crepuscule Dore',
            meta: 'Huile sur toile, feuille d\'or - 1924',
            description: 'Un paysage baigne dans la lumiere declinante du soleil, ou chaque element semble impregne d\'une dorure surnaturelle. Les arbres se tordent en arabesques elegantes et le ciel se fond dans un degrade de pourpre et d\'or. Une meditation picturale sur la beaute ephemere du temps qui passe.'
        },
        5: {
            title: 'Les Quatre Saisons',
            meta: 'Lithographie, edition limitee - 1922',
            description: 'Suite de quatre lithographies representant les saisons sous les traits de figures feminines allegoriques. Chaque saison est associee a un florilege specific: primeveres pour le printemps, tournesols pour l\'ete, chrysanthemes pour l\'automne ethellebores pour l\'hiver. Tiree a seulement 200 exemplaires.'
        },
        6: {
            title: 'Vitre de Lys',
            meta: 'Vitrail, plomb et verre colore - 1926',
            description: 'Un chef-d\'oeuvre de vitrail monumental inspire des lys du jardin du Luxembourg. Les morceaux de verre souffle, dans des teintes allant du blanc nacre au violet profond, sont assembles par des baguettes de plomb qui dessinent les contours floraux. La lumiere traversant cette oeuvre cree un jeu de couleurs perpetuellement changeant.'
        }
    };

    /* --- Navigation Scroll Behavior --- */
    var mainNav = document.getElementById('mainNav');

    function handleNavScroll() {
        var currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    /* --- Smooth Scroll for Navigation Links --- */
    var navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = link.getAttribute('href');
            var targetSection = document.querySelector(targetId);

            if (targetSection) {
                var navHeight = mainNav.offsetHeight;
                var targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- Active Navigation Highlighting --- */
    var sections = document.querySelectorAll('.section, .hero');

    function highlightActiveNav() {
        var scrollPosition = window.scrollY + mainNav.offsetHeight + 100;

        sections.forEach(function(section) {
            var sectionTop = section.offsetTop;
            var sectionBottom = sectionTop + section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(function(navLink) {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === '#' + sectionId) {
                        navLink.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    /* --- Parallax Effects --- */
    var heroMedallion = document.querySelector('.hero-medallion');
    var heroContent = document.querySelector('.hero-content');
    var vineBorders = document.querySelectorAll('.vine-border');

    function handleParallax() {
        var scrollY = window.scrollY;
        var heroElement = document.querySelector('.hero');
        var heroHeight = heroElement ? heroElement.offsetHeight : 800;

        if (scrollY < heroHeight) {
            var progress = scrollY / heroHeight;

            if (heroMedallion) {
                heroMedallion.style.transform = 'translate(-50%, -50%) rotate(' + (progress * 180) + 'deg) scale(' + (1 + progress * 0.1) + ')';
                heroMedallion.style.opacity = 1 - progress * 0.5;
            }

            if (heroContent) {
                heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
                heroContent.style.opacity = 1 - progress * 1.5;
            }

            vineBorders.forEach(function(border, index) {
                var direction = index === 0 ? -1 : 1;
                border.style.transform = 'translateX(' + (direction * scrollY * 0.05) + 'px)';
            });
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    /* --- Gallery Filtering --- */
    var filterBtns = document.querySelectorAll('.filter-btn');
    var artworkCards = document.querySelectorAll('.artwork-card');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = btn.getAttribute('data-filter');

            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            artworkCards.forEach(function(card) {
                var category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'artworkReveal 0.6s ease-out forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* --- Artwork Modal --- */
    var modal = document.getElementById('artworkModal');
    var modalBackdrop = modal.querySelector('.modal-backdrop');
    var modalClose = modal.querySelector('.modal-close');
    var modalImage = document.getElementById('modalImage');
    var modalTitle = document.getElementById('modalTitle');
    var modalMeta = document.getElementById('modalMeta');
    var modalDescription = document.getElementById('modalDescription');
    var viewBtns = document.querySelectorAll('.artwork-view-btn');

    function openModal(artworkId) {
        var data = artworksData[artworkId];
        var card = document.querySelector('.artwork-card[data-artwork="' + artworkId + '"]');
        var cardImage = card.querySelector('.artwork-image');

        modalImage.src = cardImage.src;
        modalImage.alt = cardImage.alt;
        modalTitle.textContent = data.title;
        modalMeta.textContent = data.meta;
        modalDescription.textContent = data.description;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    viewBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var card = btn.closest('.artwork-card');
            var artworkId = card.getAttribute('data-artwork');
            openModal(artworkId);
        });
    });

    modalBackdrop.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /* --- Scroll Reveal Animations --- */
    var revealObserver = null;

    function setupRevealObserver() {
        var revealElements = document.querySelectorAll(
            '.artwork-card, .exhibition-item, .contact-card, .about-portrait-frame, .about-text'
        );

        revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function(el) {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }

    setupRevealObserver();

    /* --- Timeline Marker Pulse --- */
    var markers = document.querySelectorAll('.exhibition-marker');

    var markerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var svg = entry.target.querySelector('.marker-svg');
                svg.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                svg.style.transform = 'scale(1.3)';
                setTimeout(function() {
                    svg.style.transform = 'scale(1)';
                }, 600);
                markerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    markers.forEach(function(marker) {
        markerObserver.observe(marker);
    });

    /* --- Gold Dust Dynamic Particles --- */
    var goldContainer = document.querySelector('.gold-dust-container');

    function createDynamicParticle() {
        var particle = document.createElement('div');
        particle.classList.add('gold-particle');

        var size = Math.random() * 3 + 1;
        var x = Math.random() * 100;
        var delay = Math.random() * 5;
        var duration = Math.random() * 8 + 8;

        particle.style.left = x + '%';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.setProperty('--x', x + '%');
        particle.style.setProperty('--size', size + 'px');
        particle.style.setProperty('--delay', delay + 's');
        particle.style.animationDuration = duration + 's';

        goldContainer.appendChild(particle);

        setTimeout(function() {
            particle.remove();
        }, (duration + delay) * 1000);
    }

    setInterval(createDynamicParticle, 2000);

    /* --- Vine Border Hover Effect --- */
    var leftVine = document.querySelector('.vine-border--left');
    var rightVine = document.querySelector('.vine-border--right');

    function enhanceVines() {
        if (window.innerWidth > 1024) {
            document.addEventListener('mousemove', function(e) {
                var xRatio = e.clientX / window.innerWidth;

                if (leftVine) {
                    leftVine.style.opacity = 0.15 + (1 - xRatio) * 0.2;
                }
                if (rightVine) {
                    rightVine.style.opacity = 0.15 + xRatio * 0.2;
                }
            });
        }
    }

    enhanceVines();

    /* --- Typing Effect for Hero Tagline --- */
    var heroTagline = document.querySelector('.hero-tagline');

    function setupTaglineEffect() {
        if (!heroTagline) {
            return;
        }

        var originalText = heroTagline.textContent;
        heroTagline.style.opacity = '1';

        var taglineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var index = 0;
                    heroTagline.textContent = '';

                    function typeChar() {
                        if (index < originalText.length) {
                            heroTagline.textContent += originalText[index];
                            index++;
                            setTimeout(typeChar, 40);
                        }
                    }

                    setTimeout(typeChar, 1200);
                    taglineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        taglineObserver.observe(heroTagline);
    }

    setupTaglineEffect();

    /* --- Stained Glass Mouse Light Effect --- */
    var stainedOverlay = document.querySelector('.stained-glass-overlay');

    if (stainedOverlay) {
        document.addEventListener('mousemove', function(e) {
            var xPercent = (e.clientX / window.innerWidth) * 100;
            var yPercent = (e.clientY / window.innerHeight) * 100;

            stainedOverlay.style.background = 'radial-gradient(circle at ' + xPercent + '% ' + yPercent + '%, rgba(201, 168, 76, 0.08) 0%, transparent 30%), conic-gradient(from 0deg at 30% 20%, rgba(201, 168, 76, 0.12) 0deg, transparent 60deg, rgba(45, 90, 61, 0.08) 120deg, transparent 180deg), conic-gradient(from 120deg at 70% 80%, rgba(107, 45, 62, 0.1) 0deg, transparent 60deg, rgba(30, 58, 95, 0.08) 120deg, transparent 180deg), conic-gradient(from 240deg at 50% 50%, rgba(107, 76, 138, 0.06) 0deg, transparent 90deg)';
        });
    }

    /* --- Gallery Card Tilt Effect --- */
    var cards = document.querySelectorAll('.artwork-card');

    cards.forEach(function(card) {
        var frame = card.querySelector('.artwork-frame');

        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;

            var rotateX = (y - centerY) / 30;
            var rotateY = (centerX - x) / 30;

            frame.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            frame.style.transform = '';
        });
    });

    /* --- Iris & Lily Divider Sway on Scroll --- */
    var irisDivider = document.querySelector('.iris-divider');
    var lilyDivider = document.querySelector('.lily-divider');

    function handleDividerSway() {
        var scrollY = window.scrollY;

        if (irisDivider) {
            var irisFlowers = irisDivider.querySelectorAll('.iris-flower');
            irisFlowers.forEach(function(flower, index) {
                var offset = Math.sin((scrollY * 0.002) + index) * 3;
                flower.style.transform = 'translate(' + offset + 'px, ' + (offset * 0.5) + 'px)';
            });
        }

        if (lilyDivider) {
            var lilyFlowers = lilyDivider.querySelectorAll('.lily-flower');
            lilyFlowers.forEach(function(flower, index) {
                var offset = Math.sin((scrollY * 0.0015) + index * 1.5) * 4;
                flower.style.transform = 'translate(' + offset + 'px, ' + (Math.abs(offset) * 0.3) + 'px) rotate(' + (offset * 0.5) + 'deg)';
            });
        }
    }

    window.addEventListener('scroll', handleDividerSway, { passive: true });

    /* --- Exhibition Content Hover Gold Effect --- */
    var exhibitionContents = document.querySelectorAll('.exhibition-content');

    exhibitionContents.forEach(function(content) {
        content.addEventListener('mouseenter', function() {
            content.style.borderColor = 'rgba(201, 168, 76, 0.4)';
        });

        content.addEventListener('mouseleave', function() {
            content.style.borderColor = 'rgba(201, 168, 76, 0.1)';
        });
    });

    /* --- Loading Sequence --- */
    function triggerEntryAnimations() {
        document.body.classList.add('loaded');
    }

    if (document.readyState === 'complete') {
        triggerEntryAnimations();
    } else {
        window.addEventListener('load', triggerEntryAnimations);
    }

    /* --- Reduce Motion Preference --- */
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.documentElement.style.scrollBehavior = 'auto';

        var animatedElements = document.querySelectorAll(
            '.medallion-svg, .portrait-outer-ring, .vine-path, .vine-leaf, .vine-tendril, .gold-particle, .stained-glass-overlay'
        );

        animatedElements.forEach(function(el) {
            el.style.animation = 'none';
        });
    }

    /* --- Console Easter Egg --- */
    console.log(
        '%c~ Bienvenue dans le Jardin d\'Eloise Beaumont ~',
        'color: #c9a84c; font-size: 16px; font-family: Georgia, serif; padding: 10px 0;'
    );
    console.log(
        '%c"L\'art est la fleur de la vie, et la vie est l\'art de la fleur."',
        'color: #c4918a; font-style: italic; font-size: 12px; padding: 5px 0;'
    );
});