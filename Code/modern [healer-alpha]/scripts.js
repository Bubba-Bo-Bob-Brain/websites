// ==========================================================================
// NexusForge - Advanced Source Code Collaboration Platform
// JavaScript Interactive Features
// ==========================================================================

// ==========================================================================
// Configuration & Constants
// ==========================================================================
const CONFIG = {
    ANIMATION_DURATION: 300,
    PARTICLE_COUNT: 100,
    COMMIT_GRAPH_POINTS: 24,
    HEATMAP_WEEKS: 53,
    HEATMAP_DAYS: 7,
    AUTO_REFRESH_INTERVAL: 30000,
    COMMAND_PALETTE_SHORTCUT: 'Ctrl+K',
    ACTIVITY_FEED_LIMIT: 8
};

// ==========================================================================
// Utility Functions
// ==========================================================================
class NexusForgeUtils {
    static formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
        });
    }

    static formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }

    static formatRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return NexusForgeUtils.formatDate(date);
    }

    static generateRandomColor() {
        const colors = ['#00f5ff', '#ff00ff', '#4d7cff', '#00ff88', '#ff9500', '#9d4edd'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = start + (end - start) * progress;
            element.textContent = Math.floor(value);
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };
        requestAnimationFrame(updateValue);
    }
}

// ==========================================================================
// Particle System with Three.js
// ==========================================================================
class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true
        });
        
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        // Setup camera
        this.camera.position.z = 50;
        
        // Create particles
        this.createParticles();
        
        // Add event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Start animation
        this.animate();
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
        const colors = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
        
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            
            // Cyan color with variation
            colors[i * 3] = 0;
            colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
            colors[i * 3 + 2] = 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        this.mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        this.mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Rotate particles based on mouse movement
        this.particles.rotation.x += 0.0005 + this.mouseY * 0.0005;
        this.particles.rotation.y += 0.001 + this.mouseX * 0.001;
        
        // Subtle floating animation
        const time = Date.now() * 0.0005;
        this.particles.position.y = Math.sin(time) * 2;
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ==========================================================================
// Commit Graph Visualization
// ==========================================================================
class CommitGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.data = this.generateData();
        this.animationProgress = 0;
        
        this.init();
    }
    
    generateData() {
        const data = {
            commits: [],
            pushes: [],
            merges: []
        };
        
        for (let i = 0; i < CONFIG.COMMIT_GRAPH_POINTS; i++) {
            // Generate realistic commit patterns (more during work hours)
            const hour = i;
            let baseActivity = 0;
            
            if (hour >= 9 && hour <= 17) {
                baseActivity = 5 + Math.random() * 10;
            } else if (hour >= 7 && hour <= 19) {
                baseActivity = 2 + Math.random() * 5;
            } else {
                baseActivity = Math.random() * 2;
            }
            
            data.commits.push({
                x: i,
                y: baseActivity + Math.random() * 3
            });
            
            data.pushes.push({
                x: i,
                y: Math.max(0, baseActivity * 0.7 + Math.random() * 2 - 1)
            });
            
            data.merges.push({
                x: i,
                y: Math.max(0, baseActivity * 0.3 + Math.random() * 1.5 - 0.5)
            });
        }
        
        return data;
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', NexusForgeUtils.debounce(() => this.resize(), 250));
        this.animate();
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }
    
    draw() {
        const { width, height } = this.canvas;
        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const graphWidth = width - padding.left - padding.right;
        const graphHeight = height - padding.top - padding.bottom;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        this.drawGrid(padding, graphWidth, graphHeight);
        
        // Draw data lines with animation
        this.drawLine(this.data.commits, '#00f5ff', padding, graphWidth, graphHeight);
        this.drawLine(this.data.pushes, '#ff00ff', padding, graphWidth, graphHeight);
        this.drawLine(this.data.merges, '#00ff88', padding, graphWidth, graphHeight);
        
        // Draw axes
        this.drawAxes(padding, graphWidth, graphHeight);
    }
    
    drawGrid(padding, graphWidth, graphHeight) {
        this.ctx.strokeStyle = 'rgba(42, 42, 58, 0.5)';
        this.ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (graphHeight / 5) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(padding.left, y);
            this.ctx.lineTo(padding.left + graphWidth, y);
            this.ctx.stroke();
        }
        
        // Vertical grid lines
        for (let i = 0; i <= CONFIG.COMMIT_GRAPH_POINTS; i++) {
            const x = padding.left + (graphWidth / CONFIG.COMMIT_GRAPH_POINTS) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, padding.top);
            this.ctx.lineTo(x, padding.top + graphHeight);
            this.ctx.stroke();
        }
    }
    
    drawLine(data, color, padding, graphWidth, graphHeight) {
        if (data.length === 0) return;
        
        const maxValue = Math.max(...data.map(d => d.y), 1);
        const pointSpacing = graphWidth / (data.length - 1);
        
        // Create gradient for line
        const gradient = this.ctx.createLinearGradient(0, 0, 0, graphHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, `${color}33`);
        
        // Draw area under the curve
        this.ctx.beginPath();
        this.ctx.moveTo(padding.left, padding.top + graphHeight);
        
        data.forEach((point, index) => {
            const x = padding.left + index * pointSpacing;
            const y = padding.top + graphHeight - (point.y / maxValue) * graphHeight * this.animationProgress;
            
            if (index === 0) {
                this.ctx.lineTo(x, y);
            } else {
                const prevX = padding.left + (index - 1) * pointSpacing;
                const prevY = padding.top + graphHeight - (data[index - 1].y / maxValue) * graphHeight * this.animationProgress;
                
                // Smooth curve using bezier curves
                const cpX = (prevX + x) / 2;
                this.ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
            }
        });
        
        this.ctx.lineTo(padding.left + graphWidth, padding.top + graphHeight);
        this.ctx.closePath();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Draw line on top
        this.ctx.beginPath();
        data.forEach((point, index) => {
            const x = padding.left + index * pointSpacing;
            const y = padding.top + graphHeight - (point.y / maxValue) * graphHeight * this.animationProgress;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                const prevX = padding.left + (index - 1) * pointSpacing;
                const prevY = padding.top + graphHeight - (data[index - 1].y / maxValue) * graphHeight * this.animationProgress;
                
                const cpX = (prevX + x) / 2;
                this.ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
            }
        });
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw points
        data.forEach((point, index) => {
            const x = padding.left + index * pointSpacing;
            const y = padding.top + graphHeight - (point.y / maxValue) * graphHeight * this.animationProgress;
            
            // Only draw points if they're significant
            if (point.y > 1) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = color;
                this.ctx.fill();
                
                // Add glow effect
                this.ctx.beginPath();
                this.ctx.arc(x, y, 6, 0, Math.PI * 2);
                this.ctx.fillStyle = `${color}33`;
                this.ctx.fill();
            }
        });
    }
    
    drawAxes(padding, graphWidth, graphHeight) {
        this.ctx.fillStyle = '#a0a0b0';
        this.ctx.font = '10px "JetBrains Mono", monospace';
        
        // Y-axis labels
        const maxValue = Math.max(...this.data.commits.map(d => d.y), 1);
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * (5 - i));
            const y = padding.top + (graphHeight / 5) * i;
            this.ctx.fillText(value.toString(), 10, y + 3);
        }
        
        // X-axis labels (hours)
        const hourLabels = ['00:00', '06:00', '12:00', '18:00', '24:00'];
        hourLabels.forEach((label, index) => {
            const x = padding.left + (graphWidth / (hourLabels.length - 1)) * index;
            this.ctx.fillText(label, x - 15, padding.top + graphHeight + 20);
        });
    }
    
    animate() {
        if (this.animationProgress < 1) {
            this.animationProgress += 0.02;
            this.draw();
            requestAnimationFrame(this.animate.bind(this));
        } else {
            // Draw final state
            this.animationProgress = 1;
            this.draw();
            
            // Add interactivity after animation
            this.addInteractivity();
        }
    }
    
    addInteractivity() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find nearest data point
            const padding = { left: 40, right: 20, top: 20, bottom: 30 };
            const graphWidth = rect.width - padding.left - padding.right;
            const pointSpacing = graphWidth / (this.data.commits.length - 1);
            
            const dataIndex = Math.round((x - padding.left) / pointSpacing);
            if (dataIndex >= 0 && dataIndex < this.data.commits.length) {
                // Show tooltip (simplified)
                console.log(`Hour: ${dataIndex}:00, Commits: ${Math.round(this.data.commits[dataIndex].y)}`);
            }
        });
    }
    
    updateTimeRange(range) {
        // Reset animation and regenerate data based on range
        this.animationProgress = 0;
        this.data = this.generateData();
        this.animate();
    }
}

