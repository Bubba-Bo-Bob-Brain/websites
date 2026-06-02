// ANKH Archive - Interactive Scripts
// Digital Museum of Ancestral Memory

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initLoader();
    initCustomCursor();
    initNavigation();
    initStarfield();
    initArtifactViewer();
    initGriotPlayer();
    initStarMap();
    initTimeline();
    initScrollAnimations();
    initOriginCards();
});

// ===== LOADER =====
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Trigger entrance animations after loader
            document.querySelectorAll('.title-line').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 200);
            });
        }, 1500);
    });
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursor = document.getElementById('cursor-gold');
    const trail = document.getElementById('cursor-trail');
    
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        trail.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Lerp cursor position
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        trail.style.transform = `translate(${trailX - 20}px, ${trailY - 20}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects on interactive elements
    const interactives = document.querySelectorAll('a, button, .thumb, .origin-card, .route-item, .event');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1.5)`;
            cursor.style.borderColor = '#00CED1';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1)`;
            cursor.style.borderColor = '#D4AF37';
        });
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const navSymbols = document.querySelectorAll('.nav-symbol');
    const sections = document.querySelectorAll('section');
    
    // Click to scroll
    navSymbols.forEach(symbol => {
        symbol.addEventListener('click', () => {
            const targetId = symbol.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Update active state on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navSymbols.forEach(symbol => {
                    symbol.classList.remove('active');
                    if (symbol.getAttribute('data-section') === id) {
                        symbol.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => sectionObserver.observe(section));
}

// ===== STARFIELD =====
function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let constellations = [];
    let mouseX = 0, mouseY = 0;
    
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        initStars();
    }
    
    function initStars() {
        stars = [];
        const count = Math.floor((width * height) / 3000);
        
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                brightness: Math.random(),
                constellation: Math.random() > 0.95 // 5% are constellation stars
            });
        }
        
        // Create constellation lines between nearby bright stars
        constellations = [];
        const brightStars = stars.filter(s => s.constellation);
        for (let i = 0; i < brightStars.length; i++) {
            for (let j = i + 1; j < brightStars.length; j++) {
                const dx = brightStars[i].x - brightStars[j].x;
                const dy = brightStars[i].y - brightStars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    constellations.push({
                        star1: brightStars[i],
                        star2: brightStars[j],
                        opacity: Math.random() * 0.3 + 0.1
                    });
                }
            }
        }
    }
    
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / width - 0.5;
        mouseY = (e.clientY - rect.top) / height - 0.5;
    });
    
    function drawStarfield() {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Draw constellation lines first (behind stars)
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.lineWidth = 1;
        constellations.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.star1.x, line.star1.y);
            ctx.lineTo(line.star2.x, line.star2.y);
            ctx.stroke();
        });
        
        // Update and draw stars
        stars.forEach(star => {
            // Parallax effect based on mouse
            const parallaxX = mouseX * star.size * 2;
            const parallaxY = mouseY * star.size * 2;
            
            // Twinkle
            star.brightness += (Math.random() - 0.5) * 0.1;
            star.brightness = Math.max(0.3, Math.min(1, star.brightness));
            
            // Move stars slowly
            star.y += star.speed;
            if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
            }
            
            // Draw star
            const x = star.x + parallaxX;
            const y = star.y + parallaxY;
            
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            ctx.fill();
            
            // Glow for larger stars
            if (star.size > 1.5) {
                ctx.beginPath();
                ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3);
                gradient.addColorStop(0, `rgba(212, 175, 55, ${star.brightness * 0.3})`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        });
        
        requestAnimationFrame(drawStarfield);
    }
    
    window.addEventListener('resize', resize);
    resize();
    drawStarfield();
}

// ===== ARTIFACT VIEWER =====
function initArtifactViewer() {
    const container = document.querySelector('.artifact-container');
    const model = document.querySelector('.artifact-model');
    const thumbs = document.querySelectorAll('.thumb');
    const rotateLeft = document.querySelector('.rotate-left');
    const rotateRight = document.querySelector('.rotate-right');
    const zoomIn = document.querySelector('.zoom-in');
    const zoomOut = document.querySelector('.zoom-out');
    const reset = document.querySelector('.reset');
    const title = document.getElementById('artifact-title');
    const desc = document.getElementById('artifact-description');
    const catalog = document.querySelector('.catalog-number');
    
    if (!model) return;
    
    let rotation = { x: 0, y: 0 };
    let zoom = 1;
    let isDragging = false;
    let startX, startY;
    let autoRotate = true;
    let autoRotateInterval;
    
    function updateTransform() {
        model.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`;
    }
    
    function startAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            if (autoRotate && !isDragging) {
                rotation.y += 0.5;
                updateTransform();
            }
        }, 50);
    }
    
    startAutoRotate();
    
    // Mouse drag controls
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        autoRotate = false;
        startX = e.clientX;
        startY = e.clientY;
        container.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        rotation.y += deltaX * 0.5;
        rotation.x -= deltaY * 0.5;
        rotation.x = Math.max(-45, Math.min(45, rotation.x));
        startX = e.clientX;
        startY = e.clientY;
        updateTransform();
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
        setTimeout(() => { autoRotate = true; }, 2000);
    });
    
    // Button controls
    rotateLeft.addEventListener('click', () => {
        autoRotate = false;
        rotation.y -= 45;
        updateTransform();
    });
    
    rotateRight.addEventListener('click', () => {
        autoRotate = false;
        rotation.y += 45;
        updateTransform();
    });
    
    zoomIn.addEventListener('click', () => {
        zoom = Math.min(zoom + 0.2, 2);
        updateTransform();
    });
    
    zoomOut.addEventListener('click', () => {
        zoom = Math.max(zoom - 0.2, 0.5);
        updateTransform();
    });
    
    reset.addEventListener('click', () => {
        rotation = { x: 0, y: 0 };
        zoom = 1;
        updateTransform();
        autoRotate = true;
    });
    
    // Thumbnail switching
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            
            // Update info with animation
            title.style.opacity = '0';
            desc.style.opacity = '0';
            
            setTimeout(() => {
                title.textContent = thumb.getAttribute('data-title');
                desc.textContent = thumb.getAttribute('data-desc');
                catalog.textContent = thumb.getAttribute('data-catalog');
                
                title.style.opacity = '1';
                desc.style.opacity = '1';
                
                // Change hologram color based on selection
                const colors = {
                    '1': 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)',
                    '2': 'linear-gradient(135deg, #E2725B 0%, #D2691E 100%)',
                    '3': 'repeating-linear-gradient(45deg, #C41E3A, #FFD700 20px, #228B22 40px)',
                    '4': 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)'
                };
                const img = document.querySelector('.artifact-image');
                if (img && colors[thumb.getAttribute('data-id')]) {
                    img.style.background = colors[thumb.getAttribute('data-id')];
                }
            }, 300);
        });
    });
    
    // Entrance animation
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 500);
}

