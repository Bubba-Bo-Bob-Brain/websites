document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    const TYPE_SPEED = 40; // ms per character
    const CASE_LOG_TEXT = `CASE FILE: 1947-X
    DATE: November 14, 1947
    LOCATION: The Old Docks, Sector 4

    SUMMARY:
    The victim was found near the warehouse district. No ID on the body, but the MO matches the "Midnight Strangler" cases from '45. 
    
    Key Findings:
    1. A distinctive red silk scarf was found clutched in the victim's hand.
    2. Witness reports mention a woman matching Velma Vane's description leaving the scene.
    3. Sal "The Eel" has been spotted making large cash deposits at the First National Bank.

    ACTION:
    Surveillance on Vane's apartment is authorized. We need to connect the money trail to the docks before the next body drops.
    
    - Det. J. Doe`;

    // --- ELEMENTS ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const panels = document.querySelectorAll('.panel');
    const typewriterContainer = document.getElementById('typewriter-text');
    const smokeContainer = document.getElementById('smoke-container');
    const threadSvg = document.getElementById('thread-svg');
    const nodes = document.querySelectorAll('.node');

    // --- STATE ---
    let activePanelId = 'case-log';

    // --- INITIALIZATION ---
    initTypewriter();
    setupNavigation();
    setupSmokeTrail();
    setupConspiracyBoard();
    setupPolaroids();

    // --- FUNCTIONS ---

    // 1. Typewriter Effect
    function initTypewriter() {
        typewriterContainer.innerHTML = '';
        let i = 0;
        const cursor = document.createElement('span');
        cursor.classList.add('cursor-blink');
        typewriterContainer.appendChild(cursor);

        function type() {
            if (i < CASE_LOG_TEXT.length) {
                const char = CASE_LOG_TEXT.charAt(i);
                // Insert before the cursor
                cursor.before(char);
                i++;
                // Randomize speed slightly for realism
                const randomSpeed = TYPE_SPEED + (Math.random() * 20 - 10);
                setTimeout(type, randomSpeed);
            }
        }
        type();
    }

    // 2. Navigation Logic
    function setupNavigation() {
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                
                // Update Nav State
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update Panel State
                panels.forEach(panel => {
                    if (panel.id === targetId) {
                        panel.classList.add('active-panel');
                        activePanelId = targetId;
                        
                        // If switching to conspiracy board, redraw threads
                        if (targetId === 'conspiracy') {
                            setTimeout(drawThreads, 100);
                        }
                    } else {
                        panel.classList.remove('active-panel');
                    }
                });
            });
        });
    }

    // 3. Smoke Trail Effect
    function setupSmokeTrail() {
        document.addEventListener('mousemove', (e) => {
            // Limit creation rate for performance
            if (Math.random() > 0.7) { 
                createSmokePuff(e.clientX, e.clientY);
            }
        });
    }

    function createSmokePuff(x, y) {
        const puff = document.createElement('div');
        puff.classList.add('smoke-puff');
        puff.style.left = `${x}px`;
        puff.style.top = `${y}px`;
        
        // Randomize size slightly
        const size = 10 + Math.random() * 20;
        puff.style.width = `${size}px`;
        puff.style.height = `${size}px`;

        smokeContainer.appendChild(puff);

        // Remove after animation
        setTimeout(() => {
            puff.remove();
        }, 1500);
    }

    // 4. Conspiracy Board Logic
    function setupConspiracyBoard() {
        // Initial draw
        drawThreads();
        
        // Redraw on resize
        window.addEventListener('resize', drawThreads);
    }

    function drawThreads() {
        // Clear existing lines
        threadSvg.innerHTML = '';
        
        // Define connections (ID pairs)
        const connections = [
            ['node-1', 'node-2'], // The Job -> Velma
            ['node-2', 'node-5'], // Velma -> The Money
            ['node-5', 'node-4'], // The Money -> Sal
            ['node-4', 'node-3'], // Sal -> The Docks
            ['node-3', 'node-1'], // The Docks -> The Job
            ['node-1', 'node-5']  // The Job -> The Money (Direct link)
        ];

        connections.forEach(conn => {
            const startNode = document.getElementById(conn[0]);
            const endNode = document.getElementById(conn[1]);

            if (startNode && endNode) {
                createThread(startNode, endNode);
            }
        });
    }

    function createThread(startEl, endEl) {
        const startRect = startEl.getBoundingClientRect();
        const endRect = endEl.getBoundingClientRect();
        const boardRect = document.querySelector('.corkboard').getBoundingClientRect();

        // Calculate centers relative to the board
        const x1 = startRect.left + startRect.width / 2 - boardRect.left;
        const y1 = startRect.top + startRect.height / 2 - boardRect.top;
        const x2 = endRect.left + endRect.width / 2 - boardRect.left;
        const y2 = endRect.top + endRect.height / 2 - boardRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', 'var(--accent-red)');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-opacity', '0.8');
        
        // Add a slight curve or jitter for realism? 
        // For now, straight lines look like tight string.
        // Add a shadow filter for depth
        line.style.filter = "drop-shadow(1px 1px 2px rgba(0,0,0,0.5))";

        threadSvg.appendChild(line);
    }

    // 5. Polaroid Tilt Effect
    function setupPolaroids() {
        const polaroids = document.querySelectorAll('.polaroid');
        
        polaroids.forEach((polaroid, index) => {
            // Random initial rotation
            const rot = (Math.random() * 10 - 5).toFixed(1);
            polaroid.style.setProperty('--rotation', `${rot}deg`);
            
            // Note rotation for the paper inside
            const note = polaroid.querySelector('.polaroid-caption');
            if(note) {
                note.style.transform = `rotate(${rot}deg)`;
            }
        });
    }
});