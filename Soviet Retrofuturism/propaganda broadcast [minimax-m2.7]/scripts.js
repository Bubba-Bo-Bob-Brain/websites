/* ============================================
   СОВЕТСКОЕ ТЕЛЕВИДЕНИЕ - SCRIPTS.JS
   Soviet Retrofuturist Broadcast JavaScript
   ============================================ */

// ============================================ GLOBAL STATE & CONFIGURATION
// ============================================

const CONFIG = {
    dateFormat: 'soviet',
    animations: {
        enableStatic: true,
        enableFlicker: true,
        enableFloating: true
    }
};

const state = {
    currentTickerIndex: 0,
    isPaused: false,
    tickerSpeed: 80
};

// ============================================ INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('СОВЕТСКОЕ ТЕЛЕВИДЕНИЕ: Broadcast Systems Initializing...');
    initClock();
    initTicker();
    initProgressBars();
    initCounters();
    initStaticEffect();
    initHoverEffects();
    initCRTEffects();
    initAudioAmbience();
    initParallax();
    initRandomEvents();
    console.log('СОВЕТСКОЕ ТЕЛЕВИДЕНИЕ: All Systems Operational');
});

// ============================================ CLOCK MODULE
// ============================================

function initClock() {
    const dateElement = document.getElementById('sovietDate');
    const timeElement = document.getElementById('sovietTime');

    const monthsSoviet = [
        'ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ',
        'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'
    ];

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        if (timeElement) {
            timeElement.textContent = hours + ':' + minutes + ':' + seconds;
        }

        if (dateElement) {
            const day = now.getDate();
            const month = monthsSoviet[now.getMonth()];
            const year = now.getFullYear();
            const revolutionYear = now.getFullYear() - 1917 + 1;
            dateElement.innerHTML = day + ' ' + month + ' ' + year + ' ГОДА <span class="revolution-year">| ' + revolutionYear + ' ГОД СОЦИАЛИСТИЧЕСКОЙ РЕВОЛЮЦИИ</span>';
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// ============================================ TICKER MODULE
// ============================================

function initTicker() {
    const tickerContent = document.getElementById('tickerContent');
    if (!tickerContent) return;

    const additionalMessages = [
        'ТОВАРИЩ ГОРБАЧЁВ ОБЪЯВИЛ О НОВЫХ РЕФОРМАХ В АППАРАТЕ УПРАВЛЕНИЯ!',
        'КОЛХОЗ СВЕТ ЛЕНИНА ПРИНЯЛ 500 НОВЫХ РАБОЧИХ - УСПЕХ КОЛЛЕКТИВИЗАЦИИ!',
        'УГОЛЬНЫЕ ШАХТЫ КУЗБАССА ДОБЫЛИ РЕКОРДНОЕ КОЛИЧЕСТВО УГЛЯ!',
        'СТРОИТЕЛЬСТВО БАМ ЗАВЕРШЕНО НА 89 ПРОЦЕНТОВ!',
        'НОВЫЕ ОРДЕНА ВРУЧЕНЫ ГЕРОЯМ СОЦИАЛИСТИЧЕСКОГО ТРУДА!',
        'ВСЕСОЮЗНАЯ ОЛИМПИАДА ШКОЛЬНИКОВ ОТКРЫЛА СВОИ ДВЕРИ!',
        'СЕВЕРНЫЙ ФЛОТ ПРОВЕЛ УЧЕНИЯ В АРКТИКЕ!',
        'НОВЫЕ ЖИЛЫЕ КОМПЛЕКСЫ ПОСТРОЕНЫ ДЛЯ ТРУДЯЩИХСЯ!',
        'САДОВОДЫ КУБАНИ СОБРАЛИ РЕКОРДНЫЙ УРОЖАЙ ФРУКТОВ!',
        'ИНСТИТУТ КУРЧАТОВА СДЕЛАЛ НОВОЕ ОТКРЫТИЕ В ФИЗИКЕ!',
        'БИБЛИОТЕКА ИМЕНИ ЛЕНИНА ПОПОЛНИЛАСЬ МИЛЛИОНОМ КНИГ!',
        'ХУДОЖНИКИ СССР СОЗДАЮТ НОВЫЕ ПОЛОТНА ДЛЯ КРЕМЛЯ!'
    ];

    const separatorHTML = '<span class="ticker-separator">*</span>';
    const originalContent = tickerContent.innerHTML;
    
    let additionalHTML = additionalMessages.map(function(msg) {
        return '<span class="ticker-item">' + msg + '</span>';
    }).join(separatorHTML);

    tickerContent.innerHTML = originalContent + separatorHTML + additionalHTML;

    tickerContent.addEventListener('mouseenter', function() {
        tickerContent.style.animationPlayState = 'paused';
    });

    tickerContent.addEventListener('mouseleave', function() {
        tickerContent.style.animationPlayState = 'running';
    });
}

// ============================================ PROGRESS BARS MODULE
// ============================================

function initProgressBars() {
    const progressBars = document.querySelectorAll('.plan-bar-fill');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetValue = parseInt(bar.dataset.value, 10);
                const percentDisplay = bar.closest('.plan-item').querySelector('.plan-item-percent');
                animateProgress(bar, percentDisplay, targetValue);
                progressObserver.unobserve(bar);
            }
        });
    }, observerOptions);

    progressBars.forEach(function(bar) {
        progressObserver.observe(bar);
    });
}

