// ===== LIVE CLOCK =====
function updateClock() {
    const now = new Date();
    const moscowTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
    
    const hours = String(moscowTime.getHours()).padStart(2, '0');
    const minutes = String(moscowTime.getMinutes()).padStart(2, '0');
    const seconds = String(moscowTime.getSeconds()).padStart(2, '0');
    
    // Update any clock elements if present
    const timeElements = document.querySelectorAll('[data-clock]');
    timeElements.forEach(el => {
        el.textContent = `${hours}:${minutes}:${seconds} МСК`;
    });
}

setInterval(updateClock, 1000);
updateClock();

// ===== VIEWER COUNT ANIMATION =====
function animateViewerCount() {
    const viewerElements = document.querySelectorAll('.meta-item');
    viewerElements.forEach(el => {
        if (el.textContent.includes('ПРИСОЕДИНИЛИСЬ')) {
            let count = 2847000000;
            setInterval(() => {
                count += Math.floor(Math.random() * 10000) + 1000;
                el.textContent = `👁 ${count.toLocaleString()} ПРИСОЕДИНИЛИСЬ`;
            }, 2000);
        }
    });
}
animateViewerCount();

// ===== TYPING EFFECT FOR FEATURED DISPATCH =====
function typeWriter(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Apply typing effect to dispatch text
document.addEventListener('DOMContentLoaded', () => {
    const dispatchText = document.querySelector('.dispatch-text');
    if (dispatchText) {
        const originalText = dispatchText.textContent;
        dispatchText.textContent = '';
        setTimeout(() => {
            typeWriter(dispatchText, originalText, 20);
        }, 800);
    }
});

// ===== DYNAMIC TICKER HEADLINES =====
const headlines = [
    '🚀 СОВЕТСКИЙ КОСМОНАВТ УСТАНОВИЛ НОВЫЙ РЕКОРД — 847 СУТКИ В КОСМОСЕ БЕЗ ПАУЗЫ НА ЧАЙ',
    '🌾 ПЯТИЛЕТКА ПРОДАКТОВОЙ ПРОДАКТИВНОСТИ ВЫПОЛНЕНА НА 340% — ТРУДИВОЙСТВО НЕ ОТДЫХАЕТ',
    '⭐ КАЖДЫЙ РАБОЧИЙ — ГЕРОЙ, КАЖДАЯ СТРУЖКА — ДИПЛОМ',
    '🏗️ НОВЫЙ КОРАБОЛЬ «ПРОЛЕТАРИЙ-7» ПОСТРОЕН ЗА 11 ДНЕЙ — ВРАГ КРИЧИТ, А МЫ СТРОИМ',
    '☭ СОВЕТСКИЙ СОН — ЭТО КОСМОС, МАШИНЫ И СПОКОЙНАЯ ДУША ТРУДЯЩЕГОСЯ',
    '🔧 ЗАВОД «МАЯК» ВЫПУСТИЛ 50 000 ТРАКТОРОВ ЗА ОДИН СМЕНУ',
    '📚 НОВЫЙ УЧЕБНИК «ГЕОМЕТРИЯ ПОВСЕДНОВЕННОСТИ» РАЗОШЁЛСЯ ТИРАЖОМ В 2 МИЛЛИарда',
    '🌍 МАРСИАНСКАЯ ПЕРЕСЕЛЕНЧЕСКАЯ ПРОГРАММА НА 74% ЗАВЕРШЕНА',
    '🏅 ТРЁХКРАТНАЯ ГЕРОИНЯ ТРУДА ЕКАТЕРИНА ПЕТРОВА ПОЛУЧИЛА 900-Й ОРДЕН',
    '🛰️ СПУТНИК «ПРАВДА-12» НАЧАЛ ТРАНСЛЯЦИЮ НА ВСЕ ВОСТОЧНОЕВОПЕЙСКОЕ ПРОСТРАНСТВО',
    '🌻 КАЛУЖСКАЯ ОБЛАСТЬ УСТАНОВИЛА РЕКОРД ПО ДИКОМУ МЁДУ — 50 ТОНН',
    '⚙️ НОВЫЙ КОМБАЙН «КОЛЛЕКТИВИСТ-9» СОБРАЛ 12 МИЛЛИОНОВ ГЕКТАРОВ'
];

let currentHeadlineIndex = 0;
const tickerItems = document.querySelectorAll('.ticker-item');

function rotateHeadlines() {
    tickerItems.forEach((item, index) => {
        const headlineIndex = (currentHeadlineIndex + index) % headlines.length;
        item.textContent = headlines[headlineIndex];
    });
    currentHeadlineIndex++;
    if (currentHeadlineIndex >= headlines.length) currentHeadlineIndex = 0;
}

setInterval(rotateHeadlines, 8000);

// ===== CRT STATIC Flicker Enhancement =====
const staticLines = document.querySelector('.static-lines');
if (staticLines) {
    setInterval(() => {
        const opacity = 0.02 + Math.random() * 0.04;
        staticLines.style.opacity = opacity;
    }, 100);
}

// ===== BREAKING NEWS ALERT =====
function showBreakingNews() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'breaking-news-alert';
    alertDiv.innerHTML = `
        <div class="breaking-news-inner">
            <span class="breaking-icon">⚡</span>
            <span class="breaking-text">СРОЧНО: КОСМОНАВТ ИВАНОВ ПЕРЕДАЛ РАПОРТ С ОРБИТЫ — ВЕЛИЧАЙШИЙ ПОБЕДА!</span>
            <span class="breaking-close">&times;</span>
        </div>
    `;
    
    // Inject styles
    if (!document.querySelector('#breaking-styles')) {
        const style = document.createElement('style');
        style.id = 'breaking-styles';
        style.textContent = `
            .breaking-news-alert {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 2000;
                background: linear-gradient(180deg, rgba(139, 0, 0, 0.95), rgba(139, 0, 0, 0.85));
                border-bottom: 2px solid var(--gold-primary);
                animation: breakingSlideDown 0.5s ease-out;
                box-shadow: 0 4px 30px rgba(196, 30, 30, 0.5);
            }
            .breaking-news-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                padding: 12px 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .breaking-icon {
                font-size: 1.2rem;
                animation: breakingBlink 0.5s ease-in-out infinite;
            }
            .breaking-text {
                font-family: 'Oswald', sans-serif;
                font-weight: 700;
                font-size: 0.85rem;
                letter-spacing: 3px;
                color: var(--gold-primary);
                text-transform: uppercase;
                flex: 1;
                text-align: center;
            }
            .breaking-close {
                font-family: 'Oxanium', sans-serif;
                font-size: 1.5rem;
                color: var(--gold-primary);
                cursor: pointer;
                padding: 0 10px;
                transition: opacity 0.3s;
            }
            .breaking-close:hover {
                opacity: 0.5;
            }
            @keyframes breakingSlideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes breakingBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(alertDiv);
    
    const closeBtn = alertDiv.querySelector('.breaking-close');
    closeBtn.addEventListener('click', () => {
        alertDiv.style.animation = 'breakingSlideUp 0.3s ease-in forwards';
        setTimeout(() => alertDiv.remove(), 300);
    });
    
    // Auto dismiss after 8 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'breakingSlideUp 0.3s ease-in forwards';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 8000);
}

// Add slide up animation
const slideUpStyle = document.createElement('style');
slideUpStyle.textContent = `
    @keyframes breakingSlideUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
    }
`;
document.head.appendChild(slideUpStyle);

// Show breaking news after 5 seconds
setTimeout(showBreakingNews, 5000);

// ===== PROGRESS BAR ANIMATION ON SCROLL =====
const progressBars = document.querySelectorAll('.progress-fill, .plan-bar-fill');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.style.getPropertyValue('--progress') || bar.style.getPropertyValue('--fill');
            bar.style.width = targetWidth;
            progressObserver.unobserve(bar);
        }
    });
}, observerOptions);

progressBars.forEach(bar => {
    bar.style.width = '0%';
    progressObserver.observe(bar);
});

// ===== DISPATCH CARD INTERACTIONS =====
const dispatchCards = document.querySelectorAll('.dispatch-card');

dispatchCards.forEach(card => {
    card.addEventListener('click', () => {
        // Expand card
        card.classList.toggle('expanded');
        
        // Add a dramatic glow effect
        card.style.boxShadow = card.classList.contains('expanded') 
            ? '0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(139, 0, 0, 0.2)' 
            : '';
        
        // Create a starburst effect
        const burst = document.createElement('div');
        burst.className = 'card-burst';
        burst.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255,215,0,0.3), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: burstExpand 0.6s ease-out forwards;
        `;
        card.appendChild(burst);
        setTimeout(() => burst.remove(), 600);
    });
});

