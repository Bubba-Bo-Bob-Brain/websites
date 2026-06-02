// scripts.js

// ===== DOM ELEMENTS =====
const sealButtons = document.querySelectorAll('.seal-btn');
const scrollSections = document.querySelectorAll('.scroll-section');
const scrollProgressFill = document.querySelector('.scroll-progress .progress-fill');
const scrollPercentage = document.getElementById('scroll-percentage');
const skillTreeCanvas = document.getElementById('skill-tree-canvas');
const meridianCanvas = document.getElementById('meridian-canvas');
const treeControls = document.querySelectorAll('.tree-btn');
const meridianButtons = document.querySelectorAll('.meridian-btn');
const qiLevelElement = document.getElementById('qi-level');
const meridianOpenElement = document.getElementById('meridian-open');
const flowRateElement = document.getElementById('flow-rate');
const skillNodes = document.querySelectorAll('.skill-node');
const meridianPoints = document.querySelectorAll('.meridian-point');
const inkSplashOverlay = document.querySelector('.ink-splash-overlay');

// ===== AUDIO ELEMENTS =====
const scrollSound = document.getElementById('scroll-sound');
const sealSound = document.getElementById('seal-sound');
const qiSound = document.getElementById('qi-sound');

// ===== GLOBAL VARIABLES =====
let currentSection = 'intro';
let skillTreeConnections = [];
let meridianPaths = [];
let qiFlowInterval = null;
let isQiFlowing = false;
let canvasScale = 1;
let canvasOffset = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let skillTreeCtx, meridianCtx;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio
    scrollSound.volume = 0.3;
    sealSound.volume = 0.2;
    qiSound.volume = 0.4;
    
    // Play scroll sound on page load
    setTimeout(() => {
        scrollSound.play().catch(e => console.log("Audio play failed:", e));
    }, 800);
    
    // Initialize canvases
    initSkillTree();
    initMeridianDiagram();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start scroll progress tracking
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress);
    
    // Animate ink splash overlay removal
    setTimeout(() => {
        inkSplashOverlay.style.opacity = '0';
        setTimeout(() => {
            inkSplashOverlay.style.display = 'none';
        }, 1500);
    }, 2000);
    
    // Animate progress bars on load
    animateProgressBars();
});

// ===== SKILL TREE INITIALIZATION =====
function initSkillTree() {
    if (!skillTreeCanvas) return;
    
    skillTreeCanvas.width = skillTreeCanvas.offsetWidth;
    skillTreeCanvas.height = skillTreeCanvas.offsetHeight;
    
    skillTreeCtx = skillTreeCanvas.getContext('2d');
    
    // Define skill tree connections
    skillTreeConnections = [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 5 },
        { from: 2, to: 6 },
        { from: 3, to: 6 },
        { from: 3, to: 7 },
        { from: 4, to: 7 },
        { from: 4, to: 8 },
        { from: 5, to: 9 },
        { from: 6, to: 9 },
        { from: 6, to: 10 },
        { from: 7, to: 10 },
        { from: 7, to: 11 },
        { from: 8, to: 11 },
        { from: 9, to: 12 },
        { from: 10, to: 12 },
        { from: 11, to: 12 }
    ];
    
    drawSkillTree();
    
    // Add interactivity to skill nodes
    skillNodes.forEach(node => {
        node.addEventListener('click', function() {
            const nodeId = this.getAttribute('data-id');
            activateSkillNode(nodeId);
        });
        
        node.addEventListener('mouseenter', function() {
            highlightSkillConnections(this.getAttribute('data-id'));
        });
        
        node.addEventListener('mouseleave', function() {
            drawSkillTree();
        });
    });
}

