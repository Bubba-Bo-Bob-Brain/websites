/**
 * CASE FILE #1947-B - NOIR INVESTIGATION BUREAU
 * Interactive JavaScript for 1940s Film Noir Detective Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // === STATE MANAGEMENT ===
    const state = {
        currentTab: 'case-notes',
        isConnectMode: false,
        draggedItem: null,
        dragOffset: { x: 0, y: 0 },
        connections: [],
        smokeTrail: [],
        rainInterval: null,
        typingComplete: false
    };

    // === DOM ELEMENTS ===
    const elements = {
        cursor: document.getElementById('customCursor'),
        cursorTrail: document.getElementById('cursorTrail'),
        smokeContainer: document.getElementById('smokeContainer'),
        rainOverlay: document.getElementById('rainOverlay'),
        venetianBlinds: document.getElementById('venetianBlinds'),
        bloodSplatter: document.getElementById('bloodSplatter'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        typewriterText: document.getElementById('typewriterText'),
        corkboardContainer: document.getElementById('corkboardContainer'),
        threadLayer: document.getElementById('threadLayer'),
        connectModeToggle: document.getElementById('connectMode'),
        autoConnectBtn: document.getElementById('autoConnect'),
        clearConnectionsBtn: document.getElementById('clearConnections'),
        checkList: document.querySelectorAll('.check-list li'),
        boardItems: document.querySelectorAll('.board-item'),
        conspiracyCenter: document.getElementById('conspiracyCenter')
    };

    // === CUSTOM CURSOR & SMOKE TRAIL ===
    function initCursor() {
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move custom cursor
            elements.cursor.style.left = mouseX + 'px';
            elements.cursor.style.top = mouseY + 'px';
            
            // Create smoke particle occasionally
            if (Math.random() > 0.92) {
                createSmokeParticle(mouseX, mouseY);
            }
        });

        // Smooth trail following
        function animateTrail() {
            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;
            elements.cursorTrail.style.left = trailX + 'px';
            elements.cursorTrail.style.top = trailY + 'px';
            requestAnimationFrame(animateTrail);
        }
        animateTrail();

        // Hover states
        document.querySelectorAll('button, .tab-btn, .polaroid, .suspect-card, .board-item').forEach(el => {
            el.addEventListener('mouseenter', () => elements.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => elements.cursor.classList.remove('hover'));
        });
    }

    function createSmokeParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'smoke-particle';
        const size = Math.random() * 30 + 10;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = (x + (Math.random() - 0.5) * 20) + 'px';
        particle.style.top = (y + (Math.random() - 0.5) * 20) + 'px';
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        elements.smokeContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 4000);
    }

    // === RAIN SYSTEM ===
    function initRain() {
        const createRainDrop = () => {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            drop.style.opacity = Math.random() * 0.5 + 0.2;
            elements.rainOverlay.appendChild(drop);
            
            setTimeout(() => {
                drop.remove();
            }, 1000);
        };

        // Create rain at intervals
        setInterval(createRainDrop, 50);
        
        // Create initial batch
        for (let i = 0; i < 20; i++) {
            setTimeout(createRainDrop, i * 100);
        }
    }

    // === VENETIAN BLINDS ANIMATION ===
    function initVenetianBlinds() {
        let angle = 0;
        let direction = 1;
        
        setInterval(() => {
            angle += direction * 0.5;
            if (Math.abs(angle) > 5) direction *= -1;
            elements.venetianBlinds.style.transform = `skewX(${angle}deg)`;
        }, 100);
    }

    // === TAB SWITCHING ===
    function initTabs() {
        elements.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                switchTab(tabId);
            });
        });
    }

    function switchTab(tabId) {
        if (state.currentTab === tabId) return;
        
        // Update buttons
        elements.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        // Fade out current
        const currentContent = document.getElementById(state.currentTab);
        currentContent.style.opacity = '0';
        currentContent.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            currentContent.classList.remove('active');
            
            // Activate new
            const newContent = document.getElementById(tabId);
            newContent.classList.add('active');
            
            // Trigger reflow
            void newContent.offsetWidth;
            
            newContent.style.opacity = '1';
            newContent.style.transform = 'translateY(0)';
            
            // Special init for specific tabs
            if (tabId === 'case-notes' && !state.typingComplete) {
                initTypewriter();
            } else if (tabId === 'corkboard') {
                initCorkboard();
            }
        }, 300);
        
        state.currentTab = tabId;
    }

    // === TYPEWRITER EFFECT ===
    function initTypewriter() {
        const lines = elements.typewriterText.querySelectorAll('.typing-line');
        
        lines.forEach((line, index) => {
            const text = line.dataset.text;
            line.textContent = '';
            line.style.opacity = '1';
            
            setTimeout(() => {
                typeLine(line, text);
            }, index * 1500);
        });
        
        state.typingComplete = true;
    }

    function typeLine(element, text, charIndex = 0) {
        if (charIndex < text.length) {
            element.textContent += text.charAt(charIndex);
            setTimeout(() => {
                typeLine(element, text, charIndex + 1);
            }, 50 + Math.random() * 50);
        }
    }

    // === CHECKLIST INTERACTION ===
    function initChecklist() {
        elements.checkList.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('checked');
                // Play subtle sound effect could go here
            });
        });
    }

    // === CORKBOARD FUNCTIONALITY ===
    function initCorkboard() {
        // Drag and drop
        elements.boardItems.forEach(item => {
            item.addEventListener('mousedown', startDrag);
            item.addEventListener('click', handleItemClick);
        });

        // Connection mode toggle
        elements.connectModeToggle.addEventListener('change', (e) => {
            state.isConnectMode = e.target.checked;
            elements.corkboardContainer.style.cursor = state.isConnectMode ? 'crosshair' : 'default';
        });

        // Control buttons
        elements.autoConnectBtn.addEventListener('click', autoConnect);
        elements.clearConnectionsBtn.addEventListener('click', clearConnections);

        // Global mouse up for drag end
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('mousemove', drag);
    }

    let dragItem = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let itemStartX = 0;
    let itemStartY = 0;

    function startDrag(e) {
        if (state.isConnectMode) return;
        e.preventDefault();
        
        dragItem = e.currentTarget;
        dragItem.classList.add('dragging');
        
        const rect = dragItem.getBoundingClientRect();
        const containerRect = elements.corkboardContainer.getBoundingClientRect();
        
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        itemStartX = rect.left - containerRect.left;
        itemStartY = rect.top - containerRect.top;
    }

    function drag(e) {
        if (!dragItem) return;
        
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        
        dragItem.style.left = (itemStartX + dx) + 'px';
        dragItem.style.top = (itemStartY + dy) + 'px';
        
        // Update connections if item moved
        updateConnections();
    }

    function endDrag() {
        if (dragItem) {
            dragItem.classList.remove('dragging');
            dragItem = null;
        }
    }

    // === THREAD CONNECTION SYSTEM ===
    let firstConnectionItem = null;

    function handleItemClick(e) {
        if (!state.isConnectMode) return;
        e.stopPropagation();
        
        const item = e.currentTarget;
        
        if (!firstConnectionItem) {
            firstConnectionItem = item;
            item.style.boxShadow = '0 0 20px var(--crimson)';
        } else if (firstConnectionItem !== item) {
            createConnection(firstConnectionItem, item);
            firstConnectionItem.style.boxShadow = '';
            firstConnectionItem = null;
        }
    }

    function createConnection(item1, item2) {
        const id = `${item1.dataset.id}-${item2.dataset.id}`;
        
        // Check if connection exists
        if (state.connections.some(c => c.id === id)) return;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('class', 'thread-path');
        line.setAttribute('id', id);
        
        elements.threadLayer.appendChild(line);
        
        state.connections.push({
            id: id,
            from: item1,
            to: item2,
            element: line
        });
        
        updateConnections();
    }

    function updateConnections() {
        const containerRect = elements.corkboardContainer.getBoundingClientRect();
        
        state.connections.forEach(conn => {
            const rect1 = conn.from.getBoundingClientRect();
            const rect2 = conn.to.getBoundingClientRect();
            
            const x1 = rect1.left + rect1.width / 2 - containerRect.left;
            const y1 = rect1.top + rect1.height / 2 - containerRect.top;
            const x2 = rect2.left + rect2.width / 2 - containerRect.left;
            const y2 = rect2.top + rect2.height / 2 - containerRect.top;
            
            // Create curved path
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - 50; // Curve upward
            
            const path = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
            conn.element.setAttribute('d', path);
        });
    }

    function autoConnect() {
        clearConnections();
        
        const items = Array.from(elements.boardItems);
        const center = elements.conspiracyCenter;
        
        // Connect center to all items
        items.forEach(item => {
            createConnection(center, item);
        });
        
        // Connect some items to each other
        if (items.length >= 2) {
            createConnection(items[0], items[2]); // Morano to Fitzgerald
            createConnection(items[1], items[3]); // Cross to map
        }
    }

    function clearConnections() {
        state.connections.forEach(conn => conn.element.remove());
        state.connections = [];
        firstConnectionItem = null;
    }

    // === BLOOD SPLATTER INTERACTION ===
    function initBloodSplatter() {
        elements.bloodSplatter.addEventListener('click', () => {
            // Create rippling effect
            elements.bloodSplatter.style.transform = 'scale(1.2)';
            elements.bloodSplatter.style.opacity = '0.6';
            
            setTimeout(() => {
                elements.bloodSplatter.style.transform = 'scale(1)';
                elements.bloodSplatter.style.opacity = '0.3';
            }, 300);
        });
    }

    // === KEYBOARD SHORTCUTS ===
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Number keys for tabs
            if (e.key >= '1' && e.key <= '5') {
                const tabs = ['case-notes', 'suspects', 'evidence', 'witnesses', 'corkboard'];
                const index = parseInt(e.key) - 1;
                if (tabs[index]) switchTab(tabs[index]);
            }
            
            // Escape to clear connections
            if (e.key === 'Escape') {
                clearConnections();
                if (state.isConnectMode) {
                    elements.connectModeToggle.checked = false;
                    state.isConnectMode = false;
                }
            }
        });
    }

    // === SUSPECT CARD INTERACTIONS ===
    function initSuspectCards() {
        document.querySelectorAll('.suspect-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Subtle lift effect handled by CSS, add sound here if needed
            });
        });
    }

    // === EVIDENCE PHOTO INTERACTIONS ===
    function initEvidencePhotos() {
        document.querySelectorAll('.polaroid').forEach(photo => {
            photo.addEventListener('click', () => {
                // Add to corkboard animation
                photo.style.transform = 'scale(1.1) rotate(0deg)';
                setTimeout(() => {
                    photo.style.transform = '';
                }, 200);
            });
        });
    }

    // === INITIALIZATION ===
    function init() {
        initCursor();
        initRain();
        initVenetianBlinds();
        initTabs();
        initChecklist();
        initBloodSplatter();
        initKeyboardShortcuts();
        initSuspectCards();
        initEvidencePhotos();
        
        // Start with typewriter if on case-notes
        if (state.currentTab === 'case-notes') {
            setTimeout(initTypewriter, 500);
        }
        
        // Handle window resize for connections
        window.addEventListener('resize', updateConnections);
        
        console.log('Case File #1947-B Initialized');
        console.log('Remember: The city never sleeps, and neither does the truth.');
    }

    // Start the investigation
    init();
});