// ==========================================================================
// Contribution Heatmap
// ==========================================================================
class ContributionHeatmap {
    constructor(gridId) {
        this.grid = document.getElementById(gridId);
        if (!this.grid) return;
        
        this.data = this.generateData();
        this.init();
    }
    
    generateData() {
        const data = [];
        const today = new Date();
        
        for (let week = 0; week < CONFIG.HEATMAP_WEEKS; week++) {
            for (let day = 0; day < CONFIG.HEATMAP_DAYS; day++) {
                const date = new Date(today);
                date.setDate(today.getDate() - ((CONFIG.HEATMAP_WEEKS - 1 - week) * 7 + (CONFIG.HEATMAP_DAYS - 1 - day)));
                
                // Generate contribution level (0-5)
                // Higher on weekdays, with some randomness
                const dayOfWeek = date.getDay();
                let level = 0;
                
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    // Weekday
                    level = Math.floor(Math.random() * 3) + 1;
                    if (Math.random() > 0.7) level += 2;
                } else {
                    // Weekend
                    level = Math.floor(Math.random() * 2);
                }
                
                // Cap at 5
                level = Math.min(level, 5);
                
                data.push({
                    date: date,
                    level: level,
                    contributions: level * Math.floor(Math.random() * 3 + 1)
                });
            }
        }
        
