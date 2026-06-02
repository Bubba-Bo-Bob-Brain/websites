/* ═══════════════════════════════════════════════════════════
   ART NOUVEAU GALLERY — ELARA VOSS
   Interactive Behaviors & Animations
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ─── SCROLL REVEAL ANIMATIONS ───
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after revealing for performance
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // ─── HEADER SCROLL EFFECT ───
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // ─── MOBILE NAVIGATION ───
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    function toggleMobileMenu() {
        const isOpen = mobileMenuToggle.classList.contains('active');
        
        if (isOpen) {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileNavOverlay.classList.remove('active');
            mobileNavOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        } else {
            mobileMenuToggle.classList.add('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            mobileNavOverlay.classList.add('active');
            mobileNavOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuToggle.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // ─── SMOOTH SCROLLING ───
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ─── GALLERY FILTERING ───
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach((item, index) => {
                const category = item.dataset.category;
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    item.style.display = '';
                    item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // ─── LIGHTBOX FUNCTIONALITY ───
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxMeta = document.getElementById('lightboxMeta');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    function openLightbox(title, meta, bgClass) {
        lightboxTitle.textContent = title;
        lightboxMeta.textContent = meta;
        
        // Copy the artwork background
        lightboxImage.className = 'lightbox-image';
        if (bgClass) {
            lightboxImage.classList.add(bgClass);
        }
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    // Gallery item click handlers
    galleryItems.forEach(item => {
        const galleryImage = item.querySelector('.gallery-image');
        const artwork = item.querySelector('.artwork-placeholder');
        
        if (galleryImage && artwork) {
            item.style.cursor = 'pointer';
            
            item.addEventListener('click', function() {
                const title = galleryImage.dataset.title || '';
                const meta = galleryImage.dataset.meta || '';
                const bgClass = artwork.classList[1] || '';
                
                openLightbox(title, meta, bgClass);
            });
        }
    });
    
    // Close lightbox handlers
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // ─── CONTACT FORM ───
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            
            if (!name || !email || !message) {
                shakeElement(contactForm);
                return;
            }
            
            if (!isValidEmail(email)) {
                shakeElement(document.getElementById('contactEmail'));
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.form-submit');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                formSuccess.classList.add('visible');
                formSuccess.setAttribute('aria-hidden', 'false');
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = '<span class="submit-text">Send Message</span><span class="submit-ornament" aria-hidden="true">❧</span>';
                    submitBtn.disabled = false;
                    
                    setTimeout(() => {
                        formSuccess.classList.remove('visible');
                        formSuccess.setAttribute('aria-hidden', 'true');
                    }, 3000);
                }, 2000);
            }, 1500);
        });
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function shakeElement(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'shake 0.5s ease';
    }
    
    // ─── LOAD MORE BUTTON ───
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<span class="btn-text">Coming Soon...</span>';
            this.style.opacity = '0.6';
            this.style.pointerEvents = 'none';
            
            // In a real application, this would load more gallery items
            setTimeout(() => {
                this.innerHTML = '<span class="btn-text">All Works Displayed</span>';
            }, 1500);
        });
    }
    
    // ─── PARALLAX EFFECT FOR FLOATING ACCENTS ───
    const floatingAccents = document.querySelectorAll('.floating-accent');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        floatingAccents.forEach((accent, index) => {
            const speed = 0.05 + (index * 0.02);
            const yPos = scrollY * speed;
            accent.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // ─── GOLD SHIMMER EFFECT ON HOVER ───
    const goldElements = document.querySelectorAll('.nav-logo, .section-title, .card-title');
    
    goldElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.animation = 'goldShimmer 2s linear infinite';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
    
    // ─── STAGGERED REVEAL FOR GALLERY ITEMS ───
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    galleryItems.forEach(item => {
        galleryObserver.observe(item);
    });
    
    // ─── ACTIVE NAV LINK HIGHLIGHTING ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavOnScroll() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // ─── CURSOR GLOW EFFECT (Desktop Only) ───
    if (window.matchMedia('(min-width: 1024px)').matches) {
        const cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        cursorGlow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursorGlow);
        
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }
    
    // ─── PRELOADER / ENTRANCE ANIMATION ───
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger hero animations
        const heroElements = document.querySelectorAll('.hero .reveal-up');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, 200 + (index * 150));
        });
    });
    
    // ─── FORM INPUT ANIMATIONS ───
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    // ─── ADD CSS ANIMATIONS DYNAMICALLY ───
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes goldShimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        
        .nav-link.active {
            color: var(--gold);
        }
        
        .nav-link.active::before {
            width: 100%;
        }
        
        .form-group.focused .form-label {
            color: var(--gold-light);
        }
        
        body.loaded .hero .reveal-up {
            opacity: 0;
        }
    `;
    document.head.appendChild(styleSheet);
    
    // ─── COLLECTION CARD HOVER EFFECTS ───
    const collectionCards = document.querySelectorAll('.collection-card');
    
    collectionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const ornament = this.querySelector('.card-ornament');
            if (ornament) {
                ornament.style.transform = 'rotate(15deg) scale(1.1)';
                ornament.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const ornament = this.querySelector('.card-ornament');
            if (ornament) {
                ornament.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });
    
    // ─── GALLERY ITEM HOVER TILT EFFECT ───
    if (window.matchMedia('(min-width: 768px)').matches) {
        galleryItems.forEach(item => {
            item.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    console.log('🎨 Art Nouveau Gallery initialized — Elara Voss');
});