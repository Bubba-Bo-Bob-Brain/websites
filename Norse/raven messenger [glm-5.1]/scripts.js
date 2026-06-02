const ELDER_FUTHARK = {
  a: 'ᚨ', b: 'ᛒ', c: 'ᚲ', d: 'ᛞ', e: 'ᛖ', f: 'ᚠ', g: 'ᚷ',
  h: 'ᚺ', i: 'ᛁ', j: 'ᛃ', k: 'ᚲ', l: 'ᛚ', m: 'ᛗ', n: 'ᚾ',
  o: 'ᛟ', p: 'ᛈ', q: 'ᚲ', r: 'ᚱ', s: 'ᛋ', t: 'ᛏ', u: 'ᚢ',
  v: 'ᚹ', w: 'ᚹ', x: 'ᚲᛋ', y: 'ᛇ', z: 'ᛉ',
  á: 'ᚨ', é: 'ᛖ', í: 'ᛁ', ó: 'ᛟ', ú: 'ᚢ', ý: 'ᛇ',
  þ: 'ᚦ', ð: 'ᚦ', æ: 'ᚨ', ø: 'ᛟ', å: 'ᚨ',
  Þ: 'ᚦ', Ð: 'ᚦ', Æ: 'ᚨ', Ø: 'ᛟ', Å: 'ᚨ'
};

const REALM_DATA = {
  asgard: {
    name: 'Asgard',
    subtitle: 'Realm of the Æsir',
    rune: 'ᚨ',
    title: 'Asgard — Hall of the Æsir',
    description: 'Where the gods convene in glory and wisdom',
    weather: 'Golden Light',
    threat: 'Elevated',
    threatLevel: 'elevated',
    bifrost: 'Active',
    ravens: 'Both in flight',
    deityCount: '12 in this realm',
    accent: '#c9952d',
    glow: '#ffd700'
  },
  midgard: {
    name: 'Midgard',
    subtitle: 'Realm of Mortals',
    rune: 'ᛗ',
    title: 'Midgard — The Middle Garden',
    description: 'Where humans dwell beneath the sheltering boughs',
    weather: 'Overcast',
    threat: 'Moderate',
    threatLevel: '',
    bifrost: 'Stable',
    ravens: 'Hugin circling',
    deityCount: '28 in this realm',
    accent: '#5a8a5a',
    glow: '#7ab87a'
  },
  helheim: {
    name: 'Helheim',
    subtitle: 'Realm of the Dead',
    rune: 'ᚺ',
    title: 'Helheim — Halls of the Departed',
    description: 'Where the unworthy dead find their cold rest',
    weather: 'Frost and Shadow',
    threat: 'High',
    threatLevel: 'elevated',
    bifrost: 'Shrouded',
    ravens: 'Munin only',
    deityCount: '7 in this realm',
    accent: '#4a7a8a',
    glow: '#7ab8cc'
  },
  jotunheim: {
    name: 'Jötunheimr',
    subtitle: 'Realm of the Giants',
    rune: 'ᛃ',
    title: 'Jötunheimr — Land of the Jötnar',
    description: 'Where the ancient giants roam the primordial wilds',
    weather: 'Bitter Storms',
    threat: 'Critical',
    threatLevel: 'elevated',
    bifrost: 'Unstable',
    ravens: 'None sent',
    deityCount: '3 in this realm',
    accent: '#5a8aaa',
    glow: '#8ac0e0'
  },
  vanaheim: {
    name: 'Vanaheim',
    subtitle: 'Realm of the Vanir',
    rune: 'ᚹ',
    title: 'Vanaheim — Fields of the Vanir',
    description: 'Where the old gods work their earth-bound magics',
    weather: 'First Snows',
    threat: 'Low',
    threatLevel: '',
    bifrost: 'Active',
    ravens: 'Munin returning',
    deityCount: '6 in this realm',
    accent: '#6a8a4a',
    glow: '#8ab86a'
  },
  alfheim: {
    name: 'Álfheimr',
    subtitle: 'Realm of the Light Elves',
    rune: 'ᛅ',
    title: 'Álfheimr — Shining Fields',
    description: 'Where the light elves dance in eternal radiance',
    weather: 'Luminous Mist',
    threat: 'Peaceful',
    threatLevel: '',
    bifrost: 'Gleaming',
    ravens: 'Neither',
    deityCount: '4 in this realm',
    accent: '#c8b070',
    glow: '#e8d898'
  },
  svartalfheim: {
    name: 'Svartálfaheimr',
    subtitle: 'Realm of the Dark Elves',
    rune: 'ᛋ',
    title: 'Svartálfaheimr — The Forging Deep',
    description: 'Where master smiths hammer wonders in the dark',
    weather: 'Cinder Fog',
    threat: 'Moderate',
    threatLevel: '',
    bifrost: 'Hidden',
    ravens: 'Hugin watching',
    deityCount: '5 in this realm',
    accent: '#7a5a8a',
    glow: '#a880b8'
  },
  niflheim: {
    name: 'Niflheim',
    subtitle: 'Realm of Primordial Ice',
    rune: 'ᚾ',
    title: 'Niflheim — The Mist World',
    description: 'Where ice and mist birthed the first rivers of being',
    weather: 'Eternal Frost',
    threat: 'High',
    threatLevel: 'elevated',
    bifrost: 'Frozen',
    ravens: 'Neither can reach',
    deityCount: '2 in this realm',
    accent: '#6a8a9a',
    glow: '#98c0d0'
  },
  muspelheim: {
    name: 'Múspellsheimr',
    subtitle: 'Realm of Primordial Fire',
    rune: 'ᛗ',
    title: 'Múspellsheimr — The Blazing South',
    description: 'Where Surtr waits with his flaming sword at the world\'s end',
    weather: 'Inferno Winds',
    threat: 'Critical',
    threatLevel: 'elevated',
    bifrost: 'Burned',
    ravens: 'Cannot approach',
    deityCount: '1 in this realm',
    accent: '#c84a2a',
    glow: '#e86a3a'
  }
};

