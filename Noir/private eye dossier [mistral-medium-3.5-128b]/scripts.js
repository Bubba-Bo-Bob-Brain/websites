// ===== DOM Elements =====
const witnessTypewriter = document.getElementById('witnessTypewriter');
const witnessText = witnessTypewriter.querySelector('.witness-text');
const witnessButtons = document.querySelectorAll('.witness-btn');
const corkboard = document.getElementById('corkboard');
const threadLayer = document.getElementById('threadLayer');
const smokeTrail = document.getElementById('smokeTrail');
const suspectCards = document.querySelectorAll('.suspect-card');

// ===== Witness Statements Data =====
const witnessStatements = {
  bartender: {
    name: "Bartender at The Velvet Lounge",
    text: "I saw Victor Kane arguing with the victim around 10 PM. He was real mad, slamming his fist on the bar. Left in a hurry after. Lila Darling was singing that night, but she slipped out the back around 11. Didn't see her again."
  },
  'taxi-driver': {
    name: "Taxi Driver (Night Shift)",
    text: "Picked up a fare near the docks at 11:30 PM. Man in a trench coat, hat pulled low. Paid in cash, no tip. Dropped him off at the old warehouse district. Didn't see his face, but he smelled like whiskey and gun oil."
  },
  'street-vendor': {
    name: "Street Vendor (Hot Dogs)",
    text: "Saw Lila Darling buying a hot dog around midnight. She was alone, but real jumpy. Kept looking over her shoulder. Then this big fella in a suit—Eddie Valentine, I think—walked by. She ducked into an alley real quick."
  }
};

// ===== Corkboard Data =====
const corkboardItems = document.querySelectorAll('.corkboard-item');
let connections = [
  { from: 'victor-kane', to: 'docks' },
  { from: 'lila-darling', to: 'lipstick' },
  { from: 'lipstick', to: 'revolver' },
  { from: 'revolver', to: 'docks' }
];

// ===== Typewriter Effect =====
function typeWriter(text, callback) {
  witnessText.textContent = '';
  let i = 0;
  const speed = 30; // ms per character

  function type() {
    if (i < text.length) {
      witnessText.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      if (callback) callback();
    }
  }

  type();
}

// ===== Load Witness Statement =====
function loadWitnessStatement(witnessKey) {
  const statement = witnessStatements[witnessKey];
  const fullText = `${statement.name}\n\n${statement.text}`;

  // Add blinking cursor
  witnessText.style.borderRight = '2px solid var(--blood-red)';
  typeWriter(fullText, () => {
    witnessText.style.borderRight = 'none';
  });
}

