/**
 * VOID_PROTOCOL // SYSTEM_KERNEL
 * An interactive digital decay engine.
 */

const System = {
    stability: 100,
    isCoreFound: false,
    activeWindows: 0,
    
    // Data for the "Labyrinth" sectors
    sectors: {
        'sector-01': {
            title: 'RECOVERY_LOGS.txt',
            content: `
                <div class="glitch-text" data-text="LOG_ENTRY_092">LOG_ENTRY_092</div>
                <p>Timestamp: [REDACTED]</p>
                <p>System integrity falling at a rate of ${Math.floor(Math.random() * 100)}% per second.</p>
                <p>Attempting to reconstruct sector 0x44A...</p>
                <p class="error">CRITICAL: Memory leak detected in address 0x000F21</p>
                <p>.........................................................</p>
                <p>The data is... it's not just bits. It's memories.</p>
            `
        },
        'sector-02': {
            title: 'DATABASE_LEAK_09.db',
            content: `
                <table style="width:100%; border-collapse: collapse; font-size: 0.7rem;">
                    <tr style="border-bottom: 1px solid #444;">
                        <th>ID</th><th>USER_HASH</th><th>STATUS</th>
                    </tr>
                    <tr><td>001</td><td>a8f2...e91</td><td><span class="error">VOID</span></td></tr>
                    <tr><td>002</td><td>bc31...002</td><td>ACTIVE</td></tr>
                    <tr><td>003</td><td>ff12...99a</td><td><span class="error">LOST</span></td></tr>
                    <tr><td>004</td><td>ee44...12c</td><td>CORRUPT</td></tr>
                </table>
                <div style="margin-top: 15px; height: 5px; background: #222; width: 100%;">
                    <div id="fake-progress" style="height:100%; width: 0%; background: var(--accent-cyan); transition: width 0.5s;"></div>
                </div>
                <p style="font-size: 0.6rem; margin-top: 5px;">DUMPING SECTOR...</p>
            `
        },
        'sector-03': {
            title: 'FATAL_ERROR',
            content: `
                <div style="text-align: center; padding: 20px;">
                    <h2 style="color: var(--error-red); font-size: 1.5rem;">:(</h2>
                    <p>Your system has encountered a fatal error.</p>
                    <p style="font-size: 0.7rem; margin-top: 10px;">STOP_CODE: 0x000000EF</p>
                    <button id="secret-repair-btn" style="margin-top: 20px; background: none; border: 1px solid #444; color: #888; cursor: pointer; font-size: 0.6rem;">RUN REPAIR?</button>
                </div>
            `
        },
        'sector-04': {
            title: 'LOST_ASSETS',
            content: `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="width: 100%; height: 60px; background: #222; filter: contrast(200%) grayscale(1); opacity: 0.5;"></div>
                    <div style="width: 100%; height: 60px; background: #333; filter: invert(1); opacity: 0.3;"></div>
                    <div id="hidden-pixel" style="width: 10px; height: 10px; background: transparent; cursor: pointer; margin: auto;"></div>
                    <div style="width: 100%; height: 60px; background: #111; border: 1px dashed #444;"></div>
                </div>
                <p style="font-size: 0.6rem; text-align: center; margin-top: 10px;">[IMAGE_CORRUPTION_DETECTED]</p>
            `
        }
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initIcons();
    initChaosEngine();
    initTerminal();
    
    // Reset button for the core
    document.getElementById('reset-btn').addEventListener('click', () => location.reload());
});

// --- CORE FUNCTIONS ---

function initClock() {
    const clockEl = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clockEl.textContent = now.toTimeString().split(' ')[0];
    }, 1000);
}

function initTerminal() {
    const terminal = document.querySelector('.terminal-dock');
    const log = (msg, type = '') => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt">></span><span class="command-output ${type}">${msg}</span>`;
        terminal.appendChild(line);
        // Auto-scroll terminal
        terminal.scrollTop = terminal.scrollHeight;
        
        // Keep terminal clean
        if (terminal.children.length > 10) terminal.removeChild(terminal.firstChild);
    };
    System.log = log;
    System.log("SYSTEM_BOOT_SUCCESSFUL...");
    System.log("KERNEL_READY...", "terminal-green");
}

function initIcons() {
    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const target = icon.getAttribute('data-target');
            System.log(`OPENING: ${target.toUpperCase()}`);
            createWindow(target);
        });
        // Keyboard accessibility
        icon.addEventListener('keypress', (e) => { if(e.key === 'Enter') icon.click(); });
    });
}

// --- WINDOW MANAGEMENT ---