const REALM_MESSAGES = {
  asgard: [
    { sender: 'odin', name: 'Óðinn', title: 'Allfather', rune: 'ᛟ', text: 'I have sacrificed my eye for wisdom, yet even I cannot see all that the Norns have woven. The threads of fate grow tangled.', raven: 'hugin', time: '08:00', reactions: { '🗡️': 3, '⚡': 5 } },
    { sender: 'thor', name: 'Þórr', title: 'God of Thunder', rune: 'ᚦ', text: 'The giants stir again beyond the wall. Mjölnir hungers. I say we ride out at dawn and show them the meaning of thunder.', raven: 'munin', time: '08:05', reactions: { '🔨': 7, '⚡': 12 } },
    { sender: 'freyja', name: 'Freyja', title: 'Lady of Sessrúmnir', rune: 'ᚠ', text: 'While you speak of war, the first snows have fallen on Vanaheim. My falcon cloak grows restless. I will fly between the realms before the day is out.', raven: 'hugin', time: '08:12', reactions: { '🦅': 4, '🌸': 6 } },
    { sender: 'loki', name: 'Loki', title: 'The Trickster', rune: 'ᛚ', text: 'How amusing that you all scramble like mice when the world-tree trembles. Perhaps if you listened more and struck less, you would understand what approaches. But what do I know? I am merely the father of monsters.', raven: 'munin', time: '08:20', reactions: { '🔥': 9, '🐍': 8 } },
    { sender: 'heimdall', name: 'Heimdallr', title: 'Watchman of the Gods', rune: 'ᚺ', text: 'I see them from Bifröst\'s bridge — shapes gathering where the rainbow meets the void. Gjallarhorn remains silent, but my hand rests upon it. Stay vigilant.', raven: 'hugin', time: '08:28', reactions: { '🎺': 2, '👁️': 11 } },
    { sender: 'odin', name: 'Óðinn', title: 'Allfather', rune: 'ᛟ', text: 'Loki speaks in riddles as always, but even a serpent\'s words may carry truth. I will consult the head of Mímir. Until then, ready your arms and your wits. Ragnarök does not announce its coming with fanfare.', raven: 'hugin', time: '08:35', reactions: { '🗡️': 6, '🐺': 4 } },
    { sender: 'tyr', name: 'Týr', title: 'God of War', rune: 'ᛏ', text: 'I have fed my hand to Fenrir once. I would feed my other to buy us time. Say the word, Allfather. The blade does not hesitate.', raven: 'munin', time: '08:42', reactions: { '⚔️': 15, '🤚': 3 } }
  ],
  midgard: [
    { sender: 'hermod', name: 'Hermóðr', title: 'Messenger of the Gods', rune: 'ᚺ', text: 'The mortals build their longships once more. They look to the skies and whisper our names. Their faith is a flickering flame, but it has not gone out.', raven: 'hugin', time: '09:10', reactions: { '🛶': 5, '🔥': 8 } },
    { sender: 'odin', name: 'Óðinn', title: 'Allfather', rune: 'ᛟ', text: 'Let them build. Let them sail. Each voyage is a prayer, each storm survived a tribute. They do not know how closely we watch.', raven: 'munin', time: '09:18', reactions: { '👁️': 10, '🌊': 6 } },
    { sender: 'thor', name: 'Þórr', title: 'God of Thunder', rune: 'ᚦ', text: 'I have calmed three storms this moon alone for their fishermen. They leave me mead at their hearths. It is a fair exchange.', raven: 'hugin', time: '09:25', reactions: { '⛈️': 14, '🍺': 9 } }
  ],
  helheim: [
    { sender: 'hel', name: 'Hel', title: 'Keeper of the Dead', rune: 'ᚺ', text: 'My halls grow restless. The dead sense what stirs above. They whisper of a time when my gates will shatter and all who rest here shall walk again.', raven: 'munin', time: '22:00', reactions: { '💀': 7, '🚪': 3 } },
    { sender: 'garm', name: 'Garmr', title: 'The Hound', rune: 'ᚷ', text: 'I pace at the threshold. I smell the blood that is to come. The chain chafes. It will not hold forever.', raven: 'hugin', time: '22:15', reactions: { '🐺': 11, '⛓️': 5 } }
  ],
  jotunheim: [
    { sender: 'thrym', name: 'Þrymr', title: 'King of the Frost Giants', rune: 'ᚦ', text: 'We have waited long beneath the frozen peaks. Our patience is a glacier — slow, vast, and inevitable. The Æsir grow complacent.', raven: 'hugin', time: '06:00', reactions: { '🧊': 6, '⛰️': 4 } },
    { sender: 'skadi', name: 'Skaði', title: 'Goddess of Winter', rune: 'ᛋ', text: 'I walk between two worlds, and I am at home in neither. But the mountains still sing to me, and the cold does not lie.', raven: 'munin', time: '06:30', reactions: { '❄️': 8, '🏔️': 7 } }
  ],
  vanaheim: [
    { sender: 'njord', name: 'Njörðr', title: 'Lord of the Sea', rune: 'ᚾ', text: 'The tides carry whispers of war from the other realms. I would rather the wind fill our sails and the nets run full. But I am not blind to what comes.', raven: 'hugin', time: '11:00', reactions: { '🌊': 9, '🐟': 5 } },
    { sender: 'freyr', name: 'Freyr', title: 'Lord of the Harvest', rune: 'ᚠ', text: 'The fields have given their last golden yield. Something in the soil has changed. The land itself prepares for what is to come.', raven: 'munin', time: '11:20', reactions: { '🌾': 12, '☀️': 8 } }
  ],
  alfheim: [
    { sender: 'light_elf', name: 'Aurelius', title: 'Luminous Sentinel', rune: 'ᛅ', text: 'The borders of Álfheimr shimmer with a light that even our ancient eyes find too bright. Something burns at the edge of our world — not fire, but prophecy.', raven: 'hugin', time: '14:00', reactions: { '✨': 6, '🌟': 4 } }
  ],
  svartalfheim: [
    { sender: 'eitri', name: 'Eitri', title: 'Master Smith', rune: 'ᛋ', text: 'The forge-fires burn with an unusual heat today. The metal sings of things to come. I have shaped Gungnir and Draupnir — but the work I sense now would make those seem like toys.', raven: 'munin', time: '16:00', reactions: { '🔨': 10, '🔥': 7 } },
    { sender: 'brokkr', name: 'Brokkr', title: 'Smith of the Deep', rune: 'ᛒ', text: 'My brother speaks in riddles again. But the anvils do not lie. We have begun a new commission — one that will outlast us all, perhaps.', raven: 'hugin', time: '16:30', reactions: { '⚒️': 8, '💍': 5 } }
  ],
  niflheim: [
    { sender: 'norn_urdr', name: 'Urðr', title: 'Norn of Fate', rune: 'ᚢ', text: 'The well runs dark. What was, what is, what must be — all three threads tangle at the root. We do not spin fate, dear ones. We merely name it.', raven: 'hugin', time: '00:00', reactions: { '🧵': 15, '🕳️': 9 } },
    { sender: 'norn_verdandi', name: 'Verðandi', title: 'Norn of Being', rune: 'ᚹ', text: 'The present is a blade that cuts both ways. Every choice made in the nine realms is felt here, in the mist, in the ice. The weight of now is unbearable.', raven: 'munin', time: '00:05', reactions: { '⏳': 7, '❄️': 5 } }
  ],
  muspelheim: [
    { sender: 'surtr', name: 'Surtr', title: 'The Black One', rune: 'ᛋ', text: 'I wait. I have always waited. The flame does not hurry, for it knows that all things will come to it in the end. Even the gods.', raven: 'hugin', time: '20:00', reactions: { '🔥': 20, '⚔️': 13 } }
  ]
};

