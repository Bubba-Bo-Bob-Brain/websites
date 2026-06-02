/**
 * THE ORDER OF THE OBSIDIAN VEIL
 * Interactive Ritual Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the various components of the sanctum
    initSealBreak();
    initGrandfatherClock();
    initHierarchyNavigation();
    
    console.log("The ritual has begun. The Veil is thin...");
});

/**
 * 1. THE SEAL BREAK MECHANIC
 * Handles the transition from the invitation to the main interface.
 */
function initSealBreak() {
    var seal = document.getElementById('wax-seal');
    var overlay = document.getElementById('invitation-overlay');
    var mainInterface = document.getElementById('main-interface');

    if (!seal || !overlay || !mainInterface) return;

    seal.addEventListener('click', function() {
        // Add a 'cracked' effect to the seal
        seal.classList.add('cracked');
        
        // Visual feedback: slightly shake the seal
        seal.style.transform = 'scale(0.9) rotate(5deg)';
        
        // After a brief moment of "breaking" the seal, fade out the overlay
        setTimeout(function() {
            overlay.classList.add('fade-out');
            
            // Reveal the main interface once the overlay is gone
            setTimeout(function() {
                overlay.classList.add('hidden');
                mainInterface.classList.remove('hidden');
                
                // Trigger a subtle "shutter" effect to simulate the eye opening
                document.body.style.animation = 'eyeOpen 1s ease-out';
            }, 1500); // Matches the CSS transition time
        }, 600);
    });
}

/**
 * 2. THE GRANDFATHER CLOCK
 * Updates the clock hands to reflect real-time.
 */
function initGrandfatherClock() {
    var hourHand = document.querySelector('.hand.hour');
    var minuteHand = document.querySelector('.hand.minute');
    var secondHand = document.querySelector('.hand.second');

    if (!hourHand || !minuteHand || !secondHand) return;

    function updateClock() {
        var now = new Date();
        
        var seconds = now.getSeconds();
        var minutes = now.getMinutes();
        var hours = now.getHours();

        // Calculate angles
        // Seconds: 6 degrees per second
        var secondAngle = seconds * 6;
        
        // Minutes: 6 degrees per minute + fractional movement from seconds
        var minuteAngle = (minutes * 6) + (seconds * 0.1);
        
        // Hours: 30 degrees per hour + fractional movement from minutes
        var hourAngle = (hours % 12 * 30) + (minutes * 0.5);

        // Apply rotations
        secondHand.style.transform = 'translateX(-50%) rotate(' + secondAngle + 'deg)';
        minuteHand.style.transform = 'translateX(-50%) rotate(' + minuteAngle + 'deg)';
        hourHand.style.transform = 'translateX(-50%) rotate(' + hourAngle + 'deg)';
    }

    // Run immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * 3. THE HIERARCHY NAVIGATION (FILTERING)
 * Allows users to filter members by their arcane circle.
 */
function initHierarchyNavigation() {
    var circleItems = document.querySelectorAll('.circle-item');
    var memberCards = document.querySelectorAll('.member-card');

    if (circleItems.length === 0 || memberCards.length === 0) return;

    for (var i = 0; i < circleItems.length; i++) {
        circleItems[i].addEventListener('click', function() {
            var targetCircle = this.getAttribute('data-circle');

            // 1. Update UI state for navigation items
            for (var j = 0; j < circleItems.length; j++) {
                circleItems[j].classList.remove('active');
            }
            this.classList.add('active');

            // 2. Filter members with a staggered animation effect
            for (var k = 0; k < memberCards.length; k++) {
                var card = memberCards[k];
                var cardSpecialization = card.getAttribute('data-specialization');

                // First, fade all cards out
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';

                // Use a timeout to allow the fade-out to happen before checking logic
                setTimeout(function() {
                    if (targetCircle === 'all' || targetCircle === cardSpecialization) {
                        card.classList.remove('hidden');
                        
                        // Staggered fade-in
                        setTimeout(function() {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            }
        });
    }
}

/**
 * EXTRA: AMBIENT INTERACTION
 * Subtle parallax-like movement on the grain and light based on mouse position
 * to give a sense of physical depth.
 */
document.addEventListener('mousemove', function(e) {
    var x = (e.clientX / window.innerWidth) - 0.5;
    var y = (e.clientY / window.innerHeight) - 0.5;

    var glow = document.querySelector('.gaslight-glow');
    if (glow) {
        // Move the light center slightly with the mouse
        glow.style.background = 'radial-gradient(circle at ' + (50 + (x * 10)) + '% ' + (50 + (y * 10)) + '%, rgba(255, 179, 71, 0.08), transparent 50%)';
    }
});