// Burst animation style
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes burstExpand {
        0% { width: 0; height: 0; opacity: 1; }
        100% { width: 300px; height: 300px; opacity: 0; }
    }
`;
document.head.appendChild(burstStyle);

// ===== STAR TWINKLE ENHANCEMENT =====
const starElements = document.querySelectorAll('.star-s');
starElements.forEach(star => {
    star.addEventListener('mouseenter', () => {
        star.style.animation = 'none';
        star.style.opacity = '1';
        star.style.transform = 'scale(2)';
        setTimeout(() => {
            star.style.transform = 'scale(1)';
            star.style.opacity = '0.3';
            star.style.animation = '';
        }, 500);
    });
});

// ===== COSMONAUT FIGURE INTERACTION =====
const cosmonautFigure = document.querySelector('.cosmonaut-figure');
if (cosmonautFigure) {
    cosmonautFigure.addEventListener('mouseenter', () => {
        cosmonautFigure.style.animation = 'cosmonautFloat 2s ease-in-out infinite';
    });
    cosmonautFigure.addEventListener('mouseleave', () => {
        cosmonautFigure.style.animation = '';
    });
}

// Float animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes cosmonautFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(1deg); }
        50% { transform: translateY(-5px) rotate(0deg); }
        75% { transform: translateY(-15px) rotate(-1deg); }
    }
`;
document.head.appendChild(floatStyle);

