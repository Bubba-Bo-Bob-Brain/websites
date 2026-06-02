/* ═══════════════════════════════════════════════════════════════
   HUGINN & MUNINN — THE RAVEN NETWORK
   Norse Mythology Messaging Interface
   Interactive Scripts — Forged in the halls of Svartálfheim
   ═══════════════════════════════════════════════════════════════ */

// ─── Elder Futhark Rune Mapping ───
const ELDER_FUTHARK = {
    'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ',
    'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ',
    'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲᚹ', 'r': 'ᚱ',
    's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᚲᛊ',
    'y': 'ᛁ', 'z': 'ᛉ', 'th': 'ᚦ', 'ng': 'ᛝ', 'ae': 'ᛇ', 'oe': 'ᛟ',
    ' ': ' ', '.': '᛫', ',': '᛫', '!': '!', '?': '?', ':': '᛬'
};

const REVERSE_FUTHARK = {};
Object.entries(ELDER_FUTHARK).forEach(([key, value]) => {
    if (value !== ' ' && value !== '.' && value !== ',' && value !== '!' && value !== '?' && value !== ':') {
        REVERSE_FUTHARK[value] = key;
    }
});
REVERSE_FUTHARK['᛫'] = '.';
REVERSE_FUTHARK['᛬'] = ':';
REVERSE_FUTHARK['ᚦ'] = 'th';
REVERSE_FUTHARK['ᛝ'] = 'ng';
REVERSE_FUTHARK['ᛇ'] = 'ae';

// ─── Realm Data ───
const REALMS = {
    asgard: {
        name: 'Asgard',
        rune: 'ᚨ',
        title: 'ᚨᛊᚷᚨᚱᛞ',
        description: 'The golden halls of the Æsir — where the worthy feast until Ragnarök',
        color: '#c9a227',
        messages: []
    },
    midgard: {
        name: 'Midgard',
        rune: 'ᛗ',
        title: 'ᛗᛁᛞᚷᚨᚱᛞ',
        description: 'Realm of Men — the world of mortals between the branches of Yggdrasil',
        color: '#5a8a5a',
        messages: []
    },
    jotunheim: {
        name: 'Jötunheim',
        rune: 'ᛃ',
        title: 'ᛃᛟᛏᚢᚾᚺᛖᛁᛗ',
        description: 'Land of the Giants — ancient enemies and uneasy allies of the gods',
        color: '#6a5a8a',
        messages: []
    },
    vanaheim: {
        name: 'Vanaheim',
        rune: 'ᚡ',
        title: 'ᚡᚨᚾᚨᚺᛖᛁᛗ',
        description: 'Realm of the Vanir — masters of seiðr and fertility magic',
        color: '#7aaa6a',
        messages: []
    },
    alfheim: {
        name: 'Álfheim',
        rune: 'ᚨ',
        title: 'ᚨᛚᚠᚺᛖᛁᛗ',
        description: 'Home of the Light Elves — radiant beings of beauty and grace',
        color: '#aab5ff',
        messages: []
    },
    svartalfheim: {
        name: 'Svartálfheim',
        rune: 'ᛊ',
        title: 'ᛊᚡᚨᚱᛏᚨᛚᚠᚺᛖᛁᛗ',
        description: 'Realm of the Dwarves — master smiths who forged the treasures of the gods',
        color: '#8a7a5a',
        messages: []
    },
    niflheim: {
        name: 'Niflheim',
        rune: 'ᚾ',
        title: 'ᚾᛁᚠᛚᚺᛖᛁᛗ',
        description: 'World of Mist and Ice — the primordial realm of cold and darkness',
        color: '#8ab5c5',
        messages: []
    },
    muspelheim: {
        name: 'Muspelheim',
        rune: 'ᛗ',
        title: 'ᛗᚢᛊᛈᛖᛚᚺᛖᛁᛗ',
        description: 'Realm of Fire — where Surtr waits with his flaming sword',
        color: '#ff5a3a',
        messages: []
    },
    helheim: {
        name: 'Helheim',
        rune: 'ᚺ',
        title: 'ᚺᛖᛚᚺᛖᛁᛗ',
        description: 'Realm of the Dead — ruled by Hel, daughter of Loki',
        color: '#5a5a7a',
        messages: []
    }
};

