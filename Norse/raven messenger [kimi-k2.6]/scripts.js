// ============================================
// HUGINN & MUNINN - The Allfather's Messenger
// JavaScript: Interactivity & Immersion
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// --- Application State ---
const AppState = {
    currentRealm: 'asgard',
    isRunicMode: false,
    activeMessages: new Map(),
    typingTimeout: null,
    ravenAnimationInProgress: false
};

// --- Realm Data ---
const Realms = {
    asgard: {
        name: 'Asgard',
        icon: '⚡',
        mood: 'The Golden Hall echoes with mead songs',
        color: '#ffd700',
        lore: [
            'Asgard is encircled by the incomplete wall built by the giant mason, with the Bifrost bridge burning at its gate.',
            'Valhalla\'s hall has 540 doors, through which 800 warriors can walk abreast at once.',
            'The golden apples of Iðunn grant eternal youth to those who consume them.'
        ]
    },
    midgard: {
        name: 'Midgard',
        icon: '🌍',
        mood: 'Serpents coil beneath the World Tree',
        color: '#87ceeb',
        lore: [
            'Midgard was created from the flesh of Ymir, the first giant.',
            'The world is encircled by the Midgard Serpent, Jörmungandr.',
            'Humans dwell here, protected by the fortifications built by the gods.'
        ]
    },
    jotunheim: {
        name: 'Jötunheim',
        icon: '❄️',
        mood: 'Frost giants sharpen their axes in the mist',
        color: '#b0e0e6',
        lore: [
            'Jötunheim is the homeland of the jötnar, the giants of Norse mythology.',
            'The realm is characterized by ancient forests and frozen mountains.',
            'The giant Útgarða-Loki rules the stronghold of Útgarðr.'
        ]
    },
    alfheim: {
        name: 'Álfheim',
        icon: '✨',
        mood: 'Light elves weave starlight into tapestries',
        color: '#f0e68c',
        lore: [
            'Álfheim is home to the light elves, beings of dazzling beauty.',
            'The Vanir god Freyr is said to have been given Álfheim as a tooth-gift.',
            'The light elves are renowned for their skill in magic and crafts.'
        ]
    },
    svartalfheim: {
        name: 'Svartálfaheim',
        icon: '🔥',
        mood: 'Forges glow with eternal ember-heat',
        color: '#ff6347',
        lore: [
            'Svartálfaheim is the realm of the dwarves and dark elves.',
            'The master craftsmen of this realm forged Thor\'s mighty hammer, Mjölnir.',
            'The dwarves Brokkr and Sindri created many of the gods\' greatest treasures here.'
        ]
    },
    vanaheim: {
        name: 'Vanaheim',
        icon: '🌿',
        mood: 'Wild magic stirs in ancient groves',
        color: '#90ee90',
        lore: [
            'Vanaheim is home to the Vanir, a tribe of gods associated with fertility and nature.',
            'The Vanir once waged war against the Æsir before a peace treaty was brokered.',
            'The god Njörðr and his children Freyr and Freyja originated from this realm.'
        ]
    },
    muspelheim: {
        name: 'Muspelheim',
        icon: '🔥',
        mood: 'Surtr\'s flames lick at the boundaries',
        color: '#ff4500',
        lore: [
            'Muspelheim is the realm of fire, one of the primordial realms in Norse cosmology.',
            'The fire giant Surtr dwells here, wielding a flaming sword.',
            'At Ragnarök, Surtr will lead the sons of Muspelheim against the gods.'
        ]
    },
    niflheim: {
        name: 'Niflheim',
        icon: '🌫️',
        mood: 'Eternal mist obscures the frozen rivers',
        color: '#778899',
        lore: [
            'Niflheim is the realm of ice, mist, and cold, one of the primordial realms.',
            'The river Élivágar flows here, from which the proto-giant Ymir emerged.',
            'The primordial well Hvergelmir, source of all rivers, is located in Niflheim.'
        ]
    },
    helheim: {
        name: 'Helheim',
        icon: '💀',
        mood: 'Hel receives the silent multitudes',
        color: '#4b0082',
        lore: [
            'Helheim is ruled by Hel, daughter of Loki and the giantess Angrboda.',
            'Those who die of old age or sickness come here, while warriors go to Valhalla.',
            'The hall has a threshold called Strivðr, a bed named Kör, and hangings called Blíkjandabölkr.'
        ]
    }
};

