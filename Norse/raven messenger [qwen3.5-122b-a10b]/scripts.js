/**
 * ODIN'S EYE - JAVASCRIPT LOGIC
 * Handles realm switching, runic translation, message delivery animations,
 * and the interactive Yggdrasil tree.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const branches = document.querySelectorAll('.branch');
    const realmNameDisplay = document.getElementById('current-realm-name');
    const realmSubtitle = document.querySelector('.realm-subtitle');
    const messagesFeed = document.getElementById('messages-feed');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const runicToggle = document.getElementById('runic-toggle');
    const floatingRunesBg = document.querySelector('.floating-runes-bg');

    // --- STATE ---
    let isRunicMode = false;
    let currentRealm = 'asgard';

    // --- RUNIC DICTIONARY (Simple substitution for demo) ---
    const runicMap = {
        'a': 'ᚫ', 'b': 'ᛒ', 'c': 'ᚳ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ',
        'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚳ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ',
        'q': 'ᛩ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚠ', 'w': 'ᚹ', 'x': 'ᛉ',
        'y': 'ᛇ', 'z': 'ᛉ', ' ': ' ', '.': '᛫', '!': 'ᚿ', '?': 'ᛏ'
    };

    // --- REALM DATA ---
    const realms = {
        asgard: {
            name: 'Asgard',
            subtitle: 'The Golden Realm • 42 Online',
            color: '#d4af37',
            bg: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1), transparent 70%)',
            welcome: 'Welcome to the hall of the All-Father.'
        },
        midgard: {
            name: 'Midgard',
            subtitle: 'The World of Men • 1,204 Online',
            color: '#2d4a22',
            bg: 'radial-gradient(circle at 50% 50%, rgba(45, 74, 34, 0.1), transparent 70%)',
            welcome: 'The mortal realm. Watch your step.'
        },
        helheim: {
            name: 'Helheim',
            subtitle: 'The Realm of the Dead • 8 Online',
            color: '#4a1c40',
            bg: 'radial-gradient(circle at 50% 50%, rgba(74, 28, 64, 0.1), transparent 70%)',
            welcome: 'Silence... and whispers.'
        },
        jotunheim: {
            name: 'Jötunheimr',
            subtitle: 'Land of Giants • 15 Online',
            color: '#a8d5e2',
            bg: 'radial-gradient(circle at 50% 50%, rgba(168, 213, 226, 0.1), transparent 70%)',
            welcome: 'The cold winds howl here.'
        }
    };

    // --- INITIALIZATION ---
    function init() {
        createFloatingRunes();
        updateRealm('asgard');
        
        // Event Listeners
        branches.forEach(branch => {
            branch.addEventListener('click', (e) => {
                const realmKey = e.currentTarget.dataset.realm;
                if (realmKey) updateRealm(realmKey);
            });
        });

        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        runicToggle.addEventListener('click', toggleRunicMode);
    }

    // --- CORE FUNCTIONS ---

    function updateRealm(realmKey) {
        // Update UI State
        currentRealm = realmKey;
        const data = realms[realmKey];

        // Update Branches
        branches.forEach(b => {
            b.classList.remove('active');
            if (b.dataset.realm === realmKey) b.classList.add('active');
        });

        // Update Header
        realmNameDisplay.textContent = data.name;
        realmSubtitle.textContent = data.subtitle;
        realmNameDisplay.style.color = data.color;
        realmSubtitle.style.color = data.color;

        // Update Background Atmosphere
        document.querySelector('.app-container').style.background = data.bg;
        
        // Bifrost Transition Effect
        const shimmer = document.querySelector('.bifrost-shimmer');
        shimmer.style.animation = 'none';
        shimmer.offsetHeight; /* trigger reflow */
        shimmer.style.animation = 'bifrost-shimmer 1s ease-out, breathe 8s ease-in-out infinite';

        // Clear chat and show welcome
        messagesFeed.innerHTML = '';
        addSystemMessage(data.welcome);
    }

    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        // Create Message Object
        const messageEl = createMessageBubble(text, 'outgoing');
        messagesFeed.appendChild(messageEl);
        
        // Scroll to bottom
        messagesFeed.scrollTop = messagesFeed.scrollHeight;

        // Clear input
        messageInput.value = '';

        // Simulate Raven Delivery Animation
        const ravenIcon = messageEl.querySelector('.raven-delivery-icon');
        if (ravenIcon) {
            ravenIcon.style.animation = 'none';
            ravenIcon.offsetHeight; 
            ravenIcon.style.animation = 'flyIn 0.6s ease-out forwards';
        }

        // Simulate Response after delay (Random God)
        setTimeout(() => {
            const randomResponse = getRandomResponse();
            const responseEl = createMessageBubble(randomResponse, 'incoming');
            messagesFeed.appendChild(responseEl);
            messagesFeed.scrollTop = messagesFeed.scrollHeight;
        }, 2000 + Math.random() * 2000);
    }

    function createMessageBubble(text, type) {
        const div = document.createElement('div');
        div.className = `message-bubble ${type}`;

        const sender = type === 'outgoing' ? 'The Wanderer' : getRandomSender();
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Calculate Runic version
        const runicText = text.toLowerCase().split('').map(char => runicMap[char] || char).join('');

        div.innerHTML = `
            ${type === 'incoming' ? '<div class="raven-delivery-icon"><i class="fa-solid fa-crow"></i></div>' : ''}
            <div class="rune-frame">
                <div class="message-content">
                    <div class="sender-name">${sender}</div>
                    <div class="message-text">${text}</div>
                    <div class="message-runic">${runicText}</div>
                    <div class="message-meta">
                        <span class="timestamp">${time}</span>
                        ${type === 'outgoing' ? '<i class="fa-solid fa-check-double read-receipt"></i>' : ''}
                    </div>
                </div>
            </div>
            ${type === 'outgoing' ? '<div class="raven-delivery-icon" style="opacity:0"><i class="fa-solid fa-crow"></i></div>' : ''}
        `;

        return div;
    }

    function addSystemMessage(text) {
        const div = document.createElement('div');
        div.style.textAlign = 'center';
        div.style.margin = '20px 0';
        div.style.color = '#666';
        div.style.fontStyle = 'italic';
        div.style.fontSize = '0.8rem';
        div.innerHTML = `<span style="color: var(--gold-primary)">❖</span> ${text} <span style="color: var(--gold-primary)">❖</span>`;
        messagesFeed.appendChild(div);
    }

    function toggleRunicMode() {
        isRunicMode = !isRunicMode;
        runicToggle.classList.toggle('active');
        
        const runes = document.querySelectorAll('.message-runic');
        const texts = document.querySelectorAll('.message-text');

        runes.forEach(r => {
            r.style.display = isRunicMode ? 'block' : 'none';
        });

        texts.forEach(t => {
            t.style.display = isRunicMode ? 'none' : 'block';
        });
    }

    // --- UTILITIES ---

    function getRandomSender() {
        const senders = ['Thor', 'Loki', 'Frigga', 'Heimdall', 'Tyr', 'Freya', 'Baldr'];
        return senders[Math.floor(Math.random() * senders.length)];
    }

    function getRandomResponse() {
        const responses = [
            "The Norns are weaving a strange fate today.",
            "Did you see the size of that wolf?",
            "Ale is flowing in the hall tonight.",
            "Heimdall sees all, you know.",
            "The Bifrost shimmers with new omens.",
            "Skål to the gods!",
            "I have heard whispers from Jötunheimr.",
            "Fate cannot be changed, only endured."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function createFloatingRunes() {
        // Create ambient background runes
        for (let i = 0; i < 15; i++) {
            const rune = document.createElement('div');
            rune.innerText = Object.values(runicMap)[Math.floor(Math.random() * Object.values(runicMap).length)];
            rune.style.position = 'absolute';
            rune.style.left = Math.random() * 100 + '%';
            rune.style.top = Math.random() * 100 + '%';
            rune.style.color = 'rgba(255, 255, 255, 0.05)';
            rune.style.fontFamily = 'var(--font-runic)';
            rune.style.fontSize = (Math.random() * 2 + 1) + 'rem';
            rune.style.pointerEvents = 'none';
            rune.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
            rune.style.animationDelay = `-${Math.random() * 20}s`;
            floatingRunesBg.appendChild(rune);
        }
    }

    // Add float animation dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.1; }
            90% { opacity: 0.1; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes bifrost-shimmer {
            0% { opacity: 0; }
            50% { opacity: 0.8; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    // Start the engine
    init();
});