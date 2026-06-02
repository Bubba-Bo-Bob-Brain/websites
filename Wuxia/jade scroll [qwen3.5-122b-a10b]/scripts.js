// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Scroll Reveal Animation (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // If it's the skill tree section, trigger the drawing animation
                if (entry.target.id === 'skill-tree') {
                    animateMeridians();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });

    // --- 2. Skill Tree Animation (SVG Path Drawing) ---
    function animateMeridians() {
        const lines = document.querySelectorAll('.meridian-line');
        lines.forEach(line => {
            const length = line.getTotalLength();
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;
            
            // Trigger reflow
            line.getBoundingClientRect();
            
            // Animate
            line.style.transition = 'stroke-dashoffset 2s ease-in-out';
            line.style.strokeDashoffset = '0';
            
            // Add active class for color change
            setTimeout(() => {
                line.classList.add('active');
            }, 500);
        });
    }

    // --- 3. Skill Node Interaction & Modal Logic ---
    const nodes = document.querySelectorAll('.node');
    const modal = document.getElementById('skill-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalCost = document.getElementById('modal-cost');
    const modalRarity = document.getElementById('modal-rarity');
    const qiBar = document.querySelector('.qi-bar-fill');

    // Skill Data
    const skillData = {
        'Iron Skin': {
            desc: "Forges the body into unyielding steel. Reduces physical damage taken by 40% and grants immunity to blunt force trauma.",
            cost: 10,
            rarity: "Foundation"
        },
        'Wind Step': {
            desc: "Allows the practitioner to run on air for short bursts. Essential for vertical traversal and evading heavy strikes.",
            cost: 20,
            rarity: "Advanced"
        },
        'Inner Fire': {
            desc: "Ignites the dantian. Increases internal temperature to melt ice barriers and burns enemies on contact.",
            cost: 50,
            rarity: "Rare"
        },
        'Ghost Hand': {
            desc: "Moves faster than the eye can see. Allows for silent assassination and the ability to bypass external armor.",
            cost: 30,
            rarity: "Uncommon"
        },
        'Thunder Palm': {
            desc: "Channels lightning qi into the palm. Causes paralysis and internal organ damage upon impact.",
            cost: 40,
            rarity: "Legendary"
        }
    };

    nodes.forEach(node => {
        node.addEventListener('click', (e) => {
            // Prevent event bubbling if necessary
            e.stopPropagation();

            const skillName = node.getAttribute('data-skill');
            const data = skillData[skillName];

            if (data) {
                // Populate Modal
                modalTitle.textContent = skillName;
                modalDesc.textContent = data.desc;
                modalCost.textContent = data.cost;
                modalRarity.textContent = data.rarity;
                
                // Reset and animate Qi Bar
                qiBar.style.width = '0%';
                setTimeout(() => {
                    qiBar.style.width = `${Math.min(data.cost, 100)}%`;
                }, 100);

                // Show Modal
                modal.classList.add('active');
            }
        });
    });

    // Close Modal Logic
    function hideModal() {
        modal.classList.remove('active');
    }

    closeModal.addEventListener('click', hideModal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // --- 4. Parallax Effect for Background ---
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const clouds = document.querySelectorAll('.cloud');
        const bamboo = document.querySelectorAll('.bamboo');

        // Move clouds slowly
        clouds.forEach((cloud, index) => {
            const speed = 0.2 + (index * 0.1);
            cloud.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Move bamboo slightly
        bamboo.forEach((stalk, index) => {
            const speed = 0.1 + (index * 0.05);
            stalk.style.transform = `translateY(${scrolled * speed}px) rotate(${index % 2 === 0 ? '2deg' : '-2deg'})`;
        });
    });

    // --- 5. Interactive Ink Splatter on Click ---
    document.addEventListener('click', (e) => {
        // Only create splatter if clicking on the scroll, not the modal
        if (e.target.closest('.scroll-container') && !e.target.closest('.modal-overlay')) {
            const splatter = document.createElement('div');
            splatter.classList.add('ink-splatter');
            
            // Randomize size slightly
            const size = Math.random() * 50 + 50; // 50px to 100px
            splatter.style.width = `${size}px`;
            splatter.style.height = `${size}px`;
            
            // Position relative to click
            splatter.style.left = `${e.clientX}px`;
            splatter.style.top = `${e.clientY}px`;
            
            // Random rotation
            splatter.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Add to body but ensure it's behind content but above bg
            splatter.style.position = 'absolute';
            splatter.style.pointerEvents = 'none';
            splatter.style.zIndex = '10';
            splatter.style.transition = 'opacity 2s ease';
            
            document.body.appendChild(splatter);

            // Fade out and remove
            setTimeout(() => {
                splatter.style.opacity = '0';
                setTimeout(() => splatter.remove(), 2000);
            }, 1000);
        }
    });

    // --- 6. Dynamic Title Tilt (3D Effect) ---
    const titleFrame = document.querySelector('.title-frame');
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        
        if (titleFrame) {
            titleFrame.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        }
    });
});