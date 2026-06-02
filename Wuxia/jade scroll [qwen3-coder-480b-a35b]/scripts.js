// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize canvas for qi energy flow
    const canvas = document.getElementById('qiCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Qi energy particles
    const qiParticles = [];
    const particleCount = 100;
    
    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
        qiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.1,
            angle: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.5 + 0.2,
            hue: Math.random() * 30 + 40 // Golden/yellow hues
        });
    }
    
    // Draw qi energy flow
    function drawQiFlow() {
        // Clear canvas with semi-transparent overlay for trail effect
        ctx.fillStyle = 'rgba(26, 18, 11, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        qiParticles.forEach(particle => {
            // Move particle
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
            
            // Add some randomness to movement
            particle.angle += (Math.random() - 0.5) * 0.2;
            
            // Reset particles that go off-screen
            if (particle.x < 0 || particle.x > canvas.width || 
                particle.y < 0 || particle.y > canvas.height) {
                particle.x = Math.random() * canvas.width;
                particle.y = Math.random() * canvas.height;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`;
            ctx.fill();
            
            // Add glow effect
            ctx.shadowColor = `hsl(${particle.hue}, 100%, 70%)`;
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        requestAnimationFrame(drawQiFlow);
    }
    
    // Start qi flow animation
    drawQiFlow();
    
    // Skill tree interaction
    const qiPoints = document.querySelectorAll('.qi-point');
    
    qiPoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.3)';
            this.style.boxShadow = '0 0 20px gold';
            
            // Animate related meridian lines
            const stage = this.dataset.stage;
            const relatedChannels = document.querySelectorAll(`.channel-${stage}`);
            relatedChannels.forEach(channel => {
                channel.style.backgroundColor = 'gold';
                channel.style.boxShadow = '0 0 10px gold';
            });
        });
        
        point.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
            this.style.boxShadow = '0 0 10px var(--accent-gold)';
            
            // Reset meridian lines
            const stage = this.dataset.stage;
            const relatedChannels = document.querySelectorAll(`.channel-${stage}`);
            relatedChannels.forEach(channel => {
                channel.style.backgroundColor = '';
                channel.style.boxShadow = '';
            });
        });
    });
    
    // Technique card interactions
    const techniqueCards = document.querySelectorAll('.technique-card');
    
    techniqueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const branch = this.dataset.branch;
            this.style.borderColor = getBranchColor(branch);
            this.querySelector('.card-seal').style.backgroundColor = getBranchColor(branch);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = '';
            this.querySelector('.card-seal').style.backgroundColor = '';
        });
    });
    
    // Get color based on martial arts branch
    function getBranchColor(branch) {
        const colors = {
            sword: '#2c5aa0',     // Blue for sword
            fist: '#8b0000',      // Dark red for fist
            internal: '#006400',   // Green for internal
            weapon: '#b8860b'     // Gold for weapon
        };
        return colors[branch] || '#d4af37';
    }
    
    // Scroll-based animations
    function animateOnScroll() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight * 0.8;
            
            if (sectionTop < triggerPoint) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize section animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelector('.scroll-header').style.opacity = '1';
        document.querySelector('.scroll-header').style.transform = 'translateY(0)';
    }, 300);
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Trigger on initial load
    
    // Seal stamp animation
    const seals = document.querySelectorAll('.seal-stamp, .card-seal, .stage-seal');
    
    seals.forEach(seal => {
        seal.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'stampPulse 0.5s ease';
            }, 10);
        });
    });
    
    // Add stamp pulse animation to stylesheet
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes stampPulse {
            0% { transform: scale(1) rotate(-5deg); }
            50% { transform: scale(1.2) rotate(-3deg); }
            100% { transform: scale(1) rotate(-5deg); }
        }
        
        @media (max-width: 480px) {
            @keyframes stampPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        }
    `;
    document.head.appendChild(style);
    
    // Simulate scroll unrolling effect on page load
    const scrollContainer = document.querySelector('.scroll-container');
    scrollContainer.style.height = '0';
    scrollContainer.style.opacity = '0';
    
    setTimeout(() => {
        scrollContainer.style.transition = 'height 2s ease, opacity 1s ease';
        scrollContainer.style.height = 'auto';
        scrollContainer.style.opacity = '1';
    }, 500);
});