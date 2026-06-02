// ============================================
// SYNTREX — Interactive Frontend Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation ---
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = item.dataset.view;

            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            views.forEach(v => v.classList.remove('active-view'));
            const target = document.getElementById(`${targetView}-view`);
            if (target) target.classList.add('active-view');

            // Close mobile sidebar
            document.querySelector('.sidebar').classList.remove('open');
        });
    });

    // --- Commit Graph Generation ---
    const commitGraph = document.getElementById('commitGraph');
    if (commitGraph) {
        const rows = 52;
        const daysInRow = 7;

        for (let row = 0; row < rows; row++) {
            const rowEl = document.createElement('div');
            rowEl.className = 'commit-row';

            for (let day = 0; day < daysInRow; day++) {
                const dot = document.createElement('div');
                dot.className = 'commit-dot';

                // Simulate commit activity (more commits on weekdays)
                const isWeekend = row % 7 === 5 || row % 7 === 6;
                const random = Math.random();

                if (isWeekend) {
                    dot.classList.add(random > 0.6 ? 'weak' : 'medium');
                } else {
                    if (random > 0.85) dot.classList.add('max');
                    else if (random > 0.65) dot.classList.add('very-strong');
                    else if (random > 0.4) dot.classList.add('strong');
                    else if (random > 0.15) dot.classList.add('medium');
                    else dot.classList.add('weak');
                }

                rowEl.appendChild(dot);

                // Tooltip on hover
                dot.addEventListener('mouseenter', (e) => {
                    dot.style.transform = 'scale(2)';
                    dot.style.zIndex = '10';
                });
                dot.addEventListener('mouseleave', () => {
                    dot.style.transform = '';
                    dot.style.zIndex = '';
                });
            }

            commitGraph.appendChild(rowEl);
        }
    }

    // --- Contribution Heatmap Generation ---
    const heatmap = document.getElementById('contributionHeatmap');
    if (heatmap) {
        const weeks = 52;
        const days = 7;

        for (let week = 0; week < weeks; week++) {
            const weekCol = document.createElement('div');
            weekCol.className = 'heatmap-weeks';

            for (let day = 0; day < days; day++) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';

                // Simulate contribution activity
                const random = Math.random();
                const isWeekend = day === 0 || day === 6;

                if (isWeekend && random > 0.7) {
                    cell.classList.add('l0');
                } else if (random > 0.85) {
                    cell.classList.add('l4');
                } else if (random > 0.7) {
                    cell.classList.add('l3');
                } else if (random > 0.5) {
                    cell.classList.add('l2');
                } else if (random > 0.25) {
                    cell.classList.add('l1');
                } else {
                    cell.classList.add('l0');
                }

                // Tooltip
                cell.addEventListener('mouseenter', (e) => {
                    const contributions = ['0', '1', '3', '5', '8'][Math.floor(Math.random() * 5)];
                    cell.setAttribute('title', `${contributions} contributions`);
                });

                weekCol.appendChild(cell);
            }

            heatmap.appendChild(weekCol);
        }
    }

    // --- File Tree Toggle ---
    const fileTreeToggles = document.querySelectorAll('.file-tree-toggle');
    fileTreeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const children = toggle.nextElementSibling;
            const chevron = toggle.querySelector('.chevron');

            if (children && children.classList.contains('file-tree-children')) {
                children.classList.toggle('expanded');
                if (chevron) chevron.classList.toggle('open');
            }
        });
    });

    // --- Expand all folders by default ---
    document.querySelectorAll('.file-tree-children').forEach(el => {
        el.classList.add('expanded');
    });
    document.querySelectorAll('.chevron').forEach(c => c.classList.add('open'));

    // --- Commit List Generation ---
    const commitList = document.getElementById('commitList');
    if (commitList) {
        const commits = [
            { hash: 'a3f8c2d', message: 'feat: implement real-time collaboration engine', author: 'Elena Voss', branch: 'feature/collab', time: '2 hours ago', initials: 'EV' },
            { hash: '7b1e4f9', message: 'fix: resolve memory leak in query optimizer', author: 'Marcus Chen', branch: 'main', time: '5 hours ago', initials: 'MC' },
            { hash: 'd2c8a31', message: 'refactor: migrate auth middleware to v3', author: 'Aria Knox', branch: 'feature/auth-v3', time: '1 day ago', initials: 'AK' },
            { hash: '9f3e7b2', message: 'feat: add WebSocket support for live editing', author: 'Jun Park', branch: 'feature/websocket', time: '3 days ago', initials: 'JP' },
            { hash: 'e5d1a08', message: 'chore: update CI pipeline and test matrices', author: 'Dev Bot', branch: 'main', time: '2 days ago', initials: 'DB' },
            { hash: 'c4b2f6e', message: 'fix: handle edge case in cursor synchronization', author: 'Elena Voss', branch: 'main', time: '4 days ago', initials: 'EV' },
            { hash: '1a8d3c7', message: 'docs: add architecture overview and API guide', author: 'Aria Knox', branch: 'main', time: '5 days ago', initials: 'AK' },
            { hash: 'f7e9b24', message: 'perf: optimize document diff algorithm', author: 'Marcus Chen', branch: 'main', time: '1 week ago', initials: 'MC' },
            { hash: '2d5a8c1', message: 'feat: implement presence awareness system', author: 'Jun Park', branch: 'feature/presence', time: '1 week ago', initials: 'JP' },
            { hash: '8c3f1e6', message: 'test: add integration tests for sync engine', author: 'Elena Voss', branch: 'main', time: '2 weeks ago', initials: 'EV' },
            { hash: 'b9d4a73', message: 'style: update component library tokens', author: 'Aria Knox', branch: 'main', time: '2 weeks ago', initials: 'AK' },
            { hash: '4e7c2f9', message: 'fix: correct timezone handling in event logs', author: 'Marcus Chen', branch: 'main', time: '3 weeks ago', initials: 'MC' },
        ];

        commits.forEach(commit => {
            const item = document.createElement('div');
            item.className = 'commit-item';

            item.innerHTML = `
                <div class="commit-avatar">${commit.initials}</div>
                <div class="commit-info">
                    <div class="commit-message">${commit.message}</div>
                    <div class="commit-meta">
                        <span class="commit-author">${commit.author}</span>
                        <span class="commit-hash">${commit.hash}</span>
                        <span class="commit-time">${commit.time}</span>
                    </div>
                </div>
                <div class="commit-branch">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 019 9"/></svg>
                    ${commit.branch}
                </div>
            `;

            commitList.appendChild(item);
        });
    }

    // --- Activity Timeline Generation ---
    const activityTimeline = document.getElementById('activityTimeline');
    if (activityTimeline) {
        const events = [
            { type: 'commit', text: '<strong>Elena Voss</strong> pushed <strong>3 commits</strong> to <span class="repo-tag">syntrex/core-engine</span>', time: '12 minutes ago' },
            { type: 'pr', text: '<strong>Marcus Chen</strong> opened a merge request in <span class="repo-tag">syntrex/quantum-db</span>', time: '34 minutes ago' },
            { type: 'issue', text: '<strong>Jun Park</strong> commented on issue <span class="issue-tag">#412</span>', time: '1 hour ago' },
            { type: 'merge', text: '<strong>Dev Bot</strong> merged <strong>PR #287</strong> into main', time: '2 hours ago' },
            { type: 'star', text: '<strong>syntrex/core-engine</strong> reached <strong>2.4k stars</strong>', time: '5 hours ago' },
            { type: 'commit', text: '<strong>Aria Knox</strong> pushed <strong>7 commits</strong> to <span class="repo-tag">syntrex/vault-ui</span>', time: '6 hours ago' },
            { type: 'pr', text: '<strong>Jun Park</strong> opened a merge request in <span class="repo-tag">syntrex/core-engine</span>', time: '8 hours ago' },
            { type: 'commit', text: '<strong>Marcus Chen</strong> pushed <strong>1 commit</strong> to <span class="repo-tag">syntrex/quantum-db</span>', time: '12 hours ago' },
            { type: 'issue', text: '<strong>Elena Voss</strong> opened issue <span class="issue-tag">#418</span>: "Memory spike under load"', time: '1 day ago' },
            { type: 'merge', text: '<strong>Aria Knox</strong> merged <strong>PR #284</strong> into main', time: '1 day ago' },
            { type: 'commit', text: '<strong>Dev Bot</strong> pushed <strong>4 commits</strong> to <span class="repo-tag">syntrex/core-engine</span>', time: '2 days ago' },
            { type: 'star', text: '<strong>syntrex/vault-ui</strong> reached <strong>1.1k stars</strong>', time: '3 days ago' },
        ];

        events.forEach((event, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';

            item.innerHTML = `
                <div class="timeline-dot ${event.type}"></div>
                <div class="timeline-content">
                    <p>${event.text}</p>
                    <span class="timeline-time">${event.time}</span>
                </div>
            `;

            activityTimeline.appendChild(item);
        });
    }

    // --- Search Bar Keyboard Shortcut ---
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
            if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.blur();
            }
        });
    }

    // --- Mobile Sidebar Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // --- Notification Animation ---
    const notificationDot = document.querySelector('.notification-dot');
    if (notificationDot) {
        setInterval(() => {
            notificationDot.style.animation = 'none';
            void notificationDot.offsetHeight;
            notificationDot.style.animation = '';
        }, 3000);
    }

    // --- Panel Hover Effects ---
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            panel.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.4)';
        });
        panel.addEventListener('mouseleave', () => {
            panel.style.boxShadow = '';
        });
    });

    // --- Stat Card Count Animation ---
    const statValues = document.querySelectorAll('.stat-value');
    const animateValue = (el, start, end, duration) => {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(start + (end - start) * eased);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const value = parseInt(el.textContent.replace(/[^0-9]/g, ''));
                if (!isNaN(value) && el.textContent === String(value)) {
                    animateValue(el, 0, value, 1200);
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => observer.observe(el));

    // --- Diff Line Highlight on Hover ---
    const diffLines = document.querySelectorAll('.diff-line');
    diffLines.forEach(line => {
        line.addEventListener('mouseenter', () => {
            line.style.background = 'rgba(34, 211, 238, 0.03)';
        });
        line.addEventListener('mouseleave', () => {
            line.style.background = '';
        });
    });

    // --- MR Items Click ---
    const mrItems = document.querySelectorAll('.mr-item');
    mrItems.forEach(item => {
        item.addEventListener('click', () => {
            // Navigate to merge requests view
            views.forEach(v => v.classList.remove('active-view'));
            document.getElementById('merge-requests-view').classList.add('active-view');
            navItems.forEach(n => n.classList.remove('active'));
            document.querySelector('[data-view="merge-requests"]').classList.add('active');
        });
    });

    // --- File Leaf Click ---
    const fileLeaves = document.querySelectorAll('.file-leaf');
    fileLeaves.forEach(leaf => {
        leaf.addEventListener('click', () => {
            // Simulate opening a file
            const fileName = leaf.querySelector('span').textContent;
            console.log(`Opening file: ${fileName}`);
        });
    });

    // --- Commit Dot Tooltip ---
    const commitDots = document.querySelectorAll('.commit-dot');
    commitDots.forEach(dot => {
        dot.addEventListener('mouseenter', (e) => {
            const rect = dot.getBoundingClientRect();
            const tooltip = document.createElement('div');
            tooltip.className = 'commit-tooltip';
            tooltip.textContent = `${Math.floor(Math.random() * 5) + 1} commits`;
            tooltip.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top - 28}px;
                transform: translateX(-50%);
                background: rgba(11, 17, 32, 0.95);
                border: 1px solid rgba(148, 163, 184, 0.15);
                color: #e2e8f0;
                font-size: 0.65rem;
                font-family: 'JetBrains Mono', monospace;
                padding: 4px 8px;
                border-radius: 4px;
                pointer-events: none;
                z-index: 1000;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltip);

            const removeTooltip = () => {
                tooltip.remove();
                dot.removeEventListener('mouseleave', removeTooltip);
            };
            dot.addEventListener('mouseleave', removeTooltip);
        });
    });

    // --- Branch SVG Animation ---
    const branchSvgs = document.querySelectorAll('.branch-svg');
    branchSvgs.forEach(svg => {
        const path = svg.querySelector('path');
        if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.animation = `drawPath 2s ease forwards`;
        }
    });

    // Add drawPath keyframes dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes drawPath {
            to { stroke-dashoffset: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    // --- Pulse Animation for Live Indicator ---
    const pulseDots = document.querySelectorAll('.pulse-dot');
    pulseDots.forEach(dot => {
        dot.style.animation = 'pulse-dot-green 2s ease-in-out infinite';
    });

    // --- Staggered entrance animations ---
    const staggerElements = () => {
        const elements = document.querySelectorAll('.stat-card, .mr-item, .activity-item, .commit-item');
        elements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(12px)';
            el.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });
    };

    // Run staggered animation on dashboard load
    if (document.getElementById('dashboard-view').classList.contains('active-view')) {
        setTimeout(staggerElements, 200);
    }

    // --- Live commit simulation ---
    const liveCommitGraph = document.getElementById('commitGraph');
    if (liveCommitGraph) {
        setInterval(() => {
            const rows = liveCommitGraph.querySelectorAll('.commit-row');
            if (rows.length > 0) {
                const randomRow = rows[Math.floor(Math.random() * rows.length)];
                const dots = randomRow.querySelectorAll('.commit-dot');
                if (dots.length > 0) {
                    const randomDot = dots[Math.floor(Math.random() * dots.length)];
                    const currentClass = Array.from(randomDot.classList).find(c => c.startsWith('weak') || c.startsWith('medium') || c.startsWith('strong') || c.startsWith('very') || c.startsWith('max'));
                    const levels = ['weak', 'medium', 'strong', 'very-strong', 'max'];
                    const currentIndex = levels.indexOf(currentClass);
                    const newIndex = Math.min(levels.length - 1, currentIndex + 1 + Math.floor(Math.random() * 2));
                    dots.forEach(d => d.classList.remove('weak', 'medium', 'strong', 'very-strong', 'max'));
                    randomDot.classList.add(levels[newIndex]);
                }
            }
        }, 3000);
    }

    // --- Contribution cell click ---
    const heatmapCells = document.querySelectorAll('.heatmap-cell');
    heatmapCells.forEach(cell => {
        cell.addEventListener('click', () => {
            const level = cell.className.split(' ')[1];
            const counts = { l0: 0, l1: 1, l2: 3, l3: 5, l4: 8 };
            const count = counts[level] || 0;
            console.log(`Contributions: ${count}`);
        });
    });

    // --- Diff toggle ---
    const diffToggle = document.getElementById('diffToggle');
    if (diffToggle) {
        let isUnified = true;
        diffToggle.addEventListener('click', () => {
            isUnified = !isUnified;
            diffToggle.textContent = isUnified ? 'Unified' : 'Split';
        });
    }

    // --- Panel header actions ---
    const panelFilterBtns = document.querySelectorAll('.panel-actions .btn-ghost');
    panelFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.style.background = 'rgba(34, 211, 238, 0.1)';
            btn.style.color = '#22d3ee';
            setTimeout(() => {
                btn.style.background = '';
                btn.style.color = '';
            }, 1500);
        });
    });

    // --- Reviewer avatar click ---
    const reviewerAvatars = document.querySelectorAll('.reviewer-avatar');
    reviewerAvatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            const name = avatar.getAttribute('title');
            console.log(`Viewing profile: ${name}`);
        });
    });

    // --- Smooth scroll for activity feed ---
    const activityFeed = document.querySelector('.activity-feed');
    if (activityFeed) {
        activityFeed.style.scrollBehavior = 'smooth';
    }

    console.log('Syntrex platform loaded successfully.');
});