const DEITY_AVATARS = {
  odin: 'ᛟ', thor: 'ᚦ', loki: 'ᛚ', freyja: 'ᚠ', heimdall: 'ᚺ',
  tyr: 'ᛏ', frigg: 'ᚠ', baldr: 'ᛒ', bragi: 'ᛒ', skadi: 'ᛋ',
  vidar: 'ᚹ', forseti: 'ᚠ', hermod: 'ᚺ', hel: 'ᚺ', garm: 'ᚷ',
  thrym: 'ᚦ', njord: 'ᚾ', freyr: 'ᚠ', eitri: 'ᛋ', brokkr: 'ᛒ',
  norn_urdr: 'ᚢ', norn_verdandi: 'ᚹ', surtr: 'ᛋ', light_elf: 'ᛅ'
};

let state = {
  activeRealm: 'asgard',
  runicMode: false,
  soundEnabled: true,
  selectedRaven: 'hugin',
  runePreviewVisible: false,
  settingsOpen: false,
  messages: {}
};

Object.keys(REALM_MESSAGES).forEach(function(realm) {
  state.messages[realm] = REALM_MESSAGES[realm].map(function(msg) {
    return Object.assign({}, msg, { id: generateId() });
  });
});

function generateId() {
  return 'msg_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
}

function transliterateToRunes(text) {
  return text.split('').map(function(char) {
    var lower = char.toLowerCase();
    if (ELDER_FUTHARK[lower]) {
      return ELDER_FUTHARK[lower];
    }
    if (char === ' ') return ' ';
    if (char === '\n') return '\n';
    if (/[^a-zA-Z]/.test(char)) return char;
    return char;
  }).join('');
}

