// ==========================================
// ✦ Kawaii Manga & Anime Wonderland ✦
// JavaScript - Step 3
// ==========================================

// ==========================================
// Sparkle Trail Effect
// ==========================================
class SparkleTrail {
    constructor() {
        this.canvas = document.getElementById('sparkleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.sparkles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastSparkleTime = 0;
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isActive = true;
        });
        
        document.addEventListener('mouseleave', () => {
            this.isActive = false;
        });
        
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouseX = touch.clientX;
            this.mouseY = touch.clientY;
            this.isActive = true;
        });
        
        document.addEventListener('touchend', () => {
            this.isActive = false;
        });
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createSparkle(x, y) {
        const colors = [
            '#ff9eb5', '#c9b1ff', '#b5d8ff', '#fff5b5', '#b5f0d5',
            '#ffd1dc', '#e8b4f8', '#fce4ec', '#fff3e0', '#e8f5e9'
        ];
        
        const size = Math.random() * 8 + 3;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        
        return {
            x: x,
            y: y,
            size: size,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            angle: angle,
            speed: speed,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            shape: Math.random() > 0.5 ? 'star' : 'circle'
        };
    }
    
    drawSparkle(sparkle) {
        this.ctx.save();
        this.ctx.translate(sparkle.x, sparkle.y);
        this.ctx.rotate(sparkle.rotation);
        this.ctx.globalAlpha = sparkle.opacity;
        
        if (sparkle.shape === 'star') {
            // Draw a 4-pointed star
            const spikes = 4;
            const outerRadius = sparkle.size;
            const innerRadius = sparkle.size * 0.4;
            
            this.ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes - Math.PI / 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.fillStyle = sparkle.color;
            this.ctx.fill();
            
            // Add glow
            this.ctx.shadowColor = sparkle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
        } else {
            // Draw a circle with glow
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, sparkle.size);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(0.3, sparkle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, sparkle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    updateSparkles() {
        // Create new sparkles based on mouse movement
        if (this.isActive && Date.now() - this.lastSparkleTime > 50) {
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            this.sparkles.push(this.createSparkle(
                this.mouseX + offsetX,
                this.mouseY + offsetY
            ));
            this.lastSparkleTime = Date.now();
            
            // Add extra sparkles occasionally
            if (Math.random() > 0.7) {
                this.sparkles.push(this.createSparkle(
                    this.mouseX + (Math.random() - 0.5) * 40,
                    this.mouseY + (Math.random() - 0.5) * 40
                ));
            }
        }
        
        // Update existing sparkles
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            const sparkle = this.sparkles[i];
            
            sparkle.x += Math.cos(sparkle.angle) * sparkle.speed;
            sparkle.y += Math.sin(sparkle.angle) * sparkle.speed - 0.5;
            sparkle.opacity -= sparkle.decay;
            sparkle.rotation += sparkle.rotationSpeed;
            sparkle.life -= sparkle.decay;
            sparkle.size *= 0.99;
            
            if (sparkle.opacity <= 0 || sparkle.life <= 0) {
                this.sparkles.splice(i, 1);
            }
        }
        
        // Limit total sparkles
        if (this.sparkles.length > 200) {
            this.sparkles.splice(0, this.sparkles.length - 200);
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateSparkles();
        
        for (const sparkle of this.sparkles) {
            this.drawSparkle(sparkle);
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// Floating Bubbles
// ==========================================
class BubbleManager {
    constructor() {
        this.container = document.getElementById('bubblesContainer');
        this.bubbles = [];
        this.maxBubbles = 15;
        this.init();
    }
    
    init() {
        this.createBubbles();
        setInterval(() => this.maintainBubbles(), 2000);
    }
    
    createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${Math.random() * 0.3 + 0.1};
        `;
        
        this.container.appendChild(bubble);
        this.bubbles.push(bubble);
        
        // Remove bubble after animation
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
                this.bubbles = this.bubbles.filter(b => b !== bubble);
            }
        }, (duration + delay) * 1000);
    }
    
    createBubbles() {
        for (let i = 0; i < this.maxBubbles; i++) {
            setTimeout(() => this.createBubble(), i * 500);
        }
    }
    
    maintainBubbles() {
        const currentBubbles = this.container.children.length;
        if (currentBubbles < this.maxBubbles) {
            this.createBubble();
        }
    }
}

// ==========================================
// Floating Hearts
// ==========================================
class HeartManager {
    constructor() {
        this.container = document.getElementById('heartsContainer');
        this.hearts = ['♡', '♥', '💕', '💗', '💖'];
        this.maxHearts = 12;
        this.init();
    }
    
    init() {
        this.createHearts();
        setInterval(() => this.maintainHearts(), 3000);
    }
    
    createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        const left = Math.random() * 100;
        const size = Math.random() * 16 + 14;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 10;
        const heartChar = this.hearts[Math.floor(Math.random() * this.hearts.length)];
        
        heart.textContent = heartChar;
        heart.style.cssText = `
            left: ${left}%;
            font-size: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${Math.random() * 0.4 + 0.2};
        `;
        
        this.container.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, (duration + delay) * 1000);
    }
    
    createHearts() {
        for (let i = 0; i < this.maxHearts; i++) {
            setTimeout(() => this.createHeart(), i * 800);
        }
    }
    
    maintainHearts() {
        const currentHearts = this.container.children.length;
        if (currentHearts < this.maxHearts) {
            this.createHeart();
        }
    }
}

// ==========================================
// Mascot Companion
// ==========================================
class MascotCompanion {
    constructor() {
        this.mascot = document.getElementById('mascot');
        this.speechBubble = document.getElementById('speechBubble');
        this.speechText = this.speechBubble.querySelector('.speech-text');
        this.messages = [
            'Konnichiwa! ♡',
            'Moe moe kyun! ✨',
            'You\'re so kawaii! 💕',
            'Check out the gacha! 🎊',
            'I love anime! 🌸',
            'Sugoi! 🎀',
            'Let\'s be friends! 💗',
            'You found me! ⭐',
            'Nyaa~! 🐱',
            'Kawaii desu ne! ✿'
        ];
        this.messageIndex = 0;
        this.init();
    }
    
    init() {
        this.mascot.addEventListener('click', () => this.interact());
        
        // Auto message every 8 seconds
        setInterval(() => this.showMessage(), 8000);
        
        // First message after 2 seconds
        setTimeout(() => this.showMessage(), 2000);
    }
    
    showMessage() {
        this.messageIndex = (this.messageIndex + 1) % this.messages.length;
        this.speechText.textContent = this.messages[this.messageIndex];
        this.speechBubble.classList.add('show');
        
        setTimeout(() => {
            this.speechBubble.classList.remove('show');
        }, 3000);
    }
    
    interact() {
        this.speechText.textContent = 'Kyaa! You touched me! 💖';
        this.speechBubble.classList.add('show');
        
        this.mascot.style.animation = 'none';
        this.mascot.offsetHeight; // Trigger reflow
        this.mascot.style.animation = 'mascot-bounce 0.5s ease-in-out 3';
        
        setTimeout(() => {
            this.speechBubble.classList.remove('show');
        }, 2000);
    }
}

// ==========================================
// Navigation
// ==========================================
class Navigation {
    constructor() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('.section');
        this.init();
    }
    
    init() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.dataset.section;
                const targetSection = document.getElementById(sectionId);
                
                // Update active state
                this.navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Scroll to section
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Intersection Observer for sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Update nav active state
                    const sectionId = entry.target.id;
                    this.navItems.forEach(nav => {
                        nav.classList.toggle('active', nav.dataset.section === sectionId);
                    });
                }
            });
        }, { threshold: 0.2 });
        
        this.sections.forEach(section => observer.observe(section));
        
        // Make initial sections visible
        setTimeout(() => {
            this.sections.forEach(section => section.classList.add('visible'));
        }, 500);
    }
}

// ==========================================
// Character Carousel
// ==========================================
class CharacterCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.scrollAmount = 220;
        this.autoScrollInterval = null;
        this.init();
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => this.scroll(-1));
        this.nextBtn.addEventListener('click', () => this.scroll(1));
        
        // Auto scroll
        this.startAutoScroll();
        
        // Pause on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoScroll());
        this.track.addEventListener('mouseleave', () => this.startAutoScroll());
        
        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.scroll(1);
                } else {
                    this.scroll(-1);
                }
            }
        }, { passive: true });
    }
    
    scroll(direction) {
        this.track.scrollBy({
            left: direction * this.scrollAmount,
            behavior: 'smooth'
        });
        
        // Create sparkle effect on scroll
        this.createScrollSparkles(direction);
    }
    
    createScrollSparkles(direction) {
        const sparkleContainer = document.querySelector('.characters-carousel');
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✦';
            sparkle.style.cssText = `
                position: absolute;
                top: ${Math.random() * 100}%;
                ${direction > 0 ? 'right' : 'left'}: -20px;
                font-size: ${Math.random() * 16 + 8}px;
                color: var(--pink-primary);
                pointer-events: none;
                z-index: 20;
                animation: sparkle-fly 0.8s ease-out forwards;
            `;
            sparkleContainer.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 800);
        }
    }
    
    startAutoScroll() {
        this.autoScrollInterval = setInterval(() => {
            this.scroll(1);
        }, 4000);
    }
    
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }
}

// ==========================================
// Gacha System
// ==========================================
class GachaSystem {
    constructor() {
        this.button = document.getElementById('gachaButton');
        this.display = document.getElementById('gachaResult');
        this.collectionSlots = document.getElementById('collectionSlots');
        this.collection = [];
        this.maxCollection = 10;
        this.isPulling = false;
        
        this.characters = [
            { emoji: '🐱', name: 'Nya-chan', rarity: 'common', weight: 40 },
            { emoji: '🧸', name: 'Kuma-kun', rarity: 'common', weight: 35 },
            { emoji: '🐰', name: 'Usa-pyon', rarity: 'uncommon', weight: 25 },
            { emoji: '🦊', name: 'Kitsune-san', rarity: 'uncommon', weight: 20 },
            { emoji: '🐼', name: 'Panda-kun', rarity: 'uncommon', weight: 20 },
            { emoji: '🦄', name: 'Uni-chan', rarity: 'rare', weight: 15 },
            { emoji: '🌟', name: 'Hoshi-chan', rarity: 'rare', weight: 12 },
            { emoji: '🌸', name: 'Sakura-chan', rarity: 'rare', weight: 10 },
            { emoji: '💎', name: 'Kira-chan', rarity: 'ultra-rare', weight: 5 },
            { emoji: '👑', name: 'Princess-chan', rarity: 'ultra-rare', weight: 3 }
        ];
        
        this.init();
    }
    
    init() {
        this.button.addEventListener('click', () => this.pull());
    }
    
    pull() {
        if (this.isPulling) return;
        this.isPulling = true;
        
        // Disable button
        this.button.style.pointerEvents = 'none';
        this.button.style.opacity = '0.7';
        
        // Animate display
        this.display.style.animation = 'result-pulse 0.3s ease-in-out 3';
        
        // Show pulling animation
        this.display.innerHTML = `
            <div class="gacha-result">
                <span class="result-emoji" style="animation: spin-star 0.5s linear infinite;">🎰</span>
                <span class="result-text">Pulling... ✨</span>
            </div>
        `;
        
        // Simulate pull delay
        setTimeout(() => {
            const character = this.getRandomCharacter();
            this.showResult(character);
            this.addToCollection(character);
            this.isPulling = false;
            
            // Re-enable button
            this.button.style.pointerEvents = 'all';
            this.button.style.opacity = '1';
        }, 1500);
    }
    
    getRandomCharacter() {
        const totalWeight = this.characters.reduce((sum, char) => sum + char.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const character of this.characters) {
            random -= character.weight;
            if (random <= 0) {
                return character;
            }
        }
        
        return this.characters[0];
    }
    
    showResult(character) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'gacha-pull-overlay';
        
        const rarityColors = {
            'common': '#8b8b8b',
            'uncommon': '#b5f0d5',
            'rare': '#b5d8ff',
            'ultra-rare': '#c9b1ff'
        };
        
        overlay.innerHTML = `
            <div class="gacha-pull-result">
                <span class="pull-emoji">${character.emoji}</span>
                <h2 class="pull-name">${character.name}</h2>
                <p class="pull-rarity ${character.rarity}">
                    ${character.rarity === 'ultra-rare' ? '🌈 ' : ''}
                    ${character.rarity.toUpperCase()}
                    ${character.rarity === 'ultra-rare' ? ' 🌈' : ''}
                </p>
                <button class="pull-close-btn">Yay! ♡</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Trigger animation
        setTimeout(() => overlay.classList.add('active'), 50);
        
        // Update display
        this.display.innerHTML = `
            <div class="gacha-result">
                <span class="result-emoji">${character.emoji}</span>
                <span class="result-text">${character.name} appeared! ✨</span>
            </div>
        `;
        
        // Create sparkle burst
        this.createSparkleBurst(character.rarity);
        
        // Close handler
        overlay.querySelector('.pull-close-btn').addEventListener('click', () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 500);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.classList.remove('active');
                setTimeout(() => overlay.remove(), 500);
            }
        }, 5000);
    }
    
    createSparkleBurst(rarity) {
        const burstCount = rarity === 'ultra-rare' ? 30 : rarity === 'rare' ? 20 : 10;
        const colors = {
            'common': ['#d4d4d4', '#e8e8e8'],
            'uncommon': ['#b5f0d5', '#d4f5e8'],
            'rare': ['#b5d8ff', '#d4e8ff'],
            'ultra-rare': ['#ff9eb5', '#c9b1ff', '#fff5b5', '#b5f0d5']
        };
        
        const burstColors = colors[rarity] || colors.common;
        
        for (let i = 0; i < burstCount; i++) {
            const sparkle = document.createElement('div');
            const angle = (i / burstCount) * Math.PI * 2;
            const distance = Math.random() * 200 + 100;
            const size = Math.random() * 10 + 5;
            
            sparkle.textContent = '✦';
            sparkle.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                font-size: ${size}px;
                color: ${burstColors[Math.floor(Math.random() * burstColors.length)]};
                pointer-events: none;
                z-index: 10001;
                transform: translate(-50%, -50%);
                animation: burst-fly 1s ease-out forwards;
                --burst-x: ${Math.cos(angle) * distance}px;
                --burst-y: ${Math.sin(angle) * distance}px;
            `;
            
            document.body.appendChild(sparkle);
            
            // Animate using custom properties
            sparkle.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(1.5)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }
    
    addToCollection(character) {
        this.collection.push(character);
        this.updateCollectionDisplay();
    }
    
    updateCollectionDisplay() {
        const slots = this.collectionSlots.querySelectorAll('.collection-slot');
        
        // Show collected characters
        this.collection.forEach((char, index) => {
            if (index < slots.length) {
                const slot = slots[index];
                slot.textContent = char.emoji;
                slot.className = 'collection-slot';
                slot.title = `${char.name} (${char.rarity})`;
                
                // Add rarity color
                const rarityColors = {
                    'common': '#f0f0f0',
                    'uncommon': '#e8f5e9',
                    'rare': '#e3f2fd',
                    'ultra-rare': 'linear-gradient(135deg, #fce4ec, #f3e5f5, #e8f5e9)'
                };
                
                if (char.rarity === 'ultra-rare') {
                    slot.style.background = rarityColors[char.rarity];
                } else {
                    slot.style.background = rarityColors[char.rarity];
                }
            }
        });
        
        // Fill remaining slots
        for (let i = this.collection.length; i < slots.length; i++) {
            const slot = slots[i];
            slot.textContent = '+';
            slot.className = 'collection-slot empty';
            slot.style.background = '';
            slot.title = 'Empty slot - pull more!';
        }
        
        // Add extra slot if needed
        if (this.collection.length > slots.length) {
            const extraSlot = document.createElement('div');
            extraSlot.className = 'collection-slot';
            extraSlot.textContent = '✨';
            extraSlot.title = `${this.collection.length} characters collected!`;
            this.collectionSlots.appendChild(extraSlot);
        }
    }
}

// ==========================================
// Color Shift Toggle
// ==========================================
class ColorShift {
    constructor() {
        this.toggle = document.getElementById('colorShiftToggle');
        this.isActive = false;
        this.init();
    }
    
    init() {
        this.toggle.addEventListener('click', () => this.toggleShift());
        
        // Auto shift every 30 seconds
        setInterval(() => this.toggleShift(), 30000);
    }
    
    toggleShift() {
        this.isActive = !this.isActive;
        
        if (this.isActive) {
            document.documentElement.classList.add('color-shift-active');
            this.toggle.querySelector('.toggle-text').textContent = '✦ Magic Active ✦';
            this.toggle.style.borderColor = '#b5d8ff';
            
            // Create transition sparkles
            this.createTransitionSparkles();
        } else {
            document.documentElement.classList.remove('color-shift-active');
            this.toggle.querySelector('.toggle-text').textContent = 'Pastel Magic';
            this.toggle.style.borderColor = 'var(--pink-primary)';
        }
    }
    
    createTransitionSparkles() {
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 20 + 10}px;
                pointer-events: none;
                z-index: 9998;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: transition-sparkle 1.5s ease-out forwards;
            `;
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1500);
        }
    }
}

