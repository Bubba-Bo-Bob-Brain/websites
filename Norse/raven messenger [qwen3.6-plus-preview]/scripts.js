document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let currentRealm = 'asgard';
    let isRunic = false;

    // DOM Elements
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendRavenBtn');
    const runicToggle = document.getElementById('runicToggle');
    const bifrostOverlay = document.querySelector('.bifrost-overlay');
    const ravenDelivery = document.getElementById('ravenDelivery');
    const realmTitle = document.getElementById('realmTitle');
    const realmRunic = document.getElementById('realmRunic');
    const realmGod = document.getElementById('realmGod');
    const realmLore = document.getElementById('realmLore');
    const channelBtns = document.querySelectorAll('.channel-btn');

    // Runic Mapping for visual transliteration effect
    const runicMap = {
        'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ',
        'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ',
        'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᛩ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ',
        'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᛉ', 'y': 'ᚣ', 'z': 'ᛉ',
        ' ': ' ', '.': '•', ',': '᛫', '?': '᛭', '!': '᛭', '\'': 'ᛌ'
    };

    /**
     * Converts plain English text to a runic-style visual representation.
     * Not linguistically accurate, but provides immersive visual toggle.
     */
    function toRunic(text) {
        return text.toLowerCase().split('').map(c => runicMap[c] || c).join('');
    }

    // Realm Lore & Metadata
    const realmInfo = {
        asgard: { 
            title: 'Asgard', runic: 'ᚨᛊᚷᚨᚱᛞ', god: 'Odin Allfather', 
            lore: 'Asgard, the shining realm of the Æsir gods, sits at the crown of Yggdrasil. Connected to Midgard by the Bifröst rainbow bridge, it is home to Odin\'s hall of Valhalla, where fallen warriors feast and prepare for Ragnarök.' 
        },
        midgard: { 
            title: 'Midgard', runic: 'ᛗᛁᛞᚷᚨᚱᛞ', god: 'Mortals & Heroes', 
            lore: 'Midgard, the realm of humanity, lies at the center of the world tree. Protected by the ocean and guarded by the giants, it is where the gods walk disguised among men, and where fate is woven by the Norns.' 
        },
        helheim: { 
            title: 'Helheim', runic: 'ᚺᛖᛚᚺᛖᛁᛗ', god: 'Hel, Daughter of Loki', 
            lore: 'Helheim, the cold and misty realm of the dead, lies beneath the third root of Yggdrasil. Here dwell those who died of sickness or old age, ruled by the pale goddess Hel, who is neither cruel nor kind.' 
        },
        jotunheim: { 
            title: 'Jötunheim', runic: 'ᛃᛟᛏᚢᚾᚺᛖᛁᛗ', god: 'Thrym & Skrymir', 
            lore: 'Jötunheim, the land of the frost giants, is a realm of jagged mountains and endless winter. The giants dwell here, constantly plotting against Asgard, waiting for the day they will march at Ragnarök.' 
        },
        vanaheim: { 
            title: 'Vanaheim', runic: 'ᚹᚨᚾᚨᚺᛖᛁᛗ', god: 'Njord & Freyr', 
            lore: 'Vanaheim is the fertile homeland of the Vanir, the gods of nature, fertility, and magic. After the Aesir-Vanir war, hostages were exchanged, but Vanaheim remains a realm of deep wisdom and ancient seiðr.' 
        },
        alfheim: { 
            title: 'Álfheim', runic: 'ᚨᛚᚠᚺᛖᛁᛗ', god: 'Freyr, Lord of Elves', 
            lore: 'Álfheim shines with ethereal light, home to the Ljósálfar, the light elves. More beautiful than the sun, they tend to the plants and magic of the world, unseen by mortal eyes.' 
        },
        nidavellir: { 
            title: 'Niðavellir', runic: 'ᚾᛁᛞᚨᚹᛖᛚᛚᛁᚱ', god: 'Brokkr & Eitri', 
            lore: 'Niðavellir, the realm of the dwarves, lies deep underground in caverns of gold and gemstone. Here the master smiths forge the gods\' greatest treasures: Mjölnir, Gungnir, and Draupnir.' 
        },
        muspelheim: { 
            title: 'Múspellsheim', runic: 'ᛗᚢᛊᛒᛖᛚᚺᛖᛁᛗ', god: 'Surtr the Fire Giant', 
            lore: 'Múspellsheim is the primordial realm of fire, guarded by the giant Surtr who wields a flaming sword. It lies at the southern edge of creation, and its flames will eventually consume the world at Ragnarök.' 
        }
    };

    // Initialize Application
    init();

    function init() {
        setupEventListeners();
        applyRunicState();
        scrollToBottom();
    }

    function setupEventListeners() {
        // Channel switching
        channelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const realm = btn.dataset.realm;
                if (realm !== currentRealm) {
                    switchRealm(realm);
                }
            });
        });

        // Runic toggle
        runicToggle.addEventListener('click', () => {
            isRunic = !isRunic;
            runicToggle.classList.toggle('active', isRunic);
            runicToggle.setAttribute('aria-pressed', isRunic);
            applyRunicState();
        });

        // Send message
        sendBtn.addEventListener('click', handleSendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }

    /**
     * Switches active realm with Bifrost transition effect
     */
    function switchRealm(realm) {
        currentRealm = realm;
        
        // Update UI state for sidebar channels
        channelBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.realm === realm);
        });

        // Trigger Bifrost shimmer
        bifrostOverlay.classList.add('active');

        // Swap content mid-transition
        setTimeout(() => {
            const info = realmInfo[realm];
            realmTitle.textContent = info.title;
            realmRunic.textContent = info.runic;
            realmGod.textContent = info.god;
            realmLore.textContent = info.lore;
            
            // Clear chat and inject realm entry message
            messagesContainer.innerHTML = '';
            addSystemMessage(`The ravens descend upon ${info.title}. The ancient wards acknowledge your presence.`, realm);
            
            scrollToBottom();
            
            // Fade out Bifrost
            setTimeout(() => {
                bifrostOverlay.classList.remove('active');
            }, 300);
        }, 400);
    }

    /**
     * Handles message submission with raven delivery animation
     */
    function handleSendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        // Temporarily disable input during flight
        messageInput.disabled = true;
        sendBtn.disabled = true;

        // Trigger Raven Flight animation
        triggerRavenFlight();

        // Wait for animation to deliver message
        setTimeout(() => {
            addMessage('You', 'Raven Bearer', text, toRunic(text), currentRealm);
            messageInput.value = '';
            messageInput.disabled = false;
            sendBtn.disabled = false;
            messageInput.focus();
            scrollToBottom();
        }, 1600);
    }

    /**
     * Triggers the CSS keyframe animation for the flying raven
     */
    function triggerRavenFlight() {
        ravenDelivery.classList.add('flying');
        setTimeout(() => {
            ravenDelivery.classList.remove('flying');
        }, 1800);
    }

    /**
     * Adds a system/lore message to the chat
     */
    function addSystemMessage(text, realm) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-group';
        msgDiv.innerHTML = `
            <div class="message-content" style="width: 100%; text-align: center; opacity: 0.7;">
                <div class="message-header" style="justify-content: center;">
                    <span class="sender-title">System</span>
                    <span class="message-time">Now</span>
                </div>
                <div class="message-bubble" style="background: rgba(20,12,6,0.4); border-style: dashed;">
                    <div class="message-text"></div>
                </div>
            </div>
        `;
        const textEl = msgDiv.querySelector('.message-text');
        textEl.dataset.plain = text;
        textEl.dataset.runic = toRunic(text);
        textEl.textContent = isRunic ? textEl.dataset.runic : text;
        if (isRunic) textEl.classList.add('runic-active');
        messagesContainer.appendChild(msgDiv);
    }

    /**
     * Adds a user or character message bubble
     */
    function addMessage(sender, title, plainText, runicText, realm) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-group';
        
        // Simple avatar SVG
        const avatarSvg = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="var(--wood-medium)" stroke="var(--iron)" stroke-width="1"/><circle cx="20" cy="16" r="5" fill="var(--iron-dark)"/><path d="M10,28 C10,24 15,22 20,22 C25,22 30,24 30,28" fill="var(--iron-dark)"/></svg>`;
        
        msgDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-ring"></div>
                ${avatarSvg}
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">${sender}</span>
                    <span class="sender-title">${title}</span>
                    <span class="message-time">Just now</span>
                </div>
                <div class="message-bubble knotwork-border">
                    <svg class="knotwork-corner" viewBox="0 0 30 30" aria-hidden="true" preserveAspectRatio="none">
                        <path d="M0,0 L30,0 L30,5 L5,5 L5,30 L0,30 Z" fill="var(--iron-dark)"/>
                    </svg>
                    <div class="message-text"></div>
                </div>
            </div>
        `;
        
        const textEl = msgDiv.querySelector('.message-text');
        textEl.dataset.plain = plainText;
        textEl.dataset.runic = runicText;
        textEl.textContent = isRunic ? runicText : plainText;
        if (isRunic) textEl.classList.add('runic-active');
        
        messagesContainer.appendChild(msgDiv);
    }

    /**
     * Applies current runic mode state to all visible messages
     */
    function applyRunicState() {
        const texts = messagesContainer.querySelectorAll('.message-text');
        texts.forEach(el => applyRunicToElement(el));
    }

    function applyRunicToElement(el) {
        if (isRunic) {
            el.textContent = el.dataset.runic || toRunic(el.dataset.plain);
            el.classList.add('runic-active');
        } else {
            el.textContent = el.dataset.plain;
            el.classList.remove('runic-active');
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});