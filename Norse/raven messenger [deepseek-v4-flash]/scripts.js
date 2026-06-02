// === DOM REFS ===
const realmItems = document.querySelectorAll('.realm-item');
const currentRealmName = document.getElementById('current-realm-name');
const realmIcon = document.querySelector('.realm-icon');
const messageThread = document.getElementById('message-thread');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const runeToggle = document.getElementById('rune-toggle');
const ravenCanvas = document.getElementById('raven-canvas');
const ctx = ravenCanvas.getContext('2d');

// === REALM DATA ===
const realms = {
  asgard: { rune: 'ᚨ', name: 'Asgard', epithet: 'ᚱᛖᚨᛚᛗ ᛟᚠ ᚷᛟᛞᛋ' },
  midgard: { rune: 'ᛗ', name: 'Midgard', epithet: 'ᚱᛖᚨᛚᛗ ᛟᚠ ᚺᚢᛗᚨᚾᛋ' },
  helheim: { rune: 'ᚺ', name: 'Helheim', epithet: 'ᚱᛖᚨᛚᛗ ᛟᚠ ᛏᚺᛖ ᛞᛖᚨᛞ' },
  vanaheim: { rune: 'ᚢ', name: 'Vanaheim', epithet: 'ᚱᛖᚨᛚᛗ ᛟᚠ ᚢᚨᚾᛁᚱ' },
  niflheim: { rune: 'ᚾ', name: 'Niflheim', epithet: 'ᚱᛖᚨᛚᛗ ᛟᚠ ᛗᛁᛋᛏ' },
  jotunheim: { rune: 'ᛃ', name: 'Jötunheim', epithet: 'ᚱᛖᚨᛚᛗ ᛟᚠ ᚷᛁᚨᚾᛏᛋ' }
};

let currentRealm = 'asgard';
let runicMode = false; // false = transliterated, true = runic

// === SIMPLE RUNIC MAP (transliteration) ===
const runeMap = {
  'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ',
  'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ',
  'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ',
  's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚢ', 'w': 'ᚹ', 'x': 'ᛉ',
  'y': 'ᚤ', 'z': 'ᛉ', 'æ': 'ᛇ', 'ø': 'ᛟ', 'å': 'ᚬ',
  'þ': 'ᚦ', 'ð': 'ᛞ', ' ': ' ', '.': '·', ',': ',',
  '!': '!', '?': '?', "'": "'", '-': '⸻'
};

function toRunic(text) {
  return text.toLowerCase().split('').map(ch => runeMap[ch] || ch).join('');
}

function fromRunic(runicText) {
  // reverse map
  const revMap = {};
  for (const [k, v] of Object.entries(runeMap)) revMap[v] = k;
  return runicText.split('').map(ch => revMap[ch] || ch).join('');
}

// === REALM SWITCH ===
function switchRealm(realmKey) {
  currentRealm = realmKey;
  const realm = realms[realmKey];
  
  // update UI
  currentRealmName.textContent = realm.name;
  realmIcon.textContent = realm.rune;
  
  // update active state
  realmItems.forEach(item => {
    item.classList.toggle('active', item.dataset.realm === realmKey);
  });
  
  // clear messages and load realm-specific messages
  messageThread.innerHTML = '';
  loadRealmMessages(realmKey);
  
  // trigger bifrost shimmer pulse
  const header = document.getElementById('realm-header');
  header.style.animation = 'none';
  header.offsetHeight; // reflow
  header.style.animation = 'bifrostPulse 0.8s ease-out';
  
  // raven flight animation on realm switch
  triggerRavenFlight();
}

