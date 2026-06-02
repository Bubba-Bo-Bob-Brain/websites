// ============================================
// RED ROCK COUNTY BOUNTY BOARD
// Scripts — scripts.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initSaloonDoors();
    initRevolverNav();
    initTumbleweedAnimation();
    initDustParticles();
    initPosterInteractions();
    initRewardCounter();
    initMapInteractions();
    initLogTypewriter();
});

// --- Saloon Door Page Transition ---
function initSaloonDoors() {
    const body = document.body;
    const doors = document.querySelector('.saloon-doors');
    
    // Start with doors closed
    body.style.overflow = 'hidden';
    
    // Open doors after brief delay for dramatic effect
    setTimeout(() => {
        body.classList.add('doors-open');
        
        // Remove door elements from flow after animation
        setTimeout(() => {
            const leftDoor = document.querySelector('.door-left');
            const rightDoor = document.querySelector('.door-right');
            if (leftDoor) leftDoor.style.display = 'none';
            if (rightDoor) rightDoor.style.display = 'none';
            body.style.overflow = '';
        }, 1200);
    }, 500);
    
    // Add transition handler for section changes
    window.addEventListener('beforeunload', () => {
        body.classList.remove('doors-open');
    });
}

// --- Revolver Cylinder Navigation ---
function initRevolverNav() {
    const chambers = document.querySelectorAll('.chamber');
    const sections = document.querySelectorAll('.section');
    
    chambers.forEach(chamber => {
        chamber.addEventListener('click', () => {
            const targetSection = chamber.dataset.section;
            if (!targetSection) return;
            
            // Update active chamber
            chambers.forEach(c => c.classList.remove('active'));
            chamber.classList.add('active');
            
            // Rotate cylinder to show selection
            rotateCylinder(chamber);
            
            // Switch sections with transition
            switchSection(targetSection, sections);
        });
        
        // Add click sound effect simulation
        chamber.addEventListener('mousedown', () => {
            chamber.style.transform = chamber.classList.contains('active') 
                ? 'translateX(-50%) scale(0.95)' 
                : 'scale(0.95)';
        });
        
        chamber.addEventListener('mouseup', () => {
            chamber.style.transform = '';
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const activeChamber = document.querySelector('.chamber.active');
        const chamberArray = Array.from(chambers);
        const currentIndex = chamberArray.indexOf(activeChamber);
        
        let nextIndex;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % chambers.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + chambers.length) % chambers.length;
        } else {
            return;
        }
        
        chambers[nextIndex].click();
    });
}

function rotateCylinder(activeChamber) {
    const cylinder = document.querySelector('.revolver-cylinder');
    const chambers = document.querySelectorAll('.chamber');
    const activeIndex = Array.from(chambers).indexOf(activeChamber);
    const rotation = activeIndex * -60;
    
    cylinder.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    cylinder.style.transform = `rotate(${rotation}deg)`;
    
    // Counter-rotate chamber labels to keep them readable
    chambers.forEach((chamber, index) => {
        const label = chamber.querySelector('.chamber-label');
        if (label) {
            const labelRotation = -rotation - (index * 60);
            label.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            label.style.transform = `rotate(${labelRotation}deg)`;
        }
    });
}

function switchSection(sectionId, allSections) {
    // Fade out current
    const currentSection = document.querySelector('.section.active');
    if (currentSection) {
        currentSection.style.animation = 'section-fade 0.3s ease reverse forwards';
        
        setTimeout(() => {
            currentSection.classList.remove('active');
            currentSection.style.animation = '';
            
            // Show new section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.animation = 'section-fade 0.6s ease forwards';
            }
        }, 300);
    }
}

