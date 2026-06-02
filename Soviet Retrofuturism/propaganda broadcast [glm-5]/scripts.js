const SovietBroadcast = {
    tickerItems: [
        "★ ТОВАРИЩИ! СОВЕТСКИЙ КОСМОС РАСШИРЯЕТ ГРАНИЦЫ — НОВАЯ КОЛОНИЯ НА ТИТАНЕ УСПЕШНО ЗАВЕРШЕНА",
        "★ ПРОИЗВОДСТВО СИНТЕТИЧЕСКОГО ХЛЕБА ПРЕВЫСИЛО ПЛАН НА 147% — СЛАВА ТРУДЯЩИМСЯ",
        "★ ПЯТИЛЕТКА ВЫПОЛНЕНА ЗА 3 ГОДА — НОВЫЙ РЕКОРД СОЦИАЛИСТИЧЕСКОГО ТРУДА",
        "★ КОСМОНАВТ ИВАНОВА ВЕРНУЛАСЬ С МАРСА — ГЕРОЙ СОВЕТСКОГО СОЮЗА",
        "★ АВТОМАТИЗИРОВАННЫЕ ЗАВОДЫ ОБЕСПЕЧИЛИ ИЗБЫТОК ПРОДОВОЛЬСТВИЯ ДЛЯ ВСЕХ",
        "★ НОВОЕ ПОКОЛЕНИЕ КОЛЛЕКТИВНЫХ ЖИЛИЩ ПРИНИМАЕТ ПЕРВЫХ ЖИЛЬЦОВ",
        "★ СТАЛИНГРАДСКИЙ ТРАКТОРНЫЙ ЗАВОД ВЫПУСТИЛ МИЛЛИОННУЮ МАШИНУ",
        "★ КОМСОМОЛ ОТМЕЧАЕТ 100-ЛЕТИЕ — МОЛОДЁЖЬ ВЕДЁТ СТРАНУ В БУДУЩЕЕ",
        "★ ТЕПЛОВАЯ ЭЛЕКТРОСТАНЦИЯ В СИБИРИ ОБЕСПЕЧИЛА ЭНЕРГИЕЙ ДАЛЬНИЙ ВОСТОК",
        "★ НОВЫЙ РЕКОРД СКОРОСТИ НА ЖЕЛЕЗНОЙ ДОРОГЕ — МОСКВА-ВЛАДИВОСТОК ЗА 48 ЧАСОВ"
    ],

    headlines: [
        "ГЕРОИЧЕСКАЯ МИССИЯ НА ЕВРОПУ ЗАВЕРШЕНА ТРИУМФОМ",
        "ПЯТИЛЕТНИЙ ПЛАН ВЫПОЛНЕН ДОСРОЧНО",
        "НОВЫЙ СПУТНИК СВЯЗИ ОБЕСПЕЧИТ СВЯЗЬ СО ВСЕМИ РЕСПУБЛИКАМИ",
        "КОЛХОЗЫ ПРИНИМАЮТ УЧАСТИЕ В СОЦИАЛИСТИЧЕСКОМ СОРЕВНОВАНИИ",
        "УЧЁНЫЕ АКАДЕМИИ НАУК СОВЕРШИЛИ ПРОРЫВ В ТЕОРИИ МАТЕРИИ"
    ],

    statTargets: {
        population: 312,
        republics: 15,
        colonies: 7
    },

    init: function() {
        this.updateTime();
        this.updateDate();
        this.animateStatistics();
        this.setupTicker();
        this.addBroadcastEffects();
        this.startHeadlineRotation();
        this.addProgressAnimations();
        
        setInterval(() => this.updateTime(), 1000);
        setInterval(() => this.randomizeStatic(), 100);
    },

    updateTime: function() {
        const now = new Date();
        const moscowOffset = 3;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const moscowTime = new Date(utc + (3600000 * moscowOffset));
        
        const hours = String(moscowTime.getHours()).padStart(2, '0');
        const minutes = String(moscowTime.getMinutes()).padStart(2, '0');
        const seconds = String(moscowTime.getSeconds()).padStart(2, '0');
        
        const timeElement = document.getElementById('moscow-time');
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    },

    updateDate: function() {
        const now = new Date();
        const months = [
            'ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ',
            'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'
        ];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = `${day} ${month} ${year}`;
        }
    },

    animateStatistics: function() {
        this.animateValue('stat-population', 0, this.statTargets.population, 3000);
        this.animateValue('stat-republics', 0, this.statTargets.republics, 2000);
        this.animateValue('stat-colonies', 0, this.statTargets.colonies, 2500);
    },

    animateValue: function(elementId, start, end, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startTime = performance.now();
        const range = end - start;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (range * easeOutQuart));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    setupTicker: function() {
        const tickerContent = document.getElementById('ticker-content');
        if (!tickerContent) return;
        
        const items = Array.from(tickerContent.children);
        items.forEach(item => item.remove());
        
        this.tickerItems.forEach(text => {
            const span = document.createElement('span');
            span.className = 'ticker-item';
            span.textContent = text;
            tickerContent.appendChild(span);
        });
        
        for (let i = 0; i < 2; i++) {
            this.tickerItems.forEach(text => {
                const span = document.createElement('span');
                span.className = 'ticker-item';
                span.textContent = text;
                tickerContent.appendChild(span);
            });
        }
    },

    randomizeStatic: function() {
        const staticOverlay = document.querySelector('.static-overlay');
        if (!staticOverlay) return;
        
        if (Math.random() > 0.95) {
            staticOverlay.style.opacity = '0.08';
            setTimeout(() => {
                staticOverlay.style.opacity = '0.03';
            }, 50);
        }
    },

    addBroadcastEffects: function() {
        this.createGlitchEffect();
        this.addHoverSounds();
        this.createScanLineVariation();
    },

    createGlitchEffect: function() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch {
                0%, 100% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
            }
            
            .glitch-active {
                animation: glitch 0.3s ease-in-out;
            }
        `;
        document.head.appendChild(style);
        
        setInterval(() => {
            if (Math.random() > 0.97) {
                const elements = document.querySelectorAll('.state-title, .card-title');
                const randomElement = elements[Math.floor(Math.random() * elements.length)];
                if (randomElement) {
                    randomElement.classList.add('glitch-active');
                    setTimeout(() => {
                        randomElement.classList.remove('glitch-active');
                    }, 300);
                }
            }
        }, 500);
    },

    addHoverSounds: function() {
        const cards = document.querySelectorAll('.news-card, .worker-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.1s ease';
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                }, 100);
            });
        });
    },

    createScanLineVariation: function() {
        const scanLines = document.querySelector('.scan-lines');
        if (!scanLines) return;
        
        setInterval(() => {
            const opacity = 0.3 + (Math.random() * 0.2);
            scanLines.style.opacity = opacity.toString();
        }, 2000);
    },

    startHeadlineRotation: function() {
        let currentIndex = 0;
        const featuredTitle = document.querySelector('.news-featured .card-title');
        
        if (!featuredTitle) return;
        
        const originalText = featuredTitle.textContent;
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                featuredTitle.style.opacity = '0';
                featuredTitle.style.transform = 'translateY(-5px)';
                
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % this.headlines.length;
                    
                    if (Math.random() > 0.5) {
                        featuredTitle.textContent = this.headlines[currentIndex];
                    } else {
                        featuredTitle.textContent = originalText;
                    }
                    
                    featuredTitle.style.opacity = '1';
                    featuredTitle.style.transform = 'translateY(0)';
                }, 300);
            }
        }, 8000);
    },

    addProgressAnimations: function() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach((bar, index) => {
            const targetWidth = bar.style.getPropertyValue('--progress');
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = targetWidth;
            }, 500 + (index * 200));
        });
        
        const progressValues = document.querySelectorAll('.progress-value');
        progressValues.forEach((value, index) => {
            const targetValue = parseInt(value.textContent);
            value.textContent = '0%';
            
            this.animateProgressValue(value, 0, targetValue, 2000, index * 200);
        });
    },

    animateProgressValue: function(element, start, end, duration, delay) {
        setTimeout(() => {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + ((end - start) * easeOutQuart));
                
                element.textContent = current + '%';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }, delay);
    }
};

const BroadcastEnhancements = {
    init: function() {
        this.addTypewriterEffect();
        this.addParallaxStars();
        this.createSovietParticles();
        this.enhanceCards();
    },

    addTypewriterEffect: function() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes typewriter {
                from { width: 0; }
                to { width: 100%; }
            }
            
            @keyframes blink {
                50% { border-color: transparent; }
            }
            
            .typewriter-text {
                overflow: hidden;
                white-space: nowrap;
                border-right: 3px solid var(--gold-primary);
                animation: typewriter 3s steps(40) forwards, blink 0.75s step-end infinite;
            }
        `;
        document.head.appendChild(style);
    },

    addParallaxStars: function() {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'soviet-stars';
        starsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const opacity = Math.random() * 0.5 + 0.2;
            const delay = Math.random() * 5;
            
            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: #FFD700;
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                opacity: ${opacity};
                box-shadow: 0 0 ${size * 2}px #FFD700;
                animation: twinkle ${2 + Math.random() * 3}s ease-in-out ${delay}s infinite;
            `;
            starsContainer.appendChild(star);
        }
        
        document.body.appendChild(starsContainer);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    },

    createSovietParticles: function() {
        const particles = ['★', '☭', '✦', '◆'];
        let particleId = 0;
        
        setInterval(() => {
            if (Math.random() > 0.85) {
                const particle = document.createElement('div');
                particle.className = 'soviet-particle';
                particle.textContent = particles[Math.floor(Math.random() * particles.length)];
                particle.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 20 + 10}px;
                    color: #DAA520;
                    opacity: 0.6;
                    pointer-events: none;
                    z-index: 1000;
                    left: ${Math.random() * 100}vw;
                    top: -50px;
                    animation: particleFall ${5 + Math.random() * 5}s linear forwards;
                    text-shadow: 0 0 10px #FFD700;
                `;
                particle.id = `particle-${particleId++}`;
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 10000);
            }
        }, 500);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(110vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    },

    enhanceCards: function() {
        const cards = document.querySelectorAll('.news-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const border = card.querySelector('.card-border');
                if (border) {
                    border.style.animation = 'none';
                    setTimeout(() => {
                        border.style.animation = '';
                    }, 10);
                }
            });
        });
        
        const workerCards = document.querySelectorAll('.worker-card');
        workerCards.forEach(card => {
            card.addEventListener('click', () => {
                const badge = card.querySelector('.portrait-badge');
                if (badge) {
                    badge.style.animation = 'none';
                    badge.offsetHeight;
                    badge.style.animation = 'heroPulse 0.5s ease-out';
                }
            });
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes heroPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); background: #FFD700; }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
};