function showToast(message) {
  var container = document.getElementById('toastContainer');
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('removing');
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
}

function triggerBifrostShimmer() {
  var shimmer = document.getElementById('bifrostShimmer');
  shimmer.classList.remove('active');
  void shimmer.offsetWidth;
  shimmer.classList.add('active');
  setTimeout(function() {
    shimmer.classList.remove('active');
  }, 1200);
}

function triggerRavenFlight(callback) {
  var container = document.getElementById('ravenFlightContainer');
  var chatMessages = document.getElementById('chatMessages');
  var rect = chatMessages.getBoundingClientRect();

  var startX = rect.left + 60;
  var startY = rect.bottom - 80;
  var endX = rect.left + rect.width * 0.6;
  var endY = rect.top + 40;

  container.style.left = startX + 'px';
  container.style.top = startY + 'px';
  container.classList.add('flying');

  var duration = 900;
  var startTime = performance.now();

  function animate(currentTime) {
    var elapsed = currentTime - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);

    var x = startX + (endX - startX) * eased;
    var arcHeight = -120 * Math.sin(progress * Math.PI);
    var y = startY + (endY - startY) * eased + arcHeight;

    var rotation = -8 * Math.sin(progress * Math.PI * 2);

    container.style.left = x + 'px';
    container.style.top = y + 'px';
    container.style.transform = 'rotate(' + rotation + 'deg)';

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(function() {
        container.classList.remove('flying');
        container.style.transform = '';
        if (callback) callback();
      }, 200);
    }
  }

  requestAnimationFrame(animate);
}