// --- Sender Data ---
const Senders = {
    odin: {
        name: 'Odin Allfather',
        rune: 'ᚮ',
        avatarClass: 'odin-avatar',
        glowClass: 'odin-glow',
        presence: 'active'
    },
    thor: {
        name: 'Thor Odinson',
        rune: 'ᚦ',
        avatarClass: 'thor-avatar',
        glowClass: 'thor-glow',
        presence: 'active'
    },
    loki: {
        name: 'Loki Laufeyson',
        rune: 'ᛚ',
        avatarClass: 'loki-avatar',
        glowClass: 'loki-glow',
        presence: 'active'
    },
    freyja: {
        name: 'Freyja Vanadís',
        rune: 'ᚠ',
        avatarClass: 'freyja-avatar',
        glowClass: 'freyja-glow',
        presence: 'active'
    },
    tyr: {
        name: 'Týr',
        rune: 'ᛏ',
        avatarClass: 'tyr-avatar',
        glowClass: 'tyr-glow',
        presence: 'idle'
    },
    baldr: {
        name: 'Baldr',
        rune: 'ᛒ',
        avatarClass: 'baldr-avatar',
        glowClass: 'baldr-glow',
        presence: 'offline'
    }
};

// --- Runic Alphabet for Transliteration ---
const RunicAlphabet = {
    'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ',
    'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ',
    'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ',
    'p': 'ᛈ', 'q': 'ᚲᚹ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ',
    'u': 'ᚢ', 'v': 'ᚢ', 'w': 'ᚹ', 'x': 'ᚲᛊ', 'y': 'ᚢ',
    'z': 'ᛉ', ' ': '·', '.': '᛫', ',': '᛫', '!': '᛫',
    '?': '᛫', ':': '᛫', ';': '᛫'
};

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
    initializeRealmSelector();
    initializeMessageInput();
    initializeRuneTranslation();
    initializeMessageActions();
    initializeTypingIndicator();
    initializeScrollBehavior();
    initializeCharacterCount();
    updateActiveRealmVisuals();
    
    console.log('ᚺᚢᚷᛁᚲᛚ ᚢᛖᚲᛚᛚ · Ravens have taken flight');
}

// ============================================
// REALM SELECTOR: Yggdrasil Navigation
// ============================================

function initializeRealmSelector() {
    const realmButtons = document.querySelectorAll('.realm-btn');
    
    realmButtons.forEach(button => {
        button.addEventListener('click', handleRealmSwitch);
    });
}

function handleRealmSwitch(event) {
    const button = event.currentTarget;
    const realmId = button.dataset.realm;
    
    if (realmId === AppState.currentRealm) return;
    
    triggerBifrostTransition(() => {
        updateActiveRealm(realmId, button);
    });
}

function updateActiveRealm(realmId, activeButton) {
    const realm = Realms[realmId];
    if (!realm) return;
    
    AppState.currentRealm = realmId;
    
    // Update button states
    document.querySelectorAll('.realm-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.setProperty('--realm-color', 'var(--wood-aged)');
    });
    
    activeButton.classList.add('active');
    activeButton.style.setProperty('--realm-color', realm.color);
    
    // Update banner
    document.getElementById('currentRealmIcon').textContent = realm.icon;
    document.getElementById('currentRealmName').textContent = realm.name;
    document.getElementById('currentRealmMood').textContent = realm.mood;
    
    // Update lore sidebar
    updateLoreSidebar(realm);
    
    // Clear and repopulate messages for new realm
    populateRealmMessages(realmId);
    
    updateActiveRealmVisuals();
}

function updateActiveRealmVisuals() {
    const realm = Realms[AppState.currentRealm];
    const banner = document.querySelector('.current-realm-banner');
    
    if (banner && realm) {
        banner.style.setProperty('--realm-accent', realm.color);
    }
}

function updateLoreSidebar(realm) {
    const loreContainer = document.getElementById('realmLore');
    if (!loreContainer) return;
    
    loreContainer.innerHTML = '';
    
    realm.lore.forEach(entry => {
        const loreEntry = document.createElement('div');
        loreEntry.className = 'lore-entry';
        loreEntry.innerHTML = `
            <div class="lore-rune">ᚢ</div>
            <p class="lore-text">${entry}</p>
        `;
        loreContainer.appendChild(loreEntry);
    });
}

