document.addEventListener('DOMContentLoaded', () => {
  // --- CONFIGURATION & STATE ---
  const state = {
    currentSector: 'boot',
    bootComplete: false,
    dumpProgress: 0,
    glitchInterval: null
  };

  const elements = {
    bootScreen: document.getElementById('boot-screen'),
    mainInterface: document.getElementById('main-interface'),
    dumpPercent: document.getElementById('dump-percent'),
    dumpBar: document.getElementById('dump-bar'),
    rebootBtn: document.getElementById('reboot-btn'),
    exploreBtn: document.getElementById('explore-btn'),
    resetBtn: document.getElementById('reset-btn'),
    voidTrigger: document.getElementById('void-trigger'),
    cursor: null
  };

  // --- INITIALIZATION ---
  function init() {
    createCustomCursor();
    startBootSequence();
  }

  // --- CUSTOM CURSOR ---
  function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);
    elements.cursor = cursor;

    document.addEventListener('mousemove', (e) => {
      if (elements.cursor) {
        elements.cursor.style.left = e.clientX + 'px';
        elements.cursor.style.top = e.clientY + 'px';
      }
    });

    // Hover effects for interactive elements
    const interactables = document.querySelectorAll('a, button, .hidden-trigger');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (elements.cursor) elements.cursor.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        if (elements.cursor) elements.cursor.classList.remove('hovered');
      });
    });
  }

  // --- BOOT SEQUENCE ---
  function startBootSequence() {
    const lines = document.querySelectorAll('.terminal-text p');
    let delay = 0;
    
    // Hide all initially to be safe, then reveal one by one
    lines.forEach(line => line.style.display = 'none');

    lines.forEach((line, index) => {
      delay += Math.random() * 300 + 200;
      setTimeout(() => {
        line.style.display = 'block';
        // Trigger finish when the last line (the blinker) is reached
        if (index === lines.length - 1) { 
          setTimeout(finishBoot, 1000);
        }
      }, delay);
    });
  }

  function finishBoot() {
    state.bootComplete = true;
    // Transition to BSOD
    setTimeout(() => {
      if (elements.bootScreen) elements.bootScreen.classList.add('hidden');
      const crashSector = document.getElementById('sector-crash');
      if (crashSector) crashSector.classList.remove('hidden');
      startBSOD();
    }, 1500);
  }

  // --- SECTOR 1: BSOD LOGIC ---
  function startBSOD() {
    state.currentSector = 'crash';
    
    // Fake memory dump
    const dumpInterval = setInterval(() => {
      state.dumpProgress += Math.floor(Math.random() * 5) + 1;
      if (state.dumpProgress > 100) state.dumpProgress = 100;
      
      if (elements.dumpPercent) elements.dumpPercent.innerText = state.dumpProgress + '%';
      if (elements.dumpBar) elements.dumpBar.style.width = state.dumpProgress + '%';

      if (state.dumpProgress === 100) {
        clearInterval(dumpInterval);
      }
    }, 100);

    // Reboot button listener
    if (elements.rebootBtn) {
      elements.rebootBtn.addEventListener('click', () => {
        const crashSector = document.getElementById('sector-crash');
        if (crashSector) crashSector.classList.add('hidden');
        
        const glitchSector = document.getElementById('sector-glitch');
        if (glitchSector) {
          glitchSector.classList.remove('hidden');
          startGlitchSector();
        }
      });
    }
  }

  // --- SECTOR 2: GLITCH DATABASE ---
  function startGlitchSector() {
    state.currentSector = 'glitch';
    
    // Scramble text effect on load
    const scrambleTarget = document.querySelector('.shuffle-text');
    if (scrambleTarget) {
      scrambleText(scrambleTarget, scrambleTarget.getAttribute('data-original') || scrambleTarget.innerText);
    }

    // Glitch effect on table rows
    const glitchRows = document.querySelectorAll('.glitch-text');
    glitchRows.forEach(row => {
      const originalColor = row.style.color || '#ff0000';
      setInterval(() => {
        row.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        row.style.color = Math.random() > 0.5 ? '#ff0000' : '#00ff00';
      }, 200);
    });

    // Explore button listener
    if (elements.exploreBtn) {
      elements.exploreBtn.addEventListener('click', () => {
        const glitchSector = document.getElementById('sector-glitch');
        if (glitchSector) glitchSector.classList.add('hidden');
        
        const voidSector = document.getElementById('sector-void');
        if (voidSector) {
          voidSector.classList.remove('hidden');
          startVoidSector();
        }
      });
    }
  }

  // Text Scramble Utility
  function scrambleText(element, finalText) {
    if (!element || !finalText) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    let iterations = 0;
    
    const interval = setInterval(() => {
      element.innerText = finalText
        .split('')
        .map((letter, index) => {
          if (index < iterations) return finalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iterations >= finalText.length) clearInterval(interval);
      iterations += 1/2; // Speed of decode
    }, 30);
  }

  // --- SECTOR 3: THE VOID ---
  function startVoidSector() {
    state.currentSector = 'void';
    console.log("%c W A R N I N G ", "background: #222; color: #bada55; font-size: 20px");
    console.log("User has entered the Void.");

    // Hidden trigger logic
    if (elements.voidTrigger) {
      elements.voidTrigger.addEventListener('click', enterSanctuary);
    }

    // Also allow clicking the paragraph text for easier access
    const voidText = document.querySelector('#sector-void p');
    if (voidText) {
      voidText.addEventListener('click', enterSanctuary);
    }
  }

  function enterSanctuary() {
    const voidSector = document.getElementById('sector-void');
    if (voidSector) voidSector.classList.add('hidden');
    
    const sanctuarySector = document.getElementById('sector-sanctuary');
    if (sanctuarySector) {
      sanctuarySector.classList.remove('hidden');
      state.currentSector = 'sanctuary';
    }
  }

  // --- SECTOR 4: SANCTUARY ---
  if (elements.resetBtn) {
    elements.resetBtn.addEventListener('click', () => {
      location.reload(); // Hard reset to start over
    });
  }

  // --- GLOBAL GLITCH EFFECT (Background noise) ---
  setInterval(() => {
    if (state.currentSector === 'glitch' || state.currentSector === 'void') {
      document.body.style.filter = `hue-rotate(${Math.random() * 20 - 10}deg) contrast(${1 + Math.random() * 0.2})`;
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 100);
    }
  }, 2000);

  // Start the engine
  init();
});