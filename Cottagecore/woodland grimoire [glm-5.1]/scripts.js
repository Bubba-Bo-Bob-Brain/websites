const CauldronLoader = {
  loader: null,
  minDisplayTime: 2200,
  startTime: null,

  init() {
    this.loader = document.getElementById("cauldron-loader");
    if (!this.loader) return;
    this.startTime = Date.now();
    window.addEventListener("load", () => this.attemptHide());
  },

  attemptHide() {
    const elapsed = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minDisplayTime - elapsed);
    setTimeout(() => this.hide(), remainingTime);
  },

  hide() {
    if (!this.loader) return;
    this.loader.classList.add("hidden");
    setTimeout(() => {
      if (this.loader.parentNode) {
        this.loader.parentNode.removeChild(this.loader);
      }
    }, 900);
    document.body.style.overflow = "";
  }
};

const BotanicalParticles = {
  container: null,
  particleSymbols: ["❧", "❦", "✿", "❀", "✾", "☘", "🍀", "🌿", "🍃", "✿"],
  maxParticles: 18,
  spawnInterval: 2800,
  timer: null,

  init() {
    this.container = document.getElementById("botanical-particles");
    if (!this.container) return;
    this.startSpawning();
  },

  startSpawning() {
    this.spawnParticle();
    this.timer = setInterval(() => {
      if (this.container.childElementCount < this.maxParticles) {
        this.spawnParticle();
      }
    }, this.spawnInterval);
  },

  spawnParticle() {
    const particle = document.createElement("span");
    particle.classList.add("botanical-particle");
    particle.textContent = this.particleSymbols[Math.floor(Math.random() * this.particleSymbols.length)];
    particle.style.left = Math.random() * 100 + "%";
    particle.style.fontSize = (0.8 + Math.random() * 0.8) + "rem";
    const duration = 12 + Math.random() * 14;
    particle.style.animationDuration = duration + "s";
    particle.style.animationDelay = Math.random() * 2 + "s";
    this.container.appendChild(particle);
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, (duration + 3) * 1000);
  },

  destroy() {
    if (this.timer) clearInterval(this.timer);
  }
};

const NightMode = {
  toggle: null,
  storageKey: "herbarium-night-mode",

  init() {
    this.toggle = document.getElementById("night-toggle");
    if (!this.toggle) return;
    const savedMode = localStorage.getItem(this.storageKey);
    if (savedMode === "night") {
      this.setMode("night", false);
    }
    this.toggle.addEventListener("click", () => this.toggleMode());
  },

  toggleMode() {
    const currentMode = document.documentElement.getAttribute("data-mode") || "day";
    const newMode = currentMode === "day" ? "night" : "day";
    this.setMode(newMode, true);
  },

  setMode(mode, animate) {
    document.documentElement.setAttribute("data-mode", mode);
    if (animate) {
      document.body.style.transition = "background-color 0.8s ease, color 0.8s ease";
      setTimeout(() => {
        document.body.style.transition = "";
      }, 900);
    }
    try {
      localStorage.setItem(this.storageKey, mode);
    } catch (e) {}
    this.updateToggleLabel(mode);
  },

  updateToggleLabel(mode) {
    const label = this.toggle ? this.toggle.querySelector(".toggle-label") : null;
    if (label) {
      label.textContent = mode === "night" ? "Day Mode" : "Night Mode";
    }
  }
};

