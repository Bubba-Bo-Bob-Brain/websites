// DOM Element References
const liveTimeEl = document.querySelector('.live-time');
const livePlayerCountEl = document.querySelector('.live-player-count');
const territoryCells = document.querySelectorAll('.territory-cell');
const progressFills = document.querySelectorAll('.progress-fill');
const hpFills = document.querySelectorAll('.hp-fill');
const sparkBars = document.querySelectorAll('.spark-bar');
const logEntries = document.querySelector('.combat-logs');
const statusLatencies = document.querySelectorAll('.latency');
const weatherIcons = document.querySelectorAll('.weather-icon');
const eventTimers = document.querySelectorAll('.event-meta span:first-child');

// Game State
const gameState = {
  playerCount: 12847,
  maxPlayers: 24000,
  activeRaids: 12,
  totalRaids: 20,
  weatherCycle: 0,
  territoryBattles: {
    'Borderlands': 3,
    'Swamp of Sorrows': 1,
    'River Ford': 2,
    'Central Plains': 5,
    'Eastern Border': 4,
    'Southern Coast': 3,
    'Open Sea': 1,
    'Mountain Pass': 2,
    'Trade Route': 2
  }
};

// Utility Functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Live Clock Update
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  if (liveTimeEl) {
    liveTimeEl.textContent = `${hours}:${minutes}:${seconds}`;
  }
}

// Player Count Fluctuation
function updatePlayerCount() {
  const change = randomInt(-50, 75);
  gameState.playerCount = Math.max(10000, Math.min(gameState.maxPlayers, gameState.playerCount + change));
  
  if (livePlayerCountEl) {
    livePlayerCountEl.textContent = formatNumber(gameState.playerCount);
  }
}

// Territory Battle Simulation
function updateTerritoryBattles() {
  const contestedCells = document.querySelectorAll('.territory-cell.contested');
  
  contestedCells.forEach(cell => {
    const title = cell.getAttribute('title');
    if (title && title.includes('Battles')) {
      const currentBattles = parseInt(title.match(/\d+/)?.[0] || 1);
      const change = randomInt(-1, 1);
      const newBattles = Math.max(1, currentBattles + change);
      
      if (newBattles !== currentBattles) {
        const location = title.split(':')[0].trim();
        cell.setAttribute('title', `${location}: Contested, ${newBattles} Active Battles`);
        cell.childNodes[0].textContent = `⚔️ ${newBattles} Battles`;
        
        // Visual feedback
        cell.style.transform = 'scale(1.2)';
        cell.style.boxShadow = '0 0 15px rgba(255, 221, 77, 0.6)';
        setTimeout(() => {
          cell.style.transform = '';
          cell.style.boxShadow = '';
        }, 300);
      }
    }
  });
}

// Raid Progress Simulation
function updateRaidProgress() {
  const raidParties = document.querySelectorAll('.raid-party');
  
  raidParties.forEach(party => {
    const hpBar = party.querySelector('.hp-fill');
    if (!hpBar) return;
    
    let currentWidth = parseFloat(hpBar.style.width) || 50;
    const bossName = party.querySelector('.boss-name')?.textContent || '';
    
    // Bosses shouldn't reach 0 too quickly
    if (currentWidth > 5 && currentWidth < 95) {
      const change = randomFloat(-3, 2);
      currentWidth = Math.max(0, Math.min(100, currentWidth + change));
      hpBar.style.width = `${currentWidth}%`;
      
      // Update text if it exists
      const progressText = party.querySelector('.hp-bar')?.nextElementSibling;
      if (progressText && progressText.classList.contains('wipe-count')) {
        // Keep wipe count as is, just update visual
      }
    }
  });
}

// Marketplace Price Updates
function updateMarketPrices() {
  const priceCells = document.querySelectorAll('.market-table td.price-up, .market-table td.price-down');
  
  priceCells.forEach(cell => {
    if (Math.random() > 0.7) {
      const currentValue = parseFloat(cell.textContent.match(/[+-]?\d+\.\d+%/) ?.[0] || 0);
      const change = randomFloat(-0.5, 0.5);
      const newValue = (currentValue + change).toFixed(1);
      const sign = newValue >= 0 ? '+' : '';
      const arrow = newValue >= 0 ? '🔼' : '🔽';
      
      cell.textContent = `${arrow} ${sign}${newValue}%`;
      cell.className = newValue >= 0 ? 'price-up' : 'price-down';
    }
  });
}

