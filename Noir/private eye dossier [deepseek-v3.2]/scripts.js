// ==============================================
// NOIR DETECTIVE CASE FILE SYSTEM - INTERACTIVE
// ==============================================

// DOM Elements
const rainOverlay = document.querySelector('.rain-overlay');
const venetianBlinds = document.querySelector('.venetian-blinds');
const smokeTrailContainer = document.querySelector('.smoke-trail-container');
const threadCanvas = document.getElementById('thread-canvas');
const caseNotesText = document.getElementById('case-notes-text');
const evidenceModal = document.getElementById('evidence-modal');
const dossierModal = document.getElementById('dossier-modal');
const clearThreadsBtn = document.getElementById('clear-threads');
const drawThreadsBtn = document.getElementById('draw-threads');
const startTypewriterBtn = document.getElementById('start-typewriter');
const pauseTypewriterBtn = document.getElementById('pause-typewriter');
const resetTypewriterBtn = document.getElementById('reset-typewriter');
const themeToggleBtn = document.getElementById('theme-toggle');
const rainToggleBtn = document.getElementById('rain-toggle');
const blindsToggleBtn = document.getElementById('blinds-toggle');
const smokeToggleBtn = document.getElementById('smoke-toggle');
const printCaseBtn = document.getElementById('print-case');
const closeModalBtns = document.querySelectorAll('.close-modal');

// State variables
let isDrawingThreads = false;
let threads = [];
let isTypewriterActive = false;
let typewriterInterval;
let currentCharIndex = 0;
let originalCaseNotes = '';
let isSmokeActive = false;
let isRainActive = false;
let isBlindsActive = false;
let isDarkTheme = true;
let draggedElement = null;
let mouseX = 0;
let mouseY = 0;

// Evidence data
const evidenceData = {
  'evidence-1': {
    title: 'Crime Scene: Alley Behind Blue Note Club',
    description: 'Primary crime scene where victim Frank Delaney was discovered. Two gunshot wounds to the chest, blood trail suggests body was dragged approximately 15 feet.',
    location: 'Blue Note Alley, Downtown',
    date: 'October 16, 1947 - 02:30 AM',
    status: 'Primary Scene',
    notes: 'Blood spatter pattern indicates victim was standing when first shot was fired. Second shot appears to have been delivered at close range. Empty cigarette pack found nearby - brand matches victim\'s preferred brand.'
  },
  'evidence-2': {
    title: '.38 Caliber Revolver',
    description: 'Weapon found in dumpster two blocks from crime scene. Serial number filed off, but forensic analysis reveals partial numbers consistent with a batch shipped to local gun shop three months prior.',
    location: 'Dumpster on 5th Avenue',
    date: 'October 16, 1947 - 11:15 AM',
    status: 'Weapon',
    notes: 'Ballistics match bullets recovered from victim. Weapon shows signs of recent cleaning - no fingerprints. Traces of gunpowder residue consistent with recent discharge.'
  },
  'evidence-3': {
    title: 'Monogrammed Handkerchief',
    description: 'White linen handkerchief with embroidered initials "V.L." found partially concealed under victim\'s body. Small bloodstain in corner matches victim\'s blood type.',
    location: 'Crime Scene (under victim)',
    date: 'October 16, 1947 - 03:45 AM',
    status: 'Trace Evidence',
    notes: 'Initials match Victor Luciano. High-quality linen suggests expensive taste. Sent to lab for fiber analysis - matches fabric samples from Luciano\'s tailor.'
  },
  'evidence-4': {
    title: 'Anonymous Threat Note',
    description: 'Typewritten note delivered to victim\'s office one week before murder. Message reads: "Stay away from the Blue Note or you\'ll regret it. This is your only warning."',
    location: 'Victim\'s Office',
    date: 'October 9, 1947 - Unknown time',
    status: 'Key Evidence',
    notes: 'Typewriter analysis matches machine in Blue Note Club office. Paper stock is common but watermark indicates batch sold to several downtown businesses.'
  }
};

