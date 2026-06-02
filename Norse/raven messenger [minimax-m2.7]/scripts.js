/* ========================================
   VALHALLA CHAT - NORSE MYTHOLOGICAL MESSAGING INTERFACE
   Interactive JavaScript
======================================== */

// ========================================
/* REALM DATA */
const realmData = {
  asgard: {
    name: "Asgard",
    description: "The realm of the Aesir, home of the gods",
    icon: "⚔️",
    onlineCount: 12,
    color: "#ffd700",
    messages: [
      { sender: "Odin Allfather", rune: "ᛟ", message: "My two ravens, Huginn and Muninn, have returned with news from all nine realms.", time: "06:42" },
      { sender: "Frigg", rune: "ᚠ", message: "My husband, the Allfather speaks true. The well of Urdar bubbles with prophecy.", time: "06:45" },
      { sender: "Heimdall", rune: "ᚺ", message: "I stand vigilant at Bifrost. The rainbow bridge holds strong.", time: "06:48" }
    ]
  },
  midgard: {
    name: "Midgard",
    description: "The realm of mortals, surrounded by the ocean serpent Jormungandr",
    icon: "🏠",
    onlineCount: 24,
    color: "#228b22",
    messages: [
      { sender: "Village Elder", rune: "ᚨ", message: "The harvest moon rises. Let us offer thanks to the gods for their blessings.", time: "06:30" },
      { sender: "Shield Maiden", rune: "ᛋ", message: "Training continues at dawn. All who wish to defend the village are welcome.", time: "06:35" },
      { sender: "Skald", rune: "ᛊ", message: "I compose new verses in honor of Thor's recent victory over the frost giants!", time: "06:40" }
    ]
  },
  jotunheim: {
    name: "Jotunheim",
    description: "The realm of the giants, land of ancient stone and chaos",
    icon: "🗻",
    onlineCount: 5,
    color: "#8b0000",
    messages: [
      { sender: "Thrym", rune: "ᚦ", message: "My hammer Mjolnir was stolen! I demand Freya as my bride to return it.", time: "06:20" },
      { sender: "Skadi", rune: "ᛊ", message: "The winter hunt was bountiful. The wolves run strong in these mountains.", time: "06:25" },
      { sender: "Utgard-Loki", rune: "ᛟ", message: "Ah, mortals think themselves clever... Let us see what challenges await.", time: "06:28" }
    ]
  },
  vanaheim: {
    name: "Vanaheim",
    description: "The realm of the Vanir, gods of fertility and wisdom",
    icon: "🌿",
    onlineCount: 8,
    color: "#008080",
    messages: [
      { sender: "Freya", rune: "ᚠ", message: "I teach the ways of seidr to those who seek wisdom beyond the mortal ken.", time: "06:50" },
      { sender: "Freyr", rune: "ᚱ", message: "The fields of Vanaheim bloom eternal. Prosperity flows to all realms.", time: "06:52" },
      { sender: "Njord", rune: "ᚾ", message: "The seas are calm. My children rule both sea and sky with grace.", time: "06:55" }
    ]
  },
  alfheim: {
    name: "Alfheim",
    description: "The realm of light elves, where eternal twilight reigns",
    icon: "✨",
    onlineCount: 15,
    color: "#c0c0c0",
    messages: [
      { sender: "Lord of Light Elves", rune: "ᛚ", message: "Welcome to our realm of eternal twilight. May your spirit find illumination.", time: "07:00" },
      { sender: "Elven Sage", rune: "ᛖ", message: "The ancient songs of creation still echo through our crystal halls.", time: "07:05" },
      { sender: "Light Dancer", rune: "ᛞ", message: "Join us in the dance of light and shadow. It is eternal and beautiful.", time: "07:08" }
    ]
  },
  helheim: {
    name: "Helheim",
    description: "The realm of the dead, ruled by the goddess Hel",
    icon: "💀",
    onlineCount: 3,
    color: "#4a0080",
    messages: [
      { sender: "Hel", rune: "ᚺ", message: "All who do not die gloriously in battle shall find their way to my hall.", time: "05:30" },
      { sender: "Garmr", rune: "ᚷ", message: "*howls in the distance* The hound guards the gnarly gate unceasingly.", time: "05:35" },
      { sender: "Death Messenger", rune: "ᛞ", message: "New souls arrive daily. Hel's domain grows ever larger.", time: "05:40" }
    ]
  },
  niflheim: {
    name: "Niflheim",
    description: "The primordial realm of ice, mist, and fog",
    icon: "❄️",
    onlineCount: 2,
    color: "#87ceeb",
    messages: [
      { sender: "Niflheim Guardian", rune: "ᚾ", message: "Here, before time, the ice began. The mist never lifts from these frozen halls.", time: "04:00" },
      { sender: "Mist Wraith", rune: "ᛗ", message: "We are the echoes of the first cold... eternal and unending.", time: "04:05" }
    ]
  }
};

