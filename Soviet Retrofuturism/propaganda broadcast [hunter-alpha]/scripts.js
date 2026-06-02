/* ============================================
   ПРАВДА ВЕЩАНИЕ — PRAVDA BROADCASTING
   Soviet Retrofuturist Propaganda System
   Interactive Broadcast Controller
   ============================================ */

(function() {
    'use strict';

    // === CONFIGURATION ===
    const CONFIG = {
        timezone: 'Europe/Moscow',
        transmissionBase: 847,
        updateInterval: 1000,
        glitchInterval: 8000,
        glitchDuration: 150,
        staticBurstInterval: 15000,
        staticBurstDuration: 300,
        progressAnimationDelay: 1500
    };

    // === SOVIET DATE FORMATTING ===
    const SOVIET_MONTHS = [
        'ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ',
        'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'
    ];

    const SOVIET_MONTHS_GENITIVE = [
        'ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ',
        'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'
    ];

    // === STATE ===
    let state = {
        transmissionNum: CONFIG.transmissionBase,
        glitchActive: false,
        initialized: false
    };

    // === UTILITY FUNCTIONS ===
    function getMoscowTime() {
        const now = new Date();
        const options = { 
            timeZone: CONFIG.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return now.toLocaleTimeString('en-GB', options);
    }

    function getSovietDate() {
        const now = new Date();
        const moscowDate = new Date(now.toLocaleString('en-US', { timeZone: CONFIG.timezone }));
        const day = moscowDate.getDate();
        const month = SOVIET_MONTHS_GENITIVE[moscowDate.getMonth()];
        const year = moscowDate.getFullYear() + 63; // Soviet future year
        return `${day} ${month} ${year}`;
    }

    function formatTime(timeStr) {
        return timeStr.slice(0, 5) + ' MSK';
    }

    // === BROADCAST TIME UPDATE ===
    function updateBroadcastTime() {
        const timeElement = document.getElementById('broadcastTime');
        if (timeElement) {
            const time = getMoscowTime();
            timeElement.textContent = formatTime(time);
            
            // Subtle flicker effect on seconds change
            if (time.endsWith('0') || time.endsWith('5')) {
                timeElement.style.opacity = '0.7';
                setTimeout(() => {
                    timeElement.style.opacity = '1';
                }, 50);
            }
        }
    }

    // === BROADCAST DATE UPDATE ===
    function updateBroadcastDate() {
        const dateElement = document.getElementById('broadcastDate');
        if (dateElement) {
            dateElement.textContent = getSovietDate();
        }
    }

    // === TRANSMISSION NUMBER ===
    function incrementTransmission() {
        state.transmissionNum++;
        const numElement = document.getElementById('transmissionNum');
        if (numElement) {
            // Pad with zeros
            const paddedNum = String(state.transmissionNum).padStart(4, '0');
            numElement.textContent = paddedNum;
            
            // Flash effect
            numElement.style.color = '#FFD700';
            numElement.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
            setTimeout(() => {
                numElement.style.color = '';
                numElement.style.textShadow = '';
            }, 300);
        }
    }

    // === FIVE-YEAR PLAN PROGRESS ANIMATION ===
    function animateProgressBars() {
        const progressFills = document.querySelectorAll('.plan-fill');
        
        progressFills.forEach((fill, index) => {
            const target = parseInt(fill.dataset.target) || 100;
            
            setTimeout(() => {
                fill.style.width = target + '%';
                
                // Add completion effect
                if (target >= 100) {
                    setTimeout(() => {
                        fill.style.boxShadow = '0 0 10px var(--gold-primary)';
                    }, 2000);
                }
            }, index * 200);
        });
    }

    // === GLITCH EFFECT ===
    function triggerGlitch() {
        if (state.glitchActive) return;
        state.glitchActive = true;

        const body = document.body;
        const scanlines = document.querySelector('.scanlines');
        const broadcastFrame = document.querySelector('.broadcast-frame');
        
        // Random glitch parameters
        const glitchType = Math.random();
        
        if (glitchType < 0.3) {
            // Horizontal shift glitch
            body.style.transform = `translateX(${(Math.random() - 0.5) * 10}px)`;
            setTimeout(() => {
                body.style.transform = `translateX(${(Math.random() - 0.5) * -15}px)`;
            }, 50);
        } else if (glitchType < 0.6) {
            // Color channel glitch
            if (scanlines) {
                scanlines.style.background = `
                    repeating-linear-gradient(
                        0deg,
                        rgba(255, 0, 0, 0.2) 0px,
                        rgba(0, 255, 0, 0.1) 1px,
                        transparent 2px,
                        transparent 3px
                    )
                `;
            }
            body.style.filter = 'hue-rotate(10deg) saturate(1.5)';
        } else {
            // Static burst
            const noise = document.querySelector('.static-noise');
            if (noise) {
                noise.style.opacity = '0.15';
                noise.style.animation = 'static-shift 0.05s steps(5) infinite';
            }
        }

        // Reset after glitch duration
        setTimeout(() => {
            body.style.transform = '';
            body.style.filter = '';
            if (scanlines) {
                scanlines.style.background = '';
            }
            const noise = document.querySelector('.static-noise');
            if (noise) {
                noise.style.opacity = '';
                noise.style.animation = '';
            }
            state.glitchActive = false;
        }, CONFIG.glitchDuration + Math.random() * 100);
    }

    // === STATIC BURST EFFECT ===
    function triggerStaticBurst() {
        const overlay = document.createElement('div');
        overlay.className = 'static-burst-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
            background: repeating-linear-gradient(
                0deg,
                rgba(255, 255, 255, 0.1) 0px,
                rgba(0, 0, 0, 0.2) 2px,
                rgba(255, 255, 255, 0.05) 4px
            );
            mix-blend-mode: overlay;
            animation: static-burst 0.1s steps(3) infinite;
        `;
        
        document.body.appendChild(overlay);

        // Add keyframe animation if not exists
        if (!document.getElementById('static-burst-style')) {
            const style = document.createElement('style');
            style.id = 'static-burst-style';
            style.textContent = `
                @keyframes static-burst {
                    0% { transform: translateY(0) scaleY(1); opacity: 1; }
                    33% { transform: translateY(-5px) scaleY(1.02); opacity: 0.8; }
                    66% { transform: translateY(3px) scaleY(0.98); opacity: 0.9; }
                    100% { transform: translateY(0) scaleY(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // Show broadcast interruption message
        showInterruptionMessage();

        setTimeout(() => {
            overlay.style.transition = 'opacity 0.2s';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 200);
        }, CONFIG.staticBurstDuration);
    }

    // === BROADCAST INTERRUPTION MESSAGE ===
    function showInterruptionMessage() {
        const message = document.createElement('div');
        message.className = 'interruption-message';
        message.innerHTML = `
            <div class="interruption-inner">
                <span class="interruption-icon">⚠</span>
                <span class="interruption-text">ТЕХНИЧЕСКАЯ ПЕРЕРЫВ</span>
                <span class="interruption-sub">TECHNICAL INTERRUPTION</span>
            </div>
        `;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #CC0000;
            padding: 30px 50px;
            text-align: center;
            animation: interruption-flash 0.15s steps(2) infinite;
        `;

        // Add styles for interruption
        if (!document.getElementById('interruption-style')) {
            const style = document.createElement('style');
            style.id = 'interruption-style';
            style.textContent = `
                @keyframes interruption-flash {
                    0% { border-color: #CC0000; }
                    50% { border-color: #FFD700; }
                }
                .interruption-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .interruption-icon {
                    font-size: 2rem;
                    color: #FFD700;
                    animation: icon-spin 0.3s linear infinite;
                }
                @keyframes icon-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .interruption-text {
                    font-family: 'Russo One', sans-serif;
                    font-size: 1.5rem;
                    color: #CC0000;
                    letter-spacing: 5px;
                }
                .interruption-sub {
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 0.7rem;
                    color: #666;
                    letter-spacing: 3px;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.transition = 'opacity 0.1s';
            message.style.opacity = '0';
            setTimeout(() => {
                message.remove();
            }, 100);
        }, CONFIG.staticBurstDuration - 50);
    }

    // === TICKER PAUSE ON HOVER ===
    function setupTickerInteraction() {
        const tickers = document.querySelectorAll('.ticker-content');
        
        tickers.forEach(ticker => {
            ticker.addEventListener('mouseenter', () => {
                ticker.style.animationPlayState = 'paused';
            });
            
            ticker.addEventListener('mouseleave', () => {
                ticker.style.animationPlayState = 'running';
            });
        });
    }

    // === DISPATCH CARD INTERACTIONS ===
    function setupDispatchInteractions() {
        const dispatchCards = document.querySelectorAll('.dispatch-card');
        
        dispatchCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add subtle screen shake
                const frame = document.querySelector('.broadcast-frame');
                if (frame) {
                    frame.style.transform = 'translateX(2px)';
                    setTimeout(() => {
                        frame.style.transform = 'translateX(-1px)';
                        setTimeout(() => {
                            frame.style.transform = '';
                        }, 50);
                    }, 50);
                }
            });

            // Click to "classify" effect
            card.addEventListener('click', () => {
                if (!card.classList.contains('classified')) {
                    const stamp = document.createElement('div');
                    stamp.className = 'classification-stamp';
                    stamp.textContent = 'ОДОБРЕНО ✓';
                    stamp.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-15deg);
                        font-family: 'Russo One', sans-serif;
                        font-size: 2rem;
                        color: #00AA00;
                        border: 4px solid #00AA00;
                        padding: 10px 30px;
                        letter-spacing: 5px;
                        opacity: 0;
                        animation: stamp-appear 0.3s ease-out forwards;
                        pointer-events: none;
                        z-index: 10;
                    `;
                    
                    if (!document.getElementById('stamp-style')) {
                        const style = document.createElement('style');
                        style.id = 'stamp-style';
                        style.textContent = `
                            @keyframes stamp-appear {
                                0% { opacity: 0; transform: translate(-50%, -50%) rotate(-15deg) scale(2); }
                                50% { opacity: 1; transform: translate(-50%, -50%) rotate(-15deg) scale(0.9); }
                                100% { opacity: 0.7; transform: translate(-50%, -50%) rotate(-15deg) scale(1); }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    card.style.position = 'relative';
                    card.style.overflow = 'hidden';
                    card.appendChild(stamp);
                    card.classList.add('classified');
                }
            });
        });
    }

    // === COSMONAUT POSTER PARALLAX ===
    function setupPosterParallax() {
        const poster = document.querySelector('.cosmonaut-poster');
        if (!poster) return;

        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const rocket = poster.querySelector('.poster-rocket');
            if (rocket) {
                rocket.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            }

            const starBg = poster.querySelector('.poster-star-bg');
            if (starBg) {
                starBg.style.transform = `translate(-50%, -50%) rotate(${x * 10}deg)`;
            }
        });

        poster.addEventListener('mouseleave', () => {
            const rocket = poster.querySelector('.poster-rocket');
            if (rocket) {
                rocket.style.transform = '';
                rocket.style.transition = 'transform 0.3s ease-out';
                setTimeout(() => {
                    rocket.style.transition = '';
                }, 300);
            }

            const starBg = poster.querySelector('.poster-star-bg');
            if (starBg) {
                starBg.style.transform = '';
                starBg.style.transition = 'transform 0.3s ease-out';
                setTimeout(() => {
                    starBg.style.transition = '';
                }, 300);
            }
        });
    }

    // === HERO QUOTE TYPEWRITER EFFECT ===
    function setupQuoteAnimation() {
        const quote = document.querySelector('.directive-quote');
        if (!quote) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    quote.style.borderLeftColor = '#FFD700';
                    quote.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.2)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(quote);
    }

    // === EMBLEM ROTATION ===
    function setupEmblemAnimation() {
        const emblem = document.querySelector('.state-emblem');
        if (!emblem) return;

        let rotation = 0;
        setInterval(() => {
            rotation += 0.5;
            const star = emblem.querySelector('.emblem-star');
            if (star) {
                star.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            }
        }, 50);
    }

    // === RANDOM HEADLINE GENERATOR ===
    const RANDOM_HEADLINES = [
        'Collective farm reports unprecedented potato yields',
        'Scientists confirm: Capitalism causes sadness',
        'New space station visible from all Republics',
        'Worker productivity increases after mandatory nap time',
        'Western spies baffled by Soviet ingenuity',
        'Ballet performance achieves perfect synchronization',
        'Chess grandmaster defeats AI using only intuition',
        'Soviet music now scientifically proven most enjoyable',
        'Mars colony celebrates first harvest festival',
        'Time travel research shows past was also glorious'
    ];

    function addRandomHeadline() {
        const tickerContents = document.querySelectorAll('.ticker-content');
        if (tickerContents.length === 0) return;

        const headline = RANDOM_HEADLINES[Math.floor(Math.random() * RANDOM_HEADLINES.length)];
        const newItem = document.createElement('span');
        newItem.className = 'ticker-item';
        newItem.textContent = `★ BREAKING: ${headline.toUpperCase()} ★`;
        newItem.style.color = '#FF6600';
        newItem.style.fontWeight = 'bold';

        // Briefly highlight new headline
        setTimeout(() => {
            newItem.style.color = '';
            newItem.style.fontWeight = '';
        }, 3000);
    }

    // === SCROLL-TRIGGERED ANIMATIONS ===
    function setupScrollAnimations() {
        const elements = document.querySelectorAll('.widget-title, .constructivist-banner, .broadcast-footer');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    // === KEYBOARD SHORTCUTS (EASTER EGGS) ===
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Press 'G' for manual glitch
            if (e.key.toLowerCase === 'g' || e.key === 'G') {
                triggerGlitch();
            }
            
            // Press 'T' for static burst
            if (e.key.toLowerCase === 't' || e.key === 'T') {
                triggerStaticBurst();
            }
            
            // Press 'N' for new transmission
            if (e.key.toLowerCase === 'n' || e.key === 'N') {
                incrementTransmission();
            }
        });
    }

    // === CURSOR TRAIL EFFECT ===
    function setupCursorTrail() {
        let trail = [];
        const maxTrailLength = 5;

        document.addEventListener('mousemove', (e) => {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail-dot';
            dot.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: 4px;
                height: 4px;
                background: #CC0000;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9996;
                opacity: 0.6;
                transition: opacity 0.3s, transform 0.3s;
            `;
            document.body.appendChild(dot);
            trail.push(dot);

            setTimeout(() => {
                dot.style.opacity = '0';
                dot.style.transform = 'scale(0)';
            }, 100);

            setTimeout(() => {
                dot.remove();
                trail = trail.filter(d => d !== dot);
            }, 400);

            // Limit trail length
            if (trail.length > maxTrailLength) {
                const oldDot = trail.shift();
                oldDot.remove();
            }
        });
    }

    // === INITIALIZATION ===
    function init() {
        if (state.initialized) return;
        state.initialized = true;

        console.log('%c★ ПРАВДА ВЕЩАНИЕ INITIALIZED ★', 
            'color: #FFD700; background: #CC0000; padding: 10px; font-size: 16px; font-weight: bold;');
        console.log('%cTRANSMISSION AUTHORIZED — GLORY TO THE COLLECTIVE', 
            'color: #CC0000; font-size: 12px;');

        // Initial updates
        updateBroadcastTime();
        updateBroadcastDate();

        // Start intervals
        setInterval(updateBroadcastTime, CONFIG.updateInterval);
        setInterval(incrementTransmission, 60000); // New transmission every minute
        
        // Random glitch effects
        setInterval(() => {
            if (Math.random() < 0.3) {
                triggerGlitch();
            }
        }, CONFIG.glitchInterval);

        // Static burst interruptions
        setInterval(() => {
            if (Math.random() < 0.2) {
                triggerStaticBurst();
            }
        }, CONFIG.staticBurstInterval);

        // Random headline additions
        setInterval(addRandomHeadline, 30000);

        // Setup interactions
        setupTickerInteraction();
        setupDispatchInteractions();
        setupPosterParallax();
        setupQuoteAnimation();
        setupEmblemAnimation();
        setupScrollAnimations();
        setupKeyboardShortcuts();
        setupCursorTrail();

        // Animate progress bars after delay
        setTimeout(animateProgressBars, CONFIG.progressAnimationDelay);

        // Add loaded class for any CSS transitions
        document.body.classList.add('broadcast-loaded');
    }

    // === DOM READY ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // === EXPOSE FOR DEBUGGING ===
    window.PRAVDA = {
        triggerGlitch,
        triggerStaticBurst,
        incrementTransmission,
        state
    };

})();