// ==========================================================================
// WHISPERING WILLOW HERBAL - INTERACTIVE FUNCTIONALITY
// A whimsical herbalist's recipe book with immersive interactions
// ==========================================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initPreloader();
    initThemeToggle();
    initRecipeCards();
    initForagingWheel();
    initFlowerGallery();
    initMoonPhase();
    initNoteSubmission();
    initFloatingHerbs();
    initSeasonalDetails();
    initScrollAnimations();
});

// ==========================================================================
// PRELOADER WITH BUBBLING CAULDRON ANIMATION
// ==========================================================================

function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    // Hide preloader after 2 seconds (simulating content load)
    setTimeout(() => {
        preloader.classList.add('hidden');
        
        // Remove from DOM after transition completes
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, 2000);
}

// ==========================================================================
// MOTH & CANDLE THEME TOGGLE
// ==========================================================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to 'day'
    const savedTheme = localStorage.getItem('whispering-willow-theme') || 'day';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    // Update toggle position based on saved theme
    updateTogglePosition(savedTheme);
    
    // Add click event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'day' ? 'night' : 'day';
        
        // Update theme attribute
        htmlElement.setAttribute('data-theme', newTheme);
        
        // Save preference to localStorage
        localStorage.setItem('whispering-willow-theme', newTheme);
        
        // Update toggle position
        updateTogglePosition(newTheme);
        
        // Add subtle transition effect
        document.body.style.transition = 'background-color 0.8s ease, color 0.8s ease';
        
        // Play theme change sound (optional - would need audio file)
        playThemeChangeSound(newTheme);
    });
    
    // Add keyboard accessibility
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });
}

function updateTogglePosition(theme) {
    // Visual feedback already handled by CSS transitions
    console.log(`Theme changed to: ${theme}`);
}

function playThemeChangeSound(theme) {
    // In a real implementation, you would play a subtle sound effect
    // For now, we'll just log it
    console.log(`${theme === 'night' ? 'Moth' : 'Candle'} sound would play here`);
}

// ==========================================================================
// EXPANDABLE RECIPE CARDS WITH HANDWRITTEN INSTRUCTIONS
// ==========================================================================

function initRecipeCards() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    const expandButtons = document.querySelectorAll('.recipe-expand-btn');
    
    recipeCards.forEach((card, index) => {
        // Add staggered entrance animation
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 150);
        
        // Add hover effect for ingredients list
        const ingredientsList = card.querySelector('.ingredients-list');
        if (ingredientsList) {
            ingredientsList.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            ingredientsList.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        }
    });
    
    // Expand/collapse functionality for recipe instructions
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.recipe-card');
            const instructions = card.querySelector('.instructions-text');
            const icon = this.querySelector('i');
            
            if (instructions.style.maxHeight && instructions.style.maxHeight !== '0px') {
                // Collapse
                instructions.style.maxHeight = '0';
                instructions.style.opacity = '0';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
                this.textContent = 'Brew Instructions ';
            } else {
                // Expand
                instructions.style.maxHeight = instructions.scrollHeight + 'px';
                instructions.style.opacity = '1';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                this.textContent = 'Collapse Instructions ';
                
                // Add handwriting animation effect
                animateHandwriting(instructions);
            }
            
            // Add a visual feedback effect on the card
            card.classList.add('recipe-expanded');
            setTimeout(() => {
                card.classList.remove('recipe-expanded');
            }, 500);
        });
    });
}

function animateHandwriting(element) {
    const originalText = element.textContent;
    element.textContent = '';
    
    // Create typing effect
    let i = 0;
    const typingSpeed = 30; // ms per character
    
    function typeWriter() {
        if (i < originalText.length) {
            element.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, typingSpeed);
        }
    }
    
    // Only animate if the text isn't too long
    if (originalText.length < 300) {
        typeWriter();
    } else {
        element.textContent = originalText;
    }
}

// ==========================================================================
// INTERACTIVE SEASONAL FORAGING WHEEL
// ==========================================================================

