// ============================================
// SakuraDream - Kawaii Anime & Manga Paradise
// JavaScript - Moe Moe Kyun! ✿
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSparkleCanvas();
    initFloatingParticles();
    initCustomCursor();
    initMascot();
    initNavigation();
    initHeroSection();
    initFeaturedSection();
    initGachaMachine();
    initGallery();
    initMangaShelf();
    initCommunity();
    initBackToTop();
    initSakuraPetals();
});

// ============================================
// Sparkle Canvas for Cursor Trail
// ============================================
function initSparkleCanvas() {
    const canvas = document.getElementById('sparkle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    // Resize canvas to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create sparkle particles
        createSparkle(mouseX, mouseY);
    });
    
    // Create sparkle particle
    function createSparkle(x, y) {
        const colors = ['#ff9ec6', '#c9a0dc', '#ffd700', '#98e4bc', '#ffb7c5'];
        const sparkle = {
            x: x,
            y: y,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            shape: Math.random() > 0.5 ? 'circle' : 'star'
        };
        
        particles.push(sparkle);
    }
    
    // Draw star shape
    function drawStar(ctx, x, y, size, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 2);
        
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(0, size);
            ctx.lineTo(size * 0.382, size * 0.382);
            ctx.lineTo(size, 0);
            ctx.lineTo(size * 0.382, -size * 0.382);
            ctx.lineTo(0, -size);
            ctx.lineTo(-size * 0.382, -size * 0.382);
            ctx.lineTo(-size, 0);
            ctx.lineTo(-size * 0.382, size * 0.382);
            ctx.closePath();
            ctx.rotate(Math.PI * 2 / 5);
        }
        
        ctx.fill();
        ctx.restore();
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;
            
            // Draw particle
            if (p.life > 0) {
                ctx.globalAlpha = p.life;
                
                if (p.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                } else {
                    drawStar(ctx, p.x, p.y, p.size, p.color);
                }
            }
            
            // Remove dead particles
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// Floating Particles (Hearts, Stars, Bubbles)
// ============================================
function initFloatingParticles() {
    const container = document.getElementById('floating-particles');
    if (!container) return;
    
    const particleTypes = [
        { type: 'heart', symbol: '♥', class: 'particle-heart' },
        { type: 'star', symbol: '✦', class: 'particle-star' },
        { type: 'bubble', class: 'particle-bubble' },
        { type: 'flower', symbol: '✿', class: 'particle-flower' }
    ];
    
    function createParticle() {
        const particleInfo = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        const particle = document.createElement('div');
        
        particle.className = `particle ${particleInfo.class}`;
        
        if (particleInfo.symbol) {
            particle.textContent = particleInfo.symbol;
        }
        
        // Random position and animation
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        
        // Random size
        const size = Math.random() * 20 + 10;
        if (particleInfo.type === 'bubble') {
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
        } else {
            particle.style.fontSize = size + 'px';
        }
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode === container) {
                container.removeChild(particle);
            }
        }, 30000);
    }
    
    // Create initial particles
    for (let i = 0; i < 15; i++) {
        setTimeout(createParticle, i * 300);
    }
    
    // Continuously create new particles
    setInterval(createParticle, 2000);
}

// ============================================
// Custom Cursor
// ============================================
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    let cursorVisible = true;
    
    // Show cursor only on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
        
        // Change cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .mascot-body');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.color = '#ff6b9d';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.color = '#ff9ec6';
            });
        });
    } else {
        // Hide custom cursor on touch devices
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
}

