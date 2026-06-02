/* ===========================================
   Kawaii Anime & Manga Portal - JavaScript
   Cute to the Max! Moe Moe Kyun!
   =========================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌸 Kawaii Portal loaded! Moe Moe Kyun! 🌸');
    
    // Initialize all features
    initNavigation();
    initMascot();
    initMangaShelf();
    initAnimeCalendar();
    initGachaSystem();
    initGallery();
    initBackgroundEffects();
    initSoundSystem();
    initSparkleCursor();
    initSecretMode();
    
    // Set initial active section
    showSection('home');
});

// ===========================================
// Navigation System
// ===========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target section ID
            const targetId = this.getAttribute('href').substring(1);
            
            // Play navigation sound
            const soundId = this.getAttribute('data-sound');
            playSound(soundId);
            
            // Update active navigation
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            showSection(targetId);
            
            // Animate chibi guide
            const chibiId = 'chibi-' + targetId;
            const chibiGuide = document.getElementById(chibiId);
            if (chibiGuide) {
                chibiGuide.style.animation = 'none';
                setTimeout(() => {
                    chibiGuide.style.animation = 'bounceSmall 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                }, 10);
            }
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll to section with offset for header
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

// ===========================================
// Mascot Companion (Neko-chan)
// ===========================================
function initMascot() {
    const mascot = document.getElementById('mascot');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodText = document.querySelector('.mascot-mood');
    
    // Mood configurations
    const moods = {
        happy: {
            emoji: '😊',
            text: 'Feeling Happy! 💕',
            color: '#ffb8e2',
            animation: 'bounce'
        },
        excited: {
            emoji: '😆',
            text: 'So Excited! ✨',
            color: '#ffdfba',
            animation: 'wiggle'
        },
        shy: {
            emoji: '😳',
            text: 'A bit shy... 🙈',
            color: '#ff99cc',
            animation: 'bounceSmall'
        },
        sleepy: {
            emoji: '😴',
            text: 'Sleepy time... 💤',
            color: '#a6e3ff',
            animation: 'float'
        }
    };
    
    // Set up mood buttons
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            changeMascotMood(mood);
            playSound('sparkle');
            
            // Add sparkle effect
            createSparkleEffect(mascot);
        });
    });
    
    // Mascot click interaction
    mascot.addEventListener('click', function() {
        // Cycle through moods on click
        const currentMood = Object.keys(moods)[Math.floor(Math.random() * Object.keys(moods).length)];
        changeMascotMood(currentMood);
        playSound('book1');
        
        // Create heart effect
        createHeartEffect(mascot);
    });
    
    // Mascot follows mouse (subtly)
    document.addEventListener('mousemove', function(e) {
        // Only follow if mouse is near mascot
        const mascotRect = mascot.getBoundingClientRect();
        const mascotCenterX = mascotRect.left + mascotRect.width / 2;
        const mascotCenterY = mascotRect.top + mascotRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(e.clientX - mascotCenterX, 2) + 
            Math.pow(e.clientY - mascotCenterY, 2)
        );
        
        if (distance < 300) {
            // Calculate direction
            const dx = e.clientX - mascotCenterX;
            const dy = e.clientY - mascotCenterY;
            
            // Move eyes slightly to follow cursor
            const eyes = mascot.querySelector('.mascot-eyes');
            const leftEye = eyes.querySelector('.left-eye');
            const rightEye = eyes.querySelector('.right-eye');
            
            const eyeMoveX = Math.min(Math.max(dx / 100, -5), 5);
            const eyeMoveY = Math.min(Math.max(dy / 100, -5), 5);
            
            leftEye.style.transform = `translate(${eyeMoveX}px, ${eyeMoveY}px)`;
            rightEye.style.transform = `translate(${eyeMoveX}px, ${eyeMoveY}px)`;
        }
    });
    
    function changeMascotMood(mood) {
        if (!moods[mood]) return;
        
        const config = moods[mood];
        
        // Update mood text
        moodText.textContent = config.text;
        
        // Update mascot color
        const mascotBody = mascot.querySelector('.mascot-body');
        mascotBody.style.background = `linear-gradient(135deg, ${config.color}, ${adjustColor(config.color, -20)})`;
        
        // Update animation
        mascot.style.animation = `${config.animation} 2s ease-in-out`;
        
        // Reset animation after it completes
        setTimeout(() => {
            mascot.style.animation = 'float 6s ease-in-out infinite';
        }, 2000);
    }
    
    // Helper function to adjust color brightness
    function adjustColor(color, amount) {
        // Simplified color adjustment
        return color.replace('ff', (parseInt(color.slice(-6, -4), 16) + amount).toString(16))
                    .replace('b8', (parseInt(color.slice(-4, -2), 16) + amount).toString(16))
                    .replace('e2', (parseInt(color.slice(-2), 16) + amount).toString(16));
    }
}

// ===========================================
// Manga Shelf Interactions
// ===========================================
function initMangaShelf() {
    const mangaBooks = document.querySelectorAll('.manga-book');
    
    mangaBooks.forEach(book => {
        book.addEventListener('click', function() {
            // Play book sound
            const soundId = this.getAttribute('data-sound');
            playSound(soundId);
            
            // Add wiggle animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'wiggle 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }, 10);
            
            // Create sparkle effect
            createSparkleEffect(this);
            
            // Color pulse effect
            const color = this.getAttribute('data-color');
            const bookCover = this.querySelector('.book-cover');
            bookCover.style.filter = 'brightness(1.3)';
            setTimeout(() => {
                bookCover.style.filter = 'brightness(1)';
            }, 300);
            
            // Show temporary notification
            const bookTitle = this.querySelector('.book-title').textContent;
            showKawaiiNotification(`You opened "${bookTitle}"! 📖`);
        });
        
        // Add hover sparkle trail
        book.addEventListener('mouseenter', function() {
            createSparkleTrail(this);
        });
    });
}

// ===========================================
// Anime Calendar
// ===========================================
function initAnimeCalendar() {
    const prevBtn = document.querySelector('.prev-week');
    const nextBtn = document.querySelector('.next-week');
    const currentWeekEl = document.querySelector('.current-week');
    const dayCards = document.querySelectorAll('.day-card');
    
    // Week names for rotation
    const weekNames = [
        "Week of Kawaii ✨",
        "Week of Moe 🌸",
        "Week of Sparkle 💫",
        "Week of Friendship 💖",
        "Week of Dreams 💭"
    ];
    
    let currentWeekIndex = 0;
    
    // Previous week button
    prevBtn.addEventListener('click', function() {
        currentWeekIndex = (currentWeekIndex - 1 + weekNames.length) % weekNames.length;
        updateCalendar();
        playSound('nav2');
        createSparkleEffect(this);
    });
    
    // Next week button
    nextBtn.addEventListener('click', function() {
        currentWeekIndex = (currentWeekIndex + 1) % weekNames.length;
        updateCalendar();
        playSound('nav2');
        createSparkleEffect(this);
    });
    
    // Day card interactions
    dayCards.forEach(card => {
        card.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            const showTitle = this.querySelector('.show-title').textContent;
            
            playSound('book1');
            createHeartEffect(this);
            
            showKawaiiNotification(`${showTitle} airs on ${getFullDayName(day)}! 📺`);
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.05)';
            createSparkleTrail(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-10px)';
        });
    });
    
    function updateCalendar() {
        // Update week name
        currentWeekEl.textContent = weekNames[currentWeekIndex];
        
        // Add animation
        currentWeekEl.style.animation = 'none';
        setTimeout(() => {
            currentWeekEl.style.animation = 'bounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 10);
        
        // Animate all day cards
        dayCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 10);
            }, index * 100);
        });
    }
    
    function getFullDayName(shortDay) {
        const days = {
            'mon': 'Monday',
            'tue': 'Tuesday',
            'wed': 'Wednesday',
            'thu': 'Thursday',
            'fri': 'Friday'
        };
        return days[shortDay] || shortDay;
    }
}

// ===========================================
// Gacha System
// ===========================================
function initGachaSystem() {
    const gachaHandle = document.getElementById('gacha-handle');
    const singlePullBtn = document.getElementById('single-pull');
    const multiPullBtn = document.getElementById('multi-pull');
    const coinCountEl = document.getElementById('coin-count');
    const gachaWindow = document.getElementById('gacha-window');
    const collectionGrid = document.getElementById('collection-grid');
    const displayEmoji = gachaWindow.querySelector('.display-emoji');
    const displayText = gachaWindow.querySelector('.display-text');
    
    // Gacha characters pool
    const characters = [
        { emoji: '🐱', name: 'Neko Girl', rarity: 'common' },
        { emoji: '🐰', name: 'Bunny Boy', rarity: 'common' },
        { emoji: '🌸', name: 'Flower Spirit', rarity: 'common' },
        { emoji: '🦊', name: 'Kitsune', rarity: 'uncommon' },
        { emoji: '🐻', name: 'Bear Cub', rarity: 'uncommon' },
        { emoji: '🦄', name: 'Unicorn', rarity: 'rare' },
        { emoji: '🐉', name: 'Dragon Kid', rarity: 'rare' },
        { emoji: '🍰', name: 'Cake Fairy', rarity: 'epic' },
        { emoji: '🌟', name: 'Star Princess', rarity: 'legendary' },
        { emoji: '🎀', name: 'Ribbon Angel', rarity: 'legendary' }
    ];
    
    // Player's collection
    let playerCollection = [];
    let coins = 5000;
    
    // Pull costs
    const SINGLE_PULL_COST = 100;
    const MULTI_PULL_COST = 1000;
    
    // Handle pull animation
    gachaHandle.addEventListener('click', function() {
        // Visual feedback
        this.style.transform = 'rotate(-45deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
        
        // Try single pull if enough coins
        if (coins >= SINGLE_PULL_COST) {
            performSinglePull();
        } else {
            showKawaiiNotification('Not enough coins! 💸');
            playSound('nav1');
        }
    });
    
    // Single pull button
    singlePullBtn.addEventListener('click', performSinglePull);
    
    // Multi pull button
    multiPullBtn.addEventListener('click', function() {
        if (coins >= MULTI_PULL_COST) {
            performMultiPull();
        } else {
            showKawaiiNotification('Not enough coins for multi-pull! 💸');
            playSound('nav1');
        }
    });
    
    function performSinglePull() {
        if (coins < SINGLE_PULL_COST) {
            showKawaiiNotification('Not enough coins! 💸');
            return;
        }
        
        coins -= SINGLE_PULL_COST;
        updateCoinDisplay();
        
        // Animate handle
        gachaHandle.style.animation = 'none';
        setTimeout(() => {
            gachaHandle.style.animation = 'wiggle 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 10);
        
        // Show pulling animation
        displayText.textContent = 'Pulling...';
        displayEmoji.textContent = '🎰';
        gachaWindow.style.animation = 'shake 0.5s';
        
        playSound('sparkle');
        
        // Reveal character after delay
        setTimeout(() => {
            const character = getRandomCharacter();
            revealCharacter(character);
            
            // Add to collection if not already collected
            if (!playerCollection.some(c => c.name === character.name)) {
                playerCollection.push(character);
                updateCollectionDisplay();
            }
            
            // Show notification
            showKawaiiNotification(`You got ${character.name}! ${character.emoji}`);
        }, 1500);
    }
    
    function performMultiPull() {
        if (coins < MULTI_PULL_COST) return;
        
        coins -= MULTI_PULL_COST;
        updateCoinDisplay();
        
        // Multi-pull animation
        displayText.textContent = 'Multi Pull!';
        displayEmoji.textContent = '✨';
        gachaWindow.style.animation = 'sparkleShake 1s';
        
        playSound('sparkle');
        
        // Get multiple characters
        const pulledCharacters = [];
        for (let i = 0; i < 10; i++) {
            const character = getRandomCharacter();
            pulledCharacters.push(character);
            
            // Add to collection if not already collected
            if (!playerCollection.some(c => c.name === character.name)) {
                playerCollection.push(character);
            }
        }
        
        // Update collection display
        setTimeout(() => {
            updateCollectionDisplay();
            
            // Show summary notification
            const uniqueCount = pulledCharacters.filter((char, index, self) =>
                index === self.findIndex(c => c.name === char.name)
            ).length;
            
            showKawaiiNotification(`Multi-pull complete! Got ${uniqueCount} new characters! 🎉`);
            
            // Reveal last character
            const lastCharacter = pulledCharacters[pulledCharacters.length - 1];
            revealCharacter(lastCharacter);
        }, 2000);
    }
    
    function getRandomCharacter() {
        // Weighted random based on rarity
        const rarityWeights = {
            'common': 50,
            'uncommon': 30,
            'rare': 15,
            'epic': 4,
            'legendary': 1
        };
        
        // Create weighted pool
        let weightedPool = [];
        characters.forEach(char => {
            const weight = rarityWeights[char.rarity];
            for (let i = 0; i < weight; i++) {
                weightedPool.push(char);
            }
        });
        
        // Select random character
        return weightedPool[Math.floor(Math.random() * weightedPool.length)];
    }
    
    function revealCharacter(character) {
        // Update display
        displayText.textContent = character.name;
        displayEmoji.textContent = character.emoji;
        
        // Add rarity color
        const rarityColors = {
            'common': '#a6e3ff',
            'uncommon': '#b8ffd5',
            'rare': '#ffdfba',
            'epic': '#d5b8ff',
            'legendary': '#ffb8e2'
        };
        
        gachaWindow.style.borderColor = rarityColors[character.rarity] || 'gold';
        
        // Celebration effect
        createSparkleEffect(gachaWindow);
        createHeartEffect(gachaWindow);
        
        // Play sound based on rarity
        if (character.rarity === 'legendary' || character.rarity === 'epic') {
            playSound('nav2');
        } else {
            playSound('book1');
        }
    }
    
    function updateCoinDisplay() {
        coinCountEl.textContent = coins;
        
        // Animation
        coinCountEl.style.transform = 'scale(1.2)';
        setTimeout(() => {
            coinCountEl.style.transform = 'scale(1)';
        }, 300);
    }
    
    function updateCollectionDisplay() {
        // Clear existing collection (except empty slots)
        const existingCards = collectionGrid.querySelectorAll('.character-card');
        existingCards.forEach(card => card.remove());
        
        // Add collected characters
        playerCollection.forEach((character, index) => {
            const characterCard = document.createElement('div');
            characterCard.className = 'character-card';
            characterCard.innerHTML = `
                <div class="char-emoji">${character.emoji}</div>
                <div class="char-name">${character.name}</div>
            `;
            
            // Add rarity styling
            const rarityColors = {
                'common': '#a6e3ff',
                'uncommon': '#b8ffd5',
                'rare': '#ffdfba',
                'epic': '#d5b8ff',
                'legendary': '#ffb8e2'
            };
            
            characterCard.style.borderColor = rarityColors[character.rarity] || '#d5b8ff';
            
            // Add click interaction
            characterCard.addEventListener('click', function() {
                playSound('book1');
                createSparkleEffect(this);
                showKawaiiNotification(`${character.name} says hello! ${character.emoji}`);
            });
            
            // Insert at beginning
            collectionGrid.insertBefore(characterCard, collectionGrid.firstChild);
        });
        
        // Remove empty slots if we have characters
        if (playerCollection.length > 0) {
            const emptySlots = collectionGrid.querySelectorAll('.empty-slot');
            emptySlots.forEach(slot => {
                if (playerCollection.length >= 6) {
                    slot.remove();
                }
            });
        }
    }
    
    // Initialize collection display
    updateCollectionDisplay();
}

// ===========================================
// Gallery Interactions
// ===========================================
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const effect = this.getAttribute('data-effect');
            
            switch(effect) {
                case 'sparkle':
                    createSparkleEffect(this);
                    break;
                case 'hearts':
                    createHeartEffect(this);
                    break;
                case 'spin':
                    // Spin effect is handled by CSS
                    break;
                case 'bounce':
                    // Bounce effect is handled by CSS
                    break;
            }
            
            // Play sound
            playSound('book1');
        });
        
        // Click to enlarge effect
        item.addEventListener('click', function() {
            const label = this.querySelector('.item-label').textContent;
            showKawaiiNotification(`You selected "${label}"! 🖼️`);
            
            // Pulse effect
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
            
            createSparkleEffect(this);
        });
    });
}

// ===========================================
// Background Effects
// ===========================================
function initBackgroundEffects() {
    // Sparkle Mode Button
    const sparkleModeBtn = document.getElementById('sparkle-mode');
    sparkleModeBtn.addEventListener('click', function() {
        toggleSparkleMode();
        playSound('sparkle');
        createSparkleEffect(this);
    });
    
    // Hearts Rain Button
    const heartsModeBtn = document.getElementById('hearts-mode');
    heartsModeBtn.addEventListener('click', function() {
        activateHeartsRain();
        playSound('book1');
        createHeartEffect(this);
    });
    
    // Click to create bubbles
    document.addEventListener('click', function(e) {
        createBubble(e.clientX, e.clientY);
        playSound('nav1');
    });
}

let sparkleModeActive = false;
function toggleSparkleMode() {
    sparkleModeActive = !sparkleModeActive;
    
    const sparkleTrails = document.querySelector('.sparkle-trails');
    
    if (sparkleModeActive) {
        sparkleTrails.style.backgroundImage = `
            radial-gradient(
                circle at center,
                rgba(255, 255, 200, 0.8) 0%,
                rgba(255, 255, 200, 0.4) 20%,
                transparent 50%
            )
        `;
        showKawaiiNotification('Sparkle Mode Activated! ✨');
    } else {
        sparkleTrails.style.backgroundImage = 'radial-gradient(circle at center, transparent 0%, transparent 100%)';
        showKawaiiNotification('Sparkle Mode Deactivated');
    }
}

function activateHeartsRain() {
    showKawaiiNotification('Hearts Rain! 💖');
    
    // Create multiple hearts
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createHeartEffect(document.body, true);
        }, i * 100);
    }
}

// ===========================================
// Visual Effects Creators
// ===========================================
function createSparkleEffect(element) {
    const sparkles = ['✨', '🌟', '💫', '⭐', '✴️'];
    const sparkle = sparkles[Math.floor(Math.random() * sparkles.length)];
    
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const sparkleEl = document.createElement('div');
    sparkleEl.className = 'floating-sparkle';
    sparkleEl.textContent = sparkle;
    sparkleEl.style.position = 'fixed';
    sparkleEl.style.left = x + 'px';
    sparkleEl.style.top = y + 'px';
    sparkleEl.style.fontSize = '24px';
    sparkleEl.style.zIndex = '1000';
    sparkleEl.style.pointerEvents = 'none';
    sparkleEl.style.animation = 'sparkleFloat 1.5s ease-out forwards';
    
    document.body.appendChild(sparkleEl);
    
    // Remove after animation
    setTimeout(() => {
        sparkleEl.remove();
    }, 1500);
}

function createSparkleTrail(element) {
    if (!sparkleModeActive) return;
    
    const trailCount = 3;
    for (let i = 0; i < trailCount; i++) {
        setTimeout(() => {
            createSparkleEffect(element);
        }, i * 100);
    }
}

function createHeartEffect(element, randomPosition = false) {
    const hearts = ['💖', '💕', '💗', '💓', '💞'];
    const heart = hearts[Math.floor(Math.random() * hearts.length)];
    
    let x, y;
    
    if (randomPosition) {
        x = Math.random() * window.innerWidth;
        y = Math.random() * window.innerHeight;
    } else {
        const rect = element.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    }
    
    const heartEl = document.createElement('div');
    heartEl.className = 'floating-heart';
    heartEl.textContent = heart;
    heartEl.style.position = 'fixed';
    heartEl.style.left = x + 'px';
    heartEl.style.top = y + 'px';
    heartEl.style.fontSize = '28px';
    heartEl.style.zIndex = '1000';
    heartEl.style.pointerEvents = 'none';
    heartEl.style.animation = 'heartFloat 2s ease-out forwards';
    
    document.body.appendChild(heartEl);
    
    // Remove after animation
    setTimeout(() => {
        heartEl.remove();
    }, 2000);
}

function createBubble(x, y) {
    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'floating-bubble';
    bubbleEl.textContent = '🫧';
    bubbleEl.style.position = 'fixed';
    bubbleEl.style.left = x + 'px';
    bubbleEl.style.top = y + 'px';
    bubbleEl.style.fontSize = '20px';
    bubbleEl.style.zIndex = '999';
    bubbleEl.style.pointerEvents = 'none';
    bubbleEl.style.animation = `bubbleFloat ${1 + Math.random()}s ease-out forwards`;
    
    document.body.appendChild(bubbleEl);
    
    // Remove after animation
    setTimeout(() => {
        bubbleEl.remove();
    }, 2000);
}

// ===========================================
// Sparkle Cursor Effect
// ===========================================
function initSparkleCursor() {
    let lastX = 0;
    let lastY = 0;
    let sparkleTimeout;
    
    document.addEventListener('mousemove', function(e) {
        // Throttle sparkle creation
        if (sparkleModeActive && Math.abs(e.clientX - lastX) > 10 || Math.abs(e.clientY - lastY) > 10) {
            if (!sparkleTimeout) {
                sparkleTimeout = setTimeout(() => {
                    createSparkleAtCursor(e.clientX, e.clientY);
                    sparkleTimeout = null;
                }, 50);
            }
            
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });
    
    function createSparkleAtCursor(x, y) {
        const sparkleEl = document.createElement('div');
        sparkleEl.textContent = '✨';
        sparkleEl.style.position = 'fixed';
        sparkleEl.style.left = (x + Math.random() * 20 - 10) + 'px';
        sparkleEl.style.top = (y + Math.random() * 20 - 10) + 'px';
        sparkleEl.style.fontSize = '16px';
        sparkleEl.style.zIndex = '1000';
        sparkleEl.style.pointerEvents = 'none';
        sparkleEl.style.opacity = '0.7';
        sparkleEl.style.animation = 'cursorSparkle 1s ease-out forwards';
        
        document.body.appendChild(sparkleEl);
        
        // Remove after animation
        setTimeout(() => {
            sparkleEl.remove();
        }, 1000);
    }
    
    // Add CSS for cursor sparkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cursorSparkle {
            0% { transform: scale(0.5) rotate(0deg); opacity: 0.7; }
            100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
        }
        
        @keyframes sparkleFloat {
            0% { transform: translateY(0) scale(0.5); opacity: 1; }
            100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
        
        @keyframes heartFloat {
            0% { transform: translateY(0) scale(0.8); opacity: 1; }
            100% { transform: translateY(-150px) scale(1.2); opacity: 0; }
        }
        
        @keyframes bubbleFloat {
            0% { transform: translateY(0) scale(0.8); opacity: 1; }
            100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}

// ===========================================
// Sound System
// ===========================================
function initSoundSystem() {
    // Audio elements are already in HTML
    // This function sets up volume and playback
}

function playSound(soundId) {
    const audioElement = document.getElementById(`sound-${soundId}`);
    if (audioElement) {
        // Clone the audio element to allow overlapping sounds
        const clone = audioElement.cloneNode();
        clone.volume = 0.3;
        clone.play().catch(e => console.log('Audio play failed:', e));
        
        // Remove clone after it finishes
        clone.onended = () => clone.remove();
    }
}

// ===========================================
// Kawaii Notification System
// ===========================================
function showKawaiiNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.kawaii-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'kawaii-notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'linear-gradient(135deg, #ffb8e2, #ff8eb4)';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '25px';
    notification.style.boxShadow = '0 10px 30px rgba(255, 107, 157, 0.4)';
    notification.style.zIndex = '10000';
    notification.style.fontFamily = 'var(--font-heading)';
    notification.style.fontWeight = 'bold';
    notification.style.fontSize = '1.2rem';
    notification.style.border = '3px solid white';
    notification.style.animation = 'notificationSlide 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    document.body.appendChild(notification);
    
    // Add notification animation CSS
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notificationSlide {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
        
        // Add slide out animation
        if (!document.querySelector('#notification-slide-out')) {
            const style = document.createElement('style');
            style.id = 'notification-slide-out';
            style.textContent = `
                @keyframes notificationSlideOut {
                    0% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }, 3000);
}

// ===========================================
// Secret Mode
// ===========================================
function initSecretMode() {
    const secretBtn = document.getElementById('secret-mode');
    
    secretBtn.addEventListener('click', function() {
        // Play special sound
        playSound('sparkle');
        
        // Create massive sparkle effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createSparkleEffect(document.body);
            }, i * 50);
        }
        
        // Change background color temporarily
        const originalBg = document.querySelector('.color-shift-bg').style.background;
        document.querySelector('.color-shift-bg').style.background = 'linear-gradient(135deg, #ff00ff, #00ffff, #ffff00)';
        document.querySelector('.color-shift-bg').style.animation = 'colorShift 3s linear infinite';
        
        // Show secret message
        showKawaiiNotification('Secret Kawaii Mode Activated! 🌈✨');
        
        // Change cursor
        document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'28\' font-size=\'28\'>🌈</text></svg>") 16 16, auto';
        
        // Make everything bounce
        document.querySelectorAll('.kawaii-btn, .manga-book, .day-card, .gallery-item').forEach(el => {
            el.style.animation = 'bounce 1s infinite';
        });
        
        // Restore after 10 seconds
        setTimeout(() => {
            document.querySelector('.color-shift-bg').style.background = originalBg;
            document.querySelector('.color-shift-bg').style.animation = 'colorShift 20s ease infinite';
            document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><circle cx=\'16\' cy=\'16\' r=\'14\' fill=\'%23ff99cc\' opacity=\'0.7\'/><circle cx=\'16\' cy=\'16\' r=\'10\' fill=\'%23ff6b9d\' opacity=\'0.9\'/><circle cx=\'12\' cy=\'12\' r=\'3\' fill=\'white\'/><circle cx=\'20\' cy=\'12\' r=\'3\' fill=\'white\'/><path d=\'M12 20 Q16 24 20 20\' stroke=\'white\' stroke-width=\'2\' fill=\'none\'/></svg>") 16 16, auto';
            
            document.querySelectorAll('.kawaii-btn, .manga-book, .day-card, .gallery-item').forEach(el => {
                el.style.animation = '';
            });
            
            showKawaiiNotification('Secret Mode Ended! Back to normal cuteness! 🌸');
        }, 10000);
    });
}

// ===========================================
// Initialize everything when page loads
// ===========================================
// Already called at the top of the file