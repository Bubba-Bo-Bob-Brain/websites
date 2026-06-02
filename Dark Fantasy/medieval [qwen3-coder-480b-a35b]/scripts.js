// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Torch flame animation enhancement
    const torches = document.querySelectorAll('.torch');
    torches.forEach(torch => {
        // Add random flickering effect
        setInterval(() => {
            const scale = 0.95 + Math.random() * 0.1;
            const opacity = 0.6 + Math.random() * 0.3;
            torch.style.transform = `scale(${scale})`;
            torch.style.opacity = opacity;
        }, 100);
    });
    
    // Interactive map markers
    const markers = document.querySelectorAll('.location-marker');
    markers.forEach(marker => {
        marker.addEventListener('mouseenter', function() {
            // Add pulse effect on hover
            this.style.animation = 'pulse 1s infinite';
        });
        
        marker.addEventListener('mouseleave', function() {
            // Remove pulse effect
            this.style.animation = '';
        });
    });
    
    // Add CSS for pulse animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.3); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Navigation link interaction
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect dynamically
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(212, 175, 55, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: 20px;
            height: 20px;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Creature card interaction
    const creatureCards = document.querySelectorAll('.creature-card');
    creatureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add floating effect
            this.style.animation = 'float 3s ease-in-out infinite';
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove floating effect
            this.style.animation = '';
        });
    });
    
    // Add CSS for floating animation dynamically
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
    `;
    document.head.appendChild(floatStyle);
    
    // Scroll effect for prophecy text
    const prophecyText = document.querySelector('.prophecy-text');
    if (prophecyText) {
        // Split text into characters for individual animation
        const text = prophecyText.textContent;
        prophecyText.innerHTML = '';
        
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            prophecyText.appendChild(span);
        });
        
        // Animate characters one by one
        const chars = prophecyText.querySelectorAll('span');
        let delay = 0;
        
        chars.forEach(char => {
            setTimeout(() => {
                char.style.transition = 'opacity 0.5s, transform 0.5s';
                char.style.opacity = '1';
                char.style.transform = 'translateY(0)';
            }, delay);
            
            delay += 50; // Stagger effect
        });
    }
    
    // Add ambient sound effect (simulated)
    function playAmbientSound() {
        // In a real implementation, this would play actual audio
        console.log("Ambient wind howling through the castle towers...");
        
        // Visual effect to simulate sound
        const body = document.body;
        body.style.boxShadow = 'inset 0 0 100px rgba(139, 0, 0, 0.1)';
        
        setTimeout(() => {
            body.style.boxShadow = 'none';
        }, 2000);
    }
    
    // Play ambient sound periodically
    setInterval(playAmbientSound, 30000); // Every 30 seconds
    
    // Initial ambient sound after page load
    setTimeout(playAmbientSound, 3000);
    
    // Add decorative elements randomly
    function addDecorativeElements() {
        const contentWrapper = document.querySelector('.content-wrapper');
        if (!contentWrapper) return;
        
        // Add corner decorations
        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        corners.forEach(corner => {
            const decor = document.createElement('div');
            decor.classList.add('corner-decoration', corner);
            decor.innerHTML = '❦';
            contentWrapper.appendChild(decor);
        });
        
        // Add CSS for corner decorations
        const decorStyle = document.createElement('style');
        decorStyle.textContent = `
            .corner-decoration {
                position: absolute;
                font-size: 2rem;
                color: var(--blood-red);
                opacity: 0.3;
                pointer-events: none;
            }
            
            .corner-decoration.top-left {
                top: 20px;
                left: 20px;
                transform: rotate(-30deg);
            }
            
            .corner-decoration.top-right {
                top: 20px;
                right: 20px;
                transform: rotate(30deg);
            }
            
            .corner-decoration.bottom-left {
                bottom: 20px;
                left: 20px;
                transform: rotate(30deg);
            }
            
            .corner-decoration.bottom-right {
                bottom: 20px;
                right: 20px;
                transform: rotate(-30deg);
            }
        `;
        document.head.appendChild(decorStyle);
    }
    
    // Add decorative elements after a short delay
    setTimeout(addDecorativeElements, 1000);
    
    // Add blood drip effect occasionally
    function createBloodDrip() {
        const drip = document.createElement('div');
        drip.classList.add('blood-drip');
        drip.style.left = `${Math.random() * 100}%`;
        drip.style.animationDuration = `${2 + Math.random() * 3}s`;
        document.body.appendChild(drip);
        
        // Remove drip after animation completes
        setTimeout(() => {
            drip.remove();
        }, 5000);
    }
    
    // Add CSS for blood drips
    const dripStyle = document.createElement('style');
    dripStyle.textContent = `
        .blood-drip {
            position: fixed;
            top: -20px;
            width: 2px;
            height: 30px;
            background: var(--blood-red);
            box-shadow: 0 0 5px var(--blood-red);
            animation: drip linear forwards;
            z-index: 1000;
        }
        
        @keyframes drip {
            to {
                transform: translateY(100vh);
            }
        }
    `;
    document.head.appendChild(dripStyle);
    
    // Create occasional blood drips
    setInterval(createBloodDrip, 10000); // Every 10 seconds
    
    // Add a few initial drips
    for (let i = 0; i < 3; i++) {
        setTimeout(createBloodDrip, 2000 + (i * 3000));
    }
});