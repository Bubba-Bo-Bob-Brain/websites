// ============================================
// THE ENCHANTED BAZAAR - JAVASCRIPT INTERACTIVITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enchantments
    initLanternCursor();
    initSmokeParticles();
    initRubToReveal();
    initCountdownTimer();
    initProductReveal();
    initSmoothScroll();
    initCartAnimations();
    initMagicLampEffects();
});

// ============================================
// LANTERN CURSOR GLOW EFFECT
// ============================================
function initLanternCursor() {
    const lanternGlow = document.getElementById('lantern-glow');
    const productCards = document.querySelectorAll('.product-card');
    
    // Track mouse position with smooth following
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Make glow larger when hovering over interactive elements
        const hoveredElement = e.target;
        const isInteractive = hoveredElement.matches('button, a, .product-card, .lamp-rub-area, input');
        
        if (isInteractive) {
            lanternGlow.style.width = '200px';
            lanternGlow.style.height = '200px';
            lanternGlow.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)';
        } else {
            lanternGlow.style.width = '150px';
            lanternGlow.style.height = '150px';
            lanternGlow.style.background = 'radial-gradient(circle, rgba(255, 179, 71, 0.2) 0%, transparent 70%)';
        }
    });
    
    // Smooth animation for lantern glow
    function animateGlow() {
        // Smooth easing towards mouse position
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        lanternGlow.style.left = glowX + 'px';
        lanternGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
    
    // Add magical trail effect on product cards
    productCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create subtle golden trail
            const trail = document.createElement('div');
            trail.className = 'magic-trail';
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
            
            card.appendChild(trail);
            
            // Remove trail after animation
            setTimeout(() => {
                trail.remove();
            }, 1000);
        });
    });
}

// ============================================
// INCENSE SMOKE PARTICLE SYSTEM
// ============================================
function initSmokeParticles() {
    const smokeContainer = document.getElementById('smoke-particles');
    const particleCount = 20;
    
    // Create smoke particles
    for (let i = 0; i < particleCount; i++) {
        createSmokeParticle(smokeContainer, i);
    }
    
    // Continuously create new particles
    setInterval(() => {
        if (smokeContainer.children.length < particleCount * 2) {
            createSmokeParticle(smokeContainer, Math.random() * 1000);
        }
    }, 3000);
}

function createSmokeParticle(container, seed) {
    const particle = document.createElement('div');
    particle.className = 'smoke-particle';
    
    // Random properties for natural movement
    const size = 50 + Math.random() * 100;
    const startX = Math.random() * window.innerWidth;
    const duration = 15 + Math.random() * 20;
    const delay = Math.random() * -20;
    
    // Vary colors between purple and blue
    const hue = 260 + Math.random() * 60; // Purple to blue range
    const saturation = 50 + Math.random() * 30;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = startX + 'px';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    particle.style.background = `radial-gradient(circle, hsla(${hue}, ${saturation}%, 40%, 0.1) 0%, transparent 70%)`;
    
    // Add slight horizontal drift
    const drift = (Math.random() - 0.5) * 200;
    particle.style.setProperty('--drift', drift + 'px');
    
    container.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        if (particle.parentNode === container) {
            container.removeChild(particle);
        }
    }, (duration - delay) * 1000);
}