const BookNavigation = {
  nav: null,
  links: null,
  chapters: null,
  waxSeal: null,
  isVisible: false,

  init() {
    this.nav = document.querySelector(".book-nav");
    if (!this.nav) return;
    this.links = this.nav.querySelectorAll(".nav-link");
    this.chapters = document.querySelectorAll(".chapter");
    this.waxSeal = this.nav.querySelector(".nav-wax-seal");

    if (this.waxSeal) {
      this.waxSeal.addEventListener("click", (e) => {
        e.stopPropagation();
        this.nav.classList.toggle("nav-visible");
        this.isVisible = !this.isVisible;
      });
    }

    document.addEventListener("click", (e) => {
      if (this.isVisible && !this.nav.contains(e.target)) {
        this.nav.classList.remove("nav-visible");
        this.isVisible = false;
      }
    });

    this.links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
        this.nav.classList.remove("nav-visible");
        this.isVisible = false;
      });
    });

    window.addEventListener("scroll", () => this.updateActiveLink(), { passive: true });
    this.updateActiveLink();
  },

  updateActiveLink() {
    let currentChapterId = "";
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    this.chapters.forEach(chapter => {
      if (chapter.offsetTop <= scrollPos) {
        currentChapterId = chapter.id;
      }
    });

    this.links.forEach(link => {
      const href = link.getAttribute("href").substring(1);
      if (href === currentChapterId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
};

const ScrollReveal = {
  elements: null,
  observer: null,

  init() {
    this.elements = document.querySelectorAll(
      ".potion-card, .flower-specimen, .remedy-note, .chapter-header, .wheel-container"
    );

    this.elements.forEach(el => {
      el.classList.add("chapter-reveal");
    });

    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      this.elements.forEach(el => {
        this.observer.observe(el);
      });
    } else {
      this.elements.forEach(el => {
        el.classList.add("revealed");
      });
    }
  }
};

const ForagingTooltip = {
  tooltip: null,
  currentTarget: null,
  hideTimeout: null,

  init() {
    this.tooltip = document.getElementById("forage-tooltip");
    if (!this.tooltip) return;

    const forageItems = document.querySelectorAll(".forage-item");
    forageItems.forEach(item => {
      item.addEventListener("mouseenter", (e) => this.show(e));
      item.addEventListener("mouseleave", () => this.scheduleHide());
      item.addEventListener("focus", (e) => this.show(e));
      item.addEventListener("blur", () => this.scheduleHide());
    });
  },

  show(e) {
    clearTimeout(this.hideTimeout);
    const target = e.currentTarget;
    this.currentTarget = target;
    const tipText = target.getAttribute("data-tip");
    if (!tipText) return;

    this.tooltip.textContent = tipText;
    this.tooltip.classList.add("visible");

    requestAnimationFrame(() => {
      this.position(target);
    });
  },

  position(target) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + 8;

    if (left + tooltipRect.width > window.innerWidth - 12) {
      left = window.innerWidth - tooltipRect.width - 12;
    }
    if (left < 12) {
      left = 12;
    }
    if (top + tooltipRect.height > window.innerHeight - 12) {
      top = rect.top - tooltipRect.height - 8;
    }

    this.tooltip.style.left = left + "px";
    this.tooltip.style.top = top + "px";
  },

  scheduleHide() {
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 150);
  },

  hide() {
    this.tooltip.classList.remove("visible");
    this.currentTarget = null;
  }
};

const PotionCards = {
  init() {
    const cards = document.querySelectorAll(".potion-card");
    cards.forEach(card => {
      card.addEventListener("mouseenter", () => {
        const liquid = card.querySelector(".potion-liquid");
        if (liquid) {
          liquid.style.transition = "height 0.6s ease";
          liquid.style.height = "85%";
        }
      });
      card.addEventListener("mouseleave", () => {
        const liquid = card.querySelector(".potion-liquid");
        if (liquid) {
          liquid.style.height = "75%";
        }
      });
    });
  }
};

const SeasonWheel = {
  wheel: null,
  center: null,
  isDragging: false,
  startAngle: 0,
  currentRotation: 0,

  init() {
    this.wheel = document.getElementById("seasonalWheel");
    this.center = this.wheel ? this.wheel.querySelector(".wheel-center") : null;

    if (this.center) {
      this.center.addEventListener("click", () => {
        this.currentRotation += 90;
        this.wheel.style.transition = "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        this.wheel.style.transform = "rotate(" + this.currentRotation + "deg)";
        setTimeout(() => {
          this.wheel.style.transition = "";
        }, 850);
      });
    }
  }
};

const CoverPage = {
  init() {
    const coverEnter = document.querySelector(".cover-enter");
    if (coverEnter) {
      coverEnter.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById("potions");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    const coverSeal = document.querySelector(".cover-wax-seal");
    if (coverSeal) {
      coverSeal.style.cursor = "pointer";
      coverSeal.addEventListener("click", () => {
        coverSeal.style.transition = "transform 0.3s ease";
        coverSeal.style.transform = "scale(1.2) rotate(10deg)";
        setTimeout(() => {
          coverSeal.style.transform = "scale(1) rotate(0deg)";
        }, 400);
      });
    }
  }
};

const ParallaxDepth = {
  ticking: false,

  init() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.addEventListener("scroll", () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.onScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  },

  onScroll() {
    const scrollY = window.scrollY;
    const border = document.querySelector(".pressed-flower-border");
    if (border) {
      border.style.transform = "translateY(" + (scrollY * 0.02) + "px)";
    }
  }
};

const InkStainRandomizer = {
  init() {
    const stains = document.querySelectorAll(".specimen-ink-stain, .note-stain");
    stains.forEach(stain => {
      const offsetX = (Math.random() - 0.5) * 16;
      const offsetY = (Math.random() - 0.5) * 10;
      stain.style.transform = "translate(" + offsetX + "px, " + offsetY + "px)";
      const size = 8 + Math.random() * 16;
      stain.style.width = size + "px";
      stain.style.height = size + "px";
      const opacity = 0.06 + Math.random() * 0.1;
      stain.style.opacity = opacity;
    });
  }
};

const SmoothAnchorLinks = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      if (anchor.closest(".book-nav")) return;
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }
};

