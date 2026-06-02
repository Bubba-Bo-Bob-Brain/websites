/**
 * MUTATION REGISTRY // SYSTEM SCRIPTS
 * Handles interactivity, data filtering, glitch effects, and terminal simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all subsystems
    initEntranceSequence();
    initTypingEffect();
    initFilterSystem();
    initSortSystem();
    initGlitchMatrix();
    initInteractiveCards();
    initParallaxDNA();
});

// =========================================================
// ENTRANCE SEQUENCE
// Staggered reveal of character cards
// =========================================================
function initEntranceSequence() {
    const cards = document.querySelectorAll('.character-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 120}ms`;
    });
}

// =========================================================
// TYPING EFFECT
// Simulates terminal text entry in the header
// =========================================================
function initTypingEffect() {
    const textElement = document.querySelector('.typing-text');
    const originalText = textElement.textContent;
    textElement.textContent = '';
    
    let charIndex = 0;
    const typeSpeed = 50;
    
    function typeChar() {
        if (charIndex < originalText.length) {
            textElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, typeSpeed + Math.random() * 30);
        }
    }
    
    setTimeout(typeChar, 1000);
}

// =========================================================
// FILTER SYSTEM
// Filters characters by faction allegiance
// =========================================================
function initFilterSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.character-card');
    const statusText = document.querySelector('.status-text');
    const statusIndicator = document.querySelector('.status-indicator');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            let visibleCount = 0;
            
            // Flash status indicator
            statusIndicator.style.background = '#ff003c';
            setTimeout(() => statusIndicator.style.background = '', 300);
            
            // Apply filter
            cards.forEach(card => {
                const faction = card.getAttribute('data-faction');
                
                if (filterValue === 'all' || faction === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'card-enter 0.5s var(--ease-out) forwards';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.style.animation = 'none';
                }
            });
            
            // Update status text
            statusText.textContent = `ONLINE // ${visibleCount} ENTRIES MATCHING "${filterValue.toUpperCase()}"`;
            
            // Log to terminal
            updateTerminalLog(`FILTER APPLIED: ${filterValue.toUpperCase()} // ${visibleCount} RECORDS FOUND`, 'success');
        });
    });
}

// =========================================================
// SORT SYSTEM
// Reorders characters based on selected criteria
// =========================================================
function initSortSystem() {
    const sortButtons = document.querySelectorAll('.sort-btn');
    const grid = document.getElementById('characterGrid');
    
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            sortButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const sortBy = button.getAttribute('data-sort');
            const cards = Array.from(grid.querySelectorAll('.character-card'));
            
            // Flash indicator
            const statusIndicator = document.querySelector('.status-indicator');
            statusIndicator.style.background = '#00f0ff';
            setTimeout(() => statusIndicator.style.background = '', 300);
            
            // Sort logic
            cards.sort((a, b) => {
                switch(sortBy) {
                    case 'name':
                        return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                    case 'mutation':
                        return parseInt(b.getAttribute('data-mutation')) - parseInt(a.getAttribute('data-mutation'));
                    case 'contamination':
                        return parseInt(b.getAttribute('data-contamination')) - parseInt(a.getAttribute('data-contamination'));
                    case 'faction':
                        return a.getAttribute('data-faction').localeCompare(b.getAttribute('data-faction'));
                    default:
                        return 0;
                }
            });
            
            // Re-append with brief fade effect
            grid.style.opacity = '0.3';
            setTimeout(() => {
                cards.forEach(card => grid.appendChild(card));
                grid.style.opacity = '1';
                updateTerminalLog(`DATABASE REINDEXED: SORT_BY=${sortBy.toUpperCase()}`, 'info');
            }, 200);
        });
    });
}

// =========================================================
// GLITCH MATRIX
// Random text corruption effects for atmosphere
// =========================================================
function initGlitchMatrix() {
    const glitchChars = '@#$%&*!?<>[]{}~';
    const names = document.querySelectorAll('.character-name');
    
    function randomGlitch() {
        // Pick random character name
        const target = names[Math.floor(Math.random() * names.length)];
        const originalText = target.getAttribute('data-text');
        
        // Corrupt text
        let corrupted = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() > 0.5) {
                corrupted += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                corrupted += originalText[i];
            }
        }
        
        target.textContent = corrupted;
        target.style.color = '#ff003c';
        
        // Restore after delay
        setTimeout(() => {
            target.textContent = originalText;
            target.style.color = '';
        }, 150);
        
        // Schedule next glitch
        setTimeout(randomGlitch, 2000 + Math.random() * 4000);
    }
    
    // Start glitch cycle
    setTimeout(randomGlitch, 3000);
    
    // Glitch title occasionally
    const title = document.querySelector('.site-title');
    const originalTitle = title.getAttribute('data-text');
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            let corrupted = '';
            for (let i = 0; i < originalTitle.length; i++) {
                corrupted += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            title.textContent = corrupted;
            setTimeout(() => title.textContent = originalTitle, 100);
        }
    }, 5000);
}

// =========================================================
// INTERACTIVE CARDS
// Hover effects and data readout simulation
// =========================================================
function initInteractiveCards() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add scanning sound effect simulation (visual only)
            const scanline = card.querySelector('.portrait-scanline');
            if (scanline) {
                scanline.style.background = 'linear-gradient(180deg, transparent, rgba(255, 0, 60, 0.4), transparent)';
                scanline.style.animationDuration = '1s';
            }
            
            // Log scan to terminal
            const name = card.querySelector('.character-name').getAttribute('data-text');
            const mutation = card.getAttribute('data-mutation');
            updateTerminalLog(`SCANNING SUBJECT: ${name} // MUTATION: ${mutation}%`, 'warning');
        });
        
        card.addEventListener('mouseleave', () => {
            const scanline = card.querySelector('.portrait-scanline');
            if (scanline) {
                scanline.style.background = '';
                scanline.style.animationDuration = '';
            }
        });
    });
}

// =========================================================
// PARALLAX DNA
// Subtle movement of DNA strands based on scroll/mouse
// =========================================================
function initParallaxDNA() {
    const dnaLeft = document.querySelector('.dna-left');
    const dnaRight = document.querySelector('.dna-right');
    
    if (!dnaLeft || !dnaRight) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    });
    
    function animateDNA() {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        dnaLeft.style.transform = `translateX(${targetX * 0.5}px) translateY(${targetY}px)`;
        dnaRight.style.transform = `translateX(${-targetX * 0.5}px) translateY(${targetY * 0.8}px)`;
        
        requestAnimationFrame(animateDNA);
    }
    
    animateDNA();
}

// =========================================================
// TERMINAL LOGGER
// Updates the footer terminal with system events
// =========================================================
function updateTerminalLog(message, type = 'info') {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const p = document.createElement('p');
    p.innerHTML = `<span class="prompt">[${timestamp}]</span> <span class="${type === 'warning' ? 'cmd-output warning' : 'cmd-output'}">${message}</span>`;
    
    // Insert before the blinking cursor line
    const cursorLine = terminalBody.querySelector('p:last-child');
    terminalBody.insertBefore(p, cursorLine);
    
    // Keep log from growing too large
    const lines = terminalBody.querySelectorAll('p');
    if (lines.length > 8) {
        lines[1].remove(); // Remove first log line, keep header
    }
}