// ============ AMBIENT BACKGROUND CANVAS ============
const ambientCanvas = document.getElementById('ambient-canvas');
const ambientCtx = ambientCanvas.getContext('2d');

function resizeAmbient() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
}
resizeAmbient();
window.addEventListener('resize', resizeAmbient);

const particles = [];
const particleCount = 25;

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * ambientCanvas.width,
        y: Math.random() * ambientCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 120 + 60,
        hue: 30 + Math.random() * 20
    });
}

function drawAmbient() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < -p.radius) p.x = ambientCanvas.width + p.radius;
        if (p.x > ambientCanvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = ambientCanvas.height + p.radius;
        if (p.y > ambientCanvas.height + p.radius) p.y = -p.radius;
        
        const gradient = ambientCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 50%, 0.03)`);
        gradient.addColorStop(1, 'transparent');
        
        ambientCtx.fillStyle = gradient;
        ambientCtx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
    });
    
    requestAnimationFrame(drawAmbient);
}
drawAmbient();

// ============ NAVIGATION ============
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewName = item.dataset.view;
        
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        views.forEach(v => v.classList.remove('active'));
        
        if (viewName === 'dashboard') {
            document.getElementById('view-dashboard').classList.add('active');
        } else if (viewName === 'repositories') {
            document.getElementById('view-files').classList.add('active');
            renderFileTree();
        }
    });
});

// ============ ANIMATED COUNTERS ============
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    });
}

// Trigger counters when dashboard is visible
const dashboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            dashboardObserver.disconnect();
        }
    });
});
const dashboardView = document.getElementById('view-dashboard');
if (dashboardView) dashboardObserver.observe(dashboardView);

// ============ LIVE COMMIT GRAPH ============
const commitGraph = document.getElementById('commit-graph');
const graphTooltip = document.getElementById('graph-tooltip');

function resizeCommitGraph() {
    const container = commitGraph.parentElement;
    commitGraph.width = container.clientWidth;
    commitGraph.height = container.clientHeight;
}
resizeCommitGraph();
window.addEventListener('resize', resizeCommitGraph);

const branchColors = {
    main: '#e17055',
    develop: '#00b894',
    feature: '#fdcb6e',
    hotfix: '#74b9ff'
};

const commits = [];
const branches = ['main', 'develop', 'feature/attention', 'feature/memory', 'hotfix/crash'];
const now = Date.now();

for (let i = 0; i < 50; i++) {
    const branch = branches[Math.floor(Math.random() * branches.length)];
    commits.push({
        x: 0.05 + (i / 50) * 0.9,
        y: 0.15 + Math.random() * 0.7,
        branch: branch,
        time: new Date(now - (50 - i) * 1800000),
        message: `commit ${Math.random().toString(36).substr(2, 7)}`,
        author: ['Alex', 'Sam', 'Lisa', 'Elena'][Math.floor(Math.random() * 4)]
    });
}

// Build connections
commits.forEach((commit, i) => {
    commit.parents = [];
    if (i > 0) {
        const prevSameBranch = commits.slice(0, i).reverse().find(c => c.branch === commit.branch);
        if (prevSameBranch) {
            commit.parents.push(commits.indexOf(prevSameBranch));
        }
    }
    if (Math.random() > 0.7 && i > 5) {
        const mergeFrom = commits[Math.floor(Math.random() * i)];
        if (mergeFrom.branch !== commit.branch) {
            commit.parents.push(commits.indexOf(mergeFrom));
        }
    }
});

function drawCommitGraph() {
    const ctx = commitGraph.getContext('2d');
    const w = commitGraph.width;
    const h = commitGraph.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // Draw connections
    commits.forEach((commit, i) => {
        commit.parents.forEach(parentIdx => {
            const parent = commits[parentIdx];
            const x1 = parent.x * w;
            const y1 = parent.y * h;
            const x2 = commit.x * w;
            const y2 = commit.y * h;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            const midX = (x1 + x2) / 2;
            ctx.bezierCurveTo(midX, y1, midX, y2, x2, y2);
            
            const color = branchColors[commit.branch.split('/')[0]];
            ctx.strokeStyle = color + '40';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    });
    
    // Draw commits
    commits.forEach((commit, i) => {
        const x = commit.x * w;
        const y = commit.y * h;
        const color = branchColors[commit.branch.split('/')];
        
        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, color + '30');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 15, y - 15, 30, 30);
        
        // Dot
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#0c0a09';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Store position for hover
        commit._x = x;
        commit._y = y;
    });
    
    requestAnimationFrame(drawCommitGraph);
}

// Tooltip handling
commitGraph.addEventListener('mousemove', (e) => {
    const rect = commitGraph.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    let hovered = null;
    for (const commit of commits) {
        const dx = mx - commit._x;
        const dy = my - commit._y;
        if (dx * dx + dy * dy < 100) {
            hovered = commit;
            break;
        }
    }
    
    if (hovered) {
        graphTooltip.classList.add('visible');
        graphTooltip.style.left = hovered._x + 15 + 'px';
        graphTooltip.style.top = hovered._y - 10 + 'px';
        graphTooltip.innerHTML = `
            <strong>${hovered.branch}</strong><br>
            <span style="color: var(--text-muted)">${hovered.message}</span><br>
            <span style="color: var(--text-muted); font-size: 0.75rem">
                ${hovered.author} · ${hovered.time.toLocaleTimeString()}
            </span>
        `;
    } else {
        graphTooltip.classList.remove('visible');
    }
});

commitGraph.addEventListener('mouseleave', () => {
    graphTooltip.classList.remove('visible');
});

drawCommitGraph();

// ============ CONTRIBUTION HEATMAP ============
const heatmapContainer = document.getElementById('contribution-heatmap');

function generateHeatmap() {
    const weeks = 53;
    const days = 7;
    const levels = [0, 1, 2, 3, 4];
    
    for (let w = 0; w < weeks; w++) {
        for (let d = 0; d < days; d++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            // Bias toward more recent dates
            const recency = w / weeks;
            const baseLevel = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
            const level = Math.random() > recency ? Math.max(0, baseLevel - 1) : baseLevel;
            
            cell.style.background = `var(--heatmap-${level})`;
            cell.title = `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]}, week ${w + 1}: ${level * 2 + Math.floor(Math.random() * 3)} commits`;
            
            // Staggered entrance
            cell.style.opacity = '0';
            cell.style.animation = `cellEnter 0.3s ease ${(w * 7 + d) * 0.002}s forwards`;
            
            heatmapContainer.appendChild(cell);
        }
    }
}

const cellEnterStyle = document.createElement('style');
cellEnterStyle.textContent = `
    @keyframes cellEnter {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(cellEnterStyle);
generateHeatmap();

// ============ MERGE REQUEST FILTERS ============
const pipelineFilters = document.querySelectorAll('.filter-pill');
const mrCards = document.querySelectorAll('.mr-card');

pipelineFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        pipelineFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        const filterType = filter.textContent.toLowerCase().replace(/\s+/g, '-');
        
        mrCards.forEach(card => {
            if (filterType === 'all') {
                card.style.display = 'flex';
            } else {
                const hasStatus = card.classList.contains(`status-${filterType}`) ||
                    (filterType === 'needs-review' && card.classList.contains('status-review'));
                card.style.display = hasStatus ? 'flex' : 'none';
            }
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'viewEnter 0.3s ease';
        });
    });
});

