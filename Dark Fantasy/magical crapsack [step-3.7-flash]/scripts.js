/* ============================================
   THE SUNDERED REALMS — SCRIPTS
   A Chronicle of Agony — Interactive Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // CORE INITIALIZATION
    // ============================================
    const worldWrapper = document.querySelector('.world-wrapper');
    const cursorGlow = document.getElementById('cursor-glow');
    const particleContainer = document.getElementById('particle-container');
    const nav = document.querySelector('.realm-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // ============================================
    // CURSOR GLOW EFFECT
    // ============================================
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        if (cursorGlow) {
            cursorGlow.style.left = cursorX + 'px';
            cursorGlow.style.top = cursorY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ============================================
    // ASH PARTICLE SYSTEM
    // ============================================
    function createParticle() {
        if (!particleContainer) return;
        
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 10 + 10;
        const opacity = Math.random() * 0.5 + 0.1;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(139, 0, 0, ${opacity});
            border-radius: 50%;
            left: ${startX}px;
            top: -10px;
            pointer-events: none;
            animation: fall ${duration}s linear forwards;
            box-shadow: 0 0 ${size * 2}px rgba(139, 0, 0, ${opacity * 0.5});
        `;
        
        particleContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // Add particle animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Create particles periodically
    setInterval(createParticle, 300);

    // ============================================
    // NAVIGATION
    // ============================================
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
        });

        // Close mobile nav when clicking links
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Nav scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (nav) {
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
        lastScroll = currentScroll;
    });

    // ============================================
    // SUFFERING INDEX — MISERY METER
    // ============================================
    const miseryFill = document.getElementById('misery-fill');
    const tormentLevel = document.getElementById('torment-level');
    const afflictionCount = document.getElementById('affliction-count');
    const soulsCount = document.getElementById('souls-count');

    // Animate meter on scroll into view
    const miseryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (miseryFill) {
                    miseryFill.style.height = '87.4%';
                }
                animateStats();
                miseryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const sufferingSection = document.getElementById('suffering-index');
    if (sufferingSection) {
        miseryObserver.observe(sufferingSection);
    }

    function animateStats() {
        // Animate torment level
        if (tormentLevel) {
            let current = 0;
            const target = 87.4;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                tormentLevel.textContent = current.toFixed(1) + '%';
            }, 30);
        }

        // Animate affliction count
        if (afflictionCount) {
            let current = 0;
            const target = 2847;
            const increment = target / 80;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                afflictionCount.textContent = Math.floor(current).toLocaleString();
            }, 20);
        }

        // Animate souls count (oscillating infinity)
        if (soulsCount) {
            let frame = 0;
            const animateSouls = () => {
                frame++;
                const symbols = ['∞', '∞∞', '∞∞∞', '∞', '∞∞'];
                soulsCount.textContent = symbols[Math.floor(frame / 30) % symbols.length];
                if (frame < 300) {
                    requestAnimationFrame(animateSouls);
                } else {
                    soulsCount.textContent = '∞';
                }
            };
            animateSouls();
        }
    }

    // Animate breakdown bars
    const breakdownBars = document.querySelectorAll('.breakdown-fill');
    const breakdownObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                entry.target.style.width = width + '%';
                breakdownObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    breakdownBars.forEach(bar => breakdownObserver.observe(bar));

    // ============================================
    // CURSE TRACKER
    // ============================================
    const curseData = [
        {
            name: "The Withering Touch",
            status: "active",
            description: "Skin turns to ash upon contact with sunlight. Victims must live only in perpetual darkness, their bodies slowly crumbling from within.",
            origin: "Contract with a demon of decay",
            victims: "1,247",
            region: "The Ashlands"
        },
        {
            name: "Echoes of the Damned",
            status: "active",
            description: "The victim hears the constant screaming of everyone they have ever killed. Sleep is impossible. Madness follows within weeks.",
            origin: "Cursed battlefield of Eldritch Vale",
            victims: "892",
            region: "The Shattered Plains"
        },
        {
            name: "The Hollowing",
            status: "terminal",
            description: "The soul slowly vacates the body, leaving behind a breathing husk. The process takes exactly 13 moons. No cure exists.",
            origin: "The God of Death's final breath",
            victims: "3,401",
            region: "The Gray Wastes"
        },
        {
            name: "Blood Boil",
            status: "active",
            description: "The victim's blood turns to acid from within. They die screaming as their own veins dissolve. Highly contagious through blood contact.",
            origin: "Biological weapon from the Northern Hordes",
            victims: "5,000+",
            region: "Multiple"
        },
        {
            name: "Stoneheart",
            status: "dormant",
            description: "The heart gradually petrifies. The victim feels every crack and fissure as it spreads. Currently dormant, awaiting the Blood Moon.",
            origin: "Gorgon's curse upon a king",
            victims: "23",
            region: "The Stone Gardens"
        },
        {
            name: "Memory Leech",
            status: "curable",
            description: "Memories drain away like water through a sieve. The victim forgets loved ones, then themselves. Can be cured with a rare potion.",
            origin: "Faceless one's kiss",
            victims: "456",
            region: "The Mistlands"
        },
        {
            name: "The Itch",
            status: "active",
            description: "An unending itch beneath the skin that drives victims to scratch themselves to pieces. The sensation spreads to others within 10 paces.",
            origin: "Unknown",
            victims: "12,000+",
            region: "The Festering Marshes"
        },
        {
            name: "Soul Sickness",
            status: "active",
            description: "The victim's soul becomes visible as a black mist. They can no longer feel warmth, love, or joy. Only emptiness remains.",
            origin: "Wizard's failed experiment",
            victims: "334",
            region: "The Academy Ruins"
        },
        {
            name: "The Walking Death",
            status: "terminal",
            description: "The victim dies but continues to move, driven by an insatiable hunger for living flesh. They retain no memory of their former self.",
            origin: "Necromantic plague",
            victims: "∞",
            region: "The Deadlands"
        },
        {
            name: "Void Gaze",
            status: "dormant",
            description: "Those who meet the victim's eyes see the void where their soul should be. They fall into despair and eventually take their own lives.",
            origin: "Cult of the End",
            victims: "67",
            region: "Hidden temples"
        },
        {
            name: "The Weeping",
            status: "active",
            description: "The victim cries tears of blood continuously. They cannot stop, even as they dehydrate. The tears are highly corrosive.",
            origin: "Banshee's lament",
            victims: "189",
            region: "The Crying Caves"
        },
        {
            name: "Flesh Rot",
            status: "curable",
            description: "Flesh decays rapidly while the victim remains conscious and feeling. Can be halted with silver salts, but the damage is permanent.",
            origin: "Witch's hex",
            victims: "1,102",
            region: "The Blightwood"
        }
    ];

    function renderCurses(filter = 'all') {
        const grid = document.getElementById('curse-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const filteredCurses = filter === 'all' 
            ? curseData 
            : curseData.filter(curse => {
                if (filter === 'curable') return curse.status === 'curable';
                if (filter === 'terminal') return curse.status === 'terminal';
                return curse.status === filter;
            });

        filteredCurses.forEach((curse, index) => {
            const card = document.createElement('div');
            card.className = 'curse-card reveal';
            card.style.transitionDelay = `${index * 0.1}s`;
            
            const statusClass = `status-${curse.status}`;
            
            card.innerHTML = `
                <div class="curse-header">
                    <h3 class="curse-name">${curse.name}</h3>
                    <span class="curse-status ${statusClass}">${curse.status}</span>
                </div>
                <p class="curse-description">${curse.description}</p>
                <div class="curse-meta">
                    <span>Origin: ${curse.origin}</span>
                    <span>Region: ${curse.region}</span>
                </div>
            `;
            
            grid.appendChild(card);
            
            // Trigger reveal animation
            setTimeout(() => {
                card.classList.add('active');
            }, 50);
        });

        // Update total count
        const totalCount = document.getElementById('total-curses');
        if (totalCount) {
            totalCount.textContent = curseData.length;
        }
    }

    // Curse filter buttons
    const filterBtns = document.querySelectorAll('.control-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            renderCurses(filter);
        });
    });

    // Initialize curse grid
    renderCurses();

    // ============================================
    // DARK RITUAL CALENDAR
    // ============================================
    const ritualDates = [
        { date: 1, type: 'minor', name: 'Day of Whispers', desc: 'Minor observance. The veil is thin.' },
        { date: 7, type: 'minor', name: 'Blood Moon Rising', desc: 'Minor observance. Blood magic is amplified.' },
        { date: 13, type: 'major', name: 'The Black Sacrament', desc: 'Major ritual. Human sacrifice required.' },
        { date: 15, type: 'new', name: 'New Curse Day', desc: 'A new curse is born at midnight.' },
        { date: 21, type: 'major', name: 'Eclipse of Hope', desc: 'Major ritual. All light is extinguished for one hour.' },
        { date: 26, type: 'minor', name: 'Remembrance of the Fallen', desc: 'Minor observance. The dead walk among us.' },
        { date: 28, type: 'major', name: 'The Grand Unbinding', desc: 'Major ritual. Chains of the underworld are loosened.' }
    ];

    const monthNames = [
        "The Month of Wailing Souls",
        "The Month of Blood and Ash",
        "The Month of the Long Night",
        "The Month of Frozen Tears",
        "The Month of the Black Sun",
        "The Month of Rotting Bloom"
    ];

    let currentMonth = 0;
    let currentYear = 1; // Years since the Sundering

    function renderCalendar(month, year) {
        const grid = document.getElementById('calendar-grid');
        const monthYearEl = document.getElementById('cal-month-year');
        if (!grid) return;

        // Update header
        if (monthYearEl) {
            monthYearEl.textContent = `${monthNames[month]} — Year ${year}`;
        }

        // Generate days
        grid.innerHTML = '';
        const daysInMonth = 30; // Simplified
        const startDay = Math.floor(Math.random() * 7); // Random start day for variety

        // Empty cells for days before start
        for (let i = 0; i < startDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'cal-day empty';
            grid.appendChild(empty);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'cal-day';
            dayEl.textContent = day;
            
            // Check for rituals
            const ritual = ritualDates.find(r => r.date === day);
            if (ritual) {
                dayEl.classList.add(`ritual-${ritual.type}`);
                dayEl.dataset.ritual = JSON.stringify(ritual);
                dayEl.addEventListener('click', () => showRitualDetail(ritual));
            }
            
            grid.appendChild(dayEl);
        }
    }

    function showRitualDetail(ritual) {
        // Could add a modal or expand details
        console.log(`Ritual: ${ritual.name} - ${ritual.desc}`);
    }

    // Calendar navigation
    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth = (currentMonth - 1 + monthNames.length) % monthNames.length;
            if (currentMonth === monthNames.length - 1) currentYear--;
            renderCalendar(currentMonth, currentYear);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentMonth = (currentMonth + 1) % monthNames.length;
            if (currentMonth === 0) currentYear++;
            renderCalendar(currentMonth, currentYear);
        });
    }

    // Render initial calendar
    renderCalendar(currentMonth, currentYear);

    // Upcoming rituals
    const ritualList = document.getElementById('ritual-list');
    if (ritualList) {
        const upcoming = ritualDates
            .filter(r => r.type === 'major' || r.type === 'new')
            .slice(0, 3);
        
        upcoming.forEach(ritual => {
            const item = document.createElement('div');
            item.className = 'ritual-item';
            item.innerHTML = `
                <div class="ritual-date">${ritual.date}</div>
                <div class="ritual-info">
                    <h4>${ritual.name}</h4>
                    <p>${ritual.desc}</p>
                </div>
            `;
            ritualList.appendChild(item);
        });
    }

    // ============================================
    // BLIGHT MAP INTERACTION
    // ============================================
    const mapSurface = document.getElementById('blight-map-surface');
    const territoryName = document.querySelector('.territory-name');
    const territoryDesc = document.querySelector('.territory-desc');
    const territoryStats = document.getElementById('territory-stats');

    const territories = [
        {
            name: "The Voidheart",
            desc: "The epicenter of corruption. Reality itself has broken down here. No life survives, yet something watches from the nothingness.",
            x: 50, y: 50,
            stats: { corruption: 100, population: 0, hope: 0 }
        },
        {
            name: "The Ash Wastes",
            desc: "Endless fields of gray ash where once great forests stood. The wind carries the dust of a billion dead trees.",
            x: 30, y: 40,
            stats: { corruption: 85, population: "12,000", hope: "3%" }
        },
        {
            name: "The Blighted Lands",
            desc: "Farmland turned to toxic sludge. Crops grow twisted and wrong. Those who eat them sicken within hours.",
            x: 70, y: 60,
            stats: { corruption: 65, population: "45,000", hope: "12%" }
        },
        {
            name: "The Contested Border",
            desc: "Where the forces of light make their last stand. Daily battles rage here. Neither side gains ground for long.",
            x: 45, y: 30,
            stats: { corruption: 40, population: "120,000", hope: "34%" }
        },
        {
            name: "The Sanctuary Hills",
            desc: "One of the few remaining safe havens. Protected by ancient wards, but the protection is fading.",
            x: 20, y: 70,
            stats: { corruption: 15, population: "80,000", hope: "67%" }
        },
        {
            name: "The Crying Coast",
            desc: "Where the ocean has turned to brine. Ships that sail here never return. Their crews' ghosts are said to walk the shore.",
            x: 80, y: 45,
            stats: { corruption: 72, population: "5,000", hope: "8%" }
        }
    ];

    if (mapSurface) {
        // Create territory hotspots
        territories.forEach(territory => {
            const hotspot = document.createElement('div');
            hotspot.className = 'territory-hotspot';
            hotspot.style.cssText = `
                position: absolute;
                left: ${territory.x}%;
                top: ${territory.y}%;
                width: 40px;
                height: 40px;
                transform: translate(-50%, -50%);
                background: radial-gradient(circle, rgba(139, 0, 0, 0.6) 0%, transparent 70%);
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s;
                z-index: 10;
            `;
            
            hotspot.addEventListener('mouseenter', () => {
                hotspot.style.background = 'radial-gradient(circle, rgba(139, 0, 0, 0.9) 0%, transparent 70%)';
                hotspot.style.transform = 'translate(-50%, -50%) scale(1.2)';
                updateTerritoryInfo(territory);
            });
            
            hotspot.addEventListener('mouseleave', () => {
                hotspot.style.background = 'radial-gradient(circle, rgba(139, 0, 0, 0.6) 0%, transparent 70%)';
                hotspot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
            
            hotspot.addEventListener('click', () => {
                updateTerritoryInfo(territory, true);
            });
            
            mapSurface.appendChild(hotspot);
        });

        // Add some blight texture
        for (let i = 0; i < 30; i++) {
            const blight = document.createElement('div');
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 60 + 20;
            const opacity = Math.random() * 0.3;
            
            blight.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(139, 0, 0, ${opacity}) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                animation: pulse 4s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            mapSurface.appendChild(blight);
        }
    }

    function updateTerritoryInfo(territory, permanent = false) {
        if (territoryName) territoryName.textContent = territory.name;
        if (territoryDesc) territoryDesc.textContent = territory.desc;
        
        if (territoryStats) {
            territoryStats.innerHTML = `
                <div class="territory-stat">
                    <span class="territory-stat-value">${territory.stats.corruption}%</span>
                    <span class="territory-stat-label">Corruption</span>
                </div>
                <div class="territory-stat">
                    <span class="territory-stat-value">${territory.stats.population}</span>
                    <span class="territory-stat-label">Population</span>
                </div>
                <div class="territory-stat">
                    <span class="territory-stat-value">${territory.stats.hope}</span>
                    <span class="territory-stat-label">Hope Remaining</span>
                </div>
            `;
        }
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // Also observe dynamically added curse cards
    const curseGrid = document.getElementById('curse-grid');
    if (curseGrid) {
        const curseObserver = new MutationObserver(() => {
            curseGrid.querySelectorAll('.curse-card').forEach(card => {
                if (!card.classList.contains('reveal')) {
                    revealObserver.observe(card);
                }
            });
        });
        curseObserver.observe(curseGrid, { childList: true });
    }

    // ============================================
    // ARTIFACT MOUSE TRACKING
    // ============================================
    const artifactCards = document.querySelectorAll('.artifact-card');
    artifactCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // ============================================
    // DYNAMIC MISERY FLUCTUATION
    // ============================================
    function fluctuateMisery() {
        if (tormentLevel && miseryFill) {
            const baseTorment = 87.4;
            const fluctuation = (Math.random() - 0.5) * 2; // ±1%
            const newTorment = baseTorment + fluctuation;
            
            tormentLevel.textContent = newTorment.toFixed(1) + '%';
            miseryFill.style.height = newTorment + '%';
            
            // Update trend indicator
            const trend = document.querySelector('.stat-trend');
            if (trend) {
                if (fluctuation > 0.5) {
                    trend.textContent = '▲ Rising';
                    trend.className = 'stat-trend trend-up';
                } else if (fluctuation < -0.5) {
                    trend.textContent = '▼ Falling';
                    trend.className = 'stat-trend trend-down';
                } else {
                    trend.textContent = '◆ Stable';
                    trend.className = 'stat-trend trend-stable';
                }
            }
        }
    }

    // Fluctuate every 5 seconds
    setInterval(fluctuateMisery, 5000);

    // ============================================
    // RITUAL COUNTDOWN
    // ============================================
    function updateRitualCountdown() {
        const ritualItems = document.querySelectorAll('.ritual-item');
        ritualItems.forEach(item => {
            const dateEl = item.querySelector('.ritual-date');
            if (dateEl) {
                const ritualDate = parseInt(dateEl.textContent);
                const today = new Date().getDate();
                const daysUntil = (ritualDate - today + 30) % 30;
                if (daysUntil === 0) {
                    dateEl.textContent = 'TODAY';
                    dateEl.style.color = '#ff4444';
                } else {
                    dateEl.textContent = `${daysUntil}d`;
                }
            }
        });
    }

    updateRitualCountdown();
    setInterval(updateRitualCountdown, 3600000); // Update every hour

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', (e) => {
        // ESC to close mobile nav
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // ============================================
    // INITIALIZATION COMPLETE
    // ============================================
    console.log('%c☠ The Sundered Realms have been summoned ☠', 
        'color: #8b0000; font-family: serif; font-size: 16px; text-shadow: 0 0 10px rgba(139,0,0,0.5);');
    console.log('%c"Hope is the first casualty of this world."', 
        'color: #d4c5a9; font-style: italic;');
});