// ============================================
// BIFROST TRANSITION EFFECT
// ============================================

function triggerBifrostTransition(callback) {
    const overlay = document.getElementById('bifrostOverlay');
    
    overlay.classList.add('active');
    
    setTimeout(() => {
        callback();
        
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 200);
    }, 400);
}

// ============================================
// MESSAGE MANAGEMENT
// ============================================

function populateRealmMessages(realmId) {
    const container = document.getElementById('messagesTimeline');
    if (!container) return;
    
    // In a real app, this would fetch messages from a server
    // For demo purposes, we keep the static messages but update their context
    const messages = container.querySelectorAll('.message-carrier');
    
    messages.forEach((msg, index) => {
        msg.style.animation = 'none';
        msg.offsetHeight; // Trigger reflow
        msg.style.animation = `messageAppear 0.6s var(--transition-epic) both ${index * 0.1}s`;
    });
}

// ============================================
// MESSAGE INPUT & RAVEN DISPATCH
// ============================================

function initializeMessageInput() {
    const input = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendRaven');
    
    if (!input || !sendButton) return;
    
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            dispatchRaven();
        }
    });
    
    input.addEventListener('input', handleInputActivity);
    
    sendButton.addEventListener('click', (event) => {
        event.preventDefault();
        dispatchRaven();
    });
}

function handleInputActivity() {
    const input = document.getElementById('messageInput');
    updateCharacterCount(input.value.length);
    
    // Typing indicator logic would go here in a real app
    clearTimeout(AppState.typingTimeout);
    AppState.typingTimeout = setTimeout(() => {
        // User stopped typing
    }, 1000);
}

function dispatchRaven() {
    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();
    
    if (!messageText || AppState.ravenAnimationInProgress) return;
    
    AppState.ravenAnimationInProgress = true;
    
    // Animate the raven taking flight
    animateRavenFlight(() => {
        addMessageToTimeline(messageText);
        input.value = '';
        updateCharacterCount(0);
        AppState.ravenAnimationInProgress = false;
    });
}

function animateRavenFlight(callback) {
    const sendButton = document.getElementById('sendRaven');
    const raven = sendButton.querySelector('.launching-raven');
    
    if (raven) {
        raven.style.animation = 'ravenTakeoff 0.8s ease-out forwards';
        
        setTimeout(() => {
            raven.style.animation = '';
            callback();
        }, 800);
    } else {
        callback();
    }
}

function addMessageToTimeline(text) {
    const container = document.getElementById('messagesTimeline');
    const newMessage = createMessageElement(text, 'user');
    
    container.appendChild(newMessage);
    
    // Scroll to bottom
    const scrollArea = document.getElementById('messagesContainer');
    scrollArea.scrollTop = scrollArea.scrollHeight;
    
    // Update stats
    incrementStat('messagesToday');
    incrementStat('ravensDispatched');
}

