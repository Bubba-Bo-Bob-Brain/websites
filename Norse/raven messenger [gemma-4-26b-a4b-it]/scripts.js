/**
 * Hugin & Munin's Chronicle
 * The Divine Messaging Interface
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Data ---
    const RUNE_MAP = {
        'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚼ',
        'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ',
        'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚢ', 'w': 'ᚹ', 'x': 'ᛉ',
        'y': 'ᛦ', 'z': 'ᛉ', ' ': ' '
    };

    const REALM_DATA = {
        asgard: { name: "Asgard", response: "The Allfather watches your words with keen eyes." },
        midgard: { name: "Midgard", response: "The mortals whisper of your presence in the winds." },
        jotunheim: { name: "Jotunheim", response: "The mountains tremble at your voice." },
        helheim: { name: "Helheim", response: "The cold echoes your message through the mist." }
    };

    // --- State Management ---
    let state = {
        isRunicMode: false,
        currentRealm: 'asgard',
        isTyping: false
    };

    // --- DOM Elements ---
    const elements = {
        chatScroll: document.getElementById('chat-scroll'),
        messageForm: document.getElementById('message-form'),
        messageInput: document.getElementById('message-input'),
        runeToggle: document.getElementById('rune-toggle'),
        realmItems: document.querySelectorAll('.realm-item'),
        bifrost: document.getElementById('bifrost'),
        raven: document.getElementById('raven-messenger'),
        embersContainer: document.getElementById('embers')
    };

    // --- Core Functions ---

    /**
     * Transliterates text to Elder Futhark
     */
    const transliterate = (text) => {
        return text.toLowerCase().split('').map(char => RUNE_MAP[char] || char).join('');
    };

    /**
     * Adds a message to the chat scroll
     * @param {string} text - The message content
     * @param {string} type - 'user', 'god', or 'system'
     */
    const addMessage = (text, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}-message`;

        // We wrap text in a span so we can toggle runic mode without losing original text
        const textSpan = document.createElement('span');
        textSpan.className = 'message-text';
        textSpan.dataset.original = text;
        textSpan.textContent = state.isRunicMode ? transliterate(text) : text;

        msgDiv.appendChild(textSpan);
        elements.chatScroll.appendChild(msgDiv);

        // Auto-scroll to bottom
        elements.chatScroll.scrollTo({
            top: elements.chatScroll.scrollHeight,
            behavior: 'smooth'
        });
    };

    /**
     * Toggles the Runic Sight mode
     */
    const toggleRunicMode = () => {
        state.isRunicMode = !state.isRunicMode;
        elements.runeToggle.classList.toggle('active');
        
        const allTextSpans = document.querySelectorAll('.message-text');
        allTextSpans.forEach(span => {
            const original = span.dataset.original;
            span.textContent = state.isRunicMode ? transliterate(original) : original;
            
            if (state.isRunicMode) {
                span.classList.add('runic-text');
            } else {
                span.classList.remove('runic-text');
            }
        });
    };

    /**
     * Handles realm switching with Bifrost animation
     */
    const switchRealm = (realmKey) => {
        if (state.currentRealm === realmKey) return;

        // Trigger Bifrost
        elements.bifrost.classList.remove('bifrost-active');
        void elements.bifrost.offsetWidth; // Trigger reflow
        elements.bifrost.classList.add('bifrost-active');

        // Update State
        state.currentRealm = realmKey;

        // Update UI
        elements.realmItems.forEach(item => {
            item.classList.toggle('active', item.dataset.realm === realmKey);
        });

        // Add system message for the new realm
        setTimeout(() => {
            addMessage(`You have entered the realm of ${REALM_DATA[realmKey].name}.`, 'system');
        }, 600);
    };

    /**
     * Triggers the Raven Flight animation
     */
    const triggerRavenFlight = () => {
        elements.raven.classList.remove('hidden');
        
        // We use a CSS animation approach via class manipulation
        // The raven flies from left to right
        elements.raven.animate([
            { transform: 'translate(-100px, 0) rotate(10deg)' },
            { transform: 'translate(120vw, -50px) rotate(-10deg)' }
        ], {
            duration: 2000,
            easing: 'ease-in-out'
        }).onfinish = () => {
            elements.raven.classList.add('hidden');
        };
    };

    /**
     * Simulates a response from a deity
     */
    const simulateGodResponse = () => {
        if (state.isTyping) return;
        state.isTyping = true;

        // Delay for "thinking" effect
        setTimeout(() => {
            const response = REALM_DATA[state.currentRealm].response;
            addMessage(response, 'god');
            state.isTyping = false;
        }, 2000);
    };

    /**
     * Creates ambient floating embers
     */
    const createEmber = () => {
        const ember = document.createElement('div');
        ember.className = 'ember';
        
        const size = Math.random() * 4 + 2 + 'px';
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 5 + 5 + 's';
        const delay = Math.random() * 5 + 's';

        ember.style.width = size;
        ember.style.height = size;
        ember.style.left = startX + 'px';
        ember.style.top = '105vh';
        ember.style.animation = `ember-rise ${duration} linear ${delay} infinite`;

        elements.embersContainer.appendChild(ember);

        // Clean up ember after animation to prevent DOM bloat
        setTimeout(() => {
            ember.remove();
        }, 15000);
    };

    // --- Event Listeners ---

    elements.messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = elements.messageInput.value.trim();

        if (text) {
            // 1. Add user message
            addMessage(text, 'user');
            
            // 2. Visual feedback: Raven flies
            triggerRavenFlight();

            // 3. Clear input
            elements.messageInput.value = '';

            // 4. Simulate god response
            simulateGodResponse();
        }
    });

    elements.runeToggle.addEventListener('click', toggleRunicMode);

    elements.realmItems.forEach(item => {
        item.addEventListener('click', () => {
            switchRealm(item.dataset.realm);
        });
    });

    // --- Initialization ---

    // Start Ember Loop
    setInterval(createEmber, 300);

    // Initial System Message
    addMessage("The ravens have returned. The winds of destiny carry new whispers...", 'system');

});