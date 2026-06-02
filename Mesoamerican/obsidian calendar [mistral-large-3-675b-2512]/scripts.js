// ===== GLOBAL VARIABLES =====
const calendarWheel = document.querySelector('.calendar-wheel');
const wheelRim = document.querySelector('.wheel-rim');
const glyphs = document.querySelectorAll('.glyph');
const outerGlyphs = document.querySelectorAll('.outer-glyph');
const deityAvatars = document.querySelectorAll('.deity-avatar');
const tributeEntries = document.querySelectorAll('.tribute-entry');
const eclipseDays = document.getElementById('eclipse-days');
const eclipseHours = document.getElementById('eclipse-hours');

// ===== CALENDAR WHEEL ROTATION =====
let isDragging = false;
let startAngle = 0;
let currentAngle = 0;
let rotation = 0;

// Initialize wheel position
calendarWheel.style.transform = `rotate(${rotation}deg)`;

// Mouse/touch events for wheel rotation
calendarWheel.addEventListener('mousedown', startDrag);
calendarWheel.addEventListener('touchstart', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function startDrag(e) {
  isDragging = true;
  const rect = calendarWheel.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;
  startAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  e.preventDefault();
}

function drag(e) {
  if (!isDragging) return;
  const rect = calendarWheel.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;
  const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  rotation = currentAngle - startAngle;
  calendarWheel.style.transform = `rotate(${rotation}deg)`;
}

function endDrag() {
  isDragging = false;
  // Snap to nearest glyph (18 degrees per glyph, 20 glyphs total)
  const snapAngle = Math.round(rotation / 18) * 18;
  rotation = snapAngle;
  calendarWheel.style.transition = 'transform 0.5s ease';
  calendarWheel.style.transform = `rotate(${snapAngle}deg)`;

  // Reset transition after snap
  setTimeout(() => {
    calendarWheel.style.transition = 'none';
  }, 500);
}

// ===== GLYPH TOOLTIP SYSTEM =====
const glyphTranslations = {
  'Cipactli': 'Crocodile - Primordial Earth',
  'Ehecatl': 'Wind - Breath of Life',
  'Calli': 'House - Hearth and Home',
  'Cuetzpallin': 'Lizard - Renewal',
  'Coatl': 'Serpent - Wisdom',
  'Miquiztli': 'Death - Transformation',
  'Mazatl': 'Deer - Guidance',
  'Tochtli': 'Rabbit - Fertility',
  'Atl': 'Water - Purification',
  'Itzcuintli': 'Dog - Loyalty',
  'Ozomatli': 'Monkey - Joy',
  'Malinalli': 'Grass - Growth',
  'Acatl': 'Reed - Strength',
  'Ocelotl': 'Jaguar - Power',
  'Cuauhtli': 'Eagle - Vision',
  'Cozcacuauhtli': 'Vulture - Renewal',
  'Ollin': 'Movement - Earthquake',
  'Tecpatl': 'Flint - Sacrifice',
  'Quiahuitl': 'Rain - Abundance',
  'Xochitl': 'Flower - Beauty'
};

// Add translations to glyph tooltips
glyphs.forEach(glyph => {
  const glyphName = glyph.getAttribute('data-glyph');
  glyph.setAttribute('title', glyphTranslations[glyphName] || glyphName);
});

// ===== ECLIPSE COUNTDOWN TIMER =====
function updateEclipseTimer() {
  // Set a target date (example: 13 days and 6 hours from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 13);
  targetDate.setHours(targetDate.getHours() + 6);

  const now = new Date();
  const diff = targetDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  eclipseDays.textContent = days;
  eclipseHours.textContent = hours;

  // Pulse effect
  if (days < 3) {
    eclipseDays.style.animation = 'pulse 1s infinite';
    eclipseHours.style.animation = 'pulse 1s infinite';
  } else {
    eclipseDays.style.animation = 'none';
    eclipseHours.style.animation = 'none';
  }
}

// Update every minute
updateEclipseTimer();
setInterval(updateEclipseTimer, 60000);

// ===== DEITY CYCLE ANIMATIONS =====
deityAvatars.forEach(avatar => {
  avatar.addEventListener('mouseenter', () => {
    avatar.style.transform = 'translateX(10px) scale(1.05)';
    avatar.querySelector('.deity-icon').style.animation = 'pulse 2s infinite';
  });

  avatar.addEventListener('mouseleave', () => {
    avatar.style.transform = 'translateX(0) scale(1)';
    avatar.querySelector('.deity-icon').style.animation = 'none';
  });
});

// ===== TRIBUTE SCHEDULE FILTERING =====
function filterTributes(deityName) {
  tributeEntries.forEach(entry => {
    const tributeDeity = entry.querySelector('.gold-accent').textContent;
    if (deityName === 'all' || tributeDeity.includes(deityName)) {
      entry.style.display = 'flex';
    } else {
      entry.style.display = 'none';
    }
  });
}

// Add event listeners to deity avatars for filtering
deityAvatars.forEach(avatar => {
  avatar.addEventListener('click', () => {
    const deityName = avatar.getAttribute('data-deity');
    filterTributes(deityName);
  });
});

// Reset filter when clicking the schedule title
document.querySelector('.schedule-title').addEventListener('click', () => {
  filterTributes('all');
});

// ===== INITIAL ANIMATIONS =====
// Staggered glyph reveal on page load
glyphs.forEach((glyph, index) => {
  setTimeout(() => {
    glyph.style.opacity = '1';
    glyph.style.transform = 'scale(1)';
  }, index * 100);
});

// Fade-in outer glyphs
outerGlyphs.forEach((glyph, index) => {
  setTimeout(() => {
    glyph.style.opacity = '1';
  }, index * 10);
});