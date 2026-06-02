// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Get all view detail buttons
    const viewButtons = document.querySelectorAll('.view-details-btn');
    const modal = document.getElementById('character-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    // Get modal elements to update
    const modalName = modal.querySelector('.character-name');
    const modalFaction = modal.querySelector('.faction-badge');
    const modalDescription = modal.querySelector('.character-description');
    const modalPortrait = modal.querySelector('.large-placeholder');
    const mutationFill = modal.querySelector('.mutation-bar .mutation-fill');
    const contaminationFill = modal.querySelector('.contamination-gauge .gauge-fill');
    
    // Character data
    const characters = {
        1: {
            name: "Neon Vex",
            faction: "SYNTH",
            description: "A rogue bio-hacker who escaped from Corporate Enclave labs. Neon Vex has integrated advanced neural interfaces that allow direct control of biotech systems. Their body is a living laboratory of experimental modifications.",
            mutationLevel: 75,
            contamination: 60,
            factionClass: "synth-rebellion"
        },
        2: {
            name: "Dr. Mycelia",
            faction: "FUNGI",
            description: "Former mycologist turned into a symbiotic being with fungal networks. Dr. Mycelia can communicate with plant life and manipulate spores for both healing and warfare. Her consciousness occasionally merges with the fungal collective.",
            mutationLevel: 90,
            contamination: 85,
            factionClass: "fungal-consortium"
        },
        3: {
            name: "Chrome Talon",
            faction: "CORP",
            description: "Elite enforcer of the Corporate Enclave with extensive cybernetic enhancements. Chrome Talon believes in order through technological supremacy and views uncontrolled mutations as a threat to civilization.",
            mutationLevel: 30,
            contamination: 20,
            factionClass: "corporate-enclave"
        },
        4: {
            name: "Spore Runner",
            faction: "WASTE",
            description: "Nomadic survivor who has adapted to thrive in the most contaminated zones. Spore Runner's body produces beneficial spores that purify air and water, making them invaluable to wasteland communities.",
            mutationLevel: 55,
            contamination: 40,
            factionClass: "wasteland-nomad"
        }
    };
    
    // Add event listeners to view buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.character-card');
            const characterId = card.getAttribute('data-character-id');
            const character = characters[characterId];
            
            // Update modal content
            modalName.textContent = character.name;
            modalFaction.textContent = character.faction;
            modalFaction.className = `faction-badge ${character.factionClass}`;
            modalDescription.textContent = character.description;
            
            // Update stats
            mutationFill.style.width = `${character.mutationLevel}%`;
            contaminationFill.style.height = `${character.contamination}%`;
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when close button is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Animate skill rings
    const skillRings = document.querySelectorAll('.skill-ring');
    skillRings.forEach(ring => {
        const value = ring.getAttribute('data-value');
        ring.style.setProperty('--value', `${value}%`);
        
        // Add animation delay for staggered effect
        const index = Array.from(skillRings).indexOf(ring);
        ring.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add hover effect to character cards
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animate DNA strands
    function createDNAElements() {
        const dnaStrands = document.querySelectorAll('.dna-strand');
        dnaStrands.forEach(strand => {
            strand.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                const dot = document.createElement('span');
                dot.style.left = `${i * 5}%`;
                dot.style.animationDelay = `${i * 0.1}s`;
                strand.appendChild(dot);
            }
        });
    }
    
    createDNAElements();
    
    // Add floating animation to portraits
    const portraits = document.querySelectorAll('.pixel-portrait');
    portraits.forEach(portrait => {
        portrait.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 10;
            const moveY = (y - centerY) / 10;
            
            this.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        portrait.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
});