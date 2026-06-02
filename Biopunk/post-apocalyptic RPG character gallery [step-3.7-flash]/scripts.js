// === BIOPUNK TERMINAL JAVASCRIPT ===
// Character Database System v2.077

class BioGenesisTerminal {
    constructor() {
        this.bootSequence = document.getElementById('bootSequence');
        this.terminalHeader = document.querySelector('.terminal-header');
        this.filterBar = document.querySelector('.filter-bar');
        this.hudFooter = document.querySelector('.hud-footer');
        this.characterCards = document.querySelectorAll('.character-card');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.bootLines = document.querySelectorAll('.boot-line');
        this.skillFills = document.querySelectorAll('.skill-fill');
        this.miniFills = document.querySelectorAll('.mini-fill');
        this.hudFills = document.querySelectorAll('.hud-fill');
        
        this.isBooted = false;
        this.init();
    }

    init() {
        this.startBootSequence();
        this.setupFilterSystem();
        this.setupScrollAnimations();
        this.setupGlitchEffects();
        this.setupInteractiveElements();
        this.setupCRTEffects();
    }

    // === BOOT SEQUENCE SYSTEM ===
    startBootSequence() {
        this.bootLines.forEach((line, index) => {
            const delay = parseInt(line.dataset.delay) || index * 400;
            setTimeout(() => {
                line.style.animation = `bootFadeIn 0.3s ease forwards`;
            }, delay);
        });

        // Hide boot sequence after completion
        setTimeout(() => {
            this.bootSequence.classList.add('hidden');
            this.isBooted = true;
            this.triggerEntranceAnimations();
        }, 3000);
    }

