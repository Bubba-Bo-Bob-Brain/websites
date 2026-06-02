/**
 * VOID-SHELL OS Core Logic
 * Version: 4.0.2
 * Description: Terminal Simulation and Interface Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
});

// --- 1. BOOT SEQUENCE ---
async function initBootSequence() {
    const bootLog = document.getElementById('boot-log');
    const bootScreen = document.getElementById('boot-screen');
    const mainInterface = document.getElementById('main-interface');

    const lines = [
        "VOID-SHELL KERNEL v4.0.2 LOADING...",
        "CHECKING MEMORY INTEGRITY... [OK]",
        "ESTABLISHING SECURE TUNNEL... [OK]",
        "BYPASSING FIREWALL... [SUCCESS]",
        "MOUNTING ENCRYPTED VOLUME /dev/void0... [OK]",
        "LOADING NETWORK TOPOLOGY...",
        "INITIALIZING NEURAL INTERFACE... [OK]",
        "ACCESS GRANTED: UID_ADMIN_ROOT",
        "-----------------------------------",
        "WELCOME BACK, OPERATOR."
    ];

    for (let line of lines) {
        const p = document.createElement('p');
        p.textContent = `> ${line}`;
        bootLog.appendChild(p);
        await sleep(Math.random() * 300 + 100);
    }

    await sleep(1000);
    bootScreen.style.opacity = '0';
    setTimeout(() => {
        bootScreen.style.display = 'none';
        mainInterface.classList.remove('hidden');
        mainInterface.style.opacity = '1';
        startSystemProcesses();
    }, 1000);
}

// --- 2. SYSTEM PROCESSES ---
function startSystemProcesses() {
    updateClock();
    setInterval(updateClock, 1000);
    startThreatFeed();
    initDecryption();
    initTabs();
    initTerminal();
    animateNetwork();
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toISOString().split('T')[1].split('.')[0] + " UTC";
}

// --- 3. THREAT FEED ENGINE ---
function startThreatFeed() {
    const container = document.getElementById('feed-container');
    const targets = ['AWS_NODE_01', 'BANK_CENTRAL', 'GOV_SECURE_SVR', 'SAT_COMM_HUB', 'PRIVATE_VAULT'];
    const types = ['SQL_INJECTION', 'BRUTE_FORCE', 'BUFFER_OVERFLOW', 'ZERO_DAY_EXPLOIT', 'PACKET_SNOOPING'];
    
    function addLog() {
        const time = new Date().toLocaleTimeString([], { hour12: false });
        const type = types[Math.floor(Math.random() * types.length)];
        const target = targets[Math.floor(Math.random() * targets.length)];
        const ip = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        
        const div = document.createElement('div');
        div.className = 'feed-item';
        div.innerHTML = `[${time}] <span style="color:white">${type}</span><br>FROM: ${ip} -> TO: ${target}`;
        
        container.prepend(div);
        if (container.children.length > 20) container.lastChild.remove();
        
        setTimeout(addLog, Math.random() * 3000 + 1000);
    }
    addLog();
}

// --- 4. DECRYPTION EFFECT ---
function initDecryption() {
    const elements = document.querySelectorAll('.decrypt-text');
    const chars = '!<>-_\\\/[]{}—=+*^?# .*~`@#$%^&*()_ +1234567890';

    elements.forEach(el => {
        const originalText = el.textContent;
        let iteration = 0;
        
        const interval = setInterval(() => {
            el.textContent = originalText.split("")
                .map((char, index) => {
                    if (index < iteration) return originalText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iteration >= originalText.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    });
}

// --- 5. UI INTERACTION ---
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });
}

function initTerminal() {
    const input = document.getElementById('terminal-input');
    const commands = {
        'help': 'Available commands: help, clear, status, whoami, shutdown',
        'whoami': 'UID: ADMIN_ROOT | LEVEL: OMNI | ACCESS: UNRESTRICTED',
        'status': 'SYSTEM: STABLE | ENCRYPTION: AES-256-GCM | NODES: 14 ACTIVE',
        'clear': 'CLEAR_CMD',
        'shutdown': 'CRITICAL ERROR: SHUTDOWN RESTRICTED BY SYSTEM KERNEL'
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.toLowerCase().trim();
            input.value = '';
            
            if (cmd === 'clear') {
                // Visual clear effect
                document.body.style.opacity = '0';
                setTimeout(() => document.body.style.opacity = '1', 100);
            } else if (commands[cmd]) {
                alert(`[SYSTEM]: ${commands[cmd]}`);
            } else if (cmd !== '') {
                alert(`[ERROR]: Command '${cmd}' not recognized in VOID-SHELL.`);
            }
        }
    });
}

// --- 6. NETWORK ANIMATION ---
function animateNetwork() {
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => {
        setInterval(() => {
            node.style.transition = 'r 0.2s ease';
            node.setAttribute('r', Math.random() * 8 + 3);
            setTimeout(() => node.setAttribute('r', 5), 200);
        }, Math.random() * 5000 + 2000);
    });
}

// --- UTILS ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}