document.addEventListener('DOMContentLoaded', () => {
    initCommitGraph();
    initHeatmap();
    initFileTree();
    initPullRequests();
    initModal();
    initSearch();
    initBranchSelector();
});

function initCommitGraph() {
    const graphNodes = document.getElementById('graphNodes');
    if (!graphNodes) return;

    const commits = [
        { x: 50, y: 100, branch: 'main', hash: 'a1b2c3d', message: 'Initial commit' },
        { x: 120, y: 100, branch: 'main', hash: 'e4f5g6h', message: 'Add base config' },
        { x: 200, y: 80, branch: 'main', hash: 'i7j8k9l', message: 'Implement auth module' },
        { x: 280, y: 120, branch: 'feature', hash: 'm0n1o2p', message: 'Start OAuth flow' },
        { x: 350, y: 90, branch: 'main', hash: 'q3r4s5t', message: 'Merge feature branch' },
        { x: 420, y: 65, branch: 'hotfix', hash: 'u6v7w8x', message: 'Fix security issue' },
        { x: 500, y: 70, branch: 'main', hash: 'y9z0a1b', message: 'Update dependencies' },
        { x: 580, y: 110, branch: 'feature', hash: 'c2d3e4f', message: 'Add refresh tokens' },
        { x: 650, y: 100, branch: 'main', hash: 'g5h6i7j', message: 'Release v2.0.0' },
        { x: 750, y: 85, branch: 'main', hash: 'k8l9m0n', message: 'Update docs' }
    ];

    const branchColors = {
        main: '#00d9ff',
        feature: '#ff8a50',
        hotfix: '#50ff8a'
    };

    commits.forEach((commit, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', commit.x);
        circle.setAttribute('cy', commit.y);
        circle.setAttribute('r', '6');
        circle.setAttribute('class', 'commit-node');
        circle.setAttribute('data-hash', commit.hash);
        circle.setAttribute('data-message', commit.message);
        circle.style.stroke = branchColors[commit.branch] || '#00d9ff';
        circle.style.opacity = '0';
        circle.style.animation = 'fadeInNode 0.3s ease ' + (index * 0.1) + 's forwards';
        circle.addEventListener('mouseenter', function(e) { showCommitTooltip(e, commit); });
        circle.addEventListener('mouseleave', hideCommitTooltip);
        circle.addEventListener('click', function() { showCommitDetails(commit); });
        graphNodes.appendChild(circle);
    });

    const styleSheet = document.createElement('style');
    styleSheet.textContent = '@keyframes fadeInNode { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }';
    document.head.appendChild(styleSheet);
}

let tooltipEl = null;

function showCommitTooltip(e, commit) {
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'commit-tooltip';
        tooltipEl.style.cssText = 'position: fixed; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 0.75rem 1rem; z-index: 1000; pointer-events: none; box-shadow: var(--shadow-lg); font-size: 0.8125rem;';
        document.body.appendChild(tooltipEl);
    }

    const hashDiv = document.createElement('div');
    hashDiv.style.cssText = 'color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.75rem; margin-bottom: 0.25rem;';
    hashDiv.textContent = commit.hash;

    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = 'color: var(--text-primary);';
    msgDiv.textContent = commit.message;

    tooltipEl.innerHTML = '';
    tooltipEl.appendChild(hashDiv);
    tooltipEl.appendChild(msgDiv);

    const rect = e.target.getBoundingClientRect();
    tooltipEl.style.left = (rect.left + rect.width / 2 - 80) + 'px';
    tooltipEl.style.top = (rect.top - 60) + 'px';
    tooltipEl.style.opacity = '1';
    tooltipEl.style.transform = 'translateY(0)';
}

function hideCommitTooltip() {
    if (tooltipEl) {
        tooltipEl.style.opacity = '0';
        tooltipEl.style.transform = 'translateY(10px)';
    }
}

function showCommitDetails(commit) {
    console.log('Showing details for commit:', commit.hash);
}

function initHeatmap() {
    const heatmapGrid = document.getElementById('heatmapGrid');
    if (!heatmapGrid) return;

    const weeks = 52;
    const daysPerWeek = 7;

    for (let i = 0; i < weeks * daysPerWeek; i++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        const level = Math.random();
        if (level > 0.85) {
            cell.classList.add('level-4');
        } else if (level > 0.7) {
            cell.classList.add('level-3');
        } else if (level > 0.5) {
            cell.classList.add('level-2');
        } else if (level > 0.3) {
            cell.classList.add('level-1');
        }
        cell.style.animationDelay = (i * 5) + 'ms';
        
        const date = new Date();
        date.setDate(date.getDate() - (weeks * daysPerWeek - i));
        cell.setAttribute('data-date', date.toISOString().split('T')[0]);
        
        cell.addEventListener('mouseenter', function(e) {
            const dateAttr = e.target.getAttribute('data-date');
            const levelNum = getLevelFromClass(e.target.className);
            const contributions = Math.floor(levelNum * Math.random() * 15);
            showHeatmapTooltip(e, dateAttr, contributions);
        });
        cell.addEventListener('mouseleave', hideHeatmapTooltip);
        
        heatmapGrid.appendChild(cell);
    }
}

