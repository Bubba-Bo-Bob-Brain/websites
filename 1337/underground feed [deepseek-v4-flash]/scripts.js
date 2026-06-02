/**
 * scripts.js — NEØN NEXUS: underground social feed
 * decryption reveals, trace warning popup, reputation dynamics
 */

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const decryptButtons = document.querySelectorAll('.btn-decrypt');
  const traceModalOverlay = document.querySelector('.trace-modal-overlay');
  const traceModalClose = document.getElementById('traceModalClose');
  const threatIndicator = document.querySelector('.threat-indicator');
  const threatValue = threatIndicator?.querySelector('.threat-value');
  const repBarFill = document.querySelector('.rep-bar-fill');
  const repStat = document.querySelector('.rep-stat');

  // ---------- utility: random threat level rotation ----------
  const threatLevels = [
    { label: 'ELEVATED · 4', class: 'elevated' },
    { label: 'HIGH · 5', class: 'high' },
    { label: 'CRITICAL · 6', class: 'critical' },
    { label: 'MODERATE · 3', class: 'moderate' },
  ];
  let threatIndex = 0;

  function rotateThreat() {
    if (!threatIndicator || !threatValue) return;
    threatIndex = (threatIndex + 1) % threatLevels.length;
    const next = threatLevels[threatIndex];
    threatValue.textContent = next.label;
    threatIndicator.dataset.threat = next.class;

    // change pulse color based on level
    const pulse = threatIndicator.querySelector('.threat-pulse');
    if (pulse) {
      if (next.class === 'critical') {
        pulse.style.background = 'var(--accent-red)';
        pulse.style.boxShadow = '0 0 16px var(--accent-red)';
      } else if (next.class === 'high') {
        pulse.style.background = 'var(--accent-amber)';
        pulse.style.boxShadow = '0 0 12px var(--accent-amber)';
      } else if (next.class === 'elevated') {
        pulse.style.background = 'var(--accent-amber)';
        pulse.style.boxShadow = '0 0 12px var(--accent-amber)';
      } else {
        pulse.style.background = '#f7e05e';
        pulse.style.boxShadow = '0 0 10px #f7e05e';
      }
    }
  }

  // rotate threat every 12 seconds
  setInterval(rotateThreat, 12000);

  // ---------- decrypt toggle (per card) ----------
  function handleDecrypt(button) {
    const card = button.closest('.feed-card');
    if (!card) return;

    const encryptedPreview = card.querySelector('.encrypted-preview');
    const decryptedContent = card.querySelector('.decrypted-content');

    if (!encryptedPreview || !decryptedContent) return;

    const isHidden = decryptedContent.hasAttribute('hidden');
    if (isHidden) {
      // reveal decrypted content
      decryptedContent.removeAttribute('hidden');
      encryptedPreview.style.opacity = '0.3';
      button.textContent = '🔒 encrypt';
      // glitch effect on reveal
      card.style.borderColor = 'var(--accent-green)';
      card.style.boxShadow = '0 0 20px rgba(0, 255, 157, 0.2)';

      // update reputation badge simulation (small visual reward)
      const repBadge = card.querySelector('.reputation-badge');
      if (repBadge) {
        const currentRep = parseInt(repBadge.dataset.rep, 10);
        if (!isNaN(currentRep) && currentRep < 99) {
          const newRep = Math.min(99, currentRep + 1);
          repBadge.dataset.rep = newRep;
          repBadge.innerHTML = `🛡️ rep ${newRep}`;
          // update global rep bar
          updateGlobalRep();
        }
      }
    } else {
      // hide decrypted content
      decryptedContent.setAttribute('hidden', '');
      encryptedPreview.style.opacity = '1';
      button.textContent = '🔓 decrypt';
      card.style.borderColor = 'var(--accent-cyan)';
      card.style.boxShadow = 'none';
    }
  }

  // ---------- update global reputation bar ----------
  function updateGlobalRep() {
    const repBadges = document.querySelectorAll('.reputation-badge');
    let total = 0;
    let count = 0;
    repBadges.forEach((badge) => {
      const val = parseInt(badge.dataset.rep, 10);
      if (!isNaN(val)) {
        total += val;
        count++;
      }
    });
    if (count === 0) return;
    const avg = Math.round(total / count);
    if (repBarFill) {
      repBarFill.style.width = avg + '%';
    }
    if (repStat) {
      repStat.textContent = `avg ${avg} · top ${avg > 90 ? '0.5' : avg > 75 ? '1' : '5'}%`;
    }
  }

  // ---------- attach decrypt listeners ----------
  decryptButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      handleDecrypt(this);
    });
  });

  // ---------- trace modal logic ----------
  // show modal when clicking on a trace warning (or via data-trace attribute)
  function showTraceModal() {
    if (!traceModalOverlay) return;
    traceModalOverlay.removeAttribute('hidden');
    traceModalOverlay.removeAttribute('aria-hidden');
    // add glitch effect to body
    document.body.style.animation = 'glitchBody 0.1s infinite';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 600);
  }

  function hideTraceModal() {
    if (!traceModalOverlay) return;
    traceModalOverlay.setAttribute('hidden', '');
    traceModalOverlay.setAttribute('aria-hidden', 'true');
  }

  // attach to trace warnings inside cards
  const traceWarnings = document.querySelectorAll('.trace-warning');
  traceWarnings.forEach((warning) => {
    warning.addEventListener('click', function (e) {
      e.stopPropagation();
      showTraceModal();
    });
  });

  // also trigger modal from card with data-trace="detected" via a small overlay button?
  // we add a subtle click on the trace chip in the footer
  const traceChips = document.querySelectorAll('.threat-chip');
  traceChips.forEach((chip) => {
    if (chip.textContent.toLowerCase().includes('extreme') || chip.textContent.toLowerCase().includes('critical')) {
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        showTraceModal();
      });
    }
  });

  // close modal
  if (traceModalClose) {
    traceModalClose.addEventListener('click', hideTraceModal);
  }

  // close on overlay click (outside modal)
  if (traceModalOverlay) {
    traceModalOverlay.addEventListener('click', function (e) {
      if (e.target === this) {
        hideTraceModal();
      }
    });
  }

  // escape key closes modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && traceModalOverlay && !traceModalOverlay.hasAttribute('hidden')) {
      hideTraceModal();
    }
  });

  // ---------- hover decrypt (inline preview) ----------
  const decryptHovers = document.querySelectorAll('.decrypt-hover');
  decryptHovers.forEach((el) => {
    el.addEventListener('mouseenter', function () {
      const card = this.closest('.feed-card');
      if (!card) return;
      const decrypted = card.querySelector('.decrypted-content');
      if (decrypted && decrypted.hasAttribute('hidden')) {
        // show a temporary glimpse (only if not already decrypted)
        decrypted.removeAttribute('hidden');
        this.textContent = '[decrypted]';
        this.style.color = 'var(--accent-green)';
      }
    });
    el.addEventListener('mouseleave', function () {
      const card = this.closest('.feed-card');
      if (!card) return;
      const decrypted = card.querySelector('.decrypted-content');
      // only hide if the decrypt button hasn't been toggled
      const btn = card.querySelector('.btn-decrypt');
      if (btn && btn.textContent.includes('encrypt')) {
        // already permanently decrypted — leave visible
        return;
      }
      if (decrypted && !decrypted.hasAttribute('hidden')) {
        decrypted.setAttribute('hidden', '');
        this.textContent = '[hover to decrypt]';
        this.style.color = 'var(--accent-pink)';
      }
    });
  });

  // ---------- reputation badge hover effect (hologram pulse) ----------
  const repBadges = document.querySelectorAll('.reputation-badge');
  repBadges.forEach((badge) => {
    badge.addEventListener('mouseenter', function () {
      this.style.boxShadow = '0 0 20px var(--accent-green)';
      this.style.transition = 'box-shadow 0.15s';
    });
    badge.addEventListener('mouseleave', function () {
      this.style.boxShadow = 'none';
    });
  });

  // ---------- inline code copy (double-click) ----------
  const codeSnippets = document.querySelectorAll('.inline-code');
  codeSnippets.forEach((code) => {
    code.addEventListener('dblclick', function () {
      const text = this.textContent.trim();
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = this.textContent;
        this.textContent = '✓ copied';
        this.style.color = 'var(--accent-green)';
        setTimeout(() => {
          this.textContent = original;
          this.style.color = '';
        }, 1200);
      }).catch(() => {
        // fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.textContent = '✓ copied';
        this.style.color = 'var(--accent-green)';
        setTimeout(() => {
          this.textContent = original;
          this.style.color = '';
        }, 1200);
      });
    });
  });

  // ---------- initial global rep sync ----------
  updateGlobalRep();

  // ---------- extra: threat pulse color sync on load ----------
  rotateThreat();

  // ---------- trace modal auto-show after 45 seconds (ambient) ----------
  setTimeout(() => {
    // only if not already visible and if user hasn't interacted yet
    if (traceModalOverlay && traceModalOverlay.hasAttribute('hidden')) {
      // 30% chance to feel organic
      if (Math.random() < 0.3) {
        showTraceModal();
      }
    }
  }, 45000);

  // ---------- glitch body keyframe (injected for modal) ----------
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes glitchBody {
      0% { transform: translate(0); }
      20% { transform: translate(-1px, 1px); }
      40% { transform: translate(1px, -1px); }
      60% { transform: translate(-1px, -2px); }
      80% { transform: translate(1px, 2px); }
      100% { transform: translate(0); }
    }
  `;
  document.head.appendChild(styleSheet);

})();