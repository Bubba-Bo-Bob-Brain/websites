/* ═══════════════════════════════════════════════════════════════ */
/* THE CORRUPTED LABYRINTH — SCRIPTS */
/* Navigate through layers of digital decay */
/* ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    /* ─── STATE ─── */
    const state = {
        currentLayer: 'loading',
        loadingComplete: false,
        loadingProgress: 0,
        glitchInterval: null,
        decayInterval: null,
        particleInterval: null,
        visitedLayers: new Set()
    };

    /* ─── ELEMENTS ─── */
    const els = {
        loadingScreen: document.getElementById('loading-screen'),
        loadingBar: document.querySelector('.loading-bar'),
        loadingError: document.querySelector('.loading-error'),
        floatingCorruption: document.getElementById('floating-corruption'),
        layers: {
            layer1: document.getElementById('layer-1'),
            layer2: document.getElementById('layer-2'),
            layer3: document.getElementById('layer-3'),
            layer4: document.getElementById('layer-4'),
            layer5: document.getElementById('layer-5'),
            layer6: document.getElementById('layer-6')
        }
    };

    /* ═══════════════════════════════════════════════════════════════ */
    /* INITIALIZATION */
    /* ═══════════════════════════════════════════════════════════════ */

    function init() {
        startLoadingSequence();
        setupEventListeners();
        startFloatingParticles();
        startTextDecay();
    }

    /* ═══════════════════════════════════════════════════════════════ */
    /* LOADING SCREEN */
    /* ═══════════════════════════════════════════════════════════════ */

    function startLoadingSequence() {
        const targetProgress = 73; // It never reaches 100
        const loadInterval = setInterval(() => {
            if (state.loadingProgress < targetProgress) {
                // Erratic progress increments
                const increment = Math.random() < 0.3 
                    ? Math.floor(Math.random() * 5) + 1 
                    : Math.floor(Math.random() * 2);
                
                // Sometimes it goes backwards
                if (Math.random() < 0.1 && state.loadingProgress > 20) {
                    state.loadingProgress -= Math.floor(Math.random() * 3);
                } else {
                    state.loadingProgress = Math.min(state.loadingProgress + increment, targetProgress);
                }
                
                els.loadingBar.style.width = state.loadingProgress + '%';
            }
        }, 200);

        // Show error after a delay
        setTimeout(() => {
            els.loadingError.classList.add('visible');
        }, 3000);

        // Click to bypass
        els.loadingScreen.addEventListener('click', () => {
            if (!state.loadingComplete) {
                clearInterval(loadInterval);
                state.loadingComplete = true;
                
                // Dramatic finish
                els.loadingBar.style.width = '100%';
                els.loadingBar.style.background = 'linear-gradient(90deg, #ff0040, #ff0040)';
                
                setTimeout(() => {
                    transitionToLayer('layer1');
                }, 300);
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════ */
    /* LAYER TRANSITIONS */
    /* ═══════════════════════════════════════════════════════════════ */

    function transitionToLayer(layerId) {
        // Hide all layers
        Object.values(els.layers).forEach(layer => {
            layer.classList.add('hidden');
            layer.classList.remove('layer-entering');
        });

        // Hide loading screen
        if (layerId !== 'loading') {
            els.loadingScreen.style.display = 'none';
        }

        // Show target layer
        const targetLayer = els.layers[layerId];
        if (targetLayer) {
            targetLayer.classList.remove('hidden');
            targetLayer.classList.add('layer-entering');
            
            // Scroll to top
            targetLayer.scrollTop = 0;
            
            state.currentLayer = layerId;
            state.visitedLayers.add(layerId);

            // Trigger layer-specific effects
            switch(layerId) {
                case 'layer1':
                    initLayer1Effects();
                    break;
                case 'layer2':
                    initLayer2Effects();
                    break;
                case 'layer3':
                    initLayer3Effects();
                    break;
                case 'layer4':
                    initLayer4Effects();
                    break;
                case 'layer5':
                    initLayer5Effects();
                    break;
                case 'layer6':
                    initLayer6Effects();
                    break;
            }
        }
    }

    /* ═══════════════════════════════════════════════════════════════ */
    /* EVENT LISTENERS */
    /* ═══════════════════════════════════════════════════════════════ */

    function setupEventListeners() {
        // Layer 1: Dead link clicks trigger glitch
        document.querySelectorAll('.dead-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                triggerLinkGlitch(e.target);
            });
        });

        // Layer 1: Dead link cards
        document.querySelectorAll('.dead-link-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Special: DB leak trigger
                if (card.id === 'db-leak-trigger') {
                    triggerScreenCorruption(() => {
                        transitionToLayer('layer2');
                    });
                } else {
                    triggerCardError(card);
                }
            });
        });

        // Layer 1: Terminal trigger (footer)
        document.getElementById('terminal-trigger').addEventListener('click', (e) => {
            e.preventDefault();
            triggerScreenCorruption(() => {
                transitionToLayer('layer2');
            });
        });

        // Layer 2: Terminal trigger
        const terminalTrigger2 = document.getElementById('terminal-trigger-2');
        if (terminalTrigger2) {
            terminalTrigger2.addEventListener('click', () => {
                triggerScreenCorruption(() => {
                    transitionToLayer('layer3');
                });
            });
        }

        // Layer 2: Any key press
        document.addEventListener('keydown', (e) => {
            if (state.currentLayer === 'layer2') {
                triggerScreenCorruption(() => {
                    transitionToLayer('layer3');
                });
            }
        });

        // Layer 3: BSOD trigger
        const bsodTrigger = document.getElementById('bsod-trigger');
        if (bsodTrigger) {
            bsodTrigger.addEventListener('click', () => {
                triggerScreenCorruption(() => {
                    transitionToLayer('layer4');
                });
            });
        }

        // Layer 3: Key press
        document.addEventListener('keydown', (e) => {
            if (state.currentLayer === 'layer3') {
                triggerScreenCorruption(() => {
                    transitionToLayer('layer4');
                });
            }
        });

        // Layer 4: BSOD click
        document.getElementById('layer-4').addEventListener('click', () => {
            if (state.currentLayer === 'layer4') {
                triggerScreenCorruption(() => {
                    transitionToLayer('layer5');
                });
            }
        });

        // Layer 5: Museum trigger
        const museumTrigger = document.getElementById('museum-trigger');
        if (museumTrigger) {
            museumTrigger.addEventListener('click', () => {
                triggerScreenCorruption(() => {
                    transitionToLayer('layer6');
                });
            });
        }

        // Layer 6: Restart
        const restartTrigger = document.getElementById('restart-trigger');
        if (restartTrigger) {
            restartTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                triggerScreenCorruption(() => {
                    // Reset and go back to loading
                    state.loadingComplete = false;
                    state.loadingProgress = 0;
                    els.loadingBar.style.width = '0%';
                    els.loadingBar.style.background = 'linear-gradient(90deg, var(--text-primary), var(--accent-amber))';
                    els.loadingError.classList.remove('visible');
                    els.loadingScreen.style.display = 'flex';
                    
                    Object.values(els.layers).forEach(layer => {
                        layer.classList.add('hidden');
                    });
                    
                    state.currentLayer = 'loading';
                    startLoadingSequence();
                });
            });
        }

        // Glitch link (clue)
        document.querySelector('.glitch-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            triggerLinkGlitch(e.target);
        });
    }

    /* ═══════════════════════════════════════════════════════════════ */
    /* LAYER-SPECIFIC EFFECTS */
    /* ═══════════════════════════════════════════════════════════════ */

    function initLayer1Effects() {
        // Periodic random glitch on the 404
        state.glitchInterval = setInterval(() => {
            const massive404 = document.querySelector('.massive-404');
            if (massive404) {
                massive404.classList.add('glitching');
                setTimeout(() => {
                    massive404.classList.remove('glitching');
                }, 200);
            }
        }, 5000);

        // Random dead link flickers
        setInterval(() => {
            const links = document.querySelectorAll('.dead-link');
            const randomLink = links[Math.floor(Math.random() * links.length)];
            if (randomLink) {
                randomLink.style.opacity = '0.2';
                setTimeout(() => {
                    randomLink.style.opacity = '1';
                }, 100);
            }
        }, 3000);

        // Corrupt content blocks periodically
        setInterval(() => {
            const blocks = document.querySelectorAll('.content-block');
            const randomBlock = blocks[Math.floor(Math.random() * blocks.length)];
            if (randomBlock) {
                randomBlock.style.transform = `skewX(${(Math.random() - 0.5) * 2}deg)`;
                randomBlock.style.filter = `hue-rotate(${Math.random() * 30}deg)`;
                setTimeout(() => {
                    randomBlock.style.transform = 'skewX(0deg)';
                    randomBlock.style.filter = 'none';
                }, 150);
            }
        }, 4000);
    }

    function initLayer2Effects() {
        // Animate table rows appearing
        const rows = document.querySelectorAll('.data-row');
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transition = 'opacity 0.3s ease';
            }, index * 200);
        });

        // Random row glitch
        setInterval(() => {
            const randomRow = rows[Math.floor(Math.random() * rows.length)];
            if (randomRow && !randomRow.classList.contains('corrupted-row')) {
                randomRow.style.background = 'rgba(255, 0, 64, 0.1)';
                setTimeout(() => {
                    randomRow.style.background = '';
                }, 200);
            }
        }, 2000);
    }

    function initLayer3Effects() {
        // Typing effect for the last command
        const lastCmd = document.getElementById('last-cmd');
        if (lastCmd) {
            const text = lastCmd.textContent;
            lastCmd.textContent = '';
            lastCmd.style.borderRight = '2px solid var(--text-primary)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    lastCmd.textContent += text[i];
                    i++;
                } else {
                    clearInterval(typeInterval);
                    lastCmd.style.borderRight = 'none';
                }
            }, 80);
        }
    }

    function initLayer4Effects() {
        // Add static noise effect
        const bsod = document.querySelector('.bsod');
        if (bsod) {
            // Random screen flicker
            setInterval(() => {
                if (Math.random() < 0.1) {
                    bsod.style.opacity = '0.8';
                    setTimeout(() => {
                        bsod.style.opacity = '1';
                    }, 50);
                }
            }, 1000);
        }
    }

    function initLayer5Effects() {
        // Melting text effect
        const lines = document.querySelectorAll('.melting-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
                line.style.filter = 'blur(0)';
            }, index * 700);
        });

        // Glitch art animation
        const art = document.querySelector('.corrupted-art');
        if (art) {
            setInterval(() => {
                art.style.textShadow = `${(Math.random() - 0.5) * 10}px ${(Math.random() - 0.5) * 5}px 20px rgba(201, 162, 39, 0.3)`;
            }, 500);
        }
    }

    function initLayer6Effects() {
        // Museum entrance animation
        const content = document.querySelector('.museum-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(30px)';
            content.style.transition = 'all 2s ease';
            
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 500);
        }

        // Subtle golden particles
        createMuseumParticles();
    }

    /* ═══════════════════════════════════════════════════════════════ */
    /* GLITCH & CORRUPTION EFFECTS */
    /* ═══════════════════════════════════════════════════════════════ */

    function triggerLinkGlitch(element) {
        element.classList.add('glitching');
        
        // Create glitch overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            pointer-events: none;
            z-index: 9995;
        `;
        document.body.appendChild(overlay);

        // Screen flash
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            overlay.style.background = flashCount % 2 === 0 
                ? 'rgba(255, 0, 64, 0.05)' 
                : 'transparent';
            flashCount++;
            
            if (flashCount > 6) {
                clearInterval(flashInterval);
                overlay.remove();
                element.classList.remove('glitching');
            }
        }, 50);
    }

    function triggerCardError(card) {
        const statusEl = card.querySelector('.dl-status');
        const originalStatus = statusEl.textContent;
        
        // Cycle through error messages
        const errors = [
            '[ERR_CONNECTION_TIMED_OUT]',
            '[SSL_ERROR_BAD_CERT]',
            '[NET::ERR_EMPTY_RESPONSE]',
            '[HSTS_VIOLATION]',
            '[CONNECTION_RESET]',
            originalStatus
        ];
        
        let errorIndex = 0;
        const errorInterval = setInterval(() => {
            statusEl.textContent = errors[errorIndex];
            statusEl.style.color = 'var(--accent-red)';
            errorIndex++;
            
            if (errorIndex >= errors.length) {
                clearInterval(errorInterval);
                statusEl.style.color = '';
            }
        }, 150);
    }

    function triggerScreenCorruption(callback) {
        // Create full-screen corruption effect
        const corruption = document.createElement('div');
        corruption.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--text-primary);
            overflow: hidden;
        `;

        // Generate random hex data
        let hexLines = '';
        for (let i = 0; i < 30; i++) {
            hexLines += generateHexLine() + '\n';
        }
        
        corruption.innerHTML = `<pre style="text-align: left; line-height: 1.4;">${hexLines}</pre>`;
        document.body.appendChild(corruption);

        // Rapid hex scramble
        let scrambleCount = 0;
        const scrambleInterval = setInterval(() => {
            corruption.querySelector('pre').textContent = generateHexDump();
            scrambleCount++;
            
            if (scrambleCount > 15) {
                clearInterval(scrambleInterval);
                
                // Flash to black
                corruption.style.background = '#000';
                
                setTimeout(() => {
                    corruption.remove();
                    if (callback) callback();
                }, 100);
            }
        }, 40);
    }

    function generateHexLine() {
        const chars = '0123456789ABCDEF';
        let line = '0x';
        for (let i = 0; i < 8; i++) {
            line += chars[Math.floor(Math.random() * chars.length)];
        }
        line += ': ';
        for (let i = 0; i < 16; i++) {
            line += chars[Math.floor(Math.random() * chars.length)];
            if (i % 2 === 1) line += ' ';
        }
        return line;
    }

    function generateHexDump() {
        let dump = '';
        for (let i = 0; i < 25; i++) {
            dump += generateHexLine() + '\n';
        }
        dump += '\n[ MEMORY CORRUPTION DETECTED ]\n';
        dump += '[ ATTEMPTING RECOVERY... ]\n';
        dump += '[ ████████████░░░░░░░░░░░░░ ]\n';
        return dump;
    }

    /* ═══════════════════════════════════════════════════════════════ */
    /* TEXT DECAY EFFECT */
    /* ═══════════════════════════════════════════════════════════════ */

    function startTextDecay() {
        const corruptChars = ['█', '▓', '▒', '░', '▄', '▀', '■', '□', '▪', '▫'];
        
        state.decayInterval = setInterval(() => {
            if (state.currentLayer === 'layer1') {
                // Decay text elements
                document.querySelectorAll('.decay-text, .decaying').forEach(el => {
                    if (Math.random() < 0.1) {
                        const original = el.dataset.original || el.textContent;
                        el.textContent = corruptText(original, corruptChars);
                    }
                });

                // Decay nav items
                document.querySelectorAll('.dead-link').forEach(link => {
                    if (Math.random() < 0.05) {
                        const original = link.textContent;
                        link.textContent = corruptText(original, corruptChars);
                        setTimeout(() => {
                            link.textContent = original;
                        }, 500);
                    }
                });
            }
        }, 500);
    }

    function corruptText(text, corruptChars) {
        return text.split('').map(char => {
            if (char === ' ') return ' ';
            if (Math.random() < 0.08) {
                return corruptChars[Math.floor(Math.random() * corruptChars.length)];
            }
            return char;
        }).join('');
    }

    /* ═══════════════════════════════════════════════════════════════ */
    /* FLOATING PARTICLES */
    /* ═══════════════════════════════════════════════════════════════ */

    function startFloatingParticles() {
        const particleChars = ['0', '1', '█', '▓', '▒', '░', 'X', '#', '!', '?', 'NULL', 'ERR', '404', 'NaN'];
        
        state.particleInterval = setInterval(() => {
            if (state.currentLayer !== 'loading' && state.currentLayer !== 'layer6') {
                createParticle(particleChars);
            }
        }, 2000);
    }

    function createParticle(chars) {
        const particle = document.createElement('div');
        particle.className = 'corrupt-particle';
        particle.textContent = chars[Math.floor(Math.random() * chars.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.bottom = '-20px';
        particle.style.animationDuration = (5 + Math.random() * 10) + 's';
        
        els.floatingCorruption.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 15000);
    }

    function createMuseumParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        `;
        document.getElementById('layer-6').appendChild(particleContainer);

        // Create golden dust particles
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const dust = document.createElement('div');
                dust.style.cssText = `
                    position: absolute;
                    width: ${1 + Math.random() * 3}px;
                    height: ${1 + Math.random() * 3}px;
                    background: rgba(201, 162, 39, ${0.1 + Math.random() * 0.3});
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: dustFloat ${10 + Math.random() * 20}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
                particleContainer.appendChild(dust);
            }, i * 100);
        }

        // Add keyframe for dust animation
        if (!document.getElementById('dust-keyframes')) {
            const style = document.createElement('style');
            style.id = 'dust-keyframes';
            style.textContent = `
                @keyframes dustFloat {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(${(Math.random() - 0.5) * 200}px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ═══════════════════════════════════════════════════════════════ */
    /* RANDOM GLITCH EVENTS */
    /* ═══════════════════════════════════════════════════════════════ */

    // Periodic screen shake
    setInterval(() => {
        if (state.currentLayer !== 'layer6' && state.currentLayer !== 'loading' && Math.random() < 0.05) {
            document.body.style.transform = `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 4}px)`;
            setTimeout(() => {
                document.body.style.transform = 'none';
            }, 50);
        }
    }, 3000);

    // Random color channel shift
    setInterval(() => {
        if (state.currentLayer !== 'layer6' && state.currentLayer !== 'loading' && Math.random() < 0.03) {
            const activeLayer = document.querySelector('.layer:not(.hidden)');
            if (activeLayer) {
                activeLayer.style.filter = `hue-rotate(${(Math.random() - 0.5) * 30}deg)`;
                setTimeout(() => {
                    activeLayer.style.filter = 'none';
                }, 100);
            }
        }
    }, 5000);

    /* ═══════════════════════════════════════════════════════════════ */
    /* CURSOR TRAIL EFFECT */
    /* ═══════════════════════════════════════════════════════════════ */

    let mouseTrail = [];
    const maxTrailLength = 5;

    document.addEventListener('mousemove', (e) => {
        if (state.currentLayer === 'layer6') return; // No trail in museum
        
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 4px;
            height: 4px;
            background: var(--text-primary);
            pointer-events: none;
            z-index: 9994;
            opacity: 0.5;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(trail);
        mouseTrail.push(trail);

        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => {
                trail.remove();
                mouseTrail = mouseTrail.filter(t => t !== trail);
            }, 300);
        }, 100);

        // Limit trail length
        if (mouseTrail.length > maxTrailLength) {
            const old = mouseTrail.shift();
            old.remove();
        }
    });

    /* ═══════════════════════════════════════════════════════════════ */
    /* KONAMI CODE EASTER EGG */
    /* ═══════════════════════════════════════════════════════════════ */

    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                // Jump to museum
                triggerScreenCorruption(() => {
                    transitionToLayer('layer6');
                });
            }
        } else {
            konamiIndex = 0;
        }
    });

    /* ═══════════════════════════════════════════════════════════════ */
    /* INITIALIZE ON LOAD */
    /* ═══════════════════════════════════════════════════════════════ */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();