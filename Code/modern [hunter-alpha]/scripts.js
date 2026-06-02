/* ============================================
   CODEVAULT — Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    Modals.init();
    Search.init();
    Heatmap.init();
    CommitGraph.init();
    FileTree.init();
    BranchSelector.init();
    DiffViewer.init();
    Counters.init();
    Sparklines.init();
    RepoTabs.init();
    PRFilters.init();
    CodeCopy.init();
    Tooltips.init();
});

/* === Navigation === */
const Navigation = {
    init() {
        this.nav = document.getElementById('mainNav');
        this.links = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        
        this.bindEvents();
        this.handleScroll();
    },
    
    bindEvents() {
        // Section navigation
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Repo item click
        document.querySelectorAll('.repo-item').forEach(item => {
            item.addEventListener('click', () => {
                this.switchSection('repositories');
            });
        });
    },
    
    switchSection(sectionName) {
        // Update nav links
        this.links.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) activeLink.classList.add('active');
        
        // Map section names
        const sectionMap = {
            'dashboard': 'sectionDashboard',
            'repositories': 'sectionRepository',
            'pullrequests': 'sectionPRs',
            'actions': 'sectionActions'
        };
        
        // Switch sections
        this.sections.forEach(s => s.classList.remove('active'));
        const targetSection = document.getElementById(sectionMap[sectionName]);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Re-trigger animations
            if (sectionName === 'dashboard') {
                Counters.animate();
                Heatmap.render();
            }
        }
    },
    
    handleScroll() {
        if (window.scrollY > 20) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    }
};

/* === Modals === */
const Modals = {
    init() {
        this.newModal = document.getElementById('newModal');
        this.searchModal = document.getElementById('searchModal');
        this.notifPanel = document.getElementById('notifPanel');
        
        this.bindEvents();
    },
    
    bindEvents() {
        // New button
        const newBtn = document.getElementById('newBtn');
        const modalClose = document.getElementById('modalClose');
        
        if (newBtn) {
            newBtn.addEventListener('click', () => this.toggleNewModal());
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeNewModal());
        }
        
        if (this.newModal) {
            this.newModal.addEventListener('click', (e) => {
                if (e.target === this.newModal) this.closeNewModal();
            });
        }
        
        // Notification panel
        const notifBtn = document.getElementById('notifBtn');
        if (notifBtn) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotifPanel();
            });
        }
        
        document.addEventListener('click', (e) => {
            if (this.notifPanel && !this.notifPanel.contains(e.target)) {
                this.notifPanel.classList.remove('active');
            }
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeNewModal();
                this.closeSearchModal();
                this.notifPanel?.classList.remove('active');
            }
        });
    },
    
    toggleNewModal() {
        this.newModal?.classList.toggle('active');
    },
    
    closeNewModal() {
        this.newModal?.classList.remove('active');
    },
    
    toggleNotifPanel() {
        this.notifPanel?.classList.toggle('active');
    },
    
    openSearchModal() {
        this.searchModal?.classList.add('active');
        document.getElementById('searchModalInput')?.focus();
    },
    
    closeSearchModal() {
        this.searchModal?.classList.remove('active');
    }
};

/* === Search === */
const Search = {
    init() {
        this.searchModal = document.getElementById('searchModal');
        this.searchInput = document.getElementById('searchModalInput');
        this.globalSearch = document.getElementById('globalSearch');
        
        this.bindEvents();
    },
    
    bindEvents() {
        // ⌘K shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                Modals.openSearchModal();
            }
        });
        
        // Global search click
        if (this.globalSearch) {
            this.globalSearch.addEventListener('focus', (e) => {
                e.target.blur();
                Modals.openSearchModal();
            });
        }
        
        // Search modal close
        if (this.searchModal) {
            this.searchModal.addEventListener('click', (e) => {
                if (e.target === this.searchModal) {
                    Modals.closeSearchModal();
                }
            });
        }
        
        // Search input filtering
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterResults(e.target.value);
            });
        }
    },
    
    filterResults(query) {
        const items = document.querySelectorAll('.search-result-item');
        const q = query.toLowerCase();
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(q) || q === '' ? 'flex' : 'none';
        });
    }
};

