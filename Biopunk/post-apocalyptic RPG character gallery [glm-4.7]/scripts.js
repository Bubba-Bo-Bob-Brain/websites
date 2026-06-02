document.addEventListener('DOMContentLoaded', () => {
    
    /* --- SYSTEM BOOT SEQUENCE --- */
    const initBootSequence = () => {
        const bootScreen = document.createElement('div');
        bootScreen.id = 'system-boot';
        bootScreen.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #000; color: #4af626; z-index: 10000;
            font-family: 'Share Tech Mono', monospace; display: flex;
            flex-direction: column; justify-content: center; align-items: center;
            text-transform: uppercase; letter-spacing: 2px;
        `;
        
        const bootText = document.createElement('div');
        bootText.style.fontSize = '1.5rem';
        bootScreen.appendChild(bootText);

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 300px; height: 4px; background: #333; margin-top: 20px;
            position: relative; overflow: hidden;
        `;
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%; width: 0%; background: #4af626;
            transition: width 0.1s linear;
        `;
        progressBar.appendChild(progressFill);
        bootScreen.appendChild(progressBar);

        document.body.appendChild(bootScreen);

        const messages = [
            "INITIALIZING BIO-INTERFACE...",
            "LOADING DNA SEQUENCES...",
            "CONNECTING TO SECURE SERVER...",
            "DECRYPTING PERSONNEL FILES...",
            "ACCESS GRANTED."
        ];

        let msgIndex = 0;
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress > 100) progress = 100;
            progressFill.style.width = `${progress}%`;

            if (progress > (msgIndex + 1) * 20 && msgIndex < messages.length) {
                bootText.innerText = messages[msgIndex];
                msgIndex++;
            }

            if (progress === 100 && msgIndex >= messages.length) {
                clearInterval(interval);
                setTimeout(() => {
                    bootScreen.style.opacity = '0';
                    bootScreen.style.transition = 'opacity 1s ease';
                    setTimeout(() => {
                        bootScreen.remove();
                        triggerStaggeredEntrance(); // Start main animations after boot
                    }, 1000);
                }, 500);
            }
        }, 50);
    };

    /* --- STAGGERED ENTRANCE ANIMATION --- */
    const triggerStaggeredEntrance = () => {
        const cards = document.querySelectorAll('.bio-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    };

    /* --- FILTERING SYSTEM --- */
    const initFiltering = () => {
        const buttons = document.querySelectorAll('.cyber-btn');
        const cards = document.querySelectorAll('.bio-card');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button state
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                cards.forEach(card => {
                    // Reset animation
                    card.style.transition = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'block';
                            // Small timeout to allow display:block to render before opacity transition
                            requestAnimationFrame(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            });
                        } else {
                            card.style.display = 'none';
                        }
                    }, 50);
                });
            });
        });
    };

    /* --- LIVE DATA SIMULATION (Random Stat Fluctuation) --- */
    const initDataFluctuation = () => {
        const bars = document.querySelectorAll('.bar-fill');
        
        setInterval(() => {
            // Pick a random bar to fluctuate
            const randomBar = bars[Math.floor(Math.random() * bars.length)];
            const originalWidth = randomBar.style.width;
            
            // Create a small fluctuation
            const currentVal = parseInt(originalWidth);
            const fluctuation = Math.floor(Math.random() * 10) - 5; // -5 to +5
            let newVal = currentVal + fluctuation;
            
            // Clamp values
            if (newVal > 100) newVal = 100;
            if (newVal < 0) newVal = 0;

            randomBar.style.width = `${newVal}%`;

            // Revert after a short moment to simulate sensor noise
            setTimeout(() => {
                randomBar.style.width = originalWidth;
            }, 400);

        }, 800);
    };

    /* --- TEXT SCRAMBLE EFFECT ON HOVER --- */
    const initTextScramble = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        const targets = document.querySelectorAll('.char-name');

        targets.forEach(target => {
            const originalText = target.innerText;
            
            target.addEventListener('mouseenter', () => {
                let iterations = 0;
                const interval = setInterval(() => {
                    target.innerText = originalText
                        .split('')
                        .map((letter, index) => {
                            if(index < iterations) {
                                return originalText[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');
                    
                    if(iterations >= originalText.length) { 
                        clearInterval(interval);
                        target.innerText = originalText; // Ensure clean end state
                    }
                    
                    iterations += 1 / 3;
                }, 30);
            });
        });
    };

    /* --- AUDIO FEEDBACK VISUALIZER (Fake) --- */
    const initAudioVisual = () => {
        // Adds a subtle shake to the screen occasionally to simulate heavy machinery/explosions nearby
        setInterval(() => {
            if (Math.random() > 0.9) {
                document.body.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;
                setTimeout(() => {
                    document.body.style.transform = 'translate(0, 0)';
                }, 100);
            }
        }, 2000);
    };

    // --- INIT ALL ---
    initBootSequence();
    initFiltering();
    initDataFluctuation();
    initTextScramble();
    initAudioVisual();

});