function switchRealm(realmKey) {
  if (realmKey === state.activeRealm) return;

  var oldRealm = state.activeRealm;
  state.activeRealm = realmKey;

  triggerBifrostShimmer();

  var container = document.querySelector('.app-container');
  container.setAttribute('data-active-realm', realmKey);

  updateRealmHeader(realmKey);
  updateRealmStatus(realmKey);
  updateYggdrasilNodes(realmKey);
  updateRealmLabels(realmKey);

  setTimeout(function() {
    renderMessages(realmKey);
  }, 200);

  showToast('Bifröst carries you to ' + REALM_DATA[realmKey].name);
}

function updateRealmHeader(realmKey) {
  var data = REALM_DATA[realmKey];
  document.getElementById('realmRune').textContent = data.rune;
  document.getElementById('realmName').textContent = data.name;
  document.getElementById('realmSubtitle').textContent = data.subtitle;
  document.getElementById('chatRealmIcon').textContent = data.rune;
  document.getElementById('chatRealmTitle').textContent = data.title;
  document.getElementById('chatRealmDesc').textContent = data.description;
}

function updateRealmStatus(realmKey) {
  var data = REALM_DATA[realmKey];
  var statusContainer = document.getElementById('realmStatus');
  var items = statusContainer.querySelectorAll('.status-item');

  items[0].querySelector('.status-value').textContent = data.weather;
  var threatEl = items[1].querySelector('.status-value');
  threatEl.textContent = data.threat;
  threatEl.className = 'status-value' + (data.threatLevel ? ' ' + data.threatLevel : '');
  items[2].querySelector('.status-value').textContent = data.bifrost;
  items[3].querySelector('.status-value').textContent = data.ravens;

  document.getElementById('deityCount').textContent = data.deityCount;
}

function updateYggdrasilNodes(realmKey) {
  var allNodes = document.querySelectorAll('.realm-node');
  allNodes.forEach(function(node) {
    node.classList.remove('active');
    node.classList.remove('asgard', 'midgard', 'helheim', 'jotunheim', 'vanaheim', 'alfheim', 'svartalfheim', 'niflheim', 'muspelheim');
  });

  var activeNode = document.querySelector('.realm-node[data-realm="' + realmKey + '"]');
  if (activeNode) {
    activeNode.classList.add('active', realmKey);
  }
}

function updateRealmLabels(realmKey) {
  var allLabels = document.querySelectorAll('.realm-label');
  allLabels.forEach(function(label) {
    label.classList.remove('active');
  });

  var activeLabel = document.querySelector('.realm-label[data-realm="' + realmKey + '"]');
  if (activeLabel) {
    activeLabel.classList.add('active');
  }
}

