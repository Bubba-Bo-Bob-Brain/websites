// ===== RUNIC TRANSLITERATION DATA =====
const runicAlphabet = {
    a: 'ᚨ', b: 'ᛒ', c: 'ᚲ', d: 'ᛞ', e: 'ᛖ', f: 'ᚠ', g: 'ᚷ', h: 'ᚺ', i: 'ᛁ',
    j: 'ᛃ', k: 'ᚲ', l: 'ᛚ', m: 'ᛗ', n: 'ᚾ', o: 'ᛟ', p: 'ᛈ', q: 'ᚲ', r: 'ᚱ',
    s: 'ᛋ', t: 'ᛏ', u: 'ᚢ', v: 'ᚡ', w: 'ᚹ', x: 'ᛉ', y: 'ᛃ', z: 'ᛉ',
    æ: 'ᚫ', ø: 'ᛟ', å: 'ᚨ', th: 'ᚦ', ng: 'ᛝ', ea: 'ᛠ', '.': '᛫', ',': '᛬',
    ' ': ' ', '0': 'ᛮ', '1': 'ᛁ', '2': 'ᛉ', '3': 'ᛏ', '4': 'ᚠ', '5': 'ᚠ',
    '6': 'ᛋ', '7': 'ᛋ', '8': 'ᛒ', '9': 'ᚺ'
};

const elderFutharkRunes = [
    'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ',
    'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛝ', 'ᛟ', 'ᛞ'
];

// ===== REALM DATA =====
const realms = {
    asgard: {
        name: 'Asgard',
        description: 'Hall of the Æsir',
        icon: 'fa-crown',
        color: '#d4af37',
        activeUsers: ['odin', 'thor', 'freyja', 'loki', 'heimdall', 'tyr']
    },
    midgard: {
        name: 'Midgard',
        description: 'Mortal Realm',
        icon: 'fa-globe-europe',
        color: '#2e8b57',
        activeUsers: ['human1', 'human2', 'human3']
    },
    vanaheim: {
        name: 'Vanaheim',
        description: 'Vanir Council',
        icon: 'fa-leaf',
        color: '#8fbc8f',
        activeUsers: ['frey', 'freya', 'njord']
    },
    jotunheim: {
        name: 'Jötunheim',
        description: 'Giants\' Domain',
        icon: 'fa-mountain',
        color: '#4682b4',
        activeUsers: ['giant1', 'giant2', 'giant3']
    },
    alfheim: {
        name: 'Álfheim',
        description: 'Light Elves',
        icon: 'fa-sparkles',
        color: '#da70d6',
        activeUsers: ['elf1', 'elf2', 'elf3']
    },
    svartalfheim: {
        name: 'Svartálfheim',
        description: 'Dark Elves & Dwarves',
        icon: 'fa-gem',
        color: '#696969',
        activeUsers: ['dwarf1', 'dwarf2', 'dwarf3']
    },
    niflheim: {
        name: 'Niflheim',
        description: 'Mist & Ice',
        icon: 'fa-snowflake',
        color: '#87ceeb',
        activeUsers: ['frostgiant1', 'frostgiant2']
    },
    muspelheim: {
        name: 'Múspellheim',
        description: 'Fire Realm',
        icon: 'fa-fire',
        color: '#ff4500',
        activeUsers: ['firegiant1', 'firegiant2']
    },
    helheim: {
        name: 'Helheim',
        description: 'Hall of the Dead',
        icon: 'fa-skull',
        color: '#8a2be2',
        activeUsers: ['hel', 'dead1', 'dead2']
    }
};