// ========================================
/* RUNIC TRANSLITERATION */
const latinToRunicMap = {
  'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛉ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ',
  'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ',
  'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ',
  'v': 'ᚢ', 'w': 'ᚹ', 'x': 'ᚲ', 'y': 'ᚦ', 'z': 'ᛉ',
  ' ': ' ', '.': '᛭', ',': '᛭', '!': '᛭', '?': '᛭'
};

const runicToLatinMap = {
  'ᚨ': 'a', 'ᛒ': 'b', 'ᚲ': 'c', 'ᛉ': 'd', 'ᛖ': 'e', 'ᚠ': 'f', 'ᚷ': 'g',
  'ᚺ': 'h', 'ᛁ': 'i', 'ᛃ': 'j', 'ᛚ': 'l', 'ᛗ': 'm', 'ᚾ': 'n',
  'ᛟ': 'o', 'ᛈ': 'p', 'ᚱ': 'r', 'ᛊ': 's', 'ᛏ': 't', 'ᚢ': 'u',
  'ᚹ': 'w', 'ᛉ': 'z', '᛭': ' '
};

const runicDigraphs = ['ᚦ', 'ᛝ', 'ᚫ'];

function transliterateToRunes(text) {
  let result = '';
  let i = 0;
  while (i < text.length) {
    const char = text[i].toLowerCase();
    result += latinToRunicMap[char] || char;
    i++;
  }
  return result;
}

function transliterateToLatin(text) {
  let result = '';
  let i = 0;
  while (i < text.length) {
    let char = text[i];
    result += runicToLatinMap[char] || char;
    i++;
  }
  return result;
}

// ========================================
/* STATE MANAGEMENT */
let currentRealm = 'asgard';
let runicMode = false;
let messages = {};

// Initialize messages for each realm
Object.keys(realmData).forEach(function(realm) {
  messages[realm] = [];
  realmData[realm].messages.forEach(function(msg) {
    messages[realm].push({
      sender: msg.sender,
      rune: msg.rune,
      message: msg.message,
      time: msg.time
    });
  });
});

// ========================================
/* DOM ELEMENTS */
var realmNameEl = document.getElementById('realmName');
var realmDescEl = document.getElementById('realmDesc');
var onlineCountEl = document.getElementById('onlineCount');
var messagesScrollEl = document.getElementById('messagesScroll');
var messageInputEl = document.getElementById('messageInput');
var sendBtnEl = document.getElementById('sendBtn');
var runicToggleEl = document.getElementById('runicToggle');
var channelBtns = document.querySelectorAll('.channel-btn');
var bifrostOverlayEl = document.getElementById('bifrostOverlay');
var ravenFlightEl = document.getElementById('ravenFlight');
var realmDots = document.querySelectorAll('.realm-dot');

