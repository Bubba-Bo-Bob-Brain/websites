/* ═══════════════════════════════════════════════════════════════
   THE AURELIAN ORDER — Interactive Scripts
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Configuration ── */
    const CONFIG = {
        passphrase: 'the serpent the flame the eye',
        currentYear: new Date().getFullYear(),
        particleCount: 40,
        candleFlickerInterval: 80,
        pendulumSpeed: 2000,
    };

    /* ═══════════════════════════════════════════════════════════
       1. STATE
       ═══════════════════════════════════════════════════════════ */
    const state = {
        unlocked: false,
        gaslightHigh: true,
        currentTab: 'directory',
        calendarDate: new Date(1889, 11, 1), // December 1889
        selectedMember: null,
        searchQuery: '',
        circleFilter: 'all',
        specFilter: 'all',
    };

    /* ═══════════════════════════════════════════════════════════
       2. SEANCE DATA
       ═══════════════════════════════════════════════════════════ */
    const seanceEvents = {
        1889: {
            11: [
                { day: 2, type: 'elder', title: 'Elder Conclave of the Silver Moon', time: 'Midnight', desc: 'Monthly gathering of the Elder Council to discuss long-term arcane strategy.' },
                { day: 8, type: 'initiation', title: 'Rite of the First Threshold', time: '9:00 PM', desc: 'Evaluation and potential initiation of aspirant Elias Thorn.' },
                { day: 14, type: 'circle', title: 'Circle Gathering: The Elemental Balance', time: '8:30 PM', desc: 'Outer Circle members convene to discuss elemental correspondences.' },
                { day: 21, type: 'grand', title: 'Grand Séance of the Winter Solstice', time: '11:00 PM', desc: 'The most significant gathering of the year. All circles assembled.' },
                { day: 28, type: 'circle', title: 'Circle Gathering: Whispers from the East', time: '9:00 PM', desc: 'Investigation of anomalous spiritual signals from the Eastern Quarter.' },
            ],
            12: [
                { day: 5, type: 'circle', title: 'Circle Gathering: Alchemical Review', time: '8:00 PM', desc: 'Quarterly review of transmutation experiments by Dr. Blackwood.' },
                { day: 12, type: 'grand', title: 'Grand Invocation of the Watcher', time: 'Midnight', desc: 'The supreme ritual — invocation of the Primordial Watcher of the Eastern Gate.' },
                { day: 15, type: 'elder', title: 'Emergency Elder Conclave', time: '10:00 PM', desc: 'Urgent matter regarding the ley-line disturbance beneath the sanctum.' },
                { day: 19, type: 'initiation', title: 'Rite of the Opened Eye', time: '11:30 PM', desc: 'Initiation ceremony for three new aspirants into the Outer Circle.' },
                { day: 24, type: 'circle', title: 'Circle Gathering: Yule Observance', time: '7:00 PM', desc: 'Solstice feast and observance. Members only. Traditional rites observed.' },
                { day: 29, type: 'elder', title: 'Elder Conclave: Year\'s Reckoning', time: 'Midnight', desc: 'Annual accounting of the Order\'s activities and strategic planning for 1890.' },
            ],
        },
        1890: {
            1: [
                { day: 3, type: 'initiation', title: 'Rite of Binding', time: '10:00 PM', desc: 'Binding ceremony for newly accepted members of the Outer Circle.' },
                { day: 10, type: 'circle', title: 'Circle Gathering: Cartographic Review', time: '8:00 PM', desc: 'Review of ley-line maps by Archibald Sinclair.' },
                { day: 17, type: 'grand', title: 'Grand Séance of the New Year', time: 'Midnight', desc: 'First grand séance of 1890. Contact with the Watchers of the Four Gates.' },
                { day: 24, type: 'elder', title: 'Elder Conclave: Spring Equinox Planning', time: '9:00 PM', desc: 'Planning for the Spring Equinox grand ritual at the ley-line convergence.' },
            ],
        },
    };

    /* ═══════════════════════════════════════════════════════════
       3. ENVELOPE & ENTRANCE
       ═══════════════════════════════════════════════════════════ */
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const envelopeFlap = document.getElementById('envelope-flap');
    const waxSeal = document.getElementById('wax-seal');
    const passphraseContainer = document.getElementById('passphrase-container');
    const passphraseInput = document.getElementById('passphrase-input');
    const passphraseSubmit = document.getElementById('passphrase-submit');
    const passphraseError = document.getElementById('passphrase-error');

    function openEnvelope() {
        envelopeFlap.classList.add('open');
        setTimeout(() => {
            passphraseContainer.style.display = 'flex';
            passphraseContainer.style.animation = 'fade-in 0.8s ease';
            passphraseInput.focus();
        }, 1000);
    }

    waxSeal.addEventListener('click', function () {
        if (!state.unlocked) {
            openEnvelope();
        }
    });

    function attemptEntry() {
        const value = passphraseInput.value.trim().toLowerCase();
        if (value === CONFIG.passphrase) {
            state.unlocked = true;
            envelopeOverlay.classList.add('hidden');
            document.getElementById('app-container').style.display = 'block';
            initApp();
        } else {
            passphraseError.style.display = 'block';
            passphraseInput.value = '';
            passphraseInput.focus();
            setTimeout(() => {
                passphraseError.style.display = 'none';
            }, 4000);
        }
    }

    passphraseSubmit.addEventListener('click', attemptEntry);
    passphraseInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') attemptEntry();
    });

    /* ═══════════════════════════════════════════════════════════
       4. GRANDFATHER CLOCK
       ═══════════════════════════════════════════════════════════ */
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');

    function updateClock() {
        const now = new Date();
        const h = now.getHours() % 12;
        const m = now.getMinutes();
        const s = now.getSeconds();
        const ms = now.getMilliseconds();

        const secondDeg = (s + ms / 1000) * 6;
        const minuteDeg = (m + s / 60) * 6;
        const hourDeg = (h + m / 60) * 30;

        secondHand.style.transform = `rotate(${secondDeg}deg)`;
        minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        hourHand.style.transform = `rotate(${hourDeg}deg)`;
    }

    setInterval(updateClock, 1000 / 30);
    updateClock();

    /* ═══════════════════════════════════════════════════════════
       5. GASLIGHT TOGGLE
       ═══════════════════════════════════════════════════════════ */
    const gaslightBtn = document.getElementById('toggle-gaslight');
    const gaslightStatus = document.getElementById('gaslight-status');
    const gaslightIcon = gaslightBtn.querySelector('i');

    function updateGaslight() {
        if (state.gaslightHigh) {
            document.body.classList.remove('gaslight-dimmed');
            gaslightStatus.textContent = 'BRIGHT';
            gaslightIcon.className = 'fas fa-fire';
        } else {
            document.body.classList.add('gaslight-dimmed');
            gaslightStatus.textContent = 'DIMMED';
            gaslightIcon.className = 'fas fa-fire-alt';
        }
    }

    gaslightBtn.addEventListener('click', function () {
        state.gaslightHigh = !state.gaslightHigh;
        updateGaslight();
    });

    /* ═══════════════════════════════════════════════════════════
       6. NAVIGATION TABS
       ═══════════════════════════════════════════════════════════ */
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const target = this.dataset.tab;
            state.currentTab = target;

            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            tabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });

    /* ═══════════════════════════════════════════════════════════
       7. PARTICLES
       ═══════════════════════════════════════════════════════════ */
    const particlesContainer = document.getElementById('particles-container');

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';

        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';

        particlesContainer.appendChild(particle);

        setTimeout(() => particle.remove(), (duration + delay) * 1000);
    }

    function spawnParticles() {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            setTimeout(() => createParticle(), Math.random() * 5000);
        }
    }

    function continuousParticles() {
        createParticle();
        setTimeout(continuousParticles, Math.random() * 400 + 100);
    }

    /* ═══════════════════════════════════════════════════════════
       8. MEMBER CARDS — EXPAND/COLLAPSE
       ═══════════════════════════════════════════════════════════ */
    const memberCards = document.querySelectorAll('.member-card');

    memberCards.forEach(card => {
        const expandHint = card.querySelector('.card-expand-hint');

        function toggleCard() {
            const isExpanded = card.classList.contains('expanded');

            // Collapse all
            memberCards.forEach(c => c.classList.remove('expanded'));

            if (!isExpanded) {
                card.classList.add('expanded');
            }
        }

        expandHint.addEventListener('click', toggleCard);
        card.style.cursor = 'pointer';
    });

    /* ═══════════════════════════════════════════════════════════
       9. SEARCH & FILTER
       ═══════════════════════════════════════════════════════════ */
    const searchInput = document.getElementById('member-search');
    const clearSearch = document.getElementById('clear-search');
    const circleFilter = document.getElementById('circle-filter');
    const specFilter = document.getElementById('specialization-filter');
    const membersGrid = document.getElementById('members-grid');
    const noResults = document.getElementById('no-results');
    const membersCount = document.getElementById('members-count');

    function filterMembers() {
        const query = state.searchQuery.toLowerCase().trim();
        const circle = state.circleFilter;
        const spec = state.specFilter;

        const cards = membersGrid.querySelectorAll('.member-card');
        let visible = 0;

        cards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const c = card.dataset.circle;
            const s = card.dataset.spec;
            const title = card.querySelector('.member-title').textContent.toLowerCase();
            const specText = card.querySelector('.member-specialization span').textContent.toLowerCase();

            const matchQuery = !query || name.includes(query) || title.includes(query) || specText.includes(query);
            const matchCircle = circle === 'all' || c === circle;
            const matchSpec = spec === 'all' || s === spec;

            if (matchQuery && matchCircle && matchSpec) {
                card.style.display = '';
                visible++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visible === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }

        membersCount.textContent = `${visible} Awakened Member${visible !== 1 ? 's' : ''} Revealed`;
    }

    searchInput.addEventListener('input', function () {
        state.searchQuery = this.value;
        filterMembers();
    });

    clearSearch.addEventListener('click', function () {
        searchInput.value = '';
        state.searchQuery = '';
        filterMembers();
        searchInput.focus();
    });

    circleFilter.addEventListener('change', function () {
        state.circleFilter = this.value;
        filterMembers();
    });

    specFilter.addEventListener('change', function () {
        state.specFilter = this.value;
        filterMembers();
    });

    /* ═══════════════════════════════════════════════════════════
       10. SEANCE CALENDAR
       ═══════════════════════════════════════════════════════════ */
    const calendarDisplay = document.getElementById('calendar-display');
    const seanceCalendar = document.getElementById('seance-calendar');
    const seanceList = document.getElementById('seance-list');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function renderCalendar() {
        const year = state.calendarDate.getFullYear();
        const month = state.calendarDate.getMonth();

        calendarDisplay.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        let html = '<div class="calendar-grid">';

        // Day headers
        const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        dayHeaders.forEach(d => {
            html += `<div class="calendar-day-header">${d}</div>`;
        });

        // Previous month filler days
        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="calendar-day empty other-month">${daysInPrevMonth - i}</div>`;
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayOfWeek = new Date(year, month, day).getDay();
            const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

            // Check for events
            const events = seanceEvents[year]?.[month + 1]?.filter(e => e.day === day) || [];
            const hasEvent = events.length > 0;

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (hasEvent) classes += ' has-event ' + events[0].type;
            if (dayOfWeek === 0 || dayOfWeek === 6) classes += ' weekend';

            html += `<div class="${classes}" data-day="${day}" data-month="${month}" data-year="${year}">${day}</div>`;
        }

        // Next month filler days
        const totalCells = firstDay + daysInMonth;
        const remaining = 7 - (totalCells % 7);
        if (remaining < 7) {
            for (let i = 1; i <= remaining; i++) {
                html += `<div class="calendar-day empty other-month">${i}</div>`;
            }
        }

        html += '</div>';
        seanceCalendar.innerHTML = html;

        // Add click listeners to days with events
        seanceCalendar.querySelectorAll('.has-event').forEach(dayEl => {
            dayEl.addEventListener('click', function () {
                const day = parseInt(this.dataset.day);
                const month = parseInt(this.dataset.month);
                const year = parseInt(this.dataset.year);
                const events = seanceEvents[year]?.[month + 1]?.filter(e => e.day === day) || [];

                // Highlight
                seanceCalendar.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');

                // Update upcoming list
                renderUpcomingSeances(events);
            });
        });

        renderUpcomingSeances(null, year, month);
    }

    function renderUpcomingSeances(dayEvents, year, month) {
        if (dayEvents) {
            // Show events for clicked day
            let html = `<h3><i class="fas fa-calendar-day"></i> Events for ${monthNames[month]} ${dayEvents[0].day}, ${year}</h3>`;
            html += '<div class="seance-list">';
            dayEvents.forEach(event => {
                html += createSeanceItemHTML(event);
            });
            html += '</div>';
            seanceList.innerHTML = html;
            return;
        }

        // Show all upcoming events for current month
        const y = year || state.calendarDate.getFullYear();
        const m = (month !== undefined) ? month : state.calendarDate.getMonth();
        const events = seanceEvents[y]?.[m + 1] || [];

        let html = `<h3><i class="fas fa-hourglass-half"></i> Gatherings of ${monthNames[m]} ${y}</h3>`;
        html += '<div class="seance-list">';

        if (events.length === 0) {
            html += '<p style="color: var(--stone-light); font-style: italic; text-align: center; padding: 20px;">No gatherings recorded for this month.</p>';
        } else {
            events.forEach(event => {
                html += createSeanceItemHTML(event);
            });
        }

        html += '</div>';
        seanceList.innerHTML = html;
    }

    function createSeanceItemHTML(event) {
        const iconMap = {
            'grand': 'fa-star-pentagram',
            'circle': 'fa-users',
            'elder': 'fa-eye',
            'initiation': 'fa-key'
        };

        return `
            <div class="seance-item">
                <div class="seance-item-type ${event.type}">
                    <i class="fas ${iconMap[event.type] || 'fa-ghost'}"></i>
                </div>
                <div class="seance-item-info">
                    <div class="seance-item-title">${event.title}</div>
                    <div class="seance-item-detail">${event.desc}</div>
                </div>
                <div class="seance-item-date">
                    ${monthNames[state.calendarDate.getMonth()]} ${event.day}
                    <span class="time">${event.time}</span>
                </div>
            </div>
        `;
    }

    prevMonthBtn.addEventListener('click', function () {
        state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function () {
        state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
        renderCalendar();
    });

    /* ═══════════════════════════════════════════════════════════
       11. SEAL RESET (LOCK THE ORDER)
       ═══════════════════════════════════════════════════════════ */
    const resetSealBtn = document.getElementById('reset-seal');

    resetSealBtn.addEventListener('click', function () {
        if (confirm('Seal the Order? All knowledge will be veiled once more.')) {
            state.unlocked = false;
            document.getElementById('app-container').style.display = 'none';
            envelopeOverlay.classList.remove('hidden');
            envelopeFlap.classList.remove('open');
            passphraseContainer.style.display = 'none';
            passphraseInput.value = '';
        }
    });

    /* ═══════════════════════════════════════════════════════════
       12. AMBIENT GASLIGHT FLICKER EFFECT
       ═══════════════════════════════════════════════════════════ */
    function createGaslightFlicker() {
        if (!state.unlocked) return;

        const header = document.getElementById('main-header');
        const flickers = ['brightness(1.05)', 'brightness(0.97)', 'brightness(1.03)', 'brightness(0.99)', 'brightness(1.01)'];

        setInterval(() => {
            if (!state.gaslightHigh) return;
            const flicker = flickers[Math.floor(Math.random() * flickers.length)];
            header.style.filter = flicker;
            setTimeout(() => {
                header.style.filter = 'brightness(1)';
            }, 100 + Math.random() * 200);
        }, 2000 + Math.random() * 3000);
    }

    /* ═══════════════════════════════════════════════════════════
       13. INITIALIZE APPLICATION
       ═══════════════════════════════════════════════════════════ */
    function initApp() {
        // Set footer year
        document.getElementById('current-year').textContent = CONFIG.currentYear;

        // Start particles
        spawnParticles();
        continuousParticles();

        // Start clock (already running)

        // Start gaslight flicker
        createGaslightFlicker();

        // Render calendar
        renderCalendar();

        // Animate member cards entrance
        setTimeout(() => {
            memberCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;

                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            });
        }, 300);

        // Log welcome message
        console.log('%c◆ THE AURELIAN ORDER ◆', 'color: #d4a017; font-size: 18px; font-weight: bold; font-family: serif;');
        console.log('%cThe veil has been lifted. Welcome, Awakened one.', 'color: #b8860b; font-size: 13px; font-family: serif;');
    }

    /* ═══════════════════════════════════════════════════════════
       14. KEYBOARD SHORTCUTS
       ═══════════════════════════════════════════════════════════ */
    document.addEventListener('keydown', function (e) {
        if (!state.unlocked) return;

        // ESC closes modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('member-modal');
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
            }
        }

        // Ctrl+Shift+L locks the order
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            resetSealBtn.click();
        }

        // Ctrl+Shift+G toggles gaslight
        if (e.ctrlKey && e.shiftKey && e.key === 'G') {
            gaslightBtn.click();
        }
    });

    /* ═══════════════════════════════════════════════════════════
       15. SEASONAL DECORATION — SNOW EFFECT (December)
       ═══════════════════════════════════════════════════════════ */
    function checkSeasonal() {
        const now = new Date();
        if (now.getMonth() === 11) {
            // December — add subtle snow
            createSnow();
        }
    }

    function createSnow() {
        const container = document.getElementById('particles-container');
        for (let i = 0; i < 20; i++) {
            const snowflake = document.createElement('div');
            snowflake.style.cssText = `
                position: fixed;
                top: -10px;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                left: ${Math.random() * 100}%;
                animation: snowfall ${Math.random() * 6 + 4}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                opacity: 0;
            `;
            document.body.appendChild(snowflake);

            // Add keyframes dynamically
            if (!document.getElementById('snow-keyframes')) {
                const style = document.createElement('style');
                style.id = 'snow-keyframes';
                style.textContent = `
                    @keyframes snowfall {
                        0% { opacity: 0; transform: translateY(0) rotate(0deg); }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { opacity: 0; transform: translateY(100vh) rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    checkSeasonal();

})();