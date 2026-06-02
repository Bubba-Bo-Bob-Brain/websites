(function() {
  const realms = {
    asgard: { name: 'Asgard', sub: 'Golden Realm', icon: 'ᚨ', color: '#d4af37' },
    midgard: { name: 'Midgard', sub: 'Mortal Realm', icon: 'ᛗ', color: '#6b8c5c' },
    vanaheim: { name: 'Vanaheim', sub: 'Fertile Land', icon: 'ᚹ', color: '#9ebd6e' },
    jotunheim: { name: 'Jotunheim', sub: 'Giant Wilderness', icon: 'ᛃ', color: '#7d8c9e' },
    alfheim: { name: 'Alfheim', sub: 'Elven Light', icon: 'ᚨ', color: '#d9e0a5' },
    nidavellir: { name: 'Nidavellir', sub: 'Dwarf Caverns', icon: 'ᚾ', color: '#b0855c' },
    helheim: { name: 'Helheim', sub: 'Misty Underworld', icon: 'ᚺ', color: '#5c6b73' },
    muspelheim: { name: 'Muspelheim', sub: 'Fire Realm', icon: 'ᛗ', color: '#c94f1f' },
    niflheim: { name: 'Niflheim', sub: 'Fog & Ice', icon: 'ᚾ', color: '#7fa3b3' }
  };

  let activeRealm = 'asgard';
  let runicMode = true;

  const realmNodes = document.querySelectorAll('.realm-node');
  const realmNameEl = document.getElementById('realmName');
  const realmSubEl = document.querySelector('.realm-sub');
  const realmIconEl = document.getElementById('realmIcon');
  const bifrostOverlay = document.getElementById('bifrostOverlay');
  const messageContainer = document.getElementById('messageContainer');
  const threadList = document.getElementById('threadList');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const runeToggle = document.getElementById('runeToggle');
  const ravenFlight = document.getElementById('ravenFlight');
  const flightRaven = document.getElementById('flightRaven');
  const huginnStatus = document.getElementById('huginnStatus');
  const muninnStatus = document.getElementById('muninnStatus');
  const runeStoneDisplay = document.getElementById('runeStoneDisplay');
  const stoneCarving = runeStoneDisplay.querySelector('.stone-carving');
  const emberContainer = document.getElementById('emberContainer');

  function updateRealmUI(realmKey) {
    const realm = realms[realmKey];
    realmNameEl.textContent = realm.name;
    realmSubEl.textContent = realm.sub;
    realmIconEl.textContent = realm.icon;
    stoneCarving.textContent = realm.icon;
    
    realmNodes.forEach(node => {
      const nodeRealm = node.dataset.realm;
      if (nodeRealm === realmKey) {
        node.classList.add('active-realm');
      } else {
        node.classList.remove('active-realm');
      }
    });

    document.querySelector('.message-hall').style.boxShadow = `inset 0 0 80px ${realm.color}15`;
  }

  function triggerBifrost() {
    bifrostOverlay.classList.add('active');
    setTimeout(() => {
      bifrostOverlay.classList.remove('active');
    }, 900);
  }

  function switchRealm(realmKey) {
    if (activeRealm === realmKey) return;
    activeRealm = realmKey;
    triggerBifrost();
    updateRealmUI(realmKey);
    sendRavenFlight();
  }

  realmNodes.forEach(node => {
    node.addEventListener('click', () => {
      const realmKey = node.dataset.realm;
      switchRealm(realmKey);
    });
  });

  function sendRavenFlight() {
    flightRaven.classList.remove('fly');
    void flightRaven.offsetWidth;
    flightRaven.classList.add('fly');
    
    huginnStatus.classList.add('flying');
    muninnStatus.classList.add('flying');
    setTimeout(() => {
      huginnStatus.classList.remove('flying');
      muninnStatus.classList.remove('flying');
    }, 1800);
  }

  function createEmberParticle() {
    const particle = document.createElement('div');
    particle.className = 'ember-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = '0px';
    particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
    particle.style.animationDelay = Math.random() * 3 + 's';
    emberContainer.appendChild(particle);
    
    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }

  setInterval(() => {
    if (document.visibilityState === 'visible') {
      createEmberParticle();
    }
  }, 400);

  for (let i = 0; i < 12; i++) {
    setTimeout(() => createEmberParticle(), i * 250);
  }

  function addMessageToThread(senderName, senderCrest, runeContent, latinContent, senderType) {
    const card = document.createElement('div');
    card.className = 'message-card arrival-animation';
    card.dataset.sender = senderType;
    
    card.innerHTML = `
      <div class="card-frame knotwork-frame">
        <div class="sender-crest">${senderCrest}</div>
        <div class="message-body">
          <div class="sender-name">${senderName}</div>
          <p class="rune-text">${runeContent}</p>
          <p class="latin-text">${latinContent}</p>
        </div>
        <div class="message-foot">· Huginn & Muninn ·</div>
      </div>
    `;
    
    threadList.appendChild(card);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    
    if (!runicMode) {
      card.querySelector('.rune-text').style.display = 'none';
    } else {
      card.querySelector('.latin-text').style.display = 'none';
    }
    
    sendRavenFlight();
  }

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawText = messageInput.value.trim();
    if (rawText === '') return;
    
    const latinText = rawText;
    const runeText = convertToRunes(rawText);
    
    addMessageToThread('You', 'ᛉ', runeText, latinText, 'user');
    messageInput.value = '';
  });

  function convertToRunes(text) {
    const runeMap = {
      'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ',
      'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ',
      'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ',
      'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᚲᛋ', 'y': 'ᛃ', 'z': 'ᛉ',
      ' ': ' ', '.': '·', ',': '᛬', '!': '᛭'
    };
    
    return text.toLowerCase().split('').map(char => runeMap[char] || char).join('');
  }

  runeToggle.addEventListener('change', (e) => {
    runicMode = e.target.checked;
    const allRuneTexts = document.querySelectorAll('.rune-text');
    const allLatinTexts = document.querySelectorAll('.latin-text');
    
    if (runicMode) {
      allRuneTexts.forEach(el => el.style.display = 'block');
      allLatinTexts.forEach(el => el.style.display = 'none');
    } else {
      allRuneTexts.forEach(el => el.style.display = 'none');
      allLatinTexts.forEach(el => el.style.display = 'block');
    }
  });

  updateRealmUI('asgard');

  const muteToggle = document.getElementById('muteToggle');
  let ambientMuted = false;
  muteToggle.addEventListener('click', () => {
    ambientMuted = !ambientMuted;
    muteToggle.classList.toggle('muted', ambientMuted);
    const soundOn = muteToggle.querySelector('.sound-on');
    const soundOff = muteToggle.querySelector('.sound-off');
    if (ambientMuted) {
      soundOn.style.display = 'none';
      soundOff.style.display = 'inline';
    } else {
      soundOn.style.display = 'inline';
      soundOff.style.display = 'none';
    }
  });

  const presetMessages = [
    { sender: 'Thor', crest: 'ᚦ', rune: 'ᚦᚢᚾᛞᛖᚱ ᚱᛟᛚᛚᛋ ᛟᚹᛖᚱ ᛗᛁᛞᚷᚨᚱᛞ', latin: 'Thunder rolls over Midgard.', type: 'thor' },
    { sender: 'Loki', crest: 'ᛚ', rune: 'ᚨ ᛏᚱᛁᚲᚲ ᛁᛋ ᛒᚱᛖᚹᛁᛜ ᛁᚾ ᚨᛋᚷᚨᚱᛞ', latin: 'A trick is brewing in Asgard.', type: 'loki' },
    { sender: 'Freya', crest: 'ᚠ', rune: 'ᚠᚨᛚᚲᛟᚾ ᚠᛖᚨᛏᚺᛖᚱᛋ ᛋᚺᛁᛗᛗᛖᚱ', latin: 'Falcon feathers shimmer.', type: 'freya' }
  ];

  let presetIndex = 0;
  setInterval(() => {
    if (document.visibilityState === 'visible' && threadList.children.length < 10) {
      const msg = presetMessages[presetIndex % presetMessages.length];
      addMessageToThread(msg.sender, msg.crest, msg.rune, msg.latin, msg.type);
      presetIndex++;
    }
  }, 18000);

  setTimeout(() => {
    const firstPreset = presetMessages[0];
    addMessageToThread(firstPreset.sender, firstPreset.crest, firstPreset.rune, firstPreset.latin, firstPreset.type);
    presetIndex = 1;
  }, 3000);
})();