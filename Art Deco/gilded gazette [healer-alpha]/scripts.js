/**
 * THE GILDED GAZETTE - Art Deco Magazine JavaScript
 * Bringing 1920s opulence to the digital age
 */

(function() {
    'use strict';

    // ============================================
    // CHAMPAGNE BUBBLE PARTICLE SYSTEM
    // ============================================
    
    class ChampagneBubble {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.bubbles = [];
            this.maxBubbles = 80;
            this.colors = [
                'rgba(212, 175, 55, 0.4)',  // Gold
                'rgba(245, 230, 163, 0.5)',  // Light gold
                'rgba(255, 255, 255, 0.3)',  // White
                'rgba(251, 245, 183, 0.4)',  // Pale gold
                'rgba(170, 119, 28, 0.3)'    // Dark gold
            ];
            
            this.init();
            this.animate();
            this.setupEventListeners();
        }
        
        init() {
            this.resize();
            
            // Create initial bubbles
            for (let i = 0; i < 30; i++) {
                this.createBubble();
            }
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        createBubble() {
            const size = Math.random() * 8 + 2;
            const bubble = {
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 100,
                size: size,
                speedY: Math.random() * 2 + 0.5,
                speedX: Math.random() * 0.5 - 0.25,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2,
                wobbleSpeed: Math.random() * 0.02 + 0.01,
                wobbleAmount: Math.random() * 2 + 1,
                time: Math.random() * Math.PI * 2
            };
            
            this.bubbles.push(bubble);
        }
        
        updateBubble(bubble) {
            // Float upward
            bubble.y -= bubble.speedY;
            
            // Horizontal wobble
            bubble.time += bubble.wobbleSpeed;
            bubble.x += Math.sin(bubble.time) * bubble.wobbleAmount * 0.1;
            
            // Gentle drift
            bubble.x += bubble.speedX;
            
            // Fade out as they rise
            if (bubble.y < this.canvas.height * 0.3) {
                bubble.opacity -= 0.002;
            }
            
            // Reset when off screen or faded
            if (bubble.y < -50 || bubble.opacity <= 0) {
                bubble.y = this.canvas.height + 50;
                bubble.x = Math.random() * this.canvas.width;
                bubble.opacity = Math.random() * 0.5 + 0.2;
            }
        }
        
        drawBubble(bubble) {
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            this.ctx.fillStyle = bubble.color.replace(')', `, ${bubble.opacity})`).replace('rgba', 'rgba');
            this.ctx.fill();
            
            // Add shimmer effect
            const gradient = this.ctx.createRadialGradient(
                bubble.x - bubble.size * 0.3, 
                bubble.y - bubble.size * 0.3, 
                0,
                bubble.x, 
                bubble.y, 
                bubble.size
            );
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.size * 0.7, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Limit number of bubbles
            if (this.bubbles.length > this.maxBubbles) {
                this.bubbles.splice(0, this.bubbles.length - this.maxBubbles);
            }
            
            // Occasionally add new bubbles
            if (Math.random() < 0.02 && this.bubbles.length < this.maxBubbles) {
                this.createBubble();
            }
            
            // Update and draw all bubbles
            for (let i = 0; i < this.bubbles.length; i++) {
                this.updateBubble(this.bubbles[i]);
                this.drawBubble(this.bubbles[i]);
            }
            
            requestAnimationFrame(() => this.animate());
        }
        
        setupEventListeners() {
            window.addEventListener('resize', () => this.resize());
            
            // Add extra bubbles on click
            document.addEventListener('click', (e) => {
                for (let i = 0; i < 5; i++) {
                    const bubble = {
                        x: e.clientX + (Math.random() - 0.5) * 50,
                        y: e.clientY + (Math.random() - 0.5) * 50,
                        size: Math.random() * 6 + 2,
                        speedY: Math.random() * 1 + 0.5,
                        speedX: Math.random() * 0.5 - 0.25,
                        color: this.colors[Math.floor(Math.random() * this.colors.length)],
                        opacity: Math.random() * 0.7 + 0.3,
                        wobbleSpeed: Math.random() * 0.02 + 0.01,
                        wobbleAmount: Math.random() * 2 + 1,
                        time: Math.random() * Math.PI * 2
                    };
                    this.bubbles.push(bubble);
                }
            });
        }
    }

    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    
    class ParallaxEffects {
        constructor() {
            this.sunburstRays = document.querySelectorAll('.sunburst-ray');
            this.heroSection = document.querySelector('.hero-section');
            this.masthead = document.querySelector('.masthead');
            this.scrollPosition = 0;
            
            this.init();
        }
        
        init() {
            window.addEventListener('scroll', () => this.handleScroll());
            window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            
            // Initial update
            this.handleScroll();
        }
        
        handleScroll() {
            this.scrollPosition = window.pageYOffset;
            
            // Sunburst parallax
            if (this.sunburstRays.length > 0 && this.heroSection) {
                const heroRect = this.heroSection.getBoundingClientRect();
                const heroCenter = heroRect.top + heroRect.height / 2;
                const scrollRatio = (window.innerHeight - heroCenter) / window.innerHeight;
                
                this.sunburstRays.forEach((ray, index) => {
                    const speed = 0.1 + (index * 0.02);
                    const rotation = scrollRatio * 30 * speed;
                    ray.style.transform = `rotate(calc(var(--ray) * 30deg + ${rotation}deg))`;
                });
            }
            
            // Masthead fade effect
            if (this.masthead) {
                const mastheadHeight = this.masthead.offsetHeight;
                const fadeStart = mastheadHeight * 0.7;
                
                if (this.scrollPosition > fadeStart) {
                    const fadeRatio = Math.min((this.scrollPosition - fadeStart) / 100, 0.7);
                    this.masthead.style.opacity = 1 - fadeRatio;
                } else {
                    this.masthead.style.opacity = 1;
                }
            }
        }
        
        handleMouseMove(e) {
            // Subtle movement of corner ornaments based on mouse position
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const corners = document.querySelectorAll('.corner-ornament');
            corners.forEach(corner => {
                const offsetX = (mouseX - 0.5) * 10;
                const offsetY = (mouseY - 0.5) * 10;
                
                if (corner.classList.contains('top-left') || corner.classList.contains('bottom-left')) {
                    corner.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                } else {
                    corner.style.transform = `translate(${-offsetX}px, ${offsetY}px)`;
                }
            });
        }
    }

    // ============================================
    // MASTHEAD ANIMATION
    // ============================================
    
    class MastheadAnimation {
        constructor() {
            this.letters = document.querySelectorAll('.title-letter');
            this.isPlaying = false;
            
            this.init();
        }
        
        init() {
            // Add hover effect to masthead title
            const mastheadTitle = document.querySelector('.masthead-title');
            if (mastheadTitle) {
                mastheadTitle.addEventListener('mouseenter', () => this.playJazzAnimation());
                mastheadTitle.addEventListener('mouseleave', () => this.stopJazzAnimation());
            }
            
            // Add click effect to individual letters
            this.letters.forEach(letter => {
                letter.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.letterClickEffect(letter);
                });
                
                letter.style.cursor = 'pointer';
            });
        }
        
        playJazzAnimation() {
            if (this.isPlaying) return;
            this.isPlaying = true;
            
            this.letters.forEach((letter, index) => {
                letter.style.animation = 'none';
                letter.offsetHeight; // Trigger reflow
                
                const delay = index * 0.1;
                letter.style.animation = `letterJazz 0.6s ease-in-out ${delay}s infinite`;
            });
        }
        
        stopJazzAnimation() {
            this.isPlaying = false;
            
            this.letters.forEach((letter, index) => {
                letter.style.animation = `letterFloat 3s ease-in-out infinite`;
                letter.style.animationDelay = `calc(${index} * 0.1s)`;
            });
        }
        
        letterClickEffect(letter) {
            // Create a burst effect
            const burst = document.createElement('div');
            burst.className = 'letter-burst';
            burst.innerHTML = letter.textContent;
            burst.style.position = 'absolute';
            burst.style.color = '#d4af37';
            burst.style.fontSize = '5rem';
            burst.style.fontFamily = 'Cinzel Decorative, serif';
            burst.style.fontWeight = '900';
            burst.style.pointerEvents = 'none';
            burst.style.zIndex = '1000';
            burst.style.opacity = '1';
            burst.style.transform = 'scale(1)';
            burst.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            const rect = letter.getBoundingClientRect();
            burst.style.left = `${rect.left}px`;
            burst.style.top = `${rect.top}px`;
            
            document.body.appendChild(burst);
            
            // Animate the burst
            setTimeout(() => {
                burst.style.transform = 'scale(3)';
                burst.style.opacity = '0';
            }, 50);
            
            // Remove after animation
            setTimeout(() => {
                burst.remove();
            }, 800);
        }
    }

    // ============================================
    // ADVERTISEMENT INTERACTIONS
    // ============================================
    
    class AdvertisementInteractions {
        constructor() {
            this.ads = document.querySelectorAll('.vintage-ad');
            this.bannerAd = document.querySelector('.banner-ad');
            
            this.init();
        }
        
        init() {
            this.ads.forEach(ad => {
                ad.addEventListener('mouseenter', () => this.highlightAd(ad));
                ad.addEventListener('mouseleave', () => this.resetAd(ad));
                ad.addEventListener('click', () => this.clickAdEffect(ad));
            });
            
            if (this.bannerAd) {
                this.bannerAd.addEventListener('mouseenter', () => this.highlightBanner());
                this.bannerAd.addEventListener('mouseleave', () => this.resetBanner());
            }
        }
        
        highlightAd(ad) {
            ad.style.transform = 'translateY(-5px) scale(1.02)';
            ad.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.3)';
            ad.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Add shimmer to border
            const border = ad.querySelector('.ad-border');
            if (border) {
                border.style.background = 'linear-gradient(90deg, #f5f0e1, #fff, #f5f0e1)';
                border.style.backgroundSize = '200% 100%';
                border.style.animation = 'adShimmer 2s linear infinite';
            }
        }
        
        resetAd(ad) {
            ad.style.transform = '';
            ad.style.boxShadow = '';
            
            const border = ad.querySelector('.ad-border');
            if (border) {
                border.style.background = '';
                border.style.animation = '';
            }
        }
        
        clickAdEffect(ad) {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ad-ripple';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(212, 175, 55, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'rippleEffect 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            const rect = ad.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size/2}px`;
            ripple.style.top = `${event.clientY - rect.top - size/2}px`;
            
            ad.style.position = 'relative';
            ad.style.overflow = 'hidden';
            ad.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Show a "coming soon" message
            this.showAdMessage(ad);
        }
        
        showAdMessage(ad) {
            const message = document.createElement('div');
            message.className = 'ad-message';
            message.innerHTML = '<p>Advertisement</p><p class="small">Coming Soon to a Theatre Near You</p>';
            message.style.position = 'absolute';
            message.style.top = '50%';
            message.style.left = '50%';
            message.style.transform = 'translate(-50%, -50%)';
            message.style.background = 'rgba(10, 10, 10, 0.9)';
            message.style.color = '#d4af37';
            message.style.padding = '1rem 2rem';
            message.style.fontFamily = 'Cinzel, serif';
            message.style.textAlign = 'center';
            message.style.zIndex = '100';
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.3s';
            message.style.border = '1px solid #d4af37';
            
            ad.style.position = 'relative';
            ad.appendChild(message);
            
            setTimeout(() => {
                message.style.opacity = '1';
            }, 10);
            
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 2000);
        }
        
        highlightBanner() {
            this.bannerAd.style.background = 'linear-gradient(135deg, #0a0a0a, #1a1a1a)';
            this.bannerAd.querySelector('.banner-frame').style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
        }
        
        resetBanner() {
            this.bannerAd.style.background = '';
            this.bannerAd.querySelector('.banner-frame').style.boxShadow = '';
        }
    }

    // ============================================
    // ARTICLE INTERACTIONS
    // ============================================
    
    class ArticleInteractions {
        constructor() {
            this.articles = document.querySelectorAll('.featured-article, .column-article, .grid-item');
            
            this.init();
        }
        
        init() {
            this.articles.forEach(article => {
                article.addEventListener('mouseenter', () => this.highlightArticle(article));
                article.addEventListener('mouseleave', () => this.resetArticle(article));
            });
            
            // Add scroll-triggered animations for article elements
            this.setupScrollAnimations();
        }
        
        highlightArticle(article) {
            article.style.transform = 'translateY(-3px)';
            article.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
            article.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Highlight the category tag
            const category = article.querySelector('.article-category, .grid-category');
            if (category) {
                category.style.transform = 'scale(1.05)';
                category.style.transition = 'transform 0.3s';
            }
        }
        
        resetArticle(article) {
            article.style.transform = '';
            article.style.boxShadow = '';
            
            const category = article.querySelector('.article-category, .grid-category');
            if (category) {
                category.style.transform = '';
            }
        }
        
        setupScrollAnimations() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        
                        // Stagger animation for child elements
                        const children = entry.target.querySelectorAll('.drop-cap, .article-title, .article-text, .pull-quote');
                        children.forEach((child, index) => {
                            child.style.animationDelay = `${index * 0.1}s`;
                            child.classList.add('fade-in-up');
                        });
                    }
                });
            }, observerOptions);
            
            // Observe all articles
            this.articles.forEach(article => {
                observer.observe(article);
            });
            
            // Observe section titles
            document.querySelectorAll('.section-title, .opinion-title').forEach(title => {
                observer.observe(title);
            });
        }
    }

    // ============================================
    // NAVIGATION EFFECTS
    // ============================================
    
    class NavigationEffects {
        constructor() {
            this.navLinks = document.querySelectorAll('.nav-link');
            this.navDots = document.querySelectorAll('.nav-dot');
            
            this.init();
        }
        
        init() {
            this.navLinks.forEach(link => {
                link.addEventListener('mouseenter', (e) => this.hoverNavLink(e));
                link.addEventListener('mouseleave', () => this.resetNavLink());
                link.addEventListener('click', (e) => this.clickNavLink(e));
            });
            
            // Add sparkle effect to nav dots
            this.navDots.forEach(dot => {
                dot.addEventListener('mouseenter', () => {
                    dot.style.transform = 'scale(1.5)';
                    dot.style.color = '#f5e6a3';
                    dot.style.transition = 'all 0.3s';
                });
                
                dot.addEventListener('mouseleave', () => {
                    dot.style.transform = '';
                    dot.style.color = '';
                });
            });
        }
        
        hoverNavLink(e) {
            const link = e.target;
            
            // Create trailing sparkle effect
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'nav-sparkle';
                    sparkle.innerHTML = '✦';
                    sparkle.style.position = 'absolute';
                    sparkle.style.color = '#d4af37';
                    sparkle.style.fontSize = '0.6rem';
                    sparkle.style.pointerEvents = 'none';
                    sparkle.style.opacity = '0';
                    sparkle.style.transform = 'translateY(0)';
                    sparkle.style.transition = 'all 0.6s ease-out';
                    
                    const rect = link.getBoundingClientRect();
                    sparkle.style.left = `${rect.left + rect.width/2 + (Math.random() - 0.5) * 20}px`;
                    sparkle.style.top = `${rect.top}px`;
                    
                    document.body.appendChild(sparkle);
                    
                    setTimeout(() => {
                        sparkle.style.opacity = '1';
                        sparkle.style.transform = 'translateY(-20px)';
                    }, 10);
                    
                    setTimeout(() => {
                        sparkle.style.opacity = '0';
                        sparkle.style.transform = 'translateY(-40px)';
                        setTimeout(() => sparkle.remove(), 300);
                    }, 600);
                }, i * 100);
            }
        }
        
        resetNavLink() {
            // Any cleanup if needed
        }
        
        clickNavLink(e) {
            const link = e.target;
            
            // Create a pulse effect
            const pulse = document.createElement('div');
            pulse.className = 'nav-pulse';
            pulse.style.position = 'absolute';
            pulse.style.borderRadius = '50%';
            pulse.style.background = 'rgba(212, 175, 55, 0.2)';
            pulse.style.transform = 'scale(0)';
            pulse.style.animation = 'navPulse 0.4s ease-out';
            pulse.style.pointerEvents = 'none';
            
            const rect = link.getBoundingClientRect();
            pulse.style.width = pulse.style.height = `${Math.max(rect.width, rect.height) * 2}px`;
            pulse.style.left = `${rect.left + rect.width/2 - rect.width}px`;
            pulse.style.top = `${rect.top + rect.height/2 - rect.height}px`;
            
            document.body.appendChild(pulse);
            
            setTimeout(() => {
                pulse.remove();
            }, 400);
            
            // Prevent default for demo (would normally scroll to section)
            e.preventDefault();
        }
    }

    // ============================================
    // GEOMETRIC DIVIDER ANIMATIONS
    // ============================================
    
    class GeometricAnimations {
        constructor() {
            this.dividers = document.querySelectorAll('.geo-divider');
            this.rosettes = document.querySelectorAll('.deco-rosette');
            
            this.init();
        }
        
        init() {
            // Add hover effects to dividers
            this.dividers.forEach(divider => {
                divider.addEventListener('mouseenter', () => this.activateDivider(divider));
                divider.addEventListener('mouseleave', () => this.deactivateDivider(divider));
            });
            
            // Make rosettes interactive
            this.rosettes.forEach(rosette => {
                rosette.addEventListener('click', () => this.spinRosette(rosette));
                rosette.style.cursor = 'pointer';
            });
        }
        
        activateDivider(divider) {
            const lines = divider.querySelectorAll('.divider-line');
            const ornament = divider.querySelector('.divider-ornament, .deco-rosette');
            
            lines.forEach(line => {
                line.style.background = 'linear-gradient(90deg, transparent, #d4af37, transparent)';
                line.style.height = '2px';
                line.style.transition = 'all 0.3s';
            });
            
            if (ornament) {
                ornament.style.transform = 'scale(1.1)';
                ornament.style.transition = 'transform 0.3s';
            }
        }
        
        deactivateDivider(divider) {
            const lines = divider.querySelectorAll('.divider-line');
            const ornament = divider.querySelector('.divider-ornament, .deco-rosette');
            
            lines.forEach(line => {
                line.style.background = '';
                line.style.height = '';
            });
            
            if (ornament) {
                ornament.style.transform = '';
            }
        }
        
        spinRosette(rosette) {
            rosette.style.animation = 'none';
            rosette.offsetHeight; // Trigger reflow
            rosette.style.animation = 'spinOnce 0.8s ease-out';
            
            // Create sparkle effect
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'rosette-sparkle';
                    sparkle.innerHTML = '✦';
                    sparkle.style.position = 'absolute';
                    sparkle.style.color = '#d4af37';
                    sparkle.style.fontSize = '0.8rem';
                    sparkle.style.pointerEvents = 'none';
                    sparkle.style.opacity = '0';
                    sparkle.style.transform = 'translateY(0)';
                    sparkle.style.transition = 'all 0.6s ease-out';
                    
                    const rect = rosette.getBoundingClientRect();
                    const angle = (i / 8) * Math.PI * 2;
                    const distance = 30;
                    
                    sparkle.style.left = `${rect.left + rect.width/2 + Math.cos(angle) * distance}px`;
                    sparkle.style.top = `${rect.top + rect.height/2 + Math.sin(angle) * distance}px`;
                    
                    document.body.appendChild(sparkle);
                    
                    setTimeout(() => {
                        sparkle.style.opacity = '1';
                        sparkle.style.transform = `translate(${Math.cos(angle) * 20}px, ${Math.sin(angle) * 20}px)`;
                    }, 10);
                    
                    setTimeout(() => {
                        sparkle.style.opacity = '0';
                        sparkle.style.transform = `translate(${Math.cos(angle) * 40}px, ${Math.sin(angle) * 40}px)`;
                        setTimeout(() => sparkle.remove(), 300);
                    }, 600);
                }, i * 50);
            }
        }
    }

    // ============================================
    // SCROLL PROGRESS INDICATOR
    // ============================================
    
    class ScrollProgress {
        constructor() {
            this.progressBar = null;
            this.init();
        }
        
        init() {
            // Create progress bar
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'scroll-progress';
            this.progressBar.style.position = 'fixed';
            this.progressBar.style.top = '0';
            this.progressBar.style.left = '0';
            this.progressBar.style.width = '0%';
            this.progressBar.style.height = '3px';
            this.progressBar.style.background = 'linear-gradient(90deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)';
            this.progressBar.style.backgroundSize = '200% 100%';
            this.progressBar.style.animation = 'shimmer 3s linear infinite';
            this.progressBar.style.zIndex = '9999';
            this.progressBar.style.transition = 'width 0.1s';
            
            document.body.appendChild(this.progressBar);
            
            window.addEventListener('scroll', () => this.updateProgress());
            this.updateProgress();
        }
        
        updateProgress() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            this.progressBar.style.width = `${scrollPercent}%`;
        }
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    
    class KeyboardNavigation {
        constructor() {
            this.init();
        }
        
        init() {
            document.addEventListener('keydown', (e) => {
                // Press 'G' to trigger gold effect
                if (e.key === 'g' || e.key === 'G') {
                    this.triggerGoldEffect();
                }
                
                // Press 'B' for bubble burst
                if (e.key === 'b' || e.key === 'B') {
                    this.triggerBubbleBurst();
                }
                
                // Press 'J' for jazz animation
                if (e.key === 'j' || e.key === 'J') {
                    const mastheadTitle = document.querySelector('.masthead-title');
                    if (mastheadTitle) {
                        mastheadTitle.dispatchEvent(new Event('mouseenter'));
                        setTimeout(() => {
                            mastheadTitle.dispatchEvent(new Event('mouseleave'));
                        }, 2000);
                    }
                }
                
                // Press 'Escape' to reset all animations
                if (e.key === 'Escape') {
                    this.resetAllAnimations();
                }
            });
        }
        
        triggerGoldEffect() {
            // Create a gold wave effect across the page
            const goldWave = document.createElement('div');
            goldWave.className = 'gold-wave';
            goldWave.style.position = 'fixed';
            goldWave.style.top = '0';
            goldWave.style.left = '-100%';
            goldWave.style.width = '100%';
            goldWave.style.height = '100%';
            goldWave.style.background = 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)';
            goldWave.style.pointerEvents = 'none';
            goldWave.style.zIndex = '9998';
            goldWave.style.transition = 'left 1.5s ease-in-out';
            
            document.body.appendChild(goldWave);
            
            setTimeout(() => {
                goldWave.style.left = '100%';
            }, 10);
            
            setTimeout(() => {
                goldWave.remove();
            }, 1600);
        }
        
        triggerBubbleBurst() {
            // Create a burst of bubbles from the center of the screen
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const event = new MouseEvent('click', {
                        clientX: centerX + (Math.random() - 0.5) * 200,
                        clientY: centerY + (Math.random() - 0.5) * 200
                    });
                    document.dispatchEvent(event);
                }, i * 50);
            }
        }
        
        resetAllAnimations() {
            // Remove any active animations
            document.querySelectorAll('.title-letter').forEach(letter => {
                letter.style.animation = '';
            });
            
            // Reset any transforms
            document.querySelectorAll('.corner-ornament').forEach(corner => {
                corner.style.transform = '';
            });
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all systems
        const champagneCanvas = document.getElementById('champagne-canvas');
        if (champagneCanvas) {
            new ChampagneBubble(champagneCanvas);
        }
        
        new ParallaxEffects();
        new MastheadAnimation();
        new AdvertisementInteractions();
        new ArticleInteractions();
        new NavigationEffects();
        new GeometricAnimations();
        new ScrollProgress();
        new KeyboardNavigation();
        
        // Add CSS for additional animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes letterJazz {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-8px) rotate(-5deg); }
                50% { transform: translateY(0) rotate(0deg); }
                75% { transform: translateY(-8px) rotate(5deg); }
            }
            
            @keyframes rippleEffect {
                to { transform: scale(4); opacity: 0; }
            }
            
            @keyframes navPulse {
                to { transform: scale(2); opacity: 0; }
            }
            
            @keyframes spinOnce {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes adShimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            .animate-in {
                animation: fadeInUp 0.8s ease-out forwards;
            }
            
            .fade-in-up {
                animation: fadeInUp 0.6s ease-out forwards;
                opacity: 0;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Log a welcome message in the console
        console.log('%c✦ THE GILDED GAZETTE ✦', 'color: #d4af37; font-size: 24px; font-family: serif; font-weight: bold;');
        console.log('%cA Journal of Distinguished Taste & Refined Opinion', 'color: #722f37; font-style: italic; font-family: serif;');
        console.log('%cKeyboard shortcuts: G = Gold effect, B = Bubble burst, J = Jazz animation, ESC = Reset', 'color: #666; font-family: sans-serif;');
        
        // Performance optimization: throttle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(function() {
                // Scroll-based operations are handled in individual classes
            });
        }, { passive: true });
    });

})();