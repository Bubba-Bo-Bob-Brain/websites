/* ======================================== 
DETECTIVE'S CASE FILE SYSTEM - 1947 
The Black Lotus Affair JavaScript 
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initTypewriterEffect();
    initCorkboard();
    initSmokeEffect();
    initEvidenceInteractions();
    initSuspectCards();
    initRainEffect();
    initPageLoadAnimations();
    
    // Add final initialization
    initDynamicStyles();
});

/* ======================================== 
NAVIGATION 
======================================== */

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.case-section');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.dataset.section;
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show target section, hide others
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    // Trigger section-specific animations
                    triggerSectionAnimations(section);
                }
            });
        });
    });
}

function triggerSectionAnimations(section) {
    // Re-trigger typewriter effects in the section
    const typewriterElements = section.querySelectorAll('.typewriter');
    typewriterElements.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = null;
    });
    
    const textElements = section.querySelectorAll('.typewriter-text p');
    textElements.forEach(p => {
        p.style.animation = 'none';
        p.offsetHeight;
        p.style.animation = null;
    });
}

/* ======================================== 
TYPEWRITER EFFECT 
======================================== */

function initTypewriterEffect() {
    // Add sound effect simulation to typewriter elements
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    typewriterElements.forEach(container => {
        const text = container.textContent;
        container.textContent = '';
        container.setAttribute('data-original', text);
    });
}

// Typewriter typing simulation
function typeWriter(element, text, index = 0) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeWriter(element, text, index + 1), 30);
    }
}

/* ======================================== 
CORKBOARD CONNECTIONS 
======================================== */

function initCorkboard() {
    const drawBtn = document.getElementById('drawThreads');
    const clearBtn = document.getElementById('clearThreads');
    const threadCanvas = document.getElementById('threadCanvas');
    const corkItems = document.querySelectorAll('.cork-item');
    
    // Node connection data - defines which nodes connect to which
    const connections = [
        { from: 'victor', to: 'manor' },
        { from: 'victor', to: 'weapon' },
        { from: 'elena', to: 'manor' },
        { from: 'elena', to: 'lotus' },
        { from: 'rex', to: 'lotus' },
        { from: 'rex', to: 'weapon' },
        { from: 'manor', to: 'butler' },
        { from: 'weapon', to: 'footprint' },
        { from: 'letter', to: 'lotus' },
        { from: 'letter', to: 'victor' },
        { from: 'lotus', to: 'manor' }
    ];
    
    let threadsDrawn = false;
    
    drawBtn.addEventListener('click', () => {
        if (threadsDrawn) return;
        
        connections.forEach((conn, index) => {
            const fromNode = document.querySelector(`[data-node="${conn.from}"]`);
            const toNode = document.querySelector(`[data-node="${conn.to}"]`);
            
            if (fromNode && toNode) {
                createThread(fromNode, toNode, index);
            }
        });
        
        threadsDrawn = true;
        drawBtn.disabled = true;
        drawBtn.textContent = 'Threads Connected';
    });
    
    clearBtn.addEventListener('click', () => {
        threadCanvas.innerHTML = '';
        threadsDrawn = false;
        drawBtn.disabled = false;
        drawBtn.textContent = 'Connect the Dots';
    });
    
    // Add hover effects to nodes
    corkItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            highlightConnected(item);
        });
        item.addEventListener('mouseleave', () => {
            unhighlightAll();
        });
    });
}