// ─── God Data ───
const GODS = {
    odin: {
        name: 'Odin',
        title: 'The Allfather',
        rune: 'ᛟ',
        color: '#c9a227'
    },
    thor: {
        name: 'Thor',
        title: 'God of Thunder',
        rune: 'ᚦ',
        color: '#5a8aaa'
    },
    freya: {
        name: 'Freya',
        title: 'Lady of the Vanir',
        rune: 'ᚠ',
        color: '#9a5aaa'
    },
    loki: {
        name: 'Loki',
        title: 'The Trickster',
        rune: 'ᛚ',
        color: '#5aaa5a'
    },
    heimdall: {
        name: 'Heimdall',
        title: 'Watcher of the Bifrost',
        rune: 'ᚺ',
        color: '#aab5ff'
    },
    tyr: {
        name: 'Týr',
        title: 'God of War',
        rune: 'ᛏ',
        color: '#aa5a5a'
    },
    frigg: {
        name: 'Frigg',
        title: 'Queen of Asgard',
        rune: 'ᚠ',
        color: '#c9a227'
    },
    baldr: {
        name: 'Baldr',
        title: 'The Bright',
        rune: 'ᛒ',
        color: '#ffffff'
    }
};

// ─── State ───
let currentRealm = 'asgard';
let currentGod = 'odin';
let runeMode = false;
let isTyping = false;
let typingTimeout = null;

// ─── DOM Elements ───
const elements = {
    realmChannels: document.getElementById('realmChannels'),
    messagesContainer: document.getElementById('messagesContainer'),
    messagesScroll: document.getElementById('messagesScroll'),
    messageInput: document.getElementById('messageInput'),
    sendRavenBtn: document.getElementById('sendRavenBtn'),
    runeConvertBtn: document.getElementById('runeConvertBtn'),
    runeToggle: document.getElementById('runeToggle'),
    charCount: document.getElementById('charCount'),
    typingIndicator: document.getElementById('typingIndicator'),
    ravenDelivery: document.getElementById('ravenDelivery'),
    ravenNotification: document.getElementById('ravenNotification'),
    notifText: document.getElementById('notifText'),
    bifrostOverlay: document.getElementById('bifrostOverlay'),
    emberContainer: document.getElementById('emberContainer'),
    runeParticles: document.getElementById('runeParticles'),
    realmBanner: document.getElementById('realmBanner'),
    bannerRealm: document.getElementById('bannerRealm'),
    bannerDesc: document.getElementById('bannerDesc'),
    bannerRune: document.getElementById('bannerRune')
};

// ─── Initialize ───
document.addEventListener('DOMContentLoaded', () => {
    initializeAmbientEffects();
    initializeRealmChannels();
    initializeMessageInput();
    initializeRuneToggle();
    loadSampleMessages();
    renderMessages();
    startTypingSimulation();
});

// ─── Ambient Effects ───
function initializeAmbientEffects() {
    createEmbers();
    createRuneParticles();
}

function createEmbers() {
    const emberCount = 15;
    
    for (let i = 0; i < emberCount; i++) {
        setTimeout(() => {
            const ember = document.createElement('div');
            ember.className = 'ember';
            ember.style.left = `${Math.random() * 100}%`;
            ember.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);
            ember.style.animationDuration = `${8 + Math.random() * 12}s`;
            ember.style.animationDelay = `${Math.random() * 10}s`;
            ember.style.width = `${2 + Math.random() * 4}px`;
            ember.style.height = ember.style.width;
            
            elements.emberContainer.appendChild(ember);
            
            // Remove and recreate ember after animation
            ember.addEventListener('animationiteration', () => {
                ember.style.left = `${Math.random() * 100}%`;
            });
        }, i * 500);
    }
}

