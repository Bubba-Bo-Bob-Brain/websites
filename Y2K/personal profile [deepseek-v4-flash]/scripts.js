// ============================================================
//  Y2K GLITTER PROFILE – JAVASCRIPT MAGIC
//  sparkles, music, guestbook, visitor counter
// ============================================================

// ---------- MUSIC PLAYER ----------
let audioCtx = null;
let audioElement = document.getElementById('bg-audio');
const playBtn = document.getElementById('playBtn');
const trackInfo = document.getElementById('track-info');

// fake playlist
const tracks = [
  { name: '☆ Aqua – Barbie Girl ☆', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: '☆ Vengaboys – Boom Boom ☆', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: '☆ Britney – Oops! ☆', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { name: '☆ Backstreet Boys – Everybody ☆', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { name: '☆ N*SYNC – Bye Bye Bye ☆', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
];

let currentTrackIndex = 0;

function loadTrack(index) {
  const track = tracks[index % tracks.length];
  audioElement.src = track.src;
  audioElement.load();
  trackInfo.textContent = track.name;
}

// play/pause toggle
function toggleMusic() {
  if (!audioCtx) {
    // init audio context on first user gesture
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (audioElement.paused) {
    // if no source loaded yet, load first track
    if (!audioElement.src || audioElement.src === window.location.href) {
      loadTrack(currentTrackIndex);
    }
    audioElement.play().then(() => {
      playBtn.textContent = '⏸ pause';
    }).catch(e => {
      console.warn('playback blocked:', e);
      trackInfo.textContent = '⚠ click again to play';
    });
  } else {
    audioElement.pause();
    playBtn.textContent = '▶ play';
  }
}

function stopMusic() {
  audioElement.pause();
  audioElement.currentTime = 0;
  playBtn.textContent = '▶ play';
}

// volume slider
document.getElementById('vol').addEventListener('input', function(e) {
  audioElement.volume = parseFloat(e.target.value);
});

// auto-advance to next track when song ends
audioElement.addEventListener('ended', function() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  audioElement.play().then(() => {
    playBtn.textContent = '⏸ pause';
  }).catch(() => {});
});

// ---------- SPARKLE TRAIL CURSOR ----------
const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');
let sparks = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// sparkle particle class
class Spark {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 3;
    this.speedX = (Math.random() - 0.5) * 6;
    this.speedY = (Math.random() - 0.5) * 6 - 2; // upward bias
    this.life = 1.0;
    this.decay = 0.01 + Math.random() * 0.03;
    this.color = this.randomColor();
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.2;
  }

  randomColor() {
    const colors = [
      '#ff66cc', '#ff99ff', '#66ffff', '#ffff66', '#ff9966',
      '#cc66ff', '#66ffcc', '#ff6666', '#ffcc66', '#ff88dd'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.05; // gravity
    this.life -= this.decay;
    this.rotation += this.rotSpeed;
    this.size *= 0.99;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    // draw star shape
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const spikes = 5;
    const outerR = this.size;
    const innerR = this.size * 0.4;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    // inner glow dot
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }
}

// mouse move handler
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // spawn a burst of sparks
  for (let i = 0; i < 3; i++) {
    sparks.push(new Spark(mouseX + (Math.random() - 0.5) * 10, mouseY + (Math.random() - 0.5) * 10));
  }
  // limit sparks
  if (sparks.length > 300) {
    sparks.splice(0, sparks.length - 300);
  }
});

// animation loop
function animateSparks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = sparks.length - 1; i >= 0; i--) {
    sparks[i].update();
    sparks[i].draw();
    if (sparks[i].life <= 0 || sparks[i].size < 0.5) {
      sparks.splice(i, 1);
    }
  }
  requestAnimationFrame(animateSparks);
}
animateSparks();

// also spawn occasional ambient sparkles
setInterval(() => {
  if (sparks.length < 100) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    for (let i = 0; i < 5; i++) {
      sparks.push(new Spark(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40));
    }
  }
}, 800);

