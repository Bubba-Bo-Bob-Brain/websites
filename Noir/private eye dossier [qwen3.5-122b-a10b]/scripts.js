document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const rainCanvas = document.getElementById('rain-canvas');
    const rainCtx = rainCanvas.getContext('2d');
    const flashlight = document.getElementById('flashlight');
    const body = document.body;
    const threadLayer = document.getElementById('thread-layer');
    const detectiveName = document.getElementById('detective-name');
    const statementText = document.getElementById('statement-1');

    // --- 1. RAIN ENGINE ---
    function resizeRain() {
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeRain);
    resizeRain();

    class Drop {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * rainCanvas.width;
            this.y = -20;
            this.speed = Math.random() * 10 + 15;
            this.length = Math.random() * 20 + 10;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.angle = Math.PI / 8;
        }

        update() {
            this.y += this.speed;
            this.x += Math.sin(this.angle) * this.speed;
            if (this.y > rainCanvas.height) {
                this.reset();
            }
        }

        draw() {
            rainCtx.beginPath();
            rainCtx.moveTo(this.x, this.y);
            rainCtx.lineTo(this.x - Math.sin(this.angle) * this.length, this.y + this.length);
            rainCtx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
            rainCtx.lineWidth = 1;
            rainCtx.lineCap = 'round';
            rainCtx.stroke();
        }
    }

    const drops = [];
    for (let i = 0; i < 150; i++) {
        drops.push(new Drop());
    }

    function animateRain() {
        rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
        drops.forEach(drop => {
            drop.update();
            drop.draw();
        });
        requestAnimationFrame(animateRain);
    }

    animateRain();

    // --- 2. FLASHLIGHT EFFECT ---
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Move the flashlight div
        flashlight.style.left = `${x}px`;
        flashlight.style.top = `${y}px`;

        // Parallax effect for blinds
        const blinds = document.getElementById('blinds-overlay');
        const moveX = (window.innerWidth - x) / 50;
        const moveY = (window.innerHeight - y) / 50;
        blinds.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // --- 3. TYPEWRITER EFFECT ---
    function typeWriter(element, text, i = 0, speed = 40) {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(element, text, i, speed), speed);
        }
    }

    // Initialize Detective Name Typewriter
    setTimeout(() => {
        typeWriter(detectiveName, detectiveName.innerText, 0, 100);
    }, 500);

    // Initialize Statement Typewriter
    setTimeout(() => {
        typeWriter(statementText, statementText.innerText, 0, 30);
    }, 1500);

    // --- 4. CONSPIRACY THREADS (SVG) ---
    function drawThreads() {
        const suspects = document.querySelectorAll('.suspect, .witness, .evidence, .note');
        const connections = [
            ['suspect-1', 'witness-1'],
            ['suspect-1', 'evidence-1'],
            ['witness-1', 'note-1'],
            ['evidence-1', 'note-1'],
            ['suspect-1', 'note-1']
        ];

        threadLayer.innerHTML = ''; // Clear existing threads

        connections.forEach(pair => {
            const el1 = document.querySelector(`[data-id="${pair[0]}"]`);
            const el2 = document.querySelector(`[data-id="${pair[1]}"]`);

            if (el1 && el2) {
                const rect1 = el1.getBoundingClientRect();
                const rect2 = el2.getBoundingClientRect();
                const boardRect = document.querySelector('.board-section').getBoundingClientRect();

                const x1 = rect1.left + rect1.width / 2 - boardRect.left;
                const y1 = rect1.top + rect1.height / 2 - boardRect.top;
                const x2 = rect2.left + rect2.width / 2 - boardRect.left;
                const y2 = rect2.top + rect2.height / 2 - boardRect.top;

                // Create SVG Path
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                
                // Bezier curve for a slight sag in the thread
                const controlY = Math.max(y1, y2) + 50;
                const d = `M ${x1} ${y1} Q ${(x1+x2)/2} ${controlY} ${x2} ${y2}`;
                
                path.setAttribute('d', d);
                path.setAttribute('stroke', '#8a0303');
                path.setAttribute('stroke-width', '2');
                path.setAttribute('stroke-opacity', '0.7');
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');
                
                threadLayer.appendChild(path);
            }
        });
    }

    // Draw threads initially and on resize
    window.addEventListener('resize', drawThreads);
    // Slight delay to ensure layout is settled
    setTimeout(drawThreads, 100);

    // --- 5. INTERACTIVE CARDS (DRAG & DROP SIMULATION) ---
    const cards = document.querySelectorAll('.evidence-card');

    cards.forEach(card => {
        card.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent default drag behavior
            
            const startX = e.clientX;
            const startY = e.clientY;
            const rect = card.getBoundingClientRect();
            const boardRect = card.parentElement.getBoundingClientRect();
            
            const initialLeft = card.offsetLeft;
            const initialTop = card.offsetTop;

            function onMouseMove(moveEvent) {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;
                
                let newLeft = initialLeft + dx;
                let newTop = initialTop + dy;

                // Boundary checks
                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft > boardRect.width - rect.width) newLeft = boardRect.width - rect.width;
                if (newTop > boardRect.height - rect.height) newTop = boardRect.height - rect.height;

                card.style.left = `${newLeft}px`;
                card.style.top = `${newTop}px`;
                card.style.transform = `rotate(${Math.random() * 4 - 2}deg)`; // Jiggle effect
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                drawThreads(); // Redraw threads after move
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
});