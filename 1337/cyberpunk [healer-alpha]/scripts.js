// ============================================
// NEXUS_H4CK - Cybernetic Liberation Front
// Interactive Cyberpunk Experience
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMatrixRain();
    initGlitchEffects();
    initTypewriter();
    initCounters();
    initTerminal();
    initMainTerminal();
    initTime();
    initUptime();
    initNavigation();
    initFormEncryption();
    initDataVisualization();
    initToolButtons();
    initScrollAnimations();
    initAudio();
});

// ============================================
// MATRIX RAIN EFFECT
// ============================================
function initMatrixRain() {
    const canvas = document.getElementById('matrixRain');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Characters for matrix rain (mix of katakana, numbers, and symbols)
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Array for drops - one per column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    // Draw matrix rain
    function draw() {
        // Semi-transparent black background for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // x = i * fontSize, y = drops[i] * fontSize
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Send the drop back to top randomly after it crosses the screen
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Animation loop
    setInterval(draw, 50);
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================
// GLITCH EFFECTS
// ============================================
function initGlitchEffects() {
    // Random glitch effect on elements with glitch class
    const glitchElements = document.querySelectorAll('.glitch-logo, .glitch-text');
    
    setInterval(() => {
        glitchElements.forEach(el => {
            if (Math.random() > 0.9) {
                el.classList.add('glitching');
                setTimeout(() => {
                    el.classList.remove('glitching');
                }, 200);
            }
        });
    }, 3000);
    
    // Add glitch class styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .glitching {
            animation: glitchEffect 0.3s infinite !important;
        }
        
        .glitching::before,
        .glitching::after {
            animation: glitchEffect 0.3s infinite !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
function initTypewriter() {
    const text = "CYBERNETIC_LIBERATION_FRONT";
    const typingElement = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    
    let index = 0;
    let isTyping = true;
    
    function type() {
        if (isTyping && index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        } else if (!isTyping && index > 0) {
            typingElement.textContent = text.substring(0, index - 1);
            index--;
            setTimeout(type, 50);
        } else {
            isTyping = !isTyping;
            setTimeout(type, 1000);
        }
    }
    
    type();
}

// ============================================
// COUNTER ANIMATIONS
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// TERMINAL FUNCTIONALITY
// ============================================
function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.querySelector('.terminal-output');
    
    const commands = {
        'help': () => 'Available commands: help, status, hack, clear',
        'status': () => 'System status: ONLINE\nSecurity: ENCRYPTED\nNetwork: STABLE',
        'hack': () => {
            const messages = [
                'Initiating hack sequence...',
                'Bypassing firewall...',
                'Injecting payload...',
                'Access granted. Welcome, operator.',
                'Downloading sensitive data...',
                'Covering tracks...',
                'Hack complete. No traces left.'
            ];
            
            let delay = 0;
            messages.forEach(msg => {
                setTimeout(() => {
                    addTerminalLine(msg, terminalOutput);
                }, delay);
                delay += 1000;
            });
            
            return 'Executing hack protocol...';
        },
        'clear': () => {
            terminalOutput.innerHTML = '';
            return null;
        }
    };
    
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            
            addTerminalLine(`root@nexus:~$ ${command}`, terminalOutput);
            
            if (commands[command]) {
                const result = commands[command]();
                if (result) {
                    setTimeout(() => {
                        addTerminalLine(result, terminalOutput);
                    }, 500);
                }
            } else if (command) {
                setTimeout(() => {
                    addTerminalLine(`Command not found: ${command}`, terminalOutput);
                }, 500);
            }
            
            // Scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
    
    // Focus terminal on click
    document.querySelector('.terminal-body').addEventListener('click', () => {
        terminalInput.focus();
    });
}

function addTerminalLine(text, container) {
    const line = document.createElement('div');
    line.className = 'terminal-output';
    line.innerHTML = `<p>${text}</p>`;
    container.appendChild(line);
}

// ============================================
// MAIN TERMINAL FUNCTIONALITY
// ============================================
function initMainTerminal() {
    const mainTerminalInput = document.getElementById('mainTerminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    
    const mainCommands = {
        'help': () => {
            return `
╔══════════════════════════════════════════════════╗
║             AVAILABLE COMMANDS                    ║
╠══════════════════════════════════════════════════╣
║ help      - Display this message                 ║
║ scan      - Network vulnerability scan           ║
║ breach    - Execute breach protocol               ║
║ data      - Show live data streams                ║
║ status    - Show system status                    ║
║ whoami    - Display current user info             ║
║ matrix    - Toggle matrix rain effect             ║
║ clear     - Clear terminal                        ║
║ exit      - Close secure session                  ║
╚══════════════════════════════════════════════════╝
            `;
        },
        'scan': () => {
            const ports = [21, 22, 80, 443, 3306, 5432, 8080];
            let output = 'Scanning network for vulnerabilities...\n\n';
            
            ports.forEach(port => {
                const status = Math.random() > 0.3 ? 'OPEN' : 'CLOSED';
                const vulnerability = status === 'OPEN' ? 
                    ` (Vulnerability level: ${Math.floor(Math.random() * 10)}/10)` : '';
                output += `Port ${port}: ${status}${vulnerability}\n`;
            });
            
            output += '\nScan complete. 4 vulnerabilities detected.';
            return output;
        },
        'breach': () => {
            return `
Initiating breach protocol...
[+] Identifying target systems...
[+] Deploying quantum decryption...
[+] Bypassing security layers...
[+] Gaining root access...
[+] Establishing persistence...
[+] Covering tracks...
[+] Breach successful!

Access level: ROOT
System: NEXUS_CORE
User: administrator
            `;
        },
        'data': () => {
            return `
Live Data Streams:
=================
Stream 1: Financial records (1.2TB) - ACTIVE
Stream 2: Personal communications (800GB) - ACTIVE  
Stream 3: Classified documents (2.5TB) - PAUSED
Stream 4: Surveillance footage (4TB) - ACTIVE

Total data transfer: 8.5TB
Bandwidth usage: 85%
Encryption: AES-256
            `;
        },
        'status': () => {
            return `
System Status:
==============
Uptime: ${document.getElementById('uptime').textContent}
CPU Usage: ${Math.floor(Math.random() * 30) + 10}%
Memory: ${Math.floor(Math.random() * 40) + 30}%
Network: STABLE
Security: ENCRYPTED
Threat Level: ${document.getElementById('threatLevel').textContent}
            `;
        },
        'whoami': () => {
            return `
User Information:
=================
Codename: GHOST_RIDER
Access Level: 5 (Admin)
Last Login: ${new Date().toLocaleString()}
IP: 192.168.1.${Math.floor(Math.random() * 255)}
Location: UNKNOWN (7 proxies)
Status: ACTIVE
            `;
        },
        'matrix': () => {
            const matrixCanvas = document.getElementById('matrixRain');
            const currentOpacity = parseFloat(matrixCanvas.style.opacity || '0.05');
            matrixCanvas.style.opacity = currentOpacity === 0.05 ? '0.15' : '0.05';
            return `Matrix rain effect ${currentOpacity === 0.05 ? 'intensified' : 'dimmed'}.`;
        },
        'clear': () => {
            terminalOutput.innerHTML = '';
            return null;
        },
        'exit': () => {
            return 'Secure session terminated. Connection closed.';
        }
    };
    
    mainTerminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = mainTerminalInput.value.trim().toLowerCase();
            mainTerminalInput.value = '';
            
            // Add command to terminal
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-line';
            commandLine.innerHTML = `
                <span class="terminal-prompt">root@nexus-core:~#</span>
                <span class="terminal-command">${command}</span>
            `;
            terminalOutput.appendChild(commandLine);
            
            // Process command
            if (mainCommands[command]) {
                const result = mainCommands[command]();
                if (result) {
                    setTimeout(() => {
                        const outputDiv = document.createElement('div');
                        outputDiv.className = 'terminal-output';
                        outputDiv.innerHTML = `<p>${result.replace(/\n/g, '<br>')}</p>`;
                        terminalOutput.appendChild(outputDiv);
                        terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    }, 300);
                }
            } else if (command) {
                setTimeout(() => {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'terminal-output';
                    errorDiv.innerHTML = `<p>bash: ${command}: command not found</p>`;
                    terminalOutput.appendChild(errorDiv);
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }, 300);
            }
            
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
    
    // Focus terminal on click
    document.querySelector('.large-terminal').addEventListener('click', () => {
        mainTerminalInput.focus();
    });
}

// ============================================
// TIME DISPLAY
// ============================================
function initTime() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        document.getElementById('currentTime').textContent = timeString;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// ============================================
// UPTIME COUNTER
// ============================================
function initUptime() {
    const uptimeElement = document.getElementById('uptime');
    let seconds = 0;
    
    function updateUptime() {
        seconds++;
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        
        uptimeElement.textContent = `${hrs}:${mins}:${secs}`;
    }
    
    setInterval(updateUptime, 1000);
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.cyber-nav a');
    const navIndicator = document.querySelector('.nav-indicator');
    
    function updateIndicator(element) {
        navIndicator.style.width = `${element.offsetWidth}px`;
        navIndicator.style.left = `${element.offsetLeft}px`;
    }
    
    // Initial position
    updateIndicator(document.querySelector('.cyber-nav a.active'));
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Update indicator
            updateIndicator(link);
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
        
        link.addEventListener('mouseenter', () => {
            updateIndicator(link);
        });
        
        link.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.cyber-nav a.active');
            updateIndicator(activeLink);
        });
    });
    
    // Update active section on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                updateIndicator(link);
            }
        });
    });
}

