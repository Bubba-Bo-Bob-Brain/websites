// scripts.js

// DOM Elements
const mascot = document.getElementById('mascot');
const gachaLever = document.getElementById('gacha-lever');
const capsules = document.querySelectorAll('.capsule');
const prizeDisplay = document.getElementById('prize-display');
const sparkleContainer = document.getElementById('sparkle-container');
const heartsContainer = document.getElementById('hearts-container');
const navLinks = document.querySelectorAll('.nav-link');

// Sample character data for gacha
const characters = [
  { name: "Momo-chan", rarity: "Common", color: "#ffc2cd" },
  { name: "Kira-kun", rarity: "Rare", color: "#c2e9ff" },
  { name: "Neko-hime", rarity: "Epic", color: "#d5c7ff" },
  { name: "Sakura", rarity: "Legendary", color: "#ffdcc2" },
  { name: "Hoshi", rarity: "Common", color: "#c2ffd5" },
  { name: "Tsuki", rarity: "Rare", color: "#fff5c2" }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initMascot();
  initGacha();
  initSparkles();
  initFloatingHearts();
  initNavigation();
});

// 1. Bouncing Mascot with Mouse Tracking
function initMascot() {
  let posX = 0;
  let posY = 0;
  let mouseX = 0;
  let mouseY = 0;
  
  // Set initial position
  mascot.style.left = `${window.innerWidth / 2}px`;
  mascot.style.top = `${100}px`;
  
  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animate mascot towards mouse
  function animateMascot() {
    // Calculate distance to mouse
    posX += (mouseX - mascot.getBoundingClientRect().left - mascot.offsetWidth/2) / 20;
    posY += (mouseY - mascot.getBoundingClientRect().top - mascot.offsetHeight/2) / 20;
    
    // Apply new position with boundary checks
    const maxX = window.innerWidth - mascot.offsetWidth;
    const maxY = window.innerHeight - mascot.offsetHeight;
    
    posX = Math.max(0, Math.min(posX, maxX));
    posY = Math.max(0, Math.min(posY, maxY));
    
    mascot.style.left = `${posX}px`;
    mascot.style.top = `${posY}px`;
    
    requestAnimationFrame(animateMascot);
  }
  
  animateMascot();
}

// 2. Gacha Machine Functionality
function initGacha() {
  gachaLever.addEventListener('click', pullLever);
}

function pullLever() {
  // Add pulled class for animation
  gachaLever.classList.add('pulled');
  
  // Reset capsules
  capsules.forEach(capsule => {
    capsule.classList.remove('revealed');
    capsule.style.background = '';
  });
  
  // Show pulling message
  prizeDisplay.innerHTML = '<p>Pulling the lever... Good luck!</p>';
  
  // Simulate gacha process
  setTimeout(() => {
    // Reveal random capsules
    const shuffled = [...characters].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    capsules.forEach((capsule, index) => {
      setTimeout(() => {
        capsule.classList.add('revealed');
        capsule.style.background = `linear-gradient(135deg, ${selected[index].color}, #ffffff)`;
        
        // Create character element inside capsule
        const charElement = document.createElement('div');
        charElement.className = 'capsule-character';
        charElement.textContent = selected[index].name.charAt(0);
        charElement.style.fontSize = '40px';
        charElement.style.fontWeight = 'bold';
        charElement.style.color = selected[index].color;
        capsule.appendChild(charElement);
      }, 300 * index);
    });
    
    // Display prize after all capsules revealed
    setTimeout(() => {
      const prizeChar = selected[Math.floor(Math.random() * selected.length)];
      displayPrize(prizeChar);
    }, 1500);
    
    // Remove pulled class after animation
    setTimeout(() => {
      gachaLever.classList.remove('pulled');
    }, 1000);
  }, 500);
}

function displayPrize(character) {
  prizeDisplay.innerHTML = `
    <p>You got: <strong>${character.name}</strong> (${character.rarity})!</p>
    <div class="prize-character" style="background: ${character.color}; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 60px; font-weight: bold; color: white;">
      ${character.name.charAt(0)}
    </div>
    <button class="btn-kawaii" id="collect-btn">Collect <i class="fas fa-gift"></i></button>
  `;
  
  // Add collect button event
  document.getElementById('collect-btn').addEventListener('click', () => {
    prizeDisplay.innerHTML = '<p>Character added to your collection! Try again?</p>';
    createFloatingHearts(10);
  });
}

// 3. Sparkle Cursor Effects
function initSparkles() {
  document.addEventListener('mousemove', (e) => {
    createSparkle(e.clientX, e.clientY);
  });
  
  // Also create sparkles randomly
  setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createSparkle(x, y);
  }, 300);
}

function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkleContainer.appendChild(sparkle);
  
  // Remove sparkle after animation
  setTimeout(() => {
    sparkle.remove();
  }, 1000);
}

// 4. Floating Hearts
function initFloatingHearts() {
  // Create initial hearts
  for (let i = 0; i < 15; i++) {
    createFloatingHearts(1);
  }
  
  // Continue creating hearts periodically
  setInterval(() => {
    createFloatingHearts(3);
  }, 2000);
}

function createFloatingHearts(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = '❤';
      
      // Random position at bottom of screen
      const startX = Math.random() * window.innerWidth;
      heart.style.left = `${startX}px`;
      heart.style.bottom = '0px';
      
      // Random size and animation duration
      const size = 16 + Math.random() * 20;
      heart.style.fontSize = `${size}px`;
      heart.style.animationDuration = `${8 + Math.random() * 7}s`;
      
      heartsContainer.appendChild(heart);
      
      // Remove heart after animation
      setTimeout(() => {
        heart.remove();
      }, 15000);
    }, i * 300);
  }
}

// 5. Navigation Highlighting
function initNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Update active class
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // Add sparkle effect on click
      const rect = this.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createSparkle(
            x + (Math.random() - 0.5) * 50,
            y + (Math.random() - 0.5) * 30
          );
        }, i * 100);
      }
    });
  });
}

// 6. Additional Interactive Elements
// Add hover sparkles to buttons
document.querySelectorAll('.btn-kawaii').forEach(button => {
  button.addEventListener('mouseenter', function(e) {
    const rect = this.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        createSparkle(
          rect.left + Math.random() * rect.width,
          rect.top + Math.random() * rect.height
        );
      }, i * 50);
    }
  });
});

// Add floating hearts on featured card hover
document.querySelectorAll('.featured-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    createFloatingHearts(5);
  });
});

// Add sparkle effect to section titles on hover
document.querySelectorAll('.section-title').forEach(title => {
  title.addEventListener('mouseenter', function() {
    const rect = this.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        createSparkle(
          rect.left + Math.random() * rect.width,
          rect.top + Math.random() * rect.height
        );
      }, i * 100);
    }
  });
});