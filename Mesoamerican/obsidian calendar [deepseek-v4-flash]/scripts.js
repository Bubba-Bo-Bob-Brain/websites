/*
 * ceremonial calendar – obsidian & jade
 * glyph tooltip translation, eclipse countdown, sun‑stone rotation
 */
(function () {
  "use strict";

  // ------------------------------------------------------------------
  //  1.  ECLIPSE COUNTDOWN (simulated ceremonial cycle)
  // ------------------------------------------------------------------
  const eclipseTimer = document.querySelector('.eclipse-timer');
  if (eclipseTimer) {
    // store a fixed target: 13 days from page load, at dawn (8:00)
    const launch = new Date();
    const target = new Date(launch);
    target.setDate(target.getDate() + 13);
    target.setHours(8, 0, 0, 0);

    function pad(n) {
      return n < 10 ? '0' + n : '' + n;
    }

    function updateEclipse() {
      const now = new Date();
      let diff = target.getTime() - now.getTime();

      // if passed, show a ceremonial message
      if (diff <= 0) {
        eclipseTimer.textContent = '✦ THE ECLIPSE IS UPON US ✦';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      eclipseTimer.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }

    updateEclipse();
    setInterval(updateEclipse, 1000);
  }

  // ------------------------------------------------------------------
  //  GLYPH TOOLTIP SYSTEM  (for any element with data-glyph)
  // ------------------------------------------------------------------
  const glyphElements = document.querySelectorAll('[data-glyph]');
  let tooltip = null;

  function removeTooltip() {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }

  function showTooltip(e) {
    removeTooltip();
    const el = e.currentTarget;
    const text = el.getAttribute('data-glyph');
    if (!text) return;

    tooltip = document.createElement('div');
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      background: #1a1d17;
      color: #f0e6c5;
      border: 1px solid #b8860b;
      padding: 0.3rem 1rem;
      border-radius: 4px;
      font-family: 'Cinzel Decorative', serif;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      box-shadow: 0 4px 20px rgba(0,0,0,0.8);
      white-space: nowrap;
      transition: opacity 0.15s ease;
      opacity: 0;
    `;
    document.body.appendChild(tooltip);

    // position after append so we can measure width
    const rect = el.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    let top = rect.top - 36;
    // clamp to viewport
    if (left < 8) left = 8;
    if (left + tooltipWidth > window.innerWidth - 8) {
      left = window.innerWidth - tooltipWidth - 8;
    }
    if (top < 8) top = rect.bottom + 8;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    // trigger opacity transition
    requestAnimationFrame(() => { tooltip.style.opacity = '1'; });
  }

  glyphElements.forEach(el => {
    el.addEventListener('mouseenter', showTooltip);
    el.addEventListener('mouseleave', removeTooltip);
    el.addEventListener('focus', showTooltip);
    el.addEventListener('blur', removeTooltip);
  });

  // also clean up on scroll / resize
  window.addEventListener('scroll', removeTooltip, { passive: true });
  window.addEventListener('resize', removeTooltip);

  // ------------------------------------------------------------------
  //  SUN STONE ROTATION (glyphic resonance)
  // ------------------------------------------------------------------
  const sunStone = document.querySelector('.glyph-sun');
  if (sunStone) {
    let angle = 0;
    let animationFrame;
    function rotateSun() {
      angle = (angle + 0.1) % 360;
      sunStone.style.transform = `rotate(${angle}deg)`;
      animationFrame = requestAnimationFrame(rotateSun);
    }
    // start only if visible (reduce CPU)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationFrame) animationFrame = requestAnimationFrame(rotateSun);
        } else {
          if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
          }
        }
      });
    });
    observer.observe(sunStone);
  }

  // ------------------------------------------------------------------
  //  (Optional) footer year update – just for detail
  // ------------------------------------------------------------------
  const yearSpan = document.querySelector('.footer-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  console.log('✧ XIUHPOHUALLI: the calendar is awake ✧');
})();