// === REALM MESSAGES (sample data) ===
const realmMessages = {
  asgard: [
    { author: 'Odin', rune: 'ᚢ', text: 'Heil to the realms', time: 'ᛏᛁᛞᛖ · dawn' },
    { author: 'Frigg', rune: 'ᚠ', text: 'The weaves of Urdr weave', time: 'ᛏᛁᛞᛖ · dusk' },
    { author: 'Thor', rune: 'ᚦ', text: 'Mjöllnir hums in the mountains', time: 'ᛏᛁᛞᛖ · storm' }
  ],
  midgard: [
    { author: 'Egil', rune: 'ᛖ', text: 'The skalds sing of the north', time: 'ᛏᛁᛞᛖ · evening' },
    { author: 'Sigrid', rune: 'ᛋ', text: 'Runes carved in the stone', time: 'ᛏᛁᛞᛖ · morning' }
  ],
  helheim: [
    { author: 'Hel', rune: 'ᚺ', text: 'The cold mist whispers', time: 'ᛏᛁᛞᛖ · eternal' },
    { author: 'Garmr', rune: 'ᚷ', text: 'The gates are guarded', time: 'ᛏᛁᛞᛖ · shadow' }
  ],
  vanaheim: [
    { author: 'Njord', rune: 'ᚾ', text: 'The winds bring fortune', time: 'ᛏᛁᛞᛖ · tide' },
    { author: 'Freyr', rune: 'ᚠ', text: 'The fields grow abundant', time: 'ᛏᛁᛞᛖ · harvest' }
  ],
  niflheim: [
    { author: 'Hvergelmir', rune: 'ᚺ', text: 'The waters flow from the deep', time: 'ᛏᛁᛞᛖ · frost' }
  ],
  jotunheim: [
    { author: 'Skrymir', rune: 'ᛋ', text: 'The mountains tremble', time: 'ᛏᛁᛞᛖ · thunder' },
    { author: 'Thrym', rune: 'ᚦ', text: 'The hammer is hidden', time: 'ᛏᛁᛞᛖ · winter' }
  ]
};

function loadRealmMessages(realmKey) {
  const msgs = realmMessages[realmKey] || realmMessages.asgard;
  msgs.forEach(msg => {
    addMessage(msg.author, msg.rune, msg.text, msg.time, false);
  });
}

// === ADD MESSAGE ===
function addMessage(author, runeChar, text, time, animate = true) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message-wrapper';
  wrapper.dataset.author = author.toLowerCase();
  
  const runicText = toRunic(text);
  
  wrapper.innerHTML = `
    <div class="msg-frame knot-frame">
      <div class="msg-avatar">
        <span class="avatar-rune">${runeChar}</span>
      </div>
      <div class="msg-body">
        <div class="msg-author">${author}</div>
        <div class="msg-text ${runicMode ? 'runic' : ''}" data-runic="${runicText}">${runicMode ? runicText : text}</div>
        <div class="msg-time">${time || 'ᛏᛁᛞᛖ · now'}</div>
      </div>
    </div>
  `;
  
  if (animate) {
    wrapper.style.animation = 'none';
    wrapper.offsetHeight;
    wrapper.style.animation = 'messageRise 0.6s ease-out';
  }
  
  messageThread.appendChild(wrapper);
  messageThread.scrollTop = messageThread.scrollHeight;
  
  // raven delivery animation for new messages
  if (animate) triggerRavenFlight();
}

// === SEND MESSAGE ===
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  
  // random norse author for user messages
  const authors = [
    { name: 'You', rune: 'ᛁ' },
    { name: 'Wanderer', rune: 'ᚹ' },
    { name: 'Seeress', rune: 'ᛋ' },
    { name: 'Skald', rune: 'ᚲ' }
  ];
  const author = authors[Math.floor(Math.random() * authors.length)];
  
  addMessage(author.name, author.rune, text, 'ᛏᛁᛞᛖ · now', true);
  messageInput.value = '';
  messageInput.style.height = 'auto';
  
  // also store in realm messages
  realmMessages[currentRealm].push({
    author: author.name,
    rune: author.rune,
    text: text,
    time: 'ᛏᛁᛞᛖ · now'
  });
}

