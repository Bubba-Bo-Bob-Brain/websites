const ChampagneBubbles = {
  canvas: null,
  ctx: null,
  bubbles: [],
  maxBubbles: 60,
  animationId: null,

  init() {
    this.canvas = document.getElementById("champagne-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    this.createInitialBubbles();
    this.animate();
    window.addEventListener("resize", () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createBubble(startFromBottom) {
    const x = Math.random() * this.canvas.width;
    const startY = startFromBottom
      ? this.canvas.height + 20
      : Math.random() * this.canvas.height;
    return {
      x: x,
      y: startY,
      originX: x,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 0.6 + 0.2,
      drift: Math.random() * 0.8 + 0.3,
      driftOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.4 + 0.1,
      wobbleSpeed: Math.random() * 0.003 + 0.001,
      phase: 0,
    };
  },

  createInitialBubbles() {
    for (let i = 0; i < this.maxBubbles; i++) {
      this.bubbles.push(this.createBubble(false));
    }
  },

  updateBubble(bubble) {
    bubble.phase += bubble.wobbleSpeed;
    bubble.y -= bubble.speed;
    bubble.x =
      bubble.originX +
      Math.sin(bubble.phase + bubble.driftOffset) * bubble.drift * 30;

    const fadeZone = this.canvas.height * 0.15;
    if (bubble.y < fadeZone) {
      bubble.opacity = Math.max(0, bubble.opacity - 0.003);
    }

    if (bubble.y < -20 || bubble.opacity <= 0) {
      return this.createBubble(true);
    }
    return bubble;
  },

  drawBubble(bubble) {
    if (bubble.opacity <= 0 || bubble.radius <= 0) return;

    const gradient = this.ctx.createRadialGradient(
      bubble.x - bubble.radius * 0.3,
      bubble.y - bubble.radius * 0.3,
      0,
      bubble.x,
      bubble.y,
      bubble.radius
    );

    gradient.addColorStop(0, `rgba(240, 216, 117, ${bubble.opacity * 1.5})`);
    gradient.addColorStop(0.4, `rgba(212, 175, 55, ${bubble.opacity})`);
    gradient.addColorStop(1, `rgba(184, 148, 46, ${bubble.opacity * 0.3})`);

    this.ctx.beginPath();
    this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(
      bubble.x - bubble.radius * 0.25,
      bubble.y - bubble.radius * 0.25,
      bubble.radius * 0.3,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = `rgba(255, 250, 230, ${bubble.opacity * 0.6})`;
    this.ctx.fill();
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bubbles = this.bubbles.map((b) => this.updateBubble(b));
    this.bubbles.forEach((b) => this.drawBubble(b));
    this.animationId = requestAnimationFrame(() => this.animate());
  },

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  },
};

const MastheadReveal = {
  init() {
    const letters = document.querySelectorAll(".masthead-letter");
    if (!letters.length) return;

    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add("revealed");
      }, 200 + index * 100);
    });
  },
};

const ParallaxController = {
  elements: [],
  ticking: false,

  init() {
    this.elements = document.querySelectorAll("[data-speed]");
    if (!this.elements.length) return;

    window.addEventListener("scroll", () => this.onScroll(), { passive: true });
    this.update();
  },

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  },

  update() {
    const scrollY = window.pageYOffset;
    this.elements.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0;
      const rect = el.parentElement
        ? el.parentElement.getBoundingClientRect()
        : el.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) {
        const yOffset = scrollY * speed;
        el.style.transform = `translateY(${yOffset}px)`;
      }
    });
  },
};

const ScrollReveal = {
  observer: null,

  init() {
    const revealTargets = document.querySelectorAll(
      [
        ".lead-feature",
        ".column",
        ".feature-article-secondary",
        ".feature-article-tertiary",
        ".ad-card",
        ".gallery-item",
        ".editors-frame",
        ".columns-header",
        ".gallery-header",
        ".article-pullquote",
        ".article-figure",
      ].join(",")
    );

    revealTargets.forEach((el) => {
      el.classList.add("reveal-on-scroll");
    });

    const options = {
      root: null,
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    revealTargets.forEach((el) => {
      this.observer.observe(el);
    });
  },
};

const NavigationHighlight = {
  sections: [],
  navLinks: [],
  observer: null,

  init() {
    this.navLinks = document.querySelectorAll(".nav-link");
    this.sections = document.querySelectorAll(
      "#society, #culture, #arts, #fashion, #nightlife, #travel"
    );

    if (!this.sections.length || !this.navLinks.length) return;

    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          this.setActive(id);
        }
      });
    }, options);

    this.sections.forEach((section) => {
      this.observer.observe(section);
    });
  },

  setActive(activeId) {
    this.navLinks.forEach((link) => {
      const href = link.getAttribute("href").replace("#", "");
      if (href === activeId) {
        link.style.color = "var(--gold-bright)";
      } else {
        link.style.color = "";
      }
    });
  },
};

