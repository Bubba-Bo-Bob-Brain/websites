// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the character gallery
    initializeGallery();
    
    // Add scanning effect to cards
    addScanningEffect();
    
    // Add mutation level visualization
    visualizeMutationLevels();
    
    // Add interactive hover effects
    addInteractiveEffects();
});

function initializeGallery() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach((card, index) => {
        // Add staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
        
        // Add data attributes for interactivity
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
    
    // Add glitch effect to random cards
    addGlitchEffect();
}

function addScanningEffect() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (x - centerX) / 20;
            const angleY = (y - centerY) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${angleY}deg) rotateY(${angleX}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

function visualizeMutationLevels() {
    const mutationBars = document.querySelectorAll('.stat-fill');
    
    mutationBars.forEach(bar => {
        const width = bar.style.width;
        const percentage = parseInt(width);
        
        // Add glow effect based on mutation level
        if (percentage > 70) {
            bar.style.boxShadow = '0 0 15px var(--mutation-5), 0 0 30px var(--mutation-5)';
        } else if (percentage > 40) {
            bar.style.boxShadow = '0 0 10px var(--mutation-3), 0 0 20px var(--mutation-3)';
        } else {
            bar.style.boxShadow = '0 0 5px var(--neon-green)';
        }
        
        // Animate the bar fill
        bar.style.transition = 'width 1.5s ease-out';
    });
}

function addInteractiveEffects() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach(card => {
        // Add contamination pulse effect
        const contaminationBar = card.querySelector('.contamination-fill');
        if (contaminationBar) {
            const contaminationLevel = parseInt(contaminationBar.style.width);
            if (contaminationLevel > 60) {
                contaminationBar.style.animation = 'pulseRed 2s infinite';
            }
        }
        
        // Add faction color indicator
        const factionValue = card.getAttribute('data-faction');
        if (factionValue) {
            card.style.borderLeft = `4px solid var(--faction-${factionValue})`;
        }
        
        // Add click interaction for detailed view
        card.addEventListener('click', function() {
            const name = this.querySelector('.character-name').textContent;
            const mutation = this.getAttribute('data-mutation');
            const faction = this.getAttribute('data-faction');
            const contamination = this.getAttribute('data-contamination');
            
            // Create detailed info popup
            showCharacterDetails(name, mutation, faction, contamination);
        });
    });
}

function addGlitchEffect() {
    const cards = document.querySelectorAll('.character-card');
    
    // Add random glitch effect to some cards
    cards.forEach((card, index) => {
        if (index % 3 === 0) {
            setInterval(() => {
                if (Math.random() > 0.7) {
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = 'glitchEffect 0.3s';
                    }, 100);
                }
            }, 3000);
        }
    });
}

function showCharacterDetails(name, mutation, faction, contamination) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create detail card
    const detailCard = document.createElement('div');
    detailCard.style.cssText = `
        background: var(--bg-secondary);
        border: 2px solid var(--neon-green);
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        text-align: center;
        position: relative;
        animation: slideUp 0.3s ease;
        box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
    `;
    
    detailCard.innerHTML = `
        <h2 style="color: var(--neon-yellow); margin-bottom: 20px; font-size: 2rem;">${name}</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
                <span style="color: var(--text-secondary); font-size: 0.8rem;">MUTATION</span>
                <div style="color: var(--neon-green); font-size: 1.5rem; font-weight: bold;">${mutation}</div>
            </div>
            <div>
                <span style="color: var(--text-secondary); font-size: 0.8rem;">FACTION</span>
                <div style="color: var(--faction-${faction}); font-size: 1.5rem; font-weight: bold;">${faction.toUpperCase()}</div>
            </div>
            <div>
                <span style="color: var(--text-secondary); font-size: 0.8rem;">CONTAMINATION</span>
                <div style="color: var(--corrosive-red); font-size: 1.5rem; font-weight: bold;">${contamination}%</div>
            </div>
            <div>
                <span style="color: var(--text-secondary); font-size: 0.8rem;">STATUS</span>
                <div style="color: var(--neon-blue); font-size: 1.5rem; font-weight: bold;">ACTIVE</div>
            </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: transparent;
            border: 1px solid var(--neon-green);
            color: var(--neon-green);
            padding: 10px 20px;
            font-family: inherit;
            cursor: pointer;
            margin-top: 15px;
            transition: all 0.3s;
        ">
            CLOSE
        </button>
    `;
    
    overlay.appendChild(detailCard);
    document.body.appendChild(overlay);
    
    // Add close functionality
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(50px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulseRed {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }
    
    @keyframes glitchEffect {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(2px, -2px); }
        60% { transform: translate(-2px, -2px); }
        80% { transform: translate(2px, 2px); }
    }
`;
document.head.appendChild(style);