function createRuneParticles() {
    const runes = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛝᛟᛞ';
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'rune-particle';
        particle.textContent = runes[Math.floor(Math.random() * runes.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${12 + Math.random() * 8}s`;
        
        elements.runeParticles.appendChild(particle);
    }
}

// ─── Realm Channels ───
function initializeRealmChannels() {
    const branches = elements.realmChannels.querySelectorAll('.realm-branch');
    
    branches.forEach(branch => {
        branch.addEventListener('click', () => {
            const realm = branch.dataset.realm;
            switchRealm(realm);
        });
    });
}

function switchRealm(realmId) {
    if (realmId === currentRealm) return;
    
    // Trigger Bifrost effect
    triggerBifrostEffect();
    
    // Update active state
    const branches = elements.realmChannels.querySelectorAll('.realm-branch');
    branches.forEach(branch => {
        branch.classList.toggle('active', branch.dataset.realm === realmId);
    });
    
    // Update current realm
    currentRealm = realmId;
    const realm = REALMS[realmId];
    
    // Update banner
    elements.realmBanner.dataset.realm = realmId;
    elements.bannerRealm.textContent = realm.name;
    elements.bannerDesc.textContent = realm.description;
    elements.bannerRune.textContent = realm.rune;
    
    // Update banner color
    elements.bannerRune.style.borderColor = realm.color;
    elements.bannerRune.style.boxShadow = `0 0 20px ${realm.color}40, inset 0 0 20px ${realm.color}20`;
    
    // Render messages for this realm
    renderMessages();
    
    // Update online beings based on realm
    updateOnlineBeings(realmId);
}

function triggerBifrostEffect() {
    elements.bifrostOverlay.classList.add('active');
    
    setTimeout(() => {
        elements.bifrostOverlay.classList.remove('active');
    }, 1000);
}

function updateOnlineBeings(realmId) {
    // Simulate different gods being present in different realms
    const realmGods = {
        asgard: ['odin', 'thor', 'freya', 'loki', 'frigg'],
        midgard: ['thor', 'loki', 'heimdall'],
        jotunheim: ['loki', 'thor'],
        vanaheim: ['freya', 'frigg'],
        alfheim: ['freya', 'baldr'],
        svartalfheim: ['odin', 'loki'],
        niflheim: ['hel'],
        muspelheim: ['surtr'],
        helheim: ['hel']
    };
    
    const beings = document.querySelectorAll('.being-item');
    beings.forEach(being => {
        const godId = being.dataset.god;
        const isPresent = realmGods[realmId]?.includes(godId);
        
        if (isPresent) {
            being.classList.remove('offline');
            being.classList.add('online');
        } else {
            being.classList.remove('online');
            being.classList.add('offline');
        }
    });
}

// ─── Message Input ───
function initializeMessageInput() {
    // Auto-resize textarea
    elements.messageInput.addEventListener('input', () => {
        autoResizeTextarea();
        updateCharCount();
        simulateOthersTyping();
    });
    
    // Send message
    elements.sendRavenBtn.addEventListener('click', sendMessage);
    
    // Enter to send (Shift+Enter for newline)
    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Rune convert button
    elements.runeConvertBtn.addEventListener('click', toggleInputRuneMode);
}

function autoResizeTextarea() {
    elements.messageInput.style.height = 'auto';
    elements.messageInput.style.height = Math.min(elements.messageInput.scrollHeight, 120) + 'px';
}

function updateCharCount() {
    const count = elements.messageInput.value.length;
    elements.charCount.textContent = count;
    
    if (count > 450) {
        elements.charCount.style.color = '#ff5a3a';
    } else if (count > 400) {
        elements.charCount.style.color = '#ff8c00';
    } else {
        elements.charCount.style.color = '';
    }
}

function toggleInputRuneMode() {
    runeMode = !runeMode;
    
    if (runeMode) {
        elements.messageInput.classList.add('runic-mode');
        elements.runeConvertBtn.style.color = '#c9a227';
        elements.runeConvertBtn.style.borderColor = '#c9a227';
        
        // Convert current text to runes
        const currentText = elements.messageInput.value;
        elements.messageInput.value = transliterateToRunes(currentText);
    } else {
        elements.messageInput.classList.remove('runic-mode');
        elements.runeConvertBtn.style.color = '';
        elements.runeConvertBtn.style.borderColor = '';
        
        // Convert back to Latin
        const runicText = elements.messageInput.value;
        elements.messageInput.value = transliterateFromRunes(runicText);
    }
    
    autoResizeTextarea();
    updateCharCount();
}

// ─── Runic Transliteration ───
function transliterateToRunes(text) {
    const lowerText = text.toLowerCase();
    let result = '';
    let i = 0;
    
    while (i < lowerText.length) {
        // Check for two-character combinations first
        const twoChar = lowerText.substring(i, i + 2);
        if (ELDER_FUTHARK[twoChar]) {
            result += ELDER_FUTHARK[twoChar];
            i += 2;
            continue;
        }
        
        // Single character
        const char = lowerText[i];
        result += ELDER_FUTHARK[char] || char;
        i++;
    }
    
    return result;
}

function transliterateFromRunes(text) {
    let result = '';
    let i = 0;
    
    while (i < text.length) {
        const char = text[i];
        result += REVERSE_FUTHARK[char] || char;
        i++;
    }
    
    return result;
}

// ─── Send Message ───
function sendMessage() {
    const text = elements.messageInput.value.trim();
    if (!text) return;
    
    // Trigger raven delivery animation
    triggerRavenDelivery();
    
    // Create message after a delay (raven flight time)
    setTimeout(() => {
        const message = {
            id: Date.now(),
            god: currentGod,
            text: runeMode ? text : text,
            isRunic: runeMode,
            timestamp: new Date(),
            realm: currentRealm,
            sent: true
        };
        
        REALMS[currentRealm].messages.push(message);
        renderNewMessage(message);
        
        // Clear input
        elements.messageInput.value = '';
        autoResizeTextarea();
        updateCharCount();
        
        // Scroll to bottom
        scrollToBottom();
        
        // Simulate response after a delay
        simulateResponse();
    }, 1500);
}

function triggerRavenDelivery() {
    elements.ravenDelivery.classList.add('active');
    
    setTimeout(() => {
        elements.ravenDelivery.classList.remove('active');
    }, 2000);
}

// ─── Render Messages ───
function renderMessages() {
    const messages = REALMS[currentRealm].messages;
    elements.messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
        renderEmptyState();
        return;
    }
    
    messages.forEach((message, index) => {
        const messageEl = createMessageElement(message);
        messageEl.style.animationDelay = `${index * 0.1}s`;
        elements.messagesContainer.appendChild(messageEl);
    });
    
    scrollToBottom();
}

function renderNewMessage(message) {
    // Remove empty state if present
    const emptyState = elements.messagesContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const messageEl = createMessageElement(message);
    elements.messagesContainer.appendChild(messageEl);
}

function createMessageElement(message) {
    const god = GODS[message.god];
    const isSent = message.sent;
    
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
    bubble.dataset.messageId = message.id;
    
    const time = formatTime(message.timestamp);
    const text = message.isRunic ? message.text : message.text;
    
    bubble.innerHTML = `
        <div class="message-avatar" style="border-color: ${god.color}; color: ${god.color}">
            <span>${god.rune}</span>
        </div>
        <div class="message-content">
            <div class="message-sender">
                <span class="sender-name">${god.name}</span>
                <span class="sender-title">${god.title}</span>
            </div>
            <div class="message-frame">
                <p class="message-text ${message.isRunic ? 'runic' : ''}">${escapeHtml(text)}</p>
            </div>
            <div class="message-meta">
                <span class="message-time">${time}</span>
                <span class="message-realm-tag">${REALMS[message.realm].title}</span>
            </div>
        </div>
    `;
    
    return bubble;
}

function renderEmptyState() {
    const realm = REALMS[currentRealm];
    
    elements.messagesContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-rune">${realm.rune}</div>
            <h3 class="empty-title">Silence in ${realm.name}</h3>
            <p class="empty-text">No ravens have carried messages to this realm yet.</p>
            <p class="empty-hint">Be the first to inscribe your words upon the stone.</p>
        </div>
    `;
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} moments ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    setTimeout(() => {
        elements.messagesScroll.scrollTop = elements.messagesScroll.scrollHeight;
    }, 100);
}

// ─── Rune Toggle ───
function initializeRuneToggle() {
    elements.runeToggle.addEventListener('click', () => {
        elements.runeToggle.classList.toggle('active');
        
        const isActive = elements.runeToggle.classList.contains('active');
        
        // Toggle all message text between runes and Latin
        const messages = elements.messagesContainer.querySelectorAll('.message-text');
        messages.forEach(msg => {
            if (isActive) {
                msg.dataset.originalText = msg.textContent;
                msg.textContent = transliterateToRunes(msg.textContent);
                msg.classList.add('runic');
            } else if (msg.dataset.originalText) {
                msg.textContent = msg.dataset.originalText;
                msg.classList.remove('runic');
            }
        });
    });
}

// ─── Typing Simulation ───
function startTypingSimulation() {
    // Periodically show typing indicator
    setInterval(() => {
        if (Math.random() > 0.7 && !isTyping) {
            showTypingIndicator();
        }
    }, 8000);
}

function simulateOthersTyping() {
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Show someone typing after user types
    typingTimeout = setTimeout(() => {
        if (Math.random() > 0.5) {
            showTypingIndicator();
        }
    }, 2000);
}

function showTypingIndicator() {
    const otherGods = Object.keys(GODS).filter(g => g !== currentGod);
    const randomGod = GODS[otherGods[Math.floor(Math.random() * otherGods.length)]];
    
    elements.typingIndicator.querySelector('.typing-god').textContent = randomGod.name;
    elements.typingIndicator.classList.add('active');
    
    isTyping = true;
    
    setTimeout(() => {
        elements.typingIndicator.classList.remove('active');
        isTyping = false;
    }, 3000);
}

// ─── Simulate Response ───
function simulateResponse() {
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            const responses = getRealmResponses(currentRealm);
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const otherGods = Object.keys(GODS).filter(g => g !== currentGod);
            const responderId = otherGods[Math.floor(Math.random() * otherGods.length)];
            
            const message = {
                id: Date.now(),
                god: responderId,
                text: randomResponse,
                isRunic: false,
                timestamp: new Date(),
                realm: currentRealm,
                sent: false
            };
            
            REALMS[currentRealm].messages.push(message);
            renderNewMessage(message);
            scrollToBottom();
            
            // Show notification
            showRavenNotification(GODS[responderId].name);
            
            elements.typingIndicator.classList.remove('active');
        }, 2000);
    }, 3000);
}

