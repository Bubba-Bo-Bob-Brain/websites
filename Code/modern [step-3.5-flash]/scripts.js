// ============================================
// CodeForge - Interactive JavaScript
// ============================================

// Global State Management
const State = {
    currentView: 'dashboard',
    selectedRepo: 'codeforge/core',
    selectedFile: null,
    repositories: [],
    commits: [],
    issues: [],
    pullRequests: [],
    heatmapData: [],
    isSidebarOpen: false,
    searchQuery: '',
    user: {
        name: 'Alex Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeForgeUser',
        status: 'online'
    }
};

// DOM Elements Cache
const Cache = {
    views: {},
    navItems: null,
    sidebarRepos: null,
    heatmap: null,
    commitGraph: null,
    prList: null,
    issueList: null,
    fileTree: null,
    codeViewer: null,
    searchDropdown: null,
    modalOverlay: null,
    toastContainer: null
};

// ============================================
// DATA GENERATION
// ============================================

function generateMockData() {
    // Generate repositories
    const repoNames = [
        'codeforge/core',
        'codeforge/web',
        'codeforge/mobile',
        'codeforge/api',
        'codeforge/cli',
        'codeforge/docs',
        'codeforge/design-system',
        'codeforge/integrations',
        'codeforge/analytics',
        'codeforge/ci-cd'
    ];

    State.repositories = repoNames.map((name, index) => ({
        id: index,
        name,
        description: getRandomRepoDescription(),
        stars: Math.floor(Math.random() * 5000) + 100,
        forks: Math.floor(Math.random() * 1000) + 50,
        watchers: Math.floor(Math.random() * 500) + 20,
        language: ['TypeScript', 'Python', 'Go', 'Rust', 'Java'][Math.floor(Math.random() * 5)],
        updatedAt: getRandomTime(),
        isPrivate: Math.random() > 0.8
    }));

    // Generate commits (last 365 days)
    State.commits = [];
    const commitMessages = [
        'feat: add new authentication flow',
        'fix: resolve memory leak in cache service',
        'docs: update API documentation',
        'refactor: simplify error handling',
        'test: add comprehensive test coverage',
        'chore: update dependencies',
        'feat: implement real-time notifications',
        'fix: handle edge case in file upload',
        'perf: optimize database queries',
        'style: format code with new linting rules',
        'feat: add dark mode support',
        'fix: correct timezone handling',
        'ci: update build pipeline',
        'revert: "feat: experimental feature flag"',
        'feat: enhance search functionality',
        'fix: security vulnerability in auth middleware',
        'docs: add contribution guidelines',
        'chore: cleanup legacy code',
        'test: integrate e2e testing suite',
        'feat: support OAuth 2.0 providers'
    ];

    const authors = ['Alex Chen', 'Sarah Miller', 'James Wilson', 'Emma Davis', 'Michael Brown'];

    for (let i = 0; i < 500; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        
        State.commits.push({
            id: i,
            hash: generateCommitHash(),
            shortHash: generateShortHash(),
            message: commitMessages[Math.floor(Math.random() * commitMessages.length)],
            author: authors[Math.floor(Math.random() * authors.length)],
            authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
            date,
            timeAgo: getTimeAgo(date),
            branch: 'main',
            parents: Math.floor(Math.random() * 3),
            verified: Math.random() > 0.3
        });
    }

    State.commits.sort((a, b) => b.date - a.date);

    // Generate heatmap data (52 weeks x 7 days)
    State.heatmapData = [];
    const today = new Date();
    for (let week = 0; week < 52; week++) {
        for (let day = 0; day < 7; day++) {
            const date = new Date(today);
            date.setDate(date.getDate() - (51 - week) * 7 - (6 - day));
            
            // Generate activity level (0-4) with some randomness
            let level = Math.random();
            if (level > 0.9) level = 4;
            else if (level > 0.75) level = 3;
            else if (level > 0.5) level = 2;
            else if (level > 0.25) level = 1;
            else level = 0;

            State.heatmapData.push({
                date,
                day,
                week,
                level,
                count: level * Math.floor(Math.random() * 10 + 2)
            });
        }
    }

    // Generate pull requests
    const prTitles = [
        'Add user profile management',
        'Implement payment integration',
        'Optimize image loading',
        'Add two-factor authentication',
        'Refactor API endpoints',
        'Add export functionality',
        'Improve error messages',
        'Add keyboard shortcuts',
        'Implement drag and drop',
        'Add real-time collaboration'
    ];

    State.pullRequests = [];
    for (let i = 0; i < 30; i++) {
        const status = i < 7 ? 'open' : i < 31 ? 'merged' : 'closed';
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 60));
        
        State.pullRequests.push({
            id: i + 1,
            number: i + 100,
            title: prTitles[Math.floor(Math.random() * prTitles.length)],
            description: 'This PR introduces important improvements to the codebase...',
            status,
            author: authors[Math.floor(Math.random() * authors.length)],
            authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
            baseBranch: 'main',
            headBranch: `feature/pr-${i + 100}`,
            commits: Math.floor(Math.random() * 20) + 1,
            additions: Math.floor(Math.random() * 1000) + 100,
            deletions: Math.floor(Math.random() * 500) + 50,
            date,
            reviewers: Array.from({ length: Math.floor(Math.random() * 3) }, () => 
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`),
            checks: {
                ci: Math.random() > 0.2,
                tests: Math.random() > 0.2,
                lint: Math.random() > 0.1
            }
        });
    }

    // Generate issues
    const issueTitles = [
        'Cannot upload files larger than 10MB',
        'Search results not showing all matches',
        'Dark mode text contrast issues',
        'Memory leak on long-running sessions',
        'API rate limiting too aggressive',
        'Mobile menu not closing on selection',
        'Incorrect date formatting in reports',
        'Keyboard navigation broken in modal',
        'Performance degradation with large datasets',
        'Infinite scroll loading duplicate items'
    ];

    const labels = ['bug', 'enhancement', 'documentation', 'question', 'urgent'];

    State.issues = [];
    for (let i = 0; i < 50; i++) {
        const status = i < 23 ? 'open' : 'closed';
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));
        
        State.issues.push({
            id: i + 1,
            number: i + 200,
            title: issueTitles[Math.floor(Math.random() * issueTitles.length)],
            description: 'Detailed description of the issue...',
            status,
            author: authors[Math.floor(Math.random() * authors.length)],
            authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
            labels: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
                labels[Math.floor(Math.random() * labels.length)]),
            priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            date,
            comments: Math.floor(Math.random() * 20)
        });
    }
}

function getRandomRepoDescription() {
    const descriptions = [
        'A modern web application built with React and TypeScript',
        'High-performance API server with Go and PostgreSQL',
        'Cross-platform mobile app using Flutter',
        'Machine learning pipeline for data analysis',
        'Real-time collaboration platform with WebSocket',
        'CLI tool for DevOps automation',
        'Design system with reusable components',
        'Microservices architecture with Kubernetes',
        'Static site generator for documentation',
        'Blockchain-based smart contract platform'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateCommitHash() {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 40; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

function generateShortHash() {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 7; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

function getRandomTime() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    now.setDate(now.getDate() - daysAgo);
    return now;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    return 'just now';
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    generateMockData();
    cacheElements();
    setupEventListeners();
    renderHeatmap();
    renderDashboardCommits();
    renderDashboardRepos();
    renderSidebarRepos();
    renderCommitsList();
    renderPRList();
    renderIssueList();
    renderFileTree();
    setupCommitGraph();
    setupKeyboardShortcuts();
    animateOnLoad();
}

function cacheElements() {
    Cache.views = {
        dashboard: document.getElementById('dashboard-view'),
        repository: document.getElementById('repository-view'),
        commits: document.getElementById('commits-view'),
        pullRequests: document.getElementById('pull-requests-view'),
        issues: document.getElementById('issues-view')
    };
    
    Cache.navItems = document.querySelectorAll('.nav-item');
    Cache.sidebarRepos = document.getElementById('sidebar-repos');
    Cache.heatmap = document.getElementById('heatmap');
    Cache.commitGraph = document.getElementById('commit-graph');
    Cache.prList = document.getElementById('pr-list');
    Cache.issueList = document.getElementById('issue-list');
    Cache.fileTree = document.getElementById('repo-file-tree');
    Cache.codeViewer = document.getElementById('code-viewer');
    Cache.searchDropdown = document.getElementById('search-dropdown');
    Cache.modalOverlay = document.getElementById('modal-overlay');
    Cache.toastContainer = document.getElementById('toast-container');
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Navigation
    Cache.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            if (view) switchView(view);
        });
    });

    // Search
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('focus', showSearchDropdown);
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideSearchDropdown();
                searchInput.blur();
            }
        });
    }

    // Click outside to close dropdowns
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            hideSearchDropdown();
        }
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        }
    });

    // Dropdown toggles
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.closest('.dropdown');
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            dropdown.classList.toggle('active');
        });
    });

    // Modals
    document.getElementById('create-btn').addEventListener('click', () => openModal('create'));
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    Cache.modalOverlay.addEventListener('click', closeAllModals);

    // Create options
    document.querySelectorAll('.create-option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.create;
            handleCreate(type);
        });
    });

    // Repository actions
    document.getElementById('new-repo-btn')?.addEventListener('click', () => {
        openModal('create');
        setTimeout(() => {
            document.querySelector('[data-create="repository"]')?.click();
        }, 100);
    });

    // PR and Issue filters
    setupFilterTabs();

    // Diff viewer
    document.getElementById('close-diff')?.addEventListener('click', () => {
        document.getElementById('diff-viewer-container').classList.add('hidden');
    });

    // Toast close buttons
    Cache.toastContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('toast-close')) {
            const toast = e.target.closest('.toast');
            toast.remove();
        }
    });

    // Copy code button
    document.getElementById('copy-code-btn')?.addEventListener('click', copyCode);
}

function setupFilterTabs() {
    document.querySelectorAll('.filter-tabs').forEach(tabs => {
        tabs.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.filter;
                
                if (tab.closest('#pull-requests-view')) {
                    filterPRs(filter);
                } else if (tab.closest('#issues-view')) {
                    filterIssues(filter);
                }
            });
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

function switchView(viewName) {
    // Update nav items
    Cache.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewName);
    });

    // Update views
    Object.entries(Cache.views).forEach(([name, view]) => {
        view.classList.toggle('active', name === viewName);
    });

    State.currentView = viewName;

    // Scroll to top
    document.querySelector('.main-content').scrollTop = 0;

    // View-specific actions
    if (viewName === 'commits') {
        setTimeout(() => drawCommitGraph(), 100);
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function showSearchDropdown() {
    Cache.searchDropdown.classList.remove('hidden');
    // Populate with recent searches or suggestions
    renderSearchSuggestions();
}

function hideSearchDropdown() {
    Cache.searchDropdown.classList.add('hidden');
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    if (query.length === 0) {
        renderSearchSuggestions();
        return;
    }
    renderSearchResults(query);
}

function renderSearchSuggestions() {
    const suggestions = [
        { type: 'recent', text: 'codeforge/core' },
        { type: 'recent', text: 'Add authentication flow' },
        { type: 'recent', text: 'issue #234' },
        { type: 'quick', text: 'Search code...' },
        { type: 'quick', text: 'Search issues...' },
        { type: 'quick', text: 'Search commits...' }
    ];

    Cache.searchDropdown.innerHTML = suggestions.map(s => `
        <div class="search-result-item">
            <i class="fas fa-${s.type === 'recent' ? 'history' : 'search'}"></i>
            <span>${s.text}</span>
        </div>
    `).join('');
}

function renderSearchResults(query) {
    const results = [
        ...State.repositories.filter(r => r.name.includes(query)).map(r => ({
            type: 'repository',
            icon: 'fa-code-branch',
            text: r.name,
            subtitle: r.description
        })),
        ...State.commits.filter(c => c.message.toLowerCase().includes(query)).map(c => ({
            type: 'commit',
            icon: 'fa-code-commit',
            text: c.message,
            subtitle: c.hash.substring(0, 8)
        })),
        ...State.issues.filter(i => i.title.toLowerCase().includes(query)).map(i => ({
            type: 'issue',
            icon: 'fa-exclamation-circle',
            text: `#${i.number} ${i.title}`,
            subtitle: i.status
        }))
    ].slice(0, 10);

    Cache.searchDropdown.innerHTML = results.map(r => `
        <div class="search-result-item">
            <i class="fas fa-${r.icon}"></i>
            <div>
                <div>${r.text}</div>
                <small style="color: var(--text-muted)">${r.subtitle}</small>
            </div>
        </div>
    `).join('');
}