function initForagingWheel() {
    const wheel = document.getElementById('foragingWheel');
    const spinButton = document.getElementById('spinWheel');
    const currentSeasonElement = document.getElementById('currentSeason');
    const seasonIllustration = document.getElementById('seasonIllustration');
    const seasonTips = document.getElementById('seasonTips');
    
    // Seasonal data
    const seasons = {
        spring: {
            name: 'Spring',
            color: '#c6e2a6',
            tips: [
                'Look for violets in shaded, damp areas',
                'Harvest nettles with gloves before they flower',
                'Dandelion roots are most potent in early spring',
                'Collect young fern fronds (fiddleheads) in wooded areas',
                'Wild garlic grows abundantly near streams'
            ],
            recipes: ['Nettle Soup', 'Violet Syrup', 'Dandelion Root Tea', 'Wild Garlic Pesto']
        },
        summer: {
            name: 'Summer',
            color: '#f5c97d',
            tips: [
                'Pick lavender just as flowers begin to open',
                'Chamomile is best harvested in the morning after dew evaporates',
                'Elderflowers should be collected on a sunny day',
                'Look for yarrow in meadows and open fields',
                'St. John\'s Wort blooms around midsummer'
            ],
            recipes: ['Elderflower Cordial', 'Lavender Shortbread', 'Chamomile Tisane', 'Summer Berry Elixir']
        },
        autumn: {
            name: 'Autumn',
            color: '#d4a5c2',
            tips: [
                'Rosehips are sweetest after the first frost',
                'Hawthorn berries ripen to a deep red in early autumn',
                'Forage mushrooms only with expert guidance',
                'Collect oak leaves for tannin-rich infusions',
                'Harvest roots like burdock and dandelion as plants die back'
            ],
            recipes: ['Rosehip Jam', 'Hawthorn Berry Tincture', 'Mushroom Broth', 'Autumn Root Brew']
        },
        winter: {
            name: 'Winter',
            color: '#a8d8ea',
            tips: [
                'Evergreen needles make a vitamin C-rich tea',
                'Look for usnea (old man\'s beard) on tree branches',
                'Ivy berries are toxic - use leaves with caution',
                'Pine resin can be collected for salves',
                'Wintergreen leaves retain flavor under snow'
            ],
            recipes: ['Pine Needle Tea', 'Wintergreen Balm', 'Evergreen Smudge', 'Fireside Brew']
        }
    };
    
    // Current wheel rotation state
    let currentRotation = 0;
    let isSpinning = false;
    let currentSeason = 'spring';
    
    // Initialize with spring data
    updateSeasonDisplay('spring');
    
    // Spin button functionality
    spinButton.addEventListener('click', function() {
        if (isSpinning) return;
        
        isSpinning = true;
        spinButton.disabled = true;
        spinButton.textContent = 'Consulting the Seasons...';
        
        // Random rotation (1-4 full rotations plus segment offset)
        const segments = 4;
        const extraRotations = Math.floor(Math.random() * 3) + 2; // 2-4 extra rotations
        const segmentAngle = 360 / segments;
        const targetSegment = Math.floor(Math.random() * segments);
        const targetRotation = (extraRotations * 360) + (targetSegment * segmentAngle);
        
        // Calculate which season we landed on
        const normalizedRotation = targetRotation % 360;
        let landedSeason;
        
        if (normalizedRotation >= 0 && normalizedRotation < 90) landedSeason = 'spring';
        else if (normalizedRotation >= 90 && normalizedRotation < 180) landedSeason = 'summer';
        else if (normalizedRotation >= 180 && normalizedRotation < 270) landedSeason = 'autumn';
        else landedSeason = 'winter';
        
        // Animate the wheel spin
        wheel.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
        wheel.style.transform = `rotate(${targetRotation}deg)`;
        
        // Update current rotation
        currentRotation = targetRotation % 360;
        
        // Update display after spin completes
        setTimeout(() => {
            currentSeason = landedSeason;
            updateSeasonDisplay(landedSeason);
            
            // Reset button
            setTimeout(() => {
                isSpinning = false;
                spinButton.disabled = false;
                spinButton.textContent = 'Spin the Wheel';
            }, 500);
            
            // Add celebration effect
            celebrateSpin(landedSeason);
        }, 3000);
    });
    
    // Keyboard accessibility for wheel
    spinButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Function to update season display
    function updateSeasonDisplay(season) {
        const seasonData = seasons[season];
        
        // Update text
        currentSeasonElement.textContent = seasonData.name;
        
        // Update illustration color
        seasonIllustration.style.backgroundColor = seasonData.color;
        seasonIllustration.style.backgroundImage = `radial-gradient(circle at 30% 30%, ${seasonData.color} 0%, ${darkenColor(seasonData.color, 20)} 100%)`;
        
        // Update tips
        seasonTips.innerHTML = '';
        seasonData.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            seasonTips.appendChild(li);
        });
        
        // Update recipe suggestions
        const recipeSuggestions = document.querySelector('.recipe-suggestions');
        recipeSuggestions.innerHTML = '';
        seasonData.recipes.forEach(recipe => {
            const div = document.createElement('div');
            div.className = 'suggestion';
            div.textContent = recipe;
            recipeSuggestions.appendChild(div);
        });
        
        // Add seasonal ambiance
        updateSeasonalAmbiance(season);
    }
    
    // Helper function to darken a hex color
    function darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        
        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
    
    // Celebration effect when wheel stops
    function celebrateSpin(season) {
        const wheelContainer = document.querySelector('.wheel-container');
        
        // Create floating particles
        for (let i = 0; i < 15; i++) {
            createParticle(wheelContainer, season);
        }
        
        // Play subtle sound (in real implementation)
        console.log(`Celebrating ${season} season!`);
    }
    
    function createParticle(container, season) {
        const particle = document.createElement('div');
        particle.className = 'season-particle';
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = seasons[season].color;
        particle.style.borderRadius = '50%';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.zIndex = '10';
        
        container.appendChild(particle);
        
        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const duration = 1 + Math.random() * 1;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'ease-out'
        });
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }
    
    // Add seasonal ambiance based on selected season
    function updateSeasonalAmbiance(season) {
        // Update background inkblots to match season
        const inkblots = document.querySelectorAll('.inkblot');
        const seasonColor = seasons[season].color;
        
        inkblots.forEach((inkblot, index) => {
            setTimeout(() => {
                inkblot.style.backgroundColor = seasonColor;
                inkblot.style.opacity = '0.05';
            }, index * 200);
        });
        
        // Update subtle soundscape (conceptual)
        console.log(`Playing ${season} ambient sounds`);
    }
}

