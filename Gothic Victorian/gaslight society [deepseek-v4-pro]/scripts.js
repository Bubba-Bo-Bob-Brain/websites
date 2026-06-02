const membersData = {
  'outer-veil': [
    { name: 'Edmund Crowe', specialization: 'Cartomancy & Tea Leaves', portrait: 'https://placehold.co/120x140/3b2b1f/e8d5b0?text=E.Crowe', circle: 'Outer Veil' },
    { name: 'Beatrice Holloway', specialization: 'Spirit Photography', portrait: 'https://placehold.co/120x140/3b2b1f/e8d5b0?text=B.Holloway', circle: 'Outer Veil' },
    { name: 'Silas Thorne', specialization: 'Automatic Writing', portrait: 'https://placehold.co/120x140/3b2b1f/e8d5b0?text=S.Thorne', circle: 'Outer Veil' },
    { name: 'Lavinia Proud', specialization: 'Crystal Gazing', portrait: 'https://placehold.co/120x140/3b2b1f/e8d5b0?text=L.Proud', circle: 'Outer Veil' }
  ],
  'inner-sanctum': [
    { name: 'Cornelius Ashford', specialization: 'Necromantic Chimes', portrait: 'https://placehold.co/120x140/4a2e20/e8d5b0?text=C.Ashford', circle: 'Inner Sanctum' },
    { name: 'Ophelia Vane', specialization: 'Ectoplasmic Resonance', portrait: 'https://placehold.co/120x140/4a2e20/e8d5b0?text=O.Vane', circle: 'Inner Sanctum' }
  ],
  'obsidian-throne': [
    { name: 'Archon Mordecai Blackwood', specialization: 'Infernal Topography', portrait: 'https://placehold.co/120x140/5c3826/f5e7c6?text=M.Blackwood', circle: 'Obsidian Throne' },
    { name: 'Archon Seraphina Dusk', specialization: 'Shadow Alchemy', portrait: 'https://placehold.co/120x140/5c3826/f5e7c6?text=S.Dusk', circle: 'Obsidian Throne' }
  ],
  'eclipsed-heart': [
    { name: 'Oracle Vesper Nocturne', specialization: 'Astral Projection', portrait: 'https://placehold.co/120x140/6b3a2a/f5e7c6?text=V.Nocturne', circle: 'Eclipsed Heart' }
  ],
  'prime-mover': [
    { name: 'Sovereign Alistair Ravenscroft', specialization: 'Absolute Occultation', portrait: 'https://placehold.co/120x140/7a4a30/fce6b4?text=A.Ravenscroft', circle: 'Prime Mover' }
  ]
};

const seances = [
  { date: 'October 31st, 1892', medium: 'Ophelia Vane', circle: 'Inner Sanctum', note: 'All Hallows’ Eve manifestation' },
  { date: 'November 9th, 1892', medium: 'Seraphina Dusk', circle: 'Obsidian Throne', note: 'Shadow transmutation ritual' },
  { date: 'December 21st, 1892', medium: 'Vesper Nocturne', circle: 'Eclipsed Heart', note: 'Winter solstice crossing' }
];

let activeCircle = 'obsidian-throne';

function renderMembers(circleId) {
  const grid = document.getElementById('member-cards-grid');
  if (!grid) return;
  const members = membersData[circleId] || [];
  grid.innerHTML = members.map(member => `
    <div class="member-card">
      <div class="daguerreotype-frame">
        <img src="${member.portrait}" alt="${member.name}" class="daguerreotype-portrait" loading="lazy">
      </div>
      <h3 class="member-name">${member.name}</h3>
      <p class="member-specialization">${member.specialization}</p>
      <span class="member-circle-badge">${member.circle}</span>
    </div>
  `).join('');
}

function updateActiveCircle(circleId) {
  document.querySelectorAll('.circle-tier').forEach(item => {
    const dataCircle = item.getAttribute('data-circle');
    if (dataCircle === circleId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  activeCircle = circleId;
  renderMembers(circleId);
}

document.querySelectorAll('.circle-tier').forEach(tier => {
  tier.addEventListener('click', (event) => {
    const circle = event.currentTarget.getAttribute('data-circle');
    if (circle) {
      updateActiveCircle(circle);
    }
  });
});

const scheduleToggle = document.getElementById('schedule-view-toggle');
const schedulePanel = document.getElementById('schedule-panel');
const memberGrid = document.getElementById('member-cards-grid');

if (scheduleToggle) {
  scheduleToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      memberGrid.style.display = 'none';
      schedulePanel.style.display = 'block';
      renderSeances();
    } else {
      memberGrid.style.display = 'grid';
      schedulePanel.style.display = 'none';
    }
  });
}

function renderSeances() {
  const list = document.getElementById('seance-list');
  if (!list) return;
  list.innerHTML = seances.map(s => `
    <li class="seance-item">
      <span>${s.date}</span>
      <span>${s.medium} (${s.circle})</span>
      <span><em>${s.note}</em></span>
    </li>
  `).join('');
}

const breakSealBtn = document.getElementById('break-seal-btn');
const unsealedMessage = document.getElementById('unsealed-message');

if (breakSealBtn) {
  breakSealBtn.addEventListener('click', () => {
    if (unsealedMessage) {
      unsealedMessage.classList.add('revealed');
    }
    breakSealBtn.disabled = true;
    breakSealBtn.textContent = 'Seal Shattered';
    breakSealBtn.style.opacity = '0.6';
    setTimeout(() => {
      if (unsealedMessage) {
        unsealedMessage.classList.remove('revealed');
      }
      breakSealBtn.disabled = false;
      breakSealBtn.textContent = 'Break the Seal';
      breakSealBtn.style.opacity = '1';
    }, 5000);
  });
}

const canvas = document.getElementById('embers-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  const embers = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 45; i++) {
    embers.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.6,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.6 + 0.3,
      flicker: Math.random() * 0.03
    });
  }

  function drawEmbers() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    embers.forEach(ember => {
      ember.y -= ember.speed;
      ember.opacity += (Math.random() - 0.5) * ember.flicker;
      ember.opacity = Math.min(0.8, Math.max(0.15, ember.opacity));
      if (ember.y < -10) {
        ember.y = height + 10;
        ember.x = Math.random() * width;
      }
      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 160, 45, ${ember.opacity})`;
      ctx.shadowColor = '#f2b84b';
      ctx.shadowBlur = 9;
      ctx.fill();
    });
    requestAnimationFrame(drawEmbers);
  }
  drawEmbers();
}

renderMembers(activeCircle);