// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');
    const toggleRunesButton = document.getElementById('toggle-runes');
    const sendRavenButton = document.getElementById('send-raven');
    const realmBranches = document.querySelectorAll('.branch');
    const realmName = document.getElementById('realm-name');
    const realmDescription = document.getElementById('realm-description');
    const ravenFlight = document.getElementById('raven-flight');
    const bifrostEffect = document.querySelector('.bifrost-effect');
    
    // State variables
    let runesVisible = false;
    let currentRealm = 'asgard';
    
    // Realm data
    const realms = {
        asgard: {
            name: 'Asgard',
            description: 'Realm of the Æsir gods',
            color: '#3a6ea5'
        },
        midgard: {
            name: 'Midgard',
            description: 'Realm of humanity',
            color: '#4a7c59'
        },
        helheim: {
            name: 'Helheim',
            description: 'Realm of the dishonorable dead',
            color: '#6a4c93'
        },
        jotunheim: {
            name: 'Jotunheim',
            description: 'Realm of the giants',
            color: '#7a8c89'
        },
        alfheim: {
            name: 'Alfheim',
            description: 'Realm of the light elves',
            color: '#c9b037'
        }
    };
    
    // Initialize the app
    function initApp() {
        setupEventListeners();
        updateRealmDisplay();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Send message button
        sendMessageButton.addEventListener('click', sendMessage);
        
        // Enter key to send message
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Toggle runes button
        toggleRunesButton.addEventListener('click', toggleRunes);
        
        // Send raven button
        sendRavenButton.addEventListener('click', sendRaven);
        
        // Realm selection
        realmBranches.forEach(branch => {
            branch.addEventListener('click', function() {
                const realm = this.dataset.realm;
                switchRealm(realm);
            });
        });
    }
    
    // Send a new message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        
        // Get current time
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        
        // Create runic version of the message
        const runicText = convertToRunes(messageText);
        
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="sender">You</div>
                <div class="text">${escapeHtml(messageText)}</div>
                <div class="runic-text ${runesVisible ? 'active' : ''}">${runicText}</div>
                <div class="timestamp">${timeString}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // Clear input and scroll to bottom
        messageInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simulate response after a delay
        setTimeout(simulateResponse, 1500);
    }
    
    // Simulate a response from another god
    function simulateResponse() {
        const responses = [
            { sender: 'Odin', text: 'The ravens have heard your words.' },
            { sender: 'Thor', text: 'By Mjölnir, that is a worthy thought!' },
            { sender: 'Loki', text: 'Interesting perspective, though I have my doubts...' },
            { sender: 'Freya', text: 'The magic flows strongly with such words.' }
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message received';
        
        const runicText = convertToRunes(response.text);
        
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="sender">${response.sender}</div>
                <div class="text">${escapeHtml(response.text)}</div>
                <div class="runic-text ${runesVisible ? 'active' : ''}">${runicText}</div>
                <div class="timestamp">${timeString}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Toggle runic text visibility
    function toggleRunes() {
        runesVisible = !runesVisible;
        const runicTexts = document.querySelectorAll('.runic-text');
        
        runicTexts.forEach(text => {
            if (runesVisible) {
                text.classList.add('active');
            } else {
                text.classList.remove('active');
            }
        });
        
        // Update button state
        if (runesVisible) {
            toggleRunesButton.classList.add('active');
            toggleRunesButton.textContent = 'ᚠ';
        } else {
            toggleRunesButton.classList.remove('active');
            toggleRunesButton.textContent = 'ᚱ';
        }
    }
    
    // Send raven animation
    function sendRaven() {
        // Show raven flight animation
        ravenFlight.classList.add('active');
        
        // Remove animation after it completes
        setTimeout(() => {
            ravenFlight.classList.remove('active');
        }, 3000);
        
        // Add a special message
        setTimeout(() => {
            const now = new Date();
            const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                              now.getMinutes().toString().padStart(2, '0');
            
            const messageElement = document.createElement('div');
            messageElement.className = 'message received';
            
            messageElement.innerHTML = `
                <div class="message-content">
                    <div class="sender">Raven</div>
                    <div class="text">Delivered message to all realms via Huginn and Muninn.</div>
                    <div class="runic-text ${runesVisible ? 'active' : ''}">ᛞᛖᛚᛁᚡᛖᚱᛖᛞ ᛗᛖᛋᛋᚨᚷᛖ ᛏᛟ ᚨᛚᛚ ᚱᛖᚨᛚᛗᛋ ᚡᛁᚨ ᚺ𐌿ᚷᛁᚾᚾ ᚨᚾᛞ ᛗᚢᚾᛁᚾᚾ.</div>
                    <div class="timestamp">${timeString}</div>
                </div>
            `;
            
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1500);
    }
    
    // Switch realm with Bifrost effect
    function switchRealm(realm) {
        if (realm === currentRealm) return;
        
        // Show Bifrost effect
        bifrostEffect.classList.add('active');
        
        // Change realm after a short delay
        setTimeout(() => {
            currentRealm = realm;
            updateRealmDisplay();
            
            // Hide Bifrost effect
            bifrostEffect.classList.remove('active');
        }, 1000);
    }
    
    // Update realm display
    function updateRealmDisplay() {
        const realmData = realms[currentRealm];
        realmName.textContent = realmData.name;
        realmDescription.textContent = realmData.description;
        
        // Update document title
        document.title = `${realmData.name} - Odin's Ravens`;
    }
    
    // Simple rune conversion (for demonstration purposes)
    function convertToRunes(text) {
        const runeMap = {
            'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ',
            'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ',
            'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ',
            'v': 'ᚡ', 'w': 'ᚹ', 'x': 'ᚲ', 'y': 'ᛃ', 'z': 'ᛉ',
            ' ': '᛫', '.': '᛫', ',': '᛫', '!': '᛫', '?': '᛫'
        };
        
        return text.toLowerCase().split('').map(char => {
            return runeMap[char] || char;
        }).join('');
    }
    
    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Initialize the application
    initApp();
});