/* ============================================
   KOMMUNA-TV — Broadcast Engine
   Peoples' Solar Republic State Network
   ============================================ */

(function () {
    'use strict';

    /* ── Stellar Date System ── */
    const EARTH_EPOCH = new Date('2079-01-01T00:00:00Z');

    function getStellarDate() {
        const now = new Date();
        const diffMs = now - EARTH_EPOCH;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        const year = 2079 + Math.floor(diffDays / 365);
        const dayOfYear = Math.floor(diffDays % 365);
        const hours = now.getUTCHours().toString().padStart(2, '0');
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        return {
            full: `${year}.${dayOfYear.toString().padStart(3, '0')} — ${hours}:${minutes} ST`,
            short: `${year}.${dayOfYear.toString().padStart(3, '0')}`
        };
    }

    function getBroadcastDate() {
        const days = ['SOLDAY', 'LUNADAY', 'MARSDAY', 'MERCURYDAY', 'JUPITERDAY', 'VENUSDAY', 'SATURNDAY'];
        const months = [
            'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
            'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
        ];
        const now = new Date();
        const dayName = days[now.getDay()];
        const month = months[now.getMonth()];
        const date = now.getDate();
        const year = now.getFullYear();
        return `${dayName}, ${month} ${date} — EARTH YEAR ${year} — STELLAR ${getStellarDate().short}`;
    }

    function updateDates() {
        const broadcastEl = document.getElementById('broadcast-date');
        const footerEl = document.getElementById('footer-date');
        if (broadcastEl) broadcastEl.textContent = getBroadcastDate();
        if (footerEl) footerEl.textContent = getStellarDate().full;
    }

    /* ── Progress Bar Animations ── */
    function initProgressBars() {
        const progressCards = document.querySelectorAll('.progress-card');
        const overallBar = document.querySelector('.overall-bar');

        const progressObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const bar = card.querySelector('.progress-bar');
                    const targetWidth = bar.style.getPropertyValue('--target-width');
                    bar.style.width = targetWidth;
                }
            });
        }, { threshold: 0.3 });

        progressCards.forEach(function (card) {
            progressObserver.observe(card);
        });

        const overallObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && overallBar) {
                    const targetWidth = overallBar.style.getPropertyValue('--overall-width');
                    overallBar.style.width = targetWidth;
                }
            });
        }, { threshold: 0.3 });

        if (overallBar) {
            overallObserver.observe(overallBar);
        }
    }

    /* ── Ticker Speed Control ── */
    function initTickerControl() {
        const ticker = document.getElementById('ticker');
        if (!ticker) return;

        ticker.addEventListener('mouseenter', function () {
            ticker.style.animationPlayState = 'paused';
        });

        ticker.addEventListener('mouseleave', function () {
            ticker.style.animationPlayState = 'running';
        });
    }

    /* ── Schedule Live Indicator ── */
    function initScheduleHighlight() {
        const rows = document.querySelectorAll('.schedule-row');

        function updateScheduleStatus() {
            var now = new Date();
            var currentTime = now.getHours() * 60 + now.getMinutes();

            rows.forEach(function (row) {
                row.classList.remove('schedule-live');
                var statusDot = row.querySelector('.status-dot');
                var statusText = row.querySelector('.schedule-status');
                if (statusDot) statusDot.className = 'status-dot upcoming';
                if (statusText) {
                    statusText.innerHTML = '<span class="status-dot upcoming"></span>UPCOMING';
                }
            });

            var timeRanges = [
                { start: 0, end: 360 },
                { start: 360, end: 420 },
                { start: 420, end: 540 },
                { start: 540, end: 720 },
                { start: 720, end: 780 },
                { start: 780, end: 1080 },
                { start: 1080, end: 1200 },
                { start: 1200, end: 1320 },
                { start: 1320, end: 1440 }
            ];

            for (var i = 0; i < timeRanges.length; i++) {
                if (currentTime >= timeRanges[i].start && currentTime < timeRanges[i].end) {
                    var targetRow = rows[i + 1];
                    if (targetRow) {
                        targetRow.classList.add('schedule-live');
                        var dot = targetRow.querySelector('.status-dot');
                        var text = targetRow.querySelector('.schedule-status');
                        if (dot) dot.className = 'status-dot live';
                        if (text) {
                            text.innerHTML = '<span class="status-dot live"></span>ON AIR';
                        }
                    }
                    break;
                }
            }
        }

        updateScheduleStatus();
        setInterval(updateScheduleStatus, 60000);
    }

    /* ── CRT Flicker Effect ── */
    function initCRTFlicker() {
        var noise = document.querySelector('.static-noise');
        if (!noise) return;

        var flickerInterval = setInterval(function () {
            if (Math.random() > 0.97) {
                noise.style.opacity = (Math.random() * 0.08 + 0.02).toString();
                setTimeout(function () {
                    noise.style.opacity = '';
                }, 100 + Math.random() * 150);
            }
        }, 200);

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                clearInterval(flickerInterval);
            } else {
                flickerInterval = setInterval(function () {
                    if (Math.random() > 0.97) {
                        noise.style.opacity = (Math.random() * 0.08 + 0.02).toString();
                        setTimeout(function () {
                            noise.style.opacity = '';
                        }, 100 + Math.random() * 150);
                    }
                }, 200);
            }
        });
    }

    /* ── Live Clock ── */
    function initLiveClock() {
        var clockEl = document.getElementById('broadcast-date');
        if (!clockEl) return;

        setInterval(function () {
            updateDates();
        }, 1000);
    }

    /* ── Headline Card Interactions ── */
    function initHeadlineCards() {
        var cards = document.querySelectorAll('.headline-card');

        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                var title = this.querySelector('.card-title');
                if (title) {
                    title.style.color = '#CC0000';
                    setTimeout(function () {
                        title.style.color = '';
                    }, 300);
                }
            });
        });
    }

    /* ── Poster Card Parallax Tilt ── */
    function initPosterTilt() {
        var posters = document.querySelectorAll('.poster-card');

        posters.forEach(function (poster) {
            poster.addEventListener('mousemove', function (e) {
                var rect = this.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -5;
                var rotateY = ((x - centerX) / centerX) * 5;
                this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
            });

            poster.addEventListener('mouseleave', function () {
                this.style.transform = '';
            });
        });
    }

    /* ── Random Broadcast Glitch ── */
    function initBroadcastGlitch() {
        var overlay = document.querySelector('.crt-overlay');
        if (!overlay) return;

        setInterval(function () {
            if (Math.random() > 0.95) {
                document.body.style.transform = 'translateX(' + (Math.random() * 4 - 2) + 'px)';
                setTimeout(function () {
                    document.body.style.transform = '';
                }, 50);
            }
        }, 3000);
    }

    /* ── Hero Card Counter Animation ── */
    function animateCounters() {
        var percentageTexts = document.querySelectorAll('.progress-icon text');

        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var svg = entry.target.closest('svg');
                    var ring = svg.querySelector('.progress-ring');
                    if (ring) {
                        var currentDashoffset = parseFloat(ring.style.strokeDashoffset) || 100;
                        var targetDashoffset = currentDashoffset;
                        ring.style.strokeDashoffset = '100';
                        setTimeout(function () {
                            ring.style.strokeDashoffset = targetDashoffset;
                        }, 100);
                    }
                }
            });
        }, { threshold: 0.5 });

        percentageTexts.forEach(function (text) {
            counterObserver.observe(text);
        });
    }

    /* ── Dynamic Ticker Content Shuffle ── */
    function initTickerShuffle() {
        var ticker = document.getElementById('ticker');
        if (!ticker) return;

        var additionalHeadlines = [
            '★ KUIPER BELT OUTPOST REPORTS SUCCESSFUL HELIOPAUSE MAPPING MISSION ★',
            '★ PHOBOS STATION COMMENCES CONSTRUCTION OF INTERPLANETARY DRIVE YARD ★',
            '★ MERCURIAL SOLAR FARM NOW POWERS 12 COLONIAL WORLDS SIMULTANEOUSLY ★',
            '★ CALLISTO BIOLOGISTS DEVELOP NEW LOW-GRAVITY CROP VARIETIES ★',
            '★ IO VOLCANIC ENERGY HARVESTING STATION BEGINS FULL OPERATIONS ★',
            '★ TRITON NUCLEAR PROPULSION LACH FINAL CONSTRUCTION PHASE ★',
            '★ PLUTO RESEARCH STATION DISCOVERS NEW CLASS OF CRYOVOLCANIC MINERALS ★',
            '★ SOLAR WIND FARM ARRAY EXPANDS TO 10,000 INDEPENDENT SATELLITES ★'
        ];

        setInterval(function () {
            if (Math.random() > 0.7) {
                var randomHeadline = additionalHeadlines[Math.floor(Math.random() * additionalHeadlines.length)];
                var newSpan = document.createElement('span');
                newSpan.className = 'ticker-item';
                newSpan.textContent = randomHeadline;
                ticker.appendChild(newSpan);

                if (ticker.children.length > 30) {
                    ticker.removeChild(ticker.firstChild);
                }
            }
        }, 15000);
    }

    /* ── Constructivist Decorative Lines Animation ── */
    function initDecorativeLines() {
        var sectionHeaders = document.querySelectorAll('.section-header');

        sectionHeaders.forEach(function (header) {
            var leftLine = header.querySelector('.header-line.left');
            var rightLine = header.querySelector('.header-line.right');

            if (leftLine && rightLine) {
                var observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            leftLine.style.animation = 'none';
                            rightLine.style.animation = 'none';
                            void leftLine.offsetWidth;
                            leftLine.style.animation = 'line-expand-left 1s ease-out forwards';
                            rightLine.style.animation = 'line-expand-right 1s ease-out forwards';
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(header);
            }
        });

        var style = document.createElement('style');
        style.textContent = '@keyframes line-expand-left { from { width: 0; opacity: 0; } to { width: 100%; opacity: 1; } } @keyframes line-expand-right { from { width: 0; opacity: 0; } to { width: 100%; opacity: 1; } }';
        document.head.appendChild(style);
    }

    /* ── Keyboard Shortcut — Typewriter Effect ── */
    function initKeyboardBroadcast() {
        var broadcastMessages = [
            'INCOMING TRANSMISSION FROM CENTRAL COMMITTEE...',
            'ENCRYPTED MESSAGE: GLORY TO THE WORKERS OF THE COSMIC COMMUNE.',
            'PRIORITY ALERT: ALL REPORTS INDICATE PLAN TARGETS EXCEEDED.',
            'BROADCAST CONTINUOUS: THE STARS BELONG TO THE PEOPLE.',
            'TRANSMISSION: SOLAR REPUBLIC EXPANDS TO NEW FRONTIERS.'
        ];

        var messageIndex = 0;

        document.addEventListener('keydown', function (e) {
            if (e.code === 'Space' && e.ctrlKey) {
                e.preventDefault();
                var ticker = document.getElementById('ticker');
                if (ticker) {
                    var newSpan = document.createElement('span');
                    newSpan.className = 'ticker-item';
                    newSpan.style.color = '#F0D060';
                    newSpan.textContent = '⚡ ' + broadcastMessages[messageIndex] + ' ⚡';
                    ticker.appendChild(newSpan);
                    messageIndex = (messageIndex + 1) % broadcastMessages.length;
                }
            }
        });
    }

    /* ── Visibility API — Pause Animations ── */
    function initVisibilityHandler() {
        document.addEventListener('visibilitychange', function () {
            var animatedElements = document.querySelectorAll(
                '.ticker-content, .banner-content, .emblem-svg, .live-dot, .overall-bar, .progress-bar'
            );

            animatedElements.forEach(function (el) {
                if (document.hidden) {
                    el.style.animationPlayState = 'paused';
                } else {
                    el.style.animationPlayState = 'running';
                }
            });
        });
    }

    /* ── Scroll-triggered Section Reveals ── */
    function initScrollReveal() {
        var sections = document.querySelectorAll('.section-frame, .dispatch-frame');

        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(function (section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            revealObserver.observe(section);
        });
    }

    /* ── Emblem Pulse on Click ── */
    function initEmblemInteraction() {
        var emblem = document.querySelector('.emblem');
        if (!emblem) return;

        emblem.addEventListener('click', function () {
            var svg = this.querySelector('.emblem-svg');
            if (svg) {
                svg.style.animation = 'none';
                void svg.offsetWidth;
                svg.style.animation = 'emblem-rotate 1s linear';
                setTimeout(function () {
                    svg.style.animation = 'emblem-rotate 60s linear infinite';
                }, 1000);
            }
        });

        emblem.style.cursor = 'pointer';
        emblem.title = 'Click to transmit signal';
    }

    /* ── Initialize All Systems ── */
    function init() {
        updateDates();
        initProgressBars();
        initTickerControl();
        initScheduleHighlight();
        initCRTFlicker();
        initLiveClock();
        initHeadlineCards();
        initPosterTilt();
        initBroadcastGlitch();
        animateCounters();
        initTickerShuffle();
        initDecorativeLines();
        initKeyboardBroadcast();
        initVisibilityHandler();
        initScrollReveal();
        initEmblemInteraction();

        console.log('%c KOMMUNA-TV BROADCAST SYSTEM ONLINE ',
            'background: #CC0000; color: #F5E6C8; font-family: monospace; padding: 8px 16px; font-size: 14px; font-weight: bold;');
        console.log('%c GLORY TO THE COSMIC COMMUNE ',
            'background: #D4A017; color: #0A0A0A; font-family: monospace; padding: 4px 12px; font-size: 11px; font-weight: bold;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();