// ============================================
// FORM ENCRYPTION EFFECT
// ============================================
function initFormEncryption() {
    const encryptBtn = document.getElementById('encryptBtn');
    const messageField = document.getElementById('message');
    
    encryptBtn.addEventListener('click', () => {
        const originalText = messageField.value;
        let encryptedText = '';
        
        // Simple "encryption" animation
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        let iterations = 0;
        
        const encryptInterval = setInterval(() => {
            encryptedText = originalText.split('').map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            
            messageField.value = encryptedText;
            iterations += 1/3;
            
            if (iterations >= originalText.length) {
                clearInterval(encryptInterval);
                messageField.value = btoa(originalText); // Base64 encode
            }
        }, 30);
    });
    
    // Form submission
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const codename = document.getElementById('codename').value;
        const message = document.getElementById('message').value;
        
        if (codename && message) {
            // Simulate transmission
            const transmitBtn = document.querySelector('.cyber-btn.primary');
            const originalText = transmitBtn.textContent;
            
            transmitBtn.textContent = 'TRANSMITTING...';
            transmitBtn.disabled = true;
            
            setTimeout(() => {
                transmitBtn.textContent = 'TRANSMITTED ✓';
                transmitBtn.style.backgroundColor = 'rgba(0, 255, 65, 0.2)';
                
                // Reset form
                setTimeout(() => {
                    document.getElementById('contactForm').reset();
                    transmitBtn.textContent = originalText;
                    transmitBtn.disabled = false;
                    transmitBtn.style.backgroundColor = '';
                }, 2000);
            }, 1500);
        }
    });
}