        return data;
    }
    
    init() {
        this.render();
        this.addInteractivity();
    }
    
    render() {
        this.grid.innerHTML = '';
        
        this.data.forEach((item, index) => {
            const cell = document.createElement('div');
            cell.className = `heatmap-cell level-${item.level}`;
            cell.title = `${NexusForgeUtils.formatDate(item.date)}: ${item.contributions} contributions`;
            cell.dataset.date = item.date.toISOString();
            
            // Add animation delay based on position
            const week = Math.floor(index / CONFIG.HEATMAP_DAYS);
            const day = index % CONFIG.HEATMAP_DAYS;
            cell.style.animationDelay = `${(week + day) * 0.01}s`;
            
            this.grid.appendChild(cell);
        });
    }
    
    addInteractivity() {
        const cells = this.grid.querySelectorAll('.heatmap-cell');
        
        cells.forEach(cell => {
            cell.addEventListener('mouseenter', () => {
                // Scale up effect handled in CSS
            });
            
            cell.addEventListener('click', () => {
                const date = new Date(cell.dataset.date);
                const contributions = this.data.find(item => 
                    item.date.toDateString() === date.toDateString()
                )?.contributions || 0;
                
                this.showContributionDetails(date, contributions);
            });
        });
    }
    
    showContributionDetails(date, contributions) {
        // Create a simple tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'heatmap-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-date">${NexusForgeUtils.formatDate(date)}</div>
            <div class="tooltip-contributions">${contributions} contributions</div>
        `;
        
        // Position tooltip
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'var(--bg-elevated)';
        tooltip.style.border = '1px solid var(--border-primary)';
        tooltip.style.borderRadius = 'var(--radius-md)';
        tooltip.style.padding = 'var(--space-sm)';
        tooltip.style.zIndex = '1000';
        tooltip.style.boxShadow = 'var(--shadow-glow-cyan)';
        
        document.body.appendChild(tooltip);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 3000);
    }
    
    switchView(view) {
        // Regenerate data with different parameters based on view
        if (view === 'month') {
            // Generate last 30 days instead of full year
            this.data = this.generateMonthData();
        } else {
            this.data = this.generateData();
        }
        
        this.render();
    }
    
    generateMonthData() {
        const data = [];
        const today = new Date();
        
        for (let day = 0; day < 30; day++) {
            const date = new Date(today);
            date.setDate(today.getDate() - (29 - day));
            
            // Generate contribution level
            const dayOfWeek = date.getDay();
            let level = 0;
            
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                level = Math.floor(Math.random() * 4) + 1;
            } else {
                level = Math.floor(Math.random() * 2);
            }
            
            level = Math.min(level, 5);
            
            data.push({
                date: date,
                level: level,
                contributions: level * Math.floor(Math.random() * 4 + 1)
            });
        }
        
        return data;
    }
}

// ==========================================================================
// File Tree Explorer
// ==========================================================================
class FileTreeExplorer {
    constructor(treeId) {
        this.tree = document.getElementById(treeId);
        if (!this.tree) return;
        
        this.fileStructure = this.generateFileStructure();
        this.init();
    }
    
    generateFileStructure() {
        return [
            {
                name: 'src',
                type: 'folder',
                children: [
                    {
                        name: 'core',
                        type: 'folder',
                        children: [
                            { name: 'main.rs', type: 'file', language: 'rust' },
                            { name: 'lib.rs', type: 'file', language: 'rust' },
                            { name: 'config.rs', type: 'file', language: 'rust' }
                        ]
                    },
                    {
                        name: 'api',
                        type: 'folder',
                        children: [
                            { name: 'routes.rs', type: 'file', language: 'rust' },
                            { name: 'handlers.rs', type: 'file', language: 'rust' },
                            { name: 'middleware.rs', type: 'file', language: 'rust' }
                        ]
                    },
                    {
                        name: 'utils',
                        type: 'folder',
                        children: [
                            { name: 'helpers.rs', type: 'file', language: 'rust' },
                            { name: 'validators.rs', type: 'file', language: 'rust' }
                        ]
                    }
                ]
            },
            {
                name: 'tests',
                type: 'folder',
                children: [
                    { name: 'integration_tests.rs', type: 'file', language: 'rust' },
                    { name: 'unit_tests.rs', type: 'file', language: 'rust' }
                ]
            },
            {
                name: 'docs',
                type: 'folder',
                children: [
                    { name: 'README.md', type: 'file', language: 'markdown' },
                    { name: 'API.md', type: 'file', language: 'markdown' },
                    { name: 'CONTRIBUTING.md', type: 'file', language: 'markdown' }
                ]
            },
            { name: 'Cargo.toml', type: 'file', language: 'toml' },
            { name: 'Dockerfile', type: 'file', language: 'dockerfile' },
            { name: '.gitignore', type: 'file', language: 'git' },
            { name: 'nexusforge.toml', type: 'file', language: 'toml' }
        ];
    }
    
    init() {
        this.renderTree(this.fileStructure, this.tree, 0);
        this.addInteractivity();
    }
    
    renderTree(items, container, level) {
        items.forEach(item => {
            const treeItem = document.createElement('div');
            treeItem.className = 'tree-item';
            
            if (item.type === 'folder') {
                treeItem.classList.add('folder');
                
                // Add indentation
                for (let i = 0; i < level; i++) {
                    const indent = document.createElement('div');
                    indent.className = 'tree-indent';
                    treeItem.appendChild(indent);
                }
                
                // Add folder icon
                const icon = document.createElement('span');
                icon.className = 'icon';
                icon.textContent = '📁';
                treeItem.appendChild(icon);
                
                // Add folder name
                const name = document.createElement('span');
                name.className = 'name';
                name.textContent = item.name;
                treeItem.appendChild(name);
                
                container.appendChild(treeItem);
                
                // Create container for children
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'tree-children';
                childrenContainer.style.display = 'none';
                container.appendChild(childrenContainer);
                
                // Toggle folder on click
                treeItem.addEventListener('click', () => {
                    const isExpanded = childrenContainer.style.display === 'block';
                    childrenContainer.style.display = isExpanded ? 'none' : 'block';
                    icon.textContent = isExpanded ? '📁' : '📂';
                    
                    if (!isExpanded && childrenContainer.children.length === 0) {
                        this.renderTree(item.children, childrenContainer, level + 1);
                    }
                });
            } else {
                // File item
                for (let i = 0; i < level; i++) {
                    const indent = document.createElement('div');
                    indent.className = 'tree-indent';
                    treeItem.appendChild(indent);
                }
                
                // Add file icon based on language
                const icon = document.createElement('span');
                icon.className = 'icon';
                icon.textContent = this.getFileIcon(item.language);
                treeItem.appendChild(icon);
                
                // Add file name
                const name = document.createElement('span');
                name.className = 'name';
                name.textContent = item.name;
                treeItem.appendChild(name);
                
                container.appendChild(treeItem);
                
                // Select file on click
                treeItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectFile(item, treeItem);
                });
            }
        });
    }
    
    getFileIcon(language) {
        const icons = {
            'rust': '🦀',
            'markdown': '📄',
            'toml': '⚙️',
            'dockerfile': '🐳',
            'git': '🔒',
            'javascript': '📜',
            'typescript': '📘'
        };
        
        return icons[language] || '📄';
    }
    
    selectFile(file, element) {
        // Remove selected class from all items
        const allItems = this.tree.querySelectorAll('.tree-item');
        allItems.forEach(item => item.classList.remove('selected'));
        
        // Add selected class to clicked item
        element.classList.add('selected');
        
        // Update file preview
        this.updateFilePreview(file);
    }
    
    updateFilePreview(file) {
        const fileNameElement = document.querySelector('.file-name');
        const codePreviewElement = document.getElementById('codePreview');
        
        if (fileNameElement && codePreviewElement) {
            fileNameElement.textContent = file.name;
            
            // Generate sample code based on file type
            const sampleCode = this.generateSampleCode(file);
            codePreviewElement.textContent = sampleCode;
            
            // Add syntax highlighting (simplified)
            this.highlightCode(codePreviewElement, file.language);
        }
    }
    
    generateSampleCode(file) {
        const samples = {
            'main.rs': `// NexusForge Core Engine - Main Entry Point
use nexusforge::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize the NexusForge runtime
    let config = Config::load("nexusforge.toml")?;
    let runtime = Runtime::initialize(config).await?;
    
    // Start the collaborative editing server
    let server = CollaborationServer::new(runtime);
    server.start().await?;
    
    println!("NexusForge engine initialized successfully");
    Ok(())
}`,
            'lib.rs': `// NexusForge Core Library