// === RUNIC TOGGLE ===
function toggleRunic() {
  runicMode = !runicMode;
  runeToggle.textContent = runicMode ? 'ᛏᛖᚲᛋᛏ' : 'ᚱᚢᚾᛖ';
  runeToggle.classList.toggle('active', runicMode);
  
  // update all visible messages
  document.querySelectorAll('.msg-text').forEach(el => {
    const runicText = el.dataset.runic;
    if (runicMode) {
      el.textContent = runicText;
      el.classList.add('runic');
    } else {
      el.textContent = fromRunic(runicText);
      el.classList.remove('runic');
    }
  });
}

// === RAVEN FLIGHT ANIMATION (canvas) ===
let ravenX = -80;
let ravenY = 60;
let ravenFrame = 0;
let ravenActive = false;
let ravenTarget = 0;

function triggerRavenFlight() {
  ravenActive = true;
  ravenX = -80;
  ravenY = 40 + Math.random() * 40;
  ravenTarget = 280;
  ravenFrame = 0;
  animateRaven();
}

function animateRaven() {
  if (!ravenActive) return;
  
  ctx.clearRect(0, 0, ravenCanvas.width, ravenCanvas.height);
  
  // draw raven silhouette
  ctx.fillStyle = '#1a1410';
  ctx.shadowColor = 'rgba(200,168,76,0.3)';
  ctx.shadowBlur = 20;
  
  // raven body (simplified)
  ctx.beginPath();
  ctx.ellipse(ravenX, ravenY, 24, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // wing
  ctx.beginPath();
  ctx.ellipse(ravenX - 10, ravenY - 6, 16, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // head
  ctx.beginPath();
  ctx.arc(ravenX + 20, ravenY - 4, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // beak
  ctx.beginPath();
  ctx.moveTo(ravenX + 28, ravenY - 6);
  ctx.lineTo(ravenX + 40, ravenY - 4);
  ctx.lineTo(ravenX + 28, ravenY - 2);
  ctx.fill();
  
  // runic trail
  ctx.shadowBlur = 10;
  ctx.font = '12px Norse, monospace';
  ctx.fillStyle = 'rgba(200,168,76,0.3)';
  ctx.fillText('ᚱ', ravenX - 30, ravenY - 10 + Math.sin(ravenFrame) * 4);
  ctx.fillText('ᚨ', ravenX - 50, ravenY - 8 + Math.sin(ravenFrame + 1) * 3);
  ctx.fillText('ᚢ', ravenX - 70, ravenY - 6 + Math.sin(ravenFrame + 2) * 5);
  
  ravenX += 3 + Math.sin(ravenFrame) * 0.5;
  ravenY += Math.sin(ravenFrame * 0.5) * 0.3;
  ravenFrame += 0.1;
  
  if (ravenX < ravenTarget) {
    requestAnimationFrame(animateRaven);
  } else {
    ravenActive = false;
    ctx.clearRect(0, 0, ravenCanvas.width, ravenCanvas.height);
  }
}

// === EVENT LISTENERS ===
realmItems.forEach(item => {
  item.addEventListener('click', () => {
    const realm = item.dataset.realm;
    if (realm !== currentRealm) switchRealm(realm);
  });
});

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
});

runeToggle.addEventListener('click', toggleRunic);

// === INIT ===
// set initial realm messages
loadRealmMessages('asgard');

// start periodic raven flights
setInterval(() => {
  if (Math.random() > 0.7 && !ravenActive) {
    triggerRavenFlight();
  }
}, 12000);

// initial raven flight
setTimeout(triggerRavenFlight, 1000);

// add bifrost pulse keyframe dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes bifrostPulse {
    0% { background: rgba(224,107,139,0); }
    30% { background: rgba(224,107,139,0.12); }
    60% { background: rgba(96,192,160,0.08); }
    100% { background: transparent; }
  }
`;
document.head.appendChild(styleSheet);