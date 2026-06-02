/* =====================================================
   THE GILDED AGE GAZETTE - Art Deco JavaScript
   A 1920s Gatsby-Era Magazine Experience
===================================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initBubbleCanvas();
    initScrollAnimations();
    initParallaxEffects();
    initNavigation();
    initInteractiveElements();
    initMastheadAnimation();
    initArticleReveal();
    initSmoothScroll();
    initTickerInteraction();
});

/* =====================================================
   CHAMPAGNE BUBBLE CANVAS
===================================================== */
function initBubbleCanvas() {
    var canvas = document.getElementById('bubbleCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var bubbles = [];
    var animationId = null;

    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Bubble constructor
    function Bubble() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.radius = Math.random() * 4 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.wobbleAngle = Math.random() * Math.PI * 2;
        this.wobbleRadius = Math.random() * 30 + 10;
    }

    Bubble.prototype.reset = function() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.radius = Math.random() * 4 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    };

    Bubble.prototype.update = function() {
        this.y -= this.speed;
        this.wobbleAngle += this.wobbleSpeed;
        this.x += Math.sin(this.wobbleAngle) * 0.3;
        if (this.y < -this.radius * 2) {
            this.reset();
        }
    };

    Bubble.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, ' + this.opacity + ')';
        ctx.fill();
        
        // Add highlight
        ctx.beginPath();
        ctx.arc(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            this.radius * 0.3,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (this.opacity * 0.5) + ')';
        ctx.fill();
    };

    // Create initial bubbles
    function createBubbles() {
        bubbles = [];
        var bubbleCount = Math.min(50, Math.floor(canvas.width / 30));
        for (var i = 0; i < bubbleCount; i++) {
            var bubble = new Bubble();
            bubble.y = Math.random() * canvas.height;
            bubbles.push(bubble);
        }
    }
    createBubbles();

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < bubbles.length; i++) {
            bubbles[i].update();
            bubbles[i].draw();
        }
        animationId = requestAnimationFrame(animate);
    }

    // Start animation with delay
    setTimeout(animate, 2000);

    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        } else {
            animate();
        }
    });

    // Add more bubbles on mouse move
    var lastMouseMove = 0;
    document.addEventListener('mousemove', function(e) {
        var now = Date.now();
        if (now - lastMouseMove > 100) {
            if (Math.random() > 0.7 && bubbles.length < 80) {
                var bubble = new Bubble();
                bubble.x = e.clientX + (Math.random() - 0.5) * 50;
                bubble.y = e.clientY;
                bubble.opacity = 0.3;
                bubbles.push(bubble);
            }
            lastMouseMove = now;
        }
    });
}

