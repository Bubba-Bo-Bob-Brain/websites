// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('⚡ NexusGit initialized - Cyberpunk Source Code Management');
    
    // Initialize all modules
    initFileTree();
    initHeatmap();
    initCommitGraph();
    initTabs();
    initNotifications();
    initDragAndDrop();
    initActivityUpdates();
    initGlowEffects();
    
    // Add some sample data and initial UI state
    simulateRealTimeActivity();
});

// ==================== FILE TREE EXPLORER ====================
function initFileTree() {
    const fileTree = document.getElementById('fileTree');
    const sampleTreeData = [
        {
            name: 'src',
            type: 'folder',
            open: true,
            children: [
                { name: 'components', type: 'folder', children: [
                    { name: 'CommitGraph.js', type: 'file' },
                    { name: 'FileTree.js', type: 'file' },
                    { name: 'DiffViewer.js', type: 'file' },
                    { name: 'Heatmap.js', type: 'file' }
                ]},
                { name: 'utils', type: 'folder', children: [
                    { name: 'api.js', type: 'file' },
                    { name: 'helpers.js', type: 'file' }
                ]},
                { name: 'styles', type: 'folder', children: [
                    { name: 'main.css', type: 'file' },
                    { name: 'variables.css', type: 'file' }
                ]},
                { name: 'index.js', type: 'file' },
                { name: 'App.js', type: 'file' }
            ]
        },
        {
            name: 'public',
            type: 'folder',
            children: [
                { name: 'index.html', type: 'file' },
                { name: 'favicon.ico', type: 'file' }
            ]
        },
        { name: 'package.json', type: 'file' },
        { name: 'README.md', type: 'file' },
        { name: '.gitignore', type: 'file' }
    ];
    
    // Render the file tree
    renderTree(fileTree, sampleTreeData);
    
    // Add click handlers for folders
    fileTree.addEventListener('click', function(e) {
        const folder = e.target.closest('.tree-folder');
        if (folder) {
            e.stopPropagation();
            const folderName = folder.dataset.name;
            const children = folder.nextElementSibling;
            
            if (children && children.classList.contains('tree-children')) {
                const isOpen = folder.classList.contains('open');
                if (isOpen) {
                    folder.classList.remove('open');
                    children.style.display = 'none';
                } else {
                    folder.classList.add('open');
                    children.style.display = 'block';
                }
            }
        }
        
        // File click handler
        const file = e.target.closest('.tree-file');
        if (file) {
            // Update code viewer header
            const fileName = file.dataset.name;
            const filePath = file.closest('.tree-children') ? 
                getFilePath(file) : fileName;
            
            document.querySelector('.file-path').innerHTML = 
                `<i class="fas fa-file-code"></i> ${filePath}`;
            
            // Add visual feedback
            document.querySelectorAll('.tree-file').forEach(f => f.classList.remove('active'));
            file.classList.add('active');
            
            // Simulate loading file content
            simulateFileLoad(fileName);
        }
    });
    
    // Add sync button handler
    document.querySelector('.btn-tree-action').addEventListener('click', function() {
        this.classList.add('rotating');
        setTimeout(() => {
            this.classList.remove('rotating');
            showNotification('File tree synchronized', 'success');
        }, 500);
        
        // Add CSS for rotation
        const style = document.createElement('style');
        style.textContent = `
            .rotating {
                animation: rotate 0.5s linear;
            }
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    });
}

function renderTree(container, treeData, level = 0) {
    treeData.forEach(item => {
        const element = document.createElement('div');
        element.className = item.type === 'folder' ? 'tree-folder' : 'tree-file';
        element.dataset.name = item.name;
        
        // Indentation
        element.style.paddingLeft = `${level * 20 + 10}px`;
        element.textContent = item.name;
        
        if (item.type === 'folder') {
            if (item.open) {
                element.classList.add('open');
            }
            
            container.appendChild(element);
            
            // Create children container
            if (item.children && item.children.length > 0) {
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'tree-children';
                childrenContainer.style.display = item.open ? 'block' : 'none';
                container.appendChild(childrenContainer);
                
                renderTree(childrenContainer, item.children, level + 1);
            }
        } else {
            container.appendChild(element);
        }
    });
}

function getFilePath(element) {
    const path = [element.dataset.name];
    let parent = element.parentElement;
    
    while (parent && !parent.classList.contains('file-tree')) {
        if (parent.classList.contains('tree-folder')) {
            path.unshift(parent.dataset.name);
        }
        parent = parent.parentElement;
    }
    
    return path.join('/');
}

function simulateFileLoad(fileName) {
    const codeViewer = document.querySelector('.code-viewer');
    const extensions = {
        '.js': 'javascript',
        '.css': 'css',
        '.html': 'html',
        '.json': 'json',
        '.md': 'markdown'
    };
    
    const fileExt = fileName.substring(fileName.lastIndexOf('.'));
    const language = extensions[fileExt] || 'plaintext';
    
    // Simulate loading animation
    codeViewer.innerHTML = `
        <div class="loading-code">
            <div class="loading-spinner"></div>
            <p>Loading ${fileName}...</p>
        </div>
    `;
    
    // Add loading spinner styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        .loading-code {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: var(--text-muted);
        }
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top-color: var(--neon-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(loadingStyle);
    
    // Simulate network delay
    setTimeout(() => {
        // Generate sample code based on file type
        const sampleCode = generateSampleCode(fileName, language);
        codeViewer.innerHTML = `
            <div class="code-content-${language}">
                <pre><code>${sampleCode}</code></pre>
            </div>
        `;
        
        // Add syntax highlighting
        highlightSyntax();
        
        // Remove loading style
        document.head.removeChild(loadingStyle);
    }, 800);
}

function generateSampleCode(fileName, language) {
    const samples = {
        javascript: `// ${fileName}
import React, { useState, useEffect } from 'react';
import { neonBlue, neonMagenta } from '../styles/colors';

/**
 * Cyberpunk Component
 * Advanced visualization with real-time updates
 */
export default function ${fileName.replace('.js', '')}({ data }) {
  const [isActive, setIsActive] = useState(false);
  const [graphData, setGraphData] = useState([]);
  
  useEffect(() => {
    // Fetch real-time commit data
    const fetchData = async () => {
      const response = await fetch('/api/commits');
      const commits = await response.json();
      setGraphData(processCommits(commits));
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const processCommits = (commits) => {
    return commits.map(commit => ({
      id: commit.sha,
      author: commit.author,
      message: commit.message,
      timestamp: new Date(commit.timestamp),
      color: commit.author === 'you' ? neonBlue : neonMagenta
    }));
  };
  
  return (
    <div className="cyberpunk-graph">
      {graphData.map(node => (
        <GraphNode 
          key={node.id}
          data={node}
          onHover={() => setIsActive(true)}
        />
      ))}
    </div>
  );
}`,
        css: `/* ${fileName} - Cyberpunk Theme */

:root {
  --neon-blue: #00d9ff;
  --neon-magenta: #ff00aa;
  --neon-cyan: #00ffcc;
  --bg-primary: #0a0e17;
  --bg-secondary: #121826;
}

.cyberpunk-ui {
  background: linear-gradient(
    135deg,
    var(--bg-primary) 0%,
    var(--bg-secondary) 100%
  );
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 8px;
  box-shadow: 
    0 0 20px rgba(0, 217, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: pulse-glow 3s infinite alternate;
}

@keyframes pulse-glow {
  0% { box-shadow: 0 0 10px rgba(0, 217, 255, 0.3); }
  100% { box-shadow: 0 0 25px rgba(0, 217, 255, 0.6); }
}

.graph-node {
  fill: var(--neon-blue);
  stroke: white;
  stroke-width: 1;
  filter: drop-shadow(0 0 5px var(--neon-blue));
  transition: all 0.3s ease;
}

.graph-node:hover {
  fill: var(--neon-magenta);
  filter: drop-shadow(0 0 10px var(--neon-magenta));
  transform: scale(1.1);
}`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyberpunk Dashboard - NexusGit</title>
  <link rel="stylesheet" href="styles/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://unpkg.com/three@0.149.0/build/three.min.js"></script>
</head>
<body class="cyberpunk-theme">
  <div class="app-container">
    <!-- Navigation -->
    <nav class="top-nav glass-effect">
      <div class="logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">NexusGit</span>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main class="dashboard">
      <section class="commit-graph-section">
        <h2><i class="fas fa-project-diagram"></i> Live Commit Graph</h2>
        <div class="graph-container" id="commitGraph"></div>
      </section>
    </main>
    
    <!-- Footer -->
    <footer class="footer">
      <p>© 2023 NexusGit. Code with neon intensity.</p>
    </footer>
  </div>
  
  <script src="src/index.js"></script>
</body>
</html>`
    };
    
    return samples[language] || `// ${fileName}\n// File content would appear here\n\n`;
}

function highlightSyntax() {
    // Simple syntax highlighting
    const codeElements = document.querySelectorAll('code');
    codeElements.forEach(code => {
        const html = code.innerHTML
            .replace(/\b(import|export|from|function|const|let|var|return|if|else|for|while)\b/g, 
                '<span class="code-keyword">$1</span>')
            .replace(/\b(console\.log|React\.useState|useEffect)\b/g, 
                '<span class="code-function">$1</span>')
            .replace(/('.*?'|".*?")/g, '<span class="code-string">$1</span>')
            .replace(/(\/\/.*)/g, '<span class="code-comment">$1</span>');
        code.innerHTML = html;
    });
}

// ==================== HEATMAP GENERATOR ====================
function initHeatmap() {
    const heatmap = document.getElementById('heatmap');
    const today = new Date();
    
    // Generate 90 days of activity
    for (let day = 89; day >= 0; day--) {
        const date = new Date(today);
        date.setDate(today.getDate() - day);
        
        // Skip weekends sometimes for realistic pattern
        const dayOfWeek = date.getDay();
        if (Math.random() > 0.7 && (dayOfWeek === 0 || dayOfWeek === 6)) {
            continue; // Less activity on weekends
        }
        
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.title = `${date.toLocaleDateString()}: ${Math.floor(Math.random() * 20)} contributions`;
        
        // Random activity level (0-4)
        const activity = Math.floor(Math.random() * 5);
        cell.style.backgroundColor = getHeatmapColor(activity);
        cell.style.opacity = 0.7 + (activity * 0.06);
        
        // Add glow effect for high activity
        if (activity >= 3) {
            cell.classList.add('glow-element');
        }
        
        // Add hover effect
        cell.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.zIndex = '10';
        });
        
        cell.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
        
        heatmap.appendChild(cell);
    }
}

function getHeatmapColor(level) {
    const colors = [
        '#0d1b2a', // Level 0
        '#1b3a4b', // Level 1
        '#005f73', // Level 2
        '#0a9396', // Level 3
        '#00d9ff'  // Level 4
    ];
    return colors[level] || colors[0];
}

// ==================== COMMIT GRAPH VISUALIZATION ====================
function initCommitGraph() {
    const canvas = document.getElementById('commitGraphCanvas');
    if (!canvas.getContext) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Generate random commit data
    const commits = generateCommitData(25);
    
    // Draw the graph
    drawCommitGraph(ctx, commits, width, height);
    
    // Add interactivity
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if mouse is over a commit node
        const hoveredCommit = commits.find(commit => {
            const dx = commit.x - x;
            const dy = commit.y - y;
            return Math.sqrt(dx * dx + dy * dy) < commit.radius;
        });
        
        if (hoveredCommit) {
            canvas.style.cursor = 'pointer';
            showTooltip(e.clientX, e.clientY, hoveredCommit);
        } else {
            canvas.style.cursor = 'default';
            hideTooltip();
        }
    });
    
    // Graph period controls
    document.querySelectorAll('.btn-graph-control').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-graph-control').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Regenerate graph with different data density
            const period = this.textContent.toLowerCase();
            const newCommits = generateCommitData(
                period === 'day' ? 8 : 
                period === 'week' ? 15 : 
                period === 'month' ? 25 : 40
            );
            
            // Clear and redraw
            ctx.clearRect(0, 0, width, height);
            drawCommitGraph(ctx, newCommits, width, height);
            
            // Add visual feedback
            canvas.style.filter = 'brightness(1.2)';
            setTimeout(() => canvas.style.filter = 'brightness(1)', 300);
        });
    });
}