// ===== SAMPLE MESSAGES =====
const sampleMessages = {
    asgard: [
        { sender: 'thor', text: 'I just defeated another Jötunn! Anyone want to celebrate with mead?', time: '10:30 AM' },
        { sender: 'loki', text: 'I\'ve hidden Mjölnir again. Thor is going to be furious when he finds out.', time: '10:45 AM' },
        { sender: 'freyja', text: 'The Valkyries have returned with new heroes for Valhalla.', time: '11:00 AM' },
        { sender: 'heimdall', text: 'I see everything from here. Even that squirrel Ratatoskr is up to mischief.', time: '11:15 AM' }
    ],
    midgard: [
        { sender: 'human1', text: 'The harvest is good this year. The gods must be pleased.', time: '9:30 AM' },
        { sender: 'human2', text: 'Has anyone seen that thunderstorm yesterday? Thor must be fighting again.', time: '10:00 AM' }
    ],
    helheim: [
        { sender: 'hel', text: 'Welcome to my hall. Make yourselves comfortable... forever.', time: '12:00 PM' }
    ]
};

// ===== GLOBAL VARIABLES =====
let currentRealm = 'asgard';
let isRunicMode = false;
let selectedRaven = 'huginn';
let messageHistory = [];
let runeModalOpen = false;

// ===== DOM ELEMENTS =====
const dom = {
    // Toggle elements
    runeToggle: document.getElementById('rune-toggle'),
    toggleRunesBtn: document.getElementById('toggle-runes'),
    
    // Chat elements
    messageInput: document.getElementById('message-input'),
    sendMessageBtn: document.getElementById('send-message'),
    messagesContainer: document.querySelector('.messages-container'),
    clearChatBtn: document.getElementById('clear-chat'),
    
    // Channel elements
    channelItems: document.querySelectorAll('.channel-item'),
    currentRealmDisplay: document.querySelector('.current-realm-display'),
    realmTitle: document.querySelector('.realm-title'),
    realmIcon: document.querySelector('.realm-icon'),
    
    // Raven elements
    summonRavenBtn: document.getElementById('summon-raven'),
    ravenOptions: document.querySelectorAll('.raven-option'),
    flyingRaven: document.getElementById('flying-raven'),
    ravenFlightContainer: document.querySelector('.raven-flight-container'),
    
    // Bifrost elements
    bifrostOverlay: document.getElementById('bifrost-overlay'),
    destinationRealm: document.getElementById('destination-realm'),
    
    // Status elements
    valhallaTime: document.getElementById('valhalla-time'),
    footerTime: document.getElementById('footer-time'),
    charCount: document.getElementById('char-count'),
    messagePreview: document.getElementById('message-preview'),
    
    // Modal elements
    runeModal: document.getElementById('rune-modal'),
    closeRuneModal: document.getElementById('close-rune-modal'),
    runeGrid: document.querySelector('.rune-grid'),
    attachRuneBtn: document.getElementById('attach-rune'),
    
    // User interface elements
    realmTreeBranches: document.querySelectorAll('.tree-branch'),
    activeChannel: document.querySelector('.channel-item.active')
};

// ===== UTILITY FUNCTIONS =====
function transliterateToRunes(text) {
    let runicText = '';
    text = text.toLowerCase();
    
    for (let i = 0; i < text.length; i++) {
        // Check for multi-character combinations first
        if (i < text.length - 1) {
            const twoChars = text.substr(i, 2);
            if (runicAlphabet[twoChars]) {
                runicText += runicAlphabet[twoChars];
                i++; // Skip next character
                continue;
            }
        }
        
        // Single character transliteration
        runicText += runicAlphabet[text[i]] || text[i];
    }
    
    return runicText;
}

function updateValhallaTime() {
    const now = new Date();
    const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    };
    
    const timeString = now.toLocaleTimeString('en-US', options);
    dom.valhallaTime.textContent = timeString;
    dom.footerTime.textContent = timeString;
    
    // Add some Norse flavor
    const hour = now.getUTCHours();
    if (hour >= 0 && hour < 6) {
        dom.valhallaTime.textContent += ' (Witching Hour)';
    } else if (hour >= 6 && hour < 12) {
        dom.valhallaTime.textContent += ' (Dawn Watch)';
    } else if (hour >= 12 && hour < 18) {
        dom.valhallaTime.textContent += ' (High Sun)';
    } else {
        dom.valhallaTime.textContent += ' (Dusk Watch)';
    }
}

