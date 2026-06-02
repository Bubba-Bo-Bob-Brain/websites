// ===== GLOBAL VARIABLES =====
const body = document.body;
const audioToggle = document.getElementById('audio-toggle');
const ambientAudio = document.getElementById('ambient-audio');
const glitchAudio = document.getElementById('glitch-audio');
const hoverAudio = document.getElementById('hover-audio');
const enterPortal = document.getElementById('enter-wasteland');
const veinLinks = document.querySelectorAll('.vein-link');
const zoneModal = document.getElementById('zone-modal');
const modalClose = document.querySelector('.modal-close');
const filterButtons = document.querySelectorAll('.filter-btn');
const mutationCards = document.querySelectorAll('.mutation-card');
const terminalLines = document.querySelectorAll('.terminal-line');
const terminalBtn = document.querySelector('.terminal-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const gearCheckboxes = document.querySelectorAll('.gear-checkbox');
const anomalyForm = document.getElementById('anomaly-form');
const treeNodes = document.querySelectorAll('.tree-node');

// ===== HERO TERMINAL =====
// Glitch title sync
const terminalGlitch = document.querySelector('.terminal-glitch');
let glitchInterval;
function startGlitch() {
  glitchInterval = setInterval(() => {
    terminalGlitch.style.animation = 'none';
    void terminalGlitch.offsetWidth; // Trigger reflow
    terminalGlitch.style.animation = 'glitch 2s infinite alternate';
  }, 4000);
}
startGlitch();

// Enter Wasteland Portal Effect
enterPortal.addEventListener('click', () => {
  const portalCircle = enterPortal.querySelector('.portal-circle');
  portalCircle.style.transform = 'translate(-50%, -50%) scale(2)';
  portalCircle.style.opacity = '0';
  glitchAudio.currentTime = 0;
  glitchAudio.play();

  setTimeout(() => {
    portalCircle.style.transition = 'none';
    portalCircle.style.transform = 'translate(-50%, -50%) scale(0)';
    portalCircle.style.opacity = '1';
    body.style.overflow = 'hidden'; // Lock scroll
    setTimeout(() => {
      body.style.overflow = 'auto';
      document.querySelector('#map').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }, 500);
});

// Ambient Audio Toggle
audioToggle.addEventListener('click', () => {
  if (ambientAudio.paused) {
    ambientAudio.play();
    audioToggle.innerHTML = '<span class="audio-icon">🔇</span>';
  } else {
    ambientAudio.pause();
    audioToggle.innerHTML = '<span class="audio-icon">🔊</span>';
  }
});

// Vein Navigation Hover Effects
veinLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    hoverAudio.currentTime = 0;
    hoverAudio.play();
    link.style.transform = 'translateY(-2px)';
  });
  link.addEventListener('mouseleave', () => {
    link.style.transform = 'translateY(0)';
  });
});

// ===== CONTAMINATION MAP =====
const zones = document.querySelectorAll('.zone');
const zoneLabels = document.querySelectorAll('.zone-label');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalLore = document.getElementById('modal-lore');

// Zone click handlers
zones.forEach(zone => {
  zone.addEventListener('click', () => {
    const zoneId = zone.id.replace('zone-', '');
    const label = document.querySelector(`.zone-label[data-zone="${zoneId}"]`);

    modalTitle.textContent = label.textContent;
    modalImage.src = `assets/mutations/${zoneId}.png`;
    modalImage.alt = label.textContent;

    // Lore content (simplified for demo)
    const loreContent = {
      jungle: `
        <p>The Toxic Jungle is a sprawling, bioluminescent hellscape where flora has mutated into predatory horrors. Towering spore-trees release hallucinogenic clouds, and the ground is carpeted with carnivorous vines that drag unwary travelers into the acidic muck below.</p>
        <ul>
          <li><strong>Threats:</strong> Razorleaf Crawlers, Spore Zombies, Mycelium Stranglers</li>
          <li><strong>Resources:</strong> Glowcap Mushrooms, Acid-Resistant Chitin</li>
        </ul>
      `,
      slums: `
        <p>The Cyber-Rot Slums are a lawless sprawl of rusted shipping containers and repurposed server farms. The air hums with the static of dying machines, and the streets run thick with bio-gel from ruptured synth-flesh vats.</p>
        <ul>
          <li><strong>Threats:</strong> Scrap Golems, Flesh-Hackers, Nano-Swarms</li>
          <li><strong>Resources:</strong> Salvaged Cybernetics, Blood Gel</li>
        </ul>
      `,
      necropolis: `
        <p>The Floating Necropolis drifts above the wasteland, a decaying sky-city held aloft by anti-grav engines. The dead do not rest here—they are repurposed, their bodies fused into the architecture, their voices whispering from the static.</p>
        <ul>
          <li><strong>Threats:</strong> Ghost Reavers, Sky Leaches, AI Cultists</li>
          <li><strong>Resources:</strong> Phantom Silk, Gravitic Core Shards</li>
        </ul>
      `
    };

    modalLore.innerHTML = loreContent[zoneId];
    zoneModal.classList.add('active');
    glitchAudio.currentTime = 0;
    glitchAudio.play();
  });
});

// Modal close
modalClose.addEventListener('click', () => {
  zoneModal.classList.remove('active');
  glitchAudio.currentTime = 0;
  glitchAudio.play();
});

