/* ========================================
   NEXUS - Stellar Code Collaboration
   Interactive JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeParticleSystem();
    initializeHeatmap();
    initializeCommitGraph();
    initializeFileExplorer();
    initializeSearchShortcuts();
    initializeStatCounters();
    initializeBranchTabs();
    initializeSmoothScroll();
    initializeTooltips();
});

/* ========================================
   Particle System
   ======================================== */

function initializeParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = [
                'rgba(124, 58, 237, ',  // Purple
                'rgba(6, 182, 212, ',   // Cyan
                'rgba(249, 115, 22, '   // Orange
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawConnections();

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

/* ========================================
   Activity Heatmap
   ======================================== */

function initializeHeatmap() {
    const mainHeatmap = document.getElementById('main-heatmap');
    const previewHeatmap = document.getElementById('heatmap-preview');

    if (!mainHeatmap) return;

    // Generate random contribution data for the past year
    function generateContributionData() {
        const data = [];
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        // Start from the first Sunday on or before oneYearAgo
        const startDate = new Date(oneYearAgo);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const currentDate = new Date(startDate);
        let weekIndex = 0;

        while (currentDate <= today) {
            if (!data[weekIndex]) {
                data[weekIndex] = [];
            }

            const dayOfWeek = currentDate.getDay();
            const contributions = Math.floor(Math.random() * 15);
            let level = 0;

            if (contributions > 0) level = 1;
            if (contributions > 3) level = 2;
            if (contributions > 7) level = 3;
            if (contributions > 11) level = 4;

            data[weekIndex][dayOfWeek] = {
                date: new Date(currentDate),
                count: contributions,
                level: level
            };

            if (dayOfWeek === 6) {
                weekIndex++;
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return data;
    }

    const contributionData = generateContributionData();

    // Render main heatmap
    function renderMainHeatmap() {
        mainHeatmap.innerHTML = '';
        mainHeatmap.style.gridTemplateColumns = `repeat(${contributionData.length}, 1fr)`;

        contributionData.forEach((week, weekIndex) => {
            for (let day = 0; day < 7; day++) {
                const dayData = week[day];
                const cell = document.createElement('div');
                cell.className = `heatmap-day level-${dayData ? dayData.level : 0}`;
                
                if (dayData) {
                    const dateStr = dayData.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    cell.title = `${dayData.count} contributions on ${dateStr}`;
                }

                mainHeatmap.appendChild(cell);
            }
        });
    }

    // Render preview heatmap for feature card
    function renderPreviewHeatmap() {
        if (!previewHeatmap) return;
        
        previewHeatmap.innerHTML = '';
        
        for (let i = 0; i < 49; i++) {
            const cell = document.createElement('div');
            const level = Math.floor(Math.random() * 5);
            cell.className = `heatmap-cell level-${level}`;
            previewHeatmap.appendChild(cell);
        }
    }

    renderMainHeatmap();
    renderPreviewHeatmap();

    // Add hover effect for heatmap cells
    mainHeatmap.addEventListener('mouseenter', (e) => {
        if (e.target.classList.contains('heatmap-day')) {
            e.target.style.transform = 'scale(1.5)';
        }
    }, true);

    mainHeatmap.addEventListener('mouseleave', (e) => {
        if (e.target.classList.contains('heatmap-day')) {
            e.target.style.transform = 'scale(1)';
        }
    }, true);
}

/* ========================================
   Commit Graph Visualization
   ======================================== */

function initializeCommitGraph() {
    const canvas = document.getElementById('commit-graph');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('commit-tooltip');

    let commits = [];
    let animationProgress = 0;
    let animationId = null;

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        generateCommits();
    }

    function generateCommits() {
        commits = [];
        const branches = ['main', 'develop', 'feature/orbital'];
        const branchColors = {
            'main': '#7c3aed',
            'develop': '#06b6d4',
            'feature/orbital': '#f97316'
        };

        const messages = [
            'feat: implement orbital mechanics',
            'fix: resolve collision detection',
            'refactor: optimize particle system',
            'docs: update API reference',
            'test: add unit tests for gravity',
            'style: format code with prettier',
            'chore: update dependencies',
            'perf: improve rendering speed'
        ];

        // Generate commits for each branch
        branches.forEach((branch, branchIndex) => {
            const commitCount = 15 + Math.floor(Math.random() * 10);
            const yOffset = 40 + branchIndex * 50;

            for (let i = 0; i < commitCount; i++) {
                commits.push({
                    x: 60 + i * ((canvas.width - 120) / commitCount),
                    y: yOffset + Math.sin(i * 0.5) * 15,
                    branch: branch,
                    color: branchColors[branch],
                    hash: generateHash(),
                    message: messages[Math.floor(Math.random() * messages.length)],
                    author: ['stellar-dev', 'cosmic-coder', 'nebula-engineer'][Math.floor(Math.random() * 3)],
                    time: `${Math.floor(Math.random() * 12) + 1}h ago`,
                    isMerge: Math.random() > 0.85
                });
            }
        });
    }

    function generateHash() {
        const chars = 'abcdef0123456789';
        let hash = '';
        for (let i = 0; i < 7; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }

    function drawBranchLines() {
        const branches = ['main', 'develop', 'feature/orbital'];
        const branchColors = {
            'main': '#7c3aed',
            'develop': '#06b6d4',
            'feature/orbital': '#f97316'
        };

        branches.forEach((branch, branchIndex) => {
            const branchCommits = commits.filter(c => c.branch === branch);
            if (branchCommits.length < 2) return;

            ctx.beginPath();
            ctx.strokeStyle = branchColors[branch] + '40';
            ctx.lineWidth = 2;

            // Draw smooth curve through commits
            ctx.moveTo(branchCommits[0].x, branchCommits[0].y);

            for (let i = 1; i < branchCommits.length; i++) {
                const prev = branchCommits[i - 1];
                const curr = branchCommits[i];
                const cpX = (prev.x + curr.x) / 2;
                
                ctx.bezierCurveTo(
                    cpX, prev.y,
                    cpX, curr.y,
                    curr.x, curr.y
                );
            }

            ctx.stroke();
        });
    }

    function drawCommits() {
        commits.forEach((commit, index) => {
            const progress = Math.min(1, animationProgress * 2 - index * 0.05);
            if (progress <= 0) return;

            const alpha = Math.min(1, progress);
            
            if (commit.isMerge) {
                // Draw merge commit (diamond shape)
                ctx.save();
                ctx.translate(commit.x, commit.y);
                ctx.rotate(Math.PI / 4);
                ctx.fillStyle = commit.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                ctx.fillRect(-5, -5, 10, 10);
                ctx.strokeStyle = '#0a0a0f';
                ctx.lineWidth = 2;
                ctx.strokeRect(-5, -5, 10, 10);
                ctx.restore();
            } else {
                // Draw regular commit (circle)
                ctx.beginPath();
                ctx.arc(commit.x, commit.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = commit.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                ctx.fill();
                ctx.strokeStyle = '#0a0a0f';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Add glow effect
                ctx.shadowColor = commit.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(commit.x, commit.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = commit.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;

        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        drawBranchLines();
        drawCommits();

        if (animationProgress < 1) {
            animationProgress += 0.01;
            animationId = requestAnimationFrame(draw);
        }
    }

    function startAnimation() {
        animationProgress = 0;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        draw();
    }

    // Tooltip handling
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let hoveredCommit = null;
        let minDistance = Infinity;

        commits.forEach(commit => {
            const distance = Math.sqrt(
                Math.pow(commit.x - x, 2) + Math.pow(commit.y - y, 2)
            );
            if (distance < 15 && distance < minDistance) {
                minDistance = distance;
                hoveredCommit = commit;
            }
        });

        if (hoveredCommit) {
            tooltip.classList.add('visible');
            tooltip.style.left = `${hoveredCommit.x + 10}px`;
            tooltip.style.top = `${hoveredCommit.y - 10}px`;
            tooltip.querySelector('.tooltip-hash').textContent = hoveredCommit.hash;
            tooltip.querySelector('.tooltip-message').textContent = hoveredCommit.message;
            tooltip.querySelector('.tooltip-meta').textContent = 
                `${hoveredCommit.author} • ${hoveredCommit.time}`;
            canvas.style.cursor = 'pointer';
        } else {
            tooltip.classList.remove('visible');
            canvas.style.cursor = 'default';
        }
    });

    canvas.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
    });

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        startAnimation();
    });

    // Animate on scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAnimation();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(canvas);

    // Initial animation
    startAnimation();
}

/* ========================================
   File Explorer
   ======================================== */

function initializeFileExplorer() {
    const folders = document.querySelectorAll('.tree-item.folder');
    const files = document.querySelectorAll('.tree-item.file');
    const repoItems = document.querySelectorAll('.repo-item');

    // Folder expand/collapse
    folders.forEach(folder => {
        folder.addEventListener('click', (e) => {
            if (e.target.closest('.folder-contents')) return;
            folder.classList.toggle('expanded');
        });
    });

    // File selection
    files.forEach(file => {
        file.addEventListener('click', () => {
            document.querySelectorAll('.tree-item.file.active').forEach(f => {
                f.classList.remove('active');
            });
            file.classList.add('active');
        });
    });

    // Repository selection
    repoItems.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.repo-item.active').forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
        });
    });

    // Add subtle animation to file tree items
    const treeItems = document.querySelectorAll('.tree-item');
    treeItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

