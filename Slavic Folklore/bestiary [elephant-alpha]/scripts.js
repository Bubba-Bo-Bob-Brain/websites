// scripts.js

class SlavicBestiary {
    constructor() {
        this.cards = document.querySelectorAll('.creature-card');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.hearthGlows = document.querySelectorAll('.hearth-glow');
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupHoverEffects();
        this.setupDynamicGlow();
        this.setupRuneAnimations();
        this.setupCardEntranceAnimations();
        this.setupBackgroundEffects();
    }

    // Creature filtering system
    setupNavigation() {
        this.navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filterType = e.target.getAttribute('data-filter');
                
                // Update active button
                this.navButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filter cards with animation
                this.cards.forEach(card => {
                    const cardType = card.getAttribute('data-type');
                    const isMatch = filterType === 'all' || cardType === filterType;
                    
                    card.style.transition = 'all 0.5s ease';
                    if (!isMatch) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(50px) scale(0.8)';
                        card.style.pointerEvents = 'none';
                    } else {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'rotate(0deg)';
                            card.style.pointerEvents = 'auto';
                        }, 100);
                    }
                });
                
                // Reset cards after filter
                setTimeout(() => {
                    this.cards.forEach(card => {
                        if (card.style.opacity !== '0') {
                            card.style.transform = '';
                        }
                    });
                }, 600);
            });
        });
    }

    // Enhanced hover effects with parallax
    setupHoverEffects() {
        this.cards.forEach((card, index) => {
            card.addEventListener('mouseenter', (e) => {
                // Create ripple effect
                this.createRippleEffect(e, card);
                
                // Animate runes
                const runes = card.querySelectorAll('.rune-symbol');
                runes.forEach((rune, i) => {
                    rune.style.animation = `pulse 2s infinite ${i * 0.2}s`;
                });
            });
            
            card.addEventListener('mouseleave', (e) => {
                // Remove ripple effects
                const ripples = card.querySelectorAll('.ripple-effect');
                ripples.forEach(ripple => ripple.remove());
                
                // Reset runes
                const runes = card.querySelectorAll('.rune-symbol');
                runes.forEach(rune => {
                    rune.style.animation = '';
                });
            });
        });
    }

    // Create ripple effect on hover
    createRippleEffect(e, card) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple-effect');
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            width: 0;
            height: 0;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            animation: rippleExpand 1s ease-out forwards;
        `;
        
        card.style.position = 'relative';
        card.appendChild(ripple);
        
        // Add CSS for ripple animation
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes rippleExpand {
                    to {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Dynamic hearth fire glow
    setupDynamicGlow() {
        let glowIntensity = 0.15;
        
        setInterval(() => {
            // Simulate fire flicker
            glowIntensity = 0.1 + Math.random() * 0.1;
            
            this.hearthGlows.forEach(glow => {
                glow.style.opacity = glowIntensity;
            });
        }, 3000);
        
        // Mouse movement affects glow
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            this.hearthGlows.forEach((glow, index) => {
                const intensity = 0.1 + (x * 0.1 * (index === 0 ? 1 : -1));
                glow.style.opacity = Math.min(Math.max(intensity, 0.05), 0.25);
            });
        });
    }

    // Animated runes with mystical effects
    setupRuneAnimations() {
        const runes = document.querySelectorAll('.rune-symbol');
        
        runes.forEach((rune, index) => {
            // Random animation delays
            rune.style.animationDelay = `${Math.random() * 3}s`;
            rune.style.animationDuration = `${2 + Math.random() * 3}s`;
            
            // Add mystical floating effect
            rune.style.transition = 'transform 0.3s ease';
            rune.addEventListener('mouseenter', () => {
                rune.style.transform = 'scale(1.3) rotate(10deg)';
                rune.style.zIndex = '100';
            });
            
            rune.addEventListener('mouseleave', () => {
                rune.style.transform = 'scale(1) rotate(0deg)';
                rune.style.zIndex = '1';
            });
        });
    }

    // Entrance animations for cards
    setupCardEntranceAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `cardSlideIn 0.8s ease ${index * 0.1}s forwards`;
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            observer.observe(card);
        });
        
        // Add keyframes for entrance animation
        if (!document.querySelector('#entrance-styles')) {
            const style = document.createElement('style');
            style.id = 'entrance-styles';
            style.textContent = `
                @keyframes cardSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Background atmospheric effects
    setupBackgroundEffects() {
        // Create floating rune particles
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createFloatingRune();
            }
        }, 3000);
    }

    createFloatingRune() {
        const runes = ['ᛋ', 'ᛏ', 'ᛒ', 'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᛇ', 'ᛉ', 'ᛞ', 'ᚷ', 'ᛟ', 'ᚾ'];
        const rune = document.createElement('div');
        rune.textContent = runes[Math.floor(Math.random() * runes.length)];
        rune.style.cssText = `
            position: fixed;
            font-size: ${12 + Math.random() * 16}px;
            color: var(--rune-gold);
            opacity: 0.3;
            pointer-events: none;
            z-index: 9999;
            animation: floatUp ${3 + Math.random() * 4}s ease-out forwards;
            left: ${Math.random() * 100}vw;
            top: 100vh;
        `;
        
        // Add floating animation
        if (!document.querySelector('#float-styles')) {
            const style = document.createElement('style');
            style.id = 'float-styles';
            style.textContent = `
                @keyframes floatUp {
                    to {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(rune);
        
        // Remove after animation
        setTimeout(() => {
            rune.remove();
        }, 7000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SlavicBestiary();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            document.querySelector('[data-filter="all"]').click();
        } else if (e.key === '2') {
            document.querySelector('[data-filter="forest"]').click();
        } else if (e.key === '3') {
            document.querySelector('[data-filter="water"]').click();
        } else if (e.key === '4') {
            document.querySelector('[data-filter="dark"]').click();
        } else if (e.key === '5') {
            document.querySelector('[data-filter="household"]').click();
        }
    });
    
    // Add sound effect on card click (optional enhancement)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.creature-card')) {
            // Create subtle click sound through Web Audio API
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 200 + Math.random() * 100;
                gainNode.gain.value = 0.05;
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (e) {
                // Silent fail for audio
            }
        }
    });
});

// Add some additional interactive polish
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    const loadingScreen = document.createElement('div');
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--birch-light);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 1s ease;
    `;
    loadingScreen.innerHTML = '<h1 style="font-family: Georgia; font-size: 2rem; color: var(--leather-dark); letter-spacing: 0.3rem;">СЛОВО</h1>';
    
    document.body.appendChild(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.remove(), 1000);
    }, 1500);
});