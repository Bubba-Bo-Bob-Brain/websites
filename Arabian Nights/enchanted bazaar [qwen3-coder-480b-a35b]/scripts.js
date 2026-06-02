// scripts.js

// Lantern glow effect that follows cursor
document.addEventListener('DOMContentLoaded', function() {
    const lanternGlow = document.getElementById('lantern-glow');
    
    // Hide lantern glow initially
    lanternGlow.style.opacity = '0';
    
    document.addEventListener('mousemove', (e) => {
        // Show lantern glow when mouse moves
        lanternGlow.style.opacity = '0.7';
        lanternGlow.style.left = `${e.clientX}px`;
        lanternGlow.style.top = `${e.clientY}px`;
        
        // Hide lantern glow after inactivity
        clearTimeout(window.lanternTimeout);
        window.lanternTimeout = setTimeout(() => {
            lanternGlow.style.opacity = '0';
        }, 1000);
    });
    
    // Handle magic lamp interactions
    initializeLamps();
});

// Initialize lamp interactions
function initializeLamps() {
    const lamps = document.querySelectorAll('.magic-lamp');
    
    lamps.forEach(lamp => {
        lamp.addEventListener('click', function() {
            revealProduct(this);
        });
        
        // Add subtle hover effect
        lamp.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        lamp.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Reveal product when lamp is "rubbed"
function revealProduct(lampElement) {
    // Get the parent product card
    const productCard = lampElement.closest('.product-card');
    
    // If already revealed, do nothing
    if (productCard.classList.contains('revealed')) return;
    
    // Add revealed class to show product info
    productCard.classList.add('revealed');
    
    // Create magical sparkles effect
    createSparkles(lampElement);
    
    // Add special animation to the lamp
    lampElement.style.animation = 'lampShine 1s ease';
    
    // Remove animation after it completes
    setTimeout(() => {
        lampElement.style.animation = '';
    }, 1000);
}

// Create magical sparkles effect
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create 15 sparkles
    for (let i = 0; i < 15; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        
        // Random properties for each sparkle
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const size = 3 + Math.random() * 5;
        const duration = 0.5 + Math.random() * 0.5;
        
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.backgroundColor = getRandomGoldColor();
        sparkle.style.boxShadow = `0 0 ${size}px ${getRandomGoldColor()}`;
        
        // Animate the sparkle
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        sparkle.animate([
            { 
                transform: 'translate(0, 0) scale(0)',
                opacity: 1
            },
            { 
                transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'ease-out'
        });
        
        // Remove sparkle after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, duration * 1000);
        
        document.body.appendChild(sparkle);
    }
}

// Helper function to get random gold color for sparkles
function getRandomGoldColor() {
    const goldColors = [
        '#f9d689', // light gold
        '#e6b85c', // medium gold
        '#b88a3d', // dark gold
        '#ff9e44', // amber
        '#ffcc66'  // bright gold
    ];
    return goldColors[Math.floor(Math.random() * goldColors.length)];
}

// Add CSS for sparkle animation dynamically
const sparkleStyles = `
    @keyframes lampShine {
        0% { filter: brightness(1); }
        50% { filter: brightness(2) drop-shadow(0 0 15px gold); }
        100% { filter: brightness(1); }
    }
    
    .sparkle {
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
    }
`;

// Inject sparkle styles into the document
const styleSheet = document.createElement('style');
styleSheet.textContent = sparkleStyles;
document.head.appendChild(styleSheet);

// Add subtle floating animation to product cards
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        // Add delay for staggered animation
        card.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
    });
});

// Add purchase button functionality
document.addEventListener('DOMContentLoaded', function() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Visual feedback
            this.textContent = 'Purchased!';
            this.style.background = 'linear-gradient(to bottom, #4CAF50, #2E7D32)';
            this.style.color = 'white';
            
            // Create purchase confirmation effect
            createPurchaseEffect(this);
            
            // Reset after delay
            setTimeout(() => {
                this.textContent = 'Purchase';
                this.style.background = '';
                this.style.color = '';
            }, 2000);
            
            console.log(`Purchased: ${productName}`);
        });
    });
});

// Create purchase confirmation effect
function createPurchaseEffect(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create confirmation sparkle
    const sparkle = document.createElement('div');
    sparkle.className = 'purchase-sparkle';
    sparkle.style.left = `${centerX}px`;
    sparkle.style.top = `${centerY}px`;
    sparkle.innerHTML = '★';
    sparkle.style.color = '#FFD700';
    sparkle.style.fontSize = '24px';
    sparkle.style.textShadow = '0 0 10px gold';
    sparkle.style.zIndex = '10000';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.position = 'fixed';
    
    document.body.appendChild(sparkle);
    
    // Animate the sparkle
    sparkle.animate([
        { 
            transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
            opacity: 1
        },
        { 
            transform: 'translate(-50%, -150%) scale(2) rotate(360deg)',
            opacity: 0
        }
    ], {
        duration: 1000,
        easing: 'ease-out'
    });
    
    // Remove after animation
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}

// Add ambient sound effect on first interaction
let ambientSoundPlayed = false;
document.addEventListener('click', function() {
    if (!ambientSoundPlayed) {
        // In a real implementation, we would play ambient sounds here
        // For this demo, we'll just log to console
        console.log("Ambient bazaar sounds playing...");
        ambientSoundPlayed = true;
    }
}, { once: true });