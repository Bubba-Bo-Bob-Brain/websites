document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SYSTEM CLOCK ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        document.getElementById('clock').textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. ENCRYPTED MESSAGE DECRYPTION ---
    const encryptedElements = document.querySelectorAll('.encrypted-text');

    encryptedElements.forEach(el => {
        const originalText = el.textContent;
        const decryptedText = el.getAttribute('data-decrypt');

        el.addEventListener('mouseenter', () => {
            // Add a small delay to simulate processing
            el.style.color = '#ff00ff'; // Neon pink
            el.textContent = "DECRYPTING...";
            
            setTimeout(() => {
                el.textContent = decryptedText;
                el.style.textShadow = "0 0 5px #ff00ff";
            }, 300);
        });

        el.addEventListener('mouseleave', () => {
            el.textContent = originalText;
            el.style.color = ''; // Reset to CSS default
            el.style.textShadow = '';
        });
    });

    // --- 3. NAVIGATION FILTERING ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const posts = document.querySelectorAll('.post-card');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            navButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            posts.forEach(post => {
                if (filter === 'all' || post.getAttribute('data-category') === filter) {
                    post.style.display = 'block';
                    // Add a small animation when appearing
                    post.style.animation = 'none';
                    post.offsetHeight; /* trigger reflow */
                    post.style.animation = 'glitchText 0.3s cubic-bezier(.25, .46, .45, .94) both';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });

    // --- 4. TRACE DETECTION SYSTEM ---
    const traceModal = document.getElementById('trace-modal');
    const traceProgress = document.getElementById('trace-progress');
    let traceInterval;
    let traceValue = 0;
    let isTracing = false;

    function startTrace() {
        if (isTracing) return;
        isTracing = true;
        traceValue = 0;
        traceModal.classList.remove('hidden');
        
        traceInterval = setInterval(() => {
            traceValue += Math.random() * 2; // Random increment
            if (traceValue >= 100) {
                traceValue = 100;
                clearInterval(traceInterval);
                // Critical failure action (e.g., redirect or lock screen)
                document.querySelector('.trace-content h2').textContent = "CONNECTION LOST";
                document.querySelector('.trace-content p').textContent = "Neural handshake severed. They found you.";
            }
            traceProgress.style.width = traceValue + '%';
        }, 50);
    }

    // Attach to global scope for HTML onclick
    window.flushConnection = function() {
        clearInterval(traceInterval);
        isTracing = false;
        traceModal.classList.add('hidden');
        
        // Reset Trace Logic for next time
        document.querySelector('.trace-content h2').textContent = "TRACE DETECTED"; // Reset text if it failed
        scheduleNextTrace();
    };

    function scheduleNextTrace() {
        // Randomly trigger trace between 10 and 30 seconds
        const delay = Math.floor(Math.random() * 20000) + 10000;
        setTimeout(startTrace, delay);
    }

    // Start the loop
    scheduleNextTrace();

    // --- 5. CHAT SIMULATION ---
    const chatBox = document.querySelector('.chat-box');
    const chatUsers = ['NetRunner_01', 'Ghost_Shell', 'Neon_Viper', 'SysAdmin', 'Unknown_Entity'];
    const chatMessages = [
        "Did anyone see the latest patch notes?",
        "Selling fresh exploits, DM me.",
        "ICE is getting thicker these days.",
        "Watch out for Sector 4 patrols.",
        "Anyone got a spare decryptor?",
        "01001000 01100101 01101100 01110000", // Binary for "Help"
        "The market crashed again.",
        "Secure line established."
    ];

    function addChatMessage() {
        const user = chatUsers[Math.floor(Math.random() * chatUsers.length)];
        const msg = chatMessages[Math.floor(Math.random() * chatMessages.length)];
        
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('msg');
        
        // Randomly assign a color to the user
        const colors = ['#00f3ff', '#ff00ff', '#00ff41', '#ffae00'];
        const userColor = colors[Math.floor(Math.random() * colors.length)];

        msgDiv.innerHTML = `<span class="user" style="color:${userColor}">${user}:</span> ${msg}`;
        chatBox.appendChild(msgDiv);
        
        // Auto scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;

        // Keep chat clean
        if (chatBox.children.length > 20) {
            chatBox.removeChild(chatBox.firstChild);
        }
    }

    // Add message every 3-8 seconds
    function loopChat() {
        const delay = Math.floor(Math.random() * 5000) + 3000;
        setTimeout(() => {
            addChatMessage();
            loopChat();
        }, delay);
    }
    loopChat();

    // --- 6. INTERACTION LOGIC ---
    
    // Accept Contract
    const acceptBtns = document.querySelectorAll('.action-btn.accept');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btn.textContent = "CONTRACT SIGNED";
            btn.classList.remove('accept');
            btn.style.backgroundColor = "#00ff41";
            btn.style.color = "#000";
            btn.style.borderColor = "#00ff41";
            
            // Add to system log (mockup)
            const logList = document.querySelector('.log-list');
            const newLog = document.createElement('li');
            const now = new Date().toLocaleTimeString('en-US', { hour12: false });
            newLog.innerHTML = `<span class="timestamp">[${now}]</span> Contract accepted securely.`;
            logList.prepend(newLog);
        });
    });

    // Glitch Effect on Avatar Hover (Randomized via JS for variety)
    const avatars = document.querySelectorAll('.avatar');
    avatars.forEach(avatar => {
        avatar.addEventListener('mouseover', () => {
            const randomX = Math.random() * 4 - 2;
            const randomY = Math.random() * 4 - 2;
            avatar.style.transform = `translate(${randomX}px, ${randomY}px)`;
            avatar.style.filter = "hue-rotate(90deg) contrast(1.5)";
        });
        avatar.addEventListener('mouseout', () => {
            avatar.style.transform = "translate(0, 0)";
            avatar.style.filter = "grayscale(100%) contrast(1.2)";
        });
    });

    // Syntax Highlighter Simulation (Simple color replacement for the demo)
    const codeBlock = document.querySelector('code');
    if(codeBlock) {
        let html = codeBlock.innerHTML;
        // Highlight keywords
        html = html.replace(/(SELECT|FROM|WHERE|AND|ORDER BY|DESC)/g, '<span class="keyword">$1</span>');
        // Highlight strings
        html = html.replace(/('.*?')/g, '<span class="string">$1</span>');
        codeBlock.innerHTML = html;
    }

});