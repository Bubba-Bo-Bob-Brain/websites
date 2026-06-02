// ============================================
// PROLETARIAN SPACE BROADCAST
// Soviet Retrofuturist Propaganda News System
// Interactive Scripts Module v2.87
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initStellarTime();
    initBroadcastEffects();
    initScrollAnimations();
    initProgressBar();
    initWorkerSpotlight();
    initBroadcastInterruption();
    initTickerVariation();
});

// --- Soviet Standard Stellar Time ---
function initStellarTime() {
    const timeElement = document.getElementById('current-time');
    if (!timeElement) return;

    const updateTime = () => {
        const now = new Date();
        // Simulate "Stellar Time" - slightly offset from Earth time for immersion
        const stellarOffset = 42; // Minutes ahead (arbitrary Soviet timezone)
        const stellarDate = new Date(now.getTime() + (stellarOffset * 60 * 1000));
        
        const hours = String(stellarDate.getHours()).padStart(2, '0');
        const minutes = String(stellarDate.getMinutes()).padStart(2, '0');
        const seconds = String(stellarDate.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}:${seconds} ST`;
    };

    updateTime();
    setInterval(updateTime, 1000);
}

// --- CRT Broadcast Screen Effects ---
function initBroadcastEffects() {
    const crtScreen = document.querySelector('.crt-screen');
    const staticNoise = document.querySelector('.static-noise');
    const dispatchContent = document.querySelector('.dispatch-content');
    
    if (!crtScreen || !staticNoise) return;

    // Random static intensity variation
    const varyStatic = () => {
        const intensity = 0.03 + Math.random() * 0.08;
        staticNoise.style.opacity = intensity;
    };

    const staticInterval = setInterval(varyStatic, 200);
    
    // Occasional screen flicker
    const triggerFlicker = () => {
        crtScreen.style.opacity = '0.8';
        setTimeout(() => {
            crtScreen.style.opacity = '1';
        }, 50);
        
        // Schedule next flicker randomly between 5-15 seconds
        setTimeout(triggerFlicker, 5000 + Math.random() * 10000);
    };
    
    setTimeout(triggerFlicker, 3000);

    // Mouse movement parallax on dispatch image
    const dispatchImage = document.querySelector('.dispatch-image');
    if (dispatchImage && dispatchContent) {
        dispatchContent.addEventListener('mousemove', (e) => {
            const rect = dispatchContent.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            dispatchImage.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.02)`;
        });

        dispatchContent.addEventListener('mouseleave', () => {
            dispatchImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
        });
    }

    // Badge hover sound simulation (visual feedback)
    const badge = document.querySelector('.dispatch-badge');
    if (badge) {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'rotate(-2deg) scale(1.05)';
            badge.style.boxShadow = '0 0 40px rgba(196, 30, 58, 0.9)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'rotate(-2deg) scale(1)';
            badge.style.boxShadow = '';
        });
    }
}

// --- Scroll-Triggered Animations ---
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animation for grid items
                if (entry.target.classList.contains('dispatch-card')) {
                    const cards = document.querySelectorAll('.dispatch-card');
                    cards.forEach((card, index) => {
                        card.style.animationDelay = `${index * 0.15}s`;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe dispatch cards
    document.querySelectorAll('.dispatch-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });

    // Observe sidebar elements
    document.querySelectorAll('.plan-progress, .worker-spotlight').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(30px)';
        observer.observe(el);
    });

    // Observe section titles
    document.querySelectorAll('.section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-50%) translateY(20px)';
        observer.observe(el);
    });
}

// --- 5-Year Plan Progress Bar Animation ---
function initProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    if (!progressFill) return;

    const targetProgress = progressFill.dataset.progress || 78;
    
    // Delay start for dramatic effect
    setTimeout(() => {
        progressFill.style.width = `${targetProgress}%`;
        
        // Add celebration effect when reaching target
        setTimeout(() => {
            progressFill.style.boxShadow = 'inset 0 0 20px rgba(255, 255, 255, 0.4), 0 0 30px rgba(196, 30, 58, 0.8)';
            
            setTimeout(() => {
                progressFill.style.boxShadow = 'inset 0 0 10px rgba(255, 255, 255, 0.2)';
            }, 1000);
        }, 2000);
    }, 500);
}

