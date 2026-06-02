// GENECORP ARCHIVE TERMINAL - BIOSYSTEM v4.2.1 [CORRUPTED]
// Wasteland Survivor Database Interface Controller

document.addEventListener('DOMContentLoaded', function() {
    // === Core DOM References ===
    const bootSequence = document.getElementById('bootSequence');
    const bootText = bootSequence.querySelector('.boot-text');
    const mainInterface = document.getElementById('mainInterface');
    const characterGrid = document.getElementById('characterGrid');
    const contaminationWarning = document.getElementById('contaminationWarning');
    const factionButtons = document.querySelectorAll('.faction-btn');
    const corruptionParticles = document.getElementById('corruptionParticles');
    const cursorTrail = document.getElementById('cursorTrail');

    // === Boot Sequence Configuration ===
    const bootLines = [
        '> INITIALIZING GENECORP ARCHIVE TERMINAL...',
        '> CHECKING BIOLOGICAL CONTAINMENT... [FAILED]',
        '> REROUTING THROUGH SECURE CHANNEL...',
        '> WARNING: SECTOR 7G BREACH DETECTED',
        '> LOADING WASTELAND SURVIVOR DATABASE...',
        '> DECRYPTING SUBJECT FILES... [PARTIAL SUCCESS]',
        '> MUTATION CLASSIFICATION: OUTDATED',
        '> FACTION REGISTRY: CORRUPTED',
        '> ',
        '> DISPLAYING 6 ACTIVE SUBJECTS...',
        '> _'
    ];

    // === State Management ===
    let activeFaction = 'all';
    let isBootComplete = false;
    let particleInterval = null;
    let warningInterval = null;

    // === Boot Sequence Execution ===
    function executeBootSequence() {
        let lineIndex = 0;
        let charIndex = 0;
        let currentText = '';

        function typeNextChar() {
            if (lineIndex >= bootLines.length) {
                setTimeout(completeBoot, 800);
                return;
            }

            const currentLine = bootLines[lineIndex];

            if (charIndex < currentLine.length) {
                currentText += currentLine[charIndex];
                charIndex++;
                bootText.textContent = currentText;
                setTimeout(typeNextChar, Math.random() * 30 + 10);
            } else {
                currentText += '\n';
                charIndex = 0;
                lineIndex++;
                setTimeout(typeNextChar, Math.random() * 200 + 100);
            }
        }

        typeNextChar();
    }

    function completeBoot() {
        bootSequence.style.transition = 'opacity 1.5s ease';
        bootSequence.style.opacity = '0';
        setTimeout(() => {
            bootSequence.style.display = 'none';
            mainInterface.style.display = 'block';
            mainInterface.style.opacity = '0';
            mainInterface.style.transition = 'opacity 1s ease';
            requestAnimationFrame(() => {
                mainInterface.style.opacity = '1';
            });
            isBootComplete = true;
            initializeInteractiveSystems();
        }, 1500);
    }

    // === Faction Filtering ===
    function filterByFaction(faction) {
        activeFaction = faction;
        const cards = characterGrid.querySelectorAll('.character-card');

        cards.forEach((card, index) => {
            const cardFaction = card.dataset.faction;
            const shouldShow = faction === 'all' || cardFaction === faction;

            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 80);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        factionButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.faction === faction);
        });
    }

    function setupFactionFilters() {
        factionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterByFaction(btn.dataset.faction);
            });
        });
    }

    // === Character Card Interactions ===
    function setupCardInteractions() {
        const cards = characterGrid.querySelectorAll('.character-card');

        cards.forEach(card => {
            const mutationLevel = card.dataset.mutation;
            const placeholderGlitch = card.querySelector('.placeholder-glitch');
            const dataCorruption = card.querySelector('.data-corruption');
            const scanLine = card.querySelector('.scan-line');
            const placeholderScan = card.querySelector('.placeholder-scan');

            card.addEventListener('mouseenter', () => {
                intensifyCorruptionEffects(card, mutationLevel);

                if (placeholderGlitch) {
                    placeholderGlitch.style.animation = 'none';
                    placeholderGlitch.offsetHeight;
                    placeholderGlitch.style.animation = 'glitchSweep 0.4s ease';
                }

                if (dataCorruption) {
                    dataCorruption.style.transition = 'opacity 0.3s ease';
                    dataCorruption.style.opacity = getCorruptionOpacity(mutationLevel);
                }

                if (scanLine) {
                    scanLine.style.animation = 'scanFast 0.5s linear infinite';
                }
            });

            card.addEventListener('mouseleave', () => {
                normalizeCorruptionEffects(card, mutationLevel);

                if (dataCorruption) {
                    dataCorruption.style.opacity = '0';
                }

                if (scanLine) {
                    scanLine.style.animation = 'none';
                }
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

                card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
            });
        });
    }

    function getCorruptionOpacity(level) {
        const levels = {
            'low': '0.15',
            'moderate': '0.35',
            'severe': '0.55',
            'critical': '0.75'
        };
        return levels[level] || '0.2';
    }

    function intensifyCorruptionEffects(card, level) {
        const corruption = card.querySelector('.card-corruption');
        if (!corruption) return;

        const intensityMap = {
            'low': { opacity: '0.4', scale: '1.1' },
            'moderate': { opacity: '0.7', scale: '1.2' },
            'severe': { opacity: '0.9', scale: '1.3' },
            'critical': { opacity: '1', scale: '1.5' }
        };

        const settings = intensityMap[level] || intensityMap['low'];
        corruption.style.transition = 'all 0.3s ease';
        corruption.style.opacity = settings.opacity;
        corruption.style.transform = `scale(${settings.scale})`;
    }

    function normalizeCorruptionEffects(card, level) {
        const corruption = card.querySelector('.card-corruption');
        if (!corruption) return;

        const baseMap = {
            'low': '0',
            'moderate': '0.5',
            'severe': '0.8',
            'critical': '1'
        };

        corruption.style.opacity = baseMap[level] || '0';
        corruption.style.transform = 'scale(1)';
    }

    // === Contamination Warning System ===
    function triggerContaminationWarning() {
        contaminationWarning.classList.add('active');

        setTimeout(() => {
            contaminationWarning.classList.remove('active');
        }, 4000);
    }

    function setupWarningSystem() {
        warningInterval = setInterval(() => {
            if (Math.random() < 0.15) {
                triggerContaminationWarning();
            }
        }, 12000);
    }

    // === Corruption Particle System ===
    function createParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * window.innerWidth;
        const startY = -10;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${getRandomParticleColor()};
            left: ${startX}px;
            top: ${startY}px;
            opacity: ${Math.random() * 0.6 + 0.2};
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;

        corruptionParticles.appendChild(particle);

        const duration = Math.random() * 6000 + 4000;
        const drift = (Math.random() - 0.5) * 200;

        particle.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: particle.style.opacity },
            { transform: `translate(${drift}px, ${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)`, opacity: '0' }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).addEventListener('finish', () => {
            particle.remove();
        });
    }

    function getRandomParticleColor() {
        const colors = [
            'var(--corruption-green)',
            'var(--corruption-toxic)',
            'var(--phosphor-primary)',
            'var(--corruption-fungal)',
            'var(--corruption-severe)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function startParticleSystem() {
        particleInterval = setInterval(() => {
            if (document.hidden) return;
            createParticle();
        }, 300);
    }

    // === Cursor Trail Effect ===
    function setupCursorTrail() {
        const trailDots = [];
        const maxDots = 12;

        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: absolute;
                width: ${6 - i * 0.4}px;
                height: ${6 - i * 0.4}px;
                background: var(--phosphor-primary);
                border-radius: 50%;
                opacity: ${1 - i / maxDots};
                pointer-events: none;
                transition: all 0.08s ease;
            `;
            cursorTrail.appendChild(dot);
            trailDots.push({ element: dot, x: 0, y: 0 });
        }

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateTrail() {
            trailDots.forEach((dot, index) => {
                const targetX = index === 0 ? mouseX : trailDots[index - 1].x;
                const targetY = index === 0 ? mouseY : trailDots[index - 1].y;

                dot.x += (targetX - dot.x) * (0.3 - index * 0.02);
                dot.y += (targetY - dot.y) * (0.3 - index * 0.02);

                dot.element.style.left = `${dot.x - 3}px`;
                dot.element.style.top = `${dot.y - 3}px`;
            });

            requestAnimationFrame(updateTrail);
        }

        updateTrail();
    }

    // === Dynamic Scan Line Animation ===
    function setupScanAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitchSweep {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 0.6; }
                100% { transform: translateX(100%); opacity: 0; }
            }
            @keyframes scanFast {
                0% { background-position: 0 0; }
                100% { background-position: 0 12px; }
            }
        `;
        document.head.appendChild(style);
    }

    // === Character Card Entrance Animation ===
    function animateCardEntrance() {
        const cards = characterGrid.querySelectorAll('.character-card');

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 + index * 150);
        });
    }

    // === Periodic Glitch Effects ===
    function setupPeriodicGlitches() {
        setInterval(() => {
            if (Math.random() < 0.08) {
                triggerInterfaceGlitch();
            }
        }, 5000);
    }

    function triggerInterfaceGlitch() {
        const cards = characterGrid.querySelectorAll('.character-card');
        const randomCard = cards[Math.floor(Math.random() * cards.length)];

        if (!randomCard) return;

        const originalTransform = randomCard.style.transform;
        randomCard.style.transition = 'none';

        const glitches = [
            () => { randomCard.style.transform = 'translateX(3px) skewX(2deg)'; },
            () => { randomCard.style.transform = 'translateX(-3px) skewX(-2deg)'; },
            () => { randomCard.style.filter = 'hue-rotate(90deg) saturate(1.5)'; },
            () => { randomCard.style.filter = 'hue-rotate(-60deg) brightness(1.2)'; }
        ];

        const glitch = glitches[Math.floor(Math.random() * glitches.length)];
        glitch();

        setTimeout(() => {
            randomCard.style.transform = originalTransform;
            randomCard.style.filter = '';
            randomCard.style.transition = '';
        }, 80 + Math.random() * 120);
    }

    // === Mutation Fill Animation ===
    function animateMutationFills() {
        const fills = document.querySelectorAll('.mutation-fill');
        fills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';

            setTimeout(() => {
                fill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                fill.style.width = targetWidth;
            }, 500);
        });
    }

    // === Meter Fill Animation ===
    function animateMeterFills() {
        const meters = document.querySelectorAll('.meter-fill');
        meters.forEach(meter => {
            const targetWidth = meter.style.width;
            meter.style.width = '0%';

            setTimeout(() => {
                meter.style.transition = 'width 1.2s ease-out';
                meter.style.width = targetWidth;
            }, 800 + Math.random() * 400);
        });
    }

    // === Radar Chart Animation ===
    function animateRadarCharts() {
        const radars = document.querySelectorAll('.radar-fill');
        radars.forEach(radar => {
            const originalPoints = radar.getAttribute('points');
            radar.style.opacity = '0';

            setTimeout(() => {
                radar.style.transition = 'opacity 1s ease';
                radar.style.opacity = '1';
            }, 1000);
        });
    }

    // === Terminal Clock ===
    function setupTerminalClock() {
        const radiationLevel = document.querySelector('.radiation-level');

        setInterval(() => {
            const variation = Math.floor(Math.random() * 20) - 10;
            const baseLevel = 847;
            radiationLevel.textContent = `RAD: ${baseLevel + variation} mSv`;
        }, 3000);
    }

    // === Initialize All Systems ===
    function initializeInteractiveSystems() {
        setupFactionFilters();
        setupCardInteractions();
        setupWarningSystem();
        startParticleSystem();
        setupCursorTrail();
        setupScanAnimations();
        setupPeriodicGlitches();
        animateCardEntrance();
        animateMutationFills();
        animateMeterFills();
        animateRadarCharts();
        setupTerminalClock();
    }

    // === Global Error Handler ===
    window.addEventListener('error', (e) => {
        console.log(`[GENECORP TERMINAL] SYSTEM ANOMALY: ${e.message}`);
    });

    // === Visibility Change Handler ===
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && particleInterval) {
            clearInterval(particleInterval);
        } else if (!document.hidden && isBootComplete) {
            startParticleSystem();
        }
    });

    // === Start Boot Sequence ===
    executeBootSequence();
});