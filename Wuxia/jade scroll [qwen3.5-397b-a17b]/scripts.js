document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOADER & INITIALIZATION ---
    const loader = document.getElementById('loader');
    const loadingText = document.querySelector('.loading-text');
    
    // Simulate "Awakening" process
    if (loadingText) {
        setTimeout(() => { loadingText.textContent = "Circulating Qi..."; }, 1000);
        setTimeout(() => { loadingText.textContent = "Opening Meridians..."; }, 2000);
    }

    setTimeout(() => {
        // Fade out loader
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
        // Trigger entrance animations after load
        initScrollAnimations();
        initSkillTree();
        initParallax();
    }, 3000);

    // --- 2. SCROLL ANIMATIONS (Intersection Observer) ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Specific logic for skill tree
                if (entry.target.id === 'meridians') {
                    activateSkillTree();
                }
            }
        });
    }, { threshold: 0.2, rootMargin: "0px" });

    function initScrollAnimations() {
        document.querySelectorAll('.panel').forEach(panel => {
            sectionObserver.observe(panel);
            panel.classList.add('loaded');
        });
    }

    // --- 3. SKILL TREE INTERACTIVITY ---
    const skillTreeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.5 });

    function initSkillTree() {
        const nodes = document.querySelectorAll('.node-group');
        const lines = document.querySelectorAll('.meridian-line');

        // Observe nodes
        nodes.forEach(node => {
            skillTreeObserver.observe(node);
            
            // Add hover effect for "Qi Flow"
            node.addEventListener('mouseenter', () => {
                node.classList.add('hovered');
                // Find connected lines and highlight them
                lines.forEach(line => {
                    // Simple check if line path contains node coordinates (approximate for demo)
                    if(line.getAttribute('d').includes(node.getAttribute('cx'))) {
                        line.style.stroke = 'var(--cinnabar)';
                        line.style.strokeWidth = '4';
                        line.style.filter = 'url(#glow)';
                    }
                });
            });

            node.addEventListener('mouseleave', () => {
                node.classList.remove('hovered');
                lines.forEach(line => {
                    if(line.getAttribute('d').includes(node.getAttribute('cx'))) {
                        line.style.stroke = '';
                        line.style.strokeWidth = '';
                        line.style.filter = '';
                    }
                });
            });
        });
    }

    function activateSkillTree() {
        const nodes = document.querySelectorAll('.node-group');
        const lines = document.querySelectorAll('.meridian-line');

        // Animate lines sequentially
        let delay = 0;
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('active');
            }, delay);
            delay += 300; // 300ms stagger
        });

        // Activate nodes with a longer delay
        setTimeout(() => {
            nodes.forEach((node, index) => {
                setTimeout(() => {
                    node.classList.add('active');
                }, index * 200);
            });
        }, delay);
    }

    // --- 4. PARALLAX EFFECTS ---
    function initParallax() {
        const clouds = document.getElementById('clouds-1');
        const titleChars = document.querySelectorAll('.char');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Move clouds slowly
            if (clouds) {
                clouds.style.transform = `translateY(${scrolled * 0.2}px)`;
            }

            // Subtle tilt on title chars
            titleChars.forEach((char, index) => {
                const speed = (index + 1) * 0.05;
                char.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
            });
        });
    }

    // --- 5. NAVIGATION ACTIVE STATE ---
    const navLinks = document.querySelectorAll('.nav-seal');
    const sections = document.querySelectorAll('.panel');
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // --- 6. INK DRIP EFFECT ON CLICK (Bonus Immersion) ---
    document.addEventListener('click', (e) => {
        // Create a small ink drop at click position
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.left = e.clientX + 'px';
        drop.style.top = e.clientY + 'px';
        drop.style.width = '10px';
        drop.style.height = '10px';
        drop.style.background = 'var(--ink-black)';
        drop.style.borderRadius = '50%';
        drop.style.pointerEvents = 'none';
        drop.style.zIndex = '9999';
        drop.style.transform = 'translate(-50%, -50%)';
        drop.style.transition = 'all 0.8s ease-out';
        
        document.body.appendChild(drop);

        // Animate
        requestAnimationFrame(() => {
            drop.style.transform = `translate(-50%, -50%) scale(3)`;
            drop.style.opacity = '0';
        });

        setTimeout(() => {
            drop.remove();
        }, 800);
    });
});