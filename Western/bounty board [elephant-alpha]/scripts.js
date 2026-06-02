// scripts.js

// Document ready state
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initRevolverNavigation();
    initTumbleweedAnimation();
    initPosterInteractions();
    initDispatchNotifications();
    initSmoothScrolling();
    initHoverEffects();
});

// Revolver cylinder navigation spinner
function initRevolverNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const cylinderHoles = document.querySelectorAll('.cylinder-hole');
    let currentSelection = 0;
    
    // Set initial active selection
    navItems[currentSelection].classList.add('active');
    
    // Handle navigation item clicks
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
            
            // Rotate cylinder to selected position
            rotateCylinder(index);
        });
    });
    
    // Rotate cylinder animation
    function rotateCylinder(targetIndex) {
        const cylinder = document.querySelector('.revolver-cylinder');
        const rotationAngle = (targetIndex * 60) - (currentSelection * 60);
        
        // Add rotation animation
        cylinder.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        cylinder.style.transform = `rotate(${rotationAngle}deg)`;
        
        // Reset after animation
        setTimeout(() => {
            cylinder.style.transition = 'none';
            cylinder.style.transform = 'rotate(0deg)';
        }, 1000);
        
        currentSelection = targetIndex;
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentSelection + 1) % navItems.length;
            navItems[nextIndex].click();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = currentSelection === 0 ? navItems.length - 1 : currentSelection - 1;
            navItems[prevIndex].click();
        }
    });
}

// Animated tumbleweed
function initTumbleweedAnimation() {
    const body = document.body;
    
    // Create tumbleweed elements periodically
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance to create tumbleweed
            createTumbleweed();
        }
    }, 8000);
    
    function createTumbleweed() {
        const tumbleweed = document.createElement('div');
        tumbleweed.className = 'tumbleweed';
        tumbleweed.innerHTML = '🌪️';
        
        // Random properties
        const startPosition = Math.random() * window.innerWidth;
        const duration = 8 + Math.random() * 12; // 8-20 seconds
        const size = 20 + Math.random() * 15; // 20-35px
        const rotation = Math.random() * 360;
        
        // Set styles
        tumbleweed.style.cssText = `
            position: fixed;
            top: ${-50}px;
            left: ${startPosition}px;
            font-size: ${size}px;
            animation: tumbleweedFall ${duration}s linear forwards;
            z-index: 1000;
            pointer-events: none;
            opacity: 0.7;
            filter: grayscale(0.5);
        `;
        
        // Add rotation animation
        tumbleweed.style.animation += `, tumbleweedRotate ${duration}s linear forwards`;
        tumbleweed.style.setProperty('--rotation-angle', `${rotation}deg`);
        
        body.appendChild(tumbleweed);
        
        // Create CSS animation dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tumbleweedFall {
                to {
                    transform: translateX(${Math.random() * 300 - 150}px) translateY(${window.innerHeight + 100}px);
                    opacity: 0;
                }
            }
            @keyframes tumbleweedRotate {
                to {
                    transform: rotate(${rotation * 10}deg);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remove element after animation
        setTimeout(() => {
            if (tumbleweed.parentNode) {
                tumbleweed.parentNode.removeChild(tumbleweed);
            }
            // Remove dynamic style after a while
            if (style.parentNode) {
                setTimeout(() => {
                    if (style.parentNode) style.parentNode.removeChild(style);
                }, 1000);
            }
        }, duration * 1000);
    }
}

// Interactive poster effects
function initPosterInteractions() {
    const posterCards = document.querySelectorAll('.poster-card');
    
    posterCards.forEach(card => {
        // Mouse enter effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(-3deg) scale(1.02)';
            this.style.zIndex = '10';
        });
        
        // Mouse leave effect
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
            this.style.zIndex = '1';
        });
        
        // Click to report (simulated)
        const reportBtn = card.querySelector('.report-btn');
        reportBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.textContent = '✓ Reported!';
            this.style.background = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = 'Report Sighting';
                this.style.background = 'var(--ink-black)';
            }, 2000);
        });
    });
    
    // Add mouse move parallax effect to posters
    document.addEventListener('mousemove', function(e) {
        const posters = document.querySelectorAll('.poster-card');
        const x = (window.innerWidth - e.pageX * 2) / 50;
        const y = (window.innerHeight - e.pageY * 2) / 50;
        
        posters.forEach((poster, index) => {
            // Stagger the effect for each poster
            const delay = index * 0.02;
            setTimeout(() => {
                poster.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
            }, delay * 1000);
        });
    });
    
    // Reset transform when mouse leaves document
    document.addEventListener('mouseleave', function() {
        posterCards.forEach(card => {
            card.style.transform = '';
        });
    });
}

