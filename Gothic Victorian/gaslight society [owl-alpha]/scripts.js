// scripts.js

// ===== Data: Members =====
const members = [
  {
    id: 1,
    name: "Lord Ashworth Blackwood",
    title: "Grand Master of the Obsidian Circle",
    circle: "Innermost Circle",
    circleLevel: 3,
    specializations: ["Necromancy", "Astral Projection", "Blood Rituals"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=A.B&font=playfair-display",
    bio: "Founder of the Obsidian Circle in 1847, Lord Blackwood has devoted his existence to piercing the veil between worlds. His manor house in the Cotswolds serves as the primary lodge for the Innermost Circle.",
    joined: "1847",
    seances: ["First Séance of the Month", "Midnight Conclave"]
  },
  {
    id: 2,
    name: "Madame Seraphina Crane",
    title: "Keeper of the Crimson Archives",
    circle: "Innermost Circle",
    circleLevel: 3,
    specializations: ["Divination", "Spirit Channeling", "Forbidden Texts"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=S.C&font=playfair-display",
    bio: "Madame Crane possesses an uncanny ability to commune with spirits of the departed. She maintains the society's vast library of occult manuscripts, some dating back to the 12th century.",
    joined: "1852",
    seances: ["Full Moon Séance", "Midnight Conclave"]
  },
  {
    id: 3,
    name: "Dr. Cornelius Ashford",
    title: "Alchemist Supreme",
    circle: "Inner Circle",
    circleLevel: 2,
    specializations: ["Alchemy", "Transmutation", "Elixirs of Life"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=C.A&font=playfair-display",
    bio: "A former professor of chemistry at Oxford, Dr. Ashford abandoned academia to pursue the ancient art of transmutation. His laboratory beneath the British Museum holds secrets unknown to modern science.",
    joined: "1855",
    seances: ["New Moon Working", "Solstice Gathering"]
  },
  {
    id: 4,
    name: "Lady Isolde Ravencroft",
    title: "Mistress of Shadows",
    circle: "Inner Circle",
    circleLevel: 2,
    specializations: ["Shadow Work", "Illusion", "Dream Walking"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=I.R&font=playfair-display",
    bio: "Lady Ravencroft moves through the world unseen by those who would oppose our work. Her mastery of shadow and illusion has protected the Circle from exposure for over three decades.",
    joined: "1861",
    seances: ["Dark Moon Ritual", "Equinox Ceremony"]
  },
  {
    id: 5,
    name: "Professor Erasmus Thorne",
    title: "Chronicler of the Unseen",
    circle: "Inner Circle",
    circleLevel: 2,
    specializations: ["Ancient Languages", "Cryptography", "Sacred Geometry"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=E.T&font=playfair-display",
    bio: "Professor Thorne's translations of Sumerian death hymns have opened new avenues of communication with ancient entities. His work on sacred geometry reveals patterns hidden in Gothic architecture.",
    joined: "1863",
    seances: ["Planetary Alignment", "Midnight Conclave"]
  },
  {
    id: 6,
    name: "Brother Silas Grimshaw",
    title: "Guardian of the Threshold",
    circle: "Outer Circle",
    circleLevel: 1,
    specializations: ["Warding", "Protection Rituals", "Banishment"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=S.G&font=playfair-display",
    bio: "Once a defrocked monk, Brother Grimshaw found his true calling in protecting the living from malevolent spirits. His wards safeguard all Circle meeting locations.",
    joined: "1868",
    seances: ["Protection Ceremony", "Quarterly Warding"]
  },
  {
    id: 7,
    name: "Miss Evangeline Frost",
    title: "Seer of the Frozen Veil",
    circle: "Outer Circle",
    circleLevel: 1,
    specializations: ["Crystal Gazing", "Scrying", "Frost Magic"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=E.F&font=playfair-display",
    bio: "Born during the Great Blizzard of 1865, Miss Frost possesses an innate connection to the elemental forces of ice and cold. Her crystal visions have guided the Circle through many crises.",
    joined: "1872",
    seances: ["Winter Solstice", "Crystal Gazing Circle"]
  },
  {
    id: 8,
    name: "Captain Reginald Drake",
    title: "Navigator of the Ethereal Seas",
    circle: "Outer Circle",
    circleLevel: 1,
    specializations: ["Astral Travel", "Spirit Guides", "Maritime Rituals"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=R.D&font=playfair-display",
    bio: "Captain Drake's voyages to remote islands revealed ancient maritime rituals for navigating between worlds. His compass points not to magnetic north, but to spiritually significant locations.",
    joined: "1875",
    seances: ["Tide Working", "Harbor Moon Ritual"]
  },
  {
    id: 9,
    name: "Mrs. Tabitha Holloway",
    title: "Herbalist of the Dark Garden",
    circle: "Outer Circle",
    circleLevel: 1,
    specializations: ["Herbalism", "Poison Craft", "Healing Rituals"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=T.H&font=playfair-display",
    bio: "Mrs. Holloway cultivates rare poisonous and medicinal plants in her greenhouse. Her tinctures and poultices are essential components of many Circle rituals and healing practices.",
    joined: "1878",
    seances: ["Harvest Festival", "Herb Gathering Moon"]
  },
  {
    id: 10,
    name: "Mr. Percival Nightingale",
    title: "Composer of Unholy Hymns",
    circle: "Outer Circle",
    circleLevel: 1,
    specializations: ["Sonic Magic", "Musical Rituals", "Voice of Power"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=P.N&font=playfair-display",
    bio: "Mr. Nightingale's compositions have the power to open doors between dimensions. His choir of trained voices can summon entities that respond only to specific harmonic frequencies.",
    joined: "1880",
    seances: ["Choral Invocation", "Harmonic Convergence"]
  },
  {
    id: 11,
    name: "Miss Arabella Sinclair",
    title: "Weaver of Fate's Tapestry",
    circle: "Outer Circle",
    circleLevel: 1,
    specializations: ["Tarot", "Fate Reading", "Thread Magic"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=A.S&font=playfair-display",
    bio: "Miss Sinclair inherited her grandmother's gift for reading the threads of destiny. Her tarot readings have predicted every major event in the Circle's history with uncanny accuracy.",
    joined: "1882",
    seances: ["Tarot Circle", "Fate Weaving Ceremony"]
  },
  {
    id: 12,
    name: "Dr. Heinrich von Stein",
    title: "Anatomist of the Invisible",
    circle: "Outer Circle",
    circleLevel: 1,
    specializations: ["Spirit Anatomy", "Energy Work", "Chakra Activation"],
    portrait: "https://placehold.co/300x300/2a1a0f/d4a017?text=H.S&font=playfair-display",
    bio: "Dr. von Stein's research into the subtle body has mapped the energy centers that persist after physical death. His techniques allow practitioners to perceive and manipulate spiritual energies.",
    joined: "1884",
    seances: ["Energy Working", "Chakra Alignment"]
  }
];

// ===== Data: Séances =====
const seances = [
  {
    title: "Midnight Conclave",
    day: "Saturday",
    time: "00:00",
    circle: "Innermost Circle Only",
    description: "The most sacred gathering of the Circle's highest members. Ancient rites are performed to commune with the eldest spirits."
  },
  {
    title: "First Séance of the Month",
    day: "First Friday",
    time: "21:00",
    circle: "All Circles",
    description: "Monthly gathering where all members may attend. New initiates are welcomed and important matters are discussed."
  },
  {
    title: "Full Moon Séance",
    day: "Full Moon",
    time: "22:00",
    circle: "Inner Circle and above",
    description: "Harnessing the power of the full moon for divination and spirit communication."
  },
  {
    title: "New Moon Working",
    day: "New Moon",
    time: "23:00",
    circle: "Inner Circle and above",
    description: "Dark magic workings performed under the cover of the new moon's absence."
  },
  {
    title: "Dark Moon Ritual",
    day: "Waning Crescent",
    time: "01:00",
    circle: "Inner Circle Only",
    description: "Shadow work and banishing rituals performed in the darkest hours."
  },
  {
    title: "Solstice Gathering",
    day: "Solstice",
    time: "Varies",
    circle: "All Circles",
    description: "Quarterly celebration marking the turning of the seasons. Major ceremonies and initiations take place."
  },
  {
    title: "Equinox Ceremony",
    day: "Equinox",
    time: "Dawn/Dusk",
    circle: "All Circles",
    description: "Balance rituals performed at the precise moment of equinox."
  },
  {
    title: "Protection Ceremony",
    day: "Quarterly",
    time: "20:00",
    circle: "All Circles",
    description: "Renewal of wards and protective enchantments around Circle properties."
  },
  {
    title: "Crystal Gazing Circle",
    day: "Wednesday",
    time: "19:00",
    circle: "Outer Circle",
    description: "Weekly practice session for developing scrying abilities."
  },
  {
    title: "Winter Solstice",
    day: "December 21",
    time: "Sunset",
    circle: "All Circles",
    description: "The most powerful gathering of the year. The veil between worlds is thinnest."
  }
];

// ===== Data: Hierarchy =====
const hierarchy = {
  outer: {
    name: "Outer Circle",
    description: "Initiates and newly accepted members",
    members: 150,
    color: "outer",
    positions: ["Acolyte", "Neophyte", "Initiate"]
  },
  inner: {
    name: "Inner Circle",
    description: "Proven members with demonstrated abilities",
    members: 47,
    color: "inner",
    positions: ["Adept", "Practitioner", "Scholar"]
  },
  innermost: {
    name: "Innermost Circle",
    description: "The ruling council of the Obsidian Circle",
    members: 7,
    color: "innermost",
    positions: ["Grand Master", "Keeper", "Warden"]
  }
};

// ===== DOM Elements =====
const invitationOverlay = document.getElementById('invitation-overlay');
const waxSeal = document.getElementById('wax-seal');
const openInvitationBtn = document.getElementById('open-invitation');
const envelope = document.querySelector('.invitation-envelope');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const membersGrid = document.getElementById('members-grid');
const seanceCalendar = document.getElementById('seance-calendar');
const hierarchyContainer = document.getElementById('hierarchy-container');
const memberModal = document.getElementById('member-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');
const clockSoundIndicator = document.getElementById('clock-sound');
const clockTick = document.getElementById('clock-tick');

// ===== Invitation Mechanic =====
let invitationOpened = false;

function openInvitation() {
  if (invitationOpened) return;
  invitationOpened = true;
  
  waxSeal.classList.add('broken');
  
  setTimeout(() => {
    envelope.classList.add('opened');
  }, 500);
  
  setTimeout(() => {
    invitationOverlay.classList.add('hidden');
  }, 1500);
}

waxSeal.addEventListener('click', openInvitation);
openInvitationBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openInvitation();
});

// ===== Navigation =====
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    const targetId = link.getAttribute('href').substring(1);
    contentSections.forEach(section => {
      section.classList.remove('active-section');
      if (section.id === targetId) {
        section.classList.add('active-section');
      }
    });
  });
});

// ===== Render Members =====
function renderMembers() {
  membersGrid.innerHTML = members.map(member => `
    <div class="member-card" data-id="${member.id}">
      <div class="member-portrait-container">
        <img src="${member.portrait}" alt="${member.name}" class="member-portrait" loading="lazy">
        <div class="portrait-frame"></div>
      </div>
      <h3 class="member-name">${member.name}</h3>
      <p class="member-title">${member.title}</p>
      <span class="member-circle">${member.circle}</span>
      <div class="member-specializations">
        ${member.specializations.map(spec => `<span class="specialization-tag">${spec}</span>`).join('')}
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.member-card').forEach(card => {
    card.addEventListener('click', () => {
      const memberId = parseInt(card.dataset.id);
      const member = members.find(m => m.id === memberId);
      if (member) {
        showMemberModal(member);
      }
    });
  });
}

// ===== Show Member Modal =====
function showMemberModal(member) {
  modalBody.innerHTML = `
    <img src="${member.portrait}" alt="${member.name}" class="modal-portrait">
    <h2 class="modal-name">${member.name}</h2>
    <p class="modal-title">${member.title}</p>
    <span class="modal-circle-badge">${member.circle}</span>
    
    <div class="modal-section">
      <h3 class="modal-section-title">Biography</h3>
      <p class="modal-section-content">${member.bio}</p>
    </div>
    
    <div class="modal-section">
      <h3 class="modal-section-title">Specializations</h3>
      <div class="modal-specializations">
        ${member.specializations.map(spec => `<span class="specialization-tag">${spec}</span>`).join('')}
      </div>
    </div>
    
    <div class="modal-section">
      <h3 class="modal-section-title">Member Since</h3>
      <p class="modal-section-content">${member.joined}</p>
    </div>
    
    <div class="modal-section">
      <h3 class="modal-section-title">Regular Séances</h3>
      <p class="modal-section-content">${member.seances.join(', ')}</p>
    </div>
  `;
  
  memberModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

modalClose.addEventListener('click', () => {
  memberModal.classList.remove('active');
  document.body.style.overflow = '';
});

memberModal.addEventListener('click', (e) => {
  if (e.target === memberModal) {
    memberModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===== Render Séance Calendar =====
let currentDate = new Date();

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  
  let calendarHTML = `
    <div class="calendar-header">
      <button class="calendar-nav" id="prev-month"><i class="fas fa-chevron-left"></i></button>
      <span class="calendar-month-year">${monthNames[month]} ${year}</span>
      <button class="calendar-nav" id="next-month"><i class="fas fa-chevron-right"></i></button>
    </div>
    <div class="calendar-grid">
      ${dayNames.map(day => `<div class="calendar-day-header">${day}</div>`).join('')}
  `;
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += `<div class="calendar-day"></div>`;
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    const dayOfWeek = new Date(year, month, day).getDay();
    const dayName = dayNames[dayOfWeek];
    
    // Check if there's a seance on this day
    let hasSeance = false;
    let seanceName = '';
    
    seances.forEach(seance => {
      if (seance.day === dayName || 
          (seance.day === "Saturday" && dayOfWeek === 6) ||
          (seance.day === "Friday" && dayOfWeek === 5 && day <= 7)) {
        hasSeance = true;
        seanceName = seance.title;
      }
    });
    
    // Special seances
    if (day === 21 && month === 11) { // Winter Solstice approximation
      hasSeance = true;
      seanceName = "Winter Solstice";
    }
    
    calendarHTML += `
      <div class="calendar-day ${hasSeance ? 'has-seance' : ''} ${isToday ? 'today' : ''}">
        <span class="day-number">${day}</span>
        ${hasSeance ? `<span class="seance-info">${seanceName}</span>` : ''}
      </div>
    `;
  }
  
  calendarHTML += `</div>`;
  
  seanceCalendar.innerHTML = calendarHTML;
  
  document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });
  
  document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
}

// ===== Render Hierarchy =====
function renderHierarchy() {
  hierarchyContainer.innerHTML = `
    <div class="hierarchy-level">
      <div class="hierarchy-node">
        <div class="node-circle ${hierarchy.innermost.color}">${hierarchy.innermost.members}</div>
        <h3 class="node-title">${hierarchy.innermost.name}</h3>
        <p class="node-members">${hierarchy.innermost.description}</p>
        <p class="node-members">Positions: ${hierarchy.innermost.positions.join(', ')}</p>
      </div>
    </div>
    <div class="hierarchy-level">
      <div class="hierarchy-node">
        <div class="node-circle ${hierarchy.inner.color}">${hierarchy.inner.members}</div>
        <h3 class="node-title">${hierarchy.inner.name}</h3>
        <p class="node-members">${hierarchy.inner.description}</p>
        <p class="node-members">Positions: ${hierarchy.inner.positions.join(', ')}</p>
      </div>
    </div>
    <div class="hierarchy-level">
      <div class="hierarchy-node">
        <div class="node-circle ${hierarchy.outer.color}">${hierarchy.outer.members}</div>
        <h3 class="node-title">${hierarchy.outer.name}</h3>
        <p class="node-members">${hierarchy.outer.description}</p>
        <p class="node-members">Positions: ${hierarchy.outer.positions.join(', ')}</p>
      </div>
    </div>
  `;
}

// ===== Grandfather Clock =====
let clockSoundEnabled = false;

function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  const hourDeg = (hours * 30) + (minutes * 0.5);
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;
  
  hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
}

function toggleClockSound() {
  clockSoundEnabled = !clockSoundEnabled;
  
  if (clockSoundEnabled) {
    clockTick.play().catch(e => console.log('Audio play failed:', e));
    clockSoundIndicator.classList.add('active');
    clockSoundIndicator.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    clockTick.pause();
    clockSoundIndicator.classList.remove('active');
    clockSoundIndicator.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

clockSoundIndicator.addEventListener('click', toggleClockSound);

// Update clock every second
setInterval(updateClock, 1000);
updateClock();

// ===== Ambient Gaslight Effect =====
function createGaslightFlicker() {
  const glow = document.querySelector('.gaslight-glow');
  
  setInterval(() => {
    const opacity = 0.85 + Math.random() * 0.15;
    glow.style.opacity = opacity;
  }, 2000);
}

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (memberModal.classList.contains('active')) {
      memberModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (!invitationOverlay.classList.contains('hidden')) {
      openInvitation();
    }
  }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  renderMembers();
  renderCalendar();
  renderHierarchy();
  createGaslightFlicker();
  
  // Add subtle parallax effect to header
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.site-header');
    if (header && scrolled < window.innerHeight) {
      header.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
  });
});

// ===== Easter Egg: Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      // Activate secret mode
      document.body.style.filter = 'hue-rotate(180deg)';
      setTimeout(() => {
        document.body.style.filter = '';
      }, 3000);
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});