function drawSkillTree() {
    skillTreeCtx.clearRect(0, 0, skillTreeCanvas.width, skillTreeCanvas.height);
    
    // Draw connections
    skillTreeConnections.forEach(conn => {
        const fromNode = document.querySelector(`.skill-node[data-id="${conn.from}"]`);
        const toNode = document.querySelector(`.skill-node[data-id="${conn.to}"]`);
        
        if (!fromNode || !toNode) return;
        
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const canvasRect = skillTreeCanvas.getBoundingClientRect();
        
        const fromX = fromRect.left + fromRect.width/2 - canvasRect.left;
        const fromY = fromRect.top + fromRect.height/2 - canvasRect.top;
        const toX = toRect.left + toRect.width/2 - canvasRect.left;
        const toY = toRect.top + toRect.height/2 - canvasRect.top;
        
        // Draw ink brush stroke connection
        skillTreeCtx.beginPath();
        skillTreeCtx.moveTo(fromX, fromY);
        
        // Create a curved path for a natural brush stroke look
        const controlX = (fromX + toX) / 2;
        const controlY = Math.min(fromY, toY) - 50;
        
        skillTreeCtx.quadraticCurveTo(controlX, controlY, toX, toY);
        
        skillTreeCtx.strokeStyle = '#8c7851';
        skillTreeCtx.lineWidth = 3;
        skillTreeCtx.lineCap = 'round';
        skillTreeCtx.setLineDash([10, 5]);
        skillTreeCtx.stroke();
        
        // Add ink bleed effect at ends
        skillTreeCtx.beginPath();
        skillTreeCtx.arc(fromX, fromY, 5, 0, Math.PI * 2);
        skillTreeCtx.fillStyle = '#8c7851';
        skillTreeCtx.fill();
        
        skillTreeCtx.beginPath();
        skillTreeCtx.arc(toX, toY, 5, 0, Math.PI * 2);
        skillTreeCtx.fillStyle = '#8c7851';
        skillTreeCtx.fill();
    });
}

function highlightSkillConnections(nodeId) {
    drawSkillTree(); // Redraw base tree
    
    // Highlight connections related to this node
    skillTreeConnections.forEach(conn => {
        if (conn.from == nodeId || conn.to == nodeId) {
            const fromNode = document.querySelector(`.skill-node[data-id="${conn.from}"]`);
            const toNode = document.querySelector(`.skill-node[data-id="${conn.to}"]`);
            
            if (!fromNode || !toNode) return;
            
            const fromRect = fromNode.getBoundingClientRect();
            const toRect = toNode.getBoundingClientRect();
            const canvasRect = skillTreeCanvas.getBoundingClientRect();
            
            const fromX = fromRect.left + fromRect.width/2 - canvasRect.left;
            const fromY = fromRect.top + fromRect.height/2 - canvasRect.top;
            const toX = toRect.left + toRect.width/2 - canvasRect.left;
            const toY = toRect.top + toRect.height/2 - canvasRect.top;
            
            // Draw highlighted connection
            skillTreeCtx.beginPath();
            skillTreeCtx.moveTo(fromX, fromY);
            
            const controlX = (fromX + toX) / 2;
            const controlY = Math.min(fromY, toY) - 50;
            
            skillTreeCtx.quadraticCurveTo(controlX, controlY, toX, toY);
            
            skillTreeCtx.strokeStyle = '#c53d3d';
            skillTreeCtx.lineWidth = 4;
            skillTreeCtx.lineCap = 'round';
            skillTreeCtx.setLineDash([]);
            
            // Add glow effect
            skillTreeCtx.shadowColor = '#c53d3d';
            skillTreeCtx.shadowBlur = 10;
            skillTreeCtx.stroke();
            
            // Reset shadow
            skillTreeCtx.shadowColor = 'transparent';
            skillTreeCtx.shadowBlur = 0;
        }
    });
}

function activateSkillNode(nodeId) {
    const node = document.querySelector(`.skill-node[data-id="${nodeId}"]`);
    if (!node) return;
    
    // Play qi sound
    qiSound.currentTime = 0;
    qiSound.play().catch(e => console.log("Audio play failed:", e));
    
    // Add activation effect
    node.classList.add('active');
    
    // Add pulsing animation
    const nodeCircle = node.querySelector('.node-circle');
    nodeCircle.style.animation = 'pulse-point 0.5s ease 3';
    
    // Reset after animation
    setTimeout(() => {
        nodeCircle.style.animation = '';
    }, 1500);
    
    // Show notification
    showSkillNotification(nodeId);
}

