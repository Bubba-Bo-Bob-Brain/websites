/* ==========================================
   Y2K AESTHETIC - StArDuSt_Queen Profile
   JavaScript - Maximum Interactivity
========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== CUSTOM CURSOR & SPARKLE TRAIL =====
    const cursor = document.getElementById('custom-cursor');
    const sparkleTrail = document.getElementById('sparkle-trail');
    const sparkles = ['✨', '⭐', '💫', '✦', '✧', '♦', '•', '·'];
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let lastSparkleTime = 0;
    
    // Smooth cursor following
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create sparkle trail (throttled)
        const now = Date.now();
        if (now - lastSparkleTime > 50) {
            createSparkle(e.clientX, e.clientY);
            lastSparkleTime = now;
        }
    });
    
    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Sparkle creation function
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        
        // Random offset for natural feel
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        sparkle.style.left = (x + offsetX) + 'px';
        sparkle.style.top = (y + offsetY) + 'px';
        
        // Random colors
        const colors = ['#FF00CC', '#00FFFF', '#39FF14', '#BF00FF', '#FF6600', '#FFFF00'];
        sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.fontSize = (Math.random() * 15 + 10) + 'px';
        
        sparkleTrail.appendChild(sparkle);
        
        // Remove after animation
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
    
    // Click explosion effect
    document.addEventListener('click', (e) => {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createSparkle(e.clientX, e.clientY);
            }, i * 50);
        }
    });
    
    // ===== MUSIC PLAYER =====
    const audio = document.getElementById('bg-music');
    const playBtn = document.querySelector('.play-btn');
    const volumeFill = document.querySelector('.volume-fill');
    let isPlaying = false;
    
    // Auto-play attempt
    setTimeout(() => {
        audio.volume = 0.3;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Auto-play prevented by browser');
            });
        }
    }, 1000);
    
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.textContent = '▶';
            playBtn.style.background = 'linear-gradient(180deg, #00FF00, #008800)';
        } else {
            audio.play();
            playBtn.textContent = '⏸';
            playBtn.style.background = 'linear-gradient(180deg, #FF0000, #880000)';
        }
        isPlaying = !isPlaying;
    });
    
    // Simulate volume animation
    setInterval(() => {
        const randomWidth = Math.random() * 70 + 20;
        volumeFill.style.width = randomWidth + '%';
    }, 2000);
    
    // ===== HIT COUNTER ANIMATION =====
    const digits = document.querySelectorAll('.digit');
    const targetNumber = '042069';
    let currentNumber = '000000';
    
    function animateHitCounter() {
        for (let i = 0; i < digits.length; i++) {
            const finalDigit = parseInt(targetNumber[i]);
            let currentDigit = parseInt(currentNumber[i]);
            if (currentDigit !== finalDigit) {
                const interval = setInterval(() => {
                    currentDigit = (currentDigit + 1) % 10;
                    digits[i].textContent = currentDigit;
                    if (currentDigit === finalDigit) {
                        clearInterval(interval);
                    }
                }, 100 + (i * 50));
            }
        }
    }
    
    // Start hit counter animation
    setTimeout(animateHitCounter, 1500);
    
    // Increment counter periodically
    setInterval(() => {
        const lastDigit = digits[digits.length - 1];
        let val = parseInt(lastDigit.textContent);
        val = (val + 1) % 10;
        lastDigit.textContent = val;
    }, 5000);
    
    // ===== GUESTBOOK FUNCTIONALITY =====
    const guestForm = document.querySelector('.guestbook-form');
    const guestEntries = document.querySelector('.guestbook-entries');
    const nameInput = document.querySelector('.guest-input');
    const messageInput = document.querySelector('.guest-textarea');
    const submitBtn = document.querySelector('.submit-btn');
    
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        
        if (name && message) {
            addGuestEntry(name, message);
            nameInput.value = '';
            messageInput.value = '';
            submitBtn.textContent = 'Sent!!!';
            submitBtn.style.background = '#00FF00';
            setTimeout(() => {
                submitBtn.textContent = 'Submit!!!';
                submitBtn.style.background = '';
            }, 2000);
        } else {
            submitBtn.style.animation = 'shake 0.5s';
            setTimeout(() => {
                submitBtn.style.animation = '';
            }, 500);
        }
    });
    
    function addGuestEntry(name, message) {
        const entry = document.createElement('div');
        entry.className = 'guest-entry';
        entry.style.animation = 'slideIn 0.5s ease-out';
        
        const date = new Date().toLocaleString('en-US', { 
            month: 'numeric', 
            day: 'numeric', 
            year: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
        
        const randomAvatar = `https://i.pravatar.cc/50?img=${Math.floor(Math.random() * 50) + 1}`;
        
        entry.innerHTML = `
            <div class="guest-header">
                <img src="${randomAvatar}" alt="" class="guest-avatar">
                <span class="guest-name">${escapeHtml(name)}</span>
                <span class="guest-date">${date}</span>
            </div>
            <p class="guest-message">${escapeHtml(message)}</p>
        `;
        
        entry.style.border = '2px solid';
        entry.style.borderImage = 'linear-gradient(45deg, #FF00CC, #00FFFF, #39FF14) 1';
        guestEntries.insertBefore(entry, guestEntries.firstChild);
        
        entry.style.boxShadow = '0 0 30px #FF00CC';
        setTimeout(() => {
            entry.style.boxShadow = '';
        }, 1000);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ===== FRIEND ITEM INTERACTIVITY =====
    const friendItems = document.querySelectorAll('.friend-item');
    friendItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            console.log(`Hovering over friend ${index + 1}`);
        });
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                item.style.transform = `translateY(${Math.random() * 5 - 2.5}px)`;
                setTimeout(() => {
                    item.style.transform = '';
                }, 200);
            }
        }, 3000 + (index * 500));
    });
    
    // ===== MOOD CHANGER =====
    const moodIndicator = document.querySelector('.mood-indicator');
    const moods = [
        { emoji: '💫', text: 'Dreamy AF', color: '#BF00FF' },
        { emoji: '🔥', text: 'On Fire', color: '#FF6600' },
        { emoji: '💔', text: 'Emotional', color: '#FF00CC' },
        { emoji: '😎', text: 'Cool Beans', color: '#00FFFF' },
        { emoji: '✨', text: 'Sparkling', color: '#FFFF00' },
        { emoji: '🌙', text: 'Midnight', color: '#39FF14' }
    ];
    
    moodIndicator.addEventListener('click', () => {
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        const emoji = moodIndicator.querySelector('.mood-emoji');
        const text = moodIndicator.querySelector('.mood-text');
        
        emoji.textContent = randomMood.emoji;
        text.textContent = randomMood.text;
        moodIndicator.style.borderColor = randomMood.color;
        moodIndicator.style.color = randomMood.color;
        moodIndicator.style.boxShadow = `0 0 15px ${randomMood.color}`;
        
        emoji.style.animation = 'none';
        setTimeout(() => {
            emoji.style.animation = 'bounce 1s infinite';
        }, 10);
    });
    
    // ===== QUIZ BUTTON =====
    const quizBtn = document.querySelector('.quiz-btn');
    quizBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #FF00CC, #BF00FF);
                padding: 30px;
                border: 5px solid #00FFFF;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 0 50px #FF00CC;
            ">
                <h2 style="font-family: 'Rubik Glitch', cursive; color: #FFFF00; margin-bottom: 20px; font-size: 28px;">✨ RESULT ✨</h2>
                <p style="font-size: 20px; color: #FFF; margin-bottom: 20px;">You got: <span style="color: #00FFFF; font-weight: bold;">HOLOGRAPHIC UNICORN</span>!!!</p>
                <img src="https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif" style="width: 200px; height: 200px; object-fit: cover; border: 3px solid #FFFF00; margin-bottom: 20px;">
                <p style="color: #FFF; margin-bottom: 20px;">Share this with all your friends!!!</p>
                <button onclick="this.closest('.modal').remove()" style="
                    background: #00FFFF;
                    border: none;
                    padding: 10px 30px;
                    font-family: 'Press Start 2P', cursive;
                    font-size: 12px;
                    cursor: pointer;
                    color: #000;
                ">CLOSE</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    });
    
    // ===== CONSTRUCTION BANNER ANIMATION =====
    const constructionText = document.querySelector('.construction-text');
    setInterval(() => {
        constructionText.style.textShadow = `
            ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px #FF00CC,
            ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px #00FFFF
        `;
    }, 100);
    
    // ===== TEXT SCRAMBLE EFFECT FOR USERNAME =====
    const username = document.querySelector('.username');
    const originalText = username.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~*✨⭐';
    
    username.addEventListener('mouseenter', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            username.textContent = originalText.split('')
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
            }
            iterations += 1/3;
        }, 30);
    });
    
    // ===== GLITCH EFFECT RANDOMIZER =====
    setInterval(() => {
        const elements = document.querySelectorAll('.section-title, .friend-name');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        randomElement.style.textShadow = '2px 0 #FF00CC, -2px 0 #00FFFF';
        setTimeout(() => {
            randomElement.style.textShadow = '';
        }, 200);
    }, 5000);
    
    // ===== CONSOLE EASTER EGG =====
    console.log('%c✨ Welcome to StArDuSt_Queen\'s Digital Sanctuary ✨', 'color: #FF00CC; font-size: 20px; font-weight: bold; text-shadow: 2px 2px #00FFFF');
    console.log('%cBest viewed in Netscape Navigator at 1024x768 resolution', 'color: #39FF14; font-size: 12px;');
    console.log('%cSecret commands: Press M for music, S for sparkles!', 'color: #FFFF00; font-size: 14px;');
    
    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'm' || e.key === 'M') {
            playBtn.click();
        }
        if (e.key === 's' || e.key === 'S') {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            for (let i = 0; i < 15; i++) {
                setTimeout(() => createSparkle(x, y), i * 30);
            }
        }
    });
    
    // ===== ANIMATION KEYFRAMES INJECTION =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        @keyframes slideIn {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // ===== INIT ANIMATIONS =====
    document.querySelector('.main-container').style.animation = 'slideIn 1s ease-out';
    
    const sections = document.querySelectorAll('.section-box');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.style.transition = 'all 0.5s ease-out';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });
    
}); // End DOMContentLoaded

// ===== GLOBAL FUNCTIONS =====
window.createSparkleAt = function(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = '✨';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.color = '#FFFF00';
    sparkle.style.fontSize = '30px';
    document.getElementById('sparkle-trail').appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
};