// ============================================
// Mascot Companion
// ============================================
function initMascot() {
    const mascot = document.getElementById('mascot-companion');
    const speechBubble = document.getElementById('mascot-speech');
    if (!mascot || !speechBubble) return;
    
    const messages = [
        "Welcome to SakuraDream! ✿",
        "Try the Gacha machine! 🎰",
        "Check out new releases! ✨",
        "Moe moe kyun! 💖",
        "Discover amazing manga! 📚",
        "Join our community! 💬",
        "Have a kawaii day! 🌸",
        "Explore featured anime! ⭐",
        "Collect all characters! 🎁",
        "Your adventure awaits! 🗺️"
    ];
    
    let messageIndex = 0;
    
    // Show random message periodically
    function showRandomMessage() {
        const randomIndex = Math.floor(Math.random() * messages.length);
        const message = messages[randomIndex];
        
        speechBubble.querySelector('.speech-text').textContent = message;
        speechBubble.classList.add('active');
        
        setTimeout(() => {
            speechBubble.classList.remove('active');
        }, 4000);
    }
    
    // Initial message
    setTimeout(showRandomMessage, 2000);
    
    // Periodic messages
    setInterval(showRandomMessage, 30000);
    
    // Show message on click
    mascot.addEventListener('click', () => {
        showRandomMessage();
        
        // Add bounce animation
        mascot.querySelector('.mascot-body').style.animation = 'none';
        setTimeout(() => {
            mascot.querySelector('.mascot-body').style.animation = 'mascotBounce 2s ease-in-out infinite';
        }, 10);
    });
    
    // Hide mascot on mobile (optional)
    if (window.innerWidth < 768) {
        mascot.style.transform = 'scale(0.7)';
        mascot.style.bottom = '10px';
        mascot.style.right = '10px';
    }
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const nav = document.getElementById('main-nav');
    
    if (!navToggle || !navLinks || !nav) return;
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        
        // Animate toggle button
        const bars = navToggle.querySelectorAll('.toggle-bar');
        if (navLinks.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bars[0].style.transform = 'rotate(0) translate(0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'rotate(0) translate(0)';
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    const bars = navToggle.querySelectorAll('.toggle-bar');
                    bars[0].style.transform = 'rotate(0) translate(0)';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'rotate(0) translate(0)';
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active link
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    });
    
    // Change nav style on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos && 
                (section.offsetTop + section.offsetHeight) > scrollPos) {
                const id = section.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ============================================
// Hero Section
// ============================================
function initHeroSection() {
    // Animate stats counter
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
    }
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
    
    // Animate title characters
    const titleChars = document.querySelectorAll('.title-char');
    titleChars.forEach((char, index) => {
        char.style.animationDelay = `${index * 0.1}s`;
    });
}

// ============================================
// Featured Section
// ============================================
function initFeaturedSection() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const featuredCards = document.querySelectorAll('.featured-card');
    
    if (tabButtons.length === 0 || featuredCards.length === 0) return;
    
    // Tab filtering
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter cards
            featuredCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (tab === 'all' || category === tab) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    // Favorite button functionality
    document.querySelectorAll('.card-action-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            button.classList.toggle('favorited');
            
            if (button.classList.contains('favorited')) {
                button.textContent = '♥';
                // Add sparkle effect
                createSparkleEffect(button);
            } else {
                button.textContent = '♡';
            }
        });
    });
    
    // Create sparkle effect
    function createSparkleEffect(element) {
        const rect = element.getBoundingClientRect();
        const sparkleCount = 5;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✦';
            sparkle.style.position = 'fixed';
            sparkle.style.left = rect.left + (rect.width / 2) + 'px';
            sparkle.style.top = rect.top + (rect.height / 2) + 'px';
            sparkle.style.color = '#ffd700';
            sparkle.style.fontSize = '16px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = `sparkleFloat ${Math.random() * 1 + 0.5}s ease-out forwards`;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                document.body.removeChild(sparkle);
            }, 1500);
        }
    }
}