pub mod api;
pub mod core;
pub mod utils;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NexusForgeConfig {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub auth: AuthConfig,
}

impl Default for NexusForgeConfig {
    fn default() -> Self {
        Self {
            server: ServerConfig::default(),
            database: DatabaseConfig::default(),
            auth: AuthConfig::default(),
        }
    }
}`,
            'Cargo.toml': `[package]
name = "nexusforge"
version = "3.2.1"
edition = "2021"
authors = ["NexusForge Team <team@nexusforge.dev>"]
description = "Advanced Source Code Collaboration Platform"

[dependencies]
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
actix-web = "4.0"
sqlx = { version = "0.6", features = ["postgres", "runtime-tokio-native-tls"] }`,
            'README.md': `# NexusForge

## Advanced Source Code Collaboration Platform

NexusForge is a next-generation source code management and collaboration platform designed for modern development teams.

### Features

- 🚀 **Real-time Collaboration**: Work together on code in real-time
- 🔒 **Enterprise Security**: Advanced security features and compliance
- 📊 **Advanced Analytics**: Deep insights into your development workflow
- 🔗 **Seamless Integration**: Integrate with your favorite tools

### Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/nexusforge/nexusforge.git

# Build the project
cargo build --release

# Run the server
./target/release/nexusforge
\`\`\`

### Documentation

For full documentation, visit [docs.nexusforge.dev](https://docs.nexusforge.dev)`
        };
        
        return samples[file.name] || `// ${file.name}\n// This file is part of the NexusForge project\n\n// TODO: Implement ${file.name}`;
    }
    
    highlightCode(element, language) {
        // Simplified syntax highlighting
        const code = element.textContent;
        let highlighted = code;
        
        if (language === 'rust') {
            // Highlight Rust keywords
            const keywords = ['use', 'mod', 'pub', 'fn', 'async', 'await', 'let', 'mut', 'struct', 'impl', 'trait', 'enum', 'const', 'static', 'type', 'where', 'self', 'Self', 'super', 'crate'];
            
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                highlighted = highlighted.replace(regex, `<span style="color: #ff00ff;">${keyword}</span>`);
            });
            
            // Highlight strings
            highlighted = highlighted.replace(/"([^"]*)"/g, '<span style="color: #00ff88;">"$1"</span>');
            
            // Highlight comments
            highlighted = highlighted.replace(/\/\/(.*)$/gm, '<span style="color: #606070;">//$1</span>');
            
            // Highlight macros
            highlighted = highlighted.replace(/#\[([^\]]*)\]/g, '<span style="color: #ff9500;">#[$1]</span>');
        }
        
        element.innerHTML = highlighted;
    }
    
    addInteractivity() {
        // Expand first folder by default
        const firstFolder = this.tree.querySelector('.tree-item.folder');
        if (firstFolder) {
            firstFolder.click();
        }
    }
}

// ==========================================================================
// Merge Requests Manager
// ==========================================================================
class MergeRequestsManager {
    constructor(listId) {
        this.list = document.getElementById(listId);
        if (!this.list) return;
        
        this.mergeRequests = this.generateMergeRequests();
        this.init();
    }
    
    generateMergeRequests() {
        return [
            {
                id: 'MR-001',
                title: 'Add real-time collaboration features',
                author: 'alex_dev',
                branch: 'feature/realtime-collab',
                status: 'review',
                created: new Date(Date.now() - 3600000 * 2),
                checks: { tests: 'pass', lint: 'pass', build: 'pending' }
            },
            {
                id: 'MR-002',
                title: 'Fix authentication token refresh issue',
                author: 'sarah_bugfix',
                branch: 'bugfix/auth-token',
                status: 'approved',
                created: new Date(Date.now() - 3600000 * 5),
                checks: { tests: 'pass', lint: 'pass', build: 'pass' }
            },
            {
                id: 'MR-003',
                title: 'Update documentation for API v2',
                author: 'mike_docs',
                branch: 'docs/api-v2',
                status: 'draft',
                created: new Date(Date.now() - 3600000 * 24),
                checks: { tests: 'pending', lint: 'pass', build: 'pending' }
            },
            {
                id: 'MR-004',
                title: 'Implement merge request approvals workflow',
                author: 'emma_workflow',
                branch: 'feature/approval-workflow',
                status: 'review',
                created: new Date(Date.now() - 3600000 * 8),
                checks: { tests: 'pass', lint: 'fail', build: 'pass' }
            },
            {
                id: 'MR-005',
                title: 'Refactor database connection pooling',
                author: 'david_perf',
                branch: 'refactor/db-pool',
                status: 'approved',
                created: new Date(Date.now() - 3600000 * 12),
                checks: { tests: 'pass', lint: 'pass', build: 'pass' }
            }
        ];
    }
    