/* ========================================
   Search Keyboard Shortcut
   ======================================== */

function initializeSearchShortcuts() {
    const searchInput = document.querySelector('.search-input');

    document.addEventListener('keydown', (e) => {
        // Focus search on '/' key
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }

        // Blur search on Escape
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.blur();
        }
    });
}

/* ========================================
   Statistics Counter Animation
   ======================================== */

function initializeStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');

    const animateValue = element => {
        const target = parseFloat(element.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = target * easeOutQuart;

            if (target >= 1000) {
                element.textContent = (current / 1000).toFixed(1) + 'M';
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    // Animate on scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => observer.observe(stat));
}

/* ========================================
   Branch Tabs
   ======================================== */

function initializeBranchTabs() {
    const branchTabs = document.querySelectorAll('.branch-tab');
    const commitList = document.getElementById('commit-list');

    const commitData = {
        main: [
            { hash: 'a3f8c2d', msg: 'feat: implement orbital mechanics engine', author: 'stellar-dev', time: '2 hours ago' },
            { hash: 'b7e2f1a', msg: 'fix: resolve collision detection edge case', author: 'cosmic-coder', time: '4 hours ago' },
            { hash: 'c9d4e3b', msg: 'refactor: optimize particle system rendering', author: 'nebula-engineer', time: '6 hours ago' }
        ],
        develop: [
            { hash: 'd4f5a6b', msg: 'feat: add gravity simulation module', author: 'orbit-master', time: '1 hour ago' },
            { hash: 'e8c9d7f', msg: 'test: add integration tests for physics', author: 'quantum-dev', time: '3 hours ago' },
            { hash: 'f1a2b3c', msg: 'chore: update build configuration', author: 'stellar-dev', time: '5 hours ago' }
        ],
        'feature/orbital': [
            { hash: '1a2b3c4', msg: 'feat: implement Kepler orbit calculations', author: 'gravity-wizard', time: '30 minutes ago' },
            { hash: '5d6e7f8', msg: 'fix: correct velocity vector math', author: 'orbit-master', time: '2 hours ago' },
            { hash: '9a0b1c2', msg: 'docs: add orbital mechanics documentation', author: 'cosmic-coder', time: '4 hours ago' }
        ]
    };

    branchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            branchTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const branch = tab.dataset.branch;
            updateCommitList(commitData[branch] || commitData.main);
        });
    });

    function updateCommitList(commits) {
        if (!commitList) return;

        commitList.style.opacity = '0';

        setTimeout(() => {
            commitList.innerHTML = commits.map((commit, index) => `
                <div class="commit-item" style="animation-delay: ${index * 0.1}s">
                    <div class="commit-avatar">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${commit.author}" alt="${commit.author}">
                    </div>
                    <div class="commit-details">
                        <span class="commit-msg">${commit.msg}</span>
                        <span class="commit-author">${commit.author} • ${commit.time}</span>
                    </div>
                    <span class="commit-hash">${commit.hash}</span>
                </div>
            `).join('');

            commitList.style.opacity = '1';
            commitList.style.transition = 'opacity 0.3s ease';

            // Animate items
            const items = commitList.querySelectorAll('.commit-item');
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 150);
    }
}