// ============================================
// Gacha Machine
// ============================================
function initGachaMachine() {
    const pullButton = document.getElementById('gacha-pull');
    const coinCount = document.getElementById('coin-count');
    const gachaModal = document.getElementById('gacha-modal');
    const modalClose = document.getElementById('modal-close');
    const gachaPreview = document.getElementById('gacha-preview');
    
    if (!pullButton || !coinCount || !gachaModal || !modalClose) return;
    
    // Gacha characters pool
    const characters = [
        { name: "Tanjiro", series: "Demon Slayer", emoji: "🔥", rarity: "legendary" },
        { name: "Gojo", series: "Jujutsu Kaisen", emoji: "👁️", rarity: "epic" },
        { name: "Sailor Moon", series: "Sailor Moon", emoji: "🌙", rarity: "rare" },
        { name: "Anya", series: "Spy x Family", emoji: "🥜", rarity: "common" },
        { name: "Luffy", series: "One Piece", emoji: "🏴‍☠️", rarity: "legendary" },
        { name: "Nezuko", series: "Demon Slayer", emoji: "👹", rarity: "epic" },
        { name: "Spike", series: "Cowboy Bebop", emoji: "🚀", rarity: "rare" },
        { name: "Shinobu", series: "Demon Slayer", emoji: "🦋", rarity: "epic" },
        { name: "Levi", series: "Attack on Titan", emoji: "⚔️", rarity: "legendary" },
        { name: "Saitama", series: "One Punch Man", emoji: "👊", rarity: "legendary" }
    ];
    
    let currentCoins = parseInt(coinCount.textContent);
    const pullCost = 10;
    
    // Pull function
    pullButton.addEventListener('click', () => {
        if (currentCoins >= pullCost) {
            // Deduct coins
            currentCoins -= pullCost;
            coinCount.textContent = currentCoins;
            
            // Add pull animation
            pullButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                pullButton.style.transform = 'scale(1)';
            }, 200);
            
            // Animate gacha window
            const gachaWindow = document.querySelector('.gacha-window');
            gachaWindow.style.animation = 'none';
            setTimeout(() => {
                gachaWindow.style.animation = 'gachaSpin 1s ease-in-out';
            }, 10);
            
            // Show result after delay
            setTimeout(() => {
                showGachaResult();
            }, 1000);
        } else {
            // Not enough coins
            showNotEnoughCoins();
        }
    });
    
    // Show gacha result
    function showGachaResult() {
        // Random character based on rarity weights
        const rarityWeights = {
            common: 50,
            rare: 30,
            epic: 15,
            legendary: 5
        };
        
        // Calculate total weight
        let totalWeight = 0;
        for (let rarity in rarityWeights) {
            totalWeight += rarityWeights[rarity];
        }
        
        // Random selection
        let random = Math.random() * totalWeight;
        let selectedRarity = 'common';
        
        for (let rarity in rarityWeights) {
            if (random < rarityWeights[rarity]) {
                selectedRarity = rarity;
                break;
            }
            random -= rarityWeights[rarity];
        }
        
        // Filter characters by rarity
        const filteredCharacters = characters.filter(char => char.rarity === selectedRarity);
        const selectedCharacter = filteredCharacters[Math.floor(Math.random() * filteredCharacters.length)];
        
        // Update modal content
        const resultRarity = document.getElementById('result-rarity');
        const resultImage = document.getElementById('result-image');
        const resultName = document.getElementById('result-name');
        const resultSeries = document.getElementById('result-series');
        
        resultRarity.textContent = selectedCharacter.rarity.toUpperCase();
        resultRarity.className = `result-rarity ${selectedCharacter.rarity}`;
        resultImage.textContent = selectedCharacter.emoji;
        resultName.textContent = selectedCharacter.name;
        resultSeries.textContent = selectedCharacter.series;
        
        // Show modal
        gachaModal.classList.add('active');
        
        // Add sparkles to modal
        createModalSparkles();
        
        // Update preview
        gachaPreview.innerHTML = `<span style="font-size: 3rem;">${selectedCharacter.emoji}</span>`;
        
        // Add coins for legendary pulls
        if (selectedCharacter.rarity === 'legendary') {
            currentCoins += 20;
            coinCount.textContent = currentCoins;
        }
    }
    
    // Create sparkles in modal
    function createModalSparkles() {
        const sparklesContainer = document.querySelector('.modal-sparkles');
        sparklesContainer.innerHTML = '';
        
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'modal-sparkle';
            sparkle.textContent = '✦';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.color = ['#ff9ec6', '#ffd700', '#c9a0dc', '#98e4bc'][Math.floor(Math.random() * 4)];
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            sparklesContainer.appendChild(sparkle);
        }
    }
    
    // Not enough coins message
    function showNotEnoughCoins() {
        const originalText = pullButton.querySelector('.pull-text').textContent;
        pullButton.querySelector('.pull-text').textContent = 'Not enough coins!';
        pullButton.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8787)';
        
        setTimeout(() => {
            pullButton.querySelector('.pull-text').textContent = originalText;
            pullButton.style.background = 'linear-gradient(135deg, #ffd700, #ffed4a)';
        }, 2000);
    }
    
    // Close modal
    modalClose.addEventListener('click', () => {
        gachaModal.classList.remove('active');
    });
    
    // Close modal when clicking backdrop
    document.querySelector('.modal-backdrop').addEventListener('click', () => {
        gachaModal.classList.remove('active');
    });
    
    // Create initial gacha bubbles
    const gachaBubbles = document.getElementById('gacha-bubbles');
    for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'gacha-bubble';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.top = Math.random() * 100 + '%';
        bubble.style.animationDelay = Math.random() * 3 + 's';
        gachaBubbles.appendChild(bubble);
    }
}

