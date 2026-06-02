// Runes to Latin transliteration map (Younger Futhark)
const runicMap = {
    'ᚠ': 'F', 'ᚢ': 'U', 'ᚦ': 'TH', 'ᚨ': 'A', 'ᚱ': 'R',
    'ᚲ': 'K', 'ᚷ': 'G', 'ᚹ': 'W', 'ᚺ': 'H', 'ᚾ': 'N',
    'ᛁ': 'I', 'ᛃ': 'J', 'ᛇ': 'Æ', 'ᛈ': 'P', 'ᛉ': 'Z',
    'ᛊ': 'S', 'ᛏ': 'T', 'ᛒ': 'B', 'ᛖ': 'E', 'ᛗ': 'M',
    'ᛚ': 'L', 'ᛜ': 'NG', 'ᛞ': 'D', 'ᛟ': 'O',
    'ᚲᛖ': 'GE', 'ᛗᛁ': 'MI', 'ᚹᛖ': 'WE',
    'ᛋ': 'S', 'ᚦ': 'TH', 'ᛁᚾ': 'IN',
    'ᚹᛁᛚᛚ': 'WILL', 'ᚠᚱᛟᛘ': 'FROM',
    'ᚹᛖᛚᚲᛟᛗᛖ': 'MESSAGE', 'ᚨᛋᚴᛟᚱᛞ': 'ASGARD',
    'ᛗᛁᛞᛖᛗᛖᚱᛞ': 'MIDGARD', 'ᚺᛖᛚᚺᛖᛁᛘ': 'HELHEIM',
    'ᛃᛟᚢᚦᚢᚾᚺᛖᛁᛘ': 'JOTUNHEIM',
    'ᛗᚢᛋᛈᛖᛚᚺᛖᛁᛘ': 'MUSPELHEIM',
    'ᚢᛚᚠᛏᛖᛚᚺᛖᛁᛘ': 'ALVHEIM',
    'ᚾᛁᚠᛚᚺᛖᛁᛘ': 'NIFLHEIM',
    'ᛋᚹᚨᚱᛏᚨᛚᚠᚺᛖᛁᛘ': 'SVARTALFHEIM',
    'ᛃᛁᛋᛋᚢᛚ᛫ᛏᚱᛖᛖ': 'YGGDRASIL',
    'ᚦᚢᚱᚾ ᚠᚢᛏ᛫ᚾᛟᚱᛋᛖ ᚑᚾ': 'TURN RUNES ON',
    'ᚷᛖᛏ': 'GET', 'ᚼᚢᚷᛁᚾᚾ': 'HUGINN',
    'ᛚᛟᚲᛁ': 'LOKI', 'ᚦᚢᚱ': 'THOR',
    'ᚠᚱᛖᚨ': 'FREYA', 'ᚼᛖᛁᛗᛞᛖᛚᛚ': 'HEIMDALL',
    'ᛟᛞᛁᚴ': 'ODIN', 'ᛟᛞᛁᚴ ᚠᚢᚦᚱ': 'ODIN FATHER',
    'ᛟᛞᛁᚴ ᚠᚢᚦᚱ': 'ODIN FATHER',
    'ᛞᚢᚱᛁᚾᛟᛚᛞ': 'THOUGHT', 'ᛗᛖᛗᛟᚱᛁ': 'MEMORY',
    'ᚦᚢᚱᚾ ᚠᚢᛏ᛫ᚾᛟᚱᛋᛖ ᚑᚣ': 'TURN RUNES OFF',
    'ᚱᚢᚾᚲ ᚠᚢᛏ᛫ᚾᛟᚱᛋᛖ': 'RUNIC FUTURE',
};

