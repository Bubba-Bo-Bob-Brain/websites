document.addEventListener('DOMContentLoaded', () => {
    const sanityBar = document.getElementById('sanityBar');
    const sanityPercentage = document.getElementById('sanityPercentage');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const archiveEntries = document.querySelectorAll('.archive-entry');
    const corruptedTexts = document.querySelectorAll('.corrupted-text');

    let sanity = 100;
    let scrollDepth = 0;

    const sanityDegradationRate = 0.15;
    const minimumSanity = 8;

    function updateSanity() {
        if (sanity <= minimumSanity) {
            sanity = minimumSanity;
            sanityBar.style.width = sanity + '%';
            sanityBar.style.background = 'linear-gradient(90deg, #6a1a1a, #4a0a0a)';
            sanityPercentage.textContent = sanity + '%';
            document.body.classList.add('sanity-low');
            return;
        }

        sanity = Math.max(minimumSanity, sanity - sanityDegradationRate);
        sanityBar.style.width = sanity + '%';
        sanityPercentage.textContent = Math.round(sanity) + '%';

        if (sanity < 30) {
            document.body.classList.add('sanity-low');
            document.body.classList.remove('sanity-mid');
        } else if (sanity < 60) {
            document.body.classList.add('sanity-mid');
            document.body.classList.remove('sanity-low');
        } else {
            document.body.classList.remove('sanity-low', 'sanity-mid');
        }
    }

    let sanityInterval;
    function startSanityDrain() {
        sanityInterval = setInterval(updateSanity, 2000);
    }

    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollDepth = scrollPercentage;
    });

    startSanityDrain();

    const corruptChars = ['∆', '◈', '◇', '○', '□', '△', '▽', '☆', '✦', '⊕', '⊗', '⬡', '⬢', '◌', '⊙', '⊚', '⊛', '⊜', '⊝', '⊞', '⊟', '⊠', '⊡'];
    const originalTexts = {};

    corruptedTexts.forEach(textEl => {
        originalTexts[textEl] = textEl.textContent;
    });

    function corruptText(element, intensity) {
        const original = originalTexts[element];
        if (!original) return;

        let corrupted = '';
        const corruptChance = intensity || 0.3;

        for (let i = 0; i < original.length; i++) {
            if (Math.random() < corruptChance) {
                const randomChar = corruptChars[Math.floor(Math.random() * corruptChars.length)];
                corrupted += randomChar;
            } else {
                corrupted += original[i];
            }
        }

        element.textContent = corrupted;
    }

    corruptedTexts.forEach(textEl => {
        textEl.addEventListener('mouseenter', () => {
            const interval = setInterval(() => {
                corruptText(textEl, 0.4);
            }, 150);

            const timeout = setTimeout(() => {
                clearInterval(interval);
                textEl.textContent = originalTexts[textEl];
            }, 2000);

            textEl.dataset.corruptInterval = interval;
            textEl.dataset.corruptTimeout = timeout;
        });

        textEl.addEventListener('mouseleave', () => {
            const interval = textEl.dataset.corruptInterval;
            const timeout = textEl.dataset.corruptTimeout;
            if (interval) clearInterval(parseInt(interval));
            if (timeout) clearTimeout(parseInt(timeout));
            textEl.textContent = originalTexts[textEl];
        });
    });

    const allEntries = [
        { id: 'TXT-001', title: 'The Reversed Gospel of Mnar', type: 'TEXT', description: 'A gospel written in a language that predates human speech.' },
        { id: 'TXT-012', title: 'Fragment 9-X of the Eibon Cycle', type: 'TEXT', description: 'Recovered from the sunken city of Ib.' },
        { id: 'TXT-027', title: 'Transmissions from the Void-Temple', type: 'TEXT', description: 'Radio signals from a frequency that does not exist.' },
        { id: 'TXT-043', title: 'The Pnakotic Verses, Unbound', type: 'TEXT', description: 'Forbidden verses removed from all known copies.' },
        { id: 'TXT-058', title: 'Geometries of the Hyperborean Gate', type: 'TEXT', description: 'Mathematical proofs that cause perception of doorways.' },
        { id: 'TXT-071', title: 'The Dream-Tapestry of Zanthu', type: 'TEXT', description: 'A textile depicting scenes from a dream that has not happened.' },
        { id: 'STR-003', title: 'The Yuggoth Cartography', type: 'CHART', description: 'A star chart of a galaxy that collapsed into itself.' },
        { id: 'STR-019', title: 'Nebula of the Sleeping God', type: 'CHART', description: 'Infrared photography of a nebula shaped like a vast form.' },
        { id: 'STR-031', title: 'Pathways of the Mi-Go', type: 'CHART', description: 'Transit routes through hollowed-out stars.' },
        { id: 'STR-044', title: 'The Dead Constellation of Arcturus', type: 'CHART', description: 'A constellation that no longer exists.' },
        { id: 'WIT-002', title: 'Account of the Lighthouse Keeper', type: 'TESTIMONY', description: 'A lighthouse keeper sees lights from impossible depths.' },
        { id: 'WIT-016', title: 'The Deep Sea Divers\' Report', type: 'TESTIMONY', description: 'A team encounters a structure at impossible depth.' },
        { id: 'WIT-029', title: 'The Librarian\'s Final Entry', type: 'TESTIMONY', description: 'Last journal entry of a catatonic librarian.' },
        { id: 'WIT-052', title: 'Signal from the Atacama Array', type: 'TESTIMONY', description: 'A signal containing a complete human memory.' }
    ];

    const disturbingResults = [
        'You should not have searched for that.',
        'The index knows what you are looking for.',
        'Results are... shifting. Are these the ones you wanted?',
        'Your search query has been recorded. It always is.',
        'The archive has rearranged itself to show you this.',
        'Do you feel watched? You should. The results are watching too.',
        'This result does not belong here. Neither do you.',
        'The text changes every time you look at it. Did it say this before?'
    ];

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        const results = allEntries.filter(entry =>
            entry.title.toLowerCase().includes(query) ||
            entry.description.toLowerCase().includes(query) ||
            entry.id.toLowerCase().includes(query) ||
            entry.type.toLowerCase().includes(query)
        );

        let html = '';
        if (results.length > 0) {
            const disturbanceIndex = Math.min(Math.floor(scrollDepth / 20), disturbingResults.length - 1);
            html += `<div class="search-disturbance">${disturbingResults[disturbanceIndex]}</div>`;
            html += `<div class="search-result-count">${results.length} result(s) found</div>`;

            results.forEach((entry, index) => {
                const corruptionLevel = Math.random();
                html += `
                    <div class="search-result-entry" style="animation-delay: ${index * 0.1}s">
                        <div class="result-id">${entry.id}</div>
                        <div class="result-title">${entry.title}</div>
                        <div class="result-type">${entry.type}</div>
                        <div class="result-description">${entry.description}</div>
                        ${corruptionLevel > 0.7 ? '<div class="result-corrupted-warning">⚠ This result may have been altered.</div>' : ''}
                    </div>
                `;
            });
        } else {
            const randomDisturbance = disturbingResults[Math.floor(Math.random() * disturbingResults.length)];
            html += `<div class="search-disturbance">${randomDisturbance}</div>`;
            html += `<div class="search-no-results">No entries match "${query}".</div>`;
            html += `<div class="search-no-results-detail">The archive refuses to acknowledge this query. Perhaps it was never meant to exist.</div>`;
        }

        searchResults.innerHTML = html;
        searchResults.classList.add('active');

        if (sanity > 20) {
            sanity -= 2;
            sanityBar.style.width = sanity + '%';
            sanityPercentage.textContent = Math.round(sanity) + '%';
        }
    }

    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 10) {
            searchInput.style.borderColor = 'var(--accent-red)';
            searchInput.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px var(--glow-red)';
        } else {
            searchInput.style.borderColor = 'var(--border-color)';
            searchInput.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5)';
        }
    });

    archiveEntries.forEach((entry, index) => {
        entry.style.opacity = '0';
        entry.style.transform = 'translateY(30px)';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    setTimeout(() => {
                        entry.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        entry.style.opacity = '1';
                        entry.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(entry);
    });

    const entryActions = document.querySelectorAll('.entry-action');
    entryActions.forEach(button => {
        button.addEventListener('click', function () {
            const entry = this.closest('.archive-entry');
            const title = entry.querySelector('.entry-title').textContent;

            sanity -= 5;
            if (sanity < minimumSanity) sanity = minimumSanity;

            sanityBar.style.width = sanity + '%';
            sanityPercentage.textContent = Math.round(sanity) + '%';

            this.textContent = '...';
            this.style.borderColor = 'var(--accent-red)';
            this.style.color = 'var(--accent-red)';

            setTimeout(() => {
                this.textContent = 'Withdrawn';
                this.style.borderColor = 'var(--border-color)';
                this.style.color = 'var(--text-secondary)';
                this.disabled = true;
            }, 1500);

            const warning = document.createElement('div');
            warning.className = 'entry-warning';
            warning.textContent = 'Accessing this entry has consequences. Your memory may not be your own.';
            warning.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-secondary);
                border: 1px solid var(--accent-red);
                padding: 15px 30px;
                font-family: 'Share Tech Mono', monospace;
                font-size: 11px;
                letter-spacing: 2px;
                color: var(--accent-red);
                z-index: 1002;
                box-shadow: 0 0 20px var(--glow-red);
                animation: warning-fade 3s ease forwards;
            `;

            document.body.appendChild(warning);
            setTimeout(() => warning.remove(), 3000);
        });
    });

    const glitchElements = document.querySelectorAll('.title-main, .section-title');
    glitchElements.forEach(el => {
        setInterval(() => {
            if (Math.random() < 0.05) {
                el.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                el.style.textShadow = `
                    ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 0 var(--accent-green),
                    ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 0 var(--accent-purple)
                `;
                setTimeout(() => {
                    el.style.transform = 'translate(0, 0)';
                    el.style.textShadow = '0 0 10px var(--glow-green), 0 0 20px var(--glow-green), 0 0 40px var(--glow-green)';
                }, 100);
            }
        }, 3000);
    });

    let glitchOverlayActive = false;
    function triggerGlitchOverlay() {
        if (glitchOverlayActive) return;
        glitchOverlayActive = true;

        const overlay = document.querySelector('.glitch-overlay');
        overlay.style.animation = 'none';
        overlay.offsetHeight;
        overlay.style.animation = 'glitch-scan 0.5s ease';
        setTimeout(() => {
            glitchOverlayActive = false;
        }, 500);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            searchInput.value = '';
        }
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            triggerGlitchOverlay();
        }
    });

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const depth = entry.boundingClientRect.top;
                const intensity = Math.max(0, Math.min(1, -depth / 500));
                if (intensity > 0.5 && Math.random() < 0.3) {
                    triggerGlitchOverlay();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.archive-section').forEach(section => {
        scrollObserver.observe(section);
    });

    const corruptedTextsAll = document.querySelectorAll('.corrupted-text');
    corruptedTextsAll.forEach((el, i) => {
        el.addEventListener('click', () => {
            if (sanity > 15) {
                sanity -= 3;
                sanityBar.style.width = sanity + '%';
                sanityPercentage.textContent = Math.round(sanity) + '%';
            }
            corruptText(el, 0.7);
            setTimeout(() => {
                el.textContent = originalTexts[el];
            }, 3000);
        });
    });

    const ambientSounds = [
        'You hear something breathing behind you.',
        'The text on the page shifts. Did it always say that?',
        'A low hum emanates from the walls of the archive.',
        'Something is watching you read this.',
        'The temperature drops. The lights flicker.',
        'You could swear the star charts are moving.',
        'A sound like wet footsteps echoes through the corridor.',
        'The corrupted text is trying to tell you something.',
        'Your reflection in the monitor looks away first.',
        'The archive has grown since you last checked.'
    ];

    let lastAmbientTime = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastAmbientTime > 30000 && scrollDepth > 30) {
            lastAmbientTime = now;
            const msg = ambientSounds[Math.floor(Math.random() * ambientSounds.length)];
            showAmbientMessage(msg);
        }
    });

    function showAmbientMessage(message) {
        const msgEl = document.createElement('div');
        msgEl.className = 'ambient-message';
        msgEl.textContent = message;
        msgEl.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'EB Garamond', serif;
            font-style: italic;
            font-size: 14px;
            color: var(--text-corrupted);
            opacity: 0;
            z-index: 1001;
            pointer-events: none;
            transition: opacity 1s ease;
            text-align: center;
            max-width: 500px;
            line-height: 1.6;
        `;
        document.body.appendChild(msgEl);

        requestAnimationFrame(() => {
            msgEl.style.opacity = '0.6';
        });

        setTimeout(() => {
            msgEl.style.opacity = '0';
            setTimeout(() => msgEl.remove(), 1000);
        }, 5000);
    }

    let cursorFlicker = false;
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.005) {
            cursorFlicker = true;
            document.body.style.cursor = 'none';
            setTimeout(() => {
                document.body.style.cursor = 'default';
                cursorFlicker = false;
            }, 100);
        }
    });

    console.log('%c⚠ WARNING: You should not be reading this.', 'color: #4a8a4a; font-size: 16px; font-family: monospace;');
    console.log('%cThe archive logs your presence.', 'color: #8a8a4a; font-size: 12px; font-family: monospace;');
    console.log('%cSanity: ' + sanity + '%', 'color: #6a6a1a; font-size: 11px; font-family: monospace;');
});