// ============ DIFF VIEWER ============
const diffBody = document.getElementById('diff-body');
const diffModeBtns = document.querySelectorAll('[data-diff-mode]');

const diffData = [
    { type: 'hunk', content: '@@ -45,12 +45,47 @@ class MultiHeadAttention(nn.Module):' },
    { type: 'context', oldNum: 45, newNum: 45, content: '    def __init__(self, d_model, num_heads, dropout=0.1):' },
    { type: 'context', oldNum: 46, newNum: 46, content: '        super().__init__()' },
    { type: 'context', oldNum: 47, newNum: 47, content: '        assert d_model % num_heads == 0, "d_model must be divisible by num_heads"' },
    { type: 'removed', oldNum: 48, newNum: null, content: '        ' },
    { type: 'removed', oldNum: 49, newNum: null, content: '        self.d_model = d_model' },
    { type: 'removed', oldNum: 50, newNum: null, content: '        self.num_heads = num_heads' },
    { type: 'removed', oldNum: 51, newNum: null, content: '        self.head_dim = d_model // num_heads' },
    { type: 'added', oldNum: null, newNum: 48, content: '        ' },
    { type: 'added', oldNum: null, newNum: 49, content: '        self.d_model = d_model' },
    { type: 'added', oldNum: null, newNum: 50, content: '        self.num_heads = num_heads' },
    { type: 'added', oldNum: null, newNum: 51, content: '        self.head_dim = d_model // num_heads' },
    { type: 'added', oldNum: null, newNum: 52, content: '        self.scale = self.head_dim ** -0.5  # Precompute scaling factor' },
    { type: 'context', oldNum: 52, newNum: 53, content: '        ' },
    { type: 'context', oldNum: 53, newNum: 54, content: '        self.q_proj = nn.Linear(d_model, d_model)' },
    { type: 'context', oldNum: 54, newNum: 55, content: '        self.k_proj = nn.Linear(d_model, d_model)' },
    { type: 'context', oldNum: 55, newNum: 56, content: '        self.v_proj = nn.Linear(d_model, d_model)' },
    { type: 'added', oldNum: null, newNum: 57, content: '        self.out_proj = nn.Linear(d_model, d_model)' },
    { type: 'context', oldNum: 56, newNum: 58, content: '        self.dropout = nn.Dropout(dropout)' },
    { type: 'hunk', content: '@@ -62,18 +77,35 @@ class MultiHeadAttention(nn.Module):' },
    { type: 'context', oldNum: 62, newNum: 77, content: '    def forward(self, query, key, value, mask=None):' },
    { type: 'context', oldNum: 63, newNum: 78, content: '        batch_size = query.size(0)' },
    { type: 'removed', oldNum: 64, newNum: null, content: '        ' },
    { type: 'removed', oldNum: 65, newNum: null, content: '        # Linear projections' },
    { type: 'added', oldNum: null, newNum: 79, content: '        ' },
    { type: 'added', oldNum: null, newNum: 80, content: '        # Efficient fused projection using einsum' },
    { type: 'added', oldNum: null, newNum: 81, content: '        # Reduces memory overhead for large batch sizes' },
    { type: 'context', oldNum: 66, newNum: 82, content: '        Q = self.q_proj(query).view(batch_size, -1, self.num_heads, self.head_dim).transpose(1, 2)' },
    { type: 'context', oldNum: 67, newNum: 83, content: '        K = self.k_proj(key).view(batch_size, -1, self.num_heads, self.head_dim).transpose(1, 2)' },
    { type: 'context', oldNum: 68, newNum: 84, content: '        V = self.v_proj(value).view(batch_size, -1, self.num_heads, self.head_dim).transpose(1, 2)' },
    { type: 'added', oldNum: null, newNum: 85, content: '        ' },
    { type: 'added', oldNum: null, newNum: 86, content: '        # Scaled dot-product attention with memory-efficient attention' },
    { type: 'added', oldNum: null, newNum: 87, content: '        # Uses Flash Attention 2 algorithm when available' },
    { type: 'context', oldNum: 69, newNum: 88, content: '        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)' }
];

