/* =========================================
   BIOMASS // CHARACTER REGISTRY
   Main Interaction Script
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const CONFIG = {
        scrollDelay: 100, // ms delay between cards appearing
        tiltStrength: 10, // Max rotation degrees
        glitchInterval: 2500, // ms
        logInterval: 8000, // ms for footer log updates
    };

    // --- DOM Elements ---
    const elements = {
        cards: document.querySelectorAll('.character-card'),
        factionBtns: document.querySelectorAll('.faction-btn'),
        timestamp: document.getElementById('current-timestamp'),
        dials: document.querySelectorAll('.dial-fill'),
        skillBars: document.querySelectorAll('.skill-fill'),
        mutationBars: document.querySelectorAll('.mutation-fill'),
        footerLog: document.querySelector('.footer-log'),
        dnaStrands: document.querySelectorAll('.dna-strand'),
    };

    // --- 1. Timestamp & Date Logic ---
    function updateTimestamp() {
        const now = new Date();
        // Format as futuristic date: 2087.MM.DD // HH:MM:SS
        const pad = (n) => n.toString().padStart(2, '0');
        const dateStr = `2087.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
        const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        
        if (elements.timestamp) {
            elements.timestamp.textContent = `${dateStr} // ${timeStr}`;
        }
    }
    
    setInterval(updateTimestamp, 1000);
    updateTimestamp(); // Initial call

    // --- 2. Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered reveal based on original index in NodeList
                const cardIndex = Array.from(elements.cards).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    animateInternalMetrics(entry.target);
                }, (cardIndex % 3) * CONFIG.scrollDelay); // Reset stagger per row approx
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.cards.forEach(card => cardObserver.observe(card));

    // --- 3. Internal Metrics Animation (Dials, Bars) ---
    function animateInternalMetrics(card) {
        // Animate Dials
        const dials = card.querySelectorAll('.dial-fill');
        dials.forEach(dial => {
            const parent = dial.closest('.contamination-dial');
            const level = parent.getAttribute('data-level');
            if (level) {
                const offset = 283 - (283 * (level / 100));
                dial.style.strokeDashoffset = offset;
                
                // Color coding based on danger level
                if (level >= 80) dial.style.stroke = 'var(--status-wanted)';
                else if (level >= 60) dial.style.stroke = 'var(--status-hostile)';
                else if (level >= 40) dial.style.stroke = 'var(--status-neutral)';
                else dial.style.stroke = 'var(--status-ally)';
            }
        });

        // Animate Skill Bars
        const skillBars = card.querySelectorAll('.skill-fill');
        skillBars.forEach(bar => {
            // Force reflow to ensure transition triggers if width was 0
            const computedStyle = window.getComputedStyle(bar);
            const currentWidth = computedStyle.width;
            bar.style.width = currentWidth; // Set to current computed (0 or defined in inline style)
            
            // Actually, the style is in HTML via inline --fill.
            // We need to set the actual width property.
            const targetWidth = bar.style.getPropertyValue('--fill');
            if (targetWidth) {
                bar.style.width = '0%'; // Start at 0
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        bar.style.width = targetWidth; // Animate to target
                    });
                });
            }
        });

        // Animate Mutation Bars
        const mutationBars = card.querySelectorAll('.mutation-fill');
        mutationBars.forEach(bar => {
            const targetWidth = bar.style.getPropertyValue('--fill');
            if (targetWidth) {
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        bar.style.width = targetWidth;
                    });
                });
            }
        });
    }

    // --- 4. Faction Filtering Logic ---
    elements.factionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active Button
            elements.factionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetFaction = btn.getAttribute('data-faction');

            elements.cards.forEach(card => {
                const cardFaction = card.getAttribute('data-faction');
                
                if (targetFaction === 'all' || targetFaction === cardFaction) {
                    card.style.display = 'flex';
                    // Small timeout to allow display:flex to apply before opacity transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                        card.style.pointerEvents = 'auto';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    card.style.pointerEvents = 'none';
                    // Wait for transition to finish before hiding
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // --- 5. Glitch Text Effect ---
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    
    function triggerGlitch(element) {
        if (!element) return;
        const originalText = element.getAttribute('data-text') || element.innerText;
        let iterations = 0;
        
        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) { 
                clearInterval(interval);
                element.innerText = originalText; // Ensure clean reset
            }
            
            iterations += 1 / 2; // Speed of reconstruction
        }, 30);
    }

    // Random glitch on title
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every interval
            const title = document.querySelector('.main-title');
            triggerGlitch(title);
        }
    }, CONFIG.glitchInterval);

    // Hover glitch on character names
    document.querySelectorAll('.character-name').forEach(name => {
        name.addEventListener('mouseenter', () => triggerGlitch(name));
    });

    // --- 6. 3D Tilt Effect on Cards ---
    elements.cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -CONFIG.tiltStrength;
            const rotateY = ((x - centerX) / centerX) * CONFIG.tiltStrength;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // --- 7. Dynamic Footer Log Updates ---
    const logMessages = [
        { type: 'info', msg: 'Scanning sector 4... Life signs detected.' },
        { type: 'warn', msg: 'Bio-readings spiking in containment unit 7.' },
        { type: 'error', msg: 'Failed to decrypt Chrome Legion comms.' },
        { type: 'info', msg: 'Updating mutation database...' },
        { type: 'warn', msg: 'Radiation levels rising in the Badlands.' },
        { type: 'error', msg: 'Connection to Hive Node lost.' },
        { type: 'info', msg: 'New character profile uploaded.' },
        { type: 'warn', msg: 'Unauthorized access attempt blocked.' },
        { type: 'info', msg: 'Synthesizing antitoxin compounds...' },
        { type: 'error', msg: 'CRITICAL: DNA degradation in subject #44.' }
    ];

    function addLogEntry() {
        if (!elements.footerLog) return;

        const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
        
        const entry = document.createElement('p');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="log-time">[${timeStr}]</span> <span class="log-${randomLog.type}">${randomLog.type.toUpperCase()}</span> ${randomLog.msg}`;
        
        elements.footerLog.appendChild(entry);
        
        // Auto scroll to bottom
        elements.footerLog.scrollTop = elements.footerLog.scrollHeight;

        // Limit log entries to prevent memory bloat
        if (elements.footerLog.children.length > 20) {
            elements.footerLog.removeChild(elements.footerLog.firstChild);
        }
    }

    setInterval(addLogEntry, CONFIG.logInterval);

    // --- 8. DNA Strand Parallax (Subtle) ---
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        elements.dnaStrands.forEach((strand, index) => {
            const speed = index === 0 ? 1 : -1; // Move in opposite directions
            strand.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
        });
    });

    // --- 9. Pixel Grid Randomizer (Easter Egg) ---
    // Randomly light up pixels in the placeholder images
    setInterval(() => {
        const pixels = document.querySelectorAll('.pixel');
        const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
        if (randomPixel) {
            const originalBg = randomPixel.style.background;
            randomPixel.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            setTimeout(() => {
                randomPixel.style.background = '';
            }, 200);
        }
    }, 500);

});