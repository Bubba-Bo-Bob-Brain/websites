// --- Runic Dictionary for Transliteration ---
const runicMap = {
    'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛇ', 'f': 'ᚠ', 'g': 'ᚷ',
    'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ',
    'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ',
    'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᛊ', 'y': 'ᛁ', 'z': 'ᛉ', ' ': ' ',
    'A': 'ᚨ', 'B': 'ᛒ', 'C': 'ᚲ', 'D': 'ᛞ', 'E': 'ᛇ', 'F': 'ᚠ', 'G': 'ᚷ',
    'H': 'ᚺ', 'I': 'ᛁ', 'J': 'ᛃ', 'K': 'ᚲ', 'L': 'ᛚ', 'M': 'ᛗ', 'N': 'ᚾ',
    'O': 'ᛟ', 'P': 'ᛈ', 'Q': 'ᚲ', 'R': 'ᚱ', 'S': 'ᛊ', 'T': 'ᛏ', 'U': 'ᚢ',
    'V': 'ᚹ', 'W': 'ᚹ', 'X': 'ᛊ', 'Y': 'ᛁ', 'Z': 'ᛉ'
};

// --- Realm Configuration ---
const realmData = {
    asgard: { name: 'Asgard', rune: 'ᚨ', status: 'Bifrost Connection Stable', bg: 'radial-gradient(circle at top, #1c110b 0%, #080503 100%)' },
    midgard: { name: 'Midgard', rune: 'ᛗ', status: 'Mortal Realm Shield Active', bg: 'radial-gradient(circle at top, #0f1c11 0%, #030805 100%)' },
    alfheim: { name: 'Alfheim', rune: 'ᚨ', status: 'Luminous Aura Radiating', bg: 'radial-gradient(circle at top, #11222b 0%, #03080c 100%)' },
    jotunheim: { name: 'Jotunheim', rune: 'ᛏ', status: 'Frost Winds Howling', bg: 'radial-gradient(circle at top, #141f2b 0%, #03070d 100%)' },
    muspelheim: { name: 'Muspelheim', rune: 'ᛗ', status: 'Surtr Fires Kindled', bg: 'radial-gradient(circle at top, #2b110a 0%, #0d0301 100%)' },
    niflheim: { name: 'Niflheim', rune: 'ᚾ', status: 'Misty Fogs Consuming', bg: 'radial-gradient(circle at top, #182324 0%, #050a0a 100%)' },
    helheim: { name: 'Helheim', rune: 'ᚼ', status: 'Garmr Watchful Guard', bg: 'radial-gradient(circle at top, #17111a 0%, #060308 100%)' }
};