function animateProgress(bar, percentDisplay, targetValue) {
    let currentValue = 0;
    const duration = 2000;
    const startTime = performance.now();
    const maxDisplay = Math.min(targetValue, 150);

    function updateProgress(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        currentValue = Math.round(easeOut * maxDisplay);
        const barWidth = Math.min(currentValue, 100);
        bar.style.width = barWidth + '%';

        if (percentDisplay) {
            percentDisplay.textContent = currentValue + '%';
            if (currentValue > 100) {
                percentDisplay.style.textShadow = '0 0 20px rgba(255, 215, 0, 1)';
                percentDisplay.classList.add('exceeded');
            }
        }

        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        } else {
            bar.style.width = Math.min(targetValue, 100) + '%';
            if (percentDisplay) {
                percentDisplay.textContent = targetValue + '%';
            }
        }
    }

    requestAnimationFrame(updateProgress);
}

// ============================================ COUNTER ANIMATION MODULE
// ============================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetCount = parseInt(counter.dataset.count, 10);
                animateCounter(counter, targetCount);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 3000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        current = Math.round(easeOut * target);
        element.textContent = current.toLocaleString('ru-RU');

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString('ru-RU');
            element.classList.add('count-complete');
            setTimeout(function() {
                element.classList.remove('count-complete');
            }, 500);
        }
    }

    requestAnimationFrame(updateCounter);
}

// ============================================ STATIC NOISE EFFECT
// ============================================

function initStaticEffect() {
    if (!CONFIG.animations.enableStatic) return;

    const staticContainer = document.getElementById('staticOverlay');
    if (!staticContainer) return;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    canvas.id = 'staticCanvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:0.12;mix-blend-mode:overlay;';

    staticContainer.parentNode.replaceChild(canvas, staticContainer);

    function generateStatic() {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = Math.random() * 50;
        }

        ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(generateStatic);
    }

    generateStatic();

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        canvas.style.opacity = '0.05';
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            canvas.style.opacity = '0.12';
        }, 150);
    });
}

// ============================================ CRT EFFECTS MODULE
// ============================================

function initCRTEffects() {
    if (!CONFIG.animations.enableFlicker) return;

    const broadcastFrame = document.querySelector('.broadcast-frame');
    if (!broadcastFrame) return;

    let flickerIntensity = 1;

    function crtFlicker() {
        flickerIntensity = 0.97 + Math.random() * 0.06;
        broadcastFrame.style.filter = 'brightness(' + flickerIntensity + ')';
        setTimeout(crtFlicker, 100 + Math.random() * 200);
    }

    crtFlicker();

    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            card.style.textShadow = '1px 0 0 rgba(255,0,0,0.5), -1px 0 0 rgba(0,255,255,0.5)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.textShadow = 'none';
        });
    });

    const glitchMessages = [
        'СИГНАЛ СТАБИЛЕН',
        'ПОМЕХИ НА ЛИНИИ',
        'ВЕЩАНИЕ ПРОДОЛЖАЕТСЯ',
        'СЛАВА СССР'
    ];

    setInterval(function() {
        if (Math.random() < 0.1) {
            triggerGlitch(glitchMessages[Math.floor(Math.random() * glitchMessages.length)]);
        }
    }, 10000);
}

