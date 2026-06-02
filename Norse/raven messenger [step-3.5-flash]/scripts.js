/**
 * Raven's Dispatch - Norse Messaging Interface
 * Interactive JavaScript for immersive mythological chat
 */

// ===== CONFIGURATION & DATA =====
const REALMS = {
    asgard: {
        name: 'Asgard',
        runic: 'ᚨᛋᚷᚨᚱᛞ',
        color: '#ffd700',
        secondary: '#ffec8b',
        texture: 'divine',
        gods: ['Thor', 'Odin', 'Loki', 'Frigg', 'Baldr', 'Heimdall', 'Idun', 'Bragi'],
        knotwork: 'ᛟ',
        channel: "Allfather's Court"
    },
    midgard: {
        name: 'Midgard',
        runic: 'ᛗᛁᛞᚷᚨᚱᛞ',
        color: '#8b4513',
        secondary: '#a0522d',
        texture: 'earth',
        gods: ['Thor', 'Loki', 'Sigurd', 'Brunhild', 'Beowulf', 'Kvasir'],
        knotwork: 'ᛗ',
        channel: 'Middle Earth Haven'
    },
    vanaheim: {
        name: 'Vanaheim',
        runic: 'ᚠᚨᚾᚨᚻᛖᛁᛗ',
        color: '#228b22',
        secondary: '#32cd32',
        texture: 'forest',
        gods: ['Freyja', 'Freyr', 'Njord', 'Nerthus', 'Kvasir'],
        knotwork: 'ᚠ',
        channel: 'Vanir Grove'
    },
    alfheim: {
        name: 'Alfheim',
        runic: 'ᚨᛚᚠᚺᛖᛁᛗ',
        color: '#ff69b4',
        secondary: '#ffb6c1',
        texture: 'light',
        gods: ['Alfr', 'Ljusalft', 'Vidar', 'Forseti'],
        knotwork: 'ᛇ',
        channel: 'Light Elf Glade'
    },
    jotunheim: {
        name: 'Jotunheim',
        runic: 'ᛃᚨᚿᚢᚾᚺᛖᛁᛗ',
        color: '#696969',
        secondary: '#a9a9a9',
        texture: 'stone',
        gods: ['Skadi', 'Utgard-Loki', 'Thrym', 'Surt', 'Gunnlod'],
        knotwork: 'ᛃ',
        channel: 'Giant\'s Roost'
    },
    niflheim: {
        name: 'Niflheim',
        runic: 'ᚾᛁᚠᛚᚺᛖᛁᛗ',
        color: '#87ceeb',
        secondary: '#b0e0e6',
        texture: 'ice',
        gods: ['Hel', 'Nidhogg', 'Ymir', 'Kara'],
        knotwork: 'ᚾ',
        channel: 'Mist Realm'
    },
    muspelheim: {
        name: 'Muspelheim',
        runic: 'ᛗᚢᛋᛈᛖᛚᚺᛖᛁᛗ',
        color: '#ff4500',
        secondary: '#ff6347',
        texture: 'fire',
        gods: ['Surt', 'Sinmara', 'Garm', 'Muspell'],
        knotwork: 'ᛗ',
        channel: 'Flame Kingdom'
    },
    helheim: {
        name: 'Helheim',
        runic: 'ᚺᛖᛚᚺᛖᛁᛗ',
        color: '#2f4f4f',
        secondary: '#708090',
        texture: 'death',
        gods: ['Hel', 'Garm', 'Nidhogg', 'Menglad'],
        knotwork: 'ᚷ',
        channel: 'Silent Halls'
    }
};

const NORSE_TIME_LABELS = {
    night: 'Midnight',
    dawn: 'Dawn',
    morning: 'Morning',
    midday: 'Midday',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night'
};

