/* VALHALLA MESSENGERS - Mythological Messaging Interface JavaScript */

const realms = {
    asgard: {
        name: 'Asgard',
        rune: 'ᚨ',
        description: 'The sacred realm of the Aesir gods',
        color: 'gold',
        online: 12
    },
    midgard: {
        name: 'Midgard',
        rune: 'ᛗ',
        description: 'The realm of mortal humans',
        color: 'green',
        online: 47
    },
    jotunheim: {
        name: 'Jotunheim',
        rune: 'ᛃ',
        description: 'The realm of frost giants',
        color: 'red',
        online: 5
    },
    vanaheim: {
        name: 'Vanaheim',
        rune: 'ᚠ',
        description: 'The realm of the Vanir gods',
        color: 'green',
        online: 8
    },
    alfheim: {
        name: 'Alfheim',
        rune: 'ᛚ',
        description: 'The realm of light elves',
        color: 'silver',
        online: 3
    },
    helheim: {
        name: 'Helheim',
        rune: 'ᚺ',
        description: 'The realm of the dead',
        color: 'blue',
        online: 23
    },
    niflheim: {
        name: 'Niflheim',
        rune: 'ᚾ',
        description: 'The realm of ice mist',
        color: 'silver',
        online: 1
    }
};

const characters = [
    { name: 'Odin', realm: 'asgard', rune: 'ᛟ' },
    { name: 'Thor', realm: 'asgard', rune: 'ᛋ' },
    { name: 'Loki', realm: 'asgard', rune: 'ᛚ' },
    { name: 'Frigg', realm: 'asgard', rune: 'ᚠ' },
    { name: 'Balder', realm: 'asgard', rune: 'ᛒ' },
    { name: 'Heimdall', realm: 'asgard', rune: 'ᚺ' },
    { name: 'Tyr', realm: 'asgard', rune: 'ᛏ' },
    { name: 'Freya', realm: 'vanaheim', rune: 'ᚠ' },
    { name: 'Freyr', realm: 'vanaheim', rune: 'ᚱ' },
    { name: 'Njord', realm: 'vanaheim', rune: 'ᚾ' },
    { name: 'Hel', realm: 'helheim', rune: 'ᚺ' },
    { name: 'MODER', realm: 'midgard', rune: 'ᛗ' },
    { name: 'HYGD', realm: 'midgard', rune: 'ᚻ' },
    { name: 'Thrym', realm: 'jotunheim', rune: 'ᛋ' },
    { name: 'Skadi', realm: 'jotunheim', rune: 'ᛋ' },
    { name: 'Frost Giant', realm: 'jotunheim', rune: 'ᛃ' },
    { name: 'Light Elf', realm: 'alfheim', rune: 'ᛚ' },
    { name: 'Draugr', realm: 'helheim', rune: 'ᛞ' },
    { name: 'Norn', realm: 'niflheim', rune: 'ᚾ' }
];