/* === Heatmap === */
const Heatmap = {
    init() {
        this.grid = document.getElementById('heatmapGrid');
        this.months = document.getElementById('heatmapMonths');
        this.render();
    },
    
    render() {
        if (!this.grid || !this.months) return;
        
        this.grid.innerHTML = '';
        this.months.innerHTML = '';
        
        const weeks = 52;
        const days = 7;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Generate month labels
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (weeks * 7));
        
        let currentMonth = -1;
        const monthPositions = [];
        
        for (let w = 0; w < weeks; w++) {
            const weekDate = new Date(startDate);
            weekDate.setDate(weekDate.getDate() + (w * 7));
            const month = weekDate.getMonth();
            
            if (month !== currentMonth) {
                monthPositions.push({ month: monthNames[month], week: w });
                currentMonth = month;
            }
        }
        
        // Render month labels
        monthPositions.forEach((m, i) => {
            const span = document.createElement('span');
            span.textContent = m.month;
            span.style.flex = i === monthPositions.length - 1 ? '1' : 
                `${(monthPositions[i + 1]?.week || weeks) - m.week}`;
            this.months.appendChild(span);
        });
        
        // Generate weeks
        for (let w = 0; w < weeks; w++) {
            const weekDiv = document.createElement('div');
            weekDiv.className = 'heatmap-week';
            
            for (let d = 0; d < days; d++) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                
                // Random activity level with realistic distribution
                const rand = Math.random();
                let level = 0;
                if (rand > 0.85) level = 4;
                else if (rand > 0.7) level = 3;
                else if (rand > 0.5) level = 2;
                else if (rand > 0.3) level = 1;
                
                cell.dataset.level = level;
                
                // Tooltip
                const cellDate = new Date(startDate);
                cellDate.setDate(cellDate.getDate() + (w * 7) + d);
                const contributions = level === 0 ? 0 : Math.floor(Math.random() * 15 * level) + 1;
                cell.dataset.tooltip = `${contributions} contributions on ${cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                
                weekDiv.appendChild(cell);
            }
            
            this.grid.appendChild(weekDiv);
        }
    }
};

/* === Commit Graph === */
const CommitGraph = {
    init() {
        this.canvas = document.getElementById('commitGraphCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.branches = document.querySelectorAll('.branch-pill');
        this.activeBranch = 'main';
        
        this.setupCanvas();
        this.bindEvents();
        this.render();
    },
    
    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.width = rect.width;
        this.height = rect.height;
    },
    
    bindEvents() {
        this.branches.forEach(branch => {
            branch.addEventListener('click', () => {
                this.branches.forEach(b => b.classList.remove('active'));
                branch.classList.add('active');
                this.activeBranch = branch.dataset.branch;
                this.render();
            });
        });
        
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.render();
        });
    },
    
    render() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        
        // Clear
        ctx.clearRect(0, 0, w, h);
        
        // Background grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // Generate branch data
        const branchData = {
            main: this.generateBranchData(0.3, '#06d6d0'),
            develop: this.generateBranchData(0.5, '#a855f7'),
            feature: this.generateBranchData(0.7, '#10b981')
        };
        
        // Draw all branches
        Object.entries(branchData).forEach(([name, data]) => {
            const isActive = name === this.activeBranch;
            this.drawBranch(data, isActive ? 1 : 0.3);
        });
        
        // Draw commit nodes
        Object.entries(branchData).forEach(([name, data]) => {
            const isActive = name === this.activeBranch;
            data.commits.forEach(commit => {
                this.drawCommitNode(commit.x, commit.y, data.color, isActive ? 1 : 0.3);
            });
        });
    },
    
    generateBranchData(yOffset, color) {
        const commits = [];
        const numCommits = 12 + Math.floor(Math.random() * 8);
        const yBase = this.height * yOffset;
        
        for (let i = 0; i < numCommits; i++) {
            commits.push({
                x: 40 + (i * (this.width - 80) / numCommits) + (Math.random() * 20 - 10),
                y: yBase + (Math.sin(i * 0.5) * 30) + (Math.random() * 20 - 10)
            });
        }
        
        return { commits, color };
    },
    
    drawBranch(data, opacity) {
        const ctx = this.ctx;
        const { commits, color } = data;
        
        if (commits.length < 2) return;
        
        // Draw smooth curve through points
        ctx.beginPath();
        ctx.moveTo(commits[0].x, commits[0].y);
        
        for (let i = 1; i < commits.length - 1; i++) {
            const xc = (commits[i].x + commits[i + 1].x) / 2;
            const yc = (commits[i].y + commits[i + 1].y) / 2;
            ctx.quadraticCurveTo(commits[i].x, commits[i].y, xc, yc);
        }
        
        ctx.lineTo(commits[commits.length - 1].x, commits[commits.length - 1].y);
        
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity * 0.6;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Glow effect
        if (opacity > 0.5) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        ctx.globalAlpha = 1;
    },
    
    drawCommitNode(x, y, color, opacity) {
        const ctx = this.ctx;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        // Inner dot
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0b0e';
        ctx.fill();
        
        ctx.globalAlpha = 1;
    }
};

/* === File Tree === */
const FileTree = {
    init() {
        this.tree = document.getElementById('fileTree');
        this.search = document.getElementById('fileSearch');
        
        this.bindEvents();
    },
    
    bindEvents() {
        if (!this.tree) return;
        
        // Folder toggle
        this.tree.querySelectorAll('.file-tree-item.folder').forEach(folder => {
            const toggle = folder.querySelector('.file-tree-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    folder.classList.toggle('expanded');
                });
            }
        });
        
        // File selection
        this.tree.querySelectorAll('.file-tree-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Remove previous selection
                this.tree.querySelectorAll('.file-tree-item.selected').forEach(i => {
                    i.classList.remove('selected');
                });
                
                // Add selection
                item.classList.add('selected');
                item.style.background = 'var(--cyan-dim)';
                
                // Show file preview (simulated)
                this.showFilePreview(item.dataset.path);
            });
        });
        
        // File search
        if (this.search) {
            this.search.addEventListener('input', (e) => {
                this.filterFiles(e.target.value);
            });
        }
    },
    
    showFilePreview(path) {
        // In a real app, this would load file content
        console.log('Selected file:', path);
    },
    
    filterFiles(query) {
        if (!this.tree) return;
        
        const items = this.tree.querySelectorAll('.file-tree-item');
        const q = query.toLowerCase();
        
        items.forEach(item => {
            const name = item.querySelector('.file-name')?.textContent.toLowerCase() || '';
            item.style.display = name.includes(q) || q === '' ? 'flex' : 'none';
        });
    }
};

/* === Branch Selector === */
const BranchSelector = {
    init() {
        this.selector = document.getElementById('branchSelector');
        this.dropdown = document.getElementById('branchDropdown');
        
        this.bindEvents();
    },
    
    bindEvents() {
        if (!this.selector || !this.dropdown) return;
        
        this.selector.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', () => {
            this.dropdown.classList.remove('active');
        });
        
        this.dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Branch selection
        this.dropdown.querySelectorAll('.branch-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const branchName = item.textContent.trim().split('\n')[0].trim();
                const nameSpan = this.selector.querySelector('.branch-name');
                if (nameSpan) {
                    nameSpan.textContent = branchName;
                }
                
                // Update active state
                this.dropdown.querySelectorAll('.branch-dropdown-item').forEach(i => {
                    i.classList.remove('active');
                });
                item.classList.add('active');
                
                this.dropdown.classList.remove('active');
            });
        });
    }
};

/* === Diff Viewer === */
const DiffViewer = {
    init() {
        this.toggleBtns = document.querySelectorAll('.diff-toggle-btn');
        this.collapseBtns = document.querySelectorAll('.diff-collapse-btn');
        
        this.bindEvents();
    },
    
    bindEvents() {
        // View toggle
        this.toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const view = btn.dataset.view;
                const contents = document.querySelectorAll('.diff-content');
                
                contents.forEach(content => {
                    if (view === 'unified') {
                        content.classList.remove('split-view');
                    } else {
                        content.classList.add('split-view');
                    }
                });
            });
        });
        
        // Collapse diff files
        this.collapseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const file = btn.closest('.diff-file');
                const content = file?.querySelector('.diff-content');
                
                if (content) {
                    content.style.display = content.style.display === 'none' ? 'grid' : 'none';
                    btn.style.transform = content.style.display === 'none' ? 'rotate(-90deg)' : '';
                }
            });
        });
    }
};

/* === Counters === */
const Counters = {
    init() {
        this.animate();
    },
    
    animate() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 1500;
            const start = performance.now();
            
            const update = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            
            requestAnimationFrame(update);
        });
    }
};

/* === Sparklines === */
const Sparklines = {
    init() {
        this.render();
    },
    
    render() {
        const sparklines = document.querySelectorAll('.stat-sparkline');
        
        sparklines.forEach((container, index) => {
            this.createSparkline(container, index);
        });
    },
    
    createSparkline(container, seed) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 120 40');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.overflow = 'visible';
        
        // Generate data points
        const points = [];
        const numPoints = 12;
        
        for (let i = 0; i < numPoints; i++) {
            const x = (i / (numPoints - 1)) * 120;
            const y = 35 - (Math.sin(i * 0.8 + seed) * 15 + Math.random() * 10);
            points.push({ x, y });
        }
        
        // Create path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx = (prev.x + curr.x) / 2;
            d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
        }
        
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', ['var(--cyan)', 'var(--purple)', 'var(--emerald)', 'var(--amber)'][seed % 4]);
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('opacity', '0.5');
        
        // Create gradient area
        const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const areaD = d + ` L ${points[points.length - 1].x} 40 L ${points[0].x} 40 Z`;
        areaPath.setAttribute('d', areaD);
        areaPath.setAttribute('fill', ['var(--cyan)', 'var(--purple)', 'var(--emerald)', 'var(--amber)'][seed % 4]);
        areaPath.setAttribute('opacity', '0.1');
        
        svg.appendChild(areaPath);
        svg.appendChild(path);
        container.appendChild(svg);
    }
};

/* === Repo Tabs === */
const RepoTabs = {
    init() {
        this.tabs = document.querySelectorAll('.repo-tab');
        this.bindEvents();
    },
    
    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // In a real app, this would switch content
                const tabName = tab.dataset.tab;
                console.log('Switched to tab:', tabName);
            });
        });
    }
};

/* === PR Filters === */
const PRFilters = {
    init() {
        this.pills = document.querySelectorAll('.filter-pill');
        this.prCards = document.querySelectorAll('.pr-card');
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.pills.forEach(pill => {
            pill.addEventListener('click', () => {
                this.pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                const filter = pill.dataset.filter;
                this.filterPRs(filter);
            });
        });
    },
    
    filterPRs(filter) {
        this.prCards.forEach(card => {
            const isMerged = card.classList.contains('pr-merged');
            const hasConflict = card.querySelector('.pr-status-conflict');
            
            let show = true;
            
            if (filter === 'open') {
                show = !isMerged;
            } else if (filter === 'merged') {
                show = isMerged;
            } else if (filter === 'closed') {
                show = false; // No closed PRs in demo
            }
            
            card.style.display = show ? 'grid' : 'none';
            
            if (show) {
                card.style.animation = 'fadeIn 0.3s ease forwards';
            }
        });
    }
};

/* === Code Copy === */
const CodeCopy = {
    init() {
        this.buttons = document.querySelectorAll('.code-copy-btn');
        this.bindEvents();
    },
    
    bindEvents() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const codeBlock = btn.closest('.code-block');
                const code = codeBlock?.querySelector('code');
                
                if (code) {
                    try {
                        await navigator.clipboard.writeText(code.textContent);
                        
                        // Visual feedback
                        const originalText = btn.innerHTML;
                        btn.innerHTML = `
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M4 8L7 11L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Copied!
                        `;
                        btn.style.color = 'var(--emerald)';
                        
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.style.color = '';
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy:', err);
                    }
                }
            });
        });
    }
};

/* === Tooltips === */
const Tooltips = {
    init() {
        // Pipeline stage tooltips are handled via CSS data-tooltip
        // This adds dynamic tooltip support for other elements
        
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                // CSS handles the visual display
            });
        });
    }
};

/* === Notification Mark Read === */
document.querySelector('.notif-mark-read')?.addEventListener('click', () => {
    document.querySelectorAll('.notif-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelector('.notif-dot')?.remove();
});

/* === Pipeline Stage Hover Animation === */
document.querySelectorAll('.pipeline-stage').forEach(stage => {
    stage.addEventListener('mouseenter', () => {
        const fill = stage.querySelector('.stage-fill');
        if (fill && !fill.classList.contains('animate-pulse')) {
            fill.style.transform = 'scaleY(1.5)';
        }
    });
    
    stage.addEventListener('mouseleave', () => {
        const fill = stage.querySelector('.stage-fill');
        if (fill) {
            fill.style.transform = '';
        }
    });
});

/* === Keyboard Shortcuts === */
document.addEventListener('keydown', (e) => {
    // N for new modal
    if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
        e.preventDefault();
        Modals.toggleNewModal();
    }
    
    // 1-4 for section switching
    if (['1', '2', '3', '4'].includes(e.key) && !isInputFocused()) {
        const sections = ['dashboard', 'repositories', 'pullrequests', 'actions'];
        Navigation.switchSection(sections[parseInt(e.key) - 1]);
    }
});

function isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
}

/* === Smooth Page Load Animation === */
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

/* === Intersection Observer for Scroll Animations === */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s var(--ease-out) forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards for scroll animation
document.querySelectorAll('.card, .pr-card, .pipeline-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

/* === Dynamic Background Gradient === */
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.background = `
        radial-gradient(
            ellipse at ${x * 100}% ${y * 100}%,
            rgba(6, 214, 208, 0.03) 0%,
            transparent 50%
        ),
        var(--bg-primary)
    `;
});

/* === Repo Tab Content (Simulated) === */
const repoTabActions = {
    code: () => {
        document.querySelector('.repo-main-grid').style.display = 'grid';
    },
    issues: () => {
        console.log('Show issues');
    },
    prs: () => {
        Navigation.switchSection('pullrequests');
    },
    actions: () => {
        Navigation.switchSection('actions');
    },
    security: () => {
        console.log('Show security');
    }
};

document.querySelectorAll('.repo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const action = repoTabActions[tab.dataset.tab];
        if (action) action();
    });
});

/* === Mark Notifications Read === */
const markReadBtn = document.querySelector('.notif-mark-read');
if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
        document.querySelectorAll('.notif-item.unread').forEach(item => {
            item.classList.remove('unread');
            const before = item.querySelector('::before');
        });
        
        const dot = document.querySelector('.notif-dot');
        if (dot) {
            dot.style.display = 'none';
        }
        
        markReadBtn.textContent = 'All read ✓';
        markReadBtn.style.color = 'var(--emerald)';
    });
}

/* === File Tree Highlight on Hover === */
document.querySelectorAll('.file-tree-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.paddingLeft = '12px';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.paddingLeft = '';
    });
});

/* === PR Card Hover Effect === */
document.querySelectorAll('.pr-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const indicator = card.querySelector('.pr-status-indicator');
        if (indicator) {
            indicator.style.boxShadow = `0 0 12px ${getComputedStyle(indicator).backgroundColor}`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const indicator = card.querySelector('.pr-status-indicator');
        if (indicator) {
            indicator.style.boxShadow = '';
        }
    });
});

/* === Live Pipeline Progress Animation === */
function animateRunningPipelines() {
    const runningStages = document.querySelectorAll('.pipeline-stage.running .stage-fill');
    
    runningStages.forEach(fill => {
        let width = parseFloat(fill.style.width) || 65;
        
        const interval = setInterval(() => {
            width += Math.random() * 2;
            if (width >= 100) {
                width = 100;
                clearInterval(interval);
                
                // Move to next stage
                const stage = fill.closest('.pipeline-stage');
                stage.classList.remove('running');
                stage.classList.add('success');
                
                const nextStage = stage.nextElementSibling;
                if (nextStage && nextStage.classList.contains('pending')) {
                    nextStage.classList.remove('pending');
                    nextStage.classList.add('running');
                    const nextFill = nextStage.querySelector('.stage-fill');
                    if (nextFill) {
                        nextFill.style.width = '10%';
                        nextFill.classList.add('animate-pulse');
                    }
                }
            }
            fill.style.width = `${width}%`;
        }, 500);
    });
}

// Start pipeline animation after page load
setTimeout(animateRunningPipelines, 2000);

/* === Heatmap Cell Click Interaction === */
document.querySelectorAll('.heatmap-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        // Flash effect
        cell.style.transform = 'scale(1.5)';
        cell.style.boxShadow = `0 0 12px var(--cyan)`;
        
        setTimeout(() => {
            cell.style.transform = '';
            cell.style.boxShadow = '';
        }, 300);
    });
});

/* === Stat Card Pulse on Hover === */
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.stat-icon-wrap');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
            icon.style.transition = 'transform 0.3s var(--ease-spring)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.stat-icon-wrap');
        if (icon) {
            icon.style.transform = '';
        }
    });
});

console.log('%c CodeVault ', 'background: #06d6d0; color: #0a0b0e; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
console.log('%c Built with passion for developers ', 'color: #9ca3af; font-size: 12px;');