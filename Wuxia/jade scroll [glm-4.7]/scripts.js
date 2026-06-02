document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration ---
    const config = {
        parallaxSpeed: {
            mountainsFar: 0.2,
            mountainsNear: 0.5,
            mist: 0.1,
            bamboo: 0.05
        },
        scrollRevealThreshold: 0.15,
        cultivationTime: 2000 // ms
    };

    // --- Elements ---
    const loadingScreen = document.getElementById('loading-screen');
    const scrollPaper = document.querySelector('.scroll-paper');
    const soundToggle = document.getElementById('sound-toggle');
    const qiParticle = document.getElementById('qi-particle');
    const meridianPaths = [
        document.getElementById('path-1'),
        document.getElementById('path-2'),
        document.getElementById('path-3')
    ];
    const dantians = document.querySelectorAll('.dantian');
    const infoBox = document.getElementById('meridian-info');
    const trainButtons = document.querySelectorAll('.train-btn');

    // --- 1. Initialization & Loading Sequence ---
    window.addEventListener('load', () => {
        // Allow the CSS animation of the ink to play out
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            
            // Trigger entrance animation for the scroll paper
            initScrollReveal();
            
            // Start the Qi flow animation
            animateQiFlow();
        }, 2500);
    });

    // --- 2. Parallax Effect ---
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                
                // Move background layers
                document.getElementById('bg-mountains-far').style.transform = `translateY(${scrolled * config.parallaxSpeed.mountainsFar}px)`;
                document.getElementById('bg-mountains-near').style.transform = `translateY(${scrolled * config.parallaxSpeed.mountainsNear}px)`;
                document.getElementById('bg-mist').style.transform = `translateY(${scrolled * config.parallaxSpeed.mist}px)`;
                document.getElementById('bg-bamboo').style.transform = `translateY(${scrolled * config.parallaxSpeed.bamboo}px)`;

                ticking = false;
            });
            ticking = true;
        }
    });

    // --- 3. Scroll Reveal Observer ---
    function initScrollReveal() {
        const observerOptions = {
            threshold: config.scrollRevealThreshold,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Select elements to animate
        const elementsToReveal = document.querySelectorAll('.skill-node, .realm-stage, .artifact-card, .section-title');
        
        elementsToReveal.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(el);
        });
    }

    // --- 4. Qi Flow Animation (SVG) ---
    async function animateQiFlow() {
        if (!qiParticle) return;

        // Make particle visible
        qiParticle.style.opacity = '0.8';

        // Cycle through paths indefinitely
        let pathIndex = 0;

        function loopPath() {
            const currentPath = meridianPaths[pathIndex];
            const length = currentPath.getTotalLength();

            // Animate along the path
            const animation = qiParticle.animate([
                { offsetDistance: '0%' },
                { offsetDistance: '100%' }
            ], {
                duration: 4000,
                easing: 'ease-in-out',
                offsetPath: `path('${currentPath.getAttribute('d')}')`
            });

            animation.onfinish = () => {
                // Fade out briefly at the end of a path
                qiParticle.style.opacity = '0';
                setTimeout(() => {
                    pathIndex = (pathIndex + 1) % meridianPaths.length;
                    qiParticle.style.offsetPath = `path('${meridianPaths[pathIndex].getAttribute('d')}')`;
                    qiParticle.style.opacity = '0.8';
                    loopPath();
                }, 500);
            };
        }

        // Set initial offset path for Web Animations API support
        qiParticle.style.offsetPath = `path('${meridianPaths[0].getAttribute('d')}')`;
        loopPath();
    }

    // --- 5. Meridian Interaction ---
    dantians.forEach(dantian => {
        dantian.addEventListener('mouseenter', (e) => {
            const info = e.target.getAttribute('data-info');
            infoBox.textContent = info;
            infoBox.style.color = 'var(--cinnabar-red)';
            infoBox.style.fontWeight = 'bold';
        });

        dantian.addEventListener('mouseleave', () => {
            infoBox.textContent = 'Trace the path to awaken the energy flow.';
            infoBox.style.color = 'var(--ink-black)';
            infoBox.style.fontWeight = 'normal';
        });
    });

    // --- 6. Skill Tree Logic (Cultivation Simulation) ---
    trainButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.skill-node');
            const originalText = e.target.textContent;
            
            // Visual feedback
            e.target.textContent = 'Cultivating...';
            e.target.disabled = true;
            e.target.style.cursor = 'wait';
            
            // Create a temporary progress bar effect inside the button
            e.target.style.position = 'relative';
            e.target.style.overflow = 'hidden';
            
            const progress = document.createElement('span');
            progress.style.position = 'absolute';
            progress.style.bottom = '0';
            progress.style.left = '0';
            progress.style.height = '2px';
            progress.style.backgroundColor = 'white';
            progress.style.width = '0%';
            progress.style.transition = `width ${config.cultivationTime}ms linear`;
            e.target.appendChild(progress);

            // Trigger animation
            setTimeout(() => { progress.style.width = '100%'; }, 50);

            // Completion
            setTimeout(() => {
                e.target.textContent = 'Mastered';
                e.target.style.backgroundColor = 'var(--cinnabar-red)';
                e.target.style.color = 'white';
                e.target.style.border = 'none';
                progress.remove();
                
                // Add visual flair to the card
                card.style.borderColor = 'var(--gold-accent)';
                card.style.boxShadow = '0 0 15px var(--gold-accent)';
                
                // Check if this unlocks a connected node (Simple logic: find next locked sibling)
                const wrapper = card.closest('.branch-wrapper');
                if (wrapper) {
                    const lockedNodes = wrapper.querySelectorAll('.skill-node.locked');
                    if (lockedNodes.length > 0) {
                        // Unlock the first locked one found (simplified logic)
                        const nodeToUnlock = lockedNodes[0];
                        setTimeout(() => {
                            nodeToUnlock.classList.remove('locked');
                            nodeToUnlock.classList.add('active'); // Assuming active style exists
                            
                            // Replace lock message with a button
                            const lockMsg = nodeToUnlock.querySelector('.lock-msg');
                            if (lockMsg) {
                                lockMsg.remove();
                                const newBtn = document.createElement('button');
                                newBtn.className = 'train-btn';
                                newBtn.textContent = 'Cultivate';
                                nodeToUnlock.appendChild(newBtn);
                                
                                // Attach event listener to new button
                                newBtn.addEventListener('click', arguments.callee.bind(null, { target: newBtn }));
                            }
                        }, 1000);
                    }
                }

            }, config.cultivationTime);
        });
    });

    // --- 7. Sound Control (Mockup) ---
    let isMuted = true;
    soundToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        const icon = soundToggle.querySelector('span');
        
        if (isMuted) {
            icon.textContent = '♫'; // Musical note
            soundToggle.style.opacity = '0.5';
            console.log('Sound muted');
            // audio.pause();
        } else {
            icon.textContent = '🔊'; // Speaker
            soundToggle.style.opacity = '1';
            console.log('Sound playing');
            // audio.play().catch(e => console.log('Audio interaction required'));
        }
    });

    // --- 8. Smooth Scroll for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

});