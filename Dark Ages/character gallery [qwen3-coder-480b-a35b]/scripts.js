// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize plague meter animation
    initializePlagueMeter();
    
    // Add character card interactions
    setupCharacterCards();
    
    // Add plague symptoms animation
    animatePlagueSymptoms();
    
    // Add plague infection simulation
    simulatePlagueSpread();
});

function initializePlagueMeter() {
    const plagueFill = document.querySelector('.plague-fill');
    const plagueText = document.querySelector('.plague-text');
    
    // Animate plague meter on load
    setTimeout(() => {
        plagueFill.style.transition = 'width 3s ease-in-out';
        plagueFill.style.width = '73%';
    }, 500);
    
    // Add pulsing effect
    setInterval(() => {
        plagueFill.style.transform = 'scale(1.02)';
        setTimeout(() => {
            plagueFill.style.transform = 'scale(1)';
        }, 500);
    }, 4000);
}

function setupCharacterCards() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach(card => {
        // Add hover effect sound simulation
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 35px rgba(139, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
        });
        
        // Add plague infection effect on click
        card.addEventListener('click', function() {
            const front = this.querySelector('.card-front');
            const portrait = this.querySelector('.character-portrait');
            
            // Add infection visual effect
            portrait.classList.add('infected');
            
            // Remove after animation
            setTimeout(() => {
                portrait.classList.remove('infected');
            }, 2000);
        });
    });
}

function animatePlagueSymptoms() {
    const symptoms = document.querySelectorAll('.plague-symptoms span');
    
    // Animate symptoms randomly
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * symptoms.length);
        const symptom = symptoms[randomIndex];
        
        symptom.style.transform = 'scale(1.1)';
        symptom.style.color = '#c41e3a';
        
        setTimeout(() => {
            symptom.style.transform = 'scale(1)';
            symptom.style.color = '';
        }, 1000);
    }, 3000);
}

function simulatePlagueSpread() {
    const characters = document.querySelectorAll('.character-portrait');
    
    // Randomly infect characters periodically
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * characters.length);
        const character = characters[randomIndex];
        
        // Only infect if not already infected
        if (!character.classList.contains('infected')) {
            character.classList.add('spreading');
            
            setTimeout(() => {
                character.classList.remove('spreading');
            }, 1500);
        }
    }, 7000);
}

// Add special effects to character portraits
document.querySelectorAll('.character-portrait').forEach((portrait, index) => {
    // Add plague particles to each portrait
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'plague-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        portrait.appendChild(particle);
    }
    
    // Add mouse move parallax effect
    portrait.addEventListener('mousemove', (e) => {
        const rect = portrait.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPos = (x / rect.width - 0.5) * 10;
        const yPos = (y / rect.height - 0.5) * 10;
        
        portrait.style.transform = `perspective(500px) rotateY(${xPos}deg) rotateX(${-yPos}deg)`;
    });
    
    portrait.addEventListener('mouseleave', () => {
        portrait.style.transform = 'perspective(500px) rotateY(0) rotateX(0)';
    });
});

// Add infection spreading effect to character portraits
const style = document.createElement('style');
style.textContent = `
    .plague-particle {
        position: absolute;
        width: 3px;
        height: 3px;
        background: #2d5016;
        border-radius: 50%;
        opacity: 0.7;
        animation: float 5s infinite linear;
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0.7;
        }
        25% {
            transform: translateY(-20px) translateX(10px);
        }
        50% {
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.3;
        }
        75% {
            transform: translateY(-60px) translateX(5px);
        }
        100% {
            transform: translateY(-80px) translateX(-5px);
            opacity: 0;
        }
    }
    
    .infected {
        animation: infectionPulse 0.5s 3;
        position: relative;
    }
    
    .infected::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(139, 0, 0, 0.3) 0%, transparent 70%);
        animation: infectionSpread 2s forwards;
        pointer-events: none;
    }
    
    .spreading {
        position: relative;
        overflow: visible;
    }
    
    .spreading::before {
        content: "";
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        background: radial-gradient(circle, rgba(196, 30, 58, 0.4) 0%, transparent 70%);
        animation: spreadInfection 1.5s forwards;
        border-radius: 8px;
        z-index: -1;
    }
    
    @keyframes infectionPulse {
        0% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(120deg); }
        100% { filter: hue-rotate(0deg); }
    }
    
    @keyframes infectionSpread {
        0% { opacity: 1; transform: scale(0.1); }
        100% { opacity: 0; transform: scale(1.5); }
    }
    
    @keyframes spreadInfection {
        0% { opacity: 0.8; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.3); }
    }
`;

document.head.appendChild(style);

// Add plague sound effects simulation
function playPlagueSound() {
    // In a real implementation, this would play actual sounds
    console.log("Plague sound effect simulated");
}

// Play sound when plague meter updates
setInterval(() => {
    if (Math.random() > 0.7) {
        playPlagueSound();
    }
}, 10000);