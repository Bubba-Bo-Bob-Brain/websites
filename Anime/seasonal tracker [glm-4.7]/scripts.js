document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM ELEMENTS ---
    const gridContainer = document.querySelector('.anime-grid-container');
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const animeCards = document.querySelectorAll('.anime-card');
    const mascotText = document.getElementById('mascot-text');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');

    // --- MASCOT SYSTEM ---
    let mascotTimeout;
    
    function mascotSpeak(message) {
        mascotText.textContent = message;
        mascotText.parentElement.classList.add('visible');
        
        // Reset existing timeout
        if (mascotTimeout) clearTimeout(mascotTimeout);
        
        // Hide after 3 seconds
        mascotTimeout = setTimeout(() => {
            mascotText.parentElement.classList.remove('visible');
        }, 3000);
    }

    // Initial greeting
    setTimeout(() => {
        mascotSpeak("Ready to binge the new season?");
    }, 1000);

    // --- SEARCH FUNCTIONALITY ---
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        animeCards.forEach(card => {
            const title = card.querySelector('.anime-title').textContent.toLowerCase();
            const studio = card.querySelector('.studio-tag').textContent.toLowerCase();
            
            if (title.includes(term) || studio.includes(term)) {
                card.style.display = 'flex';
                // Add a tiny pop animation when revealing
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = 'popIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // --- FILTER FUNCTIONALITY ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            animeCards.forEach(card => {
                const genres = card.getAttribute('data-genre');
                
                if (filter === 'all' || genres.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Mascot reaction
            mascotSpeak(`Filtering for ${filter} anime!`);
        });
    });

    // --- WATCH STATUS TOGGLE ---
    window.toggleWatchStatus = function(btn) {
        const card = btn.closest('.anime-card');
        const title = card.querySelector('.anime-title').textContent;
        const iconSpan = btn.querySelector('.icon');

        if (btn.classList.contains('watched')) {
            // Unmark as watched
            btn.classList.remove('watched');
            btn.innerHTML = '<span class="icon">▶</span> Watch';
            mascotSpeak(`Rewatching ${title}? Nice!`);
        } else {
            // Mark as watched
            btn.classList.add('watched');
            btn.innerHTML = '<span class="icon">✓</span> Rewatch';
            
            // Confetti effect simulation (simple console log or visual cue)
            mascotSpeak(`Finished ${title}! Masterpiece.`);
        }
    };

    // --- FAVORITE/HEART TOGGLE ---
    document.querySelectorAll('.btn-rate').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const card = this.closest('.anime-card');
            const title = card.querySelector('.anime-title').textContent;

            if (this.classList.contains('active')) {
                mascotSpeak(`Added ${title} to favorites! ♥`);
            } else {
                mascotSpeak(`Unfavorited... sad.`);
            }
        });
    });

    // --- VIEW TOGGLE (GRID vs LIST) ---
    gridViewBtn.addEventListener('click', () => {
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        
        // Reset card specific styles for grid
        animeCards.forEach(card => {
            card.style.flexDirection = 'column';
            const imgWrapper = card.querySelector('.card-image-wrapper');
            imgWrapper.style.height = '350px';
            imgWrapper.style.width = '100%';
        });
    });

    listViewBtn.addEventListener('click', () => {
        gridContainer.style.gridTemplateColumns = '1fr';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');

        // Adjust card styles for list view
        animeCards.forEach(card => {
            card.style.flexDirection = 'row';
            card.style.height = '200px'; // Fixed height for list items
            card.style.alignItems = 'center';
            
            const imgWrapper = card.querySelector('.card-image-wrapper');
            imgWrapper.style.height = '100%';
            imgWrapper.style.width = '140px'; // Thumbnail width
            imgWrapper.style.flexShrink = '0';
            
            const content = card.querySelector('.card-content');
            content.style.padding = '15px 25px';
        });
    });

    // --- ANIMATIONS & POLISH ---
    
    // 1. Animate Sparklines on Load
    const sparklines = document.querySelectorAll('.sparkline-container polyline');
    sparklines.forEach((line, index) => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        
        // Staggered animation
        setTimeout(() => {
            line.style.transition = 'stroke-dashoffset 1.5s ease-out';
            line.style.strokeDashoffset = '0';
        }, 500 + (index * 200));
    });

    // 2. Randomize Countdown Rings slightly to simulate live data
    document.querySelectorAll('.ring-progress').forEach(ring => {
        // Random offset between 50 and 200 just for visual variety
        const randomOffset = Math.floor(Math.random() * 150) + 50;
        ring.style.strokeDashoffset = randomOffset;
        
        // Add slow rotation to the ring container for dynamic effect
        const svg = ring.closest('svg');
        let rotation = 0;
        setInterval(() => {
            rotation += 0.5;
            ring.style.transform = `rotate(${rotation}deg)`;
            // Keep text upright by counter-rotating or just letting it spin (anime style often spins everything)
            // For readability, let's just rotate the ring stroke dashoffset logic usually implies clockwise motion.
            // Actually, let's animate the dashoffset to simulate time ticking.
            let currentOffset = parseInt(ring.style.strokeDashoffset);
            if (currentOffset > 0) {
                ring.style.strokeDashoffset = currentOffset - 0.1;
            }
        }, 100);
    });

    // 3. Add "PopIn" keyframes dynamically if not present
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes popIn {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
        }
        .mascot-bubble.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
});