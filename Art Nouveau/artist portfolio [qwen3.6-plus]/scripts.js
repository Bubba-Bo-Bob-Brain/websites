/* ============================================
   ART NOUVEAU PORTFOLIO - JAVASCRIPT
   Élise Moreau — Organic, Flowing Interactions
   ============================================ */

(function() {
    'use strict';

    // --- 1. UTILITY FUNCTIONS ---
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    // --- 2. LOADER ---
    function initLoader() {
        const loader = $('#loader');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
                
                // Trigger hero animations after loader hides
                setTimeout(() => {
                    $$('.reveal-text').forEach((el, i) => {
                        setTimeout(() => {
                            el.classList.add('visible');
                        }, i * 150);
                    });
                }, 300);
            }, 1500); // Minimum loader display time
        });
    }

    // --- 3. CUSTOM CURSOR ---
    function initCursor() {
        const cursor = $('#cursor');
        const follower = $('#cursor-follower');
        
        if (!cursor || !follower) return;
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor animation
        function animateCursor() {
            // Cursor follows tightly
            cursorX += (mouseX - cursorX) * 0.3;
            cursorY += (mouseY - cursorY) * 0.3;
            cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
            
            // Follower follows with delay
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
        
        // Hover effects
        const hoverElements = $$('a, button, .gallery-item, input, textarea, select');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });
    }

    // --- 4. SCROLL REVEAL ---
    function initScrollReveal() {
        const revealElements = $$('.reveal, .reveal-left, .reveal-right');
        
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: unobserve after revealing
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        revealElements.forEach(el => observer.observe(el));
    }

    // --- 5. NAVIGATION ---
    function initNavigation() {
        const nav = $('#mainNav');
        const navLinks = $$('.nav-link');
        const sections = $$('section[id]');
        const navToggle = $('#navToggle');
        
        // Scroll effect for navbar
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
        
        // Active section highlighting
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        };
        
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
        }, observerOptions);
        
        sections.forEach(section => sectionObserver.observe(section));
        
        // Smooth scroll for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = $(targetId);
                
                if (target) {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Mobile toggle (basic implementation)
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                const navLinksContainer = $('.nav-links');
                if (navLinksContainer) {
                    navLinksContainer.classList.toggle('mobile-open');
                }
            });
        }
    }

    // --- 6. LIGHTBOX ---
    function initLightbox() {
        const lightbox = $('#lightbox');
        const lightboxImage = $('#lightboxImage');
        const lightboxTitle = $('#lightboxTitle');
        const lightboxDetails = $('#lightboxDetails');
        const lightboxDescription = $('#lightboxDescription');
        const lightboxClose = $('#lightboxClose');
        const lightboxPrev = $('#lightboxPrev');
        const lightboxNext = $('#lightboxNext');
        
        let galleryItems = $$('.gallery-item');
        let currentIndex = 0;
        
        // Store descriptions for each item (could be fetched from data attributes or external source)
        const descriptions = {
            'The Enchanted Iris': 'A meditation on the regal iris, its petals rendered in layers of translucent glaze and accented with delicate gold leaf veining.',
            'Peacock Reverie': 'Inspired by the iridescent beauty of the peacock, this watercolor captures the mesmerizing display of feathers in full fan.',
            'Lily Pond Dreams': 'A contemporary interpretation of the classic water lily motif, rendered in soft oils that capture the play of light on still water.',
            'The Golden Wisteria': 'Cascading wisteria rendered in oil with gold leaf accents, capturing the ethereal beauty of spring in full bloom.',
            'Stained Glass Garden': 'A digital and traditional hybrid piece that mimics the luminous quality of Art Nouveau stained glass windows.',
            'The Sunflower Maiden': 'A portrait inspired by the sunflower fields of Provence, where botanical elements merge with the human form.',
            'Byzantine Bloom': 'A tribute to Klimt\'s golden period, this piece merges Byzantine mosaic aesthetics with the flowing forms of Art Nouveau botanical illustration.'
        };
        
        function openLightbox(index) {
            currentIndex = index;
            updateLightboxContent();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        function updateLightboxContent() {
            const item = galleryItems[currentIndex];
            const img = item.querySelector('img');
            const title = item.dataset.title || '';
            const year = item.dataset.year || '';
            const medium = item.dataset.medium || '';
            
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxTitle.textContent = title;
            lightboxDetails.textContent = `${medium} — ${year}`;
            lightboxDescription.textContent = descriptions[title] || 'An exquisite Art Nouveau work by Élise Moreau.';
        }
        
        function navigate(direction) {
            currentIndex += direction;
            
            if (currentIndex < 0) currentIndex = galleryItems.length - 1;
            if (currentIndex >= galleryItems.length) currentIndex = 0;
            
            // Add subtle transition
            lightboxContent.style.opacity = '0';
            lightboxContent.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                updateLightboxContent();
                lightboxContent.style.opacity = '1';
                lightboxContent.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Event listeners
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });
        
        lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        lightboxPrev.addEventListener('click', () => navigate(-1));
        lightboxNext.addEventListener('click', () => navigate(1));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }

    // --- 7. FORM INTERACTION ---
    function initForm() {
        const form = $('#contactForm');
        
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.querySelector('.submit-text').textContent;
            
            // Simulate sending
            submitBtn.querySelector('.submit-text').textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
            
            setTimeout(() => {
                submitBtn.querySelector('.submit-text').textContent = 'Inquiry Sent ✓';
                submitBtn.style.background = 'linear-gradient(135deg, var(--peacock) 0%, var(--sage) 100%)';
                
                setTimeout(() => {
                    form.reset();
                    submitBtn.querySelector('.submit-text').textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
        
        // Input focus effects
        const inputs = $$('.form-input, .form-textarea, .form-select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.form-group').classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.closest('.form-group').classList.remove('focused');
            });
        });
    }

    // --- 8. PARALLAX EFFECTS ---
    function initParallax() {
        const heroDecor = $$('.hero-decor');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            heroDecor.forEach((el, i) => {
                const speed = 0.3 + (i * 0.1);
                el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
            });
        });
        
        // Mouse parallax for hero
        const hero = $('#hero');
        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                heroDecor.forEach((el, i) => {
                    const depth = 20 + (i * 10);
                    el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
                });
            });
        }
    }

    // --- 9. GALLERY ITEM HOVER TILT ---
    function initGalleryTilt() {
        const items = $$('.gallery-item');
        
        items.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -3;
                const rotateY = (x - centerX) / centerX * 3;
                
                item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                item.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
            
            item.addEventListener('mouseenter', () => {
                item.style.transition = 'none';
            });
        });
    }

    // --- 10. STAT COUNTER ANIMATION ---
    function initStatCounters() {
        const stats = $$('.stat-number');
        let animated = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        const statsContainer = $('.about-stats');
        if (statsContainer) observer.observe(statsContainer);
        
        function animateStats() {
            stats.forEach(stat => {
                const target = stat.textContent;
                const isPercentage = target.includes('+');
                const num = parseInt(target);
                let current = 0;
                const increment = num / 50;
                const duration = 2000;
                const stepTime = duration / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= num) {
                        current = num;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + (isPercentage ? '+' : '');
                }, stepTime);
            });
        }
    }

    // --- 11. INITIALIZE EVERYTHING ---
    document.addEventListener('DOMContentLoaded', () => {
        initLoader();
        initCursor();
        initScrollReveal();
        initNavigation();
        initLightbox();
        initForm();
        initParallax();
        initGalleryTilt();
        initStatCounters();
    });

})();