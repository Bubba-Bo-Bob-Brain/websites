document.addEventListener('DOMContentLoaded', () => {
    /* 
     * SYSTEM INITIALIZATION
     * Simulating boot sequence and neural link stabilization
     */
    
    // 1. SYSTEM LOADER
    const loader = document.getElementById('system-loader');
    const body = document.body;

    window.addEventListener('load', () => {
        // Allow the CSS animation to play a bit before hiding
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            setTimeout(() => {
                loader.remove();
                initTypewriter(); // Start terminal effects after load
            }, 500);
        }, 2200);
    });

    // 2. TERMINAL TYPEWRITER EFFECT
    function initTypewriter() {
        const terminal = document.getElementById('terminal-output');
        if(!terminal) return;

        const lines = [
            "> Decrypting archive headers...",
            "> Connecting to Sector 7 uplink...",
            "> WARNING: Soul residue detected.",
            "> System ready. Awaiting user input."
        ];
        
        let lineIndex = 0;
        
        function typeLine() {
            if (lineIndex < lines.length) {
                const p = document.createElement('p');
                p.style.borderBottom = "1px dashed #333";
                p.style.paddingBottom = "5px";
                p.style.marginBottom = "5px";
                terminal.appendChild(p);
                
                let charIndex = 0;
                const text = lines[lineIndex];
                
                const interval = setInterval(() => {
                    p.textContent += text[charIndex];
                    charIndex++;
                    if (charIndex >= text.length) {
                        clearInterval(interval);
                        lineIndex++;
                        setTimeout(typeLine, 300 + Math.random() * 500); // Random delay between lines
                    }
                }, 30); // Typing speed
                
                // Auto scroll to bottom
                terminal.scrollTop = terminal.scrollHeight;
            }
        }
        
        typeLine();
    }

    // 3. INTERACTIVE MAP DATA
    const mapZones = document.querySelectorAll('.map-zone');
    const hoverSector = document.getElementById('hover-sector');
    const hoverStatus = document.getElementById('hover-status');
    const hoverThreat = document.getElementById('hover-threat');

    mapZones.forEach(zone => {
        zone.addEventListener('mouseenter', () => {
            // Play subtle hover sound logic here if audio was enabled
            const sector = zone.getAttribute('data-sector');
            const status = zone.getAttribute('data-status');
            const threat = zone.getAttribute('data-threat');

            if(hoverSector) hoverSector.textContent = sector === "9" ? "ANOMALY_09" : `SECTOR_0${sector}`;
            if(hoverStatus) {
                hoverStatus.textContent = status;
                hoverStatus.style.color = status === "SECURE" ? "var(--color-cyan)" : 
                                          status === "TOXIC" ? "var(--color-waste)" : 
                                          status === "UNSTABLE" ? "var(--color-red)" : "#fff";
            }
            if(hoverThreat) hoverThreat.textContent = threat;
        });

        zone.addEventListener('mouseleave', () => {
            if(hoverSector) hoverSector.textContent = "--";
            if(hoverStatus) hoverStatus.textContent = "--";
            if(hoverThreat) hoverThreat.textContent = "--";
        });
    });

    // 4. FILE DECRYPTION (HERO BUTTON)
    window.decryptFiles = function() {
        const redactedElements = document.querySelectorAll('.redacted');
        const btn = document.querySelector('.btn-primary');
        
        btn.textContent = "DECRYPTING...";
        btn.disabled = true;
        btn.style.opacity = "0.7";

        let delay = 0;
        redactedElements.forEach((el, index) => {
            setTimeout(() => {
                // Scramble effect before revealing
                const originalText = el.getAttribute('data-text') || "TRUTH";
                el.style.color = "var(--color-red)";
                el.style.backgroundColor = "#200";
                
                let iterations = 0;
                const scrambleInterval = setInterval(() => {
                    el.textContent = el.textContent.split('')
                        .map((letter, i) => {
                            if(i < iterations) return originalText[i];
                            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"[Math.floor(Math.random() * 36)];
                        })
                        .join('');
                    
                    if(iterations >= originalText.length) {
                        clearInterval(scrambleInterval);
                        el.style.color = "var(--color-cyan)";
                        el.style.backgroundColor = "transparent";
                        el.style.textShadow = "0 0 5px var(--color-cyan)";
                    }
                    
                    iterations += 1 / 3;
                }, 30);

            }, index * 200); // Stagger the decryption
        });

        setTimeout(() => {
            btn.textContent = "ACCESS GRANTED";
            btn.style.borderColor = "var(--color-cyan)";
            btn.style.color = "var(--color-cyan)";
        }, redactedElements.length * 200 + 1000);
    };

    // 5. ARCHIVE ACCORDION
    window.toggleFile = function(element) {
        // Close other open files first (optional, for cleaner UI)
        const allFiles = document.querySelectorAll('.file-folder');
        allFiles.forEach(file => {
            if (file !== element && file.classList.contains('open')) {
                file.classList.remove('open');
            }
        });
        
        element.classList.toggle('open');
    };

    // 6. CCTV RANDOM GLITCHES
    function triggerSurveillanceGlitch() {
        const screens = document.querySelectorAll('.cctv-screen');
        const randomScreen = screens[Math.floor(Math.random() * screens.length)];
        
        // Don't glitch if it's already "offline" to keep logic simple
        if (!randomScreen.classList.contains('offline')) {
            randomScreen.classList.add('glitching');
            
            // Random duration between 100ms and 400ms
            const glitchDuration = Math.random() * 300 + 100;
            
            setTimeout(() => {
                randomScreen.classList.remove('glitching');
            }, glitchDuration);
        }
    }

    // Run glitches every 2 to 5 seconds
    setInterval(() => {
        if(Math.random() > 0.3) { // 70% chance to trigger
            triggerSurveillanceGlitch();
        }
    }, 3000);

    // 7. TEXT SCRAMBLE EFFECT FOR NAV ITEMS (Purely for flavor)
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
        link.addEventListener('mouseover', event => {
            let iterations = 0;
            const interval = setInterval(() => {
                event.target.innerText = event.target.innerText.split("")
                    .map((letter, index) => {
                        if(index < iterations) {
                            return event.target.dataset.value || event.target.innerText[index]; // Fallback
                        }
                        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ[]#@&"[Math.floor(Math.random() * 30)];
                    })
                    .join("");
                
                if(iterations >= event.target.innerText.length){ 
                    clearInterval(interval);
                    // Reset to original text to ensure accuracy
                    event.target.innerText = event.target.innerText; 
                }
                
                iterations += 1 / 3;
            }, 30);
        });
        
        // Store original text on mouse out to prevent scrambling getting stuck
        link.addEventListener('mouseout', (e) => {
            clearInterval(e.target.interval); // Safety clear
            e.target.innerText = e.target.innerText; 
        });
    });

    // 8. SCROLL REVEAL ANIMATION
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Apply observer to sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        observer.observe(section);
    });

    // Helper to handle the CSS class toggle for the observer
    document.head.insertAdjacentHTML("beforeend", `<style>
        .section.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>`);

    console.log("%c SYSTEM BREACH DETECTED ", "background: #000; color: #ff003c; font-size: 20px; font-family: monospace;");
});