/* ========================================
   Smooth Scroll
   ======================================== */

function initializeSmoothScroll() {
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

/* ========================================
   Tooltips
   ======================================== */

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        const tooltipText = element.dataset.tooltip;
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = tooltipText;
        
        Object.assign(tooltip.style, {
            position: 'absolute',
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            padding: 'var(--spacing-2) var(--spacing-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-xs)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: '0',
            transform: 'translateY(5px)',
            transition: 'all 0.2s ease',
            zIndex: 'var(--z-tooltip)',
            boxShadow: 'var(--shadow-lg)'
        });

        element.style.position = 'relative';
        element.appendChild(tooltip);

        element.addEventListener('mouseenter', () => {
            const rect = element.getBoundingClientRect();
            tooltip.style.left = '50%';
            tooltip.style.bottom = '100%';
            tooltip.style.transform = 'translateX(-50%) translateY(-8px)';
            tooltip.style.opacity = '1';
        });

        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) translateY(5px)';
        });
    });
}

/* ========================================
   Feature Card Interactions
   ======================================== */

function initializeFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    const constellation = document.getElementById('features-constellation');
    const lines = document.querySelectorAll('.constellation-line');

    // Animate constellation lines on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lines.forEach((line, index) => {
                    setTimeout(() => {
                        line.style.opacity = '1';
                    }, index * 300);
                });
            }
        });
    }, { threshold: 0.2 });

    if (constellation) {
        observer.observe(constellation);
    }

    // Card hover effects
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0.2';
            }
        });

        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
}

