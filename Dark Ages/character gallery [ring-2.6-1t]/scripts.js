// ═══════════════════════════════════════════════════════════════════════════
// ASHES OF THE FAITHFUL — Character Codex Interactive Scripts
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ── References ──────────────────────────────────────────────────────
    const ashOverlay      = document.getElementById('ash-overlay');
    const plagueBar       = document.getElementById('plague-bar');
    const plagueValue     = document.getElementById('plague-value');
    const deathCountEl    = document.getElementById('death-count');
    const survivalCountEl = document.getElementById('survival-count');
    const gallery         = document.getElementById('character-gallery');
    const cards           = gallery.querySelectorAll('.character-card');
    const filterBtns      = document.querySelectorAll('.filter-btn');
    const searchInput     = document.getElementById('search-input');
    const modalOverlay    = document.getElementById('modal-overlay');
    const modalContent    = document.getElementById('modal-content');
    const modalBody       = document.getElementById('modal-body');
    const modalClose      = document.getElementById('modal-close');

    // ── State ───────────────────────────────────────────────────────────
    let activeFaithFilter  = 'all';
    let activeClassFilter  = 'all';
    let searchTerm         = '';
    let visibleCount       = cards.length;

    // ═════════════════════════════════════════════════════════════════════
    // 1. ASH PARTICLE SYSTEM
    // ═════════════════════════════════════════════════════════════════════

    const PARTICLE_COUNT = 45;
    const ashes = [];

    function createAshParticle() {
        const particle = document.createElement('div');
        particle.classList.add('ash-particle');

        const size = Math.random() * 3 + 1;
        particle.style.width  = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left   = Math.random() * 100 + '%';

        const duration = Math.random() * 12 + 8;   // 8–20 seconds
        const delay    = Math.random() * 15;        // 0–15 seconds initial delay
        const xDrift   = (Math.random() - 0.5) * 80; // horizontal drift

        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay    = delay + 's';
        particle.style.setProperty('--drift', xDrift + 'px');

        // Override keyframe drift via custom property
        particle.style.animation = `none`;
        particle.offsetHeight; // force reflow
        particle.style.animation = `ashFloat ${duration}s ${delay}s linear infinite`;

        // Inject custom keyframes per particle for horizontal drift
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ashFloat${ashes.length} {
                0%   { opacity:0; transform: translateY(100vh) translateX(0) rotate(0deg) scale(0.5); }
                10%  { opacity:0.6; }
                90%  { opacity:0.3; }
                100% { opacity:0; transform: translateY(-10vh) translateX(${xDrift}px) rotate(360deg) scale(1.2); }
            }
        `;
        document.head.appendChild(style);
        particle.style.animationName = `ashFloat${ashes.length}`;

        ashOverlay.appendChild(particle);
        ashes.push({ el: particle, style });
    }

    // Spawn particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        createAshParticle();
    }

    // Periodically add extra particles for atmosphere
    setInterval(() => {
        if (ashes.length < 70) {
            createAshParticle();
        }
    }, 8000);


    // ═════════════════════════════════════════════════════════════════════
    // 2. STAT BAR ANIMATION
    // ═════════════════════════════════════════════════════════════════════

    function animateStatBars() {
        const bars = document.querySelectorAll('.stat-fill');
        bars.forEach(bar => {
            const target = bar.style.width;
            bar.style.width = '0%';
            // Trigger reflow then animate
            void bar.offsetWidth;
            bar.style.width = target;
        });
    }

    // Stagger the stat bar animations
    setTimeout(animateStatBars, 400);


    // ═════════════════════════════════════════════════════════════════════
    // 3. FILTER & SEARCH SYSTEM
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Applies all active filters and search to character cards.
     * Cards that match are shown; others are hidden with animation.
     */
    function applyFilters() {
        let newVisibleCount = 0;

        cards.forEach(card => {
            const faith  = card.dataset.faith;
            const cls    = card.dataset.class;
            const name   = card.dataset.name || '';
            const lore   = card.textContent.toLowerCase();
            const search = searchTerm.toLowerCase();

            // Faith filter
            const faithMatch = activeFaithFilter === 'all' || faith === activeFaithFilter;

            // Class filter
            const classMatch = activeClassFilter === 'all' || cls === activeClassFilter;

            // Search filter — check name, title, lore, properties, skills
            const searchMatch = !search ||
                name.includes(search) ||
                lore.includes(search);

            const visible = faithMatch && classMatch && searchMatch;

            if (visible) {
                newVisibleCount++;
                card.classList.remove('hidden');
                card.style.display = '';
                // Re-trigger entrance animation
                card.style.animation = 'none';
                void card.offsetWidth;
                card.style.animation = '';
            } else {
                card.classList.add('hidden');
                // Use display to remove from grid flow
                card.style.display = 'none';
            }
        });

        visibleCount = newVisibleCount;
        updateDeathCounter();

        // Show/hide "no results" state
        const noResults = document.getElementById('no-results');
        if (visibleCount === 0) {
            if (!noResults) {
                showNoResults();
            }
        } else {
            if (noResults) noResults.remove();
        }
    }

    function showNoResults() {
        const empty = document.createElement('div');
        empty.id = 'no-results';
        empty.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 80px 20px;
                color: var(--color-parchment-dk2);
                font-family: var(--font-accent);
                font-size: 1.1rem;
                letter-spacing: 0.05em;
            ">
                <div style="font-size: 3rem; margin-bottom: 16px; opacity: 0.4;">☠️</div>
                <p>No souls found matching your search.</p>
                <p style="font-size: 0.85rem; margin-top: 8px; opacity: 0.6;">
                    The darkness has consumed them all — or your criteria are too narrow.
                </p>
            </div>
        `;
        gallery.appendChild(empty);
    }

    // ── Filter Button Events ────────────────────────────────────────────
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filter;
            const range      = btn.dataset.range;

            // Update active state within the filter group
            const group = btn.closest('.filter-group');
            group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update global filter state
            if (filterType === 'faith') {
                activeFaithFilter = range;
            } else if (filterType === 'class') {
                activeClassFilter = range;
            }

            applyFilters();
        });
    });

    // ── Search Input Events ─────────────────────────────────────────────
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchTerm = searchInput.value.trim();
            applyFilters();
        }, 250); // debounce
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchTerm = '';
            applyFilters();
            searchInput.blur();
        }
    });


    // ═════════════════════════════════════════════════════════════════════
    // 4. EXPANDABLE LORE SECTIONS
    // ═════════════════════════════════════════════════════════════════════

    document.querySelectorAll('.lore-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const hidden = toggle.nextElementSibling;
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.textContent = '▾ Read Full Chronicle';
                hidden.classList.remove('open');
            } else {
                toggle.setAttribute('aria-expanded', 'true');
                toggle.textContent = '▴ Close Chronicle';
                hidden.classList.add('open');
            }
        });
    });


    // ═════════════════════════════════════════════════════════════════════
    // 5. DEATH / SURVIVAL COUNTER
    // ═════════════════════════════════════════════════════════════════════

    function updateDeathCounter() {
        let dead = 0;
        let alive = 0;

        cards.forEach(card => {
            if (card.style.display !== 'none') {
                const statusEl = card.querySelector('.portrait-status');
                if (statusEl) {
                    if (statusEl.classList.contains('dead')) {
                        dead++;
                    } else {
                        alive++;
                    }
                }
            }
        });

        deathCountEl.textContent   = dead;
        survivalCountEl.textContent = alive;
    }

    // Initial call to set correct count
    updateDeathCounter();


    // ═════════════════════════════════════════════════════════════════════
    // 6. CHARACTER DETAIL MODAL
    // ═════════════════════════════════════════════════════════════════════

    function openModal(card) {
        const name     = card.querySelector('.character-name').textContent;
        const title    = card.querySelector('.character-title').textContent;
        const lore     = card.querySelector('.character-lore').textContent;
        const icon     = card.querySelector('.portrait-icon').textContent;
        const status   = card.querySelector('.portrait-status').textContent;
        const alignment = card.querySelector('.card-ribbon');
        const alignmentText = alignment ? alignment.textContent.trim() : '';

        // Gather stats
        const statRows = card.querySelectorAll('.stat-row');
        let statsHTML = '';
        statRows.forEach(row => {
            const label = row.querySelector('.stat-label').textContent;
            const value = row.querySelector('.stat-value').textContent;
            const fillWidth = row.querySelector('.stat-fill').style.width;
            const color = row.querySelector('.stat-fill').style.getPropertyValue('--stat-color') || '#c9a84c';
            statsHTML += `
                <div class="modal-stat">
                    <div class="modal-stat-label">${label}</div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="flex:1;height:8px;background:rgba(0,0,0,0.4);border-radius:4px;overflow:hidden;border:1px solid rgba(200,180,136,0.1);">
                            <div style="height:100%;width:${fillWidth};background:${color};border-radius:4px;"></div>
                        </div>
                        <span class="modal-stat-value" style="color:${color};min-width:42px;text-align:right;font-family:'Cinzel',serif;font-size:1.1rem;font-weight:700;">${value}</span>
                    </div>
                </div>
            `;
        });

        // Gather skills
        const skillTags = card.querySelectorAll('.skill-tag');
        let skillsHTML = '';
        skillTags.forEach(tag => {
            skillsHTML += `<span class="modal-skill">${tag.textContent}</span>`;
        });

        // Gather properties
        const propTags = card.querySelectorAll('.prop');
        let propsHTML = '';
        propTags.forEach(tag => {
            propsHTML += `<span class="modal-prop">${tag.textContent}</span>`;
        });

        // Gather relationships
        const bondEls = card.querySelectorAll('.bond');
        let bondsHTML = '';
        bondEls.forEach(bond => {
            bondsHTML += `<div class="modal-bond">${bond.innerHTML}</div>`;
        });

        // Gather full lore
        const fullLoreDiv = card.querySelector('.lore-hidden');
        let fullLoreHTML = '';
        if (fullLoreDiv) {
            const paragraphs = fullLoreDiv.querySelectorAll('p');
            fullLoreHTML = `
                <div class="modal-full-chronicle">
                    <h3>📜 Full Chronicle</h3>
                    ${Array.from(paragraphs).map(p => `<p>${p.innerHTML}</p>`).join('')}
                </div>
            `;
        }

        modalBody.innerHTML = `
            <div class="modal-portrait">
                <span class="modal-portrait-icon">${icon}</span>
            </div>
            <h2>${name}</h2>
            <div class="modal-subtitle">${title}</div>
            <div style="font-family:'MedievalSharp',cursive;font-size:0.78rem;color:var(--color-gold);margin-bottom:16px;letter-spacing:0.08em;">
                ${alignmentText} &mdash; ${status}
            </div>
            <div class="modal-lore">${lore}</div>
            <h3 style="font-family:'MedievalSharp',cursive;font-size:0.82rem;color:var(--color-parchment-dk2);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;opacity:0.7;">⚔️ Combat &amp; Survival Stats</h3>
            <div class="modal-stats">${statsHTML}</div>
            <h3 style="font-family:'MedievalSharp',cursive;font-size:0.82rem;color:var(--color-parchment-dk2);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;opacity:0.7;">🧰 Key Skills</h3>
            <div class="modal-skills">${skillsHTML}</div>
            <h3 style="font-family:'MedievalSharp',cursive;font-size:0.82rem;color:var(--color-parchment-dk2);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;opacity:0.7;">📋 Attributes</h3>
            <div class="modal-props">${propsHTML}</div>
            <div class="modal-relationships">
                <h3>💜 Bonds &amp; Rivalries</h3>
                ${bondsHTML}
            </div>
            ${fullLoreHTML}
        `;

        modalOverlay.setAttribute('aria-hidden', 'false');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Click on a card to open modal
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't open modal if user clicked on the toggle button
            if (e.target.closest('.lore-toggle')) return;
            openModal(card);
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });


    // ═════════════════════════════════════════════════════════════════════
    // 7. SCROLL-BASED ENTRANCE REVEAL
    // ═════════════════════════════════════════════════════════════════════

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.animationPlayState = 'paused';
        // Re-trigger by toggling animation
        void card.offsetWidth;
        revealObserver.observe(card);
    });


    // ═════════════════════════════════════════════════════════════════════
    // 8. DYNAMIC PLAGUE PROGRESSION (ambient simulation)
    // ═════════════════════════════════════════════════════════════════════

    let plagueLevel = 67;
    const plagueTarget = plagueBar.parentElement;

    function updatePlagueDisplay(level) {
        plagueBar.style.width = level + '%';
        plagueValue.textContent = level + '%';

        // Color shift as plague worsens
        if (level < 30) {
            plagueBar.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
        } else if (level < 60) {
            plagueBar.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
        } else {
            plagueBar.style.background = 'linear-gradient(90deg, var(--color-blood), var(--color-red), var(--color-blood-light))';
        }
    }

    // Slowly increase plague level for ambient tension
    setInterval(() => {
        if (plagueLevel < 98) {
            plagueLevel += Math.random() * 0.5;
            updatePlagueDisplay(Math.floor(plagueLevel));
        }
    }, 15000);


    // ═════════════════════════════════════════════════════════════════════
    // 9. SUBTLE PARALLAX ON SCROLL
    // ═════════════════════════════════════════════════════════════════════

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const header = document.querySelector('.codex-header');
                if (header) {
                    header.style.transform = `translateY(${scrollY * 0.15}px)`;
                    header.style.opacity = Math.max(0, 1 - scrollY / 800);
                }
                ticking = false;
            });
            ticking = true;
        }
    });


    // ═════════════════════════════════════════════════════════════════════
    // 10. RANDOM CANDLEFLICKER AMBIENCE
    // ═════════════════════════════════════════════════════════════════════

    function randomFlicker() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(
                ellipse at ${Math.random() * 80 + 10}% ${Math.random() * 80 + 10}%,
                rgba(255, 180, 50, ${Math.random() * 0.04 + 0.01}) 0%,
                transparent 60%
            );
            pointer-events: none;
            z-index: 99;
            transition: opacity 0.1s;
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 200);
    }

    // Random candle flicker every few seconds
    setInterval(randomFlicker, 3000 + Math.random() * 4000);


    // ═════════════════════════════════════════════════════════════════════
    // 11. CARD HOVER SOUND FEEDBACK (visual ripple)
    // ═════════════════════════════════════════════════════════════════════

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--color-gold)';
            card.style.boxShadow = `
                0 8px 30px rgba(0,0,0,0.6),
                0 0 20px var(--color-gold-glow),
                inset 0 1px 0 rgba(200,180,136,0.15)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.borderColor = '';
            card.style.boxShadow = '';
        });
    });


    // ═════════════════════════════════════════════════════════════════════
    // 12. INITIAL LOAD SEQUENCE
    // ═════════════════════════════════════════════════════════════════════

    // Hide cards initially, then stagger reveal
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 60);
    });

    // Show plague bar with animation
    setTimeout(() => {
        updatePlagueDisplay(plagueLevel);
    }, 800);

    // Log mysterious message
    console.log(
        '%c⚰ Ashes of the Faithful — Character Codex ⚰',
        'color: #c9a84c; font-size: 16px; font-weight: bold; background: #080604; padding: 8px 16px; border: 1px solid #6b0f1a; border-radius: 4px; text-shadow: 0 0 10px rgba(107,15,26,0.8);'
    );
    console.log(
        '%c"In the year of our Lord 1348, the hand of God descended upon the land."',
        'color: #a89668; font-style: italic; font-family: serif;'
    );

}); // end DOMContentLoaded