// Sheriff's dispatch notifications
function initDispatchNotifications() {
    const dispatchEntries = document.querySelectorAll('.dispatch-entry');
    
    // Highlight new entries on page load
    dispatchEntries.forEach((entry, index) => {
        setTimeout(() => {
            entry.style.borderLeftColor = '#FFD700';
            entry.style.animation = 'dispatchPulse 1s ease-in-out 3';
            
            setTimeout(() => {
                entry.style.borderLeftColor = '#8b0000';
                entry.style.animation = 'dispatchPulse 2s ease-in-out infinite';
            }, 3000);
        }, index * 500);
    });
    
    // Simulate new dispatch arrival
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 30 seconds
            addNewDispatch();
        }
    }, 30000);
}

function addNewDispatch() {
    const dispatchLog = document.querySelector('.dispatch-log');
    const messages = [
        {
            sender: 'Ranch Hand Joe',
            location: 'Ponderosa',
            message: 'Cattle rustling reported near the northern pasture. Three suspicious riders spotted.'
        },
        {
            sender: 'Stage Station 4',
            location: 'Dry Creek',
            message: 'Stagecoach delayed by roadblock. Bandits demanding valuables.'
        },
        {
            sender: 'Sheriff Deputy',
            location: 'Silverton',
            message: 'Requesting backup for high-value prisoner transport. Prisoner becoming unruly.'
        }
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const newEntry = document.createElement('div');
    newEntry.className = 'dispatch-entry new';
    newEntry.innerHTML = `
        <div class="dispatch-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        <div class="dispatch-content">
            <div class="dispatch-header">
                <span class="dispatch-sender">${randomMessage.sender}</span>
                <span class="dispatch-location">${randomMessage.location}</span>
            </div>
            <p class="dispatch-message">${randomMessage.message}</p>
        </div>
    `;
    
    dispatchLog.insertBefore(newEntry, dispatchLog.firstChild);
    
    // Remove old entries if too many
    while (dispatchLog.children.length > 8) {
        dispatchLog.removeChild(dispatchLog.lastChild);
    }
    
    // Animate new entry
    setTimeout(() => {
        newEntry.classList.remove('new');
    }, 2000);
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced hover effects
function initHoverEffects() {
    // Add subtle hover effects to all interactive elements
    const interactiveElements = document.querySelectorAll('.nav-item, .report-btn, .poster-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.cursor = 'default';
        });
    });
    
    // Typing effect for title
    const mainTitle = document.querySelector('.main-title');
    const originalText = mainTitle.textContent;
    mainTitle.style.opacity = '0';
    
    setTimeout(() => {
        typeWriter(mainTitle, originalText, 0, () => {
            // Animation complete
        });
    }, 1000);
}

// Typewriter effect
function typeWriter(element, text, index, callback) {
    if (index < text.length) {
        element.textContent = text.substring(0, index + 1);
        setTimeout(() => {
            typeWriter(element, text, index + 1, callback);
        }, 100);
    } else {
        element.style.opacity = '1';
        if (callback) callback();
    }
}

// Add dynamic CSS for tumbleweed animations
const tumbleweedStyle = document.createElement('style');
tumbleweedStyle.textContent = `
    @keyframes tumbleweedFall {
        to {
            transform: translateX(var(--tumble-x, 100px)) translateY(110vh) rotate(var(--rotation-angle, 360deg));
            opacity: 0;
        }
    }
    @keyframes tumbleweedRotate {
        to {
            transform: rotate(720deg);
        }
    }
`;
document.head.appendChild(tumbleweedStyle);

// Handle window resize
window.addEventListener('resize', function() {
    // Reset any transforms on resize
    document.querySelectorAll('.poster-card').forEach(card => {
        card.style.transform = '';
    });
});

// Add ambient sound effects on hover (visual only, no actual audio)
document.querySelectorAll('.poster-card, .nav-item').forEach(element => {
    element.addEventListener('mouseenter', function() {
        // Could add visual "glow" or other effects here
        this.style.boxShadow = '0 0 20px rgba(212, 168, 67, 0.3)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// Simulate real-time dispatch updates
setInterval(() => {
    // Random chance to update dispatch times
    const dispatchTimes = document.querySelectorAll('.dispatch-time');
    if (dispatchTimes.length > 0 && Math.random() > 0.95) {
        const randomTime = dispatchTimes[Math.floor(Math.random() * dispatchTimes.length)];
        randomTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}, 60000); // Update every minute