const NORSE_RUNIC_TIME = {
    night: 'ᚾᚨᛏ',
    dawn: 'ᛁᚾᚾᛖᚱ',
    morning: 'ᛘᚨᚱᚾ',
    midday: 'ᚾᚢᚱ',
    afternoon: 'ᛅᚠᛏᚢᚾᚾ',
    evening: 'ᛏᚢᚾᚾᚨ',
    night: 'ᚾᚨᛏ'
};

// Simple runic transliteration (Elder Futhark approximate)
const RUNIC_MAP = {
    'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ',
    'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ',
    'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᛇ', 'r': 'ᚱ',
    's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚢ', 'w': 'ᚹ', 'x': 'ᛇ',
    'y': 'ᚢ', 'z': 'ᛉ', 'th': 'ᚦ', 'ng': 'ᛝ', 'ch': 'ᚲ', 'sh': 'ᛋᚺ',
    ' ': ' ', '.': '·', ',': ',', '!': '!', '?': '?', '\'': '\'',
    '"': '"', '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
};

// ===== APPLICATION STATE =====
const state = {
    currentRealm: 'asgard',
    runicMode: false,
    messages: {},
    currentUser: 'Odin_Allfather'
};

// ===== DOM ELEMENTS =====
const elements = {
    runicToggle: document.getElementById('runic-toggle'),
    messagesContainer: document.getElementById('messages-container'),
    messageInput: document.getElementById('message-input'),
    sendBtn: document.getElementById('send-btn'),
    yggdrasilTree: document.querySelector('.yggdrasil-tree'),
    realmList: document.querySelector('.realm-list'),
    currentRealmBadge: document.getElementById('current-realm-badge'),
    channelTitle: document.getElementById('channel-title'),
    ravenFlightLayer: document.getElementById('raven-flight-layer'),
    bifrostOverlay: document.getElementById('bifrost-overlay')
};

// ===== INITIALIZATION =====
function init() {
    generateYggdrasil();
    initializeMessages();
    setupEventListeners();
    switchRealm('asgard', false); // Initial realm, no animation
    updateRunicUI();
}

// ===== YGGDRASIL GENERATION =====
function generateYggdrasil() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('yggdrasil-svg');
    svg.setAttribute('viewBox', '0 0 200 300');
    
    // Create trunk
    const trunk = document.createElementNS(svgNS, 'path');
    trunk.classList.add('root');
    trunk.setAttribute('d', 'M100,280 Q95,200 100,150 Q105,100 100,50');
    svg.appendChild(trunk);
    
    // Create branches for each realm (positioned along trunk)
    const realmOrder = ['asgard', 'midgard', 'vanaheim', 'alfheim', 
                       'jotunheim', 'niflheim', 'muspelheim', 'helheim'];
    
    realmOrder.forEach((realm, index) => {
        const y = 250 - (index * 25);
        const x = 100 + (index % 2 === 0 ? -1 : 1) * (30 + index * 5);
        
        // Branch
        const branch = document.createElementNS(svgNS, 'path');
        branch.classList.add('branch');
        branch.setAttribute('data-realm', realm);
        branch.setAttribute('d', `M100,${y} Q${x > 100 ? 120 : 80},${y-20} ${x},${y-40}`);
        svg.appendChild(branch);
        
        // Realm node (circle with rune)
        const node = document.createElementNS(svgNS, 'g');
        node.classList.add('realm-node');
        node.setAttribute('data-realm', realm);
        node.setAttribute('transform', `translate(${x}, ${y-40})`);
        
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('r', '8');
        node.appendChild(circle);
        
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '4');
        text.setAttribute('fill', 'var(--iron-light)');
        text.setAttribute('font-family', 'var(--font-runic)');
        text.setAttribute('font-size', '10');
        text.textContent = REALMS[realm].runic.charAt(0);
        node.appendChild(text);
        
        svg.appendChild(node);
    });
    
    elements.yggdrasilTree.innerHTML = '';
    elements.yggdrasilTree.appendChild(svg);
}