// ===== Initialize Witness Buttons =====
witnessButtons.forEach(button => {
  button.addEventListener('click', () => {
    const witnessKey = button.dataset.witness;
    loadWitnessStatement(witnessKey);

    // Highlight active button
    witnessButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

// Load default witness statement
loadWitnessStatement('bartender');
witnessButtons[0].classList.add('active');

// ===== Corkboard: Draggable Pins =====
let draggedItem = null;
let offsetX, offsetY;

// Initialize positions for corkboard items
corkboardItems.forEach(item => {
  const x = Math.random() * (corkboard.offsetWidth - 100);
  const y = Math.random() * (corkboard.offsetHeight - 100);
  item.style.left = `${x}px`;
  item.style.top = `${y}px`;

  // Make draggable
  item.addEventListener('mousedown', startDrag);
});

function startDrag(e) {
  draggedItem = e.target.closest('.corkboard-item');
  if (!draggedItem) return;

  // Calculate offset from mouse to item's top-left corner
  const rect = draggedItem.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  // Bring to front
  draggedItem.style.zIndex = '100';

  // Add event listeners for dragging
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
}

function drag(e) {
  if (!draggedItem) return;

  const corkboardRect = corkboard.getBoundingClientRect();
  let x = e.clientX - corkboardRect.left - offsetX;
  let y = e.clientY - corkboardRect.top - offsetY;

  // Constrain to corkboard bounds
  x = Math.max(0, Math.min(x, corkboardRect.width - draggedItem.offsetWidth));
  y = Math.max(0, Math.min(y, corkboardRect.height - draggedItem.offsetHeight));

  draggedItem.style.left = `${x}px`;
  draggedItem.style.top = `${y}px`;

  // Update connections
  updateConnections();
}

function stopDrag() {
  if (draggedItem) {
    draggedItem.style.zIndex = '1';
    draggedItem = null;
  }
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
}

// ===== Corkboard: Red Thread Connections =====
function updateConnections() {
  // Clear existing threads
  threadLayer.innerHTML = '';

  connections.forEach(connection => {
    const fromItem = document.querySelector(`.corkboard-item[data-clue="${connection.from}"]`);
    const toItem = document.querySelector(`.corkboard-item[data-clue="${connection.to}"]`);

    if (!fromItem || !toItem) return;

    const fromRect = fromItem.getBoundingClientRect();
    const toRect = toItem.getBoundingClientRect();
    const corkboardRect = corkboard.getBoundingClientRect();

    // Calculate positions relative to corkboard
    const fromX = fromRect.left + fromRect.width / 2 - corkboardRect.left;
    const fromY = fromRect.top + fromRect.height / 2 - corkboardRect.top;
    const toX = toRect.left + toRect.width / 2 - corkboardRect.left;
    const toY = toRect.top + toRect.height / 2 - corkboardRect.top;

    // Create SVG path for the thread
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${fromX},${fromY} Q${(fromX + toX) / 2},${(fromY + toY) / 2} ${toX},${toY}`);
    path.setAttribute('stroke', 'var(--blood-red)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    threadLayer.appendChild(path);
  });
}

// Initialize connections
updateConnections();

// ===== Smoke Trail Cursor =====
let smokeTimeout;
document.addEventListener('mousemove', (e) => {
  // Clear previous timeout
  clearTimeout(smokeTimeout);

  // Position smoke trail
  smokeTrail.style.left = `${e.clientX - 10}px`;
  smokeTrail.style.top = `${e.clientY - 10}px`;
  smokeTrail.style.opacity = '0.5';

  // Fade out after delay
  smokeTimeout = setTimeout(() => {
    smokeTrail.style.opacity = '0';
  }, 500);
});

// ===== Suspect Card Interactions =====
suspectCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px) scale(1.02)';
    card.style.boxShadow = '0 8px 25px rgba(209, 27, 43, 0.3)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
  });

  // Toggle suspect status on click
  card.addEventListener('click', () => {
    const statusElement = card.querySelector('.suspect-status');
    if (statusElement.classList.contains('eliminated')) {
      statusElement.classList.remove('eliminated');
      statusElement.classList.add('active');
      statusElement.textContent = 'ACTIVE';
    } else {
      statusElement.classList.remove('active');
      statusElement.classList.add('eliminated');
      statusElement.textContent = 'ELIMINATED';
    }
  });
});

// ===== Random Rain Intensity =====
function randomizeRain() {
  const rainOverlay = document.querySelector('.rain-overlay::before');
  if (!rainOverlay) return;

  // Randomize rain speed and opacity
  const rainSpeed = 0.5 + Math.random() * 1; // 0.5s to 1.5s
  const rainOpacity = 0.1 + Math.random() * 0.2; // 0.1 to 0.3

  document.documentElement.style.setProperty('--rain-speed', `${rainSpeed}s`);
  document.documentElement.style.setProperty('--rain-opacity', rainOpacity);

  // Apply to rain overlay
  const style = document.createElement('style');
  style.textContent = `
    .rain-overlay::before {
      animation-duration: var(--rain-speed);
      opacity: var(--rain-opacity);
    }
  `;
  document.head.appendChild(style);
}

// Initialize random rain
randomizeRain();
setInterval(randomizeRain, 5000); // Change rain intensity every 5 seconds

// ===== Venetian Blinds Animation =====
function randomizeBlinds() {
  const blindsSpeed = 3 + Math.random() * 3; // 3s to 6s
  document.documentElement.style.setProperty('--blinds-speed', `${blindsSpeed}s`);
}

// Initialize random blinds
randomizeBlinds();
setInterval(randomizeBlinds, 8000); // Change blinds speed every 8 seconds

// ===== Lamp Flicker =====
function randomizeLampFlicker() {
  const lampLight = document.querySelector('.lamp-light');
  if (!lampLight) return;

  // Random flicker effect
  const flickerDuration = 0.1 + Math.random() * 0.5; // 0.1s to 0.6s
  lampLight.style.animation = `flicker ${flickerDuration}s infinite alternate`;
}

// Initialize lamp flicker
randomizeLampFlicker();
setInterval(randomizeLampFlicker, 2000); // Change flicker speed every 2 seconds