// ============================================
// DATA VISUALIZATION
// ============================================
function initDataVisualization() {
    const canvas = document.getElementById('dataStreamChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 300;
    
    // Data points
    let dataPoints = [];
    for (let i = 0; i < 50; i++) {
        dataPoints.push(Math.random() * 200 + 50);
    }
    
    // Animation variables
    let animationFrame;
    let offset = 0;
    
    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Vertical grid lines
        for (let x = 0; x < canvas.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Draw data stream
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        
        for (let i = 0; i < dataPoints.length; i++) {
            const x = (i / (dataPoints.length - 1)) * canvas.width;
            const y = canvas.height - dataPoints[i];
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#00ff41';
        for (let i = 0; i < dataPoints.length; i++) {
            const x = (i / (dataPoints.length - 1)) * canvas.width;
            const y = canvas.height - dataPoints[i];
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Animate data
        offset += 0.5;
        if (offset >= dataPoints.length) {
            offset = 0;
        }
        
        // Shift data points
        dataPoints.shift();
        dataPoints.push(Math.random() * 200 + 50);
        
        // Update metrics with random values
        if (Math.random() > 0.95) {
            updateMetrics();
        }
        
        animationFrame = requestAnimationFrame(drawChart);
    }
    
    function updateMetrics() {
        const networkTraffic = (Math.random() * 3 + 1).toFixed(1);
        const activeBreaches = Math.floor(Math.random() * 50) + 30;
        
        document.getElementById('networkTraffic').textContent = `${networkTraffic} TB/s`;
        document.getElementById('activeBreaches').textContent = activeBreaches;
        
        // Update progress bars
        const progressBars = document.querySelectorAll('.metric-progress');
        progressBars.forEach(bar => {
            const currentWidth = parseFloat(bar.style.width);
            const newWidth = Math.max(30, Math.min(95, currentWidth + (Math.random() * 10 - 5)));
            bar.style.width = `${newWidth}%`;
        });
    }
    
    // Start animation
    drawChart();
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.clientWidth;
    });
    
    // Update threat level randomly
    setInterval(() => {
        const threatLevels = ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'SEVERE'];
        const randomLevel = threatLevels[Math.floor(Math.random() * threatLevels.length)];
        const threatElement = document.getElementById('threatLevel');
        
        threatElement.textContent = randomLevel;
        threatElement.className = 'status-value';
        
        if (randomLevel === 'LOW') threatElement.classList.add('secure');
        else if (randomLevel === 'MODERATE') threatElement.classList.add('warning');
        else if (randomLevel === 'ELEVATED' || randomLevel === 'HIGH') threatElement.classList.add('warning');
        else if (randomLevel === 'SEVERE') {
            threatElement.classList.add('warning');
            threatElement.style.animation = 'pulse 0.5s infinite';
        }
    }, 10000);
}