    init() {
        this.render();
        this.addInteractivity();
        this.startAutoRefresh();
    }
    
    render() {
        this.list.innerHTML = '';
        
        this.mergeRequests.forEach(mr => {
            const item = document.createElement('div');
            item.className = 'mr-item';
            item.dataset.id = mr.id;
            
            // Status indicator
            const status = document.createElement('div');
            status.className = `mr-status ${mr.status}`;
            item.appendChild(status);
            
            // Content
            const content = document.createElement('div');
            content.className = 'mr-content';
            
            // Title
            const title = document.createElement('div');
            title.className = 'mr-title';
            title.textContent = mr.title;
            content.appendChild(title);
            
            // Meta information
            const meta = document.createElement('div');
            meta.className = 'mr-meta';
            
            // Branch
            const branch = document.createElement('span');
            branch.className = 'mr-branch';
            branch.textContent = mr.branch;
            meta.appendChild(branch);
            
            // Time
            const time = document.createElement('span');
            time.textContent = NexusForgeUtils.formatRelativeTime(mr.created);
            meta.appendChild(time);
            
            // Checks
            const checks = document.createElement('div');
            checks.className = 'mr-checks';
            
            Object.entries(mr.checks).forEach(([check, status]) => {
                const checkIcon = document.createElement('div');
                checkIcon.className = `check-icon ${status}`;
                checkIcon.title = `${check}: ${status}`;
                
                if (status === 'pass') checkIcon.textContent = '✓';
                else if (status === 'fail') checkIcon.textContent = '✗';
                else if (status === 'pending') checkIcon.textContent = '○';
                
                checks.appendChild(checkIcon);
            });
            
            meta.appendChild(checks);
            content.appendChild(meta);
            item.appendChild(content);
            
            this.list.appendChild(item);
        });
    }
    
    addInteractivity() {
        const items = this.list.querySelectorAll('.mr-item');
        
        items.forEach(item => {
            item.addEventListener('click', () => {
                const mrId = item.dataset.id;
                this.openMergeRequest(mrId);
            });
        });
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.textContent.toLowerCase();
                this.filterMergeRequests(filter);
            });
        });
    }
    
    filterMergeRequests(filter) {
        const items = this.list.querySelectorAll('.mr-item');
        
        items.forEach(item => {
            const mrId = item.dataset.id;
            const mr = this.mergeRequests.find(m => m.id === mrId);
            
            if (filter === 'all' || mr.status === filter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    openMergeRequest(mrId) {
        console.log(`Opening merge request: ${mrId}`);
        // In a real app, this would navigate to the MR details page
        alert(`Opening merge request: ${mrId}`);
    }
    
    startAutoRefresh() {
        setInterval(() => {
            this.refreshData();
        }, CONFIG.AUTO_REFRESH_INTERVAL);
    }
    
    refreshData() {
        // Simulate updating some MR statuses
        this.mergeRequests.forEach(mr => {
            if (mr.checks.build === 'pending' && Math.random() > 0.7) {
                mr.checks.build = Math.random() > 0.3 ? 'pass' : 'fail';
            }
        });
        
        this.render();
    }
}

// ==========================================================================
// Diff Viewer
// ==========================================================================
class DiffViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.currentView = 'split';
        this.diffData = this.generateDiffData();
        this.currentDiffIndex = 0;
        
        this.init();
    }
    
    generateDiffData() {
        return [
            {
                file: 'src/core/collaboration.rs',
                additions: 24,
                deletions: 12,
                lines: [
                    { type: 'context', oldNum: 1, newNum: 1, content: 'use nexusforge::prelude::*;' },
                    { type: 'context', oldNum: 2, newNum: 2, content: '' },
                    { type: 'removed', oldNum: 3, newNum: null, content: 'pub struct CollaborationServer {' },
                    { type: 'removed', oldNum: 4, newNum: null, content: '    runtime: Arc<Runtime>,' },
                    { type: 'removed', oldNum: 5, newNum: null, content: '    sessions: HashMap<String, Session>,' },
                    { type: 'removed', oldNum: 6, newNum: null, content: '}' },
                    { type: 'added', oldNum: null, newNum: 3, content: 'pub struct CollaborationServer {' },
                    { type: 'added', oldNum: null, newNum: 4, content: '    runtime: Arc<Runtime>,' },
                    { type: 'added', oldNum: null, newNum: 5, content: '    sessions: Arc<RwLock<HashMap<String, Session>>>,' },
                    { type: 'added', oldNum: null, newNum: 6, content: '    event_broadcaster: broadcast::Sender<CollaborationEvent>,' },
                    { type: 'added', oldNum: null, newNum: 7, content: '}' },
                    { type: 'context', oldNum: 7, newNum: 8, content: '' },
                    { type: 'context', oldNum: 8, newNum: 9, content: 'impl CollaborationServer {' },
                    { type: 'removed', oldNum: 9, newNum: null, content: '    pub fn new(runtime: Runtime) -> Self {' },
                    { type: 'removed', oldNum: 10, newNum: null, content: '        Self {' },
                    { type: 'removed', oldNum: 11, newNum: null, content: '            runtime: Arc::new(runtime),' },
                    { type: 'removed', oldNum: 12, newNum: null, content: '            sessions: HashMap::new(),' },
                    { type: 'removed', oldNum: 13, newNum: null, content: '        }' },
                    { type: 'removed', oldNum: 14, newNum: null, content: '    }' },
                    { type: 'added', oldNum: null, newNum: 10, content: '    pub fn new(runtime: Runtime) -> Self {' },
                    { type: 'added', oldNum: null, newNum: 11, content: '        let (event_broadcaster, _) = broadcast::channel(100);' },
                    { type: 'added', oldNum: null, newNum: 12, content: '        Self {' },
                    { type: 'added', oldNum: null, newNum: 13, content: '            runtime: Arc::new(runtime),' },
                    { type: 'added', oldNum: null, newNum: 14, content: '            sessions: Arc::new(RwLock::new(HashMap::new())),' },
                    { type: 'added', oldNum: null, newNum: 15, content: '            event_broadcaster,' },
                    { type: 'added', oldNum: null, newNum: 16, content: '        }' },
                    { type: 'added', oldNum: null, newNum: 17, content: '    }' }
                ]
            }
        ];
    }
    
    init() {
        this.render();
        this.addInteractivity();
    }
    
    render() {
        const diff = this.diffData[this.currentDiffIndex];
        const diffContent = this.container.querySelector('.diff-content');
        const fileInfo = this.container.querySelector('.diff-file-info');
        const navPosition = this.container.querySelector('.nav-position');
        
        if (!diffContent || !fileInfo || !navPosition) return;
        
        // Update file info
        fileInfo.querySelector('.file-path').textContent = diff.file;
        fileInfo.querySelector('.change-type.added').textContent = `+${diff.additions}`;
        fileInfo.querySelector('.change-type.removed').textContent = `-${diff.deletions}`;
        
        // Update navigation
        navPosition.textContent = `${this.currentDiffIndex + 1}/${this.diffData.length}`;
        
        // Render diff lines
        diffContent.innerHTML = '';
        
        diff.lines.forEach(line => {
            const lineElement = document.createElement('div');
            lineElement.className = `diff-line ${line.type}`;
            
            // Line number (old or new depending on line type)
            const oldNum = document.createElement('div');
            oldNum.className = 'diff-line-number';
            oldNum.textContent = line.oldNum || '';
            lineElement.appendChild(oldNum);
            
            const newNum = document.createElement('div');
            newNum.className = 'diff-line-number';
            newNum.textContent = line.newNum || '';
            lineElement.appendChild(newNum);
            
            // Prefix (+, -, or space)
            const prefix = document.createElement('div');
            prefix.className = 'diff-line-prefix';
            if (line.type === 'added') prefix.textContent = '+';
            else if (line.type === 'removed') prefix.textContent = '-';
            else prefix.textContent = ' ';
            lineElement.appendChild(prefix);
            
            // Content
            const content = document.createElement('div');
            content.className = 'diff-line-content';
            content.textContent = line.content;
            lineElement.appendChild(content);
            
            diffContent.appendChild(lineElement);
        });
    }
    
    addInteractivity() {
        // View toggle buttons
        const viewButtons = this.container.querySelectorAll('.diff-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.currentView = button.dataset.view;
                this.updateView();
            });
        });
        
        // Navigation buttons
        const prevButton = this.container.querySelector('.nav-btn.prev');
        const nextButton = this.container.querySelector('.nav-btn.next');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => this.navigate(-1));
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => this.navigate(1));
        }
    }
    
    navigate(direction) {
        const newIndex = this.currentDiffIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.diffData.length) {
            this.currentDiffIndex = newIndex;
            this.render();
        }
    }
    
    updateView() {
        const diffContent = this.container.querySelector('.diff-content');
        
        if (this.currentView === 'unified') {
            diffContent.classList.add('unified');
            diffContent.classList.remove('split');
        } else {
            diffContent.classList.add('split');
            diffContent.classList.remove('unified');
        }
        
        this.render();
    }
}

