/* =====================================================
/* THE ETERNAL SOUK - Enchanted Bazaar Scripts
/* ===================================================== */

'use strict';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initLanternGlow();
    initSmokeParticles();
    initRubToReveal();
    initCountdownTimer();
    initNavigation();
    initNewsletterForm();
    initScrollEffects();
    initProductCards();
    initFloatingElements();
    initNotifications();
    initButtonEffects();
});

/* =====================================================
/* LANTERN GLOW - Cursor Following Light Effect
/* ===================================================== */

function initLanternGlow() {
    var lanternGlow = document.getElementById('lanternGlow');
    if (!lanternGlow) return;
    
    var mouseX = 0;
    var mouseY = 0;
    var currentX = 0;
    var currentY = 0;
    var smoothing = 0.08;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lanternGlow.classList.add('active');
    });
    
    function animateLantern() {
        currentX += (mouseX - currentX) * smoothing;
        currentY += (mouseY - currentY) * smoothing;
        lanternGlow.style.left = currentX + 'px';
        lanternGlow.style.top = currentY + 'px';
        requestAnimationFrame(animateLantern);
    }
    
    animateLantern();
    
    document.addEventListener('mouseleave', function() {
        lanternGlow.classList.remove('active');
    });
    
    var interactiveElements = document.querySelectorAll('button, a, .nav-item, .product-card, .category-card');
    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            lanternGlow.style.transform = 'translate(-50%, -50%) scale(1.3)';
            lanternGlow.style.opacity = '1';
        });
        el.addEventListener('mouseleave', function() {
            lanternGlow.style.transform = 'translate(-50%, -50%) scale(1)';
            lanternGlow.style.opacity = '';
        });
    });
}

/* =====================================================
/* SMOKE PARTICLES - Incense Smoke Effect
/* ===================================================== */

