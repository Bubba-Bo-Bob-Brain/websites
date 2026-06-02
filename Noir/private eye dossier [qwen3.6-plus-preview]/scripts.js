/* =========================================
   DETECTIVE CASE FILE SYSTEM - JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initTypewriter();
    initSmokeCursor();
    initCorkBoard();
    initAtmosphere();
});

/* --- TAB NAVIGATION --- */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            
            // Update buttons
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Update panels
            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === `panel-${targetId}`) {
                    p.classList.add('active');
                    // Re-trigger typewriter for the new panel
                    const typewriterElements = p.querySelectorAll('.typewriter-text');
                    typewriterElements.forEach(el => resetTypewriter(el));
                }
            });
        });
    });
}

/* --- TYPEWRITER EFFECT --- */
function initTypewriter() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startTypewriter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.typewriter-text').forEach(el => {
        el.dataset.originalText = el.dataset.text || el.textContent;
        el.textContent = '';
        el.classList.add('typewriter-text'); // Ensure class for cursor
        observer.observe(el);
    });
}

function startTypewriter(element) {
    const text = element.dataset.originalText;
    if (!text) return;

    let i = 0;
    element.textContent = '';
    element.classList.remove('typewriter-finished');
    
    // Random typing speed for realism
    function type() {
        if (i < text.length) {
            // Handle potential HTML tags or just plain text
            element.textContent += text.charAt(i);
            i++;
            const speed = Math.random() * 40 + 20; // 20ms to 60ms
            setTimeout(type, speed);
        } else {
            element.classList.add('typewriter-finished');
        }
    }
    
    type();
}

function resetTypewriter(element) {
    element.classList.remove('typewriter-finished');
    element.textContent = '';
    // Delay slightly before starting to allow panel animation
    setTimeout(() => startTypewriter(element), 300);
}

/* --- SMOKE CURSOR TRAIL --- */
function initSmokeCursor() {
    const canvas = document.getElementById('smokeCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let isMoving = false;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        // Spawn particles
        for (let i = 0; i < 2; i++) {
            particles.push({
                x: mouseX + (Math.random() - 0.5) * 10,
                y: mouseY + (Math.random() - 0.5) * 10,
                size: Math.random() * 15 + 5,
                speedX: (Math.random() - 0.5) * 1,
                speedY: -Math.random() * 1.5 - 0.5,
                opacity: 0.4,
                life: 0
            });
        }
    });

    document.addEventListener('mouseleave', () => { isMoving = false; });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.size += 0.3;
            p.opacity -= 0.008;
            p.life++;

            if (p.opacity <= 0) {
                particles.splice(i, 1);
                i--;
                continue;
            }

            ctx.beginPath();
            // Soft radial gradient for smoke puff
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, `rgba(200, 200, 200, ${p.opacity})`);
            gradient.addColorStop(1, `rgba(150, 150, 150, 0)`);
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }
    animate();
}

/* --- CORK BOARD THREADS & DRAG --- */
function initCorkBoard() {
    const svg = document.getElementById('corkThreads');
    const items = document.querySelectorAll('.board-item');
    const connections = [
        { from: 'board-rossi', to: 'board-marsh' },
        { from: 'board-hale', to: 'board-marsh' },
        { from: 'board-thorne', to: 'board-marsh' },
        { from: 'board-cufflink', to: 'board-thorne' },
        { from: 'board-pier', to: 'board-marsh' },
        { from: 'board-letter', to: 'board-marsh' },
        { from: 'board-money', to: 'board-rossi' },
        { from: 'board-blood', to: 'board-thorne' },
        { from: 'board-blood', to: 'board-pier' },
        { from: 'board-ship', to: 'board-thorne' },
        { from: 'board-ship', to: 'board-pier' },
        { from: 'board-hale', to: 'board-money' },
        { from: 'board-rossi', to: 'board-money' }
    ];

    // Initial draw
    drawThreads(connections);

    // Make items draggable
    items.forEach(item => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        item.addEventListener('mousedown', (e) => {
            // Ignore if clicking a link or button inside
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            
            isDragging = true;
            item.style.zIndex = 100;
            const rect = item.getBoundingClientRect();
            const containerRect = item.closest('.corkboard-container').getBoundingClientRect();
            
            // Calculate offset relative to the item's current position
            startX = e.clientX;
            startY = e.clientY;
            
            // Current position is stored in data attributes or computed style
            // Since they are absolute with transform translate, we track delta
            initialLeft = parseFloat(item.style.left) || rect.left - containerRect.left + rect.width/2;
            initialTop = parseFloat(item.style.top) || rect.top - containerRect.top + rect.height/2;
            
            item.style.transition = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            const newLeft = initialLeft + dx;
            const newTop = initialTop + dy;
            
            item.style.left = `${newLeft}px`;
            item.style.top = `${newTop}px`;
            
            drawThreads(connections);
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                item.style.zIndex = 10;
                item.style.transition = 'box-shadow 0.2s, transform 0.2s';
            }
        });
    });

    function drawThreads(connList) {
        // Clear existing lines
        const existingLines = svg.querySelectorAll('line');
        existingLines.forEach(line => line.remove());

        connList.forEach(conn => {
            const fromEl = document.getElementById(conn.from);
            const toEl = document.getElementById(conn.to);
            
            if (fromEl && toEl) {
                const containerRect = fromEl.closest('.corkboard-container');
                // We need coordinates relative to the SVG container which matches the corkboard surface
                // Actually, the SVG is absolute covering the container. 
                // Items are absolute inside the surface.
                // We can use offsetLeft/Top of items relative to the surface.
                
                const surface = fromEl.closest('.corkboard-surface');
                if (!surface) return;

                const fromRect = {
                    left: fromEl.offsetLeft,
                    top: fromEl.offsetTop,
                    width: fromEl.offsetWidth,
                    height: fromEl.offsetHeight
                };

                const toRect = {
                    left: toEl.offsetLeft,
                    top: toEl.offsetTop,
                    width: toEl.offsetWidth,
                    height: toEl.offsetHeight
                };

                // Calculate centers
                const x1 = fromRect.left + fromRect.width / 2;
                const y1 = fromRect.top + fromRect.height / 2;
                const x2 = toRect.left + toRect.width / 2;
                const y2 = toRect.top + toRect.height / 2;

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                svg.appendChild(line);
            }
        });
    }
}

/* --- ATMOSPHERIC ANIMATIONS --- */
function initAtmosphere() {
    // Random flicker for lights/shadows
    const venetian = document.getElementById('venetianOverlay');
    setInterval(() => {
        if (Math.random() > 0.95) {
            venetian.style.opacity = '0.2';
            setTimeout(() => { venetian.style.opacity = ''; }, 100);
        }
    }, 2000);
}