function updateCharacterCount() {
    const count = dom.messageInput.value.length;
    dom.charCount.textContent = count;
    
    // Update color based on count
    if (count > 450) {
        dom.charCount.style.color = '#ff4500'; // Muspelheim red
    } else if (count > 400) {
        dom.charCount.style.color = '#d4af37'; // Asgard gold
    } else {
        dom.charCount.style.color = '';
    }
}

function updateMessagePreview() {
    const text = dom.messageInput.value;
    if (text.trim() === '') {
        dom.messagePreview.textContent = 'Your message will appear here...';
    } else {
        const preview = text.length > 50 ? text.substring(0, 50) + '...' : text;
        dom.messagePreview.textContent = preview;
    }
}

function getRandomNorseName() {
    const names = [
        'Odin All-Father', 'Thor Odinson', 'Loki Laufeyson', 'Freyja', 'Heimdall',
        'Týr', 'Frigg', 'Baldr', 'Höd', 'Vidar', 'Vali', 'Bragi', 'Iðunn',
        'Njord', 'Skadi', 'Ullr', 'Forseti', 'Gefjon', 'Eir', 'Mimir'
    ];
    return names[Math.floor(Math.random() * names.length)];
}

function getRandomAvatarIcon() {
    const icons = [
        'fa-crown', 'fa-bolt', 'fa-mask', 'fa-gem', 'fa-trumpet',
        'fa-fist-raised', 'fa-feather-alt', 'fa-helmet-battle',
        'fa-shield-alt', 'fa-sword', 'fa-hammer', 'fa-axe-battle'
    ];
    return icons[Math.floor(Math.random() * icons.length)];
}

// ===== MESSAGE FUNCTIONS =====
function createMessageBubble(sender, text, isSent = false) {
    const messageGroup = document.createElement('div');
    messageGroup.className = 'message-group';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
    messageBubble.dataset.sender = sender.toLowerCase();
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const senderName = isSent ? 'You' : getRandomNorseName();
    const avatarIcon = isSent ? 'fa-user' : getRandomAvatarIcon();
    
    messageBubble.innerHTML = `
        <div class="message-header">
            <div class="sender-avatar">
                <i class="fas ${avatarIcon}"></i>
            </div>
            <div class="sender-info">
                <h4 class="sender-name">${senderName}</h4>
                <span class="message-time">Today at ${timeString}</span>
            </div>
            ${isSent ? '<div class="message-status"><i class="fas fa-feather-alt"></i></div>' : ''}
        </div>
        <div class="message-content">
            <p class="message-text">${text}</p>
            <p class="rune-text">${transliterateToRunes(text)}</p>
        </div>
        <div class="message-footer">
            <div class="knotwork-frame"></div>
            ${isSent ? `<div class="raven-delivery">
                <i class="fas fa-dove"></i>
                Delivered by ${selectedRaven.charAt(0).toUpperCase() + selectedRaven.slice(1)}
            </div>` : ''}
        </div>
    `;
    
    messageGroup.appendChild(messageBubble);
    return messageGroup;
}