function renderDiff() {
    diffBody.innerHTML = '';
    const isSplit = diffBody.classList.contains('split-mode');
    
    diffData.forEach(line => {
        if (line.type === 'hunk') {
            const hunk = document.createElement('div');
            hunk.className = 'diff-hunk-header';
            hunk.textContent = line.content;
            diffBody.appendChild(hunk);
            return;
        }
        
        const row = document.createElement('div');
        row.className = `diff-line ${line.type}`;
        
        if (isSplit) {
            if (line.type === 'added') {
                row.innerHTML = `
                    <div class="diff-line-num empty"></div>
                    <div class="diff-line-content"></div>
                    <div class="diff-line-num">${line.newNum}</div>
                    <div class="diff-line-content">${syntaxHighlight(line.content)}</div>
                `;
            } else if (line.type === 'removed') {
                row.innerHTML = `
                    <div class="diff-line-num">${line.oldNum}</div>
                    <div class="diff-line-content">${syntaxHighlight(line.content)}</div>
                    <div class="diff-line-num empty"></div>
                    <div class="diff-line-content"></div>
                `;
            } else {
                row.innerHTML = `
                    <div class="diff-line-num">${line.oldNum}</div>
                    <div class="diff-line-content">${syntaxHighlight(line.content)}</div>
                    <div class="diff-line-num">${line.newNum}</div>
                    <div class="diff-line-content">${syntaxHighlight(line.content)}</div>
                `;
            }
        } else {
            row.innerHTML = `
                <div class="diff-line-num">${line.oldNum || ''}</div>
                <div class="diff-line-num">${line.newNum || ''}</div>
                <div class="diff-line-content">${syntaxHighlight(line.content)}</div>
            `;
        }
        
        diffBody.appendChild(row);
    });
}

