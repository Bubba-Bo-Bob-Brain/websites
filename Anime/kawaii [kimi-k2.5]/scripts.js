// 🌸 Moe Moe Kyun! JavaScript Magic 🌸

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all kawaii systems
    initCustomCursor();
    initSparkleTrail();
    initFloatingHearts();
    initMascot();
    initMoeMeter();
    initGachaSystem();
    initStickerBook();
    initNavigation();
    initScrollAnimations();
    initHeroButtons();
    initCardInteractions();
    
    console.log('🌸 Welcome to Moe Moe Paradise! 🌸');
});

// 🌸 Custom Cursor System 🌸
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .content-card, .sticker, .mascot-container');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor follow
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.filter = 'drop-shadow(0 0 10px #FFB7C5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.filter = 'drop-shadow(0 2px 4px rgba(255, 183, 197, 0.5))';
        });
    });
}

// 🌸 Sparkle Trail Effect 🌸
function initSparkleTrail() {
    const container = document.getElementById('sparkle-trail');
    const sparkles = ['✨', '⭐', '💖', '🌸', '💫'];
    let lastX = 0, lastY = 0;
    let throttle = false;
    
    document.addEventListener('mousemove', (e) => {
        if (throttle) return;
        
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (dist < 30) return;
        
        lastX = e.clientX;
        lastY = e.clientY;
        
        createSparkle(e.clientX, e.clientY);
        
        throttle = true;
        setTimeout(() => throttle = false, 50);
    });
    
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'absolute';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.fontSize = (Math.random() * 15 + 10) + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkle-float 1s ease-out forwards';
        sparkle.style.opacity = '1';
        sparkle.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// 🌸 Floating Hearts on Click 🌸
function initFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const hearts = ['💕', '💖', '💗', '💓', '💝', '🌸', '🎀'];
    
    document.addEventListener('click', (e) => {
        // Don't trigger on interactive elements
        if (e.target.closest('button') || e.target.closest('a')) return;
        
        createHeartBurst(e.clientX, e.clientY);
    });
    
    function createHeartBurst(x, y) {
        const count = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.position = 'absolute';
                heart.style.left = (x + (Math.random() - 0.5) * 60) + 'px';
                heart.style.top = (y + (Math.random() - 0.5) * 60) + 'px';
                heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
                heart.style.pointerEvents = 'none';
                heart.style.opacity = '1';
                
                // Random direction
                const angle = (Math.PI * 2 * i) / count;
                const velocity = 50 + Math.random() * 50;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity - 50; // Upward bias
                
                heart.animate([
                    { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                    { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.2)`, opacity: 0.8, offset: 0.5 },
                    { transform: `translate(calc(-50% + ${tx * 1.5}px), calc(-50% + ${ty * 1.5}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000 + Math.random() * 500,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }).onfinish = () => heart.remove();
                
                container.appendChild(heart);
            }, i * 50);
        }
    }
}

