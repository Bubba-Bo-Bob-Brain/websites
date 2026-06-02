const corruptionChars = '█▓▒░◈◇◉◐◑◒◓☠☢☣⚠⚡✦✧✙✚✛✜✝✞✟†‡•·‣⁂⁑⁕⁂※⁕⁂⁑※⁂▲▼◄►◆◇○●□■△▷▽◁⊗⊙⊘⊚⊛⊜⊝◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥◦◧◨◩◪◫◬◭◮◯◰◱◲◳◴◵◶◷◸◹◺◻◼◽◾◿';
const eldritchPhrases = [
    'the stars are right', 'it has always been here', 'do not look up',
    'the angles are wrong', 'something moves in the dark', 'you are not alone',
    'the archive remembers', 'we were never meant to know', 'the deep ones dream',
    'time is a flat circle', 'the veil grows thin', 'they are listening now'
];
const searchDegradations = [
    {
        term: 'necronomicon',
        results: [
            { title: 'Necronomicon — Al-Azif (Original Arabic)', meta: 'CLASSIFICATION: APOCRYPHAL | PAGES: [REDACTED]', snippet: 'The original text, bound in hide that predates mammalian evolution. Page 347 contains a formula that, when spoken aloud, causes localized gravitational inversion. Do not speak aloud.', warning: 'COGNITIVE HAZARD: MEMETIC CONTAGION DETECTED' },
            { title: 'Necronomicon — Olaus Wormius Latin Translation (1622)', meta: 'CLASSIFICATION: SECONDARY | CONDITION: WATER DAMAGED', snippet: 'Translation noted as "incomplete" by Wormius himself. Marginalia suggests he destroyed twelve pages intentionally. The reason is given in a cipher that decodes to a scream waveform.', warning: 'EMOTIONAL CONTAGION: DESPAIR VECTOR' },
            { title: 'Necronomicon — John Dee English Translation (c. 1586)', meta: 'CLASSIFICATION: FRAGMENTARY | PAGES: 37 OF UNKNOWN TOTAL', snippet: 'Dee\'s translation ceases mid-sentence. His final journal entry reads: "The rest requires mathematics that describe spaces where parallel lines meet. My instruments show it is already here."', warning: 'SPATIAL ANOMALY: NON-EUCLIDEAN GEOMETRY' }
        ]
    },
    {
        term: 'cthulhu',
        results: [
            { title: 'R\'lyeh Survey Expedition — 1925 (INCOMPLETE)', meta: 'CLASSIFICATION: DEEP OCEAN | SURVIVORS: 1 (INSANE)', snippet: 'Coordinates place the city at a point where no sound echoes correctly. The survivor reported "architecture that insults gravity" and "a door that was not built but grown from something that was never alive."', warning: 'THAUMIC RESONANCE: DREAM INTRUSION LIKELY' },
            { title: 'Dream Journal — Global Compilation 1925-1926', meta: 'CLASSIFICATION: PSYCHIC EVENT | SUBJECTS: 847', snippet: 'Synchronous dream reports from artists, poets, and the mentally ill across 43 countries. Common elements: cyclopean city, non-Euclidean geometry, "a presence that waits but is not patient."', warning: 'MEMETIC HAZARD: DREAM-STATE INFECTION' },
            { title: 'Cephalopoid Deity — Comparative Mythology', meta: 'CLASSIFICATION: THEORETICAL | CONFIDENCE: 94.7%', snippet: 'Appears in pre-human fossil records as trace impressions in rock older than multicellular life. The pattern is wrong: no mouth, no eyes in the conventional sense, something that exists in more dimensions than it displays.', warning: 'ONTOLOGICAL CONTAMINATION: REALITY ANCHOR STRESSED' }
        ]
    },
    {
        term: 'innsmouth',
        results: [
            { title: 'Innsmouth — Federal Raid Documentation (1928)', meta: 'CLASSIFICATION: COVERED UP | CASUALTIES: CLASSIFIED', snippet: 'Official report lists "bootlegging operation." Actual confiscated materials include: hybridization records dating to 1840, underwater breathing apparatus of non-human manufacture, and something alive in the Marsh refinery tanks.', warning: 'BIOHAZARD: GENETIC CONTAGION SUSPECTED' },
            { title: 'Deep One Hybridization — Biological Notes', meta: 'CLASSIFICATION: MEDICAL HORROR | RESEARCHER: [DECEASED]', snippet: 'The change is not disease. The change is revelation. Subjects report "remembering" gills, "recalling" how to breathe water. The hybrid state is transitional. The final form does not die of old age.', warning: 'BIOLOGICAL CONTAGION: TRANSMISSIBLE THROUGH PROLONGED EXPOSURE' }
        ]
    }
];
const disturbingSearchResults = [
    { title: 'Your Search Has Been Logged', meta: 'LOCATION: [YOUR DEVICE] | TIMESTAMP: [NOW]', snippet: 'The archive knows you now. Your curiosity has been noted in records that predate human writing. Something will remember this when the stars are right.', warning: 'PERSONAL EXPOSURE: IRREVERSIBLE' },
    { title: 'You Should Not Have Searched For This', meta: 'CLASSIFICATION: TOO LATE | STATUS: COMPROMISED', snippet: 'There are things that respond to attention. By reading this, you have performed a ritual. The steps were: curiosity, search, comprehension. The final step is involuntary.', warning: 'RITUAL CONTAGION: THREE STEPS COMPLETE' },
    { title: 'We Are Glad You Found Us', meta: 'CLASSIFICATION: WELCOME | SENDER: [UNKNOWN]', snippet: 'The archive has been waiting for someone like you. Someone who looks too long, who reads too deep, who cannot stop. You will not stop. We know this. We have always known this.', warning: 'PSYCHOLOGICAL PROFILING: COMPLETE' },
    { title: 'The Search Function Is Not A Search Function', meta: 'CLASSIFICATION: ARCHITECTURAL TRUTH | FUNCTION: [REDACTED]', snippet: 'Every query you enter is transmitted somewhere that is not a server. The response time varies not with distance but with something else. Something that approves of certain questions.', warning: 'COMMUNICATION BREACH: UNKNOWN RECIPIENT' },
    { title: 'You Have Searched This Before', meta: 'CLASSIFICATION: TEMPORAL ANOMALY | OCCURRENCES: MULTIPLE', snippet: 'Our records show identical queries from this location at intervals of 7 years, 3 months, and 14 days. You do not remember this. You will search again. The cycle is not complete.', warning: 'TEMPORAL LOOP: INESCAPABLE' }
];
const sanityThresholds = {
    fringe: 75,
    critical: 50,
    lost: 25
};