// ========================================
/* RENDER FUNCTIONS */
function renderMessages() {
  var realmMessages = messages[currentRealm];
  messagesScrollEl.innerHTML = '';
  
  realmMessages.forEach(function(msg, index) {
    setTimeout(function() {
      var messageEl = createMessageElement(msg, index);
      messagesScrollEl.appendChild(messageEl);
      scrollToBottom();
    }, index * 100);
  });
}

function createMessageElement(msg, index) {
  var isOwn = (msg.sender === 'Thor Thunderous');
  var div = document.createElement('div');
  div.className = 'message ' + (isOwn ? 'own' : 'other');
  div.style.animationDelay = (index * 0.1) + 's';
  
  var displayMessage = msg.message;
  if (runicMode) {
    displayMessage = transliterateToRunes(msg.message);
  }
  
  var html = '<div class="message-sender-avatar" style="--rune-color: ' + getRuneColor(msg.sender) + '">' + msg.rune + '</div>' +
    '<div class="message-bubble">' +
      '<div class="message-header">' +
        '<span class="message-sender">' + msg.sender + '</span>' +
        '<span class="message-time">' + msg.time + '</span>' +
      '</div>' +
      '<div class="message-text">' + displayMessage + '</div>' +
    '</div>';
  
  div.innerHTML = html;
  return div;
}

function getRuneColor(sender) {
  var colors = ['#ffd700', '#87ceeb', '#ff6b35', '#4ecdc4', '#98d8c8', '#9370db', '#ff69b4'];
  var hash = 0;
  for (var i = 0; i < sender.length; i++) {
    hash = sender.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function scrollToBottom() {
  messagesScrollEl.scrollTop = messagesScrollEl.scrollHeight;
}

// ========================================
/* REALM SWITCHING */
function switchRealm(realm) {
  if (realm === currentRealm) return;
  
  triggerBifrostEffect();
  
  currentRealm = realm;
  
  realmNameEl.textContent = realmData[realm].name;
  realmDescEl.textContent = realmData[realm].description;
  onlineCountEl.textContent = realmData[realm].onlineCount;
  
  channelBtns.forEach(function(btn) {
    btn.classList.remove('active');
    if (btn.dataset.realm === realm) {
      btn.classList.add('active');
    }
  });
  
  document.documentElement.style.setProperty('--realm-color', realmData[realm].color);
  
  setTimeout(function() {
    renderMessages();
  }, 500);
}

function triggerBifrostEffect() {
  bifrostOverlayEl.classList.add('active');
  setTimeout(function() {
    bifrostOverlayEl.classList.remove('active');
  }, 1500);
}

// ========================================
/* RAVEN FLIGHT ANIMATION */
function triggerRavenFlight() {
  ravenFlightEl.classList.add('active');
  setTimeout(function() {
    ravenFlightEl.classList.remove('active');
  }, 2000);
}

// ========================================
/* MESSAGE SENDING */
function sendMessage() {
  var text = messageInputEl.value.trim();
  if (!text) return;
  
  var processedText = text;
  if (runicMode) {
    processedText = transliterateToLatin(text);
  }
  
  var newMessage = {
    sender: 'Thor Thunderous',
    rune: 'ᚦ',
    message: processedText,
    time: getCurrentTime()
  };
  
  triggerRavenFlight();
  
  messages[currentRealm].push(newMessage);
  
  messageInputEl.value = '';
  messageInputEl.style.height = 'auto';
  
  var messageEl = createMessageElement(newMessage, 0);
  messageEl.classList.add('slide-up');
  messagesScrollEl.appendChild(messageEl);
  
  setTimeout(function() {
    scrollToBottom();
  }, 100);
}

function getCurrentTime() {
  var now = new Date();
  var hours = String(now.getHours()).padStart(2, '0');
  var minutes = String(now.getMinutes()).padStart(2, '0');
  return hours + ':' + minutes;
}

// ========================================
/* INPUT HANDLING */
function autoResizeTextarea() {
  messageInputEl.style.height = 'auto';
  var maxHeight = 120;
  if (messageInputEl.scrollHeight < maxHeight) {
    messageInputEl.style.height = messageInputEl.scrollHeight + 'px';
  } else {
    messageInputEl.style.height = maxHeight + 'px';
  }
}

// ========================================
/* EVENT LISTENERS */
channelBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    switchRealm(btn.dataset.realm);
  });
});