// --- Pre-populated Messages (Mythic Database) ---
const realmMessages = {
    asgard: [
        { sender: 'Odin', avatar: 'avatar-odin', text: 'Hearken, gods of the high halls. The ravens fly east today.', runicText: 'ᚺᛇᚨᚱᚲᛇᚾ, ᚷᛟᛞᛊ ᛟᚠ ᛏᚺᛇ ᚺᛁᚷᚺ ᚺᚨᛚᛚᛊ. ᛏᚺᛇ ᚱᚨᚹᛇᚾᛊ ᚠᛚᛁ ᛇᚨᛊᛏ ᛏᛟᛞᚨᛁ.', time: 'Dawn' },
        { sender: 'Thor', avatar: 'avatar-thor', text: 'My hammer hungers for the giants of Jotunheim. Let us ride!', runicText: 'ᛗᛁ ᚺᚨᛗᛗᛇᚱ ᚺᚢᚾᚷᛇᚱᛊ ᚠᛟᚱ ᛏᚺᛇ ᚷᛁᚨᚾᛏᛊ ᛟᚠ ᛃᛟᛏᚢᚾᚺᛇᛁᛗ. ᛚᛏ ᚢᛊ ᚱᛁᛞᛇ!', time: 'Noon' }
    ],
    midgard: [
        { sender: 'Freya', avatar: 'avatar-freya', text: 'The fields of men grow cold. We must bless their harvest.', runicText: 'ᛏᚺᛇ ᚠᛁᛇᛚᛞᛊ ᛟᚠ ᛗᛇᚾ ᚷᚱᛟᚹ ᚲᛟᛚᛞ. ᚹᛇ ᛗᚢᛊᛏ ᛒᛚᛇᛊᛊ ᛏᚺᛇᛁᚱ ᚺᚨᚱᚹᛇᛊᛏ.', time: 'Evening' }
    ],
    alfheim: [
        { sender: 'Freya', avatar: 'avatar-freya', text: 'The light of Alfheim remains pure, untainted by Muspel fire.', runicText: 'ᛏᚺᛇ ᛚᛁᚷᚺᛏ ᛟᚠ ᚨᛚᚠᚺᛇᛁᛗ ᚱᛇᛗᚨᛁᚾᛊ ᛈᚢᚱᛇ, ᚢᚾᛏᚨᛁᚾᛏᛇᛞ ᛒᛁ ᛗᚢᛊᛈᛇᛚ ᚠᛁᚱᛇ.', time: 'Dusk' }
    ],
    jotunheim: [
        { sender: 'Loki', avatar: 'avatar-loki', text: 'I have made a wager with the frost lords. Do not interfere.', runicText: 'ᛁ ᚺᚨᚹᛇ ᛗᚨᛞᛇ ᚨ ᚹᚨᚷᛇᚱ ᚹᛁᛏᚺ ᛏᚺᛇ ᚠᚱᛟᛊᛏ ᛚᛟᚱᛞᛊ. ᛞᛟ ᚾᛟᛏ ᛁᚾᛏᛇᚱᚠᛇᚱᛇ.', time: 'Midnight' }
    ],
    muspelheim: [
        { sender: 'Loki', avatar: 'avatar-loki', text: 'Surtr is sharpening his blade. The sparks can be seen from here.', runicText: 'ᛊᚢᚱᛏᚱ ᛁᛊ ᛊᚺᚨᚱᛈᛇᚾᛁᚾᚷ ᚺᛁᛊ ᛒᛚᚨᛞᛇ. ᛏᚺᛇ ᛊᛈᚨᚱᚲᛊ ᚲᚨᚾ ᛒᛇ ᛊᛇᛇᚾ ᚠᚱᛟᛗ ᚺᛇᚱᛇ.', time: 'Witching Hour' }
    ],
    niflheim: [
        { sender: 'Odin', avatar: 'avatar-odin', text: 'The frozen mists whisper secrets of the oldest days.', runicText: 'ᛏᚺᛇ ᚠᚱᛟᛉᛇᚾ ᛗᛁᛊᛏᛊ ᚹᛁᛊᛈᛇᚱ ᛊᛇᚲᚱᛇᛏᛊ ᛟᚠ ᛏᚺᛇ ᛟᛚᛞᛇᛊᛏ ᛞᚨᛁᛊ.', time: 'Dawn' }
    ],
    helheim: [
        { sender: 'Hel', avatar: 'avatar-hel', text: 'None escape my halls. Tell the All-Father his son remains here.', runicText: 'ᚾᛟᚾᛇ ᛇᛊᚲᚨᛈᛇ ᛗᛁ ᚺᚨᛚᛚᛊ. ᛏᛇᛚᛚ ᛏᚺᛇ ᚨᛚᛚ-ᚠᚨᚺᛇᚱ ᚺᛁᛊ ᛊᛟᚾ ᚱᛇᛗᚨᛁᚾᛊ ᚺᛇᚱᛇ.', time: 'Endless Night' }
    ]
};

// --- App State ---
let currentRealm = 'asgard';
let runicTransliterationActive = false;

// --- DOM Selections ---
const messagesContainer = document.getElementById('messagesContainer');
const messageFeed = document.getElementById('messageFeed');
const scribeForm = document.getElementById('scribeForm');
const messageInput = document.getElementById('messageInput');
const godSelector = document.getElementById('godSelector');
const runicToggle = document.getElementById('runicToggle');
const bifrostOverlay = document.getElementById('bifrostOverlay');
const flightCorridor = document.getElementById('flightCorridor');
const activeRealmRune = document.getElementById('activeRealmRune');
const activeRealmName = document.getElementById('activeRealmName');
const activeRealmStatus = document.getElementById('activeRealmStatus');
const realmNodes = document.querySelectorAll('.realm-node');
const realmItems = document.querySelectorAll('.realm-item');
const quickRuneKeys = document.querySelectorAll('.rune-key');
const chatArea = document.querySelector('.hearth-chat-area');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadRealmMessages(currentRealm);
    setupEventListeners();
});