// ==========================================================================
// PRESSED FLOWERS GALLERY WITH NAVIGATION
// ==========================================================================

function initFlowerGallery() {
    const flowerCards = document.querySelectorAll('.flower-card');
    const prevButton = document.getElementById('prevFlower');
    const nextButton = document.getElementById('nextFlower');
    const currentFlowerElement = document.getElementById('currentFlower');
    const totalFlowersElement = document.getElementById('totalFlowers');
    
    let currentIndex = 0;
    const totalFlowers = flowerCards.length;
    
    // Set total flowers count
    totalFlowersElement.textContent = totalFlowers;
    
    // Initialize gallery
    updateGalleryDisplay();
    
    // Previous button functionality
    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + totalFlowers) % totalFlowers;
        updateGalleryDisplay();
        animateGalleryTransition('prev');
    });
    
    // Next button functionality
    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % totalFlowers;
        updateGalleryDisplay();
        animateGalleryTransition('next');
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
    });
    
    // Add click navigation to flower cards
    flowerCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            currentIndex = index;
            updateGalleryDisplay();
            animateGalleryTransition('direct');
        });
        
        // Add hover effect with slight rotation
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-8px)';
        });
    });
    
    // Update gallery display
    function updateGalleryDisplay() {
        // Update counter
        currentFlowerElement.textContent = currentIndex + 1;
        
        // Highlight current flower
        flowerCards.forEach((card, index) => {
            if (index === currentIndex) {
                card.style.zIndex = '5';
                card.style.boxShadow = '0 20px 40px rgba(44, 24, 16, 0.25)';
            } else {
                card.style.zIndex = '1';
                card.style.boxShadow = '4px 8px 24px rgba(44, 24, 16, 0.15)';
                card.style.opacity = '0.7';
                card.style.transform = 'scale(0.95)';
            }
        });
        
        // Update flower details in a tooltip or sidebar if available
        updateFlowerDetails(currentIndex);
    }
    
    // Animate gallery transition
    function animateGalleryTransition(direction) {
        const galleryGrid = document.querySelector('.gallery-grid');
        
        // Add transition class
        galleryGrid.classList.add('gallery-transition');
        
        // Remove class after animation completes
        setTimeout(() => {
            galleryGrid.classList.remove('gallery-transition');
        }, 500);
        
        // Add direction-specific animation
        if (direction === 'prev' || direction === 'next') {
            // Create a sliding effect
            flowerCards.forEach(card => {
                card.style.transition = 'transform 0.5s ease, opacity 0.5s ease, box-shadow 0.5s ease';
            });
        }
    }
    
    // Update detailed flower information
    function updateFlowerDetails(index) {
        const flowerNames = [
            'Foxglove (Digitalis purpurea)',
            'Forget-Me-Not (Myosotis)',
            'Calendula (Pot Marigold)',
            'Lavender (Lavandula)',
            'Cornflower (Centaurea cyanus)',
            'Wild Rose (Rosa canina)'
        ];
        
        const flowerDescriptions = [
            'A tall, elegant plant with bell-shaped flowers. Toxic but medicinal in careful doses.',
            'Delicate blue flowers symbolizing true love and remembrance. Used in memory tinctures.',
            'Bright orange flowers known for their skin-healing properties. Edible and medicinal.',
            'Fragrant purple spikes with calming properties. Used for sleep and relaxation.',
            'Vibrant blue flowers traditionally used for eye remedies. Edible and decorative.',
            'Fragrant pink flowers followed by vitamin C-rich hips. Heart-tonic and uplifting.'
        ];
        
        // Could update a separate details panel here
        console.log(`Selected: ${flowerNames[index]} - ${flowerDescriptions[index]}`);
    }
    
    // Auto-advance gallery (optional)
    let autoAdvanceInterval;
    
    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            nextButton.click();
        }, 5000); // Advance every 5 seconds
    }
    
    function stopAutoAdvance() {
        clearInterval(autoAdvanceInterval);
    }
    
    // Start auto-advance on load
    startAutoAdvance();
    
    // Pause auto-advance on hover
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.addEventListener('mouseenter', stopAutoAdvance);
    galleryContainer.addEventListener('mouseleave', startAutoAdvance);
}