const LiveUpdates = {
    updateQueue: [],
    isUpdating: false,

    init: function() {
        this.scheduleRandomUpdate();
    },

    scheduleRandomUpdate: function() {
        const delay = 15000 + Math.random() * 30000;
        
        setTimeout(() => {
            this.addBreakingNews();
            this.scheduleRandomUpdate();
        }, delay);
    },

    addBreakingNews: function() {
        const breakingNews = [
            "СРОЧНО: НОВЫЙ РЕКОРД ПРОИЗВОДИТЕЛЬНОСТИ ТРУДА!",
            "СРОЧНО: УСПЕШНЫЙ ЗАПУСК РАКЕТЫ 'СОЮЗ-500'!",
            "СРОЧНО: КОЛХОЗ 'КРАСНЫЙ ОКТЯБРЬ' ПЕРЕВЫПОЛНИЛ ПЛАН!",
            "СРОЧНО: НОВОЕ ОТКРЫТИЕ В ОБЛАСТИ КВАНТОВОЙ ФИЗИКИ!",
            "СРОЧНО: МИРНЫЙ ДОГОВОР С КОСМИЧЕСКОЙ КОЛОНИЕЙ!"
        ];
        
        const randomNews = breakingNews[Math.floor(Math.random() * breakingNews.length)];
        
        const ticker = document.querySelector('.ticker-content');
        if (ticker) {
            const newSpan = document.createElement('span');
            newSpan.className = 'ticker-item';
            newSpan.textContent = '★ ' + randomNews;
            newSpan.style.cssText = `
                background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
                animation: highlight 2s ease-out;
            `;
            
            ticker.insertBefore(newSpan, ticker.firstChild);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes highlight {
                    0% { background: rgba(255, 215, 0, 0.5); }
                    100% { background: transparent; }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.flashLiveIndicator();
    },

    flashLiveIndicator: function() {
        const liveDot = document.querySelector('.live-dot');
        const liveLabel = document.querySelector('.broadcast-label');
        
        if (liveDot && liveLabel) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    liveDot.style.background = i % 2 === 0 ? '#FFD700' : '#E62222';
                    liveLabel.style.borderColor = i % 2 === 0 ? '#FFD700' : '#DAA520';
                }, i * 100);
            }
            
            setTimeout(() => {
                liveDot.style.background = '';
                liveLabel.style.borderColor = '';
            }, 500);
        }
    }
};

