document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION & STATE ---
    const state = {
        currentRealm: 'Asgard',
        isRunicMode: false,
        currentUser: 'All-Father'
    };

    // --- DOM ELEMENTS ---
    const realmItems = document.querySelectorAll('.realm-item');
    const currentRealmName = document.getElementById('current-realm-name');
    const chatFeed = document.getElementById('chat-feed');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const runicToggle = document.getElementById('runic-mode');
    const ravenMessenger = document.getElementById('raven-messenger');
    const bifrostBtn = document.querySelector('.bifrost-btn');
    const snowContainer = document.getElementById('snow-container');

    // --- RUNIC TRANSLITERATION MAP (Elder Futhark approximation) ---
    // Used to dynamically generate runic text for new messages
    const runeMap = {
        'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ',
        'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ',
        's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚢ', 'w': 'ᚹ', 'x': 'ᛊ', 'y': 'ᛃ', 'z': 'ᛉ',
        '0': 'ᛟ', '1': 'ᛁ', '2': 'ᛊ', '3': 'ᛏ', '4': 'ᚠ', '5': 'ᚠ', '6': 'ᛊ', '7': 'ᛊ', '8': 'ᚠ', '9': 'ᚠ'
    };

    // --- HELPER FUNCTIONS ---

    /**
     * Transliterates English text to Runic characters
     */
    function translateToRunic(text) {
        return text.toLowerCase().split('').map(char => {
            return runeMap[char] || char; // Return rune or original char if not found
        }).join('');
    }

    /**
     * Generates a timestamp string (e.g., "Dusk", "Night")
     */
    function getMythicalTime() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Morning";
        if (hour >= 12 && hour < 17) return "Mid-day";
        if (hour >= 17 && hour < 21) return "Dusk";
        return "Night";
    }

    /**
     * Creates a new message element and appends it to the chat
     */
    function addMessage(text, sender, type = 'sent') {
        const runicText = translateToRunic(text);
        const time = getMythicalTime();
        
        const messageRow = document.createElement('div');
        messageRow.className = `message-row ${type}`;
        
        // If it's a sent message, we don't need an avatar for the sender in the DOM structure 
        // as per the CSS design (sender is on the right), but let's stick to the HTML structure pattern.
        // The CSS handles alignment.
        
        let avatarHtml = '';
        if (type === 'received') {
            // Random avatar seed based on sender name
            const seed = sender.replace(/\s/g, '').toLowerCase();
            avatarHtml = `
                <div class="message-avatar">
                    <img src="https://picsum.photos/seed/${seed}/50/50" alt="${sender}">
                </div>
            `;
        }

        // Construct HTML content
        messageRow.innerHTML = `
            ${avatarHtml}
            <div class="message-content-wrapper">
                <div class="message-meta">
                    <span class="sender-name" style="${sender === 'Loki' ? 'color: #4a7c59;' : ''}">${sender}</span>
                    <span class="timestamp">${time}</span>
                </div>
                <div class="message-bubble">
                    <div class="knotwork-corner"></div>
                    <p class="message-text" data-english="${text}">${text}</p>
                    <div class="message-translation">${runicText}</div>
                </div>
            </div>
        `;

        chatFeed.appendChild(messageRow);
        scrollToBottom();
    }

    /**
     * Scrolls the chat container to the bottom
     */
    function scrollToBottom() {
        chatFeed.scrollTop = chatFeed.scrollHeight;
    }

    /**
     * Triggers the raven flying animation
     */
    function triggerRaven() {
        // Reset animation
        ravenMessenger.classList.remove('flying');
        // Trigger reflow
        void ravenMessenger.offsetWidth;
        // Start animation
        ravenMessenger.classList.add('flying');
    }

    /**
     * Simulates switching realms with a Bifrost flash effect
     */
    function switchRealm(realmName, element) {
        if (realmName === state.currentRealm) return;

        // 1. Update State
        state.currentRealm = realmName;

        // 2. Update Sidebar UI
        realmItems.forEach(item => item.classList.remove('active'));
        element.classList.add('active');

        // 3. Trigger Bifrost Flash (Full screen overlay effect via class on body or container)
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)';
        flash.style.opacity = '0.8';
        flash.style.zIndex = '2000';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 1s ease-out';
        document.querySelector('.app-container').appendChild(flash);

        // 4. Update Header
        currentRealmName.textContent = realmName;
        
        // 5. Clear Chat (Simulating channel change)
        chatFeed.innerHTML = `
            <div class="system-message">
                <span class="rune-separator">ᛟ</span>
                <p>Traveled via Bifrost to ${realmName}</p>
                <span class="rune-separator">ᛟ</span>
            </div>
        `;

        // 6. Fade out flash
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 1000);
        }, 100);
    }

    /**
     * Creates ambient snow particles for Niflheim feel
     */
    function createSnow() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
        snowflake.style.opacity = Math.random();
        snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
        
        // Add inline styles for the animation since we aren't defining it in CSS to keep CSS file clean
        // But let's define a simple keyframe injection or just use a pre-made class
        // For this implementation, we'll add a style tag dynamically for the snow
        snowflake.textContent = '❄';
        
        snowContainer.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove();
        }, 5000);
    }

    // --- EVENT LISTENERS ---

    // 1. Realm Selection
    realmItems.forEach(item => {
        item.addEventListener('click', () => {
            const realm = item.getAttribute('data-realm');
            switchRealm(realm, item);
        });
    });

    // 2. Runic Mode Toggle
    runicToggle.addEventListener('change', (e) => {
        state.isRunicMode = e.target.checked;
        if (state.isRunicMode) {
            chatFeed.classList.add('show-runes');
        } else {
            chatFeed.classList.remove('show-runes');
        }
    });

    // 3. Send Message Logic
    function handleSend() {
        const text = messageInput.value.trim();
        if (text) {
            addMessage(text, state.currentUser, 'sent');
            messageInput.value = '';
            triggerRaven();
            
            // Simulate a reply after a few seconds
            setTimeout(() => {
                const replies = [
                    "Indeed.",
                    "The Norns weave as they will.",
                    "Hail to the All-Father.",
                    "I sense a disturbance in the branches."
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                const senders = ["Heimdall", "Freyja", "Tyr"];
                const randomSender = senders[Math.floor(Math.random() * senders.length)];
                
                addMessage(randomReply, randomSender, 'received');
            }, 3000 + Math.random() * 2000);
        }
    }

    sendBtn.addEventListener('click', handleSend);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // 4. Snow Loop (Atmosphere)
    setInterval(createSnow, 300);

    // --- INITIALIZATION ---
    // Start snow
    for(let i=0; i<20; i++) {
        setTimeout(createSnow, Math.random() * 1000);
    }
    
    console.log("RavenNet Online: Huginn and Muninn are watching.");
});