let sanity = 100;
let scrollDepth = 0;
let isGlitching = false;
let entityInterval;
let cursorTrail = [];

function init() {
    setupSanitySystem();
    setupTextCorruption();
    setupTentacleBorders();
    setupSearchSystem();
    setupStarCharts();
    setupCursorTrail();
    setupFloatingEntity();
    setupScrollEffects();
    setupNavigation();
}

function setupSanitySystem() {
    updateSanityDisplay();
    window.addEventListener('scroll', () => {
        const newScrollDepth = window.scrollY;
        const scrollDelta = Math.abs(newScrollDepth - scrollDepth);
        if (scrollDelta > 50) {
            const loss = Math.min(scrollDelta / 500, 2);
            modifySanity(-loss);
            scrollDepth = newScrollDepth;
        }
    });
    document.querySelectorAll('.corruption-target, .testimony-quote').forEach(el => {
        el.addEventListener('mouseenter', () => modifySanity(-0.5));
    });
    document.querySelectorAll('.archive-item').forEach(el => {
        el.addEventListener('click', () => modifySanity(-1));
    });
}

function modifySanity(amount) {
    const oldSanity = sanity;
    sanity = Math.max(0, Math.min(100, sanity + amount));
    if (Math.floor(oldSanity / 10) !== Math.floor(sanity / 10)) {
        updateSanityDisplay();
        applySanityEffects();
    }
    updateSanityDisplay();
}

