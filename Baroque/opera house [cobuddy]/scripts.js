// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Curtain reveal on load
    const curtain = document.getElementById('curtain');
    setTimeout(() => {
        curtain.classList.add('revealed');
        setTimeout(() => {
            curtain.style.transition = 'opacity 1.5s ease';
            curtain.style.opacity = '0';
            setTimeout(() => {
                curtain.style.display = 'none';
            }, 1500);
        }, 2000);
    }, 500);

    // Chandelier light canvas animation
    const canvas = document.getElementById('lightCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const lightSources = [];
    const numLights = 9;

    for (let i = 0; i < numLights; i++) {
        const rect = canvas.getBoundingClientRect();
        lightSources.push({
            x: rect.width * (0.1 + (i % 3) * 0.4) + (i < 6 ? (i % 3) * 40 : 0),
            y: rect.height * (0.05 + Math.floor(i / 3) * 0.15),
            radius: 80 + Math.random() * 60,
            phase: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.005,
            intensity: 0.02 + Math.random() * 0.03
        });
    }

    let time = 0;

    function animateLights() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 1;

        lightSources.forEach((light, i) => {
            const flicker = Math.sin(time * light.speed * 60 + light.phase) * 0.5 + 0.5;
            const pulse = Math.sin(time * 0.02 + light.phase) * 0.3 + 0.7;

            const gradient = ctx.createRadialGradient(
                light.x, light.y, 0,
                light.x, light.y, light.radius * pulse
            );

            gradient.addColorStop(0, `rgba(255, 220, 140, ${light.intensity * flicker * 2})`);
            gradient.addColorStop(0.3, `rgba(255, 200, 100, ${light.intensity * flicker})`);
            gradient.addColorStop(0.6, `rgba(212, 168, 80, ${light.intensity * flicker * 0.5})`);
            gradient.addColorStop(1, 'rgba(212, 168, 80, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle moving warm spots on the "floor"
            if (i < 6) {
                const floorY = canvas.height * 0.7;
                const floorX = light.x + Math.sin(time * 0.01 + light.phase) * 50;
                const floorGradient = ctx.createRadialGradient(
                    floorX, floorY, 0,
                    floorX, floorY, light.radius * 0.6
                );
                floorGradient.addColorStop(0, `rgba(255, 200, 100, ${light.intensity * 0.3 * flicker})`);
                floorGradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
                ctx.fillStyle = floorGradient;
                ctx.fillRect(floorX - light.radius, floorY - light.radius * 0.3, light.radius * 2, light.radius * 0.6);
            }
        });

        requestAnimationFrame(animateLights);
    }

    animateLights();

    // Event filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            eventCards.forEach((card, index) => {
                const category = card.dataset.category;
                const matches = filter === 'all' || category === filter;

                if (matches) {
                    card.style.display = 'block';
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = `card-reveal 0.5s ease forwards`;
                    card.style.animationDelay = `${index * 0.08}s`;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // Seating chart interactions
    const seats = document.querySelectorAll('.seat');
    const selectedSeats = new Set();

    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            const seatId = seat.dataset.section + '-' + seat.textContent;

            if (selectedSeats.has(seatId)) {
                selectedSeats.delete(seatId);
                seat.style.background = '';
                seat.style.boxShadow = '';
                seat.style.transform = '';
            } else {
                selectedSeats.add(seatId);
                seat.style.background = 'var(--gold-500)';
                seat.style.borderColor = 'var(--gold-200)';
                seat.style.boxShadow = '0 0 15px rgba(212, 168, 80, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.1)';
                seat.style.transform = 'scale(1.15)';
            }
        });
    });

    // Performer card spotlight effect
    const performerCards = document.querySelectorAll('.performer-card');

    performerCards.forEach(card => {
        const spotlight = card.querySelector('.spotlight-glow');

        card.addEventListener('mouseenter', () => {
            if (spotlight) {
                spotlight.style.transition = 'all 0.5s ease';
                spotlight.style.width = '160px';
                spotlight.style.height = '160px';
                spotlight.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (spotlight) {
                spotlight.style.transition = 'all 0.5s ease';
                spotlight.style.width = '120px';
                spotlight.style.height = '120px';
                spotlight.style.opacity = '0.7';
            }
        });
    });

    // Scroll reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .season-card, .event-card, .performer-card, .seating-tier').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Dynamic title glow effect on hero
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        let hue = 40;
        function animateTitleGlow() {
            hue = (hue + 0.1) % 360;
            const glowIntensity = 0.15 + Math.sin(Date.now() * 0.001) * 0.1;
            heroTitle.style.textShadow = `
                0 0 40px rgba(212, 168, 80, ${glowIntensity}),
                0 2px 4px rgba(0, 0, 0, 0.8),
                0 0 80px rgba(212, 168, 80, ${glowIntensity * 0.5})
            `;
            requestAnimationFrame(animateTitleGlow);
        }
        animateTitleGlow();
    }

    // Parallax effect on hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const parallaxElements = heroSection.querySelectorAll('.hero-title, .hero-divider, .hero-description');
            parallaxElements.forEach((el, i) => {
                const speed = 0.1 + i * 0.05;
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }

    // Enhanced chandelier flicker with mouse proximity
    const chandelierContainer = document.querySelector('.chandelier-container');
    if (chandelierContainer) {
        document.addEventListener('mousemove', (e) => {
            const lights = document.querySelectorAll('.light');
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            lights.forEach((light, i) => {
                const rect = light.getBoundingClientRect();
                const lightX = rect.left + rect.width / 2;
                const lightY = rect.top + rect.height / 2;
                const distance = Math.sqrt((mouseX - lightX) ** 2 + (mouseY - lightY) ** 2);

                if (distance < 200) {
                    light.style.boxShadow = `
                        0 0 15px var(--gold-200),
                        0 0 30px rgba(255, 220, 100, 0.6),
                        0 0 50px rgba(255, 200, 80, 0.3)
                    `;
                } else {
                    light.style.boxShadow = `
                        0 0 6px var(--gold-300),
                        0 0 12px rgba(255, 220, 100, 0.4),
                        0 0 30px rgba(255, 200, 80, 0.2)
                    `;
                }
            });
        });
    }

    // Tooltip for selected seats
    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach(item => {
        item.style.cursor = 'help';
        item.title = 'Clicca su un posto per selezionarlo';
    });

    // Concert hall ambient sound visualizer (subtle background pulse)
    const body = document.body;
    let ambientPulse = 0;
    function ambientPulseEffect() {
        ambientPulse += 0.002;
        const pulse = Math.sin(ambientPulse) * 0.02 + 0.02;
        body.style.background = `
            radial-gradient(ellipse at 50% 30%, rgba(74, 14, 14, ${pulse + 0.1}) 0%, transparent 70%),
            var(--dark-900)
        `;
        requestAnimationFrame(ambientPulseEffect);
    }
    ambientPulseEffect();

    // Add subtle gold shimmer to gilded frames on scroll
    const frameElements = document.querySelectorAll('.ornate-frame, .event-gilded-frame, .card-gilded-frame, .performer-card');
    frameElements.forEach(frame => {
        frame.addEventListener('mouseenter', () => {
            frame.style.transition = 'box-shadow 0.5s ease';
            frame.style.boxShadow = `
                0 0 20px rgba(212, 168, 80, 0.1),
                inset 0 0 20px rgba(212, 168, 80, 0.03)
            `;
        });

        frame.addEventListener('mouseleave', () => {
            frame.style.boxShadow = '';
        });
    });

    // Initialize performer cards as visible after curtain reveal
    setTimeout(() => {
        performerCards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.animation = `card-reveal 0.6s ease forwards`;
            card.style.animationDelay = `${i * 0.1}s`;
        });
    }, 3000);
});