function showSkillNotification(nodeId) {
    const node = document.querySelector(`.skill-node[data-id="${nodeId}"]`);
    const nodeLabel = node.querySelector('.node-label').textContent;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'skill-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>Skill unlocked: ${nodeLabel}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'rgba(245, 241, 230, 0.95)';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    notification.style.borderLeft = '4px solid #4a7c42';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateX(150%)';
    notification.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ===== MERIDIAN DIAGRAM INITIALIZATION =====
function initMeridianDiagram() {
    if (!meridianCanvas) return;
    
    meridianCanvas.width = meridianCanvas.offsetWidth;
    meridianCanvas.height = meridianCanvas.offsetHeight;
    
    meridianCtx = meridianCanvas.getContext('2d');
    
    // Define meridian paths
    meridianPaths = [
        { points: ['crown', 'third-eye', 'throat', 'heart', 'solar-plexus', 'sacral', 'root'] },
        { points: ['third-eye', 'solar-plexus', 'root'] },
        { points: ['crown', 'heart', 'sacral'] },
        { points: ['throat', 'solar-plexus'] },
        { points: ['heart', 'sacral', 'root'] }
    ];
    
    drawMeridians();
    
    // Add interactivity to meridian points
    meridianPoints.forEach(point => {
        point.addEventListener('click', function() {
            const pointName = this.getAttribute('data-point');
            activateMeridianPoint(pointName);
        });
    });
}

function drawMeridians() {
    meridianCtx.clearRect(0, 0, meridianCanvas.width, meridianCanvas.height);
    
    // Draw all meridian paths
    meridianPaths.forEach(path => {
        const points = [];
        
        // Get coordinates for each point in the path
        path.points.forEach(pointName => {
            const pointElement = document.querySelector(`.meridian-point[data-point="${pointName}"]`);
            if (pointElement) {
                const rect = pointElement.getBoundingClientRect();
                const canvasRect = meridianCanvas.getBoundingClientRect();
                
                const x = rect.left + rect.width/2 - canvasRect.left;
                const y = rect.top + rect.height/2 - canvasRect.top;
                
                points.push({ x, y });
            }
        });
        
        // Draw the path
        if (points.length > 1) {
            meridianCtx.beginPath();
            meridianCtx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length; i++) {
                // Draw curved lines between points
                const prevPoint = points[i-1];
                const currentPoint = points[i];
                
                // Calculate control point for curve
                const controlX = (prevPoint.x + currentPoint.x) / 2;
                const controlY = Math.min(prevPoint.y, currentPoint.y) - 30;
                
                meridianCtx.quadraticCurveTo(controlX, controlY, currentPoint.x, currentPoint.y);
            }
            
            meridianCtx.strokeStyle = 'rgba(74, 143, 231, 0.3)';
            meridianCtx.lineWidth = 2;
            meridianCtx.lineCap = 'round';
            meridianCtx.stroke();
        }
    });
}

