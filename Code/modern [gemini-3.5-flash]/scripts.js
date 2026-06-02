document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // --- Mock Data Store ---
    const files = {
        'compiler.rs': `// FORGE.OS Quantum Compiler Subsystem
// Optimized for parallel state transformation pipelines

use std::sync::Arc;
use tokio::sync::mpsc;

pub struct StateRegister {
    qubit_count: usize,
    phase_offset: f64,
}

impl StateRegister {
    pub fn new(qubits: usize) -> Self {
        Self {
            qubit_count: qubits,
            phase_offset: 0.0,
        }
    }

    pub async fn apply_hadamard(&mut self) -> Result<(), CompilerError> {
        // High-precision state superposition mapping
        self.phase_offset += std::f64::consts::FRAC_PI_2;
        Ok(())
    }
}`,
        'optimizer.rs': `// FORGE.OS Optimization Pass
// Eliminates redundant phase-shifts in parallel graphs

pub fn optimize_pipeline(graph: &mut FlowGraph) -> OptimizationResult {
    let mut redundancy_count = 0;
    for node in graph.nodes_mut() {
        if node.is_noop_transform() {
            node.bypass();
            redundancy_count += 1;
        }
    }
    OptimizationResult::Success { optimized_nodes: redundancy_count }
}`,
        'parser.rs': `// FORGE.OS Syntax Tokenizer
// High-performance parser targeting abstract syntax trees

pub fn tokenize_stream(source: &str) -> Vec<Token> {
    let mut tokens = Vec::new();
    let mut chars = source.chars().peekable();
    
    while let Some(&c) = chars.peek() {
        match c {
            '/' => {
                chars.next();
                if chars.peek() == Some(&'/') {
                    // Consume comment sequence
                }
            }
            _ => { tokens.push(Token::Raw(c)); chars.next(); }
        }
    }
    tokens
}`,
        'Cargo.toml': `[package]
name = "quantum-compiler"
version = "4.2.9"
edition = "2021"
authors = ["operator_x <ops@forge.os>"]

[dependencies]
tokio = { version = "1.28", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
futures = "0.3"`,
        'README.md': `# FORGE.OS // Core Quantum Compiler

Welcome to the central processing architecture for the quantum state compiler.

## Features
- Superposition Pipeline Engine
- Live Memory Optimization Node Topology
- Multi-threaded syntax analysis

## Local Setup
Ensure you have the latest Rust toolchain installed:
\`\`\`bash
forge install rust-toolchain
cargo build --release
\`\`\``
    };

    const commits = [
        { id: 'c-8d1a', author: '@operator_x', desc: 'Initialize quantum register layout', branch: 'main', pos: { x: 50, y: 50 } },
        { id: 'c-9a3b', author: '@silicon_drifter', desc: 'Parallelize tokenization architecture', branch: 'patch/lexer-opt', pos: { x: 120, y: 120 } },
        { id: 'c-10ef', author: '@neuro_coder', desc: 'Add superposition mapping layer', branch: 'feature/quantum-reg', pos: { x: 190, y: 220 } },
        { id: 'c-112c', author: '@operator_x', desc: 'Optimize pipeline redundancy', branch: 'main', pos: { x: 260, y: 50 } },
        { id: 'c-12bc', author: '@silicon_drifter', desc: 'Resolve lock-free parser race conditions', branch: 'patch/lexer-opt', pos: { x: 330, y: 120 } }
    ];

    const fileDiffs = {
        'compiler.rs': `  impl StateRegister {
      pub fn new(qubits: usize) -> Self {
          Self {
              qubit_count: qubits,
              phase_offset: 0.0,
          }
      }
  
<span class="diff-removed">-     pub fn apply_hadamard(&mut self) {</span>
<span class="diff-removed">-         self.phase_offset += 1.57;</span>
<span class="diff-removed">-     }</span>
<span class="diff-added">+     pub async fn apply_hadamard(&mut self) -> Result<(), CompilerError> {</span>
<span class="diff-added">+         // High-precision state superposition mapping</span>
<span class="diff-added">+         self.phase_offset += std::f64::consts::FRAC_PI_2;</span>
<span class="diff-added">+         Ok(())</span>
<span class="diff-added">+     }</span>
  }`
    };

    // --- State Variables ---
    let currentFile = 'compiler.rs';
    let diffMode = false;
    let terminalMinimized = false;
    let terminalExpanded = false;

    // --- UI Selectors ---
    const codeDisplay = document.getElementById('code-display-area');
    const pathDisplay = document.querySelector('.path-display');
    const fileTypeBadge = document.querySelector('.file-type-badge');
    const btnToggleDiff = document.getElementById('btn-toggle-diff');
    const commitDetailsPanel = document.getElementById('commit-details');
    const heatmapGrid = document.getElementById('contribution-heatmap');
    const terminalTray = document.getElementById('terminal-tray');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalMinimize = document.getElementById('terminal-minimize');
    const terminalExpand = document.getElementById('terminal-expand');
    const terminalTriggerBtn = document.getElementById('terminal-trigger-btn');

    // --- Core File System Operations ---
    function loadFile(fileName) {
        currentFile = fileName;
        pathDisplay.textContent = `quantum-compiler / src / ${fileName.endsWith('.rs') ? 'core/' : ''}${fileName}`;
        
        let fileExt = fileName.split('.').pop().toUpperCase();
        fileTypeBadge.textContent = fileExt === 'toml' ? 'CONFIG' : fileExt;

        if (diffMode && fileDiffs[fileName]) {
            codeDisplay.innerHTML = fileDiffs[fileName];
        } else {
            // Escape HTML characters before injecting code display
            const safeCode = files[fileName]
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            codeDisplay.innerHTML = safeCode;
        }
    }

    // Setup File Tree click handlers
    document.querySelectorAll('.tree-item.file').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.tree-item.file').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            loadFile(item.getAttribute('data-file'));
        });
    });

    // Expand / Collapse Folder Nodes
    document.querySelectorAll('.tree-item.folder').forEach(folder => {
        folder.addEventListener('click', () => {
            folder.classList.toggle('expanded');
            const arrow = folder.querySelector('.tree-arrow');
            const children = folder.nextElementSibling;
            
            if (children && children.classList.contains('tree-children')) {
                if (children.style.display === 'none') {
                    children.style.display = 'flex';
                    arrow.setAttribute('data-lucide', 'chevron-down');
                } else {
                    children.style.display = 'none';
                    arrow.setAttribute('data-lucide', 'chevron-right');
                }
                lucide.createIcons();
            }
        });
    });

    // Diff Viewer toggle behavior
    btnToggleDiff.addEventListener('click', () => {
        diffMode = !diffMode;
        btnToggleDiff.classList.toggle('active');
        btnToggleDiff.innerHTML = diffMode 
            ? `<i data-lucide="code"></i> Show Source` 
            : `<i data-lucide="git-compare"></i> Show Diff`;
        lucide.createIcons();
        loadFile(currentFile);
    });

    // Initialize Default File Load
    loadFile('compiler.rs');

    // --- Interactive Commit Graph Engine ---
    function buildCommitGraph() {
        const svg = document.getElementById('commit-graph-svg');
        svg.innerHTML = ''; // Reset SVG frame

        // 1. Draw Connection Lines / Branches
        const lineStyles = [
            { path: `M 50,50 L 260,50`, color: 'var(--text-muted)' }, // Main line
            { path: `M 50,50 Q 85,120 120,120 L 330,120`, color: 'var(--accent-amber)' }, // Branch Line 1
            { path: `M 120,120 Q 155,220 190,220`, color: 'var(--accent-cyan)' } // Branch Line 2
        ];

        lineStyles.forEach(style => {
            const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathElement.setAttribute('d', style.path);
            pathElement.setAttribute('stroke', style.color);
            pathElement.setAttribute('stroke-width', '2');
            pathElement.setAttribute('fill', 'none');
            pathElement.setAttribute('stroke-dasharray', '4, 4');
            svg.appendChild(pathElement);
        });

        // 2. Build Interactive Node Nodes
        commits.forEach(commit => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('graph-node-group');
            group.style.cursor = 'pointer';

            // Node Core Outer Glow Ring
            const glowRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            glowRing.setAttribute('cx', commit.pos.x);
            glowRing.setAttribute('cy', commit.pos.y);
            glowRing.setAttribute('r', '8');
            glowRing.setAttribute('fill', 'transparent');
            glowRing.setAttribute('stroke', commit.branch === 'main' ? 'var(--accent-green)' : 'var(--accent-cyan)');
            glowRing.setAttribute('stroke-width', '1.5');
            glowRing.style.transition = 'all 0.2s';

            // Core Solid Node
            const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            core.setAttribute('cx', commit.pos.x);
            core.setAttribute('cy', commit.pos.y);
            core.setAttribute('r', '4');
            core.setAttribute('fill', commit.branch === 'main' ? 'var(--accent-green)' : 'var(--accent-cyan)');

            group.appendChild(glowRing);
            group.appendChild(core);

            // Interaction & Inspection Listeners
            group.addEventListener('mouseenter', () => {
                glowRing.setAttribute('r', '12');
                glowRing.setAttribute('stroke-width', '3');
                
                commitDetailsPanel.innerHTML = `
                    <div style="font-family: var(--font-mono); font-size: 0.8rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="color: var(--accent-cyan); font-weight: bold;">${commit.id}</span>
                            <span style="color: var(--text-secondary);">${commit.author}</span>
                        </div>
                        <p style="color: var(--text-primary); margin-bottom: 6px; font-weight: 500;">${commit.desc}</p>
                        <span style="font-size: 0.7rem; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: var(--text-secondary);">
                            branch: ${commit.branch}
                        </span>
                    </div>
                `;
            });

            group.addEventListener('mouseleave', () => {
                glowRing.setAttribute('r', '8');
                glowRing.setAttribute('stroke-width', '1.5');
            });

            svg.appendChild(group);
        });
    }

    buildCommitGraph();

    // --- Contribution Heatmap Generator ---
    function buildHeatmap() {
        heatmapGrid.innerHTML = '';
        const cellCount = 168; // 24 columns * 7 rows
        
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div');
            cell.classList.add('heatmap-cell');
            
            // Generate non-uniform distribution favoring lower contribution metrics
            const levelRand = Math.random();
            let level = 'lv-0';
            if (levelRand > 0.88) level = 'lv-4';
            else if (levelRand > 0.72) level = 'lv-3';
            else if (levelRand > 0.5) level = 'lv-2';
            else if (levelRand > 0.25) level = 'lv-1';

            cell.classList.add(level);
            
            // Hover Tooltips
            cell.addEventListener('mouseenter', (e) => {
                const actions = level === 'lv-0' ? 'No system mutations' : `${Math.floor(levelRand * 15) + 1} actions committed`;
                cell.style.transform = 'scale(1.25)';
                cell.style.boxShadow = '0 0 10px var(--accent-cyan)';
            });

            cell.style.transition = 'all 0.1s ease-out';
            cell.addEventListener('mouseleave', () => {
                cell.style.transform = 'scale(1)';
                cell.style.boxShadow = 'none';
            });

            heatmapGrid.appendChild(cell);
        }
    }

    buildHeatmap();

    // --- Interactive Control Shell / Command-Line Interface ---
    function executeTerminalCommand(cmdString) {
        const cmd = cmdString.trim().toLowerCase();
        const outputLine = document.createElement('div');
        outputLine.classList.add('term-line');

        if (cmd === '') return;

        // Echo current input context
        const echoLine = document.createElement('div');
        echoLine.classList.add('term-line');
        echoLine.innerHTML = `<span class="terminal-prompt">operator_x@forge:~$</span> ${cmdString}`;
        terminalOutput.appendChild(echoLine);

        switch (cmd) {
            case 'help':
                outputLine.innerHTML = `
                    <div style="margin: 4px 0;">Available operations:</div>
                    <div style="padding-left: 12px;">
                      <div><span class="term-highlight">help</span>          - Show this interface system diagnostics helper</div>
                      <div><span class="term-highlight">status</span>        - Display active node repository status</div>
                      <div><span class="term-highlight">sync</span>          - Synchronize with master telemetry hubs</div>
                      <div><span class="term-highlight">clear</span>         - Purge local terminal output buffers</div>
                      <div><span class="term-highlight">mutate [id]</span>    - Inspect repository branches or commit logs</div>
                    </div>
                `;
                break;
            case 'status':
                outputLine.innerHTML = `
                    <div>System Status: <span class="term-highlight">ACTIVE [v4.2.9]</span></div>
                    <div>Active Pipeline: <span style="color: var(--accent-green)">PASSING (98.4% coverage)</span></div>
                    <div>Dirty Buffers: <span style="color: var(--accent-amber)">1 conflict in #MR-102</span></div>
                `;
                break;
            case 'sync':
                outputLine.innerHTML = `<div>Syncing pipeline state with main master node...</div>`;
                setTimeout(() => {
                    const syncSuccess = document.createElement('div');
                    syncSuccess.classList.add('term-line');
                    syncSuccess.innerHTML = `<span style="color: var(--accent-green)">[SUCCESS]</span> All local subnets fully synced.`;
                    terminalOutput.appendChild(syncSuccess);
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }, 1000);
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                return;
            default:
                if (cmd.startsWith('mutate')) {
                    const parts = cmd.split(' ');
                    if (parts.length > 1) {
                        outputLine.innerHTML = `Scanning repository structures for commit: <span class="term-highlight">${parts[1]}</span>... Match found. Initializing checkout pipeline.`;
                    } else {
                        outputLine.innerHTML = `Usage: mutate [commit_id]`;
                    }
                } else {
                    outputLine.innerHTML = `<span style="color: var(--accent-red)">ERR:</span> Operation Command "${cmdString}" not found. Type <span class="term-highlight">help</span> for assistance.`;
                }
        }

        terminalOutput.appendChild(outputLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Terminal Keyboard Listeners
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value;
            executeTerminalCommand(command);
            terminalInput.value = '';
        }
    });

    // Toggle and Collapse Controls
    terminalMinimize.addEventListener('click', (e) => {
        e.stopPropagation();
        terminalMinimized = !terminalMinimized;
        terminalTray.classList.toggle('minimized', terminalMinimized);
        if (terminalMinimized) {
            terminalTray.classList.remove('expanded');
            terminalExpanded = false;
        }
    });

    terminalExpand.addEventListener('click', (e) => {
        e.stopPropagation();
        terminalExpanded = !terminalExpanded;
        terminalTray.classList.toggle('expanded', terminalExpanded);
        if (terminalExpanded) {
            terminalTray.classList.remove('minimized');
            terminalMinimized = false;
        }
    });

    terminalTriggerBtn.addEventListener('click', () => {
        terminalMinimized = false;
        terminalTray.classList.remove('minimized');
        terminalInput.focus();
    });

    // --- Workspace Routing Interface ---
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const targetSection = item.getAttribute('data-target');
            const targetCards = document.querySelectorAll('.grid-card');
            
            targetCards.forEach(card => {
                // Smoothly dim cards that are not related to active selection route
                if (targetSection === 'dashboard') {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'all';
                } else if (targetSection === 'repository' && !card.classList.contains('file-explorer-card')) {
                    card.style.opacity = '0.15';
                    card.style.pointerEvents = 'none';
                } else if (targetSection === 'commits' && !card.classList.contains('commit-graph-card')) {
                    card.style.opacity = '0.15';
                    card.style.pointerEvents = 'none';
                } else if (targetSection === 'merges' && !card.classList.contains('merge-requests-card')) {
                    card.style.opacity = '0.15';
                    card.style.pointerEvents = 'none';
                } else if (targetSection === 'pipelines' && !card.classList.contains('heatmap-card')) {
                    card.style.opacity = '0.15';
                    card.style.pointerEvents = 'none';
                } else {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'all';
                }
            });
        });
    });

    // Interactive Merge Requests Selector
    document.querySelectorAll('.merge-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.merge-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            
            const mrId = item.getAttribute('data-id');
            const termPromptLine = document.createElement('div');
            termPromptLine.classList.add('term-line');
            termPromptLine.innerHTML = `Loaded review pipeline target <span class="term-highlight">${mrId}</span> in active memory cache buffer.`;
            terminalOutput.appendChild(termPromptLine);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        });
    });
});