function syntaxHighlight(code) {
    const patterns = [
        { regex: /\b(def|class|return|if|else|elif|for|while|import|from|as|try|except|with|assert|yield|lambda|async|await)\b/g, class: 'syntax-keyword' },
        { regex: /\b(self|cls|super|None|True|False|int|str|float|list|dict|tuple|set|bool)\b/g, class: 'syntax-keyword' },
        { regex: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/g, class: 'syntax-string' },
        { regex: /#.*$/gm, class: 'syntax-comment' },
        { regex: /\b([A-Z][a-zA-Z0-9_]*)\b/g, class: 'syntax-class' },
        { regex: /\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g, class: 'syntax-function' },
        { regex: /\b\d+\.?\d*\b/g, class: 'syntax-number' },
        { regex: /[+\-*/%=<>!&|^~]/g, class: 'syntax-operator' }
    ];
    
    let highlighted = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    patterns.forEach(({ regex, class: className }) => {
        highlighted = highlighted.replace(regex, match => `<span class="${className}">${match}</span>`);
    });
    
    return highlighted;
}

renderDiff();

diffModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        diffModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const mode = btn.dataset.diffMode;
        if (mode === 'split') {
            diffBody.classList.add('split-mode');
        } else {
            diffBody.classList.remove('split-mode');
        }
        renderDiff();
    });
});

// ============ FILE TREE ============
const fileTreeData = [
    {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'layers',
                type: 'folder',
                children: [
                    { name: 'attention.py', type: 'file' },
                    { name: 'feedforward.py', type: 'file' },
                    { name: 'normalization.py', type: 'file' }
                ]
            },
            {
                name: 'ops',
                type: 'folder',
                children: [
                    { name: 'cuda_kernels.py', type: 'file' },
                    { name: 'memory_efficient.py', type: 'file' }
                ]
            },
            { name: 'model.py', type: 'file' },
            { name: 'train.py', type: 'file' }
        ]
    },
    {
        name: 'tests',
        type: 'folder',
        children: [
            { name: 'test_attention.py', type: 'file' },
            { name: 'test_model.py', type: 'file' }
        ]
    },
    { name: 'setup.py', type: 'file' },
    { name: 'README.md', type: 'file' },
    { name: 'pyproject.toml', type: 'file' }
];

const codeSample = `import math
import torch
import torch.nn as nn
from typing import Optional, Tuple

class MultiHeadAttention(nn.Module):
    """
    Memory-efficient multi-head attention with Flash Attention 2 support.
    
    This implementation reduces memory overhead from O(n²) to O(n) 
    for sequence length n, enabling training on longer sequences.
    """
    
    def __init__(self, d_model: int, num_heads: int, dropout: float = 0.1):
        super().__init__()
        assert d_model % num_heads == 0, "d_model must be divisible by num_heads"
        
        self.d_model = d_model
        self.num_heads = num_heads
        self.head_dim = d_model // num_heads
        self.scale = self.head_dim ** -0.5
        
        # Fused QKV projection for memory efficiency
        self.qkv_proj = nn.Linear(d_model, 3 * d_model, bias=False)
        self.out_proj = nn.Linear(d_model, d_model, bias=False)
        self.dropout = nn.Dropout(dropout)
        
    def forward(
        self, 
        x: torch.Tensor,
        mask: Optional[torch.Tensor] = None
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        B, T, C = x.size()
        
        # Compute Q, K, V in single matmul
        qkv = self.qkv_proj(x)
        q, k, v = qkv.split(self.d_model, dim=-1)
        
        # Reshape for multi-head attention
        q = q.view(B, T, self.num_heads, self.head_dim).transpose(1, 2)
        k = k.view(B, T, self.num_heads, self.head_dim).transpose(1, 2)
        v = v.view(B, T, self.num_heads, self.head_dim).transpose(1, 2)
        
        # Flash Attention 2: memory-efficient attention
        # Falls back to manual implementation if flash_attn unavailable
        try:
            from flash_attn import flash_attn_func
            out = flash_attn_func(q, k, v, dropout_p=self.dropout.p, causal=True)
        except ImportError:
            # Manual scaled dot-product attention
            scores = torch.matmul(q, k.transpose(-2, -1)) * self.scale
            if mask is not None:
                scores = scores.masked_fill(mask == 0, float('-inf'))
            attn = torch.softmax(scores, dim=-1)
            attn = self.dropout(attn)
            out = torch.matmul(attn, v)
        
        # Reshape and project
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        return self.out_proj(out), attn`;

