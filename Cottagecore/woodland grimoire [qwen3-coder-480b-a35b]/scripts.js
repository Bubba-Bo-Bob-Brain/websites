// scripts.js

// DOM Elements
const nightModeToggle = document.getElementById('night-mode-toggle');
const body = document.body;
const brewButton = document.getElementById('brew-button');
const resultContent = document.querySelector('.result-content');
const ingredientSlots = document.querySelectorAll('.ingredient-slot');
const ingredients = document.querySelectorAll('.ingredient');
const cauldronDisplay = document.querySelector('.cauldron-display');

// State variables
let isNightMode = false;
let draggedIngredient = null;
let cauldronIngredients = [];

// Night Mode Toggle
nightModeToggle.addEventListener('click', () => {
    isNightMode = !isNightMode;
    body.classList.toggle('night-mode', isNightMode);
    
    // Animate moth wings
    const wings = document.querySelectorAll('.wing');
    wings.forEach(wing => {
        wing.style.transform = isNightMode ? 
            (wing.classList.contains('wing-1') ? 'rotate(-45deg)' : 'rotate(45deg)') : 
            (wing.classList.contains('wing-1') ? 'rotate(-30deg)' : 'rotate(30deg)');
    });
});

// Drag and Drop Functionality for Potion Brewing
ingredients.forEach(ingredient => {
    ingredient.addEventListener('dragstart', (e) => {
        draggedIngredient = ingredient.dataset.name;
        e.dataTransfer.setData('text/plain', draggedIngredient);
        ingredient.style.opacity = '0.5';
    });
    
    ingredient.addEventListener('dragend', () => {
        ingredient.style.opacity = '1';
        draggedIngredient = null;
    });
});

ingredientSlots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-over');
    });
    
    slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
    });
    
    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        
        if (draggedIngredient) {
            // Add visual representation of ingredient to slot
            slot.innerHTML = '';
            const icon = document.createElement('div');
            icon.className = `ingredient-icon ${draggedIngredient}`;
            slot.appendChild(icon);
            
            // Store ingredient in cauldron
            const slotId = slot.id;
            cauldronIngredients[slotId] = draggedIngredient;
        }
    });
});

// Potion Brewing Logic
brewButton.addEventListener('click', () => {
    if (Object.keys(cauldronIngredients).length === 0) {
        resultContent.innerHTML = '<p>Please add ingredients to the cauldron first!</p>';
        return;
    }
    
    // Create brewing effect
    const bubbles = document.querySelectorAll('.bubbles-container > div');
    bubbles.forEach(bubble => {
        bubble.style.animation = 'none';
        setTimeout(() => {
            bubble.style.animation = '';
        }, 10);
    });
    
    // Determine potion based on ingredients
    const potionResult = determinePotion(cauldronIngredients);
    
    // Display result with animation
    resultContent.innerHTML = `<p>Your ${potionResult.name} is ready!</p>
                               <p class="effect">${potionResult.effect}</p>`;
    
    // Clear cauldron after delay
    setTimeout(() => {
        ingredientSlots.forEach(slot => {
            slot.innerHTML = '';
        });
        cauldronIngredients = [];
    }, 5000);
});

// Potion determination logic
function determinePotion(ingredients) {
    const ingredientList = Object.values(ingredients);
    
    // Check for specific combinations
    if (ingredientList.includes('lavender') && ingredientList.includes('rose')) {
        return {
            name: "Love Potion",
            effect: "Attracts affection and harmony"
        };
    }
    
    if (ingredientList.includes('mint') && ingredientList.includes('chamomile')) {
        return {
            name: "Serenity Draught",
            effect: "Brings peace and calm to troubled minds"
        };
    }
    
    if (ingredientList.includes('lavender') && ingredientList.includes('mint')) {
        return {
            name: "Dreamless Sleep Tonic",
            effect: "Ensures deep, restorative slumber"
        };
    }
    
    if (ingredientList.includes('rose') && ingredientList.includes('chamomile')) {
        return {
            name: "Heart's Ease Elixir",
            effect: "Heals emotional wounds and soothes sorrow"
        };
    }
    
    // Default potion for any combination
    return {
        name: "Mystery Brew",
        effect: "Effects unknown - proceed with caution!"
    };
}

// Seasonal Wheel Animation
document.addEventListener('DOMContentLoaded', () => {
    const seasons = document.querySelectorAll('.season');
    
    // Add hover effect to seasons
    seasons.forEach(season => {
        season.addEventListener('mouseenter', () => {
            season.style.transform = 'scale(1.05)';
            season.style.zIndex = '10';
        });
        
        season.addEventListener('mouseleave', () => {
            season.style.transform = 'scale(1)';
            season.style.zIndex = '1';
        });
    });
    
    // Animate floating elements
    animateFloatingElements();
    
    // Initialize cauldron bubbles
    initCauldronBubbles();
});

// Floating elements animation
function animateFloatingElements() {
    const elements = document.querySelectorAll('.floating-flower, .floating-bubble');
    
    elements.forEach(element => {
        // Randomize initial position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        element.style.left = `${startX}%`;
        element.style.top = `${startY}%`;
        
        // Randomize animation duration
        const duration = 15 + Math.random() * 15;
        element.style.animationDuration = `${duration}s`;
        
        // Randomize animation delay
        const delay = Math.random() * 5;
        element.style.animationDelay = `-${delay}s`;
    });
}

// Initialize cauldron bubbles
function initCauldronBubbles() {
    const bubblesContainer = document.querySelector('.cauldron-bubbles');
    
    if (!bubblesContainer) return;
    
    // Clear existing bubbles
    bubblesContainer.innerHTML = '';
    
    // Create new bubbles
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.width = `${5 + Math.random() * 10}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.animationDelay = `${Math.random() * 4}s`;
        bubble.style.animationDuration = `${3 + Math.random() * 3}s`;
        bubblesContainer.appendChild(bubble);
    }
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Add subtle parallax effect to floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const floatingElements = document.querySelector('.floating-elements');
    floatingElements.style.transform = `translateY(${rate}px)`;
});