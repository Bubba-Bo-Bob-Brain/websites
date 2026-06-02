// scripts.js

// ===== DOM ELEMENTS =====
const elements = {
  yggdrasilNodes: document.querySelectorAll('.realm-node'),
  realmIndicator: document.getElementById('realm-indicator'),
  realmBackground: document.getElementById('realm-background'),
  messagesContainer: document.getElementById('messages'),
  messageInput: document.getElementById('message-text'),
  sendButton: document.getElementById('send-button'),
  runicSwitch: document.getElementById('runic-switch'),
  bifrostOverlay: document.getElementById('bifrost-overlay'),
  realmName: document.querySelector('.realm-name')
};

// ===== REALM DATA =====
const realms = {
  asgard: {
    name: 'Asgard',
    runicName: 'ᚨᛋᚷᚨᚱᛞ',
    color: '#ffd700',
    backgroundClass: 'realm-asgard',
    themeColor: '#ffeb3b'
  },
  midgard: {
    name: 'Midgard',
    runicName: 'ᛗᛁᛞᚷᚨᚱᛞ',
    color: '#8bc34a',
    backgroundClass: 'realm-midgard',
    themeColor: '#a5d6a7'
  },
  jotunheim: {
    name: 'Jotunheim',
    runicName: 'ᛃᛟᛏᚢᚾᚺᛖᛁᛗ',
    color: '#64b5f6',
    backgroundClass: 'realm-jotunheim',
    themeColor: '#90caf9'
  },
  helheim: {
    name: 'Helheim',
    runicName: 'ᚻᛖᛚᚺᛖᛁᛗ',
    color: '#607d8b',
    backgroundClass: 'realm-helheim',
    themeColor: '#b0bec5'
  },
  alfheim: {
    name: 'Alfheim',
    runicName: 'ᚨᛚᚠᚺᛖᛁᛗ',
    color: '#ff80ab',
    backgroundClass: 'realm-alfheim',
    themeColor: '#f8bbd0'
  },
  muspelheim: {
    name: 'Muspelheim',
    runicName: 'ᛗᚢᛋᛈᛖᛚᚺᛖᛁᛗ',
    color: '#ff5722',
    backgroundClass: 'realm-muspelheim',
    themeColor: '#ffcdd2'
  },
  svartalfheim: {
    name: 'Svartalfheim',
    runicName: 'ᛊᚹᚨᚱᛏᚨᛚᚠᚺᛖᛁᛗ',
    color: '#9c27b0',
    backgroundClass: 'realm-svartalfheim',
    themeColor: '#e1bee7'
  },
  nidavellir: {
    name: 'Nidavellir',
    runicName: 'ᚾᛁᛞᚨᚠᛖᛚᛚᛁᚱ',
    color: '#795548',
    backgroundClass: 'realm-nidavellir',
    themeColor: '#d7ccc8'
  }
};

// ===== RUNIC TRANSLITERATION =====
const runicTranslations = {
  'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ',
  'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ',
  'q': 'ᚲᚹ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᚲᛊ',
  'y': 'ᛁ', 'z': 'ᛉ', 'å': 'ᛟ', 'ä': 'ᚨᛖ', 'ö': 'ᛟ', ' ': ' ', '-': '-', '?': '᛭'
};

function translateToRunes(text) {
  return text.toLowerCase().split('').map(char => runicTranslations[char] || char).join('');
}

// ===== REALM SWITCHING =====
function switchRealm(realmKey) {
  // Remove previous realm class
  Object.values(realms).forEach(realm => {
    elements.realmBackground.classList.remove(realm.backgroundClass);
  });

  // Add new realm class
  const realm = realms[realmKey];
  elements.realmBackground.classList.add(realm.backgroundClass);
  elements.realmName.textContent = realm.name;
  elements.realmIndicator.style.setProperty('--realm-color', realm.color);
  elements.realmIndicator.style.boxShadow = `0 0 15px ${realm.themeColor}`;

  // Trigger Bifrost effect
  triggerBifrost();

  // Update message input placeholder
  elements.messageInput.placeholder = `${realm.runicName} ᛋᚨᚷᚨ ᚦᛁᚾᚨ ᚹᚨᚱᛞᛋ`;
}

function triggerBifrost() {
  elements.bifrostOverlay.style.opacity = '1';
  setTimeout(() => {
    elements.bifrostOverlay.style.opacity = '0';
  }, 500);
}

