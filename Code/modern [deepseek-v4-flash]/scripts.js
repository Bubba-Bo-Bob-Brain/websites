// ============================================================
// codeloom – scripts.js
// Immersive interactions, live data simulation, UI enhancements
// ============================================================

(function () {
  'use strict';

  // ─── state ────────────────────────────────────────────────
  const state = {
    commits: [
      { hash: 'e7a3f2d', msg: 'refactor: optimize merge sort', author: 'loom', branch: 'main' },
      { hash: 'b1c9e4a', msg: 'feat: add file watcher', author: 'kira', branch: 'feature/watch' },
      { hash: '9d812f7', msg: 'fix: race condition on branch switch', author: 'loom', branch: 'main' },
      { hash: '3a1f0c2', msg: 'chore: bump dependencies', author: 'dev', branch: 'main' },
      { hash: 'f4e2b8a', msg: 'test: add integration suite', author: 'kira', branch: 'feature/test' },
      { hash: 'c7d9e1b', msg: 'docs: update readme', author: 'loom', branch: 'main' },
    ],
    mergeRequests: [
      { id: 42, title: 'feat/dark-mode', status: 'open', meta: '#42 · 2d ago' },
      { id: 43, title: 'fix/edge-case', status: 'draft', meta: '#43 · draft' },
      { id: 41, title: 'refactor/api', status: 'approved', meta: '#41 · approved' },
      { id: 40, title: 'hotfix/login', status: 'merged', meta: '#40 · merged' },
    ],
    heatmapDays: 30,
    selectedFile: 'App.jsx',
  };

  // ─── DOM refs ─────────────────────────────────────────────
  const fileTreeEl = document.getElementById('fileTree');
  const commitListEl = document.getElementById('commitList');
  const diffContentEl = document.getElementById('diffContent');
  const heatmapGridEl = document.getElementById('heatmapGrid');
  const mrListEl = document.getElementById('mrList');
  const graphContainer = document.getElementById('commitGraphContainer');

  // ─── 1. File tree explorer ────────────────────────────────
  function renderFileTree() {
    const files = [
      { type: 'folder', label: 'src', open: true, children: [
        { type: 'folder', label: 'components', children: [
          { type: 'file', label: 'App.jsx', active: true },
          { type: 'file', label: 'Header.jsx' },
        ]},
        { type: 'folder', label: 'utils', children: [
          { type: 'file', label: 'helpers.js' },
          { type: 'file', label: 'config.json' },
        ]},
        { type: 'file', label: 'index.css' },
      ]},
      { type: 'file', label: 'README.md' },
      { type: 'file', label: 'package.json' },
    ];

    function buildTree(items, depth = 0) {
      let html = '';
      for (const item of items) {
        const indent = depth * 16;
        const activeClass = item.active ? ' active' : '';
        const icon = item.type === 'folder' ? '📂' : '📄';
        const folderOpen = item.type === 'folder' && item.open ? ' open' : '';
        html += `<div class="tree-item ${item.type}${folderOpen}${activeClass}" style="padding-left: ${12 + indent}px">
          <span class="tree-icon">${icon}</span>
          <span class="tree-label">${item.label}</span>
        </div>`;
        if (item.children && item.open) {
          html += buildTree(item.children, depth + 1);
        }
      }
      return html;
    }

    fileTreeEl.innerHTML = buildTree(files);

    // add click handler to simulate file selection
    fileTreeEl.querySelectorAll('.tree-item.file').forEach(el => {
      el.addEventListener('click', function (e) {
        fileTreeEl.querySelectorAll('.tree-item.file').forEach(f => f.classList.remove('active'));
        this.classList.add('active');
        const label = this.querySelector('.tree-label')?.textContent || 'file';
        state.selectedFile = label;
        // update diff badge
        const diffBadge = document.querySelector('.diff-viewer-panel .panel-badge');
        if (diffBadge) diffBadge.textContent = label;
        // simulate diff update
        renderDiffViewer(label);
      });
    });
  }

  // ─── 2. Commit graph + list ──────────────────────────────
  function renderCommitList() {
    let html = '';
    state.commits.forEach(c => {
      html += `<div class="commit-item">
        <span class="commit-hash">${c.hash}</span>
        <span class="commit-msg">${c.msg}</span>
        <span class="commit-author">${c.author}</span>
      </div>`;
    });
    commitListEl.innerHTML = html;

    // animate nodes on hover (SVG nodes already have CSS)
    const nodes = graphContainer?.querySelectorAll('.commit-node');
    if (nodes) {
      nodes.forEach((node, index) => {
        node.addEventListener('mouseenter', () => {
          // highlight corresponding commit in list
          const items = commitListEl.querySelectorAll('.commit-item');
          if (items[index]) {
            items[index].style.background = 'rgba(45, 212, 191, 0.1)';
            items[index].style.borderLeft = '2px solid var(--accent)';
          }
        });
        node.addEventListener('mouseleave', () => {
          const items = commitListEl.querySelectorAll('.commit-item');
          if (items[index]) {
            items[index].style.background = '';
            items[index].style.borderLeft = '';
          }
        });
      });
    }
  }

  // ─── 3. Diff viewer (dynamic) ────────────────────────────
  function renderDiffViewer(filename) {
    // simulated diffs per file
    const diffs = {
      'App.jsx': [
        { type: 'add', line: 12, code: '+ const merge = (left, right) => {' },
        { type: 'add', line: 13, code: '+   let result = [];' },
        { type: 'remove', line: 14, code: '-   let sorted = [];' },
        { type: 'context', line: 15, code: '  while (left.length && right.length) {' },
        { type: 'context', line: 16, code: '    if (left[0] < right[0]) {' },
        { type: 'add', line: 17, code: '+     result.push(left.shift());' },
      ],
      'Header.jsx': [
        { type: 'context', line: 1, code: '  import React from "react";' },
        { type: 'add', line: 2, code: '+ import { useTheme } from "../hooks";' },
        { type: 'remove', line: 3, code: '- import { ThemeContext } from "context";' },
        { type: 'context', line: 4, code: '  const Header = () => {' },
      ],
      'helpers.js': [
        { type: 'add', line: 8, code: '+ export const debounce = (fn, delay) => {' },
        { type: 'add', line: 9, code: '+   let timer;' },
        { type: 'add', line: 10, code: '+   return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };' },
        { type: 'remove', line: 11, code: '- // old debounce implementation' },
      ],
      'config.json': [
        { type: 'context', line: 1, code: '  {' },
        { type: 'add', line: 2, code: '+   "apiUrl": "https://api.codeloom.dev",' },
        { type: 'remove', line: 3, code: '-   "apiUrl": "http://localhost:3000",' },
        { type: 'context', line: 4, code: '    "version": "2.1.0"' },
      ],
      'index.css': [
        { type: 'context', line: 22, code: '  body {' },
        { type: 'add', line: 23, code: '+   background: #0b0d14;' },
        { type: 'remove', line: 24, code: '-   background: #fff;' },
      ],
    };

    const fileDiffs = diffs[filename] || diffs['App.jsx'];
    let html = '';
    fileDiffs.forEach(d => {
      const cls = d.type === 'add' ? 'diff-add' : d.type === 'remove' ? 'diff-remove' : 'diff-context';
      // escape HTML entities for code content
      let code = d.code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      html += `<div class="diff-line ${cls}">
        <span class="line-num">${d.line}</span>
        <span class="line-code">${code}</span>
      </div>`;
    });
    diffContentEl.innerHTML = html;
  }

  // ─── 4. Contribution heatmap ──────────────────────────────
  function renderHeatmap() {
    const totalCells = state.heatmapDays;
    let html = '';
    for (let i = 0; i < totalCells; i++) {
      // pseudo-random level based on index to look organic
      const seed = (i * 7 + i * i * 3) % 11;
      let level = 0;
      if (seed > 8) level = 3;
      else if (seed > 5) level = 2;
      else if (seed > 2) level = 1;
      html += `<div class="heat-cell level-${level}" data-day="${i}"></div>`;
    }
    heatmapGridEl.innerHTML = html;

    // add tooltip-like effect on hover
    heatmapGridEl.querySelectorAll('.heat-cell').forEach(cell => {
      cell.addEventListener('mouseenter', function () {
        const level = this.className.match(/level-(\d)/);
        const count = level ? parseInt(level[1]) : 0;
        const contributions = [0, 1, 3, 8][count] || 0;
        this.setAttribute('title', `${contributions} contributions`);
      });
    });
  }

  // ─── 5. Merge request status ─────────────────────────────
  function renderMergeRequests() {
    let html = '';
    state.mergeRequests.forEach(mr => {
      const statusClass = `status-${mr.status}`;
      let indicator = '●';
      if (mr.status === 'draft') indicator = '◌';
      else if (mr.status === 'approved') indicator = '✔';
      else if (mr.status === 'merged') indicator = '⏺';

      html += `<div class="mr-item ${statusClass}">
        <span class="mr-status-indicator">${indicator}</span>
        <span class="mr-title">${mr.title}</span>
        <span class="mr-meta">${mr.meta}</span>
      </div>`;
    });
    mrListEl.innerHTML = html;

    // simulate real-time update: flash open MRs
    const openMr = mrListEl.querySelector('.status-open');
    if (openMr) {
      setInterval(() => {
        openMr.style.opacity = openMr.style.opacity === '0.6' ? '1' : '0.6';
      }, 1200);
    }
  }

  // ─── 6. Live graph animation ──────────────────────────────
  function animateGraphNodes() {
    const nodes = document.querySelectorAll('.commit-node');
    nodes.forEach((node, i) => {
      // subtle pulse with staggered delay
      const delay = i * 0.15;
      node.style.animation = `pulse-node 3s ease-in-out ${delay}s infinite`;
    });
  }

  // inject keyframes for node pulse (if not already in stylesheet)
  function injectAnimationKeyframes() {
    if (document.getElementById('dynamic-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'dynamic-keyframes';
    style.textContent = `
      @keyframes pulse-node {
        0%, 100% { opacity: 0.9; r: 5; filter: drop-shadow(0 0 2px rgba(45,212,191,0.2)); }
        50% { opacity: 1; r: 6; filter: drop-shadow(0 0 8px rgba(45,212,191,0.6)); }
      }
    `;
    document.head.appendChild(style);
  }

  // ─── 7. Simulate live activity ────────────────────────────
  function simulateLiveActivity() {
    // every 7 seconds, add a fake commit and update list
    setInterval(() => {
      const authors = ['loom', 'kira', 'dev', 'alice'];
      const msgs = [
        'fix: typo in parser',
        'refactor: extract validation',
        'feat: add rate limiter',
        'chore: update lodash',
        'test: add e2e coverage',
        'docs: api reference',
      ];
      const newCommit = {
        hash: Math.random().toString(16).slice(2, 10),
        msg: msgs[Math.floor(Math.random() * msgs.length)],
        author: authors[Math.floor(Math.random() * authors.length)],
        branch: 'main',
      };
      state.commits.unshift(newCommit);
      if (state.commits.length > 12) state.commits.pop();

      // re-render commit list
      renderCommitList();

      // update heatmap: randomly bump a cell
      const cells = heatmapGridEl.querySelectorAll('.heat-cell');
      if (cells.length) {
        const idx = Math.floor(Math.random() * cells.length);
        const current = cells[idx];
        const level = Math.min(3, parseInt(current.className.match(/level-(\d)/)?.[1] || 0) + 1);
        current.className = `heat-cell level-${level}`;
      }

      // update stats
      const statValue = document.querySelector('.stat-value');
      if (statValue) {
        const currentVal = parseInt(statValue.textContent.replace(',', ''));
        statValue.textContent = (currentVal + 1).toLocaleString();
      }
    }, 7000);
  }

  // ─── 8. Initialize everything ─────────────────────────────
  function init() {
    renderFileTree();
    renderCommitList();
    renderDiffViewer(state.selectedFile);
    renderHeatmap();
    renderMergeRequests();
    animateGraphNodes();
    injectAnimationKeyframes();
    simulateLiveActivity();

    // expose state for debugging (optional)
    window.__codeloom = { state };
  }

  // run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();