function createThread(fromNode, toNode, delay) {
    const threadCanvas = document.getElementById('threadCanvas');
    const canvasRect = threadCanvas.getBoundingClientRect();
    const fromRect = fromNode.getBoundingClientRect();
    const toRect = toNode.getBoundingClientRect();
    
    // Calculate center points relative to canvas
    const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
    const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;
    const toX = toRect.left + toRect.width / 2 - canvasRect.left;
    const toY = toRect.top + toRect.height / 2 - canvasRect.top;
    
    // Create curved path using SVG
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const midX = (fromX + toX) / 2;
    const midY = Math.min(fromY, toY) - 50;
    const d = `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
    
    path.setAttribute('d', d);
    path.setAttribute('class', 'thread');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#c41e3a');
    path.setAttribute('stroke-width', '2');
    path.style.opacity = '0';
    
    // Add animation with delay
    setTimeout(() => {
        path.classList.add('animated');
        path.style.transition = 'opacity 1s ease';
        path.style.opacity = '1';
    }, delay * 150);
    
    threadCanvas.appendChild(path);
}

function highlightConnected(hoveredNode) {
    const nodeId = hoveredNode.dataset.node;
    // Highlight connected nodes and threads
    const allNodes = document.querySelectorAll('.cork-item');
    allNodes.forEach(node => {
        node.style.filter = 'brightness(0.7)';
    });
    hoveredNode.style.filter = 'brightness(1.2)';
}

function unhighlightAll() {
    const allNodes = document.querySelectorAll('.cork-item');
    allNodes.forEach(node => {
        node.style.filter = '';
    });
}

/* ======================================== 
SMOKE EFFECT 
======================================== */

function initSmokeEffect() {
    const smokeContainer = document.getElementById('smokeContainer');
    
    // Create smoke wisps periodically
    function createSmokeWisp() {
        const wisp = document.createElement('div');
        wisp.className = 'smoke-wisp';
        
        // Random horizontal position
        wisp.style.left = Math.random() * 100 + '%';
        
        // Start from bottom
        wisp.style.bottom = '-100px';
        
        // Random size
        const size = 80 + Math.random() * 80;
        wisp.style.width = size + 'px';
        wisp.style.height = size + 'px';
        
        // Random animation duration
        wisp.style.animationDuration = (6 + Math.random() * 4) + 's';
        
        // Random delay
        wisp.style.animationDelay = Math.random() * 2 + 's';
        
        smokeContainer.appendChild(wisp);
        
        // Remove after animation
        setTimeout(() => {
            wisp.remove();
        }, 10000);
    }
    
    // Start creating smoke after a delay
    setTimeout(() => {
        setInterval(createSmokeWisp, 3000);
    }, 2000);
    
    // Optional: Create smoke on mouse movement (subtle)
    let mouseThrottle = false;
    document.addEventListener('mousemove', (e) => {
        if (mouseThrottle) return;
        mouseThrottle = true;
        
        if (Math.random() > 0.7) {
            createSmokeWisp();
        }
        
        setTimeout(() => {
            mouseThrottle = false;
        }, 100);
    });
}

/* ======================================== 
EVIDENCE INTERACTIONS 
======================================== */

function initEvidenceInteractions() {
    const evidenceItems = document.querySelectorAll('.evidence-item');
    
    evidenceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Create a larger modal view
            const modal = createEvidenceModal(item);
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('active'), 10);
        });
    });
}

function createEvidenceModal(item) {
    const modal = document.createElement('div');
    modal.className = 'evidence-modal';
    
    const polaroid = item.querySelector('.polaroid');
    const caption = item.querySelector('.polaroid-caption p').textContent;
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <button class="modal-close">×</button>
            <div class="modal-polaroid">
                ${polaroid.outerHTML}
            </div>
            <p class="modal-caption">${caption}</p>
            <div class="modal-details">
                <p>Evidence ID: ${generateEvidenceID()}</p>
                <p>Processed: November 15, 1947</p>
                <p>Detective: M. Reynolds</p>
            </div>
        </div>
    `;
    
    // Close handlers
    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    backdrop.addEventListener('click', () => closeModal(modal));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal(modal);
    });
    
    return modal;
}

function generateEvidenceID() {
    return 'EV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

/* ======================================== 
SUSPECT CARDS 
======================================== */

function initSuspectCards() {
    const suspectCards = document.querySelectorAll('.suspect-card');
    
    suspectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add fingerprint effect
            card.style.setProperty('--fingerprint', 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'%23c41e3a\' stroke-width=\'2\' opacity=\'0.3\'/%3E%3C/svg%3E")');
        });
        
        // Add investigation notes reveal
        card.addEventListener('click', () => {
            const details = card.querySelector('.suspect-details');
            details.classList.toggle('expanded');
            
            if (details.classList.contains('expanded')) {
                const note = document.createElement('p');
                note.className = 'investigation-note';
                note.innerHTML = '<strong>NOTE:</strong> Subject has history of gambling debts. Bank records show large withdrawals in weeks prior.';
                details.appendChild(note);
            } else {
                const note = details.querySelector('.investigation-note');
                if (note) note.remove();
            }
        });
    });
}

/* ======================================== 
RAIN EFFECT ENHANCEMENT 
======================================== */

