/**
 * Opus Magnum - Interactive Alchemical Laboratory
 * Logic for the Great Work progression
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const stages = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
    let currentStageIndex = 0;
    let progress = 0;
    const maxProgress = 100;

    // --- DOM Elements ---
    const body = document.body;
    const stageIndicators = document.querySelectorAll('.stage');
    const liquid = document.querySelector('#liquid');
    const bubbles = document.querySelector('.bubbles');
    const vapor = document.querySelector('.vapor-cloud');
    const rotunda = document.querySelector('.rotunda');
    const outerRing = document.querySelector('.outer-ring');
    const middleRing = document.querySelector('.middle-ring');
    const innerRing = document.querySelector('.inner-ring');
    const stone = document.querySelector('#philosophers-stone');
    const progressBar = document.querySelector('#progress-fill');
    const manuscriptPages = document.querySelectorAll('.page');
    const marginalia = document.querySelectorAll('.marginalia');
    const grindModal = document.querySelector('#grind-modal');
    const mortarIcon = document.querySelector('.mortar-pestle-anim');
    const instructionText = document.querySelector('.instruction-text');

    // --- Initialization ---
    updateStageVisuals();

    // --- Event Listeners ---

    // 1. Rotunda Interaction (Click to Spin/Advance)
    rotunda.addEventListener('click', () => {
        // Trigger a rapid spin animation
        rotunda.style.transition = 'transform 0.5s ease';
        rotunda.style.transform = 'rotateX(60deg) rotate(720deg)';
        
        setTimeout(() => {
            rotunda.style.transition = 'transform 1s ease';
            rotunda.style.transform = 'rotateX(60deg) rotate(0deg)';
            advanceWork();
        }, 500);
    });

    // 2. Codex Interaction (Scroll to Reveal Marginalia)
    manuscriptPages.forEach(page => {
        page.addEventListener('scroll', () => {
            const scrollTop = page.scrollTop;
            const height = page.scrollHeight - page.clientHeight;
            
            // Simple reveal logic based on scroll position
            if (scrollTop > 50) {
                page.querySelectorAll('.marginalia').forEach(m => m.classList.add('visible'));
            } else {
                page.querySelectorAll('.marginalia').forEach(m => m.classList.remove('visible'));
            }
            
            // Add small progress for reading
            if (scrollTop > height * 0.5 && !page.dataset.read) {
                page.dataset.read = "true";
                addProgress(10);
            }
        });
    });

    // 3. Mortar & Pestle Interaction
    grindModal.addEventListener('click', () => {
        grindModal.classList.remove('active');
        grindModal.classList.add('hidden');
        addProgress(15);
        playGrindEffect();
    });

    // 4. Mortar Icon Animation
    mortarIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent modal close immediately
        mortarIcon.style.transform = 'scale(0.9) rotate(-15deg)';
        setTimeout(() => {
            mortarIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
    });

    // 5. Stage Indicators (Manual Override for Debugging/Exploration)
    stageIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentStageIndex = index;
            updateStageVisuals();
            addProgress(5); // Small reward for exploring
        });
    });

    // --- Core Logic Functions ---

    function advanceWork() {
        if (currentStageIndex < stages.length - 1) {
            currentStageIndex++;
            updateStageVisuals();
            addProgress(25); // Big jump for stage completion
            
            // Check for completion
            if (currentStageIndex === stages.length - 1) {
                instructionText.innerHTML = "<span style='color:var(--accent-gold); font-weight:bold;'>THE WORK IS COMPLETE. THE STONE IS READY.</span>";
            } else {
                instructionText.innerHTML = `The work advances to ${stages[currentStageIndex].toUpperCase()}. Continue the experiment.`;
            }
        } else {
            // Reset or Loop? Let's just give a "Perfect" message
            instructionText.innerHTML = "The cycle is perfect. The Stone shines eternal.";
        }
    }

    function updateStageVisuals() {
        const stageName = stages[currentStageIndex];

        // Update Body Class for CSS Variables
        body.className = `stage-${stageName}`;

        // Update Indicators
        stageIndicators.forEach((ind, idx) => {
            if (idx === currentStageIndex) ind.classList.add('active');
            else ind.classList.remove('active');
        });

        // Update Alembic (Crucible)
        // Height and Color logic based on stage
        let liquidHeight = '40%';
        let isBubbling = false;

        switch(stageName) {
            case 'nigredo':
                liquidHeight = '40%';
                isBubbling = false;
                break;
            case 'albedo':
                liquidHeight = '55%';
                isBubbling = true;
                break;
            case 'citrinitas':
                liquidHeight = '70%';
                isBubbling = true;
                break;
            case 'rubedo':
                liquidHeight = '85%';
                isBubbling = true;
                break;
        }

        liquid.style.height = liquidHeight;
        if (isBubbling) {
            liquid.classList.add('bubbling');
        } else {
            liquid.classList.remove('bubbling');
        }

        // Update Rotunda Speeds
        // Faster as we progress
        const speed = 60 - (currentStageIndex * 10);
        outerRing.style.animationDuration = `${speed}s`;
        middleRing.style.animationDuration = `${speed - 20}s`;
    }

    function addProgress(amount) {
        if (progress >= maxProgress) return;
        
        progress = Math.min(progress + amount, maxProgress);
        progressBar.style.width = `${progress}%`;

        // Check for Stone Materialization
        if (progress >= 100 && !stone.classList.contains('active')) {
            materializeStone();
        }
    }

    function materializeStone() {
        stone.classList.add('active');
        
        // Trigger a grand visual effect
        document.body.style.setProperty('--stage-glow', 'rgba(255, 68, 68, 0.8)');
        
        // Shake effect on the whole workbench
        const workbench = document.querySelector('.workbench');
        workbench.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        
        setTimeout(() => {
            workbench.style.animation = '';
            instructionText.innerHTML = "✨ THE PHILOSOPHER'S STONE HAS BEEN ACHIEVED ✨";
        }, 500);
    }

    function playGrindEffect() {
        // Visual feedback for grinding
        const noise = document.querySelector('#noise-overlay');
        noise.style.opacity = '0.8';
        setTimeout(() => {
            noise.style.opacity = '0.4';
        }, 100);
    }

    // Add Shake Animation dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `;
    document.head.appendChild(styleSheet);
});