function renderFileTree() {
    const treeContainer = document.getElementById('file-tree');
    if (!treeContainer || treeContainer.children.length > 0) return;
    
    function createTreeItem(item, depth = 0) {
        const div = document.createElement('div');
        
        const row = document.createElement('div');
        row.className = 'tree-item';
        row.style.paddingLeft = `${8 + depth * 16}px`;
        
        const icon = document.createElement('span');
        icon.className = 'tree-icon';
        if (item.type === 'folder') {
            icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
        } else {
            icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
        }
        
        const name = document.createElement('span');
        name.className = 'tree-name';
        name.textContent = item.name;
        
        row.appendChild(icon);
        row.appendChild(name);
        div.appendChild(row);
        
        if (item.type === 'folder' && item.children) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'tree-children';
            
            item.children.forEach(child => {
                childrenContainer.appendChild(createTreeItem(child, depth + 1));
            });
            
            div.appendChild(childrenContainer);
            
            row.addEventListener('click', () => {
                const isCollapsed = childrenContainer.style.display === 'none';
                childrenContainer.style.display = isCollapsed ? 'block' : 'none';
                icon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)';
            });
        }
        
        if (item.type === 'file') {
            row.addEventListener('click', () => {
                document.querySelectorAll('.tree-item').forEach(t => t.classList.remove('active'));
                row.classList.add('active');
                renderCodeViewer(item.name);
            });
        }
        
        return div;
    }
    
    fileTreeData.forEach(item => {
        treeContainer.appendChild(createTreeItem(item));
    });
}

function renderCodeViewer(filename) {
    const viewer = document.getElementById('code-viewer');
    const breadcrumb = document.getElementById('file-breadcrumb');
    
    breadcrumb.innerHTML = `
        <span>neural-forge</span>
        <span class="sep">/</span>
        <span>src</span>
        <span class="sep">/</span>
        <span>layers</span>
        <span class="sep">/</span>
        <span class="active">${filename}</span>
    `;
    
    const lines = codeSample.split('\n');
    viewer.innerHTML = lines.map((line, i) => `
        <div class="code-line">
            <div class="code-line-num">${i + 1}</div>
            <div class="code-line-content">${syntaxHighlight(line) || ' '}</div>
        </div>
    `).join('');
}

// ============ COMMAND PALETTE ============
const commandPalette = document.getElementById('command-palette');
const paletteInput = document.getElementById('palette-input');
const paletteResults = document.getElementById('palette-results');

const commands = [
    { title: 'Go to Dashboard', desc: 'Navigate to workspace overview', shortcut: 'G D', icon: 'grid', action: () => switchView('dashboard') },
    { title: 'Go to Repositories', desc: 'Browse all repositories', shortcut: 'G R', icon: 'folder', action: () => switchView('repositories') },
    { title: 'Go to Merge Requests', desc: 'Review pending changes', shortcut: 'G M', icon: 'git-merge', action: () => {} },
    { title: 'New Repository', desc: 'Create a new repository', shortcut: 'C R', icon: 'plus', action: () => {} },
    { title: 'New Merge Request', desc: 'Create MR from current branch', shortcut: 'C M', icon: 'git-pull', action: () => {} },
    { title: 'Search Files', desc: 'Find files across repositories', shortcut: 'S F', icon: 'file', action: () => {} },
    { title: 'Toggle Theme', desc: 'Switch between light and dark', shortcut: 'T T', icon: 'sun', action: () => {} },
    { title: 'Keyboard Shortcuts', desc: 'View all available shortcuts', shortcut: '?', icon: 'command', action: () => {} }
];

