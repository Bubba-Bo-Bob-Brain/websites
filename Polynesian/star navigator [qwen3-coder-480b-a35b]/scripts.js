// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('star-map');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full container size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawStars();
        drawConstellationLines();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Star data - positions and properties
    const stars = [];
    const constellations = [
        { name: "Te Taura-o-te-waka", stars: [0, 1, 2, 3], description: "The Canoe Rope - Guides navigators on southern routes" },
        { name: "Te Manu-o-te-whenua", stars: [4, 5, 6], description: "The Bird of the Land - Indicates landfall" },
        { name: "Te Mata-o-te-rangi", stars: [7, 8, 9, 10], description: "The Eye of the Sky - Used for equatorial navigation" }
    ];
    
    // Generate random stars
    function generateStars(count) {
        stars.length = 0;
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                brightness: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    // Draw stars on canvas
    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw starfield background
        ctx.fillStyle = 'rgba(10, 25, 47, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw stars
        const time = Date.now() / 1000;
        stars.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
            const alpha = star.brightness * twinkle;
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(248, 249, 250, ${alpha})`;
            ctx.fill();
            
            // Add glow effect for brighter stars
            if (star.brightness > 0.7) {
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, star.size,
                    star.x, star.y, star.size * 3
                );
                gradient.addColorStop(0, `rgba(77, 238, 234, ${alpha * 0.5})`);
                gradient.addColorStop(1, 'rgba(77, 238, 234, 0)');
                
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        });
    }
    
    // Draw constellation lines
    let activeConnections = [];
    function drawConstellationLines() {
        // Clear only the lines layer
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        
        // Draw existing connections
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(77, 238, 234, 0.6)';
        
        activeConnections.forEach(conn => {
            ctx.beginPath();
            ctx.moveTo(conn.x1, conn.y1);
            ctx.lineTo(conn.x2, conn.y2);
            ctx.stroke();
        });
        
        ctx.restore();
    }
    
    // Connect two stars
    function connectStars(index1, index2) {
        if (index1 >= stars.length || index2 >= stars.length) return;
        
        const star1 = stars[index1];
        const star2 = stars[index2];
        
        activeConnections.push({
            x1: star1.x,
            y1: star1.y,
            x2: star2.x,
            y2: star2.y
        });
        
        drawConstellationLines();
    }
    
    // Handle star clicks
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find clicked star
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
            
            if (distance < star.size * 3) {
                // If we have a previously selected star, connect them
                if (selectedStarIndex !== null) {
                    connectStars(selectedStarIndex, i);
                    selectedStarIndex = null;
                } else {
                    // Select this star
                    selectedStarIndex = i;
                    
                    // Highlight the star
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
                break;
            }
        }
    });
    
    let selectedStarIndex = null;
    
    // Rotate starfield with mouse movement
    let rotationOffsetX = 0;
    let rotationOffsetY = 0;
    
    document.querySelector('.visualization-area').addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        rotationOffsetX = (e.clientX - centerX) / 50;
        rotationOffsetY = (e.clientY - centerY) / 50;
        
        // Redraw with offset
        drawStarsWithRotation();
    });
    
    function drawStarsWithRotation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw starfield background
        ctx.fillStyle = 'rgba(10, 25, 47, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw rotated stars
        const time = Date.now() / 1000;
        stars.forEach(star => {
            const rotatedX = star.x + rotationOffsetX;
            const rotatedY = star.y + rotationOffsetY;
            
            // Keep stars within canvas bounds
            const boundedX = (rotatedX + canvas.width) % canvas.width;
            const boundedY = (rotatedY + canvas.height) % canvas.height;
            
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
            const alpha = star.brightness * twinkle;
            
            ctx.beginPath();
            ctx.arc(boundedX, boundedY, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(248, 249, 250, ${alpha})`;
            ctx.fill();
            
            // Add glow effect for brighter stars
            if (star.brightness > 0.7) {
                const gradient = ctx.createRadialGradient(
                    boundedX, boundedY, star.size,
                    boundedX, boundedY, star.size * 3
                );
                gradient.addColorStop(0, `rgba(77, 238, 234, ${alpha * 0.5})`);
                gradient.addColorStop(1, 'rgba(77, 238, 234, 0)');
                
                ctx.beginPath();
                ctx.arc(boundedX, boundedY, star.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        });
        
        drawConstellationLines();
    }
    
    // Navigation panel interactions
    const navSections = document.querySelectorAll('.panel-section');
    navSections.forEach(section => {
        section.addEventListener('click', function() {
            navSections.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            // In a full implementation, this would switch views
            // For now, we'll just show a message
            const target = this.getAttribute('data-target');
            console.log(`Switched to ${target} view`);
        });
    });
    
    // Island interactions
    const islands = document.querySelectorAll('.island');
    islands.forEach(island => {
        island.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            alert(`Island: ${name}\nTraditional wayfinding knowledge point.`);
        });
    });
    
    // Close info panel
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.querySelector('.info-panel').style.display = 'none';
    });
    
    // Initialize
    generateStars(150);
    drawStars();
    
    // Animation loop for twinkling stars
    function animate() {
        drawStars();
        drawConstellationLines();
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Add bioluminescent wake effect on mouse move
    const visualizationArea = document.querySelector('.visualization-area');
    visualizationArea.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        createWakeEffect(x, y);
    });
    
    function createWakeEffect(x, y) {
        const particleCount = 5;
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'wake-particle';
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.setProperty('--x-offset', `${(Math.random() - 0.5) * 100}px`);
                particle.style.setProperty('--y-offset', `${(Math.random() - 0.5) * 100}px`);
                visualizationArea.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }, i * 100);
        }
    }
    
    // Add CSS for wake particles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .wake-particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: var(--bioluminescent);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.8;
            transform: translate(-50%, -50%);
            animation: fadeOut 1s forwards;
            z-index: 10;
        }
        
        @keyframes fadeOut {
            0% {
                transform: translate(-50%, -50%) translate(0, 0);
                opacity: 0.8;
                width: 6px;
                height: 6px;
            }
            100% {
                transform: translate(-50%, -50%) translate(var(--x-offset), var(--y-offset));
                opacity: 0;
                width: 2px;
                height: 2px;
            }
        }
    `;
    document.head.appendChild(style);
});