// Realm data
const realmData = {
    asgard: {
        name: 'Asgard',
        subtitle: 'ᚨᛋᚴᛟᚱᛞ ᚱᛖᚨᛚᛗ — Realm of the Aesir',
        rune: 'ᚨᛋᚴᛟᚱᛞ',
        messageCount: 7,
        members: ['Odin', 'Thor', 'Loki', 'Freya', 'Heimdall', 'Huginn', 'Muninn']
    },
    midgard: {
        name: 'Midgard',
        subtitle: 'ᛗᛁᛞᛖᛗᛖᚱᛞ ᚹᛖᛚᛚ — The Mortal World',
        rune: 'ᛗᛁᛞᛖᛗᛖᚱᛞ',
        messageCount: 3,
        members: ['Thor', 'Valkyrie', 'Human Chieftain']
    },
    helheim: {
        name: 'Helheim',
        subtitle: 'ᚺᛖᛚᚺᛖᛁᛘ ᚹᛖᛚᛚ — Realm of the Dead',
        rune: 'ᚺᛖᛚᚺᛖᛁᛘ',
        messageCount: 2,
        members: ['Hel', 'NiflHel Serpent']
    },
    vanaheim: {
        name: 'Vanaheim',
        subtitle: 'ᚹᚨᚾᚨᚼᛖᛁᛘ — Realm of the Vanir',
        rune: 'ᚹᚨᚾᚨᚼᛖᛁᛘ',
        messageCount: 4,
        members: ['Freyja', 'Freyr', 'Njord']
    },
    jotunheim: {
        name: 'Jotunheim',
        subtitle: 'ᛃᛟᚢᚦᚢᚾᚺᛖᛁᛘ — Realm of Giants',
        rune: 'ᛃᛟᚢᚦᚢᚾᚺᛖᛁᛘ',
        messageCount: 1,
        members: ['Loki (as reindeer)']
    },
    muspelheim: {
        name: 'Muspelheim',
        subtitle: 'ᛗᚢᛋᛈᛖᛚᚺᛖᛁᛘ — Realm of Fire',
        rune: 'ᛗᚢᛋᛈᛖᛚᚺᛖᛁᛘ',
        messageCount: 0,
        members: ['Surtr']
    },
    alvheim: {
        name: 'Alvheim',
        subtitle: 'ᚢᛚᚠᛏᛖᛚᚺᛖᛁᛘ — Realm of Light Elves',
        rune: 'ᚢᛚᚠᛏᛖᛚᚺᛖᛁᛘ',
        messageCount: 2,
        members: ['Light Elf Herald']
    },
    niflheim: {
        name: 'Niflheim',
        subtitle: 'ᚾᛁᚠᛚᚺᛖᛁᛘ — Realm of Ice and Mist',
        rune: 'ᚾᛁᚠᛚᚺᛖᛁᛘ',
        messageCount: 1,
        members: ['Hvergelmir']
    },
    svartalfheim: {
        name: 'Svartalfheim',
        subtitle: 'ᛋᚹᚨᚱᛏᚨᛚᚠᚺᛖᛁᛘ — Realm of Dwarves',
        rune: 'ᛋᚹᚨᚱᛏᚨᛚᚠᚺᛖᛁᛘ',
        messageCount: 3,
        members: ['Dwarf King', 'Sif (Dwarven forged)']
    }
};