/* =====================================================
   SCROLL ANIMATIONS
===================================================== */
function initScrollAnimations() {
    var revealElements = document.querySelectorAll(
        '.article-card, .feature-article, .fashion-card, .lead-story, .section__header, .section-divider'
    );

    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                var children = entry.target.querySelectorAll('.article-card, .fashion-card');
                children.forEach(function(child, index) {
                    child.style.transitionDelay = (index * 0.1) + 's';
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function(el) {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // Add CSS for reveal animations
    var style = document.createElement('style');
    style.textContent = '' +
        '.reveal-on-scroll {' +
        '    opacity: 0;' +
        '    transform: translateY(30px);' +
        '    transition: opacity 0.6s ease, transform 0.6s ease;' +
        '}' +
        '.reveal-on-scroll.revealed {' +
        '    opacity: 1;' +
        '    transform: translateY(0);' +
        '}' +
        '.article-card.reveal-on-scroll.revealed:hover {' +
        '    transform: translateY(-5px);' +
        '}';
    document.head.appendChild(style);
}

/* =====================================================
   PARALLAX EFFECTS
===================================================== */
function initParallaxEffects() {
    var parallaxElements = document.querySelectorAll('.hero__sunburst, .masthead__sunburst');
    var ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                parallaxElements.forEach(function(el) {
                    var scrolled = window.pageYOffset;
                    var rate = scrolled * 0.3;
                    el.style.transform = 'translate(-50%, -50%) rotate(' + (rate * 0.1) + 'deg)';
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // Parallax for hero content
    var heroContent = document.querySelector('.hero__content');
    var hero = document.querySelector('.hero');

    if (heroContent && hero) {
        window.addEventListener('scroll', function() {
            var scrolled = window.pageYOffset;
            var heroHeight = hero.offsetHeight;
            if (scrolled < heroHeight) {
                var translateY = scrolled * 0.5;
                var opacity = 1 - (scrolled / heroHeight);
                heroContent.style.transform = 'translateY(' + translateY + 'px)';
                heroContent.style.opacity = opacity;
            }
        });
    }
}

/* =====================================================
   NAVIGATION
===================================================== */
function initNavigation() {
    var nav = document.querySelector('.masthead__nav');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');

    var observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };

    var navObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var id = entry.target.getAttribute('id');
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(function(section) {
        navObserver.observe(section);
    });

    // Smooth scroll for nav links
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var targetSection = document.querySelector(targetId);
            if (targetSection) {
                var offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // Sticky nav on scroll
    var lastScroll = 0;
    var masthead = document.querySelector('.masthead');

    window.addEventListener('scroll', function() {
        var currentScroll = window.pageYOffset;
        if (currentScroll > 300) {
            masthead.classList.add('scrolled');
        } else {
            masthead.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // Add scrolled styles
    var scrolledStyles = document.createElement('style');
    scrolledStyles.textContent = '' +
        '.masthead.scrolled {' +
        '    position: fixed;' +
        '    top: 0;' +
        '    left: 0;' +
        '    right: 0;' +
        '    z-index: 1000;' +
        '    padding: var(--space-md);' +
        '    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);' +
        '}' +
        '.masthead.scrolled .masthead__date {' +
        '    display: none;' +
        '}' +
        '.masthead.scrolled .masthead__title-top {' +
        '    font-size: 1rem;' +
        '}' +
        '.masthead.scrolled .masthead__title-main {' +
        '    font-size: 2rem;' +
        '}' +
        '.masthead.scrolled .masthead__title-sub {' +
        '    display: none;' +
        '}' +
        '.nav-link.active {' +
        '    color: var(--color-gold-light);' +
        '}' +
        '.nav-link.active::before {' +
        '    transform: translateX(-50%) scale(1) !important;' +
        '}';
    document.head.appendChild(scrolledStyles);
}

/* =====================================================
   INTERACTIVE ELEMENTS
===================================================== */
function initInteractiveElements() {
    // Article card hover effects
    var articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            var imgBefore = card.querySelector('.article-card__image::before');
            if (imgBefore) {
                imgBefore.style.setProperty('transform', 'scale(1.05)');
            }
        });

        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'translateY(-5px) perspective(1000px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg)';
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) perspective(1000px) rotateY(0) rotateX(0)';
        });
    });

    // Button ripple effects
    var buttons = document.querySelectorAll('.hero__cta, .subscribe-form__btn, .newsletter-form__btn, .feature-advertisement__cta');
    buttons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            var rect = this.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple styles
    var rippleStyles = document.createElement('style');
    rippleStyles.textContent = '' +
        '.ripple {' +
        '    position: absolute;' +
        '    width: 20px;' +
        '    height: 20px;' +
        '    background: rgba(255, 255, 255, 0.3);' +
        '    border-radius: 50%;' +
        '    transform: translate(-50%, -50%) scale(0);' +
        '    animation: ripple 0.6s ease-out;' +
        '    pointer-events: none;' +
        '}' +
        '@keyframes ripple {' +
        '    to {' +
        '        transform: translate(-50%, -50%) scale(4);' +
        '        opacity: 0;' +
        '    }' +
        '}';
    document.head.appendChild(rippleStyles);

    // Subscribe form handling
    var subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var input = subscribeForm.querySelector('input');
            var btn = subscribeForm.querySelector('button');
            if (input.value) {
                btn.textContent = 'Thank You!';
                btn.style.background = '#046307';
                setTimeout(function() {
                    btn.textContent = 'Subscribe';
                    btn.style.background = '';
                    input.value = '';
                }, 2000);
            }
        });
    }

    // Newsletter form handling
    var newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var inputs = newsletterForm.querySelectorAll('input');
            var btn = newsletterForm.querySelector('button');
            if (inputs[0].value && inputs[1].value) {
                btn.innerHTML = '<span>Welcome!</span><span class="btn-decoration">◆</span>';
                btn.style.background = '#046307';
                setTimeout(function() {
                    btn.innerHTML = '<span>Subscribe Now</span><span class="btn-decoration">◆</span>';
                    btn.style.background = '';
                    inputs.forEach(function(input) {
                        input.value = '';
                    });
                }, 2000);
            }
        });
    }

    // Social icon interactions
    var socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(function(icon) {
        icon.addEventListener('mouseenter', function() {
            var glyph = icon.querySelector('.social-icon__glyph');
            if (glyph) {
                glyph.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });

        icon.addEventListener('mouseleave', function() {
            var glyph = icon.querySelector('.social-icon__glyph');
            if (glyph) {
                glyph.style.transform = 'scale(1) rotate(0)';
            }
        });
    });

    // Decorative corner animations
    var corners = document.querySelectorAll('.deco-corner');
    corners.forEach(function(corner, index) {
        corner.style.animation = 'fadeIn 0.5s ease-out ' + (index * 0.2) + 's both';
    });

    // Add fadeIn animation
    var fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = '' +
        '@keyframes fadeIn {' +
        '    from { opacity: 0; }' +
        '    to { opacity: 1; }' +
        '}';
    document.head.appendChild(fadeInStyle);
}