function createMessageElement(text, senderType) {
    const wrapper = document.createElement('article');
    wrapper.className = 'message-carrier';
    wrapper.dataset.sender = 'user';
    
    const runeText = transliterateToRunes(text);
    const timestamp = getRunicTimestamp();
    
    wrapper.innerHTML = `
        <div class="sender-avatar user-avatar-local">
            <div class="avatar-glow"></div>
            <span class="avatar-initial">ᚢ</span>
        </div>
        <div class="message-wooden-frame">
            <div class="wood-grain"></div>
            <div class="knotwork-border top-border"></div>
            <div class="knotwork-border bottom-border"></div>
            <div class="knotwork-border left-border"></div>
            <div class="knotwork-border right-border"></div>
            <div class="message-content">
                <header class="message-header">
                    <span class="sender-name">You</span>
                    <span class="message-timestamp">${timestamp}</span>
                </header>
                <div class="message-body">
                    <p class="message-text">${escapeHtml(text)}</p>
                    <div class="rune-transliteration hidden">
                        <span class="rune-text">${runeText}</span>
                    </div>
                </div>
                <div class="message-footer">
                    <span class="delivery-raven">🐦‍⬛ Raven in flight</span>
                    <div class="message-actions">
                        <button class="action-btn translate-runes" aria-label="Show runic transliteration">ᚱᚢᚾᛟᛗ</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add rune translation handler to the new button
    const translateBtn = wrapper.querySelector('.translate-runes');
    if (translateBtn) {
        translateBtn.addEventListener('click', toggleRuneTranslation);
    }
    
    return wrapper;
}

// ============================================
// RUNE TRANSLATION
// ============================================

function initializeRuneTranslation() {
    document.querySelectorAll('.translate-runes').forEach(btn => {
        btn.addEventListener('click', toggleRuneTranslation);
    });
}

function toggleRuneTranslation(event) {
    const button = event.currentTarget;
    const messageCarrier = button.closest('.message-carrier');
    const runeDiv = messageCarrier.querySelector('.rune-transliteration');
    
    if (!runeDiv) return;
    
    const isHidden = runeDiv.classList.contains('hidden');
    
    if (isHidden) {
        runeDiv.classList.remove('hidden');
        button.textContent = 'ᚲᛖᚲᛚᛟᛊᛖ';
    } else {
        runeDiv.classList.add('hidden');
        button.textContent = 'ᚱᚢᚾᛟᛗ';
    }
}

function transliterateToRunes(text) {
    return text.toLowerCase().split('').map(char => {
        return RunicAlphabet[char] || char;
    }).join('');
}

// ============================================
// MESSAGE ACTIONS
// ============================================

function initializeMessageActions() {
    // Echo functionality
    document.querySelectorAll('.echo-message').forEach(btn => {
        btn.addEventListener('click', handleEchoMessage);
    });
}

function handleEchoMessage(event) {
    const button = event.currentTarget;
    const messageCarrier = button.closest('.message-carrier');
    
    // Visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // In a real app, this would broadcast to other realms
    console.log('Echoed to all realms');
}

// ============================================
// TYPING INDICATOR
// ============================================

function initializeTypingIndicator() {
    // Typing indicator would be controlled by external events
    // This sets up the structure for real-time updates
}

function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.classList.add('visible');
        indicator.classList.remove('hidden');
    }
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.classList.remove('visible');
        indicator.classList.add('hidden');
    }
}

// ============================================
// SCROLL BEHAVIOR
// ============================================

function initializeScrollBehavior() {
    const scrollArea = document.getElementById('messagesContainer');
    if (!scrollArea) return;
    
    // Auto-scroll to bottom on load
    scrollArea.scrollTop = scrollArea.scrollHeight;
    
    // Show/hide scroll indicators based on position
    scrollArea.addEventListener('scroll', handleScrollPosition);
}

function handleScrollPosition(event) {
    const container = event.target;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
    
    // Could add visual indicators for new messages above
    container.dataset.scrolledUp = (!isAtBottom).toString();
}

// ============================================
// CHARACTER COUNT
// ============================================

function initializeCharacterCount() {
    updateCharacterCount(0);
}

function updateCharacterCount(current) {
    const display = document.getElementById('charCount');
    if (display) {
        display.textContent = `${current} / 500 runes`;
        
        // Visual warning near limit
        if (current > 450) {
            display.style.color = 'var(--svartalfheim-ember)';
        } else {
            display.style.color = 'var(--wood-bark)';
        }
    }
}

// ============================================
// STATS MANAGEMENT
// ============================================

function incrementStat(statId) {
    const element = document.getElementById(statId);
    if (element) {
        const current = parseInt(element.textContent.replace(',', ''));
        element.textContent = (current + 1).toLocaleString();
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getRunicTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    // Simplified runic time - in a full app, this would be more elaborate
    return `ᚦᚢ · ${hours}:${minutes}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// REAL-TIME SIMULATION (Demo Purposes)
// ============================================

function simulateIncomingMessage() {
    const senders = Object.keys(Senders);
    const randomSender = senders[Math.floor(Math.random() * senders.length)];
    const sender = Senders[randomSender];
    
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        // In a real app, this would add a message from the server
    }, 2000 + Math.random() * 3000);
}

// Optional: Uncomment to simulate activity
// setInterval(simulateIncomingMessage, 15000);

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + K to focus input
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        document.getElementById('messageInput')?.focus();
    }
});

// ============================================
// VISIBILITY API - Pause animations when hidden
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause non-essential animations
        document.body.classList.add('animations-paused');
    } else {
        document.body.classList.remove('animations-paused');
    }
});