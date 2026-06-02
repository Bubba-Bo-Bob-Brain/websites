/**
 * ========================================
 * NEXUS - Source Code Management
 * JavaScript Application
 * ========================================
 */
(function() {
    'use strict';

    // ========================================
    // Configuration & State
    // ========================================
    const CONFIG = {
        animationDuration: 400,
        scrollThreshold: 100,
        heatmapWeeks: 52,
        heatmapDaysPerWeek: 7,
        debounceDelay: 150
    };

    const state = {
        commandPaletteOpen: false,
        selectedCommandIndex: 0,
        heatmapData: [],
        isLoading: true
    };

    // ========================================
    // Utility Functions
    // ========================================
    const utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = function() {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                if (!inThrottle) {
                    func.apply(this, arguments);
                    inThrottle = true;
                    setTimeout(function() {
                        inThrottle = false;
                    }, limit);
                }
            };
        },

        random: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        formatRelativeTime: function(date) {
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            if (minutes < 1) return 'just now';
            if (minutes < 60) return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
            if (hours < 24) return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
            return days + ' day' + (days > 1 ? 's' : '') + ' ago';
        },

        animateCounter: function(element, target, duration) {
            duration = duration || 1000;
            const start = 0;
            const startTime = performance.now();
            const easeOutQuart = function(x) {
                return 1 - Math.pow(1 - x, 4);
            };
            const updateCount = function(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(easeOutQuart(progress) * target);
                element.textContent = current.toLocaleString();
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            };
            requestAnimationFrame(updateCount);
        },

        addClassAnimated: function(element, className, duration) {
            duration = duration || CONFIG.animationDuration;
            element.style.transition = 'all ' + duration + 'ms cubic-bezier(0.34, 1.56, 0.64, 1)';
            element.classList.add(className);
            setTimeout(function() {
                element.style.transition = '';
            }, duration);
        },

        removeClassAnimated: function(element, className, duration) {
            duration = duration || CONFIG.animationDuration;
            element.style.transition = 'all ' + duration + 'ms ease-out';
            element.classList.remove(className);
            setTimeout(function() {
                element.style.transition = '';
            }, duration);
        }
    };

    // ========================================
    // DOM Ready
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        initCommandPalette();
        initHeatmap();
        initCommitGraph();
        initFileTree();
        initPullRequestTabs();
        initDiffViewer();
        initScrollAnimations();
        initHoverEffects();
        initKeyboardShortcuts();
        initUserMenu();
        initNotificationSystem();
        initRippleStyles();

        setTimeout(function() {
            state.isLoading = false;
            document.body.classList.add('loaded');
        }, 500);

        console.log('Nexus initialized successfully');
    }

    // ========================================
    // Command Palette
    // ========================================
    function initCommandPalette() {
        const searchTrigger = document.getElementById('searchTrigger');
        const commandPalette = document.getElementById('commandPalette');
        const commandInput = document.getElementById('commandInput');
        const commandItems = document.querySelectorAll('.command-item');

        if (!searchTrigger || !commandPalette) return;

        function openPalette() {
            state.commandPaletteOpen = true;
            commandPalette.classList.add('active');
            if (commandInput) commandInput.focus();
            document.body.style.overflow = 'hidden';
        }

        function closePalette() {
            state.commandPaletteOpen = false;
            commandPalette.classList.remove('active');
            if (commandInput) commandInput.value = '';
            resetCommandSelection();
            document.body.style.overflow = '';
        }

        function resetCommandSelection() {
            state.selectedCommandIndex = 0;
            commandItems.forEach(function(item, index) {
                item.classList.toggle('selected', index === 0);
            });
        }

        function navigateCommands(direction) {
            const visibleItems = Array.from(commandItems).filter(function(item) {
                return item.offsetParent !== null;
            });
            if (visibleItems.length === 0) return;
            visibleItems.forEach(function(item) {
                item.classList.remove('selected');
            });
            state.selectedCommandIndex += direction;
            if (state.selectedCommandIndex < 0) state.selectedCommandIndex = visibleItems.length - 1;
            if (state.selectedCommandIndex >= visibleItems.length) state.selectedCommandIndex = 0;
            visibleItems[state.selectedCommandIndex].classList.add('selected');
            visibleItems[state.selectedCommandIndex].scrollIntoView({ block: 'nearest' });
        }

        searchTrigger.addEventListener('click', openPalette);

        const backdrop = document.querySelector('.command-palette-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', closePalette);
        }

        if (commandInput) {
            commandInput.addEventListener('input', function(e) {
                const query = e.target.value.toLowerCase();
                commandItems.forEach(function(item) {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(query) ? 'flex' : 'none';
                });
                resetCommandSelection();
            });

            commandInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closePalette();
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    navigateCommands(1);
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    navigateCommands(-1);
                }
                if (e.key === 'Enter') {
                    const selectedItem = document.querySelector('.command-item.selected');
                    if (selectedItem) {
                        handleCommandAction(selectedItem);
                        closePalette();
                    }
                }
            });
        }

        commandItems.forEach(function(item, index) {
            item.addEventListener('mouseenter', function() {
                commandItems.forEach(function(i) {
                    i.classList.remove('selected');
                });
                item.classList.add('selected');
                state.selectedCommandIndex = index;
            });

            item.addEventListener('click', function() {
                handleCommandAction(item);
                closePalette();
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === '/' && !state.commandPaletteOpen && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                openPalette();
            }
        });
    }

    function handleCommandAction(item) {
        const action = item.dataset.action;
        const text = item.querySelector('span').textContent;
        item.style.transform = 'scale(0.98)';
        setTimeout(function() {
            item.style.transform = '';
        }, 150);
        console.log('Executing action:', action, '-', text);
        switch (action) {
            case 'repo':
                showNotification('Opening repository: ' + text, 'info');
                break;
            case 'action':
                showNotification('Action: ' + text, 'success');
                break;
            default:
                showNotification('Selected: ' + text, 'info');
        }
    }

    // ========================================
    // Heatmap Generation
    // ========================================
    function initHeatmap() {
        const heatmapGrid = document.getElementById('heatmapGrid');
        if (!heatmapGrid) return;

        generateHeatmapData();
        renderHeatmap();
        initHeatmapFilters();
    }

    function generateHeatmapData() {
        state.heatmapData = [];
        const totalDays = CONFIG.heatmapWeeks * CONFIG.heatmapDaysPerWeek;
        for (let i = 0; i < totalDays; i++) {
            const dayOfWeek = i % 7;
            let baseActivity = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 1;
            let burstProbability = Math.random();
            let level;
            if (burstProbability > 0.95) {
                level = 4;
            } else if (burstProbability > 0.85) {
                level = 3;
            } else if (burstProbability > 0.7) {
                level = 2;
            } else if (burstProbability > 0.5 && baseActivity > 0.5) {
                level = 1;
            } else {
                level = 0;
            }
            state.heatmapData.push({
                level: level,
                date: getDateForDay(i),
                contributions: level === 0 ? 0 : utils.random(1, 10) * (level + 1)
            });
        }
    }

    function getDateForDay(dayIndex) {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - (CONFIG.heatmapWeeks * 7 - 1 + dayIndex));
        return startDate;
    }

    function renderHeatmap() {
        const heatmapGrid = document.getElementById('heatmapGrid');
        if (!heatmapGrid) return;

        heatmapGrid.innerHTML = '';

        for (let week = 0; week < CONFIG.heatmapWeeks; week++) {
            const weekColumn = document.createElement('div');
            weekColumn.className = 'heatmap-week';

            for (let day = 0; day < CONFIG.heatmapDaysPerWeek; day++) {
                const index = week * CONFIG.heatmapDaysPerWeek + day;
                const data = state.heatmapData[index];

                if (!data) continue;

                const dayElement = document.createElement('div');
                dayElement.className = 'heatmap-day level-' + data.level;
                dayElement.dataset.date = data.date.toISOString().split('T')[0];
                dayElement.dataset.contributions = data.contributions;
                dayElement.setAttribute('data-tooltip', formatDate(data.date) + ': ' + data.contributions + ' contributions');
                dayElement.style.opacity = '0';
                dayElement.style.transform = 'scale(0.5)';

                dayElement.addEventListener('mouseenter', handleHeatmapDayHover);
                dayElement.addEventListener('mouseleave', handleHeatmapDayLeave);

                weekColumn.appendChild(dayElement);
            }

            heatmapGrid.appendChild(weekColumn);
        }

        setTimeout(function() {
            const days = heatmapGrid.querySelectorAll('.heatmap-day');
            days.forEach(function(day, index) {
                setTimeout(function() {
                    day.style.transition = 'all 0.3s ease-out';
                    day.style.opacity = '1';
                    day.style.transform = 'scale(1)';
                }, index * 2);
            });
        }, 100);
    }

    function formatDate(date) {
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function handleHeatmapDayHover(e) {
        const day = e.target;
        day.style.transform = 'scale(1.4)';
        day.style.zIndex = '10';
        day.style.boxShadow = '0 0 12px rgba(0, 217, 255, 0.6)';
    }

    function handleHeatmapDayLeave(e) {
        const day = e.target;
        day.style.transform = '';
        day.style.zIndex = '';
        day.style.boxShadow = '';
    }

    function initHeatmapFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                const period = btn.dataset.period;
                filterHeatmapByPeriod(period);
            });
        });
    }

    function filterHeatmapByPeriod(period) {
        const weeks = document.querySelectorAll('.heatmap-week');
        let weeksToShow;
        switch (period) {
            case 'week':
                weeksToShow = 1;
                break;
            case 'month':
                weeksToShow = 4;
                break;
            case 'year':
            default:
                weeksToShow = CONFIG.heatmapWeeks;
        }
        weeks.forEach(function(week, index) {
            if (index < weeksToShow) {
                utils.addClassAnimated(week, 'visible');
                week.style.display = 'flex';
            } else {
                utils.removeClassAnimated(week, 'visible');
                setTimeout(function() {
                    if (!week.classList.contains('visible')) {
                        week.style.display = 'none';
                    }
                }, CONFIG.animationDuration);
            }
        });
    }

    // ========================================
    // Commit Graph Visualization
    // ========================================
    function initCommitGraph() {
        const graphContainer = document.getElementById('commitGraph');
        if (!graphContainer) return;
        renderCommitGraph();
    }

    function renderCommitGraph() {
        const graphContainer = document.getElementById('commitGraph');
        if (!graphContainer) return;

        graphContainer.innerHTML = '';

        const branches = [
            { name: 'main', color: '', nodes: generateCommitNodes(12) },
            { name: 'develop', color: 'secondary', nodes: generateCommitNodes(10) },
            { name: 'feature', color: 'tertiary', nodes: generateCommitNodes(8) }
        ];

        branches.forEach(function(branch) {
            const branchEl = document.createElement('div');
            branchEl.className = 'graph-branch';

            branch.nodes.forEach(function(node, nodeIndex) {
                const nodeEl = document.createElement('div');
                nodeEl.className = 'graph-node ' + branch.color;
                nodeEl.style.animationDelay = (nodeIndex * 200) + 'ms';

                if (nodeIndex > 0) {
                    const lineEl = document.createElement('div');
                    lineEl.className = 'graph-line ' + branch.color;
                    lineEl.style.height = utils.random(8, 24) + 'px';
                    branchEl.appendChild(lineEl);
                }

                branchEl.appendChild(nodeEl);
            });

            graphContainer.appendChild(branchEl);
        });

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateGraphEntrance(graphContainer);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(graphContainer);
    }

    function generateCommitNodes(count) {
        const nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                height: utils.random(8, 24),
                isMerge: Math.random() > 0.8
            });
        }
        return nodes;
    }

    function animateGraphEntrance(container) {
        const nodes = container.querySelectorAll('.graph-node');
        const lines = container.querySelectorAll('.graph-line');

        nodes.forEach(function(node, index) {
            setTimeout(function() {
                node.style.opacity = '1';
                node.style.transform = 'scale(1)';
            }, index * 150);
        });

        lines.forEach(function(line, index) {
            setTimeout(function() {
                line.style.opacity = '0.5';
            }, index * 100 + 500);
        });
    }

    // ========================================
    // File Tree Explorer
    // ========================================
    function initFileTree() {
        const fileTree = document.getElementById('fileTree');
        if (!fileTree) return;

        const folderItems = fileTree.querySelectorAll('.tree-folder');
        folderItems.forEach(function(folder) {
            const content = folder.querySelector('.tree-item-content');
            if (content) {
                content.addEventListener('click', function() {
                    toggleFolder(folder);
                });
            }
        });

        const fileItems = fileTree.querySelectorAll('.tree-file');
        fileItems.forEach(function(file) {
            file.addEventListener('click', function() {
                handleFileClick(file);
            });
        });
    }

    function toggleFolder(folder) {
        folder.classList.toggle('expanded');
        const content = folder.querySelector('.tree-item-content');
        if (content) {
            const chevron = content.querySelector('.tree-chevron');
            if (chevron) {
                const isExpanded = folder.classList.contains('expanded');
                chevron.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
    }

    function handleFileClick(file) {
        const fileNameEl = file.querySelector('span');
        if (fileNameEl) {
            const fileName = fileNameEl.textContent;
            file.style.background = 'var(--bg-hover)';
            setTimeout(function() {
                file.style.background = '';
            }, 150);
            showNotification('Opening ' + fileName + '...', 'info');
        }
    }

    // ========================================
    // Pull Request Tabs
    // ========================================
    function initPullRequestTabs() {
        const tabBtns = document.querySelectorAll('.pr-tab');
        const prItems = document.querySelectorAll('.pr-item');

        tabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const tab = btn.dataset.tab;
                tabBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                filterPullRequests(tab);
            });
        });
    }

    function filterPullRequests(tab) {
        const prItems = document.querySelectorAll('.pr-item');
        prItems.forEach(function(item, index) {
            item.style.display = '';
            utils.addClassAnimated(item, 'visible');
        });
    }

    // ========================================
    // Diff Viewer
    // ========================================
    function initDiffViewer() {
        const splitBtn = document.getElementById('splitView');
        const unifiedBtn = document.getElementById('unifiedView');
        const diffContent = document.getElementById('diffContent');

        if (!splitBtn || !unifiedBtn || !diffContent) return;

        splitBtn.addEventListener('click', function() {
            splitBtn.classList.add('active');
            unifiedBtn.classList.remove('active');
            switchToSplitView();
        });

        unifiedBtn.addEventListener('click', function() {
            unifiedBtn.classList.add('active');
            splitBtn.classList.remove('active');
            switchToUnifiedView();
        });
    }

    function switchToSplitView() {
        const diffContent = document.getElementById('diffContent');
        if (!diffContent) return;

        diffContent.innerHTML = '<div class="diff-side old"><div class="diff-file-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f85149" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg><span>auth.ts</span><span class="file-label old">before</span></div><div class="diff-lines">' + generateSplitDiffLines('old') + '</div></div><div class="diff-side new"><div class="diff-file-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg><span>auth.ts</span><span class="file-label new">after</span></div><div class="diff-lines">' + generateSplitDiffLines('new') + '</div></div>';

        diffContent.classList.add('split-view');
        animateDiffLines();
    }

    function switchToUnifiedView() {
        const diffContent = document.getElementById('diffContent');
        if (!diffContent) return;

        diffContent.innerHTML = '<div class="diff-side unified"><div class="diff-file-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg><span>auth.ts</span></div><div class="diff-lines">' + generateUnifiedDiffLines() + '</div></div>';

        diffContent.classList.remove('split-view');
        animateDiffLines();
    }

    function generateSplitDiffLines(side) {
        const lines = [
            { num: 1, type: 'unchanged', content: '<span class="code-keyword">import</span> { Request, Response } <span class="code-keyword">from</span> <span class="code-string">\'express\'</span>;', old: true, new: true },
            { num: 2, type: 'unchanged', content: '<span class="code-keyword">import</span> jwt <span class="code-keyword">from</span> <span class="code-string">\'jsonwebtoken\'</span>;', old: true, new: true },
            { num: 3, type: 'unchanged', content: '<span class="code-keyword">import</span> { UserModel } <span class="code-keyword">from</span> <span class="code-string">\'./models\'</span>;', old: true, new: true },
            { num: 4, type: side === 'old' ? 'deleted' : 'added', content: side === 'old' ? '<span class="code-comment">// Old authentication implementation</span>' : '<span class="code-keyword">import</span> { AuthConfig } <span class="code-keyword">from</span> <span class="code-string">\'./types\'</span>;', old: side === 'old', new: side === 'new' },
            { num: 5, type: side === 'old' ? 'deleted' : 'added', content: side === 'old' ? '<span class="code-keyword">const</span> SECRET_KEY = <span class="code-string">\'legacy-secret\'</span>;' : '<span class="code-keyword">import</span> { RedisService } <span class="code-keyword">from</span> <span class="code-string">\'./redis\'</span>;', old: side === 'old', new: side === 'new' },
            { num: 6, type: 'unchanged', content: '', old: true, new: true },
            { num: 7, type: side === 'old' ? 'deleted' : 'added', content: side === 'old' ? '<span class="code-keyword">export const</span> authenticate = <span class="code-keyword">async</span> (req, res) => {' : '<span class="code-comment">// New authentication with enhanced security</span>', old: side === 'old', new: side === 'new' },
            { num: 8, type: side === 'old' ? 'deleted' : 'added', content: side === 'old' ? '<span class="code-keyword">const</span> token = req.headers.authorization;' : '<span class="code-keyword">const</span> config = AuthConfig.getInstance();', old: side === 'old', new: side === 'new' },
            { num: 9, type: side === 'old' ? 'deleted' : 'added', content: side === 'old' ? '<span class="code-keyword">if</span> (!token) {' : '', old: side === 'old', new: side === 'new' },
            { num: 10, type: side === 'old' ? 'deleted' : 'added', content: side === 'old' ? '<span class="code-keyword">return</span> res.status(401).json({ error: <span class="code-string">\'No token\'</span> });' : '<span class="code-keyword">export const</span> authenticate = <span class="code-keyword">async</span> (req, res) => {', old: side === 'old', new: side === 'new' },
            { num: 11, type: side === 'old' ? 'deleted' : 'added', content: side === 'old' ? '}' : '<span class="code-keyword">try</span> {', old: side === 'old', new: side === 'new' },
            { num: 12, type: side === 'old' ? 'unchanged' : 'added', content: side === 'old' ? '};' : '<span class="code-keyword">const</span> token = extractToken(req);', old: true, new: side === 'new' }
        ];

        let html = '';
        lines.forEach(function(line) {
            if ((side === 'old' && !line.old) || (side === 'new' && !line.new)) {
                html += '<div class="diff-line empty"><span class="line-number"></span><span class="line-content"></span></div>';
            } else {
                html += '<div class="diff-line ' + line.type + '"><span class="line-number">' + (line.num || '') + '</span><span class="line-content line-highlight">' + (line.content || '&nbsp;') + '</span></div>';
            }
        });

        return html;
    }

    function generateUnifiedDiffLines() {
        const lines = [
            { num: 1, type: 'unchanged', content: '<span class="code-keyword">import</span> { Request, Response } <span class="code-keyword">from</span> <span class="code-string">\'express\'</span>;' },
            { num: 2, type: 'unchanged', content: '<span class="code-keyword">import</span> jwt <span class="code-keyword">from</span> <span class="code-string">\'jsonwebtoken\'</span>;' },
            { num: 3, type: 'unchanged', content: '<span class="code-keyword">import</span> { UserModel } <span class="code-keyword">from</span> <span class="code-string">\'./models\'</span>;' },
            { num: 4, type: 'deleted', content: '<span class="code-comment">// Old authentication implementation</span>' },
            { num: 5, type: 'deleted', content: '<span class="code-keyword">const</span> SECRET_KEY = <span class="code-string">\'legacy-secret\'</span>;' },
            { num: 6, type: 'added', content: '<span class="code-keyword">import</span> { AuthConfig } <span class="code-keyword">from</span> <span class="code-string">\'./types\'</span>;' },
            { num: 7, type: 'added', content: '<span class="code-keyword">import</span> { RedisService } <span class="code-keyword">from</span> <span class="code-string">\'./redis\'</span>;' },
            { num: 8, type: 'unchanged', content: '' },
            { num: 9, type: 'deleted', content: '<span class="code-keyword">export const</span> authenticate = <span class="code-keyword">async</span> (req, res) => {' },
            { num: 10, type: 'added', content: '<span class="code-comment">// New authentication with enhanced security</span>' },
            { num: 11, type: 'added', content: '<span class="code-keyword">const</span> config = AuthConfig.getInstance();' },
            { num: 12, type: 'added', content: '' },
            { num: 13, type: 'added', content: '<span class="code-keyword">export const</span> authenticate = <span class="code-keyword">async</span> (req, res) => {' },
            { num: 14, type: 'added', content: '<span class="code-keyword">try</span> {' },
            { num: 15, type: 'added', content: '<span class="code-keyword">const</span> token = extractToken(req);' }
        ];

        let html = '';
        lines.forEach(function(line) {
            html += '<div class="diff-line ' + line.type + '"><span class="line-number">' + (line.num || '') + '</span><span class="line-content line-highlight">' + (line.content || '&nbsp;') + '</span></div>';
        });

        return html;
    }

    function animateDiffLines() {
        const lines = document.querySelectorAll('.diff-line');
        lines.forEach(function(line, index) {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-10px)';
            setTimeout(function() {
                line.style.transition = 'all 0.3s ease-out';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
                setTimeout(function() {
                    line.style.transition = '';
                }, 300);
            }, index * 20);
        });
    }

    // ========================================
    // Scroll Animations
    // ========================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.stat-card, .repo-card, .pr-item, .activity-event, .section-header');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    // ========================================
    // Hover Effects
    // ========================================
    function initHoverEffects() {
        const cards = document.querySelectorAll('.repo-card, .stat-card');
        cards.forEach(function(card) {
            card.addEventListener('mousemove', handleCardTilt);
            card.addEventListener('mouseleave', resetCardTilt);
        });

        document.querySelectorAll('.btn').forEach(function(btn) {
            btn.addEventListener('click', handleButtonRipple);
        });

        const icons = document.querySelectorAll('.nav-icon-btn, .stat-icon');
        icons.forEach(function(icon) {
            icon.addEventListener('mousemove', handleMagneticEffect);
            icon.addEventListener('mouseleave', resetMagneticEffect);
        });
    }

    function handleCardTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
        card.style.boxShadow = '' + (-rotateY) + 'px ' + rotateX + 'px 20px rgba(0, 217, 255, 0.15)';
    }

    function resetCardTilt(e) {
        const card = e.currentTarget;
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    function handleButtonRipple(e) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size / 2) + 'px;top:' + (e.clientY - rect.top - size / 2) + 'px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.6s ease-out;pointer-events:none;';
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(function() {
            ripple.remove();
        }, 600);
    }

    function handleMagneticEffect(e) {
        const icon = e.currentTarget;
        const rect = icon.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        icon.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px) scale(1.1)';
    }

    function resetMagneticEffect(e) {
        const icon = e.currentTarget;
        icon.style.transform = '';
    }

    // ========================================
    // Keyboard Shortcuts
    // ========================================
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
                toggleTheme();
            }
        });
    }

    function toggleTheme() {
        showNotification('Theme toggle: Dark mode active', 'info');
    }

    // ========================================
    // User Menu
    // ========================================
    function initUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (!userMenu) return;
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // ========================================
    // Ripple Styles
    // ========================================
    function initRippleStyles() {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } } .animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
        document.head.appendChild(style);
    }

    // ========================================
    // Notification System
    // ========================================
    function initNotificationSystem() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column-reverse;gap:12px;pointer-events:none;';
            document.body.appendChild(container);
        }
    }

    function showNotification(message, type, duration) {
        type = type || 'info';
        duration = duration || 4000;
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        const colors = {
            success: { bg: 'rgba(63, 185, 80, 0.15)', border: '#3fb950', icon: '&#10003;' },
            error: { bg: 'rgba(248, 81, 73, 0.15)', border: '#f85149', icon: '&#10007;' },
            warning: { bg: 'rgba(210, 153, 34, 0.15)', border: '#d29922', icon: '&#9888;' },
            info: { bg: 'rgba(0, 217, 255, 0.15)', border: '#00D9FF', icon: '&#8505;' }
        };

        const color = colors[type] || colors.info;
        notification.style.cssText = 'display:flex;align-items:center;gap:12px;padding:16px 20px;background:' + color.bg + ';border:1px solid ' + color.border + ';border-radius:12px;backdrop-filter:blur(20px);box-shadow:0 8px 32px rgba(0,0,0,0.3);color:#e8e8ed;font-size:14px;font-weight:500;pointer-events:auto;transform:translateX(120%);opacity:0;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);';
        notification.innerHTML = '<span style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:' + color.border + ';border-radius:50%;font-size:12px;font-weight:bold;color:#0a0a0f;">' + color.icon + '</span><span>' + message + '</span>';

        container.appendChild(notification);

        requestAnimationFrame(function() {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        setTimeout(function() {
            notification.style.transform = 'translateX(120%)';
            notification.style.opacity = '0';
            setTimeout(function() {
                notification.remove();
            }, 400);
        }, duration);

        notification.addEventListener('click', function() {
            notification.style.transform = 'translateX(120%)';
            notification.style.opacity = '0';
            setTimeout(function() {
                notification.remove();
            }, 400);
        });
    }

    // ========================================
    // Export notification function globally
    // ========================================
    window.showNotification = showNotification;

    // ========================================
    // Performance Monitoring
    // ========================================
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(function(list) {
            list.getEntries().forEach(function(entry) {
                if (entry.duration > 50) {
                    console.warn('Long task detected:', entry.duration.toFixed(2) + 'ms');
                }
            });
        });
        try {
            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Long task observer not supported
        }
    }

    // ========================================
    // Service Worker Registration
    // ========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // navigator.serviceWorker.register('/sw.js')
            //     .then(function(registration) {
            //         console.log('SW registered:', registration);
            //     })
            //     .catch(function(error) {
            //         console.log('SW registration failed:', error);
            //     });
        });
    }

})();