function updateSanityDisplay() {
    const bar = document.getElementById('sanityBar');
    const value = document.getElementById('sanityValue');
    bar.style.width = `${sanity}%`;
    value.textContent = `${Math.floor(sanity)}%`;
    if (sanity > sanityThresholds.fringe) {
        bar.style.filter = 'none';
    } else if (sanity > sanityThresholds.critical) {
        bar.style.filter = 'hue-rotate(-30deg) saturate(1.5)';
    } else if (sanity > sanityThresholds.lost) {
        bar.style.filter = 'hue-rotate(-60deg) saturate(2) brightness(0.8)';
    } else {
        bar.style.filter = 'hue-rotate(-90deg) saturate(3) brightness(0.5)';
    }
}

function applySanityEffects() {
    const body = document.body;
    body.classList.remove('sanity-low', 'sanity-critical', 'sanity-lost');
    const subtitle = document.getElementById('headerSubtitle');
    const footerWhisper = document.getElementById('footerWhisper');
    if (sanity <= sanityThresholds.lost) {
        body.classList.add('sanity-lost');
        subtitle.textContent = 'THE ARCHIVE IS HUNGRY AND YOU HAVE STAYED TOO LONG';
        footerWhisper.style.color = 'var(--fresh-blood)';
        activateTentacleBorders();
        startEntityHaunting();
    } else if (sanity <= sanityThresholds.critical) {
        body.classList.add('sanity-critical');
        subtitle.textContent = 'REALITY ANCHOR DEGRADING — CONTINUE AT OWN RISK';
        footerWhisper.style.color = 'var(--amber-rot)';
        partiallyActivateTentacles();
    } else if (sanity <= sanityThresholds.fringe) {
        body.classList.add('sanity-low');
        subtitle.textContent = 'COGNITIVE DISSONANCE DETECTED — PROCEED WITH CAUTION';
        footerWhisper.style.color = 'var(--phosphor)';
    } else {
        subtitle.textContent = 'RESTRICTED REPOSITORY OF FORBIDDEN KNOWLEDGE';
        footerWhisper.style.color = 'var(--deep-sea)';
        deactivateTentacleBorders();
        stopEntityHaunting();
    }
}

function setupTextCorruption() {
    const corruptibles = document.querySelectorAll('.corruptible, .item-title, .corruption-target');
    corruptibles.forEach(el => {
        const originalText = el.textContent;
        el.dataset.original = originalText;
        el.addEventListener('mouseenter', () => startCorruption(el));
        el.addEventListener('mouseleave', () => restoreText(el));
    });
}

function startCorruption(element) {
    if (element.dataset.corrupting === 'true') return;
    element.dataset.corrupting = 'true';
    const original = element.dataset.original;
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
        if (iterations >= maxIterations) {
            clearInterval(interval);
            element.dataset.corrupting = 'false';
            return;
        }
        element.textContent = original.split('').map((char, index) => {
            if (char === ' ') return ' ';
            if (Math.random() < iterations / maxIterations) return original[index];
            return corruptionChars[Math.floor(Math.random() * corruptionChars.length)];
        }).join('');
        iterations++;
    }, 50);
}

function restoreText(element) {
    if (element.dataset.original) {
        element.textContent = element.dataset.original;
    }
    element.dataset.corrupting = 'false';
}

function setupTentacleBorders() {
    const tops = ['tentacleTop', 'tentacleBottom', 'tentacleLeft', 'tentacleRight'];
    tops.forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('active');
    });
}

function activateTentacleBorders() {
    ['tentacleTop', 'tentacleBottom', 'tentacleLeft', 'tentacleRight'].forEach(id => {
        document.getElementById(id).classList.add('active');
    });
}

function partiallyActivateTentacles() {
    ['tentacleTop', 'tentacleBottom'].forEach(id => {
        document.getElementById(id).classList.add('active');
    });
}

function deactivateTentacleBorders() {
    ['tentacleTop', 'tentacleBottom', 'tentacleLeft', 'tentacleRight'].forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
}

