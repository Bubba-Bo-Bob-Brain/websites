/* =====================================================
ART NOUVEAU ARTIST PORTFOLIO - SCRIPTS
Élise Moreau | A Celebration of Organic Beauty
===================================================== */

/**
 * Main Application Class
 * Handles all interactive functionality for the Art Nouveau portfolio
 */
class ArtNouveauPortfolio {
    constructor() {
        this.artworkData = {};
        this.init();
    }

    /**
     * Initialize all modules and event listeners
     */
    init() {
        this.setupArtworkData();
        this.setupLoadingScreen();
        this.setupCustomCursor();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupGallery();
        this.setupTestimonials();
        this.setupModal();
        this.setupContactForm();
        this.setupScrollAnimations();
        this.setupParallax();
        this.setupSmoothScroll();
    }

    /**
     * Setup artwork data for modal
     */
    setupArtworkData() {
        this.artworkData = {
            1: {
                title: 'La Danse des Papillons',
                year: '2024',
                medium: 'Mixed media sur toile',
                dimensions: '120 × 150 cm',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop',
                description: 'Une célébration majestueuse de la transformation et de la liberté, cette œuvre capture le moment éphémère où les papillons s\'élèvent dans une danse éternelle.'
            },
            2: {
                title: 'Fleur de Lys Dorée',
                year: '2023',
                medium: 'Huile sur toile',
                dimensions: '80 × 100 cm',
                image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&h=800&fit=crop',
                description: 'L\'iris royal, symbole de sagesse et d\'espoir, prend vie dans cette représentation majestueuse.'
            },
            3: {
                title: 'Nymphes au Crépuscule',
                year: '2024',
                medium: 'Aquarelle et encre',
                dimensions: '60 × 80 cm',
                image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=600&h=800&fit=crop',
                description: 'Au crépuscule, les nymphes des bois émergent de l\'ombre, gardiennes des secrets de la forêt.'
            },
            4: {
                title: 'Le Jardin Secret',
                year: '2023',
                medium: 'Installation mixed media',
                dimensions: '200 × 120 cm',
                image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1000&h=600&fit=crop',
                description: 'Une installation immersive qui invite le spectateur à entrer dans un jardin secret.'
            },
            5: {
                title: 'Iris Bleue',
                year: '2024',
                medium: 'Huile sur toile',
                dimensions: '50 × 70 cm',
                image: 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=600&h=800&fit=crop',
                description: 'Un hommage intime à la fleur emblématique du mouvement Art Nouveau.'
            },
            6: {
                title: 'La Dame au Paon',
                year: '2022',
                medium: 'Illustration poster',
                dimensions: '70 × 100 cm',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop',
                description: 'Dans l\'esprit des affiches de Mucha, cette illustration présente une figure féminine majestueuse.'
            },
            7: {
                title: 'Vases Fleuris',
                year: '2023',
                medium: 'Céramique sculptée',
                dimensions: '45 × 60 cm',
                image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=800&fit=crop',
                description: 'Des vases en céramique ornés de motifs floraux traditionnels.'
            },
            8: {
                title: 'Magnolia Royal',
                year: '2024',
                medium: 'Huile et feuille d\'or sur toile',
                dimensions: '150 × 180 cm',
                image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=1000&fit=crop',
                description: 'L\'œuvre maîtresse de l\'artiste, ce magnolia impérial est rendu dans des tons de rose pâle et d\'ivoire.'
            }
        };
    }

    /**
     * Loading Screen Animation
     */
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        const loadingProgress = document.querySelector('.loading-progress');
        let progress = 0;
        const loadingDuration = 2000;
        const interval = loadingDuration / 100;