const NightModeCandleGlow = {
  init() {
    const isNight = document.documentElement.getAttribute("data-mode") === "night";
    if (isNight) {
      this.addGlow();
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === "data-mode") {
          const mode = document.documentElement.getAttribute("data-mode");
          if (mode === "night") {
            this.addGlow();
          } else {
            this.removeGlow();
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"]
    });
  },

  addGlow() {
    if (!document.getElementById("night-candle-glow")) {
      const glow = document.createElement("div");
      glow.id = "night-candle-glow";
      glow.style.cssText = "position:fixed;top:0;right:0;width:300px;height:300px;" +
        "background:radial-gradient(circle at 80% 10%, rgba(240,192,64,0.06), transparent 60%);" +
        "pointer-events:none;z-index:3;transition:opacity 0.8s ease;";
      document.body.appendChild(glow);
    }
  },

  removeGlow() {
    const glow = document.getElementById("night-candle-glow");
    if (glow) {
      glow.style.opacity = "0";
      setTimeout(() => {
        if (glow.parentNode) glow.parentNode.removeChild(glow);
      }, 900);
    }
  }
};

const RemedyNoteInteractivity = {
  init() {
    const notes = document.querySelectorAll(".remedy-note");
    notes.forEach(note => {
      note.addEventListener("mouseenter", () => {
        note.style.zIndex = "10";
      });
      note.addEventListener("mouseleave", () => {
        note.style.zIndex = "";
      });

      note.setAttribute("tabindex", "0");
      note.addEventListener("focus", () => {
        note.style.zIndex = "10";
        note.querySelector(".note-paper").style.boxShadow = "var(--card-shadow-hover)";
      });
      note.addEventListener("blur", () => {
        note.style.zIndex = "";
        const paper = note.querySelector(".note-paper");
        if (paper) paper.style.boxShadow = "";
      });
    });
  }
};

const FlowerSpecimenZoom = {
  overlay: null,

  init() {
    const specimens = document.querySelectorAll(".specimen-frame");
    specimens.forEach(frame => {
      frame.style.cursor = "zoom-in";
      frame.addEventListener("click", () => {
        this.zoomSpecimen(frame);
      });
    });
  },

  zoomSpecimen(frame) {
    if (!this.overlay) {
      this.overlay = document.createElement("div");
      this.overlay.style.cssText =
        "position:fixed;inset:0;z-index:500;background:rgba(0,0,0,0.6);" +
        "display:flex;align-items:center;justify-content:center;" +
        "cursor:zoom-out;opacity:0;transition:opacity 0.4s ease;backdrop-filter:blur(4px);";
      document.body.appendChild(this.overlay);

      this.overlay.addEventListener("click", () => {
        this.closeZoom();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.overlay.style.opacity === "1") {
          this.closeZoom();
        }
      });
    }

    const clone = frame.cloneNode(true);
    clone.style.cssText =
      "width:70vw;max-width:500px;height:50vh;max-height:400px;" +
      "border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.4);" +
      "transform:scale(0.9);transition:transform 0.4s ease;";

    this.overlay.innerHTML = "";
    this.overlay.appendChild(clone);
    this.overlay.style.display = "flex";

    requestAnimationFrame(() => {
      this.overlay.style.opacity = "1";
      clone.style.transform = "scale(1)";
    });
  },

  closeZoom() {
    if (this.overlay) {
      this.overlay.style.opacity = "0";
      setTimeout(() => {
        this.overlay.style.display = "none";
      }, 400);
    }
  }
};

const App = {
  init() {
    document.body.style.overflow = "hidden";
    CauldronLoader.init();
    BotanicalParticles.init();
    NightMode.init();
    BookNavigation.init();
    ScrollReveal.init();
    ForagingTooltip.init();
    PotionCards.init();
    SeasonWheel.init();
    CoverPage.init();
    ParallaxDepth.init();
    InkStainRandomizer.init();
    SmoothAnchorLinks.init();
    NightModeCandleGlow.init();
    RemedyNoteInteractivity.init();
    FlowerSpecimenZoom.init();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});