/* ============================================
   Huginn & Muninn — Odin's Raven Messaging
   Interactive JavaScript
   ============================================ */

// ===== RUNIC TRANSLITERATION MAP =====
const RUNIC_MAP = {
    // Latin to Elder Futhark
    'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ',
    'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ',
    'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ',
    's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᚲᛊ',
    'y': 'ᛃ', 'z': 'ᛉ', ' ': ' ', '.': '᛫', ',': '᛫', '?': '᛬',
    '!': '᛬', '-': '᛬', "'": '', '"': '', '(': '', ')': '',
    
    // Common words and phrases
    'the': 'ᚦᛖ', 'and': 'ᚨᚾᛞ', 'of': 'ᛟᚠ', 'to': 'ᛏᛟ', 'in': 'ᛁᚾ',
    'is': 'ᛁᛊ', 'that': 'ᚦᚨᛏ', 'it': 'ᛁᛏ', 'for': 'ᚠᛟᚱ', 'was': 'ᚹᚨᛊ',
    'on': 'ᛟᚾ', 'are': 'ᚨᚱᛖ', 'with': 'ᚹᛁᚦ', 'they': 'ᚦᛖᛁ', 'be': 'ᛒᛖ',
    'at': 'ᚨᛏ', 'one': 'ᛟᚾᛖ', 'have': 'ᚺᚨᚢᛖ', 'from': 'ᚠᚱᛟᛗ',
    'hello': 'ᚺᛖᛚᛚᛟ', 'hi': 'ᚺᛁ', 'hey': 'ᚺᛖᛁ', 'greetings': 'ᚷᚱᛖᛖᛏᛁᚾᚷᛊ',
    'raven': 'ᚱᚨᚢᛖᚾ', 'ravens': 'ᚱᚨᚢᛖᚾᛊ', 'world': 'ᚹᛟᚱᛚᛞ',
    'gods': 'ᚷᛟᛞᛊ', 'god': 'ᚷᛟᛞ', 'hammer': 'ᚺᚨᛗᛗᛖᚱ',
    'thunder': 'ᚦᚢᚾᛞᛖᚱ', 'storm': 'ᛊᛏᛟᚱᛗ', 'fire': 'ᚠᛁᚱᛖ',
    'ice': 'ᛁᚲᛖ', 'frost': 'ᚠᚱᛟᛊᛏ', 'war': 'ᚹᚨᚱ', 'peace': 'ᛈᛖᚨᚲᛖ',
    'message': 'ᛗᛖᛊᛊᚨᚷᛖ', 'send': 'ᛊᛖᚾᛞ', 'received': 'ᚱᛖᚲᛖᛁᚢᛖᛞ'
};

// Elder Futhark runes for random decoration
const ELDER_FUTHARK = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';

