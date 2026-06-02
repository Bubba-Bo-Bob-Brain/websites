/**
 * MOE-VERSE INTERACTIVE ENGINE
 * Focus: Immersive animations, Gacha mechanics, and Particle physics.
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticleSystem();
    initMascotBehavior();
    initGachaSystem();
    initSmoothScroll();
    initHeroInteraction();
});

/**
 * 1. BACKGROUND PARTICLE SYSTEM
 * Generates floating hearts, stars, and bubbles.
 */
function initParticleSystem() {
    const canvas = document.getElementById('kawaii-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleTypes = ['❤️', '⭐', '🌸', '☁️', '✨', '🍭'];
    const colors = ['#FFB7CE', '#E6E6FA', '#BFFCC6', '#FFFACD', '#FF69B4'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 100;
            this.size = Math.random() * 20 + 10;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.sin(Math.random() * Math.PI) * 1;
            this.type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
        }

        update(mouse) {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            // Mouse interaction: Particles move away from cursor
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                this.x -= dx / 20;
                this.y -= dy / 20;
            }

            if (this.y < -50) this.reset();
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.font = `${this.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.type, 0, 0);
            ctx.restore();
        }
    }

    const mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update(mouse);
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/**
 * 2. REACTIVE MASCOT (Moe-Chan)
 */
function initMascotBehavior() {
    const mascot = document.getElementById('moe-chan');
    const bubble = mascot.querySelector('.speech-bubble');
    const phrases = [
        "Konnichiwa! ✨",
        "Moe moe kyun! ♡",
        "Do you like manga? 📖",
        "You're so cute! (✿◠‿◠)",
        "Let's roll the Gacha! 🎰",
        "Stay kawaii! 🎀"
    ];

    // Floating follow effect
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Gently drift towards mouse but stay in corner
        const targetX = x > window.innerWidth / 2 ? 30 : window.innerWidth - 130;
        const targetY = y > window.innerHeight / 2 ? 30 : window.innerHeight - 130;
        
        // We use a slow transition in CSS, but we can trigger specific reactions here
    });

    // Change phrases every 5 seconds
    setInterval(() => {
        bubble.style.opacity = '0';
        setTimeout(() => {
            bubble.innerText = phrases[Math.floor(Math.random() * phrases.length)];
            bubble.style.opacity = '1';
        }, 500);
    }, 5000);
}

/**
 * 3. GACHA SYSTEM
 */
function initGachaSystem() {
    const lever = document.getElementById('gacha-lever');
    const modal = document.getElementById('gacha-modal');
    const resultDisplay = document.getElementById('result-display');
    const closeModal = document.getElementById('close-modal');

    const rewards = [
        { name: "Ultra Rare Waifu", icon: "👑", rarity: "LEGENDARY", color: "#FFD700" },
        { name: "Super Rare Husbando", icon: "💎", rarity: "SUPER RARE", color: "#00FFFF" },
        { name: "Cute Chibi", icon: "🐾", rarity: "RARE", color: "#FFB7CE" },
        { name: "Magic Wand", icon: "🪄", rarity: "COMMON", color: "#E6E6FA" },
        { name: "Strawberry Cake", icon: "🍰", rarity: "COMMON", color: "#FFFACD" },
        { name: "Cat Ears", icon: "🐱", rarity: "COMMON", color: "#BFFCC6" },
    ];

    lever.addEventListener('click', () => {
        // Visual feedback for lever
        lever.style.transform = 'rotate(45deg)';
        
        // Play "rolling" sound simulation with a delay
        setTimeout(() => {
            lever.style.transform = 'rotate(0deg)';
            revealReward();
        }, 600);
    });

    function revealReward() {
        // Weighted Randomization
        const rand = Math.random() * 100;
        let reward;

        if (rand < 5) reward = rewards[0]; // 5% Legendary
        else if (rand < 20) reward = rewards[1]; // 15% SR
        else if (rand < 45) reward = rewards[2]; // 25% Rare
        else reward = rewards[Math.floor(Math.random() * 3) + 3]; // Common

        // Build the result HTML
        resultDisplay.innerHTML = `
            <div class="reward-card" style="color: ${reward.color}">
                <div class="reward-icon">${reward.icon}</div>
                <div class="reward-rarity">${reward.rarity}</div>
                <div class="reward-name">${reward.name}</div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

/**
 * 4. UX ENHANCEMENTS
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function initHeroInteraction() {
    const exploreBtn = document.getElementById('explore-btn');
    exploreBtn.addEventListener('click', () => {
        document.getElementById('gacha').scrollIntoView({ behavior: 'smooth' });
        
        // Add a burst of sparkles on click
        for(let i=0; i<10; i++) {
            createSparkle(exploreBtn.getBoundingClientRect());
        }
    });
}

function createSparkle(rect) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
    sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '10000';
    sparkle.style.transition = 'all 1s ease-out';
    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.style.transform = `translate(${(Math.random()-0.5)*100}px, -100px) scale(0)`;
        sparkle.style.opacity = '0';
    }, 10);

    setTimeout(() => sparkle.remove(), 1000);
}