// ===== MESSAGES INITIALIZATION =====
function initializeMessages() {
    // Sample messages for each realm
    const sampleMessages = {
        asgard: [
            { sender: 'Thor', text: 'Brothers! The giants grow restless at the borders. I saw movements in Jotunheim yesterday.' },
            { sender: 'Loki', text: 'Interesting... I may have information about these movements. But it will cost you a keg of mead.' },
            { sender: 'Odin', text: 'Huginn and Muninn report from all realms. The threads of fate are shifting.' }
        ],
        midgard: [
            { sender: 'Sigurd', text: 'The dragon\'s hoard is secure. But I hear whispers of a ring that binds them all.' },
            { sender: 'Brunhild', text: 'The Valkyries stand ready. Send word when the final battle approaches.' }
        ],
        vanaheim: [
            { sender: 'Freyja', text: 'The Vanir have been preparing our defenses. We stand with Asgard against the frost giants.' },
            { sender: 'Freyr', text: 'The grain grows tall this season. Let us not let war spoil the harvest.' }
        ],
        alfheim: [
            { sender: 'Alfr', text: 'The light of the elves shines brighter today. A child of light has been born.' },
            { sender: 'Ljusalft', text: 'The paths through the forest are clear. Travelers may pass safely this night.' }
        ],
        jotunheim: [
            { sender: 'Skadi', text: 'The winds howl with discontent. The giants remember old grudges.' },
            { sender: 'Utgard-Loki', text: 'Let them come. We have surprises waiting in the mist.' }
        ],
        niflheim: [
            { sender: 'Hel', text: 'The dead do not concern themselves with your wars. But if you fall, my realm will grow.' },
            { sender: 'Nidhogg', text: 'The roots of Yggdrasil taste sweet with your anxieties.' }
        ],
        muspelheim: [
            { sender: 'Surt', text: 'The flames burn with anticipation. The world will burn, as is its destiny.' },
            { sender: 'Sinmara', text: 'The forge is hot. Weapons of destruction are being shaped even now.' }
        ],
        helheim: [
            { sender: 'Hel', text: 'I watch from my throne. All who die come to me eventually.' },
            { sender: 'Garm', text: '*low growl* The guardian of the gate never sleeps.' }
        ]
    };
    
    // Convert sample messages to proper format
    Object.keys(sampleMessages).forEach(realm => {
        state.messages[realm] = sampleMessages[realm].map(msg => ({
            sender: msg.sender.toLowerCase().replace(/\s+/g, '-'),
            senderName: msg.sender,
            realm: realm,
            text: msg.text,
            runic: transliterateToRunic(msg.text),
            time: 'random', // Will be converted
            timestamp: Date.now() - Math.random() * 1000000000 // Random past
        }));
    });
    
    // Sort messages by timestamp
    Object.keys(state.messages).forEach(realm => {
        state.messages[realm].sort((a, b) => a.timestamp - b.timestamp);
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Runic toggle
    elements.runicToggle.addEventListener('click', toggleRunic);
    
    // Send message
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Realm selection via list
    elements.realmList.addEventListener('click', (e) => {
        const realmItem = e.target.closest('.realm-item');
        if (realmItem) {
            const realm = realmItem.dataset.realm;
            switchRealm(realm, true);
        }
    });
    
    // Realm selection via Yggdrasil tree
    elements.yggdrasilTree.addEventListener('click', (e) => {
        const node = e.target.closest('.realm-node');
        if (node) {
            const realm = node.dataset.realm;
            switchRealm(realm, true);
        }
    });
}

// ===== RUNIC TRANSLITERATION =====
function toggleRunic() {
    state.runicMode = !state.runicMode;
    updateRunicUI();
    updateMessagesDisplay();
}

function updateRunicUI() {
    const toggleLabel = elements.runicToggle.querySelector('.toggle-label');
    const toggleText = elements.runicToggle.querySelector('.toggle-text');
    const sendRunic = elements.sendBtn.querySelector('.send-runic');
    const sendText = elements.sendBtn.querySelector('.send-text');
    
    if (state.runicMode) {
        elements.runicToggle.classList.add('active');
        toggleLabel.style.display = 'inline';
        toggleText.textContent = 'Latin';
        sendRunic.style.display = 'inline';
        sendText.style.display = 'none';
    } else {
        elements.runicToggle.classList.remove('active');
        toggleLabel.style.display = 'none';
        toggleText.textContent = 'Runic';
        sendRunic.style.display = 'none';
        sendText.style.display = 'inline';
    }
}

function transliterateToRunic(text) {
    let result = '';
    let i = 0;
    const lowerText = text.toLowerCase();
    
    while (i < lowerText.length) {
        // Check for two-character runes first
        if (i < lowerText.length - 1) {
            const twoChar = lowerText.substr(i, 2);
            if (RUNIC_MAP[twoChar]) {
                result += RUNIC_MAP[twoChar];
                i += 2;
                continue;
            }
        }
        
        const char = lowerText[i];
        result += RUNIC_MAP[char] || char;
        i++;
    }
    
    return result;
}

// ===== REALM SWITCHING =====
function switchRealm(realm, animate = true) {
    if (realm === state.currentRealm && animate) return;
    
    const previousRealm = state.currentRealm;
    state.currentRealm = realm;
    
    // Update active states in UI
    document.querySelectorAll('.realm-item').forEach(item => {
        item.classList.toggle('active', item.dataset.realm === realm);
    });
    
    document.querySelectorAll('.branch').forEach(branch => {
        branch.classList.toggle('active', branch.dataset.realm === realm);
    });
    
    document.querySelectorAll('.realm-node').forEach(node => {
        node.classList.toggle('active', node.dataset.realm === realm);
    });
    
    // Update header
    elements.currentRealmBadge.textContent = REALMS[realm].name;
    elements.channelTitle.textContent = REALMS[realm].channel;
    
    // Update CSS custom properties for current realm
    document.documentElement.style.setProperty('--realm-color', REALMS[realm].color);
    document.documentElement.style.setProperty('--realm-secondary', REALMS[realm].secondary);
    
    // Bifrost shimmer effect
    if (animate) {
        triggerBifrostShimmer();
    }
    
    // Update messages display
    updateMessagesDisplay();
    
    // Scroll to bottom
    setTimeout(() => {
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    }, animate ? 600 : 100);
}

function triggerBifrostShimmer() {
    elements.bifrostOverlay.classList.remove('bifrost-active');
    void elements.bifrostOverlay.offsetWidth; // Trigger reflow
    elements.bifrostOverlay.classList.add('bifrost-active');
}

// ===== MESSAGES DISPLAY =====
function updateMessagesDisplay() {
    const realmMessages = state.messages[state.currentRealm] || [];
    
    // Clear current messages (except we'll preserve structure)
    elements.messagesContainer.innerHTML = '';
    
    // Render each message
    realmMessages.forEach(msg => {
        const messageEl = createMessageElement(msg);
        elements.messagesContainer.appendChild(messageEl);
    });
    
    // Update knotwork decorations based on realm
    document.querySelectorAll('.message-knotwork').forEach(knot => {
        knot.textContent = REALMS[state.currentRealm].knotwork;
    });
}

function createMessageElement(msg) {
    const template = document.getElementById('message-template');
    const clone = template.content.cloneNode(true);
    
    const group = clone.querySelector('.message-group');
    const bubble = clone.querySelector('.message-bubble');
    const senderName = clone.querySelector('.sender-name');
    const timeLabel = clone.querySelector('.message-time');
    const runicTime = clone.querySelector('.runic-time');
    const textContent = clone.querySelector('.text-content');
    const runicContent = clone.querySelector('.runic-content');
    
    // Set data attributes
    group.dataset.sender = msg.sender;
    group.dataset.realm = msg.realm;
    group.dataset.time = msg.time;
    
    // Set sender name with proper styling class
    bubble.classList.add(`${msg.sender}-message`);
    senderName.textContent = msg.senderName;
    
    // Set time
    const norseTime = getNorseTimeFromTimestamp(msg.timestamp);
    timeLabel.textContent = norseTime.label;
    runicTime.textContent = norseTime.runic;
    
    // Set content
    textContent.textContent = msg.text;
    runicContent.textContent = msg.runic;
    
    // Show/hide runic based on mode
    if (state.runicMode) {
        textContent.style.display = 'none';
        runicContent.style.display = 'block';
    } else {
        textContent.style.display = 'block';
        runicContent.style.display = 'none';
    }
    
    // Add realm-specific knotwork
    const knotwork = clone.querySelector('.message-knotwork');
    if (knotwork) {
        knotwork.innerHTML = `<span style="font-family: var(--font-runic); font-size: 1.5rem; color: var(--realm-color); opacity: 0.3;">${REALMS[msg.realm].knotwork}</span>`;
    }
    
    // Add subtle texture based on realm
    bubble.style.setProperty('--texture', REALMS[msg.realm].texture);
    
    return group;
}

function getNorseTimeFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hour = date.getHours();
    
    let timeKey;
    if (hour >= 0 && hour < 3) timeKey = 'night';
    else if (hour >= 3 && hour < 6) timeKey = 'dawn';
    else if (hour >= 6 && hour < 12) timeKey = 'morning';
    else if (hour >= 12 && hour < 15) timeKey = 'midday';
    else if (hour >= 15 && hour < 18) timeKey = 'afternoon';
    else if (hour >= 18 && hour < 21) timeKey = 'evening';
    else timeKey = 'night';
    
    return {
        label: NORSE_TIME_LABELS[timeKey],
        runic: NORSE_RUNIC_TIME[timeKey],
        key: timeKey
    };
}

// ===== SENDING MESSAGES =====
function sendMessage() {
    const text = elements.messageInput.value.trim();
    if (!text) return;
    
    const realm = state.currentRealm;
    const realmInfo = REALMS[realm];
    
    // Create message object
    const newMessage = {
        sender: state.currentUser.toLowerCase().replace(/\s+/g, '-'),
        senderName: state.currentUser,
        realm: realm,
        text: text,
        runic: transliterateToRunic(text),
        time: getNorseTime(new Date()),
        timestamp: Date.now()
    };
    
    // Add to state
    if (!state.messages[realm]) {
        state.messages[realm] = [];
    }
    state.messages[realm].push(newMessage);
    
    // Add to DOM
    const messageEl = createMessageElement(newMessage);
    elements.messagesContainer.appendChild(messageEl);
    
    // Clear input
    elements.messageInput.value = '';
    
    // Trigger raven flight animation
    animateRavenDelivery(messageEl);
    
    // Scroll to bottom
    setTimeout(() => {
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    }, 300);
    
    // Simulate response after delay (optional)
    simulateResponse(realm, newMessage);
}

function getNorseTime(date) {
    const hour = date.getHours();
    
    let timeKey;
    if (hour >= 0 && hour < 3) timeKey = 'night';
    else if (hour >= 3 && hour < 6) timeKey = 'dawn';
    else if (hour >= 6 && hour < 12) timeKey = 'morning';
    else if (hour >= 12 && hour < 15) timeKey = 'midday';
    else if (hour >= 15 && hour < 18) timeKey = 'afternoon';
    else if (hour >= 18 && hour < 21) timeKey = 'evening';
    else timeKey = 'night';
    
    return timeKey;
}

function animateRavenDelivery(targetElement) {
    // Get positions
    const inputRect = elements.messageInput.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    
    // Create raven element
    const raven = document.createElement('div');
    raven.classList.add('raven-flight');
    raven.style.setProperty('--tx', `${targetRect.left - inputRect.left + targetRect.width/2}px`);
    raven.style.setProperty('--ty', `${targetRect.top - inputRect.top - 100}px`);
    raven.style.left = `${inputRect.left + inputRect.width/2}px`;
    raven.style.top = `${inputRect.top}px`;
    
    elements.ravenFlightLayer.appendChild(raven);
    
    // Remove after animation
    setTimeout(() => {
        raven.remove();
    }, 2000);
}

// ===== SIMULATED RESPONSES =====
function simulateResponse(realm, originalMessage) {
    // 50% chance of response
    if (Math.random() > 0.5) return;
    
    const realmGods = REALMS[realm].gods;
    const randomGod = realmGods[Math.floor(Math.random() * realmGods.length)];
    
    // Generate appropriate response based on original sender
    const responses = {
        'Thor': [
            'The thunder shall answer any challenge!',
            'My hammer Mjolnir stands ready.',
            'Let them come to Asgard\'s defense.'
        ],
        'Loki': [
            'Heh, this should be amusing.',
            'I may have... acquired some information.',
            'Always a price, always a game.'
        ],
        'default': [
            'The winds carry news of this.',
            'I shall consider this matter.',
            'So it is spoken, so it shall be.',
            'The runes have foretold this moment.'
        ]
    };
    
    const godResponses = responses[originalMessage.senderName] || responses.default;
    const responseText = godResponses[Math.floor(Math.random() * godResponses.length)];
    
    setTimeout(() => {
        const response = {
            sender: randomGod.toLowerCase().replace(/\s+/g, '-'),
            senderName: randomGod,
            realm: realm,
            text: responseText,
            runic: transliterateToRunic(responseText),
            time: getNorseTime(new Date()),
            timestamp: Date.now()
        };
        
        state.messages[realm].push(response);
        
        // Only show if still on same realm
        if (state.currentRealm === realm) {
            const responseEl = createMessageElement(response);
            elements.messagesContainer.appendChild(responseEl);
            setTimeout(() => {
                elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
            }, 100);
        }
    }, 2000 + Math.random() * 3000);
}

// ===== TEXTURE EFFECTS =====
function applyRealmTexture(realm) {
    const textures = {
        divine: 'radial-gradient(circle at 30% 30%, rgba(255,215,0,0.05) 0%, transparent 50%)',
        earth: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139,69,19,0.03) 10px, rgba(139,69,19,0.03) 20px)',
        forest: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(34,139,34,0.02) 20px, rgba(34,139,34,0.02) 40px)',
        light: 'radial-gradient(ellipse at 70% 30%, rgba(255,105,180,0.05) 0%, transparent 60%)',
        stone: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(105,105,105,0.1) 2px, rgba(105,105,105,0.1) 4px)',
        ice: 'linear-gradient(180deg, transparent 0%, rgba(135,206,235,0.05) 50%, transparent 100%)',
        fire: 'repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,69,0,0.05) 5px, rgba(255,69,0,0.05) 10px)',
        death: 'radial-gradient(circle at 50% 50%, rgba(47,79,79,0.1) 0%, transparent 70%)'
    };
    
    return textures[realm] || textures.divine;
}

// ===== SCROLL HANDLING =====
let lastScrollTop = 0;
elements.messagesContainer.addEventListener('scroll', () => {
    const scrollTop = elements.messagesContainer.scrollTop;
    
    // Parallax effect for raven clip in footer
    const ravenClip = document.getElementById('raven-clip');
    if (ravenClip) {
        const scrollPercent = scrollTop / (elements.messagesContainer.scrollHeight - elements.messagesContainer.clientHeight);
        ravenClip.style.left = `${-30 + scrollPercent * 230}px`;
    }
    
    lastScrollTop = scrollTop;
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R for runic toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        toggleRunic();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        elements.messageInput.value = '';
    }
});

// ===== INITIALIZE ON DOM READY =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}