// ==========================================================================
// ANIMATED MOON PHASE INDICATOR
// ==========================================================================

function initMoonPhase() {
    const moonShade = document.querySelector('.moon-shade');
    const moonText = document.querySelector('.moon-text');
    
    // Moon phases data
    const moonPhases = [
        { name: 'New Moon', shade: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 0 50%)' },
        { name: 'Waxing Crescent', shade: 'polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%)' },
        { name: 'First Quarter', shade: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        { name: 'Waxing Gibbous', shade: 'polygon(0 0, 70% 0, 100% 50%, 70% 100%, 0 100%)' },
        { name: 'Full Moon', shade: 'polygon(0 0, 0 100%, 100% 100%, 100% 0)' },
        { name: 'Waning Gibbous', shade: 'polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%)' },
        { name: 'Last Quarter', shade: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        { name: 'Waning Crescent', shade: 'polygon(0 0, 70% 0, 100% 50%, 70% 100%, 0 100%)' }
    ];
    
    // Simulate moon phase cycle
    let currentPhaseIndex = 1; // Start with Waxing Crescent
    
    function updateMoonPhase() {
        const phase = moonPhases[currentPhaseIndex];
        
        // Update moon shade
        moonShade.style.clipPath = phase.shade;
        
        // Update text
        moonText.textContent = phase.name;
        
        // Update moon note
        const moonNote = document.querySelector('.moon-note');
        const phaseNotes = [
            'Time for new beginnings and setting intentions',
            'Ideal for gathering leafy herbs',
            'Good for starting new projects',
            'Perfect for growth and expansion',
            'Peak energy for rituals and celebrations',
            'Time for release and letting go',
            'Good for completion and reflection',
            'Ideal for rest and intuition'
        ];
        
        moonNote.textContent = phaseNotes[currentPhaseIndex];
        
        // Cycle to next phase
        currentPhaseIndex = (currentPhaseIndex + 1) % moonPhases.length;
    }
    
    // Update moon phase every 10 seconds (for demonstration)
    setInterval(updateMoonPhase, 10000);
    
    // Initial update
    updateMoonPhase();
    
    // Add click interaction to moon
    const moonVisual = document.querySelector('.moon-visual');
    moonVisual.addEventListener('click', function() {
        // Advance phase on click
        currentPhaseIndex = (currentPhaseIndex + 1) % moonPhases.length;
        updateMoonPhase();
        
        // Add visual feedback
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 300);
    });
}

// ==========================================================================
// HANDWRITTEN NOTE SUBMISSION
// ==========================================================================

function initNoteSubmission() {
    const noteInput = document.querySelector('.handwritten-note-input');
    const submitButton = document.querySelector('.note-submit-btn');
    
    // Focus effect for note input
    noteInput.addEventListener('focus', function() {
        this.style.backgroundColor = 'var(--color-parchment)';
        this.style.boxShadow = '0 0 0 3px rgba(122, 155, 118, 0.3)';
        
        // Show writing guide lines
        this.style.backgroundImage = 'linear-gradient(to bottom, transparent 95%, var(--color-border) 95%)';
        this.style.backgroundSize = '100% 30px';
    });
    
    noteInput.addEventListener('blur', function() {
        this.style.backgroundColor = 'var(--color-card)';
        this.style.boxShadow = 'none';
        this.style.backgroundImage = 'none';
    });
    
    // Submit button functionality
    submitButton.addEventListener('click', function() {
        const noteText = noteInput.value.trim();
        
        if (noteText) {
            submitNote(noteText);
            noteInput.value = '';
            
            // Show success feedback
            showNoteFeedback('Note added to grimoire!', 'success');
        } else {
            showNoteFeedback('Please write something first...', 'error');
        }
    });
    
    // Allow Enter key to submit (but Shift+Enter for new line)
    noteInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitButton.click();
        }
    });
    
    function submitNote(text) {
        // In a real application, this would send to a server
        // For now, we'll simulate adding to a local collection
        
        console.log('Note submitted:', text);
        
        // Create a visual representation of the note being added
        createFlyingNote(text);
        
        // Update note counter (if we had one)
        updateNoteCounter();
    }
    
    function createFlyingNote(text) {
        const note = document.createElement('div');
        note.className = 'flying-note';
        note.textContent = text.substring(0, 30) + (text.length > 30 ? '...' : '');
        note.style.position = 'fixed';
        note.style.bottom = '20px';
        note.style.right = '20px';
        note.style.padding = '10px 15px';
        note.style.backgroundColor = 'var(--color-card)';
        note.style.border = '1px solid var(--color-border)';
        note.style.borderRadius = 'var(--border-radius-sm)';
        note.style.fontFamily = 'var(--font-handwriting)';
        note.style.fontSize = '1rem';
        note.style.zIndex = '100';
        note.style.boxShadow = 'var(--shadow-medium)';
        note.style.transform = 'translateY(100px)';
        note.style.opacity = '0';
        
        document.body.appendChild(note);
        
        // Animate note flying up
        note.animate([
            { transform: 'translateY(100px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
        ], {
            duration: 800,
            easing: 'ease-out',
            fill: 'forwards'
        });
        
        // Remove note after animation
        setTimeout(() => {
            note.animate([
                { transform: 'translateY(0)', opacity: 1 },
                { transform: 'translateY(-50px)', opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-in',
                fill: 'forwards'
            });
            
            setTimeout(() => {
                note.remove();
            }, 600);
        }, 2000);
    }
    
    function showNoteFeedback(message, type) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `note-feedback note-feedback-${type}`;
        feedback.textContent = message;
        feedback.style.position = 'fixed';
        feedback.style.top = '20px';
        feedback.style.right = '20px';
        feedback.style.padding = '15px 20px';
        feedback.style.backgroundColor = type === 'success' ? 'var(--color-accent)' : 'var(--color-secondary)';
        feedback.style.color = 'var(--color-parchment)';
        feedback.style.borderRadius = 'var(--border-radius-md)';
        feedback.style.fontFamily = 'var(--font-body)';
        feedback.style.zIndex = '100';
        feedback.style.boxShadow = 'var(--shadow-hard)';
        feedback.style.transform = 'translateX(100%)';
        feedback.style.opacity = '0';
        
        document.body.appendChild(feedback);
        
        // Animate entrance
        feedback.animate([
            { transform: 'translateX(100%)', opacity: 0 },
            { transform: 'translateX(0)', opacity: 1 }
        ], {
            duration: 500,
            easing: 'ease-out',
            fill: 'forwards'
        });
        
        // Remove after delay
        setTimeout(() => {
            feedback.animate([
                { transform: 'translateX(0)', opacity: 1 },
                { transform: 'translateX(100%)', opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-in',
                fill: 'forwards'
            });
            
            setTimeout(() => {
                feedback.remove();
            }, 500);
        }, 3000);
    }
    
    function updateNoteCounter() {
        // In a real app, update a counter of notes
        const counter = document.querySelector('.note-counter');
        if (counter) {
            const currentCount = parseInt(counter.textContent) || 0;
            counter.textContent = currentCount + 1;
        }
    }
}

// ==========================================================================
// FLOATING HERBS ANIMATION ENHANCEMENTS
// ==========================================================================

function initFloatingHerbs() {
    const herbs = document.querySelectorAll('.herb');
    
    herbs.forEach((herb, index) => {
        // Add individual floating patterns
        const duration = 8 + (index * 0.5);
        const delay = index * 0.5;
        
        herb.style.animation = `float-herb ${duration}s infinite ease-in-out ${delay}s`;
        
        // Add interaction
        herb.addEventListener('click', function() {
            // Create particle effect
            createHerbParticle(this.textContent, this.getBoundingClientRect());
            
            // Play subtle sound
            console.log(`Herb clicked: ${this.textContent}`);
        });
        
        // Add tooltip on hover
        herb.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'herb-tooltip';
            tooltip.textContent = getHerbName(this.textContent);
            tooltip.style.position = 'absolute';
            tooltip.style.top = '-30px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.padding = '5px 10px';
            tooltip.style.backgroundColor = 'var(--color-ink)';
            tooltip.style.color = 'var(--color-parchment)';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '0.8rem';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '100';
            
            this.appendChild(tooltip);
        });
        
        herb.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.herb-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    function getHerbName(emoji) {
        const herbMap = {
            '🌿': 'Wild Herb',
            '🌼': 'Chamomile',
            '🌸': 'Cherry Blossom',
            '🍄': 'Forest Mushroom'
        };
        
        return herbMap[emoji] || 'Mystery Plant';
    }
    
    function createHerbParticle(emoji, position) {
        const particle = document.createElement('div');
        particle.textContent = emoji;
        particle.style.position = 'fixed';
        particle.style.left = `${position.left + position.width / 2}px`;
        particle.style.top = `${position.top + position.height / 2}px`;
        particle.style.fontSize = '1.5rem';
        particle.style.zIndex = '100';
        particle.style.pointerEvents = 'none';
        particle.style.transform = 'translate(-50%, -50%) scale(1)';
        
        document.body.appendChild(particle);
        
        // Animate particle
        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: 'translate(-50%, -100px) scale(1.5)', opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }
}

// ==========================================================================
// SEASONAL DETAILS AND AMBIANCE
// ==========================================================================

function initSeasonalDetails() {
    // Update seasonal hint based on time of day
    updateSeasonalHint();
    
    // Update quick reference meters periodically
    setInterval(updateReferenceMeters, 5000);
    
    // Initial update
    updateReferenceMeters();
}

function updateSeasonalHint() {
    const hour = new Date().getHours();
    let hint = '';
    
    if (hour >= 5 && hour < 12) {
        hint = 'Morning dew enhances the potency of fresh herbs.';
    } else if (hour >= 12 && hour < 17) {
        hint = 'Sunlight helps dry herbs quickly while preserving oils.';
    } else if (hour >= 17 && hour < 21) {
        hint = 'Evening is best for harvesting moon-sensitive plants.';
    } else {
        hint = 'Night-blooming flowers reveal their secrets now.';
    }
    
    const hintElement = document.querySelector('.hint-text');
    if (hintElement) {
        // Animate hint change
        hintElement.style.opacity = '0';
        setTimeout(() => {
            hintElement.textContent = hint;
            hintElement.style.opacity = '1';
        }, 300);
    }
}

function updateReferenceMeters() {
    const meters = document.querySelectorAll('.meter-fill');
    
    meters.forEach(meter => {
        // Randomize meter values for demonstration
        const newWidth = Math.floor(Math.random() * 30) + 40; // 40-70%
        meter.style.width = `${newWidth}%`;
        
        // Add color variation
        if (newWidth < 50) {
            meter.style.background = 'linear-gradient(90deg, var(--color-accent), var(--color-highlight))';
        } else if (newWidth < 70) {
            meter.style.background = 'linear-gradient(90deg, var(--color-accent), var(--color-secondary))';
        } else {
            meter.style.background = 'linear-gradient(90deg, var(--color-secondary), var(--color-highlight))';
        }
    });
}

// ==========================================================================
// SCROLL ANIMATIONS AND PARALLAX EFFECTS
// ==========================================================================

function initScrollAnimations() {
    // Add scroll-triggered animations
    const animatedElements = document.querySelectorAll('.recipe-card, .flower-card, .section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add parallax effect to inkblots
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const inkblots = document.querySelectorAll('.inkblot');
        
        inkblots.forEach((inkblot, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            inkblot.style.transform = `translateY(${yPos}px)`;
        });
        
        // Add subtle scale effect to storybook container
        const container = document.querySelector('.storybook-container');
        const scale = 1 - (scrolled * 0.0001);
        container.style.transform = `scale(${Math.max(0.98, scale)})`;
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Add visual feedback on current section
                    highlightCurrentSection(targetId);
                }
            }
        });
    });
}

