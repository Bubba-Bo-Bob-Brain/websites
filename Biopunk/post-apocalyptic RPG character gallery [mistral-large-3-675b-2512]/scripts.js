// DOM Elements
const characterCards = document.querySelectorAll('.character-card');
const mutationDots = document.querySelectorAll('.mutation-dot');
const gallery = document.querySelector('.gallery');

// Biopunk Audio (Optional - Comment out if unwanted)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.1;
const oscillator = audioContext.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 60;
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
oscillator.start();

// Dynamic Mutation Dots
characterCards.forEach(card => {
  const mutationLevel = parseInt(card.dataset.mutationLevel);
  const dots = card.querySelectorAll('.mutation-dot');

  dots.forEach((dot, index) => {
    if (index < mutationLevel) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Glitch Effect on Hover
  card.addEventListener('mouseenter', () => {
    card.style.animation = 'glitch 1s infinite';
    // Speed up DNA scan
    const dnaBorder = card.querySelector('.dna-border');
    dnaBorder.style.animationDuration = '3s';
    // Audio feedback
    gainNode.gain.value = 0.2;
  });

  card.addEventListener('mouseleave', () => {
    card.style.animation = 'none';
    // Reset DNA scan
    const dnaBorder = card.querySelector('.dna-border');
    dnaBorder.style.animationDuration = '10s';
    // Audio feedback
    gainNode.gain.value = 0.1;
  });
});

// Glitch Animation Keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }
`;
document.head.appendChild(styleSheet);

// Faction Tooltips
const factions = {
  'faction-scavengers': {
    name: 'Scavengers',
    lore: 'Nomads who trade in pre-collapse tech. Distrusted but tolerated.'
  },
  'faction-neo-medics': {
    name: 'Neo-Medics',
    lore: 'Scientists who weaponize diseases. Their "cures" mutate you further.'
  },
  'faction-iron-cult': {
    name: 'Iron Cult',
    lore: 'Ascetics who believe pain is divine. Graft metal into their flesh.'
  },
  'faction-wraithborn': {
    name: 'Wraithborn',
    lore: 'Ghosts in human skin. They remember deaths that haven\'t happened yet.'
  }
};

document.querySelectorAll('.faction-insignia').forEach(insignia => {
  const factionKey = Array.from(insignia.classList).find(c => c.startsWith('faction-'));
  const faction = factions[factionKey];

  if (faction) {
    const tooltip = document.createElement('div');
    tooltip.className = 'faction-tooltip';
    tooltip.innerHTML = `
      <strong>${faction.name}</strong>
      <p>${faction.lore}</p>
    `;
    insignia.appendChild(tooltip);

    insignia.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });

    insignia.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  }
});

// CRT Screen Jitter (Subtle)
setInterval(() => {
  const jitterX = Math.random() * 2 - 1;
  const jitterY = Math.random() * 2 - 1;
  gallery.style.transform = `translate(${jitterX}px, ${jitterY}px)`;
}, 5000);