function initSmokeParticles() {
    var smokeContainer = document.getElementById('smokeContainer');
    if (!smokeContainer) return;
    
    var particleCount = 12;
    var colors = [
        'rgba(222, 184, 135, 0.15)',
        'rgba(255, 191, 0, 0.1)',
        'rgba(212, 175, 55, 0.12)'
    ];
    
    function createSmokeParticle() {
        var particle = document.createElement('div');
        particle.className = 'smoke-particle';
        
        particle.style.left = (Math.random() * 100) + '%';
        particle.style.bottom = '-50px';
        
        var size = 20 + Math.random() * 40;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        var colorIndex = Math.floor(Math.random() * colors.length);
        particle.style.background = 'radial-gradient(circle, ' + colors[colorIndex] + ' 0%, transparent 70%)';
        
        var duration = 8 + Math.random() * 12;
        particle.style.animationDuration = duration + 's';
        
        var drift = -50 + Math.random() * 100;
        
        smokeContainer.appendChild(particle);
        
        setTimeout(function() {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }
    
    for (var i = 0; i < particleCount; i++) {
        setTimeout(createSmokeParticle, i * 600);
    }
    
    setInterval(createSmokeParticle, 2500);
}

/* =====================================================
/* RUB TO REVEAL - Magic Lamp Interaction
/* ===================================================== */

function initRubToReveal() {
    var rubAreas = document.querySelectorAll('.product-rub-area');
    
    rubAreas.forEach(function(area) {
        var isRubbing = false;
        var rubProgress = 0;
        var requiredRubs = 20;
        
        function reveal() {
            area.classList.add('revealed');
            area.setAttribute('data-rubbed', 'true');
            createCelebrationParticles(area);
        }
        
        function handleRub(e) {
            if (area.getAttribute('data-rubbed') === 'true') return;
            
            e.preventDefault();
            rubProgress++;
            
            var revealElement = area.querySelector('.rub-reveal');
            if (revealElement) {
                var percentage = Math.min((rubProgress / requiredRubs) * 100, 100);
                revealElement.style.width = percentage + '%';
            }
            
            var randomX = (Math.random() - 0.5) * 4;
            var randomY = (Math.random() - 0.5) * 2;
            area.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
            
            if (Math.random() > 0.6) {
                var rect = area.getBoundingClientRect();
                var x = e.clientX || ((e.touches && e.touches[0]) ? e.touches[0].clientX : rect.left + rect.width / 2);
                var y = e.clientY || ((e.touches && e.touches[0]) ? e.touches[0].clientY : rect.top + rect.height / 2);
                createSparkParticle(x, y);
            }
            
            if (rubProgress >= requiredRubs) {
                reveal();
                area.style.transform = '';
            }
        }
        
        function stopRubbing() {
            isRubbing = false;
            area.style.transition = 'transform 0.2s ease-out';
            area.style.transform = '';
            setTimeout(function() {
                area.style.transition = '';
            }, 200);
        }
        
        area.addEventListener('mousedown', function(e) {
            isRubbing = true;
            handleRub(e);
        });
        
        document.addEventListener('mouseup', stopRubbing);
        
        document.addEventListener('mousemove', function(e) {
            if (isRubbing) handleRub(e);
        });
        
        area.addEventListener('touchstart', function(e) {
            isRubbing = true;
            handleRub(e);
        }, { passive: false });
        
        document.addEventListener('touchend', stopRubbing);
        
        document.addEventListener('touchmove', function(e) {
            if (isRubbing) handleRub(e);
        }, { passive: false });
    });
}

function createSparkParticle(x, y) {
    var sparkChars = ['✦', '✧', '⋆', '✨'];
    var spark = document.createElement('div');
    spark.textContent = sparkChars[Math.floor(Math.random() * sparkChars.length)];
    
    var size = 0.8 + Math.random() * 0.8;
    spark.style.position = 'fixed';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    spark.style.pointerEvents = 'none';
    spark.style.zIndex = '9999';
    spark.style.fontSize = size + 'rem';
    spark.style.color = '#D4AF37';
    spark.style.textShadow = '0 0 10px #D4AF37';
    spark.style.animation = 'sparkFly 0.8s ease-out forwards';
    
    document.body.appendChild(spark);
    
    setTimeout(function() {
        if (spark.parentNode) {
            spark.parentNode.removeChild(spark);
        }
    }, 800);
}

function createCelebrationParticles(element) {
    var rect = element.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    
    var sparkChars = ['✦', '✧', '⋆', '✨', '🌟'];
    
    for (var i = 0; i < 15; i++) {
        (function(index) {
            setTimeout(function() {
                var spark = document.createElement('div');
                spark.textContent = sparkChars[Math.floor(Math.random() * sparkChars.length)];
                
                var angle = (index / 15) * Math.PI * 2;
                var distance = 50 + Math.random() * 50;
                var targetX = centerX + Math.cos(angle) * distance;
                var targetY = centerY + Math.sin(angle) * distance;
                
                var size = 1 + Math.random();
                spark.style.position = 'fixed';
                spark.style.left = centerX + 'px';
                spark.style.top = centerY + 'px';
                spark.style.pointerEvents = 'none';
                spark.style.zIndex = '9999';
                spark.style.fontSize = size + 'rem';
                spark.style.color = '#D4AF37';
                spark.style.textShadow = '0 0 15px #D4AF37';
                spark.style.transition = 'all 1s ease-out';
                
                document.body.appendChild(spark);
                
                requestAnimationFrame(function() {
                    spark.style.left = targetX + 'px';
                    spark.style.top = targetY + 'px';
                    spark.style.opacity = '0';
                    spark.style.transform = 'scale(0)';
                });
                
                setTimeout(function() {
                    if (spark.parentNode) {
                        spark.parentNode.removeChild(spark);
                    }
                }, 1000);
            }, index * 50);
        })(i);
    }
}

/* =====================================================
/* COUNTDOWN TIMER - Auction/Sale Countdown
/* ===================================================== */

function initCountdownTimer() {
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(targetDate.getHours() + 14);
    targetDate.setMinutes(targetDate.getMinutes() + 32);
    
    function updateCountdown() {
        var now = new Date().getTime();
        var distance = targetDate.getTime() - now;
        
        if (distance < 0) {
            var countdownNums = document.querySelectorAll('.countdown-number');
            countdownNums.forEach(function(el) {
                el.textContent = '00';
            });
            var offerTag = document.querySelector('.offer-tag');
            if (offerTag) offerTag.textContent = '⚱️ Auction Ended';
            return;
        }
        
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        var daysEl = document.getElementById('days');
        var hoursEl = document.getElementById('hours');
        var minutesEl = document.getElementById('minutes');
        var secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        
        if (secondsEl) {
            secondsEl.classList.add('pulse');
            setTimeout(function() {
                secondsEl.classList.remove('pulse');
            }, 200);
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* =====================================================
/* NAVIGATION - Section Navigation
/* ===================================================== */

function initNavigation() {
    var navItems = document.querySelectorAll('.nav-item');
    var sections = document.querySelectorAll('section[id]');
    var exploreBtn = document.getElementById('exploreBtn');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            var productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var sectionId = this.getAttribute('data-section');
            if (sectionId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                var section = document.getElementById(sectionId) || document.getElementById('products');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    function updateActiveNav() {
        var scrollPosition = window.scrollY + 200;
        
        sections.forEach(function(section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(function(item) {
                    item.classList.remove('active');
                    if (item.getAttribute('data-section') === sectionId || 
                        (sectionId === 'products' && item.getAttribute('data-section') === 'home')) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    var scrollHandler = throttle(updateActiveNav, 100);
    window.addEventListener('scroll', scrollHandler);
    
    updateActiveNav();
}

/* =====================================================
/* NEWSLETTER FORM - Form Handling
/* ===================================================== */

function initNewsletterForm() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var nameInput = document.getElementById('subscriberName');
        var emailInput = document.getElementById('subscriberEmail');
        
        var name = nameInput ? nameInput.value.trim() : '';
        var email = emailInput ? emailInput.value.trim() : '';
        
        if (!name || !email) {
            showNotification('Please fill in all fields, traveler!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        setTimeout(function() {
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            
            showNotification('Welcome to the Inner Circle, ' + name + '! Secrets shall find you soon.', 'success');
            
            var formContainer = form.closest('.newsletter-container');
            if (formContainer) {
                formContainer.style.animation = 'magicFlash 0.5s ease-out';
                setTimeout(function() {
                    formContainer.style.animation = '';
                }, 500);
            }
        }, 800);
    });
}

function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* =====================================================
/* SCROLL EFFECTS - Reveal Animations
/* ===================================================== */

function initScrollEffects() {
    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                var children = entry.target.querySelectorAll('.product-card, .category-card, .testimonial-card');
                children.forEach(function(child, index) {
                    setTimeout(function() {
                        child.classList.add('revealed');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    var sectionsToObserve = document.querySelectorAll('.section-header, .categories-section, .products-section, .testimonials-section, .newsletter-section');
    sectionsToObserve.forEach(function(el) {
        observer.observe(el);
    });
    
    var carpets = document.querySelectorAll('.floating-carpet');
    var scrollHandler = throttle(function() {
        var scrollY = window.scrollY;
        carpets.forEach(function(carpet, index) {
            var speed = 0.05 + (index * 0.02);
            var rotation = index === 0 ? 'rotate(-5deg)' : 'rotate(8deg)';
            carpet.style.transform = 'translateY(' + (scrollY * speed) + 'px) ' + rotation;
        });
    }, 16);
    
    window.addEventListener('scroll', scrollHandler);
}

/* =====================================================
/* PRODUCT CARDS - Interactive Effects
/* ===================================================== */

function initProductCards() {
    var productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            card.classList.add('hovering');
            createFloatingParticles(card);
        });
        
        card.addEventListener('mouseleave', function() {
            card.classList.remove('hovering');
        });
        
        var btn = card.querySelector('.btn-product');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var productName = card.querySelector('.product-name');
                var name = productName ? productName.textContent : 'Item';
                addToCartAnimation(btn);
                showNotification(name + ' added to your collection!', 'success');
            });
        }
    });
    
    function createFloatingParticles(card) {
        var rect = card.getBoundingClientRect();
        for (var i = 0; i < 3; i++) {
            (function(index) {
                setTimeout(function() {
                    var particle = document.createElement('div');
                    particle.textContent = '✦';
                    
                    var leftPos = rect.left + Math.random() * rect.width;
                    var topPos = rect.top + Math.random() * 50;
                    
                    particle.style.position = 'fixed';
                    particle.style.left = leftPos + 'px';
                    particle.style.top = topPos + 'px';
                    particle.style.pointerEvents = 'none';
                    particle.style.zIndex = '9999';
                    particle.style.fontSize = '0.8rem';
                    particle.style.color = '#D4AF37';
                    particle.style.opacity = '0.8';
                    particle.style.transition = 'all 2s ease-out';
                    
                    document.body.appendChild(particle);
                    
                    requestAnimationFrame(function() {
                        particle.style.top = (topPos - 100) + 'px';
                        particle.style.opacity = '0';
                        particle.style.transform = 'scale(0)';
                    });
                    
                    setTimeout(function() {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 2000);
                }, index * 200);
            })(i);
        }
    }
    
    function addToCartAnimation(btn) {
        btn.classList.add('adding');
        var originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>✨ Adding...</span>';
        
        setTimeout(function() {
            btn.innerHTML = '<span>✓ Added!</span>';
            setTimeout(function() {
                btn.innerHTML = originalHTML;
                btn.classList.remove('adding');
            }, 1000);
        }, 500);
    }
}

/* =====================================================
/* FLOATING ELEMENTS - Decorative Animations
/* ===================================================== */

function initFloatingElements() {
    var ornaments = document.querySelectorAll('.header-ornament, .offer-decoration');
    ornaments.forEach(function(ornament, index) {
        var duration = 3 + index;
        ornament.style.animation = 'subtleFloat ' + duration + 's ease-in-out infinite';
    });
    
    var particleContainer = document.createElement('div');
    particleContainer.id = 'ambientParticles';
    particleContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; overflow: hidden;';
    document.body.appendChild(particleContainer);
    
    function createAmbientParticle() {
        var symbols = ['✦', '✧', '⋆', '·', '•'];
        var particle = document.createElement('div');
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        var size = 0.5 + Math.random() * 1;
        var opacity = 0.1 + Math.random() * 0.3;
        var duration = 10 + Math.random() * 20;
        
        particle.style.position = 'absolute';
        particle.style.left = (Math.random() * 100) + '%';
        particle.style.top = (100 + Math.random() * 20) + '%';
        particle.style.fontSize = size + 'rem';
        particle.style.color = '#D4AF37';
        particle.style.opacity = opacity;
        particle.style.transition = 'top ' + duration + 's linear, opacity 1s ease';
        
        particleContainer.appendChild(particle);
        
        requestAnimationFrame(function() {
            particle.style.top = '-10%';
        });
        
        setTimeout(function() {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }
    
    for (var i = 0; i < 10; i++) {
        setTimeout(createAmbientParticle, i * 2000);
    }
    
    setInterval(createAmbientParticle, 3000);
}

/* =====================================================
/* NOTIFICATIONS - Toast Messages
/* ===================================================== */

function initNotifications() {
    // Notification system ready
}

function showNotification(message, type) {
    type = type || 'info';
    
    var notification = document.getElementById('notification');
    if (!notification) return;
    
    var messageEl = notification.querySelector('.notification-message');
    var iconEl = notification.querySelector('.notification-icon');
    
    if (messageEl) messageEl.textContent = message;
    if (iconEl) {
        var icons = {
            success: '✨',
            error: '⚠️',
            info: '📜'
        };
        iconEl.textContent = icons[type] || icons.info;
    }
    
    var content = notification.querySelector('.notification-content');
    if (content) {
        if (type === 'error') {
            content.style.background = 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)';
        } else if (type === 'success') {
            content.style.background = 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)';
        } else {
            content.style.background = 'linear-gradient(135deg, #1E90FF 0%, #0F52BA 100%)';
        }
    }
    
    notification.classList.add('show');
    
    setTimeout(function() {
        notification.classList.remove('show');
    }, 4000);
}

window.showNotification = showNotification;

/* =====================================================
/* BUTTON EFFECTS - Magical Interactions
/* ===================================================== */

function initButtonEffects() {
    var buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var rect = this.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            
            var ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.position = 'absolute';
            ripple.style.background = 'rgba(255, 255, 255, 0.4)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'rippleEffect 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.marginLeft = '-50px';
            ripple.style.marginTop = '-50px';
            
            this.appendChild(ripple);
            
            setTimeout(function() {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    var offerBtn = document.querySelector('.btn-offer');
    if (offerBtn) {
        offerBtn.addEventListener('mouseenter', function() {
            offerBtn.style.animation = 'magicPulse 1s ease-in-out infinite';
        });
        offerBtn.addEventListener('mouseleave', function() {
            offerBtn.style.animation = '';
        });
    }
}

/* =====================================================
/* UTILITY FUNCTIONS
/* ===================================================== */

function throttle(func, limit) {
    var inThrottle = false;
    return function() {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

function debounce(func, wait) {
    var timeout;
    return function() {
        var args = arguments;
        var context = this;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

/* =====================================================
/* KEYBOARD NAVIGATION & ACCESSIBILITY
/* ===================================================== */

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var notification = document.getElementById('notification');
        if (notification && document.activeElement && document.activeElement.classList.contains('notification')) {
            notification.classList.remove('show');
        }
    }
});

/* =====================================================
/* CONSOLE EASTER EGG
/* ===================================================== */

console.log('%c✨ The Eternal Souk ✨', 'color: #D4AF37; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px #000;');
console.log('%cWhere Dreams Are Woven Into Reality', 'color: #DEB887; font-size: 14px; font-style: italic;');
console.log('%cBeware the merchant who smiles too warmly...', 'color: #722F37; font-size: 12px;');