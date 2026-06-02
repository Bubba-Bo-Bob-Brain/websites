/* ===========================================
   ENCHANTED BAZAAR MARKETPLACE - MAGICAL SCRIPTS
   Interactive elements for an Arabian Nights experience
   =========================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('The Enchanted Bazaar welcomes you, traveler...');
    
    // Initialize all magical features
    initCursorGlow();
    initIncenseSmoke();
    initNavigation();
    initProductInteractions();
    initLampRubbing();
    initMagicCounters();
    initFloatingEffects();
    initAmbientSounds();
    
    // Set initial active section
    setActiveSection('carpets');
});

/* ======================
   CURSOR GLOW EFFECT
   ====================== */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    const body = document.body;
    
    // Update cursor position
    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '0.6';
        
        // Update hover glow position on product cards
        document.querySelectorAll('.product-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const hoverGlow = card.querySelector('.hover-glow');
            if (hoverGlow) {
                hoverGlow.style.setProperty('--mouse-x', `${x}px`);
                hoverGlow.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    });
    
    // Hide cursor glow when mouse leaves window
    document.addEventListener('mouseleave', function() {
        cursorGlow.style.opacity = '0';
    });
    
    // Show cursor glow when mouse enters window
    document.addEventListener('mouseenter', function() {
        cursorGlow.style.opacity = '0.6';
    });
    
    // Add subtle pulse animation
    setInterval(() => {
        const currentOpacity = parseFloat(cursorGlow.style.opacity || 0.6);
        const newOpacity = currentOpacity > 0.5 ? 0.5 + Math.random() * 0.2 : 0.6;
        cursorGlow.style.opacity = newOpacity.toString();
    }, 2000);
}

/* ======================
   INCENSE SMOKE PARTICLES
   ====================== */
function initIncenseSmoke() {
    const smokeContainer = document.getElementById('smokeContainer');
    const smokeColors = [
        'rgba(255, 255, 255, 0.1)',  // White smoke
        'rgba(212, 175, 55, 0.08)',   // Golden smoke
        'rgba(255, 153, 51, 0.06)',   // Saffron smoke
        'rgba(64, 224, 208, 0.05)'    // Turquoise smoke
    ];
    
    // Create smoke particles
    function createSmokeParticle() {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-particle';
        
        // Random properties
        const size = Math.random() * 40 + 20; // 20-60px
        const startX = Math.random() * 100; // 0-100% of viewport width
        const color = smokeColors[Math.floor(Math.random() * smokeColors.length)];
        const duration = Math.random() * 30 + 30; // 30-60 seconds
        const delay = Math.random() * 10; // 0-10 seconds delay
        
        // Apply styles
        smoke.style.position = 'absolute';
        smoke.style.width = `${size}px`;
        smoke.style.height = `${size}px`;
        smoke.style.left = `${startX}%`;
        smoke.style.top = '100%';
        smoke.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
        smoke.style.borderRadius = '50%';
        smoke.style.filter = 'blur(10px)';
        smoke.style.opacity = '0';
        smoke.style.pointerEvents = 'none';
        smoke.style.zIndex = '-1';
        
        // Animation
        smoke.style.animation = `floatUp ${duration}s ${delay}s infinite ease-in`;
        
        smokeContainer.appendChild(smoke);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (smoke.parentNode === smokeContainer) {
                smokeContainer.removeChild(smoke);
            }
        }, (duration + delay) * 1000);
    }
    
    // Create initial smoke particles
    for (let i = 0; i < 8; i++) {
        createSmokeParticle();
    }
    
    // Add CSS animation for smoke
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.7;
            }
            90% {
                opacity: 0.3;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Continuously create new smoke particles
    setInterval(createSmokeParticle, 3000);
}

/* ======================
   SECTION NAVIGATION
   ====================== */
function initNavigation() {
    const navArches = document.querySelectorAll('.nav-arch');
    const sections = document.querySelectorAll('.bazaar-section');
    
    navArches.forEach(arch => {
        arch.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            setActiveSection(sectionId);
            
            // Add visual feedback
            navArches.forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Play magical sound
            playMagicSound('navigate');
        });
    });
}

function setActiveSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.bazaar-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
        
        // Scroll to section smoothly
        activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update magic counters based on section
        updateMagicCounters(sectionId);
    }
}

/* ======================
   PRODUCT INTERACTIONS
   ====================== */
function initProductInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    const wishButtons = document.querySelectorAll('.wish-btn');
    const wishCountElement = document.getElementById('wishCount');
    let wishCount = 0;
    
    // Product card hover effects
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add magical shimmer
            const magicDust = this.querySelector('.magic-dust');
            if (magicDust) {
                magicDust.style.animation = 'dustShimmer 2s ease';
                
                // Reset animation after completion
                setTimeout(() => {
                    magicDust.style.animation = '';
                }, 2000);
            }
            
            // Play subtle magical sound
            playMagicSound('hover');
        });
        
        // Special effect for lamp cards
        if (card.classList.contains('lamp-card')) {
            card.addEventListener('mouseenter', function() {
                const lampGlow = this.querySelector('.lamp-glow');
                if (lampGlow) {
                    lampGlow.style.animation = 'lampFlicker 0.5s infinite alternate';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const lampGlow = this.querySelector('.lamp-glow');
                if (lampGlow) {
                    lampGlow.style.animation = 'lampFlicker 3s infinite alternate';
                }
            });
        }
    });
    
    // Wish button interactions
    wishButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Update wish count
            wishCount++;
            wishCountElement.textContent = wishCount;
            
            // Visual feedback
            const icon = this.querySelector('i');
            icon.classList.remove('far', 'fa-star');
            icon.classList.add('fas', 'fa-star');
            this.style.background = 'linear-gradient(45deg, var(--color-gold-light), var(--color-saffron))';
            this.innerHTML = '<i class="fas fa-star"></i><span>Wish Granted!</span>';
            
            // Create magical sparkle effect
            createSparkleEffect(this);
            
            // Play wish sound
            playMagicSound('wish');
            
            // Reset after 2 seconds
            setTimeout(() => {
                icon.classList.remove('fas', 'fa-star');
                icon.classList.add('far', 'fa-star');
                this.style.background = 'linear-gradient(45deg, var(--color-gold-dark), var(--color-gold))';
                this.innerHTML = '<i class="far fa-star"></i><span>Make a Wish</span>';
            }, 2000);
        });
    });
    
    // Add sparkle animation CSS
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes dustShimmer {
            0% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
            100% { opacity: 0.5; transform: scale(1); }
        }
        
        @keyframes sparkle {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1) rotate(180deg); opacity: 1; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(sparkleStyle);
}

/* ======================
   LAMP RUBBING INTERACTION
   ====================== */
