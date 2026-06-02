// scripts.js

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const progressBar = document.querySelector('.progress');
const exploreBtn = document.getElementById('explore-btn');
const artifact = document.getElementById('main-artifact');
const rotateLeft = document.getElementById('rotate-left');
const rotateRight = document.getElementById('rotate-right');
const zoomIn = document.getElementById('zoom-in');
const zoomOut = document.getElementById('zoom-out');
const themeToggle = document.getElementById('theme-toggle');
const adinkraNav = document.querySelectorAll('.adinkra-nav li');
const storyTranscript = document.getElementById('story-transcript');
const starMap = document.getElementById('star-map');
const artifactCards = document.querySelectorAll('.artifact-card');

// State variables
let currentRotation = 0;
let currentZoom = 1;
let isDarkTheme = true;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading process
    simulateLoading();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize interactive elements
    initHologramViewer();
    initGriotStory();
    initCosmicMap();
});

// Simulate loading process
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                mainContent.classList.add('visible');
                // Start animations after content is visible
                setTimeout(initAnimations, 500);
            }, 500);
        }
        progressBar.style.width = `${progress}%`;
    }, 100);
}

// Set up event listeners
function setupEventListeners() {
    // Explore button
    exploreBtn.addEventListener('click', () => {
        document.getElementById('griot-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Adinkra navigation
    adinkraNav.forEach(item => {
        item.addEventListener('click', function() {
            const symbol = this.getAttribute('data-symbol');
            showNotification(`Navigating to ${symbol} collection...`);
        });
    });
    
    // Artifact cards
    artifactCards.forEach(card => {
        card.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showNotification(`Artifact #${id} details loading...`);
        });
    });
}

// Initialize hologram viewer
function initHologramViewer() {
    rotateLeft.addEventListener('click', () => {
        currentRotation -= 45;
        artifact.style.transform = `rotateY(${currentRotation}deg) scale(${currentZoom})`;
    });
    
    rotateRight.addEventListener('click', () => {
        currentRotation += 45;
        artifact.style.transform = `rotateY(${currentRotation}deg) scale(${currentZoom})`;
    });
    
    zoomIn.addEventListener('click', () => {
        if (currentZoom < 1.5) {
            currentZoom += 0.1;
            artifact.style.transform = `rotateY(${currentRotation}deg) scale(${currentZoom})`;
        }
    });
    
    zoomOut.addEventListener('click', () => {
        if (currentZoom > 0.8) {
            currentZoom -= 0.1;
            artifact.style.transform = `rotateY(${currentRotation}deg) scale(${currentZoom})`;
        }
    });
}

// Initialize griot story
function initGriotStory() {
    // Split transcript into words for animation
    const text = storyTranscript.textContent;
    storyTranscript.innerHTML = '';
    
    const words = text.split(' ');
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        span.style.transition = 'opacity 0.5s ease ' + (index * 0.1) + 's';
        storyTranscript.appendChild(span);
        
        // Trigger animation after a delay
        setTimeout(() => {
            span.style.opacity = '1';
        }, 1000 + (index * 100));
    });
}

// Initialize cosmic map
function initCosmicMap() {
    // Create stars for the map
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starMap.appendChild(star);
    }
    
    // Add constellation lines
    const constellations = [
        [{x: 20, y: 30}, {x: 35, y: 25}, {x: 45, y: 40}],
        [{x: 60, y: 20}, {x: 70, y: 35}, {x: 85, y: 30}],
        [{x: 15, y: 70}, {x: 30, y: 65}, {x: 40, y: 80}, {x: 55, y: 75}]
    ];
    
    constellations.forEach(constellation => {
        const lineGroup = document.createElement('div');
        lineGroup.className = 'constellation';
        
        for (let i = 0; i < constellation.length - 1; i++) {
            const line = document.createElement('div');
            line.className = 'constellation-line';
            line.style.left = `${constellation[i].x}%`;
            line.style.top = `${constellation[i].y}%`;
            line.style.width = `${Math.abs(constellation[i+1].x - constellation[i].x)}%`;
            line.style.height = `${Math.abs(constellation[i+1].y - constellation[i].y)}%`;
            
            // Calculate angle for the line
            const angle = Math.atan2(
                constellation[i+1].y - constellation[i].y,
                constellation[i+1].x - constellation[i].x
            ) * 180 / Math.PI;
            
            line.style.transform = `rotate(${angle}deg)`;
            lineGroup.appendChild(line);
        }
        
        starMap.appendChild(lineGroup);
    });
}

// Toggle theme
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme', !isDarkTheme);
    
    const icon = themeToggle.querySelector('i');
    if (isDarkTheme) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        showNotification('Switched to cosmic theme');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        showNotification('Switched to daylight theme');
    }
}

// Initialize animations
function initAnimations() {
    // Animate section headers
    const headers = document.querySelectorAll('.section-header h2');
    headers.forEach((header, index) => {
        setTimeout(() => {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 500 + (index * 300));
    });
    
    // Animate artifact cards
    artifactCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 1000 + (index * 200));
    });
}

// Show notification
function showNotification(message) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.bottom = '30px';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.bottom = '-50px';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: -50px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(26, 26, 46, 0.9);
        color: var(--accent-gold);
        padding: 15px 30px;
        border-radius: 30px;
        border: 1px solid var(--accent-gold);
        backdrop-filter: blur(10px);
        z-index: 1000;
        opacity: 0;
        transition: all 0.5s ease;
        font-family: 'Raleway', sans-serif;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .star {
        position: absolute;
        background: white;
        border-radius: 50%;
        animation: twinkle 3s infinite;
    }
    
    @keyframes twinkle {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
    }
    
    .constellation-line {
        position: absolute;
        background: rgba(212, 175, 55, 0.3);
        transform-origin: 0 0;
    }
    
    .constellation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
`;
document.head.appendChild(notificationStyles);

// Add scroll animations
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('animate-in');
        }
    });
});

// Add animation classes to sections
const sectionStyles = document.createElement('style');
sectionStyles.textContent = `
    section {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 1s ease, transform 1s ease;
    }
    
    section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(sectionStyles);