// Suspect dossier data
const dossierData = {
  'dossier-1': {
    name: 'Victor "Lucky" Luciano',
    alias: 'Nightclub Owner',
    age: '42',
    occupation: 'Proprietor, Blue Note Club',
    associates: 'Johnny "Snake-Eyes" (informant), Various "business associates"',
    record: 'Three arrests (racketeering, assault, tax evasion), No convictions',
    connection: 'Business rival of victim. Victim was investing in competing nightclub venture.',
    assessment: 'Prime suspect. Had motive (business competition), opportunity (alibi provided by employees is questionable), and evidence links him to scene (monogrammed handkerchief). Known for aggressive business tactics.'
  },
  'dossier-2': {
    name: 'Mona Delacroix',
    alias: 'Victim\'s Secretary',
    age: '28',
    occupation: 'Executive Secretary, Delaney Enterprises',
    associates: 'Victim (Frank Delaney), Unknown male caller (per phone records)',
    record: 'None',
    connection: 'Secret romantic relationship with victim according to witness statements.',
    assessment: 'Person of interest. May have knowledge of victim\'s business dealings. Emotional state uncertain following recent breakup with victim. Financial records show large deposit in her account one day after murder - needs investigation.'
  }
};

// Thread connections for corkboard
const threadConnections = [
  { from: 'thread-1', to: 'thread-2', label: 'FOUND AT' },
  { from: 'thread-1', to: 'thread-3', label: 'KILLED WITH' },
  { from: 'thread-1', to: 'thread-4', label: 'BUSINESS RIVAL' },
  { from: 'thread-4', to: 'thread-5', label: 'MOTIVE' },
  { from: 'thread-3', to: 'thread-4', label: 'POSSIBLE OWNER' }
];

// Initialize the application
function init() {
  // Set up canvas
  setupCanvas();
  
  // Save original case notes for typewriter effect
  originalCaseNotes = caseNotesText.innerHTML;
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize corkboard items as draggable
  initDraggableItems();
  
  // Initialize modals
  initModals();
  
  // Set initial state of effects
  updateToggleButtons();
  
  console.log('Noir Detective Case File System initialized.');
}

// Set up canvas for drawing threads
function setupCanvas() {
  const ctx = threadCanvas.getContext('2d');
  const container = threadCanvas.parentElement;
  
  // Set canvas size to match container
  threadCanvas.width = container.clientWidth;
  threadCanvas.height = container.clientHeight;
  
  // Handle window resize
  window.addEventListener('resize', () => {
    threadCanvas.width = container.clientWidth;
    threadCanvas.height = container.clientHeight;
    drawAllThreads();
  });
}

// Set up event listeners
function setupEventListeners() {
  // Corkboard controls
  clearThreadsBtn.addEventListener('click', clearThreads);
  drawThreadsBtn.addEventListener('click', drawAllThreads);
  
  // Typewriter controls
  startTypewriterBtn.addEventListener('click', startTypewriter);
  pauseTypewriterBtn.addEventListener('click', pauseTypewriter);
  resetTypewriterBtn.addEventListener('click', resetTypewriter);
  
  // Effect toggles
  themeToggleBtn.addEventListener('click', toggleTheme);
  rainToggleBtn.addEventListener('click', toggleRain);
  blindsToggleBtn.addEventListener('click', toggleBlinds);
  smokeToggleBtn.addEventListener('click', toggleSmoke);
  printCaseBtn.addEventListener('click', printCase);
  
  // Close modals
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModals);
  });
  
  // Close modals on overlay click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModals();
    }
  });
  
  // Evidence polaroid clicks
  document.querySelectorAll('.polaroid-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const evidenceId = item.getAttribute('data-id');
      openEvidenceModal(evidenceId);
    });
  });
  
  // Dossier button clicks
  document.querySelectorAll('.dossier-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dossierId = btn.getAttribute('data-target');
      openDossierModal(dossierId);
    });
  });
  
  // Witness statement buttons
  document.querySelectorAll('.truth-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      markStatementCredible(e.target.closest('.statement'));
    });
  });
  
  document.querySelectorAll('.doubt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      markStatementDoubtful(e.target.closest('.statement'));
    });
  });
  
  // Track mouse position for effects
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update venetian blinds position
    if (isBlindsActive) {
      updateBlindsPosition(e.clientX, e.clientY);
    }
    
    // Create smoke trail
    if (isSmokeActive) {
      createSmokeTrail(e.clientX, e.clientY);
    }
  });
}

