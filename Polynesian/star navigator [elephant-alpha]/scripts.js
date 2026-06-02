// Polynesian Celestial Wayfinding Chart - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Interactive constellation dots functionality
    const dots = document.querySelectorAll('.dot');
    const starPoints = document.querySelectorAll('.star-point');
    
    // Store original positions for constellation lines
    const dotPositions = [];
    
    dots.forEach(dot => {
        const rect = dot.getBoundingClientRect();
        dotPositions.push({
            element: dot,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
        
        // Add click interaction to dots
        dot.addEventListener('click', function() {
            this.classList.toggle('active');
            checkConstellation();
        });
        
        // Add hover effects
        dot.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.8)';
            this.style.zIndex = '100';
        });
        
        dot.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
                this.style.zIndex = '5';
            }
        });
    });
    
    // Star point interactions
    starPoints.forEach(star => {
        star.addEventListener('click', function() {
            this.classList.toggle('active');
            createStarEffect(this);
        });
        
        star.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        star.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    });
    
    // Check if constellation pattern is formed
    function checkConstellation() {
        const activeDots = document.querySelectorAll('.dot.active');
        
        // If we have enough dots active, create constellation visualization
        if (activeDots.length >= 3) {
            // Create temporary constellation lines
            createConstellationLines(activeDots);
            
            // Add special effect
            if (activeDots.length === 5) {
                createFullConstellationEffect();
            }
        }
    }
    
    // Create visual constellation lines
    function createConstellationLines(activeDots) {
        // Remove existing constellation lines
        document.querySelectorAll('.constellation-line').forEach(line => line.remove());
        
        // Create lines between active dots
        for (let i = 0; i < activeDots.length - 1; i++) {
            const dot1 = activeDots[i];
            const dot2 = activeDots[i + 1];
            
            const line = document.createElement('div');
            line.className = 'constellation-line';
            line.style.cssText = `
                position: absolute;
                height: 2px;
                background: linear-gradient(90deg, var(--star-gold), transparent);
                box-shadow: 0 0 10px var(--glow-gold);
                transform-origin: left center;
                z-index: 50;
            `;
            
            // Calculate line properties
            const x1 = dot1.element.getBoundingClientRect().left + dot1.element.getBoundingClientRect().width / 2;
            const y1 = dot1.element.getBoundingClientRect().top + dot1.element.getBoundingClientRect().height / 2;
            const x2 = dot2.element.getBoundingClientRect().left + dot2.element.getBoundingClientRect().width / 2;
            const y2 = dot2.element.getBoundingClientRect().top + dot2.element.getBoundingClientRect().height / 2;
            
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            
            line.style.width = length + 'px';
            line.style.left = x1 + 'px';
            line.style.top = y1 + 'px';
            line.style.transform = `rotate(${angle}deg)`;
            
            document.querySelector('.wayfinding-chart').appendChild(line);
        }
    }
    
    // Create full constellation effect
    function createFullConstellationEffect() {
        // Create burst of particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: var(--star-gold);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--star-gold);
                    z-index: 1000;
                    pointer-events: none;
                    animation: constellation-burst 1s ease-out forwards;
                `;
                
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.top = Math.random() * window.innerHeight + 'px';
                
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1000);
            }, i * 100);
        }
        
        // Add title flash effect
        const title = document.querySelector('.title');
        title.style.animation = 'none';
        title.style.background = 'linear-gradient(90deg, var(--star-white), var(--star-gold), var(--star-white))';
        setTimeout(() => {
            title.style.background = 'linear-gradient(90deg, var(--star-gold), var(--star-white), var(--star-gold))';
        }, 2000);
    }
    
    // Create star effect on star point click
    function createStarEffect(element) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: var(--star-white);
                    border-radius: 50%;
                    box-shadow: 0 0 8px var(--star-gold);
                    z-index: 999;
                    pointer-events: none;
                    animation: star-explode 0.8s ease-out forwards;
                `;
                
                star.style.left = (element.getBoundingClientRect().left + element.getBoundingClientRect().width/2 + window.scrollX) + 'px';
                star.style.top = (element.getBoundingClientRect().top + element.getBoundingClientRect().height/2 + window.scrollY) + 'px';
                
                document.body.appendChild(star);
                
                setTimeout(() => star.remove(), 800);
            }, i * 50);
        }
    }
    
    // Add CSS animation for constellation burst
    const style = document.createElement('style');
    style.textContent = `
        @keyframes constellation-burst {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Mouse move interaction for star dome
    const starDome = document.querySelector('.star-dome');
    if (starDome) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            // Subtle parallax effect on star dome
            starDome.style.background = `radial-gradient(circle at ${x}% ${y}%, transparent 30%, rgba(10, 14, 39, 0.9) 100%)`;
        });
    }
    
    // Create dynamic wave interaction
    const swells = document.querySelectorAll('.swell-1, .swell-2, .swell-3');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        swells.forEach((swell, index) => {
            const speed = (index + 1) * 0.5;
            swell.style.transform = `translate(${(x - 50) * speed}px, ${(y - 50) * speed}px)`;
        });
    });
    
    // Island hover effects
    const islands = document.querySelectorAll('.island');
    islands.forEach(island => {
        island.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-20px) scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        island.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Create floating particles effect
    function createFloatingParticles() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: var(--star-gold);
            border-radius: 50%;
            box-shadow: 0 0 4px var(--star-gold);
            z-index: 1;
            pointer-events: none;
            animation: float-particle ${3 + Math.random() * 3}s ease-in-out infinite;
            opacity: 0.6;
        `;
        
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '100%';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 6000);
    }
    
    // Add float particle animation to CSS
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float-particle {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(particleStyle);
    
    // Start particle creation loop
    setInterval(createFloatingParticles, 800);
    
    // Create initial particles
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createFloatingParticles(), i * 300);
    }
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Ensure keyboard navigation works properly
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate positions on resize
            document.querySelectorAll('.constellation-line').forEach(line => line.remove());
        }, 250);
    });
    
    // Add subtle ambient animation to entire chart
    const chart = document.querySelector('.wayfinding-chart');
    chart.style.animation = 'ambient-pulse 20s ease-in-out infinite';
    
    const ambientStyle = document.createElement('style');
    ambientStyle.textContent = `
        @keyframes ambient-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.98; }
        }
    `;
    document.head.appendChild(ambientStyle);
});