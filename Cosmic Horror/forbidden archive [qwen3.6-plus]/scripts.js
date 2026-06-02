/* ============================================
   THE ATHENAEUM OF DEAD STARS — SCRIPTS
   "To read is to be read."
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. INITIALIZATION & CONFIG ---
    const state = {
        sanity: 100,
        isWarningActive: true,
        audioActive: false,
        glitchInterval: null,
        sanityInterval: null,
        audioContext: null,
        oscillator: null,
        gainNode: null
    };

    const config = {
        sanityDecayRate: 0.05, // Per tick
        scrollSanityPenalty: 0.02, // Per pixel scrolled roughly
        glitchChance: 0.02, // Chance per tick
        eldritchChars: ['⍙', '⍟', '⬡', '◈', '✦', '᚛', '᚜', 'ᚐ', 'ᚑ', 'ᚒ', 'ᚓ', 'ᚔ', 'ᚕ', 'ᚖ', 'ᚗ', '░', '▒', '▓', '█', '▄', '▀', '▌', '▐', '▖', '▗', '▘', '▙', '▚', '▛', '▜', '▝', '▞', '▟']
    };

    // DOM Elements
    const dom = {
        body: document.body,
        warningOverlay: document.getElementById('warningOverlay'),
        warningAccept: document.getElementById('warningAccept'),
        warningFlee: document.getElementById('warningFlee'),
        sanityValue: document.getElementById('sanityValue'),
        sanityFill: document.getElementById('sanityFill'),
        sanityStatus: document.getElementById('sanityStatus'),
        sanityMeter: document.getElementById('sanityMeter'),
        searchInput: document.getElementById('searchInput'),
        searchResults: document.getElementById('searchResults'),
        searchHint: document.getElementById('searchHint'),
        terminalTime: document.getElementById('terminalTime'),
        modal: document.getElementById('detailModal'),
        modalClose: document.getElementById('modalClose'),
        modalBackdrop: document.getElementById('modalBackdrop'),
        audioControl: document.getElementById('audioControl'),
        corruptElements: document.querySelectorAll('[data-corrupt]')
    };

    // --- 2. WARNING MODAL ---
    function handleWarningAccept() {
        dom.warningOverlay.classList.add('hidden');
        state.isWarningActive = false;
        startSanityDecay();
        startGlitchEngine();
        startTerminalClock();
        initCorruptionEffects();
        playAmbientHum(); // Optional: Start audio context on user interaction
    }

    function handleWarningFlee() {
        dom.body.innerHTML = '<div style="height:100vh;display:flex;align-items:center;justify-content:center;background:#000;color:#39ff85;font-family:monospace;font-size:2rem;cursor:none;">YOU CANNOT LEAVE. THE ARCHIVE IS ETERNAL.</div>';
        // A little easter egg
    }

    dom.warningAccept.addEventListener('click', handleWarningAccept);
    dom.warningFlee.addEventListener('click', handleWarningFlee);

    // --- 3. TERMINAL CLOCK ---
    function startTerminalClock() {
        setInterval(() => {
            const now = new Date();
            // Display time in a slightly "wrong" way sometimes
            let h = now.getHours();
            let m = now.getMinutes();
            let s = now.getSeconds();
            
            // 1% chance to show a "forbidden" time
            if (Math.random() < 0.01) {
                dom.terminalTime.textContent = '∞:∞:∞';
                dom.terminalTime.style.color = 'var(--color-accent-red-bright)';
                setTimeout(() => { dom.terminalTime.style.color = ''; }, 200);
            } else {
                const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                dom.terminalTime.textContent = timeString;
            }
        }, 1000);
    }

    // --- 4. SANITY SYSTEM ---
    function startSanityDecay() {
        state.sanityInterval = setInterval(() => {
            if (state.isWarningActive) return;
            
            // Natural decay
            state.sanity -= config.sanityDecayRate;
            
            // Check scroll depth penalty
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            state.sanity -= scrollPercent * 0.1;
            
            // Clamp
            state.sanity = Math.max(0, state.sanity);
            
            updateSanityUI();
        }, 100);
    }

    function updateSanityUI() {
        const val = Math.floor(state.sanity);
        dom.sanityValue.textContent = `${val}%`;
        dom.sanityFill.style.width = `${val}%`;

        // Color changes based on sanity
        if (val > 75) {
            dom.sanityStatus.textContent = 'STABLE';
            dom.sanityStatus.style.color = 'var(--color-accent-green-bright)';
            dom.sanityFill.style.background = 'linear-gradient(90deg, var(--color-accent-green), var(--color-accent-green-bright))';
            dom.body.classList.remove('low-sanity');
        } else if (val > 50) {
            dom.sanityStatus.textContent = 'UNEASE';
            dom.sanityStatus.style.color = 'var(--color-accent-copper)';
            dom.sanityFill.style.background = 'linear-gradient(90deg, var(--color-accent-copper), #e0a040)';
            dom.body.classList.remove('low-sanity');
        } else if (val > 25) {
            dom.sanityStatus.textContent = 'PARANOIA';
            dom.sanityStatus.style.color = 'var(--color-accent-red-bright)';
            dom.sanityFill.style.background = 'linear-gradient(90deg, var(--color-accent-red), var(--color-accent-red-bright))';
            dom.sanityMeter.classList.add('degraded');
        } else {
            dom.sanityStatus.textContent = 'CRITICAL';
            dom.sanityStatus.style.color = '#ff0000';
            dom.sanityFill.style.background = '#ff0000';
            dom.body.classList.add('low-sanity');
            
            if (val < 10) {
                dom.sanityStatus.textContent = 'LOST';
                // Scramble UI
                if (Math.random() < 0.05) scrambleUI();
            }
        }
    }

    function scrambleUI() {
        const elements = document.querySelectorAll('p, span, h1, h2, h3');
        const randomEl = elements[Math.floor(Math.random() * elements.length)];
        if (randomEl) {
            const original = randomEl.innerText;
            const chars = original.split('');
            const idx = Math.floor(Math.random() * chars.length);
            chars[idx] = config.eldritchChars[Math.floor(Math.random() * config.eldritchChars.length)];
            randomEl.innerText = chars.join('');
            // Revert after a bit
            setTimeout(() => { randomEl.innerText = original; }, 500);
        }
    }

    // --- 5. TEXT CORRUPTION ENGINE ---
    function initCorruptionEffects() {
        dom.corruptElements.forEach(el => {
            el.setAttribute('data-original', el.innerText);
            
            el.addEventListener('mouseenter', () => {
                corruptElement(el, 30); // High corruption on hover
            });
            
            el.addEventListener('mouseleave', () => {
                restoreElement(el);
            });
        });

        // Random background corruption
        setInterval(() => {
            if (state.sanity < 60 && Math.random() < 0.1) {
                const el = dom.corruptElements[Math.floor(Math.random() * dom.corruptElements.length)];
                corruptElement(el, 10);
                setTimeout(() => restoreElement(el), 2000);
            }
        }, 2000);
    }

    function corruptElement(el, intensity) {
        const original = el.getAttribute('data-original');
        if (!original) return;
        
        const chars = original.split('');
        const numToCorrupt = Math.floor((intensity / 100) * chars.length);
        
        for (let i = 0; i < numToCorrupt; i++) {
            const idx = Math.floor(Math.random() * chars.length);
            // Don't replace spaces too often to keep word structure visible
            if (chars[idx] !== ' ') {
                chars[idx] = config.eldritchChars[Math.floor(Math.random() * config.eldritchChars.length)];
            }
        }
        el.innerText = chars.join('');
    }

    function restoreElement(el) {
        const original = el.getAttribute('data-original');
        if (original) el.innerText = original;
    }

    // --- 6. SEARCH FUNCTIONALITY ---
    const catalogData = [];
    
    // Scrape data from HTML for search
    document.querySelectorAll('.catalog-card').forEach(card => {
        catalogData.push({
            id: card.getAttribute('data-id'),
            title: card.querySelector('.card-title')?.innerText || 'Unknown',
            category: card.getAttribute('data-category'),
            desc: card.querySelector('.card-description')?.innerText || '',
            el: card
        });
    });

    dom.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        dom.searchResults.innerHTML = '';
        
        if (query.length < 2) {
            dom.searchResults.classList.remove('active');
            return;
        }

        // Sanity check: If sanity is low, return "wrong" results
        if (state.sanity < 30) {
            showDisturbingResults(query);
            return;
        }

        const matches = catalogData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.desc.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            matches.forEach(match => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.innerHTML = `
                    <div class="search-result-title">${match.title}</div>
                    <div class="search-result-meta">${match.id} // ${match.category.toUpperCase()}</div>
                `;
                div.addEventListener('click', () => {
                    match.el.scrollIntoView({ behavior: 'smooth' });
                    dom.searchResults.classList.remove('active');
                    dom.searchInput.value = '';
                });
                dom.searchResults.appendChild(div);
            });
        } else {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `<div class="search-result-title" style="color:var(--color-accent-red-bright)">NO RECORDS FOUND</div>
                             <div class="search-result-meta">THE ARCHIVE REMEMBERS WHAT YOU FORGOT</div>`;
            dom.searchResults.appendChild(div);
        }

        dom.searchResults.classList.add('active');
    });

    function showDisturbingResults(query) {
        const warnings = [
            "IT SEES YOU SEARCHING",
            "DO NOT LOOK FOR IT",
            "YOUR NAME IS NOW IN THE INDEX",
            "SEARCHING FOR: " + query.toUpperCase() + "... FOUND YOU",
            "ERROR: SOUL NOT FOUND",
            "WHY DO YOU SEEK THE DEAD?"
        ];
        
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.style.borderColor = 'var(--color-accent-red)';
        div.innerHTML = `
            <div class="search-result-title" style="color:var(--color-accent-red-bright); font-family:var(--font-fraktur)">${warnings[Math.floor(Math.random() * warnings.length)]}</div>
            <div class="search-result-meta">SANITY COMPROMISED</div>
        `;
        dom.searchResults.appendChild(div);
        dom.searchResults.classList.add('active');
    }

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!dom.searchInput.contains(e.target) && !dom.searchResults.contains(e.target)) {
            dom.searchResults.classList.remove('active');
        }
    });

    // --- 7. DETAIL MODAL ---
    document.querySelectorAll('.card-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click if we add one later
            const card = btn.closest('.catalog-card');
            openModal(card);
        });
    });

    function openModal(card) {
        const id = card.getAttribute('data-id');
        const title = card.querySelector('.card-title')?.innerText;
        const classification = card.querySelector('.card-classification')?.innerText;
        const meta = card.querySelector('.card-meta')?.innerHTML;
        const desc = card.querySelector('.card-description')?.innerText;
        const excerpt = card.querySelector('.excerpt-text')?.innerText;
        const status = card.querySelector('.card-status')?.innerText;
        const statusClass = card.querySelector('.card-status')?.className.split(' ').find(c => c.startsWith('status-'));

        document.getElementById('modalId').innerText = id;
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalClassification').innerText = classification;
        document.getElementById('modalMeta').innerHTML = meta;
        document.getElementById('modalDescription').innerText = desc;
        document.getElementById('modalExcerpt').innerHTML = `<span class="excerpt-label">FULL TRANSCRIPT:</span><p class="excerpt-text" style="margin:0">${excerpt}</p>`;
        
        const statusEl = document.getElementById('modalStatus');
        statusEl.innerText = status;
        statusEl.className = `modal-status card-status ${statusClass || ''}`;

        dom.modal.classList.add('active');
        dom.modal.setAttribute('aria-hidden', 'false');
        
        // Sanity penalty for reading deep files
        state.sanity -= 5;
        updateSanityUI();
    }

    function closeModal() {
        dom.modal.classList.remove('active');
        dom.modal.setAttribute('aria-hidden', 'true');
    }

    dom.modalClose.addEventListener('click', closeModal);
    dom.modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dom.modal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- 8. GLITCH ENGINE & AUDIO ---
    function startGlitchEngine() {
        // Randomly trigger chromatic aberration or screen shake
        setInterval(() => {
            if (Math.random() < 0.05) {
                const ab = document.querySelector('.chromatic-aberration');
                ab.style.opacity = '0.3';
                ab.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    ab.style.opacity = '';
                    ab.style.transform = '';
                }, 100);
            }
        }, 200);
    }

    // Audio using Web Audio API for a generative drone
    function playAmbientHum() {
        if (state.audioContext) return;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            state.audioContext = new AudioContext();
            
            // Create a low drone
            const osc1 = state.audioContext.createOscillator();
            const osc2 = state.audioContext.createOscillator();
            const gain = state.audioContext.createGain();
            
            osc1.type = 'sawtooth';
            osc1.frequency.value = 50; // Low rumble
            
            osc2.type = 'sine';
            osc2.frequency.value = 55; // Slight dissonance
            
            gain.gain.value = 0; // Start silent
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(state.audioContext.destination);
            
            osc1.start();
            osc2.start();
            
            state.oscillator = osc1;
            state.oscillator2 = osc2;
            state.gainNode = gain;
            
            state.audioActive = true;
            dom.audioControl.querySelector('.audio-icon').textContent = '🔊';
            dom.audioControl.querySelector('.audio-label').textContent = 'MUTE THE VOID';
            
            // Fade in
            state.gainNode.gain.linearRampToValueAtTime(0.05, state.audioContext.currentTime + 2);
            
        } catch (e) {
            console.warn("Web Audio API not supported or blocked.");
        }
    }

    dom.audioControl.addEventListener('click', () => {
        if (!state.audioContext) {
            playAmbientHum();
        } else {
            if (state.audioContext.state === 'running') {
                state.gainNode.gain.linearRampToValueAtTime(0, state.audioContext.currentTime + 0.5);
                setTimeout(() => state.audioContext.suspend(), 500);
                state.audioActive = false;
                dom.audioControl.querySelector('.audio-icon').textContent = '🔇';
                dom.audioControl.querySelector('.audio-label').textContent = 'UNLEASH THE VOID';
            } else {
                state.audioContext.resume();
                state.gainNode.gain.linearRampToValueAtTime(0.05, state.audioContext.currentTime + 1);
                state.audioActive = true;
                dom.audioControl.querySelector('.audio-icon').textContent = '🔊';
                dom.audioControl.querySelector('.audio-label').textContent = 'MUTE THE VOID';
            }
        }
    });

    // --- 9. SCROLL PARALLAX & TENDRILS ---
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const tendrilElements = document.querySelectorAll('.tendril');
        
        // Subtle parallax for tendrils
        tendrilElements.forEach((t, i) => {
            const speed = 0.1 + (i * 0.05);
            t.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Update sanity based on scroll
        if (!state.isWarningActive) {
            state.sanity -= 0.01;
            updateSanityUI();
        }
    });

    // --- 10. RANDOM "OBSERVER" EVENTS ---
    // Occasionally change text or cursor to make the user feel watched
    setInterval(() => {
        if (state.isWarningActive) return;
        if (Math.random() < 0.01) {
            const body = document.body;
            body.style.cursor = 'none';
            setTimeout(() => { body.style.cursor = 'crosshair'; }, 500);
            
            // Flash a message in console
            console.log("%c WE SEE YOU ", "background: #6b0f0f; color: #ff2a2a; font-size: 20px; font-weight: bold; padding: 5px;");
        }
    }, 5000);

});