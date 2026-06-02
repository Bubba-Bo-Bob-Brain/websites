// AETERNA CORP // SYSTEM BOOT SEQUENCE
// WARNING: UNAUTHORIZED ACCESS IS A FELONY

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initNavigation();
    initMapInteractions();
    initTerminalTyping();
    initGlitchEffects();
    console.log("%c SYSTEM BREACH DETECTED ", "background: #ff0000; color: #000; font-size: 20px; font-weight: bold;");
    console.log("Connecting to secure server...");
});

// 1. REAL-TIME CLOCK (Military Format)
function initClock() {
    const clockElement = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
        
        clockElement.textContent = `${hours}:${minutes}:${seconds}:${ms}`;
    }
    
    setInterval(updateClock, 50); // High refresh rate for milliseconds
    updateClock();
}

// 2. NAVIGATION & TAB SWITCHING
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => {
                s.classList.remove('active-section');
                s.classList.add('hidden-section');
            });

            // Add active class to clicked
            link.classList.add('active');
            const targetId = link.getAttribute('data-text').toLowerCase();
            
            // Map nav text to section IDs
            let targetSectionId = '';
            if(targetId === 'territory') targetSectionId = 'map-section';
            else if(targetId === 'broadcast') targetSectionId = 'broadcast-section';
            else if(targetId === 'archives') targetSectionId = 'archives-section';
            
            const targetSection = document.getElementById(targetSectionId);
            if(targetSection) {
                targetSection.classList.remove('hidden-section');
                targetSection.classList.add('active-section');
                
                // Trigger specific animations based on section
                if(targetId === 'archives') {
                    initTerminalTyping(); // Re-trigger typing
                }
            }
        });
    });
}

// 3. MAP INTERACTIONS (SVG Hover Effects)
function initMapInteractions() {
    const sectors = document.querySelectorAll('.sector');
    
    sectors.forEach(sector => {
        sector.addEventListener('mouseenter', () => {
            const id = sector.getAttribute('data-id');
            // Simulate data fetch delay
            setTimeout(() => {
                sector.querySelector('.sector-shape').style.filter = "drop-shadow(0 0 15px #ff0000)";
            }, 100);
        });

        sector.addEventListener('mouseleave', () => {
            sector.querySelector('.sector-shape').style.filter = "none";
        });
    });
}

// 4. TERMINAL TYPING EFFECT
function initTerminalTyping() {
    const terminalBody = document.querySelector('.terminal-body');
    if(!terminalBody) return;

    // Clear previous content to reset animation
    const logs = terminalBody.querySelectorAll('.log-entry');
    logs.forEach(log => log.remove());

    const logsData = [
        { time: '10:42:01', type: 'info', text: 'Initializing decryption sequence...' },
        { time: '10:42:03', type: 'warn', text: 'WARNING: UNAUTHORIZED ACCESS DETECTED AT SECTOR 4.' },
        { time: '10:42:05', type: 'err', text: 'ERROR: MEMORY ADDRESS 0x4F2A NOT FOUND.' },
        { time: '10:42:10', type: 'success', text: 'File recovered: "The_Day_The_Lights_Went_Out.pdf"' },
        { time: '10:42:12', type: 'info', text: 'Extracting content...' }
    ];

    let index = 0;

    function typeNextLog() {
        if (index >= logsData.length) {
            // Start the static text content after logs
            setTimeout(() => {
                const contentBox = document.createElement('div');
                contentBox.className = 'content-box';
                contentBox.innerHTML = `
                    <p>They told us the blackout was a technical error. They lied. It was a weapon. The sky didn't just go dark; it screamed.</p>
                    <div class="redaction-bar"></div>
                    <p>We saw the ships descend, silent as ghosts, raining fire on the slums.</p>
                    <div class="redaction-bar" style="width: 60%"></div>
                    <p>...contact the resistance at coordinates [REDACTED]...</p>
                `;
                terminalBody.appendChild(contentBox);
                
                // Add cursor
                const cursor = document.createElement('span');
                cursor.className = 'cursor-blink';
                terminalBody.appendChild(cursor);
                
                // Scroll to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, 500);
            return;
        }

        const log = logsData[index];
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        // Randomize timing for realism
        const delay = Math.random() * 800 + 200;

        setTimeout(() => {
            entry.innerHTML = `
                <span class="timestamp">[${log.time}]</span>
                <span class="${log.type}">${log.text}</span>
            `;
            terminalBody.appendChild(entry);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            index++;
            typeNextLog();
        }, delay);
    }

    typeNextLog();
}

// 5. RANDOM GLITCH EFFECTS ON TEXT
function initGlitchEffects() {
    const titles = document.querySelectorAll('.propaganda-title, .logo-text');
    
    titles.forEach(title => {
        // Randomly trigger a glitch
        setInterval(() => {
            if(Math.random() > 0.9) {
                title.style.transform = `translate(${Math.random()*4 - 2}px, ${Math.random()*4 - 2}px)`;
                setTimeout(() => {
                    title.style.transform = 'translate(0,0)';
                }, 50);
            }
        }, 2000);
    });
}