function initRainEffect() {
    const rainOverlay = document.querySelector('.rain-overlay');
    if (!rainOverlay) return;
    
    // Make rain more dynamic - change intensity based on time
    let intensity = 0.3;
    
    function updateRain() {
        intensity = 0.2 + Math.random() * 0.3;
        rainOverlay.style.animationDuration = intensity + 's';
    }
    
    setInterval(updateRain, 5000);
    
    // Add occasional lightning flash
    function randomLightning() {
        if (Math.random() > 0.98) {
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.1);
                pointer-events: none;
                z-index: 1001;
                animation: lightning 0.2s ease-out;
            `;
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 200);
        }
    }
    
    setInterval(randomLightning, 3000);
}

/* ======================================== 
PAGE LOAD ANIMATIONS 
======================================== */

function initPageLoadAnimations() {
    // Staggered reveal of main elements
    const container = document.querySelector('.case-file-container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
    
    // Animate header elements
    const header = document.querySelector('.case-header');
    const headerElements = header.querySelectorAll('.case-number, .case-title, .case-status');
    
    headerElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300 + i * 150);
    });
    
    // Animate navigation
    const nav = document.querySelector('.case-nav');
    const navButtons = nav.querySelectorAll('.nav-btn');
    
    nav.style.opacity = '0';
    nav.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        nav.style.opacity = '1';
        nav.style.transform = 'translateX(0)';
    }, 800);
    
    navButtons.forEach((btn, i) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 900 + i * 80);
    });
    
    // Add footer stamp animation
    const footerStamp = document.querySelector('.footer-stamp');
    if (footerStamp) {
        footerStamp.style.opacity = '0';
        footerStamp.style.transform = 'rotate(-5deg) scale(1.5)';
        
        setTimeout(() => {
            footerStamp.style.transition = 'all 0.3s ease-out';
            footerStamp.style.opacity = '1';
            footerStamp.style.transform = 'rotate(-5deg) scale(1)';
        }, 1500);
    }
}

/* ======================================== 
DYNAMIC STYLES 
======================================== */

function initDynamicStyles() {
    // Add all dynamic styles to the document
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        /* Modal Styles */
        .evidence-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .evidence-modal.active {
            opacity: 1;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
        }
        
        .modal-content {
            position: relative;
            background: var(--noir-dark);
            padding: 40px;
            border: 2px solid var(--noir-gray);
            max-width: 500px;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .evidence-modal.active .modal-content {
            transform: scale(1);
        }
        
        .modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: var(--noir-light);
            font-size: 2rem;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: var(--accent-red);
        }
        
        .modal-caption {
            font-family: var(--font-typewriter);
            color: var(--noir-paper);
            margin: 20px 0;
            font-style: italic;
        }
        
        .modal-details {
            font-size: 0.8rem;
            color: var(--noir-light);
            border-top: 1px dashed var(--noir-gray);
            padding-top: 15px;
            margin-top: 15px;
        }
        
        .modal-details p {
            margin: 5px 0;
        }
        
        .modal-polaroid .polaroid {
            transform: none;
        }
        
        .modal-polaroid .polaroid:hover {
            transform: none;
        }
        
        /* Investigation Notes */
        .suspect-details .investigation-note {
            margin-top: 15px;
            padding: 10px;
            background: rgba(196, 30, 58, 0.1);
            border-left: 3px solid var(--accent-red);
            font-size: 0.8rem;
            color: var(--noir-paper);
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Lightning Animation */
        @keyframes lightning {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        /* Thread Animation */
        @keyframes draw-thread {
            from {
                stroke-dashoffset: 1000;
            }
            to {
                stroke-dashoffset: 0;
            }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .modal-content {
                margin: 20px;
                padding: 20px;
            }
            
            .evidence-modal {
                align-items: flex-start;
                padding-top: 50px;
            }
        }
    `;
    
    document.head.appendChild(dynamicStyles);
}

/* ======================================== 
KEYBOARD SHORTCUTS 
======================================== */

document.addEventListener('keydown', (e) => {
    // Number keys for quick navigation
    const keyMap = {
        '1': 'overview',
        '2': 'suspects',
        '3': 'evidence',
        '4': 'witnesses',
        '5': 'corkboard'
    };
    
    if (keyMap[e.key] && !e.ctrlKey && !e.metaKey) {
        const btn = document.querySelector(`[data-section="${keyMap[e.key]}"]`);
        if (btn) btn.click();
    }
});

/* ======================================== 
CORKBOARD DRAG FUNCTIONALITY 
======================================== */

(function initCorkboardDrag() {
    const corkItems = document.querySelectorAll('.cork-item');
    let draggedItem = null;
    let offsetX, offsetY;
    
    corkItems.forEach(item => {
        item.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('pin')) return;
            
            draggedItem = item;
            const rect = item.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            item.style.zIndex = '1000';
        });
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!draggedItem) return;
        
        const corkboard = document.getElementById('corkboardCanvas');
        if (!corkboard) return;
        
        const rect = corkboard.getBoundingClientRect();
        let x = e.clientX - rect.left - offsetX;
        let y = e.clientY - rect.top - offsetY;
        
        // Constrain to corkboard bounds
        x = Math.max(0, Math.min(x, rect.width - draggedItem.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - draggedItem.offsetHeight));
        
        draggedItem.style.left = x + 'px';
        draggedItem.style.top = y + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        if (draggedItem) {
            draggedItem.style.zIndex = '';
            draggedItem = null;
        }
    });
})();

/* ======================================== 
SCROLL EFFECTS 
======================================== */

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const venetianBlinds = document.querySelector('.venetian-blinds');
            
            if (venetianBlinds) {
                venetianBlinds.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            
            ticking = false;
        });
        ticking = true;
    }
});

/* ======================================== 
EVIDENCE POLAROID ROTATION 
======================================== */

function randomizePolaroidRotations() {
    const polaroids = document.querySelectorAll('.polaroid');
    
    polaroids.forEach((polaroid, index) => {
        const rotation = (Math.random() - 0.5) * 6; // -3 to 3 degrees
        polaroid.style.transform = `rotate(${rotation}deg)`;
    });
}

// Initialize on load
randomizePolaroidRotations();

// Re-randomize on window resize
window.addEventListener('resize', () => {
    setTimeout(randomizePolaroidRotations, 100);
});

/* ======================================== 
CASE FILE TIMESTAMP 
======================================== */

function updateCaseTimestamp() {
    // Could add real-time clock display if needed
    console.log('Case File: 1947-XR9 | The Black Lotus Affair');
}

// Initialize
updateCaseTimestamp();

/* ======================================== 
END OF JAVASCRIPT 
======================================== */