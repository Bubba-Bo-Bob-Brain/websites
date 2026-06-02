// CodeFlow - Interactive Features and Animations

class CodeFlowApp {
    constructor() {
        this.currentRepo = 'project-alpha';
        this.currentBranch = 'main';
        this.heatmapData = this.generateHeatmapData();
        this.diffData = this.generateDiffData();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateElements();
        this.renderCommitGraph();
        this.renderDiffView();
        this.renderHeatmap();
        this.startAnimations();
    }

    setupEventListeners() {
        // Repository selection
        document.querySelectorAll('.repo-item').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.repo-item').forEach(repo => repo.classList.remove('active'));
                item.classList.add('active');
                this.currentRepo = item.querySelector('span').textContent;
                this.switchRepository();
            });
        });

        // Branch selection simulation
        document.querySelectorAll('.branch-item')?.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.branch-item').forEach(branch => branch.classList.remove('active'));
                item.classList.add('active');
                this.currentBranch = item.textContent;
                this.updateBranchBadge();
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.style.borderColor = '#58a6ff';
            });

            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.style.borderColor = 'var(--bg-tertiary)';
            });
        }

        // Diff filter
        const filterBtn = document.querySelector('.diff-actions .btn-secondary');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                this.toggleDiffFilter();
            });
        }

        // Heatmap interactions
        document.querySelectorAll('.heatmap-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                this.showHeatmapDetails(e.target);
            });

            cell.addEventListener('mouseenter', (e) => {
                this.highlightHeatmapWeek(e.target);
            });

            cell.addEventListener('mouseleave', () => {
                this.clearHeatmapHighlight();
            });
        });

        // Team member hover effects
        document.querySelectorAll('.member-avatar').forEach(avatar => {
            avatar.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.1)';
            });
            
            avatar.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Refresh button for commit graph
        const refreshBtn = document.querySelector('.graph-controls .btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshCommitGraph();
            });
        }

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    animateElements() {
        // Animate navbar on scroll
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });

        // Animate sidebar items
        const sidebarItems = document.querySelectorAll('.repo-item, .org-item');
        sidebarItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 300 + (index * 100));
        });
    }

    startAnimations() {
        // Continuous subtle animations
        setInterval(() => {
            this.pulseCommitGraph();
        }, 3000);

        // Animate stat cards on scroll
        this.animateStatCards();
    }

    pulseCommitGraph() {
        const graph = document.querySelector('.commit-graph');
        if (graph) {
            const circles = graph.querySelectorAll('circle');
            const randomCircle = circles[Math.floor(Math.random() * circles.length)];
            
            randomCircle.style.transition = 'all 0.3s ease';
            randomCircle.style.transform = 'scale(1.3)';
            randomCircle.style.opacity = '0.7';
            
            setTimeout(() => {
                randomCircle.style.transform = 'scale(1)';
                randomCircle.style.opacity = '1';
            }, 300);
        }
    }

    animateStatCards() {
        const statCards = document.querySelectorAll('.stat-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        statCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            observer.observe(card);
        });
    }

    switchRepository() {
        // Simulate repository switch with animation
        const editorArea = document.querySelector('.editor-area');
        editorArea.style.animation = 'none';
        editorArea.offsetHeight; // Trigger reflow
        editorArea.style.animation = 'fadeIn 0.3s ease';
        
        // Update commit graph with new data
        this.renderCommitGraph();
        
        // Show notification
        this.showNotification(`Switched to ${this.currentRepo}`);
    }

    updateBranchBadge() {
        const badge = document.querySelector('.repo-item.active .badge');
        if (badge) {
            badge.textContent = this.currentBranch;
            badge.style.background = 'var(--accent-blue)';
            badge.style.color = 'white';
        }
    }

    handleSearch(query) {
        if (query.length < 2) return;
        
        // Simulate search results animation
        const searchBox = document.querySelector('.search-box');
        searchBox.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            searchBox.style.animation = '';
        }, 500);
        
        // Show search results
        this.showNotification(`Searching for: "${query}"`);
    }

    toggleDiffFilter() {
        const diffContent = document.getElementById('diffContent');
        if (diffContent) {
            diffContent.style.opacity = diffContent.style.opacity === '0.5' ? '1' : '0.5';
            this.showNotification(diffContent.style.opacity === '0.5' ? 'Showing all changes' : 'Filtered view');
        }
    }

    generateHeatmapData() {
        const data = [];
        for (let i = 0; i < 91; i++) {
            const level = Math.floor(Math.random() * 10);
            data.push(level);
        }
        return data;
    }

    generateDiffData() {
        return [
            { type: 'context', content: 'import { useState, useEffect } from "react";' },
            { type: 'removed', content: '- const [loading, setLoading] = useState(false);' },
            { type: 'added', content: '+ const [loading, setLoading] = useState(true);' },
            { type: 'context', content: 'function RepositoryManager() {' },
            { type: 'removed', content: '-   useEffect(() => {' },
            { type: 'added', content: '+   useEffect(() => {' },
            { type: 'added', content: '+     fetchData().then(setLoading(false));' },
            { type: 'context', content: '   }, []);' },
            { type: 'removed', content: '-   const handleSubmit = (data) => {' },
            { type: 'added', content: '+   const handleSubmit = async (data) => {' },
            { type: 'added', content: '+     await validateData(data);' },
            { type: 'context', content: '     processData(data);' },
            { type: 'removed', content: '-   }' },
            { type: 'added', content: '+   }' },
            { type: 'context', content: '' },
            { type: 'context', content: '   return (' },
            { type: 'context', content: '     <div className="repository-manager">' },
            { type: 'removed', content: '-     <RepositoryList items={items} />' },
            { type: 'added', content: '+     <RepositoryList items={items} optimized={true} />' },
            { type: 'context', content: '   );' },
            { type: 'context', content: ' };' }
        ];
    }

    renderCommitGraph() {
        const graphContainer = document.getElementById('commitGraph');
        if (!graphContainer) return;

        const branches = ['main', 'feature-auth', 'dev', 'staging', 'production'];
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
        
        let svgContent = '<svg width="100%" height="200" viewBox="0 0 900 200">';
        svgContent += '<defs>';
        svgContent += '<linearGradient id="commitGradient" x1="0%" y1="0%" x2="100%" y2="0%">';
        svgContent += '<stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />';
        svgContent += '<stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />';
        svgContent += '</linearGradient>';
        svgContent += '</defs>';

        // Draw main line
        svgContent += `<path d="M 30 100 Q 150 50 300 100 T 570 100 T 750 100 T 870 100" 
                      fill="none" stroke="url(#commitGradient)" stroke-width="3" opacity="0.3"/>`;

        // Draw commits and branches
        const positions = [30, 150, 300, 450, 600, 750, 870];
        branches.forEach((branch, index) => {
            const y = 50 + (index * 30);
            svgContent += `<circle cx="${positions[0]}" cy="${y}" r="5" fill="${colors[index]}" opacity="0.8"/>`;
            svgContent += `<circle cx="${positions[3]}" cy="${y}" r="5" fill="${colors[index]}" opacity="0.8"/>`;
            svgContent += `<circle cx="${positions[6]}" cy="${y}" r="5" fill="${colors[index]}" opacity="0.8"/>`;
            
            // Branch lines
            svgContent += `<line x1="${positions[0]}" y1="${y}" x2="${positions[1]}" y2="${y - 20}" stroke="${colors[index]}" stroke-width="2" opacity="0.5"/>`;
            svgContent += `<line x1="${positions[3]}" y1="${y}" x2="${positions[4]}" y2="${y - 20}" stroke="${colors[index]}" stroke-width="2" opacity="0.5"/>`;
        });

        // Add commit dots
        positions.forEach(pos => {
            svgContent += `<circle cx="${pos}" cy="100" r="4" fill="var(--accent-blue)" opacity="0.9"/>`;
        });

        // Labels
        svgContent += '<text x="40" y="180" font-size="10" fill="#6b7280">Main</text>';
        svgContent += '<text x="160" y="30" font-size="10" fill="#6b7280">Feature</text>';
        svgContent += '<text x="320" y="180" font-size="10" fill="#6b7280">Dev</text>';
        svgContent += '<text x="470" y="30" font-size="10" fill="#6b7280">Staging</text>';
        svgContent += '<text x="620" y="180" font-size="10" fill="#6b7280">Prod</text>';
        svgContent += '<text x="760" y="30" font-size="10" fill="#6b7280">Release</text>';

        svgContent += '</svg>';
        graphContainer.innerHTML = svgContent;
    }

    renderDiffView() {
        const diffContent = document.getElementById('diffContent');
        if (!diffContent) return;

        let html = '';
        this.diffData.forEach((line, index) => {
            let className = '';
            switch (line.type) {
                case 'added': className = 'diff-added'; break;
                case 'removed': className = 'diff-removed'; break;
                case 'context': className = 'diff-context'; break;
            }
            
            const lineNumber = index + 1;
            html += `
                <div class="diff-line">
                    <div class="diff-line-number">${lineNumber}</div>
                    <div class="diff-line-content ${className}">${line.content}</div>
                </div>
            `;
        });
        
        diffContent.innerHTML = html;
    }

    renderHeatmap() {
        const grid = document.getElementById('heatmapGrid');
        if (!grid) return;
        
        let html = '';
        this.heatmapData.forEach((level, index) => {
            const day = index + 1;
            html += `<div class="heatmap-cell level-${level}" title="Day ${day}: ${level} contributions"></div>`;
        });
        
        grid.innerHTML = html;
    }

    showHeatmapDetails(cell) {
        const level = parseInt(cell.classList[1].replace('level-', ''));
        const message = level > 0 ? `High activity day with ${level} contributions!` : 'No activity recorded';
        this.showNotification(message);
    }

    highlightHeatmapWeek(cell) {
        const index = Array.from(cell.parentElement.children).indexOf(cell);
        const weekStart = Math.floor(index / 7) * 7;
        
        for (let i = 0; i < 7 && (weekStart + i) < this.heatmapData.length; i++) {
            const cellToHighlight = cell.parentElement.children[weekStart + i];
            if (cellToHighlight) {
                cellToHighlight.style.transform = 'scale(1.2)';
                cellToHighlight.style.zIndex = '5';
            }
        }
    }

    clearHeatmapHighlight() {
        document.querySelectorAll('.heatmap-cell').forEach(cell => {
            cell.style.transform = '';
            cell.style.zIndex = '';
        });
    }

    refreshCommitGraph() {
        // Simulate data refresh
        this.renderCommitGraph();
        this.showNotification('Commit graph refreshed with latest data');
        
        // Add loading animation
        const btn = document.querySelector('.graph-controls .btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 1000);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: var(--radius-sm);
            border: 1px solid var(--bg-tertiary);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            font-size: 0.875rem;
            animation: fadeIn 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CodeFlowApp();
});

// Add some additional interactive effects
document.addEventListener('mousemove', (e) => {
    // Parallax effect for background elements
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;
    
    // Apply subtle parallax to main container elements
    const elements = document.querySelectorAll('.repo-item, .org-item, .member-avatar');
    elements.forEach(el => {
        el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Recalculate layout if needed
    const sidebar = document.querySelector('.sidebar');
    const rightPanel = document.querySelector('.right-panel');
    
    if (window.innerWidth < 992) {
        sidebar.style.position = 'static';
        rightPanel.style.position = 'static';
    } else {
        sidebar.style.position = 'sticky';
        rightPanel.style.position = 'sticky';
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.blur();
        }
    }
});