function animateQiFlow() {
    if (!isQiFlowing) return;
    
    // Clear canvas
    meridianCtx.clearRect(0, 0, meridianCanvas.width, meridianCanvas.height);
    
    // Redraw static meridians
    drawMeridians();
    
    // Animate flowing qi along paths
    meridianPaths.forEach((path, pathIndex) => {
        const points = [];
        
        // Get coordinates for each point in the path
        path.points.forEach(pointName => {
            const pointElement = document.querySelector(`.meridian-point[data-point="${pointName}"]`);
            if (pointElement) {
                const rect = pointElement.getBoundingClientRect();
                const canvasRect = meridianCanvas.getBoundingClientRect();
                
                const x = rect.left + rect.width/2 - canvasRect.left;
                const y = rect.top + rect.height/2 - canvasRect.top;
                
                points.push({ x, y });
            }
        });
        
        // Draw flowing qi along the path
        if (points.length > 1) {
            // Calculate animation progress based on time
            const now = Date.now();
            const progress = ((now / 1000) * 0.5 + pathIndex * 0.3) % 1;
            
            // Draw a glowing orb moving along the path
            let orbPosition = 0;
            let orbX, orbY;
            
            // Calculate total path length
            let totalLength = 0;
            for (let i = 1; i < points.length; i++) {
                totalLength += Math.sqrt(
                    Math.pow(points[i].x - points[i-1].x, 2) + 
                    Math.pow(points[i].y - points[i-1].y, 2)
                );
            }
            
            // Find orb position along path
            const targetLength = totalLength * progress;
            let accumulatedLength = 0;
            
            for (let i = 1; i < points.length; i++) {
                const segmentLength = Math.sqrt(
                    Math.pow(points[i].x - points[i-1].x, 2) + 
                    Math.pow(points[i].y - points[i-1].y, 2)
                );
                
                if (accumulatedLength + segmentLength >= targetLength) {
                    const segmentProgress = (targetLength - accumulatedLength) / segmentLength;
                    orbX = points[i-1].x + (points[i].x - points[i-1].x) * segmentProgress;
                    orbY = points[i-1].y + (points[i].y - points[i-1].y) * segmentProgress;
                    break;
                }
                
                accumulatedLength += segmentLength;
            }
            
            // Draw the glowing orb
            if (orbX !== undefined && orbY !== undefined) {
                // Glow effect
                meridianCtx.beginPath();
                meridianCtx.arc(orbX, orbY, 15, 0, Math.PI * 2);
                const gradient = meridianCtx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 15);
                gradient.addColorStop(0, 'rgba(74, 143, 231, 0.8)');
                gradient.addColorStop(1, 'rgba(74, 143, 231, 0)');
                meridianCtx.fillStyle = gradient;
                meridianCtx.fill();
                
                // Orb core
                meridianCtx.beginPath();
                meridianCtx.arc(orbX, orbY, 6, 0, Math.PI * 2);
                meridianCtx.fillStyle = '#7bb4f0';
                meridianCtx.fill();
                
                // Add pulse animation
                const pulseSize = 4 + Math.sin(now / 200) * 2;
                meridianCtx.beginPath();
                meridianCtx.arc(orbX, orbY, pulseSize, 0, Math.PI * 2);
                meridianCtx.fillStyle = '#ffffff';
                meridianCtx.fill();
            }
        }
    });
    
    // Update stats
    updateQiStats();
    
    // Continue animation
    if (isQiFlowing) {
        requestAnimationFrame(animateQiFlow);
    }
}

function activateMeridianPoint(pointName) {
    const point = document.querySelector(`.meridian-point[data-point="${pointName}"]`);
    if (!point) return;
    
    // Play qi sound
    qiSound.currentTime = 0;
    qiSound.play().catch(e => console.log("Audio play failed:", e));
    
    // Add activation effect
    const pointCircle = point.querySelector('.point-circle');
    pointCircle.style.animation = 'pulse-point 0.3s ease 3';
    
    // Reset after animation
    setTimeout(() => {
        pointCircle.style.animation = '';
    }, 1000);
}

function updateQiStats() {
    // Update qi level with random variation
    const currentQi = parseInt(qiLevelElement.textContent);
    const newQi = Math.min(100, Math.max(10, currentQi + (Math.random() * 4 - 2)));
    qiLevelElement.textContent = `${Math.round(newQi)}%`;
    
    // Update flow rate with slight variation
    const currentFlow = parseFloat(flowRateElement.textContent);
    const newFlow = Math.max(0.5, Math.min(8, currentFlow + (Math.random() * 0.4 - 0.2)));
    flowRateElement.textContent = `${newFlow.toFixed(1)} units/sec`;
}

// ===== NAVIGATION FUNCTIONS =====
function setupEventListeners() {
    // Seal navigation buttons
    sealButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
            
            // Play seal sound
            sealSound.currentTime = 0;
            sealSound.play().catch(e => console.log("Audio play failed:", e));
        });
    });
    
    // Skill tree controls
    treeControls.forEach(control => {
        control.addEventListener('click', function() {
            const action = this.id;
            handleTreeControl(action);
        });
    });
    
    // Meridian controls
    meridianButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.id;
            handleMeridianControl(action);
        });
    });
    
    // Canvas interaction for skill tree
    skillTreeCanvas.addEventListener('mousedown', startCanvasDrag);
    skillTreeCanvas.addEventListener('mousemove', dragCanvas);
    skillTreeCanvas.addEventListener('mouseup', endCanvasDrag);
    skillTreeCanvas.addEventListener('wheel', zoomCanvas);
    
    // Resize handling
    window.addEventListener('resize', handleResize);
}