// ===== REALM DATA =====
const REALMS = {
    asgard: {
        name: 'Ásgarðr',
        desc: 'Hall of the Æsir — Where gods convene',
        rune: 'ᚨ',
        accentColor: '#ffd700',
        members: '12 Æsir Online',
        messages: [
            {
                sender: 'Odin Allfather',
                senderTitle: 'The High One',
                rune: 'ᛟ',
                text: 'Huginn, Muninn — tell me what they see in Miðgarðr. The world is growing darker.',
                time: 'Third Watch of the Night',
                senderId: 'odin',
                runic: 'ᚺᚢᚷᛁᚾᚾ ᛗᚢᚾᛁᚾᚾ ᛏᛖᛚᛚ ᛗᛖ ᚹᚺᚨᛏ ᛏᚺᛖ ᛋᛖᛖ ᛁᚾ ᛗᛁᛞᚷᚨᚱᛞᚱ. ᛏᚺᛖ ᚹᛟᚱᛚᛞ ᛁᛋ ᚷᚱᛟᚹᛁᚾᚷ ᛞᚨᚱᚲᛖᚱ.'
            },
            {
                sender: 'Thor',
                senderTitle: 'God of Thunder',
                rune: 'ᚦ',
                text: 'My hammer sings in the storm. The Jötnar stir from Jötunheimr. Let them come.',
                time: 'Just before Dawn',
                senderId: 'thor',
                runic: 'ᛗᛃ ᚺᚨᛗᛗᛖᚱ ᛋᛁᚾᚲᛋ ᛁᚾ ᛏᚺᛖ ᛋᛏᛟᚱᛗ. ᛏᚺᛖ ᛃᛟᛏᚾᚨᚱ ᛋᛏᛁᚱ ᚠᚱᛟᛗ ᛃᛟᛏᚢᚾᚺᛖᛁᛗᚱ. ᛚᛖᛏ ᛏᚺᛖᛗ ᚲᛟᛗᛖ.'
            }
        ]
    },
    midgard: {
        name: 'Miðgarðr',
        desc: 'World of Men — Where mortals dwell',
        rune: 'ᛗ',
        accentColor: '#4a7c59',
        members: '∞ Mortals Online',
        messages: [
            {
                sender: 'A Mortal',
                senderTitle: 'Midgardian',
                rune: 'ᛗ',
                text: 'The stars are wrong tonight. We look to the sky and see omens in the constellations.',
                time: 'Evening Star',
                senderId: 'mortal',
                runic: 'ᚦᛖ ᛋᛏᚨᚱᛊ ᚨᚱᛖ ᚹᚱᛟᚾᚷ ᛏᛟᚾᛁᚷᚺᛏ. ᚹᛖ ᛚᛟᛟᚲ ᛏᛟ ᛏᚺᛖ ᛋᚲᛁ ᚨᚾᛞ ᛋᛖᛖ ᛟᛗᛖᚾᛊ ᛁᚾ ᛏᚺᛖ ᚲᛟᚾᛊᛏᛖᛚᛚᚨᛏᛁᛟᚾᛊ.'
            }
        ]
    },
    jotunheim: {
        name: 'Jötunheimr',
        desc: 'Land of Giants — Where frost giants roam',
        rune: 'ᛃ',
        accentColor: '#5b7fa5',
        members: '24 Jötnar Online',
        messages: [
            {
                sender: 'Skadi',
                senderTitle: 'Goddess of Winter',
                rune: 'ᛊ',
                text: 'The mountains grow cold. We prepare for the final battle. Asgard will fall.',
                time: 'Midwinter Night',
                senderId: 'skadi',
                runic: 'ᚦᛖ ᛗᛟᚢᚾᛏᚨᛁᚾᛊ ᚷᚱᛟᚹ ᚲᛟᛚᛞ. ᚹᛖ ᛈᚱᛖᛈᚨᚱᛖ ᚠᛟᚱ ᛏᚺᛖ ᚠᛁᚾᚨᛚ ᛒᚨᛏᛏᛚᛖ. ᚨᛋᚷᚨᚱᛞ ᚹᛁᛚᛚ ᚠᚨᛚᛚ.'
            }
        ]
    },
    vanaheim: {
        name: 'Vanaheimr',
        desc: 'Land of Vanir — Where nature thrives',
        rune: 'ᚹ',
        accentColor: '#7b68ae',
        members: '8 Vanir Online',
        messages: []
    },
    alfheim: {
        name: 'Álfheimr',
        desc: 'Light Elves\' Home — Where light dances',
        rune: 'ᛚ',
        accentColor: '#c0c0d0',
        members: '16 Light Elves Online',
        messages: []
    },
    svartalfheim: {
        name: 'Svartálfheimr',
        desc: 'Dwarven Forges — Where weapons are born',
        rune: 'ᛋ',
        accentColor: '#cd853f',
        members: '10 Dwarves Online',
        messages: [
            {
                sender: 'Eitri',
                senderTitle: 'Master Smith',
                rune: 'ᛖ',
                text: 'The new weapons are ready. Enchanted steel that can pierce even Jötun hide.',
                time: 'Forge\'s Hour',
                senderId: 'eitri',
                runic: 'ᚦᛖ ᚾᛖᚹ ᚹᛖᚨᛈᛟᚾᛊ ᚨᚱᛖ ᚱᛖᚨᛞᛁ. ᛖᚾᚲᚺᚨᚾᛏᛖᛞ ᛋᛏᛖᛖᛚ ᛏᚺᚨᛏ ᚲᚨᚾ ᛈᛁᛖᚱᚲᛖ ᛖᚢᛖᚾ ᛃᛟᛏᚢᚾ ᚺᛁᛞᛖ.'
            }
        ]
    },
    niflheim: {
        name: 'Niflheimr',
        desc: 'Mist & Ice — The primordial world',
        rune: 'ᚾ',
        accentColor: '#b0c4de',
        members: '3 Entities Online',
        messages: []
    },
    muspelheim: {
        name: 'Múspellheimr',
        desc: 'Realm of Fire — Where Surtr reigns',
        rune: 'ᛗ',
        accentColor: '#ff4500',
        members: '5 Fire Giants Online',
        messages: [
            {
                sender: 'Surtr',
                senderTitle: 'Fire Giant King',
                rune: 'ᛊ',
                text: 'My flaming sword grows brighter. When I swing it, the Bifrost will shatter.',
                time: 'Eternal Burning',
                senderId: 'surtr',
                runic: 'ᛗᛁ ᚠᛚᚨᛗᛁᚾᚷ ᛋᚹᛟᚱᛞ ᚷᚱᛟᚹᛊ ᛒᚱᛁᚷᚺᛏᛖᚱ. ᚹᚺᛖᚾ ᛁ ᛋᚹᛁᛝ ᛁᛏ, ᛏᚺᛖ ᛒᛁᚠᚱᛟᛋᛏ ᚹᛁᛚᛚ ᛋᚺᚨᛏᛏᛖᚱ.'
            }
        ]
    },
    helheim: {
        name: 'Helheimr',
        desc: 'Realm of the Dead — Where Hel rules',
        rune: 'ᚺ',
        accentColor: '#6a7f8a',
        members: '∞ Spirits Online',
        messages: [
            {
                sender: 'Hel',
                senderTitle: 'Ruler of the Dead',
                rune: 'ᚺ',
                text: 'The dead grow restless. They whisper of Ragnarök. Even the deceased feel the coming end.',
                time: 'Timeless Hour',
                senderId: 'hel',
                runic: 'ᚦᛖ ᛞᛖᚨᛞ ᚷᚱᛟᚹ ᚱᛖᛋᛏᛚᛖᛊᛋ. ᛏᚺᛖᛁᚱ ᚹᚺᛁᛋᛈᛖᚱ ᛟᚠ ᚱᚨᚷᚾᚨᚱᛟᚲ. ᛖᚢᛖᚾ ᛏᚺᛖ ᛞᛖᚲᛖᚨᛋᛖᛞ ᚠᛖᛖᛚ ᛏᚺᛖ ᚲᛟᛗᛁᚾᚷ ᛖᚾᛞ.'
            }
        ]
    }
};