function renderMessages(realmKey) {
  var chatContainer = document.getElementById('chatMessages');
  chatContainer.innerHTML = '';

  var systemMsg = document.createElement('div');
  systemMsg.className = 'system-message';
  systemMsg.innerHTML = '<div class="system-ornament left">⦶</div>' +
    '<span class="system-text">The ravens carry word across the realms</span>' +
    '<div class="system-ornament right">⦶</div>';
  chatContainer.appendChild(systemMsg);

  var messages = state.messages[realmKey] || [];
  messages.forEach(function(msg) {
    chatContainer.appendChild(createMessageElement(msg));
  });

  updateMessageCount(realmKey);
  scrollToBottom();
}

function createMessageElement(msg) {
  var div = document.createElement('div');
  div.className = 'message';
  div.setAttribute('data-sender', msg.sender);
  div.setAttribute('data-realm', state.activeRealm);

  var avatarRune = DEITY_AVATARS[msg.sender] || msg.rune || 'ᛟ';

  var reactionsHtml = '';
  if (msg.reactions) {
    Object.keys(msg.reactions).forEach(function(emoji) {
      reactionsHtml += '<button class="message-react" data-reaction="' + emoji + '" title="React">' + emoji + ' ' + msg.reactions[emoji] + '</button>';
    });
  }

  div.innerHTML =
    '<div class="message-avatar-frame">' +
      '<div class="message-avatar" data-deity="' + msg.sender + '">' + avatarRune + '</div>' +
      '<span class="avatar-ring"></span>' +
    '</div>' +
    '<div class="message-body">' +
      '<div class="message-header">' +
        '<span class="message-sender">' + msg.name + '</span>' +
        '<span class="sender-title">' + msg.title + '</span>' +
        '<span class="message-time">' + msg.time + '</span>' +
        '<span class="message-raven-badge ' + msg.raven + '">' + (msg.raven === 'hugin' ? 'Hugin' : 'Munin') + '</span>' +
      '</div>' +
      '<div class="message-frame">' +
        '<div class="knotwork-corner top-left"></div>' +
        '<div class="knotwork-corner top-right"></div>' +
        '<div class="knotwork-corner bottom-left"></div>' +
        '<div class="knotwork-corner bottom-right"></div>' +
        '<div class="message-text" data-original="' + escapeAttr(msg.text) + '">' + (state.runicMode ? transliterateToRunes(msg.text) : msg.text) + '</div>' +
      '</div>' +
      '<div class="message-footer">' +
        reactionsHtml +
        '<button class="message-reply-btn" title="Reply">↩ Reply</button>' +
      '</div>' +
    '</div>';

  if (state.runicMode) {
    var textEl = div.querySelector('.message-text');
    if (textEl) textEl.classList.add('runic-mode');
  }

  return div;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function updateMessageCount(realmKey) {
  var count = (state.messages[realmKey] || []).length;
  document.getElementById('messageCount').textContent = count + ' messages';
}

function sendMessage(text) {
  if (!text || !text.trim()) return;

  var trimmed = text.trim();
  var now = new Date();
  var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  var msg = {
    id: generateId(),
    sender: 'mortal',
    name: 'Wanderer',
    title: 'Speaker of Words',
    rune: 'ᚹ',
    text: trimmed,
    raven: state.selectedRaven,
    time: timeStr,
    reactions: {}
  };

  if (!state.messages[state.activeRealm]) {
    state.messages[state.activeRealm] = [];
  }
  state.messages[state.activeRealm].push(msg);

  triggerRavenFlight(function() {
    var chatContainer = document.getElementById('chatMessages');
    chatContainer.appendChild(createMessageElement(msg));
    updateMessageCount(state.activeRealm);
    scrollToBottom();
  });

  var sendBtn = document.getElementById('sendBtn');
  sendBtn.classList.add('pulse');
  setTimeout(function() {
    sendBtn.classList.remove('pulse');
  }, 600);
}

function scrollToBottom() {
  var chatContainer = document.getElementById('chatMessages');
  setTimeout(function() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 50);
}

function toggleRunicMode() {
  state.runicMode = !state.runicMode;
  var toggle = document.getElementById('runicToggle');

  if (state.runicMode) {
    toggle.classList.add('active');
  } else {
    toggle.classList.remove('active');
  }

  var allTexts = document.querySelectorAll('.message-text');
  allTexts.forEach(function(el) {
    var original = el.getAttribute('data-original');
    if (original) {
      if (state.runicMode) {
        el.textContent = transliterateToRunes(original);
        el.classList.add('runic-mode');
      } else {
        el.textContent = original;
        el.classList.remove('runic-mode');
      }
    }
  });

  updateRunePreview();

  if (state.runicMode) {
    showToast('Runic script activated — Elder Futhark');
  } else {
    showToast('Latin script restored');
  }
}

function updateRunePreview() {
  var input = document.getElementById('messageInput');
  var preview = document.getElementById('runicPreview');

  if (state.runePreviewVisible && input.value.trim()) {
    preview.textContent = transliterateToRunes(input.value);
    preview.classList.add('visible');
  } else {
    preview.classList.remove('visible');
  }
}

function selectRaven(raven) {
  state.selectedRaven = raven;
  var options = document.querySelectorAll('.raven-option');
  options.forEach(function(opt) {
    opt.classList.remove('active');
    if (opt.getAttribute('data-raven') === raven) {
      opt.classList.add('active');
    }
  });
}

function toggleRunePreview() {
  state.runePreviewVisible = !state.runePreviewVisible;
  var btn = document.getElementById('runePreviewBtn');

  if (state.runePreviewVisible) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }

  updateRunePreview();
}