// Sample messages per realm
const realmMessages = {
    asgard: [
        { sender: 'Odin', senderRune: 'ᛟᛞᛁᚴ', senderTitle: 'Odin Allfather', timestamp: 'The age of the Yew', body: 'Allfather speaks: the ravens have returned with knowledge from every branch of Yggdrasil. Midgard\'s war looms. Summon the Æsir.' },
        { sender: 'Thor', senderRune: 'ᚦᚢᚱ', senderTitle: 'Thor Odinson', timestamp: 'While the storm gathers', body: 'Father, I feel Mjolnir\'s pulse quickening. The jotnar march on our borders. I shall meet them with thunder.' },
        { sender: 'Loki', senderRune: 'ᛚᛟᚲᛁ', senderTitle: 'Loki', timestamp: 'When shadows whisper', body: 'Why do you gather the armies, Allfather? Surely peace serves the Aesir well. *adjusts smile*' },
        { sender: 'Freya', senderRune: 'ᚠᚱᛖᚨ', senderTitle: 'Freyja', timestamp: 'At the Vanir court', body: 'My tears fall as gold upon the earth. Half the slain shall be mine. Do not forget the Vanir\'s pact, Odin.' },
        { sender: 'Heimdall', senderRune: 'ᚼᛖᛁᛗᛞᛖᛚᛚ', senderTitle: 'Heimdall', timestamp: 'Upon the watchtower', body: 'I have seen it — the wolf devours the moon. The Bifrost shimmers with omen. A great darkness approaches Asgard.' },
        { sender: 'Odin', senderRune: 'ᛟᛞᛁᚴ', senderTitle: 'Odin Allfather', timestamp: 'Eye upon the Well', body: 'Huginn whispers of conquest. Muninn speaks of sacrifice. I have seen the shape of what is to come. The Ravens fly.' },
        { sender: 'Huginn', senderRune: 'ᚼᚢᚷᛁᚾᚾ', senderTitle: 'Huginn — Thought', timestamp: 'Upon swift wing', body: '*ravens cawing* Allfather, I carry the weight of your mind. Every thought a stone upon my back. I fly still.' }
    ],
    midgard: [
        { sender: 'Thor', senderRune: 'ᚦᚢᚱ', senderTitle: 'Thor Odinson', timestamp: 'Midday sun', body: 'The mortals build their mead halls and forget the old ways. But the thunder does not forget.' },
        { sender: 'Valkyrie', senderRune: 'ᚹᚨᛚᚲᚢᚱᛁᛖ', senderTitle: 'Valkyrie Brynhild', timestamp: 'Dawn patrol', body: 'The chosen fall upon the battlefield. I shall guide their souls to Valhalla.' },
        { sender: 'Human Chieftain', senderRune: 'ᛗᛖᚾ', senderTitle: 'Erik the Bold', timestamp: 'By the longship', body: 'The Northmen sing of Asgard. Tell your Allfather we remember the old pacts.' }
    ],
    helheim: [
        { sender: 'Hel', senderRune: 'ᚺᛖᛚ', senderTitle: 'Hel', timestamp: 'In the mist', body: 'The dead whisper in my halls. They remember the warmth of the sun. I am neither kind nor cruel — I am simply the end.' },
        { sender: 'NiflHel Serpent', senderRune: 'ᚾᛁᚠᛚ', senderTitle: 'Nidhogg', timestamp: 'Beneath the roots', body: '*hissing* The roots of Yggdrasil taste of rot. I shall gnaw until the tree falls.' }
    ]
};

// State
let currentRealm = 'asgard';
let runicMode = false;
let messageIdCounter = 100;

// DOM Elements
const bifrostOverlay = document.getElementById('bifrostOverlay');
const realmHeader = document.getElementById('realmHeader');
const realmName = document.getElementById('realmName');
const realmSubtitle = document.getElementById('realmSubtitle');
const messageCount = document.getElementById('messageCount');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const runicToggle = document.getElementById('runicToggle');
const ravenFlightContainer = document.getElementById('ravenFlight');
const sidebar = document.getElementById('sidebar');
const realmNodes = document.querySelectorAll('.realm-node');

// Initialize
function init() {
    setupRealmSwitching();
    setupMessageSending();
    setupRunicToggle();
    setupInputAutoResize();
    setupScrollBehavior();
    animateKnotwork();
    startRavenIdleAnimation();
    updateRavenStatus();
}

// Bifrost shimmer effect
function triggerBifrostEffect() {
    bifrostOverlay.classList.add('active');
    setTimeout(() => {
        bifrostOverlay.classList.remove('active');
    }, 1500);
}

// Realm switching
function setupRealmSwitching() {
    realmNodes.forEach(node => {
        node.addEventListener('click', () => {
            const realm = node.dataset.realm;
            if (realm === currentRealm) return;

            // Animate out current
            node.classList.remove('active');
            const oldNode = document.querySelector('.realm-node.active');
            if (oldNode) oldNode.classList.remove('active');

            // Bifrost transition
            triggerBifrostEffect();

            // Switch realm
            setTimeout(() => {
                currentRealm = realm;
                switchRealm(realm);
                node.classList.add('active');
            }, 600);
        });
    });

    // Set initial active state
    document.querySelector('.realm-node.active')?.classList.add('active');
}

function switchRealm(realmKey) {
    const realm = realmData[realmKey];
    realmName.textContent = realm.name;
    realmSubtitle.textContent = realm.subtitle;
    messageCount.textContent = `${realm.messageCount} messages`;

    // Update Yggdrasil node active state
    realmNodes.forEach(node => {
        node.classList.toggle('active', node.dataset.realm === realmKey);
    });

    // Load messages for realm
    loadRealmMessages(realmKey);

    // Update connections display
    updateConnections(realmKey);

    // Scroll to top
    messagesContainer.scrollTop = 0;
}