function initLampRubbing() {
    const lampCards = document.querySelectorAll('.lamp-card');
    
    lampCards.forEach(card => {
        let isRubbing = false;
        let rubCount = 0;
        let lastX = 0;
        let lastY = 0;
        
        card.addEventListener('mousedown', function(e) {
            isRubbing = true;
            rubCount = 0;
            lastX = e.clientX;
            lastY = e.clientY;
            
            // Add rubbing visual feedback
            this.style.filter = 'brightness(1.1)';
        });
        
        card.addEventListener('mousemove', function(e) {
            if (!isRubbing) return;
            
            // Calculate movement distance
            const deltaX = Math.abs(e.clientX - lastX);
            const deltaY = Math.abs(e.clientY - lastY);
            
            // If movement is significant, count as a rub
            if (deltaX > 5 || deltaY > 5) {
                rubCount++;
                lastX = e.clientX;
                lastY = e.clientY;
                
                // Create rubbing sparkles
                createRubbingSparkles(this, e.clientX, e.clientY);
                
                // Every 3 rubs, increase glow
                if (rubCount % 3 === 0) {
                    const lampGlow = this.querySelector('.lamp-glow');
                    if (lampGlow) {
                        lampGlow.style.opacity = Math.min(1, 0.7 + (rubCount / 30));
                        lampGlow.style.width = `${60 + rubCount}px`;
                        lampGlow.style.height = `${60 + rubCount}px`;
                    }
                }
                
                // After 10 rubs, reveal wishes
                if (rubCount === 10) {
                    revealWishes(this);
                }
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isRubbing) {
                isRubbing = false;
                
                // Reset card appearance
                card.style.filter = '';
                
                // Gradually reset lamp glow
                const lampGlow = card.querySelector('.lamp-glow');
                if (lampGlow) {
                    setTimeout(() => {
                        lampGlow.style.opacity = '0.7';
                        lampGlow.style.width = '60px';
                        lampGlow.style.height = '60px';
                    }, 1000);
                }
            }
        });
        
        // Touch support for mobile
        card.addEventListener('touchstart', function(e) {
            isRubbing = true;
            rubCount = 0;
            const touch = e.touches[0];
            lastX = touch.clientX;
            lastY = touch.clientY;
            card.style.filter = 'brightness(1.1)';
        });
        
        card.addEventListener('touchmove', function(e) {
            if (!isRubbing) return;
            e.preventDefault();
            const touch = e.touches[0];
            
            const deltaX = Math.abs(touch.clientX - lastX);
            const deltaY = Math.abs(touch.clientY - lastY);
            
            if (deltaX > 5 || deltaY > 5) {
                rubCount++;
                lastX = touch.clientX;
                lastY = touch.clientY;
                
                createRubbingSparkles(this, touch.clientX, touch.clientY);
                
                if (rubCount % 3 === 0) {
                    const lampGlow = this.querySelector('.lamp-glow');
                    if (lampGlow) {
                        lampGlow.style.opacity = Math.min(1, 0.7 + (rubCount / 30));
                        lampGlow.style.width = `${60 + rubCount}px`;
                        lampGlow.style.height = `${60 + rubCount}px`;
                    }
                }
                
                if (rubCount === 10) {
                    revealWishes(this);
                }
            }
        });
        
        card.addEventListener('touchend', function() {
            isRubbing = false;
            card.style.filter = '';
            
            const lampGlow = card.querySelector('.lamp-glow');
            if (lampGlow) {
                setTimeout(() => {
                    lampGlow.style.opacity = '0.7';
                    lampGlow.style.width = '60px';
                    lampGlow.style.height = '60px';
                }, 1000);
            }
        });
    });
    
    // Add rubbing sparkle CSS
    const rubbingStyle = document.createElement('style');
    rubbingStyle.textContent = `
        @keyframes rubbingSparkle {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
    `;
    document.head.appendChild(rubbingStyle);
}

function createRubbingSparkles(card, x, y) {
    const rect = card.getBoundingClientRect();
    const sparkleX = x - rect.left;
    const sparkleY = y - rect.top;
    
    // Create multiple sparkles
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.left = `${sparkleX}px`;
        sparkle.style.top = `${sparkleY}px`;
        sparkle.style.width = '5px';
        sparkle.style.height = '5px';
        sparkle.style.background = `radial-gradient(circle, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba(255, 204, 0, 0.7) 50%, 
            transparent 100%)`;
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10';
        sparkle.style.transform = 'translate(-50%, -50%)';
        sparkle.style.animation = `rubbingSparkle 0.5s ease-out forwards`;
        
        card.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 500);
    }
    
    // Play rubbing sound occasionally
    if (Math.random() > 0.7) {
        playMagicSound('rub');
    }
}

