document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const state = {
        currentRealm: 'asgard',
        isRunicMode: false,
        user: { name: 'Odin', title: 'All-Father' }
    };

    // --- DOM Elements ---
    const elements = {
        channels: document.querySelectorAll('.channel'),
        realmName: document.getElementById('current-realm-name'),
        realmDesc: document.querySelector('.realm-desc'),
        messagesContainer: document.getElementById('messages-container'),
        input: document.getElementById('message-input'),
        sendBtn: document.getElementById('send-btn'),
        runicToggle: document.getElementById('runic-toggle'),
        ravenOverlay: document.getElementById('raven-overlay')
    };

    // --- Data: Realms & Messages ---
    const realms = {
        asgard: {
            name: 'Asgard',
            desc: 'The Golden Realm • Divine Council',
            color: '#d4af37'
        },
        midgard: {
            name: 'Midgard',
            desc: 'Earth • Realm of Mortals',
            color: '#4a6fa5'
        },
        jotunheim: {
            name: 'Jotunheim',
            desc: 'Land of the Giants • Eternal Winter',
            color: '#a8dadc'
        },
        alfheim: {
            name: 'Alfheim',
            desc: 'Realm of Light • Elven Courts',
            color: '#f1faee'
        },
        helheim: {
            name: 'Helheim',
            desc: 'The Underworld • Realm of the Dead',
            color: '#6d1b1b'
        }
    };

    const initialMessages = {
        asgard: [
            { id: 1, sender: 'Thor', text: 'Father, the hammer strikes true today.', type: 'received', time: '09:00 AM' },
            { id: 2, sender: 'Loki', text: 'Does it? Or does it merely strike loudly?', type: 'received', time: '09:05 AM' },
            { id: 3, sender: 'Odin', text: 'Silence, trickster. The threads of fate weave tight.', type: 'sent', time: '09:10 AM' }
        ],
        midgard: [
            { id: 1, sender: 'Mortal_492', text: 'Did anyone else see that light in the sky?', type: 'received', time: '11:20 AM' },
            { id: 2, sender: 'Scholar_John', text: 'Probably just aurora borealis. Stop panic mongering.', type: 'received', time: '11:22 AM' }
        ],
        jotunheim: [
            { id: 1, sender: 'Laufey', text: 'The frost bites deeper today.', type: 'received', time: 'Yesterday' }
        ],
        alfheim: [
            { id: 1, sender: 'Freyr', text: 'The light shines bright upon the fields.', type: 'received', time: '08:00 AM' }
        ],
        helheim: [
            { id: 1, sender: 'Hel', text: '...silence...', type: 'received', time: 'Eternity' }
        ]
    };

    // --- Runic Transliteration Map (Simplified Elder Futhark) ---
    const runicMap = {
        'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ',
        'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ',
        'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᚲᛊ',
        'y': 'ᚣ', 'z': 'ᛉ', ' ': ' ', '?': '?', '!': '!', '.': '.', ',': ','
    };

    // --- Functions ---

    // 1. Runic Translation Logic
    function toRunic(text) {
        return text.toLowerCase().split('').map(char => runicMap[char] || char).join('');
    }

    function toggleRunicMode() {
        state.isRunicMode = !state.isRunicMode;
        elements.runicToggle.classList.toggle('active', state.isRunicMode);
        renderMessages(); // Re-render current messages with new mode
    }

    // 2. Message Rendering
    function renderMessages() {
        elements.messagesContainer.innerHTML = '';
        const messages = initialMessages[state.currentRealm] || [];

        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.type}`;
            if (state.isRunicMode) msgDiv.classList.add('runic-mode');

            const displayText = state.isRunicMode ? toRunic(msg.text) : msg.text;
            const displaySender = state.isRunicMode ? toRunic(msg.sender) : msg.sender;

            msgDiv.innerHTML = `
                <div class="message-header">
                    <div class="avatar-small">${msg.sender.charAt(0)}</div>
                    <span>${displaySender}</span>
                    <span class="timestamp">${msg.time}</span>
                </div>
                <div class="message-bubble">
                    ${displayText}
                </div>
            `;
            elements.messagesContainer.appendChild(msgDiv);
        });
        scrollToBottom();
    }

    function scrollToBottom() {
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    }

    // 3. Realm Switching
    function switchRealm(realmKey) {
        if (state.currentRealm === realmKey) return;

        // Visual feedback on sidebar
        elements.channels.forEach(ch => {
            ch.classList.remove('active');
            if (ch.dataset.realm === realmKey) ch.classList.add('active');
        });

        // Update Header
        const realmData = realms[realmKey];
        elements.realmName.textContent = realmData.name;
        elements.realmDesc.textContent = realmData.desc;
        
        // Change theme accent slightly based on realm (optional polish)
        document.documentElement.style.setProperty('--gold-bright', realmData.color);

        state.currentRealm = realmKey;
        renderMessages();
    }

    // 4. Sending Messages & Raven Animation
    function triggerRavenAnimation() {
        // Create raven element
        const raven = document.createElement('div');
        raven.className = 'raven-silhouette raven-flying';
        elements.ravenOverlay.appendChild(raven);

        // Remove after animation
        setTimeout(() => {
            raven.remove();
        }, 2000);
    }

    function sendMessage() {
        const text = elements.input.value.trim();
        if (!text) return;

        // 1. Trigger Animation
        triggerRavenAnimation();

        // 2. Add Message to State (Simulated)
        const newMessage = {
            id: Date.now(),
            sender: state.user.name,
            text: text,
            type: 'sent',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        if (!initialMessages[state.currentRealm]) {
            initialMessages[state.currentRealm] = [];
        }
        initialMessages[state.currentRealm].push(newMessage);

        // 3. Clear Input
        elements.input.value = '';
        elements.input.style.height = 'auto'; // Reset height

        // 4. Render
        renderMessages();

        // 5. Simulate Reply (Optional Immersion)
        if (state.currentRealm === 'helheim') {
            setTimeout(() => {
                // Hel never replies quickly... or at all.
            }, 5000);
        } else if (state.currentRealm === 'asgard') {
             // Random divine interjection
             if (Math.random() > 0.7) {
                 setTimeout(() => {
                     const replies = ["Indeed.", "The Norns weave.", "Huginn flies.", "Silence."];
                     const replyText = replies[Math.floor(Math.random() * replies.length)];
                     const replyMsg = {
                        id: Date.now() + 1,
                        sender: 'System',
                        text: replyText,
                        type: 'received',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                     };
                     initialMessages[state.currentRealm].push(replyMsg);
                     renderMessages();
                 }, 2000);
             }
        }
    }

    // --- Event Listeners ---

    // Channel Switching
    elements.channels.forEach(channel => {
        channel.addEventListener('click', () => {
            switchRealm(channel.dataset.realm);
        });
    });

    // Runic Toggle
    elements.runicToggle.addEventListener('click', toggleRunicMode);

    // Send Button
    elements.sendBtn.addEventListener('click', sendMessage);

    // Input Auto-resize & Enter to send
    elements.input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    elements.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // --- Initialization ---
    // Set initial active channel visual
    document.querySelector(`.channel[data-realm="${state.currentRealm}"]`).classList.add('active');
    renderMessages();
});