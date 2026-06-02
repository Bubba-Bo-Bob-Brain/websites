/**
 * TE LAPA | JavaScript Engine
 * The Soul of the Wayfinder's Compass
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Data ---
    const STAR_COUNT = 180;
    const CONSTELLATIONS = [
        {
            id: 'makalii',
            name: 'Makaliʻi',
            description: 'The Pleiades. A vital cluster used by navigators to mark the beginning of the rising of Makaliʻi, signaling the change of seasons.',
            points: [{x: 20, y: 30}, {x: 25, y: 25}, {x: 35, y: 28}, {x: 32, y: 35}, {x: 22, y: 38}]
        },
        {
            id: 'hoku',
            name: 'Hōkūleʻa',
            description: 'The Star of Gladness (Arcturus). A bright guiding light that stays relatively fixed in the northern sky, assisting in latitude determination.',
            points: [{x: 60, y: 20}, {x: 65, y: 30}, {x: 75, y: 35}, {x: 70, y: 45}]
        },
        {
            id: 'nav-path',
            name: 'The Wayfinder\'s Path',
            description: 'A conceptual path through the star houses, representing the trajectory of a voyaging canoe across the celestial equator.',
            points: [{x: 10, y: 80}, {x: 30, y: 70}, {x: 50, y: 50}, {x: 70, y: 30}, {x: 90, y: 20}]
        }
    ];

    // --- DOM Elements ---
    const starDome = document.getElementById('star-dome');
    const starField = document.getElementById('star-field');
    const constellationContainer = document.getElementById('constellation-container');
    const journal = document.getElementById('navigator-journal');
    const journalTitle = document.getElementById('journal-title');
    const journalBody = document.getElementById('journal-body');
    const closeJournal = document.getElementById('close-journal');
    const pathItems = document.querySelectorAll('.path-list li');

    // --- State ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    // --- Initialization ---

    /**
     * Generates the star field with varying properties for depth
     */
    function initStars() {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random positioning (0-100%)
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Random visual properties
            const size = Math.random() * 2 + 1;
            const opacity = Math.random() * 0.7 + 0.3;
            const delay = Math.random() * 5;
            
            // Apply styles via JS for performance/initialization
            Object.assign(star.style, {
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: 'white',
                borderRadius: '50%',
                opacity: opacity,
                boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity})`,
                animation: `twinkle 3s ease-in-out infinite`,
                animationDelay: `${delay}s`
            });

            fragment.appendChild(star);
        }
        starField.appendChild(fragment);
    }

    /**
     * Generates SVG constellation lines and nodes
     */
    function initConstellations() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("style", "position:absolute; top:0; left:0; pointer-events:none; z-index:5;");
        
        constellationContainer.appendChild(svg);

        CONSTELLATIONS.forEach(constel => {
            // Create lines
            for (let i = 0; i < constel.points.length - 1; i++) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                const p1 = constel.points[i];
                const p2 = constel.points[i+1];
                
                line.setAttribute("x1", p1.x);
                line.setAttribute("y1", p1.y);
                line.setAttribute("x2", p2.x);
                line.setAttribute("y2", p2.y);
                line.setAttribute("stroke", "rgba(244, 228, 188, 0.3)");
                line.setAttribute("stroke-width", "0.2");
                line.setAttribute("stroke-dasharray", "1, 1");
                
                svg.appendChild(line);
            }

            // Create star nodes for constellation
            constel.points.forEach(p => {
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", p.x);
                circle.setAttribute("cy", p.y);
                circle.setAttribute("r", "0.5");
                circle.setAttribute("fill", "var(--color-star-gold)");
                circle.setAttribute("style", "filter: drop-shadow(0 0 1px var(--color-star-gold));");
                svg.appendChild(circle);
            });
        });
    }

    /**
     * Handles mouse movement for 3D rotation and parallax
     */
    function handleMouseMove(e) {
        // Normalize coordinates from -1 to 1
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;

        // Set target rotation (subtle)
        targetRotationY = mouseX * 15; // Rotate Y based on X movement
        targetRotationX = -mouseY * 15; // Rotate X based on Y movement
    }

    /**
     * The main animation loop
     */
    function animate() {
        // Smoothly interpolate rotation (Easing)
        currentRotationX += (targetRotationX - currentRotationX) * 0.05;
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;

        // Apply rotation to the dome
        starDome.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;

        // Subtle Parallax for ocean swells
        const swells = document.querySelectorAll('.swell-pattern');
        swells.forEach((swell, index) => {
            const speed = (index + 1) * 0.01;
            swell.style.transform = `translate(${mouseX * 20 * speed}px, ${mouseY * 20 * speed}px)`;
        });

        requestAnimationFrame(animate);
    }

    /**
     * Opens the journal with specific content
     */
    function openJournal(id) {
        const constel = CONSTELLATIONS.find(c => c.id === id);
        if (constel) {
            journalTitle.innerText = constel.name;
            journalBody.innerHTML = `<p>${constel.description}</p>`;
            journal.classList.add('active');
        }
    }

    // --- Event Listeners ---

    window.addEventListener('mousemove', handleMouseMove);

    closeJournal.addEventListener('click', () => {
        journal.classList.remove('active');
    });

    pathItems.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-star');
            openJournal(id);
        });
    });

    // --- Start the Experience ---
    initStars();
    initConstellations();
    animate();

    console.log("Te Lapa: The Wayfinder's Compass is active. The stars are aligned.");
});

/**
 * Note: To ensure the 'twinkle' animation works, 
 * ensure the CSS includes the @keyframes twinkle.
 * Since I am writing the JS file, I am assuming the CSS is already 
 * loaded with the necessary keyframes or I will rely on the CSS 
 * provided in step 2. 
 * 
 * Added a fallback for the twinkle animation in case it's missing.
 */
const style = document.createElement('style');
style.innerHTML = `
@keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
}
`;
document.head.appendChild(style);