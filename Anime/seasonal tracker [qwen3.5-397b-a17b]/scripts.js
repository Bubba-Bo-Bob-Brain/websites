document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. MOCK DATA
    // =========================================
    const animeData = [
        { 
            id: 1, 
            title: "Cyber: Rebellion", 
            studio: "Trigger Map", 
            genre: "scifi", 
            tags: ["Action", "Sci-Fi"], 
            image: "https://images.unsplash.com/photo-1614726365723-49cfae9f0294?auto=format&fit=crop&w=600&q=80", 
            episodes: 12, 
            watched: 4, 
            rating: 9.2, 
            sparkline: "M10,25 Q30,28 50,15 T90,5" 
        },
        { 
            id: 2, 
            title: "School of Magic", 
            studio: "Kyoto Anim", 
            genre: "fantasy", 
            tags: ["Fantasy", "School"], 
            image: "https://images.unsplash.com/photo-1578632767115-35de0625c7b7?auto=format&fit=crop&w=600&q=80", 
            episodes: 24, 
            watched: 12, 
            rating: 8.7, 
            sparkline: "M10,15 Q30,10 50,20 T90,10" 
        },
        { 
            id: 3, 
            title: "Slice of Life Cafe", 
            studio: "Doga Kobo", 
            genre: "slice-of-life", 
            tags: ["Slice of Life"], 
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80", 
            episodes: 12, 
            watched: 12, 
            rating: 9.5, 
            sparkline: "M10,20 Q30,20 50,20 T90,20" 
        },
        { 
            id: 4, 
            title: "Mecha Horizon", 
            studio: "Sunrise", 
            genre: "scifi", 
            tags: ["Mecha", "Sci-Fi"], 
            image: "https://images.unsplash.com/photo-1626265774643-f19443d8c088?auto=format&fit=crop&w=600&q=80", 
            episodes: 50, 
            watched: 2, 
            rating: 7.8, 
            sparkline: "M10,25 Q30,25 50,25 T90,25" 
        },
        { 
            id: 5, 
            title: "Demon Slayer X", 
            studio: "Ufotable", 
            genre: "action", 
            tags: ["Action", "Demons"], 
            image: "https://images.unsplash.com/photo-1618336753974-aae8e0151354?auto=format&fit=crop&w=600&q=80", 
            episodes: 26, 
            watched: 20, 
            rating: 9.8, 
            sparkline: "M10,28 Q30,5 50,28 T90,2" 
        },
        { 
            id: 6, 
            title: "Love is War S4", 
            studio: "A-1", 
            genre: "slice-of-life", 
            tags: ["Romance", "Comedy"], 
            image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=600&q=80", 
            episodes: 12, 
            watched: 1, 
            rating: 9.0, 
            sparkline: "M10,10 Q30,25 50,10 T90,15" 
        }
    ];

    // =========================================
    // 2. DOM ELEMENTS
    // =========================================
    const grid = document.getElementById('anime-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mascotText = document.getElementById('mascot-text');
    const mascotBubble = document.querySelector('.mascot-bubble');
    const loader = document.getElementById('loader');

    // =========================================
    // 3. FUNCTIONS
    // =========================================

    // Render Cards
    const renderCards = (filter = 'all') => {
        grid.innerHTML = ''; // Clear current grid
        
        const filteredData = animeData.filter(anime => filter === 'all' || anime.genre === filter);

        if (filteredData.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No series found in this category.</div>';
            return;
        }

        filteredData.forEach((anime, index) => {
            const card = document.createElement('article');
            card.className = 'anime-card';
            // Staggered animation delay
            card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
            card.style.opacity = '0'; // Start hidden
            
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${anime.image}" alt="${anime.title}" class="card-img">
                    <div class="card-overlay"></div>
                    <div class="watched-ep-badge">Ep ${anime.watched} / ${anime.episodes}</div>
                </div>
                <div class="card-content">
                    <div class="card-tags">
                        ${anime.tags.map(tag => `<span class="tag tag-${anime.genre}">${tag}</span>`).join('')}
                    </div>
                    <h3 class="card-title">${anime.title}</h3>
                    <p class="card-studio">By ${anime.studio}</p>
                    <div class="card-stats">
                        <div class="sparkline-container">
                            <svg class="sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="${anime.sparkline}" stroke-dasharray="200" stroke-dashoffset="200" />
                            </svg>
                        </div>
                        <div class="rating-val">${anime.rating}</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn-watch">Watch Ep ${anime.watched + 1}</button>
                        <div class="progress-mini">
                            <div class="progress-bar" style="width: 0%" data-width="${(anime.watched / anime.episodes) * 100}%"></div>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Trigger progress bar animations after render
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 100);
    };

    // Mascot Logic
    const setMascotMessage = (msg) => {
        if (!mascotText || !mascotBubble) return;
        mascotText.textContent = msg;
        mascotBubble.classList.add('show');
        setTimeout(() => {
            mascotBubble.classList.remove('show');
        }, 3000);
    };

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Render
            renderCards(btn.dataset.filter);
            
            // Mascot Reaction
            if(btn.dataset.filter === 'all') {
                setMascotMessage("Showing everything!");
            } else {
                setMascotMessage(`Only ${btn.dataset.filter}!`);
            }
        });
    });

    // Mascot Hover Interactions (Parallax Effect)
    document.addEventListener('mousemove', (e) => {
        const mascot = document.querySelector('.mascot-img');
        if(mascot) {
            const x = (window.innerWidth / 2 - e.pageX) / 25;
            const y = (window.innerHeight / 2 - e.pageY) / 25;
            mascot.style.transform = `rotate(${x}deg) translateY(${y}px)`;
        }
    });

    // =========================================
    // 4. INITIALIZATION
    // =========================================
    
    // Simulate Loading
    setTimeout(() => {
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                renderCards();
                setMascotMessage("Welcome back, Senpai!");
            }, 500);
        }
    }, 2000);

    // Countdown Timer Logic
    const updateCountdown = () => {
        const now = new Date();
        const target = new Date();
        target.setHours(24, 0, 0, 0); // Midnight
        const diff = target - now;
        
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        const timeElement = document.querySelector('.time-left');
        if(timeElement) {
            timeElement.textContent = timeString;
        }
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();
});

// Add Keyframe for JS injection (Fallback if CSS fails to load animation)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);