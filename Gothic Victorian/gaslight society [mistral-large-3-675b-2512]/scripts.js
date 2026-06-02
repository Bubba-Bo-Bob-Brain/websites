// ===== UTILITIES =====
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// ===== ENVELOPE OPENING =====
const envelope = document.getElementById('envelope');
const mainContent = document.getElementById('main-content');
const openButton = document.getElementById('open-envelope');

// Load ambient sounds
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {
  waxCrack: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cracking-firewood-1407.mp3'),
  clockChime: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-grandfather-clock-chime-1744.mp3'),
  whisper: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-whispering-into-ear-1306.mp3'),
  tick: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-clock-ticking-1055.mp3')
};

// Preload sounds
Object.values(sounds).forEach(sound => {
  sound.preload = 'auto';
  const source = audioContext.createMediaElementSource(sound);
  source.connect(audioContext.destination);
});

// Play sound with volume control
const playSound = (sound, volume = 0.5) => {
  sound.currentTime = 0;
  sound.volume = volume;
  sound.play().catch(e => console.log('Audio play prevented:', e));
};

// Animate envelope opening
openButton.addEventListener('click', () => {
  envelope.classList.add('opened');
  mainContent.classList.add('visible');
  playSound(sounds.waxCrack, 0.7);

  // Fade in gaslight flicker
  setTimeout(() => {
    document.querySelector('.gaslight-flicker').style.opacity = '1';
  }, 1000);
});

// ===== GRANDFATHER CLOCK =====
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');

