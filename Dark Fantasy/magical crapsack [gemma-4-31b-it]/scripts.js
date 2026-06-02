/* THE OSSUARY OF ETERNAL LAMENT - Behavioral Scripts */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        sufferingIndex: 98.4,
        activeCurses: [],
        isCorrupted: false
    };

    // --- DOM Elements ---
    const sufferingMeter = document.getElementById('suffering-meter');
    const sufferingValue = document.getElementById('suffering-value');
    const curseButtons = document.querySelectorAll('.claim-curse');
    const artifacts = document.querySelectorAll('.artifact-visual');
    const folios = document.querySelectorAll('.folio');

    // --- 1. The Living Misery Meter ---
    // Simulates a world that is constantly decaying and reacting
    const updateSuffering = () => {
        // Randomly fluctuate between -0.1 and +0.2 to ensure a general trend of increasing misery
        const drift = (Math.random() * 0.3) - 0.1;
        state.sufferingIndex = Math.min(100, Math.max(0, state.sufferingIndex + drift));
        
        sufferingValue.innerText = `${state.sufferingIndex.toFixed(1)}%`;
        sufferingMeter.style.width = `${state.sufferingIndex}%`;

        // Occasional "Spike" of agony
        if (Math.random() > 0.98) {
            triggerAgonySpike();
        }
    };

    const triggerAgonySpike = () => {
        sufferingValue.style.color = '#ff0000';
        sufferingValue.style.textShadow = '0 0 20px #ff0000';
        setTimeout(() => {
            sufferingValue.style.color = '#fff';
            sufferingValue.style.textShadow = '0 0 10px var(--color-blood)';
        }, 500);
    };

    setInterval(updateSuffering, 3000);

    // --- 2. The Affliction System ---
    // These functions physically mutate the website's CSS based on chosen curses
    const applyCurseEffects = (curse) => {
        const body = document.body;

        switch(curse) {
            case 'blindness':
                body.style.filter = 'blur(2px) grayscale(0.5) contrast(1.2)';
                body.style.transition = 'filter 3s ease-in-out';
                break;
            case 'tremor':
                body.classList.add('shaking-world');
                // Inject keyframe for shaking since it's dynamic
                const style = document.createElement('style');
                style.innerHTML = `
                    @keyframes world-shake {
                        0% { transform: translate(0,0); }
                        25% { transform: translate(1px, -1px); }
                        50% { transform: translate(-1px, 1px); }
                        75% { transform: translate(1px, 1px); }
                        100% { transform: translate(0,0); }
                    }
                    .shaking-world { animation: world-shake 0.1s infinite; }
                `;
                document.head.appendChild(style);
                break;
            case 'silence':
                body.style.opacity = '0.7';
                body.style.filter = 'sepia(0.4) brightness(0.8)';
                break;
        }
    };

    curseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.curse-card');
            const curseType = card.getAttribute('data-curse');
            
            if (!state.activeCurses.includes(curseType)) {
                state.activeCurses.push(curseType);
                applyCurseEffects(curseType);
                
                // Visual feedback for the button
                btn.innerText = "Burden Accepted";
                btn.style.borderColor = "#fff";
                btn.style.color = "#fff";
                btn.disabled = true;

                // Increase suffering instantly upon taking a curse
                state.sufferingIndex += 0.5;
                updateSuffering();
            }
        });
    });

    // --- 3. The Whispering Relics ---
    // Adds erratic, glitchy behavior to artifacts on hover
    artifacts.forEach(art => {
        art.addEventListener('mouseenter', () => {
            const glitchInterval = setInterval(() => {
                if (!art.matches(':hover')) {
                    clearInterval(glitchInterval);
                    return;
                }
                const x = (Math.random() * 4) - 2;
                const y = (Math.random() * 4) - 2;
                art.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.random() * 0.1})`;
            }, 50);
        });

        art.addEventListener('mouseleave', () => {
            art.style.transform = 'scale(1)';
        });
    });

    // --- 4. Ghostly Reveal (Scroll Animations) ---
    const revealOnScroll = () => {
        folios.forEach(folio => {
            const rect = folio.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                folio.style.opacity = '1';
                folio.style.transform = 'translateY(0)';
                folio.style.filter = 'blur(0)';
            }
        });
    };

    // Set initial state for folios to allow for reveal
    folios.forEach(f => {
        f.style.opacity = '0';
        f.style.transform = 'translateY(50px)';
        f.style.filter = 'blur(10px)';
        f.style.transition = 'all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // --- 5. Final Touch: Random "Whispers" in the Console ---
    const whispers = [
        "They are watching you scroll...",
        "The ink is made of tears.",
        "There is no exit from the Ossuary.",
        "Your cursor is a scar on this page.",
        "The silence is getting louder."
    ];

    setInterval(() => {
        if (Math.random() > 0.8) {
            console.log(`%c${whispers[Math.floor(Math.random() * whispers.length)]}`, "color: #4a0000; font-style: italic; font-weight: bold;");
        }
    }, 10000);
});