function createWindow(sectorKey) {
    const sector = System.sectors[sectorKey];
    if (!sector) return;

    const windowLayer = document.getElementById('window-layer');
    const win = document.createElement('div');
    win.className = 'window';
    
    // Randomize position slightly for "messy" feel
    const posX = 50 + (Math.random() * 100);
    const posY = 50 + (Math.random() * 100);
    win.style.left = `${posX}px`;
    win.style.top = `${posY}px`;

    win.innerHTML = `
        <div class="window-header">
            <span class="window-title">${sector.title}</span>
            <div class="window-controls">
                <button class="control-btn close"></button>
            </div>
        </div>
        <div class="window-content">
            ${sector.content}
        </div>
    `;

    // Close functionality
    win.querySelector('.close').addEventListener('click', () => {
        win.remove();
        System.activeWindows--;
        System.log("PROCESS_TERMINATED");
    });

    // Dragging functionality (lightweight)
    makeDraggable(win);

    windowLayer.appendChild(win);
    System.activeWindows++;

    // Sector-specific logic
    if (sectorKey === 'sector-02') {
        startFakeLoading();
    }
    
    if (sectorKey === 'sector-03') {
        setupRepairButton();
    }

    if (sectorKey === 'sector-04') {
        setupHiddenPixel();
    }
}

function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = el.querySelector('.window-header');
    
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        // Bring to front
        document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1);
        el.style.zIndex = 100;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- SECTOR SPECIFIC LOGIC ---

function startFakeLoading() {
    const bar = document.getElementById('fake-progress');
    if (!bar) return;
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 99) {
            clearInterval(interval);
            System.log("DATA_DUMP_INTERRUPTED", "error");
            // Glitch effect on the bar
            bar.style.width = '40%';
            bar.style.background = 'var(--error-red)';
        } else {
            width += Math.random() * 5;
            bar.style.width = width + '%';
        }
    }, 200);
}

let repairAttempts = 0;
function setupRepairButton() {
    const btn = document.getElementById('secret-repair-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        repairAttempts++;
        System.log(`REPAIR_ATTEMPT_${repairAttempts}...`);
        if (repairAttempts >= 5) {
            triggerCore();
        }
    });
}

function setupHiddenPixel() {
    const pixel = document.getElementById('hidden-pixel');
    if (!pixel) return;
    pixel.addEventListener('click', () => {
        System.log("UNEXPECTED_DATA_STREAM_DETECTED", "terminal-green");
        triggerCore();
    });
}

// --- CHAOS ENGINE ---

function initChaosEngine() {
    // Randomly trigger visual glitches
    setInterval(() => {
        const rand = Math.random();
        if (rand > 0.85) triggerGlitchEffect();
        if (rand > 0.95) triggerPopUp();
    }, 4000);
}

function triggerGlitchEffect() {
    const body = document.body;
    body.classList.add('glitch-active');
    
    // Temporary screen shake
    const desktop = document.getElementById('desktop');
    desktop.style.transform = `translate(${Math.random()*10-5}px, ${Math.random()*10-5}px)`;
    
    setTimeout(() => {
        body.classList.remove('glitch-active');
        desktop.style.transform = 'translate(0,0)';
    }, 150);
}

function triggerPopUp() {
    const glitchContainer = document.getElementById('glitch-overlay-container');
    const popup = document.createElement('div');
    popup.className = 'window';
    popup.style.left = Math.random() * 80 + '%';
    popup.style.top = Math.random() * 80 + '%';
    popup.style.width = '200px';
    popup.style.zIndex = '1000';
    popup.innerHTML = `
        <div class="window-header">
            <span class="window-title">ERR_VOID</span>
            <button class="control-btn close"></button>
        </div>
        <div class="window-content" style="font-size: 0.6rem; color: var(--error-red);">
            SEGMENTATION FAULT: 0x000000
        </div>
    `;
    popup.querySelector('.close').onclick = () => popup.remove();
    glitchContainer.appendChild(popup);
    
    // Auto-remove popup
    setTimeout(() => popup.remove(), 3000);
}

// --- THE TRANSITION ---

function triggerCore() {
    if (System.isCoreFound) return;
    System.isCoreFound = true;
    
    System.log("!!! CORE_REACHED !!!", "terminal-green");
    
    const core = document.getElementById('the-core');
    core.classList.remove('hidden');
    
    // Fade out the entire OS
    document.getElementById('os-container').style.transition = 'opacity 3s';
    document.getElementById('os-container').style.opacity = '0';
    
    setTimeout(() => {
        document.getElementById('os-container').style.display = 'none';
    }, 3000);
}