// --- Tumbleweed Canvas Animation ---
function initTumbleweedAnimation() {
    const canvas = document.getElementById('tumbleweed-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let tumbleweeds = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Tumbleweed {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = -50;
            this.y = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.3);
            this.size = Math.random() * 25 + 15;
            this.speed = Math.random() * 1.5 + 0.5;
            this.rotation = 0;
            this.rotationSpeed = (Math.random() * 0.1 + 0.05) * (Math.random() > 0.5 ? 1 : -1);
            this.bounce = 0;
            this.bounceSpeed = Math.random() * 0.05 + 0.02;
            this.opacity = Math.random() * 0.4 + 0.3;
            this.branches = this.generateBranches();
        }
        
        generateBranches() {
            const branches = [];
            const numBranches = 8 + Math.floor(Math.random() * 6);
            for (let i = 0; i < numBranches; i++) {
                branches.push({
                    angle: (Math.PI * 2 * i) / numBranches,
                    length: this.size * (0.7 + Math.random() * 0.6),
                    curve: (Math.random() - 0.5) * 0.5
                });
            }
            return branches;
        }
        
        update() {
            this.x += this.speed;
            this.rotation += this.rotationSpeed;
            this.bounce += this.bounceSpeed;
            this.y += Math.sin(this.bounce) * 0.5;
            
            if (this.x > canvas.width + 50) {
                // Random chance to respawn or stay gone
                if (Math.random() < 0.3) {
                    this.reset();
                } else {
                    this.x = -200; // Far off screen, will reset eventually
                }
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Draw tumbleweed as collection of curved branches
            ctx.strokeStyle = '#8b7355';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            
            this.branches.forEach(branch => {
                ctx.beginPath();
                const endX = Math.cos(branch.angle) * branch.length;
                const endY = Math.sin(branch.angle) * branch.length;
                const cpX = Math.cos(branch.angle + branch.curve) * branch.length * 0.6;
                const cpY = Math.sin(branch.angle + branch.curve) * branch.length * 0.6;
                
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(cpX, cpY, endX, endY);
                ctx.stroke();
                
                // Add small twigs
                ctx.beginPath();
                const twigStart = { x: endX * 0.7, y: endY * 0.7 };
                const twigEnd = {
                    x: twigStart.x + Math.cos(branch.angle + 0.5) * this.size * 0.3,
                    y: twigStart.y + Math.sin(branch.angle + 0.5) * this.size * 0.3
                };
                ctx.moveTo(twigStart.x, twigStart.y);
                ctx.lineTo(twigEnd.x, twigEnd.y);
                ctx.stroke();
            });
            
            // Draw central mass
            ctx.fillStyle = 'rgba(139, 115, 85, 0.2)';
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Create initial tumbleweeds
    for (let i = 0; i < 3; i++) {
        const weed = new Tumbleweed();
        weed.x = Math.random() * canvas.width;
        tumbleweeds.push(weed);
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        tumbleweeds.forEach(weed => {
            weed.update();
            weed.draw();
        });
        
        // Randomly spawn new tumbleweed
        if (Math.random() < 0.001 && tumbleweeds.length < 5) {
            const newWeed = new Tumbleweed();
            newWeed.x = -50;
            tumbleweeds.push(newWeed);
        }
        
        // Remove excess tumbleweeds
        tumbleweeds = tumbleweeds.filter(weed => weed.x < canvas.width + 100);
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// --- Dust Particle System ---
function initDustParticles() {
    const overlay = document.querySelector('.dust-overlay');
    if (!overlay) return;
    
    let particles = [];
    const maxParticles = 50;
    
    class DustParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * 100;
            this.y = Math.random() * 100;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.3) * 0.5;
            this.speedY = Math.random() * 0.3 + 0.1;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.life = Math.random() * 10 + 5;
        }
        
        update() {
            this.x += this.speedX;
            this.y -= this.speedY;
            this.life -= 0.05;
            
            if (this.y < 0 || this.life <= 0 || this.x < 0 || this.x > 100) {
                this.reset();
                this.y = 100;
            }
        }
        
        getStyle() {
            return `
                left: ${this.x}%;
                top: ${this.y}%;
                width: ${this.size}px;
                height: ${this.size}px;
                opacity: ${this.opacity};
                animation: none;
            `;
        }
    }
    
    // Create particle elements
    for (let i = 0; i < maxParticles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            background: var(--parchment-bleached, #c9b896);
            border-radius: 50%;
            pointer-events: none;
            filter: blur(1px);
        `;
        overlay.appendChild(particle);
        
        const dustParticle = new DustParticle();
        particles.push({ element: particle, particle: dustParticle });
    }
    
    function animate() {
        particles.forEach(({ element, particle }) => {
            particle.update();
            element.style.cssText += particle.getStyle();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

// --- Poster Interactions ---
function initPosterInteractions() {
    const posters = document.querySelectorAll('.poster');
    
    posters.forEach(poster => {
        // Random subtle sway
        const swayAmount = (Math.random() - 0.5) * 2;
        poster.style.transform = `rotate(${swayAmount}deg)`;
        
        // Enhanced hover with sound-like feedback
        poster.addEventListener('mouseenter', () => {
            poster.style.zIndex = '100';
            createWindEffect(poster);
        });
        
        poster.addEventListener('mouseleave', () => {
            poster.style.zIndex = '';
            removeWindEffect(poster);
        });
        
        // Click to expand (modal-like behavior)
        poster.addEventListener('click', () => {
            expandPoster(poster);
        });
    });
}

function createWindEffect(poster) {
    // Simulate wind moving through the poster
    const curls = poster.querySelectorAll('.poster-curl');
    curls.forEach((curl, index) => {
        const delay = index * 0.1;
        curl.style.transition = `transform 0.3s ${delay}s ease`;
        curl.style.transform = 'scale(1.2)';
    });
}

function removeWindEffect(poster) {
    const curls = poster.querySelectorAll('.poster-curl');
    curls.forEach(curl => {
        curl.style.transform = '';
    });
}

function expandPoster(poster) {
    // Create expanded view overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(26, 20, 16, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
        animation: fade-in 0.3s ease;
    `;
    
    const clone = poster.cloneNode(true);
    clone.style.cssText = `
        max-width: 400px;
        width: 90%;
        transform: none !important;
        animation: poster-pop 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    overlay.appendChild(clone);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    overlay.addEventListener('click', () => {
        overlay.style.animation = 'fade-in 0.3s ease reverse';
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 300);
    });
}

// --- Reward Counter Animation ---
function initRewardCounter() {
    const rewardElements = document.querySelectorAll('.reward-amount');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    rewardElements.forEach(el => observer.observe(el));
}

function animateCounter(element) {
    const finalValue = parseInt(element.textContent.replace(/,/g, ''));
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * finalValue);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// --- Map Interactions ---
function initMapInteractions() {
    const locations = document.querySelectorAll('.location');
    
    locations.forEach(location => {
        const pin = location.querySelector('.location-pin');
        const label = location.querySelector('.location-label');
        
        location.addEventListener('mouseenter', () => {
            pin.style.transform = 'rotate(-45deg) scale(1.3)';
            pin.style.transition = 'transform 0.3s ease';
            label.style.background = 'var(--gold)';
            label.style.color = 'var(--ink-black)';
        });
        
        location.addEventListener('mouseleave', () => {
            pin.style.transform = 'rotate(-45deg) scale(1)';
            label.style.background = 'var(--parchment)';
            label.style.color = 'var(--ink-black)';
        });
        
        // Tooltip on click
        location.addEventListener('click', () => {
            showMapTooltip(location);
        });
    });
}

function showMapTooltip(location) {
    const name = location.dataset.name;
    // Simple alert replacement with custom tooltip
    const existing = document.querySelector('.map-tooltip');
    if (existing) existing.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: var(--parchment);
        border: 2px solid var(--ink-black);
        padding: 12px 16px;
        font-family: var(--font-wanted);
        color: var(--ink-black);
        z-index: 100;
        box-shadow: var(--shadow-lg);
        animation: tooltip-appear 0.3s ease;
    `;
    tooltip.textContent = `${name} — Click for details`;
    
    location.appendChild(tooltip);
    
    setTimeout(() => {
        tooltip.remove();
    }, 2000);
}

// --- Dispatch Log Typewriter Effect ---
function initLogTypewriter() {
    const logEntries = document.querySelectorAll('.log-entry');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typewriterEffect(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    logEntries.forEach(entry => observer.observe(entry));
}

function typewriterEffect(element) {
    const content = element.querySelector('.log-content');
    if (!content) return;
    
    const text = content.textContent;
    content.textContent = '';
    content.style.minHeight = '1.5em';
    
    let index = 0;
    const speed = 15; // ms per character
    
    function type() {
        if (index < text.length) {
            content.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    // Delay based on element's position
    setTimeout(type, 200);
}

// --- Utility: Debounce ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// --- Utility: Throttle ---
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// --- Additional CSS-in-JS for dynamic animations ---
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes poster-pop {
        from {
            opacity: 0;
            transform: scale(0.8) rotate(-5deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(0);
        }
    }
    
    @keyframes tooltip-appear {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Cursor customization */
    .poster,
    .chamber,
    .chip,
    .location {
        cursor: pointer;
    }
    
    /* Focus styles for accessibility */
    .chamber:focus,
    .poster:focus,
    .chip:focus,
    .location:focus {
        outline: 2px solid var(--brass);
        outline-offset: 2px;
    }
    
    /* Selection color */
    ::selection {
        background: var(--brass);
        color: var(--ink-black);
    }
`;
document.head.appendChild(dynamicStyles);

// --- Console Easter Egg ---
console.log('%c🤠 RED ROCK COUNTY SHERIFF\'S OFFICE 🤠', 'font-family: monospace; font-size: 14px; color: #8B4513;');
console.log('%c"Wanted dead or alive — preferably dead."', 'font-family: serif; font-style: italic; color: #6b533e;');