// The Black Dahlia Files - Case File System
// Main JavaScript for immersive 1940s film noir detective experience

class CaseFileSystem {
    constructor() {
        this.currentTab = 'suspects';
        this.pins = [];
        this.connections = [];
        this.isAddingString = false;
        this.stringStartPin = null;
        this.smokeParticles = [];
        this.typewriterElements = [];
        
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupTypewriterEffects();
        this.setupCorkboard();
        this.setupSmokeTrail();
        this.setupAtmosphericEffects();
        this.setupDeskInteractions();
        this.initializePins();
    }

    // ==================== TAB NAVIGATION ====================
    setupTabNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        const sections = document.querySelectorAll('.content-section');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === target) {
                        section.classList.add('active');
                        this.currentTab = target;
                        
                        // Trigger typewriter effects for newly visible section
                        if (target === 'notes' || target === 'witnesses') {
                            this.triggerTypewriterForSection(target);
                        }
                    }
                });
                
                // Add sound effect
                this.playSound('page-turn');
            });
        });
    }

    // ==================== TYPEWRITER EFFECTS ====================
    setupTypewriterEffects() {
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        this.typewriterElements = Array.from(typewriterElements);
        
        // Initially hide all typewriter text
        this.typewriterElements.forEach(el => {
            el.style.visibility = 'hidden';
            el.dataset.originalText = el.dataset.text;
            el.textContent = '';
        });
        
        // Trigger typewriter for active section
        setTimeout(() => {
            this.triggerTypewriterForSection(this.currentTab);
        }, 500);
    }

    triggerTypewriterForSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const elements = section.querySelectorAll('.typewriter-text');
        elements.forEach((el, index) => {
            setTimeout(() => {
                this.typewriteElement(el);
            }, index * 300);
        });
    }

    typewriteElement(element) {
        const text = element.dataset.originalText;
        const delay = parseInt(element.dataset.delay) || 50;
        
        element.style.visibility = 'visible';
        element.textContent = '';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                
                // Random typing speed for realism
                const randomDelay = delay + Math.random() * 50;
                setTimeout(type, randomDelay);
                
                // Play typewriter sound occasionally
                if (i % 3 === 0) {
                    this.playSound('typewriter');
                }
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        type();
    }

    // ==================== CORKBOARD SYSTEM ====================
    setupCorkboard() {
        const corkboard = document.getElementById('conspiracyBoard');
        
        // Setup pin dragging
        this.setupPinDragging();
        
        // Setup control buttons
        document.getElementById('addPin').addEventListener('click', () => {
            this.addNewPin();
        });
        
        document.getElementById('addString').addEventListener('click', () => {
            this.toggleStringMode();
        });
        
        document.getElementById('clearBoard').addEventListener('click', () => {
            this.clearCorkboard();
        });
        
        // Setup pin click events for string connections
        document.querySelectorAll('.pin').forEach(pin => {
            pin.addEventListener('click', (e) => {
                if (this.isAddingString) {
                    this.handlePinClickForString(pin);
                    e.stopPropagation();
                }
            });
        });
    }

    initializePins() {
        const pins = document.querySelectorAll('.pin');
        pins.forEach(pin => {
            const x = parseInt(pin.dataset.x);
            const y = parseInt(pin.dataset.y);
            
            // Position pin
            pin.style.left = `${x}px`;
            pin.style.top = `${y}px`;
            
            // Store pin data
            this.pins.push({
                id: pin.dataset.id,
                type: pin.dataset.type,
                element: pin,
                x: x,
                y: y
            });
        });
        
        // Draw initial connections
        this.drawInitialConnections();
    }

    setupPinDragging() {
        let draggedPin = null;
        let offsetX, offsetY;
        
        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('.pin') && !this.isAddingString) {
                draggedPin = e.target.closest('.pin');
                const rect = draggedPin.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                draggedPin.style.zIndex = 1000;
                
                this.playSound('pin-grab');
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (draggedPin) {
                const corkboard = document.getElementById('conspiracyBoard');
                const rect = corkboard.getBoundingClientRect();
                
                let newX = e.clientX - rect.left - offsetX;
                let newY = e.clientY - rect.top - offsetY;
                
                // Constrain to corkboard bounds
                newX = Math.max(0, Math.min(newX, rect.width - 20));
                newY = Math.max(0, Math.min(newY, rect.height - 20));
                
                draggedPin.style.left = `${newX}px`;
                draggedPin.style.top = `${newY}px`;
                
                // Update pin data
                const pinId = draggedPin.dataset.id;
                const pin = this.pins.find(p => p.id === pinId);
                if (pin) {
                    pin.x = newX;
                    pin.y = newY;
                }
                
                // Update connections
                this.updateConnections();
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (draggedPin) {
                draggedPin.style.zIndex = '';
                this.playSound('pin-drop');
                draggedPin = null;
            }
        });
    }

    toggleStringMode() {
        this.isAddingString = !this.isAddingString;
        const btn = document.getElementById('addString');
        
        if (this.isAddingString) {
            btn.textContent = 'CANCEL STRING';
            btn.style.background = '#c22e2e';
            document.body.style.cursor = 'crosshair';
            this.stringStartPin = null;
        } else {
            btn.textContent = 'ADD STRING';
            btn.style.background = '';
            document.body.style.cursor = '';
        }
    }

    handlePinClickForString(pin) {
        if (!this.stringStartPin) {
            // First pin selected
            this.stringStartPin = pin;
            pin.style.boxShadow = '0 0 10px #c22e2e';
            this.playSound('pin-select');
        } else {
            // Second pin selected - create connection
            if (this.stringStartPin !== pin) {
                this.createConnection(this.stringStartPin, pin);
                this.playSound('string-connect');
            }
            
            // Reset
            this.stringStartPin.style.boxShadow = '';
            this.stringStartPin = null;
            this.toggleStringMode();
        }
    }

    createConnection(pin1, pin2) {
        const connection = {
            id: `conn_${Date.now()}`,
            pin1: pin1.dataset.id,
            pin2: pin2.dataset.id
        };
        
        this.connections.push(connection);
        this.drawConnection(connection);
    }

    drawConnection(connection) {
        const pin1 = this.pins.find(p => p.id === connection.pin1);
        const pin2 = this.pins.find(p => p.id === connection.pin2);
        
        if (!pin1 || !pin2) return;
        
        const svg = document.getElementById('stringLayer');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        line.setAttribute('x1', pin1.x + 10);
        line.setAttribute('y1', pin1.y + 10);
        line.setAttribute('x2', pin2.x + 10);
        line.setAttribute('y2', pin2.y + 10);
        line.setAttribute('stroke', '#c22e2e');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5,3');
        line.setAttribute('class', 'connection-line');
        line.dataset.connectionId = connection.id;
        
        // Add slight waviness for realism
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midX = (pin1.x + pin2.x) / 2;
        const midY = (pin1.y + pin2.y) / 2;
        const controlX = midX + (Math.random() * 20 - 10);
        const controlY = midY + (Math.random() * 20 - 10);
        
        const d = `M ${pin1.x + 10} ${pin1.y + 10} Q ${controlX} ${controlY} ${pin2.x + 10} ${pin2.y + 10}`;
        path.setAttribute('d', d);
        path.setAttribute('stroke', '#c22e2e');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '5,3');
        path.setAttribute('class', 'connection-path');
        path.dataset.connectionId = connection.id;
        
        svg.appendChild(path);
    }

    drawInitialConnections() {
        // Initial connections for dramatic effect
        const initialConnections = [
            { pin1: 'suspect1', pin2: 'car1' },
            { pin1: 'suspect1', pin2: 'hospital1' },
            { pin1: 'crime1', pin2: 'note1' }
        ];
        
        initialConnections.forEach(conn => {
            this.createConnection(
                document.querySelector(`.pin[data-id="${conn.pin1}"]`),
                document.querySelector(`.pin[data-id="${conn.pin2}"]`)
            );
        });
    }

    updateConnections() {
        // Redraw all connections
        const svg = document.getElementById('stringLayer');
        svg.innerHTML = '';
        
        this.connections.forEach(conn => {
            this.drawConnection(conn);
        });
    }

    addNewPin() {
        const types = ['suspect', 'evidence', 'location'];
        const type = types[Math.floor(Math.random() * types.length)];
        const id = `pin_${Date.now()}`;
        
        // Create pin element
        const pin = document.createElement('div');
        pin.className = 'pin';
        pin.dataset.id = id;
        pin.dataset.type = type;
        pin.dataset.x = '300';
        pin.dataset.y = '300';
        pin.innerHTML = `
            <div class="pin-head"></div>
            <div class="pin-label">NEW ${type.toUpperCase()}</div>
        `;
        
        // Add to corkboard
        document.getElementById('conspiracyBoard').appendChild(pin);
        
        // Add to pins array
        this.pins.push({
            id: id,
            type: type,
            element: pin,
            x: 300,
            y: 300
        });
        
        // Setup dragging for new pin
        this.setupPinDragging();
        
        // Add click handler for string mode
        pin.addEventListener('click', (e) => {
            if (this.isAddingString) {
                this.handlePinClickForString(pin);
                e.stopPropagation();
            }
        });
        
        this.playSound('pin-add');
    }

    clearCorkboard() {
        // Remove all connections
        this.connections = [];
        const svg = document.getElementById('stringLayer');
        svg.innerHTML = '';
        
        // Remove all pins except initial ones
        const pinsToRemove = Array.from(document.querySelectorAll('.pin')).filter(pin => {
            return !['suspect1', 'suspect2', 'suspect3', 'crime1', 'car1', 'note1', 'hospital1'].includes(pin.dataset.id);
        });
        
        pinsToRemove.forEach(pin => pin.remove());
        
        // Reset pins array to initial pins
        this.pins = this.pins.filter(pin => 
            ['suspect1', 'suspect2', 'suspect3', 'crime1', 'car1', 'note1', 'hospital1'].includes(pin.id)
        );
        
        this.playSound('clear-board');
    }

    // ==================== SMOKE CURSOR TRAIL ====================
    setupSmokeTrail() {
        const smokeContainer = document.getElementById('smokeTrail');
        
        document.addEventListener('mousemove', (e) => {
            // Throttle smoke creation
            if (Math.random() > 0.7) {
                this.createSmokeParticle(e.clientX, e.clientY, smokeContainer);
            }
        });
    }

    createSmokeParticle(x, y, container) {
        const particle = document.createElement('div');
        particle.className = 'smoke-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        container.appendChild(particle);
        
        // Random size and duration
        const size = 5 + Math.random() * 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    // ==================== ATMOSPHERIC EFFECTS ====================
    setupAtmosphericEffects() {
        // Random rain intensity
        setInterval(() => {
            const rainOverlay = document.getElementById('rainOverlay');
            rainOverlay.style.opacity = 0.1 + Math.random() * 0.3;
        }, 5000);
        
        // Venetian blind sway animation
        const venetianBlinds = document.getElementById('venetianBlinds');
        let swayAngle = 0;
        let swayDirection = 1;
        
        setInterval(() => {
            swayAngle += 0.5 * swayDirection;
            if (Math.abs(swayAngle) > 3) {
                swayDirection *= -1;
            }
            venetianBlinds.style.transform = `rotateY(${swayAngle}deg)`;
        }, 100);
    }

    // ==================== DESK INTERACTIONS ====================
    setupDeskInteractions() {
        // Cigarette smoke animation
        const cigarette = document.querySelector('.cigarette');
        if (cigarette) {
            setInterval(() => {
                const smokeWisp = cigarette.nextElementSibling;
                if (smokeWisp) {
                    smokeWisp.style.transform = `translateX(-50%) rotate(${Math.random() * 20 - 10}deg)`;
                }
            }, 1000);
        }
        
        // Add hover effects to desk items
        document.querySelectorAll('.ashtray, .coffee-cup, .pencil').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.1)';
                item.style.transition = 'transform 0.3s ease';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
            
            item.addEventListener('click', () => {
                if (item.classList.contains('ashtray')) {
                    this.playSound('ashtray');
                } else if (item.classList.contains('coffee-cup')) {
                    this.playSound('coffee-sip');
                } else if (item.classList.contains('pencil')) {
                    this.playSound('pencil-tap');
                }
            });
        });
    }

    // ==================== SOUND EFFECTS ====================
    playSound(type) {
        // In a real implementation, you would load actual sound files
        // This is a placeholder for sound effect logic
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different sounds for different actions
        switch(type) {
            case 'typewriter':
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
                
            case 'page-turn':
                oscillator.frequency.value = 200;
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
                
            case 'pin-grab':
                oscillator.frequency.value = 1000;
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.05);
                break;
        }
    }

    // ==================== EVIDENCE PHOTO INTERACTIONS ====================
    setupEvidenceInteractions() {
        document.querySelectorAll('.evidence-item').forEach(item => {
            item.addEventListener('click', () => {
                // Enlarge photo on click
                const photo = item.querySelector('.photo-placeholder');
                if (photo) {
                    photo.style.transform = 'scale(1.5)';
                    photo.style.zIndex = '100';
                    photo.style.position = 'relative';
                    
                    setTimeout(() => {
                        photo.style.transform = '';
                        photo.style.zIndex = '';
                        photo.style.position = '';
                    }, 2000);
                }
                
                this.playSound('evidence-view');
            });
        });
    }

    // ==================== CASE FILE ANIMATIONS ====================
    animateCaseFile() {
        // Entrance animations
        const caseHeader = document.querySelector('.case-header');
        caseHeader.style.opacity = '0';
        caseHeader.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            caseHeader.style.transition = 'all 1s ease';
            caseHeader.style.opacity = '1';
            caseHeader.style.transform = 'translateY(0)';
        }, 100);
        
        // Staggered tab appearance
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach((tab, index) => {
            tab.style.opacity = '0';
            tab.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                tab.style.transition = 'all 0.5s ease';
                tab.style.opacity = '1';
                tab.style.transform = 'translateY(0)';
            }, 200 + index * 100);
        });
    }
}