// ============================================
// DASHBOARD
// ============================================

function renderHeatmap() {
    if (!Cache.heatmap) return;

    const weeks = Array.from({ length: 52 }, (_, weekIndex) => {
        const weekData = State.heatmapData.filter(d => d.week === weekIndex);
        return weekData.map(d => `
            <div class="heatmap-cell level-${d.level}" 
                 data-tooltip="${d.date.toLocaleDateString()}: ${d.count} contributions">
            </div>
        `).join('');
    });

    Cache.heatmap.innerHTML = weeks.join('');
}

function renderDashboardCommits() {
    const container = document.getElementById('dashboard-commit-list');
    if (!container) return;

    const recentCommits = State.commits.slice(0, 5);
    container.innerHTML = recentCommits.map(commit => `
        <div class="commit-item">
            <div class="commit-avatar">
                <img src="${commit.authorAvatar}" alt="${commit.author}">
            </div>
            <div class="commit-info">
                <div class="commit-message">${commit.message}</div>
                <div class="commit-meta">
                    <span class="commit-author">${commit.author}</span>
                    <span class="commit-time">${commit.timeAgo}</span>
                    <span class="commit-hash">${commit.shortHash}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderDashboardRepos() {
    const container = document.getElementById('dashboard-repo-grid');
    if (!container) return;

    const featuredRepos = State.repositories.slice(0, 4);
    container.innerHTML = featuredRepos.map(repo => `
        <div class="repo-card" data-repo="${repo.name}">
            <div class="repo-card-header">
                <div>
                    <div class="repo-card-name">${repo.name}</div>
                    <div class="repo-card-meta">
                        <span class="branch-tag">${repo.language}</span>
                        <span class="separator">•</span>
                        <span>Updated ${getTimeAgo(repo.updatedAt)}</span>
                    </div>
                </div>
            </div>
            <div class="repo-card-description">${repo.description}</div>
            <div class="repo-card-stats">
                <div class="repo-stat">
                    <i class="fas fa-star"></i>
                    <span>${repo.stars.toLocaleString()}</span>
                </div>
                <div class="repo-stat">
                    <i class="fas fa-code-branch"></i>
                    <span>${repo.forks.toLocaleString()}</span>
                </div>
                <div class="repo-stat">
                    <i class="fas fa-eye"></i>
                    <span>${repo.watchers.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.repo-card').forEach(card => {
        card.addEventListener('click', () => {
            const repoName = card.dataset.repo;
            openRepository(repoName);
        });
    });
}

