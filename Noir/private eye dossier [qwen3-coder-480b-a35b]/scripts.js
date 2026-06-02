// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initCorkboard();
    initLightbox();
    initTypewriterEffects();
    initSmokeTrail();
    initVenetianBlinds();
});

// Corkboard functionality
function initCorkboard() {
    const corkboard = document.querySelector('.corkboard');
    const notes = document.querySelectorAll('.note');
    const pins = document.querySelectorAll('.pin');
    const svg = document.querySelector('.connections');
    const connectTool = document.getElementById('connect-tool');
    const cutTool = document.getElementById('cut-tool');
    const resetBtn = document.getElementById('reset-board');
    
    let selectedTool = 'connect';
    let selectedPin = null;
    let connections = [];
    
    // Set active tool
    connectTool.addEventListener('click', () => {
        selectedTool = 'connect';
        updateToolButtons();
    });
    
    cutTool.addEventListener('click', () => {
        selectedTool = 'cut';
        updateToolButtons();
    });
    
    function updateToolButtons() {
        connectTool.classList.toggle('active', selectedTool === 'connect');
        cutTool.classList.toggle('active', selectedTool === 'cut');
    }
    
    // Reset board
    resetBtn.addEventListener('click', () => {
        // Clear all connections
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
        connections = [];
        
        // Reset note positions
        notes.forEach(note => {
            note.style.top = '';
            note.style.left = '';
            note.style.transform = '';
        });
    });
    
    // Make notes draggable
    notes.forEach(note => {
        let isDragging = false;
        let offsetX, offsetY;
        
        note.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - note.getBoundingClientRect().left;
            offsetY = e.clientY - note.getBoundingClientRect().top;
            note.style.zIndex = '100';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - corkboard.getBoundingClientRect().left - offsetX;
            const y = e.clientY - corkboard.getBoundingClientRect().top - offsetY;
            
            note.style.left = `${x}px`;
            note.style.top = `${y}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            note.style.zIndex = '10';
        });
    });
    
    // Pin interaction
    pins.forEach(pin => {
        pin.addEventListener('click', () => {
            if (selectedTool === 'connect') {
                if (!selectedPin) {
                    // First pin selection
                    selectedPin = pin;
                    pin.style.transform = 'rotate(-45deg) scale(1.3)';
                    pin.style.boxShadow = '0 0 10px var(--noir-accent-red)';
                } else {
                    // Second pin selection - create connection
                    if (selectedPin !== pin) {
                        createConnection(selectedPin, pin);
                    }
                    // Reset selection
                    selectedPin.style.transform = 'rotate(-45deg)';
                    selectedPin.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
                    selectedPin = null;
                }
            } else if (selectedTool === 'cut') {
                // Remove connections involving this pin
                removeConnectionsForPin(pin);
            }
        });
    });
    
    function createConnection(pin1, pin2) {
        const rect1 = pin1.getBoundingClientRect();
        const rect2 = pin2.getBoundingClientRect();
        const boardRect = corkboard.getBoundingClientRect();
        
        const x1 = rect1.left + rect1.width/2 - boardRect.left;
        const y1 = rect1.top + rect1.height/2 - boardRect.top;
        const x2 = rect2.left + rect2.width/2 - boardRect.left;
        const y2 = rect2.top + rect2.height/2 - boardRect.top;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'connection-line');
        line.dataset.pin1 = pin1.dataset.id;
        line.dataset.pin2 = pin2.dataset.id;
        
        svg.appendChild(line);
        connections.push({element: line, pin1: pin1, pin2: pin2});
    }
    
    function removeConnectionsForPin(pin) {
        const toRemove = [];
        connections.forEach((conn, index) => {
            if (conn.pin1 === pin || conn.pin2 === pin) {
                svg.removeChild(conn.element);
                toRemove.push(index);
            }
        });
        
        // Remove in reverse order to maintain indices
        for (let i = toRemove.length - 1; i >= 0; i--) {
            connections.splice(toRemove[i], 1);
        }
    }
}

// Lightbox functionality for evidence photos
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox .close');
    const evidenceItems = document.querySelectorAll('.evidence-item');
    
    evidenceItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const caption = item.querySelector('.caption').textContent;
            
            lightboxImg.src = imgSrc;
            captionText.textContent = caption;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Typewriter text effect
function initTypewriterEffects() {
    const typewriterElements = document.querySelectorAll('.typewriter-text p');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const speed = 30; // typing speed in ms
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Add slight delay for dramatic effect
        setTimeout(typeWriter, Math.random() * 1000 + 500);
    });
}

// Smoke trail cursor effect
function initSmokeTrail() {
    const smokeContainer = document.getElementById('smoke-container');
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        createSmokeParticle();
    });
    
    function createSmokeParticle() {
        const particle = document.createElement('div');
        particle.classList.add('smoke-particle');
        particle.style.left = `${mouseX}px`;
        particle.style.top = `${mouseY}px`;
        
        // Random size and opacity
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        smokeContainer.appendChild(particle);
        
        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 20;
        const duration = Math.random() * 1000 + 1000;
        
        const endX = mouseX + Math.cos(angle) * distance;
        const endY = mouseY + Math.sin(angle) * distance;
        
        particle.animate([
            { 
                transform: `translate(0, 0) scale(1)`,
                opacity: particle.style.opacity
            },
            { 
                transform: `translate(${endX - mouseX}px, ${endY - mouseY}px) scale(0.2)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'ease-out'
        });
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, duration);
    }
}

// Venetian blind animation control
function initVenetianBlinds() {
    const blinds = document.querySelector('.case-file::before');
    // Animation is handled purely in CSS for performance
    // We just ensure it's running
    console.log('Venetian blinds animation active');
}

// Play typewriter sound on keypress simulation
function playTypewriterSound() {
    // In a real implementation, we would play a sound here
    // For this demo, we'll just log to console
    console.log('Typewriter key pressed');
}

// Add subtle random sound effects for atmosphere
function initAtmosphericSounds() {
    // This would play occasional ambient sounds like distant thunder or city noise
    // For this demo, we'll just simulate with console logs
    
    const sounds = [
        () => console.log('Distant thunder rumble'),
        () => console.log('City traffic hum'),
        () => console.log('Paper rustle'),
        () => console.log('Pen scratching')
    ];
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const sound = sounds[Math.floor(Math.random() * sounds.length)];
            sound();
        }
    }, 10000);
}

// Initialize atmospheric sounds
initAtmosphericSounds();