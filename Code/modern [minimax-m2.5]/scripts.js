/**
 * GitForge - Interactive Source Code Management Platform
 * JavaScript functionality for all dynamic features
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initCodeViewer();
    initFileTree();
    initCommitGraph();
    initContributionHeatmap();
    initDiffFilters();
    initToastNotifications();
    initSearch();
    initTabs();
    
    console.log('🚀 GitForge initialized successfully');
});

// ============================================
// Code Viewer with Syntax Highlighting
// ============================================
function initCodeViewer() {
    const codeContent = document.getElementById('codeContent');
    
    // Sample TypeScript code for Navigation component
    const codeLines = [
        { num: 1, content: "import React, { useState, useEffect } from 'react';", type: 'import' },
        { num: 2, content: "import { Link, useLocation } from 'react-router-dom';", type: 'import' },
        { num: 3, content: "import styles from './Navigation.module.css';", type: 'import' },
        { num: 4, content: "", type: 'empty' },
        { num: 5, content: "interface NavItem {", type: 'keyword' },
        { num: 6, content: "  label: string;", type: 'property' },
        { num: 7, content: "  path: string;", type: 'property' },
        { num: 8, content: "  icon?: React.ReactNode;", type: 'property' },
        { num: 9, content: "}", type: 'keyword' },
        { num: 10, content: "", type: 'empty' },
        { num: 11, content: "interface NavigationProps {", type: 'keyword' },
        { num: 12, content: "  items: NavItem[];", type: 'property' },
        { num: 13, content: "  onNavigate?: (path: string) => void;", type: 'property' },
        { num: 14, content: "}", type: 'keyword' },
        { num: 15, content: "", type: 'empty' },
        { num: 16, content: "export const Navigation: React.FC<NavigationProps> = ({", type: 'function' },
        { num: 17, content: "  items,", type: 'variable' },
        { num: 18, content: "  onNavigate", type: 'variable' },
        { num: 19, content: "}) => {", type: 'keyword' },
        { num: 20, content: "  const [isOpen, setIsOpen] = useState(false);", type: 'variable' },
        { num: 21, content: "  const [scrolled, setScrolled] = useState(false);", type: 'variable' },
        { num: 22, content: "  const location = useLocation();", type: 'variable' },
        { num: 23, content: "", type: 'empty' },
        { num: 24, content: "  // Handle scroll effect", type: 'comment' },
        { num: 25, content: "  useEffect(() => {", type: 'function' },
        { num: 26, content: "    const handleScroll = () => {", type: 'function' },
        { num: 27, content: "      setScrolled(window.scrollY > 20);", type: 'variable' },
        { num: 28, content: "    };", type: 'keyword' },
        { num: 29, content: "", type: 'empty' },
        { num: 30, content: "    window.addEventListener('scroll', handleScroll);", type: 'function' },
        { num: 31, content: "    return () => window.removeEventListener('scroll', handleScroll);", type: 'function' },
        { num: 32, content: "  }, []);", type: 'keyword' },
        { num: 33, content: "", type: 'empty' },
        { num: 34, content: "  // Handle keyboard navigation", type: 'comment' },
        { num: 35, content: "  useEffect(() => {", type: 'function' },
        { num: 36, content: "    const handleKeyDown = (e: KeyboardEvent) => {", type: 'function' },
        { num: 37, content: "      if (e.key === 'Escape') setIsOpen(false);", type: 'variable' },
        { num: 38, content: "    };", type: 'keyword' },
        { num: 39, content: "", type: 'empty' },
        { num: 40, content: "    document.addEventListener('keydown', handleKeyDown);", type: 'function' },
        { num: 41, content: "    return () => document.removeEventListener('keydown', handleKeyDown);", type: 'function' },
        { num: 42, content: "  }, []);", type: 'keyword' },
        { num: 43, content: "", type: 'empty' },
        { num: 44, content: "  return (", type: 'keyword' },
        { num: 45, content: "    <nav", type: 'keyword' },
        { num: 46, content: "      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}", type: 'string' },
        { num: 47, content: "      role=\"navigation\"", type: 'property' },
        { num: 48, content: "      aria-label=\"Main navigation\"", type: 'property' },
        { num: 49, content: "    >", type: 'keyword' },
        { num: 50, content: "      <div className={styles.container}>", type: 'keyword' },
        { num: 51, content: "        <Link to=\"/\" className={styles.logo}>", type: 'function' },
        { num: 52, content: "          <svg className={styles.logoIcon} viewBox=\"0 0 32 32\">", type: 'keyword' },
        { num: 53, content: "            <path d=\"M16 2L4 8v16l12 6 12-6V8L16 2z\" />", type: 'string' },
        { num: 54, content: "          </svg>", type: 'keyword' },
        { num: 55, content: "          <span>GitForge</span>", type: 'string' },
        { num: 56, content: "        </Link>", type: 'keyword' },
        { num: 57, content: "", type: 'empty' },
        { num: 58, content: "        {/* Desktop Menu */}", type: 'comment' },
        { num: 59, content: "        <ul className={styles.menu}>", type: 'keyword' },
        { num: 60, content: "          {items.map((item) => (", type: 'function' },
        { num: 61, content: "            <li key={item.path}>", type: 'keyword' },
        { num: 62, content: "              <Link", type: 'function' },
        { num: 63, content: "                to={item.path}", type: 'property' },
        { num: 64, content: "                className={`${styles.link} $", type: 'string' },
        { num: 65, content: "                  location.pathname === item.path ? styles.active : ''`}", type: 'string' },
        { num: 66, content: "                aria-current={location.pathname === item.path ? 'page' : undefined}", type: 'property' },
        { num: 67, content: "              >", type: 'keyword' },
        { num: 68, content: "                {item.icon && <span className={styles.icon}>{item.icon}</span>}", type: 'function' },
        { num: 69, content: "                {item.label}", type: 'variable' },
        { num: 70, content: "              </Link>", type: 'keyword' },
        { num: 71, content: "            </li>", type: 'keyword' },
        { num: 72, content: "          ))}", type: 'keyword' },
        { num: 73, content: "        </ul>", type: 'keyword' },
        { num: 74, content: "", type: 'empty' },
        { num: 75, content: "        {/* Mobile Menu Button */}", type: 'comment' },
        { num: 76, content: "        <button", type: 'keyword' },
        { num: 77, content: "          className={styles.mobileToggle}", type: 'string' },
        { num: 78, content: "          onClick={() => setIsOpen(!isOpen)}", type: 'property' },
        { num: 79, content: "          aria-expanded={isOpen}", type: 'property' },
        { num: 80, content: "          aria-controls=\"mobile-menu\"", type: 'property' },
        { num: 81, content: "        >", type: 'keyword' },
        { num: 82, content: "          <span className={`${styles.hamburger} ${isOpen ? styles.open : ''}`} />", type: 'function' },
        { num: 83, content: "        </button>", type: 'keyword' },
        { num: 84, content: "      </div>", type: 'keyword' },
        { num: 85, content: "    </nav>", type: 'keyword' },
        { num: 86, content: "  );", type: 'keyword' },
        { num: 87, content: "};", type: 'keyword' },
    ];

    // Render code lines with syntax highlighting
    codeContent.innerHTML = codeLines.map(line => {
        const highlighted = highlightSyntax(line.content, line.type);
        return `
            <tr>
                <td class="line-number">${line.num}</td>
                <td class="line-content">${highlighted}</td>
            </tr>
        `;
    }).join('');

    // Add staggered animation to code lines
    const rows = codeContent.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-10px)';
        row.style.transition = 'all 0.3s ease';
        row.style.transitionDelay = `${index * 20}ms`;
        
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 50);
    });
}

