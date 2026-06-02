/**
 * CASE FILE #402: THE MIDNIGHT SHADOW
 * Investigation Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- DATA & CONFIGURATION ---
    const caseData = {
        witnessStatement: `The rain was coming down in sheets, the kind of rain that washes the sins off the street but leaves the filth behind. I saw him near the pier. A tall shadow, wearing a trench coat that had seen better decades. He wasn't alone. There was a woman—red hair, eyes like cold flint. They exchanged a heavy-looking envelope near the warehouse door. I didn't stay to see the handoff. In this city, curiosity is a luxury most can't afford.`,
        connections: [
            { from: 'pin-1', to: 'pin-2' },
            { from: 'pin-2', to: 'pin-3' },
            { from: 'pin-3', to: 'pin-1' }
        ]
    };

    // --- DOM ELEMENTS ---
    const views = document.querySelectorAll('.view');
    const deskView = document.getElementById('desk-view');
    const fileView = document.getElementById('case-file-view');
    const corkboardView = document.getElementById('corkboard-view');
    
    const openFolderBtn = document.getElementById('open-folder-btn');
    const closeFileBtn = document.getElementById('close-file-btn');
    const switchToCorkboardBtn = document.getElementById('switch-to-corkboard');
    const backToDeskBtn = document.getElementById('back-to-desk-btn');
    
    const typewriterTarget = document.getElementById('typewriter-target');
    const connectionLayer = document.getElementById('connection-layer');

    // --- STATE MANAGEMENT ---
    let currentView = 'desk';

    // --- CORE FUNCTIONS ---

    /**
     * Switches between different views (scenes)
     * @param {string} viewId - The ID of the view to show
     */
    const switchView = (viewId) => {
        // Hide all views
        views.forEach(view => view.classList.remove('active'));
        
        // Show target view
        const target = document.getElementById(`${viewId}-view`);
        if (target) {
            target.classList.add('active');
            currentView = viewId;
            
            // Trigger specific view logic
            if (viewId === 'case-file') {
                startTypewriter();
            } else if (viewId === 'corkboard') {
                drawConspiracyThreads();
            }
        }
    };

    /**
     * Typewriter effect for witness statements
     */
    const startTypewriter = () => {
        typewriterTarget.textContent = ''; // Clear previous text
        let i = 0;
        const text = caseData.witnessStatement;

        const type = () => {
            if (i < text.length) {
                typewriterTarget.textContent += text.charAt(i);
                i++;
                // Randomized speed to simulate mechanical typewriter stutter
                const speed = Math.random() * (100 - 30) + 30;
                setTimeout(type, speed);
            }
        };
        type();
    };

    /**
     * Draws red threads between pinned elements on the corkboard
     */
    const drawConspiracyThreads = () => {
        // Clear existing lines
        connectionLayer.innerHTML = '';

        caseData.connections.forEach(conn => {
            const startEl = document.getElementById(conn.from);
            const endEl = document.getElementById(conn.to);

            if (startEl && endEl) {
                createThread(startEl, endEl);
            }
        });
    };

    /**
     * Creates an SVG path between two elements with a curved "string" look
     */
    const createThread = (el1, el2) => {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        // Calculate center points relative to the viewport
        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;

        // Create a quadratic Bezier curve for a natural "hanging" string look
        // We find a control point that is offset from the midpoint
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const controlX = midX + (Math.random() - 0.5) * 200; // Randomize sag
        const controlY = midY + (Math.random() - 0.5) * 200;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
        
        path.setAttribute("d", d);
        path.setAttribute("stroke", "var(--color-accent-red)");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        path.style.filter = "drop-shadow(0 2px 2px rgba(0,0,0,0.5))";
        
        // Animate the thread appearing
        path.style.strokeDasharray = path.getTotalLength();
        path.style.strokeDashoffset = path.getTotalLength();
        
        connectionLayer.appendChild(path);

        // Trigger animation frame
        requestAnimationFrame(() => {
            path.style.transition = "stroke-dashoffset 2s ease-in-out";
            path.style.strokeDashoffset = "0";
        });
    };

    // --- EVENT LISTENERS ---

    // Navigation
    openFolderBtn.addEventListener('click', () => switchView('case-file'));
    closeFileBtn.addEventListener('click', () => switchView('desk'));
    switchToCorkboardBtn.addEventListener('click', () => switchView('corkboard'));
    backToDeskBtn.addEventListener('click', () => switchView('desk'));

    // Subtle parallax/mouse movement for the desk items
    document.addEventListener('mousemove', (e) => {
        if (currentView === 'desk') {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            
            // Move the folder slightly for depth
            const folder = document.querySelector('.case-folder');
            folder.style.transform = `translate(calc(-50% + ${xAxis}px), calc(-50% + ${yAxis}px))`;
            
            // Move scattered evidence in opposite direction
            const evidence = document.querySelectorAll('.evidence-item');
            evidence.forEach((item, idx) => {
                const factor = (idx + 1) * 0.5;
                item.style.transform = `translate(${xAxis * factor}px, ${yAxis * factor}px) rotate(${idx % 2 === 0 ? 5 : -5}deg)`;
            });
        }
    });

    // Initialize
    console.log("Case File #402 Loaded. Investigation in progress...");
});