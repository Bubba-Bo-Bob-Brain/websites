/**
 * THE HEAVENLY PATH - JAVASCRIPT
 * Orchestrating the ink, the energy, and the scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Selectors ---
    const scrollSections = document.querySelectorAll('.scroll-section');
    const clouds = document.querySelector('.clouds');
    const bamboo = document.querySelector('.bamboo');
    const meridianContainer = document.querySelector('.meridian-container');
    const meridianPathsGroup = document.getElementById('meridian-paths');
    const skillNodes = document.querySelectorAll('.node');
    const tooltip = document.getElementById('node-tooltip');

    // --- 2. Scroll Reveal Logic ---
    // Uses IntersectionObserver to fade in sections as they scroll into view
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Special trigger: If the meridian section is visible, animate the Qi flow
                if (entry.target.id === 'meridians') {
                    animateMeridianPaths();
                }
            }
        });
    }, { threshold: 0.15 });

    scrollSections.forEach(section => revealObserver.observe(section));


    // --- 3. Parallax Atmosphere ---
    // Creates a sense of depth by moving background layers at different speeds
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Clouds move very slowly
        clouds.style.transform = `translateY(${scrolled * 0.15}px)`;
        
        // Bamboo moves slightly faster for depth
        bamboo.style.transform = `translateY(${scrolled * 0.25}px)`;
    });


    // --- 4. Meridian Map & Qi Flow Logic ---
    
    // Data defining the nodes and their organic connections
    const nodes = [
        { id: 0, x: 300, y: 100, name: "Core Qi (The Origin)" },
        { id: 1, x: 150, y: 300, name: "Lung Meridian (Breath of Life)" },
        { id: 2, x: 450, y: 300, name: "Heart Meridian (Spirit Fire)" },
        { id: 3, x: 300, y: 500, name: "Dantian Center (The Reservoir)" }
    ];

    // Connections: [Node A Index, Node B Index, Control Point 1, Control Point 2]
    // Control points create the "S" curves for the ink-wash look
    const connections = [
        [0, 1, 200, 150, 100, 250], // Path from Core to Lung
        [0, 2, 400, 150, 500, 250], // Path from Core to Heart
        [1, 3, 200, 400, 400, 400], // Path from Lung to Dantian
        [2, 3, 400, 400, 200, 400]  // Path from Heart to Dantian
    ];

    /**
     * Draws the organic ink paths using Bezier curves
     */
    function drawMeridianPaths() {
        connections.forEach(conn => {
            const [startIdx, endIdx, cp1x, cp1y, cp2x, cp2y] = conn;
            const startNode = nodes[startIdx];
            const endNode = nodes[endIdx];

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            // Creating the Bezier Curve "D" attribute
            const d = `M ${startNode.x} ${startNode.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endNode.x} ${endNode.y}`;
            
            path.setAttribute("d", d);
            path.setAttribute("class", "meridian-paths");
            
            // Set length for the dash-offset animation
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;

            meridianPathsGroup.appendChild(path);
        });
    }

    /**
     * Triggers the animation of the Qi flowing through the meridians
     */
    function animateMeridianPaths() {
        const paths = document.querySelectorAll('.meridian-paths');
        paths.forEach((path, index) => {
            // Staggered reveal of paths
            setTimeout(() => {
                const length = path.getTotalLength();
                path.style.transition = "stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 1)";
                path.style.strokeDashoffset = "0";
            }, index * 500);
        });
    }

    /**
     * Handles Tooltip interaction for the skill nodes
     */
    function initNodeInteractions() {
        skillNodes.forEach((node, index) => {
            const nodeData = nodes[index];

            node.addEventListener('mouseenter', (e) => {
                tooltip.style.opacity = '1';
                tooltip.textContent = nodeData.name;
                
                // Update node state
                node.classList.add('active');
            });

            node.addEventListener('mousemove', (e) => {
                // Position tooltip near the cursor
                tooltip.style.left = `${e.pageX - meridianContainer.offsetLeft + 20}px`;
                tooltip.style.top = `${e.pageY - meridianContainer.offsetTop - 40}px`;
            });

            node.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                // We keep the node "active" if it's a primary node, or remove it
                // For this demo, we'll keep it highlighted
            });
        });
    }

    // --- 5. Initialization ---

    // Start the Meridian Engine
    drawMeridianPaths();
    initNodeInteractions();

});