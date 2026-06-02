/**
 * THE ORDER OF THE GILDED ECLIPSE
 * Scripts for immersive occult interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const seal = document.getElementById('seal');
    const entryScreen = document.getElementById('entry-screen');
    const mainContent = document.getElementById('main-content');
    const gaslight = document.getElementById('gaslight');
    const circleLinks = document.querySelectorAll('.circle-link');
    const memberGroups = document.querySelectorAll('.member-group');

    // --- 1. The Ritual of Entry ---
    // Clicking the wax seal triggers the transition into the secret society
    seal.addEventListener('click', () => {
        // Break the seal
        seal.style.transform = 'scale(1.5)';
        seal.style.opacity = '0';
        seal.style.transition = 'all 0.5s ease-out';

        // Fade out the entry screen
        setTimeout(() => {
            entryScreen.style.opacity = '0';
            entryScreen.style.pointerEvents = 'none';
            
            // Reveal the Great Ledger
            mainContent.classList.remove('hidden');
            mainContent.style.display = 'block';
            
            // Trigger a subtle "gaslamp ignite" sound effect simulation
            igniteGaslight();
        }, 600);
    });

    // --- 2. The Gaslight Movement ---
    // Track mouse movement to update the radial gradient position
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        // Update CSS variables for the gaslight-glow element
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });

    // Simulate the flicker of a real gas lamp
    function igniteGaslight() {
        setInterval(() => {
            const flicker = Math.random() * 0.05;
            gaslight.style.opacity = 0.8 + flicker;
            
            // Occasionally a stronger flicker
            if (Math.random() > 0.95) {
                gaslight.style.opacity = 0.4;
                setTimeout(() => {
                    gaslight.style.opacity = 0.9;
                }, 50);
            }
        }, 100);
    }

    // --- 3. Labyrinthine Navigation ---
    // Switching between the secret circles of the society
    circleLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Update active state of links
            circleLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const target = link.getAttribute('data-target');

            // Transition member groups
            memberGroups.forEach(group => {
                group.classList.add('hidden');
                group.style.display = 'none';
                
                if (group.id === target) {
                    group.classList.remove('hidden');
                    group.style.display = 'block';
                    
                    // Staggered reveal animation for members within the group
                    const cards = group.querySelectorAll('.member-card');
                    cards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    });
                }
            });
        });
    });

    // --- 4. Decorative Touches ---
    // Add a "dust" effect occasionally appearing on the screen
    function createDust() {
        const dust = document.createElement('div');
        dust.style.position = 'fixed';
        dust.style.width = '2px';
        dust.style.height = '2px';
        dust.style.background = 'rgba(212, 175, 55, 0.3)';
        dust.style.left = Math.random() * 100 + 'vw';
        dust.style.top = Math.random() * 100 + 'vh';
        dust.style.pointerEvents = 'none';
        dust.style.zIndex = '1000';
        dust.style.borderRadius = '50%';
        
        document.body.appendChild(dust);
        
        // Animate dust floating
        const anim = dust.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { opacity: 0.5, offset: 0.5 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * -100}px)`, opacity: 0 }
        ], {
            duration: 5000 + Math.random() * 5000,
            easing: 'ease-out'
        });

        anim.onfinish = () => dust.remove();
    }

    // Generate dust particles every few seconds
    setInterval(createDust, 1000);
});