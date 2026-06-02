/**
 * AETHER CODE // System Engine
 * Orchestrates the interactive elements and live simulations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSystem();
});

function initSystem() {
    // Initialize Core Modules
    generateHeatmap();
    injectCodeDiff();
    setupFileTree();
    setupSearchShortcut();
    simulateLiveMetrics();
    animateDashboardEntrance();
}

/**
 * 1. HEATMAP GENERATOR
 * Creates a randomized contribution grid to simulate project activity.
 */
function generateHeatmap() {
    const heatmap = document.getElementById('heatmap');
    if (!heatmap) return;

    // Create 400 cells (20x20 grid)
    for (let i = 0; i < 400; i++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        
        // Randomize intensity levels 0-4
        // Higher probability for lower levels to look natural
        const rand = Math.random();
        let level = 0;
        if (rand > 0.95) level = 4;
        else if (rand > 0.85) level = 3;
        else if (rand > 0.70) level = 2;
        else if (rand > 0.50) level = 1;

        if (level > 0) {
            cell.classList.add(`lvl-${level}`);
        }
        
        heatmap.appendChild(cell);
    }
}

/**
 * 2. CODE DIFF INJECTOR
 * Populates the code viewer with a realistic TypeScript diff.
 */
function injectCodeDiff() {
    const diffViewer = document.getElementById('diff-viewer');
    if (!diffViewer) return;

    const diffData = [
        { line: 1, type: 'normal', content: 'import { Engine, Core } from "@aether/nexus";' },
        { line: 2, type: 'normal', content: 'import { Logger } from "./utils/logger";' },
        { line: 3, type: 'normal', content: '' },
        { line: 4, type: 'normal', content: '/**' },
        { line: 5, type: 'normal', content: ' * Core Engine Controller' },
        { line: 6, type: 'normal', content: ' */' },
        { line: 7, type: 'normal', content: 'export class EngineController {' },
        { line: 8, type: 'normal', content: '    private logger: Logger;' },
        { line: 9, type: 'removed', content: '    private config: any;' },
        { line: 10, type: 'added', content: '    private config: EngineConfig;' },
        { line: 11, type: 'normal', content: '' },
        { line: 12, type: 'normal', content: '    constructor(config: EngineConfig) {' },
        { line: 13, type: 'added', content: '        this.logger = new Logger({ level: "debug" });' },
        { line: 14, type: 'normal', content: '        this.config = config;' },
        { line: 15, type: 'normal', content: '    }' },
        { line: 16, type: 'normal', content: '' },
        { line: 17, type: 'normal', content: '    public async boot(): Promise<void> {' },
        { line: 18, type: 'normal', content: '        await this.initializeSystems();' },
        { line: 19, type: 'normal', content: '    }' },
        { line: 20, type: 'normal', content: '}' },
    ];

    diffData.forEach(item => {
        const lineDiv = document.createElement('div');
        lineDiv.className = `diff-line ${item.type === 'added' ? 'line-added' : item.type === 'removed' ? 'line-removed' : ''}`;
        
        const numSpan = document.createElement('span');
        numSpan.className = 'line-number';
        numSpan.textContent = item.line;

        const contentSpan = document.createElement('span');
        contentSpan.className = 'line-content';
        contentSpan.textContent = item.content;

        lineDiv.appendChild(numSpan);
        lineDiv.appendChild(contentSpan);
        diffViewer.appendChild(lineDiv);
    });
}

/**
 * 3. FILE TREE INTERACTION
 * Handles folder expansion/collapse.
 */
function setupFileTree() {
    const fileTree = document.getElementById('file-tree');
    if (!fileTree) return;

    fileTree.addEventListener('click', (e) => {
        const folder = e.target.closest('.folder');
        if (folder) {
            // Toggle the 'open' class
            folder.classList.toggle('open');
            
            // Handle sub-tree visibility (since we don't have it in CSS)
            const subTree = folder.querySelector('.sub-tree');
            if (subTree) {
                subTree.style.display = folder.classList.contains('open') ? 'block' : 'none';
            }
        }
    });
}

/**
 * 4. COMMAND PALETTE SHORTCUT
 * Listen for Cmd/Ctrl + K to focus search.
 */
function setupSearchShortcut() {
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('global-search').focus();
        }
    });
}

/**
 * 5. LIVE METRICS SIMULATION
 * Fluctuates latency and simulates a living system.
 */
function simulateLiveMetrics() {
    const latencyEl = document.getElementById('latency');
    
    setInterval(() => {
        // Generate a jittery latency between 15ms and 45ms
        const jitter = Math.floor(Math.random() * 30) + 15;
        latencyEl.textContent = `Latency: ${jitter}ms`;
    }, 3000);
}

/**
 * 6. CINEMATIC ENTRANCE
 * Staggered reveal for all major dashboard components.
 */
function animateDashboardEntrance() {
    const cards = document.querySelectorAll('.card');
    const workspace = document.querySelector('.workspace');
    
    // Initial state: fade out workspace
    workspace.style.opacity = '0';
    workspace.style.transform = 'translateY(10px)';
    workspace.style.transition = 'opacity 1s ease, transform 1s ease';

    setTimeout(() => {
        workspace.style.opacity = '1';
        workspace.style.transform = 'translateY(0)';

        // Staggered card appearance
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
    }, 300);
}