function getRealmResponses(realmId) {
    const responses = {
        asgard: [
            "By Odin's eye, your words ring true!",
            "The halls of Valhalla echo with your wisdom.",
            "Skål! May the mead flow eternal!",
            "The Allfather watches over this conversation.",
            "Even Loki would find truth in your words... perhaps.",
            "May your journey through the realms be blessed."
        ],
        midgard: [
            "The mortals speak with surprising wisdom.",
            "The world tree's roots run deep here.",
            "Even in Midgard, the old ways are remembered.",
            "Your words carry the weight of ages."
        ],
        jotunheim: [
            "The giants listen... and remember.",
            "Frost and fire, your words cut through the cold.",
            "In the land of giants, even whispers carry far."
        ],
        vanaheim: [
            "The Vanir sense great power in your words.",
            "Seiðr flows through this conversation.",
            "The old magic stirs at your invocation."
        ],
        alfheim: [
            "The light elves shimmer with approval.",
            "Your words shine like starlight in the eternal twilight.",
            "Beauty and grace adorn your message."
        ],
        svartalfheim: [
            "The dwarves nod over their anvils.",
            "Your words are forged stronger than uru metal.",
            "Brokkr and Eitri would craft tales from such words."
        ],
        niflheim: [
            "Through the mist, your words find their way.",
            "The cold cannot freeze the fire of your message.",
            "In the primordial ice, ancient things stir."
        ],
        muspelheim: [
            "Surtr's flames dance at your words!",
            "The fire realm blazes with interest.",
            "Your message burns bright across the void."
        ],
        helheim: [
            "Even the dead pause to listen.",
            "Hel acknowledges your presence.",
            "In the realm of shadows, your words cast light."
        ]
    };
    
    return responses[realmId] || responses.asgard;
}

