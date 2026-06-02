document.addEventListener('DOMContentLoaded', function () {

    var curtainOverlay = document.getElementById('curtainOverlay');
    var curtainCta = document.querySelector('.curtain-cta');
    var chandelier = document.getElementById('chandelier');
    var lightPatterns = document.getElementById('lightPatterns');
    var siteHeader = document.querySelector('.site-header');
    var seatTooltip = document.getElementById('seatTooltip');
    var body = document.body;

    var tierNames = {
        'platea': 'Platea',
        'primo-ordine': 'Primo Ordine',
        'secondo-ordine': 'Secondo Ordine',
        'galleria': 'Galleria'
    };

    function openCurtain() {
        curtainOverlay.classList.add('open');
        body.classList.add('curtain-open');

        setTimeout(function () {
            chandelier.classList.add('visible');
            lightPatterns.classList.add('visible');
        }, 800);

        setTimeout(function () {
            siteHeader.classList.add('visible');
        }, 1400);

        setTimeout(function () {
            curtainOverlay.style.display = 'none';
        }, 2200);

        generateLightPatterns();
        initScrollReveal();
    }

    curtainCta.addEventListener('click', openCurtain);

    function generateLightPatterns() {
        var count = 30;
        for (var i = 0; i < count; i++) {
            var dot = document.createElement('div');
            dot.classList.add('light-dot');

            var x = Math.random() * 100;
            var y = Math.random() * 80;
            var size = 2 + Math.random() * 6;
            var duration = 8 + Math.random() * 12;
            var delay = Math.random() * -20;
            var opacity = 0.1 + Math.random() * 0.25;

            dot.style.left = x + '%';
            dot.style.top = y + '%';
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            dot.style.animationDuration = duration + 's';
            dot.style.animationDelay = delay + 's';
            dot.style.opacity = opacity;

            lightPatterns.appendChild(dot);
        }
    }

    function initScrollReveal() {
        var revealElements = document.querySelectorAll('.performance-card, .performer-card');

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(function (el) {
                el.classList.add('revealed');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = 0;
                    var parent = entry.target.parentElement;
                    if (parent) {
                        var siblings = Array.from(parent.children);
                        var index = siblings.indexOf(entry.target);
                        delay = index * 120;
                    }

                    setTimeout(function () {
                        entry.target.classList.add('revealed');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    function handleSeatHover(e) {
        var target = e.currentTarget;
        var tier = target.getAttribute('data-tier');
        var price = target.getAttribute('data-price');

        if (!tier || !price) return;

        var tierName = tierNames[tier] || tier;
        var tooltipTier = seatTooltip.querySelector('.tooltip-tier');
        var tooltipPrice = seatTooltip.querySelector('.tooltip-price');

        tooltipTier.textContent = tierName;
        tooltipPrice.textContent = price + ' ducats';

        seatTooltip.classList.add('visible');
    }

    function handleSeatMove(e) {
        var x = e.clientX + 15;
        var y = e.clientY - 10;

        var tooltipRect = seatTooltip.getBoundingClientRect();
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;

        if (x + tooltipRect.width + 10 > viewportWidth) {
            x = e.clientX - tooltipRect.width - 15;
        }

        if (y + tooltipRect.height + 10 > viewportHeight) {
            y = e.clientY - tooltipRect.height - 10;
        }

        seatTooltip.style.left = x + 'px';
        seatTooltip.style.top = y + 'px';
    }

    function handleSeatLeave() {
        seatTooltip.classList.remove('visible');
    }

    var seatElements = document.querySelectorAll('.seat, .box, .gallery-seat');
    seatElements.forEach(function (el) {
        el.addEventListener('mouseenter', handleSeatHover);
        el.addEventListener('mousemove', handleSeatMove);
        el.addEventListener('mouseleave', handleSeatLeave);
    });

    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    var footerLink = document.querySelector('.footer-link');
    if (footerLink) {
        footerLink.addEventListener('click', function (e) {
            e.preventDefault();
            var hero = document.getElementById('hero');
            if (hero) {
                hero.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    var cardButtons = document.querySelectorAll('.card-btn');
    cardButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var card = this.closest('.performance-card');
            var title = '';
            if (card) {
                var titleEl = card.querySelector('.card-title');
                if (titleEl) {
                    title = titleEl.textContent;
                }
            }

            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
                'background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;' +
                'justify-content:center;opacity:0;transition:opacity 0.4s ease;';

            var modal = document.createElement('div');
            modal.style.cssText = 'max-width:420px;width:90%;padding:40px 30px;text-align:center;' +
                'border:2px solid #C9A84C;background:linear-gradient(135deg,#2A1515,#1A0A0A);' +
                'box-shadow:0 0 60px rgba(201,168,76,0.15),0 0 3px #8B7332;position:relative;';

            var closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&#10005;';
            closeBtn.style.cssText = 'position:absolute;top:12px;right:15px;background:none;border:none;' +
                'color:#8B7332;font-size:1.2rem;cursor:pointer;font-family:serif;padding:4px 8px;' +
                'transition:color 0.3s ease;';
            closeBtn.addEventListener('mouseenter', function () {
                this.style.color = '#C9A84C';
            });
            closeBtn.addEventListener('mouseleave', function () {
                this.style.color = '#8B7332';
            });

            var heading = document.createElement('h3');
            heading.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:1.1rem;" +
                'color:#C9A84C;letter-spacing:0.08em;margin-bottom:8px;';
            heading.textContent = 'Reserve Your Place';

            var performance = document.createElement('p');
            performance.style.cssText = "font-family:'Cormorant Garamond',serif;font-size:1.2rem;" +
                'font-style:italic;color:#FFF8E7;margin-bottom:20px;line-height:1.4;';
            performance.textContent = title;

            var message = document.createElement('p');
            message.style.cssText = "font-family:'Cormorant Garamond',serif;font-size:0.95rem;" +
                'color:#E8DCC8;line-height:1.7;margin-bottom:25px;font-weight:300;';
            message.textContent = 'The box office awaits your command. ' +
                'Present yourself at the Palazzo della Magnificenza, ' +
                'or dispatch your correspondence by modern means to secure your seat.';

            var divider = document.createElement('div');
            divider.style.cssText = 'height:1px;background:linear-gradient(90deg,transparent,#8B7332,transparent);margin-bottom:20px;';

            var acknowledge = document.createElement('button');
            acknowledge.style.cssText = "font-family:'Cormorant Garamond',serif;font-size:0.9rem;" +
                'font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#C9A84C;' +
                'background:linear-gradient(180deg,rgba(139,0,0,0.3),rgba(59,0,0,0.5));' +
                'border:1px solid #8B7332;padding:12px 30px;cursor:pointer;transition:all 0.3s ease;';
            acknowledge.textContent = 'Very Well';
            acknowledge.addEventListener('mouseenter', function () {
                this.style.borderColor = '#C9A84C';
                this.style.boxShadow = '0 0 15px rgba(201,168,76,0.15)';
            });
            acknowledge.addEventListener('mouseleave', function () {
                this.style.borderColor = '#8B7332';
                this.style.boxShadow = 'none';
            });

            modal.appendChild(closeBtn);
            modal.appendChild(heading);
            modal.appendChild(performance);
            modal.appendChild(message);
            modal.appendChild(divider);
            modal.appendChild(acknowledge);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            requestAnimationFrame(function () {
                overlay.style.opacity = '1';
            });

            function closeModal() {
                overlay.style.opacity = '0';
                setTimeout(function () {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 400);
            }

            closeBtn.addEventListener('click', closeModal);
            acknowledge.addEventListener('click', closeModal);
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) {
                    closeModal();
                }
            });

            document.addEventListener('keydown', function handler(e) {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handler);
                }
            });
        });
    });

    var lastScrollY = 0;
    var ticking = false;

    function updateOnScroll() {
        var scrollY = window.scrollY;
        var chandelierBase = -10;
        var parallaxOffset = scrollY * 0.08;
        var chandelierTop = chandelierBase - parallaxOffset;

        if (chandelierTop > -200) {
            chandelier.style.top = chandelierTop + 'px';
        } else {
            chandelier.style.top = '-200px';
        }

        if (scrollY > 100) {
            siteHeader.style.background =
                'linear-gradient(180deg, rgba(26,10,10,0.98) 0%, rgba(26,10,10,0.9) 70%, transparent 100%)';
        } else {
            siteHeader.style.background =
                'linear-gradient(180deg, rgba(26,10,10,0.95) 0%, rgba(26,10,10,0.7) 70%, transparent 100%)';
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });

    var heroSection = document.getElementById('hero');
    if (heroSection) {
        var scrollIndicator = heroSection.querySelector('.hero-scroll-indicator');
        if (scrollIndicator) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 200) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '';
                    scrollIndicator.style.pointerEvents = '';
                }
            });
        }
    }

    var performerCards = document.querySelectorAll('.performer-card');
    performerCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            var spotlight = card.querySelector('.performer-spotlight');
            if (spotlight) {
                spotlight.style.left = x + 'px';
                spotlight.style.top = (y - 60) + 'px';
                spotlight.style.transform = 'translateX(-50%)';
            }
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && curtainOverlay && !curtainOverlay.classList.contains('open')) {
            openCurtain();
        }
    });

});