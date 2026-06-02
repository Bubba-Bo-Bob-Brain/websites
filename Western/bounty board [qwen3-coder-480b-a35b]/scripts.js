// DOM Elements
const revolverChambers = document.querySelectorAll('.chamber');
const contentSections = document.querySelectorAll('.content-section');
const wantedCards = document.querySelectorAll('.wanted-card');
const leftDoor = document.querySelector('.left-door');
const rightDoor = document.querySelector('.right-door');
const revolverNav = document.querySelector('.revolver-nav');
const revolverChambersContainer = document.querySelector('.revolver-chambers');

// Current active section
let currentSection = 'board';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Animate saloon doors on page load
    animateSaloonDoors();
    
    // Set up revolver navigation
    setupRevolverNavigation();
    
    // Add hover effects to wanted cards
    setupWantedCardEffects();
    
    // Start tumbleweed animation
    startTumbleweedAnimation();
    
    // Add click events to wanted cards
    wantedCards.forEach(card => {
        card.addEventListener('click', function() {
            const outlawId = this.getAttribute('data-outlaw');
            highlightOutlaw(outlawId);
        });
    });
});

// Animate saloon doors on page load
function animateSaloonDoors() {
    setTimeout(() => {
        leftDoor.style.transform = 'translateX(-100%)';
        rightDoor.style.transform = 'translateX(100%)';
    }, 500);
}

// Set up revolver navigation
function setupRevolverNavigation() {
    revolverChambers.forEach((chamber, index) => {
        chamber.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            rotateRevolver(index);
            showSection(targetSection);
        });
    });
}

// Rotate revolver to selected chamber
function rotateRevolver(chamberIndex) {
    const rotation = chamberIndex * -60;
    revolverChambersContainer.style.transform = `rotate(${rotation}deg)`;
    
    // Update active chamber
    revolverChambers.forEach((chamber, index) => {
        if (index === chamberIndex) {
            chamber.classList.add('active');
        } else {
            chamber.classList.remove('active');
        }
    });
}

// Show selected content section
function showSection(sectionId) {
    if (currentSection === sectionId) return;
    
    // Hide current section
    document.getElementById(currentSection).classList.remove('active');
    
    // Show new section with animation
    const newSection = document.getElementById(sectionId);
    newSection.classList.add('active');
    
    currentSection = sectionId;
    
    // Add special animation for certain sections
    if (sectionId === 'profiles') {
        animateProfileCards();
    } else if (sectionId === 'dispatch') {
        animateDispatchLog();
    }
}

// Add hover effects to wanted cards
function setupWantedCardEffects() {
    wantedCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateY(5deg) translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
    });
}

// Highlight selected outlaw
function highlightOutlaw(outlawId) {
    // Remove highlight from all cards
    wantedCards.forEach(card => {
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        card.style.transform = 'perspective(1000px) rotateY(0deg)';
    });
    
    // Highlight selected card
    const selectedCard = document.querySelector(`[data-outlaw="${outlawId}"]`);
    if (selectedCard) {
        selectedCard.style.boxShadow = '0 0 20px gold, 0 15px 30px rgba(0, 0, 0, 0.4)';
        selectedCard.style.transform = 'perspective(1000px) rotateY(8deg) translateY(-15px)';
        
        // Scroll to card
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove highlight after delay
        setTimeout(() => {
            selectedCard.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            selectedCard.style.transform = 'perspective(1000px) rotateY(0deg)';
        }, 3000);
    }
}

// Animate profile cards when section is shown
function animateProfileCards() {
    const profileCards = document.querySelectorAll('.profile-card');
    profileCards.forEach((card, index) => {
        // Reset animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Animate with delay
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
    });
}

// Animate dispatch log entries
function animateDispatchLog() {
    const logEntries = document.querySelectorAll('.log-entry');
    logEntries.forEach((entry, index) => {
        // Reset animation
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-20px)';
        
        // Animate with delay
        setTimeout(() => {
            entry.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';
        }, 150 * index);
    });
}

// Start tumbleweed animation with random intervals
function startTumbleweedAnimation() {
    const tumbleweedContainer = document.querySelector('.tumbleweed-container');
    
    // Function to create new tumbleweed
    function createTumbleweed() {
        const newTumbleweed = tumbleweedContainer.cloneNode(true);
        newTumbleweed.style.animationDuration = (20 + Math.random() * 20) + 's';
        newTumbleweed.style.bottom = (10 + Math.random() * 30) + 'px';
        document.body.appendChild(newTumbleweed);
        
        // Remove tumbleweed after animation completes
        setTimeout(() => {
            newTumbleweed.remove();
        }, 30000);
    }
    
    // Create tumbleweeds at random intervals
    setInterval(createTumbleweed, 8000 + Math.random() * 15000);
}

// Add dust particle effect
function createDustParticles() {
    const dustOverlay = document.querySelector('.dust-overlay');
    
    // Create multiple particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = 'rgba(210, 180, 140, 0.7)';
        particle.style.borderRadius = '50%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.pointerEvents = 'none';
        
        dustOverlay.appendChild(particle);
        
        // Animate particle
        animateParticle(particle);
    }
}

// Animate individual dust particle
function animateParticle(particle) {
    const duration = (Math.random() * 20 + 10);
    const xMovement = (Math.random() - 0.5) * 100;
    const yMovement = (Math.random() - 0.5) * 100;
    
    particle.animate([
        { transform: 'translate(0, 0)', opacity: particle.style.opacity },
        { transform: `translate(${xMovement}px, ${yMovement}px)`, opacity: 0 }
    ], {
        duration: duration * 1000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
    });
}

// Initialize dust particles
setTimeout(createDustParticles, 1000);

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // Number keys 1-6 for revolver chambers
    if (e.key >= '1' && e.key <= '6') {
        const chamberIndex = parseInt(e.key) - 1;
        if (chamberIndex < revolverChambers.length) {
            revolverChambers[chamberIndex].click();
        }
    }
    
    // Arrow keys for navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const currentIndex = Array.from(revolverChambers).findIndex(chamber => 
            chamber.getAttribute('data-target') === currentSection);
        let newIndex;
        
        if (e.key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % revolverChambers.length;
        } else {
            newIndex = (currentIndex - 1 + revolverChambers.length) % revolverChambers.length;
        }
        
        revolverChambers[newIndex].click();
    }
});

// Add revolver spin effect on reload
window.addEventListener('load', function() {
    revolverChambersContainer.style.transition = 'transform 1s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
    setTimeout(() => {
        revolverChambersContainer.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            revolverChambersContainer.style.transform = 'rotate(0deg)';
            // Set to first chamber after spin
            setTimeout(() => {
                rotateRevolver(0);
            }, 1000);
        }, 1000);
    }, 1000);
});