function revealWishes(lampCard) {
    // Create wish reveal effect
    const wishes = [
        "Wish for Wealth",
        "Wish for Wisdom",
        "Wish for Wanderlust"
    ];
    
    const wish = wishes[Math.floor(Math.random() * wishes.length)];
    
    // Create floating wish text
    const wishText = document.createElement('div');
    wishText.textContent = wish;
    wishText.style.position = 'absolute';
    wishText.style.top = '50%';
    wishText.style.left = '50%';
    wishText.style.transform = 'translate(-50%, -50%)';
    wishText.style.color = 'var(--color-gold-light)';
    wishText.style.fontFamily = 'var(--font-heading)';
    wishText.style.fontSize = '1.5rem';
    wishText.style.textShadow = '0 0 10px var(--color-gold)';
    wishText.style.zIndex = '20';
    wishText.style.opacity = '0';
    wishText.style.textAlign = 'center';
    wishText.style.padding = '10px';
    wishText.style.background = 'rgba(26, 26, 46, 0.8)';
    wishText.style.borderRadius = '10px';
    wishText.style.border = '1px solid var(--color-gold)';
    
    lampCard.appendChild(wishText);
    
    // Animate wish text
    setTimeout(() => {
        wishText.style.opacity = '1';
        wishText.style.transform = 'translate(-50%, -150%)';
        wishText.style.transition = 'all 1s ease-out';
    }, 10);
    
    // Play djinn reveal sound
    playMagicSound('reveal');
    
    // Remove wish text after delay
    setTimeout(() => {
        wishText.style.opacity = '0';
        setTimeout(() => {
            if (wishText.parentNode) {
                wishText.parentNode.removeChild(wishText);
            }
        }, 1000);
    }, 3000);
}

/* ======================
   MAGIC COUNTERS
   ====================== */
function initMagicCounters() {
    // Animate counters on page load
    setTimeout(() => {
        animateCounter('carpetCount', 3);
        animateCounter('djinnCount', 3);
        animateCounter('lampCount', 3);
    }, 1000);
}

function updateMagicCounters(sectionId) {
    // Update specific counter based on active section
    const counterIds = {
        'carpets': 'carpetCount',
        'djinn': 'djinnCount',
        'lamps': 'lampCount'
    };
    
    if (counterIds[sectionId]) {
        const counterElement = document.getElementById(counterIds[sectionId]);
        if (counterElement) {
            const currentValue = parseInt(counterElement.textContent);
            const newValue = Math.min(9, currentValue + 1); // Cap at 9
            
            animateCounter(counterIds[sectionId], newValue);
        }
    }
}

function animateCounter(counterId, targetValue) {
    const counterElement = document.getElementById(counterId);
    if (!counterElement) return;
    
    const currentValue = parseInt(counterElement.textContent);
    
    if (currentValue === targetValue) return;
    
    // Create counting animation
    let count = currentValue;
    const increment = currentValue < targetValue ? 1 : -1;
    
    const interval = setInterval(() => {
        count += increment;
        counterElement.textContent = count;
        
        // Add visual effect
        counterElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counterElement.style.transform = 'scale(1)';
        }, 150);
        
        if (count === targetValue) {
            clearInterval(interval);
            
            // Special effect when reaching certain numbers
            if (targetValue === 3 || targetValue === 7 || targetValue === 9) {
                createSparkleEffect(counterElement);
            }
        }
    }, 100);
}

/* ======================
   FLOATING EFFECTS
   ====================== */
