document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor Implementation ---
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .nav-item, .artifact-card, .timeline-node').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2.5)';
            cursor.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });

    // --- Dimensional Navigation System ---
    const navItems = document.querySelectorAll('.nav-item');
    const dimensions = document.querySelectorAll('.dimension');
    const root = document.documentElement;
    const patternMesh = document.getElementById('patternMesh');

    const themeMap = {
        'origins': { color: '#d4af37', glow: 'rgba(212, 175, 55, 0.3)', pattern: '60px 100px' },
        'dynasties': { color: '#9370db', glow: 'rgba(147, 112, 219, 0.3)', pattern: '80px 80px' },
        'artifacts': { color: '#4b0082', glow: 'rgba(75, 0, 130, 0.3)', pattern: '120px 60px' },
        'future': { color: '#50c878', glow: 'rgba(80, 200, 120, 0.3)', pattern: '40px 150px' }
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            // Switch active dimension
            dimensions.forEach(dim => dim.classList.remove('active'));
            document.getElementById(target).classList.add('active');

            // Update Theme Variables
            const theme = themeMap[target];
            root.style.setProperty('--accent-color', theme.color);
            root.style.setProperty('--theme-glow', theme.glow);
            patternMesh.style.backgroundSize = theme.pattern;

            // Trigger Griot Text Animation
            animateGriotText(target);
        });
    });

    // --- Griot Text "Weaving" Animation ---
    function animateGriotText(sectionId) {
        const section = document.getElementById(sectionId);
        const textEl = section.querySelector('.griot-text');
        const content = textEl.innerText;
        textEl.innerHTML = '';
        
        // Split text into words for staggered reveal
        content.split(' ').forEach((word, i) => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(10px)';
            span.style.transition = `all 0.5s ease ${i * 0.05}s`;
            textEl.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    // --- Holographic Artifact Controller ---
    const holoCore = document.getElementById('originArtifact');
    const ctrlBtns = document.querySelectorAll('.ctrl-btn');
    let rotationY = 0;

    ctrlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dir = btn.getAttribute('data-dir');
            rotationY += (dir === 'right' ? 45 : -45);
            holoCore.style.transform = `rotateY(${rotationY}deg)`;
            
            // Add a "glitch" effect on rotate
            holoCore.style.filter = 'hue-rotate(90deg) brightness(1.5)';
            setTimeout(() => {
                holoCore.style.filter = 'drop-shadow(0 0 20px var(--theme-glow))';
            }, 150);
        });
    });

    // --- Cosmic Diaspora Map Generator ---
    function initCosmicMap() {
        const map = document.getElementById('diasporaMap');
        const starCount = 40;
        const stars = [];

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'map-star';
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 3;
            
            star.style.position = 'absolute';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = 'var(--gold)';
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 10px var(--gold)`;
            
            map.appendChild(star);
            stars.push({ x, y });
        }

        // Draw connections between stars (the "Diaspora Threads")
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
                if (dist < 15) {
                    const line = document.createElement('div');
                    line.className = 'map-line';
                    line.style.position = 'absolute';
                    line.style.height = '1px';
                    line.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                    
                    const angle = Math.atan2(stars[j].y - stars[i].y, stars[j].x - stars[i].x);
                    const length = dist * 1.1; // Scale to %
                    
                    line.style.width = `${length}px`;
                    line.style.left = `${stars[i].x}%`;
                    line.style.top = `${stars[i].y}%`;
                    line.style.transform = `rotate(${angle}rad)`;
                    line.style.transformOrigin = '0 0';
                    
                    map.appendChild(line);
                }
            }
        }
    }

    // --- Audio Activation (User interaction required by browsers) ---
    const ambient = document.getElementById('ambient-sound');
    document.body.addEventListener('click', () => {
        ambient.volume = 0.2;
        ambient.play().catch(e => console.log("Audio autoplay blocked"));
    }, { once: true });

    // Initialize features
    initCosmicMap();
    animateGriotText('origins');
});