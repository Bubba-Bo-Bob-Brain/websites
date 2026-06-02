// scripts.js

// Code Rain Effect
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('code-rain');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Characters for the rain
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*<>{}[]";
    const charArray = chars.split("");
    
    // Font size and columns
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Array to track drop positions
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
    
    // Draw function
    function draw() {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(5, 5, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px 'Share Tech Mono'`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Reset drop if it reaches bottom or randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Animation loop
    setInterval(draw, 33);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Terminal functionality
    const commandInput = document.getElementById('command-input');
    const terminalBody = document.querySelector('.terminal-body');
    
    // Focus input on click anywhere in terminal
    document.querySelector('.terminal-container').addEventListener('click', function() {
        commandInput.focus();
    });
    
    // Handle command input
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = commandInput.textContent.trim().toLowerCase();
            
            // Clear input
            commandInput.textContent = '';
            
            // Process command
            processCommand(command);
        }
    });
    
    // Command processing function
    function processCommand(cmd) {
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        
        let response = '';
        
        switch(cmd) {
            case 'help':
                response = '> Available commands: help, status, clear, mission, access';
                break;
            case 'status':
                response = '> System operational. All nodes active.';
                break;
            case 'clear':
                terminalBody.innerHTML = `
                    <div class="terminal-line">> Initializing neural link...</div>
                    <div class="terminal-line">> Establishing secure connection...</div>
                    <div class="terminal-line">> Access granted to NEONVECTOR mainframe</div>
                    <div class="terminal-line">> Welcome back, Operator_<span class="cursor">█</span></div>
                    <div class="terminal-line">> Current mission status: <span class="status-active">ACTIVE</span></div>
                    <div class="terminal-line">> System integrity: <span class="integrity-high">98.7%</span></div>
                    <div class="terminal-line">> Last login: <span class="timestamp">${new Date().toLocaleString()}</span></div>
                    <div class="terminal-line prompt">> <span class="command-input" id="command-input" contenteditable="true"></span><span class="cursor blink">█</span></div>
                `;
                // Reattach event listeners
                setTimeout(() => {
                    document.getElementById('command-input').addEventListener('keydown', function(e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const command = this.textContent.trim().toLowerCase();
                            this.textContent = '';
                            processCommand(command);
                        }
                    });
                }, 100);
                return;
            case 'mission':
                response = '> Mission: Infiltrate Arasaka Corp. mainframe and extract Project Eden data.';
                break;
            case 'access':
                response = '> Accessing encrypted database... [██████████] 100% complete';
                break;
            case '':
                response = '> ';
                break;
            default:
                response = `> Command not recognized: ${cmd}. Type 'help' for available commands.`;
        }
        
        newLine.innerHTML = response;
        terminalBody.insertBefore(newLine, document.querySelector('.prompt').parentElement);
        
        // Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    // Initial focus on terminal
    commandInput.focus();
    
    // Glitch effect on title periodically
    const mainTitle = document.querySelector('.main-title');
    mainTitle.setAttribute('data-text', mainTitle.textContent);
    
    setInterval(() => {
        mainTitle.classList.add('glitch-text');
        setTimeout(() => {
            mainTitle.classList.remove('glitch-text');
        }, 200);
    }, 5000);
    
    // Feature card animations
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Navigation interaction
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Add pulse effect to clicked link
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);
        });
    });
});