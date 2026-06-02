/*
 *  NOIR CASE FILE · JAVASCRIPT ENGINE
 *  – typewriter reveal for notes & statements
 *  – rain overlay dynamic droplets
 *  – pushpin hover accents on corkboard
 *  – evidence board subtle interaction
 */

(function () {
  "use strict";

  // ============================================================
  //  1. TYPEWRITER EFFECT (for .typewriter-note elements)
  // ============================================================
  const typewriterElements = document.querySelectorAll(".typewriter-note");

  typewriterElements.forEach((el, index) => {
    const rawText = el.getAttribute("data-text") || el.textContent;
    const delay = parseInt(el.getAttribute("data-delay"), 10) || 0;
    let speed = 30; // ms per character

    // clear element, store original text
    el.textContent = "";
    el.dataset.originalText = rawText;
    el.dataset.typed = "false";

    // observe intersection to trigger typing
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && el.dataset.typed === "false") {
            el.dataset.typed = "true";
            setTimeout(() => typeText(el, rawText, speed), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
  });

  function typeText(element, text, speed) {
    let index = 0;
    element.textContent = "";

    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed + Math.random() * 40);
      }
    }
    type();
  }

  // also handle the case-number typewriter manually
  const caseNumberElement = document.querySelector(".case-number .typewriter");
  if (caseNumberElement) {
    const originalText = caseNumberElement.getAttribute("data-text") || caseNumberElement.textContent;
    caseNumberElement.textContent = "";
    let idx = 0;
    const typeCase = () => {
      if (idx < originalText.length) {
        caseNumberElement.textContent += originalText.charAt(idx);
        idx++;
        setTimeout(typeCase, 60 + Math.random() * 50);
      }
    };
    setTimeout(typeCase, 400);
  }

  // ============================================================
  //  2. RAIN OVERLAY – dynamic droplets (CSS assisted)
  // ============================================================
  const rainContainer = document.querySelector(".rain-layer");
  if (!rainContainer) {
    // fallback: if .rain-layer doesn't exist, create it inside .venetian-overlay or body
    const fallbackRain = document.createElement("div");
    fallbackRain.className = "rain-layer";
    fallbackRain.setAttribute("aria-hidden", "true");
    document.querySelector(".venetian-overlay")?.appendChild(fallbackRain) ||
      document.body.appendChild(fallbackRain);
  }

  // add animated rain streaks via JS-generated divs (lightweight)
  (function createRainDrops() {
    const container = document.querySelector(".rain-layer") || document.body;
    const fragment = document.createDocumentFragment();
    const dropCount = 60;

    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement("div");
      drop.className = "rain-drop";
      const left = Math.random() * 100;
      const delay = Math.random() * 4;
      const duration = 0.8 + Math.random() * 0.8;
      const opacity = 0.08 + Math.random() * 0.12;
      const height = 40 + Math.random() * 80;

      drop.style.cssText = `
        position: absolute;
        top: -${height}px;
        left: ${left}%;
        width: 1px;
        height: ${height}px;
        background: linear-gradient(to bottom, transparent, rgba(255,255,255,${opacity}));
        animation: rainDrop ${duration}s linear ${delay}s infinite;
        pointer-events: none;
        z-index: 0;
      `;
      fragment.appendChild(drop);
    }
    container.appendChild(fragment);
  })();

  // inject rain keyframes if not already present
  (function ensureRainKeyframes() {
    if (!document.getElementById("rain-keyframes-style")) {
      const style = document.createElement("style");
      style.id = "rain-keyframes-style";
      style.textContent = `
        @keyframes rainDrop {
          0% { transform: translateY(-10vh) rotate(5deg); }
          100% { transform: translateY(110vh) rotate(5deg); }
        }
        .rain-layer div {
          animation: rainDrop 1.2s linear infinite;
        }
      `;
      document.head.appendChild(style);
    }
  })();

  // ============================================================
  //  3. CORKBOARD PUSHPIN INTERACTION (gentle hover)
  // ============================================================
  const corkboard = document.querySelector(".corkboard-section");
  if (corkboard) {
    const pins = corkboard.querySelectorAll(".pin-label, .note-clip, .photo-placeholder");
    pins.forEach((el) => {
      el.addEventListener("mouseenter", function () {
        this.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
        this.style.transform = "scale(1.02)";
        this.style.boxShadow = "0 0 12px rgba(182,43,43,0.3)";
      });
      el.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)";
        this.style.boxShadow = "none";
      });
    });
  }

  // ============================================================
  //  4. EVIDENCE BOARD – subtle hover effect for photo cards
  // ============================================================
  const photoCards = document.querySelectorAll(".photo-card");
  photoCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.borderColor = "var(--accent-red)";
      this.style.transition = "border-color 0.2s";
    });
    card.addEventListener("mouseleave", function () {
      this.style.borderColor = "#222";
    });
  });

  // ============================================================
  //  5. SUSPECT CARD – interactive pushpin glow
  // ============================================================
  const suspectCards = document.querySelectorAll(".suspect-card");
  suspectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const pin = this.querySelector(".status-pin");
      if (pin) pin.style.boxShadow = "0 0 12px var(--accent-red)";
    });
    card.addEventListener("mouseleave", function () {
      const pin = this.querySelector(".status-pin");
      if (pin) pin.style.boxShadow = "none";
    });
  });

  // ============================================================
  //  6. WINDOW RESIZE – keep rain container full view
  // ============================================================
  const updateRainSize = () => {
    const rain = document.querySelector(".rain-layer");
    if (rain) {
      rain.style.width = "100vw";
      rain.style.height = "100vh";
    }
  };
  window.addEventListener("resize", updateRainSize);
  updateRainSize();

  // ============================================================
  //  7. EXTRA: subtle parallax on corkboard (desktop only)
  // ============================================================
  const corkboardSection = document.querySelector(".corkboard-section");
  if (corkboardSection && window.innerWidth > 768) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      corkboardSection.style.transform = `translate(${x}px, ${y}px)`;
      corkboardSection.style.transition = "transform 0.2s ease-out";
    });
  }

  // ============================================================
  //  7. (BONUS) typewriter effect for statements if needed
  // ============================================================
  document.querySelectorAll(".typewriter-note").forEach((el) => {
    const original = el.textContent;
    if (original && !el.dataset.typed) {
      el.dataset.typed = "true";
      const speed = parseInt(el.getAttribute("data-delay"), 10) || 40;
      el.textContent = "";
      let i = 0;
      const timer = setInterval(() => {
        if (i < original.length) {
          el.textContent += original.charAt(i);
          i++;
        } else {
          clearInterval(timer);
        }
      }, speed);
    }
  });

  // ============================================================
  //  8. ADD FALLBACK FOR MISSING PHOTO PLACEHOLDERS
  // ============================================================
  document.querySelectorAll(".photo-img").forEach((el) => {
    if (!el.textContent.trim()) {
      // subtle noise overlay via pseudo is fine, do nothing
    }
  });

  // ============================================================
  //  9. small fix: ensure .rain-layer uses correct animation name
  // ============================================================
  document.querySelectorAll(".rain-layer div").forEach((drop) => {
    drop.style.animationName = "rainDrop";
  });

  // ============================================================
  //  10. final: set a subtle watermark / case file stamp (optional)
  // ============================================================
  const footer = document.createElement("div");
  footer.style.textAlign = "center";
  footer.style.marginTop = "2rem";
  footer.style.fontSize = "0.6rem";
  footer.style.color = "#333";
  footer.style.letterSpacing = "2px";
  footer.textContent = "• CONFIDENTIAL • EVIDENCE •";
  document.querySelector(".case-notes-section")?.after(footer);

  console.log("Noir case file loaded · every clue tells a story.");
})();