// ===== PLANET ROTATION =====
const planet = document.querySelector('.planet');
if (planet) {
    let rotation = 0;
    setInterval(() => {
        rotation += 0.5;
        const rings = planet.querySelector('.planet-rings');
        if (rings) {
            rings.style.transform = `translate(-50%, -50%) rotateX(75deg) rotateZ(${rotation}deg)`;
        }
    }, 50);
}

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.dispatch-card, .plan-item, .featured-dispatch');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    revealObserver.observe(el);
});

// ===== AMBIENT PARTICLES =====
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'ambient-particle';
    particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: var(--gold-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
    `;
    
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 10;
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    document.body.appendChild(particle);
    
    const duration = 8000 + Math.random() * 6000;
    const drift = (Math.random() - 0.5) * 200;
    const startTime = Date.now();
    
    function animateParticle() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress >= 1) {
            particle.remove();
            return;
        }
        
        const y = startY - (startY + 10) * progress;
        const x = startX + drift * progress;
        const opacity = progress < 0.1 ? progress * 10 : (progress > 0.8 ? (1 - progress) * 5 : 0.8);
        
        particle.style.top = y + 'px';
        particle.style.left = x + 'px';
        particle.style.opacity = opacity;
        
        requestAnimationFrame(animateParticle);
    }
    
    animateParticle();
}

// Spawn particles periodically
setInterval(createParticle, 400);

// ===== AMBIENT PARTICLE STYLES =====
const ambientStyle = document.createElement('style');
ambientStyle.textContent = `
    .ambient-particle {
        box-shadow: 0 0 4px rgba(255, 215, 0, 0.5);
    }
`;
document.head.appendChild(ambientStyle);

// ===== INITIAL LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Trigger progress bar animations after a short delay
    setTimeout(() => {
        progressBars.forEach(bar => {
            const target = bar.style.getPropertyValue('--progress') || bar.style.getPropertyValue('--fill');
            bar.style.transition = 'width 2s ease-out';
            bar.style.width = target;
        });
    }, 500);
});

// ===== RANDOM STATIC BURST =====
function staticBurst() {
    const screen = document.querySelector('.screen-inner');
    if (!screen) return;
    
    const burst = document.createElement('div');
    burst.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.03);
        pointer-events: none;
        z-index: 10;
        animation: staticBurstFade 0.15s ease-out forwards;
    `;
    screen.appendChild(burst);
    setTimeout(() => burst.remove(), 150);
}