// Initialize draggable corkboard items
function initDraggableItems() {
  const corkboardItems = document.querySelectorAll('.corkboard-item');
  
  corkboardItems.forEach(item => {
    item.addEventListener('mousedown', startDrag);
  });
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

// Drag functionality for corkboard items
function startDrag(e) {
  if (!e.target.closest('.corkboard-item')) return;
  
  draggedElement = e.target.closest('.corkboard-item');
  draggedElement.style.zIndex = '100';
  draggedElement.style.cursor = 'grabbing';
}

function drag(e) {
  if (!draggedElement) return;
  
  const container = draggedElement.parentElement;
  const containerRect = container.getBoundingClientRect();
  const itemRect = draggedElement.getBoundingClientRect();
  
  // Calculate new position
  let newLeft = ((e.clientX - containerRect.left) / containerRect.width) * 100;
  let newTop = ((e.clientY - containerRect.top) / containerRect.height) * 100;
  
  // Constrain to container bounds
  newLeft = Math.max(0, Math.min(newLeft, 100 - (itemRect.width / containerRect.width * 100)));
  newTop = Math.max(0, Math.min(newTop, 100 - (itemRect.height / containerRect.height * 100)));
  
  // Update position
  draggedElement.style.left = `${newLeft}%`;
  draggedElement.style.top = `${newTop}%`;
  
  // Redraw threads if they exist
  if (threads.length > 0) {
    drawAllThreads();
  }
}

function stopDrag() {
  if (draggedElement) {
    draggedElement.style.zIndex = '2';
    draggedElement.style.cursor = 'move';
    draggedElement = null;
  }
}

// Initialize modals
function initModals() {
  // Evidence modal data setup
  // Already handled in event listeners
}

// Open evidence modal
function openEvidenceModal(evidenceId) {
  const evidence = evidenceData[evidenceId];
  if (!evidence) return;
  
  // Update modal content
  document.getElementById('modal-img').src = document.querySelector(`[data-id="${evidenceId}"] img`).src;
  document.getElementById('evidence-title').textContent = evidence.title;
  document.getElementById('evidence-description').textContent = evidence.description;
  document.getElementById('evidence-location').textContent = evidence.location;
  document.getElementById('evidence-date').textContent = evidence.date;
  document.getElementById('evidence-status').textContent = evidence.status;
  document.getElementById('evidence-notes').textContent = evidence.notes;
  
  // Show modal
  evidenceModal.style.display = 'flex';
}

// Open dossier modal
function openDossierModal(dossierId) {
  const dossier = dossierData[dossierId];
  if (!dossier) return;
  
  // Update modal content
  const suspectImg = document.querySelector(`[data-id="${dossierId.replace('dossier', 'suspect')}"] img`);
  if (suspectImg) {
    document.getElementById('dossier-img').src = suspectImg.src;
  }
  
  document.getElementById('dossier-name').textContent = dossier.name;
  document.getElementById('dossier-alias').textContent = dossier.alias;
  document.getElementById('dossier-age').textContent = dossier.age;
  document.getElementById('dossier-occupation').textContent = dossier.occupation;
  document.getElementById('dossier-associates').textContent = dossier.associates;
  document.getElementById('dossier-record').textContent = dossier.record;
  document.getElementById('dossier-connection').textContent = dossier.connection;
  document.getElementById('dossier-assessment').textContent = dossier.assessment;
  
  // Show modal
  dossierModal.style.display = 'flex';
}

// Close all modals
function closeModals() {
  evidenceModal.style.display = 'none';
  dossierModal.style.display = 'none';
}

// Draw red threads on corkboard
function drawAllThreads() {
  const ctx = threadCanvas.getContext('2d');
  const container = threadCanvas.parentElement;
  
  // Clear canvas
  ctx.clearRect(0, 0, threadCanvas.width, threadCanvas.height);
  
  // Reset threads array
  threads = [];
  
  // Draw each thread connection
  threadConnections.forEach(connection => {
    const fromElement = document.querySelector(`[data-id="${connection.from}"]`);
    const toElement = document.querySelector(`[data-id="${connection.to}"]`);
    
    if (!fromElement || !toElement) return;
    
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate positions relative to canvas
    const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
    const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
    const toX = toRect.left + toRect.width / 2 - containerRect.left;
    const toY = toRect.top + toRect.height / 2 - containerRect.top;
    
    // Draw the thread
    drawThread(ctx, fromX, fromY, toX, toY, connection.label);
    
    // Store thread data for potential interactions
    threads.push({
      fromX, fromY, toX, toY, label: connection.label
    });
  });
}

// Draw a single thread
function drawThread(ctx, fromX, fromY, toX, toY, label) {
  // Draw main thread line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = '#c41e3a';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Draw dashed effect
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw thread endpoints
  drawPinpoint(ctx, fromX, fromY);
  drawPinpoint(ctx, toX, toY);
  
  // Draw label if provided
  if (label) {
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    ctx.fillStyle = 'rgba(10, 10, 10, 0.8)';
    ctx.fillRect(midX - 40, midY - 15, 80, 30);
    
    ctx.fillStyle = '#c41e3a';
    ctx.font = '12px "Special Elite", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, midX, midY);
  }
}

// Draw a thread endpoint
function drawPinpoint(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#c41e3a';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

// Clear all threads
function clearThreads() {
  const ctx = threadCanvas.getContext('2d');
  ctx.clearRect(0, 0, threadCanvas.width, threadCanvas.height);
  threads = [];
}

// Typewriter effect functions
function startTypewriter() {
  if (isTypewriterActive) return;
  
  isTypewriterActive = true;
  currentCharIndex = 0;
  caseNotesText.innerHTML = '';
  
  const text = originalCaseNotes.replace(/<[^>]*>/g, '');
  const chars = text.split('');
  
  typewriterInterval = setInterval(() => {
    if (currentCharIndex >= chars.length) {
      pauseTypewriter();
      return;
    }
    
    // Handle HTML tags
    if (originalCaseNotes.substring(currentCharIndex).startsWith('<p>')) {
      caseNotesText.innerHTML += '<p>';
      currentCharIndex += 3;
    } else if (originalCaseNotes.substring(currentCharIndex).startsWith('</p>')) {
      caseNotesText.innerHTML += '</p>';
      currentCharIndex += 4;
    } else {
      caseNotesText.innerHTML += chars[currentCharIndex];
      currentCharIndex++;
    }
    
    // Scroll to bottom
    caseNotesText.scrollTop = caseNotesText.scrollHeight;
  }, 30); // 30ms per character
}

function pauseTypewriter() {
  isTypewriterActive = false;
  clearInterval(typewriterInterval);
}

function resetTypewriter() {
  pauseTypewriter();
  caseNotesText.innerHTML = originalCaseNotes;
  currentCharIndex = 0;
}

// Effect toggle functions
function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  
  if (isDarkTheme) {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeToggleBtn.innerHTML = '<i class="fas fa-adjust"></i><span>LIGHT MODE</span>';
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeToggleBtn.innerHTML = '<i class="fas fa-adjust"></i><span>DARK MODE</span>';
  }
}

function toggleRain() {
  isRainActive = !isRainActive;
  
  if (isRainActive) {
    rainOverlay.classList.add('active');
    rainToggleBtn.innerHTML = '<i class="fas fa-cloud-sun"></i><span>STOP RAIN</span>';
  } else {
    rainOverlay.classList.remove('active');
    rainToggleBtn.innerHTML = '<i class="fas fa-cloud-rain"></i><span>RAIN EFFECT</span>';
  }
}

function toggleBlinds() {
  isBlindsActive = !isBlindsActive;
  
  if (isBlindsActive) {
    venetianBlinds.classList.add('active');
    blindsToggleBtn.innerHTML = '<i class="fas fa-blind"></i><span>HIDE BLINDS</span>';
  } else {
    venetianBlinds.classList.remove('active');
    blindsToggleBtn.innerHTML = '<i class="fas fa-blind"></i><span>BLINDS EFFECT</span>';
  }
}

function toggleSmoke() {
  isSmokeActive = !isSmokeActive;
  
  if (isSmokeActive) {
    smokeToggleBtn.innerHTML = '<i class="fas fa-wind"></i><span>STOP SMOKE</span>';
  } else {
    smokeToggleBtn.innerHTML = '<i class="fas fa-smog"></i><span>SMOKE TRAIL</span>';
    // Clear existing smoke
    smokeTrailContainer.innerHTML = '';
  }
}

function updateBlindsPosition(x, y) {
  const xPercent = x / window.innerWidth;
  const yPercent = y / window.innerHeight;
  
  // Move blinds based on mouse position
  venetianBlinds.style.transform = `translate(${xPercent * 20 - 10}px, ${yPercent * 20 - 10}px)`;
}

function createSmokeTrail(x, y) {
  if (!isSmokeActive) return;
  
  const smoke = document.createElement('div');
  smoke.className = 'smoke-wisp';
  smoke.style.left = `${x}px`;
  smoke.style.top = `${y}px`;
  
  // Randomize smoke appearance
  const size = Math.random() * 20 + 10;
  smoke.style.width = `${size}px`;
  smoke.style.height = `${size}px`;
  smoke.style.opacity = Math.random() * 0.5 + 0.3;
  
  smokeTrailContainer.appendChild(smoke);
  
  // Animate smoke
  const animation = smoke.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: smoke.style.opacity },
    { transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(2)`, opacity: 0 }
  ], {
    duration: Math.random() * 1000 + 1000,
    easing: 'ease-out'
  });
  
  // Remove smoke after animation
  animation.onfinish = () => {
    smoke.remove();
  };
}

// Update toggle button states
function updateToggleButtons() {
  if (isRainActive) {
    rainToggleBtn.innerHTML = '<i class="fas fa-cloud-sun"></i><span>STOP RAIN</span>';
  }
  
  if (isBlindsActive) {
    blindsToggleBtn.innerHTML = '<i class="fas fa-blind"></i><span>HIDE BLINDS</span>';
  }
  
  if (isSmokeActive) {
    smokeToggleBtn.innerHTML = '<i class="fas fa-wind"></i><span>STOP SMOKE</span>';
  }
  
  if (!isDarkTheme) {
    themeToggleBtn.innerHTML = '<i class="fas fa-adjust"></i><span>DARK MODE</span>';
  }
}

// Mark statement as credible
function markStatementCredible(statementElement) {
  const header = statementElement.querySelector('.statement-header');
  header.style.borderBottomColor = '#4caf50';
  
  // Add checkmark
  const checkmark = document.createElement('span');
  checkmark.innerHTML = ' <i class="fas fa-check-circle"></i> MARKED CREDIBLE';
  checkmark.style.color = '#4caf50';
  checkmark.style.fontSize = '0.8rem';
  header.appendChild(checkmark);
  
  // Disable buttons
  const buttons = statementElement.querySelectorAll('.statement-btn');
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.5';
  });
}

// Mark statement as doubtful
function markStatementDoubtful(statementElement) {
  const header = statementElement.querySelector('.statement-header');
  header.style.borderBottomColor = '#f44336';
  
  // Add question mark
  const question = document.createElement('span');
  question.innerHTML = ' <i class="fas fa-question-circle"></i> MARKED DOUBTFUL';
  question.style.color = '#f44336';
  question.style.fontSize = '0.8rem';
  header.appendChild(question);
  
  // Disable buttons
  const buttons = statementElement.querySelectorAll('.statement-btn');
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.5';
  });
}

// Print case file
function printCase() {
  window.print();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add CSS for smoke wisps dynamically
const smokeStyles = document.createElement('style');
smokeStyles.textContent = `
  .smoke-wisp {
    position: absolute;
    background-color: rgba(200, 200, 200, 0.7);
    border-radius: 50%;
    pointer-events: none;
    z-index: 4;
    transform-origin: center;
  }
`;
document.head.appendChild(smokeStyles);

// Add initial drawing of threads
window.addEventListener('load', () => {
  // Small delay to ensure everything is rendered
  setTimeout(() => {
    drawAllThreads();
  }, 500);
});