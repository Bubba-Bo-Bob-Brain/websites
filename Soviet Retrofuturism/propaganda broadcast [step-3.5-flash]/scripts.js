/**
 * PRAVDA - Soviet Space-Communist News Broadcast
 * Immersive JavaScript functionality for the glorious state news network
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initClock();
    initTickerEnhancements();
    initScrollAnimations();
    initBroadcastEffects();
    initProgressBar();
    initBreakingNews();
    initInteractiveElements();
    initParallaxEffects();
});

/**
 * Real-time Soviet clock - time is a state commodity
 */
function initClock() {
    const dateEl = document.getElementById('current-date');
    const timeEl = document.getElementById('current-time');
    
    // Soviet-style month names
    const sovietMonths = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    
    function updateClock() {
        const now = new Date();
        
        // Format date in Soviet style: "25 OCTOBER 1984"
        const day = now.getDate();
        const month = sovietMonths[now.getMonth()];
        const year = now.getFullYear();
        dateEl.textContent = `${day} ${month} ${year}`;
        
        // Format time in 24-hour format: "20:15:00"
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Enhance the ticker with dynamic updates and speed variations
 */
function initTickerEnhancements() {
    const tickers = document.querySelectorAll('.ticker');
    
    // Additional news items to occasionally inject
    const extraNews = [
        "★ NEW SOVIET STARSHIP DISCOVERS PLANET RICH IN SOCIALIST MINERALS ★",
        "★ ALL WORKERS EXCEED QUOTAS BY 150% - PARTY PRAISES LOYALTY ★",
        "★ CAPITALIST SPY CAUGHT IN MOSCOW - CONFESSES TO WANTING FREEDOM ★",
        "★ SOVIET CHEESE PRODUCTION HITS ALL-TIME HIGH - CITIZENS REJOICE ★",
        "★ EVERY FAMILY NOW OWNS TWO TELEVISIONS - PROOF OF SOCIALIST SUPERIORITY ★",
        "★ MOSCOW SUBWAY EXPANDS TO MARS - COMMUTERS ENJOY 30-HOUR JOURNEYS ★"
    ];
    
    // Occasionally inject new news (simulates live updates)
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 10 seconds
            const randomNews = extraNews[Math.floor(Math.random() * extraNews.length)];
            const ticker = tickers[Math.floor(Math.random() * tickers.length)];
            const tickerItems = ticker.querySelector('.ticker-item');
            
            // Clone first item and insert new one at random position
            if (tickerItems) {
                const newItem = tickerItems.cloneNode(true);
                newItem.textContent = randomNews;
                ticker.insertBefore(newItem, ticker.children[Math.floor(Math.random() * ticker.children.length)]);
                
                // Remove excess items to prevent infinite growth
                while (ticker.children.length > 8) {
                    ticker.removeChild(ticker.lastChild);
                }
            }
        }
    }, 10000);
    
    // Speed up ticker on hover (dramatic effect)
    tickers.forEach(ticker => {
        ticker.addEventListener('mouseenter', () => {
            ticker.style.animationDuration = '15s';
        });
        ticker.addEventListener('mouseleave', () => {
            ticker.style.animationDuration = '30s';
        });
    });
}

/**
 * Scroll-triggered animations for cards and sections
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children if it's a dispatch card
                if (entry.target.classList.contains('dispatch-card')) {
                    const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);
    
    // Observe all dispatch cards and sections
    const animatedElements = document.querySelectorAll(
        '.dispatch-card, .progress-section, .propaganda-banner, .hero-section'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Add CSS for visible state
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Broadcast screen effects - static, scanlines, occasional interference
 */
function initBroadcastEffects() {
    const broadcastFrame = document.querySelector('.broadcast-frame');
    const staticNoise = document.querySelector('.static-noise');
    const screenContent = document.querySelector('.screen-content');
    
    if (!broadcastFrame || !staticNoise) return;
    
    // Random broadcast interference effect
    setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance every 2 seconds
            // Create a "signal lost" effect
            broadcastFrame.style.filter = 'contrast(200%) brightness(150%)';
            screenContent.style.filter = 'invert(1)';
            
            setTimeout(() => {
                broadcastFrame.style.filter = 'none';
                screenContent.style.filter = 'none';
            }, 100 + Math.random() * 300);
        }
    }, 2000);
    
    // Intensify static noise on hover
    broadcastFrame.addEventListener('mouseenter', () => {
        staticNoise.style.opacity = '0.2';
        staticNoise.style.animationDuration = '0.1s';
    });
    
    broadcastFrame.addEventListener('mouseleave', () => {
        staticNoise.style.opacity = '0.1';
        staticNoise.style.animationDuration = '0.2s';
    });
    
    // Simulate occasional "recording" red dot
    const liveIndicator = document.querySelector('.live-indicator');
    if (liveIndicator) {
        setInterval(() => {
            const liveDot = liveIndicator.querySelector('.live-dot');
            if (liveDot) {
                liveDot.style.background = Math.random() > 0.9 ? '#FF0000' : '#D32F2F';
            }
        }, 5000);
    }
}

