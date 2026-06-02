/* ═══════════════════════════════════════════════════════════
   THE VERDANT ARCHIVE - Interactive Scripts
   Bringing the Digital Biome to Life
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initLoadingScreen();
    initSunlightMeter();
    initSearchOverlay();
    initHeroParticles();
    initStatCounters();
    initSeedBankFilters();
    initMyceliumCanvas();
    initScrollAnimations();
    initSidebarNavigation();
});

/* ─── LOADING SCREEN ─── */
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    // Simulate loading with progress
    const progressBar = loadingScreen.querySelector('.loading-progress-bar');
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Hide loading screen after completion
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
                
                // Trigger entrance animations
                triggerEntranceAnimations();
            }, 500);
        }
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }, 200);

    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
}

function triggerEntranceAnimations() {
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/* ─── SUNLIGHT METER ─── */
function initSunlightMeter() {
    const slider = document.getElementById('sunlight-slider');
    const valueDisplay = document.getElementById('sunlight-value');
    const body = document.body;

    if (!slider || !valueDisplay) return;

    // Set initial value
    updateSunlight(70);

    slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        updateSunlight(value);
    });

    function updateSunlight(value) {
        valueDisplay.textContent = value;
        
        // Update CSS variable
        const intensity = value / 100;
        body.style.setProperty('--sunlight-intensity', intensity);
        body.setAttribute('data-sunlight', intensity);

        // Dynamic color adjustments based on sunlight
        const warmth = Math.round(intensity * 30);
        const saturation = 100 - Math.round(intensity * 20);
        
        // Adjust background warmth
        const bgLightness = 96 - (intensity * 8);
        body.style.background = `hsl(40, ${20 + warmth}%, ${bgLightness}%)`;

        // Update sun icon animation speed
        const sunRays = document.querySelector('.sun-rays');
        if (sunRays) {
            const rotationSpeed = 20 - (intensity * 15);
            sunRays.style.animationDuration = `${rotationSpeed}s`;
        }

        // Trigger visual feedback
        createSunlightBurst(intensity);
    }

    function createSunlightBurst(intensity) {
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: fixed;
            top: 50%;
            right: 60px;
            width: ${20 + intensity * 30}px;
            height: ${20 + intensity * 30}px;
            background: radial-gradient(circle, rgba(232, 185, 74, ${intensity * 0.5}) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            animation: sunlightBurst 0.5s ease-out forwards;
        `;
        document.body.appendChild(burst);
        
        setTimeout(() => burst.remove(), 500);
    }
}

/* ─── SEARCH OVERLAY ─── */
function initSearchOverlay() {
    const toggle = document.getElementById('search-toggle');
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const suggestions = document.querySelectorAll('.suggestion-item');

    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
        overlay.classList.toggle('active');
        if (overlay.classList.contains('active') && input) {
            setTimeout(() => input.focus(), 100);
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!overlay.contains(e.target) && !toggle.contains(e.target)) {
            overlay.classList.remove('active');
        }
    });

    // Suggestion clicks
    suggestions.forEach(item => {
        item.addEventListener('click', () => {
            if (input) {
                input.value = item.textContent;
                input.focus();
            }
        });
    });

    // Search input effects
    if (input) {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            // Filter suggestions based on query
            suggestions.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) || query === '' ? 'block' : 'none';
            });
        });
    }
}

/* ─── HERO PARTICLES ─── */
function initHeroParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const particleCount = 30;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, particles);
    }

    // Continuously create new particles
    setInterval(() => {
        if (particles.length < particleCount) {
            createParticle(container, particles);
        }
    }, 500);

    function createParticle(container, particles) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(232, 185, 74, 0.8) 0%, rgba(232, 185, 74, 0) 70%);
            border-radius: 50%;
            left: ${startX}%;
            top: ${startY}%;
            pointer-events: none;
            opacity: 0;
            animation: particleDrift ${duration}s ease-in-out ${delay}s infinite;
        `;

        container.appendChild(particle);
        particles.push(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
            const index = particles.indexOf(particle);
            if (index > -1) particles.splice(index, 1);
        }, (duration + delay) * 1000);
    }
}

