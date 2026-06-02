/**
 * THE CHRONICLES OF PERUN'S SHADOW
 * Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const bookCover = document.getElementById('book-cover');
    const tome = document.getElementById('tome');
    const openButton = document.getElementById('open-book');
    const bookmarks = document.querySelectorAll('.bookmark-item');
    const creatureCards = document.querySelectorAll('.creature-card');
    const candlelight = document.querySelector('.candlelight-glow');

    // --- Configuration & Mapping ---
    // Maps categories to the specific creature IDs found in the HTML
    const realmMapping = {
        'forest': ['leshy'],
        'waters': ['rusalka'],
        'sky': ['zmey'],
        'hearth': ['baba-yaga']
    };

    // --- 1. The Ritual: Opening the Tome ---
    const openTome = () => {
        // Add a subtle "shaking" effect to the cover before it opens
        bookCover.style.transform = 'scale(0.95) rotateX(5deg)';
        bookCover.style.opacity = '0';
        
        setTimeout(() => {
            bookCover.classList.add('hidden');
            tome.classList.remove('hidden');
            // Trigger a slight "bump" when the book opens
            tome.style.animation = 'tomeReveal 1.5s ease-out';
            
            // Allow body scrolling once the book is open
            document.body.style.overflowY = 'auto';
        }, 800);
    };

    openButton.addEventListener('click', openTome);

    // --- 2. The Living Light: Candlelight Parallax ---
    // We update CSS variables to move the radial gradient center
    document.addEventListener('mousemove', (e) => {
        if (tome.classList.contains('hidden')) return;

        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        // We use a custom property to move the light source smoothly
        // This is much more performant than updating style.background directly
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        
        // Update the candlelight glow position
        candlelight.style.background = `radial-gradient(circle at ${x}% ${y}%, transparent 10%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.8) 100%)`;
    });

    // --- 3. The Arcane Navigation: Filtering Creatures ---
    const filterCreatures = (category) => {
        // Update active bookmark UI
        bookmarks.forEach(bm => bm.classList.remove('active'));
        const activeBookmark = Array.from(bookmarks).find(bm => 
            bm.getAttribute('data-category') === category
        );
        if (activeBookmark) activeBookmark.classList.add('active');

        // Get the list of creature IDs allowed in this category
        const allowedCreatures = realmMapping[category] || [];

        creatureCards.forEach(card => {
            const creatureId = card.getAttribute('data-creature');
            
            // Reset animation for re-entry
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow

            if (allowedCreatures.includes(creatureId)) {
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.animation = 'fadeIn 0.8s ease forwards';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    };

    bookmarks.forEach(bookmark => {
        bookmark.addEventListener('click', () => {
            const category = bookmark.getAttribute('data-category');
            filterCreatures(category);
        });
    });

    // --- 4. The Shadow Reveal: Intersection Observer ---
    // Makes cards fade in beautifully as you scroll through the pages
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Initialize observer on all cards
    creatureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.8s ease-out';
        revealObserver.observe(card);
    });

    // --- Initialization ---
    // Pre-set the mouse position to center so the light doesn't jump
    document.documentElement.style.setProperty('--mouse-x', '50%');
    document.documentElement.style.setProperty('--mouse-y', '50%');
    
    console.log("The Chronicles of Perun's Shadow are ready. Open the tome to begin.");
});