// ============================================
// Gallery Section
// ============================================
function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                const type = item.getAttribute('data-type');
                
                if (filter === 'all' || type === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
    
    // Favorite functionality for gallery
    document.querySelectorAll('.gallery-favorite button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isFavorited = button.classList.toggle('favorited');
            const countElement = button.nextElementSibling;
            let count = parseFloat(countElement.textContent);
            
            if (isFavorited) {
                button.textContent = '♥';
                countElement.textContent = (count + 0.1).toFixed(1) + 'k';
                createSparkleEffect(button);
            } else {
                button.textContent = '♡';
                countElement.textContent = (count - 0.1).toFixed(1) + 'k';
            }
        });
    });
}

// ============================================
// Manga Shelf
// ============================================
function initMangaShelf() {
    const volumes = document.querySelectorAll('.manga-volume');
    
    volumes.forEach(volume => {
        // Hover effect
        volume.addEventListener('mouseenter', () => {
            volume.style.transform = 'translateY(-20px) rotateY(-30deg)';
            
            // Create sparkle effect
            const rect = volume.getBoundingClientRect();
            for (let i = 0; i < 3; i++) {
                const sparkle = document.createElement('div');
                sparkle.textContent = '✦';
                sparkle.style.position = 'fixed';
                sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
                sparkle.style.color = '#ffd700';
                sparkle.style.fontSize = '14px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';
                sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    document.body.removeChild(sparkle);
                }, 1000);
            }
        });
        
        volume.addEventListener('mouseleave', () => {
            volume.style.transform = 'translateY(0) rotateY(0)';
        });
        
        // Click to show details (could be expanded)
        volume.addEventListener('click', () => {
            const title = volume.querySelector('.volume-title').textContent;
            const number = volume.querySelector('.volume-number').textContent;
            
            // Show a kawaii alert
            showKawaiiAlert(`${title} ${number}`, 'Great choice! 📚');
        });
    });
}

// ============================================
// Community Section
// ============================================
function initCommunity() {
    const form = document.getElementById('community-form');
    const communityBoard = document.querySelector('.community-board');
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    
    if (!form || !communityBoard) return;
    
    // Emoji picker functionality
    emojiButtons.forEach(button => {
        button.addEventListener('click', () => {
            const emoji = button.getAttribute('data-emoji');
            const textarea = document.getElementById('post-message');
            textarea.value += emoji;
            textarea.focus();
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const author = document.getElementById('post-author').value;
        const message = document.getElementById('post-message').value;
        
        if (author && message) {
            // Create new sticky note
            const noteColors = ['#fff3bf', '#d4edda', '#cce5ff', '#f8d7da', '#e2d9f3', '#fff0e6'];
            const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
            const randomRotation = (Math.random() * 6 - 3).toFixed(1);
            
            const newNote = document.createElement('div');
            newNote.className = 'sticky-note';
            newNote.style.setProperty('--note-color', randomColor);
            newNote.style.setProperty('--rotation', `${randomRotation}deg`);
            newNote.style.animation = 'fadeIn 0.5s ease forwards';
            
            // Generate random avatar
            const avatars = ['🐱', '🦊', '🐰', '🐻', '🦄', '🌸', '🐼', '🐨', '🐯', '🦁'];
            const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
            
            newNote.innerHTML = `
                <div class="note-header">
                    <span class="note-avatar">${randomAvatar}</span>
                    <span class="note-author">${author}</span>
                </div>
                <p class="note-text">${message}</p>
                <div class="note-footer">
                    <span class="note-likes">0</span>
                    <span class="note-time">Just now</span>
                </div>
            `;
            
            // Add to top of board
            communityBoard.insertBefore(newNote, communityBoard.firstChild);
            
            // Clear form
            form.reset();
            
            // Show success message
            showKawaiiAlert('Note Posted!', 'Your kawaii note is now on the board! 📝');
            
            // Add like functionality to new note
            addLikeFunctionality(newNote);
        }
    });
    
    // Add like functionality to existing notes
    document.querySelectorAll('.sticky-note').forEach(note => {
        addLikeFunctionality(note);
    });
    
    function addLikeFunctionality(note) {
        const likesElement = note.querySelector('.note-likes');
        if (likesElement) {
            likesElement.style.cursor = 'pointer';
            likesElement.addEventListener('click', () => {
                let likes = parseFloat(likesElement.textContent);
                if (!isNaN(likes)) {
                    likesElement.textContent = likes + 1;
                    likesElement.style.color = '#ff6b9d';
                    likesElement.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        likesElement.style.transform = 'scale(1)';
                    }, 200);
                }
            });
        }
    }
}