// ===== GRIOT AUDIO PLAYER =====
function initGriotPlayer() {
    const playBtn = document.getElementById('play-btn');
    const words = document.querySelectorAll('.word');
    const progressFill = document.querySelector('.progress-fill');
    const progressBar = document.querySelector('.progress-bar');
    const currentTime = document.querySelector('.current-time');
    const totalTime = document.querySelector('.total-time');
    
    if (!playBtn) return;
    
    let isPlaying = false;
    let progress = 0;
    let wordIndex = 0;
    const totalDuration = 272; // 4:32 in seconds
    let animationId;
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    function highlightWords(progress) {
        const totalWords = words.length;
        const activeIndex = Math.floor((progress / 100) * totalWords);
        
        words.forEach((word, i) => {
            if (i <= activeIndex) {
                word.classList.add('active');
            } else {
                word.classList.remove('active');
            }
        });
    }
    
    function animate() {
        if (!isPlaying) return;
        
        progress += 0.1; // Simulated progress speed
        if (progress > 100) {
            progress = 0;
            isPlaying = false;
            playBtn.classList.remove('playing');
        }
        
        progressFill.style.width = `${progress}%`;
        highlightWords(progress);
        
        const currentSeconds = (progress / 100) * totalDuration;
        currentTime.textContent = formatTime(currentSeconds);
        
        animationId = requestAnimationFrame(animate);
    }
    
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playBtn.classList.toggle('playing', isPlaying);
        
        if (isPlaying) {
            animate();
        } else {
            cancelAnimationFrame(animationId);
        }
    });
    
    // Click on progress bar to seek
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        progress = (x / rect.width) * 100;
        progressFill.style.width = `${progress}%`;
        highlightWords(progress);
    });
    
    // Initialize time display
    totalTime.textContent = formatTime(totalDuration);
    
    // Add hover effects to words
    words.forEach(word => {
        word.addEventListener('mouseenter', () => {
            if (!isPlaying) {
                word.style.transform = 'scale(1.2)';
                word.style.color = '#FFD700';
            }
        });
        word.addEventListener('mouseleave', () => {
            word.style.transform = 'scale(1)';
            if (!word.classList.contains('active')) {
                word.style.color = '';
            }
        });
    });
}