function switchView(viewName) {
    navItems.forEach(n => {
        n.classList.toggle('active', n.dataset.view === viewName);
    });
    views.forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewName}`).classList.add('active');
    commandPalette.classList.remove('active');
}

function openPalette() {
    commandPalette.classList.add('active');
    paletteInput.value = '';
    paletteInput.focus();
    renderPaletteResults('');
}

function closePalette() {
    commandPalette.classList.remove('active');
}

function renderPaletteResults(query) {
    const filtered = commands.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase())
    );
    
    paletteResults.innerHTML = `
        <div class="palette-group">
            <div class="palette-group-label">Commands</div>
            ${filtered.map((cmd, i) => `
                <div class="palette-item ${i === 0 ? 'selected' : ''}" data-index="${i}">
                    <div class="palette-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            ${getIconPath(cmd.icon)}
                        </svg>
                    </div>
                    <div class="palette-item-content">
                        <div class="palette-item-title">${highlightMatch(cmd.title, query)}</div>
                        <div class="palette-item-desc">${cmd.desc}</div>
                    </div>
                    <div class="palette-item-shortcut">${cmd.shortcut}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.querySelectorAll('.palette-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            filtered[idx].action();
        });
    });
}

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span style="color: var(--accent-amber); font-weight: 600;">$1</span>');
}

function getIconPath(icon) {
    const paths = {
        'grid': '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
        'folder': '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
        'git-merge': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"/>',
        'plus': '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
        'git-pull': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/>',
        'file': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
        'sun': '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
        'command': '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>'
    };
    return paths[icon] || paths['file'];
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openPalette();
    }
    
    // Escape
    if (e.key === 'Escape') {
        closePalette();
    }
    
    // Palette navigation
    if (commandPalette.classList.contains('active')) {
        const items = paletteResults.querySelectorAll('.palette-item');
        const selected = paletteResults.querySelector('.palette-item.selected');
        let selectedIndex = selected ? parseInt(selected.dataset.index) : -1;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selected) selected.classList.remove('selected');
            selectedIndex = (selectedIndex + 1) % items.length;
            items[selectedIndex]?.classList.add('selected');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selected) selected.classList.remove('selected');
            selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
            items[selectedIndex]?.classList.add('selected');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selected) selected.click();
        }
    }
});

paletteInput.addEventListener('input', (e) => {
    renderPaletteResults(e.target.value);
});

document.querySelector('.palette-overlay')?.addEventListener('click', closePalette);

// ============ FILTER BUTTONS (COMMIT GRAPH) ============
document.querySelectorAll('.section-actions .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ============ REPO CARD CLICK HANDLERS ============
document.querySelectorAll('.repo-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('.repo-star')) return;
        
        document.getElementById('view-dashboard').classList.remove('active');
        document.getElementById('view-files').classList.add('active');
        
        navItems.forEach(n => n.classList.remove('active'));
        document.querySelector('[data-view="repositories"]')?.classList.add('active');
        
        renderFileTree();
        renderCodeViewer('attention.py');
    });
});

// Star button toggle
document.querySelectorAll('.repo-star').forEach(star => {
    star.addEventListener('click', (e) => {
        e.stopPropagation();
        star.classList.toggle('active');
    });
});

// ============ SEARCH SHORTCUT DISPLAY ============
function updateSearchShortcut() {
    const shortcut = document.querySelector('.search-shortcut');
    if (shortcut) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        shortcut.textContent = isMac ? '⌘K' : 'Ctrl+K';
    }
}
updateSearchShortcut();

// ============ SMOOTH SCROLL FOR SECTION LINKS ============
document.querySelectorAll('.section-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// ============ INITIAL ANIMATIONS ============
function initEntranceAnimations() {
    const sections = document.querySelectorAll('.section, .hero-section');
    sections.forEach((section, i) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100 + i * 100);
    });
}

// Trigger after a brief delay to ensure DOM is ready
setTimeout(initEntranceAnimations, 100);

// ============ RESIZE HANDLER ============
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeAmbient();
        resizeCommitGraph();
    }, 150);
});

// ============ MR CARD EXPAND/COLLAPSE ============
document.querySelectorAll('.mr-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (e.target.closest('.comment-bubble')) return;
        
        const content = card.querySelector('.mr-content');
        const comments = card.querySelector('.mr-comments-preview');
        
        if (comments) {
            comments.style.display = comments.style.display === 'none' ? 'block' : 'none';
        }
    });
});