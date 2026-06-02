// NEON DYSTOPIA - Interactive System Controller
class DystopianController {
    constructor() {
        this.isInitialized = false;
        this.broadcastInterval = null;
        this.dataStreamInterval = null;
        this.lastScrollY = 0;
        this.surveillanceMode = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupTimestamp();
        this.setupBroadcastSystem();
        this.setupDataStream();
        this.setupNetworkInteractions();
        this.setupParallaxEffects();
        this.setupScrollEffects();
        this.setupCameraControls();
        this.setupFactionTerritory();
        this.setupCorruptionEffects();
        
        this.isInitialized = true;
        console.log('%cNEON DYSTOPIA SYSTEM ACTIVATED', 'color: #00d4ff; font-family: "Orbitron"; font-size: 14px; text-shadow: 0 0 10px #00d4ff;');
    }

    // Setup timestamp system
    setupTimestamp() {
        const timestampElement = document.getElementById('timestamp');
        const updateTimestamp = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const dateString = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            timestampElement.textContent = `${dateString} | ${hours}:${minutes}:${seconds} GMT`;
        };
        
        updateTimestamp();
        setInterval(updateTimestamp, 1000);
    }

    // Setup propaganda broadcast system
    setupBroadcastSystem() {
        const broadcastContent = document.querySelector('.text-stream');
        if (!broadcastContent) return;

        const messages = [
            "ALL CITIZENS REPORT TO DESIGNATED SECTOR",
            "RESISTANCE ACTIVITY DETECTED IN SECTOR 7-G",
            "COMPLY WITH NEW REGULATIONS IMMEDIATELY",
            "LOYALTY IS YOUR ONLY PROTECTION",
            "THE SYSTEM IS ALWAYS WATCHING",
            "RESISTANCE IS FUTILE - SUBMIT",
            "REPORT SUSPICIOUS ACTIVITY TO AUTHORITIES",
            "ORDER IS MAINTAINED THROUGH OBEDIENCE"
        ];

        let messageIndex = 0;
        
        this.broadcastInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            const message = messages[messageIndex];
            
            // Animate the message appearing character by character
            broadcastContent.style.animation = 'none';
            setTimeout(() => {
                broadcastContent.style.animation = `textScroll 15s linear infinite`;
            }, 10);
            
            // Add glitch effect occasionally
            if (Math.random() > 0.7) {
                this.triggerGlitchEffect();
            }
        }, 8000);
    }

    // Setup data corruption stream
    setupDataStream() {
        const streamLines = document.querySelectorAll('.data-stream .stream-line');
        const hexChars = '0123456789ABCDEF';
        
        this.dataStreamInterval = setInterval(() => {
            streamLines.forEach(line => {
                const chars = line.querySelectorAll('.data-char');
                chars.forEach(char => {
                    if (Math.random() > 0.7) {
                        char.textContent = '0x' + Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
                        char.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
                        setTimeout(() => {
                            char.style.color = 'var(--neon-cyan)';
                        }, 200);
                    }
                });
            });
            
            // Random corruption overlay
            if (Math.random() > 0.8) {
                this.triggerCorruptionOverlay();
            }
        }, 2000);
    }

    // Setup network map interactions
    setupNetworkInteractions() {
        const nodes = document.querySelectorAll('.node');
        const indicators = document.querySelectorAll('.status-indicator');
        
        nodes.forEach((node, index) => {
            node.addEventListener('click', () => {
                this.toggleNodeStatus(node, indicators[index]);
            });
            
            node.addEventListener('mouseenter', () => {
                this.highlightConnections(index);
            });
            
            node.addEventListener('mouseleave', () => {
                this.resetConnections();
            });
        });
    }

    toggleNodeStatus(node, indicator) {
        const isActive = node.style.opacity === '0.4';
        node.style.opacity = isActive ? '1' : '0.4';
        node.style.filter = isActive ? 'drop-shadow(0 0 5px var(--neon-cyan))' : 'none';
        
        if (indicator) {
            const isOnline = indicator.style.background === 'rgb(0, 255, 136)';
            indicator.style.background = isOnline ? '#ff3344' : '#00ff88';
            indicator.style.boxShadow = isOnline ? '0 0 3px #ff3344' : '0 0 5px #00ff88';
        }
        
        this.updateNetworkStats();
    }

    highlightConnections(nodeIndex) {
        const connections = document.querySelectorAll('.connection');
        connections.forEach((conn, index) => {
            if (index === nodeIndex || index === nodeIndex + 1) {
                conn.style.stroke = 'var(--neon-cyan)';
                conn.style.strokeWidth = '2';
                conn.style.strokeOpacity = '1';
            }
        });
    }

    resetConnections() {
        const connections = document.querySelectorAll('.connection');
        connections.forEach(conn => {
            conn.style.stroke = 'rgba(0, 212, 255, 0.3)';
            conn.style.strokeWidth = '1';
            conn.style.strokeOpacity = '0.3';
        });
    }

    updateNetworkStats() {
        const activeNodes = document.querySelectorAll('.node[style*="opacity: 1"]').length;
        const totalNodes = 7;
        const compromised = totalNodes - activeNodes;
        
        const activeEl = document.getElementById('active-cells');
        const compromisedEl = document.getElementById('compromised');
        
        if (activeEl) activeEl.textContent = `${activeNodes}/${totalNodes}`;
        if (compromisedEl) compromisedEl.textContent = compromised;
    }

    // Setup parallax effects
    setupParallaxEffects() {
        window.addEventListener('mousemove', (e) => {
            if (!this.surveillanceMode) return;
            
            const x = (window.innerWidth - e.pageX * 2) / 50;
            const y = (window.innerHeight - e.pageY * 2) / 50;
            
            const overlay = document.querySelector('.corruption-overlay');
            if (overlay) {
                overlay.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    }

    // Setup scroll effects
    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
            
            if (scrollDirection === 'down') {
                document.body.style.transform = 'perspective(1000px) rotateX(1deg)';
            } else {
                document.body.style.transform = 'perspective(1000px) rotateX(0deg)';
            }
            
            this.lastScrollY = currentScrollY;
        });
    }

    // Setup camera controls
    setupCameraControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'c':
                case 'C':
                    this.toggleCameraMode();
                    break;
                case 'r':
                case 'R':
                    this.refreshDataStream();
                    break;
                case 't':
                case 'T':
                    this.triggerGlitchEffect();
                    break;
            }
        });
    }

    toggleCameraMode() {
        this.surveillanceMode = !this.surveillanceMode;
        const feedContent = document.querySelector('.feed-content');
        if (feedContent) {
            feedContent.style.filter = this.surveillanceMode ? 'blur(2px) grayscale(0.8)' : 'none';
            feedContent.style.cursor = this.surveillanceMode ? 'crosshair' : 'default';
        }
    }

    refreshDataStream() {
        const streamLines = document.querySelectorAll('.data-stream .stream-line');
        streamLines.forEach(line => {
            line.style.animation = 'none';
            setTimeout(() => {
                line.style.animation = '';
            }, 10);
        });
    }

    // Setup faction territory system
    setupFactionTerritory() {
        const territoryCells = document.querySelectorAll('.territory-cell');
        
        territoryCells.forEach(cell => {
            cell.addEventListener('click', () => {
                this.conquerTerritory(cell);
            });
            
            // Random status changes
            setInterval(() => {
                if (Math.random() > 0.95) {
                    this.randomTerritoryChange(cell);
                }
            }, 10000);
        });
    }

    conquerTerritory(cell) {
        const factions = ['corporate', 'resistance', 'neutral'];
        const currentFaction = factions.find(f => cell.classList.contains(f));
        const newFaction = factions.find(f => f !== currentFaction);
        
        cell.classList.remove(currentFaction);
        cell.classList.add(newFaction);
        
        // Update percentage display
        const percentageEl = cell.querySelector('.territory-percentage');
        if (percentageEl) {
            const percentages = {
                'corporate': '65%',
                'resistance': '15%',
                'neutral': '12%'
            };
            percentageEl.textContent = percentages[newFaction];
        }
    }

    randomTerritoryChange(cell) {
        const factions = ['corporate', 'resistance', 'neutral'];
        const currentFaction = factions.find(f => cell.classList.contains(f));
        const newFaction = factions.filter(f => f !== currentFaction)[Math.floor(Math.random() * 2)];
        
        cell.classList.remove(currentFaction);
        cell.classList.add(newFaction);
    }

    // Setup corruption effects
    setupCorruptionEffects() {
        // Random system crashes
        setInterval(() => {
            if (Math.random() > 0.97) {
                this.triggerSystemCrash();
            }
        }, 15000);
        
        // Random broadcast interference
        setInterval(() => {
            if (Math.random() > 0.9) {
                this.triggerBroadcastInterference();
            }
        }, 5000);
    }

    triggerGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch-effect');
        glitchElements.forEach(glitch => {
            glitch.style.opacity = '1';
            setTimeout(() => {
                glitch.style.opacity = '0';
            }, 100);
        });
    }

    triggerCorruptionOverlay() {
        const overlay = document.querySelector('.corruption-overlay-stream');
        if (overlay) {
            overlay.style.animation = 'none';
            setTimeout(() => {
                overlay.style.animation = '';
            }, 10);
        }
    }

    triggerSystemCrash() {
        // Flash screen red
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(255, 0, 0, 0.3);
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 200);
        
        console.warn('%cSYSTEM CRITICAL FAILURE - REBOOT INITIATED', 'color: #ff3344; font-family: "Orbitron"; font-size: 12px;');
    }

    triggerBroadcastInterference() {
        const broadcast = document.querySelector('.broadcast-content');
        if (broadcast) {
            broadcast.style.filter = `hue-rotate(${Math.random() * 360}deg) brightness(${0.5 + Math.random() * 0.5})`;
            setTimeout(() => {
                broadcast.style.filter = 'none';
            }, 500);
        }
    }
}

// Initialize the dystopian system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dystopianController = new DystopianController();
    
    // Add some initial glitch effects
    setTimeout(() => {
        document.querySelectorAll('.glitch-effect').forEach(glitch => {
            glitch.style.opacity = Math.random() > 0.5 ? '1' : '0';
        });
    }, 1000);
});

// Add some additional interactive effects
document.addEventListener('mouseover', (e) => {
    if (window.dystopianController && window.dystopianController.surveillanceMode) {
        // Add cursor effects
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 1px solid var(--neon-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            box-shadow: 0 0 10px var(--neon-cyan);
            transform: translate(-50%, -50%);
        `;
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        document.body.appendChild(cursor);
        
        setTimeout(() => {
            cursor.remove();
        }, 100);
    }
});

// Handle visibility change to prevent performance issues
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('%cSYSTEM IN STANDBY MODE...', 'color: #ffd700; font-family: "Orbitron";');
    } else {
        console.log('%cSYSTEM ACTIVE - MISSION CONTINUES', 'color: #00d4ff; font-family: "Orbitron";');
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DystopianController;
}