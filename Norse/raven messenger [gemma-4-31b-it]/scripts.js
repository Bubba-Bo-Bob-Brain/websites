/**
 * HUGIN & MUNIN - THE DIVINE NETWORK
 * Logic: The Raven's Dispatch & Runic Transliteration
 */

document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const messageScroll = document.getElementById('message-scroll');
    const runeSwitch = document.getElementById('rune-switch');
    const realmNodes = document.querySelectorAll('.tree-node');
    const currentRealmTitle = document.getElementById('current-realm-name');
    const currentRealmDesc = document.getElementById('realm-description');
    const bifrostFlash = document.querySelector('.bifrost-flash');
    const ravenContainer = document.getElementById('raven-animation-container');

    // --- Data: Realm Contexts ---
    const realmData = {
        asgard: { name: "Asgard", desc: "The Golden Realm of the Aesir", color: "#ffd700" },
        midgard: { name: "Midgard", desc: "The Realm of Humanity & Mortals", color: "#4a5d6e" },
        helheim: { name: "Helheim", desc: "The Frozen Realm of the Dead", color: "#a0d2eb" },
        jotunheim: { name: "Jotunheim", desc: "The Land of the Frost Giants", color: "#ffffff" },
        vanaheim: { name: "Vanaheim", desc: "The Lush Home of the Vanir", color: "#00ffcc" }
    };

    // --- Data: Runic Mapping (Simulated Elder Futhark) ---
    const runeMap = {
        'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᚦ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚼ', 
        'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᚩ', 'p': 'ᛈ', 
        'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚠ', 'w': 'ᚹ', 'x': 'ᚲ', 
        'y': 'ᛁ', 'z': 'ᛉ', ' ': ' '
    };

    // --- Logic: Runic Transliteration ---
    const transliterate = (text) => {
        return text.toLowerCase().split('').map(char => runeMap[char] || char).join('');
    };

    runeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('runic-sight');
        const allTexts = document.querySelectorAll('.text-content');
        
        allTexts.forEach(textEl => {
            const original = textEl.getAttribute('data-latin');
            if (runeSwitch.checked) {
                textEl.textContent = transliterate(original);
            } else {
                textEl.textContent = original;
            }
        });
    });

    // --- Logic: Realm Switching & Bifrost Effect ---
    realmNodes.forEach(node => {
        node.addEventListener('click', () => {
            const realmKey = node.getAttribute('data-realm');
            
            // Update Active State
            realmNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            // Bifrost Visual Effect
            bifrostFlash.classList.add('active');
            setTimeout(() => bifrostFlash.classList.remove('active'), 800);

            // Update Content
            currentRealmTitle.textContent = realmData[realmKey].name;
            currentRealmDesc.textContent = realmData[realmKey].desc;
            
            // Clear chat for the new realm (simulated)
            messageScroll.innerHTML = `<div class="message-plaque incoming" data-sender="System">
                <div class="plaque-decoration"></div>
                <div class="message-content">
                    <span class="sender-name">Hugin</span>
                    <p class="text-content" data-latin="Welcome to ${realmData[realmKey].name}. The ravens are watching.">
                        Welcome to ${realmData[realmKey].name}. The ravens are watching.
                    </p>
                </div>
            </div>`;
        });
    });

    // --- Logic: The Raven's Flight Animation ---
    const animateRavenFlight = (startEl, endEl, callback) => {
        const raven = document.createElement('div');
        raven.className = 'flying-raven';
        ravenContainer.appendChild(raven);

        const startRect = startEl.getBoundingClientRect();
        const endRect = endEl.getBoundingClientRect();

        // Initial position
        raven.style.left = `${startRect.left + startRect.width / 2}px`;
        raven.style.top = `${startRect.top + startRect.height / 2}px`;

        // Force reflow
        raven.offsetHeight;

        // Flight path to the active realm node
        raven.style.left = `${endRect.left + endRect.width / 2}px`;
        raven.style.top = `${endRect.top + endRect.height / 2}px`;
        raven.style.transform = 'scale(0.5) rotate(-20deg)';

        setTimeout(() => {
            raven.remove();
            if (callback) callback();
        }, 1200);
    };

    // --- Logic: Sending Messages ---
    const dispatchMessage = () => {
        const text = messageInput.value.trim();
        if (!text) return;

        const activeNode = document.querySelector('.tree-node.active');
        
        // Disable input during flight
        messageInput.disabled = true;
        sendBtn.disabled = true;

        // Start Raven Flight
        animateRavenFlight(sendBtn, activeNode, () => {
            // Create the message plaque
            const plaque = document.createElement('div');
            plaque.className = 'message-plaque outgoing';
            plaque.setAttribute('data-sender', 'User');
            
            plaque.innerHTML = `
                <div class="plaque-decoration"></div>
                <div class="message-content">
                    <span class="sender-name">You</span>
                    <p class="text-content" data-latin="${text}">${runeSwitch.checked ? transliterate(text) : text}</p>
                </div>
            `;

            messageScroll.appendChild(plaque);
            messageScroll.scrollTop = messageScroll.scrollHeight;

            // Re-enable input
            messageInput.disabled = false;
            sendBtn.disabled = false;
            messageInput.value = '';
            messageInput.focus();

            // Simulated response from a God
            setTimeout(simulateGodResponse, 2000);
        });
    };

    const simulateGodResponse = () => {
        const responses = [
            "The runes have foretold this message.",
            "By the beard of Odin, this is unexpected!",
            "Mjölnir shall decide the fate of this conversation.",
            "A riddle for a riddle... what is this you seek?",
            "The Norns weave a strange thread today."
        ];
        const randomText = responses[Math.floor(Math.random() * responses.length)];
        const sender = ["Odin", "Thor", "Freya", "Heimdall", "Loki"][Math.floor(Math.random() * 5)];

        const plaque = document.createElement('div');
        plaque.className = 'message-plaque incoming';
        plaque.setAttribute('data-sender', sender);
        
        plaque.innerHTML = `
            <div class="plaque-decoration"></div>
            <div class="message-content">
                <span class="sender-name">${sender}</span>
                <p class="text-content" data-latin="${randomText}">${runeSwitch.checked ? transliterate(randomText) : randomText}</p>
            </div>
        `;

        messageScroll.appendChild(plaque);
        messageScroll.scrollTop = messageScroll.scrollHeight;
    };

    sendBtn.addEventListener('click', dispatchMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            dispatchMessage();
        }
    });
});