// ============================================
// WASTELAND BIO-TERMINAL // Biopunk RPG Database
// scripts.js - Immersive Interactive Systems
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initRealTimeClock();
  initScrollReveal();
  initContaminationMap();
  initTechTree();
  initTerminalLog();
  initOrganicPulse();
  initGlitchEffects();
});

// --------------------------------------------
// 1. BOOT SEQUENCE
// --------------------------------------------
function initBootSequence() {
  const bootScreen = document.querySelector('.boot-screen');
  const bootText = document.querySelector('.boot-text');
  
  // Simulate typing effect for boot text
  const bootMessages = [
    'INITIALIZING BIO-TERMINAL v2.7.1...',
    'LOADING MUTATION SPECIMEN DATABASE...',
    'CALIBRATING CONTAMINATION SENSORS...',
    'ESTABLISHING WASTELAND MESH CONNECTION...',
    'ACCESS GRANTED'
  ];
  
  let lineIndex = 0;
  
  const typeInterval = setInterval(() => {
    if (lineIndex < bootMessages.length) {
      const line = document.createElement('div');
      line.textContent = bootMessages[lineIndex];
      line.style.opacity = '0';
      bootText.appendChild(line);
      
      // Fade in each line
      setTimeout(() => {
        line.style.transition = 'opacity 0.3s ease';
        line.style.opacity = '1';
      }, 50);
      
      lineIndex++;
    } else {
      clearInterval(typeInterval);
      // Keep boot screen visible for a moment then fade out
      setTimeout(() => {
        bootScreen.style.transition = 'opacity 0.8s ease';
        bootScreen.style.opacity = '0';
        setTimeout(() => {
          bootScreen.style.display = 'none';
        }, 800);
      }, 1500);
    }
  }, 400);
}

// --------------------------------------------
// 2. REAL-TIME CLOCK
// --------------------------------------------
function initRealTimeClock() {
  const timeElement = document.getElementById('current-time');
  
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  updateTime();
  setInterval(updateTime, 1000);
}

// --------------------------------------------
// 3. SCROLL REVEAL ANIMATIONS
// --------------------------------------------
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        // Optional: unobserve after reveal for performance
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe mutation cards
  document.querySelectorAll('.mutation-card').forEach(card => {
    observer.observe(card);
  });
  
  // Observe tech nodes
  document.querySelectorAll('.tech-node').forEach(node => {
    observer.observe(node);
  });
  
  // Observe scrap papers
  document.querySelectorAll('.scrap-paper').forEach(paper => {
    observer.observe(paper);
  });
}

// --------------------------------------------
// 4. CONTAMINATION MAP INTERACTIVITY
// --------------------------------------------
function initContaminationMap() {
  const zones = document.querySelectorAll('.zone-zone');
  const tooltip = document.getElementById('zone-tooltip');
  
  zones.forEach(zone => {
    zone.addEventListener('mouseenter', (e) => {
      const name = zone.getAttribute('data-zone-name');
      const threat = zone.getAttribute('data-threat');
      const loot = zone.getAttribute('data-loot');
      
      tooltip.innerHTML = `
        <h4>${name}</h4>
        <p><strong>Threat Level:</strong> ${threat}</p>
        <p><strong>Potential Loot:</strong> ${loot}</p>
      `;
      tooltip.classList.add('visible');
    });
    
    zone.addEventListener('mousemove', (e) => {
      const container = document.querySelector('.map-container');
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left + 15;
      const y = e.clientY - rect.top + 15;
      
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });
    
    zone.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
    
    // Click effect - simulate scanning
    zone.addEventListener('click', () => {
      zone.style.filter = 'brightness(1.5)';
      setTimeout(() => {
        zone.style.filter = 'brightness(1)';
      }, 200);
      
      // Flash effect on the zone
      const originalOpacity = zone.getAttribute('opacity');
      zone.setAttribute('opacity', '1');
      setTimeout(() => {
        zone.setAttribute('opacity', originalOpacity);
      }, 300);
    });
  });
}

