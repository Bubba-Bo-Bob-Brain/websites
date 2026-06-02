document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. PRELOADER LOGIC
    // =========================================
    const preloader = document.getElementById('preloader');
    
    // Simulate loading progress
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            // Initialize scroll animations after load
            initScrollAnimations();
        }, 800);
    }, 2000); // 2 seconds fake load time

    // =========================================
    // 2. CUSTOM CURSOR & SPARKLES
    // =========================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const body = document.body;

    // Mouse Move Event
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (animation in CSS handles smoothness)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });

        // Create sparkle trail occasionally
        if (Math.random() < 0.1) {
            createSparkle(posX, posY);
        }
    });

    // Hover Effects for Interactive Elements
    const interactiveElements = document.querySelectorAll('a, button, .manga-card, .guide-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            body.classList.remove('hovering');
        });
    });

    // Sparkle Factory
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.fontSize = `${Math.random() * 10 + 10}px`;
        sparkle.style.position = 'fixed';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9998';
        sparkle.style.color = '#FFC8DD';
        sparkle.innerText = '✨';
        document.body.appendChild(sparkle);

        // Animate and remove
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 2 + 1;
        const tx = Math.cos(angle) * 50;
        const ty = Math.sin(angle) * 50;

        sparkle.animate([
            { transform: `translate(0, 0) scale(1)`, opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }

    // =========================================
    // 3. GACHA SYSTEM
    // =========================================
    const gachaBtn = document.getElementById('gacha-btn');
    const gachaResult = document.getElementById('gacha-result');
    const gachaCard = gachaResult.querySelector('.gacha-card');
    const gachaImage = gachaResult.querySelector('.card-image');
    const gachaTitle = gachaResult.querySelector('h3');
    const mascotBubble = document.querySelector('.mascot-bubble');

    const characters = [
        { name: "Magical Girl", icon: "🦄", rarity: "SSR" },
        { name: "Ninja Cat", icon: "🐱", rarity: "SR" },
        { name: "Robot Boy", icon: "🤖", rarity: "R" },
        { name: "Forest Spirit", icon: "🌿", rarity: "SR" },
        { name: "Demon King", icon: "👹", rarity: "SSR" }
    ];

    gachaBtn.addEventListener('click', () => {
        // Hide previous result
        gachaResult.classList.add('hidden');
        
        // Button animation
        gachaBtn.innerHTML = `<span>Rolling...</span><span class="btn-icon">🎰</span>`;
        gachaBtn.style.pointerEvents = 'none';

        // Simulate rolling delay
        setTimeout(() => {
            const randomChar = characters[Math.floor(Math.random() * characters.length)];
            
            // Update Content
            gachaImage.innerText = randomChar.icon;
            gachaTitle.innerText = randomChar.name;
            gachaCard.querySelector('.card-rarity').innerText = randomChar.rarity;

            // Color code rarity
            const rarityEl = gachaCard.querySelector('.card-rarity');
            if(randomChar.rarity === 'SSR') {
                rarityEl.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
            } else if (randomChar.rarity === 'SR') {
                rarityEl.style.background = 'linear-gradient(45deg, #CDB4DB, #9D76C1)';
            } else {
                rarityEl.style.background = '#B5EAD7';
            }

            // Show Result
            gachaResult.classList.remove('hidden');

            // Reset Button
            gachaBtn.innerHTML = `<span>Try Again!</span><span class="btn-icon">🎰</span>`;
            gachaBtn.style.pointerEvents = 'all';

            // Mascot Reaction
            updateMascotBubble(`You got ${randomChar.name}! Kyun! 💖`);
        }, 1000);
    });

    // =========================================
    // 4. MASCOT COMPANION LOGIC
    // =========================================
    const mascot = document.getElementById('mascot-companion');
    const mascotBody = document.querySelector('.mascot-body');
    let mouseX = 0;
    let mouseY = 0;
    let mascotX = 0;
    let mascotY = 0;

    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate mascot following mouse with lag
    function animateMascot() {
        mascotX += (mouseX - mascotX) * 0.05;
        mascotY += (mouseY - mascotY) * 0.05;

        // Only move if on desktop (not touching)
        if (window.innerWidth > 768) {
            mascot.style.left = `${mascotX}px`;
            mascot.style.top = `${mascotY}px`;
        }
        requestAnimationFrame(animateMascot);
    }
    animateMascot();

    // Click interaction
    mascot.addEventListener('click', () => {
        const phrases = ["So cute! 🌸", "Let's read manga! 📚", "Moe moe kyun! 💖", "Anime is life! 📺"];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        updateMascotBubble(randomPhrase);
    });

    function updateMascotBubble(text) {
        mascotBubble.innerText = text;
        mascotBubble.classList.remove('hidden');
        // Hide after 3 seconds
        setTimeout(() => {
            mascotBubble.classList.add('hidden');
        }, 3000);
    }

    // =========================================
    // 5. SCROLL ANIMATIONS (Intersection Observer)
    // =========================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.manga-card, .section-header, .guide-item');
        animatedElements.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            observer.observe(el);
        });
    }

    // =========================================
    // 6. NAVBAR SCROLL EFFECT
    // =========================================
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.9)';
            nav.style.boxShadow = '0 10px 30px rgba(255, 143, 171, 0.3)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.6)';
            nav.style.boxShadow = '0 10px 20px rgba(255, 143, 171, 0.2)';
        }
    });
});