/* =====================================================
   MASTHEAD ANIMATION
===================================================== */
function initMastheadAnimation() {
    var title = document.querySelector('.masthead__title');
    if (!title) return;

    // Shimmer effect to title
    setInterval(function() {
        title.classList.add('shimmer');
        setTimeout(function() {
            title.classList.remove('shimmer');
        }, 1000);
    }, 5000);

    // Animate chevron patterns
    var chevrons = document.querySelectorAll('.chevron-pattern');
    chevrons.forEach(function(chevron, index) {
        chevron.style.animation = 'slideChevrons 2s ease-in-out ' + (index * 0.5) + 's infinite';
    });

    // Add chevron animation
    var chevronStyles = document.createElement('style');
    chevronStyles.textContent = '' +
        '@keyframes slideChevrons {' +
        '    0%, 100% { opacity: 0.6; }' +
        '    50% { opacity: 1; }' +
        '}' +
        '.masthead__title.shimmer {' +
        '    animation: shimmer 1s ease-in-out;' +
        '}';
    document.head.appendChild(chevronStyles);

    // Parallax masthead on scroll
    var mastheadSunburst = document.querySelector('.masthead__sunburst');
    if (mastheadSunburst) {
        window.addEventListener('scroll', function() {
            var scrolled = window.pageYOffset;
            if (scrolled < 500) {
                mastheadSunburst.style.opacity = 1 - (scrolled / 500);
            }
        });
    }
}

/* =====================================================
   ARTICLE REVEAL
===================================================== */
function initArticleReveal() {
    var articleCards = document.querySelectorAll('.article-row .article-card');
    var articleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var cards = entry.target.querySelectorAll('.article-card');
                cards.forEach(function(card, index) {
                    setTimeout(function() {
                        card.classList.add('revealed');
                    }, index * 150);
                });
                articleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    articleCards.forEach(function(card) {
        var parent = card.closest('.article-row');
        if (parent) {
            articleObserver.observe(parent);
        }
    });

    // Feature article reveal
    var featureArticles = document.querySelectorAll('.feature-article');
    featureArticles.forEach(function(article) {
        article.classList.add('reveal-on-scroll');
    });

    // Fashion card reveal
    var fashionCards = document.querySelectorAll('.fashion-card');
    fashionCards.forEach(function(card) {
        card.classList.add('reveal-on-scroll');
    });
}

