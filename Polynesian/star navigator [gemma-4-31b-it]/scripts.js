/**
 * CELESTIAL VOYAGER - INTERACTIVE ENGINE
 * Implements parallax celestial movement, dynamic wayfinding paths,
 * and the lore interaction system.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        currentPoint: null,
        isExploring: false,
        mouse: { x: 0, y: 0 },
        targetMouse: { x: 0, y: 0 }
    };

    // --- DOM Elements ---
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const starLayers = document.querySelectorAll('.star-layer');
    const navPoints = document.querySelectorAll('.nav-point');
    const voyagePath = document.getElementById('voyage-path');
    const infoPanel = document.getElementById('info-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelText = document.getElementById('panel-text');
    const hudButtons = document.querySelectorAll('.hud-btn');

    // --- Lore Database ---
    const lore = {
        'Hawaiki': 'The ancestral homeland. The spiritual point of origin from which the great voyagers set sail to colonize the Pacific.',
        'Aotearoa': 'The Land of the Long White Cloud. Found by following the migration of whales and the alignment of the stars.',
        'Tahiti': 'The heart of the Polynesian triangle, a hub of celestial knowledge and sophisticated navigational tradition.',
        'Hokule\'a': 'The Star of Gladness. A key guiding star used to determine latitude and steer the great double-hulled canoes.',
        'Southern Cross': 'The eternal guide of the Southern Hemisphere, used by navigators to find south with absolute precision.'
    };

    // --- Custom Cursor Logic ---
    window.addEventListener('mousemove', (e) => {
        state.targetMouse.x = e.clientX;
        state.targetMouse.y = e.clientY;
    });

    function updateCursor() {
        // Smooth interpolation for the cursor
        state.mouse.x += (state.targetMouse.x - state.mouse.x) * 0.15;
        state.mouse.y += (state.targetMouse.y - state.mouse.y) * 0.15;

        cursor.style.transform = `translate(${state.mouse.x}px, ${state.mouse.y}px)`;
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // --- Celestial Parallax Effect ---
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        starLayers.forEach((layer, index) => {
            const depth = (index + 1) * 20; // Different depth for each layer
            const moveX = x * depth;
            const moveY = y * depth;
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });

    // --- Wayfinding Path System ---
    function drawVoyagePath() {
        let pointsString = "";
        const points = Array.from(navPoints);
        
        // We only connect islands to create a sailing route
        const islands = points.filter(p => p.dataset.type === 'island');
        
        islands.forEach((island, index) => {
            const rect = island.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            pointsString += `${x},${y} `;
        });

        voyagePath.setAttribute('points', pointsString);
    }

    // Update paths on window resize
    window.addEventListener('resize', drawVoyagePath);
    setTimeout(drawVoyagePath, 100); // Initial draw after render

    // --- Interaction Engine ---
    navPoints.forEach(point => {
        point.addEventListener('mouseenter', () => {
            const name = point.dataset.name;
            state.currentPoint = name;
            
            // Cursor Feedback
            cursorRing.style.width = '60px';
            cursorRing.style.height = '60px';
            cursorRing.style.borderColor = 'var(--tapa-ochre)';
            
            // Update HUD
            panelTitle.innerText = name;
            panelText.innerText = lore[name] || 'A mysterious point in the great ocean...';
            
            // Visual highlight
            infoPanel.style.borderColor = 'var(--biolume-cyan)';
            infoPanel.style.boxShadow = '0 0 30px rgba(0, 242, 255, 0.2)';
        });

        point.addEventListener('mouseleave', () => {
            state.currentPoint = null;
            cursorRing.style.width = '30px';
            cursorRing.style.height = '30px';
            cursorRing.style.borderColor = 'var(--biolume-cyan)';
            infoPanel.style.borderColor = 'var(--tapa-ochre)';
            infoPanel.style.boxShadow = 'none';
        });
    });

    // --- HUD Control Logic ---
    hudButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            
            // Create a "pulse" effect on the map based on the action
            if (action === 'stars') {
                document.querySelectorAll('.star-glow').forEach(s => {
                    s.style.animation = 'none';
                    setTimeout(() => s.style.animation = 'pulseGlow 1s infinite alternate', 10);
                });
            } else if (action === 'currents') {
                document.querySelector('.ocean-swells').style.opacity = '0.6';
                setTimeout(() => {
                    document.querySelector('.ocean-swells').style.opacity = '0.2';
                }, 2000);
            } else if (action === 'islands') {
                document.querySelectorAll('.tiki-marker').forEach(m => {
                    m.style.backgroundColor = 'var(--biolume-cyan)';
                    setTimeout(() => m.style.backgroundColor = '', 1000);
                });
            }
        });
    });

    // --- Subtle Map Drift (Ocean Sway) ---
    function animateDrift() {
        const driftX = Math.sin(Date.now() * 0.001) * 5;
        const driftY = Math.cos(Date.now() * 0.001) * 5;
        
        document.querySelector('.map-elements').style.transform = 
            `translate(${driftX}px, ${driftY}px)`;
            
        requestAnimationFrame(animateDrift);
    }
    animateDrift();
});