/* ============================================
   AURELIA VOSS — ART NOUVEAU PORTFOLIO
   JavaScript: Scroll reveals, lightbox, nav
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    /* —— Smooth Scroll for Navigation —— */
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                event.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    /* —— Scroll Reveal Animation —— */
    const revealElements = document.querySelectorAll('.gallery-piece, .atelier-item');
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });
    
    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });
    
    /* —— Lightbox Functionality —— */
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxYear = lightbox.querySelector('.lightbox-year');
    const lightboxMedium = lightbox.querySelector('.lightbox-medium');
    const lightboxPlaceholder = lightbox.querySelector('.lightbox-placeholder');
    
    const galleryPieces = document.querySelectorAll('.gallery-piece');
    
    galleryPieces.forEach(function(piece) {
        const frame = piece.querySelector('.piece-frame');
        
        frame.addEventListener('click', function() {
            const title = piece.querySelector('.piece-title').textContent;
            const year = piece.querySelector('.piece-year').textContent;
            const medium = piece.querySelector('.piece-medium').textContent;
            const placeholder = piece.querySelector('.image-placeholder');
            const hue = getComputedStyle(placeholder).getPropertyValue('--placeholder-hue').trim();
            
            lightboxTitle.textContent = title;
            lightboxYear.textContent = year;
            lightboxMedium.textContent = medium;
            
            lightboxPlaceholder.style.background = 'linear-gradient(135deg, hsl(' + hue + ', 20%, 22%) 0%, hsl(' + hue + ', 15%, 18%) 50%, hsl(' + hue + ', 25%, 15%) 100%)';
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    /* —— Parallax Header Ornaments —— */
    const headerOrnaments = document.querySelectorAll('.header-ornament');
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.15;
        
        headerOrnaments.forEach(function(ornament) {
            ornament.style.transform = 'translateY(' + rate + 'px)' + (ornament.classList.contains('right') ? ' scaleX(-1)' : '');
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    /* —— Form Submission —— */
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const button = this.querySelector('.submit-button');
        const originalText = button.querySelector('.button-text').textContent;
        
        button.querySelector('.button-text').textContent = 'Envoyé';
        button.style.borderColor = 'var(--color-moss)';
        button.style.color = 'var(--color-moss)';
        
        setTimeout(function() {
            button.querySelector('.button-text').textContent = originalText;
            button.style.borderColor = '';
            button.style.color = '';
            contactForm.reset();
        }, 3000);
    });
    
    /* —— Decorative Cursor Trail (Subtle Gold Dust) —— */
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (!isTouchDevice) {
        let mouseX = 0;
        let mouseY = 0;
        let particles = [];
        let particleId = 0;
        
        document.addEventListener('mousemove', function(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
            
            if (Math.random() > 0.92) {
                createParticle(mouseX, mouseY);
            }
        });
        
        function createParticle(x, y) {
            const particle = document.createElement('span');
            particle.id = 'particle-' + (++particleId);
            particle.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:3px;height:3px;border-radius:50%;background:rgba(201,162,39,0.4);pointer-events:none;z-index:9999;transition:opacity 1s ease,transform 1s ease;';
            document.body.appendChild(particle);
            
            particles.push({
                element: particle,
                life: 1.0
            });
            
            requestAnimationFrame(function() {
                particle.style.opacity = '0';
                particle.style.transform = 'translate(' + (Math.random() * 20 - 10) + 'px, ' + (Math.random() * 20 + 10) + 'px) scale(0)';
            });
            
            setTimeout(function() {
                particle.remove();
                particles = particles.filter(function(p) {
                    return p.element !== particle;
                });
            }, 1000);
        }
    }
    
    /* —— Atelier Image Hover Enhancement —— */
    const atelierItems = document.querySelectorAll('.atelier-item');
    
    atelierItems.forEach(function(item) {
        const image = item.querySelector('.atelier-image');
        
        item.addEventListener('mouseenter', function() {
            image.style.transform = 'scale(1.03)';
            image.style.transition = 'transform 0.6s var(--ease-out-quart)';
        });
        
        item.addEventListener('mouseleave', function() {
            image.style.transform = 'scale(1)';
        });
    });
    
    /* —— Nav Active State on Scroll —— */
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.pageYOffset + 150;
        
        sections.forEach(function(section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    /* —— Initial Active Nav —— */
    updateActiveNav();
    
});