function triggerGlitch(message) {
    const broadcastFrame = document.querySelector('.broadcast-frame');
    if (!broadcastFrame) return;

    const glitch = document.createElement('div');
    glitch.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.1) 2px, rgba(255, 0, 0, 0.1) 4px);pointer-events:none;z-index:9997;animation:glitchEffect 0.3s ease-out forwards;';

    if (!document.querySelector('#glitchKeyframes')) {
        const style = document.createElement('style');
        style.id = 'glitchKeyframes';
        style.textContent = '@keyframes glitchEffect{0%{transform:translateX(-5px) skewX(-5deg);opacity:0.8}25%{transform:translateX(5px) skewX(5deg);opacity:0.6}50%{transform:translateX(-3px);opacity:0.8}75%{transform:translateX(3px);opacity:0.5}100%{transform:translateX(0);opacity:0}}';
        document.head.appendChild(style);
    }

    document.body.appendChild(glitch);
    setTimeout(function() {
        glitch.remove();
    }, 300);
}

// ============================================ HOVER EFFECTS MODULE
// ============================================

function initHoverEffects() {
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const headline = card.querySelector('.card-headline');
            if (headline) headline.classList.add('hovered');
        });
        card.addEventListener('mouseleave', function() {
            const headline = card.querySelector('.card-headline');
            if (headline) headline.classList.remove('hovered');
        });
    });

    const planBars = document.querySelectorAll('.plan-bar');
    planBars.forEach(function(bar) {
        bar.addEventListener('mouseenter', function() {
            bar.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        });
        bar.addEventListener('mouseleave', function() {
            bar.style.boxShadow = 'none';
        });
    });

    const stats = document.querySelectorAll('.broadcast-stat');
    stats.forEach(function(stat) {
        stat.addEventListener('mouseenter', function() {
            stat.style.transform = 'scale(1.1)';
            stat.style.zIndex = '10';
        });
        stat.addEventListener('mouseleave', function() {
            stat.style.transform = 'scale(1)';
            stat.style.zIndex = '1';
        });
    });

    const gears = document.querySelectorAll('.gear-icon');
    gears.forEach(function(gear) {
        gear.addEventListener('mouseenter', function() {
            gear.style.animationDuration = '2s';
        });
        gear.addEventListener('mouseleave', function() {
            gear.style.animationDuration = '10s';
        });
    });
}

// ============================================ AUDIO AMBIENCE MODULE
// ============================================