const sampleMessages = {
    asgard: [
        { sender: 'Odin', text: 'Hugin and Munin have returned with news from all nine realms. The walls of Asgard stand strong!', time: '10:42' },
        { sender: 'Thor', text: 'Father, the giants grow restless in Jotunheim. Should I bring Mjolnir to bear?', time: '10:45' },
        { sender: 'Loki', text: 'Careful, thunder god. Last time you brought Mjolnir to bear, we had to rebuild half of Asgard.', time: '10:47' },
        { sender: 'Frigg', text: 'Allfather, perhaps we should discuss the prophecy regarding Baldr before acting.', time: '10:50' },
        { sender: 'Heimdall', text: 'I see all, hear all. The Bifrost remains guarded. No unwanted visitors approach.', time: '10:52' }
    ],
    midgard: [
        { sender: 'MODER', text: 'The harvest is plentiful this season. May the gods bless our crops!', time: '09:15' },
        { sender: 'HYGD', text: 'The Allfather watches over us. Let us offer prayers at the sacred grove.', time: '09:20' },
        { sender: 'MODER', text: 'A merchant from the east arrived with tales of strange omens in the sky.', time: '10:30' }
    ],
    jotunheim: [
        { sender: 'Thrym', text: 'Thor thinks he can steal our treasures! Let him try - we shall see who is mightier!', time: '08:00' },
        { sender: 'Skadi', text: 'The hunt in the mountains has been excellent. The wolves are fat this season.', time: '08:30' }
    ],
    vanaheim: [
        { sender: 'Freya', text: 'The seidr magic flows strong in Vanaheim. The Vanir and Aesir shall remain allies.', time: '11:00' },
        { sender: 'Freyr', text: 'The fields of Alfheim shimmer with golden light. Peace reigns eternal.', time: '11:15' }
    ],
    alfheim: [
        { sender: 'Light Elf', text: 'Welcome to the realm of eternal twilight and silver light. The Ljósálfar greet you.', time: '12:00' }
    ],
    helheim: [
        { sender: 'Hel', text: 'All mortal souls eventually find their way here. The cycle continues...', time: '03:33' },
        { sender: 'Draugr', text: 'The mists grow colder. More shades arrive from the mortal realm.', time: '03:45' }
    ],
    niflheim: [
        { sender: 'Norn', text: 'The threads of destiny are woven in ice and mist. The future remains shrouded.', time: '02:00' }
    ]
};

const state = {
    currentRealm: 'asgard',
    runicMode: false,
    ravenAnimations: true,
    ambiance: true,
    messages: JSON.parse(JSON.stringify(sampleMessages))
};

const elements = {
    chatMessages: document.getElementById('chatMessages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    realmName: document.getElementById('realmName'),
    realmDesc: document.getElementById('realmDesc'),
    currentRune: document.getElementById('currentRune'),
    onlineCount: document.getElementById('onlineCount'),
    bifrostOverlay: document.getElementById('bifrostOverlay'),
    ravenDelivery: document.getElementById('ravenDelivery'),
    particles: document.getElementById('particles'),
    runicToggle: document.getElementById('runicToggle'),
    ravenToggle: document.getElementById('ravenToggle'),
    ambianceToggle: document.getElementById('ambianceToggle'),
    appContainer: document.querySelector('.app-container')
};

const runicMap = {
    'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚳ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ',
    'g': 'ᚷ', 'h': 'ᚻ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚴ', 'l': 'ᛚ',
    'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᛩ', 'r': 'ᚱ',
    's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚡ', 'w': 'ʋ', 'x': 'ᛉ',
    'y': 'ᚿ', 'z': 'ᛋ', 'th': 'ᚦ', ' ': ' '
};

function init() {
    loadMessages();
    setupEventListeners();
    initParticles();
}

function setupEventListeners() {
    document.querySelectorAll('.realm-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchRealm(btn.dataset.realm);
        });
    });

    elements.sendBtn.addEventListener('click', sendMessage);
    
    elements.messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    elements.runicToggle.addEventListener('change', function(e) {
        state.runicMode = e.target.checked;
        updateAllMessages();
    });

    elements.ravenToggle.addEventListener('change', function(e) {
        state.ravenAnimations = e.target.checked;
    });

    elements.ambianceToggle.addEventListener('change', function(e) {
        state.ambiance = e.target.checked;
        toggleAmbiance(e.target.checked);
    });

    document.querySelector('.rune-keyboard-btn').addEventListener('click', function() {
        state.runicMode = !state.runicMode;
        elements.runicToggle.checked = state.runicMode;
        updateAllMessages();
    });
}

function switchRealm(realm) {
    if (realm === state.currentRealm) return;

    document.querySelectorAll('.realm-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.realm === realm);
    });

    if (state.ambiance) {
        elements.bifrostOverlay.classList.add('active');
        setTimeout(function() {
            elements.bifrostOverlay.classList.remove('active');
        }, 1500);
    }

    state.currentRealm = realm;
    const realmData = realms[realm];
    
    elements.currentRune.textContent = realmData.rune;
    elements.realmName.textContent = realmData.name;
    elements.realmDesc.textContent = realmData.description;
    elements.onlineCount.textContent = realmData.online;
    elements.appContainer.setAttribute('data-realm', realm);

    if (state.ambiance) {
        updateParticles(realmData.color);
    }

    loadMessages();
}