// Add particle animation to document
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleDrift {
        0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
        }
        20% {
            opacity: 0.8;
            transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * -30}px) scale(1);
        }
        80% {
            opacity: 0.4;
            transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * -60}px) scale(0.8);
        }
        100% {
            opacity: 0;
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100}px) scale(0);
        }
    }
    
    @keyframes sunlightBurst {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

/* ─── STAT COUNTERS ─── */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count')) || 0;
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(startValue + (target - startValue) * easeOutQuart);
            
            element.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

/* ─── SEED BANK FILTERS ─── */
function initSeedBankFilters() {
    const filters = document.querySelectorAll('.seed-filter');
    const cards = document.querySelectorAll('.seed-card');

    if (!filters.length || !cards.length) return;

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active state
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const category = filter.getAttribute('data-filter');

            // Filter cards with animation
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = category === 'all' || cardCategory === category;

                if (shouldShow) {
                    card.style.display = 'flex';
                    card.style.animation = 'seedCardAppear 0.4s ease forwards';
                } else {
                    card.style.animation = 'seedCardDisappear 0.3s ease forwards';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add filter animation styles
    const filterStyle = document.createElement('style');
    filterStyle.textContent = `
        @keyframes seedCardAppear {
            0% {
                opacity: 0;
                transform: scale(0.8) translateY(10px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes seedCardDisappear {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.8);
            }
        }
    `;
    document.head.appendChild(filterStyle);

    // Seed card hover effects
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const connections = card.getAttribute('data-connections');
            if (connections) {
                createConnectionPulse(card, connections);
            }
        });
    });

    function createConnectionPulse(card, connections) {
        const pulse = document.createElement('div');
        pulse.className = 'connection-pulse';
        pulse.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            border: 2px solid var(--sage);
            border-radius: var(--radius-lg);
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
            pointer-events: none;
            animation: connectionPulse 0.6s ease-out forwards;
        `;
        card.style.position = 'relative';
        card.appendChild(pulse);
        
        setTimeout(() => pulse.remove(), 600);
    }
}

// Add connection pulse animation
const connectionStyle = document.createElement('style');
connectionStyle.textContent = `
    @keyframes connectionPulse {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(connectionStyle);

/* ─── MYCELIUM CANVAS ─── */
function initMyceliumCanvas() {
    const canvas = document.getElementById('mycelium-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = 400;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Node types with colors
    const nodeTypes = [
        { name: 'technology', color: '#4a7c59', count: 8 },
        { name: 'community', color: '#c67b5c', count: 6 },
        { name: 'ecosystem', color: '#2a6b6b', count: 5 },
        { name: 'science', color: '#e8b94a', count: 5 }
    ];

    // Create nodes
    const nodes = [];
    nodeTypes.forEach(type => {
        for (let i = 0; i < type.count; i++) {
            nodes.push({
                x: Math.random() * (canvas.width - 100) + 50,
                y: Math.random() * (canvas.height - 100) + 50,
                radius: Math.random() * 6 + 4,
                color: type.color,
                type: type.name,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                connections: []
            });
        }
    });

    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
            if (i !== j) {
                const dist = Math.hypot(node.x - other.x, node.y - other.y);
                if (dist < 150 && node.connections.length < 3) {
                    node.connections.push(j);
                }
            }
        });
    });

    // Animation loop
    let animationId;
    function animate() {
        ctx.fillStyle = 'rgba(26, 47, 38, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update node positions
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < node.radius || node.x > canvas.width - node.radius) {
                node.vx *= -1;
            }
            if (node.y < node.radius || node.y > canvas.height - node.radius) {
                node.vy *= -1;
            }

            // Draw connections (mycelium threads)
            node.connections.forEach(connIndex => {
                const other = nodes[connIndex];
                const dist = Math.hypot(node.x - other.x, node.y - other.y);
                const opacity = Math.max(0, 1 - dist / 200);

                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                
                // Curved connection (mycelium-like)
                const midX = (node.x + other.x) / 2 + (Math.random() - 0.5) * 20;
                const midY = (node.y + other.y) / 2 + (Math.random() - 0.5) * 20;
                ctx.quadraticCurveTo(midX, midY, other.x, other.y);
                
                ctx.strokeStyle = `rgba(135, 168, 120, ${opacity * 0.4})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            
            // Glow effect
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 2
            );
            gradient.addColorStop(0, node.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Start animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.1 });

    observer.observe(canvas);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        // Attract nearby nodes slightly
        nodes.forEach(node => {
            const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
            if (dist < 100) {
                const angle = Math.atan2(mouseY - node.y, mouseX - node.x);
                node.vx += Math.cos(angle) * 0.02;
                node.vy += Math.sin(angle) * 0.02;
                
                // Limit velocity
                node.vx = Math.max(-1, Math.min(1, node.vx));
                node.vy = Math.max(-1, Math.min(1, node.vy));
            }
        });
    });
}

/* ─── SCROLL ANIMATIONS ─── */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.featured-card, .community-card, .eco-article, .seed-card, .contribution-item, .section-header'
    );

    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    // Parallax effect for hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallaxElements = hero.querySelectorAll('.hero-tree, .hero-light-rays');
                parallaxElements.forEach(el => {
                    el.style.transform = `translateY(${scrolled * 0.3}px)`;
                });
            }
        });
    }
}

/* ─── SIDEBAR NAVIGATION ─── */
function initSidebarNavigation() {
    const links = document.querySelectorAll('.sidebar-link');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Update active state
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Highlight current section on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ─── ADDITIONAL UTILITY FUNCTIONS ─── */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contribute button effect
const contributeBtn = document.getElementById('contribute-btn');
if (contributeBtn) {
    contributeBtn.addEventListener('click', () => {
        // Create seed planting animation
        const seed = document.createElement('div');
        seed.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: var(--sunlight-gold);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            animation: seedPlant 1s ease-out forwards;
        `;
        document.body.appendChild(seed);
        
        setTimeout(() => seed.remove(), 1000);
    });
}

