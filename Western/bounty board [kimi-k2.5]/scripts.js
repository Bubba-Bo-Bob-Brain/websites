/**
 * TERRITORY BOUNTY BOARD - INTERACTIVE SCRIPTS
 * New Mexico Territory, 1876
 * 
 * Features:
 * - Revolver cylinder navigation with section switching
 * - Canvas-based wind and dust particle system
 * - Saloon door page transitions
 * - Interactive wanted posters with dossier loading
 * - Ledger pagination and telegram effects
 * - Tumbleweed randomization and controls
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // GLOBAL STATE & CONFIGURATION
    // ============================================
    const state = {
        currentSection: 'dispatch',
        isAnimating: false,
        dustParticles: [],
        windSpeed: 1,
        tumbleweedInterval: null
    };

    const config = {
        particleCount: 50,
        windDirection: 1, // 1 = right, -1 = left
        sections: ['board', 'dispatch', 'rewards', 'outlaws', 'claim', 'map']
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    init();
    
    function init() {
        initParticleSystem();
        initNavigation();
        initPosters();
        initLedger();
        initTumbleweed();
        initEffects();
        
        // Trigger initial saloon door animation
        setTimeout(() => triggerSaloonDoors(), 500);
    }

    // ============================================
    // WIND & DUST PARTICLE SYSTEM (Canvas)
    // ============================================
    function initParticleSystem() {
        const canvas = document.getElementById('wind-particles');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width, height;
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        resize();
        window.addEventListener('resize', resize);
        
        // Particle class for dust motes
        class DustParticle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() * 2 + 0.5) * config.windDirection * state.windSpeed;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = `rgba(212, 196, 168, ${this.opacity})`;
                this.life = Math.random() * 100 + 100;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life--;
                
                // Add some turbulence
                this.y += Math.sin(this.x * 0.01) * 0.5;
                
                // Reset if off screen or dead
                if (this.x > width + 50 || this.x < -50 || this.life <= 0) {
                    this.reset();
                    this.x = config.windDirection === 1 ? -50 : width + 50;
                }
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Initialize particles
        for (let i = 0; i < config.particleCount; i++) {
            state.dustParticles.push(new DustParticle());
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Update and draw all particles
            state.dustParticles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Occasional gust of wind (more particles)
            if (Math.random() < 0.01) {
                createGust();
            }
            
            requestAnimationFrame(animate);
        }
        
        function createGust() {
            // Temporarily increase wind speed
            const originalSpeed = state.windSpeed;
            state.windSpeed = 3;
            
            // Add burst of particles
            for (let i = 0; i < 10; i++) {
                const p = new DustParticle();
                p.speedX *= 2;
                state.dustParticles.push(p);
            }
            
            // Reset after gust
            setTimeout(() => {
                state.windSpeed = originalSpeed;
                // Remove excess particles
                state.dustParticles = state.dustParticles.slice(0, config.particleCount);
            }, 2000);
        }
        
        animate();
        
        // Change wind direction occasionally
        setInterval(() => {
            if (Math.random() < 0.3) {
                config.windDirection *= -1;
                state.dustParticles.forEach(p => {
                    p.speedX = Math.abs(p.speedX) * config.windDirection;
                });
            }
        }, 10000);
    }

    // ============================================
    // NAVIGATION - REVOLVER CYLINDER
    // ============================================
    function initNavigation() {
        const chambers = document.querySelectorAll('.chamber');
        
        chambers.forEach(chamber => {
            chamber.addEventListener('click', handleNavigation);
            chamber.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigation.call(chamber);
                }
            });
        });
        
        function handleNavigation() {
            if (state.isAnimating) return;
            
            const target = this.dataset.target;
            if (!target || target === state.currentSection) return;
            
            // Update active states
            chambers.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Rotate cylinder visual effect
            rotateCylinder(this);
            
            // Switch sections with saloon doors
            switchSection(target);
        }
        
        function rotateCylinder(activeChamber) {
            // Add rotation animation to container
            const container = document.querySelector('.cylinder-container');
            const rect = activeChamber.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const center = containerRect.left + containerRect.width / 2;
            const offset = rect.left + rect.width / 2 - center;
            
            // Subtle rotation based on selection
            container.style.transform = `rotateY(${offset * 0.05}deg)`;
            setTimeout(() => {
                container.style.transform = 'rotateY(0deg)';
            }, 300);
        }
    }

    function switchSection(targetId) {
        state.isAnimating = true;
        
        const sections = document.querySelectorAll('.content-section');
        const targetSection = document.getElementById(targetId);
        
        if (!targetSection) {
            state.isAnimating = false;
            return;
        }
        
        // Trigger saloon door animation
        triggerSaloonDoors(() => {
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
                section.hidden = true;
            });
            
            // Show target
            targetSection.hidden = false;
            targetSection.classList.add('active');
            state.currentSection = targetId;
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${targetId}`);
            
            // Close saloon doors
            setTimeout(() => {
                closeSaloonDoors(() => {
                    state.isAnimating = false;
                });
            }, 100);
        });
    }

    // ============================================
    // SALOON DOOR TRANSITIONS
    // ============================================
    function triggerSaloonDoors(callback) {
        const doors = document.getElementById('saloon-doors');
        if (!doors) return;
        
        doors.classList.add('swinging');
        
        // Play creak sound if available
        playSound('creak-sound');
        
        setTimeout(() => {
            if (callback) callback();
        }, 500); // Halfway through animation
    }

    function closeSaloonDoors(callback) {
        const doors = document.getElementById('saloon-doors');
        if (!doors) return;
        
        setTimeout(() => {
            doors.classList.remove('swinging');
            setTimeout(() => {
                if (callback) callback();
            }, 1000);
        }, 500);
    }

    // ============================================
    // WANTED POSTERS INTERACTIONS
    // ============================================
    function initPosters() {
        const posters = document.querySelectorAll('.wanted-poster');
        
        posters.forEach(poster => {
            // Hover effects are CSS-based, but we add sound and detail
            poster.addEventListener('mouseenter', () => {
                playSound('paper-sound', 0.2);
            });
            
            poster.addEventListener('click', () => {
                const outlawId = poster.dataset.outlaw;
                loadOutlawProfile(outlawId, poster);
            });
            
            // 3D tilt effect on mouse move
            poster.addEventListener('mousemove', (e) => {
                const rect = poster.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                poster.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            poster.addEventListener('mouseleave', () => {
                poster.style.transform = '';
            });
        });
        
        // Add random bullet holes on click anywhere
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wanted-poster') || e.target.closest('.chamber')) return;
            
            if (Math.random() < 0.1) { // 10% chance
                createBulletHole(e.clientX, e.clientY);
            }
        });
    }

    function loadOutlawProfile(outlawId, posterElement) {
        // Switch to outlaws section with data
        const profileSection = document.getElementById('outlaws');
        const profileCard = document.querySelector('.profile-card');
        
        if (!profileSection || !profileCard) return;
        
        // Get data from clicked poster
        const name = posterElement.querySelector('.outlaw-name')?.textContent || 'Unknown';
        const alias = posterElement.querySelector('.alias')?.textContent || '';
        const crimes = Array.from(posterElement.querySelectorAll('.crimes-list li')).map(li => li.textContent);
        const reward = posterElement.querySelector('.reward-amount')?.textContent || 'Unknown';
        
        // Populate profile view
        const dossierHTML = `
            <div class="wanted-poster-large" style="transform: rotate(-2deg);">
                <div class="poster-content">
                    <span class="wanted-banner" style="font-size: 2.5rem; display: block; text-align: center; margin-bottom: 1rem;">${name}</span>
                    <div class="mugshot-frame" style="width: 100%; aspect-ratio: 3/4; margin-bottom: 1rem;">
                        <div class="mugshot ${outlawId}-portrait" style="width: 100%; height: 100%; background-size: cover;"></div>
                    </div>
                    <div class="alias" style="text-align: center; font-style: italic; margin-bottom: 1rem;">${alias}</div>
                    <div class="reward-display" style="text-align: center; border: 2px solid #000; padding: 1rem;">
                        <span style="font-size: 2rem; color: #8b0000; font-family: 'Rye', serif;">${reward}</span>
                    </div>
                </div>
            </div>
            <div class="dossier-folder">
                <div class="folder-tab">CASE FILE: ${outlawId.toUpperCase()}</div>
                <div class="folder-content">
                    <h3 style="font-family: 'Rye', serif; margin-bottom: 1rem; border-bottom: 2px solid #000;">Criminal Record</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${crimes.map(crime => `<li style="padding: 0.5rem 0; border-bottom: 1px dotted #000;">• ${crime}</li>`).join('')}
                    </ul>
                    <h3 style="font-family: 'Rye', serif; margin: 1.5rem 0 1rem; border-bottom: 2px solid #000;">Last Known Whereabouts</h3>
                    <p>Territory of New Mexico, vicinity of Clayton. Subject considered armed and extremely dangerous.</p>
                    <div style="margin-top: 2rem; padding: 1rem; background: rgba(139, 0, 0, 0.1); border-left: 4px solid #8b0000;">
                        <strong>WARNING:</strong> Do not approach alone. Contact nearest Marshal office immediately upon sighting.
                    </div>
                </div>
            </div>
        `;
        
        profileCard.innerHTML = dossierHTML;
        
        // Switch to profile section
        switchSection('outlaws');
    }

    function createBulletHole(x, y) {
        const hole = document.createElement('div');
        hole.className = 'bullet-hole';
        hole.style.position = 'fixed';
        hole.style.left = x + 'px';
        hole.style.top = y + 'px';
        hole.style.width = '8px';
        hole.style.height = '8px';
        hole.style.background = 'radial-gradient(circle at 30% 30%, #3d2817, #000)';
        hole.style.borderRadius = '50%';
        hole.style.zIndex = '9999';
        hole.style.pointerEvents = 'none';
        
        // Add spark effect
        hole.style.boxShadow = '0 0 10px 2px rgba(255, 100, 0, 0.8)';
        
        document.body.appendChild(hole);
        
        // Fade out spark
        setTimeout(() => {
            hole.style.boxShadow = '0 0 2px rgba(0,0,0,0.8)';
            hole.style.transition = 'opacity 2s';
        }, 100);
        
        // Keep bullet hole but fade slightly
        setTimeout(() => {
            hole.style.opacity = '0.7';
        }, 2000);
    }

    // ============================================
    // LEDGER PAGINATION
    // ============================================
    function initLedger() {
        const prevBtn = document.querySelector('.page-btn.prev');
        const nextBtn = document.querySelector('.page-btn.next');
        const pages = document.querySelectorAll('.page');
        const pageNumber = document.querySelector('.page-number');
        
        let currentPage = 1;
        const totalPages = pages.length;
        
        function updatePage() {
            pages.forEach((page, index) => {
                page.classList.remove('active-page');
                if (index + 1 === currentPage) {
                    page.classList.add('active-page');
                }
            });
            
            if (pageNumber) {
                pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
            }
            
            // Disable/enable buttons
            if (prevBtn) prevBtn.disabled = currentPage === 1;
            if (nextBtn) nextBtn.disabled = currentPage === totalPages;
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updatePage();
                    playSound('paper-sound', 0.3);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePage();
                    playSound('paper-sound', 0.3);
                }
            });
        }
        
        updatePage();
    }

    // ============================================
    // TUMBLEWEED CONTROLLER
    // ============================================
    function initTumbleweed() {
        const container = document.getElementById('tumbleweed-container');
        if (!container) return;
        
        // Randomize tumbleweed appearance
        function scheduleTumbleweed() {
            const delay = Math.random() * 20000 + 15000; // 15-35 seconds
            
            setTimeout(() => {
                const tumbleweed = container.querySelector('.tumbleweed');
                if (tumbleweed) {
                    // Reset animation
                    tumbleweed.style.animation = 'none';
                    tumbleweed.offsetHeight; // Trigger reflow
                    tumbleweed.style.animation = 'tumbleAcross 25s linear infinite, tumbleRotate 2s linear infinite';
                }
                scheduleTumbleweed();
            }, delay);
        }
        
        scheduleTumbleweed();
    }

    // ============================================
    // UTILITY FUNCTIONS & EFFECTS
    // ============================================
    function initEffects() {
        // Parallax effect on scroll for posters
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hanging-rope');
            
            parallaxElements.forEach((rope, index) => {
                const speed = 0.5 + (index * 0.1);
                rope.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
        
        // Random telegram updates
        initTelegramUpdates();
    }

    function initTelegramUpdates() {
        const telegramText = document.querySelector('.typing-text');
        if (!telegramText) return;
        
        const messages = [
            "URGENT: Stagecoach robbery reported...",
            "REWARD INCREASED: Black Jack Ketchum...",
            "WEATHER ALERT: Sand storm approaching...",
            "MARSHAL ALERT: Armed gang spotted...",
            "INCOMING: New bounty posted..."
        ];
        
        let messageIndex = 0;
        
        setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            telegramText.style.animation = 'none';
            telegramText.offsetHeight; // Trigger reflow
            telegramText.textContent = messages[messageIndex];
            telegramText.style.animation = 'typing 3s steps(40) infinite';
        }, 10000);
    }

    function playSound(soundId, volume = 0.5) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.volume = volume;
            sound.currentTime = 0;
            sound.play().catch(e => {
                // Audio play failed (probably user interaction required first)
                console.log('Audio play failed:', e);
            });
        }
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const chambers = Array.from(document.querySelectorAll('.chamber'));
            const activeIndex = chambers.findIndex(c => c.classList.contains('active'));
            
            let newIndex;
            if (e.key === 'ArrowLeft') {
                newIndex = activeIndex > 0 ? activeIndex - 1 : chambers.length - 1;
            } else {
                newIndex = activeIndex < chambers.length - 1 ? activeIndex + 1 : 0;
            }
            
            chambers[newIndex].click();
            chambers[newIndex].focus();
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash && config.sections.includes(hash)) {
            const chamber = document.querySelector(`[data-target="${hash}"]`);
            if (chamber) chamber.click();
        }
    });

    // Check initial hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (config.sections.includes(hash)) {
            setTimeout(() => {
                const chamber = document.querySelector(`[data-target="${hash}"]`);
                if (chamber) {
                    document.querySelectorAll('.chamber').forEach(c => c.classList.remove('active'));
                    chamber.classList.add('active');
                    switchSection(hash);
                }
            }, 100);
        }
    }
});

// ============================================
// EXTERNAL UTILITY FUNCTIONS
// ============================================

/**
 * Creates a realistic wood grain texture using canvas
 * (Called dynamically if needed)
 */
function generateWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Base wood color
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(0, 0, 200, 200);
    
    // Grain lines
    ctx.strokeStyle = '#3d2817';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 4);
        ctx.lineTo(200, i * 4 + (Math.random() - 0.5) * 10);
        ctx.stroke();
    }
    
    return canvas.toDataURL();
}

/**
 * Randomly flickers lights (for atmosphere)
 */
function flickerLights() {
    const lights = document.querySelectorAll('.light');
    lights.forEach(light => {
        if (Math.random() < 0.1) {
            light.style.opacity = Math.random() * 0.5 + 0.5;
            setTimeout(() => {
                light.style.opacity = 1;
            }, 100);
        }
    });
}

// Occasional light flicker
setInterval(flickerLights, 2000);