function openSettings() {
  var modal = document.getElementById('settingsModal');
  modal.classList.add('open');
  state.settingsOpen = true;
}

function closeSettings() {
  var modal = document.getElementById('settingsModal');
  modal.classList.remove('open');
  state.settingsOpen = false;
}

function handleReaction(e) {
  var btn = e.target.closest('.message-react');
  if (!btn) return;

  var emoji = btn.getAttribute('data-reaction');
  if (!emoji) return;

  var currentText = btn.textContent.trim();
  var parts = currentText.split(' ');
  var count = parseInt(parts[parts.length - 1], 10) || 0;

  if (btn.classList.contains('reacted')) {
    btn.classList.remove('reacted');
    count = Math.max(0, count - 1);
  } else {
    btn.classList.add('reacted');
    count += 1;
  }

  parts[parts.length - 1] = count.toString();
  btn.textContent = emoji + ' ' + count;
}

function handleReply(e) {
  var btn = e.target.closest('.message-reply-btn');
  if (!btn) return;

  var message = btn.closest('.message');
  var senderEl = message.querySelector('.message-sender');
  if (!senderEl) return;

  var input = document.getElementById('messageInput');
  input.value = '@' + senderEl.textContent + ' ';
  input.focus();
}

function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  var newHeight = Math.min(textarea.scrollHeight, 120);
  textarea.style.height = newHeight + 'px';
}

var typingTimer = null;
var typingVisible = false;

function startTypingCycle() {
  var typingIndicator = document.getElementById('typingIndicator');
  var typingText = typingIndicator.querySelector('.typing-text');

  var typers = [
    'Bragi is composing verse',
    'Óðinn is consulting Mímir',
    'Loki is whispering...',
    'Freyja is choosing her words',
    'Heimdallr is listening',
    'Þórr is gripping his hammer',
    'Týr is sharpening his blade'
  ];

  function cycleTyping() {
    if (typingVisible) {
      typingIndicator.classList.remove('visible');
      typingVisible = false;
      typingTimer = setTimeout(cycleTyping, 8000 + Math.random() * 12000);
    } else {
      var randomTyper = typers[Math.floor(Math.random() * typers.length)];
      typingText.textContent = randomTyper;
      typingIndicator.classList.add('visible');
      typingVisible = true;
      typingTimer = setTimeout(cycleTyping, 3000 + Math.random() * 4000);
    }
  }

  typingTimer = setTimeout(cycleTyping, 5000 + Math.random() * 8000);
}