// ============================================
// TOOL BUTTONS
// ============================================
function initToolButtons() {
    const toolButtons = document.querySelectorAll('.tool-card .cyber-btn');
    
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const toolCard = this.closest('.tool-card');
            const toolName = toolCard.querySelector('.tool-name').textContent;
            
            // Button animation
            const originalText = this.textContent;
            this.textContent = 'INITIALIZING...';
            this.disabled = true;
            
            // Create terminal output
            const terminalOutput = document.querySelector('.terminal-output');
            const initMessage = document.createElement('div');
            initMessage.className = 'terminal-output';
            initMessage.innerHTML = `<p>[+] Initializing ${toolName}...</p>`;
            terminalOutput.appendChild(initMessage);
            
            setTimeout(() => {
                const successMessage = document.createElement('div');
                successMessage.className = 'terminal-output';
                successMessage.innerHTML = `<p>[+] ${toolName} successfully initialized. Ready for deployment.</p>`;
                terminalOutput.appendChild(successMessage);
                
                this.textContent = 'ACTIVE ✓';
                this.style.backgroundColor = 'rgba(0, 255, 65, 0.2)';
                this.style.borderColor = '#00ff41';
                
                // Scroll terminal to bottom
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                
                // Reset button after delay
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.backgroundColor = '';
                    this.style.borderColor = '';
                }, 3000);
            }, 1500);
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const animateElements = document.querySelectorAll('.tool-card, .metric-card, .contact-item, .section-header');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// AUDIO (Optional ambient sound)
// ============================================
function initAudio() {
    // Create audio context for ambient sounds
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        
        // Resume audio context on user interaction
        document.body.addEventListener('click', () => {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }, { once: true });
        
        // Create ambient hum
        function createAmbientSound() {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(60, audioCtx.currentTime); // 60Hz hum
            
            gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            
            // Fade in and out
            gainNode.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 2);
            
            return { oscillator, gainNode };
        }
        
        // Start ambient sound after user interaction
        let ambientSound = null;
        document.body.addEventListener('click', () => {
            if (!ambientSound) {
                ambientSound = createAmbientSound();
                
                // Fade out after 30 seconds
                setTimeout(() => {
                    if (ambientSound) {
                        ambientSound.gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);
                        setTimeout(() => {
                            ambientSound.oscillator.stop();
                            ambientSound = null;
                        }, 2000);
                    }
                }, 30000);
            }
        }, { once: true });
        
    } catch (e) {
        console.log('Audio not supported');
    }
}

// ============================================
// SYSTEM STATUS SIMULATION
// ============================================
setInterval(() => {
    // Randomly update system status
    const statuses = ['ONLINE', 'ACTIVE', 'SECURE', 'MONITORING'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const systemStatus = document.getElementById('systemStatus');
    if (systemStatus && Math.random() > 0.8) {
        systemStatus.textContent = randomStatus;
        systemStatus.style.color = '#00ffff';
        
        setTimeout(() => {
            systemStatus.style.color = '';
        }, 1000);
    }
}, 8000);

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+C to clear terminal
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            terminalOutput.innerHTML = '';
        }
    }
    
    // Ctrl+Shift+T to focus terminal
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        const terminalInput = document.getElementById('mainTerminalInput');
        if (terminalInput) {
            terminalInput.focus();
        }
    }
    
    // Escape to close any open modals (if we had them)
    if (e.key === 'Escape') {
        document.activeElement.blur();
    }
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗   ║
║   ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝   ║
║   ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗   ║
║   ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║   ║
║   ██║ ╚████║███████╗██╔╝ ╚██╗╚██████╔╝███████║   ║
║   ╚═╝  ╚═══╝╚══════╝╚═╝   ╚═╝ ╚═════╝ ╚══════╝  ║
║                                                  ║
║        NEXUS_H4CK SYSTEM CONSOLE v7.3.9          ║
║   "Information wants to be free"                 ║
║                                                  ║
║   Welcome to the digital underground.            ║
║   You've found the hidden console.               ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);

console.log('%c[!] Pro tip: Use Ctrl+Shift+T to focus the terminal', 'color: #00ff41; font-weight: bold;');
console.log('%c[!] Use Ctrl+Shift+C to clear the terminal', 'color: #00ff41; font-weight: bold;');

// ============================================
// INITIALIZE ON LOAD
// ============================================
window.addEventListener('load', () => {
    // Add loaded class for any entrance animations
    document.body.classList.add('loaded');
    
    // Focus terminal after a delay
    setTimeout(() => {
        const terminalInput = document.getElementById('terminalInput');
        if (terminalInput) {
            terminalInput.focus();
        }
    }, 1000);
});