function loadMessages() {
    const container = elements.chatMessages.querySelector('.messages-container');
    container.innerHTML = '';
    const messages = state.messages[state.currentRealm] || [];
    messages.forEach(function(msg) {
        appendMessage(msg.sender, msg.text, msg.time);
    });
    scrollToBottom();
}

function appendMessage(sender, text, time) {
    const container = elements.chatMessages.querySelector('.messages-container');
    const character = characters.find(function(c) { return c.name === sender; });
    const realmClass = character ? character.realm : state.currentRealm;
    const runeChar = character ? character.rune : 'ᚨ';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = 
        '<div class="message-avatar ' + realmClass + '">' + runeChar + '</div>' +
        '<div class="message-bubble">' +
            '<div class="message-header">' +
                '<span class="message-sender">' + sender + '</span>' +
                '<span class="message-time">' + time + '</span>' +
            '</div>' +
            '<div class="message-content ' + (state.runicMode ? 'runic' : '') + '">' +
                (state.runicMode ? toRunic(text) : text) +
            '</div>' +
        '</div>';
    
    container.appendChild(messageDiv);
    scrollToBottom();
}

function sendMessage() {
    const text = elements.messageInput.value.trim();
    if (!text) return;

    const realmCharacters = characters.filter(function(c) { return c.realm === state.currentRealm; });
    const character = realmCharacters[Math.floor(Math.random() * realmCharacters.length)] || characters[0];
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    state.messages[state.currentRealm].push({
        sender: character.name,
        text: text,
        time: time
    });

    if (state.ravenAnimations) {
        showRavenDelivery();
    }

    appendMessage(character.name, text, time);
    elements.messageInput.value = '';
}

function showRavenDelivery() {
    const raven = document.createElement('div');
    raven.className = 'raven-flying';
    raven.textContent = '🦅';
    raven.style.animationDuration = '1.5s';
    elements.ravenDelivery.appendChild(raven);
    setTimeout(function() {
        raven.remove();
    }, 1500);
}

function toRunic(text) {
    let runicText = '';
    const lowerText = text.toLowerCase();
    for (let i = 0; i < lowerText.length; i++) {
        const char = lowerText[i];
        const nextChar = lowerText[i + 1];
        const digraph = char + nextChar;
        if (runicMap[digraph]) {
            runicText += runicMap[digraph];
            i++;
        } else if (runicMap[char]) {
            runicText += runicMap[char];
        } else {
            runicText += char;
        }
    }
    return runicText;
}

function updateAllMessages() {
    const container = elements.chatMessages.querySelector('.messages-container');
    const messageElements = container.querySelectorAll('.message');
    const messages = state.messages[state.currentRealm];
    
    messageElements.forEach(function(msgEl, index) {
        const contentEl = msgEl.querySelector('.message-content');
        const originalText = messages[index].text;
        if (state.runicMode) {
            contentEl.textContent = toRunic(originalText);
            contentEl.classList.add('runic');
        } else {
            contentEl.textContent = originalText;
            contentEl.classList.remove('runic');
        }
    });
}

function initParticles() {
    updateParticles('gold');
}

function updateParticles(color) {
    elements.particles.innerHTML = '';
    if (!state.ambiance) return;
    
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        createParticle(color);
    }
}

function createParticle(color) {
    const particle = document.createElement('div');
    particle.className = 'particle ' + color;
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = (Math.random() * 100) + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 5) + 's';
    elements.particles.appendChild(particle);
}

function toggleAmbiance(enabled) {
    if (enabled) {
        elements.particles.style.display = 'block';
        updateParticles(realms[state.currentRealm].color);
    } else {
        elements.particles.style.display = 'none';
    }
}

function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'r' && !e.ctrlKey && !e.metaKey && document.activeElement !== elements.messageInput) {
        state.runicMode = !state.runicMode;
        elements.runicToggle.checked = state.runicMode;
        updateAllMessages();
    }
});

document.addEventListener('DOMContentLoaded', init);