// ===== STAR MAP =====
function initStarMap() {
    const canvas = document.getElementById('star-map');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('star-tooltip');
    const mapBtns = document.querySelectorAll('.map-btn');
    const routeItems = document.querySelectorAll('.route-item');
    
    let width, height;
    let nodes = [];
    let connections = [];
    let particles = [];
    let currentEra = 'ancient';
    let hoveredNode = null;
    let camera = { x: 0, y: 0, zoom: 1 };
    
    const eraConfigs = {
        ancient: {
            color: '#D4AF37',
            bgOpacity: 0.1,
            nodeCount: 15,
            spread: 0.8
        },
        transatlantic: {
            color: '#8B4513',
            bgOpacity: 0.15,
            nodeCount: 20,
            spread: 1.0
        },
        future: {
            color: '#00CED1',
            bgOpacity: 0.2,
            nodeCount: 25,
            spread: 1.2
        }
    };
    
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        initNodes();
    }
    
    function initNodes() {
        nodes = [];
        const config = eraConfigs[currentEra];
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Create nodes in spiral pattern
        for (let i = 0; i < config.nodeCount; i++) {
            const angle = (i / config.nodeCount) * Math.PI * 4;
            const radius = 50 + (i / config.nodeCount) * Math.min(width, height) * 0.4 * config.spread;
            const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50;
            const y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50;
            
            nodes.push({
                x: x,
                y: y,
                radius: Math.random() * 5 + 3,
                name: getNodeName(i),
                description: getNodeDescription(i),
                pulse: Math.random() * Math.PI * 2,
                connections: []
            });
        }
        
        // Create connections
        connections = [];
        for (let i = 0; i < nodes.length - 1; i++) {
            if (Math.random() > 0.3) {
                connections.push({
                    from: nodes[i],
                    to: nodes[i + 1],
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
            // Connect to random other nodes
            if (i < nodes.length - 2 && Math.random() > 0.7) {
                const target = nodes[i + 2 + Math.floor(Math.random() * 3)];
                if (target) {
                    connections.push({
                        from: nodes[i],
                        to: target,
                        opacity: 0.2
                    });
                }
            }
        }
        
        // Init particles
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2,
                life: Math.random()
            });
        }
    }
    
    function getNodeName(index) {
        const names = [
            'Nubia', 'Kemet', 'Axum', 'Ife', 'Benin', 'Timbuktu',
            'Great Zimbabwe', 'Mali', 'Ghana', 'Songhai', 'Kush',
            'Carthage', 'Numidia', 'Aksum', 'Lalibela'
        ];
        return names[index % names.length];
    }
    
    function getNodeDescription(index) {
        const descs = [
            'Ancient kingdom of the upper Nile, source of gold and wisdom.',
            'Land of the gods, where pyramids touch the sky.',
            'Trading empire connecting Africa to the Arabian peninsula.',
            'Cradle of Yoruba civilization, city of divine kings.',
            'Kingdom of bronze casters and sophisticated urban planning.',
            'Scholarly city, library of the Sahara desert.',
            'Stone city of the Shona people, monument to endurance.',
            'Empire of Mansa Musa, golden age of West Africa.',
            'Ancient kingdom of iron and trade routes.',
            'Successor to Mali, center of Islamic learning.',
            'Kingdom of the bow, rival to Egypt.',
            'Phoenician-African metropolis, maritime power.',
            'Berber kingdom of the Maghreb.',
            'Ethiopian empire, keeper of the Ark.',
            'Rock-hewn churches, New Jerusalem.'
        ];
        return descs[index % descs.length];
    }
    
    function drawStarMap() {
        const config = eraConfigs[currentEra];
        
        // Clear with fade
        ctx.fillStyle = `rgba(10, 10, 15, ${config.bgOpacity})`;
        ctx.fillRect(0, 0, width, height);
        
        // Draw particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;
            
            if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
                p.x = Math.random() * width;
                p.y = Math.random() * height;
                p.life = 1;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.5})`;
            ctx.fill();
        });
        
        // Draw connections
        connections.forEach(conn => {
            const dx = conn.to.x - conn.from.x;
            const dy = conn.to.y - conn.from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const midX = (conn.from.x + conn.to.x) / 2;
            const midY = (conn.from.y + conn.to.y) / 2;
            
            ctx.beginPath();
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.quadraticCurveTo(midX + Math.sin(Date.now() * 0.001) * 20, midY, conn.to.x, conn.to.y);
            ctx.strokeStyle = `${config.color}${Math.floor(conn.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
        
        // Draw nodes
        nodes.forEach((node, i) => {
            node.pulse += 0.05;
            const pulseSize = Math.sin(node.pulse) * 2;
            
            // Glow
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4);
            gradient.addColorStop(0, `${config.color}40`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(node.x - node.radius * 4, node.y - node.radius * 4, node.radius * 8, node.radius * 8);
            
            // Core
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = node === hoveredNode ? '#FFD700' : config.color;
            ctx.fill();
            
            // Ring
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 2 + pulseSize, 0, Math.PI * 2);
            ctx.strokeStyle = `${config.color}60`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Label if hovered
            if (node === hoveredNode) {
                ctx.font = '12px Rajdhani';
                ctx.fillStyle = '#FFD700';
                ctx.textAlign = 'center';
                ctx.fillText(node.name, node.x, node.y - node.radius - 15);
            }
        });
        
        requestAnimationFrame(drawStarMap);
    }
    
    // Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        hoveredNode = null;
        nodes.forEach(node => {
            const dx = x - node.x;
            const dy = y - node.y;
            if (Math.sqrt(dx * dx + dy * dy) < node.radius * 3) {
                hoveredNode = node;
                tooltip.innerHTML = `<h4>${node.name}</h4><p>${node.description}</p>`;
                tooltip.style.left = `${e.clientX + 10}px`;
                tooltip.style.top = `${e.clientY + 10}px`;
                tooltip.classList.add('visible');
            }
        });
        
        if (!hoveredNode) {
            tooltip.classList.remove('visible');
        }
    });
    
    // Era switching
    mapBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            mapBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentEra = btn.getAttribute('data-era');
            initNodes();
        });
    });
    
    // Route items hover effect on map
    routeItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('active');
            // Highlight corresponding nodes
            const route = item.getAttribute('data-route');
            // Could add specific node highlighting logic here
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('active');
        });
    });
    
    window.addEventListener('resize', resize);
    resize();
    drawStarMap();
}