// --------------------------------------------
// 5. TECH TREE INTERACTIONS
// --------------------------------------------
function initTechTree() {
  const nodes = document.querySelectorAll('.tech-node');
  
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const name = node.querySelector('.node-name').textContent;
      const cost = node.getAttribute('data-cost');
      
      // Visual feedback
      node.style.transform = 'scale(0.95)';
      setTimeout(() => {
        node.style.transform = 'scale(1.1)';
      }, 100);
      
      // Create a temporary "purchased" effect
      const originalBorder = node.style.borderColor;
      node.style.borderColor = '#facc15';
      node.style.boxShadow = '0 0 30px rgba(250, 204, 21, 0.6)';
      
      // Add a checkmark
      const icon = node.querySelector('.node-icon');
      const originalIcon = icon.textContent;
      icon.textContent = '✓';
      icon.style.color = '#facc15';
      
      // Reset after delay
      setTimeout(() => {
        node.style.borderColor = originalBorder;
        node.style.boxShadow = '0 0 15px rgba(74, 222, 128, 0.2)';
        icon.textContent = originalIcon;
        icon.style.color = '';
      }, 2000);
      
      // Log to terminal
      logToTerminal(`[SYSTEM] Bio-enhancement acquired: ${name} (Cost: ${cost} BIO-CREDITS)`);
    });
    
    // Hover sound simulation via visual pulse
    node.addEventListener('mouseenter', () => {
      node.style.animation = 'none';
      node.offsetHeight; // Trigger reflow
      node.style.animation = 'techPulse 0.5s ease';
    });
  });
}

// --------------------------------------------
// 6. TERMINAL LOG SYSTEM
// --------------------------------------------
function initTerminalLog() {
  const logOutput = document.querySelector('.log-output');
  const initialMessages = [
    '[10:42:01] System boot complete',
    '[10:42:02] Contamination sensors online: 87% critical zones',
    '[10:42:03] Mutant registry updated: 1,247 new specimens',
    '[10:42:04] Mesh network connection stable',
    '[10:42:05] Bio-enhancement clinic inventory restocked',
    '[10:42:06] Alert: Spore forest activity increased 200% in last 24h',
    '[10:42:07] Scanning for nearby hostiles... None detected',
    '[10:42:08] Waiting for user input_'
  ];
  
  // Messages are already in HTML, just ensure they animate
  // Add occasional new log entries
  setInterval(() => {
    if (Math.random() > 0.7) {
      const randomMessages = [
        '[SYSTEM] Background scan complete. No new threats detected.',
        '[NETWORK] New mesh node discovered in Sector 12.',
        '[BIO-LAB] Specimen analysis complete: 3 new mutations catalogued.',
        '[ALERT] Minor radiation spike detected in Industrial Wasteland.',
        '[UPDATE] Bio-enhancement clinic prices reduced by 10% for today only.',
        '[MESH] Message received from Settlement Alpha: "Trade offer available."',
        '[SENSOR] Unusual biological activity detected near The Vats.'
      ];
      
      const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      const formattedMsg = `[${time}] ${randomMsg}`;
      
      addLogEntry(formattedMsg);
    }
  }, 15000); // Every 15 seconds
}

function addLogEntry(message) {
  const logOutput = document.querySelector('.log-output');
  const newEntry = document.createElement('p');
  newEntry.textContent = message;
  newEntry.style.animation = 'fadeIn 0.5s forwards';
  logOutput.appendChild(newEntry);
  
  // Keep only last 20 entries
  const entries = logOutput.querySelectorAll('p');
  if (entries.length > 20) {
    entries[0].remove();
  }
  
  // Scroll to bottom
  logOutput.scrollTop = logOutput.scrollHeight;
}

function logToTerminal(message) {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  addLogEntry(`[${time}] ${message}`);
}

// --------------------------------------------
// 7. ORGANIC PULSE EFFECTS
// --------------------------------------------
function initOrganicPulse() {
  // Randomly pulse contamination meter
  const meterFill = document.querySelector('.meter-fill');
  setInterval(() => {
    const randomWidth = 80 + Math.random() * 15; // 80-95%
    meterFill.style.width = `${randomWidth}%`;
  }, 5000);
  
  // Pulse status indicators randomly
  const statusItems = document.querySelectorAll('.status-item');
  setInterval(() => {
    const randomItem = statusItems[Math.floor(Math.random() * statusItems.length)];
    randomItem.style.opacity = '0.5';
    setTimeout(() => {
      randomItem.style.opacity = '1';
    }, 200);
  }, 3000);
}

