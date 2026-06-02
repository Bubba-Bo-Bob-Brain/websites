/* ============================================
   ODIN'S RAVENS — NORSE REALM MESSENGER
   JavaScript Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // STATE MANAGEMENT
    // ========================================

    const state = {
        currentRealm: 'asgard',
        runicMode: false,
        isSending: false,
        emberInterval: null,
        typingTimeout: null,
    };

    // ========================================
    // DATA — REALMS
    // ========================================

    const realms = {
        asgard: {
            name: 'Asgard',
            channelName: 'Asgard — Halls of Valhalla',
            description: 'Where the Aesir gods convene and the einherjar feast',
            rune: 'ᚨ',
            color: '#ffd700',
            themeClass: 'realm-theme-asgard',
        },
        midgard: {
            name: 'Midgard',
            channelName: 'Midgard — The Mortal Realm',
            description: 'The middle earth where mortals dwell and heroes rise',
            rune: 'ᛗ',
            color: '#8bc34a',
            themeClass: 'realm-theme-midgard',
        },
        helheim: {
            name: 'Helheim',
            channelName: 'Helheim — The Frozen Depths',
            description: 'Where the dishonored dead wander in eternal mist',
            rune: 'ᚺ',
            color: '#311b92',
            themeClass: 'realm-theme-helheim',
        },
        vanaheim: {
            name: 'Vanaheim',
            channelName: 'Vanaheim — Fertile Lands',
            description: 'Home of the Vanir, where nature magic flows freely',
            rune: 'ᚹ',
            color: '#4caf50',
            themeClass: 'realm-theme-vanaheim',
        },
        jotunheim: {
            name: 'Jotunheim',
            channelName: 'Jotunheim — Mountain Peaks',
            description: 'The rugged realm of the frost giants and ancient wisdom',
            rune: 'ᛃ',
            color: '#78909c',
            themeClass: 'realm-theme-jotunheim',
        },
        alfheim: {
            name: 'Alfheim',
            channelName: 'Alfheim — Radiant Glades',
            description: 'The luminous realm of the light elves and starlit beauty',
            rune: 'ᛚ',
            color: '#e0e0ff',
            themeClass: 'realm-theme-alfheim',
        },
        muspelheim: {
            name: 'Muspelheim',
            channelName: 'Muspelheim — Sea of Flames',
            description: 'The primordial realm of fire, home of Surtr and his kin',
            rune: 'ᛗ',
            color: '#ff5722',
            themeClass: 'realm-theme-muspelheim',
        },
        svartalfheim: {
            name: 'Svartalfheim',
            channelName: 'Svartalfheim — Forges Below',
            description: 'The underground domain of master craftsmen and dark elves',
            rune: 'ᛊ',
            color: '#7b1fa2',
            themeClass: 'realm-theme-svartalfheim',
        },
        nidavellir: {
            name: 'Nidavellir',
            channelName: 'Nidavellir — Stone Halls',
            description: 'The deep caverns where dwarves forge legendary artifacts',
            rune: 'ᚾ',
            color: '#ff8f00',
            themeClass: 'realm-theme-nidavellir',
        },
    };

    // ========================================
    // DATA — MEMBERS
    // ========================================

    const members = [
        { id: 1, name: 'Odin Allfather', title: 'King of Asgard', rune: 'ᛟ', realm: 'asgard', status: 'online' },
        { id: 2, name: 'Thor Odinson', title: 'God of Thunder', rune: 'ᚦ', realm: 'asgard', status: 'online' },
        { id: 3, name: 'Freya', title: 'Goddess of Love & War', rune: 'ᚠ', realm: 'vanaheim', status: 'online' },
        { id: 4, name: 'Loki', title: 'Trickster God', rune: 'ᛚ', realm: 'jotunheim', status: 'away' },
        { id: 5, name: 'Heimdall', title: 'Watchman of the Gods', rune: 'ᚺ', realm: 'asgard', status: 'online' },
        { id: 6, name: 'Tyr', title: 'God of War & Justice', rune: 'ᛏ', realm: 'asgard', status: 'offline' },
        { id: 7, name: 'Frigg', title: 'Queen of Asgard', rune: 'ᚠ', realm: 'asgard', status: 'online' },
        { id: 8, name: 'Bragi', title: 'God of Poetry', rune: 'ᛒ', realm: 'asgard', status: 'away' },
        { id: 9, name: 'Hel', title: 'Ruler of the Dead', rune: 'ᚺ', realm: 'helheim', status: 'online' },
        { id: 10, name: 'Surtr', title: 'Fire Giant King', rune: 'ᛊ', realm: 'muspelheim', status: 'offline' },
        { id: 11, name: 'Freyr', title: 'God of Prosperity', rune: 'ᚠ', realm: 'vanaheim', status: 'online' },
        { id: 12, name: 'Njord', title: 'God of Sea & Wind', rune: 'ᚾ', realm: 'vanaheim', status: 'online' },
        { id: 13, name: 'Sif', title: 'Goddess of Harvest', rune: 'ᛊ', realm: 'asgard', status: 'away' },
        { id: 14, name: 'Balder', title: 'God of Light', rune: 'ᛒ', realm: 'asgard', status: 'offline' },
        { id: 15, name: 'Modi & Magni', title: "Thor's Sons", rune: 'ᛗ', realm: 'asgard', status: 'online' },
        { id: 16, name: 'Brokkr', title: 'Master Smith', rune: 'ᛒ', realm: 'nidavellir', status: 'online' },
        { id: 17, name: 'Eitri', title: 'Dwarven Craftsman', rune: 'ᛖ', realm: 'nidavellir', status: 'away' },
        { id: 18, name: 'Skirnir', title: 'Freyr\'s Servant', rune: 'ᛊ', realm: 'alfheim', status: 'online' },
    ];

    // ========================================
    // DATA — RUNIC TRANSLITERATION MAP
    // ========================================

    const runeMap = {
        'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ',
        'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ',
        'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ',
        'p': 'ᛈ', 'q': 'ᛩ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ',
        'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᛉ', 'y': 'ᚤ',
        'z': 'ᛉ', 'th': 'ᚦ', 'ng': 'ᛜ', ' ': ' ',
    };

    const reverseRuneMap = {};
    Object.entries(runeMap).forEach(([latin, rune]) => {
        if (latin.length === 1 && rune !== ' ') {
            reverseRuneMap[rune] = latin;
        }
    });

    // ========================================
    // DATA — SAMPLE MESSAGES
    // ========================================

    const sampleMessages = {
        asgard: [
            { author: 'Odin Allfather', rune: 'ᛟ', realm: 'asgard', text: 'Hugin and Munin fly at dawn. What tidings do they bring from the mortal realm today?', time: '09:12', own: false },
            { author: 'Thor Odinson', rune: 'ᚦ', realm: 'asgard', text: 'Father, the giants stir in Jotunheim. I sensed Mjolnir hum with anticipation this morning.', time: '09:15', own: false },
            { author: 'You', rune: 'ᛗ', realm: 'midgard', text: 'Greetings from Midgard! The mortals speak of strange lights in the northern sky.', time: '09:18', own: true },
            { author: 'Freya', rune: 'ᚠ', realm: 'vanaheim', text: 'Those lights are the Valkyries returning from their nightly rides. All is well, traveler.', time: '09:20', own: false },
            { author: 'Heimdall', rune: 'ᚺ', realm: 'asgard', text: 'I see all that transpires. The Bifrost stands ready, and the Nine Realms remain in balance.', time: '09:22', own: false },
            { author: 'Bragi', rune: 'ᛒ', realm: 'asgard', text: 'A new saga unfolds! Shall I compose verses about these strange omens?', time: '09:25', own: false },
        ],
        midgard: [
            { author: 'You', rune: 'ᛗ', realm: 'midgard', text: 'The harvest festival approaches! Any divine blessings for our village?', time: '14:30', own: true },
            { author: 'Freyr', rune: 'ᚠ', realm: 'vanaheim', text: 'My blessings upon your crops! Let the fields overflow with golden grain this season.', time: '14:35', own: false },
            { author: 'Njord', rune: 'ᚾ', realm: 'vanaheim', text: 'Fair winds shall guide your ships and calm seas shall bring bounty from the deep.', time: '14:38', own: false },
            { author: 'Sif', rune: 'ᛊ', realm: 'asgard', text: 'My golden hair was once my shame, but now it reminds me that beauty returns after hardship. Your fields shall flourish.', time: '14:42', own: false },
        ],
        helheim: [
            { author: 'Hel', rune: 'ᚺ', realm: 'helheim', text: 'Welcome, living one. Few dare to send their words to this realm. Speak your purpose.', time: '03:00', own: false },
            { author: 'You', rune: 'ᛗ', realm: 'midgard', text: 'Great Hel, I seek wisdom about the passing of my ancestors. Do they rest well?', time: '03:05', own: true },
            { author: 'Hel', rune: 'ᚺ', realm: 'helheim', text: 'The dead remember, and they watch over you. Light a candle at the crossroads, and they shall know your love endures.', time: '03:08', own: false },
        ],
        vanaheim: [
            { author: 'Freya', rune: 'ᚠ', realm: 'vanaheim', text: 'The seiðr magic flows strong today. Who among you wishes to learn the ancient ways?', time: '11:00', own: false },
            { author: 'Freyr', rune: 'ᚠ', realm: 'vanaheim', text: 'Sister, let us share the secrets of prosperity with those who honor the old ways.', time: '11:05', own: false },
            { author: 'Njord', rune: 'ᚾ', realm: 'vanaheim', text: 'The tides whisper of distant lands and treasures yet undiscovered. Adventure calls!', time: '11:10', own: false },
        ],
        jotunheim: [
            { author: 'Loki', rune: 'ᛚ', realm: 'jotunheim', text: 'What trickery shall we devise today? The Aesir grow complacent...', time: '16:45', own: false },
            { author: 'You', rune: 'ᛗ', realm: 'midgard', text: 'Loki, your schemes are legendary! Any advice for a clever mortal?', time: '16:50', own: true },
            { author: 'Loki', rune: 'ᛚ', realm: 'jotunheim', text: 'Cleverness, dear mortal, is knowing when to speak and when to smile. The tongue is mightier than the sword... usually.', time: '16:52', own: false },
        ],
        alfheim: [
            { author: 'Skirnir', rune: 'ᛊ', realm: 'alfheim', text: 'The eternal twilight of Alfheim bathes all in silver and starlight. What brings you to our radiant halls?', time: '20:00', own: false },
            { author: 'You', rune: 'ᛗ', realm: 'midgard', text: 'I have heard tales of the light elves\' unmatched beauty and grace. Is it true you dance among the stars?', time: '20:05', own: true },
            { author: 'Skirnir', rune: 'ᛊ', realm: 'alfheim', text: 'We dance where the aurora meets the heavens. Perhaps one day, you shall join us in the realm beyond mortal sight.', time: '20:08', own: false },
        ],
        muspelheim: [
            { author: 'Surtr', rune: 'ᛊ', realm: 'muspelheim', text: 'The flames of Muspelheim burn eternal. When Ragnarok comes, I shall set the world ablaze!', time: '12:00', own: false },
            { author: 'You', rune: 'ᛗ', realm: 'midgard', text: 'Great Surtr, must the world truly end in fire?', time: '12:05', own: true },
            { author: 'Surtr', rune: 'ᛊ', realm: 'muspelheim', text: 'From destruction comes renewal. The phoenix rises from ash, and so shall the new world rise from the old.', time: '12:08', own: false },
        ],
        svartalfheim: [
            { author: 'Brokkr', rune: 'ᛒ', realm: 'nidavellir', text: 'My brother Eitri and I have forged wonders! Who needs a weapon of legend?', time: '08:30', own: false },
            { author: 'Eitri', rune: 'ᛖ', realm: 'nidavellir', text: 'The forge burns hot! We crafted Gungnir, Mjolnir, and Brisingamen. What shall we make next?', time: '08:35', own: false },
            { author: 'You', rune: 'ᛗ', realm: 'midgard', text: 'Master smiths, could you forge a blade worthy of a true hero?', time: '08:40', own: true },
        ],
        nidavellir: [
            { author: 'Brokkr', rune: 'ᛒ', realm: 'nidavellir', text: 'A hero\'s blade? Ha! I\'ll craft you something that makes Thor\'s hammer look like a toy!', time: '08:42', own: false },
            { author: 'Eitri', rune: 'ᛖ', realm: 'nidavellir', text: 'The mithril ore from the deepest veins shall be yours. Bring payment in gold and stories!', time: '08:45', own: false },
            { author: 'You', rune: 'ᛗ', realm: 'midgard', text: 'You shall have both! Tales of my adventures and gold from my first dragon slaying.', time: '08:50', own: true },
        ],
    };

    // ========================================
    // DOM ELEMENT REFERENCES
    // ========================================

    const elements = {
        // Containers
        emberLayer: document.getElementById('ember-layer'),
        ravenFlightOverlay: document.getElementById('raven-flight-overlay'),
        bifrostOverlay: document.getElementById('bifrost-overlay'),
        messagesScroll: document.getElementById('messages-scroll'),
        membersList: document.getElementById('members-list'),

        // Header
        realmIndicatorName: document.getElementById('current-realm-name'),
        onlineCount: document.getElementById('online-count'),

        // Chat header
        channelName: document.getElementById('channel-name'),
        channelDescription: document.getElementById('channel-description'),

        // Input
        messageInput: document.getElementById('message-input'),
        sendBtn: document.getElementById('send-btn'),
        runicToggle: document.getElementById('runic-toggle'),
        charCount: document.getElementById('char-count'),
        typingIndicator: document.getElementById('typing-indicator'),

        // Yggdrasil
        yggdrasilSvg: document.getElementById('yggdrasil-svg'),
        realmNodes: document.querySelectorAll('.realm-node'),

        // App container (for theming)
        app: document.getElementById('app'),
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    function transliterateToRunes(text) {
        let result = '';
        const lower = text.toLowerCase();
        let i = 0;
        while (i < lower.length) {
            // Check for 'th' and 'ng' digraphs
            if (i + 1 < lower.length) {
                const digraph = lower.substring(i, i + 2);
                if (runeMap[digraph]) {
                    result += runeMap[digraph];
                    i += 2;
                    continue;
                }
            }
            const char = lower[i];
            result += runeMap[char] || char;
            i++;
        }
        return result;
    }

    function getMemberByAuthor(authorName) {
        return members.find(m => m.name === authorName);
    }

    function getRelativeTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function getRealmTagColor(realm) {
        return realms[realm]?.color || '#888';
    }

    // ========================================
    // EMBER PARTICLE SYSTEM
    // ========================================

    function createEmber() {
        const ember = document.createElement('div');
        ember.classList.add('ember');

        const left = Math.random() * 100;
        const size = 2 + Math.random() * 3;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 5;

        ember.style.left = `${left}%`;
        ember.style.width = `${size}px`;
        ember.style.height = `${size}px`;
        ember.style.animationDuration = `${duration}s`;
        ember.style.animationDelay = `${delay}s`;

        elements.emberLayer.appendChild(ember);

        // Remove ember after animation completes
        setTimeout(() => {
            ember.remove();
        }, (duration + delay) * 1000);
    }

    function startEmberSystem() {
        // Create initial batch
        for (let i = 0; i < 8; i++) {
            setTimeout(createEmber, i * 800);
        }

        // Continue spawning
        state.emberInterval = setInterval(createEmber, 2000);
    }

    // ========================================
    // MESSAGE RENDERING
    // ========================================

    function createMessageElement(message) {
        const isOwn = message.own;
        const member = isOwn ? { rune: 'ᛗ', name: 'You', status: 'online' } : getMemberByAuthor(message.author);
        const runeText = state.runicMode ? transliterateToRunes(message.text) : message.text;
        const realmColor = getRealmTagColor(message.realm);

        const messageEl = document.createElement('div');
        messageEl.classList.add('message');
        if (isOwn) messageEl.classList.add('own');

        messageEl.innerHTML = `
            <div class="message-avatar ${member?.status || 'online'}">
                <span class="avatar-rune">${member?.rune || '?'}</span>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${message.author}</span>
                    <span class="message-realm-tag" style="color: ${realmColor}; border: 1px solid ${realmColor}40; background: ${realmColor}10;">
                        ${realms[message.realm]?.name || message.realm}
                    </span>
                    <span class="message-time">${message.time}</span>
                </div>
                <div class="message-bubble">
                    <div class="message-text ${state.runicMode ? 'runes' : ''}">${runeText}</div>
                </div>
                <div class="message-delivery">
                    <span class="delivery-raven">🐦‍⬛</span>
                    <span>Delivered by ${isOwn ? 'Munin' : 'Hugin'}</span>
                </div>
            </div>
        `;

        return messageEl;
    }

    function renderMessages(realmKey) {
        elements.messagesScroll.innerHTML = '';
        const messages = sampleMessages[realmKey] || [];

        messages.forEach((msg, index) => {
            const msgEl = createMessageElement(msg);
            msgEl.style.animationDelay = `${index * 0.1}s`;
            elements.messagesScroll.appendChild(msgEl);
        });

        scrollToBottom();
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            elements.messagesScroll.scrollTop = elements.messagesScroll.scrollHeight;
        });
    }

    function addNewMessage(text) {
        const message = {
            author: 'You',
            rune: 'ᛗ',
            realm: state.currentRealm,
            text: text,
            time: getRelativeTime(),
            own: true,
        };

        const msgEl = createMessageElement(message);
        elements.messagesScroll.appendChild(msgEl);
        scrollToBottom();
    }

    function updateAllMessagesForRuneMode() {
        const messageTexts = elements.messagesScroll.querySelectorAll('.message-text');
        const messages = sampleMessages[state.currentRealm] || [];

        messageTexts.forEach((el, index) => {
            if (messages[index]) {
                if (state.runicMode) {
                    el.textContent = transliterateToRunes(messages[index].text);
                    el.classList.add('runes');
                } else {
                    el.textContent = messages[index].text;
                    el.classList.remove('runes');
                }
            }
        });
    }

    // ========================================
    // MEMBERS RENDERING
    // ========================================

    function renderMembers() {
        elements.membersList.innerHTML = '';

        members.forEach(member => {
            const memberEl = document.createElement('div');
            memberEl.classList.add('member-item');

            const realmColor = getRealmTagColor(member.realm);

            memberEl.innerHTML = `
                <div class="member-avatar ${member.status}">
                    <span class="member-rune">${member.rune}</span>
                </div>
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-title">${member.title}</div>
                </div>
                <div class="member-realm-dot" style="background: ${realmColor}; box-shadow: 0 0 4px ${realmColor}60;"></div>
            `;

            elements.membersList.appendChild(memberEl);
        });

        updateOnlineCount();
    }

    function updateOnlineCount() {
        const onlineMembers = members.filter(m => m.status === 'online');
        elements.onlineCount.textContent = onlineMembers.length;
    }

    // ========================================
    // REALM SWITCHING
    // ========================================

    function switchRealm(realmKey) {
        if (realmKey === state.currentRealm || state.isSending) return;

        const realm = realms[realmKey];
        if (!realm) return;

        // Store previous realm for comparison
        const prevRealm = state.currentRealm;

        // Update state
        state.currentRealm = realmKey;

        // 1. Trigger Bifrost shimmer effect
        triggerBifrostShimmer();

        // 2. Update realm nodes
        elements.realmNodes.forEach(node => {
            node.classList.remove('active');
            if (node.dataset.realm === realmKey) {
                node.classList.add('active');
            }
        });

        // 3. Update theme class on app container
        elements.app.classList.remove(...Object.values(realms).map(r => r.themeClass).filter(Boolean));
        if (realm.themeClass) {
            elements.app.classList.add(realm.themeClass);
        }

        // 4. Update header info
        elements.realmIndicatorName.textContent = realm.name;
        elements.realmIndicatorName.style.color = realm.color;
        elements.realmIndicatorName.style.textShadow = `0 0 10px ${realm.color}50`;

        // 5. Update chat header
        elements.channelName.textContent = realm.channelName;
        elements.channelDescription.textContent = realm.description;

        // Update the rune circle in the chat header
        const headerRuneText = document.querySelector('.header-rune-text');
        if (headerRuneText) {
            headerRuneText.textContent = realm.rune;
            headerRuneText.setAttribute('fill', realm.color);
        }

        const headerRuneCircle = document.querySelector('.header-rune-circle circle');
        if (headerRuneCircle) {
            headerRuneCircle.setAttribute('stroke', realm.color);
        }

        // 6. Re-render messages for the new realm
        setTimeout(() => {
            renderMessages(realmKey);
        }, 300);

        // 7. Update Yggdrasil tree colors
        updateYggdrasilColors(realmKey, realm.color);
    }

    function updateYggdrasilColors(realmKey, color) {
        // Dim all realm nodes
        elements.realmNodes.forEach(node => {
            const circle = node.querySelector('.realm-circle');
            const innerCircle = node.querySelector('.realm-circle-inner');
            const rune = node.querySelector('.realm-rune');

            if (node.dataset.realm === realmKey) {
                circle.style.stroke = color;
                circle.style.filter = `drop-shadow(0 0 8px ${color}60)`;
                innerCircle.style.stroke = color;
                rune.style.fill = color;
            } else {
                circle.style.stroke = '';
                circle.style.filter = '';
                innerCircle.style.stroke = '';
                rune.style.fill = '';
            }
        });
    }

    // ========================================
    // BIFROST SHIMMER EFFECT
    // ========================================

    function triggerBifrostShimmer() {
        elements.bifrostOverlay.classList.remove('hidden');
        void elements.bifrostOverlay.offsetWidth; // Force reflow
        elements.bifrostOverlay.classList.add('active');

        setTimeout(() => {
            elements.bifrostOverlay.classList.remove('active');
            elements.bifrostOverlay.classList.add('hidden');
        }, 1000);
    }

    // ========================================
    // RAVEN FLIGHT ANIMATION
    // ========================================

    function triggerRavenFlight(callback) {
        if (state.isSending) return;
        state.isSending = true;

        elements.ravenFlightOverlay.classList.remove('hidden');
        void elements.ravenFlightOverlay.offsetWidth;

        // After raven flies across, hide overlay and call callback
        setTimeout(() => {
            elements.ravenFlightOverlay.classList.add('hidden');
            state.isSending = false;
            if (callback) callback();
        }, 2200);
    }

    // ========================================
    // MESSAGE SENDING
    // ========================================

    function sendMessage() {
        const text = elements.messageInput.value.trim();
        if (!text || state.isSending) return;

        // Clear input
        elements.messageInput.value = '';
        elements.charCount.textContent = '0 / 500';
        elements.messageInput.style.height = 'auto';

        // Trigger raven flight and send message
        triggerRavenFlight(() => {
            addNewMessage(text);

            // Simulate a response after a delay
            simulateResponse();
        });
    }

    function simulateResponse() {
        const responses = {
            asgard: [
                { author: 'Thor Odinson', rune: 'ᚦ', text: 'Well spoken, friend of the gods!' },
                { author: 'Frigg', rune: 'ᚠ', text: 'The Allfather watches over your words.' },
                { author: 'Heimdall', rune: 'ᚺ', text: 'Your message crossed the Bifrost without incident.' },
            ],
            midgard: [
                { author: 'Freyr', rune: 'ᚠ', text: 'The Vanir hear your call! May fortune smile upon you.' },
                { author: 'Njord', rune: 'ᚾ', text: 'Fair winds follow those who speak with respect.' },
            ],
            helheim: [
                { author: 'Hel', rune: 'ᚺ', text: 'The dead acknowledge your words. They remember the living.' },
            ],
            vanaheim: [
                { author: 'Freya', rune: 'ᚠ', text: 'The magic of the Vanir flows through your words.' },
                { author: 'Freyr', rune: 'ᚠ', text: 'Nature herself whispers her approval.' },
            ],
            jotunheim: [
                { author: 'Loki', rune: 'ᛚ', text: 'Interesting... very interesting. The trickster finds your words amusing.' },
            ],
            alfheim: [
                { author: 'Skirnir', rune: 'ᛊ', text: 'The light elves send their radiant greetings in return.' },
            ],
            muspelheim: [
                { author: 'Surtr', rune: 'ᛊ', text: 'Even the flames pause to hear your words, mortal.' },
            ],
            svartalfheim: [
                { author: 'Brokkr', rune: 'ᛒ', text: 'Words are well and good, but what about a new commission for the forge?' },
            ],
            nidavellir: [
                { author: 'Eitri', rune: 'ᛖ', text: 'The forges burn bright with inspiration from your message!' },
            ],
        };

        const realmResponses = responses[state.currentRealm] || responses.asgard;
        const randomResponse = realmResponses[Math.floor(Math.random() * realmResponses.length)];

        // Show typing indicator
        setTimeout(() => {
            elements.typingIndicator.textContent = `${randomResponse.author} is carving runes...`;

            setTimeout(() => {
                elements.typingIndicator.textContent = '';

                const message = {
                    author: randomResponse.author,
                    rune: randomResponse.rune,
                    realm: getMemberByAuthor(randomResponse.author)?.realm || state.currentRealm,
                    text: randomResponse.text,
                    time: getRelativeTime(),
                    own: false,
                };

                const msgEl = createMessageElement(message);
                elements.messagesScroll.appendChild(msgEl);
                scrollToBottom();
            }, 1500 + Math.random() * 1000);
        }, 500);
    }

    // ========================================
    // EVENT HANDLERS
    // ========================================

    // Send button click
    elements.sendBtn.addEventListener('click', sendMessage);

    // Enter to send (Shift+Enter for new line)
    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    elements.messageInput.addEventListener('input', () => {
        // Auto-resize
        elements.messageInput.style.height = 'auto';
        elements.messageInput.style.height = Math.min(elements.messageInput.scrollHeight, 120) + 'px';

        // Character count
        const length = elements.messageInput.value.length;
        elements.charCount.textContent = `${length} / 500`;

        // Typing indicator simulation
        if (state.typingTimeout) {
            clearTimeout(state.typingTimeout);
        }

        // Random member typing simulation
        state.typingTimeout = setTimeout(() => {
            const onlineMembers = members.filter(m => m.status === 'online' && m.name !== 'You');
            if (onlineMembers.length > 0 && Math.random() > 0.5) {
                const randomMember = onlineMembers[Math.floor(Math.random() * onlineMembers.length)];
                elements.typingIndicator.textContent = `${randomMember.name} is carving runes...`;

                setTimeout(() => {
                    elements.typingIndicator.textContent = '';
                }, 2000);
            }
        }, 3000);
    });

    // Runic toggle
    elements.runicToggle.addEventListener('click', () => {
        state.runicMode = !state.runicMode;
        elements.runicToggle.classList.toggle('active', state.runicMode);
        updateAllMessagesForRuneMode();
    });

    // Realm node clicks
    elements.realmNodes.forEach(node => {
        node.addEventListener('click', () => {
            const realmKey = node.dataset.realm;
            if (realmKey) {
                switchRealm(realmKey);
            }
        });
    });

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        // Start ember particles
        startEmberSystem();

        // Render members list
        renderMembers();

        // Set initial realm (Asgard)
        switchRealm('asgard');

        // Focus input on load
        elements.messageInput.focus();

        // Add subtle parallax to Yggdrasil on mouse move
        const realmSidebar = document.getElementById('realm-sidebar');
        realmSidebar.addEventListener('mousemove', (e) => {
            const rect = realmSidebar.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            elements.yggdrasilSvg.style.transform = `translate(${x * -5}px, ${y * -3}px)`;
            elements.yggdrasilSvg.style.transition = 'transform 0.3s ease';
        });

        realmSidebar.addEventListener('mouseleave', () => {
            elements.yggdrasilSvg.style.transform = 'translate(0, 0)';
        });

        // Periodic member status changes for realism
        setInterval(() => {
            const offlineMembers = members.filter(m => m.status !== 'online');
            const onlineMembers = members.filter(m => m.status === 'online');

            if (offlineMembers.length > 0 && Math.random() > 0.6) {
                const member = offlineMembers[Math.floor(Math.random() * offlineMembers.length)];
                member.status = 'online';
                renderMembers();
            }

            if (onlineMembers.length > 3 && Math.random() > 0.7) {
                const member = onlineMembers[Math.floor(Math.random() * onlineMembers.length)];
                member.status = Math.random() > 0.5 ? 'away' : 'offline';
                renderMembers();
            }
        }, 8000);

        console.log('ᛟᛞᛁᚾᛊ ᚱᚨᚢᛖᚾᛊ — The ravens are watching...');
    }

    // Start the application
    init();
});