/**
 * Animate the Five-Year Plan progress bar based on scroll position
 */
function initProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progressMarker = document.querySelector('.progress-marker');
    const progressSection = document.querySelector('.progress-section');
    
    if (!progressFill || !progressSection) return;
    
    // Initially set width to 0 for animation
    progressFill.style.width = '0%';
    if (progressMarker) progressMarker.style.left = '0%';
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate to 87% (from HTML inline style)
                setTimeout(() => {
                    progressFill.style.width = '87%';
                    if (progressMarker) {
                        progressMarker.style.left = '87%';
                        progressMarker.style.transition = 'left 2s ease-out';
                    }
                }, 300);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(progressSection);
}

/**
 * Random "Breaking News" interruptions with Soviet urgency
 */
function initBreakingNews() {
    const heroText = document.querySelector('.hero-text h3');
    const breakingBadge = document.querySelector('.breaking-badge');
    const heroSection = document.querySelector('.hero-section');
    
    if (!heroText || !breakingBadge) return;
    
    const breakingNews = [
        "URGENT: COMRADE GAGARIN DISCOVERS NEW STAR SYSTEM LOYAL TO USSR!",
        "FLASH: ALL CAPITALIST ROCKETS MALFUNCTION - SOVIET TECHNOLOGY SUPREME!",
        "BULLETIN: MARS COOPERATIVES VOLUNTARILY JOIN SOVIET UNION!",
        "ALERT: ENEMY SATELLITE DESTROYED BY RED ARMY SPACE DEFENSE!",
        "EXTRA: 100% VOTER TURNOUT CONFIRMED IN ALL SOCIALIST REPUBLICS!"
    ];
    
    let currentIndex = 0;
    
    // Change breaking news every 15 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % breakingNews.length;
        const newText = breakingNews[currentIndex];
        
        // Quick flash effect
        heroSection.style.filter = 'brightness(1.5)';
        heroText.textContent = newText;
        breakingBadge.textContent = 'BREAKING';
        breakingBadge.style.animation = 'none';
        breakingBadge.offsetHeight; // Trigger reflow
        breakingBadge.style.animation = 'pulse-badge 1.5s ease-in-out infinite';
        
        setTimeout(() => {
            heroSection.style.filter = 'none';
        }, 200);
    }, 15000);
    
    // Add sound effect placeholder (user could implement actual audio)
    heroSection.addEventListener('click', () => {
        playAnthem();
    });
}

/**
 * Interactive elements - buttons, controls, hover effects
 */
function initInteractiveElements() {
    // Broadcast frame control buttons
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.title;
            
            // Visual feedback
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);
            
            // Simulate control actions
            switch(action) {
                case 'Stop':
                    document.querySelector('.screen-content').style.filter = 'grayscale(100%)';
                    break;
                case 'Play':
                    document.querySelector('.screen-content').style.filter = 'none';
                    break;
                case 'Eject':
                    alert('State security has been notified of your suspicious behavior.');
                    break;
            }
        });
    });
    
    // CTA button in propaganda banner
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Create a "processing" effect
            ctaButton.textContent = 'PROCESSING...';
            ctaButton.disabled = true;
            ctaButton.style.background = 'var(--soviet-red)';
            
            setTimeout(() => {
                ctaButton.textContent = 'ENLISTMENT CONFIRMED';
                ctaButton.style.background = 'var(--soviet-dark-red)';
                
                // Show a "success" toast
                showToast('COMRADE, YOUR FAMILY HAS BEEN ENROLLED IN THE YOUNG PIONEERS. REPORT TO YOUR LOCAL COMMISSAR IMMEDIATELY.');
                
                setTimeout(() => {
                    ctaButton.textContent = 'ENLIST NOW';
                    ctaButton.disabled = false;
                    ctaButton.style.background = 'var(--soviet-black)';
                }, 5000);
            }, 2000);
        });
    }
    
    // Dispatch card interactions
    const dispatchCards = document.querySelectorAll('.dispatch-card');
    dispatchCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle "read" state
            card.classList.toggle('read');
            
            // Could expand card or show full article in a modal
            if (card.classList.contains('read')) {
                showToast('ARTICLE MARKED AS READ. PARTY APPROVED.');
            }
        });
    });
}

