/* ============================================
SOVIET RETROFUTURIST BROADCAST INTERACTIVITY
Workers' Cosmic Broadcast © 1985
============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all systems
    initClock();
    initDate();
    initWorkerCounter();
    initProgressBars();
    initTickerHeadlines();
    initBroadcastEffects();
    initAudioVisualizer();
    
    console.log('✓ ТКВ Systems Online — Workers\' Cosmic Broadcast Initialized');
    console.log('Glory to the Soviet Space Program! 🚀');
});

/* ============================================
CLOCK SYSTEM — Союзное Время
============================================ */
function initClock() {
    const clockElement = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        // Use Soviet-styled time (UTC+3 for Moscow)
        const hours = String(now.getUTCHours() + 3).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

/* ============================================
DATE SYSTEM — Календарь Союза
============================================ */
function initDate() {
    const dateElement = document.getElementById('date');
    
    function updateDate() {
        const now = new Date();
        // Soviet calendar: Day.Month.Year
        const day = String(now.getUTCDate()).padStart(2, '0');
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const year = now.getUTCFullYear();
        
        // For retro feel, let's pretend it's 1985
        const retroYear = 1985;
        dateElement.textContent = `${day}.${month}.${retroYear}`;
    }
    
    updateDate();
    setInterval(updateDate, 60000); // Update every minute
}

/* ============================================
WORKER COUNTER — Счётчик Рабочих
============================================ */
function initWorkerCounter() {
    const workerCountElement = document.getElementById('workerCount');
    const productionIndexElement = document.getElementById('productionIndex');
    
    // Starting values (in millions)
    let workerCount = 847293847;
    let productionIndex = 487.3;
    
    function updateWorkers() {
        // Increment workers (simulating new shift workers)
        workerCount += Math.floor(Math.random() * 100) + 1;
        
        // Format with commas
        workerCountElement.textContent = workerCount.toLocaleString('ru-RU');
        
        // Fluctuate production index slightly
        productionIndex += (Math.random() - 0.5) * 0.5;
        productionIndex = Math.max(480, Math.min(500, productionIndex));
        productionIndexElement.textContent = `+${productionIndex.toFixed(1)}%`;
        
        // Add visual pulse effect
        workerCountElement.style.textShadow = '0 0 30px #FFD700';
        setTimeout(() => {
            workerCountElement.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        }, 200);
    }
    
    // Update every 3 seconds
    setInterval(updateWorkers, 3000);
}

/* ============================================
FIVE-YEAR PLAN PROGRESS BARS
============================================ */
function initProgressBars() {
    const progressTargets = {
        'spaceProgress': 247,
        'industryProgress': 189,
        'farmProgress': 312,
        'scienceProgress': 156
    };
    
    // Animate progress bars with a staggered start
    let delay = 0;
    
    Object.keys(progressTargets).forEach((id, index) => {
        const element = document.getElementById(id);
        const target = progressTargets[id];
        
        setTimeout(() => {
            // Animate from 0 to target
            animateProgressBar(element, target);
        }, delay);
        
        delay += 300; // Stagger each bar
    });
    
    // Continuous update simulation
    setInterval(() => {
        Object.keys(progressTargets).forEach(id => {
            const element = document.getElementById(id);
            const currentWidth = parseFloat(element.style.width) || 0;
            const target = progressTargets[id];
            
            // Small fluctuation to make it feel alive
            const fluctuation = (Math.random() - 0.5) * 2;
            const newWidth = Math.min(target, Math.max(currentWidth - 1, currentWidth + fluctuation));
            
            element.style.width = `${newWidth}%`;
        });
    }, 5000);
}

function animateProgressBar(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16); // 60fps
    
    function step() {
        current += increment;
        if (current < target) {
            element.style.width = `${current}%`;
            requestAnimationFrame(step);
        } else {
            element.style.width = `${target}%`;
        }
    }
    
    requestAnimationFrame(step);
}