function initFloatingEffects() {
    // Make lanterns float more dynamically
    const lanterns = document.querySelectorAll('.lantern');
    
    lanterns.forEach((lantern, index) => {
        // Randomize animation delays and durations
        const delay = index * 1.5;
        const duration = 8 + Math.random() * 4;
        
        lantern.style.animation = `lanternFloat ${duration}s ${delay}s infinite ease-in-out`;
        
        // Add occasional brightness flicker
        setInterval(() => {
            if (Math.random() > 0.7) {
                lantern.style.opacity = (0.3 + Math.random() * 0.3).toString();
            }
        }, 2000);
    });
    
    // Add subtle floating effect to product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        // Slight delay based on position
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

/* ======================
   AMBIENT SOUNDS
   ====================== */
function initAmbientSounds() {
    // Note: In a real implementation, we would load actual audio files
    // For this demo, we'll simulate sound effects with visual feedback
    
    console.log('Ambient market sounds would play here...');
    
    // Create visual sound indicators (for demo purposes)
    setInterval(() => {
        // Occasionally show "sound wave" effect
        if (Math.random() > 0.8) {
            createSoundWave();
        }
    }, 8000);
}

function playMagicSound(soundType) {
    // Note: In a real implementation, we would play actual audio files
    // For this demo, we'll use visual feedback
    
    const soundEffects = {
        'hover': { color: 'rgba(64, 224, 208, 0.5)', size: 20 },
        'wish': { color: 'rgba(212, 175, 55, 0.7)', size: 40 },
        'rub': { color: 'rgba(255, 153, 51, 0.6)', size: 15 },
        'reveal': { color: 'rgba(255, 255, 255, 0.8)', size: 60 },
        'navigate': { color: 'rgba(153, 102, 204, 0.6)', size: 30 }
    };
    
    const effect = soundEffects[soundType] || soundEffects.hover;
    
    // Create visual sound effect at cursor position
    const cursorGlow = document.getElementById('cursorGlow');
    const x = parseInt(cursorGlow.style.left) || window.innerWidth / 2;
    const y = parseInt(cursorGlow.style.top) || window.innerHeight / 2;
    
    createSoundEffect(x, y, effect.color, effect.size);
}

function createSoundEffect(x, y, color, size) {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.width = `${size}px`;
    effect.style.height = `${size}px`;
    effect.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
    effect.style.borderRadius = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.opacity = '0.7';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '9997';
    effect.style.animation = 'soundPulse 0.5s ease-out forwards';
    
    document.body.appendChild(effect);
    
    // Add sound pulse animation
    const soundStyle = document.createElement('style');
    if (!document.querySelector('#soundPulseStyle')) {
        soundStyle.id = 'soundPulseStyle';
        soundStyle.textContent = `
            @keyframes soundPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
                100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
            }
        `;
        document.head.appendChild(soundStyle);
    }
    
    // Remove effect after animation
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 500);
}

function createSoundWave() {
    const wave = document.createElement('div');
    wave.style.position = 'fixed';
    wave.style.bottom = '20px';
    wave.style.right = '20px';
    wave.style.width = '30px';
    wave.style.height = '10px';
    wave.style.background = 'rgba(212, 175, 55, 0.3)';
    wave.style.borderRadius = '5px';
    wave.style.opacity = '0';
    wave.style.zIndex = '9996';
    
    document.body.appendChild(wave);
    
    // Animate wave
    wave.animate([
        { opacity: 0, transform: 'scaleX(0.1)' },
        { opacity: 0.7, transform: 'scaleX(1)' },
        { opacity: 0, transform: 'scaleX(0.1)' }
    ], {
        duration: 2000,
        iterations: 1
    });
    
    // Remove wave after animation
    setTimeout(() => {
        if (wave.parentNode) {
            wave.parentNode.removeChild(wave);
        }
    }, 2000);
}

/* ======================
   HELPER FUNCTIONS
   ====================== */
function createSparkleEffect(element) {
    // Create multiple sparkles around the element
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        const angle = (i / 5) * Math.PI * 2;
        const distance = 30;
        const x = rect.left + rect.width / 2 + Math.cos(angle) * distance;
        const y = rect.top + rect.height / 2 + Math.sin(angle) * distance;
        
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.width = '10px';
        sparkle.style.height = '10px';
        sparkle.style.background = `radial-gradient(circle, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba(255, 204, 0, 0.7) 50%, 
            transparent 100%)`;
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.transform = 'translate(-50%, -50%)';
        sparkle.style.animation = `sparkle 0.8s ease-out forwards`;
        
        document.body.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 800);
    }
}

/* ======================
   INITIALIZATION COMPLETE
   ====================== */
console.log('All magical scripts initialized. The Enchanted Bazaar is ready!');

// Export functions for potential module use
window.EnchantedBazaar = {
    initCursorGlow,
    initIncenseSmoke,
    initNavigation,
    initProductInteractions,
    initLampRubbing,
    initMagicCounters,
    setActiveSection,
    playMagicSound
};