setInterval(staticBurst, 4000 + Math.random() * 3000);

// Static burst animation
const staticBurstStyle = document.createElement('style');
staticBurstStyle.textContent = `
    @keyframes staticBurstFade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(staticBurstStyle);

// ===== SECOND BREAKING NEWS AFTER 20 SECONDS =====
setTimeout(() => {
    const alertDiv2 = document.createElement('div');
    alertDiv2.className = 'breaking-news-alert';
    alertDiv2.innerHTML = `
        <div class="breaking-news-inner">
            <span class="breaking-icon">📡</span>
            <span class="breaking-text">СПУТНИК «ПРАВДА-12» ЗАПУЩЕН УСПЕШНО — КАНАЛ ОБОГНУТ НА ВСЮ ПЛАНЕТУ</span>
            <span class="breaking-close">&times;</span>
        </div>
    `;
    
    if (!document.querySelector('#breaking-styles')) {
        const style = document.createElement('style');
        style.id = 'breaking-styles';
        style.textContent = `
            .breaking-news-alert {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 2000;
                background: linear-gradient(180deg, rgba(139, 0, 0, 0.95), rgba(139, 0, 0, 0.85));
                border-bottom: 2px solid var(--gold-primary);
                animation: breakingSlideDown 0.5s ease-out;
                box-shadow: 0 4px 30px rgba(196, 30, 30, 0.5);
            }
            .breaking-news-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                padding: 12px 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .breaking-icon {
                font-size: 1.2rem;
                animation: breakingBlink 0.5s ease-in-out infinite;
            }
            .breaking-text {
                font-family: 'Oswald', sans-serif;
                font-weight: 700;
                font-size: 0.85rem;
                letter-spacing: 3px;
                color: var(--gold-primary);
                text-transform: uppercase;
                flex: 1;
                text-align: center;
            }
            .breaking-close {
                font-family: 'Oxanium', sans-serif;
                font-size: 1.5rem;
                color: var(--gold-primary);
                cursor: pointer;
                padding: 0 10px;
                transition: opacity 0.3s;
            }
            .breaking-close:hover {
                opacity: 0.5;
            }
            @keyframes breakingSlideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes breakingBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(alertDiv2);
    
    const closeBtn = alertDiv2.querySelector('.breaking-close');
    closeBtn.addEventListener('click', () => {
        alertDiv2.style.animation = 'breakingSlideUp 0.3s ease-in forwards';
        setTimeout(() => alertDiv2.remove(), 300);
    });
    
    setTimeout(() => {
        if (alertDiv2.parentNode) {
            alertDiv2.style.animation = 'breakingSlideUp 0.3s ease-in forwards';
            setTimeout(() => alertDiv2.remove(), 300);
        }
    }, 8000);
}, 20000);

// ===== CURSOR EFFECT =====
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(196, 30, 30, 0.08), transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX - 100}px;
        top: ${e.clientY - 100}px;
        transition: opacity 0.5s;
    `;
    document.body.appendChild(cursor);
    setTimeout(() => {
        cursor.style.opacity = '0';
        setTimeout(() => cursor.remove(), 500);
    }, 100);
});

// ===== DAY COUNTER =====
function updateDayCounter() {
    const dayElement = document.querySelector('.day');
    if (dayElement) {
        const baseDate = new Date('1922-12-30');
        const now = new Date();
        const diff = Math.floor((now - baseDate) / (1000 * 60 * 60 * 24));
        dayElement.textContent = `ДЕНЬ ТРУДА №${diff.toLocaleString()}`;
    }
}
updateDayCounter();