function renderSidebarRepos() {
    if (!Cache.sidebarRepos) return;

    Cache.sidebarRepos.innerHTML = State.repositories.slice(0, 5).map(repo => `
        <li data-repo="${repo.name}" class="${State.selectedRepo === repo.name ? 'active' : ''}">
            <i class="fas fa-code-branch"></i>
            <span>${repo.name.split('/')[1]}</span>
        </li>
    `).join('');

    Cache.sidebarRepos.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const repoName = item.dataset.repo;
            openRepository(repoName);
        });
    });
}

// ============================================
// REPOSITORY VIEW
// ============================================

function openRepository(repoName) {
    State.selectedRepo = repoName;
    
    // Update sidebar active state
    Cache.sidebarRepos?.querySelectorAll('li').forEach(item => {
        item.classList.toggle('active', item.dataset.repo === repoName);
    });

    // Switch to repository view
    switchView('repository');

    // Update repository info
    const repo = State.repositories.find(r => r.name === repoName);
    if (repo) {
        document.querySelector('.repo-name').textContent = repo.name;
        document.querySelector('.repo-description').textContent = repo.description;
        document.querySelectorAll('.repo-stats .value').forEach((el, i) => {
            const values = [repo.stars, repo.forks, repo.watchers];
            el.textContent = values[i].toLocaleString();
        });
    }

    // Load file tree and code
    renderFileTree();
    loadFile('README.md');
}

