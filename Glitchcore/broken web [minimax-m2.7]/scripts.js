/* ═══════════════════════════════════════════════════════════════════════
   DIGITAL DECAY - Interactive Corrupted Web Art
   JavaScript File - All interactive behaviors and effects
═══════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────
// GLOBAL STATE
// ─────────────────────────────────────────────────────────────────────────
const state = {
  currentLayer: 0,
  visitedLayers: new Set([0]),
  totalClicks: 0,
  glitchIntensity: 0,
  audioEnabled: false,
  foundSecret: false,
  bsodProgress: 0,
  matrixInterval: null,
  glitchInterval: null,
  corruptionTimeout: null,
  virusActive: false
};

// ─────────────────────────────────────────────────────────────────────────
// AUDIO SYSTEM
// ─────────────────────────────────────────────────────────────────────────
let audioContext = null;

function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.log('Web Audio API not supported');
  }
}

function playSound(type, variation) {
  variation = variation || 0;
  if (!state.audioEnabled || !audioContext) return;
  
  try {
    const sounds = {
      glitch: { freq: [200, 150, 100], duration: 0.05, type: 'square' },
      click: { freq: 800, duration: 0.02, type: 'sine' },
      error: { freq: [400, 300, 200], duration: 0.1, type: 'sawtooth' },
      success: { freq: [523, 659, 784, 1047], duration: 0.2, type: 'sine' }
    };
    
    const sound = sounds[type];
    if (!sound) return;
    
    const freqs = Array.isArray(sound.freq) ? sound.freq : [sound.freq];
    
    freqs.forEach(function(freq, i) {
      setTimeout(function() {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = sound.type;
        osc.frequency.value = freq + (variation * 10);
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + sound.duration);
      }, i * 50);
    });
  } catch (e) {
    console.log('Audio playback failed');
  }
}

function toggleAudio() {
  state.audioEnabled = !state.audioEnabled;
  const toggle = document.getElementById('audio-toggle');
  if (toggle) {
    toggle.innerHTML = state.audioEnabled ? '<span class="audio-icon">🔊</span>' : '<span class="audio-icon">🔇</span>';
  }
  if (state.audioEnabled && audioContext) {
    audioContext.resume();
  }
}

// ─────────────────────────────────────────────────────────────────────────
// LAYER NAVIGATION
// ─────────────────────────────────────────────────────────────────────────
function navigateTo(layerIndex) {
  if (layerIndex < 0 || layerIndex > 7) return;
  playSound('click');
  
  const currentLayerEl = document.getElementById('layer-' + state.currentLayer);
  if (currentLayerEl) {
    currentLayerEl.style.opacity = '0';
    setTimeout(function() {
      currentLayerEl.classList.remove('active');
    }, 500);
  }
  
  state.currentLayer = layerIndex;
  state.visitedLayers.add(layerIndex);
  state.totalClicks++;
  
  if (Math.random() > 0.5) {
    triggerGlitch();
  }
  
  setTimeout(function() {
    const newLayerEl = document.getElementById('layer-' + layerIndex);
    if (newLayerEl) {
      newLayerEl.classList.add('active');
      
      if (layerIndex === 1) {
        initBSOD();
      }
      if (layerIndex === 5) {
        initTerminal();
      }
      if (layerIndex === 6) {
        initSanctuary();
      }
      
      updateMinimap();
      updateBreadcrumb();
      updateDepth();
    }
  }, 500);
}

function updateMinimap() {
  const nodes = document.querySelectorAll('.minimap-node');
  nodes.forEach(function(node, index) {
    if (index === state.currentLayer) {
      node.classList.add('active');
    } else {
      node.classList.remove('active');
    }
  });
}

function updateBreadcrumb() {
  const crumbs = ['404', 'BSOD', 'Web1.0', 'DB_Leak', 'Mac', 'Terminal', '???', 'Config'];
  const crumbEl = document.getElementById('current-crumb');
  if (crumbEl) {
    crumbEl.textContent = crumbs[state.currentLayer];
  }
}

function updateDepth() {
  const depth = state.visitedLayers.size * 12.5;
  const depthValue = document.getElementById('depth-value');
  const depthFill = document.getElementById('depth-fill');
  if (depthValue) depthValue.textContent = state.visitedLayers.size;
  if (depthFill) depthFill.style.width = depth + '%';
}

// ─────────────────────────────────────────────────────────────────────────
// BSOD LAYER
// ─────────────────────────────────────────────────────────────────────────
let bsodInterval = null;

function initBSOD() {
  if (bsodInterval) clearInterval(bsodInterval);
  state.bsodProgress = 0;
  
  const progressBar = document.getElementById('bsod-progress');
  const progressText = document.getElementById('progress-text');
  const stopCode = document.getElementById('stop-code');
  
  const stopCodes = ['0x0000007B', '0x00000050', '0x0000000A', '0x0000007E', '0x000000D1', '0xDEADBEEF', '0xCAFE_BABE'];
  
  bsodInterval = setInterval(function() {
    if (state.currentLayer !== 1) {
      clearInterval(bsodInterval);
      return;
    }
    
    state.bsodProgress += Math.random() * 3;
    if (state.bsodProgress > 100) state.bsodProgress = 100;
    
    if (progressBar) progressBar.style.width = state.bsodProgress + '%';
    if (progressText) progressText.textContent = Math.floor(state.bsodProgress) + '% complete';
    
    if (Math.random() > 0.95 && stopCode) {
      stopCode.textContent = stopCodes[Math.floor(Math.random() * stopCodes.length)];
    }
  }, 200);
}

// ─────────────────────────────────────────────────────────────────────────
// TERMINAL LAYER
// ─────────────────────────────────────────────────────────────────────────
const terminalCommands = {
  help: 'Available commands: help, ls, cat, clear, whoami, date, matrix, secret',
  ls: 'total 42\ndrwxr-x--- 2 root root 4096 Aug 15 1999 .\ndrwxr-xr-x 13 root root 2048 Jan 1 00:00 ..\n-rw-r----- 1 root root 42 Jan 1 00:00 .secret\n-rw-r----- 1 root root 1.2M Jan 1 00:00 ██████.log',
  whoami: 'root@void',
  clear: 'CLEAR_TERMINAL',
  matrix: 'ENABLING_MATRIX_MODE...',
  secret: 'SECRET_FOUND: Navigate to layer 6 for sanctuary'
};

function initTerminal() {
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  
  if (terminalInput) {
    terminalInput.focus();
  }
  
  if (terminalInput) {
    terminalInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        if (cmd) {
          processCommand(cmd, terminalOutput);
          terminalInput.value = '';
        }
      }
    });
  }
  
  if (!state.matrixInterval) {
    initMatrixRain();
  }
}

function processCommand(cmd, output) {
  playSound('click');
  
  const cmdLine = document.createElement('div');
  cmdLine.className = 'terminal-line';
  cmdLine.innerHTML = '<span class="prompt">root@void:~$</span> <span class="cmd">' + cmd + '</span>';
  output.appendChild(cmdLine);
  
  let result = '';
  
  if (cmd.startsWith('cat ')) {
    var file = cmd.substring(4).trim();
    if (file === 'secret.enc' || file === '.secret') {
      result = '[ENCRYPTED_CONTENT]\n███ DECRYPTION KEY REQUIRED ███\nHint: The year the web began';
      playSound('success');
    } else if (file === 'readme.txt' || file === 'readme') {
      result = 'Welcome to the void.\nEverything here is broken.\nBut some things are worth finding.';
    } else if (file === 'todo.txt' || file === 'todo') {
      result = '[ ] Fix everything\n[x] Give up\n[x] Accept decay\n[ ] Find the sanctuary';
    } else {
      result = 'cat: ' + file + ': No such file or directory';
      playSound('error');
    }
  } else if (terminalCommands[cmd.split(' ')[0]]) {
    result = terminalCommands[cmd.split(' ')[0]];
    if (cmd === 'clear') {
      output.innerHTML = '';
      return;
    }
    if (cmd === 'matrix') {
      enableMatrixMode();
    }
    if (cmd === 'secret') {
      navigateTo(6);
    }
  } else {
    result = cmd + ': command not found';
    playSound('error');
  }
  
  const resultLine = document.createElement('div');
  resultLine.className = 'terminal-line output';
  resultLine.innerHTML = result;
  output.appendChild(resultLine);
  
  if (cmd === 'cat secret.enc') {
    var secretLine = document.createElement('div');
    secretLine.className = 'terminal-line output highlight';
    secretLine.innerHTML = '[FILE_DISCOVERED: secret.enc]';
    secretLine.onclick = function() { navigateTo(6); };
    output.appendChild(secretLine);
  }
  
  output.scrollTop = output.scrollHeight;
}

function enableMatrixMode() {
  document.body.classList.add('matrix-mode');
  state.glitchIntensity = 3;
  setTimeout(function() {
    document.body.classList.remove('matrix-mode');
    state.glitchIntensity = 0;
  }, 10000);
}

function initMatrixRain() {
  var matrixContainer = document.getElementById('matrix-rain');
  if (!matrixContainer) return;
  
  var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
  var columns = Math.floor(window.innerWidth / 20);
  
  for (var i = 0; i < columns; i++) {
    createMatrixColumn(matrixContainer, chars, i * 20);
  }
}

function createMatrixColumn(container, chars, startX) {
  var column = document.createElement('div');
  column.className = 'matrix-column';
  column.style.left = startX + 'px';
  
  var currentY = 0;
  var drop = function() {
    var char = document.createElement('span');
    char.className = 'matrix-char';
    char.textContent = chars[Math.floor(Math.random() * chars.length)];
    char.style.top = currentY + 'px';
    char.style.animationDuration = (2 + Math.random() * 3) + 's';
    column.appendChild(char);
    currentY += 20;
    
    if (currentY > window.innerHeight) {
      column.remove();
      return;
    }
    setTimeout(drop, 50 + Math.random() * 100);
  };
  
  drop();
  container.appendChild(column);
}

// ─────────────────────────────────────────────────────────────────────────
// SANCTUARY
// ─────────────────────────────────────────────────────────────────────────
function initSanctuary() {
  if (state.foundSecret) return;
  state.foundSecret = true;
  playSound('success', 5);
  
  var starsContainer = document.getElementById('stars');
  if (starsContainer) {
    for (var i = 0; i < 100; i++) {
      createStar(starsContainer);
    }
  }
  
  setTimeout(function() {
    triggerSanctuaryReveal();
  }, 500);
}

function createStar(container) {
  var star = document.createElement('div');
  star.className = 'star';
  star.style.left = (Math.random() * 100) + '%';
  star.style.top = (Math.random() * 100) + '%';
  star.style.animationDuration = (2 + Math.random() * 3) + 's';
  star.style.animationDelay = (Math.random() * 2) + 's';
  container.appendChild(star);
}

function triggerSanctuaryReveal() {
  var overlay = document.getElementById('corruption-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
  
  var contentElements = document.querySelectorAll('.sanctuary-content > *');
  contentElements.forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(function() {
      el.style.transition = 'all 0.8s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 200);
  });
}

// ─────────────────────────────────────────────────────────────────────────
// GLITCH EFFECTS
// ─────────────────────────────────────────────────────────────────────────
function triggerGlitch() {
  playSound('glitch', Math.floor(Math.random() * 10));
  
  var tear = document.getElementById('screen-tear');
  if (tear) {
    tear.classList.add('active');
    setTimeout(function() { tear.classList.remove('active'); }, 300);
  }
  
  document.body.classList.add('chromatic-aberration');
  setTimeout(function() { document.body.classList.remove('chromatic-aberration'); }, 200);
  
  var allElements = document.querySelectorAll('h1, h2, h3, p, span');
  var randomElements = Array.from(allElements).sort(function() { return Math.random() - 0.5; }).slice(0, 5);
  
  randomElements.forEach(function(el) {
    el.classList.add('text-corrupt-random');
    setTimeout(function() { el.classList.remove('text-corrupt-random'); }, 500);
  });
  
  if (Math.random() > 0.9 && !state.virusActive) {
    triggerFakeVirus();
  }
}

function triggerFakeVirus() {
  state.virusActive = true;
  var virus = document.getElementById('fake-virus');
  if (virus) {
    virus.style.display = 'flex';
    setTimeout(function() {
      virus.style.display = 'none';
      state.virusActive = false;
    }, 6000);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// SECRET DISCOVERY
// ─────────────────────────────────────────────────────────────────────────
function findSecret() {
  playSound('success', 3);
  
  var clues = [
    'You found something...',
    'Look deeper into the terminal...',
    'Try: cat secret.enc',
    'Or check the leaked config files...',
    'The year is 1991...'
  ];
  
  var clueEl = document.createElement('div');
  clueEl.className = 'secret-clue';
  clueEl.textContent = clues[Math.floor(Math.random() * clues.length)];
  clueEl.style.cssText = 'position:fixed;bottom:150px;left:50%;transform:translateX(-50%);background:rgba(0,255,65,0.9);color:#000;padding:15px 30px;font-family:var(--font-terminal);z-index:1000;animation:clue-reveal 3s ease-out forwards;';
  
  document.body.appendChild(clueEl);
  setTimeout(function() { clueEl.remove(); }, 3000);
  
  var style = document.createElement('style');
  style.textContent = '@keyframes clue-reveal{0%{opacity:0;transform:translateX(-50%) translateY(20px);}20%{opacity:1;transform:translateX(-50%) translateY(0);}80%{opacity:1;}100%{opacity:0;transform:translateX(-50%) translateY(-20px);}}';
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────────────────
// RANDOM CORRUPTION
// ─────────────────────────────────────────────────────────────────────────
var corruptionIntervals = [];

function startRandomCorruption() {
  corruptionIntervals.push(setInterval(function() {
    if (Math.random() > 0.7) {
      shuffleRandomText();
    }
  }, 3000));
  
  corruptionIntervals.push(setInterval(function() {
    if (Math.random() > 0.8) {
      triggerGlitch();
    }
  }, 5000));
  
  corruptionIntervals.push(setInterval(function() {
    if (Math.random() > 0.6) {
      toggleRandomElement();
    }
  }, 4000));
}

function shuffleRandomText() {
  var textElements = document.querySelectorAll('.glitch-text, .title-corrupt, .corrupted-url');
  var randomEl = textElements[Math.floor(Math.random() * textElements.length)];
  
  if (randomEl && !randomEl.dataset.original) {
    randomEl.dataset.original = randomEl.textContent;
  }
  
  if (randomEl && randomEl.dataset.original) {
    var original = randomEl.dataset.original;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
    var scrambled = '';
    
    for (var i = 0; i < original.length; i++) {
      if (original[i] === ' ') {
        scrambled += ' ';
      } else {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    randomEl.textContent = scrambled;
    setTimeout(function() { randomEl.textContent = original; }, 200);
  }
}

function toggleRandomElement() {
  var elements = document.querySelectorAll('.debris, .floating-debris span');
  var randomEl = elements[Math.floor(Math.random() * elements.length)];
  
  if (randomEl) {
    randomEl.style.opacity = randomEl.style.opacity === '0' ? '0.4' : '0';
  }
}

// ─────────────────────────────────────────────────────────────────────────
// IMAGE CORRUPTION
// ─────────────────────────────────────────────────────────────────────────
function corruptImages() {
  var images = document.querySelectorAll('.corrupted-image');
  
  images.forEach(function(img) {
    setInterval(function() {
      var hue = Math.random() * 360;
      var sat = 1 + Math.random() * 3;
      var blur = Math.random() * 3;
      img.style.filter = 'hue-rotate(' + hue + 'deg) saturate(' + sat + ') blur(' + blur + 'px)';
      
      setTimeout(function() {
        img.style.filter = 'blur(1px) contrast(1.2)';
      }, 100);
    }, 2000);
  });
}

// ─────────────────────────────────────────────────────────────────────────
// SCROLL EFFECTS
// ─────────────────────────────────────────────────────────────────────────
function initScrollEffects() {
  var lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollVelocity = Math.abs(scrollTop - lastScrollTop);
    lastScrollTop = scrollTop;
    
    var tear = document.getElementById('screen-tear');
    if (scrollVelocity > 100 && tear) {
      tear.classList.add('active');
      setTimeout(function() { tear.classList.remove('active'); }, 100);
    }
    
    var debris = document.querySelectorAll('.debris');
    debris.forEach(function(el) {
      var speed = parseFloat(el.style.getPropertyValue('--delay')) || 1;
      var rot = el.style.getPropertyValue('--rot');
      el.style.transform = 'translateY(' + (scrollTop * speed * 0.1) + 'px) rotate(' + rot + ')';
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────
// MOUSE EFFECTS
// ─────────────────────────────────────────────────────────────────────────
function initMouseEffects() {
  document.addEventListener('mousemove', function(e) {
    var debris = document.querySelectorAll('.debris');
    debris.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var distX = e.clientX - rect.left;
      var distY = e.clientY - rect.top;
      var dist = Math.sqrt(distX * distX + distY * distY);
      
      if (dist < 200) {
        var rot = el.style.getPropertyValue('--rot');
        el.style.transform = 'translate(' + (-distX * 0.1) + 'px, ' + (-distY * 0.1) + 'px) rotate(' + rot + ')';
      }
    });
  });
  
  document.addEventListener('click', function(e) {
    createClickRipple(e.clientX, e.clientY);
    
    if (Math.random() > 0.7) {
      triggerGlitch();
    }
  });
}

function createClickRipple(x, y) {
  var ripple = document.createElement('div');
  ripple.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:10px;height:10px;background:rgba(0,255,65,0.5);border-radius:50%;pointer-events:none;z-index:10000;transform:translate(-50%,-50%);animation:ripple-expand 0.5s ease-out forwards;';
  document.body.appendChild(ripple);
  setTimeout(function() { ripple.remove(); }, 500);
  
  if (!document.getElementById('ripple-style')) {
    var style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = '@keyframes ripple-expand{0%{width:10px;height:10px;opacity:1;}100%{width:200px;height:200px;opacity:0;}}';
    document.head.appendChild(style);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// KEYBOARD SHORTCUTS
// ─────────────────────────────────────────────────────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '7') {
      navigateTo(parseInt(e.key));
    }
    
    if (e.key.toLowerCase() === 'g') {
      triggerGlitch();
    }
    
    if (e.key.toLowerCase() === 'r') {
      resetJourney();
    }
    
    if (e.key.toLowerCase() === 's') {
      if (state.visitedLayers.size >= 5) {
        navigateTo(6);
      }
    }
    
    if (e.key === 'Escape') {
      navigateTo(Math.max(0, state.currentLayer - 1));
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      navigateTo((state.currentLayer + 1) % 8);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────────────────────────────────
function resetJourney() {
  state.currentLayer = 0;
  state.visitedLayers = new Set([0]);
  state.totalClicks = 0;
  state.foundSecret = false;
  
  var stars = document.getElementById('stars');
  if (stars) stars.innerHTML = '';
  
  navigateTo(0);
}

// ─────────────────────────────────────────────────────────────────────────
// MINIMAP
// ─────────────────────────────────────────────────────────────────────────
function initMinimap() {
  var nodes = document.querySelectorAll('.minimap-node');
  var titles = ['404 Error', 'BSOD', 'Web 1.0 Page', 'Database Leak', 'Mac Classic', 'Terminal', '???', 'Config File'];
  
  nodes.forEach(function(node, index) {
    node.addEventListener('click', function() {
      navigateTo(index);
    });
    node.title = titles[index];
  });
}

// ─────────────────────────────────────────────────────────────────────────
// DEAD LINKS
// ─────────────────────────────────────────────────────────────────────────
function initDeadLinks() {
  var links = document.querySelectorAll('.dead-link');
  
  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      playSound('error');
      
      var msg = document.createElement('div');
      msg.className = 'dead-link-msg';
      msg.textContent = '[LINK DEAD: 1999-2015]';
      msg.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(255,0,0,0.8);color:#fff;padding:10px 20px;font-family:var(--font-terminal);z-index:1000;';
      document.body.appendChild(msg);
      setTimeout(function() { msg.remove(); }, 2000);
      
      triggerGlitch();
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────
// HIDDEN TOOLTIPS
// ─────────────────────────────────────────────────────────────────────────
function initHiddenTooltips() {
  var elements = document.querySelectorAll('.highlight-cell, .leaked-file, .survivor-name, .file-name');
  
  elements.forEach(function(el) {
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter', function() {
      el.style.transition = 'all 0.2s';
      el.style.textShadow = '0 0 10px var(--error-green)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.textShadow = 'none';
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────
function init() {
  initAudio();
  
  var initialLayer = document.getElementById('layer-0');
  if (initialLayer) {
    initialLayer.classList.add('active');
  }
  
  initMinimap();
  initDeadLinks();
  initHiddenTooltips();
  initScrollEffects();
  initMouseEffects();
  initKeyboardShortcuts();
  startRandomCorruption();
  corruptImages();
  updateDepth();
  updateBreadcrumb();
  
  console.log('%c╔══════════════════════════════════════╗', 'color: #00ff41');
  console.log('%c║ DIGITAL DECAY - Interactive Web Art ║', 'color: #00ff41');
  console.log('%c║ Navigate through layers of corruption║', 'color: #00ff41');
  console.log('%c║ Press G for glitch, 0-7 to navigate ║', 'color: #00ff41');
  console.log('%c╚══════════════════════════════════════╝', 'color: #00ff41');
  console.log('%cHint: Some links lead nowhere. Keep exploring...', 'color: #888');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}