function highlightSyntax(code, type) {
    if (!code) return '<span class="syntax-empty">&nbsp;</span>';
    
    // Escape HTML
    let escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Apply syntax highlighting
    const patterns = [
        // Keywords
        { regex: /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|extends|implements|new|this|true|false|null|undefined)\b/g, class: 'syntax-keyword' },
        // Strings
        { regex: /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g, class: 'syntax-string' },
        // Numbers
        { regex: /\b(\d+\.?\d*)\b/g, class: 'syntax-number' },
        // Comments
        { regex: /(\/\/.*$)/gm, class: 'syntax-comment' },
        // Types
        { regex: /\b(React|FC|HTML|KeyboardEvent|NavItem|NavigationProps|string|number|boolean|void)\b/g, class: 'syntax-type' },
        // Properties
        { regex: /(\w+)(?=:)/g, class: 'syntax-property' },
        // Operators
        { regex: /(=>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=])/g, class: 'syntax-operator' },
    ];

    patterns.forEach(({ regex, class: className }) => {
        escaped = escaped.replace(regex, `<span class="${className}">$1</span>`);
    });

    return escaped;
}

// ============================================
// File Tree Interactions
// ============================================
function initFileTree() {
    const treeItems = document.querySelectorAll('.tree-item.folder');
    
    treeItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = item.classList.contains('expanded');
            
            // Toggle expanded state
            item.classList.toggle('expanded');
            
            // Animate toggle arrow
            const toggle = item.querySelector('.tree-toggle');
            if (toggle) {
                toggle.style.transform = isExpanded 
                    ? 'rotate(-90deg)' 
                    : 'rotate(0deg)';
            }
            
            // Find and toggle children
            const children = item.nextElementSibling;
            if (children && children.classList.contains('tree-children')) {
                if (isExpanded) {
                    children.style.maxHeight = '0';
                    children.style.opacity = '0';
                } else {
                    children.style.maxHeight = children.scrollHeight + 'px';
                    children.style.opacity = '1';
                }
            }
        });
    });

    // File click handler
    const fileItems = document.querySelectorAll('.tree-item.file');
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all files
            fileItems.forEach(f => f.classList.remove('active'));
            // Add active to clicked file
            item.classList.add('active');
            
            // Show toast
            const fileName = item.querySelector('.file-name').textContent;
            showToast(`Opening ${fileName}...`, 'info');
        });
    });
}