function renderFileTree() {
    if (!Cache.fileTree) return;

    const fileStructure = [
        { name: 'src', type: 'folder', children: [
            { name: 'components', type: 'folder', children: [
                { name: 'Button.tsx', type: 'file' },
                { name: 'Modal.tsx', type: 'file' },
                { name: 'Header.tsx', type: 'file' },
                { name: 'Sidebar.tsx', type: 'file' }
            ]},
            { name: 'hooks', type: 'folder', children: [
                { name: 'useAuth.ts', type: 'file' },
                { name: 'useApi.ts', type: 'file' }
            ]},
            { name: 'utils', type: 'folder', children: [
                { name: 'helpers.ts', type: 'file' },
                { name: 'validators.ts', type: 'file' }
            ]},
            { name: 'App.tsx', type: 'file' },
            { name: 'index.tsx', type: 'file' }
        ]},
        { name: 'public', type: 'folder', children: [
            { name: 'index.html', type: 'file' },
            { name: 'favicon.ico', type: 'file' }
        ]},
        { name: '.gitignore', type: 'file' },
        { name: 'package.json', type: 'file' },
        { name: 'tsconfig.json', type: 'file' },
        { name: 'README.md', type: 'file' }
    ];

    Cache.fileTree.innerHTML = renderTreeItems(fileStructure, 0);
    
    // Add click handlers
    Cache.fileTree.querySelectorAll('.tree-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Handle folder toggle
            if (item.classList.contains('folder')) {
                const children = item.nextElementSibling;
                if (children && children.classList.contains('tree-children')) {
                    children.classList.toggle('expanded');
                    item.querySelector('i').className = 
                        children.classList.contains('expanded') ? 
                        'fas fa-folder-open' : 'fas fa-folder';
                }
            }
            
            // Handle file selection
            if (item.classList.contains('file')) {
                Cache.fileTree.querySelectorAll('.tree-item').forEach(i => 
                    i.classList.remove('active'));
                item.classList.add('active');
                
                const fileName = item.textContent.trim();
                loadFile(fileName);
            }
        });
    });
}

