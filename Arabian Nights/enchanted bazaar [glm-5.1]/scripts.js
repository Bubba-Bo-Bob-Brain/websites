const BazaarApp = (() => {

  const state = {
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    glowX: window.innerWidth / 2,
    glowY: window.innerHeight / 2,
    smokeParticles: [],
    rubProgress: new Map(),
    isTouchDevice: false,
    scrollObservers: []
  };

  function init() {
    detectTouch();
    initLanternGlow();
    initSmokeCanvas();
    initScrollAnimations();
    initCategoryFilter();
    initRubToReveal();
    initAddToSatchel();
    initPortalInteraction();
    initSmoothScroll();
    startAnimationLoop();
  }

  function detectTouch() {
    state.isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  function initLanternGlow() {
    const glow = document.getElementById("lantern-glow");
    if (!glow) return;

    if (state.isTouchDevice) {
      glow.style.display = "none";
      return;
    }

    document.addEventListener("mousemove", (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
    });

    document.addEventListener("mouseleave", () => {
      glow.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      glow.style.opacity = "1";
    });
  }

  function updateLanternGlow() {
    const glow = document.getElementById("lantern-glow");
    if (!glow || state.isTouchDevice) return;

    const ease = 0.08;
    state.glowX += (state.mouseX - state.glowX) * ease;
    state.glowY += (state.mouseY - state.glowY) * ease;

    glow.style.left = state.glowX + "px";
    glow.style.top = state.glowY + "px";
  }

  function initSmokeCanvas() {
    const canvas = document.getElementById("smoke-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let canvasWidth, canvasHeight;

    function resizeCanvas() {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", debounce(resizeCanvas, 200));

    const maxParticles = 40;
    const spawnRate = 0.03;

    function createSmokeParticle() {
      return {
        x: Math.random() * canvasWidth,
        y: canvasHeight + 20,
        size: Math.random() * 60 + 30,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -(Math.random() * 0.4 + 0.15),
        opacity: 0,
        maxOpacity: Math.random() * 0.08 + 0.02,
        life: 0,
        maxLife: Math.random() * 400 + 300,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.005 + 0.002,
        driftAmplitude: Math.random() * 0.5 + 0.2,
        hue: Math.random() > 0.7 ? 35 : 25,
        saturation: Math.random() * 30 + 40
      };
    }

    function updateSmokeParticles() {
      if (state.smokeParticles.length < maxParticles && Math.random() < spawnRate) {
        state.smokeParticles.push(createSmokeParticle());
      }

      for (let i = state.smokeParticles.length - 1; i >= 0; i--) {
        const p = state.smokeParticles[i];
        p.life++;

        p.drift += p.driftSpeed;
        p.x += p.speedX + Math.sin(p.drift) * p.driftAmplitude;
        p.y += p.speedY;
        p.size += 0.05;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.opacity = (lifeRatio / 0.15) * p.maxOpacity;
        } else if (lifeRatio > 0.6) {
          p.opacity = ((1 - lifeRatio) / 0.4) * p.maxOpacity;
        } else {
          p.opacity = p.maxOpacity;
        }

        if (p.life >= p.maxLife || p.y < -p.size) {
          state.smokeParticles.splice(i, 1);
        }
      }
    }

    function drawSmokeParticles() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (const p of state.smokeParticles) {
        if (p.opacity <= 0) continue;

        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size
        );

        const r = p.hue === 35 ? 210 : 190;
        const g = p.hue === 35 ? 160 : 140;
        const b = p.hue === 35 ? 60 : 50;

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.opacity})`);
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    state.drawSmoke = () => {
      updateSmokeParticles();
      drawSmokeParticles();
    };
  }

  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll(".product-card");
    cards.forEach((card, index) => {
      card.dataset.revealDelay = index * 100;
      observer.observe(card);
    });

    const merchants = document.querySelectorAll(".merchant-profile");
    merchants.forEach((merchant, index) => {
      merchant.dataset.revealDelay = index * 120;
      observer.observe(merchant);
    });

    const legends = document.querySelectorAll(".legend-card");
    legends.forEach((legend, index) => {
      legend.dataset.revealDelay = index * 150;
      observer.observe(legend);
    });

    state.scrollObservers.push(observer);
  }

  function initCategoryFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".product-card");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;

        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        cards.forEach((card) => {
          const cardCategory = card.dataset.category;
          const shouldShow = category === "all" || cardCategory === category;

          if (shouldShow) {
            card.style.display = "";
            card.style.opacity = "0";
            card.style.transform = "translateY(15px)";
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              });
            });
          } else {
            card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            card.style.opacity = "0";
            card.style.transform = "translateY(10px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  function initRubToReveal() {
    const overlays = document.querySelectorAll(".card-rub-overlay");

    overlays.forEach((overlay) => {
      const card = overlay.closest(".product-card");
      const cardId = getCardId(card);

      state.rubProgress.set(cardId, {
        accumulated: 0,
        threshold: 150,
        isRevealed: false,
        lastX: 0,
        lastY: 0,
        isTracking: false
      });

      overlay.addEventListener("mousedown", (e) => {
        const progress = state.rubProgress.get(cardId);
        if (progress.isRevealed) return;
        progress.isTracking = true;
        progress.lastX = e.clientX;
        progress.lastY = e.clientY;
        e.preventDefault();
      });

      overlay.addEventListener("mousemove", (e) => {
        const progress = state.rubProgress.get(cardId);
        if (!progress.isTracking || progress.isRevealed) return;

        const dx = e.clientX - progress.lastX;
        const dy = e.clientY - progress.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        progress.accumulated += distance;
        progress.lastX = e.clientX;
        progress.lastY = e.clientY;

        if (distance > 2) {
          createSparkles(overlay, e.offsetX, e.offsetY, 2);
        }

        const revealRatio = Math.min(progress.accumulated / progress.threshold, 1);
        overlay.style.opacity = 1 - revealRatio * 0.6;

        if (progress.accumulated >= progress.threshold) {
          revealCard(card, overlay, cardId);
        }
      });

      overlay.addEventListener("mouseup", () => {
        const progress = state.rubProgress.get(cardId);
        progress.isTracking = false;
      });

      overlay.addEventListener("mouseleave", () => {
        const progress = state.rubProgress.get(cardId);
        if (progress.isTracking && !progress.isRevealed) {
          progress.isTracking = false;
          overlay.style.opacity = "";
        }
      });

      overlay.addEventListener("touchstart", (e) => {
        const progress = state.rubProgress.get(cardId);
        if (progress.isRevealed) return;
        progress.isTracking = true;
        const touch = e.touches[0];
        const rect = overlay.getBoundingClientRect();
        progress.lastX = touch.clientX;
        progress.lastY = touch.clientY;
        e.preventDefault();
      }, { passive: false });

      overlay.addEventListener("touchmove", (e) => {
        const progress = state.rubProgress.get(cardId);
        if (!progress.isTracking || progress.isRevealed) return;

        const touch = e.touches[0];
        const rect = overlay.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;

        const dx = touch.clientX - progress.lastX;
        const dy = touch.clientY - progress.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        progress.accumulated += distance;
        progress.lastX = touch.clientX;
        progress.lastY = touch.clientY;

        if (distance > 2) {
          createSparkles(overlay, offsetX, offsetY, 2);
        }

        const revealRatio = Math.min(progress.accumulated / progress.threshold, 1);
        overlay.style.opacity = 1 - revealRatio * 0.6;

        if (progress.accumulated >= progress.threshold) {
          revealCard(card, overlay, cardId);
        }

        e.preventDefault();
      }, { passive: false });

      overlay.addEventListener("touchend", () => {
        const progress = state.rubProgress.get(cardId);
        progress.isTracking = false;
      });
    });
  }

  function getCardId(card) {
    const title = card.querySelector(".card-title");
    return title ? title.textContent.trim() : Math.random().toString();
  }

  function revealCard(card, overlay, cardId) {
    const progress = state.rubProgress.get(cardId);
    progress.isRevealed = true;
    progress.isTracking = false;

    const rect = overlay.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    createSparkles(overlay, centerX, centerY, 20);

    card.classList.add("revealed");
    overlay.style.opacity = "0";

    showToast("The enchantment fades... the wonder is revealed!");
  }

  function createSparkles(container, x, y, count) {
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement("div");
      sparkle.classList.add("sparkle-particle");

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 50 + 20;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      sparkle.style.left = x + "px";
      sparkle.style.top = y + "px";
      sparkle.style.setProperty("--tx", tx + "px");
      sparkle.style.setProperty("--ty", ty + "px");
      sparkle.style.animationDuration = (Math.random() * 0.4 + 0.4) + "s";

      const size = Math.random() * 4 + 2;
      sparkle.style.width = size + "px";
      sparkle.style.height = size + "px";

      container.appendChild(sparkle);

      sparkle.addEventListener("animationend", () => {
        sparkle.remove();
      });
    }
  }

  function initAddToSatchel() {
    const buttons = document.querySelectorAll(".card-add-btn");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("added")) {
          btn.classList.remove("added");
          const addIcon = btn.querySelector(".add-icon");
          const addText = btn.querySelector(".add-text");
          if (addIcon) addIcon.textContent = "\u271A";
          if (addText) addText.textContent = "Add to Satchel";
          showToast("Item removed from your satchel");
          return;
        }

        btn.classList.add("added");
        const addIcon = btn.querySelector(".add-icon");
        const addText = btn.querySelector(".add-text");
        if (addIcon) addIcon.textContent = "\u2713";
        if (addText) addText.textContent = "In Satchel";

        const card = btn.closest(".product-card");
        const title = card ? card.querySelector(".card-title") : null;
        const itemName = title ? title.textContent : "Item";

        showToast(`${itemName} added to your satchel!`);

        btn.style.transform = "scale(1.1)";
        setTimeout(() => {
          btn.style.transform = "";
        }, 200);
      });
    });
  }

  function initPortalInteraction() {
    const portal = document.querySelector(".visit-portal");
    if (!portal) return;

    portal.addEventListener("click", () => {
      const rings = portal.querySelectorAll(".portal-ring");
      rings.forEach((ring) => {
        ring.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
        ring.style.transform = "scale(1.5)";
        ring.style.opacity = "0";
      });

      const text = portal.querySelector(".portal-text");
      if (text) {
        text.style.transition = "opacity 0.3s ease";
        text.style.opacity = "0";
      }

      createPortalBurst(portal);

      showToast("The bazaar whispers... seek the crossroads at moonrise.");

      setTimeout(() => {
        rings.forEach((ring) => {
          ring.style.transition = "none";
          ring.style.transform = "";
          ring.style.opacity = "";
        });
        if (text) {
          text.style.transition = "none";
          text.style.opacity = "";
        }
        requestAnimationFrame(() => {
          rings.forEach((ring) => {
            ring.style.transition = "";
          });
        });
      }, 1500);
    });
  }

  function createPortalBurst(portal) {
    const rect = portal.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 16; i++) {
      const particle = document.createElement("div");
      particle.classList.add("sparkle-particle");
      particle.style.position = "fixed";
      particle.style.zIndex = "9999";

      const angle = (Math.PI * 2 * i) / 16;
      const distance = Math.random() * 60 + 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.left = centerX + "px";
      particle.style.top = centerY + "px";
      particle.style.setProperty("--tx", tx + "px");
      particle.style.setProperty("--ty", ty + "px");
      particle.style.animationDuration = (Math.random() * 0.5 + 0.5) + "s";

      const size = Math.random() * 5 + 3;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.background = Math.random() > 0.5
        ? "var(--gold-bright)"
        : "var(--amber-glow)";

      document.body.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove());
    }
  }

  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  }

  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-out");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, 3000);
  }

  function startAnimationLoop() {
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    function loop(timestamp) {
      requestAnimationFrame(loop);

      const delta = timestamp - lastTime;
      if (delta < frameInterval) return;
      lastTime = timestamp - (delta % frameInterval);

      updateLanternGlow();

      if (state.drawSmoke) {
        state.drawSmoke();
      }
    }

    requestAnimationFrame(loop);
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  document.addEventListener("DOMContentLoaded", init);

  return { init, showToast };
})();