// ===== DOM ELEMENTS =====
const elements = {
    realmNav: document.getElementById('realmNav'),
    realmHeader: document.getElementById('realmHeader'),
    realmHeaderRune: document.getElementById('realmHeaderRune'),
    realmHeaderName: document.getElementById('realmHeaderName'),
    realmHeaderDesc: document.getElementById('realmHeaderDesc'),
    membersCount: document.getElementById('membersCount'),
    messagesContainer: document.getElementById('messagesContainer'),
    messagesScroll: document.getElementById('messagesScroll'),
    msgInput: document.getElementById('msgInput'),
    btnSend: document.getElementById('btnSend'),
    btnRunicToggle: document.getElementById('btnRunicToggle'),
    btnAttach: document.getElementById('btnAttach'),
    typingIndicator: document.getElementById('typingIndicator'),
    bifrostOverlay: document.getElementById('bifrostOverlay'),
    ravenFlightLayer: document.getElementById('ravenFlightLayer'),
    flyingRaven: document.getElementById('flyingRaven'),
    sidebar: document.getElementById('sidebar')
};

// ===== STATE =====
let currentRealm = 'asgard';
let isRunicMode = false;
let isSending = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Load initial realm
    loadRealm(currentRealm);
    
    // Simulate typing indicator occasionally
    setInterval(simulateTyping, 15000);
    
    // Scroll to bottom of messages
    scrollToBottom();
    
    // Auto-resize textarea
    autoResizeTextarea();
    
    // Add random ambient rune glow to avatars
    addAmbientEffects();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Realm navigation
    const realmNodes = document.querySelectorAll('.realm-node');
    realmNodes.forEach(node => {
        node.addEventListener('click', handleRealmSwitch);
    });
    
    // Send message
    elements.btnSend.addEventListener('click', handleSendMessage);
    
    // Send on Enter (Shift+Enter for new line)
    elements.msgInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Runic toggle
    elements.btnRunicToggle.addEventListener('click', toggleRunicMode);
    
    // Attach button (rune charm)
    elements.btnAttach.addEventListener('click', attachRuneCharm);
    
    // Input field focus
    elements.msgInput.addEventListener('focus', () => {
        elements.msgInput.parentElement.classList.add('focused');
    });
    
    elements.msgInput.addEventListener('blur', () => {
        elements.msgInput.parentElement.classList.remove('focused');
    });
    
    // Mobile sidebar toggle
    if (window.innerWidth <= 540) {
        setupMobileSidebar();
    }
}

