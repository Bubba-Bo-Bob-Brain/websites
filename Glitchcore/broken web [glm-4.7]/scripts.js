document.addEventListener('DOMContentLoaded', () => {
    
    /* --- CONFIGURATION --- */
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    const hexChars = '0123456789ABCDEF';
    
    /* --- BOOT SEQUENCE LOGIC --- */
    const biosScreen = document.getElementById('bios-screen');
    const bsodScreen = document.getElementById('bsod-screen');
    const systemLayer = document.getElementById('system-layer');
    const labyrinth = document.getElementById('labyrinth');
    const memTest = document.getElementById('mem-test');
    
    let memCount = 0;

    const bootInterval = setInterval(() => {
        memCount += Math.floor(Math.random() * 500) + 100;
        if (memCount > 64000) {
            memCount = 64000;
            clearInterval(bootInterval);
            setTimeout(triggerBSOD, 800);
        }
        memTest.innerText = memCount + 'K OK';
    }, 20);

    function triggerBSOD() {
        biosScreen.classList.add('hidden');
        bsodScreen.classList.remove('hidden');
        
        // Listen for any key to dismiss BSOD
        const dismissBSOD = () => {
            systemLayer.classList.add('hidden');
            labyrinth.classList.remove('hidden');
            document.removeEventListener('keydown', dismissBSOD);
            document.removeEventListener('click', dismissBSOD);
            initLabyrinthEffects();
        };
        
        document.addEventListener('keydown', dismissBSOD);
        document.addEventListener('click', dismissBSOD);
    }

    /* --- LABYRINTH EFFECTS --- */
    function initLabyrinthEffects() {
        initTextScramble();
        populateDatabase();
        initVoidInteractions();
        initDeadLinks();
        initMeltingText();
    }

    /* --- TEXT SCRAMBLE (Hacker Effect) --- */
    function initTextScramble() {
        const elements = document.querySelectorAll('.melting-text');
        elements.forEach(el => {
            const originalText = el.dataset.value;
            let iterations = 0;
            
            const interval = setInterval(() => {
                el.innerText = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    })
                    .join('');
                
                if (iterations >= originalText.length) {
                    clearInterval(interval);
                    // Occasional glitch re-trigger
                    setTimeout(() => {
                        if(Math.random() > 0.7) scrambleOnce(el, originalText);
                    }, 2000);
                }
                
                iterations += 1 / 3;
            }, 30);
        });
    }

    function scrambleOnce(el, text) {
        let iterations = 0;
        const interval = setInterval(() => {
            el.innerText = text.split('').map((l, i) => i < iterations ? text[i] : glitchChars[Math.floor(Math.random() * glitchChars.length)]).join('');
            if(iterations >= text.length) clearInterval(interval);
            iterations += 1;
        }, 10);
    }

    /* --- MELTING TEXT LOGIC --- */
    function initMeltingText() {
        const h1 = document.querySelector('.melting-text');
        setInterval(() => {
            if (Math.random() > 0.8) {
                const skew = Math.floor(Math.random() * 20) - 10;
                const blur = Math.random() > 0.5 ? 1 : 0;
                h1.style.transform = `skewX(${skew}deg)`;
                h1.style.filter = `blur(${blur}px)`;
            } else {
                h1.style.transform = 'none';
                h1.style.filter = 'none';
            }
        }, 200);
    }

    /* --- DATABASE LEAK GENERATOR --- */
    function populateDatabase() {
        const tbody = document.getElementById('db-body');
        const rowCount = 10;
        
        for (let i = 0; i < rowCount; i++) {
            const tr = document.createElement('tr');
            
            // ID
            const tdId = document.createElement('td');
            tdId.innerText = '0x' + generateRandomString(4);
            
            // Hash
            const tdHash = document.createElement('td');
            tdHash.innerText = generateRandomString(32);
            
            // Coordinates
            const tdCoord = document.createElement('td');
            tdCoord.innerText = `${Math.floor(Math.random()*999)}.${Math.floor(Math.random()*999)}`;
            
            // Status
            const tdStatus = document.createElement('td');
            const statuses = ['CORRUPTED', 'LEAKED', 'MISSING', '0x00'];
            tdStatus.innerText = statuses[Math.floor(Math.random() * statuses.length)];
            if(tdStatus.innerText === 'LEAKED') tdStatus.style.color = 'red';
            
            // Fragment
            const tdData = document.createElement('td');
            tdData.innerText = generateGarbageString(Math.floor(Math.random() * 10) + 5);
            
            tr.appendChild(tdId);
            tr.appendChild(tdHash);
            tr.appendChild(tdCoord);
            tr.appendChild(tdStatus);
            tr.appendChild(tdData);
            
            tbody.appendChild(tr);
        }
    }

    function generateRandomString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += hexChars[Math.floor(Math.random() * hexChars.length)];
        }
        return result;
    }

    function generateGarbageString(length) {
        const chars = '[][]||//\\\\';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    /* --- VOID & SECRET INTERACTION --- */
    function initVoidInteractions() {
        const voidArea = document.querySelector('.void-area');
        const counterDisplay = document.getElementById('click-counter');
        const secretTrigger = document.getElementById('secret-trigger');
        const sanctuary = document.getElementById('sanctuary');
        const returnLink = document.getElementById('return-link');
        
        let clickCount = 0;
        const requiredClicks = 15; // Make them work for it

        voidArea.addEventListener('click', (e) => {
            if (e.target === secretTrigger) return; // Handle separately
            
            clickCount++;
            counterDisplay.innerText = `CLICKS_TO_ESCAPE: ${clickCount}`;
            
            // Screen shake effect
            document.body.style.transform = `translate(${Math.random()*10-5}px, ${Math.random()*10-5}px)`;
            setTimeout(() => document.body.style.transform = 'none', 50);

            // Create a "glitch ripple"
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.background = 'rgba(10, 255, 10, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'glitchRipple 0.5s ease-out forwards';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);
            
            if (clickCount >= requiredClicks) {
                revealSecretTrigger();
            }
        });

        // Secret Trigger Logic (The tiny invisible box)
        secretTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            openSanctuary();
        });

        function revealSecretTrigger() {
            secretTrigger.style.background = '#fff';
            secretTrigger.style.boxShadow = '0 0 20px #fff';
            secretTrigger.style.width = '50px';
            secretTrigger.style.height = '50px';
            secretTrigger.style.transform = 'translate(-50%, -50%)';
            secretTrigger.style.cursor = 'pointer';
            secretTrigger.title = "EXIT";
        }

        function openSanctuary() {
            sanctuary.classList.remove('hidden');
            // Play a soft sound if we had audio, for now just visual
            labyrinth.style.filter = 'blur(10px)';
        }

        returnLink.addEventListener('click', (e) => {
            e.preventDefault();
            sanctuary.classList.add('hidden');
            labyrinth.style.filter = 'none';
            clickCount = 0; // Reset progress
            counterDisplay.innerText = `CLICKS_TO_ESCAPE: 0`;
            secretTrigger.style.background = 'transparent';
            secretTrigger.style.boxShadow = 'none';
            secretTrigger.style.width = '10px';
            secretTrigger.style.height = '10px';
        });
    }

    /* --- DEAD LINKS & BUTTONS --- */
    function initDeadLinks() {
        const deadLinks = document.querySelectorAll('.dead-link');
        deadLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Visual feedback of failure
                link.style.textDecoration = 'line-through';
                link.style.color = 'red';
                alert("ERROR 404: The page you are looking for has been consumed by the void.");
            });
        });

        const buttons = document.querySelectorAll('.btn-glitch');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const originalText = btn.innerText;
                btn.innerText = 'FAILED...';
                btn.style.background = 'red';
                btn.style.color = 'black';
                
                setTimeout(() => {
                    btn.innerText = 'RETRYING...';
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = 'transparent';
                        btn.style.color = 'var(--term-green)';
                    }, 1000);
                }, 800);
            });
        });
    }
});