// ============================================
// Commit Graph Visualization
// ============================================
function initCommitGraph() {
    const commitGraph = document.getElementById('commitGraph');
    
    // Generate commit graph data
    const graphData = generateCommitGraph();
    
    // Render columns
    let html = '';
    graphData.columns.forEach((column, colIndex) => {
        html += '<div class="graph-column">';
        
        column.nodes.forEach((node, nodeIndex) => {
            const isActive = node.active ? 'active' : '';
            html += `<div class="graph-node ${node.type} ${isActive}"></div>`;
            
            if (nodeIndex < column.nodes.length - 1) {
                html += `<div class="graph-line ${isActive}"></div>`;
            }
        });
        
        html += '</div>';
    });
    
    commitGraph.innerHTML = html;
    
    // Animate nodes with staggered delay
    const nodes = commitGraph.querySelectorAll('.graph-node');
    nodes.forEach((node, index) => {
        node.style.opacity = '0';
        node.style.transform = 'scale(0)';
        
        setTimeout(() => {
            node.style.transition = 'all 0.3s ease';
            node.style.opacity = '1';
            node.style.transform = 'scale(1)';
        }, 100 + (index * 50));
    });
}

function generateCommitGraph() {
    // Simulate commit history graph
    return {
        columns: [
            { nodes: [{ type: 'main', active: true }, { type: 'main', active: true }, { type: 'main', active: true }] },
            { nodes: [{ type: '', active: false }, { type: '', active: false }, { type: 'main', active: true }] },
            { nodes: [{ type: '', active: false }, { type: '', active: false }, { type: 'main', active: true }] },
            { nodes: [{ type: '', active: false }, { type: 'feature', active: true }, { type: '', active: false }] },
            { nodes: [{ type: '', active: false }, { type: 'feature', active: true }, { type: '', active: false }] },
            { nodes: [{ type: 'main', active: false }, { type: '', active: false }, { type: '', active: false }] },
            { nodes: [{ type: 'main', active: false }, { type: '', active: false }, { type: '', active: false }] },
            { nodes: [{ type: 'main', active: false }, { type: 'feature', active: false }, { type: '', active: false }] },
            { nodes: [{ type: '', active: false }, { type: '', active: false }, { type: '', active: false }] },
            { nodes: [{ type: 'main', active: false }, { type: '', active: false }, { type: '', active: false }] },
        ]
    };
}

// ============================================
// Contribution Heatmap
// ============================================
function initContributionHeatmap() {
    const calendar = document.getElementById('contributionCalendar');
    
    // Generate 53 weeks x 7 days of data
    let html = '';
    for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
            const level = Math.floor(Math.random() * 5); // Random contribution level
            const date = new Date();
            date.setDate(date.getDate() - (52 - week) * 7 - (6 - day));
            const dateStr = date.toISOString().split('T')[0];
            
            html += `<div class="heat-cell level-${level}" data-date="${dateStr}" title="${dateStr}: ${level * 3} contributions"></div>`;
        }
    }
    
    calendar.innerHTML = html;
    
    // Animate cells with wave effect
    const cells = calendar.querySelectorAll('.heat-cell');
    cells.forEach((cell, index) => {
        cell.style.opacity = '0';
        
        setTimeout(() => {
            cell.style.transition = 'all 0.2s ease';
            cell.style.opacity = '1';
        }, (index * 2) % 100);
    });
    
    // Add hover interaction
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const title = cell.getAttribute('title');
            showToast(title, 'info');
        });
    });
}

// ============================================
// Diff Filters
// ============================================
function initDiffFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const filter = btn.textContent.toLowerCase();
            const rows = document.querySelectorAll('.code-table tbody tr');
            
            rows.forEach(row => {
                const lineNum = row.querySelector('.line-number');
                if (lineNum) {
                    const isAdded = row.classList.contains('added');
                    const isRemoved = row.classList.contains('removed');
                    
                    let shouldShow = true;
                    
                    if (filter === 'added') shouldShow = isAdded;
                    else if (filter === 'removed') shouldShow = isRemoved;
                    else if (filter === 'modified') shouldShow = isAdded || isRemoved;
                    
                    row.style.display = shouldShow ? 'table-row' : 'none';
                }
            });
        });
    });
}