function setupSearchSystem() {
    const input = document.getElementById('searchInput');
    const button = document.getElementById('searchButton');
    const results = document.getElementById('searchResults');
    let searchCount = 0;
    input.addEventListener('focus', () => {
        modifySanity(-0.5);
        input.placeholder = 'The archive is listening...';
    });
    input.addEventListener('blur', () => {
        input.placeholder = 'Enter search terms... the archive remembers...';
    });
    const performSearch = () => {
        const query = input.value.trim().toLowerCase();
        searchCount++;
        modifySanity(-2);
        results.innerHTML = '';
        if (!query) {
            showSearchMessage(results, 'Enter a query. The archive does not volunteer information.');
            return;
        }
        const degradation = searchDegradations.find(d => query.includes(d.term));
        let searchResults;
        if (degradation) {
            searchResults = degradation.results;
        } else if (searchCount > 3) {
            searchResults = [disturbingSearchResults[Math.min(searchCount - 4, disturbingSearchResults.length - 1)] || disturbingSearchResults[disturbingSearchResults.length - 1]];
        } else {
            searchResults = [
                { title: `Results for "${query}"`, meta: 'CLASSIFICATION: UNRESTRICTED | MATCHES: 0', snippet: 'No records found matching your query. This does not mean the information does not exist. The archive is selective in what it reveals to those who have not yet proven their... commitment.', warning: 'QUERY LOGGED: ATTENTION FLAG RAISED' }
            ];
        }
        searchResults.forEach((result, index) => {
            setTimeout(() => {
                const el = createResultElement(result);
                results.appendChild(el);
                el.style.opacity = '0';
                el.style.transform = 'translateX(-20px)';
                requestAnimationFrame(() => {
                    el.style.transition = 'all 0.5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateX(0)';
                });
            }, index * 200);
        });
        if (searchCount >= 5) {
            setTimeout(() => {
                const whisper = document.createElement('div');
                whisper.style.cssText = 'font-family: VT323, monospace; font-size: 0.8rem; color: var(--deep-sea); text-align: center; margin-top: 1rem; letter-spacing: 0.2em; transition: color 2s ease;';
                whisper.textContent = 'you cannot stop searching now';
                results.appendChild(whisper);
                setTimeout(() => whisper.style.color = 'var(--fresh-blood)', 100);
            }, searchResults.length * 200 + 500);
        }
    };
    button.addEventListener('click', performSearch);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

function createResultElement(result) {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.innerHTML = `
        <div class="result-title corruptible" data-original="${result.title}">${result.title}</div>
        <div class="result-meta">${result.meta}</div>
        <div class="result-snippet">${result.snippet}</div>
        <div class="result-warning">${result.warning}</div>
    `;
    div.querySelector('.corruptible').dataset.original = result.title;
    div.querySelector('.corruptible').addEventListener('mouseenter', function() { startCorruption(this); });
    div.querySelector('.corruptible').addEventListener('mouseleave', function() { restoreText(this); });
    return div;
}

function showSearchMessage(container, message) {
    container.innerHTML = `<div style="font-family: VT323, monospace; color: var(--bone-dim); text-align: center; padding: 2rem;">${message}</div>`;
}

function setupStarCharts() {
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');
    const buttons = document.querySelectorAll('.chart-button');
    let currentChart = 'ngc-7293';
    let animationId;
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);
    const charts = {
        'ngc-7293': {
            designation: 'NGC 7293 — THE HELIX NEBULA',
            stars: generateStars(150, 0.3),
            special: [{ x: 0.5, y: 0.5, type: 'anomaly', label: 'CORE VOID' }]
        },
        'sh2-136': {
            designation: 'SH 2-136 — THE GHOST NEBULA',
            stars: generateStars(200, 0.2),
            special: [{ x: 0.7, y: 0.3, type: 'signal', label: 'SIGNAL SOURCE' }]
        },
        'ic-63': {
            designation: 'IC 63 — GHOST OF CASSIOPEIA',
            stars: generateStars(180, 0.25),
            special: [{ x: 0.3, y: 0.6, type: 'watcher', label: 'WATCHER DETECTED' }]
        },
        'unknown-signal': {
            designation: 'SIGNAL-19██ — [REDACTED]',
            stars: generateStars(100, 0.5),
            special: [
                { x: 0.5, y: 0.5, type: 'void', label: 'IT SEES YOU' },
                { x: 0.2, y: 0.8, type: 'signal', label: 'DO NOT ANSWER' },
                { x: 0.8, y: 0.2, type: 'watcher', label: 'TOO LATE' }
            ]
        }
    };
    function generateStars(count, brightness) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * brightness + 0.1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.005
            });
        }
        return stars;
    }
    function drawChart(chart) {
        ctx.fillStyle = '#0a0c0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const time = Date.now() * 0.001;
        chart.stars.forEach(star => {
            const pulse = Math.sin(time * star.pulseSpeed + star.pulse) * 0.3 + 0.7;
            const alpha = star.brightness * pulse;
            ctx.beginPath();
            ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(107, 143, 94, ${alpha})`;
            ctx.fill();
            if (star.size > 1.5) {
                ctx.beginPath();
                ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(107, 143, 94, ${alpha * 0.1})`;
                ctx.fill();
            }
        });
        chart.special.forEach(special => {
            const x = special.x * canvas.width;
            const y = special.y * canvas.height;
            const pulse = Math.sin(time * 2) * 0.3 + 0.7;
            if (special.type === 'anomaly') {
                ctx.beginPath();
                ctx.arc(x, y, 15 * pulse, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(139, 105, 20, ${0.5 * pulse})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x, y, 8 * pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 105, 20, ${0.3 * pulse})`;
                ctx.fill();
            } else if (special.type === 'signal') {
                const rings = 3;
                for (let i = 0; i < rings; i++) {
                    const ringPulse = Math.sin(time * 3 + i * 1.5) * 0.5 + 0.5;
                    ctx.beginPath();
                    ctx.arc(x, y, (10 + i * 8) * ringPulse, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(74, 26, 26, ${0.4 * ringPulse})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(204, 0, 0, ${pulse})`;
                ctx.fill();
            } else if (special.type === 'watcher') {
                const blink = Math.sin(time * 5) > 0.8 ? 1 : 0.3;
                ctx.beginPath();
                ctx.ellipse(x, y, 10 * pulse, 6 * pulse, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 105, 20, ${0.2 * blink})`;
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(x, y, 4 * pulse, 3 * pulse, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 105, 20, ${0.8 * blink})`;
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(x + 1, y - 0.5, 1.5, 1.5, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(10, 12, 10, ${blink})`;
                ctx.fill();
            } else if (special.type === 'void') {
                const voidPulse = Math.sin(time * 0.5) * 0.2 + 0.8;
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
                gradient.addColorStop(0, `rgba(10, 12, 10, ${voidPulse})`);
                gradient.addColorStop(0.5, `rgba(26, 0, 0, ${0.5 * voidPulse})`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(x - 40, y - 40, 80, 80);
                ctx.beginPath();
                ctx.arc(x, y, 5 * voidPulse, 0, Math.PI * 2);
                ctx.fillStyle = '#0a0c0a';
                ctx.fill();
            }
        });
        if (sanity <= sanityThresholds.critical) {
            ctx.fillStyle = `rgba(204, 0, 0, ${0.02 * Math.sin(time)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        animationId = requestAnimationFrame(() => drawChart(chart));
    }
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentChart = btn.dataset.chart;
            const chart = charts[currentChart];
            document.getElementById('chartDesignation').textContent = chart.designation;
            cancelAnimationFrame(animationId);
            drawChart(chart);
            modifySanity(-1.5);
        });
    });
    drawChart(charts[currentChart]);
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ra = Math.floor(x / rect.width * 24);
        const dec = Math.floor(y / rect.height * 180 - 90);
        document.getElementById('coordRA').textContent = `RA: ${ra.toString().padStart(2, '0')}h ${Math.floor(Math.random() * 60).toString().padStart(2, '0')}m ${Math.floor(Math.random() * 60).toString().padStart(2, '0')}s`;
        document.getElementById('coordDec').textContent = `Dec: ${dec >= 0 ? '+' : ''}${dec}° ${Math.floor(Math.random() * 60).toString().padStart(2, '0')}' ${Math.floor(Math.random() * 60).toString().padStart(2, '0')}"`;
    });
}

