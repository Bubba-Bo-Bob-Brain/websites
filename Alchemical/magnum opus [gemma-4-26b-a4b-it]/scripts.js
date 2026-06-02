/**
 * MAGNUM OPUS: THE ALCHEMICAL LABORATORY
 * The logic driving the Great Work.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Configuration & State ---
    
    const stages = [
        {
            name: "Nigredo",
            className: "stage-nigredo",
            description: `
                <p class="initial-cap">I</p>
                <p class="text-body">The descent into the darkness of the soul. <em>Solve et Coagula</em>. 
                The Prima Materia must be broken down, dissolved, and stripped of its former form. 
                In this blackness, all things return to chaos.</p>
            `,
            accent: "#3d1a3d",
            glow: "rgba(75, 0, 130, 0.6)",
            liquidHeight: "40%"
        },
        {
            name: "Albedo",
            className: "stage-albedo",
            description: `
                <p class="initial-cap">II</p>
                <p class="text-body">The purification. The silver light of the moon washes over the charred remains. 
                The impurities are stripped away, leaving a pristine, white essence. 
                The soul begins to reflect the divine light.</p>
            `,
            accent: "#ffffff",
            glow: "rgba(255, 255, 255, 0.8)",
            liquidHeight: "55%"
        },
        {
            name: "Citrinitas",
            className: "stage-citrinitas",
            description: `
                <p class="initial-cap">III</p>
                <p class="text-body">The solar awakening. The transmutation turns from silver to gold. 
                Wisdom dawns as the celestial sun touches the purified matter. 
                A golden dawn emerges from the lunar reflection.</p>
            `,
            accent: "#ffcc33",
            glow: "rgba(255, 204, 51, 0.6)",
            liquidHeight: "70%"
        },
        {
            name: "Rubedo",
            className: "stage-rubedo",
            description: `
                <p class="initial-cap">IV</p>
                <p class="text-body">The Reddening. The Great Work is fulfilled. 
                The union of opposites—Sun and Moon, King and Queen—results in the 
                eternal perfection of the Philosopher's Stone. The immortal essence is achieved.</p>
            `,
            accent: "#ff0000",
            glow: "rgba(255, 0, 0, 0.8)",
            liquidHeight: "85%"
        }
    ];

    let currentStageIndex = 0;
    let isTransmuting = false;

    // --- 2. DOM Elements ---
    
    const body = document.body;
    const stageNameEl = document.getElementById('stage-name');
    const stageDescEl = document.getElementById('stage-description');
    const transmuteBtn = document.getElementById('transmute-btn');
    const coreElement = document.getElementById('philosophers-stone-core');
    const crucibleLiquid = document.getElementById('crucible-liquid');
    const steamContainer = document.getElementById('steam-container');
    const circleEngine = document.getElementById('circle-engine');
    const constellationLayer = document.getElementById('constellations');
    const floatingElements = document.querySelectorAll('.element-item');

    // --- 3. Core Functions ---

    /**
     * Transitions the entire laboratory to a new alchemical stage.
     * @param {number} index - The index of the next stage.
     */
    const updateStage = (index) => {
        const stage = stages[index];

        // 1. Update Body Classes (Triggers CSS variable shifts)
        body.classList.remove(...stages.map(s => s.className));
        body.classList.add(stage.className);

        // 2. Update Textual Content (Codex)
        // We use a small fade out/in effect via opacity
        stageDescEl.style.opacity = 0;
        
        setTimeout(() => {
            stageDescEl.innerHTML = stage.description;
            stageNameEl.textContent = stage.name;
            stageDescEl.style.opacity = 1;
        }, 500);

        // 3. Update Visual Components
        coreElement.style.backgroundColor = stage.accent;
        coreElement.style.boxShadow = `0 0 50px ${stage.glow}`;
        
        crucibleLiquid.style.backgroundColor = stage.accent;
        crucibleLiquid.style.height = stage.liquidHeight;
    };

    /**
     * The Ritual: A choreographed sequence of visual changes.
     */
    const performTransmutation = async () => {
        if (isTransmuting) return;
        isTransmuting = true;
        transmuteBtn.disabled = true;
        transmuteBtn.querySelector('.btn-text').textContent = "The Work Unfolds...";

        // A. Accelerate the Rings (Visual Tension)
        circleEngine.style.transition = "transform 2s ease-in";
        circleEngine.style.transform = "scale(1.1) rotate(360deg)";

        // B. Create Bubbles/Particles in the Crucible
        const particleInterval = setInterval(() => {
            createParticle();
        }, 100);

        // C. Wait for the peak of the ritual
        await new Promise(resolve => setTimeout(resolve, 2500));

        // D. Cleanup and Stage Change
        clearInterval(particleInterval);
        circleEngine.style.transform = "scale(1) rotate(0deg)";
        
        // Advance the stage
        currentStageIndex = (currentStageIndex + 1) % stages.length;
        updateStage(currentStageIndex);

        // E. Reset Button
        transmuteBtn.disabled = false;
        transmuteBtn.querySelector('.btn-text').textContent = 
            currentStageIndex === stages.length - 1 ? "Rebirth the Cycle" : "Perform Transmutation";
        
        isTransmuting = false;
    };

    /**
     * Generates a particle/bubble in the crucible for visual feedback.
     */
    const createParticle = () => {
        const particle = document.createElement('div');
        const stage = stages[currentStageIndex];
        
        particle.className = 'particle';
        // Styling via JS for dynamic variety
        Object.assign(particle.style, {
            position: 'absolute',
            bottom: '0',
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`,
            backgroundColor: stage.accent,
            borderRadius: '50%',
            opacity: '0.6',
            pointerEvents: 'none',
            zIndex: '3'
        });

        // Add particle to steam container
        steamContainer.appendChild(particle);

        // Animate particle upwards
        const duration = Math.random() * 2 + 1;
        const animation = particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 0.6 },
            { transform: `translateY(-${Math.random() * 100 + 50}px) scale(0)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'ease-out'
        });

        animation.onfinish = () => particle.remove();
    };

    /**
     * Adds a subtle parallax effect to the background constellations.
     */
    const handleParallax = (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        constellationLayer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    // --- 4. Event Listeners ---

    transmuteBtn.addEventListener('click', performTransmutation);

    window.addEventListener('mousemove', handleParallax);

    // Interaction with ingredients
    floatingElements.forEach(el => {
        el.addEventListener('click', () => {
            // A small "reaction" when clicking ingredients
            const color = getComputedStyle(document.body).getPropertyValue('--accent-primary');
            coreElement.style.boxShadow = `0 0 80px ${color}`;
            
            // Visual feedback in the crucible
            for(let i=0; i<10; i++) {
                setTimeout(createParticle, i * 50);
            }

            setTimeout(() => {
                coreElement.style.boxShadow = `0 0 40px ${getComputedStyle(document.body).getPropertyValue('--glow-color')}`;
            }, 1000);
        });
    });

    // --- 5. Initialization ---
    
    // Set initial state
    updateStage(0);
    
    // Inject particle styles into document for cleanliness
    const style = document.createElement('style');
    style.innerHTML = `
        .particle {
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    console.log("%c MAGNUM OPUS INITIALIZED ", "background: #3d1a3d; color: #ffcc33; font-weight: bold; padding: 5px;");
});