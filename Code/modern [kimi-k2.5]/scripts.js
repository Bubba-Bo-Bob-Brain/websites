// ============================================
// NEXUS - Neon Noir Developer Terminal
// Interactive JavaScript Module
// ============================================

(function() {
    'use strict';

    // ============================================
    // State Management
    // ============================================
    const AppState = {
        currentRepo: 'neural-core',
        commandPaletteOpen: false,
        sidebarOpen: true,
        theme: 'dark',
        commitData: [],
        heatmapData: [],
        animations: new Map()
    };

    // ============================================
    // Custom Cursor System
    // ============================================
    const Cursor = {
        dot: null,
        outline: null,
        mouseX: 0,
        mouseY: 0,
        dotX: 0,
        dotY: 0,
        outlineX: 0,
        outlineY: 0,
        isActive: true,

        init() {
            this.dot = document.getElementById('cursor-dot');
            this.outline = document.getElementById('cursor-outline');
            
            if (!this.dot || !this.outline) return;

            // Check for touch device
            if (window.matchMedia('(pointer: coarse)').matches) {
                this.isActive = false;
                document.body.style.cursor = 'auto';
                return;
            }

            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });

            // Add hover effects to interactive elements
            this.addHoverEffects();
            
            // Start animation loop
            this.animate();
        },

        addHoverEffects() {
            const interactiveElements = document.querySelectorAll('a, button, .tree-row, .repo-item, .mr-card, .palette-item');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    this.outline.style.borderColor = 'rgba(0, 240, 255, 0.8)';
                    this.outline.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
                });
                el.addEventListener('mouseleave', () => {
                    this.outline.style.transform = 'translate(-50%, -50%) scale(1)';
                    this.outline.style.borderColor = 'rgba(0, 240, 255, 0.5)';
                    this.outline.style.backgroundColor = 'transparent';
                });
            });
        },

        animate() {
            if (!this.isActive) return;

            // Smooth interpolation for dot (fast)
            this.dotX += (this.mouseX - this.dotX) * 0.5;
            this.dotY += (this.mouseY - this.dotY) * 0.5;

            // Smooth interpolation for outline (slower, trailing)
            this.outlineX += (this.mouseX - this.outlineX) * 0.15;
            this.outlineY += (this.mouseY - this.outlineY) * 0.15;

            this.dot.style.left = `${this.dotX}px`;
            this.dot.style.top = `${this.dotY}px`;
            this.outline.style.left = `${this.outlineX}px`;
            this.outline.style.top = `${this.outlineY}px`;

            requestAnimationFrame(() => this.animate());
        }
    };

    // ============================================
    // Command Palette
    // ============================================
    const CommandPalette = {
        palette: null,
        input: null,
        results: null,
        commands: [],

        init() {
            this.palette = document.getElementById('command-palette');
            this.input = document.getElementById('palette-input');
            this.results = document.getElementById('palette-results');
            
            if (!this.palette) return;

            // Define available commands
            this.commands = [
                { id: 'goto-repo', title: 'Go to Repository', description: 'Navigate to a repository', icon: 'ph-cube', action: () => console.log('Navigate repos') },
                { id: 'new-file', title: 'New File', description: 'Create a new file', icon: 'ph-file-plus', action: () => console.log('New file') },
                { id: 'clone', title: 'Clone Repository', description: 'Clone to local machine', icon: 'ph-git-fork', action: () => console.log('Clone') },
                { id: 'settings', title: 'Settings', description: 'Open application settings', icon: 'ph-gear', action: () => console.log('Settings') },
                { id: 'theme', title: 'Toggle Theme', description: 'Switch between light and dark', icon: 'ph-moon', action: () => Theme.toggle() },
                { id: 'profile', title: 'View Profile', description: 'Go to your profile', icon: 'ph-user', action: () => console.log('Profile') },
                { id: 'shortcuts', title: 'Keyboard Shortcuts', description: 'View all available shortcuts', icon: 'ph-keyboard', action: () => console.log('Shortcuts') }
            ];

            // Keyboard shortcut (Cmd/Ctrl + K)
            document.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    this.toggle();
                }
                if (e.key === 'Escape' && AppState.commandPaletteOpen) {
                    this.close();
                }
            });

            // Input filtering
            this.input?.addEventListener('input', (e) => this.filterResults(e.target.value));

            // Click outside to close
            this.palette.addEventListener('click', (e) => {
                if (e.target === this.palette || e.target.classList.contains('palette-backdrop')) {
                    this.close();
                }
            });

            // Trigger from search box
            document.getElementById('command-palette-trigger')?.addEventListener('click', () => this.open());
        },

        toggle() {
            if (AppState.commandPaletteOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        open() {
            AppState.commandPaletteOpen = true;
            this.palette.classList.add('active');
            this.input.value = '';
            this.input.focus();
            this.renderResults(this.commands);
        },

        close() {
            AppState.commandPaletteOpen = false;
            this.palette.classList.remove('active');
        },

        filterResults(query) {
            const filtered = this.commands.filter(cmd => 
                cmd.title.toLowerCase().includes(query.toLowerCase()) || 
                cmd.description.toLowerCase().includes(query.toLowerCase())
            );
            this.renderResults(filtered);
        },

        renderResults(results) {
            this.results.innerHTML = results.map((cmd, index) => `
                <div class="palette-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
                    <i class="ph ${cmd.icon}"></i>
                    <div class="palette-item-text">
                        <div class="palette-item-title">${cmd.title}</div>
                        <div class="palette-item-desc">${cmd.description}</div>
                    </div>
                </div>
            `).join('');

            // Add click handlers
            this.results.querySelectorAll('.palette-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    results[index].action();
                    this.close();
                });
            });
        }
    };

    // ============================================
    // File Tree Explorer
    // ============================================
    const FileTree = {
        init() {
            const treeItems = document.querySelectorAll('.tree-item.directory');
            treeItems.forEach(item => {
                const row = item.querySelector('.tree-row');
                row?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggle(item);
                });
            });

            // Add click handlers for files
            document.querySelectorAll('.tree-item.file').forEach(file => {
                file.addEventListener('click', () => {
                    this.selectFile(file);
                });
            });
        },

        toggle(item) {
            const isExpanded = item.classList.contains('expanded');
            const children = item.querySelector('.tree-children');
            const icon = item.querySelector('.toggle-icon');

            if (isExpanded) {
                item.classList.remove('expanded');
                item.classList.add('collapsed');
                if (children) {
                    children.classList.add('collapsed');
                    children.style.height = '0';
                }
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('expanded');
                item.classList.remove('collapsed');
                if (children) {
                    children.classList.remove('collapsed');
                    const height = children.scrollHeight;
                    children.style.height = '0';
                    requestAnimationFrame(() => {
                        children.style.transition = 'height 0.3s ease';
                        children.style.height = `${height}px`;
                        setTimeout(() => {
                            children.style.height = 'auto';
                        }, 300);
                    });
                }
                if (icon) icon.style.transform = 'rotate(90deg)';
            }
        },

        selectFile(fileItem) {
            // Remove previous selection
            document.querySelectorAll('.tree-item.file').forEach(f => {
                f.querySelector('.tree-row').style.background = '';
            });
            
            // Highlight selected
            fileItem.querySelector('.tree-row').style.background = 'rgba(0, 240, 255, 0.1)';
            console.log('Loading file:', fileItem.dataset.path);
        }
    };

    // ============================================
    // Live Commit Graph Visualization
    // ============================================
    const CommitGraph = {
        canvas: null,
        ctx: null,
        width: 0,
        height: 0,
        particles: [],
        animationId: null,
        isActive: true,

        init() {
            this.canvas = document.getElementById('commit-canvas');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.generateData();
            this.createParticles();
            this.animate();

            // Handle resize
            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(() => this.resize(), 250);
            });

            // Time range controls
            document.querySelectorAll('.graph-controls .control-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.graph-controls .control-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.regenerateData(e.target.dataset.range);
                });
            });
        },

        resize() {
            const container = this.canvas.parentElement;
            this.width = container.clientWidth;
            this.height = container.clientHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        },

        generateData(range = 'day') {
            const points = range === 'day' ? 24 : range === 'week' ? 7 : 30;
            AppState.commitData = Array.from({ length: points }, (_, i) => ({
                time: i,
                commits: Math.floor(Math.random() * 50) + 10,
                intensity: Math.random()
            }));
        },

        regenerateData(range) {
            this.generateData(range);
            this.createParticles();
        },

        createParticles() {
            this.particles = [];
            const data = AppState.commitData;
            const maxCommits = Math.max(...data.map(d => d.commits));

            data.forEach((point, index) => {
                const x = (this.width / (data.length - 1)) * index;
                const y = this.height - (point.commits / maxCommits) * (this.height * 0.8) - 20;
                
                this.particles.push({
                    x,
                    y,
                    baseY: y,
                    radius: 3 + point.intensity * 4,
                    intensity: point.intensity,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.02 + Math.random() * 0.02
                });
            });
        },

        animate() {
            if (!this.isActive) return;
            
            this.ctx.clearRect(0, 0, this.width, this.height);

            // Draw gradient background
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, 'rgba(0, 240, 255, 0.1)');
            gradient.addColorStop(1, 'transparent');

            // Draw connection lines
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
            this.ctx.lineWidth = 2;
            
            this.particles.forEach((p, i) => {
                if (i === 0) {
                    this.ctx.moveTo(p.x, p.y);
                } else {
                    const prev = this.particles[i - 1];
                    const cp1x = prev.x + (p.x - prev.x) / 2;
                    const cp1y = prev.y;
                    const cp2x = prev.x + (p.x - prev.x) / 2;
                    const cp2y = p.y;
                    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p.x, p.y);
                }
            });
            this.ctx.stroke();

            // Fill area under curve
            this.ctx.lineTo(this.width, this.height);
            this.ctx.lineTo(0, this.height);
            this.ctx.closePath();
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Draw and animate particles
            const time = Date.now() * 0.001;
            
            this.particles.forEach((p, i) => {
                // Floating animation
                p.y = p.baseY + Math.sin(time * p.speed + p.phase) * 5;

                // Glow effect
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 240, 255, ${0.2 * p.intensity})`;
                this.ctx.fill();

                // Core
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = '#00f0ff';
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.shadowBlur = 15 * p.intensity;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;

                // Pulse effect for active points
                if (p.intensity > 0.7) {
                    const pulse = Math.sin(time * 3 + p.phase) * 0.5 + 0.5;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.radius + pulse * 5, 0, Math.PI * 2);
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${pulse * 0.5})`;
                    this.ctx.stroke();
                }
            });

            this.animationId = requestAnimationFrame(() => this.animate());
        },

        destroy() {
            this.isActive = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    };

    // ============================================
    // Contribution Heatmap
    // ============================================
    const Heatmap = {
        init() {
            const grid = document.getElementById('heatmap-grid');
            if (!grid) return;

            // Generate 52 weeks x 7 days = 364 cells
            const weeks = 52;
            const days = 7;
            let html = '';
            
            for (let w = 0; w < weeks; w++) {
                for (let d = 0; d < days; d++) {
                    const level = Math.floor(Math.random() * 5);
                    html += `<div class="heatmap-cell level-${level}" data-week="${w}" data-day="${d}" title="${level} contributions"></div>`;
                }
            }
            
            grid.innerHTML = html;

            // Add hover tooltip
            const cells = grid.querySelectorAll('.heatmap-cell');
            cells.forEach(cell => {
                cell.addEventListener('mouseenter', (e) => {
                    const level = e.target.className.match(/level-(\d)/)?.[1] || 0;
                    this.showTooltip(e, `${level} contributions on ${this.getDateLabel(e.target)}`);
                });
                cell.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            });
        },

        getDateLabel(cell) {
            const week = parseInt(cell.dataset.week);
            const day = parseInt(cell.dataset.day);
            const date = new Date();
            date.setDate(date.getDate() - ((52 - week) * 7 + (6 - day)));
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        },

        showTooltip(e, text) {
            let tooltip = document.getElementById('heatmap-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'heatmap-tooltip';
                tooltip.style.cssText = `
                    position: fixed;
                    background: rgba(0,0,0,0.9);
                    color: #00f0ff;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    pointer-events: none;
                    z-index: 1000;
                    border: 1px solid rgba(0,240,255,0.3);
                    font-family: 'JetBrains Mono', monospace;
                `;
                document.body.appendChild(tooltip);
            }
            
            tooltip.textContent = text;
            tooltip.style.left = `${e.clientX + 10}px`;
            tooltip.style.top = `${e.clientY - 30}px`;
            tooltip.style.opacity = '1';
        },

        hideTooltip() {
            const tooltip = document.getElementById('heatmap-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
            }
        }
    };

    // ============================================
    // Live Counter Animation
    // ============================================
    const LiveCounter = {
        init() {
            const element = document.getElementById('commit-count');
            if (!element) return;

            // Animate on load
            this.animateValue(element, 0, 2847, 2000);

            // Simulate live updates
            setInterval(() => {
                const current = parseInt(element.textContent.replace(',', ''));
                const increment = Math.floor(Math.random() * 3);
                if (increment > 0) {
                    this.animateValue(element, current, current + increment, 500);
                }
            }, 5000);
        },

        animateValue(element, start, end, duration) {
            const range = end - start;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + range * easeProgress);
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }
    };

    // ============================================
    // Repository Switching
    // ============================================
    const RepoSwitcher = {
        init() {
            document.querySelectorAll('.repo-item').forEach(item => {
                item.addEventListener('click', () => {
                    // Remove active from all
                    document.querySelectorAll('.repo-item').forEach(r => {
                        r.classList.remove('active');
                        r.querySelector('.status-dot')?.classList.remove('active');
                    });
                    
                    // Add active to clicked
                    item.classList.add('active');
                    item.querySelector('.status-dot')?.classList.add('active');
                    
                    // Update state
                    AppState.currentRepo = item.dataset.repo;
                    
                    // Update UI
                    this.updateRepoDisplay(item);
                });
            });
        },

        updateRepoDisplay(repoItem) {
            const name = repoItem.querySelector('.repo-name').textContent;
            const title = document.querySelector('.repo-title');
            
            if (title) {
                title.innerHTML = `
                    <i class="ph ph-book-open"></i>
                    ${name}
                    <span class="visibility-badge public">
                        <i class="ph ph-globe"></i>
                        Public
                    </span>
                `;
                
                // Trigger animation
                title.classList.remove('fade-in');
                void title.offsetWidth;
                title.classList.add('fade-in');
            }
        }
    };

    // ============================================
    // Theme Manager
    // ============================================
    const Theme = {
        toggle() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            AppState.theme = next;
        }
    };

    // ============================================
    // Scroll Animations
    // ============================================
    const ScrollAnimations = {
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.mr-card, .stat-card, .heatmap-section').forEach(el => {
                observer.observe(el);
            });
        }
    };

    // ============================================
    // Smooth Scroll
    // ============================================
    const SmoothScroll = {
        init() {
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
    };

    // ============================================
    // Notification System
    // ============================================
    const Notifications = {
        init() {
            const badge = document.querySelector('.notification-badge');
            if (!badge) return;

            // Simulate new notifications
            setInterval(() => {
                const count = parseInt(badge.textContent);
                if (Math.random() > 0.7) {
                    badge.textContent = count + 1;
                    badge.style.animation = 'none';
                    void badge.offsetWidth;
                    badge.style.animation = 'badgePulse 2s ease-in-out infinite';
                    
                    if (Notification.permission === 'granted') {
                        new Notification('Nexus', {
                            body: 'New activity in your repositories',
                            icon: '/favicon.ico'
                        });
                    }
                }
            }, 30000);

            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    };

    // ============================================
    // Initialize Application
    // ============================================
    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize all modules
            Cursor.init();
            CommandPalette.init();
            FileTree.init();
            CommitGraph.init();
            Heatmap.init();
            LiveCounter.init();
            RepoSwitcher.init();
            ScrollAnimations.init();
            SmoothScroll.init();
            Notifications.init();

            // Handle visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    CommitGraph.isActive = false;
                } else {
                    CommitGraph.isActive = true;
                    CommitGraph.animate();
                }
            });

            // Console welcome message
            console.log('%c NEXUS ', 'background: linear-gradient(135deg, #00f0ff, #ff00a0); color: #000; font-weight: bold; font-size: 24px; padding: 10px 20px; border-radius: 8px;');
            console.log('%c System initialized. Welcome, developer. ', 'color: #00f0ff; font-family: monospace;');
        });
    }

    // Start
    init();

})();