function generateCommitData(count) {
    const commits = [];
    const authors = ['you', 'alex', 'maria', 'tom', 'jane'];
    const colors = {
        'you': '#00d9ff',
        'alex': '#ff00aa',
        'maria': '#7700ff',
        'tom': '#00ff88',
        'jane': '#ffdd00'
    };
    
    for (let i = 0; i < count; i++) {
        const isMerge = Math.random() > 0.8;
        const author = isMerge ? 'maria' : authors[Math.floor(Math.random() * authors.length)];
        
        commits.push({
            id: `commit${i}`,
            author: author,
            message: isMerge ? `Merge branch 'feature-${i}'` : 
                     `Fix: ${['bug', 'typo', 'performance', 'responsive', 'security'][Math.floor(Math.random()*5)]} issue`,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            x: 50 + (i * (700 / count)),
            y: 100 + Math.sin(i * 0.5) * 80 + Math.random() * 40,
            radius: isMerge ? 10 : 6,
            color: colors[author],
            linesAdded: Math.floor(Math.random() * 50) + 1,
            linesRemoved: Math.floor(Math.random() * 20)
        });
    }
    
    return commits;
}

function drawCommitGraph(ctx, commits, width, height) {
    // Draw background grid
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 50; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 30);
        ctx.lineTo(x, height - 30);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 50; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(width - 30, y);
        ctx.stroke();
    }
    
    // Draw commit connections
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < commits.length - 1; i++) {
        const current = commits[i];
        const next = commits[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        
        // Bezier curve for organic look
        const cp1x = current.x + (next.x - current.x) * 0.3;
        const cp1y = current.y + 20;
        const cp2x = current.x + (next.x - current.x) * 0.7;
        const cp2y = next.y - 20;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
        ctx.stroke();
    }
    
    // Draw commit nodes
    commits.forEach(commit => {
        // Outer glow
        ctx.beginPath();
        ctx.arc(commit.x, commit.y, commit.radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = commit.color + '30';
        ctx.fill();
        
        // Main node
        ctx.beginPath();
        ctx.arc(commit.x, commit.y, commit.radius, 0, Math.PI * 2);
        
        // Gradient fill
        const gradient = ctx.createRadialGradient(
            commit.x, commit.y, 0,
            commit.x, commit.y, commit.radius
        );
        gradient.addColorStop(0, commit.color + 'FF');
        gradient.addColorStop(1, commit.color + '80');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Merge commit has special indicator
        if (commit.author === 'maria') {
            ctx.beginPath();
            ctx.arc(commit.x, commit.y, commit.radius - 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
    
    // Draw timeline
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px JetBrains Mono';
    ctx.textAlign = 'center';
    
    const dates = ['Mon', 'Wed', 'Fri', 'Sun', 'Tue'];
    dates.forEach((date, i) => {
        const x = 50 + (i * 150);
        ctx.fillText(date, x, height - 10);
        
        // Timeline marker
        ctx.beginPath();
        ctx.moveTo(x, height - 20);
        ctx.lineTo(x, height - 15);
        ctx.strokeStyle = '#00d9ff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function showTooltip(x, y, commit) {
    let tooltip = document.getElementById('commit-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'commit-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(18, 24, 38, 0.95);
            border: 1px solid #00d9ff;
            border-radius: 8px;
            padding: 12px;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
            max-width: 250px;
        `;
        document.body.appendChild(tooltip);
    }
    
    const timeStr = commit.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateStr = commit.timestamp.toLocaleDateString();
    
    tooltip.innerHTML = `
        <div style="margin-bottom: 8px;">
            <strong style="color: ${commit.color}">${commit.author}</strong>
            <span style="color: #a6b3cc; font-size: 11px; margin-left: 8px;">${dateStr} ${timeStr}</span>
        </div>
        <div style="color: #e6f1ff; margin-bottom: 6px;">${commit.message}</div>
        <div style="display: flex; gap: 12px; font-size: 11px;">
            <span style="color: #00ff88;">+${commit.linesAdded} added</span>
            <span style="color: #ff00aa;">-${commit.linesRemoved} removed</span>
        </div>
    `;
    
    tooltip.style.left = (x + 15) + 'px';
    tooltip.style.top = (y + 15) + 'px';
    tooltip.style.display = 'block';
}

function hideTooltip() {
    const tooltip = document.getElementById('commit-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// ==================== INTERACTIVE TABS ====================
function initTabs() {
    const tabs = document.querySelectorAll('.repo-tab');
    const tabContents = {
        'Code': document.querySelector('.code-content'),
        'Issues': 'issues-content',
        'Pull Requests': 'pr-content',
        'Actions': 'actions-content',
        'Insights': 'insights-content',
        'Wiki': 'wiki-content'
    };
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.textContent.replace(/[\d\s]+/g, '').trim();
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show notification for non-code tabs
            if (tabName !== 'Code') {
                showNotification(`Switched to ${tabName} view`, 'info');
                
                // Simulate loading
                const mainContent = document.querySelector('.main-content');
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'tab-loading';
                loadingDiv.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div class="spinner" style="width: 40px; height: 40px; border: 3px solid #2a3349; border-top-color: #00d9ff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                        <h3 style="color: #00d9ff; margin-bottom: 10px;">Loading ${tabName}...</h3>
                        <p style="color: #a6b3cc;">Fetching ${tabName.toLowerCase()} data from repository</p>
                    </div>
                `;
                
                // Hide current content, show loading
                const currentContent = mainContent.querySelector('.code-content, .commit-graph-section');
                if (currentContent) {
                    currentContent.style.opacity = '0.5';
                    currentContent.style.pointerEvents = 'none';
                }
                
                mainContent.appendChild(loadingDiv);
                
                // Remove loading after delay
                setTimeout(() => {
                    if (loadingDiv.parentNode) {
                        loadingDiv.remove();
                    }
                    if (currentContent) {
                        currentContent.style.opacity = '1';
                        currentContent.style.pointerEvents = 'auto';
                    }
                }, 1200);
            }
        });
    });
}

// ==================== NOTIFICATIONS ====================
function initNotifications() {
    const notificationBtn = document.querySelector('.btn-notification');
    let notificationCount = 3;
    
    notificationBtn.addEventListener('click', function() {
        // Toggle notification dropdown
        const dropdown = document.getElementById('notification-dropdown');
        
        if (!dropdown) {
            createNotificationDropdown();
            notificationCount = 0;
            updateNotificationBadge();
        } else {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
        
        // Visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = 'scale(1)', 150);
    });
    
    // Simulate new notifications
    setInterval(() => {
        if (Math.random() > 0.7 && notificationCount < 5) {
            notificationCount++;
            updateNotificationBadge();
            
            // Show floating notification
            if (notificationCount === 1) {
                showFloatingNotification('New pull request opened');
            }
        }
    }, 30000);
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    badge.textContent = notificationCount;
    
    // Pulse animation
    badge.style.animation = 'none';
    setTimeout(() => {
        badge.style.animation = 'pulse 0.5s';
    }, 10);
}

function createNotificationDropdown() {
    const dropdown = document.createElement('div');
    dropdown.id = 'notification-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 60px;
        right: 20px;
        width: 320px;
        background: rgba(18, 24, 38, 0.98);
        border: 1px solid #00d9ff;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(20px);
        z-index: 1000;
        overflow: hidden;
    `;
    
    dropdown.innerHTML = `
        <div style="padding: 16px; border-bottom: 1px solid #2a3349;">
            <h3 style="margin: 0; color: #00d9ff; font-size: 16px;">Notifications</h3>
        </div>
        <div style="max-height: 400px; overflow-y: auto;">
            <div class="notification-item" style="padding: 12px 16px; border-bottom: 1px solid #2a3349;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 8px; height: 8px; background: #00d9ff; border-radius: 50%;"></div>
                    <div style="flex: 1;">
                        <p style="margin: 0 0 4px 0; color: #e6f1ff;">Maria merged your pull request</p>
                        <small style="color: #a6b3cc;">2 minutes ago</small>
                    </div>
                </div>
            </div>
            <div class="notification-item" style="padding: 12px 16px; border-bottom: 1px solid #2a3349;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 8px; height: 8px; background: #00ff88; border-radius: 50%;"></div>
                    <div style="flex: 1;">
                        <p style="margin: 0 0 4px 0; color: #e6f1ff;">Build passed for nexus-ui</p>
                        <small style="color: #a6b3cc;">15 minutes ago</small>
                    </div>
                </div>
            </div>
            <div class="notification-item" style="padding: 12px 16px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 8px; height: 8px; background: #ff00aa; border-radius: 50%;"></div>
                    <div style="flex: 1;">
                        <p style="margin: 0 0 4px 0; color: #e6f1ff;">Tom mentioned you in issue #42</p>
                        <small style="color: #a6b3cc;">1 hour ago</small>
                    </div>
                </div>
            </div>
        </div>
        <div style="padding: 12px; text-align: center; border-top: 1px solid #2a3349;">
            <button id="mark-all-read" style="background: none; border: none; color: #00d9ff; cursor: pointer; font-family: inherit;">Mark all as read</button>
        </div>
    `;
    
    document.body.appendChild(dropdown);
    
    // Mark all as read handler
    dropdown.querySelector('#mark-all-read').addEventListener('click', function() {
        dropdown.querySelectorAll('.notification-item').forEach(item => {
            item.querySelector('div[style*="width: 8px"]').style.backgroundColor = '#2a3349';
        });
        
        notificationCount = 0;
        updateNotificationBadge();
        
        showNotification('All notifications marked as read', 'success');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== document.querySelector('.btn-notification')) {
            dropdown.style.display = 'none';
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'floating-notification';
    
    const icons = {
        success: '✓',
        error: '✗',
        info: '⚡',
        warning: '⚠'
    };
    
    const colors = {
        success: '#00ff88',
        error: '#ff00aa',
        info: '#00d9ff',
        warning: '#ffdd00'
    };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 24px; height: 24px; background: ${colors[type]}20; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${colors[type]}; font-weight: bold;">
                ${icons[type]}
            </div>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(18, 24, 38, 0.95);
        border: 1px solid ${colors[type]};
        border-radius: 8px;
        padding: 16px 20px;
        color: #e6f1ff;
        font-family: 'Space Grotesk', sans-serif;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function showFloatingNotification(message) {
    const floatingNote = document.createElement('div');
    floatingNote.textContent = message;
    floatingNote.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(255, 0, 170, 0.1);
        border: 1px solid #ff00aa;
        border-radius: 6px;
        padding: 8px 12px;
        color: #ff00aa;
        font-size: 12px;
        z-index: 1000;
        backdrop-filter: blur(5px);
        animation: floatIn 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes floatOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(floatingNote);
    
    // Remove after 5 seconds
    setTimeout(() => {
        floatingNote.style.animation = 'floatOut 0.3s ease';
        setTimeout(() => {
            if (floatingNote.parentNode) {
                floatingNote.remove();
            }
            document.head.removeChild(style);
        }, 300);
    }, 5000);
}

// ==================== DRAG AND DROP ====================
function initDragAndDrop() {
    const fileTree = document.querySelector('.file-tree');
    const folders = fileTree.querySelectorAll('.tree-folder');
    
    folders.forEach(folder => {
        folder.setAttribute('draggable', 'true');
        
        folder.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.name);
            this.style.opacity = '0.5';
        });
        
        folder.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
    });
    
    // Allow dropping on folders
    folders.forEach(folder => {
        folder.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(0, 217, 255, 0.1)';
        });
        
        folder.addEventListener('dragleave', function() {
            this.style.backgroundColor = '';
        });
        
        folder.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            
            const draggedName = e.dataTransfer.getData('text/plain');
            if (draggedName && draggedName !== this.dataset.name) {
                showNotification(`Moved ${draggedName} into ${this.dataset.name}`, 'info');
            }
        });
    });
}

// ==================== ACTIVITY UPDATES ====================
function initActivityUpdates() {
    const activityFeed = document.querySelector('.activity-feed');
    
    // Simulate real-time updates
    setInterval(() => {
        if (Math.random() > 0.8) {
            addActivityUpdate();
        }
    }, 30000);
}

function addActivityUpdate() {
    const activities = [
        { user: 'Jane Developer', action: 'pushed to', target: 'feature/auth', time: 'just now' },
        { user: 'Alex Smith', action: 'commented on', target: 'PR #24', time: '1 minute ago' },
        { user: 'Maria Rodriguez', action: 'approved', target: 'PR #22', time: '2 minutes ago' },
        { user: 'Tom Kim', action: 'created branch', target: 'fix/performance', time: '3 minutes ago' }
    ];
    
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const activityFeed = document.querySelector('.activity-feed');
    
    const colors = ['#00d9ff', '#ff00aa', '#7700ff', '#00ff88'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.animation = 'slideIn 0.3s ease';
    
    activityItem.innerHTML = `
        <div class="activity-avatar" style="background-color: ${color};">
            ${activity.user.split(' ').map(n => n[0]).join('')}
        </div>
        <div class="activity-content">
            <p><strong>${activity.user}</strong> ${activity.action} <strong>${activity.target}</strong></p>
            <small class="activity-time">${activity.time}</small>
        </div>
    `;
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(-100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Insert at top
    activityFeed.insertBefore(activityItem, activityFeed.firstChild);
    
    // Remove old activities if too many
    if (activityFeed.children.length > 6) {
        activityFeed.removeChild(activityFeed.lastChild);
    }
    
    // Remove animation style after a bit
    setTimeout(() => {
        document.head.removeChild(style);
    }, 300);
}

// ==================== GLOW EFFECTS ====================
function initGlowEffects() {
    // Add random glowing to elements
    const glowElements = document.querySelectorAll('.repo-badge, .tab-badge, .btn-primary');
    
    glowElements.forEach(el => {
        if (Math.random() > 0.5) {
            el.classList.add('glow-element');
            
            // Randomize glow timing
            const delay = Math.random() * 2;
            el.style.animationDelay = `${delay}s`;
        }
    });
    
    // Add pulsing effect to online status
    const onlineStatus = document.querySelector('.user-status.online');
    if (onlineStatus) {
        setInterval(() => {
            onlineStatus.style.boxShadow = onlineStatus.style.boxShadow === '' 
                ? '0 0 15px #00ff88' 
                : '';
        }, 1500);
    }
}

// ==================== SIMULATE REAL-TIME ACTIVITY ====================
function simulateRealTimeActivity() {
    // Simulate initial load animations
    setTimeout(() => {
        document.querySelectorAll('.repo-item, .team-item').forEach((el, i) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
            }, i * 50);
        });
    }, 100);
    
    // Randomly update stats
    setInterval(() => {
        const stats = document.querySelectorAll('.stat-info h4');
        stats.forEach(stat => {
            if (Math.random() > 0.9) {
                const current = parseInt(stat.textContent);
                const change = Math.floor(Math.random() * 3) + 1;
                const newValue = current + change;
                
                // Animate the change
                stat.style.transform = 'scale(1.2)';
                stat.style.color = '#00ff88';
                
                setTimeout(() => {
                    stat.textContent = newValue;
                    stat.style.transform = 'scale(1)';
                    setTimeout(() => {
                        stat.style.color = '';
                    }, 500);
                }, 200);
            }
        });
    }, 10000);
    
    // Simulate typing in search bar
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        setTimeout(() => {
            const sampleQueries = ['react hooks', 'cyberpunk ui', 'commit graph', 'real-time collaboration'];
            let queryIndex = 0;
            let charIndex = 0;
            
            const typeQuery = () => {
                if (charIndex <= sampleQueries[queryIndex].length) {
                    searchInput.placeholder = `Search repositories, code, users... ${sampleQueries[queryIndex].substring(0, charIndex)}`;
                    charIndex++;
                    setTimeout(typeQuery, 100);
                } else {
                    setTimeout(() => {
                        charIndex = 0;
                        queryIndex = (queryIndex + 1) % sampleQueries.length;
                        typeQuery();
                    }, 2000);
                }
            };
            
            typeQuery();
        }, 3000);
    }
}

// Export functions for potential module use
window.NexusGit = {
    initFileTree,
    initHeatmap,
    initCommitGraph,
    showNotification,
    simulateFileLoad
};

console.log('NexusGit JavaScript loaded successfully!');