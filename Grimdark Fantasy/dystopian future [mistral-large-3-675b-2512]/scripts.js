// ===== GLOBAL VARIABLES =====
const body = document.body;
const broadcastAudio = document.getElementById('broadcast-audio');
const staticAudio = document.getElementById('static-audio');
const hoverAudio = document.getElementById('hover-audio');
const surveillanceFeeds = document.getElementById('surveillance-feeds');
const territoryMap = document.getElementById('territory-map');
const mapOverlay = document.getElementById('map-overlay');
const countdownHours = document.getElementById('countdown-hours');
const countdownMinutes = document.getElementById('countdown-minutes');
const countdownSeconds = document.getElementById('countdown-seconds');
const resistanceMap = document.getElementById('resistance-map');
const eggClose = document.querySelector('.egg-close');
const dataStream = document.getElementById('data-stream');
const broadcastContent = document.getElementById('broadcast-content');
const broadcastPlay = document.querySelector('.broadcast-play');

// Resistance Easter Egg: Konami Code (↑ ↑ ↓ ↓ ← → ← → B A Enter)
const konamiCode = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a', 'Enter'
];
let konamiIndex = 0;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Start ambient static audio (looped)
  staticAudio.volume = 0.3;
  staticAudio.play().catch(e => console.error("Audio play failed:", e));

  // Initialize countdown timer
  startCountdown();

  // Generate surveillance feeds
  generateSurveillanceFeeds();

  // Set current date in propaganda article
  updateCurrentDate();

  // Initialize territory map interactions
  initTerritoryMap();

  // Initialize resistance Easter egg
  initResistanceEgg();

  // Add classified hover warnings
  addClassifiedWarnings();

  // Start scrolling data stream
  scrollDataStream();

  // Play propaganda broadcast on click
  broadcastPlay.addEventListener('click', playPropagandaBroadcast);
});

// ===== COUNTDOWN TIMER (Fake Purge) =====
function startCountdown() {
  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + 3); // Count down to 3 hours from now

  function updateTimer() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      // "Purge" initiated
      countdownHours.textContent = '00';
      countdownMinutes.textContent = '00';
      countdownSeconds.textContent = '00';
      document.querySelector('.countdown-label').textContent = 'PURGE INITIATED';
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

    countdownHours.textContent = hours;
    countdownMinutes.textContent = minutes;
    countdownSeconds.textContent = seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// ===== SURVEILLANCE FEEDS =====
function generateSurveillanceFeeds() {
  surveillanceFeeds.innerHTML = ''; // Clear placeholder
  const feedCount = 6; // Number of feeds to generate

  for (let i = 0; i < feedCount; i++) {
    const feed = document.createElement('div');
    feed.className = 'surveillance-feed';

    // Randomly assign a "status" (normal, redacted, glitch)
    const status = Math.random() > 0.7 ? 'redacted' :
                   Math.random() > 0.5 ? 'glitch' : 'normal';

    feed.innerHTML = `
      <div class="feed-inner ${status}">
        <div class="feed-static"></div>
        <div class="feed-content">
          ${status === 'redacted' ? '<p>[REDACTED]</p>' : `<p>CAM-${i + 1}</p>`}
        </div>
        ${status === 'glitch' ? '<div class="feed-glitch-overlay"></div>' : ''}
      </div>
    `;

    // Add hover effect: distort feed + play static sound
    feed.addEventListener('mouseenter', () => {
      hoverAudio.currentTime = 0;
      hoverAudio.volume = 0.5;
      hoverAudio.play().catch(e => console.error("Audio play failed:", e));
    });

    surveillanceFeeds.appendChild(feed);
  }
}

// ===== TERRITORY MAP =====
function initTerritoryMap() {
  const territories = territoryMap.querySelectorAll('.territory');

  territories.forEach(territory => {
    territory.addEventListener('mouseenter', () => {
      const sectorId = territory.getAttribute('data-id');
      let status, description;

      // Assign random sector status
      const rand = Math.random();
      if (territory.classList.contains('directorate')) {
        status = 'DIRECTORATE CONTROL';
        description = rand > 0.5 ?
          'Patrols report minimal insurgent activity.' :
          'Loyalist forces advancing. Resistance pockets neutralized.';
      } else if (territory.classList.contains('resistance')) {
        status = 'RESISTANCE CONTROL';
        description = rand > 0.5 ?
          'Encrypted transmissions detected. Monitoring...' :
          'Suspicious energy signatures near outpost.';
      } else {
        status = 'CONTESTED ZONE';
        description = rand > 0.5 ?
          'Skirmishes reported. Artillery support requested.' :
          'Enemy forces infiltrating from the north.';
      }

      mapOverlay.innerHTML = `
        <div class="sector-status">
          <h4>${status}</h4>
          <p>${description}</p>
          <p class="clearance">CLEARANCE REQUIRED</p>
        </div>
      `;

      // Play hover sound
      hoverAudio.currentTime = 0;
      hoverAudio.volume = 0.3;
      hoverAudio.play().catch(e => console.error("Audio play failed:", e));
    });

    territory.addEventListener('mouseleave', () => {
      mapOverlay.innerHTML = '<p>HOVER OVER SECTORS FOR DETAILS</p>';
    });
  });
}

// ===== RESISTANCE EASTER EGG =====
function initResistanceEgg() {
  // Listen for Konami Code
  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        triggerResistanceEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Close button
  eggClose.addEventListener('click', () => {
    resistanceMap.classList.remove('visible');
  });

  // Click network nodes to decrypt messages
  const nodes = document.querySelectorAll('.network-node');
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const nodeId = node.getAttribute('data-id');
      const messages = {
        'node-alpha': 'MESSAGE DECRYPTED: Meet at Grid 7-4 at 2300 hours.',
        'node-beta': 'WARNING: Directorate drones patrolling Sector 9.',
        'node-gamma': 'SUPPLIES: Medicine, rations, and weapons cached at Outpost 12.'
      };
      alert(`[RESISTANCE NETWORK]\n${messages[nodeId]}`);
    });
  });
}

