/* ═══════════════════════════════════════════════════════════════
   Голос Страны — Soviet Retrofuturist Broadcast JavaScript
   Powering the live broadcast experience
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Utility Helpers ──────────────────────────────────── */
    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return document.querySelectorAll(sel); }
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function pick(arr) { return arr[rand(0, arr.length - 1)]; }

    /* ═══════════════════════════════════════════════════════
       1. LIVE CLOCK
       ═══════════════════════════════════════════════════════ */
    const MONTHS = [
        'ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ',
        'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'
    ];
    const DAYS = [
        'ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА',
        'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА'
    ];

    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        $('#current-time').textContent = `${h}:${m}:${s}`;

        const dayName = DAYS[now.getDay()];
        const date = now.getDate();
        const month = MONTHS[now.getMonth()];
        const year = now.getFullYear();
        $('#current-date').textContent = `${dayName}, ${date} ${month} ${year} Г.`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    /* ═══════════════════════════════════════════════════════
       2. NEWS TICKER — Seamless scrolling
       ═══════════════════════════════════════════════════════ */
    function initTicker() {
        const track = $('#ticker-track');
        // Clone all items for seamless loop
        const items = track.querySelectorAll('.ticker-item, .ticker-separator');
        const fragment = document.createDocumentFragment();
        items.forEach(item => fragment.appendChild(item.cloneNode(true)));
        track.appendChild(fragment);
    }
    initTicker();

    /* ═══════════════════════════════════════════════════════
       3. CRT STATIC CANVAS
       ═══════════════════════════════════════════════════════ */
    function initStatic() {
        const canvas = $('#static-canvas');
        const ctx = canvas.getContext('2d');
        let active = false;
        let timeout = null;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function drawStatic() {
            if (!active) return;
            const w = canvas.width;
            const h = canvas.height;
            const imageData = ctx.createImageData(w, h);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const val = Math.random() * 255;
                data[i] = val;
                data[i + 1] = val;
                data[i + 2] = val;
                data[i + 3] = 40;
            }
            ctx.putImageData(imageData, 0, 0);
            timeout = requestAnimationFrame(drawStatic);
        }

        // Randomly trigger static bursts
        function burstStatic() {
            active = true;
            canvas.classList.add('active');
            drawStatic();
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                active = false;
                canvas.classList.remove('active');
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                scheduleNextBurst();
            }, rand(200, 800));
        }

        function scheduleNextBurst() {
            setTimeout(burstStatic, rand(3000, 12000));
        }
        scheduleNextBurst();
    }
    initStatic();

    /* ═══════════════════════════════════════════════════════
       4. RANDOM GLITCH EFFECTS
       ═══════════════════════════════════════════════════════ */
    function initGlitch() {
        const bar1 = $('#glitch-bar-1');
        const bar2 = $('#glitch-bar-2');

        function triggerGlitch(bar) {
            bar.style.opacity = '1';
            bar.style.transform = `translateX(${rand(-50, 50)}px) skewX(${rand(-5, 5)}deg)`;
            setTimeout(() => {
                bar.style.opacity = '0';
                bar.style.transform = '';
            }, rand(50, 200));
        }

        function randomGlitch() {
            const which = Math.random() > 0.5 ? bar1 : bar2;
            triggerGlitch(which);
            setTimeout(randomGlitch, rand(2000, 8000));
        }
        randomGlitch();
    }
    initGlitch();

    /* ═══════════════════════════════════════════════════════
       5. FIVE-YEAR PLAN PROGRESS BARS
       ══════════════════════════════════════════════════════ */
    function initPlanBars() {
        const bars = $$('.plan-bar-fill');
        // Stagger the animation start
        bars.forEach((bar, i) => {
            setTimeout(() => {
                const target = bar.getAttribute('data-target');
                bar.style.width = target + '%';
            }, 300 + i * 200);
        });
    }
    // Intersection Observer: animate when plan panel enters viewport
    function observePlanBars() {
        const planPanel = $('.plan-panel');
        if (!planPanel) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initPlanBars();
                    observer.unobserve(planPanel);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(planPanel);
    }
    observePlanBars();

    /* ═══════════════════════════════════════════════════════
       6. SIGNAL STRENGTH RANDOMIZER
       ═══════════════════════════════════════════════════════ */
    function animateSignalBars() {
        const bars = $$('#signal-bars .bar');
        setInterval(() => {
            bars.forEach(bar => {
                const h = rand(30, 100);
                bar.style.height = h + '%';
                bar.style.background = h > 80
                    ? 'var(--gold-bright)'
                    : h > 50
                        ? 'var(--gold)'
                        : 'var(--gold-dark)';
            });
        }, 2000);
    }
    animateSignalBars();

    /* ═══════════════════════════════════════════════════════
       7. COSMONAUT ROTATION
       ═══════════════════════════════════════════════════════ */
    function initCosmonautRotation() {
        const cosmonauts = [
            {
                initials: 'А.К.',
                name: 'Тов. Александр Кедров',
                rank: 'Капитан 1-го ранга космического флота',
                achievement: 'Заслуженный пилот-испытатель. Награждён орденом Ленина 7 раз.',
                flightHours: '4,821',
                missions: '14',
                awards: '28',
                quote: '«Каждый рассвет, виденный с орбиты, напоминает мне: наша Родина — самый прекрасный красный шар во вселенной.»'
            },
            {
                initials: 'В.Т.',
                name: 'Тов. Виктория Троицкая',
                rank: 'Полковник космических войск',
                achievement: 'Командир первой межзвёздной экспедиции. Отличник науки и техники.',
                flightHours: '6,210',
                missions: '19',
                awards: '35',
                quote: '«Космос не знает границ — как и наша революционная воля. Мы летим дальше, чтобы доказать: коммунизм — вселенская истина.»'
            },
            {
                initials: 'М.Р.',
                name: 'Тов. Михаил Разумов',
                rank: 'Генерал-лейтенант космического флота',
                achievement: 'Начальник штаба межзвёздных операций. Герой Советского Союза × 3.',
                flightHours: '8,905',
                missions: '27',
                awards: '52',
                quote: '«Каждый наш корабль — это пламя революции, несущее свет рабочего класса через бездну космоса.»'
            },
            {
                initials: 'Н.С.',
                name: 'Тов. Наталья Степанова',
                rank: 'Капитан 2-го ранга космического флота',
                achievement: 'Первый женщина-космонавт на Титане. Лауреат Ленинской премии.',
                flightHours: '3,456',
                missions: '11',
                awards: '19',
                quote: '«На спутниках Сатурна мы нашли доказательства того, что труд делает нас людьми — где бы мы ни были.»'
            }
        ];

        let current = 0;
        const avatar = $('#cosmonaut-avatar');
        const nameEl = $('#cosmonaut-name');
        const rankEl = $('#cosmonaut-rank');
        const achievementEl = $('#cosmonaut-achievement');
        const quoteEl = $('#cosmonaut-quote');
        const flightEl = $('#cstat-flighthours');
        const missionsEl = $('#cstat-missions');
        const awardsEl = $('#cstat-awards');

        function rotateCosmonaut() {
            current = (current + 1) % cosmonauts.length;
            const c = cosmonauts[current];

            // Fade out
            avatar.style.opacity = '0';
            nameEl.style.opacity = '0';
            rankEl.style.opacity = '0';
            achievementEl.style.opacity = '0';
            quoteEl.style.opacity = '0';

            setTimeout(() => {
                avatar.querySelector('.avatar-placeholder').textContent = c.initials;
                nameEl.textContent = c.name;
                rankEl.textContent = c.rank;
                achievementEl.textContent = c.achievement;
                quoteEl.textContent = c.quote;
                flightEl.textContent = c.flightHours;
                missionsEl.textContent = c.missions;
                awardsEl.textContent = c.awards;

                // Randomize initials color
                const colors = ['var(--gold)', '#FF6B6B', '#6BCB77', '#9B8EFF', '#FFD93D'];
                avatar.querySelector('.avatar-placeholder').style.color = pick(colors);

                // Fade in
                avatar.style.opacity = '1';
                nameEl.style.opacity = '1';
                rankEl.style.opacity = '1';
                achievementEl.style.opacity = '1';
                quoteEl.style.opacity = '1';
            }, 500);
        }

        // Rotate every 8 seconds
        setInterval(rotateCosmonaut, 8000);
    }
    initCosmonautRotation();

    /* ═══════════════════════════════════════════════════════
       8. STATISTICS COUNTER ANIMATION
       ═══════════════════════════════════════════════════════ */
    function animateCounters() {
        const statNumbers = $$('.stat-number');
        statNumbers.forEach(el => {
            const text = el.textContent;
            // Try to parse number
            const match = text.match(/^([^\d]*)([\d.,]+)(.*)$/);
            if (!match) return;

            const prefix = match[1];
            const numStr = match[2];
            const suffix = match[3];
            const target = parseFloat(numStr.replace(',', '.'));
            const isBillions = text.includes('B');
            const isPercent = text.includes('%');

            let current = 0;
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = target * eased;

                if (isBillions) {
                    el.textContent = prefix + (value / 1).toFixed(2) + 'B' + suffix;
                } else if (isPercent) {
                    el.textContent = prefix + Math.round(value) + '%' + suffix;
                } else {
                    el.textContent = prefix + Math.round(value).toLocaleString() + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = text; // Set final exact value
                }
            }
            requestAnimationFrame(update);
        });
    }

    // Observe stats panel for counter animation
    function observeStats() {
        const statsPanel = $('.stats-panel');
        if (!statsPanel) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(statsPanel);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsPanel);
    }
    observeStats();

    /* ═══════════════════════════════════════════════════════
       9. MODAL SYSTEM — Click news cards to read full dispatch
       ═══════════════════════════════════════════════════════ */
    const dispatches = {
        card1: {
            badge: 'ДЕЛО N° 47-Γ',
            title: 'КОСМИЧЕСКАЯ ЭСКАДРИЛА ПРОСЛАВИЛА РОДИНУ',
            body: `
                <h4>В ОДИНАДЦАТЫЙ ЧАС ДНЯ ЭСКАДРИЛА «СЕРП-МОЛОТ» ВОЗВЕДЁНА КРАСНОЕ ЗНАМЯ НА ЭРИДАНЕ</h4>
                <p>В беспрецедентной операции, продлившейся 47 стандартных суток, эскадрилья из двенадцати космических кораблей класса «Октябрь» преодолела расстояние в 142 астрономических единиц, проникнув за пределы Солнечной системы.</p>
                <div class="dispatch-quote">«Мы водрузили знамя победы на поверхность Эридана! Пусть весь мир знает: советский космос не знает границ!» — Командир эскадрильи, Герой Советского Союза, Тов. Алексей Щербаков</div>
                <p>Экипажи совершили посадку на поверхность карликовой планеты, где были установлены научные станции и памятник Великому Вождю. Пробы на Эридане подтвердили наличие редчайших минералов, которые будут использованы для развития советской промышленности.</p>
                <h4>ДЕТАЛИ МИССИИ</h4>
                <p><strong>Дата старта:</strong> 14 октября 2075 года<br>
                <strong>Экипаж:</strong> 36 космонавтов, включая 4 члена-корреспондента АН СССР<br>
                <strong>Дистанция:</strong> 142,4 а.е. (21,27 млрд км)<br>
                <strong>Время в пути:</strong> 47 суток при светеходном двигателе «Ленин-7»<br>
                <strong>Знамя:</strong> Красное Знамя, боевая реликвия Московского Кремля</p>
                <h4>МЕЖДУНАРОДНАЯ РЕАКЦИЯ</h4>
                <p>Правительства всех социалистических планет выразили полную солидарность. Капиталистические островки, как ожидается, будут вынуждены признать величие советской науки в течение ближайшего квартала.</p>
            `
        },
        card2: {
            badge: 'ДЕЛО ПРОМЫШЛЕННОСТИ N° 112-Δ',
            title: 'ЗАВОД «АВРИЛА-12» ДОСТИГ 10 МИЛЛИАРДНОГО РЕКОРДА',
            body: `
                <h4>ГОСУДАРСТВЕННЫЙ ПЛАН НАБЕГА ПЕРЕВЫПОЛНЕН НА 37%</h4>
                <p>Гигантский завод «Аврила-12», расположенный на орбите Венеры, произвёл 10-миллиардный экземпляр бытового дроида-помощника модели «Товарищ-3». Это событие стало символом победы советской автоматизации.</p>
                <div class="dispatch-quote">«Каждый советский дом — по три дроида. И каждый из них трудится самоотверженно, как и его хозяин. Это — дети нашего социализма!» — Министр Автоматизации Тов. Зуев К.А.</div>
                <h4>ХАРАКТЕРИСТИКА МОДЕЛИ</h4>
                <p><strong>«Товарищ-3»:</strong> 2,4 метра высотой, 14-ядерный процессор «Москва-9», способен к самостоятельному приготовлению 4700 блюд народов СССР, поддерживает 214 диалектов, имеет встроенный агитмодуль для утренней разминки.</p>
                <h4>ЭКСПОРТ</h4>
                <p>Дроиды модели «Товарищ-3» уже работают на колониях Марса, Луне, спутниках Юпитера и Сатурна. Ведутся переговоры о поставках в Коммунистическую Федерацию Альфа Центавра.</p>
            `
        },
        card3: {
            badge: 'ДЕЛО СПОРТА N° 12-Ω',
            title: 'ОРАБИТАЛЬНЫЙ ФУТБОЛ: 14-ЫЙ РАЗ ПОДРЯД',
            body: `
                <h4>ФИНАЛ НА СТАДИОНЕ «ЦЕНТРАЛЬНЫЙ КОСМОДРОМ»</h4>
                <p>Финальный матч чемпионата Солнечной системы по орбитальному футболу стал триумфом советской спортивной школы. Сборная СССР одержала блестящую победу со счётом 12:0, забив 4 гола голыми головами в невесомости.</p>
                <div class="dispatch-quote">«Наши парни тренируются в невесомости каждый день. Когда ты умеешь летать и забивать головой одновременно — противник бессилен!» — Капитан сборной, Тов. Дмитрий «Метеор» Соколов</div>
                <h4>СТАТИСТИКА МАТЧА</h4>
                <p><strong>Удары по воротам:</strong> СССР 47 — Галактический Союз 3<br>
                <strong>Владение мячом:</strong> СССР 78% — Галактический Союз 22%<br>
                <strong>Зрителей трансляция:</strong> 2,4 миллиарда во вселенной<br>
                <strong>Лучший бомбардир:</strong> Тов. Соколов — 5 голов</p>
                <h4>СЛЕДУЮЩИЙ МАТЧ</h4>
                <p>Суперфинал против команды Андромеды состоится 1 марта 2076 года. Билеты распроданы за 0.3 орбитальных секунды.</p>
            `
        },
        card4: {
            badge: 'ДЕЛО АГРОПРОМА N° 88-Φ',
            title: 'КОЛХОЗ «ЗАРЯ КОСМОСА» НА ГАНИМЕДЕ — РЕКОРД УРОЖАЙНОСТИ',
            body: `
                <h4>42 ТОННЫ С ГЕКТАРА НА ЛЕДЯНОЙ ГАНИМЕДЕ</h4>
                <p>Колхоз «Заря Космоса» под руководством тов. Ивановой М.П. установил абсолютный рекорд урожайности, вырастив 42 тонны модифицированной пшеницы «Марс-7» на одном гектаре ледяной поверхности спутника Юпитера.</p>
                <div class="dispatch-quote">«Мы доказали, что советский агроном может расти́ть хлеб в любых условиях — будь то вечная мерзлота Сибири или лёд Ганимеда. Труд победит всё!» — Тов. Иванова М.П., Герой Социалистического Труда</div>
                <h4>ТЕХНОЛОГИЯ</h4>
                <p>Применён новый вид удобрений «Агрокосмос-12», разработанный Академией Наук. Содержит наночастицы лунного реголита и бактериальную культуру, синтезированную в условиях микрогравитации. Европейские фермеры уже признали превосходство советской агрономии.</p>
                <h4>БЛАГОДАРНОСТЬ ПАРТИИ</h4>
                <p>Колхоз третий год подряд получает орден Ленина. Рабочий коллектив направил тов. Генеральному письмо благодарности.</p>
            `
        },
        card5: {
            badge: 'ДЕЛО НАУКИ N° 7-Σ',
            title: 'ОТКРЫТ НОВЫЙ ХИМИЧЕСКИЙ ЭЛЕМЕНТ «СОЦИАЛИЗМИН»',
            body: `
                <h4>ЭЛЕМЕНТ №167 В ТАБЛИЦЕ МЕНДЕЛЕЕВА</h4>
                <p>Советские учёные орбитальной станции «Ленин-3» открыли 167-й элемент периодической системы — «Социализмин» (См). Элемент получен путём бомбардировки ядра урана-238 ускоренными ионами гелия в условиях открытого космоса.</p>
                <div class="dispatch-quote">«Социализмин — это не просто элемент. Это символ: даже в самом сердце материи действует закон планомерного развития. Всё подчинено закономерностям, открытым великим Лениным!» — Академик Тов. Курбатов А.Д.</div>
                <h4>УНИКАЛЬНЫЕ СВОЙСТВА</h4>
                <p><strong>Температура сверхпроводимости:</strong> -273°C (абсолютный ноль)<br>
                <strong>Энергетическая плотность:</strong> В 10 000 раз превышает уран-235<br>
                <strong>Стабильность:</strong> Период полураспада — 470 лет<br>
                Один грамм социализмина способен обеспечить энергией целый район на 50 лет.</p>
                <h4>ПРИМЕНЕНИЕ</h4>
                <p>Первый реактор на социализмине будет запущен на станции «Ленин-3» в следующем квартале. Энергия отправится на Землю посредством микроволновой передачи.</p>
            `
        },
        card6: {
            badge: 'ДЕЛО КУЛЬТУРЫ N° 33-Ψ',
            title: 'СИМФОНИЯ №12 ПРОЗВУЧАЛА НА МАРСЕ',
            body: `
                <h4>2 МИЛЛИОНА ЗРИТЕЛЕЙ ВО ВСЕЛЕННОЙ ОДНОВРЕМЕННО</h4>
                <p>Великий композитор Т. Косминский дирижировал оркестром из 340 музыкантов, расположенных на поверхности Красной планеты. Симфония №12 «Победа Коммунизма» транслировалась на все обитаемые миры Советского Союза.</p>
                <div class="dispatch-quote">«Музыка — это самая могучая из оружий. Наша симфония — это гимн трудящимся всех галактик, зов к борьбе и к победе!» — Тов. Косминский Т.А., Народный артист галактики</div>
                <h4>ОБОРУДОВАНИЕ</h4>
                <p>Концерт прошёл на специально сконструированной акустической площадке «Марсо-арена», оснащённой резонансными усилителями, работающими на частотах, воспринимаемых всеми известными разумными видами.</p>
                <h4>ПРОДОЛЖИТЕЛЬНОСТЬ</h4>
                <p><strong>Часть I — «Пробуждение»:</strong> 45 минут<br>
                <strong>Часть II — «Борьба»:</strong> 55 минут<br>
                <strong>Часть III — «Победа»:</strong> 38 минут<br>
                Послушать запись можно на волне 66.6 FM — Всесоюзном радио.</p>
            `
        }
    };

    function initModals() {
        const overlay = $('#modal-overlay');
        const closeBtn = $('#modal-close');
        const titleEl = $('#modal-title');
        const bodyEl = $('#modal-body');
        const cards = $$('.news-card');

        cards.forEach((card, index) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const keys = Object.keys(dispatches);
                const key = keys[index % keys.length];
                const dispatch = dispatches[key];
                if (!dispatch) return;

                titleEl.textContent = dispatch.title;
                bodyEl.innerHTML = dispatch.body;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Trigger static flash
                $('#static-canvas').classList.add('active');
                setTimeout(() => {
                    $('#static-canvas').classList.remove('active');
                }, 300);
            });
        });

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        function closeModal() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    initModals();

    /* ═══════════════════════════════════════════════════════
       10. RANDOM BANNER MESSAGE
       ═══════════════════════════════════════════════════════ */
    function initBannerMessages() {
        const messages = [
            'СЛАВА СОВЕТСКОМУ СОЮЗУ!',
            'ТРУДЯЩИЕСЯ ВСЕХ СТРАН, ОБЪЕДИНЯЙТЕСЬ!',
            'ВПЕРЁД — К ПОБЕДЕ КОММУНИЗМА!',
            'ПРОЛЕТАРИИ ВСЕХ СТРАН, СОЕДИНЯЙТЕСЬ!',
            'СИЛА НРОДА — СИЛА ПАРТИИ!',
            'СТРОИТЕЕВКОММУНИЗМ В ОДНОЙ СТРАНЕ!',
            'КАЖДОМУ — ПО СПОСОБНОСТЯМ, КАЖДОМУ — ПО ЗАСЛУГАМ!',
            'НАУКА И ТРУД — ОРУЖИЯ ПРОЛЕТАРИАТА!'
        ];

        // We'll subtly show these in the console as "broadcast messages"
        // and occasionally flash them in a small overlay
        const banner = document.createElement('div');
        banner.id = 'broadcast-banner';
        banner.style.cssText = `
            position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
            font-family: 'Oswald', sans-serif; font-size: 0.7rem;
            letter-spacing: 6px; color: var(--gold); z-index: 9998;
            background: rgba(10,10,10,0.85); padding: 6px 24px;
            border: 1px solid var(--gold); opacity: 0;
            transition: opacity 0.5s ease; pointer-events: none;
            text-transform: uppercase;
        `;
        document.body.appendChild(banner);

        function showBanner() {
            banner.textContent = pick(messages);
            banner.style.opacity = '1';
            setTimeout(() => {
                banner.style.opacity = '0';
            }, rand(2000, 4000));
        }

        // Show every 12-20 seconds
        setInterval(showBanner, rand(12000, 20000));
        setTimeout(showBanner, 3000);
    }
    initBannerMessages();

    /* ═══════════════════════════════════════════════════════
       11. SCROLL-BASED VISUAL EFFECTS
       ═══════════════════════════════════════════════════════ */
    function initScrollEffects() {
        const header = $('#broadcast-header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Add shadow to header on scroll
            if (scrollY > 10) {
                header.style.boxShadow = '0 4px 30px rgba(212, 175, 55, 0.25), 0 2px 10px rgba(0,0,0,0.5)';
            } else {
                header.style.boxShadow = '0 4px 30px rgba(212, 175, 55, 0.15)';
            }

            // Subtle parallax on constructivist backgrounds
            const offset1 = scrollY * 0.1;
            const offset2 = scrollY * 0.05;
            const bg1 = $('.constructivist-bg-1');
            const bg2 = $('.constructivist-bg-2');
            if (bg1) bg1.style.transform = `translateY(${offset1}px) rotate(45deg)`;
            if (bg2) bg2.style.transform = `translateY(${offset2}px)`;

            lastScroll = scrollY;
        }, { passive: true });
    }
    initScrollEffects();

    /* ═══════════════════════════════════════════════════════
       12. TYPEWRITER EFFECT FOR HERO HEADLINE
       ═══════════════════════════════════════════════════════ */
    function initTypewriter() {
        const line1 = $('.headline-line-1');
        const line2 = $('.headline-line-2');
        if (!line1 || !line2) return;

        const text1 = line1.textContent;
        const text2 = line2.textContent;
        line1.textContent = '';
        line2.textContent = '';

        let i = 0;
        let phase = 0; // 0 = line1, 1 = pause, 2 = line2

        function type() {
            if (phase === 0) {
                if (i < text1.length) {
                    line1.textContent = text1.substring(0, i + 1);
                    i++;
                    setTimeout(type, rand(40, 100));
                } else {
                    phase = 1;
                    i = 0;
                    setTimeout(type, 800);
                }
            } else if (phase === 1) {
                phase = 2;
                type();
            } else if (phase === 2) {
                if (i < text2.length) {
                    line2.textContent = text2.substring(0, i + 1);
                    i++;
                    setTimeout(type, rand(30, 80));
                }
            }
        }

        // Start after a brief delay
        setTimeout(type, 500);
    }
    initTypewriter();

    /* ── Log initialization ────────────────────────────────── */
    console.log(
        '%c ВСЕСОЮЗНАЯ ГОСУДАРСТВЕННАЯ ТЕЛЕРАДИОВЕЩАЯ СЕТЬ %c',
        'background: #CC0000; color: #FFD700; font-size: 14px; padding: 4px 8px; font-family: monospace; letter-spacing: 2px;',
        'background: #111; color: #D4AF37; font-size: 12px; padding: 4px 8px; font-family: monospace;'
    );
    console.log('%c Инициализация трансляции... Все системы работают нормально. %c', 'color: #44DD44; font-size: 11px;', '');

})();