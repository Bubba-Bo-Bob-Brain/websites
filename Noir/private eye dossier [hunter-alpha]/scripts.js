/* ============================================
   CASE FILE NO. 437 — THE BLACKWOOD CONSPIRACY
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initTabNavigation();
    initRainEffect();
    initSmokeCursor();
    initTypewriterEffect();
    initCorkboardInteractions();
    initSuspicionBars();
    initParallaxEffects();
});

/* ============================================
   TAB NAVIGATION
   ============================================ */
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.folder-tab-btn');
    const sections = document.querySelectorAll('.case-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;

            // Update button states
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            // Update section visibility
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    
                    // Trigger typewriter for newly visible section
                    const typewriterElements = section.querySelectorAll('.typewriter-paragraph:not(.typed)');
                    typewriterElements.forEach(el => {
                        setTimeout(() => startTypewriter(el), 300);
                    });
                }
            });

            // Play subtle click sound effect (visual feedback)
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    });
}

/* ============================================
   RAIN EFFECT
   ============================================ */
function initRainEffect() {
    const canvas = document.getElementById('rainCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let drops = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createDrops() {
        drops = [];
        const dropCount = Math.floor(canvas.width / 3);
        
        for (let i = 0; i < dropCount; i++) {
            drops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 5 + 8,
                opacity: Math.random() * 0.3 + 0.1,
                wind: Math.random() * 2 - 1
            });
        }
    }

    function drawRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x + drop.wind, drop.y + drop.length);
            ctx.strokeStyle = `rgba(200, 200, 220, ${drop.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Update position
            drop.y += drop.speed;
            drop.x += drop.wind * 0.5;

            // Reset drop when it goes off screen
            if (drop.y > canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * canvas.width;
            }
            if (drop.x > canvas.width) {
                drop.x = 0;
            }
            if (drop.x < 0) {
                drop.x = canvas.width;
            }
        });

        animationId = requestAnimationFrame(drawRain);
    }

    // Initialize
    resizeCanvas();
    createDrops();
    drawRain();

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        createDrops();
    });

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            drawRain();
        }
    });
}

/* ============================================
   SMOKE CURSOR TRAIL
   ============================================ */
function initSmokeCursor() {
    const canvas = document.getElementById('smokeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let mouseTimeout;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class SmokeParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 15 + 5;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * -1.5 - 0.5;
            this.opacity = Math.random() * 0.3 + 0.2;
            this.decay = Math.random() * 0.015 + 0.008;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size += 0.3;
            this.opacity -= this.decay;
            this.rotation += this.rotationSpeed;
            this.speedX *= 0.99;
            this.speedY *= 0.99;
        }

        draw(ctx) {
            if (this.opacity <= 0) return;
            
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Create gradient for smoke effect
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, `rgba(180, 180, 180, ${this.opacity})`);
            gradient.addColorStop(0.4, `rgba(150, 150, 150, ${this.opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(120, 120, 120, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    function createParticles(x, y) {
        const count = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            particles.push(new SmokeParticle(x + offsetX, y + offsetY));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles = particles.filter(p => p.opacity > 0);
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        // Limit particle count for performance
        if (particles.length > 100) {
            particles = particles.slice(-100);
        }

        requestAnimationFrame(animate);
    }

    // Mouse events
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        
        createParticles(mouseX, mouseY);
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    });

    // Initialize
    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
function initTypewriterEffect() {
    // Start typewriter for visible elements
    const visibleParagraphs = document.querySelectorAll('.case-section.active .typewriter-paragraph');
    visibleParagraphs.forEach((el, index) => {
        setTimeout(() => startTypewriter(el), index * 500 + 500);
    });

    // Also handle dossier note
    const dossierNote = document.querySelector('.dossier-note');
    if (dossierNote) {
        setTimeout(() => startTypewriter(dossierNote), 1000);
    }
}

function startTypewriter(element) {
    if (element.classList.contains('typed') || element.classList.contains('typing')) return;
    
    element.classList.add('typing');
    const text = element.dataset.text || element.textContent;
    const typedSpan = element.querySelector('.typed-text');
    const cursorSpan = element.querySelector('.typed-cursor');
    
    if (!typedSpan) {
        // Simple typewriter for elements without spans
        element.textContent = '';
        let i = 0;
        const speed = 30;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed + Math.random() * 20);
            } else {
                element.classList.add('typed');
                element.classList.remove('typing');
            }
        }
        type();
        return;
    }
    
    let i = 0;
    const speed = 25;
    
    function type() {
        if (i < text.length) {
            typedSpan.textContent += text.charAt(i);
            i++;
            
            // Variable speed for more realistic effect
            let nextDelay = speed;
            const char = text.charAt(i - 1);
            
            if (char === '.' || char === '!' || char === '?') {
                nextDelay = speed * 8;
            } else if (char === ',') {
                nextDelay = speed * 3;
            } else if (char === '—' || char === '-') {
                nextDelay = speed * 4;
            } else if (char === ' ') {
                nextDelay = speed * 0.5;
            } else {
                nextDelay = speed + Math.random() * 15;
            }
            
            setTimeout(type, nextDelay);
        } else {
            // Hide cursor after typing is complete
            setTimeout(() => {
                if (cursorSpan) {
                    cursorSpan.style.display = 'none';
                }
            }, 1000);
            element.classList.add('typed');
            element.classList.remove('typing');
        }
    }
    
    type();
}

