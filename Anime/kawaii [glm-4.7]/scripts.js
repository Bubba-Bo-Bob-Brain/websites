/**
 * Kawaii Anime World - JavaScript
 * Handles interactivity, animations, gacha logic, and cute effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor & Sparkle Trail ---
    const cursor = document.getElementById('custom-cursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create sparkles occasionally while moving
        if (Math.random() > 0.85) {
            createSparkle(mouseX, mouseY);
        }
    });

    // Smooth cursor follow loop
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Randomize sparkle appearance
        const size = Math.random() * 10 + 5 + 'px';
        const colors = ['#FF9A9E', '#FAD0C4', '#A18CD1', '#FFD700'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        sparkle.style.width = size;
        sparkle.style.height = size;
        sparkle.style.background = color;
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.position = 'fixed';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.borderRadius = '50%';
        sparkle.style.zIndex = '9998';
        
        // Set custom properties for the animation direction
        const tx = (Math.random() - 0.5) * 100 + 'px';
        const ty = (Math.random() - 0.5) * 100 + 'px';
        sparkle.style.setProperty('--tx', tx);
        sparkle.style.setProperty('--ty', ty);
        sparkle.style.animation = 'sparkle-fade 1s ease-out forwards';

        document.body.appendChild(sparkle);

        // Cleanup
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }

    // --- 2. Background Ambient Effects ---
    const bgContainer = document.getElementById('bg-effects-container');
    
    function createFloatingStar() {
        const star = document.createElement('div');
        star.textContent = Math.random() > 0.5 ? '✦' : '✨';
        star.style.position = 'absolute';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = '100vh';
        star.style.fontSize = Math.random() * 20 + 10 + 'px';
        star.style.color = 'rgba(255, 255, 255, 0.6)';
        star.style.transition = `top ${Math.random() * 5 + 5}s linear, opacity 1s`;
        star.style.opacity = '0';
        
        bgContainer.appendChild(star);

        // Animate
        setTimeout(() => { star.style.opacity = '1'; }, 100);
        setTimeout(() => { 
            star.style.top = '-10vh'; 
            star.style.opacity = '0';
        }, 100);

        setTimeout(() => {
            star.remove();
        }, 7000); // Match transition duration
    }

    // Spawn stars periodically
    setInterval(createFloatingStar, 800);


    // --- 3. Gacha System Logic ---
    const gachaBtn = document.getElementById('gacha-btn');
    const gachaStage = document.getElementById('gacha-stage');
    const inventorySlots = document.querySelectorAll('.inventory-slots .slot');
    
    // Mock Data for Characters
    const characters = [
        { id: 1, name: "Sakura-chan", rarity: "SSR", img: "https://picsum.photos/seed/anime_girl_1/200/300" },
        { id: 2, name: "Mochi Cat", rarity: "SR", img: "https://picsum.photos/seed/cat_neko/200/300" },
        { id: 3, name: "Star Guardian", rarity: "R", img: "https://picsum.photos/seed/magic_star/200/300" },
        { id: 4, name: "Bunny Usagi", rarity: "SSR", img: "https://picsum.photos/seed/bunny_kawaii/200/300" },
        { id: 5, name: "Pudding Pop", rarity: "N", img: "https://picsum.photos/seed/sweet_dessert/200/300" },
    ];

    // Handle Hero Button Click (Scrolls to Gacha)
    gachaBtn.addEventListener('click', () => {
        document.getElementById('gacha').scrollIntoView({ behavior: 'smooth' });
        // Trigger Gacha automatically after scroll
        setTimeout(performGacha, 800);
    });

    function performGacha() {
        // 1. Loading Animation
        gachaStage.innerHTML = '<div class="gacha-placeholder"><span class="pulse-text">Summoning... ✨</span></div>';
        
        // 2. Simulate Network Delay
        setTimeout(() => {
            const result = characters[Math.floor(Math.random() * characters.length)];
            renderGachaResult(result);
            addToInventory(result);
        }, 1500);
    }

    function renderGachaResult(character) {
        let stars = '';
        if(character.rarity === 'SSR') stars = '★★★★★';
        else if(character.rarity === 'SR') stars = '★★★★';
        else if(character.rarity === 'R') stars = '★★★';
        else stars = '★★';

        const rarityColor = character.rarity === 'SSR' ? '#FFD700' : (character.rarity === 'SR' ? '#C0C0C0' : '#CD7F32');

        const cardHTML = `
            <div class="gacha-card" style="border-color: ${rarityColor}">
                <div style="position:absolute; top:10px; right:10px; background:${rarityColor}; color:white; padding:2px 8px; border-radius:10px; font-weight:bold; font-size:0.8rem;">${character.rarity}</div>
                <img src="${character.img}" alt="${character.name}">
                <h4>${character.name}</h4>
                <div class="star-rating">${stars}</div>
            </div>
        `;
        
        gachaStage.innerHTML = cardHTML;
    }

    function addToInventory(character) {
        // Find first empty slot
        for (let slot of inventorySlots) {
            if (!slot.classList.contains('filled')) {
                slot.classList.add('filled');
                const img = document.createElement('img');
                img.src = character.img;
                slot.appendChild(img);
                break;
            }
        }
    }


    // --- 4. Bubble Playground ---
    const bubbleBtn = document.getElementById('bubble-btn');
    const bubbleZone = document.getElementById('bubble-zone');

    bubbleBtn.addEventListener('click', (e) => {
        // Create a burst of bubbles
        for(let i=0; i<15; i++) {
            setTimeout(createBubble, i * 100);
        }
    });

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 40 + 20; // 20px to 60px
        const startLeft = Math.random() * 90 + 5; // 5% to 95% width
        
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = startLeft + '%';
        
        // CSS Transition for movement
        const duration = Math.random() * 3 + 3; // 3s to 6s
        bubble.style.transition = `bottom ${duration}s linear, transform 0.2s`;
        
        bubbleZone.appendChild(bubble);

        // Start animation
        setTimeout(() => {
            bubble.style.bottom = '350px'; // Move up
        }, 50);

        // Click to pop
        bubble.addEventListener('click', function() {
            popBubble(this);
        });

        // Cleanup
        setTimeout(() => {
            if(bubble.parentNode) bubble.remove();
        }, duration * 1000);
    }

    function popBubble(bubble) {
        // Visual pop effect
        bubble.style.transform = 'scale(1.5)';
        bubble.style.opacity = '0';
        createSparkle(parseInt(bubble.style.left), parseInt(bubble.style.bottom)); // Add sparkle where popped
        setTimeout(() => bubble.remove(), 200);
    }


    // --- 5. 3D Card Tilt Effect ---
    const cards = document.querySelectorAll('.card-tilt');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });


    // --- 6. Mascot Interaction ---
    const mascot = document.querySelector('.mascot-svg');
    const speechBubble = document.querySelector('.speech-bubble');
    const messages = [
        "Moe Moe Kyun! 💖",
        "Welcome home! 🏠",
        "Do you like my bow? 🎀",
        "Read some manga? 📚",
        "So kawaii! ✨",
        "Give me a headpat! 👋"
    ];

    mascot.addEventListener('click', () => {
        // Jump animation reset
        mascot.parentElement.classList.remove('bounce-anim');
        void mascot.parentElement.offsetWidth; // Trigger reflow
        mascot.parentElement.classList.add('bounce-anim');

        // Change message
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        speechBubble.innerHTML = randomMsg;
        
        // Spawn hearts
        for(let i=0; i<5; i++) {
            setTimeout(() => {
                createSparkle(mouseX, mouseY);
            }, i * 100);
        }
    });

});