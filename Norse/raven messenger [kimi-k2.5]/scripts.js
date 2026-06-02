/**
 * HUGINN & MUNINN - Divine Messenger Interface
 * JavaScript implementation for the Norse Mythology Messaging System
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // STATE MANAGEMENT
    // ==========================================================================
    const state = {
        currentRealm: 'midgard',
        runicMode: false,
        messageCount: 0,
        ravensActive: false,
        ravenHealth: {
            huginn: 92,
            muninn: 88
        }
    };

    // Realm configurations
    const realmConfig = {
        asgard: { name: 'Asgard', rune: 'ᚨ', title: 'The Realm Eternal', color: '#d4af37' },
        vanaheim: { name: 'Vanaheim', rune: 'ᚹ', title: 'The Green Realm', color: '#2d5016' },
        alfheim: { name: 'Alfheim', rune: 'ᚨ', title: 'Land of the Light Elves', color: '#c0c0c0' },
        midgard: { name: 'Midgard', rune: 'ᛗ', title: 'The Mortal Coil', color: '#4a5d23' },
        jotunheim: { name: 'Jotunheim', rune: 'ᛃ', title: 'Realm of the Giants', color: '#4a6fa5' },
        svartalfheim: { name: 'Svartalfheim', rune: 'ᛋ', title: 'Deep in Stone', color: '#2d1f3d' },
        helheim: { name: 'Helheim', rune: 'ᚺ', title: 'The Underworld', color: '#4a1c1c' }
    };

    // Simple runic transliteration mapping (Elder Futhark approximation)
    const runicMap = {
        'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ',
        'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ',
        'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ',
        'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᚲᛋ', 'y': 'ᛁ', 'z': 'ᛉ', ' ': ' '
    };

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const elements = {
        app: document.getElementById('app'),
        bifrostOverlay: document.getElementById('bifrost-overlay'),
        ravenFlight: document.getElementById('raven-flight-container'),
        messagesContainer: document.getElementById('messages-container'),
        messageInput: document.getElementById('message-input'),
        charCount: document.getElementById('char-count'),
        sendBtn: document.getElementById('send-btn'),
        runicToggle: document.getElementById('runic-toggle'),
        realmNodes: document.querySelectorAll('.realm-node'),
        realmDisplay: document.getElementById('current-realm-display'),
        currentChannel: document.getElementById('current-channel'),
        notificationArea: document.getElementById('notification-area'),
        huginnBar: document.querySelector('.huginn-bar .health-fill'),
        muninnBar: document.querySelector('.muninn-bar .health-fill'),
        attachBtn: document.getElementById('attach-btn')
    };

    // ==========================================================================
    // REALM MANAGEMENT
    // ==========================================================================
    
    function switchRealm(realmKey) {
        if (realmKey === state.currentRealm) return;
        
        const config = realmConfig[realmKey];
        if (!config) return;

        // Trigger Bifrost transition
        triggerBifrostTransition();

        setTimeout(() => {
            // Update state
            state.currentRealm = realmKey;
            
            // Update HTML data attribute for CSS theming
            document.documentElement.setAttribute('data-realm', realmKey);
            
            // Update navigation
            elements.realmNodes.forEach(node => {
                node.classList.remove('active');
                if (node.dataset.realm === realmKey) {
                    node.classList.add('active');
                }
            });
            
            // Update displays
            updateRealmDisplay(config);
            
            // Add realm-specific message
            addSystemMessage(`Traveling to ${config.name}...`);
            
            // Hide Bifrost
            setTimeout(() => {
                elements.bifrostOverlay.classList.add('hidden');
            }, 500);
            
        }, 1000);
    }

    function triggerBifrostTransition() {
        elements.bifrostOverlay.classList.remove('hidden');
        
        // Create particle burst effect
        createBifrostParticles();
    }

    function createBifrostParticles() {
        const particles = elements.bifrostOverlay.querySelector('.bifrost-particles');
        particles.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: hsl(${Math.random() * 60 + 300}, 100%, 70%);
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                border-radius: 50%;
                animation: particleFloat ${Math.random() * 2 + 1}s ease-out forwards;
                opacity: ${Math.random()};
            `;
            particles.appendChild(particle);
        }
    }

    function updateRealmDisplay(config) {
        // Update header indicator
        elements.realmDisplay.innerHTML = `
            <span class="realm-rune">${config.rune}</span>
            <span class="realm-name">${config.name}</span>
        `;
        
        // Update channel title
        elements.currentChannel.textContent = `${config.name} - ${config.title}`;
        
        // Update raven status based on realm difficulty
        updateRavenStatusForRealm(config.name);
    }

    function updateRavenStatusForRealm(realmName) {
        const difficultRealms = ['Jotunheim', 'Helheim', 'Svartalfheim'];
        const isDifficult = difficultRealms.includes(realmName);
        
        if (isDifficult) {
            // Reduce raven health in dangerous realms
            state.ravenHealth.huginn = Math.max(60, state.ravenHealth.huginn - 5);
            state.ravenHealth.muninn = Math.max(55, state.ravenHealth.muninn - 8);
            showNotification('Warning', `The ravens grow weary in ${realmName}...`);
        } else {
            // Recover in safe realms
            state.ravenHealth.huginn = Math.min(100, state.ravenHealth.huginn + 2);
            state.ravenHealth.muninn = Math.min(100, state.ravenHealth.muninn + 2);
        }
        
        updateRavenHealthBars();
    }

    // ==========================================================================
    // MESSAGE SYSTEM
    // ==========================================================================
    
    function sendMessage() {
        const text = elements.messageInput.value.trim();
        if (!text) {
            showNotification('Error', 'The ravens cannot carry empty whispers...');
            return;
        }
        
        if (state.ravenHealth.huginn < 20 || state.ravenHealth.muninn < 20) {
            showNotification('Warning', 'The ravens are too exhausted to fly! Let them rest.');
            return;
        }
        
        // Trigger raven flight animation
        triggerRavenFlight();
        
        // Disable input temporarily
        elements.messageInput.disabled = true;
        elements.sendBtn.disabled = true;
        
        setTimeout(() => {
            // Create and append message
            createMessage(text, 'player');
            
            // Clear input
            elements.messageInput.value = '';
            updateCharCount();
            
            // Consume raven energy
            state.ravenHealth.huginn = Math.max(0, state.ravenHealth.huginn - 3);
            state.ravenHealth.muninn = Math.max(0, state.ravenHealth.muninn - 2);
            updateRavenHealthBars();
            
            // Re-enable input
            elements.messageInput.disabled = false;
            elements.sendBtn.disabled = false;
            elements.messageInput.focus();
            
            // Simulate divine response after delay
            setTimeout(() => {
                simulateDivineResponse();
            }, 2000 + Math.random() * 3000);
            
        }, 1500);
    }

    function createMessage(text, senderType) {
        const messageId = `msg-${++state.messageCount}`;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Generate runic transliteration
        const runicText = transliterateToRunes(text);
        
        const messageHTML = `
            <article class="message ${senderType === 'player' ? 'player-message' : 'divine-message'}" 
                     data-sender="${senderType}" 
                     id="${messageId}">
                <div class="message-frame">
                    <div class="knotwork-corner tl"></div>
                    <div class="knotwork-corner tr"></div>
                    <div class="knotwork-corner bl"></div>
                    <div class="knotwork-corner br"></div>
                    <div class="message-content">
                        <div class="sender-sigil">
                            <div class="god-avatar ${senderType}">
                                ${senderType === 'player' ? 
                                    '<div class="eye-patch">ᛟ</div>' : 
                                    '<div class="eye-patch">⊕</div>'}
                            </div>
                            <span class="sender-name">${senderType === 'player' ? 'You' : 'Odin Allfather'}</span>
                            <span class="sender-title">${senderType === 'player' ? 'Traveler' : 'Lord of Asgard'}</span>
                        </div>
                        <div class="message-text">
                            <p>${escapeHtml(text)}</p>
                            <span class="runic-overlay ${state.runicMode ? '' : 'hidden'}" aria-hidden="true">${runicText}</span>
                        </div>
                        <time class="message-time" datetime="${new Date().toISOString()}">${timestamp}</time>
                    </div>
                </div>
                <div class="iron-feet"></div>
            </article>
        `;
        
        // Insert into container
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = messageHTML;
        const newMessage = tempDiv.firstElementChild;
        
        elements.messagesContainer.appendChild(newMessage);
        
        // Scroll to bottom
        elements.messagesContainer.scrollTo({
            top: elements.messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
        
        // Add entrance animation
        requestAnimationFrame(() => {
            newMessage.style.opacity = '0';
            newMessage.style.transform = 'translateY(20px)';
            setTimeout(() => {
                newMessage.style.transition = 'all 0.6s ease-out';
                newMessage.style.opacity = '1';
                newMessage.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    function addSystemMessage(text) {
        const notification = document.createElement('div');
        notification.className = 'system-message';
        notification.innerHTML = `
            <div style="text-align: center; padding: 1rem; color: var(--realm-primary); font-family: var(--font-header); font-size: 0.9rem; opacity: 0.8;">
                <span style="font-family: var(--font-runic); margin-right: 0.5rem;">ᛟ</span>
                ${text}
                <span style="font-family: var(--font-runic); margin-left: 0.5rem;">ᛟ</span>
            </div>
        `;
        elements.messagesContainer.appendChild(notification);
        elements.messagesContainer.scrollTo({
            top: elements.messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    function simulateDivineResponse() {
        const responses = [
            "The ravens bring interesting tidings from your realm.",
            "Your words have been weighed and measured.",
            "Huginn agrees with your wisdom. Muninn... hesitates.",
            "The threads of fate weave strangely around your message.",
            "I shall consider your words from my high seat.",
            "The Valkyries whisper of your deeds.",
            "Your mortal perspective intrigues me.",
            "Speak more, traveler. The All-Father listens."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        createMessage(randomResponse, 'odin');
        
        // Recover some raven health after successful delivery
        state.ravenHealth.huginn = Math.min(100, state.ravenHealth.huginn + 5);
        state.ravenHealth.muninn = Math.min(100, state.ravenHealth.muninn + 5);
        updateRavenHealthBars();
    }

    // ==========================================================================
    // RUNIC TRANSLITERATION
    // ==========================================================================
    
    function transliterateToRunes(text) {
        return text.toLowerCase().split('').map(char => {
            return runicMap[char] || char;
        }).join('');
    }

    function toggleRunicMode() {
        state.runicMode = !state.runicMode;
        elements.runicToggle.setAttribute('aria-pressed', state.runicMode);
        
        const overlays = document.querySelectorAll('.runic-overlay');
        overlays.forEach(overlay => {
            if (state.runicMode) {
                overlay.classList.remove('hidden');
            } else {
                overlay.classList.add('hidden');
            }
        });
        
        // Visual feedback
        if (state.runicMode) {
            showNotification('Runic Mode', 'The ancient script reveals itself...');
        }
    }

    // ==========================================================================
    // ANIMATIONS & EFFECTS
    // ==========================================================================
    
    function triggerRavenFlight() {
        elements.ravenFlight.classList.add('active');
        
        // Create feather particles
        createFeatherTrail();
        
        setTimeout(() => {
            elements.ravenFlight.classList.remove('active');
        }, 2000);
    }

    function createFeatherTrail() {
        const container = elements.ravenFlight.querySelector('.feather-trail');
        container.innerHTML = '';
        
        for (let i = 0; i < 10; i++) {
            const feather = document.createElement('div');
            feather.style.cssText = `
                position: absolute;
                width: 8px;
                height: 12px;
                background: #1a1a1a;
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                left: ${50 + (Math.random() - 0.5) * 100}px;
                top: ${50 + (Math.random() - 0.5) * 50}px;
                opacity: 0.6;
                animation: featherFall ${1 + Math.random()}s ease-out forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            container.appendChild(feather);
        }
    }

    // Add feather fall animation to stylesheet
    const style = document.createElement('style');
    style.textContent = `
        @keyframes featherFall {
            to {
                transform: translateY(100px) rotate(${360 + Math.random() * 360}deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
    function updateCharCount() {
        const count = elements.messageInput.value.length;
        elements.charCount.textContent = count;
        
        if (count > 450) {
            elements.charCount.style.color = '#ff6666';
        } else {
            elements.charCount.style.color = 'var(--iron-light)';
        }
    }

    function updateRavenHealthBars() {
        elements.huginnBar.style.width = `${state.ravenHealth.huginn}%`;
        elements.muninnBar.style.width = `${state.ravenHealth.muninn}%`;
        
        // Change color based on health
        const huginnColor = state.ravenHealth.huginn < 30 ? '#ff4444' : 
                           state.ravenHealth.huginn < 60 ? '#ffaa44' : 'var(--realm-primary)';
        const muninnColor = state.ravenHealth.muninn < 30 ? '#ff4444' : 
                           state.ravenHealth.muninn < 60 ? '#ffaa44' : 'var(--realm-primary)';
        
        elements.huginnBar.style.background = `linear-gradient(90deg, ${huginnColor} 0%, var(--realm-accent) 100%)`;
        elements.muninnBar.style.background = `linear-gradient(90deg, ${muninnColor} 0%, var(--realm-accent) 100%)`;
    }

    function showNotification(title, text) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-text">${text}</div>
        `;
        
        elements.notificationArea.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'all 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==========================================================================
    // EVENT LISTENERS
    // ==========================================================================
    
    // Realm navigation
    elements.realmNodes.forEach(node => {
        node.addEventListener('click', () => {
            const realm = node.dataset.realm;
            switchRealm(realm);
        });
    });

    // Message input
    elements.messageInput.addEventListener('input', updateCharCount);
    
    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send button
    elements.sendBtn.addEventListener('click', sendMessage);

    // Runic toggle
    elements.runicToggle.addEventListener('click', toggleRunicMode);

    // Attachment button (simulated)
    elements.attachBtn.addEventListener('click', () => {
        showNotification('Rune Stone', 'Select a rune to attach to your message...');
    });

    // Presence interactions
    document.querySelectorAll('.god-presence').forEach(presence => {
        presence.addEventListener('click', () => {
            const god = presence.dataset.god;
            const godNames = {
                odin: 'Odin Allfather',
                thor: 'Thor Odinson',
                freya: 'Lady Freya',
                loki: 'Loki Laufeyson',
                hel: 'Hel Lokisdottir'
            };
            showNotification('Divine Presence', `Attempting to commune with ${godNames[god]}...`);
        });
    });

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    function init() {
        // Initial health bar update
        updateRavenHealthBars();
        
        // Simulate random raven health fluctuations
        setInterval(() => {
            if (Math.random() > 0.7) {
                state.ravenHealth.huginn = Math.max(0, Math.min(100, state.ravenHealth.huginn + (Math.random() - 0.5) * 5));
                state.ravenHealth.muninn = Math.max(0, Math.min(100, state.ravenHealth.muninn + (Math.random() - 0.5) * 5));
                updateRavenHealthBars();
            }
        }, 10000);
        
        // Random divine presence updates
        setInterval(() => {
            const presences = document.querySelectorAll('.god-presence');
            const randomPresence = presences[Math.floor(Math.random() * presences.length)];
            const statuses = ['online', 'away', 'online', 'online']; // Weighted toward online
            
            if (randomPresence) {
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                randomPresence.className = `god-presence ${newStatus} ${randomPresence.dataset.god}`;
            }
        }, 15000);
        
        // Welcome notification
        setTimeout(() => {
            showNotification('Welcome', 'The ravens Huginn and Muninn await your words...');
        }, 1000);
        
        console.log('ᚺᚢᚷᛁᚾᚾ ᚪᚾᛞ ᛗᚢᚾᛁᚾᚾ - Divine Messenger initialized');
    }

    init();
});