// ============================================
// Back to Top Button
// ============================================
function initBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Sakura Petals
// ============================================
function initSakuraPetals() {
    const container = document.getElementById('sakura-container');
    if (!container) return;
    
    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        
        // Random properties
        const size = Math.random() * 10 + 10;
        const startX = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${startX}vw`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${delay}s`;
        
        container.appendChild(petal);
        
        // Remove petal after animation
        setTimeout(() => {
            if (petal.parentNode === container) {
                container.removeChild(petal);
            }
        }, (duration + delay) * 1000);
    }
    
    // Create initial petals
    for (let i = 0; i < 30; i++) {
        createPetal();
    }
    
    // Continuously create new petals
    setInterval(createPetal, 300);
}

// ============================================
// Utility Functions
// ============================================

// Show kawaii alert
function showKawaiiAlert(title, message) {
    // Create alert element
    const alert = document.createElement('div');
    alert.style.position = 'fixed';
    alert.style.top = '50%';
    alert.style.left = '50%';
    alert.style.transform = 'translate(-50%, -50%)';
    alert.style.background = 'white';
    alert.style.padding = '30px';
    alert.style.borderRadius = '24px';
    alert.style.boxShadow = '0 20px 60px rgba(255, 150, 180, 0.3)';
    alert.style.border = '3px solid #ffb7c5';
    alert.style.zIndex = '10000';
    alert.style.textAlign = 'center';
    alert.style.maxWidth = '90%';
    alert.style.width = '300px';
    alert.style.animation = 'fadeIn 0.3s ease';
    
    alert.innerHTML = `
        <h3 style="font-family: 'Fredoka One', cursive; color: #ff6b9d; margin-bottom: 15px; font-size: 1.5rem;">
            ${title}
        </h3>
        <p style="font-family: 'Quicksand', sans-serif; color: #5a4a6a; margin-bottom: 20px;">
            ${message}
        </p>
        <button style="
            background: linear-gradient(135deg, #ff9ec6, #c9a0dc);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 20px;
            font-family: 'Quicksand', sans-serif;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.3s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Got it! ✿
        </button>
    `;
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.right = '0';
    backdrop.style.bottom = '0';
    backdrop.style.background = 'rgba(90, 74, 106, 0.5)';
    backdrop.style.backdropFilter = 'blur(5px)';
    backdrop.style.zIndex = '9999';
    
    document.body.appendChild(backdrop);
    document.body.appendChild(alert);
    
    // Close function
    function closeAlert() {
        alert.style.animation = 'fadeOut 0.3s ease';
        backdrop.style.animation = 'fadeOut 0.3s ease';
        
        setTimeout(() => {
            if (document.body.contains(alert)) document.body.removeChild(alert);
            if (document.body.contains(backdrop)) document.body.removeChild(backdrop);
        }, 300);
    }
    
    // Close on button click
    alert.querySelector('button').addEventListener('click', closeAlert);
    
    // Close on backdrop click
    backdrop.addEventListener('click', closeAlert);
    
    // Close on escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeAlert();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Create sparkle effect (reusable)
function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 5;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✦';
        sparkle.style.position = 'fixed';
        sparkle.style.left = rect.left + (rect.width / 2) + 'px';
        sparkle.style.top = rect.top + (rect.height / 2) + 'px';
        sparkle.style.color = '#ffd700';
        sparkle.style.fontSize = '16px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = `sparkleFloat ${Math.random() * 1 + 0.5}s ease-out forwards`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            document.body.removeChild(sparkle);
        }, 1500);
    }
}

// Add CSS for sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes gachaSpin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(sparkleStyle);

// ============================================
// Add more kawaii sounds (optional)
// ============================================
function initKawaiiSounds() {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play click sound
    function playClickSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    // Add click sounds to buttons (optional - uncomment to enable)
    /*
    document.querySelectorAll('button, .nav-link, .gacha-pull-btn').forEach(element => {
        element.addEventListener('click', playClickSound);
    });
    */
}

// Uncomment to enable sounds
// initKawaiiSounds();