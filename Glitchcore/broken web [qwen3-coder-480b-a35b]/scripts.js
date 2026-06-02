// Global variables
let currentLayer = 'layer-404';
let progressInterval;
let corruptionInterval;

// DOM Elements
const layers = document.querySelectorAll('.layer');
const brokenLinks = document.querySelectorAll('.broken-link');
const progressBar = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const resetButton = document.getElementById('reset-button');
const glitchText = document.querySelector('.glitch-text');

// Initialize the experience
document.addEventListener('DOMContentLoaded', function() {
    // Start with the 404 layer active
    showLayer('layer-404');
    
    // Add event listeners to broken links
    brokenLinks.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });
    
    // Add event listener to reset button
    if (resetButton) {
        resetButton.addEventListener('click', resetLabyrinth);
    }
    
    // Add click event to BSOD screen
    const bsodScreen = document.querySelector('.bsod-screen');
    if (bsodScreen) {
        bsodScreen.addEventListener('click', function() {
            showLayer('layer-table');
        });
    }
    
    // Start corruption effects
    startCorruptionEffects();
});

// Handle link clicks in the labyrinth
function handleLinkClick(e) {
    e.preventDefault();
    const targetLayer = this.getAttribute('data-target');
    
    // Add visual feedback
    this.style.color = '#ff0000';
    this.style.textShadow = '0 0 10px #ff0000';
    
    // Simulate loading delay
    setTimeout(() => {
        if (targetLayer === 'layer-loading') {
            showLayer(targetLayer);
            startLoadingAnimation();
        } else {
            showLayer(targetLayer);
        }
    }, 500);
}

// Show a specific layer
function showLayer(layerId) {
    // Hide current layer
    document.getElementById(currentLayer).classList.remove('active');
    
    // Show new layer
    document.getElementById(layerId).classList.add('active');
    currentLayer = layerId;
    
    // Special handling for certain layers
    if (layerId === 'layer-loading') {
        resetProgressBar();
        startLoadingAnimation();
    } else if (layerId === 'layer-treasure') {
        stopAllAnimations();
    }
}

// Start the loading animation
function startLoadingAnimation() {
    let progress = 0;
    const maxProgress = 93; // Never reaches 100%
    
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        if (progress < maxProgress) {
            progress += Math.random() * 3;
            if (progress > maxProgress) progress = maxProgress;
            
            updateProgressBar(progress);
            
            // Occasionally corrupt the progress
            if (Math.random() > 0.7) {
                corruptProgressBar();
            }
        } else {
            // When "finished", reveal the treasure if user found the secret
            if (document.querySelector('.hidden-message').style.opacity !== '0') {
                setTimeout(() => {
                    showLayer('layer-treasure');
                }, 1000);
            }
        }
    }, 200);
}

// Update progress bar
function updateProgressBar(percent) {
    if (progressBar && progressText) {
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${Math.floor(percent)}%`;
    }
}

// Corrupt the progress bar
function corruptProgressBar() {
    if (progressBar) {
        progressBar.style.background = `linear-gradient(90deg, 
            #${Math.floor(Math.random()*16777215).toString(16)}, 
            #${Math.floor(Math.random()*16777215).toString(16)})`;
    }
}

// Reset progress bar
function resetProgressBar() {
    if (progressBar && progressText) {
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        progressBar.style.background = 'linear-gradient(90deg, var(--terminal-green), #00cc00)';
    }
}

// Start corruption effects
function startCorruptionEffects() {
    // Glitch text effect
    setInterval(() => {
        if (glitchText) {
            glitchText.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
            setTimeout(() => {
                if (glitchText) {
                    glitchText.style.transform = 'translate(0, 0)';
                }
            }, 100);
        }
    }, 3000);
    
    // Random corruption events
    corruptionInterval = setInterval(() => {
        const randomEvent = Math.floor(Math.random() * 4);
        
        switch(randomEvent) {
            case 0:
                // Corrupt a random link
                corruptRandomLink();
                break;
            case 1:
                // Shuffle table data
                shuffleTableData();
                break;
            case 2:
                // Flicker screen
                flickerScreen();
                break;
            case 3:
                // Corrupt image
                corruptImage();
                break;
        }
    }, 5000);
}

// Corrupt a random link
function corruptRandomLink() {
    const links = Array.from(document.querySelectorAll('.broken-link'));
    if (links.length > 0) {
        const randomLink = links[Math.floor(Math.random() * links.length)];
        randomLink.textContent = generateRandomString(8) + '.html';
        
        setTimeout(() => {
            randomLink.textContent = randomLink.textContent.replace('.html', '');
        }, 1000);
    }
}

// Shuffle table data
function shuffleTableData() {
    const tableCells = document.querySelectorAll('.corrupted-table td');
    tableCells.forEach(cell => {
        if (Math.random() > 0.7 && cell.textContent !== '...') {
            cell.textContent = generateRandomString(5);
        }
    });
}

// Flicker screen effect
function flickerScreen() {
    const activeLayer = document.querySelector('.layer.active');
    if (activeLayer) {
        activeLayer.style.opacity = '0.3';
        setTimeout(() => {
            activeLayer.style.opacity = '1';
        }, 100);
    }
}

// Corrupt image
function corruptImage() {
    const brokenImage = document.querySelector('.broken-image');
    if (brokenImage) {
        brokenImage.style.filter = `blur(${Math.random() * 5}px) hue-rotate(${Math.random() * 360}deg)`;
    }
}

// Generate random string for corruption effects
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Stop all animations
function stopAllAnimations() {
    clearInterval(progressInterval);
    clearInterval(corruptionInterval);
}

// Reset the labyrinth
function resetLabyrinth() {
    stopAllAnimations();
    showLayer('layer-404');
    resetProgressBar();
    startCorruptionEffects();
    
    // Reset link texts
    const originalLinks = [
        { selector: '[data-target="layer-bsod"]', text: 'home.html' },
        { selector: '[data-target="layer-table"]', text: 'archive.php' },
        { selector: '[data-target="layer-loading"]', text: 'secret.txt' }
    ];
    
    originalLinks.forEach(link => {
        const el = document.querySelector(link.selector);
        if (el) el.textContent = link.text;
    });
    
    // Reset hidden message
    const hiddenMessage = document.querySelector('.hidden-message');
    if (hiddenMessage) {
        hiddenMessage.style.opacity = '1';
        hiddenMessage.textContent = 'Hidden path: /treasure';
    }
}

// Secret path detection
document.addEventListener('keydown', function(e) {
    // If user types "/treasure" show the treasure layer
    if (e.key === '/' && currentLayer === 'layer-table') {
        let inputSequence = '/';
        const handler = function(e) {
            inputSequence += e.key;
            if (inputSequence === '/treasure') {
                document.removeEventListener('keydown', handler);
                // Reveal the hidden message visually
                const hiddenMessage = document.querySelector('.hidden-message');
                if (hiddenMessage) {
                    hiddenMessage.style.color = 'gold';
                    hiddenMessage.style.fontWeight = 'bold';
                    hiddenMessage.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
                    
                    // After a delay, show treasure
                    setTimeout(() => {
                        showLayer('layer-treasure');
                    }, 2000);
                }
            } else if (!'/treasure'.startsWith(inputSequence)) {
                document.removeEventListener('keydown', handler);
            }
        };
        document.addEventListener('keydown', handler);
    }
});