/* ============================================
   CORKBOARD INTERACTIONS
   ============================================ */
function initCorkboardInteractions() {
    const corkItems = document.querySelectorAll('.cork-item');
    
    corkItems.forEach(item => {
        // Add hover sound effect (visual pulse)
        item.addEventListener('mouseenter', () => {
            const pinHead = item.querySelector('.pin-head');
            if (pinHead) {
                pinHead.style.transform = 'translateX(-50%) scale(1.2)';
                pinHead.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.6)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const pinHead = item.querySelector('.pin-head');
            if (pinHead) {
                pinHead.style.transform = 'translateX(-50%)';
                pinHead.style.boxShadow = '';
            }
        });

        // Make items draggable (optional enhancement)
        makeDraggable(item);
    });

    // Add subtle thread animation
    animateThreads();
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    element.addEventListener('mousedown', (e) => {
        if (e.target.closest('.pin-head')) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = element.getBoundingClientRect();
            const parentRect = element.parentElement.getBoundingClientRect();
            initialLeft = rect.left - parentRect.left;
            initialTop = rect.top - parentRect.top;
            
            element.style.zIndex = '100';
            element.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        element.style.left = `${initialLeft + deltaX}px`;
        element.style.top = `${initialTop + deltaY}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.zIndex = '';
            element.style.cursor = '';
        }
    });
}

function animateThreads() {
    const threads = document.querySelectorAll('.red-thread');
    
    threads.forEach((thread, index) => {
        // Add subtle swaying animation
        const length = thread.getTotalLength ? thread.getTotalLength() : 500;
        thread.style.strokeDasharray = length;
        thread.style.strokeDashoffset = length;
        
        // Animate drawing
        setTimeout(() => {
            thread.style.transition = `stroke-dashoffset ${1 + index * 0.2}s ease-out`;
            thread.style.strokeDashoffset = '0';
        }, index * 200);
    });
}

/* ============================================
   SUSPICION BARS ANIMATION
   ============================================ */
function initSuspicionBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.threat-fill, .reliability-fill');
                fills.forEach(fill => {
                    fill.style.transition = 'width 1.5s ease-out';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Observe suspect cards
    document.querySelectorAll('.suspect-card').forEach(card => {
        observer.observe(card);
    });

    // Observe witness statements
    document.querySelectorAll('.witness-statement').forEach(statement => {
        observer.observe(statement);
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallaxEffects() {
    const header = document.querySelector('.case-header');
    const badge = document.querySelector('.detective-badge');
    
    if (!header || !badge) return;

    document.addEventListener('mousemove', (e) => {
        const rect = header.getBoundingClientRect();
        
        // Check if mouse is over header
        if (e.clientY < rect.bottom) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const rotateX = (mouseY - centerY) / 50;
            const rotateY = (mouseX - centerX) / 50;
            
            badge.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            badge.style.transform = '';
        }
    });

    // Suspect cards tilt effect
    document.querySelectorAll('.suspect-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ============================================
   ADDITIONAL EFFECTS
   ============================================ */

// Typing cursor sound simulation (visual)
document.addEventListener('keydown', () => {
    const cursor = document.querySelector('.typed-cursor');
    if (cursor) {
        cursor.style.color = '#fff';
        setTimeout(() => {
            cursor.style.color = '';
        }, 50);
    }
});

// Add flickering effect to status indicator
function addFlickerEffect() {
    const statusElements = document.querySelectorAll('.status-active');
    statusElements.forEach(el => {
        setInterval(() => {
            if (Math.random() > 0.95) {
                el.style.opacity = '0.5';
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 50);
            }
        }, 100);
    });
}

addFlickerEffect();

// Evidence photo hover zoom
document.querySelectorAll('.evidence-item').forEach(item => {
    const photoFrame = item.querySelector('.photo-lightbox');
    if (!photoFrame) return;

    item.addEventListener('mouseenter', () => {
        photoFrame.style.transform = 'scale(1.02)';
        photoFrame.style.transition = 'transform 0.3s ease';
    });

    item.addEventListener('mouseleave', () => {
        photoFrame.style.transform = '';
    });
});

// Notebook page flip effect
document.querySelectorAll('.notebook-page').forEach((page, index) => {
    page.addEventListener('mouseenter', () => {
        page.style.background = 'rgba(255, 255, 255, 0.5)';
        page.style.transition = 'background 0.3s ease';
    });

    page.addEventListener('mouseleave', () => {
        page.style.background = '';
    });
});

// Corkboard pin wiggle on hover
document.querySelectorAll('.pin-head').forEach(pin => {
    pin.addEventListener('mouseenter', () => {
        pin.style.animation = 'pinWiggle 0.3s ease';
    });
    
    pin.addEventListener('animationend', () => {
        pin.style.animation = '';
    });
});

// Add pin wiggle keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes pinWiggle {
        0%, 100% { transform: translateX(-50%) rotate(0deg); }
        25% { transform: translateX(-50%) rotate(-5deg); }
        75% { transform: translateX(-50%) rotate(5deg); }
    }
`;
document.head.appendChild(styleSheet);

// Console Easter Egg
console.log('%c🔍 CASE FILE NO. 437 🔍', 'font-size: 20px; font-weight: bold; color: #d4a017; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cThe Blackwood Conspiracy', 'font-size: 14px; font-style: italic; color: #cc0000;');
console.log('%c"If you\'re reading this, detective, you\'re already in too deep."', 'font-size: 12px; color: #666; font-family: monospace;');