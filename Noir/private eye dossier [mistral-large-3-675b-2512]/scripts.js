// ===== ATMOSPHERE EFFECTS =====
// Smoke Wisp Cursor Trail
const smokeCanvas = document.querySelector('.smoke');
const smokeCtx = smokeCanvas.getContext('2d');
let smokeParticles = [];

// Initialize canvas
function initSmoke() {
  smokeCanvas.width = window.innerWidth;
  smokeCanvas.height = window.innerHeight;
  smokeCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  window.addEventListener('mousemove', (e) => {
    createSmokeParticle(e.clientX, e.clientY);
  });
  window.addEventListener('resize', initSmoke);
  animateSmoke();
}

// Smoke particle class
class SmokeParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 10 + 5;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 + 1;
    this.opacity = 0.5;
    this.decay = Math.random() * 0.01 + 0.005;
  }

  update() {
    this.x += this.speedX;
    this.y -= this.speedY;
    this.opacity -= this.decay;
    return this.opacity > 0;
  }

  draw() {
    smokeCtx.globalAlpha = this.opacity;
    smokeCtx.fillStyle = `hsl(0, 0%, ${Math.random() * 30 + 70}%)`;
    smokeCtx.beginPath();
    smokeCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    smokeCtx.fill();
    smokeCtx.globalAlpha = 1;
  }
}

// Create smoke particle on mousemove
function createSmokeParticle(x, y) {
  for (let i = 0; i < 3; i++) {
    smokeParticles.push(new SmokeParticle(x, y));
  }
}

// Animate smoke particles
function animateSmoke() {
  smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
  smokeParticles = smokeParticles.filter(particle => particle.update());
  smokeParticles.forEach(particle => particle.draw());
  requestAnimationFrame(animateSmoke);
}

// Randomize rain intensity
function randomizeRain() {
  const rain = document.querySelector('.rain');
  setInterval(() => {
    const opacity = Math.random() * 0.1 + 0.05;
    rain.style.opacity = opacity;
  }, 3000);
}

// ===== CORKBOARD CONSPIRACY THREADS =====
function drawThreadConnections() {
  const pins = document.querySelectorAll('.pin');
  const threadSVG = document.querySelector('.thread');
  const connections = [
    { from: 0, to: 1 }, // Pin 1 -> Pin 2
    { from: 1, to: 2 }, // Pin 2 -> Pin 3
    { from: 0, to: 2 }  // Pin 1 -> Pin 3
  ];

  connections.forEach(conn => {
    const fromPin = pins[conn.from].getBoundingClientRect();
    const toPin = pins[conn.to].getBoundingClientRect();
    const corkboard = document.querySelector('.corkboard').getBoundingClientRect();

    // Calculate positions relative to corkboard
    const fromX = fromPin.left - corkboard.left + fromPin.width / 2;
    const fromY = fromPin.top - corkboard.top + fromPin.height / 2;
    const toX = toPin.left - corkboard.left + toPin.width / 2;
    const toY = toPin.top - corkboard.top + toPin.height / 2;

    // Create SVG path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'thread-path');
    path.setAttribute('d', `M${fromX} ${fromY} Q${(fromX + toX) / 2} ${(fromY + toY) / 2} ${toX} ${toY}`);
    threadSVG.appendChild(path);
  });
}

// ===== CASE NOTES INTERACTIVITY =====
function initFolders() {
  const folders = document.querySelectorAll('.folder');
  folders.forEach(folder => {
    const tab = folder.querySelector('.folder-tab');
    const content = folder.querySelector('.folder-content');
    const status = folder.querySelector('.folder-status');

    // Toggle folder content
    tab.addEventListener('click', () => {
      const isExpanded = content.style.display !== 'none';
      content.style.display = isExpanded ? 'none' : 'block';
      status.textContent = isExpanded ? '[UNREAD]' : '[READ]';

      // Reset typewriter effect on reopen
      if (!isExpanded) {
        const typewriterTexts = content.querySelectorAll('.typewriter-text');
        typewriterTexts.forEach(text => {
          text.style.width = '0';
          setTimeout(() => {
            text.style.width = '100%';
          }, 10);
        });
      }
    });

    // Initialize: hide content
    content.style.display = 'none';
  });
}

// ===== INITIALIZE ALL EFFECTS =====
document.addEventListener('DOMContentLoaded', () => {
  initSmoke();
  randomizeRain();
  drawThreadConnections();
  initFolders();

  // Optional: Add subtle vinyl crackle sound (uncomment if assets available)
  // const crackle = new Audio('crackle.mp3');
  // crackle.loop = true;
  // crackle.volume = 0.1;
  // crackle.play();
});