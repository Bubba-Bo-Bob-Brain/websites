document.addEventListener('DOMContentLoaded', () => {
    // State management for the Alchemical Stages
    const stages = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
    let currentStageIndex = 0;

    // DOM Elements
    const body = document.body;
    const transmuteBtn = document.getElementById('transmute-btn');
    const stone = document.getElementById('philosophers-stone');
    const indicators = document.querySelectorAll('.stage-indicator');
    const notes = document.querySelectorAll('.note');
    const circle = document.querySelector('.transmutation-circle');
    const constellations = document.querySelectorAll('.constellation');

    // Initialize Celestial Sphere (Random stars)
    const initCelestialSphere = () => {
        const sphere = document.querySelector('.celestial-sphere');
        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'constellation';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 5 + 's';
            star.style.opacity = Math.random();
            sphere.appendChild(star);
        }
    };

    // Handle Stage Transition
    const performTransmutation = () => {
        // Increment stage
        currentStageIndex = (currentStageIndex + 1) % stages.length;
        const stage = stages[currentStageIndex];

        // 1. Update Body Class for CSS Variables
        body.className = `stage-${stage}`;

        // 2. Update Indicators
        indicators.forEach(ind => {
            ind.classList.remove('active');
            if (ind.id === `ind-${stage}`) {
                ind.classList.add('active');
            }
        });

        // 3. Evolve the Philosopher's Stone
        stone.className = `stone ${stage}`;

        // 4. Reveal Marginalia
        notes.forEach(note => {
            if (note.dataset.stage === stage) {
                note.classList.add('visible');
            } else {
                note.classList.remove('visible');
            }
        });

        // 5. Increase Circle Intensity
        const rotationSpeed = 60 - (currentStageIndex * 15); // Gets faster
        circle.style.animationDuration = `${rotationSpeed}s`;
        
        // Visual feedback on button
        transmuteBtn.innerText = currentStageIndex === 3 ? "Complete the Great Work" : "Invoke Transmutation";
        
        // Trigger a "flash" effect
        triggerFlash();
    };

    const triggerFlash = () => {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.zIndex = '2000';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 0.8s ease-out';
        
        body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 800);
        }, 10);
    };

    // Interactive Tool Effects
    const setupTools = () => {
        const tools = document.querySelectorAll('.tool');
        
        tools.forEach(tool => {
            tool.addEventListener('click', () => {
                const label = tool.querySelector('.tool-label').innerText;
                
                // Create a small floating text effect
                const effect = document.createElement('div');
                effect.innerText = label === 'Mortarium' ? '🜔 Grinding...' : 
                                  label === 'Speculum' ? '👁️ Observing...' : '⚖️ Balancing...';
                effect.style.position = 'absolute';
                effect.style.left = tool.offsetLeft + 'px';
                effect.style.top = tool.offsetTop + 'px';
                effect.style.color = 'var(--stage-color)';
                effect.style.fontFamily = 'Cinzel Decorative';
                effect.style.pointerEvents = 'none';
                effect.style.transition = 'all 1s ease-out';
                effect.style.zIndex = '100';
                
                document.body.appendChild(effect);
                
                setTimeout(() => {
                    effect.style.transform = 'translateY(-50px)';
                    effect.style.opacity = '0';
                    setTimeout(() => effect.remove(), 1000);
                }, 10);
            });
        });
    };

    // Parallax effect for the celestial sphere
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        const sphere = document.querySelector('.celestial-sphere');
        sphere.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    });

    // Event Listeners
    transmuteBtn.addEventListener('click', performTransmutation);

    // Initialization
    initCelestialSphere();
    setupTools();
});