document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. CUSTOM CURSOR & TRAIL
    // =========================================
    const cursor = document.querySelector('.custom-cursor');
    const trailContainer = document.getElementById('cursor-trail');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Smooth follow animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }

    // Create sparkle trail
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        // Random size and rotation
        const size = Math.random() * 10 + 5;
        const rotation = Math.random() * 360;
        
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.transform = `rotate(${rotation}deg)`;
        sparkle.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
        sparkle.style.borderRadius = '50%';
        sparkle.style.position = 'absolute';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.transition = 'all 0.8s ease-out';
        
        trailContainer.appendChild(sparkle);

        // Animate out
        setTimeout(() => {
            sparkle.style.opacity = '0';
            sparkle.style.transform = `rotate(${rotation + 180}deg) scale(0)`;
        }, 10);

        // Remove from DOM
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 800);
    }

    // Event Listeners for Cursor
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        createSparkle(e.clientX, e.clientY);
    });

    // Click effect
    window.addEventListener('click', (e) => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createSparkle(e.clientX + (Math.random() * 40 - 20), e.clientY + (Math.random() * 40 - 20));
            }, i * 50);
        }
    });

    // Hover states for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .manga-card, .mascot');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    // Start animation loop
    animateCursor();

    // =========================================
    // 2. MASCOT COMPANION
    // =========================================
    const mascot = document.getElementById('mascot-companion');
    const mascotText = document.getElementById('mascot-text');
    
    const messages = {
        idle: ["Welcome to Moe World! (◕‿◕)", "Looking for something cute?", "Don't forget to summon!"],
        summon: ["WOW! A new friend!", "So shiny! ✨", "Look at that rarity!"],
        hover: ["Eek! So close!", "Tickle tickle?", "Don't eat me!"],
        click: ["Kyaa! (⁄ ⁄•⁄ω⁄•⁄ ⁄)", "You're so strong!", "Best human ever!"]
    };

    // Mascot follows mouse slightly (parallax effect)
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.clientX) / 30;
        const y = (window.innerHeight - e.clientY) / 30;
        mascot.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Change text on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            updateMascotText("Scrolling is fun! 🚀");
        } else {
            updateMascotText("Welcome to Moe World! (◕‿◕)");
        }
    });

    // Mascot interactions
    mascot.addEventListener('mouseenter', () => {
        updateMascotText("Hi there! 👋", "hover");
        const svg = mascot.querySelector('svg');
        if (svg) svg.style.transform = "scale(1.1)";
    });

    mascot.addEventListener('mouseleave', () => {
        updateMascotText("Come back soon! 💖", "idle");
        const svg = mascot.querySelector('svg');
        if (svg) svg.style.transform = "scale(1)";
    });

    mascot.addEventListener('click', () => {
        updateMascotText("Kyaa! Best click! 💖", "click");
        // Jump animation
        mascot.style.transition = "transform 0.2s";
        mascot.style.transform = "translateY(-30px)";
        setTimeout(() => {
            mascot.style.transform = "translateY(0)";
        }, 200);
    });

    function updateMascotText(text, state = 'idle') {
        mascotText.style.opacity = 0;
        setTimeout(() => {
            mascotText.textContent = text;
            mascotText.style.opacity = 1;
        }, 200);
    }

    // =========================================
    // 3. GACHA SYSTEM
    // =========================================
    const summonBtn = document.querySelector('.summon-btn');
    const gachaCard = document.querySelector('.gacha-card');
    const cardName = document.querySelector('.card-name');
    const cardStars = document.querySelector('.card-stars');
    const cardImage = document.querySelector('.card-image-placeholder');
    const rarityBadge = document.querySelector('.card-rarity');

    const characters = [
        { name: "Magical Girl Star", rarity: "SSR", color: "#FFD700", stars: "⭐⭐⭐⭐⭐" },
        { name: "Cyber Ninja", rarity: "SR", color: "#FF69B4", stars: "⭐⭐⭐⭐" },
        { name: "Cat Spirit", rarity: "R", color: "#87CEEB", stars: "⭐⭐⭐" },
        { name: "School Idol", rarity: "SR", color: "#98FB98", stars: "⭐⭐⭐⭐" }
    ];

    let isSummoning = false;

    if (summonBtn) {
        summonBtn.addEventListener('click', () => {
            if (isSummoning) return;
            isSummoning = true;
            summonBtn.disabled = true;
            summonBtn.textContent = "Summoning...";
            updateMascotText("Fingers crossed! ✨", "summon");

            // 1. Flash effect
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.background = 'white';
            flash.style.zIndex = '9999';
            flash.style.transition = 'opacity 0.5s';
            document.body.appendChild(flash);

            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    if (flash.parentNode) flash.remove();
                }, 500);
            }, 100);

            // 2. Shake the card
            gachaCard.style.animation = "shake 0.5s ease-in-out";

            setTimeout(() => {
                gachaCard.style.animation = "";

                // 3. Reveal random character
                const char = characters[Math.floor(Math.random() * characters.length)];
                cardName.textContent = char.name;
                cardStars.textContent = char.stars;
                cardImage.style.background = `linear-gradient(135deg, ${char.color}, #fff)`;

                // Change rarity badge style
                let badgeColor = 'linear-gradient(135deg, #CD7F32, #8B4513)'; // Default R
                if (char.rarity === 'SSR') badgeColor = 'linear-gradient(135deg, #FFD700, #FFA500)';
                if (char.rarity === 'SR') badgeColor = 'linear-gradient(135deg, #C0C0C0, #808080)';
                
                rarityBadge.textContent = char.rarity;
                rarityBadge.style.background = badgeColor;

                // 4. Confetti/Sparkles burst
                for (let i = 0; i < 30; i++) {
                    setTimeout(() => {
                        const rect = gachaCard.getBoundingClientRect();
                        const x = rect.left + rect.width / 2;
                        const y = rect.top + rect.height / 2;
                        createSparkle(x + (Math.random() * 200 - 100), y + (Math.random() * 200 - 100));
                    }, i * 20);
                }

                updateMascotText(`Wow! ${char.name} appeared! 🎉`, "summon");
                isSummoning = false;
                summonBtn.disabled = false;
                summonBtn.textContent = "✨ Summon Again ✨";
            }, 1000);
        });
    }

    // Add shake keyframes dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(-1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    // =========================================
    // 4. 3D TILT EFFECT FOR CARDS
    // =========================================
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // =========================================
    // 5. SCROLL REVEAL
    // =========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
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

    document.querySelectorAll('.manga-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});