// ---------- GUESTBOOK ----------
function addGuestEntry() {
  const nameInput = document.getElementById('guest-name');
  const msgInput = document.getElementById('guest-msg');
  const name = nameInput.value.trim() || '☆ anonymous ☆';
  const msg = msgInput.value.trim();
  if (!msg) {
    alert('✎ write a message, silly!');
    return;
  }

  const entriesContainer = document.querySelector('.guestbook-entries');
  const newEntry = document.createElement('div');
  newEntry.className = 'entry';
  // pick a random sparkly user tag
  const tags = ['★ glitterboy', '☆ xo_lucy_xo', '★ sk8r_princess', '☆ neon_dreamer', '★ punk_fairy', '☆ tamagotchi_luv'];
  const randomTag = tags[Math.floor(Math.random() * tags.length)];
  const displayName = name.includes('★') || name.includes('☆') ? name : `☆ ${name} ☆`;
  newEntry.innerHTML = `<span class="entry-user">${displayName}:</span> ${escapeHtml(msg)} <span style="color:#ff66aa;">✧</span>`;
  entriesContainer.prepend(newEntry);

  // limit entries
  while (entriesContainer.children.length > 20) {
    entriesContainer.removeChild(entriesContainer.lastChild);
  }

  // clear inputs
  nameInput.value = '';
  msgInput.value = '';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// allow Enter key to submit
document.getElementById('guest-msg').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addGuestEntry();
  }
});

// ---------- HIT COUNTER (fake but fun) ----------
let counterValue = 2358;
function incrementCounter() {
  counterValue++;
  const display = document.getElementById('counter-digits');
  const displayFooter = document.querySelector('.counter-digits-footer');
  const padded = String(counterValue).padStart(6, '0');
  if (display) display.textContent = padded;
  if (displayFooter) displayFooter.textContent = padded;
}
// increment every few seconds to simulate live traffic
setInterval(incrementCounter, 4000 + Math.random() * 3000);

// also increment on page load
window.addEventListener('load', function() {
  incrementCounter();
});

// ---------- MARQUEE STATUS (bonus) ----------
// inject a scrolling status marquee below title
const marqueeStatus = document.createElement('marquee');
marqueeStatus.scrollAmount = 4;
marqueeStatus.behavior = 'scroll';
marqueeStatus.direction = 'left';
marqueeStatus.style.cssText = `
  background: #ff66cc88; color: #ffffaa; font-weight: bold;
  padding: 4px 0; border-radius: 40px; margin: 6px 0;
  border: 2px solid #ffccff;
`;
const statusMessages = [
  '♫ now playing: Aqua – Barbie Girl ♫',
  '✿ currently online: glitterFairy ★',
  '💌 3 new messages! check your inbox!',
  '🌟 mood: sparkly and blessed 🌟',
  '📱 text me at 555-💖-GLITTER',
  '🎮 playing: The Sims (making out with townies)',
  '🛒 just bought: butterfly clips + jelly sandals',
  '⭐ AIM away message: at the mall, brb'
];
let msgIndex = 0;
setInterval(() => {
  msgIndex = (msgIndex + 1) % statusMessages.length;
  marqueeStatus.textContent = statusMessages[msgIndex];
}, 6000);
marqueeStatus.textContent = statusMessages[0];
document.getElementById('page-header').appendChild(marqueeStatus);

// ---------- BONUS: FLASHING TITLE (blink) ----------
// add blink class to page title periodically
const pageTitle = document.querySelector('title');
setInterval(() => {
  if (pageTitle.textContent.includes('★')) {
    pageTitle.textContent = '✧ sTaRdUsT pRoFiLe ✧';
  } else {
    pageTitle.textContent = '★ sTaRdUsT pRoFiLe ★';
  }
}, 2000);

// ---------- CONSOLE EASTER EGG ----------
console.log('%c🌟 GLITTER PROFILE v2.0 🌟', 'font-size:24px; color:#ff66cc; text-shadow: 0 0 10px #ff66aa;');
console.log('%c✧ made with 💖 & too much glitter ✧', 'color: #aa66ff; font-size: 14px;');
console.log('%c★ if you read this, you are a true y2k baddie ★', 'color: #66ffcc; font-size: 12px;');