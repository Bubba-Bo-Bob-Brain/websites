/**
 * High Noon Wanted Board - Interactive Logic
 * Handles navigation, transitions, and DOM manipulation for the Western theme.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const sections = ['dispatch', 'wanted', 'rewards', 'contact']; // Note: 'contact' is a placeholder for the 4th nav slot
    let currentSectionIndex = 0;
    const navCylinder = document.querySelector('.cylinder');
    const triggerBtn = document.getElementById('trigger-btn');
    const saloonDoors = document.getElementById('saloon-doors');
    
    // --- DOM Elements ---
    const dispatchSection = document.getElementById('dispatch');
    const wantedSection = document.getElementById('wanted');
    const rewardsSection = document.getElementById('rewards');
    const contactSection = document.getElementById('contact') || null; // Optional fallback

    // --- Initialization ---
    // Show the first section immediately
    showSection(sections[0], false); 
    
    // Add random rotation to posters on load for realism
    const posters = document.querySelectorAll('.wanted-poster');
    posters.forEach(poster => {
        const randomRot = (Math.random() * 4) - 2; // Between -2deg and 2deg
        poster.style.transform = `rotate(${randomRot}deg)`;
    });

    // --- Navigation Logic ---

    triggerBtn.addEventListener('click', () => {
        // 1. Play the "Click" animation
        triggerBtn.style.transform = 'translateX(-50%) rotate(25deg)';
        setTimeout(() => {
            triggerBtn.style.transform = 'translateX(-50%) rotate(0deg)';
        }, 150);

        // 2. Rotate the Cylinder
        // We rotate by 90 degrees per click. 
        // Note: We use a counter to keep rotating in one direction or reset.
        currentSectionIndex = (currentSectionIndex + 1) % sections.length;
        
        // Calculate rotation: 90deg * index. 
        // We add a full rotation (360) to make it spin visibly.
        const rotation = 360 + (currentSectionIndex * 90);
        navCylinder.style.transform = `rotate(${rotation}deg)`;

        // 3. Trigger Saloon Door Transition
        performTransition(sections[currentSectionIndex]);
    });

    // --- Transition Function ---
    function performTransition(targetId) {
        // 1. Open Doors
        saloonDoors.classList.add('open');

        // 2. Wait for doors to open (approx 400ms), then swap content
        setTimeout(() => {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(el => {
                el.classList.remove('visible');
                el.classList.add('hidden');
            });

            // Show target section
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.classList.remove('hidden');
                targetEl.classList.add('visible');
                
                // Scroll to top of board if needed
                document.getElementById('sheriffs-office').scrollIntoView({ behavior: 'smooth' });
            }

        }, 400);

        // 3. Close Doors (reveal new content)
        setTimeout(() => {
            saloonDoors.classList.remove('open');
        }, 900);
    }

    // --- Helper: Show Section (Initial Load) ---
    function showSection(id, animate) {
        document.querySelectorAll('.content-section').forEach(el => {
            el.classList.remove('visible');
            el.classList.add('hidden');
        });
        
        const target = document.getElementById(id);
        if(target) {
            target.classList.remove('hidden');
            target.classList.add('visible');
        }
    }

    // --- Sound Effects (Optional Simulation) ---
    // Since we can't load external audio files reliably without CORS/Hosting,
    // we simulate the "feel" via visual feedback (already done above).
    // If audio were allowed, we would play a 'click' and 'creak' here.

    // --- Interactive Tumbleweed Speed ---
    // Adjust tumbleweed speed based on mouse movement (parallax feel)
    let mouseX = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        // Slight speed variation based on mouse position
        const speed = 15 + (mouseX / window.innerWidth) * 10;
        const tumbleweed = document.querySelector('.tumbleweed');
        if(tumbleweed) {
            tumbleweed.style.animationDuration = `${speed}s`;
        }
    });

    console.log("Sheriff's Office: System Online. High Noon approaching.");
});