/* ============================================
NEWS TICKER SYSTEM — Лента Новостей
============================================ */
function initTickerHeadlines() {
    const headlines = [
        { ru: '🚀 ВЕЛИКИЙ КОСМОНАВТ ДОСТИГ ПЛАНЕТЫ ВЕНЕРА — GLORIOUS VICTORY IN SPACE', en: 'HEROIC COSMONAUT REACHES VENUS' },
        { ru: '🏭 ПРОИЗВОДСТВО РАБОЧИХ РОБОТОВ ПРЕВЫСИЛО ПЛАН НА 500% — PRODUCTIVITY GLORIOUS', en: 'ROBOT WORKERS EXCEED PLAN BY 500%' },
        { ru: '🌾 НОВЫЙ УРОЖАЙ КОСМИЧЕСКОЙ ПШЕНИЦЫ — BOUNTIFUL HARVEST FROM ORBITAL FARMS', en: 'ORBITAL WHEAT HARVEST BREAKS RECORDS' },
        { ru: '⚛️ АТОМНАЯ ЭЛЕКТРОСТАНЦИЯ НА ЛУНЕ ЗАПУЩЕНА — MOON POWER ACTIVATED', en: 'LUNAR NUCLEAR POWER PLANT ONLINE' },
        { ru: '🎖️ ВСЕ РАБОЧИЕ ПОЛУЧИЛИ ОРДЕНА ТРУДОВОЙ СЛАВЫ — GLORY TO THE WORKERS', en: 'ALL WORKERS RECEIVE ORDER OF LABOR GLORY' },
        { ru: '🚂 МАГЛЕВ ПОЕЗД МОСКВА-МАРС НАЧАЛ РАБОТУ — FIRST MARS TRAIN DEPARTS', en: 'MOSCOW-MARS MAGLEV BEGINS SERVICE' },
        { ru: '🌟 НОВАЯ ОРБИТАЛЬНАЯ СТАНЦИЯ "ЛЕНИН" ОТКРЫТА — GLORIOUS ACHIEVEMENT', en: 'LENIN ORBITAL STATION GRAND OPENING' },
        { ru: '🎵 ФЕСТИВАЛЬ "ПЕСНИ КОСМОСА" НАЧИНАЕТСЯ — SPACE SONGS FESTIVAL BEGINS', en: 'SPACE SONGS FESTIVAL KICKS OFF' },
        { ru: '🔧 ИНЖЕНЕРЫ СОЗДАЛИ ВЕЧНЫЙ ДВИГАТЕЛЬ — PERPETUAL MOTION ACHIEVED', en: 'ENGINEERS ACHIEVE PERPETUAL MOTION' },
        { ru: '📡 СВЯЗЬ С МАРСОМ УЛУЧШЕНА В 1000 РАЗ — COMMUNICATION REVOLUTION', en: 'MARS COMMUNICATION IMPROVED 1000X' },
        { ru: '🏠 КАЖДОЙ СЕМЬЕ — КВАРТИРА НА ОРБИТЕ — HOUSING FOR ALL WORKERS', en: 'EVERY FAMILY GETS ORBITAL APARTMENT' },
        { ru: '🎓 УНИВЕРСИТЕТ КОСМОСА ВЫПУСТИЛ 1 МЛН СПЕЦИАЛИСТОВ', en: 'SPACE UNIVERSITY GRADUATES 1 MILLION' }
    ];
    
    // Rotate headlines periodically
    setInterval(() => {
        rotateTickerHeadlines(headlines);
    }, 15000);
}

function rotateTickerHeadlines(headlines) {
    const tickerContent = document.getElementById('ticker');
    const currentHeadlines = tickerContent.querySelectorAll('.ticker-item');
    
    // Get random new headline
    const randomIndex = Math.floor(Math.random() * headlines.length);
    const newHeadline = headlines[randomIndex];
    
    // Create new ticker item
    const newItem = document.createElement('span');
    newItem.className = 'ticker-item';
    newItem.textContent = newHeadline.ru;
    
    // Replace first item and cycle
    if (currentHeadlines.length > 0) {
        currentHeadlines[0].replaceWith(newItem);
    }
}

