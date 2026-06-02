// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initCommitGraph();
    initContributionHeatmap();
    initFileExplorer();
    initRepoTabs();
    
    // Add event listeners for buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Initialize commit graph visualization
function initCommitGraph() {
    const graphContainer = document.getElementById('commitGraph');
    if (!graphContainer) return;
    
    // Clear container
    graphContainer.innerHTML = '';
    
    // Graph dimensions
    const width = graphContainer.offsetWidth;
    const height = graphContainer.offsetHeight;
    
    // Generate sample data for commits
    const commits = [];
    const branches = ['main', 'feature-auth', 'bugfix-responsive'];
    
    // Create a more complex branching structure
    for (let i = 0; i < 30; i++) {
        const branch = branches[Math.floor(Math.random() * branches.length)];
        const x = Math.random() * (width - 40) + 20;
        const y = Math.random() * (height - 40) + 20;
        
        commits.push({
            id: i,
            x: x,
            y: y,
            branch: branch,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
    }
    
    // Draw connections between commits
    for (let i = 1; i < commits.length; i++) {
        const prevCommit = commits[i - 1];
        const currCommit = commits[i];
        
        // Calculate distance and angle
        const dx = currCommit.x - prevCommit.x;
        const dy = currCommit.y - prevCommit.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Create connection element
        const connection = document.createElement('div');
        connection.classList.add('graph-connection');
        connection.style.width = `${length}px`;
        connection.style.height = '2px';
        connection.style.left = `${prevCommit.x}px`;
        connection.style.top = `${prevCommit.y}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        graphContainer.appendChild(connection);
    }
    
    // Draw nodes for commits
    commits.forEach(commit => {
        const node = document.createElement('div');
        node.classList.add('graph-node');
        node.style.left = `${commit.x - 6}px`;
        node.style.top = `${commit.y - 6}px`;
        
        // Add tooltip with commit info
        node.title = `Commit #${commit.id}\nBranch: ${commit.branch}\nDate: ${commit.date.toDateString()}`;
        
        graphContainer.appendChild(node);
    });
}

// Initialize contribution heatmap
function initContributionHeatmap() {
    const heatmapContainer = document.getElementById('contributionHeatmap');
    if (!heatmapContainer) return;
    
    // Clear container
    heatmapContainer.innerHTML = '';
    
    // Generate 53 weeks of data (approx 1 year)
    for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
            const cell = document.createElement('div');
            cell.classList.add('heatmap-cell');
            
            // Random contribution level (0-4)
            const level = Math.floor(Math.random() * 5);
            cell.classList.add(`level-${level}`);
            
            // Add tooltip with contribution count
            const count = level * Math.floor(Math.random() * 10);
            cell.title = `${count} contributions\nWeek ${week + 1}, Day ${day + 1}`;
            
            heatmapContainer.appendChild(cell);
        }
    }
}

// Initialize file explorer interactions
function initFileExplorer() {
    const folders = document.querySelectorAll('.folder');
    
    folders.forEach(folder => {
        folder.addEventListener('click', function(e) {
            if (e.target !== this) return;
            
            const subFolder = this.querySelector('.sub-folder');
            if (subFolder) {
                subFolder.style.display = subFolder.style.display === 'none' ? 'block' : 'none';
                
                // Toggle folder icon
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = subFolder.style.display === 'none' ? 
                        'fas fa-folder' : 'fas fa-folder-open';
                }
            }
        });
    });
    
    // Initially hide sub-folders
    document.querySelectorAll('.sub-folder').forEach(sub => {
        sub.style.display = 'none';
    });
}

// Initialize repository tabs
function initRepoTabs() {
    const tabs = document.querySelectorAll('.repo-tabs li');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // In a real app, this would load content for the selected tab
            console.log(`Switched to tab: ${this.textContent.trim()}`);
        });
    });
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn')) {
        const button = e.target.closest('.btn');
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Simulate loading for dynamic content
function simulateLoading(element, duration = 1000) {
    element.classList.add('loading');
    
    setTimeout(() => {
        element.classList.remove('loading');
    }, duration);
}

// Example usage of loading simulation
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        simulateLoading(this, 500);
    });
});