// ===== TIMELINE =====
function initTimeline() {
    const events = document.querySelectorAll('.event');
    const progress = document.querySelector('.timeline-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });
    
    events.forEach(event => observer.observe(event));
    
    // Update timeline progress on scroll
    const timelineSection = document.getElementById('timeline');
    if (timelineSection) {
        window.addEventListener('scroll', () => {
            const rect = timelineSection.getBoundingClientRect();
            const sectionHeight = timelineSection.offsetHeight;
            const scrolled = Math.max(0, -rect.top);
            const percent = Math.min(100, (scrolled / sectionHeight) * 100);
            
            if (progress) {
                progress.style.height = `${percent}%`;
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Parallax effect for hero
    const hero = document.getElementById('hero');
    const title = document.querySelector('.museum-title');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${rate}px`;
            if (title) {
                title.style.transform = `translateY(${rate * 0.3}px)`;
                title.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        }
    });
    
    // Textile pattern shift on scroll
    const sections = document.querySelectorAll('.gallery-section');
    sections.forEach(section => {
        const bg = section.querySelector('.textile-bg');
        if (bg) {
            window.addEventListener('scroll', () => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const shift = (window.innerHeight - rect.top) * 0.1;
                    bg.style.backgroundPosition = `${shift}px ${shift}px`;
                }
            });
        }
    });
}

// ===== ORIGIN CARDS =====
function initOriginCards() {
    const cards = document.querySelectorAll('.origin-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const story = card.getAttribute('data-story');
            
            // Create holographic expansion effect
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = '';
            }, 300);
            
            // Could trigger modal or expansion here
            console.log(`Loading story: ${story}`);
        });
        
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            const hologram = card.querySelector('.card-hologram');
            if (hologram) {
                hologram.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const hologram = card.querySelector('.card-hologram');
            if (hologram) {
                hologram.style.transform = '';
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Performance: Pause animations when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});