/**
 * AniPulse - Kinetic Logic
 * Handles: Filtering, Progress Tracking, and Mascot AI
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        watchedEpisodes: 0,
        totalEpisodes: document.querySelectorAll('.btn-mark-watched').length,
        filters: {
            all: true,
            shonen: false,
            seinen: false,
            'slice-of-life': false
        }
    };

    // --- SELECTORS ---
    const animeCards = document.querySelectorAll('.anime-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mascot = document.getElementById('mascot');
    const mascotBubble = document.querySelector('.mascot-bubble');

    // --- MASCOT EMOTIONS ---
    const emotions = {
        neutral: {
            text: "Keep watching!",
            mouth: "M 40 60 Q 50 70 60 60", // Smile
            scale: 1
        },
        happy: {
            text: "Sugoii! You're on fire!",
            mouth: "M 35 65 Q 50 80 65 65", // Big Smile
            scale: 1.2
        },
        shocked: {
            text: "WHAT?! So many episodes?!",
            mouth: "M 45 65 A 5 5 0 1 0 55 65 A 5 5 0 1 0 45 65", // O-shape
            scale: 1.3
        },
        sleepy: {
            text: "Zzz... too much anime...",
            mouth: "M 40 62 L 60 62", // Flat line
            scale: 0.9
        }
    };

    // --- CORE FUNCTIONS ---

    // 1. Update Mascot Expression
    const updateMascot = () => {
        const ratio = state.watchedEpisodes / state.totalEpisodes;
        let currentEmotion;

        if (ratio === 0) currentEmotion = emotions.neutral;
        else if (ratio > 0 && ratio < 0.5) currentEmotion = emotions.happy;
        else if (ratio >= 0.5 && ratio < 0.8) currentEmotion = emotions.shocked;
        else currentEmotion = emotions.sleepy;

        // Update Text
        mascotBubble.textContent = currentEmotion.text;

        // Update SVG Mouth (Finding the path element in the mascot SVG)
        const mouthPath = mascot.querySelector('path[d*="M 40 60"]'); 
        // Note: In a real production, I'd give the path an ID. 
        // Here I target the specific mouth path.
        const allPaths = mascot.querySelectorAll('path');
        allPaths[0].setAttribute('d', currentEmotion.mouth);

        // Visual Juice
        mascot.style.transform = `scale(${currentEmotion.scale})`;
    };

    // 2. Handle Watch Progress
    const handleWatchClick = (btn, card) => {
        const progressBar = card.querySelector('.progress-fill');
        const currentWidth = parseInt(progressBar.style.width);
        
        if (currentWidth < 100) {
            const newWidth = Math.min(currentWidth + 10, 100);
            progressBar.style.width = `${newWidth}%`;
            
            if (newWidth === 100) {
                btn.style.backgroundColor = 'var(--accent-lime)';
                btn.style.color = 'var(--bg-deep)';
                state.watchedEpisodes++;
                updateMascot();
            }

            // Visual feedback: a little "pop" animation on the card
            card.style.transform = 'scale(0.95)';
            setTimeout(() => card.style.transform = '', 100);
        }
    };

    // 3. Filter Logic
    const applyFilter = (filter) => {
        animeCards.forEach(card => {
            const genre = card.getAttribute('data-genre');
            if (filter === 'all' || genre === filter) {
                card.style.display = 'block';
                // Trigger a small entrance animation
                card.style.animation = 'cardEntrance 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // --- EVENT LISTENERS ---

    // Filter Button Clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.getAttribute('data-filter'));
        });
    });

    // Mark Watched Clicks
    document.querySelectorAll('.btn-mark-watched').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click event
            handleWatchClick(btn, btn.closest('.anime-card'));
        });
    });

    // Card Hover Sound/Effect Simulation
    animeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // We could add a subtle "click" sound effect here
            console.log(`Focusing on: ${card.querySelector('.anime-title').textContent}`);
        });
    });

    // Initial Entry Animation for cards
    const staggerCards = () => {
        animeCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    };

    // Start the show
    staggerCards();
});

// Adding a dynamic CSS animation via JS for the card entrance
const style = document.createElement('style');
style.innerHTML = `
    @keyframes cardEntrance {
        from { opacity: 0; transform: scale(0.8) rotate(-2deg); }
        to { opacity: 1; transform: scale(1) rotate(0deg); }
    }
`;
document.head.appendChild(style);