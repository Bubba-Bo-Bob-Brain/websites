// ============================================================
// ForgeSync — Source Code Management & Collaboration
// scripts.js
// ============================================================

(function () {
  'use strict';

  // ---- DOM References ----
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mainContent = document.getElementById('mainContent');
  const overlay = document.getElementById('overlay');
  const notificationsBtn = document.getElementById('notificationsBtn');
  const notificationPanel = document.getElementById('notificationPanel');
  const notificationList = document.getElementById('notificationList');
  const commitGraphCanvas = document.getElementById('commitGraph');
  const loadDiffBtn = document.getElementById('loadDiffBtn');
  const diffContent = document.getElementById('diffContent');
  const fileTree = document.getElementById('fileTree');
  const toggleTreeBtn = document.getElementById('toggleTreeBtn');
  const graphPeriodBtns = document.querySelectorAll('.graph-period');
  const navItems = document.querySelectorAll('.nav-item');
  const activityFeed = document.getElementById('activityFeed');

  // ---- State ----
  let sidebarCollapsed = false;
  let notificationsOpen = false;
  let treeCollapsed = false;
  let currentGraphPeriod = 'week';
  let mobileMenuOpen = false;

  // ============================================================
  // 1. SIDEBAR TOGGLE
  // ============================================================
  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
    sidebarToggle.querySelector('svg').style.transform = sidebarCollapsed
      ? 'rotate(180deg)'
      : 'rotate(0deg)';

    // Persist preference
    localStorage.setItem('forgeSync-sidebar-collapsed', sidebarCollapsed);
  }

  sidebarToggle.addEventListener('click', toggleSidebar);

  // Restore sidebar state
  if (localStorage.getItem('forgeSync-sidebar-collapsed') === 'true') {
    sidebarCollapsed = true;
    sidebar.classList.add('collapsed');
    sidebarToggle.querySelector('svg').style.transform = 'rotate(180deg)';
  }

  // ============================================================
  // 2. MOBILE SIDEBAR
  // ============================================================
  function openMobileSidebar() {
    mobileMenuOpen = true;
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    mobileMenuOpen = false;
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Hamburger menu for mobile (create dynamically)
  function injectMobileHamburger() {
    if (window.innerWidth > 768) return;
    if (document.getElementById('mobileHamburger')) return;

    const btn = document.createElement('button');
    btn.id = 'mobileHamburger';
    btn.className = 'icon-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path d="M3 4h12M3 9h12M3 14h12" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    btn.style.marginRight = 'var(--space-sm)';
    const topbarLeft = document.querySelector('.topbar-left');
    if (topbarLeft) topbarLeft.prepend(btn);

    btn.addEventListener('click', () => {
      if (mobileMenuOpen) closeMobileSidebar();
      else openMobileSidebar();
    });

    // Close sidebar on nav click (mobile)
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeMobileSidebar();
      });
    });
  }

  injectMobileHamburger();
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenuOpen) closeMobileSidebar();
    if (window.innerWidth <= 768 && !document.getElementById('mobileHamburger')) injectMobileHamburger();
  });

  overlay.addEventListener('click', () => {
    if (mobileMenuOpen) closeMobileSidebar();
    if (notificationsOpen) closeNotificationPanel();
  });

  // ============================================================
  // 3. NAVIGATION ACTIVE STATE
  // ============================================================
  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      this.classList.add('active');

      // Animate page content transition
      const pageContent = document.querySelector('.page-content');
      pageContent.style.opacity = '0';
      pageContent.style.transform = 'translateY(8px)';
      setTimeout(() => {
        pageContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        pageContent.style.opacity = '1';
        pageContent.style.transform = 'translateY(0)';
        setTimeout(() => {
          pageContent.style.transition = '';
        }, 300);
      }, 150);
    });
  });

  // ============================================================
  // 4. NOTIFICATION PANEL
  // ============================================================
  function openNotificationPanel() {
    notificationsOpen = true;
    notificationPanel.classList.add('open');
    overlay.classList.add('active');
  }

  function closeNotificationPanel() {
    notificationsOpen = false;
    notificationPanel.classList.remove('open');
    overlay.classList.remove('active');
  }

  notificationsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (notificationsOpen) closeNotificationPanel();
    else openNotificationPanel();
  });

  // ============================================================
  // 5. COMMIT GRAPH CANVAS VISUALIZATION
  // ============================================================
  function drawCommitGraph(period) {
    const ctx = commitGraphCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = commitGraphCanvas.getBoundingClientRect();

    commitGraphCanvas.width = rect.width * dpr;
    commitGraphCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, bottom: 20, left: 30, right: 10 };
    const graphW = w - padding.left - padding.right;
    const graphH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    // Generate data based on period
    let days, data;
    if (period === 'week') {
      days = 7;
      data = [3, 8, 12, 5, 15, 9, 6];
    } else if (period === 'month') {
      days = 30;
      data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 1);
    } else {
      days = 52;
      data = Array.from({ length: 52 }, () => Math.floor(Math.random() * 30) + 2);
    }

    const maxVal = Math.max(...data);
    const barWidth = Math.min(graphW / days - 3, 20);
    const gap = (graphW - barWidth * days) / (days + 1);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (graphH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (graphH / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText(val, padding.left - 6, y + 3);
    }

    // Draw bars with gradient
    data.forEach((val, i) => {
      const barH = (val / maxVal) * graphH;
      const x = padding.left + gap + i * (barWidth + gap);
      const y = padding.top + graphH - barH;

      // Color based on intensity
      let r, g, b;
      const ratio = val / maxVal;
      if (ratio < 0.25) {
        r = 16; g = 185; b = 129; // emerald
      } else if (ratio < 0.5) {
        r = 20; g = 184; b = 80; // green
      } else if (ratio < 0.75) {
        r = 132; g = 204; b = 22; // lime
      } else {
        r = 234; g = 179; b = 8; // yellow
      }

      // Bar gradient
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0.4)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      // Rounded top
      const radius = Math.min(3, barWidth / 2);
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
      ctx.lineTo(x + barWidth, y + barH);
      ctx.lineTo(x, y + barH);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.fill();

      // Glow effect for high bars
      if (ratio > 0.7) {
        ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
    });

    // X-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';

    if (period === 'week') {
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((day, i) => {
        const x = padding.left + gap + i * (barWidth + gap) + barWidth / 2;
        ctx.fillText(day, x, h - 4);
      });
    } else if (period === 'month') {
      for (let i = 0; i < 30; i += 5) {
        const x = padding.left + gap + i * (barWidth + gap) + barWidth / 2;
        ctx.fillText(`Day ${i + 1}`, x, h - 4);
      }
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months.forEach((m, i) => {
        const x = padding.left + gap + i * (graphW / 12) + graphW / 24;
        ctx.fillText(m, x, h - 4);
      });
    }
  }

  // Graph period switching
  graphPeriodBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      graphPeriodBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentGraphPeriod = this.dataset.period;
      drawCommitGraph(currentGraphPeriod);
    });
  });

  function initGraph() {
    drawCommitGraph('week');
  }

  // ============================================================
  // 6. FILE TREE EXPLORER
  // ============================================================
  function initFileTree() {
    fileTree.querySelectorAll('.tree-toggle').forEach(toggle => {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const folder = this.closest('.tree-item');
        const children = folder.nextElementSibling;

        if (children && children.classList.contains('tree-children')) {
          const isExpanded = this.classList.contains('expanded');

          if (isExpanded) {
            children.classList.add('collapsed');
            this.classList.remove('expanded');
          } else {
            children.classList.remove('collapsed');
            this.classList.add('expanded');
          }
        }
      });
    });

    // Click on folders to expand/collapse too
    fileTree.querySelectorAll('.tree-folder').forEach(folder => {
      folder.addEventListener('dblclick', function (e) {
        const toggle = this.querySelector('.tree-toggle');
        if (toggle) toggle.click();
      });
    });
  }

  // Collapse all button
  toggleTreeBtn.addEventListener('click', () => {
    treeCollapsed = !treeCollapsed;
    toggleTreeBtn.querySelector('svg').style.transform = treeCollapsed
      ? 'rotate(-90deg)'
      : 'rotate(0deg)';
    toggleTreeBtn.innerHTML = treeCollapsed
      ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l3.5 4L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Expand'
      : '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l3 3.5L11 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Collapse';

    fileTree.querySelectorAll('.tree-children').forEach(children => {
      if (treeCollapsed) {
        children.classList.add('collapsed');
      } else {
        children.classList.remove('collapsed');
      }
    });

    fileTree.querySelectorAll('.tree-toggle').forEach(toggle => {
      if (treeCollapsed) {
        toggle.classList.remove('expanded');
      } else {
        toggle.classList.add('expanded');
      }
    });
  });

  initFileTree();

  // ============================================================
  // 7. CODE DIFF VIEWER
  // ============================================================
  const diffExamples = [
    {
      file: 'src/core/engine.rs',
      hash: 'a3f7c9e',
      author: 'Alex Korolev',
      time: '2 hours ago',
      badge: '+42 -18',
      lines: [
        { type: 'context', left: 42, right: 42, content: '    pub fn initialize(&mut self, config: Config) -> Result&lt;(), Error&gt; {' },
        { type: 'context', left: 43, right: 43, content: '        self.state = State::Running;' },
        { type: 'added', left: 44, right: 44, content: '+       let pool = ThreadPool::new(config.parallelism)?;' },
        { type: 'added', left: 45, right: 45, content: '+       pool.set_priority(config.priority);' },
        { type: 'removed', left: 46, right: null, content: '-       self.workers = Vec::new();' },
        { type: 'context', left: 47, right: 46, content: '        for worker in &self.workers {' },
        { type: 'context', left: 48, right: 47, content: '            worker.start();' },
        { type: 'added', left: null, right: 48, content: '+       self.scheduler = Scheduler::new(pool);' },
        { type: 'context', left: 49, right: 49, content: '        Ok(())' },
      ]
    },
    {
      file: 'src/network/tcp.rs',
      hash: 'f1e2d3c',
      author: 'Maria Lopez',
      time: '5 hours ago',
      badge: '+28 -7',
      lines: [
        { type: 'context', left: 10, right: 10, content: '    pub async fn connect(&self, addr: SocketAddr) -> io::Result&lt;Connection&gt; {' },
        { type: 'removed', left: 11, right: null, content: '-       let stream = TcpStream::connect(addr).await?;' },
        { type: 'added', left: null, right: 11, content: '+       let stream = TcpStream::connect_timeout(&addr, Duration::from_secs(30)).await?;' },
        { type: 'context', left: 12, right: 12, content: '        let conn = Connection::new(stream);' },
        { type: 'added', left: null, right: 13, content: '+       conn.set_keepalive(Some(Duration::from_secs(60)));' },
        { type: 'context', left: 13, right: 14, content: '        Ok(conn)' },
        { type: 'context', left: 14, right: 15, content: '    }' },
      ]
    },
    {
      file: 'tests/integration_tests.rs',
      hash: 'b4c5d6e',
      author: 'Jordan Webb',
      time: '1 day ago',
      badge: '+55 -22',
      lines: [
        { type: 'context', left: 1, right: 1, content: '#[cfg(test)]' },
        { type: 'context', left: 2, right: 2, content: 'mod tests {' },
        { type: 'context', left: 3, right: 3, content: '    use super::*;' },
        { type: 'added', left: null, right: 4, content: '+   use mockall::predicate::*;' },
        { type: 'context', left: 4, right: 5, content: '' },
        { type: 'added', left: null, right: 6, content: '+   #[test]' },
        { type: 'added', left: null, right: 7, content: '+   async fn test_distributed_consensus() {' },
        { type: 'added', left: null, right: 8, content: '+       let cluster = TestCluster::new(5).await;' },
        { type: 'added', left: null, right: 9, content: '+       cluster.propose(b"hello world").await.unwrap();' },
        { type: 'added', left: null, right: 10, content: '+       assert_eq!(cluster.state(), ClusterState::Consistent);' },
        { type: 'added', left: null, right: 11, content: '+   }' },
      ]
    }
  ];

  let currentDiffIndex = 0;

  function renderDiff(diff) {
    diffContent.innerHTML = diff.lines.map(line => {
      const leftNum = line.left !== null ? `<span class="diff-line-num left">${line.left}</span>` : '<span class="diff-line-num left">—</span>';
      const rightNum = line.right !== null ? `<span class="diff-line-num right">${line.right}</span>` : '<span class="diff-line-num right">—</span>';
      const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
      return `<div class="diff-line diff-${line.type}">
        ${leftNum}${rightNum}
        <span class="diff-line-content">${prefix}${escapeHtml(line.content)}</span>
      </div>`;
    }).join('');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  loadDiffBtn.addEventListener('click', () => {
    loadDiffBtn.textContent = 'Loading...';
    loadDiffBtn.disabled = true;

    // Simulate loading with a slight delay
    setTimeout(() => {
      currentDiffIndex = (currentDiffIndex + 1) % diffExamples.length;
      const diff = diffExamples[currentDiffIndex];

      // Update header
      const fileEl = diffContent.closest('.diff-viewer').querySelector('.diff-filename');
      const hashEl = diffContent.closest('.diff-viewer').querySelector('.diff-commit-hash');
      const authorEl = diffContent.closest('.diff-viewer').querySelector('.diff-commit-author');
      const timeEl = diffContent.closest('.diff-viewer').querySelector('.diff-commit-time');
      const badgeEl = diffContent.closest('.diff-viewer').querySelector('.diff-badge');

      fileEl.textContent = diff.file;
      hashEl.textContent = diff.hash;
      authorEl.textContent = diff.author;
      timeEl.textContent = diff.time;
      badgeEl.textContent = diff.badge;

      renderDiff(diff);

      loadDiffBtn.textContent = 'Next Diff';
      loadDiffBtn.disabled = false;

      // Brief highlight animation
      diffContent.style.background = 'rgba(99, 102, 241, 0.08)';
      setTimeout(() => {
        diffContent.style.background = '';
      }, 600);
    }, 400);
  });

  // ============================================================
  // 8. REPOSITORY INTERACTIONS
  // ============================================================
  document.querySelectorAll('.repo-item').forEach(repo => {
    repo.addEventListener('click', function (e) {
      // Don't navigate if clicking on a link
      if (e.target.tagName === 'A') return;

      const name = this.dataset.repo;
      // Visual feedback
      this.style.transform = 'scale(098)';
      setTimeout(() => { this.style.transform = ''; }, 150);

      // Simulate navigation
      console.log(`Navigating to repository: ${name}`);
    });
  });

  // ============================================================
  // 9. MERGE REQUEST INTERACTIONS
  // ============================================================
  document.querySelectorAll('.mr-item').forEach(mr => {
    mr.addEventListener('click', function () {
      this.style.transform = 'scale(098)';
      setTimeout(() => { this.style.transform = ''; }, 150);

      const title = this.querySelector('.mr-title').textContent;
      console.log(`Opening merge request: ${title}`);
    });
  });

  // ============================================================
  // 10. NOTIFICATION INTERACTIONS
  // ============================================================
  document.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', function () {
      this.classList.remove('unread');
      const body = this.querySelector('.notification-body p');
      if (body) {
        body.style.fontWeight = '400';
      }
    });
  });

  // Mark all read button
  const markAllReadBtn = notificationPanel.querySelector('.btn');
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      notificationList.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('unread');
        const body = item.querySelector('.notification-body p');
        if (body) body.style.fontWeight = '400';
      });
    });
  }

  // ============================================================
  // 11. LIVE ACTIVITY COUNTER ANIMATION
  // ============================================================
  function animateCounter(element, target, duration = 1500) {
    const start = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * eased);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  // Animate stat values on load
  function animateStats() {
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/,/g, ''));
      if (!isNaN(target) && target > 0) {
        counter.textContent = '0';
        animateCounter(counter, target, 1800);
      }
    });

    // Animate contribution count
    const contribEl = document.getElementById('totalContributions');
    if (contribEl) {
      const target = parseInt(contribEl.textContent.replace(/,/g, ''));
      if (!isNaN(target)) {
        contribEl.textContent = '0';
        animateCounter(contribEl, target, 2200);
      }
    }

    // Animate streak
    const streakEl = document.getElementById('currentStreak');
    if (streakEl) {
      const target = parseInt(streakEl.textContent);
      if (!isNaN(target)) {
        streakEl.textContent = '0';
        animateCounter(streakEl, target, 1200);
      }
    }
  }

  // ============================================================
  // 12. SCROLL-BASED ANIMATIONS
  // ============================================================
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.card, .stat-card, .repo-item, .mr-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ============================================================
  // 13. SEARCH BAR INTERACTION
  // ============================================================
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchInput.parentElement.classList.add('focused');
    });

    searchInput.addEventListener('blur', () => {
      searchInput.parentElement.classList.remove('focused');
    });

    // Keyboard shortcut for search (Ctrl/Cmd + K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }

      // Escape to close panels
      if (e.key === 'Escape') {
        if (notificationsOpen) closeNotificationPanel();
        if (mobileMenuOpen) closeMobileSidebar();
        searchInput.blur();
      }
    });
  }

  // ============================================================
  // 14. LIVE CLOCK / TIME UPDATES
  // ============================================================
  function updateRelativeTimes() {
    document.querySelectorAll('.mr-time, .activity-time, .notification-time, .diff-commit-time').forEach(el => {
      const originalText = el.getAttribute('data-original') || el.textContent;
      el.setAttribute('data-original', originalText);
      // We keep the original text since these are relative times
      // In a real app, you'd calculate from timestamps
    });
  }

  // ============================================================
  // 15. DYNAMIC CANVAS RESIZE HANDLER
  // ============================================================
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      drawCommitGraph(currentGraphPeriod);
    }, 250);
  });

  // ============================================================
  // 16. TOPBAR SCROLL BEHAVIOR
  // ============================================================
  let lastScrollY = 0;
  const topbar = document.querySelector('.topbar');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      topbar.style.transform = 'translateY(-100%)';
    } else {
      topbar.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
    topbar.style.transition = 'transform 0.3s ease';
  }, { passive: true });

  // ============================================================
  // 17. CLICK OUTSIDE TO CLOSE PANELS
  // ============================================================
  document.addEventListener('click', (e) => {
    // Close notification panel if clicking outside
    if (notificationsOpen && !notificationPanel.contains(e.target) && !notificationsBtn.contains(e.target)) {
      closeNotificationPanel();
    }
  });

  // ============================================================
  // 18. TOOLTIP / POPOVER SUPPORT
  // ============================================================
  function setupTooltips() {
    document.querySelectorAll('[aria-label]').forEach(el => {
      if (el.title) return; // Skip if native tooltip exists

      const label = el.getAttribute('aria-label');
      el.setAttribute('title', label);
    });
  }

  // ============================================================
  // 19. REPOSITORY ACTIVITY BAR ANIMATION ON SCROLL
  // ============================================================
  function setupActivityBarAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = entry.target.querySelectorAll('.activity-segment');
          bars.forEach((bar, i) => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = width;
            }, i * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.repo-item').forEach(item => observer.observe(item));
  }

  // ============================================================
  // 20. MINI COMMIT HOVER EFFECT
  // ============================================================
  function setupMiniCommits() {
    document.querySelectorAll('.mini-commit').forEach(commit => {
      commit.addEventListener('mouseenter', function () {
        this.style.borderLeftColor = 'var(--accent-blue)';
        this.style.paddingLeft = '12px';
      });

      commit.addEventListener('mouseleave', function () {
        this.style.borderLeftColor = '';
        this.style.paddingLeft = '';
      });
    });
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  function init() {
    console.log('%cForgeSync', 'font-family: "Space Grotesk", sans-serif; font-size: 24px; color: #6366f1; font-weight: 800;');
    console.log('%c  Source Code Management & Collaboration', 'font-family: "Inter", sans-serif; font-size: 12px; color: #8892a8;');

    initGraph();
    initFileTree();
    animateStats();
    setupScrollAnimations();
    setupActivityBarAnimations();
    setupMiniCommits();
    setupTooltips();

    // Initial relative time update
    updateRelativeTimes();

    // Update relative times every 60 seconds
    setInterval(updateRelativeTimes, 60000);
  }

  // Wait for DOM and fonts to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Use requestAnimationFrame to ensure layout is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(init);
    });
  }

  // ============================================================
  // EXPOSE API FOR DEBUGGING
  // ============================================================
  window.ForgeSync = {
    toggleSidebar,
    openNotificationPanel,
    closeNotificationPanel,
    drawCommitGraph,
    refreshGraph: () => drawCommitGraph(currentGraphPeriod),
    setGraphPeriod: (period) => {
      const btn = document.querySelector(`.graph-period[data-period="${period}"]`);
      if (btn) btn.click();
    },
    loadNextDiff: () => loadDiffBtn.click(),
    state: {
      get sidebarCollapsed() { return sidebarCollapsed; },
      get notificationsOpen() { return notificationsOpen; },
      get currentGraphPeriod() { return currentGraphPeriod; },
    }
  };

})();