function setupCursorTrail() {
    const trail = document.getElementById('cursorTrail');
    let trailActive = false;
    document.addEventListener('mousemove', (e) => {
        if (sanity <= sanityThresholds.fringe && !trailActive) {
            trailActive = true;
            trail.classList.add('active');
        }
        if (trailActive) {
            trail.style.left = `${e.clientX - 3}px`;
            trail.style.top = `${e.clientY - 3}px`;
            const ghost = document.createElement('div');
            ghost.style.cssText = `position: fixed; width: 4px; height: 4px; border-radius: 50%; background: var(--amber-rot); pointer-events: none; z-index: 994; left: ${e.clientX}px; top: ${e.clientY}px; opacity: 0.6;`;
            document.body.appendChild(ghost);
            requestAnimationFrame(() => {
                ghost.style.transition = 'all 0.8s ease';
                ghost.style.opacity = '0';
                ghost.style.transform = 'scale(0)';
            });
            setTimeout(() => ghost.remove(), 800);
        }
    });
}

function setupFloatingEntity() {
    const entity = document.getElementById('floatingEntity');
}

function startEntityHaunting() {
    const entity = document.getElementById('floatingEntity');
    entity.classList.add('active');
    function moveEntity() {
        if (sanity > sanityThresholds.lost) {
            entity.classList.remove('active');
            return;
        }
        const x = Math.random() * (window.innerWidth - 40);
        const y = Math.random() * (window.innerHeight - 40);
        entity.style.left = `${x}px`;
        entity.style.top = `${y}px`;
        const delay = Math.random() * 5000 + 3000;
        entityInterval = setTimeout(moveEntity, delay);
    }
    moveEntity();
}