function initYggdrasilInteractions() {
  var nodes = document.querySelectorAll('.realm-node');
  nodes.forEach(function(node) {
    node.addEventListener('click', function() {
      var realm = node.getAttribute('data-realm');
      if (realm) switchRealm(realm);
    });

    node.addEventListener('mouseenter', function() {
      node.style.filter = 'brightness(1.3)';
    });
    node.addEventListener('mouseleave', function() {
      if (node.getAttribute('data-realm') !== state.activeRealm) {
        node.style.filter = '';
      }
    });
  });

  var labels = document.querySelectorAll('.realm-label');
  labels.forEach(function(label) {
    label.addEventListener('click', function() {
      var realm = label.getAttribute('data-realm');
      if (realm) switchRealm(realm);
    });
  });
}

function initInputArea() {
  var input = document.getElementById('messageInput');
  var sendBtn = document.getElementById('sendBtn');

  input.addEventListener('input', function() {
    autoResizeTextarea(input);
    updateRunePreview();
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      var text = input.value;
      input.value = '';
      input.style.height = 'auto';
      updateRunePreview();
      sendMessage(text);
    }
  });

  sendBtn.addEventListener('click', function() {
    var text = input.value;
    input.value = '';
    input.style.height = 'auto';
    updateRunePreview();
    sendMessage(text);
  });

  var ravenOptions = document.querySelectorAll('.raven-option');
  ravenOptions.forEach(function(opt) {
    opt.addEventListener('click', function() {
      selectRaven(opt.getAttribute('data-raven'));
    });
  });

  document.getElementById('runePreviewBtn').addEventListener('click', toggleRunePreview);
  document.getElementById('attachBtn').addEventListener('click', function() {
    showToast('Scroll attachment not yet bound to this realm');
  });
}

function initHeaderControls() {
  document.getElementById('runicToggle').addEventListener('click', toggleRunicMode);

  document.getElementById('soundToggle').addEventListener('click', function() {
    state.soundEnabled = !state.soundEnabled;
    var icon = this.querySelector('.sound-icon');
    if (state.soundEnabled) {
      icon.textContent = 'Ⱄ';
      showToast('Sound enabled');
    } else {
      icon.textContent = '🔇';
      showToast('Sound silenced');
    }
  });

  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('settingsClose').addEventListener('click', closeSettings);
  document.getElementById('settingsOverlay').addEventListener('click', closeSettings);
}

function initChatInteractions() {
  document.getElementById('chatMessages').addEventListener('click', function(e) {
    handleReaction(e);
    handleReply(e);
  });
}

function initDeityListInteractions() {
  var deityItems = document.querySelectorAll('.deity-item');
  deityItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var deity = item.getAttribute('data-deity');
      var name = item.querySelector('.deity-name').textContent;
      var input = document.getElementById('messageInput');
      input.value = '@' + name + ' ';
      input.focus();
    });
  });
}

function initKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && state.settingsOpen) {
      closeSettings();
    }

    if (e.key === 'r' && e.ctrlKey) {
      e.preventDefault();
      toggleRunicMode();
    }

    if (e.key === '/' && !e.target.closest('.message-input') && !e.target.closest('input') && !e.target.closest('textarea')) {
      e.preventDefault();
      var input = document.getElementById('messageInput');
      input.focus();
    }
  });
}

function addAmbientRealmEffects() {
  setInterval(function() {
    var nodes = document.querySelectorAll('.realm-node:not(.active)');
    var randomIndex = Math.floor(Math.random() * nodes.length);
    var node = nodes[randomIndex];
    if (node) {
      var realm = node.getAttribute('data-realm');
      node.classList.add('has-notification', realm);
      setTimeout(function() {
        node.classList.remove('has-notification');
      }, 3000);
    }
  }, 10000);
}

function init() {
  initYggdrasilInteractions();
  initInputArea();
  initHeaderControls();
  initChatInteractions();
  initDeityListInteractions();
  initKeyboardShortcuts();
  startTypingCycle();
  addAmbientRealmEffects();

  updateYggdrasilNodes('asgard');
  updateRealmLabels('asgard');
  renderMessages('asgard');

  setTimeout(function() {
    showToast('Hugin & Munin are ready to carry your words');
  }, 500);
}

document.addEventListener('DOMContentLoaded', init);