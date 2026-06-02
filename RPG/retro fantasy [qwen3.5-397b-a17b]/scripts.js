document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CUSTOM CURSOR SYSTEM ---
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    const links = document.querySelectorAll('a, button, .inv-slot, .quest-notice');

    // Move cursor dot instantly, ring with delay
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        
        // Add a slight delay to the outer ring for fluid feel
        setTimeout(() => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }, 50);
    });

    // Hover effects for interactive elements
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.mixBlendMode = 'normal';
            cursor.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.mixBlendMode = 'difference';
            cursor.style.backgroundColor = 'transparent';
        });
    });

    // --- 2. SPELLBOOK PAGE TURNING LOGIC ---
    const spellbook = document.querySelector('.spellbook');
    const turnBtn = document.getElementById('turn-page-btn');
    let isPageTurned = false;

    turnBtn.addEventListener('click', () => {
        if (!isPageTurned) {
            // Turn to next page
            spellbook.classList.add('turning');
            turnBtn.textContent = "Previous Page";
            
            // Add sound effect placeholder (commented out for purity, but ready for implementation)
            // playSound('page_turn.mp3'); 
        } else {
            // Turn back
            spellbook.classList.remove('turning');
            turnBtn.textContent = "Next Page";
        }
        isPageTurned = !isPageTurned;
    });

    // --- 3. INVENTORY TOOLTIP FOLLOW (Optional Polish) ---
    // Makes tooltips follow the mouse slightly if the grid is scrolled, 
    // but for this grid layout, static absolute positioning on hover is cleaner.
    // Instead, let's add a random "glint" effect to items occasionally.
    
    const items = document.querySelectorAll('.inv-slot:not(.empty)');
    
    const addGlint = (item) => {
        const glint = document.createElement('div');
        glint.style.position = 'absolute';
        glint.style.width = '100%';
        glint.style.height = '100%';
        glint.style.background = 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)';
        glint.style.transform = 'translateX(-100%) rotate(45deg)';
        glint.style.transition = 'transform 0.5s ease-in-out';
        glint.style.pointerEvents = 'none';
        glint.style.zIndex = '5';
        
        item.appendChild(glint);
        
        setTimeout(() => {
            glint.style.transform = 'translateX(200%) rotate(45deg)';
        }, 50);

        setTimeout(() => {
            glint.remove();
        }, 600);
    };

    // Randomly glint items every few seconds
    setInterval(() => {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        if(randomItem && Math.random() > 0.7) {
            addGlint(randomItem);
        }
    }, 2000);

    // --- 4. IMMERSIVE STATS ANIMATION ---
    // Simulate "breathing" or minor stat fluctuations
    const hpBar = document.querySelector('.hp-bar-container .bar-fill');
    const mpBar = document.querySelector('.mp-bar-container .bar-fill');
    
    // Initial load animation
    window.addEventListener('load', () => {
        hpBar.style.width = '0%';
        mpBar.style.width = '0%';
        
        setTimeout(() => {
            hpBar.style.width = '85%';
            mpBar.style.width = '60%';
        }, 500);
    });

    // Random minor fluctuation to feel alive
    setInterval(() => {
        const currentHp = parseInt(hpBar.style.width);
        const fluctuation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newHp = Math.min(100, Math.max(0, currentHp + fluctuation));
        hpBar.style.width = `${newHp}%`;
    }, 5000);

    // --- 5. SCROLL REVEAL ---
    // Fade in sections as they enter viewport
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });
});