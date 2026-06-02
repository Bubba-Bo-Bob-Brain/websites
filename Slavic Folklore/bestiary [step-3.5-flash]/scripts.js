/* ============================================
   Slavic Bestiary - Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initParticles();
    initScrollAnimations();
    initParallax();
    initNavigation();
    initDangerRatings();
    initSoundToggle();
    initInteractiveIllustrations();
    initPageEffects();
});

/* --- Particle System (Embers/Ash) --- */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;
    const colors = ['#d4a017', '#ff6b35', '#ff8c00', '#ffd700'];

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, colors);
    }

    // Continuously create new particles
    setInterval(() => {
        if (container.children.length < particleCount * 1.5) {
            createParticle(container, colors);
        }
    }, 2000);
}

function createParticle(container, colors) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random color from palette
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

    // Random starting position
    particle.style.left = `${Math.random() * 100}%`;

    // Random animation duration and delay
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * 4;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    // Random horizontal drift
    const drift = (Math.random() - 0.5) * 200;
    particle.style.setProperty('--drift', `${drift}px`);

    container.appendChild(particle);

    // Remove particle after animation completes
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, (duration + delay) * 1000);
}

/* --- Scroll-Triggered Animations --- */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all creature pages
    document.querySelectorAll('.creature-page').forEach(page => {
        observer.observe(page);
    });

    // Also observe title and closing pages
    document.querySelectorAll('.title-page, .intro-page, .closing-page').forEach(page => {
        observer.observe(page);
    });
}