    triggerEntranceAnimations() {
        // Reveal header
        setTimeout(() => {
            this.terminalHeader.classList.add('visible');
        }, 200);

        // Reveal filter bar
        setTimeout(() => {
            this.filterBar.classList.add('visible');
        }, 400);

        // Animate skill bars and mini stats
        setTimeout(() => {
            this.animateSkillBars();
            this.animateMiniStats();
        }, 600);

        // Reveal footer
        setTimeout(() => {
            this.hudFooter.classList.add('visible');
            this.animateHUDMeters();
        }, 800);

        // Reveal character cards with stagger
        this.characterCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
                this.animateCardEntrance(card);
            }, 1000 + (index * 150));
        });
    }

    // === SKILL BAR ANIMATIONS ===
    animateSkillBars() {
        this.skillFills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0';
            
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 100);
        });
    }

    animateMiniStats() {
        this.miniFills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0';
            
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 300);
        });
    }

    animateHUDMeters() {
        this.hudFills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0';
            
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 500);
        });
    }

    // === CARD ENTRANCE ANIMATION ===
    animateCardEntrance(card) {
        const portrait = card.querySelector('.portrait-img');
        const mutationPulse = card.querySelector('.mutation-pulse');
        const bioHazardBadge = card.querySelector('.bio-hazard-badge');
        
        if (portrait) {
            portrait.style.opacity = '0';
            portrait.style.transform = 'scale(1.1)';
            setTimeout(() => {
                portrait.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                portrait.style.opacity = '1';
                portrait.style.transform = 'scale(1)';
            }, 100);
        }

        if (mutationPulse) {
            mutationPulse.style.opacity = '0';
            setTimeout(() => {
                mutationPulse.style.transition = 'opacity 0.5s ease';
                mutationPulse.style.opacity = '1';
            }, 400);
        }

        if (bioHazardBadge) {
            bioHazardBadge.style.transform = 'scale(0) rotate(-180deg)';
            setTimeout(() => {
                bioHazardBadge.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                bioHazardBadge.style.transform = 'scale(1) rotate(0deg)';
            }, 600);
        }
    }

    // === FILTER SYSTEM ===
    setupFilterSystem() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter characters
                const filter = button.dataset.filter;
                this.filterCharacters(filter);
            });
        });
    }

    filterCharacters(filter) {
        this.characterCards.forEach((card, index) => {
            const faction = card.dataset.faction;
            const shouldShow = filter === 'all' || faction === filter;
            
            if (shouldShow) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        });

        // Re-trigger skill animations for visible cards
        setTimeout(() => {
            this.animateSkillBars();
            this.animateMiniStats();
        }, 400);
    }

    // === SCROLL ANIMATIONS ===
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger skill bar animation when card enters viewport
                    const skillFills = entry.target.querySelectorAll('.skill-fill');
                    const miniFills = entry.target.querySelectorAll('.mini-fill');
                    
                    skillFills.forEach(fill => {
                        const targetWidth = fill.style.width;
                        fill.style.width = '0';
                        setTimeout(() => {
                            fill.style.width = targetWidth;
                        }, 200);
                    });

                    miniFills.forEach(fill => {
                        const targetWidth = fill.style.width;
                        fill.style.width = '0';
                        setTimeout(() => {
                            fill.style.width = targetWidth;
                        }, 400);
                    });
                }
            });
        }, observerOptions);

        this.characterCards.forEach(card => {
            observer.observe(card);
        });
    }

    // === GLITCH EFFECTS ===
    setupGlitchEffects() {
        const glitchTexts = document.querySelectorAll('.glitch-text');
        
        glitchTexts.forEach(text => {
            // Random glitch intensity
            setInterval(() => {
                if (Math.random() > 0.95) {
                    text.style.animation = 'none';
                    text.offsetHeight; // Trigger reflow
                    text.style.animation = null;
                    
                    // Add temporary glitch class
                    text.classList.add('glitch-active');
                    setTimeout(() => {
                        text.classList.remove('glitch-active');
                    }, 200);
                }
            }, 100);
        });

        // Random screen glitch
        setInterval(() => {
            if (Math.random() > 0.9 && this.isBooted) {
                this.triggerScreenGlitch();
            }
        }, 5000);
    }

    triggerScreenGlitch() {
        const overlay = document.querySelector('.crt-overlay');
        overlay.style.background = 'rgba(255, 0, 255, 0.1)';
        overlay.style.boxShadow = 'inset 0 0 150px rgba(255, 0, 255, 0.3)';
        
        setTimeout(() => {
            overlay.style.background = 'var(--crt-vignette)';
            overlay.style.boxShadow = 'inset 0 0 150px rgba(0, 0, 0, 0.9)';
        }, 100);

        setTimeout(() => {
            overlay.style.background = 'rgba(0, 255, 255, 0.05)';
            overlay.style.boxShadow = 'inset 0 0 150px rgba(0, 255, 255, 0.2)';
        }, 150);

        setTimeout(() => {
            overlay.style.background = 'var(--crt-vignette)';
            overlay.style.boxShadow = 'inset 0 0 150px rgba(0, 0, 0, 0.9)';
        }, 200);
    }

    // === INTERACTIVE ELEMENTS ===
    setupInteractiveElements() {
        // Card hover effects
        this.characterCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.playHoverSound();
                this.enhanceCardGlow(card);
            });

            card.addEventListener('mouseleave', () => {
                this.resetCardGlow(card);
            });

            // Click effect
            card.addEventListener('click', () => {
                this.triggerCardSelect(card);
            });
        });

        // Filter button hover sounds
        this.filterButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });

        // Bio-hazard badge interaction
        const badges = document.querySelectorAll('.bio-hazard-badge');
        badges.forEach(badge => {
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                this.triggerBioHazardAlert(badge);
            });
        });
    }

    enhanceCardGlow(card) {
        const inner = card.querySelector('.card-inner');
        const faction = card.dataset.faction;
        
        let glowColor;
        switch(faction) {
            case 'raider': glowColor = 'rgba(255, 51, 51, 0.4)'; break;
            case 'vials': glowColor = 'rgba(0, 255, 136, 0.4)'; break;
            case 'scrap': glowColor = 'rgba(255, 136, 0, 0.4)'; break;
            case 'neon': glowColor = 'rgba(255, 0, 255, 0.4)'; break;
            default: glowColor = 'rgba(0, 255, 136, 0.4)';
        }
        
        inner.style.boxShadow = `0 0 30px ${glowColor}, inset 0 0 20px ${glowColor}`;
        inner.style.borderColor = glowColor;
    }

    resetCardGlow(card) {
        const inner = card.querySelector('.card-inner');
        inner.style.boxShadow = '';
        inner.style.borderColor = '';
    }

    triggerCardSelect(card) {
        const charName = card.querySelector('.char-name').textContent;
        const faction = card.dataset.faction;
        
        // Flash effect
        const inner = card.querySelector('.card-inner');
        inner.style.transform = 'scale(0.98)';
        setTimeout(() => {
            inner.style.transform = '';
        }, 100);

        // Log to console (simulating terminal access)
        console.log(`%c[ACCESS GRANTED] %c${charName} %c// ${faction.toUpperCase()}`, 
            'color: #00ff88; font-weight: bold;',
            'color: #ffffff;',
            'color: #888899;'
        );

        // Trigger mutation scan effect
        this.triggerMutationScan(card);
    }

    triggerMutationScan(card) {
        const portrait = card.querySelector('.portrait-wrapper');
        const mutation = parseInt(card.dataset.mutation);
        
        // Create scan line effect
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ff88, transparent);
            box-shadow: 0 0 10px #00ff88;
            animation: scanMove 1s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        portrait.appendChild(scanLine);
        
        // Add scan animation dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scanMove {
                0% { top: 0; opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            scanLine.remove();
            style.remove();
        }, 1000);
    }

    triggerBioHazardAlert(badge) {
        // Create alert effect
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 200px;
            height: 200px;
            border: 3px solid #ff3333;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Press Start 2P', cursive;
            color: #ff3333;
            font-size: 0.8rem;
            text-align: center;
            z-index: 10001;
            animation: alertPulse 0.5s ease-out forwards;
            pointer-events: none;
            text-shadow: 0 0 10px #ff3333;
            box-shadow: 0 0 30px rgba(255, 51, 51, 0.5);
        `;
        alert.textContent = 'BIO-HAZARD\nDETECTED';
        document.body.appendChild(alert);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes alertPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            alert.remove();
            style.remove();
        }, 1500);
    }

    // === CRT EFFECTS ===
    setupCRTEffects() {
        // Random flicker
        setInterval(() => {
            if (Math.random() > 0.98 && this.isBooted) {
                const screenFlicker = document.querySelector('.screen-flicker');
                screenFlicker.style.opacity = '0.95';
                setTimeout(() => {
                    screenFlicker.style.opacity = '0.98';
                }, 50);
            }
        }, 2000);

        // Chromatic aberration on hover
        this.characterCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const portrait = card.querySelector('.portrait-img');
                portrait.style.filter = 'grayscale(0%) contrast(120%) drop-shadow(0 0 5px rgba(0, 255, 136, 0.3))';
            });

            card.addEventListener('mouseleave', () => {
                const portrait = card.querySelector('.portrait-img');
                portrait.style.filter = 'grayscale(30%) contrast(110%)';
            });
        });
    }

    // === AUDIO SIMULATION ===
    playHoverSound() {
        // Create audio context for hover sounds
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // === UTILITY FUNCTIONS ===
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize terminal system
    const terminal = new BioGenesisTerminal();
    
    // Expose to window for debugging
    window.bioTerminal = terminal;
    
    // Log startup message
    console.log('%c[SYSTEM] %cBioGenesis Terminal v2.077 initialized', 
        'color: #00ff88; font-weight: bold;',
        'color: #888899;'
    );
    console.log('%c[INFO] %cAccess Level: CLEARANCE_5 // Sector-7G', 
        'color: #00ff88;',
        'color: #888899;'
    );
});

// === GLOBAL EVENT LISTENERS ===
// Handle window resize
window.addEventListener('resize', BioGenesisTerminal.prototype.debounce(() => {
    // Recalculate layouts if needed
}, 250));

// Handle visibility change (pause animations when tab is hidden)
document.addEventListener('visibilitychange', () => {
    const screenFlicker = document.querySelector('.screen-flicker');
    if (document.hidden) {
        screenFlicker.style.animationPlayState = 'paused';
    } else {
        screenFlicker.style.animationPlayState = 'running';
    }
});

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', (e) => {
    // Press 'F' to toggle filter focus
    if (e.key === 'f' || e.key === 'F') {
        const filterBar = document.querySelector('.filter-bar');
        filterBar.style.opacity = filterBar.style.opacity === '0.5' ? '1' : '0.5';
    }
    
    // Press 'R' to reset all filters
    if (e.key === 'r' || e.key === 'R') {
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) allButton.click();
    }
    
    // Press 'G' to trigger global glitch
    if (e.key === 'g' || e.key === 'G') {
        const terminal = window.bioTerminal;
        if (terminal) terminal.triggerScreenGlitch();
    }
});

// === PERFORMANCE OPTIMIZATION ===
// Lazy load images when they come into view
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// === SERVICE WORKER REGISTRATION (for offline capability) ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // In production, register service worker here
        // navigator.serviceWorker.register('/sw.js');
    });
}