function navigateToSection(sectionId) {
    // Update active seal button
    sealButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-section') === sectionId) {
            button.classList.add('active');
        }
    });
    
    // Hide all sections
    scrollSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Scroll to section smoothly
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // If navigating to skill tree or meridians, redraw canvases
        if (sectionId === 'skilltree') {
            setTimeout(() => {
                drawSkillTree();
            }, 300);
        } else if (sectionId === 'meridians') {
            setTimeout(() => {
                drawMeridians();
            }, 300);
        }
    }
}

function handleTreeControl(action) {
    switch(action) {
        case 'zoom-in':
            canvasScale = Math.min(2, canvasScale * 1.2);
            applyCanvasTransform();
            break;
        case 'zoom-out':
            canvasScale = Math.max(0.5, canvasScale / 1.2);
            applyCanvasTransform();
            break;
        case 'view-all':
            canvasScale = 1;
            canvasOffset = { x: 0, y: 0 };
            applyCanvasTransform();
            break;
        case 'reset-view':
            canvasScale = 1;
            canvasOffset = { x: 0, y: 0 };
            applyCanvasTransform();
            drawSkillTree();
            break;
    }
    
    // Update active button
    treeControls.forEach(btn => btn.classList.remove('active'));
    document.getElementById(action).classList.add('active');
}

function handleMeridianControl(action) {
    // Update active button
    meridianButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(action).classList.add('active');
    
    switch(action) {
        case 'flow-qi':
            if (!isQiFlowing) {
                isQiFlowing = true;
                animateQiFlow();
            }
            break;
        case 'block-meridian':
            if (isQiFlowing) {
                isQiFlowing = false;
            }
            // Simulate blockage by changing stats
            qiLevelElement.textContent = '42%';
            meridianOpenElement.textContent = '7/12';
            flowRateElement.textContent = '0.8 units/sec';
            break;
        case 'clear-meridian':
            if (!isQiFlowing) {
                isQiFlowing = true;
                animateQiFlow();
            }
            // Reset to optimal stats
            qiLevelElement.textContent = '96%';
            meridianOpenElement.textContent = '12/12';
            flowRateElement.textContent = '5.8 units/sec';
            break;
    }
}

// ===== CANVAS INTERACTION FUNCTIONS =====
function startCanvasDrag(e) {
    isDragging = true;
    dragStart = { x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y };
    skillTreeCanvas.style.cursor = 'grabbing';
}

function dragCanvas(e) {
    if (!isDragging) return;
    
    canvasOffset.x = e.clientX - dragStart.x;
    canvasOffset.y = e.clientY - dragStart.y;
    
    // Limit dragging bounds
    const maxOffset = 200;
    canvasOffset.x = Math.max(-maxOffset, Math.min(maxOffset, canvasOffset.x));
    canvasOffset.y = Math.max(-maxOffset, Math.min(maxOffset, canvasOffset.y));
    
    applyCanvasTransform();
}

function endCanvasDrag() {
    isDragging = false;
    skillTreeCanvas.style.cursor = 'grab';
}

function zoomCanvas(e) {
    e.preventDefault();
    
    const zoomIntensity = 0.001;
    const mouseX = e.clientX - skillTreeCanvas.getBoundingClientRect().left;
    const mouseY = e.clientY - skillTreeCanvas.getBoundingClientRect().top;
    
    const wheel = e.deltaY < 0 ? 1 : -1;
    const zoomFactor = 1 + wheel * zoomIntensity * 50;
    
    const newScale = Math.max(0.5, Math.min(2, canvasScale * zoomFactor));
    
    // Adjust offset to zoom toward mouse position
    canvasOffset.x = mouseX - (mouseX - canvasOffset.x) * (newScale / canvasScale);
    canvasOffset.y = mouseY - (mouseY - canvasOffset.y) * (newScale / canvasScale);
    
    canvasScale = newScale;
    applyCanvasTransform();
}