// Initialize the case file system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const caseSystem = new CaseFileSystem();
    
    // Add some final atmospheric touches
    setTimeout(() => {
        // Random flicker effect for noir atmosphere
        setInterval(() => {
            if (Math.random() > 0.95) {
                document.body.style.filter = 'brightness(0.95)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 50);
            }
        }, 1000);
    }, 1000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+S to save (simulated)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            alert('Case file saved to evidence locker.');
        }
        
        // Number keys to switch tabs
        if (e.key >= '1' && e.key <= '5') {
            const tabs = document.querySelectorAll('.nav-tab');
            const index = parseInt(e.key) - 1;
            if (tabs[index]) {
                tabs[index].click();
            }
        }
    });
});

// Add custom cursor trail for enhanced atmosphere
let lastMouseX = 0;
let lastMouseY = 0;
document.addEventListener('mousemove', (e) => {
    // Calculate mouse velocity
    const velocity = Math.sqrt(
        Math.pow(e.clientX - lastMouseX, 2) + 
        Math.pow(e.clientY - lastMouseY, 2)
    );
    
    // Create more smoke particles when moving faster
    if (velocity > 10 && Math.random() > 0.8) {
        const smokeContainer = document.getElementById('smokeTrail');
        for (let i = 0; i < Math.min(velocity / 20, 3); i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'smoke-particle';
                particle.style.left = `${e.clientX}px`;
                particle.style.top = `${e.clientY}px`;
                particle.style.opacity = 0.3;
                smokeContainer.appendChild(particle);
                
                setTimeout(() => particle.remove(), 2000);
            }, i * 50);
        }
    }
    
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});