// ============================================
// RUB-TO-REVEAL INTERACTION
// ============================================
function initRubToReveal() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const rubArea = card.querySelector('.rub-to-reveal');
        const lampRub = card.querySelector('.lamp-rub-area');
        
        if (!rubArea || !lampRub) return;
        
        let isRubbing = false;
        let rubCount = 0;
        const requiredRubs = 10;
        
        // Mouse events for desktop
        lampRub.addEventListener('mousedown', startRubbing);
        document.addEventListener('mouseup', stopRubbing);
        document.addEventListener('mousemove', doRubbing);
        
        // Touch events for mobile
        lampRub.addEventListener('touchstart', startRubbing);
        document.addEventListener('touchend', stopRubbing);
        document.addEventListener('touchmove', doRubbing);
        
        function startRubbing(e) {
            e.preventDefault();
            isRubbing = true;
            rubCount = 0;
            lampRub.style.transform = 'scale(1.2)';
            lampRub.style.filter = 'drop-shadow(0 0 20px #ffb347)';
        }
        
        function stopRubbing() {
            isRubbing = false;
            lampRub.style.transform = 'scale(1)';
            lampRub.style.filter = 'drop-shadow(0 0 10px #ffb347)';
            
            // Reset if not enough rubs
            if (rubCount < requiredRubs) {
                rubCount = 0;
            }
        }
        
        function doRubbing(e) {
            if (!isRubbing) return;
            
            // Check if cursor/touch is over the lamp area
            const rect = lampRub.getBoundingClientRect();
            let clientX, clientY;
            
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            const isOverLamp = clientX >= rect.left && 
                              clientX <= rect.right && 
                              clientY >= rect.top && 
                              clientY <= rect.bottom;
            
            if (isOverLamp) {
                rubCount++;
                
                // Visual feedback for rubs
                const progress = Math.min(rubCount / requiredRubs, 1);
                lampRub.style.transform = `scale(${1 + progress * 0.3})`;
                
                // Create sparkle effect
                createSparkle(clientX, clientY);
                
                // Reveal product when enough rubs
                if (rubCount >= requiredRubs) {
                    revealProduct(card);
                }
            }
        }
    });
}

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    
    // Random sparkle properties
    const size = 5 + Math.random() * 10;
    const hue = 40 + Math.random() * 20; // Gold colors
    const duration = 0.5 + Math.random() * 1;
    
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    sparkle.style.background = `hsl(${hue}, 100%, 70%)`;
    sparkle.style.animation = `sparkle-fade ${duration}s ease-out forwards`;
    
    document.body.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, duration * 1000);
}

function revealProduct(card) {
    card.classList.add('revealed');
    
    // Create magical reveal effect
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Burst of light effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkle(
                centerX + (Math.random() - 0.5) * 100,
                centerY + (Math.random() - 0.5) * 100
            );
        }, i * 50);
    }
    
    // Play magical sound (optional - browser may block)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Audio not supported or blocked
    }
}

// ============================================
// PRODUCT REVEAL ON SCROLL
// ============================================
function initProductReveal() {
    const productCards = document.querySelectorAll('.product-card[data-reveal="true"]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(card);
    });
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdownTimer() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Set end time to midnight tonight
    const now = new Date();
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const currentTime = new Date();
        const diff = endTime - currentTime;
        
        if (diff <= 0) {
            // Reset timer for next day
            endTime.setDate(endTime.getDate() + 1);
            endTime.setHours(23, 59, 59, 999);
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Add pulsing effect when time is running low
        if (hours === 0 && minutes < 30) {
            const timerBlocks = document.querySelectorAll('.timer-block');
            timerBlocks.forEach(block => {
                block.style.animation = 'pulse-warning 1s infinite';
            });
        }
    }
    
    // Update every second
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.main-navigation a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset for arched frame
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add magical highlight to target section
                targetElement.style.animation = 'highlight-section 2s ease';
                setTimeout(() => {
                    targetElement.style.animation = '';
                }, 2000);
            }
        });
    });
}

// ============================================
// CART ANIMATIONS
// ============================================
function initCartAnimations() {
    const cartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 3; // Starting count
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animate button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Create flying item animation
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.product-image');
            const productEmoji = productImage.querySelector('[class$="-preview"]').textContent;
            
            createFlyingItem(productEmoji, this);
            
            // Update cart count with animation
            setTimeout(() => {
                cartItems++;
                cartCount.textContent = cartItems;
                cartCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartCount.style.transform = 'scale(1)';
                }, 200);
            }, 600);
        });
    });
}

