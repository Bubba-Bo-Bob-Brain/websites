/**
 * 武經天書 — Celestial Martial Arts Scripture
 * JavaScript Controller
 * 
 * Features:
 * - Scroll Unroll Transition
 * - Ambient Clouds & Ink Particles
 * - Dynamic Skill Tree Rendering (Brush Strokes)
 * - Animated Meridian Diagram with Qi Flow
 * - Scroll-triggered Reveals & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollUnroll();
    initAmbientBackground();
    initSkillTree();
    initMeridianDiagram();
    initScrollAnimations();
});

// ==========================================
// 1. Scroll Unroll Transition
// ==========================================
function initScrollUnroll() {
    const overlay = document.getElementById('scroll-unroll');
    const scrollContainer = document.getElementById('scroll-container');

    // Simulate the time to "open" the scroll
    setTimeout(() => {
        overlay.classList.add('hidden');
        
        setTimeout(() => {
            scrollContainer.classList.add('visible');
            // Trigger initial animations after reveal
            document.querySelectorAll('.hero-title .title-char').forEach((char, i) => {
                char.style.opacity = '0';
                char.style.transform = 'translateY(20px)';
                char.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                setTimeout(() => {
                    char.style.opacity = '1';
                    char.style.transform = 'translateY(0)';
                }, 300 + (i * 150));
            });
        }, 500);
    }, 2500);
}

// ==========================================
// 2. Ambient Background (Clouds & Particles)
// ==========================================
function initAmbientBackground() {
    const canvas = document.getElementById('clouds-canvas');
    const ctx = canvas.getContext('2d');
    const particleCanvas = document.getElementById('ink-particles-canvas');
    const pCtx = particleCanvas.getContext('2d');

    let width, height;
    let clouds = [];
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        particleCanvas.width = width;
        particleCanvas.height = height;
        initClouds();
        initParticles();
    }

    function initClouds() {
        clouds = [];
        const count = 6;
        for (let i = 0; i < count; i++) {
            clouds.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: 150 + Math.random() * 200,
                vx: 0.1 + Math.random() * 0.2,
                opacity: 0.02 + Math.random() * 0.03
            });
        }
    }

    function initParticles() {
        particles = [];
        const count = 30;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5,
                life: Math.random() * 100
            });
        }
    }

    function drawClouds() {
        ctx.clearRect(0, 0, width, height);
        clouds.forEach(c => {
            const gradient = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${c.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fill();

            c.x += c.vx;
            if (c.x - c.r > width) c.x = -c.r;
        });
        requestAnimationFrame(drawClouds);
    }

    function drawParticles() {
        pCtx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            pCtx.fillStyle = `rgba(26, 26, 26, ${p.opacity})`;
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            pCtx.fill();

            p.x += p.vx;
            p.y += p.vy;
            p.life++;

            // Pulse opacity
            p.opacity = 0.1 + Math.sin(p.life * 0.05) * 0.2;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        });
        requestAnimationFrame(drawParticles);
    }

    window.addEventListener('resize', resize);
    resize();
    drawClouds();
    drawParticles();
}

// ==========================================
// 3. Skill Tree Rendering
// ==========================================
function initSkillTree() {
    const container = document.querySelector('.skilltree-container');
    const canvas = document.getElementById('skilltree-canvas');
    const ctx = canvas.getContext('2d');
    const nodes = document.querySelectorAll('.skill-node');

    // Define hierarchy connections [Parent, Child]
    // IDs match data-node attributes
    const connections = [
        ['root', 'sword'], ['root', 'palm'], ['root', 'internal'], ['root', 'movement'],
        ['sword', 'sword-1'], ['sword', 'sword-2'],
        ['palm', 'palm-1'], ['palm', 'palm-2'],
        ['internal', 'internal-1'], ['internal', 'internal-2'],
        ['movement', 'movement-1'], ['movement', 'movement-2']
    ];

    function drawTree() {
        // Resize canvas to match container
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Map nodes to coordinates
        const nodeMap = {};
        nodes.forEach(node => {
            const id = node.dataset.node;
            // Parse CSS variables for positioning
            const xStr = getComputedStyle(node).getPropertyValue('--x');
            const yStr = getComputedStyle(node).getPropertyValue('--y');
            
            if (xStr && yStr) {
                const x = parseFloat(xStr) / 100 * canvas.width;
                const y = parseFloat(yStr) / 100 * canvas.height;
                nodeMap[id] = { x, y };
            }
        });

        // Draw connections
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        connections.forEach(([parentId, childId]) => {
            const start = nodeMap[parentId];
            const end = nodeMap[childId];

            if (start && end) {
                drawBrushStroke(ctx, start.x, start.y, end.x, end.y);
            }
        });

        // Draw subtle ink splatters at nodes
        Object.values(nodeMap).forEach(pos => {
            drawInkSplatter(ctx, pos.x, pos.y, 8);
        });
    }

    // Simulate ink brush stroke
    function drawBrushStroke(ctx, x1, y1, x2, y2) {
        const iterations = 3;
        for (let i = 0; i < iterations; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(26, 26, 26, ${0.3 + Math.random() * 0.4})`;
            ctx.lineWidth = 1 + Math.random() * 2;
            
            // Add some wobble for hand-drawn feel
            const cp1x = (x1 + x2) / 2 + (Math.random() - 0.5) * 20;
            const cp1y = (y1 + y2) / 2 + (Math.random() - 0.5) * 20;
            
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(cp1x, cp1y, x2, y2);
            ctx.stroke();
        }
    }

    // Simulate ink drop
    function drawInkSplatter(ctx, x, y, radius) {
        const count = 5 + Math.floor(Math.random() * 5);
        ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius * 1.5;
            const r = 1 + Math.random() * 2;
            ctx.beginPath();
            ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initial draw
    setTimeout(drawTree, 100); // Delay to ensure layout is ready

    // Redraw on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(drawTree, 100);
    });

    // Interaction: Highlight branch on hover
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const id = node.dataset.node;
            // Simple visual feedback handled by CSS, but we could add canvas effects here
        });
    });
}

// ==========================================
// 4. Meridian Diagram Animation
// ==========================================
function initMeridianDiagram() {
    const container = document.querySelector('.meridian-container');
    const canvas = document.getElementById('meridian-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let qiParticles = [];
    const qiPaths = [];

    function resize() {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
        initPaths();
        initQiParticles();
    }

    function initPaths() {
        // Define meridian paths as bezier curves relative to canvas size
        // These are stylized, not anatomically perfect
        qiPaths.length = 0; // Clear existing

        // Central vertical line (Ren Mai)
        qiPaths.push({
            points: [{x: 0.5, y: 0.15}, {x: 0.5, y: 0.3}, {x: 0.5, y: 0.45}, {x: 0.5, y: 0.6}, {x: 0.5, y: 0.85}],
            color: '#C41E3A'
        });

        // Side lines (Stomach/Kidney meridians roughly)
        qiPaths.push({
            points: [{x: 0.35, y: 0.15}, {x: 0.3, y: 0.3}, {x: 0.35, y: 0.45}, {x: 0.4, y: 0.6}, {x: 0.35, y: 0.85}],
            color: '#2C2C2C'
        });
        qiPaths.push({
            points: [{x: 0.65, y: 0.15}, {x: 0.7, y: 0.3}, {x: 0.65, y: 0.45}, {x: 0.6, y: 0.6}, {x: 0.65, y: 0.85}],
            color: '#2C2C2C'
        });

        // Arm lines
        qiPaths.push({
            points: [{x: 0.35, y: 0.2}, {x: 0.2, y: 0.25}, {x: 0.15, y: 0.35}, {x: 0.15, y: 0.45}],
            color: '#D4A843'
        });
        qiPaths.push({
            points: [{x: 0.65, y: 0.2}, {x: 0.8, y: 0.25}, {x: 0.85, y: 0.35}, {x: 0.85, y: 0.45}],
            color: '#D4A843'
        });
    }

    function initQiParticles() {
        qiParticles = [];
        // Create particles for each path
        qiPaths.forEach((path, index) => {
            for (let i = 0; i < 4; i++) {
                qiParticles.push({
                    pathIndex: index,
                    t: Math.random(), // Position along path 0 to 1
                    speed: 0.001 + Math.random() * 0.002,
                    size: 2 + Math.random() * 3,
                    color: path.color
                });
            }
        });
    }

    function getPointOnPath(points, t) {
        // Simple linear interpolation between points for multi-segment paths
        // Normalize t to segment count
        const segments = points.length - 1;
        const segmentIndex = Math.min(Math.floor(t * segments), segments - 1);
        const segmentT = (t * segments) - segmentIndex;

        const p1 = points[segmentIndex];
        const p2 = points[segmentIndex + 1];

        return {
            x: (p1.x + (p2.x - p1.x) * segmentT) * width,
            y: (p1.y + (p2.y - p1.y) * segmentT) * height
        };
    }

    function drawDiagram() {
        ctx.clearRect(0, 0, width, height);

        // 1. Draw Body Silhouette (Stylized)
        ctx.strokeStyle = 'rgba(44, 44, 44, 0.1)';
        ctx.lineWidth = 1;
        
        // Head
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.08, width * 0.1, height * 0.06, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Torso
        ctx.beginPath();
        ctx.moveTo(width * 0.4, height * 0.14);
        ctx.quadraticCurveTo(width * 0.5, height * 0.12, width * 0.6, height * 0.14);
        ctx.quadraticCurveTo(width * 0.65, height * 0.5, width * 0.55, height * 0.7);
        ctx.quadraticCurveTo(width * 0.5, height * 0.75, width * 0.45, height * 0.7);
        ctx.quadraticCurveTo(width * 0.35, height * 0.5, width * 0.4, height * 0.14);
        ctx.stroke();

        // 2. Draw Meridian Paths
        qiPaths.forEach(path => {
            ctx.beginPath();
            ctx.strokeStyle = path.color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const firstPoint = getPointOnPath(path.points, 0);
            ctx.moveTo(firstPoint.x, firstPoint.y);

            // Draw segments
            for (let i = 1; i < path.points.length; i++) {
                const pt = getPointOnPath(path.points, i / (path.points.length - 1));
                // Smooth curve
                const prevPt = getPointOnPath(path.points, (i - 1) / (path.points.length - 1));
                const nextPt = getPointOnPath(path.points, Math.min((i + 1) / (path.points.length - 1), 1));
                
                const cpX = pt.x; 
                const cpY = pt.y;
                // Quadratic bezier control point logic roughly
                ctx.quadraticCurveTo(prevPt.x + (pt.x - prevPt.x)*0.5, prevPt.y + (pt.y - prevPt.y)*0.5, pt.x, pt.y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        });

        // 3. Animate Qi Particles
        qiParticles.forEach(p => {
            p.t += p.speed;
            if (p.t > 1) p.t = 0;

            const pos = getPointOnPath(qiPaths[p.pathIndex].points, p.t);
            
            // Glow
            const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 3);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(0.4, p.color);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.005) * 0.2;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, p.size * 3, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = '#FFF';
            ctx.globalAlpha = 0.9;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1.0;
        requestAnimationFrame(drawDiagram);
    }

    window.addEventListener('resize', resize);
    resize();
    drawDiagram();
}

// ==========================================
// 5. Scroll Animations & Navigation
// ==========================================
function initScrollAnimations() {
    // Intersection Observer for Reveal Animations
    const revealElements = document.querySelectorAll('.chapter, .cultivation-card, .technique-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate stat bars if inside this element
                const statFills = entry.target.querySelectorAll('.stat-fill');
                statFills.forEach(fill => {
                    const width = fill.dataset.width;
                    fill.style.width = width;
                });

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Navigation Highlight
    const sections = document.querySelectorAll('section');
    const navSeals = document.querySelectorAll('.nav-seal');
    const navContainer = document.getElementById('nav-seals');

    // Hide nav initially, show after scroll
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        
        // Show nav when scrolled down a bit
        if (currentY > 300) {
            navContainer.style.opacity = '1';
            navContainer.style.pointerEvents = 'auto';
        } else {
            navContainer.style.opacity = '0';
            navContainer.style.pointerEvents = 'none';
        }

        // Determine active section
        let currentSection = 'hero';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.4 && rect.bottom > 0) {
                currentSection = section.id;
            }
        });

        navSeals.forEach(seal => {
            if (seal.dataset.section === currentSection) {
                seal.classList.add('active');
            } else {
                seal.classList.remove('active');
            }
        });

        lastScrollY = currentY;
    });

    // Smooth scroll for nav links
    navSeals.forEach(seal => {
        seal.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = seal.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}