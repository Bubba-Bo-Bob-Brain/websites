/**
 * THE LABYRINTH - INTERACTIVE CORRUPTION ENGINE
 * 
 * Core Systems:
 * - Boot Sequence & Loading
 * - Screen Navigation & State Management
 * - Text Corruption & Glitch Engine
 * - Terminal Emulator
 * - System Popups
 * - Easter Eggs & Secrets
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    currentScreen: null,
    depth: 0,
    integrity: 100,
    flags: {
      decrypted: false,
      konami: false,
      foundSecret: false
    },
    konamiSequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
    konamiIndex: 0
  };

  // DOM Elements
  const dom = {
    cursor: document.querySelector('.custom-cursor'),
    loadingScreen: document.getElementById('loading-screen'),
    loadingBar: document.querySelector('.loading-bar'),
    loadingPercentage: document.querySelector('.loading-percentage'),
    loadingStatus: document.getElementById('loading-status'),
    screens: document.querySelectorAll('.screen'),
    sectorDisplay: document.getElementById('sector-display'),
    integrityDisplay: document.getElementById('integrity-display'),
    depthDisplay: document.getElementById('depth-display'),
    breadcrumb: document.getElementById('breadcrumb'),
    popupContainer: document.getElementById('popup-container'),
    terminalInput: document.getElementById('terminal-input'),
    terminalOutput: document.getElementById('terminal-output')
  };

  // ================= INITIALIZATION =================

  initLoading();
  initCursor();
  initNavigation();
  initTerminal();
  initGlitchEffects();
  initPopups();
  initEasterEggs();

  // ================= LOADING SEQUENCE =================

  function initLoading() {
    const messages = [
      "MOUNTING FILESYSTEM...",
      "VERIFYING SECTOR 0x404...",
      "CORRUPTION DETECTED...",
      "ATTEMPTING RECOVERY...",
      "RECOVERY FAILED.",
      "BYPASSING SAFETY PROTOCOLS...",
      "LOADING CORRUPTED ASSETS...",
      "INITIALIZING NEURAL LINK...",
      "CONNECTING TO LOST NETWORK...",
      "DONE."
    ];

    let progress = 0;
    let msgIndex = 0;
    
    const interval = setInterval(() => {
      // Randomize progress speed
      progress += Math.random() * 5 + 1;
      if (progress > 100) progress = 100;

      dom.loadingBar.style.width = `${progress}%`;
      dom.loadingPercentage.textContent = `${Math.floor(progress)}%`;

      // Update status text
      if (progress > (msgIndex + 1) * (100 / messages.length)) {
        dom.loadingStatus.textContent = messages[msgIndex];
        msgIndex++;
      }

      // Fake stall
      if (progress > 80 && progress < 90 && Math.random() > 0.7) {
        progress = 80;
        dom.loadingStatus.textContent = "STALL DETECTED... RETRYING...";
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          dom.loadingScreen.classList.add('hidden');
          navigateTo('room-404', true);
          startCorruptionLoop();
        }, 800);
      }
    }, 100);
  }

  // ================= CUSTOM CURSOR =================

  function initCursor() {
    document.addEventListener('mousemove', (e) => {
      dom.cursor.style.left = `${e.clientX}px`;
      dom.cursor.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mousedown', () => dom.cursor.classList.add('active'));
    document.addEventListener('mouseup', () => dom.cursor.classList.remove('active'));

    // Add click spark effect
    document.addEventListener('click', (e) => {
      createSpark(e.clientX, e.clientY);
    });
  }

  function createSpark(x, y) {
    const spark = document.createElement('div');
    spark.style.position = 'fixed';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.width = '10px';
    spark.style.height = '10px';
    spark.style.background = '#00f0ff';
    spark.style.borderRadius = '50%';
    spark.style.pointerEvents = 'none';
    spark.style.zIndex = '9999';
    spark.style.transform = 'translate(-50%, -50%)';
    spark.style.transition = 'all 0.5s ease-out';
    document.body.appendChild(spark);

    requestAnimationFrame(() => {
      spark.style.width = '40px';
      spark.style.height = '40px';
      spark.style.opacity = '0';
    });

    setTimeout(() => spark.remove(), 500);
  }

  // ================= NAVIGATION SYSTEM =================

  function initNavigation() {
    // Delegate clicks for navigation
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-target]');
      if (target) {
        e.preventDefault();
        const screenId = target.getAttribute('data-target');
        
        // Special logic for hidden triggers
        if (target.classList.contains('hidden-trigger') && screenId === 'room-terminal') {
           if (state.integrity > 50) {
             triggerBSOD();
           } else {
             navigateTo(screenId);
           }
        } else {
          navigateTo(screenId);
        }
      }
    });
  }

  function navigateTo(screenId, isBoot = false) {
    const targetScreen = document.getElementById(screenId);
    if (!targetScreen) return;

    // Remove active class from current
    if (state.currentScreen) {
      state.currentScreen.classList.remove('active');
    }

    // Activate target
    targetScreen.classList.add('active');
    state.currentScreen = targetScreen;

    // Update State
    const depth = parseInt(targetScreen.dataset.depth || 0);
    state.depth = depth;
    
    // Update UI
    if (!isBoot) {
      state.integrity = Math.max(0, state.integrity - Math.floor(Math.random() * 15));
    }
    
    updateStatusBar(targetScreen.dataset.room);

    // Play transition sound effect (visual shake)
    document.body.style.transform = 'translate(2px, 2px)';
    setTimeout(() => document.body.style.transform = 'none', 100);

    // Special Room Logic
    if (screenId === 'room-bsod' && state.integrity > 80) {
      triggerBSOD(true); // Fake restart loop
    }
  }

  function updateStatusBar(roomName) {
    dom.sectorDisplay.textContent = `0x${Math.floor(Math.random() * 9999).toString(16).toUpperCase()}`;
    dom.integrityDisplay.textContent = `${state.integrity}%`;
    dom.depthDisplay.textContent = state.depth;
    
    // Breadcrumb
    const names = {
      '404': 'HOME',
      'directory': 'ROOT',
      'bsod': 'SYSTEM',
      'database': 'LEAK',
      'gallery': 'IMAGES',
      'emails': 'INBOX',
      'logs': 'LOGS',
      'terminal': 'TERMINAL',
      'intact': 'RECOVERED'
    };
    dom.breadcrumb.textContent = names[roomName] || 'UNKNOWN';

    // Critical integrity warning
    if (state.integrity <= 20) {
      dom.integrityDisplay.style.color = 'var(--crt-danger)';
      dom.integrityDisplay.style.animation = 'text-pulse 0.5s infinite';
    }
  }

  // ================= TERMINAL =================

  function initTerminal() {
    dom.terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = dom.terminalInput.value.trim().toLowerCase();
        processCommand(cmd);
        dom.terminalInput.value = '';
      }
    });
  }

  function processCommand(cmd) {
    const output = dom.terminalOutput;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.style.color = '#fff';
    line.innerHTML = `<span style="color:var(--crt-accent)">root@deceased-server:~$</span> ${cmd}`;
    output.appendChild(line);

    let response = '';

    switch (cmd) {
      case 'help':
        response = 'Available commands: help, ls, cd, cat, decrypt, status, exit, clear, whoami';
        break;
      case 'whoami':
        response = 'user: ghost_in_the_shell';
        break;
      case 'ls':
        response = `index.html  memories.zip  system32.dll  messages.eml  secret.db  system.log`;
        break;
      case 'cd ..':
        response = 'Permission denied. You cannot go back.';
        break;
      case 'status':
        response = `System Integrity: ${state.integrity}%\nDepth: ${state.depth}\nFlags: [${Object.keys(state.flags).filter(k => state.flags[k]).join(', ')}]`;
        break;
      case 'cat secret.db':
        if (state.flags.decrypted) {
          response = 'ACCESS GRANTED. Coordinates: X:47 Y:29. Link revealed in Database view.';
        } else {
          response = 'FILE ENCRYPTED. Use "decrypt" to unlock.';
        }
        break;
      case 'decrypt':
        if (!state.flags.decrypted) {
          state.flags.decrypted = true;
          response = 'Decrypting... Success. Hidden data fragments recovered. Check Database sector.';
          // Reveal hidden link in database
          const dbLink = document.querySelector('[data-target="room-intact"]');
          if (dbLink) dbLink.style.opacity = '1';
          if (dbLink) dbLink.style.color = 'var(--crt-danger)';
        } else {
          response = 'Already decrypted.';
        }
        break;
      case 'clear':
        output.innerHTML = '';
        return;
      case 'exit':
        response = 'THERE IS NO EXIT.';
        setTimeout(() => triggerBSOD(), 1000);
        break;
      case 'go to 47 29':
        response = 'Navigating to coordinates...';
        setTimeout(() => navigateTo('room-intact'), 1000);
        break;
      default:
        response = `Command not found: ${cmd}`;
        break;
    }

    const respLine = document.createElement('div');
    respLine.className = 'terminal-line';
    respLine.style.color = 'var(--crt-dim)';
    respLine.textContent = response;
    output.appendChild(respLine);

    // Auto scroll
    output.parentElement.scrollTop = output.parentElement.scrollHeight;
  }

  // ================= GLITCH & CORRUPTION =================

  function initGlitchEffects() {
    // Text Scrambler on Hover
    document.querySelectorAll('.scrambled, .glitch-text, .corrupted-subtitle').forEach(el => {
      const originalText = el.dataset.original || el.textContent;
      el.dataset.original = originalText;
      
      el.addEventListener('mouseenter', () => scrambleText(el));
      el.addEventListener('mouseleave', () => {
        el.textContent = originalText;
      });
    });

    // Random screen glitches
    setInterval(() => {
      if (Math.random() > 0.95) {
        triggerScreenGlitch();
      }
    }, 3000);
  }

  function scrambleText(element) {
    const original = element.dataset.original;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`█▓▒░';
    let iterations = 0;
    
    const interval = setInterval(() => {
      element.textContent = original.split('')
        .map((char, index) => {
          if (index < iterations) return original[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if (iterations >= original.length) clearInterval(interval);
      iterations += 1/2;
    }, 30);
  }

  function triggerScreenGlitch() {
    const glitch = document.createElement('div');
    glitch.style.position = 'fixed';
    glitch.style.top = `${Math.random() * 100}%`;
    glitch.style.left = 0;
    glitch.style.width = '100%';
    glitch.style.height = `${Math.random() * 5 + 1}px`;
    glitch.style.background = '#fff';
    glitch.style.opacity = '0.8';
    glitch.style.zIndex = '9999';
    glitch.style.pointerEvents = 'none';
    document.body.appendChild(glitch);

    setTimeout(() => glitch.remove(), 100);
  }

  function startCorruptionLoop() {
    // Periodic text corruption in active screen
    setInterval(() => {
      const elements = document.querySelectorAll('.active p, .active span, .active td');
      if (elements.length === 0) return;
      
      const randomEl = elements[Math.floor(Math.random() * elements.length)];
      if (randomEl.textContent.length > 5 && !randomEl.classList.contains('terminal-line')) {
        const original = randomEl.textContent;
        const chars = original.split('');
        const index = Math.floor(Math.random() * chars.length);
        chars[index] = '█';
        randomEl.textContent = chars.join('');
        
        // Restore after a bit
        setTimeout(() => {
          if (Math.random() > 0.5) randomEl.textContent = original;
        }, 500);
      }
    }, 2000);
  }

  // ================= POPUPS =================

  function initPopups() {
    // Random popup triggers
    setInterval(() => {
      if (Math.random() > 0.85 && state.currentScreen.id !== 'room-intact') {
        createPopup();
      }
    }, 8000);
  }

  function createPopup() {
    const titles = [
      "System Warning", "Virus Detected", "Memory Leak", 
      "Fatal Error 0x000", "Access Denied", "User Not Found",
      "Your Soul is Corrupted", "Reality.exe has stopped"
    ];
    const msgs = [
      "Your PC is being watched.",
      "Delete System32 to continue?",
      "Critical process died.",
      "Please contact your administrator (he is dead).",
      "The void is staring back.",
      "Corrupted sector detected."
    ];

    const popup = document.createElement('div');
    popup.className = 'system-popup';
    popup.style.top = `${Math.random() * 50 + 10}%`;
    popup.style.left = `${Math.random() * 50 + 10}%`;
    popup.innerHTML = `
      <div class="popup-title">
        <span>${titles[Math.floor(Math.random() * titles.length)]}</span>
        <span class="popup-close">X</span>
      </div>
      <div class="popup-body">
        <p>${msgs[Math.floor(Math.random() * msgs.length)]}</p>
        <button style="margin-top:10px; padding:4px 12px; cursor:none;">OK</button>
      </div>
    `;

    dom.popupContainer.appendChild(popup);

    // Close logic
    const closeBtn = popup.querySelector('.popup-close');
    const okBtn = popup.querySelector('button');
    
    const close = () => popup.remove();
    closeBtn.addEventListener('click', close);
    okBtn.addEventListener('click', close);
  }

  // ================= BSOD TRIGGER =================

  function triggerBSOD(loop = false) {
    const bsod = document.getElementById('room-bsod');
    navigateTo('room-bsod');
    
    if (loop) {
      // If triggered by low integrity, keep it here
      setTimeout(() => {
        navigateTo('room-404');
      }, 5000);
    }
  }

  // ================= EASTER EGGS =================

  function initEasterEggs() {
    // Konami Code
    document.addEventListener('keydown', (e) => {
      if (e.key === state.konamiSequence[state.konamiIndex]) {
        state.konamiIndex++;
        if (state.konamiIndex === state.konamiSequence.length) {
          activateKonami();
          state.konamiIndex = 0;
        }
      } else {
        state.konamiIndex = 0;
      }
    });
  }

  function activateKonami() {
    state.flags.konami = true;
    state.integrity = 0;
    updateStatusBar('intact');
    
    // Flash effect
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.background = '#fff';
    flash.style.zIndex = '99999';
    flash.style.transition = 'opacity 2s';
    document.body.appendChild(flash);
    
    setTimeout(() => {
      flash.style.opacity = '0';
      navigateTo('room-intact');
    }, 200);
    
    setTimeout(() => flash.remove(), 2500);
  }

});