// ─── Raven Notification ───
function showRavenNotification(godName) {
    elements.notifText.textContent = `New message from ${godName}`;
    elements.ravenNotification.classList.add('active');
    
    setTimeout(() => {
        elements.ravenNotification.classList.remove('active');
    }, 4000);
}

// ─── Load Sample Messages ───
function loadSampleMessages() {
    const now = Date.now();
    
    REALMS.asgard.messages = [
        {
            id: now - 3600000,
            god: 'odin',
            text: 'Hear me, all who dwell in the golden halls! The ravens have returned with tidings from the edges of the world.',
            isRunic: false,
            timestamp: new Date(now - 3600000),
            realm: 'asgard',
            sent: false
        },
        {
            id: now - 3000000,
            god: 'thor',
            text: 'Father! I have journeyed to Jötunheim and back. The giants grow restless. Mjölnir hums with anticipation.',
            isRunic: false,
            timestamp: new Date(now - 3000000),
            realm: 'asgard',
            sent: false
        },
        {
            id: now - 2400000,
            god: 'freya',
            text: 'My seiðr reveals shadows gathering in the east. We must be vigilant, my lords.',
            isRunic: false,
            timestamp: new Date(now - 2400000),
            realm: 'asgard',
            sent: false
        },
        {
            id: now - 1800000,
            god: 'loki',
            text: 'Oh, how dramatic! Perhaps the shadows are merely... misunderstood? *smiles mischievously*',
            isRunic: false,
            timestamp: new Date(now - 1800000),
            realm: 'asgard',
            sent: false
        },
        {
            id: now - 1200000,
            god: 'heimdall',
            text: 'I see all from the Bifrost. Loki, your games are noted. The realms are in balance... for now.',
            isRunic: false,
            timestamp: new Date(now - 1200000),
            realm: 'asgard',
            sent: false
        }
    ];
    
    REALMS.midgard.messages = [
        {
            id: now - 7200000,
            god: 'thor',
            text: 'The mortals build their settlements ever wider. They have courage, these humans.',
            isRunic: false,
            timestamp: new Date(now - 7200000),
            realm: 'midgard',
            sent: false
        },
        {
            id: now - 5400000,
            god: 'loki',
            text: 'Courage or foolishness? Sometimes they are the same thing, dear brother.',
            isRunic: false,
            timestamp: new Date(now - 5400000),
            realm: 'midgard',
            sent: false
        }
    ];
    
    REALMS.helheim.messages = [
        {
            id: now - 10800000,
            god: 'odin',
            text: 'Hel, keeper of the fallen. What news from your grey realm?',
            isRunic: false,
            timestamp: new Date(now - 10800000),
            realm: 'helheim',
            sent: false
        }
    ];
    
    REALMS.muspelheim.messages = [
        {
            id: now - 14400000,
            god: 'loki',
            text: 'The flames here remind me of... home. Strange, is it not?',
            isRunic: false,
            timestamp: new Date(now - 14400000),
            realm: 'muspelheim',
            sent: false
        }
    ];
}