// Add seed plant animation
const seedStyle = document.createElement('style');
seedStyle.textContent = `
    @keyframes seedPlant {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -100%) scale(1.5);
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(seedStyle);

// Eco article hover effect
document.querySelectorAll('.eco-article').forEach(article => {
    article.addEventListener('mouseenter', () => {
        const indicator = article.querySelector('.eco-article-indicator');
        if (indicator) {
            indicator.style.width = '8px';
            indicator.style.transition = 'width 0.3s ease';
        }
    });
    
    article.addEventListener('mouseleave', () => {
        const indicator = article.querySelector('.eco-article-indicator');
        if (indicator) {
            indicator.style.width = '4px';
        }
    });
});

// Biome hover interaction
document.querySelectorAll('.ecosystem-biome').forEach(biome => {
    biome.addEventListener('mouseenter', () => {
        const rings = biome.querySelectorAll('.biome-ring');
        rings.forEach(ring => {
            ring.style.animationPlayState = 'running';
        });
    });
    
    biome.addEventListener('mouseleave', () => {
        const rings = biome.querySelectorAll('.biome-ring');
        rings.forEach(ring => {
            ring.style.animationPlayState = 'paused';
        });
    });
});

// Wiki infobox hover effect
const infobox = document.querySelector('.wiki-infobox');
if (infobox) {
    infobox.addEventListener('mouseenter', () => {
        infobox.style.transform = 'scale(1.02)';
        infobox.style.transition = 'transform 0.3s ease';
    });
    
    infobox.addEventListener('mouseleave', () => {
        infobox.style.transform = 'scale(1)';
    });
}

// Community card emblem rotation on hover
document.querySelectorAll('.community-card').forEach(card => {
    const emblem = card.querySelector('.community-emblem svg');
    if (emblem) {
        card.addEventListener('mouseenter', () => {
            emblem.style.transform = 'rotate(15deg)';
            emblem.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            emblem.style.transform = 'rotate(0deg)';
        });
    }
});

console.log('🌱 The Verdant Archive initialized. Welcome to the Digital Biome.');