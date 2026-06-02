/* ============================================
   СОВКОСМОС — SOVSPACE NEWS NETWORK
   Soviet Retrofuturist Propaganda Broadcast
   Interactive Systems & Animations
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // SOVIET CALENDAR SYSTEM
    // ============================================
    const SovietCalendar = {
        months: [
            'ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ',
            'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'
        ],
        
        revolutionaryDates: [
            { day: 7, month: 11, event: 'ВЕЛИКАЯ ОКТЯБРЬСКАЯ СОЦИАЛИСТИЧЕСКАЯ РЕВОЛЮЦИЯ' },
            { day: 1, month: 0, event: 'НОВЫЙ ГОД — ДЕНЬ МИРА И ДРУЖБЫ' },
            { day: 8, month: 2, event: 'МЕЖДУНАРОДНЫЙ ЖЕНСКИЙ ДЕНЬ' },
            { day: 1, month: 4, event: 'ПРАЗДНИК ВЕСНЫ И ТРУДА' },
            { day: 9, month: 4, event: 'ДЕНЬ ПОБЕДЫ' },
            { day: 12, month: 4, event: 'ДЕНЬ КОСМОНАВТИКИ' },
            { day: 7, month: 10, event: 'ДЕНЬ ПОЛИЦИИ' }
        ],

        getRevolutionYear() {
            const now = new Date();
            const revolutionDate = new Date(1917, 10, 7); // October Revolution
            let years = now.getFullYear() - 1917;
            // Adjust if we haven't reached the anniversary yet this year
            const thisYear = new Date(1917 + years, 10, 7);
            if (now < thisYear) years--;
            return years;
        },

        formatSovietDate() {
            const now = new Date();
            const day = now.getDate();
            const month = this.months[now.getMonth()];
            const revolutionYear = this.getRevolutionYear();
            
            return `${day} ${month} ${revolutionYear} ГОДА ПОСЛЕ ВЕЛИКОЙ РЕВОЛЮЦИИ`;
        },

        formatGregorianDate() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return now.toLocaleDateString('ru-RU', options).toUpperCase();
        },

        getTodayRevolutionaryEvent() {
            const now = new Date();
            const day = now.getDate();
            const month = now.getMonth();
            
            return this.revolutionaryDates.find(
                event => event.day === day && event.month === month
            );
        }
    };

    // ============================================
    // LIVE TICKER SYSTEM
    // ============================================
    const TickerSystem = {
        headlines: [
            '★ ПРЕЗИДИУМ ВЕРХОВНОГО СОВЕТА ОБЪЯВЛЯЕТ: ПРОИЗВОДСТВО ТИТАНА НА ЦЕЛЕВОЙ ЛУНЕ УВЕЛИЧЕНО НА 340% — ПОБЕДА ПЯТИЛЕТКИ! ★',
            '★ КОСМОДРОМ БАЙКОНУР-2: ЗАПУЩЕН НОВЫЙ ЗВЁЗДОЛОТ «ПРОЛЕТАРИЙ-12» К ОРБИТЕ САТУРНА — ЭКИПАЖ 247 ТОВАРИЩЕЙ ★',
            '★ МИНИСТЕРСТВО ПРОДОВОЛЬСТВА СООБЩАЕТ: УРОЖАЙ КЛУБНИКИ В БАЙОМЕТРИЧЕСКИХ ТЕПЛИЦАХ МАРСА ПРЕВЫСИЛ ПЛАН НА 512% ★',
            '★ ЦЕНТРАЛЬНЫЙ КОМИТЕТ ПОЗДРАВЛЯЕТ ТРУДЯЩИХСЯ ЗАВОДА «КРАСНЫЙ ПРОЛЕТАРИЙ» С ДОСРОЧНЫМ ВЫПОЛНЕНИЕМ ГОДОВОГО ЗАДАНИЯ ★',
            '★ НОВЫЙ РЕКОРД: РАДИОТЕЛЕСКОП «ЛЕНИН-9» ЗАФИКСИРОВАЛ СИГНАЛ ОТ ЗВЁЗДНОЙ СИСТЕМЫ ГЛЯЦА-77 — ВОЗМОЖНА ЦИВИЛИЗАЦИЯ ★',
            '★ ПАРТИЙНЫЙ СЪЕЗД УТВЕРДИЛ ПЛАН КОЛОНИЗАЦИИ ПОЯСА АСТЕРОИДОВ К 1995 ГОДУ — ДА ЗДРАВСТВУЕТ КОММУНИЗМ! ★',
            '★ ЭКИПАЖ СТАНЦИИ «МЕЧТА-7» ЗАВЕРШИЛ СТРОИТЕЛЬСТВО ПЕРВОЙ ОРБИТАЛЬНОЙ ФАБРИКИ НЕЙТРОНИЕВОГО МЕТАЛЛА ★',
            '★ ТОВАРИЩ ГЕНЕРАЛЬНЫЙ СЕКРЕТАРЬ ПОЗДРАВЛЯЕТ РАБОЧИХ С ПРЕВЫШЕНИЕМ ГОДОВОГО ПЛАНА НА 278% ★',
            '★ НАУЧНЫЙ ИНСТИТУТ ИМЕНИ ЛЕНИНА ОТКРЫЛ НОВЫЙ ВИД ЭНЕРГИИ — «ПАРТИЙНАЯ ВОЛЯ» — КПД 3400% ★',
            '★ КОРАБЛЬ «СОВЕТСКАЯ ВОЛЯ» УСПЕШНО СОВЕРШИЛ ПОСАДКУ НА ТИТАНЕ — НАЧАТО СТРОИТЕЛЬСТВО БАЗЫ №1 ★',
            '★ ТРУДЯЩИЕСЯ МОСКВЫ ПЕРЕВЫПОЛНИЛИ ПЛАН ПО ШВЕЙНОМУ ПРОИЗВОДСТВУ КОСМИЧЕСКИХ СКУФОВ НА 500% ★',
            '★ РАДОСТНАЯ ВЕСТЬ: КОЛОНИЯ «ПРОЛЕТАРИЙ-3» НА ЮПИТЕРЕ ДОСТИГЛА САМОДОСТАТОЧНОСТИ ★',
            '★ ВЕРХОВНЫЙ СОВЕТ ОБЪЯВЛЯЕТ: СЛЕДУЮЩАЯ ПЯТИЛЕТКА ПОСВЯЩЕНА КОЛОНИЗАЦИИ ГАЛАКТИКИ ★',
            '★ ШАХТЁРЫ АСТЕРОИДА «КРАСНЫЙ ОКТЯБРЬ» ДОБЫЛИ РЕКОРДНОЕ КОЛИЧЕСТВО РЕДКИХ ЗЕМЕЛЬ ★'
        ],

        currentIndex: 0,
        tickerElement: null,

        init() {
            this.tickerElement = document.getElementById('tickerContent');
            if (this.tickerElement) {
                // Periodically add new headlines
                setInterval(() => this.addNewHeadline(), 45000);
            }
        },

        addNewHeadline() {
            if (!this.tickerElement) return;
            
            const randomHeadline = this.headlines[Math.floor(Math.random() * this.headlines.length)];
            const newSpan = document.createElement('span');
            newSpan.className = 'ticker-item';
            newSpan.textContent = randomHeadline;
            
            this.tickerElement.appendChild(newSpan);
            
            // Keep ticker manageable
            const items = this.tickerElement.querySelectorAll('.ticker-item');
            if (items.length > 20) {
                items[0].remove();
            }
        }
    };

    // ============================================
    // FIVE YEAR PLAN PROGRESS ANIMATION
    // ============================================
    const PlanProgress = {
        init() {
            const planBars = document.querySelectorAll('.plan-bar');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateBar(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            planBars.forEach(bar => observer.observe(bar));
        },

        animateBar(bar) {
            const progress = parseInt(bar.dataset.progress) || 0;
            bar.style.setProperty('--target-width', `${progress}%`);
            
            setTimeout(() => {
                bar.classList.add('animated');
            }, 200);
        }
    };

    // ============================================
    // VIEW COUNT ANIMATION
    // ============================================
    const ViewCounter = {
        targetCount: 847293441,
        element: null,
        currentCount: 0,

        init() {
            this.element = document.getElementById('viewCount');
            if (this.element) {
                this.animateCount();
                // Slowly increment count
                setInterval(() => this.incrementCount(), 3000);
            }
        },

        animateCount() {
            const duration = 2000;
            const startTime = performance.now();
            const startCount = 0;

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                this.currentCount = Math.floor(startCount + (this.targetCount - startCount) * easeOut);
                
                this.updateDisplay();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        },

        incrementCount() {
            const increment = Math.floor(Math.random() * 1000) + 500;
            this.currentCount += increment;
            this.updateDisplay();
        },

        updateDisplay() {
            if (this.element) {
                this.element.textContent = this.currentCount.toLocaleString('ru-RU');
            }
        }
    };

    // ============================================
    // ACHIEVEMENT COUNTER ANIMATION
    // ============================================
    const AchievementCounter = {
        init() {
            const statElements = document.querySelectorAll('.achievement-stat');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStat(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            statElements.forEach(stat => observer.observe(stat));
        },

        animateStat(element) {
            const text = element.textContent;
            const targetNumber = parseInt(text.replace(/,/g, ''));
            
            if (isNaN(targetNumber)) return; // Skip non-numeric (like ∞)

            const duration = 1500;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                const currentCount = Math.floor(targetNumber * easeOut);
                element.textContent = currentCount.toLocaleString('ru-RU');

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = targetNumber.toLocaleString('ru-RU');
                }
            };

            requestAnimationFrame(animate);
        }
    };

    // ============================================
    // CRT GLITCH EFFECTS
    // ============================================
    const CRTEffects = {
        init() {
            // Random glitch effect
            setInterval(() => this.triggerGlitch(), 8000 + Math.random() * 15000);
            
            // Occasional static burst
            setInterval(() => this.staticBurst(), 12000 + Math.random() * 20000);
        },

        triggerGlitch() {
            const overlay = document.querySelector('.crt-overlay');
            if (!overlay) return;

            overlay.style.animation = 'none';
            overlay.offsetHeight; // Trigger reflow
            
            // Add glitch colors
            overlay.style.background = `
                repeating-linear-gradient(
                    0deg,
                    rgba(255, 0, 0, 0.1) 0px,
                    rgba(0, 255, 0, 0.05) 1px,
                    rgba(0, 0, 255, 0.1) 2px,
                    transparent 3px,
                    transparent 4px
                )
            `;

            setTimeout(() => {
                overlay.style.background = '';
                overlay.style.animation = '';
            }, 100 + Math.random() * 150);
        },

        staticBurst() {
            const staticNoise = document.querySelector('.static-noise');
            if (!staticNoise) return;

            staticNoise.style.opacity = '0.15';
            staticNoise.style.animationDuration = '0.1s';

            setTimeout(() => {
                staticNoise.style.opacity = '0.03';
                staticNoise.style.animationDuration = '';
            }, 100 + Math.random() * 100);
        }
    };

    // ============================================
    // DISPATCH CARD HOVER EFFECTS
    // ============================================
    const CardEffects = {
        init() {
            const cards = document.querySelectorAll('.dispatch-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => this.onCardHover(card));
                card.addEventListener('mouseleave', () => this.onCardLeave(card));
            });
        },

        onCardHover(card) {
            // Add subtle scan line effect
            const scanLine = document.createElement('div');
            scanLine.className = 'card-scan-line';
            scanLine.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, ${Math.random() > 0.5 ? 'var(--gold-bright)' : 'var(--red-bright)'}, transparent);
                z-index: 10;
                animation: scanDown 0.8s ease-out forwards;
                pointer-events: none;
            `;
            card.appendChild(scanLine);

            setTimeout(() => scanLine.remove(), 800);
        },

        onCardLeave(card) {
            // Clean up any remaining effects
            const scanLines = card.querySelectorAll('.card-scan-line');
            scanLines.forEach(line => line.remove());
        }
    };

    // Add scan animation to document
    const scanStyle = document.createElement('style');
    scanStyle.textContent = `
        @keyframes scanDown {
            0% { top: 0; opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
    `;
    document.head.appendChild(scanStyle);

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const ScrollReveal = {
        init() {
            const elements = document.querySelectorAll(
                '.dispatch-card, .plan-item, .achievement-card, .quote-frame'
            );

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }
    };

    // ============================================
    // AMBIENT PARTICLE SYSTEM
    // ============================================
    const ParticleSystem = {
        canvas: null,
        ctx: null,
        particles: [],
        maxParticles: 30,

        init() {
            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                opacity: 0.4;
            `;
            document.body.appendChild(this.canvas);
            
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.createParticles();
            this.animate();

            window.addEventListener('resize', () => this.resize());
        },

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        createParticles() {
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: Math.random() * 0.5 + 0.1,
                    opacity: Math.random() * 0.5 + 0.2,
                    color: Math.random() > 0.7 ? '#FFD700' : '#B71C1C'
                });
            }
        },

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around screen
                if (p.y > this.canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * this.canvas.width;
                }
                if (p.x > this.canvas.width) p.x = 0;
                if (p.x < 0) p.x = this.canvas.width;

                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.fill();
            });

            this.ctx.globalAlpha = 1;
            requestAnimationFrame(() => this.animate());
        }
    };

    // ============================================
    // BROADCAST SIGNAL FLUCTUATION
    // ============================================
    const SignalSystem = {
        bars: null,

        init() {
            this.bars = document.querySelectorAll('.signal-bars .bar');
            if (this.bars.length) {
                setInterval(() => this.fluctuate(), 2000);
            }
        },

        fluctuate() {
            this.bars.forEach(bar => {
                const randomHeight = Math.random() * 0.4 + 0.6;
                bar.style.transform = `scaleY(${randomHeight})`;
                bar.style.transition = 'transform 0.3s ease';
            });
        }
    };

    // ============================================
    // TEMPERATURE DISPLAY (Moon Base)
    // ============================================
    const TemperatureDisplay = {
        init() {
            const tempValue = document.querySelector('.temp-value');
            if (!tempValue) return;

            setInterval(() => {
                // Simulate lunar temperature variations
                const baseTemp = 23;
                const variation = Math.floor(Math.random() * 5) - 2;
                tempValue.textContent = `+${baseTemp + variation}°C`;
            }, 10000);
        }
    };

    // ============================================
    // DYNAMIC HEADLINE EFFECT
    // ============================================
    const HeadlineEffect = {
        init() {
            const headlineLine2 = document.querySelector('.headline-line2');
            if (!headlineLine2) return;

            // Add subtle glow pulse
            setInterval(() => {
                headlineLine2.style.textShadow = `
                    3px 3px 0 var(--red-dark),
                    0 0 ${30 + Math.random() * 20}px rgba(255, 215, 0, ${0.3 + Math.random() * 0.2})
                `;
            }, 2000);
        }
    };

    // ============================================
    // REVOLUTIONARY DATE BANNER
    // ============================================
    const RevolutionaryBanner = {
        init() {
            const event = SovietCalendar.getTodayRevolutionaryEvent();
            if (event) {
                this.showBanner(event.event);
            }
        },

        showBanner(eventName) {
            const banner = document.createElement('div');
            banner.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: linear-gradient(135deg, var(--red-primary), var(--red-dark));
                border: 4px solid var(--gold-bright);
                padding: 30px 50px;
                z-index: 10000;
                text-align: center;
                box-shadow: 0 0 100px rgba(183, 28, 28, 0.8);
                transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            `;

            banner.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 15px; color: var(--gold-bright);">★</div>
                <div style="font-family: var(--font-headline); font-size: 1.2rem; color: var(--gold-bright); letter-spacing: 0.2em; margin-bottom: 10px;">
                    СЕГОДНЯ ПРАЗДНУЕМ
                </div>
                <div style="font-family: var(--font-headline); font-size: 1.8rem; color: white; letter-spacing: 0.1em;">
                    ${eventName}
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--gold-pale); margin-top: 15px; letter-spacing: 0.15em;">
                    СЛАВА ПАРТИИ! СЛАВА СОВЕТСКОМУ НАРОДУ!
                </div>
            `;

            document.body.appendChild(banner);

            setTimeout(() => {
                banner.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 100);

            setTimeout(() => {
                banner.style.transform = 'translate(-50%, -50%) scale(0)';
                setTimeout(() => banner.remove(), 500);
            }, 4000);
        }
    };

    // ============================================
    // KEYBOARD EASTER EGG
    // ============================================
    const EasterEgg = {
        sequence: [],
        targetSequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],

        init() {
            document.addEventListener('keydown', (e) => {
                this.sequence.push(e.key);
                if (this.sequence.length > 10) {
                    this.sequence.shift();
                }
                
                if (JSON.stringify(this.sequence) === JSON.stringify(this.targetSequence)) {
                    this.trigger();
                    this.sequence = [];
                }
            });
        },

        trigger() {
            // Create special broadcast
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--black-void);
                z-index: 10001;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.5s ease;
            `;

            overlay.innerHTML = `
                <div style="font-size: 5rem; animation: star-pulse 1s ease-in-out infinite;">★</div>
                <div style="font-family: var(--font-headline); font-size: 2rem; color: var(--gold-bright); letter-spacing: 0.3em; margin-top: 20px;">
                    СЕКРЕТНОЕ СООБЩЕНИЕ
                </div>
                <div style="font-family: var(--font-body); font-size: 1.2rem; color: var(--cream-pale); margin-top: 20px; max-width: 500px; text-align: center; line-height: 1.8;">
                    Товарищ! Вы обнаружили скрытый канал связи Партии.<br>
                    Продолжайте вносить свой вклад в дело Коммунизма!
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--gray-light); margin-top: 30px;">
                    Нажмите ЛЮБУЮ КЛАВИШУ для продолжения трансляции
                </div>
            `;

            document.body.appendChild(overlay);

            const closeHandler = () => {
                overlay.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => overlay.remove(), 500);
                document.removeEventListener('keydown', closeHandler);
                document.removeEventListener('click', closeHandler);
            };

            document.addEventListener('keydown', closeHandler, { once: true });
            document.addEventListener('click', closeHandler, { once: true });
        }
    };

    // Add fade animations
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeStyle);

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Set dates
        const sovietDateEl = document.getElementById('sovietDate');
        const gregorianDateEl = document.getElementById('gregorianDate');
        
        if (sovietDateEl) {
            sovietDateEl.textContent = SovietCalendar.formatSovietDate();
        }
        if (gregorianDateEl) {
            gregorianDateEl.textContent = SovietCalendar.formatGregorianDate();
        }

        // Initialize all systems
        TickerSystem.init();
        PlanProgress.init();
        ViewCounter.init();
        AchievementCounter.init();
        CRTEffects.init();
        CardEffects.init();
        ScrollReveal.init();
        ParticleSystem.init();
        SignalSystem.init();
        TemperatureDisplay.init();
        HeadlineEffect.init();
        EasterEgg.init();
        
        // Delayed initialization for special features
        setTimeout(() => {
            RevolutionaryBanner.init();
        }, 2000);

        console.log('%c★ СОВКОСМОС NEWS NETWORK ★', 
            'background: #B71C1C; color: #FFD700; font-size: 20px; font-weight: bold; padding: 10px 20px;');
        console.log('%cВЕСТИ БУДУЩЕГО ИЗ НАШЕГО НАСТОЯЩЕГО', 
            'color: #C8A400; font-size: 12px;');
        console.log('%cТРАНСЛЯЦИЯ АКТИВНА • ЧАСТОТА 147.3 МГц', 
            'color: #33FF33; font-size: 10px;');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();