/* ============================================
BROADCAST EFFECTS
============================================ */
function initBroadcastEffects() {
    // Screen flicker effect
    const broadcastScreen = document.querySelector('.broadcast-screen');
    
    // Random broadcast glitch
    setInterval(() => {
        if (Math.random() > 0.95) {
            triggerBroadcastGlitch();
        }
    }, 3000);
    
    function triggerBroadcastGlitch() {
        const content = document.querySelector('.broadcast-content');
        content.style.opacity = '0.8';
        content.style.transform = `translateX(${(Math.random() - 0.5) * 10}px)`;
        
        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateX(0)';
        }, 100);
    }
    
    // Live indicator intensity variation
    const liveIndicator = document.querySelector('.live-indicator');
    setInterval(() => {
        liveIndicator.style.textShadow = Math.random() > 0.5 
            ? '0 0 20px #FF0000' 
            : '0 0 10px #FF0000';
    }, 500);
}

/* ============================================
AUDIO VISUALIZER ENHANCEMENT
============================================ */
function initAudioVisualizer() {
    const vizBars = document.querySelectorAll('.viz-bar');
    
    // Make visualizer more dynamic
    vizBars.forEach((bar, index) => {
        setInterval(() => {
            // Random height variation
            const newHeight = 20 + Math.random() * 80;
            bar.style.height = `${newHeight}%`;
        }, 200 + index * 50);
    });
}

/* ============================================
SCROLL ANIMATIONS (Intersection Observer)
============================================ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe news cards
    document.querySelectorAll('.news-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

/* ============================================
KEYBOARD EASTER EGG — Secret Commands
============================================ */
document.addEventListener('keydown', function(e) {
    // Konami code detection
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const keyHistory = [];
    
    document.addEventListener('keydown', function(e) {
        keyHistory.push(e.key);
        if (keyHistory.length > konamiCode.length) {
            keyHistory.shift();
        }
        
        if (keyHistory.join('').toLowerCase() === konamiCode.join('').toLowerCase()) {
            triggerEasterEgg();
        }
    });
});

function triggerEasterEgg() {
    // Change to alternate reality message
    const heroTitle = document.querySelector('.broadcast-message h2');
    heroTitle.innerHTML = '🌟 СЕКРЕТНОЕ СООБЩЕНИЕ<br>SECRET MESSAGE DISCOVERED!';
    heroTitle.style.color = '#00FF00';
    
    // Add matrix-style effect
    document.body.style.filter = 'hue-rotate(90deg)';
    setTimeout(() => {
        document.body.style.filter = 'none';
        alert('✱ Обнаружена секретная связь с внеземными цивилизациями! ✱\n\nSECRET CONTACT WITH EXTRATERRESTRIALS CONFIRMED!');
    }, 1000);
    
    console.log('🌟 EASTER EGG ACTIVATED: Secret Message Found!');
}

/* ============================================
ADDITIONAL DYNAMIC CONTENT
============================================ */
function initDynamicContent() {
    // Update timestamps on news cards periodically
    setInterval(() => {
        const timestamps = document.querySelectorAll('.news-timestamp');
        timestamps.forEach(ts => {
            const currentTime = ts.textContent;
            const parts = currentTime.split(':');
            let hours = parseInt(parts[0]);
            let minutes = parseInt(parts[1]);
            let seconds = parseInt(parts[2]) + Math.floor(Math.random() * 5);
            
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
            if (hours >= 24) {
                hours = 0;
            }
            
            ts.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        });
    }, 5000);
}

// Initialize dynamic content
initDynamicContent();

/* ============================================
LOADING SEQUENCE
============================================ */
window.addEventListener('load', function() {
    // Simulate broadcast startup
    console.log('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓');
    console.log('▓ INITIALIZING BROADCAST SYSTEMS ▓');
    console.log('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓');
    console.log('');
    console.log('✓ Clock System: ONLINE');
    console.log('✓ Date System: ONLINE');
    console.log('✓ Worker Counter: ONLINE');
    console.log('✓ Progress Bars: ONLINE');
    console.log('✓ News Ticker: ONLINE');
    console.log('✓ Broadcast Effects: ONLINE');
    console.log('✓ Audio Visualizer: ONLINE');
    console.log('');
    console.log('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓');
    console.log('▓ FULLY OPERATIONAL — В ЭФИРЕ ▓');
    console.log('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓');
});