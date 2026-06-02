/**
 * AetherCode Core Engine
 * Implements procedural visualizations and immersive interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initCommandPalette();
    initContributionNebula();
    initCommitGraph();
    initFileExplorer();
});

/**
 * 1. Command Palette Logic
 * Implements the ⌘K quick-jump interface
 */
function initCommandPalette() {
    const overlay = document.getElementById('commandPalette');
    const input = document.getElementById('commandInput');

    const togglePalette = (show) => {
        overlay.style.display = show ? 'flex' : 'none';
        if (show) input.focus();
    };

    window.addEventListener('keydown', (e) => {
        // Detect Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            togglePalette(overlay.style.display === 'none');
        }
        if (e.key === 'Escape') togglePalette(false);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) togglePalette(false);
    });
}

/**
 * 2. Contribution Nebula
 * Generates a randomized, high-density heatmap of activity
 */
function initContributionNebula() {
    const heatmap = document.getElementById('heatmap');
    const cellCount = 120; // 20 cols * 6 rows
    const intensities = ['#0d0d12', '#16161f', '#1a3a3a', '#00f2ff44', '#00f2ffaa', '#00f2ff'];

    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        
        // Randomly assign intensity to simulate real activity
        const randomIntensity = intensities[Math.floor(Math.random() * intensities.length)];
        cell.style.backgroundColor = randomIntensity;
        
        // Add a slight delay to create a staggered reveal effect on load
        cell.style.opacity = '0';
        heatmap.appendChild(cell);

        setTimeout(() => {
            cell.style.opacity = '1';
            cell.style.transition = 'opacity 0.5s ease';
        }, i * 10);
    }
}

/**
 * 3. Temporal Flux (Commit Graph)
 * Procedural Canvas animation of a neural-style commit network
 */
function initCommitGraph() {
    const canvas = document.getElementById('commitGraph');
    const ctx = canvas.getContext('2d');
    let width, height, nodes = [];
    const nodeCount = 25;
    const connectionDistance = 150;
    let mouse = { x: null, y: null };

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 3 + 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction: subtle repulsion
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    this.x += dx * 0.01;
                    this.y += dy * 0.01;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00f2ff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f2ff';
            ctx.fill();
            ctx.closePath();
        }
    }

    for (let i = 0; i < nodeCount; i++) nodes.push(new Node());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        nodes.forEach((node, index) => {
            node.update();
            node.draw();

            // Draw connections between nearby nodes
            for (let j = index + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    const alpha = 1 - (dist / connectionDistance);
                    ctx.strokeStyle = `rgba(0, 242, 255, ${alpha * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * 4. File Explorer Interactivity
 * Handles folder toggles and file selection
 */
function initFileExplorer() {
    const folders = document.querySelectorAll('.folder-toggle');
    const files = document.querySelectorAll('.tree-item.file');

    folders.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const children = toggle.parentElement.querySelector('.tree-children');
            if (children) {
                const isOpen = children.style.display === 'block';
                children.style.display = isOpen ? 'none' : 'block';
                toggle.innerText = isOpen ? '▶' : '▼';
            }
        });
    });

    files.forEach(file => {
        file.addEventListener('click', () => {
            document.querySelectorAll('.tree-item.file').forEach(f => f.classList.remove('active'));
            file.classList.add('active');
            
            // Visual feedback in the tab
            const activeTab = document.querySelector('.tab.active');
            if (activeTab) {
                activeTab.innerText = file.innerText;
            }
        });
    });
}