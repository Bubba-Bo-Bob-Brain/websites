const runicToggle = document.getElementById('runicToggle');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const realmItems = document.querySelectorAll('.realm-item');
const messagesContainer = document.getElementById('messagesContainer');
const ravenFlightContainer = document.getElementById('ravenFlightContainer');
const bifrostOverlay = document.querySelector('.bifrost-overlay');

const runeMap = {
  'a': 'ᚫ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᛩ', 'r': 'ᚱ', 's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᛉ', 'y': 'ᛇ', 'z': 'ᛉ', ' ': '᛭', '.': '᛭', ',': '᛭', '!': '᛭', '?': '᛭', "'": '᛭', '-': '᛭'
};

function transliterateToRunes(text) {
  return text.toLowerCase().split('').map(char => runeMap[char] || char).join('');
}

function toggleRunicMode() {
  const isRunic = document.body.classList.toggle('runic-mode');
  runicToggle.classList.toggle('active', isRunic);
  document.querySelectorAll('.message-text').forEach(msgText => {
    const original = msgText.getAttribute('data-original-text');
    msgText.textContent = isRunic ? transliterateToRunes(original) : original;
  });
}

function switchRealm(selectedRealm) {
  realmItems.forEach(item => item.classList.remove('active'));
  selectedRealm.classList.add('active');
  const realmColor = selectedRealm.getAttribute('data-color');
  document.documentElement.style.setProperty('--active-realm-color', realmColor);
  bifrostOverlay.classList.add('active');
  setTimeout(() => bifrostOverlay.classList.remove('active'), 1000);
  const selectedRealmName = selectedRealm.getAttribute('data-realm');
  document.querySelectorAll('.message').forEach(msg => {
    const isMatch = msg.getAttribute('data-realm') === selectedRealmName;
    msg.style.display = isMatch ? 'flex' : 'none';
    if (isMatch) {
      msg.style.animation = 'none';
      msg.offsetHeight;
      msg.style.animation = 'messageFadeIn 0.5s ease-out';
    }
  });
}

function triggerRavenFlight() {
  const raven = document.createElement('div');
  raven.className = 'raven-flight';
  raven.innerHTML = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="9" ry="12" fill="#1a1a1a"/><circle cx="20" cy="12" r="7" fill="#1a1a1a"/><path d="M20 5 L20 0 L22 3 Z" fill="#1a1a1a"/><path d="M11 24 C6 20, 4 14, 8 10" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/><path d="M29 24 C34 20, 36 14, 32 10" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="11" r="1.5" fill="#ff8f00"/><path d="M13 34 L10 38 M20 36 L20 40 M27 34 L30 38" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  ravenFlightContainer.appendChild(raven);
  raven.addEventListener('animationend', () => raven.remove());
}

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  const activeRealmItem = document.querySelector('.realm-item.active');
  const activeRealm = activeRealmItem.getAttribute('data-realm');
  const activeRealmColor = activeRealmItem.getAttribute('data-color');
  const messageEl = document.createElement('article');
  messageEl.className = `message carved-message ${activeRealm}-message`;
  messageEl.setAttribute('data-realm', activeRealm);
  messageEl.setAttribute('data-sender', 'You');
  const isRunic = document.body.classList.contains('runic-mode');
  const displayText = isRunic ? transliterateToRunes(text) : text;
  const formattedRealm = activeRealm.charAt(0).toUpperCase() + activeRealm.slice(1);
  messageEl.innerHTML = `
    <div class="message-avatar">
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="16" fill="#1a237e" stroke="${activeRealmColor}" stroke-width="1.5"/>
        <text x="18" y="23" text-anchor="middle" fill="${activeRealmColor}" font-family="Cinzel, serif" font-size="18" font-weight="700">ᛃ</text>
      </svg>
    </div>
    <div class="message-inner">
      <div class="message-meta">
        <strong class="message-author">You</strong>
        <span class="message-realm-badge">${formattedRealm}</span>
        <time class="message-time">Just now</time>
      </div>
      <p class="message-text" data-original-text="${text}">${displayText}</p>
    </div>
  `;
  messagesContainer.querySelector('.messages-list').appendChild(messageEl);
  messageInput.value = '';
  triggerRavenFlight();
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

runicToggle.addEventListener('click', toggleRunicMode);
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
realmItems.forEach(item => item.addEventListener('click', () => switchRealm(item)));

document.addEventListener('DOMContentLoaded', () => {
  const initialRealm = document.querySelector('.realm-item[data-realm="asgard"]');
  switchRealm(initialRealm);
  document.querySelectorAll('.message').forEach((msg, index) => {
    msg.style.animationDelay = `${index * 0.1}s`;
  });
  messageInput.focus();
});