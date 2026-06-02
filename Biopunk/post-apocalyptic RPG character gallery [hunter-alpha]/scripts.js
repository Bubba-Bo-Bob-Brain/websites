/* ============================================================
   BIODATA::ARCHIVE — BIOPUNK RPG CHARACTER GALLERY
   Post-Apocalyptic Terminal Interface Scripts
   ============================================================ */

(function() {
    'use strict';

    // ─── DOM References ────────────────────────────────────────
    const dom = {
        systemClock: document.getElementById('systemClock'),
        entityCount: document.getElementById('entityCount'),
        corruptionFill: document.getElementById('corruptionFill'),
        corruptionPct: document.getElementById('corruptionPct'),
        dataRain: document.getElementById('dataRain'),
        dnaLeft: document.getElementById('dnaLeft'),
        dnaRight: document.getElementById('dnaRight'),
        characterGrid: document.getElementById('characterGrid'),
        modalOverlay: document.getElementById('modalOverlay'),
        modalTerminal: document.getElementById('modalTerminal'),
        modalContent: document.getElementById('modalContent'),
        modalClose: document.getElementById('modalClose'),
        filterBtns: document.querySelectorAll('.filter-btn[data-filter]'),
        factionBtns: document.querySelectorAll('.filter-btn[data-faction]'),
        charCards: document.querySelectorAll('.char-card'),
        ticker: document.getElementById('ticker')
    };

    // ─── System Clock ──────────────────────────────────────────
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        dom.systemClock.textContent = `SYS:${hours}:${mins}:${secs}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // ─── Entity Count Animation ────────────────────────────────
    function animateEntityCount() {
        const target = 8;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            
            dom.entityCount.textContent = String(current).padStart(3, '0');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                dom.entityCount.textContent = String(target).padStart(3, '0');
                // Add final glitch
                dom.entityCount.style.animation = 'text-glitch 0.3s ease';
                setTimeout(() => {
                    dom.entityCount.style.animation = '';
                }, 300);
            }
        }

        requestAnimationFrame(update);
    }

    // ─── Corruption Bar Animation ──────────────────────────────
    function animateCorruption() {
        const targetPercent = 26.8;
        const duration = 3000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 2);
            const current = (eased * targetPercent).toFixed(1);
            
            dom.corruptionFill.style.width = `${current}%`;
            dom.corruptionPct.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ─── Data Rain Canvas (Matrix Effect) ──────────────────────
    function initDataRain() {
        const canvas = dom.dataRain;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height, columns, drops;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const charArray = chars.split('');

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / 20);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * height;
            }
        }

        function draw() {
            ctx.fillStyle = 'rgba(4, 8, 6, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#00ff41';
            ctx.font = '14px monospace';

            for (let i = 0; i < drops.length; i++) {
                const char = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * 20;
                const y = drops[i];

                // Random brightness
                const brightness = Math.random();
                if (brightness > 0.98) {
                    ctx.fillStyle = '#ffffff';
                } else if (brightness > 0.9) {
                    ctx.fillStyle = '#aaff00';
                } else {
                    ctx.fillStyle = '#00ff41';
                }

                ctx.fillText(char, x, y);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += 20;
            }

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        resize();
        draw();
    }

    // ─── DNA Helix Generation ──────────────────────────────────
    function generateDNAHelix(container, side) {
        if (!container) return;

        const height = window.innerHeight;
        const nodeSpacing = 40;
        const nodeCount = Math.floor(height / nodeSpacing);

        for (let i = 0; i < nodeCount; i++) {
            const y = i * nodeSpacing;
            const phase = (i / nodeCount) * Math.PI * 4;
            const offset = Math.sin(phase) * 15;

            // Left node
            const nodeLeft = document.createElement('div');
            nodeLeft.className = 'dna-node dna-node--left';
            nodeLeft.style.top = `${y}px`;
            nodeLeft.style.left = `${25 + offset}px`;
            nodeLeft.style.animationDelay = `${i * 0.1}s`;
            container.appendChild(nodeLeft);

            // Right node
            const nodeRight = document.createElement('div');
            nodeRight.className = 'dna-node dna-node--right dna-node--pair';
            nodeRight.style.top = `${y}px`;
            nodeRight.style.right = `${25 - offset}px`;
            nodeRight.style.animationDelay = `${i * 0.1 + 0.5}s`;
            container.appendChild(nodeRight);

            // Connector
            const connector = document.createElement('div');
            connector.className = 'dna-connector';
            connector.style.top = `${y + 2}px`;
            connector.style.left = `${28 + offset}px`;
            connector.style.width = `${14 - offset * 2}px`;
            connector.style.animationDelay = `${i * 0.1 + 0.25}s`;
            container.appendChild(connector);
        }
    }

    // ─── Filter System ─────────────────────────────────────────
    let activeFilter = 'all';
    let activeFaction = 'all';

    function updateFilters() {
        dom.charCards.forEach(card => {
            const species = card.dataset.species;
            const faction = card.dataset.faction;
            
            const matchesSpecies = activeFilter === 'all' || species === activeFilter;
            const matchesFaction = activeFaction === 'all' || faction === activeFaction;
            
            if (matchesSpecies && matchesFaction) {
                card.classList.remove('char-card--hidden');
                card.classList.add('char-card--visible');
                // Staggered reveal
                card.style.animationDelay = `${Math.random() * 0.3}s`;
            } else {
                card.classList.add('char-card--hidden');
                card.classList.remove('char-card--visible');
            }
        });

        // Update visible count
        const visibleCount = document.querySelectorAll('.char-card:not(.char-card--hidden)').length;
        dom.entityCount.textContent = String(visibleCount).padStart(3, '0');
    }

    function initFilters() {
        dom.filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                dom.filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
                this.classList.add('filter-btn--active');
                activeFilter = this.dataset.filter;
                updateFilters();
            });
        });

        dom.factionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                dom.factionBtns.forEach(b => b.classList.remove('filter-btn--active'));
                this.classList.add('filter-btn--active');
                activeFaction = this.dataset.faction;
                updateFilters();
            });
        });
    }

    // ─── Character Card Interactions ───────────────────────────
    function initCharCards() {
        dom.charCards.forEach(card => {
            // Hover sound effect simulation via visual feedback
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.01)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });

            // Click to open detail modal
            card.addEventListener('click', function() {
                openModal(this);
            });
        });
    }

    // ─── Modal System ──────────────────────────────────────────
    function openModal(card) {
        const charData = extractCharData(card);
        dom.modalContent.innerHTML = generateModalContent(charData);
        dom.modalOverlay.classList.add('modal-overlay--active');
        dom.modalTerminal.classList.add('modal-terminal--active');
        document.body.style.overflow = 'hidden';

        // Trigger stat bar animations
        setTimeout(() => {
            const statFills = dom.modalContent.querySelectorAll('.stat-row__fill');
            statFills.forEach(fill => {
                const value = fill.style.getPropertyValue('--stat-value');
                fill.style.width = value;
            });
        }, 100);
    }

    function closeModal() {
        dom.modalOverlay.classList.remove('modal-overlay--active');
        dom.modalTerminal.classList.remove('modal-terminal--active');
        document.body.style.overflow = '';
    }

    function extractCharData(card) {
        const name = card.querySelector('.char-card__name')?.textContent || 'UNKNOWN';
        const id = card.querySelector('.char-card__id')?.textContent || '#ENT-0000';
        const charClass = card.querySelector('.char-card__class')?.textContent || 'CLASSIFIED';
        const faction = card.querySelector('.faction-badge')?.textContent || 'NO FACTION';
        const bio = card.querySelector('.char-card__bio')?.textContent || 'No data available.';
        const mutValue = card.querySelector('.mutation-indicator__value')?.textContent || '0%';
        const species = card.dataset.species || 'unknown';
        const charId = card.dataset.char || 'unknown';

        const stats = {};
        card.querySelectorAll('.stat-row').forEach(row => {
            const label = row.querySelector('.stat-row__label')?.textContent;
            const value = row.querySelector('.stat-row__value')?.textContent;
            if (label && value) stats[label] = value;
        });

        const skills = [];
        card.querySelectorAll('.skill-tag').forEach(tag => {
            skills.push(tag.textContent);
        });

        const contamLevel = card.querySelector('.contam-meter__level')?.textContent || 'LEVEL 0.0';

        return { name, id, charClass, faction, bio, mutValue, species, charId, stats, skills, contamLevel };
    }

    function generateModalContent(data) {
        const factionClass = data.faction.toLowerCase().includes('iron') ? 'faction-badge--ironroot' :
                            data.faction.toLowerCase().includes('flesh') ? 'faction-badge--fleshweavers' :
                            data.faction.toLowerCase().includes('rot') ? 'faction-badge--rotborn' :
                            'faction-badge--nullwave';

        return `
            <div class="modal-entity">
                <div class="modal-entity__header">
                    <div class="modal-entity__portrait">
                        <div class="portrait-placeholder portrait-placeholder--large">
                            <div class="portrait-placeholder__scanlines"></div>
                            <div class="portrait-placeholder__icon">
                                <span class="pixel-skull pixel-skull--large">☠</span>
                            </div>
                            <span class="portrait-placeholder__text">[IMG_PENDING]</span>
                        </div>
                    </div>
                    <div class="modal-entity__info">
                        <h2 class="modal-entity__name">${data.name}</h2>
                        <span class="modal-entity__id">${data.id}</span>
                        <span class="modal-entity__class">${data.charClass}</span>
                        <span class="faction-badge ${factionClass}">${data.faction}</span>
                        <span class="modal-entity__species">SPECIES: ${data.species.toUpperCase()}</span>
                    </div>
                </div>

                <div class="modal-entity__section">
                    <h3 class="modal-entity__section-title">▸ BIOGRAPHICAL DATA</h3>
                    <p class="modal-entity__bio">${data.bio}</p>
                </div>

                <div class="modal-entity__section">
                    <h3 class="modal-entity__section-title">▸ MUTATION ANALYSIS</h3>
                    <div class="modal-entity__mutation">
                        <span class="mutation-level-label">MUTATION LEVEL:</span>
                        <span class="mutation-level-value">${data.mutValue}</span>
                        <div class="mutation-level-bar">
                            <div class="mutation-level-fill" style="width: ${data.mutValue}"></div>
                        </div>
                    </div>
                </div>

                <div class="modal-entity__section">
                    <h3 class="modal-entity__section-title">▸ RESISTANCE PROFILE</h3>
                    <div class="modal-entity__stats">
                        ${Object.entries(data.stats).map(([label, value]) => `
                            <div class="stat-row">
                                <span class="stat-row__label">${label}</span>
                                <div class="stat-row__bar">
                                    <div class="stat-row__fill" style="--stat-value: ${value}%; width: 0%"></div>
                                </div>
                                <span class="stat-row__value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="modal-entity__section">
                    <h3 class="modal-entity__section-title">▸ SKILL MATRIX</h3>
                    <div class="modal-entity__skills">
                        ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>

                <div class="modal-entity__section">
                    <h3 class="modal-entity__section-title">▸ CONTAMINATION STATUS</h3>
                    <div class="modal-entity__contamination">
                        <span class="contam-level">${data.contamLevel}</span>
                    </div>
                </div>

                <div class="modal-entity__footer">
                    <span class="modal-entity__timestamp">ACCESSED: ${new Date().toISOString()}</span>
                    <span class="modal-entity__warning">⚠ HANDLE WITH CONTAINMENT PROTOCOLS</span>
                </div>
            </div>
        `;
    }

    function initModal() {
        dom.modalClose.addEventListener('click', closeModal);
        dom.modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ─── Glitch Effects ────────────────────────────────────────
    function initGlitchEffects() {
        // Random glitch on title
        const glitchText = document.querySelector('.glitch-text');
        if (glitchText) {
            setInterval(() => {
                if (Math.random() > 0.95) {
                    glitchText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 2 - 1}px)`;
                    setTimeout(() => {
                        glitchText.style.transform = '';
                    }, 50);
                }
            }, 100);
        }

        // Random terminal header glitch
        const headerTitle = document.querySelector('.terminal-header__title');
        if (headerTitle) {
            setInterval(() => {
                if (Math.random() > 0.97) {
                    headerTitle.style.textShadow = `
                        ${Math.random() * 4 - 2}px 0 var(--neon-crimson),
                        ${Math.random() * -4 + 2}px 0 var(--neon-cyan)
                    `;
                    setTimeout(() => {
                        headerTitle.style.textShadow = '';
                    }, 100);
                }
            }, 200);
        }
    }

    // ─── Stat Bar Fill Animation on Scroll ─────────────────────
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const statFills = card.querySelectorAll('.stat-row__fill');
                    const mutFill = card.querySelector('.mutation-indicator__fill');

                    // Animate stat bars
                    statFills.forEach((fill, index) => {
                        setTimeout(() => {
                            const value = fill.style.getPropertyValue('--stat-value');
                            fill.style.width = value;
                        }, index * 100);
                    });

                    // Animate mutation bar
                    if (mutFill) {
                        setTimeout(() => {
                            const value = mutFill.style.getPropertyValue('--mutation-level');
                            mutFill.style.width = value;
                        }, 200);
                    }

                    card.classList.add('char-card--animated');
                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        dom.charCards.forEach(card => {
            observer.observe(card);
        });
    }

    // ─── Ticker Animation ──────────────────────────────────────
    function initTicker() {
        if (!dom.ticker) return;
        
        const tickerText = dom.ticker.querySelector('.ticker-text');
        if (!tickerText) return;

        // Clone for seamless loop
        const clone = tickerText.cloneNode(true);
        dom.ticker.appendChild(clone);
    }

    // ─── Random Contamination Glitch ───────────────────────────
    function initContaminationEffects() {
        const contamMeters = document.querySelectorAll('.contam-meter');
        
        setInterval(() => {
            contamMeters.forEach(meter => {
                if (Math.random() > 0.95) {
                    meter.style.filter = 'hue-rotate(90deg) brightness(1.5)';
                    setTimeout(() => {
                        meter.style.filter = '';
                    }, 150);
                }
            });
        }, 500);
    }

    // ─── Card Entrance Animation ───────────────────────────────
    function initCardEntrance() {
        dom.charCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 + (index * 150));
        });
    }

    // ─── Typing Effect for Terminal ────────────────────────────
    function typeText(element, text, speed = 50) {
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

    // ─── Random Scanline Glitch ────────────────────────────────
    function initScanlineGlitch() {
        const overlay = document.querySelector('.crt-overlay');
        if (!overlay) return;

        setInterval(() => {
            if (Math.random() > 0.98) {
                overlay.style.background = `
                    repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(0, 255, 65, 0.05) 2px,
                        rgba(0, 255, 65, 0.05) 4px
                    )
                `;
                setTimeout(() => {
                    overlay.style.background = '';
                }, 200);
            }
        }, 100);
    }

    // ─── Keyboard Navigation ───────────────────────────────────
    function initKeyboardNav() {
        let focusedCardIndex = -1;
        const cards = Array.from(dom.charCards);

        document.addEventListener('keydown', (e) => {
            if (dom.modalOverlay.classList.contains('modal-overlay--active')) return;
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                focusedCardIndex = Math.min(focusedCardIndex + 1, cards.length - 1);
                cards[focusedCardIndex]?.focus();
                cards[focusedCardIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                focusedCardIndex = Math.max(focusedCardIndex - 1, 0);
                cards[focusedCardIndex]?.focus();
                cards[focusedCardIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            if (e.key === 'Enter' && focusedCardIndex >= 0) {
                openModal(cards[focusedCardIndex]);
            }
        });

        // Make cards focusable
        cards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View details for ${card.querySelector('.char-card__name')?.textContent}`);
        });
    }

    // ─── Corruption Randomize ──────────────────────────────────
    function initCorruptionEffects() {
        // Randomly corrupt text elements
        const corruptable = document.querySelectorAll('.char-card__bio, .char-card__class');
        
        setInterval(() => {
            corruptable.forEach(el => {
                if (Math.random() > 0.995) {
                    const original = el.textContent;
                    const corrupted = original.split('').map(char => {
                        if (Math.random() > 0.9) {
                            return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
                        }
                        return char;
                    }).join('');
                    
                    el.textContent = corrupted;
                    el.style.color = 'var(--neon-crimson)';
                    
                    setTimeout(() => {
                        el.textContent = original;
                        el.style.color = '';
                    }, 100);
                }
            });
        }, 100);
    }

    // ─── Boot Sequence ─────────────────────────────────────────
    function bootSequence() {
        const terminal = document.querySelector('.terminal-frame');
        terminal.style.opacity = '0';
        terminal.style.filter = 'brightness(2) contrast(0.5)';

        setTimeout(() => {
            terminal.style.transition = 'opacity 1s ease, filter 1s ease';
            terminal.style.opacity = '1';
            terminal.style.filter = 'brightness(1) contrast(1)';
        }, 300);
    }

    // ─── Initialize Everything ─────────────────────────────────
    function init() {
        bootSequence();
        initDataRain();
        generateDNAHelix(dom.dnaLeft, 'left');
        generateDNAHelix(dom.dnaRight, 'right');
        animateEntityCount();
        animateCorruption();
        initFilters();
        initCharCards();
        initModal();
        initGlitchEffects();
        initScrollAnimations();
        initTicker();
        initContaminationEffects();
        initCardEntrance();
        initScanlineGlitch();
        initKeyboardNav();
        initCorruptionEffects();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();