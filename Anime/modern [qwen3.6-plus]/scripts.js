/* ============================================
   ANIMORA - Manga & Anime Portal Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    LoadingScreen.init();
    CustomCursor.init();
    Navigation.init();
    ScrollReveal.init();
    HeroAnimations.init();
    SeasonalTabs.init();
    CharacterCarousel.init();
    MangaReader.init();
    NewsletterForm.init();
    ParallaxEffects.init();
});

/* --- Loading Screen --- */
const LoadingScreen = {
    init() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingBarFill = document.getElementById('loadingBarFill');
        this.progress = 0;
        
        document.body.classList.add('loading');
        this.animate();
    },
    
    animate() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15 + 5;
            if (this.progress >= 100) {
                this.progress = 100;
                this.loadingBarFill.style.width = '100%';
                clearInterval(interval);
                
                setTimeout(() => {
                    this.hide();
                }, 400);
            } else {
                this.loadingBarFill.style.width = `${this.progress}%`;
            }
        }, 150);
    },
    
    hide() {
        this.loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
        
        // Trigger hero animations
        setTimeout(() => HeroAnimations.triggerAnimations(), 300);
    }
};

/* --- Custom Cursor --- */
const CustomCursor = {
    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.cursor = document.getElementById('cursor');
        this.follower = document.getElementById('cursor-follower');
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.speed = 0.15;
        
        this.bindEvents();
        this.update();
    },
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Hover effects for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .panel-card, .anime-card, .news-card, input');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    },
    
    update() {
        this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
        this.pos.y += (this.mouse.y - this.pos.y) * this.speed;
        
        this.followerPos.x += (this.mouse.x - this.followerPos.x) * 0.08;
        this.followerPos.y += (this.mouse.y - this.followerPos.y) * 0.08;
        
        this.cursor.style.left = `${this.pos.x}px`;
        this.cursor.style.top = `${this.pos.y}px`;
        
        this.follower.style.left = `${this.followerPos.x}px`;
        this.follower.style.top = `${this.followerPos.y}px`;
        
        requestAnimationFrame(() => this.update());
    }
};

/* --- Navigation --- */
const Navigation = {
    init() {
        this.nav = document.getElementById('mainNav');
        this.menuToggle = document.getElementById('menuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileMenuLinks = this.mobileMenu.querySelectorAll('.mobile-nav-links a');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.bindEvents();
        this.setupScrollSpy();
    },
    
    bindEvents() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        });
        
        // Mobile menu toggle
        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
            document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu on link click
        this.mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.menuToggle.classList.remove('active');
                this.mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    setupScrollSpy() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, observerOptions);
        
        this.sections.forEach(section => observer.observe(section));
    }
};

/* --- Scroll Reveal --- */
const ScrollReveal = {
    init() {
        this.elements = document.querySelectorAll('[data-scroll-reveal]');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.bindEvents();
    },
    
    bindEvents() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, parseInt(delay));
                    
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        this.elements.forEach(el => observer.observe(el));
    }
};

/* --- Hero Animations --- */
const HeroAnimations = {
    init() {
        this.titleWords = document.querySelectorAll('.title-word');
        this.heroDescription = document.querySelector('.hero-description');
        this.heroCta = document.querySelector('.hero-cta');
        this.heroStats = document.querySelector('.hero-stats');
        this.statNumbers = document.querySelectorAll('.stat-number');
    },
    
    triggerAnimations() {
        // Animate title words
        this.titleWords.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add('animate');
            }, 100 * index);
        });
        
        // Animate hero elements
        setTimeout(() => {
            this.heroDescription.classList.add('animate');
        }, 600);
        
        setTimeout(() => {
            this.heroCta.classList.add('animate');
        }, 800);
        
        setTimeout(() => {
            this.heroStats.classList.add('animate');
            this.animateCounters();
        }, 1000);
    },
    
    animateCounters() {
        this.statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2000;
            const start = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(ease * target);
                
                stat.textContent = this.formatNumber(current);
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = this.formatNumber(target);
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    },
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K+';
        }
        return num.toString();
    }
};