function applyCanvasTransform() {
    const container = document.querySelector('.skill-tree');
    container.style.transform = `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasScale})`;
}

// ===== UTILITY FUNCTIONS =====
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
    
    scrollProgressFill.style.width = `${scrollPercent}%`;
    scrollPercentage.textContent = `${scrollPercent}%`;
}

function animateProgressBars() {
    // Animate technique level bars
    const levelBars = document.querySelectorAll('.level-bar.filled');
    levelBars.forEach((bar, index) => {
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = '20px';
            bar.style.transition = 'width 0.5s ease';
        }, index * 200);
    });
    
    // Animate cultivation progress bars
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach((fill, index) => {
        const width = fill.style.width;
        fill.style.width = '0';
        setTimeout(() => {
            fill.style.width = width;
            fill.style.transition = 'width 1.5s ease';
        }, index * 300);
    });
}

function handleResize() {
    // Update canvas dimensions on resize
    if (skillTreeCanvas) {
        skillTreeCanvas.width = skillTreeCanvas.offsetWidth;
        skillTreeCanvas.height = skillTreeCanvas.offsetHeight;
        drawSkillTree();
    }
    
    if (meridianCanvas) {
        meridianCanvas.width = meridianCanvas.offsetWidth;
        meridianCanvas.height = meridianCanvas.offsetHeight;
        drawMeridians();
    }
}

// ===== ADDITIONAL EFFECTS =====
// Add ink bleed effect to text on hover
document.querySelectorAll('.ink-text, .technique-desc, .path-desc').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.textShadow = '1px 1px 2px rgba(139, 115, 85, 0.3)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.textShadow = 'none';
    });
});

// Add floating effect to skill nodes
function floatSkillNodes() {
    skillNodes.forEach((node, index) => {
        node.style.animation = `float-node ${3 + index * 0.5}s ease-in-out infinite`;
        node.style.animationDelay = `${index * 0.2}s`;
    });
}

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float-node {
        0%, 100% { transform: translate(-50%, -50%) translateY(0); }
        50% { transform: translate(-50%, -50%) translateY(-10px); }
    }
    
    .skill-notification .notification-content {
        display: flex;
        align-items: center;
        gap: 0.8rem;
    }
    
    .skill-notification i {
        color: #4a7c42;
        font-size: 1.5rem;
    }
    
    .skill-notification span {
        font-family: var(--font-body);
        font-size: 1rem;
        color: var(--color-ink-black);
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Start floating animation after page load
setTimeout(floatSkillNodes, 2000);

// Initialize floating animation for meridian points
meridianPoints.forEach((point, index) => {
    point.style.animation = `float-node ${4 + index * 0.3}s ease-in-out infinite`;
    point.style.animationDelay = `${index * 0.3}s`;
});

// Add hover effect to technique cards
document.querySelectorAll('.technique-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.technique-icon');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.technique-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Add random particle effect to meridian diagram
function createQiParticles() {
    if (!meridianCanvas || !isQiFlowing) return;
    
    const particleCount = 5;
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const x = Math.random() * meridianCanvas.width;
            const y = Math.random() * meridianCanvas.height;
            
            meridianCtx.beginPath();
            meridianCtx.arc(x, y, 2, 0, Math.PI * 2);
            meridianCtx.fillStyle = 'rgba(123, 180, 240, 0.7)';
            meridianCtx.fill();
            
            // Animate particle fading
            let opacity = 0.7;
            const fadeInterval = setInterval(() => {
                opacity -= 0.05;
                meridianCtx.clearRect(x-3, y-3, 6, 6);
                
                meridianCtx.beginPath();
                meridianCtx.arc(x, y, 2, 0, Math.PI * 2);
                meridianCtx.fillStyle = `rgba(123, 180, 240, ${opacity})`;
                meridianCtx.fill();
                
                if (opacity <= 0) {
                    clearInterval(fadeInterval);
                }
            }, 50);
        }, i * 200);
    }
}

// Start particle effect when qi is flowing
setInterval(() => {
    if (isQiFlowing && currentSection === 'meridians') {
        createQiParticles();
    }
}, 1000);