function renderTreeItems(items, level) {
    return items.map(item => {
        const icon = item.type === 'folder' ? 'fas fa-folder' : getFileIcon(item.name);
        const hasChildren = item.children && item.children.length > 0;
        
        let html = `
            <div class="tree-item ${item.type}" style="padding-left: ${level * 16 + 12}px" 
                 data-name="${item.name}">
                <i class="${icon}"></i>
                <span>${item.name}</span>
            </div>
        `;
        
        if (hasChildren) {
            html += `<div class="tree-children" style="display: none;">`;
            html += renderTreeItems(item.children, level + 1);
            html += `</div>`;
        }
        
        return html;
    }).join('');
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        tsx: 'fab fa-react',
        ts: 'fab fa-js-square',
        js: 'fab fa-js-square',
        jsx: 'fab fa-react',
        json: 'fas fa-cog',
        md: 'fas fa-file-alt',
        html: 'fab fa-html5',
        css: 'fab fa-css3-alt',
        py: 'fab fa-python',
        go: 'fas fa-gem',
        rs: 'fas fa-cog'
    };
    return icons[ext] || 'fas fa-file';
}

function loadFile(filename) {
    const filePath = document.getElementById('current-file-path');
    const codeContent = document.getElementById('code-content');
    const lineCount = document.getElementById('line-count');
    const languageTag = document.querySelector('.language-tag');

    filePath.textContent = filename;
    
    // Simulate loading different file content
    const fileContent = generateFileContent(filename);
    codeContent.textContent = fileContent;
    
    // Update line count
    const lines = fileContent.split('\n').length;
    lineCount.textContent = `${lines} lines`;
    
    // Update language tag
    const ext = filename.split('.').pop().toLowerCase();
    languageTag.textContent = ext.toUpperCase();

    // Highlight code (simple simulation)
    highlightCode(codeContent, ext);
}

function generateFileContent(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    
    const templates = {
        tsx: `import React, { useState, useEffect } from 'react';
import { Button } from './components/Button';

interface Props {
  title: string;
  onClose: () => void;
}

export const Modal: React.FC<Props> = ({ title, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return (
    <div className={\`modal \${isVisible ? 'open' : ''}\`}>
      <div className="modal-content">
        <header>
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </header>
        <body>
          <p>Modal content goes here...</p>
        </body>
      </div>
    </div>
  );
};`,
        ts: `export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  permissions: Permission[];
}

export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error(\`Failed to fetch user: \${response.status}\`);
  }
  return response.json();
}

export function hasPermission(
  user: User, 
  permission: Permission
): boolean {
  return user.permissions.includes(permission);
}`,
        json: `{
  "name": "codeforge",
  "version": "1.0.0",
  "description": "Modern code collaboration platform",
  "main": "dist/index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}`,
        md: `# CodeForge

A modern, collaborative source code management platform.

## Features

- Real-time code collaboration
- Advanced diff viewer
- Interactive commit graph
- Contribution heatmap
- Pull request management
- Issue tracking

## Getting Started

\`\`\`bash
git clone https://github.com/codeforge/core.git
cd core
npm install
npm run dev
\`\`\`

## Contributing

Please read our [Contribution Guidelines](CONTRIBUTING.md) before submitting PRs.

## License

MIT © CodeForge Team`,
        default: `// File: ${filename}
// This is a placeholder file content.

export function init() {
  console.log('Initializing...');
  
  // TODO: Implement functionality
  return {
    status: 'ready',
    version: '1.0.0'
  };
}`
    };

    return templates[ext] || templates.default;
}