function highlightCurrentSection(sectionId) {
    // Remove highlight from all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Add highlight to current section
    const currentSection = document.getElementById(sectionId);
    if (currentSection) {
        currentSection.classList.add('active-section');
        
        // Add temporary glow effect
        currentSection.style.boxShadow = '0 0 30px rgba(122, 155, 118, 0.3)';
        setTimeout(() => {
            currentSection.style.boxShadow = '';
        }, 2000);
    }
}

// ==========================================================================
// ADDITIONAL UTILITY FUNCTIONS
// ==========================================================================

// Add CSS for animations triggered by JS
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .recipe-expanded {
        animation: pulse-glow 0.5s ease;
    }
    
    @keyframes pulse-glow {
        0% { box-shadow: var(--shadow-medium); }
        50% { box-shadow: 0 0 25px rgba(122, 155, 118, 0.4); }
        100% { box-shadow: var(--shadow-medium); }
    }
    
    .active-section {
        position: relative;
    }
    
    .active-section::before {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 2px solid var(--color-accent);
        border-radius: var(--border-radius-lg);
        opacity: 0.3;
        pointer-events: none;
        z-index: -1;
        animation: section-glow 2s ease;
    }
    
    @keyframes section-glow {
        0% { opacity: 0; }
        50% { opacity: 0.5; }
        100% { opacity: 0.3; }
    }
    
    .gallery-transition .flower-card {
        transition: transform 0.5s ease, opacity 0.5s ease, box-shadow 0.5s ease !important;
    }
    
    .instructions-text {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height 0.5s ease, opacity 0.5s ease;
    }
`;
document.head.appendChild(style);

// Initialize with a welcoming message
console.log('🌿 The Whispering Willow Herbal grimoire is ready! 🌿');
console.log('May your potions bubble true and your herbs never wilt.');