function initAudioAmbience() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    let audioContext;
    let isAudioInitialized = false;

    function initAudio() {
        if (isAudioInitialized) return;

        try {
            audioContext = new AudioContext();

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(50, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.015, audioContext.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();

            isAudioInitialized = true;
            console.log('СОВЕТСКОЕ ТЕЛЕВИДЕНИЕ: Audio systems activated');
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
}

// ============================================ PARALLAX EFFECTS
// ============================================

function initParallax() {
    const masthead = document.querySelector('.masthead');
    const decorations = document.querySelectorAll('.gear-icon, .hammer-sickle');

    if (!masthead || window.innerWidth < 900) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;

                if (masthead) {
                    masthead.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
                }

                decorations.forEach(function(dec, index) {
                    const speed = 0.2 + (index * 0.1);
                    dec.style.transform = 'translateY(' + (scrolled * speed) + 'px) rotate(' + (scrolled * 0.05) + 'deg)';
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================ RANDOM EVENTS MODULE
// ============================================

function initRandomEvents() {
    setInterval(function() {
        const tickerItems = document.querySelectorAll('.ticker-item');
        if (tickerItems.length === 0) return;

        const randomItem = tickerItems[Math.floor(Math.random() * tickerItems.length)];
        randomItem.classList.add('flash');
        setTimeout(function() {
            randomItem.classList.remove('flash');
        }, 500);
    }, 8000);

    const statusMessages = [
        'ВЕЩАНИЕ ПРОДОЛЖАЕТСЯ',
        'СИГНАЛ УСТОЙЧИВЫЙ',
        'КАЧЕСТВЕ: ОТЛИЧНОЕ',
        'СИСТЕМА РАБОТАЕТ',
        'КАНАЛ: ОСНОВНОЙ'
    ];

    setInterval(function() {
        const badge = document.querySelector('.broadcast-badge');
        if (badge && Math.random() < 0.3) {
            const originalText = badge.innerHTML;
            const randomStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
            badge.innerHTML = '<span class="live-indicator"></span> ' + randomStatus;
            setTimeout(function() {
                badge.innerHTML = originalText;
            }, 2000);
        }
    }, 15000);

    setTimeout(function() {
        const cosmonaut = document.querySelector('.cosmonaut-svg');
        if (cosmonaut) {
            cosmonaut.style.animation = 'none';
            cosmonaut.offsetHeight;
            cosmonaut.style.animation = 'cosmonautJump 0.5s ease-out';
            addCosmonautStyle();
        }
    }, 5000);

    setTimeout(function() {
        const cosmonaut = document.querySelector('.cosmonaut-svg');
        if (cosmonaut) {
            cosmonaut.style.animation = 'cosmonautWave 0.5s ease-out';
        }
    }, 12000);
}

function addCosmonautStyle() {
    if (document.getElementById('cosmonautStyles')) return;

    const style = document.createElement('style');
    style.id = 'cosmonautStyles';
    style.textContent = '@keyframes cosmonautJump{0%{transform:translateY(0)}50%{transform:translateY(-30px) scale(1.05)}100%{transform:translateY(0) scale(1)}}@keyframes cosmonautWave{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg)}75%{transform:rotate(10deg)}}';
    document.head.appendChild(style);
}

// ============================================ DYNAMIC STYLES INJECTION
// ============================================

(function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = [
        '.ticker-item.flash{animation:tickerFlash 0.5s ease-out}',
        '@keyframes tickerFlash{0%,100%{color:var(--cream);background:transparent}50%{color:var(--soviet-gold);background:rgba(139,0,0,0.5)}}',
        '.card-headline.hovered{color:var(--soviet-gold)!important;text-shadow:2px 2px 0 var(--soviet-red)}',
        '.stat-number.count-complete{animation:counterPop 0.5s ease-out}',
        '@keyframes counterPop{0%{transform:scale(1)}50%{transform:scale(1.2);color:#fff}100%{transform:scale(1)}}',
        '.plan-item-percent.exceeded{color:#00ff00!important;animation:exceededPulse 1s ease-in-out infinite}',
        '@keyframes exceededPulse{0%,100%{text-shadow:0 0 10px rgba(0,255,0,0.5)}50%{text-shadow:0 0 30px rgba(0,255,0,1)}}'
    ].join('');

    document.head.appendChild(style);
})();

// ============================================ KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', function(e) {
    if (e.key === 's' || e.key === 'ы') {
        const staticCanvas = document.getElementById('staticCanvas');
        if (staticCanvas) {
            staticCanvas.style.display = staticCanvas.style.display === 'none' ? 'block' : 'none';
        }
    }

    if (e.key === 't' || e.key === 'е') {
        const ticker = document.querySelector('.ticker-content');
        if (ticker) {
            ticker.style.animationPlayState = ticker.style.animationPlayState === 'paused' ? 'running' : 'paused';
        }
    }

    if (e.key === 'r' || e.key === 'к') {
        location.reload();
    }
});

// ============================================ PERFORMANCE MONITORING
// ============================================

(function monitorPerformance() {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('СОВЕТСКОЕ ТЕЛЕВИДЕНИЕ: Page load time - ' + pageLoadTime + 'ms');
    }
})();

// ============================================ CONSOLE MESSAGES
// ============================================

console.log('============================================');
console.log(' СОВЕТСКОЕ ТЕЛЕВИДЕНИЕ BROADCAST SYSTEMS');
console.log('============================================');
console.log(' Version: 2.0 "ВЕЛИКИЙ ОКТЯБРЬ"');
console.log(' Status: OPERATIONAL');
console.log(' Quality: HD (Heroic Definition)');
console.log(' Signal: STRONG');
console.log(' Glory to the Workers!');
console.log('============================================');