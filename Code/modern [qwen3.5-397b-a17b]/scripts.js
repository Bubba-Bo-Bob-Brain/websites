/**
 * NEXUS - Source Code Management Platform
 * Main Entry Point
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCommitGraph();
    initHeatmap();
    initFileExplorer();
    initUIInteractions();
});

/**
 * MODULE: Commit Graph Visualization
 * Draws a procedural, glowing graph on the canvas to simulate live commits.
 */
function initCommitGraph() {
    const canvas = document.getElementById('commitGraph');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Configuration
    const config = {
        nodeCount: 0,
        maxNodes: 60,
        speed: 1.5,
        branchChance: 0.02,
        mergeChance: 0.01,
        colors: {
            main: '#00f0ff',
            branch: '#ff5e00',
            node: '#ffffff',
            grid: 'rgba(255, 255, 255, 0.03)'
        }
    };

    // State
    let branches = [];
    let nodes = [];

    // Resize handler
    function resize() {
        const parent = canvas.parentElement;
        width = parent.clientWidth;
        height = parent.clientHeight;
        canvas.width = width;
        canvas.height = height;
        initGraph();
    }
    window.addEventListener('resize', resize);

    class Node {
        constructor(x, y, branchId) {
            this.x = x;
            this.y = y;
            this.branchId = branchId;
            this.radius = 3;
            this.alpha = 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = config.colors.node;
            ctx.shadowBlur = 10;
            ctx.shadowColor = config.colors.main;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    class Branch {
        constructor(id, x, color) {
            this.id = id;
            this.x = x;
            this.y = height;
            this.color = color;
            this.speedY = config.speed + Math.random();
            this.history = []; // Store last few points for drawing lines
            this.active = true;
        }

        update() {
            if (!this.active) return;

            // Move Up
            this.y -= this.speedY;

            // Add to history
            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > 50) this.history.shift();

            // Create Node
            if (Math.random() > 0.8) {
                nodes.push(new Node(this.x, this.y, this.id));
                if (nodes.length > config.maxNodes) nodes.shift();
            }

            // Branching Logic
            if (Math.random() < config.branchChance && this.history.length > 10) {
                // Create a new branch
                const newBranch = new Branch(
                    Date.now(), 
                    this.x + (Math.random() > 0.5 ? 40 : -40), 
                    config.colors.branch
                );
                branches.push(newBranch);
            }
        }

        draw() {
            if (!this.active || this.history.length < 2) return;

            ctx.beginPath();
            ctx.moveTo(this.history[0].x, this.history[0].y);
            
            // Bezier curve for smooth lines
            for (let i = 1; i < this.history.length; i++) {
                const prev = this.history[i-1];
                const curr = this.history[i];
                const midX = (prev.x + curr.x) / 2;
                const midY = (prev.y + curr.y) / 2;
                ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
            }
            ctx.lineTo(this.x, this.y);

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    function initGraph() {
        branches = [];
        nodes = [];
        // Start with one main branch
        branches.push(new Branch(1, width / 2, config.colors.main));
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Grid Background
        ctx.strokeStyle = config.colors.grid;
        ctx.lineWidth = 1;
        const gridSize = 40;
        // Simple moving grid effect could go here
        
        // Update and Draw Branches
        branches.forEach((branch, index) => {
            branch.update();
            branch.draw();
            if (branch.y < -100) branch.active = false;
        });

        // Remove inactive branches
        branches = branches.filter(b => b.active);

        // Draw Nodes
        nodes.forEach(node => node.draw());

        requestAnimationFrame(animate);
    }

    resize();
    animate();
}

/**
 * MODULE: Contribution Heatmap
 * Generates a grid of squares representing activity.
 */
function initHeatmap() {
    const container = document.getElementById('heatmap');
    if (!container) return;

    const weeks = 52; // Approximate weeks in a year
    const days = 7; // Mon-Sun (simplified for visual)

    for (let i = 0; i < weeks * days; i++) {
        const cell = document.createElement('div');
        cell.classList.add('heat-cell');
        
        // Randomize activity level (0-4)
        const activity = Math.random();
        let level = 0;
        if (activity > 0.9) level = 4;
        else if (activity > 0.7) level = 3;
        else if (activity > 0.4) level = 2;
        else if (activity > 0.2) level = 1;
        
        cell.classList.add(`heat-${level}`);
        
        // Tooltip on hover (simple title attribute for now)
        cell.title = `${level * 3} contributions`;
        
        container.appendChild(cell);
    }
}

/**
 * MODULE: File Explorer
 * Handles tree expansion and file selection.
 */
function initFileExplorer() {
    const folders = document.querySelectorAll('.tree-item.folder');
    const files = document.querySelectorAll('.tree-item.file');

    // Toggle Folders
    folders.forEach(folder => {
        folder.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling
            
            const icon = folder.querySelector('i[data-lucide="chevron-right"], i[data-lucide="chevron-down"]');
            const childrenContainer = folder.nextElementSibling;
            
            if (childrenContainer && childrenContainer.classList.contains('tree-children')) {
                const isExpanded = folder.classList.contains('expanded');
                
                if (isExpanded) {
                    folder.classList.remove('expanded');
                    childrenContainer.style.display = 'none';
                    if(icon) {
                        icon.setAttribute('data-lucide', 'chevron-right');
                        icon.parentElement.innerHTML = icon.parentElement.innerHTML.replace('chevron-down', 'chevron-right');
                    }
                } else {
                    folder.classList.add('expanded');
                    childrenContainer.style.display = 'flex';
                    if(icon) {
                        icon.setAttribute('data-lucide', 'chevron-down');
                        icon.parentElement.innerHTML = icon.parentElement.innerHTML.replace('chevron-right', 'chevron-down');
                    }
                }
                // Re-initialize icons after DOM change
                lucide.createIcons();
            }
        });
    });

    // Select Files
    files.forEach(file => {
        file.addEventListener('click', (e) => {
            e.stopPropagation();
            // Remove active from all
            files.forEach(f => f.classList.remove('active'));
            // Add to clicked
            file.classList.add('active');
            
            // Simulate loading code content
            const fileName = file.querySelector('span').innerText;
            updateCodeViewer(fileName);
        });
    });
}

/**
 * MODULE: UI Interactions
 * General interface polish.
 */
function initUIInteractions() {
    // Search Focus Effect
    const searchInput = document.querySelector('.search-input');
    const searchContainer = document.querySelector('.nav-search');
    
    searchInput.addEventListener('focus', () => {
        searchContainer.style.borderColor = 'var(--accent-cyan)';
        searchContainer.style.boxShadow = '0 0 15px var(--accent-cyan-dim)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchContainer.style.borderColor = 'var(--border-subtle)';
        searchContainer.style.boxShadow = 'none';
    });

    // Button Ripple Effect (Simplified)
    const buttons = document.querySelectorAll('.btn, .icon-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add a temporary flash class or logic here if desired
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Initialize Icons
    lucide.createIcons();
}

/**
 * Helper: Simulate Code Viewer Update
 */
function updateCodeViewer(filename) {
    const tabs = document.querySelectorAll('.tab');
    const activeTab = document.querySelector('.tab.active');
    
    if(activeTab) {
        // Update text content of active tab
        const iconHtml = activeTab.querySelector('i').outerHTML;
        activeTab.innerHTML = `${iconHtml} ${filename}`;
        lucide.createIcons();
    }
    
    // In a real app, this would fetch the file content via API
    console.log(`Loading file: ${filename}`);
}