        const progressInterval = setInterval(() => {
            progress += Math.random() * 5 + 1;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    document.body.classList.remove('loading');
                    this.animateHeroOnLoad();
                }, 300);
            }
            if (loadingProgress) {
                loadingProgress.style.width = progress + '%';
            }
        }, interval);
    }

    /**
     * Animate Hero Elements After Loading
     */
    animateHeroOnLoad() {
        const heroElements = document.querySelectorAll('.hero-subtitle, .hero-title .title-line, .hero-tagline, .hero-divider, .hero-cta');
        heroElements.forEach((el) => {
            el.style.animationPlayState = 'running';
        });
    }

    /**
     * Custom Cursor Functionality
     */
    setupCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');

        if (!cursor || !cursorDot || !cursorRing) return;

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        };
        animateRing();

        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .filter-btn, .social-link, input, textarea, select');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    }

    /**
     * Navigation Functionality
     */
    setupNavigation() {
        const header = document.getElementById('header');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        mobileToggle?.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu?.classList.toggle('active');
            document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        });

        this.setupActiveNavOnScroll();
    }

    /**
     * Active Navigation Link on Scroll
     */
    setupActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    /**
     * Scroll Effects
     */
    setupScrollEffects() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            window.addEventListener('scroll', () => {
                scrollIndicator.style.opacity = window.pageYOffset > 200 ? '0' : '1';
            });
        }
    }

    /**
     * Gallery Functionality
     */
    setupGallery() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                galleryItems.forEach(item => {
                    const category = item.dataset.category;
                    if (filter === 'all' || category === filter) {
                        this.showGalleryItem(item);
                    } else {
                        this.hideGalleryItem(item);
                    }
                });
            });
        });

        const viewBtns = document.querySelectorAll('.artwork-view');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openArtworkModal(btn.dataset.artwork);
            });
        });
    }

    /**
     * Show Gallery Item
     */
    showGalleryItem(item) {
        item.style.display = 'block';
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 50);
    }

    /**
     * Hide Gallery Item
     */
    hideGalleryItem(item) {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            item.style.display = 'none';
        }, 300);
    }

    /**
     * Modal Setup
     */
    setupModal() {
        const modal = document.getElementById('artworkModal');
        const modalClose = document.querySelector('.modal-close');
        const modalBackdrop = document.querySelector('.modal-backdrop');

        modalClose?.addEventListener('click', () => this.closeArtworkModal());
        modalBackdrop?.addEventListener('click', () => this.closeArtworkModal());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                this.closeArtworkModal();
            }
        });
    }

    /**
     * Open Artwork Modal
     */
    openArtworkModal(artworkId) {
        const modal = document.getElementById('artworkModal');
        const artwork = this.artworkData[artworkId];

        if (!modal || !artwork) return;

        document.getElementById('modalImage').src = artwork.image;
        document.getElementById('modalImage').alt = artwork.title;
        document.getElementById('modalYear').textContent = artwork.year;
        document.getElementById('modalTitle').textContent = artwork.title;
        document.getElementById('modalMedium').textContent = artwork.medium;
        document.getElementById('modalDimensions').textContent = artwork.dimensions;
        document.getElementById('modalDescription').textContent = artwork.description;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close Artwork Modal
     */
    closeArtworkModal() {
        const modal = document.getElementById('artworkModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Testimonials Carousel
     */
    setupTestimonials() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');

        if (slides.length === 0) return;

        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoPlayInterval;

        const showSlide = (index) => {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;

            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                    slide.style.animation = 'none';
                    requestAnimationFrame(() => {
                        slide.style.animation = 'fade-in 0.6s ease';
                    });
                }
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            currentSlide = index;
        };

        prevBtn?.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn?.addEventListener('click', () => showSlide(currentSlide + 1));

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => showSlide(currentSlide + 1), 6000);
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        const carousel = document.querySelector('.testimonials-carousel');
        carousel?.addEventListener('mouseenter', stopAutoPlay);
        carousel?.addEventListener('mouseleave', startAutoPlay);

        startAutoPlay();

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        });

        carousel?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    showSlide(currentSlide + 1);
                } else {
                    showSlide(currentSlide - 1);
                }
            }
            startAutoPlay();
        });
    }

    /**
     * Contact Form Handling
     */
    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm(form)) {
                this.submitForm(form);
            }
        });

        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    /**
     * Validate Single Input
     */
    validateInput(input) {
        const value = input.value.trim();
        let valid = true;

        if (input.required && !value) valid = false;
        if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) valid = false;

        if (!valid) {
            input.classList.add('error');
            this.showError(input, 'Ce champ est requis ou invalide');
        } else {
            this.clearError(input);
        }

        return valid;
    }

    /**
     * Validate Entire Form
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('.form-input');
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateInput(input)) isValid = false;
        });
        return isValid;
    }

    /**
     * Show Error Message
     */
    showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        let errorEl = formGroup.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.style.cssText = 'position: absolute; bottom: -20px; left: 0; font-size: 0.8rem; color: #a45a3e;';
            formGroup.style.position = 'relative';
            formGroup.appendChild(errorEl);
        }
        errorEl.textContent = message;
        input.style.borderColor = '#a45a3e';
    }

    /**
     * Clear Error
     */
    clearError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup?.querySelector('.error-message');
        if (errorEl) errorEl.remove();
    }

    /**
     * Submit Form
     */
    submitForm(form) {
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.querySelector('.submit-text').textContent;

        submitBtn.disabled = true;
        submitBtn.querySelector('.submit-text').textContent = 'Envoi en cours...';
        submitBtn.querySelector('.submit-text').style.opacity = '0.7';

        setTimeout(() => {
            submitBtn.querySelector('.submit-text').textContent = 'Message envoye!';
            submitBtn.style.background = '#3d7a7a';
            form.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector('.submit-text').textContent = originalText;
                submitBtn.querySelector('.submit-text').style.opacity = '1';
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);
    }

    /**
     * Scroll Animations with Intersection Observer
     */
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.section-header, .bio-paragraph, .artistic-statement, .exhibitions-list, .contact-card, .contact-form-container');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

        this.observeGalleryItems();
    }

    /**
     * Observe Gallery Items
     */
    observeGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(40px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }

    /**
     * Parallax Effects
     */
    setupParallax() {
        const floatingBotanicals = document.querySelectorAll('.floating-botanical');
        if (floatingBotanicals.length === 0) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    floatingBotanicals.forEach((el, index) => {
                        const speed = 0.05 + (index * 0.02);
                        const rotation = scrollY * 0.02 * (index % 2 === 0 ? 1 : -1);
                        el.style.transform = 'translateY(' + (scrollY * speed) + 'px) rotate(' + rotation + 'deg)';
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });

        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                const xPercent = (clientX / innerWidth - 0.5) * 2;
                const yPercent = (clientY / innerHeight - 0.5) * 2;

                const portrait = document.querySelector('.hero-portrait');
                const heroText = document.querySelector('.hero-text');

                if (portrait) portrait.style.transform = 'translate(' + (xPercent * 10) + 'px, ' + (yPercent * 5) + 'px)';
                if (heroText) heroText.style.transform = 'translate(' + (xPercent * -5) + 'px, ' + (yPercent * -3) + 'px)';
            });

            hero.addEventListener('mouseleave', () => {
                const portrait = document.querySelector('.hero-portrait');
                const heroText = document.querySelector('.hero-text');
                if (portrait) portrait.style.transform = '';
                if (heroText) heroText.style.transform = '';
            });
        }
    }

    /**
     * Smooth Scroll
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/**
 * Initialize Portfolio when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new ArtNouveauPortfolio();
});

/**
 * Image Lazy Loading
 */
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => img.classList.add('loaded'));
    });
});