/* --- Parallax Effect for Forest Overlay --- */
function initParallax() {
    const forestOverlay = document.querySelector('.forest-overlay');
    if (!forestOverlay) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                forestOverlay.style.transform = `translateY(${rate}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* --- Navigation Smooth Scroll --- */
function initNavigation() {
    const creatureLinks = document.querySelectorAll('.creature-link');
    const bookContainer = document.querySelector('.book-container');

    creatureLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Close mobile menu if open (if we had one)
                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active state
                creatureLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('.creature-page[id]');
    const navLinks = document.querySelectorAll('.creature-link');

    window.addEventListener('scroll', throttle(() => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-creature') === current) {
                link.classList.add('active');
            }
        });
    }, 100));
}

/* --- Danger Rating Interactivity --- */
function initDangerRatings() {
    const dangerRatings = document.querySelectorAll('.danger-rating');

    dangerRatings.forEach(rating => {
        const symbols = rating.querySelectorAll('.danger-symbol');
        const level = symbols.filter(s => s.classList.contains('active')).length;

        // Add tooltip on hover
        rating.setAttribute('title', `Danger Level: ${level}/5`);
        
        // Click to toggle detailed explanation
        rating.addEventListener('click', () => {
            const infoBox = rating.closest('.creature-header').nextElementSibling;
            if (infoBox && infoBox.classList.contains('creature-info')) {
                // Toggle highlight on danger section
                const dangerSection = infoBox.querySelector('h3:first-of-type');
                if (dangerSection) {
                    dangerSection.style.color = dangerSection.style.color === 'var(--blood-red)' ? 
                        'var(--bark-dark)' : 'var(--blood-red)';
                    
                    // Scroll to danger section if it's the first click
                    if (dangerSection.style.color === 'var(--blood-red)') {
                        setTimeout(() => {
                            dangerSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }, 100);
                    }
                }
            }
        });

        // Add cursor pointer
        rating.style.cursor = 'pointer';
    });
}

/* --- Sound Toggle (Ambient Forest Sounds) --- */
function initSoundToggle() {
    const soundBtn = document.getElementById('sound-toggle');
    if (!soundBtn) return;

    let ambientSound = null;
    let isPlaying = false;

    // Create audio context on first user interaction
    soundBtn.addEventListener('click', () => {
        if (!ambientSound) {
            // Create a simple ambient sound using Web Audio API
            createAmbientSound();
        }

        if (isPlaying) {
            ambientSound.pause();
            soundBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
                </svg>
            `;
            soundBtn.title = 'Enable ambient sounds';
        } else {
            ambientSound.play();
            soundBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>
                </svg>
            `;
            soundBtn.title = 'Disable ambient sounds';
        }
        isPlaying = !isPlaying;
    });

    function createAmbientSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            // Create multiple oscillators for forest-like ambient sound
            const oscillators = [];
            const gainNodes = [];
            
            // Low rumble (distant wind)
            const windOsc = ctx.createOscillator();
            const windGain = ctx.createGain();
            windOsc.type = 'sawtooth';
            windOsc.frequency.setValueAtTime(40, ctx.currentTime);
            windOsc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 10);
            windGain.gain.setValueAtTime(0.02, ctx.currentTime);
            windOsc.connect(windGain);
            windGain.connect(ctx.destination);
            windOsc.start();
            oscillators.push(windOsc);
            gainNodes.push(windGain);

            // Crickets (high frequency modulation)
            const cricketOsc = ctx.createOscillator();
            const cricketGain = ctx.createGain();
            cricketOsc.type = 'square';
            cricketOsc.frequency.setValueAtTime(3000, ctx.currentTime);
            cricketOsc.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + 0.5);
            cricketOsc.frequency.exponentialRampToValueAtTime(2500, ctx.currentTime + 1);
            cricketGain.gain.setValueAtTime(0, ctx.currentTime);
            cricketGain.gain.setValueAtTime(0.015, ctx.currentTime + 0.2);
            cricketGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
            
            // Repeat cricket pattern
            setInterval(() => {
                if (isPlaying) {
                    const now = ctx.currentTime;
                    cricketGain.gain.setValueAtTime(0, now);
                    cricketGain.gain.setValueAtTime(0.015, now + 0.1);
                    cricketGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
                }
            }, 2000);
            
            cricketOsc.connect(cricketGain);
            cricketGain.connect(ctx.destination);
            cricketOsc.start();
            oscillators.push(cricketOsc);
            gainNodes.push(cricketGain);

            // Night bird (occasional)
            setInterval(() => {
                if (isPlaying && Math.random() > 0.7) {
                    const birdOsc = ctx.createOscillator();
                    const birdGain = ctx.createGain();
                    birdOsc.type = 'sine';
                    birdOsc.frequency.setValueAtTime(800, ctx.currentTime);
                    birdOsc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
                    birdOsc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.6);
                    birdGain.gain.setValueAtTime(0.01, ctx.currentTime);
                    birdGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
                    
                    birdOsc.connect(birdGain);
                    birdGain.connect(ctx.destination);
                    birdOsc.start();
                    birdOsc.stop(ctx.currentTime + 0.8);
                }
            }, 3000);

            // Store reference
            ambientSound = {
                context: ctx,
                oscillators,
                gainNodes,
                play: () => {
                    gainNodes.forEach(gain => {
                        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
                    });
                },
                pause: () => {
                    gainNodes.forEach(gain => {
                        gain.gain.setValueAtTime(0, ctx.currentTime + 0.1);
                    });
                }
            };
        } catch (e) {
            console.warn('Web Audio API not supported or blocked');
            soundBtn.style.display = 'none';
        }
    }
}

/* --- Interactive Illustrations --- */
function initInteractiveIllustrations() {
    const illustrations = document.querySelectorAll('.creature-illustration');

    illustrations.forEach(illustration => {
        // Add subtle animation on hover
        illustration.addEventListener('mouseenter', () => {
            illustration.style.filter = `
                contrast(1.15) 
                brightness(0.98) 
                sepia(0.1)
                drop-shadow(0 0 10px rgba(212, 160, 23, 0.3))
            `;
        });

        illustration.addEventListener('mouseleave', () => {
            illustration.style.filter = '';
        });

        // Click to toggle "magnified" view
        illustration.addEventListener('click', (e) => {
            e.preventDefault();
            const frame = illustration.closest('.woodcut-frame');
            const caption = frame.querySelector('.illustration-caption');
            
            if (frame.classList.contains('magnified')) {
                frame.classList.remove('magnified');
                caption.style.opacity = '1';
                caption.style.transform = 'translateY(0)';
            } else {
                // Close any other magnified frames
                document.querySelectorAll('.woodcut-frame.magnified').forEach(f => {
                    f.classList.remove('magnified');
                    const c = f.querySelector('.illustration-caption');
                    if (c) {
                        c.style.opacity = '1';
                        c.style.transform = 'translateY(0)';
                    }
                });

                frame.classList.add('magnified');
                caption.style.opacity = '0';
                caption.style.transform = 'translateY(10px)';
            }
        });

        // Add subtle random movement (like the illustration is "alive")
        animateIllustration(illustration);
    });

    // Add CSS for magnified state
    const style = document.createElement('style');
    style.textContent = `
        .woodcut-frame.magnified {
            position: fixed;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(1.5) !important;
            z-index: 10000;
            max-width: 90vw;
            max-height: 90vh;
            box-shadow: 0 0 100px rgba(0, 0, 0, 0.9) !important;
            cursor: zoom-out;
            animation: magnify-pop 0.3s ease-out;
        }

        @keyframes magnify-pop {
            0% { transform: translate(-50%, -50%) scale(0.8); }
            100% { transform: translate(-50%, -50%) scale(1.5); }
        }

        .woodcut-frame.magnified .illustration-caption {
            position: absolute;
            bottom: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bark-dark);
            color: var(--paper-base);
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.8rem;
            white-space: nowrap;
        }

        @media (max-width: 768px) {
            .woodcut-frame.magnified {
                transform: translate(-50%, -50%) scale(1.2) !important;
                max-width: 95vw;
                max-height: 80vh;
            }
        }
    `;
    document.head.appendChild(style);
}

function animateIllustration(illustration) {
    // Very subtle random movement (like breathing/living)
    let angle = 0;
    const amplitude = 0.2; // degrees
    
    function animate() {
        angle += 0.02;
        const rotation = Math.sin(angle) * amplitude;
        
        // Only apply if not being hovered or magnified
        if (!illustration.matches(':hover') && 
            !illustration.closest('.woodcut-frame').classList.contains('magnified')) {
            illustration.style.transform = `rotate(${rotation}deg)`;
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation after a delay to avoid initial load jitter
    setTimeout(() => {
        animate();
    }, 1000 + Math.random() * 2000);
}

/* --- Page Effects --- */
function initPageEffects() {
    // Add random "ink spots" to pages occasionally
    const pages = document.querySelectorAll('.page-inner');
    
    pages.forEach(page => {
        // Add occasional ink blot
        if (Math.random() > 0.7) {
            const blot = document.createElement('div');
            blot.className = 'ink-blot';
            blot.style.cssText = `
                position: absolute;
                width: ${20 + Math.random() * 40}px;
                height: ${20 + Math.random() * 40}px;
                background: radial-gradient(circle, rgba(10, 10, 10, 0.05) 0%, transparent 70%);
                border-radius: 50%;
                top: ${Math.random() * 80}%;
                left: ${Math.random() * 80}%;
                pointer-events: none;
                filter: blur(2px);
            `;
            page.style.position = 'relative';
            page.appendChild(blot);
        }
    });

    // Add subtle page curl effect on hover for desktop
    if (window.innerWidth > 1024) {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                section.style.transform = 'perspective(1000px) rotateY(-1deg)';
                section.style.transition = 'transform 0.3s ease';
            });
            
            section.addEventListener('mouseleave', () => {
                section.style.transform = '';
            });
        });
    }

    // Fire glow intensity based on scroll position
    const fireGlow = document.querySelector('.fire-glow');
    if (fireGlow) {
        window.addEventListener('scroll', throttle(() => {
            const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
            const intensity = 0.5 + (scrollPercent * 0.5); // 0.5 to 1.0
            fireGlow.style.opacity = intensity.toFixed(2);
        }, 100));
    }
}

/* --- Utility Functions --- */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* --- Reveal Animation for Creature Content --- */
function revealCreatureContent() {
    const creaturePages = document.querySelectorAll('.creature-page');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const page = entry.target;
                const header = page.querySelector('.creature-header');
                const grid = page.querySelector('.creature-grid');
                
                if (header) {
                    header.style.opacity = '0';
                    header.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        header.style.transition = 'all 0.6s ease-out';
                        header.style.opacity = '1';
                        header.style.transform = 'translateY(0)';
                    }, 100);
                }
                
                if (grid) {
                    const columns = grid.children;
                    Array.from(columns).forEach((col, index) => {
                        col.style.opacity = '0';
                        col.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            col.style.transition = 'all 0.8s ease-out';
                            col.style.opacity = '1';
                            col.style.transform = 'translateY(0)';
                        }, 300 + (index * 200));
                    });
                }
            }
        });
    }, { threshold: 0.2 });

    creaturePages.forEach(page => observer.observe(page));
}

/* --- Initialize Reveal Animation --- */
setTimeout(revealCreatureContent, 500);

/* --- Easter Egg: Konami Code --- */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Transform the entire page into "ancient manuscript" mode
    document.body.classList.toggle('ancient-mode');
    
    // Create a flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #f4e8d0;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
    `;
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.style.opacity = '0.8';
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                if (flash.parentNode) {
                    flash.parentNode.removeChild(flash);
                }
            }, 500);
        }, 100);
    }, 10);

    // Toggle additional styles
    const style = document.createElement('style');
    style.id = 'ancient-mode-styles';
    if (document.getElementById('ancient-mode-styles')) {
        document.getElementById('ancient-mode-styles').remove();
        document.body.classList.remove('ancient-mode');
    } else {
        style.textContent = `
            body.ancient-mode {
                filter: sepia(0.3) contrast(1.1) brightness(0.9);
            }
            body.ancient-mode .creature-illustration {
                filter: contrast(1.3) brightness(0.9) sepia(0.2) !important;
            }
            body.ancient-mode .woodcut-frame {
                border-color: #5a3d22;
                box-shadow: 0 20px 60px rgba(0,0,0,0.6) !important;
            }
            body.ancient-mode .danger-symbol.active {
                animation: danger-pulse 0.5s ease-in-out infinite !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/* --- Print Trigger (Optional) --- */
window.addEventListener('beforeprint', () => {
    // Ensure all animations are complete before printing
    document.querySelectorAll('.creature-page').forEach(page => {
        page.classList.add('visible');
    });
});

/* --- Performance: Defer non-critical animations --- */
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Initialize less critical animations after main content loads
        initHoverEffects();
    });
} else {
    setTimeout(initHoverEffects, 1000);
}

function initHoverEffects() {
    // Add magnetic effect to navigation links
    const navLinks = document.querySelectorAll('.creature-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            link.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });

    // Add hover sound effect (optional, disabled by default)
    // Could be enabled with a settings panel
}

/* --- Accessibility: Reduce Motion --- */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
    
    // Disable all animations
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

/* --- Debug: Development Tools --- */
// Uncomment for debugging:
// window.bestiaryDebug = {
//     logCreature: (id) => console.log(`Viewing creature: ${id}`),
//     toggleEffects: () => document.body.classList.toggle('effects-disabled'),
//     resetAnimations: () => location.reload()
// };

console.log('%c Slavic Bestiary Loaded ', 'background: #1a2f1a; color: #f4e8d0; font-size: 14px; padding: 4px; border-radius: 4px;');
console.log('Tip: Try the Konami Code (↑↑↓↓←→←→BA) for a surprise!');