// ==========================================================================
// Activity Feed
// ==========================================================================
class ActivityFeed {
    constructor(feedId) {
        this.feed = document.getElementById(feedId);
        if (!this.feed) return;
        
        this.activities = this.generateActivities();
        this.init();
    }
    
    generateActivities() {
        const activities = [
            {
                type: 'commit',
                user: 'alex_dev',
                action: 'pushed 3 commits to',
                target: 'feature/realtime-collab',
                time: new Date(Date.now() - 300000),
                avatar: 'A'
            },
            {
                type: 'merge_request',
                user: 'sarah_bugfix',
                action: 'created merge request',
                target: 'MR-002: Fix authentication token refresh issue',
                time: new Date(Date.now() - 1800000),
                avatar: 'S'
            },
            {
                type: 'review',
                user: 'mike_docs',
                action: 'approved merge request',
                target: 'MR-001',
                time: new Date(Date.now() - 3600000),
                avatar: 'M'
            },
            {
                type: 'issue',
                user: 'emma_workflow',
                action: 'closed issue',
                target: '#42: Memory leak in WebSocket handler',
                time: new Date(Date.now() - 7200000),
                avatar: 'E'
            },
            {
                type: 'pipeline',
                user: 'System',
                action: 'pipeline completed for',
                target: 'main branch',
                time: new Date(Date.now() - 10800000),
                avatar: '🤖'
            },
            {
                type: 'comment',
                user: 'david_perf',
                action: 'commented on',
                target: 'MR-004: Implement merge request approvals workflow',
                time: new Date(Date.now() - 14400000),
                avatar: 'D'
            },
            {
                type: 'deploy',
                user: 'System',
                action: 'deployed v3.2.1 to',
                target: 'production environment',
                time: new Date(Date.now() - 18000000),
                avatar: '🚀'
            },
            {
                type: 'member',
                user: 'Admin',
                action: 'added new team member',
                target: 'jordan_newdev',
                time: new Date(Date.now() - 21600000),
                avatar: '👤'
            }
        ];
        
        return activities.slice(0, CONFIG.ACTIVITY_FEED_LIMIT);
    }
    
    init() {
        this.render();
        this.addInteractivity();
        this.startAutoRefresh();
    }
    