function highlightCode(element, language) {
    // Simple syntax highlighting simulation
    const code = element.textContent;
    
    // Keywords for different languages
    const keywords = {
        typescript: ['import', 'export', 'interface', 'type', 'async', 'await', 'return', 'const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'new', 'this', 'super', 'extends', 'implements', 'public', 'private', 'protected', 'static', 'readonly', 'enum', 'namespace', 'module', 'declare', 'abstract', 'as', 'any', 'void', 'never', 'unknown', 'null', 'undefined', 'boolean', 'number', 'string', 'symbol', 'bigint', 'true', 'false'],
        javascript: ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'new', 'this', 'super', 'extends', 'return', 'yield', 'async', 'await', 'typeof', 'instanceof', 'in', 'of', 'void', 'delete', 'null', 'undefined', 'true', 'false', 'NaN', 'Infinity'],
        json: ['true', 'false', 'null']
    };

    const langKeywords = keywords[language] || keywords.typescript;
    
    // Escape HTML
    let highlighted = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Highlight strings
    highlighted = highlighted.replace(/(['"`])(.*?)\1/g, '<span style="color: #a5d6ff;">$1$2$1</span>');

    // Highlight comments (single line)
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span style="color: #8b949e;">$1</span>');

    // Highlight comments (multi-line)
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #8b949e;">$1</span>');

    // Highlight keywords
    langKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span style="color: #ff7b72;">$1</span>');
    });

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span style="color: #79c0ff;">$1</span>');

    element.innerHTML = highlighted;
}

// ============================================
// COMMIT GRAPH (Canvas)
// ============================================

function setupCommitGraph() {
    const canvas = Cache.commitGraph;
    if (!canvas) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Store context for later use
    canvas.ctx = ctx;
    canvas.rect = rect;

    // Draw initial graph
    drawCommitGraph();

    // Add event listeners
    canvas.addEventListener('mousemove', handleGraphHover);
    canvas.addEventListener('mouseleave', hideGraphTooltip);
    canvas.addEventListener('click', handleGraphClick);
}

function drawCommitGraph() {
    const canvas = Cache.commitGraph;
    if (!canvas || !canvas.ctx) return;

    const ctx = canvas.ctx;
    const rect = canvas.rect;
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Generate graph data (last 90 days)
    const days = 90;
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Find commits for this day
        const dayCommits = State.commits.filter(c => {
            const cDate = new Date(c.date);
            return cDate.toDateString() === date.toDateString();
        }).length;
        
        data.push({
            date,
            count: dayCommits || Math.floor(Math.random() * 15)
        });
    }

    // Find max for scaling
    const maxCount = Math.max(...data.map(d => d.count), 1);

    // Draw settings
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const graphWidth = rect.width - padding.left - padding.right;
    const graphHeight = rect.height - padding.top - padding.bottom;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (graphHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + graphWidth, y);
        ctx.stroke();
    }

    // Draw area fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + graphHeight);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + graphHeight);

    data.forEach((point, i) => {
        const x = padding.left + (graphWidth / (data.length - 1)) * i;
        const y = padding.top + graphHeight - (point.count / maxCount) * graphHeight;
        ctx.lineTo(x, y);
    });

    ctx.lineTo(padding.left + graphWidth, padding.top + graphHeight);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, i) => {
        const x = padding.left + (graphWidth / (data.length - 1)) * i;
        const y = padding.top + graphHeight - (point.count / maxCount) * graphHeight;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Draw points
    data.forEach((point, i) => {
        const x = padding.left + (graphWidth / (data.length - 1)) * i;
        const y = padding.top + graphHeight - (point.count / maxCount) * graphHeight;
        
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(x, y, point.count > 0 ? 3 : 1, 0, Math.PI * 2);
        ctx.fill();
    });

    // Store data for tooltip
    canvas.graphData = data;
    canvas.graphConfig = { padding, graphWidth, graphHeight, maxCount };
}

