/* ============================================
   THE FRACTURE BROADCAST // JAVASCRIPT
   EST. 2187 // SECURE FREQUENCY 89.7 THz
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // PRELOADER SEQUENCE
    // ==========================================
    const preloader = document.getElementById('preloader');
    const progressFill = document.getElementById('progressFill');
    
    function initPreloader() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = `${progress}%`;
            
            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    // Trigger typewriter after preloader
                    setTimeout(initTypewriter, 500);
                    // Trigger dashboard counters
                    initDashboardCounters();
                }, 800);
            }
        }, 300);
    }
    
    initPreloader();

    // ==========================================
    // TYPEWRITER EFFECT
    // ==========================================
    function initTypewriter() {
        const target = document.querySelector('.typed-text');
        const text = "Fellow citizens of the Fracture. This is Operator K-447 broadcasting from the lower depths. We have intercepted new intelligence from Synthara's central node. The quarantine in Sector 7-G is not what they claim. It is a processing center. They are harvesting neural patterns to fuel the Comportal Protocol. We must act before Cycle 40. Meet at Node 447. Bring encrypted drives only. Trust no one. The network is fractured, but we are not.";
        
        let i = 0;
        const speed = 40;
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        
        function type() {
            if (i < text.length) {
                target.innerHTML = text.substring(0, i + 1) + '<span class="cursor"></span>';
                i++;
                setTimeout(type, speed + Math.random() * 30);
            } else {
                // Keep cursor blinking
                target.innerHTML = text + '<span class="cursor"></span>';
            }
        }
        
        type();
    }

    // ==========================================
    // GLITCH EFFECTS
    // ==========================================
    function initGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        setInterval(() => {
            glitchElements.forEach(el => {
                if (Math.random() > 0.85) {
                    el.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                    setTimeout(() => {
                        el.style.transform = 'translate(0, 0)';
                    }, 100);
                }
            });
        }, 1500);
    }

    // ==========================================
    // NETWORK CANVAS VISUALIZATION
    // ==========================================
    function initNetworkCanvas() {
        const canvas = document.getElementById('networkCanvas');
        const ctx = canvas.getContext('2d');
        
        let width, height;
        const nodes = [];
        const nodeCount = 35;
        const connectionDistance = 120;
        
        function resize() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }
        
        window.addEventListener('resize', resize);
        resize();
        
        class Node {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.status = Math.random() > 0.8 ? 'compromised' : 'active';
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.status === 'compromised' ? '#ff0033' : '#00ff41';
                ctx.fill();
            }
        }
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw connections
            nodes.forEach((nodeA, i) => {
                nodeA.update();
                nodeA.draw();
                
                for (let j = i + 1; j < nodes.length; j++) {
                    const nodeB = nodes[j];
                    const dx = nodeA.x - nodeB.x;
                    const dy = nodeA.y - nodeB.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(nodeA.x, nodeA.y);
                        ctx.lineTo(nodeB.x, nodeB.y);
                        
                        const alpha = 1 - (dist / connectionDistance);
                        const isCompromised = nodeA.status === 'compromised' || nodeB.status === 'compromised';
                        ctx.strokeStyle = isCompromised ? `rgba(255, 0, 51, ${alpha * 0.5})` : `rgba(0, 255, 65, ${alpha * 0.3})`;
                        ctx.lineWidth = isCompromised ? 1 : 0.5;
                        ctx.stroke();
                    }
                }
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // ==========================================
    // DASHBOARD COUNTERS
    // ==========================================
    function initDashboardCounters() {
        const counters = document.querySelectorAll('.value-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-value'));
                    let current = 0;
                    const increment = target / 100;
                    const duration = 2000;
                    const stepTime = duration / 100;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.floor(current).toLocaleString();
                    }, stepTime);
                    
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    // ==========================================
    // CAMERA TIMESTAMPS
    // ==========================================
    function initCameraClocks() {
        const clocks = document.querySelectorAll('.cam-timestamp');
        
        function updateClocks() {
            const now = new Date();
            const timeStr = now.toISOString().replace('T', ' // ').substring(0, 19) + ' UTC';
            
            clocks.forEach(clock => {
                if (!clock.hasAttribute('data-static')) {
                    clock.textContent = timeStr;
                }
            });
        }
        
        // Mark the corrupted feed timestamp as static
        const corruptedCam = document.querySelector('.corrupted-feed .cam-timestamp');
        if (corruptedCam) {
            corruptedCam.setAttribute('data-static', 'true');
            corruptedCam.textContent = 'ERR // SIGNAL LOST';
            corruptedCam.style.color = '#ff0033';
        }
        
        setInterval(updateClocks, 1000);
        updateClocks();
    }

    // ==========================================
    // HEADER CLOCK
    // ==========================================
    function initHeaderClock() {
        const metaTime = document.querySelector('.meta-item:nth-child(2)');
        
        function updateTime() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-GB');
            metaTime.textContent = `LOCAL: ${timeStr}`;
        }
        
        setInterval(updateTime, 1000);
        updateTime();
    }

    // ==========================================
    // SCROLL REVEAL ANIMATION
    // ==========================================
    function initScrollReveal() {
        const sections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
    }

});