// Close modal on backdrop click
zoneModal.addEventListener('click', (e) => {
  if (e.target === zoneModal) {
    zoneModal.classList.remove('active');
    glitchAudio.currentTime = 0;
    glitchAudio.play();
  }
});

// ===== MUTATION CATALOG =====
// Filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    mutationCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Card hover effects
mutationCards.forEach(card => {
  const veins = card.querySelector('.card-veins');
  const glow = card.querySelector('.card-glow');

  card.addEventListener('mouseenter', () => {
    veins.style.animation = 'pulse 1.5s ease infinite alternate';
    glow.style.opacity = '1';
    hoverAudio.currentTime = 0;
    hoverAudio.play();
  });

  card.addEventListener('mouseleave', () => {
    veins.style.animation = 'none';
    glow.style.opacity = '0';
  });
});

// ===== LORE TERMINAL =====
// Sequential text reveal
terminalLines.forEach((line, index) => {
  line.style.animationDelay = `${0.2 + (index * 0.1)}s`;
});

// "Query Database" button
terminalBtn.addEventListener('click', () => {
  terminalBtn.textContent = 'LOADING...';
  terminalBtn.style.opacity = '0.5';
  terminalBtn.style.cursor = 'wait';

  setTimeout(() => {
    const newLines = [
      '<div class="terminal-line">> FRAGMENT RETRIEVED FROM NODE [EPSILON-3]</div>',
      '<div class="terminal-line glitch" data-text="The Lazarus Strain">▓▓▓ ▓▓▓▓▓▓ ▓▓▓▓▓▓▓ ▓▓▓▓▓▓</div>',
      '<div class="terminal-line">The Lazarus Strain was never meant to be a cure. The Architects knew this. They called it a "controlled evolution"—a way to transcend the limits of flesh. But Subject 01 (Elias Voss) had other plans.</div>',
      '<div class="terminal-line">The retrovirus didn\'t just rewrite his DNA—it <span class="highlight">rewrote reality</span> around him. The walls of his containment cell began to <span class="highlight">breathe</span>. The guards\' bullets dissolved into his veins like nutrients. By the time CALYPSO locked down the facility, Elias had already become something else.</div>',
      '<div class="terminal-line">> END FRAGMENT. QUERY AGAIN? <button class="terminal-btn">[YES]</button></div>'
    ];

    const output = document.querySelector('.terminal-output');
    newLines.forEach((line, index) => {
      const div = document.createElement('div');
      div.className = 'terminal-line';
      if (line.includes('glitch')) div.classList.add('glitch');
      if (line.includes('[YES]')) {
        div.innerHTML = line;
        div.querySelector('.terminal-btn').addEventListener('click', () => {
          terminalBtn.textContent = '[YES]';
          terminalBtn.style.opacity = '1';
          terminalBtn.style.cursor = 'pointer';
        });
      } else {
        div.innerHTML = line;
      }
      div.style.animationDelay = `${0.2 + ((terminalLines.length + index) * 0.1)}s`;
      output.appendChild(div);
    });

    terminalBtn.textContent = '[YES]';
    terminalBtn.style.opacity = '1';
    terminalBtn.style.cursor = 'pointer';
  }, 1500);
});

// ===== TECH TREE =====
// Node click events
treeNodes.forEach(node => {
  node.addEventListener('click', () => {
    const nodeId = node.id.replace('node-', '');
    const nodeLabel = node.querySelector('.node-label').textContent;

    console.log(`Tech Tree Node Clicked: ${nodeId} (${nodeLabel})`);
    // Placeholder: Could open a modal with details
    node.style.transform = 'scale(1.2)';
    setTimeout(() => node.style.transform = 'scale(1)', 300);
  });
});

// Animate paths on load
document.querySelectorAll('.tree-path').forEach(path => {
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.getBoundingClientRect(); // Trigger reflow
  path.style.transition = 'stroke-dashoffset 1s ease';
  path.style.strokeDashoffset = '0';
});

// ===== SURVIVAL GUIDE =====
// Tab switching
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const tabId = button.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
  });
});

// Gear checklist
gearCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const label = checkbox.nextElementSibling;
    if (checkbox.checked) {
      label.style.textDecoration = 'line-through';
      label.style.opacity = '0.7';
    } else {
      label.style.textDecoration = 'none';
      label.style.opacity = '1';
    }
  });
});

// ===== FOOTER =====
// Anomaly report form
anomalyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = document.getElementById('anomaly-type').value;
  const location = document.getElementById('anomaly-location').value;
  const desc = document.getElementById('anomaly-desc').value;

  console.log(`Anomaly Reported:
    Type: ${type}
    Location: ${location}
    Description: ${desc}`);

  anomalyForm.reset();
  const submitBtn = anomalyForm.querySelector('.form-btn');
  submitBtn.textContent = 'REPORT RECEIVED';
  submitBtn.style.backgroundColor = 'rgba(92, 255, 107, 0.2)';
  setTimeout(() => {
    submitBtn.textContent = 'SUBMIT';
    submitBtn.style.backgroundColor = 'transparent';
  }, 2000);
});

// ===== WINDOW EVENTS =====
// Pause ambient audio on page hide
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    ambientAudio.pause();
  } else if (!ambientAudio.paused && audioToggle.innerHTML.includes('🔇')) {
    ambientAudio.play();
  }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});