// ===== REALM SWITCHING =====
function handleRealmSwitch(e) {
    const realmBranch = e.currentTarget.closest('.realm-branch');
    const realmId = realmBranch.dataset.realm;
    
    if (realmId === currentRealm) return;
    
    // Trigger Bifrost animation
    triggerBifrostAnimation();
    
    // Update active state
    document.querySelectorAll('.realm-branch').forEach(branch => {
        branch.classList.remove('active');
        branch.querySelector('.realm-node').setAttribute('aria-current', 'false');
    });
    
    realmBranch.classList.add('active');
    realmBranch.querySelector('.realm-node').setAttribute('aria-current', 'true');
    
    // Clear unread badge
    const unreadBadge = realmBranch.querySelector('.node-unread');
    if (unreadBadge) {
        unreadBadge.style.display = 'none';
    }
    
    // Load new realm after animation
    setTimeout(() => {
        loadRealm(realmId);
        currentRealm = realmId;
    }, 600);
}

function loadRealm(realmId) {
    const realm = REALMS[realmId];
    if (!realm) return;
    
    // Update header
    elements.realmHeaderRune.textContent = realm.rune;
    elements.realmHeaderName.textContent = realm.name;
    elements.realmHeaderDesc.textContent = realm.desc;
    elements.membersCount.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
            <circle cx="8" cy="5" r="3"/>
            <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
        </svg>
        ${realm.members}
    `;
    
    // Update CSS variable for accent color
    document.documentElement.style.setProperty('--current-realm-accent', realm.accentColor);
    
    // Clear and load messages
    elements.messagesScroll.innerHTML = '';
    
    // Add system divider
    const divider = document.createElement('div');
    divider.className = 'system-divider';
    divider.innerHTML = `
        <span class="divider-rune">ᚠ</span>
        <span class="divider-line"></span>
        <span class="divider-text">Ravens have gathered in ${realm.name}</span>
        <span class="divider-line"></span>
        <span class="divider-rune">ᚠ</span>
    `;
    elements.messagesScroll.appendChild(divider);
    
    // Add messages
    if (realm.messages.length > 0) {
        realm.messages.forEach(msg => {
            addMessageToDOM(msg);
        });
    } else {
        // Empty realm placeholder
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'message received';
        emptyMsg.innerHTML = `
            <div class="msg-avatar">
                <span class="avatar-rune">${realm.rune}</span>
                <span class="avatar-glow"></span>
            </div>
            <div class="msg-content">
                <div class="msg-sender-row">
                    <span class="msg-sender">${realm.name} whispers</span>
                    <span class="msg-sender-title">Silence fills this realm</span>
                </div>
                <div class="msg-tablet">
                    <span class="tablet-rivet rivet-tl"></span>
                    <span class="tablet-rivet rivet-tr"></span>
                    <span class="tablet-rivet rivet-bl"></span>
                    <span class="tablet-rivet rivet-br"></span>
                    <div class="tablet-knotwork top"></div>
                    <p class="msg-text">The ravens have not yet brought word to this realm. Be the first to send a message.</p>
                    <div class="tablet-knotwork bottom"></div>
                </div>
            </div>
        `;
        elements.messagesScroll.appendChild(emptyMsg);
    }
    
    // Scroll to bottom
    setTimeout(scrollToBottom, 100);
}

// ===== MESSAGE HANDLING =====
function handleSendMessage() {
    const text = elements.msgInput.value.trim();
    if (!text || isSending) return;
    
    isSending = true;
    
    // Get runic text if in runic mode
    let runicText = '';
    if (isRunicMode) {
        runicText = text;
    } else {
        runicText = transliterateToRunic(text);
    }
    
    // Create message object
    const message = {
        sender: 'You',
        senderTitle: 'Messenger',
        rune: 'ᛃ',
        text: isRunicMode ? transliterateToLatin(text) : text,
        time: getCurrentTime(),
        senderId: 'user',
        runic: runicText
    };
    
    // Add to current realm's messages
    REALMS[currentRealm].messages.push(message);
    
    // Trigger raven flight animation
    triggerRavenFlight();
    
    // Add message to DOM
    setTimeout(() => {
        addMessageToDOM(message);
        scrollToBottom();
        
        // Clear input
        elements.msgInput.value = '';
        elements.msgInput.style.height = 'auto';
        
        // Simulate response after delay
        setTimeout(simulateResponse, 2000 + Math.random() * 3000);
        
        isSending = false;
    }, 800);
}

function addMessageToDOM(message) {
    const messageElement = document.createElement('article');
    messageElement.className = `message ${message.senderId === 'user' ? 'sent' : 'received'}`;
    messageElement.dataset.sender = message.senderId;
    
    messageElement.innerHTML = `
        <div class="msg-avatar">
            <span class="avatar-rune">${message.rune}</span>
            <span class="avatar-glow"></span>
        </div>
        <div class="msg-content">
            <div class="msg-sender-row">
                <span class="msg-sender">${message.sender}</span>
                <span class="msg-sender-title">${message.senderTitle}</span>
            </div>
            <div class="msg-tablet">
                <span class="tablet-rivet rivet-tl"></span>
                <span class="tablet-rivet rivet-tr"></span>
                <span class="tablet-rivet rivet-bl"></span>
                <span class="tablet-rivet rivet-br"></span>
                <div class="tablet-knotwork top"></div>
                <p class="msg-text" data-runes="${message.runic}">${message.text}</p>
                <div class="tablet-knotwork bottom"></div>
            </div>
            <div class="msg-meta">
                <span class="msg-time">${message.time}</span>
                <span class="msg-status">⟐ Raven Delivered</span>
            </div>
        </div>
    `;
    
    // Insert before typing indicator if it exists, otherwise append
    if (elements.typingIndicator.parentNode === elements.messagesScroll) {
        elements.messagesScroll.insertBefore(messageElement, elements.typingIndicator);
    } else {
        elements.messagesScroll.appendChild(messageElement);
    }
}

// ===== RUNIC TRANSLITERATION =====
function transliterateToRunic(text) {
    if (!text) return '';
    
    let result = '';
    const lowerText = text.toLowerCase();
    
    // Try to match whole words first
    const words = lowerText.split(/\s+/);
    words.forEach((word, i) => {
        if (i > 0) result += ' ';
        
        // Check for whole word matches
        let matched = false;
        for (const [latin, rune] of Object.entries(RUNIC_MAP)) {
            if (word === latin) {
                result += rune;
                matched = true;
                break;
            }
        }
        
        // If no whole word match, transliterate character by character
        if (!matched) {
            for (const char of word) {
                result += RUNIC_MAP[char] || char;
            }
        }
    });
    
    return result;
}

function transliterateToLatin(runicText) {
    if (!runicText) return '';
    
    // Create reverse map
    const reverseMap = {};
    for (const [latin, rune] of Object.entries(RUNIC_MAP)) {
        if (rune && rune !== ' ') {
            reverseMap[rune] = latin;
        }
    }
    
    let result = '';
    for (const char of runicText) {
        result += reverseMap[char] || char;
    }
    
    // Capitalize first letter of sentences
    result = result.replace(/(^\w|\.\s+\w)/g, match => match.toUpperCase());
    
    return result;
}

function toggleRunicMode() {
    isRunicMode = !isRunicMode;
    
    // Update button state
    elements.btnRunicToggle.classList.toggle('active', isRunicMode);
    
    // Update placeholder
    elements.msgInput.placeholder = isRunicMode 
        ? 'ᚺᛖᛚᛚᛟ ᛏᛟ ᛏᚺᛖ ᚷᛟᛞᛊ...' 
        : 'Inscribe your message upon the wood...';
    
    // Toggle input styling
    elements.msgInput.classList.toggle('runic-mode', isRunicMode);
    
    // Convert existing text if any
    if (elements.msgInput.value) {
        if (isRunicMode) {
            elements.msgInput.value = transliterateToRunic(elements.msgInput.value);
        } else {
            elements.msgInput.value = transliterateToLatin(elements.msgInput.value);
        }
    }
    
    // Update all message texts in view
    const messageTexts = document.querySelectorAll('.msg-text');
    messageTexts.forEach(textElement => {
        const originalText = textElement.textContent;
        const runicText = textElement.dataset.runes;
        
        if (isRunicMode) {
            textElement.classList.add('runic-view');
            if (runicText) {
                textElement.textContent = runicText;
            }
        } else {
            textElement.classList.remove('runic-view');
            // Restore original text (we'd need to store it, but for demo we'll transliterate back)
            if (runicText) {
                textElement.textContent = transliterateToLatin(runicText);
            }
        }
    });
}

// ===== ANIMATIONS & EFFECTS =====
function triggerBifrostAnimation() {
    elements.bifrostOverlay.classList.add('active');
    
    // Play sound effect (simulated with Web Audio API)
    playBifrostSound();
    
    setTimeout(() => {
        elements.bifrostOverlay.classList.remove('active');
    }, 1200);
}

function triggerRavenFlight() {
    const raven = elements.flyingRaven;
    
    // Reset animation
    raven.classList.remove('active');
    raven.style.animation = 'none';
    
    // Trigger reflow
    void raven.offsetWidth;
    
    // Start animation
    raven.style.animation = '';
    raven.classList.add('active');
    
    // Remove class after animation
    setTimeout(() => {
        raven.classList.remove('active');
    }, 2000);
}

function simulateTyping() {
    // Only show typing indicator sometimes
    if (Math.random() > 0.3) return;
    
    const gods = ['Odin', 'Thor', 'Freyja', 'Loki', 'Heimdallr', 'Hel', 'Surtr'];
    const randomGod = gods[Math.floor(Math.random() * gods.length)];
    
    // Update typing indicator
    const typingAvatar = elements.typingIndicator.querySelector('.avatar-rune');
    const typingText = elements.typingIndicator.querySelector('.typing-text');
    
    // Set appropriate rune based on god
    const godRunes = {
        'Odin': 'ᛟ', 'Thor': 'ᚦ', 'Freyja': 'ᚠ', 'Loki': 'ᛚ',
        'Heimdallr': 'ᚺ', 'Hel': 'ᚺ', 'Surtr': 'ᛊ'
    };
    
    typingAvatar.textContent = godRunes[randomGod] || 'ᚺ';
    typingText.textContent = `${randomGod} is composing...`;
    
    // Show typing indicator
    elements.typingIndicator.style.display = 'flex';
    
    // Hide after delay
    setTimeout(() => {
        elements.typingIndicator.style.display = 'none';
        
        // Sometimes send a message
        if (Math.random() > 0.5) {
            simulateGodMessage(randomGod);
        }
    }, 3000 + Math.random() * 4000);
}

function simulateGodMessage(godName) {
    const messages = {
        'Odin': [
            'The ravens speak of change in Midgard.',
            'I have seen the threads of fate. Ragnarök approaches.',
            'Gather the Æsir. We must prepare.'
        ],
        'Thor': [
            'My hammer yearns for battle.',
            'The Jötnar grow bold. They will regret it.',
            'Thunder rolls across the realms.'
        ],
        'Freyja': [
            'The Vanir stand with the Æsir.',
            'I have seen beauty even in these dark times.',
            'The magic of the old ways still holds.'
        ],
        'Loki': [
            'Why so serious, everyone?',
            'Perhaps a little chaos would liven things up.',
            'I know secrets that would make Odin weep.'
        ],
        'Heimdallr': [
            'The Bifrost is secure. For now.',
            'I see all, from Midgard to Asgard.',
            'None pass the rainbow bridge without my knowledge.'
        ],
        'Hel': [
            'The dead whisper your names.',
            'All must come to me eventually.',
            'Even gods die. Remember that.'
        ],
        'Surtr': [
            'My fire burns eternal.',
            'When I bring my sword down, all will burn.',
            'The end of all things begins with me.'
        ]
    };
    
    const godMessages = messages[godName] || messages['Loki'];
    const randomMessage = godMessages[Math.floor(Math.random() * godMessages.length)];
    
    const godData = {
        'Odin': { title: 'The High One', rune: 'ᛟ', id: 'odin' },
        'Thor': { title: 'God of Thunder', rune: 'ᚦ', id: 'thor' },
        'Freyja': { title: 'Lady of the Vanir', rune: 'ᚠ', id: 'freyja' },
        'Loki': { title: 'The Trickster', rune: 'ᛚ', id: 'loki' },
        'Heimdallr': { title: 'The White God, Guardian', rune: 'ᚺ', id: 'heimdallr' },
        'Hel': { title: 'Ruler of the Dead', rune: 'ᚺ', id: 'hel' },
        'Surtr': { title: 'Fire Giant King', rune: 'ᛊ', id: 'surtr' }
    };
    
    const god = godData[godName] || godData['Loki'];
    
    const message = {
        sender: godName,
        senderTitle: god.title,
        rune: god.rune,
        text: randomMessage,
        time: getCurrentTime(),
        senderId: god.id,
        runic: transliterateToRunic(randomMessage)
    };
    
    // Add to current realm
    REALMS[currentRealm].messages.push(message);
    addMessageToDOM(message);
    scrollToBottom();
}

function simulateResponse() {
    // Simulate a response from the current realm's inhabitants
    if (Math.random() > 0.7) {
        simulateTyping();
    }
}

// ===== UTILITIES =====
function scrollToBottom() {
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
}

function getCurrentTime() {
    const hours = ['First Watch', 'Second Watch', 'Third Watch', 'Fourth Watch', 
                   'Dawn', 'Morning', 'Midday', 'Afternoon', 'Evening', 'Night'];
    const randomTime = hours[Math.floor(Math.random() * hours.length)];
    return randomTime;
}

function autoResizeTextarea() {
    elements.msgInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

function attachRuneCharm() {
    // Insert a random rune into the input
    const randomRune = ELDER_FUTHARK[Math.floor(Math.random() * ELDER_FUTHARK.length)];
    const input = elements.msgInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    
    input.value = text.substring(0, start) + randomRune + text.substring(end);
    input.selectionStart = input.selectionEnd = start + 1;
    input.focus();
}

function playBifrostSound() {
    // Create a shimmering sound effect using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillator for the main tone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
        
        // Add a second oscillator for shimmer
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(1600, audioContext.currentTime + 0.1);
        oscillator2.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.3);
        
        gainNode2.gain.setValueAtTime(0.05, audioContext.currentTime + 0.1);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.start(audioContext.currentTime + 0.1);
        oscillator2.stop(audioContext.currentTime + 0.6);
    } catch (e) {
        // Audio not supported, fail silently
        console.log('Audio not supported');
    }
}

function addAmbientEffects() {
    // Add random glow pulses to avatars
    const avatars = document.querySelectorAll('.msg-avatar');
    
    setInterval(() => {
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        if (randomAvatar) {
            const glow = randomAvatar.querySelector('.avatar-glow');
            if (glow) {
                glow.style.animation = 'none';
                void glow.offsetWidth;
                glow.style.animation = 'avatarPulse 2s ease-in-out';
            }
        }
    }, 5000);
}

// ===== MOBILE SIDEBAR =====
function setupMobileSidebar() {
    // Create hamburger menu for mobile
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '☰';
    menuBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        background: var(--iron-dark);
        border: 2px solid var(--iron-light);
        color: var(--text-primary);
        width: 40px;
        height: 40px;
        border-radius: 6px;
        font-size: 1.2rem;
        cursor: pointer;
        display: none;
    `;
    
    document.body.appendChild(menuBtn);
    
    // Show on mobile
    if (window.innerWidth <= 540) {
        menuBtn.style.display = 'flex';
        menuBtn.style.alignItems = 'center';
        menuBtn.style.justifyContent = 'center';
    }
    
    menuBtn.addEventListener('click', () => {
        elements.sidebar.classList.toggle('open');
        menuBtn.textContent = elements.sidebar.classList.contains('open') ? '✕' : '☰';
    });
    
    // Close sidebar when clicking on a realm
    document.querySelectorAll('.realm-node').forEach(node => {
        node.addEventListener('click', () => {
            if (window.innerWidth <= 540) {
                elements.sidebar.classList.remove('open');
                menuBtn.textContent = '☰';
            }
        });
    });
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        transliterateToRunic,
        transliterateToLatin,
        REALMS,
        RUNIC_MAP
    };
}