// Combat Log Updates
function addCombatLogEntry() {
  const combatTypes = [
    { emoji: '⚔️', text: 'Player killed Player in PvP', locations: ['Aethelgard Plains', 'Frostveil Peaks', 'Borderlands', 'Central Plains'] },
    { emoji: '🐉', text: 'Player defeated World Boss', locations: ['Dragon Lair', 'Volcano Core'] },
    { emoji: '💀', text: 'Party wiped on Boss', locations: ['Castle Blackspire', 'Shadow Crypt', 'Frostveil Cavern'] },
    { emoji: '💰', text: 'Player sold rare item for', locations: ['Marketplace', 'Trade Hub'] },
    { emoji: '⚔️', text: 'Guild won territory battle', locations: ['Borderlands', 'River Ford', 'Eastern Border'] },
    { emoji: '💎', text: 'Player found rare resource', locations: ['Frostveil Peaks', 'Desert of Ashes', 'Ancient Grove'] }
  ];
  
  const randomType = combatTypes[randomInt(0, combatTypes.length - 1)];
  const randomLocation = randomType.locations[randomInt(0, randomType.locations.length - 1)];
  const playerNames = ['Arthas', 'ShadowRogue', 'BowMaster', 'WarChief', 'FrostMage', 'SlayerGirl', 'TankMain', 'MasterSmith', 'OreBaron', 'LumberJack'];
  const randomPlayer = playerNames[randomInt(0, playerNames.length - 1)];
  
  const now = new Date();
  const timeStr = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}]`;
  
  let message = '';
  if (randomType.text.includes('Player killed')) {
    message = `${randomType.emoji} Player ${randomPlayer} killed Player ${playerNames[randomInt(0, playerNames.length - 1)]} in PvP (${randomLocation})`;
  } else if (randomType.text.includes('defeated')) {
    message = `${randomType.emoji} Player ${randomPlayer} ${randomType.text.replace('Player', '')} (${randomLocation})`;
  } else if (randomType.text.includes('wiped')) {
    message = `${randomType.emoji} Party ${randomPlayer.substring(0, 1)} wiped on Boss ${randomLocation}`;
  } else if (randomType.text.includes('sold')) {
    message = `${randomType.emoji} Player ${randomPlayer} ${randomType.text} ${randomInt(1000, 50000)} gold`;
  } else if (randomType.text.includes('Guild')) {
    message = `${randomType.emoji} ${randomType.text.replace('Guild', 'Aethelgard Alliance')} (${randomLocation})`;
  } else {
    message = `${randomType.emoji} Player ${randomPlayer} ${randomType.text} (${randomLocation})`;
  }
  
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `<span class="log-time">${timeStr}</span><span class="log-text">${message}</span>`;
  
  if (logEntries) {
    logEntries.insertBefore(logEntry, logEntries.firstChild);
    
    // Keep only last 20 entries
    while (logEntries.children.length > 20) {
      logEntries.removeChild(logEntries.lastChild);
    }
  }
}

// System Status Updates
function updateSystemStatus() {
  statusLatencies.forEach(latency => {
    const currentLatency = parseInt(latency.textContent) || 10;
    const change = randomInt(-3, 3);
    const newLatency = Math.max(1, currentLatency + change);
    latency.textContent = `${newLatency}ms`;
  });
}

// Network Traffic Sparkline Animation
function animateNetworkTraffic() {
  const trafficBars = document.querySelectorAll('.traffic-sparkline .spark-bar');
  trafficBars.forEach(bar => {
    const newHeight = randomInt(20, 100);
    bar.style.height = `${newHeight}%`;
  });
}

// Weather Cycle Simulation
function updateWeather() {
  const weatherTypes = ['☀️', '🌤️', '☁️', '🌧️', '⛈️', '❄️', '🌨️', '🌫️', '🌑', '🔥'];
  
  weatherIcons.forEach((icon, index) => {
    if (Math.random() > 0.8) {
      const newWeather = weatherTypes[randomInt(0, weatherTypes.length - 1)];
      icon.textContent = newWeather;
      
      // Brief animation
      icon.style.transform = 'scale(1.3)';
      setTimeout(() => {
        icon.style.transform = '';
      }, 200);
    }
  });
}

// Event Timer Updates
function updateEventTimers() {
  eventTimers.forEach(timer => {
    const text = timer.textContent;
    if (text.includes('Ends in') || text.includes('Starts in') || text.includes('Spawns in')) {
      // Simulate time passing (just for visual effect)
      const match = text.match(/(\d+[dhms])/g);
      if (match && match.length > 0) {
        // Occasionally decrement the first time unit
        if (Math.random() > 0.5) {
          const timePart = match[0];
          const value = parseInt(timePart);
          const unit = timePart.slice(-1);
          
          if (value > 0) {
            const newValue = value - 1;
            const newText = text.replace(timePart, `${newValue}${unit}`);
            timer.textContent = newText;
          }
        }
      }
    }
  });
}

// Ambient Particle System (Fantasy Theme)
function createParticles() {
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  particleContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
    overflow: hidden;
  `;
  document.body.appendChild(particleContainer);
  
  const particles = ['✨', '⭐', '🌟', '💫', '🔮', '🧝', '🧙', '🐉'];
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.textContent = particles[randomInt(0, particles.length - 1)];
    particle.style.cssText = `
      position: absolute;
      left: ${randomInt(0, 100)}%;
      top: ${randomInt(0, 100)}%;
      font-size: ${randomInt(12, 20)}px;
      opacity: ${randomFloat(0.1, 0.4)};
      animation: float ${randomInt(10, 20)}s infinite linear;
      animation-delay: ${randomInt(0, 10)}s;
      pointer-events: none;
    `;
    particleContainer.appendChild(particle);
  }
  
  // Add floating animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Interactive Territory Map