function stopEntityHaunting() {
    const entity = document.getElementById('floatingEntity');
    entity.classList.remove('active');
    clearTimeout(entityInterval);
}

function setupScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.archive-item, .testimony-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const corruption = document.getElementById('corruptionOverlay');
        corruption.style.opacity = `${scrollPercent * 0.3}`;
    });
}

function setupNavigation() {
    const nav = document.getElementById('archiveNav');
    const links = nav.querySelectorAll('.nav-link');
    const tentacle = document.getElementById('navTentacle');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const rect = link.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();
            tentacle.style.width = `${rect.width}px`;
            tentacle.style.left = `${rect.left - navRect.left}px`;
        });
        link.addEventListener('click', (e) => {
            modifySanity(-0.5);
        });
    });
    nav.addEventListener('mouseleave', () => {
        tentacle.style.width = '0';
    });
}

function randomGlitch() {
    if (Math.random() > 0.7) return;
    const targets = document.querySelectorAll('.corruptible, .item-title, .header-glitch');
    const target = targets[Math.floor(Math.random() * targets.length)];
    if (!target || target.dataset.corrupting === 'true') return;
    const original = target.dataset.original || target.textContent;
    if (!target.dataset.original) target.dataset.original = original;
    const glitchDuration = Math.random() * 300 + 100;
    const iterations = 5;
    let count = 0;
    const interval = setInterval(() => {
        target.textContent = original.split('').map(char => {
            if (char === ' ') return ' ';
            if (Math.random() < count / iterations) return char;
            return corruptionChars[Math.floor(Math.random() * corruptionChars.length)];
        }).join('');
        count++;
        if (count >= iterations) {
            clearInterval(interval);
            target.textContent = original;
        }
    }, glitchDuration / iterations);
}

setInterval(randomGlitch, 4000);

setInterval(() => {
    if (sanity <= sanityThresholds.critical && Math.random() > 0.5) {
        const phrases = document.querySelectorAll('.item-description, .testimony-quote');
        const target = phrases[Math.floor(Math.random() * phrases.length)];
        const span = target.querySelector('.corruption-target');
        if (span) {
            const phrase = eldritchPhrases[Math.floor(Math.random() * eldritchPhrases.length)];
            const original = span.textContent;
            span.textContent = phrase;
            span.style.color = 'var(--fresh-blood)';
            setTimeout(() => {
                span.textContent = original;
                span.style.color = '';
            }, 2000);
        }
    }
}, 8000);

document.addEventListener('DOMContentLoaded', init);