// --- Core Functions ---
function loadRealmMessages(realmKey) {
    messageFeed.innerHTML = '';
    const messages = realmMessages[realmKey] || [];
    
    messages.forEach(msg => {
        const bubble = createMessageBubble(msg);
        messageFeed.appendChild(bubble);
    });
    
    scrollToBottom();
}

function createMessageBubble(msg) {
    const bubble = document.createElement('div');
    const isOutgoing = msg.sender.toLowerCase() === godSelector.value.toLowerCase();
    
    bubble.className = `message-bubble ${isOutgoing ? 'outgoing' : ''}`;
    
    const displayBody = runicTransliterationActive ? msg.runicText : msg.text;
    const bodyClass = runicTransliterationActive ? 'msg-body runic' : 'msg-body';

    bubble.innerHTML = `
        <div class="msg-avatar ${msg.avatar}"></div>
        <div class="msg-content-wrapper">
            <div class="msg-meta">
                <span class="msg-sender">${msg.sender}</span>
                <span class="msg-time">${msg.time}</span>
            </div>
            <p class="${bodyClass}">${displayBody}</p>
        </div>
    `;
    
    return bubble;
}

function transliterateToRunic(text) {
    return text.split('').map(char => runicMap[char] || char).join('');
}

function switchRealm(realmKey) {
    if (realmKey === currentRealm) return;
    
    currentRealm = realmKey;
    const realmInfo = realmData[realmKey];
    
    // Trigger Bifrost Visual Shimmer
    bifrostOverlay.classList.add('shimmering');
    setTimeout(() => {
        bifrostOverlay.classList.remove('shimmering');
    }, 1500);

    // Update Header Badge Info
    activeRealmRune.textContent = realmInfo.rune;
    activeRealmName.textContent = realmInfo.name;
    activeRealmStatus.textContent = realmInfo.status;
    
    // Smooth Transition of Chat Hearth Background Theme
    chatArea.style.backgroundImage = realmInfo.bg;
    
    // Sync Navigation Nodes and Items
    realmNodes.forEach(node => {
        node.classList.toggle('active', node.dataset.realm === realmKey);
    });
    
    realmItems.forEach(item => {
        item.classList.toggle('active', item.dataset.realm === realmKey);
    });
    
    // Load Corresponding Realm Feed
    loadRealmMessages(realmKey);
}

function triggerRavenFlightAnimation() {
    const raven = document.createElement('div');
    raven.className = 'flying-raven';
    flightCorridor.appendChild(raven);
    
    setTimeout(() => {
        raven.remove();
    }, 3000);
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// --- Event Listeners ---
function setupEventListeners() {
    // Scribe Form Submit
    scribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (!text) return;
        
        const sender = godSelector.options[godSelector.selectedIndex].text;
        const godKey = godSelector.value;
        const time = 'Just Now';
        const runicText = transliterateToRunic(text);
        
        const newMsg = {
            sender,
            avatar: `avatar-${godKey}`,
            text,
            runicText,
            time
        };
        
        // Save to temporary session database
        if (!realmMessages[currentRealm]) {
            realmMessages[currentRealm] = [];
        }
        realmMessages[currentRealm].push(newMsg);
        
        // Append & Animate
        const bubble = createMessageBubble(newMsg);
        messageFeed.appendChild(bubble);
        triggerRavenFlightAnimation();
        scrollToBottom();
        
        // Clear input
        messageInput.value = '';
    });

    // Runic Transliteration Toggle
    runicToggle.addEventListener('click', () => {
        runicTransliterationActive = !runicTransliterationActive;
        runicToggle.classList.toggle('active', runicTransliterationActive);
        
        // Rerender messages
        loadRealmMessages(currentRealm);
    });

    // Realm Selection (Yggdrasil Nodes)
    realmNodes.forEach(node => {
        node.addEventListener('click', () => {
            switchRealm(node.dataset.realm);
        });
    });

    // Realm Selection (List Items)
    realmItems.forEach(item => {
        item.addEventListener('click', () => {
            switchRealm(item.dataset.realm);
        });
    });

    // Quick Rune Input Keys
    quickRuneKeys.forEach(key => {
        key.addEventListener('click', () => {
            const rune = key.dataset.rune;
            messageInput.value += rune;
            messageInput.focus();
        });
    });
}