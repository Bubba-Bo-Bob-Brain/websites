/**
 * THE DESPERADO'S LEDGER - Core Engine
 * Handles: Dust particles, Revolver Navigation, and Bounty Modals.
 */

document.addEventListener('DOMContentLoaded', () => {
    initDustParticles();
    initRevolverNav();
    initBountyModals();
});

// --- 1. DUST PARTICLE SYSTEM ---
// Creates a cinematic, drifting dust overlay using HTML5 Canvas
function initDustParticles() {
    const canvas = document.getElementById('dustCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 120;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(210, 180, 140, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

// --- 2. REVOLVER NAVIGATION ---
// A custom-built rotary menu that "spins" like a revolver cylinder
function initRevolverNav() {
    const revolver = document.getElementById('revolver');
    const chambers = document.querySelectorAll('.chamber');
    let currentRotation = 0;

    // Data mapping for the rotation angles
    // Chamber 1 (0deg), Chamber 2 (90deg), Chamber 3 (180deg), Chamber 4 (270deg)
    // To "rotate" the cylinder to a specific chamber, we rotate the container
    
    chambers.forEach((chamber, index) => {
        chamber.addEventListener('click', () => {
            // Remove active class from all
            chambers.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked
            chamber.classList.add('active');

            // Calculate rotation:
            // If we click index 0, rotation should be 0
            // If we click index 1, rotation should be -90 (to bring it to top)
            // We use negative rotation to make the cylinder spin "forward"
            const targetRotation = index * -90;
            
            // Add a base rotation to keep it spinning forward instead of snapping back
            // We multiply by 360 to ensure it always spins in a consistent direction
            currentRotation += (targetRotation - (currentRotation % 360));
            
            // Correcting for the math to ensure smooth continuous spinning
            // This is a simplified version for the demo
            revolver.style.transform = `rotate(${targetRotation}deg)`;

            // Trigger section change logic
            const targetSection = chamber.getAttribute('data-target');
            console.log(`Navigating to: ${targetSection}`);
            // In a full app, this would trigger scrollTo or section visibility
        });
    });
}

// --- 3. BOUNTY MODAL SYSTEM ---
// Handles the "deep dive" into outlaw profiles
function initBountyModals() {
    const modal = document.getElementById('outlawModal');
    const closeBtn = document.querySelector('.close-modal');
    const posters = document.querySelectorAll('.wanted-poster');

    // Mock database of outlaw details
    const outlawData = {
        'silas-vane': {
            name: "Silas 'The Snake' Vane",
            crime: "Grand Theft & Arson",
            desc: "Known for his cold eyes and even colder heart. Vane is suspected of burning down the Blackwater livery stable. He travels with a pet rattlesnake and carries a custom silver-plated revolver.",
            reward: "$500",
            img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
        },
        'clara-bell': {
            name: "Clara 'Red' Bell",
            crime: "Stagecoach Robbery",
            desc: "A master of disguise and quick-draw. Bell has led authorities on chases across three states. She is highly dangerous and likely traveling with a small gang of outlaws.",
            reward: "$1,200",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
        },
        'the-twin-wolves': {
            name: "The Twin Wolves",
            crime: "Banditry & Murder",
            desc: "Identical brothers with a penchant for chaos. They strike without warning and vanish into the desert heat. They are considered extremely high-risk.",
            reward: "$2,500",
            img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
        }
    };

    posters.forEach(poster => {
        poster.addEventListener('click', () => {
            const id = poster.getAttribute('data-outlaw');
            const data = outlawData[id];

            if (data) {
                document.getElementById('modalName').innerText = data.name;
                document.getElementById('modalCrime').innerText = data.crime;
                document.getElementById('modalDescription').innerText = data.desc;
                document.getElementById('modalReward').innerText = `Reward: ${data.reward}`;
                document.getElementById('modalPortrait').style.backgroundImage = `url('${data.img}')`;
                
                modal.style.display = 'flex';
                // Add a small entrance animation via JS
                modal.animate([
                    { opacity: 0, transform: 'scale(0.9)' },
                    { opacity: 1, transform: 'scale(1)' }
                ], { duration: 300, easing: 'ease-out' });
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close on clicking outside the content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}