function loadRealmMessages(realmKey) {
    const messages = realmMessages[realmKey] || [];
    const existingMessages = messagesContainer.querySelectorAll('.message-group');

    // Clear existing messages except system message
    existingMessages.forEach(msg => msg.remove());

    // Add messages
    messages.forEach((msg, index) => {
        setTimeout(() => {
            const messageEl = createMessageElement(msg);
            messagesContainer.appendChild(messageEl);
        }, index * 150);
    });
}

function createMessageElement(msg) {
    const div = document.createElement('div');
    div.className = `message carved-bubble sender-${msg.sender.toLowerCase()}`;
    div.dataset.sender = msg.sender;

    const ravenIcon = msg.sender === 'Huginn' ? '<div class="message-raven-icon">🪶</div>' : '';

    div.innerHTML = `
        <div class="message-rune-header">${msg.senderRune}</div>
        <div class="message-sender">${msg.senderTitle}</div>
        <div class="message-timestamp">${msg.timestamp}</div>
        <div class="message-body"><p>${msg.body}</p></div>
        ${ravenIcon}
        <div class="message-knotwork-bottom"></div>
    `;

    return div;
}

// Message sending
function setupMessageSending() {
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // Create message
    const newMsg = {
        sender: 'Odin',
        senderRune: 'ᛟᛞᛁᚷ',
        senderTitle: 'Odin Allfather',
        timestamp: 'Just now',
        body: text
    };

    const messageEl = createMessageElement(newMsg);
    messagesContainer.appendChild(messageEl);

    // Raven flight animation
    spawnRavenFlight();

    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Update message count
    const realm = realmData[currentRealm];
    realm.messageCount++;
    messageCount.textContent = `${realm.messageCount} messages`;

    // Add to realm messages
    if (!realmMessages[currentRealm]) realmMessages[currentRealm] = [];
    realmMessages[currentRealm].push(newMsg);
}

// Raven flight animation
function spawnRavenFlight() {
    const raven = document.createElement('div');
    raven.className = 'raven-flight';
    raven.textContent = '🪶';
    raven.style.left = '20%';
    raven.style.top = '60%';

    ravenFlightContainer.appendChild(raven);

    // Clean up after animation
    setTimeout(() => {
        raven.remove();
    }, 2000);
}

// Idle raven animation
function startRavenIdleAnimation() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            const raven = document.createElement('div');
            raven.className = 'raven-flight';
            raven.textContent = '🪶';
            raven.style.left = Math.random() * 80 + 10 + '%';
            raven.style.top = Math.random() * 40 + 30 + '%';
            raven.style.animationDuration = '3s';

            ravenFlightContainer.appendChild(raven);
            setTimeout(() => raven.remove(), 3000);
        }
    }, 8000);
}

// Runic transliteration toggle
function setupRunicToggle() {
    runicToggle.addEventListener('click', () => {
        runicMode = !runicMode;
        runicToggle.classList.toggle('active', runicMode);

        if (runicMode) {
            runicToggle.textContent = 'ᚦᚢᚱᚾ ᚠᚢᛏ᛫ᚾᛟᚱᛋᛖ ᚑᚣ';
            applyRunicTransliteration();
        } else {
            runicToggle.textContent = 'ᚱᚢᚾᚲ ᚠᚢᛏ᛫ᚾᛟᚱᛋᛖ';
            removeRunicTransliteration();
        }
    });
}

function applyRunicTransliteration() {
    // Convert header text
    document.querySelectorAll('.message-sender').forEach(el => {
        el.textContent = transliterate(el.textContent);
    });
    document.querySelectorAll('.message-body p').forEach(el => {
        el.textContent = transliterate(el.textContent);
    });
    document.querySelectorAll('.message-rune-header').forEach(el => {
        el.textContent = transliterate(el.textContent);
    });
    document.querySelectorAll('.node-label').forEach(el => {
        el.textContent = transliterate(el.textContent);
    });
}

function removeRunicTransliteration() {
    // Restore original text
    switchRealm(currentRealm);
}