// Update clock hands in real-time
const updateClock = () => {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourDegrees = (hours * 30) + (minutes * 0.5);
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  hourHand.style.transform = `rotate(${hourDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
  secondHand.style.transform = `rotate(${secondDegrees}deg)`;
};

// Play chime on the hour
const checkChime = () => {
  const now = new Date();
  if (now.getMinutes() === 0 && now.getSeconds() === 0) {
    playSound(sounds.clockChime, 0.3);
    // Flicker gaslight for dramatic effect
    const flicker = document.querySelector('.gaslight-flicker');
    flicker.style.animation = 'none';
    setTimeout(() => flicker.style.animation = 'flicker 3s infinite alternate', 10);
  }
};

// Initialize clock
updateClock();
setInterval(updateClock, 1000);
setInterval(checkChime, 1000);

// Subtle tick sound every second
setInterval(() => playSound(sounds.tick, 0.1), 1000);

// ===== INNER CIRCLES TOOLTIPS =====
const circles = document.querySelectorAll('.circle');
const tierTooltip = document.getElementById('tier-tooltip');

circles.forEach(circle => {
  circle.addEventListener('mouseenter', (e) => {
    const tier = circle.dataset.tier;
    const members = circle.dataset.members;
    tierTooltip.innerHTML = `
      <strong>${tier}</strong><br>
      Members: ${members}<br>
      <em>"The deeper the circle, the darker the oath."</em>
    `;
    tierTooltip.style.opacity = '1';
    playSound(sounds.whisper, 0.3);
  });

  circle.addEventListener('mouseleave', () => {
    tierTooltip.style.opacity = '0';
  });

  circle.addEventListener('mousemove', (e) => {
    tierTooltip.style.top = `${e.clientY - 100}px`;
    tierTooltip.style.left = `${e.clientX + 20}px`;
  });
});

// ===== MEMBER CARDS: LIVING DAGUERREOTYPES =====
const memberCards = document.querySelectorAll('.member-card');

memberCards.forEach(card => {
  const portrait = card.querySelector('.daguerreotype');
  const glow = card.querySelector('.portrait-glow');

  // Subtle parallax effect on hover
  card.addEventListener('mousemove', debounce((e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = (x - centerX) / 20;
    const moveY = (y - centerY) / 20;

    portrait.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
    glow.style.opacity = '0.8';
  }, 10));

  card.addEventListener('mouseleave', () => {
    portrait.style.transform = 'scale(1)';
    glow.style.opacity = '0';
  });

  // Whisper sound on hover
  card.addEventListener('mouseenter', () => playSound(sounds.whisper, 0.2));

  // Tooltip positioning
  const tooltip = card.querySelector('.member-tooltip');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Show tooltip on the right unless near screen edge
    const tooltipWidth = tooltip.offsetWidth;
    const screenWidth = window.innerWidth;
    const spaceRight = screenWidth - rect.right;

    if (spaceRight > tooltipWidth + 20) {
      tooltip.style.left = '100%';
      tooltip.style.top = '0';
      tooltip.style.transform = 'translateX(10px)';
    } else {
      tooltip.style.left = '50%';
      tooltip.style.top = '100%';
      tooltip.style.transform = 'translateX(-50%) translateY(10px)';
    }
  });
});

// ===== SEANCE SCHEDULE: WAX SEAL HOVER =====
const timelineEvents = document.querySelectorAll('.timeline-event');

timelineEvents.forEach(event => {
  const seal = event.querySelector('.event-seal');
  event.addEventListener('mouseenter', () => {
    seal.style.transform = 'scale(1.2) rotate(15deg)';
    playSound(sounds.waxCrack, 0.4);
  });

  event.addEventListener('mouseleave', () => {
    seal.style.transform = 'scale(1) rotate(0)';
  });
});

// ===== GASLIGHT INTENSIFICATION =====
document.addEventListener('mousemove', debounce(() => {
  const flicker = document.querySelector('.gaslight-flicker');
  flicker.style.animation = 'flicker 2s infinite alternate-reverse';
  setTimeout(() => {
    flicker.style.animation = 'flicker 3s infinite alternate';
  }, 2000);
}, 100));

// ===== DYNAMIC MEMBER GENERATION (FOR DEMO) =====
const generateMembers = () => {
  const grid = document.querySelector('.grid-container');
  const members = [
    { name: 'Dr. Thaddeus Vexley', title: 'Alchemist of the Silver Veil', specialization: 'Metallurgical Necromancy', seance: '18th Jan, MDCCCXCIII', secret: 'Invented the "Soul Crucible". Disappeared in 1889.', memento: 'Ignis Aurum Probat' },
    { name: 'Madame Isolde DuChamp', title: 'Seer of the Obsidian Circle', specialization: 'Scrying Mirrors & Tarot Divination', seance: '5th Feb, MDCCCXCIII', secret: 'Predicted the Great Fire of London (posthumously).', memento: 'In Tenebris Lux' },
    { name: 'Rev. Elias Whitmore', title: 'Chaplain of the Gilded Sepulchre', specialization: 'Exorcism & Ritual Abjuration', seance: '22nd Feb, MDCCCXCIII', secret: 'Formerly of the Vatican Archives.', memento: 'Requiescat In Pace' },
    { name: 'Miss Eleanor Graves', title: 'Keeper of the Veil Archives', specialization: 'Enochian Cipher & Lost Grimoires', seance: '10th Mar, MDCCCXCIII', secret: 'Alistair Graves\' estranged daughter.', memento: 'Veritas Vos Liberabit' },
    { name: 'Prof. Archibald Finch', title: 'Luminary of the Outer Court', specialization: 'Photographic Occultism', seance: '29th Mar, MDCCCXCIII', secret: 'First to capture a spirit on film (1878).', memento: 'Lux in Umbra Manet' },
    { name: 'Sir Reginald Blackwood', title: 'Patron of the Athenaeum', specialization: 'Financial Divination', seance: '14th Apr, MDCCCXCIII', secret: 'Funded the excavation of "The Blackwood Vault".', memento: 'Auro Potestas Est' },
    { name: 'Dr. Miriam Hart', title: 'Physician of the Silver Veil', specialization: 'Anatomical Necromancy', seance: '3rd May, MDCCCXCIII', secret: 'Dissected a revenant (survived, barely).', memento: 'Mors Janua Vitae' },
    { name: 'Mr. Lucien Moreau', title: 'Cartographer of the Obsidian Circle', specialization: 'Leyline Surveying', seance: '20th May, MDCCCXCIII', secret: 'Mapped the "London Labyrinth" (lost to fire).', memento: 'Per Aspera Ad Astra' }
  ];

  members.forEach(member => {
    const card = document.createElement('article');
    card.className = 'member-card';
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="member-portrait">
        <img src="https://source.unsplash.com/random/300x400/?portrait,vintage,${member.name.split(' ').join(',')}" alt="Daguerreotype of ${member.name}" class="daguerreotype" loading="lazy">
        <div class="portrait-frame"></div>
        <div class="portrait-glow"></div>
      </div>
      <div class="member-info">
        <h3 class="member-name">${member.name}</h3>
        <p class="member-title">${member.title}</p>
        <p class="member-specialization">${member.specialization}</p>
        <div class="member-seances">
          <span class="seance-icon">🕯️</span>
          <span class="seance-text">Next Seance: ${member.seance}</span>
        </div>
      </div>
      <div class="member-tooltip">
        <p>Initiated: ${Math.floor(Math.random() * 30) + 1850}. ${member.secret}</p>
        <p class="memento-mori">Memento Mori: <em>${member.memento}</em></p>
      </div>
    `;
    grid.appendChild(card);
  });

  // Reinitialize member card interactions
  document.querySelectorAll('.member-card').forEach(card => {
    const portrait = card.querySelector('.daguerreotype');
    const glow = card.querySelector('.portrait-glow');
    const tooltip = card.querySelector('.member-tooltip');

    card.addEventListener('mousemove', debounce((e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) / 20;
      const moveY = (y - centerY) / 20;

      portrait.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
      glow.style.opacity = '0.8';
    }, 10));

    card.addEventListener('mouseleave', () => {
      portrait.style.transform = 'scale(1)';
      glow.style.opacity = '0';
    });

    card.addEventListener('mouseenter', () => playSound(sounds.whisper, 0.2));
  });
};

// Generate members after DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#demo') {
    generateMembers();
  }
});

// ===== EASTER EGG: SECRET SIGIL =====
let sigilClicks = 0;
const sigil = document.querySelector('.ink-stamp');

sigil.addEventListener('click', () => {
  sigilClicks++;
  if (sigilClicks === 3) {
    document.body.style.background = 'radial-gradient(circle, #4A1A2C 0%, #1A1A2E 100%)';
    document.body.style.color = '#D4AF37';
    sigil.innerHTML = '👁️';
    playSound(sounds.whisper, 0.8);

    // Add floating sigils
    for (let i = 0; i < 5; i++) {
      const floatingSigil = document.createElement('div');
      floatingSigil.className = 'floating-sigil';
      floatingSigil.textContent = '✠';
      floatingSigil.style.position = 'absolute';
      floatingSigil.style.top = `${Math.random() * 100}vh`;
      floatingSigil.style.left = `${Math.random() * 100}vw`;
      floatingSigil.style.fontSize = `${Math.random() * 2 + 1}rem`;
      floatingSigil.style.color = `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.3})`;
      floatingSigil.style.animation = `float ${Math.random() * 10 + 5}s infinite ease-in-out`;
      document.body.appendChild(floatingSigil);
    }

    // Add CSS for floating sigils
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      .floating-sigil {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }
});