    render() {
        this.feed.innerHTML = '';
        
        this.activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            // Avatar
            const avatar = document.createElement('div');
            avatar.className = 'activity-avatar';
            avatar.textContent = activity.avatar;
            item.appendChild(avatar);
            
            // Content
            const content = document.createElement('div');
            content.className = 'activity-content';
            
            // Text
            const text = document.createElement('div');
            text.className = 'activity-text';
            text.innerHTML = `<strong>${activity.user}</strong> ${activity.action} <span class="highlight">${activity.target}</span>`;
            content.appendChild(text);
            
            // Time
            const time = document.createElement('div');
            time.className = 'activity-time';
            time.textContent = NexusForgeUtils.formatRelativeTime(activity.time);
            content.appendChild(time);
            
            item.appendChild(content);
            
            // Icon
            const icon = document.createElement('div');
            icon.className = 'activity-icon';
            icon.textContent = this.getActivityIcon(activity.type);
            item.appendChild(icon);
            
            this.feed.appendChild(item);
        });
    }
    
    getActivityIcon(type) {
        const icons = {
            'commit': '⚡',
            'merge_request': '🔀',
            'review': '👍',
            'issue': '🐛',
            'pipeline': '🏗️',
            'comment': '💬',
            'deploy': '🚀',
            'member': '👤'
        };
        
        return icons[type] || '📌';
    }
    
    addInteractivity() {
        // Refresh button
        const refreshButton = document.querySelector('.refresh-btn');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.refreshActivities();
            });
        }
        
        // Activity items
        const items = this.feed.querySelectorAll('.activity-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                // In a real app, this would navigate to the relevant page
                console.log('Activity clicked:', item);
            });
        });
    }
    
    refreshActivities() {
        // Add a new random activity
        const newActivity = this.generateRandomActivity();
        this.activities.unshift(newActivity);
        
        // Keep only the limit
        if (this.activities.length > CONFIG.ACTIVITY_FEED_LIMIT) {
            this.activities.pop();
        }
        
        this.render();
    }
    
    generateRandomActivity() {
        const users = ['alex_dev', 'sarah_bugfix', 'mike_docs', 'emma_workflow', 'david_perf'];
        const actions = [
            { type: 'commit', action: 'pushed commits to', target: 'feature/new-feature' },
            { type: 'merge_request', action: 'updated merge request', target: 'MR-005' },
            { type: 'review', action: 'commented on', target: 'MR-003' },
            { type: 'issue', action: 'opened issue', target: '#43: Performance optimization needed' }
        ];
        
        const user = users[Math.floor(Math.random() * users.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        return {
            type: action.type,
            user: user,
            action: action.action,
            target: action.target,
            time: new Date(),
            avatar: user.charAt(0).toUpperCase()
        };
    }
    
    startAutoRefresh() {
        setInterval(() => {
            // Simulate new activity every 30 seconds
            if (Math.random() > 0.7) {
                this.refreshActivities();
            }
        }, 30000);
    }
}

// ==========================================================================
// Command Palette
// ==========================================================================
class CommandPalette {
    constructor(paletteId) {
        this.palette = document.getElementById(paletteId);
        if (!this.palette) return;
        
        this.commands = this.generateCommands();
        this.selectedIndex = 0;
        this.isActive = false;
        
        this.init();
    }
    
    generateCommands() {
        return [
            { 
                id: 'new-repo', 
                title: 'Create new repository', 
                description: 'Start a new project',
                icon: '📁',
                shortcut: 'Ctrl+N'
            },
            { 
                id: 'new-branch', 
                title: 'Create new branch', 
                description: 'Branch from current',
                icon: '树枝',
                shortcut: 'Ctrl+B'
            },
            { 
                id: 'search-code', 
                title: 'Search code', 
                description: 'Find in repositories',
                icon: '🔍',
                shortcut: 'Ctrl+F'
            },
            { 
                id: 'go-to-file', 
                title: 'Go to file', 
                description: 'Open file by name',
                icon: '📄',
                shortcut: 'Ctrl+P'
            },
            { 
                id: 'open-settings', 
                title: 'Open settings', 
                description: 'Configure preferences',
                icon: '⚙️',
                shortcut: 'Ctrl+,'
            },
            { 
                id: 'toggle-theme', 
                title: 'Toggle dark/light theme', 
                description: 'Switch appearance',
                icon: '🌓',
                shortcut: 'Ctrl+T'
            },
            { 
                id: 'help', 
                title: 'Help & documentation', 
                description: 'Get assistance',
                icon: '❓',
                shortcut: 'F1'
            },
            { 
                id: 'logout', 
                title: 'Sign out', 
                description: 'End current session',
                icon: '🚪',
                shortcut: 'Ctrl+Q'
            }
        ];
    }
    
    init() {
        this.render();
        this.addInteractivity();
    }
    
    render() {
        const resultsContainer = this.palette.querySelector('.palette-results');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = '';
        
        this.commands.forEach((command, index) => {
            const item = document.createElement('div');
            item.className = `palette-item ${index === this.selectedIndex ? 'selected' : ''}`;
            item.dataset.id = command.id;
            
            item.innerHTML = `
                <div class="palette-item-icon">${command.icon}</div>
                <div class="palette-item-content">
                    <div class="palette-item-title">${command.title}</div>
                    <div class="palette-item-desc">${command.description}</div>
                </div>
                <div class="palette-item-shortcut">${command.shortcut}</div>
            `;
            
            resultsContainer.appendChild(item);
        });
    }
    
    addInteractivity() {
        // Input field
        const input = this.palette.querySelector('.palette-input');
        if (input) {
            input.addEventListener('input', (e) => {
                this.filterCommands(e.target.value);
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigate(1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigate(-1);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.executeSelected();
                } else if (e.key === 'Escape') {
                    this.close();
                }
            });
        }
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isActive && !this.palette.contains(e.target)) {
                this.close();
            }
        });
        
        // Global shortcut to open
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    filterCommands(query) {
        const items = this.palette.querySelectorAll('.palette-item');
        let firstMatch = true;
        
        items.forEach(item => {
            const command = this.commands.find(cmd => cmd.id === item.dataset.id);
            const title = command.title.toLowerCase();
            const description = command.description.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            if (title.includes(searchQuery) || description.includes(searchQuery)) {
                item.style.display = 'flex';
                if (firstMatch) {
                    item.classList.add('selected');
                    this.selectedIndex = this.commands.findIndex(cmd => cmd.id === item.dataset.id);
                    firstMatch = false;
                } else {
                    item.classList.remove('selected');
                }
            } else {
                item.style.display = 'none';
                item.classList.remove('selected');
            }
        });
    }
    
    navigate(direction) {
        const items = Array.from(this.palette.querySelectorAll('.palette-item')).filter(
            item => item.style.display !== 'none'
        );
        
        if (items.length === 0) return;
        
        // Remove current selection
        items.forEach(item => item.classList.remove('selected'));
        
        // Calculate new index
        this.selectedIndex += direction;
        if (this.selectedIndex < 0) this.selectedIndex = items.length - 1;
        if (this.selectedIndex >= items.length) this.selectedIndex = 0;
        
        // Select new item
        items[this.selectedIndex].classList.add('selected');
        items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
    }
    
    executeSelected() {
        const selectedItem = this.palette.querySelector('.palette-item.selected');
        if (!selectedItem) return;
        
        const commandId = selectedItem.dataset.id;
        this.executeCommand(commandId);
        this.close();
    }
    
    executeCommand(commandId) {
        switch (commandId) {
            case 'new-repo':
                this.openModal('create-repo');
                break;
            case 'toggle-theme':
                this.toggleTheme();
                break;
            case 'search-code':
                document.querySelector('.search-input')?.focus();
                break;
            case 'help':
                window.open('https://docs.nexusforge.dev', '_blank');
                break;
            default:
                console.log(`Executing command: ${commandId}`);
        }
    }
    
    openModal(modalType) {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            // In a real app, this would populate the modal with appropriate content
        }
    }
    
    toggleTheme() {
        // Simplified theme toggle
        document.body.classList.toggle('light-theme');
        console.log('Theme toggled');
    }
    
    open() {
        this.isActive = true;
        this.palette.classList.add('active');
        
        // Focus input
        const input = this.palette.querySelector('.palette-input');
        if (input) {
            input.value = '';
            input.focus();
        }
        
        // Reset selection
        this.selectedIndex = 0;
        this.render();
    }
    
    close() {
        this.isActive = false;
        this.palette.classList.remove('active');
    }
    
    toggle() {
        if (this.isActive) {
            this.close();
        } else {
            this.open();
        }
    }
}