// ============================================
// Toast Notifications
// ============================================
function initToastNotifications() {
    // Show welcome toast after a delay
    setTimeout(() => {
        showToast('Welcome to GitForge! Repository loaded successfully.', 'success');
    }, 1000);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const icons = {
        success: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
        error: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
        info: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
    
    // Manual close
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    });
}

// ============================================
// Search Functionality
// ============================================
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('focus', () => {
        searchInput.parentElement.classList.add('focused');
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.parentElement.classList.remove('focused');
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                showToast(`Searching for "${query}"...`, 'info');
            }
        }
    });
    
    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// ============================================
// Tab Navigation
// ============================================
function initTabs() {
    const tabs = document.querySelectorAll('.repo-tabs .tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active to clicked tab
            tab.classList.add('active');
            
            // Show toast for demo
            const tabName = tab.textContent.trim().split('\n')[0];
            showToast(`Navigating to ${tabName}...`, 'info');
        });
    });
}

// ============================================
// Branch Selector Interaction
// ============================================
const branchBtn = document.querySelector('.branch-btn');
if (branchBtn) {
    branchBtn.addEventListener('click', () => {
        showToast('Opening branch selector...', 'info');
    });
}

// ============================================
// Star & Fork Button Interactions
// ============================================
const starBtn = document.querySelector('.star-btn');
if (starBtn) {
    starBtn.addEventListener('click', () => {
        starBtn.classList.toggle('starred');
        const isStarred = starBtn.classList.contains('starred');
        
        if (isStarred) {
            starBtn.innerHTML = `
                <svg viewBox="0 0 16 16" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" clip-rule="evenodd"/>
                </svg>
                Starred <span class="star-count">2,848</span>
            `;
            showToast('Repository starred!', 'success');
        } else {
            starBtn.innerHTML = `
                <svg viewBox="0 0 16 16" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" clip-rule="evenodd"/>
                </svg>
                Star <span class="star-count">2,847</span>
            `;
            showToast('Star removed', 'info');
        }
    });
}

// ============================================
// Pull Request Status Interaction
// ============================================
const prItems = document.querySelectorAll('.pr-item');
prItems.forEach(pr => {
    pr.addEventListener('click', () => {
        const prTitle = pr.querySelector('.pr-title').textContent;
        showToast(`Opening PR: ${prTitle}`, 'info');
    });
});

// ============================================
// Branch Item Interaction
// ============================================
const branchItems = document.querySelectorAll('.branch-item');
branchItems.forEach(item => {
    item.addEventListener('click', () => {
        branchItems.forEach(b => b.classList.remove('active'));
        item.classList.add('active');
        
        const branchName = item.querySelector('span').textContent;
        showToast(`Switched to branch: ${branchName}`, 'success');
    });
});

// ============================================
// Code Action Buttons
// ============================================
const codeActionBtns = document.querySelectorAll('.code-action-btn');
codeActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const title = btn.getAttribute('title');
        
        if (title === 'Copy raw content') {
            // Copy code to clipboard
            const codeLines = document.querySelectorAll('.line-content');
            const code = Array.from(codeLines).map(line => line.textContent).join('\n');
            
            navigator.clipboard.writeText(code).then(() => {
                showToast('Code copied to clipboard!', 'success');
            });
        } else if (title === 'View raw') {
            showToast('Opening raw view...', 'info');
        } else if (title === 'Edit file') {
            showToast('Opening editor...', 'info');
        }
    });
});

// ============================================
// Repository Selector
// ============================================
const repoSelector = document.querySelector('.repo-selector');
if (repoSelector) {
    repoSelector.addEventListener('click', () => {
        showToast('Opening repository selector...', 'info');
    });
}

// ============================================
// View All Branches Button
// ============================================
const viewAllBranches = document.querySelector('.view-all-branches');
if (viewAllBranches) {
    viewAllBranches.addEventListener('click', () => {
        showToast('Showing all 12 branches...', 'info');
    });
}

// ============================================
// Smooth Scroll for Code View
// ============================================
const codeDisplay = document.querySelector('.code-display');
if (codeDisplay) {
    codeDisplay.addEventListener('scroll', () => {
        // Add subtle shadow effect when scrolled
        const isScrolled = codeDisplay.scrollTop > 0;
        codeDisplay.classList.toggle('scrolled', isScrolled);
    });
}

// ============================================
// Initialize Tooltips
// ============================================
document.querySelectorAll('[title]').forEach(el => {
    el.addEventListener('mouseenter', function(e) {
        const title = this.getAttribute('title');
        this.setAttribute('data-tooltip', title);
        this.removeAttribute('title');
    });
    
    el.addEventListener('mouseleave', function() {
        const tooltip = this.getAttribute('data-tooltip');
        if (tooltip) {
            this.setAttribute('title', tooltip);
        }
    });
});

console.log('✅ All JavaScript modules initialized');