// ==========================================
// Mouse Parallax Effect
// ==========================================
class ParallaxEffect {
    constructor() {
        this.cards = document.querySelectorAll('.featured-card, .genre-card, .character-card');
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            this.cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - cardCenterX) / 30;
                const deltaY = (e.clientY - cardCenterY) / 30;
                
                card.style.setProperty('--parallax-x', `${deltaX}px`);
                card.style.setProperty('--parallax-y', `${deltaY}px`);
                
                // Apply subtle transform on hover
                if (card.matches(':hover')) {
                    card.style.transform = `translateY(-10px) translateX(${deltaX * 0.5}px) translateY(${deltaY * 0.5}px)`;
                }
            });
        });
    }
}

// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Create background effects
    const bubbles = new BubbleManager();
    const hearts = new HeartManager();
    
    // Create interactive elements
    const sparkles = new SparkleTrail();
    const mascot = new MascotCompanion();
    const navigation = new Navigation();
    const carousel = new CharacterCarousel();
    const gacha = new GachaSystem();
    const colorShift = new ColorShift();
    const parallax = new ParallaxEffect();
    
    // Add burst animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle-fly {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(${Math.random() > 0.5 ? '-' : ''}100px, -50px) scale(0); opacity: 0; }
        }
        
        @keyframes burst-fly {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(var(--burst-x), var(--burst-y)) scale(1.5); opacity: 0; }
        }
        
        @keyframes transition-sparkle {
            0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100px) scale(1.5) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🌸 Kawaii Wonderland is ready! ✨');
    console.log('♡ Moe moe kyun! ♡');
});