// ==========================================================================
// Modal Manager
// ==========================================================================
class ModalManager {
    constructor() {
        this.overlay = document.getElementById('modalOverlay');
        if (!this.overlay) return;
        
        this.init();
    }
    
    init() {
        // Close button
        const closeBtn = this.overlay.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Click outside to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open(content = '') {
        const modalContent = this.overlay.querySelector('.modal-content');
        if (modalContent && content) {
            modalContent.innerHTML = content;
        }
        
        this.overlay.classList.add('active');
    }
    
    close() {
        this.overlay.classList.remove('active');
    }
}

// ==========================================================================
// Real-time Clock
// ==========================================================================
class RealtimeClock {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;
        
        this.init();
    }
    
    init() {
        this.update();
        setInterval(() => this.update(), 1000);
    }
    
    update() {
        this.element.textContent = NexusForgeUtils.formatTime(new Date());
    }
}

// ==========================================================================
// Initialize Application
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const particleSystem = new ParticleSystem('particleField');
    const commitGraph = new CommitGraph('commitCanvas');
    const heatmap = new ContributionHeatmap('heatmapGrid');
    const fileTree = new FileTreeExplorer('fileTree');
    const mergeRequests = new MergeRequestsManager('mergeRequestsList');
    const diffViewer = new DiffViewer('diffViewer');
    const activityFeed = new ActivityFeed('activityFeed');
    const commandPalette = new CommandPalette('commandPalette');
    const modalManager = new ModalManager();
    const realtimeClock = new RealtimeClock('currentTime');
    
    // Setup additional interactivity
    setupNavigation();
    setupHeatmapToggles();
    setupTimeRangeSelect();
    setupCreateButton();
    
    // Log initialization
    console.log('NexusForge initialized successfully');
});

// ==========================================================================
// Additional Setup Functions
// ==========================================================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // In a real app, this would navigate to different sections
            console.log(`Navigating to: ${link.querySelector('.link-text').textContent}`);
        });
    });
}

function setupHeatmapToggles() {
    const toggleButtons = document.querySelectorAll('.heatmap-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const view = button.dataset.view;
            const heatmap = new ContributionHeatmap('heatmapGrid');
            heatmap.switchView(view);
        });
    });
}

function setupTimeRangeSelect() {
    const select = document.querySelector('.time-range-select');
    
    if (select) {
        select.addEventListener('change', (e) => {
            const commitGraph = new CommitGraph('commitCanvas');
            commitGraph.updateTimeRange(e.target.value);
        });
    }
}

function setupCreateButton() {
    const createBtn = document.querySelector('.create-btn');
    
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            const modalOverlay = document.getElementById('modalOverlay');
            if (modalOverlay) {
                modalOverlay.classList.add('active');
            }
        });
    }
}

// ==========================================================================
// Performance Monitoring (Simplified)
// ==========================================================================
class PerformanceMonitor {
    static start() {
        window.performance.mark('nexusforge-start');
    }
    
    static end() {
        window.performance.mark('nexusforge-end');
        window.performance.measure('nexusforge-initialization', 'nexusforge-start', 'nexusforge-end');
        
        const measures = window.performance.getEntriesByName('nexusforge-initialization');
        if (measures.length > 0) {
            console.log(`NexusForge initialized in ${measures[0].duration.toFixed(2)}ms`);
        }
    }
}

// Start performance monitoring
PerformanceMonitor.start();

// End performance monitoring after all components are loaded
window.addEventListener('load', () => {
    PerformanceMonitor.end();
});