// --------------------------------------------
// 8. GLITCH EFFECTS
// --------------------------------------------
function initGlitchEffects() {
  const heroTitle = document.querySelector('.hero-title');
  
  // Random glitch on hero title
  setInterval(() => {
    if (Math.random() > 0.9) {
      heroTitle.style.animation = 'glitch 0.3s ease';
      setTimeout(() => {
        heroTitle.style.animation = '';
      }, 300);
    }
  }, 5000);
  
  // Glitch on section titles occasionally
  const sectionTitles = document.querySelectorAll('.section-title');
  setInterval(() => {
    if (Math.random() > 0.85) {
      const randomTitle = sectionTitles[Math.floor(Math.random() * sectionTitles.length)];
      randomTitle.style.animation = 'glitch 0.2s ease';
      setTimeout(() => {
        randomTitle.style.animation = '';
      }, 200);
    }
  }, 8000);
}

// --------------------------------------------
// 9. ADDITIONAL DYNAMIC STYLES VIA JS
// --------------------------------------------
// Add dynamic keyframe for tech pulse
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes techPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(styleSheet);

// --------------------------------------------
// 10. BIO-LUMINESCENT MOUSE TRAIL (OPTIONAL)
// --------------------------------------------
function initBioLuminescentTrail() {
  const trail = [];
  const trailLength = 5;
  
  for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.className = 'bio-trail-dot';
    dot.style.cssText = `
      position: fixed;
      width: ${8 - i}px;
      height: ${8 - i}px;
      background: rgba(74, 222, 128, ${0.6 - i * 0.1});
      border-radius: 50%;
      pointer-events: none;
      z-index: 9997;
      transition: transform 0.1s ease;
      box-shadow: 0 0 ${5 - i}px rgba(74, 222, 128, 0.4);
    `;
    document.body.appendChild(dot);
    trail.push({ element: dot, x: 0, y: 0 });
  }
  
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateTrail() {
    let x = mouseX;
    let y = mouseY;
    
    trail.forEach((dot, index) => {
      const nextDot = trail[index + 1] || trail[0];
      
      dot.x = x;
      dot.y = y;
      dot.element.style.left = `${dot.x - 4}px`;
      dot.element.style.top = `${dot.y - 4}px`;
      
      x += (nextDot.x - dot.x) * 0.3;
      y += (nextDot.y - dot.y) * 0.3;
    });
    
    requestAnimationFrame(animateTrail);
  }
  
  animateTrail();
}

// Initialize the bio-luminescent trail
initBioLuminescentTrail();

// --------------------------------------------
// 11. KEYBOARD SHORTCUTS
// --------------------------------------------
document.addEventListener('keydown', (e) => {
  // Press 'C' to trigger contamination alert
  if (e.key.toLowerCase() === 'c' && e.ctrlKey) {
    logToTerminal('[ALERT] MANUAL CONTAMINATION SCAN INITIATED...');
    const meterFill = document.querySelector('.meter-fill');
    meterFill.style.width = '100%';
    meterFill.style.background = 'linear-gradient(90deg, #f87171, #dc2626)';
    
    setTimeout(() => {
      meterFill.style.width = '85%';
      meterFill.style.background = '';
    }, 3000);
  }
  
  // Press 'M' to log mutation scan
  if (e.key.toLowerCase() === 'm' && e.ctrlKey) {
    logToTerminal('[SCANNER] Initiating mutation signature sweep...');
    setTimeout(() => {
      logToTerminal('[SCANNER] 3 unique mutation signatures detected in current sector.');
    }, 1500);
  }
});

// --------------------------------------------
// 12. CONSOLE EASTER EGG
// --------------------------------------------
console.log(`
%c☢️ WASTELAND BIO-TERMINAL ☢️
%cBiopunk RPG Database // Sector 7 Ruins
%cAccess Level: Survivor
%cStatus: Contamination Critical
`,
'color: #4ade80; font-size: 20px; font-weight: bold;',
'color: #facc15; font-size: 14px;',
'color: #e5e5e5; font-size: 12px;',
'color: #f87171; font-size: 12px;'
);

console.log('%cTry pressing Ctrl+C or Ctrl+M for hidden commands...', 'color: #9ca3af; font-style: italic;');