// scripts.js
class OdinMessenger {
    constructor() {
        this.currentRealm = 'asgard';
        this.runeMode = false;
        this.messageQueue = [];
        this.isProcessing = false;
        this.ravenPositions = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeRavenPositions();
        this.loadMessages();
        this.startAmbientEffects();
    }

    setupEventListeners() {
        // Realm selector
        const realmSelect = document.getElementById('realmSelect');
        realmSelect.addEventListener('change', (e) => this.switchRealm(e.target.value));

        // Send message
        const sendButton = document.getElementById('sendButton');
        sendButton.addEventListener('click', () => this.sendMessage());

        // Keyboard shortcut
        const messageInput = document.getElementById('messageInput');
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.sendMessage();
            }
        });

        // Rune toggle
        const runeToggle = document.getElementById('runeToggle');
        runeToggle.addEventListener('change', (e) => {
            this.runeMode = e.target.checked;
            this.updateToggleLabel();
        });

        // Auto-focus input
        messageInput.focus();
    }

    initializeRavenPositions() {
        const realms = ['asgard', 'midgard', 'helheim', 'alfheim', 'jotunheim', 'muspelheim', 'niflheim', 'valhalla'];
        realms.forEach((realm, index) => {
            this.ravenPositions[realm] = {
                x: 10 + (index * 12) % 80,
                y: 20 + Math.floor(index / 8) * 15
            };
        });
    }

    switchRealm(realm) {
        this.currentRealm = realm;
        const realmNames = {
            'asgard': 'Asgard',
            'midgard': 'Midgard',
            'helheim': 'Helheim',
            'alfheim': 'Alfheim',
            'jotunheim': 'Jotunheim',
            'muspelheim': 'Muspelheim',
            'niflheim': 'Niflheim',
            'valhalla': 'Valhalla'
        };

        const realmElement = document.getElementById('currentRealm');
        realmElement.textContent = realmNames[realm];
        
        // Bifrost shimmer effect
        this.triggerBifrostEffect();
        
        // Update realm-specific messages
        this.addSystemMessage(`Realm shifted to ${realmNames[realm]}`, realm);
    }

    triggerBifrostEffect() {
        const bifrost = document.getElementById('bifrostOverlay');
        bifrost.style.animation = 'none';
        bifrost.offsetHeight; // Trigger reflow
        bifrost.style.animation = 'bifrostShimmer 0.8s ease-out';
        
        // Remove after animation
        setTimeout(() => {
            bifrost.style.animation = '';
        }, 800);
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageData = {
            text: message,
            realm: this.currentRealm,
            timestamp: timestamp,
            id: Date.now()
        };

        // Add to queue for raven delivery
        this.messageQueue.push(messageData);
        
        // Clear input
        input.value = '';
        input.focus();
        
        // Process queue
        this.processMessageQueue();
    }

    async processMessageQueue() {
        if (this.isProcessing || this.messageQueue.length === 0) return;
        
        this.isProcessing = true;
        const message = this.messageQueue.shift();
        
        // Animate raven delivery
        await this.animateRavenDelivery(message.realm);
        
        // Create message bubble
        this.createMessageBubble(message);
        
        // Store in localStorage
        this.saveMessage(message);
        
        this.isProcessing = false;
        
        // Process next message
        setTimeout(() => this.processMessageQueue(), 500);
    }

    async animateRavenDelivery(realm) {
        // Create raven element
        const raven = document.createElement('div');
        raven.className = 'delivery-raven';
        raven.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 30px;
            height: 25px;
            z-index: 9999;
            pointer-events: none;
        `;
        raven.innerHTML = `
            <div style="width:25px;height:15px;background:#1a1a1a;border-radius:50% 50% 40% 40%;position:absolute;top:5px;left:2px;">
                <div style="width:18px;height:10px;background:#1a1a1a;border-radius:50%;position:absolute;top:7px;left:3px;"></div>
            </div>
            <div style="width:3px;height:15px;background:#1a1a1a;position:absolute;bottom:-10px;left:12px;transform:rotate(20deg);"></div>
        `;
        
        document.body.appendChild(raven);
        
        // Animate flight path
        const pathDuration = 1000;
        const startX = window.innerWidth - 20;
        const startY = 20;
        const endX = this.ravenPositions[this.currentRealm]?.x || 100;
        const endY = this.ravenPositions[this.currentRealm]?.y || 50;
        
        raven.style.left = startX + 'px';
        raven.style.top = startY + 'px';
        
        await this.animateElement(raven, {
            left: endX + 'px',
            top: endY + 'px'
        }, pathDuration, 'ease-out');
        
        // Remove raven
        setTimeout(() => {
            if (raven.parentNode) {
                raven.parentNode.removeChild(raven);
            }
        }, 300);
    }

    animateElement(element, properties, duration, easing = 'ease') {
        return new Promise((resolve) => {
            const start = {};
            const end = {};
            const keys = Object.keys(properties);
            
            keys.forEach(key => {
                const startValue = parseFloat(getComputedStyle(element)[key.replace(/([A-Z])/g, '-$1').toLowerCase()]);
                start[key] = isNaN(startValue) ? 0 : startValue;
                end[key] = parseFloat(properties[key]);
            });
            
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeProgress = this.easeFunction(progress, easing);
                
                keys.forEach(key => {
                    const currentValue = start[key] + (end[key] - start[key]) * easeProgress;
                    element.style[key] = currentValue + (key.includes('left') || key.includes('right') ? 'px' : '');
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    easeFunction(t, type = 'ease') {
        switch(type) {
            case 'ease-out': return 1 - Math.pow(1 - t, 3);
            case 'ease-in': return Math.pow(t, 3);
            default: return t;
        }
    }

    createMessageBubble(message) {
        const chatHistory = document.getElementById('chatHistory');
        
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${message.realm === this.currentRealm ? 'ally' : 'enemy'}`;
        
        if (this.runeMode) {
            const runeText = this.textToRunes(message.text);
            bubble.classList.add('rune-mode');
            bubble.setAttribute('data-rune-text', runeText);
            bubble.textContent = message.text;
        } else {
            bubble.textContent = message.text;
        }
        
        // Add rune decorations to bubble
        const runeDecoration = document.createElement('span');
        runeDecoration.className = 'rune-decoration';
        runeDecoration.textContent = 'ᛝ';
        bubble.appendChild(runeDecoration);
        
        // Set animation delay for staggered reveal
        const messages = chatHistory.querySelectorAll('.message-bubble');
        bubble.style.animationDelay = `${messages.length * 0.1}s`;
        
        chatHistory.appendChild(bubble);
        
        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        // Add to chat history with timestamp
        this.addToChatHistory(message);
    }

    textToRunes(text) {
        const runeMap = {
            'a': 'ᚪ', 'b': 'ᛒ', 'c': 'ᚳ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ',
            'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛄ', 'k': 'ᚲ', 'l': 'ᛚ',
            'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᚩ', 'p': 'ᛈ', 'q': 'ᚳ', 'r': 'ᚱ',
            's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚠ', 'w': 'ᚹ', 'x': 'ᚷ',
            'y': 'ᛇ', 'z': 'ᛉ', ' ': ' ',
            '0': 'ᚠ', '1': 'ᚢ', '2': 'ᚦ', '3': 'ᚨ', '4': 'ᚱ',
            '5': 'ᚲ', '6': 'ᚷ', '7': 'ᛞ', '8': 'ᛟ', '9': 'ᛈ'
        };
        
        return text.toLowerCase().split('').map(char => runeMap[char] || char).join('');
    }

    addToChatHistory(message) {
        const chatHistory = document.getElementById('chatHistory');
        
        // Create timestamp element
        const timestampEl = document.createElement('span');
        timestampEl.className = 'message-timestamp';
        timestampEl.textContent = message.timestamp;
        timestampEl.style.cssText = `
            font-size: 0.7rem;
            color: var(--iron-bright);
            margin-left: 10px;
            opacity: 0.7;
        `;
        
        // Insert timestamp before message
        const lastMessage = chatHistory.lastChild;
        if (lastMessage && !lastMessage.classList.contains('system-message')) {
            lastMessage.appendChild(timestampEl);
        }
    }

    addSystemMessage(text, realm) {
        const chatHistory = document.getElementById('chatHistory');
        
        const systemMsg = document.createElement('div');
        systemMsg.className = 'system-message';
        systemMsg.innerHTML = `
            <span class="rune-icon">ᛟ</span>
            <span class="message-text">${text}</span>
            <span class="rune-icon">ᛟ</span>
        `;
        
        // Add subtle animation
        systemMsg.style.opacity = '0';
        systemMsg.style.transform = 'translateY(10px)';
        
        chatHistory.appendChild(systemMsg);
        
        setTimeout(() => {
            systemMsg.style.transition = 'all 0.5s ease';
            systemMsg.style.opacity = '1';
            systemMsg.style.transform = 'translateY(0)';
        }, 10);
        
        // Store in localStorage
        this.saveMessage({
            text: text,
            realm: realm,
            timestamp: new Date().toLocaleTimeString(),
            system: true
        });
    }

    saveMessage(message) {
        let messages = JSON.parse(localStorage.getItem('odinMessages') || '[]');
        messages.push(message);
        localStorage.setItem('odinMessages', JSON.stringify(messages));
    }

    loadMessages() {
        const messages = JSON.parse(localStorage.getItem('odinMessages') || '[]');
        messages.forEach(msg => {
            if (!msg.system) {
                this.createMessageBubble(msg);
            } else {
                this.addSystemMessage(msg.text, msg.realm);
            }
        });
    }

    startAmbientEffects() {
        // Random raven appearances
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.spawnRandomRaven();
            }
        }, 5000);
        
        // Ambient rune glow
        setInterval(() => {
            this.animateRunes();
        }, 3000);
    }

    spawnRandomRaven() {
        const raven = document.createElement('div');
        raven.className = 'ambient-raven';
        raven.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}vh;
            right: -50px;
            width: 25px;
            height: 20px;
            z-index: 9998;
            pointer-events: none;
            opacity: 0.7;
        `;
        raven.innerHTML = `
            <div style="width:20px;height:12px;background:#1a1a1a;border-radius:50% 50% 40% 40%;position:absolute;top:4px;left:2px;">
                <div style="width:14px;height:8px;background:#1a1a1a;border-radius:50%;position:absolute;top:6px;left:2px;"></div>
            </div>
        `;
        
        document.body.appendChild(raven);
        
        // Animate across screen
        this.animateElement(raven, {
            right: '100px',
            opacity: '0'
        }, 3000, 'linear');
        
        setTimeout(() => {
            if (raven.parentNode) raven.parentNode.removeChild(raven);
        }, 3000);
    }

    animateRunes() {
        const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᛞ'];
        const randomRune = runes[Math.floor(Math.random() * runes.length)];
        
        const el = document.createElement('div');
        el.textContent = randomRune;
        el.style.cssText = `
            position: fixed;
            top: ${20 + Math.random() * 100}px;
            left: ${20 + Math.random() * 100}vw;
            font-size: ${12 + Math.random() * 16}px;
            color: rgba(232, 200, 78, ${0.1 + Math.random() * 0.3});
            pointer-events: none;
            z-index: 9997;
            animation: floatUp 3s ease-out forwards;
        `;
        
        // Add float animation
        if (!document.querySelector('#floatUpStyle')) {
            const style = document.createElement('style');
            style.id = 'floatUpStyle';
            style.textContent = `
                @keyframes floatUp {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(el);
        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 3000);
    }

    updateToggleLabel() {
        const label = document.querySelector('.toggle-label');
        label.textContent = this.runeMode ? 'ᛟ' : 'ᚱᚢᚾᛁᚳ';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OdinMessenger();
});

// Add global error handling
window.addEventListener('error', (e) => {
    console.warn('Odin Messenger encountered an omen:', e.error);
});