function addMessageToChat(text, isSent = false) {
    if (!text.trim()) return;
    
    const messageBubble = createMessageBubble('user', text, isSent);
    dom.messagesContainer.appendChild(messageBubble);
    
    // Scroll to bottom
    dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
    
    // Add to history
    messageHistory.push({
        text,
        realm: currentRealm,
        timestamp: new Date(),
        isSent
    });
    
    // Clear input
    dom.messageInput.value = '';
    updateCharacterCount();
    updateMessagePreview();
    
    // If message was sent, trigger raven flight animation
    if (isSent) {
        animateRavenFlight();
        
        // Simulate a response after a delay
        if (Math.random() > 0.5) {
            setTimeout(() => {
                const responses = [
                    "Interesting observation, mortal.",
                    "By Odin's beard, that's noteworthy!",
                    "The All-Father would be pleased.",
                    "Even Loki would find that amusing.",
                    "That reminds me of a tale from the sagas..."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessageToChat(randomResponse, false);
            }, 2000 + Math.random() * 3000);
        }
    }
}

function clearChat() {
    const messages = dom.messagesContainer.querySelectorAll('.message-group');
    messages.forEach(message => {
        message.style.animation = 'message-appear 0.5s ease-out reverse';
        setTimeout(() => message.remove(), 500);
    });
    
    messageHistory = messageHistory.filter(msg => msg.realm !== currentRealm);
    
    // Add a system message
    setTimeout(() => {
        const systemMessage = createMessageBubble('system', 'The mead hall has been cleared. Speak your mind, traveler.', false);
        dom.messagesContainer.appendChild(systemMessage);
        dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
    }, 600);
}

// ===== REALM FUNCTIONS =====
function switchRealm(realmId) {
    if (realmId === currentRealm) return;
    
    const oldRealm = currentRealm;
    currentRealm = realmId;
    
    // Update UI to show transition
    dom.destinationRealm.textContent = realms[realmId].name;
    showBifrostTransition();
    
    // Update realm display after transition
    setTimeout(() => {
        updateRealmDisplay();
        loadRealmMessages();
        hideBifrostTransition();
        
        // Update active channel
        dom.channelItems.forEach(item => {
            if (item.dataset.realm === realmId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update tree branches
        dom.realmTreeBranches.forEach(branch => {
            if (branch.dataset.realm === realmId) {
                branch.style.filter = 'brightness(1.5)';
                branch.style.transform += ' scale(1.1)';
            } else {
                branch.style.filter = '';
                branch.style.transform = branch.style.transform.replace(' scale(1.1)', '');
            }
        });
        
        // Update document theme
        document.documentElement.dataset.theme = realmId;
        document.documentElement.style.setProperty('--realm-asgard', realms[realmId].color);
        
        // Log realm switch
        console.log(`Switched from ${oldRealm} to ${realmId}`);
    }, 1500);
}

function updateRealmDisplay() {
    const realm = realms[currentRealm];
    
    // Update realm title
    dom.realmTitle.innerHTML = `
        <span class="realm-icon">
            <i class="fas ${realm.icon}"></i>
        </span>
        ${realm.name} - ${realm.description}
    `;
    
    // Update realm meta (simplified for demo)
    const metaItems = document.querySelectorAll('.meta-item');
    if (metaItems.length > 0) {
        metaItems[0].innerHTML = `<i class="fas fa-user-friends"></i> ${realm.activeUsers.length} ${realm.name === 'Midgard' ? 'Mortals' : 'Gods'} Online`;
    }
}

function loadRealmMessages() {
    // Clear current messages
    const messages = dom.messagesContainer.querySelectorAll('.message-group');
    messages.forEach(msg => msg.remove());
    
    // Load sample messages for this realm
    const messagesToLoad = sampleMessages[currentRealm] || [];
    
    messagesToLoad.forEach(msg => {
        const messageBubble = createMessageBubble(msg.sender, msg.text, false);
        dom.messagesContainer.appendChild(messageBubble);
    });
    
    // Scroll to bottom
    setTimeout(() => {
        dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
    }, 100);
}

// ===== ANIMATION FUNCTIONS =====
function showBifrostTransition() {
    dom.bifrostOverlay.style.display = 'flex';
    
    // Add shimmer effect
    const shimmer = dom.bifrostOverlay.querySelector('.bifrost-shimmer');
    shimmer.style.animation = 'shimmer 1.5s infinite';
    
    // Play sound effect (in a real implementation)
    console.log('Bifrost bridge activating...');
}

function hideBifrostTransition() {
    // Fade out the overlay
    dom.bifrostOverlay.style.opacity = '0';
    setTimeout(() => {
        dom.bifrostOverlay.style.display = 'none';
        dom.bifrostOverlay.style.opacity = '1';
    }, 500);
}

function animateRavenFlight() {
    // Show flight container
    dom.ravenFlightContainer.style.display = 'block';
    
    // Reset animation
    dom.flyingRaven.style.animation = 'none';
    dom.flyingRaven.style.left = '-50px';
    
    // Force reflow
    void dom.flyingRaven.offsetWidth;
    
    // Start animation
    dom.flyingRaven.style.animation = 'raven-fly 3s linear';
    
    // Hide after animation
    setTimeout(() => {
        dom.ravenFlightContainer.style.display = 'none';
        
        // Add delivery confirmation message
        const deliveryMsg = document.createElement('div');
        deliveryMsg.className = 'message-bubble system';
        deliveryMsg.innerHTML = `
            <div class="message-content">
                <p class="message-text" style="text-align: center; font-style: italic;">
                    <i class="fas fa-dove"></i> Your message has been delivered by ${selectedRaven}.
                </p>
            </div>
        `;
        dom.messagesContainer.appendChild(deliveryMsg);
        dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
    }, 3000);
}

function animateRavenSummon() {
    const ravenContainer = document.querySelector('.raven-container');
    
    // Add pulse animation to ravens
    const ravens = document.querySelectorAll('.raven');
    ravens.forEach(raven => {
        raven.style.animation = 'none';
        void raven.offsetWidth;
        raven.style.animation = 'raven-float 2s ease-in-out';
    });
    
    // Add visual effect
    const summonEffect = document.createElement('div');
    summonEffect.style.position = 'absolute';
    summonEffect.style.top = '50%';
    summonEffect.style.left = '50%';
    summonEffect.style.transform = 'translate(-50%, -50%)';
    summonEffect.style.width = '100px';
    summonEffect.style.height = '100px';
    summonEffect.style.background = 'radial-gradient(circle, rgba(212,175,55,0.8) 0%, transparent 70%)';
    summonEffect.style.borderRadius = '50%';
    summonEffect.style.zIndex = '100';
    summonEffect.style.animation = 'summon-pulse 1s ease-out';
    
    ravenContainer.appendChild(summonEffect);
    
    // Remove effect after animation
    setTimeout(() => {
        summonEffect.remove();
    }, 1000);
    
    // Add sound effect notification
    console.log('Ravens summoned!');
}

// ===== MODAL FUNCTIONS =====
function openRuneModal() {
    dom.runeModal.style.display = 'flex';
    runeModalOpen = true;
    
    // Populate rune grid if not already done
    if (dom.runeGrid.children.length === 0) {
        elderFutharkRunes.forEach((rune, index) => {
            const runeElement = document.createElement('div');
            runeElement.className = 'rune';
            runeElement.textContent = rune;
            runeElement.title = `Rune ${index + 1}`;
            runeElement.addEventListener('click', () => insertRuneIntoMessage(rune));
            dom.runeGrid.appendChild(runeElement);
        });
    }
}

function closeRuneModal() {
    dom.runeModal.style.display = 'none';
    runeModalOpen = false;
}

function insertRuneIntoMessage(rune) {
    const textarea = dom.messageInput;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, start) + rune + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    textarea.focus();
    
    updateCharacterCount();
    updateMessagePreview();
    
    // Close modal after selection
    closeRuneModal();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Runic transliteration toggle
    dom.runeToggle.addEventListener('change', function() {
        isRunicMode = this.checked;
        
        // Update button text
        dom.toggleRunesBtn.querySelector('span').textContent = 
            isRunicMode ? 'Latin Mode' : 'Runic Mode';
        
        // Toggle visibility of runic text in messages
        const runeTexts = document.querySelectorAll('.rune-text');
        const messageTexts = document.querySelectorAll('.message-text');
        
        if (isRunicMode) {
            runeTexts.forEach(text => text.style.display = 'block');
            messageTexts.forEach(text => text.style.display = 'none');
            
            // Transliterate input placeholder
            dom.messageInput.placeholder = transliterateToRunes('Carve your message here... (Shift+Enter for new line)');
        } else {
            runeTexts.forEach(text => text.style.display = 'none');
            messageTexts.forEach(text => text.style.display = 'block');
            
            // Restore original placeholder
            dom.messageInput.placeholder = 'Carve your message here... (Shift+Enter for new line)';
        }
        
        // Update all messages in history
        messageHistory.forEach((msg, index) => {
            // In a real app, you would update the DOM elements here
        });
    });
    
    // Toggle runes button (alternative)
    dom.toggleRunesBtn.addEventListener('click', () => {
        dom.runeToggle.checked = !dom.runeToggle.checked;
        dom.runeToggle.dispatchEvent(new Event('change'));
    });
    
    // Message input events
    dom.messageInput.addEventListener('input', () => {
        updateCharacterCount();
        updateMessagePreview();
    });
    
    dom.messageInput.addEventListener('keydown', (e) => {
        // Send message on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            dom.sendMessageBtn.click();
        }
        
        // New line on Shift+Enter
        if (e.key === 'Enter' && e.shiftKey) {
            // Allow default behavior (new line)
        }
    });
    
    // Send message button
    dom.sendMessageBtn.addEventListener('click', () => {
        const message = dom.messageInput.value.trim();
        if (message) {
            addMessageToChat(message, true);
        }
    });
    
    // Clear chat button
    dom.clearChatBtn.addEventListener('click', clearChat);
    
    // Channel switching
    dom.channelItems.forEach(item => {
        item.addEventListener('click', () => {
            const realmId = item.dataset.realm;
            switchRealm(realmId);
        });
    });
    
    // Tree branch clicking (alternative channel switching)
    dom.realmTreeBranches.forEach(branch => {
        branch.addEventListener('click', () => {
            const realmId = branch.dataset.realm;
            switchRealm(realmId);
        });
    });
    
    // Raven selection
    dom.ravenOptions.forEach(option => {
        option.addEventListener('click', () => {
            const raven = option.dataset.raven;
            selectedRaven = raven;
            
            // Update UI
            dom.ravenOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Visual feedback
            const ravenElement = document.getElementById(`raven-${raven}`);
            if (ravenElement) {
                ravenElement.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    ravenElement.style.transform = '';
                }, 500);
            }
        });
    });
    
    // Summon raven button
    dom.summonRavenBtn.addEventListener('click', animateRavenSummon);
    
    // Attach rune button
    dom.attachRuneBtn.addEventListener('click', openRuneModal);
    
    // Close rune modal
    dom.closeRuneModal.addEventListener('click', closeRuneModal);
    
    // Close modal when clicking outside
    dom.runeModal.addEventListener('click', (e) => {
        if (e.target === dom.runeModal) {
            closeRuneModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && runeModalOpen) {
            closeRuneModal();
        }
    });
    
    // Other control buttons
    const otherControls = {
        'add-emoji': () => {
            const emojis = ['⚡', '🛡️', '⚔️', '🏰', '🌳', '🔥', '❄️', '💀', '👑', '🕊️'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            
            const textarea = dom.messageInput;
            const start = textarea.selectionStart;
            const text = textarea.value;
            
            textarea.value = text.substring(0, start) + randomEmoji + text.substring(start);
            textarea.selectionStart = textarea.selectionEnd = start + 2;
            textarea.focus();
            
            updateCharacterCount();
            updateMessagePreview();
            
            // Visual feedback
            const btn = document.getElementById('add-emoji');
            btn.style.color = '#d4af37';
            setTimeout(() => btn.style.color = '', 500);
        },
        'voice-message': () => {
            // Simulate voice recording
            const btn = document.getElementById('voice-message');
            btn.innerHTML = '<i class="fas fa-stop"></i>';
            btn.style.color = '#ff4500';
            
            // Add recording indicator
            const indicator = document.createElement('div');
            indicator.className = 'recording-indicator';
            indicator.innerHTML = '<div class="pulse"></div><span>Recording...</span>';
            indicator.style.position = 'absolute';
            indicator.style.bottom = '60px';
            indicator.style.right = '20px';
            indicator.style.background = 'rgba(58, 58, 58, 0.9)';
            indicator.style.padding = '10px';
            indicator.style.borderRadius = '6px';
            indicator.style.display = 'flex';
            indicator.style.alignItems = 'center';
            indicator.style.gap = '8px';
            indicator.style.zIndex = '1000';
            
            document.querySelector('.message-input-area').appendChild(indicator);
            
            // Stop after random time (simulating recording)
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-microphone"></i>';
                btn.style.color = '';
                indicator.remove();
                
                // Add a simulated voice message
                const voiceMessages = [
                    "I speak from the halls of Valhalla!",
                    "Hark! Listen to my words!",
                    "By the beard of Odin, hear me!",
                    "The runes have spoken through me!"
                ];
                const randomMessage = voiceMessages[Math.floor(Math.random() * voiceMessages.length)];
                addMessageToChat(`[Voice Message] ${randomMessage}`, true);
            }, 2000 + Math.random() * 3000);
        }
    };
    
    // Attach event listeners to other controls
    Object.keys(otherControls).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', otherControls[btnId]);
        }
    });
    
    // Header ravens interaction
    const headerRavens = document.querySelectorAll('.raven');
    headerRavens.forEach(raven => {
        raven.addEventListener('click', () => {
            const ravenId = raven.id.replace('raven-', '');
            selectedRaven = ravenId;
            
            // Update raven selection UI
            dom.ravenOptions.forEach(opt => {
                if (opt.dataset.raven === ravenId || (ravenId === 'huginn' && opt.dataset.raven === 'both')) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
            
            // Animate the clicked raven
            raven.style.transform = 'translateY(-20px) scale(1.2)';
            setTimeout(() => {
                raven.style.transform = '';
            }, 800);
        });
    });
}

// ===== INITIALIZATION =====
function initializeApp() {
    console.log('Initializing Raven\'s Eye - Odin\'s Messaging Interface');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize time display
    updateValhallaTime();
    setInterval(updateValhallaTime, 60000); // Update every minute
    
    // Load initial realm messages
    loadRealmMessages();
    
    // Initialize character count
    updateCharacterCount();
    
    // Initialize message preview
    updateMessagePreview();
    
    // Set initial realm display
    updateRealmDisplay();
    
    // Add some initial animation
    setTimeout(() => {
        // Animate ravens on load
        const ravens = document.querySelectorAll('.raven');
        ravens.forEach((raven, index) => {
            setTimeout(() => {
                raven.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    raven.style.transform = '';
                }, 500);
            }, index * 300);
        });
        
        // Animate runes in footer
        const footerRunes = document.querySelectorAll('.footer-rune');
        footerRunes.forEach((rune, index) => {
            setTimeout(() => {
                rune.style.transform = 'translateY(-15px)';
                rune.style.opacity = '1';
                setTimeout(() => {
                    rune.style.transform = 'translateY(0)';
                }, 1000);
            }, index * 200);
        });
        
        // Welcome message
        setTimeout(() => {
            addMessageToChat('Welcome to Raven\'s Eye. The All-Father watches over all conversations here.', false);
        }, 1500);
    }, 500);
    
    // Add some interactive hints
    console.log('App initialized. Try clicking on the Yggdrasil tree branches or the ravens!');
}

// ===== ADDITIONAL ANIMATIONS =====
// Custom CSS animations for dynamic elements
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes raven-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes summon-pulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .recording-indicator .pulse {
        width: 12px;
        height: 12px;
        background: #ff4500;
        border-radius: 50%;
        animation: pulse 1s infinite;
    }
    
    .system {
        background: rgba(93, 64, 55, 0.4) !important;
        border-left: 4px solid var(--color-rune) !important;
        align-self: center !important;
        max-width: 90% !important;
    }
`;
document.head.appendChild(styleSheet);

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ===== EXPORT FOR TESTING =====
// In a real module, you might export certain functions
window.RavensEye = {
    transliterateToRunes,
    switchRealm,
    addMessageToChat,
    clearChat,
    animateRavenFlight
};