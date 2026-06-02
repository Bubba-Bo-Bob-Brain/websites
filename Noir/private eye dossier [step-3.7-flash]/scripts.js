/* ============================================
   CASE FILE #1947-11-15 | DETECTIVE JACK MARLOWE
   Interactive JavaScript - Noir Atmosphere Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // TYPEWRITER EFFECT SYSTEM
    // ============================================
    class Typewriter {
        constructor(element, text, speed = 30) {
            this.element = element;
            this.text = text;
            this.speed = speed;
            this.index = 0;
            this.cursor = element.parentElement.querySelector('.cursor');
            this.isDeleting = false;
            this.isPaused = false;
        }

        type() {
            if (this.isPaused) return;

            const currentText = this.text.substring(0, this.index);
            this.element.textContent = currentText;

            if (!this.isDeleting && this.index < this.text.length) {
                this.index++;
                setTimeout(() => this.type(), this.speed + Math.random() * 50);
            } else if (this.isDeleting && this.index > 0) {
                this.index--;
                setTimeout(() => this.type(), this.speed / 2);
            } else if (!this.isDeleting && this.index === this.text.length) {
                // Pause at end, then restart
                this.isPaused = true;
                setTimeout(() => {
                    this.isPaused = false;
                    this.isDeleting = true;
                    this.type();
                }, 3000);
            } else if (this.isDeleting && this.index === 0) {
                this.isDeleting = false;
                setTimeout(() => this.type(), 500);
            }
        }

        start() {
            this.type();
        }
    }

    // Initialize typewriter with case summary
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const caseSummary = `CASE SUMMARY - NOVEMBER 16, 1947

The Midtown Diamond Co. heist represents a sophisticated operation involving inside knowledge of security protocols. Estimated loot: $250,000 in uncut diamonds.

Key findings:
- Alarm system bypassed using copied security code
- Single cigarette butt recovered (brand: "Royal Crown", monogram "VM")
- Partial fingerprints on display case lock
- Getaway vehicle: 1946 Ford Coupe, abandoned at 5th and Main

Suspect Vincent "The Viper" Moretti remains the primary person of interest. Known associate of the Romano Crew. Last confirmed sighting at The Blue Note Lounge, 10:30 PM, November 14th.

Witness reports indicate a second accomplice with a limp. Investigation ongoing.

Det. Jack Marlowe
Badge #7741`;

        const typewriter = new Typewriter(typewriterElement, caseSummary, 25);
        setTimeout(() => typewriter.start(), 1000);
    }

    // ============================================
    // NAVIGATION SYSTEM
    // ============================================
    const navTabs = document.querySelectorAll('.nav-tab');
    const caseSections = document.querySelectorAll('.case-section');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            
            // Update active tab
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active section with fade effect
            caseSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    // Trigger section-specific animations
                    if (targetId === 'corkboard') {
                        animateCorkboard();
                    }
                }
            });

            // Add a subtle click effect
            tab.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tab.style.transform = '';
            }, 100);
        });
    });

    // ============================================
    // SMOKE CURSOR TRAIL SYSTEM
    // ============================================
    const smokeContainer = document.querySelector('.smoke-trail');
    const smokeParticles = [];
    const maxParticles = 15;

    class SmokeParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 20 + 10;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = Math.random() * -1 - 0.5;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.element = document.createElement('div');
            this.element.style.cssText = `
                position: absolute;
                width: ${this.size}px;
                height: ${this.size}px;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                filter: blur(8px);
            `;
            smokeContainer.appendChild(this.element);
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.size += 0.5;

            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            this.element.style.opacity = this.life * 0.3;
            this.element.style.width = `${this.size}px`;
            this.element.style.height = `${this.size}px`;
        }

        destroy() {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    let mouseX = 0;
    let mouseY = 0;
    let lastSmokeTime = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update custom cursor position
        document.body.style.setProperty('--cursor-x', `${mouseX}px`);
        document.body.style.setProperty('--cursor-y', `${mouseY}px`);

        // Create smoke particles
        const now = Date.now();
        if (now - lastSmokeTime > 50 && smokeParticles.length < maxParticles) {
            smokeParticles.push(new SmokeParticle(mouseX, mouseY));
            lastSmokeTime = now;
        }
    });

    // Update cursor position via CSS custom properties
    document.addEventListener('mousemove', (e) => {
        document.body.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.body.style.setProperty('--cursor-y', `${e.clientY}px`);
    });

    // Animation loop for smoke
    function animateSmoke() {
        for (let i = smokeParticles.length - 1; i >= 0; i--) {
            const particle = smokeParticles[i];
            particle.update();
            
            if (particle.life <= 0) {
                particle.destroy();
                smokeParticles.splice(i, 1);
            }
        }
        requestAnimationFrame(animateSmoke);
    }
    animateSmoke();

    // ============================================
    // VENETIAN BLIND MOUSE PARALLAX
    // ============================================
    const blinds = document.querySelectorAll('.blind');
    let blindTimeout;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        blinds.forEach((blind, index) => {
            const speed = (index + 1) * 0.5;
            const xOffset = (x - 0.5) * speed * 20;
            const yOffset = (y - 0.5) * speed * 10;
            
            blind.style.transform = `translate(${xOffset}px, ${yOffset}px) skewX(${xOffset * 0.1}deg)`;
        });

        // Reset blinds when mouse stops
        clearTimeout(blindTimeout);
        blindTimeout = setTimeout(() => {
            blinds.forEach(blind => {
                blind.style.transform = '';
            });
        }, 1000);
    });

    // ============================================
    // CORKBOARD INTERACTIVITY
    // ============================================
    let isDragging = false;
    let currentDragItem = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const corkboardItems = document.querySelectorAll('.pinned-item');

    corkboardItems.forEach(item => {
        // Random initial rotation for organic feel
        const randomRotation = (Math.random() - 0.5) * 10;
        item.style.setProperty('--note-rotation', `${randomRotation}deg`);
        
        const photo = item.querySelector('.cork-photo');
        if (photo) {
            photo.style.setProperty('--photo-rotation', `${(Math.random() - 0.5) * 6}deg`);
        }

        // Mouse events for dragging
        item.addEventListener('mousedown', (e) => {
            isDragging = true;
            currentDragItem = item;
            const rect = item.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            item.style.zIndex = '100';
            item.style.cursor = 'grabbing';
        });

        // Hover sound effect simulation (visual feedback)
        item.addEventListener('mouseenter', () => {
            const pin = item.querySelector('.pin');
            if (pin) {
                pin.style.transform = 'translateX(-50%) scale(1.2)';
                setTimeout(() => {
                    pin.style.transform = 'translateX(-50%) scale(1)';
                }, 200);
            }
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && currentDragItem) {
            const corkboard = document.querySelector('.corkboard');
            const corkRect = corkboard.getBoundingClientRect();
            
            let newX = e.clientX - corkRect.left - dragOffsetX;
            let newY = e.clientY - corkRect.top - dragOffsetY;

            // Constrain to corkboard bounds
            newX = Math.max(0, Math.min(newX, corkRect.width - currentDragItem.offsetWidth));
            newY = Math.max(0, Math.min(newY, corkRect.height - currentDragItem.offsetHeight));

            currentDragItem.style.left = `${newX}px`;
            currentDragItem.style.top = `${newY}px`;

            // Update SVG string positions dynamically (simplified)
            updateStringPaths();
        }
    });

    document.addEventListener('mouseup', () => {
        if (currentDragItem) {
            currentDragItem.style.zIndex = '';
            currentDragItem.style.cursor = 'grab';
        }
        isDragging = false;
        currentDragItem = null;
    });

    // ============================================
    // DYNAMIC RED STRING CONNECTIONS
    // ============================================
    function updateStringPaths() {
        const paths = document.querySelectorAll('.red-string');
        const items = document.querySelectorAll('.pinned-item');
        
        // Simple connection update based on item positions
        // In a full implementation, this would recalculate paths between connected items
        paths.forEach((path, index) => {
            const delay = index * 0.2;
            path.style.animation = 'none';
            path.offsetHeight; // Trigger reflow
            path.style.animation = `drawString 2s ease-out ${delay}s forwards`;
        });
    }

    function animateCorkboard() {
        const paths = document.querySelectorAll('.red-string');
        paths.forEach((path, index) => {
            path.style.animation = 'none';
            path.offsetHeight;
            path.style.animation = `drawString 2s ease-out ${index * 0.3}s forwards`;
        });

        // Animate pinned items entrance
        const items = document.querySelectorAll('.pinned-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0) rotate(0deg)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                item.style.opacity = '1';
                const rotation = item.style.getPropertyValue('--note-rotation') || '0deg';
                item.style.transform = `scale(1) rotate(${rotation})`;
            }, index * 100);
        });
    }

    // ============================================
    // EVIDENCE PHOTO DEVELOPING EFFECT
    // ============================================
    const evidencePhotos = document.querySelectorAll('.evidence-photo img');
    
    evidencePhotos.forEach(photo => {
        photo.addEventListener('mouseenter', () => {
            photo.style.transition = 'filter 0.5s ease';
            photo.style.filter = 'grayscale(100%) contrast(1.4) brightness(1.1) sepia(20%)';
        });
        
        photo.addEventListener('mouseleave', () => {
            photo.style.filter = 'grayscale(100%) contrast(1.1) brightness(0.9)';
        });

        // Click to "enhance" (temporary full contrast)
        photo.addEventListener('click', () => {
            photo.style.filter = 'grayscale(100%) contrast(1.8) brightness(1.2)';
            setTimeout(() => {
                photo.style.filter = 'grayscale(100%) contrast(1.1) brightness(0.9)';
            }, 300);
        });
    });

    // ============================================
    // WITNESS STATEMENT REVEAL ON SCROLL
    // ============================================
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const statementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statement = entry.target;
                statement.style.opacity = '1';
                statement.style.transform = 'rotate(0deg) translateY(0)';
                
                // Typewriter effect for statement text
                const textElement = statement.querySelector('.statement-text p');
                if (textElement && !textElement.dataset.typed) {
                    typeStatement(textElement);
                    textElement.dataset.typed = 'true';
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.witness-statement').forEach(statement => {
        statement.style.opacity = '0';
        statement.style.transform = 'rotate(0deg) translateY(20px)';
        statement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        statementObserver.observe(statement);
    });

    function typeStatement(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--color-accent-red)';
        
        let i = 0;
        const speed = 15;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed + Math.random() * 20);
            } else {
                element.style.borderRight = 'none';
            }
        }
        
        setTimeout(type, 300);
    }

    // ============================================
    // ATMOSPHERIC ENHANCEMENTS
    // ============================================
    
    // Random flicker effect for lights
    setInterval(() => {
        if (Math.random() > 0.95) {
            document.body.style.opacity = '0.98';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        }
    }, 100);

    // Case file timestamp updater
    function updateCaseTimestamp() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const timeString = now.toLocaleDateString('en-US', options);
        
        // Could update a live timestamp element if added
        console.log(`Case file accessed: ${timeString}`);
    }

    updateCaseTimestamp();

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', (e) => {
        const activeSection = document.querySelector('.case-section.active');
        if (!activeSection) return;

        const sectionIds = Array.from(caseSections).map(s => s.id);
        const currentIndex = sectionIds.indexOf(activeSection.id);

        if (e.key === 'ArrowRight' && currentIndex < sectionIds.length - 1) {
            const nextTab = document.querySelector(`[data-target="${sectionIds[currentIndex + 1]}"]`);
            if (nextTab) nextTab.click();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            const prevTab = document.querySelector(`[data-target="${sectionIds[currentIndex - 1]}"]`);
            if (prevTab) prevTab.click();
        }
    });

    // ============================================
    // AMBIENT SOUND TOGGLE (Visual indicator only)
    // ============================================
    const soundToggle = document.createElement('button');
    soundToggle.innerHTML = '🔇';
    soundToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-paper);
        border: 2px solid var(--color-ink);
        padding: 10px;
        cursor: pointer;
        z-index: 1000;
        font-family: var(--font-display);
        font-size: 1.2rem;
        box-shadow: var(--shadow-hard);
        transition: transform 0.2s;
    `;
    soundToggle.title = 'Toggle Ambient Rain Sound (Visual Demo)';
    document.body.appendChild(soundToggle);

    let soundOn = false;
    soundToggle.addEventListener('click', () => {
        soundOn = !soundOn;
        soundToggle.innerHTML = soundOn ? '🔊' : '🔇';
        soundToggle.style.background = soundOn ? 'var(--color-accent-red)' : 'var(--color-paper)';
        soundToggle.style.color = soundOn ? 'white' : 'var(--color-ink)';
        
        // In a real implementation, this would control audio
        if (soundOn) {
            console.log('Ambient rain sound activated');
        }
    });

    // ============================================
    // EASTER EGG: Konami Code for "CLASSIFIED" mode
    // ============================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateClassifiedMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateClassifiedMode() {
        document.body.style.filter = 'hue-rotate(180deg) contrast(1.2)';
        const stamp = document.createElement('div');
        stamp.textContent = 'CLASSIFIED';
        stamp.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            font-family: var(--font-display);
            font-size: 5rem;
            color: var(--color-accent-red);
            border: 5px solid var(--color-accent-red);
            padding: 20px 40px;
            z-index: 10000;
            background: rgba(0,0,0,0.9);
            animation: stampIn 0.5s ease-out;
        `;
        document.body.appendChild(stamp);
        
        setTimeout(() => {
            stamp.remove();
            document.body.style.filter = '';
        }, 3000);
    }

    // Add stamp animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes stampIn {
            0% { transform: translate(-50%, -50%) rotate(-15deg) scale(5); opacity: 0; }
            50% { transform: translate(-50%, -50%) rotate(-15deg) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) rotate(-15deg) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // INITIALIZATION LOG
    // ============================================
    console.log('%c CASE FILE SYSTEM INITIALIZED ', 'background: #1a1a1a; color: #cc0000; font-size: 16px; padding: 10px; border: 2px solid #cc0000;');
    console.log('%c Detective Jack Marlowe - Badge #7741 ', 'color: #8b7355; font-style: italic;');
    console.log('%c All evidence secured. Trust no one. ', 'color: #4a4a4a;');
});