// 🌸 Mascot Companion System 🌸
function initMascot() {
    const mascot = document.getElementById('mascot');
    const speech = document.getElementById('mascot-speech');
    
    const messages = [
        "Konnichiwa! ✨",
        "So kawaii! 💕",
        "Ganbatte! 🌸",
        "Sugoi desu! ⭐",
        "Moe moe kyun! 💖",
        "Let's explore! 🎀",
        "You're amazing! 🌈",
        "Sparkle time! ✨"
    ];
    
    // Random speech every 5 seconds when idle
    let speechInterval = setInterval(() => {
        if (!mascot.matches(':hover')) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            updateSpeech(msg);
        }
    }, 5000);
    
    mascot.addEventListener('click', () => {
        // Mascot jump animation
        mascot.style.animation = 'none';
        setTimeout(() => {
            mascot.style.animation = 'mascot-bounce 0.5s ease-out';
            setTimeout(() => {
                mascot.style.animation = 'mascot-bounce 2s infinite cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }, 500);
        }, 10);
        
        // Create heart burst around mascot
        const rect = mascot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '💖';
                heart.style.position = 'fixed';
                heart.style.left = centerX + 'px';
                heart.style.top = centerY + 'px';
                heart.style.fontSize = '20px';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '1001';
                
                const angle = (Math.PI * 2 * i) / 8;
                const dist = 60;
                
                heart.animate([
                    { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                    { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(1)`, opacity: 0 }
                ], {
                    duration: 800,
                    easing: 'ease-out'
                }).onfinish = () => heart.remove();
                
                document.body.appendChild(heart);
            }, i * 100);
        }
        
        updateSpeech("Moe moe kyun! 💕");
    });
    
    function updateSpeech(text) {
        speech.style.opacity = '0';
        speech.style.transform = 'translateY(10px) scale(0.8)';
        
        setTimeout(() => {
            speech.textContent = text;
            speech.style.opacity = '1';
            speech.style.transform = 'translateY(0) scale(1)';
        }, 300);
    }
}

// 🌸 Moe Meter System 🌸
function initMoeMeter() {
    const fill = document.getElementById('moe-fill');
    const btn = document.getElementById('increase-moe');
    const labels = document.querySelectorAll('.meter-labels span');
    let moeLevel = 0;
    
    btn.addEventListener('click', () => {
        if (moeLevel >= 100) {
            moeLevel = 0;
            resetMeter();
        } else {
            moeLevel = Math.min(moeLevel + 10, 100);
            updateMeter(moeLevel);
        }
        
        // Button bounce
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 150);
    });
    
    function updateMeter(level) {
        fill.style.width = level + '%';
        
        // Update labels based on level
        labels.forEach((label, index) => {
            const threshold = (index + 1) * 25;
            if (level >= threshold - 25) {
                label.style.color = level >= threshold ? '#FFB7C5' : '#5A5A7A';
                label.style.transform = level >= threshold ? 'scale(1.2)' : 'scale(1)';
                label.style.fontWeight = level >= threshold ? 'bold' : 'normal';
            }
        });
        
        // Special effects at max
        if (level === 100) {
            createMaxMoeEffect();
            btn.textContent = 'Reset Moe! 🔄';
        } else {
            btn.textContent = 'Tap for Moe! ✨';
        }
    }
    
    function resetMeter() {
        fill.style.width = '0%';
        labels.forEach(label => {
            label.style.color = '#8A8AA8';
            label.style.transform = 'scale(1)';
            label.style.fontWeight = 'normal';
        });
    }
    
    function createMaxMoeEffect() {
        const container = document.querySelector('.meter-container');
        const rect = container.getBoundingClientRect();
        
        // Rainbow burst
        const colors = ['#FFB7C5', '#C7CEEA', '#B4E7CE', '#FFDAC1', '#E2F0CB'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.left = (rect.left + rect.width / 2) + 'px';
                particle.style.top = (rect.top + rect.height / 2) + 'px';
                particle.style.width = '10px';
                particle.style.height = '10px';
                particle.style.backgroundColor = colors[i % colors.length];
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '9999';
                
                const angle = (Math.PI * 2 * i) / 20;
                const velocity = 100 + Math.random() * 50;
                
                particle.animate([
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                    { transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), calc(-50% + ${Math.sin(angle) * velocity}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }).onfinish = () => particle.remove();
                
                document.body.appendChild(particle);
            }, i * 30);
        }
    }
}

// 🌸 Gacha System 🌸
function initGachaSystem() {
    const knob = document.getElementById('gacha-knob');
    const ballsContainer = document.getElementById('gacha-balls');
    const countDisplay = document.getElementById('gacha-count');
    const collectionGrid = document.querySelector('.collection-grid');
    const modal = document.getElementById('gacha-modal');
    const closeModal = document.querySelector('.close-modal');
    
    let attempts = 0;
    let isSpinning = false;
    
    // Gacha pool
    const gachaPool = [
        { emoji: '🌸', name: 'Sakura Chan', rarity: 'common', color: '#FFB7C5' },
        { emoji: '🐱', name: 'Neko Mimi', rarity: 'common', color: '#C7CEEA' },
        { emoji: '🌟', name: 'Hoshi Star', rarity: 'rare', color: '#FFD700' },
        { emoji: '🌈', name: 'Niji Rainbow', rarity: 'rare', color: '#FF69B4' },
        { emoji: '🧸', name: 'Kuma Bear', rarity: 'epic', color: '#8B4513' },
        { emoji: '🦄', name: 'Yume Unicorn', rarity: 'epic', color: '#E6E6FA' },
        { emoji: '👑', name: 'Ohime Princess', rarity: 'legendary', color: '#FFD700' },
        { emoji: '💎', name: 'Crystal Heart', rarity: 'legendary', color: '#00CED1' }
    ];
    
    // Initialize balls
    function initializeBalls() {
        ballsContainer.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            const ball = document.createElement('div');
            ball.className = 'gacha-ball';
            const hue = Math.random() * 360;
            ball.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 80%), hsl(${hue}, 70%, 60%))`;
            ball.style.left = Math.random() * 80 + '%';
            ball.style.top = Math.random() * 70 + '%';
            ball.style.animationDelay = Math.random() * 2 + 's';
            ballsContainer.appendChild(ball);
        }
    }
    
    initializeBalls();
    
    knob.addEventListener('click', () => {
        if (isSpinning) return;
        spinGacha();
    });
    
    function spinGacha() {
        isSpinning = true;
        attempts++;
        countDisplay.textContent = attempts;
        
        // Animate knob
        knob.style.transform = 'translateY(-50%) rotate(720deg)';
        knob.style.transition = 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Shake machine
        const machine = document.querySelector('.machine-body');
        machine.style.animation = 'shake 0.5s ease-in-out 4';
        
        setTimeout(() => {
            // Reset knob
            knob.style.transition = 'transform 0.3s';
            knob.style.transform = 'translateY(-50%) rotate(0deg)';
            machine.style.animation = '';
            
            // Dispense
            dispenseCharacter();
            isSpinning = false;
        }, 2000);
    }
    
    function dispenseCharacter() {
        // Random selection with rarity weights
        const roll = Math.random();
        let pool;
        if (roll < 0.5) pool = gachaPool.filter(c => c.rarity === 'common');
        else if (roll < 0.8) pool = gachaPool.filter(c => c.rarity === 'rare');
        else if (roll < 0.95) pool = gachaPool.filter(c => c.rarity === 'epic');
        else pool = gachaPool.filter(c => c.rarity === 'legendary');
        
        const character = pool[Math.floor(Math.random() * pool.length)];
        
        // Show modal
        showRevealModal(character);
        
        // Add to collection
        addToCollection(character);
    }
    
    function showRevealModal(character) {
        const charDisplay = document.getElementById('revealed-char');
        const nameDisplay = document.getElementById('reveal-name');
        const rarityDisplay = document.getElementById('reveal-rarity');
        
        charDisplay.textContent = character.emoji;
        nameDisplay.textContent = character.name + '!';
        rarityDisplay.textContent = character.rarity.toUpperCase();
        rarityDisplay.style.color = character.color;
        
        modal.classList.add('active');
        
        // Special effect for legendary
        if (character.rarity === 'legendary') {
            createLegendaryEffect();
        }
    }
    
    function createLegendaryEffect() {
        const modalContent = document.querySelector('.modal-content');
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const spark = document.createElement('div');
                spark.textContent = '✨';
                spark.style.position = 'absolute';
                spark.style.left = Math.random() * 100 + '%';
                spark.style.top = Math.random() * 100 + '%';
                spark.style.fontSize = Math.random() * 20 + 10 + 'px';
                spark.style.animation = 'sparkle-float 1s ease-out forwards';
                modalContent.appendChild(spark);
                setTimeout(() => spark.remove(), 1000);
            }, i * 50);
        }
    }
    
    function addToCollection(character) {
        const item = document.createElement('div');
        item.className = 'collection-item new';
        item.textContent = character.emoji;
        item.style.borderColor = character.color;
        item.title = `${character.name} (${character.rarity})`;
        
        // Add sparkle effect based on rarity
        if (character.rarity === 'legendary' || character.rarity === 'epic') {
            item.style.boxShadow = `0 0 20px ${character.color}40`;
        }
        
        collectionGrid.appendChild(item);
        
        // Scroll to collection if it's off screen
        setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
    }
    
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
    
    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-1deg); }
            75% { transform: translateX(5px) rotate(1deg); }
        }
    `;
    document.head.appendChild(style);
}

// 🌸 Sticker Book System 🌸
function initStickerBook() {
    const stickers = document.querySelectorAll('.sticker');
    const canvas = document.getElementById('sticker-canvas');
    const clearBtn = document.getElementById('clear-stickers');
    let selectedSticker = null;
    
    stickers.forEach(sticker => {
        sticker.addEventListener('click', () => {
            stickers.forEach(s => s.classList.remove('selected'));
            sticker.classList.add('selected');
            selectedSticker = sticker.dataset.sticker;
        });
    });
    
    canvas.addEventListener('click', (e) => {
        if (!selectedSticker) {
            // Wiggle hint
            canvas.style.animation = 'shake 0.5s';
            setTimeout(() => canvas.style.animation = '', 500);
            return;
        }
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        placeSticker(x, y, selectedSticker);
    });
    
    function placeSticker(x, y, emoji) {
        const sticker = document.createElement('div');
        sticker.className = 'placed-sticker';
        sticker.textContent = emoji;
        sticker.style.left = x + 'px';
        sticker.style.top = y + 'px';
        
        // Random slight rotation
        const rotation = (Math.random() - 0.5) * 30;
        sticker.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        
        // Make draggable/removable on click
        sticker.addEventListener('click', (e) => {
            e.stopPropagation();
            sticker.style.animation = 'place-pop 0.3s reverse forwards';
            setTimeout(() => sticker.remove(), 300);
        });
        
        // Hover effect
        sticker.addEventListener('mouseenter', () => {
            sticker.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1.2)`;
        });
        
        sticker.addEventListener('mouseleave', () => {
            sticker.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
        });
        
        canvas.appendChild(sticker);
        
        // Hide hint if present
        const hint = canvas.querySelector('.canvas-hint');
        if (hint) hint.style.display = 'none';
    }
    
    clearBtn.addEventListener('click', () => {
        const placed = canvas.querySelectorAll('.placed-sticker');
        placed.forEach((sticker, i) => {
            setTimeout(() => {
                sticker.style.animation = 'place-pop 0.3s reverse forwards';
                setTimeout(() => sticker.remove(), 300);
            }, i * 50);
        });
        
        setTimeout(() => {
            const hint = canvas.querySelector('.canvas-hint');
            if (hint) hint.style.display = 'block';
        }, placed.length * 50 + 300);
    });
}