const AccessibilityEnhancements = {
    init: function() {
        this.addKeyboardNavigation();
        this.addReducedMotionSupport();
        this.addFocusStyles();
    },

    addKeyboardNavigation: function() {
        const interactiveElements = document.querySelectorAll('.news-card, .worker-card, .schedule-item');
        
        interactiveElements.forEach(element => {
            element.setAttribute('tabindex', '0');
            element.setAttribute('role', 'button');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    },

    addReducedMotionSupport: function() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (e) => {
            if (e.matches) {
                const style = document.createElement('style');
                style.textContent = `
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                    .scan-lines, .static-overlay, .broadcast-noise {
                        display: none;
                    }
                `;
                document.head.appendChild(style);
            }
        };
        
        handleReducedMotion(mediaQuery);
        mediaQuery.addEventListener('change', handleReducedMotion);
    },

    addFocusStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .news-card:focus,
            .worker-card:focus,
            .schedule-item:focus {
                outline: 3px solid #FFD700 !important;
                outline-offset: 2px;
            }
            
            .news-card:focus-visible,
            .worker-card:focus-visible {
                box-shadow: 0 0 0 4px rgba(218, 165, 32, 0.5);
            }
        `;
        document.head.appendChild(style);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SovietBroadcast.init();
    BroadcastEnhancements.init();
    LiveUpdates.init();
    AccessibilityEnhancements.init();
    
    console.log('%c☭ ГЛАВНОЕ УПРАВЛЕНИЕ ЗАГРУЖЕНО ☭', 
        'color: #DAA520; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #FFD700;');
    console.log('%cСЛАВА СОВЕТСКОМУ СОЮЗУ!', 
        'color: #CC0000; font-size: 14px;');
});