let heatmapTooltip = null;

function getLevelFromClass(className) {
    if (className.includes('level-4')) return 4;
    if (className.includes('level-3')) return 3;
    if (className.includes('level-2')) return 2;
    if (className.includes('level-1')) return 1;
    return 0;
}

function showHeatmapTooltip(e, date, contributions) {
    if (!heatmapTooltip) {
        heatmapTooltip = document.createElement('div');
        heatmapTooltip.className = 'heatmap-tooltip';
        heatmapTooltip.style.cssText = 'position: fixed; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 0.5rem 0.75rem; z-index: 1000; pointer-events: none; box-shadow: var(--shadow-lg); font-size: 0.75rem;';
        document.body.appendChild(heatmapTooltip);
    }

    const contribDiv = document.createElement('div');
    contribDiv.style.cssText = 'color: var(--text-primary); font-weight: 500;';
    contribDiv.textContent = contributions + ' contributions';

    const dateDiv = document.createElement('div');
    dateDiv.style.cssText = 'color: var(--text-tertiary); font-size: 0.6875rem;';
    dateDiv.textContent = date;

    heatmapTooltip.innerHTML = '';
    heatmapTooltip.appendChild(contribDiv);
    heatmapTooltip.appendChild(dateDiv);

    const rect = e.target.getBoundingClientRect();
    heatmapTooltip.style.left = rect.left + 'px';
    heatmapTooltip.style.top = (rect.top - 45) + 'px';
    heatmapTooltip.style.opacity = '1';
}

function hideHeatmapTooltip() {
    if (heatmapTooltip) {
        heatmapTooltip.style.opacity = '0';
    }
}

function initFileTree() {
    const folders = document.querySelectorAll('.tree-item.folder');
    folders.forEach(function(folder) {
        const content = folder.querySelector('.tree-item-content');
        content.addEventListener('click', function(e) {
            e.stopPropagation();
            folder.classList.toggle('expanded');
            const folderIcon = folder.querySelector('.folder-icon');
            if (folder.classList.contains('expanded')) {
                folderIcon.style.transform = 'rotate(0deg)';
            } else {
                folderIcon.style.transform = 'rotate(-90deg)';
            }
        });
    });

    const files = document.querySelectorAll('.tree-item.file');
    files.forEach(function(file) {
        const content = file.querySelector('.tree-item-content');
        content.addEventListener('click', function(e) {
            e.stopPropagation();
            files.forEach(function(f) { f.classList.remove('selected'); });
            file.classList.add('selected');
            const path = file.getAttribute('data-path');
            console.log('Selected file:', path);
        });
    });
}

function initPullRequests() {
    const prCards = document.querySelectorAll('.pr-card');
    prCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const prId = card.getAttribute('data-pr-id');
            openPRModal(prId);
        });
    });
}

function openPRModal(prId) {
    const modal = document.getElementById('prModal');
    const modalBody = document.getElementById('modalBody');
    const prData = getPRData(prId);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'modal-pr-header';
    headerDiv.style.marginBottom = '0.75rem';

    const titleH3 = document.createElement('h3');
    titleH3.style.cssText = 'font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary); margin-bottom: 0.75rem;';
    titleH3.textContent = prData.title;

    const labelsDiv = document.createElement('div');
    labelsDiv.className = 'modal-pr-labels';
    labelsDiv.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 1rem;';

    prData.labels.forEach(function(l) {
        const labelSpan = document.createElement('span');
        labelSpan.className = 'label label-' + l;
        labelSpan.textContent = l;
        labelsDiv.appendChild(labelSpan);
    });

    headerDiv.appendChild(titleH3);
    headerDiv.appendChild(labelsDiv);

    const metaContainer = document.createElement('div');
    metaContainer.className = 'modal-pr-meta';
    metaContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;';

    const branchBox = document.createElement('div');
    branchBox.style.cssText = 'background: var(--bg-elevated); padding: 1rem; border-radius: var(--radius-md);';
    branchBox.innerHTML = '<div style="color: var(--text-tertiary); font-size: 0.75rem; margin-bottom: 0.25rem;">Branch</div><div style="color: var(--text-primary); font-family: var(--font-mono);">' + prData.branch + '</div>';

    const authorBox = document.createElement('div');
    authorBox.style.cssText = 'background: var(--bg-elevated); padding: 1rem; border-radius: var(--radius-md);';
    authorBox.innerHTML = '<div style="color: var(--text-tertiary); font-size: 0.75rem; margin-bottom: 0.25rem;">Author</div><div style="display: flex; align-items: center; gap: 0.5rem;"><img src="' + prData.authorAvatar + '" style="width: 24px; height: 24px; border-radius: 50%;"><span style="color: var(--text-primary);">' + prData.author + '</span></div>';

    metaContainer.appendChild(branchBox);
    metaContainer.appendChild(authorBox);

    const descSection = document.createElement('div');
    descSection.style.marginBottom = '1.5rem;';
    descSection.innerHTML = '<div style="color: var(--text-tertiary); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Description</div><p style="color: var(--text-secondary); line-height: 1.7;">' + prData.description + '</p>';

    const changesSection = document.createElement('div');
    changesSection.style.marginBottom = '1.5rem;';
    changesSection.innerHTML = '<div style="color: var(--text-tertiary); font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Changes</div><div style="display: flex; gap: 1.5rem; font-family: var(--font-mono);"><span style="color: var(--accent-green);">+' + prData.additions + '</span><span style="color: var(--accent-red);">-' + prData.deletions + '</span><span style="color: var(--text-tertiary);">' + prData.files + ' files changed</span></div>';

    const actionsDiv = document.createElement('div');
    actionsDiv.style.cssText = 'display: flex; gap: 0.75rem; margin-top: 1.5rem;';

    const approveBtn = document.createElement('button');
    approveBtn.className = 'btn-primary';
    approveBtn.style.flex = '1';
    approveBtn.textContent = 'Approve';

    const requestBtn = document.createElement('button');
    requestBtn.className = 'btn-ghost';
    requestBtn.style.flex = '1';
    requestBtn.textContent = 'Request Changes';

    actionsDiv.appendChild(approveBtn);
    actionsDiv.appendChild(requestBtn);

    modalBody.innerHTML = '';
    modalBody.appendChild(headerDiv);
    modalBody.appendChild(metaContainer);
    modalBody.appendChild(descSection);
    modalBody.appendChild(changesSection);
    modalBody.appendChild(actionsDiv);

    modal.classList.add('active');
}