function transliterate(text) {
    let result = text;
    // Sort by length descending to match longest runes first
    const sortedKeys = Object.keys(runicMap).sort((a, b) => b.length - a.length);
    sortedKeys.forEach(key => {
        result = result.replaceAll(key, runicMap[key]);
    });
    return result;
}

// Input auto-resize
function setupInputAutoResize() {
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });
}

// Scroll behavior
function setupScrollBehavior() {
    messagesContainer.addEventListener('scroll', () => {
        // Could add parallax or other effects
    });
}

// Update connections display
function updateConnections(realmKey) {
    const connectionList = document.querySelector('.connection-list');
    const connections = {
        asgard: [
            { realm: 'ᚨᛋᚴᛟᚱᛞ', status: 'on' },
            { realm: 'ᛗᛁᛞᛖᛗᛖᚱᛞ', status: 'on' },
            { realm: 'ᚺᛖᛚᚺᛖᛁᛘ', status: 'on' },
            { realm: 'ᛃᛟᚢᚦᚢᚾᚺᛖᛁᛘ', status: 'warn' },
            { realm: 'ᛗᚢᛋᛈᛖᛚᚺᛖᛁᛘ', status: 'off' },
            { realm: 'ᚢᛚᚠᛏᛖᛚᚺᛖᛁᛘ', status: 'off' },
            { realm: 'ᚾᛁᚠᛚᚺᛖᛁᛘ', status: 'on' },
            { realm: 'ᛋᚹᚨᚱᛏᚨᛚᚠᚺᛖᛁᛘ', status: 'on' }
        ]
    };

    const realmConns = connections[realmKey] || connections.asgard;
    connectionList.innerHTML = '';

    realmConns.forEach(conn => {
        const item = document.createElement('div');
        item.className = 'connection-item';
        item.innerHTML = `
            <span class="connection-realm">${conn.realm}</span>
            <span class="connection-status ${conn.status}">${conn.status === 'on' ? 'Connected' : conn.status === 'warn' ? 'Weak Signal' : 'Sealed'}</span>
        `;
        connectionList.appendChild(item);
    });
}

// Update raven status
function updateRavenStatus() {
    setInterval(() => {
        const huginnFill = document.querySelector('.raven-huginn .raven-status-fill');
        const muninnFill = document.querySelector('.raven-muninn .raven-status-fill');

        if (huginnFill) {
            const newWidth = Math.min(95, Math.max(70, parseFloat(huginnFill.style.width) + (Math.random() - 0.5) * 5));
            huginnFill.style.width = newWidth + '%';
        }
        if (muninnFill) {
            const newWidth = Math.min(95, Math.max(70, parseFloat(muninnFill.style.width) + (Math.random() - 0.5) * 5));
            muninnFill.style.width = newWidth + '%';
        }
    }, 3000);
}

// Knotwork animation
function animateKnotwork() {
    // Animate the knotwork borders on messages
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.message').forEach(msg => {
        observer.observe(msg);
    });
}

// Iron divider shimmer
function setupIronDividerShimmer() {
    const dividers = document.querySelectorAll('.iron-divider');
    dividers.forEach(div => {
        div.addEventListener('mouseenter', () => {
            div.style.background = 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)';
            div.style.transition = 'background 0.5s ease';
        });
        div.addEventListener('mouseleave', () => {
            div.style.background = 'linear-gradient(90deg, transparent, var(--gold-dim), transparent)';
        });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupIronDividerShimmer();

    // Welcome raven flight
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => spawnRavenFlight(), i * 400);
        }
    }, 1000);
});

// Add some ambient effects
setInterval(() => {
    // Random flicker of gold glow on runes
    const runes = document.querySelectorAll('.message-rune-header');
    runes.forEach(rune => {
        if (Math.random() > 0.95) {
            rune.style.textShadow = '0 0 15px var(--gold-glow), 0 0 30px var(--gold-dim)';
            setTimeout(() => {
                rune.style.textShadow = 'none';
            }, 300);
        }
    });
}, 2000);

// Auto-expand textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    this.style.maxHeight = '120px';
    this.style.overflowY = this.scrollHeight > 120 ? 'auto' : 'hidden';
});