const SmoothScroll = {
  init() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector(".main-nav")
            ? document.querySelector(".main-nav").offsetHeight
            : 0;
          const targetTop =
            target.getBoundingClientRect().top + window.pageYOffset - navHeight;

          window.scrollTo({
            top: targetTop,
            behavior: "smooth",
          });
        }
      });
    });
  },
};

const HeroScrollIndicator = {
  init() {
    const indicator = document.querySelector(".hero-scroll-indicator");
    if (!indicator) return;

    window.addEventListener(
      "scroll",
      () => {
        if (window.pageYOffset > 100) {
          indicator.style.opacity = "0";
          indicator.style.transition = "opacity 0.5s ease";
        } else {
          indicator.style.opacity = "1";
        }
      },
      { passive: true }
    );
  },
};

const AdCardInteraction = {
  init() {
    const adCards = document.querySelectorAll(".ad-card");
    if (!adCards.length) return;

    adCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = "transform 0.4s ease";
        setTimeout(() => {
          card.style.transition = "";
        }, 400);
      });
    });
  },
};

const GalleryItemInteraction = {
  init() {
    const galleryItems = document.querySelectorAll(".gallery-frame");
    if (!galleryItems.length) return;

    galleryItems.forEach((frame) => {
      frame.addEventListener("mouseenter", () => {
        const pattern = frame.querySelector(".placeholder-pattern");
        if (pattern) {
          pattern.style.opacity = "0.15";
          pattern.style.transition = "opacity 0.4s ease";
        }
      });

      frame.addEventListener("mouseleave", () => {
        const pattern = frame.querySelector(".placeholder-pattern");
        if (pattern) {
          pattern.style.opacity = "0.08";
        }
      });
    });
  },
};

const PullQuoteInteraction = {
  init() {
    const pullquotes = document.querySelectorAll(".article-pullquote");
    if (!pullquotes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.borderLeftColor = "var(--gold-primary)";
            entry.target.style.borderRightColor = "var(--gold-primary)";
            entry.target.style.transition = "border-color 1s ease";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    pullquotes.forEach((pq) => observer.observe(pq));
  },
};

const DynamicGoldShimmer = {
  init() {
    const shimmerElements = document.querySelectorAll(
      ".drop-cap, .illuminated-cap, .columns-title, .gallery-title, .editors-title, .footer-title"
    );

    if (!shimmerElements.length) return;

    shimmerElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        el.style.animationDuration = "1.5s";
      });
      el.addEventListener("mouseleave", () => {
        el.style.animationDuration = "6s";
      });
    });
  },
};

const NavigationBackground = {
  init() {
    const nav = document.querySelector(".main-nav");
    if (!nav) return;

    window.addEventListener(
      "scroll",
      () => {
        if (window.pageYOffset > 200) {
          nav.style.backgroundColor = "rgba(26, 26, 26, 0.95)";
          nav.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.3)";
        } else {
          nav.style.backgroundColor = "";
          nav.style.boxShadow = "";
        }
      },
      { passive: true }
    );
  },
};

const ReducedMotionHandler = {
  init() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (prefersReducedMotion.matches) {
      ChampagneBubbles.destroy();

      const animatedElements = document.querySelectorAll(
        "[style*='animation'], .reveal-on-scroll"
      );
      animatedElements.forEach((el) => {
        el.style.animation = "none";
        el.style.opacity = "1";
        el.style.transform = "none";
      });

      const letters = document.querySelectorAll(".masthead-letter");
      letters.forEach((letter) => {
        letter.classList.add("revealed");
      });
    }

    prefersReducedMotion.addEventListener("change", (e) => {
      if (e.matches) {
        ChampagneBubbles.destroy();
      } else {
        ChampagneBubbles.init();
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  ChampagneBubbles.init();
  MastheadReveal.init();
  ParallaxController.init();
  ScrollReveal.init();
  NavigationHighlight.init();
  SmoothScroll.init();
  HeroScrollIndicator.init();
  AdCardInteraction.init();
  GalleryItemInteraction.init();
  PullQuoteInteraction.init();
  DynamicGoldShimmer.init();
  NavigationBackground.init();
  ReducedMotionHandler.init();
});