// --- Worker Spotlight Stats Counter ---
function initWorkerSpotlight() {
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length === 0) return;

    const animateCounter = (element, target) => {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(update);
    };

    // Observe spotlight section
    const spotlight = document.querySelector('.worker-spotlight');
    if (!spotlight) return;

    const spotlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    if (!isNaN(target)) {
                        animateCounter(stat, target);
                    }
                });
                spotlightObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    spotlightObserver.observe(spotlight);
}

// --- Periodic Broadcast Interruption ---
function initBroadcastInterruption() {
    const createInterruption = () => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(196, 30, 58, 0.95);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            animation: interrupt-flash 0.5s ease-out;
            pointer-events: none;
        `;
        
        const message = document.createElement('div');
        message.style.cssText = `
            font-family: 'Russo One', sans-serif;
            font-size: clamp(2rem, 5vw, 4rem);
            color: #D4AF37;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            text-align: center;
            text-shadow: 0 0 20px rgba(212, 175, 55, 0.8);
            animation: interrupt-text 0.3s ease-out 0.2s both;
        `;
        message.textContent = 'IMPORTANT STATE BROADCAST';
        
        const subtext = document.createElement('div');
        subtext.style.cssText = `
            font-family: 'Oranienbaum', serif;
            font-size: 1.2rem;
            color: #F5F5F5;
            margin-top: 1rem;
            letter-spacing: 0.1em;
            animation: interrupt-text 0.3s ease-out 0.4s both;
        `;
        subtext.textContent = 'The Ministry of Truth reminds you: Productivity is Patriotism';
        
        overlay.appendChild(message);
        overlay.appendChild(subtext);
        document.body.appendChild(overlay);
        
        // Add dynamic styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes interrupt-flash {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }
            @keyframes interrupt-text {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Remove after animation
        setTimeout(() => {
            overlay.remove();
            style.remove();
        }, 3000);
    };

    // Trigger interruption randomly every 30-60 seconds
    const scheduleInterruption = () => {
        const delay = 30000 + Math.random() * 30000;
        setTimeout(() => {
            createInterruption();
            scheduleInterruption();
        }, delay);
    };

    // Start after initial page load
    setTimeout(scheduleInterruption, 10000);
}

// --- Ticker Speed Variation ---
function initTickerVariation() {
    const ticker = document.querySelector('.ticker__content');
    if (!ticker) return;

    // Occasionally speed up or slow down the ticker
    const varySpeed = () => {
        const baseDuration = 40;
        const variation = 10;
        const newDuration = baseDuration + (Math.random() * variation * 2 - variation);
        ticker.style.animationDuration = `${newDuration}s`;
    };

    setInterval(varySpeed, 15000);
}

// --- Console Easter Egg ---
console.log(
    '%c☭ PROLETARIAN SPACE BROADCAST ☭',
    'color: #D4AF37; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);'
);
console.log(
    '%cWorkers of the World, Unite in the Cosmos!',
    'color: #C41E3A; font-size: 14px; font-style: italic;'
);
console.log(
    '%cAll broadcasts are monitored by the Ministry of Truth.',
    'color: #888; font-size: 10px;'
);

// --- Performance Optimization: Debounce scroll events ---
function debounce(func, wait) {
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

// --- Keyboard Navigation Enhancement ---
document.addEventListener('keydown', (e) => {
    // Press 'S' to simulate static burst
    if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
        const staticNoise = document.querySelector('.static-noise');
        if (staticNoise) {
            staticNoise.style.opacity = '0.3';
            setTimeout(() => {
                staticNoise.style.opacity = '0.05';
            }, 300);
        }
    }
});

// --- Service Worker Registration for Offline "Broadcast" Capability ---
if ('serviceWorker' in navigator) {
    // In a real implementation, this would cache assets for offline viewing
    // For now, we log the capability
    console.log('%c☭ Broadcast System Ready for Offline Operation ☭', 'color: #D4AF37;');
}