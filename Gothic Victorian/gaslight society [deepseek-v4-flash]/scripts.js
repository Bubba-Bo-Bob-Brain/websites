// scripts.js - Ordo Noctis Aethelred: Sanctum Internum
// Gaslight flicker, invitation seal, grandfather clock, daguerreotype reveal

(function () {
  'use strict';

  // ------------------------------------------------------------
  // 1. GASLIGHT FLICKER (ambient glow variation)
  // ------------------------------------------------------------
  const gaslight = document.querySelector('.gaslight-glow');
  if (gaslight) {
    let flickerPhase = 0;
    function flickerGaslight() {
      flickerPhase += 0.015 + Math.random() * 0.03;
      const flicker = 0.75 + 0.25 * Math.sin(flickerPhase * 2.3) +
                      0.1 * Math.sin(flickerPhase * 7.1 + 1.2) +
                      0.05 * Math.sin(flickerPhase * 13.7);
      const intensity = Math.min(1, Math.max(0.4, flicker));
      const glowSize = 40 + 20 * intensity;
      gaslight.style.setProperty('--gaslight-intensity', intensity);
      gaslight.style.setProperty('--gaslight-size', glowSize + '%');
      requestAnimationFrame(flickerGaslight);
    }
    flickerGaslight();
  }

  // ------------------------------------------------------------
  // 2. GRANDFATHER CLOCK TICK (ambient sound simulation via DOM)
  // ------------------------------------------------------------
  const clockElement = document.querySelector('.clock-tick');
  if (clockElement) {
    let tickState = false;
    setInterval(() => {
      tickState = !tickState;
      clockElement.textContent = tickState ? '⏳' : '⌛';
      clockElement.style.opacity = 0.5 + (tickState ? 0.3 : 0);
    }, 900 + Math.random() * 200);
  }

  // ------------------------------------------------------------
  // 3. INVITATION ENVELOPE SEAL MECHANIC
  // ------------------------------------------------------------
  const envelope = document.getElementById('invitationEnvelope');
  const flap = document.getElementById('envelopeFlap');
  const waxSeal = document.getElementById('waxSealClose');
  let isOpen = false;

  window.openInvitation = function () {
    if (!envelope || !flap || !waxSeal) return;
    isOpen = !isOpen;
    if (isOpen) {
      flap.style.transform = 'rotateX(180deg) translateY(-10px)';
      flap.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      waxSeal.style.opacity = '0.3';
      waxSeal.style.transform = 'scale(0.9)';
      envelope.style.borderColor = '#b8863a';
      envelope.style.boxShadow = '0 0 30px rgba(180,130,60,0.3)';
      // subtle particle-like effect
      createSparks();
    } else {
      flap.style.transform = 'rotateX(0deg) translateY(0px)';
      flap.style.transition = 'transform 0.8s cubic-bezier(0.6, -0.05, 0.2, 1)';
      waxSeal.style.opacity = '1';
      waxSeal.style.transform = 'scale(1)';
      envelope.style.borderColor = '#5a3f2a';
      envelope.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5)';
    }
  };

  // sparkle effect on seal open
  function createSparks() {
    if (!envelope) return;
    for (let i = 0; i < 12; i++) {
      const spark = document.createElement('span');
      spark.textContent = '✦';
      spark.style.position = 'absolute';
      spark.style.fontSize = (0.6 + Math.random() * 1.2) + 'rem';
      spark.style.color = '#d4a853';
      spark.style.pointerEvents = 'none';
      spark.style.zIndex = '10';
      spark.style.opacity = '0';
      const rect = envelope.getBoundingClientRect();
      const x = rect.left + rect.width * (0.2 + 0.6 * Math.random());
      const y = rect.top + rect.height * (0.3 + 0.5 * Math.random());
      spark.style.left = (x - rect.left) + 'px';
      spark.style.top = (y - rect.top) + 'px';
      spark.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      envelope.appendChild(spark);
      requestAnimationFrame(() => {
        spark.style.opacity = '0.9';
        spark.style.transform = `translate(${-30 + 60 * Math.random()}px, ${-60 - 40 * Math.random()}px) scale(0.2)`;
      });
      setTimeout(() => {
        if (spark.parentNode) spark.parentNode.removeChild(spark);
      }, 1400);
    }
  }

  // ------------------------------------------------------------
  // 4. DAGUERREOTYPE PORTRAIT HOVER EFFECT (old photo reveal)
  // ------------------------------------------------------------
  const portraits = document.querySelectorAll('.portrait-frame');
  portraits.forEach(frame => {
    const overlay = frame.querySelector('.daguerreotype-overlay');
    const initial = frame.querySelector('.portrait-initial');
    if (!overlay || !initial) return;

    frame.addEventListener('mouseenter', () => {
      overlay.style.opacity = '0.4';
      overlay.style.mixBlendMode = 'multiply';
      initial.style.filter = 'sepia(0.8) contrast(1.4) brightness(0.9)';
      initial.style.transform = 'scale(1.05)';
      initial.style.transition = 'all 0.5s ease';
    });

    frame.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0.8';
      overlay.style.mixBlendMode = 'normal';
      initial.style.filter = 'none';
      initial.style.transform = 'scale(1)';
    });
  });

  // ------------------------------------------------------------
  // 5. SEANCE CARD AMBIENT GLOW ON HOVER
  // ------------------------------------------------------------
  const seanceCards = document.querySelectorAll('.seance-card');
  seanceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = '#b8863a';
      card.style.boxShadow = '0 0 25px rgba(180,130,60,0.2), inset 0 0 20px rgba(180,130,60,0.05)';
      card.style.transition = 'all 0.4s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '#5a3f2a';
      card.style.boxShadow = '0 0 15px rgba(60,30,10,0.4)';
    });
  });

  // ------------------------------------------------------------
  // 6. HIERARCHY RING INTERACTION (subtle expansion)
  // ------------------------------------------------------------
  const rings = document.querySelectorAll('.ring-card');
  rings.forEach(ring => {
    ring.addEventListener('mouseenter', () => {
      ring.style.borderColor = '#b8863a';
      ring.style.transform = 'scale(1.02)';
      ring.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    ring.addEventListener('mouseleave', () => {
      ring.style.borderColor = '#5a4030';
      ring.style.transform = 'scale(1)';
    });
  });

  // ------------------------------------------------------------
  // 7. MEMBER CARD SUBTLE PARALLAX ON MOUSE MOVE
  // ------------------------------------------------------------
  const memberCards = document.querySelectorAll('.member-card');
  memberCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      const rotateX = deltaY * -3;
      const rotateY = deltaX * 3;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 0.5s ease';
    });
  });

  // ------------------------------------------------------------
  // 8. ATMOSPHERIC GRAIN OVERLAY (subtle noise via CSS)
  // ------------------------------------------------------------
  const grain = document.querySelector('.grain-overlay');
  if (grain) {
    grain.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.06\'/%3E%3C/svg%3E")';
    grain.style.backgroundRepeat = 'repeat';
    grain.style.backgroundSize = '200px 200px';
    grain.style.opacity = '0.3';
    grain.style.mixBlendMode = 'overlay';
    grain.style.pointerEvents = 'none';
  }

  // ------------------------------------------------------------
  // 9. INITIALIZATION: SET CSS VARIABLES FOR GASLIGHT
  // ------------------------------------------------------------
  document.documentElement.style.setProperty('--gaslight-intensity', '0.8');
  document.documentElement.style.setProperty('--gaslight-size', '50%');

  // small ambient text flicker on certain headings
  const symbols = document.querySelectorAll('.section-symbol');
  symbols.forEach(sym => {
    sym.style.animation = 'flicker 4s infinite alternate';
  });

  // inject keyframe for symbol flicker
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes flicker {
      0% { opacity: 0.6; text-shadow: 0 0 4px #b8863a33; }
      50% { opacity: 0.9; text-shadow: 0 0 12px #b8863a66; }
      100% { opacity: 0.7; text-shadow: 0 0 6px #b8863a44; }
    }
    .clock-tick {
      position: fixed;
      bottom: 20px;
      right: 25px;
      font-size: 2rem;
      color: #b8863a;
      opacity: 0.3;
      transition: opacity 0.3s;
      pointer-events: none;
      z-index: 999;
      filter: drop-shadow(0 0 6px #b8863a44);
    }
    .gaslight-glow {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(ellipse at 50% 30%, rgba(255, 215, 140, var(--gaslight-intensity, 0.12)) 0%, transparent var(--gaslight-size, 50%));
      pointer-events: none;
      z-index: 1;
      mix-blend-mode: overlay;
    }
    .grain-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 2;
      opacity: 0.15;
    }
    main {
      position: relative;
      z-index: 3;
    }
  `;
  document.head.appendChild(styleSheet);

  // ------------------------------------------------------------
  // 10. WINDOW RESIZE: keep gaslight centered
  // ------------------------------------------------------------
  window.addEventListener('resize', () => {
    if (gaslight) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      gaslight.style.background = `radial-gradient(ellipse at 50% 30%, rgba(255, 215, 140, 0.12) 0%, transparent ${Math.min(w, h) * 0.5}px)`;
    }
  });

  console.log('☽ Ordo Noctis · Aethelred — sanctum initialized ☾');
})();