/**
 * Add Error Animation Style
 */
const lazyImageStyles = document.createElement('style');
lazyImageStyles.textContent = `
    img { transition: opacity 0.5s ease; }
    img:not(.loaded) { opacity: 0; }
    img.loaded { opacity: 1; }
    .form-input.error {
        border-color: #a45a3e !important;
        animation: shake 0.5s ease;
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(lazyImageStyles);

/**
 * Accessibility - Focus Visible Styles
 */
const focusVisibleStyles = document.createElement('style');
focusVisibleStyles.textContent = `
    :focus-visible {
        outline: 2px solid #c9a227;
        outline-offset: 4px;
    }
    :focus:not(:focus-visible) {
        outline: none;
    }
`;
document.head.appendChild(focusVisibleStyles);

/**
 * Accessibility - Skip to Content Link
 */
const skipLink = document.createElement('a');
skipLink.href = '#gallery';
skipLink.className = 'sr-only';
skipLink.textContent = 'Aller au contenu principal';
skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#gallery')?.focus();
    document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
});
document.body.prepend(skipLink);

/**
 * Reduced Motion Preference
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-slow', '0s');
    document.documentElement.style.setProperty('--transition-medium', '0s');
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('animated'));
}

/**
 * Console Easter Egg
 */
console.log('%c🌿 Art Nouveau Portfolio loaded successfully', 'color: #1a4d3e; font-size: 14px;');