/* ========================================
   Merge Card Interactions
   ======================================== */

function initializeMergeCards() {
    const mergeCards = document.querySelectorAll('.merge-card');

    mergeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Simulate navigation to merge request
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });

    // Animate check items
    const checkItems = document.querySelectorAll('.check-item');
    checkItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 500 + index * 100);
    });
}

/* ========================================
   Navigation Scroll Effect
   ======================================== */

function initializeNavScroll() {
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.8)';
            nav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

/* ========================================
   Initialize All Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeFeatureCards();
    initializeMergeCards();
    initializeNavScroll();
});

/* ========================================
   Dynamic Content Loading Simulation
   ======================================== */

function simulateLoading() {
    const loadingElements = document.querySelectorAll('[data-loading]');
    
    loadingElements.forEach(element => {
        element.classList.add('loading');
        
        setTimeout(() => {
            element.classList.remove('loading');
            element.classList.add('loaded');
        }, 1000 + Math.random() * 1000);
    });
}

/* ========================================
   Resize Handler
   ======================================== */

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize components that depend on window size
        initializeCommitGraph();
    }, 250);
});

/* ========================================
   Export for potential module usage
   ======================================== */

window.NexusApp = {
    initializeParticleSystem,
    initializeHeatmap,
    initializeCommitGraph,
    initializeFileExplorer,
    initializeStatCounters,
    initializeBranchTabs
};