function initTerritoryMap() {
  territoryCells.forEach(cell => {
    cell.addEventListener('click', function() {
      const title = this.getAttribute('title');
      const faction = this.classList.contains('aethelgard') ? 'Aethelgard' :
                     this.classList.contains('frostveil') ? 'Frostveil' :
                     this.classList.contains('sylvan') ? 'Sylvan' :
                     this.classList.contains('contested') ? 'Contested' : 'Unclaimed';
      
      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = title || `${faction} Territory`;
      tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid var(--border-glow);
        color: var(--text-primary);
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 11px;
        z-index: 10000;
        pointer-events: none;
        box-shadow: 0 0 20px rgba(74, 74, 255, 0.5);
        font-family: var(--font-body);
        max-width: 300px;
      `;
      
      document.body.appendChild(tooltip);
      
      const moveTooltip = (e) => {
        tooltip.style.left = `${e.clientX + 15}px`;
        tooltip.style.top = `${e.clientY + 15}px`;
      };
      
      document.addEventListener('mousemove', moveTooltip);
      
      setTimeout(() => {
        document.removeEventListener('mousemove', moveTooltip);
        tooltip.remove();
      }, 3000);
    });
    
    // Hover sound effect simulation (visual feedback)
    cell.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.2s ease';
    });
  });
}

// Sparkline Hover Effects
function initSparklines() {
  sparkBars.forEach(bar => {
    bar.addEventListener('mouseenter', function() {
      this.style.background = 'var(--text-accent)';
      this.style.boxShadow = '0 0 10px var(--text-accent)';
    });
    
    bar.addEventListener('mouseleave', function() {
      this.style.background = '';
      this.style.boxShadow = '';
    });
  });
}

// Live Data Feeds Simulation
function startLiveDataFeeds() {
  // Update clock every second
  setInterval(updateClock, 1000);
  
  // Update player count every 3 seconds
  setInterval(updatePlayerCount, 3000);
  
  // Update territory battles every 5 seconds
  setInterval(updateTerritoryBattles, 5000);
  
  // Update raid progress every 2 seconds
  setInterval(updateRaidProgress, 2000);
  
  // Update market prices every 4 seconds
  setInterval(updateMarketPrices, 4000);
  
  // Add combat log entry every 3-8 seconds
  setInterval(addCombatLogEntry, randomInt(3000, 8000));
  
  // Update system status every 2 seconds
  setInterval(updateSystemStatus, 2000);
  
  // Animate network traffic every 1 second
  setInterval(animateNetworkTraffic, 1000);
  
  // Update weather every 10 seconds
  setInterval(updateWeather, 10000);
  
  // Update event timers every 30 seconds
  setInterval(updateEventTimers, 30000);
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  // Initial clock update
  updateClock();
  
  // Start live data feeds
  startLiveDataFeeds();
  
  // Initialize interactive features
  initTerritoryMap();
  initSparklines();
  
  // Create ambient particles
  createParticles();
  
  // Add some initial randomness to sparklines
  sparkBars.forEach(bar => {
    const currentHeight = parseInt(bar.style.height) || randomInt(20, 100);
    bar.style.height = `${Math.max(10, Math.min(100, currentHeight + randomInt(-10, 10)))}%`;
  });
  
  // Initial territory battle counts
  updateTerritoryBattles();
  
  console.log('🔥 Aethelgard Realm Dashboard initialized');
  console.log('📊 Live data feeds active');
  console.log('✨ Ambient particles enabled');
  console.log('⚔️ Territory wars being simulated');
});