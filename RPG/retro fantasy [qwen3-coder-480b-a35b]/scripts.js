// scripts.js

// Stat card animations
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const value = this.querySelector('.stat-value');
        const originalText = value.textContent;
        
        // Animate the stat value
        let newValue = parseInt(originalText) || originalText;
        if (!isNaN(newValue)) {
            value.textContent = newValue + 1;
            setTimeout(() => {
                value.textContent = originalText;
            }, 300);
        }
    });
});

// Quest card drag simulation
document.querySelectorAll('.quest-card').forEach(card => {
    card.addEventListener('mousedown', function(e) {
        this.style.cursor = 'grabbing';
        this.style.transform = 'translateY(-5px) rotate(2deg)';
        this.style.boxShadow = '8px 8px 20px rgba(0,0,0,0.4)';
    });
    
    card.addEventListener('mouseup', function() {
        this.style.cursor = 'grab';
        this.style.transform = '';
        this.style.boxShadow = '';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.cursor = 'grab';
        this.style.transform = '';
        this.style.boxShadow = '';
    });
});

// Spellbook page turning
const spellbook = document.getElementById('spellbook');
const turnButton = document.getElementById('turnPage');
let isFlipped = false;

turnButton.addEventListener('click', function() {
    if (!isFlipped) {
        spellbook.style.transform = 'rotateY(-180deg)';
        turnButton.textContent = 'Previous Page';
    } else {
        spellbook.style.transform = 'rotateY(0deg)';
        turnButton.textContent = 'Next Page';
    }
    isFlipped = !isFlipped;
});

// Spell item interaction
document.querySelectorAll('.spells-list li').forEach(spell => {
    spell.addEventListener('click', function() {
        this.style.backgroundColor = 'rgba(201, 166, 66, 0.4)';
        this.style.fontWeight = 'bold';
        
        setTimeout(() => {
            this.style.backgroundColor = '';
            this.style.fontWeight = '';
        }, 1000);
    });
});

// Inventory item interaction
document.querySelectorAll('.inventory-item').forEach(item => {
    item.addEventListener('click', function() {
        this.style.transform = 'scale(1.2)';
        this.style.boxShadow = '0 0 20px rgba(201, 166, 66, 0.8)';
        
        setTimeout(() => {
            this.style.transform = '';
            this.style.boxShadow = '';
        }, 500);
    });
});

// Initial animations on page load
window.addEventListener('load', function() {
    // Animate section titles
    document.querySelectorAll('.section-title').forEach((title, index) => {
        setTimeout(() => {
            title.style.opacity = '0';
            title.style.transform = 'translateY(-20px)';
            title.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 100);
        }, index * 300);
    });
    
    // Animate quest cards
    document.querySelectorAll('.quest-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + index * 100);
    });
});