/* =====================================================
   SMOOTH SCROLL
===================================================== */
function initSmoothScroll() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                var headerOffset = 120;
                var elementPosition = targetElement.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // Add scroll progress indicator
    var progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress__bar"></div>';
    document.body.appendChild(progressBar);

    // Add progress bar styles
    var progressStyles = document.createElement('style');
    progressStyles.textContent = '' +
        '.scroll-progress {' +
        '    position: fixed;' +
        '    top: 0;' +
        '    left: 0;' +
        '    width: 100%;' +
        '    height: 3px;' +
        '    z-index: 9999;' +
        '    background: rgba(212, 175, 55, 0.2);' +
        '}' +
        '.scroll-progress__bar {' +
        '    height: 100%;' +
        '    background: linear-gradient(90deg, var(--color-gold-dark), var(--color-gold-light), var(--color-gold));' +
        '    width: 0%;' +
        '    transition: width 0.1s ease-out;' +
        '}';
    document.head.appendChild(progressStyles);

    // Update progress bar on scroll
    window.addEventListener('scroll', function() {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (winScroll / height) * 100;
        var progressBarEl = document.querySelector('.scroll-progress__bar');
        if (progressBarEl) {
            progressBarEl.style.width = scrolled + '%';
        }
    });
}

/* =====================================================
   NEWS TICKER INTERACTION
===================================================== */
function initTickerInteraction() {
    var ticker = document.querySelector('.news-ticker');
    if (!ticker) return;

    ticker.addEventListener('mouseenter', function() {
        var track = ticker.querySelector('.news-ticker__track');
        if (track) {
            track.style.animationPlayState = 'paused';
        }
    });

    ticker.addEventListener('mouseleave', function() {
        var track = ticker.querySelector('.news-ticker__track');
        if (track) {
            track.style.animationPlayState = 'running';
        }
    });
}

/* =====================================================
   CURSOR GLOW EFFECT
===================================================== */
function initCursorGlow() {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    var glowStyles = document.createElement('style');
    glowStyles.textContent = '' +
        '.cursor-glow {' +
        '    position: fixed;' +
        '    width: 200px;' +
        '    height: 200px;' +
        '    background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);' +
        '    border-radius: 50%;' +
        '    pointer-events: none;' +
        '    z-index: 9998;' +
        '    transform: translate(-50%, -50%);' +
        '    transition: opacity 0.3s ease;' +
        '}' +
        'body:hover .cursor-glow {' +
        '    opacity: 1;' +
        '}';
    document.head.appendChild(glowStyles);

    document.addEventListener('mousemove', function(e) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// Initialize cursor glow
initCursorGlow();

/* =====================================================
   3D CARD TILT EFFECT
===================================================== */
function initTiltEffect() {
    var cards = document.querySelectorAll('.article-card, .feature-article, .fashion-card');
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 20;
            var rotateY = (centerX - x) / 20;
            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Initialize tilt effect
initTiltEffect();

/* =====================================================
   CONSOLE EASTER EGG
===================================================== */
console.log('%c◆ THE GILDED AGE GAZETTE ◆', 'font-family: serif; font-size: 20px; color: #D4AF37; font-weight: bold;');
console.log('%cEst. 1910', 'font-family: serif; font-size: 14px; color: #888;');
console.log('%c✦ A 1920s Art Deco Magazine Experience ✦', 'font-family: serif; font-size: 12px; color: #666; font-style: italic;');
console.log('"So we beat on, boats against the current, borne back ceaselessly into the past." — F. Scott Fitzgerald');

/* =====================================================
   UTILITY FUNCTIONS
===================================================== */
function debounce(func, wait) {
    var timeout;
    wait = wait || 20;
    return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function() {
            clearTimeout(timeout);
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    var inThrottle;
    limit = limit || 100;
    return function executedFunction() {
        var context = this;
        var args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

/* =====================================================
   LAZY LOADING
===================================================== */
function initLazyLoading() {
    var lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length === 0) return;

    var imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(function(img) {
        imageObserver.observe(img);
    });
}

initLazyLoading();

/* =====================================================
   BODY LOADED STATE
===================================================== */
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});