function handleGraphHover(e) {
    const canvas = e.target;
    if (!canvas.graphData) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const { padding, graphWidth } = canvas.graphConfig;
    
    if (x < padding.left || x > padding.left + graphWidth) {
        hideGraphTooltip();
        return;
    }

    // Find nearest data point
    const index = Math.round(((x - padding.left) / graphWidth) * (canvas.graphData.length - 1));
    const point = canvas.graphData[index];
    
    if (point) {
        showGraphTooltip(e.clientX, e.clientY, point);
    }
}

function showGraphTooltip(x, y, point) {
    const tooltip = document.getElementById('graph-tooltip');
    if (!tooltip) return;

    tooltip.querySelector('.tooltip-date').textContent = 
        point.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    tooltip.querySelector('.tooltip-count').textContent = 
        `${point.count} commits`;

    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y - 40}px`;
    tooltip.classList.remove('hidden');
}

function hideGraphTooltip() {
    const tooltip = document.getElementById('graph-tooltip');
    if (tooltip) tooltip.classList.add('hidden');
}

function handleGraphClick(e) {
    const canvas = e.target;
    if (!canvas.graphData) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const { padding, graphWidth } = canvas.graphConfig;
    
    if (x >= padding.left && x <= padding.left + graphWidth) {
        const index = Math.round(((x - padding.left) / graphWidth) * (canvas.graphData.length - 1));
        const point = canvas.graphData[index];
        
        if (point) {
            // Filter commits for this date
            const dateCommits = State.commits.filter(c => {
                const cDate = new Date(c.date);
                return cDate.toDateString() === point.date.toDateString();
            });
            
            if (dateCommits.length > 0) {
                showCommitsForDate(dateCommits);
            }
        }
    }
}

function showCommitsForDate(commits) {
    // Could open a modal or navigate to commits view with filter
    switchView('commits');
    // Apply date filter would go here
}

// ============================================
// COMMITS LIST
// ============================================

function renderCommitsList() {
    const container = document.getElementById('commits-list');
    if (!container) return;

    const filteredCommits = State.commits.slice(0, 20);
    
    container.innerHTML = filteredCommits.map(commit => `
        <div class="commit-item-full">
            <div class="commit-graph-mini">
                <canvas class="mini-graph" data-hash="${commit.hash}"></canvas>
            </div>
            <div class="commit-details">
                <div class="commit-header">
                    <span class="commit-subject">${commit.message}</span>
                    ${commit.verified ? '<i class="fas fa-check-circle" style="color: var(--accent-success)"></i>' : ''}
                </div>
                <div class="commit-meta-full">
                    <div class="commit-author-full">
                        <img src="${commit.authorAvatar}" alt="${commit.author}">
                        <span>${commit.author}</span>
                    </div>
                    <span class="commit-hash-full">${commit.shortHash}</span>
                    <span class="commit-time">${commit.timeAgo}</span>
                    <div class="commit-parents">
                        ${Array(commit.parents).fill(0).map(() => 
                            '<i class="fas fa-code-branch"></i>'
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Draw mini graphs for each commit
    setTimeout(() => {
        container.querySelectorAll('.mini-graph').forEach(canvas => {
            drawMiniCommitGraph(canvas);
        });
    }, 100);
}

function drawMiniCommitGraph(canvas) {
    const ctx = canvas.getContext('2d');
    const size = 60;
    canvas.width = size;
    canvas.height = size;

    // Generate random mini graph data
    const points = [];
    for (let i = 0; i < 10; i++) {
        points.push({
            x: (size / 9) * i,
            y: size - Math.random() * (size * 0.8) - 5
        });
    }

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
}

// ============================================
// PULL REQUESTS
// ============================================

function renderPRList() {
    if (!Cache.prList) return;

    const filter = Cache.prList.dataset.filter || 'open';
    const filteredPRs = State.pullRequests.filter(pr => pr.status === filter);

    Cache.prList.innerHTML = filteredPRs.map(pr => `
        <div class="pr-item" data-pr-id="${pr.id}">
            <div class="pr-icon ${pr.status}">
                <i class="fas fa-${pr.status === 'open' ? 'code-branch' : 
                           pr.status === 'merged' ? 'check' : 'times'}"></i>
            </div>
            <div class="pr-content">
                <div class="pr-title">${pr.title}</div>
                <div class="pr-meta">
                    <span class="pr-branch">${pr.headBranch} → ${pr.baseBranch}</span>
                    <span>${pr.commits} commits</span>
                    <span>+${pr.additions} −${pr.deletions}</span>
                    <div class="pr-checks">
                        ${pr.checks.ci ? '<span class="check-status pass"><i class="fas fa-check"></i> CI</span>' : ''}
                        ${pr.checks.tests ? '<span class="check-status pass"><i class="fas fa-check"></i> Tests</span>' : ''}
                        ${!pr.checks.lint ? '<span class="check-status fail"><i class="fas fa-times"></i> Lint</span>' : ''}
                    </div>
                    <div class="pr-reviewers">
                        ${pr.reviewers.slice(0, 3).map(avatar => 
                            `<img src="${avatar}" class="reviewer-avatar" alt="Reviewer">`
                        ).join('')}
                        ${pr.reviewers.length > 3 ? 
                            `<span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 4px;">+${pr.reviewers.length - 3}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function filterPRs(status) {
    Cache.prList.dataset.filter = status;
    renderPRList();
}

// ============================================
// ISSUES
// ============================================

function renderIssueList() {
    if (!Cache.issueList) return;

    const filter = Cache.issueList.dataset.filter || 'open';
    const filteredIssues = State.issues.filter(issue => issue.status === filter);

    Cache.issueList.innerHTML = filteredIssues.map(issue => `
        <div class="issue-item" data-issue-id="${issue.id}">
            <div class="issue-icon ${issue.status}">
                <i class="fas fa-${issue.status === 'open' ? 'exclamation-circle' : 'check-circle'}"></i>
            </div>
            <div class="issue-content">
                <div class="issue-title">${issue.title}</div>
                <div class="issue-meta">
                    ${issue.labels.map(label => 
                        `<span class="issue-label">${label}</span>`
                    ).join('')}
                    <div class="issue-priority priority-${issue.priority}">
                        <i class="fas fa-flag"></i> ${issue.priority}
                    </div>
                    <span>#${issue.number}</span>
                    <span>opened ${issue.date.toLocaleDateString()}</span>
                    <span>${issue.comments} comments</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterIssues(status) {
    Cache.issueList.dataset.filter = status;
    renderIssueList();
}

// ============================================
// MODALS
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(`${modalId}-modal`);
    if (!modal) return;

    modal.classList.add('active');
    Cache.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    Cache.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function handleCreate(type) {
    closeAllModals();
    
    switch (type) {
        case 'repository':
            showToast('success', 'Repository Created', 'New repository "awesome-project" created successfully!');
            break;
        case 'issue':
            showToast('info', 'Issue Created', 'Issue #251 has been created.');
            break;
        case 'gist':
            showToast('success', 'Gist Created', 'Your gist is ready to share.');
            break;
        case 'project':
            showToast('info', 'Project Created', 'New project board has been set up.');
            break;
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    Cache.toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// UTILITY FUNCTIONS
// ============================================

function copyCode() {
    const codeElement = document.getElementById('code-content');
    if (!codeElement) return;

    const code = codeElement.textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast('success', 'Copied!', 'Code copied to clipboard.');
    }).catch(() => {
        showToast('error', 'Failed', 'Could not copy code.');
    });
}

function animateOnLoad() {
    // Animate stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 100);
    });

    // Animate repo cards
    const repoCards = document.querySelectorAll('.repo-card');
    repoCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 400 + i * 100);
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K for search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                searchInput.focus();
                showSearchDropdown();
            }
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
            hideSearchDropdown();
        }

        // Cmd/Ctrl + / for help (could add help modal)
    });
}

// ============================================
// INITIALIZATION ON LOAD
// ============================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle window resize for canvas
window.addEventListener('resize', () => {
    if (State.currentView === 'commits') {
        setTimeout(drawCommitGraph, 200);
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        State,
        init,
        switchView,
        showToast
    };
}