function createFlyingItem(emoji, sourceButton) {
    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    flyingItem.textContent = emoji;
    flyingItem.style.fontSize = '2rem';
    
    // Position at source button
    const rect = sourceButton.getBoundingClientRect();
    flyingItem.style.left = rect.left + rect.width / 2 + 'px';
    flyingItem.style.top = rect.top + 'px';
    
    document.body.appendChild(flyingItem);
    
    // Animate to cart
    const cartButton = document.querySelector('.cart-btn');
    const cartRect = cartButton.getBoundingClientRect();
    
    // Calculate trajectory
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;
    
    // Arc animation
    const duration = 800;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Quadratic bezier curve for arc
        const controlX = (startX + endX) / 2;
        const controlY = Math.min(startY, endY) - 100;
        
        const x = Math.pow(1 - progress, 2) * startX + 
                 2 * (1 - progress) * progress * controlX + 
                 Math.pow(progress, 2) * endX;
                 
        const y = Math.pow(1 - progress, 2) * startY + 
                 2 * (1 - progress) * progress * controlY + 
                 Math.pow(progress, 2) * endY;
        
        flyingItem.style.left = x + 'px';
        flyingItem.style.top = y + 'px';
        flyingItem.style.transform = `rotate(${progress * 360}deg) scale(${1 - progress * 0.5})`;
        flyingItem.style.opacity = 1 - progress * 0.5;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Remove and create burst effect at cart
            flyingItem.remove();
            createCartBurst(endX, endY);
        }
    }
    
    requestAnimationFrame(animate);
}

function createCartBurst(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'cart-burst-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = (i / 10) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;
        
        particle.style.setProperty('--end-x', endX + 'px');
        particle.style.setProperty('--end-y', endY + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 500);
    }
}

// ============================================
// MAGIC LAMP EFFECTS
// ============================================
function initMagicLampEffects() {
    const lampIcons = document.querySelectorAll('.lamp-icon, .floating-lamp');
    
    lampIcons.forEach(lamp => {
        // Random flicker effect
        setInterval(() => {
            const intensity = 0.7 + Math.random() * 0.3;
            lamp.style.filter = `drop-shadow(0 0 ${15 * intensity}px #ffb347)`;
        }, 100);
        
        // Click effect
        lamp.addEventListener('click', function() {
            // Create magic swirl
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            createMagicSwirl(centerX, centerY);
        });
    });
}

function createMagicSwirl(x, y) {
    const swirl = document.createElement('div');
    swirl.className = 'magic-swirl';
    swirl.style.left = x + 'px';
    swirl.style.top = y + 'px';
    
    document.body.appendChild(swirl);
    
    // Remove after animation
    setTimeout(() => {
        swirl.remove();
    }, 1000);
}

// ============================================
// ADDITIONAL CSS ANIMATIONS (DYNAMIC)
// ============================================
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes sparkle-fade {
        0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
        }
    }
    
    @keyframes pulse-warning {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255, 157, 0, 0.3);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(255, 157, 0, 0.6);
        }
    }
    
    @keyframes highlight-section {
        0% {
            box-shadow: 0 0 0 rgba(212, 175, 55, 0);
        }
        50% {
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
        }
        100% {
            box-shadow: 0 0 0 rgba(212, 175, 55, 0);
        }
    }
    
    @keyframes cart-burst {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes magic-swirl {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
            border-width: 5px;
        }
        100% {
            transform: translate(-50%, -50%) scale(3) rotate(180deg);
            opacity: 0;
            border-width: 1px;
        }
    }
    
    .magic-trail {
        position: absolute;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #d4af37, transparent);
        border-radius: 50%;
        pointer-events: none;
        animation: trail-fade 1s ease-out forwards;
        z-index: 1000;
    }
    
    @keyframes trail-fade {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
    
    .cart-burst-particle {
        position: fixed;
        width: 8px;
        height: 8px;
        background: #d4af37;
        border-radius: 50%;
        pointer-events: none;
        animation: cart-burst 0.5s ease-out forwards;
        z-index: 10000;
    }
    
    .magic-swirl {
        position: fixed;
        width: 50px;
        height: 50px;
        border: 3px solid #d4af37;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: magic-swirl 1s ease-out forwards;
        pointer-events: none;
        z-index: 9999;
    }
    
    .sparkle {
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        border-radius: 50%;
    }
    
    .flying-item {
        position: fixed;
        pointer-events: none;
        z-index: 10001;
        text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
    }
`;
document.head.appendChild(additionalStyles);

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(function() {
        // Parallax effect for background
        const scrolled = window.pageYOffset;
        const zelligeBg = document.getElementById('zellige-background');
        if (zelligeBg) {
            zelligeBg.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
});

// Lazy load images for better performance
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}