function triggerResistanceEgg() {
  resistanceMap.classList.add('visible');
  staticAudio.pause();
  hoverAudio.currentTime = 0;
  hoverAudio.volume = 0.7;
  hoverAudio.play().catch(e => console.error("Audio play failed:", e));
}

// ===== CLASSIFIED WARNINGS =====
function addClassifiedWarnings() {
  const classifiedElements = [
    document.querySelector('.article-image'),
    document.querySelector('.territory.contested'),
    document.querySelector('.stream-header')
  ];

  classifiedElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const warning = document.createElement('div');
      warning.className = 'classified-warning';
      warning.textContent = '[CLASSIFIED] ACCESS DENIED';
      warning.style.position = 'absolute';
      warning.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      warning.style.color = 'var(--regime-red)';
      warning.style.padding = '5px 10px';
      warning.style.border = '1px solid var(--regime-red)';
      warning.style.fontFamily = 'var(--font-mono)';
      warning.style.fontSize = '0.8rem';
      warning.style.zIndex = '100';
      warning.style.pointerEvents = 'none';

      // Position warning near the element
      const rect = el.getBoundingClientRect();
      warning.style.top = `${rect.top - 30}px`;
      warning.style.left = `${rect.left}px`;

      document.body.appendChild(warning);

      // Remove warning after delay
      setTimeout(() => {
        warning.remove();
      }, 2000);
    });
  });
}

// ===== DATA STREAM =====
function scrollDataStream() {
  const logs = [
    'LOG_XX47-B: CITIZEN COMPLIANCE SCAN COMPLETE ███████████████████████',
    'LOG_XX48-C: PROJECT ECLIPSE ██████████████████████████████████████',
    'LOG_XX49-D: TERMINATION ORDER ISSUED FOR ██████ IN SECTOR 7',
    'LOG_XX50-E: SUPPLY CONVOY INTERCEPTED BY ██████ FORCES NEAR OUTPOST 12',
    'LOG_XX51-F: LOYALTY SCORE FOR CITIZEN #X47-B: 98% (SUSPICIOUS ACTIVITY DETECTED)',
    'LOG_XX52-G: DIRECTORATE PURGE SCHEDULED FOR ██████████████████',
    'LOG_XX53-H: RESISTANCE CELL NEUTRALIZED IN SECTOR 4. 12 TERMINATED, 3 CAPTURED.',
    'LOG_XX54-I: ENCRYPTED TRANSMISSION INTERCEPTED: ██████████████████████████',
    'LOG_XX55-J: OUTPOST 9 REPORTS POWER FLUCTUATIONS. SABOTAGE SUSPECTED.'
  ];

  // Add logs to the stream with random delays
  logs.forEach((log, index) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.textContent = log;
      dataStream.appendChild(p);

      // Remove oldest log when stream gets too long
      if (dataStream.children.length > 20) {
        dataStream.removeChild(dataStream.children[0]);
      }
    }, index * 2000);
  });

  // Keep adding new logs periodically
  setInterval(() => {
    const randomLog = logs[Math.floor(Math.random() * logs.length)];
    const p = document.createElement('p');
    p.textContent = randomLog;
    dataStream.appendChild(p);

    if (dataStream.children.length > 20) {
      dataStream.removeChild(dataStream.children[0]);
    }
  }, 5000);
}

// ===== PROPAGANDA BROADCAST =====
function playPropagandaBroadcast() {
  broadcastPlay.style.display = 'none';
  broadcastStatic.textContent = '░▒▓█ TRANSMISSION ACTIVE █▓▒░';

  // Play distorted speech audio (placeholder)
  broadcastAudio.volume = 0.8;
  broadcastAudio.play().catch(e => console.error("Audio play failed:", e));

  // Animate glitch text
  setTimeout(() => {
    broadcastContent.innerHTML = `
      <div class="broadcast-glitch" data-text="THE DIRECTORATE PROTECTS YOU"></div>
    `;
  }, 2000);

  // Reset after delay
  setTimeout(() => {
    broadcastContent.innerHTML = `
      <p class="broadcast-static">░▒▓█ TRANSMISSION ENDED █▓▒░</p>
      <div class="broadcast-glitch" data-text="GLORY TO THE DIRECTORATE"></div>
    `;
    broadcastPlay.style.display = 'flex';
  }, 8000);
}

// ===== CURRENT DATE (For Propaganda Article) =====
function updateCurrentDate() {
  const date = new Date();
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  document.getElementById('current-date').textContent = formattedDate;
}

// ===== CONSOLE WARNINGS (DevTools Easter Egg) =====
console.log(`
████████╗███████╗███████╗██╗  ██╗██╗████████╗███████╗
╚══██╔══╝██╔════╝██╔════╝██║  ██║██║╚══██╔══╝██╔════╝
   ██║   █████╗  █████╗  ███████║██║   ██║   █████╗
   ██║   ██╔══╝  ██╔══╝  ██╔══██║██║   ██║   ██╔══╝
   ██║   ███████╗███████╗██║  ██║██║   ██║   ███████╗
   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝

[RESISTANCE FREQUENCY]
If you're reading this, you've already taken the first step.
The Directorate's control is not absolute. Seek the others.
Grid coordinates: 7-4, 2300 hours.
`);