realmDots.forEach(function(dot) {
  dot.addEventListener('click', function() {
    var realm = dot.dataset.realm;
    if (realm) {
      switchRealm(realm);
    }
  });
});

sendBtnEl.addEventListener('click', sendMessage);

messageInputEl.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

messageInputEl.addEventListener('input', autoResizeTextarea);

runicToggleEl.addEventListener('change', function() {
  runicMode = runicToggleEl.checked;
  renderMessages();
});

// ========================================
/* SIMULATED ONLINE ACTIVITY */
var activities = [
  "Composing poetry...",
  "Training with Mjolnir",
  "At the Well of Urdar",
  "Watching over Asgard",
  "Brewing mead for the einherjar",
  "Consulting the Norns",
  "Polishing armor",
  "Practicing seidr"
];

function simulateActivity() {
  var deities = document.querySelectorAll('.deity-item');
  deities.forEach(function(deity) {
    var activityEl = deity.querySelector('.deity-activity');
    if (activityEl && Math.random() > 0.7) {
      var randomActivity = activities[Math.floor(Math.random() * activities.length)];
      activityEl.style.opacity = '0';
      setTimeout(function() {
        activityEl.textContent = randomActivity;
        activityEl.style.opacity = '1';
      }, 300);
    }
  });
}

setInterval(simulateActivity, 10000);

// ========================================
/* RANDOM INCOMING MESSAGES */
var incomingMessages = [
  { sender: "Loki", rune: "ᛚ", message: "I have a wonderful idea that will surely not cause any problems." },
  { sender: "Baldur", rune: "ᛒ", message: "I dream of the light that shines through all the nine realms." },
  { sender: "Vidar", rune: "ᚢ", message: "My shoe is ready. The wolf shall fall by my hand in Ragnarok." },
  { sender: "Vali", rune: "ᚢ", message: "I was born for vengeance, yet I seek peace." },
  { sender: "Bragi", rune: "ᛒ", message: "Let me compose a verse in your honor, noble warrior." }
];

function simulateIncomingMessage() {
  if (Math.random() > 0.85) {
    var msgIndex = Math.floor(Math.random() * incomingMessages.length);
    var msg = incomingMessages[msgIndex];
    var newMessage = {
      sender: msg.sender,
      rune: msg.rune,
      message: msg.message,
      time: getCurrentTime()
    };
    messages[currentRealm].push(newMessage);
    var messageEl = createMessageElement(newMessage, 0);
    messagesScrollEl.appendChild(messageEl);
    scrollToBottom();
  }
}

setInterval(simulateIncomingMessage, 15000);

// ========================================
/* INITIALIZATION */
function init() {
  realmNameEl.textContent = realmData[currentRealm].name;
  realmDescEl.textContent = realmData[currentRealm].description;
  onlineCountEl.textContent = realmData[currentRealm].onlineCount;
  document.documentElement.style.setProperty('--realm-color', realmData[currentRealm].color);
  
  renderMessages();
  
  setTimeout(function() {
    messageInputEl.focus();
  }, 500);
}

// ========================================
/* KONAMI CODE EASTER EGG */
var konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
var konamiIndex = 0;

document.addEventListener('keydown', function(e) {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      var specialMessage = {
        sender: "Odin Allfather",
        rune: "ᛟ",
        message: "You have proven yourself worthy! May Odin's blessing be upon you!",
        time: getCurrentTime()
      };
      messages[currentRealm].push(specialMessage);
      var messageEl = createMessageElement(specialMessage, 0);
      messagesScrollEl.appendChild(messageEl);
      scrollToBottom();
      triggerBifrostEffect();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

// ========================================
/* START THE APP */
init();