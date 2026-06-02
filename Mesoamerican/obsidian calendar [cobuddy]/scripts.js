document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // DATA: Tonalpohualli Day Signs & Numbers
    // ============================================
    const daySigns = [
        { name: 'Cipactli', glyph: '🐊', meaning: 'Crocodile — First Force of Creation' },
        { name: 'Ehecatl', glyph: '💨', meaning: 'Wind — Breath of the Sun' },
        { name: 'Calli', glyph: '🏠', meaning: 'House — Shelter of the People' },
        { name: 'Cuetzpallin', glyph: '🦎', meaning: 'Lizard — Messenger of the Earth' },
        { name: 'Cohuatl', glyph: '🐍', meaning: 'Serpent — Cycle of Life and Death' },
        { name: 'Miquiztli', glyph: '💀', meaning: 'Death — Gateway to the Underworld' },
        { name: 'Mazatl', glyph: '🦌', meaning: 'Deer — Spirit of the Forest' },
        { name: 'Tochtli', glyph: '🐇', meaning: 'Rabbit — Fertility and Abundance' },
        { name: 'Atl', glyph: '💧', meaning: 'Water — Purification and Renewal' },
        { name: 'Itzpapalotl', glyph: '🦋', meaning: 'Obsidian Butterfly — Fallen Warriors' },
        { name: 'Xolotl', glyph: '🐕', meaning: 'Dog — Guardian of the Dead' },
        { name: 'Tecpatl', glyph: '🗡️', meaning: 'Flint — Sacrifice and Sharpness' },
        { name: 'Ollin', glyph: '⚡', meaning: 'Earthquake — Movement of the Ages' },
        { name: 'Malinalli', glyph: '🌿', meaning: 'Grass — Purification by Fire' },
        { name: 'Acatl', glyph: '🌵', meaning: 'Reed — Growth from the Earth' },
        { name: 'Ozomahtli', glyph: '🐒', meaning: 'Monkey — Joy and Creativity' },
        { name: 'Cuauhtli', glyph: '🦅', meaning: 'Eagle — Vision of the Sun' },
        { name: 'Cozcacuauhtli', glyph: '🦅', meaning: 'Vulture — Cycle of Renewal' },
        { name: 'Ollin', glyph: '🌀', meaning: 'Movement — Destiny of the People' },
        { name: 'Quiahuitl', glyph: '🌧️', meaning: 'Rain — Nourishment of Crops' }
    ];

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

    // ============================================
    // DATA: Deities
    // ============================================
    const deities = [
        { name: 'Huitzilopochtli', icon: '⚔️', desc: 'Sun God of War — Patron of Tenochtitlan', domain: 'War, Sun, Sacrifice' },
        { name: 'Quetzalcoatl', icon: '🐉', desc: 'Feathered Serpent — Creator of Mankind', domain: 'Wind, Learning, Venus' },
        { name: 'Tlaloc', icon: '🌩️', desc: 'Rain God — Keeper of Storms and Fertility', domain: 'Rain, Lightning, Crops' },
        { name: 'Tezcatlipoca', icon: '🌑', desc: 'Smoking Mirror — Lord of Night and Destiny', domain: 'Night, Obsidian, Fate' },
        { name: 'Xipe Totec', icon: '🌽', desc: 'Flayed Lord — God of Spring and Renewal', domain: 'Agriculture, Seasons' },
        { name: 'Mictlantecuhtli', icon: '💀', desc: 'Lord of Mictlán — Guardian of the Dead', domain: 'Death, Underworld' },
        { name: 'Coatlicue', icon: '🌙', desc: 'Mother of Gods — Serpent Skirt Goddess', domain: 'Earth, Creation, Fertility' },
        { name: 'Tonatiuh', icon: '☀️', desc: 'Sun Disk — Fifth Sun, Daily Journey', domain: 'Sun, Sustenance' },
        { name: 'Chalchiuhtlicue', icon: '🌊', desc: 'Jade Skirt — Goddess of Lakes and Streams', domain: 'Water, Purification' },
        { name: 'Xochiquetzal', icon: '🌸', desc: 'Precious Feather Flower — Love and Beauty', domain: 'Love, Flowers, Art' },
        { name: 'Mixcoatl', icon: '⭐', desc: 'Cloud Serpent — Hunter of the Stars', domain: 'Hunting, Stars' },
        { name: 'Ixchel', icon: '🌺', desc: 'Rainbow Goddess — Protector of Midwives', domain: 'Moon, Medicine, Weaving' }
    ];

    // ============================================
    // DATA: Tributes
    // ============================================
    const tributes = [
        { name: 'Maize Offerings', icon: '🌽', desc: 'Sacred grain for the Sun', schedule: 'Every 4th day of Cipactli' },
        { name: 'Cacao Ritual', icon: '🍫', desc: 'Drink of the gods', schedule: '8th day — Tochtli' },
        { name: 'Quetzal Feathers', icon: '🪶', desc: 'Plumes for the Temples', schedule: '12th day — Calli' },
        { name: 'Obsidian Blades', icon: '🔪', desc: 'Offerings to Tezcatlipoca', schedule: '7th day — Tecpatl' },
        { name: 'Jade Beads', icon: '💎', desc: 'Sacred stone tributes', schedule: 'Every 13th day' },
        { name: 'Copal Incense', icon: '🔥', desc: 'Smoke offerings to the Gods', schedule: 'Daily at dawn' },
        { name: 'Human Hearts', icon: '❤️', desc: 'Greatest offering to Huitzilopochtli', schedule: '18th day — Malinalli' },
        { name: 'Amber Resin', icon: '🟠', desc: 'Golden tears of the earth', schedule: '3rd day — Acatl' }
    ];

    // ============================================
    // DATA: Astronomical Events
    // ============================================
    function getUpcomingEvents() {
        const events = [];
        const now = new Date();

        // Simulated upcoming events
        const eventTemplates = [
            { name: 'Solar Eclipse', icon: '🌑', desc: 'Sun consumed by shadow', daysUntil: 47 },
            { name: 'Venus Rise', icon: '☀️', desc: 'Morning Star ascends', daysUntil: 23 },
            { name: 'Pleiades Festival', icon: '✨', desc: 'Celebration of the Star Cluster', daysUntil: 12 },
            { name: 'Equinox Alignment', icon: '⚖️', desc: 'Day equals night', daysUntil: 8 },
            { name: 'Blood Moon', icon: '🌙', desc: 'Lunar eclipse — omen of war', daysUntil: 31 },
            { name: 'Meteor Shower', icon: '☄️', desc: 'Tears of the heavens', daysUntil: 5 }
        ];

        return eventTemplates.map(e => ({
            ...e,
            date: new Date(now.getTime() + e.daysUntil * 86400000)
        }));
    }

    // ============================================
    // DATA: Sacred Rituals
    // ============================================
    const rituals = [
        { name: 'New Fire Ceremony', icon: '🔥', desc: 'Renewal of the cosmic fire', priority: 'critical', day: 'Cipactli 1' },
        { name: 'Feast of the Dead', icon: '💀', desc: 'Honoring ancestors of Mictlán', priority: 'sacred', day: 'Miquiztli 6' },
        { name: 'Rain Invocation', icon: '🌧️', desc: 'Prayers to Tlaloc for rain', priority: 'sacred', day: 'Atl 4' },
        { name: 'Sun Stone Sacrifice', icon: '☀️', desc: 'Blood for the sustenance of Tonatiuh', priority: 'critical', day: 'Ollin 13' },
        { name: 'Feathered Serpent Rite', icon: '🐉', desc: 'Procession of Quetzalcoatl', priority: 'observed', day: 'Ehecatl 9' },
        { name: 'Maize Planting', icon: '🌱', desc: 'Sowing the sacred grain', priority: 'observed', day: 'Acatl 3' },
        { name: 'Dance of the Eagle', icon: '🦅', desc: 'Warriors honor Cuauhtli', priority: 'sacred', day: 'Cuauhtli 11' },
        { name: 'Night of Sorrows', icon: '🌑', desc: 'Vigil for Tezcatlipoca', priority: 'critical', day: 'Tezcatl 1' }
    ];

    // ============================================
    // STATE
    // ============================================
    let currentWheelPosition = 0;
    let selectedDay = Math.floor(Math.random() * 260);

    // ============================================
    // TONALPOHUALLI CALCULATION
    // ============================================
    function getTonalpohualliDay(index) {
        const dayIndex = index % 20;
        const numIndex = index % 13;
        return {
            number: numbers[numIndex],
            sign: daySigns[dayIndex],
            fullIndex: index,
            name: `${numbers[numIndex]} ${daySigns[dayIndex].name}`
        };
    }

    // ============================================
    // ECLIPSE COUNTDOWN
    // ============================================
    function initEclipseTimer() {
        const eclipseDate = new Date();
        eclipseDate.setDate(eclipseDate.getDate() + 47);

        function update() {
            const now = new Date();
            const diff = eclipseDate - now;

            if (diff <= 0) {
                document.getElementById('eclipse-countdown').textContent = 'ECLIPSE NOW';
                return;
            }

            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            const pad = n => String(n).padStart(2, '0');
            document.getElementById('eclipse-countdown').textContent =
                `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }

        update();
        setInterval(update, 1000);
    }

    // ============================================
    // CALENDAR WHEEL GENERATION
    // ============================================
    function generateCalendarWheel() {
        const container = document.getElementById('calendar-days');
        container.innerHTML = '';

        for (let i = 0; i < 260; i++) {
            const day = getTonalpohualliDay(i);
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            cell.dataset.index = i;

            const angle = (i / 260) * 360;
            const radius = 175;
            const x = 210 + radius * Math.cos((angle - 90) * Math.PI / 180) - 18;
            const y = 210 + radius * Math.sin((angle - 90) * Math.PI / 180) - 18;

            cell.style.left = `${x}px`;
            cell.style.top = `${y}px`;
            cell.textContent = day.number;

            if (i === selectedDay) {
                cell.classList.add('active');
            }

            // Mark sacred days
            if (i % 20 === 5 || i % 20 === 13) {
                cell.classList.add('sacred');
            }

            // Tooltip
            cell.addEventListener('mouseenter', (e) => {
                showTooltip(e, day.sign.glyph, day.name + ' — ' + day.sign.meaning);
            });

            cell.addEventListener('mouseleave', hideTooltip);
            cell.addEventListener('click', () => selectDay(i));

            container.appendChild(cell);
        }
    }

    // ============================================
    // DAY SELECTION
    // ============================================
    function selectDay(index) {
        selectedDay = index;
        document.querySelectorAll('.day-cell').forEach((cell, i) => {
            cell.classList.toggle('active', i === index);
        });

        const day = getTonalpohualliDay(index);
        updateSelectedDayDisplay(day);
    }

    function updateSelectedDayDisplay(day) {
        const activeCell = document.querySelector('.day-cell.active');
        if (activeCell) {
            activeCell.style.transform = 'scale(1.3)';
            activeCell.style.zIndex = '10';
            setTimeout(() => {
                activeCell.style.transform = '';
                activeCell.style.zIndex = '';
            }, 300);
        }
    }

    // ============================================
    // WHEEL ROTATION
    // ============================================
    function initWheelControls() {
        const wheel = document.getElementById('calendar-wheel');
        const btnCW = document.getElementById('rotate-cw');
        const btnCCW = document.getElementById('rotate-ccw');

        btnCW.addEventListener('click', () => {
            currentWheelPosition += 1;
            rotateWheel(1);
        });

        btnCCW.addEventListener('click', () => {
            currentWheelPosition -= 1;
            rotateWheel(-1);
        });

        function rotateWheel(direction) {
            const cells = document.querySelectorAll('.day-cell');
            cells.forEach((cell, i) => {
                const newIndex = (i + direction + 260) % 260;
                const day = getTonalpohualliDay(newIndex);

                cell.style.transition = 'none';
                cell.textContent = day.number;

                if (newIndex === selectedDay) {
                    cell.classList.add('active');
                } else {
                    cell.classList.remove('active');
                }

                if (newIndex % 20 === 5 || newIndex % 20 === 13) {
                    cell.classList.add('sacred');
                } else {
                    cell.classList.remove('sacred');
                }
            });

            // Animate rotation
            wheel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            wheel.style.transform = `rotate(${direction * 5}deg)`;

            setTimeout(() => {
                wheel.style.transition = 'none';
                wheel.style.transform = '';
            }, 600);
        }
    }

    // ============================================
    // TOOLTIP SYSTEM
    // ============================================
    const tooltip = document.getElementById('glyph-tooltip');

    function showTooltip(e, glyph, translation) {
        tooltip.querySelector('.tooltip-glyph').textContent = glyph;
        tooltip.querySelector('.tooltip-translation').textContent = translation;
        tooltip.classList.add('visible');

        const rect = tooltip.getBoundingClientRect();
        let x = e.clientX + 15;
        let y = e.clientY + 15;

        if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - 15;
        if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - 15;

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    function hideTooltip() {
        tooltip.classList.remove('visible');
    }

    // ============================================
    // DEITY CYCLE DISPLAY
    // ============================================
    function initDeityCycle() {
        const container = document.getElementById('deity-list');
        const day = getTonalpohualliDay(selectedDay);
        const deityIndex = selectedDay % deities.length;
        const primaryDeity = deities[deityIndex];
        const secondaryDeity = deities[(deityIndex + 6) % deities.length];

        container.innerHTML = `
            <div class="deity-item">
                <div class="deity-icon">${primaryDeity.icon}</div>
                <div>
                    <div class="deity-name">${primaryDeity.name}</div>
                    <div class="deity-desc">${primaryDeity.desc}</div>
                    <div class="tribute-schedule" style="color: var(--jade-light); margin-top: 4px;">
                        Domain: ${primaryDeity.domain}
                    </div>
                </div>
            </div>
            <div class="deity-item">
                <div class="deity-icon">${secondaryDeity.icon}</div>
                <div>
                    <div class="deity-name">${secondaryDeity.name}</div>
                    <div class="deity-desc">${secondaryDeity.desc}</div>
                    <div class="tribute-schedule" style="color: var(--jade-light); margin-top: 4px;">
                        Allied: ${secondaryDeity.domain}
                    </div>
                </div>
            </div>
        `;

        // Add cyclic rotation
        setInterval(() => {
            selectedDay = (selectedDay + 1) % 260;
            const newDay = getTonalpohualliDay(selectedDay);
            const newDeityIndex = selectedDay % deities.length;
            const newPrimary = deities[newDeityIndex];
            const newSecondary = deities[(newDeityIndex + 6) % deities.length];

            container.innerHTML = `
                <div class="deity-item" style="animation: fadeIn 0.5s ease">
                    <div class="deity-icon">${newPrimary.icon}</div>
                    <div>
                        <div class="deity-name">${newPrimary.name}</div>
                        <div class="deity-desc">${newPrimary.desc}</div>
                        <div class="tribute-schedule" style="color: var(--jade-light); margin-top: 4px;">
                            Domain: ${newPrimary.domain}
                        </div>
                    </div>
                </div>
                <div class="deity-item" style="animation: fadeIn 0.5s ease 0.2s both">
                    <div class="deity-icon">${newSecondary.icon}</div>
                    <div>
                        <div class="deity-name">${newSecondary.name}</div>
                        <div class="deity-desc">${newSecondary.desc}</div>
                        <div class="tribute-schedule" style="color: var(--jade-light); margin-top: 4px;">
                            Allied: ${newSecondary.domain}
                        </div>
                    </div>
                </div>
            `;
        }, 5000);
    }

    // ============================================
    // TRIBUTE DISPLAY
    // ============================================
    function initTributes() {
        const container = document.getElementById('tribute-list');
        const day = getTonalpohualliDay(selectedDay);
        const tributeIndex = selectedDay % tributes.length;

        let html = '';
        for (let i = 0; i < tributes.length; i++) {
            const t = tributes[i];
            const isActive = i === tributeIndex;
            html += `
                <div class="tribute-item" style="animation: fadeIn 0.4s ease ${i * 0.1}s both; ${isActive ? 'border-left-color: var(--gold); background: rgba(212,175,55,0.1);' : ''}">
                    <div class="tribute-icon">${t.icon}</div>
                    <div>
                        <div class="tribute-name">${t.name}</div>
                        <div class="tribute-desc">${t.desc}</div>
                        <div class="tribute-schedule">◈ ${t.schedule}</div>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    }

    // ============================================
    // ASTRONOMICAL EVENTS
    // ============================================
    function initAstronomicalEvents() {
        const container = document.getElementById('event-list');
        const events = getUpcomingEvents();

        let html = '';
        events.forEach((e, i) => {
            const countdown = Math.max(0, Math.floor((e.date - new Date()) / 86400000));
            html += `
                <div class="event-item" style="animation: fadeIn 0.4s ease ${i * 0.1}s both">
                    <div class="event-icon">${e.icon}</div>
                    <div>
                        <div class="event-name">${e.name}</div>
                        <div class="event-desc">${e.desc}</div>
                    </div>
                    <div class="event-countdown">
                        ${countdown}d remaining
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // ============================================
    // RITUAL DATES
    // ============================================
    function initRituals() {
        const container = document.getElementById('ritual-list');

        let html = '';
        rituals.forEach((r, i) => {
            html += `
                <div class="ritual-item" style="animation: fadeIn 0.4s ease ${i * 0.1}s both">
                    <div class="ritual-icon">${r.icon}</div>
                    <div>
                        <div class="ritual-name">${r.name}</div>
                        <div class="ritual-desc">${r.desc}</div>
                        <div class="tribute-schedule">◈ ${r.day}</div>
                    </div>
                    <span class="ritual-priority ${r.priority}">${r.priority}</span>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // ============================================
    // AUTOMATIC DAY PROGRESSION
    // ============================================
    function initAutoProgression() {
        let dayCounter = 0;
        const dayCell = document.querySelector('.day-cell.active');

        setInterval(() => {
            dayCounter++;
            if (dayCounter >= 260) dayCounter = 0;

            const cells = document.querySelectorAll('.day-cell');
            cells.forEach((cell, i) => {
                cell.classList.remove('active');
                if (i === dayCounter) {
                    cell.classList.add('active');
                }
            });

            const day = getTonalpohualliDay(dayCounter);
            const deityIndex = dayCounter % deities.length;
            const primaryDeity = deities[deityIndex];
            const secondaryDeity = deities[(deityIndex + 6) % deities.length];

            const container = document.getElementById('deity-list');
            container.innerHTML = `
                <div class="deity-item" style="animation: fadeIn 0.5s ease">
                    <div class="deity-icon">${primaryDeity.icon}</div>
                    <div>
                        <div class="deity-name">${primaryDeity.name}</div>
                        <div class="deity-desc">${primaryDeity.desc}</div>
                        <div class="tribute-schedule" style="color: var(--jade-light); margin-top: 4px;">
                            Domain: ${primaryDeity.domain}
                        </div>
                    </div>
                </div>
                <div class="deity-item" style="animation: fadeIn 0.5s ease 0.2s both">
                    <div class="deity-icon">${secondaryDeity.icon}</div>
                    <div>
                        <div class="deity-name">${secondaryDeity.name}</div>
                        <div class="deity-desc">${secondaryDeity.desc}</div>
                        <div class="tribute-schedule" style="color: var(--jade-light); margin-top: 4px;">
                            Allied: ${secondaryDeity.domain}
                        </div>
                    </div>
                </div>
            `;
        }, 3000);
    }

    // ============================================
    // STAGGERED PAGE LOAD ANIMATIONS
    // ============================================
    function initPageLoad() {
        const elements = document.querySelectorAll('.panel-title, .deity-item, .tribute-item, .event-item, .ritual-item, .day-cell');

        // Animate title
        const title = document.querySelector('.title-glyph');
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        setTimeout(() => {
            title.style.transition = 'all 1s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 200);

        // Animate subtitle
        const subtitle = document.querySelector('.subtitle-glyph');
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(20px)';
        setTimeout(() => {
            subtitle.style.transition = 'all 1s ease 0.3s';
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 500);

        // Animate solar disc
        const solarDisc = document.querySelector('.solar-disc');
        solarDisc.style.opacity = '0';
        solarDisc.style.transform = 'scale(0.5) rotate(-180deg)';
        setTimeout(() => {
            solarDisc.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            solarDisc.style.opacity = '1';
            solarDisc.style.transform = 'scale(1) rotate(0deg)';
        }, 300);

        // Animate eclipse timer
        const timer = document.querySelector('.eclipse-timer');
        timer.style.opacity = '0';
        timer.style.transform = 'translateX(20px)';
        setTimeout(() => {
            timer.style.transition = 'all 0.8s ease 0.5s';
            timer.style.opacity = '1';
            timer.style.transform = 'translateX(0)';
        }, 600);

        // Animate panels
        const panels = document.querySelectorAll('.deity-cycle-panel, .tribute-panel, .astronomical-events, .ritual-dates');
        panels.forEach((panel, i) => {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(30px)';
            setTimeout(() => {
                panel.style.transition = `all 0.8s ease ${0.8 + i * 0.15}s`;
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(0)';
            }, 800);
        });

        // Animate day cells in stagger
        const cells = document.querySelectorAll('.day-cell');
        cells.forEach((cell, i) => {
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0)';
            setTimeout(() => {
                cell.style.transition = `all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.5 + (i % 20) * 0.02}s`;
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1)';
            }, 1000);
        });

        // Animate wheel controls
        const controls = document.querySelectorAll('.wheel-btn');
        controls.forEach((btn, i) => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            setTimeout(() => {
                btn.style.transition = `all 0.6s ease ${1.2 + i * 0.2}s`;
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, 1200);
        });
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            const cells = document.querySelectorAll('.day-cell');
            const currentActive = document.querySelector('.day-cell.active');

            if (!currentActive) return;

            let currentIndex = Array.from(cells).indexOf(currentActive);

            if (e.key === 'ArrowRight' || e.key === 'd') {
                currentIndex = (currentIndex + 1) % 260;
            } else if (e.key === 'ArrowLeft' || e.key === 'a') {
                currentIndex = (currentIndex - 1 + 260) % 260;
            }

            cells[currentIndex].click();
            cells[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        });
    }

    // ============================================
    // AMBIENT PARTICLE SYSTEM
    // ============================================
    function initParticles() {
        const particleCount = 30;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: ${Math.random() > 0.5 ? 'var(--gold)' : 'var(--jade-light)'};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                opacity: ${Math.random() * 0.5 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                box-shadow: 0 0 4px ${Math.random() > 0.5 ? 'rgba(212,175,55,0.5)' : 'rgba(0,107,63,0.5)'};
            `;
            document.body.appendChild(particle);
            particles.push({
                el: particle,
                x: parseFloat(particle.style.left),
                y: parseFloat(particle.style.top),
                speedX: (Math.random() - 0.5) * 0.02,
                speedY: (Math.random() - 0.5) * 0.02
            });
        }

        function animateParticles() {
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = 100;
                if (p.x > 100) p.x = 0;
                if (p.y < 0) p.y = 100;
                if (p.y > 100) p.y = 0;

                p.el.style.left = `${p.x}%`;
                p.el.style.top = `${p.y}%`;
                p.el.style.opacity = `${Math.sin(Date.now() * 0.001 + p.x) * 0.3 + 0.2}`;
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // ============================================
    // CURSOR CUSTOMIZATION
    // ============================================
    function initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 1px solid var(--gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        const cursorGlow = document.createElement('div');
        cursorGlow.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px var(--gold), 0 0 20px rgba(212,175,55,0.3);
        `;
        document.body.appendChild(cursorGlow);

        let isHovering = false;

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;

            if (isHovering) {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderColor = 'var(--blood-bright)';
            } else {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.borderColor = 'var(--gold)';
            }
        });

        document.querySelectorAll('button, .day-cell, .deity-item, .tribute-item, .event-item, .ritual-item').forEach(el => {
            el.addEventListener('mouseenter', () => { isHovering = true; });
            el.addEventListener('mouseleave', () => { isHovering = false; });
        });
    }

    // ============================================
    // FADE-IN KEYFRAME
    // ============================================
    const fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(fadeInStyle);

    // ============================================
    // INIT
    // ============================================
    generateCalendarWheel();
    initEclipseTimer();
    initWheelControls();
    initDeityCycle();
    initTributes();
    initAstronomicalEvents();
    initRituals();
    initAutoProgression();
    initPageLoad();
    initKeyboardNav();
    initParticles();
    initCustomCursor();
});