/**
 * Parallax effects for hero section
 */
function initParallaxEffects() {
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroSection || !heroImage) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                
                // Parallax on hero image
                if (scrolled < heroSection.offsetHeight) {
                    heroImage.style.transform = `translateY(${rate}px) scale(1.05)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Show a Soviet-style toast notification
 */
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.soviet-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'soviet-toast';
    toast.textContent = message;
    
    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        maxWidth: '400px',
        background: 'var(--soviet-black)',
        color: 'var(--soviet-gold)',
        padding: '1rem 1.5rem',
        border: '3px solid var(--soviet-red)',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.8)',
        zIndex: '10000',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        animation: 'toast-in 0.3s ease-out'
    });
    
    document.body.appendChild(toast);
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes toast-in {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes toast-out {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'toast-out 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

/**
 * Optional: Soviet anthem audio simulation (placeholder)
 * In production, this would load actual audio file
 */
function playAnthem() {
    // Create audio context simulation
    console.log('🎵 Playing: State Anthem of the Soviet Union 🎵');
    console.log('Unbreakable union of freeborn Republics, Great Russia has welded forever to stand...');
    
    // Could implement Web Audio API synthesis here
    // For now, just a console message and visual feedback
    const header = document.querySelector('.main-header');
    if (header) {
        header.style.background = 'linear-gradient(90deg, var(--soviet-red) 0%, var(--soviet-dark-red) 100%)';
        setTimeout(() => {
            header.style.background = 'var(--soviet-black)';
        }, 2000);
    }
}

/**
 * Random Soviet slogan generator for extra immersion
 */
function initRandomSlogans() {
    const slogans = [
        "PROLETARIANS OF ALL COUNTRIES, UNITE!",
        "EVERYONE TO THE POLLS! EVERYONE TO THE VOTE!",
        "GLORY TO THE GREAT OCTOBER SOCIALIST REVOLUTION!",
        "THE PARTY IS THE GUIDE TO THE FUTURE!",
        "SOCIALISM WILL TRIUMPH OVER CAPITALISM!",
        "WORKERS OF THE WORLD, YOU HAVE NOTHING TO LOSE BUT YOUR CHAINS!",
        "LENINISM IS THE MARXISM OF THE ERA OF IMPERIALISM AND PROLETARIAN REVOLUTION!",
        "THE SOVIET UNION IS THE FATHERLAND OF THE WORKING PEOPLE!"
    ];
    
    // Show random slogan in console occasionally
    setInterval(() => {
        if (Math.random() > 0.8) {
            const slogan = slogans[Math.floor(Math.random() * slogans.length)];
            console.log(`%c☭ ${slogan} ☭`, 'color: #D32F2F; font-size: 14px; font-weight: bold;');
        }
    }, 30000);
}

// Initialize random slogans
initRandomSlogans();

/**
 * Easter egg: Konami code reveals secret message
 */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            showToast('CONGRATULATIONS! YOU HAVE PROVEN YOUR LOYALTY TO THE PARTY. ACCESS GRANTED TO THE SECRET ARCHIVES.');
            konamiIndex = 0;
            
            // Flash the entire screen red
            const flash = document.createElement('div');
            Object.assign(flash.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(211, 47, 47, 0.3)',
                zIndex: '99999',
                pointerEvents: 'none'
            });
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 500);
        }
    } else {
        konamiIndex = 0;
    }
});

/**
 * Performance monitoring (Soviet efficiency!)
 */
if (window.performance && performance.mark) {
    performance.mark('pravda-start');
    
    window.addEventListener('load', () => {
        performance.mark('pravda-end');
        performance.measure('pravda-load', 'pravda-start', 'pravda-end');
        
        const measures = performance.getEntriesByName('pravda-load');
        if (measures.length > 0) {
            const loadTime = measures[0].duration;
            console.log(`⚡ PRAVDA loaded in ${loadTime.toFixed(2)}ms - ACHIEVING MAXIMUM EFFICIENCY`);
        }
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initClock,
        initTickerEnhancements,
        initScrollAnimations,
        initBroadcastEffects,
        initProgressBar,
        initBreakingNews,
        initInteractiveElements,
        initParallaxEffects,
        showToast
    };
}