// ===== MESSAGE SYSTEM =====
function createMessage(sender, content, realm) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${realm}`;

  const timestamp = formatTimestamp(new Date());
  const runicContent = translateToRunes(content);

  messageElement.innerHTML = `
    <div class="message-header">
      <span class="sender">${sender}</span>
      <span class="realm-tag">${realms[realm].name}</span>
    </div>
    <div class="message-content">
      <p>${content}</p>
      <div class="runic-transliteration">${runicContent}</div>
    </div>
    <div class="message-footer">
      <span class="timestamp">${timestamp}</span>
      <div class="raven-flight"></div>
    </div>
  `;

  elements.messagesContainer.appendChild(messageElement);
  scrollToBottom();

  // Animate raven delivery
  animateRavenDelivery(messageElement);
}

function animateRavenDelivery(messageElement) {
  const raven = messageElement.querySelector('.raven-flight');
  raven.style.opacity = '1';

  // Create flying raven animation
  const flyingRaven = document.createElement('div');
  flyingRaven.className = 'flying-raven';
  document.body.appendChild(flyingRaven);

  // Position raven at top right
  flyingRaven.style.position = 'absolute';
  flyingRaven.style.top = '10%';
  flyingRaven.style.right = '-50px';
  flyingRaven.style.width = '50px';
  flyingRaven.style.height = '30px';
  flyingRaven.style.background = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23607d8b\'><path d=\'M23 11.5l-5-3.5v3h-4v4h-2v-4h-4v-3l-5 3.5v-7l5-3.5v3h4v4h2v-4h4v3z\'/></svg>") no-repeat center';
  flyingRaven.style.backgroundSize = 'contain';
  flyingRaven.style.zIndex = '100';
  flyingRaven.style.transition = 'all 1s ease-in-out';

  // Animate to message
  setTimeout(() => {
    const rect = messageElement.getBoundingClientRect();
    flyingRaven.style.top = `${rect.top + window.scrollY - 20}px`;
    flyingRaven.style.right = `${window.innerWidth - rect.right + 20}px`;

    setTimeout(() => {
      flyingRaven.remove();
      raven.style.animation = 'fly 1.5s infinite ease-in-out';
    }, 1000);
  }, 100);
}

function scrollToBottom() {
  elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
}

function formatTimestamp(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

// ===== RUNIC TOGGLE =====
function toggleRunicTranslations() {
  const transliterations = document.querySelectorAll('.runic-transliteration');
  transliterations.forEach(el => {
    if (elements.runicSwitch.checked) {
      el.style.opacity = '0.8';
      el.style.maxHeight = '200px';
    } else {
      el.style.opacity = '0';
      el.style.maxHeight = '0';
    }
  });
}

// ===== EVENT LISTENERS =====
// Realm selection
elements.yggdrasilNodes.forEach(node => {
  node.addEventListener('click', () => {
    const realmKey = node.dataset.realm;
    switchRealm(realmKey);
  });

  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const realmKey = node.dataset.realm;
      switchRealm(realmKey);
    }
  });
});

// Message sending
elements.sendButton.addEventListener('click', sendMessage);
elements.messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const content = elements.messageInput.value.trim();
  if (!content) return;

  const currentRealm = Object.keys(realms).find(key =>
    elements.realmName.textContent === realms[key].name
  ) || 'asgard';

  const sender = getRandomSender(currentRealm);
  createMessage(sender, content, currentRealm);
  elements.messageInput.value = '';

  // Simulate raven taking message
  elements.sendButton.style.transform = 'translateY(-5px)';
  setTimeout(() => {
    elements.sendButton.style.transform = '';
  }, 200);
}

function getRandomSender(realm) {
  const senders = {
    asgard: ['Odin Allfather', 'Thor', 'Frigg', 'Heimdall', 'Tyr'],
    midgard: ['Humans', 'Einherjar', 'Volva', 'Berserker'],
    jotunheim: ['Loki', 'Ymir', 'Skadi', 'Thrym'],
    helheim: ['Hel', 'Draugr', 'Garm'],
    alfheim: ['Light Elves', 'Freyr'],
    muspelheim: ['Surtr', 'Fire Giants'],
    svartalfheim: ['Dark Elves', 'Dwarves'],
    nidavellir: ['Dwarves', 'Brokkr', 'Sindri']
  };
  return senders[realm][Math.floor(Math.random() * senders[realm].length)];
}

// Runic toggle
elements.runicSwitch.addEventListener('change', toggleRunicTranslations);

// ===== INITIALIZATION =====
function init() {
  // Set initial realm
  switchRealm('asgard');

  // Create some initial messages
  createMessage('Odin Allfather', 'Huginn and Muninn, bring me news from all realms.', 'asgard');
  createMessage('Thor', 'The giants grow restless in Jotunheim. I shall keep them in check.', 'midgard');
  createMessage('Hel', 'The dead whisper of Ragnarök...', 'helheim');

  // Set focus to message input
  elements.messageInput.focus();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);