function getPRData(prId) {
    const prDataMap = {
        '1': {
            title: 'feat: Implement OAuth2 authentication flow',
            labels: ['feature', 'security'],
            branch: 'feature/oauth → main',
            author: 'Sarah Kim',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
            description: 'This PR implements a complete OAuth2 authentication flow with PKCE (Proof Key for Code Exchange) for enhanced security. The implementation includes token refresh handling, secure storage using HttpOnly cookies, and proper error handling for all OAuth error responses. All existing tests have been updated and new tests have been added for the OAuth flow.',
            additions: 342,
            deletions: 56,
            files: 12
        },
        '2': {
            title: 'fix: Resolve memory leak in WebSocket connection handler',
            labels: ['bugfix'],
            branch: 'fix/websocket-leak → main',
            author: 'Mike Torres',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
            description: 'Fixed a critical memory leak in the WebSocket connection handler. The issue was caused by event listeners not being properly cleaned up when connections were closed or when reconnection attempts were made. This fix ensures all listeners are removed and the WebSocket instance is properly nullified.',
            additions: 28,
            deletions: 12,
            files: 3
        },
        '3': {
            title: 'refactor: Migrate state management to Zustand',
            labels: ['refactor', 'breaking'],
            branch: 'refactor/zustand → main',
            author: 'Emma Liu',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
            description: 'This major refactor replaces Redux with Zustand for state management. The new implementation is significantly simpler, with less boilerplate code and better TypeScript support. A migration guide has been included for existing consumers. Breaking changes are documented in the CHANGELOG.',
            additions: 1247,
            deletions: 892,
            files: 47
        }
    };
    return prDataMap[prId] || prDataMap['1'];
}

function initModal() {
    const modal = document.getElementById('prModal');
    const closeBtn = modal.querySelector('.modal-close');

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchShortcut = document.querySelector('.search-shortcut');

    document.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    searchInput.addEventListener('focus', function() {
        searchShortcut.style.opacity = '0';
    });

    searchInput.addEventListener('blur', function() {
        searchShortcut.style.opacity = '1';
    });

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        console.log('Searching for:', query);
    });
}

function initBranchSelector() {
    const branchBtn = document.querySelector('.branch-btn');
    const branches = ['main', 'develop', 'feature/auth', 'hotfix/security'];
    let currentBranchIndex = 0;

    branchBtn.addEventListener('click', function() {
        currentBranchIndex = (currentBranchIndex + 1) % branches.length;
        const branchName = branchBtn.querySelector('span');
        branchName.style.opacity = '0';
        setTimeout(function() {
            branchName.textContent = branches[currentBranchIndex];
            branchName.style.opacity = '1';
        }, 150);
    });
}

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.section-card, .pr-card').forEach(function(el) {
    observer.observe(el);
});

let lastScrollY = window.scrollY;
const topBar = document.querySelector('.top-bar');

window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        topBar.style.transform = 'translateY(-100%)';
    } else {
        topBar.style.transform = 'translateY(0)';
    }
    lastScrollY = currentScrollY;
}, { passive: true });

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = function(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const contributionCount = document.querySelector('.contribution-count');
if (contributionCount) {
    const finalValue = parseInt(contributionCount.textContent);
    contributionCount.textContent = '0';
    setTimeout(function() {
        animateValue(contributionCount, 0, finalValue, 1500);
    }, 500);
}

const diffLines = document.querySelectorAll('.diff-line');
diffLines.forEach(function(line, index) {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-10px)';
    line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    line.style.transitionDelay = (index * 30) + 'ms';
    setTimeout(function() {
        line.style.opacity = '1';
        line.style.transform = 'translateX(0)';
    }, 100);
});

console.log('ObsidianGit interface initialized successfully');