// ─── Add Empty State Styles Dynamically ───
const emptyStateStyles = document.createElement('style');
emptyStateStyles.textContent = `
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 300px;
        text-align: center;
        padding: var(--space-2xl);
    }
    
    .empty-rune {
        font-family: var(--font-rune);
        font-size: 4rem;
        color: var(--color-text-dim);
        margin-bottom: var(--space-lg);
        opacity: 0.5;
        animation: empty-rune-pulse 3s ease-in-out infinite;
    }
    
    @keyframes empty-rune-pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.05); }
    }
    
    .empty-title {
        font-family: var(--font-heading);
        font-size: 1.3rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--space-sm);
    }
    
    .empty-text {
        font-family: var(--font-body);
        font-style: italic;
        font-size: 0.95rem;
        color: var(--color-text-dim);
        margin-bottom: var(--space-sm);
    }
    
    .empty-hint {
        font-family: var(--font-rune);
        font-size: 0.8rem;
        color: var(--color-text-rune);
        opacity: 0.7;
    }
`;
document.head.appendChild(emptyStateStyles);

// ─── Console Welcome Message ───
console.log(`
%c╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ᚺᚢᚷᛁᚾᚾ  &  ᛗᚢᚾᛁᚾᚾ                                   ║
║   The Raven Network                                       ║
║                                                           ║
║   "Two ravens sit on my shoulders                          ║
║    and whisper news into my ears."                         ║
║                          — Odin, the Allfather             ║
║                                                           ║
║   Forged in the fires of Muspelheim                        ║
║   Carved in the halls of Svartálfheim                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`, 'color: #c9a227; background: #1a1410; font-family: monospace; padding: 10px;');