/* --- Seasonal Tabs --- */
const SeasonalTabs = {
    init() {
        this.tabs = document.querySelectorAll('.season-tab');
        this.grid = document.getElementById('seasonalGrid');
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                this.animateGrid();
            });
        });
    },
    
    animateGrid() {
        const animeCards = this.grid.querySelectorAll('.anime-card');
        
        // Fade out
        animeCards.forEach((card, index) => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.transitionDelay = `${index * 50}ms`;
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });
        
        // Fade in with stagger
        setTimeout(() => {
            animeCards.forEach((card, index) => {
                card.style.transitionDelay = `${index * 80}ms`;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 300);
    }
};

/* --- Character Carousel --- */
const CharacterCarousel = {
    init() {
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.indicatorsContainer = document.getElementById('carouselIndicators');
        this.cards = this.track.querySelectorAll('.character-card');
        
        this.currentIndex = 0;
        this.cardWidth = 432; // card width + gap
        this.isDragging = false;
        this.startPos = 0;
        this.scrollLeft = 0;
        
        this.setupIndicators();
        this.bindEvents();
        this.updateButtons();
    },
    
    setupIndicators() {
        this.cards.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator${index === 0 ? ' active' : ''}`;
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
        
        this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');
    },
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Drag to scroll
        this.track.addEventListener('mousedown', (e) => this.startDrag(e));
        this.track.addEventListener('mousemove', (e) => this.drag(e));
        this.track.addEventListener('mouseup', () => this.endDrag());
        this.track.addEventListener('mouseleave', () => this.endDrag());
        
        // Touch support
        this.track.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        this.track.addEventListener('touchmove', (e) => this.drag(e.touches[0]));
        this.track.addEventListener('touchend', () => this.endDrag());
        
        // Scroll snap update
        this.track.addEventListener('scroll', () => this.updateOnScroll());
    },
    
    startDrag(e) {
        this.isDragging = true;
        this.startPos = e.pageX;
        this.scrollLeft = this.track.scrollLeft;
        this.track.style.cursor = 'grabbing';
    },
    
    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault && e.preventDefault();
        const x = e.pageX;
        const walk = (x - this.startPos) * 2;
        this.track.scrollLeft = this.scrollLeft - walk;
    },
    
    endDrag() {
        this.isDragging = false;
        this.track.style.cursor = 'grab';
    },
    
    updateOnScroll() {
        const scrollPos = this.track.scrollLeft;
        this.currentIndex = Math.round(scrollPos / this.cardWidth);
        this.updateButtons();
        this.updateIndicators();
    },
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.scrollToCurrent();
        }
    },
    
    next() {
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.scrollToCurrent();
        }
    },
    
    goToSlide(index) {
        this.currentIndex = index;
        this.scrollToCurrent();
    },
    
    scrollToCurrent() {
        const scrollPos = this.currentIndex * this.cardWidth;
        this.track.scrollTo({
            left: scrollPos,
            behavior: 'smooth'
        });
        
        this.updateButtons();
        this.updateIndicators();
    },
    
    updateButtons() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.cards.length - 1;
    },
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
};

/* --- Manga Reader --- */
const MangaReader = {
    init() {
        this.pages = document.querySelectorAll('.reader-page');
        this.prevBtn = document.getElementById('readerPrev');
        this.nextBtn = document.getElementById('readerNext');
        this.progressFill = document.querySelector('.reader-progress-fill');
        this.pageIndicator = document.querySelector('.reader-page-indicator');
        
        this.currentPage = 0;
        this.totalPages = this.pages.length;
        
        this.bindEvents();
        this.updateUI();
    },
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    },
    
    prev() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.showPage();
        }
    },
    
    next() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.showPage();
        }
    },
    
    showPage() {
        this.pages.forEach((page, index) => {
            page.classList.toggle('active', index === this.currentPage);
        });
        this.updateUI();
    },
    
    updateUI() {
        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
        
        const progress = ((this.currentPage + 1) / this.totalPages) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.pageIndicator.textContent = `${this.currentPage + 1} / ${this.totalPages}`;
    }
};

/* --- Newsletter Form --- */
const NewsletterForm = {
    init() {
        this.form = document.getElementById('newsletterForm');
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },
    
    handleSubmit() {
        const input = this.form.querySelector('input[type="email"]');
        const email = input.value.trim();
        
        if (!email) return;
        
        // Simulate submission
        const btn = this.form.querySelector('button[type="submit"]');
        const originalText = btn.querySelector('.btn-text').textContent;
        
        btn.querySelector('.btn-text').textContent = 'Subscribing...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = 'Subscribed ✓';
            btn.style.background = 'var(--color-accent-green)';
            input.value = '';
            
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        }, 1500);
    }
};

/* --- Parallax Effects --- */
const ParallaxEffects = {
    init() {
        this.floatingPanels = document.querySelectorAll('.floating-panel');
        this.speedLines = document.getElementById('speedLines');
        this.heroBg1 = document.getElementById('heroBg1');
        this.heroBg2 = document.getElementById('heroBg2');
        this.heroBg3 = document.getElementById('heroBg3');
        
        this.bindEvents();
    },
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Mouse parallax for hero
        const hero = document.querySelector('.hero');
        hero.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
    },
    
    handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Parallax for hero backgrounds
        if (this.heroBg1) {
            this.heroBg1.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        if (this.heroBg2) {
            this.heroBg2.style.transform = `translateY(${scrollY * 0.2}px)`;
        }
        if (this.heroBg3) {
            this.heroBg3.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
        
        // Speed lines rotation on scroll
        if (this.speedLines) {
            const rotation = scrollY * 0.02;
            this.speedLines.style.animationDuration = `${120 - Math.min(scrollY * 0.05, 60)}s`;
        }
    },
    
    handleMouseMove(e) {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;
        
        // Move floating panels
        this.floatingPanels.forEach((panel, index) => {
            const depth = (index + 1) * 10;
            panel.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
        });
    }
};