// 🌸 Navigation Smooth Scroll 🌸
function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offset = 100; // Account for sticky nav
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
                
                // Highlight active
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

// 🌸 Scroll Animations 🌸
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections and cards
    const animateElements = document.querySelectorAll('.content-card, .section-header, .hero-content');
    animateElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.1}s`;
        observer.observe(el);
    });
    
    // Parallax for floating cards
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, i) => {
            const speed = 0.5 + (i * 0.1);
            card.style.transform = `translateY(${scrolled * speed * 0.1}px) rotate(${Math.sin(scrolled * 0.01 + i) * 5}deg)`;
        });
    });
}

// 🌸 Hero Buttons Interaction 🌸
function initHeroButtons() {
    const kyunBtn = document.getElementById('kyun-btn');
    const exploreBtn = document.getElementById('explore-btn');
    
    kyunBtn.addEventListener('click', () => {
        // Create heart explosion
        const rect = kyunBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createHeartBurst(centerX, centerY);
            }, i * 30);
        }
        
        // Update mascot speech
        const speech = document.getElementById('mascot-speech');
        speech.textContent = 'Moe Moe Kyun! 💕';
        
        // Trigger confetti-like effect
        createConfetti(centerX, centerY);
    });
    
    exploreBtn.addEventListener('click', () => {
        document.querySelector('#manga').scrollIntoView({ behavior: 'smooth' });
    });
    
    function createConfetti(x, y) {
        const colors = ['#FFB7C5', '#C7CEEA', '#B4E7CE', '#FFDAC1', '#E2F0CB'];
        const container = document.getElementById('magic-dust');
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 100 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            const rot = Math.random() * 360;
            
            confetti.animate([
                { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
            
            container.appendChild(confetti);
        }
    }
    
    function createHeartBurst(x, y) {
        const container = document.getElementById('floating-hearts');
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.position = 'absolute';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 50;
        
        heart.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(1)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => heart.remove();
        
        container.appendChild(heart);
    }
}

// 🌸 Card Interactions 🌸
function initCardInteractions() {
    const cards = document.querySelectorAll('.content-card');
    
    cards.forEach(card => {
        // Add magnetic effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            const inner = card.querySelector('.card-inner');
            if (inner && !card.classList.contains('flipped')) {
                inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.card-inner');
            if (inner) {
                inner.style.transform = '';
            }
        });
        
        // Flip on click for mobile
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            const inner = card.querySelector('.card-inner');
            if (card.classList.contains('flipped')) {
                inner.style.transform = 'rotateY(180deg)';
            } else {
                inner.style.transform = '';
            }
        });
    });
    
    // Sound-like visual feedback on button clicks
    const buttons = document.querySelectorAll('.kawaii-btn, .card-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Easter egg: Konami code for rainbow mode
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateRainbowMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateRainbowMode() {
    document.body.style.animation = 'rainbow-bg 5s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow-bg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Create celebration
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const heart = document.createElement('div');
            heart.textContent = ['🌈', '✨', '💖', '🎉'][Math.floor(Math.random() * 4)];
            heart.style.position = 'fixed';
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            heart.style.fontSize = '30px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            heart.style.animation = 'place-pop 0.5s ease-out forwards';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }, i * 50);
    }
    
    // Update mascot
    const speech = document.getElementById('mascot-speech');
    speech.textContent = 'Rainbow Mode Activated! 🌈✨';
}